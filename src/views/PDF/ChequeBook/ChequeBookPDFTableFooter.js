import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableFooterStyles } from '../Styles/style';

const styles = StyleSheet.create(pdfTableFooterStyles);

const LedgerPDFTableFooter = ({ total }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.totalCount}>Current Total</Text>
      <Text style={styles.amount}>
        <b>{total.cashIn}</b>
      </Text>
      <Text style={styles.amount}>
        <b>{total.cashOut}</b>
      </Text>
    </View>
  );
};

export default LedgerPDFTableFooter;
