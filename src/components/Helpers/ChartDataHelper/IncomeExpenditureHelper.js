import { getAllSalesByDateRange } from 'src/components/Helpers/dbQueries/sales';
import { getAllPurchasesByDateRange } from 'src/components/Helpers/dbQueries/purchases';
import { getAllExpensesByDateRange } from 'src/components/Helpers/dbQueries/expenses';
import { getAllSalesReturnByDateRange } from 'src/components/Helpers/dbQueries/salesreturn';
import { getAllPurchasesReturnByDateRange } from 'src/components/Helpers/dbQueries/purchasesreturn';

const months = [
  { val: '04', name: 'APR' },
  { val: '05', name: 'MAY' },
  { val: '06', name: 'JUN' },
  { val: '07', name: 'JULY' },
  { val: '08', name: 'AUG' },
  { val: '09', name: 'SEP' },
  { val: '10', name: 'OCT' },
  { val: '11', name: 'NOV' },
  { val: '12', name: 'DEC' },
  { val: '01', name: 'JAN' },
  { val: '02', name: 'FEB' },
  { val: '03', name: 'MAR' }
];

const extractMonth = (inputDate) => {
  const parts = inputDate.split('-');
  return parts[1];
};

export const getDataByMonth = async (startDate, endDate) => {
  let finalMap = new Map();
  let dataObj = {
    income: 0,
    expense: 0
  };

  const fullSaleData = await getAllSalesByDateRange(startDate, endDate, [
    'invoice_date',
    'total_amount',
    'item_list'
  ]);

  const fullPurchaseData = await getAllPurchasesByDateRange(
    startDate,
    endDate,
    ['bill_date', 'total_amount', 'item_list']
  );

  const fullExpenseData = await getAllExpensesByDateRange(startDate, endDate, [
    'date',
    'total',
    'item_list'
  ]);

  const fullSaleReturnData = await getAllSalesReturnByDateRange(startDate, endDate, [
    'invoice_date',
    'total_amount',
    'item_list'
  ]);

  const fullPurchaseReturnData = await getAllPurchasesReturnByDateRange(startDate, endDate, [
    'date',
    'total_amount',
    'item_list'
  ]);

  let monthNames = months.map((reason) => reason.name);
  monthNames.forEach((property) => finalMap.set(property, dataObj));

  finalMap = await processData(finalMap, fullSaleData, dataObj, 'Income');
  finalMap = await processData(finalMap, fullPurchaseData, dataObj, 'Expense');
  finalMap = await processData(finalMap, fullExpenseData, dataObj, 'Expense');
  finalMap = await processData(finalMap, fullSaleReturnData, dataObj, 'Income - Sales Return');
  finalMap = await processData(finalMap, fullPurchaseReturnData, dataObj, 'Expense - Purchase Return');
  
  return finalMap;
};

const processData = (finalMap, fullData, dataObj, type) => {

  for (let saleData of fullData) {
    let matchingItem = months.find(
      (reason) =>
        reason.val ===
        extractMonth(
          saleData.invoice_date || saleData.bill_date || saleData.date
        )
    );
    let oldDataObj = JSON.parse(JSON.stringify(finalMap.get(matchingItem?.name)));
    let dataObj = {
      expense: oldDataObj.expense,
      income: oldDataObj.income
    };

    let total_amount = parseFloat(saleData.total_amount || saleData.total || 0);
    let total_tax = 0;

    for (let product of saleData.item_list) {
      total_tax =
        parseFloat(total_tax || 0) +
        parseFloat(product.sgst_amount || 0) +
        parseFloat(product.cgst_amount || 0) +
        parseFloat(product.igst_amount || 0);
    }

    if (type === 'Income') {
      dataObj.income +=
        parseFloat(total_amount || 0) - parseFloat(total_tax || 0);
    } else if (type === 'Income - Sales Return') {
      dataObj.income -=
        parseFloat(total_amount || 0) - parseFloat(total_tax || 0);
    } else if(type === 'Expense') {
      dataObj.expense +=
        parseFloat(total_amount || 0) - parseFloat(total_tax || 0);
    } else if(type === 'Expense - Purchase Return') {
      dataObj.expense -=
        parseFloat(total_amount || 0) - parseFloat(total_tax || 0);
    }

    finalMap.set(matchingItem?.name, dataObj);
  }

  return finalMap;
};