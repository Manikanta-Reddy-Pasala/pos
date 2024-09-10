import * as Bd from '../SelectedBusiness';
import {
  getOpeningStockForProduct,
  getOpeningStockForProductsByCategory,
  getOpeningStockQtyForProduct,
  getOpeningStockQtyForProducts,
  getOpeningStockQtyForProductsByCategory
} from './OpeningStockValueHelper';

import { getFinancialYearStartDate, getYesterdayDate } from './DateHelper';

export const getSalesTxnByProduct = async (
  db,
  productId,
  fromDate,
  toDate,
  txnFilterArray
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { productId: { $eq: productId } },
          { businessId: { $eq: businessData.businessId } },
          {
            $or: txnFilterArray
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getRawMaterialsTxnByProduct = async (
  db,
  productId,
  fromDate,
  toDate,
  txnFilterArray
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { productId: { $eq: productId } },
          { businessId: { $eq: businessData.businessId } },
          {
            $or: txnFilterArray
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          { updatedAt: { $exists: true } }
        ]
      },
      sort: [{ txnDate: 'desc' }]
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = data.map((item) => item.toJSON());
    });

  return results;
};

export const getSalesTxnByProductAndWarehouse = async (
  db,
  productId,
  fromDate,
  toDate,
  txnFilterArray,
  warehouseSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { productId: { $eq: productId } },
          { businessId: { $eq: businessData.businessId } },
          {
            $or: txnFilterArray
          },
          { warehouseData: { $eq: warehouseSelected } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getSalesTxnByFreeProduct = async (
  db,
  productId,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { productId: { $eq: productId } },
          { businessId: { $eq: businessData.businessId } },
          {
            $or: [{ txnType: { $eq: 'Sales' } }, { txnType: { $eq: 'KOT' } }]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          {
            freeTxnQty: { $gt: 0 }
          }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getSalesTxn = async (db, fromDate, toDate, txnFilterArray) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: txnFilterArray
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getSalesTxnByWarehouse = async (
  db,
  fromDate,
  toDate,
  txnFilterArray,
  warehouseSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: txnFilterArray
          },
          { warehouseData: { $eq: warehouseSelected } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getFreeSalesTxn = async (db, fromDate, toDate) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: [{ txnType: { $eq: 'Sales' } }, { txnType: { $eq: 'KOT' } }]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          {
            freeTxnQty: { $gt: 0 }
          }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getPurchasesTxn = async (db, fromDate, toDate) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: [
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'KOT' } }
            ]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getPurchasesMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getPurchasesTxnAndWarehouse = async (
  db,
  fromDate,
  toDate,
  warehouseSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: [
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'KOT' } }
            ]
          },
          { warehouseData: { $eq: warehouseSelected } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getPurchasesMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getFreePurchasesTxn = async (db, fromDate, toDate) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            txnType: { $eq: 'Purchases' }
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          {
            freeTxnQty: { $gt: 0 }
          }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getPurchasesMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getPurchasesTxnByProduct = async (
  db,
  productId,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { productId: { $eq: productId } },
          {
            $or: [
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'KOT' } }
            ]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getPurchasesMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getPurchasesTxnByProductAndWarehouse = async (
  db,
  productId,
  fromDate,
  toDate,
  warehouseSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { productId: { $eq: productId } },
          {
            $or: [
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'KOT' } }
            ]
          },
          { warehouseData: { $eq: warehouseSelected } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getPurchasesMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getPurchasesTxnByFreeProduct = async (
  db,
  productId,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { productId: { $eq: productId } },
          {
            txnType: { $eq: 'Purchases' }
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          {
            freeTxnQty: { $gt: 0 }
          }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getPurchasesMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getPurchasesTxnByCategory = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel2: { $eq: categoryLevel2 } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          {
            $or: [
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'KOT' } }
            ]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }
      results = await getPurchasesMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getPurchasesTxnByCategoryAndWarehouse = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate,
  warehouseSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel2: { $eq: categoryLevel2 } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          {
            $or: [
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'KOT' } }
            ]
          },
          { warehouseData: { $eq: warehouseSelected } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }
      results = await getPurchasesMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getPurchasesTxnByFreeCategory = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel2: { $eq: categoryLevel2 } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          {
            txnType: { $eq: 'Purchases' }
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          {
            freeTxnQty: { $gt: 0 }
          }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }
      results = await getPurchasesMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getSaleTxnByCategory = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate,
  txnFilterArray
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel2: { $eq: categoryLevel2 } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          {
            $or: txnFilterArray
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }
      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getRawMaterialTxnByCategory = async (
  db,
  fromDate,
  toDate,
  txnFilterArray
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  var Query;

  if (
    String(localStorage.getItem('isHotelOrRestaurant')).toLowerCase() === 'true'
  ) {
    Query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: txnFilterArray
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          { categoryLevel2: { $eq: 'food_raw_materials_level2' } },
          { categoryLevel3: { $eq: 'food_raw_materials_level3' } },
          { updatedAt: { $exists: true } }
        ]
      },
      sort: [{ txnDate: 'desc' }]
    });
  } else {
    Query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: txnFilterArray
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          { categoryLevel2: { $eq: 'raw_materials_level2' } },
          { categoryLevel3: { $eq: 'raw_materials_level3' } }
        ]
      }
    });
  }

  await Query.exec().then(async (data) => {
    if (!data) {
      // No data is available
      return;
    }
    results = data.map((item) => item.toJSON());
  });

  return results;
};

export const getSaleTxnByCategoryAndWarehouse = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate,
  txnFilterArray,
  warehouseSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel2: { $eq: categoryLevel2 } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          {
            $or: txnFilterArray
          },
          { warehouseData: { $eq: warehouseSelected } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }
      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getFreeSaleTxnByCategory = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel2: { $eq: categoryLevel2 } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          {
            $or: [{ txnType: { $eq: 'Sales' } }, { txnType: { $eq: 'KOT' } }]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          {
            freeTxnQty: { $gt: 0 }
          }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }
      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getSalesTxnByVendor = async (db, phoneNo, fromDate, toDate) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { vendorPhoneNumber: { $eq: phoneNo } },
          {
            $or: [
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'KOT' } }
            ]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getMergedData = async (data, tag1, tag2, tag3) => {
  let results = [];

  let saleTxnData = new Map();
  let purchaseTxnData = new Map();

  let salesData = [];
  let purchasesData = [];

  data.map((item) => {
    let finalData = item.toJSON();

    if (finalData.txnType === tag1) {
      salesData.push(finalData);
    } else if (finalData.txnType === tag2) {
      purchasesData.push(finalData);
    } else if (finalData.txnType === tag3) {
      salesData.push(finalData);
    }
  });

  /**
   * sales data calculation
   */
  for (let finalData of salesData) {
    if (saleTxnData.has(finalData.productId)) {
      let saleTxnModel = saleTxnData.get(finalData.productId);

      saleTxnModel.saleQty =
        parseFloat(saleTxnModel.saleQty) + parseFloat(finalData.txnQty);

      saleTxnModel.saleAmount =
        parseFloat(saleTxnModel.saleAmount) + parseFloat(finalData.amount);

      saleTxnModel.freeQty =
        parseFloat(saleTxnModel.freeQty) + parseFloat(finalData.freeTxnQty);

      saleTxnModel.discountAmount =
        parseFloat(saleTxnModel.discountAmount) +
        parseFloat(finalData.discount_amount);
      saleTxnModel.txnDate = finalData.txnDate;
    } else {
      let saleTxnModel = {};
      saleTxnModel.categoryLevel2DisplayName =
        finalData.categoryLevel2DisplayName;
      saleTxnModel.categoryLevel3DisplayName =
        finalData.categoryLevel3DisplayName;
      saleTxnModel.productName = finalData.productName;
      saleTxnModel.warehouseData = finalData.warehouseData;
      saleTxnModel.modelNo = finalData.modelNo;

      saleTxnModel.saleQty = finalData.txnQty;
      saleTxnModel.freeQty = finalData.freeTxnQty;
      saleTxnModel.saleAmount = parseFloat(finalData.amount);
      saleTxnModel.discountAmount = parseFloat(finalData.discount_amount);

      saleTxnModel.customerName = finalData.customerName;
      saleTxnModel.vendorName = finalData.vendorName;
      saleTxnModel.txnDate = finalData.txnDate;
      saleTxnModel.productId = finalData.productId;

      saleTxnData.set(finalData.productId, saleTxnModel);
    }
  }

  /**
   * purchases data calculation
   */
  for (let finalData of purchasesData) {
    if (purchaseTxnData.has(finalData.productId)) {
      let purchaseTxnModel = purchaseTxnData.get(finalData.productId);

      purchaseTxnModel.purchaseQty =
        parseFloat(purchaseTxnModel.purchaseQty) + parseFloat(finalData.txnQty);

      purchaseTxnModel.freeQty =
        parseFloat(purchaseTxnModel.freeQty) + parseFloat(finalData.freeTxnQty);

      purchaseTxnModel.purchaseAmount =
        purchaseTxnModel.purchaseAmount +
        parseFloat(parseFloat(finalData.amount));

      purchaseTxnModel.discountAmount =
        purchaseTxnModel.discountAmount +
        parseFloat(parseFloat(finalData.discount_amount));
      purchaseTxnModel.txnDate = finalData.txnDate;
    } else {
      let purchaseTxnModel = {};

      purchaseTxnModel.categoryLevel2DisplayName =
        finalData.categoryLevel2DisplayName;
      purchaseTxnModel.categoryLevel3DisplayName =
        finalData.categoryLevel3DisplayName;
      purchaseTxnModel.productName = finalData.productName;
      purchaseTxnModel.warehouseData = finalData.warehouseData;
      purchaseTxnModel.modelNo = finalData.modelNo;

      purchaseTxnModel.purchaseQty = finalData.txnQty;
      purchaseTxnModel.freeQty = finalData.freeTxnQty;
      purchaseTxnModel.purchaseAmount = parseFloat(finalData.amount);

      purchaseTxnModel.discountAmount = parseFloat(
        parseFloat(finalData.discount_amount)
      );

      purchaseTxnModel.vendorName = finalData.vendorName;
      purchaseTxnModel.txnDate = finalData.txnDate;
      purchaseTxnModel.productId = finalData.productId;

      purchaseTxnData.set(finalData.productId, purchaseTxnModel);
    }
  }

  /**
   * cobine sales and purchases
   */
  for (let [key, value] of saleTxnData) {
    // console.log(key + ' = ' + value);

    if (purchaseTxnData.has(key)) {
      let txn = purchaseTxnData.get(key);
      value.purchaseQty = txn.purchaseQty;
      value.purchaseAmount = txn.purchaseAmount;
      value.discountAmount = txn.discountAmount;

      value.vendorName = txn.vendorName;
    }
    results.push(value);
  }

  for (let [key, value] of purchaseTxnData) {
    // console.log(key + ' = ' + value);

    if (!saleTxnData.has(key)) {
      results.push(value);
    }
  }

  return results;
};

const getSalesAndPurchasesMergedData = async (data, tag1, tag2) => {
  let results = [];

  let saleTxnData = new Map();
  let purchaseTxnData = new Map();

  let salesData = [];
  let purchasesData = [];

  data.map((item) => {
    let finalData = item.toJSON();

    if (finalData.txnType === tag1) {
      salesData.push(finalData);
    } else if (finalData.txnType === tag2) {
      purchasesData.push(finalData);
    }
  });

  /**
   * sales data calculation
   */
  for (let finalData of salesData) {
    if (saleTxnData.has(finalData.productId)) {
      let saleTxnModel = saleTxnData.get(finalData.productId);

      saleTxnModel.saleQty =
        parseFloat(saleTxnModel.saleQty) + parseFloat(finalData.txnQty);

      saleTxnModel.freeQty =
        parseFloat(saleTxnModel.freeQty) + parseFloat(finalData.freeTxnQty);

      saleTxnModel.saleAmount =
        parseFloat(saleTxnModel.saleAmount) + parseFloat(finalData.amount);

      saleTxnModel.discountAmount =
        parseFloat(saleTxnModel.discountAmount) +
        parseFloat(finalData.discount_amount);
    } else {
      let saleTxnModel = {};
      saleTxnModel.categoryLevel2DisplayName =
        finalData.categoryLevel2DisplayName;
      saleTxnModel.categoryLevel3DisplayName =
        finalData.categoryLevel3DisplayName;
      saleTxnModel.productName = finalData.productName;
      saleTxnModel.warehouseData = finalData.warehouseData;
      saleTxnModel.modelNo = finalData.modelNo;

      saleTxnModel.saleQty = finalData.txnQty;
      saleTxnModel.freeQty = finalData.freeTxnQty;
      saleTxnModel.saleAmount = parseFloat(finalData.amount);
      saleTxnModel.discountAmount = parseFloat(finalData.discount_amount);

      saleTxnModel.customerName = finalData.customerName;
      saleTxnModel.vendorName = finalData.vendorName;
      saleTxnModel.productId = finalData.productId;

      saleTxnData.set(finalData.productId, saleTxnModel);
    }
  }

  /**
   * purchases data calculation
   */
  for (let finalData of purchasesData) {
    if (purchaseTxnData.has(finalData.productId)) {
      let purchaseTxnModel = purchaseTxnData.get(finalData.productId);

      purchaseTxnModel.purchaseQty =
        parseFloat(purchaseTxnModel.purchaseQty) + parseFloat(finalData.txnQty);

      purchaseTxnModel.freeQty =
        parseFloat(purchaseTxnModel.freeQty) + parseFloat(finalData.freeTxnQty);

      purchaseTxnModel.purchaseAmount =
        purchaseTxnModel.purchaseAmount +
        parseFloat(parseFloat(finalData.amount));

      purchaseTxnModel.discountAmount =
        parseFloat(purchaseTxnModel.discountAmount) +
        parseFloat(finalData.discount_amount);
    } else {
      let purchaseTxnModel = {};

      purchaseTxnModel.categoryLevel2DisplayName =
        finalData.categoryLevel2DisplayName;
      purchaseTxnModel.categoryLevel3DisplayName =
        finalData.categoryLevel3DisplayName;
      purchaseTxnModel.productName = finalData.productName;
      purchaseTxnModel.warehouseData = finalData.warehouseData;
      purchaseTxnModel.modelNo = finalData.modelNo;

      purchaseTxnModel.purchaseQty = finalData.txnQty;
      purchaseTxnModel.freeQty = finalData.freeTxnQty;
      purchaseTxnModel.purchaseAmount = parseFloat(finalData.amount);
      purchaseTxnModel.discountAmount = parseFloat(finalData.discount_amount);

      purchaseTxnModel.vendorName = finalData.vendorName;
      purchaseTxnModel.productId = finalData.productId;

      purchaseTxnData.set(finalData.productId, purchaseTxnModel);
    }
  }

  /**
   * combine sales and purchases
   */
  for (let [key, value] of saleTxnData) {
    if (purchaseTxnData.has(key)) {
      let txn = purchaseTxnData.get(key);
      value.purchaseQty = txn.purchaseQty;
      value.purchaseAmount = txn.purchaseAmount;
      value.discountAmount = txn.discountAmount;

      value.vendorName = txn.vendorName;
    }
    results.push(value);
  }

  for (let [key, value] of purchaseTxnData) {
    // console.log(key + ' = ' + value);

    if (!saleTxnData.has(key)) {
      results.push(value);
    }
  }
  return results;
};

const getPurchasesMergedData = async (data, tag1, tag2, tag3) => {
  let results = [];

  let saleTxnData = new Map();
  let purchaseTxnData = new Map();

  let salesData = [];
  let purchasesData = [];

  data.map((item) => {
    let finalData = item.toJSON();

    if (finalData.txnType === tag1) {
      salesData.push(finalData);
    } else if (finalData.txnType === tag2) {
      purchasesData.push(finalData);
    } else if (finalData.txnType === tag3) {
      salesData.push(finalData);
    }
  });

  /**
   * sales data calculation
   */
  for (let finalData of salesData) {
    if (saleTxnData.has(finalData.productId)) {
      let saleTxnModel = saleTxnData.get(finalData.productId);

      saleTxnModel.saleQty =
        parseFloat(saleTxnModel.saleQty) + parseFloat(finalData.txnQty);

      saleTxnModel.freeQty =
        parseFloat(saleTxnModel.freeQty) + parseFloat(finalData.freeTxnQty);

      saleTxnModel.saleAmount =
        parseFloat(saleTxnModel.saleAmount) + parseFloat(finalData.amount);

      saleTxnModel.discountAmount =
        parseFloat(saleTxnModel.discountAmount) +
        parseFloat(finalData.discount_amount);
    } else {
      let saleTxnModel = {};
      saleTxnModel.categoryLevel2DisplayName =
        finalData.categoryLevel2DisplayName;
      saleTxnModel.categoryLevel3DisplayName =
        finalData.categoryLevel3DisplayName;
      saleTxnModel.productName = finalData.productName;
      saleTxnModel.warehouseData = finalData.warehouseData;
      saleTxnModel.modelNo = finalData.modelNo;

      saleTxnModel.saleQty = finalData.txnQty;
      saleTxnModel.freeQty = finalData.freeTxnQty;
      saleTxnModel.saleAmount = parseFloat(finalData.amount);
      saleTxnModel.discountAmount = parseFloat(finalData.discount_amount);

      saleTxnModel.customerName = finalData.customerName;
      saleTxnModel.vendorName = finalData.vendorName;
      saleTxnModel.productId = finalData.productId;

      saleTxnData.set(finalData.productId, saleTxnModel);
    }
  }

  /**
   * purchases data calculation
   */
  for (let finalData of purchasesData) {
    if (purchaseTxnData.has(finalData.productId)) {
      let purchaseTxnModel = purchaseTxnData.get(finalData.productId);

      purchaseTxnModel.purchaseQty =
        parseFloat(purchaseTxnModel.purchaseQty) + parseFloat(finalData.txnQty);

      purchaseTxnModel.freeQty =
        parseFloat(purchaseTxnModel.freeQty) + parseFloat(finalData.freeTxnQty);

      purchaseTxnModel.purchaseAmount =
        purchaseTxnModel.purchaseAmount +
        parseFloat(parseFloat(finalData.amount));

      purchaseTxnModel.discountAmount =
        parseFloat(purchaseTxnModel.discountAmount) +
        parseFloat(finalData.discount_amount);
    } else {
      let purchaseTxnModel = {};

      purchaseTxnModel.categoryLevel2DisplayName =
        finalData.categoryLevel2DisplayName;
      purchaseTxnModel.categoryLevel3DisplayName =
        finalData.categoryLevel3DisplayName;
      purchaseTxnModel.productName = finalData.productName;
      purchaseTxnModel.warehouseData = finalData.warehouseData;
      purchaseTxnModel.modelNo = finalData.modelNo;

      purchaseTxnModel.purchaseQty = finalData.txnQty;
      purchaseTxnModel.freeQty = finalData.freeTxnQty;
      purchaseTxnModel.purchaseAmount = parseFloat(finalData.amount);
      purchaseTxnModel.discountAmount = parseFloat(finalData.discount_amount);

      purchaseTxnModel.vendorName = finalData.vendorName;
      purchaseTxnModel.productId = finalData.productId;

      purchaseTxnData.set(finalData.productId, purchaseTxnModel);
    }
  }

  /**
   * cobine sales and purchases
   */
  for (let [key, value] of saleTxnData) {
    // console.log(key + ' = ' + value);

    if (purchaseTxnData.has(key)) {
      let txn = purchaseTxnData.get(key);
      value.purchaseQty = txn.purchaseQty;
      value.purchaseAmount = txn.purchaseAmount;
      value.discountAmount = txn.discountAmount;

      value.vendorName = txn.vendorName;
      results.push(value);
    }
  }

  for (let [key, value] of purchaseTxnData) {
    // console.log(key + ' = ' + value);

    if (!saleTxnData.has(key)) {
      results.push(value);
    }
  }
  return results;
};

export const getProfitAndLossReportByProduct = async (
  db,
  productId,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  let openingStockValue;
  let txnForSelectedDateRange;
  let txnFromApril;
  // get opening stock value for product
  let query1 = new Promise(async (resolve) => {
    openingStockValue = await getOpeningStockForProduct(productId);

    resolve('openingStockForProduct');
  });

  // get all products having some txn from todate to today date
  let query2 = new Promise(async (resolve) => {
    txnForSelectedDateRange = await getAllTxnForSelectedProduct(
      db,
      businessData,
      productId,
      fromDate,
      toDate
    );
    resolve('productTxnDataSelectedDataRange');
  });

  // get all current products from april to one day before data table
  let query3 = new Promise(async (resolve) => {
    const previousDay = getYesterdayDate(fromDate);
    const finantialYearStartDate = getFinancialYearStartDate();

    txnFromApril = await getAllTxnForSelectedProduct(
      db,
      businessData,
      productId,
      finantialYearStartDate,
      previousDay
    );
    resolve('productTableData');
  });

  await Promise.all([query1, query2, query3]).then(async (responses) => {
    txnForSelectedDateRange.forEach((txn) => {
      let result = txnFromApril.find(
        (item) => item.productId === txn.productId
      );

      txn.openingStockValue =
        openingStockValue +
        (result ? result.purchaseAmount : 0) -
        (result ? result.purchaseReturnAmount : 0) -
        (result ? result.saleAmount : 0) +
        (result ? result.salesReturnAmount : 0);

      txn.closingStockValue =
        txn.openingStockValue +
        txn.purchaseAmount -
        txn.purchaseReturnAmount -
        txn.saleAmount +
        txn.salesReturnAmount;

      txn.profitOrLoss =
        txn.profitOrLoss + txn.openingStockValue - txn.closingStockValue;

      results.push(txn);
    });
  });
  return results;
};

const getAllTxnForSelectedProduct = async (
  db,
  businessData,
  productId,
  fromDate,
  toDate
) => {
  let results = [];
  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { productId: { $eq: productId } },
          {
            $or: [
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'Sales Return' } },
              { txnType: { $eq: 'Purchases Return' } },
              { txnType: { $eq: 'KOT' } }
            ]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }

      results = await getMergedProfitAndLossData(data);
    });

  return results;
};

const getAllTxnForSelectedCategory = async (
  db,
  businessData,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate
) => {
  let results = [];
  //get txn during the selected period
  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel2: { $eq: categoryLevel2 } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          {
            $or: [
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'Sales Return' } },
              { txnType: { $eq: 'Purchases Return' } },
              { txnType: { $eq: 'KOT' } }
            ]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }
      results = await getMergedProfitAndLossData(data);
    });

  return results;
};

export const getProfitAndLossReportByCategory = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  let openingStockProductList = [];
  let txnForSelectedDateRange = [];
  let txnFromApril = [];

  // get opening stock value for product
  let query1 = new Promise(async (resolve) => {
    openingStockProductList = await getOpeningStockForProductsByCategory(
      categoryLevel3
    );
    resolve('openingStockForProduct');
  });

  // get all products having some txn from todate to today date
  let query2 = new Promise(async (resolve) => {
    txnForSelectedDateRange = await getAllTxnForSelectedCategory(
      db,
      businessData,
      categoryLevel2,
      categoryLevel3,
      fromDate,
      toDate
    );
    resolve('productTxnDataSelectedDataRange');
  });

  // get all current products from april to one day before data table
  let query3 = new Promise(async (resolve) => {
    const previousDay = getYesterdayDate(fromDate);
    const finantialYearStartDate = getFinancialYearStartDate();

    txnFromApril = await getAllTxnForSelectedProduct(
      db,
      businessData,
      categoryLevel2,
      categoryLevel3,
      finantialYearStartDate,
      previousDay
    );
    resolve('productTableData');
  });

  await Promise.all([query1, query2, query3]).then(async (responses) => {
    txnForSelectedDateRange.forEach((txn) => {
      let result = txnFromApril.find(
        (item) => item.productId === txn.productId
      );

      let openingStockProduct = openingStockProductList.find(
        (item) => item.productId === txn.productId
      );

      txn.openingStockValue =
        (openingStockProduct ? openingStockProduct.openingStockValue : 0) +
        (result ? result.purchaseAmount : 0) -
        (result ? result.purchaseReturnAmount : 0) -
        (result ? result.saleAmount : 0) +
        (result ? result.salesReturnAmount : 0);

      txn.closingStockValue =
        txn.openingStockValue +
        txn.purchaseAmount -
        txn.purchaseReturnAmount -
        txn.saleAmount +
        txn.salesReturnAmount;

      txn.profitOrLoss =
        txn.profitOrLoss + txn.openingStockValue - txn.closingStockValue;

      results.push(txn);
    });
  });

  return results;
};

const getMergedProfitAndLossData = async (data) => {
  let results = [];

  let saleTxnData = new Map();
  let purchaseTxnData = new Map();
  let salesReturnTxnData = new Map();
  let purchasesReturnTxnData = new Map();

  data.map((item) => {
    let finalData = item.toJSON();

    if (finalData.txnType === 'Sales' || finalData.txnType === 'KOT') {
      let txnModel = {};
      if (saleTxnData.has(finalData.productId)) {
        txnModel = saleTxnData.get(finalData.productId);
        txnModel.amount =
          parseFloat(txnModel.amount) +
            parseFloat(finalData.amount) -
            parseFloat(finalData.cgst_amount) ||
          0 - parseFloat(finalData.sgst_amount) ||
          0 - parseFloat(finalData.igst_amount) ||
          0;
        txnModel.purchaseAmount =
          parseFloat(txnModel.purchaseAmount) +
          parseFloat(finalData.purchasedPrice) * parseFloat(finalData.txnQty);

        txnModel.taxAmount =
          parseFloat(txnModel.taxAmount) + parseFloat(finalData.taxAmount);

        saleTxnData.set(finalData.productId, txnModel);
      } else {
        txnModel.productName = finalData.productName;
        txnModel.amount =
          parseFloat(finalData.amount) - parseFloat(finalData.cgst_amount) ||
          0 - parseFloat(finalData.sgst_amount) ||
          0 - parseFloat(finalData.igst_amount) ||
          0;
        txnModel.purchaseAmount =
          parseFloat(finalData.purchasedPrice) * parseFloat(finalData.txnQty);
        txnModel.taxAmount = parseFloat(finalData.taxAmount);

        saleTxnData.set(finalData.productId, txnModel);
      }
    }

    if (finalData.txnType === 'Sales Return') {
      let txnModel = {};
      if (salesReturnTxnData.has(finalData.productId)) {
        txnModel = salesReturnTxnData.get(finalData.productId);
        txnModel.amount =
          parseFloat(txnModel.amount) +
            parseFloat(finalData.amount) -
            parseFloat(finalData.cgst_amount) ||
          0 - parseFloat(finalData.sgst_amount) ||
          0 - parseFloat(finalData.igst_amount) ||
          0;
        txnModel.purchaseAmount =
          parseFloat(txnModel.purchaseAmount) +
          parseFloat(finalData.purchasedPrice) * parseFloat(finalData.txnQty);

        txnModel.taxAmount =
          parseFloat(txnModel.taxAmount) + parseFloat(finalData.taxAmount);

        salesReturnTxnData.set(finalData.productId, txnModel);
      } else {
        txnModel.amount =
          parseFloat(finalData.amount) - parseFloat(finalData.cgst_amount) ||
          0 - parseFloat(finalData.sgst_amount) ||
          0 - parseFloat(finalData.igst_amount) ||
          0;
        txnModel.purchaseAmount =
          parseFloat(finalData.purchasedPrice) * parseFloat(finalData.txnQty);

        txnModel.taxAmount = parseFloat(finalData.taxAmount);

        salesReturnTxnData.set(finalData.productId, txnModel);
      }
    }

    if (finalData.txnType === 'Purchases') {
      let txnModel = {};
      if (purchaseTxnData.has(finalData.productId)) {
        txnModel = purchaseTxnData.get(finalData.productId);
        txnModel.amount =
          parseFloat(txnModel.amount) +
            parseFloat(finalData.amount) -
            parseFloat(finalData.cgst_amount) ||
          0 - parseFloat(finalData.sgst_amount) ||
          0 - parseFloat(finalData.igst_amount) ||
          0;
        txnModel.purchaseAmount =
          parseFloat(txnModel.purchaseAmount) +
          parseFloat(finalData.purchasedPrice) * parseFloat(finalData.txnQty);

        txnModel.taxAmount =
          parseFloat(txnModel.taxAmount) + parseFloat(finalData.taxAmount);

        purchaseTxnData.set(finalData.productId, txnModel);
      } else {
        txnModel.amount =
          parseFloat(finalData.amount) - parseFloat(finalData.cgst_amount) ||
          0 - parseFloat(finalData.sgst_amount) ||
          0 - parseFloat(finalData.igst_amount) ||
          0;
        txnModel.purchaseAmount =
          parseFloat(finalData.purchasedPrice) * parseFloat(finalData.txnQty);

        txnModel.taxAmount = parseFloat(finalData.taxAmount);

        purchaseTxnData.set(finalData.productId, txnModel);
      }
    }

    if (finalData.txnType === 'Purchases Return') {
      let txnModel = {};
      if (purchasesReturnTxnData.has(finalData.productId)) {
        txnModel = purchasesReturnTxnData.get(finalData.productId);
        txnModel.amount =
          parseFloat(txnModel.amount) +
            parseFloat(finalData.amount) -
            parseFloat(finalData.cgst_amount) ||
          0 - parseFloat(finalData.sgst_amount) ||
          0 - parseFloat(finalData.igst_amount) ||
          0;
        txnModel.purchaseAmount =
          parseFloat(txnModel.purchaseAmount) +
          parseFloat(finalData.purchased_price) * parseFloat(finalData.txnQty);

        txnModel.taxAmount =
          parseFloat(txnModel.taxAmount) + parseFloat(finalData.taxAmount);

        purchasesReturnTxnData.set(finalData.productId, txnModel);
      } else {
        txnModel.amount =
          parseFloat(finalData.amount) - parseFloat(finalData.cgst_amount) ||
          0 - parseFloat(finalData.sgst_amount) ||
          0 - parseFloat(finalData.igst_amount) ||
          0;
        txnModel.purchaseAmount =
          parseFloat(finalData.purchased_price) * parseFloat(finalData.txnQty);

        txnModel.taxAmount = parseFloat(finalData.taxAmount);

        purchasesReturnTxnData.set(finalData.productId, txnModel);
      }
    }
  });

  /**
   * combine sales, sales return, purchases, purchase return
   */
  for (let [key, value] of saleTxnData) {
    value.taxOut = parseFloat(value.taxAmount);
    value.taxIn = 0;

    value.productId = key;

    value.saleAmount = parseFloat(value.amount);

    if (purchaseTxnData.has(key)) {
      let txn = purchaseTxnData.get(key);
      value.purchaseAmount = parseFloat(txn.amount);
      value.taxIn = parseFloat(value.taxIn) + parseFloat(txn.taxAmount);
    } else {
      value.purchaseAmount = 0;
    }

    if (salesReturnTxnData.has(key)) {
      let txn = salesReturnTxnData.get(key);
      value.salesReturnAmount = parseFloat(txn.amount);
      value.taxIn = parseFloat(value.taxIn) + parseFloat(txn.taxAmount);
    } else {
      value.salesReturnAmount = 0;
    }

    if (purchasesReturnTxnData.has(key)) {
      let txn = purchasesReturnTxnData.get(key);
      value.purchaseReturnAmount = parseFloat(txn.amount);
      value.taxOut = parseFloat(value.taxOut) + parseFloat(txn.taxAmount);
    } else {
      value.purchaseReturnAmount = 0;
    }

    if (!value.salesReturnAmount) {
      value.salesReturnAmount = 0;
    }
    if (!value.purchaseReturnAmount) {
      value.purchaseReturnAmount = 0;
    }
    if (!value.purchaseAmount) {
      value.purchaseAmount = 0;
    }

    value.profitOrLoss =
      parseFloat(value.amount) -
      parseFloat(value.purchaseAmount) -
      parseFloat(value.salesReturnAmount) +
      parseFloat(value.purchaseReturnAmount);

    results.push(value);
  }

  return results;
};

export const getSaleReturnTxnByCategory = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel2: { $eq: categoryLevel2 } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          {
            $or: [
              { txnType: { $eq: 'Sales Return' } },
              { txnType: { $eq: 'Purchases Return' } }
            ]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }
      results = await getMergedData(data, 'Sales Return', 'Purchases Return');
    });

  return results;
};

export const getReturnTxnByProduct = async (
  db,
  productId,
  fromDate,
  toDate
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { productId: { $eq: productId } },
          {
            $or: [
              { txnType: { $eq: 'Sales Return' } },
              { txnType: { $eq: 'Purchases Return' } }
            ]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }

      results = await getSalesAndPurchasesMergedData(
        data,
        'Sales Return',
        'Purchases Return'
      );
    });

  return results;
};

export const getReturnTxn = async (db, fromDate, toDate) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: [
              { txnType: { $eq: 'Sales Return' } },
              { txnType: { $eq: 'Purchases Return' } }
            ]
          },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No data is available
        return;
      }

      results = await getSalesAndPurchasesMergedData(
        data,
        'Sales Return',
        'Purchases Return'
      );
    });

  return results;
};

export const getStockDetailReport = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate,
  warehouse
) => {
  let txnForSelectedDateRange = [];
  let finalResults = new Map();

  let openingStockProductList = [];
  let txnFromApril = [];

  let results = [];

  // get opening stock value for product
  let query1 = new Promise(async (resolve) => {
    openingStockProductList = await getOpeningStockQtyForProductsByCategory(
      categoryLevel3,
      warehouse
    );
    resolve('openingStockForProduct');
  });

  // get all products having some txn during the selected date
  let query2 = new Promise(async (resolve) => {
    txnForSelectedDateRange = await getProductTxnListByCategoryAndDate(
      db,
      categoryLevel3,
      fromDate,
      toDate,
      warehouse
    );
    resolve('txnForSelectedDateRange');
  });

  // get all products having some txn from april 1
  let query3 = new Promise(async (resolve) => {
    const previousDay = getYesterdayDate(fromDate);
    const finantialYearStartDate = getFinancialYearStartDate();

    txnFromApril = await getProductTxnListByCategoryAndDate(
      db,
      categoryLevel3,
      finantialYearStartDate,
      previousDay,
      warehouse
    );

    resolve('txnFromApril');
  });

  // The order is preserved regardless of what resolved first
  await Promise.all([query1, query2, query3]).then(async (responses) => {
    for (let item of txnForSelectedDateRange) {
      let productModel = {};

      //we will get one or more values
      let allTxnBeforeSelectedDate = txnFromApril.filter(
        (txn) => txn.productId === item.productId
      );

      //we will get only one result
      let openingStockProduct = openingStockProductList.find(
        (txn) => txn.productId === item.productId
      );

      if (finalResults.has(item.productId)) {
        productModel = finalResults.get(item.productId);

        if (
          item.txnType === 'Sales' ||
          item.txnType === 'KOT' ||
          item.txnType === 'Raw Material' ||
          item.txnType === 'Remove Stock' ||
          item.txnType === 'Damage Stock'
        ) {
          productModel.qtyOut =
            parseFloat(productModel.qtyOut) + parseFloat(item.txnQty);
          productModel.salesAmount =
            parseFloat(productModel.salesAmount) + parseFloat(item.amount);
        } else if (item.txnType === 'Sales Return') {
          productModel.qtyIn =
            parseFloat(productModel.qtyIn) + parseFloat(item.txnQty);
        } else if (
          item.txnType === 'Purchases' ||
          item.txnType === 'Manufacture' ||
          item.txnType === 'Add Stock'
        ) {
          productModel.qtyIn =
            parseFloat(productModel.qtyIn) + parseFloat(item.txnQty);
          productModel.purchasesAmount =
            parseFloat(productModel.purchasesAmount) +
            parseFloat(item.purchasedPrice);
        } else if (item.txnType === 'Purchases Return') {
          productModel.qtyOut =
            parseFloat(productModel.qtyOut) + parseFloat(item.txnQty);
        }

        finalResults.set(item.productId, productModel);
      } else {
        productModel.productName = item.productName;
        productModel.productHsn = item.hsn;
        productModel.netWeight = item.netWeight;
        productModel.qtyIn = 0;
        productModel.qtyOut = 0;
        productModel.salesAmount = 0;
        productModel.purchasesAmount = 0;
        productModel.openingQty = 0;
        productModel.updatedAt = item.updatedAt;

        if (
          item.txnType === 'Sales' ||
          item.txnType === 'KOT' ||
          item.txnType === 'Raw Material' ||
          item.txnType === 'Remove Stock' ||
          item.txnType === 'Damage Stock'
        ) {
          productModel.qtyOut = parseFloat(item.txnQty);
          productModel.salesAmount = parseFloat(item.amount);
        } else if (item.txnType === 'Sales Return') {
          productModel.qtyIn = parseFloat(item.txnQty);
        } else if (
          item.txnType === 'Purchases' ||
          item.txnType === 'Manufacture' ||
          item.txnType === 'Add Stock'
        ) {
          productModel.qtyIn = parseFloat(item.txnQty);
          productModel.purchasesAmount = parseFloat(item.purchasedPrice);
        } else if (item.txnType === 'Purchases Return') {
          productModel.qtyOut = parseFloat(item.txnQty);
        }

        let openingStockQty = openingStockProduct
          ? openingStockProduct.openingStockValue
          : 0;

        for (let single of allTxnBeforeSelectedDate) {
          if (
            single.txnType === 'Sales' ||
            single.txnType === 'KOT' ||
            item.txnType === 'Raw Material' ||
            item.txnType === 'Remove Stock' ||
            item.txnType === 'Damage Stock'
          ) {
            openingStockQty =
              parseFloat(openingStockQty) - parseFloat(single.txnQty);
          } else if (single.txnType === 'Sales Return') {
            openingStockQty =
              parseFloat(openingStockQty) + parseFloat(single.txnQty);
          } else if (
            single.txnType === 'Purchases' ||
            item.txnType === 'Manufacture' ||
            item.txnType === 'Add Stock'
          ) {
            openingStockQty =
              parseFloat(openingStockQty) + parseFloat(single.txnQty);
          } else if (single.txnType === 'Purchases Return') {
            openingStockQty =
              parseFloat(openingStockQty) - parseFloat(single.txnQty);
          }
        }

        productModel.openingQty = parseFloat(openingStockQty);

        finalResults.set(item.productId, productModel);
      }
    }

    // push all records to final results
    for (const [key, value] of finalResults.entries()) {
      // console.log(key, value);
      let productModel = value;

      productModel.closingQty =
        parseFloat(productModel.openingQty) +
        parseFloat(productModel.qtyIn) -
        parseFloat(productModel.qtyOut);
      productModel.productId = key;
      results.push(productModel);
    }
  });
  return results;
};

export const getStockDetailReportForAllProducts = async (
  db,
  fromDate,
  toDate,
  warehouse,
  skip = 0,
  limit = 0
) => {
  let txnForSelectedDateRange = [];
  let finalResults = new Map();

  let openingStockProductList = [];
  let txnFromApril = [];

  let results = [];

  // get opening stock value for product
  let query1 = new Promise(async (resolve) => {
    openingStockProductList = await getOpeningStockQtyForProducts(warehouse);
    resolve('openingStockForProduct');
  });

  // get all products having some txn during the selected date
  let query2 = new Promise(async (resolve) => {
    txnForSelectedDateRange = await getProductTxnListByDate(
      db,
      fromDate,
      toDate,
      warehouse,
      skip,
      limit
    );
    resolve('txnForSelectedDateRange');
  });

  // get all products having some txn from april 1
  let query3 = new Promise(async (resolve) => {
    const previousDay = getYesterdayDate(fromDate);
    const finantialYearStartDate = getFinancialYearStartDate();

    txnFromApril = await getProductTxnListByDate(
      db,
      finantialYearStartDate,
      previousDay,
      warehouse,
      skip,
      limit
    );

    resolve('txnFromApril');
  });

  // The order is preserved regardless of what resolved first
  await Promise.all([query1, query2, query3]).then(async (responses) => {
    for (let item of txnForSelectedDateRange) {
      let productModel = {};

      //we will get one or more values
      let allTxnBeforeSelectedDate = txnFromApril.filter(
        (txn) => txn.productId === item.productId
      );
      // console.log("joe",txnForSelectedDateRange);
      //we will get only one result
      let openingStockProduct = openingStockProductList.find(
        (txn) => txn.productId === item.productId
      );

      if (finalResults.has(item.productId)) {
        productModel = finalResults.get(item.productId);

        if (
          item.txnType === 'Sales' ||
          item.txnType === 'KOT' ||
          item.txnType === 'Raw Material' ||
          item.txnType === 'Remove Stock' ||
          item.txnType === 'Damage Stock'
        ) {
          productModel.qtyOut =
            parseFloat(productModel.qtyOut) + parseFloat(item.txnQty);
          productModel.salesAmount =
            parseFloat(productModel.salesAmount) + parseFloat(item.amount);
        } else if (item.txnType === 'Sales Return') {
          productModel.qtyIn =
            parseFloat(productModel.qtyIn) + parseFloat(item.txnQty);
          productModel.amountIn =
            parseFloat(productModel.amountIn) + parseFloat(item.amount);
        } else if (
          item.txnType === 'Purchases' ||
          item.txnType === 'Manufacture' ||
          item.txnType === 'Add Stock'
        ) {
          productModel.qtyIn =
            parseFloat(productModel.qtyIn) + parseFloat(item.txnQty);
          productModel.amountIn =
            parseFloat(productModel.amountIn) + parseFloat(item.amount);
          productModel.purchasesAmount =
            parseFloat(productModel.purchasesAmount) +
            parseFloat(item.purchasedPrice);
        } else if (item.txnType === 'Purchases Return') {
          productModel.qtyOut =
            parseFloat(productModel.qtyOut) + parseFloat(item.txnQty);
        }

        productModel.salePrice += parseFloat(item.mrp || 0);
        // productModel.salePrice = parseFloat(item.salePrice || 0);
        // productModel.purchasedPrice += parseFloat(item.purchasedPrice || 0);

        finalResults.set(item.productId, productModel);
      } else {
        productModel.productName = item.productName;
        productModel.productHsn = item.hsn;
        productModel.netWeight = item.netWeight;
        productModel.qtyIn = 0;
        productModel.qtyOut = 0;
        productModel.salesAmount = 0;
        productModel.amountIn = 0;
        productModel.purchasesAmount = 0;
        productModel.openingQty = 0;
        productModel.openingStockPurchasedPrice = 0;
        productModel.updatedAt = item.updatedAt;

        if (
          item.txnType === 'Sales' ||
          item.txnType === 'KOT' ||
          item.txnType === 'Raw Material' ||
          item.txnType === 'Remove Stock' ||
          item.txnType === 'Damage Stock'
        ) {
          productModel.qtyOut = parseFloat(item.txnQty);
          productModel.salesAmount = parseFloat(item.amount);
        } else if (item.txnType === 'Sales Return') {
          productModel.qtyIn = parseFloat(item.txnQty);
          productModel.amountIn = parseFloat(item.amount);
        } else if (
          item.txnType === 'Purchases' ||
          item.txnType === 'Manufacture' ||
          item.txnType === 'Add Stock'
        ) {
          productModel.qtyIn = parseFloat(item.txnQty);
          productModel.amountIn = parseFloat(item.amount);
          productModel.purchasesAmount = parseFloat(item.purchasedPrice);
        } else if (item.txnType === 'Purchases Return') {
          productModel.qtyOut = parseFloat(item.txnQty);
        }

        let openingStockQty = openingStockProduct
          ? openingStockProduct.openingStockValue
          : 0;
        let openingStockPurchasedPrice = openingStockProduct
          ? openingStockProduct.purchasedPrice
          : 0;

        for (let single of allTxnBeforeSelectedDate) {
          if (
            single.txnType === 'Sales' ||
            single.txnType === 'KOT' ||
            item.txnType === 'Raw Material' ||
            item.txnType === 'Remove Stock' ||
            item.txnType === 'Damage Stock'
          ) {
            openingStockQty =
              parseFloat(openingStockQty) - parseFloat(single.txnQty);
          } else if (single.txnType === 'Sales Return') {
            openingStockQty =
              parseFloat(openingStockQty) + parseFloat(single.txnQty);
          } else if (
            single.txnType === 'Purchases' ||
            item.txnType === 'Manufacture' ||
            item.txnType === 'Add Stock'
          ) {
            openingStockQty =
              parseFloat(openingStockQty) + parseFloat(single.txnQty);
          } else if (single.txnType === 'Purchases Return') {
            openingStockQty =
              parseFloat(openingStockQty) - parseFloat(single.txnQty);
          }
        }

        productModel.openingQty = parseFloat(openingStockQty);
        productModel.openingStockPurchasedPrice = parseFloat(
          openingStockPurchasedPrice
        );

        finalResults.set(item.productId, productModel);
      }
    }

    // push all records to final results
    for (const [key, value] of finalResults.entries()) {
      // console.log(key, value);
      let productModel = value;

      productModel.closingQty =
        parseFloat(productModel.openingQty) +
        parseFloat(productModel.qtyIn) -
        parseFloat(productModel.qtyOut);

      productModel.productId = key;
      results.push(productModel);
    }
  });
  return results;
};

export const getStockDetailReportByProduct = async (
  db,
  productId,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate,
  warehouse
) => {
  let txnForSelectedDateRange = [];
  let finalResults = new Map();

  let openingStockProductList = [];
  let txnFromApril = [];

  let results = [];

  // get opening stock value for product
  let query1 = new Promise(async (resolve) => {
    openingStockProductList = await getOpeningStockQtyForProduct(
      productId,
      warehouse
    );
    resolve('openingStockForProduct');
  });

  // get all products having some txn during the selected date
  let query2 = new Promise(async (resolve) => {
    txnForSelectedDateRange = await getProductTxnListByProductAndDate(
      db,
      productId,
      fromDate,
      toDate,
      warehouse
    );
    resolve('txnForSelectedDateRange');
  });

  // get all products having some txn from april 1
  let query3 = new Promise(async (resolve) => {
    const previousDay = getYesterdayDate(fromDate);
    const finantialYearStartDate = getFinancialYearStartDate();

    txnFromApril = await getProductTxnListByProductAndDate(
      db,
      productId,
      finantialYearStartDate,
      previousDay,
      warehouse
    );

    resolve('txnFromApril');
  });

  // The order is preserved regardless of what resolved first
  await Promise.all([query1, query2, query3]).then(async (responses) => {
    for (let item of txnForSelectedDateRange) {
      let productModel = {};

      //we will get one or more values
      let allTxnBeforeSelectedDate = txnFromApril.filter(
        (txn) => txn.productId === item.productId
      );

      //we will get only one result
      let openingStockProduct = openingStockProductList.find(
        (txn) => txn.productId === item.productId
      );

      if (finalResults.has(item.productId)) {
        productModel = finalResults.get(item.productId);

        if (
          item.txnType === 'Sales' ||
          item.txnType === 'KOT' ||
          item.txnType === 'Raw Material' ||
          item.txnType === 'Remove Stock' ||
          item.txnType === 'Damage Stock'
        ) {
          productModel.qtyOut =
            parseFloat(productModel.qtyOut) + parseFloat(item.txnQty);
          productModel.salesAmount =
            parseFloat(productModel.salesAmount) + parseFloat(item.amount);
        } else if (item.txnType === 'Sales Return') {
          productModel.qtyIn =
            parseFloat(productModel.qtyIn) + parseFloat(item.txnQty);
        } else if (
          item.txnType === 'Purchases' ||
          item.txnType === 'Manufacture' ||
          item.txnType === 'Add Stock'
        ) {
          productModel.qtyIn =
            parseFloat(productModel.qtyIn) + parseFloat(item.txnQty);
          productModel.purchasesAmount =
            parseFloat(productModel.purchasesAmount) +
            parseFloat(item.purchasedPrice);
        } else if (item.txnType === 'Purchases Return') {
          productModel.qtyOut =
            parseFloat(productModel.qtyOut) + parseFloat(item.txnQty);
        }

        finalResults.set(item.productId, productModel);
      } else {
        productModel.productName = item.productName;
        productModel.productHsn = item.hsn;
        productModel.qtyIn = 0;
        productModel.qtyOut = 0;
        productModel.salesAmount = 0;
        productModel.purchasesAmount = 0;
        productModel.openingQty = 0;
        productModel.updatedAt = item.updatedAt;

        if (
          item.txnType === 'Sales' ||
          item.txnType === 'KOT' ||
          item.txnType === 'Raw Material' ||
          item.txnType === 'Remove Stock' ||
          item.txnType === 'Damage Stock'
        ) {
          productModel.qtyOut = parseFloat(item.txnQty);
          productModel.salesAmount = parseFloat(item.amount);
        } else if (item.txnType === 'Sales Return') {
          productModel.qtyIn = parseFloat(item.txnQty);
        } else if (
          item.txnType === 'Purchases' ||
          item.txnType === 'Manufacture' ||
          item.txnType === 'Add Stock'
        ) {
          productModel.qtyIn = parseFloat(item.txnQty);
          productModel.purchasesAmount = parseFloat(item.purchasedPrice);
        } else if (item.txnType === 'Purchases Return') {
          productModel.qtyOut = parseFloat(item.txnQty);
        }

        let openingStockQty = openingStockProduct
          ? openingStockProduct.openingStockValue
          : 0;

        for (let single of allTxnBeforeSelectedDate) {
          if (
            single.txnType === 'Sales' ||
            single.txnType === 'KOT' ||
            item.txnType === 'Raw Material' ||
            item.txnType === 'Remove Stock' ||
            item.txnType === 'Damage Stock'
          ) {
            openingStockQty =
              parseFloat(openingStockQty) - parseFloat(single.txnQty);
          } else if (single.txnType === 'Sales Return') {
            openingStockQty =
              parseFloat(openingStockQty) + parseFloat(single.txnQty);
          } else if (
            single.txnType === 'Purchases' ||
            item.txnType === 'Manufacture' ||
            item.txnType === 'Add Stock'
          ) {
            openingStockQty =
              parseFloat(openingStockQty) + parseFloat(single.txnQty);
          } else if (single.txnType === 'Purchases Return') {
            openingStockQty =
              parseFloat(openingStockQty) - parseFloat(single.txnQty);
          }
        }

        productModel.openingQty = parseFloat(openingStockQty);

        finalResults.set(item.productId, productModel);
      }
    }

    // push all records to final results
    for (const [key, value] of finalResults.entries()) {
      // console.log(key, value);
      let productModel = value;

      productModel.closingQty =
        parseFloat(productModel.openingQty) +
        parseFloat(productModel.qtyIn) -
        parseFloat(productModel.qtyOut);

      productModel.productId = key;
      results.push(productModel);
    }
  });
  return results;
};

const compareDatesAndGetLowestDataQty = async (existingProduct, newProduct) => {
  let result = {};
  if (
    parseFloat(existingProduct.updatedAt) <= parseFloat(newProduct.updatedAt)
  ) {
    result.updatedAt = existingProduct.stockQty;
    result.stockQty = existingProduct.stockQty;
    return result;
  } else {
    result.updatedAt = newProduct.stockQty;
    result.stockQty = newProduct.stockQty;
    return result;
  }
};

const getProductTableListByCategory = async (db, categoryLevel3) => {
  let results = [];

  const businessData = await Bd.getBusinessData();

  await db.businessproduct
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { 'categoryLevel3.name': { $eq: categoryLevel3 } }
        ]
      }
    })
    .exec()
    .then((data) => {
      results = data.map((item) => item.toJSON());
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });

  return results;
};

const getProductTxnListByCategoryAndDate = async (
  db,
  categoryLevel3,
  fromDate,
  toDate,
  warehouse
) => {
  let results = [];

  const businessData = await Bd.getBusinessData();

  let txnFilterArray = [];
  if (warehouse !== undefined && warehouse !== '' && warehouse !== null) {
    const warehouseFilter = {
      warehouse: { $eq: warehouse }
    };
    txnFilterArray.push(warehouseFilter);
  }

  let query;

  if (txnFilterArray.length > 0) {
    query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          {
            $or: txnFilterArray
          }
        ]
      }
    });
  } else {
    query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryLevel3: { $eq: categoryLevel3 } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    });
  }

  await query.exec().then(async (data) => {
    if (!data) {
      // No data is available
      return;
    }

    results = data.map((item) => item.toJSON());
  });

  return results;
};

const getProductTxnListByDate = async (
  db,
  fromDate,
  toDate,
  warehouse,
  skip,
  limit
) => {
  let results = [];

  const businessData = await Bd.getBusinessData();

  if (warehouse) {
    if (limit == 0) {
      await db.producttxn
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnDate: { $gte: fromDate } },
              { txnDate: { $lte: toDate } },
              {
                warehouseData: { $lte: warehouse }
              }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          if (!data) {
            // No data is available
            return;
          }

          results = data.map((item) => item.toJSON());
        });
    } else {
      await db.producttxn
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnDate: { $gte: fromDate } },
              { txnDate: { $lte: toDate } },
              {
                warehouseData: { $lte: warehouse }
              }
            ]
          },
          skip: skip,
          limit: limit
        })
        .exec()
        .then(async (data) => {
          if (!data) {
            // No data is available
            return;
          }

          results = data.map((item) => item.toJSON());
        });
    }
  } else {
    if (limit === 0) {
      await db.producttxn
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnDate: { $gte: fromDate } },
              { txnDate: { $lte: toDate } }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          if (!data) {
            // No data is available
            return;
          }

          results = data.map((item) => item.toJSON());
        });
    } else {
      await db.producttxn
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnDate: { $gte: fromDate } },
              { txnDate: { $lte: toDate } }
            ]
          },
          skip: skip,
          limit: limit
        })
        .exec()
        .then(async (data) => {
          if (!data) {
            // No data is available
            return;
          }

          results = data.map((item) => item.toJSON());
        });
    }
  }
  return results;
};

export const getProductTxnListByDateAndProduct = async (
  db,
  productId,
  fromDate,
  toDate,
  saleSelected,
  saleReturnSelected,
  purchaseSelected,
  purchaseReturnSelected,
  rawMaterialSelected,
  manufactureSelected,
  addStockSelected,
  removeStockSelected,
  damagedStockSelected,
  openingStockSelected,
  skip,
  limit
) => {
  const businessData = await Bd.getBusinessData();

  const txnTypes = [
    { selected: saleSelected, types: ['Sales', 'KOT'] },
    { selected: saleReturnSelected, types: ['Sales Return'] },
    { selected: purchaseSelected, types: ['Purchases'] },
    { selected: purchaseReturnSelected, types: ['Purchases Return'] },
    { selected: rawMaterialSelected, types: ['Raw Material'] },
    { selected: manufactureSelected, types: ['Manufacture'] },
    { selected: addStockSelected, types: ['Add Stock'] },
    { selected: removeStockSelected, types: ['Remove Stock'] },
    { selected: damagedStockSelected, types: ['Damage Stock'] },
    { selected: openingStockSelected, types: ['Opening Stock'] }
  ];

  const txnFilterArray = txnTypes
    .filter(({ selected }) => selected)
    .flatMap(({ types }) => types.map((type) => ({ txnType: { $eq: type } })));

  if (txnFilterArray.length > 0) {
    let filterArray = [];

    if (fromDate !== '' && toDate) {
      filterArray = [
        { businessId: { $eq: businessData.businessId } },
        { productId: { $eq: productId } },
        { txnDate: { $gte: fromDate } },
        { txnDate: { $lte: toDate } },
        { updatedAt: { $exists: true } },
        ...(txnFilterArray.length > 0 ? [{ $or: txnFilterArray }] : [])
      ];
    } else if (fromDate === '' && toDate) {
      filterArray = [
        { businessId: { $eq: businessData.businessId } },
        { productId: { $eq: productId } },
        { txnDate: { $lte: toDate } },
        { updatedAt: { $exists: true } },
        ...(txnFilterArray.length > 0 ? [{ $or: txnFilterArray }] : [])
      ];
    }

    const queryOptions = {
      selector: { $and: filterArray },
      sort: [{ txnDate: 'asc' }, { updatedAt: 'asc' }],
      ...(limit !== 0 && { skip, limit })
    };

    return await db.producttxn
      .find(queryOptions)
      .exec()
      .then((data) => (data ? data.map((item) => item.toJSON()) : []));
  } else {
    return [];
  }
};

const getProductTxnListByProductAndDate = async (
  db,
  productId,
  fromDate,
  toDate,
  warehouse
) => {
  let results = [];

  const businessData = await Bd.getBusinessData();

  let txnFilterArray = [];
  if (warehouse !== undefined && warehouse !== '' && warehouse !== null) {
    const warehouseFilter = {
      warehouse: { $eq: warehouse }
    };
    txnFilterArray.push(warehouseFilter);
  }

  let query;

  if (txnFilterArray.length > 0) {
    query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { productId: { $eq: productId } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } },
          {
            $or: txnFilterArray
          }
        ]
      }
    });
  } else {
    query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { productId: { $eq: productId } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    });
  }

  await query.exec().then(async (data) => {
    if (!data) {
      // No data is available
      return;
    }

    results = data.map((item) => item.toJSON());
  });

  return results;
};

export const getManufactureProductTxnListByDateAndProduct = async (
  db,
  fromDate,
  toDate,
  productId
) => {
  let results = [];

  const businessData = await Bd.getBusinessData();

  if (productId) {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { productId: { $eq: productId } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } },
            { txnType: { $eq: 'Manufacture' } },
            { updatedAt: { $exists: true } }
          ],
          sort: [{ txnDate: 'desc' }]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }

        results = data.map((item) => item.toJSON());
      });
  } else {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } },
            { txnType: { $eq: 'Manufacture' } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }

        results = data.map((item) => item.toJSON());
      });
  }

  return results;
};

export const getDiscountTxnForSales = async (
  db,
  fromDate,
  toDate,
  productId,
  customerId,
  level2,
  level3,
  txnFilterArray
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  let otherOptionsFilterArray = [];
  let categoryFilterArray = [];

  if (productId !== undefined && productId !== '') {
    const productTypeFilter = {
      productId: { $eq: productId }
    };
    otherOptionsFilterArray.push(productTypeFilter);
  }

  if (customerId !== undefined && customerId !== '') {
    const customerFilter = {
      customerId: { $eq: customerId }
    };
    otherOptionsFilterArray.push(customerFilter);
  }

  if (
    level2 !== undefined &&
    level2 !== '' &&
    level3 !== undefined &&
    level3 !== ''
  ) {
    const categoryLevel2Filter = {
      categoryLevel2: { $eq: level2 }
    };
    categoryFilterArray.push(categoryLevel2Filter);
  }

  if (level3 !== undefined && level3 !== '') {
    const categoryLevel3Filter = {
      categoryLevel3: { $eq: level3 }
    };
    categoryFilterArray.push(categoryLevel3Filter);
  }

  let filterArray = {};

  if (otherOptionsFilterArray.length > 0) {
    filterArray = [
      { businessId: { $eq: businessData.businessId } },
      { txnDate: { $gte: fromDate } },
      { txnDate: { $lte: toDate } },
      { $or: txnFilterArray },
      {
        $and: otherOptionsFilterArray
      }
    ];
  } else {
    filterArray = [
      { businessId: { $eq: businessData.businessId } },
      { txnDate: { $gte: fromDate } },
      { txnDate: { $lte: toDate } },
      { $or: txnFilterArray }
    ];
  }

  if (categoryFilterArray.length > 0) {
    categoryFilterArray.forEach(function (element) {
      filterArray.push(element);
    });
  }

  await db.producttxn
    .find({
      selector: {
        $and: filterArray
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getDiscountTxnForPurchases = async (
  db,
  fromDate,
  toDate,
  productId,
  vendorId,
  level2,
  level3,
  txnFilterArray
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  let otherOptionsFilterArray = [];
  let categoryFilterArray = [];

  if (productId !== undefined && productId !== '') {
    const productTypeFilter = {
      productId: { $eq: productId }
    };
    otherOptionsFilterArray.push(productTypeFilter);
  }

  if (vendorId !== undefined && vendorId !== '') {
    const vendorFilter = {
      vendorId: { $eq: vendorId }
    };
    otherOptionsFilterArray.push(vendorFilter);
  }

  if (
    level2 !== undefined &&
    level2 !== '' &&
    level3 !== undefined &&
    level3 !== ''
  ) {
    const categoryLevel2Filter = {
      categoryLevel2: { $eq: level2 }
    };
    categoryFilterArray.push(categoryLevel2Filter);
  }

  if (level3 !== undefined && level3 !== '') {
    const categoryLevel3Filter = {
      categoryLevel3: { $eq: level3 }
    };
    categoryFilterArray.push(categoryLevel3Filter);
  }

  let filterArray = {};

  if (otherOptionsFilterArray.length > 0) {
    filterArray = [
      { businessId: { $eq: businessData.businessId } },
      { txnDate: { $gte: fromDate } },
      { txnDate: { $lte: toDate } },
      { $or: txnFilterArray },
      {
        $and: otherOptionsFilterArray
      }
    ];
  } else {
    filterArray = [
      { businessId: { $eq: businessData.businessId } },
      { txnDate: { $gte: fromDate } },
      { txnDate: { $lte: toDate } },
      { $or: txnFilterArray }
    ];
  }

  if (categoryFilterArray.length > 0) {
    categoryFilterArray.forEach(function (element) {
      filterArray.push(element);
    });
  }

  await db.producttxn
    .find({
      selector: {
        $and: filterArray
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getSaleTxnByCategoryAndModelNo = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate,
  txnFilterArray,
  modelNoSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  var regexp = new RegExp('^.*' + modelNoSelected + '.*$', 'i');

  if (modelNoSelected) {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { categoryLevel2: { $eq: categoryLevel2 } },
            { categoryLevel3: { $eq: categoryLevel3 } },
            {
              $or: txnFilterArray
            },
            { modelNo: { $regex: regexp } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
      });
  } else {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { categoryLevel2: { $eq: categoryLevel2 } },
            { categoryLevel3: { $eq: categoryLevel3 } },
            {
              $or: txnFilterArray
            },
            { modelNo: { $ne: '' } },
            { modelNo: { $ne: null } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
      });
  }
  return results;
};

export const getSalesTxnByModelNo = async (
  db,
  fromDate,
  toDate,
  txnFilterArray,
  modelNoSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  var regexp = new RegExp('^.*' + modelNoSelected + '.*$', 'i');

  if (modelNoSelected) {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: txnFilterArray
            },
            { modelNo: { $regex: regexp } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No customer is available
          return;
        }

        results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
      });
  }

  return results;
};

export const getSalesTxnByAllModelNo = async (
  db,
  fromDate,
  toDate,
  txnFilterArray
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: txnFilterArray
          },
          { modelNo: { $ne: '' } },
          { modelNo: { $ne: null } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getPurchasesTxnByCategoryAndModelNo = async (
  db,
  categoryLevel2,
  categoryLevel3,
  fromDate,
  toDate,
  txnFilterArray,
  modelNoSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  var regexp = new RegExp('^.*' + modelNoSelected + '.*$', 'i');

  if (modelNoSelected) {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { categoryLevel2: { $eq: categoryLevel2 } },
            { categoryLevel3: { $eq: categoryLevel3 } },
            {
              $or: txnFilterArray
            },
            { modelNo: { $regex: regexp } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        results = await getPurchasesMergedData(
          data,
          'Sales',
          'Purchases',
          'KOT'
        );
      });
  } else {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { categoryLevel2: { $eq: categoryLevel2 } },
            { categoryLevel3: { $eq: categoryLevel3 } },
            {
              $or: txnFilterArray
            },
            { modelNo: { $ne: '' } },
            { modelNo: { $ne: null } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        results = await getPurchasesMergedData(
          data,
          'Sales',
          'Purchases',
          'KOT'
        );
      });
  }
  return results;
};

export const getPurchasesTxnByModelNo = async (
  db,
  fromDate,
  toDate,
  txnFilterArray,
  modelNoSelected
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  var regexp = new RegExp('^.*' + modelNoSelected + '.*$', 'i');

  if (modelNoSelected) {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: txnFilterArray
            },
            { modelNo: { $regex: regexp } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No customer is available
          return;
        }

        results = await getPurchasesMergedData(
          data,
          'Sales',
          'Purchases',
          'KOT'
        );
      });
  }

  return results;
};

export const getPurchasesTxnByAllModelNo = async (
  db,
  fromDate,
  toDate,
  txnFilterArray
) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: txnFilterArray
          },
          { modelNo: { $ne: '' } },
          { modelNo: { $ne: null } },
          { txnDate: { $gte: fromDate } },
          { txnDate: { $lte: toDate } }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = await getMergedData(data, 'Sales', 'Purchases', 'KOT');
    });

  return results;
};

export const getTxnByProduct = async (db, productId) => {
  let results = [];
  const businessData = await Bd.getBusinessData();

  await db.producttxn
    .find({
      selector: {
        $and: [
          { productId: { $eq: productId } },
          { businessId: { $eq: businessData.businessId } },
          {
            $or: [
              { txnType: { $eq: 'Sales' } },
              { txnType: { $eq: 'KOT' } },
              { txnType: { $eq: 'Manufacture' } },
              { txnType: { $eq: 'Sales Return' } },
              { txnType: { $eq: 'Raw Material' } },
              { txnType: { $eq: 'Purchases' } },
              { txnType: { $eq: 'Purchases Return' } },
              { txnType: { $eq: 'Add Stock' } },
              { txnType: { $eq: 'Remove Stock' } },
              { txnType: { $eq: 'Damage Stock' } },
              { txnType: { $eq: 'Opening Stock' } }
            ]
          }
        ]
      }
    })
    .exec()
    .then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      results = data.map((item) => item.toJSON());
    });

  return results;
};

export const getAddOnProductTxnListByDateAndProduct = async (
  db,
  fromDate,
  toDate,
  productId
) => {
  let results = [];

  const businessData = await Bd.getBusinessData();

  if (productId) {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { productId: { $eq: productId } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } },
            { txnType: { $eq: 'Add On' } },
            { updatedAt: { $exists: true } }
          ],
          sort: [{ txnDate: 'desc' }]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }

        results = data.map((item) => item.toJSON());
      });
  } else {
    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } },
            { txnType: { $eq: 'Add On' } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }

        results = data.map((item) => item.toJSON());
      });
  }

  return results;
};

export const getTxnBySerialNo = async (
  db,
  fromDate,
  toDate,
  txnType,
  serialNo
) => {
  const results = [];
  const businessData = await Bd.getBusinessData();
  const businessId = businessData.businessId;

  const query = {
    selector: {
      businessId: { $eq: businessId },
      txnType: { $eq: txnType },
      txnDate: { $gte: fromDate, $lte: toDate }
    }
  };

  try {
    const data = await db.producttxn.find(query).exec();
    if (data && data.length > 0) {
      let newData = data.map((item) => item.toJSON());
      for (let serialData of newData) {
        if (serialData.serialNo && serialData.serialNo.length > 0) {
          for (let serial of serialData.serialNo) {
            if (serial.includes(serialNo) && !results.includes(serialData))
              results.push(serialData);
          }
        } else if (
          serialData.serialOrImeiNo &&
          serialData.serialOrImeiNo !== '' &&
          serialData.serialOrImeiNo !== null &&
          serialData.serialOrImeiNo.includes(serialNo)
        ) {
          results.push(serialData);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching transaction data:', error);
  }

  return results;
};

export const getTxnByAllSerialNo = async (db, fromDate, toDate, txnType) => {
  const results = [];
  const businessData = await Bd.getBusinessData();
  const businessId = businessData.businessId;

  const query = {
    selector: {
      businessId: { $eq: businessId },
      txnType: { $eq: txnType },
      txnDate: { $gte: fromDate, $lte: toDate }
    }
  };

  try {
    const data = await db.producttxn.find(query).exec();
    if (data && data.length > 0) {
      let newData = data.map((item) => item.toJSON());
      for (let serialData of newData) {
        if (serialData.serialNo && serialData.serialNo.length > 0) {
          results.push(serialData);
        } else if (
          serialData.serialOrImeiNo &&
          serialData.serialOrImeiNo !== '' &&
          serialData.serialOrImeiNo !== null
        ) {
          results.push(serialData);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching transaction data:', error);
  }

  return results;
};