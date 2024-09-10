import * as sequence from 'src/components/Helpers/SequenceNumberHelper';
import * as Bd from 'src/components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';
import * as txnSettings from 'src/components/Helpers/TransactionSettingsHelper';

const dateHelper = require('src/components/Helpers/DateHelper');

let transSettings = null;
let multiDeviceSettings = null;

export const generateReceiptsWithOutSequenceNumbers = async (data) => {
  let receipts = [];

  if (
    data.splitPaymentList &&
    data.splitPaymentList.some((payment) => payment.amount > 0)
  ) {
    for (let i = 0; i < data.splitPaymentList.length; i++) {
      const splitPayment = data.splitPaymentList[i];

      if (splitPayment.amount > 0) {
        const createdAt = await dateHelper.getCurrentTimeInMilliseconds();

        let receipt = {
          id: splitPayment.id,
          sequenceNumber: null,
          paymentType: splitPayment.paymentType.toLowerCase(),
          paymentMode: splitPayment.paymentMode,
          amount: splitPayment.amount,
          bankName: splitPayment.accountDisplayName,
          bankId: splitPayment.bankAccountId,
          referenceNumber: splitPayment.referenceNumber,
          createdAt: createdAt,
          cancelled: false,
          narration: createNarration(data)
        };

        receipts.push(receipt);
      }
    }
  } else if (data.payment_type || data.paymentType) {
    let paymentTypeString = data.payment_type || data.paymentType;

    if (
      (paymentTypeString?.toLowerCase() ?? '') !== 'credit' &&
      (data.is_credit === false || !data.is_credit)
    ) {
      const businessData = await Bd.getBusinessData();

      const timestamp = Date.now();
      const appId = businessData.posDeviceId;
      const id = _uniqueId('r');
      const receiptId = `${id}${appId}${timestamp}`;

      let receipt = {
        id: receiptId,
        sequenceNumber: null,
        paymentType: data.bankAccount ? 'bank' : paymentTypeString,
        paymentMode: paymentTypeString,
        amount: data.total_amount || data.total,
        bankName: data.bankAccount,
        bankId: data.bankAccountId,
        createdAt: await dateHelper.getCurrentTimeInMilliseconds(),
        cancelled: false,
        narration: createNarration(data)
      };
      receipts.push(receipt);
    }
  }

  return receipts;
};

const createNarration = (data) => {
  let narration = '';

  const sequenceNumber =
    data.sequenceNumber || data.vendor_bill_number || data.billNumber;
  if (sequenceNumber) {
    narration += `Invoice No: ${sequenceNumber}`;
  }

  let date = data.date || data.bill_date || data.invoice_date;
  if (date) {
    narration += `, Date: ${date}`;
  }

  const partyName =
    data.vendor_name ||
    data.customerName ||
    data.vendorName ||
    data.customer_name;
  if (partyName) {
    narration += `, Party Name: ${partyName}`;
  }

  const gstNo =
    data.vendor_gst_number || data.customerGSTNo || data.vendorGSTNo;
  if (gstNo) {
    narration += `, GST No: ${gstNo}`;
  }

  const pan = data.vendorPanNumber || data.customerPanNumber;
  if (pan) {
    narration += `, PAN: ${pan}`;
  }

  const mobileNo =
    data.vendor_phone_number || data.customer_phoneNo || data.vendorPhoneNo;
  if (mobileNo) {
    narration += `, Mobile No: ${mobileNo}`;
  }

  return narration;
};

export const attachSequenceNumbersToReceipts = async (
  receipts,
  date,
  sequenceType
) => {
  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i];
    //print sequence no
    if (!receipt.sequenceNumber) {
      const sequenceNumber = await getSequenceNumber(
        date,
        receipt.id,
        sequenceType
      );
      receipt.sequenceNumber = sequenceNumber;
    }
  }
  return receipts;
};

const getSequenceNumber = async (date, id, sequenceType) => {
  let isOnline = true;
  let data = {};

  if (window.navigator.onLine) {
    if (!transSettings) {
      transSettings = await txnSettings.getTransactionData();
    }
    data.multiDeviceBillingSupport = transSettings.multiDeviceBillingSupport;

    isOnline = true;
  } else {
    if (!multiDeviceSettings) {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
    }
    data.prefix = localStorage.getItem('deviceName');
    data.subPrefix = '';
    isOnline = false;
  }

  return await sequence.getFinalSequenceNumber(
    data,
    sequenceType,
    date,
    id,
    txnSettings,
    multiDeviceSettings,
    isOnline
  );
};
