import React from 'react';
import { Page, Document, StyleSheet, Text, View, Font, } from '@react-pdf/renderer';
import LedgerPDFTableHeader from './ChequeBookPDFTableHeader';
import LedgerPDFTableRow from './ChequeBookPDFTableRow';
import LedgerPDFTableFooter from './ChequeBookPDFTableFooter';
import { pdfContainerStyles } from '../Styles/style';

const styles = StyleSheet.create(pdfContainerStyles);
Font.register({
  family: 'bold',
  src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxP.ttf',
});
Font.register({
  family: 'IBM Plex Sans',
  src: 'https://fonts.gstatic.com/s/ibmplexsans/v8/zYX-KVElMYYaJe8bpLHnCw.ttf',
});

// Register bold font
Font.register({
  family: 'IBM Plex Sans Bold',
  src: 'https://fonts.gstatic.com/s/ibmplexsans/v8/zYX-KVElMYYaJe8bpLHnCwz8hZ1ST09e9rP8N0uzd0Q.ttf',
  fontWeight: 'bold',
});
const ChequeBookPDF = (props) => (
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
        <Text style={styles.ledgerTitle}>Cheque Book</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.customerTitle}>{props.date}</Text>
      </View>

      <View style={styles.tableContainer}>
        <LedgerPDFTableHeader />
        <LedgerPDFTableRow
          items={props.data}
        />
        <LedgerPDFTableFooter total={props.total} />
      </View>
    </Page>
  </Document>
);
export default ChequeBookPDF;