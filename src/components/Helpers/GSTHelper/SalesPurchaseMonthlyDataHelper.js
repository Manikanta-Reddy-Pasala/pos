import { getAllSalesByDateRange } from 'src/components/Helpers/dbQueries/sales';
import { getAllPurchasesByDateRange } from 'src/components/Helpers/dbQueries/purchases';
import { getAllExpensesByDateRange } from 'src/components/Helpers/dbQueries/expenses';
import { getAllSalesReturnByDateRange } from 'src/components/Helpers/dbQueries/salesreturn';
import { getAllPurchasesReturnByDateRange } from 'src/components/Helpers/dbQueries/purchasesreturn';

const months = [
  { val: '04', name: 'APR' },
  { val: '05', name: 'MAY' },
  { val: '06', name: 'JUN' },
  { val: '07', name: 'JUL' },
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

export const getDataByMonth = async (startDate, endDate, typeArray) => {
  //['Sales', 'Purchases']
  let salesMontlyMap = new Map();
  let dataObj = {
    invoiceCount: 0,
    invoiceValue: 0,
    taxableValue: 0,
    paid: 0,
    unpaid: 0
  };

  let fullData;
  let monthNames = months.map((reason) => reason.name);
  monthNames.forEach((property) => salesMontlyMap.set(property, dataObj));

  if (typeArray.includes('Sales')) {
    fullData = await getAllSalesByDateRange(startDate, endDate, [
      'invoice_date',
      'total_amount',
      'item_list'
    ]);
    salesMontlyMap = await processData(salesMontlyMap, fullData);
  }

  if (typeArray.includes('Purchases')) {
    fullData = await getAllPurchasesByDateRange(startDate, endDate, [
      'bill_date',
      'total_amount',
      'item_list'
    ]);
    salesMontlyMap = await processData(salesMontlyMap, fullData);
  }
  if (typeArray.includes('Expenses')) {
    fullData = await getAllExpensesByDateRange(startDate, endDate, [
      'date',
      'total',
      'item_list'
    ]);
    salesMontlyMap = await processData(salesMontlyMap, fullData);
  }
  if (typeArray.includes('Sales Return')) {
    fullData = await getAllSalesReturnByDateRange(startDate, endDate, [
      'invoice_date',
      'total_amount',
      'item_list'
    ]);
    salesMontlyMap = await processReturnData(salesMontlyMap, fullData);
  }
  if (typeArray.includes('Purchases Return')) {
    fullData = await getAllPurchasesReturnByDateRange(startDate, endDate, [
      'date',
      'total_amount',
      'item_list'
    ]);
    salesMontlyMap = await processData(salesMontlyMap, fullData);
  }

  return salesMontlyMap;
};

const processData = (montlyMap, fullData) => {
  for (let saleData of fullData) {
    let matchingItem = months.find(
      (reason) =>
        reason.val ===
        extractMonth(
          saleData.invoice_date || saleData.bill_date || saleData.date
        )
    );
    let oldDataObj = montlyMap.get(matchingItem?.name);
    let dataObj = {
      invoiceCount: oldDataObj.invoiceCount,
      invoiceValue: oldDataObj.invoiceValue,
      paid: oldDataObj.paid,
      unpaid: oldDataObj.unpaid,
      taxableValue: oldDataObj.taxableValue,
      taxAmount: oldDataObj.taxAmount
    };
    dataObj.invoiceCount += 1;
    dataObj.invoiceValue += parseFloat(
      saleData.total_amount || saleData.total || 0
    );
    dataObj.paid +=
      parseFloat(saleData.total_amount || saleData.total || 0) -
      parseFloat(saleData.balance_amount || saleData.balance || 0);
    dataObj.unpaid += parseFloat(
      saleData.balance_amount || saleData.balance || 0
    );

    let total_amount = parseFloat(saleData.total_amount || saleData.total || 0);
    let total_tax = 0;

    for (let product of saleData.item_list) {
      total_tax =
        parseFloat(total_tax || 0) +
        parseFloat(product.sgst_amount || 0) +
        parseFloat(product.cgst_amount || 0) +
        parseFloat(product.igst_amount || 0);
    }

    dataObj.taxableValue +=
      parseFloat(total_amount || 0) - parseFloat(total_tax || 0);
    dataObj.taxAmount += parseFloat(total_tax || 0);
    montlyMap.set(matchingItem?.name, dataObj);
  }
  return montlyMap;
};

const processReturnData = (montlyMap, fullData) => {
  for (let saleData of fullData) {
    let matchingItem = months.find(
      (reason) =>
        reason.val ===
        extractMonth(
          saleData.invoice_date || saleData.bill_date || saleData.date
        )
    );
    let oldDataObj = montlyMap.get(matchingItem?.name);
    let dataObj = {
      invoiceCount: oldDataObj.invoiceCount,
      invoiceValue: oldDataObj.invoiceValue,
      paid: oldDataObj.paid,
      unpaid: oldDataObj.unpaid,
      taxableValue: oldDataObj.taxableValue,
      taxAmount: oldDataObj.taxAmount
    };
    dataObj.invoiceCount += 1;
    dataObj.invoiceValue -= parseFloat(
      saleData.total_amount || saleData.total || 0
    );
    dataObj.paid -=
      parseFloat(saleData.total_amount || saleData.total || 0) -
      parseFloat(saleData.balance_amount || saleData.balance || 0);
    dataObj.unpaid -= parseFloat(
      saleData.balance_amount || saleData.balance || 0
    );

    let total_amount = parseFloat(saleData.total_amount || saleData.total || 0);
    let total_tax = 0;

    for (let product of saleData.item_list) {
      total_tax =
        parseFloat(total_tax || 0) +
        parseFloat(product.sgst_amount || 0) +
        parseFloat(product.cgst_amount || 0) +
        parseFloat(product.igst_amount || 0);
    }

    dataObj.taxableValue -=
      parseFloat(total_amount || 0) - parseFloat(total_tax || 0);
    dataObj.taxAmount -= parseFloat(total_tax || 0);
    montlyMap.set(matchingItem?.name, dataObj);
  }
  return montlyMap;
};