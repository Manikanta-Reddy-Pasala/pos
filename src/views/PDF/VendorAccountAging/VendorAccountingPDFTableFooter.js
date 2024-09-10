import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  row: {
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
    width: '30%',
  },
  amount: {
      width: '10%'
  }
});

const LedgerPDFTableFooter = ({ total,type }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.description}>TOTAL</Text>
            <Text style={styles.amount}>{total.totalCurrent}</Text>
            <Text style={styles.amount}>{total.totalOneToFifteen}</Text>
            <Text style={styles.amount}>{total.totalSixteenToThirty}</Text>
            <Text style={styles.amount}>{total.totalThirtyoneToFortyfive}</Text>
            <Text style={styles.amount}>{total.totalFortysixTosixty}</Text>
            <Text style={styles.amount}>{total.totalOverSixty}</Text>
            {type == 'Payable' &&<Text style={styles.amount}>{total.totalPayable}</Text>}
            {type == 'Receivable' &&<Text style={styles.amount}>{total.totalReceivable}</Text>}
    </View>
  );
};

export default LedgerPDFTableFooter;