import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableRowStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableRowStyles,

  description: {
    width: '15%',
    fontSize:9
  },
  particular: {
    width: '20%',
    fontFamily: 'Helvetica-Bold',
    fontSize:9
  },
  refNo: {
    width: '10%',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700',
    fontSize:9
  },
  amount: {
    width: '10%',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700',
    fontSize:9
  }
});

const getDateFormat = (data) => {
  let result = '';

  if (data['date']) {
    result = data['date'];
  }
  var dateParts = result.split('-');
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
};

function getName(cashFlowData) {
  let result = '';

  if (cashFlowData.customerName) {
    result = cashFlowData.customerName;
  } else if (cashFlowData.vendor_name) {
    result = cashFlowData.vendor_name;
  } else if (cashFlowData.customer_name) {
    result = cashFlowData.customer_name;
  } else if (cashFlowData.vendorName) {
    result = cashFlowData.vendorName;
  }
  return result;
}

function getCashIn(data) {
  let result = '';

  let amount = 0;
  if (data.splitPaymentList && data.splitPaymentList.length > 0) {
    let splitAmount = 0;
    for (let payment of data.splitPaymentList) {
      if (payment.paymentType === 'Custom Finance') {
        splitAmount += parseFloat(payment.amount);
      }
    }
    amount = parseFloat(splitAmount);
  }

  if (
    data['txnType'] === 'Payment In' ||
    data['txnType'] === 'Sales' ||
    data['txnType'] === 'Purchases Return' ||
    data['txnType'] === 'KOT'
  ) {
    result = amount;
  }

  if (!result) {
    result = 0;
  }
  return result;
}

function getCashOut(data) {
  let result = '';

  let amount = 0;
  if (data.splitPaymentList && data.splitPaymentList.length > 0) {
    let splitAmount = 0;
    for (let payment of data.splitPaymentList) {
      if (payment.paymentType === 'Custom Finance') {
        splitAmount += parseFloat(payment.amount);
      }
    }
    amount = parseFloat(splitAmount);
  }

  if (
    data['txnType'] === 'Payment Out' ||
    data['txnType'] === 'Sales Return' ||
    data['txnType'] === 'Purchases' ||
    data['txnType'] === 'Expenses'
  ) {
    result = amount;
  }

  if (!result) {
    result = 0;
  }
  return result;
}

function getFinanceName(data) {
  let result = '';

  if (data.splitPaymentList && data.splitPaymentList.length > 0) {
    for (let payment of data.splitPaymentList) {
      if (payment.paymentType === 'Custom Finance') {
        result = payment.paymentMode;
      }
    }
  }

  return result;
}

const LedgerPDFTableRow = ({ items }) => {
  const rows = items.map((item) => (
    <View style={styles.row}>
      <Text style={styles.description}>{getDateFormat(item)}</Text>
      <Text style={styles.refNo}>{item.sequenceNumber}</Text>
      <Text style={styles.particular}>{getName(item)}</Text>
      <Text style={styles.description}>{item.txnType}</Text>
      <Text style={styles.particular}>{getFinanceName(item)}</Text>
      <Text style={styles.amount}>{getCashIn(item)}</Text>
      <Text style={styles.amount}>{getCashOut(item)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default LedgerPDFTableRow;