import React from 'react';
import { Page, Document, StyleSheet, Text, View } from '@react-pdf/renderer';
import LedgerPDFTableHeader from './DayBookPDFTableHeader';
import LedgerPDFTableRow from './DayBookPDFTableRow';
import DayBookPDFTableCreditFooter from './DayBookPDFTableCreditFooter';
import DayBookPDFTableDebitFooter from './DayBookPDFTableDebitFooter';
import {pdfContainerStyles} from '../Styles/style'
const styles = StyleSheet.create({
  
  ...pdfContainerStyles,
  companyOtherData: {
    fontSize: 12,
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  customerTitle: {
    fontSize: 10,
    textAlign:"center"
  },
  customerOtherData: {
    fontSize: 10,
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

const DayBookPDF = (props) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.titleContainer}>
        <Text style={styles.reportTitle}>{props.settings.strCompanyName}</Text>
        <Text style={styles.companyOtherData}>{props.settings.strAddress}</Text>
        <Text style={styles.companyOtherData}>
          Ph No: {props.settings.strPhone}
        </Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.ledgerTitle}>Day Book</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.customerTitle}>{props.date}</Text>
      </View>

      <View style={styles.tableContainer}>
        <LedgerPDFTableHeader />
        <LedgerPDFTableRow
          items={props.data}
        />
        <DayBookPDFTableCreditFooter total={props.total} />
        <DayBookPDFTableDebitFooter total={props.total} />
      </View>
    </Page>
  </Document>
);
export default DayBookPDF;