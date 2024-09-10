import React from 'react';
const numberToText = require('number-to-text');
require('number-to-text/converters/en-us'); // load converter

const getFloatWithTwoDecimal = (val) => {
  return parseFloat(val).toFixed(2);
};

const mapPrintableData = (data, _data) => {
  data.customer_name = _data.customer_name;
  data.customer_address = _data.customer_address;
  data.customer_phoneNo = _data.customer_phoneNo;
  data.cusstomer_pincode = _data.cusstomer_pincode;
  data.customer_city = _data.customer_city;
  data.customer_emailId = _data.customer_emailId;
  data.invoiceNumber = _data.invoice_number;
  data.date = _data.invoice_date || _data.date;
  data.totalAmount = _data.total_amount;
  data.strTotal = numberToText.convertToText(_data.total_amount);
  data.receivedAmount = _data.received_amount;
  data.balanceAmount = _data.balance_amount;
  data.paymentMode = _data.payment_type;
};

const getInvoiceRows = (data, _data, totalqty, totaltax_gst) => {
  return _data.item_list.forEach((item, index) => {
    const mrp = parseFloat(item.mrp).toFixed(2);
    let offerPrice = parseFloat(item.offer_price).toFixed(2);
    if (isNaN(offerPrice)) {
      offerPrice = mrp;
    } //offer price is coming wrong
    const cgstPercent = parseFloat(item.cgst);
    const sgstPercent = parseFloat(item.sgst);
    const igstPercent = parseFloat(item.igst);
    const cessPercent = parseFloat(item.cess);

    const qty = parseFloat(item.qty);
    let tempMrp = mrp;
    let totalGST = 0;
    if (offerPrice < mrp && offerPrice !== 0) {
      tempMrp = offerPrice;
      data.subTotal += offerPrice * qty;
    } else if (qty > 0) {
      data.subTotal += mrp * qty;
    }
    if (cgstPercent) {
      totalGST += parseFloat(item.cgst_amount);
    }
    if (sgstPercent) {
      totalGST += parseFloat(item.sgst_amount);
    }

    if (igstPercent) {
      totalGST += parseFloat(item.igst_amount);
    }
    if (cessPercent) {
      totalGST += parseFloat(item.cess);
    }

    totalqty += parseFloat(item.qty);
    totaltax_gst += totalGST;
    const offer_price =
      item.offer_price === '' || isNaN(item.offer_price)
        ? item.mrp
        : item.offer_price;
    var finalMRP =
      offer_price !== 0
        ? item.mrp > offer_price
          ? offer_price
          : item.mrp
        : item.mrp;
    const discount = qty * (item.mrp - offer_price);
    data.totalDiscount += discount;
    const itemTotal = finalMRP * item.qty;
    appendNewLine();
    appendLeftContent(index + 1);
    appendLeftContent(item.item_name);
    appendLeftContent(item.qty);
    appendLeftContent('₹ ' + mrp);
    appendRightContent('₹ ' + getFloatWithTwoDecimal(itemTotal));
  });
};

const getGSTRows = (_data, gstMap) => {
  if (_data.item_list) {
    _data.item_list.forEach((item) => {
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
};
let contentBuilder = [];
const appendNewLine = () => {
  contentBuilder.push(`\n`);
};
const appendLeftContent = (content) => {
  contentBuilder.push(`[L]${content}`);
};
const appendRightContent = (content) => {
  contentBuilder.push(`[R]${content}`);
};
const appendCenterContent = (content) => {
  contentBuilder.push(`[C]${content}`);
};

export const InvoiceThermalPrintContent = (settings, content) => {
  contentBuilder = [];
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
    paymentMode: ''
  };
  let totalqty = 0;
  let totaltax_gst = 0;
  const gstMap = new Map();

  if (settings && content) {
    _data = content;
    mapPrintableData(data, _data);
    getGSTRows(_data, gstMap);
  }

  const printContent = () => {
    // if (settings.boolCompanyName) {
    //   appendNewLine();
    //   appendCenterContent('<b>' + settings.strCompanyName + '</b>');
    // }
    // if (settings.boolAddress) {
    //   appendNewLine();
    //   appendCenterContent(settings.strAddress);
    // }
    // if (settings.boolEmail) {
    //   appendNewLine();
    //   appendCenterContent('Email: ' + settings.strEmail);
    // }
    // if (settings.boolPhone) {
    //   appendNewLine();
    //   appendCenterContent('Ph. no: ' + settings.strPhone);
    // }
    // if (settings.boolGSTIN) {
    //   appendNewLine();
    //   appendCenterContent(settings.strGSTIN);
    // }

    // appendNewLine();
    appendCenterContent('Hello World');

    // appendNewLine();
    // appendNewLine();
    // appendLeftContent('<b>' + data.customer_name + '</b>');
    // if (settings.customer_address && data.customer_address) {
    //   appendNewLine();
    //   appendLeftContent(data.customer_address);
    // }
    // if (settings.customer_phoneNo && data.customer_phoneNo) {
    //   appendNewLine();
    //   appendLeftContent(data.customer_phoneNo);
    // }
    // if (settings.cusstomer_pincode && data.cusstomer_pincode) {
    //   appendNewLine();
    //   appendLeftContent(data.cusstomer_pincode);
    // }
    // if (settings.customer_city && data.customer_city) {
    //   appendNewLine();
    //   appendLeftContent(data.customer_city);
    // }
    // if (settings.customer_emailId && data.customer_emailId) {
    //   appendNewLine();
    //   appendLeftContent(data.customer_emailId);
    // }

    // appendNewLine();
    // appendRightContent(
    //   (_data.date ? 'Return No.: ' : 'Invoice No.: ') + data.invoiceNumber
    // );
    // appendNewLine();
    // appendRightContent('Date: ' + data.date);

    // appendNewLine();
    // appendLeftContent('<b>SR</b>');
    // appendLeftContent('<b>Name</b>');
    // appendLeftContent('<b>Qty</b>');
    // appendLeftContent('<b>Price</b>');
    // appendRightContent('<b>Amount</b>');

    // appendNewLine();
    // appendLeftContent('<hr />');
    // appendNewLine();
    // getInvoiceRows(data, _data, totalqty, totaltax_gst); // printing items

    // appendNewLine();
    // appendLeftContent('');
    // appendLeftContent('Discount:');
    // appendRightContent('₹ ' + getFloatWithTwoDecimal(data.subTotal));

    // appendNewLine();
    // appendLeftContent('');
    // appendLeftContent('GST:');
    // appendRightContent('₹ ' + getFloatWithTwoDecimal(data.subTotal));

    // appendNewLine();
    // appendLeftContent('<hr />');

    // appendNewLine();
    // appendLeftContent('<b>Total</b>');
    // appendLeftContent('<b>' + totalqty + '</b>');
    // appendRightContent('₹ ' + getFloatWithTwoDecimal(data.subTotal));

    // appendNewLine();
    // appendLeftContent('');
    // appendLeftContent('Discount');
    // appendRightContent('₹ ' + getFloatWithTwoDecimal(data.totalDiscount));

    // if (settings.boolTaxDetails) {
    //   Array.from(gstMap.keys()).forEach((key) => {
    //     appendNewLine();
    //     appendLeftContent('');
    //     appendLeftContent(key);
    //     appendRightContent('₹ ' + getFloatWithTwoDecimal(gstMap.get(key)));
    //   });
    // }

    // appendNewLine();
    // appendLeftContent('');
    // appendLeftContent('<b>Total</b>');
    // appendRightContent('₹ ' + getFloatWithTwoDecimal(data.totalAmount));

    // appendNewLine();
    // appendLeftContent('');
    // appendLeftContent('Received');
    // appendRightContent('₹ ' + getFloatWithTwoDecimal(data.receivedAmount));

    // appendNewLine();
    // appendLeftContent('');
    // appendLeftContent('Balance');
    // appendRightContent('₹ ' + getFloatWithTwoDecimal(data.balanceAmount));
    // if (settings.boolPaymentMode) {
    //   appendNewLine();
    //   appendLeftContent('');
    //   appendLeftContent('Payment Mode');
    //   appendRightContent('₹ ' + data.paymentMode);
    // }
    // if (settings.boolTerms) {
    //   appendNewLine();
    //   appendLeftContent('Thanks for doing business with us!');
    // }
    // appendNewLine();
  };

  printContent();

  return contentBuilder.join();
};
