import { date } from 'yup';
import { inWords } from '../../../components/NumbertoWord';
import { ToWords } from 'to-words';

const numberToText = require('number-to-text');
require('number-to-text/converters/en-in'); // load converter

const toWords = new ToWords({
  localeCode: 'en-IN',
  converterOptions: {
    currency: true,
    ignoreDecimal: false,
    ignoreZeroCurrency: false,
    doNotAddOnly: false,
    currencyOptions: {
      // can be used to override defaults for the selected locale
      name: 'Rupee',
      plural: 'Rupees',
      symbol: '₹',
      fractionalUnit: {
        name: 'Paisa',
        plural: 'Paise',
        symbol: ''
      }
    }
  }
});

let isTemple = localStorage.getItem('isTemple')
  ? localStorage.getItem('isTemple') === 'true'
  : false;

const getFloatWithTwoDecimal = (val) => {
  return parseFloat(val).toFixed(2);
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

const mapPrintableData = (data, _data, screenName, TxnSettings) => {
  if (_data.estimateType === 'open' || _data.estimateType === 'close') {
    data.invoiceNumber = _data.sequenceNumber;
    data.billTitle = 'Bill To';
    data.paidReceivedTitle = 'Received';
    data.receivedAmount = _data.received_amount;
    data.customer_name = _data.customer_name ? _data.customer_name : 'NA';
    data.customer_phoneNo = _data.customer_phoneNo
      ? _data.customer_phoneNo
      : 'NA';
    data.invoiceNoTitle = 'No';
    data.mainTitle = 'Sale Quotation';
  } else if (_data.job_work_in_invoice_number) {
    data.invoiceNumber = _data.sequenceNumber;
    data.billTitle = 'Bill To';
    data.paidReceivedTitle = 'Received';
    data.receivedAmount = _data.received_amount;
    data.customer_name = _data.customer_name ? _data.customer_name : 'NA';
    data.customer_phoneNo = _data.customer_phoneNo
      ? _data.customer_phoneNo
      : 'NA';
    data.invoiceNoTitle = 'No';
    data.mainTitle = 'Job Work - In Bill';
  } else if (_data.sales_return_number) {
    data.invoiceNumber = _data.sequenceNumber;
    data.billTitle = 'Return From';
    data.paidReceivedTitle = 'Paid';
    data.receivedAmount = _data.paid_amount || _data.linked_amount;
    data.customer_name = _data.customer_name ? _data.customer_name : 'NA';
    data.customer_phoneNo = _data.customer_phoneNo
      ? _data.customer_phoneNo
      : 'NA';
    data.invoiceNoTitle = 'Return No';
    data.mainTitle = 'Credit Note - Sales Return';
    data.date = _data.invoice_date;
  } else if (_data.invoice_number) {
    data.invoiceNumber = _data.sequenceNumber;
    data.billTitle = 'Bill To';
    data.paidReceivedTitle = 'Received';
    data.receivedAmount = _data.received_amount;
    data.customer_name = _data.customer_name ? _data.customer_name : 'NA';
    data.customer_phoneNo = _data.customer_phoneNo
      ? _data.customer_phoneNo
      : 'NA';
    data.invoiceNoTitle = 'No';
    data.date = _data.invoice_date;
    data.mainTitle = 'Tax Invoice';
  } else if (_data.purchase_return_number) {
    data.invoiceNumber = _data.vendor_bill_number;
    data.billTitle = 'Return To';
    data.paidReceivedTitle = 'Received';
    data.receivedAmount = _data.received_amount || _data.linked_amount;
    data.customer_name = _data.vendor_name ? _data.vendor_name : 'NA';
    data.customer_phoneNo = _data.vendor_phone_number
      ? _data.vendor_phone_number
      : 'NA';
    data.invoiceNoTitle = 'Return No';
    data.mainTitle = 'Debit Note - Purchase Return';
    data.date = _data.date;
  } else if (_data.bill_number) {
    data.invoiceNumber = _data.vendor_bill_number;
    data.billTitle = 'Bill From';
    data.paidReceivedTitle = 'Paid';
    data.customer_name = _data.vendor_name ? _data.vendor_name : 'NA';
    data.customer_phoneNo = _data.vendor_phone_number
      ? _data.vendor_phone_number
      : 'NA';
    data.receivedAmount = _data.paid_amount;
    data.invoiceNoTitle = 'Bill No';
    data.mainTitle = 'Purchase Bill';
    data.date = _data.bill_date;
  } else if (_data.sale_order_invoice_number) {
    data.invoiceNumber = _data.sequenceNumber;
    data.billTitle = 'Bill To';
    data.paidReceivedTitle = 'Received';
    data.invoiceNoTitle = 'SO No.';
    data.mainTitle = 'Sale Order';
    data.notes = _data.notes;
    data.date = _data.invoice_date ? _data.invoice_date : '';
    data.duedate = _data.due_date ? _data.due_date : '';
  } else if (_data.delivery_challan_invoice_number) {
    data.mainTitle = 'Delivery Challan';
    data.billTitle = 'Ship To';
    data.invoiceNoTitle = 'DC No.';
    data.invoiceNumber = _data.sequenceNumber;
    data.date = _data.invoice_date ? _data.invoice_date : '';
    data.duedate = _data.due_date ? _data.due_date : '';

    if (_data.customerShippingData) {
      data.billTo =
        '<strong>' +
        (_data.customerShippingData.customer_name
          ? _data.customerShippingData.customer_name
          : ' ') +
        '</strong><br/>' +
        (_data.customerShippingData.customer_phoneNo
          ? _data.customerShippingData.customer_phoneNo + '<br/>'
          : ' ');
    } else {
      data.billTo = '';
    }
  }
  if (screenName && screenName === 'Sales') {
    data.isSale = true;
    data.invoiceNumber = _data.sequenceNumber;
    data.billTitle = 'Bill To';
    data.paidReceivedTitle = 'Received';
    data.receivedAmount = _data.linked_amount;
    data.invoiceNoTitle = 'No';
    data.salesEmployeeName = _data.salesEmployeeName
      ? _data.salesEmployeeName
      : 'NA';
    // customer Data
    data.customer_name = _data.customer_name ? _data.customer_name : 'NA';
    data.customer_phoneNo = _data.customer_phoneNo
      ? _data.customer_phoneNo
      : '';
    data.customer_address = _data.customer_address
      ? _data.customer_address
      : '';
    /* data.tgstn = _data.customerGSTNo ? 'GSTIN: ' + _data.customerGSTNo : ''; */
    data.mainTitle = 'Tax Invoice';
    if (
      TxnSettings &&
      TxnSettings.billTitle !== null &&
      TxnSettings.billTitle !== undefined &&
      TxnSettings.billTitle !== ''
    ) {
      data.mainTitle = TxnSettings.billTitle;
    } else if (
      _data.templeBillType !== '' &&
      _data.templeBillType !== undefined &&
      _data.templeBillType !== null
    ) {
      data.mainTitle = _data.templeBillType;
    } else if (_data.balance_amount > 0) {
      data.mainTitle = 'Credit - Tax Invoice';
    }
  } else if (screenName && screenName === 'Sales Return') {
    data.invoiceNumber = _data.sequenceNumber;
    data.billTitle = 'Return From';
    data.paidReceivedTitle = 'Paid';
    data.receivedAmount = _data.linked_amount;
    data.invoiceNoTitle = 'Return No';
    data.mainTitle = 'Credit Note - Sales Return';
    data.notes = _data.notes;

    // customer Data
    data.customer_name = _data.customer_name ? _data.customer_name : 'NA';
    data.customer_phoneNo = _data.customer_phoneNo
      ? _data.customer_phoneNo
      : '';
    data.customer_address = _data.customer_address
      ? _data.customer_address
      : '';
    /* data.tgstn = _data.customerGSTNo ? 'GSTIN: ' + _data.customerGSTNo : ''; */
  } else if (screenName && screenName === 'Sales Quotation') {
    data.invoiceNumber = _data.sequenceNumber;
    data.billTitle = 'Bill To';
    data.paidReceivedTitle = 'Received';
    data.invoiceNoTitle = 'Estimate No';
    data.mainTitle = 'Estimate';
    if (
      TxnSettings &&
      TxnSettings.billTitle !== '' &&
      TxnSettings.billTitle !== null
    ) {
      data.mainTitle = TxnSettings.billTitle;
      data.invoiceNoTitle = TxnSettings.billTitle + ' No';
    }

    data.notes = _data.notes;
    data.date = _data.invoice_date;
    // customer Data
    data.customer_name = _data.customer_name ? _data.customer_name : 'NA';
    data.customer_phoneNo = _data.customer_phoneNo
      ? _data.customer_phoneNo
      : '';
    data.customer_address = _data.customer_address
      ? _data.customer_address
      : '';
    /* data.tgstn = _data.customerGSTNo ? 'GSTIN: ' + _data.customerGSTNo : ''; */
    data.updatedAt = _data.updatedAt;
  } else if (screenName && screenName === 'Sales Order') {
    data.invoiceNumber = _data.sequenceNumber;
    data.billTitle = 'Bill To';
    data.paidReceivedTitle = 'Received';
    data.invoiceNoTitle = 'SO No.';
    data.mainTitle = 'Sale Order';
    data.notes = _data.notes;
    data.date = _data.invoice_date ? _data.invoice_date : '';
    data.duedate = _data.due_date ? _data.due_date : '';
    data.placeOfSupplyName = _data.placeOfSupplyName;
    /* if (data.placeOfSupplyName) {
      let result = getStateList().find(
        (e) => e.name === data.placeOfSupplyName
      );

      if (result) {
        data.placeOfSupplyName = result.code + '-' + data.placeOfSupplyName;
      }
    } */

    // customer Data
    data.customer_name = _data.customer_name ? _data.customer_name : 'NA';
    data.customer_phoneNo = _data.customer_phoneNo
      ? _data.customer_phoneNo
      : '';
    data.customer_address = _data.customer_address
      ? _data.customer_address
      : '';
    /* data.tgstn = _data.customer.gstNumber
        ? 'GSTIN: ' + _data.customer.gstNumber
        : ''; */
  } else if (screenName && screenName === 'Delivery Challan') {
    data.mainTitle = 'Delivery Challan';
    data.billTitle = 'Ship To';
    data.invoiceNoTitle = 'DC No.';
    data.invoiceNumber = _data.sequenceNumber;
    data.date = _data.invoice_date ? _data.invoice_date : '';
    data.duedate = _data.due_date ? _data.due_date : '';

    //Customer Data
    data.customer_name = _data.customerShippingData.customer_name
      ? _data.customerShippingData.customer_name
      : 'NA';
    data.customer_phoneNo = _data.customerShippingData.customer_phoneNo
      ? _data.customerShippingData.customer_phoneNo
      : '';
    data.customer_address = _data.customerShippingData.address
      ? _data.customerShippingData.address
      : '';
  } else if (screenName && screenName === 'Approval') {
    data.billTitle = 'Approval To';
    data.invoiceNoTitle = 'Approval No';
    data.invoiceNumber = _data.sequenceNumber;
    data.customer_name = _data.employeeName ? _data.employeeName : ' ';
    data.customer_phoneNo = _data.employeePhoneNumber
      ? _data.employeePhoneNumber + '<br/>'
      : ' ';
    data.customer_address = 'NA';
    data.date = _data.approvalDate;
  } else if (screenName && screenName === 'Purchase') {
    data.invoiceNumber = _data.vendor_bill_number;
    data.billTitle = 'Bill From';
    data.paidReceivedTitle = 'Paid';
    data.customer_name = _data.vendor_name ? _data.vendor_name : 'NA';
    data.customer_phoneNo = _data.vendor_phone_number
      ? _data.vendor_phone_number
      : 'NA';
    data.customer_address = _data.vendorAddress ? _data.vendorAddress : '';
    data.receivedAmount = _data.paid_amount;
    data.invoiceNoTitle = 'Bill No';
    data.mainTitle = 'Purchase Bill';
    data.date = _data.bill_date;
  } else if (screenName && screenName === 'Purchase Return') {
    data.invoiceNumber = _data.purchaseReturnBillNumber;
    data.billTitle = 'Return To';
    data.paidReceivedTitle = 'Received';
    data.receivedAmount = _data.received_amount || _data.linked_amount;
    data.customer_name = _data.vendor_name ? _data.vendor_name : 'NA';
    data.customer_phoneNo = _data.vendor_phone_number
      ? _data.vendor_phone_number
      : 'NA';
    data.customer_address = _data.vendorAddress ? _data.vendorAddress : 'NA';
    data.invoiceNoTitle = 'Return No';
    data.mainTitle = 'Debit Note - Purchase Return';
    data.date = _data.date;
  } else if (screenName && screenName === 'Purchase Order') {
    data.mainTitle = 'Purchase Order';
    data.billTitle = 'Vendor Details';
    data.invoiceNumber = _data.sequenceNumber;
    data.invoiceNoTitle = 'PO No.';
    data.date = _data.po_date ? _data.po_date : '';
    data.customer_name = _data.vendor_name ? _data.vendor_name : 'NA';
    data.customer_phoneNo = _data.vendor_phone_number
      ? _data.vendor_phone_number
      : 'NA';
    data.customer_address = _data.vendorAddress ? _data.vendorAddress : 'NA';
  } else {
    /* if (!data.billTo){
      data.billTo =
      '<strong>' +
      _data.customer_name ? _data.customer_name : '' +
      '</strong><br/>' +
      (_data.customer_address ? _data.customer_address + '<br/>' : '') +
      (_data.customer_phoneNo ? _data.customer_phoneNo + '<br/>' : '') +
      (_data.cusstomer_pincode ? _data.cusstomer_pincode + '<br/>' : '') +
      (_data.customer_city ? _data.customer_city + '<br/>' : '') +
      (_data.customer_emailId ? _data.customer_emailId : '');
    }; */
    /* data.date =
    _data.invoice_date || _data.date || _data.po_date; */
  }

  data.billTo =
    '<strong>' + data.customer_name + '</strong><br/>' + data.customer_phoneNo;

  data.totalDiscount = _data.discount_amount;
  data.totalAmount = _data.total_amount ? _data.total_amount : 0;
  if (data.totalAmount === 0) {
    data.totalAmount = _data.totalAmount ? _data.totalAmount : 0;
  }

  console.log(data.totalAmount);
  //data.strTotal = inWords(data.totalAmount);
  //const strTotInt = data.totalAmount ? toWords.convert(data.totalAmount) : 'Zero' ;
  const strTotInt = toWords.convert(data.totalAmount);
  data.strTotal = strTotInt;
  data.balanceAmount = _data.balance_amount;
  data.paymentMode = _data.payment_type ? _data.payment_type : 'NA';
  data.bankPaymentType = _data.bankPaymentType;

  console.log('Round off ', _data.round_amount);
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

  let item_list = _data.item_list ? _data.item_list : _data.itemList;
  return item_list.forEach((item, index) => {
    let mrp = 0;
    var finalMRP = 0;
    if (_data.sales_return_number || _data.invoice_number) {
      mrp = parseFloat(item.mrp).toFixed(2);
    } else if (_data.purchase_return_number || _data.bill_number) {
      //finalMRP = parseFloat(item.purchased_price).toFixed(2);
      mrp = parseFloat(item.purchased_price).toFixed(2);
    }
    let offerPrice = parseFloat(item.offer_price).toFixed(2);

    const cgstPercent = parseFloat(item.cgst);
    const sgstPercent = parseFloat(item.sgst);
    const igstPercent = parseFloat(item.igst);
    const cessPercent = parseFloat(item.cess);
    const qty = parseFloat(item.qty);
    let tempMrp = mrp;
    let totalGST = 0;

    if (_data.sales_return_number || _data.invoice_number) {
      if (offerPrice < mrp && offerPrice !== 0) {
        tempMrp = offerPrice;
      }
    }

    data.subTotal += item.amount;

    if (cgstPercent) {
      totalGST += parseFloat(item.cgst_amount);
    }
    if (sgstPercent) {
      totalGST += parseFloat(item.sgst_amount);
    }

    if (igstPercent) {
      totalGST += parseFloat(item.igst_amount);
    }

    totalqty += parseFloat(item.qty);
    data.totalGST += getFloatWithTwoDecimal(totalGST);
    totaltax_gst += totalGST;

    if (item.discount_amount > 0) {
      data.totalDiscount += item.discount_amount;
      data.subTotalDisc += parseFloat(item.discount_amount);
      item.totalDiscount = parseFloat(item.discount_amount);
    }

    let totalMrp = qty * parseFloat(mrp);

    if (item.taxIncluded) {
      item.taxableAmount = totalMrp - item.discount_amount - totalGST;
      data.totalTaxableAmount += item.taxableAmount;
    } else {
      item.taxableAmount = totalMrp - item.discount_amount;
      data.totalTaxableAmount += item.taxableAmount;
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

    innerArray.push(getFloatWithTwoDecimal(totalMrp));
    itemsTableContent.push(innerArray);
  });
};

const getaddNBillColContent = (data, displayTime, displaySalesMan) => {
  addNBillColContent = [];
  let innerArray = [];
  innerArray.push(data.billTo);

  if (displayTime) {
    innerArray.push(
      data.invoiceNoTitle +
        ': ' +
        data.invoiceNumber +
        '</Br>' +
        'Date: ' +
        dateFormatter(data.date) +
        '</Br>' +
        'Time : ' +
        getTimefromTimeStamp(data.updatedAt) +
        '</Br>Sales By: ' +
        data.salesEmployeeName
    );
  } else {
    innerArray.push(
      data.invoiceNoTitle +
        ': ' +
        data.invoiceNumber +
        '</Br>' +
        'Date: ' +
        dateFormatter(data.date) +
        '</Br>Sales By: ' +
        data.salesEmployeeName
    );
  }
  addNBillColContent.push(innerArray);
};

const getGSTRows = (_data, gstMap) => {
  let item_list = _data.item_list ? _data.item_list : _data.itemList;
  if (item_list) {
    item_list.forEach((item) => {
      if (!item) {
        return;
      }
      let mrp = 0;
      if (_data.sales_return_number || _data.invoice_number) {
        mrp = parseFloat(item.mrp).toFixed(2);
      } else if (_data.purchase_return_number || _data.bill_number) {
        mrp = parseFloat(item.purchased_price).toFixed(2);
      }
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
}; //font-family: "Myriad Pro", Myriad, "Liberation Sans", "Nimbus Sans L", "Helvetica Neue", Helvetica, Arial,Roboto condensed;

let contentBuilder = [];
let itemsTableContent = [];
let addNBillColContent = [];
let discountsTableContent = [];
const appendRow = (type, value, style, css = {}) => {
  contentBuilder.push({
    type: type, // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: value,
    style: style,
    css: css
  });
};

const appendQrRow = (type, value, width, height, style = {}) => {
  contentBuilder.push({
    type: type, // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: value,
    width: width,
    height: height,
    style: style
  });
};

const appendImageRow = (type, path, width, height = {}) => {
  contentBuilder.push({
    type: type, // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    path: path,
    width: width,
    height: height
  });
};
const appendTable = (tableHeader, tableBody, tableFooter, style) => {
  contentBuilder.push({
    type: 'table',
    style: style,
    custom: true,
    tableHeader: tableHeader,
    tableBody: tableBody,
    tableFooter: tableFooter,
    tableHeaderStyle:
      'margin-top:2px;margin-right:10px;font-size: 12px; font-family:Roboto condensed;',
    // custom style for the table body
    tableBodyStyle:
      'margin-top: 2px;font-size: 10px; font-family:Roboto condensed;',
    // custom style for the table footer
    tableFooterStyle:
      'margin-top:2px; font-size: 10px; font-family:Roboto condensed;'
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

export const InvoiceThermalPrintContent = (
  settings,
  content,
  printBalance,
  txnSetting,
  screenName
) => {
  contentBuilder = [];
  itemsTableContent = [];

  let _data = {};
  let balanceType = '';
  let totalBalance = 0;
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
    totalItmDisc: 0,
    strTotal: '',
    receivedAmount: '',
    balanceAmount: '',
    paymentMode: '',
    invoiceTitle: '',
    invoiceDisplayName: '',
    paidReceivedTitle: '',
    totalGST: 0,
    invoiceNoTitle: '',
    mainTitle: '',
    bankPaymentType: '',
    qrCodestr: '',
    approvalDate: '',
    salesEmployeeName: '',
    subTotalDisc: 0,
    totalTaxableAmount: 0
  };

  let TxnSettings = {};
  let totalqty = 0;
  let itemLength = 0;
  const gstMap = new Map();
  let totaltax_gst = 0;

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
    itemLength = _data.item_list
      ? _data.item_list.length
      : _data.itemList.length;
    mapPrintableData(data, _data, screenName, TxnSettings);
    getGSTRows(_data, gstMap);
    if (settings.strqrcode) {
      if (settings.qrCodeValueOptn === 'upi') {
        let beforeAt = settings.strqrcode.split('@');
        let QRCode =
          'upi://pay?pa=' +
          settings.strqrcode +
          '&pn=' +
          beforeAt[0] +
          '&am=' +
          data.totalAmount +
          '&tn=' +
          settings.strCompanyName;
        data.qrCodestr = QRCode;
      } else {
        data.qrCodestr = settings.strqrcode;
      }
    }
  }

  if (printBalance) {
    balanceType = printBalance.balanceType;
    totalBalance = printBalance.totalBalance;
  }

  const printContent = () => {
    appendImageRow('firebaseImage', settings.fileCompanyLogo, '40px', '40px');

    if (settings.boolCompanyName) {
      appendRow('text', settings.strCompanyName, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': 'bold',
        'font-style': 'normal',
        'font-size': '1em',
        'font-family': 'Roboto condensed',
        'text-align': 'center'
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
        'font-size': '10px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolPhone) {
      appendRow('text', settings.strPhone, 'text-align:center;', {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolWebsite) {
      appendRow('text', settings.strWebsite, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolGSTIN) {
      appendRow('text', 'GSTIN:' + settings.strGSTIN, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'Roboto condensed'
      });
    }

    if (settings.boolPAN) {
      appendRow('text', 'PAN:' + settings.strPAN, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'Roboto condensed'
      });
    }

    appendRow('text', data.mainTitle, 'text-align:center; margin-top:10px;', {
      'font-kerning': 'normal',
      'font-weight': 'bold',
      'font-style': 'normal',
      'font-size': '1em',
      'font-family': 'Roboto condensed'
    });

    /* appendRow(
      'text',
      data.billTitle + ': ',
      'text-align:left; margin-left:5px;margin-top:10px;',
      {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'Roboto condensed'
      }
    ); */

    const addNBillColHeader = [data.billTitle, ' '];
    getaddNBillColContent(
      data,
      TxnEnableFieldsMap.get('display_bill_transaction_time'),
      TxnEnableFieldsMap.get('display_salesman')
    );
    appendTable(
      addNBillColHeader,
      addNBillColContent,
      '',
      'margin-top:1px;margin-right: 0px;margin-left: 0px;'
    );

    if (
      isTemple &&
      _data.star !== '' &&
      _data.gothra !== '' &&
      _data.rashi !== '' &&
      _data.star !== undefined &&
      _data.gothra !== undefined &&
      +data.rashi !== undefined
    ) {
      appendRow(
        'text',
        'Astrology Details:',
        'text-align:right;margin-right: 15px;margin-top:10px;',
        {
          'font-kerning': 'normal',
          'font-weight': '500',
          'font-style': 'normal',
          'font-size': '10px',
          'font-family': 'Roboto condensed'
        }
      );

      appendRow(
        'text',
        'Gothra: ' + _data.gothra,
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-style': 'normal',
          'font-size': '10px',
          'font-family': 'Roboto condensed'
        }
      );
      appendRow(
        'text',
        'Rashi: ' + _data.rashi,
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-style': 'normal',
          'font-size': '10px',
          'font-family': 'Roboto condensed'
        }
      );
      appendRow(
        'text',
        'Star: ' + _data.star,
        'text-align:right;margin-right: 15px;',
        {
          'font-kerning': 'normal',
          'font-style': 'normal',
          'font-size': '10px',
          'font-family': 'Roboto condensed'
        }
      );
    }

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
      'margin-top:2px;margin-right: 10px;margin-left: 0px;'
    );

    appendRow(
      'text',
      'Total Items: ' + itemLength,
      'text-align:left; margin-left:5px;margin-top:5px',
      {
        'font-kerning': 'normal',

        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'Roboto condensed'
      }
    );

    appendRow(
      'text',
      'Sub Total: ₹' +
        getFloatWithTwoDecimal(data.totalTaxableAmount + data.subTotalDisc),
      'text-align:right; margin-top:10px;margin-right: 15px;',
      {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '12px',
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
          'font-size': '12px',
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
          'font-size': '12px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    if (TxnEnableFieldsMap.get('display_bill_discount')) {
      appendRow(
        'text',
        'Total Discount: ₹' + getFloatWithTwoDecimal(data.totalDiscount),
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
            'font-size': '12px',
            'font-family': 'Roboto condensed'
          }
        );
      });
    }

    if (_data.round_amount) {
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
      'Grand Total: ₹' + getFloatWithTwoDecimal(data.totalAmount),
      'text-align:right;margin-right: 15px;',
      {
        'font-kerning': 'normal',
        'font-weight': '500',
        'font-style': 'normal',
        'font-size': '14px',
        'font-family': 'Roboto condensed'
      }
    );

    if (_data.estimateType === 'open' || _data.estimateType === 'close') {
      // do nothing
    } else {
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
      if (data.receivedAmount) {
        appendRow(
          'text',
          data.paidReceivedTitle + ': ₹' + data.receivedAmount,
          'text-align:right;margin-right: 15px; ',
          {
            'font-kerning': 'normal',
            'font-weight': '400',
            'font-style': 'normal',
            'font-size': '12px',
            'font-family': 'Roboto condensed'
          }
        );
      }
      if (data.balanceAmount) {
        appendRow(
          'text',
          'Balance: ₹' + data.balanceAmount,
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

      if (settings.boolPreviousBalance && balanceType) {
        appendRow(
          'text',
          balanceType + ': ₹' + totalBalance,
          'text-align:right;margin-right: 15px;',
          {
            'font-kerning': 'normal',
            'font-weight': '400',
            'font-style': 'normal',
            'font-size': '14px',
            'font-family': 'Roboto condensed'
          }
        );
      }

      if (settings.boolBankDetail) {
        if (
          (settings.boolBankDetailsOnCreditSaleOnly &&
            data.balanceAmount > 0) ||
          !settings.boolBankDetailsOnCreditSaleOnly
        ) {
          appendRow(
            'text',
            'BANK DETAILS: ',
            'text-align:right;margin-right: 15px; margin-bottom:2px;margin-top:10px;',
            {
              'font-kerning': 'normal',
              'font-weight': '400',
              'font-style': 'normal',
              'font-size': '12px',
              'font-family': 'Roboto condensed'
            }
          );
          appendRow(
            'text',
            'Bank Name: ' + settings.bankName,
            'text-align:right;margin-right: 15px; margin-bottom:2px;',
            {
              'font-kerning': 'normal',
              'font-weight': '400',
              'font-style': 'normal',
              'font-size': '12px',
              'font-family': 'Roboto condensed'
            }
          );
          appendRow(
            'text',
            'Acc No: ' + settings.bankAccountNumber,
            'text-align:right;margin-right: 15px; margin-bottom:2px;',
            {
              'font-kerning': 'normal',
              'font-weight': '400',
              'font-style': 'normal',
              'font-size': '12px',
              'font-family': 'Roboto condensed'
            }
          );
          appendRow(
            'text',
            'IFSC Code: ' + settings.bankIfscCode,
            'text-align:right;margin-right: 15px; margin-bottom:2px;',
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
    }

    if (settings.boolQrCode) {
      appendQrRow('qrCode', data.qrCodestr, 55, 55, 'margin: 10px');
    }

    /* Signature */
    /* if (settings.boolSignature && settings.strSignature){
      appendImageRow('firebaseImage', settings.strSignature , '40px', '40px');
    } */

    if (settings.boolTerms) {
      appendRow(
        'text',
        TxnSettings.terms !== '' &&
          TxnSettings.terms !== undefined &&
          TxnSettings.terms !== null
          ? TxnSettings.terms
          : settings.strTerms,
        'margin-top:10px;text-align:center;margin-bottom:10px;white-space: break-spaces;',
        {
          'font-kerning': 'normal',
          'font-weight': '400',
          'font-style': 'normal',
          'font-size': '10px',
          'font-family': 'Roboto condensed'
        }
      );
    }

    appendRow('text', '', 'margin-bottom:40px;', {});
  };

  printContent();

  return contentBuilder;
};