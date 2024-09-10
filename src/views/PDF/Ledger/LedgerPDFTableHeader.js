import React from 'react';
import {Text,Font, View, StyleSheet } from '@react-pdf/renderer';

Font.register({
    family: 'Roboto',
    src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap'
  });

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        borderTopColor: '#000000',
        borderTopWidth: 1,
        alignItems: 'center',
        height: 20,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        fontWeight: '500'
    },
    description: {
        width: '10%',
    },
    refNo: {
        width: '10%',
    },
    amount: {
        width: '15%',
        fontFamily: 'Helvetica-Bold',
        fontWeight: '700',
        textAlign:'right',
        paddingRight:'10px',
        paddingLeft:'10px',
    },
    particulars: {
        width: '35%',
        fontFamily: 'Helvetica-Bold',
        fontWeight: '700',
        textAlign:'left',
        paddingLeft:'10px',
    },
    voucherType: {
        width: '15%',
        textAlign:'left',
        paddingRight:'10px'
    },
    voucherNo: {
        width: '10%',
        textAlign:'right',
        paddingRight:'10px'
    },
  });

  const LedgerPDFTableHeader = ({enableBalance}) => (
    <View style={styles.container}>
        <Text style={styles.description}>Date</Text>
        <Text style={styles.particulars}>Particulars</Text>
        <Text style={styles.voucherType}>Vch Type</Text>
        <Text style={styles.voucherNo}>Vch No</Text>
        <Text style={styles.amount}>Debit</Text>
        <Text style={styles.amount}>Credit</Text>
        {enableBalance && <Text style={styles.amount}>Balance</Text>}
    </View>
  );
  
  export default LedgerPDFTableHeader