import React, { Fragment } from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    textAlign: 'center',
    fontStyle: 'bold',
    flexGrow: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#D3D3D3'
  },
  description: {
    width: '10%',
    fontWeight: 70
  },
  refNo: {
    width: '10%',
    fontWeight: 70
  },
  particular: {
    width: '10%',
    fontWeight: 70,
    fontSize: '8px'
  },
  amount: {
    width: '5%',
    fontWeight: 70,
    fontSize: '8px'
  }
});

function formatDownloadExcelDate(dateAsString) {
  var dateParts = dateAsString.split('-');
  return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
}

function getGrossWeight(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.grossWeight || 0);
  }

  return result;
}

function getWastage(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.wastageGrams || 0);
  }

  return result;
}

function getNetWeight(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.netWeight || 0);
  }

  return result;
}

function getMakingCharge(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.makingChargeAmount || 0);
  }

  return result;
}

function getMakingChargePerGram(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.makingChargePerGramAmount || 0);
  }

  return result;
}

function getTotalDiscount(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.discount_amount || 0);
  }

  return result;
}

function getTotalTaxPercent(data) {
  let result = 0;

  for (let item of data.item_list) {
    result +=
      parseFloat(item.cgst) + parseFloat(item.sgst) + parseFloat(item.igst);
  }

  return result;
}

function getTaxableValue(data) {
  let result = 0;
  result = parseFloat(data['amount'] - data['total_tax']).toFixed(2);
  return parseFloat(result).toFixed(2);
}

function getTotalCgst(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.cgst_amount || 0);
  }

  return result;
}

function getTotalSgst(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.sgst_amount || 0);
  }

  return result;
}

function getTotalIgst(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.igst_amount || 0);
  }

  return result;
}

function getTotalCess(data) {
  let result = 0;

  for (let item of data.item_list) {
    result += parseFloat(item.cess || 0);
  }

  return result;
}

function getTotalTax(data) {
  let totalTax = 0;

  for (let item of data.item_list) {
    totalTax +=
      parseFloat(item.cgst_amount) +
      parseFloat(item.sgst_amount) +
      parseFloat(item.igst_amount) +
      parseFloat(item.cess);
  }

  return parseFloat(totalTax).toFixed(2);
}

function getItemValue(data) {
  let result = 0;
  result =
    (parseFloat(data['amount']) || 0) +
    (parseFloat(data['total_discount']) || 0) -
    (parseFloat(data['total_tax']) || 0);
  return parseFloat(result).toFixed(2);
}

const LedgerPDFTableRow = ({ items, selectedBankAccountForFiltering }) => {
  const rows = items.map((item) => (
    <View style={styles.row}>
      <Text style={styles.amount}>{item.sequenceNumber}</Text>
      <Text style={styles.particular}>
        {formatDownloadExcelDate(item.invoice_date)}
      </Text>
      <Text style={styles.amount}>{item.customer_name}</Text>
      <Text style={styles.amount}>{item.customerGSTNo}</Text>
      <Text style={styles.amount}>{item.place_of_supply}</Text>
      <Text style={styles.particular}>{item.hsn}</Text>
      <Text style={styles.amount}>{item.itemName}</Text>
      <Text style={styles.amount}>{item.qtyUnit}</Text>
      <Text style={styles.particular}>{item.qty}</Text>
      <Text style={styles.amount}>{getItemValue(item)}</Text>
      <Text style={styles.amount}>{item.total_discount}</Text>
      <Text style={styles.amount}>{getTaxableValue(item)}</Text>
      <Text style={styles.amount}>
        {parseFloat(item.total_amount).toFixed(2)}
      </Text>
      <Text style={styles.amount}>{item.sgst_amount}</Text>
      <Text style={styles.amount}>{item.cgst_amount}</Text>
      <Text style={styles.amount}>{item.igst_amount}</Text>
    </View>
  ));
  return <Fragment>{rows}</Fragment>;
};

export default LedgerPDFTableRow;