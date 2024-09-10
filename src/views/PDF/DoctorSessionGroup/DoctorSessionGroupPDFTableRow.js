import React, { Fragment } from 'react';
import { Text, View, Font, StyleSheet } from '@react-pdf/renderer';

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
    wordWrap: 'break-word'
    // borderBottomWidth: 1,
    // borderBottomColor: '#D3D3D3'
  },
  date: {
    width: '15%',
    textAlign: 'left',
    paddingRight: '10px'
    // borderRight:'1px solid grey'
  },
  description: {
    width: '15%'
  },
  voucherType: {
    width: '20%',
    textAlign: 'left',
    paddingRight: '10px',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  voucherNo: {
    width: '10%',
    textAlign: 'left',
    paddingRight: '10px'
  },
  refNo: {
    width: '10%'
  },
  amount: {
    width: '15%',
    textAlign: 'right',
    paddingRight: '10px',
    paddingLeft: '10px'
  },
  status: {
    width: '15%',
    textAlign: 'left',
    paddingRight: '10px',
    paddingLeft: '10px'
  },
  particulars: {
    width: '30%',
    textAlign: 'left',
    paddingLeft: '10px',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  }
});

const wrapText = (text, maxLength) => {
  if (text.length > maxLength) {
    const lastSpaceIndex = text.lastIndexOf(' ', maxLength);
    return (
      text.substring(0, lastSpaceIndex) +
      '\n' +
      text.substring(lastSpaceIndex + 1)
    );
  }
  return text;
};

const getDateFormat = (data) => {
  let result = '';

  if (data['sessionDate']) {
    result = data['sessionDate'];
  }
  var dateParts = result.split('-');
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
};

const DoctorSessionGroupPDFTableRow = ({ items, enableBalance }) => {
  const rows = items.map((item) => (
    <View style={styles.row}>
      <Text style={styles.date}>{getDateFormat(item)}</Text>
      <Text style={styles.voucherType}>{item.doctorName}</Text>
      <Text style={styles.voucherType}>{item.patientName}</Text>
      <Text style={styles.amount}>{item.sessionStartTime}</Text>
      <Text style={styles.amount}>{item.sessionEndTime}</Text>
      <Text style={styles.status}>{item.status}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default DoctorSessionGroupPDFTableRow;