export default class SaleProduct {
 /* getDefaultValues() {
    product_id = '';
    description = '';
    imageUrl = '';
    batch_id = 0;
    item_name = '';
    sku = '';
    barcode = '';
    mrp = 0;
    purchased_price = 0;
    offer_price = 0;
    mrp_before_tax = 0;
    size = 0;
    qty = 0;
    freeQty = 0;
    freeStockQty = 0;
    cgst = 0;
    sgst = 0;
    igst = 0;
    cess = 0;
    taxType = '';
    igst_amount = 0;
    cgst_amount = 0;
    sgst_amount = 0;
    taxIncluded = false;
    discount_percent = 0;
    discount_amount = 0;
    discount_amount_per_item = 0;
    discount_type = '';
    amount = 0;
    roundOff = 0;
    isEdit = false;
    returnedQty = 0;
    returnedFreeQty = 0;
    stockQty = 0;
    vendorName = '';
    vendorPhoneNumber = '';
    brandName = '';
    categoryLevel2 = '';
    categoryLevel2DisplayName = '';
    categoryLevel3 = '';
    categoryLevel3DisplayName = '';
    wastagePercentage = '';
    wastageGrams = '';
    grossWeight = '';
    netWeight = '';
    purity = '';
    hsn = '';
    makingChargePercent = 0;
    makingChargeAmount = 0;
    makingChargePerGramAmount = 0;
    makingChargeType = '';
    serialOrImeiNo = '';
    finalMRPPrice = 0;
    makingChargeIncluded = false;
    qtyUnit = '';
    primaryUnit = null;
    secondaryUnit = null;
    unitConversionQty = 0;
    units = [];
    originalMrpWithoutConversionQty = 0;
    mfDate = null;
    expiryDate = null;
    rack = '';
    warehouseData = '';
  }

  convertTypes(data) {
    const floatFields = [
      'mrp',
      'purchasedPrice',
      'offerPrice',
      'mrpBeforeTax',
      'size',
      'qty',
      'freeQty',
      'freeStockQty',
      'cgst',
      'sgst',
      'igst',
      'cess',
      'igstAmount',
      'cgstAmount',
      'sgstAmount',
      'discountPercent',
      'discountAmount',
      'discountAmountPerItem',
      'amount',
      'roundOff',
      'returnedQty',
      'stockQty',
      'wastagePercentage',
      'wastageGrams',
      'grossWeight',
      'netWeight',
      'purity',
      'makingChargePercent',
      'makingChargeAmount',
      'makingChargePerGramAmount',
      'finalMRPPrice',
      'unitConversionQty',
      'originalMrpWithoutConversionQty'
    ];

    const stringFields = [
      'product_id',
      'description',
      'imageUrl',
      'item_name',
      'sku',
      'barcode',
      'taxType',
      'discount_type',
      'vendorName',
      'vendorPhoneNumber',
      'brandName',
      'categoryLevel2',
      'categoryLevel2DisplayName',
      'categoryLevel3',
      'categoryLevel3DisplayName',
      'purity',
      'hsn',
      'makingChargeType',
      'serialOrImeiNo',
      'qtyUnit',
      'primaryUnit',
      'secondaryUnit',
      'mfDate',
      'expiryDate',
      'rack',
      'warehouseData'
    ];

    const numberFields = ['batch_id'];

    const booleanFields = ['taxIncluded', 'isEdit', 'makingChargeIncluded'];

    floatFields.forEach((field) => {
      if (typeof data[field] === 'string') {
        data[field] = data[field].trim();
      }
      data[field] = parseFloat(data[field]) || 0.0;
    });

    intFields.forEach((field) => {
      if (typeof data[field] === 'string') {
        data[field] = data[field].trim();
      }
      data[field] = parseInt(data[field]) || 0;
    });

    numberFields.forEach((field) => {
      if (typeof data[field] === 'string') {
        data[field] = data[field].trim();
      }
      data[field] = Number(data[field]) || 0;
    });

    booleanFields.forEach((field) => {
      data[field] = Boolean(data[field]);
    });

    stringFields.forEach((field) => {
      if (!data[field]) {
        data[field] = '';
      }
    });

    return data;
  }*/
}
