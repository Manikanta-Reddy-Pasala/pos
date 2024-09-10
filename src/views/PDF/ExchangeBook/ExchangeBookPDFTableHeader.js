import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableHeaderStyles } from '../Styles/style';

const styles = StyleSheet.create({
  ...pdfTableHeaderStyles,
    description: {
        ...pdfTableHeaderStyles.description,
        width: '15%',
    },
    refNo: {
        ...pdfTableHeaderStyles.refNo,
        width: '10%',
    },
    particular: {
        ...pdfTableHeaderStyles.particular,
        width: '20%',
    },
    amount: {
        ...pdfTableHeaderStyles.amount,
        width: '20%',
    }
  });

  const LedgerPDFTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.description}>Date</Text>
        <Text style={styles.refNo}>Ref No.</Text>
        <Text style={styles.particular}>Particulars</Text>
        <Text style={styles.description}>Type</Text>
        <Text style={styles.particular}>Exchange</Text>
        <Text style={styles.amount}>Cash In</Text>
    </View>
  );
  
  export default LedgerPDFTableHeader