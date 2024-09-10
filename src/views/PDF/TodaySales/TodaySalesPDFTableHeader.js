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
  particularLong: {
    width: '20%',
    fontWeight: 70
  },
  amount: {
    width: '5%',
    fontWeight: 70
  }
});

const LedgerPDFTableHeader = () => (
  <View style={styles.container}>
    <Text style={styles.particularLong}>Date</Text>
    <Text style={styles.particularLong}>Invoice No</Text>
    <Text style={styles.particularLong}>Customer</Text>
    <Text style={styles.particular}>Payment Type</Text>
    <Text style={styles.particular}>Amount</Text>
    <Text style={styles.particular}>Balance</Text>
    <Text style={styles.particular}>Status</Text>
  </View>
);

export default LedgerPDFTableHeader;