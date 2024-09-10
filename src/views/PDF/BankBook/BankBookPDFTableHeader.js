import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableHeaderStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableHeaderStyles,
  description: {
    width: '10%',
    borderColor: 'black none',
    fontSize:9,
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  refNo: {
    width: '10%',
    borderColor: 'black none',
    fontSize:9,
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  particular: {
    width: '10%',
    borderColor: 'black none',
    fontSize:9,
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  amount: {
    width:'10%',
    borderColor: 'black none',
    fontSize:9,
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  }
});

const LedgerPDFTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.description}>Date</Text>
    <Text style={styles.refNo}>Ref No.</Text>
    <Text style={styles.particular}>Particulars</Text>
    <Text style={styles.description}>Type</Text>
    <Text style={styles.amount}>Cash In</Text>
    <Text style={styles.amount}>Cash Out</Text>
    <Text style={styles.amount}>Upi</Text>
    <Text style={styles.amount}>Card</Text>
    <Text style={styles.amount}>Neft/Rtgs</Text>
    <Text style={styles.amount}>Cheque</Text>
  </View>
);

export default LedgerPDFTableHeader;
