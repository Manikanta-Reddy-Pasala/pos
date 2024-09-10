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
        width: '50%',
    }
  });

  const LedgerPDFTableHeader = (isPayable) => (
    <View style={styles.container}>
        <Text style={styles.description}>Name</Text>
        <Text style={styles.description}>{isPayable === true ? 'To Pay' : 'To Receive'}</Text>
    </View>
  );
  
  export default LedgerPDFTableHeader