import React from 'react';
import { Page, Document, StyleSheet, Text, View } from '@react-pdf/renderer';
import LedgerPDFTableHeader from './AccountsPayableOrReceivablePDFTableHeader';
import LedgerPDFTableRow from './AccountsPayableOrReceivablePDFTableRow';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 25,
    paddingRight: 25,
    lineHeight: 1.5,
    flexDirection: 'column'
  },
  logo: {
    width: 74,
    height: 66,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  titleContainer: {
    marginTop: 24
  },
  reportTitle: {
    fontSize: 16,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontStyle: 'bold'
  },
  companyOtherData: {
    fontSize: 12,
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  customerTitle: {
    fontSize: 14
  },
  customerOtherData: {
    fontSize: 12
  },
  ledgerTitle: {
    fontSize: 18,
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontStyle: 'bold'
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#D3D3D3'
  },
  openingBalanceContainer: {
    flexDirection: 'row',
    marginTop: 36,
    justifyContent: 'flex-end'
  },
  closingBalanceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});

const AccountsPayableOrReceivablePDF = (props) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.titleContainer}>
        <Text style={styles.reportTitle}>{props.settings.strCompanyName}</Text>
        <Text style={styles.companyOtherData}>{props.settings.strAddress}</Text>
        <Text style={styles.companyOtherData}>
          Ph No: {props.settings.strPhone}
        </Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.ledgerTitle}>{props.title}</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.customerTitle}>{props.date}</Text>
      </View>

      <View style={styles.tableContainer}>
        <LedgerPDFTableHeader isPayable={props.isPayable}/>
        <LedgerPDFTableRow items={props.data}/>
      </View>
      <View style={styles.openingBalanceContainer}>
        <Text style={styles.customerTitle}>
          Balance : {props.total.balance}
        </Text>
      </View>
    </Page>
  </Document>
);
export default AccountsPayableOrReceivablePDF;