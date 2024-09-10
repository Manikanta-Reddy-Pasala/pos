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
    fontWeight: 70
  },
  refNo: {
    width: '10%',
    fontWeight: 70
  },
  particular: {
    width: '10%',
    fontWeight: 70
  },
  particularFree: {
    width: '20%',
    fontWeight: 70
  },
  amount: {
    width: '5%',
    fontWeight: 70
  }
});

const LedgerPDFTableHeader = (props) => (
  <>
  {props.page == "sales" ? (<View style={styles.container}>
    <Text style={styles.particular}>Name</Text>
    <Text style={styles.particular}>Category</Text>
    <Text style={styles.particular}>Sub Category</Text>
    <Text style={styles.particular}>Sale Qty</Text>
    <Text style={styles.particular}>Sale Amount</Text>
    <Text style={styles.particular}>Avg Sale Amount</Text>
    <Text style={styles.particular}>Purchase Qty</Text>
    <Text style={styles.particular}>Purchase Amount</Text>
    <Text style={styles.particular}>Avg Purchase Amount</Text>
  </View>):(
    <View style={styles.container}>
      <Text style={styles.particularFree}>Name</Text>
      <Text style={styles.particularFree}>Category</Text>
      <Text style={styles.particularFree}>Sub Category</Text>
      <Text style={styles.particularFree}>Free Qty</Text>
    </View>
  )}
  </>
);

export default LedgerPDFTableHeader;