export const prepareColumnIndexMap = (columnIndexMap, txnEnableFieldsMap, taxSettingsData, isCGSTSGSTEnabledByPOS, metalList) => {
    let counter = 0;
    columnIndexMap.set('ITEM', counter);
    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true' && metalList && metalList.length > 0) {
      counter = counter + 1;
      columnIndexMap.set('TODAY RATE', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_hsn')) {
      counter = counter + 1;
      columnIndexMap.set('HSN', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_barcode')) {
      counter = counter + 1;
      columnIndexMap.set('BARCODE', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_serial_imei')) {
      counter = counter + 1;
      columnIndexMap.set('SERIAL', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_batch_number')) {
      counter = counter + 1;
      columnIndexMap.set('BATCH', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_brand')) {
      counter = counter + 1;
      columnIndexMap.set('BRAND', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_model_no')) {
      counter = counter + 1;
      columnIndexMap.set('MODEL NO', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_price')) {
      counter = counter + 1;
      columnIndexMap.set('PRICE', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_price_per_gram')) {
      counter = counter + 1;
      columnIndexMap.set('PRICE PER GRAM', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_qty')) {
      counter = counter + 1;
      columnIndexMap.set('QTY', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_free_quantity')) {
      counter = counter + 1;
      columnIndexMap.set('FREE QTY', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_unit')) {
      counter = counter + 1;
      columnIndexMap.set('UNIT', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_gross_weight')) {
      counter = counter + 1;
      columnIndexMap.set('GROSS WEIGHT', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_stone_weight')) {
      counter = counter + 1;
      columnIndexMap.set('STONE WEIGHT', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_net_weight')) {
      counter = counter + 1;
      columnIndexMap.set('NET WEIGHT', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_wastage')) {
      counter = counter + 1;
      columnIndexMap.set('WASTAGE PERCENT', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_wastage')) {
      counter = counter + 1;
      columnIndexMap.set('WASTAGE GRAMS', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_making_charge')) {
      counter = counter + 1;
      columnIndexMap.set('MC PERCENT', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_making_charge')) {
      counter = counter + 1;
      columnIndexMap.set('MC GRAMS', counter);
    }
    if (
      txnEnableFieldsMap.get('enable_product_making_charge_per_gram')
    ) {
      counter = counter + 1;
      columnIndexMap.set('MC PER GRAM', counter);
    }
    if (
      txnEnableFieldsMap.get('enable_product_making_charge') ||
      txnEnableFieldsMap.get('enable_product_making_charge_per_gram')
    ) {
      counter = counter + 1;
      columnIndexMap.set('MC INCL', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_stone_charge')) {
      counter = counter + 1;
      columnIndexMap.set('STONE CHARGE', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_purity')) {
      counter = counter + 1;
      columnIndexMap.set('PURITY', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_hallmark_charge')) {
      counter = counter + 1;
      columnIndexMap.set('HALLMARK', counter);
    }
    if (
      txnEnableFieldsMap.get('enable_product_certification_charge')
    ) {
      counter = counter + 1;
      columnIndexMap.set('CERTIFICATION', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_discount')) {
      counter = counter + 1;
      columnIndexMap.set('DISC PERCENT', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_discount')) {
      counter = counter + 1;
      columnIndexMap.set('DISC AMOUNT', counter);
    }
    if (
      taxSettingsData && taxSettingsData.enableGst &&
      isCGSTSGSTEnabledByPOS === true
    ) {
      counter = counter + 1;
      columnIndexMap.set('CGST', counter);
      counter = counter + 1;
      columnIndexMap.set('CGST AMT', counter);
    }
    if (
      taxSettingsData && taxSettingsData.enableGst &&
      isCGSTSGSTEnabledByPOS === true
    ) {
      counter = counter + 1;
      columnIndexMap.set('SGST', counter);
      counter = counter + 1;
      columnIndexMap.set('SGST AMT', counter);
    }
    if (
      taxSettingsData && taxSettingsData.enableGst &&
      isCGSTSGSTEnabledByPOS === false &&
      txnEnableFieldsMap.get('enable_product_igst')
    ) {
      counter = counter + 1;
      columnIndexMap.set('IGST', counter);
      counter = counter + 1;
      columnIndexMap.set('IGST AMT', counter);
    }
    if (
      taxSettingsData && taxSettingsData.enableGst &&
      txnEnableFieldsMap.get('enable_tax_included')
    ) {
      counter = counter + 1;
      columnIndexMap.set('TAX INC', counter);
    }
    if (txnEnableFieldsMap.get('enable_product_cess')) {
      counter = counter + 1;
      columnIndexMap.set('CESS', counter);
    }

    return columnIndexMap;
  };