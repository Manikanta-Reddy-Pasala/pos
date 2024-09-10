import React, { Fragment } from 'react';
import { Text, View, StyleSheet,Font } from '@react-pdf/renderer';

Font.register({
    family: 'Roboto',
    src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap',
  });

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
        flexGrow: 1,
        fontSize: 9,
        // borderBottomWidth: 1,
        // borderBottomColor: '#D3D3D3'
    },
    rowFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
        flexGrow: 1,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        fontWeight: '700',
        borderBottomColor: '#000000',
        borderBottomWidth: 1,
        borderTopColor: '#000000',
        borderTopWidth: 1,
        // borderBottomWidth: 1,
        // borderBottomColor: '#D3D3D3'
    },
    description: {
        width: '60%',
        fontFamily: 'Helvetica-Bold',
        fontWeight: '700'
    },
    refNo: {
        width: '10%'
    },
    amount: {
        width: '40%',
        textAlign:'right',
        paddingRight:'10px'
    },
    amount1: {
        width: '30%',
        textAlign: 'center'
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
    debitCredit: {
        width: '50%',
        textAlign:'right',
        paddingRight:'10px'
    },
});

const LedgerPDFTableRow = ({ items, enableBalance,type }) => {
    
    let totalDebit=0;
    let totalCredit=0;
    if(enableBalance){
        totalDebit = items.reduce((total, item) => total + item.debit, 0);
        totalCredit = items.reduce((total, item) => total + item.credit, 0);
    }

    const totalClosingBalance = items.reduce((total, item) => total + item.closingBalance, 0);
    const totalOpeningBalance = items.reduce((total, item) => total + item.openingBalance, 0);

    function formatNumber(number) {
        return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    let rows = items.map(item => {
        let debit = '';
        let credit = '';
        if(!enableBalance){
            if (item.closingBalance < 0) {
                debit = item.closingBalance;
            }
            if (item.closingBalance > 0) {
                credit = item.closingBalance;
            }
            if (item.closingBalance < 0) {
                totalDebit += parseFloat(item.closingBalance);
            }
            if (item.closingBalance > 0) {
                totalCredit += parseFloat(item.closingBalance);
            }
        }else{
            debit= (item.debit == 0)?'':item.debit;
            credit= (item.credit == 0)?'':item.credit;
        }
        
        
        
        return(
            <View style={styles.row}>
                <Text style={styles.description}>{item.name}</Text>
                {enableBalance && <Text style={styles.amount}>{(item.openingBalance == 0) ? '' : (item.openingBalance < 0 ? formatNumber(Math.abs(item.openingBalance)) + ' Dr' : formatNumber(item.openingBalance) + ' Cr')}</Text>}
                <View style={styles.childContainer}>
                    <Text style={styles.debitCredit}>{debit == 0 ? "" : formatNumber(Math.abs(debit))}</Text>
                    <Text style={styles.debitCredit}>{credit == 0 ? "" : formatNumber(Math.abs(credit))}</Text>
                </View>

                {enableBalance && <Text style={styles.amount}>{item.closingBalance < 0 ? formatNumber(Math.abs(item.closingBalance)) + ' Dr' : formatNumber(item.closingBalance) + ' Cr'}</Text>}
            </View>
        )
    });

    rows.push(
        <View style={styles.rowFooter} key="footer">
            <Text style={styles.description}>Total</Text>
            {enableBalance && <Text style={styles.amount}>{(totalOpeningBalance == 0) ? '' : (totalOpeningBalance < 0 ? formatNumber(Math.abs(totalOpeningBalance)) + ' Dr' : formatNumber(totalOpeningBalance) + ' Cr')}</Text>}
            <View style={styles.childContainer}>
                <Text style={styles.debitCredit}>{totalDebit == 0 ? "" : formatNumber(Math.abs(totalDebit))}</Text>
                <Text style={styles.debitCredit}>{totalCredit == 0 ? "" : formatNumber(Math.abs(totalCredit))}</Text>
            </View>
            {enableBalance && <Text style={styles.amount}>{totalClosingBalance < 0 ? formatNumber(Math.abs(totalClosingBalance)) + ' Dr' : formatNumber(totalClosingBalance) + ' Cr'}</Text>}
        </View>
    );
    return (<Fragment>{rows}</Fragment>)
};

export default LedgerPDFTableRow