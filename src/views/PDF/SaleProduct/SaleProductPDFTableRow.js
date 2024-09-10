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
  particularFree: {
    width: '20%',
    fontWeight: 70,
    fontSize:'10px'
  },
  amount: {
    width: '5%',
    fontWeight: 70,
    fontSize:'10px'
  }
});

function getAverageAmount(amount, qty) {
  let result = amount / qty;
  return parseFloat(result || 0).toFixed(2);
}



const LedgerPDFTableRow = ({ items, selectedBankAccountForFiltering,page }) => {
  const rows = items.map((item) => (
    <>
    {page == "sales" ? (<View style={styles.row}>
      <Text style={styles.particular}>{item.productName}</Text>
      <Text style={styles.particular}>{item.categoryLevel2DisplayName}</Text>
      <Text style={styles.particular}>{item.categoryLevel3DisplayName}</Text>
      <Text style={styles.particular}>{item.saleQty}</Text>
      <Text style={styles.particular}>{item.saleAmount}</Text>
      <Text style={styles.particular}>{getAverageAmount(
            item.saleAmount,
            item.saleQty
          )}</Text>
      <Text style={styles.particular}>{item.purchaseQty}</Text>
      <Text style={styles.particular}>{item.purchaseAmount}</Text>
      <Text style={styles.particular}>{getAverageAmount(
            item.purchaseAmount,
            item.purchaseQty
          )}</Text>
    </View>):(
      <View style={styles.row}>
        <Text style={styles.particularFree}>{item.productName}</Text>
        <Text style={styles.particularFree}>{item.categoryLevel2DisplayName}</Text>
        <Text style={styles.particularFree}>{item.categoryLevel3DisplayName}</Text>
        <Text style={styles.particularFree}>{item.freeQty}</Text>
    </View>)}
    </>
    
  ));
  return <Fragment>{rows}</Fragment>;
};

export default LedgerPDFTableRow;