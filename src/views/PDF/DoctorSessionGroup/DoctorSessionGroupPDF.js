import React from 'react';
import {
  Page,
  Document,
  StyleSheet,
  Text,
  View,
  Font
} from '@react-pdf/renderer';
import DoctorSessionGroupPDFTableHeader from './DoctorSessionGroupPDFTableHeader';
import DoctorSessionGroupPDFTableRow from './DoctorSessionGroupPDFTableRow';

Font.register({
  family: 'Roboto',
  src: 'https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap'
});

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
  mainTitle: {
    fontSize: 15,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  reportTitle: {
    fontSize: 11,
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  companyOtherData: {
    fontSize: 10,
    padding: 0,
    width: '60%',
    textAlign: 'center',
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
    marginTop: 24
    // borderWidth: 1,
    // borderColor: '#D3D3D3'
  },
  closingBalanceContainer: {
    flexDirection: 'row',
    marginTop: 36,
    justifyContent: 'flex-end'
  },
  container: {
    flexDirection: 'row',
    fontStyle: 'bold',
    flexGrow: 1,
    marginTop: '3%'
  },
  image: {
    width: 100,
    height: 100
  },
  w40: {
    width: '30%'
  },
  w50: {
    width: '50%'
  },
  acData: {
    fontSize: 10,
    padding: 0,
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  acTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    fontWeight: '700'
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '20px',
    // borderTop: "1px solid #C4C4C4",
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

const formatDate = (inputDate) => {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  const formattedDate = new Date(inputDate).toLocaleDateString(
    'en-GB',
    options
  );
  return formattedDate;
};

const DoctorSessionGroupPDF = (props) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.titleContainer}>
          <Text style={styles.mainTitle}>{props.settings.strCompanyName}</Text>
          <Text style={styles.companyOtherData}>
            {props.settings.strAddress}
          </Text>
          <Text style={styles.companyOtherData}>
            Ph No: {props.settings.strPhone}
          </Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.ledgerTitle}>Sessions - Doctor</Text>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.companyOtherData}>
            {formatDate(props.fromDate)} to {formatDate(props.toDate)}
          </Text>
        </View>

        <View style={styles.tableContainer}>
          <DoctorSessionGroupPDFTableHeader
            enableBalance={props.enableBalance}
          />
          <DoctorSessionGroupPDFTableRow items={props.data} />
        </View>
      </Page>
    </Document>
  );
};
export default DoctorSessionGroupPDF;