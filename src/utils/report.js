// cashbook header
export const prepareCashBookHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'DATE',
    key: 'date',
    width: 15
  });
  filteredColumns.push({
    header: 'VOUCHER NO',
    key: 'voucherNo',
    width: 15
  });
  filteredColumns.push({
    header: 'PARTICULARS',
    key: 'particulars',
    width: 20
  });
  filteredColumns.push({ header: 'TYPE', key: 'type', width: 15 });
  filteredColumns.push({ header: 'CASH IN', key: 'cashIn', width: 20 });
  filteredColumns.push({ header: 'CASH IN', key: 'cashOut', width: 20 });
};

// bankbook header
export const prepareBankBookHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'DATE',
    key: 'date',
    width: 15
  });
  filteredColumns.push({
    header: 'Invoice/Bill No',
    key: 'sequenceNumber',
    width: 20
  });
  filteredColumns.push({
    header: 'Particular',
    key: 'particulars',
    width: 20
  });
  filteredColumns.push({
    header: 'Type',
    key: 'txnType',
    width: 20
  });
  filteredColumns.push({ header: 'CASH IN', key: 'cashIn', width: 20 });
  filteredColumns.push({ header: 'CASH IN', key: 'cashOut', width: 20 });
  filteredColumns.push({
    header: 'UPI',
    key: 'upi',
    width: 15
  });
  filteredColumns.push({
    header: 'CARD',
    key: 'card',
    width: 15
  });
  filteredColumns.push({
    header: 'NEFT/RTGS',
    key: 'netBanking',
    width: 15
  });
  filteredColumns.push({
    header: 'CHEQUE',
    key: 'cheque',
    width: 15
  });
  filteredColumns.push({ header: 'TYPE', key: 'type', width: 15 });
};

// daybook header
export const prepareDayBookHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'DATE',
    key: 'date',
    width: 15
  });
  filteredColumns.push({
    header: 'Invoice/Bill No',
    key: 'sequenceNumber',
    width: 20
  });
  filteredColumns.push({
    header: 'Particular',
    key: 'particulars',
    width: 20
  });
  filteredColumns.push({
    header: 'Type',
    key: 'txnType',
    width: 20
  });
  filteredColumns.push({
    header: 'Credit',
    key: 'credit',
    width: 20
  });
  filteredColumns.push({
    header: 'Debit',
    key: 'debit',
    width: 20
  });
  filteredColumns.push({
    header: 'Cash',
    key: 'cash',
    width: 20
  });
  filteredColumns.push({
    header: 'UPI',
    key: 'upi',
    width: 15
  });
  filteredColumns.push({
    header: 'CARD',
    key: 'card',
    width: 15
  });
  filteredColumns.push({
    header: 'NEFT/RTGS',
    key: 'netBanking',
    width: 15
  });
  filteredColumns.push({
    header: 'CHEQUE',
    key: 'cheque',
    width: 15
  });
  filteredColumns.push({ header: 'Gift Card', key: 'giftCard', width: 15 });
  filteredColumns.push({
    header: 'Custom Finance',
    key: 'customFinance',
    width: 15
  });
  filteredColumns.push({ header: 'Exchange', key: 'exchange', width: 15 });
};

// cheque book header
export const prepareChequeBookHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'Invoice/Bill No',
    key: 'sequenceNumber',
    width: 15
  });
  filteredColumns.push({
    header: 'Date',
    key: 'date',
    width: 15
  });
  filteredColumns.push({
    header: 'PARTICULARS',
    key: 'particulars',
    width: 20
  });
  filteredColumns.push({ header: 'TYPE', key: 'type', width: 15 });
  filteredColumns.push({ header: 'CASH IN', key: 'cashIn', width: 20 });
  filteredColumns.push({ header: 'CASH IN', key: 'cashOut', width: 20 });
};

// custom Finance book header
export const prepareCustomFinanceHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'Date',
    key: 'date',
    width: 30
  });
  filteredColumns.push({
    header: 'Invoice/Bill No',
    key: 'sequenceNumber',
    width: 15
  });
  filteredColumns.push({
    header: 'PARTICULARS',
    key: 'particulars',
    width: 20
  });
  filteredColumns.push({ header: 'TxnType', key: 'txnType', width: 15 });
  filteredColumns.push({
    header: 'Finance Name',
    key: 'financeName',
    width: 15
  });
  filteredColumns.push({ header: 'CASH IN', key: 'cashIn', width: 20 });
  filteredColumns.push({ header: 'CASH IN', key: 'cashOut', width: 20 });
};

// gift card header
export const prepareGiftCardHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'Date',
    key: 'date',
    width: 30
  });
  filteredColumns.push({
    header: 'Invoice/Bill No',
    key: 'sequenceNumber',
    width: 15
  });
  filteredColumns.push({
    header: 'PARTICULARS',
    key: 'particulars',
    width: 20
  });
  filteredColumns.push({ header: 'TxnType', key: 'txnType', width: 15 });
  filteredColumns.push({ header: 'Card/Schema', key: 'card', width: 15 });
  filteredColumns.push({ header: 'CASH IN', key: 'cashIn', width: 20 });
  filteredColumns.push({ header: 'CASH IN', key: 'cashOut', width: 20 });
};

export const prepareExchangeHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'Date',
    key: 'date',
    width: 30
  });
  filteredColumns.push({
    header: 'Invoice/Bill No',
    key: 'sequenceNumber',
    width: 15
  });
  filteredColumns.push({
    header: 'PARTICULARS',
    key: 'particulars',
    width: 20
  });
  filteredColumns.push({ header: 'TxnType', key: 'txnType', width: 15 });
  filteredColumns.push({ header: 'exchange', key: 'exchange', width: 15 });
  filteredColumns.push({ header: 'CASH IN', key: 'cashIn', width: 20 });
};

export function getDate(flowData) {
  let result = '';

  if (flowData.date) {
    result = flowData.date;
  } else if (flowData.bill_date) {
    result = flowData.bill_date;
  } else if (flowData.invoice_date) {
    result = flowData.invoice_date;
  }
  return result;
}

export function getRefNo(flowData) {
  let result = '';

  if (flowData.sequenceNumber) {
    result = flowData.sequenceNumber;
  } else if (flowData.invoice_number) {
    result = flowData.invoice_number;
  } else if (flowData.bill_number) {
    result = flowData.bill_number;
  }
  return result;
}

export function getName(flowData) {
  let result = '';

  if (flowData.customerName) {
    result = flowData.customerName;
  } else if (flowData.vendor_name) {
    result = flowData.vendor_name;
  } else if (flowData.customer_name) {
    result = flowData.customer_name;
  } else if (flowData.vendorName) {
    result = flowData.vendorName;
  }
  return result;
}

export const getFloatWithTwoDecimal = (val) => {
  return parseFloat(val).toFixed(2);
};

export function getCashIn(flowData) {
  let result = '';

  if (
    flowData.txnType === 'Payment In' ||
    flowData.txnType === 'Sales' ||
    flowData.txnType === 'Purchases Return' ||
    flowData.txnType === 'KOT'
  ) {
    if (flowData.isCredit) {
      if (flowData.paidOrReceivedAmount) {
        result = parseFloat(flowData.paidOrReceivedAmount);
      }
    } else {
      let amount = 0;

      if (flowData.splitPaymentList && flowData.splitPaymentList.length > 0) {
        let splitAmount = 0;
        for (let payment of flowData.splitPaymentList) {
          if (payment.paymentType === 'Cash') {
            splitAmount += parseFloat(payment.amount);
          }
        }
        amount = parseFloat(splitAmount);
      } else {
        amount = parseFloat(flowData.amount);
      }

      if (amount) {
        result = parseFloat(amount);
      }
    }
  }
  if (!result) {
    result = 0;
  }
  return parseFloat(result).toFixed(2);
}

export function getCashOut(flowData) {
  let result = '';

  if (
    flowData.txnType === 'Payment Out' ||
    flowData.txnType === 'Sales Return' ||
    flowData.txnType === 'Purchases' ||
    flowData.txnType === 'Expenses'
  ) {
    if (flowData.isCredit) {
      if (flowData.paidOrReceivedAmount) {
        result = parseFloat(flowData.paidOrReceivedAmount);
      }
    } else {
      let amount = 0;

      if (flowData.splitPaymentList && flowData.splitPaymentList.length > 0) {
        let splitAmount = 0;
        for (let payment of flowData.splitPaymentList) {
          if (payment.paymentType === 'Cash') {
            splitAmount += parseFloat(payment.amount);
          }
        }
        amount = parseFloat(splitAmount);
      } else {
        amount = parseFloat(flowData.amount);
      }

      if (amount) {
        result = parseFloat(amount);
      }
    }
  }

  if (!result) {
    result = 0;
  }
  return parseFloat(result).toFixed(2);
}

export const downloadExcelFromWorkBookBuffer = (workbook, fileName) => {
  try {
    workbook.xlsx
      .writeBuffer()
      .then((buffer) => {
        // Create a Blob from the buffer
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
        // Create a link element
        const a = document.createElement('a');
        // Set the link's href attribute to the URL of the Blob
        a.href = url;
        // Set the download attribute to specify the filename

        a.download = fileName + '.xlsx';
        // Append the link to the body
        document.body.appendChild(a);
        // Click the link programmatically to start the download
        a.click();
        // Remove the link from the body
        document.body.removeChild(a);
      })
      .catch((err) => {
        throw new Error('Download Failed.', err);
      });
  } catch (error) {
    console.log({ 'Download Failed': error });
  }
};
