import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableFooterStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableFooterStyles,
  // row: {
  //   flexDirection: 'row',
  //   borderBottomColor: '#D3D3D3',
  //   backgroundColor: '#D3D3D3',
  //   borderBottomWidth: 1,
  //   alignItems: 'center',
  //   height: 24,
  //   textAlign: 'center',
  //   fontStyle: 'bold',
  //   flexGrow: 1
  // },
  description: {
    ...pdfTableFooterStyles.description,
    width: '80%'
  },
  amount: {
    ...pdfTableFooterStyles.amount,
    width: '20%',
  }
});

const LedgerPDFTableFooter = ({ total }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.description}>Current Total</Text>
      <Text style={styles.amount}>{total.cashIn}</Text>
    </View>
  );
};

export default LedgerPDFTableFooter;