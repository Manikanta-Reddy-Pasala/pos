import { getFinancialYearStartDate, getYesterdayDate } from 'src/components/Helpers/DateHelper';
import { getAllProductTransactions } from 'src/components/Helpers/dbQueries/producttxn';

// Helper function to create selector
const generateFilter = (
  fromDate,
  toDate,
  warehouse,
  productId,
  categoryLevel2,
  categoryLevel3,
  additionalFilter,
  searchTag
) => {
  let selector = { $and: [] };

  if (fromDate !== '' && toDate) {
    selector.$and.push({ txnDate: { $gte: fromDate, $lte: toDate } });
  } else if (fromDate === '' && toDate) {
    selector.$and.push({ txnDate: { $lte: toDate } });
  }

  if (warehouse && warehouse.length > 1)
    selector.$and.push({ warehouseData: { $eq: warehouse } });
  if (productId) selector.$and.push({ productId: { $eq: productId } });
  if (categoryLevel2 && categoryLevel2.length > 3)
    selector.$and.push({ categoryLevel2: { $eq: categoryLevel2 } });
  if (categoryLevel3 && categoryLevel3.length > 3)
    selector.$and.push({ categoryLevel3: { $eq: categoryLevel3 } });

  if (Array.isArray(additionalFilter) && additionalFilter.length > 0) {
    additionalFilter.forEach((filter) => selector.$and.push(filter));
  }

  if (searchTag) {
    const regexp = new RegExp('^.*' + searchTag + '.*$', 'i');
    selector.$and.push({ productName: { $regex: regexp } });
  }

  return selector;
};

// Function to initialize product model with minimal fields
const initializeProductModel = (productId, productName, netWeight = 0) => ({
  productId,
  productName,
  inNetWeight: 0,
  outNetWeight: 0,
  openingNetWeight: 0,
  qtyIn: 0,
  qtyOut: 0,
  totalQty: 0,
  totalAmount: 0,
  openingQty: 0,
  openingAmount: 0,
  txnType: '',
  txnDate: ''
});

// Function to update and calculate totals for the product model
const updateAndCalculateProductModel = (productModel, item, sectionType) => {
  const txnQty = parseFloat(item.txnQty || 0);
  const purchasedPrice =
    parseFloat(item.purchased_price_before_tax || 0) * txnQty -
      parseFloat(item.discount_amount || 0) || 0;
  const salePrice =
    parseFloat(item.mrp_before_tax || 0) * txnQty -
      parseFloat(item.discount_amount || 0) || 0;
  const netWeight = parseFloat(item.netWeight || 0);

  productModel.txnDate = item.txnDate;
  productModel.txnType = item.txnType;

  switch (item.txnType) {
    case 'Sales':
    case 'KOT':
    case 'Raw Material':
    case 'Remove Stock':
    case 'Damage Stock':
      productModel.qtyOut += txnQty;
      productModel.outTotalAmount =
        (productModel.outTotalAmount || 0) + salePrice;
      productModel.outNetWeight =
        parseFloat(productModel.outNetWeight || 0) + netWeight;
      break;
    case 'Sales Return':
      productModel.qtyIn += txnQty;
      productModel.inTotalAmount =
        (productModel.inTotalAmount || 0) + salePrice;
      productModel.inNetWeight =
        parseFloat(productModel.inNetWeight || 0) + netWeight;

      break;
    case 'Purchases':
    case 'Manufacture':
    case 'Add Stock':
      productModel.qtyIn += txnQty;
      productModel.inTotalAmount =
        (productModel.inTotalAmount || 0) + purchasedPrice;
      productModel.inNetWeight =
        parseFloat(productModel.inNetWeight || 0) + netWeight;

      break;
    case 'Opening Stock':
      productModel.openingQty += txnQty;
      productModel.openingTotalAmount =
        (productModel.openingTotalAmount || 0) + purchasedPrice;
      productModel.openingNetWeight =
        parseFloat(productModel.openingNetWeight || 0) + netWeight;

      break;
    case 'Purchases Return':
      productModel.qtyOut += txnQty;
      productModel.outTotalAmount =
        (productModel.outTotalAmount || 0) + purchasedPrice;
      productModel.outNetWeight =
        parseFloat(productModel.outNetWeight || 0) + netWeight;

      break;
    default:
      break;
  }

  return productModel;
};

export const getStockDataForAllProducts = async (
  fromDate,
  toDate,
  warehouse,
  productId,
  categoryLevel2,
  categoryLevel3,
  additionalFilter,
  searchTag
) => {
  const selector = generateFilter(
    fromDate,
    toDate,
    warehouse,
    productId,
    categoryLevel2,
    categoryLevel3,
    additionalFilter,
    searchTag
  );

  const yesterdayDate = getYesterdayDate(fromDate);

  let [txnForSelectedDateRange, openingStockProductData] = await Promise.all([
    getAllProductTransactions(selector),
    getOpeningStockDataForAllProducts(
      '', //to calculate opening stock
      yesterdayDate,
      warehouse,
      productId,
      categoryLevel2,
      categoryLevel3,
      false
    )
  ]);

  const finalResults = new Map();

  openingStockProductData.forEach((item) => {
    const productId = item.productId;
    const productName = item.productName;
    let productModel =
      finalResults.get(productId) ||
      initializeProductModel(productId, productName);

    productModel = updateAndCalculateProductModel(
      productModel,
      item
    );
    finalResults.set(productId, productModel);
  });

  txnForSelectedDateRange.forEach((item) => {
    const productId = item.productId;
    const productName = item.productName;
    const netWeight = parseFloat(item.netWeight || 0);

    let productModel =
      finalResults.get(productId) ||
      initializeProductModel(productId, productName, netWeight);

    productModel = updateAndCalculateProductModel(
      productModel,
      item,
      item.txnType
    );

    finalResults.set(productId, productModel);
  });

  let totalOpening = {
    totalQty: 0,
    value: 0,
    netWeight: 0
  };
  let totalPurchases = {
    totalQty: 0,
    value: 0,
    netWeight: 0
  };
  let totalSales = {
    totalQty: 0,
    value: 0,
    netWeight: 0,
    grossProfit: 0,
    stockConsumed: 0,
    perc: 0
  };
  let totalClosing = {
    totalQty: 0,
    value: 0,
    netWeight: 0
  };

  const results = Array.from(finalResults.values()).map((productModel) => {
    const openingStock = {
      totalQty: productModel.openingQty || 0,
      avgPrice: productModel.openingQty
        ? (productModel.openingTotalAmount / productModel.openingQty).toFixed(2)
        : 0,
      value: productModel.openingQty
        ? parseFloat(productModel.openingTotalAmount || 0).toFixed(2)
        : 0,
      netWeight: parseFloat(productModel.openingNetWeight || 0)
    };

    const purchases = {
      totalQty: productModel.qtyIn || 0,
      avgPrice: productModel.qtyIn
        ? (productModel.inTotalAmount / productModel.qtyIn).toFixed(2)
        : 0,
      value: productModel.inTotalAmount
        ? parseFloat(productModel.inTotalAmount || 0).toFixed(2)
        : 0,
      netWeight: parseFloat(productModel.inNetWeight || 0)
    };

    const sales = {
      totalQty: productModel.qtyOut || 0,
      avgPrice: productModel.qtyOut
        ? (productModel.outTotalAmount / productModel.qtyOut).toFixed(2)
        : 0,
      value: productModel.outTotalAmount
        ? parseFloat(productModel.outTotalAmount || 0).toFixed(2)
        : 0,
      netWeight: parseFloat(productModel.outNetWeight || 0)
    };

    const closingQty =
      openingStock.totalQty + purchases.totalQty - sales.totalQty || 0;
    const avgPrice = (
      ((parseFloat(openingStock.value) || 0) +
        (parseFloat(purchases.value) || 0)) /
        ((parseFloat(openingStock.totalQty) || 0) +
          (parseFloat(purchases.totalQty) || 0)) || 0
    )
      .toFixed(2)
      .toString();
    const closingValue = closingQty * avgPrice || 0;
    const closingNetWeight =
      parseFloat(openingStock.netWeight || 0) +
        parseFloat(purchases.netWeight || 0) -
        parseFloat(sales.netWeight || 0) || 0;

    sales.grossProfit =
      (sales.value
        ? (parseFloat(sales.value) - sales.totalQty * avgPrice).toFixed(2)
        : 0) || 0;
    sales.perc = sales.value
      ? ((sales.grossProfit / sales.value) * 100).toFixed(2)
      : 0;
    sales.stockConsumed = ((sales.totalQty || 0) * avgPrice).toFixed(2);

    totalOpening.totalQty += openingStock.totalQty || 0;
    totalOpening.value += parseFloat(openingStock.value) || 0;
    totalOpening.netWeight += parseFloat(openingStock.netWeight || 0);

    totalPurchases.totalQty += purchases.totalQty || 0;
    totalPurchases.value += parseFloat(purchases.value) || 0;
    totalPurchases.netWeight += parseFloat(purchases.netWeight || 0);

    totalSales.totalQty += sales.totalQty || 0;
    totalSales.value += parseFloat(sales.value) || 0;
    totalSales.netWeight += parseFloat(sales.netWeight || 0);
    totalSales.grossProfit += parseFloat(sales.grossProfit || 0);
    totalSales.stockConsumed += parseFloat(sales.stockConsumed || 0);
    totalSales.perc += parseFloat(sales.perc || 0);

    totalClosing.totalQty += closingQty || 0;
    totalClosing.value += parseFloat(closingValue) || 0;
    totalClosing.netWeight += parseFloat(closingNetWeight || 0);

    return {
      ...productModel,
      openingStock,
      purchases,
      sales,
      closingStock: {
        totalQty: closingQty,
        avgPrice: avgPrice || 0,
        value: closingValue || 0,
        netWeight: closingNetWeight || 0
      }
    };
  });

  const finalFooter = {
    totalOpening: {
      totalQty: totalOpening.totalQty,
      netWeight: totalOpening.netWeight,
      value: totalOpening.value.toFixed(2)
    },
    totalPurchases: {
      totalQty: totalPurchases.totalQty,
      netWeight: totalPurchases.netWeight,
      value: totalPurchases.value.toFixed(2)
    },
    totalSales: {
      totalQty: totalSales.totalQty,
      netWeight: totalSales.netWeight,
      value: totalSales.value.toFixed(2),
      grossProfit: totalSales.grossProfit,
      stockConsumed: totalSales.stockConsumed,
      perc: totalSales.perc
    },
    totalClosing: {
      totalQty: totalClosing.totalQty,
      netWeight: totalClosing.netWeight,
      value: totalClosing.value.toFixed(2)
    }
  };

  return {
    rows: results,
    footer: finalFooter
  };
};

// Function to get opening stock data for all products
export const getOpeningStockDataForAllProducts = async (
  fromDate,
  toDate,
  warehouse,
  productId,
  categoryLevel2,
  categoryLevel3,
  enableCalculateOpeningStock
) => {
  const finalResults = new Map();
  const selector = generateFilter(
    fromDate,
    toDate,
    warehouse,
    productId,
    categoryLevel2,
    categoryLevel3
  );
  const openingBalanceList = await getAllProductTransactions(selector);

  if (enableCalculateOpeningStock) {
    // Initialize and update product models with opening stock transactions
    openingBalanceList.forEach((item) => {
      const productId = item.productId;
      const productName = item.productName;
      let productModel =
        finalResults.get(productId) ||
        initializeProductModel(productId, productName);
      productModel = updateAndCalculateProductModel(
        productModel,
        item,
        'OpeningStock'
      );
      finalResults.set(productId, productModel);
    });
  }

  return openingBalanceList;
};