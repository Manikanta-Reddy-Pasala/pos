import { action, makeObservable, runInAction, observable } from 'mobx';
import * as BD from '../../components/SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

class TransactionStore {
  openPrefixesModal = false;
  openBillTypeModal = false;
  openNoPrefixesModal = false;

  transaction = {
    businessId: '',
    businessCity: '',
    saleMoreThanStock: false,
    enablePasscodeForDelete: false,
    onlineOrderAccept: false,
    updatedAt: Date.now(),
    userId: '',
    passcode: '',
    enableEwayBillNo: false,
    enableEWayAmountLimit: 0,
    enableEway: false,
    enableEinvoice: false,
    autoPushEWay: false,
    autoPushEInvoice: false,
    multiDeviceBillingSupport: true,
    resetSequenceNo: false,
    roundingConfiguration: 'Nearest 50',
    enableCustomer: true,
    enableVendor: true,
    purchasePriceCode: '',
    sales: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: [],
      noPrefixSequenceNo: 0
    },
    salesReturn: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: [],
      noPrefixSequenceNo: 0
    },
    paymentIn: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: [],
      noPrefixSequenceNo: 0
    },
    paymentOut: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: [],
      noPrefixSequenceNo: 0
    },
    billTypes: [],
    salesQuotation: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    approval: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    jobWorkOrderIn: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    jobWorkOrderOut: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    workOrderReceipt: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    deliveryChallan: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    purchaseOrder: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    saleOrder: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    manufacture: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    expense: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    stock: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    tallyReceipt: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    scheme: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    tallyPayment: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    }
  };

  transactionDefault = {
    businessId: '',
    businessCity: '',
    saleMoreThanStock: false,
    enablePasscodeForDelete: false,
    onlineOrderAccept: false,
    updatedAt: Date.now(),
    userId: '',
    passcode: '',
    enableEwayBillNo: false,
    enableEWayAmountLimit: 0,
    enableEway: false,
    enableEinvoice: false,
    autoPushEWay: false,
    autoPushEInvoice: false,
    multiDeviceBillingSupport: true,
    resetSequenceNo: false,
    roundingConfiguration: 'Nearest 50',
    enableCustomer: true,
    enableVendor: true,
    purchasePriceCode: '',
    sales: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    salesReturn: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    paymentIn: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    paymentOut: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    billTypes: [],
    salesQuotation: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    approval: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    jobWorkOrderIn: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    jobWorkOrderOut: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    workOrderReceipt: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    deliveryChallan: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    purchaseOrder: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    saleOrder: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    manufacture: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    expense: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    stock: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    tallyReceipt: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    scheme: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    tallyPayment: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    }
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await BD.getBusinessData();

    runInAction(() => {
      this.transaction.businessId = businessData.businessId;
      this.transaction.businessCity = businessData.businessCity;
      this.transaction.userId = localStorage.getItem('mobileNumber');
    });

    const InsertDoc = this.transaction;

    InsertDoc.posId = parseInt(businessData.posDeviceId);

    InsertDoc.updatedAt = Date.now();

    await db.transactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('this.transaction:: data Inserted');
      })
      .catch((error) => {
        console.log('this.transaction:: data insertion Failed:', error);
      });
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await BD.getBusinessData();

    const query = db.transactionsettings.findOne({
      selector: {
        businessId: { $eq: this.transaction.businessId }
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          await this.saveData();
          return;
        }

        const transactionData = await db.transactionsettings
          .findOne({ selector: { businessId: this.transaction.businessId } })
          .exec();

        const changeData = (oldData) => {
          oldData.enablePasscodeForDelete =
            this.transaction.enablePasscodeForDelete;
          oldData.onlineOrderAccept = this.transaction.onlineOrderAccept;
          oldData.saleMoreThanStock = this.transaction.saleMoreThanStock;
          oldData.passcode = this.transaction.passcode;
          oldData.userId = localStorage.getItem('mobileNumber');
          oldData.businessId = businessData.businessId;
          oldData.businessCity = businessData.businessCity;
          oldData.updatedAt = Date.now();
          oldData.enableEwayBillNo = this.transaction.enableEwayBillNo;
          oldData.enableEWayAmountLimit =
            this.transaction.enableEWayAmountLimit;
          oldData.enableEway = this.transaction.enableEway;
          oldData.enableEinvoice = this.transaction.enableEinvoice;
          oldData.autoPushEWay = this.transaction.autoPushEWay;
          oldData.autoPushEInvoice = this.transaction.autoPushEInvoice;
          oldData.multiDeviceBillingSupport =
            this.transaction.multiDeviceBillingSupport;
          oldData.roundingConfiguration =
            this.transaction.roundingConfiguration;
          oldData.enableCustomer = this.transaction.enableCustomer;
          oldData.enableVendor = this.transaction.enableVendor;
          oldData.purchasePriceCode = this.transaction.purchasePriceCode;
          oldData.sales.prefixesList = this.transaction.sales.prefixesList;
          oldData.sales.prefixes = this.transaction.sales.prefixes;
          oldData.sales.subPrefixes = this.transaction.sales.subPrefixes;
          oldData.sales.subPrefixesList =
            this.transaction.sales.subPrefixesList;
          oldData.sales.prefixSequence = this.transaction.sales.prefixSequence;
          oldData.sales.appendYear = this.transaction.sales.appendYear;
          oldData.sales.noPrefixSequenceNo =
            this.transaction.sales.noPrefixSequenceNo;
          oldData.salesReturn.prefixesList =
            this.transaction.salesReturn.prefixesList;
          oldData.salesReturn.prefixes = this.transaction.salesReturn.prefixes;
          oldData.salesReturn.subPrefixes =
            this.transaction.salesReturn.subPrefixes;
          oldData.salesReturn.subPrefixesList =
            this.transaction.salesReturn.subPrefixesList;
          oldData.salesReturn.appendYear =
            this.transaction.salesReturn.appendYear;
          oldData.salesReturn.prefixSequence =
            this.transaction.salesReturn.prefixSequence;
          oldData.salesReturn.noPrefixSequenceNo =
            this.transaction.salesReturn.noPrefixSequenceNo;
          oldData.paymentIn.prefixesList =
            this.transaction.paymentIn.prefixesList;
          oldData.paymentIn.prefixes = this.transaction.paymentIn.prefixes;
          oldData.paymentIn.subPrefixes =
            this.transaction.paymentIn.subPrefixes;
          oldData.paymentIn.subPrefixesList =
            this.transaction.paymentIn.subPrefixesList;
          oldData.paymentIn.prefixSequence =
            this.transaction.paymentIn.prefixSequence;
          oldData.paymentIn.appendYear = this.transaction.paymentIn.appendYear;
          oldData.paymentIn.noPrefixSequenceNo =
            this.transaction.paymentIn.noPrefixSequenceNo;
          oldData.paymentOut.prefixesList =
            this.transaction.paymentOut.prefixesList;
          oldData.paymentOut.prefixes = this.transaction.paymentOut.prefixes;
          oldData.paymentOut.subPrefixes =
            this.transaction.paymentOut.subPrefixes;
          oldData.paymentOut.subPrefixesList =
            this.transaction.paymentOut.subPrefixesList;
          oldData.paymentOut.prefixSequence =
            this.transaction.paymentOut.prefixSequence;
          oldData.paymentOut.appendYear =
            this.transaction.paymentOut.appendYear;
          oldData.paymentOut.prefixSequence =
            this.transaction.paymentOut.prefixSequence;
          oldData.paymentOut.noPrefixSequenceNo =
            this.transaction.paymentOut.noPrefixSequenceNo;
          oldData.billTypes = this.transaction.billTypes;
          oldData.salesQuotation.prefixSequence =
            this.transaction.salesQuotation.prefixSequence;
          oldData.approval.prefixSequence =
            this.transaction.approval.prefixSequence;
          oldData.jobWorkOrderIn.prefixSequence =
            this.transaction.jobWorkOrderIn.prefixSequence;
          oldData.jobWorkOrderOut.prefixSequence =
            this.transaction.jobWorkOrderOut.prefixSequence;
          oldData.workOrderReceipt.prefixSequence =
            this.transaction.workOrderReceipt.prefixSequence;
          oldData.deliveryChallan.prefixSequence =
            this.transaction.deliveryChallan.prefixSequence;
          oldData.purchaseOrder.prefixSequence =
            this.transaction.purchaseOrder.prefixSequence;
          oldData.saleOrder.prefixSequence =
            this.transaction.saleOrder.prefixSequence;
          oldData.manufacture.prefixSequence =
            this.transaction.manufacture.prefixSequence;
          oldData.expense.prefixSequence =
            this.transaction.expense.prefixSequence;
          oldData.stock.prefixSequence = this.transaction.stock.prefixSequence;
          oldData.tallyReceipt.prefixSequence =
            this.transaction.tallyReceipt.prefixSequence;
          oldData.scheme.prefixSequence =
            this.transaction.scheme.prefixSequence;
          oldData.tallyPayment.prefixSequence =
            this.transaction.tallyPayment.prefixSequence;
          return oldData;
        };

        if (transactionData) {
          await transactionData.atomicUpdate(changeData);
          console.log('this.transaction:: Data Updated');
        }
      })
      .catch((err) => {
        console.log('this.transaction:: Internal Server Error', err);
      });
  };

  getTransactionData = async () => {
    const db = await Db.get();

    await db.transactionsettings
      .findOne({
        selector: {
          businessId: { $eq: localStorage.getItem('businessId') }
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          return;
        } else {
          runInAction(() => {
            this.transaction.onlineOrderAccept = data.onlineOrderAccept;
            this.transaction.enablePasscodeForDelete =
              data.enablePasscodeForDelete;
            this.transaction.saleMoreThanStock = data.saleMoreThanStock;
            this.transaction.passcode = data.passcode;
            this.transaction.userId = data.userId;
            this.transaction.businessId = data.businessId;
            this.transaction.businessCity = data.businessCity;
            this.transaction.updatedAt = data.updatedAt;
            this.transaction.enableEwayBillNo = data.enableEwayBillNo;
            this.transaction.enableEWayAmountLimit = data.enableEWayAmountLimit;
            this.transaction.enableEway = data.enableEway;
            this.transaction.enableEinvoice = data.enableEinvoice;
            this.transaction.autoPushEWay = data.autoPushEWay;
            this.transaction.autoPushEInvoice = data.autoPushEInvoice;
            this.transaction.multiDeviceBillingSupport =
              data.multiDeviceBillingSupport;
            this.transaction.roundingConfiguration = data.roundingConfiguration;
            this.transaction.enableCustomer = data.enableCustomer;
            this.transaction.enableVendor = data.enableVendor;
            this.transaction.purchasePriceCode = data.purchasePriceCode;
            this.transaction.sales.prefixesList = data.sales.prefixesList;
            this.transaction.sales.prefixes = data.sales.prefixes;
            this.transaction.sales.subPrefixes = data.sales.subPrefixes;
            this.transaction.sales.subPrefixesList = data.sales.subPrefixesList;
            this.transaction.sales.appendYear = data.sales.appendYear;
            this.transaction.sales.prefixSequence = data.sales.prefixSequence;
            this.transaction.sales.noPrefixSequenceNo =
              data.sales.noPrefixSequenceNo;
            this.transaction.salesReturn.prefixesList =
              data.salesReturn.prefixesList;
            this.transaction.salesReturn.prefixes = data.salesReturn.prefixes;
            this.transaction.salesReturn.subPrefixes =
              data.salesReturn.subPrefixes;
            this.transaction.salesReturn.subPrefixesList =
              data.salesReturn.subPrefixesList;
            this.transaction.salesReturn.appendYear =
              data.salesReturn.appendYear;
            this.transaction.salesReturn.prefixSequence =
              data.salesReturn.prefixSequence;
            this.transaction.salesReturn.noPrefixSequenceNo =
              data.salesReturn.noPrefixSequenceNo;
            this.transaction.paymentIn.prefixesList =
              data.paymentIn.prefixesList;
            this.transaction.paymentIn.prefixes = data.paymentIn.prefixes;
            this.transaction.paymentIn.subPrefixes = data.paymentIn.subPrefixes;
            this.transaction.paymentIn.subPrefixesList =
              data.paymentIn.subPrefixesList;
            this.transaction.paymentIn.appendYear = data.paymentIn.appendYear;
            this.transaction.paymentIn.prefixSequence =
              data.paymentIn.prefixSequence;
            this.transaction.paymentIn.noPrefixSequenceNo =
              data.paymentIn.noPrefixSequenceNo;

            this.transaction.paymentOut.prefixesList =
              data.paymentOut.prefixesList;
            this.transaction.paymentOut.prefixes = data.paymentOut.prefixes;
            this.transaction.paymentOut.subPrefixes =
              data.paymentOut.subPrefixes;
            this.transaction.paymentOut.subPrefixesList =
              data.paymentOut.subPrefixesList;
            this.transaction.paymentOut.appendYear = data.paymentOut.appendYear;
            this.transaction.paymentOut.prefixSequence =
              data.paymentOut.prefixSequence;
            this.transaction.paymentOut.noPrefixSequenceNo =
              data.paymentOut.noPrefixSequenceNo;
            this.transaction.billTypes = data.billTypes;
            this.transaction.salesQuotation.prefixSequence =
              data.salesQuotation.prefixSequence;
            this.transaction.approval.prefixSequence =
              data.approval.prefixSequence;
            this.transaction.jobWorkOrderIn.prefixSequence =
              data.jobWorkOrderIn.prefixSequence;
            this.transaction.jobWorkOrderOut.prefixSequence =
              data.jobWorkOrderOut.prefixSequence;
            this.transaction.workOrderReceipt.prefixSequence =
              data.workOrderReceipt.prefixSequence;
            this.transaction.deliveryChallan.prefixSequence =
              data.deliveryChallan.prefixSequence;
            this.transaction.purchaseOrder.prefixSequence =
              data.purchaseOrder.prefixSequence;
            this.transaction.saleOrder.prefixSequence =
              data.saleOrder.prefixSequence;
            this.transaction.manufacture.prefixSequence =
              data.manufacture.prefixSequence;
            this.transaction.expense.prefixSequence =
              data.expense.prefixSequence;
            this.transaction.stock.prefixSequence = data.stock.prefixSequence;
            this.transaction.tallyReceipt.prefixSequence =
              data.tallyReceipt.prefixSequence;
            this.transaction.scheme.prefixSequence =
              data.scheme.prefixSequence;
            this.transaction.tallyPayment.prefixSequence =
              data.tallyPayment.prefixSequence;
          });
        }
      })
      .catch((err) => {
        console.log('this.transaction:: Internal Server Error', err);
      });

    return this.transaction;
  };

  resetData = async () => {
    const db = await Db.get();
    const businessData = await BD.getBusinessData();

    const query = db.transactionsettings.findOne({
      selector: {
        businessId: { $eq: this.transaction.businessId }
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        const transactionData = await db.transactionsettings
          .findOne({ selector: { businessId: this.transaction.businessId } })
          .exec();

        const changeData = (oldData) => {
          oldData.enablePasscodeForDelete =
            this.transaction.enablePasscodeForDelete;
          oldData.onlineOrderAccept = this.transaction.onlineOrderAccept;
          oldData.saleMoreThanStock = this.transaction.saleMoreThanStock;
          oldData.passcode = this.transaction.passcode;
          oldData.userId = localStorage.getItem('mobileNumber');
          oldData.businessId = businessData.businessId;
          oldData.businessCity = businessData.businessCity;
          oldData.updatedAt = Date.now();
          oldData.enableEwayBillNo = this.transaction.enableEwayBillNo;
          oldData.enableEWayAmountLimit =
            this.transaction.enableEWayAmountLimit;
          oldData.enableEway = this.transaction.enableEway;
          oldData.enableEinvoice = this.transaction.enableEinvoice;
          oldData.autoPushEWay = this.transaction.autoPushEWay;
          oldData.autoPushEInvoice = this.transaction.autoPushEInvoice;
          oldData.multiDeviceBillingSupport =
            this.transaction.multiDeviceBillingSupport;
          oldData.roundingConfiguration =
            this.transaction.roundingConfiguration;
          oldData.enableCustomer = this.transaction.enableCustomer;
          oldData.enableVendor = this.transaction.enableVendor;
          oldData.purchasePriceCode = this.transaction.purchasePriceCode;

          oldData.billTypes = this.transaction.billTypes;

          oldData.sales.prefixesList = this.transaction.sales.prefixesList;
          oldData.sales.prefixes = this.transaction.sales.prefixes;
          oldData.sales.subPrefixes = this.transaction.sales.subPrefixes;
          oldData.sales.subPrefixesList =
            this.transaction.sales.subPrefixesList;
          oldData.sales.appendYear = this.transaction.sales.appendYear;
          oldData.sales.noPrefixSequenceNo = 1;

          let salesPrefixSequenceList = [];
          if (
            this.transaction.sales.prefixSequence &&
            this.transaction.sales.prefixSequence.length > 0
          ) {
            for (let item of this.transaction.sales.prefixSequence) {
              let sequenceObj = {};
              sequenceObj.prefix = item.prefix;
              sequenceObj.sequenceNumber = 1;
              salesPrefixSequenceList.push(sequenceObj);
            }
          }
          oldData.sales.prefixSequence = salesPrefixSequenceList;

          oldData.salesReturn.prefixesList =
            this.transaction.salesReturn.prefixesList;
          oldData.salesReturn.prefixes = this.transaction.salesReturn.prefixes;
          oldData.salesReturn.subPrefixes =
            this.transaction.salesReturn.subPrefixes;
          oldData.salesReturn.subPrefixesList =
            this.transaction.salesReturn.subPrefixesList;
          oldData.salesReturn.appendYear =
            this.transaction.salesReturn.appendYear;
          oldData.salesReturn.noPrefixSequenceNo = 1;

          let salesReturnPrefixSequenceList = [];
          if (
            this.transaction.salesReturn.prefixSequence &&
            this.transaction.salesReturn.prefixSequence.length > 0
          ) {
            for (let item of this.transaction.salesReturn.prefixSequence) {
              let sequenceObj = {};
              sequenceObj.prefix = item.prefix;
              sequenceObj.sequenceNumber = 1;
              salesReturnPrefixSequenceList.push(sequenceObj);
            }
          }
          oldData.salesReturn.prefixSequence = salesReturnPrefixSequenceList;

          oldData.paymentIn.prefixesList =
            this.transaction.paymentIn.prefixesList;
          oldData.paymentIn.prefixes = this.transaction.paymentIn.prefixes;
          oldData.paymentIn.subPrefixes =
            this.transaction.paymentIn.subPrefixes;
          oldData.paymentIn.subPrefixesList =
            this.transaction.paymentIn.subPrefixesList;
          oldData.paymentIn.appendYear = this.transaction.paymentIn.appendYear;
          oldData.paymentIn.noPrefixSequenceNo = 1;

          let paymentInPrefixSequenceList = [];
          if (
            this.transaction.paymentIn.prefixSequence &&
            this.transaction.paymentIn.prefixSequence.length > 0
          ) {
            for (let item of this.transaction.paymentIn.prefixSequence) {
              let sequenceObj = {};
              sequenceObj.prefix = item.prefix;
              sequenceObj.sequenceNumber = 1;
              paymentInPrefixSequenceList.push(sequenceObj);
            }
          }
          oldData.paymentIn.prefixSequence = paymentInPrefixSequenceList;

          oldData.paymentOut.prefixesList =
            this.transaction.paymentOut.prefixesList;
          oldData.paymentOut.prefixes = this.transaction.paymentOut.prefixes;
          oldData.paymentOut.subPrefixes =
            this.transaction.paymentOut.subPrefixes;
          oldData.paymentOut.subPrefixesList =
            this.transaction.paymentOut.subPrefixesList;
          oldData.paymentOut.prefixSequence =
            this.transaction.paymentOut.prefixSequence;
          oldData.paymentOut.appendYear =
            this.transaction.paymentOut.appendYear;
          oldData.paymentOut.noPrefixSequenceNo = 1;

          let paymentOutPrefixSequenceList = [];

          if (
            this.transaction.paymentOut.prefixSequence &&
            this.transaction.paymentOut.prefixSequence.length > 0
          ) {
            for (let item of this.transaction.paymentOut.prefixSequence) {
              let sequenceObj = {};
              sequenceObj.prefix = item.prefix;
              sequenceObj.sequenceNumber = 1;
              paymentOutPrefixSequenceList.push(sequenceObj);
            }
          }
          oldData.paymentOut.prefixSequence = paymentOutPrefixSequenceList;

          let salesQuotationPrefixSequenceList = [];
          for (let item of this.transaction.salesQuotation.prefixSequence) {
            let salesQuotationSequenceObj = {};
            salesQuotationSequenceObj.prefix = item.prefix;
            salesQuotationSequenceObj.sequenceNumber = 1;
            salesQuotationPrefixSequenceList.push(salesQuotationSequenceObj);
          }
          oldData.salesQuotation.prefixSequence =
            salesQuotationPrefixSequenceList;

          let approvalPrefixSequenceList = [];
          for (let item of this.transaction.approval.prefixSequence) {
            let approvalSequenceObj = {};
            approvalSequenceObj.prefix = item.prefix;
            approvalSequenceObj.sequenceNumber = 1;
            approvalPrefixSequenceList.push(approvalSequenceObj);
          }
          oldData.approval.prefixSequence = approvalPrefixSequenceList;

          let jobWorkOrderInPrefixSequenceList = [];
          for (let item of this.transaction.jobWorkOrderIn.prefixSequence) {
            let jobWorkOrderInSequenceObj = {};
            jobWorkOrderInSequenceObj.prefix = item.prefix;
            jobWorkOrderInSequenceObj.sequenceNumber = 1;
            jobWorkOrderInPrefixSequenceList.push(jobWorkOrderInSequenceObj);
          }
          oldData.jobWorkOrderIn.prefixSequence =
            jobWorkOrderInPrefixSequenceList;

          let jobWorkOrderOutPrefixSequenceList = [];
          for (let item of this.transaction.jobWorkOrderOut.prefixSequence) {
            let jobWorkOrderOutSequenceObj = {};
            jobWorkOrderOutSequenceObj.prefix = item.prefix;
            jobWorkOrderOutSequenceObj.sequenceNumber = 1;
            jobWorkOrderOutPrefixSequenceList.push(jobWorkOrderOutSequenceObj);
          }
          oldData.jobWorkOrderOut.prefixSequence =
            jobWorkOrderOutPrefixSequenceList;

          let workOrderReceiptPrefixSequenceList = [];
          for (let item of this.transaction.workOrderReceipt.prefixSequence) {
            let workOrderReceiptSequenceObj = {};
            workOrderReceiptSequenceObj.prefix = item.prefix;
            workOrderReceiptSequenceObj.sequenceNumber = 1;
            workOrderReceiptPrefixSequenceList.push(
              workOrderReceiptSequenceObj
            );
          }
          oldData.workOrderReceipt.prefixSequence =
            workOrderReceiptPrefixSequenceList;

          let deliveryChallanPrefixSequenceList = [];
          for (let item of this.transaction.deliveryChallan.prefixSequence) {
            let deliveryChallanSequenceObj = {};
            deliveryChallanSequenceObj.prefix = item.prefix;
            deliveryChallanSequenceObj.sequenceNumber = 1;
            deliveryChallanPrefixSequenceList.push(deliveryChallanSequenceObj);
          }
          oldData.deliveryChallan.prefixSequence =
            deliveryChallanPrefixSequenceList;

          let purchaseOrderPrefixSequenceList = [];
          for (let item of this.transaction.purchaseOrder.prefixSequence) {
            let purchaseOrderSequenceObj = {};
            purchaseOrderSequenceObj.prefix = item.prefix;
            purchaseOrderSequenceObj.sequenceNumber = 1;
            purchaseOrderPrefixSequenceList.push(purchaseOrderSequenceObj);
          }
          oldData.purchaseOrder.prefixSequence =
            purchaseOrderPrefixSequenceList;

          let saleOrderPrefixSequenceList = [];
          for (let item of this.transaction.saleOrder.prefixSequence) {
            let saleOrderSequenceObj = {};
            saleOrderSequenceObj.prefix = item.prefix;
            saleOrderSequenceObj.sequenceNumber = 1;
            saleOrderPrefixSequenceList.push(saleOrderSequenceObj);
          }
          oldData.saleOrder.prefixSequence = saleOrderPrefixSequenceList;

          let manufacturePrefixSequenceList = [];
          for (let item of this.transaction.manufacture.prefixSequence) {
            let manufactureSequenceObj = {};
            manufactureSequenceObj.prefix = item.prefix;
            manufactureSequenceObj.sequenceNumber = 1;
            manufacturePrefixSequenceList.push(manufactureSequenceObj);
          }
          oldData.manufacture.prefixSequence = manufacturePrefixSequenceList;

          let expensePrefixSequenceList = [];
          for (let item of this.transaction.expense.prefixSequence) {
            let expenseSequenceObj = {};
            expenseSequenceObj.prefix = item.prefix;
            expenseSequenceObj.sequenceNumber = 1;
            expensePrefixSequenceList.push(expenseSequenceObj);
          }
          oldData.expense.prefixSequence = expensePrefixSequenceList;

          let stockPrefixSequenceList = [];
          for (let item of this.transaction.stock.prefixSequence) {
            let stockSequenceObj = {};
            stockSequenceObj.prefix = item.prefix;
            stockSequenceObj.sequenceNumber = 1;
            stockPrefixSequenceList.push(stockSequenceObj);
          }
          oldData.stock.prefixSequence = stockPrefixSequenceList;

          let tallyPrefixPrefixSequenceList = [];
          for (let item of this.transaction.tallyReceipt.prefixSequence) {
            let tallyPrefixSequenceObj = {};
            tallyPrefixSequenceObj.prefix = item.prefix;
            tallyPrefixSequenceObj.sequenceNumber = 1;
            tallyPrefixPrefixSequenceList.push(tallyPrefixSequenceObj);
          }
          oldData.tallyReceipt.prefixSequence = tallyPrefixPrefixSequenceList;

          let schemePrefixPrefixSequenceList = [];
          for (let item of this.transaction.scheme.prefixSequence) {
            let schemePrefixSequenceObj = {};
            schemePrefixSequenceObj.prefix = item.prefix;
            schemePrefixSequenceObj.sequenceNumber = 1;
            schemePrefixPrefixSequenceList.push(schemePrefixSequenceObj);
          }
          oldData.scheme.prefixSequence = schemePrefixPrefixSequenceList;

          let tallyPaymentPrefixSequenceList = [];
          for (let item of this.transaction.tallyPayment.prefixSequence) {
            let tallyPrefixSequenceObj = {};
            tallyPrefixSequenceObj.prefix = item.prefix;
            tallyPrefixSequenceObj.sequenceNumber = 1;
            tallyPaymentPrefixSequenceList.push(tallyPrefixSequenceObj);
          }
          oldData.tallyPayment.prefixSequence = tallyPaymentPrefixSequenceList;

          oldData.resetSequenceNo = true;

          return oldData;
        };

        if (transactionData) {
          await transactionData.atomicUpdate(changeData);
          console.log('this.transaction:: Data Reset');
        }
      })
      .catch((err) => {
        console.log('this.transaction:: Internal Server Error', err);
      });
  };

  setEnablePasscodeForDelete = async (value) => {
    runInAction(() => {
      this.transaction.enablePasscodeForDelete = value;
    });
    await this.updateData();
  };

  setSaleMoreThanStock = async (value) => {
    runInAction(() => {
      this.transaction.saleMoreThanStock = value;
    });
    await this.updateData();
  };

  setOnlineAlert = async (value) => {
    runInAction(() => {
      this.transaction.onlineOrderAccept = value;
    });
    await this.updateData();
  };

  setEwayBillNo = async (value) => {
    runInAction(() => {
      this.transaction.enableEwayBillNo = value;
    });
    this.updateData();
  };

  setEnableEway = async (value) => {
    runInAction(() => {
      this.transaction.enableEway = value;
    });
    this.updateData();
  };

  setEnableEInvoice = async (value) => {
    runInAction(() => {
      this.transaction.enableEinvoice = value;
    });
    this.updateData();
  };

  setMultiDeviceBillingSupport = async (value) => {
    runInAction(() => {
      this.transaction.multiDeviceBillingSupport = value;
    });
    this.updateData();
  };

  setMultiDeviceBillingSupportFromTransaction = async (value) => {
    runInAction(() => {
      this.transaction.multiDeviceBillingSupport = value;
    });
    await this.updateData();
  };

  setRoundingConfiguration = async (value) => {
    runInAction(() => {
      this.transaction.roundingConfiguration = value;
    });
    this.updateData();
  };

  setEnableCustomer = async (value) => {
    runInAction(() => {
      this.transaction.enableCustomer = value;
    });
    this.updateData();
  };

  setEnableVendor = async (value) => {
    runInAction(() => {
      this.transaction.enableVendor = value;
    });
    this.updateData();
  };

  setAutoPushEWay = async (value) => {
    runInAction(() => {
      this.transaction.autoPushEWay = value;
    });
    this.updateData();
  };

  setAutoPushEInvoice = async (value) => {
    runInAction(() => {
      this.transaction.autoPushEInvoice = value;
    });
    this.updateData();
  };

  setEWayAmount = async (value) => {
    runInAction(() => {
      this.transaction.enableEWayAmountLimit = value;
    });
    this.updateData();
  };

  setPurchasePriceCode = async (value) => {
    runInAction(() => {
      this.transaction.purchasePriceCode = value;
    });
    this.updateData();
  };

  handlePrefixesModalClose = async () => {
    runInAction(() => {
      this.openPrefixesModal = false;
    });
  };

  handlePrefixesModalOpen = async () => {
    runInAction(() => {
      this.openPrefixesModal = true;
    });
  };

  handleNoPrefixesModalClose = async () => {
    runInAction(() => {
      this.openNoPrefixesModal = false;
    });
  };

  handleNoPrefixesModalOpen = async () => {
    runInAction(() => {
      this.openNoPrefixesModal = true;
    });
  };

  handleBillTypeModalClose = async () => {
    runInAction(() => {
      this.openBillTypeModal = false;
    });
  };

  handleBillTypeModalOpen = async () => {
    runInAction(() => {
      this.openBillTypeModal = true;
    });
  };

  savePrefixe = async (property, subProperty, value, seqNoValue) => {
    runInAction(() => {
      let prefixSequence = {};
      prefixSequence.prefix = value;
      prefixSequence.sequenceNumber = seqNoValue === '' ? 1 : seqNoValue;
      this.transaction[property][subProperty].push(prefixSequence);
    });
    this.updateData();
  };

  saveNoPrefix = async (property, seqNoValue) => {
    runInAction(() => {
      let seqNo = seqNoValue === '' ? 1 : seqNoValue;
      this.transaction[property]['noPrefixSequenceNo'] = seqNo;
    });
    this.updateData();
  };

  saveSubPrefix = async (property, subProperty, value) => {
    runInAction(() => {
      this.transaction[property][subProperty].push(value);
    });
    this.updateData();
  };

  saveSinglePrefix = async (property, subProperty, value, seqNoValue) => {
    runInAction(() => {
      this.transaction[property][subProperty] = [];
      let prefixSequence = {};
      prefixSequence.prefix = value;
      prefixSequence.sequenceNumber = seqNoValue === '' ? 1 : seqNoValue;
      this.transaction[property][subProperty].push(prefixSequence);
    });
    this.updateData();
  };

  setTransactionProperty = async (property, subProperty, value) => {
    runInAction(() => {
      this.transaction[property][subProperty] = value;
    });
    this.updateData();
  };

  handleRemovePrefix = async (property, subProperty, index) => {
    runInAction(() => {
      this.transaction[property][subProperty].splice(index, 1);
    });
    this.updateData();
  };

  setBillType = async (value) => {
    runInAction(() => {
      if (!this.transaction.billTypes) {
        this.transaction.billTypes = [];
      }

      this.transaction.billTypes.push(value);
    });
    this.updateData();
  };

  removeBillType = async (index) => {
    runInAction(() => {
      this.transaction.billTypes.splice(index, 1);
    });
    this.updateData();
  };

  constructor() {
    makeObservable(this, {
      getTransactionData: action,
      transaction: observable,

      setEwayBillNo: action,
      setEnableEway: action,
      setEnableEInvoice: action,
      setMultiDeviceBillingSupport: action,
      openPrefixesModal: observable,
      openNoPrefixesModal: observable,
      savePrefixe: action,
      setBillType: action,
      removeBillType: action,
      openBillTypeModal: observable,
      saveSinglePrefix: action,
      saveSubPrefix: action,
      resetData: action
    });
  }
}

// this is to make this component public so that it is assible from other componets
export default new TransactionStore();