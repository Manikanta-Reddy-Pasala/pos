import { getAllSalesByDateRange } from 'src/components/Helpers/dbQueries/sales';
import { getAllSalesReturnByDateRange } from 'src/components/Helpers/dbQueries/salesreturn';
import { getStockDataForAllProducts } from 'src/components/Helpers/StockDataHelper';
import { getAllPurchasesByDateRange } from 'src/components/Helpers/dbQueries/purchases';
import { getAllPurchasesReturnByDateRange } from 'src/components/Helpers/dbQueries/purchasesreturn';
import { getAllExpensesByDateRangeAndType } from 'src/components/Helpers/dbQueries/expenses';
import { getManufactureDirectExpenses } from 'src/components/Helpers/dbQueries/manufacturedirectexpenses';
import { getAllProductTransactions } from 'src/components/Helpers/dbQueries/producttxn';

export const getProfitAndLossDataByDateRange = async (fromDate, toDate) => {
  let profitLossObject = {
    totalSaleAmount: 0,
    totalSaleReturnAmount: 0,
    totalOpeningStockValue: 0,
    totalClosingStockValue: 0,
    totalPurchaseAmount: 0,
    totalPurchaseReturnAmount: 0,
    totalDirectExpensesAmount: 0,
    totalIndirectExpensesAmount: 0,
    totalMfgAmount: 0,
    directExpenses: [],
    indirectExpenses: [],
    mfgExpenses: []
  };

  await Promise.all([
    getSales(profitLossObject, fromDate, toDate),
    getSalesReturn(profitLossObject, fromDate, toDate),
    getPurchases(profitLossObject, fromDate, toDate),
    getPurchasesReturn(profitLossObject, fromDate, toDate),
    getDirectExpenses(profitLossObject, fromDate, toDate),
    getInDirectExpenses(profitLossObject, fromDate, toDate),
    prepareMfgData(profitLossObject, fromDate, toDate),
    getStock(profitLossObject, fromDate, toDate)
  ]).then(() => {
    //nothing to do here
  });

  return profitLossObject;
};

const getSales = async (profitLossObject, fromDate, toDate) => {
  let data = await getAllSalesByDateRange(fromDate, toDate);
  profitLossObject.totalSaleAmount = processData(data);
};

const getSalesReturn = async (profitLossObject, fromDate, toDate) => {
  let data = await getAllSalesReturnByDateRange(fromDate, toDate);
  profitLossObject.totalSaleReturnAmount = processData(data);
};

const getPurchases = async (profitLossObject, fromDate, toDate) => {
  let data = await getAllPurchasesByDateRange(fromDate, toDate);
  profitLossObject.totalPurchaseAmount = processData(data);
};

const getPurchasesReturn = async (profitLossObject, fromDate, toDate) => {
  let data = await getAllPurchasesReturnByDateRange(fromDate, toDate);
  profitLossObject.totalPurchaseReturnAmount = processData(data);
};

const getDirectExpenses = async (profitLossObject, fromDate, toDate) => {
  const directExpenses = await getAllExpensesByDateRangeAndType(
    fromDate,
    toDate,
    'Direct'
  );
  profitLossObject.totalDirectExpensesAmount = processData(directExpenses);
  profitLossObject.directExpenses = directExpenses || [];
};

const getInDirectExpenses = async (profitLossObject, fromDate, toDate) => {
  const indirectExpenses = await getAllExpensesByDateRangeAndType(
    fromDate,
    toDate,
    'Indirect'
  );
  profitLossObject.totalIndirectExpensesAmount = processData(indirectExpenses);
  profitLossObject.indirectExpenses = indirectExpenses || [];
};

const getStock = async (profitLossObject, fromDate, toDate) => {
  const stockData = await getStockDataForAllProducts(fromDate, toDate);
  profitLossObject.totalOpeningStockValue = parseFloat(
    stockData?.footer?.totalOpening?.value || 0
  ).toFixed(2);
  profitLossObject.totalClosingStockValue = parseFloat(
    stockData?.footer?.totalClosing?.value || 0
  ).toFixed(2);
};

const processData = (salesData) => {
  let totalAmount = 0;
  for (let item of salesData) {
    let total_amount = parseFloat(item.total_amount || item.total || 0);
    let total_tax = 0;

    for (let product of item.item_list) {
      total_tax =
        parseFloat(total_tax || 0) +
        parseFloat(product.sgst_amount || 0) +
        parseFloat(product.cgst_amount || 0) +
        parseFloat(product.igst_amount || 0);
    }

    totalAmount += parseFloat(total_amount || 0) - parseFloat(total_tax || 0);
  }
  return parseFloat(totalAmount || 0).toFixed(2);
};

const prepareMfgData = async (profitLossObject, fromDate, toDate) => {
  let mfgExpenseData = new Map();
  let totalMfgExpensesList = [];
  let totalExp = 0;
  const expenseList = await getManufactureDirectExpenses();
  if (expenseList.length > 0) {
    for (let exp of expenseList) {
      mfgExpenseData.set(exp.name, 0);
    }
  }
  const productTransactionsData = await getAllProductTransactions({
    $and: [
      { txnDate: { $gte: fromDate } },
      { txnDate: { $lte: toDate } },
      { txnType: { $eq: 'Manufacture' } }
    ]
  });

  productTransactionsData.map((item) => {
    if (item.mfgDirectExpenses && item.mfgDirectExpenses.length > 0) {
      for (let exp of item.mfgDirectExpenses) {
        let expenseAmount = parseFloat(mfgExpenseData.get(exp.name));
        let totalQty = parseFloat(item.txnQty) + parseFloat(item.freeTxnQty);
        expenseAmount += parseFloat(exp.amount * totalQty);
        mfgExpenseData.set(exp.name, expenseAmount);
      }
    }
  });

  if (expenseList && expenseList.length > 0) {
    for (let exp of expenseList) {
      totalExp += parseFloat(mfgExpenseData.get(exp.name));
      const expObj = {
        label: '',
        value: 0,
        id: ''
      };
      expObj.label = exp.name;
      expObj.id = 'directmanufacture';
      expObj.catId = exp.name;
      expObj.value = parseFloat(mfgExpenseData.get(exp.name));
      totalMfgExpensesList.push(expObj);
    }
  }

  profitLossObject.totalMfgAmount = totalExp;
  profitLossObject.mfgExpenses = totalMfgExpensesList;

  return {
    totalMfgAmount: totalExp,
    totalMfgExpensesList: totalMfgExpensesList
  };
};