import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    borderBottomColor: '#D3D3D3',
    backgroundColor: '#D3D3D3',
    borderBottomWidth: 1,
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1
  },
  description: {
    width: '40%',
    fontWeight: 70
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
      <Text style={styles.description}>TOTAL DEBIT</Text>
      <Text style={styles.total}>-</Text>
      <Text style={styles.total}>{total.cashOut}</Text>
      <Text style={styles.amount}>{total.totalCashDebit}</Text>
      <Text style={styles.total}>{total.totalUpiDebit}</Text>
      <Text style={styles.amount}>{total.totalCardDebit}</Text>
      <Text style={styles.amount}>{total.totalNetBankingDebit}</Text>
      <Text style={styles.amount}>{total.totalChequeDebit}</Text>
      <Text style={styles.total}>{total.totalGiftCardDebit}</Text>
      <Text style={styles.total}>{total.totalCustomFinanceDebit}</Text>
    </View>
  );
};

export default DayBookPDFTableDebitFooter;