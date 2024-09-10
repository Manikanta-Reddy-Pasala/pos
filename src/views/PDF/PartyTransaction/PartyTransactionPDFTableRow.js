import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3'
  },
  description: {
    width: '15%'
  },
  refNo: {
    width: '10%'
  },
  amount: {
    width: '20%'
  },
  type: {
    width: '25%',
}
});

const getStatus = (data) => {
  let result = '';

  let balance = 0;

  if (data['balance']) {
    balance = parseFloat(data['balance']);
  }

  let total = 0;
  if (data['amount']) {
    total = parseFloat(data['amount']);
  }

  //payment in and payment out
  if (data['txnType'] === 'Payment In' || data['txnType'] === 'Payment Out') {
    if (balance === 0) {
      result = 'Used';
    } else if (balance < total) {
      result = 'Partial';
    } else if (balance === total) {
      result = 'Un Used';
    }
  } else {
    //sales and sales return
    //purchase and purchase return
    if (balance === 0) {
      result = 'Paid';
    } else if (balance < total) {
      result = 'Partial';
    } else if (balance === total) {
      result = 'Un Paid';
    }

    if (
      data['txnType'] === 'Delivery Challan' ||
      data['txnType'] === 'Sale Order' ||
      data['txnType'] === 'Sales Quotation' ||
      data['txnType'] === 'Job Work In' ||
      data['txnType'] === 'Purchase Order' ||
      data['txnType'] === 'Approval'
    ) {
      result = '';
    }
  }
  return result;
};

const getDateFormat = (data) => {
  let result = '';

  if (data['date']) {
    result = data['date'];
  }
  var dateParts = result.split('-');
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
};

const PartyTransactionPDFTableRow = ({ items }) => {
  const rows = items.map((item) => (
    <View style={styles.row}>
       <Text style={styles.description}>{item.sequenceNumber}</Text>
      <Text style={styles.type}>{item.txnType}</Text>
      <Text style={styles.description}>{getDateFormat(item)}</Text>
      <Text style={styles.amount}>{item.amount}</Text>
      <Text style={styles.amount}>{item.balance}</Text>
      <Text style={styles.refNo}>{getStatus(item)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default PartyTransactionPDFTableRow;