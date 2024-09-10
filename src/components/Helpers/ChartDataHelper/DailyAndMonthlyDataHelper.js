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

const getCurrentWeekData = () => {
  const today = new Date();

  // Calculate the start of the week (assuming week starts on Sunday)
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

  const weekMap = new Map();

  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    const formattedDate = currentDay.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
    weekMap.set(formattedDate, 0);
  }

  return weekMap;
};

export const getDataByMonth = async (startDate, endDate, type) => {
  let salesMontlyMap = new Map();
  let dataObj = {
    invoiceCount: 0,
    invoiceValue: 0,
    taxableValue: 0,
    paid: 0,
    unpaid: 0
  };

  let fullData;

  if (type === 'Sales') {
    fullData = await getAllSalesByDateRange(startDate, endDate, [
      'invoice_date',
      'total_amount',
      'item_list'
    ]);
  } else if (type === 'Purchases') {
    fullData = await getAllPurchasesByDateRange(startDate, endDate, [
      'bill_date',
      'total_amount',
      'item_list'
    ]);
  } else if (type === 'Expenses') {
    fullData = await getAllExpensesByDateRange(startDate, endDate, [
      'date',
      'total',
      'item_list'
    ]);
  } else if (type === 'Sales Return') {
    fullData = await getAllSalesReturnByDateRange(startDate, endDate, [
      'invoice_date',
      'total_amount',
      'item_list'
    ]);
  } else if (type === 'Purchases Return') {
    fullData = await getAllPurchasesReturnByDateRange(startDate, endDate, [
      'date',
      'total_amount',
      'item_list'
    ]);
  }

  let monthNames = months.map((reason) => reason.name);
  monthNames.forEach((property) => salesMontlyMap.set(property, dataObj));

  for (let saleData of fullData) {
    let matchingItem = months.find(
      (reason) => reason.val === extractMonth(saleData.invoice_date || saleData.bill_date || saleData.date)
    );
    let oldDataObj = JSON.parse(JSON.stringify(salesMontlyMap.get(matchingItem.name)));
    let dataObj = {
      invoiceCount: oldDataObj.invoiceCount,
      invoiceValue: oldDataObj.invoiceValue,
      paid: oldDataObj.paid,
      unpaid: oldDataObj.unpaid,
      taxableValue: oldDataObj.taxableValue
    };
    dataObj.invoiceCount += 1;
    dataObj.invoiceValue += parseFloat(saleData.total_amount || saleData.total || 0);
    dataObj.paid +=
      parseFloat(saleData.total_amount || saleData.total || 0) - parseFloat(saleData.balance_amount || saleData.balance || 0);
    dataObj.unpaid += parseFloat(saleData.balance_amount || saleData.balance || 0);

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
    salesMontlyMap.set(matchingItem?.name, dataObj);
  }
  return salesMontlyMap;
};

export const getDataByDay = async (type) => {
  let salesDayMap = getCurrentWeekData();

  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));

  const startDate = startOfWeek.toISOString().split('T')[0];
  const endDate = endOfWeek.toISOString().split('T')[0];

  let fullData;
  if (type === 'Sales') {
    fullData = await getAllSalesByDateRange(startDate, endDate, [
      'invoice_date',
      'total_amount',
      'item_list'
    ]);
  } else if (type === 'Purchases') {
    fullData = await getAllPurchasesByDateRange(startDate, endDate, [
      'bill_date',
      'total_amount',
      'item_list'
    ]);
  } else if (type === 'Expenses') {
    fullData = await getAllExpensesByDateRange(startDate, endDate, [
      'date',
      'total',
      'item_list'
    ]);
  } else if (type === 'Sales Return') {
    fullData = await getAllSalesReturnByDateRange(startDate, endDate, [
      'invoice_date',
      'total_amount',
      'item_list'
    ]);
  } else if (type === 'Purchases Return') {
    fullData = await getAllPurchasesReturnByDateRange(startDate, endDate, [
      'date',
      'total_amount',
      'item_list'
    ]);
  }

  for (let sale of fullData) {
    const dateObj = new Date(sale.invoice_date || sale.bill_date || sale.date);
    const formattedDate = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    let total_amount = parseFloat(sale.total_amount || sale.total || 0);
    let total_tax = 0;

    for (let product of sale.item_list) {
      total_tax =
        parseFloat(total_tax || 0) +
        parseFloat(product.sgst_amount || 0) +
        parseFloat(product.cgst_amount || 0) +
        parseFloat(product.igst_amount || 0);
    }

    const totalAmount =
      parseFloat(total_amount || 0) - parseFloat(total_tax || 0);
    let saleData = JSON.parse(JSON.stringify(salesDayMap.get(formattedDate)));
    saleData += totalAmount;
    salesDayMap.set(formattedDate, saleData);
  }

  return salesDayMap;
};