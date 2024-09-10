import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableRowStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableRowStyles,
  description: {
    ...pdfTableRowStyles.description,
    width: '15%',
},
refNo: {
    ...pdfTableRowStyles.refNo,
    width: '10%',
},
particular: {
    ...pdfTableRowStyles.particular,
    width: '20%',
},
amount: {
    ...pdfTableRowStyles.amount,
    width: '20%',
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
      if (payment.paymentType === 'Exchange') {
        splitAmount += parseFloat(payment.amount);
      }
    }
    amount = parseFloat(splitAmount);
  }

  if (
    data['txnType'] === 'Sales'
  ) {
    result = amount;
  }

  if (!result) {
    result = 0;
  }
  return result;
}

function getExchange(data) {
  let result = '';

  if (data.splitPaymentList && data.splitPaymentList.length > 0) {
    for (let payment of data.splitPaymentList) {
      if (payment.paymentType === 'Exchange') {
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
      <Text style={styles.particular}>{getExchange(item)}</Text>
      <Text style={styles.amount}>{getCashIn(item)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default LedgerPDFTableRow;