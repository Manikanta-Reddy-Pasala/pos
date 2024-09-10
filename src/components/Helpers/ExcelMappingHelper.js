export const excelMapping = {
  list: {
    1: 'name',
    2: 'productType',
    3: 'categoryLevel3',
    4: 'partNumber',
    5: 'modelNo',
    6: 'hsn',
    7: 'finalMRPPrice',
    8: 'purchasedPrice',
    9: 'purchaseDiscountPercent',
    10: 'purchaseTaxType',
    12: 'purchaseTaxIncluded',
    13: 'salePrice',
    14: 'saleDiscountPercent',
    15: 'taxType',
    17: 'taxIncluded',
    18: 'isOffLine',
    19: 'isOnLine',
    20: 'openingStockQty',
    21: 'stockReOrderQty',
    22: 'primaryUnit',
    23: 'secondaryUnit',
    24: 'unitConversionQty',
    25: 'brandName',
    26: 'shortCutCode',
    27: 'sku',
    28: 'barcode',
    29: 'warehouseData',
    30: 'rack',
    31: 'description',
    32: 'grossWeight',
    33: 'stoneWeight',
    34: 'netWeight',
    35: 'stoneCharge',
    36: 'makingChargePerGram',
    37: 'purity',
    38: 'wastagePercentage',
    39: 'wastageGrams',
    40: 'hallmarkUniqueId'
  }
};

export const updateExcelMapping = {
  list: {
    1: 'id',
    2: 'name',
    3: 'productType',
    4: 'partNumber',
    5: 'modelNo',
    6: 'hsn',
    7: 'finalMRPPrice',
    8: 'purchasedPrice',
    9: 'purchaseDiscountPercent',
    10: 'purchaseTaxType',
    12: 'purchaseTaxIncluded',
    13: 'salePrice',
    14: 'saleDiscountPercent',
    15: 'taxType',
    17: 'taxIncluded',
    18: 'isOffLine',
    19: 'isOnLine',
    20: 'openingStockQty',
    21: 'stockReOrderQty',
    22: 'primaryUnit',
    23: 'secondaryUnit',
    24: 'unitConversionQty',
    25: 'brandName',
    26: 'shortCutCode',
    27: 'sku',
    28: 'barcode',
    29: 'warehouseData',
    30: 'rack',
    31: 'description',
    32: 'grossWeight',
    33: 'stoneWeight',
    34: 'netWeight',
    35: 'stoneCharge',
    36: 'makingChargePerGram',
    37: 'purity',
    38: 'wastagePercentage',
    39: 'wastageGrams',
    40: 'hallmarkUniqueId'
  }
};

export const getColumnLetter = (colIndex) => {
  let temp;
  let letter = '';
  while (colIndex > 0) {
    temp = (colIndex - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    colIndex = (colIndex - temp - 1) / 26;
  }
  return letter;
};

export const excelPartyMapping = {
  list: {
    1: 'name',
    2: 'tallyMappingName',
    3: 'phoneNo',
    4: 'gstNumber',
    5: 'panNumber',
    6: 'emailId',
    7: 'balance',
    8: 'asOfDate',
    9: 'address',
    10: 'pincode',
    11: 'city',
    12: 'state',
    13: 'country'
  }
};

export const updateExcelPartyMapping = {
  list: {
    1: 'id',
    2: 'name',
    3: 'tallyMappingName',
    4: 'phoneNo',
    5: 'gstNumber',
    6: 'panNumber',
    7: 'emailId',
    8: 'address',
    9: 'pincode',
    10: 'city',
    11: 'state',
    12: 'country'
  }
};