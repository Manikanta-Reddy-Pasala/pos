import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import dateFormat from 'dateformat';

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
    width: '10%'
  },
  refNo: {
    width: '5%'
  },
  particular: {
    width: '25%'
  },
  amount: {
    width: '20%'
  }
});

function formatDownloadExcelDate(dateAsString) {
  var dateParts = dateAsString.split('-');
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}

function getAge(data, toDate) {
  var date1 = new Date(data.dueDate);
  var date2 = new Date(dateFormat(toDate, 'yyyy-mm-dd'));
  let Difference_In_Days = 0;

  if (date2 !== undefined && date1 !== undefined) {
    // To calculate the time difference of two dates
    var Difference_In_Time = date2.getTime() - date1.getTime();

    // To calculate the no. of days between two dates
    Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
  }
  return Difference_In_Days;
}

const LedgerPDFTableRow = ({ items, toDate }) => {
  const rows = items.map((item) => {
    let result = '';
    if (item.balance_amount === 0) {
        result = 'Paid';
    }else if (item.balance_amount < item.total_amount){
        result = 'Partial';
    }else{
        result = 'Un Paid';
    }
    return (
        <View style={styles.row} key={item.sequenceNumber}>
            <Text style={styles.description}>{item.sequenceNumber}</Text>
            <Text style={styles.description}>{formatDownloadExcelDate(item.invoice_date)}</Text>
            <Text style={styles.description}>{formatDownloadExcelDate(item.dueDate)}</Text>
            <Text style={styles.particular}>{item.customer_name}</Text>
            <Text style={styles.refNo}>{getAge(item, toDate)}</Text>
            <Text style={styles.amount}>{item.total_amount}</Text>
            <Text style={styles.amount}>{item.balance_amount}</Text>
            <Text style={styles.amount}>{result}</Text> 
        </View>
    );
  });
  return <Fragment>{rows}</Fragment>;
};

export default LedgerPDFTableRow;