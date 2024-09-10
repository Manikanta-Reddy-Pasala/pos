import { getExpenseCategories } from 'src/components/Helpers/dbQueries/expensecategories';
import { getAllExpensesByDateRange } from 'src/components/Helpers/dbQueries/expenses';
import { getManufactureDirectExpenses } from 'src/components/Helpers/dbQueries/manufacturedirectexpenses';
import { getAllProductTransactions } from 'src/components/Helpers/dbQueries/producttxn';

export const getExpensesDataByCategory = async (startDate, endDate) => {
  let categoryDataList = await getExpenseCategories();
  let expensesData = await getAllExpensesByDateRange(startDate, endDate, [
    'categoryId',
    'total',
    'item_list'
  ]);

  let result = [];
  await expensesData.forEach((item) => {
    const { categoryId, total, item_list } = item;

    const index = result.findIndex((obj) => obj.categoryId === categoryId);

    let total_amount = parseFloat(total || 0);
    let total_tax = 0;

    for (let product of item_list) {
      total_tax =
        parseFloat(total_tax || 0) +
        parseFloat(product.sgst_amount || 0) +
        parseFloat(product.cgst_amount || 0) +
        parseFloat(product.igst_amount || 0);
    }

    const totalAmount =
      parseFloat(total_amount || 0) - parseFloat(total_tax || 0);

    if (index === -1) {
      result.push({ categoryId, totalAmount });
    } else {
      result[index].totalAmount += parseFloat(totalAmount);
    }
  });

  if (result && result.length > 0) {
    categoryDataList.forEach((category) => {
      const { categoryId } = category;

      const matchingResult = result.find(
        (item) => item.categoryId === categoryId
      );

      if (matchingResult) {
        category.amount = matchingResult.totalAmount;
      }
    });
  }

  let expenseList = [];
  const mfgData = await prepareMfgData(startDate, endDate);
  if (categoryDataList) {
    categoryDataList.forEach((item) => {
      expenseList.push({ category: item.category, amount: item.amount });
    });
  }

  if (
    mfgData &&
    mfgData.totalMfgExpensesList &&
    mfgData.totalMfgExpensesList.length > 0
  ) {
    mfgData.totalMfgExpensesList.forEach((item) => {
      expenseList.push({ category: item.label, amount: item.value });
    });
  }

  return expenseList;
};

const prepareMfgData = async (fromDate, toDate) => {
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

  return {
    totalMfgAmount: totalExp,
    totalMfgExpensesList: totalMfgExpensesList
  };
};