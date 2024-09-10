import React from 'react'
import
  {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Image
  } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'column', padding: 25 },
  table: {
    fontSize: 10,
    width: 550,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'stretch',
    flexWrap: 'nowrap',
    alignItems: 'stretch'
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignContent: 'stretch',
    flexWrap: 'nowrap',
    alignItems: 'stretch',
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: 35
  },
  cell: {
    // borderColor: '#cc0000',
    // borderStyle: 'solid',
    // borderWidth: 2,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    alignSelf: 'stretch'
  },
  header: {
    backgroundColor: '#eee'
  },
  headerText: {
    fontSize: 11,
    fontWeight: 1200,
    color: '#1a245c',
    margin: 8
  },
  tableText: {
    margin: 10,
    fontSize: 10,
    color: 'neutralDark'
  }
});

export default function PdfTemplate(props)
{
  return (
    <Document>
      <Page style={styles.page} size='A4' wrap>
        <View>
          <View>
            <Text>My company</Text>
            <Text>Phone no: +91-9632587410 </Text>
          </View>
          <View>
            <Text>Tax Invoice</Text>
          </View>
          <View>
            <Text>Bill to:</Text>
            <Text>Nandhini</Text>
          </View>
          <View>
            <Text>Invoice No: 6</Text>
            <Text>Date: 01/01/2021</Text>
          </View>
          <View style={styles.table}>
            <View style={[styles.row, styles.header]}>
              <Text style={[styles.headerText, styles.cell]}>Column 1 Header</Text>
              <Text style={[styles.headerText, styles.cell]}>Column 2 Header</Text>
              <Text style={[styles.headerText, styles.cell]}>Column 3 Header</Text>
              <Text style={[styles.headerText, styles.cell]}>Column 4 Header</Text>
            </View>
            <View style={[styles.row]}>
              <Text style={[styles.cell]}>Column 1 Row 1</Text>
              <Text style={[styles.cell]}>Column 2 Row 1</Text>
              <Text style={[styles.cell]}>Column 3 Row 1</Text>
              <Text style={[styles.cell]}>Column 4 Row 1</Text>
            </View>
            <View style={[styles.row]}>
              <Text style={[styles.cell]}>Column 1 Row 2</Text>
              <Text style={[styles.cell]}>Column 2 Row 2</Text>
              <Text style={[styles.cell]}>Column 3 Row 2</Text>
              <Text style={[styles.cell]}>Column 4 Row 2</Text>
            </View>
          </View></View>
      </Page>
    </Document>)
}
