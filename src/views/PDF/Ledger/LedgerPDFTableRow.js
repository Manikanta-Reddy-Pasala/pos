import React, {Fragment} from 'react';
import {Text, View,Font, StyleSheet } from '@react-pdf/renderer';

Font.register({
    family: 'Roboto',
    src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap'
  });

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 20,
        maxHeight: 50,
        textAlign: 'center',
        fontStyle: 'bold',
        // flexGrow: 1,
        fontSize: 9,
        wordWrap: 'break-word',
        // borderBottomWidth: 1,
        // borderBottomColor: '#D3D3D3'
    },
    date: {
        width: '10%',
        textAlign:'right',
        paddingRight:'10px',
        // borderRight:'1px solid grey'
    },
    description: {
        width: '15%'
    },
    voucherType: {
        width: '15%',
        textAlign:'left',
        paddingRight:'10px',
        fontFamily: 'Helvetica-Bold',
        fontWeight: '700'
        // borderRight:'1px solid grey'
    },
    voucherNo: {
        width: '10%',
        textAlign:'right',
        paddingRight:'10px',
        // borderRight:'1px solid grey'
    },
    refNo: {
        width: '10%'
    },
    amount: {
        width: '15%',
        textAlign:'right',
        paddingRight:'10px',
        paddingLeft:'10px',
        // borderRight:'1px solid grey'
    },
    particulars: {
        width: '35%',
        textAlign:'left',
        paddingLeft:'10px',
        fontFamily: 'Helvetica-Bold',
        fontWeight: '700',
        
        // maxWidth:'100px'
        // borderRight:'1px solid grey'
    },
  });

  const wrapText = (text, maxLength) => {
    if (text.length > maxLength) {
      const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
      return text.substring(0, lastSpaceIndex) + '\n' + text.substring(lastSpaceIndex + 1);
    }
    return text;
  };

  const getDateFormat = (data) => {
    let result = '';
  
    if (data['date']) {
      result = data['date'];
    }
    var dateParts = result.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  };

  function formatNumber(number) {
    
    return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }


const LedgerPDFTableRow = ({items,enableBalance}) => {
    
    const rows = items.map( item => 
        <View style={styles.row}>  
            <Text style={styles.date}>{getDateFormat(item)}</Text>
            {item.debit > 0 ? (<Text style={styles.particulars}>To {wrapText(item.customerName || item.vendorName || '', 25)}</Text>) : 
            item.credit > 0 ? (<Text style={styles.particulars}>By {wrapText(item.customerName || item.vendorName || '', 25)}</Text>): (
                <Text style={styles.particulars}>{wrapText(item.customerName)}</Text>
            )}
            <Text style={styles.voucherType}>{item.voucherType}</Text>
            <Text style={styles.voucherNo}>{item.sequenceNumber}</Text>
            <Text style={styles.amount}>{(item.debit == 0)?'':formatNumber(item.debit)}</Text>
            <Text style={styles.amount}>{(item.credit == 0)?'':formatNumber(item.credit)}</Text>
            {enableBalance && <Text style={styles.amount}>{item.runningBalance == 0 ? '' : (item.runningBalance < 0 ? formatNumber(Math.abs(item.runningBalance))+' Dr' :formatNumber(item.runningBalance)+' Cr') }</Text>}
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default LedgerPDFTableRow