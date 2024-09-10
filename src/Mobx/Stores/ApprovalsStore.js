import {
  action,
  computed,
  observable,
  makeObservable,
  toJS,
  runInAction
} from 'mobx';
import * as Db from '../../RxDb/Database/Database';

import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';

import _uniqueId from 'lodash/uniqueId';
import * as Bd from '../../components/SelectedBusiness';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

class ApprovalsStore {
  isUpdate = false;

  OpenAddApprovalInvoice = false;

  selectedProduct = {};
  saveAndNew = false;

  existingApprovalData = {};

  selectedIndex = 0;
  FocusLastIndex = false;
  enabledRow = 0;
  addNewRowEnabled = false;

  approvalTxnSettingsData = {};

  approvalDetails = {
    businessId: '',
    businessCity: '',
    approvalNumber: '',
    sequenceNumber: '',
    approvalDate: '',
    subTotal: 0,
    totalAmount: 0,
    is_roundoff: false,
    updatedAt: '',
    posId: '',
    employeeId: '',
    employeeName: '',
    employeePhoneNumber: '',
    approvalCreatedEmployeeId: '',
    notes: '',
    numberOfItems: 0,
    numberOfSelectedItems: 0,
    numberOfPendingItems: 0,
    round_amount: 0,
    isSyncedToServer: false
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
      isSelected: false,
      makingChargePercent: 0,
      makingChargeAmount: 0,
      makingChargeType: '',
      makingChargePerGramAmount: 0,
      makingChargeIncluded: false,
      pricePerGram: 0,
      stoneWeight: 0,
      stoneCharge: 0,
      itemNumber: 0,
      hallmarkCharge: 0,
      certificationCharge: 0
    }
  ];

  dateDropValue = null;
  isApprovalsList = false;

  approvalsInvoiceRegular = {};
  approvalsInvoiceThermal = {};

  openRegularPrint = false;

  approvalTxnEnableFieldsMap = new Map();

  taxSettingsData = {};

  isRestore = false;

  openApprovalLoadingAlertMessage = false;
  openApprovalErrorAlertMessage = false;

  printData = null;

  openApprovalPrintSelectionAlert = false;

  roundingConfiguration = 'Nearest 50';

  sequenceNumberFailureAlert = false;

  toggleRoundOff = () => {
    if (!this.approvalDetails) {
      return;
    }
    this.approvalDetails.is_roundoff = !this.approvalDetails.is_roundoff;
  };

  getApprovalsDetails = async (customerId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.approvals
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
        this.approvals = data.map((item) => item.toJSON());
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

  setEmployeeName = (data) => {
    runInAction(() => {
      this.approvalDetails.employeeName = data;
    });
  };

  setApprovalDate = (data) => {
    runInAction(() => {
      this.approvalDetails.approvalDate = data;
    });
  };

  setEmployeeId = (data) => {
    runInAction(() => {
      this.approvalDetails.employeeId = data;
    });
  };

  setEmployee = (data) => {
    runInAction(() => {
      this.approvalDetails.employeeName = data.name;
      this.approvalDetails.employeeId = data.id;
      this.approvalDetails.employeePhoneNumber = data.userName;
    });
  };

  addApprovalsData = (data) => {
    if (data) {
      runInAction(() => {
        if (data.length > 0) {
          this.approvalsData = data.map((item) => item.toJSON());
        } else {
          this.approvalsData = [];
        }
      });
    }
  };

  addApprovalsJSONData = (data) => {
    if (data) {
      runInAction(() => {
        if (data.length > 0) {
          this.approvalsData = data.map((item) => item);
        } else {
          this.approvalsData = [];
        }
      });
    }
  };

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

  get getApprovalsData() {
    return this.approvalsData ? this.approvalsData : [];
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
    // console.log('roundOFF', returnValue);
    let finalValue = returnValue;

    //sun total is exluded with overal discount and shipping charges
    runInAction(() => {
      this.approvalDetails.subTotal = parseFloat(returnValue).toFixed(2);
    });

    const discountAmount = this.calculateDiscountAmount(finalValue);

    let totalAmount = parseFloat(finalValue - discountAmount);

    if (this.approvalDetails.is_roundoff) {
      let beforeRoundTotalAmount = totalAmount;

      if (this.roundingConfiguration === 'Nearest 50') {
        totalAmount = Math.round(totalAmount);
      } else if (this.roundingConfiguration === 'Upward Rounding') {
        totalAmount = Math.ceil(totalAmount);
      } else if (this.roundingConfiguration === 'Downward Rounding') {
        totalAmount = Math.floor(totalAmount);
      }

      runInAction(() => {
        this.approvalDetails.round_amount = parseFloat(
          totalAmount - beforeRoundTotalAmount
        ).toFixed(2);
      });
    }

    this.approvalDetails.totalAmount = totalAmount;
    return totalAmount;
  }

  getApprovalsCount = async () => {
    const db = await Db.get();
    // console.log('inside approvals count');
    const businessData = await Bd.getBusinessData();

    const query = db.approvals.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isApprovalsList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getApprovalsList = async (fromDate, toDate) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    const businessData = await Bd.getBusinessData();

    var query;
    if (!fromDate || !toDate) {
      query = db.approvals.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              updatedAt: { $exists: true }
            },
            {
              approvalDate: { $exists: true }
            }
          ]
        },
        sort: [{ approvalDate: 'desc' }, { updatedAt: 'desc' }]
      });
    } else {
      query = db.approvals.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              approvalDate: {
                $gte: fromDate
              }
            },
            {
              approvalDate: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ approvalDate: 'desc' }, { updatedAt: 'desc' }]
      });
    }

    query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }
        runInAction(() => {
          this.approvalsData = data.map((item) => item.toJSON());
        });
      })
      .catch((err) => {
        runInAction(() => {
          this.approvalsData = [];
        });
        console.log('Internal Server Error', err);
      });
  };

  getApprovalsListWithLimit = async (fromDate, toDate, pageSize) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;

    if (!pageSize) {
      pageSize = 5;
    }

    const businessData = await Bd.getBusinessData();

    if (!fromDate || !toDate) {
      query = db.approvals.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              updatedAt: { $exists: true }
            },
            {
              approvalDate: { $exists: true }
            }
          ]
        },
        sort: [{ approvalDate: 'desc' }, { updatedAt: 'desc' }],
        limit: pageSize
      });
    } else {
      query = db.approvals.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              approvalDate: {
                $gte: fromDate
              }
            },
            {
              approvalDate: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ approvalDate: 'desc' }, { updatedAt: 'desc' }],
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
          this.approvalsData = data.map((item) => item.toJSON());
        });
      })
      .catch((err) => {
        runInAction(() => {
          this.approvalsData = [];
        });
        console.log('Internal Server Error', err);
      });
  };

  handleApprovalsSearch = async (value) => {
    const db = await Db.get();
    console.log('handleApprovalsSearch', value);
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.approvals
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                { sequenceNumber: { $regex: regexp } },
                { employeeName: { $regex: regexp } },
                { employeeMobile: { $regex: regexp } },
                { totalAmount: { $eq: parseFloat(value) } }
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

  handleApprovalsSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();
    // console.log('handleApprovalsSearch', value);
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    let query = await db.approvals.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } },

              {
                approvalDate: {
                  $gte: fromDate
                }
              },
              {
                approvalDate: {
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
                approvalDate: {
                  $gte: fromDate
                }
              },
              {
                approvalDate: {
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
                approvalDate: {
                  $gte: fromDate
                }
              },
              {
                approvalDate: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { totalAmount: { $eq: parseFloat(value) } },

              {
                approvalDate: {
                  $gte: fromDate
                }
              },
              {
                approvalDate: {
                  $lte: toDate
                }
              }
            ]
          }
        ]
      }
      // sort: [{ approvalDate: 'desc' }, { updatedAt: 'desc' }]
    });

    await query.exec().then((documents) => {
      data = documents.map((item) => item);
    });
    return data;
  };

  handleApprovalsByEmployeeSearch = async (
    value,
    fromDate,
    toDate,
    employeeId
  ) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    if (employeeId != null) {
      let query = db.approvals.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { approvalNumber: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                { approvalDate: { $gte: fromDate } },
                { approvalDate: { $lte: toDate } }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { totalAmount: { $eq: parseFloat(value) } },
                { employeeId: { $eq: employeeId } },
                { approvalDate: { $gte: fromDate } },
                { approvalDate: { $lte: toDate } }
              ]
            }
          ]
        }
      });

      await query.exec().then(async (documents) => {
        // data = documents.map((item) => item);

        documents.map((item) => {
          let row = item.toJSON();
          let purchasedPrice = 0;

          for (let item of row.itemList) {
            purchasedPrice =
              parseFloat(purchasedPrice) +
              parseFloat(item.qty * item.purchased_price);
          }
          row.profit_loss =
            parseFloat(row.totalAmount) - parseFloat(purchasedPrice);

          data.push(row);
        });
      });
      return data;
    }
  };

  setEditTable = (index, value, lastIndexFocusIndex) => {
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

  generateApprovalNumber = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('a');
    this.approvalDetails.approvalNumber = `${id}${appId}${timestamp}`;
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
      this.approvalDetails = {};
      this.existingApprovalData = {};
      this.isRestore = false;
      this.approvalTxnSettingsData = {};
    });
  }
  saveDataAndNew = async (isPrint) => {
    this.saveAndNew = true;
    await this.saveData(isPrint);
  };

  toggleRoundOff = () => {
    if (!this.approvalDetails) {
      return;
    }
    this.approvalDetails.is_roundoff = !this.approvalDetails.is_roundoff;
  };

  viewOrEditApprovalTxnItem = async (item) => {
    // console.log('viewOrEditApprovalTxnItem::', item);
    await this.viewOrEditItem(item);
  };

  get getRoundedAmount() {
    if (!this.approvalDetails.is_roundoff) {
      return 0;
    }
    return this.approvalDetails.round_amount;
  }

  deleteApproval = async (item) => {
    this.existingApprovalData = item;
    this.items = item.itemList;

    const approvalDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      approvalNumber: item.approvalNumber,
      sequenceNumber: item.sequenceNumber,
      approvalDate: item.approvalDate,
      totalAmount: item.totalAmount,
      subTotal: item.subTotal,
      updatedAt: item.updatedAt,
      posId: item.posId,
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      employeePhoneNumber: item.employeePhoneNumber,
      notes: item.notes,
      numberOfItems: item.numberOfItems,
      numberOfSelectedItems: item.numberOfSelectedItems,
      numberOfPendingItems: item.numberOfPendingItems,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      isSyncedToServer: item.isSyncedToServer
    };
    this.approvalDetails = approvalDetails;

    await this.deleteData(this.approvalDetails, item.approvalCreatedEmployeeId);
  };

  saveData = async (isPrint) => {
    if (!this.approvalDetails.approvalNumber) {
      this.generateApprovalNumber();
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

      if (item.isSelected === null || item.isSelected === '') {
        item.isSelected = false;
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

      if (
        item.itemNumber === null ||
        item.itemNumber === '' ||
        item.itemNumber === undefined
      ) {
        item.itemNumber = 0;
      }

      if (item.hsn !== null || item.hsn !== '' || item.hsn !== undefined) {
        item.hsn = item.hsn.toString();
      } else {
        item.hsn = '';
      }

      filteredArray.push(item);
    }

    this.items = filteredArray;

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

    this.approvalDetails.numberOfItems = numberOfItems;
    this.approvalDetails.numberOfSelectedItems = numberOfSelectedItems;
    this.approvalDetails.numberOfPendingItems = numberOfPendingItems;

    if (
      this.approvalDetails.subTotal === null ||
      this.approvalDetails.subTotal === ''
    ) {
      this.approvalDetails.subTotal = 0;
    }

    if (
      this.approvalDetails.totalAmount === null ||
      this.approvalDetails.totalAmount === ''
    ) {
      this.approvalDetails.totalAmount = 0;
    }

    if (
      this.approvalDetails.numberOfItems === null ||
      this.approvalDetails.numberOfItems === ''
    ) {
      this.approvalDetails.numberOfItems = 0;
    }

    if (
      this.approvalDetails.numberOfSelectedItems === null ||
      this.approvalDetails.numberOfSelectedItems === ''
    ) {
      this.approvalDetails.numberOfSelectedItems = 0;
    }

    if (
      this.approvalDetails.numberOfPendingItems === null ||
      this.approvalDetails.numberOfPendingItems === ''
    ) {
      this.approvalDetails.numberOfPendingItems = 0;
    }

    if (
      this.approvalDetails.is_roundoff === null ||
      this.approvalDetails.is_roundoff === ''
    ) {
      this.approvalDetails.is_roundoff = false;
    }

    if (
      this.approvalDetails.round_amount === null ||
      this.approvalDetails.round_amount === ''
    ) {
      this.approvalDetails.round_amount = 0;
    }

    if (this.items.length > 0) {
      if (this.isUpdate) {
        await this.updateApprovalInformation(isPrint);
      } else {
        await this.addApprovalInformation(isPrint);
      }
    }
  };

  addApprovalInformation = async (isPrint) => {
    const businessData = await Bd.getBusinessData();
    this.approvalDetails.businessId = businessData.businessId;
    this.approvalDetails.businessCity = businessData.businessCity;

    if (
      this.approvalDetails.sequenceNumber === '' ||
      this.approvalDetails.sequenceNumber === undefined
    ) {
      await this.getSequenceNumber(
        this.approvalDetails.approvalDate,
        this.approvalDetails.approvalNumber
      );
    }

    if (this.approvalDetails.sequenceNumber === '0') {
      this.approvalDetails.sequenceNumber = '';
      this.handleCloseApprovalLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    /**
     * save into approvals table
     */
    const InsertDoc = {
      ...this.approvalDetails
    };

    InsertDoc.itemList = this.items;

    /**
     * updated date
     */
    InsertDoc.updatedAt = Date.now();
    InsertDoc.posId = parseFloat(businessData.posDeviceId);

    if (this.isRestore) {
      InsertDoc.approvalCreatedEmployeeId =
        this.approvalDetails.approvalCreatedEmployeeId;
    } else {
      try {
        InsertDoc.approvalCreatedEmployeeId = JSON.parse(
          localStorage.getItem('loginDetails')
        ).username;
      } catch (e) {
        console.error(' Error: ', e.message);
      }
    }

    const db = await Db.get();

    console.log('InsertDoc::', InsertDoc);

    if (this.isRestore) {
      await this.markApprovalRestored();
    }

    let userAction = 'Save';

    if (this.isRestore) {
      userAction = 'Restore';
    }

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.approvalNumber,
      InsertDoc.sequenceNumber,
      'Approval',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.approvalDate
    );

    await db.approvals
      .insert(InsertDoc)
      .then((data) => {
        console.log('data Inserted:', data);
        if (isPrint) {
          if (
            this.approvalsInvoiceThermal &&
            this.approvalsInvoiceThermal.boolDefault
          ) {
            // To intergate Thermal Print
          }
        }

        if (
          this.approvalsInvoiceRegular &&
          this.approvalsInvoiceRegular.boolDefault &&
          isPrint
        ) {
          runInAction(async () => {
            this.printData = InsertDoc;
          });
          this.closeDialogForSaveAndPrint();
          this.handleOpenApprovalPrintSelectionAlertMessage();
        } else {
          runInAction(async () => {
            this.isApprovalsList = true;
          });

          this.handleCloseApprovalLoadingMessage();
          this.resetAllData();
          this.closeDialog();
          // this.isSaveOrUpdateOrDeleteClicked = false;
          if (this.saveAndNew) {
            this.saveAndNew = false;
            this.openForNewApproval();
          }
        }
      })
      .catch((err) => {
        //save to audit
        audit.addAuditEvent(
          InsertDoc.approvalNumber,
          InsertDoc.sequenceNumber,
          'Approval',
          userAction,
          JSON.stringify(InsertDoc),
          err.message ? err.message : 'Approval Failed',
          InsertDoc.approvalDate
        );

        this.handleCloseApprovalLoadingMessage();
        this.handleOpenApprovalErrorAlertMessage();
      });
  };

  getSequenceNumber = async (date, id) => {
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};

    let approvalData = {};

    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      approvalData.multiDeviceBillingSupport =
        transSettings.multiDeviceBillingSupport;
      approvalData.prefix =
        transSettings.approval.prefixSequence &&
        transSettings.approval.prefixSequence.length > 0
          ? transSettings.approval.prefixSequence[0].prefix
          : '';
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      approvalData.prefix = localStorage.getItem('deviceName');
      approvalData.subPrefix = 'APR';
      isOnline = false;
    }

    this.approvalDetails.sequenceNumber = await sequence.getFinalSequenceNumber(
      approvalData,
      'Approvals',
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
  };

  updateApprovalInformation = async (isPrint) => {
    if (
      this.existingApprovalData.approvalNumber &&
      this.existingApprovalData.approvalNumber === 0
    ) {
      // console.log('approvalNumber not present');
      // Cannot delete if item Number is not available
      return;
    }

    /**
     * updated date
     */
    this.approvalDetails.updatedAt = Date.now();

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.approvals.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { approvalNumber: { $eq: this.existingApprovalData.approvalNumber } }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Approvals data is found so cannot update any information
          return;
        }

        /**
         * delete index field
         */
        this.items.forEach(async (item) => {
          delete item['index'];
        });

        let updateData = this.approvalDetails;
        updateData.updatedAt = Date.now();

        let auditData = {};

        auditData = { ...updateData };
        auditData.itemList = this.items;

        audit.addAuditEvent(
          updateData.approvalNumber,
          updateData.sequenceNumber,
          'Approval',
          'Update',
          JSON.stringify(auditData),
          '',
          updateData.approvalDate
        );
        try {
          await query
            .update({
              $set: {
                itemList: this.items,
                ...updateData
              }
            })
            .then(async () => {
              if (isPrint) {
                if (
                  this.approvalsInvoiceThermal &&
                  this.approvalsInvoiceThermal.boolDefault
                ) {
                  sendContentForThermalPrinter(
                    '',
                    this.approvalsInvoiceThermal,
                    updateData,
                    this.approvalTxnSettingsData,
                    'Approval'
                  );
                }
              }

              if (this.isRestore) {
                await this.markApprovalRestored();
              }

              if (
                this.approvalsInvoiceRegular &&
                this.approvalsInvoiceRegular.boolDefault &&
                isPrint
              ) {
                runInAction(async () => {
                  this.printData = auditData;
                });
                this.closeDialogForSaveAndPrint();
                this.handleOpenApprovalPrintSelectionAlertMessage();
              } else {
                this.handleCloseApprovalLoadingMessage();
                /**
                 * make global variables to nulls again
                 */
                this.resetAllData();

                this.closeDialog();
                if (this.saveAndNew) {
                  this.saveAndNew = false;
                  this.openForNewApproval();
                }

                runInAction(async () => {
                  this.isApprovalsList = true;
                });
              }
            });
        } catch (err) {
          audit.addAuditEvent(
            updateData.approvalNumber,
            updateData.sequenceNumber,
            'Approval',
            'Update',
            JSON.stringify(auditData),
            err.message,
            updateData.approvalDate
          );
          this.handleCloseApprovalLoadingMessage();
          this.handleOpenApprovalErrorAlertMessage();
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);

        this.handleCloseApprovalLoadingMessage();
        this.handleOpenApprovalErrorAlertMessage();
      });
  };

  /**
   * delete approval entry
   */
  deleteData = async (approvalDetails, approvalCreatedEmployeeId) => {
    //save to audit
    audit.addAuditEvent(
      approvalDetails.approvalNumber,
      approvalDetails.sequenceNumber,
      'Approval',
      'Delete',
      JSON.stringify(approvalDetails),
      '',
      approvalDetails.approvalDate
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

    let restoreData = {};
    restoreData = approvalDetails;
    restoreData.itemList = this.items;
    restoreData.approvalCreatedEmployeeId = approvalCreatedEmployeeId;

    DeleteDataDoc.transactionId = approvalDetails.approvalNumber;
    DeleteDataDoc.sequenceNumber = approvalDetails.sequenceNumber;
    DeleteDataDoc.transactionType = 'Approval';
    DeleteDataDoc.data = JSON.stringify(approvalDetails);
    DeleteDataDoc.total = approvalDetails.totalAmount;
    DeleteDataDoc.balance = 0;
    DeleteDataDoc.createdDate = approvalDetails.approvalDate;

    deleteTxn.addDeleteEvent(DeleteDataDoc);
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.approvals.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { approvalNumber: { $eq: approvalDetails.approvalNumber } }
        ]
      }
    });
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Approvals data is found so cannot delete any information
          return;
        }

        /**
         * delete from approval table
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
              approvalDetails.approvalNumber,
              approvalDetails.sequenceNumber,
              'Approval',
              'Delete',
              JSON.stringify(approvalDetails),
              error.message,
              approvalDetails.approvalDate
            );
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  addNewItem = (status, focusIndexStatus, isBarcode) => {
    if (status) {
      this.addNewRowEnabled = true;
    }
    var lastItem = [];

    if (this.items.length > 0) {
      lastItem = this.items[this.items.length - 1];
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
          wastagePercentage: '',
          wastageGrams: '',
          grossWeight: '',
          netWeight: '',
          purity: '',
          hsn: '',
          isSelected: false,
          makingChargePercent: 0,
          makingChargeAmount: 0,
          makingChargeType: '',
          makingChargePerGramAmount: 0,
          makingChargeIncluded: false,
          pricePerGram: 0,
          stoneWeight: 0,
          stoneCharge: 0,
          itemNumber: 0,
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
        wastagePercentage: '',
        wastageGrams: '',
        grossWeight: '',
        netWeight: '',
        purity: '',
        hsn: '',
        isSelected: false,
        makingChargePercent: 0,
        makingChargeAmount: 0,
        makingChargeType: '',
        makingChargePerGramAmount: 0,
        makingChargeIncluded: false,
        pricePerGram: 0,
        stoneWeight: 0,
        stoneCharge: 0,
        itemNumber: 0,
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
  };

  setTaxIncluded = (index) => {
    if (this.items[index].taxIncluded === true) {
      this.items[index].taxIncluded = false;
    } else {
      this.items[index].taxIncluded = true;
    }

    this.getAmount(index);
  };

  setNotes = (value) => {
    runInAction(() => {
      this.approvalDetails.notes = value;
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
      this.items[index].cgst = value ? parseFloat(value) : '';
      this.items[index].sgst = value ? parseFloat(value) : '';
    });

    this.getAmount(index);
  };

  setSGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    runInAction(() => {
      this.items[index].cgst = value ? parseFloat(value) : '';
      this.items[index].sgst = value ? parseFloat(value) : '';
    });

    this.getAmount(index);
  };

  setIGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    runInAction(() => {
      this.items[index].igst = value ? parseFloat(value) : '';
    });
    this.getAmount(index);
  };

  setCess = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    runInAction(() => {
      this.items[index].cess = value ? value : '';
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

  setIsSelectedCheckerBox = (index) => {
    runInAction(() => {
      if (this.items[index].isSelected === true) {
        this.items[index].isSelected = false;
      } else {
        this.items[index].isSelected = true;
      }
    });
  };

  setItemHSN = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    runInAction(() => {
      this.items[index].hsn = value;
    });
  };

  setItemBatchId = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    runInAction(() => {
      this.items[index].batch_id = value;
    });
  };

  setMrp = (index, value) => {
    runInAction(() => {
      if (!this.items) {
        return;
      }
      if (!this.items[index]) {
        return;
      }

      // if (!this.items[index].product_id) {

      if (parseFloat(value) >= 0) {
        this.items[index].mrp_before_tax = parseFloat(value);
        this.items[index].mrp = parseFloat(value);

        if (this.items[index].qty === 0) {
          this.items[index].qty = 1;
        }

        if (this.items[index].qty) {
          this.getAmount(index);
        }
      } else {
        this.items[index].mrp_before_tax = value ? parseFloat(value) : '';
        this.items[index].mrp = value ? parseFloat(value) : '';
      }
      // }
    });
  };

  setItemBarcode = async (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    runInAction(() => {
      this.items[index].barcode = value;
    });

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
              { barcode: { $eq: value } }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          if (!data) {
            // No proudct match found
            return;
          }
          await this.selectProduct(data, index, true);
          // this.addNewItem();
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
      this.items[index].offer_price = value;
    });
    this.getAmount(index);
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
      runInAction(() => {
        this.items[index].qty = value ? parseFloat(value) : '';
      });
      this.getAmount(index);
    } else {
      this.items[index].qty = '';
      this.getAmount(index);
    }
  };

  setDiscount = (value) => {
    if (!this.approvalDetails) {
      return;
    }
    this.approvalDetails.discount_percent = value ? parseFloat(value) : '';
    this.approvalDetails.discount_type = 'percentage';
  };

  setDiscountAmount = (value) => {
    if (!this.approvalDetails) {
      return;
    }

    this.approvalDetails.discount_amount = value ? parseFloat(value) : '';
    this.approvalDetails.discount_type = 'amount';
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

    let discountPerItem = value ? parseFloat(value) : 0;

    this.items[index].discount_amount_per_item = parseFloat(discountPerItem);

    this.items[index].discount_amount = parseFloat(discountPerItem)
      ? parseFloat(discountPerItem * this.items[index].qty)
      : '';
    this.items[index].discount_type = 'amount';
    this.getAmount(index);
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
      itemPrice = itemPrice + parseFloat(this.items[index].certificationCharge || 0);
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
      const totalGST = (itemPriceAfterDiscount * tax) / 100;
      this.items[index].cgst_amount = totalGST / 2;
      this.items[index].sgst_amount = totalGST / 2;
      this.items[index].igst_amount = (itemPriceAfterDiscount * igst_tax) / 100;
    } else {
      let totalGST = 0;
      let amount = 0;

      if (discountAmount > 0) {
        totalGST = itemPriceAfterDiscount * (tax / 100);
        this.items[index].cgst_amount = totalGST / 2;
        this.items[index].sgst_amount = totalGST / 2;

        amount = itemPriceAfterDiscount * (igst_tax / 100);
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

    this.items[index].discount_amount = discountAmount;

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

    if (quantity > 0) {
      cgst_amount = parseFloat(this.items[index].cgst_amount || 0);
      sgst_amount = parseFloat(this.items[index].sgst_amount || 0);
      igst_amount = parseFloat(this.items[index].igst_amount || 0);
      cess = parseFloat(this.items[index].cess || 0);
    } else {
      /* this.items[index].cgst_amount = 0;
      this.items[index].sgst_amount = 0;
      this.items[index].igst_amount = 0;
      this.items[index].cess = 0; */
    }

    // console.log(this.items[index]);

    const finalAmount = parseFloat(
      this.items[index].mrp_before_tax * quantity -
        this.items[index].discount_amount +
        cgst_amount +
        sgst_amount +
        igst_amount +
        cess * quantity
    );

    this.items[index].amount = Math.round(finalAmount * 100) / 100 || 0;
  };

  setInvoiceNumber = (value) => {
    this.approvalDetails.approvalNumber = value;
  };

  setInvoiceDate = (value) => {
    this.approvalDetails.approvalDate = value;
  };

  calculateDiscountAmount(tempAmount) {
    let discountAmount = 0;

    const discountType = this.approvalDetails.discount_type;
    if (discountType === 'percentage') {
      let percentage = parseFloat(this.approvalDetails.discount_percent || 0);

      discountAmount = parseFloat((tempAmount * percentage) / 100 || 0).toFixed(
        2
      );
      this.approvalDetails.discount_amount = discountAmount;
    } else if (discountType === 'amount') {
      discountAmount = parseFloat(this.approvalDetails.discount_amount || 0);
      this.approvalDetails.discount_percent =
        Math.round(((discountAmount / tempAmount) * 100 || 0) * 100) / 100;
    }

    return discountAmount;
  }

  viewOrEditItem = async (item) => {
    runInAction(() => {
      this.OpenAddApprovalInvoice = true;
      this.isUpdate = true;
      this.existingApprovalData = item;
      this.approvalsInvoiceRegular = {};
      this.approvalsInvoiceThermal = {};
    });

    const approvalDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      approvalNumber: item.approvalNumber,
      sequenceNumber: item.sequenceNumber,
      approvalDate: item.approvalDate,
      totalAmount: item.totalAmount,
      subTotal: item.subTotal,
      updatedAt: item.updatedAt,
      posId: item.posId,
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      employeePhoneNumber: item.employeePhoneNumber,
      notes: item.notes,
      numberOfItems: item.numberOfItems,
      numberOfSelectedItems: item.numberOfSelectedItems,
      numberOfPendingItems: item.numberOfPendingItems,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      isSyncedToServer: item.isSyncedToServer
    };

    /**
     * in case of online order no edit is allowed.
     */
    if (item.posId === 0) {
      this.items = [];
      for (let i of item.itemList) {
        i.isEdit = false;
        this.items.push(i);
      }
    } else {
      this.items = item.itemList;
    }

    this.approvalDetails = approvalDetails;
  };

  closeDialog = () => {
    runInAction(() => {
      this.OpenAddApprovalInvoice = false;
      this.enabledRow = 0;
    });
  };

  openForNewApproval = () => {
    const currentDate = getTodayDateInYYYYMMDD();

    this.isUpdate = false;
    this.OpenAddApprovalInvoice = true;
    this.generateApprovalNumber();
    this.printData = null;
    this.openApprovalPrintSelectionAlert = false;
    this.approvalDetails = {
      businessId: '',
      businessCity: '',
      approvalNumber: '',
      sequenceNumber: '',
      approvalDate: currentDate,
      totalAmount: 0,
      is_roundoff: false,
      subTotal: 0,
      updatedAt: '',
      posId: '',
      employeeId: '',
      employeeName: ''
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
        wastagePercentage: '',
        wastageGrams: '',
        grossWeight: '',
        netWeight: '',
        purity: '',
        hsn: '',
        isSelected: false,
        makingChargePercent: 0,
        makingChargeAmount: 0,
        makingChargeType: '',
        makingChargePerGramAmount: 0,
        makingChargeIncluded: false,
        pricePerGram: 0,
        stoneWeight: 0,
        stoneCharge: 0,
        itemNumber: 0,
        hallmarkCharge: 0,
        certificationCharge: 0
      }
    ];

    this.approvalsInvoiceRegular = {};
    this.approvalsInvoiceThermal = {};
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
      wastagePercentage: '',
      wastageGrams: '',
      grossWeight: '',
      netWeight: '',
      purity: '',
      hsn: '',
      isSelected: false,
      makingChargePercent: 0,
      makingChargeAmount: 0,
      makingChargeType: '',
      makingChargePerGramAmount: 0,
      makingChargeIncluded: false,
      pricePerGram: 0,
      stoneWeight: 0,
      stoneCharge: 0,
      itemNumber: 0,
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
      this.selectedProduct.batchData = item.batchData;
      this.selectedProduct.vendorName = item.vendorName;
      this.selectedProduct.vendorPhoneNumber = item.vendorPhoneNumber;
      this.selectedProduct.categoryLevel2 = item.categoryLevel2;
      this.selectedProduct.categoryLevel3 = item.categoryLevel3;
      this.selectedProduct.brandName = item.brandName;
      this.selectedProduct.hsn = item.hsn;
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
      batchData,
      vendorName,
      vendorPhoneNumber,
      categoryLevel2,
      categoryLevel3,
      brandName,
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
      additional_property_group_list,
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

    let existingApprovalProduct;

    // adding same product to approvals
    if (existingApprovalProduct) {
      this.items[existingApprovalProduct.index] = existingApprovalProduct;
      this.setQuantity(
        existingApprovalProduct.index,
        existingApprovalProduct.qty
      );
      this.resetSingleProduct(index);
      setTimeout(() => {
        this.FocusLastIndex = isBarcode
          ? Number('6' + index)
          : Number('4' + index);
      }, 100);
    } else {
      this.items[index].mrp = parseFloat(0);
      this.items[index].purchased_price = parseFloat(0);

      if (offerPrice > 0) {
        this.items[index].offer_price = parseFloat(0);
      } else {
        this.items[index].offer_price = parseFloat(0);
      }
      if (batchData.length > 0) {
        //todo we dont deal with batched products
      } else {
        runInAction(() => {
          if (this.approvalTxnEnableFieldsMap.get('enable_product_price')) {
            this.items[index].mrp = parseFloat(salePrice);
            if (offerPrice > 0) {
              this.items[index].offer_price = parseFloat(offerPrice);
            } else {
              this.items[index].offer_price = parseFloat(salePrice);
            }
          } else if (
            this.approvalTxnEnableFieldsMap.get('enable_product_price_per_gram')
          ) {
            this.items[index].pricePerGram = parseFloat(salePrice);
          }

          this.items[index].purchased_price = parseFloat(purchasedPrice);

          this.items[index].vendorName = vendorName;
          this.items[index].vendorPhoneNumber = vendorPhoneNumber;
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
          wastagePercentage: '',
          wastageGrams: '',
          grossWeight: '',
          netWeight: '',
          purity: '',
          hsn: '',
          isSelected: false,
          makingChargePercent: 0,
          makingChargeAmount: 0,
          makingChargeType: '',
          makingChargePerGramAmount: 0,
          makingChargeIncluded: false,
          pricePerGram: 0,
          stoneWeight: 0,
          stoneCharge: 0,
          itemNumber: 0,
          hallmarkCharge: 0,
          certificationCharge: 0
        });
      }

      runInAction(() => {
        this.items[index].item_name = name;
        this.items[index].barcode = barcode;
        this.items[index].sku = sku;
        this.items[index].product_id = productId;
        this.items[index].description = description;
        this.items[index].imageUrl = imageUrl;
        this.items[index].cgst = cgst;
        this.items[index].sgst = sgst;
        this.items[index].igst = igst;
        this.items[index].cess = cess;
        this.items[index].taxIncluded = taxIncluded;
        this.items[index].taxType = taxType;
        this.items[index].hsn = hsn;
        this.items[index].isSelected = false;

        // categories
        this.items[index].categoryLevel2 = categoryLevel2.name;
        this.items[index].categoryLevel2DisplayName =
          categoryLevel2.displayName;
        this.items[index].categoryLevel3 = categoryLevel3.name;
        this.items[index].categoryLevel3DisplayName =
          categoryLevel3.displayName;

        this.items[index].brandName = brandName;

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

        // console.log(this.items[index]);

        if (cgst > 0) {
          this.items[index].cgst = cgst;
        }
        if (sgst > 0) {
          this.items[index].sgst = sgst;
        }
      });

      this.setQuantity(index, 1);
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

  setInvoiceRegularSetting = (invoiceRegular) => {
    this.approvalsInvoiceRegular = invoiceRegular;
  };

  setInvoiceThermalSetting = (invoicThermal) => {
    this.approvalsInvoiceThermal = invoicThermal;
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

  getApprovalDetailData = async () => {
    if (
      this.approvalDetails.sequenceNumber === '' ||
      this.approvalDetails.sequenceNumber === undefined
    ) {
      await this.getSequenceNumber(
        this.approvalDetails.approvalDate,
        this.approvalDetails.approvalNumber
      );
    }

    let productsList = [];

    for (let item of this.items) {
      let item_json = toJS(item);
      if (parseFloat(item_json.qty) > 0) {
        if (item.cgst === '') {
          item.cgst = 0;
        }

        if (item.sgst === '') {
          item.sgst = 0;
        }

        if (item.igst === '') {
          item.igst = 0;
        }

        if (item.makingChargePercent === '' || item.makingChargeAmount === '') {
          item.makingChargePercent = 0;
          item.makingChargeAmount = 0;
        }

        productsList.push(item);
      }
    }

    this.items = productsList;

    const data = {
      itemList: this.items,
      ...this.approvalDetails
    };
    return data;
  };

  setApprovalTxnEnableFieldsMap = (approvalTransSettingData) => {
    this.approvalTxnEnableFieldsMap = new Map();
    this.approvalTxnSettingsData = approvalTransSettingData;
    if (approvalTransSettingData.businessId.length > 2) {
      const productLevel = approvalTransSettingData.enableOnTxn.productLevel;
      productLevel.map((item) => {
        if (this.approvalTxnEnableFieldsMap.has(item.name)) {
          this.approvalTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.approvalTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      const billLevel = approvalTransSettingData.enableOnTxn.billLevel;
      billLevel.map((item) => {
        if (this.approvalTxnEnableFieldsMap.has(item.name)) {
          this.approvalTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.approvalTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });
    }
  };

  setTaxSettingsData = (value) => {
    this.taxSettingsData = value;
  };

  viewAndRestoreApprovalItem = async (item) => {
    runInAction(() => {
      this.OpenAddApprovalInvoice = true;
      this.isUpdate = false;
      this.isRestore = true;
      this.existingApprovalData = item;
      this.approvalsInvoiceRegular = {};
      this.approvalsInvoiceThermal = {};
    });

    const approvalDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      approvalNumber: item.approvalNumber,
      sequenceNumber: item.sequenceNumber,
      approvalDate: item.approvalDate,
      totalAmount: item.totalAmount,
      subTotal: item.subTotal,
      updatedAt: item.updatedAt,
      posId: item.posId,
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      employeePhoneNumber: item.employeePhoneNumber,
      notes: item.notes,
      numberOfItems: item.numberOfItems,
      numberOfSelectedItems: item.numberOfSelectedItems,
      numberOfPendingItems: item.numberOfPendingItems,
      approvalCreatedEmployeeId: item.approvalCreatedEmployeeId,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      isSyncedToServer: item.isSyncedToServer
    };

    /**
     * in case of online order no edit is allowed.
     */
    if (item.posId === 0) {
      this.items = [];
      for (let i of item.itemList) {
        i.isEdit = false;
        this.items.push(i);
      }
    } else {
      this.items = item.itemList;
    }

    this.approvalDetails = approvalDetails;
  };

  restoreApprovalItem = async (item, isRestoreWithNextSequenceNo) => {
    runInAction(() => {
      this.isUpdate = false;
      this.isRestore = true;
      this.existingApprovalData = item;
      this.approvalsInvoiceRegular = {};
      this.approvalsInvoiceThermal = {};
    });

    const approvalDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      approvalNumber: item.approvalNumber,
      sequenceNumber: item.sequenceNumber,
      approvalDate: item.approvalDate,
      totalAmount: item.totalAmount,
      subTotal: item.subTotal,
      updatedAt: item.updatedAt,
      posId: item.posId,
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      employeePhoneNumber: item.employeePhoneNumber,
      notes: item.notes,
      numberOfItems: item.numberOfItems,
      numberOfSelectedItems: item.numberOfSelectedItems,
      numberOfPendingItems: item.numberOfPendingItems,
      approvalCreatedEmployeeId: item.approvalCreatedEmployeeId,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      isSyncedToServer: item.isSyncedToServer
    };

    /**
     * in case of online order no edit is allowed.
     */
    if (item.posId === 0) {
      this.items = [];
      for (let i of item.itemList) {
        i.isEdit = false;
        this.items.push(i);
      }
    } else {
      this.items = item.itemList;
    }

    this.approvalDetails = approvalDetails;

    if (isRestoreWithNextSequenceNo) {
      this.approvalDetails.approvalDate = getTodayDateInYYYYMMDD();

      await this.generateApprovalNumber();
      await this.getSequenceNumber(
        this.approvalDetails.approvalDate,
        this.approvalDetails.approvalNumber
      );
    }

    await this.saveData(false);
  };

  markApprovalRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: this.approvalDetails.approvalNumber } }
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

  handleOpenApprovalLoadingMessage = async () => {
    runInAction(() => {
      this.openApprovalLoadingAlertMessage = true;
    });
  };

  handleCloseApprovalLoadingMessage = async () => {
    runInAction(() => {
      this.openApprovalLoadingAlertMessage = false;
    });
  };

  handleOpenApprovalErrorAlertMessage = async () => {
    runInAction(() => {
      this.openApprovalErrorAlertMessage = true;
    });
  };

  handleCloseApprovalErrorAlertMessage = async () => {
    runInAction(() => {
      this.openApprovalErrorAlertMessage = false;
    });
  };

  resetApprovalPrintData = async () => {
    runInAction(() => {
      this.printData = {};
      this.openApprovalPrintSelectionAlert = false;
    });
  };

  closeDialogForSaveAndPrint = () => {
    this.handleCloseApprovalLoadingMessage();
    if (this.isUpdate) {
      /**
       * make global variables to nulls again
       */
      this.resetAllData();

      this.closeDialog();
      if (this.saveAndNew) {
        this.saveAndNew = false;
        this.openForNewApproval();
      }

      runInAction(async () => {
        this.isApprovalsList = true;
      });
    } else {
      runInAction(async () => {
        this.isApprovalsList = true;
      });

      this.resetAllData();
      this.closeDialog();
      // this.isSaveOrUpdateOrDeleteClicked = false;
      if (this.saveAndNew) {
        this.saveAndNew = false;
        this.openForNewApproval();
      }
    }
  };

  handleOpenApprovalPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openApprovalPrintSelectionAlert = true;
    });
  };

  handleCloseApprovalPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openApprovalPrintSelectionAlert = false;
    });
  };

  setRoundingConfiguration = (value) => {
    this.roundingConfiguration = value;
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

  setItemPricePerGram = (index, value) => {
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
      approvalDetails: observable,
      OpenAddApprovalInvoice: observable,
      isApprovalsList: observable,
      closeDialog: action,
      items: observable,
      getTotalAmount: computed,
      approvalTxnEnableFieldsMap: observable,
      setApprovalTxnEnableFieldsMap: action,
      setTaxSettingsData: action,
      setMakingChargeAmount: action,
      setMakingCharge: action,
      getTotalNetWeight: computed,
      getTotalGrossWeight: computed,
      getTotalWatage: computed,
      setMakingChargePerGramAmount: action,
      viewAndRestoreApprovalItem: action,
      restoreApprovalItem: action,
      openApprovalLoadingAlertMessage: observable,
      openApprovalErrorAlertMessage: observable,
      printData: observable,
      resetApprovalPrintData: action,
      closeDialogForSaveAndPrint: action,
      approvalTxnSettingsData: observable,
      openApprovalPrintSelectionAlert: observable,
      setMakingChargeIncluded: action,
      setRoundingConfiguration: action,
      sequenceNumberFailureAlert: observable
    });
  }
}
export default new ApprovalsStore();
