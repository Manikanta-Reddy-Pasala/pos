import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableHeaderStyles } from '../Styles/style';

const styles = StyleSheet.create(pdfTableHeaderStyles);

  const LedgerPDFTableHeader = () => (
    <View style={styles.container}>
        <Text style={styles.description}>Date</Text>
        <Text style={styles.refNo}>Ref No.</Text>
        <Text style={styles.particular}>Particulars</Text>
        <Text style={styles.description}>Type</Text>
        <Text style={styles.amount}>Cash In</Text>
        <Text style={styles.amount}>Cash Out</Text>
    </View>
  );
  
  export default LedgerPDFTableHeader