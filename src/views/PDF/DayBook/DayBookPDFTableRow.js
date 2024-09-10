import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableRowStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableRowStyles
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     minHeight: 30,
//     maxHeight: 50,
//     textAlign: 'center',
//     fontStyle: 'bold',
//     // flexGrow: 1,
//     fontSize: 10,
//     // borderBottomWidth: 1,
//     // borderBottomColor: '#D3D3D3'
// },
,
  description: {
    width: '10%',
    fontSize:9,
    fontFamily:'Helvetica-Bold',
    fontWeight:"700"

  },
  refNo: {
    width: '10%',
    fontSize:9,
  },
  particular: {
    width: '10%',
    fontSize:9,
  },
  amount: {
    width: '5%',
    fontSize:9,
    fontFamily:'Helvetica-Bold',
    fontWeight:"700"
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
  let result = 0;

  if (
    data['txnType'] === 'Payment In' ||
    data['txnType'] === 'Sales' ||
    data['txnType'] === 'Purchases Return' ||
    data['txnType'] === 'KOT' ||
    data['txnType'] === 'Opening Balance'
  ) {
    if (data.isCredit) {
      if (data['paidOrReceivedAmount']) {
        result = parseFloat(data['paidOrReceivedAmount']);
      }
    } else {
      if ((data['amount'] && data['linkedAmount'] === 0) || data['txnType'] === 'Payment In') {
        result = parseFloat(data['amount']);
      }
    }
  }
  return parseFloat(result).toFixed(2);
}

function getCashOut(data) {
  let result = 0;

  if (
    data['txnType'] === 'Payment Out' ||
    data['txnType'] === 'Sales Return' ||
    data['txnType'] === 'Purchases' ||
    data['txnType'] === 'Expenses'
  ) {
    if (data.isCredit) {
      if (data['paidOrReceivedAmount']) {
        result = parseFloat(data['paidOrReceivedAmount']);
      }
    } else {
      if ((data['amount'] && data['linkedAmount'] === 0) || data['txnType'] === 'Payment Out') {
        result = parseFloat(data['amount']);
      }
    }
  }
  return parseFloat(result).toFixed(2);
}

const LedgerPDFTableRow = ({ items, selectedBankAccountForFiltering }) => {
  const rows = items.map((item) => (
    <View style={styles.row}>
      <Text style={styles.refNo}>{getDateFormat(item)}</Text>
      <Text style={styles.refNo}>{item.sequenceNumber}</Text>
      <Text style={styles.particular}>{getName(item)}</Text>
      <Text style={styles.description}>{item.txnType}</Text>
      <Text style={styles.particular}>{getCashIn(item)}</Text>
      <Text style={styles.particular}>{getCashOut(item)}</Text>
      <Text style={styles.amount}>{item.cash}</Text>
      <Text style={styles.particular}>{item.upi}</Text>
      <Text style={styles.amount}>{item.card}</Text>
      <Text style={styles.amount}>{item.netBanking}</Text>
      <Text style={styles.amount}>{item.cheque}</Text>
      <Text style={styles.particular}>{item.giftCard}</Text>
      <Text style={styles.particular}>{item.customFinance}</Text>
      <Text style={styles.amount}>{item.exchange}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default LedgerPDFTableRow;