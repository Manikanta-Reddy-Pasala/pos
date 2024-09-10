export const prepareStockSummaryHeaderRow = (filteredColumns, isJewellery) => {
  filteredColumns.push({
    header: 'PARTICULARS',
    key: 'particulars',
    width: 30
  });
  filteredColumns.push({ header: 'QTY', key: 'openingQty', width: 10 });
  if (isJewellery) {
    filteredColumns.push({
      header: 'NT. WT.',
      key: 'openingNetWeight',
      width: 20
    });
  }
  filteredColumns.push({
    header: 'RATE',
    key: 'openingRate',
    width: 20
  });
  filteredColumns.push({ header: 'VALUE', key: 'openingValue', width: 20 });
  filteredColumns.push({ header: 'QTY', key: 'inwardsQty', width: 10 });
  if (isJewellery) {
    filteredColumns.push({
      header: 'NT. WT.',
      key: 'inwardsNetWeight',
      width: 20
    });
  }
  filteredColumns.push({
    header: 'RATE',
    key: 'inwardsRate',
    width: 20
  });
  filteredColumns.push({ header: 'VALUE', key: 'inwardsValue', width: 20 });
  filteredColumns.push({ header: 'QTY', key: 'outwardsQty', width: 10 });
  if (isJewellery) {
    filteredColumns.push({
      header: 'NT. WT.',
      key: 'outwardsNetWeight',
      width: 20
    });
  }
  filteredColumns.push({
    header: 'RATE',
    key: 'outwardsRate',
    width: 20
  });
  filteredColumns.push({ header: 'VALUE', key: 'outwardsValue', width: 20 });
  filteredColumns.push({ header: 'CONSUMPTION', key: 'consumption', width: 20 });
  filteredColumns.push({ header: 'GROSS PROFIT', key: 'grossProfit', width: 20 });
  filteredColumns.push({ header: 'PERC %', key: 'percentage', width: 20 });
  filteredColumns.push({ header: 'QTY', key: 'closingQty', width: 10 });
  if (isJewellery) {
    filteredColumns.push({
      header: 'NT. WT.',
      key: 'closingNetWeight',
      width: 20
    });
  }
  filteredColumns.push({
    header: 'RATE',
    key: 'closingRate',
    width: 20
  });
  filteredColumns.push({ header: 'VALUE', key: 'closingValue', width: 20 });
};


export const prepareTxnByProductHeaderRow = (filteredColumns, isJewellery) => {
  filteredColumns.push({
    header: 'DATE',
    key: 'txnDate',
    width: 30
  });
  filteredColumns.push({
    header: 'PARTICULARS',
    key: 'particulars',
    width: 30
  });
  filteredColumns.push({
    header: 'VCH TYPE',
    key: 'txnType',
    width: 30
  });
  filteredColumns.push({
    header: 'VCH NO',
    key: 'sequenceNumber',
    width: 30
  });
  
  filteredColumns.push({ header: 'QTY', key: 'inwardsQty', width: 10 });
  if (isJewellery) {
    filteredColumns.push({
      header: 'NT. WT.',
      key: 'inwardsNetWeight',
      width: 20
    });
  }
  filteredColumns.push({
    header: 'RATE',
    key: 'inwardsRate',
    width: 20
  });
  filteredColumns.push({ header: 'VALUE', key: 'inwardsValue', width: 20 });
  filteredColumns.push({ header: 'QTY', key: 'outwardsQty', width: 10 });
  if (isJewellery) {
    filteredColumns.push({
      header: 'NT. WT.',
      key: 'outwardsNetWeight',
      width: 20
    });
  }
  filteredColumns.push({
    header: 'RATE',
    key: 'outwardsRate',
    width: 20
  });
  filteredColumns.push({ header: 'VALUE', key: 'outwardsValue', width: 20 });
  filteredColumns.push({ header: 'CONSUMPTION', key: 'consumption', width: 20 });
  filteredColumns.push({ header: 'GROSS PROFIT', key: 'grossProfit', width: 20 });
  filteredColumns.push({ header: 'PERC %', key: 'percentage', width: 20 });
  filteredColumns.push({ header: 'QTY', key: 'closingQty', width: 10 });
  if (isJewellery) {
    filteredColumns.push({
      header: 'NT. WT.',
      key: 'closingNetWeight',
      width: 20
    });
  }
  filteredColumns.push({
    header: 'RATE',
    key: 'closingRate',
    width: 20
  });
  filteredColumns.push({ header: 'VALUE', key: 'closingValue', width: 20 });
};