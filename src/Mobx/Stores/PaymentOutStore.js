import {
  action,
  observable,
  makeObservable,
  runInAction,
  computed
} from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import _uniqueId from 'lodash/uniqueId';
import * as Bd from '../../components/SelectedBusiness';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import * as dateHelper from '../../components/Helpers/DateHelper';
import * as lp from '../../components/Helpers/LinkPaymentHelper';
import * as balanceUpdate from '../../components/Helpers/CustomerAndVendorBalanceHelper';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

class PaymentOutStore {
  newVendor = false;

  isUpdate = false;

  openPayOutNumModal = false;
  openPayOutSeqNumCheck = false;

  OpenAddPaymentOut = false;
  OpenMakePayment = false;
  makePaymentTxnId = 0;
  makePaymentTxnType = '';

  currentVendorBalance = 0;

  newVendorData = {};

  sequenceData = {};

  isRestore = false;

  paymentDetails = {
    businessId: '',
    businessCity: '',
    date: '',
    receiptNumber: '',
    sequenceNumber: '',
    vendorId: '',
    vendorName: '',
    vendorPhoneNo: '',
    vendorPayable: false,
    paymentType: 'cash',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    balance: '',
    paid: '',
    total: '',
    paymentOut: true,
    linkPayment: false,
    linked_amount: 0,
    linkedTxnList: [],
    updatedAt: Date.now(),
    paymentReferenceNumber: '',
    vendorGSTNo: '',
    vendorGSTType: '',
    vendorCity: '',
    vendorPincode: '',
    vendorAddress: '',
    vendorState: '',
    vendorCountry: '',
    vendorEmailId: '',
    tcsAmount: 0,
    tcsName: '',
    tcsRate: 0,
    tcsCode: '',
    tdsAmount: 0,
    tdsName: '',
    tdsRate: 0,
    tdsCode: '',
    splitPaymentList: [],
    vendorPanNumber: '',
    isSyncedToServer: false,
    calculateStockAndBalance: true
  };

  existingPaymentDetails = {
    businessId: '',
    businessCity: '',
    date: '',
    receiptNumber: '',
    sequenceNumber: '',
    vendorId: '',
    vendorName: '',
    vendorPayable: false,
    paymentType: 'cash',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    balance: '',
    paid: '',
    total: '',
    paymentOut: true,
    linkPayment: false,
    linked_amount: 0,
    linkedTxnList: [],
    updatedAt: Date.now(),
    paymentReferenceNumber: '',
    vendorGSTNo: '',
    vendorGSTType: '',
    vendorCity: '',
    vendorPincode: '',
    vendorAddress: '',
    vendorState: '',
    vendorCountry: '',
    vendorEmailId: '',
    tcsAmount: 0,
    tcsName: '',
    tcsRate: 0,
    tcsCode: '',
    tdsAmount: 0,
    tdsName: '',
    tdsRate: 0,
    tdsCode: '',
    splitPaymentList: [],
    vendorPanNumber: '',
    isSyncedToServer: false,
    calculateStockAndBalance: true
  };

  openLinkpaymentPage = false;

  paymentLinkTransactions = [];

  /**
   * below filed is for saving all 3 tables unliked transactions list
   */
  paymentUnLinkTransactions = [];
  /**
   * only to store un liked related to sale table
   */
  unLinkedTxnList = [];

  isPaymentOutList = false;

  paymentOutInvoiceRegular = {};
  paymentOutInvoiceThermal = {};

  printPaymentOutData = null;

  isSaveAndNew = false;

  printPaymentOutBalance = {};

  manualSequenceNumber = '';
  isSequenceNuberExist = false;

  openPaymentOutLoadingAlertMessage = false;
  openPaymentOutErrorAlertMessage = false;

  openPaymentOutPrintSelectionAlert = false;

  splitPaymentSettingsData = {};
  chosenPaymentType = 'Cash';
  openSplitPaymentDetails = false;
  bankAccountsList = [];
  openMakePaymentSplitPaymentDetails = false;

  sequenceNumberFailureAlert = false;

  handlePaymentOutManuelSeqNumModalOpen = async () => {
    runInAction(() => {
      this.openPayOutNumModal = true;
    });
  };

  handlePaymentOutManuelSeqNumModalClose = async () => {
    runInAction(() => {
      this.openPayOutNumModal = false;
    });
  };

  handlePaymentOutManuelSeqNumCheckClose = async () => {
    runInAction(() => {
      this.openPayOutSeqNumCheck = false;
      this.isSequenceNuberExist = false;
      this.manualSequenceNumber = '';
    });
  };

  handlePaymentOutManuelSeqNumCheckOpen = async () => {
    runInAction(() => {
      this.openPayOutSeqNumCheck = true;
    });
  };

  setPaymentOutSequenceNumber = async (value) => {
    runInAction(() => {
      this.paymentDetails.sequenceNumber = value;
    });
  };

  setPaymentOutManualSequenceNumber = (value) => {
    runInAction(() => {
      this.manualSequenceNumber = value;
    });
  };

  setTCS = (value) => {
    runInAction(() => {
      this.paymentDetails.tcsName = value.name;
      this.paymentDetails.tcsRate = value.rate;
      this.paymentDetails.tcsCode = value.code;
    });
  };

  revertTCS = () => {
    runInAction(() => {
      this.paymentDetails.tcsName = '';
      this.paymentDetails.tcsRate = 0;
      this.paymentDetails.tcsAmount = 0;
      this.paymentDetails.tcsCode = '';
    });
  };

  setTDS = (value) => {
    runInAction(() => {
      this.paymentDetails.tdsName = value.name;
      this.paymentDetails.tdsRate = value.rate;
      this.paymentDetails.tdsCode = value.code;
    });
  };

  revertTDS = () => {
    runInAction(() => {
      this.paymentDetails.tdsName = '';
      this.paymentDetails.tdsRate = 0;
      this.paymentDetails.tdsAmount = 0;
      this.paymentDetails.tdsCode = '';
    });
  };

  checkPaymentOutSequenceNumber = async () => {
    //check id this sequence number exist or not
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.isSequenceNuberExist = false;
    await db.paymentout
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              date: {
                $gte: dateHelper.getFinancialYearStartDateByGivenDate(
                  this.paymentDetails.date
                )
              }
            },
            {
              date: {
                $lte: dateHelper.getFinancialYearEndDateByGivenDate(
                  this.paymentDetails.date
                )
              }
            },
            { sequenceNumber: { $eq: this.manualSequenceNumber } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data && data.sequenceNumber) {
          this.isSequenceNuberExist = true;
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    if (this.isSequenceNuberExist) {
      this.handlePaymentOutManuelSeqNumCheckOpen();
    } else {
      if (!this.isSequenceNuberExist && this.manualSequenceNumber !== '') {
        this.paymentDetails.sequenceNumber = this.manualSequenceNumber;
      }
      this.openPayOutNumModal = false;
      this.isSequenceNuberExist = false;
      this.manualSequenceNumber = '';
    }
  };

  viewOrEditPaymentOutTxnItem = async (item) => {
    this.viewOrEditItem(item);
  };

  getSequenceNumber = async (date, id) => {
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      runInAction(() => {
        this.sequenceData.appendYear = transSettings.paymentOut.appendYear;
        this.sequenceData.multiDeviceBillingSupport =
          transSettings.multiDeviceBillingSupport;
      });
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      runInAction(() => {
        this.sequenceData.prefix = localStorage.getItem('deviceName');
        this.sequenceData.subPrefix = 'PayO';
      });
      isOnline = false;
    }

    this.paymentDetails.sequenceNumber = await sequence.getFinalSequenceNumber(
      this.sequenceData,
      'Payment Out',
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
  };

  setSequencePrefix = (value) => {
    runInAction(() => {
      this.sequenceData.prefix = value;
      this.paymentDetails.prefix = value;
    });
  };

  setSequenceSubPrefix = (value) => {
    runInAction(() => {
      this.sequenceData.subPrefix = value;
      this.paymentDetails.subPrefix = value;
    });
  };

  deletePaymentOutTxnItem = async (item) => {
    if (
      !('calculateStockAndBalance' in item) ||
      !item.calculateStockAndBalance
    ) {
      item.calculateStockAndBalance = true;
    }

    await this.deletePaymentOut(item);
  };

  getPaymentOutCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.paymentout
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        this.isPaymentOutList = data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  generateReceiptNumber = async () => {
    const timestamp = Math.floor(Date.now() / 60000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('po');

    runInAction(() => {
      this.paymentDetails['receiptNumber'] = `${id}${appId}${timestamp}`;
      this.paymentDetails['businessId'] = businessData.businessId;
      this.paymentDetails['businessCity'] = businessData.businessCity;
    });
  };

  setPaymentOutProperty = (property, value) => {
    console.log(property, value);

    this.paymentDetails[property] = value;
  };

  setPaymentOutVendorName = (value) => {
    this.paymentDetails.vendorName = value;
  };

  paidPaymentOpen = async (item) => {
    this.paymentDetails.vendorId = item.vendor_id;
    this.paymentDetails.vendorName = item.vendor_name;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: item.vendor_id }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No vendor is available
          return;
        }
        this.currentVendorBalance = data.balance;
      });
  };

  setpaymentOutVendor = async (vendor, isNewVendor) => {
    this.paymentDetails.vendorId = vendor.id;
    this.paymentDetails.vendorName = vendor.name;
    this.paymentDetails.vendorPhoneNo = vendor.phoneNo;

    this.paymentDetails.vendorGSTNo = vendor.gstNumber;
    this.paymentDetails.vendorGSTType = vendor.gstType;
    this.paymentDetails.vendorCity = vendor.city;
    this.paymentDetails.vendorPincode = vendor.pincode;
    this.paymentDetails.vendorAddress = vendor.address;
    this.paymentDetails.vendorState = vendor.state;
    this.paymentDetails.vendorCountry = vendor.country;
    this.paymentDetails.vendorEmailId = vendor.emailId;
    this.paymentDetails.vendorPanNumber = vendor.panNumber;

    this.currentVendorBalance = vendor.balance;

    /**
     * get all txn which are un paid
     */
    const db = await Db.get();

    await lp.getAllUnPaidTxnForCustomer(this, db, vendor.id, 'Payment Out');

    this.isNewVendor = isNewVendor;
    if (isNewVendor) {
      this.newVendorData = vendor;
    }

    if (vendor.balanceType === 'Payable' && vendor.balance > 0) {
      this.paymentDetails.vendorPayable = true;
    } else {
      this.paymentDetails.vendorPayable = false;
    }
  };

  setPaymentType = (value) => {
    this.paymentDetails.paymentType = value;
  };

  setReceiptNo = (value) => {
    this.paymentDetails.receiptNumber = value;
  };

  setPaymentDate = (value) => {
    this.paymentDetails.date = value;
  };

  setPaid = (value) => {
    this.paymentDetails.paid = value;
    this.paymentDetails.total = value;
  };

  setTotal = (value) => {
    value = this.paymentDetails.paid;
    this.paymentDetails.balance = value;
    return this.paymentDetails.balance;
  };

  reset = () => {
    const currentDate = getTodayDateInYYYYMMDD();

    runInAction(() => {
      this.paymentDetails = {
        businessId: '',
        businessCity: '',
        date: currentDate,
        vendorId: '',
        vendorName: '',
        vendorPayable: false,
        paymentType: 'cash',
        bankAccount: '',
        bankAccountId: '',
        bankPaymentType: '',
        balance: '',
        paid: '',
        total: '',
        paymentOut: true,
        linkPayment: false,
        linked_amount: 0,
        linkedTxnList: [],
        updatedAt: Date.now(),
        paymentReferenceNumber: '',
        vendorGSTNo: '',
        vendorGSTType: '',
        vendorCity: '',
        vendorPincode: '',
        vendorAddress: '',
        vendorState: '',
        vendorCountry: '',
        vendorEmailId: '',
        tcsAmount: 0,
        tcsName: '',
        tcsRate: 0,
        tcsCode: '',
        tdsAmount: 0,
        tdsName: '',
        tdsRate: 0,
        tdsCode: '',
        splitPaymentList: [],
        vendorPanNumber: '',
        isSyncedToServer: false,
        calculateStockAndBalance: true
      };
      this.currentVendorBalance = 0;
      this.sequenceData = {};
    });

    this.generateReceiptNumber();
  };

  viewOrEditItem = async (item) => {
    this.OpenAddPaymentOut = true;
    this.isUpdate = true;
    this.isRestore = false;
    this.paymentDetails = item;
    this.existingPaymentDetails = item;
    if (this.paymentDetails.paymentType === 'Split') {
      this.chosenPaymentType = 'Split';
    } else {
      this.chosenPaymentType = 'Cash';
    }

    if (this.paymentDetails.splitPaymentList === undefined) {
      this.paymentDetails.splitPaymentList = [];
    }

    this.paymentLinkTransactions = [];
    this.paymentUnLinkTransactions = [];

    this.paymentOutInvoiceRegular = {};
    this.paymentOutInvoiceThermal = {};
    this.sequenceData = {};

    /**
     * get vendor balance
     */
    await this.getVendorBalance();

    if (this.paymentDetails.linked_amount > 0) {
      this.paymentDetails.linkPayment = true;
      await lp.getAllLinkedTxnData(this, this.paymentDetails, 'Payment Out');
    }

    const db = await Db.get();
    await lp.getAllUnPaidTxnForCustomer(
      this,
      db,
      this.paymentDetails.vendorId,
      'Payment Out'
    );
  };

  getVendorBalance = async () => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.paymentDetails.vendorId } }
          ]
        }
      })
      .exec()
      .then((data) => {
        this.currentVendorBalance = parseFloat(data.balance);
        if (data.balanceType === 'Receivable' && data.balance > 0) {
          this.paymentDetails.vendorPayable = false;
        } else {
          this.paymentDetails.vendorPayable = true;
        }
        this.paymentDetails.balance = data.balance;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  openForNewPaymentOut = () => {
    runInAction(() => {
      this.isUpdate = false;

      this.OpenAddPaymentOut = true;

      this.paymentOutInvoiceRegular = {};
      this.paymentOutInvoiceThermal = {};
      this.sequenceData = {};
      this.chosenPaymentType = 'Cash';
      this.reset();
      this.generateReceiptNumber();

      this.sequenceData = {};
    });
  };

  closeDialog = () => {
    this.OpenAddPaymentOut = false;
  };

  setcurrentBalance = (vendor) => {
    this.currentVendorBalance = vendor.balance;
  };

  savePaymentData = async (isSaveAndnew, isPrint) => {
    this.isSaveAndNew = isSaveAndnew;

    const linkedAmount = parseFloat(this.paymentDetails.linked_amount) || 0;
    const paidAmount = parseFloat(this.paymentDetails.paid);

    if (linkedAmount > 0 && paidAmount < linkedAmount) {
      this.handleClosePaymentOutLoadingMessage();
      alert('Received Amount should be greater than or equal to Linked Amount');
      return;
    }

    const db = await Db.get();

    if (
      this.paymentDetails.splitPaymentList &&
      this.paymentDetails.splitPaymentList.length > 0
    ) {
      this.paymentDetails.splitPaymentList.forEach((item) => {
        item.amount = parseFloat(item.amount) || 0;
      });
    }

    if (this.chosenPaymentType === 'Split') {
      this.paymentDetails.paymentType = this.chosenPaymentType;
    }

    if (
      this.paymentDetails.tcsAmount === null ||
      this.paymentDetails.tcsAmount === ''
    ) {
      this.paymentDetails.tcsAmount = 0;
    }

    if (
      this.paymentDetails.tcsRate === null ||
      this.paymentDetails.tcsRate === ''
    ) {
      this.paymentDetails.tcsRate = 0;
    }

    if (
      this.paymentDetails.tdsAmount === null ||
      this.paymentDetails.tdsAmount === ''
    ) {
      this.paymentDetails.tdsAmount = 0;
    }

    if (
      this.paymentDetails.tdsRate === null ||
      this.paymentDetails.tdsRate === ''
    ) {
      this.paymentDetails.tdsRate = 0;
    }

    if (
      !('calculateStockAndBalance' in this.paymentDetails) ||
      !this.paymentDetails.calculateStockAndBalance
    ) {
      this.paymentDetails.calculateStockAndBalance = true;
    }

    if (this.isUpdate) {
      await this.updateVendorPayment(db, isPrint);
    } else {
      await this.saveVendorPayment(db, isSaveAndnew, isPrint);
    }
  };

  updatePaymentOutWithTxn = async (db, doc) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      const paymentOutData = await db.paymentout
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                receiptNumber: { $eq: doc.receiptNumber }
              },
              { vendorId: { $eq: doc.vendorId } }
            ]
          }
        })
        .exec();

      const changeData = await (async (oldData) => {
        if (parseFloat(oldData.balance) > 0) {
          if (oldData.balance > doc.linkedAmount) {
            oldData.balance =
              parseFloat(oldData.balance) - parseFloat(doc.linkedAmount);
          } else {
            oldData.balance = 0;
          }
        }
        oldData.updatedAt = Date.now();
        console.log('updated old data updatePaymentOutWithTxn::', oldData);
        return oldData;
      });

      if (paymentOutData) {
        await paymentOutData.atomicUpdate(changeData);
      }

      resolve(`updated data`);
    });
  };

  deletePaymentOut = async (item) => {
    const db = await Db.get();

    runInAction(() => {
      this.paymentDetails = { ...item };
    });

    const { receiptNumber, sequenceNumber, total, balance, date } =
      this.paymentDetails;

    const DeleteDataDoc = {
      transactionId: receiptNumber,
      sequenceNumber,
      transactionType: 'Payment Out',
      createdDate: date,
      total: total || 0,
      balance: balance || 0,
      data: JSON.stringify(this.paymentDetails)
    };

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    /**
     * delete paymnet out entry
     */
    const businessData = await Bd.getBusinessData();

    const query = db.paymentout.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { receiptNumber: { $eq: item.receiptNumber } }
        ]
      }
    });

    /**
     * unlink  payments
     */
    if (item.linked_amount > 0) {
      this.unLinkPayment(db, item);
    }

    if (
      !('calculateStockAndBalance' in this.paymentDetails) ||
      !this.paymentDetails.calculateStockAndBalance
    ) {
      /**
       * reverse old account to customer
       */
      await balanceUpdate.incrementBalance(db, item.vendorId, item.paid);
    }

    //delete from all txn table
    await allTxn.deleteTxnFromPaymentOut(this.paymentDetails, db);

    //save to audit
    audit.addAuditEvent(
      this.paymentDetails.receiptNumber,
      this.paymentDetails.sequenceNumber,
      'Payment Out',
      'Delete',
      JSON.stringify(this.paymentDetails),
      '',
      this.paymentDetails.date
    );

    await query
      .remove()
      .then((data) => {
        console.log('data removed' + data);
      })
      .catch((error) => {
        console.log('payment out data removal Failed ' + error);
        // alert('Error in Removing Data');

        audit.addAuditEvent(
          this.paymentDetails.receiptNumber,
          this.paymentDetails.sequenceNumber,
          'Payment Out',
          'Delete',
          JSON.stringify(this.paymentDetails),
          error.message,
          this.paymentDetails.date
        );
      });

    this.unLinkedTxnList = [];
  };

  saveVendorPayment = async (db, isSaveAndnew, isPrint) => {
    this.paymentDetails.balance = parseFloat(this.paymentDetails.total).toFixed(
      2
    );

    this.paymentDetails.paid = parseFloat(this.paymentDetails.paid).toFixed(2);
    this.paymentDetails.total = parseFloat(this.paymentDetails.paid).toFixed(2);

    /**
     * check if it is make payment
     * if it is then link that first then move to others pending txn
     */
    /**
     * make payment happens at sale and purchase return
     */

    if (this.OpenMakePayment) {
      this.paymentDetails.linkPayment = true;

      if (this.makePaymentTxnType === 'Sales Return') {
        await this.makePaymentSalesReturnTxn(db, this.makePaymentTxnId);
      } else if (this.makePaymentTxnType === 'Purchases') {
        await this.makePaymentPurchasesTxn(db, this.makePaymentTxnId);
      }
    }

    if (
      this.paymentDetails.sequenceNumber === '' ||
      this.paymentDetails.sequenceNumber === undefined
    ) {
      await this.getSequenceNumber(
        this.paymentDetails.date,
        this.paymentDetails.receiptNumber
      );
    }

    if (this.paymentDetails.sequenceNumber === '0') {
      this.paymentDetails.sequenceNumber = '';
      this.handleClosePaymentOutLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    /**
     * link payment
     */
    if (
      this.paymentDetails['linkPayment'] ||
      this.paymentDetails.linked_amount > 0
    ) {
      await this.linkPayment(db, this.paymentDetails);
    } else {
      this.paymentDetails.linkedTxnList = [];
    }

    if (
      !('calculateStockAndBalance' in this.paymentDetails) ||
      !this.paymentDetails.calculateStockAndBalance
    ) {
      /**
       * update vendor balance
       * and calculate payment out transaction balance
       */
      await balanceUpdate.decrementBalance(
        db,
        this.paymentDetails.vendorId,
        this.paymentDetails.paid
      );
    }

    /**
     * insert payment out data
     */

    const {
      businessId,
      businessCity,
      date,
      receiptNumber,
      sequenceNumber,
      vendorId,
      vendorName,
      vendorPhoneNo,
      paymentType,
      paid,
      total,
      linkedTxnList,
      linkPayment,
      prefix,
      subPrefix,
      vendorGSTNo,
      vendorGSTType,
      vendorCity,
      vendorPincode,
      vendorAddress,
      vendorState,
      vendorCountry,
      vendorEmailId,
      tcsAmount,
      tcsName,
      tcsRate,
      tcsCode,
      tdsAmount,
      tdsName,
      tdsRate,
      tdsCode,
      splitPaymentList,
      vendorPanNumber,
      isSyncedToServer,
      calculateStockAndBalance
    } = this.paymentDetails;

    const finalPaymentDetails = {
      businessId,
      businessCity,
      date,
      receiptNumber,
      sequenceNumber,
      vendorId,
      vendorName,
      vendorPhoneNo,
      paymentType,
      paid,
      total,
      linkedTxnList,
      updatedAt: Date.now(),
      prefix,
      subPrefix,
      vendorGSTNo,
      vendorGSTType,
      vendorCity,
      vendorPincode,
      vendorAddress,
      vendorState,
      vendorCountry,
      vendorEmailId,
      tcsAmount,
      tcsName,
      tcsRate,
      tcsCode,
      tdsAmount,
      tdsName,
      tdsRate,
      tdsCode,
      splitPaymentList,
      vendorPanNumber,
      isSyncedToServer,
      calculateStockAndBalance,
      balance:
        parseFloat(paid) - (parseFloat(this.paymentDetails.linked_amount) || 0),
      bankAccount: this.paymentDetails.bankAccount,
      bankAccountId: this.paymentDetails.bankAccountId,
      bankPaymentType: this.paymentDetails.bankPaymentType,
      paymentReferenceNumber: this.paymentDetails.paymentReferenceNumber,
      vendorPayable: this.paymentDetails.vendorPayable || false,
      paymentOut: this.paymentDetails.paymentOut || true,
      linkPayment: this.paymentDetails.linkPayment || false,
      linked_amount: parseFloat(this.paymentDetails.linked_amount) || 0
    };

    const businessData = await Bd.getBusinessData();
    finalPaymentDetails.posId = parseFloat(businessData.posDeviceId);

    if (this.isRestore) {
      finalPaymentDetails.employeeId = this.paymentDetails.employeeId;
    } else {
      try {
        finalPaymentDetails.employeeId = JSON.parse(
          localStorage.getItem('loginDetails')
        ).username;
      } catch (e) {
        console.error(' Error: ', e.message);
      }
    }

    finalPaymentDetails.paymentOut = true;

    if (
      finalPaymentDetails.balance === '' ||
      finalPaymentDetails.balance === null
    ) {
      finalPaymentDetails.balance = 0;
    }
    if (finalPaymentDetails.paid === '' || finalPaymentDetails.paid === null) {
      finalPaymentDetails.paid = 0;
    }
    if (
      finalPaymentDetails.total === '' ||
      finalPaymentDetails.total === null
    ) {
      finalPaymentDetails.total = 0;
    }
    if (
      finalPaymentDetails.vendorPayable === '' ||
      finalPaymentDetails.vendorPayable === null
    ) {
      finalPaymentDetails.vendorPayable = false;
    }
    if (
      finalPaymentDetails.paymentOut === '' ||
      finalPaymentDetails.paymentOut === null
    ) {
      finalPaymentDetails.paymentOut = true;
    }
    if (
      finalPaymentDetails.linkPayment === '' ||
      finalPaymentDetails.linkPayment === null
    ) {
      finalPaymentDetails.linkPayment = false;
    }
    if (
      finalPaymentDetails.linked_amount === '' ||
      finalPaymentDetails.linked_amount === null
    ) {
      finalPaymentDetails.linked_amount = 0;
    }

    let userAction = 'Save';

    if (this.isRestore) {
      userAction = 'Restore';
      await this.markPaymentOutRestored();
    }

    const receiptOrPayment = await allTxn.saveTxnFromPaymentOut(
      finalPaymentDetails,
      db
    );

    finalPaymentDetails.receiptOrPayment = receiptOrPayment;

    //save to audit
    audit.addAuditEvent(
      finalPaymentDetails.receiptNumber,
      finalPaymentDetails.sequenceNumber,
      'Payment Out',
      userAction,
      JSON.stringify(finalPaymentDetails),
      '',
      finalPaymentDetails.date
    );

    await db.paymentout
      .insert(finalPaymentDetails)
      .then(async (data) => {
        if (
          isPrint &&
          this.paymentOutInvoiceThermal &&
          this.paymentOutInvoiceThermal.boolDefault
        ) {
          runInAction(async () => {
            sendContentForThermalPrinter(
              finalPaymentDetails.vendorId,
              this.paymentOutInvoiceThermal,
              finalPaymentDetails
            );
          });
        }

        if (
          this.paymentOutInvoiceRegular &&
          this.paymentOutInvoiceRegular.boolDefault &&
          isPrint
        ) {
          this.printPaymentOutBalance =
            await balanceUpdate.getCustomerBalanceById(
              finalPaymentDetails.vendorId
            );
          this.printPaymentOutData = finalPaymentDetails;

          this.handleClosePaymentOutLoadingMessage();
          /**
           * close make payment
           */
          this.closeMakePaymentDialog();

          /**
           * make used global variable to deafult values
           */
          this.paymentLinkTransactions = [];

          if (this.isSaveAndNew & isPrint) {
            this.reset();
          }

          if (!this.isSaveAndNew) {
            this.closeDialog();
          }

          this.sequenceData = {};

          runInAction(() => {
            this.isPaymentOutList = true;
          });

          this.handleOpenPaymentOutPrintSelectionAlertMessage();
        } else {
          this.handleClosePaymentOutLoadingMessage();
          /**
           * close make payment
           */
          this.closeMakePaymentDialog();

          /**
           * make used global variable to deafult values
           */
          this.paymentLinkTransactions = [];

          if (this.isSaveAndNew & isPrint) {
            this.reset();
          }

          if (!this.isSaveAndNew) {
            this.closeDialog();
          }

          this.sequenceData = {};

          runInAction(() => {
            this.isPaymentOutList = true;
          });
        }
      })
      .catch((err) => {
        console.log('data Inserted Failed', err);

        //save to audit
        audit.addAuditEvent(
          finalPaymentDetails.receiptNumber,
          finalPaymentDetails.sequenceNumber,
          'Payment Out',
          userAction,
          JSON.stringify(finalPaymentDetails),
          err.message,
          finalPaymentDetails.date
        );

        this.handleClosePaymentOutLoadingMessage();
        this.handleOpenPaymentOutErrorAlertMessage();
      });
  };

  updateVendorPayment = async (db, isPrint) => {
    const businessData = await Bd.getBusinessData();

    //paid and total column are same
    this.paymentDetails.paid = parseFloat(this.paymentDetails.paid).toFixed(2);
    this.paymentDetails.total = parseFloat(this.paymentDetails.paid).toFixed(2);

    this.paymentDetails.balance =
      parseFloat(this.paymentDetails.paid) -
      (parseFloat(this.paymentDetails.linked_amount) || 0);

    const query = db.paymentout.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { receiptNumber: { $eq: this.paymentDetails.receiptNumber } }
        ]
      }
    });

    // Unlink and remove old linked transactions
    if (
      this.existingPaymentDetails['linkPayment'] &&
      this.existingPaymentDetails.linked_amount > 0
    ) {
      await this.unLinkPayment(db, this.existingPaymentDetails);
    }

    // Link new payment amount
    if (
      this.paymentDetails['linkPayment'] &&
      this.paymentDetails.linked_amount > 0
    ) {
      await this.linkPayment(db, this.paymentDetails);
    } else {
      this.paymentDetails.linkedTxnList = [];
    }

    if (
      this.paymentDetails.balance === '' ||
      this.paymentDetails.balance === null
    ) {
      this.paymentDetails.balance = 0;
    }
    if (this.paymentDetails.paid === '' || this.paymentDetails.paid === null) {
      this.paymentDetails.paid = 0;
    }
    if (
      this.paymentDetails.total === '' ||
      this.paymentDetails.total === null
    ) {
      this.paymentDetails.total = 0;
    }
    if (
      this.paymentDetails.vendorPayable === '' ||
      this.paymentDetails.vendorPayable === null
    ) {
      this.paymentDetails.vendorPayable = false;
    }
    if (
      this.paymentDetails.paymentOut === '' ||
      this.paymentDetails.paymentOut === null
    ) {
      this.paymentDetails.paymentOut = true;
    }
    if (
      this.paymentDetails.linkPayment === '' ||
      this.paymentDetails.linkPayment === null
    ) {
      this.paymentDetails.linkPayment = false;
    }
    if (
      this.paymentDetails.linked_amount === '' ||
      this.paymentDetails.linked_amount === null
    ) {
      this.paymentDetails.linked_amount = 0;
    }

    const previousAmount = parseFloat(this.existingPaymentDetails.paid);
    const difference = parseFloat(this.paymentDetails.paid) - previousAmount;

    if (difference === 0) {
      console.log('No change in paymentIn amount.');
    }

    if (
      !('calculateStockAndBalance' in this.paymentDetails) ||
      !this.paymentDetails.calculateStockAndBalance
    ) {
      if (difference > 0) {
        // Decrement new balance to the vendor and calculate payment out transaction balance
        await balanceUpdate.decrementBalance(
          db,
          this.existingPaymentDetails.vendorId,
          difference
        );
      } else {
        // Add new amount to the vendor
        await balanceUpdate.incrementBalance(
          db,
          this.existingPaymentDetails.vendorId,
          Math.abs(difference)
        );
      }
    }

    const finalBalance =
      parseFloat(this.paymentDetails.paid) -
      (parseFloat(this.paymentDetails.linked_amount) || 0);

    // Delete and save from all txn table
    const receiptOrPayment = await allTxn.deleteAndSaveTxnFromPaymentOut(
      this.existingPaymentDetails,
      this.paymentDetails,
      db
    );
    this.paymentDetails.receiptOrPayment = receiptOrPayment;

    // Save to audit
    audit.addAuditEvent(
      this.paymentDetails.receiptNumber,
      this.paymentDetails.sequenceNumber,
      'Payment Out',
      'Update',
      JSON.stringify(this.paymentDetails),
      '',
      this.paymentDetails.date
    );

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        await query
          .update({
            $set: {
              date: this.paymentDetails.date,
              sequenceNumber: this.paymentDetails.sequenceNumber,
              paymentType: this.paymentDetails.paymentType,
              bankAccount: this.paymentDetails.bankAccount,
              bankAccountId: this.paymentDetails.bankAccountId,
              bankPaymentType: this.paymentDetails.bankPaymentType,
              linkPayment: this.paymentDetails.linkPayment,
              linked_amount: parseFloat(this.paymentDetails.linked_amount),
              balance: finalBalance,
              paid: parseFloat(this.paymentDetails.paid) || 0,
              total: parseFloat(this.paymentDetails.total) || 0,
              linkedTxnList: this.paymentDetails.linkedTxnList,
              paymentReferenceNumber:
                this.paymentDetails.paymentReferenceNumber,
              updatedAt: Date.now(),
              splitPaymentList: this.paymentDetails.splitPaymentList,
              receiptOrPayment: this.paymentDetails.receiptOrPayment
            }
          })
          .then(async () => {
            const finalPaymentDetails = this.paymentDetails;

            if (
              this.paymentOutInvoiceThermal &&
              this.paymentOutInvoiceThermal.boolDefault &&
              isPrint
            ) {
              sendContentForThermalPrinter(
                finalPaymentDetails.vendorId,
                this.paymentOutInvoiceThermal,
                finalPaymentDetails
              );
            }

            if (
              this.paymentOutInvoiceRegular &&
              this.paymentOutInvoiceRegular.boolDefault &&
              isPrint
            ) {
              this.printPaymentOutBalance =
                await balanceUpdate.getCustomerBalanceById(
                  finalPaymentDetails.vendorId
                );
              this.printPaymentOutData = finalPaymentDetails;

              this.handleClosePaymentOutLoadingMessage();
              this.closeMakePaymentDialog();
              this.paymentLinkTransactions = [];

              if (this.isSaveAndNew & isPrint) {
                this.reset();
              }

              if (!this.isSaveAndNew) {
                this.closeDialog();
              }

              this.sequenceData = {};

              runInAction(() => {
                this.isPaymentOutList = true;
              });

              this.handleOpenPaymentOutPrintSelectionAlertMessage();
            } else {
              this.handleClosePaymentOutLoadingMessage();
              this.closeMakePaymentDialog();
              this.paymentLinkTransactions = [];

              if (this.isSaveAndNew & isPrint) {
                this.reset();
              }

              if (!this.isSaveAndNew) {
                this.closeDialog();
              }

              this.sequenceData = {};

              runInAction(() => {
                this.isPaymentOutList = true;
              });
            }

            runInAction(() => {
              this.isPaymentOutList = true;
              this.isUpdate = false;
            });
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        audit.addAuditEvent(
          this.paymentDetails.receiptNumber,
          this.paymentDetails.sequenceNumber,
          'Payment Out',
          'Update',
          JSON.stringify(this.paymentDetails),
          err.message,
          this.paymentDetails.date
        );
      });
  };

  linkPayment = async (db) => {
    this.paymentDetails.linkedTxnList = [];

    const txnList = await lp.linkPayment(
      db,
      this.paymentDetails,
      this.paymentLinkTransactions,
      'Payment Out'
    );

    if (txnList) {
      txnList.forEach((txn) => this.paymentDetails.linkedTxnList.push(txn));
    }

    this.paymentLinkTransactions = [];
  };

  unLinkPayment = async (db, paymentDetails) => {
    await lp.unLinkPayment(db, paymentDetails, 'Payment Out');

    paymentDetails.linkedTxnList.forEach((item) => {
      this.unLinkedTxnList.push(item);
    });

    /**
     * make used global variable to deafult values
     */
    this.paymentUnLinkTransactions = [];
  };

  makePaymentSalesReturnTxn = async (db, sales_return_number) => {
    console.log('getSalesReturnData');

    /**
     * since it only get one record setting to empty
     */
    this.paymentLinkTransactions = [];

    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              sales_return_number: { $eq: sales_return_number }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        console.log('sales return', data.toJSON());
        let finalData = data.toJSON();
        finalData.paymentType = 'Sales Return';
        finalData.id = data.sales_return_number;
        finalData.total = data.total_amount;
        finalData.balance = data.balance_amount;
        finalData.sequenceNumber = data.sequenceNumber;

        var index = this.paymentLinkTransactions.findIndex(
          (x) => x.id === finalData.id
        );

        if (index === -1) {
          this.paymentLinkTransactions.push(finalData);
        }
        this.selectedPaymentItem(finalData);
      });
  };

  makePaymentPurchasesTxn = async (db, bill_number) => {
    console.log('getCreditPurchaseData');

    /**
     * since it only get one record setting to empty
     */
    this.paymentLinkTransactions = [];
    const businessData = await Bd.getBusinessData();

    await db.purchases
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_number: { $eq: bill_number }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        console.log('purchases', data.toJSON());
        let finalData = data.toJSON();
        finalData.paymentType = 'Purchases';
        finalData.id = data.bill_number;
        finalData.date = data.bill_date;
        finalData.total = data.total_amount;
        finalData.balance = data.balance_amount;
        finalData.sequenceNumber = data.sequenceNumber;

        var index = this.paymentLinkTransactions.findIndex(
          (x) => x.id === finalData.id
        );

        if (index === -1) {
          this.paymentLinkTransactions.push(finalData);
        }
        this.selectedPaymentItem(finalData);
      });
  };

  makePaymentOpenCustomer = async (item) => {
    await this.reset();
    this.paymentDetails.vendorId = item.customer_id;
    this.paymentDetails.vendorName = item.customer_name;
    await this.generateReceiptNumber();
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: item.customer_id }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        this.currentVendorBalance = data.balance;

        this.paymentDetails.balanceToPay = item.balance_amount;

        console.log('data::', data);

        if (data.balanceType === 'Receivable' && data.balance > 0) {
          this.paymentDetails.vendorPayable = false;
          // this.paymentDetails.linkPayment = true;
        } else {
          this.paymentDetails.vendorPayable = true;
        }

        this.OpenMakePayment = true;

        this.makePaymentTxnId = item.sales_return_number;
        this.makePaymentTxnType = 'Sales Return';
      });
  };

  makePaymentOpenVendor = async (item) => {
    this.reset();
    this.paymentDetails.vendorId = item.vendor_id;
    this.paymentDetails.vendorName = item.vendor_name;
    this.generateReceiptNumber();
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: item.vendor_id }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        this.currentVendorBalance = data.balance;

        console.log('data::', data);

        if (data.balanceType === 'Payable' && data.balance > 0) {
          this.paymentDetails.vendorPayable = true;
          // this.paymentDetails.linkPayment = true;
        } else {
          this.paymentDetails.vendorPayable = false;
        }

        this.paymentDetails.balanceToPay = item.balance_amount;
        this.OpenMakePayment = true;
        this.makePaymentTxnId = item.bill_number;
        this.makePaymentTxnType = 'Purchases';
        this.chosenPaymentType = 'Cash';

        if (
          this.splitPaymentSettingsData &&
          this.paymentDetails.splitPaymentList &&
          this.paymentDetails.splitPaymentList.length === 0
        ) {
          this.prepareSplitPaymentList();
        }
      });
  };

  closeMakePaymentDialog = async () => {
    this.OpenMakePayment = false;

    this.makePaymentTxnId = 0;
    this.makePaymentTxnType = '';
    this.reset();
  };

  selectedPaymentItem = async (row) => {
    var index = this.paymentLinkTransactions.findIndex((x) => x.id === row.id);

    if (index >= 0) {
      const txnSelected = this.paymentLinkTransactions[index];

      const recievedAmount = parseFloat(this.paymentDetails.paid) || 0;
      let linkedAmount = parseFloat(this.paymentDetails.linked_amount) || 0;

      let amountToLink = recievedAmount - linkedAmount || 0;

      if (txnSelected.balance >= amountToLink) {
        txnSelected.linkedAmount = amountToLink;

        this.paymentDetails.linked_amount =
          this.paymentDetails.linked_amount + amountToLink;
      } else {
        txnSelected.linkedAmount = txnSelected.balance;

        this.paymentDetails.linked_amount =
          this.paymentDetails.linked_amount + txnSelected.balance;
      }

      txnSelected.selected = true;
      txnSelected.balance =
        parseFloat(txnSelected.balance) - parseFloat(txnSelected.linkedAmount);

      this.paymentLinkTransactions[index] = txnSelected;
    }
  };

  unSelectedPaymentItem = (row) => {
    var index = this.paymentLinkTransactions.findIndex((x) => x.id === row.id);

    if (index >= 0) {
      const txnSelected = this.paymentLinkTransactions[index];

      /**
       * since total amount is calculated it will be set only during save/update
       */
      const linkedAmount = txnSelected.linkedAmount;

      this.paymentDetails.linked_amount =
        this.paymentDetails.linked_amount - linkedAmount;

      txnSelected.selected = false;
      txnSelected.balance =
        parseFloat(txnSelected.balance) + parseFloat(txnSelected.linkedAmount);

      txnSelected.linkedAmount = 0;

      this.paymentLinkTransactions[index] = txnSelected;
    }
  };

  autoLinkPayment = () => {
    //reset before auto link
    this.resetLinkPayment();
    /**
     * iterte all linked txn
     * increase linked amount untill it reaches balance amount
     * update all txn with available and linked amount
     */

    const recievedAmount = parseFloat(this.paymentDetails.paid) || 0;
    let linkedAmount = parseFloat(this.paymentDetails.linked_amount) || 0;

    let amountToLink = parseFloat(recievedAmount) - parseFloat(linkedAmount);

    if (amountToLink > 0) {
      let finalLinkedAmount = 0;
      for (let txn of this.paymentLinkTransactions) {
        if (txn.balance > 0) {
          let linked = 0;
          if (finalLinkedAmount < amountToLink) {
            if (
              txn.balance >=
              parseFloat(amountToLink) - parseFloat(finalLinkedAmount)
            ) {
              linked = parseFloat(amountToLink) - parseFloat(finalLinkedAmount);
              txn.linkedAmount = linked;
              finalLinkedAmount =
                parseFloat(finalLinkedAmount) + parseFloat(linked);
            } else {
              linked = txn.balance;
              txn.linkedAmount = linked;
              finalLinkedAmount =
                parseFloat(finalLinkedAmount) + parseFloat(linked);
            }

            txn.selected = true;
            txn.balance = parseFloat(txn.balance) - parseFloat(linked);
          }
        }
      }
      this.paymentDetails.linked_amount = finalLinkedAmount;
    }
  };

  resetLinkPayment = () => {
    console.log('resetLinkPayment');

    let linked_amount = this.paymentDetails.linked_amount;
    for (let txn of this.paymentLinkTransactions) {
      if (txn) {
        if (txn.linkedAmount >= 0) {
          linked_amount =
            parseFloat(linked_amount) - parseFloat(txn.linkedAmount);
          txn.balance = parseFloat(txn.balance) + parseFloat(txn.linkedAmount);

          txn.linkedAmount = 0;
          txn.selected = false;
        }
      }
    }
    this.paymentDetails.linked_amount = linked_amount;
  };

  get getBalanceAfterLinkedAmount() {
    let result = 0;

    result =
      (parseFloat(this.paymentDetails.paid) || 0) -
      (parseFloat(this.paymentDetails.linked_amount) || 0);

    return result;
  }

  saveLinkPaymentChanges = () => {
    if (this.paymentDetails.linked_amount > 0) {
      this.paymentDetails.linkPayment = true;
    }
    this.closeLinkPayment();
  };

  closeLinkPayment = () => {
    console.log('clicked close');
    this.openLinkpaymentPage = false;
  };

  setLinkPayment = async () => {
    this.openLinkpaymentPage = true;
  };

  setPaymentOutInvoiceRegular = (invoiceRegular) => {
    this.paymentOutInvoiceRegular = invoiceRegular;
  };

  setPaymentOutInvoiceThermal = (invoiceThermal) => {
    this.paymentOutInvoiceThermal = invoiceThermal;
  };

  setPaymentMode = (value) => {
    this.paymentDetails.bankPaymentType = value;
  };

  setBankAccountData = (value, chosenType) => {
    if (value.accountDisplayName && value.id) {
      runInAction(() => {
        this.paymentDetails.paymentType = chosenType;
        this.paymentDetails.bankAccount = value.accountDisplayName;
        this.paymentDetails.bankAccountId = value.id;
      });
    }
  };

  setPaymentReferenceNumber = (value) => {
    this.paymentDetails.paymentReferenceNumber = value;
  };

  handlePaymentOutSearchWithPrefix = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let data;
    let query = await db.paymentout.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            date: {
              $gte: dateHelper.getFinancialYearStartDate()
            }
          },
          {
            date: {
              $lte: dateHelper.getFinancialYearEndDate()
            }
          },
          { prefix: { $eq: value } },
          {
            updatedAt: { $exists: true }
          }
        ]
      }
    });

    await query.exec().then((documents) => {
      data = documents.map((item) => item);
    });
    return data;
  };

  handlePaymentOutSearchWithSubPrefix = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let data;
    let query = await db.paymentout.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            date: {
              $gte: dateHelper.getFinancialYearStartDate()
            }
          },
          {
            date: {
              $lte: dateHelper.getFinancialYearEndDate()
            }
          },
          { subPrefix: { $eq: value } },
          {
            updatedAt: { $exists: true }
          }
        ]
      }
    });

    await query.exec().then((documents) => {
      data = documents.map((item) => item);
    });
    return data;
  };

  viewAndRestorePaymentOut = async (item) => {
    this.reset();
    this.isUpdate = false;
    this.isRestore = true;

    this.paymentOutInvoiceRegular = {};
    this.paymentOutInvoiceThermal = {};
    this.sequenceData = {};

    //reset linked txn details start
    item.linkedTxnList = [];
    item.linked_amount = 0;
    item.linkPayment = false;
    item.balance = item.total;
    //reset linked txn details end

    if (
      !('calculateStockAndBalance' in item) ||
      !item.calculateStockAndBalance
    ) {
      item.calculateStockAndBalance = true;
    }

    this.paymentDetails = item;
    this.chosenPaymentType = this.paymentDetails.paymentType;
    this.paymentDetails.employeeId = item.employeeId;

    this.OpenAddPaymentOut = true;

    const db = await Db.get();
    await lp.getAllUnPaidTxnForCustomer(this, db, item.vendorId, 'Payment Out');
  };

  restorePaymentOut = async (item, isRestoreWithNextSequenceNo) => {
    this.isUpdate = false;
    this.isRestore = true;

    this.paymentOutInvoiceRegular = {};
    this.paymentOutInvoiceThermal = {};
    this.sequenceData = {};

    if (
      !('calculateStockAndBalance' in item) ||
      !item.calculateStockAndBalance
    ) {
      item.calculateStockAndBalance = true;
    }

    //reset linked txn details start
    item.linkedTxnList = [];
    item.linked_amount = 0;
    item.linkPayment = false;
    item.balance = item.total;
    //reset linked txn details end

    this.paymentDetails = item;
    if (this.paymentDetails.paymentType === 'Split') {
      this.chosenPaymentType = 'Split';
    } else {
      this.chosenPaymentType = 'Cash';
    }

    this.paymentDetails.employeeId = item.employeeId;

    if (isRestoreWithNextSequenceNo) {
      await this.generateReceiptNumber();
      await this.getSequenceNumber(
        this.paymentDetails.date,
        this.paymentDetails.receiptNumber
      );
      this.paymentDetails.date = dateHelper.getTodayDateInYYYYMMDD();
    }

    this.savePaymentData(false, false);
  };

  markPaymentOutRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: this.paymentDetails.receiptNumber } }
        ]
      }
    });
    await query
      .remove()
      .then(async (data) => {
        console.log('Deleted data removed' + data);
        this.paymentDetails = {};
      })
      .catch((error) => {
        console.log('Deleted data deletion Failed ' + error);
      });
  };

  getCustomerBalance = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.paymentDetails.customerId } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        console.log(data);
        this.currentCustomerBalance = parseFloat(data.balance || 0);
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  resetPaymentOutPrintData = async () => {
    runInAction(() => {
      this.printPaymentOutData = {};
      this.printPaymentOutBalance = {};
      this.openPaymentOutPrintSelectionAlert = false;
    });
  };

  closeDialogForSaveAndPrint = () => {
    this.handleClosePaymentOutLoadingMessage();
    this.closeDialog();
    this.closeMakePaymentDialog();
    this.reset();

    /**
     * make used global variable to deafult values
     */
    this.paymentLinkTransactions = [];

    if (this.isSaveAndNew) {
      this.reset();
    }

    this.sequenceData = {};

    runInAction(() => {
      this.isPaymentOutList = true;
    });
  };

  handleOpenPaymentOutLoadingMessage = async () => {
    runInAction(() => {
      this.openPaymentOutLoadingAlertMessage = true;
    });
  };

  handleClosePaymentOutLoadingMessage = async () => {
    runInAction(() => {
      this.openPaymentOutLoadingAlertMessage = false;
    });
  };

  handleOpenPaymentOutErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPaymentOutErrorAlertMessage = true;
    });
  };

  handleClosePaymentOutErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPaymentOutErrorAlertMessage = false;
    });
  };

  handleOpenPaymentOutPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPaymentOutPrintSelectionAlert = true;
    });
  };

  handleClosePaymentOutPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPaymentOutPrintSelectionAlert = false;
    });
  };

  setSplitPaymentSettingsData = (value) => {
    this.splitPaymentSettingsData = value;
    if (
      !this.isUpdate ||
      (this.paymentDetails.splitPaymentList &&
        this.paymentDetails.splitPaymentList.length === 0)
    ) {
      this.prepareSplitPaymentList();
    }
  };

  setBankAccountList = (value) => {
    this.bankAccountsList = value;
  };

  setSplitPayment = (property, index, value) => {
    this.paymentDetails.splitPaymentList[index][property] = value;
  };

  prepareSplitPaymentList = async () => {
    this.paymentDetails.splitPaymentList = [];
    const businessData = await Bd.getBusinessData();

    if (this.splitPaymentSettingsData) {
      if (this.splitPaymentSettingsData.cashEnabled) {
        const timestamp = Date.now();
        const appId = businessData.posDeviceId;
        const id = _uniqueId('sp');

        let cashPayment = {
          id: `${id}${appId}${timestamp}`,
          paymentType: 'Cash',
          referenceNumber: '',
          paymentMode: '',
          accountDisplayName: null,
          bankAccountId: null,
          amount: 0
        };

        this.paymentDetails.splitPaymentList.push(cashPayment);
      }

      if (this.splitPaymentSettingsData.giftCardEnabled) {
        if (
          this.splitPaymentSettingsData.giftCardList &&
          this.splitPaymentSettingsData.giftCardList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let giftCardPayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Gift Card',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: null,
            bankAccountId: null,
            amount: 0
          };

          this.paymentDetails.splitPaymentList.push(giftCardPayment);
        }
      }

      if (this.splitPaymentSettingsData.customFinanceEnabled) {
        if (
          this.splitPaymentSettingsData.customFinanceList &&
          this.splitPaymentSettingsData.customFinanceList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let customFinancePayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Custom Finance',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: null,
            bankAccountId: null,
            amount: 0
          };

          this.paymentDetails.splitPaymentList.push(customFinancePayment);
        }
      }

      if (this.splitPaymentSettingsData.bankEnabled) {
        if (
          this.splitPaymentSettingsData.bankList &&
          this.splitPaymentSettingsData.bankList.length > 0 &&
          this.bankAccountsList &&
          this.bankAccountsList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let bankPayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Bank',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: '',
            bankAccountId: '',
            amount: 0
          };

          if (this.splitPaymentSettingsData.defaultBankSelected !== '') {
            let bankAccount = this.bankAccountsList.find(
              (o) =>
                o.accountDisplayName ===
                this.splitPaymentSettingsData.defaultBankSelected
            );

            if (bankAccount) {
              bankPayment.accountDisplayName = bankAccount.accountDisplayName;
              bankPayment.bankAccountId = bankAccount.id;
            }
          }

          this.paymentDetails.splitPaymentList.push(bankPayment);
        }
      }
    }
  };

  addSplitPayment = async (type) => {
    const businessData = await Bd.getBusinessData();
    if (type === 'Bank') {
      const timestamp = Date.now();
      const appId = businessData.posDeviceId;
      const id = _uniqueId('sp');

      let bankPayment = {
        id: `${id}${appId}${timestamp}`,
        paymentType: 'Bank',
        referenceNumber: '',
        paymentMode: 'UPI',
        accountDisplayName: '',
        bankAccountId: '',
        amount: 0
      };

      if (this.splitPaymentSettingsData.defaultBankSelected !== '') {
        let bankAccount = this.bankAccountsList.find(
          (o) =>
            o.accountDisplayName ===
            this.splitPaymentSettingsData.defaultBankSelected
        );

        if (bankAccount) {
          bankPayment.accountDisplayName = bankAccount.accountDisplayName;
          bankPayment.bankAccountId = bankAccount.id;
        }
      }

      this.paymentDetails.splitPaymentList.push(bankPayment);
    }
  };

  removeSplitPayment = (index) => {
    this.paymentDetails.splitPaymentList.splice(index, 1);
  };

  setChosenPaymentType = (value) => {
    this.chosenPaymentType = value;
  };

  handleOpenSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openSplitPaymentDetails = true;
    });
  };

  handleCloseSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openSplitPaymentDetails = false;
    });
  };

  handleCloseAndResetSplitPaymentDetails = async () => {
    runInAction(() => {
      if (this.OpenMakePayment === true) {
        this.openMakePaymentSplitPaymentDetails = false;
      } else {
        this.openSplitPaymentDetails = false;
      }
      let splitPaymentAmt = 0;
      for (let payment of this.paymentDetails.splitPaymentList) {
        splitPaymentAmt += parseFloat(payment.amount);
      }
      if (splitPaymentAmt === 0) {
        this.resetSplitPaymentDetails();
      }
    });
  };

  resetSplitPaymentDetails = async () => {
    this.paymentDetails.paymentType = 'cash';
    this.chosenPaymentType = 'Cash';
    this.prepareSplitPaymentList();
  };

  handleOpenMakePaymentSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openMakePaymentSplitPaymentDetails = true;

      if (
        this.splitPaymentSettingsData &&
        this.paymentDetails.splitPaymentList &&
        this.paymentDetails.splitPaymentList.length === 0
      ) {
        this.prepareSplitPaymentList();
      }
    });
  };

  handleCloseMakePaymentSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openMakePaymentSplitPaymentDetails = false;
    });
  };

  handleOpenSequenceNumberFailureAlert = async () => {
    runInAction(() => {
      this.sequenceNumberFailureAlert = true;
    });
  };

  handleCloseSequenceNumberFailureAlert = async () => {
    runInAction(() => {
      this.sequenceNumberFailureAlert = false;
    });
  };

  constructor() {
    makeObservable(this, {
      OpenAddPaymentOut: observable,
      OpenMakePayment: observable,
      paymentDetails: observable,
      setPaymentType: action,
      setpaymentOutVendor: action,
      savePaymentData: action,
      openForNewPaymentOut: action,
      closeDialog: action,
      currentVendorBalance: observable,
      isPaymentOutList: observable,
      setcurrentBalance: action,
      reset: action,
      isUpdate: observable,
      paidPaymentOpen: action,
      generateReceiptNumber: action,
      viewOrEditPaymentOutTxnItem: action,
      deletePaymentOutTxnItem: action,
      getBalanceAfterLinkedAmount: computed,
      openLinkpaymentPage: observable,
      paymentLinkTransactions: observable,
      setPaymentOutInvoiceRegular: action,
      setPaymentOutInvoiceThermal: action,
      setPaymentMode: action,
      setBankAccountData: action,
      setPaymentReferenceNumber: action,
      openPayOutNumModal: observable,
      openPayOutSeqNumCheck: observable,
      handlePaymentOutSearchWithPrefix: action,
      handlePaymentOutSearchWithSubPrefix: action,
      viewAndRestorePaymentOut: action,
      restorePaymentOut: action,
      printPaymentOutData: observable,
      resetPaymentOutPrintData: action,
      closeDialogForSaveAndPrint: action,
      printPaymentOutBalance: observable,
      manualSequenceNumber: observable,
      openPaymentOutLoadingAlertMessage: observable,
      openPaymentOutErrorAlertMessage: observable,
      openPaymentOutPrintSelectionAlert: observable,
      openSplitPaymentDetails: observable,
      chosenPaymentType: observable,
      splitPaymentSettingsData: observable,
      openMakePaymentSplitPaymentDetails: observable,
      sequenceNumberFailureAlert: observable
    });
  }
}
export default new PaymentOutStore();
