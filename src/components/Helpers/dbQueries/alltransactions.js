import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';

import {
  getFinancialYearStartDateByGivenDate,
  getOneDayBeforeGivenDate
} from '../DateHelper';

const baseSelector = async (id) => {
  const businessData = await Bd.getBusinessData();
  const selector = {
    $and: [
      { businessId: { $eq: businessData.businessId } },
      {
        date: { $exists: true }
      },
      {
        updatedAt: { $exists: true }
      }
    ]
  };

  if (id) {
    selector.$and.push({
      $or: [
        {
          customerId: { $eq: id }
        },
        {
          vendorId: { $eq: id }
        }
      ]
    });
  }

  return selector;
};

const basePaymentSelector = async () => {
  const businessData = await Bd.getBusinessData();
  const selector = {
    $and: [
      { businessId: { $eq: businessData.businessId } },
      {
        date: { $exists: true }
      },
      {
        updatedAt: { $exists: true }
      },
      {
        isCredit: { $eq: false }
      }
    ]
  };

  return selector;
};

const fetchData = async (selector, sort = [{ date: 'desc' }]) => {
  const db = await Db.get();
  const data = await db.alltransactions
    .find({
      selector,
      sort
    })
    .exec();

  if (!data) {
    // No customer/vendor txn data is available
    return;
  }

  return data.map((item) => item.toJSON());
};

export const getAllTransactionListByPartyId = async (id) => {
  const selector = await baseSelector(id);
  return fetchData(selector);
};

export const getAllTransactionListByDateRange = async (fromDate, toDate) => {
  let selector = await basePaymentSelector();
  if (fromDate) selector.$and.push({ date: { $gte: fromDate } });
  if (toDate) selector.$and.push({ date: { $lte: toDate } });
  return fetchData(selector);
};

const getValidLedgerTxnTypes = () => {
  return [
    'Payment Out',
    'Sales Return',
    'Purchases',
    'Expenses',
    'Payment In',
    'Sales',
    'Purchases Return',
    'Opening Receivable Balance',
    'Opening Payable Balance',
    'KOT'
  ];
};

export const getAllTransactionListByPartyIdAndDateRange = async (
  id,
  fromDate,
  toDate
) => {
  if (fromDate === null || toDate === null) {
    return getAllTransactionListByPartyId(id);
  }

  const selector = await baseSelector(id);
  selector.$and.push({ date: { $gte: fromDate } });
  selector.$and.push({ date: { $lte: toDate } });

  return fetchData(selector);
};

const getLedgerTransactionListByPartyIdAndDateRange = async (
  id,
  fromDate,
  toDate,
  includeBalance
) => {
  if (!fromDate || !toDate) {
    return getAllTransactionListByPartyId(id);
  }

  const openingBalanceData = await getOpeningBalanceByPartyIdAndDateRange(
    id,
    fromDate
  );

  const openingBalanceTxn = {
    date: fromDate,
    customerName: 'Opening Balance',
    sequenceNumber: '',
    debit: openingBalanceData.totalDebit || 0,
    credit: openingBalanceData.totalCredit || 0,
    runningBalance: openingBalanceData.runningBalance || 0
  };

  const selector = await baseSelector(id);
  selector.$and.push({ date: { $gte: fromDate } });
  selector.$and.push({ date: { $lte: toDate } });
  if (includeBalance) {
    selector.$and.push({ balance: { $gt: 0 } });
  }

  let transactions = await fetchData(selector, [{ date: 'asc' }]);

  const validTxnTypes = getValidLedgerTxnTypes();

  transactions = transactions.filter((transaction) =>
    validTxnTypes.includes(transaction.txnType)
  );

  let runningBalance = openingBalanceData.runningBalance;
  transactions = await prepareTranasctionDataUsingAllTxnData(
    transactions,
    runningBalance
  );

  transactions.unshift(openingBalanceTxn);

  return transactions;
};

export const getAllOutStandingTransactionListByPartyIdAndDateRange = async (
  id,
  fromDate,
  toDate
) => {
  return getLedgerTransactionListByPartyIdAndDateRange(
    id,
    fromDate,
    toDate,
    true
  );
};

export const getAllLedgerTransactionListByPartyIdAndDateRangeAndHavingBalance =
  async (id, fromDate, toDate) => {
    return getLedgerTransactionListByPartyIdAndDateRange(
      id,
      fromDate,
      toDate,
      false
    );
  };

export const getAllLedgerTransactionListByPartyIdAndDateRange = async (
  id,
  fromDate,
  toDate
) => {
  if (!fromDate || !toDate) {
    return getAllTransactionListByPartyId(id);
  }

  const openingBalanceData = await getOpeningBalanceByPartyIdAndDateRange(
    id,
    fromDate
  );

  const openingBalanceTxn = {
    date: fromDate,
    customerName: 'Opening Balance',
    sequenceNumber: '',
    debit: openingBalanceData.totalDebit || 0,
    credit: openingBalanceData.totalCredit || 0,
    runningBalance: openingBalanceData.runningBalance || 0
  };

  const selector = await baseSelector(id);
  selector.$and.push({ date: { $gte: fromDate } });
  selector.$and.push({ date: { $lte: toDate } });

  let transactions = await fetchData(selector, [{ date: 'asc' }]);

  const validTxnTypes = getValidLedgerTxnTypes();

  transactions = transactions.filter((transaction) =>
    validTxnTypes.includes(transaction.txnType)
  );

  let runningBalance = openingBalanceData.runningBalance;

  //we have to map the data and add additional txn based on receipts and payments for cash and bank txn in case of paid txn
  transactions = await prepareTranasctionDataUsingAllTxnData(
    transactions,
    runningBalance
  );

  transactions.unshift(openingBalanceTxn);

  return transactions;
};

const prepareTranasctionDataUsingAllTxnData = async (
  transactions,
  runningBalance
) => {
  let runningBalanceList = transactions.flatMap((transaction) => {
    let { amount, txnType, date, sequenceNumber } = transaction;
    let debit = 0;
    let credit = 0;
    let transactionsToReturn = [];
    let voucherType = txnType;

    if (
      ['Sales', 'Purchases Return', 'KOT', 'Opening Payable Balance'].includes(
        txnType
      )
    ) {
      debit = parseFloat(amount) || 0;
    } else if (
      [
        'Sales Return',
        'Purchases',
        'Expenses',
        'Opening Receivable Balance'
      ].includes(txnType)
    ) {
      credit = parseFloat(amount) || 0;
    }

    runningBalance += parseFloat(credit) - parseFloat(debit);

    //no need to include since we are already using in the receiptOrPayment sections
    if (!['Payment Out', 'Payment In'].includes(txnType)) {
      transactionsToReturn.push({
        date,
        debit,
        credit,
        txnType,
        sequenceNumber,
        runningBalance,
        voucherType,
        customerName: transaction.customerName || transaction.vendorName
      });
    }

    if (
      transaction.receiptOrPayment &&
      transaction.receiptOrPayment.length > 0
    ) {
      transaction.receiptOrPayment
        .filter((receiptOrPayment) => !receiptOrPayment.cancelled)
        .forEach((receiptOrPayment) => {
          let { sequenceNumber, paymentType, bankName, amount, paymentMode } =
            receiptOrPayment;

          let receiptCredit = 0;
          let receiptDebit = 0;

          let particular;
          if ('cash' === paymentType) {
            particular = 'Cash';
          } else if ('bank' === paymentType) {
            particular = bankName + ' ( ' + paymentMode + ' )';
          } else {
            particular = paymentType;
          }

          if (['Sales', 'Purchases Return', 'Payment In'].includes(txnType)) {
            receiptCredit = parseFloat(amount) || 0;
            voucherType = 'Receipt';
          } else if (
            ['Sales Return', 'Purchases', 'Payment Out'].includes(txnType)
          ) {
            receiptDebit = parseFloat(amount) || 0;
            voucherType = 'Payment';
          }

          runningBalance +=
            parseFloat(receiptCredit) - parseFloat(receiptDebit);

          //create a new txn for the payment or receipt and add to the transactions
          let newTxn = {
            date: date,
            credit: receiptCredit,
            debit: receiptDebit,
            sequenceNumber: sequenceNumber,
            runningBalance: runningBalance,
            voucherType: voucherType,
            customerName: particular
          };
          transactionsToReturn.push(newTxn);
        });
    }

    return transactionsToReturn;
  });
  return runningBalanceList;
};

export const getAllLedgerTransactionListDateRangeAndHavingBalance = async (
  fromDate,
  toDate,
  searchValue,
  ledgerType
) => {
  const selector = await baseSelector();
  selector.$and.push({ date: { $gte: fromDate } });
  selector.$and.push({ date: { $lte: toDate } });
  selector.$and.push({ balance: { $gt: 0 } });

  let orConditions;
  if (searchValue) {
    var regexp = new RegExp('^.*' + searchValue + '.*$', 'i');

    orConditions = [
      // { txnType: { $regex: regexp } },
      { customerName: { $regex: regexp } },
      { vendorName: { $regex: regexp } }
      // { sequenceNumber: { $regex: regexp } }
    ];

    if (!isNaN(searchValue)) {
      orConditions.push({ amount: { $eq: parseFloat(searchValue) } });
    }

    selector.$and.push({ $or: orConditions });
  }

  let transactions = await fetchData(selector, [{ date: 'asc' }]);

  if (transactions && transactions.length > 0) {
    const openingBalanceData = await getOpeningBalancesByDateRange(
      fromDate,
      orConditions
    );

    const validTxnTypes = getValidLedgerTxnTypes();

    transactions = transactions.filter((transaction) =>
      validTxnTypes.includes(transaction.txnType)
    );

    const groupedTransactions = transactions.reduce((acc, transaction) => {
      let { vendorId, customerId, balance, txnType, vendorName, customerName } =
        transaction;
      let debit = 0;
      let credit = 0;
      let id = vendorId || customerId;
      let name = vendorName || customerName;

      if (
        ['Payment Out', 'Sales', 'Purchases Return', 'KOT'].includes(txnType)
      ) {
        debit = balance || 0;
      } else if (
        ['Payment In', 'Sales Return', 'Purchases', 'Expenses'].includes(
          txnType
        )
      ) {
        credit = balance || 0;
      }

      // Find the group for this id
      let group = acc.find((group) => group.id === id);

      // If the group doesn't exist, create it
      if (!group) {
        group = { id, name, debit: 0, credit: 0 };
        acc.push(group);
      }

      // Update the debit, credit for the group
      group.debit += parseFloat(debit);
      group.credit += parseFloat(credit);

      return acc;
    }, []);
    // Start by mapping over openingBalanceData
    // Start by mapping over groupedTransactions
    let result = groupedTransactions.map((group) => {
      // Find the corresponding balance for this id
      const balance = openingBalanceData.find(
        (balance) => balance.id === group.id
      );

      // If the balance exists, use its openingBalance, otherwise use 0
      const openingBalance = balance ? parseFloat(balance.openingBalance) : 0;

      // Parse debit and credit from group
      const debit = parseFloat(group.debit);
      const credit = parseFloat(group.credit);

      // Calculate the closing balance
      const closingBalance = openingBalance + credit - debit;

      // Return a new object with the required fields
      return {
        name: group.name,
        id: group.id,
        debit,
        credit,
        openingBalance,
        closingBalance
      };
    });

    if (!searchValue) {
      // Then, for each balance in openingBalanceData, if it doesn't exist in groupedTransactions, add it to the result
      openingBalanceData.forEach((balance) => {
        if (!result.find((group) => group.id === balance.id)) {
          const debit = balance.totalDebit;
          const credit = balance.totalCredit;
          const openingBalance = parseFloat(balance.openingBalance);
          const closingBalance = openingBalance + credit - debit;

          result.push({
            name: balance.name,
            id: balance.id,
            debit,
            credit,
            openingBalance,
            closingBalance
          });
        }
      });
    }

    // Finally, filter the result based on the ledgerType
    result = result.filter((group) => {
      return (
        (ledgerType === 'payable' && group.closingBalance > 0) ||
        (ledgerType === 'receivable' && group.closingBalance < 0)
      );
    });

    return result;
  }

  return [];
};

export const getOpeningBalanceByPartyIdAndDateRange = async (id, date) => {
  const toDate = getOneDayBeforeGivenDate(date);

  const selector = await baseSelector(id);
  // selector.$and.push({ date: { $gte: fromDate } }); //todo mani, currently we are taking all txn from the begining to calculate opening balance
  selector.$and.push({ date: { $lte: toDate } });
  selector.$and.push({ balance: { $gt: 0 } });

  let transactions = await fetchData(selector, [{ date: 'asc' }]);

  const validTxnTypes = getValidLedgerTxnTypes();

  transactions = transactions.filter((transaction) =>
    validTxnTypes.includes(transaction.txnType)
  );

  let runningBalance = 0;
  let totalCredit = 0;
  let totalDebit = 0;

  transactions.forEach((transaction) => {
    let { balance, txnType } = transaction;
    let debit = 0;
    let credit = 0;

    if (['Payment Out', 'Sales', 'Purchases Return', 'KOT'].includes(txnType)) {
      debit = balance || 0;
    } else if (
      ['Payment In', 'Sales Return', 'Purchases', 'Expenses'].includes(txnType)
    ) {
      credit = balance;
    }

    runningBalance += credit - debit;
    totalCredit += credit;
    totalDebit += debit;
  });

  return { runningBalance, totalCredit, totalDebit };
};

export const getOpeningBalancesByDateRange = async (date, orConditions) => {
  const toDate = getOneDayBeforeGivenDate(date);
  const fromDate = getFinancialYearStartDateByGivenDate(toDate);

  const selector = await baseSelector();
  selector.$and.push({ date: { $lte: toDate } });
  selector.$and.push({ balance: { $gt: 0 } });

  if (orConditions) {
    selector.$and.push({ $or: orConditions });
  }

  let transactions = await fetchData(selector, [{ date: 'asc' }]);

  const validTxnTypes = getValidLedgerTxnTypes();

  transactions = transactions.filter((transaction) =>
    validTxnTypes.includes(transaction.txnType)
  );

  const openingBalancesById = transactions.reduce((acc, transaction) => {
    let { balance, txnType, vendorName, customerName } = transaction;
    let debit = 0;
    let credit = 0;
    let id = transaction.customerId || transaction.vendorId;
    let name = vendorName || customerName;

    if (['Payment Out', 'Sales', 'Purchases Return', 'KOT'].includes(txnType)) {
      debit = balance || 0;
    } else if (
      ['Payment In', 'Sales Return', 'Purchases', 'Expenses'].includes(txnType)
    ) {
      credit = balance;
    }

    // Find the group for this id
    let group = acc.find((group) => group.id === id);

    // If the group doesn't exist, create it
    if (!group) {
      group = { id, openingBalance: 0, totalCredit: 0, totalDebit: 0, name };
      acc.push(group);
    }

    // Update the running balance, total credit, and total debit for the group
    group.openingBalance += credit - debit;
    group.totalCredit = 0;
    group.totalDebit = 0;

    return acc;
  }, []);

  return openingBalancesById;
};

export const searchTransactionListByPartyIdAndValue = async (id, value) => {
  const selector = await baseSelector(id);
  var regexp = new RegExp('^.*' + value + '.*$', 'i');

  selector.$and.push({
    $or: [
      { txnType: { $regex: regexp } },
      { sequenceNumber: { $regex: regexp } },
      { amount: { $eq: parseFloat(value) } },
      { balance: { $eq: parseFloat(value) } }
    ]
  });

  return fetchData(selector);
};

export const searchTransactionListByPartyIdAndValueAndDateRange = async (
  id,
  value,
  fromDate,
  toDate
) => {
  if (fromDate === null || toDate === null) {
    return searchTransactionListByPartyIdAndValue(id, value);
  }

  const selector = await baseSelector(id);
  var regexp = new RegExp('^.*' + value + '.*$', 'i');

  selector.$and.push({
    $or: [
      { txnType: { $regex: regexp } },
      { sequenceNumber: { $regex: regexp } },
      { amount: { $eq: parseFloat(value) } },
      { balance: { $eq: parseFloat(value) } }
    ]
  });
  selector.$and.push({ date: { $gte: fromDate } });
  selector.$and.push({ date: { $lte: toDate } });

  return fetchData(selector);
};

export const getCashBookData = async (filterSelector, fromDate, toDate) => {
  let selector = await basePaymentSelector();
  if (fromDate) selector.$and.push({ date: { $gte: fromDate } });
  if (toDate) selector.$and.push({ date: { $lte: toDate } });
  selector.$and.push(filterSelector);
  let data = await fetchData(selector);
  let cashIn = 0;
  let cashOut = 0;
  let finalData = [];
  if (data) {
    finalData = data.map((item) => {
      let result = item.toJSON();

      let amount = 0;
      if (item.paymentType === 'Split' && item.splitPaymentList && item.splitPaymentList.length > 0) {
        let splitAmount = 0;
        for (let payment of item.splitPaymentList) {
          if (payment.paymentType === 'Cash') {
            splitAmount += parseFloat(payment.amount);
          }
        }
        amount = parseFloat(splitAmount);
      } else {
        amount = parseFloat(item.amount);
      }

      if (
        result['txnType'] === 'Payment In' ||
        result['txnType'] === 'Sales' ||
        result['txnType'] === 'Purchases Return' ||
        result['txnType'] === 'KOT'
      ) {
        if (result.isCredit) {
          if (result['paidOrReceivedAmount']) {
            cashIn = cashIn + parseFloat(result['paidOrReceivedAmount']);
          }
        } else {
          if (amount) {
            cashIn = cashIn + parseFloat(amount);
          }
        }
      } else {
        if (result.isCredit) {
          if (result['paidOrReceivedAmount']) {
            cashOut = cashOut + parseFloat(result['paidOrReceivedAmount']);
          }
        } else {
          if (amount) {
            cashOut = cashOut + parseFloat(amount);
          }
        }
      }

      return result;
    });
  }

  return {
    cashIn: cashIn,
    cashOut: cashOut,
    txnData: finalData
  };
};

export const getOpeningCash = async (filterSelector, fromDate) => {
  const toDate = getOneDayBeforeGivenDate(fromDate);

  let selector = await basePaymentSelector();
  if (toDate) selector.$and.push({ date: { $lte: toDate } });
  selector.$and.push(filterSelector);
  let data = await fetchData(selector);

  let cashIn = 0;
  let cashOut = 0;
  if (data) {
    data.map((item) => {
      let result = item.toJSON();

      let amount = 0;
      if (item.splitPaymentList && item.splitPaymentList.length > 0) {
        let splitAmount = 0;
        for (let payment of item.splitPaymentList) {
          if (payment.paymentType === 'Cash') {
            splitAmount += parseFloat(payment.amount);
          }
        }
        amount = parseFloat(splitAmount);
      } else {
        amount = parseFloat(item.amount);
      }

      if (
        result['txnType'] === 'Payment In' ||
        result['txnType'] === 'Sales' ||
        result['txnType'] === 'Purchases Return' ||
        result['txnType'] === 'KOT'
      ) {
        if (result.isCredit) {
          if (result['paidOrReceivedAmount']) {
            cashIn = cashIn + parseFloat(result['paidOrReceivedAmount']);
          }
        } else {
          if (amount) {
            cashIn = cashIn + parseFloat(amount);
          }
        }
      } else {
        if (result.isCredit) {
          if (result['paidOrReceivedAmount']) {
            cashOut = cashOut + parseFloat(result['paidOrReceivedAmount']);
          }
        } else {
          if (amount) {
            cashOut = cashOut + parseFloat(amount);
          }
        }
      }

      return result;
    });
  }

  return parseFloat(cashIn - cashOut);
};

export const getBankBookData = async (
  filterSelector,
  bankAccount,
  fromDate,
  toDate
) => {
  let upiTotal = 0;
  let neftTotal = 0;
  let cardTotal = 0;
  let chequeTotal = 0;
  let totalIn = 0;
  let totalOut = 0;
  let transactionList = [];

  let selector = await basePaymentSelector();
  if (fromDate) selector.$and.push({ date: { $gte: fromDate } });
  if (toDate) selector.$and.push({ date: { $lte: toDate } });
  selector.$and.push(filterSelector);

  transactionList = await fetchData(selector);

  if (transactionList) {
    transactionList.forEach((result) => {
      result['upi'] = 0;
      result['netBanking'] = 0;
      result['cheque'] = 0;
      result['card'] = 0;

      let amount = 0;
      if (result.paymentType === 'Split' && result.splitPaymentList && result.splitPaymentList.length > 0) {
        let splitAmount = 0;
        for (let payment of result.splitPaymentList) {
          if (
            bankAccount.id !== '' &&
            payment.bankAccountId !== '' &&
            payment.bankAccountId === bankAccount.id
          ) {
            splitAmount += parseFloat(payment.amount);

            if (payment.paymentMode === 'UPI') {
              result['upi'] += parseFloat(payment.amount);
            } else if (payment.paymentMode === 'Internet Banking') {
              result['netBanking'] += parseFloat(payment.amount);
            } else if (payment.paymentMode === 'Cheque') {
              result['cheque'] += parseFloat(payment.amount);
            } else if (
              payment.paymentMode === 'Credit Card' ||
              payment.paymentMode === 'Debit Card'
            ) {
              result['card'] += parseFloat(payment.amount);
            }
          }
        }
        amount = parseFloat(splitAmount);
      } else {
        if (
          (result.payment_type && result.payment_type === 'upi') ||
          (result.paymentType && result.paymentType === 'upi')
        ) {
          result['upi'] = parseFloat(result.amount);
        } else if (
          (result.payment_type && result.payment_type === 'internetbanking') ||
          (result.paymentType && result.paymentType === 'internetbanking')
        ) {
          result['netBanking'] = parseFloat(result.amount);
        } else if (
          (result.payment_type && result.payment_type === 'cheque') ||
          (result.paymentType && result.paymentType === 'cheque')
        ) {
          result['cheque'] = parseFloat(result.amount);
        } else if (
          (result.payment_type && result.payment_type === 'creditcard') ||
          (result.paymentType && result.paymentType === 'creditcard') ||
          (result.payment_type && result.payment_type === 'debitcard') ||
          (result.paymentType && result.paymentType === 'debitcard')
        ) {
          result['card'] = parseFloat(result.amount);
        }
        amount = parseFloat(result.amount);
      }

      if (
        result['txnType'] === 'Payment In' ||
        result['txnType'] === 'Sales' ||
        result['txnType'] === 'Purchases Return' ||
        result['txnType'] === 'KOT' ||
        result['txnType'] === 'Opening Balance'
      ) {
        totalIn = totalIn + parseFloat(amount);
      } else {
        totalOut = totalOut + parseFloat(amount);
      }

      upiTotal += parseFloat(result.upi) || 0;
      neftTotal += parseFloat(result.netBanking) || 0;
      cardTotal += parseFloat(result.card) || 0;
      chequeTotal += parseFloat(result.cheque) || 0;
    });
  }

  return {
    upiTotal: upiTotal,
    neftTotal: neftTotal,
    cardTotal: cardTotal,
    chequeTotal: chequeTotal,
    totalIn: totalIn,
    totalOut: totalOut,
    transactionList: transactionList
  };
};

//To call other than bank and cash
export const getPaymentModeTransactionsByDate = async (
  filterSelector,
  paymentType,
  paymentMode,
  fromDate,
  toDate
) => {
  let transactionList = [];
  let totalIn = 0;
  let totalOut = 0;

  let selector = await basePaymentSelector();
  if (fromDate) selector.$and.push({ date: { $gte: fromDate } });
  if (toDate) selector.$and.push({ date: { $lte: toDate } });
  selector.$and.push(filterSelector);

  transactionList = await fetchData(selector);
  if (transactionList) {
    transactionList.forEach((item) => {
      let totalResult = calculateInAndOutPaymentByPayment(item, paymentMode);
      totalIn += totalResult.totalIn;
      totalOut += totalResult.totalOut;
    });
  }

  return {
    cashIn: totalIn,
    cashOut: totalOut,
    txnData: transactionList
  };
};

const calculateInAndOutPaymentByPayment = (item, paymentMode) => {
  let amount = 0;
  let totalIn = 0;
  let totalOut = 0;
  if (item.paymentType === 'Split' && item.splitPaymentList && item.splitPaymentList.length > 0) {
    let splitAmount = 0;
    for (let payment of item.splitPaymentList) {
      if (payment.paymentMode === paymentMode) {
        splitAmount += parseFloat(payment.amount);
      }
    }
    amount = parseFloat(splitAmount);
  } else {
    amount = parseFloat(item.amount);
  }

  if (
    item['txnType'] === 'Payment In' ||
    item['txnType'] === 'Sales' ||
    item['txnType'] === 'Purchases Return' ||
    item['txnType'] === 'KOT' ||
    item['txnType'] === 'Opening Balance'
  ) {
    totalIn = parseFloat(amount);
  } else {
    totalOut = parseFloat(amount);
  }
  return {
    totalIn: totalIn,
    totalOut: totalOut
  };
};

export const getCashFlowData = async (fromDate, toDate) => {
  const businessData = await Bd.getBusinessData();
  const db = await Db.get();
  let data = await db.alltransactions
    .find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                paymentType: {
                  $regex: new RegExp('^.*cash.*$', 'i')
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                splitPaymentList: {
                  $elemMatch: {
                    paymentType: { $eq: 'Cash' },
                    amount: { $gt: 0 }
                  }
                }
              }
            ]
          }
        ]
      },
      sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
    })
    .exec();

  const results = processData(data);
  return results;
};

export const getOpeningCashFlowData = async (toDate) => {
  const businessData = await Bd.getBusinessData();
  const db = await Db.get();

  let data = await db.alltransactions
    .find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                paymentType: {
                  $regex: new RegExp('^.*cash.*$', 'i')
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                splitPaymentList: {
                  $elemMatch: {
                    paymentType: { $eq: 'Cash' },
                    amount: { $gt: 0 }
                  }
                }
              }
            ]
          }
        ]
      },
      sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
    })
    .exec();

  const results = processData(data);
  return results;
};

const processData = async (data) => {
  let results = [];
  await data.map((item) => {
    let finalData = {};
    finalData.transactionType = item.txnType;
    finalData.name = item.customerName ? item.customerName : item.vendorName;
    finalData.paidOrReceivedAmount = item.paidOrReceivedAmount;
    finalData.isCredit = item.isCredit;
    finalData.date = item.date;
    finalData.id = item.id;
    finalData.cashType = item.cashType;

    let amount = 0;
    let paymentType = item.paymentType;
    if (item.paymentType === 'Split' && item.splitPaymentList && item.splitPaymentList.length > 0) {
      let splitAmount = 0;
      for (let payment of item.splitPaymentList) {
        if (payment.paymentType === 'Cash') {
          splitAmount += parseFloat(payment.amount);
          paymentType = 'Cash';
        }
      }
      amount = parseFloat(splitAmount);
    } else {
      amount = parseFloat(item.amount);
    }

    finalData.amount = amount;
    finalData.paymentType = paymentType;

    results.push(finalData);
  });

  return results;
};

export const getCashInHand = async (toDate) => {
  let fullData = await getOpeningCashFlowData(toDate);
  let cashIn = 0;
  let cashOut = 0;

  for (let cashData of fullData) {
    if (
      cashData['transactionType'] === 'Payment In' ||
      cashData['transactionType'] === 'Sales' ||
      cashData['transactionType'] === 'Purchases Return' ||
      cashData['transactionType'] === 'KOT' ||
      cashData['transactionType'] === 'Opening Balance' ||
      cashData['transactionType'] === 'Cash Adjustment'
    ) {
      cashIn += parseFloat(cashData.amount);
    } else if (cashData['transactionType'] === 'Cash Adjustment') {
      if (cashData['cashType'] === 'addCash') {
        cashIn += parseFloat(cashData.amount);
      } else {
        cashOut += parseFloat(cashData.amount);
      }
    } else {
      cashOut += parseFloat(cashData.amount);
    }

    return parseFloat(parseFloat(cashIn) - parseFloat(cashOut));
  }
};