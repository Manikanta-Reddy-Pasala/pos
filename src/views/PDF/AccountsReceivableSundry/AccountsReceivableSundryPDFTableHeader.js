import React from 'react';
import {Text, View, StyleSheet,Font } from '@react-pdf/renderer';

Font.register({
    family: 'Roboto',
    src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap',
  });

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        borderTopColor: '#000000',
        borderTopWidth: 1,
        alignItems: 'center',
        height: 50,
        textAlign: 'center',
        flexGrow: 1,
        fontSize: 10,
        fontFamily: 'Helvetica-Bold',
        fontWeight: '700',
    },
    childContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
        fontSize: 10,
    },
    childContainer1: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        textAlign: 'center',
        fontStyle: 'bold',
        flexGrow: 1,
        fontSize: 10
    },
    description: {
        width: '60%'
    },
    openingBalance: {
        width: '40%'
    },
    closingBalance: {
        width: '40%'
    },
    debitCredit: {
        width: '50%',
        textAlign:'right',
        paddingRight:'10px'
    },
    closingBalance1: {
        width: '100%',
        textAlign: 'center',
    },
    refNo: {
        width: '10%',
    },
    amount: {
        width: '20%',
    },
    borderLeftRight:{
        borderLeftColor: '#000000',
        borderLeftWidth: 1,
        borderRightColor: '#000000',
        borderRightWidth: 1,
    }
    
});

  const LedgerPDFTableHeader = ({isPayable,enableBalance}) => (
    <View style={styles.container}>
        <Text style={styles.description}></Text>
        {enableBalance &&<View style={styles.openingBalance}>
            <Text>Opening</Text>
            <Text>Balance</Text>
        </View>}
        
        <View style={styles.borderLeftRight}>
            <View style={styles.childContainer1}>
                <Text style={styles.closingBalance1}>Transactions</Text>
            </View>
            <View style={styles.childContainer}>
                <Text style={styles.debitCredit}>Debit</Text>
                <Text style={styles.debitCredit}>Credit</Text>
            </View>
        </View>
        {enableBalance &&<View style={styles.closingBalance}>
            <Text>Closing</Text>
            <Text>Balance</Text>
        </View>}
        
    </View>
  );
  
  export default LedgerPDFTableHeader