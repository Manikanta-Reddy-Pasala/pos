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
import * as productTxn from '../../components/Helpers/ProductTxnHelper';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import BatchData from './classes/BatchData';
import * as balanceUpdate from '../../components/Helpers/CustomerAndVendorBalanceHelper';
import getStateList from 'src/components/StateList';
import * as taxSettings from '../../components/Helpers/TaxSettingsHelper';
import * as timestamp from '../../components/Helpers/TimeStampGeneratorHelper';
import * as lp from '../../components/Helpers/LinkPaymentHelper';
import Purchase from './classes/Purchase';
import PurchaseItem from './classes/PurchaseItem';
import PurchaseBatchItem from './classes/PurchaseBatchItem';
import {
  formatDate,
  getTodayDateInYYYYMMDD
} from '../../components/Helpers/DateHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';
import {
  getProductDataById,
  updateProduct
} from 'src/components/Helpers/dbQueries/businessproduct';

class PurchasesAddStore {
  newVendor = false;

  isUpdate = false;

  OpenAddPurchaseBill = false;

  saveAndNew = false;

  enabledRow = 0;

  existingBillData = {};

  newVendorData = {};
  selectedCustomerBalance = 0;
  FocusLastIndex = false;

  // isSaveOrUpdateOrDeleteClicked = false;

  OpenBatchList = false;
  selectedProduct = {};

  purchaseOrderData = {};

  purchaseTxnEnableFieldsMap = new Map();

  descriptionCollapsibleMap = new Map();

  splitPaymentSettingsData = {};

  chosenPaymentType = 'Cash';

  metalList = [];

  paymentLinkTransactions = [];

  openLinkpaymentPage = false;

  previousBalanceAmount = 0;

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
  isPurchasesList = false;
  isMultiplePurchaseAvailable = false;

  purchasesInvoiceRegular = {};
  purchasesInvoiceThermal = {};

  taxSettingsData = {};

  addNewRowEnabled = false;

  isRestore = false;
  purchaseOrderConversion = false;

  chosenMetalString = '';
  chosenMetalList = [];

  printPurchaseData = null;

  printBalance = {};

  purchaseTxnSettingsData = {};

  openPurchaseLoadingAlertMessage = false;
  openPurchaseErrorAlertMessage = false;

  openPurchasePrintSelectionAlert = false;

  roundingConfiguration = 'Nearest 50';

  previousCreditFlag = false;

  openSplitPaymentDetails = false;

  bankAccountsList = [];

  customerAddressList = [];
  customerAddressType = '';
  openAddressList = false;

  isCGSTSGSTEnabledByPOS = true;

  OpenPurchaseBillSerialList = false;
  openPurchaseBillErrorAlertMessage = false;
  errorAlertMessage = '';

  selectedPurchaseItem = {};
  OpenPurchaseBulkBatchList = false;
  placeOfSupplyState = '';
  customerCreditDays = 0;

  getAddRowEnabled = () => {
    return this.addNewRowEnabled;
  };

  setAddRowEnabled = (value) => {
    this.addNewRowEnabled = value;
  };

  getPurchasesdetails = async (vendor_id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.purchases
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

  getPurchasesDetailsWithSameBillNo = async (vendor_id, vendor_bill_number) => {
    this.isMultiplePurchaseAvailable = false;
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();
    db.purchases
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { vendor_id: { $eq: vendor_id } },
            { vendor_bill_number: { $eq: vendor_bill_number } }
          ]
        }
      })
      .exec()
      .then((data) => {
        this.isMultiplePurchaseAvailable =
          data && data.length > 0 ? true : false;
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

  addPurchasesData = (data) => {
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

  get getPurchasesData() {
    return this.purchasesData ? this.purchasesData : [];
  }

  setPackingCharge = (value) => {
    runInAction(() => {
      this.billDetails.packing_charge = value ? parseFloat(value) : '';
    });
  };
  setRCMEnable = (value) => {
    runInAction(() => {
      this.billDetails.posRCMValue = value;
    });
  };
  setITCEnable = (value) => {
    runInAction(() => {
      this.billDetails.posITCAvailable = value;
    });
  };

  setShippingCharge = (value) => {
    runInAction(() => {
      this.billDetails.shipping_charge = value ? parseFloat(value) : '';
    });
  };

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

    if (this.billDetails.reverseChargeEnable) {
      this.setReverseChargeValue(totalGST);
    } else {
      this.setReverseChargeValue(0);
    }

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

    let totalAmount =
      overallTotalAmount -
      discountAmount +
      (this.billDetails.shipping_charge || 0) +
      (this.billDetails.packing_charge || 0);

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

    if (this.billDetails.tcsRate > 0) {
      tcsAmount = (totalAmount * this.billDetails.tcsRate) / 100;
      this.billDetails.tcsAmount = tcsAmount;
    }

    if (this.billDetails.tdsRate > 0) {
      tdsAmount = (totalTaxableAmount * this.billDetails.tdsRate) / 100;
      this.billDetails.tdsAmount = tdsAmount;
    }

    totalAmount = totalAmount + tcsAmount;

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

    return parseFloat(this.billDetails.total_amount).toFixed(2);
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

  getPurchasescount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.purchases
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isPurchasesList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchasesList = async (fromDate, toDate) => {
    const db = await Db.get();
    var query;
    const businessData = await Bd.getBusinessData();

    if (!fromDate || !toDate) {
      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: { $exists: true }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ bill_date: 'desc' }, { updatedAt: 'desc' }]
      });
    } else {
      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: fromDate
              }
            },
            {
              bill_date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ bill_date: 'desc' }, { updatedAt: 'desc' }]
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

  getPurchasesListByVendor = async (fromDate, toDate, phoneNo) => {
    const db = await Db.get();
    var query;
    const businessData = await Bd.getBusinessData();

    if (phoneNo) {
      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: { $exists: true }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              vendor_phone_number: { $eq: phoneNo }
            }
          ]
        }
        // sort: [{ bill_date: 'desc' }, { updatedAt: 'desc' }]
      });
    } else {
      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: fromDate
              }
            },
            {
              bill_date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ bill_date: 'desc' }, { updatedAt: 'desc' }]
      });
    }

    runInAction(() => {
      this.purchasesData = [];
    });
    await query.$.subscribe(async (data) => {
      if (!data) {
        return;
      }
      runInAction(() => {
        this.purchasesData = data.map((item) => item.toJSON());
      });
    });
  };

  handlePurchasesSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.purchases
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
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { vendor_bill_number: { $regex: regexp } },
                    {
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { vendor_name: { $regex: regexp } },
                    {
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { total_amount: { $eq: parseFloat(value) } },
                    {
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { balance_amount: { $eq: parseFloat(value) } },
                    {
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
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

  handlePurchasesSearchWithDateAndTCS = async (value, fromDate, toDate) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.purchases
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              tcsAmount: {
                $gt: 0
              }
            },
            {
              $or: [
                {
                  $and: [
                    { payment_type: { $regex: regexp } },
                    {
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { vendor_bill_number: { $regex: regexp } },
                    {
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { vendor_name: { $regex: regexp } },
                    {
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { total_amount: { $eq: parseFloat(value) } },
                    {
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
                        $lte: toDate
                      }
                    }
                  ]
                },
                {
                  $and: [
                    { balance_amount: { $eq: parseFloat(value) } },
                    {
                      bill_date: {
                        $gte: fromDate
                      }
                    },
                    {
                      bill_date: {
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

  handlePurchasesSearchByVendorAndDate = async (
    value,
    fromDate,
    toDate,
    mobileNo
  ) => {
    if (mobileNo) {
      console.log('inside handle search...', value);
      const db = await Db.get();
      let data = [];

      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      const businessData = await Bd.getBusinessData();

      await db.purchases
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                $or: [
                  {
                    $and: [
                      { payment_type: { $regex: regexp } },
                      { vendor_phone_number: { $eq: mobileNo } },
                      {
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
                          $lte: toDate
                        }
                      }
                    ]
                  },
                  {
                    $and: [
                      { vendor_bill_number: { $regex: regexp } },
                      { vendor_phone_number: { $eq: mobileNo } },
                      {
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
                          $lte: toDate
                        }
                      }
                    ]
                  },
                  {
                    $and: [
                      { vendor_name: { $regex: regexp } },
                      { vendor_phone_number: { $eq: mobileNo } },
                      {
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
                          $lte: toDate
                        }
                      }
                    ]
                  },
                  {
                    $and: [
                      { total_amount: { $eq: parseFloat(value) } },
                      { vendor_phone_number: { $eq: mobileNo } },
                      {
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
                          $lte: toDate
                        }
                      }
                    ]
                  },
                  {
                    $and: [
                      { balance_amount: { $eq: parseFloat(value) } },
                      { vendor_phone_number: { $eq: mobileNo } },
                      {
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
                          $lte: toDate
                        }
                      }
                    ]
                  },
                  {
                    $and: [
                      { payment_type: { $regex: regexp } },
                      { vendor_phone_number: { $eq: mobileNo } },
                      {
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
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
    }
  };

  handlePurchasesSearchByEmployeeAndDate = async (
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

      await db.purchases
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
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
                          $lte: toDate
                        }
                      }
                    ]
                  },
                  {
                    $and: [
                      { purchase_return_number: { $regex: regexp } },
                      { employeeId: { $eq: employeeId } },
                      {
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
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
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
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
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
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
                        bill_date: {
                          $gte: fromDate
                        }
                      },
                      {
                        bill_date: {
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
      return this.handlePurchasesSearchWithDate(value, fromDate, toDate);
    }
  };

  handlePurchasesSearch = async (value) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.purchases
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                { vendor_bill_number: { $regex: regexp } },
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

  setCreditData = (value) => {
    runInAction(() => {
      this.billDetails.is_credit = value;
    });

    if (!this.billDetails.is_credit) {
      runInAction(() => {
        this.billDetails.balance_amount = 0;
      });
      this.resetLinkPayment();
      this.billDetails.dueDate = null;
    }
  };

  viewOrEditPurchaseTxnItem = async (item) => {
    this.viewOrEditItem(item);
  };

  deletePurchaseTxnItem = async (item) => {
    if (
      !('calculateStockAndBalance' in item) ||
      !item.calculateStockAndBalance
    ) {
      item.calculateStockAndBalance = true;
    }
    await this.deletePurchaseEntry(item);
  };

  setLinkPayment = async () => {
    runInAction(() => {
      this.openLinkpaymentPage = true;
    });
  };

  saveDataAndNew = async (isPrint) => {
    this.saveAndNew = true;
    runInAction(() => {
      this.billDetails.vendor_bill_number =
        this.billDetails.vendor_bill_number.toLowerCase();
    });
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
    runInAction(() => {
      this.billDetails.vendor_bill_number =
        this.billDetails.vendor_bill_number.toLowerCase();
    });

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

      if (
        product.discount_amount === null ||
        product.discount_amount === '' ||
        product.discount_amount === undefined
      ) {
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
        product.discount_amount_per_item === '' ||
        product.discount_amount_per_item === undefined
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

      if (
        product.stockQty === null ||
        product.stockQty === '' ||
        product.freeStockQty === undefined
      ) {
        product.stockQty = 0;
      }

      if (
        product.freeStockQty === null ||
        product.freeStockQty === '' ||
        product.freeStockQty === undefined
      ) {
        product.freeStockQty = 0;
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
        product.unitConversionQty === '' ||
        product.unitConversionQty === undefined
      ) {
        product.unitConversionQty = 0;
      }

      if (
        product.originalPurchasePriceWithoutConversionQty === null ||
        product.originalPurchasePriceWithoutConversionQty === '' ||
        product.originalPurchasePriceWithoutConversionQty === undefined
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
        product.finalMRPPrice === null ||
        product.finalMRPPrice === '' ||
        product.finalMRPPrice === undefined
      ) {
        product.finalMRPPrice = 0;
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
        product.originalDiscountPercent === undefined ||
        isNaN(product.originalDiscountPercent)
      ) {
        product.originalDiscountPercent = 0;
      }

      if (product.serialNo && product.serialNo > 0) {
        product.serialNo = product.serialNo.map((num) => num.toString());
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
      this.billDetails.packing_charge === null ||
      this.billDetails.packing_charge === ''
    ) {
      this.billDetails.packing_charge = 0;
    }

    if (
      this.billDetails.shipping_charge === null ||
      this.billDetails.shipping_charge === ''
    ) {
      this.billDetails.shipping_charge = 0;
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
      this.billDetails.isPartiallyReturned === null ||
      this.billDetails.isPartiallyReturned === ''
    ) {
      this.billDetails.isPartiallyReturned = false;
    }

    if (
      this.billDetails.isFullyReturned === null ||
      this.billDetails.isFullyReturned === ''
    ) {
      this.billDetails.isFullyReturned = false;
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

    if (
      this.billDetails.reverseChargeEnable === null ||
      this.billDetails.reverseChargeEnable === ''
    ) {
      this.billDetails.reverseChargeEnable = false;
    }

    if (
      this.billDetails.reverseChargeValue === null ||
      this.billDetails.reverseChargeValue === ''
    ) {
      this.billDetails.reverseChargeValue = 0;
    }

    if (
      this.billDetails.tcsAmount === null ||
      this.billDetails.tcsAmount === ''
    ) {
      this.billDetails.tcsAmount = 0;
    }

    if (this.billDetails.tcsRate === null || this.billDetails.tcsRate === '') {
      this.billDetails.tcsRate = 0;
    }

    if (
      this.billDetails.tdsAmount === null ||
      this.billDetails.tdsAmount === ''
    ) {
      this.billDetails.tdsAmount = 0;
    }

    if (this.billDetails.tdsRate === null || this.billDetails.tdsRate === '') {
      this.billDetails.tdsRate = 0;
    }

    if (
      this.billDetails.splitPaymentList &&
      this.billDetails.splitPaymentList.length > 0
    ) {
      for (let i = 0; i < this.billDetails.splitPaymentList.length; i++) {
        this.billDetails.splitPaymentList[i].amount =
          parseFloat(this.billDetails.splitPaymentList[i].amount) || 0;
      }
    }

    if (this.chosenPaymentType === 'Split') {
      this.billDetails.payment_type = this.chosenPaymentType;
    }

    if (
      !('calculateStockAndBalance' in this.billDetails) ||
      !this.billDetails.calculateStockAndBalance
    ) {
      this.billDetails.calculateStockAndBalance = true;
    }

    if (this.isUpdate) {
      await this.updatePurchase(isPrint);
    } else {
      await this.savePurchase(isPrint);
    }
  };

  resetAllData() {
    runInAction(() => {
      this.selectedCustomerBalance = 0;
      this.billDetails = {};
      this.existingBillData = {};
      this.paymentUnLinkTransactions = [];
      this.paymentLinkTransactions = [];
      this.isRestore = false;
      this.purchaseOrderConversion = false;
    });
  }

  deletePurchaseEntry = async (item) => {
    console.log('inside delete::', item);

    const tempBillDetails = {
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      vendor_phone_number: item.vendor_phone_number,
      is_credit: item.is_credit,
      bill_number: item.bill_number,
      vendor_bill_number: item.vendor_bill_number,
      bill_date: item.bill_date,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // paid_amount: item.paid_amount,
      balance_amount: item.balance_amount,
      isPartiallyReturned: item.isPartiallyReturned,
      isFullyReturned: item.isFullyReturned,
      linkedTxnList: item.linkedTxnList,
      linkPayment: item.linkPayment,
      linked_amount: item.linked_amount,
      discount_percent: item.discount_percent,
      discount_amount: item.discount_amount,
      discount_type: item.discount_type,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      place_of_supply: item.place_of_supply,
      placeOfSupplyName: item.placeOfSupplyName,
      reverseChargeEnable: item.reverseChargeEnable,
      reverseChargeValue: item.reverseChargeValue,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
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
      vendorPanNumber: item.vendorPanNumber,
      splitPaymentList: item.splitPaymentList,
      isSyncedToServer: item.isSyncedToServer,
      invoiceStatus: item.invoiceStatus,
      tallySyncedStatus: item.tallySyncedStatus,
      calculateStockAndBalance: item.calculateStockAndBalance,
      tallySynced: item.tallySynced,
      aadharNumber: item.aadharNumber,
      lrNumber: item.lrNumber,
      vendorMsmeRegNo: item.vendorMsmeRegNo,
      discountPercentForAllItems: item.discountPercentForAllItems,
      portalITCAvailable: item.portalITCAvailable,
      posITCAvailable: item.posITCAvailable,
      portalRCMValue: item.portalRCMValue,
      posRCMValue: item.posRCMValue,
      itcReversed: item.itcReversed,
      fromPortal: item.fromPortal,
      imageUrls: item.imageUrls
    };

    runInAction(() => {
      this.billDetails = tempBillDetails;

      this.items = item.item_list;
    });

    // console.log('this.items::', this.items);
    // console.log('this.billDetails::', this.billDetails);

    if (!this.billDetails.bill_number) {
      console.log('bill_number not present');
      // Cannot update if item Number is not available
      return;
    }

    /**
     * if purchase is partially returned or fully returned then purchase update is in valid
     */
    if (
      this.billDetails.isFullyReturned ||
      this.billDetails.isPartiallyReturned
    ) {
      console.log('isFullyReturned or isPartiallyReturned');
      alert('Partial/Full returned Purchase is not eligible to Delete');

      // this.isSaveOrUpdateOrDeleteClicked = false;
      return;
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

    let restorePurchaseData = {};
    restorePurchaseData = this.billDetails;
    restorePurchaseData.item_list = this.items;
    restorePurchaseData.employeeId = item.employeeId;

    DeleteDataDoc.transactionId = this.billDetails.bill_number;
    DeleteDataDoc.sequenceNumber = this.billDetails.vendor_bill_number;
    DeleteDataDoc.transactionType = 'Purchases';
    DeleteDataDoc.data = JSON.stringify(restorePurchaseData);
    DeleteDataDoc.total = this.billDetails.total_amount;
    DeleteDataDoc.balance = this.billDetails.balance_amount;
    DeleteDataDoc.createdDate = this.billDetails.bill_date;

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    //save to audit
    audit.addAuditEvent(
      this.billDetails.bill_number,
      this.billDetails.vendor_bill_number,
      'Purchases',
      'Delete',
      JSON.stringify(this.billDetails),
      '',
      this.billDetails.bill_date
    );

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.purchases.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { bill_number: { $eq: this.billDetails.bill_number } }
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

        if (
          !('calculateStockAndBalance' in this.billDetails) ||
          !this.billDetails.calculateStockAndBalance
        ) {
          /**
           * reset back old purchase product stock
           */
          this.items.forEach(async (i) => {
            await this.updateProductStock(
              db,
              i.product_id,
              i.qtyUnit && i.qtyUnit !== ''
                ? this.getQuantityByUnit(i) || 0
                : i.qty || 0,
              i.qtyUnit && i.qtyUnit !== ''
                ? this.getFreeQuantityByUnit(i) || 0
                : i.freeQty || 0,
              -1,
              i.batch_id, // to handle batch count
              i.purchased_price,
              false
            );
          });

          /**
           * get money to vendor account to satil old balance
           */

          await balanceUpdate.decrementBalance(
            db,
            this.billDetails.vendor_id,
            parseFloat(this.billDetails.balance_amount) +
              parseFloat(this.billDetails.linked_amount)
          );
        }

        if (this.billDetails.linked_amount > 0) {
          await this.unLinkPayment(db, this.billDetails);
        }

        /**
         * delete from product txn table
         */
        await productTxn.deleteProductTxnFromPurchases(item, db);
        await allTxn.deleteTxnFromPurchases(item, db);

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
            console.log('purchases data removal Failed ' + error);
            alert('Error in Removing Data');
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);

        //save to audit
        audit.addAuditEvent(
          this.billDetails.bill_number,
          this.billDetails.vendor_bill_number,
          'Purchases',
          'Delete',
          JSON.stringify(this.billDetails),
          err.message,
          this.billDetails.bill_date
        );
      });
  };

  savePurchase = async (isPrint) => {
    // this.isSaveOrUpdateOrDeleteClicked = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    runInAction(() => {
      this.billDetails.businessId = businessData.businessId;
      this.billDetails.businessCity = businessData.businessCity;

      this.billDetails.posId = parseFloat(businessData.posDeviceId);

      this.billDetails.balance_amount = this.getBalanceData;
    });

    /**
     * increment stock quantity after the purchase
     */
    // console.log('stock increment start');

    if (
      !('calculateStockAndBalance' in this.billDetails) ||
      !this.billDetails.calculateStockAndBalance
    ) {
      this.incrementStockQuantity(db);
    }

    /**
     * link payment if has any recivable amount
     */
    if (this.billDetails.linked_amount > 0) {
      await this.linkPayment(db);
    } else {
      this.billDetails.linkedTxnList = [];
    }
    // console.log('updating vendor money start');

    /**
     * update vendor balance based
     * linked amount + balance amount
     */
    const money_to_be_credited =
      parseFloat(this.billDetails.linked_amount) +
      parseFloat(this.billDetails.balance_amount);

    if (
      !('calculateStockAndBalance' in this.billDetails) ||
      !this.billDetails.calculateStockAndBalance
    ) {
      if (parseFloat(money_to_be_credited) > 0) {
        await balanceUpdate.incrementBalance(
          db,
          this.billDetails.vendor_id,
          money_to_be_credited
        );
      }
    }
    // console.log('updating vendor money end');

    if (
      this.billDetails.bill_number === '' ||
      this.billDetails.bill_number === undefined
    ) {
      await this.generateBillNumber();
    }

    let InsertDoc = this.billDetails;
    InsertDoc.item_list = this.items;

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

    /**
     * save products to txn table
     */
    await productTxn.saveProductTxnFromPurchases(InsertDoc, db);

    const receiptOrPayment = await allTxn.saveTxnFromPurchases(InsertDoc, db);

    //await this.updateProductSerialPurchaseFlag();

    InsertDoc.receiptOrPayment = receiptOrPayment;

    //check purchase order data
    //change status of purchase order to closed
    if (
      this.purchaseOrderData.item_list &&
      this.purchaseOrderData.item_list.length > 0
    ) {
      await this.closePurchaseOrder();
    }

    let userAction = 'Save';

    if (this.isRestore) {
      await this.markPurchaseRestored();
      userAction = 'Restore';
    }

    //save to audit
    audit.addAuditEvent(
      InsertDoc.bill_number,
      InsertDoc.vendor_bill_number,
      'Purchases',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.bill_date
    );
    await db.purchases
      .insert(InsertDoc)
      .then(async (data) => {
        console.log('data Inserted', data);

        if (
          isPrint &&
          this.purchasesInvoiceThermal &&
          this.purchasesInvoiceThermal.boolDefault
        ) {
          sendContentForThermalPrinter(
            InsertDoc.vendor_id,
            this.purchasesInvoiceThermal,
            InsertDoc,
            this.purchaseTxnSettingsData,
            'Purchase'
          );
        }

        if (
          this.purchasesInvoiceRegular &&
          this.purchasesInvoiceRegular.boolDefault &&
          isPrint
        ) {
          if (InsertDoc.vendor_id === '') {
            var dataCustomer = {
              totalBalance: 0,
              balanceType: ''
            };

            this.printBalance = dataCustomer;
            this.printPurchaseData = InsertDoc;
          } else {
            this.printBalance = await balanceUpdate.getCustomerBalanceById(
              InsertDoc.vendor_id
            );
            this.printPurchaseData = InsertDoc;
          }
          this.closeDialogForSaveAndPrint();
          this.handleOpenPrintSelectionAlertMessage();
        } else {
          this.closeDialog();
          this.handleClosePurchaseLoadingMessage();

          this.resetAllData();
          if (this.saveAndNew) {
            this.saveAndNew = false;
            this.openForNewPurchase();
          }

          runInAction(async () => {
            this.isPurchasesList = true;
          });
        }
      })
      .catch((err) => {
        console.error('Error in Adding purchases', err);

        //save to audit
        audit.addAuditEvent(
          InsertDoc.bill_number,
          InsertDoc.vendor_bill_number,
          'Purchases',
          userAction,
          JSON.stringify(InsertDoc),
          err.message,
          InsertDoc.bill_date
        );

        this.handleClosePurchaseLoadingMessage();
        this.handleOpenPurchaseErrorAlertMessage();
      });
  };

  updateProductSerialPurchaseFlag = async () => {
    this.items.forEach(async (element) => {
      if (element.serialNo && element.serialNo > 0) {
        let serialNosAdded = element.serialNo;
        let selector = {
          $and: [{ productId: { $eq: element.product_id } }]
        };
        let product = await getProductDataById(selector);
        for (let serial of product.serialData) {
          if (serialNosAdded.includes(serial.serialImeiNo)) {
            serial.purchased = true;
          }
        }
        await updateProduct(product);
      }
    });
  };

  closePurchaseOrder = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.purchaseorder.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            purchase_order_invoice_number: {
              $eq: this.purchaseOrderData.purchase_order_invoice_number
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

        await query
          .update({
            $set: {
              updatedAt: Date.now(),
              status: 'close'
            }
          })
          .then(async () => {
            this.purchaseOrderData = {};
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
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

  incrementStockQuantity = async (db) => {
    this.items.forEach(async (element) => {
      this.updateProductStock(
        db,
        element.product_id,
        element.qtyUnit && element.qtyUnit !== ''
          ? this.getQuantityByUnit(element) || 0
          : element.qty || 0,
        element.qtyUnit && element.qtyUnit !== ''
          ? this.getFreeQuantityByUnit(element) || 0
          : element.freeQty || 0,
        1,
        element.batch_id, // to handle batch count
        element.purchased_price,
        this.purchaseTxnSettingsData.updatePurchasePriceFromTransaction
      );
    });
  };

  updatePurchase = async (isPrint) => {
    const businessData = await Bd.getBusinessData();
    runInAction(() => {
      this.billDetails.businessId = businessData.businessId;
      this.billDetails.businessCity = businessData.businessCity;

      this.billDetails.posId = parseFloat(businessData.posDeviceId);
    });

    if (
      this.existingBillData.bill_number &&
      this.existingBillData.bill_number === 0
    ) {
      console.log('bill_number not present');
      // Cannot update if item Number is not available
      return;
    }

    /**
     * if purchase is partially returned or fully returned then purchase update is in valid
     */
    if (
      this.billDetails.isFullyReturned ||
      this.billDetails.isPartiallyReturned
    ) {
      console.log('isFullyReturned or isPartiallyReturned');
      alert('Partial/Full returned Purchase is not eligible to Edit');
      return;
    }

    const db = await Db.get();

    const query = db.purchases.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { bill_number: { $eq: this.existingBillData.bill_number } }
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

        // console.log('existingBillData::', this.existingBillData);
        // console.log('billDetails:', this.billDetails);

        if (
          !('calculateStockAndBalance' in this.billDetails) ||
          !this.billDetails.calculateStockAndBalance
        ) {
          /**
           * reset back old purchase product stock
           */
          this.existingBillData.item_list.forEach(async (i) => {
            await this.updateProductStock(
              db,
              i.product_id,
              i.qtyUnit && i.qtyUnit !== ''
                ? this.getQuantityByUnit(i) || 0
                : i.qty || 0,
              i.qtyUnit && i.qtyUnit !== ''
                ? this.getFreeQuantityByUnit(i) || 0
                : i.freeQty || 0,
              -1,
              i.batch_id, // to handle batch count
              i.purchased_price,
              false
            );
          });

          /**
           * update new purchase product stock
           */
          this.items.forEach(async (i) => {
            this.updateProductStock(
              db,
              i.product_id,
              parseFloat(
                i.qtyUnit && i.qtyUnit !== ''
                  ? this.getQuantityByUnit(i) || 0
                  : i.qty || 0
              ),
              parseFloat(
                i.qtyUnit && i.qtyUnit !== ''
                  ? this.getFreeQuantityByUnit(i) || 0
                  : i.freeQty || 0
              ),
              1,
              i.batch_id, // to handle batch count
              i.purchased_price,
              this.purchaseTxnSettingsData.updatePurchasePriceFromTransaction
            );
          });
        }
        let putMoneyToVendor = false;
        let putMoneyToVendorAmount = 0;
        let getMoneyFromVendor = false;
        let getMoneyFromVendorAmount = 0;
        let unLinkPayment = false;
        let linkPayment = false;

        //1)status is "Paid"
        if (
          !this.billDetails.is_credit ||
          parseFloat(this.billDetails.balance_amount) === 0
        ) {
          if (this.existingBillData.linked_amount > 0) {
            getMoneyFromVendor = true;
            unLinkPayment = true;
          }

          if (this.existingBillData.balance_amount > 0) {
            getMoneyFromVendor = true;
          }

          if (getMoneyFromVendor) {
            getMoneyFromVendorAmount =
              this.existingBillData.balance_amount +
              this.existingBillData.linked_amount;
          }

          if (this.billDetails.linked_amount > 0) {
            putMoneyToVendor = true;
            linkPayment = true;
          }

          if (this.billDetails.balance_amount > 0) {
            putMoneyToVendor = true;
          }

          if (putMoneyToVendor) {
            putMoneyToVendorAmount =
              this.billDetails.balance_amount + this.billDetails.linked_amount;
          }
        } else if (
          // status is Credit

          this.billDetails.is_credit ||
          parseFloat(this.billDetails.balance_amount) > 0
        ) {
          /**
           *
           * if previous txn type is credit then current can be credit/sale
           * both the cases rever the balances and link payment will do
           */

          if (this.existingBillData.linked_amount > 0) {
            getMoneyFromVendor = true;
            unLinkPayment = true;
          }

          if (this.existingBillData.balance_amount > 0) {
            getMoneyFromVendor = true;
          }

          if (getMoneyFromVendor) {
            getMoneyFromVendorAmount =
              this.existingBillData.balance_amount +
              this.existingBillData.linked_amount;
          }

          if (this.billDetails.linked_amount > 0) {
            putMoneyToVendor = true;
            linkPayment = true;
          }

          if (this.billDetails.balance_amount > 0) {
            putMoneyToVendor = true;
          }

          if (putMoneyToVendor) {
            putMoneyToVendorAmount =
              this.billDetails.balance_amount + this.billDetails.linked_amount;
          }
        }

        /**
         * clear balance by subtrcting get money and put money
         * since there is an issue with server sync
         */
        if (getMoneyFromVendor && putMoneyToVendor) {
          const finalBalance =
            parseFloat(putMoneyToVendorAmount) -
            parseFloat(getMoneyFromVendorAmount);

          if (finalBalance < 0) {
            putMoneyToVendor = false;
            getMoneyFromVendorAmount = Math.abs(finalBalance);
          } else if (finalBalance > 0) {
            getMoneyFromVendor = false;
            putMoneyToVendorAmount = Math.abs(finalBalance);
          } else {
            getMoneyFromVendor = false;
            putMoneyToVendor = false;
          }
        }

        if (
          !('calculateStockAndBalance' in this.billDetails) ||
          !this.billDetails.calculateStockAndBalance
        ) {
          if (getMoneyFromVendor && getMoneyFromVendorAmount > 0) {
            await balanceUpdate.decrementBalance(
              db,
              this.existingBillData.vendor_id,
              getMoneyFromVendorAmount
            );
          }
        }

        if (unLinkPayment) {
          await this.unLinkPayment(db, this.existingBillData);
        }

        if (this.billDetails.linked_amount > 0 && linkPayment) {
          await this.linkPayment(db);
        } else {
          this.billDetails.linkedTxnList = [];
        }

        if (
          !('calculateStockAndBalance' in this.billDetails) ||
          !this.billDetails.calculateStockAndBalance
        ) {
          if (putMoneyToVendor && putMoneyToVendorAmount > 0) {
            await balanceUpdate.incrementBalance(
              db,
              this.billDetails.vendor_id,
              putMoneyToVendorAmount
            );
          }
        }

        /**
         * delete and save to product txn table
         */
        let txnData = this.billDetails;
        txnData.item_list = this.items;

        await productTxn.deleteAndSaveProductTxnFromPurchases(
          this.existingBillData,
          txnData,
          db
        );

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

        let auditData = {};

        auditData = { ...this.billDetails };
        auditData.item_list = this.items;

        const receiptOrPayment = await allTxn.deleteAndSaveTxnFromPurchases(
          this.existingBillData,
          txnData,
          db
        );

        this.billDetails.receiptOrPayment = receiptOrPayment;

        //save to audit
        audit.addAuditEvent(
          this.billDetails.bill_number,
          this.billDetails.vendor_bill_number,
          'Purchases',
          'Update',
          JSON.stringify(auditData),
          '',
          this.billDetails.bill_date
        );

        await query
          .update({
            $set: {
              item_list: this.items,
              ...this.billDetails
            }
          })
          .then(async () => {
            console.log('inside updte purchase');

            if (
              isPrint &&
              this.purchasesInvoiceThermal &&
              this.purchasesInvoiceThermal.boolDefault
            ) {
              sendContentForThermalPrinter(
                auditData.vendor_id,
                this.purchasesInvoiceThermal,
                auditData,
                this.purchaseTxnSettingsData,
                'Purchase'
              );
            }

            if (this.isRestore) {
              await this.markPurchaseRestored();
            }

            if (
              this.purchasesInvoiceRegular &&
              this.purchasesInvoiceRegular.boolDefault &&
              isPrint
            ) {
              if (auditData.vendor_id === '') {
                var dataCustomer = {
                  totalBalance: 0,
                  balanceType: ''
                };

                this.printBalance = dataCustomer;
                this.printPurchaseData = auditData;
              } else {
                this.printBalance = await balanceUpdate.getCustomerBalanceById(
                  auditData.vendor_id
                );
                this.printPurchaseData = auditData;
              }
              this.closeDialogForSaveAndPrint();
              this.handleOpenPrintSelectionAlertMessage();
            } else {
              this.isUpdate = false;
              this.handleClosePurchaseLoadingMessage();
              this.closeDialog();
              if (this.saveAndNew) {
                this.saveAndNew = false;
                this.openForNewPurchase();
              }

              runInAction(async () => {
                this.isPurchasesList = true;
              });

              this.resetAllData();
            }
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);

        //save to audit
        audit.addAuditEvent(
          this.billDetails.bill_number,
          this.billDetails.vendor_bill_number,
          'Purchases',
          'Update',
          JSON.stringify(this.billDetails),
          err.message,
          this.billDetails.bill_date
        );

        this.handleClosePurchaseLoadingMessage();
        this.handleOpenPurchaseErrorAlertMessage();
      });
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

  updateProductStock = async (
    db,
    product_id,
    qty,
    freeQty,
    operation,
    batch_id,
    purchasePrice,
    shouldUpdatePurchasePrice
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

          if (parseFloat(operation) < 0) {
            updatedQty = parseFloat(
              parseFloat(oldData.stockQty) - parseFloat(qty)
            );

            if (batchData) {
              batchData.qty = parseFloat(batchData.qty) - parseFloat(qty);
            } else {
              oldData.qty = parseFloat(
                parseFloat(oldData.qty) - parseFloat(qty)
              );
            }
          } else {
            updatedQty = parseFloat(oldData.stockQty) + parseFloat(qty);

            if (batchData) {
              batchData.qty = parseFloat(batchData.qty) + parseFloat(qty);
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
            updatedFreeQty = parseFloat(
              parseFloat(oldData.freeQty) - parseFloat(freeQty)
            );

            if (batchData) {
              batchData.freeQty =
                parseFloat(batchData.freeQty) - parseFloat(freeQty);
            } else {
              oldData.freeQty = parseFloat(
                parseFloat(oldData.freeQty) - parseFloat(freeQty)
              );
            }
          } else {
            updatedFreeQty = parseFloat(oldData.freeQty) + parseFloat(freeQty);

            if (batchData) {
              batchData.freeQty =
                parseFloat(batchData.freeQty) + parseFloat(freeQty);
            } else {
              oldData.freeQty = parseFloat(
                parseFloat(oldData.freeQty) + parseFloat(freeQty)
              );
            }
          }

          oldData.freeQty = Math.round(updatedFreeQty * 100) / 100;
          if (index >= 0 && batchData) {
            oldData.batchData[index] = batchData;
          }

          if (isNaN(oldData.freeQty) || oldData.freeQty === null) {
            oldData.freeQty = 0;
          }

          if (batchData) {
            if (shouldUpdatePurchasePrice && purchasePrice > 0) {
              batchData.purchasedPrice = purchasePrice;
            }
          } else {
            if (shouldUpdatePurchasePrice && purchasePrice > 0) {
              oldData.purchasedPrice = purchasePrice;
            }
          }

          oldData.updatedAt = Date.now();

          return oldData;
        };

        await categoryData.atomicUpdate(changeData);

        // console.log('updated::', product_id);
      }
    }
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
        this.items.push(new PurchaseItem().defaultValues());
        this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;

        this.setEditTable(
          this.enabledRow,
          true,
          focusIndexStatus ? Number('8' + this.enabledRow) : ''
        );
      }
    } else {
      this.items.push(new PurchaseItem().defaultValues());
      this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;

      this.setEditTable(this.enabledRow, true, Number('8' + this.enabledRow));
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

  setPurchasesPlaceOfSupply = (value) => {
    runInAction(() => {
      this.billDetails.place_of_supply = value;
    });
  };

  setPlaceOfSupplyName = (value) => {
    runInAction(() => {
      this.billDetails.placeOfSupplyName = value;
    });
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
                    'Product with Serial No: ' +
                    value +
                    ' is already purchased';
                  this.openSaleErrorAlertMessage = true;
                  this.items[index].serialOrImeiNo = '';
                });
              }
            }
          }

          if (isProductSold === false) {
            let salePercent = '';
            // adding same product to purchases
            let isProductExists = false;
            let productsAleryPresent = [];
            // adding same product to sales
            if (this.items && this.items.length > 0) {
              let serialNoToFind = value;
              for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (index === i) {
                  continue;
                }
                if (item.serialOrImeiNo === serialNoToFind) {
                  isProductExists = true;
                  productsAleryPresent.push(serialNoToFind);
                } else if (item.serialNo && item.serialNo.length > 0) {
                  let filteredSerialData = item.serialNo.filter((ele) => {
                    return ele === serialNoToFind;
                  });
                  if (filteredSerialData) {
                    productsAleryPresent.push(serialNoToFind);
                    isProductExists = true;
                  }
                }
              }
            }

            if (isProductExists === true) {
              runInAction(() => {
                this.errorAlertMessage =
                  'Product with Serial No: ' + value + ' is already added';
                this.openPurchaseBillErrorAlertMessage = true;
                this.items[index].serialOrImeiNo = '';
              });
            } else {
              this.selectedProduct = actualProduct;
              this.selectedIndex = index;
              runInAction(() => {
                if (
                  this.purchaseTxnEnableFieldsMap.get('enable_product_price')
                ) {
                  this.items[index].purchased_price = parseFloat(
                    actualProduct.purchasedPrice
                  );
                } else if (
                  this.purchaseTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  )
                ) {
                  this.items[index].pricePerGram = parseFloat(
                    actualProduct.purchasedPrice
                  );
                }

                this.items[index].originalPurchasePriceWithoutConversionQty =
                  parseFloat(actualProduct.purchasedPrice);
                this.items[index].finalMRPPrice = parseFloat(
                  actualProduct.finalMRPPrice
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
              this.addNewItem(true, true, false);
            }
          }
        });
    }
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
              this.items[index].barcode = actualProduct.barcode;
              this.items[index].sku = actualProduct.sku;
              this.items[index].product_id = actualProduct.productId;
              this.items[index].description = actualProduct.description;
              this.items[index].imageUrl = actualProduct.imageUrl;
              this.items[index].cgst = actualProduct.purchaseCgst;
              this.items[index].sgst = actualProduct.purchaseSgst;
              this.items[index].igst = actualProduct.purchaseIgst;
              this.items[index].cess = actualProduct.purchaseCess;
              this.items[index].taxIncluded = actualProduct.purchaseTaxIncluded;
              this.items[index].hsn = actualProduct.hsn;
              this.items[index].taxType = actualProduct.purchaseTaxType;
              this.items[index].serialOrImeiNo = actualProduct.serialOrImeiNo;

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
              this.items[index].freeStockQty = actualProduct.freeQty;

              // units addition
              this.items[index].primaryUnit = actualProduct.primaryUnit;
              this.items[index].secondaryUnit = actualProduct.secondaryUnit;
              this.items[index].units =
                actualProduct.units && actualProduct.units.length > 2
                  ? actualProduct.units.slice(0, 2)
                  : actualProduct.units;
              this.items[index].unitConversionQty =
                actualProduct.unitConversionQty;

              console.log(this.items[index]);

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

  setBillNumber = (value) => {
    runInAction(() => {
      this.billDetails.vendor_bill_number = value;
    });
  };

  setNotes = (value) => {
    runInAction(() => {
      this.billDetails.notes = value;
    });
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
      this.billDetails.bill_date = value;
    });
  };

  setDueDate = (value) => {
    runInAction(() => {
      this.billDetails.dueDate = value;
    });
  };

  setTCS = (value) => {
    runInAction(() => {
      this.billDetails.tcsName = value.name;
      this.billDetails.tcsRate = value.rate;
      this.billDetails.tcsCode = value.code;
    });
  };

  revertTCS = () => {
    runInAction(() => {
      this.billDetails.tcsName = '';
      this.billDetails.tcsRate = 0;
      this.billDetails.tcsAmount = 0;
      this.billDetails.tcsCode = '';
    });
  };

  setTDS = (value) => {
    runInAction(() => {
      this.billDetails.tdsName = value.name;
      this.billDetails.tdsRate = value.rate;
      this.billDetails.tdsCode = value.code;
    });
  };

  revertTDS = () => {
    runInAction(() => {
      this.billDetails.tdsName = '';
      this.billDetails.tdsRate = 0;
      this.billDetails.tdsAmount = 0;
      this.billDetails.tdsCode = '';
    });
  };

  get getBalanceData() {
    let balance = 0;
    if (this.billDetails.is_credit) {
      const total_amount = isNaN(parseFloat(this.getTotalAmount))
        ? 0
        : parseFloat(this.getTotalAmount);

      // let paid_amount = isNaN(this.billDetails.paid_amount)
      //   ? 0
      //   : this.billDetails.paid_amount;
      // paid_amount =
      //   this.billDetails.paid_amount === '' ? 0 : this.billDetails.paid_amount;

      const linked_amount = isNaN(this.billDetails.linked_amount)
        ? 0
        : this.billDetails.linked_amount;

      balance =
        parseFloat(total_amount) -
        // parseFloat(paid_amount || 0) -
        parseFloat(linked_amount);
    }
    runInAction(() => {
      this.billDetails.balance_amount = parseFloat(balance);
    });

    return balance;
  }

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
      this.billDetails.vendorPanNumber = vendor.panNumber;
      this.billDetails.aadharNumber = vendor.aadharNumber;
      this.billDetails.vendorMsmeRegNo = vendor.msmeRegNo;
      this.customerCreditDays = vendor.creditLimitDays;

      if (this.purchaseTxnSettingsData.enableTCS) {
        this.billDetails.tcsName = vendor.tcsName;
        this.billDetails.tcsRate = vendor.tcsRate;
        this.billDetails.tcsCode = vendor.tcsCode;
      }

      if (this.purchaseTxnSettingsData.enableTDS) {
        this.billDetails.tdsName = vendor.tdsName;
        this.billDetails.tdsRate = vendor.tdsRate;
        this.billDetails.tdsCode = vendor.tdsCode;
      }

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

    await lp.getAllUnPaidTxnForCustomer(this, db, vendor.id, 'Purchases');

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
          this.setPurchasesPlaceOfSupply(result.val);
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
      this.billDetails.vendorPanNumber = '';
      this.billDetails.tcsName = '';
      this.billDetails.tcsRate = 0;
      this.billDetails.tcsCode = '';
      this.billDetails.tdsName = '';
      this.billDetails.tdsRate = 0;
      this.billDetails.tdsCode = '';
      this.billDetails.invoiceStatus = '';
      this.billDetails.tallySyncedStatus = '';
      this.billDetails.calculateStockAndBalance = true;
      this.billDetails.tallySynced = false;
      this.billDetails.aadharNumber = '';
      this.billDetails.vendorMsmeRegNo = '';
    });
  };

  convertPurchaseOrderToPurchase = async (item) => {
    this.isRestore = false;
    this.purchaseOrderData = item.toJSON();
    this.purchaseOrderConversion = true;

    runInAction(() => {
      this.OpenAddPurchaseBill = true;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.isUpdate = false;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
      this.chosenPaymentType = 'Cash';
      this.isCGSTSGSTEnabledByPOS = true;
    });

    let custAddnDetails = await this.getVendorDataOnConvertion(item.vendor_id);

    const billDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      bill_number: '',
      vendor_bill_number: '',
      bill_date: getTodayDateInYYYYMMDD(),
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      is_credit: false,
      payment_type: 'cash',
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      // paid_amount: item.paid_amount,
      balance_amount: this.getBalanceData,
      linkedTxnList: item.linkedTxnList,
      isFullyReturned: false,
      isPartiallyReturned: false,
      linked_amount: 0,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      packing_charge: item.packing_charge || 0,
      shipping_charge: item.shipping_charge || 0,
      place_of_supply: item.place_of_supply,
      placeOfSupplyName: item.placeOfSupplyName,
      reverseChargeEnable: false,
      reverseChargeValue: item.reverseChargeValue || 0,
      vendor_phone_number: item.vendor_phone_number,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      notes: item.notes,
      tcsAmount: 0,
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      dueDate: null,
      tdsAmount: 0,
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      invoiceStatus: '',
      tallySyncedStatus: '',
      calculateStockAndBalance: true,
      tallySynced: false,
      aadharNumber: custAddnDetails.aadharNumber,
      vendorMsmeRegNo: item.vendorMsmeRegNo,
      portalITCAvailable: item.portalITCAvailable,
      posITCAvailable: item.posITCAvailable,
      portalRCMValue: item.portalRCMValue,
      posRCMValue: item.posRCMValue,
      itcReversed: item.itcReversed,
      fromPortal: item.fromPortal
    };

    runInAction(() => {
      /**
       * in case of online order no edit is allowed.
       */
      this.items = [];

      if (item.posId === 0) {
        for (let i of item.item_list) {
          i.isEdit = false;

          delete i['isSelected'];

          if (i.amount > 0) {
            this.items.push(i);
          }
        }
      } else {
        for (let i of item.item_list) {
          delete i['isSelected'];

          if (i.amount > 0) {
            this.items.push(i);
          }
        }
      }
    });

    this.checkForTaxAndLoadUI();

    runInAction(() => {
      this.billDetails = billDetails;
      if (this.purchaseTxnSettingsData.enableTCS) {
        this.billDetails.tcsName = custAddnDetails.tcsName;
        this.billDetails.tcsRate = custAddnDetails.tcsRate;
        this.billDetails.tcsCode = custAddnDetails.tcsCode;
      }

      if (this.purchaseTxnSettingsData.enableTDS) {
        this.billDetails.tdsName = custAddnDetails.tdsName;
        this.billDetails.tdsRate = custAddnDetails.tdsRate;
        this.billDetails.tdsCode = custAddnDetails.tdsCode;
      }
    });

    await this.prepareSplitPaymentList();

    //generate bill number
    this.generateBillNumber();

    /**
     * get customer txn which are un used
     */
    const db = await Db.get();

    await lp.getAllUnPaidTxnForCustomer(this, db, item.vendor_id, 'Purchases');

    await Promise.all([this.setSelectedVendorBalance(item.vendor_id)]);
  };

  getVendorDataOnConvertion = async (partyId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let tradeName = '';
    let legalName = '';
    let registrationNumber = '';
    let panNumber = '';
    let tcsName = '';
    let tcsRate = 0;
    let tcsCode = '';
    let tdsName = '';
    let tdsRate = 0;
    let tdsCode = '';
    let aadharNumber = '';

    if (partyId) {
      await db.parties
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { id: { $eq: partyId } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          tradeName = data.tradeName;
          legalName = data.legalName;
          registrationNumber = data.registrationNumber;
          panNumber = data.panNumber;
          tcsName = data.tcsName;
          tcsRate = data.tcsRate;
          tcsCode = data.tcsCode;
          tdsName = data.tdsName;
          tdsRate = data.tdsRate;
          tdsCode = data.tdsCode;
          aadharNumber = data.aadharNumber;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    }

    var data = {
      tradeName: tradeName,
      legalName: legalName,
      registrationNumber: registrationNumber,
      panNumber: panNumber,
      tcsName: tcsName,
      tcsRate: tcsRate,
      tcsCode: tcsCode,
      tdsName: tdsName,
      tdsRate: tdsRate,
      tdsCode: tdsCode,
      aadharNumber: aadharNumber
    };

    return data;
  };

  viewOrEditItem = async (item) => {
    runInAction(() => {
      this.OpenAddPurchaseBill = true;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.isUpdate = true;
      this.existingBillData = item;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
    });

    const billDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      bill_number: item.bill_number,
      vendor_bill_number: item.vendor_bill_number,
      bill_date: item.bill_date,
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
      isFullyReturned: item.isFullyReturned,
      isPartiallyReturned: item.isPartiallyReturned,
      linkPayment: item.linkPayment,
      linked_amount: item.linked_amount,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      place_of_supply: item.place_of_supply,
      placeOfSupplyName: item.placeOfSupplyName,
      reverseChargeEnable: item.reverseChargeEnable,
      reverseChargeValue: item.reverseChargeValue,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
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
      vendorPanNumber: item.vendorPanNumber,
      splitPaymentList: item.splitPaymentList,
      isSyncedToServer: item.isSyncedToServer,
      invoiceStatus: item.invoiceStatus,
      tallySyncedStatus: item.tallySyncedStatus,
      calculateStockAndBalance: item.calculateStockAndBalance,
      tallySynced: item.tallySynced,
      aadharNumber: item.aadharNumber,
      lrNumber: item.lrNumber,
      vendorMsmeRegNo: item.vendorMsmeRegNo,
      discountPercentForAllItems: item.discountPercentForAllItems,
      portalITCAvailable: item.portalITCAvailable,
      posITCAvailable: item.posITCAvailable,
      portalRCMValue: item.portalRCMValue,
      posRCMValue: item.posRCMValue,
      itcReversed: item.itcReversed,
      fromPortal: item.fromPortal,
      imageUrls: item.imageUrls
    };

    this.billDetails = billDetails;

    this.checkForTaxAndLoadUI();

    if (this.billDetails.splitPaymentList === undefined) {
      this.billDetails.splitPaymentList = [];
    }

    if (this.billDetails.payment_type === 'Split') {
      this.chosenPaymentType = 'Split';
    } else {
      this.chosenPaymentType = 'Cash';
    }

    /**
     * get customer txn which are un used
     */
    if (item.vendor_id !== '' && item.vendor_id.length > 2) {
      const db = await Db.get();

      await Promise.all([this.setSelectedVendorBalance(item.vendor_id)]);

      if (this.billDetails.linked_amount > 0) {
        runInAction(() => {
          this.billDetails.linkPayment = true;
        });
        await lp.getAllLinkedTxnData(this, this.billDetails, 'Purchases');
      } else {
        this.billDetails.linkedTxnList = [];
      }

      await lp.getAllUnPaidTxnForCustomer(
        this,
        db,
        item.vendor_id,
        'Purchases'
      );
    }

    this.previousBalanceAmount = this.billDetails.linked_amount;
    this.previousCreditFlag = this.billDetails.is_credit;
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
      this.OpenAddPurchaseBill = false;
      this.enabledRow = 0;
      this.purchaseOrderConversion = false;
    });
  };

  openForNewPurchase = () => {
    runInAction(() => {
      this.isUpdate = false;
      this.OpenAddPurchaseBill = true;

      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
      this.chosenPaymentType = 'Cash';
      this.isCGSTSGSTEnabledByPOS = true;

      this.billDetails = new Purchase().defaultValues();

      this.items = [new PurchaseItem().defaultValues()];

      this.checkForTaxAndLoadUI();
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
      serialOrImeiNo,
      purchaseDiscountPercent,
      purchaseCgst,
      purchaseSgst,
      purchaseIgst,
      purchaseCess,
      purchaseTaxIncluded,
      purchaseTaxType,
      freeQty,
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
      finalMRPPrice,
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
            this.OpenBatchList = true;
          } else if (batchData.length === 1) {
            let firstBatchData = batchData[0];

            if (this.purchaseTxnEnableFieldsMap.get('enable_product_price')) {
              this.items[index].purchased_price = parseFloat(
                firstBatchData.purchasedPrice
              );
            } else if (
              this.purchaseTxnEnableFieldsMap.get(
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
        } else if (serialData.length > 0) {
          runInAction(() => {
            this.selectedProduct = productItem;
            let filteredSerialData = productItem.serialData.filter((ele) => {
              return ele.purchased === false;
            });
            if (filteredSerialData && filteredSerialData.length > 0) {
              let serialNo = [];
              for (let item of filteredSerialData) {
                serialNo.push({
                  serialNo: item.serialImeiNo,
                  selected: true
                });
              }
              this.selectedProduct.serialData = serialNo;

              this.selectedIndex = index;
              this.OpenPurchaseBillSerialList = true;
            } else {
              // to add alert
            }
          });
        } else {
          if (this.purchaseTxnEnableFieldsMap.get('enable_product_price')) {
            this.items[index].purchased_price = parseFloat(purchasedPrice);
          } else if (
            this.purchaseTxnEnableFieldsMap.get('enable_product_price_per_gram')
          ) {
            this.items[index].pricePerGram = parseFloat(purchasedPrice);
          }

          this.items[index].mfDate = mfDate;
          this.items[index].expiryDate = expiryDate;
          this.items[index].rack = rack;
          this.items[index].warehouseData = warehouseData;
          this.items[index].modelNo = modelNo;
          this.items[index].barcode = barcode;

          this.items[index].originalPurchasePriceWithoutConversionQty =
            parseFloat(purchasedPrice);
          setTimeout(() => {
            this.addNewItem(true, false);
          }, 200);
        }

        this.items[index].item_name = name;
        this.items[index].sku = sku;
        this.items[index].product_id = productId;
        this.items[index].description = description;
        this.items[index].imageUrl = imageUrl;
        this.items[index].cess = purchaseCess;
        this.items[index].taxIncluded = purchaseTaxIncluded;
        this.items[index].hsn = hsn;
        this.items[index].taxType = purchaseTaxType;
        this.items[index].serialOrImeiNo = serialOrImeiNo;
        this.items[index].makingChargePerGramAmount = makingChargePerGram;
        this.items[index].finalMRPPrice = finalMRPPrice;

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
        this.items[index].freeStockQty = freeQty;

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
      });

      purchasePercent = purchaseDiscountPercent;
      this.setQuantity(index, 1);
      let billdiscount = this.billDetails.discountPercentForAllItems
        ? parseFloat(this.billDetails.discountPercentForAllItems) || 0
        : 0;
      this.items[index].originalDiscountPercent =
        purchasePercent + billdiscount;
      this.setItemDiscount(index, this.items[index].originalDiscountPercent);
    }
  };

  modifySelectedSerialNoForPurchase = (value, index) => {
    if (
      this.selectedProduct &&
      this.selectedProduct.serialData &&
      this.selectedProduct.serialData.length > 0
    ) {
      this.selectedProduct.serialData[index]['selected'] = value;
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
    let defaultItem = new PurchaseItem().defaultValues();

    this.items[index] = defaultItem;
  };

  linkPayment = async (db) => {
    this.billDetails.linkedTxnList = [];

    const txnList = await lp.linkPayment(
      db,
      this.billDetails,
      this.paymentLinkTransactions,
      'Purchases'
    );

    if (txnList) {
      txnList.forEach((txn) => this.billDetails.linkedTxnList.push(txn));
    }

    this.paymentLinkTransactions = [];
  };

  unLinkPayment = async (db, billDetails) => {
    await lp.unLinkPayment(db, billDetails, 'Purchases');

    billDetails.linkedTxnList.forEach((item) => {
      this.unLinkedTxnList.push(item); //mani todo
    });
    /**
     * make used global variable to deafult values
     */
    this.paymentUnLinkTransactions = [];
  };

  setFocusLastIndex = (val) => {
    this.FocusLastIndex = val;
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

  get getBalanceAfterLinkedAmount() {
    let result = 0;

    result =
      this.billDetails.total_amount - this.billDetails.linked_amount ||
      // -
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
    let linkedAmount = parseFloat(this.billDetails.linked_amount) || 0;

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
              linked = amountToLink - finalLinkedAmount;
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
      freeQty,
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
        if (this.purchaseTxnEnableFieldsMap.get('enable_product_price')) {
          this.items[this.selectedIndex].purchased_price =
            parseFloat(purchasedPrice);
        } else if (
          this.purchaseTxnEnableFieldsMap.get('enable_product_price_per_gram')
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
        this.items[this.selectedIndex].freeStockQty = freeQty;
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
    this.OpenBatchList = false;
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

  setReverseChargeEnable = (val) => {
    runInAction(() => {
      this.billDetails.reverseChargeEnable = val;

      if (val === false) {
        this.billDetails.reverseChargeValue = 0;
      }
    });
  };

  setReverseChargeValue = (val) => {
    runInAction(() => {
      this.billDetails.reverseChargeValue = val;
    });
  };

  setPaymentMode = (value) => {
    this.billDetails.bankPaymentType = value;
  };

  setBankAccountData = (value, chosenType) => {
    if (value.accountDisplayName && value.id) {
      runInAction(() => {
        this.billDetails.payment_type = chosenType;
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

    const id = _uniqueId('ps');
    runInAction(() => {
      this.billDetails.bill_number = `${id}${appId}${timestamp}`;
    });
  };

  setPaymentReferenceNumber = (value) => {
    this.billDetails.paymentReferenceNumber = value;
  };

  setTaxSettingsData = (value) => {
    this.taxSettingsData = value;
  };

  setPurchaseTxnEnableFieldsMap = (purchaseTransSettingData) => {
    this.purchaseTxnSettingsData = purchaseTransSettingData;

    this.purchaseTxnEnableFieldsMap = new Map();
    if (purchaseTransSettingData.businessId.length > 2) {
      const productLevel = purchaseTransSettingData.enableOnTxn.productLevel;
      productLevel.map((item) => {
        if (this.purchaseTxnEnableFieldsMap.has(item.name)) {
          this.purchaseTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.purchaseTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      const billLevel = purchaseTransSettingData.enableOnTxn.billLevel;
      billLevel.map((item) => {
        if (this.purchaseTxnEnableFieldsMap.has(item.name)) {
          this.purchaseTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.purchaseTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      if (
        !this.isUpdate &&
        this.purchaseTxnEnableFieldsMap.get('enable_roundoff_default')
      ) {
        this.billDetails.is_roundoff = true;
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

  convertPOToPurchase = async (item) => {};

  viewAndRestorePurchaseItem = async (item) => {
    runInAction(() => {
      this.OpenAddPurchaseBill = true;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.isUpdate = false;
      this.isRestore = true;
      this.existingBillData = item;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};

      if (
        !('calculateStockAndBalance' in item) ||
        !item.calculateStockAndBalance
      ) {
        item.calculateStockAndBalance = true;
      }
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
      bill_number: item.bill_number,
      vendor_bill_number: item.vendor_bill_number,
      bill_date: item.bill_date,
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
      isFullyReturned: item.isFullyReturned,
      isPartiallyReturned: item.isPartiallyReturned,
      linkPayment: item.linkPayment,
      linked_amount: item.linked_amount,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      place_of_supply: item.place_of_supply,
      placeOfSupplyName: item.placeOfSupplyName,
      reverseChargeEnable: item.reverseChargeEnable,
      reverseChargeValue: item.reverseChargeValue,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      employeeId: item.employeeId,
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
      vendorPanNumber: item.vendorPanNumber,
      splitPaymentList: item.splitPaymentList,
      isSyncedToServer: item.isSyncedToServer,
      invoiceStatus: item.invoiceStatus,
      tallySyncedStatus: item.tallySyncedStatus,
      calculateStockAndBalance: item.calculateStockAndBalance,
      tallySynced: item.tallySynced,
      aadharNumber: item.aadharNumber,
      lrNumber: item.lrNumber,
      vendorMsmeRegNo: item.vendorMsmeRegNo,
      discountPercentForAllItems: item.discountPercentForAllItems,
      portalITCAvailable: item.portalITCAvailable,
      posITCAvailable: item.posITCAvailable,
      portalRCMValue: item.portalRCMValue,
      posRCMValue: item.posRCMValue,
      itcReversed: item.itcReversed,
      fromPortal: item.fromPortal,
      imageUrls: item.imageUrls
    };

    this.billDetails = billDetails;
    if (this.billDetails.splitPaymentList === undefined) {
      this.billDetails.splitPaymentList = [];
    }

    if (this.billDetails.payment_type === 'Split') {
      this.chosenPaymentType = 'Split';
    } else {
      this.chosenPaymentType = 'Cash';
    }

    /**
     * get vendor txn which are un used
     */
    if (item.vendor_id !== '' && item.vendor_id.length > 2) {
      const db = await Db.get();

      await lp.getAllUnPaidTxnForCustomer(this, db, item.id, 'Purchases');
    }

    this.previousBalanceAmount = this.billDetails.linked_amount;
  };

  restorePurchaseItem = async (item) => {
    runInAction(() => {
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.isRestore = true;
      this.isUpdate = false;
      this.existingBillData = item;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};

      if (
        !('calculateStockAndBalance' in item) ||
        !item.calculateStockAndBalance
      ) {
        item.calculateStockAndBalance = true;
      }
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
      bill_number: item.bill_number,
      vendor_bill_number: item.vendor_bill_number,
      bill_date: item.bill_date,
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
      isFullyReturned: item.isFullyReturned,
      isPartiallyReturned: item.isPartiallyReturned,
      linkPayment: item.linkPayment,
      linked_amount: item.linked_amount,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      packing_charge: item.packing_charge,
      shipping_charge: item.shipping_charge,
      place_of_supply: item.place_of_supply,
      placeOfSupplyName: item.placeOfSupplyName,
      reverseChargeEnable: item.reverseChargeEnable,
      reverseChargeValue: item.reverseChargeValue,
      paymentReferenceNumber: item.paymentReferenceNumber,
      notes: item.notes,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      employeeId: item.employeeId,
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
      vendorPanNumber: item.vendorPanNumber,
      splitPaymentList: item.splitPaymentList,
      isSyncedToServer: item.isSyncedToServer,
      invoiceStatus: item.invoiceStatus,
      tallySyncedStatus: item.tallySyncedStatus,
      calculateStockAndBalance: item.calculateStockAndBalance,
      tallySynced: item.tallySynced,
      aadharNumber: item.aadharNumber,
      lrNumber: item.lrNumber,
      vendorMsmeRegNo: item.vendorMsmeRegNo,
      discountPercentForAllItems: item.discountPercentForAllItems,
      portalITCAvailable: item.portalITCAvailable,
      posITCAvailable: item.posITCAvailable,
      portalRCMValue: item.portalRCMValue,
      posRCMValue: item.posRCMValue,
      itcReversed: item.itcReversed,
      fromPortal: item.fromPortal,
      imageUrls: item.imageUrls
    };

    this.billDetails = billDetails;
    if (this.billDetails.splitPaymentList === undefined) {
      this.billDetails.splitPaymentList = [];
    }

    if (this.billDetails.payment_type === 'Split') {
      this.chosenPaymentType = 'Split';
    } else {
      this.chosenPaymentType = 'Cash';
    }

    this.previousBalanceAmount = this.billDetails.linked_amount;

    this.saveData(false);
  };

  markPurchaseRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: this.billDetails.bill_number } }
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
      if (typeof this.billDetails.rateList === 'undefined') {
        this.billDetails.rateList = [];
      }

      this.billDetails.rateList.push(rateValue);
      this.prepareRateList();
    } else {
      let indexToRemove = -1;
      for (var i = 0; i < this.billDetails.rateList.length; i++) {
        if (value.metal === this.billDetails.rateList[i].metal) {
          indexToRemove = i;
          break;
        }
      }
      if (indexToRemove !== -1) {
        this.billDetails.rateList.splice(indexToRemove, 1);
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

    if (typeof this.billDetails.rateList === 'undefined') {
      this.billDetails.rateList = [];
    }

    this.billDetails.rateList.push(rateValue);
    this.prepareRateList();
  };

  prepareRateList = () => {
    this.chosenMetalString = '';
    this.chosenMetalList = [];
    if (this.billDetails.rateList && this.billDetails.rateList.length > 0) {
      for (var i = 0; i < this.billDetails.rateList.length; i++) {
        this.chosenMetalString += this.billDetails.rateList[i].metal;
        if (i !== this.billDetails.rateList.length - 1) {
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

  closeDialogForSaveAndPrint = () => {
    this.handleClosePurchaseLoadingMessage();
    if (this.isUpdate) {
      this.isUpdate = false;
      this.closeDialog();
      if (this.saveAndNew) {
        this.saveAndNew = false;
        this.openForNewPurchase();
      }

      runInAction(async () => {
        this.isPurchasesList = true;
      });

      this.resetAllData();
    } else {
      this.closeDialog();
      if (this.saveAndNew) {
        this.saveAndNew = false;
        this.openForNewPurchase();
      }
      this.resetAllData();

      runInAction(async () => {
        this.isPurchasesList = true;
      });
    }
  };

  resetPurchasePrintData = async () => {
    runInAction(() => {
      this.printPurchaseData = {};
      this.printBalance = {};
    });
  };

  handleOpenPurchaseLoadingMessage = async () => {
    runInAction(() => {
      this.openPurchaseLoadingAlertMessage = true;
    });
  };

  handleClosePurchaseLoadingMessage = async () => {
    runInAction(() => {
      this.openPurchaseLoadingAlertMessage = false;
    });
  };

  handleOpenPurchaseErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseErrorAlertMessage = true;
    });
  };

  handleClosePurchaseErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseErrorAlertMessage = false;
    });
  };

  handleOpenPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPurchasePrintSelectionAlert = true;
    });
  };

  handleClosePrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPurchasePrintSelectionAlert = false;
    });
  };

  setRoundingConfiguration = (value) => {
    this.roundingConfiguration = value;
  };

  setSplitPaymentSettingsData = (value) => {
    this.splitPaymentSettingsData = value;
    if (
      !this.isUpdate ||
      (this.billDetails.splitPaymentList &&
        this.billDetails.splitPaymentList.length === 0)
    ) {
      this.prepareSplitPaymentList();
    }
  };

  setBankAccountList = (value) => {
    this.bankAccountsList = value;
  };

  setSplitPayment = (property, index, value) => {
    this.billDetails.splitPaymentList[index][property] = value;
  };

  prepareSplitPaymentList = async () => {
    runInAction(() => {
      this.billDetails.splitPaymentList = [];
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
          this.billDetails.splitPaymentList.push(cashPayment);
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
            this.billDetails.splitPaymentList.push(giftCardPayment);
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
            this.billDetails.splitPaymentList.push(customFinancePayment);
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
            this.billDetails.splitPaymentList.push(bankPayment);
          });
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
      runInAction(() => {
        this.billDetails.splitPaymentList.push(bankPayment);
      });
    }
  };

  removeSplitPayment = (index) => {
    runInAction(() => {
      this.billDetails.splitPaymentList.splice(index, 1);
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

  handleCloseAndResetSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openSplitPaymentDetails = false;
      let splitPaymentAmt = 0;
      for (let payment of this.billDetails.splitPaymentList) {
        splitPaymentAmt += parseFloat(payment.amount);
      }
      if (splitPaymentAmt === 0) {
        this.resetSplitPaymentDetails();
      }
    });
  };

  resetSplitPaymentDetails = async () => {
    runInAction(() => {
      this.billDetails.payment_type = 'cash';
      this.chosenPaymentType = 'Cash';
    });
    this.prepareSplitPaymentList();
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

    runInAction(() => {
      this.items[index].grossWeight = value;
      if (this.items[index].pricePerGram > 0) {
        this.items[index].netWeight =
          parseFloat(this.items[index].grossWeight || 0) -
          parseFloat(this.items[index].stoneWeight || 0);
      }
    });
    this.getAmount(index);
  };

  setWastagePercentage = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].wastagePercentage = value;
    });
    this.getAmount(index);
  };

  setWastageGrams = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].wastageGrams = value;
    });
    this.getAmount(index);
  };

  setNetWeight = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].netWeight = value;

      if (this.items[index].qty === 0) {
        this.items[index].qty = 1;
      }
    });

    this.getAmount(index);
  };

  setPurity = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].purity = value;
    });
  };

  setItemPricePerGram = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(async () => {
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
    });

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
    runInAction(() => {
      this.items[index].stoneWeight = value ? parseFloat(value) : '';
      if (this.items[index].pricePerGram > 0) {
        this.items[index].netWeight =
          parseFloat(this.items[index].grossWeight || 0) -
          parseFloat(this.items[index].stoneWeight || 0);
      }
    });
    this.getAmount(index);
  };

  setItemStoneCharge = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].stoneCharge = value ? parseFloat(value) : '';
    });
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

  setPurchaseBillUploadedFiles = (files) => {
    this.billDetails.imageUrls = files;
  };

  setCGSTSGSTEnabledByPOS = (value) => {
    runInAction(() => {
      this.isCGSTSGSTEnabledByPOS = value;
    });
  };

  updatePurchaseTallySyncStatus = async (status, invoiceNumber) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.purchases.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            bill_number: {
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
          // No Purchases data is not found so cannot update any information
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

  updateBulkPurchaseTallySyncStatus = async (inputItems, status) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    for (var i = 0; i < inputItems.length; i++) {
      let item = inputItems[i];
      let updatedAtNewTime = timestamp.getUniqueTimestamp();
      const query = await db.purchases.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              bill_number: {
                $eq: item.bill_number
              }
            }
          ]
        }
      });
      query
        .exec()
        .then(async (data) => {
          if (!data) {
            // No Purchases data is not found so cannot update any information
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

  setLRNumber = async (value) => {
    runInAction(() => {
      this.billDetails.lrNumber = value;
    });
    if (this.billDetails.vendor_id !== '' && value !== '') {
      let itemsList =
        await this.getBackToBackPurchasesItemDetailsByLRNumberAndVendor(
          this.billDetails.vendor_id,
          value
        );
      if (itemsList && itemsList.length > 0) {
        runInAction(() => {
          this.items = itemsList;
        });
      }
    }
  };

  getBackToBackPurchasesItemDetailsByLRNumberAndVendor = async (
    vendorId,
    lrNumber
  ) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let prodsResult = [];

    await db.backtobackpurchases
      .findOne({
        selector: {
          $and: [
            {
              businessId: { $eq: businessData.businessId }
            },
            {
              lrNumber: { $eq: lrNumber }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          return;
        }

        if (data) {
          let itemList = data.item_list;
          for (let item of itemList) {
            if (item.vendorId === vendorId) {
              delete item['vendorId'];
              delete item['vendorName'];
              delete item['vendorGstNumber'];
              delete item['vendorGstType'];
              delete item['vendorPayable'];
              delete item['vendorPhoneNumber'];
              delete item['vendorCity'];
              delete item['vendorPincode'];
              delete item['vendorAddress'];
              delete item['vendorState'];
              delete item['vendorCountry'];
              delete item['vendorEmailId'];
              delete item['vendorPanNumber'];
              prodsResult.push(item);
            }
          }
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return prodsResult;
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

  handleSerialListModalClose = (val) => {
    runInAction(() => {
      this.OpenPurchaseBillSerialList = false;
      this.selectedProduct = {};
    });
  };

  selectProductFromSerial = (selectedIndex, selectedProduct) => {
    runInAction(() => {
      let isProductExists = false;
      let productsAleryPresent = [];
      // adding same product to sales
      if (this.items && this.items.length > 0) {
        for (let fs of selectedProduct.serialData) {
          if (fs.selected === false) {
            continue;
          }
          let serialNoToFind = fs.serialNo;
          for (let i = 0; i < this.items.length; i++) {
            if (selectedIndex === i) {
              continue;
            }
            let item = this.items[i];
            if (item.serialOrImeiNo === serialNoToFind) {
              isProductExists = true;
              productsAleryPresent.push(serialNoToFind);
            } else if (item.serialNo && item.serialNo.length > 0) {
              let filteredSerialData = item.serialNo.filter((ele) => {
                return ele === serialNoToFind;
              });
              if (filteredSerialData && filteredSerialData.length > 0) {
                productsAleryPresent.push(serialNoToFind);
                isProductExists = true;
              }
            }
          }
        }
      }

      if (isProductExists === true) {
        this.resetSingleProduct(this.selectedIndex);

        setTimeout(() => {
          this.FocusLastIndex = Number('4' + this.selectedIndex);
        }, 100);
        this.handleSerialListModalClose();
        runInAction(() => {
          this.errorAlertMessage =
            'Product with Serial No: ' +
            productsAleryPresent.join(', ') +
            ' is already added';
          this.openPurchaseBillErrorAlertMessage = true;
        });
        return;
      }

      if (!this.isUpdate) {
        if (this.purchaseTxnEnableFieldsMap.get('enable_product_price')) {
          this.items[this.selectedIndex].purchased_price =
            this.items[this.selectedIndex].purchased_price > 0
              ? this.items[this.selectedIndex].purchased_price
              : parseFloat(selectedProduct.purchasedPrice);
        } else if (
          this.purchaseTxnEnableFieldsMap.get('enable_product_price_per_gram')
        ) {
          this.items[this.selectedIndex].pricePerGram =
            this.items[this.selectedIndex].pricePerGram > 0
              ? this.items[this.selectedIndex].pricePerGram
              : parseFloat(selectedProduct.purchasedPrice);
        }

        this.items[
          this.selectedIndex
        ].originalPurchasePriceWithoutConversionQty =
          this.items[this.selectedIndex]
            .originalPurchasePriceWithoutConversionQty > 0
            ? this.items[this.selectedIndex]
                .originalPurchasePriceWithoutConversionQty
            : parseFloat(selectedProduct.purchasedPrice);

        this.items[this.selectedIndex].finalMRPPrice =
          this.items[this.selectedIndex].finalMRPPrice > 0
            ? this.items[this.selectedIndex].finalMRPPrice
            : parseFloat(selectedProduct.purchasedPrice);

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
      }
      let serialNos = [];
      for (let item of selectedProduct.serialData) {
        if (item.selected) {
          serialNos.push(item.serialNo);
        }
      }
      this.items[this.selectedIndex].serialNo = serialNos;
      this.items[this.selectedIndex].qty = serialNos.length;
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
      this.openPurchaseBillErrorAlertMessage = true;
      this.errorAlertMessage = message;
    });
  };

  handleClosePurchaseBillErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseBillErrorAlertMessage = false;
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
      this.billDetails.bill_number = '';
      this.billDetails.vendor_bill_number = '';
      this.billDetails.bill_date = getTodayDateInYYYYMMDD();
      await this.checkForTaxAndLoadUI();
      this.generateBillNumber();
    });

    if (this.billDetails.splitPaymentList === undefined) {
      this.billDetails.splitPaymentList = [];
    }

    if (this.billDetails.payment_type === 'Split') {
      this.chosenPaymentType = 'Split';
    } else {
      this.chosenPaymentType = 'Cash';
    }

    /**
     * get customer txn which are un used
     */
    if (item.vendor_id !== '' && item.vendor_id.length > 2) {
      const db = await Db.get();

      this.billDetails.linkedTxnList = [];

      await lp.getAllUnPaidTxnForCustomer(
        this,
        db,
        item.vendor_id,
        'Purchases'
      );
    }

    this.previousBalanceAmount = this.billDetails.linked_amount;
    this.previousCreditFlag = this.billDetails.is_credit;
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
        this.setPurchasesPlaceOfSupply(result.val);
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

  setPlaceOfSupplyState = (val) => {
    runInAction(() => {
      this.placeOfSupplyState = val;
    });
  };

  initializeData = () => {
    runInAction(async () => {
      this.OpenAddPurchaseBill = true;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.isUpdate = false;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
      this.customerCreditDays = 0;
    });
  };

  raisePurchasefrom2B = async (vendor, purchaseData) => {
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.isUpdate = false;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.billDetails = new Purchase().defaultValues();
      this.billDetails.businessId = businessData.businessId;
      this.billDetails.businessCity = businessData.businessCity;
      this.billDetails.posId = parseFloat(businessData.posDeviceId);
      this.billDetails.vendor_bill_number = purchaseData.inum;
      this.billDetails.bill_date = formatDate(purchaseData.dt);
      this.billDetails.accountingDate = purchaseData.accountingDate;
      let result = getStateList().find((e) => e.code === purchaseData.pos);
      if (result) {
        this.setPlaceOfSupplyName(result.name);
        this.setPurchasesPlaceOfSupply(result.val);
      }
      if (purchaseData.itcavl === 'Y') {
        this.billDetails.portalITCAvailable = true;
      }
      if (purchaseData.rev === 'Y') {
        this.billDetails.portalRCMValue = true;
      }
      if (purchaseData.posITC === 'Y') {
        this.billDetails.posITCAvailable = true;
      }
      if (purchaseData.posRCM === 'Y') {
        this.billDetails.posRCMValue = true;
      }
      this.billDetails.fromPortal = true;

      this.billDetails.payment_type = 'Credit';
      this.billDetails.is_credit = true;
      this.billDetails.notes = purchaseData.notes;
    });

    runInAction(async () => {
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
      this.billDetails.vendorPanNumber = vendor.panNumber;
      this.billDetails.aadharNumber = vendor.aadharNumber;
      this.billDetails.vendorMsmeRegNo = vendor.msmeRegNo;
    });

    this.items = [];
    await purchaseData.items.forEach(async (purchaseItem, index) => {
      let newItem = new PurchaseItem().defaultValues();
      newItem.item_name = this.billDetails.vendor_name + ' Payment';
      newItem.taxIncluded = false;
      newItem.qty = 1;
      newItem.purchased_price = parseFloat(purchaseItem.txval);
      newItem.purchased_price_before_tax = parseFloat(purchaseItem.txval);
      if (purchaseItem.igst > 0) {
        newItem.igst_amount = parseFloat(purchaseItem.igst);
        newItem.igst = parseFloat(purchaseItem.rt);
      } else {
        newItem.cgst_amount = parseFloat(purchaseItem.cgst);
        newItem.sgst_amount = parseFloat(purchaseItem.sgst);
        newItem.cgst = parseFloat(purchaseItem.rt / 2);
        newItem.sgst = parseFloat(purchaseItem.rt / 2);
      }

      const finalAmount =
        newItem.purchased_price +
        newItem.cgst_amount +
        newItem.sgst_amount +
        newItem.igst_amount;
      newItem.amount = Math.round(finalAmount * 100) / 100 || 0;

      await this.items.push(newItem);
      this.billDetails.total_amount += parseFloat(newItem.amount).toFixed(2);
    });

    this.billDetails.balance_amount = parseFloat(
      this.billDetails.total_amount
    ).toFixed(2);

    await this.saveData(false);
  };

  openBulkBatchModal = (index, selectedProduct) => {
    // this.selectedPurchaseItem = this.items[index];
    // this.selectedPurchaseItem.batches = selectedProduct.batchData;
    // runInAction(() => {
    //   this.OpenPurchaseBulkBatchList = true;
    // });
  };

  setBulkBatchProperty = (property, value) => {
    runInAction(async () => {
      // this.selectedPurchaseItem.batches[property] = value;
    });
  };

  handleCloseBulkBatchModal = () => {
    runInAction(() => {
      this.OpenPurchaseBulkBatchList = false;
      this.selectedPurchaseItem = {};
      this.singleBatchData = new PurchaseBatchItem().defaultValues();
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
    let serialNo = [];
    let selector = {
      $and: [{ productId: { $eq: item.product_id } }]
    };
    let product = await getProductDataById(selector);
    if (!this.isUpdate) {
      let filteredSerialData = product.serialData.filter((ele) => {
        return ele.purchased === false && ele.purchaseReturn === false;
      });
      if (item.serialNo && item.serialNo.length > 0) {
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
      }
    } else {
      if (item.serialNo && item.serialNo.length > 0) {
        for (let fs of item.serialNo) {
          serialNo.push({
            serialNo: fs,
            selected: true
          });
        }
      }
    }
    if (
      this.selectedProduct &&
      (this.selectedProduct.product_id === '' ||
        this.selectedProduct.product_id === undefined ||
        this.selectedProduct.product_id === null)
    ) {
      this.selectedProduct = JSON.parse(JSON.stringify(product));
    }
    this.selectedProduct.serialData = serialNo;

    this.selectedIndex = index;
    this.OpenPurchaseBillSerialList = true;
  };

  setCreditLimitDays = (value) => {
    runInAction(() => {
      this.customerCreditDays = value;
    });
  };

  constructor() {
    this.billDetails = new Purchase().defaultValues();
    this.items = [new PurchaseItem().defaultValues()];
    this.singleBatchData = new PurchaseBatchItem().defaultValues();

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
      setOffer: action,
      getAmount: action,
      setCGST: action,
      setSGST: action,
      setDiscountAmount: action,
      setBillNumber: action,
      setBillDate: action,
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
      OpenAddPurchaseBill: observable,
      closeDialog: action,
      viewOrEditItem: action,
      openForNewPurchase: action,
      selectProduct: action,
      setEditTable: action,
      viewOrEditPurchaseTxnItem: action,
      deletePurchaseTxnItem: action,
      purchasesData: observable,
      purchases: observable,
      getPurchasesData: computed,
      getPurchasesdetails: action,
      addPurchasesData: action,
      vendorList: observable,
      setVendorList: action,
      getVendorList: computed,
      dateDropValue: observable,
      setDateDropValue: action,
      getDateDropValue: computed,
      getBalanceAfterLinkedAmount: computed,
      getPurchasescount: action,
      isPurchasesList: observable,
      getPurchasesList: action,
      handlePurchasesSearch: action,
      openLinkpaymentPage: observable,
      paymentLinkTransactions: observable,
      enabledRow: observable,
      OpenBatchList: observable,
      selectedProduct: observable,
      setInvoiceRegularSetting: action,
      FocusLastIndex: observable,
      setInvoiceThermalSetting: action,
      setFocusLastIndex: action,
      setReverseChargeEnable: action,
      setReverseChargeValue: action,
      setPaymentMode: action,
      setBankAccountData: action,
      setPaymentReferenceNumber: action,
      taxSettingsData: observable,
      setTaxSettingsData: action,
      setItemHSN: action,
      purchaseTxnEnableFieldsMap: observable,
      setPurchaseTxnEnableFieldsMap: action,
      convertPOToPurchase: action,
      getAddRowEnabled: action,
      setAddRowEnabled: action,
      setSerialOrImeiNo: action,
      setMakingChargeAmount: action,
      setMakingChargePerGramAmount: action,
      setMakingCharge: action,
      previousBalanceAmount: observable,
      viewAndRestorePurchaseItem: action,
      restorePurchaseItem: action,
      addRateToList: action,
      setRateList: action,
      chosenMetalList: observable,
      printPurchaseData: observable,
      resetPurchasePrintData: action,
      closeDialogForSaveAndPrint: action,
      purchaseTxnSettingsData: observable,
      printBalance: observable,
      isMultiplePurchaseAvailable: observable,
      openPurchaseLoadingAlertMessage: observable,
      openPurchaseErrorAlertMessage: observable,
      openPurchasePrintSelectionAlert: observable,
      setMakingChargeIncluded: action,
      setRoundingConfiguration: action,
      previousCreditFlag: observable,
      descriptionCollapsibleMap: observable,
      openSplitPaymentDetails: observable,
      chosenPaymentType: observable,
      splitPaymentSettingsData: observable,
      openAddressList: observable,
      customerAddressList: observable,
      isCGSTSGSTEnabledByPOS: observable,
      OpenPurchaseBillSerialList: observable,
      openPurchaseBillErrorAlertMessage: observable,
      errorAlertMessage: observable,
      singleBatchData: observable,
      selectedPurchaseItem: observable,
      OpenPurchaseBulkBatchList: observable,
      placeOfSupplyState: observable,
      customerCreditDays: observable
    });
  }
}
export default new PurchasesAddStore();