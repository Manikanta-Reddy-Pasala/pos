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
        width: '20%',
        textAlign:'center',
        paddingRight:'10px',
        fontFamily: 'Helvetica-Bold',
        fontWeight: '700'
    },
    voucherNo: {
        width: '10%',
        textAlign:'center',
        paddingRight:'10px'
    },
    refNo: {
        width: '10%'
    },
    amount: {
        width: '15%',
        textAlign:'center',
        paddingRight:'10px',
        paddingLeft:'10px'
    },
    particulars: {
        width: '30%',
        textAlign:'left',
        paddingLeft:'10px',
        fontFamily: 'Helvetica-Bold',
        fontWeight: '700'
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


const SessionGroupPDFTableRow = ({items,enableBalance}) => {
    
    const rows = items.map( item => 
        <View style={styles.row}>  
            <Text style={styles.date}>{getDateFormat(item)}</Text>
            <Text style={styles.particulars}>{wrapText(item.customerName)}</Text> 
            <Text style={styles.voucherType}>{item.noOfSession}</Text>
            <Text style={styles.amount}>{item.pendingCount}</Text>
            <Text style={styles.amount}>{item.completedCount}</Text>
            <Text style={styles.amount}>{item.cancelledCount}</Text>
        </View>
    )
    return (<Fragment>{rows}</Fragment> )
};
  
export default SessionGroupPDFTableRow