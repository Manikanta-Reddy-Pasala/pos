import React from 'react';
import { Page, Document, StyleSheet, Text, View } from '@react-pdf/renderer';
import LedgerPDFTableHeader from './CashBookPDFTableHeader';
import LedgerPDFTableRow from './CashBookPDFTableRow';
import LedgerPDFTableFooter from './CashBookPDFTableFooter';
import { pdfContainerStyles } from '../Styles/style';

const styles = StyleSheet.create(pdfContainerStyles);

const CashBookPDF = (props) => (
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
        <Text style={styles.ledgerTitle}>Cash Book</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.customerTitle}>{props.date}</Text>
      </View>

      <View style={styles.tableContainer}>
        <LedgerPDFTableHeader />
        <LedgerPDFTableRow items={props.data} />
        <LedgerPDFTableFooter total={props.total} />
      </View>
    </Page>
  </Document>
);
export default CashBookPDF;
