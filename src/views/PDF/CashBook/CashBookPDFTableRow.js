import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableRowStyles } from '../Styles/style';

const styles = StyleSheet.create(pdfTableRowStyles);

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

  function getCashIn(cashFlowData) {
    let result = '';
    console.log(cashFlowData);
    console.log(cashFlowData.txnType);

    if (
      cashFlowData.txnType === 'Payment In' ||
      cashFlowData.txnType === 'Sales' ||
      cashFlowData.txnType === 'Purchases Return' ||
      cashFlowData.txnType === 'KOT'
    ) {
      if (cashFlowData.isCredit) {
        if (cashFlowData.paidOrReceivedAmount) {
          result = parseFloat(cashFlowData.paidOrReceivedAmount);
        }
      } else {
        let amount = 0;

        if (
          cashFlowData.splitPaymentList &&
          cashFlowData.splitPaymentList.length > 0
        ) {
          let splitAmount = 0;
          for (let payment of cashFlowData.splitPaymentList) {
            if (payment.paymentType === 'Cash') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        } else {
          amount = parseFloat(cashFlowData.amount);
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

  function getCashOut(cashFlowData) {
    let result = '';

    if (
      cashFlowData.txnType === 'Payment Out' ||
      cashFlowData.txnType === 'Sales Return' ||
      cashFlowData.txnType === 'Purchases' ||
      cashFlowData.txnType === 'Expenses'
    ) {
      if (cashFlowData.isCredit) {
        if (cashFlowData.paidOrReceivedAmount) {
          result = parseFloat(cashFlowData.paidOrReceivedAmount);
        }
      } else {
        let amount = 0;

        if (
          cashFlowData.splitPaymentList &&
          cashFlowData.splitPaymentList.length > 0
        ) {
          let splitAmount = 0;
          for (let payment of cashFlowData.splitPaymentList) {
            if (payment.paymentType === 'Cash') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        } else {
          amount = parseFloat(cashFlowData.amount);
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


const LedgerPDFTableRow = ({items}) => {
    const rows = items.map( item => 
        <View style={styles.row}>
            <Text style={styles.description}>{getDateFormat(item)}</Text>
            <Text style={styles.refNo}>{item.sequenceNumber}</Text>
            <Text style={styles.particular}>{getName(item)}</Text>
            <Text style={styles.description}>{item.txnType}</Text>
            <Text style={styles.amount}>{getCashIn(item)}</Text>
            <Text style={styles.amount}>{getCashOut(item)}</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default LedgerPDFTableRow