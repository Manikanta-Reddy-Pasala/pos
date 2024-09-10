import React from 'react';
import { Page, Document, StyleSheet, Text, View } from '@react-pdf/renderer';
import LedgerPDFTableHeader from './PartyTransactionPDFTableHeader';
import LedgerPDFTableRow from './PartyTransactionPDFTableRow';

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
  closingBalanceContainer: {
    flexDirection: 'row',
    marginTop: 36,
    justifyContent: 'flex-end'
  }
});

const PartyTransactionPDF = (props) => (
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
        <Text style={styles.ledgerTitle}>Party Transactions</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.customerTitle}>{props.party.name}</Text>
        {props.party.gstNumber ? (
          <Text style={styles.customerOtherData}>
            GSTN: {props.party.gstNumber}
          </Text>
        ) : (
          <View></View>
        )}
      </View>
      <View style={styles.tableContainer}>
        <LedgerPDFTableHeader />
        <LedgerPDFTableRow items={props.data} />
      </View>
      <View style={styles.closingBalanceContainer}>
        <Text style={styles.customerTitle}>
          Closing {props.party.balanceType} : {props.party.balance}
        </Text>
      </View>
    </Page>
  </Document>
);
export default PartyTransactionPDF;