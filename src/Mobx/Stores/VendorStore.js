import { observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import * as timestamp from '../../components/Helpers/TimeStampGeneratorHelper';
import getStateList from 'src/components/StateList';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import Vendor from 'src/Mobx/Stores/classes/Vendor';
import {
  excelPartyMapping,
  updateExcelPartyMapping
} from 'src/components/Helpers/ExcelMappingHelper';
import axios from 'axios';
import { findParty } from 'src/components/Helpers/dbQueries/parties';

class VendorStore {
  vendorDialogOpen = false;
  openAleadyCustomerFoundModel = false;
  openAleadyVendorAndCustomerFoundModel = false;

  isBothCustomerAndVendor = false;
  isAlreadyCustomer = false;
  isAlreadyVendor = false;

  vendorList = [];

  vendorTransactionList = [];
  vendorLedgerTransactionList = [];

  vendorFromPurchases = {};

  copyShippingAddress = false;

  isUpdate = false;
  isEdit = false;
  isVendorList = false;

  selectedParty = '';

  additionalBillingAddressCollapsibleMap = new Map();
  additionalShippingAddressCollapsibleMap = new Map();
  copyShippingAddressMap = new Map();

  vendorLedgerTransactions = [];
  vendorDataFromGST = {};

  today = new Date().getDate();
  thisYear = new Date().getFullYear();
  thisMonth = new Date().getMonth();

  changeInVendor = false;
  vendorsNotProcessed = [];

  vendorFromDate = dateHelper.formatDateToYYYYMMDD(
    dateHelper.getFinancialYearStartDate()
  );
  vendorToDate = dateHelper.formatDateToYYYYMMDD(
    dateHelper.getFinancialYearEndDate()
  );

  setVendorProperty = (property, value) => {
    runInAction(() => {
      this.vendor[property] = value;
    });
  };
  
  setIsUpdate = () => {
    this.isUpdate = true;
  };

  setVendorFromDate = (value) => {
    runInAction(() => {
      this.vendorFromDate = value;
    });
  };

  setVendorToDate = (value) => {
    runInAction(() => {
      this.vendorToDate = value;
    });
  };

  getVendorCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    await db.parties
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { isVendor: { $eq: true } }
          ]
        }
      })
      .exec()
      .then((data) => {
        this.isVendorList = data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
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

  saveData = async (isSaveAndNew) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    /**
     * check whether already a person regisered with same mobile number
     */
    // console.log('save:::', this.vendor);

    this.vendor.balanceType = this.vendor.balanceType || 'Payable';
    this.vendor.balance = this.vendor.balance || 0;
    this.vendor.balance = parseFloat(this.vendor.balance);
    // this.vendor.pincode = parseFloat(this.vendor.pincode);
    // console.log("this.vendor",this.vendor);
    this.vendor.posId = parseFloat(businessData.posDeviceId);

    const properties = ['tcsRate', 'tdsRate', 'creditLimit'];

    properties.forEach((property) =>
      this.setDefaultValue(this.vendor, property, 0)
    );

    this.setDefaultValue(this.vendor, 'vipCustomer', false);
    this.setDefaultValue(this.vendor, 'isVendor', true);
    this.setDefaultValue(this.vendor, 'isCustomer', false);
    this.setDefaultValue(this.vendor, 'isSyncedToServer', false);
    this.setDefaultValue(this.vendor, 'tallySynced', false);

    if (!this.isUpdate) {
      await this.saveVendorData(db, businessData, isSaveAndNew);
    } else {
      await this.updateVendorData(db, isSaveAndNew);
    }
  };

  deleteInitialVendorTxn = async (id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.paymentin.find({
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

    const query2 = db.paymentout.find({
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

  updateVendorData = async (db, isSaveAndNew) => {
    let updateDoc = this.vendor;
    const businessData = await Bd.getBusinessData();

    const query = db.parties.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: updateDoc.id }
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

        if (this.vendorTransactionList.length === 0) {
          //delete initila txn
          await allTxn.deleteTxnFromAddParties(updateDoc, db);

          if (parseFloat(updateDoc.balance) > 0) {
            await allTxn.saveTxnFromAddParties(updateDoc, db);
          }
        }

        //save to audit
        await audit.addAuditEvent(
          updateDoc.id,
          '',
          'Vendor',
          'Update',
          JSON.stringify(updateDoc),
          '',
          this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
        );

        try {
          await query.update({
            $set: {
              name: updateDoc.name,
              balanceType: updateDoc.balanceType,
              balance: parseFloat(updateDoc.balance),
              asOfDate: updateDoc.asOfDate,
              gstNumber: updateDoc.gstNumber,
              gstType: updateDoc.gstType,
              address: updateDoc.address,
              pincode: updateDoc.pincode,
              city: updateDoc.city,
              emailId: updateDoc.emailId,
              isVendor: updateDoc.isVendor,
              isCustomer: updateDoc.isCustomer,
              place_of_supply: updateDoc.place_of_supply,
              updatedAt: Date.now(),
              phoneNo: updateDoc.phoneNo,
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
          audit.addAuditEvent(
            updateDoc.id,
            '',
            'Vendor',
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
          await this.updateVendorTxnWithNewMobileNumberAndName(
            db,
            updateDoc.id
          );
        }

        if (isSaveAndNew) {
          console.log('is save and new');
          runInAction(() => {
            this.vendor = this.vendorDefault;
          });
        } else {
          runInAction(() => {
            this.vendorDialogOpen = false;
            this.disableBalanceEdit = false;
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        audit.addAuditEvent(
          updateDoc.id,
          '',
          'Vendor',
          'Update',
          JSON.stringify(updateDoc),
          err.message,
          this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
        );
      });
  };

  updateVendorTxnWithNewMobileNumberAndName = async (
    db,
    vendorId,
    updateDoc
  ) => {
    if (this.vendorTransactionList.length > 0) {
      for (let txn of this.vendorTransactionList) {
        //based on txn type update those
        const businessData = await Bd.getBusinessData();

        if (txn.transactionType === 'Payment In') {
          const query = db.paymentin.findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { receiptNumber: txn.receiptNumber }
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
                { businessId: { $eq: businessData.businessId } },
                { bill_number: txn.bill_number }
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
                { businessId: { $eq: businessData.businessId } },
                { invoice_number: txn.invoice_number }
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
                { businessId: { $eq: businessData.businessId } },
                { receiptNumber: txn.receiptNumber }
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
                { businessId: { $eq: businessData.businessId } },
                { purchase_return_number: txn.purchase_return_number }
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
                { businessId: { $eq: businessData.businessId } },
                { sales_return_number: txn.sales_return_number }
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

      this.updateVendorDataInTxnTable(db, vendorId, updateDoc);
    }
  };

  updateVendorDataInTxnTable = async (db, vendorId, updateDoc) => {
    const businessData = await Bd.getBusinessData();

    db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { vendorId: { $eq: vendorId } }
          ]
        }
      })
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
                vendorName: updateDoc.name,
                vendorPhoneNumber: updateDoc.phoneNo
              }
            });
          });
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getVendorData = async (db, phoneNo) => {
    const businessData = await Bd.getBusinessData();

    const vendorData = await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { phoneNo: { $eq: phoneNo } }
          ]
        }
      })
      .exec();

    return vendorData;
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

  saveVendorData = async (db, businessData, isSaveAndNew) => {
    // let data = await this.getVendorData(db, this.vendor.phoneNo);

    // let isAlreadyRegistered = false;

    // if (data) {
    //   if (data.isCustomer || data.isVendor) {
    //     isAlreadyRegistered = true;
    //   }
    // }

    // if (!isAlreadyRegistered) {
    /**
     * vendor not registered
     */
    // generate unique id
    const appId = businessData.posDeviceId;

    const timestamp = Date.now();
    const id = _uniqueId('pr');
    this.vendor.id = `${id}${appId}${timestamp}`;

    this.vendor.businessId = businessData.businessId;
    this.vendor.businessCity = businessData.businessCity;

    const InsertDoc = this.vendor;
    InsertDoc.updatedAt = Date.now();

    if (parseFloat(InsertDoc.balance) > 0) {
      allTxn.saveTxnFromAddParties(InsertDoc, db);
    }

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.id,
      '',
      'Vendor',
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
      .catch((error) => {
        console.log('data insertion Failed:', error);
        audit.addAuditEvent(
          InsertDoc.id,
          '',
          'Vendor',
          'Save',
          JSON.stringify(InsertDoc),
          error.message ? error.message : 'Vendor Save Failed',
          this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
        );
      });

    if (this.vendorFromPurchases.isNewVendor) {
      this.vendorFromPurchases = { ...InsertDoc };
    }

    if (isSaveAndNew) {
      console.log('is save and new');
      this.vendor = this.vendorDefault;
    } else {
      this.vendorDialogOpen = false;
    }

    runInAction(async () => {
      this.isVendorList = true;
    });
    // }
  };

  setToDefaults = () => {
    runInAction(() => {
      this.vendorTransactionList = [];
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

  deleteVendor = async (item) => {
    await this.getVendorTransactionList(item.id);

    const db = await Db.get();

    //remove opening balalce txn types
    if (
      this.vendorTransactionList.length === 1 &&
      (this.vendorTransactionList[0].txnType === 'Opening Receivable Balance' ||
        this.vendorTransactionList[0].txnType === 'Opening Payable Balance')
    ) {
      //remove from all txn table
      allTxn.deleteTxnFromAddParties(this.vendorTransactionList[0], db);
      runInAction(() => {
        this.vendorTransactionList = [];
      });
    }

    if (this.vendorTransactionList.length === 0) {
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
        'Vendor',
        'Delete',
        JSON.stringify(item),
        '',
        this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
      );

      await query
        .remove()
        .then(async (data) => {
          console.log('vendor data removed' + data);

          this.vendor = this.vendorDefault;
        })
        .catch((error) => {
          console.log('vendor deletion Failed ' + error);
          //save to audit
          audit.addAuditEvent(
            item.id,
            '',
            'Vendor',
            'Delete',
            JSON.stringify(item),
            error.message,
            this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
          );
        });
    } else {
      alert(
        'vendor having Transactions please delete them before deleting cutomer'
      );
    }
  };

  // get all vendors
  getVendorlist = async () => {
    this.setToDefaults();
    console.log('get vendor called');
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    let query = db.parties.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { isVendor: { $eq: true } }
        ]
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        // No customer is available
        return;
      }
      this.vendorList = [];
      this.vendorTransactionList = [];
      this.vendorList = data.map((item) => item.toJSON());
      if (this.vendorList.length) {
        const first = this.vendorList[0];
        console.log(first);
        if (!this.vendorDialogOpen) {
          this.vendor = first;
          this.getVendorTransactionList(this.vendor.id);
        }
      }
    });
  };

  // get all vendor transactions by vendor id
  getVendorTransactionList = async (id) => {
    console.log('get vendor called');
    const db = await Db.get();

    runInAction(() => {
      this.vendorTransactionList = [];
    });

    const businessData = await Bd.getBusinessData();

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

        const finalData = data.map((item) => item.toJSON());

        if (!finalData) {
          finalData = [];
        }
        const finalLedgerData = await allTxn.calculateLedgerBalance(
          finalData.reverse()
        );

        runInAction(() => {
          this.vendorTransactionList = finalData;
          this.vendorLedgerTransactionList = finalLedgerData;
        });
      });
  };

  resetVendorTransactionList = () => {
    this.vendorTransactionList = [];
  };

  setSelectedPartyId = (id) => {
    runInAction(() => {
      this.selectedParty = id;
    });
  };

  isDate = async (date) => {
    if (isNaN(date) && !isNaN(Date.parse(date))) return true;
    else return false;
  };

  // search specific vendor tranactions
  handleVendorTransactionSearch = async (value) => {
    let id = this.vendor.id;
    if (value.length > 0) {
      this.setToDefaults();
      const db = await Db.get();

      var regexp = new RegExp('^.*' + value + '.*$', 'i');

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
            this.vendorTransactionList = finalData;
          });
        });
      // console.log('transactions:', this.customerTransactionList);
    } else if (value.length === 0) {
      this.getVendorTransactionList(id);
    }
  };

  getVendor = async (id) => {
    console.log('get one vendor called');
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.parties
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        this.vendor = data;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  // to handle add vendor popup
  handleVendorModalOpen = () => {
    console.log('clicked dialoge open');
    this.vendor = this.vendorDefault;
    this.vendorDialogOpen = true;
    this.isUpdate = false;
    this.isEdit = false;
    this.openAleadyCustomerFoundModel = false;
  };

  handleVendorModalOpenFromPurchases = () => {
    console.log('clicked dialoge open');
    this.vendor = this.vendorDefault;
    this.vendorDialogOpen = true;
    this.isUpdate = false;
    this.isEdit = false;
    this.openAleadyCustomerFoundModel = false;
    this.vendorFromPurchases.isNewVendor = true;
  };

  resetVendorFromPurchases = () => {
    this.vendorFromPurchases = {};
  };

  // to hanle close vendor popup
  handleVendorModalClose = () => {
    console.log('clicked dialoge close');
    if (this.vendorList.length > 0) {
      this.vendor = this.vendorList[0];
    } else {
      this.vendor['name'] = '';
    }
    this.vendorDialogOpen = false;
    this.disableBalanceEdit = false;
  };

  // to hanle close mobile popup
  closeAleadyCustomerFoundModel = () => {
    this.openAleadyCustomerFoundModel = false;
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

  // Check Existing Customer by Phone no

  findCustomer = async (phoneNo) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { phoneNo: phoneNo },
            { isCustomer: true }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data) {
          if (data.isVendor && data.isCustomer) {
            this.openAleadyVendorAndCustomerFoundModel = true;
          } else {
            this.openAleadyCustomerFoundModel = true;
          }

          this.vendor.name = data.name;
          this.vendor.id = data.id;
          this.vendor.phoneNo = data.phoneNo;
          this.vendor.balanceType = data.balanceType;
          this.vendor.balance = data.balance;
          this.vendor.asOfDate = dateHelper.getTodayDateInYYYYMMDD();
          this.vendor.gstNumber = data.gstNumber;
          this.vendor.address = data.address;
          this.vendor.pincode = data.pincode;
          this.vendor.city = data.city;
          this.vendor.emailId = data.emailId;
          this.vendor.vipCustomer = data.vipCustomer;
          this.vendor.isVendor = true;
          this.vendor.isCustomer = data.isCustomer;
          this.vendor.updatedAt = data.updatedAt;
          this.vendor.businessId = data.businessId;
          this.vendor.businessCity = data.businessCity;
          this.isUpdate = true;
          this.vendor.shippingAddress = data.shippingAddress;
          this.vendor.shippingPincode = data.shippingPincode;
          this.vendor.shippingCity = data.shippingCity;
          this.vendor.state = data.state;
          this.vendor.country = data.country;
          this.vendor.shippingState = data.shippingState;
          this.vendor.shippingCountry = data.shippingCountry;
          this.vendor.registrationNumber = data.registrationNumber;
          this.vendor.tradeName = data.tradeName;
          this.vendor.legalName = data.legalName;
          this.vendor.panNumber = data.panNumber;
          this.vendor.tcsName = data.tcsName;
          this.vendor.tcsRate = data.tcsRate;
          this.vendor.tcsCode = data.tcsCode;
          this.vendor.tdsName = data.tdsName;
          this.vendor.tdsRate = data.tdsRate;
          this.vendor.tdsCode = data.tdsCode;
          this.vendor.additionalAddressList = data.additionalAddressList;
          this.vendor.isSyncedToServer = data.isSyncedToServer;
          this.vendor.tallySyncedStatus = data.tallySyncedStatus;
          this.vendor.tallySynced = data.tallySynced;
          this.vendor.aadharNumber = data.aadharNumber;
          this.vendor.creditLimit = data.creditLimit;
          this.vendor.msmeRegNo = data.msmeRegNo;
          this.vendor.companyStatus = data.companyStatus;
          this.vendor.tallyMappingName = data.tallyMappingName;
          this.vendor.creditLimitDays = data.creditLimitDays;
        } else {
          console.log('not registered not success');
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  // to hanle close mobile popup
  handleMobileModalClose = () => {
    this.MobileDialogOpen = false;
  };

  isChecked = (value) => {
    console.log('selected yes or no::', value);
    this.openAleadyCustomerFoundModel = false;
  };

  setSelectedVendor = (item) => {
    this.setSelectedVendorData(item);
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
          console.log('sales return', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Sales Return';
          runInAction(() => {
            this.vendorTransactionList.push(finalData);
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
          finalData.paymentType = 'salesreturn';
          runInAction(() => {
            this.vendorTransactionList.push(finalData);
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
            this.vendorTransactionList.push(finalData);
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
          console.log('payment in', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Payment In';
          runInAction(() => {
            this.vendorTransactionList.push(finalData);
          });
        });
      });
  };

  viewOrEditItem = async (item) => {
    console.log('view or edit clicked::');

    /**
     * check for customer transactions if he has any then dont allow him to edit balance
     * else allow to edit everything
     */
    // await this.getVendorTransactionList(item.id);

    if (this.vendorTransactionList.length > 0) {
      runInAction(() => {
        this.disableBalanceEdit = true;
      });
    }

    this.isUpdate = true;
    this.isEdit = true;
    this.vendorDialogOpen = true;

    this.setSelectedVendorData(item);

    // console.log(item);
  };

  setSelectedVendorData = (item) => {
    if (item) {
      runInAction(() => {
        this.vendor.name = item.name;
        this.vendor.id = item.id;
        this.vendor.phoneNo = item.phoneNo;
        this.vendor.balanceType = item.balanceType;
        this.vendor.balance = item.balance;
        this.vendor.asOfDate = item.asOfDate;
        this.vendor.gstNumber = item.gstNumber;
        this.vendor.gstType = item.gstType;
        this.vendor.address = item.address;
        this.vendor.pincode = item.pincode;
        this.vendor.city = item.city;
        this.vendor.emailId = item.emailId;
        this.vendor.vipCustomer = item.vipCustomer;
        this.vendor.isVendor = item.isVendor;
        this.vendor.isCustomer = item.isCustomer;
        this.vendor.updatedAt = item.updatedAt;
        this.vendor.businessId = item.businessId;
        this.vendor.businessCity = item.businessCit;
        this.vendor.place_of_supply = item.place_of_supply;
        this.vendor.shippingAddress = item.shippingAddress;
        this.vendor.shippingPincode = item.shippingPincode;
        this.vendor.shippingCity = item.shippingCity;
        this.vendor.state = item.state;
        this.vendor.country = item.country;
        this.vendor.shippingState = item.shippingState;
        this.vendor.shippingCountry = item.shippingCountry;
        this.vendor.registrationNumber = item.registrationNumber;
        this.vendor.tradeName = item.tradeName;
        this.vendor.legalName = item.legalName;
        this.vendor.panNumber = item.panNumber;
        this.vendor.tcsName = item.tcsName;
        this.vendor.tcsRate = item.tcsRate;
        this.vendor.tcsCode = item.tcsCode;
        this.vendor.tdsName = item.tdsName;
        this.vendor.tdsRate = item.tdsRate;
        this.vendor.tdsCode = item.tdsCode;
        this.vendor.additionalAddressList = item.additionalAddressList;
        this.vendor.isSyncedToServer = item.isSyncedToServer;
        this.vendor.tallySyncedStatus = item.tallySyncedStatus;
        this.vendor.tallySynced = item.tallySynced;
        this.vendor.aadharNumber = item.aadharNumber;
        this.vendor.creditLimit = item.creditLimit;
        this.vendor.msmeRegNo = item.msmeRegNo;
        this.vendor.companyStatus = item.companyStatus;
        this.vendor.tallyMappingName = item.tallyMappingName;
        this.changeInVendor = true;
        this.vendor.creditLimitDays = item.creditLimitDays;
      });
    } else {
      this.changeInVendor = false;
    }
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
          console.log('purchases', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases';
          finalData.date = item.bill_date;

          runInAction(() => {
            this.vendorTransactionList.push(finalData);
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
            this.vendorTransactionList.push(finalData);
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
            this.vendorTransactionList.push(finalData);
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
            this.vendorTransactionList.push(finalData);
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
            this.vendorTransactionList.push(finalData);
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
            this.vendorTransactionList.push(finalData);
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
          console.log('purchasesreturn', item.toJSON());
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases Return';
          runInAction(() => {
            this.vendorTransactionList.push(finalData);
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
            this.vendorTransactionList.push(finalData);
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

  updateExcelVendorRowData = async (row, id) => {
    const vendorData = await findParty({
      $and: [{ id: { $eq: id } }, { isVendor: true }]
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
                        oldData.gstType = 'Registered Vendor';
                      } else if (
                        responseData.company_details.gst_type === 'Composition'
                      ) {
                        oldData.gstType = 'Composition Reg Vendor';
                      } else if (
                        responseData.company_details.gst_type === 'Overseas'
                      ) {
                        oldData.gstType = 'Oveseas Vendor';
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
    await vendorData.atomicUpdate(changeData);
  };

  saveExcelVendorRowData = async (row) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const timestamp = Date.now();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('c');

    let vendor = new Vendor().getDefaultValues();
    vendor.id = `${id}${appId}${timestamp}`;
    vendor.businessId = businessData.businessId;
    vendor.businessCity = businessData.businessCity;

    vendor.posId = parseFloat(businessData.posDeviceId);
    vendor.updatedAt = Date.now();
    // Iterate over each cell in the row
    row.eachCell((cell, colNumber) => {
      switch (excelPartyMapping.list[colNumber]) {
        case 'state':
          if (cell.value !== 'Select State') {
            vendor[excelPartyMapping.list[colNumber]] = cell.value;
          }
          break;
        default:
          return (vendor[excelPartyMapping.list[colNumber]] = cell.value);
      }
    });

    vendor['balance'] = parseFloat(vendor['balance'] || 0);
    vendor.balanceType = 'Payable';
    vendor.asOfDate = vendor.asOfDate
      ? this.excelDateToJSDate(vendor.asOfDate)
      : dateHelper.getTodayDateInYYYYMMDD();

    if (vendor.gstNumber !== '') {
      const API_SERVER = window.REACT_APP_API_SERVER;
      await axios
        .get(`${API_SERVER}/pos/v1/gstIn/get`, {
          params: {
            gstNumber: vendor.gstNumber
          }
        })
        .then(async (res) => {
          if (res) {
            if (res.data && res.data.valid === true) {
              let responseData = res.data;
              await this.addVendorFrom2B(
                responseData,
                vendor.phoneNo,
                vendor.tallyMappingName,
                vendor
              );
            }
          }
        });
    } else {
      const InsertDoc = vendor;
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

  setTCS = (value) => {
    runInAction(() => {
      this.vendor.tcsName = value.name;
      this.vendor.tcsRate = value.rate;
      this.vendor.tcsCode = value.code;
    });
  };

  revertTCS = () => {
    runInAction(() => {
      this.vendor.tcsName = '';
      this.vendor.tcsRate = 0;
      this.vendor.tcsCode = '';
    });
  };

  setTDS = (value) => {
    runInAction(() => {
      this.vendor.tdsName = value.name;
      this.vendor.tdsRate = value.rate;
      this.vendor.tdsCode = value.code;
    });
  };

  revertTDS = () => {
    runInAction(() => {
      this.vendor.tdsName = '';
      this.vendor.tdsRate = 0;
      this.vendor.tdsCode = '';
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

    this.vendor.additionalAddressList.push(newAddress);
    this.copyShippingAddressMap.set(
      this.vendor.additionalAddressList.length - 1,
      false
    );
  };

  addAdditionalAddressFromGSTFetch = (newAddress) => {
    this.vendor.additionalAddressList.push(newAddress);
    this.copyShippingAddressMap.set(
      this.vendor.additionalAddressList.length - 1,
      false
    );
  };

  setAdditionalAddress = (property, index, value) => {
    this.vendor.additionalAddressList[index][property] = value;
  };

  removeAdditionalAddress = (index) => {
    this.vendor.additionalAddressList.splice(index, 1);
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

  updateVendorTallySyncStatus = async (status, vendorId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.parties.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            id: {
              $eq: vendorId
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

  updateBulkVendorTallySyncStatus = async (inputItems, status) => {
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
                $eq: item.vendor_id
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

  findVendorByPhoneNumber = async (phoneNo, id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let isFound = false;

    await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { phoneNo: { $eq: phoneNo } },
            { isVendor: true }
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

  findVendorByGstNumber = async (gstNumber) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let vdata = {};

    await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { gstNumber: { $eq: gstNumber } },
            { isVendor: true }
          ]
        }
      })
      .exec()
      .then((data) => {
        vdata = data;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return vdata;
  };

  addVendorFrom2B = async (
    responseData,
    phoneNumber,
    tallyMappedName,
    vendorInput
  ) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    if (vendorInput) {
      this.vendor = vendorInput;
    } else {
      this.vendor = this.vendorDefault;
    }
    this.vendor.tallyMappingName = tallyMappedName;
    this.setVendorProperty('phoneNo', phoneNumber);

    if (responseData.company_details) {
      if (
        responseData.company_details.company_status !== null &&
        (responseData.company_details.company_status === 'Cancelled' ||
          responseData.company_details.company_status === 'Suspended')
      ) {
        // do nothing
      } else {
        this.setVendorProperty(
          'legalName',
          responseData.company_details.legal_name
        );
        this.setVendorProperty(
          'tradeName',
          responseData.company_details.trade_name
        );
        this.setVendorProperty('gstNumber', responseData.gstin);
        this.setVendorProperty('name', responseData.company_details.trade_name);

        if (
          responseData.company_details.gst_type &&
          responseData.company_details.gst_type !== ''
        ) {
          if (responseData.company_details.gst_type === 'Regular') {
            this.setVendorProperty('gstType', 'Registered Vendor');
          } else if (responseData.company_details.gst_type === 'Composition') {
            this.setVendorProperty('gstType', 'Composition Reg Vendor');
          } else if (responseData.company_details.gst_type === 'Overseas') {
            this.setVendorProperty('gstType', 'Oveseas Vendor');
          }
        }
      }

      this.setVendorProperty(
        'companyStatus',
        responseData.company_details.company_status
      );
      this.setVendorProperty('panNumber', responseData.company_details.pan);

      if (
        responseData.company_details.pradr &&
        responseData.company_details.pradr.pincode &&
        responseData.company_details.pradr.pincode !== ''
      ) {
        this.setVendorProperty(
          'pincode',
          responseData.company_details.pradr.pincode
        );
        this.setVendorProperty(
          'shippingPincode',
          responseData.company_details.pradr.pincode
        );
      }

      if (
        responseData.company_details.pradr &&
        responseData.company_details.pradr.city &&
        responseData.company_details.pradr.city !== ''
      ) {
        this.setVendorProperty('city', responseData.company_details.pradr.city);
        this.setVendorProperty(
          'shippingCity',
          responseData.company_details.pradr.city
        );
      }

      if (
        responseData.company_details.state &&
        responseData.company_details.state !== ''
      ) {
        let extractedStateCode = responseData.company_details.state.slice(0, 2);
        let result = getStateList().find((e) => e.code === extractedStateCode);
        if (result) {
          this.setVendorProperty('place_of_supply', result.name);
          this.setVendorProperty('state', result.name);
          this.setVendorProperty('country', 'India');

          this.setVendorProperty('shippingState', result.name);
          this.setVendorProperty('shippingCountry', 'India');
        }
      }

      if (
        responseData.company_details.pradr &&
        responseData.company_details.pradr.addr &&
        responseData.company_details.pradr.addr !== ''
      ) {
        this.setVendorProperty(
          'address',
          responseData.company_details.pradr.addr
        );
        this.setVendorProperty(
          'shippingAddress',
          responseData.company_details.pradr.addr
        );
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

          newAddress.tradeName = responseData.company_details.trade_name;
          newAddress.billingCountry = 'India';
          newAddress.billingState = address.state;

          this.addAdditionalAddressFromGSTFetch(newAddress);
        }
      }
    }

    this.vendor.balanceType = this.vendor.balanceType || 'Payable';
    this.vendor.balance = this.vendor.balance || 0;
    this.vendor.balance = parseFloat(this.vendor.balance);

    this.vendor.posId = parseFloat(businessData.posDeviceId);

    const appId = businessData.posDeviceId;

    const timestamp = Date.now();
    const id = _uniqueId('pr');
    this.vendor.id = `${id}${appId}${timestamp}`;

    this.vendor.businessId = businessData.businessId;
    this.vendor.businessCity = businessData.businessCity;

    const InsertDoc = this.vendor;
    InsertDoc.updatedAt = Date.now();

    if (parseFloat(InsertDoc.balance) > 0) {
      allTxn.saveTxnFromAddParties(InsertDoc, db);
    }

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.id,
      '',
      'Vendor',
      'Save',
      JSON.stringify(InsertDoc),
      '',
      this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
    );

    await db.parties
      .insert(InsertDoc)
      .then(() => {
        console.log('data Inserted');
        this.vendor = this.vendorDefault;
      })
      .catch((error) => {
        console.log('data insertion Failed:', error);
        audit.addAuditEvent(
          InsertDoc.id,
          '',
          'Vendor',
          'Save',
          JSON.stringify(InsertDoc),
          error.message ? error.message : 'Vendor Save Failed',
          this.formatDate(new Date(this.thisYear, this.thisMonth, this.today))
        );
        this.vendor = this.vendorDefault;
      });
  };

  resetVendor = () => {
    runInAction(() => {
      this.vendor = this.vendorDefault;
      this.vendorLedgerTransactionList = [];
      this.vendorTransactionList = [];
      this.selectedParty = '';
    });
  };

  resetVendorToDefaultState = (oldPhoneNo) => {
    runInAction(() => {
      this.vendor = this.vendorDefault;
      this.vendor.phoneNo = oldPhoneNo;
    });
  };

  resetVendorsNotProcessed = () => {
    runInAction(() => {
      this.vendorsNotProcessed = [];
    });
  };

  addVendorsNotProcessed = (value) => {
    runInAction(() => {
      this.vendorsNotProcessed.push(value);
    });
  };

  constructor() {
    this.vendorDefault = new Vendor().getDefaultValues();
    this.vendor = new Vendor().getDefaultValues();

    makeObservable(this, {
      vendor: observable,
      vendorDialogOpen: observable,
      vendorList: observable,
      vendorTransactionList: observable,
      vendorLedgerTransactionList: observable,
      openAleadyCustomerFoundModel: observable,
      openAleadyVendorAndCustomerFoundModel: observable,
      isVendorList: observable,
      vendorFromPurchases: observable,
      isAlreadyCustomer: observable,
      isAlreadyVendor: observable,
      isBothCustomerAndVendor: observable,
      copyShippingAddress: observable,
      additionalBillingAddressCollapsibleMap: observable,
      additionalShippingAddressCollapsibleMap: observable,
      copyShippingAddressMap: observable,
      vendorLedgerTransactions: observable,
      vendorDataFromGST: observable,
      changeInVendor: observable,
      selectedParty: observable,
      vendorsNotProcessed: observable
    });
  }
}
export default new VendorStore();