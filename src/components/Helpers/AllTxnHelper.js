import { toJS } from 'mobx';
import * as bankTxn from '../Helpers/BankTxnHelper';
import * as Bd from '../SelectedBusiness';
import {
  attachSequenceNumbersToReceipts,
  generateReceiptsWithOutSequenceNumbers
} from 'src/components/Helpers/receiptHelper';

export const saveTxnFromSales = async (
  txnData,
  db,
  existingReceiptOrPayment,
  txnType
) => {
  let transaction = {};

  transaction.id = txnData.invoice_number;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.invoice_date;

  //customer data
  transaction.customerId = txnData.customer_id;
  transaction.customerName = txnData.customer_name;
  transaction.customerGSTNo = txnData.customerGSTNo;
  transaction.customerPAN = txnData.customerPanNumber;
  transaction.aadharNumber = txnData.aadharNumber;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = parseFloat(txnData.balance_amount);
  transaction.txnType = 'Sales';
  transaction.paymentType = txnData.payment_type;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.isCredit = txnData.is_credit;
  transaction.paidOrReceivedAmount = parseFloat(txnData.received_amount) || 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;
  transaction.dueDate = txnData.dueDate;
  transaction.tcsAmount = txnData.tcsAmount;
  transaction.tcsName = txnData.tcsName;
  transaction.tcsRate = txnData.tcsRate;
  transaction.tcsCode = txnData.tcsCode;
  transaction.tdsAmount = txnData.tdsAmount;
  transaction.tdsName = txnData.tdsName;
  transaction.tdsRate = txnData.tdsRate;
  transaction.tdsCode = txnData.tdsCode;

  transaction.splitPaymentList = [];
  if (txnData.payment_type === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      transaction.splitPaymentList.push(payment);
    }
  }

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  //invoke bank transaction update
  if (transaction.bankAccountId && transaction.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = transaction.bankAccountId;
    txn.amount = 0;

    if (transaction.isCredit === true || transaction.isCredit === 'true') {
      txn.amount = parseFloat(txnData.received_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  if (txnData.payment_type === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.addBalanceToBankAccount(txn, db);
      }
    }
  }

  //generate receipt/payment txn data by considering the existing payment receipts
  await generateReceipts(
    txnData,
    existingReceiptOrPayment,
    transaction,
    'Tally Receipt'
  );

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);

  return transaction.receiptOrPayment;
};

export const saveTxnFromKot = async (txnData, db) => {
  let transaction = {};

  transaction.id = txnData.invoice_number;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.invoice_date;

  //customer data
  transaction.customerId = txnData.customer_id;
  transaction.customerName = txnData.customer_name;
  transaction.customerGSTNo = txnData.customerGSTNo;
  transaction.customerPAN = txnData.customerPanNumber;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = parseFloat(txnData.balance_amount);
  transaction.txnType = 'KOT';
  transaction.paymentType = txnData.payment_type;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.paidOrReceivedAmount = 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;
  transaction.dueDate = txnData.dueDate;

  transaction.splitPaymentList = [];
  if (txnData.payment_type === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      transaction.splitPaymentList.push(payment);
    }
  }

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  //invoke bank transaction update
  if (transaction.bankAccountId && transaction.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = transaction.bankAccountId;
    txn.amount = 0;

    if (transaction.isCredit === true || transaction.isCredit === 'true') {
      txn.amount = parseFloat(txnData.received_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  if (txnData.payment_type === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.addBalanceToBankAccount(txn, db);
      }
    }
  }

  let result;

  try {
    result = await db.alltransactions
      .insert(transaction)
      .then((data) => {
        console.log('data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in Adding all txn data from kot:', err);
      });

    if (result && result.error) {
      if (result.error.length > 0) {
        // alert('Txn Data is not saved' + toJS(result.error));
        console.log(toJS(result.error));
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const processPaymentReceipts = (
  existingPaymentReceipts,
  newPaymentReceipts
) => {
  // Iterate over newPaymentReceipts
  for (let i = 0; i < newPaymentReceipts.length; i++) {
    const newReceipt = newPaymentReceipts[i];

    const existingReceipt = existingPaymentReceipts.find(
      (receipt) =>
        receipt.paymentType === newReceipt.paymentType &&
        receipt.bankId === newReceipt.bankId &&
        receipt.paymentMode === newReceipt.paymentMode
    );

    if (existingReceipt) {
      existingReceipt.amount = newReceipt.amount;
      existingReceipt.referenceNumber = newReceipt.referenceNumber;
      existingReceipt.updatedAt = newReceipt.updatedAt;
      existingReceipt.narration = newReceipt.narration;
    } else {
      existingPaymentReceipts.push(newReceipt);
    }
  }

  // Iterate over existingPaymentReceipts
  // Loop through each existingReceipt
  for (let i = 0; i < existingPaymentReceipts.length; i++) {
    const existingReceipt = existingPaymentReceipts[i];

    // Check if the existingReceipt is present in newPaymentReceipts based on paymentType, paymentMode and bankId
    const isPresent = newPaymentReceipts.some(
      (newReceipt) =>
        newReceipt.paymentType === existingReceipt.paymentType &&
        newReceipt.paymentMode === existingReceipt.paymentMode &&
        newReceipt.bankId === existingReceipt.bankId
    );

    // If the existingReceipt is not present in newPaymentReceipts, mark it as cancelled
    if (!isPresent) {
      existingReceipt.cancelled = true;
    } else {
      existingReceipt.cancelled = false;
    }
  }

  return existingPaymentReceipts;
};


export const deleteTxnFromSales = async (txnData, db) => {
  // Get the transaction
  const businessData = await Bd.getBusinessData();
  let deleted;

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.invoice_number } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      deleted = data;
      // console.log('deleteTxnFromSales removed' + data);
    })
    .catch((error) => {
      console.error('deleteTxnFromSales Failed ' + error);
    });

  await removeBalanceFromBankForSales(txnData, db);

  return deleted;
};


export const removeBalanceFromBankForSales = async (txnData, db) => {
  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.received_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.removeBalanceFromBankAccount(txn, db);
  }

  if (txnData.payment_type === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.removeBalanceFromBankAccount(txn, db);
      }
    }
  }

};

export const deleteAndSaveTxnFromSales = async (existing, txnData, db) => {
  await removeBalanceFromBankForSales(existing, db);
  //print delete object in JSON format all spaces as well. add log " saying its delete one"
  return await saveTxnFromSales(
    txnData,
    db,
    existing ? existing.receiptOrPayment : null,
    'update'
  );
};

export const saveTxnFromSalesReturn = async (txnData, db) => {
  let transaction = {};

  transaction.id = txnData.sales_return_number;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.date;

  //customer data
  transaction.customerId = txnData.customer_id;
  transaction.customerName = txnData.customer_name;
  transaction.customerGSTNo = txnData.customerGSTNo;
  transaction.customerPAN = txnData.customerPanNumber;
  transaction.aadharNumber = txnData.aadharNumber;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = parseFloat(txnData.balance_amount);
  transaction.txnType = 'Sales Return';
  transaction.paymentType = txnData.payment_type;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.paidOrReceivedAmount = parseFloat(txnData.paid_amount) || 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;
  transaction.dueDate = txnData.dueDate;
  transaction.tcsAmount = txnData.tcsAmount;
  transaction.tcsName = txnData.tcsName;
  transaction.tcsRate = txnData.tcsRate;
  transaction.tcsCode = txnData.tcsCode;
  transaction.tdsAmount = txnData.tdsAmount;
  transaction.tdsName = txnData.tdsName;
  transaction.tdsRate = txnData.tdsRate;
  transaction.tdsCode = txnData.tdsCode;
  transaction.splitPaymentList = [];
  if (txnData.payment_type === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      transaction.splitPaymentList.push(payment);
    }
  }

  if (parseFloat(txnData.balance_amount) > 0) {
    transaction.isCredit = true;
  } else {
    transaction.isCredit = false;
  }

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  let result;

  try {
    result = await db.alltransactions
      .insert(transaction)
      .then((data) => {
        console.log('data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in Adding all txn data from Sales return:', err);
      });

    if (result && result.error) {
      if (result.error.length > 0) {
        // alert('Txn Data is not saved' + toJS(result.error));
        console.log(toJS(result.error));
      }
    }
  } catch (err) {
    console.log(err);
  }
};
export const deleteTxnFromSalesReturn = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.sales_return_number } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromSalesReturn removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromSalesReturn Failed ' + error);
    });
};

export const saveTxnFromPurchases = async (
  txnData,
  db,
  existingReceiptOrPayment,
  txnType
) => {
  let transaction = {};

  transaction.id = txnData.bill_number;
  transaction.sequenceNumber = txnData.vendor_bill_number;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.bill_date;

  //vendor data
  transaction.vendorId = txnData.vendor_id;
  transaction.vendorName = txnData.vendor_name;
  transaction.vendorGSTNo = txnData.vendor_gst_number;
  transaction.vendorPAN = txnData.vendorPanNumber;
  transaction.aadharNumber = txnData.aadharNumber;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = parseFloat(txnData.balance_amount);
  transaction.txnType = 'Purchases';
  transaction.paymentType = txnData.payment_type;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.isCredit = txnData.is_credit;
  transaction.paidOrReceivedAmount = parseFloat(txnData.paid_amount) || 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;
  transaction.dueDate = txnData.dueDate;
  transaction.tcsAmount = txnData.tcsAmount;
  transaction.tcsName = txnData.tcsName;
  transaction.tcsRate = txnData.tcsRate;
  transaction.tcsCode = txnData.tcsCode;
  transaction.tdsAmount = txnData.tdsAmount;
  transaction.tdsName = txnData.tdsName;
  transaction.tdsRate = txnData.tdsRate;
  transaction.tdsCode = txnData.tdsCode;
  transaction.splitPaymentList = [];
  if (txnData.payment_type === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      transaction.splitPaymentList.push(payment);
    }
  }

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.paid_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.removeBalanceFromBankAccount(txn, db);
  }

  if (txnData.payment_type === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.removeBalanceFromBankAccount(txn, db);
      }
    }
  }

  //generate receipt/payment txn data by considering the existing payment receipts
  await generateReceipts(
    txnData,
    existingReceiptOrPayment,
    transaction,
    'Tally Payment'
  );


  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);


  return transaction.receiptOrPayment;
};

export const deleteTxnFromPurchases = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  let deleted;
  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.bill_number } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      deleted = data;
      console.log('deleteTxnFromPurchases removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromPurchases Failed ' + error);
    });


  await removeBalanceFromBankForPurchases(txnData, db);

  return deleted;
};

export const removeBalanceFromBankForPurchases = async (txnData, db) => {
  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.paid_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  if (txnData.payment_type === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.addBalanceToBankAccount(txn, db);
      }
    }
  }

};

export const deleteAndSaveTxnFromPurchases = async (existing, txnData, db) => {
  await removeBalanceFromBankForPurchases(existing, db);
  return await saveTxnFromPurchases(
    txnData,
    db,
    existing ? existing.receiptOrPayment : null,
    'update'
  );
};

export const saveTxnFromPurchasesReturn = async (txnData, db) => {
  let transaction = {};

  transaction.id = txnData.purchase_return_number;
  transaction.sequenceNumber = txnData.purchaseReturnBillNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.date;

  //vendor data
  transaction.vendorId = txnData.vendor_id;
  transaction.vendorName = txnData.vendor_name;
  transaction.vendorGSTNo = txnData.vendor_gst_number;
  transaction.vendorPAN = txnData.vendorPanNumber;
  transaction.aadharNumber = txnData.aadharNumber;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = parseFloat(txnData.balance_amount);
  transaction.txnType = 'Purchases Return';
  transaction.paymentType = txnData.payment_type;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.paidOrReceivedAmount = parseFloat(txnData.received_amount) || 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;
  transaction.dueDate = txnData.dueDate;
  transaction.tcsAmount = txnData.tcsAmount;
  transaction.tcsName = txnData.tcsName;
  transaction.tcsRate = txnData.tcsRate;
  transaction.tcsCode = txnData.tcsCode;
  transaction.tdsAmount = txnData.tdsAmount;
  transaction.tdsName = txnData.tdsName;
  transaction.tdsRate = txnData.tdsRate;
  transaction.tdsCode = txnData.tdsCode;
  transaction.splitPaymentList = txnData.splitPaymentList;

  if (parseFloat(txnData.balance_amount) > 0) {
    transaction.isCredit = true;
  } else {
    transaction.isCredit = false;
  }

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  let result;

  try {
    result = await db.alltransactions
      .insert(transaction)
      .then((data) => {
        console.log('data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in Adding all txn data from purchases:', err);
      });

    if (result && result.error) {
      if (result.error.length > 0) {
        // alert('Txn Data is not saved' + toJS(result.error));
        console.log(toJS(result.error));
      }
    }
  } catch (err) {
    console.log(err);
  }
};
export const deleteTxnFromPurchasesReturn = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.purchase_return_number } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromPurchasesReturn removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromPurchasesReturn Failed ' + error);
    });
};

export const saveTxnFromExpense = async (
  txnData,
  db,
  existingReceiptOrPayment,
  txnType
) => {
  let transaction = {};

  transaction.id = txnData.expenseId;
  transaction.sequenceNumber = txnData.billNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.date;

  //vendor data
  transaction.vendorName = txnData.vendor_name;
  transaction.vendorId = txnData.vendor_id;
  transaction.vendorGSTNo = txnData.vendor_gst_number;
  transaction.vendorPAN = txnData.vendorPanNumber;

  // payment data
  transaction.amount = parseFloat(txnData.total);
  transaction.balance = parseFloat(txnData.balance);
  transaction.txnType = 'Expenses';
  transaction.paymentType = txnData.paymentType;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.isCredit = txnData.is_credit;
  transaction.paidOrReceivedAmount = 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;
  transaction.dueDate = txnData.dueDate;
  transaction.tcsAmount = txnData.tcsAmount;
  transaction.tcsName = txnData.tcsName;
  transaction.tcsRate = txnData.tcsRate;
  transaction.tcsCode = txnData.tcsCode;
  transaction.tdsAmount = txnData.tdsAmount;
  transaction.tdsName = txnData.tdsName;
  transaction.tdsRate = txnData.tdsRate;
  transaction.tdsCode = txnData.tdsCode;
  transaction.splitPaymentList = [];
  if (txnData.paymentType === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      transaction.splitPaymentList.push(payment);
    }
  }

  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = 0;
    } else {
      txn.amount = parseFloat(txnData.total);
    }

    await bankTxn.removeBalanceFromBankAccount(txn, db);
  }

  if (txnData.paymentType === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.removeBalanceFromBankAccount(txn, db);
      }
    }
  }

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  //generate receipt/payment txn data by considering the existing payment receipts
  await generateReceipts(
    txnData,
    existingReceiptOrPayment,
    transaction,
    'Tally Payment'
  );

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);

  return transaction.receiptOrPayment;
};

export const deleteTxnFromExpense = async (txnData, db) => {
  try {
    const businessData = await Bd.getBusinessData();

    // Find the document with the specific businessId and expenseId
    const doc = await db.alltransactions.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: txnData.expenseId } }
        ]
      }
    }).exec(); // Execute the query to get the document

    // If the document is found, remove it
    if (doc) {
      await doc.remove();
      console.log('deleteTxnFromExpense: Transaction removed successfully');
    } else {
      console.log('deleteTxnFromExpense: No matching transaction found');
    }
  } catch (error) {
    console.log('deleteTxnFromExpense Failed', error);
  }

  await removeBalanceFromExpense(txnData, db);

};


export const removeBalanceFromExpense = async (txnData, db) => {
  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = 0;
    } else {
      txn.amount = parseFloat(txnData.total);
    }

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  if (txnData.paymentType === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.addBalanceToBankAccount(txn, db);
      }
    }
  }
};

export const deleteAndSaveTxnFromExpense = async (existing, txnData, db) => {
  await removeBalanceFromExpense(existing, db);
  return await saveTxnFromExpense(
    txnData,
    db,
    existing ? existing.receiptOrPayment : null,
    'update'
  );
};

export const saveTxnFromPaymentIn = async (
  txnData,
  db,
  existingReceiptOrPayment,
  txnType
) => {
  let transaction = {};

  transaction.id = txnData.receiptNumber;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.date;

  //customer data
  transaction.customerId = txnData.customerId;
  transaction.customerName = txnData.customerName;
  transaction.customerGSTNo = txnData.customerGSTNo;
  transaction.customerPAN = txnData.customerPanNumber;

  // payment data
  transaction.amount = parseFloat(txnData.total);
  transaction.balance = parseFloat(txnData.balance);
  transaction.txnType = 'Payment In';
  transaction.paymentType = txnData.paymentType;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.isCredit = false;
  transaction.paidOrReceivedAmount = 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;
  transaction.tcsAmount = txnData.tcsAmount;
  transaction.tcsName = txnData.tcsName;
  transaction.tcsRate = txnData.tcsRate;
  transaction.tcsCode = txnData.tcsCode;
  transaction.tdsAmount = txnData.tdsAmount;
  transaction.tdsName = txnData.tdsName;
  transaction.tdsRate = txnData.tdsRate;
  transaction.tdsCode = txnData.tdsCode;
  transaction.splitPaymentList = [];
  if (txnData.paymentType === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      transaction.splitPaymentList.push(payment);
    }
  }

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  //invoke bank transaction update
  if (transaction.bankAccountId && transaction.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = transaction.bankAccountId;
    txn.amount = 0;

    if (transaction.isCredit === true || transaction.isCredit === 'true') {
      txn.amount = parseFloat(txnData.received);
    } else {
      txn.amount = parseFloat(txnData.total);
    }

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  if (txnData.paymentType === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.addBalanceToBankAccount(txn, db);
      }
    }
  }

  //generate receipt/payment txn data by considering the existing payment receipts
  await generateReceipts(
    txnData,
    existingReceiptOrPayment,
    transaction,
    'Tally Receipt'
  );

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);

  return transaction.receiptOrPayment;
};
export const deleteTxnFromPaymentIn = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  let deleted;

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.receiptNumber } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      deleted = data;
      // console.log('deleteTxnFromPaymentIn removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromPaymentIn Failed ' + error);
    });

  await removeBalanceFromPaymentIn(txnData, db);

  return deleted;
};

export const removeBalanceFromPaymentIn = async (txnData, db) => {
  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.received);
    } else {
      txn.amount = parseFloat(txnData.total);
    }

    await bankTxn.removeBalanceFromBankAccount(txn, db);
  }

  if (txnData.paymentType === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.removeBalanceFromBankAccount(txn, db);
      }
    }
  }

};


export const deleteAndSaveTxnFromPaymentIn = async (existing, txnData, db) => {
  await removeBalanceFromPaymentIn(existing, db);
  return await saveTxnFromPaymentIn(
    txnData,
    db,
    existing ? existing.receiptOrPayment : null,
    'update'
  );
};

export const saveTxnFromPaymentOut = async (
  txnData,
  db,
  existingReceiptOrPayment,
  txnType
) => {
  let transaction = {};

  transaction.id = txnData.receiptNumber;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.date;

  //vendor data
  transaction.vendorName = txnData.vendorName;
  transaction.vendorId = txnData.vendorId;
  transaction.vendorGSTNo = txnData.vendorGSTNo;
  transaction.vendorPAN = txnData.vendorPanNumber;

  // payment data
  transaction.amount = parseFloat(txnData.paid);
  transaction.balance = parseFloat(txnData.balance);
  transaction.txnType = 'Payment Out';
  transaction.paymentType = txnData.paymentType;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.isCredit = false;
  transaction.paidOrReceivedAmount = 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;
  transaction.tcsAmount = txnData.tcsAmount;
  transaction.tcsName = txnData.tcsName;
  transaction.tcsRate = txnData.tcsRate;
  transaction.tcsCode = txnData.tcsCode;
  transaction.tdsAmount = txnData.tdsAmount;
  transaction.tdsName = txnData.tdsName;
  transaction.tdsRate = txnData.tdsRate;
  transaction.tdsCode = txnData.tdsCode;
  transaction.splitPaymentList = [];
  if (txnData.paymentType === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      transaction.splitPaymentList.push(payment);
    }
  }

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.paid);
    } else {
      txn.amount = parseFloat(txnData.total);
    }

    await bankTxn.removeBalanceFromBankAccount(txn, db);
  }

  if (txnData.paymentType === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.removeBalanceFromBankAccount(txn, db);
      }
    }
  }

  //generate receipt/payment txn data by considering the existing payment receipts
  await generateReceipts(
    txnData,
    existingReceiptOrPayment,
    transaction,
    'Tally Payment'
  );

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);

  return transaction.receiptOrPayment;
};


export const deleteTxnFromPaymentOut = async (txnData, db) => {
  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;
    txn.amount = parseFloat(txnData.total);

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  const businessData = await Bd.getBusinessData();

  let deleted;

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.receiptNumber } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      deleted = data;
      console.log('deleteTxnFromPaymentOut removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromPaymentOut Failed ' + error);
    });

  await removeBalanceFromPaymentOut(txnData, db);
};


export const removeBalanceFromPaymentOut = async (txnData, db) => {
  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;
    txn.amount = parseFloat(txnData.total);

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.paid);
    } else {
      txn.amount = parseFloat(txnData.total);
    }

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  if (txnData.paymentType === 'Split') {
    for (let payment of txnData.splitPaymentList) {
      if (payment.paymentType === 'Bank' && payment.amount > 0) {
        let txn = {};
        txn.bankAccountId = payment.bankAccountId;
        txn.amount = parseFloat(payment.amount);

        await bankTxn.addBalanceToBankAccount(txn, db);
      }
    }
  }

};

export const deleteAndSaveTxnFromPaymentOut = async (existing, txnData, db) => {
  await removeBalanceFromPaymentOut(existing, db);
  return await saveTxnFromPaymentOut(
    txnData,
    db,
    existing ? existing.receiptOrPayment : null,
    'update'
  );
};

export const saveTxnFromAddBankAccount = async (txnData, db) => {
  let transaction = {};

  transaction.id = txnData.id;
  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.asOfDate;

  // payment data
  transaction.amount = parseFloat(txnData.balance);
  transaction.txnType = 'Opening Balance';
  transaction.bankAccount = txnData.accountNumber;
  transaction.bankAccountId = txnData.id;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  let result;

  try {
    result = await db.alltransactions
      .insert(transaction)
      .then((data) => {
        console.log('data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in Adding all txn data from Sales return:', err);
      });

    if (result && result.error) {
      if (result.error.length > 0) {
        // alert('Txn Data is not saved' + toJS(result.error));
        console.log(toJS(result.error));
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteTxnFromAddBankAccount = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.id } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromPaymentOut removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromPaymentOut Failed ' + error);
    });
};

export const saveTxnFromAddParties = async (txnData, db) => {
  let transaction = {};

  transaction.id = txnData.id;
  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.asOfDate;

  // payment data
  transaction.amount = parseFloat(txnData.balance);
  transaction.balance = parseFloat(txnData.balance);

  if (txnData.balanceType === 'Payable') {
    transaction.txnType = 'Opening Payable Balance';
  } else {
    transaction.txnType = 'Opening Receivable Balance';
  }

  if (txnData.isCustomer === true) {
    //vendor data
    transaction.customerName = txnData.name;
    transaction.customerId = txnData.id;
  } else {
    //customer data
    transaction.vendorName = txnData.name;
    transaction.vendorId = txnData.id;
  }

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  let result;

  try {
    result = await db.alltransactions
      .insert(transaction)
      .then((data) => {
        console.log('data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in Adding all txn data from Sales return:', err);
      });

    if (result && result.error) {
      if (result.error.length > 0) {
        // alert('Txn Data is not saved' + toJS(result.error));
        console.log(toJS(result.error));
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteTxnFromAddParties = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.id } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromPaymentOut removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromPaymentOut Failed ' + error);
    });
};

export const deleteAndSaveTxnFromAdjustments = async (
  existing,
  txnData,
  db
) => {
  await saveTxnFromAddAdjustments(txnData, db, 'update');
};

export const saveTxnFromAddAdjustments = async (txnData, db, txnType) => {
  let transaction = {};

  transaction.id = txnData.id;
  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.date;

  // payment data
  transaction.amount = parseFloat(txnData.amount);
  transaction.txnType = txnData.transactionType;
  transaction.paymentType = txnData.cashType;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  console.log(
    'Inserting Txn Data: ' + transaction.amount + ' with Id ' + transaction.id
  );

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);

};

export const deleteTxnFromAddAdjustments = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.id } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromadjustments removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromadjustments Failed ' + error);
    });
};

// Job work in
export const saveTxnFromJobWorkIn = async (txnData, db, txnType) => {
  let transaction = {};

  transaction.id = txnData.job_work_in_invoice_number;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.invoice_date;

  //customer data
  transaction.customerId = txnData.customer_id;
  transaction.customerName = txnData.customer_name;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = parseFloat(txnData.balance_amount);
  transaction.txnType = 'Job Work In';
  transaction.paymentType = txnData.payment_type;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.isCredit = txnData.is_credit;
  transaction.paidOrReceivedAmount = parseFloat(txnData.received_amount) || 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;
  transaction.dueDate = txnData.due_date;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  //invoke bank transaction update
  if (transaction.bankAccountId && transaction.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = transaction.bankAccountId;
    txn.amount = 0;

    if (transaction.isCredit === true || transaction.isCredit === 'true') {
      txn.amount = parseFloat(txnData.received_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);
};

export const deleteAndSaveTxnFromJobWorkIn = async (existing, txnData, db) => {
  await removeBalanceFromJobWorkIn(txnData, db);
  await saveTxnFromJobWorkIn(existing, db, 'update');
};

export const deleteTxnFromJobWorkIn = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.job_work_in_invoice_number } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromJobWorkIn removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromJobWorkIn Failed ' + error);
    });

  await removeBalanceFromJobWorkIn(txnData, db);
};

export const removeBalanceFromJobWorkIn = async (txnData, db) => {

  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.received_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.removeBalanceFromBankAccount(txn, db);
  }
};

// sale order
export const saveTxnFromSaleOrder = async (txnData, db, txnType) => {
  let transaction = {};

  transaction.id = txnData.sale_order_invoice_number;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.invoice_date;

  //customer data
  transaction.customerId = txnData.customer_id;
  transaction.customerName = txnData.customer_name;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = parseFloat(txnData.balance_amount);
  transaction.txnType = 'Sale Order';
  transaction.paymentType = txnData.payment_type;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.isCredit = txnData.is_credit;
  transaction.paidOrReceivedAmount = parseFloat(txnData.received_amount) || 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;
  transaction.dueDate = txnData.due_date;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  //invoke bank transaction update
  if (transaction.bankAccountId && transaction.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = transaction.bankAccountId;
    txn.amount = 0;

    if (transaction.isCredit === true || transaction.isCredit === 'true') {
      txn.amount = parseFloat(txnData.received_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);
};
export const deleteAndSaveTxnFromSaleOrder = async (existing, txnData, db) => {
  await removeBalanceFromSaleOrder(txnData, db);
  await saveTxnFromSaleOrder(existing, db, 'update');
};


export const deleteTxnFromSaleOrder = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.sale_order_invoice_number } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromSaleOrder removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromSaleOrder Failed ' + error);
    });

  await removeBalanceFromSaleOrder(txnData, db);
};


export const removeBalanceFromSaleOrder = async (txnData, db) => {
  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.received_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.removeBalanceFromBankAccount(txn, db);
  }
};

// Delivery Challan
export const saveTxnFromDeliveryChallan = async (txnData, db, txnType) => {
  let transaction = {};

  transaction.id = txnData.delivery_challan_invoice_number;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.invoice_date;

  //customer data
  transaction.customerId = txnData.customer_id;
  transaction.customerName = txnData.customer_name;

  transaction.dueDate = txnData.due_date;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = 0;
  transaction.txnType = 'Delivery Challan';
  transaction.isCredit = false;
  transaction.paidOrReceivedAmount = 0;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);
};

export const deleteAndSaveTxnFromDeliveryChallan = async (
  existing,
  txnData,
  db
) => {
  await saveTxnFromDeliveryChallan(existing, db, 'update');
};

export const deleteTxnFromDeliveryChallan = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.delivery_challan_invoice_number } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromDeliveryChallan removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromDeliveryChallan Failed ' + error);
    });
};

// Sale Quotation
export const saveTxnFromSalesQuotation = async (txnData, db, txnType) => {
  let transaction = {};

  transaction.id = txnData.invoice_number;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.invoice_date;

  //customer data
  transaction.customerId = txnData.customer_id;
  transaction.customerName = txnData.customer_name;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = 0;
  transaction.txnType = 'Sales Quotation';
  transaction.isCredit = false;
  transaction.paidOrReceivedAmount = 0;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }
  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);
};

export const deleteAndSaveTxnFromSalesQuotation = async (
  existing,
  txnData,
  db
) => {
  await saveTxnFromSalesQuotation(existing, db, 'update');
};

export const deleteTxnFromSalesQuotation = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.invoice_number } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromSalesQuotation removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromSalesQuotation Failed ' + error);
    });
};

// Job work out
export const saveTxnFromJobWorkOut = async (txnData, db, txnType) => {
  let transaction = {};

  transaction.id = txnData.id;
  transaction.sequenceNumber = txnData.invoiceSequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.orderDate;

  //customer data
  transaction.customerId = txnData.vendorId;
  transaction.customerName = txnData.vendorName;

  // payment data
  transaction.amount = parseFloat(txnData.totalAmount);
  transaction.balance = 0;
  transaction.txnType = 'Job Work Out';
  transaction.isCredit = false;
  transaction.paidOrReceivedAmount = 0;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);
};

export const deleteAndSaveTxnFromJobWorkOut = async (existing, txnData, db) => {
  await saveTxnFromJobWorkOut(existing, db, 'update');
};

export const deleteTxnFromJobWorkOut = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.id } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromJobWorkOut removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromJobWorkOut Failed ' + error);
    });
};

// job work out receipt .
export const saveTxnFromJobWorkOutReceipt = async (txnData, db, txnType) => {
  let transaction = {};

  transaction.id = txnData.id;
  transaction.sequenceNumber = txnData.receiptSequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.receiptDate;

  //customer data
  transaction.customerId = txnData.vendorId;
  transaction.customerName = txnData.vendorName;

  // payment data
  transaction.amount = parseFloat(txnData.totalAmount);
  transaction.balance = 0;
  transaction.txnType = 'Job Work Out Receipt';
  transaction.isCredit = false;
  transaction.paidOrReceivedAmount = 0;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);
};

export const deleteAndSaveTxnFromJobWorkOutReceipt = async (
  existing,
  txnData,
  db
) => {
  await saveTxnFromJobWorkOutReceipt(existing, db, 'update');
};

export const deleteTxnFromJobWorkOutReceipt = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.id } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromJobWorkOutReceipt removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromJobWorkOutReceipt Failed ' + error);
    });
};

// Purchase order
export const saveTxnFromPurchaseOrder = async (txnData, db, txnType) => {
  let transaction = {};

  transaction.id = txnData.purchase_order_invoice_number;
  transaction.sequenceNumber = txnData.sequenceNumber;

  transaction.businessId = txnData.businessId;
  transaction.businessCity = txnData.businessCity;
  transaction.date = txnData.po_date;

  //customer data
  transaction.customerId = txnData.vendor_id;
  transaction.customerName = txnData.vendor_name;

  // payment data
  transaction.amount = parseFloat(txnData.total_amount);
  transaction.balance = parseFloat(txnData.balance_amount);
  transaction.txnType = 'Purchase Order';
  transaction.paymentType = txnData.payment_type;
  transaction.bankAccount = txnData.bankAccount;
  transaction.bankAccountId = txnData.bankAccountId;
  transaction.isCredit = txnData.is_credit;
  transaction.paidOrReceivedAmount = parseFloat(txnData.paid_amount) || 0;
  transaction.paymentReferenceNumber = txnData.paymentReferenceNumber;

  transaction.linkedAmount = parseFloat(txnData.linked_amount) || 0;
  transaction.dueDate = txnData.due_date;

  try {
    //employee data
    transaction.employeeId = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username;
  } catch (e) {
    console.error(' Error: ', e.message);
  }

  transaction.updatedAt = Date.now();
  transaction.posId = txnData.posId;

  //invoke bank transaction update
  if (transaction.bankAccountId && transaction.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = transaction.bankAccountId;
    txn.amount = 0;

    if (transaction.isCredit === true || transaction.isCredit === 'true') {
      txn.amount = parseFloat(txnData.paid_amount); //suri changed to paid amount
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.addBalanceToBankAccount(txn, db);
  }

  await saveUpdateOrDeleteProductTxnDb(db, transaction, txnType, transaction.id);
};

export const deleteAndSaveTxnFromPurchaseOrder = async (
  existing,
  txnData,
  db
) => {
  await removeBalanceFromPurchaseOrder(txnData, db);
  await saveTxnFromPurchaseOrder(existing, db, 'update');
};

export const deleteTxnFromPurchaseOrder = async (txnData, db) => {
  const businessData = await Bd.getBusinessData();

  const query = await db.alltransactions.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: txnData.purchase_order_invoice_number } }
      ]
    }
  });

  await query
    .remove()
    .then(async (data) => {
      console.log('deleteTxnFromPurchaseOrder removed' + data);
    })
    .catch((error) => {
      console.log('deleteTxnFromPurchaseOrder Failed ' + error);
    });

  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.paid_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.removeBalanceFromBankAccount(txn, db);
  }
};


export const removeBalanceFromPurchaseOrder = async (txnData, db) => {
  //invoke bank transaction update
  if (txnData.bankAccountId && txnData.bankAccountId.length > 0) {
    let txn = {};
    txn.bankAccountId = txnData.bankAccountId;
    txn.amount = 0;

    if (txnData.isCredit === true || txnData.isCredit === 'true') {
      txn.amount = parseFloat(txnData.paid_amount);
    } else {
      txn.amount = parseFloat(txnData.total_amount);
    }

    await bankTxn.removeBalanceFromBankAccount(txn, db);
  }
};

export const calculateLedgerBalance = async (data) => {
  let finalLedgerData = [];
  let previousBalance = 0;

  const filterList = [
    'Sales',
    'Payment In',
    'Sales Return',
    'Purchases',
    'Expenses',
    'Payment Out',
    'Purchases Return',
    'Opening Payable Balance',
    'Opening Receivable Balance'
  ];

  for (let i = 0; i < data.length; i++) {
    const currentObject = data[i];
    const { txnType, balance } = currentObject;

    if (filterList.includes(txnType) && balance > 0) {
      if (
        txnType === 'Payment In' ||
        txnType === 'Sales Return' ||
        txnType === 'Purchases' ||
        txnType === 'Opening Payable Balance'
      ) {
        currentObject.totalBalance = previousBalance + balance;
        currentObject.credit = balance;
        currentObject.debit = 0;
      } else if (
        txnType === 'Sales' ||
        txnType === 'Expenses' ||
        txnType === 'Payment Out' ||
        txnType === 'Purchases Return' ||
        txnType === 'Opening Receivable Balance'
      ) {
        currentObject.totalBalance =
          parseFloat(previousBalance) - parseFloat(balance);

        currentObject.credit = 0;
        currentObject.debit = balance;
      }

      previousBalance = currentObject.totalBalance;
      currentObject.totalBalance = Math.abs(currentObject.totalBalance);
      finalLedgerData.push(currentObject);
    }
  }

  return finalLedgerData;
};

async function generateReceipts(
  txnData,
  existingReceiptOrPayment,
  transaction,
  sequenceType
) {
  let receiptOrPayment = await generateReceiptsWithOutSequenceNumbers(txnData);

  if (existingReceiptOrPayment) {
    receiptOrPayment = await processPaymentReceipts(
      existingReceiptOrPayment,
      receiptOrPayment
    );
  }

  receiptOrPayment = await attachSequenceNumbersToReceipts(
    receiptOrPayment,
    transaction.date,
    sequenceType
  );

  console.log(
    'new receiptOrPayment list:',
    JSON.stringify(receiptOrPayment, null, 2)
  );
  transaction.receiptOrPayment = receiptOrPayment;
}

async function saveUpdateOrDeleteProductTxnDb(db, productTxn, txnType = 'insert', id) {

  const businessData = await Bd.getBusinessData();

  if (txnType && txnType === 'update') {

    await db.alltransactions
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              id: {
                $eq: id
              }
            }
          ]
        }
      })
      .update({
        $set: {
          ...productTxn,
          updatedAt: Date.now()
        }
      })
      .catch((error) => {
        console.log('all txn update Failed ' + error);
      });
  } else if (txnType && txnType === 'insert') {
    await db.alltransactions
      .insert(productTxn)
      .then((data) => {
        console.log('data Inserted:', data);
      })
      .catch((err) => {
        console.log('Error in product txn data :', err);
      });
  } else if (txnType && txnType === 'delete') {
    await db.alltransactions
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              id: {
                $eq: id
              }
            }
          ]
        }
      })
      .remove()
      .then(async (data) => {
        console.log('all txn data removed' + data);
      })
      .catch((error) => {
        console.log('all txn hand deletion Failed ' + error);
      });
  }
}
