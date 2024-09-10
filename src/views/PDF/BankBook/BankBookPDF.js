import React from 'react';
import { Page, Document, StyleSheet, Text, View } from '@react-pdf/renderer';
import LedgerPDFTableHeader from './BankBookPDFTableHeader';
import LedgerPDFTableRow from './BankBookPDFTableRow';
import LedgerPDFTableFooter from './BankBookPDFTableFooter';
import { pdfContainerStyles } from '../Styles/style';

const styles = StyleSheet.create(pdfContainerStyles);

const BankBookPDF = (props) => (
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
        <Text style={styles.ledgerTitle}>Bank Book</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.customerTitle}>{props.date}</Text>
        <Text style={styles.customerOtherData}>
          Bank Name: {props.bankName}
        </Text>
      </View>

      <View style={styles.tableContainer}>
        <LedgerPDFTableHeader />
        <LedgerPDFTableRow
          items={props.data}
          selectedBankAccountForFiltering={
            props.selectedBankAccountForFiltering
          }
        />
        <LedgerPDFTableFooter total={props.total} />
      </View>
    </Page>
  </Document>
);
export default BankBookPDF;