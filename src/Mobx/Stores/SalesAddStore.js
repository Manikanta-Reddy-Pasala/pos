import {
  action,
  computed,
  observable,
  makeObservable,
  toJS,
  runInAction
} from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as productTxn from '../../components/Helpers/ProductTxnHelper';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import _uniqueId from 'lodash/uniqueId';
import * as Bd from '../../components/SelectedBusiness';
import * as audit from '../../components/Helpers/AuditHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as qtyUnitUtility from '../../components/Utility/QuantityUnitUtility';
import * as einvoice from '../../components/Helpers/EinvoiceAPIHelper';
import * as dateHelper from '../../components/Helpers/DateHelper';
import * as deviceIdHelper from '../../components/Helpers/PrintHelper/CloudPrintHelper';
import BatchData from './classes/BatchData';
import * as stateListHelper from '../../components/Helpers/StateListHelper';
import * as balanceUpdate from '../../components/Helpers/CustomerAndVendorBalanceHelper';
import getStateList from 'src/components/StateList';
import * as taxSettings from '../../components/Helpers/TaxSettingsHelper';
import * as cancelTxn from '../../components/Helpers/CancelTxnHelper';
import * as timestamp from '../../components/Helpers/TimeStampGeneratorHelper';
import * as numHelper from '../../components/Helpers/StringAndNumberHelper';
import * as lp from '../../components/Helpers/LinkPaymentHelper';
import { checkSaleSequenceNumberExists } from 'src/components/Helpers/dbQueries/sales';
import {
  updateSessionGroup,
  getSessionGroupDataById
} from 'src/components/Helpers/dbQueries/sessionGroup';
import {
  getTodayDateInYYYYMMDD,
  convertDaysToYearsMonthsDays,
  calculateNewDateForProvidedDateAndDays
} from '../../components/Helpers/DateHelper';
import { getSaleTransactionSettings } from 'src/components/Helpers/dbQueries/saletransactionsettings';
import { getTaxSettings } from 'src/components/Helpers/dbQueries/taxsettings';
import Sales from 'src/Mobx/Stores/classes/Sales';
import SalesItem from 'src/Mobx/Stores/classes/SalesItem';
import { prepareColumnIndexMap } from 'src/components/Helpers/ColumnIndexHelper';
import { getRateData } from 'src/components/Helpers/dbQueries/rates';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';
import Insurance from 'src/Mobx/Stores/classes/Insurance';

var dateFormat = require('dateformat');

class SalesAddStore {
  openInvoiceNumModal = false;
  openInvNumDubCheck = false;

  newCustomer = false;

  isUpdate = false;

  openAddSalesInvoice = false;

  profitLossDetailDialogOpen = false;

  profitLossDetails = {
    item_list: []
  };

  OpenBatchList = false;

  OpenSerialList = false;

  selectedProduct = {};

  saveAndNew = false;

  existingSaleData = {};

  newCustomerData = {};

  selectedIndex = 0;

  paymentLinkTransactions = [];

  FocusLastIndex = false;

  enabledRow = 0;

  addNewRowEnabled = false;

  salesTxnEnableFieldsMap = new Map();

  taxSettingsData = {};

  saleTxnSettingsData = {};

  //GSTR1 varibales start
  GSTRDateRange = {};

  productAddOnsData = [];
  selectedProductData = {};
  addonIndex = '';

  openAddonList = false;

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

  openTransportDetails = false;

  openPODetails = false;

  openSaleLoadingAlertMessage = false;
  openSaleErrorAlertMessage = false;
  errorAlertMessage = '';

  openPrintSelectionAlert = false;

  descriptionCollapsibleMap = new Map();

  splitPaymentSettingsData = {};

  chosenPaymentType = 'Cash';

  openAddressList = false;

  cancelRemark = '';
  openCancelDialog = false;
  cancelItem = {};
  cancelItemIsEInvoice = false;

  metalList = [];
  openAmendmentDialog = false;
  notPerformAmendment = false;
  openMfgDetails = false;

  saleAuditDetails = {};
  columnIndexMap = new Map();

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

  saleQuotationDetails = {};
  jobWorkInDetails = {};
  deliveryChallanDetails = {};
  saleOrderDetails = {};
  schemeOrderDetails = {};
  sessionOrderDetails = {};
  sessionId = '';

  previousBalanceAmount = 0;

  isRestore = false;
  autoPushEInvoice = false;
  isCancelledRestore = false;

  chosenMetalString = '';
  chosenMetalList = [];

  printData = null;

  printBalance = {};

  isSequenceNuberExist = false;
  manualSequenceNumber = '';

  roundingConfiguration = 'Nearest 50';

  salesReportFilters = [];

  sequenceNumberFailureAlert = false;

  previousCreditFlag = false;

  openSplitPaymentDetails = false;

  bankAccountsList = [];

  customerAddressList = [];
  customerAddressType = '';

  isLaunchEWayAfterSaleCreation = false;

  isCGSTSGSTEnabledByPOS = true;

  isLocked = false;

  saleLockMessage = '';

  productOutOfStockAlert = false;
  productOutOfStockName = '';

  shippingTax = 0;
  packingTax = 0;
  insuranceTax = 0;

  openProductDetails = false;
  isComingFromProductSearch = false;
  placeOfSupplyState = '';
  customerCreditDays = 0;

  closeLinkPayment = () => {
    this.openLinkpaymentPage = false;
  };

  setPlaceOfSupply = (value) => {
    runInAction(() => {
      this.saleDetails.place_of_supply = value;
    });
  };

  setPlaceOfSupplyName = (value) => {
    runInAction(() => {
      this.saleDetails.placeOfSupplyName = value;
    });
  };

  setEwayBillNo = (value) => {
    runInAction(() => {
      this.saleDetails.ewayBillNo = value;
    });
  };

  saveLinkPaymentChanges = () => {
    if (this.saleDetails.linked_amount > 0) {
      this.saleDetails.linkPayment = true;
    }
    this.closeLinkPayment();
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

  setSalesTxnEnableFieldsMap = (salesTransSettingData) => {
    runInAction(() => {
      this.salesTxnEnableFieldsMap = new Map();
      this.saleTxnSettingsData = salesTransSettingData;
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

  setTaxSettingsData = (value) => {
    runInAction(() => {
      this.taxSettingsData = value;
    });
  };

  getsalesdetails = async (customerId) => {
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();
    db.sales
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
        runInAction(() => {
          this.sales = data.map((item) => item.toJSON());
        });
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

  addSalesData = (data) => {
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

  addSalesJSONData = (data) => {
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

  get getSalesData() {
    return this.salesData ? this.salesData : [];
  }

  get getTotalAmount() {
    if (!this.items) {
      return 0;
    }

    const returnValue = this.items.reduce((a, b) => {
      const amount = toJS(this.getItemTotalAmount(b));

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

      this.saleDetails.discount_amount = discountAmount;
    } else if (discountType === 'amount') {
      discountAmount = parseFloat(this.saleDetails.discount_amount || 0);

      this.saleDetails.discount_percent =
        Math.round(((discountAmount / finalValue) * 100 || 0) * 100) / 100;
    }

    let greatestShippingTaxValue = this.saleAuditDetails
      ? parseFloat(this.shippingTax) || 0
      : 0;

    let shippingCharge = this.saleDetails.shipping_charge || 0;
    let shippingChargeGST = 0;
    if (shippingCharge > 0 && greatestShippingTaxValue > 0) {
      shippingChargeGST = (shippingCharge * greatestShippingTaxValue) / 100;
      if (
        this.saleDetails.shippingTax === undefined ||
        this.saleDetails.shippingTax === null
      ) {
        this.saleDetails.shippingTax = {
          cgst: 0,
          sgst: 0,
          igst: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0
        };
      }
      if (this.isCGSTSGSTEnabledByPOS) {
        this.saleDetails.shippingTax.cgst = greatestShippingTaxValue / 2;
        this.saleDetails.shippingTax.sgst = greatestShippingTaxValue / 2;
        this.saleDetails.shippingTax.cgstAmount = shippingChargeGST / 2;
        this.saleDetails.shippingTax.sgstAmount = shippingChargeGST / 2;
      } else {
        this.saleDetails.shippingTax.igst = greatestShippingTaxValue;
        this.saleDetails.shippingTax.igstAmount = shippingChargeGST;
      }
    }

    let greatestPackingTaxValue = this.saleAuditDetails
      ? parseFloat(this.packingTax) || 0
      : 0;

    let packingCharge = this.saleDetails.packing_charge || 0;
    let packingChargeGST = 0;
    if (packingCharge > 0 && greatestPackingTaxValue > 0) {
      packingChargeGST = (packingCharge * greatestPackingTaxValue) / 100;
      if (
        this.saleDetails.packingTax === undefined ||
        this.saleDetails.packingTax === null
      ) {
        this.saleDetails.packingTax = {
          cgst: 0,
          sgst: 0,
          igst: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0
        };
      }
      if (this.isCGSTSGSTEnabledByPOS) {
        this.saleDetails.packingTax.cgst = greatestPackingTaxValue / 2;
        this.saleDetails.packingTax.sgst = greatestPackingTaxValue / 2;
        this.saleDetails.packingTax.cgstAmount = packingChargeGST / 2;
        this.saleDetails.packingTax.sgstAmount = packingChargeGST / 2;
      } else {
        this.saleDetails.packingTax.igst = greatestPackingTaxValue;
        this.saleDetails.packingTax.igstAmount = packingChargeGST;
      }
    }

    let totalAmount = parseFloat(
      finalValue -
        discountAmount +
        (shippingCharge || 0) +
        (packingCharge || 0) +
        (shippingChargeGST || 0) +
        (packingChargeGST || 0)
    );

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

    totalTaxableAmount =
      totalTaxableAmount - shippingChargeGST - packingChargeGST;

    let insuranceAmount = parseFloat(this.insurance.amount || 0);
    let insuranceGST = 0;

    if (this.insurance.percent > 0) {
      insuranceAmount = (totalTaxableAmount * this.insurance.percent) / 100;
      this.insurance.amount = insuranceAmount;
      this.insurance.amountOtherCurrency =
        this.populateOtherCurrencyValue(insuranceAmount);
    }

    if (insuranceAmount > 0 && this.insuranceTax > 0) {
      insuranceGST = (insuranceAmount * this.insuranceTax) / 100;

      if (this.isCGSTSGSTEnabledByPOS) {
        this.insurance.cgst = this.insuranceTax / 2;
        this.insurance.sgst = this.insuranceTax / 2;
        this.insurance.cgstAmount = insuranceGST / 2;
        this.insurance.sgstAmount = insuranceGST / 2;
      } else {
        this.insurance.igst = this.insuranceTax;
        this.insurance.igstAmount = insuranceGST;
      }
    }

    totalTaxableAmount = totalTaxableAmount - insuranceGST;

    let tcsAmount = 0;
    let tdsAmount = 0;

    if (this.saleDetails.tcsRate > 0) {
      tcsAmount = (totalAmount * this.saleDetails.tcsRate) / 100;
      runInAction(() => {
        this.saleDetails.tcsAmount = tcsAmount;
      });
    }

    if (this.saleDetails.tdsRate > 0) {
      tdsAmount = (totalTaxableAmount * this.saleDetails.tdsRate) / 100;
      runInAction(() => {
        this.saleDetails.tdsAmount = tdsAmount;
      });
    }

    totalAmount =
      totalAmount + tcsAmount + insuranceAmount + (insuranceGST || 0);

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

    runInAction(() => {
      this.saleDetails.total_amount = totalAmount;
    });

    // To add method for Other Currency Total Amount
    this.saleDetails.totalOtherCurrency =
      this.populateOtherCurrencyValue(totalAmount);

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

  getsalescount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    // console.log('inside sales count');
    await db.sales
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isSalesList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getsalesList = async (fromDate, toDate) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;
    const businessData = await Bd.getBusinessData();

    if (!fromDate || !toDate) {
      query = db.sales.find({
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
      query = db.sales.find({
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

  getsalesListWithLimit = async (fromDate, toDate, pageSize) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;

    if (!pageSize) {
      pageSize = 5;
    }
    const businessData = await Bd.getBusinessData();

    if (!fromDate || !toDate) {
      query = db.sales.find({
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
      query = db.sales.find({
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

  getsalesListByCustomer = async (fromDate, toDate, phoneNo) => {
    const db = await Db.get();
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;
    const businessData = await Bd.getBusinessData();

    if (phoneNo) {
      query = db.sales.find({
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
        query = db.sales.find({
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

  getOnlineSalesList = async (fromDate, toDate) => {
    // console.log('fromDate::', fromDate);
    // console.log('toDate::', toDate);
    var query;
    const businessData = await Bd.getBusinessData();

    if (fromDate && toDate) {
      const db = await Db.get();

      query = db.sales.find({
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

      query
        .exec()
        .then(async (data) => {
          if (!data) {
            return;
          }

          runInAction(() => {
            this.salesData = [];
          });
          for (let item of data) {
            let record = item.toJSON();
            if (record.posId === 0) {
              runInAction(() => {
                this.salesData.push(record);
              });
            }
          }
        })
        .catch((err) => {
          runInAction(() => {
            this.salesData = [];
          });
          console.log('Internal Server Error', err);
        });
    }
  };

  handleSalesSearch = async (value) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.sales
      .find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { sequenceNumber: { $regex: regexp } }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { customer_name: { $regex: regexp } }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { payment_type: { $regex: regexp } }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
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

  handleSalesSearchWithDate = async (value, fromDate, toDate, billTypeName) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    let query = await db.sales.find({
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
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
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

  handleSalesSearchWithDateAndTCS = async (
    value,
    fromDate,
    toDate,
    billTypeName
  ) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    let query = await db.sales.find({
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

  handleSalesByCustomerSearch = async (value, fromDate, toDate, mobileNo) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    if (mobileNo.length >= 10) {
      let query = db.sales.find({
        selector: {
          $or: [
            {
              $and: [
                { sequenceNumber: { $regex: regexp } },
                { customer_phoneNo: { $eq: mobileNo } },
                { invoice_date: { $gte: fromDate } },
                { invoice_date: { $lte: toDate } },
                { businessId: { $eq: businessData.businessId } }
              ]
            },
            {
              $and: [
                { total_amount: { $eq: parseFloat(value) } },
                { customer_phoneNo: { $eq: mobileNo } },
                { invoice_date: { $gte: fromDate } },
                { invoice_date: { $lte: toDate } },
                { businessId: { $eq: businessData.businessId } }
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

          for (let item of row.item_list) {
            purchasedPrice =
              parseFloat(purchasedPrice) +
              parseFloat(item.qty * item.purchased_price);
          }
          row.profit_loss =
            parseFloat(row.total_amount) - parseFloat(purchasedPrice);

          data.push(row);
        });
      });
      return data;
    }
  };

  handleOnlineSalesSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    let data = [];
    const businessData = await Bd.getBusinessData();

    let query = db.sales.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } },
              { invoice_date: { $gte: fromDate } },
              { invoice_date: { $lte: toDate } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              { invoice_date: { $gte: fromDate } },
              { invoice_date: { $lte: toDate } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customer_name: { $regex: regexp } },
              { invoice_date: { $gte: fromDate } },
              { invoice_date: { $lte: toDate } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              { invoice_date: { $gte: fromDate } },
              { invoice_date: { $lte: toDate } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance_amount: { $eq: parseFloat(value) } },
              { invoice_date: { $gte: fromDate } },
              { invoice_date: { $lte: toDate } }
            ]
          }
        ]
      }
    });

    await query.exec().then((documents) => {
      for (let item of documents) {
        let record = item.toJSON();
        if (record.posId === 0) {
          data.push(record);
        }
      }
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
    this.openLinkpaymentPage = true;
  };

  setLinkedAmount = async (value) => {
    const amount = parseFloat(value) || 0;
    this.saleDetails.linked_amount = amount;
  };

  get getBalanceAfterLinkedAmount() {
    // console.log('getBalanceAfterLinkedAmount');

    let result = 0;

    result =
      parseFloat(this.saleDetails.total_amount) -
        parseFloat(this.saleDetails.linked_amount) ||
      //  -
      // parseFloat(this.saleDetails.received_amount)
      0;

    return result;
  }

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

  generateWorkLossId = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('w');
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
      this.isCancelledRestore = false;
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

    this.saleDetails = new Sales().convertTypes(
      JSON.parse(JSON.stringify(item))
    );

    await this.deleteData();
  };

  setDefaultValue = async (item, property, defaultValue) => {
    if (
      item[property] === null ||
      item[property] === '' ||
      item[property] === undefined ||
      Number.isNaN(item[property])
    ) {
      item[property] = defaultValue;
    }
  };

  saveData = async (isPrint, isLaunchEWay) => {
    if (!this.saleDetails.invoice_number) {
      await this.generateInvoiceNumber();
    }

    let filteredArray = [];

    for (var i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      if (item.item_name === '') {
        continue;
      }

      item.itemNumber = parseInt(i) + 1;

      this.setDefaultValue(item, 'batch_id', 0);
      this.setDefaultValue(item, 'qty', 0);
      this.setDefaultValue(item, 'mrp', 0);
      this.setDefaultValue(item, 'purchased_price', 0);
      this.setDefaultValue(item, 'offer_price', 0);
      this.setDefaultValue(item, 'mrp_before_tax', 0);
      this.setDefaultValue(item, 'size', 0);
      this.setDefaultValue(item, 'cgst', 0);
      this.setDefaultValue(item, 'sgst', 0);
      this.setDefaultValue(item, 'igst', 0);
      this.setDefaultValue(item, 'cess', 0);
      this.setDefaultValue(item, 'cgst_amount', 0);
      this.setDefaultValue(item, 'sgst_amount', 0);
      this.setDefaultValue(item, 'igst_amount', 0);
      this.setDefaultValue(item, 'taxIncluded', false);
      this.setDefaultValue(item, 'amount', 0);
      this.setDefaultValue(item, 'roundOff', 0);
      this.setDefaultValue(item, 'isEdit', true);
      this.setDefaultValue(item, 'returnedQty', 0);
      this.setDefaultValue(item, 'stockQty', 0);
      this.setDefaultValue(item, 'discount_amount', 0);
      this.setDefaultValue(item, 'discount_percent', 0);
      this.setDefaultValue(item, 'discount_amount_per_item', 0);
      this.setDefaultValue(item, 'makingChargePercent', 0);
      this.setDefaultValue(item, 'makingChargeAmount', 0);
      this.setDefaultValue(item, 'makingChargePerGramAmount', 0);
      this.setDefaultValue(item, 'finalMRPPrice', 0);
      this.setDefaultValue(item, 'makingChargeIncluded', false);
      this.setDefaultValue(item, 'freeQty', 0);
      this.setDefaultValue(item, 'freeStockQty', 0);
      this.setDefaultValue(item, 'unitConversionQty', 0);
      this.setDefaultValue(item, 'originalMrpWithoutConversionQty', 0);
      this.setDefaultValue(item, 'mfDate', null);
      this.setDefaultValue(item, 'expiryDate', null);
      this.setDefaultValue(item, 'pricePerGram', 0);
      this.setDefaultValue(item, 'stoneWeight', 0);
      this.setDefaultValue(item, 'stoneCharge', 0);
      this.setDefaultValue(item, 'itemNumber', 0);
      this.setDefaultValue(item, 'hsn', '');
      this.setDefaultValue(item, 'originalDiscountPercent', 0);
      this.setDefaultValue(item, 'hallmarkCharge', 0);
      this.setDefaultValue(item, 'certificationCharge', 0);
      this.setDefaultValue(item, 'startPackingNo', 0);
      this.setDefaultValue(item, 'endPackingNo', 0);
      this.setDefaultValue(item, 'totalPackingNos', 0);
      this.setDefaultValue(item, 'netWeightPerPackage', 0);
      this.setDefaultValue(item, 'grossWeightPerPackage', 0);
      this.setDefaultValue(item, 'totalPackageNetWeight', 0);
      this.setDefaultValue(item, 'mrpOtherCurrency', 0);
      this.setDefaultValue(item, 'amountOtherCurrency', 0);
      this.setDefaultValue(item, 'warrantyDays', 0);
      this.setDefaultValue(item, 'purchased_price_before_tax', 0);

      if (
        !item.product_id ||
        item.product_id === '' ||
        item.product_id.length === 0
      ) {
        item.product_id = await this.generateProductId();
      }

      if (item.warrantyDays > 0) {
        item.warrantyEndDate = calculateNewDateForProvidedDateAndDays(
          this.saleDetails.invoice_date,
          item.warrantyDays
        );
      }

      filteredArray.push(item);
    }

    this.items = filteredArray;

    const properties = [
      'discount_amount',
      'discount_percent',
      'packing_charge',
      'shipping_charge',
      'received_amount',
      'balance_amount',
      'total_amount',
      'round_amount',
      'approxDistance',
      'tcsAmount',
      'tcsRate',
      'tdsAmount',
      'tdsRate',
      'weightIn',
      'weightOut',
      'wastage',
      'sortingNumber',
      'exportConversionRate',
      'discountPercentForAllItems',
      'imageUrls'
    ];

    properties.forEach((property) =>
      this.setDefaultValue(this.saleDetails, property, 0)
    );

    this.setDefaultValue(this.saleDetails, 'is_roundoff', false);
    this.setDefaultValue(this.saleDetails, 'templeOccursEveryYear', false);
    this.setDefaultValue(this.saleDetails, 'specialDayEnabled', true);
    this.setDefaultValue(this.saleDetails, 'convertedToDC', false);
    this.setDefaultValue(this.saleDetails, 'amended', false);

    if (
      this.saleDetails.splitPaymentList &&
      this.saleDetails.splitPaymentList.length > 0
    ) {
      for (let i = 0; i < this.saleDetails.splitPaymentList.length; i++) {
        runInAction(() => {
          this.saleDetails.splitPaymentList[i].amount =
            parseFloat(this.saleDetails.splitPaymentList[i].amount) || 0;
        });
      }
    }

    if (this.chosenPaymentType === 'Split') {
      this.saleDetails.payment_type = this.chosenPaymentType;
    }

    if (
      !('calculateStockAndBalance' in this.saleDetails) ||
      !this.saleDetails.calculateStockAndBalance
    ) {
      this.saleDetails.calculateStockAndBalance = true;
    }

    if (this.insurance) {
      const insuranceProperties = [
        'amount',
        'percent',
        'cgst',
        'sgst',
        'igst',
        'cgstAmount',
        'sgstAmount',
        'igstAmount'
      ];
      insuranceProperties.forEach((property) =>
        this.setDefaultValue(this.insurance, property, 0)
      );
    }

    this.saleDetails.insurance = this.insurance;

    if (this.items.length > 0) {
      if (this.isUpdate) {
        await this.updateSaleInformation(isPrint, isLaunchEWay);
      } else {
        await this.addSaleInformation(isPrint, isLaunchEWay);
      }
    }
  };

  addSaleInformation = async (isPrint, isLaunchEWay) => {
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
        this.saleDetails.invoice_number
      );
    }

    if (this.saleDetails.sequenceNumber === '0') {
      this.saleDetails.sequenceNumber = '';
      this.handleCloseSaleLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    } else {
      const seqParts = this.saleDetails.sequenceNumber.split('/');
      if (
        this.saleDetails.sequenceNumber.includes('/') &&
        seqParts &&
        seqParts.length > 0
      ) {
        const seqLastPart = seqParts[seqParts.length - 1];
        this.saleDetails.sortingNumber = parseFloat(seqLastPart);
      } else {
        if (
          numHelper.containsLettersAndNumbers(this.saleDetails.sequenceNumber)
        ) {
          this.saleDetails.sortingNumber =
            numHelper.extractLastNumber(this.saleDetails.sequenceNumber) || 0;
        } else {
          this.saleDetails.sortingNumber = this.saleDetails.sequenceNumber;
        }
      }
    }

    if (
      (await checkSaleSequenceNumberExists(
        this.saleDetails.invoice_date,
        this.saleDetails.sequenceNumber
      )) === true
    ) {
      this.handleCloseSaleLoadingMessage();
      this.handleOpenSaleErrorAlertMessage(
        'Sequence Number already exists. Please go to settings to check or update the running sequence!!'
      );
      return;
    }

    if (
      !('calculateStockAndBalance' in this.saleDetails) ||
      !this.saleDetails.calculateStockAndBalance
    ) {
      await this.decrementStockQuantity(db);

      if (this.saleTxnSettingsData.updateRawMaterialsStock) {
        await this.decrementRawMaterialsStockQuantity();
      }
    }

    await this.linkPayment(db, this.saleDetails);

    if (
      !('calculateStockAndBalance' in this.saleDetails) ||
      !this.saleDetails.calculateStockAndBalance
    ) {
      await this.collectMoneyFromCustomerAccount();
    }

    /**
     * save into sales table
     */
    let InsertDoc = this.saleDetails;
    InsertDoc.item_list = this.items;

    let userAction = 'Save';

    if (this.isRestore) {
      userAction = 'Restore';
    }

    /**
     * updated date
     */
    InsertDoc.updatedAt = Date.now();

    // delete InsertDoc['linkPayment'];

    InsertDoc.order_type = 'pos';
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

    if (
      this.saleQuotationDetails.item_list &&
      this.saleQuotationDetails.item_list.length > 0
    ) {
      await this.closeSaleQuotation();
    }

    if (
      this.jobWorkInDetails.item_list &&
      this.jobWorkInDetails.item_list.length > 0
    ) {
      await this.closejobWorkIn();
      // check for workloss

      const saleWeightIn = parseFloat(InsertDoc.weightIn) || 0;
      const saleWeightOut = parseFloat(InsertDoc.weightOut) || 0;

      if (
        isNaN(saleWeightIn) ||
        isNaN(saleWeightOut) ||
        saleWeightIn !== saleWeightOut
      ) {
        await this.saveWorkLoss(this.jobWorkInDetails, InsertDoc);
      }
    }

    if (
      this.deliveryChallanDetails.item_list &&
      this.deliveryChallanDetails.item_list.length > 0
    ) {
      await this.closeDeliveryChallan();
      InsertDoc.convertedToDC = true;
    }

    if (
      this.saleOrderDetails.item_list &&
      this.saleOrderDetails.item_list.length > 0
    ) {
      await this.closeSaleOrder();
    }

    if (this.schemeOrderDetails && this.schemeOrderDetails.id !== '') {
      InsertDoc.schemeId = this.schemeOrderDetails.id;
      await this.closeScheme();
    }

    /**
     * save products to txn table
     */
    await productTxn.saveProductTxnFromSales(InsertDoc, db);

    if (this.saleTxnSettingsData.updateRawMaterialsStock) {
      await this.prepareRawMaterialProductList(InsertDoc);
    }

    await this.prepareAddOnProductList(InsertDoc);

    const receiptOrPayment = await allTxn.saveTxnFromSales(InsertDoc, db);

    InsertDoc.receiptOrPayment = receiptOrPayment;

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.invoice_number,
      InsertDoc.sequenceNumber,
      'Sale',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.invoice_date
    );

    if (this.isRestore) {
      await this.markSaleRestored();
    }

    // Linked fields safe checks

    if (InsertDoc.linked_amount === null || InsertDoc.linked_amount === '') {
      InsertDoc.linked_amount = 0;
    }

    if (
      InsertDoc.isPartiallyReturned === null ||
      InsertDoc.isPartiallyReturned === ''
    ) {
      InsertDoc.isPartiallyReturned = false;
    }

    if (
      InsertDoc.isFullyReturned === null ||
      InsertDoc.isFullyReturned === ''
    ) {
      InsertDoc.isFullyReturned = false;
    }

    if (InsertDoc.linkPayment === null || InsertDoc.linkPayment === '') {
      InsertDoc.linkPayment = false;
    }

    try {
      await db.sales.insert(InsertDoc).then(async (data) => {
        console.log('insertdata', data);
        if (this.autoPushEInvoice) {
          setTimeout(async () => {
            //create e invoice
            const eInvoiceResponse = await einvoice.createEinvoice(InsertDoc);

            if (eInvoiceResponse.success === true) {
              InsertDoc.einvoiceBillStatus =
                eInvoiceResponse.einvoiceBillStatus;
              InsertDoc.einvoiceDetails = eInvoiceResponse.einvoiceDetails;
              InsertDoc.einvoiceDate = eInvoiceResponse.einvoiceDate;
              InsertDoc.einvoiceBillGeneratedDate =
                eInvoiceResponse.einvoiceBillGeneratedDate;

              InsertDoc.ewayBillNo = eInvoiceResponse?.eWayBillNo ?? null;

              InsertDoc.irnNo = eInvoiceResponse.einvoiceDetails.irn;

              if (
                eInvoiceResponse.einvoiceDetails.irnNo === null ||
                eInvoiceResponse.einvoiceDetails.irnNo === ''
              ) {
                eInvoiceResponse.einvoiceDetails.irnNo =
                  eInvoiceResponse.einvoiceDetails.irn;
              }

              await this.updateEinvoiceDataToSales(InsertDoc, eInvoiceResponse);
            }
          }, 4000); // (4 seconds)
        }

        let cloudPrinterSettings =
          await deviceIdHelper.getCloudPrinterSettingsData();
        if (cloudPrinterSettings.enableMessageSend) {
          deviceIdHelper.submitPrintCommandToServer(
            InsertDoc.invoice_number,
            'Sales'
          );
        }

        if (
          this.sessionOrderDetails &&
          this.sessionOrderDetails.sessionGroupId !== ''
        ) {
          await this.updateSessionPaymentDetails(InsertDoc);
        }

        if (isPrint) {
          if (
            this.salesInvoiceThermal &&
            this.salesInvoiceThermal.boolDefault
          ) {
            sendContentForThermalPrinter(
              InsertDoc.customer_id,
              this.salesInvoiceThermal,
              InsertDoc,
              this.saleTxnSettingsData,
              'Sales'
            );
          }
        }

        if (
          this.salesInvoiceRegular &&
          this.salesInvoiceRegular.boolDefault &&
          isPrint
        ) {
          runInAction(async () => {
            if (InsertDoc.customer_id === '') {
              var data = {
                totalBalance: 0,
                balanceType: ''
              };

              this.printBalance = data;
              this.printData = InsertDoc;
            } else {
              this.printBalance = await balanceUpdate.getCustomerBalanceById(
                InsertDoc.customer_id
              );
              this.printData = InsertDoc;
            }
            this.closeDialogForSaveAndPrint();
            this.handleOpenPrintSelectionAlertMessage();
          });
        } else {
          if (InsertDoc.customer_id === '') {
            var balData = {
              totalBalance: 0,
              balanceType: ''
            };

            this.printBalance = balData;
            this.printData = InsertDoc;
          } else {
            this.printBalance = await balanceUpdate.getCustomerBalanceById(
              InsertDoc.customer_id
            );
            this.printData = InsertDoc;
          }

          this.isLaunchEWayAfterSaleCreation = isLaunchEWay;

          this.closeDialogForSaveAndPrint();
          this.handleCloseSaleLoadingMessage();
          runInAction(async () => {
            this.isSalesList = true;
            this.invoiceData = {};
          });
          this.resetAllData();
          this.closeDialog();
          // this.isSaveOrUpdateOrDeleteClicked = false;
          if (this.saveAndNew) {
            this.saveAndNew = false;
            this.openForNewSale();
          }
        }
      });
    } catch (err) {
      //save to audit
      await audit.addAuditEvent(
        InsertDoc.invoice_number,
        InsertDoc.sequenceNumber,
        'Sale',
        userAction,
        JSON.stringify(InsertDoc),
        err.message ? err.message : 'Sale Failed',
        InsertDoc.invoice_date
      );
      this.handleCloseSaleLoadingMessage();
      this.handleOpenSaleErrorAlertMessage(
        'Something went wrong while saving Sale. Please try again!!'
      );
    }
  };

  updateEinvoiceDataToSales = async (invoiceDetails, apiResponse) => {
    const db = await Db.get();

    if (
      apiResponse.einvoiceDetails.irnNo === null ||
      apiResponse.einvoiceDetails.irnNo === ''
    ) {
      apiResponse.einvoiceDetails.irnNo = apiResponse.einvoiceDetails.irn;
    }

    await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: invoiceDetails.businessId } },
            { invoice_number: { $eq: invoiceDetails.invoice_number } }
          ]
        }
      })
      .update({
        $set: {
          einvoiceBillStatus: apiResponse.einvoiceBillStatus,
          einvoiceDetails: apiResponse.einvoiceDetails,
          einvoiceDate: apiResponse.einvoiceDate,
          einvoiceBillGeneratedDate: apiResponse.einvoiceBillGeneratedDate,
          irnNo: apiResponse.einvoiceDetails.irn
        }
      })
      .then(async () => {
        console.log('update einvoice is completed');
      });
  };

  closejobWorkIn = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.jobworkin.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            job_work_in_invoice_number: {
              $eq: this.jobWorkInDetails.job_work_in_invoice_number
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

        await query
          .update({
            $set: {
              status: 'close',
              updatedAt: Date.now()
            }
          })
          .then(async () => {
            this.jobWorkInDetails = {};
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  saveWorkLoss = async (jobWorkInData, saleData) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let sale = {
      customerId: saleData.customer_id,
      customerName: saleData.customer_name,
      customerPhoneNumber: saleData.customer_phoneNo,
      invoiceNumber: saleData.invoice_number,
      sequenceNumber: saleData.sequenceNumber,
      invoiceDate: saleData.invoice_date,
      totalAmount: saleData.total_amount
    };

    let jobWorkIn = {
      customerId: jobWorkInData.customer_id,
      customerName: jobWorkInData.customer_name,
      customerPhoneNumber: jobWorkInData.customer_phoneNo,
      invoiceNumber: jobWorkInData.job_work_in_invoice_number,
      sequenceNumber: jobWorkInData.sequenceNumber,
      invoiceDate: jobWorkInData.invoice_date,
      totalAmount: jobWorkInData.total_amount
    };

    let insertDoc = {
      businessId: businessData.businessId,
      businessCity: businessData.businessCity,
      workLossId: await this.generateWorkLossId(),
      jobAssignedEmployeeId: jobWorkInData.jobAssignedEmployeeId,
      jobAssignedEmployeeName: jobWorkInData.jobAssignedEmployeeName,
      jobAssignedEmployeePhoneNumber:
        jobWorkInData.jobAssignedEmployeePhoneNumber,
      saleSequenceNumber: saleData.sequenceNumber,
      jobWorkSequenceNumber: jobWorkInData.sequenceNumber,
      jobWorkIn: jobWorkIn,
      invoiceDate: saleData.invoice_date,
      sale: sale,
      updatedAt: Date.now(),
      posId: parseFloat(businessData.posDeviceId),
      weightIn: parseFloat(saleData.weightIn) || 0,
      weightOut: parseFloat(saleData.weightOut) || 0,
      netWeightLoss: parseFloat(
        parseFloat(saleData.weightIn) - parseFloat(saleData.weightOut)
      ).toFixed(4)
    };

    await db.workloss
      .insert(insertDoc)
      .then(async (data) => {
        console.log('saved work loss data :' + data);

        //save to audit
        await audit.addAuditEvent(
          insertDoc.workLossId,
          '',
          'workloss',
          'save',
          JSON.stringify(insertDoc),
          '',
          insertDoc.sale.invoice_date
        );
      })
      .catch(async (err) => {
        console.log('saved work loss data error :' + err);

        //save to audit
        await audit.addAuditEvent(
          insertDoc.workLossId,
          '',
          'workloss',
          'save',
          JSON.stringify(insertDoc),
          err.message ? err.message : 'Work Loss Failed',
          insertDoc.sale.invoice_date
        );
      });
  };

  closeDeliveryChallan = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.deliverychallan.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            delivery_challan_invoice_number: {
              $eq: this.deliveryChallanDetails.delivery_challan_invoice_number
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

        await query
          .update({
            $set: {
              status: 'close',
              convertDCToSale: true,
              convertedFromSale: true,
              updatedAt: Date.now()
            }
          })
          .then(async () => {
            this.deliveryChallanDetails = {};
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  closeSaleQuotation = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.salesquotation.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { invoice_number: { $eq: this.saleQuotationDetails.invoice_number } }
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
              estimateType: 'close',
              convertQuotationToSale: true
            }
          })
          .then(async () => {
            this.saleQuotationDetails = {};
          });
      })
      .catch((err) => {
        console.log('Internal Server Error Delivery Challan', err);
      });
  };

  closeSaleOrder = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.saleorder.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            sale_order_invoice_number: {
              $eq: this.saleOrderDetails.sale_order_invoice_number
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
              saleOrderType: 'close',
              convertSOToSale: true
            }
          })
          .then(async () => {
            this.saleOrderDetails = {};
          });
      })
      .catch((err) => {
        console.log('Internal Server Error Sale Order', err);
      });
  };

  closeScheme = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.schememanagement.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            id: {
              $eq: this.schemeOrderDetails.id
            }
          }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Scheme data is not found so cannot update any information
          return;
        }

        await query
          .update({
            $set: {
              updatedAt: Date.now(),
              schemeOrderType: 'close'
            }
          })
          .then(async () => {
            this.schemeOrderDetails = {};
          });
      })
      .catch((err) => {
        console.log('Internal Server Error Sale Order', err);
      });
  };

  getSequenceNumber = async (date, id) => {
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      runInAction(() => {
        this.autoPushEInvoice = transSettings.autoPushEInvoice;
        this.invoiceData.appendYear = transSettings.sales.appendYear;
        this.invoiceData.multiDeviceBillingSupport =
          transSettings.multiDeviceBillingSupport;
      });
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      runInAction(() => {
        this.invoiceData.prefix = localStorage.getItem('deviceName');
        this.invoiceData.subPrefix = '';
      });
      isOnline = false;
    }

    this.saleDetails.sequenceNumber = await sequence.getFinalSequenceNumber(
      this.invoiceData,
      'Sales',
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
  };

  linkPayment = async (db) => {
    this.saleDetails.linkedTxnList = [];

    //call linkPayment function from linkPayment.js
    const txnList = await lp.linkPayment(
      db,
      this.saleDetails,
      this.paymentLinkTransactions,
      'Sales'
    );

    if (txnList) {
      txnList.forEach((txn) => this.saleDetails.linkedTxnList.push(txn));
    }
    this.paymentLinkTransactions = [];
  };

  unLinkPayment = async (db, saleDetails) => {
    await lp.unLinkPayment(db, saleDetails, 'Sales');

    saleDetails.linkedTxnList.forEach((item) => {
      this.saleUnLinkedTxnList.push(item);
    });
    /**
     * make used global variable to deafult values
     */
    this.paymentUnLinkTransactions = [];
  };

  decrementStockQuantity = async (db) => {
    //iterate over products
    this.items.forEach(async (element) => {
      //select only products with product id not the random products
      if (element.product_id && element.categoryLevel2) {
        //call update product stock
        await this.updateProductStock(
          db,
          element.product_id,
          element.qtyUnit && element.qtyUnit !== ''
            ? qtyUnitUtility.getQuantityByUnit(element)
            : element.qty || 0,
          element.qtyUnit && element.qtyUnit !== ''
            ? qtyUnitUtility.getFreeQuantityByUnit(element)
            : element.freeQty || 0,
          -1,
          element.batch_id // to handle batch count
        );
      }
    });
  };

  updateSaleInformation = async (isPrint, isLaunchEWay) => {
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
    /**
     * if sale is partially returned or fully returned then sale update is in valid
     */
    if (
      this.saleDetails.isFullyReturned ||
      this.saleDetails.isPartiallyReturned
    ) {
      alert('Partial/Full returned Sale is not eligible to Edit');

      return;
    }

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.sales.findOne({
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

        let putMoneyBackToCustomer = false;
        let putMoneyBackToCustomerAmount = 0;
        let getMoneyFromCustomer = false;
        let getMoneyFromCustomerAmount = 0;
        let unLinkPayment = false;
        let linkPayment = false;

        //1) new sale status is "Paid"
        if (
          !this.saleDetails.is_credit ||
          parseFloat(this.saleDetails.balance_amount) === 0
        ) {
          if (this.existingSaleData.linked_amount > 0) {
            putMoneyBackToCustomer = true;
            unLinkPayment = true;
          }

          if (parseFloat(this.existingSaleData.balance_amount) > 0) {
            putMoneyBackToCustomer = true;
          }

          if (putMoneyBackToCustomer) {
            putMoneyBackToCustomerAmount =
              this.existingSaleData.balance_amount +
              this.existingSaleData.linked_amount;
          }

          if (parseFloat(this.saleDetails.linked_amount) > 0) {
            getMoneyFromCustomer = true;
            linkPayment = true;
          }

          if (this.saleDetails.balance_amount > 0) {
            getMoneyFromCustomer = true;
          }

          if (getMoneyFromCustomer) {
            getMoneyFromCustomerAmount =
              parseFloat(this.saleDetails.balance_amount) +
                parseFloat(this.saleDetails.linked_amount) || 0;
          }
          //2)  status is Credit
        } else if (
          this.saleDetails.is_credit ||
          parseFloat(this.saleDetails.balance_amount) > 0 ||
          parseFloat(this.saleDetails.linked_amount) > 0
        ) {
          /**
           *
           * if previous txn type is credit then current can be credit/sale
           * both the cases rever the balances and link payment will do
           */

          if (this.existingSaleData.linked_amount > 0) {
            putMoneyBackToCustomer = true;
            unLinkPayment = true;
          }

          if (this.existingSaleData.balance_amount > 0) {
            putMoneyBackToCustomer = true;
          }

          if (putMoneyBackToCustomer) {
            putMoneyBackToCustomerAmount =
              parseFloat(this.existingSaleData.balance_amount) +
                parseFloat(this.existingSaleData.linked_amount) || 0;
          }

          if (parseFloat(this.saleDetails.linked_amount) > 0) {
            getMoneyFromCustomer = true;
            linkPayment = true;
          }

          if (this.saleDetails.balance_amount > 0) {
            getMoneyFromCustomer = true;
          }

          if (getMoneyFromCustomer) {
            getMoneyFromCustomerAmount =
              parseFloat(this.saleDetails.balance_amount) +
                parseFloat(this.saleDetails.linked_amount) || 0;
          }
        }
        if (getMoneyFromCustomer && putMoneyBackToCustomer) {
          const finalBalance =
            parseFloat(putMoneyBackToCustomerAmount) -
            parseFloat(getMoneyFromCustomerAmount);

          if (finalBalance < 0) {
            putMoneyBackToCustomer = false;
            getMoneyFromCustomerAmount = Math.abs(finalBalance);
          } else if (finalBalance > 0) {
            getMoneyFromCustomer = false;
            putMoneyBackToCustomerAmount = Math.abs(finalBalance);
          } else {
            getMoneyFromCustomer = false;
            putMoneyBackToCustomer = false;
          }
        }

        /**
         * clear old customer balance amount
         */
        if (
          putMoneyBackToCustomer &&
          (!('calculateStockAndBalance' in this.existingSaleData) ||
            !this.existingSaleData.calculateStockAndBalance)
        ) {
          await balanceUpdate.incrementBalance(
            db,
            this.existingSaleData.customer_id,
            // put back balance amount to customer
            parseFloat(putMoneyBackToCustomerAmount)
          );
        }

        /**
         * un-link old payments lanks
         */
        if (unLinkPayment) {
          await this.unLinkPayment(db, this.existingSaleData);
        }

        /**
         * link new payment amount
         */
        if (this.saleDetails.linked_amount > 0 && linkPayment) {
          await this.linkPayment(db, this.saleDetails);
        } else {
          this.saleDetails.linkedTxnList = [];
        }

        /**
         * add new balance to customer account
         */
        if (
          getMoneyFromCustomer &&
          (!('calculateStockAndBalance' in this.saleDetails) ||
            !this.saleDetails.calculateStockAndBalance)
        ) {
          const db = await Db.get();
          await balanceUpdate.decrementBalance(
            db,
            this.saleDetails.customer_id,
            getMoneyFromCustomerAmount
          );
        }

        /**
         *
         * For all types below are commans methods
         * add previous stock qty
         * remove current stock qty
         */
        /**
         * reset back old sale product stock
         */

        if (
          !('calculateStockAndBalance' in this.existingSaleData) ||
          !this.existingSaleData.calculateStockAndBalance
        ) {
          this.existingSaleData.item_list.forEach(async (i) => {
            await this.updateProductStock(
              db,
              i.product_id,
              i.qtyUnit && i.qtyUnit !== ''
                ? qtyUnitUtility.getQuantityByUnit(i)
                : i.qty || 0,
              i.qtyUnit && i.qtyUnit !== ''
                ? qtyUnitUtility.getFreeQuantityByUnit(i)
                : i.freeQty || 0,
              1,
              i.batch_id
            );
          });
        }

        /**
         * delete index field
         */
        this.items.forEach(async (item) => {
          delete item['index'];
        });
        /**
         * update new sale product stock
         */

        if (
          !('calculateStockAndBalance' in this.saleDetails) ||
          !this.saleDetails.calculateStockAndBalance
        ) {
          this.items.forEach(async (i) => {
            this.updateProductStock(
              db,
              i.product_id,
              parseFloat(
                i.qtyUnit && i.qtyUnit !== ''
                  ? qtyUnitUtility.getQuantityByUnit(i)
                  : i.qty || 0
              ),
              parseFloat(
                i.qtyUnit && i.qtyUnit !== ''
                  ? qtyUnitUtility.getFreeQuantityByUnit(i)
                  : i.freeQty || 0
              ),
              -1,
              i.batch_id
            );
          });

          if (this.saleTxnSettingsData.updateRawMaterialsStock) {
            await this.resetRawMaterialStockAndUpdateStockQuantity();
          }
        }

        /**
         * save to product txn table
         */
        let txnData = this.saleDetails;
        txnData.item_list = this.items;

        await productTxn.deleteAndSaveProductTxnFromSales(
          this.existingSaleData,
          txnData,
          db
        );

        if (this.saleTxnSettingsData.updateRawMaterialsStock) {
          await this.deleteAndSaveRawMaterials(txnData);
        }

        await this.deleteAndSaveAddOns(txnData);

        let updateData = this.saleDetails;

        updateData.updatedAt = Date.now();

        // Linked fields safe checks

        if (
          updateData.linked_amount === null ||
          updateData.linked_amount === ''
        ) {
          updateData.linked_amount = 0;
        }

        if (
          updateData.isPartiallyReturned === null ||
          updateData.isPartiallyReturned === ''
        ) {
          updateData.isPartiallyReturned = false;
        }

        if (
          updateData.isFullyReturned === null ||
          updateData.isFullyReturned === ''
        ) {
          updateData.isFullyReturned = false;
        }

        if (updateData.linkPayment === null || updateData.linkPayment === '') {
          updateData.linkPayment = false;
        }

        const seqParts = updateData.sequenceNumber.split('/');
        if (
          updateData.sequenceNumber.includes('/') &&
          seqParts &&
          seqParts.length > 0
        ) {
          const seqLastPart = seqParts[seqParts.length - 1];
          updateData.sortingNumber = parseFloat(seqLastPart);
        } else {
          if (numHelper.containsLettersAndNumbers(updateData.sequenceNumber)) {
            updateData.sortingNumber =
              numHelper.extractLastNumber(updateData.sequenceNumber) || 0;
          } else {
            updateData.sortingNumber = updateData.sequenceNumber;
          }
        }

        let auditData = {};

        auditData = { ...updateData };
        auditData.item_list = this.items;

        const receiptOrPayment = await allTxn.deleteAndSaveTxnFromSales(
          this.existingSaleData,
          txnData,
          db
        );

        updateData.receiptOrPayment = receiptOrPayment;

        audit.addAuditEvent(
          updateData.invoice_number,
          updateData.sequenceNumber,
          'Sale',
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
              let cloudPrinterSettings =
                await deviceIdHelper.getCloudPrinterSettingsData();
              if (cloudPrinterSettings.enableMessageSend) {
                deviceIdHelper.submitPrintCommandToServer(
                  auditData.invoice_number,
                  'Sales'
                );
              }

              if (isPrint) {
                if (
                  this.salesInvoiceThermal &&
                  this.salesInvoiceThermal.boolDefault
                ) {
                  sendContentForThermalPrinter(
                    auditData.customer_id,
                    this.salesInvoiceThermal,
                    auditData,
                    this.saleTxnSettingsData,
                    'Sales'
                  );
                }
              }

              if (this.isRestore) {
                await this.markSaleRestored();
              }

              if (
                this.salesInvoiceRegular &&
                this.salesInvoiceRegular.boolDefault &&
                isPrint
              ) {
                if (auditData.customer_id === '') {
                  var data = {
                    totalBalance: 0,
                    balanceType: ''
                  };

                  this.printBalance = data;
                  this.printData = auditData;
                } else {
                  this.printBalance =
                    await balanceUpdate.getCustomerBalanceById(
                      auditData.customer_id
                    );
                  this.printData = auditData;
                }
                this.closeDialogForSaveAndPrint();
                this.handleOpenPrintSelectionAlertMessage();
              } else {
                if (auditData.customer_id === '') {
                  var balData = {
                    totalBalance: 0,
                    balanceType: ''
                  };

                  this.printBalance = balData;
                  this.printData = auditData;
                } else {
                  this.printBalance =
                    await balanceUpdate.getCustomerBalanceById(
                      auditData.customer_id
                    );
                  this.printData = auditData;
                }

                this.isLaunchEWayAfterSaleCreation = isLaunchEWay;

                this.handleCloseSaleLoadingMessage();
                /**
                 * make global variables to nulls again
                 */
                this.resetAllData();
                this.saleUnLinkedTxnList = [];
                // this.isSaveOrUpdateOrDeleteClicked = false;

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
            'Sale',
            'Update',
            JSON.stringify(auditData),
            err.message,
            updateData.invoice_date
          );
          this.handleCloseSaleLoadingMessage();
          this.handleOpenSaleErrorAlertMessage(
            'Something went wrong while saving Sale. Please try again!!'
          );
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
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

    if (
      !('calculateStockAndBalance' in saleDetails) ||
      !saleDetails.calculateStockAndBalance
    ) {
      saleDetails.calculateStockAndBalance = true;
    }

    //save to audit
    audit.addAuditEvent(
      saleDetails.invoice_number,
      saleDetails.sequenceNumber,
      'Sale',
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
    DeleteDataDoc.transactionType = 'Sales';
    DeleteDataDoc.data = JSON.stringify(restoreSalesData);
    DeleteDataDoc.total = saleDetails.total_amount;
    DeleteDataDoc.balance = saleDetails.balance_amount;
    DeleteDataDoc.createdDate = saleDetails.invoice_date;

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.sales.findOne({
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
         * clear old customer balance amount
         */

        if (
          !('calculateStockAndBalance' in saleDetails) ||
          !saleDetails.calculateStockAndBalance
        ) {
          await balanceUpdate.incrementBalance(
            db,
            saleDetails.customer_id,
            parseFloat(saleDetails.balance_amount) +
              parseFloat(saleDetails.linked_amount)
          );
        }

        /**
         * un-link old payments lanks
         */
        if (saleDetails.linked_amount > 0) {
          await this.unLinkPayment(db, saleDetails);
        }

        /**
         * delete from product txn table
         */
        let txnData = saleDetails;
        txnData.item_list = this.items;

        await productTxn.deleteProductTxnFromSales(saleDetails, db);
        await allTxn.deleteTxnFromSales(saleDetails, db);

        if (this.saleTxnSettingsData.updateRawMaterialsStock) {
          await this.deleteRawMaterialTransactionsAndResetStock(saleDetails);
        }

        await this.deleteAddOns(saleDetails);

        /**
         * reset back old sale product stock
         */
        if (
          !('calculateStockAndBalance' in saleDetails) ||
          !saleDetails.calculateStockAndBalance
        ) {
          for (const i of this.items) {
            await this.updateProductStock(
              db,
              i.product_id,
              parseFloat(
                i.qtyUnit && i.qtyUnit !== ''
                  ? qtyUnitUtility.getQuantityByUnit(i)
                  : i.qty || 0
              ),
              parseFloat(
                i.qtyUnit && i.qtyUnit !== ''
                  ? qtyUnitUtility.getFreeQuantityByUnit(i)
                  : i.freeQty || 0
              ),
              1,
              i.batch_id
            );
          }
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
            alert('Error in Removing Data');
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        //save to audit
        audit.addAuditEvent(
          saleDetails.invoice_number,
          saleDetails.sequenceNumber,
          'Sale',
          'Delete',
          JSON.stringify(saleDetails),
          err.message,
          saleDetails.invoice_date
        );
      });
  };

  decrementRawMaterialsStockQuantity = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.items.forEach(async (element) => {
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
              await this.updateProductStock(
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

  prepareRawMaterialProductList = async (InsertDoc) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.items.forEach(async (element) => {
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

          if (this.saleTxnSettingsData.updateRawMaterialsStock) {
            await productTxn.saveRawMaterialProductTxn(
              InsertDoc,
              db,
              rawMaterialProductList,
              totalQty
            );
          }
        });
      }
    });
  };

  resetRawMaterialStockAndUpdateStockQuantity = async () => {
    /**
     *
     * For all types below are commans methods
     * add previous stock qty
     * remove current stock qty
     */
    /**
     * reset back old sale product stock
     */

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.existingSaleData.item_list.forEach(async (element) => {
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
          if (
            data &&
            data.rawMaterialData &&
            data.rawMaterialData.rawMaterialList
          ) {
            const rawMaterialProductList = Array.from(
              data.rawMaterialData.rawMaterialList
            );

            let totalQty =
              parseFloat(element.qty) + parseFloat(element.freeQty);

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
    });

    /**
     * update new sale product stock
     */

    this.items.forEach(async (element) => {
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
              await this.updateProductStock(
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

  deleteAndSaveRawMaterials = async (txnData) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.existingSaleData.item_list.forEach(async (element) => {
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
          if (data.rawMaterialData && data.rawMaterialData.rawMaterialList) {
            for (let item of data.rawMaterialData.rawMaterialList) {
              rawMaterialProductList.push(item);
            }

            await productTxn.deleteRawMaterialProductTxn(
              false,
              this.existingSaleData,
              db,
              rawMaterialProductList
            );
          }
        });
      }
    });

    this.items.forEach(async (element) => {
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

          if (this.saleTxnSettingsData.updateRawMaterialsStock) {
            await productTxn.saveRawMaterialProductTxn(
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

  deleteRawMaterialTransactionsAndResetStock = async (txnData) => {
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
          if (
            data &&
            data.rawMaterialData &&
            data.rawMaterialData.rawMaterialList
          ) {
            const rawMaterialProductList = Array.from(
              data.rawMaterialData.rawMaterialList
            );

            let totalQty =
              parseFloat(element.qty) + parseFloat(element.freeQty);

            await productTxn.deleteRawMaterialProductTxn(
              false,
              txnData,
              db,
              rawMaterialProductList
            );

            if (
              !('calculateStockAndBalance' in txnData) ||
              !txnData.calculateStockAndBalance
            ) {
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
          }
        });
      }
    });
  };

  prepareAddOnProductList = async (InsertDoc) => {
    const db = await Db.get();

    this.items.forEach(async (element) => {
      if (
        element.product_id &&
        element.addOnProperties &&
        element.addOnProperties.length > 0
      ) {
        await productTxn.saveAddOnProductTxn(
          InsertDoc,
          db,
          element.addOnProperties,
          element.qty
        );
      }
    });
  };

  deleteAndSaveAddOns = async (txnData) => {
    const db = await Db.get();

    this.existingSaleData.item_list.forEach(async (element) => {
      if (
        element.product_id &&
        element.addOnProperties &&
        element.addOnProperties.length > 0
      ) {
        await productTxn.deleteAddOnProductTxn(
          this.existingSaleData,
          db,
          element.addOnProperties,
          element.qty
        );
      }
    });

    this.items.forEach(async (element) => {
      if (
        element.product_id &&
        element.addOnProperties &&
        element.addOnProperties.length > 0
      ) {
        await productTxn.saveAddOnProductTxn(
          txnData,
          db,
          element.addOnProperties,
          element.qty
        );
      }
    });
  };

  deleteAddOns = async (txnData) => {
    const db = await Db.get();

    txnData.item_list.forEach(async (element) => {
      if (
        element.product_id &&
        element.addOnProperties &&
        element.addOnProperties.length > 0
      ) {
        await productTxn.saveAddOnProductTxn(
          txnData,
          db,
          element.addOnProperties,
          element.qty
        );
      }
    });
  };

  updateProductStock = async (
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

  collectMoneyFromCustomerAccount = async () => {
    let amount =
      parseFloat(this.saleDetails.linked_amount) +
      parseFloat(this.saleDetails.balance_amount);

    if (this.saleDetails.is_credit || parseFloat(amount) > 0) {
      const db = await Db.get();
      await balanceUpdate.decrementBalance(
        db,
        this.saleDetails.customer_id,
        amount
      );
    }
  };

  getCustomerDataOnConvertion = async (partyId) => {
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
    let balance = 0;

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
          balance = data.balance;
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
      aadharNumber: aadharNumber,
      balance: balance
    };

    return data;
  };

  addNewItem = (status, focusIndexStatus, isBarcode) => {
    if (status) {
      this.addNewRowEnabled = true;
    }
    var lastItem = [];

    if (this.items.length > 0) {
      lastItem = this.items[this.items.length - 1]; // Getting last element
      if (lastItem.qty > 0) {
        this.items.push(new SalesItem().defaultValues());
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
      this.items.push(new SalesItem().defaultValues());
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

  setFileUploadImageUrls = (file) => {
    runInAction(() => {
      this.saleDetails.imageUrls = file;
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

  setItemModelNo = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].modelNo = value;
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

  setNotes = (value) => {
    this.saleDetails.notes = value;
  };

  setTerms = (value) => {
    this.saleDetails.terms = value;
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

      let result = this.saleDetails.rateList.find(
        (e) => e.metal === rateValue.metal
      );

      if (!result) {
        this.saleDetails.rateList.push(rateValue);
      }
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
    let result = this.saleDetails.rateList.find(
      (e) => e.metal === rateValue.metal
    );

    if (!result) {
      this.saleDetails.rateList.push(rateValue);
    }
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
      this.items[index].originalMrpWithoutConversionQty = value
        ? parseFloat(value)
        : '';
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
              this.items[index].freeStockQty = actualProduct.freeQty;
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
              this.items[index].serialOrImeiNo = actualProduct.serialOrImeiNo;

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

  setRoundOff = (value) => {
    this.saleDetails.is_roundoff = value;
  };

  setQuantity = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    if (parseFloat(value) > 0) {
      // console.log(this.items[index]);
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
      this.saleDetails.packingChargeOtherCurrency =
        this.populateOtherCurrencyValue(this.saleDetails.packing_charge);
    });
  };

  setPackingTax = (value) => {
    runInAction(() => {
      this.packingTax = value ? parseFloat(value) : '';
    });
  };

  setShippingCharge = (value) => {
    runInAction(() => {
      this.saleDetails.shipping_charge = value ? parseFloat(value) : '';
      this.saleDetails.shippingChargeOtherCurrency =
        this.populateOtherCurrencyValue(this.saleDetails.shipping_charge);
    });
  };

  setShippingTax = (value) => {
    runInAction(() => {
      this.shippingTax = value ? parseFloat(value) : '';
    });
  };

  calculateTaxAndDiscountValue = async (index) => {
    let mrp = 0;
    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      mrp = parseFloat(this.items[index].mrp || 0);
    } else {
      mrp = parseFloat(this.items[index].mrp || 0);
    }
    const quantity = parseFloat(this.items[index].qty) || 1;
    const offerPrice = parseFloat(this.items[index].offer_price || 0);

    let tax =
      (parseFloat(this.items[index].cgst) || 0) +
      (parseFloat(this.items[index].sgst) || 0);
    let igst_tax = parseFloat(this.items[index].igst || 0);

    const taxIncluded = this.items[index].taxIncluded;

    /* if (!mrp || mrp === 0 || !quantity || quantity === 0) {
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

    // To add Other Currency Final Amount
    this.items[index].amountOtherCurrency = this.populateOtherCurrencyValue(
      this.items[index].amount
    );
    this.items[index].mrpOtherCurrency = this.populateOtherCurrencyValue(
      this.items[index].mrp
    );

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

  setBankAccountData = (value, typeChosen) => {
    if (value.accountDisplayName && value.id) {
      runInAction(() => {
        this.saleDetails.payment_type = typeChosen;
        this.saleDetails.bankAccount = value.accountDisplayName;
        this.saleDetails.bankAccountId = value.id;
      });
    }
  };

  setCreditData = (value) => {
    this.saleDetails.is_credit = value;

    if (!this.saleDetails.is_credit) {
      runInAction(() => {
        this.saleDetails.balance_amount = 0;
      });
      this.resetLinkPayment();
      this.saleDetails.dueDate = null;
    }
  };

  setInvoiceDate = (value) => {
    runInAction(() => {
      this.saleDetails.invoice_date = value;
    });
  };

  setDueDate = (value) => {
    runInAction(() => {
      this.saleDetails.dueDate = value;
    });
  };

  setTCS = (value) => {
    runInAction(() => {
      this.saleDetails.tcsName = value.name;
      this.saleDetails.tcsRate = value.rate;
      this.saleDetails.tcsCode = value.code;
    });
  };

  revertTCS = () => {
    runInAction(() => {
      this.saleDetails.tcsName = '';
      this.saleDetails.tcsRate = 0;
      this.saleDetails.tcsAmount = 0;
      this.saleDetails.tcsCode = '';
    });
  };

  setTDS = (value) => {
    runInAction(() => {
      this.saleDetails.tdsName = value.name;
      this.saleDetails.tdsRate = value.rate;
      this.saleDetails.tdsCode = value.code;
    });
  };

  revertTDS = () => {
    runInAction(() => {
      this.saleDetails.tdsName = '';
      this.saleDetails.tdsRate = 0;
      this.saleDetails.tdsAmount = 0;
      this.saleDetails.tdsCode = '';
    });
  };

  setInoicePrefix = (value) => {
    runInAction(() => {
      this.invoiceData.prefix = value;
      this.saleDetails.prefix = value;
    });
  };

  setInvoiceSubPrefix = (value) => {
    runInAction(() => {
      this.invoiceData.subPrefix = value;
      this.saleDetails.subPrefix = value;
    });
  };

  setInvoiceDatePrefix = (value) => {
    runInAction(() => {
      this.invoiceData.datePrefix = value;
    });
  };

  get getBalanceData() {
    let balance = 0;
    if (this.saleDetails.is_credit) {
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
        : parseFloat(this.saleDetails.linked_amount);

      balance =
        parseFloat(total_amount) -
        // parseFloat(received_amount || 0) -
        parseFloat(linked_amount);

      // console.log('balance::', balance);
    }
    runInAction(() => {
      this.saleDetails.balance_amount = parseFloat(balance);
    });
    return balance;
  }

  // get getInvoice() {
  //   return parseFloat(this.saleDetails.received_amount) || 0;
  // }

  setCustomerName = (value) => {
    runInAction(() => {
      this.saleDetails.customer_name = value;
    });
  };

  setCustomerId = (value) => {
    runInAction(() => {
      this.saleDetails.customer_id = value;
    });
  };

  setCustomer = async (customer, isNewCustomer) => {
    /**
     * get customer txn which are un used
     */
    const db = await Db.get();

    lp.getAllUnPaidTxnForCustomer(this, db, customer.id, 'Sales');

    runInAction(() => {
      this.saleDetails.customer_id = customer.id;
      this.saleDetails.customer_name = customer.name;
      this.saleDetails.customerGSTNo = customer.gstNumber;
      this.saleDetails.customerGstType = customer.gstType;
      this.saleDetails.aadharNumber = customer.aadharNumber;
      this.customerCreditDays = customer.creditLimitDays;
    });

    if (this.saleTxnSettingsData.enableTCS === true) {
      runInAction(() => {
        this.saleDetails.tcsName = customer.tcsName;
        this.saleDetails.tcsRate = customer.tcsRate;
        this.saleDetails.tcsCode = customer.tcsCode;
      });
    }

    if (this.saleTxnSettingsData.enableTDS === true) {
      runInAction(() => {
        this.saleDetails.tdsName = customer.tdsName;
        this.saleDetails.tdsRate = customer.tdsRate;
        this.saleDetails.tdsCode = customer.tdsCode;
      });
    }

    runInAction(() => {
      this.saleDetails.customer_id = customer.id;
      this.saleDetails.customer_emailId = customer.emailId;
      this.saleDetails.customerLegalName = customer.legalName;
      this.saleDetails.customerRegistrationNumber = customer.registrationNumber;
      this.saleDetails.customerPanNumber = customer.panNumber;
      this.saleDetails.customer_phoneNo = customer.phoneNo;

      this.saleDetails.customer_address = customer.address;
      this.saleDetails.customer_pincode = customer.pincode;
      this.saleDetails.customer_city = customer.city;
      this.saleDetails.customerState = customer.state;
      this.saleDetails.customerCountry = customer.country;
      this.saleDetails.customerTradeName = customer.tradeName;
    });

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

      runInAction(() => {
        this.customerAddressList.push(uiAddress);
      });

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

        runInAction(() => {
          this.customerAddressList.push(uiAddress);
        });
      }

      runInAction(() => {
        this.customerAddressType = 'Bill To';
      });
      this.handleOpenAddressList();
      return;
    }

    runInAction(() => {
      this.isNewCustomer = isNewCustomer;
      if (isNewCustomer) {
        this.newCustomerData = customer;
      }
    });
  };

  setShipToCustomer = async (customer) => {
    if (customer != null) {
      runInAction(() => {
        this.saleDetails.shipToCustomerName = customer.name;
        this.saleDetails.shipToCustomerId = customer.id;
        this.saleDetails.shipToCustomerEmailId = customer.emailId;
        this.saleDetails.shipToCustomerGSTNo = customer.gstNumber;
        this.saleDetails.shipToCustomerGstType = customer.gstType;
        this.saleDetails.shipToCustomerPhoneNo = customer.phoneNo;
        this.saleDetails.shipToCustomerLegalName = customer.legalName;
        this.saleDetails.shipToCustomerRegistrationNumber =
          customer.registrationNumber;
        this.saleDetails.shipToCustomerPanNumber = customer.panNumber;

        this.saleDetails.shipToCustomerAddress = customer.shippingAddress;
        this.saleDetails.shipToCustomerPincode = customer.shippingPincode;
        this.saleDetails.shipToCustomerCity = customer.shippingCity;
        this.saleDetails.shipToCustomerState = customer.shippingState;
        this.saleDetails.shipToCustomerCountry = customer.shippingCountry;
        this.saleDetails.shipToCustomerTradeName = customer.tradeName;
      });

      if (
        customer &&
        customer.additionalAddressList &&
        customer.additionalAddressList.length > 0
      ) {
        runInAction(() => {
          this.customerAddressList = [];
        });

        let hasSecShipping = false;
        for (let secAddr of customer.additionalAddressList) {
          if (secAddr.shippingAddress !== '') {
            hasSecShipping = true;
            break;
          }
        }

        if (hasSecShipping === false) {
          return;
        }

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
        uiAddress.address = customer.shippingAddress;
        uiAddress.pincode = customer.shippingPincode;
        uiAddress.city = customer.shippingCity;
        uiAddress.state = customer.shippingState;
        uiAddress.country = customer.shippingCountry;
        uiAddress.placeOfSupply = customer.shippingState;

        runInAction(() => {
          this.customerAddressList.push(uiAddress);
        });

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
          uiAddress.address = secAddr.shippingAddress;
          uiAddress.pincode = secAddr.shippingPincode;
          uiAddress.city = secAddr.shippingCity;
          uiAddress.state = secAddr.shippingState;
          uiAddress.country = secAddr.shippingCountry;
          uiAddress.placeOfSupply = secAddr.shippingState;

          runInAction(() => {
            this.customerAddressList.push(uiAddress);
          });
        }

        runInAction(() => {
          this.customerAddressType = 'Ship To';
        });
        this.handleOpenAddressList();
        return;
      }
    } else {
      runInAction(() => {
        this.saleDetails.shipToCustomerName = '';
        this.saleDetails.shipToCustomerId = '';
        this.saleDetails.shipToCustomerAddress = '';
        this.saleDetails.shipToCustomerPhoneNo = '';
        this.saleDetails.shipToCustomerPincode = '';
        this.saleDetails.shipToCustomerCity = '';
        this.saleDetails.shipToCustomerEmailId = '';
        this.saleDetails.shipToCustomerGSTNo = '';
        this.saleDetails.shipToCustomerGstType = '';
        this.saleDetails.shipToCustomerState = '';
        this.saleDetails.shipToCustomerCountry = '';
        this.saleDetails.shipToCustomerTradeName = '';
        this.saleDetails.shipToCustomerLegalName = '';
        this.saleDetails.shipToCustomerRegistrationNumber = '';
        this.saleDetails.shipToCustomerPanNumber = '';
      });
    }
  };

  resetShipToCustomer = () => {
    runInAction(() => {
      this.saleDetails.shipToCustomerName = '';
      this.saleDetails.shipToCustomerId = '';
      this.saleDetails.shipToCustomerAddress = '';
      this.saleDetails.shipToCustomerPhoneNo = '';
      this.saleDetails.shipToCustomerPincode = '';
      this.saleDetails.shipToCustomerCity = '';
      this.saleDetails.shipToCustomerEmailId = '';
      this.saleDetails.shipToCustomerGSTNo = '';
      this.saleDetails.shipToCustomerGstType = '';
      this.saleDetails.shipToCustomerState = '';
      this.saleDetails.shipToCustomerCountry = '';
      this.saleDetails.shipToCustomerTradeName = '';
      this.saleDetails.shipToCustomerLegalName = '';
      this.saleDetails.shipToCustomerRegistrationNumber = '';
      this.saleDetails.shipToCustomerPanNumber = '';
    });
  };

  setBuyerOtherThanConsignee = async (customer) => {
    runInAction(() => {
      if (this.saleDetails.buyerOtherBillTo === undefined) {
        this.saleDetails.buyerOtherBillTo = {
          id: '',
          phoneNo: '',
          name: '',
          address: '',
          pincode: '',
          city: '',
          state: '',
          country: '',
          email: '',
          gstNo: '',
          gstType: '',
          pan: '',
          aadhar: '',
          tradeName: '',
          legalName: '',
          regNo: ''
        };
      }

      this.saleDetails.buyerOtherBillTo.id = customer.id;
      this.saleDetails.buyerOtherBillTo.phoneNo = customer.phoneNo;
      this.saleDetails.buyerOtherBillTo.name = customer.name;
      this.saleDetails.buyerOtherBillTo.address = customer.address;
      this.saleDetails.buyerOtherBillTo.pincode = customer.pincode;
      this.saleDetails.buyerOtherBillTo.city = customer.city;
      this.saleDetails.buyerOtherBillTo.state = customer.state;
      this.saleDetails.buyerOtherBillTo.country = customer.country;
      this.saleDetails.buyerOtherBillTo.email = customer.emailId;
      this.saleDetails.buyerOtherBillTo.gstNo = customer.gstNumber;
      this.saleDetails.buyerOtherBillTo.gstType = customer.gstType;
      this.saleDetails.buyerOtherBillTo.pan = customer.panNumber;
      this.saleDetails.buyerOtherBillTo.aadhar = customer.aadharNumber;
      this.saleDetails.buyerOtherBillTo.tradeName = customer.tradeName;
      this.saleDetails.buyerOtherBillTo.legalName = customer.legalName;
      this.saleDetails.buyerOtherBillTo.regNo = customer.registrationNumber;
    });
  };

  resetBuyerOtherThanConsignee = () => {
    runInAction(() => {
      this.saleDetails.buyerOtherBillTo = {
        id: '',
        phoneNo: '',
        name: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
        email: '',
        gstNo: '',
        gstType: '',
        pan: '',
        aadhar: '',
        tradeName: '',
        legalName: '',
        regNo: ''
      };
    });
  };

  selectAddressFromCustomer = (selectedIndex) => {
    if (selectedIndex !== -1 && this.customerAddressType === 'Bill To') {
      runInAction(() => {
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
        this.saleDetails.customerTradeName =
          this.customerAddressList[selectedIndex].tradeName;
        if (this.customerAddressList[selectedIndex].state) {
          let result = getStateList().find(
            (e) => e.name === this.customerAddressList[selectedIndex].state
          );
          if (result) {
            this.setPlaceOfSupply(result.val);
            this.setPlaceOfSupplyName(result.name);
            this.setPlaceOfSupplyState(
              this.customerAddressList[selectedIndex].state
            );
          }
        }
      });
    } else if (selectedIndex !== -1 && this.customerAddressType === 'Ship To') {
      runInAction(() => {
        this.saleDetails.shipToCustomerAddress =
          this.customerAddressList[selectedIndex].address;
        this.saleDetails.shipToCustomerPincode =
          this.customerAddressList[selectedIndex].pincode;
        this.saleDetails.shipToCustomerCity =
          this.customerAddressList[selectedIndex].city;
        this.saleDetails.shipToCustomerState =
          this.customerAddressList[selectedIndex].state;
        this.saleDetails.shipToCustomerCountry =
          this.customerAddressList[selectedIndex].country;
        this.saleDetails.customerTradeName =
          this.customerAddressList[selectedIndex].tradeName;
      });
    } else if (
      selectedIndex !== -1 &&
      this.customerAddressType === 'Other Bill To'
    ) {
      runInAction(() => {
        this.saleDetails.buyerOtherBillTo.address =
          this.customerAddressList[selectedIndex].address;
        this.saleDetails.buyerOtherBillTo.pincode =
          this.customerAddressList[selectedIndex].pincode;
        this.saleDetails.buyerOtherBillTo.city =
          this.customerAddressList[selectedIndex].city;
        this.saleDetails.buyerOtherBillTo.state =
          this.customerAddressList[selectedIndex].state;
        this.saleDetails.buyerOtherBillTo.country =
          this.customerAddressList[selectedIndex].country;
        this.saleDetails.buyerOtherBillTo.tradeName =
          this.customerAddressList[selectedIndex].tradeName;
      });
    }

    this.handleCloseAddressList();

    runInAction(() => {
      this.customerAddressType = '';
      this.customerAddressList = [];
    });
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
      this.saleDetails.customerTradeName = '';
      this.saleDetails.customerLegalName = '';
      this.saleDetails.customerRegistrationNumber = '';
      this.saleDetails.customerPanNumber = '';
      this.saleDetails.tcsName = '';
      this.saleDetails.tcsRate = '';
      this.saleDetails.tcsCode = '';
      this.saleDetails.tdsName = '';
      this.saleDetails.tdsRate = '';
      this.saleDetails.tdsCode = '';
      this.saleDetails.aadharNumber = '';
    });
  };

  setCustomerState = (value) => {
    runInAction(() => {
      this.saleDetails.customerState = value;
    });
  };

  setCustomerCountry = (value) => {
    runInAction(() => {
      this.saleDetails.customerCountry = value;
    });
  };

  setShipToCustomerName = (value) => {
    runInAction(() => {
      this.saleDetails.shipToCustomerName = value;
    });
  };

  deleteSaleItem = async (item) => {
    item = new Sales().convertTypes(JSON.parse(JSON.stringify(item)));
    this.items = item.item_list;
    const saleDetails = new Sales().convertTypes(item);
    this.saleDetails = saleDetails;

    this.deleteData(saleDetails, item.employeeId);
  };

  viewOrEditItem = async (item) => {
    console.log('viewOrEditItem::', JSON.stringify(item, null, 2));

    await this.initializeSettings();

    runInAction(() => {
      if (item.shippingTax?.sgst !== 0) {
        this.shippingTax =
          parseFloat(item.shippingTax?.sgst) +
          parseFloat(item.shippingTax?.cgst);
      } else if (item.shippingTax?.igst !== 0) {
        this.shippingTax = item.shippingTax.igst;
      }

      if (item.packingTax?.sgst !== 0) {
        this.packingTax =
          parseFloat(item.packingTax?.sgst) + parseFloat(item.packingTax?.cgst);
      } else if (item.packingTax?.igst !== 0) {
        this.packingTax = item.packingTax.igst;
      }

      if (item.insurance?.sgst !== 0) {
        this.insuranceTax =
          parseFloat(item.insurance?.sgst) + parseFloat(item.insurance?.cgst);
      } else if (item.insurance?.igst !== 0) {
        this.insuranceTax = item.insurance.igst;
      }
    });

    runInAction(() => {
      this.isUpdate = true;
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.existingSaleData = item;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.isLocked = false;
      this.invoiceData = {};
      this.productAddOnsData = [];
      this.setNotPerformAmendement(false);
    });

    const saleDetails = new Sales().convertTypes(
      JSON.parse(JSON.stringify(item))
    );

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
      runInAction(() => {
        this.items = item.item_list;
      });
    }

    if (this.items && this.items.length > 0) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      let index = 0;
      this.items.forEach(async (element) => {
        if (this.productAddOnsData[index] === undefined) {
          this.productAddOnsData[index] = [];
        }
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
            if (data && data.additional_property_group_list) {
              for (let prodAddOn of data.additional_property_group_list) {
                const addOn = {
                  groupId: prodAddOn.groupId,
                  name: prodAddOn.name,
                  min_choices: prodAddOn.min_choices,
                  max_choices: prodAddOn.max_choices,
                  additional_property_list:
                    this.getSaleItemAdditionalPropertiesList(
                      prodAddOn.additional_property_list
                    )
                };

                if (this.productAddOnsData[index] === undefined) {
                  this.productAddOnsData[index] = [];
                }
                this.productAddOnsData[index].push(addOn);
              }
            }
            index++;
          });
        } else {
          this.productAddOnsData[index] = [];
          index++;
        }
      });
    }

    console.log('this.productAddOnsData', this.productAddOnsData);

    runInAction(() => {
      this.saleDetails = saleDetails;
    });

    await this.isSaleLockedForEdit();
    await this.checkForTaxAndLoadUI();

    if (this.saleDetails.splitPaymentList === undefined) {
      runInAction(() => {
        this.saleDetails.splitPaymentList = [];
      });
    }

    runInAction(() => {
      if (this.saleDetails.payment_type === 'Split') {
        this.chosenPaymentType = 'Split';
      } else {
        this.chosenPaymentType = 'Cash';
      }

      if (this.saleDetails.insurance) {
        this.insurance = this.saleDetails.insurance;
      }
    });

    // /**
    //  * get customer txn which are un used
    //  */
    const db = await Db.get();

    if (this.existingSaleData.linked_amount > 0) {
      this.saleDetails.linkPayment = true;
      await lp.getAllLinkedTxnData(this, this.existingSaleData, 'Sales');
    }

    if (item.customer_id !== '' && item.customer_id.length > 2) {
      await lp.getAllUnPaidTxnForCustomer(this, db, item.customer_id, 'Sales');
    }

    runInAction(() => {
      this.previousBalanceAmount = this.saleDetails.linked_amount;
      this.previousCreditFlag = this.saleDetails.is_credit;

      this.openAddSalesInvoice = true;
    });
  };

  closeDialog = () => {
    runInAction(() => {
      this.openAddSalesInvoice = false;
      this.enabledRow = 0;
    });
  };

  closeDialogForSaveAndPrint = () => {
    this.handleCloseSaleLoadingMessage();
    if (this.isUpdate) {
      this.resetAllData();
      this.saleUnLinkedTxnList = [];

      this.closeDialog();
      if (this.saveAndNew) {
        this.saveAndNew = false;
        this.openForNewSale();
      }

      runInAction(async () => {
        this.isSalesList = true;
      });
    } else {
      runInAction(async () => {
        this.isSalesList = true;
        this.invoiceData = {};
      });

      this.resetAllData();
      this.closeDialog();
      // this.isSaveOrUpdateOrDeleteClicked = false;
      if (this.saveAndNew) {
        this.saveAndNew = false;
        this.openForNewSale();
      }
    }
  };

  openForNewSale = async () => {
    await this.initializeData();
    this.saleDetails = new Sales().defaultValues();
    this.items = [new SalesItem().defaultValues()];
    await this.checkForTaxAndLoadUI();
    runInAction(() => {
      this.openAddSalesInvoice = true;
    });
  };

  handleInvoiceNumModalClose = async () => {
    runInAction(() => {
      this.openInvoiceNumModal = false;
      this.isSequenceNuberExist = false;
      this.manualSequenceNumber = '';
    });
  };

  getCurrentInvoiceNumber = async () => {
    let sequenceNumber = 1;
    if (this.invoiceData && this.invoiceData.prefix) {
      sequenceNumber = await sequence.getLastSequenceNumber(
        'Sales',
        this.invoiceData.prefix
      );
    }

    runInAction(() => {
      this.invoiceData.sequenceNumber = sequenceNumber;
    });
  };

  handleInvoiceNumModalOpen = async () => {
    runInAction(async () => {
      this.openInvoiceNumModal = true;
    });
  };

  handleInvNumDubCheckClose = async () => {
    runInAction(() => {
      this.openInvNumDubCheck = false;
    });
  };

  handleInvNumDubCheckOpen = async () => {
    runInAction(() => {
      this.openInvNumDubCheck = true;
    });
  };

  checkSaleSequenceNumber = async () => {
    //check id this sequence number exist or not
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    this.isSequenceNuberExist = false;
    await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { sequenceNumber: { $eq: this.manualSequenceNumber } },
            {
              invoice_date: {
                $gte: dateHelper.getFinancialYearStartDateByGivenDate(
                  this.saleDetails.invoice_date
                )
              }
            },
            {
              invoice_date: {
                $lte: dateHelper.getFinancialYearEndDateByGivenDate(
                  this.saleDetails.invoice_date
                )
              }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data && data.invoice_number) {
          this.isSequenceNuberExist = true;
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    if (this.isSequenceNuberExist) {
      this.handleInvNumDubCheckOpen();
    } else {
      runInAction(() => {
        if (!this.isSequenceNuberExist && this.manualSequenceNumber !== '') {
          if (
            this.saleDetails.prefix !== '##' &&
            this.saleDetails.prefix !== '' &&
            this.saleDetails.prefix !== undefined
          ) {
            this.saleDetails.sequenceNumber =
              this.saleDetails.prefix + '/' + this.manualSequenceNumber;
          } else if (
            this.saleDetails.prefix !== '##' &&
            this.saleDetails.prefix !== '' &&
            this.saleDetails.prefix !== undefined &&
            this.saleDetails.subPrefix !== '##' &&
            this.saleDetails.subPrefix !== '' &&
            this.saleDetails.subPrefix !== undefined
          ) {
            this.saleDetails.sequenceNumber =
              this.saleDetails.prefix +
              '/' +
              this.saleDetails.subPrefix +
              '/' +
              this.manualSequenceNumber;
          } else {
            this.saleDetails.sequenceNumber = this.manualSequenceNumber;
          }

          const seqParts = this.saleDetails.sequenceNumber.split('/');
          if (seqParts && seqParts.length > 0) {
            const seqLastPart = seqParts[seqParts.length - 1];
            this.saleDetails.sortingNumber = parseFloat(seqLastPart);
          } else {
            this.saleDetails.sortingNumber = this.saleDetails.sequenceNumber;
          }
        }
        this.openInvoiceNumModal = false;
        this.isSequenceNuberExist = false;
        this.manualSequenceNumber = '';
      });
    }
  };

  setSaleSequenceNumber = async (value) => {
    runInAction(() => {
      this.saleDetails.sequenceNumber = value;
    });
  };

  setSaleManualEditSequenceNumber = (value) => {
    runInAction(() => {
      this.manualSequenceNumber = value;
    });
  };

  handleInvNumDubCheckOpen = async () => {
    runInAction(() => {
      this.openInvNumDubCheck = true;
    });
  };

  handleBatchListModalClose = (val) => {
    runInAction(() => {
      this.OpenBatchList = false;
      if (val) {
        this.items[this.selectedIndex].mrp = parseFloat(val.salePrice);

        this.items[this.selectedIndex].stockQty = val.qty;

        if (val.offerPrice > 0) {
          this.items[this.selectedIndex].offer_price = parseFloat(
            val.offerPrice
          );
        } else {
          this.items[this.selectedIndex].offer_price = parseFloat(
            val.salePrice
          );
        }

        this.items[this.selectedIndex].vendorName = val.vendorName;
        this.items[this.selectedIndex].vendorPhoneNumber =
          val.vendorPhoneNumber;
      }
      this.selectedProduct = {};
    });
  };

  handleSerialListModalClose = (val) => {
    runInAction(() => {
      this.OpenSerialList = false;
      // if (val) {
      //   this.items[this.selectedIndex].mrp = parseFloat(val.salePrice);
      // }
      this.selectedProduct = {};
    });
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
    this.items[index] = new SalesItem().defaultValues();
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
      this.selectedProduct.description = item.description;
      this.selectedProduct.imageUrl = item.imageUrl;
      this.selectedProduct.taxIncluded = item.taxIncluded;
      this.selectedProduct.taxType = item.taxType;
      this.selectedProduct.stockQty = item.stockQty;
      this.selectedProduct.freeStockQty = item.freeQty;
      this.selectedProduct.batchData = item.batchData;
      this.selectedProduct.serialData = item.serialData;
      this.selectedProduct.vendorName = item.vendorName;
      this.selectedProduct.vendorPhoneNumber = item.vendorPhoneNumber;
      this.selectedProduct.categoryLevel2 = item.categoryLevel2;
      this.selectedProduct.categoryLevel3 = item.categoryLevel3;
      this.selectedProduct.brandName = item.brandName;
      this.selectedProduct.hsn = item.hsn;
      this.selectedProduct.serialOrImeiNo = item.serialOrImeiNo;

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
    if (!productItem) {
      return;
    }
    const {
      name,
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
      description,
      imageUrl,
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
      serialOrImeiNo,
      finalMRPPrice,
      saleDiscountPercent,
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
      certificationCharge,
      warrantyDays,
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

    // adding same product to sales
    let existingSaleProduct;
    if (!(batchData.length > 1 || serialData.length > 1)) {
      existingSaleProduct = this.items.find((product, index) =>
        this.findProduct(product, index, productItem)
      );
    }

    if (existingSaleProduct) {
      if (
        this.saleTxnSettingsData &&
        this.saleTxnSettingsData.enableNegativeStockAlert &&
        stockQty <= 0
      ) {
        runInAction(() => {
          this.productOutOfStockName = name;
          this.handleOpenOOSAlert();
        });
        return;
      }
    } else {
      if (batchData.length > 0) {
        if (batchData.length > 1) {
        } else if (batchData.length === 1) {
          let firstBatchData = batchData[0];
          if (
            this.saleTxnSettingsData &&
            this.saleTxnSettingsData.enableNegativeStockAlert &&
            firstBatchData.qty <= 0
          ) {
            runInAction(() => {
              this.productOutOfStockName = name;
              this.handleOpenOOSAlert();
            });
            return;
          }
        }
      } else {
        if (
          this.saleTxnSettingsData &&
          this.saleTxnSettingsData.enableNegativeStockAlert &&
          stockQty <= 0
        ) {
          runInAction(() => {
            this.productOutOfStockName = name;
            this.handleOpenOOSAlert();
          });
          return;
        }
      }
    }

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
          if (
            String(
              localStorage.getItem('isHotelOrRestaurant')
            ).toLowerCase() === 'true'
          ) {
            runInAction(() => {
              let batchDataFiltered = batchData.filter((ele) => {
                return ele.batchNumber === this.saleTxnSettingsData.menuType;
              });

              if (batchDataFiltered && batchDataFiltered.length > 0) {
                let firstBatchData = batchDataFiltered[0];
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
                  this.salesTxnEnableFieldsMap.get(
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

                let tax =
                  (parseFloat(purchaseCgst) || 0) +
                  (parseFloat(purchaseSgst) || 0);

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

                this.items[index].finalMRPPrice = parseFloat(
                  firstBatchData.finalMRPPrice
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
                this.items[index].freeStockQty = firstBatchData.freeQty;
                this.items[index].batchNumber = firstBatchData.batchNumber;
                this.items[index].modelNo = firstBatchData.modelNo;
                this.items[index].barcode = firstBatchData.barcode;

                salePercent = firstBatchData.saleDiscountPercent;
              }
            });
          } else {
            runInAction(() => {
              this.converToSelectedProduct(productItem);
              this.selectedIndex = index;
              this.OpenBatchList = true;
            });
          }
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

            this.items[index].finalMRPPrice = parseFloat(
              firstBatchData.finalMRPPrice
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
            this.items[index].freeStockQty = firstBatchData.freeQty;
            this.items[index].batchNumber = firstBatchData.batchNumber;
            this.items[index].modelNo = firstBatchData.modelNo;
            this.items[index].barcode = firstBatchData.barcode;

            salePercent = firstBatchData.saleDiscountPercent;
          });
          this.addNewItem(true, false);
        }
      } else if (serialData.length > 0) {
        runInAction(() => {
          let filteredSerialData = productItem.serialData.filter((ele) => {
            return ele.soldStatus === false && ele.purchaseReturn === false;
          });
          productItem.serialData = filteredSerialData;
          this.converToSelectedProduct(productItem);
          this.selectedIndex = index;
          this.OpenSerialList = true;
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
          this.items[index].finalMRPPrice = parseFloat(finalMRPPrice);

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
          this.items[index].mfDate = mfDate;
          this.items[index].expiryDate = expiryDate;
          this.items[index].rack = rack;
          this.items[index].warehouseData = warehouseData;
          this.items[index].modelNo = modelNo;
        });

        this.items.push(new SalesItem().defaultValues());
      }
      console.log(
        'additional_property_group_list',
        additional_property_group_list
      );
      runInAction(async () => {
        this.productAddOnsData[index] = [];
        for (let prodAddOn of additional_property_group_list) {
          const addOn = {
            groupId: prodAddOn.groupId,
            name: prodAddOn.name,
            min_choices: prodAddOn.min_choices,
            max_choices: prodAddOn.max_choices,
            additional_property_list: this.getSaleItemAdditionalPropertiesList(
              prodAddOn.additional_property_list
            )
          };
          this.productAddOnsData[index].push(addOn);
        }

        this.items[index].item_name = name;
        this.items[index].sku = sku;
        this.items[index].product_id = productId;
        this.items[index].description = description;
        this.items[index].imageUrl = imageUrl;
        this.items[index].cess = cess;
        this.items[index].taxIncluded = taxIncluded;
        this.items[index].taxType = taxType;
        this.items[index].stockQty = stockQty;
        this.items[index].freeStockQty = freeQty;
        this.items[index].hsn = hsn;

        // categories
        this.items[index].categoryLevel2 = categoryLevel2.name;
        this.items[index].categoryLevel2DisplayName =
          categoryLevel2.displayName;
        this.items[index].categoryLevel3 = categoryLevel3.name;
        this.items[index].categoryLevel3DisplayName =
          categoryLevel3.displayName;
        this.items[index].makingChargePerGramAmount = makingChargePerGram;

        this.items[index].brandName = brandName;
        this.items[index].serialOrImeiNo = serialOrImeiNo;

        salePercent = saleDiscountPercent;

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
      });

      this.items[index].grossWeight = grossWeight.toString();
      this.items[index].stoneWeight = stoneWeight;
      this.items[index].netWeight = netWeight.toString();
      this.items[index].stoneCharge = stoneCharge;
      this.items[index].purity = purity;
      this.items[index].hallmarkCharge = hallmarkCharge;
      this.items[index].certificationCharge = certificationCharge;
      if (warrantyDays > 0) {
        this.items[index].warrantyDays = parseFloat(warrantyDays);
        this.items[index].description +=
          ' ' + convertDaysToYearsMonthsDays(warrantyDays) + ' warranty';
      }
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

  getItemTotalAmount = (item) => {
    let total = parseFloat(item.amount);
    if (item.addOnProperties && item.addOnProperties.length > 0) {
      item.addOnProperties.forEach((addOn) => {
        total += parseFloat(addOn.amount || 0) * parseFloat(item.qty || 0);
      });
    }
    return total;
  };

  getSaleItemAdditionalPropertiesList = (additionalPropertiesList) => {
    let newAddOnsList = [];
    for (let addOn of additionalPropertiesList) {
      let newAddOn = {
        additionalPropertyId: addOn.additional_property_id,
        name: addOn.name,
        price: addOn.price,
        type: addOn.type,
        offline: addOn.offline,
        cgst: this.isCGSTSGSTEnabledByPOS === true ? addOn.cgst : 0,
        sgst: this.isCGSTSGSTEnabledByPOS === true ? addOn.sgst : 0,
        igst: this.isCGSTSGSTEnabledByPOS === false ? addOn.sgst : 0,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0,
        discount_percent: 0,
        discount_amount: 0,
        discount_amount_per_item: 0,
        discount_type: '',
        amount: 0,
        amount_before_tax: 0,
        cess: addOn.cess,
        taxIncluded: addOn.tax_included,
        groupName: addOn.group_name,
        purchasedPrice: addOn.purchasedPrice,
        taxType: addOn.taxType,
        productId: addOn.productId,
        description: addOn.description,
        batchId: addOn.batchId,
        brandName: addOn.brandName,
        categoryLevel2: addOn.categoryLevel2,
        categoryLevel2DisplayName: addOn.categoryLevel2DisplayName,
        categoryLevel3: addOn.categoryLevel3,
        categoryLevel3DisplayName: addOn.categoryLevel3DisplayName,
        hsn: addOn.hsn,
        barcode: addOn.barcode,
        stockQty: addOn.stockQty
      };
      newAddOnsList.push(newAddOn);
    }

    return newAddOnsList;
  };

  handleOpenAddon = async (item, index) => {
    // console.log("productitem",item);
    this.selectedProductData = item;
    this.openAddonList = true;
    this.addonIndex = index;
  };

  pushAddonProperties = async (properties, total) => {
    runInAction(() => {
      this.items[this.addonIndex].addOnProperties = properties;
      let desc = '';
      if (
        this.items[this.addonIndex].properties &&
        this.items[this.addonIndex].properties.length > 0
      ) {
        for (
          var i = 0;
          i < this.items[this.addonIndex].properties.length;
          i++
        ) {
          desc +=
            this.items[this.addonIndex].properties[i].title +
            ': ' +
            this.items[this.addonIndex].properties[i].value +
            ' ';
        }
      }
      if (properties && properties.length > 0) {
        desc += 'AddOns: ';
        for (var j = 0; j < properties.length; j++) {
          desc += properties[j].name + ' ';
        }
      }
      this.items[this.addonIndex].description = desc;
    });
  };

  handleAddOnsListModalClose = async () => {
    this.openAddonList = false;
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

    if (
      this.saleTxnSettingsData &&
      this.saleTxnSettingsData.enableNegativeStockAlert &&
      qty <= 0
    ) {
      runInAction(() => {
        this.OpenBatchList = false;
        this.deleteItem(this.selectedIndex);
        this.productOutOfStockName = this.selectedProduct.name;
        this.handleOpenOOSAlert();
      });
      return;
    }

    // adding same product to sales
    let existingSaleProduct;
    existingSaleProduct = this.items.find((product, index) =>
      this.findBatchProduct(product, index, batchItem)
    );

    if (existingSaleProduct) {
      this.items[existingSaleProduct.index] = existingSaleProduct;
      this.setQuantity(existingSaleProduct.index, existingSaleProduct.qty);
      //if (this.isComingFromProductSearch === false) {
      this.resetSingleProduct(currentProductRowIndexToReset);
      //}
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
          totalGST = purchasedPrice - purchasedPrice * (100 / (100 + tax));
        }
        this.items[this.selectedIndex].purchased_price_before_tax = parseFloat(
          purchasedPrice - parseFloat(totalGST)
        ).toFixed(2);
        this.items[this.selectedIndex].purchased_price_before_tax = parseFloat(
          this.items[this.selectedIndex].purchased_price_before_tax
        );

        this.items[this.selectedIndex].finalMRPPrice =
          parseFloat(purchasedPrice);

        this.items[this.selectedIndex].stockQty = qty;

        this.items[this.selectedIndex].freeStockQty = freeQty;

        this.items[this.selectedIndex].batch_id = batchItem.id;

        this.items[this.selectedIndex].vendorName = batchItem.vendorName;
        this.items[this.selectedIndex].vendorPhoneNumber =
          batchItem.vendorPhoneNumber;

        this.items[this.selectedIndex].mfDate = mfDate;
        this.items[this.selectedIndex].expiryDate = expiryDate;
        this.items[this.selectedIndex].rack = rack;
        this.items[this.selectedIndex].warehouseData = warehouseData;
        this.items[this.selectedIndex].modelNo = modelNo;
        this.items[this.selectedIndex].barcode = barcode;
        this.items[this.selectedIndex].properties = properties;
        this.items[this.selectedIndex].batchNumber = batchNumber;

        let description = '';
        if (properties && properties.length > 0) {
          for (var i = 0; i < properties.length; i++) {
            description +=
              properties[i].title + ': ' + properties[i].value + ' ';
          }
        }

        if (
          this.items[this.selectedIndex].addOnProperties &&
          this.items[this.selectedIndex].addOnProperties.length > 0
        ) {
          description += 'AddOns: ';
          for (
            var j = 0;
            j < this.items[this.selectedIndex].addOnProperties.length;
            j++
          ) {
            description +=
              this.items[this.selectedIndex].addOnProperties[j].name + ' ';
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

  selectProductFromSerial = (
    serialItem,
    currentProductRowIndexToReset,
    selectedProduct
  ) => {
    if (!serialItem) {
      return;
    }

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
      //if (this.isComingFromProductSearch === false) {
      this.resetSingleProduct(currentProductRowIndexToReset);
      //}
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
        this.items[this.selectedIndex].serialOrImeiNo = serialImeiNo;
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

        this.items[this.selectedIndex].finalMRPPrice = parseFloat(
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

  handleProfitLossDetailClose = () => {
    this.profitLossDetailDialogOpen = false;
  };

  handleProfitLossDetailOpen = (item) => {
    // console.log('item::', toJS(item['data']));
    this.profitLossDetails = item['data'];
    this.profitLossDetailDialogOpen = true;
  };

  setDateRageOfGSTR1 = async (fromDate, toDate) => {
    this.GSTRDateRange.fromDate = fromDate;
    this.GSTRDateRange.toDate = toDate;
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

  // Temple Methods
  setGothra = (value) => {
    this.saleDetails.gothra = value;
  };

  setRashi = (value) => {
    this.saleDetails.rashi = value;
  };

  setStar = (value) => {
    this.saleDetails.star = value;
  };

  setTempleBillType = (value) => {
    this.saleDetails.templeBillType = value;
  };

  setTempleSpecialDayName = (value) => {
    this.saleDetails.templeSpecialDayName = value;
  };

  setTempleSpecialDayName = (value) => {
    this.saleDetails.templeSpecialDayName = value;
  };

  setTempleCustomComments = (value) => {
    this.saleDetails.templeCustomTypeComments = value;
  };

  setTempleSpecialDayStartDate = (value) => {
    this.saleDetails.templeSpecialDayStartDate = value;
  };

  setTempleSpecialDayEndDate = (value) => {
    this.saleDetails.templeSpecialDayEndDate = value;
  };

  setTempleSpecialDayTimings = (value) => {
    this.saleDetails.templeSpecialDayTimings = value;
  };

  setTempleOccursEveryYear = (value) => {
    this.saleDetails.templeOccursEveryYear = value;
  };

  setTempleSpecialDayEnabled = (value) => {
    this.saleDetails.specialDayEnabled = value;
  };

  setPaymentReferenceNumber = (value) => {
    this.saleDetails.paymentReferenceNumber = value;
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

  convertSalesQuotationToSale = async (item) => {
    await this.initializeSettings();
    this.previousBalanceAmount = 0;
    this.saleQuotationDetails = item;

    runInAction(() => {
      this.shippingTax = this.saleAuditDetails.shippingPackingTax;
      this.packingTax = this.saleAuditDetails.shippingPackingTax;
      this.insuranceTax = this.saleAuditDetails.shippingPackingTax;
      this.openAddSalesInvoice = true;
      this.isUpdate = false;
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.existingSaleData = item;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.chosenPaymentType = 'Cash';
      this.isCGSTSGSTEnabledByPOS = true;
      this.isComingFromProductSearch = false;
      this.invoiceData = {};
      this.setNotPerformAmendement(false);
    });

    let custAddnDetails = await this.getCustomerDataOnConvertion(
      item.customer_id
    );

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customer_address: item.customer_address,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_phoneNo: item.customer_phoneNo,
      customer_emailId: item.customer_emailId,
      customer_city: item.customer_city,
      customer_pincode: item.customer_pincode,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      invoice_number: 0,
      invoice_date: getTodayDateInYYYYMMDD(),
      is_credit: false,
      payment_type: 'cash',
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      posId: item.posId,
      packing_charge: item.packing_charge || 0,
      shipping_charge: item.shipping_charge || 0,
      paymentReferenceNumber: item.paymentReferenceNumber,
      isFullyReturned: false,
      isPartiallyReturned: false,
      linked_amount: 0,
      linkPayment: false,
      linkedTxnList: [],
      rateList: [],
      poInvoiceNo: '',
      vehicleNo: '',
      transportMode: 'Road',
      notes: item.notes,
      ewayBillStatus: 'Not Generated',
      ewayBillDetails: null,
      einvoiceBillStatus: 'Pending',
      einvoiceDetails: null,
      irnNo: '',
      vehicleType: 'Regular',
      approxDistance: 0,
      transporterName: '',
      transporterId: '',
      ewayBillGeneratedDate: '',
      einvoiceBillGeneratedDate: '',
      ewayBillValidDate: '',
      customerTradeName: custAddnDetails.tradeName,
      customerLegalName: custAddnDetails.legalName,
      shipToCustomerTradeName: '',
      shipToCustomerLegalName: '',
      customerRegistrationNumber: custAddnDetails.registrationNumber,
      customerPanNumber: custAddnDetails.panNumber,
      shipToCustomerRegistrationNumber: '',
      shipToCustomerPanNumber: '',
      convertedToDC: false,
      tcsAmount: 0,
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      dueDate: null,
      tdsAmount: 0,
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      splitPaymentList: [],
      place_of_supply: item.customerState
        ? this.getSelectedPlaceOfSupplyValue(item.customerState)
        : '',
      placeOfSupplyName: item.customerState ? item.customerState : '',
      weightIn: 0,
      weightOut: 0,
      wastage: 0,
      jobAssignedEmployeeId: '',
      jobAssignedEmployeeName: '',
      jobAssignedEmployeePhoneNumber: '',
      ewayBillNo: '',
      isCancelled: false,
      isSyncedToServer: false,
      invoiceStatus: '',
      tallySyncedStatus: '',
      calculateStockAndBalance: true,
      tallySynced: false,
      aadharNumber: custAddnDetails.aadharNumber,
      eWayErrorMessage: '',
      eInvoiceErrorMessage: '',
      salesEmployeeName: '',
      salesEmployeeId: '',
      salesEmployeePhoneNumber: '',
      schemeId: '',
      shippingTax: null,
      packingTax: null,
      amendmentDate: '',
      amended: false,
      amendmentReason: '',
      exportType: '',
      exportCountry: '',
      exportCurrency: '',
      exportConversionRate: 0,
      exportShippingBillNo: '',
      exportShippingBillDate: '',
      exportShippingPortCode: '',
      discountPercentForAllItems: 0,
      insurance: null,
      imageUrls: []
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

    await this.checkForTaxAndLoadUI();

    if (this.saleTxnSettingsData.enableTCS === true) {
      this.saleDetails.tcsName = custAddnDetails.tcsName;
      this.saleDetails.tcsRate = custAddnDetails.tcsRate;
      this.saleDetails.tcsCode = custAddnDetails.tcsCode;
    }

    if (this.saleTxnSettingsData.enableTDS === true) {
      this.saleDetails.tdsName = custAddnDetails.tdsName;
      this.saleDetails.tdsRate = custAddnDetails.tdsRate;
      this.saleDetails.tdsCode = custAddnDetails.tdsCode;
    }

    // await this.prepareSplitPaymentList();

    this.generateInvoiceNumber();

    /**
     * get customer txn which are un used
     */
    const db = await Db.get();
    await lp.getAllUnPaidTxnForCustomer(this, db, item.customer_id, 'Sales');
  };

  convertJobWorkInToSale = async (item) => {
    await this.initializeSettings();
    this.previousBalanceAmount = 0;
    this.jobWorkInDetails = item.toJSON();

    runInAction(() => {
      this.shippingTax = this.saleAuditDetails.shippingPackingTax;
      this.packingTax = this.saleAuditDetails.shippingPackingTax;
      this.insuranceTax = this.saleAuditDetails.shippingPackingTax;
      this.openAddSalesInvoice = true;
      this.isUpdate = false;
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.existingSaleData = item;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.chosenPaymentType = 'Cash';
      this.isCGSTSGSTEnabledByPOS = true;
      this.isComingFromProductSearch = false;
      this.invoiceData = {};
      this.setNotPerformAmendement(false);
    });

    let custAddnDetails = await this.getCustomerDataOnConvertion(
      item.customer_id
    );

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customer_address: item.customer_address,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_phoneNo: item.customer_phoneNo,
      customer_emailId: item.customer_emailId,
      customer_city: item.customer_city,
      customer_pincode: item.customer_pincode,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      invoice_number: 0,
      invoice_date: getTodayDateInYYYYMMDD(),
      is_credit: false,
      payment_type: 'cash',
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      posId: item.posId,
      packing_charge: item.packing_charge || 0,
      shipping_charge: item.shipping_charge || 0,
      paymentReferenceNumber: item.paymentReferenceNumber,
      isFullyReturned: false,
      isPartiallyReturned: false,
      linked_amount: 0,
      linkPayment: false,
      linkedTxnList: item.linkedTxnList,
      rateList: [],
      poInvoiceNo: '',
      vehicleNo: '',
      transportMode: 'Road',
      notes: item.notes,
      ewayBillStatus: 'Not Generated',
      ewayBillDetails: null,
      einvoiceBillStatus: 'Pending',
      einvoiceDetails: null,
      irnNo: '',
      vehicleType: 'Regular',
      approxDistance: 0,
      transporterName: '',
      transporterId: '',
      ewayBillGeneratedDate: '',
      einvoiceBillGeneratedDate: '',
      ewayBillValidDate: '',
      customerTradeName: custAddnDetails.tradeName,
      customerLegalName: custAddnDetails.legalName,
      shipToCustomerTradeName: '',
      shipToCustomerLegalName: '',
      customerRegistrationNumber: custAddnDetails.registrationNumber,
      customerPanNumber: custAddnDetails.panNumber,
      shipToCustomerRegistrationNumber: '',
      shipToCustomerPanNumber: '',
      convertedToDC: false,
      tcsAmount: 0,
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      dueDate: null,
      tdsAmount: 0,
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      splitPaymentList: [],
      place_of_supply: item.customerState
        ? this.getSelectedPlaceOfSupplyValue(item.customerState)
        : '',
      placeOfSupplyName: item.customerState ? item.customerState : '',
      weightIn: item.weightIn,
      weightOut: 0,
      wastage: 0,
      jobAssignedEmployeeId: item.jobAssignedEmployeeId,
      jobAssignedEmployeeName: item.jobAssignedEmployeeName,
      jobAssignedEmployeePhoneNumber: item.jobAssignedEmployeePhoneNumber,
      ewayBillNo: '',
      isCancelled: false,
      isSyncedToServer: false,
      invoiceStatus: '',
      tallySyncedStatus: '',
      calculateStockAndBalance: true,
      tallySynced: false,
      aadharNumber: custAddnDetails.aadharNumber,
      eWayErrorMessage: '',
      eInvoiceErrorMessage: '',
      salesEmployeeName: '',
      salesEmployeeId: '',
      salesEmployeePhoneNumber: '',
      schemeId: '',
      shippingTax: null,
      packingTax: null,
      amendmentDate: '',
      amended: false,
      amendmentReason: '',
      exportType: '',
      exportCountry: '',
      exportCurrency: '',
      exportConversionRate: 0,
      exportShippingBillNo: '',
      exportShippingBillDate: '',
      exportShippingPortCode: '',
      discountPercentForAllItems: 0,
      insurance: null,
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

    await this.checkForTaxAndLoadUI();

    if (this.saleTxnSettingsData.enableTCS === true) {
      this.saleDetails.tcsName = custAddnDetails.tcsName;
      this.saleDetails.tcsRate = custAddnDetails.tcsRate;
      this.saleDetails.tcsCode = custAddnDetails.tcsCode;
    }

    if (this.saleTxnSettingsData.enableTDS === true) {
      this.saleDetails.tdsName = custAddnDetails.tdsName;
      this.saleDetails.tdsRate = custAddnDetails.tdsRate;
      this.saleDetails.tdsCode = custAddnDetails.tdsCode;
    }

    // await this.prepareSplitPaymentList();

    //remove un wanted fields

    this.generateInvoiceNumber();

    /**
     * get customer txn which are un used
     */
    const db = await Db.get();
    await lp.getAllUnPaidTxnForCustomer(this, db, item.customer_id, 'Sales');
  };

  convertDeliveryChallanToSale = async (item) => {
    await this.initializeSettings();
    this.previousBalanceAmount = 0;
    this.deliveryChallanDetails = item.toJSON();

    runInAction(() => {
      this.shippingTax = this.saleAuditDetails.shippingPackingTax;
      this.packingTax = this.saleAuditDetails.shippingPackingTax;
      this.insuranceTax = this.saleAuditDetails.shippingPackingTax;
      this.openAddSalesInvoice = true;
      this.isUpdate = false;
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.existingSaleData = item;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.chosenPaymentType = 'Cash';
      this.isCGSTSGSTEnabledByPOS = true;
      this.isComingFromProductSearch = false;
      this.invoiceData = {};
      this.setNotPerformAmendement(false);
    });

    let custAddnDetails = await this.getCustomerDataOnConvertion(
      item.customer_id
    );

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_address: item.customer_address,
      customer_phoneNo: item.customer_phoneNo,
      customer_city: item.customer_city,
      customer_emailId: item.customer_emailId,
      customer_pincode: item.customer_pincode,
      shipToCustomerName: item.customer_name,
      shipToCustomerId: item.customer_id,
      shipToCustomerAddress: item.customer_address,
      shipToCustomerPhoneNo: item.customer_phoneNo,
      shipToCustomerPincode: item.customer_pincode,
      shipToCustomerCity: item.customer_city,
      shipToCustomerEmailId: item.customer_emailId,
      shipToCustomerGSTNo: item.customerGSTNo,
      shipToCustomerGstType: item.customerGstType,
      customerState: item.customerShippingData
        ? item.customerShippingData.state
        : '',
      customerCountry: item.customerShippingData
        ? item.customerShippingData.country
        : '',
      shipToCustomerState: item.customerShippingData
        ? item.customerShippingData.state
        : '',
      shipToCustomerCountry: item.customerShippingData
        ? item.customerShippingData.country
        : '',
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      invoice_number: 0,
      invoice_date: getTodayDateInYYYYMMDD(),
      is_credit: false,
      payment_type: 'cash',
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      posId: item.posId,
      packing_charge: item.packing_charge || 0,
      shipping_charge: item.shipping_charge || 0,
      paymentReferenceNumber: item.paymentReferenceNumber,
      isFullyReturned: false,
      isPartiallyReturned: false,
      linked_amount: 0,
      linkPayment: false,
      linkedTxnList: [],
      rateList: [],
      poInvoiceNo: '',
      vehicleNo: '',
      transportMode: 'Road',
      notes: item.notes,
      ewayBillStatus: 'Not Generated',
      ewayBillDetails: null,
      einvoiceBillStatus: 'Pending',
      einvoiceDetails: null,
      irnNo: '',
      vehicleType: 'Regular',
      approxDistance: 0,
      transporterName: '',
      transporterId: '',
      ewayBillGeneratedDate: '',
      einvoiceBillGeneratedDate: '',
      ewayBillValidDate: '',
      customerTradeName: custAddnDetails.tradeName,
      customerLegalName: custAddnDetails.legalName,
      shipToCustomerTradeName: custAddnDetails.tradeName,
      shipToCustomerLegalName: custAddnDetails.legalName,
      customerRegistrationNumber: custAddnDetails.registrationNumber,
      customerPanNumber: custAddnDetails.panNumber,
      shipToCustomerRegistrationNumber: custAddnDetails.registrationNumber,
      shipToCustomerPanNumber: custAddnDetails.panNumber,
      convertedToDC: false,
      tcsAmount: 0,
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      dueDate: null,
      tdsAmount: 0,
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      splitPaymentList: [],
      place_of_supply: item.customerShippingData
        ? this.getSelectedPlaceOfSupplyValue(item.customerShippingData.state)
        : '',
      placeOfSupplyName: item.customerShippingData
        ? item.customerShippingData.state
        : '',
      weightIn: 0,
      weightOut: 0,
      wastage: 0,
      jobAssignedEmployeeId: '',
      jobAssignedEmployeeName: '',
      jobAssignedEmployeePhoneNumber: '',
      ewayBillNo: '',
      isCancelled: false,
      isSyncedToServer: false,
      invoiceStatus: '',
      tallySyncedStatus: '',
      calculateStockAndBalance: true,
      tallySynced: false,
      aadharNumber: custAddnDetails.aadharNumber,
      eWayErrorMessage: '',
      eInvoiceErrorMessage: '',
      salesEmployeeName: '',
      salesEmployeeId: '',
      salesEmployeePhoneNumber: '',
      schemeId: '',
      shippingTax: null,
      packingTax: null,
      amendmentDate: '',
      amended: false,
      amendmentReason: '',
      exportType: '',
      exportCountry: '',
      exportCurrency: '',
      exportConversionRate: 0,
      exportShippingBillNo: '',
      exportShippingBillDate: '',
      exportShippingPortCode: '',
      discountPercentForAllItems: 0,
      insurance: null,
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

    this.saleDetails = saleDetails;

    await this.checkForTaxAndLoadUI();

    if (this.saleTxnSettingsData.enableTCS === true) {
      this.saleDetails.tcsName = custAddnDetails.tcsName;
      this.saleDetails.tcsRate = custAddnDetails.tcsRate;
      this.saleDetails.tcsCode = custAddnDetails.tcsCode;
    }

    if (this.saleTxnSettingsData.enableTDS === true) {
      this.saleDetails.tdsName = custAddnDetails.tdsName;
      this.saleDetails.tdsRate = custAddnDetails.tdsRate;
      this.saleDetails.tdsCode = custAddnDetails.tdsCode;
    }

    // await this.prepareSplitPaymentList();

    //remove un wanted fields
    this.generateInvoiceNumber();

    /**
     * get customer txn which are un used
     */
    const db = await Db.get();
    await lp.getAllUnPaidTxnForCustomer(this, db, item.customer_id, 'Sales');
  };

  getSelectedPlaceOfSupplyValue = (stateName) => {
    let stateVal = '';
    let result = stateListHelper
      .getStateList()
      .find((e) => e.name === stateName);
    if (result) {
      stateVal = result.val;
    }

    return stateVal;
  };

  convertSaleOrderToSale = async (item) => {
    await this.initializeSettings();
    this.previousBalanceAmount = 0;
    this.saleOrderDetails = item.toJSON();

    runInAction(() => {
      this.shippingTax = this.saleAuditDetails.shippingPackingTax;
      this.packingTax = this.saleAuditDetails.shippingPackingTax;
      this.insuranceTax = this.saleAuditDetails.shippingPackingTax;
      this.openAddSalesInvoice = true;
      this.isUpdate = false;
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.existingSaleData = this.saleOrderDetails;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.chosenPaymentType = 'Cash';
      this.isCGSTSGSTEnabledByPOS = true;
      this.isComingFromProductSearch = false;
      this.invoiceData = {};
      this.setNotPerformAmendement(false);
    });

    let custAddnDetails = await this.getCustomerDataOnConvertion(
      item.customer_id
    );

    const saleDetails = {
      customer_id: item.customer_id,
      customer_name: item.customer_name,
      customer_phoneNo: item.customer_phoneNo,
      customer_emailId: item.customer_emailId,
      customerGSTNo: item.customer ? item.customer.gstNumber : '',
      customerGstType: item.customer ? item.customer.gstType : '',
      customer_address: item.customer ? item.customer.address : '',
      customer_city: item.customer ? item.customer.city : '',
      customer_pincode: item.customer ? item.customer.pincode : '',
      customerState: item.customer ? item.customer.state : '',
      customerCountry: item.customer ? item.customer.country : '',
      is_roundoff: item.is_roundoff,
      round_amount: item.round_amount,
      total_amount: item.total_amount,
      invoice_number: 0,
      invoice_date: getTodayDateInYYYYMMDD(),
      is_credit: false,
      payment_type: 'cash',
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: item.discount_amount,
      discount_percent: item.discount_percent,
      discount_type: item.discount_type,
      posId: item.posId,
      paymentReferenceNumber: item.paymentReferenceNumber,
      isFullyReturned: false,
      isPartiallyReturned: false,
      linked_amount: 0,
      place_of_supply: item.customer
        ? this.getSelectedPlaceOfSupplyValue(item.customer.state)
        : '',
      placeOfSupplyName: item.customer ? item.customer.state : '',
      linkPayment: false,
      linkedTxnList: item.linkedTxnList,
      rateList: [],
      poInvoiceNo: '',
      vehicleNo: '',
      transportMode: 'Road',
      notes: item.notes,
      ewayBillStatus: 'Not Generated',
      ewayBillDetails: null,
      einvoiceBillStatus: 'Pending',
      einvoiceDetails: null,
      irnNo: '',
      vehicleType: 'Regular',
      approxDistance: 0,
      transporterName: '',
      transporterId: '',
      ewayBillGeneratedDate: '',
      einvoiceBillGeneratedDate: '',
      ewayBillValidDate: '',
      customerTradeName: custAddnDetails.tradeName,
      customerLegalName: custAddnDetails.legalName,
      shipToCustomerTradeName: '',
      shipToCustomerLegalName: '',
      customerRegistrationNumber: custAddnDetails.registrationNumber,
      customerPanNumber: custAddnDetails.panNumber,
      shipToCustomerRegistrationNumber: '',
      shipToCustomerPanNumber: '',
      convertedToDC: false,
      tcsAmount: 0,
      tcsName: custAddnDetails.tcsName,
      tcsRate: custAddnDetails.tcsRate,
      tcsCode: custAddnDetails.tcsCode,
      dueDate: null,
      tdsAmount: 0,
      tdsName: custAddnDetails.tdsName,
      tdsRate: custAddnDetails.tdsRate,
      tdsCode: custAddnDetails.tdsCode,
      splitPaymentList: [],
      weightIn: 0,
      weightOut: 0,
      wastage: 0,
      jobAssignedEmployeeId: '',
      jobAssignedEmployeeName: '',
      jobAssignedEmployeePhoneNumber: '',
      ewayBillNo: '',
      isCancelled: false,
      isSyncedToServer: false,
      invoiceStatus: '',
      tallySyncedStatus: '',
      calculateStockAndBalance: true,
      tallySynced: false,
      aadharNumber: custAddnDetails.aadharNumber,
      eWayErrorMessage: '',
      eInvoiceErrorMessage: '',
      salesEmployeeName: '',
      salesEmployeeId: '',
      salesEmployeePhoneNumber: '',
      schemeId: '',
      shippingTax: null,
      packingTax: null,
      amendmentDate: '',
      amended: false,
      amendmentReason: '',
      exportType: '',
      exportCountry: '',
      exportCurrency: '',
      exportConversionRate: 0,
      exportShippingBillNo: '',
      exportShippingBillDate: '',
      exportShippingPortCode: '',
      discountPercentForAllItems: 0,
      insurance: null,
      imageUrls: []
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

    let taxData = await taxSettings.getTaxSettingsDetails();
    if (taxData && taxData.gstin && taxData.gstin !== '') {
      let businessStateCode = taxData.gstin.slice(0, 2);
      if (
        item.customer &&
        item.customer.gstNumber &&
        item.customer.gstNumber !== ''
      ) {
        let customerExtractedStateCode = item.customer.gstNumber.slice(0, 2);
        if (
          businessStateCode !== '' &&
          customerExtractedStateCode !== '' &&
          businessStateCode === customerExtractedStateCode
        ) {
          this.setCGSTSGSTEnabledByPOS(true);
        } else {
          this.setCGSTSGSTEnabledByPOS(false);
        }
      } else if (
        item.customer &&
        item.customer.state &&
        item.customer.state !== ''
      ) {
        let result = getStateList().find((e) => e.code === businessStateCode);
        if (result) {
          let businessState = result.name;
          if (
            item.customer.state !== '' &&
            businessState !== '' &&
            item.customer.state !== null &&
            businessState !== null &&
            item.customer.state.toLowerCase() === businessState.toLowerCase()
          ) {
            this.setCGSTSGSTEnabledByPOS(true);
          } else {
            this.setCGSTSGSTEnabledByPOS(false);
          }
        }
      }
    }

    this.generateInvoiceNumber();

    if (item.customer_id) {
      /**
       * get customer txn which are un used
       */
      const db = await Db.get();
      await lp.getAllUnPaidTxnForCustomer(this, db, item.customer_id, 'Sales');
    }
  };

  convertSchemeToSale = async (item) => {
    this.schemeOrderDetails = item.toJSON();
    await this.initializeData();

    let custAddnDetails = await this.getCustomerDataOnConvertion(
      item.customerId
    );

    const saleDetails = {
      customer_id: item.customerId,
      customer_name: item.customerName,
      customer_phoneNo: item.customerPhoneNo,
      customer_emailId: item.customerEmailId,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_address: item.customerAddress,
      customer_city: item.customerCity,
      customer_pincode: item.customerPincode,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      is_roundoff: false,
      round_amount: 0,
      total_amount: item.total,
      invoice_number: 0,
      invoice_date: getTodayDateInYYYYMMDD(),
      is_credit: false,
      payment_type: 'cash',
      bankAccount: '',
      bankAccountId: '',
      bankPaymentType: '',
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: 0,
      discount_percent: 0,
      discount_type: '',
      posId: item.posId,
      paymentReferenceNumber: item.paymentReferenceNumber,
      isFullyReturned: false,
      isPartiallyReturned: false,
      linked_amount: 0,
      place_of_supply: this.getSelectedPlaceOfSupplyValue(item.customerState),
      placeOfSupplyName: item.customerState,
      linkPayment: false,
      linkedTxnList: [],
      rateList: [],
      poInvoiceNo: '',
      vehicleNo: '',
      transportMode: 'Road',
      notes: item.notes,
      ewayBillStatus: 'Not Generated',
      ewayBillDetails: null,
      einvoiceBillStatus: 'Pending',
      einvoiceDetails: null,
      irnNo: '',
      vehicleType: 'Regular',
      approxDistance: 0,
      transporterName: '',
      transporterId: '',
      ewayBillGeneratedDate: '',
      einvoiceBillGeneratedDate: '',
      ewayBillValidDate: '',
      customerTradeName: custAddnDetails.tradeName,
      customerLegalName: custAddnDetails.legalName,
      shipToCustomerTradeName: '',
      shipToCustomerLegalName: '',
      customerRegistrationNumber: custAddnDetails.registrationNumber,
      customerPanNumber: custAddnDetails.panNumber,
      shipToCustomerRegistrationNumber: '',
      shipToCustomerPanNumber: '',
      convertedToDC: false,
      tcsAmount: 0,
      tcsName: custAddnDetails.tcsName,
      tcsRate: custAddnDetails.tcsRate,
      tcsCode: custAddnDetails.tcsCode,
      dueDate: null,
      tdsAmount: 0,
      tdsName: custAddnDetails.tdsName,
      tdsRate: custAddnDetails.tdsRate,
      tdsCode: custAddnDetails.tdsCode,
      splitPaymentList: [],
      weightIn: 0,
      weightOut: 0,
      wastage: 0,
      jobAssignedEmployeeId: '',
      jobAssignedEmployeeName: '',
      jobAssignedEmployeePhoneNumber: '',
      ewayBillNo: '',
      isCancelled: false,
      isSyncedToServer: false,
      invoiceStatus: '',
      tallySyncedStatus: '',
      calculateStockAndBalance: true,
      tallySynced: false,
      aadharNumber: custAddnDetails.aadharNumber,
      eWayErrorMessage: '',
      eInvoiceErrorMessage: '',
      salesEmployeeName: '',
      salesEmployeeId: '',
      salesEmployeePhoneNumber: '',
      schemeId: '',
      shippingTax: null,
      packingTax: null,
      amendmentDate: '',
      amended: false,
      amendmentReason: '',
      exportType: '',
      exportCountry: '',
      exportCurrency: '',
      exportConversionRate: 0,
      exportShippingBillNo: '',
      exportShippingBillDate: '',
      exportShippingPortCode: '',
      discountPercentForAllItems: 0,
      insurance: null,
      imageUrls: []
    };

    /**
     * in case of online order no edit is allowed.
     */
    this.items = [];

    this.saleDetails = saleDetails;

    await this.checkForTaxAndLoadUI();

    this.generateInvoiceNumber();

    if (item.customerId) {
      /**
       * get customer txn which are un used
       */
      const db = await Db.get();
      await lp.getAllUnPaidTxnForCustomer(this, db, item.customer_id, 'Sales');
    }
  };

  setPONumber = async (value) => {
    this.saleDetails.poInvoiceNo = value;
  };

  setPODate = async (value) => {
    this.saleDetails.poDate = value;
  };

  setVehicleNo = async (value) => {
    this.saleDetails.vehicleNo = value;
  };

  setTransportMode = async (value) => {
    this.saleDetails.transportMode = value;
  };

  setVehicleType = async (value) => {
    this.saleDetails.vehicleType = value;
  };

  setApproxDistance = async (value) => {
    this.saleDetails.approxDistance = value;
  };

  setTransporterName = async (value) => {
    this.saleDetails.transporterName = value;
  };

  setTransporterId = async (value) => {
    this.saleDetails.transporterId = value;
  };

  handleSalesSearchWithPrefix = async (value) => {
    const db = await Db.get();

    let data;
    const businessData = await Bd.getBusinessData();

    let query = await db.sales.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          { prefix: { $eq: value } },
          {
            invoice_date: {
              $gte: dateHelper.getFinancialYearStartDate()
            }
          },
          {
            invoice_date: {
              $lte: dateHelper.getFinancialYearEndDate()
            }
          },
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

  handleSalesSearchWithSubPrefix = async (value) => {
    const db = await Db.get();

    let data;
    const businessData = await Bd.getBusinessData();

    let query = await db.sales.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            invoice_date: {
              $gte: dateHelper.getFinancialYearStartDate()
            }
          },
          {
            invoice_date: {
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

  handleSalesSearchWithBillType = async (value) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    let query = await db.sales.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          { templeBillType: { $eq: value } },
          {
            invoice_date: {
              $gte: dateHelper.getFinancialYearStartDate()
            }
          },
          {
            invoice_date: {
              $lt: dateHelper.getFinancialYearEndDate()
            }
          },
          {
            updatedAt: { $exists: true }
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

  viewAndRestoreSaleItem = async (item) => {
    await this.initializeSettings();
    runInAction(() => {
      this.openAddSalesInvoice = true;
      this.isUpdate = false;
      this.isRestore = true;
      this.isCancelledRestore = false;
      this.existingSaleData = item;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.invoiceData = {};
      this.setNotPerformAmendement(false);

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

    const saleDetails = new Sales().convertTypes(
      JSON.parse(JSON.stringify(item))
    );

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
    if (this.saleDetails.splitPaymentList === undefined) {
      runInAction(() => {
        this.saleDetails.splitPaymentList = [];
      });
    }

    if (this.saleDetails.payment_type === 'Split') {
      this.chosenPaymentType = 'Split';
    } else {
      this.chosenPaymentType = 'Cash';
    }

    /**
     * get customer txn which are un used
     */
    if (
      item.customer_id !== '' &&
      item.customer_id.length > 2 &&
      item.balance_amount > 0
    ) {
      const db = await Db.get();
      await lp.getAllUnPaidTxnForCustomer(this, db, item.customer_id, 'Sales');
    }

    this.previousBalanceAmount = this.saleDetails.linked_amount;
  };

  restoreSaleItem = async (item, isRestoreWithNextSequenceNo) => {
    await this.initializeSettings();
    runInAction(() => {
      this.isRestore = true;
      this.isUpdate = false;
      this.existingSaleData = item;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.invoiceData = {};
      this.setNotPerformAmendement(false);

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

    const saleDetails = new Sales().convertTypes(
      JSON.parse(JSON.stringify(item))
    );

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
    if (this.saleDetails.splitPaymentList === undefined) {
      runInAction(() => {
        this.saleDetails.splitPaymentList = [];
      });
    }

    if (this.saleDetails.payment_type === 'Split') {
      this.chosenPaymentType = 'Split';
    } else {
      this.chosenPaymentType = 'Cash';
    }

    if (isRestoreWithNextSequenceNo) {
      this.saleDetails.invoice_date = getTodayDateInYYYYMMDD();
      await this.generateInvoiceNumber();
      await this.getSequenceNumber(
        this.saleDetails.invoice_date,
        this.saleDetails.invoice_number
      );
    }

    this.previousBalanceAmount = this.saleDetails.linked_amount;

    this.saveData(false);
  };

  markSaleRestored = async () => {
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

  viewAndRestoreCancelledSaleItem = async (item) => {
    runInAction(() => {
      this.isCancelledRestore = true;
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

    const saleDetails = new Sales().convertTypes(
      JSON.parse(JSON.stringify(item))
    );

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
      this.items = saleDetails.item_list;
    }

    this.saleDetails = saleDetails;
    if (this.saleDetails.splitPaymentList === undefined) {
      runInAction(() => {
        this.saleDetails.splitPaymentList = [];
      });
    }

    if (this.saleDetails.payment_type === 'Split') {
      this.chosenPaymentType = 'Split';
    } else {
      this.chosenPaymentType = 'Cash';
    }

    this.previousBalanceAmount = this.saleDetails.linked_amount;

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.sales.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { invoice_number: { $eq: this.saleDetails.invoice_number } }
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
            this.markCancelledSaleRestored();
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  markCancelledSaleRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionscancelled.findOne({
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

  handleOpenTransportDetails = async () => {
    runInAction(() => {
      this.openTransportDetails = true;
    });
  };

  handleCloseTransportDetails = async () => {
    runInAction(() => {
      this.openTransportDetails = false;
    });
  };

  handleOpenPODetails = async () => {
    runInAction(() => {
      this.openPODetails = true;
    });
  };

  handleClosePODetails = async () => {
    runInAction(() => {
      this.openPODetails = false;
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
      for (let payment of this.saleDetails.splitPaymentList) {
        splitPaymentAmt += parseFloat(payment.amount);
      }
      if (splitPaymentAmt === 0) {
        this.resetSplitPaymentDetails();
      }
    });
  };

  resetSplitPaymentDetails = async () => {
    runInAction(() => {
      this.saleDetails.payment_type = 'cash';
      this.chosenPaymentType = 'Cash';
    });
    this.prepareSplitPaymentList();
  };

  resetPrintData = async () => {
    runInAction(() => {
      this.printData = {};
      this.printBalance = {};
      this.openPrintSelectionAlert = false;
    });
  };

  handleOpenSaleLoadingMessage = async () => {
    runInAction(() => {
      this.openSaleLoadingAlertMessage = true;
    });
  };

  handleCloseSaleLoadingMessage = async () => {
    runInAction(() => {
      this.openSaleLoadingAlertMessage = false;
    });
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

  handleOpenPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPrintSelectionAlert = true;
    });
  };

  handleClosePrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPrintSelectionAlert = false;
    });
  };

  setRoundingConfiguration = (value) => {
    runInAction(() => {
      this.roundingConfiguration = value;
    });
  };

  updateSalesReportFilters = (value, index) => {
    runInAction(() => {
      this.salesReportFilters[index]['val'] = value;
    });
  };

  setSalesReportFilters = (value) => {
    runInAction(() => {
      this.salesReportFilters = value;
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

  setSplitPaymentSettingsData = (value) => {
    runInAction(() => {
      this.splitPaymentSettingsData = value;
    });
    if (
      !this.isUpdate ||
      (this.saleDetails.splitPaymentList &&
        this.saleDetails.splitPaymentList.length === 0)
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
      this.saleDetails.splitPaymentList[index][property] = value;
    });
  };

  prepareSplitPaymentList = async () => {
    runInAction(() => {
      this.saleDetails.splitPaymentList = [];
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
          this.saleDetails.splitPaymentList.push(cashPayment);
        });
      }

      if (this.splitPaymentSettingsData.exchangeEnabled) {
        if (
          this.splitPaymentSettingsData.exchangeList &&
          this.splitPaymentSettingsData.exchangeList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let exchangePayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Exchange',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: null,
            bankAccountId: null,
            amount: 0
          };

          runInAction(() => {
            this.saleDetails.splitPaymentList.push(exchangePayment);
          });
        }
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
            this.saleDetails.splitPaymentList.push(giftCardPayment);
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
            this.saleDetails.splitPaymentList.push(customFinancePayment);
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
            this.saleDetails.splitPaymentList.push(bankPayment);
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
        this.saleDetails.splitPaymentList.push(bankPayment);
      });
    }
  };

  removeSplitPayment = (index) => {
    runInAction(() => {
      this.saleDetails.splitPaymentList.splice(index, 1);
    });
  };

  setChosenPaymentType = (value) => {
    runInAction(() => {
      this.chosenPaymentType = value;
    });
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

  resetEWayLaunchFlag = () => {
    runInAction(() => {
      this.isLaunchEWayAfterSaleCreation = false;
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
    });
    if (this.items[index].pricePerGram > 0) {
      runInAction(() => {
        this.items[index].netWeight =
          parseFloat(this.items[index].grossWeight || 0) -
          parseFloat(this.items[index].stoneWeight || 0);
      });
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
    });

    if (this.items[index].qty === 0) {
      runInAction(() => {
        this.items[index].qty = 1;
      });
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

    runInAction(() => {
      this.items[index].purity = value;
    });
  };

  setItemPricePerGram = async (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].pricePerGram = value ? parseFloat(value) : '';
    });
    if (this.items[index].qty === 0) {
      runInAction(() => {
        this.setQuantity(index, 1);
      });
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

    runInAction(() => {
      this.items[index].stoneWeight = value ? parseFloat(value) : '';
    });
    if (this.items[index].pricePerGram > 0) {
      runInAction(() => {
        this.items[index].netWeight =
          parseFloat(this.items[index].grossWeight || 0) -
          parseFloat(this.items[index].stoneWeight || 0);
      });
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

  setWeightIn = (value) => {
    runInAction(() => {
      this.saleDetails.weightIn = value ? parseFloat(value) : '';

      this.saleDetails.wastage =
        parseFloat(this.saleDetails.weightIn || 0) -
        parseFloat(this.saleDetails.weightOut || 0);
    });
  };

  setWeightOut = (value) => {
    runInAction(() => {
      this.saleDetails.weightOut = value ? parseFloat(value) : '';

      this.saleDetails.wastage =
        parseFloat(this.saleDetails.weightIn || 0) -
        parseFloat(this.saleDetails.weightOut || 0);
    });
  };

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

  cancelSale = async (item, reason) => {
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
      is_credit: item.is_credit,
      payment_type: item.payment_type,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      balance_amount: item.balance_amount,
      linked_amount: item.linked_amount,
      isFullyReturned: item.isFullyReturned,
      isPartiallyReturned: item.isPartiallyReturned,
      linkPayment: item.linkPayment,
      linkedTxnList: item.linkedTxnList,
      businessId: item.businessId,
      businessCity: item.businessCity,
      sequenceNumber: item.sequenceNumber,
      order_type: item.order_type,
      onlineOrderStatus: item.onlineOrderStatus,
      templeBillType: item.templeBillType,
      templeSpecialDayName: item.templeSpecialDayName,
      templeSpecialDayStartDate: item.templeSpecialDayStartDate,
      templeSpecialDayEndDate: item.templeSpecialDayEndDate,
      templeSpecialDayTimings: item.templeSpecialDayTimings,
      templeCustomTypeComments: item.templeCustomTypeComments,
      templeOccursEveryYear: item.templeOccursEveryYear,
      gothra: item.gothra,
      rashi: item.rashi,
      star: item.star,
      specialDayEnabled: item.specialDayEnabled,
      paymentReferenceNumber: item.paymentReferenceNumber,
      poDate: item.poDate,
      poInvoiceNo: item.poInvoiceNo,
      vehicleNo: item.vehicleNo,
      transportMode: item.transportMode,
      shipToCustomerName: item.shipToCustomerName,
      shipToCustomerGSTNo: item.shipToCustomerGSTNo,
      shipToCustomerGstType: item.shipToCustomerGstType,
      shipToCustomerPhoneNo: item.shipToCustomerPhoneNo,
      shipToCustomerCity: item.shipToCustomerCity,
      shipToCustomerEmailId: item.shipToCustomerEmailId,
      shipToCustomerId: item.shipToCustomerId,
      notes: item.notes,
      finalMRPPrice: item.finalMRPPrice,
      employeeId: item.employeeId,
      rateList: item.rateList,
      ewayBillStatus: item.ewayBillStatus,
      ewayBillDetails: item.ewayBillDetails,
      einvoiceBillStatus: item.einvoiceBillStatus,
      einvoiceDetails: item.einvoiceDetails,
      irnNo: item.irnNo,
      vehicleType: item.vehicleType,
      approxDistance: item.approxDistance,
      transporterName: item.transporterName,
      transporterId: item.transporterId,
      ewayBillGeneratedDate: item.ewayBillGeneratedDate,
      einvoiceBillGeneratedDate: item.einvoiceBillGeneratedDate,
      ewayBillValidDate: item.ewayBillValidDate,
      customerTradeName: item.customerTradeName,
      customerLegalName: item.customerLegalName,
      shipToCustomerTradeName: item.shipToCustomerTradeName,
      shipToCustomerLegalName: item.shipToCustomerLegalName,
      customerRegistrationNumber: item.customerRegistrationNumber,
      customerPanNumber: item.customerPanNumber,
      shipToCustomerRegistrationNumber: item.shipToCustomerRegistrationNumber,
      shipToCustomerPanNumber: item.shipToCustomerPanNumber,
      tcsAmount: item.tcsAmount,
      tcsName: item.tcsName,
      tcsRate: item.tcsRate,
      tcsCode: item.tcsCode,
      dueDate: item.dueDate,
      tdsAmount: item.tdsAmount,
      tdsName: item.tdsName,
      tdsRate: item.tdsRate,
      tdsCode: item.tdsCode,
      splitPaymentList: item.splitPaymentList,
      weightIn: item.weightIn,
      weightOut: item.weightOut,
      wastage: item.wastage,
      jobAssignedEmployeeId: item.jobAssignedEmployeeId,
      jobAssignedEmployeeName: item.jobAssignedEmployeeName,
      jobAssignedEmployeePhoneNumber: item.jobAssignedEmployeePhoneNumber,
      isCancelled: item.isCancelled,
      isSyncedToServer: item.isSyncedToServer
    };

    this.saleDetails = saleDetails;

    /**
     * if sale is partially returned or fully returned then sale update is in valid
     */
    if (saleDetails.isFullyReturned || saleDetails.isPartiallyReturned) {
      alert('Partial/Full returned Sale is not eligible to Delete');
      return;
    }

    let CancelDataDoc = {
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      total: 0,
      balance: 0,
      data: '',
      reason: '',
      irn: '',
      gstNumber: ''
    };

    let restoreSalesData = {};
    restoreSalesData = saleDetails;
    restoreSalesData.item_list = this.items;
    restoreSalesData.employeeId = saleDetails.employeeId;

    CancelDataDoc.transactionId = saleDetails.invoice_number;
    CancelDataDoc.sequenceNumber = saleDetails.sequenceNumber;
    CancelDataDoc.transactionType = 'Sales';
    CancelDataDoc.data = JSON.stringify(restoreSalesData);
    CancelDataDoc.total = saleDetails.total_amount;
    CancelDataDoc.balance = saleDetails.balance_amount;
    CancelDataDoc.createdDate = saleDetails.invoice_date;
    CancelDataDoc.reason = reason;
    CancelDataDoc.gstNumber = saleDetails.customerGSTNo;
    CancelDataDoc.irn = saleDetails.irnNo;

    cancelTxn.addCancelEvent(CancelDataDoc);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query = db.sales.findOne({
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
         * clear old customer balance amount
         */

        if (
          !('calculateStockAndBalance' in saleDetails) ||
          !saleDetails.calculateStockAndBalance
        ) {
          await balanceUpdate.incrementBalance(
            db,
            saleDetails.customer_id,
            parseFloat(saleDetails.balance_amount) +
              parseFloat(saleDetails.linked_amount)
          );
        }

        /**
         * un-link old payments lanks
         */
        if (saleDetails.linked_amount > 0) {
          await this.unLinkPayment(db, saleDetails);
        }

        /**
         * delete from product txn table
         */
        let txnData = saleDetails;
        txnData.item_list = this.items;

        await productTxn.deleteProductTxnFromSales(saleDetails, db);
        await allTxn.deleteTxnFromSales(saleDetails, db);

        if (
          !('calculateStockAndBalance' in saleDetails) ||
          !saleDetails.calculateStockAndBalance
        ) {
          if (this.saleTxnSettingsData.updateRawMaterialsStock) {
            await this.deleteRawMaterialTransactionsAndResetStock(saleDetails);
          }
        }

        /**
         * reset back old sale product stock
         */
        if (
          !('calculateStockAndBalance' in saleDetails) ||
          !saleDetails.calculateStockAndBalance
        ) {
          for (const i of this.items) {
            await this.updateProductStock(
              db,
              i.product_id,
              parseFloat(
                i.qtyUnit && i.qtyUnit !== ''
                  ? qtyUnitUtility.getQuantityByUnit(i)
                  : i.qty || 0
              ),
              parseFloat(
                i.qtyUnit && i.qtyUnit !== ''
                  ? qtyUnitUtility.getFreeQuantityByUnit(i)
                  : i.freeQty || 0
              ),
              1,
              i.batch_id
            );
          }
        }

        /**
         * cancel in sale table
         */
        await query
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
            //save to audit
            audit.addAuditEvent(
              saleDetails.invoice_number,
              saleDetails.sequenceNumber,
              'Sale',
              'Cancel',
              JSON.stringify(saleDetails),
              err.message,
              saleDetails.invoice_date
            );
            console.log('Internal Server Error', err);
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setCGSTSGSTEnabledByPOS = (value) => {
    runInAction(() => {
      this.isCGSTSGSTEnabledByPOS = value;
    });
  };

  get getRoundedAmount() {
    if (!this.saleDetails.is_roundoff) {
      return 0;
    }
    return this.saleDetails.round_amount;
  }

  updateSaleTallySyncStatus = async (status, invoiceNumber) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.sales.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            invoice_number: {
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

  updateBulkSaleTallySyncStatus = async (inputItems, status) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    for (var i = 0; i < inputItems.length; i++) {
      let item = inputItems[i];
      let updatedAtNewTime = timestamp.getUniqueTimestamp();
      if (
        item.is_credit === true &&
        item.linked_amount !== 0 &&
        item.linked_amount < item.total_amount
      ) {
        continue;
      }
      const query = await db.sales.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              invoice_number: {
                $eq: item.invoice_number
              }
            }
          ]
        }
      });
      query
        .exec()
        .then(async (data) => {
          if (data && data.tallySynced !== status) {
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

  setCancelRemark = (value) => {
    runInAction(() => {
      this.cancelRemark = value;
    });
  };

  setSalesEmployee = (data) => {
    if (data !== '') {
      this.saleDetails.salesEmployeeName = data.name;
      this.saleDetails.salesEmployeeId = data.id;
      this.saleDetails.salesEmployeePhoneNumber = data.userName;
    } else {
      this.saleDetails.salesEmployeeName = '';
      this.saleDetails.salesEmployeeId = '';
      this.saleDetails.salesEmployeePhoneNumber = '';
    }
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

  isSaleLockedForEdit = async () => {
    let auditSettings = await audit.getAuditSettingsData();
    this.saleLockMessage = '';

    var dateParts = this.saleDetails.invoice_date.split('-');
    if (
      this.saleDetails.irnNo !== '' &&
      this.saleDetails.irnNo !== undefined &&
      this.saleDetails.irnNo !== null
    ) {
      this.isLocked = true;
      this.saleLockMessage = 'IRN Generated. Sale is not eligible for Edit!!';
    }

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
          'GSTR-1 filings completed. Sale is not eligible for Edit!!';
      }
    }

    return this.isLocked;
  };

  isSaleLockedForDelete = async (item) => {
    let auditSettings = await audit.getAuditSettingsData();
    this.saleLockMessage = '';
    let isLocked = false;

    var dateParts = item.invoice_date.split('-');
    if (item.irnNo !== '' && item.irnNo !== undefined && item.irnNo !== null) {
      isLocked = true;
      this.saleLockMessage = 'IRN Generated. Sale is not eligible for Delete!!';
    }

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
          'GSTR-1 filings completed. Sale is not eligible for Delete!!';
      }
    }

    let returnObj = {
      isLocked: isLocked,
      saleLockMessage: this.saleLockMessage
    };

    return returnObj;
  };

  isSaleLockedForCancel = async (item) => {
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
          'GSTR-1 filings completed. Sale is not eligible for Cancel!!';
      }
    }

    let returnObj = {
      isLocked: isLocked,
      saleLockMessage: this.saleLockMessage
    };

    return returnObj;
  };

  handleCancelClose = () => {
    runInAction(() => {
      this.cancelItem = {};
      this.cancelRemark = '';
      this.openCancelDialog = false;
      this.cancelItemIsEInvoice = false;
    });
  };

  handleOpenCancelDialog = (saleItem, isEInvoice) => {
    runInAction(() => {
      this.cancelItem = saleItem;
      this.openCancelDialog = true;
      this.cancelItemIsEInvoice = isEInvoice;
    });
  };

  handleOpenOOSAlert = () => {
    runInAction(() => {
      this.productOutOfStockAlert = true;
    });
  };

  handleCloseOOSAlert = () => {
    runInAction(() => {
      this.productOutOfStockAlert = false;
    });
  };

  setRateMetalList = (list) => {
    runInAction(() => {
      this.metalList = list;
    });
  };

  loadProductsFromGroup = (groupData) => {
    runInAction(() => {
      if (groupData && groupData.itemList && groupData.itemList.length > 0) {
        this.items = [];
        this.items = groupData.itemList;
      }
    });
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
      this.saleDetails.amendmentDate = amendementDate;
    });
  };

  setAmendmentRemarks = (remarks) => {
    runInAction(() => {
      this.saleDetails.amendmentReason = remarks;
    });
  };

  setAmendmentFlag = (flag) => {
    runInAction(() => {
      this.saleDetails.amended = flag;
    });
  };

  revertSaleAmendmentStatus = async (invoiceNumber) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.sales.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            invoice_number: {
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

  shouldShowSaleAmendmentPopUp = async () => {
    const inputDate = new Date(this.saleDetails.invoice_date);
    const lastBeforeMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 1,
      1
    );
    const beforeMonthDate = new Date(dateFormat(lastBeforeMonth, 'yyyy-mm-dd'));
    let toAmend = false;
    if (
      inputDate < beforeMonthDate &&
      (this.saleDetails.amended === false ||
        this.saleDetails.amended === null) &&
      this.isUpdate === true &&
      this.notPerformAmendment === false
    ) {
      toAmend = true;
    }

    return toAmend;
  };

  handleOpenMfgDetails = () => {
    runInAction(() => {
      this.openMfgDetails = true;
    });
  };

  handleCloseMfgDetails = () => {
    runInAction(() => {
      this.openMfgDetails = false;
    });
  };

  setExportType = (value) => {
    runInAction(() => {
      this.saleDetails.exportType = value;
    });
  };

  setExportCountry = (value) => {
    runInAction(() => {
      this.saleDetails.exportCountry = value;
    });
  };

  setExportCurrency = (value) => {
    runInAction(() => {
      this.saleDetails.exportCurrency = value;
    });
  };

  setExportConversionRate = (value) => {
    runInAction(() => {
      this.saleDetails.exportConversionRate = value;
    });
  };

  setExportShippingBillNo = (value) => {
    runInAction(() => {
      this.saleDetails.exportShippingBillNo = value;
    });
  };

  setExportShippingBillDate = (value) => {
    runInAction(() => {
      this.saleDetails.exportShippingBillDate = value;
    });
  };

  setExportShippingPortNo = (value) => {
    runInAction(() => {
      this.saleDetails.exportShippingPortCode = value;
    });
  };

  calculateDiscountAmount(tempAmount) {
    let discountAmount = 0;
    runInAction(() => {
      const discountType = this.saleDetails.discount_type;

      if (discountType === 'percentage') {
        let percentage = parseFloat(this.saleDetails.discount_percent || 0);

        discountAmount = parseFloat((tempAmount * percentage) / 100 || 0);

        this.saleDetails.discount_amount = discountAmount;
      } else if (discountType === 'amount') {
        discountAmount = parseFloat(this.saleDetails.discount_amount || 0);

        this.saleDetails.discount_percent =
          Math.round(((discountAmount / tempAmount) * 100 || 0) * 100) / 100;
      }
    });

    return discountAmount;
  }

  duplicate = async (item) => {
    this.initializeData();
    const saleDetails = JSON.parse(JSON.stringify(item));

    runInAction(async () => {
      /**
       * in case of online order no edit is allowed.
       */
      if (saleDetails.posId === 0) {
        this.items = [];
        for (let i of saleDetails.item_list) {
          i.isEdit = false;
          this.items.push(i);
        }
      } else {
        this.items = saleDetails.item_list;
      }

      this.saleDetails = saleDetails;
      this.saleDetails.sequenceNumber = '';
      this.saleDetails.invoice_number = '';
      this.saleDetails.invoice_date = getTodayDateInYYYYMMDD();
      this.saleDetails.ewayBillStatus = 'Not Generated';
      this.saleDetails.ewayBillDetails = null;
      this.saleDetails.einvoiceBillStatus = 'Pending';
      this.saleDetails.einvoiceDetails = null;
      this.saleDetails.irnNo = '';
      this.saleDetails.ewayBillGeneratedDate = '';
      this.saleDetails.einvoiceBillGeneratedDate = '';
      this.saleDetails.ewayBillValidDate = '';
      this.saleDetails.isCancelled = false;
      this.saleDetails.isSyncedToServer = false;
      this.saleDetails.invoiceStatus = '';
      this.saleDetails.tallySyncedStatus = '';
      this.saleDetails.calculateStockAndBalance = true;
      this.saleDetails.tallySynced = false;
      this.saleDetails.sortingNumber = 0;
      this.saleDetails.eInvoiceErrorMessage = '';
      this.saleDetails.amendmentDate = '';
      this.saleDetails.amended = false;
      this.saleDetails.amendmentReason = '';
      this.saleDetails.is_credit = false;
      this.saleDetails.linkPayment = false;
      this.saleDetails.linkPayment = false;
      this.saleDetails.isPartiallyReturned = false;
      this.saleDetails.isFullyReturned = false;
      this.saleDetails.linked_amount = 0;
      this.saleDetails.balance_amount = 0;
      this.saleDetails.linkedTxnList = [];

      await this.checkForTaxAndLoadUI();
    });

    if (this.saleDetails.splitPaymentList === undefined) {
      runInAction(() => {
        this.saleDetails.splitPaymentList = [];
      });
    }

    runInAction(() => {
      if (this.saleDetails.payment_type === 'Split') {
        this.chosenPaymentType = 'Split';
      } else {
        this.chosenPaymentType = 'Cash';
      }
    });

    runInAction(() => {
      this.openAddSalesInvoice = true;
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
      if (businessStateCode !== '') {
        let result = getStateList().find((e) => e.name === taxData.state);
        this.setPlaceOfSupplyState(result.name);
        this.setPlaceOfSupply(result.val);
      }
      if (item.customerGSTNo && item.customerGSTNo !== '') {
        let customerExtractedStateCode = item.customerGSTNo.slice(0, 2);
        this.setPlaceOfSupplyState(item.customerState);
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
          this.setPlaceOfSupplyState(item.customerState);
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

  initializeData = async () => {
    await this.initializeSettings();
    runInAction(() => {
      this.previousBalanceAmount = 0;
      this.shippingTax = this.saleAuditDetails.shippingPackingTax;
      this.packingTax = this.saleAuditDetails.shippingPackingTax;
      this.insuranceTax = this.saleAuditDetails.shippingPackingTax;
      this.isUpdate = false;
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.existingSaleData = this.saleOrderDetails;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.chosenPaymentType = 'Cash';
      this.isCGSTSGSTEnabledByPOS = true;
      this.isComingFromProductSearch = false;
      this.invoiceData = {};
      this.printData = null;
      this.openPrintSelectionAlert = false;
      this.printBalance = {};
      this.chosenPaymentType = 'Cash';
      this.isLocked = false;
      this.saleLockMessage = '';
      this.insurance = new Insurance().defaultValues();
      this.customerCreditDays = 0;

      this.setNotPerformAmendement(false);
    });
  };

  initializeSettings = () => {
    runInAction(async () => {
      this.saleAuditDetails = await audit.getAuditSettingsData();
      const saleTransSettings = await getSaleTransactionSettings();
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
      if (this.metalList && this.metalList.length > 0) {
        for (let rate of this.metalList) {
          if (rate.defaultBool === true) {
            this.addRateToList(rate);
          }
        }
      }
      this.prepareColumnIndices();
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

  convertSessionToSale = async (item, session) => {
    await this.initializeSettings();
    this.previousBalanceAmount = 0;
    this.sessionOrderDetails = item;
    this.sessionId = session.sessionId;

    runInAction(() => {
      this.shippingTax = this.saleAuditDetails.shippingPackingTax;
      this.packingTax = this.saleAuditDetails.shippingPackingTax;
      this.insuranceTax = this.saleAuditDetails.shippingPackingTax;
      this.openAddSalesInvoice = true;
      this.isUpdate = false;
      this.isRestore = false;
      this.isCancelledRestore = false;
      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];
      this.salesInvoiceRegular = {};
      this.salesInvoiceThermal = {};
      this.chosenPaymentType = 'Cash';
      this.isCGSTSGSTEnabledByPOS = true;
      this.isComingFromProductSearch = false;
      this.invoiceData = {};
      this.setNotPerformAmendement(false);
    });

    let custAddnDetails = await this.getCustomerDataOnConvertion(
      item.customerId
    );

    const saleDetails = {
      customer_id: item.customerId,
      customer_name: item.customerName,
      customer_address: item.customerAddress,
      customerGSTNo: item.customerGSTNo,
      customerGstType: item.customerGstType,
      customer_phoneNo: item.customerPhoneNo,
      customer_emailId: item.customerEmailId,
      customer_city: item.customerCity,
      customer_pincode: item.customerPincode,
      customerState: item.customerState,
      customerCountry: item.customerCountry,
      is_roundoff: false,
      round_amount: 0,
      total_amount: item.totalAmount,
      invoice_number: 0,
      invoice_date: getTodayDateInYYYYMMDD(),
      is_credit: custAddnDetails.balance > 0 ? true : false,
      payment_type: custAddnDetails.balance > 0 ? 'Credit' : 'cash',
      businessId: item.businessId,
      businessCity: item.businessCity,
      discount_amount: 0,
      discount_percent: 0,
      discount_type: '',
      posId: item.posId,
      packing_charge: 0,
      shipping_charge: 0,
      paymentReferenceNumber: '',
      isFullyReturned: false,
      isPartiallyReturned: false,
      linked_amount: 0,
      linkPayment: false,
      linkedTxnList: [],
      rateList: [],
      poInvoiceNo: '',
      vehicleNo: '',
      transportMode: 'Road',
      notes: item.notes,
      ewayBillStatus: 'Not Generated',
      ewayBillDetails: null,
      einvoiceBillStatus: 'Pending',
      einvoiceDetails: null,
      irnNo: '',
      vehicleType: 'Regular',
      approxDistance: 0,
      transporterName: '',
      transporterId: '',
      ewayBillGeneratedDate: '',
      einvoiceBillGeneratedDate: '',
      ewayBillValidDate: '',
      customerTradeName: custAddnDetails.tradeName,
      customerLegalName: custAddnDetails.legalName,
      shipToCustomerTradeName: '',
      shipToCustomerLegalName: '',
      customerRegistrationNumber: custAddnDetails.registrationNumber,
      customerPanNumber: custAddnDetails.panNumber,
      shipToCustomerRegistrationNumber: '',
      shipToCustomerPanNumber: '',
      convertedToDC: false,
      tcsAmount: 0,
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      dueDate: null,
      tdsAmount: 0,
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      splitPaymentList: [],
      place_of_supply: item.customerState
        ? this.getSelectedPlaceOfSupplyValue(item.customerState)
        : '',
      placeOfSupplyName: item.customerState ? item.customerState : '',
      weightIn: 0,
      weightOut: 0,
      wastage: 0,
      jobAssignedEmployeeId: '',
      jobAssignedEmployeeName: '',
      jobAssignedEmployeePhoneNumber: '',
      ewayBillNo: '',
      isCancelled: false,
      isSyncedToServer: false,
      invoiceStatus: '',
      tallySyncedStatus: '',
      calculateStockAndBalance: true,
      tallySynced: false,
      aadharNumber: custAddnDetails.aadharNumber,
      eWayErrorMessage: '',
      eInvoiceErrorMessage: '',
      salesEmployeeName: '',
      salesEmployeeId: '',
      salesEmployeePhoneNumber: '',
      schemeId: '',
      shippingTax: null,
      packingTax: null,
      amendmentDate: '',
      amended: false,
      amendmentReason: '',
      exportType: '',
      exportCountry: '',
      exportCurrency: '',
      exportConversionRate: 0,
      exportShippingBillNo: '',
      exportShippingBillDate: '',
      exportShippingPortCode: '',
      discountPercentForAllItems: 0,
      insurance: null,
      imageUrls: []
    };

    this.items = [];

    this.items.push({
      product_id: '',
      batch_id: 0,
      description: '',
      imageUrl: '',
      item_name: 'Payment towards session',
      sku: '',
      barcode: '',
      mrp: session.amount,
      purchased_price: 0,
      offer_price: 0,
      mrp_before_tax: session.amount,
      size: 0,
      qty: 1,
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
      amount: session.amount,
      roundOff: 0,
      isEdit: true,
      returnedQty: 0,
      stockQty: 0,
      wastagePercentage: '',
      wastageGrams: '',
      grossWeight: '',
      netWeight: '',
      purity: '',
      hsn: '',
      makingChargePercent: 0,
      makingChargeAmount: 0,
      makingChargePerGramAmount: 0,
      makingChargeType: '',
      serialOrImeiNo: '',
      makingChargeIncluded: false,
      freeQty: 0,
      freeStockQty: 0,
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
      itemNumber: 0,
      originalDiscountPercent: 0,
      properties: [],
      addOnProperties: [],
      dailyRate: ''
    });

    this.saleDetails = saleDetails;

    await this.checkForTaxAndLoadUI(this.saleDetails);

    if (this.saleTxnSettingsData.enableTCS === true) {
      this.saleDetails.tcsName = custAddnDetails.tcsName;
      this.saleDetails.tcsRate = custAddnDetails.tcsRate;
      this.saleDetails.tcsCode = custAddnDetails.tcsCode;
    }

    if (this.saleTxnSettingsData.enableTDS === true) {
      this.saleDetails.tdsName = custAddnDetails.tdsName;
      this.saleDetails.tdsRate = custAddnDetails.tdsRate;
      this.saleDetails.tdsCode = custAddnDetails.tdsCode;
    }

    this.generateInvoiceNumber();

    /**
     * get customer txn which are un used
     */
    const db = await Db.get();

    if (
      this.saleDetails.customer_id !== '' &&
      this.saleDetails.customer_id.length > 2
    ) {
      await lp.getAllUnPaidTxnForCustomer(
        this,
        db,
        this.saleDetails.customer_id,
        'Sales'
      );
    }

    runInAction(() => {
      this.openAddSalesInvoice = true;
    });
  };

  updateSessionPaymentDetails = async (saleDetails) => {
    let oldTxnData = await getSessionGroupDataById(
      this.sessionOrderDetails.sessionGroupId
    );
    if (!oldTxnData) {
      return;
    }
    let newTxnData = {};
    newTxnData.sessionGroupId = oldTxnData.sessionGroupId;
    newTxnData.updatedAt = Date.now();
    let updateSelector;

    newTxnData.date = this.sessionOrderDetails.date;
    newTxnData.noOfSession = this.sessionOrderDetails.noOfSession;
    newTxnData.sessionList = this.sessionOrderDetails.sessionList;
    newTxnData.amount = this.sessionOrderDetails.amount;
    newTxnData.totalAmount = this.sessionOrderDetails.totalAmount;
    newTxnData.perSession = this.sessionOrderDetails.perSession;
    updateSelector = {
      $set: {
        date: newTxnData.date,
        noOfSession: newTxnData.noOfSession,
        sessionList: newTxnData.sessionList,
        updatedAt: newTxnData.updatedAt,
        totalAmount: newTxnData.totalAmount,
        amount: newTxnData.amount,
        perSession: newTxnData.perSession
      }
    };

    oldTxnData.sessionList.map((list) => {
      if (list.sessionId === this.sessionId) {
        list.saleDetail = {
          saleId: saleDetails.invoice_number,
          sequenceNumber: saleDetails.sequenceNumber,
          saleDate: saleDetails.invoice_date
        };
      }
    });
    newTxnData.sessionList = oldTxnData.sessionList;
    updateSelector = {
      $set: {
        sessionList: newTxnData.sessionList,
        updatedAt: newTxnData.updatedAt
      }
    };

    const updated = await updateSessionGroup(
      this.sessionOrderDetails.sessionGroupId,
      updateSelector
    );
    if (updated) {
      this.sessionOrderDetails = {};
      this.sessionId = '';
    }
  };

  setInsuranceType = (value) => {
    runInAction(() => {
      if (value === '%') {
        this.insurance.type = 'percentage';
      } else {
        this.insurance.type = 'amount';
      }
    });
  };

  setInsuranceAmount = (value) => {
    runInAction(() => {
      this.insurance.type = 'amount';
      this.insurance.amount = value ? parseFloat(value) : '';
      this.insurance.amountOtherCurrency = this.populateOtherCurrencyValue(
        this.insurance.amount
      );
    });
  };

  setInsurancePercent = (value) => {
    runInAction(() => {
      this.insurance.type = 'percentage';
      this.insurance.percent = value ? parseFloat(value) : '';
    });
  };

  setInsurancePolicyNo = (value) => {
    runInAction(() => {
      this.insurance.policyNo = value;
    });
  };

  setInsuranceTax = (value) => {
    runInAction(() => {
      this.insuranceTax = value ? parseFloat(value) : '';
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

  setColumnIndex = (value) => {
    runInAction(() => {
      this.columnIndexMap = value;
    });
  };

  /** Clone sale details */

  cloneSaleDetals = async (item) => {
    runInAction(() => {
      const saleDetails = JSON.parse(JSON.stringify(item));
      this.saleDetails = saleDetails;
      this.existingSaleData = saleDetails;
      this.items = saleDetails.item_list;
    });
  };

  /** Refactored way to handle Sales details
   * Single source for handling the Sales keys
   */

  setSalesDetails = async (key, value) => {
    runInAction(() => {
      this.saleDetails[key] = value;
      if (key === 'exportConversionRate') this.calculateOtherCurrencyMrp();
    });
  };

  formatNumber(number) {
    // If number is an integer, return it as is
    if (Number.isInteger(number)) return number;

    // If number has one or two decimals, use toFixed(2) and remove trailing zeros
    return parseFloat(number.toFixed(2));
  }

  /** Refactored way to handle Sale item details
   *  Single source for handling the Sale item keys
   */

  updateSaleItem = async (itemId, key, value, index) => {
    let itemsList = JSON.parse(JSON.stringify(this.items));
    itemsList = itemsList.map((data, i) => {
      let totalObj = {};
      if (key === 'totalPackingNos') {
        let totalPackageNetWeight = this.formatNumber(
          value * data.netWeightPerPackage || 0
        );
        let totalPackageGrossWeight = this.formatNumber(
          value * data.grossWeightPerPackage || 0
        );
        totalObj = { totalPackageNetWeight, totalPackageGrossWeight };
      }
      return data.product_id === itemId && i === index
        ? { ...data, [key]: value, ...totalObj }
        : data;
    });

    runInAction(() => {
      this.isUpdate = true;
      this.items = itemsList;
    });
  };

  calculateOtherCurrencyMrp = () => {
    if (!this.items) {
      return;
    }

    this.items.forEach((item, index) => {
      runInAction(() => {
        this.setMrpOtherCurrency(index);
      });
    });
  };

  setMrpOtherCurrency = (index) => {
    if (!this.items) {
      return;
    }

    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].mrpOtherCurrency = this.populateOtherCurrencyValue(
        this.items[index].mrp
      );
      this.items[index].amountOtherCurrency = this.populateOtherCurrencyValue(
        this.items[index].amount
      );
    });
  };

  /**
   *  Utility to validate and calculate other currency price
   *
   */
  populateOtherCurrencyValue = (value) => {
    if (
      !(
        this.saleTxnSettingsData &&
        this.saleTxnSettingsData.enableExport &&
        this.saleDetails.exportConversionRate > 0
      )
    )
      return 0;

    const parsedValue = parseFloat(value);
    const parsedConversionRate = parseFloat(
      this.saleDetails?.exportConversionRate || 0
    );

    const isValidNumbers = !isNaN(parsedValue) && !isNaN(parsedConversionRate);
    return isValidNumbers ? parsedValue / parsedConversionRate : 0;
  };

  setPlaceOfSupplyState = (val) => {
    runInAction(() => {
      this.placeOfSupplyState = val;
    });
  };

  setCreditLimitDays = (value) => {
    runInAction(() => {
      this.customerCreditDays = value;
    });
  };

  constructor() {
    this.saleDetails = new Sales().defaultValues();
    this.items = [new SalesItem().defaultValues()];
    this.insurance = new Insurance().defaultValues();

    makeObservable(this, {
      saleDetails: observable,
      items: observable,
      getTotalAmount: computed,
      getTotalNetWeight: computed,
      getTotalGrossWeight: computed,
      getTotalWatage: computed,
      getBalanceData: computed,
      getRoundedAmount: computed,
      newCustomer: observable,
      newCustomerData: observable,
      isUpdate: observable,
      openAddSalesInvoice: observable,
      OpenBatchList: observable,
      OpenSerialList: observable,
      selectedProduct: observable,
      FocusLastIndex: observable,
      salesData: observable,
      totalSalesData: observable,
      sales: observable,
      getSalesData: computed,
      getsalesdetails: action,
      customerList: observable,
      getBalanceAfterLinkedAmount: computed,
      dateDropValue: observable,
      isSalesList: observable,
      getsalesList: action,
      openLinkpaymentPage: observable,
      paymentLinkTransactions: observable,
      enabledRow: observable,
      profitLossDetailDialogOpen: observable,
      profitLossDetails: observable,
      openRegularPrint: observable,
      addNewRowEnabled: observable,
      salesTxnEnableFieldsMap: observable,
      taxSettingsData: observable,
      openInvoiceNumModal: observable,
      openInvNumDubCheck: observable,
      previousBalanceAmount: observable,
      chosenMetalList: observable,
      openTransportDetails: observable,
      openPODetails: observable,
      saleTxnSettingsData: observable,
      printBalance: observable,
      openSaleLoadingAlertMessage: observable,
      openSaleErrorAlertMessage: observable,
      manualSequenceNumber: observable,
      openPrintSelectionAlert: observable,
      sequenceNumberFailureAlert: observable,
      previousCreditFlag: observable,
      descriptionCollapsibleMap: observable,
      openSplitPaymentDetails: observable,
      chosenPaymentType: observable,
      openAddressList: observable,
      customerAddressList: observable,
      splitPaymentSettingsData: observable,
      isLaunchEWayAfterSaleCreation: observable,
      errorAlertMessage: observable,
      isCGSTSGSTEnabledByPOS: observable,
      isCancelledRestore: observable,
      cancelRemark: observable,
      isLocked: observable,
      openCancelDialog: observable,
      productOutOfStockAlert: observable,
      productOutOfStockName: observable,
      productAddOnsData: observable,
      openAddonList: observable,
      addonIndex: observable,
      selectedProductData: observable,
      openAmendmentDialog: observable,
      notPerformAmendment: observable,
      shippingTax: observable,
      packingTax: observable,
      openMfgDetails: observable,
      openProductDetails: observable,
      isComingFromProductSearch: observable,
      insurance: observable,
      insuranceTax: observable,
      cancelItemIsEInvoice: observable,
      columnIndexMap: observable,
      placeOfSupplyState: observable,
      customerCreditDays: observable
    });
  }
}
export default new SalesAddStore();
