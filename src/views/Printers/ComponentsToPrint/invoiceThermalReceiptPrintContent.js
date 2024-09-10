import React from 'react';
const numberToText = require('number-to-text');
require('number-to-text/converters/en-us'); // load converter

const mapPrintableData = (data, _data) => {
  var name = '';
  var phNo = '';
  if (_data.customerName) {
    name = _data.customerName;
    phNo = _data.customer_phoneNo;
    data.paidReceivedTitle = 'Received';
    data.billTitle = 'Received From';
    data.receiptNumber = _data.sequenceNumber;
  } else if (_data.vendorName) {
    name = _data.vendorName;
    phNo = _data.vendorPhoneNo;
    data.paidReceivedTitle = 'Paid';
    data.billTitle = 'Paid To';
    data.receiptNumber = _data.receiptNumber;
  }

  data.customer_name = name;
  data.customer_phoneNo = phNo;

  data.date = _data.date;
  data.receivedAmount = _data.customerName ? _data.received : _data.paid;
  data.paymentMode = _data.paymentType;
};

function dateFormatter(date) {
  var dateParts = date.split('-');
  if (dateParts.length >= 3) {
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }
}

let contentBuilder = [];

const appendRow = (type, value, style, css = {}) => {
  contentBuilder.push({
    type: type, // 'text' | 'barCode' | 'qrCode' | 'image' | 'table
    value: value,
    style: style,
    css: css
  });
};

export const InvoiceThermalReceiptPrintContent = (
  settings,
  content,
  printBalance
) => {
  contentBuilder = [];
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
    strTotal: '',
    receivedAmount: '',
    balanceAmount: '',
    paymentMode: '',
    billTitle: '',
    paidReceivedTitle: ''
  };

  if (settings && content) {
    _data = content;
    mapPrintableData(data, _data);
  }

  if (printBalance) {
    balanceType = printBalance.balanceType;
    totalBalance = printBalance.totalBalance;
  }

  const printContent = () => {
    if (settings.boolCompanyName) {
      appendRow('text', settings.strCompanyName, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '14px',
        'font-family': 'sans-serif'
      });
    }

    if (settings.boolAddress) {
      appendRow('text', settings.strAddress, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': 'lighter',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      });
    }

    if (settings.boolEmail) {
      appendRow('text', settings.strEmail, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': 'lighter',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      });
    }

    if (settings.boolPhone) {
      appendRow('text', settings.strPhone, 'text-align:center;', {
        'font-kerning': 'normal',
        'font-weight': 'lighter',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
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
      appendRow('text', 'GSTIN:' + settings.strGSTIN, 'text-align:center;');
    }

    if (settings.boolPAN) {
      appendRow('text', 'PAN:' + settings.strPAN, 'text-align:center;');
    }

    appendRow(
      'text',
      'Payment Receipt',
      'text-align:center; margin-top:10px;',
      {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      }
    );

    appendRow(
      'text',
      data.billTitle + ':',
      'text-align:left; margin-top:10px;margin-left:5px;',
      {
        'font-kerning': 'normal',
        'font-weight': '400',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      }
    );

    appendRow('text', data.customer_name, 'text-align:left; margin-left:5px;', {
      'font-kerning': 'normal',
      'font-weight': 'lighter',
      'font-style': 'normal',
      'font-size': '10px',
      'font-family': 'sans-serif'
    });

    if (data.customer_phoneNo) {
      appendRow(
        'text',
        'Phone No: ' + data.customer_phoneNo,
        'text-align:left; margin-left:5px;',
        {
          'font-kerning': 'normal',
          'font-weight': 'lighter',
          'font-style': 'normal',
          'font-size': '10px',
          'font-family': 'sans-serif'
        }
      );
    }

    appendRow(
      'text',
      'Receipt No: ' + data.receiptNumber + ' ',
      'text-align:right; margin-top:10px;margin-right: 15px;',
      {
        'font-kerning': 'normal',
        'font-weight': '300',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      }
    );

    appendRow(
      'text',
      'Date: ' + dateFormatter(data.date),
      'text-align:right;margin-right: 15px;',
      {
        'font-kerning': 'normal',
        'font-weight': 'lighter',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      }
    );

    appendRow(
      'text',
      data.paidReceivedTitle + ': ₹' + data.receivedAmount,
      'text-align:right;margin-right: 15px; ',
      {
        'font-kerning': 'normal',
        'font-weight': '200',
        'font-style': 'normal',
        'font-size': '10px',
        'font-family': 'sans-serif'
      }
    );

    if (settings.boolPreviousBalance) {
      appendRow(
        'text',
        balanceType + ': ₹' + totalBalance,
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

    appendRow('text', '', 'margin-bottom:40px;', {});
  };

  printContent();

  return contentBuilder;
};
