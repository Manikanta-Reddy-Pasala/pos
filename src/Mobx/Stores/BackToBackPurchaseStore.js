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
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import BatchData from './classes/BatchData';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

class BackToBackPurchaseAddStore {
  newVendor = false;

  isUpdate = false;

  OpenAddBackToBackPurchaseBill = false;

  saveAndNew = false;

  enabledRow = 0;

  existingBillData = {};

  newVendorData = {};

  FocusLastIndex = false;

  OpenBatchList = false;
  selectedProduct = {};

  backToBackPurchaseData = {};

  purchaseTxnEnableFieldsMap = new Map();

  descriptionCollapsibleMap = new Map();

  purchaseTxnEnableFieldsMap = new Map();

  descriptionCollapsibleMap = new Map();

  isCGSTSGSTEnabledByPOS = true;

  billDetails = {
    businessId: '',
    businessCity: '',
    backToBackPurchaseNumber: '',
    sequenceNumber: '',
    lrNumber: '',
    bill_date: getTodayDateInYYYYMMDD(),
    total_amount: 0,
    updatedAt: '',
    freightCharge: 0,
    notes: '',
    isSyncedToServer: false,
    subTotal: 0,
    transporterVendorId: '',
    transporterVendorName: '',
    transporterVendorGstNumber: '',
    transporterVendorGstType: '',
    transporterVendorPayable: false,
    transporterVendorPhoneNumber: '',
    transporterVendorCity: '',
    transporterVendorPincode: '',
    transporterVendorAddress: '',
    transporterVendorState: '',
    transporterVendorCountry: '',
    transporterVendorEmailId: '',
    transporterVendorPanNumber: '',
    vehicleNumber: '',
    supervisorName: '',
    supervisorPhoneNumber: '',
    supervisorEmployeeId: '',
    materialsInChargeName: '',
    materialsInChargePhoneNumber: '',
    materialsInChargeEmployeeId: '',
    expenseIdForFreightCharge: ''
  };

  items = [
    {
      vendorId: '',
      vendorName: '',
      vendorGstNumber: '',
      vendorGstType: '',
      vendorPayable: false,
      vendorPhoneNumber: '',
      vendorCity: '',
      vendorPincode: '',
      vendorAddress: '',
      vendorState: '',
      vendorCountry: '',
      vendorEmailId: '',
      vendorPanNumber: '',
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
      freeStockQty: 0,
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
      serialOrImeiNo: '',
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
      finalMRPPrice: 0,
      itemNumber: 0
    }
  ];

  purchasesData = null;
  purchases = [];
  dateDropValue = null;
  vendorList = [];
  isBackToBackPurchasesList = false;

  purchasesInvoiceRegular = {};
  purchasesInvoiceThermal = {};

  taxSettingsData = {};

  addNewRowEnabled = false;

  printBackToBackPurchaseData = null;

  openBackToBackPurchaseLoadingAlertMessage = false;
  openBackToBackPurchaseErrorAlertMessage = false;

  openBackToBackPurchasePrintSelectionAlert = false;

  isRestore = false;

  getAddRowEnabled = () => {
    return this.addNewRowEnabled;
  };

  setAddRowEnabled = (value) => {
    this.addNewRowEnabled = value;
  };

  getBackToBackPurchasesDetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.backtobackpurchases
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
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

  setFreightCharge = (value) => {
    runInAction(() => {
      this.billDetails.freightCharge = value ? parseFloat(value) : '';
    });
  };

  setVendorList = (data) => {
    this.vendorList = data;
  };

  get getVendorList() {
    return this.vendorList;
  }

  getBackToBackPurchasesCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.backtobackpurchases
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        this.isBackToBackPurchasesList = data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  addNewItem = (status, focusIndexStatus, isBarcode) => {
    if (status) {
      this.addNewRowEnabled = true;
    }
    var lastItem = this.items[this.items.length - 1]; // Getting last element

    if (lastItem) {
      if (lastItem.qty > 0) {
        this.items.push({
          vendorId: '',
          vendorName: '',
          vendorGstNumber: '',
          vendorGstType: '',
          vendorPayable: false,
          vendorPhoneNumber: '',
          vendorCity: '',
          vendorPincode: '',
          vendorAddress: '',
          vendorState: '',
          vendorCountry: '',
          vendorEmailId: '',
          vendorPanNumber: '',
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
          serialOrImeiNo: '',
          makingChargeIncluded: false,
          freeQty: 0,
          freeStockQty: 0,
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
          finalMRPPrice: 0,
          itemNumber: 0
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
        vendorId: '',
        vendorName: '',
        vendorGstNumber: '',
        vendorGstType: '',
        vendorPayable: false,
        vendorPhoneNumber: '',
        vendorCity: '',
        vendorPincode: '',
        vendorAddress: '',
        vendorState: '',
        vendorCountry: '',
        vendorEmailId: '',
        vendorPanNumber: '',
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
        serialOrImeiNo: '',
        makingChargeIncluded: false,
        freeQty: 0,
        freeStockQty: 0,
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
        finalMRPPrice: 0,
        itemNumber: 0
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

  setItemModelNumber = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].modelNo = value;
  };

  setSerialOrImeiNo = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].serialOrImeiNo = value;
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

  openForNewBackToBackPurchase = () => {
    const currentDate = getTodayDateInYYYYMMDD();

    runInAction(() => {
      this.isUpdate = false;
      this.OpenAddBackToBackPurchaseBill = true;

      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};

      this.billDetails = {
        businessId: '',
        businessCity: '',
        backToBackPurchaseNumber: '',
        sequenceNumber: '',
        bill_date: currentDate,
        lrNumber: '',
        updatedAt: '',
        freightCharge: 0,
        notes: '',
        isSyncedToServer: false,
        subTotal: 0,
        transporterVendorId: '',
        transporterVendorName: '',
        transporterVendorGstNumber: '',
        transporterVendorGstType: '',
        transporterVendorPayable: false,
        transporterVendorPhoneNumber: '',
        transporterVendorCity: '',
        transporterVendorPincode: '',
        transporterVendorAddress: '',
        transporterVendorState: '',
        transporterVendorCountry: '',
        transporterVendorEmailId: '',
        transporterVendorPanNumber: '',
        vehicleNumber: '',
        supervisorName: '',
        supervisorPhoneNumber: '',
        supervisorEmployeeId: '',
        materialsInChargeName: '',
        materialsInChargePhoneNumber: '',
        materialsInChargeEmployeeId: '',
        expenseIdForFreightCharge: ''
      };

      this.items = [
        {
          vendorId: '',
          vendorName: '',
          vendorGstNumber: '',
          vendorGstType: '',
          vendorPayable: false,
          vendorPhoneNumber: '',
          vendorCity: '',
          vendorPincode: '',
          vendorAddress: '',
          vendorState: '',
          vendorCountry: '',
          vendorEmailId: '',
          vendorPanNumber: '',
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
          freeStockQty: 0,
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
          serialOrImeiNo: '',
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
          finalMRPPrice: 0,
          itemNumber: 0
        }
      ];
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
      finalMRPPrice
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
      runInAction(() => {
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

        console.log(this.items[index]);

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
      this.setItemDiscount(index, purchasePercent);
    }
  };

  resetSingleProduct = (index) => {
    let defaultItem = {
      vendor_id: '',
      vendor_name: '',
      vendor_gst_number: '',
      vendor_gst_type: '',
      vendor_payable: false,
      vendor_phone_number: '',
      vendorCity: '',
      vendorPincode: '',
      vendorAddress: '',
      vendorState: '',
      vendorCountry: '',
      vendor_email_id: '',
      vendorPanNumber: '',
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
      freeStockQty: 0,
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
      serialOrImeiNo: '',
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
      finalMRPPrice: 0,
      itemNumber: 0
    };

    this.items[index] = defaultItem;
  };

  setFocusLastIndex = (val) => {
    this.FocusLastIndex = val;
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
      barcode
    } = batchItem;

    let existingPurchaseProduct;

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
      });

      this.setQuantity(this.selectedIndex, 1);
      this.setItemDiscount(this.selectedIndex, purchaseDiscountPercent);
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

  generateBillNumber = async () => {
    /**
     * generate bill number
     */
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('bp');
    runInAction(() => {
      this.billDetails.backToBackPurchaseNumber = `${id}${appId}${timestamp}`;
    });
  };

  setTaxSettingsData = (value) => {
    this.taxSettingsData = value;
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

  //Item level fields
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

  closeDialogForSaveAndPrint = () => {
    this.handleCloseBackToBackPurchaseLoadingMessage();
    if (this.isUpdate) {
      this.isUpdate = false;
      this.closeDialog();
      if (this.saveAndNew) {
        this.saveAndNew = false;
        this.openForNewBackToBackPurchase();
      }

      runInAction(async () => {
        this.isBackToBackPurchasesList = true;
      });

      this.resetAllData();
    } else {
      this.closeDialog();
      if (this.saveAndNew) {
        this.saveAndNew = false;
        this.openForNewBackToBackPurchase();
      }
      this.resetAllData();

      runInAction(async () => {
        this.isBackToBackPurchasesList = true;
      });
    }
  };

  resetBackToBackPurchasePrintData = async () => {
    runInAction(() => {
      this.printBackToBackPurchaseData = {};
    });
  };

  handleOpenBackToBackPurchaseLoadingMessage = async () => {
    runInAction(() => {
      this.openBackToBackPurchaseLoadingAlertMessage = true;
    });
  };

  handleCloseBackToBackPurchaseLoadingMessage = async () => {
    runInAction(() => {
      this.openBackToBackPurchaseLoadingAlertMessage = false;
    });
  };

  handleOpenPurchaseErrorAlertMessage = async () => {
    runInAction(() => {
      this.openBackToBackPurchaseErrorAlertMessage = true;
    });
  };

  handleCloseBackToBackPurchaseErrorAlertMessage = async () => {
    runInAction(() => {
      this.openBackToBackPurchaseErrorAlertMessage = false;
    });
  };

  handleOpenBackToBackPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openBackToBackPurchasePrintSelectionAlert = true;
    });
  };

  handleCloseBackToBackPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openBackToBackPurchasePrintSelectionAlert = false;
    });
  };

  closeDialog = () => {
    runInAction(() => {
      this.OpenAddBackToBackPurchaseBill = false;
      this.enabledRow = 0;
    });
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

  setVendorName = (value) => {
    runInAction(() => {
      this.billDetails.transporterVendorName = value;
    });
  };

  setVendorId = (value) => {
    runInAction(() => {
      this.billDetails.transporterVendorId = value;
    });
  };

  setVendor = async (vendor, isNewVendor) => {
    // console.log('vendor::', vendor);
    if (!vendor) {
      return;
    }
    runInAction(() => {
      this.billDetails.transporterVendorId = vendor.id;
      this.billDetails.transporterVendorName = vendor.name;
      this.billDetails.transporterVendorGstNumber = vendor.gstNumber;
      this.billDetails.transporterVendorGstType = vendor.gstType;
      this.billDetails.transporterVendorPhoneNumber = vendor.phoneNo;
      this.billDetails.transporterVendorCity = vendor.city;
      this.billDetails.transporterVendorPincode = vendor.pincode;
      this.billDetails.transporterVendorAddress = vendor.address;
      this.billDetails.transporterVendorState = vendor.state;
      this.billDetails.transporterVendorCountry = vendor.country;
      this.billDetails.transporterVendorEmailId = vendor.emailId;
      this.billDetails.transporterVendorPanNumber = vendor.panNumber;

      this.isNewVendor = isNewVendor;
      if (isNewVendor) {
        this.newVendorData = vendor;
      }
    });

    /**
     * get txn which are un paid
     */
    if (vendor.balanceType === 'Receivable' && vendor.balance > 0) {
      runInAction(() => {
        this.billDetails.transporterVendorPayable = false;
      });
    } else {
      runInAction(() => {
        this.billDetails.transporterVendorPayable = true;
        // this.billDetails['paid_amount'] = 0;
      });
    }
  };

  setLRNumber = (value) => {
    runInAction(() => {
      this.billDetails.lrNumber = value;
    });
  };

  setVehicleNumber = (value) => {
    runInAction(() => {
      this.billDetails.vehicleNumber = value;
    });
  };

  setItemVendor = (vendor, index) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (!vendor) {
      return;
    }
    runInAction(() => {
      this.items[index].vendorId = vendor.id;
      this.items[index].vendorName = vendor.name;
      this.items[index].vendorGstNumber = vendor.gstNumber;
      this.items[index].vendorGstType = vendor.gstType;
      this.items[index].vendorPhoneNumber = vendor.phoneNo;
      this.items[index].vendorCity = vendor.city;
      this.items[index].vendorPincode = vendor.pincode;
      this.items[index].vendorAddress = vendor.address;
      this.items[index].vendorState = vendor.state;
      this.items[index].vendorCountry = vendor.country;
      this.items[index].vendorEmailId = vendor.emailId;
      this.items[index].vendorPanNumber = vendor.panNumber;
    });
  };

  resetVendor = () => {
    this.billDetails.transporterVendorId = '';
    this.billDetails.transporterVendorName = '';
    this.billDetails.transporterVendorGstNumber = '';
    this.billDetails.transporterVendorGstType = '';
    this.billDetails.transporterVendorPhoneNumber = '';
    this.billDetails.transporterVendorCity = '';
    this.billDetails.transporterVendorPincode = '';
    this.billDetails.transporterVendorAddress = '';
    this.billDetails.transporterVendorState = '';
    this.billDetails.transporterVendorCountry = '';
    this.billDetails.transporterVendorEmailId = '';
    this.billDetails.transporterVendorPanNumber = '';
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

    const overallTotalAmount = returnValue;

    this.billDetails.subTotal = parseFloat(returnValue).toFixed(2);

    let totalAmount =
      overallTotalAmount + (this.billDetails.freightCharge || 0);

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

    runInAction(() => {
      this.billDetails.total_amount = totalAmount;
    });

    return parseFloat(this.billDetails.total_amount).toFixed(2);
  }

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

  setMrp = (index, value) => {
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

  saveDataAndNew = async (isPrint) => {
    this.saveAndNew = true;
    await this.saveData(isPrint);
  };

  saveData = async (isPrint) => {
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

      if (product.freeStockQty === '' || product.freeStockQty === null) {
        product.freeStockQty = 0;
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

      updatedItems.push(product);
    }
    this.items = updatedItems;

    if (
      this.billDetails.freightCharge === null ||
      this.billDetails.freightCharge === ''
    ) {
      this.billDetails.freightCharge = 0;
    }

    if (
      this.billDetails.total_amount === null ||
      this.billDetails.total_amount === ''
    ) {
      this.billDetails.total_amount = 0;
    }

    this.billDetails.sequenceNumber = 1;

    if (this.isUpdate) {
      await this.updatePurchase(isPrint);
    } else {
      await this.savePurchase(isPrint);
    }
  };

  savePurchase = async (isPrint) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    runInAction(() => {
      this.billDetails.businessId = businessData.businessId;
      this.billDetails.businessCity = businessData.businessCity;

      this.billDetails.posId = parseFloat(businessData.posDeviceId);
    });

    if (
      this.billDetails.backToBackPurchaseNumber === '' ||
      this.billDetails.backToBackPurchaseNumber === undefined
    ) {
      await this.generateBillNumber();
    }

    const InsertDoc = {
      item_list: this.items,
      ...this.billDetails
    };
    /**
     * updated date
     */
    InsertDoc.updatedAt = Date.now();

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

    // await allTxn.saveTxnFromPurchases(InsertDoc, db);

    let userAction = 'Save';

    if (this.isRestore) {
      await this.markProcurmentRestored();
    }

    if (this.isRestore) {
      userAction = 'Restore';
    }

    //save to audit
    audit.addAuditEvent(
      InsertDoc.backToBackPurchaseNumber,
      InsertDoc.sequenceNumber,
      'Procurement',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.bill_date
    );

    await db.backtobackpurchases
      .insert(InsertDoc)
      .then(async (data) => {
        console.log('back to back purchase data Inserted', data);

        if (
          isPrint &&
          this.purchasesInvoiceThermal &&
          this.purchasesInvoiceThermal.boolDefault
        ) {
          sendContentForThermalPrinter(
            '',
            this.purchasesInvoiceThermal,
            InsertDoc,
            this.purchaseTxnSettingsData,
            'Procurement'
          );  
        }

        if (
          this.purchasesInvoiceRegular &&
          this.purchasesInvoiceRegular.boolDefault &&
          isPrint
        ) {
          this.printBackToBackPurchaseData = InsertDoc;
          this.closeDialogForSaveAndPrint();
          this.handleOpenBackToBackPrintSelectionAlertMessage();
        } else {
          this.closeDialog();
          this.handleCloseBackToBackPurchaseLoadingMessage();

          this.resetAllData();
          if (this.saveAndNew) {
            this.saveAndNew = false;
            this.openForNewBackToBackPurchase();
          }

          runInAction(async () => {
            this.isBackToBackPurchasesList = true;
          });
        }
      })
      .catch((err) => {
        console.error('Error in Adding back to back purchases', err);

        //save to audit
        audit.addAuditEvent(
          InsertDoc.backToBackPurchaseNumber,
          InsertDoc.sequenceNumber,
          'Procurement',
          userAction,
          JSON.stringify(InsertDoc),
          err.message,
          InsertDoc.bill_date
        );

        this.handleCloseBackToBackPurchaseLoadingMessage();
        this.handleOpenBackToBackPurchaseErrorAlertMessage();
      });
  };

  updatePurchase = async (isPrint) => {
    const businessData = await Bd.getBusinessData();
    runInAction(() => {
      this.billDetails.businessId = businessData.businessId;
      this.billDetails.businessCity = businessData.businessCity;

      this.billDetails.posId = parseFloat(businessData.posDeviceId);
    });

    const db = await Db.get();

    const query = db.backtobackpurchases.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            backToBackPurchaseNumber: {
              $eq: this.existingBillData.backToBackPurchaseNumber
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

        /**
         * delete and save to product txn table
         */
        let txnData = this.billDetails;
        txnData.item_list = this.items;

        // await allTxn.deleteAndSaveTxnFromPurchases(
        //   this.existingBillData,
        //   txnData,
        //   db
        // );

        runInAction(() => {
          /**
           * updated date
           */
          this.billDetails.updatedAt = Date.now();
        });

        let auditData = {};

        auditData = { ...this.billDetails };
        auditData.item_list = this.items;

        //save to audit
        audit.addAuditEvent(
          this.billDetails.backToBackPurchaseNumber,
          this.billDetails.sequenceNumber,
          'Procurement',
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
            if (
              isPrint &&
              this.purchasesInvoiceThermal &&
              this.purchasesInvoiceThermal.boolDefault
            ) {
              sendContentForThermalPrinter(
                '',
                this.purchasesInvoiceThermal,
                auditData,
                this.purchaseTxnSettingsData,
                'Procurement'
              );
            }

            if (
              this.purchasesInvoiceRegular &&
              this.purchasesInvoiceRegular.boolDefault &&
              isPrint
            ) {
              this.printBackToBackPurchaseData = auditData;
              this.closeDialogForSaveAndPrint();
              this.handleOpenBackToBackPrintSelectionAlertMessage();
            } else {
              this.isUpdate = false;
              this.handleCloseBackToBackPurchaseLoadingMessage();
              this.closeDialog();
              if (this.saveAndNew) {
                this.saveAndNew = false;
                this.openForNewBackToBackPurchase();
              }

              runInAction(async () => {
                this.isBackToBackPurchasesList = true;
              });

              this.resetAllData();
            }
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);

        //save to audit
        audit.addAuditEvent(
          this.billDetails.backToBackPurchaseNumber,
          this.billDetails.sequenceNumber,
          'Procurement',
          'Update',
          JSON.stringify(this.billDetails),
          err.message,
          this.billDetails.bill_date
        );

        this.handleCloseBackToBackPurchaseLoadingMessage();
        this.handleOpenBackToBackPurchaseErrorAlertMessage();
      });
  };

  resetAllData() {
    runInAction(() => {
      this.billDetails = {};
      this.existingBillData = {};
    });
  }

  deleteBackToBackPurchaseTxnItem = async (item) => {
    await this.deletePurchaseEntry(item);
  };

  deletePurchaseEntry = async (item) => {
    const tempBillDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      backToBackPurchaseNumber: item.backToBackPurchaseNumber,
      sequenceNumber: item.sequenceNumber,
      lrNumber: item.lrNumber,
      bill_date: item.bill_date,
      total_amount: item.total_amount,
      updatedAt: item.updatedAt,
      freightCharge: item.freightCharge,
      notes: item.notes,
      isSyncedToServer: item.isSyncedToServer,
      subTotal: item.subTotal,
      transporterVendorId: item.transporterVendorId,
      transporterVendorName: item.transporterVendorName,
      transporterVendorGstNumber: item.transporterVendorGstNumber,
      transporterVendorGstType: item.transporterVendorGstType,
      transporterVendorPayable: item.transporterVendorPayable,
      transporterVendorPhoneNumber: item.transporterVendorPhoneNumber,
      transporterVendorCity: item.transporterVendorCity,
      transporterVendorPincode: item.transporterVendorPincode,
      transporterVendorAddress: item.transporterVendorAddress,
      transporterVendorState: item.transporterVendorState,
      transporterVendorCountry: item.transporterVendorCountry,
      transporterVendorEmailId: item.transporterVendorEmailId,
      transporterVendorPanNumber: item.transporterVendorPanNumber,
      vehicleNumber: item.vehicleNumber,
      supervisorName: item.supervisorName,
      supervisorPhoneNumber: item.supervisorPhoneNumber,
      supervisorEmployeeId: item.supervisorEmployeeId,
      materialsInChargeName: item.materialsInChargeName,
      materialsInChargePhoneNumber: item.materialsInChargePhoneNumber,
      materialsInChargeEmployeeId: item.materialsInChargeEmployeeId,
      expenseIdForFreightCharge: item.expenseIdForFreightCharge
    };

    runInAction(() => {
      this.billDetails = tempBillDetails;

      this.items = item.item_list;
    });

    if (!this.billDetails.backToBackPurchaseNumber) {
      console.log('backToBackPurchaseNumber not present');
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

    DeleteDataDoc.transactionId = this.billDetails.backToBackPurchaseNumber;
    DeleteDataDoc.sequenceNumber = this.billDetails.sequenceNumber;
    DeleteDataDoc.transactionType = 'Procurement';
    DeleteDataDoc.data = JSON.stringify(restorePurchaseData);
    DeleteDataDoc.total = this.billDetails.total_amount;
    DeleteDataDoc.createdDate = this.billDetails.bill_date;

    deleteTxn.addDeleteEvent(DeleteDataDoc);

    //save to audit
    audit.addAuditEvent(
      this.billDetails.backToBackPurchaseNumber,
      this.billDetails.sequenceNumber,
      'Procurement',
      'Delete',
      JSON.stringify(this.billDetails),
      '',
      this.billDetails.bill_date
    );

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.backtobackpurchases.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            backToBackPurchaseNumber: {
              $eq: this.billDetails.backToBackPurchaseNumber
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

        //await allTxn.deleteTxnFromPurchases(item, db);

        await query
          .remove()
          .then(async (data) => {
            console.log('data removed' + data);
            /**
             * make global variables to nulls again
             */
            this.resetAllData();
          })
          .catch((error) => {
            console.log('back to back purchases data removal Failed ' + error);
            alert('Error in Removing Data');
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);

        //save to audit
        audit.addAuditEvent(
          this.billDetails.backToBackPurchaseNumber,
          this.billDetails.sequenceNumber,
          'Procurement',
          'Delete',
          JSON.stringify(this.billDetails),
          err.message,
          this.billDetails.bill_date
        );
      });
  };

  viewOrEditBackToBackPurchaseTxnItem = async (item) => {
    this.viewOrEditItem(item);
  };

  viewOrEditItem = async (item) => {
    runInAction(() => {
      this.OpenAddBackToBackPurchaseBill = true;
      this.isUpdate = true;
      this.existingBillData = item;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
    });

    const billDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      backToBackPurchaseNumber: item.backToBackPurchaseNumber,
      sequenceNumber: item.sequenceNumber,
      lrNumber: item.lrNumber,
      bill_date: item.bill_date,
      total_amount: item.total_amount,
      updatedAt: item.updatedAt,
      freightCharge: item.freightCharge,
      notes: item.notes,
      isSyncedToServer: item.isSyncedToServer,
      subTotal: item.subTotal,
      transporterVendorId: item.transporterVendorId,
      transporterVendorName: item.transporterVendorName,
      transporterVendorGstNumber: item.transporterVendorGstNumber,
      transporterVendorGstType: item.transporterVendorGstType,
      transporterVendorPayable: item.transporterVendorPayable,
      transporterVendorPhoneNumber: item.transporterVendorPhoneNumber,
      transporterVendorCity: item.transporterVendorCity,
      transporterVendorPincode: item.transporterVendorPincode,
      transporterVendorAddress: item.transporterVendorAddress,
      transporterVendorState: item.transporterVendorState,
      transporterVendorCountry: item.transporterVendorCountry,
      transporterVendorEmailId: item.transporterVendorEmailId,
      transporterVendorPanNumber: item.transporterVendorPanNumber,
      vehicleNumber: item.vehicleNumber,
      supervisorName: item.supervisorName,
      supervisorPhoneNumber: item.supervisorPhoneNumber,
      supervisorEmployeeId: item.supervisorEmployeeId,
      materialsInChargeName: item.materialsInChargeName,
      materialsInChargePhoneNumber: item.materialsInChargePhoneNumber,
      materialsInChargeEmployeeId: item.materialsInChargeEmployeeId,
      expenseIdForFreightCharge: item.expenseIdForFreightCharge
    };

    this.billDetails = billDetails;
  };

  setSupervisor = (data) => {
    if (data !== '') {
      this.billDetails.supervisorName = data.name;
      this.billDetails.supervisorEmployeeId = data.id;
      this.billDetails.supervisorPhoneNumber = data.userName;
    } else {
      this.billDetails.supervisorName = '';
      this.billDetails.supervisorEmployeeId = '';
      this.billDetails.supervisorPhoneNumber = '';
    }
  };

  setMaterialsInCharge = (data) => {
    if (data !== '') {
      this.billDetails.materialsInChargeName = data.name;
      this.billDetails.materialsInChargeEmployeeId = data.id;
      this.billDetails.materialsInChargePhoneNumber = data.userName;
    } else {
      this.billDetails.materialsInChargeName = '';
      this.billDetails.materialsInChargeEmployeeId = '';
      this.billDetails.materialsInChargePhoneNumber = '';
    }
  };

  setNotes = (value) => {
    runInAction(() => {
      this.billDetails.notes = value;
    });
  };

  setBillDate = (value) => {
    runInAction(() => {
      this.billDetails.bill_date = value;
    });
  };

  viewAndRestoreProcurementItem = async (item) => {
    runInAction(() => {
      this.OpenAddBackToBackPurchaseBill = true;
      this.isUpdate = false;
      this.isRestore = true;
      this.existingBillData = item;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
    });

    const billDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      backToBackPurchaseNumber: item.backToBackPurchaseNumber,
      sequenceNumber: item.sequenceNumber,
      lrNumber: item.lrNumber,
      bill_date: item.bill_date,
      total_amount: item.total_amount,
      updatedAt: item.updatedAt,
      freightCharge: item.freightCharge,
      notes: item.notes,
      isSyncedToServer: item.isSyncedToServer,
      subTotal: item.subTotal,
      transporterVendorId: item.transporterVendorId,
      transporterVendorName: item.transporterVendorName,
      transporterVendorGstNumber: item.transporterVendorGstNumber,
      transporterVendorGstType: item.transporterVendorGstType,
      transporterVendorPayable: item.transporterVendorPayable,
      transporterVendorPhoneNumber: item.transporterVendorPhoneNumber,
      transporterVendorCity: item.transporterVendorCity,
      transporterVendorPincode: item.transporterVendorPincode,
      transporterVendorAddress: item.transporterVendorAddress,
      transporterVendorState: item.transporterVendorState,
      transporterVendorCountry: item.transporterVendorCountry,
      transporterVendorEmailId: item.transporterVendorEmailId,
      transporterVendorPanNumber: item.transporterVendorPanNumber,
      vehicleNumber: item.vehicleNumber,
      supervisorName: item.supervisorName,
      supervisorPhoneNumber: item.supervisorPhoneNumber,
      supervisorEmployeeId: item.supervisorEmployeeId,
      materialsInChargeName: item.materialsInChargeName,
      materialsInChargePhoneNumber: item.materialsInChargePhoneNumber,
      materialsInChargeEmployeeId: item.materialsInChargeEmployeeId,
      expenseIdForFreightCharge: item.expenseIdForFreightCharge
    };

    this.billDetails = billDetails;
  };

  restoreProcurementItem = async (item, isRestoreWithNextSequenceNo) => {
    runInAction(() => {
      this.OpenAddBackToBackPurchaseBill = true;
      this.isUpdate = false;
      this.isRestore = true;
      this.existingBillData = item;
      this.items = item.item_list;
      this.purchasesInvoiceRegular = {};
      this.purchasesInvoiceThermal = {};
    });

    const billDetails = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      backToBackPurchaseNumber: item.backToBackPurchaseNumber,
      sequenceNumber: item.sequenceNumber,
      lrNumber: item.lrNumber,
      bill_date: item.bill_date,
      total_amount: item.total_amount,
      updatedAt: item.updatedAt,
      freightCharge: item.freightCharge,
      notes: item.notes,
      isSyncedToServer: item.isSyncedToServer,
      subTotal: item.subTotal,
      transporterVendorId: item.transporterVendorId,
      transporterVendorName: item.transporterVendorName,
      transporterVendorGstNumber: item.transporterVendorGstNumber,
      transporterVendorGstType: item.transporterVendorGstType,
      transporterVendorPayable: item.transporterVendorPayable,
      transporterVendorPhoneNumber: item.transporterVendorPhoneNumber,
      transporterVendorCity: item.transporterVendorCity,
      transporterVendorPincode: item.transporterVendorPincode,
      transporterVendorAddress: item.transporterVendorAddress,
      transporterVendorState: item.transporterVendorState,
      transporterVendorCountry: item.transporterVendorCountry,
      transporterVendorEmailId: item.transporterVendorEmailId,
      transporterVendorPanNumber: item.transporterVendorPanNumber,
      vehicleNumber: item.vehicleNumber,
      supervisorName: item.supervisorName,
      supervisorPhoneNumber: item.supervisorPhoneNumber,
      supervisorEmployeeId: item.supervisorEmployeeId,
      materialsInChargeName: item.materialsInChargeName,
      materialsInChargePhoneNumber: item.materialsInChargePhoneNumber,
      materialsInChargeEmployeeId: item.materialsInChargeEmployeeId,
      expenseIdForFreightCharge: item.expenseIdForFreightCharge
    };

    if (isRestoreWithNextSequenceNo) {
      await this.generateBillNumber();
      this.billDetails.bill_date = getTodayDateInYYYYMMDD();
    }
    this.billDetails = billDetails;

    this.saveData(false);
  };

  markProcurmentRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            transactionId: {
              $eq: this.billDetails.backToBackPurchaseNumber
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

  generateProductId = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('p');
    return `${id}${appId}${timestamp}`;
  };

  constructor() {
    makeObservable(this, {
      billDetails: observable,
      items: observable,
      isUpdate: observable,
      OpenAddBackToBackPurchaseBill: observable,
      vendorList: observable,
      setVendorList: action,
      getVendorList: computed,
      dateDropValue: observable,
      setDateDropValue: action,
      getDateDropValue: computed,
      purchasesData: observable,
      purchases: observable,
      getBackToBackPurchasesCount: action,
      isBackToBackPurchasesList: observable,
      enabledRow: observable,
      OpenBatchList: observable,
      selectedProduct: observable,
      setInvoiceRegularSetting: action,
      FocusLastIndex: observable,
      setInvoiceThermalSetting: action,
      setFocusLastIndex: action,
      taxSettingsData: observable,
      setTaxSettingsData: action,
      openBackToBackPurchaseLoadingAlertMessage: observable,
      openBackToBackPurchaseErrorAlertMessage: observable,
      openBackToBackPurchasePrintSelectionAlert: observable,
      purchaseTxnEnableFieldsMap: observable,
      descriptionCollapsibleMap: observable,
      isCGSTSGSTEnabledByPOS: observable,
      getTotalAmount: computed,
      viewAndRestoreProcurementItem: action,
      restoreProcurementItem: action,
      isRestore: observable
    });
  }
}
export default new BackToBackPurchaseAddStore();
