import { action, computed, makeObservable, observable, runInAction, toJS } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import _uniqueId from 'lodash/uniqueId';
import * as Bd from '../../components/SelectedBusiness';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import * as dateHelper from '../../components/Helpers/DateHelper';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';
import * as balanceUpdate from '../../components/Helpers/CustomerAndVendorBalanceHelper';
import * as lp from '../../components/Helpers/LinkPaymentHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

class PaymentInStore {
  newCustomer = false;

  isUpdate = false;

  OpenAddPaymentIn = false;
  OpenReceivePayment = false;
  receivePaymentTxnType = '';
  receivePaymentTxnId = 0;
  currentCustomerBalance = 0;
  newCustomerData = {};
  openReceivePaymentForScheme = false;
  openReceivePaymentForSession = false;

  paymentDetails = {
    businessId: '',
    businessCity: '',
    date: '',
    receiptNumber: '',
    sequenceNumber: '',
    customerId: '',
    customerName: '',
    customerReceivable: false,
    customer_address: '',
    customer_phoneNo: '',
    customer_city: '',
    customer_emailId: '',
    customer_pincode: '',
    paymentType: 'cash',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    linkPayment: false,
    linked_amount: 0,
    balance: '',
    received: '',
    total: '',
    paymentIn: true,
    linkedTxnList: [],
    updatedAt: Date.now(),
    paymentReferenceNumber: '',
    customerGSTNo: '',
    customerGstType: '',
    customerState: '',
    customerCountry: '',
    tcsAmount: 0,
    tcsName: '',
    tcsRate: 0,
    tcsCode: '',
    tdsAmount: 0,
    tdsName: '',
    tdsRate: 0,
    tdsCode: '',
    splitPaymentList: [],
    customerPanNumber: '',
    isSyncedToServer: false,
    calculateStockAndBalance: true
  };

  existingPaymentDetails = {
    businessId: '',
    businessCity: '',
    date: '',
    receiptNumber: '',
    sequenceNumber: '',
    customerId: '',
    customerName: '',
    paymentType: 'cash',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    balance: '',
    received: '',
    total: '',
    paymentIn: true,
    linkedTxnList: [],
    updatedAt: Date.now(),
    linkPayment: false,
    linked_amount: 0,
    paymentReferenceNumber: '',
    customerGSTNo: '',
    customerGstType: '',
    customerState: '',
    customerCountry: '',
    tcsAmount: 0,
    tcsName: '',
    tcsRate: 0,
    tcsCode: '',
    tdsAmount: 0,
    tdsName: '',
    tdsRate: 0,
    tdsCode: '',
    splitPaymentList: [],
    customerPanNumber: '',
    isSyncedToServer: false,
    calculateStockAndBalance: true
  };

  sequenceData = {};

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

  isPaymentInList = false;

  paymentInInvoiceRegular = {};
  paymentInInvoiceThermal = {};
  openPayInManuelSeqNumModal = false;
  openPayInManuelSeqNumCheck = false;
  isRestore = false;

  printPaymentInData = null;

  isSaveAndNew = false;

  printBalance = {};

  manualSequenceNumber = '';
  isSequenceNuberExist = false;

  openPaymentInLoadingAlertMessage = false;
  openPaymentInErrorAlertMessage = false;

  openPaymentInPrintSelectionAlert = false;

  splitPaymentSettingsData = {};
  chosenPaymentType = 'Cash';
  openSplitPaymentDetails = false;
  bankAccountsList = [];
  openReceivePaymentSplitPaymentDetails = false;
  sequenceNumberFailureAlert = false;

  handlePaymentInManuelSeqNumModalClose = async () => {
    runInAction(() => {
      this.openPayInManuelSeqNumModal = false;
      this.isSequenceNuberExist = false;
      this.manualSequenceNumber = '';
    });
  };

  setPaymentInSequenceNumber = async (value) => {
    runInAction(() => {
      this.paymentDetails.sequenceNumber = value;
    });
  };

  setPaymentInManualSequenceNumber = (value) => {
    runInAction(() => {
      this.manualSequenceNumber = value;
    });
  };

  checkPaymentInSequenceNumber = async () => {
    //check id this sequence number exist or not
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    this.isSequenceNuberExist = false;
    await db.paymentin
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
      this.handlePayInManuelSeqNumCheckOpen();
    } else {
      if (!this.isSequenceNuberExist && this.manualSequenceNumber !== '') {
        this.paymentDetails.sequenceNumber = this.manualSequenceNumber;
      }
      this.openPayInManuelSeqNumModal = false;
      this.isSequenceNuberExist = false;
      this.manualSequenceNumber = '';
    }
  };

  handlePaymentInNumModalOpen = async () => {
    runInAction(() => {
      this.openPayInManuelSeqNumModal = true;
    });
  };

  handlePaymentInManuelSeqNumCheckClose = async () => {
    runInAction(() => {
      this.openPayInManuelSeqNumModal = false;
      this.isSequenceNuberExist = false;
      this.manualSequenceNumber = '';
    });
  };

  handlePayInManuelSeqNumCheckOpen = async () => {
    runInAction(() => {
      this.openPayInManuelSeqNumCheck = true;
    });
  };

  handlePayInManuelSeqNumCheckClose = async () => {
    runInAction(() => {
      this.openPayInManuelSeqNumCheck = false;
    });
  };

  viewOrEditPaymentInTxnItem = async (item) => {
    this.viewOrEditItem(item);
  };

  closeLinkPayment = () => {
    console.log('clicked close');
    this.openLinkpaymentPage = false;
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

  deletePaymentInTxnItem = async (item) => {
    if (
      !('calculateStockAndBalance' in item) ||
      !item.calculateStockAndBalance
    ) {
      item.calculateStockAndBalance = true;
    }
    await this.deletePaymentIn(item);
  };

  setLinkPayment = async () => {
    this.openLinkpaymentPage = true;
  };

  viewOrEditItem = async (item) => {
    console.log(JSON.stringify(item, null, 2));
    const { paymentType, linked_amount, customerId } = item;

    runInAction(() => {
      this.OpenAddPaymentIn = true;
      this.isUpdate = true;
      this.isRestore = false;
      this.paymentInInvoiceRegular = {};
      this.paymentInInvoiceThermal = {};
      this.sequenceData = {};
      this.paymentDetails = item;
      this.chosenPaymentType = paymentType === 'Split' ? 'Split' : 'Cash';
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.paymentDetails.splitPaymentList =
        this.paymentDetails.splitPaymentList || [];
      this.existingPaymentDetails = item;

      if (linked_amount > 0) {
        this.paymentDetails.linkPayment = true;
      }
    });

    await this.setCustomerBalance();

    if (linked_amount > 0) {
      await lp.getAllLinkedTxnData(this, this.paymentDetails, 'Payment In');
    }

    const db = await Db.get();
    await lp.getAllUnPaidTxnForCustomer(this, db, customerId, 'Payment In');
  };

  setCustomerBalance = async () => {
    const customerData = await balanceUpdate.getCustomerBalanceById(
      this.paymentDetails.customerId
    );

    this.currentCustomerBalance = parseFloat(customerData.totalBalance || 0);

    if (
      customerData.balanceType === 'Receivable' &&
      customerData.totalBalance > 0
    ) {
      this.paymentDetails.customerReceivable = true;
    } else {
      this.paymentDetails.customerReceivable = false;
    }
  };

  getPaymentInCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.paymentin
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isPaymentInList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  generateReceiptNumber = async () => {
    const businessData = await Bd.getBusinessData();

    const appId = businessData.posDeviceId;
    const timestamp = Math.floor(Date.now() / 60000);
    const id = _uniqueId('pi');

    runInAction(() => {
      this.paymentDetails.receiptNumber = `${id}${appId}${timestamp}`;
      this.paymentDetails.businessId = businessData.businessId;
      this.paymentDetails.businessCity = businessData.businessCity;
    });
  };

  setPaymentInProperty = (property, value) => {
    this.paymentDetails[property] = value;
    // console.log(this.paymentDetails);
  };

  setPaymentInCustomerName = (value) => {
    this.paymentDetails.customerName = value;
  };

  closeReceivePaymentDialog = async () => {
    this.OpenReceivePayment = false;
    this.receivePaymentTxnId = 0;
    this.receivePaymentTxnType = '';
    this.reset();
  };

  receivePaymentOpen = async (item) => {
    this.reset();
    this.paymentDetails.customerId = item.customer_id;
    this.paymentDetails.customerName = item.customer_name;
    this.generateReceiptNumber();
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();
    db.parties
      .findOne({
        selector: {
          $and: [
            { id: item.customer_id },
            { businessId: { $eq: businessData.businessId } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        this.currentCustomerBalance = data.balance;
        this.paymentDetails.balanceToPay = item.balance_amount;
        // console.log('data::', data);

        if (data.balanceType === 'Receivable' && data.balance > 0) {
          this.paymentDetails.customerReceivable = true;
        } else {
          this.paymentDetails.customerReceivable = false;
        }

        this.OpenReceivePayment = true;

        this.receivePaymentTxnId = item.invoice_number;
        this.receivePaymentTxnType = 'Sales';
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

  receivePaymentOpenForVendor = async (item) => {
    this.reset();
    this.paymentDetails.customerId = item.vendor_id;
    this.paymentDetails.customerName = item.vendor_name;
    this.generateReceiptNumber();
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
          // No customer is available
          return;
        }
        this.currentCustomerBalance = data.balance;
        this.paymentDetails.balanceToPay = item.balance_amount;

        // console.log('data::', data);

        if (data.balanceType === 'Payable' && data.balance > 0) {
          this.paymentDetails.customerReceivable = false;
        } else {
          this.paymentDetails.customerReceivable = true;
        }

        // console.log(
        //   'receivePaymentOpen paymentDetails:::',
        //   this.paymentDetails
        // );

        this.OpenReceivePayment = true;

        this.receivePaymentTxnId = item.purchase_return_number;
        this.receivePaymentTxnType = 'Purchases Return';
      });
  };

  setpaymentInCustomer = async (customer, isNewCustomer) => {
    this.paymentDetails.customerId = customer.id;
    this.paymentDetails.customerName = customer.name;

    this.paymentDetails.customer_address = customer.address;
    this.paymentDetails.customer_phoneNo = customer.phoneNo;
    this.paymentDetails.customer_pincode = customer.pincode;
    this.paymentDetails.customer_city = customer.city;
    this.paymentDetails.customer_emailId = customer.emailId;

    this.paymentDetails.customerState = customer.state;
    this.paymentDetails.customerCountry = customer.country;
    this.paymentDetails.customerGSTNo = customer.gstNumber;
    this.paymentDetails.customerGstType = customer.gstType;
    this.paymentDetails.customerPanNumber = customer.panNumber;

    // console.log(this.paymentDetails);

    /**
     * get all txn which are un paid
     */
    const db = await Db.get();
    await lp.getAllUnPaidTxnForCustomer(this, db, customer.id, 'Payment In');

    this.isNewCustomer = isNewCustomer;
    if (isNewCustomer) {
      this.newCustomerData = customer;
    }

    if (customer.balanceType === 'Receivable' && customer.balance > 0) {
      this.paymentDetails.customerReceivable = true;
    } else {
      this.paymentDetails.customerPayable = false;
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

  setReceived = (value) => {
    this.paymentDetails.received = parseFloat(value) || 0;
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

  setTotal = (value) => {
    value = parseFloat(this.paymentDetails.received);
    this.paymentDetails.balance = value;
    return this.paymentDetails.balance;
  };

  reset = () => {
    const currentDate = getTodayDateInYYYYMMDD();

    this.paymentDetails = {
      businessId: '',
      businessCity: '',
      date: currentDate,
      customerId: '',
      customerName: '',
      customer_address: '',
      customer_phoneNo: '',
      customer_city: '',
      customer_emailId: '',
      customer_pincode: '',
      paymentType: 'cash',
      bankAccount: '',
      bankAccountId: '',
      bankPaymentType: '',
      balance: '',
      received: '',
      total: '',
      paymentIn: true,
      linkedTxnList: [],
      updatedAt: '',
      linkPayment: false,
      linked_amount: 0,
      paymentReferenceNumber: '',
      customerGSTNo: '',
      customerGstType: '',
      customerState: '',
      customerCountry: '',
      tcsAmount: 0,
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      tdsAmount: 0,
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      splitPaymentList: [],
      customerPanNumber: '',
      isSyncedToServer: false,
      calculateStockAndBalance: true
    };
    this.currentCustomerBalance = 0;
  };

  openForNewPaymnetIn = () => {
    this.isUpdate = false;

    this.OpenAddPaymentIn = true;

    this.paymentInInvoiceRegular = {};
    this.paymentInInvoiceThermal = {};
    this.sequenceData = {};
    this.printPaymentInData = null;
    this.printBalance = {};
    this.openPaymentInPrintSelectionAlert = false;
    this.chosenPaymentType = 'Cash';
    this.reset();
    this.generateReceiptNumber();
  };

  closeDialog = () => {
    this.OpenAddPaymentIn = false;
    this.paymentLinkTransactions = [];
  };

  setcurrentBalance = (customer) => {
    this.currentCustomerBalance = customer.balance;
  };

  savePaymentData = async (isSaveAndNew, isPrint) => {
    this.isSaveAndNew = isSaveAndNew;

    const linkedAmount = parseFloat(this.paymentDetails.linked_amount) || 0;
    const receivedAmount = parseFloat(this.paymentDetails.received);

    if (linkedAmount > 0 && receivedAmount < linkedAmount) {
      this.handleClosePaymentInLoadingMessage();
      alert('Received Amount should be greater than or equal to Linked Amount');
      return;
    }

    if (!this.paymentDetails.receiptNumber) {
      alert('Receipt Number is not given');
      return;
    }

    const db = await Db.get();

    const fieldsToCheck = [
      'balance',
      'received',
      'total',
      'tcsAmount',
      'tcsRate',
      'tdsAmount',
      'tdsRate'
    ];
    fieldsToCheck.forEach((field) => {
      this.paymentDetails[field] =
        this.paymentDetails[field] === '' ? 0 : this.paymentDetails[field];
    });

    if (this.paymentDetails.splitPaymentList?.length > 0) {
      this.paymentDetails.splitPaymentList.forEach((item) => {
        item.amount = parseFloat(item.amount) || 0;
      });
    }

    this.paymentDetails.paymentType =
      this.chosenPaymentType === 'Split'
        ? this.chosenPaymentType
        : this.paymentDetails.paymentType;
    this.paymentDetails.calculateStockAndBalance =
      this.paymentDetails.calculateStockAndBalance ?? true;

    if (this.isUpdate) {
      await this.updatePaymentData(db, isPrint);
    } else {
      await this.savePaymentInData(db, isPrint);
    }
  };

  deletePaymentIn = async (item) => {
    const db = await Db.get();

    this.paymentDetails = item;

    let DeleteDataDoc = {
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      total: 0,
      balance: 0,
      data: ''
    };

    DeleteDataDoc.transactionId = this.paymentDetails.receiptNumber;
    DeleteDataDoc.sequenceNumber = this.paymentDetails.sequenceNumber;
    DeleteDataDoc.transactionType = 'Payment In';
    DeleteDataDoc.data = JSON.stringify(this.paymentDetails);
    DeleteDataDoc.total = this.paymentDetails.total;
    DeleteDataDoc.balance = 0;
    DeleteDataDoc.createdDate = this.paymentDetails.date;

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    /**
     * update paymnet in entry
     */
    const businessData = await Bd.getBusinessData();

    const query = db.paymentin.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { receiptNumber: { $eq: this.paymentDetails.receiptNumber } }
        ]
      }
    });
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Sales data is found so cannot update any information
          return;
        }

        //delete from all txn data
        await allTxn.deleteTxnFromPaymentIn(this.paymentDetails, db);

        /**
         * un link payments if there are any
         */
        if (this.paymentDetails.linked_amount > 0) {
          this.unLinkPayment(db, this.paymentDetails);
        }

        if (
          !('calculateStockAndBalance' in this.paymentDetails) ||
          !this.paymentDetails.calculateStockAndBalance
        ) {
          /**
           * reverse old account to customer
           */
          await balanceUpdate.decrementBalance(
            db,
            this.paymentDetails.customerId,
            this.paymentDetails.received
          );
        }

        //save to audit
        audit.addAuditEvent(
          this.paymentDetails.receiptNumber,
          this.paymentDetails.sequenceNumber,
          'Payment In',
          'Delete',
          JSON.stringify(this.paymentDetails),
          '',
          this.paymentDetails.date
        );

        /**
         * delete from payment in table
         */
        await query
          .remove()
          .then((data) => {
            console.log('data removed' + data);
          })
          .catch((error) => {
            console.log('payment in data removal Failed ' + error);
            // alert('Error in Removing Data');
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        //save to audit
        audit.addAuditEvent(
          this.paymentDetails.receiptNumber,
          this.paymentDetails.sequenceNumber,
          'Payment In',
          'Delete',
          JSON.stringify(this.paymentDetails),
          err.message,
          this.paymentDetails.date
        );
      });

    /**
     * make global variables to nulls again
     */
    this.unLinkedTxnList = [];
  };
  getSequenceNumber = async (date, id) => {
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      runInAction(() => {
        this.sequenceData.appendYear = transSettings.paymentIn.appendYear;
        this.sequenceData.multiDeviceBillingSupport =
          transSettings.multiDeviceBillingSupport;
      });
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      runInAction(() => {
        this.sequenceData.prefix = localStorage.getItem('deviceName');
        this.sequenceData.subPrefix = 'PayIn';
      });
      isOnline = false;
    }

    this.paymentDetails.sequenceNumber = await sequence.getFinalSequenceNumber(
      this.sequenceData,
      'Payment In',
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
  };

  savePaymentInData = async (db, isPrint) => {
    // console.log('save::', this.paymentDetails);
    this.paymentDetails.balance = parseFloat(this.paymentDetails.total);
    this.paymentDetails.received = parseFloat(this.paymentDetails.received);
    this.paymentDetails.total = parseFloat(this.paymentDetails.total);

    /**
     * check if it is receive payment
     * if it is then link that first then move to others pending txn
     */
    /**
     * receive payment happens at sale and purchase return
     */

    if (this.OpenReceivePayment) {
      this.paymentDetails.linkPayment = true;

      if (
        this.receivePaymentTxnType === 'Sales' ||
        this.receivePaymentTxnType === 'KOT'
      ) {
        await this.updateReceiveSaleTxnAmount(db, this.receivePaymentTxnId);
      } else if (this.receivePaymentTxnType === 'Purchases Return') {
        await this.receivePurchasesReturnTxnAmount(
          db,
          this.receivePaymentTxnId
        );
      }
    }

    if (this.receivePaymentTxnType === 'Scheme') {
      await this.updateReceiveSchemeTxnAmount(db, this.receivePaymentTxnId);
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
      this.handleClosePaymentInLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    /**
     * link payment
     */

    if (
      this.paymentDetails['linkPayment'] ||
      parseFloat(this.paymentDetails.linked_amount) > 0
    ) {
      await this.linkPayment(db);
    } else {
      this.paymentDetails.linkedTxnList = [];
    }

    if (
      !('calculateStockAndBalance' in this.paymentDetails) ||
      !this.paymentDetails.calculateStockAndBalance
    ) {
      /**
       * update customer balance
       */
      await balanceUpdate.incrementBalance(
        db,
        this.paymentDetails.customerId,
        this.paymentDetails.received
      );
    }

    /**
     * insert payment In data
     */
    let finalPaymentDetails = {};

    finalPaymentDetails.businessId = this.paymentDetails.businessId;
    finalPaymentDetails.businessCity = this.paymentDetails.businessCity;
    finalPaymentDetails.date = this.paymentDetails.date;
    finalPaymentDetails.receiptNumber = this.paymentDetails.receiptNumber;
    finalPaymentDetails.sequenceNumber = this.paymentDetails.sequenceNumber;
    finalPaymentDetails.customerId = this.paymentDetails.customerId;
    finalPaymentDetails.customerName = this.paymentDetails.customerName;
    finalPaymentDetails.paymentType = this.paymentDetails.paymentType;
    finalPaymentDetails.received = this.paymentDetails.received;
    finalPaymentDetails.total = this.paymentDetails.total;
    finalPaymentDetails.linkedTxnList = this.paymentDetails.linkedTxnList;
    finalPaymentDetails.updatedAt = Date.now();
    finalPaymentDetails.linkPayment = this.paymentDetails.linkPayment;
    finalPaymentDetails.customer_phoneNo = this.paymentDetails.customer_phoneNo;
    finalPaymentDetails.prefix = this.paymentDetails.prefix;
    finalPaymentDetails.subPrefix = this.paymentDetails.subPrefix;

    finalPaymentDetails.balance =
      parseFloat(this.paymentDetails.received) -
      (parseFloat(this.paymentDetails.linked_amount) || 0);

    const businessData = await Bd.getBusinessData();
    finalPaymentDetails.linked_amount = this.paymentDetails.linked_amount;
    finalPaymentDetails.posId = parseFloat(businessData.posDeviceId);

    if (this.isRestore) {
      finalPaymentDetails.employeeId = this.paymentDetails.employeeId;
    } else {
      try {
        /**
         * add employee information
         */
        finalPaymentDetails.employeeId = JSON.parse(
          localStorage.getItem('loginDetails')
        ).username;
      } catch (e) {
        console.error('Error: ', e.message);
      }
    }

    /**
     * bank details
     */
    finalPaymentDetails.bankAccount = this.paymentDetails.bankAccount;
    finalPaymentDetails.bankAccountId = this.paymentDetails.bankAccountId;
    finalPaymentDetails.bankPaymentType = this.paymentDetails.bankPaymentType;

    finalPaymentDetails.paymentReferenceNumber =
      this.paymentDetails.paymentReferenceNumber;

    finalPaymentDetails.customerGSTNo = this.paymentDetails.customerGSTNo;
    finalPaymentDetails.customerGstType = this.paymentDetails.customerGstType;
    finalPaymentDetails.customerState = this.paymentDetails.customerState;
    finalPaymentDetails.customerCountry = this.paymentDetails.customerCountry;
    finalPaymentDetails.customer_address = this.paymentDetails.customer_address;
    finalPaymentDetails.customer_emailId = this.paymentDetails.customer_emailId;
    finalPaymentDetails.customer_pincode = this.paymentDetails.customer_pincode;
    finalPaymentDetails.customer_city = this.paymentDetails.customer_city;
    finalPaymentDetails.tcsAmount = this.paymentDetails.tcsAmount;
    finalPaymentDetails.tcsName = this.paymentDetails.tcsName;
    finalPaymentDetails.tcsRate = this.paymentDetails.tcsRate;
    finalPaymentDetails.tcsCode = this.paymentDetails.tcsCode;
    finalPaymentDetails.tdsAmount = this.paymentDetails.tdsAmount;
    finalPaymentDetails.tdsName = this.paymentDetails.tdsName;
    finalPaymentDetails.tdsRate = this.paymentDetails.tdsRate;
    finalPaymentDetails.tdsCode = this.paymentDetails.tdsCode;
    finalPaymentDetails.splitPaymentList = this.paymentDetails.splitPaymentList;
    finalPaymentDetails.customerPanNumber =
      this.paymentDetails.customerPanNumber;
    finalPaymentDetails.paymentIn = true;
    finalPaymentDetails.isSyncedToServer = this.paymentDetails.isSyncedToServer;

    finalPaymentDetails.calculateStockAndBalance =
      this.paymentDetails.calculateStockAndBalance;

    // Checking and assigning default values
    this.assignDefaultIfEmpty(finalPaymentDetails, 'customerReceivable', false);
    this.assignDefaultIfEmpty(finalPaymentDetails, 'linkPayment', false);
    this.assignDefaultIfEmpty(finalPaymentDetails, 'linked_amount', 0);
    this.assignDefaultIfEmpty(finalPaymentDetails, 'balance', 0);
    this.assignDefaultIfEmpty(finalPaymentDetails, 'received', 0);
    this.assignDefaultIfEmpty(finalPaymentDetails, 'total', 0);
    this.assignDefaultIfEmpty(finalPaymentDetails, 'paymentIn', true);

    let userAction = 'Save';

    if (this.isRestore) {
      userAction = 'Restore';
      await this.markPaymentInRestored();
    }

    const receiptOrPayment = await allTxn.saveTxnFromPaymentIn(
      finalPaymentDetails,
      db
    );

    finalPaymentDetails.receiptOrPayment = receiptOrPayment;

    //save to audit
    audit.addAuditEvent(
      finalPaymentDetails.receiptNumber,
      finalPaymentDetails.sequenceNumber,
      'Payment In',
      userAction,
      JSON.stringify(finalPaymentDetails),
      '',
      finalPaymentDetails.date
    );

    await db.paymentin
      .insert(finalPaymentDetails)
      .then(async (data) => {
        if (
          isPrint &&
          this.paymentInInvoiceThermal &&
          this.paymentInInvoiceThermal.boolDefault
        ) {
          runInAction(async () => {
            sendContentForThermalPrinter(
              finalPaymentDetails.customerId,
              this.paymentInInvoiceThermal,
              finalPaymentDetails
            );
          });
        }

        if (
          this.paymentInInvoiceRegular &&
          this.paymentInInvoiceRegular.boolDefault &&
          isPrint
        ) {
          this.printPaymentInData = finalPaymentDetails;

          this.handleClosePaymentInLoadingMessage();
          /**
           * close receive payment
           */
          this.closeReceivePaymentDialog();
          this.closeReceivePaymentSchemeDialog();
          this.closeReceivePaymentSessionDialog();

          /**
           * make used global variable to deafult values
           */
          this.paymentLinkTransactions = [];

          if (this.isSaveAndNew) {
            this.isSaveAndNew = false;
            this.reset();
          }

          if (!this.isSaveAndNew) {
            this.closeDialog();
          }

          this.sequenceData = {};

          runInAction(() => {
            this.isPaymentInList = true;
          });

          this.handleOpenPaymentInPrintSelectionAlertMessage();
        } else {
          this.handleClosePaymentInLoadingMessage();
          /**
           * close receive payment
           */
          this.closeReceivePaymentDialog();
          this.closeReceivePaymentSchemeDialog();
          this.closeReceivePaymentSessionDialog();

          /**
           * make used global variable to deafult values
           */
          this.paymentLinkTransactions = [];

          if (this.isSaveAndNew) {
            //this.isSaveAndNew = false;
            this.reset();
            this.generateReceiptNumber();
          }

          if (!this.isSaveAndNew) {
            this.closeDialog();
          }

          this.sequenceData = {};

          runInAction(() => {
            this.isPaymentInList = true;
          });
        }
      })
      .catch((err) => {
        console.log('data Insertion Failed', err);
        //save to audit
        audit.addAuditEvent(
          finalPaymentDetails.receiptNumber,
          finalPaymentDetails.sequenceNumber,
          'Payment In',
          userAction,
          JSON.stringify(finalPaymentDetails),
          err.message ? err.message : 'Payment In Failed',
          finalPaymentDetails.date
        );
        this.handleClosePaymentInLoadingMessage();
        this.handleOpenPaymentInErrorAlertMessage();
      });
  };

  assignDefaultIfEmpty = async (obj, prop, defaultValue) => {
    if (obj[prop] === null || obj[prop] === '') {
      obj[prop] = defaultValue;
    }
  };

  linkPayment = async (db) => {
    this.paymentDetails.linkedTxnList = [];

    const txnList = await lp.linkPayment(
      db,
      this.paymentDetails,
      this.paymentLinkTransactions,
      'Payment In'
    );

    if (txnList) {
      txnList.forEach((txn) => this.paymentDetails.linkedTxnList.push(txn));
    }

    this.paymentLinkTransactions = [];
  };

  updatePaymentData = async (db, isPrint) => {
    this.paymentDetails.balance =
      parseFloat(this.paymentDetails.received) -
      parseFloat(this.paymentDetails.linked_amount);

    // Update payment in entry
    const businessData = await Bd.getBusinessData();

    const query = db.paymentin.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { receiptNumber: { $eq: this.paymentDetails.receiptNumber } }
        ]
      }
    });

    await query.exec().then(async (data) => {
      if (!data) {
        // No payment in data found, cannot update any information
        return;
      }

      // Unlink payments if there are any
      const { existingPaymentDetails, paymentDetails } = this;

      //destructuring assignment operation
      const {
        linkPayment: existingLinkPayment,
        linked_amount: existingLinkedAmount,
        received: previousAmount,
        customerId: existingCustomerId
      } = existingPaymentDetails;

      //destructuring assignment operation
      const {
        linkPayment: newLinkPayment,
        linked_amount: newLinkedAmount,
        customerId: newCustomerId,
        received: newReceived,
        calculateStockAndBalance
      } = paymentDetails;

      const difference = parseFloat(newReceived) - parseFloat(previousAmount);

      if (existingLinkPayment && Number(existingLinkedAmount) > 0) {
        console.log(
          `unlink payments :: ${JSON.stringify(existingPaymentDetails)}`
        );

        await this.unLinkPayment(db, existingPaymentDetails);
      }

      if (!calculateStockAndBalance) {
        if (difference > 0) {
          await balanceUpdate.incrementBalance(db, newCustomerId, difference);
        } else if (difference < 0) {
          await balanceUpdate.decrementBalance(
            db,
            existingCustomerId,
            Math.abs(difference)
          );
        }
      }

      if (newLinkPayment && Number(newLinkedAmount) > 0) {
        console.log(`link payments :: ${JSON.stringify(paymentDetails)}`);

        await this.linkPayment(db);
      } else {
        this.paymentDetails.linkedTxnList = [];
      }

      this.paymentDetails.receiptOrPayment = await allTxn.deleteAndSaveTxnFromPaymentIn(
        this.existingPaymentDetails,
        this.paymentDetails,
        db
      );

      // Save to audit
      await audit.addAuditEvent(
        this.paymentDetails.receiptNumber,
        this.paymentDetails.sequenceNumber,
        'Payment In',
        'Update',
        JSON.stringify(this.paymentDetails),
        '',
        this.paymentDetails.date
      );

      // Checking and assigning default values
      this.assignDefaultIfEmpty(
        this.paymentDetails,
        'customerReceivable',
        false
      );
      this.assignDefaultIfEmpty(this.paymentDetails, 'linkPayment', false);
      this.assignDefaultIfEmpty(this.paymentDetails, 'linked_amount', 0);
      this.assignDefaultIfEmpty(this.paymentDetails, 'balance', 0);
      this.assignDefaultIfEmpty(this.paymentDetails, 'received', 0);
      this.assignDefaultIfEmpty(this.paymentDetails, 'total', 0);
      this.assignDefaultIfEmpty(this.paymentDetails, 'paymentIn', true);

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
            balance: parseFloat(this.paymentDetails.balance),
            received: parseFloat(this.paymentDetails.received),
            total: parseFloat(this.paymentDetails.total),
            linkedTxnList: this.paymentDetails.linkedTxnList,
            paymentReferenceNumber: this.paymentDetails.paymentReferenceNumber,
            updatedAt: Date.now(),
            splitPaymentList: this.paymentDetails.splitPaymentList,
            receiptOrPayment: this.paymentDetails.receiptOrPayment
          }
        })
        .then(async () => {
          let finalPaymentDetails = { ...this.paymentDetails };
          if (
            isPrint &&
            this.paymentInInvoiceThermal &&
            this.paymentInInvoiceThermal.boolDefault
          ) {
            runInAction(async () => {
              sendContentForThermalPrinter(
                finalPaymentDetails.customerId,
                this.paymentInInvoiceThermal,
                finalPaymentDetails
              );
            });
          }

          if (
            this.paymentInInvoiceRegular &&
            this.paymentInInvoiceRegular.boolDefault &&
            isPrint
          ) {
            // Set payment data for regular invoice printing
            this.printPaymentInData = finalPaymentDetails;

            this.handleClosePaymentInLoadingMessage();
            // Close receive payment
            this.closeReceivePaymentDialog();
            this.closeReceivePaymentSchemeDialog();
            this.closeReceivePaymentSessionDialog();

            // Reset payment link transactions
            this.paymentLinkTransactions = [];

            if (this.isSaveAndNew) {
              this.isSaveAndNew = false;
              this.reset();
            }

            if (!this.isSaveAndNew) {
              this.closeDialog();
            }

            this.sequenceData = {};

            runInAction(() => {
              this.isPaymentInList = true;
            });

            // Open payment in print selection alert message
            this.handleOpenPaymentInPrintSelectionAlertMessage();
          } else {
            this.handleClosePaymentInLoadingMessage();
            // Close receive payment
            this.closeReceivePaymentDialog();

            if (this.isSaveAndNew) {
              // this.isSaveAndNew = false;
              this.reset();
              this.generateReceiptNumber();
            }

            if (!this.isSaveAndNew) {
              this.closeDialog();
            }

            this.sequenceData = {};

            runInAction(() => {
              this.isPaymentInList = true;
            });
          }

          // Reset global variables
          this.paymentLinkTransactions = [];
          this.unLinkedTxnList = [];
          this.isUpdate = false;

          runInAction(() => {
            this.isPaymentInList = true;
          });
        })
        .catch((err) => {
          console.log('Internal Server Error', err);

          // Save to audit
          audit.addAuditEvent(
            this.paymentDetails.receiptNumber,
            this.paymentDetails.sequenceNumber,
            'Payment In',
            'Update',
            JSON.stringify(this.paymentDetails),
            err.message ? err.message : 'Payment In Failed',
            this.paymentDetails.date
          );
        });
    });
  };

  unLinkPayment = async (db, paymentDetails) => {
    await lp.unLinkPayment(db, paymentDetails, 'Payment In');

    paymentDetails.linkedTxnList.forEach((item) => {
      this.unLinkedTxnList.push(item);
    });

    /**
     * make used global variable to default values
     */
    this.paymentUnLinkTransactions = [];
  };

  updateReceiveSaleTxnAmount = async (db, invoice_number) => {
    /**
     * since it only get one record setting to empty
     */
    this.paymentLinkTransactions = [];
    const businessData = await Bd.getBusinessData();

    // console.log('getSaledata');
    await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_number: { $eq: invoice_number }
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
        // console.log('sales', item.toJSON());
        let finalData = data.toJSON();
        finalData.paymentType = 'Sales';
        finalData.date = data.invoice_date;
        finalData.id = data.invoice_number;
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

  receivePurchasesReturnTxnAmount = async (db, purchase_return_number) => {
    console.log('receivePurchasesReturnTxnAmount');

    /**
     * since it only get one record setting to empty
     */
    this.paymentLinkTransactions = [];
    const businessData = await Bd.getBusinessData();

    await db.purchasesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              purchase_return_number: { $eq: purchase_return_number }
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
        console.log('purchasesreturn', toJS(data));
        let finalData = data.toJSON();
        finalData.paymentType = 'Purchases Return';

        finalData.id = data.purchase_return_number;
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

  selectedPaymentItem = async (row) => {
    const index = this.paymentLinkTransactions.findIndex(
      (x) => x.id === row.id
    );

    if (index !== -1) {
      const txnSelected = this.paymentLinkTransactions[index];
      const receivedAmount = Number(this.paymentDetails.received) || 0;
      let linkedAmount = Number(this.paymentDetails.linked_amount) || 0;
      let amountToLink = receivedAmount - linkedAmount;

      if (txnSelected.balance >= amountToLink) {
        txnSelected.linkedAmount = amountToLink;
        this.paymentDetails.linked_amount += amountToLink;
      } else {
        txnSelected.linkedAmount = txnSelected.balance;
        this.paymentDetails.linked_amount += txnSelected.balance;
      }

      txnSelected.selected = true;
      txnSelected.balance -= txnSelected.linkedAmount;
      this.paymentLinkTransactions[index] = txnSelected;
    }
  };

  unSelectedPaymentItem = (row) => {
    const index = this.paymentLinkTransactions.findIndex(
      (x) => x.id === row.id
    );

    if (index !== -1) {
      const txnSelected = this.paymentLinkTransactions[index];
      const linkedAmount = txnSelected.linkedAmount;

      this.paymentDetails.linked_amount -= linkedAmount;
      txnSelected.selected = false;
      txnSelected.balance += linkedAmount;
      txnSelected.linkedAmount = 0;

      this.paymentLinkTransactions[index] = txnSelected;
    }
  };

  autoLinkPayment = async () => {
    await this.resetLinkPayment();

    const receivedAmount = Number(this.paymentDetails.received) || 0;
    let linkedAmount = Number(this.paymentDetails.linked_amount) || 0;

    let amountToLink = receivedAmount - linkedAmount;

    if (amountToLink > 0) {
      let finalLinkedAmount = 0;
      for (let txn of this.paymentLinkTransactions) {
        if (txn.balance > 0 && finalLinkedAmount < amountToLink) {
          txn.linkedAmount = Math.min(
            txn.balance,
            amountToLink - finalLinkedAmount
          );
          finalLinkedAmount += txn.linkedAmount;
          txn.selected = true;
          txn.balance -= txn.linkedAmount;
        }
      }
      this.paymentDetails.linked_amount = finalLinkedAmount;
    }
  };

  resetLinkPayment = () => {
    for (let txn of this.paymentLinkTransactions) {
      if (txn?.linkedAmount >= 0) {
        this.paymentDetails.linked_amount -= txn.linkedAmount;
        txn.balance += txn.linkedAmount;

        txn.linkedAmount = 0;
        txn.selected = false;
      }
    }
  };

  get getBalanceAfterLinkedAmount() {
    return (
      Number(this.paymentDetails.received) -
        Number(this.paymentDetails.linked_amount) || 0
    );
  }

  saveLinkPaymentChanges = () => {
    if (this.paymentDetails.linked_amount > 0) {
      this.paymentDetails.linkPayment = true;
    }
    this.closeLinkPayment();
  };

  setPaymentInInvoiceRegular = (invoiceRegular) => {
    this.paymentInInvoiceRegular = invoiceRegular;
  };

  setPaymentInInvoiceThermal = (invoiceThermal) => {
    this.paymentInInvoiceThermal = invoiceThermal;
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

  getPaymentInDetailData = async () => {
    if (!this.isUpdate) {
      await this.getSequenceNumber(
        this.paymentDetails.date,
        this.paymentDetails.receiptNumber
      );
    }
    const data = {
      ...this.paymentDetails
    };
    return data;
  };

  setPaymentReferenceNumber = (value) => {
    this.paymentDetails.paymentReferenceNumber = value;
  };

  handlePaymentInSearchWithPrefix = async (value) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    let data;
    let query = await db.paymentin.find({
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

  handlePaymentInSearchWithSubPrefix = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let data;
    let query = await db.paymentin.find({
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

  viewAndRestorePaymentIn = async (item) => {
    this.isUpdate = false;
    this.isRestore = true;
    this.paymentInInvoiceRegular = {};
    this.paymentInInvoiceThermal = {};
    this.sequenceData = {};

    await this.reset();

    // Reset linked transaction details
    Object.assign(item, {
      linkedTxnList: [],
      linked_amount: 0,
      linkPayment: false,
      balance: item.total,
      calculateStockAndBalance: true
    });

    this.paymentDetails = item;
    this.chosenPaymentType =
      this.paymentDetails.paymentType === 'Split' ? 'Split' : 'Cash';

    // Get customer balance
    await this.setCustomerBalance();

    const db = await Db.get();
    await lp.getAllUnPaidTxnForCustomer(
      this,
      db,
      item.customerId,
      'Payment In'
    );

    this.OpenAddPaymentIn = true;
  };

  restorePaymentIn = async (item, isRestoreWithNextSequenceNo) => {
    this.isUpdate = false;
    this.isRestore = true;
    this.paymentInInvoiceRegular = {};
    this.paymentInInvoiceThermal = {};
    this.sequenceData = {};
    this.reset();

    item.calculateStockAndBalance =
      !('calculateStockAndBalance' in item) || !item.calculateStockAndBalance;

    // Reset linked transaction details
    Object.assign(item, {
      linkedTxnList: [],
      linked_amount: 0,
      linkPayment: false,
      balance: item.received
    });

    this.paymentDetails = item;
    this.chosenPaymentType =
      this.paymentDetails.paymentType === 'Split' ? 'Split' : 'Cash';
    this.paymentDetails.employeeId = item.employeeId;

    // Set customer balance
    await this.setCustomerBalance();

    if (isRestoreWithNextSequenceNo) {
      this.paymentDetails.date = dateHelper.getTodayDateInYYYYMMDD();

      await this.generateReceiptNumber();
      await this.getSequenceNumber(
        this.paymentDetails.date,
        this.paymentDetails.receiptNumber
      );
    }

    this.savePaymentData(false, false);
  };

  markPaymentInRestored = async () => {
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

  resetPaymentInPrintData = async () => {
    runInAction(() => {
      this.printPaymentInData = {};
      this.printBalance = {};
      this.openPaymentInPrintSelectionAlert = false;
    });
  };

  closeDialogForSaveAndPrint = () => {
    this.handleClosePaymentInLoadingMessage();
    this.closeDialog();
    /**
     * close receive payment
     */
    this.closeReceivePaymentDialog();
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
      this.isPaymentInList = true;
    });
  };

  handleOpenPaymentInLoadingMessage = async () => {
    runInAction(() => {
      this.openPaymentInLoadingAlertMessage = true;
    });
  };

  handleClosePaymentInLoadingMessage = async () => {
    runInAction(() => {
      this.openPaymentInLoadingAlertMessage = false;
    });
  };

  handleOpenPaymentInErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPaymentInErrorAlertMessage = true;
    });
  };

  handleClosePaymentInErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPaymentInErrorAlertMessage = false;
    });
  };

  handleOpenPaymentInPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPaymentInPrintSelectionAlert = true;
    });
  };

  handleClosePaymentInPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPaymentInPrintSelectionAlert = false;
    });
  };

  setSplitPaymentSettingsData = (value) => {
    runInAction(() => {
      this.splitPaymentSettingsData = value;
    });
    if (
      !this.isUpdate ||
      (this.paymentDetails.splitPaymentList &&
        this.paymentDetails.splitPaymentList.length === 0)
    ) {
      this.prepareSplitPaymentList();
    }
  };

  setBankAccountList = (value) => {
    runInAction(() => {
      this.bankAccountsList = value;
    });
  };

  setSplitPayment = (property, index, value) => {
    runInAction(() => {
      this.paymentDetails.splitPaymentList[index][property] = value;
    });
  };

  //todo make this method as common
  prepareSplitPaymentList = async () => {
    runInAction(() => {
      this.paymentDetails.splitPaymentList = [];
    });
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

        runInAction(() => {
          this.paymentDetails.splitPaymentList.push(cashPayment);
        });
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

          runInAction(() => {
            this.paymentDetails.splitPaymentList.push(giftCardPayment);
          });
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

          runInAction(() => {
            this.paymentDetails.splitPaymentList.push(customFinancePayment);
          });
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

          runInAction(() => {
            this.paymentDetails.splitPaymentList.push(bankPayment);
          });
        }
      }
    }
  };

  //todo make this method as common
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

      runInAction(() => {
        this.paymentDetails.splitPaymentList.push(bankPayment);
      });
    }
  };

  removeSplitPayment = (index) => {
    runInAction(() => {
      this.paymentDetails.splitPaymentList.splice(index, 1);
    });
  };

  setChosenPaymentType = (value) => {
    runInAction(() => {
      this.chosenPaymentType = value;
    });
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

  handleOpenReceivePaymentSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openReceivePaymentSplitPaymentDetails = true;

      if (
        this.splitPaymentSettingsData &&
        this.paymentDetails.splitPaymentList &&
        this.paymentDetails.splitPaymentList.length === 0
      ) {
        this.prepareSplitPaymentList();
      }
    });
  };

  handleCloseReceivePaymentSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openReceivePaymentSplitPaymentDetails = false;
    });
  };

  handleCloseAndResetSplitPaymentDetails = async () => {
    runInAction(() => {
      if (
        this.OpenReceivePayment === true ||
        this.openReceivePaymentForScheme === true ||
        this.openReceivePaymentForSession === true
      ) {
        this.openReceivePaymentSplitPaymentDetails = false;
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
    runInAction(() => {
      this.paymentDetails.paymentType = 'cash';
      this.chosenPaymentType = 'Cash';
    });
    this.prepareSplitPaymentList();
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

  receivePaymentOpenForSchemeAndSession = async (item, type) => {
    this.reset();
    this.paymentDetails.customerId = item.customerId;
    this.paymentDetails.customerName = item.customerName;
    this.generateReceiptNumber();
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();
    db.parties
      .findOne({
        selector: {
          $and: [
            { id: item.customerId },
            { businessId: { $eq: businessData.businessId } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        this.currentCustomerBalance = data.balance;
        this.paymentDetails.balanceToPay = item.balance_amount;
        // console.log('data::', data);

        if (data.balanceType === 'Receivable' && data.balance > 0) {
          this.paymentDetails.customerReceivable = true;
        } else {
          this.paymentDetails.customerReceivable = false;
        }

        if (type === 'scheme') {
          this.openReceivePaymentForScheme = true;
          this.receivePaymentTxnType = 'Scheme';
        } else {
          this.openReceivePaymentForSession = true;
          this.receivePaymentTxnType = 'Session';
        }

        this.receivePaymentTxnId = item.id;
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

  closeReceivePaymentSchemeDialog = async () => {
    this.openReceivePaymentForScheme = false;
    this.closeReceivePaymentmanagementDialog();
  };

  closeReceivePaymentSessionDialog = async () => {
    this.openReceivePaymentForSession = false;
    this.closeReceivePaymentmanagementDialog();
  };

  closeReceivePaymentmanagementDialog = async () => {
    this.receivePaymentTxnId = 0;
    this.receivePaymentTxnType = '';
    this.reset();
  };

  updateReceiveSchemeTxnAmount = async (db, invoice_number) => {
    /**
     * since it only get one record setting to empty
     */
    this.paymentLinkTransactions = [];
    const businessData = await Bd.getBusinessData();

    await db.schememanagement
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              id: { $eq: invoice_number }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No data is available
          return;
        }

        let finalData = data.toJSON();
        finalData.paymentType = 'Scheme';
        finalData.date = data.date;
        finalData.id = data.id;
        finalData.total = data.total;
        finalData.balance = data.balance;
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

  constructor() {
    makeObservable(this, {
      OpenAddPaymentIn: observable,
      OpenReceivePayment: observable,
      paymentDetails: observable,
      setPaymentType: action,
      setpaymentInCustomer: action,
      savePaymentData: action,
      openForNewPaymnetIn: action,
      closeDialog: action,
      closeReceivePaymentDialog: action,
      currentCustomerBalance: observable,
      isPaymentInList: observable,
      getBalanceAfterLinkedAmount: computed,
      setcurrentBalance: action,
      reset: action,
      receivePaymentOpen: action,
      generateReceiptNumber: action,
      viewOrEditPaymentInTxnItem: action,
      deletePaymentInTxnItem: action,
      openLinkpaymentPage: observable,
      paymentLinkTransactions: observable,
      isUpdate: observable,
      setPaymentInInvoiceRegular: action,
      setPaymentInInvoiceThermal: action,
      setPaymentMode: action,
      setBankAccountData: action,
      setPaymentReferenceNumber: action,
      openPayInManuelSeqNumModal: observable,
      openPayInManuelSeqNumCheck: observable,
      handlePaymentInSearchWithPrefix: action,
      handlePaymentInSearchWithSubPrefix: action,
      viewAndRestorePaymentIn: action,
      restorePaymentIn: action,
      markPaymentInRestored: action,
      printPaymentInData: observable,
      resetPaymentInPrintData: action,
      closeDialogForSaveAndPrint: action,
      printBalance: observable,
      manualSequenceNumber: observable,
      openPaymentInLoadingAlertMessage: observable,
      openPaymentInErrorAlertMessage: observable,
      openPaymentInPrintSelectionAlert: observable,
      openSplitPaymentDetails: observable,
      chosenPaymentType: observable,
      splitPaymentSettingsData: observable,
      openReceivePaymentSplitPaymentDetails: observable,
      sequenceNumberFailureAlert: observable,
      openReceivePaymentForScheme: observable,
      openReceivePaymentForSession: observable,
      closeReceivePaymentSessionDialog: action
    });
  }
}
export default new PaymentInStore();