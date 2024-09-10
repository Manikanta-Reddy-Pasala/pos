import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS
} from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import _uniqueId from 'lodash/uniqueId';
import * as Bd from '../../components/SelectedBusiness';
import * as linkPayment from '../../components/Helpers/AlltransactionsLinkPaymentHelper';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import BatchData from './classes/BatchData';
import * as audit from '../../components/Helpers/AuditHelper';
import * as taxSettings from '../../components/Helpers/TaxSettingsHelper';
import getStateList from '../../components/StateList';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

class JobWorkInStore {
  newCustomer = false;

  isUpdate = false;

  OpenAddJobWorkInvoice = false;

  OpenJobWorkInBatchList = false;

  selectedProduct = {};

  saveAndNew = false;

  existingSaleData = {};

  newCustomerData = {};

  selectedIndex = 0;

  paymentLinkTransactions = [];

  FocusLastIndex = false;

  enabledRow = 0;

  addNewRowEnabled = false;

  jobWorkInTxnEnableFieldsMap = new Map();
  jobWorkInSettingsData = {};

  taxSettingsData = {};

  // isSaveOrUpdateOrDeleteClicked = false;
  /**
   * below filed is for saving all 3 tables unliked transactions list
   */
  paymentUnLinkTransactions = [];
  /**
   * only to store un liked related to sale table
   */
  saleUnLinkedTxnList = [];

  openLinkpaymentPage = false;
  metalList = [];

  saleDetails = {
    businessId: '',
    businessCity: '',
    customer_id: '',
    customer_name: '',
    customerGSTNo: null,
    customerGstType: '',
    customer_payable: false,
    customer_address: '',
    customer_phoneNo: '',
    customer_city: '',
    customer_emailId: '',
    customer_pincode: '',
    job_work_in_invoice_number: 0,
    invoice_date: getTodayDateInYYYYMMDD(),
    due_date: getTodayDateInYYYYMMDD(),
    is_roundoff: false,
    round_amount: 0.0,
    total_amount: 0.0,
    is_credit: true,
    payment_type: 'cash',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    received_amount: 0.0,
    balance_amount: 0.0,
    linked_amount: 0.0,
    isPartiallyReturned: false,
    isFullyReturned: false,
    linkPayment: false,
    linkedTxnList: [],
    updatedAt: '',
    discount_percent: 0,
    discount_amount: 0,
    discount_type: '',
    packing_charge: 0,
    shipping_charge: 0,
    sequenceNumber: '',
    paymentReferenceNumber: '',
    numberOfItems: 0,
    notes: '',
    numberOfSelectedItems: 0,
    numberOfPendingItems: 0,
    status: 'open',
    customerState: '',
    customerCountry: '',
    rateList: [],
    jobAssignedEmployeeId: '',
    jobAssignedEmployeeName: '',
    jobAssignedEmployeePhoneNumber: '',
    weightIn: 0,
    isSyncedToServer: false,
    discountPercentForAllItems: 0,
    imageUrls: []
  };

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
      mrp_before_tax: 0,
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
      taxIncluded: false,
      discount_percent: 0,
      discount_amount: 0,
      discount_amount_per_item: 0,
      discount_type: '',
      amount: 0,
      roundOff: 0,
      isEdit: true,
      returnedQty: 0,
      stockQty: 0,
      vendorName: '',
      vendorPhoneNumber: '',
      brandName: '',
      categoryLevel2: '',
      categoryLevel2DisplayName: '',
      categoryLevel3: '',
      categoryLevel3DisplayName: '',
      wastagePercentage: '',
      wastageGrams: '',
      copperGrams: '',
      grossWeight: '',
      netWeight: '',
      purity: '',
      hsn: '',
      makingChargePercent: 0,
      makingChargeAmount: 0,
      makingChargeType: '',
      isSelected: false,
      makingChargePerGramAmount: 0,
      makingChargeIncluded: false,
      pricePerGram: 0,
      stoneWeight: 0,
      stoneCharge: 0,
      serialOrImeiNo: '',
      qtyUnit: '',
      primaryUnit: null,
      secondaryUnit: null,
      unitConversionQty: 0,
      units: [],
      originalMrpWithoutConversionQty: 0,
      mfDate: null,
      expiryDate: null,
      rack: '',
      warehouseData: '',
      batchNumber: '',
      modelNo: '',
      freeQty: 0,
      itemNumber: 0,
      originalDiscountPercent: 0,
      dailyRate: '',
      properties: [],
      hallmarkCharge: 0,
      certificationCharge: 0
    }
  ];

  salesData = [];
  totalSalesData = [];
  sales = [];
  dateDropValue = null;
  customerList = [];
  isSalesList = false;

  salesInvoiceRegular = {};
  salesInvoiceThermal = {};

  invoiceData = {};

  openRegularPrint = false;

  isRestore = false;

  chosenMetalString = '';
  chosenMetalList = [];

  printJobWorkInData = null;
  openJobWorkInLoadingAlertMessage = false;
  openJobWorkInErrorAlertMessage = false;

  openJobWorkInPrintSelectionAlert = false;

  roundingConfiguration = 'Nearest 50';

  customerAddressList = [];
  customerAddressType = '';
  openAddressList = false;

  descriptionCollapsibleMap = new Map();

  isCGSTSGSTEnabledByPOS = true;

  sequenceNumberFailureAlert = false;

  OpenJobWorkInSerialList = false;
  openJobWorkInValidationMessage = false;
  errorAlertMessage = '';

  closeLinkPayment = () => {
    this.openLinkpaymentPage = false;
  };

  saveLinkPaymentChanges = () => {
    if (this.saleDetails.linked_amount > 0) {
      this.saleDetails.linkPayment = true;
    }
    this.closeLinkPayment();
  };

  setJobWorkInTxnEnableFieldsMap = (salesTransSettingData) => {
    this.jobWorkInSettingsData = salesTransSettingData;
    if (salesTransSettingData.businessId.length > 2) {
      this.jobWorkInTxnEnableFieldsMap = new Map();
      const productLevel = salesTransSettingData.enableOnTxn.productLevel;
      productLevel.map((item) => {
        if (this.jobWorkInTxnEnableFieldsMap.has(item.name)) {
          this.jobWorkInTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.jobWorkInTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      const billLevel = salesTransSettingData.enableOnTxn.billLevel;
      billLevel.map((item) => {
        if (this.jobWorkInTxnEnableFieldsMap.has(item.name)) {
          this.jobWorkInTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.jobWorkInTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      if (
        !this.isUpdate &&
        this.jobWorkInTxnEnableFieldsMap.get('enable_roundoff_default')
      ) {
        this.saleDetails.is_roundoff = true;
      }
    }
  };

  setTaxSettingsData = (value) => {
    this.taxSettingsData = value;
  };

  getJobWorkInDetails = async (customerId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.jobworkin
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
        this.sales = data.map((item) => item.toJSON());
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setDateDropValue = (data) => {
    runInAction(() => {
      this.dateDropValue = data;
    });
  };

  addJobWorkInData = (data) => {
    if (data) {
      runInAction(() => {
        if (data.length > 0) {
          this.salesData = data.map((item) => item.toJSON());
        } else {
          this.salesData = [];
        }
      });
    }
  };

  addJobWorkInJSONData = (data) => {
    if (data) {
      runInAction(() => {
        if (data.length > 0) {
          this.salesData = data.map((item) => item);
        } else {
          this.salesData = [];
        }
      });
    }
  };

  get getJobWorkInData() {
    return this.salesData ? this.salesData : [];
  }

  get getTotalAmount() {
    if (!this.items) {
      return 0;
    }

    const returnValue = this.items.reduce((a, b) => {
      const amount = toJS(b.amount);

      if (!isNaN(amount)) {
        a = parseFloat(a) + parseFloat(amount);
      }
      return a;
    }, 0);

    let finalValue = returnValue;

    //sun total is exluded with overal discount and shipping charges
    runInAction(() => {
      this.saleDetails.sub_total = parseFloat(returnValue).toFixed(2);
    });

    let discountAmount = 0;
    const discountType = this.saleDetails.discount_type;

    if (discountType === 'percentage') {
      let percentage = parseFloat(this.saleDetails.discount_percent || 0);

      discountAmount = parseFloat((finalValue * percentage) / 100 || 0);
      runInAction(() => {
        this.saleDetails.discount_amount = discountAmount;
      });
    } else if (discountType === 'amount') {
      discountAmount = parseFloat(this.saleDetails.discount_amount || 0);
      runInAction(() => {
        this.saleDetails.discount_percent =
          Math.round(((discountAmount / finalValue) * 100 || 0) * 100) / 100;
      });
    }

    let totalAmount = parseFloat(
      finalValue -
        discountAmount +
        (this.saleDetails.shipping_charge || 0) +
        (this.saleDetails.packing_charge || 0)
    );

    if (this.saleDetails.is_roundoff) {
      let beforeRoundTotalAmount = totalAmount;

      if (this.roundingConfiguration === 'Nearest 50') {
        totalAmount = Math.round(totalAmount);
      } else if (this.roundingConfiguration === 'Upward Rounding') {
        totalAmount = Math.ceil(totalAmount);
      } else if (this.roundingConfiguration === 'Downward Rounding') {
        totalAmount = Math.floor(totalAmount);
      }

      runInAction(() => {
        this.saleDetails.round_amount = parseFloat(
          totalAmount - beforeRoundTotalAmount
        ).toFixed(2);
      });
    }

    this.saleDetails.total_amount = parseFloat(totalAmount).toFixed(2);
    return totalAmount;
  }

  get getTotalNetWeight() {
    if (!this.items) {
      return 0;
    }

    let total = 0;

    for (let item of this.items) {
      total = total + parseFloat(item.netWeight || 0);
    }

    return parseFloat(total).toFixed(2);
  }

  get getTotalGrossWeight() {
    if (!this.items) {
      return 0;
    }

    let total = 0;

    for (let item of this.items) {
      total = total + parseFloat(item.grossWeight || 0);
    }

    return parseFloat(total).toFixed(2);
  }

  get getTotalWatage() {
    if (!this.items) {
      return 0;
    }

    let total = 0;

    for (let item of this.items) {
      total = total + parseFloat(item.wastageGrams || 0);
    }

    return parseFloat(total).toFixed(2);
  }

  get getTotalCopper() {
    if (!this.items) {
      return 0;
    }

    let total = 0;

    for (let item of this.items) {
      total = total + parseFloat(item.copperGrams || 0);
    }

    return parseFloat(total).toFixed(2);
  }

  get getTotalTxnAmount() {
    runInAction(() => {
      this.totalSalesData = this.totalSalesData ? this.totalSalesData : [];
    });

    let returnData = this.totalSalesData.reduce(
      (a, b) => {
        let data = toJS(b);

        a.paid = parseFloat(
          parseFloat(a.paid) +
            (parseFloat(data.total_amount) - parseFloat(data.balance_amount))
        ).toFixed(2);

        a.unpaid = parseFloat(
          parseFloat(a.unpaid) + parseFloat(data.balance_amount)
        ).toFixed(2);

        return a;
      },
      { paid: 0, unpaid: 0 }
    );
    return returnData;
  }

  setCustomerList = (data) => {
    this.customerList = data;
  };

  getJobWorkInCount = async () => {
    const db = await Db.get();
    // console.log('inside sales count');
    const businessData = await Bd.getBusinessData();

    await db.jobworkin
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        this.isSalesList = data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getJobWorkInList = async (fromDate, toDate) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;
    const businessData = await Bd.getBusinessData();

    if (!fromDate || !toDate) {
      query = db.jobworkin.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              updatedAt: { $exists: true }
            },
            {
              invoice_date: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });
    } else {
      query = db.jobworkin.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });
    }

    query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }
        runInAction(() => {
          this.salesData = data.map((item) => item.toJSON());
        });
      })
      .catch((err) => {
        runInAction(() => {
          this.salesData = [];
        });
        console.log('Internal Server Error', err);
      });
  };

  getJobWorkInListWithLimit = async (fromDate, toDate, pageSize) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;

    if (!pageSize) {
      pageSize = 5;
    }

    const businessData = await Bd.getBusinessData();

    if (!fromDate || !toDate) {
      query = db.jobworkin.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              updatedAt: { $exists: true }
            },
            {
              invoice_date: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }],
        limit: pageSize
      });
    } else {
      query = db.jobworkin.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }],
        limit: pageSize
      });
    }

    query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }
        runInAction(() => {
          this.salesData = data.map((item) => item.toJSON());
        });
      })
      .catch((err) => {
        runInAction(() => {
          this.salesData = [];
        });
        console.log('Internal Server Error', err);
      });
  };

  handleJobWorkInSearch = async (value) => {
    const db = await Db.get();
    console.log('handleJobWorkInSearch', value);
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.jobworkin
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                { sequenceNumber: { $regex: regexp } },
                { customer_name: { $regex: regexp } },
                { payment_type: { $regex: regexp } },
                { total_amount: { $eq: parseFloat(value) } }
              ]
            }
          ]
        }
      })
      .exec()
      .then((documents) => {
        data = documents.map((item) => item);
        // console.log(data);
      });
    return data;
  };

  handleJobWorkInSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    let query = await db.jobworkin.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              { sequenceNumber: { $regex: regexp } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              { payment_type: { $regex: regexp } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              { customer_name: { $regex: regexp } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              { total_amount: { $eq: parseFloat(value) } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              }
            ]
          }
        ]
      }
      // sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
    });

    await query.exec().then((documents) => {
      data = documents.map((item) => item);
    });
    return data;
  };

  setEditTable = (index, value, lastIndexFocusIndex) => {
    // this.enabledRow = index;
    if (this.items && this.items.length > 0) {
      for (var i = 0; i < this.items.length; i++) {
        if (index === i) {
          this.items[i].isEdit = true;
        } else {
          this.items[i].isEdit = false;
        }
      }
    }
    if (index && value) {
      if (this.items[index]) {
        this.items[index].isEdit = value;
      }
    }
    this.FocusLastIndex = lastIndexFocusIndex;
  };

  setLinkPayment = async () => {
    /**
     * in case of online orders we are not going to enable link payment click
     */
    if (
      (parseFloat(this.saleDetails.posId) > 0 && this.isUpdate) ||
      !this.isUpdate
    ) {
      this.openLinkpaymentPage = true;

      // if (this.saleDetails.linked_amount === 0) {
      //   this.paymentLinkTransactions = [];
      //   const db = await Db.get();
      //   await this.getAllUnPaidTxnForCustomer(db, this.saleDetails.customer_id);
      // }
    }
  };

  setLinkedAmount = async (value) => {
    // console.log('setLinkedAmount::', value);
    const amount = parseFloat(value) || 0;
    this.saleDetails.linked_amount = amount;
  };

  get getBalanceAfterLinkedAmount() {
    // console.log('getBalanceAfterLinkedAmount');

    let result = 0;

    result =
      this.saleDetails.total_amount - this.saleDetails.linked_amount ||
      // -
      // this.saleDetails.received_amount
      0;

    return result;
  }

  getAllUnPaidTxnForCustomer = async (db, id) => {
    await Promise.all([
      this.getPaymentInData(db, id),
      this.getSalesReturnData(db, id),
      this.getCreditPurchaseData(db, id),
      this.getOpeningBalanceData(db, id)
    ]);

    // console.log('got all records from 3 tables');
    /**
     * sort by date
     */
    this.paymentLinkTransactions.sort(function (a, b) {
      return (
        new Date(a.date ? a.date : a.bill_date) -
        new Date(b.date ? b.date : b.bill_date)
      );
    });

    // console.log('after sort::', this.paymentLinkTransactions);
  };

  generateInvoiceNumber = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('jwi');
    this.saleDetails.job_work_in_invoice_number = `${id}${appId}${timestamp}`;
  };

  generateProductId = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('p');
    return `${id}${appId}${timestamp}`;
  };

  resetAllData() {
    // console.log('reset called');
    runInAction(() => {
      this.saleDetails = {};
      this.existingSaleData = {};
      this.paymentUnLinkTransactions = [];
      this.paymentLinkTransactions = [];
      this.isRestore = false;
    });
  }

  saveDataAndNew = async (isPrint) => {
    this.saveAndNew = true;
    await this.saveData(isPrint);
  };

  viewOrEditJobWorkInTxnItem = async (item) => {
    console.log('viewOrEditSaleTxnItem::', item);
    await this.viewOrEditItem(item);
  };

  deleteJobWorkInTxnItem = async (item) => {
    // console.log('delete::', item);
    this.existingSaleData = item;
    this.items = item.item_list;

    this.saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_payable: item.customer_payable,
      job_work_in_invoice_number: item.job_work_in_invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // received_amount: item.received_amount,
      balance_amount: this.getBalanceData,
      linked_amount: item.linked_amount,
      isFullyReturned: item.isFullyReturned,
      isPartiallyReturned: item.isPartiallyReturned,
      linkedTxnList: item.linkedTxnList,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      linkPayment: item.linkPayment,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      numberOfItems: item.numberOfItems,
      numberOfSelectedItems: item.numberOfSelectedItems,
      numberOfPendingItems: item.numberOfPendingItems,
      due_date: item.due_date,
      status: item.status,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      rateList: item.rateList,
      jobAssignedEmployeeId: item.jobAssignedEmployeeId,
      jobAssignedEmployeeName: item.jobAssignedEmployeeName,
      jobAssignedEmployeePhoneNumber: item.jobAssignedEmployeePhoneNumber,
      weightIn: item.weightIn,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    await this.deleteData();
  };

  saveData = async (isPrint) => {
    if (!this.saleDetails.job_work_in_invoice_number) {
      this.generateInvoiceNumber();
      return;
    }

    let filteredArray = [];

    for (var i = 0; i < this.items.length; i++) {
      let item = this.items[i];

      if (item.item_name === '') {
        continue;
      }

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

      if (item.mrp_before_tax === null || item.mrp_before_tax === '') {
        item.mrp_before_tax = 0;
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

      if (item.taxIncluded === null || item.taxIncluded === '') {
        item.taxIncluded = false;
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

      if (item.returnedQty === null || item.returnedQty === '') {
        item.returnedQty = 0;
      }

      if (item.stockQty === null || item.stockQty === '') {
        item.stockQty = 0;
      }

      if (item.discount_amount === null || item.discount_amount === '') {
        item.discount_amount = 0;
      }

      if (item.discount_percent === null || item.discount_percent === '') {
        item.discount_percent = 0;
      }

      if (
        item.discount_amount_per_item === null ||
        item.discount_amount_per_item === ''
      ) {
        item.discount_amount_per_item = 0;
      }

      if (
        !item.product_id ||
        item.product_id === '' ||
        item.product_id.length === 0
      ) {
        item.product_id = await this.generateProductId();
      }

      if (
        item.makingChargePercent === null ||
        item.makingChargePercent === ''
      ) {
        item.makingChargePercent = 0;
      }

      if (item.makingChargeAmount === null || item.makingChargeAmount === '') {
        item.makingChargeAmount = 0;
      }

      if (
        item.makingChargePerGramAmount === null ||
        item.makingChargePerGramAmount === ''
      ) {
        item.makingChargePerGramAmount = 0;
      }

      if (item.isSelected === null || item.isSelected === '') {
        item.isSelected = false;
      }

      if (
        item.makingChargeIncluded === '' ||
        item.makingChargeIncluded === null
      ) {
        item.makingChargeIncluded = false;
      }

      if (
        item.pricePerGram === null ||
        item.pricePerGram === '' ||
        item.pricePerGram === undefined
      ) {
        item.pricePerGram = 0;
      }

      if (
        item.stoneWeight === null ||
        item.stoneWeight === '' ||
        item.stoneWeight === undefined
      ) {
        item.stoneWeight = 0;
      }

      if (
        item.stoneCharge === null ||
        item.stoneCharge === '' ||
        item.stoneCharge === undefined
      ) {
        item.stoneCharge = 0;
      }

      if (item.hsn !== null || item.hsn !== '' || item.hsn !== undefined) {
        item.hsn = item.hsn ? item.hsn.toString() : '';
      } else {
        item.hsn = '';
      }

      if (
        item.freeQty === null ||
        item.freeQty === '' ||
        item.freeQty === undefined
      ) {
        item.freeQty = 0;
      }

      if (
        item.itemNumber === null ||
        item.itemNumber === '' ||
        item.itemNumber === undefined
      ) {
        item.itemNumber = 0;
      }

      if (
        item.unitConversionQty === null ||
        item.unitConversionQty === '' ||
        item.unitConversionQty === undefined
      ) {
        item.unitConversionQty = 0;
      }

      if (
        item.originalMrpWithoutConversionQty === null ||
        item.originalMrpWithoutConversionQty === '' ||
        item.originalMrpWithoutConversionQty === undefined
      ) {
        item.originalMrpWithoutConversionQty = 0;
      }

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

      if (item.mrp_before_tax === null || item.mrp_before_tax === '') {
        item.mrp_before_tax = 0;
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

      if (item.taxIncluded === null || item.taxIncluded === '') {
        item.taxIncluded = false;
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

      if (item.returnedQty === null || item.returnedQty === '') {
        item.returnedQty = 0;
      }

      if (item.stockQty === null || item.stockQty === '') {
        item.stockQty = 0;
      }

      if (item.discount_amount === null || item.discount_amount === '') {
        item.discount_amount = 0;
      }

      if (item.discount_percent === null || item.discount_percent === '') {
        item.discount_percent = 0;
      }

      if (
        item.discount_amount_per_item === null ||
        item.discount_amount_per_item === ''
      ) {
        item.discount_amount_per_item = 0;
      }

      if (
        !item.product_id ||
        item.product_id === '' ||
        item.product_id.length === 0
      ) {
        item.product_id = await this.generateProductId();
      }

      if (
        item.makingChargePercent === null ||
        item.makingChargePercent === ''
      ) {
        item.makingChargePercent = 0;
      }

      if (item.makingChargeAmount === null || item.makingChargeAmount === '') {
        item.makingChargeAmount = 0;
      }

      if (
        item.makingChargePerGramAmount === null ||
        item.makingChargePerGramAmount === ''
      ) {
        item.makingChargePerGramAmount = 0;
      }

      if (item.isSelected === null || item.isSelected === '') {
        item.isSelected = false;
      }

      if (
        item.makingChargeIncluded === '' ||
        item.makingChargeIncluded === null
      ) {
        item.makingChargeIncluded = false;
      }

      if (
        item.pricePerGram === null ||
        item.pricePerGram === '' ||
        item.pricePerGram === undefined
      ) {
        item.pricePerGram = 0;
      }

      if (
        item.stoneWeight === null ||
        item.stoneWeight === '' ||
        item.stoneWeight === undefined
      ) {
        item.stoneWeight = 0;
      }

      if (
        item.stoneCharge === null ||
        item.stoneCharge === '' ||
        item.stoneCharge === undefined
      ) {
        item.stoneCharge = 0;
      }

      if (item.hsn !== null || item.hsn !== '' || item.hsn !== undefined) {
        item.hsn = item.hsn ? item.hsn.toString() : '';
      } else {
        item.hsn = '';
      }

      if (
        item.freeQty === null ||
        item.freeQty === '' ||
        item.freeQty === undefined
      ) {
        item.freeQty = 0;
      }

      if (
        item.unitConversionQty === null ||
        item.unitConversionQty === '' ||
        item.unitConversionQty === undefined
      ) {
        item.unitConversionQty = 0;
      }

      if (
        item.originalMrpWithoutConversionQty === null ||
        item.originalMrpWithoutConversionQty === '' ||
        item.originalMrpWithoutConversionQty === undefined
      ) {
        item.originalMrpWithoutConversionQty = 0;
      }

      if (
        item.mfDate === null ||
        item.mfDate === '' ||
        item.mfDate === undefined
      ) {
        item.mfDate = null;
      }

      if (
        item.expiryDate === null ||
        item.expiryDate === '' ||
        item.expiryDate === undefined
      ) {
        item.expiryDate = null;
      }

      if (
        item.originalDiscountPercent === null ||
        item.originalDiscountPercent === '' ||
        item.originalDiscountPercent === undefined
      ) {
        item.originalDiscountPercent = 0;
      }

      if (
        item.itemNumber === null ||
        item.itemNumber === '' ||
        item.itemNumber === undefined
      ) {
        item.itemNumber = 0;
      }

      filteredArray.push(item);
    }

    this.items = filteredArray;

    if (
      this.saleDetails.discount_amount === null ||
      this.saleDetails.discount_amount === ''
    ) {
      this.saleDetails.discount_amount = 0;
    }

    if (
      this.saleDetails.discount_percent === null ||
      this.saleDetails.discount_percent === ''
    ) {
      this.saleDetails.discount_percent = 0;
    }

    if (
      this.saleDetails.discountPercentForAllItems === null ||
      this.saleDetails.discountPercentForAllItems === ''
    ) {
      this.saleDetails.discountPercentForAllItems = 0;
    }

    if (
      this.saleDetails.packing_charge === null ||
      this.saleDetails.packing_charge === ''
    ) {
      this.saleDetails.packing_charge = 0;
    }

    if (
      this.saleDetails.shipping_charge === null ||
      this.saleDetails.shipping_charge === ''
    ) {
      this.saleDetails.shipping_charge = 0;
    }

    if (
      this.saleDetails.received_amount === null ||
      this.saleDetails.received_amount === ''
    ) {
      this.saleDetails.received_amount = 0;
    }

    this.saleDetails.balance_amount = parseFloat(
      this.saleDetails.balance_amount
    );

    if (
      this.saleDetails.balance_amount === null ||
      this.saleDetails.balance_amount === ''
    ) {
      this.saleDetails.balance_amount = 0;
    }

    if (
      this.saleDetails.total_amount === null ||
      this.saleDetails.total_amount === ''
    ) {
      this.saleDetails.total_amount = 0;
    }

    if (
      this.saleDetails.round_amount === null ||
      this.saleDetails.round_amount === ''
    ) {
      this.saleDetails.round_amount = 0;
    }

    if (
      this.saleDetails.is_roundoff === null ||
      this.saleDetails.is_roundoff === ''
    ) {
      this.saleDetails.is_roundoff = false;
    }

    if (
      this.saleDetails.customer_payable === null ||
      this.saleDetails.customer_payable === ''
    ) {
      this.saleDetails.customer_payable = false;
    }

    if (
      this.saleDetails.is_credit === null ||
      this.saleDetails.is_credit === ''
    ) {
      this.saleDetails.is_credit = true;
    }

    if (
      this.saleDetails.linked_amount === null ||
      this.saleDetails.linked_amount === ''
    ) {
      this.saleDetails.linked_amount = 0;
    }

    if (
      this.saleDetails.isPartiallyReturned === null ||
      this.saleDetails.isPartiallyReturned === ''
    ) {
      this.saleDetails.isPartiallyReturned = false;
    }

    if (
      this.saleDetails.isFullyReturned === null ||
      this.saleDetails.isFullyReturned === ''
    ) {
      this.saleDetails.isFullyReturned = false;
    }

    if (
      this.saleDetails.linkPayment === null ||
      this.saleDetails.linkPayment === ''
    ) {
      this.saleDetails.linkPayment = false;
    }

    if (
      this.saleDetails.numberOfItems === null ||
      this.saleDetails.numberOfItems === ''
    ) {
      this.saleDetails.numberOfItems = 0;
    }

    if (
      this.saleDetails.numberOfSelectedItems === null ||
      this.saleDetails.numberOfSelectedItems === ''
    ) {
      this.saleDetails.numberOfSelectedItems = 0;
    }

    if (
      this.saleDetails.numberOfPendingItems === null ||
      this.saleDetails.numberOfPendingItems === ''
    ) {
      this.saleDetails.numberOfPendingItems = 0;
    }

    if (this.saleDetails.status === null || this.saleDetails.status === '') {
      this.saleDetails.status = 'open';
    }

    if (
      this.saleDetails.weightIn === null ||
      this.saleDetails.weightIn === ''
    ) {
      this.saleDetails.weightIn = 0;
    }

    if (this.items.length > 0) {
      if (this.isUpdate) {
        await this.updateSaleInformation(isPrint);
      } else {
        await this.addSaleInformation(isPrint);
      }
    }
  };

  addSaleInformation = async (isPrint) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    this.saleDetails.businessId = businessData.businessId;
    this.saleDetails.businessCity = businessData.businessCity;

    this.saleDetails.balance_amount = this.getBalanceData;

    if (
      this.saleDetails.sequenceNumber === '' ||
      this.saleDetails.sequenceNumber === undefined
    ) {
      await this.getSequenceNumber(
        this.saleDetails.invoice_date,
        this.saleDetails.job_work_in_invoice_number
      );
    }

    if (this.saleDetails.sequenceNumber === '0') {
      this.saleDetails.sequenceNumber = '';
      this.handleCloseJobWorkInLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    /**
     * calculate number of items, selected items and pending items
     */

    let numberOfItems = 0;
    let numberOfSelectedItems = 0;
    let numberOfPendingItems = 0;

    for (let item of this.items) {
      numberOfItems++;
      if (item.isSelected === true) {
        numberOfSelectedItems++;
      } else {
        numberOfPendingItems++;
      }
    }

    this.saleDetails.numberOfItems = numberOfItems;
    this.saleDetails.numberOfSelectedItems = numberOfSelectedItems;
    this.saleDetails.numberOfPendingItems = numberOfPendingItems;

    /**
     * save into sales table
     */
    const InsertDoc = {
      item_list: this.items,
      ...this.saleDetails
    };

    /**
     * updated date
     */
    InsertDoc.updatedAt = Date.now();
    /**
     * remove fields which are not required
     */
    delete InsertDoc['customer_payable'];
    // delete InsertDoc['linkPayment'];

    InsertDoc.posId = parseFloat(businessData.posDeviceId);

    if (this.isRestore) {
      InsertDoc.employeeId = this.saleDetails.employeeId;
    } else {
      try {
        /**
         * add employee information
         */
        InsertDoc.employeeId = JSON.parse(
          localStorage.getItem('loginDetails')
        ).username;
      } catch (e) {
        console.error(' Error: ', e.message);
      }
    }
    /**
     * save to all txn table
     */
    await allTxn.saveTxnFromJobWorkIn(InsertDoc, db);

    if (this.isRestore) {
      await this.markJobWorkInRestored();
    }

    let userAction = 'Save';

    if (this.isRestore) {
      userAction = 'Restore';
    }

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.job_work_in_invoice_number,
      InsertDoc.sequenceNumber,
      'JWI',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.invoice_date
    );

    try {
      await db.jobworkin.insert(InsertDoc).then((data) => {
        // console.log('data Inserted:', data);

        if (isPrint) {
          if (
            this.salesInvoiceThermal &&
            this.salesInvoiceThermal.boolDefault
          ) {
            sendContentForThermalPrinter(
              '',
              this.salesInvoiceThermal,
              data,
              this.jobWorkInSettingsData,
              'Job Work In'
            );
          }
        }

        this.handleCloseJobWorkInLoadingMessage();
        if (
          this.salesInvoiceRegular &&
          this.salesInvoiceRegular.boolDefault &&
          isPrint
        ) {
          this.printJobWorkInData = InsertDoc;

          this.resetAllData();
          this.closeDialog();
          // this.isSaveOrUpdateOrDeleteClicked = false;
          if (this.saveAndNew) {
            this.saveAndNew = false;
            this.openForNewJobWorkIn();
          }

          runInAction(async () => {
            this.isSalesList = true;
            this.invoiceData = {};
          });

          this.handleOpenJobWorkInPrintSelectionAlertMessage();
        } else {
          this.resetAllData();
          this.closeDialog();
          // this.isSaveOrUpdateOrDeleteClicked = false;
          if (this.saveAndNew) {
            this.saveAndNew = false;
            this.openForNewJobWorkIn();
          }

          runInAction(async () => {
            this.isSalesList = true;
            this.invoiceData = {};
          });
        }
      });
    } catch (err) {
      //save to audit
      await audit.addAuditEvent(
        InsertDoc.job_work_in_invoice_number,
        InsertDoc.sequenceNumber,
        'JWI',
        userAction,
        JSON.stringify(InsertDoc),
        err.message ? err.message : 'JWI Failed',
        InsertDoc.invoice_date
      );
      this.handleCloseJobWorkInLoadingMessage();
      this.handleOpenJobWorkInErrorAlertMessage();
    }
  };

  getSequenceNumber = async (date, id) => {
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      runInAction(() => {
        this.invoiceData.multiDeviceBillingSupport =
          transSettings.multiDeviceBillingSupport;
        this.invoiceData.prefix =
          transSettings.jobWorkOrderIn.prefixSequence &&
          transSettings.jobWorkOrderIn.prefixSequence.length > 0
            ? transSettings.jobWorkOrderIn.prefixSequence[0].prefix
            : '';
      });
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      runInAction(() => {
        this.invoiceData.prefix = localStorage.getItem('deviceName');
        this.invoiceData.subPrefix = 'JWI';
      });
      isOnline = false;
    }

    this.saleDetails.sequenceNumber = await sequence.getFinalSequenceNumber(
      this.invoiceData,
      'Job Work In',
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
  };

  linkPayment = async (db) => {
    console.log('inside link payment');

    /**
     * follow below + and - rule to link payment
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
     * if any of + having payment link then take all - entry tables for balance > 0
     *
     * and reduce their balances and viseversa.
     */
    for (const item of this.paymentLinkTransactions) {
      item.linkedAmount = parseFloat(item.linkedAmount) || 0;

      // console.log('item::', toJS(item));

      if (parseFloat(item.linkedAmount) > 0) {
        const businessData = await Bd.getBusinessData();

        const appId = businessData.posDeviceId;
        const timestamp = Math.floor(Date.now() / 60000);
        const id = _uniqueId('lp');

        let transactionNumber = `${id}${appId}${timestamp}`;

        if (item.paymentType === 'Payment In') {
          /**
           * update paymnet in table
           */
          // console.log('paymentin loop');
          await this.updatePaymentInWithTxn(
            db,
            item,
            this.saleDetails,
            transactionNumber
          );

          linkPayment.updateLinkPaymentAllTxnTable(db, item);
        } else if (item.paymentType === 'Sales Return') {
          // console.log('salesreturn loop');
          /**
           * update salesreturn table
           */
          await this.updateSalesReturnWithTxn(
            db,
            item,
            this.saleDetails,
            transactionNumber
          );

          linkPayment.updateLinkPaymentAllTxnTable(db, item);
        } else if (item.paymentType === 'Purchases') {
          // console.log('purchases loop');
          /**
           * update Purchases table
           */
          await this.updatePurchasesWithTxn(
            db,
            item,
            this.saleDetails,
            transactionNumber
          );

          linkPayment.updateLinkPaymentAllTxnTable(db, item);
        } else if (item.paymentType === 'Opening Payable Balance') {
          // console.log('purchases loop');
          /**
           * update alltxn table table
           */
          await linkPayment.updateLinkPaymentAllTxnTable(db, item);
        }

        let saleLinkedTxn = {
          linkedId: item.id,
          date: '',
          linkedAmount: item.linkedAmount,
          paymentType: item.paymentType,
          transactionNumber: transactionNumber,
          sequenceNumber: item.sequenceNumber
        };

        this.saleDetails.linkedTxnList.push(saleLinkedTxn);
      }
    }

    this.paymentLinkTransactions = [];
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
    for (const item of this.saleDetails.linkedTxnList) {
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

  updatePaymentInWithTxn = async (db, doc, saleDetails, transactionNumber) => {
    const businessData = await Bd.getBusinessData();

    const paymentInData = await db.paymentin
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              receiptNumber: { $eq: doc.receiptNumber }
            },
            { customerId: { $eq: doc.customerId } }
          ]
        }
      })
      .exec();

    if (paymentInData) {
      const changeData = await (async (oldData) => {
        if (parseFloat(oldData.balance) > 0) {
          if (oldData.balance > doc.linkedAmount) {
            oldData.balance =
              parseFloat(oldData.balance) - parseFloat(doc.linkedAmount);
          } else {
            oldData.balance = 0;
          }
          /**
           * add transaction data
           */

          let linkedTxn = {
            linkedId: saleDetails.job_work_in_invoice_number,
            date: '',
            linkedAmount: doc.linkedAmount,
            paymentType: 'Job Work In',
            transactionNumber: transactionNumber,
            sequenceNumber: saleDetails.sequenceNumber
          };

          if (typeof oldData.linkedTxnList === 'undefined') {
            oldData.linkedTxnList = [];
          }
          oldData.linked_amount =
            (parseFloat(oldData.linked_amount) || 0) + doc.linkedAmount;

          oldData.linkedTxnList.push(linkedTxn);
        }

        oldData.updatedAt = Date.now();
        return oldData;
      });
      await paymentInData.atomicUpdate(changeData);
    }
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
            { customerId: { $eq: saleDetails.customer_id } }
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
            if (
              !(element.linkedId === saleDetails.job_work_in_invoice_number)
            ) {
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

  updateSalesReturnWithTxn = async (
    db,
    doc,
    saleDetails,
    transactionNumber
  ) => {
    const businessData = await Bd.getBusinessData();

    const salesReturnData = await db.salesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              sales_return_number: { $eq: doc.job_work_in_invoice_number }
            },
            { customer_id: { $eq: doc.customer_id } }
          ]
        }
      })
      .exec();

    const changeData = await (async (oldData) => {
      if (parseFloat(oldData.balance_amount) > 0) {
        if (oldData.balance_amount > doc.linkedAmount) {
          oldData.balance_amount =
            parseFloat(oldData.balance_amount) - parseFloat(doc.linkedAmount);
        } else {
          oldData.balance_amount = 0;
        }

        /**
         * add transaction data
         */

        let linkedTxn = {
          linkedId: saleDetails.job_work_in_invoice_number,
          date: '',
          linkedAmount: doc.linkedAmount,
          paymentType: 'Job Work In',
          transactionNumber: transactionNumber,
          sequenceNumber: saleDetails.sequenceNumber
        };

        if (typeof oldData.linkedTxnList === 'undefined') {
          oldData.linkedTxnList = [];
        }
        oldData.linked_amount =
          (parseFloat(oldData.linked_amount) || 0) + doc.linkedAmount;
        oldData.linkedTxnList.push(linkedTxn);
      }

      oldData.updatedAt = Date.now();
      return oldData;
    });

    if (salesReturnData) {
      await salesReturnData.atomicUpdate(changeData);
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
              sales_return_number: { $eq: doc.linkedId }
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
            if (element.linkedId !== saleDetails.job_work_in_invoice_number) {
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

  updatePurchasesWithTxn = async (db, doc, saleDetails, transactionNumber) => {
    const businessData = await Bd.getBusinessData();

    const purchaseData = await db.purchases
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_number: { $eq: doc.bill_number }
            },
            { vendor_id: { $eq: doc.vendor_id } },
            { bill_date: { $eq: doc.bill_date } }
          ]
        }
      })
      .exec();

    const changeData = await (async (oldData) => {
      // console.log('old data:::', oldData);
      if (parseFloat(oldData.balance_amount) > 0) {
        // console.log('balance is more than 0');

        if (oldData.balance_amount > doc.linkedAmount) {
          oldData.balance_amount =
            parseFloat(oldData.balance_amount) - parseFloat(doc.linkedAmount);
        } else {
          oldData.balance_amount = 0;
        }

        /**
         * add transaction data
         */

        let linkedTxn = {
          linkedId: saleDetails.job_work_in_invoice_number,
          date: '',
          linkedAmount: doc.linkedAmount,
          paymentType: 'Job Work In',
          transactionNumber: transactionNumber,
          sequenceNumber: saleDetails.sequenceNumber
        };

        if (typeof oldData.linkedTxnList === 'undefined') {
          oldData.linkedTxnList = [];
        }
        oldData.linked_amount =
          (parseFloat(oldData.linked_amount) || 0) + doc.linkedAmount;
        oldData.linkedTxnList.push(linkedTxn);
      }

      oldData.updatedAt = Date.now();
      return oldData;
    });

    if (purchaseData) {
      await purchaseData.atomicUpdate(changeData);
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
          if (element.linkedId !== saleDetails.job_work_in_invoice_number) {
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

  getPaymentInData = async (db, id) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.paymentin
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                customerId: { $eq: id }
              },
              { balance: { $gt: 0.0 } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            resolve(`done `);
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Payment In';
            finalData.id = item.receiptNumber;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              this.paymentLinkTransactions.push(finalData);
            }
          });

          resolve(`done `);
        });
    });
  };

  getPaymentInLinkedData = async (db, saleDetails) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.paymentin
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                customerId: { $eq: saleDetails.customer_id }
              },
              {
                linkedTxnList: {
                  $elemMatch: {
                    linkedId: { $eq: saleDetails.job_work_in_invoice_number }
                  }
                }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            resolve(`done `);
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Payment In';
            finalData.id = item.receiptNumber;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentUnLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              this.paymentUnLinkTransactions.push(finalData);
            }
          });
          resolve(`done `);
        });
    });
  };

  getSalesReturnData = async (db, id) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.salesreturn
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                customer_id: { $eq: id }
              },
              { balance_amount: { $gt: 0 } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            resolve(`done `);
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Sales Return';
            finalData.id = item.sales_return_number;
            finalData.total = item.total_amount;
            finalData.balance = item.balance_amount;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              this.paymentLinkTransactions.push(finalData);
            }
          });

          resolve(`done `);
        });
    });
  };

  getSalesReturnLinkedData = async (db, saleDetails) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.salesreturn
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                customer_id: { $eq: saleDetails.customer_id }
              },
              {
                linkedTxnList: {
                  $elemMatch: {
                    linkedId: { $eq: saleDetails.job_work_in_invoice_number }
                  }
                }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            resolve(`done `);
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Sales Return';
            finalData.id = item.sales_return_number;
            finalData.total = item.total_amount;
            finalData.balance = item.balance_amount;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentUnLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              this.paymentUnLinkTransactions.push(finalData);
            }
          });

          resolve(`done `);
        });
    });
  };

  getOpeningBalanceData = async (db, id) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.alltransactions
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                $or: [{ customerId: { $eq: id } }, { vendorId: { $eq: id } }]
              },
              {
                txnType: { $eq: 'Opening Payable Balance' }
              },
              { balance: { $gt: 0 } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            resolve(`done `);
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Opening Payable Balance';
            finalData.id = item.id;
            finalData.total = item.amount;
            finalData.balance = item.balance;
            finalData.date = item.date;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              this.paymentLinkTransactions.push(finalData);
            }
          });
          resolve(`done `);
        });
    });
  };

  getCreditPurchaseData = async (db, id) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.purchases
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                vendor_id: { $eq: id }
              },
              { balance_amount: { $gt: 0 } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            resolve(`done `);
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Purchases';
            finalData.id = item.bill_number;
            finalData.total = item.total_amount;
            finalData.balance = item.balance_amount;
            finalData.date = item.bill_date;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              this.paymentLinkTransactions.push(finalData);
            }
          });
          resolve(`done `);
        });
    });
  };

  getOpeningBalanceLinkedData = async (db, openingBalanceLinkedId) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.alltransactions
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { id: { $eq: openingBalanceLinkedId } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            resolve(`done `);
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Opening Payable Balance';
            finalData.id = item.id;
            finalData.total = item.amount;
            finalData.balance = item.balance;
            finalData.date = item.date;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentUnLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              this.paymentUnLinkTransactions.push(finalData);
            }
          });

          resolve(`done `);
        });
    });
  };

  getCreditPurchaseLinkedData = async (db, saleDetails) => {
    // console.log('getCreditPurchaseLinkedData');
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.purchases
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                vendor_id: { $eq: saleDetails.customer_id }
              },
              {
                linkedTxnList: {
                  $elemMatch: {
                    linkedId: { $eq: saleDetails.job_work_in_invoice_number }
                  }
                }
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            resolve(`done `);
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Purchases';
            finalData.id = item.bill_number;
            finalData.total = item.total_amount;
            finalData.balance = item.balance_amount;
            finalData.date = item.bill_date;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentUnLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              this.paymentUnLinkTransactions.push(finalData);
            }
          });
          resolve(`done `);
        });
    });
  };

  updateSaleInformation = async (isPrint) => {
    if (
      this.existingSaleData.job_work_in_invoice_number &&
      this.existingSaleData.job_work_in_invoice_number === 0
    ) {
      // console.log('invoice_number not present');
      // Cannot delete if item Number is not available
      return;
    }

    /**
     * updated date
     */
    this.saleDetails.updatedAt = Date.now();
    /**
     * if sale is partially returned or fully returned then sale update is in valid
     */
    if (
      this.saleDetails.isFullyReturned ||
      this.saleDetails.isPartiallyReturned
    ) {
      alert('Partial/Full returned Sale is not eligible to Edit');

      // this.isSaveOrUpdateOrDeleteClicked = false;

      return;
    }

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.jobworkin.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            job_work_in_invoice_number: {
              $eq: this.existingSaleData.job_work_in_invoice_number
            }
          }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Sales data is found so cannot update any information
          return;
        }

        /**
         * delete index field
         */
        this.items.forEach(async (item) => {
          delete item['index'];
        });

        let updateData = this.saleDetails;
        delete updateData['customer_payable'];

        updateData.updatedAt = Date.now();

        /**
         * calculate number of items, selected items and pending items
         */

        let numberOfItems = 0;
        let numberOfSelectedItems = 0;
        let numberOfPendingItems = 0;

        for (let item of this.items) {
          numberOfItems++;
          if (item.isSelected === true) {
            numberOfSelectedItems++;
          } else {
            numberOfPendingItems++;
          }
        }

        updateData.numberOfItems = numberOfItems;
        updateData.numberOfSelectedItems = numberOfSelectedItems;
        updateData.numberOfPendingItems = numberOfPendingItems;

        let txnData = this.saleDetails;
        txnData.item_list = this.items;

        //add to all txn table
        await allTxn.deleteAndSaveTxnFromJobWorkIn(
          this.existingSaleData,
          txnData,
          db
        );

        let auditData = {};

        auditData = { ...updateData };
        auditData.item_list = this.items;

        audit.addAuditEvent(
          updateData.job_work_in_invoice_number,
          updateData.sequenceNumber,
          'JWI',
          'Update',
          JSON.stringify(auditData),
          '',
          updateData.invoice_date
        );

        await query
          .update({
            $set: {
              item_list: this.items,
              ...updateData
            }
          })
          .then(async () => {
            if (isPrint) {
              if (
                this.salesInvoiceThermal &&
                this.salesInvoiceThermal.boolDefault
              ) {
                sendContentForThermalPrinter(
                  '',
                  this.salesInvoiceThermal,
                  txnData,
                  this.jobWorkInSettingsData,
                  'Job Work In'
                );
              }
            }

            this.handleCloseJobWorkInLoadingMessage();
            if (
              this.salesInvoiceRegular &&
              this.salesInvoiceRegular.boolDefault &&
              isPrint
            ) {
              this.printJobWorkInData = txnData;

              /**
               * make global variables to nulls again
               */
              this.resetAllData();
              this.saleUnLinkedTxnList = [];
              // this.isSaveOrUpdateOrDeleteClicked = false;

              this.closeDialog();
              if (this.saveAndNew) {
                this.saveAndNew = false;
                this.openForNewJobWorkIn();
              }

              runInAction(async () => {
                this.isSalesList = true;
              });

              this.handleOpenJobWorkInPrintSelectionAlertMessage();
            } else {
              /**
               * make global variables to nulls again
               */
              this.resetAllData();
              this.saleUnLinkedTxnList = [];
              // this.isSaveOrUpdateOrDeleteClicked = false;

              this.closeDialog();
              if (this.saveAndNew) {
                this.saveAndNew = false;
                this.openForNewJobWorkIn();
              }

              runInAction(async () => {
                this.isSalesList = true;
              });
            }
          })
          .catch((err) => {
            audit.addAuditEvent(
              updateData.job_work_in_invoice_number,
              updateData.sequenceNumber,
              'JWI',
              'Update',
              JSON.stringify(auditData),
              err.message,
              updateData.invoice_date
            );
            this.handleCloseJobWorkInLoadingMessage();
            this.handleOpenJobWorkInErrorAlertMessage();
          });
      })
      .catch((err) => {
        this.handleCloseJobWorkInLoadingMessage();
        this.handleOpenJobWorkInErrorAlertMessage();
      });
  };

  /**
   * delete sale entry
   */
  deleteData = async (saleDetails, employeeId) => {
    // this.isSaveOrUpdateOrDeleteClicked = true;

    /**
     * if sale is partially returned or fully returned then sale update is in valid
     */
    if (saleDetails.isFullyReturned || saleDetails.isPartiallyReturned) {
      alert('Partial/Full returned Sale is not eligible to Delete');
      return;
    }

    //save to audit
    audit.addAuditEvent(
      saleDetails.job_work_in_invoice_number,
      saleDetails.sequenceNumber,
      'JWI',
      'Delete',
      JSON.stringify(saleDetails),
      '',
      saleDetails.invoice_date
    );

    let DeleteDataDoc = {
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      total: 0,
      balance: 0,
      data: ''
    };

    let restoreJobworkInData = {};
    restoreJobworkInData = this.saleDetails;
    restoreJobworkInData.item_list = this.items;
    restoreJobworkInData.employeeId = employeeId;

    DeleteDataDoc.transactionId = this.saleDetails.job_work_in_invoice_number;
    DeleteDataDoc.sequenceNumber = this.saleDetails.sequenceNumber;
    DeleteDataDoc.transactionType = 'Job Work Order - In';
    DeleteDataDoc.data = JSON.stringify(restoreJobworkInData);
    DeleteDataDoc.total = this.saleDetails.total_amount;
    DeleteDataDoc.balance = this.saleDetails.balance_amount;
    DeleteDataDoc.createdDate = this.saleDetails.invoice_date;

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    const db = await Db.get();

    allTxn.deleteTxnFromJobWorkIn(saleDetails, db);
    const businessData = await Bd.getBusinessData();

    const query = db.jobworkin.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            job_work_in_invoice_number: {
              $eq: saleDetails.job_work_in_invoice_number
            }
          }
        ]
      }
    });
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Sales data is found so cannot delete any information
          return;
        }

        /**
         * delete from sale table
         */
        await query
          .remove()
          .then(async (data) => {
            /**
             * make global variables to nulls again
             */
            this.resetAllData();
            // this.isSaveOrUpdateOrDeleteClicked = false;
          })
          .catch((error) => {
            //save to audit
            audit.addAuditEvent(
              saleDetails.job_work_in_invoice_number,
              saleDetails.sequenceNumber,
              'JWI',
              'Delete',
              JSON.stringify(saleDetails),
              error.message,
              saleDetails.invoice_date
            );
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  get getRoundedAmount() {
    if (!this.saleDetails.is_roundoff) {
      return 0;
    }
    return this.saleDetails.round_amount;
  }

  addNewItem = (status, focusIndexStatus, isBarcode) => {
    if (status) {
      this.addNewRowEnabled = true;
    }
    var lastItem = [];

    if (this.items.length > 0) {
      lastItem = this.items[this.items.length - 1]; // Getting last element
      if (lastItem.qty > 0) {
        this.items.push({
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
          mrp_before_tax: 0,
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
          taxIncluded: false,
          discount_percent: 0,
          discount_amount: 0,
          discount_amount_per_item: 0,
          discount_type: '',
          amount: 0,
          roundOff: 0,
          isEdit: true,
          returnedQty: 0,
          stockQty: 0,
          wastagePercentage: '',
          wastageGrams: '',
          copperGrams: '',
          grossWeight: '',
          netWeight: '',
          purity: '',
          hsn: '',
          makingChargePercent: 0,
          makingChargeAmount: 0,
          makingChargeType: '',
          isSelected: false,
          makingChargePerGramAmount: 0,
          makingChargeIncluded: false,
          pricePerGram: 0,
          stoneWeight: 0,
          stoneCharge: 0,
          serialOrImeiNo: '',
          qtyUnit: '',
          primaryUnit: null,
          secondaryUnit: null,
          unitConversionQty: 0,
          units: [],
          originalMrpWithoutConversionQty: 0,
          mfDate: null,
          expiryDate: null,
          rack: '',
          warehouseData: '',
          batchNumber: '',
          modelNo: '',
          freeQty: 0,
          itemNumber: 0,
          originalDiscountPercent: 0,
          dailyRate: '',
          properties: [],
          hallmarkCharge: 0,
          certificationCharge: 0
        });
        this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;

        this.setEditTable(
          this.enabledRow,
          true,
          focusIndexStatus
            ? isBarcode
              ? Number('6' + this.enabledRow)
              : Number('4' + this.enabledRow)
            : ''
        );
      } else {
        console.log('wtf');
      }
    } else {
      this.items.push({
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
        mrp_before_tax: 0,
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
        taxIncluded: false,
        discount_percent: 0,
        discount_amount: 0,
        discount_amount_per_item: 0,
        discount_type: '',
        amount: 0,
        roundOff: 0,
        isEdit: true,
        returnedQty: 0,
        stockQty: 0,
        wastagePercentage: '',
        wastageGrams: '',
        copperGrams: '',
        grossWeight: '',
        netWeight: '',
        purity: '',
        hsn: '',
        makingChargePercent: 0,
        makingChargeAmount: 0,
        makingChargeType: '',
        isSelected: false,
        makingChargePerGramAmount: 0,
        makingChargeIncluded: false,
        pricePerGram: 0,
        stoneWeight: 0,
        stoneCharge: 0,
        serialOrImeiNo: '',
        qtyUnit: '',
        primaryUnit: null,
        secondaryUnit: null,
        unitConversionQty: 0,
        units: [],
        originalMrpWithoutConversionQty: 0,
        mfDate: null,
        expiryDate: null,
        rack: '',
        warehouseData: '',
        batchNumber: '',
        modelNo: '',
        freeQty: 0,
        itemNumber: 0,
        originalDiscountPercent: 0,
        dailyRate: '',
        properties: [],
        hallmarkCharge: 0,
        certificationCharge: 0
      });
      this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;

      this.setEditTable(
        this.enabledRow,
        true,
        focusIndexStatus
          ? isBarcode
            ? Number('6' + this.enabledRow)
            : Number('4' + this.enabledRow)
          : ''
      );
    }
  };

  deleteItem = (index) => {
    this.items.splice(index, 1);

    this.enabledRow = index > 0 ? index - 1 : 0;

    if (this.items.length > 0) {
      this.setEditTable(this.enabledRow, true, Number('4' + this.enabledRow));
    } else {
      this.FocusLastIndex = 15;
    }
  };

  setItemName = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (value && value.length > 0) {
      this.items[index].item_name = value;
    }
  };

  setItemNameForRandomProduct = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (
      !this.items[index].item_name ||
      this.items[index].item_name.length === 0
    ) {
      if (value && value.length > 0) {
        this.items[index].item_name = value;
      }
    }

    if (this.items && this.items.length > 0) {
      for (var i = 0; i < this.items.length; i++) {
        if (
          this.saleDetails.discountPercentForAllItems > 0 &&
          this.items[i].item_name !== ''
        ) {
          let billdiscount = this.saleDetails.discountPercentForAllItems
            ? parseFloat(this.saleDetails.discountPercentForAllItems)
            : 0;
          this.items[i].discount_percent =
            parseFloat(this.items[i].originalDiscountPercent) + billdiscount;
          this.items[i].discount_type = 'percentage';
          this.getAmount(i);
        } else {
          if (parseFloat(this.items[i].originalDiscountPercent) > 0) {
            this.items[i].discount_percent = parseFloat(
              this.items[i].originalDiscountPercent
            );
          } else {
            this.items[i].discount_percent = this.items[i].discount_percent
              ? this.items[i].discount_percent
              : '';
          }
          this.items[i].discount_type = 'percentage';
          if (this.items[i].discount_percent === '') {
            this.items[i].discount_amount = '';
            this.items[i].discount_amount_per_item = '';
          }
          this.getAmount(i);
        }
      }
    }
  };

  setItemUnit = (index, value) => {
    if (!this.items) {
      return;
    }

    if (!this.items[index]) {
      return;
    }

    if (value === this.items[index].qtyUnit) {
      return;
    }

    this.items[index].qtyUnit = value;

    if (
      this.items[index].secondaryUnit &&
      this.items[index].secondaryUnit.fullName === this.items[index].qtyUnit
    ) {
      this.items[index].mrp =
        this.items[index].mrp / this.items[index].unitConversionQty;
    } else if (
      this.items[index].primaryUnit &&
      this.items[index].primaryUnit.fullName === this.items[index].qtyUnit
    ) {
      this.items[index].mrp = this.items[index].originalMrpWithoutConversionQty;
    } else {
      this.items[index].mrp = this.items[index].originalMrpWithoutConversionQty;
    }
    this.getAmount(index);
  };

  setTaxIncluded = (index) => {
    if (this.items[index].taxIncluded === true) {
      this.items[index].taxIncluded = false;
    } else {
      this.items[index].taxIncluded = true;
    }

    this.getAmount(index);
  };

  setCGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].cgst = value ? parseFloat(value) : '';
    this.items[index].sgst = value ? parseFloat(value) : '';

    this.getAmount(index);
  };

  setSGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].cgst = value ? parseFloat(value) : '';
    this.items[index].sgst = value ? parseFloat(value) : '';

    this.getAmount(index);
  };

  setIGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].igst = value ? parseFloat(value) : '';
    this.getAmount(index);
  };

  setCess = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].cess = value ? value : '';
    this.getAmount(index);
  };

  setItemSku = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].sku = value;
  };

  setItemHSN = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].hsn = value;
  };

  setItemBatchNumber = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].batchNumber = value;
  };

  setItemModelNumber = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].modelNo = value;
  };

  setMrp = async (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (parseFloat(value) >= 0) {
      this.items[index].offer_price = parseFloat(value);
      this.items[index].mrp = parseFloat(value);
      this.items[index].originalMrpWithoutConversionQty = parseFloat(value);

      if (this.items[index].qty === 0) {
        this.items[index].qty = 1;
      }

      if (this.items[index].qty) {
        this.getAmount(index);
      }
    } else {
      this.items[index].mrp_before_tax = value ? parseFloat(value) : '';
      this.items[index].mrp = value ? parseFloat(value) : '';
      this.items[index].originalMrpWithoutConversionQty = parseFloat(value);
    }
  };

  setItemBarcode = async (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].barcode = value;

    if (value !== '') {
      /**
       * get product by barcode
       * if match found then add new row
       */
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.businessproduct
        .findOne({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { barcode: { $eq: value } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  {
                    batchData: {
                      $elemMatch: {
                        barcode: { $eq: value }
                      }
                    }
                  }
                ]
              }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          if (!data) {
            // No proudct match found
            return;
          }

          /**
           * handle unit configuration
           */
          let foundBatch;
          let actualProduct = data.toJSON();
          let dataCopy = data.toJSON();
          if (dataCopy.batchData && dataCopy.batchData.length > 0) {
            for (let batch of dataCopy.batchData) {
              if (batch.barcode === value) {
                foundBatch = new BatchData().convertTypes(batch);
                break;
              }
            }

            if (foundBatch) {
              // do nothing
            } else {
              if (
                actualProduct.batchData &&
                actualProduct.batchData.length > 0
              ) {
                let firstBatchData = actualProduct.batchData[0];
                actualProduct.salePrice = parseFloat(firstBatchData.salePrice);
                actualProduct.purchasedPrice = parseFloat(
                  firstBatchData.purchasedPrice
                );

                if (firstBatchData.offerPrice > 0) {
                  actualProduct.offerPrice = parseFloat(
                    firstBatchData.offerPrice
                  );
                } else {
                  actualProduct.offerPrice = parseFloat(
                    firstBatchData.salePrice
                  );
                }
              }

              let finalSalePrice = parseFloat(actualProduct.salePrice);
              let finalPurchasedPrice = parseFloat(
                actualProduct.purchasedPrice
              );
              let finalOfferPrice = parseFloat(actualProduct.offerPrice);
              let unitQty = parseFloat(actualProduct.unitQty);

              actualProduct.salePrice = finalSalePrice;
              actualProduct.purchasedPrice = finalPurchasedPrice;
              actualProduct.offerPrice = finalOfferPrice;

              if (unitQty && unitQty > 1) {
                finalPurchasedPrice = finalPurchasedPrice * unitQty;
                finalSalePrice = finalSalePrice * unitQty;
                finalOfferPrice = finalOfferPrice * unitQty;

                actualProduct.salePrice = finalSalePrice;
                actualProduct.purchasedPrice = finalPurchasedPrice;
                actualProduct.offerPrice = finalOfferPrice;
              }
            }
          } else {
            if (actualProduct.batchData && actualProduct.batchData.length > 0) {
              let firstBatchData = actualProduct.batchData[0];
              actualProduct.salePrice = parseFloat(firstBatchData.salePrice);
              actualProduct.purchasedPrice = parseFloat(
                firstBatchData.purchasedPrice
              );

              if (firstBatchData.offerPrice > 0) {
                actualProduct.offerPrice = parseFloat(
                  firstBatchData.offerPrice
                );
              } else {
                actualProduct.offerPrice = parseFloat(firstBatchData.salePrice);
              }
            }

            let finalSalePrice = parseFloat(actualProduct.salePrice);
            let finalPurchasedPrice = parseFloat(actualProduct.purchasedPrice);
            let finalOfferPrice = parseFloat(actualProduct.offerPrice);
            let unitQty = parseFloat(actualProduct.unitQty);

            if (unitQty && unitQty > 1) {
              finalPurchasedPrice = finalPurchasedPrice * unitQty;
              finalSalePrice = finalSalePrice * unitQty;
              finalOfferPrice = finalOfferPrice * unitQty;

              actualProduct.salePrice = finalSalePrice;
              actualProduct.purchasedPrice = finalPurchasedPrice;
              actualProduct.offerPrice = finalOfferPrice;
            }
          }

          if (foundBatch) {
            this.converToSelectedProduct(actualProduct);
            this.selectedIndex = index;
            runInAction(() => {
              this.items[index].item_name = actualProduct.name;
              this.items[index].barcode = actualProduct.barcode;
              this.items[index].sku = actualProduct.sku;
              this.items[index].product_id = actualProduct.productId;
              this.items[index].description = actualProduct.description;
              this.items[index].imageUrl = actualProduct.imageUrl;
              this.items[index].cgst = actualProduct.cgst;
              this.items[index].sgst = actualProduct.sgst;
              this.items[index].igst = actualProduct.igst;
              this.items[index].cess = actualProduct.cess;
              this.items[index].taxIncluded = actualProduct.taxIncluded;
              this.items[index].taxType = actualProduct.taxType;
              this.items[index].stockQty = actualProduct.stockQty;
              this.items[index].hsn = actualProduct.hsn;

              // categories
              this.items[index].categoryLevel2 =
                actualProduct.categoryLevel2.name;
              this.items[index].categoryLevel2DisplayName =
                actualProduct.categoryLevel2.displayName;
              this.items[index].categoryLevel3 =
                actualProduct.categoryLevel3.name;
              this.items[index].categoryLevel3DisplayName =
                actualProduct.categoryLevel3.displayName;

              this.items[index].brandName = actualProduct.brandName;

              this.items[index].mfDate = actualProduct.mfDate;
              this.items[index].expiryDate = actualProduct.expiryDate;
              this.items[index].rack = actualProduct.rack;
              this.items[index].warehouseData = actualProduct.warehouseData;
              this.items[index].modelNo = actualProduct.modelNo;

              // units addition
              this.items[index].primaryUnit = actualProduct.primaryUnit;
              this.items[index].secondaryUnit = actualProduct.secondaryUnit;
              this.items[index].units =
                actualProduct.units && actualProduct.units.length > 2
                  ? actualProduct.units.slice(0, 2)
                  : actualProduct.units;
              this.items[index].unitConversionQty =
                actualProduct.unitConversionQty;

              if (actualProduct.cgst > 0) {
                this.items[index].cgst = actualProduct.cgst;
              }
              if (actualProduct.sgst > 0) {
                this.items[index].sgst = actualProduct.sgst;
              }
            });
            this.setQuantity(index, 1);
            this.selectProductFromBatch(foundBatch, index, true);
          } else {
            this.selectProduct(actualProduct, index, true);
          }
        });
    } else {
      if (
        this.items[index].amount === 0 &&
        this.items[index].qty === 0 &&
        this.items[index].mrp === 0
      ) {
        // do nothing and retain the row added
      } else {
        this.deleteItem(index);
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
      this.items[index].freeQty = value ? parseFloat(value) : '';
    } else {
      this.items[index].freeQty = '';
    }
  };

  setOffer = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    this.items[index].offer_price = value;
    this.getAmount(index);
  };

  // setReceived = (value) => {
  //   if (!this.saleDetails) {
  //     return;
  //   }

  //   runInAction(() => {
  //     this.saleDetails.received_amount = value ? parseFloat(value) : '';
  //     this.saleDetails.balance_amount = this.getBalanceData;
  //   });
  // };

  toggleRoundOff = () => {
    if (!this.saleDetails) {
      return;
    }
    this.saleDetails.is_roundoff = !this.saleDetails.is_roundoff;
  };

  setQuantity = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    // console.log(this.items[index]);
    if (parseFloat(value) > 0) {
      this.items[index].qty = value ? parseFloat(value) : '';
      this.getAmount(index);
    } else {
      this.items[index].qty = '';
      this.getAmount(index);
    }
  };

  setDiscount = (value) => {
    if (!this.saleDetails) {
      return;
    }

    runInAction(() => {
      this.saleDetails.discount_type = 'percentage';
      this.saleDetails.discount_percent = value ? parseFloat(value) : '';
    });
  };

  setDiscountPercentForAllItems = (value) => {
    this.saleDetails.discountPercentForAllItems = value
      ? parseFloat(value)
      : '';

    if (this.items && this.items.length > 0) {
      for (var i = 0; i < this.items.length; i++) {
        if (value !== '' && this.items[i].item_name !== '') {
          let billdiscount = parseFloat(value);
          this.items[i].discount_percent =
            parseFloat(this.items[i].originalDiscountPercent) + billdiscount;
          this.items[i].discount_type = 'percentage';
          this.getAmount(i);
        } else {
          if (parseFloat(this.items[i].originalDiscountPercent) > 0) {
            this.items[i].discount_percent = parseFloat(
              this.items[i].originalDiscountPercent
            );
          } else {
            this.items[i].discount_percent = '';
          }
          this.items[i].discount_type = 'percentage';
          if (this.items[i].discount_percent === '') {
            this.items[i].discount_amount = '';
            this.items[i].discount_amount_per_item = '';
          }
          this.getAmount(i);
        }
      }
    }
  };

  setDiscountAmount = (value) => {
    if (!this.saleDetails) {
      return;
    }

    runInAction(() => {
      this.saleDetails.discount_type = 'amount';
      this.saleDetails.discount_amount = value ? parseFloat(value) : '';
    });
  };

  setDiscountType = (value) => {
    if (!this.saleDetails) {
      return;
    }
    runInAction(() => {
      if (value === '%') {
        this.saleDetails.discount_type = 'percentage';
      } else {
        this.saleDetails.discount_type = 'amount';
      }
    });
  };

  setItemDiscount = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].discount_percent = value ? parseFloat(value) : '';
    this.items[index].discount_type = 'percentage';

    if (this.items[index].discount_percent === '') {
      this.items[index].discount_amount = '';
      this.items[index].discount_amount_per_item = '';
    }
    this.getAmount(index);
  };

  setItemDiscountAmount = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (value) {
      let discountPerItem = value ? parseFloat(value) : 0;

      this.items[index].discount_amount_per_item = parseFloat(discountPerItem);

      this.items[index].discount_amount = parseFloat(discountPerItem)
        ? parseFloat(discountPerItem * this.items[index].qty)
        : '';
      this.items[index].discount_type = 'amount';
    } else {
      this.items[index].discount_amount = value ? parseFloat(value) : '';

      if (this.items[index].discount_amount === '') {
        this.items[index].discount_percent = '';
        this.items[index].discount_amount_per_item = '';
      }
    }
    this.getAmount(index);
  };

  setMakingCharge = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].makingChargePercent = value ? parseFloat(value) : '';
      this.items[index].makingChargeType = 'percentage';
      this.getAmount(index);
    });
  };

  setMakingChargeAmount = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      if (value) {
        this.items[index].makingChargeAmount = value ? parseFloat(value) : '';
        this.items[index].makingChargeType = 'amount';
        this.getAmount(index);
      } else {
        this.items[index].makingChargeAmount = value ? parseFloat(value) : '';
      }
    });
  };

  setMakingChargePerGramAmount = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      if (value) {
        this.items[index].makingChargePerGramAmount = value
          ? parseFloat(value)
          : '';
        if (this.items[index].qty === 0) {
          this.items[index].qty = 1;
        }
      } else {
        this.items[index].makingChargePerGramAmount = value
          ? parseFloat(value)
          : '';
      }
      this.getAmount(index);
    });
  };

  setMakingChargeIncluded = (index) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      if (this.items[index].makingChargeIncluded === true) {
        this.items[index].makingChargeIncluded = false;
      } else {
        this.items[index].makingChargeIncluded = true;
      }
      this.getAmount(index);
    });
  };

  setPackingCharge = (value) => {
    runInAction(() => {
      this.saleDetails.packing_charge = value ? parseFloat(value) : '';
    });
  };

  setShippingCharge = (value) => {
    runInAction(() => {
      this.saleDetails.shipping_charge = value ? parseFloat(value) : '';
    });
  };

  setWeightIn = (value) => {
    runInAction(() => {
      this.saleDetails.weightIn = value ? parseFloat(value) : '';
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

    /*  if (!mrp || mrp === 0 || !quantity || quantity === 0) {
      return 0;
    } */

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

    if (this.items[index].hallmarkCharge > 0) {
      itemPrice = itemPrice + parseFloat(this.items[index].hallmarkCharge || 0);
    }

    if (this.items[index].certificationCharge > 0) {
      itemPrice =
        itemPrice + parseFloat(this.items[index].certificationCharge || 0);
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
      parseFloat(this.items[index].qty) || 1;

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
      /*this.items[index].cgst_amount = 0;
      this.items[index].sgst_amount = 0;
      this.items[index].igst_amount = 0;
      this.items[index].cess = 0;
      this.items[index].discount_amount = 0;
      this.items[index].mrp_before_tax = 0; */
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

    let mrpValue =
      parseFloat(mrp_before_tax || 0) -
      parseFloat(this.items[index].discount_amount_per_item || 0);
    this.autoFillTaxRate(mrpValue, index);
  };

  setInvoiceNumber = (value) => {
    this.saleDetails.job_work_in_invoice_number = value;
  };

  setPaymentType = (value) => {
    this.saleDetails.payment_type = value;
  };

  setPaymentMode = (value) => {
    this.saleDetails.bankPaymentType = value;
  };

  setBankAccountData = (value) => {
    if (value.accountDisplayName && value.id) {
      runInAction(() => {
        this.saleDetails.payment_type = value.accountDisplayName;
        this.saleDetails.bankAccount = value.accountDisplayName;
        this.saleDetails.bankAccountId = value.id;
      });
    }
  };

  setCreditData = (value) => {
    this.saleDetails.is_credit = value;

    // if (this.saleDetails.is_credit && !this.isUpdate) {
    //   this.saleDetails.received_amount = 0;
    // }
  };

  setInvoiceDate = (value) => {
    this.saleDetails.invoice_date = value;
  };

  get getBalanceData() {
    // if (!this.isSaveOrUpdateOrDeleteClicked) {
    const total_amount = isNaN(parseFloat(this.getTotalAmount))
      ? 0
      : parseFloat(this.getTotalAmount);

    // let received_amount = isNaN(this.saleDetails.received_amount)
    //   ? 0
    //   : this.saleDetails.received_amount;

    // received_amount =
    //   this.saleDetails.received_amount === ''
    //     ? 0
    //     : this.saleDetails.received_amount;

    const linked_amount = isNaN(this.saleDetails.linked_amount)
      ? 0
      : this.saleDetails.linked_amount;

    const balance =
      parseFloat(total_amount) -
      // parseFloat(received_amount || 0) -
      parseFloat(linked_amount);

    // console.log('balance::', balance);

    runInAction(() => {
      this.saleDetails.balance_amount = parseFloat(balance).toFixed(2);
    });

    return balance;
  }

  // get getInvoice() {
  //   return parseFloat(this.saleDetails.received_amount) || 0;
  // }

  setCustomerName = (value) => {
    this.saleDetails.customer_name = value;
  };

  setCustomerId = (value) => {
    this.saleDetails.customer_id = value;
  };

  setCustomer = async (customer, isNewCustomer) => {
    /**
     * get customer txn which are un used
     */
    const db = await Db.get();

    this.getAllUnPaidTxnForCustomer(db, customer.id);

    this.saleDetails.customer_id = customer.id;
    this.saleDetails.customer_name = customer.name;
    this.saleDetails.customerGSTNo = customer.gstNumber;
    this.saleDetails.customerGstType = customer.gstType;
    this.saleDetails.customer_phoneNo = customer.phoneNo;
    this.saleDetails.customer_emailId = customer.emailId;

    if (customer.balanceType === 'Payable' && customer.balance > 0) {
      runInAction(() => {
        this.saleDetails.customer_payable = true;
      });
    } else {
      runInAction(() => {
        this.saleDetails.customer_payable = false;
      });
    }

    this.saleDetails.customer_address = customer.address;
    this.saleDetails.customer_pincode = customer.pincode;
    this.saleDetails.customer_city = customer.city;
    this.saleDetails.customerState = customer.state;
    this.saleDetails.customerCountry = customer.country;

    if (
      customer &&
      customer.additionalAddressList &&
      customer.additionalAddressList.length > 0
    ) {
      this.customerAddressList = [];

      let uiAddress = {
        type: '',
        tradeName: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
        placeOfSupply: ''
      };

      //prepare primary address
      uiAddress.tradeName = customer.tradeName;
      uiAddress.type = 'Primary';
      uiAddress.address = customer.address;
      uiAddress.pincode = customer.pincode;
      uiAddress.city = customer.city;
      uiAddress.state = customer.state;
      uiAddress.country = customer.country;
      uiAddress.placeOfSupply = customer.state;

      this.customerAddressList.push(uiAddress);

      //prepare secondary addresses
      for (let secAddr of customer.additionalAddressList) {
        let uiAddress = {
          type: '',
          tradeName: '',
          address: '',
          pincode: '',
          city: '',
          state: '',
          country: '',
          placeOfSupply: ''
        };

        uiAddress.tradeName = secAddr.tradeName
          ? secAddr.tradeName
          : customer.tradeName;
        uiAddress.type = 'Secondary';
        uiAddress.address = secAddr.billingAddress;
        uiAddress.pincode = secAddr.billingPincode;
        uiAddress.city = secAddr.billingCity;
        uiAddress.state = secAddr.billingState;
        uiAddress.country = secAddr.billingCountry;
        uiAddress.placeOfSupply = secAddr.billingState;

        this.customerAddressList.push(uiAddress);
      }

      this.customerAddressType = 'Bill To';
      this.handleOpenAddressList();
      return;
    }

    this.isNewCustomer = isNewCustomer;
    if (isNewCustomer) {
      this.newCustomerData = customer;
    }
  };

  selectAddressFromCustomer = (selectedIndex) => {
    if (selectedIndex !== -1 && this.customerAddressType === 'Bill To') {
      this.saleDetails.customer_address =
        this.customerAddressList[selectedIndex].address;
      this.saleDetails.customer_pincode =
        this.customerAddressList[selectedIndex].pincode;
      this.saleDetails.customer_city =
        this.customerAddressList[selectedIndex].city;
      this.saleDetails.customerState =
        this.customerAddressList[selectedIndex].state;
      this.saleDetails.customerCountry =
        this.customerAddressList[selectedIndex].country;
    }

    this.handleCloseAddressList();

    this.customerAddressType = '';
    this.customerAddressList = [];
  };

  deleteSaleItem = async (item) => {
    this.items = item.item_list;
    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_payable: item.customer_payable,
      job_work_in_invoice_number: item.job_work_in_invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // received_amount: item.received_amount,
      balance_amount: this.getBalanceData,
      linked_amount: item.linked_amount,
      isFullyReturned: item.isFullyReturned,
      isPartiallyReturned: item.isPartiallyReturned,
      linkedTxnList: item.linkedTxnList,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      linkPayment: item.linkPayment,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      numberOfItems: item.numberOfItems,
      numberOfSelectedItems: item.numberOfSelectedItems,
      numberOfPendingItems: item.numberOfPendingItems,
      due_date: item.due_date,
      status: item.status,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      rateList: item.rateList,
      jobAssignedEmployeeId: item.jobAssignedEmployeeId,
      jobAssignedEmployeeName: item.jobAssignedEmployeeName,
      jobAssignedEmployeePhoneNumber: item.jobAssignedEmployeePhoneNumber,
      weightIn: item.weightIn,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };
    this.saleDetails = saleDetails;

    this.deleteData(saleDetails, item.employeeId);
  };

  viewOrEditItem = async (item) => {
    // console.log('Item details: ', item)
    runInAction(() => {
      this.isUpdate = true;
      this.existingSaleData = item;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.invoiceData = {};
    });

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_payable: item.customer_payable,
      job_work_in_invoice_number: item.job_work_in_invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // received_amount: item.received_amount,
      balance_amount: this.getBalanceData,
      linked_amount: item.linked_amount,
      isFullyReturned: item.isFullyReturned,
      isPartiallyReturned: item.isPartiallyReturned,
      linkedTxnList: item.linkedTxnList,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      linkPayment: item.linkPayment,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      numberOfItems: item.numberOfItems,
      numberOfSelectedItems: item.numberOfSelectedItems,
      numberOfPendingItems: item.numberOfPendingItems,
      due_date: item.due_date,
      status: item.status,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      rateList: item.rateList,
      jobAssignedEmployeeId: item.jobAssignedEmployeeId,
      jobAssignedEmployeeName: item.jobAssignedEmployeeName,
      jobAssignedEmployeePhoneNumber: item.jobAssignedEmployeePhoneNumber,
      weightIn: item.weightIn,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    /**
     * in case of online order no edit is allowed.
     */
    this.items = [];
    if (item.posId === 0) {
      for (let i of item.item_list) {
        i.isEdit = false;
        this.items.push(i);
      }
    } else {
      this.items = item.item_list;
    }

    this.saleDetails = saleDetails;

    this.checkForTaxAndLoadUI();

    runInAction(() => {
      this.OpenAddJobWorkInvoice = true;
    });

    /* if (item.customer_id !== '' && item.customer_id.length > 2) {
      if (this.existingSaleData.linked_amount > 0) {
        this.saleDetails.linkPayment = true;
        await this.getAllLinkedTxnData(this.existingSaleData);
      }

      
      const db = await Db.get();
      await this.getAllUnPaidTxnForCustomer(db, item.customer_id);

       await Promise.all([this.setSelectedCustomerBalance(item.customer_id)]);
    }*/
  };

  getAllLinkedTxnData = async (saleDetails) => {
    const db = await Db.get();

    let paymentIn = false;
    let salesReturn = false;
    let purchases = false;
    let openingBalance = false;
    let openingBalanceLinkedId;

    // console.log('inside getAllLinkedTxnData:::');

    if (saleDetails.linkedTxnList.length > 0) {
      for (let txn of saleDetails.linkedTxnList) {
        // console.log('txn::', txn);
        if (txn.paymentType === 'Payment In') {
          paymentIn = true;
        } else if (txn.paymentType === 'Sales Return') {
          salesReturn = true;
        } else if (txn.paymentType === 'Purchases') {
          purchases = true;
        } else if (txn.paymentType === 'Opening Payable Balance') {
          openingBalance = true;
          openingBalanceLinkedId = txn.linkedId;
        }
      }
    }

    await Promise.all([
      /**
       * get all previously linked txn
       */
      paymentIn ? this.getPaymentInLinkedData(db, saleDetails) : null,
      salesReturn ? this.getSalesReturnLinkedData(db, saleDetails) : null,
      purchases ? this.getCreditPurchaseLinkedData(db, saleDetails) : null,
      openingBalance
        ? this.getOpeningBalanceLinkedData(db, openingBalanceLinkedId)
        : null

      // /**
      //  * get all linked txn
      //  */
      // this.getAllUnPaidTxnForCustomer(db, saleDetails.customer_id)
    ]);

    // console.log(
    //   'paymentLinkTransactions::',
    //   toJS(this.paymentLinkTransactions)
    // );

    if (this.paymentUnLinkTransactions.length > 0) {
      this.paymentUnLinkTransactions.forEach(function (
        linkTxn,
        index,
        modifiedArray
      ) {
        var matchedIndex = saleDetails.linkedTxnList.findIndex(
          (x) => x.linkedId === linkTxn.id
        );

        if (!(typeof matchedIndex === 'undefined' || matchedIndex === -1)) {
          let actualTxn = saleDetails.linkedTxnList[matchedIndex];

          linkTxn.linkedAmount = actualTxn.linkedAmount;
          linkTxn.selected = true;
          modifiedArray[index] = linkTxn;

          // console.log('actualTxn:::', toJS(actualTxn));

          // console.log('linkTxn:::', toJS(linkTxn));
        }
      });

      // console.log(
      //   'paymentUnLinkTransactions::',
      //   toJS(this.paymentUnLinkTransactions)
      // );

      for (let linkTxn of this.paymentUnLinkTransactions) {
        var matchedIndex = this.paymentLinkTransactions.findIndex(
          (x) => x.id === linkTxn.id
        );

        // console.log('matchedIndex::', matchedIndex);
        if (typeof matchedIndex === 'undefined' || matchedIndex === -1) {
          this.paymentLinkTransactions.push(linkTxn);
        } else {
          this.paymentLinkTransactions[matchedIndex] = linkTxn;
        }
      }
    }

    // console.log('final:::', toJS(this.paymentLinkTransactions));
  };

  closeDialog = () => {
    runInAction(() => {
      this.OpenAddJobWorkInvoice = false;
      this.enabledRow = 0;
    });
  };

  setSelectedCustomerBalance = async (id) => {
    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const query = db.parties.findOne({
        selector: {
          $and: [{ businessId: { $eq: businessData.businessId } }, { id: id }]
        }
      });

      await query
        .exec()
        .then(async (data) => {
          if (!data) {
            // No customer data is found so cannot update any information
            return;
          }

          if (data.balanceType === 'Payable' && data.balance > 0) {
            runInAction(() => {
              this.saleDetails.customer_payable = true;
            });
          } else {
            runInAction(() => {
              this.saleDetails.customer_payable = false;
            });
          }

          resolve(`done with set payment `);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  openForNewJobWorkIn = () => {
    // console.log('open new invoice');

    const currentDate = getTodayDateInYYYYMMDD();

    this.isUpdate = false;
    this.OpenAddJobWorkInvoice = true;
    this.generateInvoiceNumber();
    this.printJobWorkInData = null;
    this.openJobWorkInPrintSelectionAlert = false;
    this.isCGSTSGSTEnabledByPOS = true;
    this.invoiceData = {};
    this.saleDetails = {
      businessId: '',
      businessCity: '',
      customer_id: '',
      customer_name: '',
      customerGSTNo: null,
      customerGstType: '',
      customer_payable: false,
      invoice_date: currentDate,
      due_date: currentDate,
      is_roundoff: false,
      round_amount: 0.0,
      total_amount: 0.0,
      is_credit: true,
      payment_type: 'cash',
      bankAccount: '',
      bankAccountId: '',
      bankPaymentType: '',
      received_amount: 0.0,
      balance_amount: 0.0,
      linked_amount: 0.0,
      isPartiallyReturned: false,
      isFullyReturned: false,
      linkPayment: false,
      linkedTxnList: [],
      updatedAt: '',
      discount_percent: 0,
      discount_amount: 0,
      discount_type: '',
      packing_charge: 0,
      shipping_charge: 0,
      sequenceNumber: '',
      paymentReferenceNumber: '',
      notes: '',
      numberOfItems: 0,
      numberOfSelectedItems: 0,
      numberOfPendingItems: 0,
      status: 'open',
      customerState: '',
      customerCountry: '',
      rateList: [],
      jobAssignedEmployeeId: '',
      jobAssignedEmployeeName: '',
      jobAssignedEmployeePhoneNumber: '',
      weightIn: 0,
      isSyncedToServer: false,
      discountPercentForAllItems: 0,
      imageUrls: []
    };

    this.items = [
      {
        description: '',
        imageUrl: '',
        batch_id: 0,
        item_name: '',
        sku: '',
        barcode: '',
        mrp: 0,
        purchased_price: 0,
        offer_price: 0,
        mrp_before_tax: 0,
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
        taxIncluded: false,
        discount_percent: 0,
        discount_amount: 0,
        discount_amount_per_item: 0,
        discount_type: '',
        isEdit: true,
        amount: 0,
        roundOff: 0,
        returnedQty: 0,
        stockQty: 0,
        wastagePercentage: '',
        wastageGrams: '',
        copperGrams: '',
        grossWeight: '',
        netWeight: '',
        purity: '',
        hsn: '',
        makingChargePercent: 0,
        makingChargeAmount: 0,
        makingChargeType: '',
        isSelected: false,
        makingChargePerGramAmount: 0,
        makingChargeIncluded: false,
        pricePerGram: 0,
        stoneWeight: 0,
        stoneCharge: 0,
        serialOrImeiNo: '',
        qtyUnit: '',
        primaryUnit: null,
        secondaryUnit: null,
        unitConversionQty: 0,
        units: [],
        originalMrpWithoutConversionQty: 0,
        mfDate: null,
        expiryDate: null,
        rack: '',
        warehouseData: '',
        batchNumber: '',
        modelNo: '',
        freeQty: 0,
        itemNumber: 0,
        originalDiscountPercent: 0,
        dailyRate: '',
        properties: [],
        hallmarkCharge: 0,
        certificationCharge: 0
      }
    ];

    this.salesInvoiceRegular = {};
    this.salesInvoiceThermal = {};
    this.invoiceData = {};
    this.checkForTaxAndLoadUI();
  };

  handleBatchListModalClose = (val) => {
    this.OpenJobWorkInBatchList = false;
    if (val) {
      this.items[this.selectedIndex].mrp = parseFloat(val.salePrice);

      this.items[this.selectedIndex].stockQty = val.qty;

      if (val.offerPrice > 0) {
        this.items[this.selectedIndex].offer_price = parseFloat(val.offerPrice);
      } else {
        this.items[this.selectedIndex].offer_price = parseFloat(val.salePrice);
      }

      this.items[this.selectedIndex].vendorName = val.vendorName;
      this.items[this.selectedIndex].vendorPhoneNumber = val.vendorPhoneNumber;
    }
    this.selectedProduct = {};
  };

  findProduct = (product, index, newProduct) => {
    if (
      newProduct.productId === product.product_id &&
      parseFloat(newProduct.salePrice) === parseFloat(product.mrp)
    ) {
      product.qty = product.qty + 1;
      product.index = index;
      return true;
    }
  };

  resetSingleProduct = (index) => {
    let defaultItem = {
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
      mrp_before_tax: 0,
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
      taxIncluded: false,
      discount_percent: 0,
      discount_amount: 0,
      discount_amount_per_item: 0,
      discount_type: '',
      amount: 0,
      roundOff: 0,
      isEdit: true,
      returnedQty: 0,
      stockQty: 0,
      wastagePercentage: '',
      wastageGrams: '',
      copperGrams: '',
      grossWeight: '',
      netWeight: '',
      purity: '',
      hsn: '',
      makingChargePercent: 0,
      makingChargeAmount: 0,
      makingChargeType: '',
      isSelected: false,
      makingChargePerGramAmount: 0,
      makingChargeIncluded: false,
      pricePerGram: 0,
      stoneWeight: 0,
      stoneCharge: 0,
      serialOrImeiNo: '',
      qtyUnit: '',
      primaryUnit: null,
      secondaryUnit: null,
      unitConversionQty: 0,
      units: [],
      originalMrpWithoutConversionQty: 0,
      mfDate: null,
      expiryDate: null,
      rack: '',
      warehouseData: '',
      batchNumber: '',
      modelNo: '',
      freeQty: 0,
      itemNumber: 0,
      originalDiscountPercent: 0,
      dailyRate: '',
      properties: [],
      hallmarkCharge: 0,
      certificationCharge: 0
    };

    this.items[index] = defaultItem;
  };

  converToSelectedProduct = (item) => {
    runInAction(() => {
      this.selectedProduct.name = item.name;
      this.selectedProduct.salePrice = item.salePrice;
      this.selectedProduct.purchasedPrice = item.purchasedPrice;
      this.selectedProduct.offerPrice = item.offerPrice;
      this.selectedProduct.barcode = item.barcode;
      this.selectedProduct.sku = item.sku;
      this.selectedProduct.cgst = item.cgst;
      this.selectedProduct.sgst = item.sgst;
      this.selectedProduct.igst = item.igst;
      this.selectedProduct.cess = item.cess;
      this.selectedProduct.hsn = item.hsn;
      this.selectedProduct.productId = item.productId;
      this.selectedProduct.taxIncluded = item.taxIncluded;
      this.selectedProduct.taxType = item.taxType;
      this.selectedProduct.stockQty = item.stockQty;
      this.selectedProduct.batchData = item.batchData;
      this.selectedProduct.serialData = item.serialData;
      this.selectedProduct.vendorName = item.vendorName;
      this.selectedProduct.vendorPhoneNumber = item.vendorPhoneNumber;
      this.selectedProduct.categoryLevel2 = item.categoryLevel2;
      this.selectedProduct.categoryLevel3 = item.categoryLevel3;
      this.selectedProduct.brandName = item.brandName;
      this.selectedProduct.hsn = item.hsn;

      this.selectedProduct.description = item.description;
      this.selectedProduct.imageUrl = item.imageUrl;

      // units addition
      this.selectedProduct.primaryUnit = item.primaryUnit;
      this.selectedProduct.secondaryUnit = item.secondaryUnit;
      this.selectedProduct.units =
        item.units && item.units.length > 2
          ? item.units.slice(0, 2)
          : item.units;
      this.selectedProduct.unitConversionQty = item.unitConversionQty;
      this.selectedProduct.saleDiscountAmount = item.saleDiscountAmount;
      this.selectedProduct.saleDiscountPercent = item.saleDiscountPercent;
      this.selectedProduct.saleDiscountType = item.saleDiscountType;
    });
  };

  selectProduct = (productItem, index, isBarcode) => {
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
      hsn,
      productId,
      taxIncluded,
      taxType,
      stockQty,
      batchData,
      serialData,
      vendorName,
      vendorPhoneNumber,
      categoryLevel2,
      categoryLevel3,
      brandName,
      saleDiscountPercent,
      primaryUnit,
      secondaryUnit,
      units,
      unitConversionQty,
      mfDate,
      expiryDate,
      rack,
      warehouseData,
      modelNo,
      makingChargePerGram,
      netWeight,
      grossWeight,
      stoneWeight,
      wastageGrams,
      makingChargePercent,
      makingChargeAmount,
      stoneCharge,
      purity,
      wastagePercentage,
      rateData,
      hallmarkCharge,
      certificationCharge
    } = productItem;
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    let salePercent = '';

    let existingSaleProduct;
    if (!(batchData.length > 1 || serialData.length > 1)) {
      existingSaleProduct = this.items.find((product, index) =>
        this.findProduct(product, index, productItem)
      );
    }

    // adding same product to sales
    if (existingSaleProduct) {
      this.items[existingSaleProduct.index] = existingSaleProduct;
      this.setQuantity(existingSaleProduct.index, existingSaleProduct.qty);
      this.resetSingleProduct(index);
      setTimeout(() => {
        this.FocusLastIndex = isBarcode
          ? Number('6' + index)
          : Number('4' + index);
      }, 100);
    } else {
      if (batchData.length > 0) {
        if (batchData.length > 1) {
          runInAction(() => {
            this.converToSelectedProduct(productItem);
            this.selectedIndex = index;
            this.OpenJobWorkInBatchList = true;
          });
        } else if (batchData.length === 1) {
          let firstBatchData = batchData[0];
          runInAction(() => {
            if (this.jobWorkInTxnEnableFieldsMap.get('enable_product_price')) {
              this.items[index].mrp = parseFloat(firstBatchData.salePrice);
              if (firstBatchData.offerPrice > 0) {
                this.items[index].offer_price = parseFloat(
                  firstBatchData.offerPrice
                );
              } else {
                this.items[index].offer_price = parseFloat(
                  firstBatchData.salePrice
                );
              }
            } else if (
              this.jobWorkInTxnEnableFieldsMap.get(
                'enable_product_price_per_gram'
              )
            ) {
              this.items[index].pricePerGram = parseFloat(
                firstBatchData.salePrice
              );
            }

            this.items[index].originalMrpWithoutConversionQty = parseFloat(
              firstBatchData.salePrice
            );
            this.items[index].purchased_price = parseFloat(
              firstBatchData.purchasedPrice
            );

            this.items[index].batch_id = parseFloat(firstBatchData.id);

            this.items[index].vendorName = firstBatchData.vendorName;
            this.items[index].qty = 1;
            this.items[index].vendorPhoneNumber =
              firstBatchData.vendorPhoneNumber;
            this.items[index].mfDate = firstBatchData.mfDate;
            this.items[index].expiryDate = firstBatchData.expiryDate;
            this.items[index].rack = firstBatchData.rack;
            this.items[index].warehouseData = firstBatchData.warehouseData;
            this.items[index].barcode = firstBatchData.barcode;
            this.items[index].modelNo = firstBatchData.modelNo;

            salePercent = firstBatchData.saleDiscountPercent;
          });
          this.addNewItem(true, false);
        }
      } else if (serialData.length > 0) {
          runInAction(() => {
            this.converToSelectedProduct(productItem);
            this.selectedIndex = index;
            this.OpenJobWorkInSerialList = true;
          });
      } else {
        runInAction(() => {
          if (this.jobWorkInTxnEnableFieldsMap.get('enable_product_price')) {
            this.items[index].mrp = parseFloat(salePrice);
            if (offerPrice > 0) {
              this.items[index].offer_price = parseFloat(offerPrice);
            } else {
              this.items[index].offer_price = parseFloat(salePrice);
            }
          } else if (
            this.jobWorkInTxnEnableFieldsMap.get(
              'enable_product_price_per_gram'
            )
          ) {
            this.items[index].pricePerGram = parseFloat(salePrice);
          }

          this.items[index].originalMrpWithoutConversionQty =
            parseFloat(salePrice);
          this.items[index].purchased_price = parseFloat(purchasedPrice);

          this.items[index].vendorName = vendorName;
          this.items[index].vendorPhoneNumber = vendorPhoneNumber;

          this.items[index].barcode = barcode;
          this.items[index].modelNo = modelNo;
          this.items[index].mfDate = mfDate;
          this.items[index].expiryDate = expiryDate;
          this.items[index].rack = rack;
          this.items[index].warehouseData = warehouseData;
        });

        this.items.push({
          description: '',
          imageUrl: '',
          batch_id: 0,
          item_name: '',
          sku: '',
          barcode: '',
          mrp: 0,
          purchased_price: 0,
          offer_price: 0,
          mrp_before_tax: 0,
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
          taxIncluded: false,
          discount_percent: 0,
          discount_amount: 0,
          discount_amount_per_item: 0,
          discount_type: '',
          isEdit: true,
          amount: 0,
          roundOff: 0,
          returnedQty: 0,
          stockQty: 0,
          wastagePercentage: '',
          wastageGrams: '',
          copperGrams: '',
          grossWeight: '',
          netWeight: '',
          purity: '',
          hsn: '',
          makingChargePercent: 0,
          makingChargeAmount: 0,
          makingChargeType: '',
          isSelected: false,
          makingChargePerGramAmount: 0,
          makingChargeIncluded: false,
          pricePerGram: 0,
          stoneWeight: 0,
          stoneCharge: 0,
          serialOrImeiNo: '',
          qtyUnit: '',
          primaryUnit: null,
          secondaryUnit: null,
          unitConversionQty: 0,
          units: [],
          originalMrpWithoutConversionQty: 0,
          mfDate: null,
          expiryDate: null,
          rack: '',
          warehouseData: '',
          batchNumber: '',
          modelNo: '',
          freeQty: 0,
          itemNumber: 0,
          originalDiscountPercent: 0,
          dailyRate: '',
          properties: [],
          hallmarkCharge: 0,
          certificationCharge: 0
        });
      }

      runInAction(async () => {
        this.items[index].item_name = name;
        this.items[index].sku = sku;
        this.items[index].product_id = productId;
        this.items[index].description = description;
        this.items[index].imageUrl = imageUrl;
        this.items[index].cess = cess;
        this.items[index].taxIncluded = taxIncluded;
        this.items[index].taxType = taxType;
        this.items[index].stockQty = stockQty;
        this.items[index].hsn = hsn;

        // categories
        this.items[index].categoryLevel2 = categoryLevel2.name;
        this.items[index].categoryLevel2DisplayName =
          categoryLevel2.displayName;
        this.items[index].categoryLevel3 = categoryLevel3.name;
        this.items[index].categoryLevel3DisplayName =
          categoryLevel3.displayName;

        this.items[index].brandName = brandName;
        this.items[index].makingChargePerGramAmount = makingChargePerGram;

        this.items[index].grossWeight = grossWeight.toString();
        this.items[index].stoneWeight = stoneWeight;
        this.items[index].netWeight = netWeight.toString();
        this.items[index].stoneCharge = stoneCharge;
        this.items[index].purity = purity;
        this.items[index].hallmarkCharge = hallmarkCharge;
        this.items[index].certificationCharge = certificationCharge;
        if (wastagePercentage > 0) {
          this.items[index].wastagePercentage = wastagePercentage.toString();
        } else {
          this.items[index].wastageGrams = wastageGrams.toString();
        }

        if (makingChargeAmount > 0) {
          this.items[index].makingChargeAmount = makingChargeAmount;
        } else if (makingChargePercent > 0) {
          this.items[index].makingChargePercent = makingChargePercent;
        }

        if (rateData && rateData.metal !== '') {
          let result = this.metalList.find((e) => e.metal === rateData.metal);

          if (result) {
            this.items[index].dailyRate = result.metal;
            this.items[index].purity = result.purity;
            this.setItemPricePerGram(index, result.rateByGram);
          }
        }

        // units addition
        this.items[index].primaryUnit = primaryUnit;
        this.items[index].secondaryUnit = secondaryUnit;
        this.items[index].units =
          units && units.length > 2 ? units.slice(0, 2) : units;
        this.items[index].unitConversionQty = unitConversionQty;

        if (this.isCGSTSGSTEnabledByPOS) {
          if (cgst > 0) {
            this.items[index].cgst = cgst;
          }
          if (sgst > 0) {
            this.items[index].sgst = sgst;
          }
        } else {
          this.items[index].igst = igst;
        }

        salePercent = saleDiscountPercent;
      });

      this.setQuantity(index, 1);
      let billdiscount = this.saleDetails.discountPercentForAllItems
        ? parseFloat(this.saleDetails.discountPercentForAllItems) || 0
        : 0;
      this.items[index].originalDiscountPercent = salePercent + billdiscount;
      this.setItemDiscount(index, this.items[index].originalDiscountPercent);

      setTimeout(() => {
        this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;

        this.setEditTable(
          this.enabledRow,
          true,
          isBarcode
            ? Number('6' + this.enabledRow)
            : Number('4' + this.enabledRow)
        );
        this.FocusLastIndex = isBarcode
          ? Number('6' + index)
          : Number('4' + this.enabledRow);
      }, 100);
    }
  };

  selectProductFromBatch = (
    batchItem,
    currentProductRowIndexToReset,
    isBarcode
  ) => {
    if (!batchItem) {
      return;
    }

    // console.log('batch item::', productItem);
    const {
      salePrice,
      offerPrice,
      qty,
      purchasedPrice,
      freeQty,
      saleDiscountPercent,
      mfDate,
      expiryDate,
      rack,
      warehouseData,
      batchNumber,
      modelNo,
      barcode,
      properties
    } = batchItem;

    // adding same product to sales
    let existingSaleProduct;
    existingSaleProduct = this.items.find((product, index) =>
      this.findBatchProduct(product, index, batchItem)
    );

    if (existingSaleProduct) {
      this.items[existingSaleProduct.index] = existingSaleProduct;
      this.setQuantity(existingSaleProduct.index, existingSaleProduct.qty);
      this.resetSingleProduct(currentProductRowIndexToReset);
      setTimeout(() => {
        this.FocusLastIndex = isBarcode
          ? Number('6' + currentProductRowIndexToReset)
          : Number('4' + currentProductRowIndexToReset);
      }, 100);
      this.handleBatchListModalClose();
    } else {
      runInAction(() => {
        if (this.jobWorkInTxnEnableFieldsMap.get('enable_product_price')) {
          this.items[this.selectedIndex].mrp = parseFloat(salePrice);
          if (offerPrice > 0) {
            this.items[this.selectedIndex].offer_price = parseFloat(offerPrice);
          } else {
            this.items[this.selectedIndex].offer_price = parseFloat(salePrice);
          }
        } else if (
          this.jobWorkInTxnEnableFieldsMap.get('enable_product_price_per_gram')
        ) {
          this.items[this.selectedIndex].pricePerGram = parseFloat(salePrice);
        }

        this.items[this.selectedIndex].originalMrpWithoutConversionQty =
          parseFloat(salePrice);

        this.items[this.selectedIndex].purchased_price =
          parseFloat(purchasedPrice);

        this.items[this.selectedIndex].stockQty = qty;

        this.items[this.selectedIndex].batch_id = batchItem.id;

        this.items[this.selectedIndex].vendorName = batchItem.vendorName;
        this.items[this.selectedIndex].vendorPhoneNumber =
          batchItem.vendorPhoneNumber;

        this.items[this.selectedIndex].mfDate = mfDate;
        this.items[this.selectedIndex].expiryDate = expiryDate;
        this.items[this.selectedIndex].rack = rack;
        this.items[this.selectedIndex].warehouseData = warehouseData;
        this.items[this.selectedIndex].barcode = barcode;
        this.items[this.selectedIndex].modelNo = modelNo;
        this.items[this.selectedIndex].batchNumber = batchNumber;
        this.items[this.selectedIndex].properties = properties;

        let description = '';
        if (properties && properties.length > 0) {
          for (var i = 0; i < properties.length; i++) {
            description +=
              properties[i].title + ': ' + properties[i].value + ' ';
          }
        }

        if (description !== '') {
          this.items[this.selectedIndex].description = description;
        }
      });

      this.getAmount(this.selectedIndex);
      this.handleBatchListModalClose();
      this.addNewItem(true, true, true);
      this.items[this.selectedIndex].originalDiscountPercent =
        saleDiscountPercent;
      this.setItemDiscount(this.selectedIndex, saleDiscountPercent);
    }
  };

  findBatchProduct = (product, index, batchItem) => {
    if (
      batchItem.id === product.batch_id &&
      parseFloat(batchItem.salePrice) ===
        parseFloat(product.originalMrpWithoutConversionQty)
    ) {
      product.qty = product.qty + 1;
      product.index = index;
      return true;
    }
  };

  selectedPaymentItem = async (row) => {
    var index = this.paymentLinkTransactions.findIndex((x) => x.id === row.id);

    if (index >= 0) {
      const txnSelected = this.paymentLinkTransactions[index];

      // console.log('txnSelected::', toJS(txnSelected));

      /**
       * since total amount is calculated it will be set only during save/update
       */
      const totalAmount = this.saleDetails.total_amount;
      // const recievedAmount = parseFloat(this.saleDetails.received_amount) || 0;
      let linkedAmount = parseFloat(this.saleDetails.linked_amount) || 0;

      // let amountToLink = (totalAmount - recievedAmount - linkedAmount) || 0;
      let amountToLink = totalAmount - linkedAmount || 0;

      if (txnSelected.balance >= amountToLink) {
        txnSelected.linkedAmount = amountToLink;

        runInAction(() => {
          this.saleDetails.linked_amount =
            this.saleDetails.linked_amount + amountToLink;
        });
      } else {
        txnSelected.linkedAmount = txnSelected.balance;

        runInAction(() => {
          this.saleDetails.linked_amount =
            parseFloat(this.saleDetails.linked_amount) +
            parseFloat(txnSelected.balance);
        });
      }

      txnSelected.balance =
        parseFloat(txnSelected.balance) - parseFloat(txnSelected.linkedAmount);
      txnSelected.selected = true;
      runInAction(() => {
        this.paymentLinkTransactions[index] = txnSelected;
      });

      // console.log(
      //   ' this.selectedLinkPaymentTxn',
      //   toJS(this.paymentLinkTransactions)
      // );
    }
  };

  unSelectedPaymentItem = (row) => {
    // console.log(toJS(this.paymentLinkTransactions));
    // console.log(toJS(this.saleDetails));
    var index = this.paymentLinkTransactions.findIndex((x) => x.id === row.id);

    if (index >= 0) {
      const txnSelected = this.paymentLinkTransactions[index];

      /**
       * since total amount is calculated it will be set only during save/update
       */
      const linkedAmount = txnSelected.linkedAmount;

      this.saleDetails.linked_amount =
        this.saleDetails.linked_amount - linkedAmount;

      txnSelected.balance =
        parseFloat(txnSelected.balance) + parseFloat(txnSelected.linkedAmount);

      txnSelected.linkedAmount = 0;
      txnSelected.selected = false;

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
    const totalAmount = this.saleDetails.total_amount;
    let linkedAmount = parseFloat(this.saleDetails.linked_amount) || 0;

    let amountToLink = parseFloat(totalAmount) - parseFloat(linkedAmount);

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
      this.saleDetails.linked_amount = finalLinkedAmount;

      // console.log('txn:::', toJS(this.paymentLinkTransactions));
    } else {
      // console.log('skipping again');
    }
  };

  resetLinkPayment = () => {
    // console.log('resetLinkPayment');

    let linked_amount = this.saleDetails.linked_amount;
    for (let txn of this.paymentLinkTransactions) {
      if (txn) {
        // console.log('tets::', txn);
        // console.log('balance::', txn.balance);

        if (txn.linkedAmount >= 0) {
          linked_amount =
            parseFloat(linked_amount) - parseFloat(txn.linkedAmount);
          txn.balance = parseFloat(txn.balance) + parseFloat(txn.linkedAmount);

          txn.linkedAmount = 0;
          txn.selected = false;
        }
      }
    }
    this.saleDetails.linked_amount = linked_amount;
  };

  setInvoiceRegularSetting = (invoiceRegular) => {
    this.salesInvoiceRegular = invoiceRegular;
  };

  setInvoiceThermalSetting = (invoicThermal) => {
    this.salesInvoiceThermal = invoicThermal;
  };

  getAddRowEnabled = () => {
    return this.addNewRowEnabled;
  };

  setAddRowEnabled = (value) => {
    this.addNewRowEnabled = value;
  };

  setFocusLastIndex = (val) => {
    this.FocusLastIndex = val;
  };

  setPaymentReferenceNumber = (value) => {
    this.saleDetails.paymentReferenceNumber = value;
  };

  setNotes = (value) => {
    this.saleDetails.notes = value;
  };

  setDueDate = (value) => {
    this.saleDetails.due_date = value;
  };

  setIsSelectedCheckerBox = (index) => {
    runInAction(() => {
      if (this.items[index].isSelected === true) {
        this.items[index].isSelected = false;
      } else {
        this.items[index].isSelected = true;
      }
    });
  };

  handleJobWorkInSearchWithDateAndEmployee = async (
    value,
    fromDate,
    toDate,
    employeeId
  ) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    let query;
    if (employeeId) {
      const businessData = await Bd.getBusinessData();

      query = await db.jobworkin.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { sequenceNumber: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
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
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
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
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
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
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
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
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { due_date: { $eq: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { numberOfItems: { $eq: parseFloat(value) } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { numberOfPendingItems: { $eq: parseFloat(value) } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { status: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        }
        // sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });
    } else {
      const businessData = await Bd.getBusinessData();

      query = await db.jobworkin.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { sequenceNumber: { $regex: regexp } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { customer_name: { $regex: regexp } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { total_amount: { $eq: parseFloat(value) } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { balance_amount: { $eq: parseFloat(value) } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { balance_amount: { $eq: parseFloat(value) } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { due_date: { $eq: regexp } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { numberOfItems: { $eq: parseFloat(value) } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { numberOfPendingItems: { $eq: parseFloat(value) } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { status: { $regex: regexp } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        }
        // sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });
    }

    await query.exec().then((documents) => {
      data = documents.map((item) => item);
    });
    return data;
  };

  viewAndRestoreJobWorkInItem = async (item) => {
    runInAction(() => {
      this.OpenAddJobWorkInvoice = true;
      this.isUpdate = false;
      this.isRestore = true;
      this.existingSaleData = item;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.invoiceData = {};
    });

    //reset linked txn details start
    item.linkedTxnList = [];
    item.linkPayment = false;
    item.balance_amount =
      parseFloat(item.balance_amount) - parseFloat(item.linked_amount);
    item.linked_amount = 0;
    //reset linked txn details end

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_payable: item.customer_payable,
      job_work_in_invoice_number: item.job_work_in_invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // received_amount: item.received_amount,
      balance_amount: this.getBalanceData,
      linked_amount: item.linked_amount,
      isFullyReturned: item.isFullyReturned,
      isPartiallyReturned: item.isPartiallyReturned,
      linkedTxnList: item.linkedTxnList,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      linkPayment: item.linkPayment,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      numberOfItems: item.numberOfItems,
      numberOfSelectedItems: item.numberOfSelectedItems,
      numberOfPendingItems: item.numberOfPendingItems,
      due_date: item.due_date,
      status: item.status,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      employeeId: item.employeeId,
      rateList: item.rateList,
      jobAssignedEmployeeId: item.jobAssignedEmployeeId,
      jobAssignedEmployeeName: item.jobAssignedEmployeeName,
      jobAssignedEmployeePhoneNumber: item.jobAssignedEmployeePhoneNumber,
      weightIn: item.weightIn,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    /**
     * in case of online order no edit is allowed.
     */
    if (item.posId === 0) {
      this.items = [];
      for (let i of item.item_list) {
        i.isEdit = false;
        this.items.push(i);
      }
    } else {
      this.items = item.item_list;
    }

    if (
      parseFloat(item.balance_amount) > 0 &&
      item.customer_id !== '' &&
      item.customer_id.length > 2
    ) {
      const db = await Db.get();
      await this.getAllUnPaidTxnForCustomer(db, item.customer_id);
    }

    this.saleDetails = saleDetails;
  };

  restoreJobWorkInItem = async (item, isRestoreWithNextSequenceNo) => {
    runInAction(() => {
      this.isUpdate = false;
      this.isRestore = true;
      this.existingSaleData = item;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.invoiceData = {};
    });

    //reset linked txn details start
    item.linkedTxnList = [];
    item.linkPayment = false;
    item.balance_amount =
      parseFloat(item.balance_amount) - parseFloat(item.linked_amount);
    item.linked_amount = 0;
    //reset linked txn details end

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_payable: item.customer_payable,
      job_work_in_invoice_number: item.job_work_in_invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // received_amount: item.received_amount,
      balance_amount: this.getBalanceData,
      linked_amount: item.linked_amount,
      isFullyReturned: item.isFullyReturned,
      isPartiallyReturned: item.isPartiallyReturned,
      linkedTxnList: item.linkedTxnList,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      linkPayment: item.linkPayment,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      numberOfItems: item.numberOfItems,
      numberOfSelectedItems: item.numberOfSelectedItems,
      numberOfPendingItems: item.numberOfPendingItems,
      due_date: item.due_date,
      status: item.status,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      employeeId: item.employeeId,
      rateList: item.rateList,
      jobAssignedEmployeeId: item.jobAssignedEmployeeId,
      jobAssignedEmployeeName: item.jobAssignedEmployeeName,
      jobAssignedEmployeePhoneNumber: item.jobAssignedEmployeePhoneNumber,
      weightIn: item.weightIn,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    /**
     * in case of online order no edit is allowed.
     */
    if (item.posId === 0) {
      this.items = [];
      for (let i of item.item_list) {
        i.isEdit = false;
        this.items.push(i);
      }
    } else {
      this.items = item.item_list;
    }

    this.saleDetails = saleDetails;

    if (isRestoreWithNextSequenceNo) {
      this.saleDetails.invoice_date = getTodayDateInYYYYMMDD();

      await this.generateInvoiceNumber();
      await this.getSequenceNumber(
        this.saleDetails.invoice_date,
        this.saleDetails.job_work_in_invoice_number
      );
    }

    this.saveData(false);
  };

  markJobWorkInRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            transactionId: { $eq: this.saleDetails.job_work_in_invoice_number }
          }
        ]
      }
    });
    await query
      .remove()
      .then(async (data) => {
        console.log('Deleted data removed' + data);
        this.saleDetails = {};
      })
      .catch((error) => {
        console.log('Deleted data deletion Failed ' + error);
      });
  };

  setRateList = (isChecked, value) => {
    let rateValue = {
      id: '',
      metal: '',
      purity: '',
      rateByGram: '',
      defaultBool: ''
    };

    rateValue.id = value.id;
    rateValue.metal = value.metal;
    rateValue.purity = value.purity;
    rateValue.rateByGram = value.rateByGram;
    rateValue.defaultBool = value.defaultBool;

    if (isChecked) {
      if (typeof this.saleDetails.rateList === 'undefined') {
        this.saleDetails.rateList = [];
      }

      this.saleDetails.rateList.push(rateValue);
      this.prepareRateList();
    } else {
      let indexToRemove = -1;
      for (var i = 0; i < this.saleDetails.rateList.length; i++) {
        if (value.metal === this.saleDetails.rateList[i].metal) {
          indexToRemove = i;
          break;
        }
      }
      if (indexToRemove !== -1) {
        this.saleDetails.rateList.splice(indexToRemove, 1);
        this.prepareRateList();
      }
    }
  };

  addRateToList = (value) => {
    let rateValue = {
      id: '',
      metal: '',
      purity: '',
      rateByGram: '',
      defaultBool: ''
    };

    rateValue.id = value.id;
    rateValue.metal = value.metal;
    rateValue.purity = value.purity;
    rateValue.rateByGram = value.rateByGram;
    rateValue.defaultBool = value.defaultBool;

    if (typeof this.saleDetails.rateList === 'undefined') {
      this.saleDetails.rateList = [];
    }
    this.saleDetails.rateList.push(rateValue);
    this.prepareRateList();
  };

  prepareRateList = () => {
    this.chosenMetalString = '';
    this.chosenMetalList = [];
    if (this.saleDetails.rateList && this.saleDetails.rateList.length > 0) {
      for (var i = 0; i < this.saleDetails.rateList.length; i++) {
        this.chosenMetalString += this.saleDetails.rateList[i].metal;
        if (i !== this.saleDetails.rateList.length - 1) {
          this.chosenMetalString += ', ';
        }
      }
      if (this.chosenMetalString !== '') {
        this.chosenMetalList = this.chosenMetalString
          .split(',')
          .map((item) => item.trim());
      }
    }
  };

  resetJobWorkInPrintData = async () => {
    runInAction(() => {
      this.printJobWorkInData = {};
      this.openJobWorkInPrintSelectionAlert = false;
    });
  };

  handleOpenJobWorkInLoadingMessage = async () => {
    runInAction(() => {
      this.openJobWorkInLoadingAlertMessage = true;
    });
  };

  handleCloseJobWorkInLoadingMessage = async () => {
    runInAction(() => {
      this.openJobWorkInLoadingAlertMessage = false;
    });
  };

  handleOpenJobWorkInErrorAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkInErrorAlertMessage = true;
    });
  };

  handleCloseJobWorkInErrorAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkInErrorAlertMessage = false;
    });
  };

  handleOpenJobWorkInPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkInPrintSelectionAlert = true;
    });
  };

  handleCloseJobWorkInPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkInPrintSelectionAlert = false;
    });
  };

  setRoundingConfiguration = (value) => {
    this.roundingConfiguration = value;
  };

  setEmployee = (data) => {
    if (data !== '') {
      this.saleDetails.jobAssignedEmployeeName = data.name;
      this.saleDetails.jobAssignedEmployeeId = data.id;
      this.saleDetails.jobAssignedEmployeePhoneNumber = data.userName;
    } else {
      this.saleDetails.jobAssignedEmployeeName = '';
      this.saleDetails.jobAssignedEmployeeId = '';
      this.saleDetails.jobAssignedEmployeePhoneNumber = '';
    }
  };

  handleOpenAddressList = async () => {
    runInAction(() => {
      this.openAddressList = true;
    });
  };

  handleCloseAddressList = async () => {
    runInAction(() => {
      this.openAddressList = false;
    });
  };

  // jewelry

  setGrossWeight = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].grossWeight = value;
    if (this.items[index].pricePerGram > 0) {
      this.items[index].netWeight =
        parseFloat(this.items[index].grossWeight || 0) -
        parseFloat(this.items[index].stoneWeight || 0);
    }
    this.getAmount(index);
  };

  setWastagePercentage = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].wastagePercentage = value;
    this.getAmount(index);
  };

  setWastageGrams = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].wastageGrams = value;
    this.getAmount(index);
  };

  setNetWeight = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].netWeight = value;

    if (this.items[index].qty === 0) {
      this.items[index].qty = 1;
    }

    this.getAmount(index);
  };

  setPurity = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].purity = value;
  };

  setItemPricePerGram = async (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].pricePerGram = value ? parseFloat(value) : '';
    if (this.items[index].qty === 0) {
      this.items[index].qty = 1;
    }

    if (this.items[index].pricePerGram > 0) {
      runInAction(() => {
        this.items[index].netWeight =
          parseFloat(this.items[index].grossWeight || 0) -
          parseFloat(this.items[index].stoneWeight || 0);
      });
    }

    if (this.items[index].qty) {
      this.getAmount(index);
    }
    this.getAmount(index);
  };

  setItemStoneWeight = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].stoneWeight = value ? parseFloat(value) : '';
    if (this.items[index].pricePerGram > 0) {
      this.items[index].netWeight =
        parseFloat(this.items[index].grossWeight || 0) -
        parseFloat(this.items[index].stoneWeight || 0);
    }
    this.getAmount(index);
  };

  setItemStoneCharge = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].stoneCharge = value ? parseFloat(value) : '';
    this.getAmount(index);
  };

  setCopperGrams = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].copperGrams = value;
  };

  get getTotalStoneWeight() {
    if (!this.items) {
      return 0;
    }

    let total = 0;

    for (let item of this.items) {
      total = total + parseFloat(item.stoneWeight || 0);
    }

    return parseFloat(total).toFixed(2);
  }

  setItemHallmarkCharge = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].hallmarkCharge = value ? parseFloat(value) : '';
    });
    this.getAmount(index);
  };

  setFileUploadUrls = (files) => {
    runInAction(() => {
      this.saleDetails.imageUrls = files;
    });
  };

  setItemCertificationCharge = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].certificationCharge = value ? parseFloat(value) : '';
    });
    this.getAmount(index);
  };

  setSerialOrImeiNo = async (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].serialOrImeiNo = value;

    if (value !== '') {
      /**
       * get product by barcode
       * if match found then add new row
       */
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.businessproduct
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                serialData: {
                  $elemMatch: {
                    serialImeiNo: { $eq: value }
                  }
                }
              }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          if (!data) {
            // No proudct match found
            return;
          }

          /**
           * handle unit configuration
           */
          let actualProduct = data.toJSON();

          let isProductSold = false;

          if (
            actualProduct &&
            actualProduct.serialData &&
            actualProduct.serialData.length > 0
          ) {
            for (let serialItem of actualProduct.serialData) {
              if (
                value === serialItem.serialImeiNo &&
                serialItem.soldStatus === true
              ) {
                isProductSold = true;
                runInAction(() => {
                  this.errorAlertMessage =
                    'Product with Serial No: ' + value + ' is already sold';
                  this.openSaleErrorAlertMessage = true;
                  this.items[index].serialOrImeiNo = '';
                });
              }
            }
          }

          if (isProductSold === false) {
            let salePercent = '';
            // adding same product to sales
            let existingSaleProduct;
            if (this.items && this.items.length > 1) {
              existingSaleProduct = this.items.find((product, i) =>
                this.findSerialProductBySerialValue(product, i, value, index)
              );
            }

            if (existingSaleProduct) {
              runInAction(() => {
                this.errorAlertMessage =
                  'Product with Serial No: ' + value + ' is already added';
                this.openJobWorkInValidationMessage = true;
                this.items[index].serialOrImeiNo = '';
              });
            } else {
              this.converToSelectedProduct(actualProduct);
              this.selectedIndex = index;
              runInAction(() => {
                if (
                  this.jobWorkInTxnEnableFieldsMap.get('enable_product_price')
                ) {
                  this.items[index].mrp = parseFloat(actualProduct.salePrice);
                  if (actualProduct.offerPrice > 0) {
                    this.items[index].offer_price = parseFloat(
                      actualProduct.offerPrice
                    );
                  } else {
                    this.items[index].offer_price = parseFloat(
                      actualProduct.salePrice
                    );
                  }
                } else if (
                  this.jobWorkInTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  )
                ) {
                  this.items[index].pricePerGram = parseFloat(
                    actualProduct.salePrice
                  );
                }

                this.items[index].originalMrpWithoutConversionQty = parseFloat(
                  actualProduct.salePrice
                );
                this.items[index].purchased_price = parseFloat(
                  actualProduct.purchasedPrice
                );
                this.items[index].item_name = actualProduct.name;
                this.items[index].barcode = actualProduct.barcode;
                this.items[index].sku = actualProduct.sku;
                this.items[index].product_id = actualProduct.productId;
                this.items[index].description = actualProduct.description;
                this.items[index].imageUrl = actualProduct.imageUrl;
                this.items[index].cess = actualProduct.cess;
                this.items[index].taxIncluded = actualProduct.taxIncluded;
                this.items[index].taxType = actualProduct.taxType;
                this.items[index].stockQty = actualProduct.stockQty;
                this.items[index].freeStockQty = actualProduct.freeQty;
                this.items[index].hsn = actualProduct.hsn;

                salePercent = actualProduct.saleDiscountPercent;

                // categories
                this.items[index].categoryLevel2 =
                  actualProduct.categoryLevel2.name;
                this.items[index].categoryLevel2DisplayName =
                  actualProduct.categoryLevel2.displayName;
                this.items[index].categoryLevel3 =
                  actualProduct.categoryLevel3.name;
                this.items[index].categoryLevel3DisplayName =
                  actualProduct.categoryLevel3.displayName;

                this.items[index].brandName = actualProduct.brandName;

                this.items[index].mfDate = actualProduct.mfDate;
                this.items[index].expiryDate = actualProduct.expiryDate;
                this.items[index].rack = actualProduct.rack;
                this.items[index].warehouseData = actualProduct.warehouseData;
                this.items[index].modelNo = actualProduct.modelNo;

                // units addition
                this.items[index].primaryUnit = actualProduct.primaryUnit;
                this.items[index].secondaryUnit = actualProduct.secondaryUnit;
                this.items[index].units =
                  actualProduct.units && actualProduct.units.length > 2
                    ? actualProduct.units.slice(0, 2)
                    : actualProduct.units;
                this.items[index].unitConversionQty =
                  actualProduct.unitConversionQty;

                if (this.isCGSTSGSTEnabledByPOS) {
                  if (actualProduct.cgst > 0) {
                    this.items[index].cgst = actualProduct.cgst;
                  }
                  if (actualProduct.sgst > 0) {
                    this.items[index].sgst = actualProduct.sgst;
                  }
                } else {
                  this.items[index].igst = actualProduct.igst;
                }
              });
              this.setQuantity(index, 1);
              let billdiscount = this.saleDetails.discountPercentForAllItems
                ? parseFloat(this.saleDetails.discountPercentForAllItems)
                : 0;
              this.items[index].originalDiscountPercent =
                salePercent + billdiscount;
              this.setItemDiscount(
                index,
                this.items[index].originalDiscountPercent
              );
              this.addNewItem(true, true, true);
            }
          }
        });
    }
  };

  setItemDescription = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].description = value;
  };

  setItemDescriptionCollapsibleIndex = (index, value) => {
    this.descriptionCollapsibleMap.set(index, value);
  };

  setItemModelNo = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].modelNo = value;
  };

  setCGSTSGSTEnabledByPOS = (value) => {
    runInAction(() => {
      this.isCGSTSGSTEnabledByPOS = value;
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

  revalidateItemsTaxRate = () => {
    if (this.items && this.items.length > 0) {
      for (var i = 0; i < this.items.length; i++) {
        let cgst = this.items[i].cgst;
        let igst = this.items[i].igst;
        if (this.isCGSTSGSTEnabledByPOS) {
          this.items[i].igst = 0;
          if (igst > 0) {
            this.items[i].cgst = igst / 2;
            this.items[i].sgst = igst / 2;
          }
        } else {
          this.items[i].cgst = 0;
          this.items[i].sgst = 0;
          if (cgst > 0) {
            this.items[i].igst = cgst * 2;
          }
        }
        this.getAmount(i);
      }
    }
  };

  resetCustomer = () => {
    runInAction(() => {
      this.saleDetails.customer_id = '';
      this.saleDetails.customer_name = '';
      this.saleDetails.customerGSTNo = '';
      this.saleDetails.customerGstType = '';
      this.saleDetails.customer_address = '';
      this.saleDetails.customer_phoneNo = '';
      this.saleDetails.customer_pincode = '';
      this.saleDetails.customer_city = '';
      this.saleDetails.customer_emailId = '';
      this.saleDetails.customerState = '';
      this.saleDetails.customerCountry = '';
    });
  };

  handleSerialListModalClose = (val) => {
    runInAction(() => {
      this.OpenJobWorkInSerialList = false;
      this.selectedProduct = {};
    });
  };

  selectProductFromSerial = (
    serialItem,
    currentProductRowIndexToReset,
    selectedProduct
  ) => {
    if (!serialItem) {
      return;
    }

    // console.log('batch item::', productItem);
    const { serialImeiNo } = serialItem;

    // adding same product to sales
    let existingSaleProduct;
    existingSaleProduct = this.items.find((product, i) =>
      this.findSerialProduct(
        product,
        i,
        serialItem,
        currentProductRowIndexToReset
      )
    );

    if (existingSaleProduct) {
      this.resetSingleProduct(currentProductRowIndexToReset);
      setTimeout(() => {
        this.FocusLastIndex = Number('4' + currentProductRowIndexToReset);
      }, 100);
      this.handleSerialListModalClose();
      runInAction(() => {
        this.errorAlertMessage =
          'Product with Serial No: ' + serialImeiNo + ' is already added';
        this.openJobWorkInValidationMessage = true;
      });
    } else {
      runInAction(() => {
        if (this.jobWorkInTxnEnableFieldsMap.get('enable_product_price')) {
          this.items[this.selectedIndex].mrp = parseFloat(
            selectedProduct.salePrice
          );
          if (this.selectedProduct.offerPrice > 0) {
            this.items[this.selectedIndex].offer_price = parseFloat(
              selectedProduct.offerPrice
            );
          } else {
            this.items[this.selectedIndex].offer_price = parseFloat(
              selectedProduct.salePrice
            );
          }
        } else if (
          this.jobWorkInTxnEnableFieldsMap.get('enable_product_price_per_gram')
        ) {
          this.items[this.selectedIndex].pricePerGram = parseFloat(
            selectedProduct.salePrice
          );
        }

        this.items[this.selectedIndex].originalMrpWithoutConversionQty =
          parseFloat(selectedProduct.salePrice);
        this.items[this.selectedIndex].purchased_price = parseFloat(
          selectedProduct.purchasedPrice
        );

        this.items[this.selectedIndex].stockQty = selectedProduct.qty;

        this.items[this.selectedIndex].freeStockQty = selectedProduct.freeQty;

        this.items[this.selectedIndex].vendorName = selectedProduct.vendorName;
        this.items[this.selectedIndex].vendorPhoneNumber =
          selectedProduct.vendorPhoneNumber;

        this.items[this.selectedIndex].mfDate = selectedProduct.mfDate;
        this.items[this.selectedIndex].expiryDate = selectedProduct.expiryDate;
        this.items[this.selectedIndex].rack = selectedProduct.rack;
        this.items[this.selectedIndex].warehouseData =
          selectedProduct.warehouseData;
        this.items[this.selectedIndex].modelNo = selectedProduct.modelNo;
        this.items[this.selectedIndex].barcode = selectedProduct.barcode;
        this.items[this.selectedIndex].serialOrImeiNo =
        serialImeiNo;
      });

      this.getAmount(this.selectedIndex);
      this.handleSerialListModalClose();
      this.addNewItem(true, true, true);
      let billdiscount = this.saleDetails.discountPercentForAllItems
        ? parseFloat(this.saleDetails.discountPercentForAllItems)
        : 0;
      this.items[this.selectedIndex].originalDiscountPercent =
        selectedProduct.saleDiscountPercent + billdiscount;
      this.setItemDiscount(
        this.selectedIndex,
        this.items[this.selectedIndex].originalDiscountPercent
      );
    }
  };

  findSerialProduct = (product, i, serialItem, index) => {
    if (serialItem.serialImeiNo === product.serialOrImeiNo) {
      // product.qty = product.qty + 1;
      product.index = i;
      return true;
    }
  };

  findSerialProductBySerialValue = (product, i, serialImeiNo, index) => {
    if (serialImeiNo === product.serialOrImeiNo && i !== index) {
      // product.qty = product.qty + 1;
      product.index = i;
      return true;
    }
  };
  handleOpenJobWorkInErrorAlertMessage = async (message) => {
    runInAction(() => {
      this.openJobWorkInValidationMessage = true;
      this.errorAlertMessage = message;
    });
  };

  handleCloseJobWorkInValidationAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkInValidationMessage = false;
      this.errorAlertMessage = '';
    });
  };

  setRateMetalList = (list) => {
    runInAction(() => {
      this.metalList = list;
    });
  };

  setItemRate = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].dailyRate = value;
      let result = this.metalList.find((e) => e.metal === value);

      if (result) {
        this.setItemPricePerGram(index, result.rateByGram);
        this.setPurity(index, result.purity);
      }
    });
  };

  getTotalQuantity = () => {
    let qty = 0;

    if (!this.items) {
      return qty;
    }

    this.items.forEach((product) => {
      qty += product.qty;
    });

    return qty;
  };

  duplicate = async (item) => {
    this.initializeData();
    const saleDetails = JSON.parse(JSON.stringify(item));

    this.items = item.item_list;

    runInAction(async () => {
      this.saleDetails = saleDetails;
      this.saleDetails.sequenceNumber = '';
      this.saleDetails.status = 'open';
      this.saleDetails.invoice_date = getTodayDateInYYYYMMDD();
      await this.checkForTaxAndLoadUI();
      this.generateInvoiceNumber();
    });
  };

  checkForTaxAndLoadUI = async (revalidateTax) => {
    let item = this.saleDetails;
    let taxData = await taxSettings.getTaxSettingsDetails();
    if (
      taxData &&
      ((taxData.gstin && taxData.gstin !== '') ||
        (taxData.state && taxData.state !== ''))
    ) {
      let businessStateCode = '';
      if (taxData.gstin && taxData.gstin !== '') {
        businessStateCode = taxData.gstin.slice(0, 2);
      } else if (taxData.state && taxData.state !== '') {
        let result = getStateList().find((e) => e.name === taxData.state);
        if (result) {
          businessStateCode = result.code;
        }
      }
      if (item.customerGSTNo && item.customerGSTNo !== '') {
        let customerExtractedStateCode = item.customerGSTNo.slice(0, 2);
        if (
          businessStateCode !== '' &&
          customerExtractedStateCode !== '' &&
          businessStateCode === customerExtractedStateCode
        ) {
          this.setCGSTSGSTEnabledByPOS(true);
        } else {
          this.setCGSTSGSTEnabledByPOS(false);
        }
      } else if (item.customerState && item.customerState !== '') {
        let result = getStateList().find((e) => e.code === businessStateCode);
        if (result) {
          let businessState = result.name;
          if (
            item.customerState !== '' &&
            item.customerState !== null &&
            businessState !== '' &&
            businessState !== null &&
            item.customerState.toLowerCase() === businessState.toLowerCase()
          ) {
            this.setCGSTSGSTEnabledByPOS(true);
          } else {
            this.setCGSTSGSTEnabledByPOS(false);
          }
        }
      }
    }
    if(revalidateTax && revalidateTax === true) {
      this.revalidateItemsTaxRate();
    }
  };

  initializeData = () => {
    runInAction(async () => {
      this.isUpdate = false;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.invoiceData = {};
      this.OpenAddJobWorkInvoice = true;
    });
  };

  autoFillTaxRate = async (value, index) => {
    if (!this.items) {
      return;
    }

    if (!this.items[index]) {
      return;
    }

    if (this.items[index].item_name === '' || this.items[index].qty === 0) {
      return;
    }

    let taxRateApplied = false;
    if (value !== '') {
      let auditSettings = await audit.getAuditSettingsData();
      if (
        auditSettings &&
        auditSettings.taxRateAutofillList &&
        auditSettings.taxRateAutofillList.length > 0
      ) {
        for (let taxRateObj of auditSettings.taxRateAutofillList) {
          if (parseFloat(value) >= taxRateObj.price) {
            if (this.isCGSTSGSTEnabledByPOS) {
              if (taxRateObj.tax / 2 !== this.items[index].cgst) {
                this.items[index].cgst = taxRateObj.tax / 2 || 0;
                this.items[index].sgst = taxRateObj.tax / 2 || 0;
                taxRateApplied = true;
              }
            } else {
              if (taxRateObj.tax / 2 !== this.items[index].igst) {
                this.items[index].igst = taxRateObj.tax || 0;
                taxRateApplied = true;
              }
            }
          }
        }
      }

      if (taxRateApplied) {
        this.getAmount(index);
      }
    }
  };

  constructor() {
    makeObservable(this, {
      saleDetails: observable,
      items: observable,
      setDiscount: action,
      setQuantity: action,
      setItemSku: action,
      setItemBarcode: action,
      setItemName: action,
      setMrp: action,
      setOffer: action,
      getAmount: action,
      setCGST: action,
      setSGST: action,
      setDiscountAmount: action,
      setInvoiceNumber: action,
      setInvoiceDate: action,
      deleteItem: action,
      setCreditData: action,
      getTotalAmount: computed,
      getTotalNetWeight: computed,
      getTotalGrossWeight: computed,
      getTotalWatage: computed,
      getBalanceData: computed,
      setPaymentType: action,
      toggleRoundOff: action,
      // setReceived: action,
      getRoundedAmount: computed,
      newCustomer: observable,
      newCustomerData: observable,
      setCustomer: action,
      saveData: action,
      saveDataAndNew: action,
      isUpdate: observable,
      OpenAddJobWorkInvoice: observable,
      OpenJobWorkInBatchList: observable,
      selectedProduct: observable,
      closeDialog: action,
      viewOrEditItem: action,
      openForNewJobWorkIn: action,
      selectProduct: action,
      selectProductFromBatch: action,
      setEditTable: action,
      generateInvoiceNumber: action,
      viewOrEditJobWorkInTxnItem: action,
      deleteJobWorkInTxnItem: action,
      FocusLastIndex: observable,
      salesData: observable,
      totalSalesData: observable,
      sales: observable,
      getJobWorkInData: computed,
      getJobWorkInDetails: action,
      addJobWorkInData: action,
      customerList: observable,
      setCustomerList: action,
      getBalanceAfterLinkedAmount: computed,
      dateDropValue: observable,
      getJobWorkInCount: action,
      isSalesList: observable,
      getJobWorkInList: action,
      handleJobWorkInSearch: action,
      openLinkpaymentPage: observable,
      paymentLinkTransactions: observable,
      enabledRow: observable,
      setFocusLastIndex: action,
      setInvoiceRegularSetting: action,
      setInvoiceThermalSetting: action,
      openRegularPrint: observable,
      addNewRowEnabled: observable,
      getAddRowEnabled: action,
      setAddRowEnabled: action,
      setPaymentMode: action,
      setItemHSN: action,
      jobWorkInTxnEnableFieldsMap: observable,
      setJobWorkInTxnEnableFieldsMap: action,
      taxSettingsData: observable,
      setTaxSettingsData: action,
      setMakingChargeAmount: action,
      setMakingCharge: action,
      setPaymentReferenceNumber: action,
      setNotes: action,
      setDueDate: action,
      setIsSelectedCheckerBox: action,
      setMakingChargePerGramAmount: action,
      viewAndRestoreJobWorkInItem: action,
      restoreJobWorkInItem: action,
      isRestore: observable,
      addRateToList: action,
      setRateList: action,
      chosenMetalList: observable,
      printJobWorkInData: observable,
      openJobWorkInLoadingAlertMessage: observable,
      openJobWorkInErrorAlertMessage: observable,
      openJobWorkInPrintSelectionAlert: observable,
      setMakingChargeIncluded: action,
      setRoundingConfiguration: action,
      openAddressList: observable,
      customerAddressList: observable,
      descriptionCollapsibleMap: observable,
      isCGSTSGSTEnabledByPOS: observable,
      sequenceNumberFailureAlert: observable,
      OpenJobWorkInSerialList: observable,
      openJobWorkInValidationMessage: observable,
      errorAlertMessage: observable
    });
  }
}
export default new JobWorkInStore();