import React, {Fragment} from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

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
    },
    particular: {
        width: '20%',
    },
    amount: {
        width: '10%'
    }
  });

const LedgerPDFTableRow = ({items,type}) => {
    const rows = items.map( item => 
        <View style={styles.row}>
            <Text wrap={false} style={styles.particular}>{item.customer_name}</Text>
            <Text wrap={false} style={styles.description}>{item.customer_phone_no}</Text>
            <Text style={styles.amount}>{item.current}</Text>
            <Text style={styles.amount}>{item.oneToFifteen}</Text>
            <Text style={styles.amount}>{item.sixteenToThirty}</Text>
            <Text style={styles.amount}>{item.thirtyoneToFortyfive}</Text>
            <Text style={styles.amount}>{item.fortysixTosixty}</Text>
            <Text style={styles.amount}>{item.overSixty}</Text>
            {type == 'Receivable' &&<Text style={styles.amount}>{item.totalReceivable}</Text>}
            {type == 'Payable' &&<Text style={styles.amount}>{item.totalPayable}</Text>}
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default LedgerPDFTableRow