export const prepareHeaderRow = (filteredColumns, type, customerType) => {
  filteredColumns.push({
    header: 'INVOICE NO',
    key: 'invoiceNo',
    width: 15
  });
  filteredColumns.push({
    header: 'DATE',
    key: 'date',
    width: 15
  });
  filteredColumns.push({
    header: customerType + ' NAME',
    key: 'customerName',
    width: 20
  });
  filteredColumns.push({
    header: 'ITEM NAME',
    key: 'itemName',
    width: 20
  });
  filteredColumns.push({
    header: 'ITEM SERIAL NO',
    key: 'itemSerialNo',
    width: 25
  });
  filteredColumns.push({
    header: 'QTY',
    key: 'qty',
    width: 15
  });
  filteredColumns.push({
    header: type + ' AMOUNT',
    key: 'amount',
    width: 20
  });
};

export const prepareWarrantyHeaderRow = (filteredColumns) => {
  filteredColumns.push({
    header: 'PRODUCT NAME',
    key: 'productName',
    width: 25
  });
  filteredColumns.push({
    header: 'SALE QTY',
    key: 'saleQty',
    width: 15
  });
  filteredColumns.push({
    header: 'SALE DATE',
    key: 'saleDate',
    width: 15
  });
  filteredColumns.push({
    header: 'INVOICE NO',
    key: 'invoiceNo',
    width: 15
  });
  filteredColumns.push({
    header: 'WARRANTY DAYS',
    key: 'warrantyDays',
    width: 15
  });
  filteredColumns.push({
    header: 'WARRANTY END DATE',
    key: 'warrantyEndDate',
    width: 22
  });
  filteredColumns.push({
    header: 'DAYS LEFT',
    key: 'daysLeft',
    width: 15
  });
  filteredColumns.push({
    header: 'CUSTOMER NAME',
    key: 'customerName',
    width: 20
  });
};

export const formatDownloadExcelDate = (dateAsString) => {
  if (dateAsString !== '' && dateAsString !== null) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  } else {
    return '';
  }
}

export const formatHeaderRow = (headerRow) => {
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'd8f3fc' }
    };
    cell.font = { bold: true };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });
};