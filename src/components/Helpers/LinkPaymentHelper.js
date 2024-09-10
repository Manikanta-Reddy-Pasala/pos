import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

import _uniqueId from 'lodash/uniqueId';
import * as allTxnLinkPayment from './AlltransactionsLinkPaymentHelper';
import {
  getTransactionData,
  getLinkedTxnDataQuery,
  updateWithLinkTxnQuery
} from './dbQueries/dynamictable';
import { getTodayDateInYYYYMMDD } from './DateHelper';

var newDate = getTodayDateInYYYYMMDD();

const paymentTypeDetails = {
  Sales: {
    collection: 'sales',
    idField: 'invoice_number',
    balanceField: 'balance_amount',
    customerId: 'customer_id',
    totalAmountField: 'total_amount',
    dateField: 'invoice_date'
  },
  'Payment Out': {
    collection: 'paymentout',
    idField: 'receiptNumber',
    balanceField: 'balance',
    customerId: 'vendorId',
    totalAmountField: 'total',
    dateField: 'date'
  },
  'Purchases Return': {
    collection: 'purchasesreturn',
    idField: 'purchase_return_number',
    balanceField: 'balance_amount',
    customerId: 'vendor_id',
    totalAmountField: 'total_amount',
    dateField: 'date'
  },
  Scheme: {
    collection: 'schememanagement',
    idField: 'id',
    balanceField: 'balance',
    customerId: 'customerId',
    totalAmountField: 'total',
    dateField: 'date'
  },
  'Payment In': {
    collection: 'paymentin',
    idField: 'receiptNumber',
    balanceField: 'balance',
    customerId: 'customerId',
    totalAmountField: 'total',
    dateField: 'date'
  },
  'Sales Return': {
    collection: 'salesreturn',
    idField: 'sales_return_number',
    balanceField: 'balance_amount',
    customerId: 'customer_id',
    totalAmountField: 'total_amount',
    dateField: 'date'
  },
  Purchases: {
    collection: 'purchases',
    idField: 'bill_number',
    balanceField: 'balance_amount',
    customerId: 'vendor_id',
    totalAmountField: 'total_amount',
    dateField: 'bill_date'
  },
  'Opening Receivable Balance': {
    collection: 'alltransactions',
    idField: 'id',
    balanceField: 'balance',
    totalAmountField: 'amount',
    dateField: 'date'
  },
  'Opening Payable Balance': {
    collection: 'alltransactions',
    idField: 'id',
    balanceField: 'balance',
    totalAmountField: 'amount',
    dateField: 'date'
  }
};

export const linkPayment = async (
  db,
  txnDetails, //paymentDetails , saleDetails etc
  paymentLinkTransactions,
  txnType //ex: 'Payment In'
) => {
  let returnLinkTxn = []; // Initialize as an empty array

  //add logs using txnType
  // console.log(`linkPayment txn::${txnType}, data :: ${JSON.stringify(txnDetails)}`);

  //skip all txn with no likedAmount
  for (const linkedTxn of paymentLinkTransactions) {
    if (
      !linkedTxn.linkedAmount ||
      isNaN(linkedTxn.linkedAmount) ||
      parseFloat(linkedTxn.linkedAmount) <= 0
    )
      continue;

    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const timestamp = Math.floor(Date.now() / 1000);
    const id = _uniqueId('lp');
    const transactionNumber = `${id}${appId}${timestamp}`;

    await updateLinkedTxnToDb(
      db,
      linkedTxn,
      txnDetails,
      transactionNumber,
      txnType
    );

    if (parseFloat(linkedTxn.linkedAmount) > 0) {
      returnLinkTxn.push(createLinkedTxn(linkedTxn, transactionNumber)); // Push each result into the array
    }
  }

  return returnLinkTxn.length ? returnLinkTxn : null; // Return null if the array is empty
};

const updateLinkedTxnToDb = async (
  db,
  linkedTxn,
  txnDetails,
  transactionNumber,
  txnType
) => {
  switch (linkedTxn.paymentType) {
    case 'Sales':
      await updateSalesWithLinkTxn(
        db,
        linkedTxn,
        txnDetails,
        transactionNumber,
        txnType
      );
      break;
    case 'Payment Out':
      await updatePaymentOutWithLinkTxn(
        db,
        linkedTxn,
        txnDetails,
        transactionNumber,
        txnType
      );
      break;
    case 'Purchases Return':
      await updatePurchasesReturnWithLinkTxn(
        db,
        linkedTxn,
        txnDetails,
        transactionNumber,
        txnType
      );
      break;
    case 'Payment In':
      await updatePaymentInWithLinkTxn(
        db,
        linkedTxn,
        txnDetails,
        transactionNumber,
        txnType
      );
      break;
    case 'Sales Return':
      await updateSalesReturnWithLinkTxn(
        db,
        linkedTxn,
        txnDetails,
        transactionNumber,
        txnType
      );
      break;
    case 'Purchases':
      await updatePurchasesWithLinkTxn(
        db,
        linkedTxn,
        txnDetails,
        transactionNumber,
        txnType
      );
      break;
    case 'Opening Payable Balance':
      await allTxnLinkPayment.updateLinkPaymentAllTxnTable(db, linkedTxn);
      break;
    case 'Opening Receivable Balance':
      await allTxnLinkPayment.updateLinkPaymentAllTxnTable(db, linkedTxn);
      break;
    case 'Scheme':
      await updateSchemeWithLinkTxn(
        db,
        linkedTxn,
        txnDetails,
        transactionNumber,
        txnType
      );
      break;
    default:
      return;
  }

  if (linkedTxn.paymentType !== 'Opening Receivable Balance') {
    await allTxnLinkPayment.updateLinkPaymentAllTxnTable(db, linkedTxn);
  }
};

const createLinkedTxn = (item, transactionNumber) => ({
  linkedId: item.id,
  date: newDate,
  linkedAmount: item.linkedAmount,
  paymentType: item.paymentType,
  transactionNumber,
  sequenceNumber: item.sequenceNumber
});

const updateWithLinkTxn = async (
  db,
  linkedTxn,
  txnDetails,
  transactionNumber,
  txnType,
  paymentTypeDetails
) => {
  try {
    const collectionName = paymentTypeDetails.collection;
    const uniqueField = paymentTypeDetails.idField;
    const uniqueValue = linkedTxn[uniqueField];
    const balanceField = paymentTypeDetails.balanceField;

    //add logs using txnType
    // console.log(
    //   `updateWithLinkTxn linked data for the table ${collectionName}, data :: ${JSON.stringify(
    //     txnDetails
    //   )}`
    // );

    const data = await updateWithLinkTxnQuery(
      db,
      collectionName,
      uniqueField,
      uniqueValue
    );

    const changeData = await (async (oldData) => {
      if (parseFloat(oldData[balanceField]) > 0) {
        if (oldData[balanceField] > linkedTxn.linkedAmount) {
          oldData[balanceField] =
            parseFloat(oldData[balanceField]) -
            parseFloat(linkedTxn.linkedAmount);
        } else {
          oldData[balanceField] = 0;
        }

        let newLinkedTxn = {
          linkedId: txnDetails[getLinkedIdByTxnType(txnType)],
          date: txnDetails.date,
          linkedAmount: linkedTxn.linkedAmount,
          paymentType: txnType,
          transactionNumber: transactionNumber,
          sequenceNumber: txnDetails.sequenceNumber
        };

        if (typeof oldData.linkedTxnList === 'undefined') {
          oldData.linkedTxnList = [];
        }
        oldData.linked_amount =
          (parseFloat(oldData.linked_amount) || 0) + linkedTxn.linkedAmount;
        oldData.linkedTxnList.push(newLinkedTxn);

        if(Number(oldData.linked_amount) > 0) {
          oldData.linkPayment = true;
        }
      }
      oldData.updatedAt = Date.now();
      return oldData;
    });

    // console.log(
    //   `linked data for the table ${collectionName}, data :: ${JSON.stringify(
    //     txnDetails
    //   )}`
    // );

    if (data) {
      await data.atomicUpdate(changeData);
    }
  } catch (e) {
    console.error(`exception in linkpayment txn::${txnType}`, e);
  }
};

export const getLinkedIdByTxnType = (txnType) => {
  return paymentTypeDetails[txnType].idField;
};

export const updateSalesWithLinkTxn = async (
  db,
  linkedTxn,
  txnDetails,
  transactionNumber,
  txnType
) => {
  await updateWithLinkTxn(
    db,
    linkedTxn,
    txnDetails,
    transactionNumber,
    txnType,
    paymentTypeDetails[linkedTxn.paymentType]
  );
};

export const updatePaymentOutWithLinkTxn = async (
  db,
  linkedTxn,
  txnDetails,
  transactionNumber,
  txnType
) => {
  await updateWithLinkTxn(
    db,
    linkedTxn,
    txnDetails,
    transactionNumber,
    txnType,
    paymentTypeDetails[linkedTxn.paymentType]
  );
};

export const updatePurchasesReturnWithLinkTxn = async (
  db,
  linkedTxn,
  txnDetails,
  transactionNumber,
  txnType
) => {
  await updateWithLinkTxn(
    db,
    linkedTxn,
    txnDetails,
    transactionNumber,
    txnType,
    paymentTypeDetails[linkedTxn.paymentType]
  );
};

export const updatePaymentInWithLinkTxn = async (
  db,
  linkedTxn,
  txnDetails,
  transactionNumber,
  txnType
) => {
  await updateWithLinkTxn(
    db,
    linkedTxn,
    txnDetails,
    transactionNumber,
    txnType,
    paymentTypeDetails[linkedTxn.paymentType]
  );
};

export const updateSalesReturnWithLinkTxn = async (
  db,
  linkedTxn,
  txnDetails,
  transactionNumber,
  txnType
) => {
  await updateWithLinkTxn(
    db,
    linkedTxn,
    txnDetails,
    transactionNumber,
    txnType,
    paymentTypeDetails[linkedTxn.paymentType]
  );
};

export const updatePurchasesWithLinkTxn = async (
  db,
  linkedTxn,
  txnDetails,
  transactionNumber,
  txnType
) => {
  await updateWithLinkTxn(
    db,
    linkedTxn,
    txnDetails,
    transactionNumber,
    txnType,
    paymentTypeDetails[linkedTxn.paymentType]
  );
};

export const updateSchemeWithLinkTxn = async (
  db,
  linkedTxn,
  txnDetails,
  transactionNumber,
  txnType
) => {
  await updateWithLinkTxn(
    db,
    linkedTxn,
    txnDetails,
    transactionNumber,
    txnType,
    paymentTypeDetails[linkedTxn.paymentType]
  );
};

export const unLinkPayment = async (db, txnDetails, baseTxnType) => {
  for (const linkedTxn of txnDetails.linkedTxnList) {
    const paymentType = linkedTxn.paymentType;
    const details = paymentTypeDetails[paymentType];
    const baseTxnDetails = paymentTypeDetails[baseTxnType];

    //add logs using txnType
    // console.log(
    //   `unLinkPayment txn::${baseTxnType}, data :: ${JSON.stringify(txnDetails)}`
    // );

    if (details) {
      await removeLinkedTxn(
        db,
        linkedTxn,
        details.collection,
        details.idField,
        details.balanceField,
        txnDetails[baseTxnDetails.idField]
      );
    }
    if (linkedTxn.paymentType !== 'Opening Receivable Balance') {
      await allTxnLinkPayment.removeLinkedTxnBalance(db, linkedTxn);
    }
  }
};

const removeLinkedTxn = async (
  db,
  linkedTxn,
  collection,
  idField,
  balanceField,
  baseTxnIdField
) => {
  const businessData = await Bd.getBusinessData();

  //add logs using txnType
  // console.log(
  //   `removeLinkedTxn txn::${collection}, data :: ${JSON.stringify(linkedTxn)}`
  // );

  const data = await db[collection]
    .findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { [idField]: { $eq: linkedTxn.linkedId } }
        ]
      }
    })
    .exec();

  const changeData = async (oldData) => {
    let finalLinkedTxnList = [];
    if (typeof oldData.linkedTxnList === 'undefined') {
      return;
    } else {
      oldData.linkedTxnList.forEach((element) => {
        if (element.linkedId !== baseTxnIdField) {
          finalLinkedTxnList.push(element);
        } else {
          const linkedAmount = parseFloat(element.linkedAmount);
          oldData[balanceField] += linkedAmount;
          oldData.linked_amount =
            (parseFloat(oldData.linked_amount) || 0) - linkedAmount;
        }
      });

      oldData.linkedTxnList = finalLinkedTxnList;
    }
    oldData.updatedAt = Date.now();
    return oldData;
  };

  if (data) {
    await data.atomicUpdate(changeData);
  }
};

const getLinkedData = async (db, linkedTxn, paymentTypeDetails, txnType) => {
  const data = await getLinkedTxnDataQuery(db, linkedTxn, paymentTypeDetails);

  if (!data) {
    return;
  }
  const finalDataList = data
    .map((item) => {
      let finalData = item.toJSON();

      //check for linked amount
      if (item.linked_amount && item.linked_amount > 0) {
        finalData.paymentType = txnType;
        finalData.id = item[paymentTypeDetails.idField];
        finalData.total = item[paymentTypeDetails.totalAmountField];
        finalData.balance = item[paymentTypeDetails.balanceField];
        finalData.sequenceNumber = item.sequenceNumber;
        finalData.date = item[paymentTypeDetails.dateField];

        return finalData;
      } else {
        return null;
      }
    })
    //filter all null retuned objects
    .filter((item) => item !== null);

  return finalDataList;
};

export const getSalesLinkedData = async (db, linkedTxn, txnType) => {
  return getLinkedData(db, linkedTxn, paymentTypeDetails[txnType], txnType);
};

export const getPaymentOutLinkedData = async (db, linkedTxn, txnType) => {
  return getLinkedData(db, linkedTxn, paymentTypeDetails[txnType], txnType);
};

export const getOpeningBalanceLinkedData = async (db, linkedTxn, txnType) => {
  return getLinkedData(db, linkedTxn, paymentTypeDetails[txnType], txnType);
};

export const getPurchaseReturnsLinkedData = async (db, linkedTxn, txnType) => {
  return getLinkedData(db, linkedTxn, paymentTypeDetails[txnType], txnType);
};

export const getPaymentInLinkedData = async (db, linkedTxn, txnType) => {
  return getLinkedData(db, linkedTxn, paymentTypeDetails[txnType], txnType);
};

export const getSalesReturnLinkedData = async (db, linkedTxn, txnType) => {
  return getLinkedData(db, linkedTxn, paymentTypeDetails[txnType], txnType);
};

export const getCreditPurchaseLinkedData = async (db, linkedTxn, txnType) => {
  return getLinkedData(db, linkedTxn, paymentTypeDetails[txnType], txnType);
};

export const getSchemeLinkedData = async (db, linkedTxn, txnType) => {
  return getLinkedData(db, linkedTxn, paymentTypeDetails[txnType], txnType);
};

export const getOpeningBalanceData = async (db, id, txnType) => {
  const businessData = await Bd.getBusinessData();

  return getTransactionData(
    db,
    {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        {
          $or: [{ customerId: { $eq: id } }, { vendorId: { $eq: id } }],
          txnType: { $eq: txnType },
          balance: { $gt: 0 }
        }
      ]
    },
    paymentTypeDetails[txnType],
    txnType
  );
};

export const getPurchaseReturnsData = async (db, id, businessId, txnType) => {
  return getTransactionData(
    db,
    {
      $and: [
        { businessId: { $eq: businessId } },
        { vendor_id: { $eq: id } },
        { balance_amount: { $gt: 0 } }
      ]
    },
    paymentTypeDetails[txnType],
    txnType
  );
};

export const getPaymentOutData = async (db, id, businessId, txnType) => {
  return getTransactionData(
    db,
    {
      $and: [
        { businessId: { $eq: businessId } },
        { vendorId: { $eq: id } },
        { balance: { $gt: 0 } }
      ]
    },
    paymentTypeDetails[txnType],
    txnType
  );
};

export const getSaledata = async (db, id, businessId, txnType) => {
  return getTransactionData(
    db,
    {
      $and: [
        { businessId: { $eq: businessId } },
        { customer_id: { $eq: id } },
        { balance_amount: { $gt: 0.0 } }
      ]
    },
    paymentTypeDetails[txnType],
    txnType
  );
};

export const getPaymentInData = async (db, id, businessId, txnType) => {
  return getTransactionData(
    db,
    {
      $and: [
        { businessId: { $eq: businessId } },
        { customerId: { $eq: id } },
        { balance: { $gt: 0.0 } }
      ]
    },
    paymentTypeDetails[txnType],
    txnType
  );
};

export const getSalesReturnData = async (db, id, businessId, txnType) => {
  return getTransactionData(
    db,
    {
      $and: [
        { businessId: { $eq: businessId } },
        { customer_id: { $eq: id } },
        { balance_amount: { $gt: 0.0 } }
      ]
    },
    paymentTypeDetails[txnType],
    txnType
  );
};

export const getCreditPurchaseData = async (db, id, businessId, txnType) => {
  return getTransactionData(
    db,
    {
      $and: [
        { businessId: { $eq: businessId } },
        { vendor_id: { $eq: id } },
        { balance_amount: { $gt: 0.0 } }
      ]
    },
    paymentTypeDetails[txnType],
    txnType
  );
};

export const getAllLinkedTxnData = async (instance, txnData, txnType) => {
  const db = await Db.get();

  let transactionTypes;

  if (
    txnType === 'Sales Return' ||
    txnType === 'Payment In' ||
    txnType === 'Purchases'
  ) {
    transactionTypes = {
      Sales: false,
      'Payment Out': false,
      'Purchases Return': false,
      'Opening Receivable Balance': false,
      Scheme: false,
    };
  } else if (
    txnType === 'Sales' ||
    txnType === 'Payment Out' ||
    txnType === 'Purchases Return'
  ) {
    transactionTypes = {
      'Sales Return': false,
      'Payment In': false,
      Purchases: false,
      'Opening Payable Balance': false,
      Scheme: false,
    };
  }

  let openingReceivableBalanceLinkedId;
  let openingPayableBalanceLinkedId;

  for (const txn of txnData.linkedTxnList) {
    if (txn) {
      if (txn.paymentType in transactionTypes) {
        transactionTypes[txn.paymentType] = true;
        if (txn.paymentType === 'Opening Receivable Balance') {
          openingReceivableBalanceLinkedId = txn.linkedId;
        }
        if (txn.paymentType === 'Opening Payable Balance') {
          openingPayableBalanceLinkedId = txn.linkedId;
        }
      }
    }

    let linkedDataList;
    if (transactionTypes['Sales']) {
      linkedDataList = await getSalesLinkedData(db, txn, 'Sales');
    }
    if (transactionTypes['Payment Out']) {
      linkedDataList = await getPaymentOutLinkedData(db, txn, 'Payment Out');
    }
    if (transactionTypes['Purchases Return']) {
      linkedDataList = await getPurchaseReturnsLinkedData(
        db,
        txn,
        'Purchases Return'
      );
    }

    if (transactionTypes['Payment In']) {
      linkedDataList = await getPaymentInLinkedData(db, txn, 'Payment In');
    }
    if (transactionTypes['Sales Return']) {
      linkedDataList = await getSalesReturnLinkedData(db, txn, 'Sales Return');
    }
    if (transactionTypes['Purchases']) {
      linkedDataList = await getCreditPurchaseLinkedData(db, txn, 'Purchases');
    }
    if (transactionTypes['Opening Payable Balance']) {
      linkedDataList = await getOpeningBalanceLinkedData(
        db,
        { id: openingPayableBalanceLinkedId },
        'Opening Payable Balance'
      );
    }

    if (transactionTypes['Opening Receivable Balance']) {
      linkedDataList = await getOpeningBalanceLinkedData(
        db,
        { id: openingReceivableBalanceLinkedId },
        'Opening Receivable Balance'
      );
    }
    if (transactionTypes['Scheme']) {
      linkedDataList = await getSchemeLinkedData(db, txn, 'Scheme');
    }

    await setUnLinkedTxn(instance, linkedDataList);
  }

  if (instance.paymentUnLinkTransactions.length > 0) {
    instance.paymentUnLinkTransactions = instance.paymentUnLinkTransactions.map(
      (linkTxn) => {
        const actualTxn = txnData.linkedTxnList.find(
          (x) => x.linkedId === linkTxn.id
        );
        linkTxn.linkedAmount = actualTxn?.linkedAmount || 0;
        linkTxn.selected = true;
        return linkTxn;
      }
    );

    instance.paymentLinkTransactions = instance.paymentUnLinkTransactions;
  }
};

export const getAllUnPaidTxnForCustomer = async (instance, db, id, txnType) => {
  try {
    const businessData = await Bd.getBusinessData();

    let results;

    if (
      txnType === 'Sales Return' ||
      txnType === 'Payment In' ||
      txnType === 'Purchases'
    ) {
      results = await Promise.all([
        getSaledata(db, id, businessData.businessId, 'Sales'),
        getPaymentOutData(db, id, businessData.businessId, 'Payment Out'),
        getPurchaseReturnsData(
          db,
          id,
          businessData.businessId,
          'Purchases Return'
        ),
        getOpeningBalanceData(db, id, 'Opening Receivable Balance')
      ]);
    }

    if (
      txnType === 'Sales' ||
      txnType === 'Payment Out' ||
      txnType === 'Purchases Return'
    ) {
      results = await Promise.all([
        getPaymentInData(db, id, businessData.businessId, 'Payment In'),
        getSalesReturnData(db, id, businessData.businessId, 'Sales Return'),
        getCreditPurchaseData(db, id, businessData.businessId, 'Purchases'),
        getOpeningBalanceData(db, id, 'Opening Payable Balance')
      ]);
    }

    const mergedResults = [].concat(...results.filter(Boolean));

    mergedResults.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });

    // console.log(toJS(this.paymentLinkTransactions));
    mergedResults.forEach((item) => {
      if (!instance.paymentLinkTransactions.find((x) => x.id === item.id)) {
        instance.paymentLinkTransactions.push(item);
      }
    });

    if (instance.paymentLinkTransactions.length > 0) {
      instance.paymentLinkTransactions = Array.from(
        new Set(
          instance.paymentLinkTransactions.map((item) => JSON.stringify(item))
        )
      ).map((item) => JSON.parse(item));
    }
  } catch (error) {
    console.error('Error fetching transactions:', error);
  }
};

export const setUnLinkedTxn = async (instance, data) => {
  for (let item of data) {
    var index = instance.paymentUnLinkTransactions.findIndex(
      (x) => x.id === item.id
    );

    if (index === -1) {
      instance.paymentUnLinkTransactions.push(item);
    }
  }
};
