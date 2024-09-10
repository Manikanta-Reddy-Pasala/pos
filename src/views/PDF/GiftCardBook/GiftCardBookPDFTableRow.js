import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableRowStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableRowStyles,
  // row: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   height: 24,
  //   textAlign: 'center',
  //   fontStyle: 'bold',
  //   flexGrow: 1,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#D3D3D3'
  // },
  description: {
    ...pdfTableRowStyles.description,
    width: '15%'
  },
  particular: {
    ...pdfTableRowStyles.particular,

    width: '20%'
  },
  refNo: {
    ...pdfTableRowStyles.refNo,
    width: '10%'
  },
  amount: {
    ...pdfTableRowStyles.amount,
    width: '10%'
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

function getName(data) {
  let result = '';

  if (data['customerName']) {
    result = data['customerName'];
  } else if (data['vendorName']) {
    result = data['vendorName'];
  }
  return result;
}

function getCashIn(data) {
  let result = '';

  let amount = 0;
  if (data.splitPaymentList && data.splitPaymentList.length > 0) {
    let splitAmount = 0;
    for (let payment of data.splitPaymentList) {
      if (payment.paymentType === 'Gift Card') {
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
      if (payment.paymentType === 'Gift Card') {
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

function getGiftCard(data) {
  let result = '';

  if (data.splitPaymentList && data.splitPaymentList.length > 0) {
    for (let payment of data.splitPaymentList) {
      if (payment.paymentType === 'Gift Card') {
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
      <Text style={styles.particular}>{getGiftCard(item)}</Text>
      <Text style={styles.amount}>{getCashIn(item)}</Text>
      <Text style={styles.amount}>{getCashOut(item)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default LedgerPDFTableRow;