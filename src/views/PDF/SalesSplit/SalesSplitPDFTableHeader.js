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
    fontSize:'8px',
    fontStyle: 'bold'
  },
  amount: {
    width: '5%',
    fontWeight: 70,
    fontSize:'8px',
    fontStyle: 'bold'
  }
});

const LedgerPDFTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.amount}>No</Text>
    <Text style={styles.amount}>Date</Text>
    <Text style={styles.amount}>Name</Text>
    <Text style={styles.amount}>GSTIN</Text>
    <Text style={styles.particular}>POS</Text>
    <Text style={styles.particular}>Hsn/Sac Code</Text>
    <Text style={styles.amount}>Item Name</Text>
    <Text style={styles.amount}>Unit</Text>
    <Text style={styles.particular}>Qty</Text>
    <Text style={styles.amount}>Item V.</Text>
    <Text style={styles.amount}>Discount</Text>
    <Text style={styles.amount}>Taxable V.</Text>
    <Text style={styles.amount}>Inv V.</Text>
    <Text style={styles.amount}>SGST</Text>
    <Text style={styles.amount}>CGST</Text>
    <Text style={styles.amount}>IGST</Text>
  </View>
);

export default LedgerPDFTableHeader;