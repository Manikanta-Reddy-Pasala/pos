import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import { toJS } from 'mobx';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';

class BarcodeStore {
  barcodeDataList = [];
  barcodeFullDataList = [];

  //line field maps to Address for Customer/Vendor option
  //footer field maps to Additional Text 1 for Customer/Vendor option
  //addtionalTextTwo field maps to Additional Text 1 for Customer/Vendor option

  barcodeDisplayData = {
    id: '',
    name: '',
    label: '',
    header: '',
    line: '',
    footer: '',
    barcode: 'Item Code',
    printType: 'label',
    barcodeValue: '',
    headerVal: '',
    lineVal: '',
    footerVal: '',
    updatedAt: Date.now(),
    businessId: '',
    businessCity: '',
    isProduct: true,
    printStartFrom: 1,
    addtionalTextTwo: '',
    addtionalTextTwoVal: '',
    description: '',
    enablePurchasePriceCode: true,
    enableMrp: true,
    enableOfferPrice: true,
    purchasePriceCode: '',
    mrpValue: '',
    offerPriceValue: '',
    grossWeight: '',
    stoneWeight: '',
    netWeight: '',
    wastage: '',
    stoneCharge: '',
    purity: '',
    hallmarkUniqueId: ''
  };

  barcodeData = {
    id: '',
    name: '',
    label: '',
    header: '',
    line: '',
    footer: '',
    barcode: 'Item Code',
    printType: 'label',
    barcodeValue: '',
    headerVal: '',
    lineVal: '',
    footerVal: '',
    updatedAt: Date.now(),
    businessId: '',
    businessCity: '',
    isProduct: true,
    printStartFrom: 1,
    addtionalTextTwo: '',
    addtionalTextTwoVal: '',
    description: '',
    enablePurchasePriceCode: true,
    enableMrp: true,
    enableOfferPrice: true,
    purchasePriceCode: '',
    mrpValue: '',
    offerPriceValue: '',
    grossWeight: '',
    stoneWeight: '',
    netWeight: '',
    wastage: '',
    stoneCharge: '',
    purity: '',
    hallmarkUniqueId: ''
  };

  barcodeFullData = {
    id: '',
    name: '',
    label: '',
    header: '',
    line: '',
    footer: '',
    barcode: 'Item Code',
    printType: 'label',
    barcodeValue: '',
    headerVal: '',
    lineVal: '',
    footerVal: '',
    updatedAt: Date.now(),
    businessId: '',
    businessCity: '',
    isProduct: true,
    printStartFrom: 1,
    addtionalTextTwo: '',
    addtionalTextTwoVal: '',
    description: '',
    enablePurchasePriceCode: true,
    enableMrp: true,
    enableOfferPrice: true,
    purchasePriceCode: '',
    mrpValue: '',
    offerPriceValue: '',
    grossWeight: '',
    stoneWeight: '',
    netWeight: '',
    wastage: '',
    stoneCharge: '',
    purity: '',
    hallmarkUniqueId: ''
  };

  defaultBarcodeData = {
    id: '',
    name: '',
    label: '',
    header: '',
    line: '',
    footer: '',
    barcode: 'Item Code',
    printType: 'label',
    barcodeValue: '',
    headerVal: '',
    lineVal: '',
    footerVal: '',
    updatedAt: Date.now(),
    businessId: '',
    businessCity: '',
    isProduct: true,
    printStartFrom: 1,
    addtionalTextTwo: '',
    addtionalTextTwoVal: '',
    description: '',
    enablePurchasePriceCode: true,
    enableMrp: true,
    enableOfferPrice: true,
    purchasePriceCode: '',
    mrpValue: '',
    offerPriceValue: '',
    grossWeight: '',
    stoneWeight: '',
    netWeight: '',
    wastage: '',
    stoneCharge: '',
    purity: '',
    hallmarkUniqueId: ''
  };

  emptyBarcodeData = {
    id: '',
    name: '',
    label: '',
    header: '',
    line: '',
    footer: '',
    barcode: 'Item Code',
    printType: 'label',
    barcodeValue: '',
    headerVal: '',
    lineVal: '',
    footerVal: '',
    updatedAt: Date.now(),
    businessId: '',
    businessCity: '',
    isProduct: true,
    printStartFrom: 1,
    addtionalTextTwo: '',
    addtionalTextTwoVal: '',
    description: '',
    enablePurchasePriceCode: true,
    enableMrp: true,
    enableOfferPrice: true,
    purchasePriceCode: '',
    mrpValue: '',
    offerPriceValue: '',
    grossWeight: '',
    stoneWeight: '',
    netWeight: '',
    wastage: '',
    stoneCharge: '',
    purity: '',
    hallmarkUniqueId: ''
  };

  barcodeDialogOpen = false;
  barcodeLabelAlertDialog = false;

  searchProductResult = [];

  BarcodeFinalArrayList = [];
  BarcodeFinalLabelArrayList = [];
  previewBarcodeDialog = false;
  withoutBarcodeFinalArray = [];

  openEditLabel = false;

  handelPreviewBarcodeOpen = (type, size, labelType, printType) => {
    this.withoutBarcodeFinalArray = [];
    this.BarcodeFinalArrayList = [];
    this.BarcodeFinalLabelArrayList = [];
    if (printType === 'regular') {
      let subArray = [];
      let arrayIndex = 0;

      if (labelType === 'withoutbarcode') {
        this.barcodeDataList.forEach((ele, index) => {
          let array = [];
          if (index === 0) {
            if (ele.printStartFrom === 1) {
              array = array.concat(
                [...Array(parseInt(Number(ele.label)))].map((_, i) => toJS(ele))
              );
            }
            if (ele.printStartFrom !== 1) {
              array = array.concat(
                [...Array(parseInt(ele.printStartFrom - 1))].map((_, i) =>
                  toJS(this.emptyBarcodeData)
                )
              );
              array = array.concat(
                [...Array(parseInt(Number(ele.label)))].map((_, i) => toJS(ele))
              );
            }
          } else {
            array = array.concat(
              [...Array(parseInt(Number(ele.label)))].map((_, i) => toJS(ele))
            );
          }
          array.forEach((res) => {
            if (subArray.length <= size) {
              subArray = subArray.concat(res);
              this.withoutBarcodeFinalArray[arrayIndex] = subArray;
            }
            if (subArray.length === size) {
              subArray = [];
              arrayIndex = arrayIndex + 1;
            }
          });

          if (index === this.barcodeDataList.length - 1) {
            if (
              this.withoutBarcodeFinalArray[arrayIndex] &&
              this.withoutBarcodeFinalArray[arrayIndex].length < size
            ) {
              this.withoutBarcodeFinalArray[arrayIndex] =
                this.withoutBarcodeFinalArray[arrayIndex].concat(
                  [
                    ...Array(
                      parseInt(
                        size - this.withoutBarcodeFinalArray[arrayIndex].length
                      )
                    )
                  ].map((_, i) => toJS(this.emptyBarcodeData))
                );
            }
          }
        });
      } else {
        this.barcodeDataList.forEach((ele, index) => {
          let array = [];
          if (index === 0) {
            if (ele.printStartFrom === 1) {
              array = array.concat(
                [...Array(parseInt(Number(ele.label)))].map((_, i) => toJS(ele))
              );
            }
            if (ele.printStartFrom !== 1) {
              array = array.concat(
                [...Array(parseInt(ele.printStartFrom - 1))].map((_, i) =>
                  toJS(this.emptyBarcodeData)
                )
              );
              array = array.concat(
                [...Array(parseInt(Number(ele.label)))].map((_, i) => toJS(ele))
              );
            }
          } else {
            array = array.concat(
              [...Array(parseInt(Number(ele.label)))].map((_, i) => toJS(ele))
            );
          }
          array.forEach((res) => {
            if (subArray.length <= size) {
              subArray = subArray.concat(res);
              this.BarcodeFinalArrayList[arrayIndex] = subArray;
            }
            if (subArray.length === size) {
              subArray = [];
              arrayIndex = arrayIndex + 1;
            }
          });

          if (index === this.barcodeDataList.length - 1) {
            if (
              this.BarcodeFinalArrayList[arrayIndex] &&
              this.BarcodeFinalArrayList[arrayIndex].length < size
            ) {
              this.BarcodeFinalArrayList[arrayIndex] =
                this.BarcodeFinalArrayList[arrayIndex].concat(
                  [
                    ...Array(
                      parseInt(
                        size - this.BarcodeFinalArrayList[arrayIndex].length
                      )
                    )
                  ].map((_, i) => toJS(this.emptyBarcodeData))
                );
            }
          }
        });
      }
    } else {
      let subArray = [];
      let arrayIndex = 0;

      let arrayLength =
        size === 65
          ? 5
          : size === 48
          ? 4
          : size === 24
          ? 3
          : size === 12 || size === 2 || size === 2.1 || size === 2.2 || size === 2.4
          ? 2
          : 1;
      if (type === 'custom') {
        arrayLength = 2;
      }

      this.barcodeDataList.forEach((ele) => {
        let array =
          parseInt(ele.label) > 1
            ? [...Array(parseInt(ele.label))].map((_, i) => toJS(ele))
            : [ele];

        array.forEach((res) => {
          if (subArray.length <= arrayLength) {
            subArray = subArray.concat(res);
            this.BarcodeFinalArrayList[arrayIndex] = subArray;
          }
          if (subArray.length === arrayLength) {
            subArray = [];
            arrayIndex = arrayIndex + 1;
          }
        });
      });
    }
    this.previewBarcodeDialog = true;
  };

  handelPreviewBarcodeClose = () => {
    this.previewBarcodeDialog = false;
    this.BarcodeFinalArrayList = [];
    this.BarcodeFinalLabelArrayList = [];
    this.withoutBarcodeFinalArray = [];
  };

  setBarcodeDataProperty = (val, property) => {
    this.barcodeData[property] = val;
    this.barcodeDisplayData[property] = val;
  };

  handleRemoveBarcodeListData = async (item) => {
    this.deleteBarcodeData(item);
  };

  handleBarcodeLabelAlertClose = async () => {
    this.barcodeLabelAlertDialog = false;
  };

  handleReplaceProduct = async () => {
    this.barcodeLabelAlertDialog = false;
    this.barcodeData.id = 1;
    this.barcodeDisplayData.id = 1;
    runInAction(() => {
      this.barcodeDataList[0] = this.barcodeData;
    });
    this.resetBarcodeData();
  };

  resetBarcodeListData = async () => {
    this.barcodeDataList.forEach((ele) => {
      this.deleteBarcodeData(ele);
    });
    this.barcodeDisplayData = this.defaultBarcodeData;
  };

  handleBarCodeModalClose = () => {
    this.barcodeDialogOpen = false;
  };

  resetBarcodeData = async () => {
    this.barcodeData = this.defaultBarcodeData;
    this.barcodeDisplayData = this.defaultBarcodeData;
  };

  sectedProductForBarcode = async (product) => {
    this.productDetail = toJS(product);
    // console.log(toJS(this.productDetail));
  };

  handleBarCodeModalClose = () => {
    this.barcodeDialogOpen = false;
  };

  handleBarCodeModal = async (item) => {
    console.log(item);
    this.barcodeDialogOpen = true;
  };

  addBarcodeData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    // generate unique id
    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('bc');
    this.barcodeData.id = `${id}${appId}${timestamp}`;
    this.barcodeData.businessId = businessData.businessId;
    this.barcodeData.businessCity = businessData.businessCity;

    if (
      this.barcodeData.mrpValue === '' ||
      this.barcodeData.mrpValue === undefined ||
      this.barcodeData.mrpValue === null
    ) {
      this.barcodeData.mrpValue = 0;
    }

    if (
      this.barcodeData.offerPriceValue === '' ||
      this.barcodeData.offerPriceValue === undefined ||
      this.barcodeData.offerPriceValue === null
    ) {
      this.barcodeData.offerPriceValue = 0;
    }

    const InsertDoc = this.barcodeData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    InsertDoc.label = this.barcodeData.label ? this.barcodeData.label.toString() : '';

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.barcodesettings
      .insert(InsertDoc)
      .then(() => {
        this.resetBarcodeData();
        // console.log('this.barcode:: data Inserted');
      })
      .catch((err) => {
        // console.log('this.barcode:: data insertion Failed::', err);
      });
  };

  updateBarcodeData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = this.barcodeData;

    let newTxnData = {};
    newTxnData.id = oldTxnData.id;
    newTxnData.updatedAt = Date.now();
    newTxnData.name = oldTxnData.name;
    newTxnData.label = oldTxnData.label.toString();
    newTxnData.header = oldTxnData.header;
    newTxnData.line = oldTxnData.line;
    newTxnData.footer = oldTxnData.footer;
    newTxnData.barcode = oldTxnData.barcode;
    newTxnData.printType = oldTxnData.printType;
    newTxnData.barcodeValue = oldTxnData.barcodeValue;
    newTxnData.headerVal = oldTxnData.headerVal;
    newTxnData.lineVal = oldTxnData.lineVal;
    newTxnData.footerVal = oldTxnData.footerVal;
    newTxnData.businessId = oldTxnData.businessId;
    newTxnData.businessCity = oldTxnData.businessCity;
    newTxnData.isProduct = oldTxnData.isProduct;
    newTxnData.printStartFrom = oldTxnData.printStartFrom;
    newTxnData.addtionalTextTwo = oldTxnData.addtionalTextTwo;
    newTxnData.addtionalTextTwoVal = oldTxnData.addtionalTextTwoVal;
    newTxnData.description = oldTxnData.description;
    newTxnData.enablePurchasePriceCode = oldTxnData.enablePurchasePriceCode;
    newTxnData.enableMrp = oldTxnData.enableMrp;
    newTxnData.enableOfferPrice = oldTxnData.enableOfferPrice;
    newTxnData.purchasePriceCode = oldTxnData.purchasePriceCode;
    newTxnData.mrpValue = oldTxnData.mrpValue;
    newTxnData.offerPriceValue = oldTxnData.offerPriceValue;
    newTxnData.grossWeight = oldTxnData.grossWeight;
    newTxnData.stoneWeight = oldTxnData.stoneWeight;
    newTxnData.netWeight = oldTxnData.netWeight;
    newTxnData.wastage = oldTxnData.wastage;
    newTxnData.stoneCharge = oldTxnData.stoneCharge;
    newTxnData.purity = oldTxnData.purity;
    newTxnData.hallmarkUniqueId = oldTxnData.hallmarkUniqueId;

    if (
      newTxnData.mrpValue === '' ||
      newTxnData.mrpValue === undefined ||
      newTxnData.mrpValue === null
    ) {
      newTxnData.mrpValue = 0;
    }

    if (
      newTxnData.offerPriceValue === '' ||
      newTxnData.offerPriceValue === undefined ||
      newTxnData.offerPriceValue === null
    ) {
      newTxnData.offerPriceValue = 0;
    }

    await db.barcodesettings
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.barcodeData.id } }
          ]
        }
      })
      .update({
        $set: {
          id: newTxnData.id,
          name: newTxnData.name,
          label: newTxnData.label,
          header: newTxnData.header,
          line: newTxnData.line,
          footer: newTxnData.footer,
          barcode: newTxnData.barcode,
          printType: newTxnData.printType,
          barcodeValue: newTxnData.barcodeValue,
          headerVal: newTxnData.headerVal,
          lineVal: newTxnData.lineVal,
          footerVal: newTxnData.footerVal,
          updatedAt: newTxnData.updatedAt,
          businessId: newTxnData.businessId,
          businessCity: newTxnData.businessCity,
          isProduct: newTxnData.isProduct,
          printStartFrom: newTxnData.printStartFrom,
          addtionalTextTwo: newTxnData.addtionalTextTwo,
          addtionalTextTwoVal: newTxnData.addtionalTextTwoVal,
          description: newTxnData.description,
          enablePurchasePriceCode: newTxnData.enablePurchasePriceCode,
          enableMrp: newTxnData.enableMrp,
          enableOfferPrice: newTxnData.enableOfferPrice,
          purchasePriceCode: newTxnData.purchasePriceCode,
          mrpValue: newTxnData.mrpValue,
          offerPriceValue: newTxnData.offerPriceValue,
          grossWeight: newTxnData.grossWeight,
          stoneWeight: newTxnData.stoneWeight,
          netWeight: newTxnData.netWeight,
          wastage: newTxnData.wastage,
          stoneCharge: newTxnData.stoneCharge,
          purity: newTxnData.purity,
          hallmarkUniqueId: newTxnData.hallmarkUniqueId
        }
      })
      .then(async () => {
        this.barcodeData = this.defaultBarcodeData;
        this.handleBarcodeEditClose();
      });
  };

  editBarcodeData = async (data) => {
    this.barcodeData = data;
    this.openEditLabel = true;
  };

  handleBarcodeEditClose = () => {
    this.openEditLabel = false;
  };

  addBulkBarcodeData = async (bulkCustomerData) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;

    for (let data of bulkCustomerData) {
      let barcodeData = this.defaultBarcodeData;
      // generate unique id
      const timestamp = Date.now();

      const id = _uniqueId('bc');
      barcodeData.id = `${id}${appId}${timestamp}`;
      barcodeData.businessId = businessData.businessId;
      barcodeData.businessCity = businessData.businessCity;
      barcodeData.printType = 'regular';
      barcodeData.isProduct = false;
      barcodeData.printStartFrom = 1;
      barcodeData.footer = data.additionalText1;
      barcodeData.addtionalTextTwo = data.additionalText2;
      barcodeData.name = data.name;
      barcodeData.header = data.name;
      barcodeData.line = data.address;
      barcodeData.label = 1;

      const InsertDoc = barcodeData;
      InsertDoc.posId = parseFloat(businessData.posDeviceId);
      InsertDoc.updatedAt = Date.now();

      await db.barcodesettings
        .insert(InsertDoc)
        .then(() => {
          console.log('this.barcode:: data insertion success::', InsertDoc);
        })
        .catch((err) => {
          // console.log('this.barcode:: data insertion Failed::', err);
        });
    }
  };

  addBulkBarcodeDataForVariations = async (
    productData,
    noOfLabels,
    originalProduct,
    printType
  ) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;

    for (let data of productData) {
      let barcodeData = this.defaultBarcodeData;
      // generate unique id
      const timestamp = Date.now();

      const id = _uniqueId('bc');
      barcodeData.id = `${id}${appId}${timestamp}`;
      barcodeData.businessId = businessData.businessId;
      barcodeData.businessCity = businessData.businessCity;
      barcodeData.printType = printType;
      barcodeData.isProduct = true;
      barcodeData.printStartFrom = 1;
      barcodeData.name = originalProduct.name;
      barcodeData.header = data.name;
      barcodeData.label = noOfLabels;
      barcodeData.barcode = data.barcode;

      let saleObject = this.getSalePriceData(
        data,
        data.salePrice,
        originalProduct.cgst,
        originalProduct.sgst,
        originalProduct.igst,
        originalProduct.taxIncluded,
        data.saleDiscountAmount,
        originalProduct.finalMRPPrice
      );

      if (printType === 'regular') {
        if (data.purchasedPrice > 0) {
          let ppc = await this.getPurchasePriceCode(data.purchasedPrice);
          if (ppc && ppc !== null && ppc !== undefined && ppc !== '') {
            barcodeData.purchasePriceCode = ppc;
          }
        }

        barcodeData.enablePurchasePriceCode =
          this.barcodeData.enablePurchasePriceCode;
        barcodeData.enableMrp = this.barcodeData.enableMrp;
        barcodeData.enableOfferPrice = this.barcodeData.enableOfferPrice;
        barcodeData.headerVal = 'business_name';
        barcodeData.header = localStorage.getItem('businessName');
        barcodeData.lineVal = 'product_name';
        barcodeData.line = originalProduct.name;
        barcodeData.mrpValue = saleObject.mrp;
        barcodeData.offerPriceValue = saleObject.offerPrice;
      } else {
        if (
          String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
        ) {
          barcodeData.netWeight = originalProduct.netWeight;
          barcodeData.grossWeight = originalProduct.grossWeight;
          barcodeData.stoneWeight = originalProduct.stoneWeight;
          barcodeData.wastage = originalProduct.wastageGrams;
          barcodeData.purity = originalProduct.purity;
          barcodeData.hallmarkUniqueId = originalProduct.hallmarkUniqueId;
        } else {
          barcodeData.headerVal = 'business_name';
          barcodeData.header = localStorage.getItem('businessName');
          barcodeData.lineVal = 'product_name';

          if (saleObject.mrp > 0 && saleObject.offerPrice > 0) {
            barcodeData.footer = `MRP: ₹${saleObject.mrp} OFFER: ₹${saleObject.offerPrice}`;
          } else {
            barcodeData.footer = `MRP: ₹${saleObject.mrp}`;
          }
          barcodeData.footerVal = 'sale_price';
          barcodeData.line = originalProduct.name;
        }
      }

      let properties = '';
      data.properties.map(
        (batchData) =>
          (properties += batchData.title + ': ' + batchData.value + ' ')
      );
      barcodeData.description = properties;

      const InsertDoc = barcodeData;
      InsertDoc.posId = parseFloat(businessData.posDeviceId);
      InsertDoc.updatedAt = Date.now();

      await db.barcodesettings
        .insert(InsertDoc)
        .then(() => {
          console.log('this.barcode:: data insertion success::', InsertDoc);
        })
        .catch((err) => {
          // console.log('this.barcode:: data insertion Failed::', err);
        });
    }
  };

  getSalePriceData = (
    productItem,
    salePrice,
    cgst,
    sgst,
    igst,
    taxIncluded,
    saleDiscountAmount,
    finalMRPPrice
  ) => {
    let saleObj = {
      mrp: 0,
      offerPrice: 0
    };

    if (saleDiscountAmount > 0) {
    let tax = (parseFloat(cgst) || 0) + (parseFloat(sgst) || 0);
    let igst_tax = parseFloat(igst || 0);

    let itemPrice = salePrice;

    let totalGST = 0;
    let totalIGST = 0;
    let mrp_before_tax = 0;

    if (taxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
      //totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
    }

    mrp_before_tax = parseFloat(
      itemPrice - parseFloat(totalGST) - parseFloat(totalIGST)
    );
    let itemPriceAfterDiscount = mrp_before_tax - saleDiscountAmount;
    let cgst_amount = 0;
    let sgst_amount = 0;
    let igst_amount = 0;

    if (!taxIncluded) {
      const totalGST = (itemPriceAfterDiscount * tax) / 100;
      cgst_amount = totalGST / 2;
      sgst_amount = totalGST / 2;
      //igst_amount = (itemPriceAfterDiscount * igst_tax) / 100;
    } else {
      let totalGST = 0;
      let amount = 0;

      if (saleDiscountAmount > 0) {
        totalGST = itemPriceAfterDiscount * (tax / 100);
        cgst_amount = totalGST / 2;
        sgst_amount = totalGST / 2;

        amount = itemPriceAfterDiscount * (igst_tax / 100);

       // igst_amount = Math.round(amount * 100) / 100;
      }
    }

    const finalOfferAmount = parseFloat(
      mrp_before_tax -
        saleDiscountAmount +
        cgst_amount +
        sgst_amount +
        igst_amount
    );

    saleObj.mrp = salePrice;
    saleObj.offerPrice = Math.round(finalOfferAmount * 100) / 100 || 0;

  } else if (finalMRPPrice > 0 && productItem.salePrice > 0) {
      saleObj.mrp = finalMRPPrice;
      saleObj.offerPrice = productItem.salePrice;
    } else if (productItem.finalMRPPrice > 0 && productItem.salePrice === 0) {
      saleObj.mrp = productItem.finalMRPPrice;
      saleObj.offerPrice = 0;
    } else {
      saleObj.mrp = salePrice;
      saleObj.offerPrice = 0;
    }

    saleObj.mrp = parseFloat(saleObj.mrp.toFixed(2));
    saleObj.offerPrice = parseFloat(saleObj.offerPrice.toFixed(2));

    return saleObj;
  };

  getAllBarcodeData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.barcodesettings.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      runInAction(() => {
        this.barcodeDataList = data.map((item) => item.toJSON());
        this.barcodeFullDataList = data.map((item) => item.toJSON());
        if (this.barcodeDataList.length === 0 && this.barcodeData.name === '') {
          this.barcodeDisplayData = this.defaultBarcodeData;
          this.barcodeFullDataList = this.defaultBarcodeData;
        }
      });
    });
  };

  deleteBarcodeData = async (item) => {
    // console.log('this.barcode:: delete barcode called::', item);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.barcodesettings.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: item.id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        // console.log('barcode data removed' + data);
        runInAction(() => {
          // this.barcodeData = this.defaultBarcodeData;
        });
      })
      .catch((error) => {
        console.log('barcode deletion Failed ' + error);
        // alert('Error in Removing Data');
      });
  };

  setBarcodeData = (data) => {
    this.barcodeDisplayData = data;
  };

  addBulkBarcodeDataFromPurchase = async (purchaseItems) => {
    this.barcodeDisplayData = this.defaultBarcodeData;
    this.deleteAllBarcodeData(purchaseItems);
  };

  addBarcodes = async (purchaseItems, businessData, db) => {
    const appId = businessData.posDeviceId;

    for (let data of purchaseItems) {
      let Query = await db.businessproduct.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { productId: { $eq: data.product_id } }
          ]
        }
      });

      await Query.exec().then(async (dataOutput) => {
        if (dataOutput) {
          let barcodeData = this.defaultBarcodeData;
          // generate unique id
          const timestamp = Date.now();

          const id = _uniqueId('bc');
          barcodeData.id = `${id}${appId}${timestamp}`;
          barcodeData.businessId = businessData.businessId;
          barcodeData.businessCity = businessData.businessCity;
          barcodeData.printType = 'regular';
          barcodeData.isProduct = true;
          barcodeData.printStartFrom = 1;
          barcodeData.label = data.qty.toString();
          barcodeData.name = data.item_name;
          barcodeData.headerVal = 'business_name';
          barcodeData.header = localStorage.getItem('businessName');
          barcodeData.lineVal = data.product_name;
          barcodeData.line = data.item_name;
          barcodeData.description = data.description;

          let batchData = null;
          let purchasedPrice = 0;
          let salePrice = 0;
          let saleDiscountAmount = 0;
          let saleDiscountPercent = 0;
          let saleDiscountType = '';
          let cgst = 0;
          let sgst = 0;
          let igst = 0;
          let taxIncluded = true;
          let purchaseDiscountAmount = 0;
          let purchaseDiscountPercent = 0;
          let purchaseDiscountType = '';
          let purchaseCgst = 0;
          let purchaseSgst = 0;
          let purchaseIgst = 0;
          let purchaseTaxIncluded = true;
          let barcode = '';

          let index = -1;

          if (data.batch_id) {
            /**
             * find index on batch
             */

            index = dataOutput.batchData.findIndex(
              (a) => a.id === data.batch_id
            );
            if (index >= 0) {
              batchData = dataOutput.batchData[index];
            }
          }

          if (batchData) {
            purchasedPrice = batchData.purchasedPrice;
            salePrice = batchData.salePrice;
            saleDiscountAmount = batchData.saleDiscountAmount;
            saleDiscountPercent = batchData.saleDiscountPercent;
            saleDiscountType = batchData.saleDiscountType;
            purchaseDiscountAmount = batchData.purchaseDiscountAmount;
            purchaseDiscountPercent = batchData.purchaseDiscountPercent;
            purchaseDiscountType = batchData.purchaseDiscountType;
            barcode = batchData.barcode;
          } else {
            purchasedPrice = dataOutput.purchasedPrice;
            salePrice = dataOutput.salePrice;
            saleDiscountAmount = dataOutput.saleDiscountAmount;
            saleDiscountPercent = dataOutput.saleDiscountPercent;
            saleDiscountType = dataOutput.saleDiscountType;
            purchaseDiscountAmount = dataOutput.purchaseDiscountAmount;
            purchaseDiscountPercent = dataOutput.purchaseDiscountPercent;
            purchaseDiscountType = dataOutput.purchaseDiscountType;
            barcode = dataOutput.barcode;
          }

          cgst = dataOutput.cgst;
          sgst = dataOutput.sgst;
          igst = dataOutput.igst;
          taxIncluded = dataOutput.taxIncluded;
          purchaseCgst = dataOutput.purchaseCgst;
          purchaseSgst = dataOutput.purchaseSgst;
          purchaseIgst = dataOutput.purchaseIgst;
          purchaseTaxIncluded = dataOutput.purchaseTaxIncluded;

          let tax = (parseFloat(cgst) || 0) + (parseFloat(sgst) || 0);
          let igst_tax = parseFloat(igst || 0);

          let itemPrice = salePrice;

          let totalGST = 0;
          let totalIGST = 0;
          let mrp_before_tax = 0;

          if (taxIncluded) {
            totalGST = itemPrice - itemPrice * (100 / (100 + tax));
            totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
          }

          mrp_before_tax = parseFloat(
            itemPrice - parseFloat(totalGST) - parseFloat(totalIGST)
          );
          let itemPriceAfterDiscount = mrp_before_tax - saleDiscountAmount;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let igst_amount = 0;

          if (!taxIncluded) {
            const totalGST = (itemPriceAfterDiscount * tax) / 100;
            cgst_amount = totalGST / 2;
            sgst_amount = totalGST / 2;
            igst_amount = (itemPriceAfterDiscount * igst_tax) / 100;
          } else {
            let totalGST = 0;
            let amount = 0;

            if (saleDiscountAmount > 0) {
              totalGST = itemPriceAfterDiscount * (tax / 100);
              cgst_amount = totalGST / 2;
              sgst_amount = totalGST / 2;

              amount = itemPriceAfterDiscount * (igst_tax / 100);

              igst_amount = Math.round(amount * 100) / 100;
            }
          }

          const finalOfferAmount = parseFloat(
            mrp_before_tax -
              saleDiscountAmount +
              cgst_amount +
              sgst_amount +
              igst_amount
          );

          purchasedPrice = await this.getActualPurchasePrice(
            purchasedPrice,
            purchaseCgst,
            purchaseSgst,
            purchaseIgst,
            purchaseTaxIncluded,
            purchaseDiscountAmount
          );

          if (purchasedPrice > 0) {
            let ppc = await this.getPurchasePriceCode(purchasedPrice);
            if (ppc && ppc !== null && ppc !== undefined && ppc !== '') {
              barcodeData.purchasePriceCode = ppc;
              barcodeData.enablePurchasePriceCode = true;
            }
          }

          barcodeData.barcode = barcode;

          if (dataOutput.finalMRPPrice > 0 && saleDiscountAmount === 0) {
            barcodeData.enableMrp = true;
            barcodeData.enableOfferPrice = true;
            barcodeData.mrpValue = data.finalMRPPrice;
            barcodeData.offerPriceValue = parseFloat(data.mrp || 0);
          } else if (saleDiscountAmount > 0) {
            barcodeData.enableMrp = true;
            barcodeData.enableOfferPrice = true;
            barcodeData.mrpValue = salePrice;
            barcodeData.offerPriceValue = parseFloat(finalOfferAmount || 0);
          } else {
            barcodeData.enableMrp = true;
            barcodeData.enableOfferPrice = false;
            barcodeData.mrpValue = salePrice;
            barcodeData.offerPriceValue = 0;
          }

          const InsertDoc = barcodeData;
          InsertDoc.posId = parseFloat(businessData.posDeviceId);
          InsertDoc.updatedAt = Date.now();

          await db.barcodesettings
            .insert(InsertDoc)
            .then(() => {
              console.log('this.barcode:: data insertion success::', InsertDoc);
            })
            .catch((err) => {
              // console.log('this.barcode:: data insertion Failed::', err);
            });
        }
      });
    }
  };

  deleteAllBarcodeData = async (purchaseItems) => {
    // console.log('this.barcode:: delete barcode called::', item);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.barcodesettings.find({
      selector: {
        $and: [{ businessId: { $eq: businessData.businessId } }]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        this.addBarcodes(purchaseItems, businessData, db);
      })
      .catch((error) => {
        console.log('barcode deletion Failed ' + error);
      });
  };

  getPurchasePriceCode = async (purchasePrice) => {
    let settings = await txnSettings.getTransactionData();
    let purchasePurchaseCode = settings.purchasePriceCode;
    let codeMap = new Map();

    let number = 1;

    if (
      purchasePurchaseCode &&
      purchasePurchaseCode !== null &&
      purchasePurchaseCode !== undefined &&
      purchasePurchaseCode.length > 0
    ) {
      const purchasePurchaseCodeArray = purchasePurchaseCode.split('');
      if (purchasePurchaseCodeArray && purchasePurchaseCodeArray.length > 0) {
        for (let code of purchasePurchaseCodeArray) {
          const newNumber = number.toString();
          codeMap.set(newNumber, code);
          if (number === 9) {
            number = 0;
          } else {
            number++;
          }
        }
      }
    }

    let purchasePriceString = '';

    if (codeMap) {
      const purchasePriceArray = purchasePrice.toString().split('');
      if (purchasePriceArray && purchasePriceArray.length > 0) {
        for (let p of purchasePriceArray) {
          purchasePriceString +=
            codeMap.get(p) !== undefined ? codeMap.get(p) : '';
        }
      }
    }

    if (purchasePriceString === undefined) {
      purchasePriceString = '';
    }

    return purchasePriceString;
  };

  getActualPurchasePrice = (
    purchasePrice,
    cgst,
    sgst,
    igst,
    taxIncluded,
    purchaseDiscountAmount
  ) => {
    let tax = (parseFloat(cgst) || 0) + (parseFloat(sgst) || 0);
    let igst_tax = parseFloat(igst || 0);

    let itemPrice = purchasePrice;

    let totalGST = 0;
    let totalIGST = 0;
    let mrp_before_tax = 0;

    if (taxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
      totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
    }

    mrp_before_tax = parseFloat(
      itemPrice - parseFloat(totalGST) - parseFloat(totalIGST)
    );
    let itemPriceAfterDiscount = mrp_before_tax - purchaseDiscountAmount;
    let cgst_amount = 0;
    let sgst_amount = 0;
    let igst_amount = 0;

    if (!taxIncluded) {
      const totalGST = (itemPriceAfterDiscount * tax) / 100;
      cgst_amount = totalGST / 2;
      sgst_amount = totalGST / 2;
      igst_amount = (itemPriceAfterDiscount * igst_tax) / 100;
    } else {
      let totalGST = 0;
      let amount = 0;

      if (purchaseDiscountAmount > 0) {
        totalGST = itemPriceAfterDiscount * (tax / 100);
        cgst_amount = totalGST / 2;
        sgst_amount = totalGST / 2;

        amount = itemPriceAfterDiscount * (igst_tax / 100);

        igst_amount = Math.round(amount * 100) / 100;
      }
    }

    const finalOfferAmount = parseFloat(
      mrp_before_tax -
        purchaseDiscountAmount +
        cgst_amount +
        sgst_amount +
        igst_amount
    );

    return finalOfferAmount;
  };

  constructor() {
    makeObservable(this, {
      barcodeData: observable,
      setBarcodeDataProperty: action,
      barcodeDataList: observable,
      barcodeFullDataList: observable,
      addBarcodeData: action,
      handleRemoveBarcodeListData: action,
      handelPreviewBarcodeOpen: action,
      previewBarcodeDialog: observable,
      handleBarcodeLabelAlertClose: action,
      barcodeLabelAlertDialog: observable,
      resetBarcodeData: action,
      BarcodeFinalArrayList: observable,
      BarcodeFinalLabelArrayList: observable,
      getAllBarcodeData: action,
      barcodeDialogOpen: observable,
      setBarcodeData: action,
      barcodeDisplayData: observable,
      openEditLabel: observable
    });
  }
}
export default new BarcodeStore();