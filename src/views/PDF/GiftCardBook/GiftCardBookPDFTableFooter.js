import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableFooterStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableFooterStyles,
  description: {
    ...pdfTableFooterStyles.description,
    width: '80%'
  },
  amount: {
    ...pdfTableFooterStyles.amount,
    width: '10%',
  }
});

const LedgerPDFTableFooter = ({ total }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.description}>Current Total</Text>
      <Text style={styles.amount}>{total.cashIn}</Text>
      <Text style={styles.amount}>{total.cashOut}</Text>
    </View>
  );
};

export default LedgerPDFTableFooter;