import {
  action,
  computed,
  observable,
  makeObservable,
  toJS,
  runInAction
} from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import _uniqueId from 'lodash/uniqueId';
import * as Bd from '../../components/SelectedBusiness';
import * as linkPayment from '../../components/Helpers/AlltransactionsLinkPaymentHelper';

import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import BatchData from './classes/BatchData';
import getStateList from 'src/components/StateList';
import * as audit from '../../components/Helpers/AuditHelper';
import * as taxSettings from '../../components/Helpers/TaxSettingsHelper';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';
import { getProductDataById } from 'src/components/Helpers/dbQueries/businessproduct';

class PurchaseOrderStore {
  newVendor = false;

  isUpdate = false;

  OpenAddPurchaseOrder = false;

  saveAndNew = false;

  enabledRow = 0;

  newVendorData = {};
  selectedCustomerBalance = 0;
  FocusLastIndex = false;

  // isSaveOrUpdateOrDeleteClicked = false;

  OpenPurchaseOrderBatchList = false;
  selectedProduct = {};

  purchaseOrderTxnEnableFieldsMap = new Map();

  addNewRowEnabled = false;

  isRestore = false;

  descriptionCollapsibleMap = new Map();

  billDetails = {
    businessId: '',
    businessCity: '',
    vendor_id: '',
    vendor_name: '',
    vendor_gst_number: '',
    vendor_gst_type: '',
    vendor_payable: false,
    vendor_phone_number: '',
    is_credit: true,
    purchase_order_invoice_number: 0,
    po_date: '',
    due_date: '',
    is_roundoff: false,
    round_amount: 0.0,
    total_amount: 0.0,
    payment_type: 'cash',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    paid_amount: 0.0,
    balance_amount: 0.0,
    linkedTxnList: [],
    linkPayment: false,
    linked_amount: 0,
    discount_percent: 0,
    discount_amount: 0,
    discount_type: '',
    updatedAt: '',
    place_of_supply: '',
    placeOfSupplyName: '',
    paymentReferenceNumber: '',
    status: 'open',
    notes: '',
    sequenceNumber: '',
    vendorCity: '',
    vendorPincode: '',
    vendorAddress: '',
    vendorState: '',
    vendorCountry: '',
    vendor_email_id: '',
    isSyncedToServer: false,
    vendorMsmeRegNo: '',
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
      purchased_price: 0,
      purchased_price_before_tax: 0,
      mrp: 0,
      offer_price: 0,
      size: 0,
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
      originalPurchasePriceWithoutConversionQty: 0,
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
      serialNo: []
    }
  ];

  paymentLinkTransactions = [];

  openLinkpaymentPage = false;

  /**
   * below filed is for saving all 3 tables unliked transactions list
   */
  paymentUnLinkTransactions = [];
  /**
   * only to store un liked related to sale table
   */
  unLinkedTxnList = [];

  purchasesData = null;
  purchases = [];
  dateDropValue = null;
  vendorList = [];
  isPurchaseOrderList = false;
  isMultiplePurchaseAvailable = false;

  purchasesInvoiceRegular = {};
  purchasesInvoiceThermal = {};

  taxSettingsData = {};

  invoiceData = {};

  printPurchaseOrderData = null;
  openPurchaseOrderLoadingAlertMessage = false;
  openPurchaseOrderErrorAlertMessage = false;

  openPurchaseOrderPrintSelectionAlert = false;

  roundingConfiguration = 'Nearest 50';

  customerAddressList = [];
  customerAddressType = '';
  openAddressList = false;

  purchaseOrderTransSettingData = {};
  isCGSTSGSTEnabledByPOS = true;
  sequenceNumberFailureAlert = false;

  OpenPurchaseOrderSerialList = false;
  openPurchaseOrderValidationMessage = false;
  errorAlertMessage = '';
  placeOfSupplyState = '';

  getPurchaseOrderDetails = async (vendor_id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.purchaseorder
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { vendor_id: { $eq: vendor_id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        this.purchases = data.map((item) => item.toJSON());
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setDateDropValue = (data) => {
    this.dateDropValue = data;
  };

  get getDateDropValue() {
    return this.dateDropValue;
  }

  addPurchaseOrderData = (data) => {
    if (data) {
      runInAction(() => {
        if (data.length > 0) {
          this.purchasesData = data.map((item) => item.toJSON());
        } else {
          this.purchasesData = [];
        }
      });
    }
  };

  get getPurchaseOrderData() {
    return this.purchasesData ? this.purchasesData : [];
  }

  get getTotalAmount() {
    if (!this.items) {
      return 0;
    }

    let totalGST = 0;
    const returnValue = this.items.reduce((a, b) => {
      const amount = toJS(b.amount);
      const cgst_amount = toJS(b.cgst_amount);
      const sgst_amount = toJS(b.sgst_amount);

      if (!Number.isNaN(amount)) {
        a = parseFloat(a) + parseFloat(amount);
      }

      totalGST =
        parseFloat(totalGST) +
        parseFloat(cgst_amount) +
        parseFloat(sgst_amount);

      return a;
    }, 0);

    let finalValue = returnValue;

    const overallTotalAmount = returnValue;

    this.billDetails.sub_total = parseFloat(returnValue).toFixed(2);

    let discountAmount = 0;
    const discountType = this.billDetails.discount_type;

    if (discountType === 'percentage') {
      let percentage = parseFloat(this.billDetails.discount_percent || 0);

      discountAmount = parseFloat((finalValue * percentage) / 100 || 0);

      runInAction(() => {
        this.billDetails.discount_amount = discountAmount;
      });
    } else if (discountType === 'amount') {
      discountAmount = parseFloat(this.billDetails.discount_amount || 0);

      runInAction(() => {
        this.billDetails.discount_percent =
          Math.round(((discountAmount / finalValue) * 100 || 0) * 100) / 100;
      });
    }

    let totalAmount = overallTotalAmount - discountAmount;

    if (this.billDetails.is_roundoff) {
      let beforeRoundTotalAmount = totalAmount;

      if (this.roundingConfiguration === 'Nearest 50') {
        totalAmount = Math.round(totalAmount);
      } else if (this.roundingConfiguration === 'Upward Rounding') {
        totalAmount = Math.ceil(totalAmount);
      } else if (this.roundingConfiguration === 'Downward Rounding') {
        totalAmount = Math.floor(totalAmount);
      }

      runInAction(() => {
        this.billDetails.round_amount = parseFloat(
          totalAmount - beforeRoundTotalAmount
        ).toFixed(2);
      });
    }

    runInAction(() => {
      this.billDetails.total_amount = totalAmount;
    });

    return this.billDetails.total_amount;
  }

  get getTotalTxnAmount() {
    // console.log('getTotalTxnAmount purchases');
    runInAction(() => {
      this.purchasesData = this.purchasesData ? this.purchasesData : [];
    });
    let returnData = this.purchasesData.reduce(
      (a, b) => {
        let data = toJS(b);
        // console.log(data);
        a.paid =
          parseFloat(a.paid) +
          (parseFloat(data.total_amount) - parseFloat(data.balance_amount));

        a.unpaid = parseFloat(a.unpaid) + parseFloat(data.balance_amount);
        return a;
      },
      { paid: 0, unpaid: 0 }
    );
    return returnData;
  }

  setVendorList = (data) => {
    this.vendorList = data;
  };

  get getVendorList() {
    return this.vendorList;
  }

  getPurchaseOrderCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.purchaseorder
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        this.isPurchaseOrderList = data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchaseOrderList = async (fromDate, toDate) => {
    const db = await Db.get();
    var query;
    const businessData = await Bd.getBusinessData();

    if (!fromDate || !toDate) {
      query = db.purchaseorder.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              po_date: { $exists: true }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ po_date: 'desc' }, { updatedAt: 'desc' }]
      });
    } else {
      query = db.purchaseorder.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              po_date: {
                $gte: fromDate
              }
            },
            {
              po_date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ po_date: 'desc' }, { updatedAt: 'desc' }]
      });
    }

    await query.$.subscribe(async (data) => {
      if (!data) {
        return;
      }
      runInAction(() => {
        this.purchasesData = data.map((item) => item.toJSON());
      });
    });
  };

  handlePurchaseOrderSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.purchaseorder
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                {
                  $and: [
                    { payment_type: { $regex: regexp } },
                    {
                      po_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      po_date: {
                        $lte: toDate
                      }
                    },
                    {
                      updatedAt: { $exists: true }
                    }
                  ]
                },
                {
                  $and: [
                    { sequenceNumber: { $regex: regexp } },
                    {
                      po_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      po_date: {
                        $lte: toDate
                      }
                    },
                    {
                      updatedAt: { $exists: true }
                    }
                  ]
                },
                {
                  $and: [
                    { vendor_name: { $regex: regexp } },
                    {
                      po_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      po_date: {
                        $lte: toDate
                      }
                    },
                    {
                      updatedAt: { $exists: true }
                    }
                  ]
                },
                {
                  $and: [
                    { total_amount: { $eq: parseFloat(value) } },
                    {
                      po_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      po_date: {
                        $lte: toDate
                      }
                    },
                    {
                      updatedAt: { $exists: true }
                    }
                  ]
                },
                {
                  $and: [
                    { balance_amount: { $eq: parseFloat(value) } },
                    {
                      po_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      po_date: {
                        $lte: toDate
                      }
                    },
                    {
                      updatedAt: { $exists: true }
                    }
                  ]
                },
                {
                  $and: [
                    { status: { $eq: parseFloat(value) } },
                    {
                      po_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      po_date: {
                        $lte: toDate
                      }
                    },
                    {
                      updatedAt: { $exists: true }
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
        if (!documents) {
          return;
        }
        data = documents.map((item) => item);
      });
    return data;
  };

  handlePurchaseOrderSearch = async (value) => {
    console.log('inside handle search...', value);
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.purchaseorder
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                { sequenceNumber: { $regex: regexp } },
                { vendor_name: { $regex: regexp } },
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
      });
    return data;
  };

  setEditTable = (index, value, lastIndexFocusIndex) => {
    this.enabledRow = index;
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

  viewOrEditPurchaseOrderTxnItem = async (item) => {
    this.viewOrEditItem(item);
  };

  deletePurchaseOrderTxnItem = async (item) => {
    await this.deletePurchaseOrderEntry(item);
  };

  setLinkPayment = async () => {
    this.openLinkpaymentPage = true;

    // if (this.billDetails.linked_amount === 0) {
    //   this.paymentLinkTransactions = [];
    //   const db = await Db.get();
    //   await this.getAllUnPaidTxnForVendor(db, this.billDetails.vendor_id);
    // }
  };

  getAllUnPaidTxnForVendor = async (db, id) => {
    await Promise.all([
      this.getSaledata(db, id),
      this.getPaymentOutData(db, id),
      this.getPurchaseReturnsData(db, id),
      this.getOpeningBalanceData(db, id)
    ]);

    console.log('got all records from 3 tables');
    /**
     * sort by date
     */
    this.paymentLinkTransactions.sort(function (a, b) {
      return (
        new Date(a.date ? a.date : a.po_date) -
        new Date(b.date ? b.date : b.po_date)
      );
    });

    console.log('after sort::', this.paymentLinkTransactions);
  };

  saveDataAndNew = async (isPrint) => {
    this.saveAndNew = true;
    await this.saveData(isPrint);
  };

  generateProductId = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('p');
    return `${id}${appId}${timestamp}`;
  };

  saveData = async (isPrint) => {
    // Generate Sequence No and Invoice No

    if (this.billDetails.purchase_order_invoice_number === '') {
      await this.generateBillNumber();
    }

    if (
      this.billDetails.sequenceNumber === '' ||
      this.billDetails.sequenceNumber === undefined
    ) {
      await this.getSequenceNumber(
        this.billDetails.po_date,
        this.billDetails.purchase_order_invoice_number
      );
    }

    if (this.billDetails.sequenceNumber === '0') {
      this.billDetails.sequenceNumber = '';
      this.handleClosePurchaseOrderLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    let updatedItems = [];
    for (var i = 0; i < this.items.length; i++) {
      let product = this.items[i];

      if (product.item_name === '') {
        continue;
      }

      product.itemNumber = parseInt(i) + 1;

      if (
        !product.product_id ||
        product.product_id === '' ||
        product.product_id.length === 0
      ) {
        product.product_id = await this.generateProductId();
      }

      product.qty = product.qty ? product.qty : 0;

      product.purchased_price_before_tax = product.purchased_price_before_tax
        ? product.purchased_price_before_tax
        : 0;

      product.vendorPhoneNumber = this.billDetails.vendor_phone_number;

      product.vendorName = this.billDetails.vendor_name;

      if (product.batch_id === null || product.batch_id === '') {
        product.batch_id = 0;
      }

      if (product.purchased_price === null || product.purchased_price === '') {
        product.purchased_price = 0;
      }

      if (
        product.purchased_price_before_tax === null ||
        product.purchased_price_before_tax === ''
      ) {
        product.purchased_price_before_tax = 0;
      }

      if (product.mrp === null || product.mrp === '') {
        product.mrp = 0;
      }

      if (product.offer_price === null || product.offer_price === '') {
        product.offer_price = 0;
      }

      if (product.size === null || product.size === '') {
        product.size = 0;
      }

      if (product.cgst === null || product.cgst === '') {
        product.cgst = 0;
      }

      if (product.sgst === null || product.sgst === '') {
        product.sgst = 0;
      }

      if (product.igst === null || product.igst === '') {
        product.igst = 0;
      }

      if (product.cess === null || product.cess === '') {
        product.cess = 0;
      }

      if (product.igst_amount === null || product.igst_amount === '') {
        product.igst_amount = 0;
      }

      if (product.cgst_amount === null || product.cgst_amount === '') {
        product.cgst_amount = 0;
      }

      if (product.sgst_amount === null || product.sgst_amount === '') {
        product.sgst_amount = 0;
      }

      if (product.taxIncluded === null || product.taxIncluded === '') {
        product.taxIncluded = true;
      }

      if (product.discount_amount === null || product.discount_amount === '') {
        product.discount_amount = 0;
      }

      if (
        product.discount_percent === null ||
        product.discount_percent === ''
      ) {
        product.discount_percent = 0;
      }

      if (
        product.discount_amount_per_item === null ||
        product.discount_amount_per_item === ''
      ) {
        product.discount_amount_per_item = 0;
      }

      if (product.amount === null || product.amount === '') {
        product.amount = 0;
      }

      if (product.isEdit === null || product.isEdit === '') {
        product.isEdit = true;
      }

      if (product.returnedQty === null || product.returnedQty === '') {
        product.returnedQty = 0;
      }

      if (product.stockQty === null || product.stockQty === '') {
        product.stockQty = 0;
      }

      if (
        product.makingChargePercent === null ||
        product.makingChargePercent === ''
      ) {
        product.makingChargePercent = 0;
      }

      if (
        product.makingChargeAmount === null ||
        product.makingChargeAmount === ''
      ) {
        product.makingChargeAmount = 0;
      }

      if (
        product.makingChargePerGramAmount === null ||
        product.makingChargePerGramAmount === ''
      ) {
        product.makingChargePerGramAmount = 0;
      }

      if (
        product.makingChargeIncluded === '' ||
        product.makingChargeIncluded === null
      ) {
        product.makingChargeIncluded = false;
      }

      if (product.freeQty === '' || product.freeQty === null) {
        product.freeQty = 0;
      }

      if (
        product.unitConversionQty === null ||
        product.unitConversionQty === ''
      ) {
        product.unitConversionQty = 0;
      }

      if (
        product.originalPurchasePriceWithoutConversionQty === null ||
        product.originalPurchasePriceWithoutConversionQty === ''
      ) {
        product.originalPurchasePriceWithoutConversionQty = 0;
      }

      if (
        product.mfDate === null ||
        product.mfDate === '' ||
        product.mfDate === undefined
      ) {
        product.mfDate = null;
      }

      if (
        product.expiryDate === null ||
        product.expiryDate === '' ||
        product.expiryDate === undefined
      ) {
        product.expiryDate = null;
      }

      if (
        product.pricePerGram === null ||
        product.pricePerGram === '' ||
        product.pricePerGram === undefined
      ) {
        product.pricePerGram = 0;
      }

      if (
        product.stoneWeight === null ||
        product.stoneWeight === '' ||
        product.stoneWeight === undefined
      ) {
        product.stoneWeight = 0;
      }

      if (
        product.stoneCharge === null ||
        product.stoneCharge === '' ||
        product.stoneCharge === undefined
      ) {
        product.stoneCharge = 0;
      }

      if (
        product.itemNumber === null ||
        product.itemNumber === '' ||
        product.itemNumber === undefined
      ) {
        product.itemNumber = 0;
      }

      if (
        product.hsn !== null ||
        product.hsn !== '' ||
        product.hsn !== undefined
      ) {
        product.hsn = product.hsn ? product.hsn.toString() : '';
      } else {
        product.hsn = '';
      }

      if (
        product.originalDiscountPercent === null ||
        product.originalDiscountPercent === '' ||
        product.originalDiscountPercent === undefined
      ) {
        product.originalDiscountPercent = 0;
      }

      updatedItems.push(product);
    }

    this.items = updatedItems;

    if (
      this.billDetails.discount_amount === null ||
      this.billDetails.discount_amount === ''
    ) {
      this.billDetails.discount_amount = 0;
    }

    if (
      this.billDetails.discount_percent === null ||
      this.billDetails.discount_percent === ''
    ) {
      this.billDetails.discount_percent = 0;
    }

    if (
      this.billDetails.discountPercentForAllItems === null ||
      this.billDetails.discountPercentForAllItems === ''
    ) {
      this.billDetails.discountPercentForAllItems = 0;
    }

    if (
      this.billDetails.paid_amount === null ||
      this.billDetails.paid_amount === ''
    ) {
      this.billDetails.paid_amount = 0;
    }

    if (
      this.billDetails.balance_amount === null ||
      this.billDetails.balance_amount === ''
    ) {
      this.billDetails.balance_amount = 0;
    }

    if (
      this.billDetails.total_amount === null ||
      this.billDetails.total_amount === ''
    ) {
      this.billDetails.total_amount = 0;
    }

    if (
      this.billDetails.round_amount === null ||
      this.billDetails.round_amount === ''
    ) {
      this.billDetails.round_amount = 0;
    }

    if (
      this.billDetails.is_roundoff === null ||
      this.billDetails.is_roundoff === ''
    ) {
      this.billDetails.is_roundoff = false;
    }

    if (
      this.billDetails.is_credit === null ||
      this.billDetails.is_credit === ''
    ) {
      this.billDetails.is_credit = false;
    }

    if (
      this.billDetails.vendor_payable === null ||
      this.billDetails.vendor_payable === ''
    ) {
      this.billDetails.vendor_payable = false;
    }

    if (
      this.billDetails.linkPayment === null ||
      this.billDetails.linkPayment === ''
    ) {
      this.billDetails.linkPayment = false;
    }

    if (
      this.billDetails.linked_amount === null ||
      this.billDetails.linked_amount === ''
    ) {
      this.billDetails.linked_amount = 0;
    }

    if (this.billDetails.status === null || this.billDetails.status === '') {
      this.billDetails.status = 'open';
    }

    if (this.isUpdate) {
      await this.updatePurchase(isPrint);
    } else {
      await this.savePurchase(isPrint);
    }

    runInAction(async () => {
      this.isPurchaseOrderList = true;
    });
  };

  resetAllData() {
    runInAction(() => {
      this.selectedCustomerBalance = 0;
      this.billDetails = {};
      this.existingBillData = {};
      this.paymentUnLinkTransactions = [];
      this.paymentLinkTransactions = [];
      this.isRestore = false;
    });
  }

  deletePurchaseOrderEntry = async (item) => {
    const tempBillDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      purchase_order_invoice_number: item.purchase_order_invoice_number,
      po_date: item.po_date,
      due_date: item.due_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // paid_amount: item.paid_amount,
      balance_amount: this.getBalanceData,
      linkedTxnList: item.linkedTxnList,
      linkPayment: item.linkPayment,
      linked_amount: item.linked_amount,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      place_of_supply: item.place_of_supply,
      placeOfSupplyName: item.placeOfSupplyName,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      status: item.status,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      sequenceNumber: item.sequenceNumber,
      isSyncedToServer: item.isSyncedToServer,
      vendorMsmeRegNo: item.vendorMsmeRegNo,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    runInAction(() => {
      this.billDetails = tempBillDetails;

      this.items = item.item_list;
    });

    if (!this.billDetails.purchase_order_invoice_number) {
      console.log('purchase_order_invoice_number not present');
      // Cannot update if item Number is not available
      return;
    }

    let restorePurchaseOrderData = {};
    restorePurchaseOrderData = this.billDetails;
    restorePurchaseOrderData.item_list = this.items;
    restorePurchaseOrderData.employeeId = item.employeeId;

    //save to audit
    audit.addAuditEvent(
      restorePurchaseOrderData.purchase_order_invoice_number,
      restorePurchaseOrderData.sequenceNumber,
      'Purchase Order',
      'Delete',
      JSON.stringify(restorePurchaseOrderData),
      '',
      restorePurchaseOrderData.po_date
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

    DeleteDataDoc.transactionId =
      this.billDetails.purchase_order_invoice_number;
    DeleteDataDoc.sequenceNumber = this.billDetails.sequenceNumber;
    DeleteDataDoc.transactionType = 'Purchase Order';
    DeleteDataDoc.data = JSON.stringify(restorePurchaseOrderData);
    DeleteDataDoc.total = this.billDetails.total_amount;
    //balance is same as total so using total_amount for balance
    DeleteDataDoc.balance = this.billDetails.total_amount;
    DeleteDataDoc.createdDate = this.billDetails.po_date;

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.purchaseorder.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            purchase_order_invoice_number: {
              $eq: this.billDetails.purchase_order_invoice_number
            }
          }
        ]
      }
    });
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No purchases data is found so cannot update any information
          return;
        }

        await allTxn.deleteTxnFromPurchaseOrder(this.billDetails, db);

        await query
          .remove()
          .then(async (data) => {
            console.log('data removed' + data);
            /**
             * make global variables to nulls again
             */
            this.resetAllData();

            // this.isSaveOrUpdateOrDeleteClicked = false;
          })
          .catch((error) => {
            //save to audit
            audit.addAuditEvent(
              restorePurchaseOrderData.purchase_order_invoice_number,
              restorePurchaseOrderData.sequenceNumber,
              'Purchase Order',
              'Delete',
              JSON.stringify(restorePurchaseOrderData),
              error.message,
              restorePurchaseOrderData.po_date
            );
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setPurchaseOrderUploadedFiles = (files) => {
    this.billDetails.imageUrls = files;
  };

  savePurchase = async (isPrint) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    runInAction(() => {
      this.billDetails.businessId = businessData.businessId;
      this.billDetails.businessCity = businessData.businessCity;

      this.billDetails.posId = parseFloat(businessData.posDeviceId);

      this.billDetails.balance_amount = this.getBalanceData;
    });

    const InsertDoc = {
      item_list: this.items,
      ...this.billDetails
    };

    console.log('InsertDoc', InsertDoc);
    /**
     * updated date
     */
    InsertDoc.updatedAt = Date.now();
    /**
     * remove fields which are not required
     */
    delete InsertDoc['vendor_payable'];
    // delete InsertDoc['linkPayment'];

    if (this.isRestore) {
      InsertDoc.employeeId = this.billDetails.employeeId;
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

    await allTxn.saveTxnFromPurchaseOrder(InsertDoc, db);

    if (this.isRestore) {
      await this.markPurchaseOrderRestored();
    }

    let userAction = 'Save';

    if (this.isRestore) {
      userAction = 'Restore';
    }

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.purchase_order_invoice_number,
      InsertDoc.sequenceNumber,
      'Purchase Order',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.po_date
    );

    await db.purchaseorder
      .insert(InsertDoc)
      .then(async (data) => {
        // console.log('data Inserted', data);

        if (
          isPrint &&
          this.purchasesInvoiceThermal &&
          this.purchasesInvoiceThermal.boolDefault
        ) {
          sendContentForThermalPrinter(
            '',
            this.purchasesInvoiceThermal,
            InsertDoc,
            this.purchaseOrderTransSettingData,
            'Purchase Order'
          );
        }

        this.handleClosePurchaseOrderLoadingMessage();
        if (
          this.purchasesInvoiceRegular &&
          this.purchasesInvoiceRegular.boolDefault &&
          isPrint
        ) {
          this.printPurchaseOrderData = InsertDoc;

          this.invoiceData = {};

          this.closeDialog();
          if (this.saveAndNew) {
            this.saveAndNew = false;
            this.openForNewPurchaseOrder();
          }
          this.resetAllData();
          this.handleOpenPurchaseOrderPrintSelectionAlertMessage();
        } else {
          this.invoiceData = {};

          this.closeDialog();
          if (this.saveAndNew) {
            this.saveAndNew = false;
            this.openForNewPurchaseOrder();
          }
          this.resetAllData();
        }
      })
      .catch((err) => {
        //save to audit
        audit.addAuditEvent(
          InsertDoc.purchase_order_invoice_number,
          InsertDoc.sequenceNumber,
          'Purchase Order',
          userAction,
          JSON.stringify(InsertDoc),
          err.message ? err.message : 'Purchase Order Failed',
          InsertDoc.po_date
        );
        this.handleClosePurchaseOrderLoadingMessage();
        this.handleOpenPurchaseOrderErrorAlertMessage();
      });
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
          this.billDetails.discountPercentForAllItems > 0 &&
          this.items[i].item_name !== ''
        ) {
          let billdiscount = this.billDetails.discountPercentForAllItems
            ? parseFloat(this.billDetails.discountPercentForAllItems)
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

  setMrp = async (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (parseFloat(value) >= 0) {
      this.items[index].purchased_price_before_tax = parseFloat(value);
      this.items[index].purchased_price = parseFloat(value);
      this.items[index].originalPurchasePriceWithoutConversionQty =
        parseFloat(value);

      if (this.items[index].qty === 0) {
        this.items[index].qty = 1;
      }

      if (this.items[index].qty) {
        this.getAmount(index);
      }
    } else {
      this.items[index].purchased_price_before_tax = value
        ? parseFloat(value)
        : '';
      this.items[index].purchased_price = value ? parseFloat(value) : '';
      this.items[index].originalPurchasePriceWithoutConversionQty =
        parseFloat(value);
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

  updatePurchase = async (isPrint) => {
    // this.isSaveOrUpdateOrDeleteClicked = true;

    const businessData = await Bd.getBusinessData();
    runInAction(() => {
      this.billDetails.businessId = businessData.businessId;
      this.billDetails.businessCity = businessData.businessCity;

      this.billDetails.posId = parseFloat(businessData.posDeviceId);
    });

    if (
      this.existingBillData.purchase_order_invoice_number &&
      this.existingBillData.purchase_order_invoice_number === 0
    ) {
      console.log('purchase_order_invoice_number not present');
      // Cannot update if item Number is not available
      return;
    }

    const db = await Db.get();

    const query = db.purchaseorder.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            purchase_order_invoice_number: {
              $eq: this.existingBillData.purchase_order_invoice_number
            }
          }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No purchases data is found so cannot update any information
          return;
        }

        runInAction(() => {
          /**
           * updated date
           */
          this.billDetails.updatedAt = Date.now();

          /**
           * remove unwanted properties
           */
          delete this.billDetails['vendor_payable'];
          // delete this.billDetails['linkPayment'];

          this.billDetails.updatedAt = Date.now();
        });

        let txnData = this.billDetails;
        txnData.item_list = this.items;

        await allTxn.deleteAndSaveTxnFromPurchaseOrder(
          this.existingBillData,
          txnData,
          db
        );

        let auditData = {};

        auditData = this.billDetails;
        auditData.item_list = this.items;

        audit.addAuditEvent(
          auditData.purchase_order_invoice_number,
          auditData.sequenceNumber,
          'Purchase Order',
          'Update',
          JSON.stringify(auditData),
          '',
          auditData.po_date
        );

        try {
          await query
            .update({
              $set: {
                item_list: this.items,
                ...this.billDetails
              }
            })
            .then(async () => {
              // console.log('inside updte purchase');

              if (
                isPrint &&
                this.purchasesInvoiceThermal &&
                this.purchasesInvoiceThermal.boolDefault
              ) {
                sendContentForThermalPrinter(
                  '',
                  this.purchasesInvoiceThermal,
                  data,
                  this.purchaseOrderTransSettingData,
                  'Purchase Order'
                );
              }

              this.handleClosePurchaseOrderLoadingMessage();
              if (
                this.purchasesInvoiceRegular &&
                this.purchasesInvoiceRegular.boolDefault &&
                isPrint
              ) {
                this.printPurchaseOrderData = txnData;

                this.isUpdate = false;
                this.resetAllData();
                this.closeDialog();

                if (this.saveAndNew) {
                  this.saveAndNew = false;
                  this.openForNewPurchaseOrder();
                }

                runInAction(async () => {
                  this.isPurchaseOrderList = true;
                });

                this.handleOpenPurchaseOrderPrintSelectionAlertMessage();
              } else {
                this.isUpdate = false;
                this.closeDialog();
                if (this.saveAndNew) {
                  this.saveAndNew = false;
                  this.openForNewPurchaseOrder();
                }

                runInAction(async () => {
                  this.isPurchaseOrderList = true;
                });

                this.resetAllData();
              }
            });
        } catch (err) {
          audit.addAuditEvent(
            auditData.purchase_order_invoice_number,
            auditData.sequenceNumber,
            'Purchase Order',
            'Update',
            JSON.stringify(auditData),
            err.message,
            auditData.po_date
          );
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        this.handleClosePurchaseOrderLoadingMessage();
        this.handleOpenPurchaseOrderPrintSelectionAlertMessage();
      });
  };

  get getRoundedAmount() {
    if (!this.billDetails.is_roundoff) {
      return 0;
    }
    return this.billDetails.round_amount;
  }

  addNewItem = (status, focusIndexStatus, isBarcode) => {
    if (status) {
      this.addNewRowEnabled = true;
    }

    var lastItem = this.items[this.items.length - 1]; // Getting last element

    if (lastItem) {
      if (lastItem.qty > 0) {
        this.items.push({
          product_id: '',
          description: '',
          imageUrl: '',
          batch_id: 0,
          item_name: '',
          sku: '',
          barcode: '',
          purchased_price: 0,
          purchased_price_before_tax: 0,
          mrp: 0,
          offer_price: 0,
          size: 0,
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
          originalPurchasePriceWithoutConversionQty: 0,
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
          serialNo: []
        });
        this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;

        this.setEditTable(
          this.enabledRow,
          true,
          focusIndexStatus ? Number('8' + this.enabledRow) : ''
        );
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
        purchased_price: 0,
        purchased_price_before_tax: 0,
        mrp: 0,
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
        returnedQty: 0,
        isEdit: true,
        taxIncluded: false
      });
      this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;

      this.setEditTable(
        this.enabledRow,
        true,
        focusIndexStatus ? Number('8' + this.enabledRow) : ''
      );
    }
  };

  deleteItem = (index) => {
    this.items.splice(index, 1);
    this.enabledRow = index > 0 ? index - 1 : 0;

    if (this.items.length > 0) {
      this.setEditTable(this.enabledRow, true, Number('8' + this.enabledRow));
    } else {
      this.FocusLastIndex = 18;
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

  setPurchaseOrderPlaceOfSupply = (value) => {
    runInAction(() => {
      this.billDetails.place_of_supply = value;
    });
  };

  setPlaceOfSupplyName = (value) => {
    runInAction(() => {
      this.billDetails.placeOfSupplyName = value;
    });
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
      this.items[index].purchased_price =
        this.items[index].purchased_price / this.items[index].unitConversionQty;
    } else if (
      this.items[index].primaryUnit &&
      this.items[index].primaryUnit.fullName === this.items[index].qtyUnit
    ) {
      this.items[index].purchased_price =
        this.items[index].originalPurchasePriceWithoutConversionQty;
    } else {
      this.items[index].purchased_price =
        this.items[index].originalPurchasePriceWithoutConversionQty;
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

  setItemBrand = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].brandName = value;
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
            this.selectedIndex = index;
            runInAction(() => {
              this.items[index].item_name = actualProduct.name;
              this.items[index].description = actualProduct.description;
              this.items[index].imageUrl = actualProduct.imageUrl;
              this.items[index].barcode = actualProduct.barcode;
              this.items[index].sku = actualProduct.sku;
              this.items[index].product_id = actualProduct.productId;
              this.items[index].cgst = actualProduct.purchaseCgst;
              this.items[index].sgst = actualProduct.purchaseSgst;
              this.items[index].igst = actualProduct.purchaseIgst;
              this.items[index].cess = actualProduct.purchaseCess;
              this.items[index].taxIncluded = actualProduct.purchaseTaxIncluded;
              this.items[index].hsn = actualProduct.hsn;
              this.items[index].taxType = actualProduct.purchaseTaxType;

              this.items[index].mfDate = actualProduct.mfDate;
              this.items[index].expiryDate = actualProduct.expiryDate;
              this.items[index].rack = actualProduct.rack;
              this.items[index].warehouseData = actualProduct.warehouseData;
              this.items[index].modelNo = actualProduct.modelNo;

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

              this.items[index].stockQty = actualProduct.stockQty;

              // units addition
              this.items[index].primaryUnit = actualProduct.primaryUnit;
              this.items[index].secondaryUnit = actualProduct.secondaryUnit;
              this.items[index].units =
                actualProduct.units && actualProduct.units.length > 2
                  ? actualProduct.units.slice(0, 2)
                  : actualProduct.units;
              this.items[index].unitConversionQty =
                actualProduct.unitConversionQty;

              if (actualProduct.purchaseCgst > 0) {
                this.items[index].cgst = actualProduct.purchaseCgst;
              }
              if (actualProduct.purchaseSgst > 0) {
                this.items[index].sgst = actualProduct.purchaseSgst;
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
    runInAction(() => {
      this.items[index].offer_price = parseFloat(value);
    });
    this.getAmount(index);
  };

  // setPaid = (value) => {
  //   if (!this.billDetails) {
  //     return;
  //   }
  //   runInAction(() => {
  //     this.billDetails.paid_amount = value;
  //     this.billDetails.balance_amount = this.getBalanceData;
  //   });
  // };

  toggleRoundOff = () => {
    if (!this.billDetails) {
      return;
    }
    runInAction(() => {
      this.billDetails.is_roundoff = !this.billDetails.is_roundoff;
    });

    if (!this.billDetails.is_roundoff) {
      this.billDetails.round_amount = 0;
    }
  };

  setQuantity = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (parseFloat(value) > 0) {
      runInAction(() => {
        this.items[index].qty = value ? parseFloat(value) : '';
      });
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

  setPurchasedPrice = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (parseFloat(value) >= 0) {
      this.items[index].purchased_price_before_tax = parseFloat(value);
      this.items[index].purchased_price = parseFloat(value);
      this.items[index].originalPurchasePriceWithoutConversionQty =
        parseFloat(value);

      if (this.items[index].qty === 0) {
        this.items[index].qty = 1;
      }

      if (this.items[index].qty) {
        this.getAmount(index);
      }
    } else {
      this.items[index].purchased_price_before_tax = value
        ? parseFloat(value)
        : '';
      this.items[index].purchased_price = value ? parseFloat(value) : '';
      this.items[index].originalPurchasePriceWithoutConversionQty = value
        ? parseFloat(value)
        : '';
    }
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

  calculateTaxAndDiscountValue = async (index) => {
    const purchased_price = parseFloat(this.items[index].purchased_price || 0);
    const quantity = parseFloat(this.items[index].qty) || 1;
    const offerPrice = parseFloat(this.items[index].offer_price || 0);

    let tax =
      (parseFloat(this.items[index].cgst) || 0) +
      (parseFloat(this.items[index].sgst) || 0);
    let igst_tax = parseFloat(this.items[index].igst || 0);

    const taxIncluded = this.items[index].taxIncluded;

    /* if (
      !purchased_price ||
      purchased_price === 0 ||
      !quantity ||
      quantity === 0
    ) {
      return 0;
    }*/

    let itemPrice = 0;
    if (offerPrice && offerPrice > 0 && purchased_price > offerPrice) {
      itemPrice = offerPrice;
    } else {
      itemPrice = purchased_price;
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
    let purchased_price_before_tax = 0;

    if (taxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
      totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
    }

    purchased_price_before_tax =
      itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

    let totalItemPriceBeforeTax = parseFloat(purchased_price_before_tax);

    if (this.items[index].discount_type) {
      totalItemPriceBeforeTax = purchased_price_before_tax * quantity;

      discountAmount = parseFloat(
        this.getItemDiscountAmount(index, totalItemPriceBeforeTax)
      );
    }

    // price before tax
    this.items[index].purchased_price_before_tax = parseFloat(
      purchased_price_before_tax
    );

    let discountAmountPerProduct =
      parseFloat(discountAmount) / parseFloat(quantity);

    //per item dicount is removed from per item
    let itemPriceAfterDiscount = 0;

    itemPriceAfterDiscount =
      purchased_price_before_tax - discountAmountPerProduct;

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

  getItemDiscountAmount = (index, totalPrice) => {
    let discountAmount = 0;
    const discountType = this.items[index].discount_type;
    if (discountType === 'percentage') {
      let percentage = this.items[index].discount_percent || 0;

      discountAmount = parseFloat((totalPrice * percentage) / 100 || 0);

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

        amount = itemPriceAfterDiscount * (igst_tax / 100);

        this.items[index].igst_amount = Math.round(amount * 100) / 100;
      }
    }
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
    let purchased_price_before_tax = 0;

    if (quantity > 0) {
      cgst_amount = parseFloat(this.items[index].cgst_amount || 0);
      sgst_amount = parseFloat(this.items[index].sgst_amount || 0);
      igst_amount = parseFloat(this.items[index].igst_amount || 0);
      cess = parseFloat(this.items[index].cess || 0);
      discount_amount = parseFloat(this.items[index].discount_amount || 0);
      purchased_price_before_tax = parseFloat(
        this.items[index].purchased_price_before_tax || 0
      );
    } else {
      /* this.items[index].cgst_amount = 0;
      this.items[index].sgst_amount = 0;
      this.items[index].igst_amount = 0;
      this.items[index].cess = 0;
      this.items[index].discount_amount = 0;
      this.items[index].purchased_price_before_tax = 0; */
    }

    const finalAmount = parseFloat(
      purchased_price_before_tax * quantity -
        discount_amount +
        cgst_amount +
        sgst_amount +
        igst_amount +
        cess * quantity
    );

    this.items[index].amount = Math.round(finalAmount * 100) / 100 || 0;

    let mrpValue =
      parseFloat(purchased_price_before_tax || 0) -
      parseFloat(this.items[index].discount_amount_per_item || 0);
    this.autoFillTaxRate(mrpValue, index);
  };

  setPaymentType = (value) => {
    runInAction(() => {
      if (value === 'Cash') {
        this.billDetails.payment_type = value;
      } else {
        this.billDetails.payment_type = value;
      }
    });
  };

  setBillDate = (value) => {
    runInAction(() => {
      this.billDetails.po_date = value;
    });
  };
  // setPaymentType = (value) => {
  //   setPaymentTypethis.billDetails.payment_type = value;
  // };

  get getBalanceData() {
    // console.log('get balance clicked');
    // if (!this.isSaveOrUpdateOrDeleteClicked) {
    const total_amount = parseFloat(this.getTotalAmount);
    let balance = 0;

    balance =
      total_amount -
      // (this.billDetails.paid_amount || 0) -
      this.billDetails.linked_amount;
    runInAction(() => {
      this.billDetails.balance_amount = parseFloat(balance);
    });

    return balance;
    // }
    // return 0;
  }

  // get setBill() {
  //   runInAction(() => {
  //     return this.billDetails.paid_amount;
  //   });
  // }

  setVendorName = (value) => {
    runInAction(() => {
      this.billDetails.vendor_name = value;
    });
  };

  setVendorId = (value) => {
    runInAction(() => {
      this.billDetails.vendor_id = value;
    });
  };

  setVendor = async (vendor, isNewVendor) => {
    // console.log('vendor::', vendor);
    if (!vendor) {
      return;
    }
    runInAction(() => {
      this.billDetails.vendor_id = vendor.id;
      this.billDetails.vendor_name = vendor.name;
      this.billDetails.vendor_gst_number = vendor.gstNumber;
      this.billDetails.vendor_gst_type = vendor.gstType;
      this.billDetails.vendor_phone_number = vendor.phoneNo;
      this.billDetails.vendorCity = vendor.city;
      this.billDetails.vendorPincode = vendor.pincode;
      this.billDetails.vendorAddress = vendor.address;
      this.billDetails.vendorState = vendor.state;
      this.billDetails.vendorCountry = vendor.country;
      this.billDetails.vendor_email_id = vendor.emailId;

      if (
        vendor &&
        vendor.additionalAddressList &&
        vendor.additionalAddressList.length > 0
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
        uiAddress.tradeName = vendor.tradeName;
        uiAddress.type = 'Primary';
        uiAddress.address = vendor.address;
        uiAddress.pincode = vendor.pincode;
        uiAddress.city = vendor.city;
        uiAddress.state = vendor.state;
        uiAddress.country = vendor.country;
        uiAddress.placeOfSupply = vendor.state;

        this.customerAddressList.push(uiAddress);

        //prepare secondary addresses
        for (let secAddr of vendor.additionalAddressList) {
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
            : vendor.tradeName;
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

      this.isNewVendor = isNewVendor;
      if (isNewVendor) {
        this.newVendorData = vendor;
      }
    });

    /**
     * get txn which are un paid
     */
    const db = await Db.get();
    this.getAllUnPaidTxnForVendor(db, vendor.id);
    if (vendor.balanceType === 'Receivable' && vendor.balance > 0) {
      runInAction(() => {
        this.billDetails.vendor_payable = false;
      });
    } else {
      runInAction(() => {
        this.billDetails.vendor_payable = true;
        // this.billDetails['paid_amount'] = 0;
      });
    }

    runInAction(() => {
      runInAction(() => {
        this.selectedCustomerBalance = parseFloat(vendor.balance || 0);
      });
    });
  };

  selectAddressFromVendor = (selectedIndex) => {
    if (selectedIndex !== -1 && this.customerAddressType === 'Bill To') {
      this.billDetails.vendorAddress =
        this.customerAddressList[selectedIndex].address;
      this.billDetails.vendorPincode =
        this.customerAddressList[selectedIndex].pincode;
      this.billDetails.vendorCity =
        this.customerAddressList[selectedIndex].city;
      this.billDetails.vendorState =
        this.customerAddressList[selectedIndex].state;
      this.billDetails.vendorCountry =
        this.customerAddressList[selectedIndex].country;
      if (this.customerAddressList[selectedIndex].state) {
        let result = getStateList().find(
          (e) => e.name === this.customerAddressList[selectedIndex].state
        );
        if (result) {
          this.setPurchaseOrderPlaceOfSupply(result.val);
          this.setPlaceOfSupplyName(result.name);
          this.setPlaceOfSupplyState(
            this.customerAddressList[selectedIndex].state
          );
        }
      }
    }

    this.handleCloseAddressList();

    this.customerAddressType = '';
    this.customerAddressList = [];
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

  viewOrEditItem = async (item) => {
    // console.log('view or edit clicked::', item);

    runInAction(() => {
      this.OpenAddPurchaseOrder = true;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.isUpdate = true;
      this.existingBillData = item;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
      this.invoiceData = {};
    });

    // console.log(item);

    const billDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      purchase_order_invoice_number: item.purchase_order_invoice_number,
      po_date: item.po_date,
      due_date: item.due_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // paid_amount: item.paid_amount,
      balance_amount: this.getBalanceData,
      linkedTxnList: item.linkedTxnList,
      linkPayment: item.linkPayment,
      linked_amount: item.linked_amount,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      place_of_supply: item.place_of_supply,
      placeOfSupplyName: item.placeOfSupplyName,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      status: item.status,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      sequenceNumber: item.sequenceNumber,
      isSyncedToServer: item.isSyncedToServer,
      vendorMsmeRegNo: item.vendorMsmeRegNo,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    this.billDetails = billDetails;

    this.checkForTaxAndLoadUI();

    /**
     * get customer txn which are un used
     */

    if (item.vendor_id !== '' && item.vendor_id.length > 2) {
      // await Promise.all([this.setSelectedVendorBalance(item.vendor_id)]);

      const db = await Db.get();
      this.getAllUnPaidTxnForVendor(db, item.vendor_id);

      if (this.billDetails.linked_amount > 0) {
        runInAction(() => {
          this.billDetails.linkPayment = true;
        });
        await this.getAllLinkedTxnData(this.billDetails);
      }
    }
  };

  getAllLinkedTxnData = async (billDetails) => {
    const db = await Db.get();

    let sales = false;
    let paymentOut = false;
    let purchasesReturn = false;
    let openingBalance = false;
    let openingBalanceLinkedId;

    if (billDetails.linkedTxnList.length > 0) {
      for (let txn of billDetails.linkedTxnList) {
        if (txn.paymentType === 'Sales') {
          sales = true;
        } else if (txn.paymentType === 'Payment Out') {
          paymentOut = true;
        } else if (txn.paymentType === 'Purchases Return') {
          purchasesReturn = true;
        } else if (txn.paymentType === 'Opening Receivable Balance') {
          openingBalance = true;
          openingBalanceLinkedId = txn.linkedId;
        }
      }
    }

    await Promise.all([
      /**
       * get all previously linked txn
       */
      sales ? this.getSalesLinkedData(db, billDetails) : null,
      paymentOut ? this.getPaymentOutLinkedData(db, billDetails) : null,
      purchasesReturn
        ? this.getPurchaseReturnsLinkedData(db, billDetails)
        : null,
      openingBalance
        ? this.getOpeningBalanceLinkedData(db, openingBalanceLinkedId)
        : null

      // /**
      //  * get all linked txn
      //  */
      // this.getAllUnPaidTxnForVendor(db, billDetails.vendor_id)
    ]);

    if (this.paymentUnLinkTransactions.length > 0) {
      this.paymentUnLinkTransactions.forEach(function (
        linkTxn,
        index,
        modifiedArray
      ) {
        var matchedIndex = billDetails.linkedTxnList.findIndex(
          (x) => x.linkedId === linkTxn.id
        );

        if (!(typeof matchedIndex === 'undefined' || matchedIndex === -1)) {
          let actualTxn = billDetails.linkedTxnList[matchedIndex];

          linkTxn.linkedAmount = actualTxn.linkedAmount;
          linkTxn.selected = true;
          modifiedArray[index] = linkTxn;
        }
      });

      for (let linkTxn of this.paymentUnLinkTransactions) {
        var matchedIndex = this.paymentLinkTransactions.findIndex(
          (x) => x.id === linkTxn.id
        );

        console.log('matchedIndex::', matchedIndex);
        if (typeof matchedIndex === 'undefined' || matchedIndex === -1) {
          runInAction(() => {
            this.paymentLinkTransactions.push(linkTxn);
          });
        } else {
          this.paymentLinkTransactions[matchedIndex] = linkTxn;
        }
      }
    }
  };

  setSelectedVendorBalance = async (id) => {
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

          this.selectedCustomerBalance = isNaN(data.balance) ? 0 : data.balance;

          runInAction(() => {
            if (data.balanceType === 'Receivable') {
              this.billDetails.vendor_payable = false;
            } else {
              this.billDetails.vendor_payable = true;
            }
          });
          resolve(`done with set payment `);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    });
  };

  resetLinkPayment = () => {
    let linked_amount = this.billDetails.linked_amount;
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
      this.billDetails.linked_amount = linked_amount;
    });
  };

  closeDialog = () => {
    runInAction(() => {
      this.OpenAddPurchaseOrder = false;
      this.enabledRow = 0;
    });
  };

  openForNewPurchaseOrder = () => {
    const currentDate = getTodayDateInYYYYMMDD();

    runInAction(() => {
      this.isUpdate = false;
      this.OpenAddPurchaseOrder = true;

      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
      this.invoiceData = {};

      this.printPurchaseOrderData = null;
      this.openPurchaseOrderPrintSelectionAlert = false;
      this.isCGSTSGSTEnabledByPOS = true;

      this.billDetails = {
        vendor_id: '',
        vendor_name: '',
        vendor_gst_number: '',
        vendor_gst_type: '',
        vendor_phone_number: '',
        vendor_payable: false,
        is_credit: true,
        purchase_order_invoice_number: '',
        po_date: currentDate,
        due_date: currentDate,
        is_roundoff: false,
        round_amount: 0.0,
        total_amount: 0.0,
        payment_type: 'cash',
        bankAccount: '',
        bankAccountId: '',
        bankPaymentType: '',
        paid_amount: 0.0,
        balance_amount: 0.0,
        linkedTxnList: [],
        linkPayment: false,
        linked_amount: 0,
        discount_percent: 0,
        discount_amount: 0,
        discount_type: '',
        updatedAt: '',
        place_of_supply: '',
        placeOfSupplyName: '',
        paymentReferenceNumber: '',
        status: 'open',
        notes: '',
        vendorCity: '',
        vendorPincode: '',
        vendorAddress: '',
        vendorState: '',
        vendorCountry: '',
        vendor_email_id: '',
        isSyncedToServer: false,
        vendorMsmeRegNo: '',
        discountPercentForAllItems: 0,
        imageUrls: []
      };

      this.items = [
        {
          product_id: '',
          description: '',
          imageUrl: '',
          batch_id: 0,
          item_name: '',
          sku: '',
          barcode: '',
          purchased_price: 0,
          purchased_price_before_tax: 0,
          mrp: 0,
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
          taxIncluded: false,
          discount_percent: 0,
          discount_amount: 0,
          discount_amount_per_item: 0,
          discount_type: '',
          amount: 0,
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
          originalPurchasePriceWithoutConversionQty: 0,
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
          serialNo: []
        }
      ];

      this.checkForTaxAndLoadUI();
    });
  };

  selectProduct = (productItem, index, isBarcode) => {
    if (!productItem) {
      return;
    }
    const {
      name,
      description,
      imageUrl,
      barcode,
      sku,
      hsn,
      productId,
      purchasedPrice,
      batchData,
      serialData,
      stockQty,
      categoryLevel2,
      categoryLevel3,
      brandName,
      purchaseDiscountPercent,
      purchaseCgst,
      purchaseSgst,
      purchaseIgst,
      purchaseCess,
      purchaseTaxIncluded,
      purchaseTaxType,
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

    let purchasePercent = '';

    // adding same product to purchase
    let existingPurchaseProduct;
    if (!(batchData.length > 1 || serialData.length > 1)) {
      existingPurchaseProduct = this.items.find((product, index) =>
        this.findProduct(product, index, productItem)
      );
    }

    if (existingPurchaseProduct) {
      this.items[existingPurchaseProduct.index] = existingPurchaseProduct;
      this.setQuantity(
        existingPurchaseProduct.index,
        existingPurchaseProduct.qty
      );
      this.resetSingleProduct(index);
      setTimeout(() => {
        this.FocusLastIndex = isBarcode
          ? Number('6' + index)
          : Number('4' + index);
      }, 100);
    } else {
      runInAction(async () => {
        if (batchData.length > 0) {
          if (batchData.length > 1) {
            this.selectedProduct = productItem;
            this.selectedIndex = index;
            this.OpenPurchaseOrderBatchList = true;
          } else if (batchData.length === 1) {
            let firstBatchData = batchData[0];

            if (
              this.purchaseOrderTxnEnableFieldsMap.get('enable_product_price')
            ) {
              this.items[index].purchased_price = parseFloat(
                firstBatchData.purchasedPrice
              );
            } else if (
              this.purchaseOrderTxnEnableFieldsMap.get(
                'enable_product_price_per_gram'
              )
            ) {
              this.items[index].pricePerGram = parseFloat(
                firstBatchData.purchasedPrice
              );
            }

            this.items[index].originalPurchasePriceWithoutConversionQty =
              parseFloat(firstBatchData.purchasedPrice);
            this.items[index].batch_id = parseFloat(firstBatchData.id);
            this.items[index].qty = 1;
            this.items[index].mfDate = firstBatchData.mfDate;
            this.items[index].expiryDate = firstBatchData.expiryDate;
            this.items[index].rack = firstBatchData.rack;
            this.items[index].warehouseData = firstBatchData.warehouseData;
            this.items[index].barcode = firstBatchData.barcode;
            this.items[index].modelNo = firstBatchData.modelNo;

            purchasePercent = firstBatchData.purchaseDiscountPercent;

            setTimeout(() => {
              this.addNewItem(true, false);
            }, 200);
          }
        // } else if (serialData.length > 0) {
        //   if (serialData.length > 1) {
        //     runInAction(() => {
        //       this.selectedProduct = productItem;
        //       let filteredSerialData = productItem.serialData.filter((ele) => {
        //         return ele.purchased === false;
        //       });
        //       if (filteredSerialData && filteredSerialData.length > 0) {
        //         let serialNo = [];
        //         for (let item of filteredSerialData) {
        //           serialNo.push({
        //             serialNo: item.serialImeiNo,
        //             selected: true
        //           });
        //         }
        //         this.selectedProduct.serialData = serialNo;

        //         this.selectedIndex = index;
        //         this.OpenPurchaseOrderSerialList = true;
        //       } else {
        //         // to add alert
        //       }
        //     });
        //   }
        } else {
          if (
            this.purchaseOrderTxnEnableFieldsMap.get('enable_product_price')
          ) {
            this.items[index].purchased_price = parseFloat(purchasedPrice);
          } else if (
            this.purchaseOrderTxnEnableFieldsMap.get(
              'enable_product_price_per_gram'
            )
          ) {
            this.items[index].pricePerGram = parseFloat(purchasedPrice);
          }

          this.items[index].barcode = barcode;
          this.items[index].mfDate = mfDate;
          this.items[index].expiryDate = expiryDate;
          this.items[index].rack = rack;
          this.items[index].warehouseData = warehouseData;
          this.items[index].modelNo = modelNo;

          this.items[index].originalPurchasePriceWithoutConversionQty =
            parseFloat(purchasedPrice);
          setTimeout(() => {
            this.addNewItem(true, false);
          }, 200);
        }

        this.items[index].item_name = name;
        this.items[index].description = description;
        this.items[index].imageUrl = imageUrl;
        this.items[index].sku = sku;
        this.items[index].product_id = productId;
        this.items[index].cess = purchaseCess;
        this.items[index].taxIncluded = purchaseTaxIncluded;
        this.items[index].hsn = hsn;
        this.items[index].taxType = purchaseTaxType;
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

        this.items[index].stockQty = stockQty;

        console.log(this.items[index]);

        // units addition
        this.items[index].primaryUnit = primaryUnit;
        this.items[index].secondaryUnit = secondaryUnit;
        this.items[index].units =
          units && units.length > 2 ? units.slice(0, 2) : units;
        this.items[index].unitConversionQty = unitConversionQty;

        if (this.isCGSTSGSTEnabledByPOS) {
          if (purchaseCgst > 0) {
            this.items[index].cgst = purchaseCgst;
          }
          if (purchaseSgst > 0) {
            this.items[index].sgst = purchaseSgst;
          }
        } else {
          this.items[index].igst = purchaseIgst;
        }

        purchasePercent = purchaseDiscountPercent;
      });

      this.setQuantity(index, 1);
      let billdiscount = this.billDetails.discountPercentForAllItems
        ? parseFloat(this.billDetails.discountPercentForAllItems) || 0
        : 0;
      this.items[index].originalDiscountPercent =
        purchasePercent + billdiscount;
      this.setItemDiscount(index, this.items[index].originalDiscountPercent);
    }
  };

  findProduct = (product, index, newProduct) => {
    if (
      newProduct.productId === product.product_id &&
      parseFloat(newProduct.purchasedPrice) ===
        parseFloat(product.originalPurchasePriceWithoutConversionQty)
    ) {
      product.qty = product.qty + 1;
      product.index = index;
      return true;
    }
  };

  findBatchProduct = (product, index, batchItem) => {
    if (
      batchItem.id === product.batch_id &&
      parseFloat(batchItem.purchasedPrice) ===
        parseFloat(product.originalPurchasePriceWithoutConversionQty)
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
      purchased_price: 0,
      purchased_price_before_tax: 0,
      mrp: 0,
      offer_price: 0,
      size: 0,
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
      taxIncluded: true,
      discount_percent: 0,
      discount_amount: 0,
      discount_amount_per_item: 0,
      discount_type: '',
      amount: 0,
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
      originalPurchasePriceWithoutConversionQty: 0,
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
      serialNo: []
    };

    this.items[index] = defaultItem;
  };

  linkPayment = async (db, billDetails) => {
    /**
     * follow below + and - rule to link payment
     *
     * sale +
     * payment out +
     * credit purchase return +
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
      if (parseFloat(item.linkedAmount) > 0) {
        const businessData = await Bd.getBusinessData();

        const appId = businessData.posDeviceId;
        const timestamp = Math.floor(Date.now() / 60000);
        const id = _uniqueId('lp');

        let transactionNumber = `${id}${appId}${timestamp}`;

        if (item.paymentType === 'Sales') {
          /**
           * update sales table
           */
          console.log('sales loop');
          await this.updateSalesWithTxn(
            db,
            item,
            billDetails,
            transactionNumber
          );

          linkPayment.updateLinkPaymentAllTxnTable(db, item);
        } else if (item.paymentType === 'Payment Out') {
          /**
           * update payment out table
           */
          await this.updatePaymentOutWithTxn(
            db,
            item,
            billDetails,
            transactionNumber
          );

          linkPayment.updateLinkPaymentAllTxnTable(db, item);
        } else if (item.paymentType === 'Purchases Return') {
          /**
           * update purchase return table
           */
          await this.updatePurchasesReturnWithTxn(
            db,
            item,
            billDetails,
            transactionNumber
          );

          linkPayment.updateLinkPaymentAllTxnTable(db, item);
        } else if (item.paymentType === 'Opening Receivable Balance') {
          /**
           * update alltxn table table
           */
          await linkPayment.updateLinkPaymentAllTxnTable(db, item);
        }

        let billLinkedTxn = {
          linkedId: item.id,
          date: '',
          linkedAmount: item.linkedAmount,
          paymentType: item.paymentType,
          transactionNumber: transactionNumber,
          sequenceNumber: item.sequenceNumber
        };
        runInAction(() => {
          this.billDetails.linkedTxnList.push(billLinkedTxn);
        });
      }
    }
    /**
     * make used global variable to deafult values
     */
    runInAction(() => {
      this.paymentLinkTransactions = [];
    });
  };

  unLinkPayment = async (db, billDetails) => {
    /**
     * follow below + and - rule to link payment
     *
     * credit sale +
     * payment out +
     * credit purchase return +
     *
     *
     * payment in -
     * credit sale return -
     * credit purchase -
     *
     */

    // console.log('after sort::', this.paymentUnLinkTransactions);
    for (const item of billDetails.linkedTxnList) {
      if (item.paymentType === 'Sales') {
        /**
         * remove from sales table
         */
        await this.removeLinkedTxnSales(db, item, billDetails);

        linkPayment.removeLinkedTxnBalance(db, item);
      } else if (item.paymentType === 'Payment Out') {
        /**
         * remove from  payment out table
         */
        await this.removeLinkedTxnPaymentOut(db, item, billDetails);

        linkPayment.removeLinkedTxnBalance(db, item);
      } else if (item.paymentType === 'Purchases Return') {
        /**
         * remove from purchasesreturn table
         */
        await this.removeLinkedTxnPurchasesReturn(db, item, billDetails);

        linkPayment.removeLinkedTxnBalance(db, item);
      } else if (item.paymentType === 'Opening Receivable Balance') {
        /**
         * remove from alltransactions table
         */
        await linkPayment.removeLinkedTxnBalance(db, item);
      }
    }

    /**
     * make used global variable to deafult values
     */
    runInAction(() => {
      this.paymentUnLinkTransactions = [];
    });
  };

  updateSalesWithTxn = async (db, doc, billDetails, transactionNumber) => {
    const businessData = await Bd.getBusinessData();

    const salesData = await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_number: { $eq: doc.invoice_number }
            },
            { customer_id: { $eq: billDetails.vendor_id } }
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

        let linkedTxn = {
          linkedId: billDetails.purchase_order_invoice_number,
          date: '',
          linkedAmount: doc.linkedAmount,
          paymentType: 'Purchases',
          transactionNumber: transactionNumber,
          sequenceNumber: doc.sequenceNumber
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

    if (salesData) {
      await salesData.atomicUpdate(changeData);
    }
  };
  setFocusLastIndex = (val) => {
    this.FocusLastIndex = val;
  };

  removeLinkedTxnSales = async (db, doc, billDetails) => {
    const businessData = await Bd.getBusinessData();

    const salesData = await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_number: { $eq: doc.linkedId }
            },
            { customer_id: { $eq: billDetails.vendor_id } }
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
          if (element.linkedId !== billDetails.purchase_order_invoice_number) {
            finalLinkedTxnList.push(element);
          } else {
            const linkedAmount = parseFloat(element.linkedAmount);
            oldData.balance_amount += linkedAmount;
            this.unLinkedTxnList.push(element);

            oldData.linked_amount =
              (parseFloat(oldData.linked_amount) || 0) - linkedAmount;
          }
        });

        oldData.linkedTxnList = finalLinkedTxnList;
      }
      oldData.updatedAt = Date.now();
      return oldData;
    });

    if (salesData) {
      await salesData.atomicUpdate(changeData);
    }
  };

  updatePaymentOutWithTxn = async (db, doc, billDetails, transactionNumber) => {
    const businessData = await Bd.getBusinessData();

    const paymentOutData = await db.paymentout
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              receiptNumber: { $eq: doc.receiptNumber }
            },
            { vendorId: { $eq: billDetails.vendor_id } }
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

        let linkedTxn = {
          linkedId: billDetails.purchase_order_invoice_number,
          date: '',
          linkedAmount: doc.linkedAmount,
          paymentType: 'Purchases',
          transactionNumber: transactionNumber,
          sequenceNumber: doc.sequenceNumber
        };

        if (typeof oldData.linkedTxnList === 'undefined') {
          oldData.linkedTxnList = [];
        }
        oldData.linkedTxnList.push(linkedTxn);

        oldData.linked_amount =
          (parseFloat(oldData.linked_amount) || 0) + doc.linkedAmount;
      }

      oldData.updatedAt = Date.now();
      console.log('updated old data updateSalesReturnWithTxn::', oldData);
      return oldData;
    });

    if (paymentOutData) {
      await paymentOutData.atomicUpdate(changeData);
    }
  };

  removeLinkedTxnPaymentOut = async (db, doc, billDetails) => {
    const businessData = await Bd.getBusinessData();

    const paymentOutData = await db.paymentout
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              receiptNumber: { $eq: doc.linkedId }
            },
            { vendorId: { $eq: billDetails.vendor_id } }
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
          if (element.linkedId !== billDetails.purchase_order_invoice_number) {
            finalLinkedTxnList.push(element);
          } else {
            const linkedAmount = parseFloat(element.linkedAmount);
            oldData.balance += linkedAmount;
            this.unLinkedTxnList.push(element);

            oldData.linked_amount =
              (parseFloat(oldData.linked_amount) || 0) - linkedAmount;
          }
        });

        oldData.updatedAt = Date.now();
        oldData.linkedTxnList = finalLinkedTxnList;
        return oldData;
      }
    });

    if (paymentOutData) {
      await paymentOutData.atomicUpdate(changeData);
    }
  };

  updatePurchasesReturnWithTxn = async (
    db,
    doc,
    billDetails,
    transactionNumber
  ) => {
    const businessData = await Bd.getBusinessData();

    const purchaseReturnData = await db.purchasesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              purchase_return_number: { $eq: doc.purchase_return_number }
            },
            { vendor_id: { $eq: doc.vendor_id } }
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
          linkedId: billDetails.purchase_order_invoice_number,
          date: '',
          linkedAmount: doc.linkedAmount,
          paymentType: 'Purchases',
          transactionNumber: transactionNumber,
          sequenceNumber: doc.sequenceNumber
        };

        if (typeof oldData.linkedTxnList === 'undefined') {
          oldData.linkedTxnList = [];
        }
        oldData.linkedTxnList.push(linkedTxn);

        oldData.linked_amount =
          (parseFloat(oldData.linked_amount) || 0) + doc.linkedAmount;
      }

      oldData.updatedAt = Date.now();
      return oldData;
    });

    if (purchaseReturnData) {
      await purchaseReturnData.atomicUpdate(changeData);
    }
  };

  removeLinkedTxnPurchasesReturn = async (db, doc, billDetails) => {
    const businessData = await Bd.getBusinessData();

    const purchaseReturnData = await db.purchasesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              purchase_return_number: { $eq: doc.linkedId }
            },
            { vendor_id: { $eq: billDetails.vendor_id } }
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
          if (element.linkedId !== billDetails.purchase_order_invoice_number) {
            finalLinkedTxnList.push(element);
          } else {
            const linkedAmount = parseFloat(element.linkedAmount);
            oldData.balance_amount += linkedAmount;
            this.unLinkedTxnList.push(element);

            oldData.linked_amount =
              (parseFloat(oldData.linked_amount) || 0) - linkedAmount;
          }
        });

        oldData.linkedTxnList = finalLinkedTxnList;
        oldData.updatedAt = Date.now();
        return oldData;
      }
    });

    if (purchaseReturnData) {
      await purchaseReturnData.atomicUpdate(changeData);
    }
  };

  getSaledata = async (db, id) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                customer_id: { $eq: id }
              },
              { balance_amount: { $gt: 0.0 } }
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
            finalData.paymentType = 'Sales';

            finalData.date = item.invoice_date;
            finalData.id = item.invoice_number;
            finalData.total = item.total_amount;
            finalData.balance = item.balance_amount;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              runInAction(() => {
                this.paymentLinkTransactions.push(finalData);
              });
            }
          });

          resolve(`done `);
        });
    });
  };

  getSalesLinkedData = async (db, billDetails) => {
    console.log('getSalesLinkedData');

    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.sales
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                customer_id: { $eq: billDetails.vendor_id }
              },
              {
                linkedTxnList: {
                  $elemMatch: {
                    linkedId: { $eq: billDetails.purchase_order_invoice_number }
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
            return;
          }
          data.map((item) => {
            // console.log('sales', item.toJSON());
            let finalData = item.toJSON();
            finalData.paymentType = 'Sales';

            finalData.date = item.invoice_date;
            finalData.id = item.invoice_number;
            finalData.total = item.total_amount;
            finalData.balance = item.balance_amount;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentUnLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              runInAction(() => {
                this.paymentUnLinkTransactions.push(finalData);
              });
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
                txnType: { $eq: 'Opening Receivable Balance' }
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
            finalData.paymentType = 'Opening Receivable Balance';
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

  getPaymentOutData = async (db, id) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.paymentout
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                vendorId: { $eq: id }
              },
              { balance: { $gt: 0 } }
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
            finalData.paymentType = 'Payment Out';

            finalData.id = item.receiptNumber;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              runInAction(() => {
                this.paymentLinkTransactions.push(finalData);
              });
            }
          });

          resolve(`done `);
        });
    });
  };

  getPaymentOutLinkedData = async (db, billDetails) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.paymentout
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                vendorId: { $eq: billDetails.vendor_id }
              },
              {
                linkedTxnList: {
                  $elemMatch: {
                    linkedId: { $eq: billDetails.purchase_order_invoice_number }
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
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Payment Out';

            finalData.id = item.receiptNumber;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentUnLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              runInAction(() => {
                this.paymentUnLinkTransactions.push(finalData);
              });
            }
          });

          resolve(`done `);
        });
    });
  };

  getPurchaseReturnsData = async (db, id) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.purchasesreturn
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
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Purchases Return';

            finalData.id = item.purchase_return_number;
            finalData.total = item.total_amount;
            finalData.balance = item.balance_amount;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              runInAction(() => {
                this.paymentLinkTransactions.push(finalData);
              });
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
            finalData.paymentType = 'Opening Receivable Balance';
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

  getPurchaseReturnsLinkedData = async (db, billDetails) => {
    return new Promise(async (resolve) => {
      const businessData = await Bd.getBusinessData();

      await db.purchasesreturn
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                vendor_id: { $eq: billDetails.vendor_id }
              },
              {
                linkedTxnList: {
                  $elemMatch: {
                    linkedId: { $eq: billDetails.purchase_order_invoice_number }
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
            return;
          }
          data.map((item) => {
            let finalData = item.toJSON();
            finalData.paymentType = 'Purchases Return';

            finalData.id = item.purchase_return_number;
            finalData.total = item.total_amount;
            finalData.balance = item.balance_amount;
            finalData.sequenceNumber = item.sequenceNumber;

            var index = this.paymentUnLinkTransactions.findIndex(
              (x) => x.id === finalData.id
            );

            if (index === -1) {
              runInAction(() => {
                this.paymentUnLinkTransactions.push(finalData);
              });
            }
          });

          resolve(`done `);
        });
    });
  };

  get getBalanceAfterLinkedAmount() {
    let result = 0;

    result =
      this.billDetails.total_amount - this.billDetails.linked_amount ||
      //  -
      // this.billDetails.paid_amount
      0;

    return result;
  }

  setLinkedAmount = async (value) => {
    const amount = parseFloat(value) || 0;
    runInAction(() => {
      this.billDetails.linked_amount = amount;
    });
  };

  closeLinkPayment = () => {
    runInAction(() => {
      this.openLinkpaymentPage = false;
    });
  };

  selectedPaymentItem = async (row) => {
    var index = this.paymentLinkTransactions.findIndex((x) => x.id === row.id);

    if (index >= 0) {
      const txnSelected = this.paymentLinkTransactions[index];

      /**
       * since total amount is calculated it will be set only during save/update
       */
      const totalAmount = this.billDetails.total_amount;
      // const paidAmount = parseFloat(this.billDetails.paid_amount) || 0;
      let linkedAmount = parseFloat(this.billDetails.linked_amount) || 0;

      // let amountToLink = (totalAmount - paidAmount - linkedAmount) || 0;
      let amountToLink = totalAmount - linkedAmount || 0;

      if (txnSelected.balance >= amountToLink) {
        txnSelected.linkedAmount = amountToLink;

        runInAction(() => {
          this.billDetails.linked_amount =
            this.billDetails.linked_amount + amountToLink;
        });
      } else {
        txnSelected.linkedAmount = txnSelected.balance;

        runInAction(() => {
          this.billDetails.linked_amount =
            this.billDetails.linked_amount + txnSelected.balance;
        });
      }

      txnSelected.balance =
        parseFloat(txnSelected.balance) - parseFloat(txnSelected.linkedAmount);

      txnSelected.selected = true;
      runInAction(() => {
        this.paymentLinkTransactions[index] = txnSelected;
      });
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
      runInAction(() => {
        this.billDetails.linked_amount =
          this.billDetails.linked_amount - linkedAmount;
      });
      txnSelected.balance =
        parseFloat(txnSelected.balance) + parseFloat(txnSelected.linkedAmount);

      txnSelected.linkedAmount = 0;

      txnSelected.selected = false;
      runInAction(() => {
        this.paymentLinkTransactions[index] = txnSelected;
      });
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

    const totalAmount = this.billDetails.total_amount;
    // const paidAmount = parseFloat(this.billDetails.paid_amount) || 0;
    let linkedAmount = parseFloat(this.billDetails.linked_amount) || 0;

    // let amountToLink = (totalAmount - paidAmount - linkedAmount) || 0;
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
      runInAction(() => {
        this.billDetails.linked_amount = finalLinkedAmount;
      });
    }
  };

  saveLinkPaymentChanges = () => {
    if (this.billDetails.linked_amount > 0) {
      runInAction(() => {
        this.billDetails.linkPayment = true;
      });
    }
    this.closeLinkPayment();
  };

  selectProductFromBatch = (
    batchItem,
    currentProductRowIndexToReset,
    isBarcode
  ) => {
    if (!batchItem) {
      return;
    }

    const {
      purchasedPrice,
      qty,
      purchaseDiscountPercent,
      mfDate,
      expiryDate,
      rack,
      warehouseData,
      batchNumber,
      modelNo,
      barcode,
      properties
    } = batchItem;

    let existingPurchaseProduct;
    existingPurchaseProduct = this.items.find((product, index) =>
      this.findBatchProduct(product, index, batchItem)
    );

    if (existingPurchaseProduct) {
      this.items[existingPurchaseProduct.index] = existingPurchaseProduct;
      this.setQuantity(
        existingPurchaseProduct.index,
        existingPurchaseProduct.qty
      );
      this.resetSingleProduct(currentProductRowIndexToReset);
      setTimeout(() => {
        this.FocusLastIndex = isBarcode
          ? Number('6' + currentProductRowIndexToReset)
          : Number('4' + currentProductRowIndexToReset);
      }, 100);
      this.handleBatchListModalClose();
    } else {
      runInAction(() => {
        if (this.purchaseOrderTxnEnableFieldsMap.get('enable_product_price')) {
          this.items[this.selectedIndex].purchased_price =
            parseFloat(purchasedPrice);
        } else if (
          this.purchaseOrderTxnEnableFieldsMap.get(
            'enable_product_price_per_gram'
          )
        ) {
          this.items[this.selectedIndex].pricePerGram =
            parseFloat(purchasedPrice);
        }

        this.items[
          this.selectedIndex
        ].originalPurchasePriceWithoutConversionQty =
          parseFloat(purchasedPrice);

        this.items[this.selectedIndex].batch_id = batchItem.id;

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

      this.setQuantity(this.selectedIndex, 1);
      let billdiscount = this.billDetails.discountPercentForAllItems
        ? parseFloat(this.billDetails.discountPercentForAllItems)
        : 0;
      this.items[this.selectedIndex].originalDiscountPercent =
        purchaseDiscountPercent + billdiscount;
      this.setItemDiscount(
        this.selectedIndex,
        this.items[this.selectedIndex].originalDiscountPercent
      );
      this.handleBatchListModalClose();
      this.addNewItem(true, true, true);
    }
  };

  handleBatchListModalClose = (val) => {
    this.OpenPurchaseOrderBatchList = false;
    if (val) {
      this.items[this.selectedIndex].purchased_price = parseFloat(
        val.purchasedPrice
      );

      // TODO: Add logic here
    }
    runInAction(() => {
      this.selectedProduct = {};
    });
  };

  setInvoiceRegularSetting = (invoiceRegular) => {
    runInAction(() => {
      this.purchasesInvoiceRegular = invoiceRegular;
    });
  };

  setInvoiceThermalSetting = (invoicThermal) => {
    runInAction(() => {
      this.purchasesInvoiceThermal = invoicThermal;
    });
  };

  setPaymentMode = (value) => {
    this.billDetails.bankPaymentType = value;
  };

  setBankAccountData = (value) => {
    if (value.accountDisplayName && value.id) {
      runInAction(() => {
        this.billDetails.payment_type = value.accountDisplayName;
        this.billDetails.bankAccount = value.accountDisplayName;
        this.billDetails.bankAccountId = value.id;
      });
    }
  };

  generateBillNumber = async () => {
    /**
     * generate bill number
     */
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('po');
    runInAction(() => {
      this.billDetails.purchase_order_invoice_number = `${id}${appId}${timestamp}`;
    });
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
          transSettings.purchaseOrder.prefixSequence &&
          transSettings.purchaseOrder.prefixSequence.length > 0
            ? transSettings.purchaseOrder.prefixSequence[0].prefix
            : '';
      });
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      runInAction(() => {
        this.invoiceData.prefix = localStorage.getItem('deviceName');
        this.invoiceData.subPrefix = 'PO';
      });
      isOnline = false;
    }

    this.billDetails.sequenceNumber = await sequence.getFinalSequenceNumber(
      this.invoiceData,
      'Purchase Order',
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
  };

  setPaymentReferenceNumber = (value) => {
    this.billDetails.paymentReferenceNumber = value;
  };

  setTaxSettingsData = (value) => {
    this.taxSettingsData = value;
  };

  setPurchaseOrderTxnEnableFieldsMap = (purchaseOrderTransSettingData) => {
    this.purchaseOrderTransSettingData = purchaseOrderTransSettingData;

    this.purchaseOrderTxnEnableFieldsMap = new Map();
    if (purchaseOrderTransSettingData.businessId.length > 2) {
      const productLevel =
        purchaseOrderTransSettingData.enableOnTxn.productLevel;
      productLevel.map((item) => {
        if (this.purchaseOrderTxnEnableFieldsMap.has(item.name)) {
          this.purchaseOrderTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.purchaseOrderTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      const billLevel = purchaseOrderTransSettingData.enableOnTxn.billLevel;
      billLevel.map((item) => {
        if (this.purchaseOrderTxnEnableFieldsMap.has(item.name)) {
          this.purchaseOrderTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.purchaseOrderTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      if (
        !this.isUpdate &&
        this.purchaseOrderTxnEnableFieldsMap.get('enable_roundoff_default')
      ) {
        this.billDetails.is_roundoff = true;
      }
    }
  };

  setDiscount = (value) => {
    if (!this.billDetails) {
      return;
    }

    runInAction(() => {
      this.billDetails.discount_type = 'percentage';
      this.billDetails.discount_percent = value ? parseFloat(value) : '';
    });
  };

  setDiscountPercentForAllItems = (value) => {
    this.billDetails.discountPercentForAllItems = value
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
    if (!this.billDetails) {
      return;
    }

    runInAction(() => {
      this.billDetails.discount_type = 'amount';
      this.billDetails.discount_amount = value ? parseFloat(value) : '';
    });
  };

  setDiscountType = (value) => {
    if (!this.billDetails) {
      return;
    }
    runInAction(() => {
      if (value === '%') {
        this.billDetails.discount_type = 'percentage';
      } else {
        this.billDetails.discount_type = 'amount';
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

  setTaxIncluded = (index) => {
    if (this.items[index].taxIncluded === true) {
      this.items[index].taxIncluded = false;
    } else {
      this.items[index].taxIncluded = true;
    }

    this.getAmount(index);
  };

  get getTotalNetWeight() {
    if (!this.items) {
      return 0;
    }

    let total = 0;

    for (let item of this.items) {
      total = total + parseFloat(item.netWeight || 0);
    }

    return parseFloat(total);
  }

  get getTotalGrossWeight() {
    if (!this.items) {
      return 0;
    }

    let total = 0;

    for (let item of this.items) {
      total = total + parseFloat(item.grossWeight || 0);
    }

    return parseFloat(total);
  }

  get getTotalWatage() {
    if (!this.items) {
      return 0;
    }

    let total = 0;

    for (let item of this.items) {
      total = total + parseFloat(item.wastageGrams || 0);
    }

    return parseFloat(total);
  }

  setNotes = (value) => {
    this.billDetails.notes = value;
  };

  setDueDate = (value) => {
    this.billDetails.due_date = value;
  };

  getAddRowEnabled = () => {
    return this.addNewRowEnabled;
  };

  setAddRowEnabled = (value) => {
    this.addNewRowEnabled = value;
  };

  handlePurchaseOrderSearchByEmployeeAndDate = async (
    value,
    fromDate,
    toDate,
    employeeId
  ) => {
    if (employeeId) {
      const db = await Db.get();
      let data = [];

      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      const businessData = await Bd.getBusinessData();

      await db.purchaseorder
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
                        po_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        po_date: {
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
                        po_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        po_date: {
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
                        po_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        po_date: {
                          $lte: toDate
                        }
                      }
                    ]
                  },
                  {
                    $and: [
                      { vendor_name: { $regex: regexp } },
                      { employeeId: { $eq: employeeId } },
                      {
                        po_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        po_date: {
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
                        po_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        po_date: {
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
    } else {
      return this.handlePurchaseOrderSearchWithDate(value, fromDate, toDate);
    }
  };

  viewAndRestorePurchaseOrderItem = async (item) => {
    runInAction(() => {
      this.OpenAddPurchaseOrder = true;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.isUpdate = false;
      this.isRestore = true;
      this.existingBillData = item;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
      this.invoiceData = {};
    });

    //reset linked txn details start
    item.linkedTxnList = [];
    item.linkPayment = false;
    item.balance_amount =
      parseFloat(item.balance_amount) - parseFloat(item.linked_amount);
    item.linked_amount = 0;
    //reset linked txn details end

    const billDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      purchase_order_invoice_number: item.purchase_order_invoice_number,
      po_date: item.po_date,
      due_date: item.due_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // paid_amount: item.paid_amount,
      balance_amount: this.getBalanceData,
      linkedTxnList: item.linkedTxnList,
      linkPayment: item.linkPayment,
      linked_amount: item.linked_amount,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      place_of_supply: item.place_of_supply,
      placeOfSupplyName: item.placeOfSupplyName,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      status: item.status,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      sequenceNumber: item.sequenceNumber,
      employeeId: item.employeeId,
      isSyncedToServer: item.isSyncedToServer,
      vendorMsmeRegNo: item.vendorMsmeRegNo,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    if (
      parseFloat(item.balance_amount) > 0 &&
      item.vendor_id !== '' &&
      item.vendor_id.length > 2
    ) {
      const db = await Db.get();
      await this.getAllUnPaidTxnForVendor(db, item.vendor_id);
    }

    this.billDetails = billDetails;
  };

  restorePurchaseOrderItem = async (item, isRestoreWithNextSequenceNo) => {
    runInAction(() => {
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.isRestore = true;
      this.isUpdate = false;
      this.existingBillData = item;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
      this.invoiceData = {};
    });

    //reset linked txn details start
    item.linkedTxnList = [];
    item.linkPayment = false;
    item.balance_amount =
      parseFloat(item.balance_amount) - parseFloat(item.linked_amount);
    item.linked_amount = 0;
    //reset linked txn details end

    const billDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      purchase_order_invoice_number: item.purchase_order_invoice_number,
      po_date: item.po_date,
      due_date: item.due_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // paid_amount: item.paid_amount,
      balance_amount: this.getBalanceData,
      linkedTxnList: item.linkedTxnList,
      linkPayment: item.linkPayment,
      linked_amount: item.linked_amount,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      place_of_supply: item.place_of_supply,
      placeOfSupplyName: item.placeOfSupplyName,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      status: item.status,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      employeeId: item.employeeId,
      sequenceNumber: item.sequenceNumber,
      isSyncedToServer: item.isSyncedToServer,
      vendorMsmeRegNo: item.vendorMsmeRegNo,
      discountPercentForAllItems: item.discountPercentForAllItems,
      imageUrls: item.imageUrls
    };

    this.billDetails = billDetails;

    if (isRestoreWithNextSequenceNo) {
      await this.generateBillNumber();
      await this.getSequenceNumber(
        this.billDetails.po_date,
        this.billDetails.purchase_order_invoice_number
      );
      this.billDetails.po_date = getTodayDateInYYYYMMDD();
    }

    this.saveData(false);
  };

  markPurchaseOrderRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            transactionId: {
              $eq: this.billDetails.purchase_order_invoice_number
            }
          }
        ]
      }
    });
    await query
      .remove()
      .then(async (data) => {
        console.log('Deleted data removed' + data);
        this.billDetails = {};
      })
      .catch((error) => {
        console.log('Deleted data deletion Failed ' + error);
      });
  };

  resetPurchaseOrderPrintData = async () => {
    runInAction(() => {
      this.printPurchaseOrderData = {};
      this.openPurchaseOrderPrintSelectionAlert = false;
    });
  };

  handleOpenPurchaseOrderLoadingMessage = async () => {
    runInAction(() => {
      this.openPurchaseOrderLoadingAlertMessage = true;
    });
  };

  handleClosePurchaseOrderLoadingMessage = async () => {
    runInAction(() => {
      this.openPurchaseOrderLoadingAlertMessage = false;
    });
  };

  handleOpenPurchaseOrderErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseOrderErrorAlertMessage = true;
    });
  };

  handleClosePurchaseOrderErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseOrderErrorAlertMessage = false;
    });
  };

  handleOpenPurchaseOrderPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseOrderPrintSelectionAlert = true;
    });
  };

  handleClosePurchaseOrderPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseOrderPrintSelectionAlert = false;
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
                serialItem.purchased === true
              ) {
                isProductSold = true;
                runInAction(() => {
                  this.errorAlertMessage =
                    'Product with Serial No: ' + value + ' is already purchased';
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
                this.openPurchaseOrderValidationMessage = true;
                this.items[index].serialOrImeiNo = '';
              });
            } else {
              this.selectedProduct = actualProduct;
              this.selectedIndex = index;
              runInAction(() => {
                if (
                  this.purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_price'
                  )
                ) {
                  this.items[index].purchased_price = parseFloat(
                    actualProduct.purchasedPrice
                  );
                } else if (
                  this.purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  )
                ) {
                  this.items[index].pricePerGram = parseFloat(
                    actualProduct.purchasedPrice
                  );
                }

                this.items[index].originalPurchasePriceWithoutConversionQty =
                  parseFloat(actualProduct.purchasedPrice);
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
                this.items[index].hsn = actualProduct.hsn;

                salePercent = actualProduct.purchaseDiscountPercent;

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
                  if (actualProduct.purchaseCgst > 0) {
                    this.items[index].cgst = actualProduct.purchaseCgst;
                  }
                  if (actualProduct.purchaseSgst > 0) {
                    this.items[index].sgst = actualProduct.purchaseSgst;
                  }
                } else {
                  this.items[index].igst = actualProduct.purchaseIgst;
                }
              });
              this.setQuantity(index, 1);
              let billdiscount = this.billDetails.discountPercentForAllItems
                ? parseFloat(this.billDetails.discountPercentForAllItems)
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

  resetVendor = () => {
    runInAction(() => {
      this.billDetails.vendor_id = '';
      this.billDetails.vendor_name = '';
      this.billDetails.vendor_gst_number = '';
      this.billDetails.vendor_gst_type = '';
      this.billDetails.vendor_phone_number = '';
      this.billDetails.vendorCity = '';
      this.billDetails.vendorPincode = '';
      this.billDetails.vendorAddress = '';
      this.billDetails.vendorState = '';
      this.billDetails.vendorCountry = '';
      this.billDetails.vendor_email_id = '';
      this.billDetails.vendorMsmeRegNo = '';
    });
  };

  handleSerialListModalClose = (val) => {
    runInAction(() => {
      this.OpenPurchaseOrderSerialList = false;
      this.selectedProduct = {};
    });
  };

  selectProductFromSerial = (selectedIndex, selectedProduct) => {
    runInAction(() => {
      if (this.purchaseOrderTxnEnableFieldsMap.get('enable_product_price')) {
        this.items[this.selectedIndex].purchased_price = parseFloat(
          selectedProduct.purchasedPrice
        );
      } else if (
        this.purchaseOrderTxnEnableFieldsMap.get(
          'enable_product_price_per_gram'
        )
      ) {
        this.items[this.selectedIndex].pricePerGram = parseFloat(
          selectedProduct.purchasedPrice
        );
      }

      this.items[this.selectedIndex].originalPurchasePriceWithoutConversionQty =
        parseFloat(selectedProduct.purchasedPrice);

      this.items[this.selectedIndex].stockQty = selectedProduct.qty;

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
      let serialNos = [];
      for (let item of selectedProduct.serialData) {
        if (item.selected) {
          serialNos.push(item.serialNo);
        }
      }
      this.items[this.selectedIndex].serialNo = serialNos;
      this.items[this.selectedIndex].qty = serialNos.length;

      this.items[this.selectedIndex].description = serialNos
        ? serialNos.join(', ')
        : '';
    });

    this.getAmount(this.selectedIndex);
    this.handleSerialListModalClose();
    this.addNewItem(true, true, true);
    let billdiscount = this.billDetails.discountPercentForAllItems
      ? parseFloat(this.billDetails.discountPercentForAllItems)
      : 0;
    this.items[this.selectedIndex].originalDiscountPercent =
      selectedProduct.purchaseDiscountPercent + billdiscount;
    this.setItemDiscount(
      this.selectedIndex,
      this.items[this.selectedIndex].originalDiscountPercent
    );
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
  handleOpenPurchaseBillErrorAlertMessage = async (message) => {
    runInAction(() => {
      this.openPurchaseOrderValidationMessage = true;
      this.errorAlertMessage = message;
    });
  };

  handleClosePurchaseOrderValidationAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseOrderValidationMessage = false;
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
    const purchaseDetails = JSON.parse(JSON.stringify(item));

    this.items = item.item_list;

    runInAction(async () => {
      this.billDetails = purchaseDetails;
      this.billDetails.po_date = getTodayDateInYYYYMMDD();
      this.billDetails.sequenceNumber = '';
      await this.checkForTaxAndLoadUI();
      this.generateBillNumber();
    });
  };

  checkForTaxAndLoadUI = async (revalidateTax) => {
    let item = this.billDetails;
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
      if (businessStateCode !== '') {
        let result = getStateList().find((e) => e.name === taxData.state);
        this.setPlaceOfSupplyState(result.name);
        this.setPurchaseOrderPlaceOfSupply(result.val);
      }
      if (item.vendor_gst_number && item.vendor_gst_number !== '') {
        let customerExtractedStateCode = item.vendor_gst_number.slice(0, 2);
        this.setPlaceOfSupplyState(item.vendorState);
        if (
          businessStateCode !== '' &&
          customerExtractedStateCode !== '' &&
          businessStateCode === customerExtractedStateCode
        ) {
          this.setCGSTSGSTEnabledByPOS(true);
        } else {
          this.setCGSTSGSTEnabledByPOS(false);
        }
      } else if (item.vendorState && item.vendorState !== '') {
        let result = getStateList().find((e) => e.code === businessStateCode);
        if (result) {
          let businessState = result.name;
          this.setPlaceOfSupplyState(item.vendorState);
          if (
            item.vendorState !== '' &&
            item.vendorState !== null &&
            businessState !== '' &&
            businessState !== null &&
            item.vendorState.toLowerCase() === businessState.toLowerCase()
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
      this.OpenAddPurchaseOrder = true;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.isUpdate = false;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
      this.invoiceData = {};
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

  launchSerialDataDialog = async (item, index) => {
    let selector = {
      $and: [{ productId: { $eq: item.product_id } }]
    };
    let product = await getProductDataById(selector);
    let filteredSerialData = product.serialData.filter((ele) => {
      return ele.purchased === false;
    });
    if (item.serialNo && item.serialNo.length > 0) {
      let serialNo = [];
      for (let fs of filteredSerialData) {
        if (item.serialNo.includes(fs.serialImeiNo)) {
          serialNo.push({
            serialNo: fs.serialImeiNo,
            selected: true
          });
        } else {
          serialNo.push({
            serialNo: fs.serialImeiNo,
            selected: false
          });
        }
      }
      this.selectedProduct.serialData = serialNo;

      this.selectedIndex = index;
      this.OpenPurchaseOrderSerialList = true;
    }
  };

  setPlaceOfSupplyState = (val) => {
    runInAction(() => {
      this.placeOfSupplyState = val;
    });
  };

  constructor() {
    makeObservable(this, {
      selectedCustomerBalance: observable,
      billDetails: observable,
      items: observable,
      setDiscount: action,
      setQuantity: action,
      setItemSku: action,
      setItemBarcode: action,
      setItemName: action,
      setPurchasedPrice: action,
      getAmount: action,
      setCGST: action,
      setSGST: action,
      setDiscountAmount: action,
      deleteItem: action,
      getTotalAmount: computed,
      getBalanceData: computed,
      setPaymentType: action,
      toggleRoundOff: action,
      // setPaid: action,
      getRoundedAmount: computed,
      newVendor: observable,
      newVendorData: observable,
      setVendor: action,
      saveData: action,
      saveDataAndNew: action,
      isUpdate: observable,
      OpenAddPurchaseOrder: observable,
      closeDialog: action,
      viewOrEditItem: action,
      openForNewPurchaseOrder: action,
      selectProduct: action,
      setEditTable: action,
      viewOrEditPurchaseOrderTxnItem: action,
      deletePurchaseOrderTxnItem: action,
      purchasesData: observable,
      purchases: observable,
      getPurchaseOrderData: computed,
      getPurchaseOrderDetails: action,
      addPurchaseOrderData: action,
      vendorList: observable,
      setVendorList: action,
      getVendorList: computed,
      dateDropValue: observable,
      setDateDropValue: action,
      getDateDropValue: computed,
      getBalanceAfterLinkedAmount: computed,
      getPurchaseOrderCount: action,
      isPurchaseOrderList: observable,
      getPurchaseOrderList: action,
      handlePurchaseOrderSearch: action,
      openLinkpaymentPage: observable,
      paymentLinkTransactions: observable,
      enabledRow: observable,
      OpenPurchaseOrderBatchList: observable,
      selectedProduct: observable,
      setInvoiceRegularSetting: action,
      FocusLastIndex: observable,
      setInvoiceThermalSetting: action,
      setFocusLastIndex: action,
      setPaymentMode: action,
      setBankAccountData: action,
      setPaymentReferenceNumber: action,
      taxSettingsData: observable,
      setTaxSettingsData: action,
      setItemHSN: action,
      purchaseOrderTxnEnableFieldsMap: observable,
      setPurchaseOrderTxnEnableFieldsMap: action,
      setLinkPayment: action,
      getAddRowEnabled: action,
      setAddRowEnabled: action,
      setMakingChargePerGramAmount: action,
      viewAndRestorePurchaseOrderItem: action,
      restorePurchaseOrderItem: action,
      isRestore: observable,
      printPurchaseOrderData: observable,
      openPurchaseOrderLoadingAlertMessage: observable,
      openPurchaseOrderErrorAlertMessage: observable,
      openPurchaseOrderPrintSelectionAlert: observable,
      setMakingChargeIncluded: action,
      setRoundingConfiguration: action,
      descriptionCollapsibleMap: observable,
      openAddressList: observable,
      customerAddressList: observable,
      isCGSTSGSTEnabledByPOS: observable,
      sequenceNumberFailureAlert: observable,
      OpenPurchaseOrderSerialList: observable,
      openPurchaseOrderValidationMessage: observable,
      errorAlertMessage: observable,
      placeOfSupplyState: observable
    });
  }
}
export default new PurchaseOrderStore();