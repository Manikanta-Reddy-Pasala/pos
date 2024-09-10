import React from 'react';
const numberToText = require('number-to-text');
require('number-to-text/converters/en-us'); // load converter

const getFloatWithTwoDecimal = (val) => {
  return parseFloat(val).toFixed(2);
};

let totalNonServed = 0;

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

const getInvoiceRows = (data, _data, totalqty) => {
  itemsTableContent = [];
  totalNonServed = 0;
  return _data.items.forEach((item, index) => {
    if (!item.served) {
      totalNonServed += 1;
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

      const offer_price =
        item.offer_price === '' || isNaN(item.offer_price)
          ? item.mrp
          : item.offer_price;

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

      const discount = qty * (item.mrp - offer_price);
      data.totalDiscount += discount;

      // if(itemsTableContent.length === 0){
      let innerArray = [];
      innerArray.push(item.item_name);
      innerArray.push(item.qty);
      itemsTableContent.push(innerArray);
    }
  });
};

const getGSTRows = (_data, gstMap) => {
  if (_data.items) {
    _data.items.forEach((item) => {
      if (!item) {
        return;
      }
      const mrp = parseFloat(item.mrp).toFixed(2);
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
            gstMap.get(cgstKey) + (item.cgst * tempMRP * qty) / 100
          );
        } else {
          gstMap.set(cgstKey, (item.cgst * tempMRP * qty) / 100);
        }
      }
      if (item.sgst && item.sgst > 0) {
        const sgstKey = `SGST@${item.sgst}%`;
        if (gstMap.has(sgstKey)) {
          gstMap.set(
            sgstKey,
            gstMap.get(sgstKey) + (item.sgst * tempMRP * qty) / 100
          );
        } else {
          gstMap.set(sgstKey, (item.sgst * tempMRP * qty) / 100);
        }
      }
    });
  }
}; //font-family: "Myriad Pro", Myriad, "Liberation Sans", "Nimbus Sans L", "Helvetica Neue", Helvetica, Arial, sans-serif;

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
      'margin-top:10px; font-size: 13px; font-family: sans-serif',
    // custom style for the table body
    tableBodyStyle:
      'margin-top: 10px; font-size: 11px; font-family: sans-serif',
    // custom style for the table footer
    tableFooterStyle:
      'margin-top:20px; font-size: 13px; font-family: sans-serif'
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

export const KOTInvoiceThermalPrintContent = (settings, content) => {
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

  if (settings && content) {
    _data = content;
    mapPrintableData(data, _data);
    getGSTRows(_data, gstMap);
  }

  const printContent = () => {
    appendRow(
      'text',
      _data.date ? 'Credit Note' : 'Invoice',
      'text-align:center; margin-top:10px;',
      {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'sans-serif'
      }
    );

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
          'font-family': 'sans-serif'
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
          'font-family': 'sans-serif'
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
          'font-family': 'sans-serif'
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
          'font-family': 'sans-serif'
        }
      );
    }

    // appendRow(
    //   'text',
    //   'Inv No: ' + _data.invoice_number + ' ',
    //   'text-align:right;margin-right: 15px;',
    //   {
    //     'font-kerning': 'normal',
    //     'font-weight': '500',
    //     'font-style': 'normal',
    //     'font-size': '13px',
    //     'font-family': 'sans-serif'
    //   }
    // );

    appendRow(
      'text',
      'Date: ' + dateFormatter(_data.invoice_date),
      'text-align:right;margin-right: 15px;',
      {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'sans-serif'
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
        'font-family': 'sans-serif'
      }
    );

    const tableHeader = ['Name', 'Qty'];

    getInvoiceRows(data, _data, totalqty); // printing items
    console.log(itemsTableContent);

    appendTable(
      tableHeader,
      itemsTableContent,
      '',
      'margin-top:10px;margin-right: 15px;margin-left: 0px; font-weight: bold;'
    );

    appendRow(
      'text',
      'Total items to Serve: ' + totalNonServed,
      'text-align:left; margin-left:5px;margin-top:5px',
      {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '13px',
        'font-family': 'sans-serif'
      }
    );
  };

  appendRow('text', '', 'margin-bottom:40px;', {});

  printContent();

  return contentBuilder;
};