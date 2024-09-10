import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

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
        flexGrow: 1,
    },
    description: {
        width: '10%',
    },
    refNo: {
        width: '5%',
    },
    particular: {
        width: '25%',
    },
    amount: {
        width: '20%',
    }
  });

  const LedgerPDFTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.description}>Ref No.</Text>
        <Text style={styles.description}>Date</Text>
        <Text style={styles.description}>Due Date</Text>
        <Text style={styles.particular}>Vendor</Text>
        <Text style={styles.refNo}>Age</Text>
        <Text style={styles.amount}>Total Amount</Text>
        <Text style={styles.amount}>Balance Due</Text>
    </View>
  );
  
  export default LedgerPDFTableHeader