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
    borderTopWidth: 1,
    borderColor: 'black none'
  },
  description: {
    width: '40%',
    fontSize:10,
    fontWeight: '700',
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

const DayBookPDFTableCreditFooter = ({ total }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.description}>Total Credit</Text>
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