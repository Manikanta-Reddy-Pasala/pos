import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
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
    width: '10%'
  },
  refNo: {
    width: '5%'
  },
  particular: {
    width: '25%'
  },
  amount: {
    width: '20%'
  }
});

const LedgerPDFTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.refNo}>Date</Text>
    <Text style={styles.refNo}>{'Party\nName'}</Text>
    <Text style={styles.particular}>Party GSTN</Text>
    <Text style={styles.description}>Party PAN</Text>
    <Text style={styles.particular}>No</Text>
    <Text style={styles.particular}>Total</Text>
    <Text style={styles.amount}>Paid</Text>
    <Text style={styles.amount}>{'TDS\nDeducted'}</Text>
    <Text style={styles.amount}>TDS Code</Text>
    <Text style={styles.amount}>TDS Name</Text>
    <Text style={styles.amount}>TDS %</Text>
  </View>
);

export default LedgerPDFTableHeader;