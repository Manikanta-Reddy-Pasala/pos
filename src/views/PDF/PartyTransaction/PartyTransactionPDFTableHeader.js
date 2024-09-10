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
        width: '15%',
    },
    type: {
        width: '25%',
    },
    refNo: {
        width: '10%',
    },
    amount: {
        width: '20%',
    },
  });

  const PartyTransactionPDFTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.description}>Ref No.</Text>
        <Text style={styles.type}>Type</Text>
        <Text style={styles.description}>Date</Text>
        <Text style={styles.amount}>Total</Text>
        <Text style={styles.amount}>Balance</Text>
        <Text style={styles.refNo}>Status</Text>
    </View>
  );
  
  export default PartyTransactionPDFTableHeader