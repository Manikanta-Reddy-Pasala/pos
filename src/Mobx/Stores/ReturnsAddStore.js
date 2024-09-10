import {
  action,
  computed,
  observable,
  makeObservable,
  toJS,
  runInAction
} from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import * as productTxn from '../../components/Helpers/ProductTxnHelper';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import * as dateHelper from '../../components/Helpers/DateHelper';
import * as balanceUpdate from '../../components/Helpers/CustomerAndVendorBalanceHelper';
import * as cancelTxn from '../../components/Helpers/CancelTxnHelper';
import * as timestamp from '../../components/Helpers/TimeStampGeneratorHelper';
import * as lp from '../../components/Helpers/LinkPaymentHelper';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

var dateFormat = require('dateformat');

class ReturnsAddStore {
  newCustomer = false;

  isUpdate = false;

  openAddSalesReturn = false;

  saleEnabledRow = 0;

  saveAndNew = false;

  itemDataForUpdate;

  newCustomerData = {};
  selectedCustomerBalance = 0;

  salesTxnEnableFieldsMap = new Map();

  taxSettingsData = {};

  openAmendmentDialog = false;
  notPerformAmendment = false;

  returnDetails = {
    customer_id: '',
    customer_name: '',
    customer_phoneNo: '',
    customer_address: '',
    customer_city: '',
    customer_emailId: '',
    customer_pincode: '',
    customerGSTNo: '',
    customerGstType: '',
    invoice_number: 0,
    saleSequenceNumber: '',
    invoice_date: '',
    sales_return_number: '',
    sequenceNumber: '',
    date: getTodayDateInYYYYMMDD(),
    dueDate: getTodayDateInYYYYMMDD(),
    is_roundoff: false,
    round_amount: 0.0,
    total_amount: 0.0,
    is_credit: false,
    payment_type: 'Credit',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    paid_amount: 0.0,
    balance_amount: 0.0,
    linkedTxnList: [],
    linkPayment: false,
    linked_amount: 0,
    customerReceivable: false,
    discount_percent: 0,
    discount_amount: 0,
    discount_type: '',
    paymentReferenceNumber: '',
    notes: '',
    customerState: '',
    customerCountry: '',
    shipping_charge: 0,
    packing_charge: 0,
    return_discount_amount: 0,
    rateList: [],
    isCancelled: false,
    isSyncedToServer: false,
    invoiceStatus: '',
    tallySyncedStatus: '',
    calculateStockAndBalance: true,
    tallySynced: false,
    aadharNumber: '',
    salesEmployeeName: '',
    salesEmployeeId: '',
    salesEmployeePhoneNumber: '',
    saleTotalAmount: 0,
    amendmentDate: '',
    amended: false,
    amendmentReason: '',
    discountPercentForAllItems: 0,
    imageUrls: [],
  };

  returnDetailsList = [];

  salesReportFilters = [];

  saleDetails = {
    customer_id: '',
    isPartiallyReturned: '',
    isFullyReturned: '',
    // receivedAmount: 0,
    balanceAmount: 0,
    isCredit: false
  };

  saleItems = [
    {
      product_id: '',
      description: '',
      imageUrl: '',
      batch_id: 0,
      item_name: '',
      sku: '',
      barcode: '',
      mrp: 0,
      purchased_price: 0,
      offer_price: 0,
      size: '',
      qty: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      taxType: '',
      igst_amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      amount: 0,
      roundOff: 0,
      isEdit: true,
      returnedQty: 0,
      stockQty: 0,
      taxIncluded: false,
      vendorName: '',
      vendorPhoneNumber: '',
      brandName: '',
      categoryLevel2: '',
      categoryLevel2DisplayName: '',
      categoryLevel3: '',
      categoryLevel3DisplayName: '',
      returnChecked: false,
      wastagePercentage: '',
      wastageGrams: '',
      grossWeight: '',
      netWeight: '',
      purity: '',
      hsn: '',
      finalMRPPrice: 0,
      freeQty: 0,
      freeStockQty: 0,
      returnedFreeQty: 0
    }
  ];

  items = [
    {
      product_id: '',
      description: '',
      imageUrl: '',
      batch_id: 0,
      item_name: '',
      sku: '',
      barcode: '',
      mrp: 0,
      purchased_price: 0,
      offer_price: 0,
      size: 0,
      qty: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      taxType: '',
      igst_amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      amount: 0,
      roundOff: 0,
      isEdit: true,
      taxIncluded: false,
      stockQty: 0,
      vendorName: '',
      vendorPhoneNumber: '',
      brandName: '',
      categoryLevel2: '',
      categoryLevel2DisplayName: '',
      categoryLevel3: '',
      categoryLevel3DisplayName: '',
      returnChecked: false,
      wastagePercentage: '',
      wastageGrams: '',
      grossWeight: '',
      netWeight: '',
      purity: '',
      hsn: '',
      finalMRPPrice: 0,
      freeQty: 0,
      freeStockQty: 0,
      returnedFreeQty: 0,
      discount_percent: 0,
      discount_amount: 0,
      discount_amount_per_item: 0,
      discount_type: '',
      originalDiscountPercent: 0,
      hallmarkCharge: 0,
      certificationCharge: 0
    }
  ];

  paymentLinkTransactions = [];

  paymentUnLinkTransactions = [];
  unLinkedTxnList = [];
  isSalesReturnList = false;

  openLinkpaymentPage = false;

  returnsInvoiceRegular = {};
  returnsInvoiceThermal = {};

  sequenceData = {};

  isRestore = false;
  isCancelledRestore = false;

  printDataSalesReturn = null;
  printBalance = {};

  salesReturnTxnSettingsData = {};

  openSaleReturnLoadingAlertMessage = false;
  openSaleReturnErrorAlertMessage = false;

  openSaleReturnPrintSelectionAlert = false;

  roundingConfiguration = 'Nearest 50';

  sequenceNumberFailureAlert = false;

  isLocked = false;
  saleLockMessage = '';

  cancelRemark = '';
  openCancelDialog = false;
  cancelItem = {};

  resetAllData() {
    runInAction(() => {
      this.selectedCustomerBalance = 0;
      this.returnDetails = {};
      this.saleDetails = {};
      this.saleItems = [];
      this.items = [];
      this.unLinkedTxnList = [];
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.sequenceData = {};
    });
  }

  setSequencePrefix = (value) => {
    runInAction(() => {
      this.sequenceData.prefix = value;
      this.returnDetails.prefix = value;
    });
  };

  setNotes = (value) => {
    runInAction(() => {
      this.returnDetails.notes = value;
    });
  };

  setSequenceSubPrefix = (value) => {
    runInAction(() => {
      this.sequenceData.subPrefix = value;
      this.returnDetails.subPrefix = value;
    });
  };

  getSalesReturnCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isSalesReturnList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getSalesReturnList = async (fromDate, toDate) => {
    const db = await Db.get();
    var query;
    const businessData = await Bd.getBusinessData();

    if (fromDate && toDate) {
      query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      runInAction(() => {
        this.returnDetailsList = [];
      });
      await query.$.subscribe(async (data) => {
        if (!data) {
          return;
        }
        runInAction(() => {
          this.returnDetailsList = data.map((item) => item.toJSON());
        });
      });
    }
  };

  getSalesReturnListByCustomer = async (fromDate, toDate, mobileNo) => {
    const db = await Db.get();
    var query;
    const businessData = await Bd.getBusinessData();

    if (mobileNo) {
      query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            { customer_phoneNo: { $eq: mobileNo } }
          ]
        }
        // sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      runInAction(() => {
        this.returnDetailsList = [];
      });
      await query.$.subscribe(async (data) => {
        if (!data) {
          return;
        }
        runInAction(() => {
          this.returnDetailsList = data.map((item) => item.toJSON());
        });
      });
    } else {
      this.getSalesReturnList(fromDate, toDate);
    }
  };

  addSalesReturnData = async (data) => {
    runInAction(() => {
      this.returnDetailsList = data.map((item) => item.toJSON());
    });
  };

  handleSalesReturnSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                {
                  $and: [
                    { sequenceNumber: { $regex: regexp } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { payment_type: { $regex: regexp } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { customer_name: { $regex: regexp } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { total_amount: { $eq: parseFloat(value) } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { balance_amount: { $eq: parseFloat(value) } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
      .exec()
      .then((documents) => {
        data = documents.map((item) => item);
      });
    return data;
  };

  handleSalesReturnSearchWithCustomerAndDate = async (
    value,
    fromDate,
    toDate,
    mobileNo
  ) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                {
                  $and: [
                    { payment_type: { $regex: regexp } },
                    { customer_phoneNo: { $eq: mobileNo } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { customer_name: { $regex: regexp } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { sequenceNumber: { $regex: regexp } },
                    { customer_phoneNo: { $eq: mobileNo } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },

                {
                  $and: [
                    { total_amount: { $eq: parseFloat(value) } },
                    { customer_phoneNo: { $eq: mobileNo } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
      .exec()
      .then((documents) => {
        data = documents.map((item) => item);
      });
    return data;
  };

  handleSalesReturnSearchWithEmployeeAndDate = async (
    value,
    fromDate,
    toDate,
    employeeId
  ) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                {
                  $and: [
                    { payment_type: { $regex: regexp } },
                    { employeeId: { $eq: employeeId } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { sequenceNumber: { $regex: regexp } },
                    { employeeId: { $eq: employeeId } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { total_amount: { $eq: parseFloat(value) } },
                    { employeeId: { $eq: employeeId } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { customer_name: { $regex: regexp } },
                    { employeeId: { $eq: employeeId } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    // { paid_amount: { $eq: parseFloat(value) } },
                    { employeeId: { $eq: employeeId } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { balance_amount: { $eq: parseFloat(value) } },
                    { employeeId: { $eq: employeeId } },
                    {
                      date: {
                        $gte: fromDate
                      }
                    },
                    {
                      date: {
                        $lte: toDate
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
      .exec()
      .then((documents) => {
        data = documents.map((item) => item);
      });
    return data;
  };

  loadSaleData = async (sequenceNumber, isInsideDelete) => {
    this.openSaleReturnPrintSelectionAlert = false;
    if (sequenceNumber) {
      const businessData = await Bd.getBusinessData();

      const db = await Db.get();
      const query = db.sales.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { sequenceNumber: sequenceNumber }
          ]
        }
      });

      await query.exec().then(async (data) => {
        if (data) {
          runInAction(() => {
            this.items = [];
          });
          let tempItems = [];
          for (let item of data.item_list) {
            item.qty = parseFloat(item.qty) - parseFloat(item.returnedQty);
            if (item.qty > 0) {
              tempItems.push(item);
            }
          }

          runInAction(() => {
            this.items = tempItems;
            if (this.items.length === 1) {
              this.items[0].returnChecked = true;
            }
            this.saleItems = data.item_list;
            this.saleDetails.customer_id = data.customer_id;
            this.saleDetails.isPartiallyReturned = data.isPartiallyReturned;
            this.saleDetails.isFullyReturned = data.isFullyReturned;
            this.saleDetails.balanceAmount = data.balance_amount;
            this.saleDetails.isCredit = data.is_credit;
            // this.saleDetails.receivedAmount = data.received_amount;
            this.saleDetails.invoice_number = data.invoice_number;

            this.paymentLinkTransactions = [];

            /**
             * calculate amount and total
             */
            this.returnDetails.saleSequenceNumber = sequenceNumber;
            this.returnDetails.invoice_date = data.invoice_date;
            this.returnDetails.invoice_number = data.invoice_number;
            this.returnDetails.customer_name = data.customer_name;
            this.returnDetails.customer_id = data.customer_id;
            this.returnDetails.customerGSTNo = data.customerGSTNo;
            this.returnDetails.customerGstType = data.customerGstType;
            this.returnDetails.customer_phoneNo = data.customer_phoneNo;
            this.returnDetails.customer_emailId = data.customer_emailId;
            this.returnDetails.customer_pincode = data.customer_pincode;
            this.returnDetails.customer_address = data.customer_address;
            this.returnDetails.customerState = data.customerState;
            this.returnDetails.customerCountry = data.customerCountry;
            this.returnDetails.customer_city = data.customer_city;
            this.returnDetails.customerPanNumber = data.customerPanNumber;
            this.returnDetails.aadharNumber = data.aadharNumber;
            this.returnDetails.salesEmployeeName = data.salesEmployeeName;
            this.returnDetails.salesEmployeeId = data.salesEmployeeId;
            this.returnDetails.salesEmployeePhoneNumber =
              data.salesEmployeePhoneNumber;

            this.returnDetails.discount_percent = parseFloat(
              data.discount_percent || 0
            );
            this.returnDetails.discount_amount = parseFloat(
              data.discount_amount || 0
            );

            this.returnDetails.discount_type = data.discount_type;
            //this.returnDetails.payment_type = 'cash';

            // console.log('before balance::', this.saleDetails);
            let totalAmount = this.getTotalAmount;
            let balanceAmount = this.getBalanceData;

            this.returnDetails.total_amount = totalAmount > 0 ? totalAmount : 0;
            this.returnDetails.balance_amount =
              parseFloat(balanceAmount) > 0 ? balanceAmount : 0;

            this.returnDetails.saleSequenceNumber = data.sequenceNumber;

            this.returnDetails.rateList = data.rateList;
            this.returnDetails.is_roundoff = data.is_roundoff;
            this.returnDetails.tcsAmount = data.tcsAmount;
            this.returnDetails.tcsName = data.tcsName;
            this.returnDetails.tcsRate = data.tcsRate;
            this.returnDetails.tcsCode = data.tcsCode;
            this.returnDetails.tdsAmount = data.tdsAmount;
            this.returnDetails.tdsName = data.tdsName;
            this.returnDetails.tdsRate = data.tdsRate;
            this.returnDetails.tdsCode = data.tdsCode;
            this.returnDetails.dueDate = data.dueDate;
            this.returnDetails.splitPaymentList = data.splitPaymentList;
          });
          if (!isInsideDelete) {
            await this.getAllUnPaidTxnForCustomer(
              db,
              this.returnDetails.customer_id
            );
          }
        }
      });
    }
  };

  loadSaleDataForReturns = async (data) => {
    if (data) {
      let tempItems = [];
      for (let item of data.item_list) {
        item.qty = parseFloat(item.qty) - (parseFloat(item.returnedQty) || 0);
        item.freeQty =
          parseFloat(item.freeQty) - (parseFloat(item.returnedFreeQty) || 0);
        if (item.qty > 0 || item.freeQty > 0) {
          tempItems.push(item);
        }
      }

      runInAction(() => {
        this.items = tempItems;

        this.items.forEach(async (value, index) => await this.getAmount(index));

        if (this.items.length === 1) {
          this.items[0].returnChecked = true;
        }
        this.saleItems = data.item_list;
        this.saleDetails.customer_id = data.customer_id;
        this.saleDetails.isPartiallyReturned = data.isPartiallyReturned;
        this.saleDetails.isFullyReturned = data.isFullyReturned;
        this.saleDetails.balanceAmount = data.balance_amount;
        this.saleDetails.isCredit = data.is_credit;
        // this.saleDetails.receivedAmount = data.received_amount;

        /**
         * calculate amount and total
         */
        this.returnDetails.invoice_date = data.invoice_date;
        this.returnDetails.invoice_number = data.invoice_number;
        this.returnDetails.customer_name = data.customer_name;
        this.returnDetails.customer_id = data.customer_id;
        this.returnDetails.customerGSTNo = data.customerGSTNo;
        this.returnDetails.customerGstType = data.customerGstType;
        this.returnDetails.customer_phoneNo = data.customer_phoneNo;
        this.returnDetails.customer_emailId = data.customer_emailId;
        this.returnDetails.customer_pincode = data.customer_pincode;
        this.returnDetails.customer_address = data.customer_address;
        this.returnDetails.customerState = data.customerState;
        this.returnDetails.customerCountry = data.customerCountry;
        this.returnDetails.customer_city = data.customer_city;
        this.returnDetails.customerPanNumber = data.customerPanNumber;
        this.returnDetails.aadharNumber = data.aadharNumber;
        this.returnDetails.salesEmployeeName = data.salesEmployeeName;
        this.returnDetails.salesEmployeeId = data.salesEmployeeId;
        this.returnDetails.salesEmployeePhoneNumber =
          data.salesEmployeePhoneNumber;
        this.returnDetails.saleTotalAmount = data.total_amount;

        this.returnDetails.discount_percent = parseFloat(
          data.discount_percent || 0
        );
        this.returnDetails.discount_amount = parseFloat(
          data.discount_amount || 0
        );

        this.returnDetails.discount_type = data.discount_type;

        this.returnDetails.total_amount = parseFloat(this.getTotalAmount);

        this.returnDetails.saleSequenceNumber = data.sequenceNumber;
        this.returnDetails.balance_amount = parseFloat(this.getBalanceData);
        //this.returnDetails.payment_type = 'cash';
        this.returnDetails.rateList = data.rateList;
        this.returnDetails.is_roundoff = data.is_roundoff;
        this.returnDetails.tcsAmount = data.tcsAmount;
        this.returnDetails.tcsName = data.tcsName;
        this.returnDetails.tcsRate = data.tcsRate;
        this.returnDetails.tcsCode = data.tcsCode;
        this.returnDetails.tdsAmount = data.tdsAmount;
        this.returnDetails.tdsName = data.tdsName;
        this.returnDetails.tdsRate = data.tdsRate;
        this.returnDetails.tdsCode = data.tdsCode;
        this.returnDetails.dueDate = data.dueDate;
        this.returnDetails.splitPaymentList = data.splitPaymentList;

        if (this.isRestore) {
          this.returnDetails.employeeId = data.employeeId;
        }
      });
    }
  };

  checkCustomerBalance = async (id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.parties
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
        runInAction(() => {
          if (data.balanceType === 'Receivable' && data.balance > 0) {
            this.returnDetails.customerReceivable = true;
            this.selectedCustomerBalance = data.balance;
          }
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setSaleReturnProperty = (property, value) => {
    runInAction(() => {
      this.returnDetails[property] = value;
    });
  };

  setLinkPayment = async () => {
    runInAction(() => {
      this.openLinkpaymentPage = true;
    });
  };

  adjustAutoSelectInCaseOfCreditSale = async () => {
    const index = this.paymentLinkTransactions.findIndex(
      (item) => item.id === this.returnDetails.invoice_number
    );

    if (!(index === 0) && this.paymentLinkTransactions.length > 0) {
      let shuffle = this.paymentLinkTransactions[0];

      runInAction(() => {
        if (index >= 0) {
          this.paymentLinkTransactions[0] = this.paymentLinkTransactions[index];

          this.paymentLinkTransactions[index] = shuffle;
        }
      });
    }

    if (index !== -1) {
      await this.autoLinkPayment();
    }
  };

  getAllUnPaidTxnForCustomer = async (db, id) => {
    await lp.getAllUnPaidTxnForCustomer(this, db, id, 'Sales Return');

    if (this.saleDetails.isCredit || this.saleDetails.balanceAmount > 0) {
      await await this.adjustAutoSelectInCaseOfCreditSale();
    }
  };

  setEditTable = (index, value) => {
    this.saleEnabledRow = index;
    if (index && value) {
      if (this.items[index]) {
        this.items[index].isEdit = value;
      }
    }
  };

  viewOrEditSaleReturnTxnItem = async (item) => {
    runInAction(() => {
      this.viewOrEditItem(item, true);
    });
  };

  deleteSaleReturnTxnItem = async (item) => {
    if (
      !('calculateStockAndBalance' in item) ||
      !item.calculateStockAndBalance
    ) {
      item.calculateStockAndBalance = true;
    }

    await this.deleteSaleReturn(item);
  };

  saveDataAndNew = async (generateReturnNumber) => {
    this.saveAndNew = true;
    await this.saveData(generateReturnNumber);
  };

  getSequenceNumber = async (date, id) => {
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      runInAction(() => {
        this.sequenceData.appendYear = transSettings.salesReturn.appendYear;
        this.sequenceData.multiDeviceBillingSupport =
          transSettings.multiDeviceBillingSupport;
      });
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      runInAction(() => {
        this.sequenceData.prefix = localStorage.getItem('deviceName');
        this.sequenceData.subPrefix = 'CN';
      });
      isOnline = false;
    }

    this.returnDetails.sequenceNumber = await sequence.getFinalSequenceNumber(
      this.sequenceData,
      'Sales Return',
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
  };

  saveData = async (generateReturnNumber, isPrint) => {
    //check for empty qty for returned products
    for (let i of this.items) {
      if (
        (i.qty === '' || i.qty === 0) &&
        (i.freeQty === '' || i.freeQty === 0)
      ) {
        alert('Please enter valid return quantities');
        return;
      }
    }

    if (!Boolean(generateReturnNumber) || generateReturnNumber === '') {
      if (!this.returnDetails.invoice_number) {
        alert('Please enter Invoice number');
        return;
      }
      if (this.returnDetails.invoice_number.trim() === '') {
        alert('Please enter Invoice number');
        return;
      }
    } else {
      runInAction(() => {
        if (!this.isRestore) {
          this.returnDetails.sales_return_number = generateReturnNumber;
        }
      });
    }

    if (
      this.returnDetails.sequenceNumber === '' ||
      this.returnDetails.sequenceNumber === undefined
    ) {
      await this.getSequenceNumber(
        this.returnDetails.date,
        this.returnDetails.sales_return_number
      );
    }

    if (this.returnDetails.sequenceNumber === '0') {
      this.returnDetails.sequenceNumber = '';
      this.handleCloseSaleReturnLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    if (this.returnDetails.balance_amount < 0) {
      alert('Please check balance is Negative');
      return;
    }

    this.returnDetails.balance_amount = parseFloat(
      this.returnDetails.balance_amount
    );

    //remove un selected returned items
    let returnedItems = 0;
    for (let i = this.items.length - 1; i >= 0; --i) {
      if (
        this.items[i].returnChecked === false ||
        !this.items[i].returnChecked
      ) {
        returnedItems += 1;
      }
    }

    if (this.items.length - returnedItems === 0) {
      alert('Please check atleast one product to return');
      this.handleCloseSaleReturnLoadingMessage();
      return;
    } else {
      for (let i = this.items.length - 1; i >= 0; --i) {
        if (
          this.items[i].returnChecked === false ||
          !this.items[i].returnChecked
        ) {
          this.items.splice(i, 1);
        }
      }
    }

    runInAction(() => {
      this.returnDetails.total_amount = this.getTotalAmount;
      this.returnDetails.balance_amount = this.getBalanceData;
    });

    if (
      !('calculateStockAndBalance' in this.returnDetails) ||
      !this.returnDetails.calculateStockAndBalance
    ) {
      this.returnDetails.calculateStockAndBalance = true;
    }

    await this.updateSaleReturnInformation(isPrint);
  };

  //delete sales return txn
  deleteSaleReturn = async (item) => {
    const db = await Db.get();

    await this.loadSaleData(item.invoice_number, true);
    runInAction(() => {
      this.items = item.item_list;
      this.returnDetails = item;
    });

    let saleReturnedItemMap = new Map();
    let saleReturnDeletedMap = new Map();
    let isFullReturnDelete = true;

    this.saleItems.forEach((i) => {
      let quantityReturnObj = {
        returnedQty: parseFloat(i.returnedQty),
        returnedFreeQty: parseFloat(i.returnedFreeQty)
      };
      if (parseFloat(i.returnedQty) > 0 || parseFloat(i.returnedFreeQty) > 0) {
        if (i.batch_id > 0) {
          saleReturnedItemMap.set(
            i.product_id + ':' + i.batch_id,
            quantityReturnObj
          );
        } else {
          saleReturnedItemMap.set(i.product_id, quantityReturnObj);
        }
      }
    });

    this.items.forEach((i) => {
      let quantityObj = {
        qty: parseFloat(i.qty),
        freeQty: parseFloat(i.freeQty),
        qtyUnit: i.qtyUnit,
        primaryUnit: i.primaryUnit,
        secondaryUnit: i.secondaryUnit,
        unitConversionQty: i.unitConversionQty
      };
      if (i.batch_id > 0) {
        saleReturnDeletedMap.set(i.product_id + ':' + i.batch_id, quantityObj);
      } else {
        saleReturnDeletedMap.set(i.product_id, quantityObj);
      }
    });

    for (let [key, value] of saleReturnedItemMap) {
      if (saleReturnDeletedMap.has(key)) {
        if (
          parseFloat(value).returnedQty !==
            parseFloat(saleReturnDeletedMap.get(key).qty) ||
          parseFloat(value).returnedFreeQty !==
            parseFloat(saleReturnDeletedMap.get(key).freeQty)
        ) {
          isFullReturnDelete = false;
        }
      } else {
        isFullReturnDelete = false;
      }
    }

    /**
     * update all indivisual returned products in sale table
     * also isFullyReturned : boolean
     */
    await this.revertUpdatedSaleRecord(
      db,
      saleReturnDeletedMap,
      isFullReturnDelete
    );

    /**
     * decrement products stock
     */

    if (
      !('calculateStockAndBalance' in this.returnDetails) ||
      !this.returnDetails.calculateStockAndBalance
    ) {
      for (let [key, value] of saleReturnDeletedMap) {
        let batch_id = null;

        if (key.split(':').length > 1) {
          let id = key.split(':');
          await this.decrementProductStock(
            db,
            id[0],
            value.qtyUnit && value.qtyUnit !== ''
              ? this.getQuantityByUnit(value)
              : value.qty,
            value.qtyUnit && value.qtyUnit !== ''
              ? this.getFreeQuantityByUnit(value) || 0
              : value.freeQty,
            id[1]
          );
        } else {
          await this.decrementProductStock(
            db,
            key,
            value.qtyUnit && value.qtyUnit !== ''
              ? this.getQuantityByUnit(value)
              : value.qty,
            value.qtyUnit && value.qtyUnit !== ''
              ? this.getFreeQuantityByUnit(value) || 0
              : value.freeQty,
            batch_id
          );
        }
      }
      /**
       * adjust customer balance
       */

      await balanceUpdate.decrementBalance(
        db,
        this.returnDetails.customer_id,
        parseFloat(this.returnDetails.balance_amount) +
          parseFloat(this.returnDetails.linked_amount)
      );
    }

    if (this.returnDetails.linked_amount > 0) {
      await this.unLinkPayment(db, this.returnDetails);
    }

    /**
     * delete from product txn table
     */
    let txnData = this.returnDetails;
    txnData.item_list = this.items;

    productTxn.deleteProductTxnFromSalesReturn(txnData, db);
    allTxn.deleteTxnFromSalesReturn(txnData, db);

    if (this.salesReturnTxnSettingsData.updateRawMaterialsStock) {
      await this.prepareRawMaterialProductList(txnData);
    }

    if (
      !('calculateStockAndBalance' in this.returnDetails) ||
      !this.returnDetails.calculateStockAndBalance
    ) {
      if (this.salesReturnTxnSettingsData.updateRawMaterialsStock) {
        await this.decrementRawMaterialsStockQuantity(txnData);
      }
    }

    let DeleteDataDoc = {
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      total: 0,
      balance: 0,
      data: ''
    };

    let restoreSalesData = {};
    restoreSalesData = this.returnDetails;
    restoreSalesData.item_list = this.items;
    restoreSalesData.employeeId = this.returnDetails.employeeId;

    DeleteDataDoc.transactionId = this.returnDetails.sales_return_number;
    DeleteDataDoc.sequenceNumber = this.returnDetails.sequenceNumber;
    DeleteDataDoc.transactionType = 'Sales Return';
    DeleteDataDoc.data = JSON.stringify(restoreSalesData);
    DeleteDataDoc.total = this.returnDetails.total_amount;
    DeleteDataDoc.balance = this.returnDetails.balance_amount;
    DeleteDataDoc.createdDate = this.returnDetails.date;

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    //save to audit
    audit.addAuditEvent(
      this.returnDetails.sales_return_number,
      this.returnDetails.sequenceNumber,
      'Sales Return',
      'Delete',
      JSON.stringify(this.returnDetails),
      '',
      this.returnDetails.date
    );

    /**
     * delete sales return entry
     */
    const businessData = await Bd.getBusinessData();

    const query = await db.salesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              sales_return_number: {
                $eq: this.returnDetails.sales_return_number
              }
            }
          ]
        }
      })
      .exec();

    await query
      .remove()
      .then((data) => {
        // console.log('sales return data removed' + data);

        this.resetAllData();
      })
      .catch((error) => {
        alert('Error in Removing Data');

        //save to audit
        audit.addAuditEvent(
          this.returnDetails.sales_return_number,
          this.returnDetails.sequenceNumber,
          'Sales Return',
          'Delete',
          JSON.stringify(this.returnDetails),
          error.message,
          this.returnDetails.date
        );
      });
  };

  updateSaleRecord = async (db, saleMap, isPartialRefund, isFullRefund) => {
    const businessData = await Bd.getBusinessData();

    const invoiceData = await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              invoice_number: {
                $eq: this.returnDetails.invoice_number
              }
            }
          ]
        }
      })
      .exec();

    const changeData = await (async (oldData) => {
      let items = oldData.item_list;
      oldData.isPartiallyReturned = isPartialRefund;
      oldData.isFullyReturned = isFullRefund;

      items.forEach((i) => {
        let productId = null;
        if (i.batch_id > 0) {
          productId = i.product_id + ':' + i.batch_id;
        } else {
          productId = i.product_id;
        }

        if (saleMap.has(productId)) {
          i.returnedQty =
            (i.returnedQty || 0) + parseFloat(saleMap.get(productId).qty);
          i.returnedFreeQty =
            (i.returnedFreeQty || 0) +
            parseFloat(saleMap.get(productId).freeQty);

          if (i.returnedQty === null || i.returnedQty === '') {
            i.returnedQty = 0;
          }

          if (i.returnedFreeQty === null || i.returnedFreeQty === '') {
            i.returnedFreeQty = 0;
          }
        }
      });

      oldData.item_list = items;

      oldData.updatedAt = Date.now();
      return oldData;
    });

    if (invoiceData) {
      await invoiceData.atomicUpdate(changeData);
    }
  };

  updateProductStock = async (db, product_id, qty, freeQty, batch_id) => {
    const businessData = await Bd.getBusinessData();

    const categoryData = await db.businessproduct
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { productId: { $eq: product_id } }
          ]
        }
      })
      .exec();

    if (categoryData) {
      let enableQty = false;
      if (categoryData.enableQuantity) {
        enableQty = await Bd.isQtyChangesAllowed(categoryData.enableQuantity);
      }
      if (categoryData && enableQty === true) {
        const changeData = (oldData) => {
          let batchData = null;
          let index = -1;

          // the below block of code to update stock qty during return
          var matchedIndex = this.items.findIndex(
            (x) => x.product_id === product_id
          );

          if (matchedIndex >= 0) {
            let product = this.items[matchedIndex];
            product.stockQty = oldData.stockQty;
            product.freeStockQty = oldData.freeStockQty;
            runInAction(() => {
              this.items[matchedIndex] = product;
            });
          }
          // end

          if (batch_id) {
            /**
             * find index on batch
             */
            index = oldData.batchData.findIndex(
              (a) => parseInt(a.id) === parseInt(batch_id)
            );
            if (index >= 0) {
              batchData = oldData.batchData[index];
            }
          }

          /**
           * update stock qty and batch qty
           */
          const updatedQty = parseFloat(oldData.stockQty) + parseFloat(qty);

          if (batchData) {
            batchData.qty = parseFloat(batchData.qty) + parseFloat(qty);
          } else {
            oldData.qty = parseFloat(parseFloat(oldData.qty) + parseFloat(qty));
          }

          oldData.stockQty = Math.round(updatedQty * 100) / 100;

          if (index >= 0 && batchData) {
            oldData.batchData[index] = batchData;
          }

          if (oldData.stockQty <= oldData.stockReOrderQty) {
            oldData.isStockReOrderQtyReached = true;
          } else {
            oldData.isStockReOrderQtyReached = false;
          }

          if (isNaN(oldData.qty) || oldData.qty === null) {
            oldData.qty = 0;
          }

          if (isNaN(oldData.stockQty) || oldData.stockQty === null) {
            oldData.stockQty = 0;
          }

          /**
           * update free qty and batch free qty
           */
          const updatedFreeQty =
            parseFloat(oldData.freeQty) + parseFloat(freeQty);

          if (batchData) {
            batchData.freeQty =
              parseFloat(batchData.freeQty) + parseFloat(freeQty);
          } else {
            oldData.freeQty = parseFloat(
              parseFloat(oldData.freeQty) + parseFloat(freeQty)
            );
          }

          oldData.freeQty = Math.round(updatedFreeQty * 100) / 100;

          if (index >= 0 && batchData) {
            oldData.batchData[index] = batchData;
          }

          if (isNaN(oldData.freeQty) || oldData.freeQty === null) {
            oldData.freeQty = 0;
          }

          oldData.updatedAt = Date.now();

          return oldData;
        };

        await categoryData.atomicUpdate(changeData);
      }
    }
  };

  decrementProductStock = async (db, product_id, qty, freeQty, batch_id) => {
    const businessData = await Bd.getBusinessData();

    const categoryData = await db.businessproduct
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { productId: { $eq: product_id } }
          ]
        }
      })
      .exec();

    if (categoryData) {
      let enableQty = await Bd.isQtyChangesAllowed(categoryData.enableQuantity);
      if (categoryData && enableQty === true) {
        const changeData = (oldData) => {
          let batchData = null;
          let index = -1;

          if (batch_id) {
            /**
             * find index on batch
             */
            index = oldData.batchData.findIndex(
              (a) => parseInt(a.id) === parseInt(batch_id)
            );
            if (index >= 0) {
              batchData = oldData.batchData[index];
            }
          }

          // Stock Qty
          if (batchData) {
            batchData.qty = parseFloat(batchData.qty) - parseFloat(qty);
          } else {
            oldData.qty = parseFloat(parseFloat(oldData.qty) - parseFloat(qty));
          }

          const updatedQty = parseFloat(oldData.stockQty) - parseFloat(qty);

          oldData.stockQty = Math.abs(updatedQty);

          if (index >= 0 && batchData) {
            oldData.batchData[index] = batchData;
          }

          if (oldData.stockQty <= oldData.stockReOrderQty) {
            oldData.isStockReOrderQtyReached = true;
          } else {
            oldData.isStockReOrderQtyReached = false;
          }

          if (isNaN(oldData.qty) || oldData.qty === null) {
            oldData.qty = 0;
          }

          // Free Qty
          if (batchData) {
            batchData.freeQty =
              parseFloat(batchData.freeQty) - parseFloat(freeQty);
          } else {
            oldData.freeQty = parseFloat(
              parseFloat(oldData.freeQty) - parseFloat(freeQty)
            );
          }

          const updatedFreeQty =
            parseFloat(oldData.freeQty) - parseFloat(freeQty);

          oldData.freeQty = Math.abs(updatedFreeQty);

          if (index >= 0 && batchData) {
            oldData.batchData[index] = batchData;
          }

          if (isNaN(oldData.freeQty) || oldData.freeQty === null) {
            oldData.freeQty = 0;
          }

          oldData.updatedAt = Date.now();

          return oldData;
        };

        await categoryData.atomicUpdate(changeData);
      }
    }
  };

  updateRawmaterialProductStock = async (
    db,
    product_id,
    qty,
    freeQty,
    operation,
    batch_id
  ) => {
    const businessData = await Bd.getBusinessData();

    const categoryData = await db.businessproduct
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { productId: { $eq: product_id } }
          ]
        }
      })
      .exec();

    if (categoryData) {
      let enableQty = false;

      //allow decrement of product only for "enabledQty" products
      if (categoryData.enableQuantity) {
        enableQty = await Bd.isQtyChangesAllowed(categoryData.enableQuantity);
      }
      if (categoryData && enableQty === true) {
        const changeData = (oldData) => {
          let updatedQty = 0;
          let updatedFreeQty = 0;

          let batchData = null;
          let index = -1;

          if (batch_id) {
            /**
             * find index on batch
             */

            index = oldData.batchData.findIndex((a) => a.id === batch_id);
            if (index >= 0) {
              batchData = oldData.batchData[index];
            }
          }

          // Stock Qty
          if (parseFloat(operation) < 0) {
            updatedQty = parseFloat(
              parseFloat(oldData.stockQty) - parseFloat(qty)
            );

            if (batchData) {
              batchData.qty = parseFloat(batchData.qty) - parseFloat(qty);

              if (batchData['finalMRPPrice']) {
                batchData['finalMRPPrice'] =
                  parseFloat(batchData['finalMRPPrice']) || 0;
              }
            } else {
              oldData.qty = parseFloat(
                parseFloat(oldData.qty) - parseFloat(qty)
              );
            }
          } else {
            updatedQty = parseFloat(oldData.stockQty) + parseFloat(qty);

            if (batchData) {
              batchData.qty = parseFloat(batchData.qty) + parseFloat(qty);

              if (batchData['finalMRPPrice']) {
                batchData['finalMRPPrice'] =
                  parseFloat(batchData['finalMRPPrice']) || 0;
              }
            } else {
              oldData.qty = parseFloat(
                parseFloat(oldData.qty) + parseFloat(qty)
              );
            }
          }

          oldData.stockQty = Math.round(updatedQty * 100) / 100;
          if (index >= 0 && batchData) {
            oldData.batchData[index] = batchData;
          }
          if (oldData.stockQty <= oldData.stockReOrderQty) {
            oldData.isStockReOrderQtyReached = true;
          } else {
            oldData.isStockReOrderQtyReached = false;
          }

          if (isNaN(oldData.qty) || oldData.qty === null) {
            oldData.qty = 0;
          }

          if (isNaN(oldData.stockQty) || oldData.stockQty === null) {
            oldData.stockQty = 0;
          }

          // Free Qty
          if (parseFloat(operation) < 0) {
            updatedFreeQty =
              (parseFloat(oldData.freeQty) || 0) - (parseFloat(freeQty) || 0);

            if (batchData) {
              batchData.freeQty =
                (parseFloat(batchData.freeQty) || 0) -
                (parseFloat(freeQty) || 0);
            } else {
              oldData.freeQty =
                (parseFloat(oldData.freeQty) || 0) - (parseFloat(freeQty) || 0);
            }
          } else {
            updatedFreeQty =
              (parseFloat(oldData.freeQty) || 0) + (parseFloat(freeQty) || 0);

            if (batchData) {
              batchData.freeQty =
                (parseFloat(batchData.freeQty) || 0) +
                (parseFloat(freeQty) || 0);
            } else {
              oldData.freeQty =
                (parseFloat(oldData.freeQty) || 0) + (parseFloat(freeQty) || 0);
            }
          }

          oldData.freeQty = Math.round(updatedFreeQty * 100) / 100;
          if (index >= 0 && batchData) {
            oldData.batchData[index] = batchData;
          }

          if (isNaN(oldData.freeQty) || oldData.freeQty === null) {
            oldData.freeQty = 0;
          }

          oldData.updatedAt = Date.now();

          return oldData;
        };

        await categoryData.atomicUpdate(changeData);
      }
    }
  };

  revertUpdatedSaleRecord = async (
    db,
    saleReturnDeletedMap,
    isFullReturnDelete
  ) => {
    const businessData = await Bd.getBusinessData();

    const invoiceData = await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { invoice_number: { $eq: this.returnDetails.invoice_number } }
          ]
        }
      })
      .exec();

    const changeData = (oldData) => {
      let items = oldData.item_list;
      if (isFullReturnDelete) {
        oldData.isFullyReturned = false;
        oldData.isPartiallyReturned = false;
      } else {
        oldData.isPartiallyReturned = true;
        oldData.isFullyReturned = false;
      }

      items.forEach((i) => {
        let productId = null;
        if (i.batch_id > 0) {
          productId = i.product_id + ':' + i.batch_id;
        } else {
          productId = i.product_id;
        }

        if (saleReturnDeletedMap.has(productId)) {
          i.returnedQty =
            (i.returnedQty || 0) -
            parseFloat(saleReturnDeletedMap.get(productId).qty);
          i.returnedFreeQty =
            (i.returnedFreeQty || 0) -
            parseFloat(saleReturnDeletedMap.get(productId).freeQty);
        }

        if (i.returnedQty === null || i.returnedQty === '') {
          i.returnedQty = 0;
        }

        if (i.returnedFreeQty === null || i.returnedFreeQty === '') {
          i.returnedFreeQty = 0;
        }
      });

      oldData.item_list = items;

      oldData.updatedAt = Date.now();
      return oldData;
    };

    if (invoiceData) {
      await invoiceData.atomicUpdate(changeData);
    }
  };

  updateSaleReturnInformation = async (isPrint) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    runInAction(() => {
      this.returnDetails.businessId = businessData.businessId;
      this.returnDetails.businessCity = businessData.businessCity;

      this.returnDetails.posId = parseFloat(businessData.posDeviceId);
    });

    let isReturnAllowed = true;

    this.items.forEach((i) => {
      if (i.qty === '' || i.qty === null) {
        i.qty = 0;
      }

      if (i.freeQty === '' || i.freeQty === null) {
        i.freeQty = 0;
      }
    });

    /**
     * check whether sales return is valid
     * 1) check product id and item qty
     * 2) also check already returned quantity to handle multiple partial returns
     * 3) check whether the invoice is already fully returned.
     *
     */
    let saleItemMap = new Map();
    let saleReturnMap = new Map();
    let saleItemMrpMap = new Map();
    let isPartialRefund = false;
    let isFullRefund = true;

    // Stock Quantity
    runInAction(() => {
      this.saleItems.forEach((i) => {
        let quantityObj = {
          qty: 0,
          freeQty: 0
        };

        let updatedQty = parseFloat(i.qty) - parseFloat(i.returnedQty) || 0;
        let updatedFreeQty =
          parseFloat(i.freeQty) - parseFloat(i.returnedFreeQty);

        quantityObj.qty = updatedQty;
        quantityObj.freeQty = updatedFreeQty;

        if (updatedQty > 0 || updatedFreeQty > 0) {
          if (i.batch_id > 0) {
            saleItemMap.set(i.product_id + ':' + i.batch_id, quantityObj);
            saleItemMrpMap.set(
              i.product_id + ':' + i.batch_id + ':' + i.mrp,
              quantityObj
            );
          } else {
            saleItemMap.set(i.product_id, quantityObj);
            saleItemMrpMap.set(i.product_id + ':' + i.mrp, quantityObj);
          }
        }
      });
    });

    /**
     * check whether the customer has been changed for the invoice number
     */
    if (!(this.saleDetails.customer_id === this.returnDetails.customer_id)) {
      isReturnAllowed = false;
      alert('customer not matched');
    }

    /**
     * check whether the invoice number is already fully returned
     * also in case of edit with same number of products allow it.
     */

    if (!this.isUpdate && this.saleDetails.isFullyReturned) {
      isReturnAllowed = false;
      alert('The Sale is already fully returned');
    }

    let deletedProducts = 0;

    this.items.forEach((i) => {
      let quantityObj = {
        qty: i.qty,
        freeQty: i.freeQty,
        qtyUnit: i.qtyUnit,
        primaryUnit: i.primaryUnit,
        secondaryUnit: i.secondaryUnit,
        unitConversionQty: i.unitConversionQty
      };

      let productId;
      let productIdWithMrp;
      if (i.batch_id > 0) {
        productId = i.product_id + ':' + i.batch_id;
        productIdWithMrp = productId + ':' + i.mrp;
        saleReturnMap.set(productId, quantityObj);
      } else {
        productId = i.product_id;
        productIdWithMrp = productId + ':' + i.mrp;
        saleReturnMap.set(productId, quantityObj);
      }

      if (saleItemMrpMap.has(productIdWithMrp)) {
        if (
          parseFloat(i.qty) <
            parseFloat(saleItemMrpMap.get(productIdWithMrp).qty) ||
          parseFloat(i.freeQty) <
            parseFloat(saleItemMrpMap.get(productIdWithMrp).freeQty)
        ) {
          isPartialRefund = true;
          isFullRefund = false;
        } else if (
          parseFloat(i.qty) >
            parseFloat(saleItemMrpMap.get(productIdWithMrp).qty) ||
          parseFloat(i.freeQty) >
            parseFloat(saleItemMrpMap.get(productIdWithMrp).freeQty)
        ) {
          isReturnAllowed = false;
          alert('return not allowed');
          return;
        } else {
          /**
           * returned product quantity and sale product quantity is equal
           */
          deletedProducts = deletedProducts + 1;
        }
      } else {
        isReturnAllowed = false;
        alert('return not allowed');
        return;
      }
    });

    /**
     * delete index field
     */
    this.items.forEach(async (item) => {
      delete item['index'];
    });

    if (deletedProducts < saleItemMap.size) {
      isPartialRefund = true;
      isFullRefund = false;
    }

    if (isReturnAllowed) {
      if (
        !('calculateStockAndBalance' in this.returnDetails) ||
        !this.returnDetails.calculateStockAndBalance
      ) {
        /**
         * increment products stock
         */
        for (let [key, value] of saleReturnMap) {
          let batch_id = null;
          if (key.split(':').length > 1) {
            let id = key.split(':');
            await this.updateProductStock(
              db,
              id[0],
              value.qtyUnit && value.qtyUnit !== ''
                ? (await this.getQuantityByUnit(value)) || 0
                : value.qty || 0,
              value.qtyUnit && value.qtyUnit !== ''
                ? (await this.getFreeQuantityByUnit(value)) || 0
                : value.freeQty || 0,
              id[1]
            );
          } else {
            await this.updateProductStock(
              db,
              key,
              value.qtyUnit && value.qtyUnit !== ''
                ? (await this.getQuantityByUnit(value)) || 0
                : value.qty || 0,
              value.qtyUnit && value.qtyUnit !== ''
                ? (await this.getFreeQuantityByUnit(value)) || 0
                : value.freeQty || 0,
              batch_id
            );
          }
        }

        if (this.salesReturnTxnSettingsData.updateRawMaterialsStock) {
          await this.deleteRawMaterialTransactionsAndResetStock(saleReturnMap);
        }
      }

      /**
       * update all indivisual returned products in sale table
       * also isFullyReturned : boolean
       */

      /**
       * link payment if has any recivable amount
       */
      if (this.returnDetails.linked_amount > 0) {
        await this.updateSaleRecord(
          db,
          saleReturnMap,
          isPartialRefund,
          isFullRefund
        );
        await this.linkPayment(db, this.returnDetails);
      } else {
        this.returnDetails.linkedTxnList = [];

        await this.updateSaleRecord(
          db,
          saleReturnMap,
          isPartialRefund,
          isFullRefund
        );
      }

      /**
       * adjust customer balance
       */
      if (
        !('calculateStockAndBalance' in this.returnDetails) ||
        !this.returnDetails.calculateStockAndBalance
      ) {
        await balanceUpdate.incrementBalance(
          db,
          this.returnDetails.customer_id,
          parseFloat(this.returnDetails.linked_amount) +
            parseFloat(this.returnDetails.balance_amount)
        );
      }

      runInAction(() => {
        for (let i of this.items) {
          delete i['returnedQty'];
          delete i['stockQty'];
          delete i['returnedFreeQty'];
        }
      });

      if (
        this.returnDetails.is_credit === '' ||
        this.returnDetails.is_credit === null
      ) {
        this.returnDetails.is_credit = false;
      }

      if (
        this.returnDetails.paid_amount === '' ||
        this.returnDetails.paid_amount === null
      ) {
        this.returnDetails.paid_amount = 0;
      }

      if (
        this.returnDetails.balance_amount === '' ||
        this.returnDetails.balance_amount === null
      ) {
        this.returnDetails.balance_amount = 0;
      }

      if (
        this.returnDetails.linkPayment === '' ||
        this.returnDetails.linkPayment === null
      ) {
        this.returnDetails.linkPayment = false;
      }

      if (
        this.returnDetails.linked_amount === '' ||
        this.returnDetails.linked_amount === null
      ) {
        this.returnDetails.linked_amount = 0;
      }

      if (
        this.returnDetails.customerReceivable === '' ||
        this.returnDetails.customerReceivable === null
      ) {
        this.returnDetails.customerReceivable = false;
      }

      if (
        this.returnDetails.packing_charge === '' ||
        this.returnDetails.packing_charge === null
      ) {
        this.returnDetails.packing_charge = 0;
      }

      if (
        this.returnDetails.shipping_charge === '' ||
        this.returnDetails.shipping_charge === null
      ) {
        this.returnDetails.shipping_charge = 0;
      }

      if (
        this.returnDetails.discount_amount === '' ||
        this.returnDetails.discount_amount === null
      ) {
        this.returnDetails.discount_amount = 0;
      }

      if (
        this.returnDetails.discount_percent === '' ||
        this.returnDetails.discount_percent === null
      ) {
        this.returnDetails.discount_percent = 0;
      }

      if (
        this.returnDetails.return_discount_amount === '' ||
        this.returnDetails.return_discount_amount === null
      ) {
        this.returnDetails.return_discount_amount = 0;
      }

      if (
        this.returnDetails.round_amount === '' ||
        this.returnDetails.round_amount === null
      ) {
        this.returnDetails.round_amount = 0;
      }

      if (
        this.returnDetails.total_amount === '' ||
        this.returnDetails.total_amount === null
      ) {
        this.returnDetails.total_amount = 0;
      }

      if (
        this.returnDetails.is_roundoff === '' ||
        this.returnDetails.is_roundoff === null
      ) {
        this.returnDetails.is_roundoff = false;
      }

      let filteredArray = [];

      for (var i = 0; i < this.items.length; i++) {
        let item = this.items[i];

        if (item.batch_id === null || item.batch_id === '') {
          item.batch_id = 0;
        }

        item.itemNumber = parseInt(i) + 1;

        if (item.qty === null || item.qty === '') {
          item.qty = 0;
        }

        if (item.mrp === null || item.mrp === '') {
          item.mrp = 0;
        }

        if (item.purchased_price === null || item.purchased_price === '') {
          item.purchased_price = 0;
        }

        if (item.offer_price === null || item.offer_price === '') {
          item.offer_price = 0;
        }

        if (item.size === null || item.size === '') {
          item.size = 0;
        }

        if (item.cgst === null || item.cgst === '') {
          item.cgst = 0;
        }

        if (item.sgst === null || item.sgst === '') {
          item.sgst = 0;
        }

        if (item.igst === null || item.igst === '') {
          item.igst = 0;
        }

        if (item.cess === null || item.cess === '') {
          item.cess = 0;
        }

        if (item.cgst_amount === null || item.cgst_amount === '') {
          item.cgst_amount = 0;
        }

        if (item.sgst_amount === null || item.sgst_amount === '') {
          item.sgst_amount = 0;
        }

        if (item.igst_amount === null || item.igst_amount === '') {
          item.igst_amount = 0;
        }

        if (item.amount === null || item.amount === '') {
          item.amount = 0;
        }

        if (item.roundOff === null || item.roundOff === '') {
          item.roundOff = 0;
        }

        if (item.isEdit === null || item.isEdit === '') {
          item.isEdit = true;
        }

        if (item.taxIncluded === null || item.taxIncluded === '') {
          item.taxIncluded = true;
        }

        if (item.stockQty === null || item.stockQty === '') {
          item.stockQty = 0;
        }

        if (item.returnChecked === null || item.returnChecked === '') {
          item.returnChecked = false;
        }

        if (item.finalMRPPrice === null || item.finalMRPPrice === '') {
          item.finalMRPPrice = 0;
        }

        if (item.hsn !== null || item.hsn !== '' || item.hsn !== undefined) {
          item.hsn = item.hsn ? item.hsn.toString() : '';
        } else {
          item.hsn = '';
        }

        if (
          item.originalDiscountPercent === null ||
          item.originalDiscountPercent === '' ||
          item.originalDiscountPercent === undefined
        ) {
          item.originalDiscountPercent = 0;
        }

        filteredArray.push(item);
      }

      this.items = filteredArray;

      /**
       * save new sales return entry
       */
      const InsertDoc = {
        item_list: this.items,
        ...this.returnDetails
      };

      delete InsertDoc['customerReceivable'];
      /**
       * updated date
       */
      InsertDoc.updatedAt = Date.now();

      let userAction = 'Save';

      if (this.isRestore) {
        userAction = 'Restore';

        InsertDoc.employeeId = this.returnDetails.employeeId;
      } else {
        /**
         * add employee information
         */

        try {
          InsertDoc.employeeId = JSON.parse(
            localStorage.getItem('loginDetails')
          ).username;
        } catch (e) {
          console.error(' Error: ', e.message);
        }
      }

      // console.log('InsertDoc::', InsertDoc);
      // console.log('before saveProductTxnFromSalesReturn');

      if (this.isUpdate) {
        const businessData = await Bd.getBusinessData();

        const returnData = await db.salesreturn
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { sales_return_number: { $eq: InsertDoc.sales_return_number } }
              ]
            }
          })
          .exec();

        const changeData = (oldData) => {
          return InsertDoc;
        };

        if (returnData) {
          returnData.atomicUpdate(changeData);
        }

        await productTxn.saveProductTxnFromSalesReturn(InsertDoc, db);
        await allTxn.saveTxnFromSalesReturn(InsertDoc, db);

        this.sequenceData = {};
      } else {
        let userAction = 'Save';

        if (this.isRestore) {
          userAction = 'Restore';
        }
        //save to audit
        await audit.addAuditEvent(
          InsertDoc.sales_return_number,
          InsertDoc.sequenceNumber,
          'Sales Return',
          userAction,
          JSON.stringify(InsertDoc),
          '',
          InsertDoc.date
        );

        await productTxn.saveProductTxnFromSalesReturn(InsertDoc, db);

        await allTxn.saveTxnFromSalesReturn(InsertDoc, db);

        await db.salesreturn
          .insert(InsertDoc)
          .then(async (data) => {
            if (
              isPrint &&
              this.returnsInvoiceThermal &&
              this.returnsInvoiceThermal.boolDefault
            ) {
              sendContentForThermalPrinter(
                InsertDoc.vendor_id,
                this.returnsInvoiceThermal,
                InsertDoc,
                this.salesReturnTxnSettingsData,
                'Sales Return'
              );
            }

            if (this.isRestore) {
              await this.markSaleReturnRestored();
            }

            if (
              this.returnsInvoiceRegular &&
              this.returnsInvoiceRegular.boolDefault &&
              isPrint
            ) {
              runInAction(async () => {
                if (InsertDoc.customer_id === '') {
                  var data = {
                    totalBalance: 0,
                    balanceType: ''
                  };

                  this.printBalance = data;
                  this.printDataSalesReturn = InsertDoc;
                } else {
                  this.printBalance =
                    await balanceUpdate.getCustomerBalanceById(
                      InsertDoc.customer_id
                    );
                  this.printDataSalesReturn = InsertDoc;
                }
                this.closeDialogForSaveAndPrint();
                this.handleOpenSaleReturnPrintSelectionAlertMessage();
              });
            } else {
              this.handleCloseSaleReturnLoadingMessage();
              this.closeDialog();
              if (this.saveAndNew) {
                this.saveAndNew = false;
                this.openForNewReturn();
              }

              this.resetAllData();
              this.sequenceData = {};
            }
          })
          .catch((err) => {
            console.log('Error in Adding Sales return', err);

            ///save to audit
            audit.addAuditEvent(
              InsertDoc.sales_return_number,
              InsertDoc.sequenceNumber,
              'Sales Return',
              'Save',
              JSON.stringify(InsertDoc),
              err.message,
              InsertDoc.date
            );
            this.handleCloseSaleReturnLoadingMessage();
            this.handleOpenSaleReturnErrorAlertMessage();
          });
      }
    }
  };

  deleteRawMaterialTransactionsAndResetStock = async (saleReturnMap) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    for (let [key, value] of saleReturnMap) {
      let productId = '';
      if (key.split(':').length > 1) {
        let id = key.split(':');
        productId = id[0];
      } else {
        productId = key;
      }

      if (productId) {
        let Query = await db.businessproduct.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { productId: { $eq: productId } }
            ]
          }
        });

        await Query.exec().then(async (data) => {
          if (
            data &&
            data.rawMaterialData &&
            data.rawMaterialData.rawMaterialList
          ) {
            const rawMaterialProductList = Array.from(
              data.rawMaterialData.rawMaterialList
            );

            let totalQty = parseFloat(value.qty) + parseFloat(value.freeQty);

            let txnData = this.returnDetails;

            await productTxn.deleteRawMaterialProductTxn(
              false,
              txnData,
              db,
              rawMaterialProductList
            );

            rawMaterialProductList.forEach(async (element) => {
              if (element.product_id) {
                let newQty = parseFloat(element.qty) * parseFloat(totalQty);
                await this.updateProductStock(
                  db,
                  element.product_id,
                  element.qtyUnit && element.qtyUnit !== ''
                    ? this.getRawMaterialQuantityByUnit(element, newQty)
                    : newQty || 0,
                  0,
                  1,
                  element.batch_id // to handle batch count
                );
              }
            });
          }
        });
      }
    }
  };

  getRawMaterialQuantityByUnit = (product, newQty) => {
    let qty = 0;
    if (
      product.primaryUnit &&
      product.qtyUnit === product.primaryUnit.fullName
    ) {
      qty = newQty;
    }

    if (
      product.secondaryUnit &&
      product.qtyUnit === product.secondaryUnit.fullName
    ) {
      qty = newQty / product.unitConversionQty;
    }

    return qty;
  };

  getQuantityByUnit = (product) => {
    let qty = 0;
    if (
      product.primaryUnit &&
      product.qtyUnit === product.primaryUnit.fullName
    ) {
      qty = product.qty;
    }

    if (
      product.secondaryUnit &&
      product.qtyUnit === product.secondaryUnit.fullName
    ) {
      qty = product.qty / product.unitConversionQty;
    }

    return qty;
  };

  getFreeQuantityByUnit = (product) => {
    let qty = 0;
    if (
      product.primaryUnit &&
      product.qtyUnit === product.primaryUnit.fullName
    ) {
      qty = product.freeQty;
    }

    if (
      product.secondaryUnit &&
      product.qtyUnit === product.secondaryUnit.fullName
    ) {
      qty = product.freeQty / product.unitConversionQty;
    }

    return qty;
  };

  decrementRawMaterialsStockQuantity = async (txnData) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    txnData.item_list.forEach(async (element) => {
      if (element.product_id && element.categoryLevel2) {
        let Query = await db.businessproduct.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { productId: { $eq: element.product_id } }
            ]
          }
        });

        await Query.exec().then((data) => {
          let rawMaterialProductList = [];
          if (
            data &&
            data.rawMaterialData &&
            data.rawMaterialData.rawMaterialList &&
            data.rawMaterialData.rawMaterialList.length > 0
          ) {
            rawMaterialProductList = Array.from(
              data.rawMaterialData.rawMaterialList
            );
          }

          let totalQty = parseFloat(element.qty) + parseFloat(element.freeQty);

          rawMaterialProductList.forEach(async (element) => {
            if (element.product_id) {
              let newQty = parseFloat(element.qty) * parseFloat(totalQty);
              await this.updateRawmaterialProductStock(
                db,
                element.product_id,
                element.qtyUnit && element.qtyUnit !== ''
                  ? this.getRawMaterialQuantityByUnit(element, newQty)
                  : newQty || 0,
                0,
                -1,
                element.batch_id // to handle batch count
              );
            }
          });
        });
      }
    });
  };

  prepareRawMaterialProductList = async (txnData) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    txnData.item_list.forEach(async (element) => {
      if (element.product_id && element.categoryLevel2) {
        let Query = await db.businessproduct.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { productId: { $eq: element.product_id } }
            ]
          }
        });

        await Query.exec().then(async (data) => {
          let rawMaterialProductList = [];
          if (
            data &&
            data.rawMaterialData &&
            data.rawMaterialData.rawMaterialList &&
            data.rawMaterialData.rawMaterialList.length > 0
          ) {
            rawMaterialProductList = Array.from(
              data.rawMaterialData.rawMaterialList
            );
          }

          let totalQty = parseFloat(element.qty) + parseFloat(element.freeQty);

          if (this.salesReturnTxnSettingsData.updateRawMaterialsStock) {
            await productTxn.saveRawMaterialProductTxnFromSaleReturnDelete(
              txnData,
              db,
              rawMaterialProductList,
              totalQty
            );
          }
        });
      }
    });
  };

  get getRoundedAmount() {
    if (!this.returnDetails.is_roundoff) {
      return 0;
    }
    return this.returnDetails.round_amount;
  }

  addNewItem = () => {
    runInAction(() => {
      this.items.push({
        item_name: '',
        description: '',
        imageUrl: '',
        batch_id: 0,
        sku: '',
        barcode: '',
        mrp: 0,
        purchased_price: 0,
        offer_price: 0,
        size: '',
        qty: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        cess: 0,
        taxType: '',
        igst_amount: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        amount: 0,
        roundOff: 0,
        isEdit: true,
        taxIncluded: false,
        returnChecked: false,
        hsn: '',
        finalMRPPrice: 0,
        freeQty: 0
      });
    });
  };

  deleteItem = (index) => {
    runInAction(() => {
      this.items.splice(index, 1);

      this.returnDetails.total_amount = this.getTotalAmount;
    });

    this.autoLinkPayment();
  };

  setItemName = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].item_name = value;
    });
  };

  setItemDescription = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].description = value;
    });
  };

  setItemImageUrl = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].imageUrl = value;
    });
  };

  setCGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].cgst = value || 0;
      this.items[index].sgst = value || 0;
      this.getAmount(index);
    });
  };

  setSGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].cgst = value || 0;
      this.items[index].sgst = value || 0;
    });
    this.getAmount(index);
  };

  setItemSku = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].sku = value;
    });
  };

  setItemBarcode = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    runInAction(() => {
      this.items[index].barcode = value;
    });
  };

  setOffer = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    runInAction(() => {
      this.items[index].offer_price = value;
    });
    this.getAmount(index);
  };

  toggleRoundOff = () => {
    if (!this.returnDetails) {
      return;
    }
    runInAction(() => {
      this.returnDetails.is_roundoff = !this.returnDetails.is_roundoff;
    });
  };

  setQuantity = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (parseFloat(value) > 0) {
      let allowedQty = 0;

      for (let item of this.saleItems) {
        if (
          this.items[index].product_id === item.product_id &&
          this.items[index].mrp === item.mrp
        ) {
          allowedQty = parseFloat(item.qty) - parseFloat(item.returnedQty);
          break;
        }
      }

      if (parseFloat(value) > allowedQty) {
        alert('Returned Qunatity is more than Sale Quantity');
        return;
      }

      runInAction(() => {
        this.items[index].qty = parseFloat(value);
        this.getAmount(index);
        // this.returnDetails.balance_amount = this.getBalanceData;
        // this.returnDetails.total_amount = this.getTotalAmount;
      });

      if (
        this.returnDetails.customer_id !== undefined &&
        this.returnDetails.customer_id !== ''
      ) {
        // this.autoLinkPayment();
        this.resetLinkPayment();
      }
    } else {
      this.items[index].qty = '';

      this.getAmount(index);
      if (parseFloat(value) < 0) {
        alert('Returned quantity cannot be less than zero');
        return;
      }
    }
  };

  setFreeQuantity = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (parseFloat(value) > 0) {
      const allowedQty =
        parseFloat(this.saleItems[index].freeQty) -
        parseFloat(this.saleItems[index].returnedFreeQty);
      if (parseFloat(value) > allowedQty) {
        alert('Free Returned Qunatity is more than the Sale Free Quantity');
        return;
      }

      runInAction(() => {
        this.items[index].freeQty = parseFloat(value);
        this.getAmount(index);
      });

      if (
        this.returnDetails.customer_id !== undefined &&
        this.returnDetails.customer_id !== ''
      ) {
        // do nothing
      }
    } else {
      this.items[index].freeQty = '';
      this.getAmount(index);
      if (parseFloat(value) < 0) {
        alert('Free returned quantity cannot be less than zero');
        return;
      }
    }
  };

  setMrp = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].mrp = value;
    });
    this.getAmount(index);
  };

  setDiscount = (value) => {
    if (!this.returnDetails) {
      return;
    }
    runInAction(() => {
      this.returnDetails.discount_percent = parseFloat(value) || 0;
      this.returnDetails.discount_type = 'percentage';
    });
  };

  calculateDiscountPercentage = (index, amount) => {
    const mrp = parseFloat(this.items[index].mrp || 0);
    const quantity = this.items[index].qty;
    const offerPrice = parseFloat(this.items[index].offer_price || 0);

    if (!mrp || mrp === 0 || !quantity || quantity === 0) {
      return 0;
    }
    let finalItemPrice;
    if (offerPrice && offerPrice > 0 && mrp > offerPrice) {
      finalItemPrice = offerPrice;
    } else {
      finalItemPrice = mrp;
    }
    const tempAmount = finalItemPrice * quantity;
    runInAction(() => {});
    this.items[index].discount_percent = (amount / tempAmount) * 100;
  };

  setDiscountAmount = (value) => {
    if (!this.returnDetails) {
      return;
    }

    runInAction(() => {
      this.returnDetails.discount_amount = parseFloat(value || 0);
      this.returnDetails.discount_type = 'amount';
    });
  };

  setReturnDiscountAmount = (value) => {
    if (!this.returnDetails) {
      return;
    }

    runInAction(() => {
      this.returnDetails.return_discount_amount = parseFloat(value || 0);
    });
  };

  setTCS = (value) => {
    runInAction(() => {
      this.returnDetails.tcsName = value.name;
      this.returnDetails.tcsRate = value.rate;
      this.returnDetails.tcsCode = value.code;
    });
  };

  revertTCS = () => {
    runInAction(() => {
      this.returnDetails.tcsName = '';
      this.returnDetails.tcsRate = 0;
      this.returnDetails.tcsAmount = 0;
      this.returnDetails.tcsCode = '';
    });
  };

  setTDS = (value) => {
    runInAction(() => {
      this.returnDetails.tdsName = value.name;
      this.returnDetails.tdsRate = value.rate;
      this.returnDetails.tdsCode = value.code;
    });
  };

  revertTDS = () => {
    runInAction(() => {
      this.returnDetails.tdsName = '';
      this.returnDetails.tdsRate = 0;
      this.returnDetails.tdsAmount = 0;
      this.returnDetails.tdsCode = '';
    });
  };

  calculateTaxAndDiscountValue = async (index) => {
    const mrp = parseFloat(this.items[index].mrp || 0);
    const quantity = parseFloat(this.items[index].qty) || 1;
    const offerPrice = parseFloat(this.items[index].offer_price || 0);

    let tax =
      (parseFloat(this.items[index].cgst) || 0) +
      (parseFloat(this.items[index].sgst) || 0);
    let igst_tax = parseFloat(this.items[index].igst || 0);

    const taxIncluded = this.items[index].taxIncluded;

    /* if (!mrp || mrp === 0 || !quantity || quantity === 0) {
      return 0;
    }*/

    let itemPrice = 0;
    if (offerPrice && offerPrice > 0 && mrp > offerPrice) {
      itemPrice = offerPrice;
    } else {
      itemPrice = mrp;
    }

    let netWeight = parseFloat(this.items[index].netWeight || 0);
    if (parseFloat(this.items[index].wastageGrams || 0) > 0 && netWeight > 0) {
      netWeight = netWeight + parseFloat(this.items[index].wastageGrams || 0);
    }

    if (this.items[index].pricePerGram > 0 && netWeight > 0) {
      itemPrice =
        parseFloat(this.items[index].pricePerGram || 0) *
        parseFloat(netWeight || 0);
    }

    //calculate wastage percentage
    let wastageAmount = 0;
    if (
      this.items[index].pricePerGram > 0 &&
      netWeight > 0 &&
      parseFloat(this.items[index].wastagePercentage || 0) > 0
    ) {
      wastageAmount = parseFloat(
        (itemPrice * parseFloat(this.items[index].wastagePercentage || 0)) /
          100 || 0
      ).toFixed(2);
    }

    let discountAmount = 0;

    //add making charges amount if any to mrp_before_tax
    if (this.items[index].makingChargeType === 'percentage') {
      let percentage = this.items[index].makingChargePercent || 0;

      // making charge
      this.items[index].makingChargeAmount = parseFloat(
        (itemPrice * percentage) / 100 || 0
      ).toFixed(2);
    } else if (this.items[index].makingChargeType === 'amount') {
      this.items[index].makingChargePercent =
        Math.round(
          ((this.items[index].makingChargeAmount / itemPrice) * 100 || 0) * 100
        ) / 100;
    }

    if (netWeight > 0) {
      if (!this.items[index].makingChargeIncluded) {
        itemPrice =
          itemPrice +
          parseFloat(this.items[index].makingChargePerGramAmount || 0) *
            parseFloat(this.items[index].netWeight);
      }
    }

    if (!this.items[index].makingChargeIncluded) {
      itemPrice =
        itemPrice + parseFloat(this.items[index].makingChargeAmount || 0);
    }

    if (this.items[index].stoneCharge > 0) {
      itemPrice = itemPrice + parseFloat(this.items[index].stoneCharge || 0);
    }

    if (wastageAmount > 0) {
      itemPrice = itemPrice + parseFloat(wastageAmount || 0);
    }

    /**
     * if discount given at product level then discount logic changes based on
     * whether price is included with tax or eclused with tax
     *
     * if price is included tax then remove tax before calculating the discount
     * if price is excluding the tax then calculate discount on the price directly
     */
    let totalGST = 0;
    let totalIGST = 0;
    let mrp_before_tax = 0;

    if (taxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
      totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
    }

    mrp_before_tax = itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

    let totalItemPriceBeforeTax = parseFloat(mrp_before_tax);

    if (this.items[index].discount_type) {
      totalItemPriceBeforeTax = mrp_before_tax * quantity;

      discountAmount = parseFloat(
        this.getItemDiscountAmount(index, totalItemPriceBeforeTax)
      );
    }

    // price before tax
    this.items[index].mrp_before_tax = parseFloat(mrp_before_tax);

    let discountAmountPerProduct =
      parseFloat(discountAmount) / parseFloat(quantity);

    //per item dicount is removed from per item

    let itemPriceAfterDiscount = 0;

    itemPriceAfterDiscount = mrp_before_tax - discountAmountPerProduct;

    if (discountAmountPerProduct === 0) {
      this.items[index].cgst_amount = (totalGST / 2) * quantity;
      this.items[index].sgst_amount = (totalGST / 2) * quantity;
      this.items[index].igst_amount = totalIGST * quantity;
    }

    await this.calculateTaxAmount(
      index,
      itemPriceAfterDiscount,
      discountAmount
    );
  };

  calculateTaxAmount = (index, itemPriceAfterDiscount, discountAmount) => {
    let tax =
      (parseFloat(this.items[index].cgst) || 0) +
      (parseFloat(this.items[index].sgst) || 0);

    let igst_tax = parseFloat(this.items[index].igst || 0);
    const quantity = this.items[index].qty;
    const taxIncluded = this.items[index].taxIncluded;

    if (!taxIncluded) {
      const totalGST = (itemPriceAfterDiscount * quantity * tax) / 100;
      this.items[index].cgst_amount = totalGST / 2;
      this.items[index].sgst_amount = totalGST / 2;
      this.items[index].igst_amount =
        (itemPriceAfterDiscount * quantity * igst_tax) / 100;
    } else {
      let totalGST = 0;
      let amount = 0;

      if (discountAmount > 0) {
        totalGST = itemPriceAfterDiscount * quantity * (tax / 100);
        this.items[index].cgst_amount = totalGST / 2;
        this.items[index].sgst_amount = totalGST / 2;

        amount = itemPriceAfterDiscount * quantity * (igst_tax / 100);

        this.items[index].igst_amount = Math.round(amount * 100) / 100;
      }
    }
  };

  getItemDiscountAmount = (index, totalPrice) => {
    let discountAmount = 0;
    const discountType = this.items[index].discount_type;
    if (discountType === 'percentage') {
      let percentage = this.items[index].discount_percent || 0;

      discountAmount = parseFloat((totalPrice * percentage) / 100 || 0).toFixed(
        2
      );

      this.items[index].discount_amount_per_item =
        parseFloat(discountAmount) / this.items[index].qty;
    } else if (discountType === 'amount') {
      discountAmount =
        this.items[index].discount_amount_per_item * this.items[index].qty || 0;
      this.items[index].discount_percent =
        Math.round(((discountAmount / totalPrice) * 100 || 0) * 100) / 100;
    }

    this.items[index].discount_amount = parseFloat(discountAmount);

    return discountAmount;
  };

  getAmount = async (index) => {
    const quantity =
      parseFloat(this.items[index].qty) || (this.items[index].freeQty ? 0 : 1);

    // GST should be calculated after applying the discount product level

    if (quantity > 0) {
      await this.calculateTaxAndDiscountValue(index);
    }

    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    let cgst_amount = 0;
    let sgst_amount = 0;
    let igst_amount = 0;
    let cess = 0;
    let discount_amount = 0;
    let mrp_before_tax = 0;

    if (quantity > 0) {
      cgst_amount = parseFloat(this.items[index].cgst_amount || 0);
      sgst_amount = parseFloat(this.items[index].sgst_amount || 0);
      igst_amount = parseFloat(this.items[index].igst_amount || 0);
      cess = parseFloat(this.items[index].cess || 0);
      discount_amount = parseFloat(this.items[index].discount_amount || 0);
      mrp_before_tax = parseFloat(this.items[index].mrp_before_tax || 0);
    } else {
      this.items[index].cgst_amount = 0;
      this.items[index].sgst_amount = 0;
      this.items[index].igst_amount = 0;
      this.items[index].cess = 0;
      this.items[index].discount_amount = 0;
      this.items[index].mrp_before_tax = 0;
    }

    const finalAmount = parseFloat(
      mrp_before_tax * quantity -
        discount_amount +
        cgst_amount +
        sgst_amount +
        igst_amount +
        cess * quantity
    );

    this.items[index].amount = Math.round(finalAmount * 100) / 100 || 0;
  };

  setInvoiceNumber = (value) => {
    runInAction(() => {
      this.returnDetails.invoice_number = value;
    });
  };

  setPaymentType = (value) => {
    runInAction(() => {
      if (value === 'Cash') {
        this.returnDetails.payment_type = value;
      } else {
        this.returnDetails.payment_type = value;
      }
    });
  };

  setCreditData = (value) => {
    runInAction(() => {
      this.returnDetails.is_credit = value;
    });
  };

  get getTotalAmount() {
    if (!this.items) {
      return 0;
    }

    const returnValue = this.items.reduce((a, b) => {
      if (b.returnChecked) {
        const amount = toJS(b.amount);

        if (!isNaN(amount)) {
          a = parseFloat(a) + parseFloat(amount);
        }
      }
      return a;
    }, 0);

    let finalValue = returnValue;

    runInAction(() => {
      this.returnDetails.sub_total = parseFloat(returnValue).toFixed(2);
    });

    let totalAmount =
      finalValue -
      (parseFloat(this.returnDetails.return_discount_amount) || 0) +
      (parseFloat(this.returnDetails.shipping_charge) || 0) +
      (parseFloat(this.returnDetails.packing_charge) || 0);

    let totalTaxableAmount = 0;
    for (let item of this.items) {
      let taxableAmount =
        parseFloat(item.amount) -
        (parseFloat(item.cgst_amount) || 0) -
        (parseFloat(item.sgst_amount) || 0) -
        (parseFloat(item.igst_amount) || 0) -
        (parseFloat(item.cess) || 0);

      totalTaxableAmount = totalTaxableAmount + parseFloat(taxableAmount);
    }

    let tcsAmount = 0;
    let tdsAmount = 0;

    if (this.returnDetails.tcsRate > 0) {
      tcsAmount = (totalAmount * this.returnDetails.tcsRate) / 100;
      this.returnDetails.tcsAmount = tcsAmount;
    }

    if (this.returnDetails.tdsRate > 0) {
      tdsAmount = (totalTaxableAmount * this.returnDetails.tdsRate) / 100;
      this.returnDetails.tdsAmount = tdsAmount;
    }

    totalAmount = totalAmount + tcsAmount;

    if (this.returnDetails.is_roundoff) {
      let beforeRoundTotalAmount = totalAmount;

      if (this.roundingConfiguration === 'Nearest 50') {
        totalAmount = Math.round(totalAmount);
      } else if (this.roundingConfiguration === 'Upward Rounding') {
        totalAmount = Math.ceil(totalAmount);
      } else if (this.roundingConfiguration === 'Downward Rounding') {
        totalAmount = Math.floor(totalAmount);
      }

      runInAction(() => {
        this.returnDetails.round_amount = parseFloat(
          totalAmount - beforeRoundTotalAmount
        ).toFixed(2);
      });
    }

    runInAction(() => {
      this.returnDetails.total_amount = totalAmount;
    });

    return totalAmount;
  }

  get getBalanceData() {
    let balance = 0;

    const totalAmount = parseFloat(this.getTotalAmount);
    balance =
      totalAmount -
      // (parseFloat(this.returnDetails.paid_amount) || 0) -
      (parseFloat(this.returnDetails.linked_amount) || 0);

    if (balance < 0) {
      balance = 0;
    }

    runInAction(() => {
      this.returnDetails.balance_amount = parseFloat(balance).toFixed(2);
    });

    return balance;
  }

  // get getInvoice() {
  //   return this.returnDetails.paid_amount;
  // }

  setSalesReturnCustomerName = (value) => {
    // console.log('setCustomerName, ', value);
    runInAction(() => {
      this.returnDetails.customer_name = value;
    });
  };

  setSalesReturnCustomer = async (customer, isNewCustomer) => {
    runInAction(() => {
      this.returnDetails.customer_id = customer.id;
      this.returnDetails.customer_name = customer.name;
      this.returnDetails.customerGSTNo = customer.gstNumber;
      this.returnDetails.customerGstType = customer.gstType;

      this.returnDetails.customer_address = customer.address;
      this.returnDetails.customer_phoneNo = customer.phoneNo;
      this.returnDetails.customer_pincode = customer.pincode;
      this.returnDetails.customer_city = customer.city;
      this.returnDetails.customer_emailId = customer.emailId;
      this.returnDetails.customerState = customer.state;
      this.returnDetails.customerCountry = customer.country;
      this.returnDetails.aadharNumber = customer.aadharNumber;
      this.isNewCustomer = isNewCustomer;
      if (isNewCustomer) {
        this.newCustomerData = customer;
      }

      if (customer.balanceType === 'Receivable' && customer.balance > 0) {
        this.returnDetails.customerReceivable = true;
        // this.returnDetails.linkPayment = true;
      } else {
        this.returnDetails.customerReceivable = false;
      }

      this.selectedCustomerBalance = customer.balance;
    });
  };

  viewOrEditItem = async (item, isUpdate) => {
    if (typeof isUpdate === 'undefined') {
      isUpdate = true;
    }
    runInAction(() => {
      if (
        !('calculateStockAndBalance' in item) ||
        !item.calculateStockAndBalance
      ) {
        item.calculateStockAndBalance = true;
      }

      this.setNotPerformAmendement(false);
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.openAddSalesReturn = true;
      this.isUpdate = isUpdate;
      this.itemDataForUpdate = item;
      this.items = item.item_list;

      //reset linked txn details start
      item.linkedTxnList = [];
      item.linkPayment = false;
      item.balance_amount =
        parseFloat(item.balance_amount) - parseFloat(item.linked_amount);
      item.linked_amount = 0;
      //reset linked txn details end

      const returnDetails = {
        customer_id: item.customer_id,
        customer_name: item.customer_name,
        customerGSTNo: item.customerGSTNo,
        customerGstType: item.customerGstType,
        customer_phoneNo: item.customer_phoneNo,
        invoice_number: item.invoice_number,
        saleSequenceNumber: item.saleSequenceNumber,
        invoice_date: item.invoice_date,
        is_roundoff: item.is_roundoff,
        round_amount: item.round_amount,
        total_amount: item.total_amount,
        is_credit: item.is_credit,
        payment_type: item.payment_type,
        bankAccount: item.bankAccount,
        bankAccountId: item.bankAccountId,
        bankPaymentType: item.bankPaymentType,
        balance_amount: item.balance_amount,
        linkedTxnList: item.linkedTxnList,
        sales_return_number: item.sales_return_number,
        sequenceNumber: item.sequenceNumber,
        date: item.date,
        linkPayment: item.linkPayment,
        linked_amount: item.linked_amount,
        customerReceivable: item.customerReceivable,
        discount_percent: item.discount_percent,
        discount_amount: item.discount_amount,
        discount_type: item.discount_type,
        paymentReferenceNumber: item.paymentReferenceNumber,
        notes: item.notes,
        customerState: item.customerState,
        customerCountry: item.customerCountry,
        shipping_charge: item.shipping_charge,
        packing_charge: item.packing_charge,
        return_discount_amount: item.return_discount_amount,
        rateList: item.rateList,
        tcsAmount: item.tcsAmount,
        tcsName: item.tcsName,
        tcsRate: item.tcsRate,
        tcsCode: item.tcsCode,
        dueDate: item.dueDate,
        tdsAmount: item.tdsAmount,
        tdsName: item.tdsName,
        tdsRate: item.tdsRate,
        tdsCode: item.tdsCode,
        isCancelled: item.isCancelled,
        isSyncedToServer: item.isSyncedToServer,
        invoiceStatus: item.invoiceStatus,
        tallySyncedStatus: item.tallySyncedStatus,
        calculateStockAndBalance: item.calculateStockAndBalance,
        tallySynced: item.tallySynced,
        aadharNumber: item.aadharNumber,
        salesEmployeeName: item.salesEmployeeName,
        salesEmployeeId: item.salesEmployeeId,
        salesEmployeePhoneNumber: item.salesEmployeePhoneNumber,
        saleTotalAmount: item.saleTotalAmount,
        amendmentDate: item.amendmentDate,
        amended: item.amended,
        amendmentReason: item.amendmentReason,
        discountPercentForAllItems: item.discountPercentForAllItems,
        imageUrls: item.imageUrls,
      };

      this.returnDetails = returnDetails;
    });

    await this.isSaleReturnLockedForEdit();

    if (
      parseFloat(item.balance_amount > 0) &&
      item.customer_id !== '' &&
      item.customer_id.length > 2
    ) {
      const db = await Db.get();

      await this.getAllUnPaidTxnForCustomer(db, this.returnDetails.customer_id);
    }
  };

  closeDialog = () => {
    runInAction(() => {
      this.openAddSalesReturn = false;
      this.saleEnabledRow = 0;
    });
  };

  openForNewReturn = () => {
    const currentDate = getTodayDateInYYYYMMDD();

    runInAction(async () => {
      this.isUpdate = false;
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.openAddSalesReturn = true;
      this.printDataSalesReturn = null;
      this.printBalance = {};
      this.openSaleReturnPrintSelectionAlert = false;
      this.sequenceData = {};
      this.setNotPerformAmendement(false);

      const businessData = await Bd.getBusinessData();
      const timestamp = Math.floor(Date.now() / 1000);
      const appId = businessData.posDeviceId;
      const id = _uniqueId('sr');

      this.returnDetails = {
        customer_id: '',
        customer_name: '',
        customerGSTNo: '',
        customerGstType: '',
        customer_phoneNo: '',
        invoice_number: '',
        saleSequenceNumber: '',
        invoice_date: '',
        is_roundoff: false,
        round_amount: 0.0,
        total_amount: 0.0,
        is_credit: false,
        payment_type: 'Credit',
        bankAccount: '',
        bankAccountId: '',
        bankPaymentType: '',
        paid_amount: 0.0,
        balance_amount: 0.0,
        sales_return_number: `${id}${appId}${timestamp}`,
        sequenceNumber: '',
        date: currentDate,
        dueDate: currentDate,
        linkedTxnList: [],
        linkPayment: false,
        linked_amount: 0,
        customerReceivable: false,
        discount_percent: 0,
        discount_amount: 0,
        discount_type: '',
        paymentReferenceNumber: '',
        notes: '',
        customerState: '',
        customerCountry: '',
        shipping_charge: 0,
        packing_charge: 0,
        return_discount_amount: 0,
        rateList: [],
        isCancelled: false,
        isSyncedToServer: false,
        invoiceStatus: '',
        tallySyncedStatus: '',
        calculateStockAndBalance: true,
        tallySynced: false,
        aadharNumber: '',
        salesEmployeeName: '',
        salesEmployeeId: '',
        salesEmployeePhoneNumber: '',
        saleTotalAmount: 0,
        amendmentDate: '',
        amended: false,
        amendmentReason: '',
        discountPercentForAllItems: 0,
        imageUrls: [],
      };

      this.items = [
        {
          item_name: '',
          description: '',
          imageUrl: '',
          batch_id: 0,
          sku: '',
          barcode: '',
          mrp: 0,
          purchased_price: 0,
          offer_price: 0,
          size: '',
          qty: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          cess: 0,
          taxType: '',
          igst_amount: 0,
          cgst_amount: 0,
          sgst_amount: 0,
          amount: 0,
          roundOff: 0,
          isEdit: true,
          taxIncluded: false,
          returnChecked: false,
          hsn: '',
          finalMRPPrice: 0,
          freeQty: 0
        }
      ];
    });
  };

  openSalesReturn = async (item) => {
    /**
     * get sale link txn
     */
    runInAction(() => {
      this.paymentLinkTransactions = [];
      this.returnDetails.invoice_number = item.invoice_number;
      this.returnDetails.date = dateHelper.getTodayDateInYYYYMMDD();
      this.returnDetails.payment_type = 'Credit';
      this.returnDetails.linked_amount = 0;
      this.returnDetails.linkPayment = false;
    });
    const db = await Db.get();

    await this.loadSaleDataForReturns(item);
    await this.getAllUnPaidTxnForCustomer(db, item.customer_id);

    runInAction(async () => {
      this.isUpdate = false;
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.openAddSalesReturn = true;
      this.sequenceData = {};
      this.setNotPerformAmendement(false);
    });
  };

  selectProduct = (productItem, index) => {
    // console.log('SELECT PRODUCT', productItem, index);
    if (!productItem) {
      return;
    }
    const {
      name,
      description,
      imageUrl,
      salePrice,
      purchasedPrice,
      offerPrice,
      barcode,
      sku,
      cgst,
      sgst,
      igst,
      cess,
      taxIncluded,
      vendorName,
      vendorPhoneNumber,
      categoryLevel2,
      categoryLevel3,
      brandName
    } = productItem;
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].item_name = name;
      this.items[index].description = description;
      this.items[index].imageUrl = imageUrl;
      this.items[index].mrp = salePrice;
      this.items[index].purchased_price = purchasedPrice;
      this.items[index].barcode = barcode;
      this.items[index].sku = sku;
      this.items[index].taxIncluded = taxIncluded;

      this.items[index].vendorName = vendorName;
      this.items[index].vendorPhoneNumber = vendorPhoneNumber;

      // categories
      this.items[index].categoryLevel2 = categoryLevel2.name;
      this.items[index].categoryLevel2DisplayName = categoryLevel2.displayName;
      this.items[index].categoryLevel3 = categoryLevel3.name;
      this.items[index].categoryLevel3DisplayName = categoryLevel3.displayName;

      this.items[index].brandName = brandName;

      if (offerPrice > 0) {
        this.items[index].offer_price = sku;
      } else {
        this.items[index].offer_price = salePrice;
      }

      if (cgst > 0) {
        this.items[index].cgst = cgst;
      }
      if (sgst > 0) {
        this.items[index].sgst = sgst;
      }

      this.items[index].igst = igst;
      this.items[index].cess = cess;

      this.items[index].qty = 1;
      this.items[index].amount = salePrice;
    });
  };

  linkPayment = async (db) => {
    this.returnDetails.linkedTxnList = [];

    const txnList = await lp.linkPayment(
      db,
      this.returnDetails,
      this.paymentLinkTransactions,
      'Sales Return'
    );

    if (txnList) {
      txnList.forEach((txn) => this.returnDetails.linkedTxnList.push(txn));
    }

    this.paymentLinkTransactions = [];
  };

  unLinkPayment = async (db, returnDetails) => {
    await lp.unLinkPayment(db, returnDetails, 'Sales Return');

    returnDetails.linkedTxnList.forEach((item) => {
      this.unLinkedTxnList.push(item);
    });

    /**
     * make used global variable to deafult values
     */
    this.paymentUnLinkTransactions = [];
  };

  setLinkedAmount = async (value) => {
    const amount = parseFloat(value) || 0;
    runInAction(() => {
      this.returnDetails.linked_amount = amount;
    });
  };

  closeLinkPayment = () => {
    runInAction(() => {
      this.openLinkpaymentPage = false;
    });
  };

  selectedPaymentItem = async (row) => {
    if (!this.isUpdate) {
      var index = this.paymentLinkTransactions.findIndex(
        (x) => x.id === row.id
      );

      if (index >= 0) {
        const txnSelected = this.paymentLinkTransactions[index];

        /**
         * since total amount is calculated it will be set only during save/update
         */
        const totalAmount = this.returnDetails.total_amount;
        // const paidAmount = parseFloat(this.returnDetails.paid_amount) || 0;
        let linkedAmount = parseFloat(this.returnDetails.linked_amount) || 0;

        // let amountToLink = totalAmount - paidAmount - linkedAmount || 0;
        let amountToLink = parseFloat(totalAmount) - linkedAmount || 0;

        if (parseFloat(txnSelected.balance) >= amountToLink) {
          txnSelected.linkedAmount = amountToLink;

          runInAction(() => {
            this.returnDetails.linked_amount =
              parseFloat(this.returnDetails.linked_amount) + amountToLink;
          });
        } else {
          txnSelected.linkedAmount = txnSelected.balance;
          runInAction(() => {
            this.returnDetails.linked_amount =
              parseFloat(this.returnDetails.linked_amount) +
              parseFloat(txnSelected.balance);
          });
        }

        txnSelected.balance =
          parseFloat(txnSelected.balance) -
          parseFloat(txnSelected.linkedAmount);

        txnSelected.selected = true;
        runInAction(() => {
          this.paymentLinkTransactions[index] = txnSelected;
        });
      }
    }
  };

  unSelectedPaymentItem = (row) => {
    if (!this.isUpdate) {
      var index = this.paymentLinkTransactions.findIndex(
        (x) => x.id === row.id
      );

      if (index >= 0) {
        const txnSelected = this.paymentLinkTransactions[index];

        /**
         * since total amount is calculated it will be set only during save/update
         */
        const linkedAmount = txnSelected.linkedAmount;

        runInAction(() => {
          this.returnDetails.linked_amount =
            parseFloat(this.returnDetails.linked_amount) -
            parseFloat(linkedAmount);
        });

        txnSelected.balance =
          parseFloat(txnSelected.balance) +
          parseFloat(txnSelected.linkedAmount);

        txnSelected.linkedAmount = 0;

        txnSelected.selected = false;
        runInAction(() => {
          this.paymentLinkTransactions[index] = txnSelected;
        });

        if (this.returnDetails.linked_amount === 0) {
          runInAction(() => {
            this.returnDetails.linkPayment = false;
          });
        }
      }
    }
  };

  autoLinkPayment = async () => {
    /**
     * iterte all linked txn
     * increase linked amount untill it reaches balance amount
     * update all txn with available and linked amount
     */

    await this.resetLinkPayment();
    const totalAmount = this.returnDetails.total_amount;
    // const paidAmount = parseFloat(this.returnDetails.paid_amount) || 0;
    let linkedAmount = parseFloat(this.returnDetails.linked_amount) || 0;

    // let amountToLink = totalAmount - paidAmount - linkedAmount || 0;
    let amountToLink = parseFloat(totalAmount) - linkedAmount || 0;

    if (amountToLink > 0) {
      let finalLinkedAmount = 0;
      for (let txn of this.paymentLinkTransactions) {
        if (txn) {
          if (txn.balance > 0) {
            let linked = 0;
            if (finalLinkedAmount < amountToLink) {
              if (txn.balance >= amountToLink - finalLinkedAmount) {
                linked = amountToLink - finalLinkedAmount;
                txn.linkedAmount = linked;
                finalLinkedAmount = finalLinkedAmount + linked;
              } else {
                linked = txn.balance;
                txn.linkedAmount = linked;
                finalLinkedAmount = finalLinkedAmount + linked;
              }

              txn.selected = true;
              txn.balance = parseFloat(txn.balance) - parseFloat(linked);
            }
          }
        }
      }
      runInAction(() => {
        this.returnDetails.linked_amount = parseFloat(finalLinkedAmount) || 0;

        if (this.returnDetails.linked_amount > 0) {
          this.returnDetails.linkPayment = true;
        }
      });
    }
  };

  resetLinkPayment = () => {
    let linked_amount = this.returnDetails.linked_amount;
    for (let txn of this.paymentLinkTransactions) {
      if (txn) {
        if (txn.linkedAmount >= 0) {
          linked_amount = linked_amount - txn.linkedAmount;
          txn.balance = parseFloat(txn.balance) + parseFloat(txn.linkedAmount);

          txn.linkedAmount = 0;
          txn.selected = false;
        }
      }
    }
    runInAction(() => {
      this.returnDetails.linked_amount = parseFloat(linked_amount) || 0;
    });
  };

  saveLinkPaymentChanges = () => {
    if (this.returnDetails.linked_amount > 0) {
      this.returnDetails.linkPayment = true;
    }
    this.closeLinkPayment();
  };

  setReturnsInvoiceRegular = (invoiceRegular) => {
    runInAction(() => {
      this.returnsInvoiceRegular = invoiceRegular;
    });
  };

  setReturnsInvoiceThermal = (invoiceThermal) => {
    runInAction(() => {
      this.returnsInvoiceThermal = invoiceThermal;
    });
  };

  setReturnChecked = (index, value, allReturnsChecked) => {
    runInAction(() => {
      if (allReturnsChecked) {
        this.items[index].returnChecked = true;
      } else {
        this.items[index].returnChecked = value;
      }
      this.returnDetails.total_amount = this.getTotalAmount;
    });
  };

  setAllReturnChecked = (value) => {
    runInAction(() => {
      for (var i = 0; i < this.items.length; i++) {
        this.setReturnChecked(i, value);
      }
    });
  };

  setPaymentMode = (value) => {
    this.returnDetails.bankPaymentType = value;
  };

  setBankAccountData = (value) => {
    if (value.accountDisplayName && value.id) {
      runInAction(() => {
        this.returnDetails.payment_type = value.accountDisplayName;
        this.returnDetails.bankAccount = value.accountDisplayName;
        this.returnDetails.bankAccountId = value.id;
      });
    }
  };

  getSalesReportFilters = (isDiscount) => {
    let excelFilterList = [];

    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      if (isDiscount) {
        excelFilterList.push(
          {
            val: this.salesTxnEnableFieldsMap.get(
              'enable_product_gross_weight'
            ),
            name: 'Gross Weight'
          },
          {
            val: this.salesTxnEnableFieldsMap.get('enable_product_wastage'),
            name: 'Wastage'
          },
          {
            val: this.salesTxnEnableFieldsMap.get('enable_product_net_weight'),
            name: 'Net Weight'
          },
          {
            val: this.salesTxnEnableFieldsMap.get(
              'enable_product_making_charge'
            ),
            name: 'Making Charge'
          },
          {
            val: this.salesTxnEnableFieldsMap.get(
              'enable_product_making_charge_per_gram'
            ),
            name: 'Making Charge/g'
          },
          {
            val: this.salesTxnEnableFieldsMap.get('enable_product_discount'),
            name: 'Discount'
          }
        );
      } else {
        excelFilterList.push(
          {
            val: this.salesTxnEnableFieldsMap.get(
              'enable_product_gross_weight'
            ),
            name: 'Gross Weight'
          },
          {
            val: this.salesTxnEnableFieldsMap.get('enable_product_wastage'),
            name: 'Wastage'
          },
          {
            val: this.salesTxnEnableFieldsMap.get('enable_product_net_weight'),
            name: 'Net Weight'
          },
          {
            val: this.salesTxnEnableFieldsMap.get(
              'enable_product_making_charge'
            ),
            name: 'Making Charge'
          },
          {
            val: this.salesTxnEnableFieldsMap.get(
              'enable_product_making_charge_per_gram'
            ),
            name: 'Making Charge/g'
          }
        );
      }
    } else {
      excelFilterList.push({
        val: this.salesTxnEnableFieldsMap.get('enable_product_discount'),
        name: 'Discount'
      });
    }

    return excelFilterList;
  };

  setSalesReportFilters = (value) => {
    runInAction(() => {
      this.salesReportFilters = value;
    });
  };

  setSalesTxnEnableFieldsMap = (salesTransSettingData) => {
    this.salesTxnEnableFieldsMap = new Map();

    this.salesReturnTxnSettingsData = salesTransSettingData;
    if (salesTransSettingData.businessId.length > 2) {
      const productLevel = salesTransSettingData.enableOnTxn.productLevel;
      productLevel.map((item) => {
        if (this.salesTxnEnableFieldsMap.has(item.name)) {
          this.salesTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.salesTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      const billLevel = salesTransSettingData.enableOnTxn.billLevel;
      billLevel.map((item) => {
        if (this.salesTxnEnableFieldsMap.has(item.name)) {
          this.salesTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.salesTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });
    }
  };

  setPaymentReferenceNumber = (value) => {
    this.returnDetails.paymentReferenceNumber = value;
  };

  setTaxSettingsData = (value) => {
    this.taxSettingsData = value;
  };

  handleSalesReturnSearchWithPrefix = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let data;
    let query = await db.salesreturn.find({
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

  handleSalesReturnSearchWithSubPrefix = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let data;
    let query = await db.salesreturn.find({
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

  setPackingCharge = (value) => {
    runInAction(() => {
      this.returnDetails.packing_charge = value ? parseFloat(value) : '';
    });
  };

  setShippingCharge = (value) => {
    runInAction(() => {
      this.returnDetails.shipping_charge = value ? parseFloat(value) : '';
    });
  };

  viewAndRestoreSaleReturnItem = async (item) => {
    runInAction(() => {
      this.isRestore = true;

      if (
        !('calculateStockAndBalance' in item) ||
        !item.calculateStockAndBalance
      ) {
        item.calculateStockAndBalance = true;
      }
    });

    await this.loadSaleDataForRestoreSalesReturn(item);
    this.viewOrEditItem(item, false);
  };

  loadSaleDataForRestoreSalesReturn = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.sales.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { invoice_number: item.invoice_number }
        ]
      }
    });

    await query.exec().then(async (data) => {
      if (data) {
        runInAction(() => {
          this.items = [];
        });

        runInAction(() => {
          this.saleItems = data.item_list;
          this.saleDetails.customer_id = data.customer_id;
          this.saleDetails.isPartiallyReturned = data.isPartiallyReturned;
          this.saleDetails.isFullyReturned = data.isFullyReturned;
          this.saleDetails.balanceAmount = data.balance_amount;
          this.saleDetails.isCredit = data.is_credit;
          this.saleDetails.invoice_number = data.invoice_number;
        });
      }
    });
  };

  restoreSaleReturnItem = async (item) => {
    await this.loadSaleDataForRestoreSalesReturn(item);

    runInAction(() => {
      this.isRestore = true;
      this.isCancelledRestore = false;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.items = item.item_list;
      this.sequenceData = {};

      if (
        !('calculateStockAndBalance' in item) ||
        !item.calculateStockAndBalance
      ) {
        item.calculateStockAndBalance = true;
      }

      //reset linked txn details start
      item.linkedTxnList = [];
      item.linkPayment = false;
      item.balance_amount =
        parseFloat(item.balance_amount) - parseFloat(item.linked_amount);
      item.linked_amount = 0;
      //reset linked txn details end

      const returnDetails = {
        customer_id: item.customer_id,
        customer_name: item.customer_name,
        customerGSTNo: item.customerGSTNo,
        customerGstType: item.customerGstType,
        customer_phoneNo: item.customer_phoneNo,
        invoice_number: item.invoice_number,
        saleSequenceNumber: item.sequenceNumber,
        invoice_date: item.invoice_date,
        is_roundoff: item.is_roundoff,
        round_amount: item.round_amount,
        total_amount: item.total_amount,
        is_credit: item.is_credit,
        payment_type: item.payment_type,
        bankAccount: item.bankAccount,
        bankAccountId: item.bankAccountId,
        bankPaymentType: item.bankPaymentType,
        balance_amount: item.balance_amount,
        linkedTxnList: item.linkedTxnList,
        sales_return_number: item.sales_return_number,
        sequenceNumber: item.sequenceNumber,
        date: item.date,
        linkPayment: item.linkPayment,
        linked_amount: item.linked_amount,
        customerReceivable: item.customerReceivable,
        discount_percent: item.discount_percent,
        discount_amount: item.discount_amount,
        discount_type: item.discount_type,
        paymentReferenceNumber: item.paymentReferenceNumber,
        notes: item.notes,
        customerState: item.customerState,
        customerCountry: item.customerCountry,
        shipping_charge: item.shipping_charge,
        packing_charge: item.packing_charge,
        return_discount_amount: item.return_discount_amount,
        rateList: item.rateList,
        isCancelled: item.isCancelled,
        isSyncedToServer: item.isSyncedToServer,
        invoiceStatus: item.invoiceStatus,
        tallySyncedStatus: item.tallySyncedStatus,
        calculateStockAndBalance: item.calculateStockAndBalance,
        tallySynced: item.tallySynced,
        aadharNumber: item.aadharNumber,
        salesEmployeeName: item.salesEmployeeName,
        salesEmployeeId: item.salesEmployeeId,
        salesEmployeePhoneNumber: item.salesEmployeePhoneNumber,
        saleTotalAmount: item.saleTotalAmount,
        amendmentDate: item.amendmentDate,
        amended: item.amended,
        amendmentReason: item.amendmentReason,
        discountPercentForAllItems: item.discountPercentForAllItems,
        imageUrls: item.imageUrls,
      };

      this.returnDetails = returnDetails;
    });

    //save data
    await this.updateSaleReturnInformation(false);
  };

  markSaleReturnRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: this.returnDetails.sales_return_number } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        this.returnDetails = {};
      })
      .catch((error) => {
        console.log('Deleted data deletion Failed ' + error);
      });
  };

  viewAndRestoreCancelledSaleReturnItem = async (item) => {
    await this.loadSaleDataForRestoreSalesReturn(item);

    runInAction(() => {
      this.isRestore = false;
      this.isCancelledRestore = true;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.items = item.item_list;
      this.sequenceData = {};

      //reset linked txn details start
      item.linkedTxnList = [];
      item.linkPayment = false;
      item.balance_amount =
        parseFloat(item.balance_amount) - parseFloat(item.linked_amount);
      item.linked_amount = 0;
      //reset linked txn details end

      const returnDetails = {
        customer_id: item.customer_id,
        customer_name: item.customer_name,
        customerGSTNo: item.customerGSTNo,
        customerGstType: item.customerGstType,
        customer_phoneNo: item.customer_phoneNo,
        invoice_number: item.invoice_number,
        saleSequenceNumber: item.sequenceNumber,
        invoice_date: item.invoice_date,
        is_roundoff: item.is_roundoff,
        round_amount: item.round_amount,
        total_amount: item.total_amount,
        is_credit: item.is_credit,
        payment_type: item.payment_type,
        bankAccount: item.bankAccount,
        bankAccountId: item.bankAccountId,
        bankPaymentType: item.bankPaymentType,
        balance_amount: item.balance_amount,
        linkedTxnList: item.linkedTxnList,
        sales_return_number: item.sales_return_number,
        sequenceNumber: item.sequenceNumber,
        date: item.date,
        linkPayment: item.linkPayment,
        linked_amount: item.linked_amount,
        customerReceivable: item.customerReceivable,
        discount_percent: item.discount_percent,
        discount_amount: item.discount_amount,
        discount_type: item.discount_type,
        paymentReferenceNumber: item.paymentReferenceNumber,
        notes: item.notes,
        customerState: item.customerState,
        customerCountry: item.customerCountry,
        shipping_charge: item.shipping_charge,
        packing_charge: item.packing_charge,
        return_discount_amount: item.return_discount_amount,
        rateList: item.rateList,
        isCancelled: item.isCancelled,
        isSyncedToServer: item.isSyncedToServer
      };

      this.returnDetails = returnDetails;
    });

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.salesreturn.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            sales_return_number: { $eq: this.returnDetails.sales_return_number }
          }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Sales quotation data is not found so cannot update any information
          return;
        }

        await query
          .update({
            $set: {
              updatedAt: Date.now(),
              isCancelled: false
            }
          })
          .then(async () => {
            this.markCancelledSaleReturnRestored();
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  markCancelledSaleReturnRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionscancelled.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: this.returnDetails.sales_return_number } }
        ]
      }
    });
    await query
      .remove()
      .then(async (data) => {
        this.returnDetails = {};
      })
      .catch((error) => {
        console.log('Deleted data deletion Failed ' + error);
      });
  };

  resetSaleReturnPrintData = () => {
    runInAction(() => {
      this.printDataSalesReturn = {};
      this.printBalance = {};
      this.openSaleReturnPrintSelectionAlert = false;
    });
  };

  closeDialogForSaveAndPrint = () => {
    this.handleCloseSaleReturnLoadingMessage();
    this.closeDialog();
    if (this.saveAndNew) {
      this.saveAndNew = false;
      this.openForNewReturn();
    }

    this.resetAllData();

    this.sequenceData = {};
  };

  handleOpenSaleReturnLoadingMessage = async () => {
    runInAction(() => {
      this.openSaleReturnLoadingAlertMessage = true;
    });
  };

  handleCloseSaleReturnLoadingMessage = async () => {
    runInAction(() => {
      this.openSaleReturnLoadingAlertMessage = false;
    });
  };

  handleOpenSaleReturnErrorAlertMessage = async () => {
    runInAction(() => {
      this.openSaleReturnErrorAlertMessage = true;
    });
  };

  handleCloseSaleReturnErrorAlertMessage = async () => {
    runInAction(() => {
      this.openSaleReturnErrorAlertMessage = false;
    });
  };

  handleOpenSaleReturnPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openSaleReturnPrintSelectionAlert = true;
    });
  };

  handleCloseSaleReturnPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openSaleReturnPrintSelectionAlert = false;
    });
  };

  setRoundingConfiguration = (value) => {
    this.roundingConfiguration = value;
  };

  cancelSaleReturn = async (item, remark) => {
    this.items = item.item_list;

    const returnDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_phoneNo: item.customer_phoneNo,
      invoice_number: item.invoice_number,
      saleSequenceNumber: item.sequenceNumber,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      balance_amount: item.balance_amount,
      linkedTxnList: item.linkedTxnList,
      sales_return_number: item.sales_return_number,
      sequenceNumber: item.sequenceNumber,
      date: item.date,
      linkPayment: item.linkPayment,
      linked_amount: item.linked_amount,
      customerReceivable: item.customerReceivable,
      discount_percent: item.discount_percent,
      discount_amount: item.discount_amount,
      discount_type: item.discount_type,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      shipping_charge: item.shipping_charge,
      packing_charge: item.packing_charge,
      return_discount_amount: item.return_discount_amount,
      rateList: item.rateList,
      isCancelled: item.isCancelled,
      isSyncedToServer: item.isSyncedToServer
    };

    this.returnDetails = returnDetails;

    let CancelledDataDoc = {
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      total: 0,
      balance: 0,
      data: ''
    };

    let restoreSalesData = {};
    restoreSalesData = this.returnDetails;
    restoreSalesData.item_list = this.items;
    restoreSalesData.employeeId = this.returnDetails.employeeId;

    CancelledDataDoc.transactionId = this.returnDetails.sales_return_number;
    CancelledDataDoc.sequenceNumber = this.returnDetails.sequenceNumber;
    CancelledDataDoc.transactionType = 'Sales Return';
    CancelledDataDoc.data = JSON.stringify(restoreSalesData);
    CancelledDataDoc.total = this.returnDetails.total_amount;
    CancelledDataDoc.balance = this.returnDetails.balance_amount;
    CancelledDataDoc.createdDate = this.returnDetails.date;
    CancelledDataDoc.reason = remark;

    cancelTxn.addCancelEvent(CancelledDataDoc);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.salesreturn.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            sales_return_number: {
              $eq: this.returnDetails.sales_return_number
            }
          }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Sales quotation data is not found so cannot update any information
          return;
        }

        await query.update({
          $set: {
            updatedAt: Date.now(),
            isCancelled: true
          }
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  updateSaleReturnTallySyncStatus = async (status, invoiceNumber) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.salesreturn.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            sales_return_number: {
              $eq: invoiceNumber
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
            // define the custom event
            const myEvent = new CustomEvent('onTallyStatusChangedEvent', {
              data: {}
            });

            // dispatch the event
            window.dispatchEvent(myEvent);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      })
      .catch((err) => {
        console.log('Internal Server Error Sale Order', err);
      });
  };

  updateBulkSaleReturnTallySyncStatus = async (inputItems, status) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    for (var i = 0; i < inputItems.length; i++) {
      let item = inputItems[i];
      let updatedAtNewTime = timestamp.getUniqueTimestamp();

      const query = db.salesreturn.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              sales_return_number: {
                $eq: item.sales_return_number
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

  isSaleReturnLockedForEdit = async () => {
    let auditSettings = await audit.getAuditSettingsData();
    this.saleLockMessage = '';

    var dateParts = this.returnDetails.invoice_date.split('-');

    if (
      dateHelper.getCurrentFinancialYear().toString() ===
      dateParts[0].toString()
    ) {
      if (
        auditSettings.lockSales &&
        auditSettings.lockSales.includes(Number(dateParts[1].toString()))
      ) {
        this.isLocked = true;
        this.saleLockMessage =
          'GSTR-1 filings completed. Sale Return is not eligible for Edit!!';
      }
    }

    return this.isLocked;
  };

  isSaleReturnLockedForDelete = async (item) => {
    let auditSettings = await audit.getAuditSettingsData();
    this.saleLockMessage = '';
    let isLocked = false;

    var dateParts = item.invoice_date.split('-');

    if (
      dateHelper.getCurrentFinancialYear().toString() ===
      dateParts[0].toString()
    ) {
      if (
        auditSettings.lockSales &&
        auditSettings.lockSales.includes(Number(dateParts[1].toString()))
      ) {
        isLocked = true;
        this.saleLockMessage =
          'GSTR-1 filings completed. Sale Return is not eligible for Delete!!';
      }
    }

    let returnObj = {
      isLocked: isLocked,
      saleLockMessage: this.saleLockMessage
    };

    return returnObj;
  };

  isSaleReturnLockedForCancel = async (item) => {
    let auditSettings = await audit.getAuditSettingsData();
    this.saleLockMessage = '';
    let isLocked = false;

    var dateParts = item.invoice_date.split('-');

    if (
      dateHelper.getCurrentFinancialYear().toString() ===
      dateParts[0].toString()
    ) {
      if (
        auditSettings.lockSales &&
        auditSettings.lockSales.includes(Number(dateParts[1].toString()))
      ) {
        isLocked = true;
        this.saleLockMessage =
          'GSTR-1 filings completed. Sale Return is not eligible for Cancel!!';
      }
    }

    let returnObj = {
      isLocked: isLocked,
      saleLockMessage: this.saleLockMessage
    };

    return returnObj;
  };

  handleAmendmentDialogClose = () => {
    runInAction(() => {
      this.openAmendmentDialog = false;
    });
  };

  handleAmendmentDialogOpen = () => {
    runInAction(() => {
      this.openAmendmentDialog = true;
    });
  };

  setAmendmentDate = (amendementDate) => {
    runInAction(() => {
      this.returnDetails.amendmentDate = amendementDate;
    });
  };

  setAmendmentRemarks = (remarks) => {
    runInAction(() => {
      this.returnDetails.amendmentReason = remarks;
    });
  };

  setAmendmentFlag = (flag) => {
    runInAction(() => {
      this.returnDetails.amended = flag;
    });
  };

  revertSaleReturnAmendmentStatus = async (invoiceNumber) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.salesreturn.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            sales_return_number: {
              $eq: invoiceNumber
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
              amended: false,
              amendmentDate: '',
              amendmentReason: ''
            }
          })
          .then(async (data) => {})
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      })
      .catch((err) => {
        console.log('Internal Server Error Sale Order', err);
      });
  };

  setNotPerformAmendement = (value) => {
    runInAction(() => {
      this.notPerformAmendment = value;
    });
  };

  setFileUploadImageurls = (files) => {
    runInAction(() => {
      this.returnDetails.imageUrls = files;
    })
  }

  shouldShowSaleReturnAmendmentPopUp = async () => {
    const inputDate = new Date(this.returnDetails.date);
    const lastBeforeMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    );
    const beforeMonthDate = new Date(dateFormat(lastBeforeMonth, 'yyyy-mm-dd'));
    let toAmend = false;
    if (
      inputDate <= beforeMonthDate &&
      this.returnDetails.amended === false &&
      this.isUpdate === false &&
      this.notPerformAmendment === false
    ) {
      toAmend = true;
    }

    return toAmend;
  };

  setCancelRemark = (value) => {
    runInAction(() => {
      this.cancelRemark = value;
    });
  };

  handleCancelClose = () => {
    runInAction(() => {
      this.cancelItem = {};
      this.cancelRemark = '';
      this.openCancelDialog = false;
    });
  };

  handleOpenCancelDialog = (saleItem) => {
    runInAction(() => {
      this.cancelItem = saleItem;
      this.openCancelDialog = true;
    });
  };

  constructor() {
    makeObservable(this, {
      returnDetails: observable,
      items: observable,
      setDiscount: action,
      setQuantity: action,
      setItemSku: action,
      setItemBarcode: action,
      setItemName: action,
      setItemDescription: action,
      setItemImageUrl: action,
      setMrp: action,
      setOffer: action,
      getAmount: action,
      setCGST: action,
      setSGST: action,
      setDiscountAmount: action,
      setInvoiceNumber: action,
      deleteItem: action,
      setCreditData: action,
      getTotalAmount: computed,
      getBalanceData: computed,
      setPaymentType: action,
      toggleRoundOff: action,
      getRoundedAmount: computed,
      newCustomer: observable,
      newCustomerData: observable,
      setSalesReturnCustomer: action,
      saveData: action,
      saveDataAndNew: action,
      isUpdate: observable,
      openAddSalesReturn: observable,
      closeDialog: action,
      viewOrEditItem: action,
      openForNewReturn: action,
      openSalesReturn: action,
      selectProduct: action,
      setEditTable: action,
      setSaleReturnProperty: action,
      viewOrEditSaleReturnTxnItem: action,
      deleteSaleReturnTxnItem: action,
      selectedCustomerBalance: observable,
      isSalesReturnList: observable,
      openLinkpaymentPage: observable,
      paymentLinkTransactions: observable,
      saleEnabledRow: observable,
      returnDetailsList: observable,
      setReturnsInvoiceRegular: action,
      setReturnsInvoiceThermal: action,
      setReturnChecked: action,
      setPaymentMode: action,
      setBankAccountData: action,
      salesTxnEnableFieldsMap: observable,
      setSalesTxnEnableFieldsMap: action,
      saleDetails: observable,
      setPaymentReferenceNumber: action,
      taxSettingsData: observable,
      setTaxSettingsData: action,
      handleSalesReturnSearchWithPrefix: action,
      handleSalesReturnSearchWithSubPrefix: action,
      setPackingCharge: action,
      setShippingCharge: action,
      setAllReturnChecked: action,
      viewAndRestoreSaleReturnItem: action,
      restoreSaleReturnItem: action,
      isRestore: observable,
      printDataSalesReturn: observable,
      resetSaleReturnPrintData: action,
      closeDialogForSaveAndPrint: action,
      salesReturnTxnSettingsData: observable,
      printBalance: observable,
      openSaleReturnLoadingAlertMessage: observable,
      openSaleReturnErrorAlertMessage: observable,
      openSaleReturnPrintSelectionAlert: observable,
      setRoundingConfiguration: action,
      sequenceNumberFailureAlert: observable,
      isLocked: observable,
      saleLockMessage: observable,
      salesReportFilters: observable,
      openAmendmentDialog: observable,
      notPerformAmendment: observable,
      cancelRemark: observable,
      openCancelDialog: observable
    });
  }
}
export default new ReturnsAddStore();
