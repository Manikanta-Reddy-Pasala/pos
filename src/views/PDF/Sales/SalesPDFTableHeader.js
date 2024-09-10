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
    width: '10%',
    fontWeight: 70,
    fontStyle: 'bold'
  },
  refNo: {
    width: '10%',
    fontWeight: 70,
    fontStyle: 'bold'
  },
  particular: {
    width: '10%',
    fontWeight: 70,
    fontSize: '9px',
    fontStyle: 'bold'
  },
  amount: {
    width: '5%',
    fontWeight: 70,
    fontSize: '9px',
    fontStyle: 'bold'
  }
});

const LedgerPDFTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.particular}>GSTIN</Text>
    <Text style={styles.particular}>Name</Text>
    <Text style={styles.amount}>POS</Text>
    <Text style={styles.amount}>No</Text>
    <Text style={styles.amount}>Date</Text>
    <Text style={styles.particular}>Inv Value</Text>
    <Text style={styles.particular}>Taxable Value</Text>
    <Text style={styles.amount}>SGST</Text>
    <Text style={styles.amount}>CGST</Text>
    <Text style={styles.amount}>IGST</Text>
    <Text style={styles.amount}>Round</Text>
    <Text style={styles.particular}>Balance</Text>
    <Text style={styles.amount}>Disc</Text>
    <Text style={styles.particular}>IRN</Text>
    <Text style={styles.amount}>E-WAY</Text>
  </View>
);

export default LedgerPDFTableHeader;