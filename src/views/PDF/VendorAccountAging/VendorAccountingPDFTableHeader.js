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
        width: '10%'
    },
    particular: {
        width: '20%'
    },
    amount: {
        width: '10%'
    }
  });

  const LedgerPDFTableHeader = ({type}) => (
    <View style={styles.container}>
        <Text style={styles.particular}>Name</Text>
        <Text style={styles.description}>Ph No.</Text>
        <Text style={styles.amount}>Current</Text>
        <Text style={styles.amount}>1-15 Days</Text>
        <Text style={styles.amount}>16-30 Days</Text>
        <Text style={styles.amount}>31-45 Days</Text>
        <Text style={styles.amount}>46-60 Days</Text>
        <Text style={styles.amount}>Over 60 Days</Text>
        {type == 'Payable' &&<Text style={styles.amount}>Total Payable</Text>}
        {type == 'Receivable' &&<Text style={styles.amount}>Total Receivable</Text>}
    </View>
  );
  
  export default LedgerPDFTableHeader