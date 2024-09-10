import React from 'react';
const numberToText = require('number-to-text');
require('number-to-text/converters/en-us'); // load converter

const getFloatWithTwoDecimal = (val) => {
  return parseFloat(val).toFixed(2);
};

const mapPrintableData = (data, _data) => {
  let name = '';
  let phNo = '';
  if (_data.invoice_number) {
    data.invoiceNumber = _data.invoice_number;
    data.billTitle = 'Bill To';
    data.paidReceivedTitle = 'Received';
    name = _data.customer_name ? _data.customer_name : 'NA';
    phNo = _data.customer_phoneNo;
  }

  data.customer_name = name;
  data.customer_phoneNo = phNo;
  data.date = _data.invoice_date;

  data.strTotal = numberToText.convertToText(_data.total_amount);

  data.totalDiscount = _data.discount_amount;
  data.totalAmount = _data.total_amount ? _data.total_amount : 0;
  if (data.totalAmount === 0) {
    data.totalAmount = _data.totalAmount ? _data.totalAmount : 0;
  }
  data.paymentMode = _data.payment_type ? _data.payment_type : 'NA';
  data.bankPaymentType = _data.bankPaymentType;
};

function dateFormatter(date) {
  var dateParts = date.split('-');
  if (dateParts.length >= 3) {
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }
}

const getInvoiceRows = (
  data,
  _data,
  totalqty,
  totaltax_gst,
  TxnEnableFieldsMap
) => {
  itemsTableContent = [];
  return _data.items.forEach((item, index) => {
    let mrp = 0;
    var finalMRP = 0;
    if (_data.sales_return_number || _data.invoice_number) {
      mrp = parseFloat(item.mrp).toFixed(2);
    } else if (_data.purchase_return_number || _data.bill_number) {
      finalMRP = parseFloat(item.purchased_price).toFixed(2);
      mrp = parseFloat(item.purchased_price).toFixed(2);
    }
    let offerPrice = parseFloat(item.offer_price).toFixed(2);
    if (isNaN(offerPrice)) {
      offerPrice = mrp;
    }
    const cgstPercent = parseFloat(item.cgst);
    const sgstPercent = parseFloat(item.sgst);
    const igstPercent = parseFloat(item.igst);

    const qty = parseFloat(item.qty);

    let totalGST = 0;
    let tempMrp = mrp;

    if (cgstPercent) {
      totalGST += parseFloat(item.cgst_amount);
    }
    if (sgstPercent) {
      totalGST += parseFloat(item.sgst_amount);
    }

    if (igstPercent) {
      totalGST += parseFloat(item.igst_amount);
    }

    if (offerPrice < mrp && offerPrice !== 0) {
      tempMrp = offerPrice;
    }

    totaltax_gst += totalGST;
    const offer_price =
      item.offer_price === '' || isNaN(item.offer_price)
        ? item.mrp || 0
        : item.offer_price || 0;

    if (_data.sales_return_number || _data.invoice_number) {
      var finalMRP =
        offer_price !== 0
          ? item.mrp > offer_price
            ? offer_price
            : item.mrp
          : item.mrp;
    }

    totalqty += parseFloat(item.qty);
    data.totalGST += getFloatWithTwoDecimal(totalGST);
    data.subTotal += item.amount;

    if (item.discount_amount > 0) {
      data.totalDiscount += item.discount_amount;
    }

    let totalMrp = qty * parseFloat(mrp);

    if (item.taxIncluded) {
      item.taxableAmount = totalMrp - item.discount_amount - totalGST;
    } else {
      item.taxableAmount = totalMrp - item.discount_amount;
    }

    let innerArray = [];

    innerArray.push(item.item_name);

    if (TxnEnableFieldsMap && TxnEnableFieldsMap.get('display_hsn')) {
      innerArray.push(item.hsn ? item.hsn : '');
    }

    innerArray.push('<center>' + item.qty + '</center>');

    innerArray.push(mrp);

    if (
      TxnEnableFieldsMap &&
      TxnEnableFieldsMap.get('display_product_discount')
    ) {
      innerArray.push('<center>' + item.discount_amount + '</center>');
    }

    innerArray.push(getFloatWithTwoDecimal(item.taxableAmount));
    itemsTableContent.push(innerArray);
  });
};

const getGSTRows = (_data, gstMap) => {
  if (_data.items) {
    _data.items.forEach((item) => {
      if (!item) {
        return;
      }
      let mrp = 0;
      mrp = parseFloat(item.mrp).toFixed(2);

      const offerPrice = parseFloat(item.offer_price).toFixed(2);
      const qty = parseFloat(item.qty);
      let tempMRP = mrp;
      if (offerPrice < mrp && offerPrice !== 0) {
        tempMRP = offerPrice;
      }
      if (item.cgst && item.cgst > 0) {
        const cgstKey = `CGST@${item.cgst}%`;
        if (gstMap.has(cgstKey)) {
          gstMap.set(
            cgstKey,
            gstMap.get(cgstKey) + parseFloat(item.cgst_amount)
          );
        } else {
          gstMap.set(cgstKey, parseFloat(item.cgst_amount));
        }
      }
      if (item.sgst && item.sgst > 0) {
        const sgstKey = `SGST@${item.sgst}%`;
        if (gstMap.has(sgstKey)) {
          gstMap.set(
            sgstKey,
            gstMap.get(sgstKey) + parseFloat(item.sgst_amount)
          );
        } else {
          gstMap.set(sgstKey, parseFloat(item.sgst_amount));
        }
      }
      if (item.igst && item.igst > 0) {
        const igstKey = `IGST@${item.igst}%`;
        if (gstMap.has(igstKey)) {
          gstMap.set(
            igstKey,
            gstMap.get(igstKey) + parseFloat(item.igst_amount)
          );
        } else {
          gstMap.set(igstKey, parseFloat(item.igst_amount));
        }
      }
    });
  }
}; //font-family: "Myriad Pro", Myriad, "Liberation Sans", "Nimbus Sans L", "Helvetica Neue", Helvetica, Arial, Roboto condensed;

let contentBuilder = [];
let itemsTableContent = [];
let discountsTableContent = [];
const appendRow = (type, value, style, css = {}) => {
  contentBuilder.push({
    type: type, // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: value,
    style: style,
    css: css
  });
};
const appendTable = (tableHeader, tableBody, tableFooter, style) => {
  contentBuilder.push({
    type: 'table',
    style: style,
    tableHeader: tableHeader,
    tableBody: tableBody,
    tableFooter: tableFooter,
    tableHeaderStyle:
      'margin-top:10px; font-size: 13px; font-family: Roboto condensed',
    // custom style for the table body
    tableBodyStyle:
      'margin-top: 10px; font-size: 11px; font-family: Roboto condensed',
    // custom style for the table footer
    tableFooterStyle:
      'margin-top:20px; font-size: 13px; font-family: Roboto condensed'
  });
};

const appendTableRow = (tableBody, style) => {
  contentBuilder.push({
    type: 'table',
    style: style,
    tableBody: tableBody,
    // custom style for the table body
    tableBodyStyle: 'margin-top: 10px;'
  });
};

function getTimefromTimeStamp(date) {
  var datefromTimeStamp = Date(date);
  var timefromTimeStamp = new Date(datefromTimeStamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: 'true'
  });
  /* console.log('Inside get Time' + timefromTimeStamp);  */
  return `${timefromTimeStamp}`;
}

function getInvoiceNumber(_data) {
  return _data.sequenceNumber !== null && _data.sequenceNumber !== ''
    ? _data.sequenceNumber
    : _data.invoice_number;
}

export const KOTFullBillThermalPrintContent = (
  settings,
  content,
  txnSetting
) => {
  contentBuilder = [];
  itemsTableContent = [];
  let _data = {};
  const data = {
    customer_name: '',
    customer_address: '',
    customer_phoneNo: '',
    cusstomer_pincode: '',
    customer_city: '',
    customer_emailId: '',
    invoiceNumber: '',
    date: '',
    subTotal: 0,
    totalAmount: '',
    totalDiscount: 0,
    strTotal: '',
    receivedAmount: '',
    balanceAmount: '',
    paymentMode: '',
    invoiceTitle: '',
    invoiceDisplayName: '',
    paidReceivedTitle: '',
    totalGST: 0
  };

  let totalqty = 0;
  const gstMap = new Map();
  let totaltax_gst = 0;
  let TxnSettings = {};

  const TxnEnableFieldsMap = new Map();

  if (txnSetting) {
    TxnSettings = txnSetting;

    if (TxnSettings && TxnSettings.displayOnBill) {
      const productLevel = TxnSettings.displayOnBill.productLevel;
      productLevel.map((item) => {
        if (TxnEnableFieldsMap.has(item.name)) {
          TxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          TxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      const billLevel = TxnSettings.displayOnBill.billLevel;
      billLevel.map((item) => {
        if (TxnEnableFieldsMap.has(item.name)) {
          TxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          TxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });
    }
  }

  if (settings && content) {
    _data = content;
    mapPrintableData(data, _data);
    getGSTRows(_data, gstMap);
  }

  const printContent = () => {
    if (settings.boolCompanyName) {
      appendRow('text', settings.strCompanyName, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': 'bold',
        'font-style': 'normal',
        'font-size': '1em',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolAddress) {
      appendRow('text', settings.strAddress, 'text-align:center;', {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolEmail) {
      appendRow('text', settings.strEmail, 'text-align:center;', {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolPhone) {
      appendRow('text', settings.strPhone, 'text-align:center;', {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolWebsite) {
      appendRow('text', settings.strWebsite, 'text-align:center;', {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolGSTIN) {
      appendRow('text', 'GSTIN:' + settings.strGSTIN, 'text-align:center;', {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolPAN) {
      appendRow('text', 'PAN:' + settings.strPAN, 'text-align:center;', {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      });
    }

    appendRow('text', 'Tax Invoice', 'text-align:center; margin-top:10px;', {
      'font-kerning': 'normal',
      'font-weight': 'bold',
      'font-style': 'normal',
      'font-size': '1.2em',
      'font-family': 'Roboto condensed'
    });

    appendRow(
      'text',
      data.billTitle + ': ',
      'text-align:left; margin-left:5px;margin-top:10px;',
      {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      }
    );
    appendRow('text', data.customer_name, 'text-align:left; margin-left:5px;', {
      'font-kerning': 'normal',

      'font-style': 'normal',
      'font-size': '13px',
      'font-family': 'Roboto condensed'
    });

    // if (data.customer_address) {
    //   appendRow('text', data.customer_address, 'text-align:left; margin-left:0px;', {"font-kerning": "normal", "font-weight": "lighter","font-style": "normal", "font-size": "10px", "font-family": "Roboto condensed"});
    // }

    if (data.customer_phoneNo) {
      appendRow(
        'text',
        'Phone No: ' + data.customer_phoneNo,
        'text-align:left; margin-left:5px;',
        {
          'font-kerning': 'normal',

          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (_data.tableNumber) {
      appendRow(
        'text',
        'Table No: ' + _data.tableNumber + ' ',
        'text-align:right; margin-top:10px;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '500',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (_data.chairsUsedInString) {
      appendRow(
        'text',
        'Chair No: ' + _data.chairsUsedInString + ' ',
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '500',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (_data.numberOfPax > 0) {
      appendRow(
        'text',
        'No of Pax: ' + _data.numberOfPax + ' ',
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '500',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (_data.waiter_name) {
      appendRow(
        'text',
        'Waiter: ' + _data.waiter_name + ' ',
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '500',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (_data.sequenceNumber !== null && _data.sequenceNumber !== '') {
      appendRow(
        'text',
        'Inv No: ' + _data.sequenceNumber + ' ',
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '500',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    appendRow(
      'text',
      'Date: ' + dateFormatter(_data.invoice_date),
      'text-align:right;margin-right: 15px;',
      {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      }
    );

    appendRow(
      'text',
      'Time: ' + getTimefromTimeStamp(_data.updatedAt),
      'text-align:right;margin-right: 15px;',
      {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      }
    );

    let tableHeader = [];
    if (
      TxnEnableFieldsMap &&
      TxnEnableFieldsMap.get('display_hsn') &&
      TxnEnableFieldsMap.get('display_product_discount')
    ) {
      tableHeader = ['Name', 'Hsn', 'Qty', 'Mrp', 'Disc.', 'Total'];
    } else if (
      TxnEnableFieldsMap &&
      TxnEnableFieldsMap.get('display_hsn') &&
      !TxnEnableFieldsMap.get('display_product_discount')
    ) {
      tableHeader = ['Name', 'Hsn', 'Qty', 'Mrp', 'Total'];
    } else if (
      TxnEnableFieldsMap &&
      !TxnEnableFieldsMap.get('display_hsn') &&
      TxnEnableFieldsMap.get('display_product_discount')
    ) {
      tableHeader = ['Name', 'Qty', 'Mrp', 'Disc.', 'Total'];
    } else {
      tableHeader = ['Name', 'Qty', 'Mrp', 'Total'];
    }

    getInvoiceRows(data, _data, totalqty, totaltax_gst, TxnEnableFieldsMap); // printing items

    appendTable(
      tableHeader,
      itemsTableContent,
      '',
      'margin-top:10px;margin-right: 15px;margin-left: 0px; font-weight: bold;'
    );

    appendRow(
      'text',
      'Total Items: ' + _data.items.length,
      'text-align:left; margin-left:5px;margin-top:5px',
      {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      }
    );

    appendRow(
      'text',
      'Sub Total: ₹' + getFloatWithTwoDecimal(data.subTotal - totaltax_gst),
      'text-align:right; margin-top:10px;margin-right: 15px;',
      {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'Roboto condensed'
      }
    );

    if (TxnEnableFieldsMap.get('display_bill_packing_charge')) {
      appendRow(
        'text',
        'Package Charge: ₹' + _data.packing_charge,
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (TxnEnableFieldsMap.get('display_bill_shipping_charge')) {
      appendRow(
        'text',
        'Shipping Charge: ₹' + _data.shipping_charge,
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (data.totalDiscount > 0) {
      appendRow(
        'text',
        'Discount: ₹' + data.totalDiscount,
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (settings.boolTaxDetails) {
      Array.from(gstMap.keys()).map((key) => {
        appendRow(
          'text',
          key + ' ₹' + getFloatWithTwoDecimal(gstMap.get(key)),
          'text-align:right;margin-right: 15px;',
          {
            'font-kerning': 'normal',
            'font-weight': '400',
            'font-style': 'normal',
            'font-size': '13px',
            'font-family': 'Roboto condensed'
          }
        );
      });
    }

    if (_data.round_amount > 0) {
      appendRow(
        'text',
        'Round Off: ₹' + getFloatWithTwoDecimal(_data.round_amount),
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '12px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    appendRow(
      'text',
      'Total: ₹' + getFloatWithTwoDecimal(data.totalAmount),
      'text-align:right; margin-bottom:10px;margin-right: 15px;',
      {
        'font-kerning': 'normal',
        'font-weight': 'bold',
        'font-style': 'normal',
        'font-size': '400',
        'font-family': 'Roboto condensed'
      }
    );
    if (settings.boolPaymentMode) {
      if (data.paymentMode === 'cash') {
        appendRow(
          'text',
          'Payment Mode: Cash',
          'text-align:right; margin-bottom:10px;margin-right: 15px;',
          {
            'font-kerning': 'normal',
            'font-weight': '400',
            'font-style': 'normal',
            'font-size': '12px',
            'font-family': 'Roboto condensed'
          }
        );
      } else {
        appendRow(
          'text',
          'Payment Mode: ' + data.paymentMode,
          'text-align:right; margin-bottom:10px;margin-right: 15px;',
          {
            'font-kerning': 'normal',
            'font-weight': '400',
            'font-style': 'normal',
            'font-size': '12px',
            'font-family': 'Roboto condensed'
          }
        );
      }
    }

    if (settings.boolBankDetail) {
      appendRow(
        'text',
        'BANK DETAILS',
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
      appendRow(
        'text',
        'Bank Name: ' + settings.bankName,
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
      appendRow(
        'text',
        'Acc No: ' + settings.bankAccountNumber,
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
      appendRow(
        'text',
        'IFSC Code: ' + settings.bankIfscCode,
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '13px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (settings.boolTerms) {
      appendRow(
        'text',
        settings.strTerms,
        'margin-top:10px;text-align:center;margin-bottom:10px;white-space: break-spaces;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '12px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    appendRow('text', '', 'margin-bottom:40px;', {});
  };

  printContent();

  return contentBuilder;
};