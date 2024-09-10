import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableHeaderStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableHeaderStyles,
  description: {
    width: '10%',
    fontSize:10,
    fontFamily:'Helvetica-Bold',
    fontWeight:"700"

  },
  refNo: {
    width: '10%',
    fontSize:10,
    fontFamily:'Helvetica-Bold',
    fontWeight:"700"
  },
  particular: {
    width: '10%',
    fontSize:10,
    fontFamily:'Helvetica-Bold',
    fontWeight:"700"
  },
  amount: {
    width: '5%',
    fontSize:10,
    fontFamily:'Helvetica-Bold',
    fontWeight:"700"
  }
});

const LedgerPDFTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.refNo}>Date</Text>
    <Text style={styles.refNo}>Ref No.</Text>
    <Text style={styles.particular}>Particulars</Text>
    <Text style={styles.description}>Type</Text>
    <Text style={styles.particular}>Credit</Text>
    <Text style={styles.particular}>Debit</Text>
    <Text style={styles.amount}>Cash</Text>
    <Text style={styles.particular}>Upi</Text>
    <Text style={styles.amount}>Card</Text>
    <Text style={styles.amount}>Neft</Text>
    <Text style={styles.amount}>Cheque</Text>
    <Text style={styles.particular}>Gift Card</Text>
    <Text style={styles.particular}>Finance</Text>
    <Text style={styles.amount}>Exchange</Text>
  </View>
);

export default LedgerPDFTableHeader;