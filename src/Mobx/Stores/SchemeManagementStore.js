import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import SchemeManagement from './classes/SchemeManagement';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as linkPayment from '../../components/Helpers/AlltransactionsLinkPaymentHelper';

class SchemeManagementStore {
  schemeManagementDialogOpen = false;
  schemeManagementList = [];
  isSchemeManagementList = false;
  isEdit = false;
  paymentHistory = [];
  paymentHistoryTotal = 0;

  openSchemePaymentHistory = false;

  saleUnLinkedTxnList = [];

  invoiceRegular = {};
  invoiceThermal = {};
  printData = null;

  unlinkSchemeData = {};
  sequenceNumberFailureAlert = false;

  constructor() {
    this.schemeManagement = new SchemeManagement().defaultValues();
    this.schemeManagementDefault = new SchemeManagement().defaultValues();

    makeObservable(this, {
      schemeManagement: observable,
      schemeManagementDialogOpen: observable,
      handleSchemeManagementModalOpen: action,
      handleSchemeManagementModalClose: action,
      schemeManagementList: observable,
      getSchemeManagementCount: action,
      openSchemePaymentHistory: observable,
      paymentHistory: observable,
      paymentHistoryTotal: observable,
      sequenceNumberFailureAlert: observable
    });
  }

  handleSchemeManagementModalOpen = () => {
    runInAction(() => {
      this.invoiceRegular = {};
      this.invoiceThermal = {};
      this.paymentHistory = [];
      this.paymentHistoryTotal = 0;
      this.schemeManagement = new SchemeManagement().defaultValues();
      this.schemeManagementDialogOpen = true;
    });
  };

  handleSchemeManagementModalClose = () => {
    runInAction(() => {
      this.paymentHistory = [];
      this.paymentHistoryTotal = 0;
      this.schemeManagementDialogOpen = false;
      this.isEdit = false;
    });
  };

  setSchemeProperty = (property, value) => {
    runInAction(async () => {
      this.schemeManagement[property] = value;

      if (
        this.schemeManagement.depositAmount > 0 ||
        this.schemeManagement.discountContribution > 0
      ) {
        this.schemeManagement.total =
          parseFloat(this.schemeManagement.depositAmount || 0) +
          parseFloat(this.schemeManagement.discountContribution || 0);
      }

      let paidAmount = 0;
      if (
        this.schemeManagement.linkedTxnList &&
        this.schemeManagement.linkedTxnList.length > 0
      ) {
        for (let p of this.schemeManagement.linkedTxnList) {
          paidAmount += parseFloat(p.linkedAmount || 0);
        }
      }
      this.schemeManagement.balance =
        parseFloat(this.schemeManagement.total || 0) -
        parseFloat(this.schemeManagement.discountContribution || 0) -
        parseFloat(paidAmount || 0);
    });
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('sm');
    this.schemeManagement.id = `${id}${appId}${timestamp}`;
    this.schemeManagement.businessId = businessData.businessId;
    this.schemeManagement.businessCity = businessData.businessCity;
    this.schemeManagement.posId = parseFloat(businessData.posDeviceId);
    this.schemeManagement.updatedAt = Date.now();

    let sequenceData = {};
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      sequenceData.multiDeviceBillingSupport =
        transSettings.multiDeviceBillingSupport;
      sequenceData.prefix =
        transSettings.scheme.prefixSequence &&
        transSettings.scheme.prefixSequence.length > 0
          ? transSettings.scheme.prefixSequence[0].prefix
          : '';
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      sequenceData.prefix = localStorage.getItem('deviceName');
      sequenceData.subPrefix = 'Scheme';
      isOnline = false;
    }

    const sequenceNumber = await sequence.getFinalSequenceNumber(
      sequenceData,
      'Scheme',
      null,
      this.schemeManagement.id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );

    this.schemeManagement.sequenceNumber = sequenceNumber;

    if (this.schemeManagement.sequenceNumber === '0') {
      this.schemeManagement.sequenceNumber = '';
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    let InsertDoc = { ...this.schemeManagement };
    InsertDoc = new SchemeManagement().convertTypes(InsertDoc);

    await db.schememanagement
      .insert(InsertDoc)
      .then(() => {
        console.log('this.schememanagement:: data Inserted' + InsertDoc);
        runInAction(() => {
          this.isEdit = false;
          this.isSchemeManagementList = true;
          this.schemeManagementDialogOpen = false;
        });
      })
      .catch((err) => {
        console.log('this.schememanagement:: data insertion Failed::', err);
        runInAction(() => {
          this.isEdit = false;
          this.schemeManagementDialogOpen = false;
        });
      });
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.schememanagement
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.schemeManagement.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Scheme Management data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.id = oldTxnData.id;
        newTxnData.posId = oldTxnData.posId;
        newTxnData.businessId = oldTxnData.businessId;
        newTxnData.businessCity = oldTxnData.businessCity;
        newTxnData.updatedAt = Date.now();
        newTxnData.isSyncedToServer = this.schemeManagement.isSyncedToServer;
        newTxnData.date = this.schemeManagement.date;
        newTxnData.name = this.schemeManagement.name;
        newTxnData.type = this.schemeManagement.type;
        newTxnData.period = this.schemeManagement.period;
        newTxnData.depositAmount = this.schemeManagement.depositAmount;
        newTxnData.discountContribution =
          this.schemeManagement.discountContribution;
        newTxnData.total = this.schemeManagement.total;
        newTxnData.balance = this.schemeManagement.balance;
        newTxnData.linkedTxnList = this.schemeManagement.linkedTxnList;
        newTxnData.customerId = this.schemeManagement.customerId;
        newTxnData.customerName = this.schemeManagement.customerName;
        newTxnData.customerGSTNo = this.schemeManagement.customerGSTNo;
        newTxnData.customerGstType = this.schemeManagement.customerGstType;
        newTxnData.customerAddress = this.schemeManagement.customerAddress;
        newTxnData.customerPhoneNo = this.schemeManagement.customerPhoneNo;
        newTxnData.customerCity = this.schemeManagement.customerCity;
        newTxnData.customerEmailId = this.schemeManagement.customerEmailId;
        newTxnData.customerPincode = this.schemeManagement.customerPincode;
        newTxnData.customerState = this.schemeManagement.customerState;
        newTxnData.customerCountry = this.schemeManagement.customerCountry;
        newTxnData.customerTradeName = this.schemeManagement.customerTradeName;
        newTxnData.customerLegalName = this.schemeManagement.customerLegalName;
        newTxnData.customerRegistrationNumber =
          this.schemeManagement.customerRegistrationNumber;
        newTxnData.customerPanNumber = this.schemeManagement.customerPanNumber;
        newTxnData.aadharNumber = this.schemeManagement.aadharNumber;
        newTxnData.customerDob = this.schemeManagement.customerDob;
        newTxnData.customerAnniversary =
          this.schemeManagement.customerAnniversary;
        newTxnData.notes = this.schemeManagement.notes;
        newTxnData.schemeOrderType = this.schemeManagement.schemeOrderType;

        await db.schememanagement
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: { $eq: this.schemeManagement.id } }
              ]
            }
          })
          .update({
            $set: {
              updatedAt: newTxnData.updatedAt,
              isSyncedToServer: false,
              date: newTxnData.date,
              name: newTxnData.name,
              type: newTxnData.type,
              period: newTxnData.period,
              depositAmount: newTxnData.depositAmount,
              discountContribution: newTxnData.discountContribution,
              total: newTxnData.total,
              balance: newTxnData.balance,
              linkedTxnList: newTxnData.linkedTxnList,
              customerId: newTxnData.customerId,
              customerName: newTxnData.customerName,
              customerGSTNo: newTxnData.customerGSTNo,
              customerGstType: newTxnData.customerGstType,
              customerAddress: newTxnData.customerAddress,
              customerPhoneNo: newTxnData.customerPhoneNo,
              customerCity: newTxnData.customerCity,
              customerEmailId: newTxnData.customerEmailId,
              customerPincode: newTxnData.customerPincode,
              customerState: newTxnData.customerState,
              customerCountry: newTxnData.customerCountry,
              customerTradeName: newTxnData.customerTradeName,
              customerLegalName: newTxnData.customerLegalName,
              customerRegistrationNumber: newTxnData.customerRegistrationNumber,
              customerPanNumber: newTxnData.customerPanNumber,
              aadharNumber: newTxnData.aadharNumber,
              customerDob: newTxnData.customerDob,
              customerAnniversary: newTxnData.customerAnniversary,
              notes: newTxnData.notes,
              schemeOrderType: newTxnData.schemeOrderType
            }
          })
          .then(async () => {
            console.log('schememanagement update success');
            this.schemeManagement = this.schemeManagementDefault;
            this.isEdit = false;
            this.isSchemeManagementList = true;
          });
      })
      .catch((error) => {
        console.log('schememanagement update Failed ' + error);
      });

    this.schemeManagementDialogOpen = false;
    this.isEdit = false;
  };

  deleteSchemeManagementData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.schememanagement.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: item.id } }
        ]
      }
    });

    this.unlinkSchemeData = item;

    await query
      .remove()
      .then(async (data) => {
        console.log('schememanagement data removed' + data);

        /**
         * un-link old payments lanks
         */
        await this.unLinkPayment(db, this.unlinkSchemeData);

        runInAction(() => {
          this.schemeManagement = this.schemeManagementDefault;
          this.isSchemeManagementList = true;
        });
      })
      .catch((error) => {
        console.log('schememanagement deletion Failed ' + error);
      });
  };

  unLinkPayment = async (db, saleDetails) => {
    /**
     * follow below + and - rule to unlink payment
     *
     * sale +
     * payment out +
     * purchase return +
     *
     *
     * payment in -
     * sale return -
     * purchase -
     *
     */

    // console.log('after sort::', this.paymentUnLinkTransactions);
    for (const item of this.unlinkSchemeData.linkedTxnList) {
      if (item.paymentType === 'Payment In') {
        /**
         * remove from paymnet in table
         */
        // console.log('paymentin loop');
        await this.removeLinkedTxnPaymentIn(db, item, saleDetails);

        linkPayment.removeLinkedTxnBalance(db, item);
      } else if (item.paymentType === 'Sales Return') {
        /**
         * remove from  sales return table
         */
        await this.removeLinkedTxnSalesReturn(db, item, saleDetails);

        linkPayment.removeLinkedTxnBalance(db, item);
      } else if (item.paymentType === 'Purchases') {
        /**
         * remove from purchases table
         */
        await this.removeLinkedTxnPurchases(db, item, saleDetails);

        linkPayment.removeLinkedTxnBalance(db, item);
      } else if (item.paymentType === 'Opening Payable Balance') {
        /**
         * remove from alltransactions table
         */
        await linkPayment.removeLinkedTxnBalance(db, item);
      }
    }

    /**
     * make used global variable to deafult values
     */
    this.paymentUnLinkTransactions = [];
  };

  removeLinkedTxnPaymentIn = async (db, doc, saleDetails) => {
    const businessData = await Bd.getBusinessData();

    const paymentInData = await db.paymentin
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              receiptNumber: { $eq: doc.linkedId }
            },
            { customerId: { $eq: saleDetails.customerId } }
          ]
        }
      })
      .exec();

    if (paymentInData) {
      const changeData = await ((oldData) => {
        /**
         * remove transaction data
         * and
         *
         * add balance back to balance
         */
        let finalLinkedTxnList = [];
        if (typeof oldData.linkedTxnList === 'undefined') {
          return;
        } else {
          oldData.linkedTxnList.forEach((element) => {
            if (!(element.linkedId === saleDetails.id)) {
              finalLinkedTxnList.push(element);
            } else {
              const linkedAmount = parseFloat(element.linkedAmount);
              oldData.balance += linkedAmount;
              oldData.linked_amount =
                (parseFloat(oldData.linked_amount) || 0) - linkedAmount;
              this.saleUnLinkedTxnList.push(element);
            }
          });

          oldData.linkedTxnList = finalLinkedTxnList;
        }
        oldData.updatedAt = Date.now();
        return oldData;
      });
      await paymentInData.atomicUpdate(changeData);
    }
  };

  removeLinkedTxnSalesReturn = async (db, doc, saleDetails) => {
    const businessData = await Bd.getBusinessData();

    const salesReturnData = await db.salesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_number: { $eq: doc.linkedId }
            },
            { customer_id: { $eq: saleDetails.customer_id } }
          ]
        }
      })
      .exec();

    if (salesReturnData) {
      const changeData = await ((oldData) => {
        /**
         * remove transaction data
         * and
         *
         * add balance back to balance
         */
        let finalLinkedTxnList = [];
        if (typeof oldData.linkedTxnList === 'undefined') {
          return;
        } else {
          oldData.linkedTxnList.forEach((element) => {
            if (element.linkedId !== saleDetails.invoice_number) {
              finalLinkedTxnList.push(element);
            } else {
              const linkedAmount = parseFloat(element.linkedAmount);
              oldData.balance_amount += linkedAmount;
              this.saleUnLinkedTxnList.push(element);

              oldData.linked_amount =
                (parseFloat(oldData.linked_amount) || 0) - linkedAmount;
            }
          });

          oldData.updatedAt = Date.now();
          oldData.linkedTxnList = finalLinkedTxnList;
          return oldData;
        }
      });
      await salesReturnData.atomicUpdate(changeData);
    }
  };

  removeLinkedTxnPurchases = async (db, doc, saleDetails) => {
    const businessData = await Bd.getBusinessData();

    const purchaseData = await db.purchases
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_number: { $eq: doc.linkedId }
            },
            { vendor_id: { $eq: saleDetails.customer_id } }
          ]
        }
      })
      .exec();

    const changeData = await ((oldData) => {
      /**
       * remove transaction data
       * and
       *
       * add balance back to balance
       */
      let finalLinkedTxnList = [];
      if (typeof oldData.linkedTxnList === 'undefined') {
        return;
      } else {
        oldData.linkedTxnList.forEach((element) => {
          if (element.linkedId !== saleDetails.invoice_number) {
            finalLinkedTxnList.push(element);
          } else {
            const linkedAmount = parseFloat(element.linkedAmount);
            oldData.balance_amount += linkedAmount;
            this.saleUnLinkedTxnList.push(element);

            oldData.linked_amount =
              (parseFloat(oldData.linked_amount) || 0) - linkedAmount;
          }
        });

        oldData.updatedAt = Date.now();
        oldData.linkedTxnList = finalLinkedTxnList;
        return oldData;
      }
    });
    if (purchaseData) {
      await purchaseData.atomicUpdate(changeData);
    }
  };

  getSchemeManagement = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.schemeManagementList = [];

    const query = db.schememanagement.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.schemeManagementList = data.map((item) => item.toJSON());
      }
    });

    return this.schemeManagementList;
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.schememanagement
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: item.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Scheme management data is found so cannot update any information
          return;
        }
        runInAction(async () => {
          this.schemeManagement.businessCity = data.businessCity;
          this.schemeManagement.businessId = data.businessId;
          this.schemeManagement.id = data.id;
          this.schemeManagement.isSyncedToServer = data.isSyncedToServer;
          this.schemeManagement.posId = data.posId;
          this.schemeManagement.date = data.date;
          this.schemeManagement.name = data.name;
          this.schemeManagement.type = data.type;
          this.schemeManagement.period = data.period;
          this.schemeManagement.depositAmount = data.depositAmount;
          this.schemeManagement.discountContribution =
            data.discountContribution;
          this.schemeManagement.total = data.total;
          this.schemeManagement.balance = data.balance;
          this.schemeManagement.linkedTxnList = data.linkedTxnList;
          this.schemeManagement.customerId = data.customerId;
          this.schemeManagement.customerName = data.customerName;
          this.schemeManagement.customerGSTNo = data.customerGSTNo;
          this.schemeManagement.customerGstType = data.customerGstType;
          this.schemeManagement.customerAddress = data.customerAddress;
          this.schemeManagement.customerPhoneNo = data.customerPhoneNo;
          this.schemeManagement.customerCity = data.customerCity;
          this.schemeManagement.customerEmailId = data.customerEmailId;
          this.schemeManagement.customerPincode = data.customerPincode;
          this.schemeManagement.customerState = data.customerState;
          this.schemeManagement.customerCountry = data.customerCountry;
          this.schemeManagement.customerTradeName = data.customerTradeName;
          this.schemeManagement.customerLegalName = data.customerLegalName;
          this.schemeManagement.customerRegistrationNumber =
            data.customerRegistrationNumber;
          this.schemeManagement.customerPanNumber = data.customerPanNumber;
          this.schemeManagement.aadharNumber = data.aadharNumber;
          this.schemeManagement.customerDob = data.customerDob;
          this.schemeManagement.customerAnniversary = data.customerAnniversary;
          this.schemeManagement.notes = data.notes;
          this.schemeManagement.schemeOrderType = data.schemeOrderType;

          this.paymentHistory = [];
          this.paymentHistoryTotal = 0;
          await this.getPaymentHistory(item);

          this.isEdit = true;
          this.schemeManagementDialogOpen = true;
        });
      })
      .catch((error) => {
        console.log('schememanagement update Failed ' + error);
      });
  };

  resetSingleSchemeManagementData = async () => {
    /**
     * reset to defaults
     */
    runInAction(() => {
      this.schemeManagement = this.schemeManagementDefault;
    });
  };

  setParty = (customer) => {
    if (customer) {
      runInAction(() => {
        this.schemeManagement.customerId = customer.id;
        this.schemeManagement.customerName = customer.name;
        this.schemeManagement.customerGSTNo = customer.gstNumber;
        this.schemeManagement.customerGstType = customer.gstType;
        this.schemeManagement.customerEmailId = customer.emailId;
        this.schemeManagement.customerLegalName = customer.legalName;
        this.schemeManagement.customerRegistrationNumber =
          customer.registrationNumber;
        this.schemeManagement.customerPanNumber = customer.panNumber;
        this.schemeManagement.customerPhoneNo = customer.phoneNo;
        this.schemeManagement.aadharNumber = customer.aadharNumber;

        this.schemeManagement.customerAddress = customer.address;
        this.schemeManagement.customerPincode = customer.pincode;
        this.schemeManagement.customerCity = customer.city;
        this.schemeManagement.customerState = customer.state;
        this.schemeManagement.customerCountry = customer.country;
        this.schemeManagement.customerTradeName = customer.tradeName;
      });
    } else {
      this.schemeManagement.customerId = '';
      this.schemeManagement.customerName = '';
      this.schemeManagement.customerGSTNo = '';
      this.schemeManagement.customerGstType = '';
      this.schemeManagement.customerEmailId = '';
      this.schemeManagement.customerLegalName = '';
      this.schemeManagement.customerRegistrationNumber = '';
      this.schemeManagement.customerPanNumber = '';
      this.schemeManagement.customerPhoneNo = '';
      this.schemeManagement.aadharNumber = '';

      this.schemeManagement.customerAddress = '';
      this.schemeManagement.customerPincode = '';
      this.schemeManagement.customerCity = '';
      this.schemeManagement.customerState = '';
      this.schemeManagement.customerCountry = '';
      this.schemeManagement.customerTradeName = '';
    }
  };

  getSchemeManagementCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.schememanagement.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isSchemeManagementList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('schememanagement Count Internal Server Error', err);
      });
  };

  getPaymentHistory = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.schememanagement
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: item.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }

        let paymentInData = [];

        if (data.linkedTxnList && data.linkedTxnList.length > 0) {
          for (let linkedIn of data.linkedTxnList) {
            paymentInData.push(
              await this.getLinkedData(linkedIn.linkedId, 'paymentin')
            );
          }

          for (let paymentIn of paymentInData) {
            let receiptPaymentsMap = new Map();
            let data = {
              date: paymentIn.date,
              total: parseFloat(paymentIn.linked_amount),
              sequenceNumber: paymentIn.sequenceNumber,
              paymentDetails: await this.getPaymentSplitLedgersList(
                paymentIn,
                receiptPaymentsMap
              )
            };

            this.paymentHistory.push(data);
          }

          let total = 0;
          for (const data of this.paymentHistory) {
            total = total + data.total;
          }
          this.paymentHistoryTotal = total;
        }
      });
  };

  getLinkedData = async (id, table) => {
    const db = await Db.get();
    const businessId = localStorage.getItem('businessId');

    let response = {};

    if (table === 'paymentin' || table === 'paymentout') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { receiptNumber: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    }

    return response;
  };

  getPaymentSplitLedgersList = async (_data, paymentsMap) => {
    if (_data.paymentType === 'Split') {
      for (let payment of _data.splitPaymentList) {
        if (payment.amount > 0 && payment.paymentType === 'Cash') {
          paymentsMap.set('CASH', payment.amount);
        }
        if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
          paymentsMap.set('GIFT CARD', payment.amount);
        }
        if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
          paymentsMap.set('CUSTOM FINANCE', payment.amount);
        }

        if (
          payment.paymentMode === 'UPI' ||
          payment.paymentMode === 'Internet Banking' ||
          payment.paymentMode === 'Credit Card' ||
          payment.paymentMode === 'Debit Card' ||
          payment.paymentMode === 'Cheque'
        ) {
          let mode = '';
          switch (payment.paymentMode) {
            case 'UPI':
              mode = 'UPI';
              break;
            case 'Internet Banking':
              mode = 'NEFT/RTGS';
              break;
            case 'Credit Card':
              mode = 'CREDIT CARD';
              break;
            case 'Debit Card':
              mode = 'DEBIT CARD';
              break;
            case 'Cheque':
              mode = 'CHEQUE';
              break;
            default:
              return '';
          }

          if (paymentsMap.has(payment.accountDisplayName)) {
            paymentsMap.set(mode, paymentsMap.get(mode) + payment.amount);
          } else {
            paymentsMap.set(mode, payment.amount);
          }
        }
      }
    } else if (_data.paymentType === 'cash' || _data.paymentType === 'Cash') {
      paymentsMap.set('CASH', _data.linked_amount);
    } else if (_data.paymentType === 'upi') {
      paymentsMap.set('UPI', _data.linked_amount);
    } else if (_data.paymentType === 'internetbanking') {
      paymentsMap.set('NEFT/RTGS', _data.linked_amount);
    } else if (_data.paymentType === 'cheque') {
      paymentsMap.set('CHEQUE', _data.linked_amount);
    } else if (_data.paymentType === 'creditcard') {
      paymentsMap.set('CREDIT CARD', _data.linked_amount);
    } else if (_data.paymentType === 'debitcard') {
      paymentsMap.set('DEBIT CARD', _data.linked_amount);
    }

    return paymentsMap;
  };

  handleSchemePaymentHistoryModalOpen = async (item) => {
    runInAction(() => {
      this.paymentHistory = [];
      this.paymentHistoryTotal = 0;
    });
    await this.getPaymentHistory(item);
    runInAction(() => {
      this.openSchemePaymentHistory = true;
    });
  };

  handleSchemePaymentHistoryModalClose = () => {
    runInAction(() => {
      this.openSchemePaymentHistory = false;
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
}
export default new SchemeManagementStore();