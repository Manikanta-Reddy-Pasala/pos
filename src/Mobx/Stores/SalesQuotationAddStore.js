import {
  action,
  computed,
  observable,
  makeObservable,
  toJS,
  runInAction
} from 'mobx';
import * as Db from '../../RxDb/Database/Database';

import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';

import _uniqueId from 'lodash/uniqueId';
import * as Bd from '../../components/SelectedBusiness';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import BatchData from './classes/BatchData';
import * as audit from '../../components/Helpers/AuditHelper';
import * as taxSettings from '../../components/Helpers/TaxSettingsHelper';
import getStateList from 'src/components/StateList';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';
import { getSaleQuotationTransactionSettings } from 'src/components/Helpers/dbQueries/salequotationtransactionsettings';
import { getTaxSettings } from 'src/components/Helpers/dbQueries/taxsettings';
import { prepareColumnIndexMap } from 'src/components/Helpers/ColumnIndexHelper';
import { getRateData } from 'src/components/Helpers/dbQueries/rates';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

class SalesQuotationAddStore {
  saleDetails = {
    businessId: '',
    businessCity: '',
    customer_id: '',
    customer_name: '',
    customerGSTNo: null,
    customerGstType: '',
    customer_address: '',
    customer_phoneNo: '',
    customer_city: '',
    customer_emailId: '',
    customer_pincode: '',
    invoice_number: '',
    invoice_date: '',
    is_roundoff: false,
    round_amount: 0.0,
    total_amount: 0.0,
    updatedAt: '',
    discount_percent: 0,
    discount_amount: 0,
    discount_type: '',
    packing_charge: 0,
    shipping_charge: 0,
    sequenceNumber: '',
    convertQuotationToSale: false,
    estimateType: 'open',
    notes: '',
    customerState: '',
    customerCountry: '',
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
      qty: 0,
      freeQty: 0,
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
      grossWeight: '',
      netWeight: '',
      purity: '',
      hsn: '',
      makingChargePercent: 0,
      makingChargeAmount: 0,
      makingChargeType: '',
      makingChargePerGramAmount: 0,
      makingChargeIncluded: false,
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
      pricePerGram: 0,
      stoneWeight: 0,
      stoneCharge: 0,
      serialOrImeiNo: '',
      itemNumber: 0,
      originalDiscountPercent: 0,
      dailyRate: '',
      properties: [],
      hallmarkCharge: 0,
      certificationCharge: 0,
      purchased_price_before_tax: 0
    }
  ];

  FocusLastIndex = false;

  enabledRow = 0;

  addNewRowEnabled = false;

  salesTxnEnableFieldsMap = new Map();

  taxSettingsData = {};

  OpenQuotationBatchList = false;

  selectedProduct = {};

  saveAndNew = false;

  existingSaleData = {};

  newCustomerData = {};

  selectedIndex = 0;

  newCustomer = false;

  isUpdate = false;

  OpenAddsalesQuotationInvoice = false;

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

  openSaleQuotationLoadingAlertMessage = false;
  openSaleQuotationErrorAlertMessage = false;

  openSaleQuotationPrintSelectionAlert = false;
  printSaleQuotationData = null;
  printSaleQuotationBalance = {};

  roundingConfiguration = 'Nearest 50';

  descriptionCollapsibleMap = new Map();

  customerAddressList = [];
  customerAddressType = '';
  openAddressList = false;

  salesTransSettingData = {};

  isCGSTSGSTEnabledByPOS = true;

  sequenceNumberFailureAlert = false;
  OpenSaleQuotationSerialList = false;
  openSaleErrorAlertMessage = false;
  errorAlertMessage = '';
  metalList = [];
  jobWorkInDetails = {};

  openProductDetails = false;
  isComingFromProductSearch = false;
  columnIndexMap = new Map();
  openMoreOptionsMenu = false;

  getSalesQuotationCount = async () => {
    const db = await Db.get();
    // console.log('inside sales count');
    const businessData = await Bd.getBusinessData();

    await db.salesquotation
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

  setSalesTxnEnableFieldsMap = (salesTransSettingData) => {
    runInAction(() => {
      this.salesTxnEnableFieldsMap = new Map();
      this.salesTransSettingData = salesTransSettingData;
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

        if (
          !this.isUpdate &&
          this.salesTxnEnableFieldsMap.get('enable_roundoff_default')
        ) {
          this.saleDetails.is_roundoff = true;
        }
      }
    });
  };

  setTaxSettingsData = (value) => {
    this.taxSettingsData = value;
  };

  getSalesQuotationDetails = async (customerId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.salesquotation
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

  addSalesQuotationData = (data) => {
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

  addSalesQuotationJSONData = (data) => {
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

  get getSalesQuotationData() {
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

    this.saleDetails.total_amount = totalAmount;
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

  getSalesQuotationCount = async () => {
    const db = await Db.get();
    // console.log('inside sales count');
    const businessData = await Bd.getBusinessData();

    await db.salesquotation
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

  getSalesQuotationList = async (fromDate, toDate) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;
    const businessData = await Bd.getBusinessData();

    if (!fromDate || !toDate) {
      query = db.salesquotation.find({
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
      query = db.salesquotation.find({
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

  getSalesQuotationListWithLimit = async (fromDate, toDate, pageSize) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;

    if (!pageSize) {
      pageSize = 5;
    }
    const businessData = await Bd.getBusinessData();

    if (!fromDate || !toDate) {
      query = db.salesquotation.find({
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
      query = db.salesquotation.find({
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

  getSalesQuotationListByCustomer = async (fromDate, toDate, phoneNo) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;
    const businessData = await Bd.getBusinessData();

    if (phoneNo) {
      query = db.salesquotation.find({
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
              customer_phoneNo: { $eq: phoneNo }
            }
          ]
        }
        // sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });
    } else {
      if (fromDate && toDate) {
        query = db.salesquotation.find({
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
    }
    runInAction(() => {
      this.salesData = [];
    });

    if (query) {
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
          console.log('Internal Server Error', err);
        });
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
          transSettings.salesQuotation.prefixSequence &&
          transSettings.salesQuotation.prefixSequence.length > 0
            ? transSettings.salesQuotation.prefixSequence[0].prefix
            : '';
      });
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      runInAction(() => {
        this.invoiceData.prefix = localStorage.getItem('deviceName');
        this.invoiceData.subPrefix = 'EST';
      });
      isOnline = false;
    }

    this.saleDetails.sequenceNumber = await sequence.getFinalSequenceNumber(
      this.invoiceData,
      'Sales Quotation',
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
  };

  handleSalesQuotationSearch = async (value) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.salesquotation
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

  generateInvoiceNumber = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('i');
    this.saleDetails.invoice_number = `${id}${appId}${timestamp}`;
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
      this.isRestore = false;
    });
  }
  saveDataAndNew = async (isPrint) => {
    this.saveAndNew = true;
    await this.saveData(isPrint);
  };

  viewOrEditSaleTxnItem = async (item) => {
    await this.viewOrEditItem(item);
  };

  deleteSaleTxnItem = async (item) => {
    // console.log('delete::', item);
    this.existingSaleData = item;
    this.items = item.item_list;

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      invoice_number: item.invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      estimateType: item.estimateType,
      notes: item.notes,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      customer_address: item.customer_address,
      customer_phoneNo: item.customer_phoneNo,
      customer_city: item.customer_city,
      customer_emailId: item.customer_emailId,
      customer_pincode: item.customer_pincode,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };
    this.saleDetails = saleDetails;

    await this.deleteData();
  };

  saveData = async (isPrint) => {
    if (!this.saleDetails.invoice_number) {
      this.generateInvoiceNumber();
    }

    let filteredArray = [];

    for (var i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if (item.item_name === '') {
        continue;
      }

      item.itemNumber = parseInt(i) + 1;

      if (item.batch_id === null || item.batch_id === '') {
        item.batch_id = 0;
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

      if (
        item.makingChargeIncluded === null ||
        item.makingChargeIncluded === ''
      ) {
        item.makingChargeIncluded = false;
      }

      if (item.freeQty === null || item.freeQty === '') {
        item.freeQty = 0;
      }

      if (item.unitConversionQty === null || item.unitConversionQty === '') {
        item.unitConversionQty = 0;
      }

      if (
        item.originalMrpWithoutConversionQty === null ||
        item.originalMrpWithoutConversionQty === ''
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

      if (
        item.itemNumber === null ||
        item.itemNumber === '' ||
        item.itemNumber === undefined
      ) {
        item.itemNumber = 0;
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
      this.saleDetails.convertQuotationToSale === null ||
      this.saleDetails.convertQuotationToSale === ''
    ) {
      this.saleDetails.convertQuotationToSale = false;
    }

    if (
      this.saleDetails.estimateType === null ||
      this.saleDetails.estimateType === ''
    ) {
      this.saleDetails.estimateType = 'open';
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

    if (
      this.saleDetails.sequenceNumber === '' ||
      this.saleDetails.sequenceNumber === undefined
    ) {
      await this.getSequenceNumber(
        this.saleDetails.invoice_date,
        this.saleDetails.invoice_number
      );
    }

    if (this.saleDetails.sequenceNumber === '0') {
      this.saleDetails.sequenceNumber = '';
      this.handleCloseSaleQuotationLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    /**
     * save into sales table
     */
    let InsertDoc = this.saleDetails;
    InsertDoc.item_list = this.items;

    /**
     * updated date
     */
    InsertDoc.updatedAt = Date.now();
    InsertDoc.posId = parseFloat(businessData.posDeviceId);

    if (this.isRestore) {
      InsertDoc.employeeId = this.saleDetails.employeeId;
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

    if (this.isRestore) {
      await this.markSaleQuotationRestored();
    }

    allTxn.saveTxnFromSalesQuotation(InsertDoc, db);

    let userAction = 'Save';

    if (this.isRestore) {
      userAction = 'Restore';
    }

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.invoice_number,
      InsertDoc.sequenceNumber,
      'Quotation',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.invoice_date
    );

    try {
      await db.salesquotation.insert(InsertDoc).then(async (data) => {
        if (isPrint) {
          if (
            this.salesInvoiceThermal &&
            this.salesInvoiceThermal.boolDefault
          ) {
            sendContentForThermalPrinter(
              '',
              this.salesInvoiceThermal,
              data,
              this.salesTransSettingData,
              'Sales Quotation'
            );
          }
        }

        this.handleCloseSaleQuotationLoadingMessage();
        if (
          this.salesInvoiceRegular &&
          this.salesInvoiceRegular.boolDefault &&
          isPrint
        ) {
          runInAction(() => {
            this.printSaleQuotationData = InsertDoc;

            this.resetAllData();
            this.closeDialog();
            // this.isSaveOrUpdateOrDeleteClicked = false;
            if (this.saveAndNew) {
              this.saveAndNew = false;
              this.openForNewSale();
            }

            runInAction(async () => {
              this.isSalesList = true;
              this.invoiceData = {};
            });

            this.handleOpenSaleQuotationPrintSelectionAlertMessage();
          });
        } else {
          this.resetAllData();
          this.closeDialog();
          // this.isSaveOrUpdateOrDeleteClicked = false;
          if (this.saveAndNew) {
            this.saveAndNew = false;
            this.openForNewSale();
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
        InsertDoc.invoice_number,
        InsertDoc.sequenceNumber,
        'Quotation',
        userAction,
        JSON.stringify(InsertDoc),
        err.message ? err.message : 'Quotation Failed',
        InsertDoc.invoice_date
      );
      this.handleCloseSaleQuotationLoadingMessage();
      this.handleOpenSaleQuotationErrorAlertMessage();
    }
  };

  updateSaleInformation = async (isPrint) => {
    if (
      this.existingSaleData.invoice_number &&
      this.existingSaleData.invoice_number === 0
    ) {
      // console.log('invoice_number not present');
      // Cannot delete if item Number is not available
      return;
    }

    /**
     * updated date
     */
    this.saleDetails.updatedAt = Date.now();

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.salesquotation.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { invoice_number: { $eq: this.existingSaleData.invoice_number } }
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

        //1) status is "Paid"
        if (!this.saleDetails.is_credit) {
          /**
           * during edit sale can be modified by credit sale
           *
           * 2 changes will happen, txn can have linked amount, txn can have a balance
           */
          //2)  status is Credit
        }

        /**
         * delete index field
         */
        this.items.forEach(async (item) => {
          delete item['index'];
        });

        let updateData = this.saleDetails;

        let txnData = this.saleDetails;
        txnData.item_list = this.items;

        allTxn.deleteAndSaveTxnFromSalesQuotation(
          this.existingSaleData,
          txnData,
          db
        );

        let auditData = {};

        auditData = { ...updateData };
        auditData.item_list = this.items;

        audit.addAuditEvent(
          updateData.invoice_number,
          updateData.sequenceNumber,
          'Quotation',
          'Update',
          JSON.stringify(auditData),
          '',
          updateData.invoice_date
        );

        try {
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
                    updateData,
                    this.salesTransSettingData,
                    'Sales Quotation'
                  );
                }
              }

              if (this.isRestore) {
                await this.markSaleQuotationRestored();
              }

              this.handleCloseSaleQuotationLoadingMessage();
              if (
                this.salesInvoiceRegular &&
                this.salesInvoiceRegular.boolDefault &&
                isPrint
              ) {
                runInAction(() => {
                  this.printSaleQuotationData = txnData;

                  /**
                   * make global variables to nulls again
                   */
                  this.resetAllData();

                  this.closeDialog();
                  if (this.saveAndNew) {
                    this.saveAndNew = false;
                    this.openForNewSale();
                  }

                  runInAction(async () => {
                    this.isSalesList = true;
                  });

                  this.handleOpenSaleQuotationPrintSelectionAlertMessage();
                });
              } else {
                /**
                 * make global variables to nulls again
                 */
                this.resetAllData();

                this.closeDialog();
                if (this.saveAndNew) {
                  this.saveAndNew = false;
                  this.openForNewSale();
                }

                runInAction(async () => {
                  this.isSalesList = true;
                });
              }
            });
        } catch (err) {
          audit.addAuditEvent(
            updateData.invoice_number,
            updateData.sequenceNumber,
            'Quotation',
            'Update',
            JSON.stringify(auditData),
            err.message,
            updateData.invoice_date
          );
          this.handleCloseSaleQuotationLoadingMessage();
          this.handleOpenSaleQuotationErrorAlertMessage();
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);

        this.handleCloseSaleQuotationLoadingMessage();
        this.handleOpenSaleQuotationErrorAlertMessage();
      });
  };

  /**
   * delete sale entry
   */
  deleteData = async (saleDetails, employeeId) => {
    //save to audit
    audit.addAuditEvent(
      saleDetails.invoice_number,
      saleDetails.sequenceNumber,
      'Quotation',
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

    let restoreSalesData = {};
    restoreSalesData = saleDetails;
    restoreSalesData.item_list = this.items;
    restoreSalesData.employeeId = employeeId;

    DeleteDataDoc.transactionId = saleDetails.invoice_number;
    DeleteDataDoc.sequenceNumber = saleDetails.sequenceNumber;
    DeleteDataDoc.transactionType = 'Sales Quotation';
    DeleteDataDoc.data = JSON.stringify(restoreSalesData);
    DeleteDataDoc.total = saleDetails.total_amount;
    DeleteDataDoc.balance = 0;
    DeleteDataDoc.createdDate = saleDetails.invoice_date;

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    const db = await Db.get();

    await allTxn.deleteTxnFromSalesQuotation(saleDetails, db);
    const businessData = await Bd.getBusinessData();

    const query = db.salesquotation.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { invoice_number: { $eq: saleDetails.invoice_number } }
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
         * delete from product txn table
         */
        let txnData = saleDetails;
        txnData.item_list = this.items;

        /**
         * delete from table
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
              saleDetails.invoice_number,
              saleDetails.sequenceNumber,
              'Quotation',
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
          stockQty: 0,
          wastagePercentage: '',
          wastageGrams: '',
          grossWeight: '',
          netWeight: '',
          purity: '',
          hsn: '',
          makingChargePercent: 0,
          makingChargeAmount: 0,
          makingChargeType: '',
          makingChargePerGramAmount: 0,
          makingChargeIncluded: false,
          freeQty: 0,
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
          pricePerGram: 0,
          stoneWeight: 0,
          stoneCharge: 0,
          serialOrImeiNo: '',
          itemNumber: 0,
          originalDiscountPercent: 0,
          dailyRate: '',
          properties: [],
          hallmarkCharge: 0,
          certificationCharge: 0,
          purchased_price_before_tax: 0
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
        stockQty: 0,
        wastagePercentage: '',
        wastageGrams: '',
        grossWeight: '',
        netWeight: '',
        purity: '',
        hsn: '',
        makingChargePercent: 0,
        makingChargeAmount: 0,
        makingChargeType: '',
        makingChargePerGramAmount: 0,
        makingChargeIncluded: false,
        freeQty: 0,
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
        pricePerGram: 0,
        stoneWeight: 0,
        stoneCharge: 0,
        serialOrImeiNo: '',
        itemNumber: 0,
        originalDiscountPercent: 0,
        dailyRate: '',
        properties: [],
        hallmarkCharge: 0,
        certificationCharge: 0,
        purchased_price_before_tax: 0
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

  setFileUploadImageUrls = (files) => {
    runInAction(() => {
      this.saleDetails.imageUrls = files;
    });
  };

  setItemBrand = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].brandName = value;
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
                this.openSaleErrorAlertMessage = true;
                this.items[index].serialOrImeiNo = '';
              });
            } else {
              this.converToSelectedProduct(actualProduct);
              this.selectedIndex = index;
              runInAction(() => {
                if (this.salesTxnEnableFieldsMap.get('enable_product_price')) {
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
                  this.salesTxnEnableFieldsMap.get(
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

  setItemModelNo = (index, value) => {
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
      this.items[index].offer_price = value;
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
      this.items[index].originalMrpWithoutConversionQty = value
        ? parseFloat(value)
        : '';
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
              this.items[index].description = actualProduct.description;
              this.items[index].imageUrl = actualProduct.imageUrl;
              this.items[index].barcode = actualProduct.barcode;
              this.items[index].sku = actualProduct.sku;
              this.items[index].product_id = actualProduct.productId;
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
              this.items[index].modelNo = actualProduct.modelNo;

              this.items[index].mfDate = actualProduct.mfDate;
              this.items[index].expiryDate = actualProduct.expiryDate;
              this.items[index].rack = actualProduct.rack;
              this.items[index].warehouseData = actualProduct.warehouseData;

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
      this.items[index].amount = 0;
      this.getAmount(index);
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
    this.getAmount(index);
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

  calculateTaxAndDiscountValue = async (index) => {
    const mrp = parseFloat(this.items[index].mrp || 0);
    const quantity = parseFloat(this.items[index].qty) || 1;
    const offerPrice = parseFloat(this.items[index].offer_price || 0);

    let tax =
      (parseFloat(this.items[index].cgst) || 0) +
      (parseFloat(this.items[index].sgst) || 0);
    let igst_tax = parseFloat(this.items[index].igst || 0);

    const taxIncluded = this.items[index].taxIncluded;

    /*if (!mrp || mrp === 0 || !quantity || quantity === 0) {
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
    this.saleDetails.invoice_number = value;
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

  setInvoiceDate = (value) => {
    this.saleDetails.invoice_date = value;
  };

  setInvoiceDatePrefix = (value) => {
    this.invoiceData.datePrefix = value;
  };

  setCustomerName = (value) => {
    this.saleDetails.customer_name = value;
  };

  setCustomerId = (value) => {
    this.saleDetails.customer_id = value;
  };

  setCustomer = async (customer, isNewCustomer) => {
    this.saleDetails.customer_id = customer.id;
    this.saleDetails.customer_name = customer.name;
    this.saleDetails.customerGSTNo = customer.gstNumber;
    this.saleDetails.customerGstType = customer.gstType;
    this.saleDetails.customer_emailId = customer.emailId;
    this.saleDetails.customer_phoneNo = customer.phoneNo;

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
      invoice_number: item.invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      estimateType: item.estimateType,
      notes: item.notes,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      customer_address: item.customer_address,
      customer_phoneNo: item.customer_phoneNo,
      customer_city: item.customer_city,
      customer_emailId: item.customer_emailId,
      customer_pincode: item.customer_pincode,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };
    this.saleDetails = saleDetails;

    this.deleteData(saleDetails, item.employeeId);
  };

  viewOrEditSaleQuotationItem = async (item) => {
    this.viewOrEditItem(item);
  };

  viewOrEditItem = async (item) => {
    await this.initializeSettings();

    runInAction(() => {
      this.OpenAddsalesQuotationInvoice = true;
      this.isUpdate = true;
      this.existingSaleData = item;
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.invoiceData = {};
    });

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      invoice_number: item.invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      estimateType: item.estimateType,
      notes: item.notes,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      customer_address: item.customer_address,
      customer_phoneNo: item.customer_phoneNo,
      customer_city: item.customer_city,
      customer_emailId: item.customer_emailId,
      customer_pincode: item.customer_pincode,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    this.items = item.item_list;

    this.saleDetails = saleDetails;
    await this.checkForTaxAndLoadUI();
  };

  closeDialog = () => {
    runInAction(() => {
      this.OpenAddsalesQuotationInvoice = false;
      this.enabledRow = 0;
    });
  };

  openForNewSale = async () => {
    await this.initializeSettings();
    const currentDate = getTodayDateInYYYYMMDD();

    this.isUpdate = false;
    this.OpenAddsalesQuotationInvoice = true;
    this.generateInvoiceNumber();
    this.openSaleQuotationPrintSelectionAlert = false;
    this.printSaleQuotationData = null;
    this.printSaleQuotationBalance = {};
    this.isCGSTSGSTEnabledByPOS = true;
    this.isComingFromProductSearch = false;
    this.saleDetails = {
      businessId: '',
      businessCity: '',
      customer_id: '',
      customer_name: '',
      customerGSTNo: null,
      customerGstType: '',
      invoice_date: currentDate,
      is_roundoff: false,
      round_amount: 0.0,
      total_amount: 0.0,
      updatedAt: '',
      discount_percent: 0,
      discount_amount: 0,
      discount_type: '',
      packing_charge: 0,
      shipping_charge: 0,
      sequenceNumber: '',
      estimateType: 'open',
      notes: '',
      customerState: '',
      customerCountry: '',
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
        stockQty: 0,
        wastagePercentage: '',
        wastageGrams: '',
        grossWeight: '',
        netWeight: '',
        purity: '',
        hsn: '',
        makingChargePercent: 0,
        makingChargeAmount: 0,
        makingChargeType: '',
        makingChargePerGramAmount: 0,
        makingChargeIncluded: false,
        freeQty: 0,
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
        pricePerGram: 0,
        stoneWeight: 0,
        stoneCharge: 0,
        serialOrImeiNo: '',
        itemNumber: 0,
        originalDiscountPercent: 0,
        dailyRate: '',
        properties: [],
        hallmarkCharge: 0,
        certificationCharge: 0,
        purchased_price_before_tax: 0
      }
    ];

    this.salesInvoiceRegular = {};
    this.salesInvoiceThermal = {};
    this.invoiceData = {};
    await this.checkForTaxAndLoadUI();
  };

  handleBatchListModalClose = (val) => {
    this.OpenQuotationBatchList = false;
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
      parseFloat(newProduct.salePrice) ===
        parseFloat(product.originalMrpWithoutConversionQty)
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
      stockQty: 0,
      wastagePercentage: '',
      wastageGrams: '',
      grossWeight: '',
      netWeight: '',
      purity: '',
      hsn: '',
      makingChargePercent: 0,
      makingChargeAmount: 0,
      makingChargeType: '',
      makingChargePerGramAmount: 0,
      makingChargeIncluded: false,
      freeQty: 0,
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
      pricePerGram: 0,
      stoneWeight: 0,
      stoneCharge: 0,
      serialOrImeiNo: '',
      itemNumber: 0,
      originalDiscountPercent: 0,
      dailyRate: '',
      properties: [],
      hallmarkCharge: 0,
      certificationCharge: 0,
      purchased_price_before_tax: 0
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
      this.selectedProduct.vendorName = item.vendorName;
      this.selectedProduct.vendorPhoneNumber = item.vendorPhoneNumber;
      this.selectedProduct.taxType = item.taxType;
      this.selectedProduct.stockQty = item.stockQty;
      this.selectedProduct.batchData = item.batchData;
      this.selectedProduct.serialData = item.serialData;
      this.selectedProduct.categoryLevel2 = item.categoryLevel2;
      this.selectedProduct.categoryLevel3 = item.categoryLevel3;
      this.selectedProduct.brandName = item.brandName;

      this.selectedProduct.description = item.description;
      this.selectedProduct.imageUrl = item.imageUrl;

      // units addition
      this.selectedProduct.primaryUnit = item.primaryUnit;
      this.selectedProduct.secondaryUnit = item.secondaryUnit;
      this.selectedProduct.units =
        item.units && item.units !== null && item.units.length > 2
          ? item.units.slice(0, 2)
          : item.units;
      this.selectedProduct.unitConversionQty = item.unitConversionQty;
      this.selectedProduct.saleDiscountAmount = item.saleDiscountAmount;
      this.selectedProduct.saleDiscountPercent = item.saleDiscountPercent;
      this.selectedProduct.saleDiscountType = item.saleDiscountType;
      this.selectedProduct.purchaseCgst = item.purchaseCgst;
      this.selectedProduct.purchaseSgst = item.purchaseSgst;
      this.selectedProduct.purchaseTaxIncluded = item.purchaseTaxIncluded;
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
      categoryLevel2,
      categoryLevel3,
      brandName,
      vendorName,
      vendorPhoneNumber,
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
      certificationCharge,
      purchaseCgst,
      purchaseSgst,
      purchaseTaxIncluded
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
      if (this.isComingFromProductSearch === false) {
        this.resetSingleProduct(index);
      }
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
            this.OpenQuotationBatchList = true;
          });
        } else if (batchData.length === 1) {
          let firstBatchData = batchData[0];
          runInAction(() => {
            if (this.salesTxnEnableFieldsMap.get('enable_product_price')) {
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
              this.salesTxnEnableFieldsMap.get('enable_product_price_per_gram')
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

            let tax =
              (parseFloat(purchaseCgst) || 0) + (parseFloat(purchaseSgst) || 0);

            let totalGST = 0;

            if (purchaseTaxIncluded) {
              totalGST =
                firstBatchData.purchasedPrice -
                firstBatchData.purchasedPrice * (100 / (100 + tax));
            }
            this.items[index].purchased_price_before_tax = parseFloat(
              firstBatchData.purchasedPrice - parseFloat(totalGST)
            ).toFixed(2);
            this.items[index].purchased_price_before_tax = parseFloat(
              this.items[index].purchased_price_before_tax
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
            this.items[index].batchNumber = firstBatchData.batchNumber;
            this.items[index].modelNo = firstBatchData.modelNo;
            this.items[index].barcode = firstBatchData.barcode;

            salePercent = firstBatchData.saleDiscountPercent;
          });
          this.addNewItem(true, false);
        }
      } else if (serialData.length > 0) {
        runInAction(() => {
          this.converToSelectedProduct(productItem);
          this.selectedIndex = index;
          this.OpenSaleQuotationSerialList = true;
        });
      } else {
        runInAction(() => {
          if (this.salesTxnEnableFieldsMap.get('enable_product_price')) {
            this.items[index].mrp = parseFloat(salePrice);
            if (offerPrice > 0) {
              this.items[index].offer_price = parseFloat(offerPrice);
            } else {
              this.items[index].offer_price = parseFloat(salePrice);
            }
          } else if (
            this.salesTxnEnableFieldsMap.get('enable_product_price_per_gram')
          ) {
            this.items[index].pricePerGram = parseFloat(salePrice);
          }

          this.items[index].originalMrpWithoutConversionQty =
            parseFloat(salePrice);
          this.items[index].purchased_price = parseFloat(purchasedPrice);
          let tax =
            (parseFloat(purchaseCgst) || 0) + (parseFloat(purchaseSgst) || 0);

          let totalGST = 0;

          if (purchaseTaxIncluded) {
            totalGST = purchasedPrice - purchasedPrice * (100 / (100 + tax));
          }
          this.items[index].purchased_price_before_tax = parseFloat(
            purchasedPrice - parseFloat(totalGST)
          ).toFixed(2);
          this.items[index].purchased_price_before_tax = parseFloat(
            this.items[index].purchased_price_before_tax
          );

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
          stockQty: 0,
          wastagePercentage: '',
          wastageGrams: '',
          grossWeight: '',
          netWeight: '',
          purity: '',
          hsn: '',
          makingChargePercent: 0,
          makingChargeAmount: 0,
          makingChargeType: '',
          makingChargePerGramAmount: 0,
          makingChargeIncluded: false,
          freeQty: 0,
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
          pricePerGram: 0,
          stoneWeight: 0,
          stoneCharge: 0,
          serialOrImeiNo: '',
          itemNumber: 0,
          originalDiscountPercent: 0,
          dailyRate: '',
          properties: [],
          hallmarkCharge: 0,
          certificationCharge: 0,
          purchased_price_before_tax: 0
        });
      }

      runInAction(async () => {
        this.items[index].item_name = name;
        this.items[index].description = description;
        this.items[index].imageUrl = imageUrl;
        this.items[index].sku = sku;
        this.items[index].product_id = productId;
        this.items[index].cess = cess;
        this.items[index].taxIncluded = taxIncluded;
        this.items[index].taxType = taxType;
        this.items[index].stockQty = stockQty;
        this.items[index].hsn = hsn;
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

        // categories
        this.items[index].categoryLevel2 = categoryLevel2.name;
        this.items[index].categoryLevel2DisplayName =
          categoryLevel2.displayName;
        this.items[index].categoryLevel3 = categoryLevel3.name;
        this.items[index].categoryLevel3DisplayName =
          categoryLevel3.displayName;

        this.items[index].brandName = brandName;

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
        if (this.salesTxnEnableFieldsMap.get('enable_product_price')) {
          this.items[this.selectedIndex].mrp = parseFloat(salePrice);
          if (offerPrice > 0) {
            this.items[this.selectedIndex].offer_price = parseFloat(offerPrice);
          } else {
            this.items[this.selectedIndex].offer_price = parseFloat(salePrice);
          }
        } else if (
          this.salesTxnEnableFieldsMap.get('enable_product_price_per_gram')
        ) {
          this.items[this.selectedIndex].pricePerGram = parseFloat(salePrice);
        }

        this.items[this.selectedIndex].originalMrpWithoutConversionQty =
          parseFloat(salePrice);
        this.items[this.selectedIndex].purchased_price =
          parseFloat(purchasedPrice);

        let tax =
          (parseFloat(this.selectedProduct.purchaseCgst) || 0) +
          (parseFloat(this.selectedProduct.purchaseSgst) || 0);

        let totalGST = 0;

        if (this.selectedProduct.purchaseTaxIncluded) {
          totalGST =
            this.selectedProduct.purchasedPrice -
            this.selectedProduct.purchasedPrice * (100 / (100 + tax));
        }
        this.items[this.selectedIndex].purchased_price_before_tax = parseFloat(
          this.selectedProduct.purchasedPrice - parseFloat(totalGST)
        ).toFixed(2);
        this.items[this.selectedIndex].purchased_price_before_tax = parseFloat(
          this.items[this.selectedIndex].purchased_price_before_tax
        );

        this.items[this.selectedIndex].stockQty = qty;

        this.items[this.selectedIndex].batch_id = batchItem.id;

        this.items[this.selectedIndex].vendorName = batchItem.vendorName;
        this.items[this.selectedIndex].vendorPhoneNumber =
          batchItem.vendorPhoneNumber;

        this.items[this.selectedIndex].mfDate = mfDate;
        this.items[this.selectedIndex].expiryDate = expiryDate;
        this.items[this.selectedIndex].rack = rack;
        this.items[this.selectedIndex].warehouseData = warehouseData;
        this.items[this.selectedIndex].batchNumber = batchNumber;
        this.items[this.selectedIndex].modelNo = modelNo;
        this.items[this.selectedIndex].barcode = barcode;
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
      let billdiscount = this.saleDetails.discountPercentForAllItems
        ? parseFloat(this.saleDetails.discountPercentForAllItems)
        : 0;
      this.items[this.selectedIndex].originalDiscountPercent =
        saleDiscountPercent + billdiscount;
      this.setItemDiscount(
        this.selectedIndex,
        this.items[this.selectedIndex].originalDiscountPercent
      );
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

  setNotes = (value) => {
    this.saleDetails.notes = value;
  };

  handleSaleQuotationByEmployeeSearch = async (
    value,
    fromDate,
    toDate,
    employeeId
  ) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    if (employeeId != null) {
      const businessData = await Bd.getBusinessData();

      let query = db.salesquotation.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                {
                  $and: [
                    { sequenceNumber: { $regex: regexp } },
                    { employeeId: { $eq: employeeId } },
                    { invoice_date: { $gte: fromDate } },
                    { invoice_date: { $lte: toDate } }
                  ]
                },
                {
                  $and: [
                    { total_amount: { $eq: parseFloat(value) } },
                    { employeeId: { $eq: employeeId } },
                    { invoice_date: { $gte: fromDate } },
                    { invoice_date: { $lte: toDate } }
                  ]
                },
                {
                  $and: [
                    { customer_name: { $regex: regexp } },
                    { employeeId: { $eq: employeeId } },
                    { invoice_date: { $gte: fromDate } },
                    { invoice_date: { $lte: toDate } }
                  ]
                },
                {
                  $and: [
                    { estimateType: { $regex: regexp } },
                    { employeeId: { $eq: employeeId } },
                    { invoice_date: { $gte: fromDate } },
                    { invoice_date: { $lte: toDate } }
                  ]
                }
              ]
            }
          ]
        }
      });

      await query.exec().then(async (documents) => {
        // data = documents.map((item) => item);

        documents.map((item) => {
          let row = item.toJSON();
          data.push(row);
        });
      });
      return data;
    }
  };

  handleSaleQuotationByDateSearch = async (value, fromDate, toDate) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    let query = db.salesquotation.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            $or: [
              {
                $and: [
                  { sequenceNumber: { $regex: regexp } },
                  { invoice_date: { $gte: fromDate } },
                  { invoice_date: { $lte: toDate } }
                ]
              },
              {
                $and: [
                  { total_amount: { $eq: parseFloat(value) } },
                  { invoice_date: { $gte: fromDate } },
                  { invoice_date: { $lte: toDate } }
                ]
              },
              {
                $and: [
                  { customer_name: { $regex: regexp } },
                  { invoice_date: { $gte: fromDate } },
                  { invoice_date: { $lte: toDate } }
                ]
              },
              {
                $and: [
                  { estimateType: { $regex: regexp } },
                  { invoice_date: { $gte: fromDate } },
                  { invoice_date: { $lte: toDate } }
                ]
              }
            ]
          }
        ]
      }
    });

    await query.exec().then(async (documents) => {
      // data = documents.map((item) => item);

      documents.map((item) => {
        let row = item.toJSON();
        data.push(row);
      });
    });
    return data;
  };

  viewAndRestoreSaleQuotationItem = async (item) => {
    runInAction(() => {
      this.OpenAddsalesQuotationInvoice = true;
      this.isUpdate = false;
      this.isRestore = true;
      this.existingSaleData = item;
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.invoiceData = {};
    });

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      invoice_number: item.invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      estimateType: item.estimateType,
      notes: item.notes,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      customer_address: item.customer_address,
      customer_phoneNo: item.customer_phoneNo,
      customer_city: item.customer_city,
      customer_emailId: item.customer_emailId,
      customer_pincode: item.customer_pincode,
      employeeId: item.employeeId,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    this.items = item.item_list;

    this.saleDetails = saleDetails;
  };

  restoreSaleQuotationItem = async (item, isRestoreWithNextSequenceNo) => {
    runInAction(() => {
      this.isRestore = true;
      this.isUpdate = false;
      this.existingSaleData = item;
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.invoiceData = {};
    });

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      invoice_number: item.invoice_number,
      invoice_date: item.invoice_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      posId: item.posId,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      sequenceNumber: item.sequenceNumber,
      estimateType: item.estimateType,
      notes: item.notes,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      customer_address: item.customer_address,
      customer_phoneNo: item.customer_phoneNo,
      customer_city: item.customer_city,
      customer_emailId: item.customer_emailId,
      customer_pincode: item.customer_pincode,
      employeeId: item.employeeId,
      isSyncedToServer: item.isSyncedToServer,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    this.items = item.item_list;

    this.saleDetails = saleDetails;

    if (isRestoreWithNextSequenceNo) {
      this.saleDetails.invoice_date = getTodayDateInYYYYMMDD();

      await this.generateInvoiceNumber();
      await this.getSequenceNumber(
        this.saleDetails.invoice_date,
        this.saleDetails.invoice_number
      );
    }

    await this.saveData(false);
  };

  markSaleQuotationRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: this.saleDetails.invoice_number } }
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

  handleOpenSaleQuotationLoadingMessage = async () => {
    runInAction(() => {
      this.openSaleQuotationLoadingAlertMessage = true;
    });
  };

  handleCloseSaleQuotationLoadingMessage = async () => {
    runInAction(() => {
      this.openSaleQuotationLoadingAlertMessage = false;
    });
  };

  handleOpenSaleQuotationErrorAlertMessage = async () => {
    runInAction(() => {
      this.openSaleQuotationErrorAlertMessage = true;
    });
  };

  handleCloseSaleQuotationErrorAlertMessage = async () => {
    runInAction(() => {
      this.openSaleQuotationErrorAlertMessage = false;
    });
  };

  handleOpenSaleQuotationPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openSaleQuotationPrintSelectionAlert = true;
    });
  };

  handleCloseSaleQuotationPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openSaleQuotationPrintSelectionAlert = false;
    });
  };

  resetSaleQuotationPrintData = async () => {
    runInAction(() => {
      this.printSaleQuotationData = null;
      this.printSaleQuotationBalance = {};
      this.openSaleQuotationPrintSelectionAlert = false;
    });
  };

  setRoundingConfiguration = (value) => {
    this.roundingConfiguration = value;
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

  setCGSTSGSTEnabledByPOS = (value) => {
    runInAction(() => {
      this.isCGSTSGSTEnabledByPOS = value;
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
          if (igst > 0) {
            this.items[i].cgst = igst / 2;
            this.items[i].sgst = igst / 2;
          }
          this.items[i].igst = 0;
        } else {
          if (cgst > 0) {
            this.items[i].igst = cgst * 2;
          }
          this.items[i].cgst = 0;
          this.items[i].sgst = 0;
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
      this.OpenSaleQuotationSerialList = false;
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
        this.openSaleErrorAlertMessage = true;
      });
    } else {
      runInAction(() => {
        if (this.salesTxnEnableFieldsMap.get('enable_product_price')) {
          this.items[this.selectedIndex].mrp = parseFloat(
            selectedProduct.salePrice
          );
          if (selectedProduct.offerPrice > 0) {
            this.items[this.selectedIndex].offer_price = parseFloat(
              selectedProduct.offerPrice
            );
          } else {
            this.items[this.selectedIndex].offer_price = parseFloat(
              selectedProduct.salePrice
            );
          }
        } else if (
          this.salesTxnEnableFieldsMap.get('enable_product_price_per_gram')
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

        let tax =
          (parseFloat(this.selectedProduct.purchaseCgst) || 0) +
          (parseFloat(this.selectedProduct.purchaseSgst) || 0);

        let totalGST = 0;

        if (this.selectedProduct.purchaseTaxIncluded) {
          totalGST =
            selectedProduct.purchasedPrice -
            selectedProduct.purchasedPrice * (100 / (100 + tax));
        }
        this.items[this.selectedIndex].purchased_price_before_tax = parseFloat(
          selectedProduct.purchasedPrice - parseFloat(totalGST)
        ).toFixed(2);
        this.items[this.selectedIndex].purchased_price_before_tax = parseFloat(
          this.items[this.selectedIndex].purchased_price_before_tax
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
        this.items[this.selectedIndex].serialOrImeiNo = serialImeiNo;
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
  handleOpenSaleErrorAlertMessage = async (message) => {
    runInAction(() => {
      this.openSaleErrorAlertMessage = true;
      this.errorAlertMessage = message;
    });
  };

  handleCloseSaleErrorAlertMessage = async () => {
    runInAction(() => {
      this.openSaleErrorAlertMessage = false;
      this.errorAlertMessage = '';
    });
  };

  setRateMetalList = (list) => {
    runInAction(() => {
      this.metalList = list;
    });
  };

  convertJobWorkInToSaleQuotation = async (item) => {
    await this.initializeSettings();
    this.jobWorkInDetails = item.toJSON();

    runInAction(() => {
      this.OpenAddsalesQuotationInvoice = true;
      this.isUpdate = false;
      this.isRestore = false;
      this.existingSaleData = item;
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.isCGSTSGSTEnabledByPOS = true;
      this.invoiceData = {};
      this.isComingFromProductSearch = false;
    });

    const saleDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_address: item.customer_address,
      customer_phoneNo: item.customer_phoneNo,
      customer_city: item.customer_city,
      customer_emailId: item.customer_emailId,
      customer_pincode: item.customer_pincode,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      posId: item.posId,
      invoice_number: '',
      invoice_date: '',
      updatedAt: '',
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      packing_charge: item.packing_charge || 0,
      shipping_charge: item.shipping_charge || 0,
      sequenceNumber: '',
      convertQuotationToSale: false,
      estimateType: 'open',
      notes: item.notes,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      isSyncedToServer: false,
      discountPercentForAllItems: 0,
      imageUrls: []
    };

    /**
     * in case of online order no edit is allowed.
     */
    this.items = [];

    if (item.posId === 0) {
      for (let i of item.item_list) {
        i.isEdit = false;

        delete i['isSelected'];
        delete i['copperGrams'];

        if (i.amount > 0) {
          this.items.push(i);
        }
      }
    } else {
      for (let i of item.item_list) {
        delete i['isSelected'];
        delete i['copperGrams'];

        if (i.amount > 0) {
          this.items.push(i);
        }
      }
    }

    this.saleDetails = saleDetails;

    this.checkForTaxAndLoadUI();

    //remove un wanted fields

    this.generateInvoiceNumber();
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
    await this.initializeSettings();
    let saleDetails = JSON.parse(JSON.stringify(item));

    /**
     * in case of online order no edit is allowed.
     */
    if (item.posId === 0) {
      this.items = [];
      for (let i of saleDetails.item_list) {
        i.isEdit = false;
        this.items.push(i);
      }
    } else {
      this.items = saleDetails.item_list;
    }

    runInAction(async () => {
      this.saleDetails = saleDetails;
      this.saleDetails.sequenceNumber = '';
      this.saleDetails.invoice_number = '';
      this.saleDetails.estimateType = 'open';
      this.saleDetails.convertQuotationToSale = false;
      this.saleDetails.invoice_date = getTodayDateInYYYYMMDD();
      await this.checkForTaxAndLoadUI();
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
    if (revalidateTax && revalidateTax === true) {
      this.revalidateItemsTaxRate();
    }
  };

  initializeData = () => {
    runInAction(async () => {
      this.isUpdate = false;
      this.OpenAddsalesQuotationInvoice = true;
      this.openSaleQuotationPrintSelectionAlert = false;
      this.printSaleQuotationData = null;
      this.printSaleQuotationBalance = {};
      this.isCGSTSGSTEnabledByPOS = true;
      this.isComingFromProductSearch = false;
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

  handleOpenProductDetails = async () => {
    runInAction(() => {
      this.isComingFromProductSearch = true;
      this.openProductDetails = true;
    });
  };

  handleCloseProductDetails = async () => {
    runInAction(() => {
      this.isComingFromProductSearch = false;
      this.openProductDetails = false;
    });
  };

  initializeSettings = () => {
    runInAction(async () => {
      this.saleAuditDetails = await audit.getAuditSettingsData();
      const saleTransSettings = await getSaleQuotationTransactionSettings();
      await this.setSalesTxnEnableFieldsMap(saleTransSettings);
      await this.setTaxSettingsData(await getTaxSettings());
      if (
        String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
      ) {
        const rateData = await getRateData();
        if (rateData && rateData.length > 0) {
          this.setRateMetalList(rateData);
        }
      }
      this.prepareColumnIndices();
    });
  };

  prepareColumnIndices = () => {
    runInAction(() => {
      this.columnIndexMap = prepareColumnIndexMap(
        this.columnIndexMap,
        this.salesTxnEnableFieldsMap,
        this.taxSettingsData,
        this.isCGSTSGSTEnabledByPOS,
        this.metalList
      );
    });
  };

  setColumnIndex = (value) => {
    runInAction(() => {
      this.columnIndexMap = value;
    });
  };

  handleMoreOptionsMenu = (value) => {
    runInAction(() => {
      this.openMoreOptionsMenu = value;
    });
  };

  constructor() {
    makeObservable(this, {
      saleDetails: observable,
      items: observable,
      getTotalAmount: computed,
      getTotalNetWeight: computed,
      getTotalGrossWeight: computed,
      getTotalWatage: computed,
      getRoundedAmount: computed,
      newCustomer: observable,
      newCustomerData: observable,
      isUpdate: observable,
      OpenAddsalesQuotationInvoice: observable,
      OpenQuotationBatchList: observable,
      selectedProduct: observable,
      FocusLastIndex: observable,
      salesData: observable,
      totalSalesData: observable,
      sales: observable,
      getSalesQuotationData: computed,
      getSalesQuotationDetails: action,
      addSalesQuotationData: action,
      customerList: observable,
      dateDropValue: observable,
      getSalesQuotationCount: action,
      isSalesList: observable,
      enabledRow: observable,
      openRegularPrint: observable,
      addNewRowEnabled: observable,
      salesTxnEnableFieldsMap: observable,
      taxSettingsData: observable,
      isRestore: observable,
      openSaleQuotationPrintSelectionAlert: observable,
      openSaleQuotationErrorAlertMessage: observable,
      openSaleQuotationLoadingAlertMessage: observable,
      descriptionCollapsibleMap: observable,
      openAddressList: observable,
      customerAddressList: observable,
      isCGSTSGSTEnabledByPOS: observable,
      sequenceNumberFailureAlert: observable,
      OpenSaleQuotationSerialList: observable,
      openSaleErrorAlertMessage: observable,
      errorAlertMessage: observable,
      convertJobWorkInToSaleQuotation: observable,
      openProductDetails: observable,
      isComingFromProductSearch: observable,
      columnIndexMap: observable,
      openMoreOptionsMenu: observable
    });
  }
}

export default new SalesQuotationAddStore();