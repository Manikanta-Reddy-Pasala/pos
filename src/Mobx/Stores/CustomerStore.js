import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import * as timestamp from '../../components/Helpers/TimeStampGeneratorHelper';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import Customer from 'src/Mobx/Stores/classes/Customer';
import {
  excelPartyMapping,
  updateExcelPartyMapping
} from 'src/components/Helpers/ExcelMappingHelper';
import axios from 'axios';
import { findParty } from 'src/components/Helpers/dbQueries/parties';
import getStateList from 'src/components/StateList';

class CustomerStore {
  customerDialogOpen = false;
  openAleadyVendorFoundModel = false;
  openAleadyVendorAndCustomerFoundModel = false;

  customerList = [];
  customerTransactionList = [];
  customerLedgerTransactionList = [];
  disableBalanceEdit = false;

  copyShippingAddress = false;

  selectedParty = '';

  isUpdate = false;
  isCustomerList = false;
  isEdit = false;

  isBothCustomerAndVendor = false;
  isAlreadyCustomer = false;
  isAlreadyVendor = false;

  customerFromSales = {};
  customerFromKot = {};

  additionalBillingAddressCollapsibleMap = new Map();
  additionalShippingAddressCollapsibleMap = new Map();
  copyShippingAddressMap = new Map();

  customerLedgerTransactions = [];
  customersNotProcessed = [];

  today = new Date().getDate();
  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth();

  changeInCustomer = false;
  custFromDate = dateHelper.formatDateToYYYYMMDD(
    dateHelper.getFinancialYearStartDate()
  );

  custToDate = dateHelper.formatDateToYYYYMMDD(
    dateHelper.getFinancialYearEndDate()
  );

  // to save customer properties during manual entry from user in add customer popo up
  setCustFromDate = (value) => {
    runInAction(() => {
      this.custFromDate = value;
    });
  };

  setCustToDate = (value) => {
    runInAction(() => {
      this.custToDate = value;
    });
  };

  setCustomerProperty = (property, value) => {
    this.customer[property] = value;
    console.log('this.customer', this.isUpdate);
  };
  setIsUpdate = () => {
    this.isUpdate = true;
  };

  viewOrEditItem = async (item) => {
    console.log('view or edit clicked::', item);

    /**
     * check for customer transactions if he has any then dont allow him to edit balance
     * else allow to edit everything
     */
    // await this.getCustomerTransactionList(item.id);

    if (this.customerTransactionList.length > 0) {
      runInAction(() => {
        this.disableBalanceEdit = true;
      });
    }
    this.setSelectedCustomer(item);

    runInAction(() => {
      this.customerTransactionList = [];
      this.isUpdate = true;
      this.isEdit = true;
      this.openAleadyVendorFoundModel = false;
      this.customerDialogOpen = true;
      if (this.customer.balance === 0) {
        this.customer.balanceType = '';
      }
      // console.log(item);
    });
  };

  getCustomerCount = async () => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    const query = db.parties.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { isCustomer: { $eq: true } }
        ]
      }
    });

    await query
      .exec()
      .then((data) => {
        this.isCustomerList = data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  deleteCustomer = async (item) => {
    await this.getCustomerTransactionList(item.id);

    const db = await Db.get();

    //remove opening balalce txn types
    if (
      this.customerTransactionList.length === 1 &&
      (this.customerTransactionList[0].txnType ===
        'Opening Receivable Balance' ||
        this.customerTransactionList[0].txnType === 'Opening Payable Balance')
    ) {
      //remove from all txn table
      allTxn.deleteTxnFromAddParties(this.customerTransactionList[0], db);
      runInAction(() => {
        this.customerTransactionList = [];
      });
    }

    if (this.customerTransactionList.length === 0) {
      const businessData = await Bd.getBusinessData();

      const query = db.parties.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: item.id } }
          ]
        }
      });

      //save to audit
      await audit.addAuditEvent(
        item.id,
        '',
        'Customer',
        'Delete',
        JSON.stringify(item),
        '',
        this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
      );

      await query
        .remove()
        .then(async (data) => {
          console.log('customer data removed' + data);
          runInAction(() => {
            this.customer = this.customerDefault;
          });
        })
        .catch((error) => {
          console.log('customer deletion Failed ' + error);
          //save to audit
          audit.addAuditEvent(
            item.id,
            '',
            'Customer',
            'Delete',
            JSON.stringify(item),
            error.message,
            this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
          );
        });
    } else {
      alert(
        'Customer is having Transactions. Please delete transactions before deleting the current Cutomer.'
      );
    }
  };

  setDefaultValue = async (item, property, defaultValue) => {
    if (
      item[property] === null ||
      item[property] === '' ||
      item[property] === undefined
    ) {
      item[property] = defaultValue;
    }
  };

  // save single customer
  saveData = async (isSaveAndNew) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.customer.balanceType = this.customer.balanceType || 'Receivable';
    this.customer.balance = this.customer.balance || 0;
    this.customer.balance = parseFloat(this.customer.balance);
    this.customer.phoneNo = this.customer.phoneNo || '0';

    const properties = ['tcsRate', 'tdsRate', 'creditLimit'];

    properties.forEach((property) =>
      this.setDefaultValue(this.customer, property, 0)
    );

    this.setDefaultValue(this.customer, 'vipCustomer', false);
    this.setDefaultValue(this.customer, 'isVendor', false);
    this.setDefaultValue(this.customer, 'isCustomer', true);
    this.setDefaultValue(this.customer, 'isSyncedToServer', false);
    this.setDefaultValue(this.customer, 'tallySynced', false);

    /**
     * check whether already a person regisered with same mobile number
     */
    if (!this.isUpdate) {
      await this.saveCustomerData(db, businessData, isSaveAndNew);
    } else {
      await this.updateCustomerData(db, isSaveAndNew);
    }
  };

  getCustomerData = async (db, phoneNo) => {
    const businessData = await Bd.getBusinessData();

    const customerData = await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { phoneNo: { $eq: phoneNo } }
          ]
        }
      })
      .exec();

    return customerData;
  };

  formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  saveCustomerData = async (db, businessData, isSaveAndNew) => {
    // generate unique id
    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('c');
    this.customer.id = `${id}${appId}${timestamp}`;
    this.customer.businessId = businessData.businessId;
    this.customer.businessCity = businessData.businessCity;

    const InsertDoc = this.customer;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    if (parseFloat(InsertDoc.balance) > 0) {
      //add to all transactions
      allTxn.saveTxnFromAddParties(InsertDoc, db);
    }

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.id,
      '',
      'Customer',
      'Save',
      JSON.stringify(InsertDoc),
      '',
      this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
    );

    await db.parties
      .insert(InsertDoc)
      .then(() => {
        console.log('data Inserted');
      })
      .catch((err) => {
        console.log('data insertion Failed::', err);
        audit.addAuditEvent(
          InsertDoc.id,
          '',
          'Customer',
          'Save',
          JSON.stringify(InsertDoc),
          err.message ? err.message : 'Customer Save Failed',
          this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
        );
      });

    if (isSaveAndNew) {
      this.customer = this.customerDefault;
    } else {
      runInAction(() => {
        this.customerDialogOpen = false;
      });
    }

    if (this.customerFromSales.isNewCustomer) {
      this.customerFromSales = { ...InsertDoc };
    }

    if (this.customerFromKot.isNewCustomer) {
      this.customerFromKot = { ...InsertDoc };
    }

    runInAction(async () => {
      this.isCustomerList = true;
    });
  };

  savePaymentIn = async (db, doc) => {
    let finalPaymentDetails = {};

    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const timestamp = Math.floor(Date.now() / 60000);
    const id = _uniqueId('pi');
    finalPaymentDetails['receiptNumber'] = `${id}${appId}${timestamp}`;

    finalPaymentDetails.businessId = doc.businessId;
    finalPaymentDetails.businessCity = doc.businessCity;
    finalPaymentDetails.date = doc.asOfDate;
    finalPaymentDetails.customerId = doc.id;
    finalPaymentDetails.customerName = doc.name;
    finalPaymentDetails.paymentType = 'cash';
    finalPaymentDetails.received = doc.balance;
    finalPaymentDetails.total = doc.balance;
    finalPaymentDetails.updatedAt = Date.now();
    finalPaymentDetails.balance = parseFloat(doc.balance);
    finalPaymentDetails.posId = parseFloat(businessData.posDeviceId);

    await db.paymentin
      .insert(finalPaymentDetails)
      .then((data) => {
        console.log('data Inserted', data);
      })
      .catch((err) => {
        console.log('data Insertion Failed', err);
      });
  };

  savePaymentOut = async (db, doc) => {
    let finalPaymentDetails = {};

    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const timestamp = Math.floor(Date.now() / 60000);
    const id = _uniqueId('po');
    finalPaymentDetails['receiptNumber'] = `${id}${appId}${timestamp}`;

    finalPaymentDetails.businessId = doc.businessId;
    finalPaymentDetails.businessCity = doc.businessCity;
    finalPaymentDetails.date = doc.asOfDate;
    finalPaymentDetails.vendorId = doc.id;
    finalPaymentDetails.vendorName = doc.name;
    finalPaymentDetails.paymentType = 'cash';
    finalPaymentDetails.paid = doc.balance;
    finalPaymentDetails.total = doc.balance;
    finalPaymentDetails.updatedAt = Date.now();

    finalPaymentDetails.balance = parseFloat(doc.balance);

    finalPaymentDetails.posId = parseFloat(businessData.posDeviceId);

    await db.paymentout
      .insert(finalPaymentDetails)
      .then((data) => {
        console.log('data Inserted', finalPaymentDetails);
      })
      .catch((err) => {
        console.log('data Inserted Failed', err);
      });
  };

  updateCustomerData = async (db, isSaveAndNew) => {
    let updateDoc = this.customer;
    const businessData = await Bd.getBusinessData();

    //save to audit
    await audit.addAuditEvent(
      updateDoc.id,
      '',
      'Customer',
      'Update',
      JSON.stringify(updateDoc),
      '',
      this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
    );

    const query = db.parties.findOne({
      selector: {
        $and: [
          { id: updateDoc.id },
          { businessId: { $eq: businessData.businessId } }
        ]
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No customer data is found so cannot update any information
          return;
        }

        if (this.customerTransactionList.length === 0) {
          //delete initial txn
          await allTxn.deleteTxnFromAddParties(updateDoc, db);
        }

        try {
          await query.update({
            $set: {
              name: updateDoc.name,
              balanceType: updateDoc.balanceType,
              balance: parseFloat(updateDoc.balance),
              asOfDate: updateDoc.asOfDate,
              address: updateDoc.address,
              pincode: updateDoc.pincode,
              gstType: updateDoc.gstType,
              city: updateDoc.city,
              emailId: updateDoc.emailId,
              isCustomer: updateDoc.isCustomer,
              isVendor: updateDoc.isVendor,
              updatedAt: Date.now(),
              gstNumber: updateDoc.gstNumber,
              vipCustomer: updateDoc.vipCustomer,
              place_of_supply: updateDoc.place_of_supply,
              phoneNo: updateDoc.phoneNo,
              gothra: updateDoc.gothra,
              rashi: updateDoc.rashi,
              star: updateDoc.star,
              shippingAddress: updateDoc.shippingAddress,
              shippingPincode: updateDoc.shippingPincode,
              shippingCity: updateDoc.shippingCity,
              state: updateDoc.state,
              country: updateDoc.country,
              shippingState: updateDoc.shippingState,
              shippingCountry: updateDoc.shippingCountry,
              registrationNumber: updateDoc.registrationNumber,
              tradeName: updateDoc.tradeName,
              legalName: updateDoc.legalName,
              panNumber: updateDoc.panNumber,
              tcsName: updateDoc.tcsName,
              tcsRate: updateDoc.tcsRate,
              tcsCode: updateDoc.tcsCode,
              tdsName: updateDoc.tdsName,
              tdsRate: updateDoc.tdsRate,
              tdsCode: updateDoc.tdsCode,
              additionalAddressList: updateDoc.additionalAddressList,
              isSyncedToServer: updateDoc.isSyncedToServer,
              tallySyncedStatus: updateDoc.tallySyncedStatus,
              tallySynced: updateDoc.tallySynced,
              aadharNumber: updateDoc.aadharNumber,
              creditLimit: updateDoc.creditLimit,
              msmeRegNo: updateDoc.msmeRegNo,
              companyStatus: updateDoc.companyStatus,
              tallyMappingName: updateDoc.tallyMappingName,
              creditLimitDays: updateDoc.creditLimitDays
            }
          });
        } catch (error) {
          await audit.addAuditEvent(
            updateDoc.id,
            '',
            'Customer',
            'Update',
            JSON.stringify(updateDoc),
            error.message,
            this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
          );
        }

        //if name or mobile number is changed then...
        if (
          updateDoc.phoneNo !== data.phoneNo ||
          updateDoc.name !== data.name
        ) {
          await this.updateCustomerTxnWithNewMobileNumberAndName(
            db,
            updateDoc.id,
            updateDoc
          );
        }

        if (isSaveAndNew) {
          console.log('is save and new');
          runInAction(() => {
            this.customer = this.customerDefault;
          });
        } else {
          runInAction(() => {
            this.customerDialogOpen = false;
            this.disableBalanceEdit = false;
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        audit.addAuditEvent(
          updateDoc.id,
          '',
          'Customer',
          'Update',
          JSON.stringify(updateDoc),
          err.message,
          this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
        );
      });
  };

  updateCustomerTxnWithNewMobileNumberAndName = async (
    db,
    customerId,
    updateDoc
  ) => {
    if (this.customerTransactionList.length > 0) {
      for (let txn of this.customerTransactionList) {
        //based on txn type update those

        const businessData = await Bd.getBusinessData();

        if (txn.transactionType === 'Payment In') {
          const query = db.paymentin.findOne({
            selector: {
              $and: [
                { receiptNumber: txn.receiptNumber },
                { businessId: { $eq: businessData.businessId } }
              ]
            }
          });

          query.exec().then(async (data) => {
            if (!data) {
              // No  data is found so cannot update any information
              return;
            }

            query.update({
              $set: {
                customerName: updateDoc.name,
                customer_phoneNo: updateDoc.phoneNo
              }
            });
          });
        } else if (txn.transactionType === 'Purchases') {
          const query = db.purchases.findOne({
            selector: {
              $and: [
                { bill_number: txn.bill_number },
                { businessId: { $eq: businessData.businessId } }
              ]
            }
          });

          query.exec().then(async (data) => {
            if (!data) {
              // No  data is found so cannot update any information
              return;
            }

            query.update({
              $set: {
                vendor_name: updateDoc.name,
                vendor_phone_number: updateDoc.phoneNo
              }
            });
          });
        } else if (
          txn.transactionType === 'Sales' ||
          txn.transactionType === 'KOT'
        ) {
          const query = db.sales.findOne({
            selector: {
              $and: [
                { invoice_number: txn.invoice_number },
                { businessId: { $eq: businessData.businessId } }
              ]
            }
          });

          query.exec().then(async (data) => {
            if (!data) {
              // No  data is found so cannot update any information
              return;
            }

            query.update({
              $set: {
                customer_name: updateDoc.name,
                customer_phoneNo: updateDoc.phoneNo
              }
            });
          });
        } else if (txn.transactionType === 'Payment Out') {
          const query = db.paymentout.findOne({
            selector: {
              $and: [
                { receiptNumber: txn.receiptNumber },
                { businessId: { $eq: businessData.businessId } }
              ]
            }
          });

          query.exec().then(async (data) => {
            if (!data) {
              // No  data is found so cannot update any information
              return;
            }

            query.update({
              $set: {
                vendorName: updateDoc.name,
                vendorPhoneNo: updateDoc.phoneNo
              }
            });
          });
        } else if (txn.transactionType === 'Purchases Return') {
          const query = db.purchasesreturn.findOne({
            selector: {
              $and: [
                { purchase_return_number: txn.purchase_return_number },
                { businessId: { $eq: businessData.businessId } }
              ]
            }
          });

          query.exec().then(async (data) => {
            if (!data) {
              // No  data is found so cannot update any information
              return;
            }

            query.update({
              $set: {
                vendor_name: updateDoc.name,
                vendor_phone_number: updateDoc.phoneNo
              }
            });
          });
        } else if (txn.transactionType === 'Sales Return') {
          const query = db.sales.findOne({
            selector: {
              $and: [
                { sales_return_number: txn.sales_return_number },
                { businessId: { $eq: businessData.businessId } }
              ]
            }
          });

          query.exec().then(async (data) => {
            if (!data) {
              // No  data is found so cannot update any information
              return;
            }

            query.update({
              $set: {
                customer_name: updateDoc.name,
                customer_phoneNo: updateDoc.phoneNo
              }
            });
          });
        }
      }

      this.updateCustomerDataInTxnTable(db, customerId, updateDoc);
    }
  };

  updateCustomerDataInTxnTable = async (db, customerId, updateDoc) => {
    const businessData = await Bd.getBusinessData();

    const query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { customerId: { $eq: customerId } }
        ]
      }
    });

    query
      .exec()
      .then((data) => {
        data.map((item) => {
          let txn = item.toJSON();
          const query = db.producttxn.findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: txn.id }
              ]
            }
          });

          query.exec().then(async (data) => {
            if (!data) {
              // No  data is found so cannot update any information
              return;
            }

            query.update({
              $set: {
                customerName: updateDoc.name,
                customerPhoneNo: updateDoc.phoneNo
              }
            });
          });
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setToDefaults = () => {
    runInAction(() => {
      this.customerTransactionList = [];
    });
  };

  deleteInitialCustomerTxn = async (id) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    const query = db.paymentin.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { customerId: { $eq: id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('customer data removed' + data);
        runInAction(() => {
          this.customer = this.customerDefault;
        });
      })
      .catch((error) => {
        console.log('customer deletion Failed ' + error);
        // alert('Error in Removing Data');
      });

    const query2 = db.paymentin.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { vendorId: { $eq: id } }
        ]
      }
    });

    await query2
      .remove()
      .then(async (data) => {
        console.log('vendorId data removed' + data);
        runInAction(() => {
          this.customer = this.customerDefault;
        });
      })
      .catch((error) => {
        console.log('customer deletion Failed ' + error);
        // alert('Error in Removing Data');
      });
  };

  // get all customer
  getCustomerlist = async () => {
    this.setToDefaults();
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.parties.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { isCustomer: { $eq: true } }
        ]
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        // No customer is available
        return;
      }
      this.customerList = [];
      this.customerTransactionList = [];

      this.customerList = data.map((item) => item.toJSON());
      if (this.customerList.length) {
        const first = this.customerList[0];
        runInAction(() => {
          if (!this.customerDialogOpen) {
            this.customer = first;
          }
        });
        this.getCustomerTransactionList(this.customer.id);
      }
    });
  };

  setSelectedPartyId = (id) => {
    runInAction(() => {
      this.selectedParty = id;
    });
  };

  getCustomerTransactionList = async (id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.customerTransactionList = [];

    await db.alltransactions
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                {
                  customerId: { $eq: id }
                },
                {
                  vendorId: { $eq: id }
                }
              ]
            },
            {
              date: { $exists: true }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No customer is available
          return;
        }

        let finalData = data.map((item) => item.toJSON());

        if (!finalData) {
          finalData = [];
        }
        const finalLedgerData = await allTxn.calculateLedgerBalance(
          finalData.reverse()
        );

        runInAction(() => {
          this.customerTransactionList = finalData;
          this.customerLedgerTransactionList = finalLedgerData.reverse();
        });
      });
  };

  resetCustomerTransactionList = () => {
    this.customerTransactionList = [];
  };

  isDate = async (date) => {
    if (isNaN(date) && !isNaN(Date.parse(date))) return true;
    else return false;
  };

  // search specific customer tranactions
  handleCustomerTransactionSearch = async (value) => {
    /**
     * check if value is valid date then only reset and search elase ignore
     */
    let id = this.customer.id;

    if (value.length > 0) {
      var regexp = new RegExp('^.*' + value + '.*$', 'i');

      this.setToDefaults();
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.alltransactions
        .find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  {
                    $or: [
                      { customerId: { $eq: id } },
                      { vendorId: { $eq: id } }
                    ]
                  },
                  { sequenceNumber: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  {
                    $or: [
                      { customerId: { $eq: id } },
                      { vendorId: { $eq: id } }
                    ]
                  },
                  { txnType: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  {
                    $or: [
                      { customerId: { $eq: id } },
                      { vendorId: { $eq: id } }
                    ]
                  },
                  { date: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  {
                    $or: [
                      { customerId: { $eq: id } },
                      { vendorId: { $eq: id } }
                    ]
                  },
                  { amount: { $eq: parseFloat(value) } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  {
                    $or: [
                      { customerId: { $eq: id } },
                      { vendorId: { $eq: id } }
                    ]
                  },
                  { balance: { $eq: parseFloat(value) } }
                ]
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
          const finalData = data.map((item) => item.toJSON());
          runInAction(() => {
            this.customerTransactionList = finalData;
          });
        });

      // console.log('transactions:', this.customerTransactionList);
    } else if (value.length === 0) {
      this.getCustomerTransactionList(id);
    }
  };

  // get single customer data
  getCustomer = async (id) => {
    console.log('get one cusomers called for id :', id);
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.parties.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: id } }
        ]
      }
    });

    query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.customer = data.map((item) => item.toJSON());
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  // to handle add customer popup
  handleCustomerModalOpen = () => {
    console.log('clicked dialoge open');
    runInAction(() => {
      this.customer = this.customerDefault;
      this.customerDialogOpen = true;
      this.openAleadyVendorFoundModel = false;
      this.isUpdate = false;
      this.isEdit = false;
    });
  };

  handleCustomerModalOpenFromSales = () => {
    console.log('clicked dialoge open');
    runInAction(() => {
      this.customer = this.customerDefault;
      this.customerDialogOpen = true;
      this.openAleadyVendorFoundModel = false;
      this.isUpdate = false;
      this.isEdit = false;

      this.customerFromSales.isNewCustomer = true;
    });
  };

  handleCustomerModalOpenFromKot = () => {
    runInAction(() => {
      this.customer = this.customerDefault;
      this.customerDialogOpen = true;
      this.openAleadyVendorFoundModel = false;
      this.isUpdate = false;
      this.isEdit = false;

      this.customerFromKot.isNewCustomer = true;
    });
  };

  resetCustomerFromSales = () => {
    this.customerFromSales = {};
  };
  resetCustomerFromKot = () => {
    this.customerFromKot = {};
  };

  // to hanle close customer popup
  handleCustomerModalClose = () => {
    console.log('clicked dialoge close');
    if (this.customerList.length > 0) {
      this.customer = this.customerList[0];
    } else {
      this.customer['name'] = '';
    }

    this.customerDialogOpen = false;
    this.disableBalanceEdit = false;
  };

  setSelectedCustomer = (item) => {
    if (item) {
      runInAction(() => {
        this.customer.name = item.name;
        this.customer.id = item.id;
        this.customer.phoneNo = item.phoneNo;
        this.customer.balanceType = item.balanceType;
        this.customer.balance = item.balance;
        this.customer.asOfDate = item.asOfDate;
        this.customer.gstNumber = item.gstNumber;
        this.customer.gstType = item.gstType;
        this.customer.address = item.address;
        this.customer.pincode = item.pincode;
        this.customer.city = item.city;
        this.customer.emailId = item.emailId;
        this.customer.vipCustomer = item.vipCustomer;
        this.customer.isVendor = item.isVendor;
        this.customer.isCustomer = item.isCustomer;
        this.customer.updatedAt = item.updatedAt;
        this.customer.businessId = item.businessId;
        this.customer.businessCity = item.businessCity;
        this.customer.place_of_supply = item.place_of_supply;
        this.customer.gothra = item.gothra;
        this.customer.rashi = item.rashi;
        this.customer.star = item.star;
        this.customer.shippingAddress = item.shippingAddress;
        this.customer.shippingPincode = item.shippingPincode;
        this.customer.shippingCity = item.shippingCity;
        this.customer.state = item.state;
        this.customer.country = item.country;
        this.customer.shippingState = item.shippingState;
        this.customer.shippingCountry = item.shippingCountry;
        this.customer.registrationNumber = item.registrationNumber;
        this.customer.tradeName = item.tradeName;
        this.customer.legalName = item.legalName;
        this.customer.panNumber = item.panNumber;
        this.customer.tcsName = item.tcsName;
        this.customer.tcsRate = item.tcsRate;
        this.customer.tcsCode = item.tcsCode;
        this.customer.tdsName = item.tdsName;
        this.customer.tdsRate = item.tdsRate;
        this.customer.tdsCode = item.tdsCode;
        this.customer.additionalAddressList = item.additionalAddressList;
        this.customer.isSyncedToServer = item.isSyncedToServer;
        this.customer.tallySyncedStatus = item.tallySyncedStatus;
        this.customer.tallySynced = item.tallySynced;
        this.customer.aadharNumber = item.aadharNumber;
        this.customer.creditLimit = item.creditLimit;
        this.customer.msmeRegNo = item.msmeRegNo;
        this.customer.companyStatus = item.companyStatus;
        this.customer.tallyMappingName = item.tallyMappingName;
        this.customer.creditLimitDays = item.creditLimitDays;

        this.changeInCustomer = true;
      });
    } else {
      this.changeInCustomer = false;
    }
  };

  findCustomerOrVendor = async (id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data) {
          if (data.isVendor && data.isCustomer) {
            this.isBothCustomerAndVendor = true;
          } else if (data.isVendor && !data.isCustomer) {
            this.isAlreadyVendor = true;
          } else if (!data.isVendor && data.isCustomer) {
            this.isAlreadyCustomer = true;
          } else {
            this.isBothCustomerAndVendor = false;
            this.isAlreadyCustomer = false;
            this.isAlreadyVendor = false;
          }
        } else {
          this.isBothCustomerAndVendor = false;
          this.isAlreadyCustomer = false;
          this.isAlreadyVendor = false;
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  resetCustomerVendorStates = () => {
    this.isBothCustomerAndVendor = false;
    this.isAlreadyCustomer = false;
    this.isAlreadyVendor = false;
  };

  // Check Existing Vendor by Phone no
  findVendor = async (phoneNo) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { phoneNo: phoneNo },
            { isVendor: true }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data) {
          runInAction(() => {
            if (data.isVendor && data.isCustomer) {
              this.openAleadyVendorAndCustomerFoundModel = true;
            } else {
              this.openAleadyVendorFoundModel = true;
            }
            this.customer.name = data.name;
            this.customer.id = data.id;
            this.customer.phoneNo = data.phoneNo;
            this.customer.balanceType = data.balanceType;
            this.customer.balance = data.balance;
            this.customer.asOfDate = dateHelper.getTodayDateInYYYYMMDD();
            this.customer.gstNumber = data.gstNumber;
            this.customer.address = data.address;
            this.customer.pincode = data.pincode;
            this.customer.city = data.city;
            this.customer.emailId = data.emailId;
            this.customer.vipCustomer = data.vipCustomer;
            this.customer.isVendor = data.isVendor;
            this.customer.isCustomer = data.isCustomer;
            this.customer.updatedAt = data.updatedAt;
            this.customer.businessId = data.businessId;
            this.customer.businessCity = data.businessCity;
            this.isUpdate = true;
            this.customer.shippingAddress = data.shippingAddress;
            this.customer.shippingPincode = data.shippingPincode;
            this.customer.shippingCity = data.shippingCity;
            this.customer.state = data.state;
            this.customer.country = data.country;
            this.customer.shippingState = data.shippingState;
            this.customer.shippingCountry = data.shippingCountry;
            this.customer.registrationNumber = data.registrationNumber;
            this.customer.tradeName = data.tradeName;
            this.customer.legalName = data.legalName;
            this.customer.panNumber = data.panNumber;
            this.customer.tcsName = data.tcsName;
            this.customer.tcsRate = data.tcsRate;
            this.customer.tcsCode = data.tcsCode;
            this.customer.tdsName = data.tdsName;
            this.customer.tdsRate = data.tdsRate;
            this.customer.tdsCode = data.tdsCode;
            this.customer.additionalAddressList = data.additionalAddressList;
            this.customer.isSyncedToServer = data.isSyncedToServer;
            this.customer.tallySyncedStatus = data.tallySyncedStatus;
            this.customer.tallySynced = data.tallySynced;
            this.customer.aadharNumber = data.aadharNumber;
            this.customer.creditLimit = data.creditLimit;
            this.customer.msmeRegNo = data.msmeRegNo;
            this.customer.companyStatus = data.companyStatus;
            this.customer.tallyMappingName = data.tallyMappingName;
            this.customer.creditLimitDays = data.creditLimitDays;
          });
        } else {
          console.log('not registered not success');
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  // to hanle close mobile popup
  closeAleadyVendorFoundModel = () => {
    this.openAleadyVendorFoundModel = false;
  };

  isChecked = (value) => {
    runInAction(() => {
      this.customer['isCustomer'] = value;
      this.openAleadyVendorFoundModel = false;
    });
  };

  getSalesReturnData = async (db, customerId) => {
    console.log('getSalesReturnData');
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { customer_id: { $eq: customerId } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Sales Return';
          // console.log('sales return', finalData);

          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  searchInSalesReturnData = async (db, id, value) => {
    console.log('searchInSalesReturnData');
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              customer_id: { $eq: id }
            },
            { invoice_date: { $eq: value } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          console.log('sales return', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Sales Return';
          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  getPaymentInData = async (db, id) => {
    console.log('getPaymentInData');
    const businessData = await Bd.getBusinessData();

    await db.paymentin
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { customerId: { $eq: id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          console.log('payment in', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Payment In';
          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  searchInPaymentInData = async (db, id, value) => {
    console.log('searchInPaymentInData');
    const businessData = await Bd.getBusinessData();

    await db.paymentin
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              customerId: { $eq: id }
            },
            { date: { $eq: value } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          // console.log('payment in', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Payment In';
          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  getCreditPurchaseData = async (db, id) => {
    console.log('getCreditPurchaseData');
    const businessData = await Bd.getBusinessData();

    await db.purchases
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { vendor_id: { $eq: id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          // console.log('purchases', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases';
          finalData.date = item.bill_date;

          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  searchInCreditPurchaseData = async (db, id, value) => {
    console.log('searchInCreditPurchaseData');
    const businessData = await Bd.getBusinessData();

    await db.purchases
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              vendor_id: { $eq: id }
            },
            { bill_date: { $eq: value } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          console.log('purchases', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases';
          finalData.date = item.bill_date;

          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  getSaledata = async (db, id) => {
    console.log('getSaledata');
    const businessData = await Bd.getBusinessData();

    await db.sales
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { customer_id: { $eq: id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          // console.log('sales', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Sales';
          finalData.date = item.invoice_date;

          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  searchInSaledata = async (db, id, value) => {
    console.log('searchInSaledata');
    const businessData = await Bd.getBusinessData();

    await db.sales
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              customer_id: { $eq: id }
            },
            { invoice_date: { $eq: value } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          // console.log('sales', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Sales';
          finalData.date = item.invoice_date;

          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  getPaymentOutData = async (db, id) => {
    console.log('getPaymentOutData');
    const businessData = await Bd.getBusinessData();

    await db.paymentout
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { vendorId: { $eq: id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          console.log('paymentout', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Payment Out';
          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  searchInPaymentOutData = async (db, id, value) => {
    console.log('searchInPaymentOutData');
    const businessData = await Bd.getBusinessData();

    await db.paymentout
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              vendorId: { $eq: id }
            },
            { date: { $eq: value } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          console.log('paymentout', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Payment Out';
          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  getPurchaseReturnsData = async (db, id) => {
    console.log('getPurchaseReturnsData');
    const businessData = await Bd.getBusinessData();

    await db.purchasesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { vendor_id: { $eq: id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          // console.log('purchasesreturn', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases Return';
          finalData.date = item.invoice_date;

          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  searchInPurchaseReturnsData = async (db, id, value) => {
    console.log('searchInPurchaseReturnsData');
    const businessData = await Bd.getBusinessData();

    await db.purchasesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              vendor_id: { $eq: id }
            },
            { bill_date: { $eq: value } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          console.log('purchasesreturn', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases Return';
          runInAction(() => {
            this.customerTransactionList.push(finalData);
          });
        });
      });
  };

  setCopyBusiness = async () => {
    this.copyShippingAddress = false;
  };

  // Trim white spaces of all fields in the object
  trimObjectFields = async (obj) => {
    if (obj) {
      await Object.keys(obj).forEach((key) => {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].trim();
        }
      });
    }

    return obj;
  };

  updateExcelCustomerRowData = async (row, id) => {
    const customerData = await findParty({
      $and: [{ id: { $eq: id } }, { isCustomer: true }]
    });
    const changeData = async (oldData) => {
      row.eachCell((cell, colNumber) => {
        switch (updateExcelPartyMapping.list[colNumber]) {
          case 'state':
            if (cell.value !== 'Select State') {
              oldData[updateExcelPartyMapping.list[colNumber]] = cell.value;
            }
            break;
          default:
            return (oldData[updateExcelPartyMapping.list[colNumber]] =
              cell.value);
        }
      });

      if (oldData.gstNumber !== '' && oldData.gstNumber !== null) {
        const API_SERVER = window.REACT_APP_API_SERVER;
        await axios
          .get(`${API_SERVER}/pos/v1/gstIn/get`, {
            params: {
              gstNumber: oldData.gstNumber
            }
          })
          .then(async (res) => {
            if (res) {
              if (res.data && res.data.valid === true) {
                let responseData = res.data;
                if (responseData.company_details) {
                  if (
                    responseData.company_details.company_status !== null &&
                    (responseData.company_details.company_status ===
                      'Cancelled' ||
                      responseData.company_details.company_status ===
                        'Suspended')
                  ) {
                    // do nothing
                  } else {
                    oldData.legalName = responseData.company_details.legal_name;
                    oldData.tradeName = responseData.company_details.trade_name;
                    oldData.gstNumber = responseData.gstin;
                    oldData.name = responseData.company_details.trade_name;
                    if (
                      responseData.company_details.gst_type &&
                      responseData.company_details.gst_type !== ''
                    ) {
                      if (responseData.company_details.gst_type === 'Regular') {
                        oldData.gstType = 'Registered Customer';
                      } else if (
                        responseData.company_details.gst_type === 'Composition'
                      ) {
                        oldData.gstType = 'Composition Reg Customer';
                      } else if (
                        responseData.company_details.gst_type === 'Overseas'
                      ) {
                        oldData.gstType = 'Oveseas Customer';
                      }
                    }
                  }

                  oldData.companyStatus =
                    responseData.company_details.company_status;
                  oldData.panNumber = responseData.company_details.pan;

                  if (
                    responseData.company_details.pradr &&
                    responseData.company_details.pradr.pincode &&
                    responseData.company_details.pradr.pincode !== ''
                  ) {
                    oldData.pincode =
                      responseData.company_details.pradr.pincode;
                    oldData.shippingPincode =
                      responseData.company_details.pradr.pincode;
                  }

                  if (
                    responseData.company_details.pradr &&
                    responseData.company_details.pradr.city &&
                    responseData.company_details.pradr.city !== ''
                  ) {
                    oldData.city = responseData.company_details.pradr.city;
                    oldData.shippingCity =
                      responseData.company_details.pradr.city;
                  }

                  if (
                    responseData.company_details.state &&
                    responseData.company_details.state !== ''
                  ) {
                    let extractedStateCode =
                      responseData.company_details.state.slice(0, 2);
                    let result = getStateList().find(
                      (e) => e.code === extractedStateCode
                    );
                    if (result) {
                      oldData.place_of_supply = result.name;
                      oldData.state = result.name;
                      oldData.country = 'India';

                      oldData.shippingState = result.name;
                      oldData.shippingCountry = 'India';
                    }
                  }

                  if (
                    responseData.company_details.pradr &&
                    responseData.company_details.pradr.addr &&
                    responseData.company_details.pradr.addr !== ''
                  ) {
                    oldData.address = responseData.company_details.pradr.addr;
                    oldData.shippingAddress =
                      responseData.company_details.pradr.addr;
                  }

                  if (
                    responseData.company_details.adadr &&
                    responseData.company_details.adadr.length > 0
                  ) {
                    for (let address of responseData.company_details.adadr) {
                      let newAddress = {
                        id: '',
                        tradeName: '',
                        placeOfSupply: '',
                        billingAddress: '',
                        billingPincode: '',
                        billingCity: '',
                        billingState: '',
                        billingCountry: '',
                        shippingAddress: '',
                        shippingPincode: '',
                        shippingCity: '',
                        shippingState: '',
                        shippingCountry: ''
                      };

                      newAddress.billingAddress = address.addr;
                      newAddress.billingPincode = address.pincode;
                      newAddress.billingCity = address.city;

                      newAddress.tradeName =
                        responseData.company_details.trade_name;
                      newAddress.billingCountry = 'India';
                      newAddress.billingState = address.state;
                      oldData.additionalAddressList.push(newAddress);
                    }
                  }
                }
              }
            }
          });
      }

      oldData['balance'] = parseFloat(oldData['balance'] || 0);
      oldData.updatedAt = Date.now();

      return oldData;
    };
    await customerData.atomicUpdate(changeData);
  };

  saveExcelCustomerRowData = async (row) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const timestamp = Date.now();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('c');

    let customer = new Customer().getDefaultValues();
    customer.id = `${id}${appId}${timestamp}`;
    customer.businessId = businessData.businessId;
    customer.businessCity = businessData.businessCity;

    customer.posId = parseFloat(businessData.posDeviceId);
    customer.updatedAt = Date.now();
    // Iterate over each cell in the row
    row.eachCell((cell, colNumber) => {
      switch (excelPartyMapping.list[colNumber]) {
        case 'state':
          if (cell.value !== 'Select State') {
            customer[excelPartyMapping.list[colNumber]] = cell.value;
          }
          break;
        default:
          return (customer[excelPartyMapping.list[colNumber]] = cell.value);
      }
    });

    customer['balance'] = parseFloat(customer['balance'] || 0);
    customer.balanceType = 'Payable';
    customer.asOfDate = customer.asOfDate
      ? this.excelDateToJSDate(customer.asOfDate)
      : dateHelper.getTodayDateInYYYYMMDD();

    if (customer.gstNumber !== '') {
      const API_SERVER = window.REACT_APP_API_SERVER;
      await axios
        .get(`${API_SERVER}/pos/v1/gstIn/get`, {
          params: {
            gstNumber: customer.gstNumber
          }
        })
        .then(async (res) => {
          if (res) {
            if (res.data && res.data.valid === true) {
              let responseData = res.data;
              if (responseData.company_details) {
                if (
                  responseData.company_details.company_status !== null &&
                  (responseData.company_details.company_status ===
                    'Cancelled' ||
                    responseData.company_details.company_status === 'Suspended')
                ) {
                  // do nothing
                } else {
                  customer.legalName = responseData.company_details.legal_name;
                  customer.tradeName = responseData.company_details.trade_name;
                  customer.gstNumber = responseData.gstin;
                  customer.name = responseData.company_details.trade_name;
                  if (
                    responseData.company_details.gst_type &&
                    responseData.company_details.gst_type !== ''
                  ) {
                    if (responseData.company_details.gst_type === 'Regular') {
                      customer.gstType = 'Registered Customer';
                    } else if (
                      responseData.company_details.gst_type === 'Composition'
                    ) {
                      customer.gstType = 'Composition Reg Customer';
                    } else if (
                      responseData.company_details.gst_type === 'Overseas'
                    ) {
                      customer.gstType = 'Oveseas Customer';
                    }
                  }
                }

                customer.companyStatus =
                  responseData.company_details.company_status;
                customer.panNumber = responseData.company_details.pan;

                if (
                  responseData.company_details.pradr &&
                  responseData.company_details.pradr.pincode &&
                  responseData.company_details.pradr.pincode !== ''
                ) {
                  customer.pincode = responseData.company_details.pradr.pincode;
                  customer.shippingPincode =
                    responseData.company_details.pradr.pincode;
                }

                if (
                  responseData.company_details.pradr &&
                  responseData.company_details.pradr.city &&
                  responseData.company_details.pradr.city !== ''
                ) {
                  customer.city = responseData.company_details.pradr.city;
                  customer.shippingCity =
                    responseData.company_details.pradr.city;
                }

                if (
                  responseData.company_details.state &&
                  responseData.company_details.state !== ''
                ) {
                  let extractedStateCode =
                    responseData.company_details.state.slice(0, 2);
                  let result = getStateList().find(
                    (e) => e.code === extractedStateCode
                  );
                  if (result) {
                    customer.place_of_supply = result.name;
                    customer.state = result.name;
                    customer.country = 'India';

                    customer.shippingState = result.name;
                    customer.shippingCountry = 'India';
                  }
                }

                if (
                  responseData.company_details.pradr &&
                  responseData.company_details.pradr.addr &&
                  responseData.company_details.pradr.addr !== ''
                ) {
                  customer.address = responseData.company_details.pradr.addr;
                  customer.shippingAddress =
                    responseData.company_details.pradr.addr;
                }

                if (
                  responseData.company_details.adadr &&
                  responseData.company_details.adadr.length > 0
                ) {
                  for (let address of responseData.company_details.adadr) {
                    let newAddress = {
                      id: '',
                      tradeName: '',
                      placeOfSupply: '',
                      billingAddress: '',
                      billingPincode: '',
                      billingCity: '',
                      billingState: '',
                      billingCountry: '',
                      shippingAddress: '',
                      shippingPincode: '',
                      shippingCity: '',
                      shippingState: '',
                      shippingCountry: ''
                    };

                    newAddress.billingAddress = address.addr;
                    newAddress.billingPincode = address.pincode;
                    newAddress.billingCity = address.city;

                    newAddress.tradeName =
                      responseData.company_details.trade_name;
                    newAddress.billingCountry = 'India';
                    newAddress.billingState = address.state;
                    customer.additionalAddressList.push(newAddress);
                  }
                }
              }
            }
          }
        });
    } else {
      const InsertDoc = customer;
      InsertDoc.posId = parseFloat(businessData.posDeviceId);
      InsertDoc.updatedAt = Date.now();

      if (parseFloat(InsertDoc.balance) > 0) {
        //add to all transactions
        allTxn.saveTxnFromAddParties(InsertDoc, db);
      }

      await db.parties
        .insert(InsertDoc)
        .then(() => {
          console.log('data Inserted');
        })
        .catch((err) => {
          console.log('data insertion Failed::', err);
        });
    }
  };

  excelDateToJSDate = (date) => {
    let converted_date = new Date(Math.round((date - 25569) * 864e5));
    converted_date = String(converted_date).slice(4, 15);
    date = converted_date.split(' ');
    let day = date[1];
    let month = date[0];
    month = 'JanFebMarAprMayJunJulAugSepOctNovDec'.indexOf(month) / 3 + 1;
    if (month.toString().length <= 1) month = '0' + month;
    let year = date[2];
    let strDate = String(year + '-' + month + '-' + day);
    return strDate;
  };

  setTCS = (value) => {
    runInAction(() => {
      this.customer.tcsName = value.name;
      this.customer.tcsRate = value.rate;
      this.customer.tcsCode = value.code;
    });
  };

  revertTCS = () => {
    runInAction(() => {
      this.customer.tcsName = '';
      this.customer.tcsRate = 0;
      this.customer.tcsCode = '';
    });
  };

  setTDS = (value) => {
    runInAction(() => {
      this.customer.tdsName = value.name;
      this.customer.tdsRate = value.rate;
      this.customer.tdsCode = value.code;
    });
  };

  revertTDS = () => {
    runInAction(() => {
      this.customer.tdsName = '';
      this.customer.tdsRate = 0;
      this.customer.tdsCode = '';
    });
  };

  addAdditionalAddress = async () => {
    const timestamp = Date.now();
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('aaddr');

    let newAddress = {
      id: `${id}${appId}${timestamp}`,
      tradeName: '',
      placeOfSupply: '',
      billingAddress: '',
      billingPincode: '',
      billingCity: '',
      billingState: '',
      billingCountry: '',
      shippingAddress: '',
      shippingPincode: '',
      shippingCity: '',
      shippingState: '',
      shippingCountry: ''
    };

    this.customer.additionalAddressList.push(newAddress);
    this.copyShippingAddressMap.set(
      this.customer.additionalAddressList.length - 1,
      false
    );
  };

  setAdditionalAddress = (property, index, value) => {
    this.customer.additionalAddressList[index][property] = value;
  };

  removeAdditionalAddress = (index) => {
    this.customer.additionalAddressList.splice(index, 1);
    this.copyShippingAddressMap.delete(index);
  };

  setAdditionalBillingAddressCollapsibleIndex = (index, value) => {
    this.additionalBillingAddressCollapsibleMap.set(index, value);
  };

  setAdditionalShippingAddressCollapsibleIndex = (index, value) => {
    this.additionalShippingAddressCollapsibleMap.set(index, value);
  };

  setCopyShippingAddressMap = (index, value) => {
    this.copyShippingAddressMap.set(index, value);
  };

  addAdditionalAddressFromGSTFetch = (newAddress) => {
    this.customer.additionalAddressList.push(newAddress);
    this.copyShippingAddressMap.set(
      this.customer.additionalAddressList.length - 1,
      false
    );
  };

  updateCustomerTallySyncStatus = async (status, customerId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.parties.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            id: {
              $eq: customerId
            }
          }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Sales data is not found so cannot update any information
          return;
        }

        await query
          .update({
            $set: {
              updatedAt: Date.now(),
              tallySynced: status
            }
          })
          .then(async (data) => {
            runInAction(() => {});
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      })
      .catch((err) => {
        console.log('Internal Server Error Sale Order', err);
      });
  };

  updateBulkCustomerTallySyncStatus = async (inputItems, status) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    for (var i = 0; i < inputItems.length; i++) {
      let item = inputItems[i];
      let updatedAtNewTime = timestamp.getUniqueTimestamp();
      const query = await db.parties.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              id: {
                $eq: item.customer_id
              }
            }
          ]
        }
      });
      query
        .exec()
        .then(async (data) => {
          if (!data) {
            // No Customers data is not found so cannot update any information
            return;
          }

          if (data.tallySynced !== status) {
            await query
              .update({
                $set: {
                  updatedAt: updatedAtNewTime,
                  tallySynced: status
                }
              })
              .catch((err) => {
                console.log('Internal Server Error', err);
              });
          }
        })
        .catch((err) => {
          console.log('Internal Server Error Sale Order', err);
        });
    }
  };

  findCustomerOrVendorWithSameGSTNo = async (gstNumber) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    let gstNumberAlreadyExists = false;
    await db.parties
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { gstNumber: { $eq: gstNumber } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data && data.length > 0) {
          gstNumberAlreadyExists = true;
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return gstNumberAlreadyExists;
  };

  findCustomerByPhoneNumber = async (phoneNo, id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let isFound = false;

    await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { phoneNo: { $eq: phoneNo } },
            { isCustomer: true }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data && data.id !== id) {
          isFound = true;
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return isFound;
  };

  resetCustomer = () => {
    runInAction(() => {
      this.customer = this.customerDefault;
      this.customerLedgerTransactionList = [];
      this.customerTransactionList = [];
      this.selectedParty = '';
    });
  };

  resetCustomerToDefaultState = (oldPhoneNo) => {
    runInAction(() => {
      this.customer = this.customerDefault;
      this.customer.phoneNo = oldPhoneNo;
    });
  };

  resetCustomersNotProcessed = () => {
    runInAction(() => {
      this.customersNotProcessed = [];
    });
  };

  addCustomersNotProcessed = (value) => {
    runInAction(() => {
      this.customersNotProcessed.push(value);
    });
  };

  // setting variables as observables so that it can be accesible
  // from other components and making methods as actions to invoke from other components
  constructor() {
    this.customer = new Customer().getDefaultValues();
    this.customerDefault = new Customer().getDefaultValues();
    
    makeObservable(this, {
      customer: observable,
      customerDialogOpen: observable,
      customerList: observable,
      disableBalanceEdit: observable,
      customerTransactionList: observable,
      customerLedgerTransactionList: observable,
      isUpdate: observable,
      selectedParty: observable,
      openAleadyVendorFoundModel: observable,
      openAleadyVendorAndCustomerFoundModel: observable,
      isCustomerList: observable,
      customerFromSales: observable,
      customerFromKot: observable,
      isAlreadyCustomer: observable,
      isAlreadyVendor: observable,
      isBothCustomerAndVendor: observable,
      copyShippingAddress: observable,
      additionalBillingAddressCollapsibleMap: observable,
      additionalShippingAddressCollapsibleMap: observable,
      copyShippingAddressMap: observable,
      customerLedgerTransactions: observable,
      changeInCustomer: observable,
      customersNotProcessed: observable
      // custFromDate: observable,
      // custToDate: observable,
    });
  }
}

// this is to make this component public so that it is assible from other componets
export default new CustomerStore();