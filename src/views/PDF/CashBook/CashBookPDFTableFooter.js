import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { pdfTableFooterStyles } from '../Styles/style';

const styles = StyleSheet.create(pdfTableFooterStyles);

const LedgerPDFTableFooter = ({ total }) => {
  return (
    <>
      <View style={styles.row}>
        <Text style={styles.description}>Current Total</Text>
        <Text style={styles.amount}>{total.cashIn}</Text>
        <Text style={styles.amount}>{total.cashOut}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.description}>Opening Balance :</Text>
        <Text style={styles.amountWithoutBorder}>{total.openingBalance}</Text>
        <Text style={styles.amountWithoutBorder}>&nbsp;</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.description}>Closing Balance :</Text>
        <Text style={styles.amountWithBottomBorder}>{total.closingBalance}</Text>
        <Text style={styles.amountWithBottomBorder}>&nbsp;</Text>
      </View>
    </>
  );
};

export default LedgerPDFTableFooter;
