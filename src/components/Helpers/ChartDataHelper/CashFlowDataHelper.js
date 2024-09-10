import { getCashFlowData } from 'src/components/Helpers/dbQueries/alltransactions';
import { getOpeningCashFlowData } from 'src/components/Helpers/dbQueries/alltransactions';
import * as dateHelper from 'src/components/Helpers/DateHelper';

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

export const getCashFlow = async (startDate, endDate) => {
  let cashFlowMontlyMap = new Map();
  let cashIn = 0;
  let cashOut = 0;

  let dataObj = {
    netFlow: 0,
    cashIn: 0,
    cashOut: 0,
    cashList: []
  };

  let fullData = await getCashFlowData(startDate, endDate);

  let monthNames = months.map((reason) => reason.name);
  monthNames.forEach((property) => cashFlowMontlyMap.set(property, dataObj));

  for (let cashData of fullData) {
    let cin = 0;
    let cout = 0;
    let matchingItem = months.find(
      (reason) => reason.val === extractMonth(cashData.date)
    );

    if (
      cashData['transactionType'] === 'Payment In' ||
      cashData['transactionType'] === 'Sales' ||
      cashData['transactionType'] === 'Purchases Return' ||
      cashData['transactionType'] === 'KOT' ||
      cashData['transactionType'] === 'Opening Balance'
    ) {
      cashIn += parseFloat(cashData.amount);
      cin = parseFloat(cashData.amount);
    } else if (cashData['transactionType'] === 'Cash Adjustment') {
      if (cashData['cashType'] === 'addCash') {
        cashIn += parseFloat(cashData.amount);
        cin = parseFloat(cashData.amount);
      } else {
        cashOut += parseFloat(cashData.amount);
        cout = parseFloat(cashData.amount);
      }
    } else {
      cashOut += parseFloat(cashData.amount);
      cout = parseFloat(cashData.amount);
    }

    let oldDataObj = JSON.parse(JSON.stringify(cashFlowMontlyMap.get(matchingItem.name)));
    let dataObj = {
      netFlow: oldDataObj.netFlow,
      cashIn: oldDataObj.cashIn,
      cashOut: oldDataObj.cashOut,
      cashList: oldDataObj.cashList
    };
    if (cin > 0) {
      dataObj.netFlow += parseFloat(cin);
    } else {
      dataObj.netFlow -= parseFloat(cout);
    }

    dataObj.cashIn += cin;
    dataObj.cashOut += cout;

    dataObj.cashList.push(cashData);

    cashFlowMontlyMap.set(matchingItem.name, dataObj);
  }

  return {
    cashFlowList: cashFlowMontlyMap,
    cashIn: parseFloat(cashIn).toFixed(2),
    cashOut: parseFloat(cashOut).toFixed(2)
  };
};

export const getOpeningCash = async (startDate) => {
  let cashFlowMontlyMap = new Map();
  let cashIn = 0;
  let cashOut = 0;

  const toDate = dateHelper.getOneDayBeforeGivenDate(startDate);
  let fullData = await getOpeningCashFlowData(toDate);

  let monthNames = months.map((reason) => reason.name);
  monthNames.forEach((property) => cashFlowMontlyMap.set(property, 0));

  for (let cashData of fullData) {
    let cin = 0;
    let cout = 0;
    let matchingItem = months.find(
      (reason) => reason.val === extractMonth(cashData.date)
    );

    if (
      cashData['transactionType'] === 'Payment In' ||
      cashData['transactionType'] === 'Sales' ||
      cashData['transactionType'] === 'Purchases Return' ||
      cashData['transactionType'] === 'KOT' ||
      cashData['transactionType'] === 'Opening Balance' ||
      cashData['transactionType'] === 'Cash Adjustment'
    ) {
      cashIn += parseFloat(cashData.amount);
      cin = parseFloat(cashData.amount);
    } else if (cashData['transactionType'] === 'Cash Adjustment') {
      if (cashData['cashType'] === 'addCash') {
        cashIn += parseFloat(cashData.amount);
        cin = parseFloat(cashData.amount);
      } else {
        cashOut += parseFloat(cashData.amount);
        cout = parseFloat(cashData.amount);
      }
    } else {
      cashOut += parseFloat(cashData.amount);
      cout = parseFloat(cashData.amount);
    }

    let previousAmount = JSON.parse(JSON.stringify(cashFlowMontlyMap.get(matchingItem.name)));
    if (cin > 0) {
      previousAmount += parseFloat(cin);
    } else {
      previousAmount -= parseFloat(cout);
    }

    cashFlowMontlyMap.set(matchingItem?.name, previousAmount);
  }

  return {
    cashFlowList: cashFlowMontlyMap,
    cashIn: parseFloat(cashIn).toFixed(2),
    cashOut: parseFloat(cashOut).toFixed(2),
    cashList: fullData
  };
};