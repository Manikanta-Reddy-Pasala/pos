import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableFooterStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableFooterStyles,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 30,
    maxHeight: 50,
    textAlign: 'center',
    fontStyle: 'bold',
    // flexGrow: 1,
    fontSize: 10,
    borderBottomWidth: 1,
    borderColor: 'black none'
  },
  description: {
    width: '40%',
    fontWeight: 70,
    fontFamily: 'Helvetica-Bold'
  },
  amount: {
    width: '5%',
    fontStyle: 'bold',
    fontWeight: 70
  },
  total: {
    width: '10%',
    fontStyle: 'bold',
    fontWeight: 70
  }
});

const DayBookPDFTableDebitFooter = ({ total }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.description}>Total Debit</Text>
      <Text style={styles.total}>{total.cashOut}</Text>
      <Text style={styles.total}>-</Text>
      <Text style={styles.amount}>{total.totalCashDebit}</Text>
      <Text style={styles.total}>{total.totalUpiDebit}</Text>
      <Text style={styles.amount}>{total.totalCardDebit}</Text>
      <Text style={styles.amount}>{total.totalNetBankingDebit}</Text>
      <Text style={styles.amount}>{total.totalChequeDebit}</Text>
      <Text style={styles.total}>{total.totalGiftCardDebit}</Text>
      <Text style={styles.total}>{total.totalCustomFinanceDebit}</Text>
      <Text style={styles.amount}>{total.totalExchangeDebit}</Text>
    </View>
  );
};

export default DayBookPDFTableDebitFooter;