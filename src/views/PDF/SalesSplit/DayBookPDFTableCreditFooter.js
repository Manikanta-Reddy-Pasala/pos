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

const DayBookPDFTableCreditFooter = ({ total }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.description}>TOTAL CREDIT</Text>
      <Text style={styles.total}>{total.cashIn}</Text>
      <Text style={styles.total}>-</Text>
      <Text style={styles.amount}>{total.totalCashCredit}</Text>
      <Text style={styles.total}>{total.totalUpiCredit}</Text>
      <Text style={styles.amount}>{total.totalCardCredit}</Text>
      <Text style={styles.amount}>{total.totalNetBankingCredit}</Text>
      <Text style={styles.amount}>{total.totalChequeCredit}</Text>
      <Text style={styles.total}>{total.totalGiftCardCredit}</Text>
      <Text style={styles.total}>{total.totalCustomFinanceCredit}</Text>
      <Text style={styles.amount}>{total.totalExchangeCredit}</Text>
    </View>
  );
};

export default DayBookPDFTableCreditFooter;