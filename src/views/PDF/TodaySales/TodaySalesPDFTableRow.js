import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3'
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
    fontWeight: 70,
    fontSize:'10px'
  },
  particularLong: {
    width: '20%',
    fontWeight: 70
  },
  amount: {
    width: '5%',
    fontWeight: 70,
    fontSize:'10px'
  }
});

function getSaleStatus(saleData) {
  let result = '';

  if (saleData.balance_amount === 0) {
    result = 'Paid';
  } else if (saleData.balance_amount < saleData.total_amount) {
    result = 'Partial';
  } else {
    result = 'Un Paid';
  }
  return result;
}


const LedgerPDFTableRow = ({ items, selectedBankAccountForFiltering,page }) => {
  const rows = items.map((item) => (
    <View style={styles.row}>
      <Text style={styles.particularLong}>{item.invoice_date}</Text>
      {page == "onlineSales" || page == "todayonlineSales" ? (<Text style={styles.particularLong}>{item.invoice_number}</Text>
      ):(
        <Text style={styles.particularLong}>{item.sequenceNumber}</Text>
      )}
      <Text style={styles.particularLong}>{item.customer_name}</Text>
      <Text style={styles.particular}>{item.payment_type}</Text>
      <Text style={styles.particular}>{item.total_amount}</Text>
      <Text style={styles.particular}>{item.balance_amount}</Text>
      <Text style={styles.particular}>{getSaleStatus(item)}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default LedgerPDFTableRow;