import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';
import axios from 'axios';

export const getTransactionData = async () => {
  const db = await Db.get();

  let transaction = {
    sales: {},
    salesReturn: {},
    paymentIn: {},
    paymentOut: {},
    salesQuotation: {},
    approval: {},
    jobWorkOrderIn: {},
    jobWorkOrderOut: {},
    workOrderReceipt: {},
    purchaseOrder: {},
    deliveryChallan: {},
    saleOrder: {},
    manufacture: {},
    expense: {},
    stock: {},
    tallyReceipt: {},
    scheme: {},
    tallyPayment: {}
  };

  const businessData = await Bd.getBusinessData();

  const query = db.transactionsettings.findOne({
    selector: {
      businessId: { $eq: businessData.businessId }
    }
  });

  await query
    .exec()
    .then((data) => {
      if (!data) {
        return transaction;
      } else {
        transaction.onlineOrderAccept = data.onlineOrderAccept;
        transaction.enablePasscodeForDelete = data.enablePasscodeForDelete;
        transaction.saleMoreThanStock = data.saleMoreThanStock;
        transaction.passcode = data.passcode;
        transaction.userId = data.userId;
        transaction.businessId = data.businessId;
        transaction.businessCity = data.businessCity;
        transaction.updatedAt = data.updatedAt;
        transaction.enableEwayBillNo = data.enableEwayBillNo;
        transaction.multiDeviceBillingSupport = data.multiDeviceBillingSupport;
        transaction.autoPushEInvoice = data.autoPushEInvoice;
        transaction.enableEway = data.enableEway;
        transaction.enableEinvoice = data.enableEinvoice;
        transaction.enableCustomer = data.enableCustomer;
        transaction.enableVendor = data.enableVendor;
        transaction.roundingConfiguration = data.roundingConfiguration;
        transaction.resetSequenceNo = data.resetSequenceNo;

        transaction.sales.prefixesList = data.sales.prefixesList;
        transaction.sales.prefixes = data.sales.prefixes;
        transaction.sales.subPrefixes = data.sales.subPrefixes;
        transaction.sales.subPrefixesList = data.sales.subPrefixesList;
        transaction.sales.appendYear = data.sales.appendYear;
        transaction.sales.prefixSequence = data.sales.prefixSequence;
        transaction.sales.noPrefixSequenceNo = data.noPrefixSequenceNo;

        transaction.salesReturn.prefixesList = data.salesReturn.prefixesList;
        transaction.salesReturn.prefixes = data.salesReturn.prefixes;
        transaction.salesReturn.subPrefixes = data.salesReturn.subPrefixes;
        transaction.salesReturn.subPrefixesList =
          data.salesReturn.subPrefixesList;
        transaction.salesReturn.appendYear = data.salesReturn.appendYear;
        transaction.salesReturn.prefixSequence =
          data.salesReturn.prefixSequence;
        transaction.salesReturn.noPrefixSequenceNo = data.noPrefixSequenceNo;

        transaction.paymentIn.prefixesList = data.paymentIn.prefixesList;
        transaction.paymentIn.prefixes = data.paymentIn.prefixes;
        transaction.paymentIn.subPrefixes = data.paymentIn.subPrefixes;
        transaction.paymentIn.subPrefixesList = data.paymentIn.subPrefixesList;
        transaction.paymentIn.appendYear = data.paymentIn.appendYear;
        transaction.paymentIn.prefixSequence = data.paymentIn.prefixSequence;
        transaction.paymentIn.noPrefixSequenceNo = data.noPrefixSequenceNo;

        transaction.paymentOut.prefixesList = data.paymentOut.prefixesList;
        transaction.paymentOut.prefixes = data.paymentOut.prefixes;
        transaction.paymentOut.subPrefixes = data.paymentOut.subPrefixes;
        transaction.paymentOut.subPrefixesList =
          data.paymentOut.subPrefixesList;
        transaction.paymentOut.appendYear = data.paymentOut.appendYear;
        transaction.paymentOut.prefixSequence = data.paymentOut.prefixSequence;
        transaction.paymentOut.noPrefixSequenceNo = data.noPrefixSequenceNo;

        transaction.salesQuotation.prefixesList =
          data.salesQuotation.prefixesList;
        transaction.salesQuotation.prefixes = data.salesQuotation.prefixes;
        transaction.salesQuotation.subPrefixes =
          data.salesQuotation.subPrefixes;
        transaction.salesQuotation.subPrefixesList =
          data.salesQuotation.subPrefixesList;
        transaction.salesQuotation.appendYear = data.salesQuotation.appendYear;
        transaction.salesQuotation.prefixSequence =
          data.salesQuotation.prefixSequence;

        transaction.approval.prefixesList = data.approval.prefixesList;
        transaction.approval.prefixes = data.approval.prefixes;
        transaction.approval.subPrefixes = data.approval.subPrefixes;
        transaction.approval.subPrefixesList = data.approval.subPrefixesList;
        transaction.approval.appendYear = data.approval.appendYear;
        transaction.approval.prefixSequence = data.approval.prefixSequence;

        transaction.jobWorkOrderIn.prefixesList =
          data.jobWorkOrderIn.prefixesList;
        transaction.jobWorkOrderIn.prefixes = data.jobWorkOrderIn.prefixes;
        transaction.jobWorkOrderIn.subPrefixes =
          data.jobWorkOrderIn.subPrefixes;
        transaction.jobWorkOrderIn.subPrefixesList =
          data.jobWorkOrderIn.subPrefixesList;
        transaction.jobWorkOrderIn.appendYear = data.jobWorkOrderIn.appendYear;
        transaction.jobWorkOrderIn.prefixSequence =
          data.jobWorkOrderIn.prefixSequence;

        transaction.jobWorkOrderOut.prefixesList =
          data.jobWorkOrderOut.prefixesList;
        transaction.jobWorkOrderOut.prefixes = data.jobWorkOrderOut.prefixes;
        transaction.jobWorkOrderOut.subPrefixes =
          data.jobWorkOrderOut.subPrefixes;
        transaction.jobWorkOrderOut.subPrefixesList =
          data.jobWorkOrderOut.subPrefixesList;
        transaction.jobWorkOrderOut.appendYear =
          data.jobWorkOrderOut.appendYear;
        transaction.jobWorkOrderOut.prefixSequence =
          data.jobWorkOrderOut.prefixSequence;

        transaction.workOrderReceipt.prefixesList =
          data.workOrderReceipt.prefixesList;
        transaction.workOrderReceipt.prefixes = data.workOrderReceipt.prefixes;
        transaction.workOrderReceipt.subPrefixes =
          data.workOrderReceipt.subPrefixes;
        transaction.workOrderReceipt.subPrefixesList =
          data.workOrderReceipt.subPrefixesList;
        transaction.workOrderReceipt.appendYear =
          data.workOrderReceipt.appendYear;
        transaction.workOrderReceipt.prefixSequence =
          data.workOrderReceipt.prefixSequence;

        transaction.purchaseOrder.prefixesList =
          data.purchaseOrder.prefixesList;
        transaction.purchaseOrder.prefixes = data.purchaseOrder.prefixes;
        transaction.purchaseOrder.subPrefixes = data.purchaseOrder.subPrefixes;
        transaction.purchaseOrder.subPrefixesList =
          data.purchaseOrder.subPrefixesList;
        transaction.purchaseOrder.appendYear = data.purchaseOrder.appendYear;
        transaction.purchaseOrder.prefixSequence =
          data.purchaseOrder.prefixSequence;

        transaction.deliveryChallan.prefixesList =
          data.deliveryChallan.prefixesList;
        transaction.deliveryChallan.prefixes = data.deliveryChallan.prefixes;
        transaction.deliveryChallan.subPrefixes =
          data.deliveryChallan.subPrefixes;
        transaction.deliveryChallan.subPrefixesList =
          data.deliveryChallan.subPrefixesList;
        transaction.deliveryChallan.appendYear =
          data.deliveryChallan.appendYear;
        transaction.deliveryChallan.prefixSequence =
          data.deliveryChallan.prefixSequence;

        transaction.saleOrder.prefixesList = data.saleOrder.prefixesList;
        transaction.saleOrder.prefixes = data.saleOrder.prefixes;
        transaction.saleOrder.subPrefixes = data.saleOrder.subPrefixes;
        transaction.saleOrder.subPrefixesList = data.saleOrder.subPrefixesList;
        transaction.saleOrder.appendYear = data.saleOrder.appendYear;
        transaction.saleOrder.prefixSequence = data.saleOrder.prefixSequence;

        transaction.manufacture.prefixesList = data.manufacture.prefixesList;
        transaction.manufacture.prefixes = data.manufacture.prefixes;
        transaction.manufacture.subPrefixes = data.manufacture.subPrefixes;
        transaction.manufacture.subPrefixesList =
          data.manufacture.subPrefixesList;
        transaction.manufacture.appendYear = data.manufacture.appendYear;
        transaction.manufacture.prefixSequence =
          data.manufacture.prefixSequence;

        transaction.expense.prefixesList = data.expense.prefixesList;
        transaction.expense.prefixes = data.expense.prefixes;
        transaction.expense.subPrefixes = data.expense.subPrefixes;
        transaction.expense.subPrefixesList = data.expense.subPrefixesList;
        transaction.expense.appendYear = data.expense.appendYear;
        transaction.expense.prefixSequence = data.expense.prefixSequence;

        transaction.stock.prefixesList = data.stock.prefixesList;
        transaction.stock.prefixes = data.stock.prefixes;
        transaction.stock.subPrefixes = data.stock.subPrefixes;
        transaction.stock.subPrefixesList = data.stock.subPrefixesList;
        transaction.stock.appendYear = data.stock.appendYear;
        transaction.stock.prefixSequence = data.stock.prefixSequence;

        transaction.tallyReceipt.prefixesList = data.tallyReceipt.prefixesList;
        transaction.tallyReceipt.prefixes = data.tallyReceipt.prefixes;
        transaction.tallyReceipt.subPrefixes = data.tallyReceipt.subPrefixes;
        transaction.tallyReceipt.subPrefixesList =
          data.tallyReceipt.subPrefixesList;
        transaction.tallyReceipt.appendYear = data.tallyReceipt.appendYear;
        transaction.tallyReceipt.prefixSequence =
          data.tallyReceipt.prefixSequence;

        transaction.scheme.prefixesList = data.scheme.prefixesList;
        transaction.scheme.prefixes = data.scheme.prefixes;
        transaction.scheme.subPrefixes = data.scheme.subPrefixes;
        transaction.scheme.subPrefixesList = data.scheme.subPrefixesList;
        transaction.scheme.appendYear = data.scheme.appendYear;
        transaction.scheme.prefixSequence = data.scheme.prefixSequence;

        transaction.tallyPayment.prefixesList = data.tallyPayment.prefixesList;
        transaction.tallyPayment.prefixes = data.tallyPayment.prefixes;
        transaction.tallyPayment.subPrefixes = data.tallyPayment.subPrefixes;
        transaction.tallyPayment.subPrefixesList =
          data.tallyPayment.subPrefixesList;
        transaction.tallyPayment.appendYear = data.tallyPayment.appendYear;
        transaction.tallyPayment.prefixSequence =
          data.tallyPayment.prefixSequence;
      }
    })
    .catch((err) => {
      console.log('this.transaction:: Internal Server Error', err);
    });

  return transaction;
};

export const getSalesTransSettingdetails = async () => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let salesTransSettingData = {};

  await db.saletransactionsettings
    .findOne({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    })
    .exec()
    .then((data) => {
      if (!data) {
        return;
      }

      if (data) {
        salesTransSettingData = data.toJSON();
      }
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });

  return salesTransSettingData;
};

export const updateMultiDeviceSettingDetails = async (deviceName) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let isDeviceNameExists = false;

  const businessId = businessData.businessId;
  const API_SERVER = window.REACT_APP_API_SERVER;

  await axios
    .get(API_SERVER + '/v1/pos/settings/multidevice/deviceExists', {
      params: {
        businessId: businessId,
        deviceName: deviceName
      }
    })
    .then(async (response) => {
      if (response) {
        if (response.data === true) {
          isDeviceNameExists = true;
        }
      }
    })
    .catch((err) => {
      throw err;
    });

  if (isDeviceNameExists) {
    return;
  }

  let multiDeviceSettingsData = {
    sales: {},
    salesReturn: {},
    paymentIn: {},
    paymentOut: {},
    salesQuotation: {},
    approval: {},
    jobWorkOrderIn: {},
    jobWorkOrderOut: {},
    workOrderReceipt: {},
    purchaseOrder: {},
    deliveryChallan: {},
    saleOrder: {},
    manufacture: {},
    expense: {},
    stock: {},
    tallyReceipt: {},
    scheme: {},
    tallyPayment: {}
  };

  multiDeviceSettingsData.businessId = businessData.businessId;
  multiDeviceSettingsData.businessCity = businessData.businessCity;
  multiDeviceSettingsData.deviceName = deviceName;
  multiDeviceSettingsData.billOnlyOnline = true;
  multiDeviceSettingsData.autoInjectLocalDeviceNo = false;
  multiDeviceSettingsData.showLocalDeviceNoPopUpBeforeInject = false;

  let salesPrefixSequenceList = [];
  let salesSequenceObj = {};
  salesSequenceObj.prefix = deviceName;
  salesSequenceObj.sequenceNumber = 1;
  salesPrefixSequenceList.push(salesSequenceObj);
  multiDeviceSettingsData.sales.prefixSequence = salesPrefixSequenceList;

  let salesReturnPrefixSequenceList = [];
  let salesReturnSequenceObj = {};
  salesReturnSequenceObj.prefix = deviceName;
  salesReturnSequenceObj.sequenceNumber = 1;
  salesReturnPrefixSequenceList.push(salesReturnSequenceObj);
  multiDeviceSettingsData.salesReturn.prefixSequence =
    salesReturnPrefixSequenceList;

  let paymentInPrefixSequenceList = [];
  let paymentInSequenceObj = {};
  paymentInSequenceObj.prefix = deviceName;
  paymentInSequenceObj.sequenceNumber = 1;
  paymentInPrefixSequenceList.push(paymentInSequenceObj);
  multiDeviceSettingsData.paymentIn.prefixSequence =
    paymentInPrefixSequenceList;

  let paymentOutPrefixSequenceList = [];
  let paymentOutSequenceObj = {};
  paymentOutSequenceObj.prefix = deviceName;
  paymentOutSequenceObj.sequenceNumber = 1;
  paymentOutPrefixSequenceList.push(paymentOutSequenceObj);
  multiDeviceSettingsData.paymentOut.prefixSequence =
    paymentOutPrefixSequenceList;

  let salesQuotationPrefixSequenceList = [];
  let salesQuotationSequenceObj = {};
  salesQuotationSequenceObj.prefix = deviceName;
  salesQuotationSequenceObj.sequenceNumber = 1;
  salesQuotationPrefixSequenceList.push(salesQuotationSequenceObj);
  multiDeviceSettingsData.salesQuotation.prefixSequence =
    salesQuotationPrefixSequenceList;

  let approvalPrefixSequenceList = [];
  let approvalSequenceObj = {};
  approvalSequenceObj.prefix = deviceName;
  approvalSequenceObj.sequenceNumber = 1;
  approvalPrefixSequenceList.push(approvalSequenceObj);
  multiDeviceSettingsData.approval.prefixSequence = approvalPrefixSequenceList;

  let jobWorkOrderInPrefixSequenceList = [];
  let jobWorkOrderInSequenceObj = {};
  jobWorkOrderInSequenceObj.prefix = deviceName;
  jobWorkOrderInSequenceObj.sequenceNumber = 1;
  jobWorkOrderInPrefixSequenceList.push(jobWorkOrderInSequenceObj);
  multiDeviceSettingsData.jobWorkOrderIn.prefixSequence =
    jobWorkOrderInPrefixSequenceList;

  let jobWorkOrderOutPrefixSequenceList = [];
  let jobWorkOrderOutSequenceObj = {};
  jobWorkOrderOutSequenceObj.prefix = deviceName;
  jobWorkOrderOutSequenceObj.sequenceNumber = 1;
  jobWorkOrderOutPrefixSequenceList.push(jobWorkOrderOutSequenceObj);
  multiDeviceSettingsData.jobWorkOrderOut.prefixSequence =
    jobWorkOrderOutPrefixSequenceList;

  let workOrderReceiptPrefixSequenceList = [];
  let workOrderReceiptSequenceObj = {};
  workOrderReceiptSequenceObj.prefix = deviceName;
  workOrderReceiptSequenceObj.sequenceNumber = 1;
  workOrderReceiptPrefixSequenceList.push(workOrderReceiptSequenceObj);
  multiDeviceSettingsData.workOrderReceipt.prefixSequence =
    workOrderReceiptPrefixSequenceList;

  let deliveryChallanPrefixSequenceList = [];
  let deliveryChallanSequenceObj = {};
  deliveryChallanSequenceObj.prefix = deviceName;
  deliveryChallanSequenceObj.sequenceNumber = 1;
  deliveryChallanPrefixSequenceList.push(deliveryChallanSequenceObj);
  multiDeviceSettingsData.deliveryChallan.prefixSequence =
    deliveryChallanPrefixSequenceList;

  let purchaseOrderPrefixSequenceList = [];
  let purchaseOrderSequenceObj = {};
  purchaseOrderSequenceObj.prefix = deviceName;
  purchaseOrderSequenceObj.sequenceNumber = 1;
  purchaseOrderPrefixSequenceList.push(purchaseOrderSequenceObj);

  multiDeviceSettingsData.purchaseOrder.prefixSequence =
    purchaseOrderPrefixSequenceList;

  let saleOrderPrefixSequenceList = [];
  let saleOrderSequenceObj = {};
  saleOrderSequenceObj.prefix = deviceName;
  saleOrderSequenceObj.sequenceNumber = 1;
  saleOrderPrefixSequenceList.push(saleOrderSequenceObj);
  multiDeviceSettingsData.saleOrder.prefixSequence =
    saleOrderPrefixSequenceList;

  let manufacturePrefixSequenceList = [];
  let manufactureSequenceObj = {};
  manufactureSequenceObj.prefix = deviceName;
  manufactureSequenceObj.sequenceNumber = 1;
  manufacturePrefixSequenceList.push(manufactureSequenceObj);
  multiDeviceSettingsData.manufacture.prefixSequence =
    manufacturePrefixSequenceList;

  let expensePrefixSequenceList = [];
  let expenseSequenceObj = {};
  expenseSequenceObj.prefix = deviceName;
  expenseSequenceObj.sequenceNumber = 1;
  expensePrefixSequenceList.push(expenseSequenceObj);
  multiDeviceSettingsData.expense.prefixSequence = expensePrefixSequenceList;

  let stockPrefixSequenceList = [];
  let stockSequenceObj = {};
  stockSequenceObj.prefix = deviceName;
  stockSequenceObj.sequenceNumber = 1;
  stockPrefixSequenceList.push(stockSequenceObj);
  multiDeviceSettingsData.stock.prefixSequence = stockPrefixSequenceList;

  let tallyPrefixPrefixSequenceList = [];
  let tallyPrefixSequenceObj = {};
  tallyPrefixSequenceObj.prefix = deviceName;
  tallyPrefixSequenceObj.sequenceNumber = 1;
  tallyPrefixPrefixSequenceList.push(tallyPrefixSequenceObj);
  multiDeviceSettingsData.tallyReceipt.prefixSequence =
    tallyPrefixPrefixSequenceList;

  let schemePrefixPrefixSequenceList = [];
  let schemePrefixSequenceObj = {};
  schemePrefixSequenceObj.prefix = deviceName;
  schemePrefixSequenceObj.sequenceNumber = 1;
  schemePrefixPrefixSequenceList.push(schemePrefixSequenceObj);
  multiDeviceSettingsData.scheme.prefixSequence =
    schemePrefixPrefixSequenceList;

  let tallyPaymentPrefixSequenceList = [];
  let tallyPaymentPrefixSequenceObj = {};
  tallyPaymentPrefixSequenceObj.prefix = deviceName;
  tallyPaymentPrefixSequenceObj.sequenceNumber = 1;
  tallyPaymentPrefixSequenceList.push(tallyPaymentPrefixSequenceObj);
  multiDeviceSettingsData.tallyPayment.prefixSequence =
    tallyPaymentPrefixSequenceList;

  const InsertDoc = multiDeviceSettingsData;
  InsertDoc.posId = parseFloat(businessData.posDeviceId) || 1;
  InsertDoc.updatedAt = Date.now();

  const appId = parseFloat(businessData.posDeviceId) || 1;
  const timestamp = Math.floor(Date.now() / 60000);
  const id = _uniqueId('d');

  InsertDoc.deviceId = `${id}${appId}${timestamp}`;

  await db.multidevicesettings
    .insert(InsertDoc)
    .then((data) => {
      console.log('multi device data Inserted: ', data);
    })
    .catch((err) => {
      console.log('data insertion Failed::', err);
    });
};

export const getMultiDeviceTransactionData = async () => {
  const db = await Db.get();

  let transaction = {
    sales: {},
    salesReturn: {},
    paymentIn: {},
    paymentOut: {},
    salesQuotation: {},
    approval: {},
    jobWorkOrderIn: {},
    jobWorkOrderOut: {},
    workOrderReceipt: {},
    purchaseOrder: {},
    deliveryChallan: {},
    saleOrder: {},
    manufacture: {},
    expense: {},
    stock: {},
    tallyReceipt: {},
    scheme: {},
    tallyPayment: {}
  };

  const businessData = await Bd.getBusinessData();

  const query = db.multidevicesettings.findOne({
    selector: {
      businessId: { $eq: businessData.businessId },
      deviceName: { $eq: localStorage.getItem('deviceName') }
    }
  });

  await query
    .exec()
    .then((data) => {
      if (!data) {
        return transaction;
      } else {
        transaction.businessId = data.businessId;
        transaction.businessCity = data.businessCity;
        transaction.updatedAt = data.updatedAt;
        transaction.posId = parseFloat(businessData.posDeviceId);
        transaction.deviceId = data.deviceId;

        transaction.billOnlyOnline = data.billOnlyOnline;
        transaction.autoInjectLocalDeviceNo = data.autoInjectLocalDeviceNo;
        transaction.showLocalDeviceNoPopUpBeforeInject =
          data.showLocalDeviceNoPopUpBeforeInject;

        transaction.sales.prefixesList = data.sales.prefixesList;
        transaction.sales.prefixes = data.sales.prefixes;
        transaction.sales.subPrefixes = data.sales.subPrefixes;
        transaction.sales.subPrefixesList = data.sales.subPrefixesList;
        transaction.sales.appendYear = data.sales.appendYear;
        transaction.sales.prefixSequence = data.sales.prefixSequence;
        transaction.sales.noPrefixSequenceNo = data.noPrefixSequenceNo;

        transaction.salesReturn.prefixesList = data.salesReturn.prefixesList;
        transaction.salesReturn.prefixes = data.salesReturn.prefixes;
        transaction.salesReturn.subPrefixes = data.salesReturn.subPrefixes;
        transaction.salesReturn.subPrefixesList =
          data.salesReturn.subPrefixesList;
        transaction.salesReturn.appendYear = data.salesReturn.appendYear;
        transaction.salesReturn.prefixSequence =
          data.salesReturn.prefixSequence;
        transaction.salesReturn.noPrefixSequenceNo = data.noPrefixSequenceNo;

        transaction.paymentIn.prefixesList = data.paymentIn.prefixesList;
        transaction.paymentIn.prefixes = data.paymentIn.prefixes;
        transaction.paymentIn.subPrefixes = data.paymentIn.subPrefixes;
        transaction.paymentIn.subPrefixesList = data.paymentIn.subPrefixesList;
        transaction.paymentIn.appendYear = data.paymentIn.appendYear;
        transaction.paymentIn.prefixSequence = data.paymentIn.prefixSequence;
        transaction.paymentIn.noPrefixSequenceNo = data.noPrefixSequenceNo;

        transaction.paymentOut.prefixesList = data.paymentOut.prefixesList;
        transaction.paymentOut.prefixes = data.paymentOut.prefixes;
        transaction.paymentOut.subPrefixes = data.paymentOut.subPrefixes;
        transaction.paymentOut.subPrefixesList =
          data.paymentOut.subPrefixesList;
        transaction.paymentOut.appendYear = data.paymentOut.appendYear;
        transaction.paymentOut.prefixSequence = data.paymentOut.prefixSequence;
        transaction.paymentOut.noPrefixSequenceNo = data.noPrefixSequenceNo;

        transaction.salesQuotation.prefixesList =
          data.salesQuotation.prefixesList;
        transaction.salesQuotation.prefixes = data.salesQuotation.prefixes;
        transaction.salesQuotation.subPrefixes =
          data.salesQuotation.subPrefixes;
        transaction.salesQuotation.subPrefixesList =
          data.salesQuotation.subPrefixesList;
        transaction.salesQuotation.appendYear = data.salesQuotation.appendYear;
        transaction.salesQuotation.prefixSequence =
          data.salesQuotation.prefixSequence;

        transaction.approval.prefixesList = data.approval.prefixesList;
        transaction.approval.prefixes = data.approval.prefixes;
        transaction.approval.subPrefixes = data.approval.subPrefixes;
        transaction.approval.subPrefixesList = data.approval.subPrefixesList;
        transaction.approval.appendYear = data.approval.appendYear;
        transaction.approval.prefixSequence = data.approval.prefixSequence;

        transaction.jobWorkOrderIn.prefixesList =
          data.jobWorkOrderIn.prefixesList;
        transaction.jobWorkOrderIn.prefixes = data.jobWorkOrderIn.prefixes;
        transaction.jobWorkOrderIn.subPrefixes =
          data.jobWorkOrderIn.subPrefixes;
        transaction.jobWorkOrderIn.subPrefixesList =
          data.jobWorkOrderIn.subPrefixesList;
        transaction.jobWorkOrderIn.appendYear = data.jobWorkOrderIn.appendYear;
        transaction.jobWorkOrderIn.prefixSequence =
          data.jobWorkOrderIn.prefixSequence;

        transaction.jobWorkOrderOut.prefixesList =
          data.jobWorkOrderOut.prefixesList;
        transaction.jobWorkOrderOut.prefixes = data.jobWorkOrderOut.prefixes;
        transaction.jobWorkOrderOut.subPrefixes =
          data.jobWorkOrderOut.subPrefixes;
        transaction.jobWorkOrderOut.subPrefixesList =
          data.jobWorkOrderOut.subPrefixesList;
        transaction.jobWorkOrderOut.appendYear =
          data.jobWorkOrderOut.appendYear;
        transaction.jobWorkOrderOut.prefixSequence =
          data.jobWorkOrderOut.prefixSequence;

        transaction.workOrderReceipt.prefixesList =
          data.workOrderReceipt.prefixesList;
        transaction.workOrderReceipt.prefixes = data.workOrderReceipt.prefixes;
        transaction.workOrderReceipt.subPrefixes =
          data.workOrderReceipt.subPrefixes;
        transaction.workOrderReceipt.subPrefixesList =
          data.workOrderReceipt.subPrefixesList;
        transaction.workOrderReceipt.appendYear =
          data.workOrderReceipt.appendYear;
        transaction.workOrderReceipt.prefixSequence =
          data.workOrderReceipt.prefixSequence;

        transaction.purchaseOrder.prefixesList =
          data.purchaseOrder.prefixesList;
        transaction.purchaseOrder.prefixes = data.purchaseOrder.prefixes;
        transaction.purchaseOrder.subPrefixes = data.purchaseOrder.subPrefixes;
        transaction.purchaseOrder.subPrefixesList =
          data.purchaseOrder.subPrefixesList;
        transaction.purchaseOrder.appendYear = data.purchaseOrder.appendYear;
        transaction.purchaseOrder.prefixSequence =
          data.purchaseOrder.prefixSequence;

        transaction.deliveryChallan.prefixesList =
          data.deliveryChallan.prefixesList;
        transaction.deliveryChallan.prefixes = data.deliveryChallan.prefixes;
        transaction.deliveryChallan.subPrefixes =
          data.deliveryChallan.subPrefixes;
        transaction.deliveryChallan.subPrefixesList =
          data.deliveryChallan.subPrefixesList;
        transaction.deliveryChallan.appendYear =
          data.deliveryChallan.appendYear;
        transaction.deliveryChallan.prefixSequence =
          data.deliveryChallan.prefixSequence;

        transaction.saleOrder.prefixesList = data.saleOrder.prefixesList;
        transaction.saleOrder.prefixes = data.saleOrder.prefixes;
        transaction.saleOrder.subPrefixes = data.saleOrder.subPrefixes;
        transaction.saleOrder.subPrefixesList = data.saleOrder.subPrefixesList;
        transaction.saleOrder.appendYear = data.saleOrder.appendYear;
        transaction.saleOrder.prefixSequence = data.saleOrder.prefixSequence;

        transaction.manufacture.prefixesList = data.manufacture.prefixesList;
        transaction.manufacture.prefixes = data.manufacture.prefixes;
        transaction.manufacture.subPrefixes = data.manufacture.subPrefixes;
        transaction.manufacture.subPrefixesList =
          data.manufacture.subPrefixesList;
        transaction.manufacture.appendYear = data.manufacture.appendYear;
        transaction.manufacture.prefixSequence =
          data.manufacture.prefixSequence;

        transaction.expense.prefixesList = data.expense.prefixesList;
        transaction.expense.prefixes = data.expense.prefixes;
        transaction.expense.subPrefixes = data.expense.subPrefixes;
        transaction.expense.subPrefixesList = data.expense.subPrefixesList;
        transaction.expense.appendYear = data.expense.appendYear;
        transaction.expense.prefixSequence = data.expense.prefixSequence;

        transaction.stock.prefixesList = data.stock.prefixesList;
        transaction.stock.prefixes = data.stock.prefixes;
        transaction.stock.subPrefixes = data.stock.subPrefixes;
        transaction.stock.subPrefixesList = data.stock.subPrefixesList;
        transaction.stock.appendYear = data.stock.appendYear;
        transaction.stock.prefixSequence = data.stock.prefixSequence;

        transaction.tallyReceipt.prefixesList = data.tallyReceipt.prefixesList;
        transaction.tallyReceipt.prefixes = data.tallyReceipt.prefixes;
        transaction.tallyReceipt.subPrefixes = data.tallyReceipt.subPrefixes;
        transaction.tallyReceipt.subPrefixesList =
          data.tallyReceipt.subPrefixesList;
        transaction.tallyReceipt.appendYear = data.tallyReceipt.appendYear;
        transaction.tallyReceipt.prefixSequence =
          data.tallyReceipt.prefixSequence;

        transaction.scheme.prefixesList = data.scheme.prefixesList;
        transaction.scheme.prefixes = data.scheme.prefixes;
        transaction.scheme.subPrefixes = data.scheme.subPrefixes;
        transaction.scheme.subPrefixesList = data.scheme.subPrefixesList;
        transaction.scheme.appendYear = data.scheme.appendYear;
        transaction.scheme.prefixSequence = data.scheme.prefixSequence;

        transaction.tallyPayment.prefixesList = data.tallyPayment.prefixesList;
        transaction.tallyPayment.prefixes = data.tallyPayment.prefixes;
        transaction.tallyPayment.subPrefixes = data.tallyPayment.subPrefixes;
        transaction.tallyPayment.subPrefixesList =
          data.tallyPayment.subPrefixesList;
        transaction.tallyPayment.appendYear = data.tallyPayment.appendYear;
        transaction.tallyPayment.prefixSequence =
          data.tallyPayment.prefixSequence;
      }
    })
    .catch((err) => {
      console.log('this.transaction:: Internal Server Error', err);
    });

  return transaction;
};