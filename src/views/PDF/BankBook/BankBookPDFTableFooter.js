import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableFooterStyles } from '../Styles/style';

const styles = StyleSheet.create({...pdfTableFooterStyles,
  amount:{
    width: '10%',
    fontStyle: 'bold',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    fontWeight: '700',
    borderColor: 'black',
    fontSize:10
  },
    description: {
      width: '40%',
      fontWeight: '700',
      fontSize:10
    },
  
});

const LedgerPDFTableFooter = ({ total }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.description}>Current Total</Text>
      <Text style={styles.amount}>{total.cashIn}</Text>
      <Text style={styles.amount}>{total.cashOut}</Text>
      <Text style={styles.amount}>{total.upi}</Text>
      <Text style={styles.amount}>{total.card}</Text>
      <Text style={styles.amount}>{total.neft}</Text>
      <Text style={styles.amount}>{total.cheque}</Text>
    </View>
  );
};

export default LedgerPDFTableFooter;