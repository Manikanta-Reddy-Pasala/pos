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
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import * as balanceUpdate from '../../components/Helpers/CustomerAndVendorBalanceHelper';
import * as timestamp from '../../components/Helpers/TimeStampGeneratorHelper';
import * as lp from '../../components/Helpers/LinkPaymentHelper';
import { getTodayDateInYYYYMMDD } from 'src/components/Helpers/DateHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';
import { getProductDataById } from 'src/components/Helpers/dbQueries/businessproduct';

class PurchasesReturnsAddStore {
  newCustomer = false;

  isUpdate = false;

  OpenAddPurchasesReturn = false;

  saveAndNew = false;

  enabledrow = 0;

  itemDataForUpdate;

  newCustomerData = {};
  selectedCustomerBalance = 0;

  openMultipleBillSelectionPopUp = false;
  openMultipleBillForSameVendorSelectionPopUp = false;
  closeMultipleBillForSameVendorSelectionPopUp = false;

  isBillNumberInValid = false;

  returnDetails = {
    vendor_id: '',
    vendor_name: '',
    vendor_gst_number: '',
    vendor_gst_type: '',
    vendor_phone_number: '',
    bill_number: 0,
    vendor_bill_number: 0,
    purchase_return_number: '',
    date: getTodayDateInYYYYMMDD(),
    is_roundoff: false,
    round_amount: 0.0,
    total_amount: 0.0,
    payment_type: 'Credit',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    received_amount: 0.0,
    balance_amount: 0.0,
    paymentStatus: 'Un Used',
    linkPayment: false,
    linked_amount: 0,
    linkedTxnList: [],
    vendor_payable: false,
    discount_percent: 0,
    discount_amount: 0,
    discount_type: '',
    reverseChargeEnable: false,
    reverseChargeValue: 0,
    notes: '',
    vendorCity: '',
    vendorPincode: '',
    vendorAddress: '',
    vendorState: '',
    vendorCountry: '',
    vendor_email_id: '',
    shipping_charge: 0,
    packing_charge: 0,
    return_discount_amount: 0,
    purchaseReturnBillNumber: '',
    rateList: [],
    dueDate: getTodayDateInYYYYMMDD(),
    vendorPanNumber: '',
    isSyncedToServer: false,
    invoiceStatus: '',
    tallySyncedStatus: '',
    calculateStockAndBalance: true,
    tallySynced: false,
    aadharNumber: '',
    purchaseDate: '',
    purchaseTotalAmount: 0,
    discountPercentForAllItems: 0,
    imageUrls: []
  };

  purchasedDetails = {
    vendor_id: '',
    isPartiallyReturned: '',
    isFullyReturned: '',
    balanceAmount: 0,
    isCredit: false,
    paidAmount: 0
  };

  purchasedItems = [
    {
      product_id: '',
      description: '',
      imageUrl: '',
      batch_id: 0,
      item_name: '',
      sku: '',
      barcode: '',
      purchased_price: 0,
      mrp: 0,
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
      returnChecked: false
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
      purchased_price: 0,
      mrp: 0,
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
      isEdit: true,
      stockQty: 0,
      vendorName: '',
      vendorPhoneNumber: '',
      brandName: '',
      categoryLevel2: '',
      categoryLevel2DisplayName: '',
      categoryLevel3: '',
      categoryLevel3DisplayName: '',
      returnChecked: false,
      taxIncluded: false
    }
  ];

  paymentLinkTransactions = [];

  openLinkpaymentPage = false;

  paymentUnLinkTransactions = [];
  unLinkedTxnList = [];
  isPurchaseReturnList = false;

  multiplePurchaseBillsByVendor = [];

  returnDetailsList = [];

  returnsInvoiceRegular = {};
  returnsInvoiceThermal = {};

  taxSettingsData = {};

  isRestore = false;

  isPurchaseReturnConvertion = false;

  purchaseTxnEnableFieldsMap = new Map();

  printPurchaseReturnData = null;
  printBalance = {};

  purchaseReturnTxnSettingsData = {};

  openPurchaseReturnLoadingAlertMessage = false;
  openPurchaseReturnErrorAlertMessage = false;

  openPurchaseReturnPrintSelectionAlert = false;

  roundingConfiguration = 'Nearest 50';

  selectedProduct = {};
  selectedIndex = -1;
  OpenPurchaseReturnSerialList = false;

  viewOrEditPurchaseReturnTxnItem = async (item) => {
    this.viewOrEditItem(item, true);
  };

  deletePurchaseReturnTxnItem = async (item) => {
    if (
      !('calculateStockAndBalance' in item) ||
      !item.calculateStockAndBalance
    ) {
      item.calculateStockAndBalance = true;
    }

    await this.deletePurchaseReturn(item);
  };

  openPurchaseReturn = async (item) => {
    // console.log('item::', item);

    /**
     * get purchase link txn
     */
    runInAction(() => {
      this.paymentLinkTransactions = [];
      this.returnDetails.linked_amount = 0;
      this.returnDetails.linkPayment = false;
    });

    if (item.balance_amount > 0) {
      const db = await Db.get();
      await this.getAllUnPaidTxnForVendor(db, item.vendor_id);
    }

    await this.openForNewReturn();

    await this.loadPurchaseDataByVendorBillNumberAndBillNumber(
      item.vendor_bill_number,
      item.vendor_id,
      item.bill_number
    );

    runInAction(() => {
      this.returnDetails.bill_number = item.bill_number;
      this.returnDetails.payment_type = 'Credit';
      this.returnDetails.packing_charge = 0;
      this.returnDetails.shipping_charge = 0;
      this.returnDetails.return_discount_amount = 0;
      this.returnDetails.imageUrls = [];
      this.setPurchaseReturnProperty('bill_number', item.bill_number);

      this.isUpdate = false;
      this.isRestore = false;
      this.isPurchaseReturnConvertion = true;
      this.OpenAddPurchasesReturn = true;
    });

    // console.log('last:::', this.returnDetails);
  };

  getPurchaseReturnsCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.purchasesreturn
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        this.isPurchaseReturnList = data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  loadPurchaseDataByVendorBillNumber = async (vendor_bill_number) => {
    if (vendor_bill_number) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const query = db.purchases.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { vendor_bill_number: vendor_bill_number }
          ]
        }
      });

      await query.exec().then(async (data) => {
        if (data) {
          /**
           * below 2 lines for loading purchase data
           */
          runInAction(() => {
            this.items = [];
          });
          let tempItems = [];
          for (let item of data.item_list) {
            item.qty = parseFloat(item.qty) - parseFloat(item.returnedQty);
            item.freeQty =
              parseFloat(item.freeQty) - parseFloat(item.returnedFreeQty);
            if (item.qty > 0 || item.freeQty > 0) {
              tempItems.push(item);
            }
          }
          runInAction(() => {
            this.items = tempItems;
            if (this.items.length === 1) {
              this.items[0].returnChecked = true;
            }
            this.returnDetails.vendor_id = data.vendor_id;
            this.returnDetails.vendor_name = data.vendor_name;
            this.returnDetails.vendor_gst_number = data.vendor_gst_number;
            this.returnDetails.vendor_gst_type = data.vendor_gst_type;
            this.returnDetails.vendor_phone_number = data.vendor_phone_number;
            this.returnDetails.vendor_email_id = data.vendor_email_id;
            this.returnDetails.vendorCity = data.vendorCity;
            this.returnDetails.vendorPincode = data.vendorPincode;
            this.returnDetails.vendorAddress = data.vendorAddress;
            this.returnDetails.vendorState = data.vendorState;
            this.returnDetails.vendorCountry = data.vendorCountry;
            this.returnDetails.vendorPanNumber = data.vendorPanNumber;
            this.returnDetails.aadharNumber = data.aadharNumber;
            this.returnDetails.purchaseDate = data.bill_date;
            this.returnDetails.purchaseTotalAmount = data.total_amount;
            this.returnDetails.discountPercentForAllItems =
              data.discountPercentForAllItems;
            this.returnDetails.imageUrls = data.imageUrls;

            /**
             * below is for keeping history to handle invalid purchase returns
             */
            this.purchasedItems = data.item_list;
            this.purchasedDetails.vendor_id = data.vendor_id;
            this.purchasedDetails.vendor_phone_number =
              data.vendor_phone_number;
            this.purchasedDetails.isPartiallyReturned =
              data.isPartiallyReturned;
            this.purchasedDetails.isFullyReturned = data.isFullyReturned;
            this.purchasedDetails.balanceAmount = data.balance_amount;
            this.purchasedDetails.isCredit = data.is_credit;
            // this.purchasedDetails.paidAmount = data.paid_amount;

            this.returnDetails.discount_percent = parseFloat(
              data.discount_percent || 0
            );
            this.returnDetails.discount_amount = parseFloat(
              data.discount_amount || 0
            );
            this.returnDetails.discount_type = data.discount_type;
            this.returnDetails.vendor_bill_number = data.vendor_bill_number;
            this.returnDetails.bill_number = data.bill_number;

            this.returnDetails.total_amount = this.getTotalAmount;
            this.returnDetails.balance_amount = this.getBalanceData;
            this.returnDetails.reverseChargeEnable = data.reverseChargeEnable;
            this.returnDetails.reverseChargeValue = data.reverseChargeValue;
            this.returnDetails.rateList = data.rateList;
            this.returnDetails.tcsAmount = data.tcsAmount;
            this.returnDetails.tcsName = data.tcsName;
            this.returnDetails.tcsRate = data.tcsRate;
            this.returnDetails.tcsCode = data.tcsCode;
            this.returnDetails.dueDate = data.dueDate;
            this.returnDetails.tdsAmount = data.tdsAmount;
            this.returnDetails.tdsName = data.tdsName;
            this.returnDetails.tdsRate = data.tdsRate;
            this.returnDetails.tdsCode = data.tdsCode;
            this.returnDetails.splitPaymentList = data.splitPaymentList;
          });

          /**
           * get link payment data
           */ runInAction(() => {
            this.paymentLinkTransactions = [];
          });
          if (this.purchasedDetails.balanceAmount > 0) {
            this.getAllUnPaidTxnForVendor(db, this.returnDetails.vendor_id);
          }
        }
      });
    }
  };

  loadPurchaseDataByVendorBillNumberAndVendorId = async (
    vendor_bill_number,
    vendor_id
  ) => {
    if (vendor_bill_number) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const query = db.purchases.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { vendor_id: { $eq: vendor_id } },
            { vendor_bill_number: { $eq: vendor_bill_number } }
          ]
        }
      });

      await query.exec().then(async (data) => {
        if (data) {
          /**
           * below 2 lines for loading purchase data
           */
          this.items = [];
          let tempItems = [];
          for (let item of data.item_list) {
            item.qty = parseFloat(item.qty) - parseFloat(item.returnedQty);
            item.freeQty =
              parseFloat(item.freeQty) - parseFloat(item.returnedFreeQty);
            if (item.qty > 0 || item.freeQty > 0) {
              tempItems.push(item);
            }
          }

          runInAction(() => {
            this.items = tempItems;
            if (this.items.length === 1) {
              this.items[0].returnChecked = true;
            }
            this.returnDetails.vendor_id = data.vendor_id;
            this.returnDetails.vendor_name = data.vendor_name;
            this.returnDetails.vendor_gst_number = data.vendor_gst_number;
            this.returnDetails.vendor_gst_type = data.vendor_gst_type;

            this.returnDetails.vendor_phone_number = data.vendor_phone_number;
            this.returnDetails.vendor_email_id = data.vendor_email_id;
            this.returnDetails.vendorCity = data.vendorCity;
            this.returnDetails.vendorPincode = data.vendorPincode;
            this.returnDetails.vendorAddress = data.vendorAddress;
            this.returnDetails.vendorState = data.vendorState;
            this.returnDetails.vendorCountry = data.vendorCountry;
            this.returnDetails.vendorPanNumber = data.vendorPanNumber;
            this.returnDetails.aadharNumber = data.aadharNumber;
            this.returnDetails.purchaseDate = data.bill_date;
            this.returnDetails.purchaseTotalAmount = data.total_amount;
            this.returnDetails.discountPercentForAllItems =
              data.discountPercentForAllItems;
            this.returnDetails.imageUrls = data.imageUrls;
            /**
             * below is for keeping history to handle invalid purchase returns
             */
            this.purchasedItems = data.item_list;
            this.purchasedDetails.vendor_id = data.vendor_id;
            this.purchasedDetails.vendor_phone_number =
              data.vendor_phone_number;

            this.purchasedDetails.isPartiallyReturned =
              data.isPartiallyReturned;
            this.purchasedDetails.isFullyReturned = data.isFullyReturned;
            this.purchasedDetails.balanceAmount = data.balance_amount;
            this.purchasedDetails.isCredit = data.is_credit;
            // this.purchasedDetails.paidAmount = data.paid_amount;

            this.returnDetails.discount_percent = parseFloat(
              data.discount_percent || 0
            );
            this.returnDetails.discount_amount = parseFloat(
              data.discount_amount || 0
            );
            this.returnDetails.discount_type = data.discount_type;
            this.returnDetails.vendor_bill_number = data.vendor_bill_number;
            this.returnDetails.bill_number = data.bill_number;

            // console.log('before balance::', this.saleDetails);
            this.returnDetails.total_amount = this.getTotalAmount;
            this.returnDetails.balance_amount = this.getBalanceData;
            this.returnDetails.reverseChargeEnable = data.reverseChargeEnable;
            this.returnDetails.reverseChargeValue = data.reverseChargeValue;
            this.returnDetails.rateList = data.rateList;
            this.returnDetails.tcsAmount = data.tcsAmount;
            this.returnDetails.tcsName = data.tcsName;
            this.returnDetails.tcsRate = data.tcsRate;
            this.returnDetails.tcsCode = data.tcsCode;
            this.returnDetails.dueDate = data.dueDate;
            this.returnDetails.tdsAmount = data.tdsAmount;
            this.returnDetails.tdsName = data.tdsName;
            this.returnDetails.tdsRate = data.tdsRate;
            this.returnDetails.tdsCode = data.tdsCode;
            this.returnDetails.splitPaymentList = data.splitPaymentList;
          });

          /**
           * get link payment data
           */
          runInAction(() => {
            this.paymentLinkTransactions = [];
          });
          if (this.purchasedDetails.balanceAmount > 0) {
            this.getAllUnPaidTxnForVendor(db, this.returnDetails.vendor_id);
          }
        }
      });
    }
  };

  loadPurchaseDataByVendorBillNumberAndBillNumber = async (
    vendor_bill_number,
    vendor_id,
    bill_number
  ) => {
    if (vendor_bill_number) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const query = db.purchases.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { vendor_id: { $eq: vendor_id } },
            { vendor_bill_number: { $eq: vendor_bill_number } },
            { bill_number: { $eq: bill_number } }
          ]
        }
      });

      await query.exec().then(async (data) => {
        if (data) {
          console.log(data);
          /**
           * below 2 lines for loading purchase data
           */
          this.items = [];
          let tempItems = [];
          for (let item of data.item_list) {
            item.qty = parseFloat(item.qty) - parseFloat(item.returnedQty) || 0;
            item.freeQty =
              parseFloat(item.freeQty) - parseFloat(item.returnedFreeQty) || 0;
            if (item.qty > 0 || item.freeQty > 0) {
              tempItems.push(item);
            }
          }

          runInAction(() => {
            this.items = tempItems;

            this.items.forEach(
              async (value, index) => await this.getAmount(index)
            );

            if (this.items.length === 1) {
              this.items[0].returnChecked = true;
            }
            this.returnDetails.vendor_id = data.vendor_id;
            this.returnDetails.vendor_name = data.vendor_name;
            this.returnDetails.vendor_gst_number = data.vendor_gst_number;
            this.returnDetails.vendor_gst_type = data.vendor_gst_type;

            this.returnDetails.vendor_phone_number = data.vendor_phone_number;
            this.returnDetails.vendorCity = data.vendorCity;
            this.returnDetails.vendorPincode = data.vendorPincode;
            this.returnDetails.vendorAddress = data.vendorAddress;
            this.returnDetails.vendorState = data.vendorState;
            this.returnDetails.vendorCountry = data.vendorCountry;
            this.returnDetails.vendor_email_id = data.vendor_email_id;
            this.returnDetails.vendorPanNumber = data.vendorPanNumber;
            this.returnDetails.aadharNumber = data.aadharNumber;
            this.returnDetails.purchaseDate = data.bill_date;
            this.returnDetails.purchaseTotalAmount = data.total_amount;
            this.returnDetails.discountPercentForAllItems =
              data.discountPercentForAllItems;
            this.returnDetails.imageUrls = data.imageUrls;
            /**
             * below is for keeping history to handle invalid purchase returns
             */
            this.purchasedItems = data.item_list;
            this.purchasedDetails.vendor_id = data.vendor_id;
            this.purchasedDetails.vendor_phone_number =
              data.vendor_phone_number;

            this.purchasedDetails.isPartiallyReturned =
              data.isPartiallyReturned;
            this.purchasedDetails.isFullyReturned = data.isFullyReturned;
            this.purchasedDetails.balanceAmount = data.balance_amount;
            this.purchasedDetails.isCredit = data.is_credit;
            // this.purchasedDetails.paidAmount = data.paid_amount;

            this.returnDetails.discount_percent = parseFloat(
              data.discount_percent || 0
            );
            this.returnDetails.discount_amount = parseFloat(
              data.discount_amount || 0
            );
            this.returnDetails.discount_type = data.discount_type;
            this.returnDetails.vendor_bill_number = data.vendor_bill_number;
            this.returnDetails.bill_number = data.bill_number;

            // console.log('before balance::', this.saleDetails);
            this.returnDetails.total_amount = this.getTotalAmount;
            this.returnDetails.balance_amount = this.getBalanceData;
            this.returnDetails.reverseChargeValue = data.reverseChargeValue;
            this.returnDetails.reverseChargeEnable = data.reverseChargeEnable;
            this.returnDetails.is_roundoff = data.is_roundoff;
            if (this.isRestore) {
              this.returnDetails.employeeId = data.employeeId;
            }
            this.returnDetails.rateList = data.rateList;
            this.returnDetails.tcsAmount = data.tcsAmount;
            this.returnDetails.tcsName = data.tcsName;
            this.returnDetails.tcsRate = data.tcsRate;
            this.returnDetails.tcsCode = data.tcsCode;
            this.returnDetails.dueDate = data.dueDate;
            this.returnDetails.tdsAmount = data.tdsAmount;
            this.returnDetails.tdsName = data.tdsName;
            this.returnDetails.tdsRate = data.tdsRate;
            this.returnDetails.tdsCode = data.tdsCode;
            this.returnDetails.splitPaymentList = data.splitPaymentList;
          });

          /**
           * get link payment data
           */
          runInAction(() => {
            this.paymentLinkTransactions = [];
          });
          if (this.purchasedDetails.balanceAmount > 0) {
            await this.getAllUnPaidTxnForVendor(
              db,
              this.returnDetails.vendor_id
            );
          }
        }
      });
    }
  };

  checkPurchaseDataByVendorWithMultipleBillNumbers = async (
    vendor_id,
    vendor_bill_number
  ) => {
    this.openMultipleBillSelectionPopUp = false;
    this.isBillNumberInValid = false;

    if (vendor_bill_number) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

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
          runInAction(() => {
            if (data) {
              if (data.length > 1) {
                this.multiplePurchaseBillsByVendor = data;
                this.openMultipleBillForSameVendorSelectionPopUp = true;
              } else if (data.length === 0) {
                this.isBillNumberInValid = true;
              } else {
                this.loadPurchaseDataByVendorBillNumberAndVendorId(
                  vendor_bill_number,
                  vendor_id
                );
              }
            } else {
              this.isBillNumberInValid = true;
            }
          });
        })

        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    }
  };

  selectBillNoFromMultipleBillsPopUpForSameVendor = async (
    vendor_bill_number,
    vendor_id,
    bill_number
  ) => {
    runInAction(() => {
      this.openMultipleBillForSameVendorSelectionPopUp = false;
    });
    this.loadPurchaseDataByVendorBillNumberAndBillNumber(
      vendor_bill_number,
      vendor_id,
      bill_number
    );
  };

  /**
   * called only during the delete
   */
  loadPurchaseData = async (bill_number, isInsideDelete) => {
    if (bill_number) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const query = db.purchases.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { bill_number: bill_number }
          ]
        }
      });

      await query.exec().then(async (data) => {
        if (data) {
          /**
           * below 2 lines for loading purchase data
           */
          runInAction(() => {
            this.items = [];
          });
          let tempItems = [];
          for (let item of data.item_list) {
            item.qty = parseFloat(item.qty) - parseFloat(item.returnedQty);
            item.freeQty =
              parseFloat(item.freeQty) - parseFloat(item.returnedFreeQty);
            if (item.qty > 0 || item.freeQty > 0) {
              tempItems.push(item);
            }
          }
          runInAction(() => {
            this.items = tempItems;
            if (this.items.length === 1) {
              this.items[0].returnChecked = true;
            }
            /**
             * calculate amount and total
             */
            this.returnDetails.total_amount = this.getTotalAmount;
            this.purchasedDetails.total_amount = data.vendor_id;

            this.returnDetails.vendor_id = data.vendor_id;
            this.returnDetails.vendor_name = data.vendor_name;
            this.returnDetails.vendor_gst_number = data.vendor_gst_number;
            this.returnDetails.vendor_gst_type = data.vendor_gst_type;

            this.returnDetails.vendor_phone_number = data.vendor_phone_number;
            this.returnDetails.vendor_email_id = data.vendor_email_id;
            this.returnDetails.vendorPanNumber = data.vendorPanNumber;
            this.returnDetails.vendorCity = data.vendorCity;
            this.returnDetails.vendorPincode = data.vendorPincode;
            this.returnDetails.vendorAddress = data.vendorAddress;
            this.returnDetails.vendorState = data.vendorState;
            this.returnDetails.vendorCountry = data.vendorCountry;
            this.returnDetails.aadharNumber = data.aadharNumber;
            this.returnDetails.purchaseDate = data.bill_date;
            this.returnDetails.purchaseTotalAmount = data.total_amount;
            this.returnDetails.discountPercentForAllItems =
              data.discountPercentForAllItems;
            this.returnDetails.imageUrls = data.imageUrls;
            //this.returnDetails.payment_type = 'cash';

            /**
             * below is for keeping history to handle invalid purchase returns
             */
            this.purchasedItems = data.item_list;
            this.purchasedDetails.vendor_id = data.vendor_id;
            this.purchasedDetails.vendor_phone_number =
              data.vendor_phone_number;

            this.purchasedDetails.isPartiallyReturned =
              data.isPartiallyReturned;
            this.purchasedDetails.isFullyReturned = data.isFullyReturned;
            this.purchasedDetails.balanceAmount = data.balance_amount;
            this.purchasedDetails.isCredit = data.is_credit;

            // /**
            //  * because we are populating paid amount as balance in case of cash purchase
            //  */
            // if (this.purchasedDetails.isCredit) {
            //   this.purchasedDetails.paidAmount = data.paid_amount;
            // } else {
            //   this.purchasedDetails.paidAmount = 0;
            // }

            this.returnDetails.discount_percent = parseFloat(
              data.discount_percent || 0
            );
            this.returnDetails.discount_amount = parseFloat(
              data.discount_amount || 0
            );
            this.returnDetails.discount_type = data.discount_type;

            this.returnDetails.vendor_bill_number = data.vendor_bill_number;

            this.returnDetails.total_amount = this.getTotalAmount;
            this.returnDetails.balance_amount = this.getBalanceData;
            this.returnDetails.reverseChargeValue = data.reverseChargeValue;
            this.returnDetails.reverseChargeEnable = data.reverseChargeEnable;
            this.returnDetails.rateList = data.rateList;
            this.returnDetails.tcsAmount = data.tcsAmount;
            this.returnDetails.tcsName = data.tcsName;
            this.returnDetails.tcsRate = data.tcsRate;
            this.returnDetails.tcsCode = data.tcsCode;
            this.returnDetails.dueDate = data.dueDate;
            this.returnDetails.tdsAmount = data.tdsAmount;
            this.returnDetails.tdsName = data.tdsName;
            this.returnDetails.tdsRate = data.tdsRate;
            this.returnDetails.tdsCode = data.tdsCode;
            this.returnDetails.splitPaymentList = data.splitPaymentList;
          });
        }
      });
    }
  };

  loadPurchaseDataFromReturn = async (data) => {
    if (data) {
      /**
       * below 2 lines for loading purchase data
       */
      runInAction(() => {
        this.items = [];
      });
      let tempItems = [];
      for (let item of data.item_list) {
        item.qty = parseFloat(item.qty) - parseFloat(item.returnedQty);
        item.freeQty =
          parseFloat(item.freeQty) - parseFloat(item.returnedFreeQty);
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
        /**
         * calculate amount and total
         */
        this.returnDetails.total_amount = this.getTotalAmount;
        this.purchasedDetails.total_amount = data.vendor_id;

        this.returnDetails.vendor_id = data.vendor_id;
        this.returnDetails.vendor_name = data.vendor_name;
        this.returnDetails.vendor_gst_number = data.vendor_gst_number;
        this.returnDetails.vendor_gst_type = data.vendor_gst_type;

        this.returnDetails.vendor_phone_number = data.vendor_phone_number;
        this.returnDetails.vendor_email_id = data.vendor_email_id;
        this.returnDetails.vendorCity = data.vendorCity;
        this.returnDetails.vendorPincode = data.vendorPincode;
        this.returnDetails.vendorAddress = data.vendorAddress;
        this.returnDetails.vendorState = data.vendorState;
        this.returnDetails.vendorCountry = data.vendorCountry;
        this.returnDetails.vendorPanNumber = data.vendorPanNumber;
        this.returnDetails.aadharNumber = data.aadharNumber;
        this.returnDetails.purchaseDate = data.bill_date;
        this.returnDetails.purchaseTotalAmount = data.total_amount;
        this.returnDetails.discountPercentForAllItems =
          data.discountPercentForAllItems;
        this.returnDetails.imageUrls = data.imageUrls;
        //this.returnDetails.payment_type = 'cash';

        /**
         * below is for keeping history to handle invalid purchase returns
         */
        this.purchasedItems = data.item_list;
        this.purchasedDetails.vendor_id = data.vendor_id;
        this.purchasedDetails.vendor_phone_number = data.vendor_phone_number;

        this.purchasedDetails.isPartiallyReturned = data.isPartiallyReturned;
        this.purchasedDetails.isFullyReturned = data.isFullyReturned;
        this.purchasedDetails.balanceAmount = data.balance_amount;
        this.purchasedDetails.isCredit = data.is_credit;
        // this.purchasedDetails.paidAmount = data.paid_amount;

        this.returnDetails.discount_percent = parseFloat(
          data.discount_percent || 0
        );
        this.returnDetails.discount_amount = parseFloat(
          data.discount_amount || 0
        );
        this.returnDetails.discount_type = data.discount_type;
        this.returnDetails.vendor_bill_number = data.vendor_bill_number;

        this.returnDetails.total_amount = this.getTotalAmount;
        this.returnDetails.balance_amount = this.getBalanceData;
        this.returnDetails.reverseChargeValue = data.reverseChargeValue;
        this.returnDetails.reverseChargeEnable = data.reverseChargeEnable;
        this.returnDetails.rateList = data.rateList;
        this.returnDetails.tcsAmount = data.tcsAmount;
        this.returnDetails.tcsName = data.tcsName;
        this.returnDetails.tcsRate = data.tcsRate;
        this.returnDetails.tcsCode = data.tcsCode;
        this.returnDetails.dueDate = data.dueDate;
        this.returnDetails.tdsAmount = data.tdsAmount;
        this.returnDetails.tdsName = data.tdsName;
        this.returnDetails.tdsRate = data.tdsRate;
        this.returnDetails.tdsCode = data.tdsCode;
        this.returnDetails.splitPaymentList = data.splitPaymentList;
      });
    }
  };

  calculateReceivedAndLinkPayment(total_amount) {
    console.log('selectedCustomerBalance:', this.selectedCustomerBalance);
    // console.log('received_amount:', this.returnDetails.received_amount);

    if (
      this.returnDetails['linkPayment'] &&
      this.returnDetails.vendor_payable
    ) {
      if (this.returnDetails.linkPayment && this.selectedCustomerBalance > 0) {
        // if (
        //   this.selectedCustomerBalance + this.returnDetails.received_amount >
        //   total_amount
        // ) {

        if (this.selectedCustomerBalance > total_amount) {
          let diff = parseFloat(total_amount);
          // -
          // parseFloat(this.returnDetails.received_amount)
          diff = Math.abs(diff);

          // this.returnDetails.received_amount = total_amount;
        }
        // else {
        //   this.returnDetails.received_amount =
        //     this.returnDetails.received_amount + this.selectedCustomerBalance;
        // }
      }
    }
  }

  checkVendorBalance = async (id) => {
    console.log('get one vendor called for id :', id);
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
        console.log('data:::', data);
        runInAction(() => {
          if (data.balanceType === 'Payable' && data.balance > 0) {
            this.returnDetails.vendor_payable = true;
            // this.returnDetails.linkPayment = true;
            this.selectedCustomerBalance = data.balance;
          }
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setRowClicked = (index) => {
    runInAction(() => {
      this.enabledrow = index;
    });
  };

  setEditTable = (index, value) => {
    if (index && value) {
      if (this.items[index]) {
        runInAction(() => {
          this.items[index].isEdit = value;
        });
      }
    }
  };

  setLinkPayment = async () => {
    runInAction(() => {
      this.openLinkpaymentPage = true;
    });

    // if (this.returnDetails.linked_amount === 0) {
    //   runInAction(() => {
    //     this.paymentLinkTransactions = [];
    //   });
    //   const db = await Db.get();
    //   await this.getAllUnPaidTxnForVendor(db, this.returnDetails.vendor_id);
    // }
  };

  adjustAutoSelectInCaseOfCreditPurchase = async () => {
    const index = this.paymentLinkTransactions.findIndex(
      (item) => item.id === this.returnDetails.bill_number
    );

    if (!(index === 0)) {
      let shuffle = this.paymentLinkTransactions[0];
      runInAction(() => {
        this.paymentLinkTransactions[0] = this.paymentLinkTransactions[index];

        this.paymentLinkTransactions[index] = shuffle;
      });
    }

    await this.autoLinkPayment();
  };

  getAllUnPaidTxnForVendor = async (db, id) => {
    await lp.getAllUnPaidTxnForCustomer(this, db, id, 'Purchases Return');
    if (this.purchasedDetails.isCredit || this.purchasedDetails.balanceAmount) {
      await this.adjustAutoSelectInCaseOfCreditPurchase();
    }
  };

  saveDataAndNew = async () => {
    runInAction(() => {
      this.saveAndNew = true;
    });
    await this.saveData(false);
  };

  saveData = async (isPrint) => {
    //check for empty qty for returned products
    for (let i of this.items) {
      if (
        (i.qty === '' || i.qty === 0) &&
        (i.freeQty === '' || i.freeQty === 0)
      ) {
        alert('Please enter valid return quantity');
        return;
      }
    }

    if (!this.returnDetails.bill_number) {
      alert('Please enter bill number');
      return;
    }
    if (this.returnDetails.bill_number.trim() === '') {
      alert('Please enter bill number');
      return;
    }

    if (!this.returnDetails.purchase_return_number) {
      alert('Please enter purchase number');
      return;
    }
    if (this.returnDetails.purchase_return_number.trim() === '') {
      alert('Please enter purchase number');
      return;
    }

    if (this.returnDetails.balance_amount < 0) {
      alert('Please check balance is Negative');
      return;
    }

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

    this.returnDetails.total_amount = this.getTotalAmount;
    this.returnDetails.balance_amount = this.getBalanceData;

    if (
      this.returnDetails.packing_charge === '' ||
      this.returnDetails.packing_charge === undefined
    ) {
      this.returnDetails.packing_charge = 0;
    }

    if (
      this.returnDetails.return_discount_amount === '' ||
      this.returnDetails.return_discount_amount === undefined
    ) {
      this.returnDetails.return_discount_amount = 0;
    }

    if (
      !('calculateStockAndBalance' in this.returnDetails) ||
      !this.returnDetails.calculateStockAndBalance
    ) {
      this.returnDetails.calculateStockAndBalance = true;
    }

    await this.updatePurchaseReturnInformation(isPrint);
  };

  deletePurchaseReturn = async (item) => {
    const db = await Db.get();
    await this.loadPurchaseData(item.bill_number, true);

    runInAction(() => {
      this.items = item.item_list;
      this.returnDetails = item;
    });

    let purchasedReturnItemMap = new Map();
    let purchasedReturnDeletedMap = new Map();
    let isFullReturnDelete = true;

    this.purchasedItems.forEach((i) => {
      let quantityReturnObj = {
        returnedQty: parseFloat(i.returnedQty),
        returnedFreeQty: parseFloat(i.returnedFreeQty)
      };
      if (parseFloat(i.returnedQty) > 0 || parseFloat(i.returnedFreeQty) > 0) {
        if (i.batch_id > 0) {
          purchasedReturnItemMap.set(
            i.product_id + ':' + i.batch_id,
            quantityReturnObj
          );
        } else {
          purchasedReturnItemMap.set(i.product_id, quantityReturnObj);
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
        purchasedReturnDeletedMap.set(
          i.product_id + ':' + i.batch_id,
          quantityObj
        );
      } else {
        purchasedReturnDeletedMap.set(i.product_id, quantityObj);
      }
    });

    for (let [key, value] of purchasedReturnItemMap) {
      if (purchasedReturnDeletedMap.has(key)) {
        if (
          parseFloat(value.returnedQty) !==
            parseFloat(purchasedReturnDeletedMap.get(key).qty) ||
          parseFloat(value.returnedFreeQty) !==
            parseFloat(purchasedReturnDeletedMap.get(key).freeQty)
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
    await this.revertUpdatePurchaseRecord(
      db,
      purchasedReturnDeletedMap,
      isFullReturnDelete
    );

    if (
      !('calculateStockAndBalance' in item) ||
      !item.calculateStockAndBalance
    ) {
      /**
       * increment products stock
       */
      for (let [key, value] of purchasedReturnDeletedMap) {
        if (key.split(':').length > 1) {
          let id = key.split(':');
          await this.updateProductStock(
            db,
            id[0],
            value.qtyUnit && value.qtyUnit !== ''
              ? this.getQuantityByUnit(value) || 0
              : value.qty || 0,
            value.qtyUnit && value.qtyUnit !== ''
              ? this.getFreeQuantityByUnit(value) || 0
              : value.freeQty || 0,
            1,
            id[1]
          );
        } else {
          await this.updateProductStock(
            db,
            key,
            value.qtyUnit && value.qtyUnit !== ''
              ? this.getQuantityByUnit(value) || 0
              : value.qty || 0,
            value.qtyUnit && value.qtyUnit !== ''
              ? this.getFreeQuantityByUnit(value) || 0
              : value.freeQty || 0,
            1
          );
        }
      }

      /**
       * adjust vendor balance
       */
      await balanceUpdate.incrementBalance(
        db,
        this.returnDetails.vendor_id,
        parseFloat(this.returnDetails.linked_amount) +
          parseFloat(this.returnDetails.balance_amount)
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

    productTxn.deleteProductTxnFromPurchasesReturn(txnData, db);
    allTxn.deleteTxnFromPurchasesReturn(txnData, db);

    //insert into delte txn tables
    let DeleteDataDoc = {
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      total: 0,
      balance: 0,
      data: ''
    };

    let data = {};
    data = this.returnDetails;
    data.item_list = this.items;
    data.employeeId = this.returnDetails.employeeId;

    DeleteDataDoc.transactionId = this.returnDetails.purchase_return_number;
    DeleteDataDoc.sequenceNumber = this.returnDetails.purchaseReturnBillNumber;
    DeleteDataDoc.transactionType = 'Purchases Return';
    DeleteDataDoc.data = JSON.stringify(data);
    DeleteDataDoc.total = this.returnDetails.total_amount;
    DeleteDataDoc.balance = this.returnDetails.balance_amount;
    DeleteDataDoc.createdDate = this.returnDetails.date;

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    //save to audit
    audit.addAuditEvent(
      this.returnDetails.purchase_return_number,
      this.returnDetails.purchaseReturnBillNumber,
      'Purchases Return',
      'Delete',
      JSON.stringify(this.returnDetails),
      '',
      this.returnDetails.date
    );

    /**
     * delete data
     */
    const businessData = await Bd.getBusinessData();

    const query = await db.purchasesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              purchase_return_number: {
                $eq: this.returnDetails.purchase_return_number
              }
            }
          ]
        }
      })
      .exec();

    await query
      .remove()
      .then((data) => {
        // console.log('purchase return return data removed' + data);
      })
      .catch((error) => {
        // console.log('purchase return data removal Failed ' + error);
        alert('Error in Removing Data');

        //save to audit
        audit.addAuditEvent(
          this.returnDetails.purchase_return_number,
          this.returnDetails.purchaseReturnBillNumber,
          'Purchases Return',
          'Delete',
          JSON.stringify(this.returnDetails),
          error.message,
          this.returnDetails.date
        );
      });
  };

  updatePurchaseRecord = async (
    db,
    purchasesMap,
    isPartialRefund,
    isFullRefund
  ) => {
    const businessData = await Bd.getBusinessData();

    const invoiceData = await db.purchases
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { bill_number: { $eq: this.returnDetails.bill_number } }
          ]
        }
      })
      .exec();

    const changeData = async (oldData) => {
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
        if (purchasesMap.has(productId)) {
          i.returnedQty =
            (i.returnedQty || 0) + parseFloat(purchasesMap.get(productId).qty);

          i.returnedFreeQty =
            (i.returnedFreeQty || 0) +
            parseFloat(purchasesMap.get(productId).freeQty);

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
    };

    if (invoiceData) {
      await invoiceData.atomicUpdate(changeData);
    }
  };

  revertUpdatePurchaseRecord = async (
    db,
    purchasedReturnDeletedMap,
    isFullReturnDelete
  ) => {
    const businessData = await Bd.getBusinessData();

    const invoiceData = await db.purchases
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { bill_number: { $eq: this.returnDetails.bill_number } }
          ]
        }
      })
      .exec();

    const changeData = async (oldData) => {
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
        if (purchasedReturnDeletedMap.has(productId)) {
          i.returnedQty =
            (i.returnedQty || 0) -
            parseFloat(purchasedReturnDeletedMap.get(productId).qty);
          i.returnedFreeQty =
            (i.returnedFreeQty || 0) -
            parseFloat(purchasedReturnDeletedMap.get(productId).freeQty);
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
      if (categoryData.enableQuantity) {
        enableQty = await Bd.isQtyChangesAllowed(categoryData.enableQuantity);
      }
      if (categoryData && enableQty && enableQty === true) {
        const changeData = (oldData) => {
          let updatedQty = 0;
          let batchData = null;
          let index = -1;
          let updatedFreeQty = 0;

          // the below block of code to update stock qty during return
          var matchedIndex = this.items.findIndex(
            (x) => x.product_id === product_id
          );

          if (matchedIndex >= 0) {
            let product = this.items[matchedIndex];
            product.stockQty = oldData.stockQty;
            product.freeStockQty = oldData.freeStockQty;
            this.items[matchedIndex] = product;
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

          oldData.updatedAt = Date.now();

          return oldData;
        };

        await categoryData.atomicUpdate(changeData);
      }
    }
  };

  setPurchaseReturnUploadedFile = (files) => {
    this.returnDetails.imageUrls = files;
  };

  updatePurchaseReturnInformation = async (isPrint) => {
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
    let purchasedItemMap = new Map();
    let purchasedItemMrpMap = new Map();

    let purchasedReturnMap = new Map();

    let isPartialRefund = false;
    let isFullRefund = true;

    runInAction(() => {
      this.purchasedItems.forEach((i) => {
        let quantityObj = {
          qty: 0,
          freeQty: 0
        };
        let updatedQty = parseFloat(i.qty) - parseFloat(i.returnedQty || 0);
        let updatedFreeQty =
          parseFloat(i.freeQty) - parseFloat(i.returnedFreeQty || 0);

        quantityObj.qty = updatedQty || 0;
        quantityObj.freeQty = updatedFreeQty || 0;

        if (updatedQty > 0 || updatedFreeQty > 0) {
          if (i.batch_id > 0) {
            purchasedItemMap.set(i.product_id + ':' + i.batch_id, quantityObj);
            purchasedItemMrpMap.set(
              i.product_id + ':' + i.batch_id + ':' + i.purchased_price,
              quantityObj
            );
          } else {
            purchasedItemMap.set(i.product_id, quantityObj);
            purchasedItemMrpMap.set(
              i.product_id + ':' + i.purchased_price,
              quantityObj
            );
          }
        }
      });
    });
    /**
     * check whether the vendor has been changed for the invoice number
     */
    if (!(this.purchasedDetails.vendor_id === this.returnDetails.vendor_id)) {
      isReturnAllowed = false;
      console.log('vendor id not matched');
    }

    /**
     * check whether the bill number is already fully returned
     */
    if (this.purchasedDetails.isFullyReturned) {
      isReturnAllowed = false;
      console.log(' already fully refund done');
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
        productIdWithMrp = productId + ':' + i.purchased_price;

        purchasedReturnMap.set(productId, quantityObj);
      } else {
        productId = i.product_id;
        productIdWithMrp = productId + ':' + i.purchased_price;
        purchasedReturnMap.set(productId, quantityObj);
      }

      if (purchasedItemMrpMap.has(productIdWithMrp)) {
        if (
          parseFloat(i.qty) <
            parseFloat(purchasedItemMrpMap.get(productIdWithMrp).qty) ||
          parseFloat(i.freeQty) <
            parseFloat(purchasedItemMrpMap.get(productIdWithMrp).freeQty)
        ) {
          isPartialRefund = true;
          isFullRefund = false;
        } else if (
          parseFloat(i.qty) >
            parseFloat(purchasedItemMrpMap.get(productIdWithMrp).qty) ||
          parseFloat(i.freeQty) >
            parseFloat(purchasedItemMrpMap.get(productIdWithMrp).freeQty)
        ) {
          isReturnAllowed = false;
          return 'return not allowed';
        } else {
          /**
           * returned product quantity and sale product quantity is equal
           */
          deletedProducts = deletedProducts + 1;
        }
      } else {
        isReturnAllowed = false;
        return 'return not allowed';
      }
    });

    // console.log(purchasedReturnMap);
    // console.log(purchasedItemMap);

    if (deletedProducts < purchasedItemMap.size) {
      isPartialRefund = true;
      isFullRefund = false;
    }

    // console.log(isPartialRefund);
    // console.log(isFullRefund);
    // console.log(isReturnAllowed);

    if (isReturnAllowed) {
      if (
        !('calculateStockAndBalance' in this.returnDetails) ||
        !this.returnDetails.calculateStockAndBalance
      ) {
        /**
         * decrement products stock
         */
        for (let [key, value] of purchasedReturnMap) {
          let batch_id = null;

          if (key.split(':').length > 1) {
            let id = key.split(':');
            await this.updateProductStock(
              db,
              id[0],
              value.qtyUnit && value.qtyUnit !== ''
                ? this.getQuantityByUnit(value) || 0
                : value.qty || 0,
              value.qtyUnit && value.qtyUnit !== ''
                ? this.getFreeQuantityByUnit(value) || 0
                : value.freeQty || 0,
              -1,
              id[1]
            );
          } else {
            await this.updateProductStock(
              db,
              key,
              value.qtyUnit && value.qtyUnit !== ''
                ? this.getQuantityByUnit(value) || 0
                : value.qty || 0,
              value.qtyUnit && value.qtyUnit !== ''
                ? this.getFreeQuantityByUnit(value) || 0
                : value.freeQty || 0,
              -1,
              parseInt(batch_id)
            );
          }
        }

        /**
         * adjust vendor balance
         */
        await balanceUpdate.decrementBalance(
          db,
          this.returnDetails.vendor_id,
          parseFloat(this.returnDetails.linked_amount) +
            parseFloat(this.returnDetails.balance_amount)
        );
      }

      /**
       * link payment if has any recivable amount
       */
      if (this.returnDetails.linked_amount > 0) {
        /**
         * update all indivisual returned products in sale table
         * also isFullyReturned : boolean
         */
        await this.updatePurchaseRecord(
          db,
          purchasedReturnMap,
          isPartialRefund,
          isFullRefund
        );
        await this.linkPayment(db, this.returnDetails);
      } else {
        this.returnDetails.linkedTxnList = [];

        await this.updatePurchaseRecord(
          db,
          purchasedReturnMap,
          isPartialRefund,
          isFullRefund
        );
      }

      runInAction(() => {
        for (let i of this.items) {
          delete i['returnedQty'];
          delete i['returnedFreeQty'];
        }
      });

      let filteredArray = [];

      for (var i = 0; i < this.items.length; i++) {
        let item = this.items[i];

        item.itemNumber = parseInt(i) + 1;

        if (item.qty === null || item.qty === '') {
          item.qty = 0;
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

        if (item.cgst_amount === null || item.cgst_amount === '') {
          item.cgst_amount = 0;
        }

        if (item.sgst_amount === null || item.sgst_amount === '') {
          item.sgst_amount = 0;
        }

        if (item.igst_amount === null || item.igst_amount === '') {
          item.igst_amount = 0;
        }

        if (item.hsn !== null || item.hsn !== '' || item.hsn !== undefined) {
          item.hsn = item.hsn ? item.hsn.toString() : '';
        } else {
          item.hsn = '';
        }

        filteredArray.push(item);
      }

      this.items = filteredArray;

      const InsertDoc = {
        item_list: this.items,
        ...this.returnDetails
      };
      /**
       * updated date
       */
      InsertDoc.updatedAt = Date.now();
      // delete InsertDoc['linkPayment'];
      delete InsertDoc['paymentStatus'];
      delete InsertDoc['vendor_payable'];

      /**
       * product txn data save
       */
      productTxn.saveProductTxnFromPurchasesReturn(InsertDoc, db);
      allTxn.saveTxnFromPurchasesReturn(InsertDoc, db);

      let userAction = 'Save';

      if (this.isRestore) {
        userAction = 'Restore';

        InsertDoc.employeeId = this.returnDetails.employeeId;

        //save to audit
        audit.addAuditEvent(
          InsertDoc.purchase_return_number,
          InsertDoc.purchaseReturnBillNumber,
          'Purchases Return',
          userAction,
          JSON.stringify(InsertDoc),
          '',
          InsertDoc.date
        );
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

      if (this.isUpdate) {
        const businessData = await Bd.getBusinessData();

        const returnData = await db.purchasesreturn
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                {
                  purchase_return_number: {
                    $eq: InsertDoc.purchase_return_number
                  }
                }
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

        runInAction(() => {
          this.OpenAddPurchasesReturn = false;
        });
      } else {
        //save to audit
        audit.addAuditEvent(
          InsertDoc.purchase_return_number,
          InsertDoc.purchaseReturnBillNumber,
          'Purchases Return',
          userAction,
          JSON.stringify(InsertDoc),
          '',
          InsertDoc.date
        );
        /**
         * save new purchase return entry
         */
        // console.log(InsertDoc);

        await db.purchasesreturn
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
                this.purchaseReturnTxnSettingsData,
                'Purchase Return'
              );
            }

            if (this.isRestore) {
              await this.markPurchaseReturnRestored();
            }

            this.handleClosePurchaseReturnLoadingMessage();
            if (
              this.returnsInvoiceRegular &&
              this.returnsInvoiceRegular.boolDefault &&
              isPrint
            ) {
              runInAction(async () => {
                this.printBalance = await balanceUpdate.getCustomerBalanceById(
                  InsertDoc.vendor_id
                );
                this.printPurchaseReturnData = InsertDoc;

                this.closeDialog();
                runInAction(() => {
                  if (this.saveAndNew) {
                    this.saveAndNew = false;
                    this.openForNewReturn();
                  }

                  this.returnDetails = {};
                  this.purchasedItems = [];
                });
                this.handleOpenPurchaseReturnPrintSelectionAlertMessage();
              });
            } else {
              this.closeDialog();
              runInAction(() => {
                if (this.saveAndNew) {
                  this.saveAndNew = false;
                  this.openForNewReturn();
                }

                this.returnDetails = {};
                this.purchasedItems = [];
              });
            }
          })
          .catch((err) => {
            console.log('Error in Adding purchase return', err);

            //save to audit
            audit.addAuditEvent(
              InsertDoc.purchase_return_number,
              InsertDoc.purchaseReturnBillNumber,
              'Purchases Return',
              userAction,
              JSON.stringify(InsertDoc),
              err.message,
              InsertDoc.date
            );

            this.handleClosePurchaseReturnLoadingMessage();
            this.handleOpenPurchaseReturnErrorAlertMessage();
          });
      }
    }
  };

  getPurchasesReturnList = async (fromDate, toDate) => {
    const db = await Db.get();
    var query;
    const businessData = await Bd.getBusinessData();

    if (fromDate && toDate) {
      query = db.purchasesreturn.find({
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

  getPurchasesReturnListByVendor = async (fromDate, toDate, mobileNo) => {
    const db = await Db.get();
    var query;
    const businessData = await Bd.getBusinessData();

    if (fromDate && toDate) {
      query = db.purchasesreturn.find({
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
            { vendor_phone_number: { $eq: mobileNo } }
          ]
        }
        // sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
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

  isSameReturnNumberExists = async (vendor_id, purchaseReturnBillNumber) => {
    let isSameNumberExists = false;
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();
    await db.purchasesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { vendor_id: { $eq: vendor_id } },
            { purchaseReturnBillNumber: { $eq: purchaseReturnBillNumber } }
          ]
        }
      })
      .exec()
      .then((data) => {
        isSameNumberExists = data && data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
    return isSameNumberExists;
  };

  handlePurchasesReturnSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.purchasesreturn
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
                    { purchaseReturnBillNumber: { $regex: regexp } },
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
                    { vendor_name: { $regex: regexp } },
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

  handlePurchasesReturnSearchWithVendorAndDate = async (
    value,
    fromDate,
    toDate,
    mobileNo
  ) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.purchasesreturn
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
                    { vendor_bill_number: { $regex: regexp } },
                    { vendor_phone_number: { $eq: mobileNo } },
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
                    { vendor_name: { $regex: regexp } },
                    { vendor_phone_number: { $eq: mobileNo } },
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
                    { vendor_phone_number: { $eq: mobileNo } },
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
                    // { received_amount: { $eq: parseFloat(value) } },
                    { vendor_phone_number: { $eq: mobileNo } },
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
                    { vendor_phone_number: { $eq: mobileNo } },
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

  handlePurchasesReturnSearchWithEmployeeAndDate = async (
    value,
    fromDate,
    toDate,
    employeeId
  ) => {
    const db = await Db.get();
    let data = [];

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.purchasesreturn
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
                    { vendor_bill_number: { $regex: regexp } },
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
                    { vendor_name: { $regex: regexp } },
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

  addPurchasesReturnData = async (data) => {
    runInAction(() => {
      this.returnDetailsList = data.map((item) => item.toJSON());
    });
  };

  get getRoundedAmount() {
    if (!this.returnDetails.is_roundoff) {
      return 0;
    }
    return this.returnDetails.round_amount;
  }

  deleteItem = (index) => {
    runInAction(() => {
      this.items.splice(index, 1);

      this.returnDetails.total_amount = this.getTotalAmount;
    });

    if (
      this.returnDetails.vendor_name !== undefined &&
      this.returnDetails.vendor_name !== ''
    ) {
      this.resetLinkPayment();
      this.autoLinkPayment();
    }
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

  setReturnChecked = (index, value, allReturnsChecked) => {
    runInAction(() => {
      if (allReturnsChecked) {
        this.items[index].returnChecked = true;
      } else {
        this.items[index].returnChecked = value;
      }
    });
  };

  setAllReturnChecked = (value) => {
    runInAction(() => {
      for (var i = 0; i < this.items.length; i++) {
        this.setReturnChecked(i, value);
      }
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
      this.items[index].offer_price = parseFloat(value || 0);
    });
    this.getAmount(index);
  };

  setNotes = (value) => {
    if (!this.returnDetails) {
      return;
    }
    runInAction(() => {
      this.returnDetails.notes = value;
    });
  };

  // setReceived = (value) => {
  //   if (!this.returnDetails) {
  //     return;
  //   }
  //   runInAction(() => {
  //     this.returnDetails.received_amount = parseFloat(value || 0);
  //   });
  // };

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

      for (let item of this.purchasedItems) {
        if (
          this.items[index].product_id === item.product_id &&
          this.items[index].purchased_price === item.purchased_price
        ) {
          allowedQty = parseFloat(item.qty) - parseFloat(item.returnedQty);
          break;
        }
      }

      if (parseFloat(value) > allowedQty) {
        alert('Returned Qunatity is more than Purchased Quantity');
        return;
      }

      if (parseFloat(value) <= 0) {
        alert('Returned Qunatity is more than Zero');
        return;
      }

      runInAction(() => {
        this.items[index].qty = parseFloat(value);
        this.getAmount(index);
        this.returnDetails.balance_amount = this.getBalanceData;
        this.returnDetails.total_amount = this.getTotalAmount;
      });
      this.resetLinkPayment();
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
        parseFloat(this.purchasedItems[index].freeQty) -
        parseFloat(this.purchasedItems[index].returnedFreeQty);

      if (parseFloat(value) > allowedQty) {
        alert('Returned Free quantity is more than Purchased Quantity');
        return;
      }

      runInAction(() => {
        this.items[index].freeQty = parseFloat(value);
        this.getAmount(index);
      });
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
      this.items[index].purchased_price = value;
    });
    this.getAmount(index);
  };

  setDiscount = (value) => {
    if (!this.returnDetails) {
      return;
    }
    runInAction(() => {
      this.returnDetails.discount_percent = parseFloat(value || 0);
      this.returnDetails.discount_type = 'percentage';
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
    const purchased_price = parseFloat(this.items[index].purchased_price || 0);
    const quantity = parseFloat(this.items[index].qty) || 1;
    const offerPrice = parseFloat(this.items[index].offer_price || 0);

    let tax =
      (parseFloat(this.items[index].cgst) || 0) +
      (parseFloat(this.items[index].sgst) || 0);
    let igst_tax = parseFloat(this.items[index].igst || 0);

    const taxIncluded = this.items[index].taxIncluded;

    /*if (
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
      this.items[index].cgst_amount = 0;
      this.items[index].sgst_amount = 0;
      this.items[index].igst_amount = 0;
      this.items[index].cess = 0;
      this.items[index].discount_amount = 0;
      this.items[index].purchased_price_before_tax = 0;
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

  setPaymentType = (value) => {
    runInAction(() => {
      if (value === 'Cash') {
        this.returnDetails.payment_type = value;
      } else {
        this.returnDetails.payment_type = value;
      }
    });
  };

  setPurchaseReturnProperty = (property, value) => {
    runInAction(() => {
      this.returnDetails[property] = value;
    });
  };

  setBillDate = (value) => {
    runInAction(() => {
      this.returnDetails.date = value;
    });
  };

  setDueDate = (value) => {
    runInAction(() => {
      this.returnDetails.dueDate = value;
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
      runInAction(() => {
        this.returnDetails.total_amount = a;
      });
      return a;
    }, 0);

    this.returnDetails.sub_total = parseFloat(returnValue).toFixed(2);

    let finalValue = returnValue;

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

    return totalAmount;
  }

  get getBalanceData() {
    const total = parseFloat(this.getTotalAmount);
    let balance =
      total -
        // (this.returnDetails.received_amount || 0) -
        parseFloat(this.returnDetails.linked_amount) || 0;

    runInAction(() => {
      this.returnDetails.balance_amount = parseFloat(balance).toFixed(2);
    });
    return balance;
  }

  // get getInvoice() {
  //   return this.returnDetails.received_amount;
  // }

  setPurchasesReturnVendorName = (value) => {
    // console.log('setPurchaseReturnVendorName, ', value);
    runInAction(() => {
      this.returnDetails.vendor_name = value;
    });
  };

  setPurchasesReturnVendorId = (value) => {
    // console.log('setPurchaseReturnVendorId, ', value);
    runInAction(() => {
      this.returnDetails.vendor_id = value;
    });
  };

  setPurchasesReturnVendor = async (customer, isNewCustomer) => {
    runInAction(() => {
      this.returnDetails.vendor_id = customer.id;
      this.returnDetails.vendor_name = customer.name;
      this.returnDetails.vendor_gst_number = customer.gstNumber;
      this.returnDetails.vendor_gst_type = customer.gstType;
      this.returnDetails.vendor_email_id = customer.emailId;
      this.returnDetails.vendorCity = customer.city;
      this.returnDetails.vendorPincode = customer.pincode;
      this.returnDetails.vendorAddress = customer.address;
      this.returnDetails.vendorState = customer.state;
      this.returnDetails.vendorCountry = customer.country;
      this.returnDetails.vendorPanNumber = customer.panNumber;
      this.returnDetails.aadharNumber = customer.aadharNumber;
    });
    this.isNewCustomer = isNewCustomer;
    if (isNewCustomer) {
      this.newCustomerData = customer;
    }

    runInAction(() => {
      if (customer.balanceType === 'Payable' && customer.balance > 0) {
        // this.returnDetails.linkPayment = true;
        this.returnDetails.vendor_payable = true;
      } else {
        this.returnDetails.vendor_payable = false;
      }

      this.selectedCustomerBalance = customer.balance;
    });

    /**
     * get all txn data which is un paid
     */
    const db = await Db.get();
    await this.getAllUnPaidTxnForVendor(db, customer.id);
  };

  viewOrEditItem = async (item, isUpdate) => {
    if (typeof isUpdate === 'undefined') {
      isUpdate = true;
    }

    runInAction(() => {
      this.OpenAddPurchasesReturn = true;
      this.isUpdate = isUpdate;
      console.log(item);
      this.itemDataForUpdate = item;
      this.items = item.item_list;

      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];

      //reset linked txn details start
      item.linkedTxnList = [];
      item.linkPayment = false;
      item.balance_amount =
        parseFloat(item.balance_amount) - parseFloat(item.linked_amount);
      item.linked_amount = 0;
      //reset linked txn details end

      if (
        !('calculateStockAndBalance' in item) ||
        !item.calculateStockAndBalance
      ) {
        item.calculateStockAndBalance = true;
      }

      const returnDetails = {
        vendor_id: item.vendor_id,
        vendor_name: item.vendor_name,
        vendor_gst_number: item.vendor_gst_number,
        vendor_gst_type: item.vendor_gst_type,
        vendor_phone_number: item.vendor_phone_number,
        bill_number: item.bill_number,
        vendor_bill_number: item.vendor_bill_number,
        is_roundoff: item.is_roundoff,
        round_amount: item.round_amount,
        total_amount: item.total_amount,
        payment_type: item.payment_type,
        bankAccount: item.bankAccount,
        bankAccountId: item.bankAccountId,
        bankPaymentType: item.bankPaymentType,
        // received_amount: item.received_amount,
        balance_amount: item.balance_amount,
        linkPayment: item.linkPayment,
        linked_amount: item.linked_amount,
        linkedTxnList: item.linkedTxnList,
        paymentStatus: item.paymentStatus,
        purchase_return_number: item.purchase_return_number,
        date: item.date,
        vendor_payable: item.vendor_payable,
        discount_percent: parseFloat(item.discount_percent || 0),
        discount_amount: parseFloat(item.discount_amount || 0),
        discount_type: item.discount_type,
        reverseChargeValue: item.reverseChargeValue,
        reverseChargeEnable: item.reverseChargeEnable,
        notes: item.notes,
        vendorCity: item.vendorCity,
        vendorPincode: item.vendorPincode,
        vendorAddress: item.vendorAddress,
        vendorState: item.vendorState,
        vendorCountry: item.vendorCountry,
        vendor_email_id: item.vendor_email_id,
        shipping_charge: item.shipping_charge,
        packing_charge: item.packing_charge,
        return_discount_amount: item.return_discount_amount,
        purchaseReturnBillNumber: item.purchaseReturnBillNumber,
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
        isSyncedToServer: item.isSyncedToServer,
        invoiceStatus: item.invoiceStatus,
        tallySyncedStatus: item.tallySyncedStatus,
        calculateStockAndBalance: item.calculateStockAndBalance,
        tallySynced: item.tallySynced,
        aadharNumber: item.aadharNumber,
        purchaseDate: item.purchaseDate,
        purchaseTotalAmount: item.purchaseTotalAmount,
        discountPercentForAllItems: item.discountPercentForAllItems,
        imageUrls: item.imageUrls
      };
      this.returnDetails = returnDetails;
    });

    if (
      parseFloat(item.balance_amount > 0) &&
      item.vendor_id !== '' &&
      item.vendor_id.length > 2
    ) {
      const db = await Db.get();
      await this.getAllUnPaidTxnForVendor(db, this.returnDetails.vendor_id);
    }
  };

  closeDialog = () => {
    runInAction(() => {
      this.isPurchaseReturnConvertion = false;
      this.OpenAddPurchasesReturn = false;
    });
  };

  resetReturnObjects = async () => {
    const businessData = await Bd.getBusinessData();
    const timestamp = Math.floor(Date.now() / 1000);
    const appId = businessData.posDeviceId;
    const id = _uniqueId('pr');

    runInAction(() => {
      this.returnDetails = {
        vendor_id: '',
        vendor_name: '',
        vendor_gst_number: '',
        vendor_gst_type: '',
        vendor_phone_number: '',
        bill_number: '',
        vendor_bill_number: '',
        is_roundoff: false,
        round_amount: 0.0,
        total_amount: 0.0,
        payment_type: 'Credit',
        bankAccount: '',
        bankAccountId: '',
        bankPaymentType: '',
        received_amount: 0.0,
        balance_amount: 0.0,
        purchase_return_number: `${id}${appId}${timestamp}`,
        date: '',
        paymentStatus: 'Un Used',
        linkPayment: false,
        linked_amount: 0,
        linkedTxnList: [],
        vendor_payable: false,
        discount_percent: 0,
        discount_amount: 0,
        discount_type: '',
        reverseChargeValue: '',
        notes: '',
        reverseChargeEnable: false,
        vendorCity: '',
        vendorPincode: '',
        vendorAddress: '',
        vendorState: '',
        vendorCountry: '',
        vendor_email_id: '',
        shipping_charge: 0,
        packing_charge: 0,
        return_discount_amount: 0,
        purchaseReturnBillNumber: '',
        rateList: [],
        dueDate: getTodayDateInYYYYMMDD(),
        vendorPanNumber: '',
        isSyncedToServer: false,
        invoiceStatus: '',
        tallySyncedStatus: '',
        calculateStockAndBalance: true,
        tallySynced: false,
        aadharNumber: '',
        purchaseDate: '',
        purchaseTotalAmount: 0,
        discountPercentForAllItems: 0,
        imageUrls: []
      };

      this.items = [
        {
          item_name: '',
          description: '',
          imageUrl: '',
          batch_id: 0,
          sku: '',
          barcode: '',
          purchased_price: 0,
          mrp: 0,
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
          isEdit: true,
          returnChecked: false
        }
      ];
    });
    this.isRestore = false;
    this.isPurchaseReturnConvertion = false;
    this.purchaseReturnTxnSettingsData = {};
  };

  openForNewReturn = async () => {
    const currentDate = getTodayDateInYYYYMMDD();

    runInAction(() => {
      this.isUpdate = false;
      this.isRestore = false;
      this.isPurchaseReturnConvertion = false;
      this.OpenAddPurchasesReturn = true;
    });

    const businessData = await Bd.getBusinessData();
    const timestamp = Math.floor(Date.now() / 1000);
    const appId = businessData.posDeviceId;
    const id = _uniqueId('pr');

    runInAction(() => {
      this.returnDetails = {
        vendor_id: '',
        vendor_name: '',
        vendor_gst_number: '',
        vendor_gst_type: '',
        vendor_phone_number: '',
        bill_number: '',
        vendor_bill_number: '',
        is_roundoff: false,
        round_amount: 0.0,
        total_amount: 0.0,
        payment_type: 'Credit',
        bankAccount: '',
        bankAccountId: '',
        bankPaymentType: '',
        received_amount: 0.0,
        balance_amount: 0.0,
        purchase_return_number: `${id}${appId}${timestamp}`,
        date: currentDate,
        paymentStatus: 'Un Used',
        linkPayment: false,
        linked_amount: 0,
        linkedTxnList: [],
        vendor_payable: false,
        discount_percent: 0,
        discount_amount: 0,
        discount_type: '',
        reverseChargeValue: '',
        notes: '',
        reverseChargeEnable: false,
        vendorCity: '',
        vendorPincode: '',
        vendorAddress: '',
        vendorState: '',
        vendorCountry: '',
        vendor_email_id: '',
        shipping_charge: 0,
        packing_charge: 0,
        return_discount_amount: 0,
        purchaseReturnBillNumber: '',
        rateList: [],
        dueDate: getTodayDateInYYYYMMDD(),
        vendorPanNumber: '',
        isSyncedToServer: false,
        invoiceStatus: '',
        tallySyncedStatus: '',
        calculateStockAndBalance: true,
        tallySynced: false,
        aadharNumber: '',
        purchaseDate: '',
        purchaseTotalAmount: 0,
        discountPercentForAllItems: 0,
        imageUrls: []
      };

      this.items = [
        {
          item_name: '',
          description: '',
          imageUrl: '',
          batch_id: 0,
          sku: '',
          barcode: '',
          purchased_price: 0,
          mrp: 0,
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
          isEdit: true,
          returnChecked: false
        }
      ];
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
      offerPrice,
      barcode,
      sku,
      cgst,
      sgst,
      igst,
      cess,
      taxType
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
      this.items[index].purchased_price = salePrice;
      this.items[index].barcode = barcode;
      this.items[index].sku = sku;

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
      this.items[index].taxType = taxType;

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
      'Purchases Return'
    );

    if (txnList) {
      txnList.forEach((txn) => this.returnDetails.linkedTxnList.push(txn));
    }

    this.paymentLinkTransactions = [];
  };

  unLinkPayment = async (db, returnDetails) => {
    await lp.unLinkPayment(db, returnDetails, 'Purchases Return');

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
        // const receivedAmount =
        //   parseFloat(this.returnDetails.received_amount) || 0;

        let linkedAmount = parseFloat(this.returnDetails.linked_amount) || 0;

        // let amountToLink = (totalAmount - receivedAmount - linkedAmount) || 0;
        let amountToLink = totalAmount - linkedAmount || 0;

        if (txnSelected.balance >= amountToLink) {
          txnSelected.linkedAmount = amountToLink;

          runInAction(() => {
            this.returnDetails.linked_amount =
              this.returnDetails.linked_amount + amountToLink;
          });
        } else {
          txnSelected.linkedAmount = txnSelected.balance;
          runInAction(() => {
            this.returnDetails.linked_amount =
              this.returnDetails.linked_amount + txnSelected.balance;
          });
        }

        txnSelected.selected = true;
        txnSelected.balance =
          parseFloat(txnSelected.balance) -
          parseFloat(txnSelected.linkedAmount);
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
            this.returnDetails.linked_amount - linkedAmount;

          txnSelected.balance =
            parseFloat(txnSelected.balance) +
            parseFloat(txnSelected.linkedAmount);

          txnSelected.linkedAmount = 0;
          txnSelected.selected = false;
          this.paymentLinkTransactions[index] = txnSelected;
        });
      }
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
    const totalAmount = this.returnDetails.total_amount;
    let linkedAmount = parseFloat(this.returnDetails.linked_amount) || 0;

    let amountToLink = parseFloat(totalAmount) - parseFloat(linkedAmount);

    if (amountToLink > 0) {
      let finalLinkedAmount = 0;
      for (let txn of this.paymentLinkTransactions) {
        if (txn) {
          if (txn.balance > 0) {
            let linked = 0;
            if (finalLinkedAmount < amountToLink) {
              if (
                txn.balance >=
                parseFloat(amountToLink) - parseFloat(finalLinkedAmount)
              ) {
                linked =
                  parseFloat(amountToLink) - parseFloat(finalLinkedAmount);
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
      }
      runInAction(() => {
        this.returnDetails.linked_amount = finalLinkedAmount;
      });
      if (this.returnDetails.linked_amount > 0) {
        runInAction(() => {
          this.returnDetails.linkPayment = true;
        });
      }
    }
  };

  resetLinkPayment = () => {
    let linked_amount = this.returnDetails.linked_amount;
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
    runInAction(() => {
      this.returnDetails.linked_amount = linked_amount;
    });
  };

  saveLinkPaymentChanges = () => {
    if (this.returnDetails.linked_amount > 0) {
      runInAction(() => {
        this.returnDetails.linkPayment = true;
      });
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

  setTaxSettingsData = (value) => {
    this.taxSettingsData = value;
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

  setPurchaseReturnBillNumber = (value) => {
    this.returnDetails.purchaseReturnBillNumber = value;
  };

  viewAndRestorePurchaseReturnItem = async (item) => {
    runInAction(() => {
      this.isRestore = true;
    });

    if (
      !('calculateStockAndBalance' in item) ||
      !item.calculateStockAndBalance
    ) {
      item.calculateStockAndBalance = true;
    }

    await this.loadPurchasesDataForRestorePurchasesReturn(item);
    this.viewOrEditItem(item, false);
  };

  loadPurchasesDataForRestorePurchasesReturn = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.purchases.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { vendor_bill_number: item.vendor_bill_number }
        ]
      }
    });

    await query.exec().then(async (data) => {
      if (data) {
        runInAction(() => {
          this.items = [];
        });

        runInAction(() => {
          this.purchasedItems = data.item_list;
          this.purchasedDetails.vendor_id = data.vendor_id;
          this.purchasedDetails.vendor_phone_number = data.vendor_phone_number;
          this.purchasedDetails.isPartiallyReturned = data.isPartiallyReturned;
          this.purchasedDetails.isFullyReturned = data.isFullyReturned;
          this.purchasedDetails.balanceAmount = data.balance_amount;
          this.purchasedDetails.isCredit = data.is_credit;
        });
      }
    });
  };

  restorePurchaseReturnItem = async (item) => {
    runInAction(() => {
      this.isRestore = true;
      this.isUpdate = false;
      this.items = item.item_list;

      if (
        !('calculateStockAndBalance' in item) ||
        !item.calculateStockAndBalance
      ) {
        item.calculateStockAndBalance = true;
      }

      this.paymentLinkTransactions = [];
      this.paymentUnLinkTransactions = [];

      //reset linked txn details start
      item.linkedTxnList = [];
      item.linkPayment = false;
      item.balance_amount =
        parseFloat(item.balance_amount) - parseFloat(item.linked_amount);
      item.linked_amount = 0;
      //reset linked txn details end

      const returnDetails = {
        vendor_id: item.vendor_id,
        vendor_name: item.vendor_name,
        vendor_gst_number: item.vendor_gst_number,
        vendor_gst_type: item.vendor_gst_type,
        vendor_phone_number: item.vendor_phone_number,
        bill_number: item.bill_number,
        vendor_bill_number: item.vendor_bill_number,
        is_roundoff: item.is_roundoff,
        round_amount: item.round_amount,
        total_amount: item.total_amount,
        payment_type: item.payment_type,
        bankAccount: item.bankAccount,
        bankAccountId: item.bankAccountId,
        bankPaymentType: item.bankPaymentType,
        balance_amount: item.balance_amount,
        linkPayment: item.linkPayment,
        linked_amount: item.linked_amount,
        linkedTxnList: item.linkedTxnList,
        paymentStatus: item.paymentStatus,
        purchase_return_number: item.purchase_return_number,
        date: item.date,
        vendor_payable: item.vendor_payable,
        discount_percent: parseFloat(item.discount_percent || 0),
        discount_amount: parseFloat(item.discount_amount || 0),
        discount_type: item.discount_type,
        reverseChargeValue: item.reverseChargeValue,
        reverseChargeEnable: item.reverseChargeEnable,
        notes: item.notes,
        vendorCity: item.vendorCity,
        vendorPincode: item.vendorPincode,
        vendorAddress: item.vendorAddress,
        vendorState: item.vendorState,
        vendorCountry: item.vendorCountry,
        vendor_email_id: item.vendor_email_id,
        shipping_charge: item.shipping_charge,
        packing_charge: item.packing_charge,
        return_discount_amount: item.return_discount_amount,
        purchaseReturnBillNumber: item.purchaseReturnBillNumber,
        rateList: item.rateList,
        dueDate: item.dueDate,
        vendorPanNumber: item.vendorPanNumber,
        isSyncedToServer: item.isSyncedToServer,
        invoiceStatus: item.invoiceStatus,
        tallySyncedStatus: item.tallySyncedStatus,
        calculateStockAndBalance: item.calculateStockAndBalance,
        tallySynced: item.tallySynced,
        aadharNumber: item.aadharNumber,
        purchaseDate: item.purchaseDate,
        purchaseTotalAmount: item.purchaseTotalAmount,
        discountPercentForAllItems: item.discountPercentForAllItems,
        imageUrls: item.imageUrls
      };
      this.returnDetails = returnDetails;
    });

    await this.updatePurchaseReturnInformation(false);
  };

  markPurchaseReturnRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: this.returnDetails.purchase_return_number } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('Deleted data removed' + data);
        this.returnDetails = {};
      })
      .catch((error) => {
        console.log('Deleted data deletion Failed ' + error);
      });
  };

  setPurchaseTxnEnableFieldsMap = (purchaseTransSettingData) => {
    this.purchaseReturnTxnSettingsData = purchaseTransSettingData;

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
    }
  };

  resetPurchaseReturnPrintData = async () => {
    runInAction(() => {
      this.printPurchaseReturnData = {};
      this.printBalance = {};
      this.openPurchaseReturnPrintSelectionAlert = false;
    });
  };

  closeDialogForSaveAndPrint = () => {
    this.closeDialog();
    runInAction(() => {
      if (this.saveAndNew) {
        this.saveAndNew = false;
        this.openForNewReturn();
      }

      this.returnDetails = {};
      this.purchasedItems = [];
    });
  };

  handleOpenPurchaseReturnLoadingMessage = async () => {
    runInAction(() => {
      this.openPurchaseReturnLoadingAlertMessage = true;
    });
  };

  handleClosePurchaseReturnLoadingMessage = async () => {
    runInAction(() => {
      this.openPurchaseReturnLoadingAlertMessage = false;
    });
  };

  handleOpenPurchaseReturnErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseReturnErrorAlertMessage = true;
    });
  };

  handleClosePurchaseReturnErrorAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseReturnErrorAlertMessage = false;
    });
  };

  handleOpenPurchaseReturnPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseReturnPrintSelectionAlert = true;
    });
  };

  handleClosePurchaseReturnPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openPurchaseReturnPrintSelectionAlert = false;
    });
  };

  setRoundingConfiguration = (value) => {
    this.roundingConfiguration = value;
  };

  updatePurchaseReturnTallySyncStatus = async (status, invoiceNumber) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.purchasesreturn.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            purchase_return_number: {
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

  updateBulkPurchaseReturnTallySyncStatus = async (inputItems, status) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    for (var i = 0; i < inputItems.length; i++) {
      let item = inputItems[i];
      let updatedAtNewTime = timestamp.getUniqueTimestamp();
      const query = await db.purchasesreturn.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              purchase_return_number: {
                $eq: item.purchase_return_number
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

  launchSerialDataDialog = async (item, index) => {
    let serialNo = [];
    if (!this.isUpdate) {
      let selector = {
        $and: [{ productId: { $eq: item.product_id } }]
      };
      let product = await getProductDataById(selector);
      if (
        this.purchasedItems[index].serialNo &&
        this.purchasedItems[index].serialNo.length > 0
      ) {
        for (let fs of this.purchasedItems[index].serialNo) {
          let filteredSerialData = product.serialData.find((ele) => {
            return fs === ele.serialImeiNo;
          });
          if (filteredSerialData.purchaseReturn === true) {
            continue;
          }
          if (item.serialNo.includes(fs)) {
            serialNo.push({
              serialNo: fs,
              selected: true
            });
          } else {
            serialNo.push({
              serialNo: fs,
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
    runInAction(() => {
      this.selectedProduct.serialData = serialNo;
      this.selectedIndex = index;
      this.OpenPurchaseReturnSerialList = true;
    });
  };

  modifySelectedSerialNoForPurchaseReturn = (value, index) => {
    if (
      this.selectedProduct &&
      this.selectedProduct.serialData &&
      this.selectedProduct.serialData.length > 0
    ) {
      runInAction(() => {
        this.selectedProduct.serialData[index]['selected'] = value;
      });
    }
  };

  selectProductFromSerial = (selectedIndex, selectedProduct) => {
    runInAction(() => {
      let serialNos = [];
      for (let item of selectedProduct.serialData) {
        if (item.selected) {
          serialNos.push(item.serialNo);
        }
      }
      this.items[this.selectedIndex].serialNo = serialNos;
      this.items[this.selectedIndex].qty = serialNos.length;
      this.getAmount(this.selectedIndex);
      this.handleSerialListModalClose();
    });
  };

  handleSerialListModalClose = (val) => {
    runInAction(() => {
      this.OpenPurchaseReturnSerialList = false;
      this.selectedProduct = {};
    });
  };

  constructor() {
    makeObservable(this, {
      selectedCustomerBalance: observable,
      returnDetails: observable,
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
      deleteItem: action,
      getTotalAmount: computed,
      getBalanceData: computed,
      setPaymentType: action,
      toggleRoundOff: action,
      // setReceived: action,
      getRoundedAmount: computed,
      newCustomer: observable,
      newCustomerData: observable,
      setPurchasesReturnVendorName: action,
      setPurchasesReturnVendorId: action,
      saveData: action,
      saveDataAndNew: action,
      isUpdate: observable,
      OpenAddPurchasesReturn: observable,
      isPurchaseReturnList: observable,
      closeDialog: action,
      viewOrEditItem: action,
      openForNewReturn: action,
      selectProduct: action,
      setEditTable: action,
      setPurchaseReturnProperty: action,
      viewOrEditPurchaseReturnTxnItem: action,
      deletePurchaseReturnTxnItem: action,
      openLinkpaymentPage: observable,
      paymentLinkTransactions: observable,
      openMultipleBillForSameVendorSelectionPopUp: observable,
      isBillNumberInValid: observable,
      enabledrow: observable,
      setRowClicked: action,
      returnDetailsList: observable,
      setReturnsInvoiceRegular: action,
      setReturnsInvoiceThermal: action,
      setReturnChecked: action,
      setPaymentMode: action,
      setBankAccountData: action,
      setTaxSettingsData: action,
      taxSettingsData: observable,
      setPackingCharge: action,
      setShippingCharge: action,
      setAllReturnChecked: action,
      viewAndRestorePurchaseReturnItem: action,
      restorePurchaseReturnItem: action,
      setPurchaseReturnBillNumber: action,
      purchaseTxnEnableFieldsMap: observable,
      setPurchaseTxnEnableFieldsMap: action,
      isRestore: observable,
      isPurchaseReturnConvertion: observable,
      printPurchaseReturnData: observable,
      resetPurchaseReturnPrintData: action,
      closeDialogForSaveAndPrint: action,
      purchaseReturnTxnSettingsData: observable,
      printBalance: observable,
      openPurchaseReturnLoadingAlertMessage: observable,
      openPurchaseReturnErrorAlertMessage: observable,
      openPurchaseReturnPrintSelectionAlert: observable,
      setRoundingConfiguration: action,
      selectedProduct: observable,
      selectedIndex: observable,
      OpenPurchaseReturnSerialList: observable
    });
  }
}
export default new PurchasesReturnsAddStore();