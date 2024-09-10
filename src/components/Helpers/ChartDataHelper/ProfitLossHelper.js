import { getProfitAndLossDataByDateRange } from 'src/components/Helpers/ProfitLossDataHelper';
import { getMonthDates } from 'src/components/Helpers/DateHelper';

export const getMontlyPAndLData = async (date) => {
  const months = await getMonthDates(date);
  let plMap = new Map();

  for (let item of months) {
    plMap.set(item.month, { grossProfit: 0, netProfit: 0 });
  }

  for (let item of months) {
    const dateObj = new Date();
    const monthName = dateObj.toLocaleDateString('en-US', {
      month: 'long'
    });
    const profitLossObject = await getProfitAndLossDataByDateRange(
      item.start,
      item.end
    );
    let grossProfit =
      parseFloat(profitLossObject.totalSaleAmount || 0) -
      parseFloat(profitLossObject.totalSaleReturnAmount || 0) -
      parseFloat(profitLossObject.totalPurchaseAmount || 0) +
      parseFloat(profitLossObject.totalPurchaseReturnAmount || 0) -
      parseFloat(profitLossObject.totalDirectExpensesAmount || 0) -
      parseFloat(profitLossObject.totalMfgAmount || 0) -
      parseFloat(profitLossObject.totalOpeningStockValue || 0) +
      parseFloat(profitLossObject.totalClosingStockValue || 0);

    let netProfit =
      parseFloat(profitLossObject.totalSaleAmount || 0) -
      parseFloat(profitLossObject.totalSaleReturnAmount || 0) -
      parseFloat(profitLossObject.totalPurchaseAmount || 0) +
      parseFloat(profitLossObject.totalPurchaseReturnAmount || 0) -
      parseFloat(profitLossObject.totalDirectExpensesAmount || 0) -
      parseFloat(profitLossObject.totalIndirectExpensesAmount || 0) -
      parseFloat(profitLossObject.totalMfgAmount || 0) -
      parseFloat(profitLossObject.totalOpeningStockValue || 0) +
      parseFloat(profitLossObject.totalClosingStockValue || 0);

    plMap.set(item.month, { grossProfit: grossProfit, netProfit: netProfit });

    if (item.month === monthName) {
      break;
    }
  }

  return plMap;
};

export const getIncomeExpenseData = async (date) => {
  const months = await getMonthDates(date);
  let plMap = new Map();

  for (let item of months) {
    plMap.set(item.month, { grossProfit: 0, netProfit: 0 });
  }

  for (let item of months) {
    const dateObj = new Date();
    const monthName = dateObj.toLocaleDateString('en-US', {
      month: 'long'
    });
    const profitLossObject = await getProfitAndLossDataByDateRange(
      item.start,
      item.end
    );
    let income =
      parseFloat(profitLossObject.totalSaleAmount || 0) -
      parseFloat(profitLossObject.totalSaleReturnAmount || 0) +
      parseFloat(profitLossObject.totalClosingStockValue || 0);

    let expense =
      parseFloat(profitLossObject.totalPurchaseAmount || 0) -
      parseFloat(profitLossObject.totalPurchaseReturnAmount || 0) +
      parseFloat(profitLossObject.totalDirectExpensesAmount || 0) +
      parseFloat(profitLossObject.totalIndirectExpensesAmount || 0) +
      parseFloat(profitLossObject.totalMfgAmount || 0) +
      parseFloat(profitLossObject.totalOpeningStockValue || 0);

    plMap.set(item.month, { income: income, expense: expense });

    if (item.month === monthName) {
      break;
    }
  }

  return plMap;
};