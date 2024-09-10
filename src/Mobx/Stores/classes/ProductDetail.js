import Category from './Category';
import Adjustment from './Adjustment';
import BatchData from './BatchData';
import RawMaterialData from './RawMaterialData';
import Unit from './Unit';
import SerialData from './SerialData';
import ProductAddonData from './ProductAddonData';
import RateData from './RateData';

export default class ProductDetail {
  constructor() {
    this.businessId = '';
    this.businessCity = '';
    this.productId = '';
    this.categoryLevel2 = new Category().defaultValues();
    this.categoryLevel3 = new Category().defaultValues();
    this.isOnLine = false;
    this.isOffLine = true;
    this.name = '';
    this.brandName = '';
    this.description = '';
    this.imageUrl = '';
    this.finalMRPPrice = '';
    this.purchasedPrice = '';
    this.offerPrice = '';
    this.salePrice = '';
    this.stockReOrderQty = '';
    this.stockQty = '';
    this.taxType = '';
    this.isOutOfStock = false;
    this.isStockReOrderQtyReached = false;
    this.secondaryImageUrls = []; //String type
    this.batchData = []; //BatchData class type
    this.additional_property_group_list = []; //Add on class type
    this.adjustedData = []; //Adjustment class
    this.rawMaterialData = new RawMaterialData().defaultValues(); //Rawmaterial class
    this.barcode = '';
    this.cgst = '';
    this.sgst = '';
    this.igst = '';
    this.cess = '';
    this.sku = '';
    this.hsn = '';
    this.taxIncluded = true;
    this.updatedAt = '';
    this.posId = 0;
    this.mfDate = null;
    this.expiryDate = null;
    this.rack = '';
    this.warehouseData = '';
    this.enableQuantity = true;
    this.unitQty = 0;
    this.unitName = '';
    this.serialOrImeiNo = '';
    this.saleDiscountAmount = 0;
    this.saleDiscountPercent = 0;
    this.saleDiscountType = '';
    this.purchaseDiscountAmount = 0;
    this.purchaseDiscountPercent = 0;
    this.purchaseDiscountType = '';
    this.purchaseCgst = '';
    this.purchaseSgst = '';
    this.purchaseIgst = '';
    this.purchaseCess = '';
    this.purchaseTaxIncluded = true;
    this.purchaseTaxType = '';
    this.productType = 'Product';
    this.freeQty = 0;
    this.openingStockQty = 0;
    this.primaryUnit = null;
    this.secondaryUnit = null;
    this.unitConversionQty = 0;
    this.units = [];
    this.modelNo = '';
    this.makingChargePerGram = 0;
    this.isSyncedToServer = false;
    this.shortCutCode = '';
    this.serialData = [];
    this.grossWeight = 0;
    this.stoneWeight = 0;
    this.netWeight = 0;
    this.wastagePercentage = 0;
    this.wastageGrams = 0;
    this.makingChargePercent = 0;
    this.makingChargeAmount = 0;
    this.stoneCharge = 0;
    this.purity = '';
    this.rateData = null;
    this.hallmarkUniqueId = '';
    this.pdfImageUrl = '';
    this.hallmarkCharge = 0;
    this.certificationCharge = 0;
    this.onlineLink = '';
    this.batchCreatedFromManufacture = false;
    this.warrantyDays = 0;
    this.partNumber = '';
  }

  convertTypes(data) {
    const numberFields = ['updatedAt'];
    const floatFields = [
      'stockReOrderQty',
      'stockQty',
      'cgst',
      'sgst',
      'igst',
      'cess',
      'unitQty',
      'saleDiscountAmount',
      'saleDiscountPercent',
      'purchaseDiscountAmount',
      'purchaseDiscountPercent',
      'unitConversionQty',
      'freeQty',
      'openingStockQty',
      'finalMRPPrice',
      'purchasedPrice',
      'offerPrice',
      'salePrice',
      'purchaseCgst',
      'purchaseSgst',
      'purchaseIgst',
      'purchaseCess',
      'makingChargePerGram',
      'grossWeight',
      'stoneWeight',
      'netWeight',
      'wastagePercentage',
      'wastageGrams',
      'makingChargePercent',
      'makingChargeAmount',
      'stoneCharge',
      'hallmarkCharge',
      'certificationCharge',
      'warrantyDays'
    ];
    const booleanFields = [
      'isOnLine',
      'isOffLine',
      'isOutOfStock',
      'isStockReOrderQtyReached',
      'taxIncluded',
      'purchaseTaxIncluded',
      'enableQuantity',
      'isSyncedToServer',
      'batchCreatedFromManufacture'
    ];
    const categoryFields = ['categoryLevel2', 'categoryLevel3'];
    const stringFields = [
      'businessCity',
      'businessId',
      'productId',
      'name',
      'brandName',
      'description',
      'imageUrl',
      'pdfImageUrl',
      'taxType',
      'barcode',
      'sku',
      'hsn',
      'rack',
      'warehouseData',
      'unitName',
      'serialOrImeiNo',
      'saleDiscountType',
      'purchaseDiscountType',
      'purchaseTaxType',
      'productType',
      'mfDate',
      'expiryDate',
      'shareImageUrl',
      'vendorName',
      'vendorPhoneNumber',
      'modelNo',
      'shortCutCode',
      'purity',
      'hallmarkUniqueId',
      'onlineLink',
      'partNumber'
    ];

    const stringArray = ['secondaryImageUrls'];
    const batchDataFields = ['batchData'];
    const addOnsDataFields = ['additional_property_group_list'];
    const adjustmentFields = ['adjustedData'];
    const rawMaterialFields = ['rawMaterialData'];
    const serialDataFields = ['serialData'];
    const rateObjectFields = ['rateData'];

    numberFields.forEach((field) => {
      if (typeof data[field] === 'string') {
        data[field] = data[field].trim();
      }
      data[field] = Number(data[field]) || 0;
    });

    floatFields.forEach((field) => {
      if (typeof data[field] === 'string') {
        data[field] = data[field].trim();
      }
      data[field] = parseFloat(data[field]) || 0.0;
    });

    booleanFields.forEach((field) => {
      data[field] = Boolean(data[field]);
    });

    categoryFields.forEach((field) => {
      let categoryObj = data[field];
      data[field] = new Category().convertTypes(categoryObj);
    });

    stringFields.forEach((field) => {
      if (!data[field]) {
        data[field] = '';
      }
    });

    stringArray.forEach((field) => {
      if (!data[field]) {
        data[field] = [];
      }
    });

    batchDataFields.forEach((field) => {
      if (Array.isArray(data[field])) {
        data[field] = data[field].map((item) => {
          item = new BatchData().convertTypes(item);

          return item;
        });
      }
    });
    addOnsDataFields.forEach((field) => {
      if (Array.isArray(data[field])) {
        data[field] = data[field].map((item) => {
          item = new ProductAddonData().convertTypes(item);

          return item;
        });
      }
    });

    serialDataFields.forEach((field) => {
      if (Array.isArray(data[field])) {
        data[field] = data[field].map((item) => {
          item = new SerialData().convertTypes(item);

          return item;
        });
      }
    });

    adjustmentFields.forEach((field) => {
      if (Array.isArray(data[field])) {
        data[field] = data[field].map((item) => {
          item = new Adjustment().convertTypes(item);

          return item;
        });
      }
    });

    rawMaterialFields.forEach((field) => {
      data[field] = new RawMaterialData().convertTypes(data[field]);
    });

    rateObjectFields.forEach((field) => {
      if (Array.isArray(data[field])) {
        data[field] = data[field].map((item) => {
          item = new RateData().convertTypes(item);

          return item;
        });
      }
    });

    return data;
  }

  defaultValues() {
    return {
      businessId: '',
      businessCity: '',
      productId: '',
      categoryLevel2: new Category().defaultValues(),
      categoryLevel3: new Category().defaultValues(),
      isOnLine: false,
      isOffLine: true,
      name: '',
      brandName: '',
      description: '',
      imageUrl: '',
      pdfImageUrl: '',
      finalMRPPrice: '',
      purchasedPrice: '',
      offerPrice: '',
      salePrice: '',
      stockReOrderQty: 0,
      stockQty: 0,
      taxType: '',
      isOutOfStock: false,
      isStockReOrderQtyReached: false,
      secondaryImageUrls: [], //String type
      batchData: [], //BatchData class type
      additional_property_group_list: [], //BatchData class type
      adjustedData: [], //Adjustment class
      rawMaterialData: new RawMaterialData().defaultValues(), //Rawmaterial class
      barcode: '',
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      sku: '',
      hsn: '',
      taxIncluded: true,
      updatedAt: '',
      posId: 0,
      mfDate: '',
      expiryDate: '',
      rack: '',
      warehouseData: '',
      enableQuantity: true,
      unitQty: 0,
      unitName: '',
      serialOrImeiNo: '',
      saleDiscountAmount: 0,
      saleDiscountPercent: 0,
      saleDiscountType: '',
      purchaseDiscountAmount: 0,
      purchaseDiscountPercent: 0,
      purchaseDiscountType: '',
      purchaseCgst: 0,
      purchaseSgst: 0,
      purchaseIgst: 0,
      purchaseCess: 0,
      purchaseTaxIncluded: true,
      purchaseTaxType: '',
      productType: 'Product',
      freeQty: 0,
      openingStockQty: 0,
      primaryUnit: new Unit().defaultValues(), //object of Unit type
      secondaryUnit: new Unit().defaultValues(), //object of Unit type
      unitConversionQty: 0,
      units: [],
      modelNo: '',
      makingChargePerGram: 0,
      isSyncedToServer: false,
      shortCutCode: '',
      serialData: [],
      grossWeight: 0,
      stoneWeight: 0,
      netWeight: 0,
      wastagePercentage: 0,
      wastageGrams: 0,
      makingChargePercent: 0,
      makingChargeAmount: 0,
      stoneCharge: 0,
      purity: '',
      rateData: new RateData().defaultValues(),
      hallmarkUniqueId: '',
      hallmarkCharge: 0,
      certificationCharge: 0,
      onlineLink: '',
      batchCreatedFromManufacture: false,
      warrantyDays: 0,
      partNumber: ''
    };
  }
}