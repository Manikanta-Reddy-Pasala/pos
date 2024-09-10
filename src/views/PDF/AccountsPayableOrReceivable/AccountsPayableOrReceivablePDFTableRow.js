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
        width: '50%'
    }
  });

const LedgerPDFTableRow = ({items}) => {
    const rows = items.map( item => 
        <View style={styles.row}>
            <Text style={styles.description}>{item.name}</Text>
            <Text style={styles.description}>{item.toPay}</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default LedgerPDFTableRow