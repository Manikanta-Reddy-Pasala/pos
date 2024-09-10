import * as Bd from '../../components/SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

export const saveProductTxnFromSales = async (
  txnData,
  db,
  commonIds = [],
  missingIds = [],
  newIds = []
) => {
  const insertArray = [];
  const updateArray = [];
  const deleteArray = [];

  for (let item of txnData.item_list) {
    let productTxn = {};

    // console.log('productID::', item.product_id);

    productTxn.id =
      txnData.invoice_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0);

    productTxn.sequenceNumber = txnData.sequenceNumber;

    productTxn.businessId = txnData.businessId;
    productTxn.businessCity = txnData.businessCity;
    productTxn.txnId = txnData.invoice_number;
    productTxn.txnType = 'Sales';
    productTxn.txnDate = txnData.invoice_date;
    productTxn.updatedAt = Date.now();
    productTxn.posId = txnData.posId;
    //supplier data
    productTxn.vendorName = item.vendorName;
    productTxn.vendorPhoneNumber = item.vendorPhoneNumber;
    //customer data
    productTxn.customerId = txnData.customer_id;
    productTxn.customerName = txnData.customer_name;
    productTxn.customerPhoneNo = txnData.customer_phoneNo;
    productTxn.customerGSTNo = txnData.customerGSTNo;
    productTxn.customerGstType = txnData.customerGstType;
    //product data
    productTxn.productId = item.product_id;
    productTxn.productName = item.item_name;
    productTxn.purchasedPrice = item.purchased_price || 0;
    productTxn.purchased_price_before_tax =
      item.purchased_price_before_tax !== null &&
      item.purchased_price_before_tax !== undefined
        ? item.purchased_price_before_tax
        : 0;
    productTxn.salePrice =
      item.mrp !== null && item.mrp !== undefined ? item.mrp : 0;
    productTxn.offerPrice =
      item.offer_price !== null && item.offer_price !== undefined
        ? item.offer_price
        : 0;
    productTxn.mrp_before_tax =
      item.mrp_before_tax !== null && item.mrp_before_tax !== undefined
        ? item.mrp_before_tax
        : 0;

    //
    productTxn.stockQty =
      item.stockQty !== null && item.stockQty !== undefined ? item.stockQty : 0;
    productTxn.freeQty =
      item.freeStockQty !== null && item.freeStockQty !== undefined
        ? item.freeStockQty
        : 0;

    // above 2 filed for just to know stock value at that time
    productTxn.freeTxnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getFreeQuantityByUnit(item) || 0
        : item.freeQty || 0;
    productTxn.amount = parseFloat(item.amount);

    productTxn.qtyUnit = item.qtyUnit;
    productTxn.unitConversionQty = item.unitConversionQty;

    productTxn.taxIncluded = item.taxIncluded ? item.taxIncluded : false;
    productTxn.taxAmount =
      (parseFloat(item.igst_amount) || 0) +
      (parseFloat(item.cgst_amount) || 0) +
      (parseFloat(item.sgst_amount) || 0);

    productTxn.cgst =
      item.cgst !== null && item.cgst !== undefined ? item.cgst : 0;
    productTxn.sgst =
      item.sgst !== null && item.sgst !== undefined ? item.sgst : 0;
    productTxn.igst =
      item.igst !== null && item.igst !== undefined ? item.igst : 0;
    productTxn.cess =
      item.cess !== null && item.cess !== undefined ? item.cess : 0;
    productTxn.sgst_amount =
      item.sgst_amount !== null && item.sgst_amount !== undefined
        ? item.sgst_amount
        : 0;
    productTxn.igst_amount =
      item.igst_amount !== null && item.igst_amount !== undefined
        ? item.igst_amount
        : 0;
    productTxn.cgst_amount =
      item.cgst_amount !== null && item.cgst_amount !== undefined
        ? item.cgst_amount
        : 0;

    productTxn.taxType = item.taxType;

    productTxn.hsn = item.hsn;
    productTxn.batchNumber = item.batch_id;
    productTxn.txnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getQuantityByUnit(item) || 0
        : item.qty || 0;

    productTxn.discount_percent =
      item.discount_percent !== null && item.discount_percent !== undefined
        ? item.discount_percent
        : 0;
    productTxn.discount_amount =
      item.discount_amount !== null && item.discount_amount !== undefined
        ? item.discount_amount
        : 0;
    productTxn.discount_type =
      item.discount_type !== null && item.discount_type !== undefined
        ? item.discount_type
        : '';
    productTxn.wastagePercentage =
      item.wastagePercentage !== null && item.wastagePercentage !== undefined
        ? item.wastagePercentage
        : 0;
    productTxn.wastageGrams =
      item.wastageGrams !== null && item.wastageGrams !== undefined
        ? item.wastageGrams
        : 0;
    productTxn.grossWeight =
      item.grossWeight !== null && item.grossWeight !== undefined
        ? item.grossWeight
        : 0;
    productTxn.netWeight =
      item.netWeight !== null && item.netWeight !== undefined
        ? item.netWeight
        : 0;

    productTxn.purity = item.purity;
    productTxn.batchActualNumber = item.batchNumber;
    productTxn.modelNo = item.modelNo;
    productTxn.mfDate = item.mfDate;
    productTxn.expiryDate = item.expiryDate;
    productTxn.rack = item.rack;
    productTxn.warehouseData = item.warehouseData;
    productTxn.barcode = item.barcode;
    productTxn.sku = item.sku;
    productTxn.serialOrImeiNo = item.serialOrImeiNo;
    productTxn.hallmarkCharge = item.hallmarkCharge;
    productTxn.certificationCharge = item.certificationCharge;

    if (item.categoryLevel2) {
      productTxn.categoryLevel2 = item.categoryLevel2;
      productTxn.categoryLevel2DisplayName = item.categoryLevel2DisplayName;
      productTxn.categoryLevel3 = item.categoryLevel3;
      productTxn.categoryLevel3DisplayName = item.categoryLevel3DisplayName;
      productTxn.brandName = item.brandName;
    }

    productTxn.properties = item.properties;
    productTxn.addOnProperties = item.addOnProperties;
    productTxn.warrantyDays = item.warrantyDays;
    productTxn.warrantyEndDate = item.warrantyEndDate;

    //check id is in commonIds or missingIds or newIds
    if (commonIds.includes(productTxn.id)) {
      updateArray.push(productTxn);
    } else if (missingIds.includes(productTxn.id)) {
      deleteArray.push(productTxn);
    } else {
      insertArray.push(productTxn);
    }
  }

  if (insertArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, insertArray, 'insert');
  }
  if (updateArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, updateArray, 'update');
  }
  if (deleteArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, deleteArray, 'delete');
  }
};

export const deleteProductTxnFromSales = async (txnData, db) => {
  // console.log('::txnData::', toJS(txnData));
  /**
   * iterate by all items
   */
  let id = '';
  for (let item of txnData.item_list) {
    // prepare by composite primary
    id =
      txnData.invoice_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0);

    const businessData = await Bd.getBusinessData();

    const query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('product txn data removed' + data);
      })
      .catch((error) => {
        console.log('product txn hand deletion Failed ' + error);
      });
  }
};

function findCommonAndNewIdsAndMissingIds(existing, txnData, txnKey) {
  const existingIds = existing.item_list.map(
    (item) =>
      existing[txnKey] +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0)
  );
  const txnDataIds = txnData.item_list.map(
    (item) =>
      txnData[txnKey] +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0)
  );

  // Find common, missing, and new IDs
  const commonIds = existingIds.filter((id) => txnDataIds.includes(id));
  const missingIds = existingIds.filter((id) => !txnDataIds.includes(id));
  const newIds = txnDataIds.filter((id) => !existingIds.includes(id));

  return { commonIds, missingIds, newIds };
}

export const deleteAndSaveProductTxnFromSales = async (
  existing,
  txnData,
  db
) => {
  const result = findCommonAndNewIdsAndMissingIds(
    existing,
    txnData,
    'invoice_number'
  );

  await saveProductTxnFromSales(
    txnData,
    db,
    result.commonIds,
    result.missingIds,
    result.newIds
  );
};

export const saveProductTxnFromSalesReturn = async (txnData, db) => {
  for (let item of txnData.item_list) {
    let productTxn = {};

    productTxn.id =
      txnData.sales_return_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0);

    productTxn.sequenceNumber = txnData.sequenceNumber;

    productTxn.businessId = txnData.businessId;
    productTxn.businessCity = txnData.businessCity;
    productTxn.txnId = txnData.sales_return_number;
    productTxn.txnType = 'Sales Return';
    productTxn.txnDate = txnData.date;
    productTxn.updatedAt = Date.now();
    productTxn.posId = txnData.posId;
    //supplier data
    productTxn.vendorName = item.vendorName;
    productTxn.vendorPhoneNumber = item.vendorPhoneNumber;
    //customer data
    productTxn.customerId = txnData.customer_id;
    productTxn.customerName = txnData.customer_name;
    productTxn.customerPhoneNo = txnData.customer_phoneNo;
    productTxn.customerGSTNo = txnData.customerGSTNo;
    productTxn.customerGstType = txnData.customerGstType;

    //product data
    productTxn.productId = item.product_id;
    productTxn.productName = item.item_name;
    productTxn.purchasedPrice =
      item.purchased_price !== null && item.purchased_price !== undefined
        ? item.purchased_price
        : 0;
    productTxn.purchased_price_before_tax =
      item.purchased_price_before_tax !== null &&
      item.purchased_price_before_tax !== undefined
        ? item.purchased_price_before_tax
        : 0;
    productTxn.salePrice =
      item.mrp !== null && item.mrp !== undefined ? item.mrp : 0;
    productTxn.mrp_before_tax =
      item.mrp_before_tax !== null && item.mrp_before_tax !== undefined
        ? item.mrp_before_tax
        : 0;
    productTxn.offerPrice =
      item.offer_price !== null && item.offer_price !== undefined
        ? item.offer_price
        : 0;
    productTxn.stockQty =
      item.stockQty !== null && item.stockQty !== undefined ? item.stockQty : 0;
    productTxn.amount =
      item.amount !== null && item.amount !== undefined ? item.amount : 0;
    productTxn.freeQty =
      item.freeStockQty !== null && item.freeStockQty !== undefined
        ? item.freeStockQty
        : 0;

    productTxn.freeTxnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getFreeQuantityByUnit(item) || 0
        : item.freeQty || 0;

    productTxn.taxIncluded = item.taxIncluded;
    productTxn.taxAmount =
      (parseFloat(item.igst_amount) || 0) +
      (parseFloat(item.cgst_amount) || 0) +
      (parseFloat(item.sgst_amount) || 0);

    productTxn.cgst =
      item.cgst !== null && item.cgst !== undefined ? item.cgst : 0;
    productTxn.sgst =
      item.sgst !== null && item.sgst !== undefined ? item.sgst : 0;
    productTxn.igst =
      item.igst !== null && item.igst !== undefined ? item.igst : 0;
    productTxn.cess =
      item.cess !== null && item.cess !== undefined ? item.cess : 0;

    productTxn.sgst_amount =
      item.sgst_amount !== null && item.sgst_amount !== undefined
        ? item.sgst_amount
        : 0;
    productTxn.igst_amount =
      item.igst_amount !== null && item.igst_amount !== undefined
        ? item.igst_amount
        : 0;
    productTxn.cgst_amount =
      item.cgst_amount !== null && item.cgst_amount !== undefined
        ? item.cgst_amount
        : 0;

    productTxn.taxType = item.taxType;

    productTxn.hsn = item.hsn;
    productTxn.batchNumber = item.batch_id;
    productTxn.txnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getQuantityByUnit(item) || 0
        : item.qty || 0;

    productTxn.discount_percent =
      item.discount_percent !== null && item.discount_percent !== undefined
        ? item.discount_percent
        : 0;
    productTxn.discount_amount =
      item.discount_amount !== null && item.discount_amount !== undefined
        ? item.discount_amount
        : 0;
    productTxn.discount_type =
      item.discount_type !== null && item.discount_type !== undefined
        ? item.discount_type
        : '';
    productTxn.wastagePercentage =
      item.wastagePercentage !== null && item.wastagePercentage !== undefined
        ? item.wastagePercentage
        : 0;
    productTxn.wastageGrams =
      item.wastageGrams !== null && item.wastageGrams !== undefined
        ? item.wastageGrams
        : 0;
    productTxn.grossWeight =
      item.grossWeight !== null && item.grossWeight !== undefined
        ? item.grossWeight
        : 0;
    productTxn.netWeight =
      item.netWeight !== null && item.netWeight !== undefined
        ? item.netWeight
        : 0;

    productTxn.purity = item.purity;
    productTxn.qtyUnit = item.qtyUnit;
    productTxn.unitConversionQty = item.unitConversionQty;
    productTxn.batchActualNumber = item.batchNumber;
    productTxn.modelNo = item.modelNo;
    productTxn.mfDate = item.mfDate;
    productTxn.expiryDate = item.expiryDate;
    productTxn.rack = item.rack;
    productTxn.warehouseData = item.warehouseData;
    productTxn.barcode = item.barcode;
    productTxn.sku = item.sku;
    productTxn.serialOrImeiNo = item.serialOrImeiNo;
    productTxn.hallmarkCharge = item.hallmarkCharge;
    productTxn.certificationCharge = item.certificationCharge;

    if (item.categoryLevel2) {
      productTxn.categoryLevel2 = item.categoryLevel2;
      productTxn.categoryLevel2DisplayName = item.categoryLevel2DisplayName;
      productTxn.categoryLevel3 = item.categoryLevel3;
      productTxn.categoryLevel3DisplayName = item.categoryLevel3DisplayName;
    }

    productTxn.properties = item.properties;
    productTxn.addOnProperties = item.addOnProperties;
    productTxn.warrantyDays = item.warrantyDays;
    productTxn.warrantyEndDate = item.warrantyEndDate;

    await db.producttxn
      .insert(productTxn)
      .then((data) => {
        console.log('data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in produc txn data from Sales return:', err);
      });
  }
};

export const deleteProductTxnFromSalesReturn = async (txnData, db) => {
  // console.log('::txnData::', toJS(txnData));

  /**
   * iterate by all items
   */
  let id = '';
  for (let item of txnData.item_list) {
    // prepare by composite primary
    id =
      txnData.sales_return_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0);

    const businessData = await Bd.getBusinessData();

    const query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('product txn data removed' + data);
      })
      .catch((error) => {
        console.log('product txn hand deletion Failed ' + error);
      });
  }
};

export const saveProductTxnFromPurchases = async (
  txnData,
  db,
  commonIds = [],
  missingIds = [],
  newIds = []
) => {
  // console.log('::txnData::', toJS(txnData));

  const insertArray = [];
  const updateArray = [];
  const deleteArray = [];

  for (let item of txnData.item_list) {
    let productTxn = {};

    productTxn.id =
      txnData.bill_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0);

    productTxn.sequenceNumber = txnData.vendor_bill_number;

    productTxn.businessId = txnData.businessId;
    productTxn.businessCity = txnData.businessCity;
    productTxn.txnId = txnData.bill_number;
    productTxn.txnType = 'Purchases';
    productTxn.txnDate = txnData.bill_date;
    productTxn.updatedAt = Date.now();
    productTxn.posId = txnData.posId;
    //suplier data
    productTxn.vendorId = txnData.vendor_id;
    productTxn.vendorName = txnData.vendor_name;
    productTxn.vendorPhoneNumber = txnData.vendor_phone_number;
    productTxn.vendorGSTNo = txnData.vendor_gst_number;
    productTxn.vendorGstType = txnData.vendor_gst_type;

    //reverse tax data
    productTxn.reverseChargeEnable = txnData.reverseChargeEnable;
    productTxn.reverseChargeValue = txnData.reverseChargeValue;

    //product data
    productTxn.productId = item.product_id;
    productTxn.productName = item.item_name;
    productTxn.purchasedPrice =
      item.purchased_price !== null && item.purchased_price !== undefined
        ? item.purchased_price
        : 0;
    productTxn.purchased_price_before_tax =
      item.purchased_price_before_tax !== null &&
      item.purchased_price_before_tax !== undefined
        ? item.purchased_price_before_tax
        : 0;
    productTxn.salePrice =
      item.mrp !== null && item.mrp !== undefined ? item.mrp : 0;
    productTxn.offerPrice =
      item.offer_price !== null && item.offer_price !== undefined
        ? item.offer_price
        : 0;
    productTxn.stockQty =
      item.stockQty !== null && item.stockQty !== undefined ? item.stockQty : 0;
    productTxn.amount =
      item.amount !== null && item.amount !== undefined ? item.amount : 0;
    productTxn.freeQty =
      item.freeStockQty !== null && item.freeStockQty !== undefined
        ? item.freeStockQty
        : 0;

    productTxn.freeTxnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getFreeQuantityByUnit(item) || 0
        : item.freeQty || 0;
    productTxn.qtyUnit = item.qtyUnit;

    productTxn.taxIncluded = item.taxIncluded;
    productTxn.taxAmount =
      (parseFloat(item.igst_amount) || 0) +
      (parseFloat(item.cgst_amount) || 0) +
      (parseFloat(item.sgst_amount) || 0);

    productTxn.cgst =
      item.cgst !== null && item.cgst !== undefined ? item.cgst : 0;
    productTxn.sgst =
      item.sgst !== null && item.sgst !== undefined ? item.sgst : 0;
    productTxn.igst =
      item.igst !== null && item.igst !== undefined ? item.igst : 0;
    productTxn.cess =
      item.cess !== null && item.cess !== undefined ? item.cess : 0;
    productTxn.sgst_amount =
      item.sgst_amount !== null && item.sgst_amount !== undefined
        ? item.sgst_amount
        : 0;
    productTxn.igst_amount =
      item.igst_amount !== null && item.igst_amount !== undefined
        ? item.igst_amount
        : 0;
    productTxn.cgst_amount =
      item.cgst_amount !== null && item.cgst_amount !== undefined
        ? item.cgst_amount
        : 0;

    productTxn.hsn = item.hsn;
    productTxn.taxType = item.taxType;

    productTxn.batchNumber = item.batch_id;
    productTxn.txnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getQuantityByUnit(item) || 0
        : item.qty || 0;
    productTxn.qtyUnit = item.qtyUnit;
    productTxn.unitConversionQty = item.unitConversionQty;
    productTxn.discount_percent =
      item.discount_percent !== null && item.discount_percent !== undefined
        ? item.discount_percent
        : 0;
    productTxn.discount_amount =
      item.discount_amount !== null && item.discount_amount !== undefined
        ? item.discount_amount
        : 0;

    productTxn.discount_type = item.discount_type;
    productTxn.batchActualNumber = item.batchNumber;
    productTxn.modelNo = item.modelNo;
    productTxn.mfDate = item.mfDate;
    productTxn.expiryDate = item.expiryDate;
    productTxn.rack = item.rack;
    productTxn.warehouseData = item.warehouseData;
    productTxn.barcode = item.barcode;
    productTxn.sku = item.sku;
    productTxn.serialOrImeiNo = item.serialOrImeiNo;
    productTxn.hallmarkCharge = item.hallmarkCharge;
    productTxn.certificationCharge = item.certificationCharge;

    productTxn.netWeight = item.netWeight;

    if (item.categoryLevel2) {
      productTxn.categoryLevel2 = item.categoryLevel2;
      productTxn.categoryLevel2DisplayName = item.categoryLevel2DisplayName;
      productTxn.categoryLevel3 = item.categoryLevel3;
      productTxn.categoryLevel3DisplayName = item.categoryLevel3DisplayName;
    }

    productTxn.properties = item.properties;
    productTxn.serialNo = item.serialNo;

    //check id is in commonIds or missingIds or newIds
    if (commonIds.includes(productTxn.id)) {
      updateArray.push(productTxn);
    } else if (missingIds.includes(productTxn.id)) {
      deleteArray.push(productTxn);
    } else {
      insertArray.push(productTxn);
    }
  }

  if (insertArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, insertArray, 'insert');
  }
  if (updateArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, updateArray, 'update');
  }
  if (deleteArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, deleteArray, 'delete');
  }
};

export const deleteProductTxnFromPurchases = async (txnData, db) => {
  /**
   * iterate by all items
   */
  let id = '';
  for (let item of txnData.item_list) {
    // prepare by composite primary
    id =
      txnData.bill_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0);

    const businessData = await Bd.getBusinessData();

    const query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('product txn data removed' + data);
      })
      .catch((error) => {
        console.log('product txn hand deletion Failed ' + error);
      });
  }
};

export const deleteAndSaveProductTxnFromPurchases = async (
  existing,
  txnData,
  db
) => {
  const result = findCommonAndNewIdsAndMissingIds(
    existing,
    txnData,
    'bill_number'
  );

  await saveProductTxnFromPurchases(
    txnData,
    db,
    result.commonIds,
    result.missingIds,
    result.newIds
  );
};

export const saveProductTxnFromPurchasesReturn = async (txnData, db) => {
  for (let item of txnData.item_list) {
    let productTxn = {};

    // console.log('productID::', item.product_id);

    productTxn.id =
      txnData.purchase_return_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0);

    productTxn.sequenceNumber = txnData.purchaseReturnBillNumber;

    productTxn.businessId = txnData.businessId;
    productTxn.businessCity = txnData.businessCity;
    productTxn.txnId = txnData.purchase_return_number;
    productTxn.txnType = 'Purchases Return';
    productTxn.txnDate = txnData.date;
    productTxn.updatedAt = Date.now();
    productTxn.posId = txnData.posId;
    //supplier data
    productTxn.vendorId = txnData.vendor_id;
    productTxn.vendorName = txnData.vendor_name;
    productTxn.vendorPhoneNumber = txnData.vendor_phone_number;
    productTxn.vendorGSTNo = txnData.vendor_gst_number;
    productTxn.vendorGstType = txnData.vendor_gst_type;

    //product data
    productTxn.productId = item.product_id;
    productTxn.productName = item.item_name;
    productTxn.purchasedPrice =
      item.purchased_price !== null && item.purchased_price !== undefined
        ? item.purchased_price
        : 0;
    productTxn.purchased_price_before_tax =
      item.purchased_price_before_tax !== null &&
      item.purchased_price_before_tax !== undefined
        ? item.purchased_price_before_tax
        : 0;
    productTxn.salePrice =
      item.mrp !== null && item.mrp !== undefined ? item.mrp : 0;
    productTxn.offerPrice =
      item.offer_price !== null && item.offer_price !== undefined
        ? item.offer_price
        : 0;
    productTxn.stockQty =
      item.stockQty !== null && item.stockQty !== undefined ? item.stockQty : 0;
    productTxn.amount =
      item.amount !== null && item.amount !== undefined ? item.amount : 0;
    productTxn.freeQty =
      item.freeStockQty !== null && item.freeStockQty !== undefined
        ? item.freeStockQty
        : 0;

    productTxn.freeTxnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getFreeQuantityByUnit(item) || 0
        : item.freeQty || 0;

    productTxn.taxIncluded = item.taxIncluded;
    productTxn.taxAmount =
      (parseFloat(item.igst_amount) || 0) +
      (parseFloat(item.cgst_amount) || 0) +
      (parseFloat(item.sgst_amount) || 0);

    productTxn.cgst =
      item.cgst !== null && item.cgst !== undefined ? item.cgst : 0;
    productTxn.sgst =
      item.sgst !== null && item.sgst !== undefined ? item.sgst : 0;
    productTxn.igst =
      item.igst !== null && item.igst !== undefined ? item.igst : 0;
    productTxn.cess =
      item.cess !== null && item.cess !== undefined ? item.cess : 0;
    productTxn.sgst_amount =
      item.sgst_amount !== null && item.sgst_amount !== undefined
        ? item.sgst_amount
        : 0;
    productTxn.igst_amount =
      item.igst_amount !== null && item.igst_amount !== undefined
        ? item.igst_amount
        : 0;
    productTxn.cgst_amount =
      item.cgst_amount !== null && item.cgst_amount !== undefined
        ? item.cgst_amount
        : 0;

    productTxn.taxType = item.taxType;

    productTxn.hsn = item.hsn;
    productTxn.batchNumber = item.batch_id;
    productTxn.txnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getQuantityByUnit(item) || 0
        : item.qty || 0;
    productTxn.qtyUnit = item.qtyUnit;
    productTxn.unitConversionQty = item.unitConversionQty;
    productTxn.discount_percent =
      item.discount_percent !== null && item.discount_percent !== undefined
        ? item.discount_percent
        : 0;
    productTxn.discount_amount =
      item.discount_amount !== null && item.discount_amount !== undefined
        ? item.discount_amount
        : 0;

    productTxn.netWeight = item.netWeight;

    productTxn.discount_type = item.discount_type;
    productTxn.batchActualNumber = item.batchNumber;
    productTxn.modelNo = item.modelNo;
    productTxn.mfDate = item.mfDate;
    productTxn.expiryDate = item.expiryDate;
    productTxn.rack = item.rack;
    productTxn.warehouseData = item.warehouseData;
    productTxn.barcode = item.barcode;
    productTxn.sku = item.sku;
    productTxn.serialOrImeiNo = item.serialOrImeiNo;
    productTxn.hallmarkCharge = item.hallmarkCharge;
    productTxn.certificationCharge = item.certificationCharge;
    productTxn.serialNo = item.serialNo;

    if (item.categoryLevel2) {
      productTxn.categoryLevel2 = item.categoryLevel2;
      productTxn.categoryLevel2DisplayName = item.categoryLevel2DisplayName;
      productTxn.categoryLevel3 = item.categoryLevel3;
      productTxn.categoryLevel3DisplayName = item.categoryLevel3DisplayName;
    }

    productTxn.properties = item.properties;

    await db.producttxn
      .insert(productTxn)
      .then((data) => {
        // console.log('data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in produc txn data from purchases returns:', err);
      });
  }
};

export const deleteProductTxnFromPurchasesReturn = async (txnData, db) => {
  // console.log('::txnData::', toJS(txnData));

  /**
   * iterate by all items
   */
  let id = '';
  for (let item of txnData.item_list) {
    // prepare by composite primary

    id =
      txnData.purchase_return_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0) +
      '|' +
      (item.serialOrImeiNo ? item.serialOrImeiNo : 0);

    const businessData = await Bd.getBusinessData();

    const query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('product txn data removed' + data);
      })
      .catch((error) => {
        console.log('product txn hand deletion Failed ' + error);
      });
  }
};

export const deleteAndSaveProductTxnFromManufacture = async (
  existing,
  rawMaterialCost,
  txnData,
  batchData,
  productDetail,
  db
) => {
  const result = findCommonAndNewIdsAndMissingIds(
    existing,
    txnData,
    'invoice_number'
  );

  await saveProductTxnFromManufacture(
    rawMaterialCost,
    txnData,
    batchData,
    productDetail,
    db,
    result.commonIds,
    result.missingIds,
    result.newIds
  );
};
export const saveProductTxnFromManufacture = async (
  rawMaterialCost,
  txnData,
  batchData,
  productDetail,
  commonIds = [],
  missingIds = [],
  newIds = []
) => {
  const insertArray = [];
  const updateArray = [];
  const deleteArray = [];

  const db = await Db.get();

  const directExpenses = productDetail.rawMaterialData?.directExpenses || [];

  const doc = {
    id: `${txnData.invoice_number}|${productDetail.productId}|${
      batchData.id || 0
    }`,
    sequenceNumber: txnData.sequenceNumber,
    businessId: productDetail.businessId,
    businessCity: productDetail.businessCity,
    txnId: txnData.invoice_number,
    txnType: 'Manufacture',
    txnDate: txnData.invoice_date,
    updatedAt: Date.now(),
    posId: parseFloat(txnData.posId),
    productId: productDetail.productId,
    categoryLevel2: productDetail.categoryLevel2.name,
    categoryLevel2DisplayName: productDetail.categoryLevel2.displayName,
    categoryLevel3: productDetail.categoryLevel3.name,
    categoryLevel3DisplayName: productDetail.categoryLevel3.displayName,
    productName: productDetail.name,
    brandName: productDetail.brandName,
    purchasedPrice: parseFloat(productDetail.purchasedPrice) || 0,
    purchased_price_before_tax: 0,
    salePrice: parseFloat(batchData.salePrice) || 0,
    offerPrice: parseFloat(batchData.offerPrice) || 0,
    stockQty: parseFloat(productDetail.stockQty) || 0,
    amount: parseFloat(rawMaterialCost) || 0,
    freeQty: parseFloat(batchData.freeQty) || 0,
    freeTxnQty: parseFloat(batchData.freeManufacturingQty) || 0,
    taxIncluded: productDetail.purchaseTaxIncluded,
    taxAmount: 0,
    cgst: parseFloat(productDetail.purchaseCgst) || 0,
    sgst: parseFloat(productDetail.purchaseSgst) || 0,
    igst: parseFloat(productDetail.purchaseIgst) || 0,
    cess: parseFloat(productDetail.purchaseCess) || 0,
    taxType: productDetail.purchaseTaxType,
    sgst_amount: 0,
    igst_amount: 0,
    cgst_amount: 0,
    barcode: productDetail.barcode,
    sku: productDetail.sku,
    hsn: productDetail.hsn,
    batchNumber: batchData.id,
    txnQty: parseFloat(batchData.manufacturingQty) || 0,
    mfDate: batchData.mfDate,
    expiryDate: batchData.expiryDate,
    rack: batchData.rack,
    warehouseData: batchData.warehouseData,
    qtyUnit: '',
    unitConversionQty: 0,
    batchActualNumber: batchData.batchNumber,
    mfgDirectExpenses: directExpenses
  };

  //check id is in commonIds or missingIds or newIds
  if (commonIds.includes(doc.id)) {
    updateArray.push(doc);
  } else if (missingIds.includes(doc.id)) {
    deleteArray.push(doc);
  } else {
    insertArray.push(doc);
  }

  if (insertArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, insertArray, 'insert');
  }
  if (updateArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, updateArray, 'update');
  }
  if (deleteArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, deleteArray, 'delete');
  }
};

export const deleteAndSaveRawMaterialProductTxn = async (
  existing,
  isComingFromManufacture,
  txnData,
  db
) => {
  const result = findCommonAndNewIdsAndMissingIds(
    existing,
    txnData,
    'invoice_number'
  );

  await saveRawMaterialProductTxn(
    isComingFromManufacture,
    txnData,
    db,
    result.commonIds,
    result.missingIds,
    result.newIds
  );
};

export const deleteRawMaterialProductTxn = async (
  isComingFromManufacture,
  txnData,
  db,
  rawMaterialList
) => {
  let itemList = [];

  if (isComingFromManufacture) {
    itemList = txnData.item_list;
  } else {
    itemList = rawMaterialList;
  }

  /**
   * iterate by all items
   */
  let id = '';
  for (let item of itemList) {
    // prepare by composite primary
    id =
      txnData.invoice_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0);

    const businessData = await Bd.getBusinessData();

    const query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('product txn data removed' + data);
      })
      .catch((error) => {
        console.log('product txn hand deletion Failed ' + error);
      });
  }
};

export const saveRawMaterialProductTxn = async (
  txnData,
  db,
  rawMaterialList,
  totalMfgQty,
  commonIds = [],
  missingIds = [],
  newIds = []
) => {
  const insertArray = [];
  const updateArray = [];
  const deleteArray = [];

  for (let item of rawMaterialList) {
    let newItemQty = item.qty * totalMfgQty;

    let productTxn = {
      id: `${txnData.invoice_number}|${item.product_id}|${item.batch_id || 0}`,
      sequenceNumber: txnData.sequenceNumber,
      businessId: txnData.businessId,
      businessCity: txnData.businessCity,
      txnId: txnData.invoice_number,
      txnType: 'Raw Material',
      txnDate: txnData.invoice_date,
      updatedAt: Date.now(),
      posId: txnData.posId,
      customerId: txnData.customer_name ? txnData.customer_id : undefined,
      customerName: txnData.customer_name,
      customerPhoneNo: txnData.customer_name
        ? txnData.customer_phoneNo
        : undefined,
      customerGSTNo: txnData.customer_name ? txnData.customerGSTNo : undefined,
      customerGstType: txnData.customer_name
        ? txnData.customerGstType
        : undefined,
      productId: item.product_id,
      productName: item.item_name,
      purchasedPrice: item.purchased_price || 0,
      purchased_price_before_tax: item.purchased_price_before_tax || 0,
      salePrice: item.mrp || 0,
      offerPrice: item.offer_price || 0,
      mrp_before_tax: item.mrp_before_tax || 0,
      stockQty: item.stockQty || 0,
      freeQty: item.freeStockQty || 0,
      freeTxnQty:
        item.qtyUnit && item.qtyUnit !== ''
          ? getFreeQuantityByUnit(item) || 0
          : item.freeQty || 0,
      amount: parseFloat(item.estimate),
      taxIncluded: item.taxIncluded || false,
      taxAmount:
        (parseFloat(item.igst_amount) || 0) +
        (parseFloat(item.cgst_amount) || 0) +
        (parseFloat(item.sgst_amount) || 0),
      cgst: item.cgst || 0,
      sgst: item.sgst || 0,
      igst: item.igst || 0,
      cess: item.cess || 0,
      sgst_amount: item.sgst_amount || 0,
      igst_amount: item.igst_amount || 0,
      cgst_amount: item.cgst_amount || 0,
      taxType: item.taxType,
      hsn: item.hsn,
      batchNumber: item.batch_id,
      txnQty:
        item.qtyUnit && item.qtyUnit !== ''
          ? getMfgQuantityByUnit(item, newItemQty) || 0
          : newItemQty || 0,
      discount_percent: item.discount_percent || 0,
      discount_amount: item.discount_amount || 0,
      discount_type: item.discount_type || '',
      qtyUnit: item.qtyUnit,
      unitConversionQty: item.unitConversionQty || 0,
      categoryLevel2: item.categoryLevel2,
      categoryLevel2DisplayName: item.categoryLevel2DisplayName,
      categoryLevel3: item.categoryLevel3,
      categoryLevel3DisplayName: item.categoryLevel3DisplayName,
      brandName: item.brandName,
      mfDate: item.mfDate,
      expiryDate: item.expiryDate,
      rack: item.rack,
      warehouseData: item.warehouseData,
      barcode: item.barcode,
      sku: item.sku
    };

    //check id is in commonIds or missingIds or newIds
    if (commonIds.includes(productTxn.id)) {
      updateArray.push(productTxn);
    } else if (missingIds.includes(productTxn.id)) {
      deleteArray.push(productTxn);
    } else {
      insertArray.push(productTxn);
    }
  }

  if (insertArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, insertArray, 'insert');
  }
  if (updateArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, updateArray, 'update');
  }
  if (deleteArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, deleteArray, 'delete');
  }
};

export const saveRawMaterialProductTxnFromSaleReturnDelete = async (
  txnData,
  db,
  rawMaterialList,
  totalMfgQty
) => {
  let itemList = rawMaterialList;

  for (let item of itemList) {
    let productTxn = {};

    let newItemQty = item.qty * totalMfgQty;

    productTxn.id =
      txnData.invoice_number +
      '|' +
      item.product_id +
      '|' +
      (item.batch_id ? item.batch_id : 0);

    productTxn.sequenceNumber = txnData.saleSequenceNumber;

    productTxn.businessId = txnData.businessId;
    productTxn.businessCity = txnData.businessCity;
    productTxn.txnId = txnData.invoice_number;
    productTxn.txnType = 'Raw Material';
    productTxn.txnDate = txnData.invoice_date;
    productTxn.updatedAt = Date.now();
    productTxn.posId = txnData.posId;

    if (txnData.customer_name) {
      //customer data
      productTxn.customerId = txnData.customer_id;
      productTxn.customerName = txnData.customer_name;
      productTxn.customerPhoneNo = txnData.customer_phoneNo;
      productTxn.customerGSTNo = txnData.customerGSTNo;
      productTxn.customerGstType = txnData.customerGstType;
    }

    //product data
    productTxn.productId = item.product_id;
    productTxn.productName = item.item_name;
    productTxn.purchasedPrice = item.purchased_price || 0;
    productTxn.salePrice = item.mrp || 0;
    productTxn.offerPrice = item.offer_price || 0;
    productTxn.mrp_before_tax = item.mrp_before_tax || 0;
    productTxn.stockQty = item.stockQty || 0;
    productTxn.freeQty = item.freeStockQty || 0;
    productTxn.freeTxnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getFreeQuantityByUnit(item) || 0
        : item.freeQty || 0;
    productTxn.amount = parseFloat(item.estimate);

    productTxn.taxIncluded = item.taxIncluded ? item.taxIncluded : false;

    productTxn.taxAmount =
      (parseFloat(item.igst_amount) || 0) +
      (parseFloat(item.cgst_amount) || 0) +
      (parseFloat(item.sgst_amount) || 0);

    productTxn.cgst = item.cgst || 0;
    productTxn.sgst = item.sgst || 0;
    productTxn.igst = item.igst || 0;
    productTxn.cess = item.cess || 0;
    productTxn.sgst_amount = item.sgst_amount || 0;
    productTxn.igst_amount = item.igst_amount || 0;
    productTxn.cgst_amount = item.cgst_amount || 0;

    productTxn.taxType = item.taxType;

    productTxn.hsn = item.hsn;
    productTxn.batchNumber = item.batch_id;
    productTxn.txnQty =
      item.qtyUnit && item.qtyUnit !== ''
        ? getMfgQuantityByUnit(item, newItemQty) || 0
        : newItemQty || 0;
    productTxn.discount_percent = item.discount_percent || 0;
    productTxn.discount_amount = item.discount_amount || 0;

    productTxn.discount_type = item.discount_type;
    productTxn.qtyUnit = item.qtyUnit;
    productTxn.unitConversionQty = item.unitConversionQty;

    if (item.categoryLevel2) {
      productTxn.categoryLevel2 = item.categoryLevel2;
      productTxn.categoryLevel2DisplayName = item.categoryLevel2DisplayName;
      productTxn.categoryLevel3 = item.categoryLevel3;
      productTxn.categoryLevel3DisplayName = item.categoryLevel3DisplayName;
      productTxn.brandName = item.brandName;
      productTxn.mfDate = item.mfDate;
      productTxn.expiryDate = item.expiryDate;
      productTxn.rack = item.rack;
      productTxn.warehouseData = item.warehouseData;
      productTxn.barcode = item.barcode;
      productTxn.sku = item.sku;
    }

    await db.producttxn
      .insert(productTxn)
      .then((data) => {
        console.log('data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in produc txn data from Sales:', err);
      });
  }
};

const getQuantityByUnit = (product) => {
  let qty = 0;
  if (product.primaryUnit && product.qtyUnit === product.primaryUnit.fullName) {
    qty = product.qty;
  }

  if (
    product.secondaryUnit &&
    product.qtyUnit === product.secondaryUnit.fullName
  ) {
    qty = product.qty / product.unitConversionQty;
  }

  return qty;
};

const getFreeQuantityByUnit = (product) => {
  let qty = 0;
  if (product.primaryUnit && product.qtyUnit === product.primaryUnit.fullName) {
    qty = product.freeQty;
  }

  if (
    product.secondaryUnit &&
    product.qtyUnit === product.secondaryUnit.fullName
  ) {
    qty = product.freeQty / product.unitConversionQty;
  }

  return qty;
};

const getMfgQuantityByUnit = (product, newQty) => {
  let qty = 0;
  if (product.primaryUnit && product.qtyUnit === product.primaryUnit.fullName) {
    qty = newQty;
  }

  if (
    product.secondaryUnit &&
    product.qtyUnit === product.secondaryUnit.fullName
  ) {
    qty = newQty / product.unitConversionQty;
  }

  return qty;
};

export const saveStockProductTxn = async (
  total,
  totalTaxAmount,
  txnData,
  batchData,
  productDetail,
  changedStock,
  changedFreeStock,
  operationType,
  db
) => {
  const doc = {
    id: `${txnData.invoice_number}|${productDetail.productId}|${
      batchData.id || 0
    }`,
    sequenceNumber: txnData.sequenceNumber,
    businessId: productDetail.businessId,
    businessCity: productDetail.businessCity,
    txnId: txnData.invoice_number,
    txnType: operationType,
    txnDate: txnData.invoice_date,
    updatedAt: Date.now(),
    posId: parseFloat(txnData.posId),
    productId: productDetail.productId,
    categoryLevel2: productDetail.categoryLevel2.name,
    categoryLevel2DisplayName: productDetail.categoryLevel2.displayName,
    categoryLevel3: productDetail.categoryLevel3.name,
    categoryLevel3DisplayName: productDetail.categoryLevel3.displayName,
    productName: productDetail.name,
    brandName: productDetail.brandName,
    purchasedPrice: productDetail.purchasedPrice || 0,
    purchased_price_before_tax: txnData.purchasePriceWithoutTax || 0,
    salePrice: productDetail.salePrice || 0,
    offerPrice: productDetail.offerPrice || 0,
    stockQty: productDetail.stockQty || 0,
    amount: total || 0,
    freeTxnQty: parseFloat(changedFreeStock || 0) || 0,
    taxIncluded: productDetail.purchaseTaxIncluded,
    taxAmount: parseFloat(totalTaxAmount || 0),
    cgst: productDetail.purchaseCgst || 0,
    sgst: productDetail.purchaseSgst || 0,
    igst: productDetail.purchaseIgst || 0,
    cess: productDetail.purchaseCess || 0,
    taxType: productDetail.purchaseTaxType,
    sgst_amount: 0,
    igst_amount: 0,
    cgst_amount: 0,
    barcode: productDetail.barcode,
    sku: productDetail.sku,
    hsn: productDetail.hsn,
    batchNumber: batchData ? batchData.id : '',
    txnQty: parseFloat(changedStock || 0),
    mfDate: batchData ? batchData.mfDate : null,
    expiryDate: batchData ? batchData.expiryDate : null,
    rack: batchData ? batchData.rack : '',
    warehouseData: batchData ? batchData.warehouseData : '',
    qtyUnit: '',
    unitConversionQty: 0,
    batchActualNumber: batchData ? batchData.batchNumber : '',
    freeQty: batchData ? parseFloat(batchData.freeQty || 0) : 0,
    wastagePercentage:
      productDetail.wastagePercentage !== null &&
      productDetail.wastagePercentage !== undefined
        ? productDetail.wastagePercentage
        : 0,
    wastageGrams:
      productDetail.wastageGrams !== null &&
      productDetail.wastageGrams !== undefined
        ? productDetail.wastageGrams
        : 0,
    grossWeight:
      productDetail.grossWeight !== null &&
      productDetail.grossWeight !== undefined
        ? productDetail.grossWeight
        : 0,
    netWeight:
      productDetail.netWeight !== null && productDetail.netWeight !== undefined
        ? productDetail.netWeight
        : 0,
    purity: productDetail.purity
  };

  // To add in Audit Table

  await db.producttxn
    .insert(doc)
    .then((data) => {
      console.log('data Inserted for stock:', JSON.stringify(data));
    })
    .catch((err) => {
      console.log('Error in produc txn data from stock:', err);
    });
};

export const saveOpeningStockProductTxn = async (
  total,
  totalTaxAmount,
  txnData,
  batchData,
  productDetail,
  changedStock,
  changedFreeStock,
  operationType,
  db
) => {
  let productTxn = {};

  productTxn.id = txnData.invoice_number + '|' + productDetail.productId;

  productTxn.sequenceNumber = txnData.sequenceNumber;

  productTxn.businessId = productDetail.businessId;
  productTxn.businessCity = productDetail.businessCity;
  productTxn.txnId = txnData.invoice_number;
  productTxn.txnType = operationType;
  productTxn.txnDate = txnData.invoice_date;
  productTxn.updatedAt = Date.now();
  productTxn.posId = parseFloat(txnData.posId);

  //product data
  productTxn.productId = productDetail.productId;
  productTxn.categoryLevel2 = productDetail.categoryLevel2.name;
  productTxn.categoryLevel2DisplayName =
    productDetail.categoryLevel2.displayName;
  productTxn.categoryLevel3 = productDetail.categoryLevel3.name;
  productTxn.categoryLevel3DisplayName =
    productDetail.categoryLevel3.displayName;
  productTxn.productName = productDetail.name;
  productTxn.brandName = productDetail.brandName;
  productTxn.purchasedPrice = productDetail.purchasedPrice || 0;
  productTxn.purchased_price_before_tax = txnData.purchasePriceWithoutTax || 0;
  productTxn.salePrice = productDetail.salePrice || 0;
  productTxn.offerPrice = productDetail.offerPrice || 0;
  productTxn.stockQty = productDetail.stockQty || 0;
  productTxn.amount = total;
  productTxn.freeTxnQty = changedFreeStock || 0;

  productTxn.taxIncluded = productDetail.purchaseTaxIncluded;
  productTxn.taxAmount = totalTaxAmount;

  productTxn.cgst = productDetail.purchaseCgst || 0;
  productTxn.sgst = productDetail.purchaseSgst || 0;
  productTxn.igst = productDetail.purchaseIgst || 0;
  productTxn.cess = productDetail.purchaseCess || 0;
  productTxn.taxType = productDetail.purchaseTaxType;
  productTxn.sgst_amount = 0;
  productTxn.igst_amount = 0;
  productTxn.cgst_amount = 0;
  productTxn.barcode = productDetail.barcode;
  productTxn.sku = productDetail.sku;
  productTxn.hsn = productDetail.hsn;

  productTxn.txnQty = changedStock;

  productTxn.rack = batchData.rack;

  productTxn.qtyUnit = '';
  productTxn.unitConversionQty = 0;

  productTxn.wastagePercentage =
    productDetail.wastagePercentage !== null &&
    productDetail.wastagePercentage !== undefined
      ? productDetail.wastagePercentage
      : 0;
  productTxn.wastageGrams =
    productDetail.wastageGrams !== null &&
    productDetail.wastageGrams !== undefined
      ? productDetail.wastageGrams
      : 0;
  productTxn.grossWeight =
    productDetail.grossWeight !== null &&
    productDetail.grossWeight !== undefined
      ? productDetail.grossWeight
      : 0;
  productTxn.netWeight =
    productDetail.netWeight !== null && productDetail.netWeight !== undefined
      ? productDetail.netWeight
      : 0;
  productTxn.purity = productDetail.purity;
  if (batchData) {
    productTxn.batchActualNumber = batchData.batchNumber;
    productTxn.warehouseData = batchData.warehouseData;
    productTxn.mfDate = batchData.mfDate;
    productTxn.expiryDate = batchData.expiryDate;
    productTxn.batchNumber = batchData.id;
    productTxn.freeQty = batchData.freeQty || 0;
  }

  // To add in Audit Table

  await db.producttxn
    .insert(productTxn)
    .then((data) => {
      console.log('data Inserted for stock:', data);
    })
    .catch((err) => {
      console.log('Error in product txn data from stock:', err);
    });
};

export const deleteAndSaveAddOnProductTxn = async (
  existing,
  txnData,
  db,
  addOnList,
  itemQty
) => {
  const result = findCommonAndNewIdsAndMissingIds(
    existing,
    txnData,
    'invoice_number'
  );

  await saveAddOnProductTxn(
    txnData,
    db,
    addOnList,
    itemQty,
    result.commonIds,
    result.missingIds,
    result.newIds
  );
};

export const deleteAddOnProductTxn = async (txnData, db, addOnList) => {
  let itemList = addOnList;

  /**
   * iterate by all items
   */
  let id = '';
  for (let item of itemList) {
    // prepare by composite primary
    id =
      txnData.invoice_number +
      '|' +
      item.productId +
      '|' +
      (item.batchId ? item.batchId : 0);

    const businessData = await Bd.getBusinessData();

    const query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('product txn data removed' + data);
      })
      .catch((error) => {
        console.log('product txn hand deletion Failed ' + error);
      });
  }
};

export const saveAddOnProductTxn = async (
  txnData,
  db,
  addOnList,
  itemQty,
  commonIds = [],
  missingIds = [],
  newIds = []
) => {
  const insertArray = [];
  const updateArray = [];
  const deleteArray = [];

  for (let item of addOnList) {
    let productTxn = {};

    productTxn.id =
      txnData.invoice_number +
      '|' +
      item.productId +
      '|' +
      (item.batchId ? item.batchId : 0);

    productTxn.sequenceNumber = txnData.sequenceNumber;

    productTxn.businessId = txnData.businessId;
    productTxn.businessCity = txnData.businessCity;
    productTxn.txnId = txnData.invoice_number;
    productTxn.txnType = 'Add On';
    productTxn.txnDate = txnData.invoice_date;
    productTxn.updatedAt = Date.now();
    productTxn.posId = txnData.posId;

    if (txnData.customer_name) {
      //customer data
      productTxn.customerId = txnData.customer_id;
      productTxn.customerName = txnData.customer_name;
      productTxn.customerPhoneNo = txnData.customer_phoneNo;
      productTxn.customerGSTNo = txnData.customerGSTNo;
      productTxn.customerGstType = txnData.customerGstType;
    }

    //product data
    productTxn.productId = item.productId;
    productTxn.productName = item.name;
    productTxn.purchasedPrice = item.purchasedPrice || 0;
    productTxn.salePrice = item.amount || 0;
    productTxn.offerPrice = 0;
    productTxn.mrp_before_tax = item.amount_before_tax || 0;
    productTxn.stockQty = item.stockQty || 0;
    productTxn.freeQty = 0;
    productTxn.freeTxnQty = 0;
    productTxn.amount = parseFloat(itemQty) * parseFloat(item.amount);

    productTxn.taxIncluded = item.taxIncluded ? item.taxIncluded : false;
    productTxn.taxAmount =
      (parseFloat(item.cgst_amount) || 0) +
        (parseFloat(item.sgst_amount) || 0) ||
      parseFloat(item.igst_amount) ||
      0;

    productTxn.cgst = item.cgst || 0;
    productTxn.sgst = item.sgst || 0;
    productTxn.igst = item.igst || 0;
    productTxn.cess = item.cess || 0;
    productTxn.sgst_amount = item.sgst_amount || 0;
    productTxn.igst_amount = item.igst_amount || 0;
    productTxn.cgst_amount = item.cgst_amount || 0;

    productTxn.taxType = item.taxType;

    productTxn.hsn = item.hsn;
    productTxn.batchNumber = item.batchId;
    productTxn.txnQty = itemQty;

    productTxn.discount_percent = item.discount_percent || 0;
    productTxn.discount_amount = item.discount_amount || 0;
    productTxn.discount_type = item.discount_type || '';
    // productTxn.qtyUnit = item.qtyUnit;
    // productTxn.unitConversionQty = item.unitConversionQty || 0;

    if (item.categoryLevel2) {
      productTxn.categoryLevel2 = item.categoryLevel2;
      productTxn.categoryLevel2DisplayName = item.categoryLevel2DisplayName;
      productTxn.categoryLevel3 = item.categoryLevel3;
      productTxn.categoryLevel3DisplayName = item.categoryLevel3DisplayName;
      productTxn.brandName = item.brandName;
      // productTxn.mfDate = item.mfDate;
      // productTxn.expiryDate = item.expiryDate;
      // productTxn.rack = item.rack;
      // productTxn.warehouseData = item.warehouseData;
      productTxn.barcode = item.barcode;
      // productTxn.sku = item.sku;
    }

    //check id is in commonIds or missingIds or newIds
    if (commonIds.includes(productTxn.id)) {
      updateArray.push(productTxn);
    } else if (missingIds.includes(productTxn.id)) {
      deleteArray.push(productTxn);
    } else {
      insertArray.push(productTxn);
    }
  }
  if (insertArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, insertArray, 'insert');
  }
  if (updateArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, updateArray, 'update');
  }
  if (deleteArray.length > 0) {
    await bulkSaveUpdateOrDeleteProductTxnDb(db, deleteArray, 'delete');
  }
};

export const updateRawMaterialProductTxn = async (
  txnData,
  db,
  rawMaterialList,
  totalMfgQty
) => {
  for (let item of rawMaterialList) {
    let newItemQty = item.qty * totalMfgQty;
    const businessData = await Bd.getBusinessData();

    const id = `${txnData.invoice_number}|${item.product_id}|${
      item.batch_id || 0
    }`;

    await db.producttxn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              id: {
                $eq: id
              }
            }
          ]
        }
      })
      .update({
        $set: {
          id: id,
          sequenceNumber: txnData.sequenceNumber,
          businessId: txnData.businessId,
          businessCity: txnData.businessCity,
          txnId: txnData.invoice_number,
          txnType: 'Raw Material',
          txnDate: txnData.invoice_date,
          updatedAt: Date.now(),
          posId: txnData.posId,
          customerId: txnData.customer_id ? txnData.customer_id : undefined,
          customerName: txnData.customer_name,
          customerPhoneNo: txnData.customer_phoneNo
            ? txnData.customer_phoneNo
            : undefined,
          customerGSTNo: txnData.customerGSTNo
            ? txnData.customerGSTNo
            : undefined,
          customerGstType: txnData.customerGstType
            ? txnData.customerGstType
            : undefined,
          productId: item.product_id,
          productName: item.item_name,
          purchasedPrice: item.purchased_price || 0,
          salePrice: item.mrp || 0,
          offerPrice: item.offer_price || 0,
          mrp_before_tax: item.mrp_before_tax || 0,
          stockQty: item.stockQty || 0,
          freeQty: item.freeStockQty || 0,
          freeTxnQty:
            item.qtyUnit && item.qtyUnit != ''
              ? getFreeQuantityByUnit(item) || 0
              : item.freeQty || 0,
          amount: parseFloat(item.estimate),
          taxIncluded: item.taxIncluded || false,
          taxAmount:
            (parseFloat(item.igst_amount) || 0) +
            (parseFloat(item.cgst_amount) || 0) +
            (parseFloat(item.sgst_amount) || 0),
          cgst: item.cgst || 0,
          sgst: item.sgst || 0,
          igst: item.igst || 0,
          cess: item.cess || 0,
          sgst_amount: item.sgst_amount || 0,
          igst_amount: item.igst_amount || 0,
          cgst_amount: item.cgst_amount || 0,
          taxType: item.taxType,
          hsn: item.hsn,
          batchNumber: item.batch_id,
          txnQty:
            item.qtyUnit && item.qtyUnit != ''
              ? getMfgQuantityByUnit(item, newItemQty) || 0
              : newItemQty || 0,
          discount_percent: item.discount_percent || 0,
          discount_amount: item.discount_amount || 0,
          discount_type: item.discount_type || '',
          qtyUnit: item.qtyUnit,
          unitConversionQty: item.unitConversionQty || 0,
          categoryLevel2: item.categoryLevel2,
          categoryLevel2DisplayName: item.categoryLevel2DisplayName,
          categoryLevel3: item.categoryLevel3,
          categoryLevel3DisplayName: item.categoryLevel3DisplayName,
          brandName: item.brandName,
          mfDate: item.mfDate,
          expiryDate: item.expiryDate,
          rack: item.rack,
          warehouseData: item.warehouseData,
          barcode: item.barcode,
          sku: item.sku
        }
      });
  }
};

export const updateProductTxnFromManufacture = async (
  rawMaterialCost,
  txnData,
  batchData,
  productDetail
) => {
  const db = await Db.get();

  const businessData = await Bd.getBusinessData();

  const id = `${txnData.invoice_number}|${productDetail.productId}|${
    batchData.id || 0
  }`;

  const directExpenses = productDetail.rawMaterialData?.directExpenses || [];
  let mfgQty = batchData.manufacturingQty;
  let mfgFreeQty = batchData.freeManufacturingQty;

  const totalMfgQty = parseFloat(mfgQty || 0) + parseFloat(mfgFreeQty || 0);

  await db.producttxn
    .findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            id: {
              $eq: id
            }
          }
        ]
      }
    })
    .update({
      $set: {
        id: id,
        sequenceNumber: txnData.sequenceNumber,
        businessId: productDetail.businessId,
        businessCity: productDetail.businessCity,
        txnId: txnData.invoice_number,
        txnType: 'Manufacture',
        txnDate: txnData.invoice_date,
        updatedAt: Date.now(),
        posId: parseFloat(txnData.posId),
        productId: productDetail.productId,
        categoryLevel2: productDetail.categoryLevel2.name,
        categoryLevel2DisplayName: productDetail.categoryLevel2.displayName,
        categoryLevel3: productDetail.categoryLevel3.name,
        categoryLevel3DisplayName: productDetail.categoryLevel3.displayName,
        productName: productDetail.name,
        brandName: productDetail.brandName,
        purchasedPrice: parseFloat(rawMaterialCost) || 0,
        purchased_price_before_tax: 0,
        salePrice: parseFloat(batchData.salePrice) || 0,
        offerPrice: parseFloat(batchData.offerPrice) || 0,
        stockQty: parseFloat(productDetail.stockQty) || 0,
        amount: parseFloat(rawMaterialCost) * parseFloat(totalMfgQty) || 0,
        freeQty: parseFloat(batchData.freeQty) || 0,
        freeTxnQty: parseFloat(batchData.freeManufacturingQty) || 0,
        taxIncluded: productDetail.purchaseTaxIncluded,
        taxAmount: 0,
        cgst: parseFloat(productDetail.purchaseCgst) || 0,
        sgst: parseFloat(productDetail.purchaseSgst) || 0,
        igst: parseFloat(productDetail.purchaseIgst) || 0,
        cess: parseFloat(productDetail.purchaseCess) || 0,
        taxType: productDetail.purchaseTaxType,
        sgst_amount: 0,
        igst_amount: 0,
        cgst_amount: 0,
        barcode: productDetail.barcode,
        sku: productDetail.sku,
        hsn: productDetail.hsn,
        batchNumber: batchData.id,
        txnQty: parseFloat(batchData.manufacturingQty) || 0,
        mfDate: batchData.mfDate,
        expiryDate: batchData.expiryDate,
        rack: batchData.rack,
        warehouseData: batchData.warehouseData,
        qtyUnit: '',
        unitConversionQty: 0,
        batchActualNumber: batchData.batchNumber,
        mfgDirectExpenses: directExpenses
      }
    });
};

async function bulkSaveUpdateOrDeleteProductTxnDb(
  db,
  productTxnArray,
  txnType
) {
  if (txnType === 'update') {
    const businessData = await Bd.getBusinessData();

    for (const productTxn of productTxnArray) {
      await db.producttxn
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                id: {
                  $eq: productTxn.id
                }
              }
            ]
          }
        })
        .update({
          $set: {
            ...productTxn,
            updatedAt: Date.now()
          }
        })
        .then(async (data) => {
          console.log('product data updated:', data);
          if (data === null) {
            await db.producttxn
              .insert(productTxn)
              .then((data) => {
                console.log(
                  'product data Inserted since it is not avaible in Db:',
                  data
                );
              })
              .catch((err) => {
                console.log('Error in saving product data :', err);
              });
          }
        })
        .catch((error) => {
          console.log('product txn update Failed ' + error);
        });
    }
  } else if (txnType === 'insert') {
    await db.producttxn
      .bulkInsert(productTxnArray)
      .then((data) => {
        console.log('product Txn data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in product txn data :', err);
      });
  } else if (txnType === 'delete') {
    const idsToDelete = productTxnArray.map((productTxn) => productTxn.id);

    await db.producttxn
      .bulkRemove(idsToDelete)
      .then((data) => {
        console.log('product txn data removed:', data);
      })
      .catch((error) => {
        console.log('product txn hand deletion Failed ' + error);
      });
  }
}