import React from 'react';
import { Text, Font, View, StyleSheet } from '@react-pdf/renderer';

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
    width: '15%',
    textAlign:'left'
  },
  refNo: {
    width: '10%'
  },
  amount: {
    width: '15%',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700',
    textAlign: 'right',
    paddingRight: '10px',
    paddingLeft: '10px'
  },
  status: {
    width: '15%',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700',
    textAlign: 'left',
    paddingRight: '10px',
    paddingLeft: '10px'
  },
  particulars: {
    width: '30%',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700',
    textAlign: 'left',
    paddingLeft: '10px'
  },
  voucherType: {
    width: '20%',
    textAlign: 'left',
    paddingRight: '10px'
  },
  voucherNo: {
    width: '10%',
    textAlign: 'right',
    paddingRight: '10px'
  }
});

const DoctorSessionGroupPDFTableHeader = ({ enableBalance }) => (
  <View style={styles.container}>
    <Text style={styles.description}>Date</Text>
    <Text style={styles.voucherType}>Doctor</Text>
    <Text style={styles.voucherType}>Client</Text>
    <Text style={styles.amount}>Start Time</Text>
    <Text style={styles.amount}>End Time</Text>
    <Text style={styles.status}>Status</Text>
  </View>
);

export default DoctorSessionGroupPDFTableHeader;