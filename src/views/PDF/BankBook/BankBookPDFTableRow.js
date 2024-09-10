import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        fontFamily: 'Helvetica',
        height: 24,
        textAlign: 'center',
        fontSize:9,
        fontStyle: 'bold',
        flexGrow: 1,
        borderBottomWidth: 1,
        borderBottomColor: 'white'
    },
    description: {
      width: '10%',
  },
  refNo: {
      width: '10%',
  },
  particular: {
      width: '10%',
  },
  amount: {
      width: '10%',
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

  function getCashIn(data,selectedBankAccountForFiltering) {
    let result = '';

    let amount = 0;

    if (data.splitPaymentList && data.splitPaymentList.length > 0) {
      let splitAmount = 0;
      for (let payment of data.splitPaymentList) {
        if (
          selectedBankAccountForFiltering.id !== '' &&
          payment.bankAccountId !== '' &&
          payment.bankAccountId === selectedBankAccountForFiltering.id
        ) {
          splitAmount += parseFloat(payment.amount);
        }
      }
      amount = parseFloat(splitAmount);
    } else {
      amount = parseFloat(data.amount);
    }

    if (
      data['txnType'] === 'Payment In' ||
      data['txnType'] === 'Sales' ||
      data['txnType'] === 'Purchases Return' ||
      data['txnType'] === 'KOT' ||
      data['txnType'] === 'Opening Balance'
    ) {
      result = amount;
    }

    if (!result) {
      result = 0;
    }
    return result;
  }

  function getCashOut(data,selectedBankAccountForFiltering) {
    let result = '';

    let amount = 0;

    if (data.splitPaymentList && data.splitPaymentList.length > 0) {
      let splitAmount = 0;
      for (let payment of data.splitPaymentList) {
        if (
          selectedBankAccountForFiltering.id !== '' &&
          payment.bankAccountId !== '' &&
          payment.bankAccountId === selectedBankAccountForFiltering.id
        ) {
          splitAmount += parseFloat(payment.amount);
        }
      }
      amount = parseFloat(splitAmount);
    } else {
      amount = parseFloat(data.amount);
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


const LedgerPDFTableRow = ({items,selectedBankAccountForFiltering}) => {
    const rows = items.map( item => 
        <View style={styles.row}>
            <Text style={styles.description}>{getDateFormat(item)}</Text>
            <Text style={styles.refNo}>{item.sequenceNumber}</Text>
            <Text style={styles.particular}>{getName(item)}</Text>
            <Text style={styles.description}>{item.txnType}</Text>
            <Text style={styles.amount}>{getCashIn(item,selectedBankAccountForFiltering)}</Text>
            <Text style={styles.amount}>{getCashOut(item,selectedBankAccountForFiltering)}</Text>
            <Text style={styles.amount}>{item.upi}</Text>
            <Text style={styles.amount}>{item.card}</Text>
            <Text style={styles.amount}>{item.netBanking}</Text>
            <Text style={styles.amount}>{item.cheque}</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default LedgerPDFTableRow