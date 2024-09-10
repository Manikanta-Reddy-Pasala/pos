import {
  action,
  computed,
  observable,
  makeObservable,
  runInAction,
  toJS
} from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Bd from '../../components/SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';
import * as productTxnHelper from '../../components/Helpers/ProductTxnHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as unitHelper from 'src/components/Helpers/ProductUnitHelper';
import Adjustment from './classes/Adjustment';
import BatchData from './classes/BatchData';
import ProductDetail from './classes/ProductDetail';
import Category from './classes/Category';
import {
  getBusinessProducts,
  removeProduct
} from 'src/components/Helpers/BusinessProductSearchHelper';
import RawMaterialData from './classes/RawMaterialData';
import ProductAddonData from './classes/ProductAddonData';

import {
  getLevel2Categorieslist,
  getLevel3Categorieslist,
  getLevel2CategoryByName
} from 'src/components/Helpers/BusinessCategoriesQueryHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import SerialData from './classes/SerialData';
import axios from 'axios';
import * as uniqueCodeGenerator from '../../components/Helpers/UniqueCodeGenerator';
import {
  excelMapping,
  updateExcelMapping
} from 'src/components/Helpers/ExcelMappingHelper';

var dateFormat = require('dateformat');

class ProductStore {
  productCategory = [];
  businessProductList = [];
  productDialogOpen = false;
  openLoader = false;
  productAddBatchDialogOpen = false;
  productAdjustmentDialogOpen = false;
  exportToExcelDialogOpen = false;
  isProductUpdated = false;
  ExcelDialogOpen = false;
  isBatchUpdate = false;
  isAdjustmentUpdate = false;
  isLoading = false;
  level2CategoriesList = [];
  level3CategoriesList = [];
  ProductChosenProperties = [];
  adjustedStockValue = 0;
  mfgOpenDialog = false;
  editMfgOpenDialog = false;
  isComingFromManufacture = false;
  selectedLevel3CategoryName = '';
  isManufacturing = false;
  openManufactureLoadingAlertMessage = false;
  openProductLoadingAlertMessage = false;
  productAddSerialDialogOpen = false;

  searchProductResult = [];
  oldTxnData = {};
  isManufactureListRefreshed = false;
  productTxnSettingsData = {};
  productTxnEnableFieldsMap = new Map();
  batchNotAvailableError = false;

  alterStockOpenDialog = false;
  openAlterStockLoadingAlertMessage = false;
  isAlterStockListRefreshed = false;

  openMfgSequenceNumberFailureAlert = false;
  isProductComingFromRawMaterials = false;
  addOnsDialogOpen = false;
  isAddOnsEdit = false;
  addOnsEditIndex = '';
  addOnsListDialogOpen = false;
  isProperties = false;
  addOnsGroupList = [];
  addOnsList = [];
  choosenAddOnsList = [];
  productsNotProcessed = [];
  serialModelOpen = false;
  isSerialEdit = false;

  constructor() {
    this.selectedLevel2Category = new Category().defaultValues();
    this.selectedLevel3Category = new Category().defaultValues();

    this.singleBatchData = new BatchData().defaultValues();
    this.singleAdjustedData = new Adjustment().defaultValues('Add Stock');
    this.existingSingleAdjustedData = new Adjustment().defaultValues();

    this.defaultProductDetail = new ProductDetail().defaultValues();
    this.productDetail = new ProductDetail().defaultValues();
    this.existingProductDetail = new ProductDetail().defaultValues();

    this.defaultRawMaterialData = new RawMaterialData().defaultValues();
    this.productAddonData = new ProductAddonData().defaultValues();

    if (
      !this.isProductUpdated &&
      this.productTxnEnableFieldsMap &&
      this.productTxnEnableFieldsMap.get('enable_in_store_by_default')
    ) {
      this.productDetail.isOffLine = true;
    }

    if (
      !this.isProductUpdated &&
      this.productTxnEnableFieldsMap &&
      this.productTxnEnableFieldsMap.get('enable_online_by_default')
    ) {
      this.productDetail.isOnLine = true;
    }
    this.API_SERVER = window.REACT_APP_API_SERVER;

    makeObservable(this, {
      productCategory: observable,
      searchProductResult: observable,
      productDetail: observable,
      businessProductList: observable,
      productDialogOpen: observable,
      isBatchUpdate: observable,
      isAdjustmentUpdate: observable,
      productAddBatchDialogOpen: observable,
      productAdjustmentDialogOpen: observable,
      exportToExcelDialogOpen: observable,
      ExcelDialogOpen: observable,
      selectedLevel2Category: observable,
      selectedLevel3Category: observable,
      selectedLevel3CategoryName: observable,
      level2CategoriesList: observable,
      level3CategoriesList: observable,
      getProductCategory: computed,
      setProductCategory: action,
      getBusinessProduct: computed,
      setBusinessProduct: action,
      handleAddProductModalOpen: action,
      handleAddBatchModalOpen: action,
      handleAddAdjustmentModalOpen: action,
      handleProductModalClose: action,
      handleBatchModalClose: action,
      handleAdjustmentModalClose: action,
      setProductProperty: action,
      setLevel2SelectedCategory: action,
      saveProduct: action,
      handleEditProductModal: action,
      isProductUpdated: observable,
      singleBatchData: observable,
      singleAdjustedData: observable,
      adjustedStockValue: observable,
      existingSingleAdjustedData: observable,
      handleRemoveProduct: action,
      handleProductSearch: action,
      getBusinessLevel2Categorieslist: action,
      getBusinessLevel3Categorieslist: action,
      handleExportToExcelModalClose: action,
      handleExportToExcelModalOpen: action,
      handleCategoryLevel3Change: action,
      setOfferPrice: action,
      setProductLevel2Category: action,
      openLoader: observable,
      mfgOpenDialog: observable,
      editMfgOpenDialog: observable,
      handleMfgModalOpen: action,
      handleMfgModalClose: action,
      isComingFromManufacture: observable,
      oldTxnData: observable,
      openProductLoadingAlertMessage: observable,
      openManufactureLoadingAlertMessage: observable,
      isManufactureListRefreshed: observable,
      batchNotAvailableError: observable,
      alterStockOpenDialog: observable,
      openAlterStockLoadingAlertMessage: observable,
      isAlterStockListRefreshed: observable,
      openMfgSequenceNumberFailureAlert: observable,
      isProductComingFromRawMaterials: observable,
      handleAddSerialModalOpen: action,
      handleSerialModalClose: action,
      openAddOnModal: action,
      handleAddOnsModalClose: action,
      addOnsDialogOpen: observable,
      isAddOnsEdit: observable,
      addOnsGroupList: observable,
      addOnsList: observable,
      choosenAddOnsList: observable,
      productAddonData: observable,
      addOnsEditIndex: observable,
      openAddOnListModal: action,
      addOnsListDialogOpen: observable,
      productAddSerialDialogOpen: observable,
      ProductChosenProperties: observable,
      isProperties: observable,
      productsNotProcessed: observable,
      serialModelOpen: observable,
      isSerialEdit: observable
    });
  }

  openAddOnModal = () => {
    runInAction(() => {
      this.addOnsDialogOpen = true;
      this.isAddOnsEdit = false;
    });
  };

  handleAddOnsModalClose = () => {
    this.addOnsDialogOpen = false;
    this.productAddonData = new ProductAddonData().defaultValues();
    this.choosenAddOnsList = [];
  };

  getAddOnsGroup = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.addOnsGroupList = [];

    const query = db.addonsgroup.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.addOnsGroupList = data.map((item) => item.toJSON());
      }
    });

    console.log('this.addOnsGroupList', this.addOnsGroupList);

    return this.addOnsGroupList;
  };

  getAddOns = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.addOnsList = [];

    const query = db.addons.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.addOnsList = data.map((item) => item.toJSON());
      }
    });

    console.log('this.addOnsList', this.addOnsList);

    return this.addOnsList;
  };
  openAddOnListModal = () => {
    runInAction(() => {
      this.addOnsListDialogOpen = true;
    });
  };
  handleAddOnsListModalClose = () => {
    runInAction(() => {
      this.addOnsListDialogOpen = false;
      // this.choosenAddOnsList=[];
    });
  };
  saveAddOnsListModalClose = () => {
    runInAction(() => {
      this.addOnsListDialogOpen = false;
    });
  };

  chooseAddOns = (value) => {
    let addondata = {};
    addondata.additional_property_id = value.additionalPropertyId;
    addondata.name = value.name;
    addondata.price = value.price;
    addondata.type = value.type;
    addondata.offline = value.offline;
    addondata.cgst = value.cgst;
    addondata.sgst = value.sgst;
    addondata.igst = value.igst;
    addondata.cess = value.cess;
    addondata.tax_included = value.taxIncluded;
    addondata.taxType = value.taxType;
    addondata.group_name = value.groupName;
    addondata.purchasedPrice = value.purchasedPrice;
    addondata.productId = value.productId;
    addondata.description = value.description;
    addondata.batchId = value.batchId;
    addondata.brandName = value.brandName;
    addondata.categoryLevel2 = value.categoryLevel2;
    addondata.categoryLevel2DisplayName = value.categoryLevel2DisplayName;
    addondata.categoryLevel3 = value.categoryLevel3;
    addondata.categoryLevel3DisplayName = value.categoryLevel3DisplayName;
    addondata.hsn = value.hsn;
    addondata.barcode = value.barcode;
    addondata.stockQty = value.stockQty;

    const index = this.choosenAddOnsList.findIndex(
      (item) => item.additional_property_id === addondata.additional_property_id
    );

    if (index !== -1) {
      this.choosenAddOnsList.splice(index, 1);
    } else {
      this.choosenAddOnsList.push(addondata);
    }

    // console.log("addOnValue",this.choosenAddOnsList);
  };

  updateState = (field, value) => {
    this.productAddonData[field] = value;
  };
  removeAddonList = (index) => {
    this.choosenAddOnsList.splice(index, 1);
  };

  saveAddon = (isResetAddOn) => {
    runInAction(() => {
      this.productAddonData = new ProductAddonData().convertTypes(
        this.productAddonData
      );
      let random = Math.floor(Math.random() * 100) + 1;
      this.productAddonData.groupId =
        Math.round(new Date().getTime() / 1000) + random;
      this.productAddonData.additional_property_list = this.choosenAddOnsList;

      this.productDetail.additional_property_group_list.push({
        ...this.productAddonData
      });
    });
    this.addOnsDialogOpen = false;
    if (isResetAddOn) {
      this.resetProductAddonData();
    }
  };

  resetProductAddonData = async () => {
    runInAction(() => {
      this.productAddonData = new ProductAddonData().defaultValues();
      this.choosenAddOnsList = [];
      this.addOnsEditIndex = '';
    });
  };

  viewOrEditAddon = (option, index) => {
    runInAction(() => {
      this.productAddonData = option;
      this.choosenAddOnsList = option.additional_property_list;
      this.addOnsDialogOpen = true;
      this.isAddOnsEdit = true;
      this.addOnsEditIndex = index;
    });
  };

  updateAddon = () => {
    runInAction(() => {
      this.productAddonData.additional_property_list = this.choosenAddOnsList;
      this.productDetail.additional_property_group_list[this.addOnsEditIndex] =
        this.productAddonData;
    });
    this.addOnsDialogOpen = false;
    this.resetProductAddonData();
  };

  updateOfflineAddOns = (index, offline) => {
    // console.log(offline)
    runInAction(() => {
      this.choosenAddOnsList[index].offline = !offline;
      // this.productDetail.additional_property_group_list[this.addOnsEditIndex] = this.productAddonData;
    });
  };

  removeAddonGroup = (index) => {
    this.productDetail.additional_property_group_list.splice(index, 1);
  };

  sectedProductForBarcode = async (product) => {
    runInAction(() => {
      this.productDetail = toJS(product);
    });
  };

  getBusinessLevel2Categorieslist = async () => {
    this.level2CategoriesList = await getLevel2Categorieslist();
  };

  handleCategoryLevel3Change = async (event) => {
    runInAction(() => {
      this.level3CategoriesList.map((data, i) => {
        if (data.name === event.name) {
          if (this.level3CategoriesList[i].isChecked) {
            this.level3CategoriesList[i].isChecked = false;
          } else {
            this.level3CategoriesList[i].isChecked = true;
          }
        }
      });
    });
  };

  handleCategoryLevel2Change = async (event) => {
    runInAction(() => {
      this.level2CategoriesList.map((data, i) => {
        if (data.name === event.name) {
          if (this.level2CategoriesList[i].isChecked) {
            this.level2CategoriesList[i].isChecked = false;
          } else {
            this.level2CategoriesList[i].isChecked = true;
          }
        }
      });
    });
  };

  resetLevel2AndLevel3Categories = async () => {
    runInAction(() => {
      this.level3CategoriesList = [];
      this.level2CategoriesList = [];
      this.getBusinessLevel2Categorieslist();
      this.selectedLevel2Category = {};
      this.selectedLevel3Category = {};
    });
  };

  setLevel3Category = async (category) => {
    runInAction(() => {
      this.selectedLevel3Category = category;
    });
  };

  getBusinessLevel3Categorieslist = async (level2Category) => {
    this.level3CategoriesList = await getLevel3Categorieslist(level2Category);
  };

  handleMfgModalOpen = () => {
    this.mfgOpenDialog = true;
  };

  handleMfgModalClose = () => {
    this.mfgOpenDialog = false;
  };

  handleEditMfgModalOpen = () => {
    this.editMfgOpenDialog = true;
  };

  handleEditMfgModalClose = () => {
    this.editMfgOpenDialog = false;
  };

  handleProductModalClose = () => {
    runInAction(() => {
      this.productDialogOpen = false;
    });
  };

  handleBatchModalClose = () => {
    runInAction(() => {
      this.productAddBatchDialogOpen = false;
    });
  };

  handleSerialModalClose = () => {
    runInAction(() => {
      this.productAddSerialDialogOpen = false;
    });
  };

  handleAdjustmentModalClose = () => {
    runInAction(() => {
      this.productAdjustmentDialogOpen = false;
    });
  };

  handleExportToExcelModalClose = () => {
    runInAction(() => {
      this.exportToExcelDialogOpen = false;
    });
  };

  handleExportToExcelModalOpen = () => {
    runInAction(() => {
      this.exportToExcelDialogOpen = true;
    });
  };

  addSerialIMEIList = (serialData) => {
    runInAction(() => {
      this.productDetail.serialData.push(serialData);
    });
  };

  removeSerialIMEIList = (index) => {
    runInAction(() => {
      this.productDetail.serialData.splice(index, 1);
    });
  };

  setSerialIMEIList = (type, index, value) => {
    runInAction(() => {
      this.productDetail.serialData[index][type] = value;
    });
  };

  saveSerialData = () => {
    this.handleSerialModalClose();
  };

  handleCloseBatchNotAvailableError = () => {
    runInAction(() => {
      this.batchNotAvailableError = false;
    });
  };

  handleAddProductModalOpen = async () => {
    runInAction(async () => {
      this.productDetail = this.defaultProductDetail;

      const productTxnSettings = await this.getProductTransSettingdetails();

      await this.setProductTxnEnableFieldsMap(productTxnSettings);

      if (localStorage.getItem('isHotelOrRestaurant')) {
        let isHotelOrRestaurant = localStorage.getItem('isHotelOrRestaurant');
        if (String(isHotelOrRestaurant).toLowerCase() === 'true') {
          this.productDetail['enableQuantity'] = false;
        }
      }

      this.isProductUpdated = false;
      this.isProductComingFromRawMaterials = false;
      this.productDialogOpen = true;
    });
  };

  handleAddProductModalOpenFromRawMaterials = async () => {
    runInAction(async () => {
      this.productDetail = this.defaultProductDetail;

      const productTxnSettings = await this.getProductTransSettingdetails();

      await this.setProductTxnEnableFieldsMap(productTxnSettings);

      if (localStorage.getItem('isHotelOrRestaurant')) {
        let isHotelOrRestaurant = localStorage.getItem('isHotelOrRestaurant');
        if (String(isHotelOrRestaurant).toLowerCase() === 'true') {
          this.productDetail['enableQuantity'] = false;
        }
      }

      let level2 = await getLevel2CategoryByName('raw_materials_level2');

      let level2Category = {
        count: level2.level2Category.count,
        displayName: level2.level2Category.displayName,
        name: level2.level2Category.name,
        imgurl: level2.level2Category.imgurl
      };

      this.productDetail['categoryLevel2'] = level2Category;
      this.productDetail['categoryLevel3'] = level2.level3Categories[0];

      this.selectedLevel2Category = level2Category;
      this.selectedLevel3Category = level2.level3Categories[0];

      this.isProductUpdated = false;
      this.isProductComingFromRawMaterials = true;
      this.productDialogOpen = true;
    });
  };

  handleAddBatchModalOpen = () => {
    this.resetSingleBatchData();
    runInAction(() => {
      this.productAddBatchDialogOpen = true;
      this.isBatchUpdate = false;
    });
  };

  handleAddSerialModalOpen = () => {
    runInAction(() => {
      if (
        this.productDetail.serialData === undefined ||
        (this.productDetail.serialData &&
          this.productDetail.serialData.length === 0)
      ) {
        let serialData = new SerialData().defaultValues();
        this.productDetail.serialData.push(serialData);
      }
      this.productAddSerialDialogOpen = true;
    });
  };

  handleAddAdjustmentModalOpen = () => {
    runInAction(() => {
      this.productAdjustmentDialogOpen = true;
    });
    this.resetSingleAdjustedData();
    this.calculateAdjustedStockValue();
  };

  updateBatchData = (isResetBatch) => {
    runInAction(async () => {
      this.singleBatchData = new BatchData().convertTypes(this.singleBatchData);
      var index = this.productDetail.batchData
        .map(function (x) {
          return x.id;
        })
        .indexOf(this.singleBatchData.id);

      let existingBatchOpeningStockQty = 0;
      let existingBatchData = this.existingProductDetail.batchData[index];

      if (existingBatchData) {
        existingBatchOpeningStockQty =
          parseFloat(existingBatchData.openingStockQty) || 0;
      }

      this.singleBatchData.qty =
        parseFloat(this.singleBatchData.openingStockQty) || 0;

      if (this.isManufacturing) {
        if (this.singleBatchData.manufacturingQty > 0) {
          this.singleBatchData.qty =
            parseFloat(this.singleBatchData.manufacturingQty) || 0;
        }
        if (this.singleBatchData.freeManufacturingQty > 0) {
          this.singleBatchData.freeQty =
            parseFloat(this.singleBatchData.freeManufacturingQty) || 0;
        }
      }

      if (
        this.productTxnSettingsData.autoGenerateBarcode &&
        this.productTxnSettingsData.autoGenerateUniqueBarcodeForBatches &&
        (this.singleBatchData.barcode === '' ||
          this.singleBatchData.barcode === undefined ||
          this.singleBatchData.barcode === null)
      ) {
        this.singleBatchData.barcode = Date.now();
      }

      if (
        this.productTxnSettingsData.autoGenerateBarcode &&
        this.productTxnSettingsData.autoGenerateUniqueBarcodeForBatches
      ) {
        if (
          String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
        ) {
          this.singleBatchData.barcode =
            await uniqueCodeGenerator.generateUniqueCode();
        } else {
          this.singleBatchData.barcode = Date.now();
        }
      }

      this.productDetail.batchData[index] = this.singleBatchData;

      if (isResetBatch) {
        this.resetSingleBatchData();
      }
      this.productAddBatchDialogOpen = false;
      this.isBatchUpdate = false;
    });
  };

  addBatchData = (isResetBatch, properties = [], batchNumber, batchId) => {
    runInAction(async () => {
      this.singleBatchData = new BatchData().convertTypes(this.singleBatchData);
      let random = Math.floor(Math.random() * 100) + 1;
      this.singleBatchData.id =
        Math.round(new Date().getTime() / 1000) + random;
      this.singleBatchData.qty =
        parseFloat(this.singleBatchData.openingStockQty) || 0;

      if (this.isManufacturing) {
        if (this.singleBatchData.manufacturingQty > 0) {
          this.singleBatchData.qty =
            parseFloat(this.singleBatchData.manufacturingQty) || 0;
        }
        if (this.singleBatchData.freeManufacturingQty > 0) {
          this.singleBatchData.freeQty =
            parseFloat(this.singleBatchData.freeManufacturingQty) || 0;
        }
      }
      if (
        this.productTxnSettingsData.autoGenerateBarcode &&
        this.productTxnSettingsData.autoGenerateUniqueBarcodeForBatches
      ) {
        this.singleBatchData.barcode = Date.now();
      }

      if (
        this.productTxnSettingsData.autoGenerateBarcode &&
        this.productTxnSettingsData.autoGenerateUniqueBarcodeForBatches
      ) {
        if (
          String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
        ) {
          this.singleBatchData.barcode =
            await uniqueCodeGenerator.generateUniqueCode();
        } else {
          this.singleBatchData.barcode = Date.now();
        }
      }

      this.singleBatchData.properties = [];
      properties.forEach((element) => {
        this.singleBatchData.properties.push(element);
      });

      if (batchNumber) {
        this.singleBatchData.batchNumber = batchNumber;
      }

      if (batchId) {
        this.singleBatchData.id = batchId;
      }

      this.productDetail.batchData.push({ ...this.singleBatchData });
    });
    this.productAddBatchDialogOpen = false;
    if (isResetBatch) {
      this.resetSingleBatchData();
    }
  };

  addAdjustedData = async () => {
    this.singleAdjustedData.id = Math.round(new Date().getTime() / 1000);
    this.singleAdjustedData.purchasedPrice = parseFloat(
      this.singleAdjustedData.purchasedPrice
    );

    if (this.singleAdjustedData['adjustedType'] === 'Add Stock') {
      this.productDetail.stockQty =
        parseFloat(this.singleAdjustedData['oldQty']) +
        parseFloat(this.singleAdjustedData['qty']);
    } else {
      this.productDetail.stockQty =
        parseFloat(this.singleAdjustedData['oldQty']) -
        parseFloat(this.singleAdjustedData['qty']);
    }

    this.singleAdjustedData.qty = parseFloat(this.singleAdjustedData.qty);

    var batchIndex = -2;

    if (this.singleAdjustedData.batchNumber) {
      batchIndex = this.productDetail.batchData.findIndex(
        (x) => x.batchNumber === this.singleAdjustedData.batchNumber
      );
    }

    if (batchIndex === -1) {
      alert('Enter Valid Batch Number');
    } else {
      if (batchIndex >= 0) {
        let batchItem = this.productDetail.batchData[batchIndex];

        if (this.singleAdjustedData['adjustedType'] === 'Add Stock') {
          batchItem.qty =
            parseFloat(batchItem.qty) + parseFloat(this.singleAdjustedData.qty);
        } else {
          batchItem.qty =
            parseFloat(batchItem.qty) - parseFloat(this.singleAdjustedData.qty);
        }

        this.productDetail.batchData[batchIndex] = batchItem;
      } else {
        if (this.singleAdjustedData['adjustedType'] === 'Add Stock') {
          this.productDetail.stockQty =
            parseFloat(this.productDetail.stockQty) +
            parseFloat(this.singleAdjustedData['qty']);
        } else {
          this.productDetail.stockQty =
            parseFloat(this.productDetail.stockQty) -
            parseFloat(this.singleAdjustedData['qty']);
        }
      }
      delete this.singleAdjustedData['stockValue'];

      this.productDetail.adjustedData.push(this.singleAdjustedData);

      this.calculateAdjustedStockValue();

      this.resetSingleAdjustedData();
    }
  };

  addSingleBatchData = (isResetBatch) => {
    runInAction(() => {
      this.singleBatchData = new BatchData().convertTypes(this.singleBatchData);
      let random = Math.floor(Math.random() * 100) + 1;
      this.singleBatchData.id =
        Math.round(new Date().getTime() / 1000) + random;
      this.singleBatchData.qty =
        parseFloat(this.singleBatchData.openingStockQty) || 0;

      if (this.isManufacturing) {
        if (this.singleBatchData.manufacturingQty > 0) {
          this.singleBatchData.qty =
            parseFloat(this.singleBatchData.manufacturingQty) || 0;
        }
        if (this.singleBatchData.freeManufacturingQty > 0) {
          this.singleBatchData.freeQty =
            parseFloat(this.singleBatchData.freeManufacturingQty) || 0;
        }
      }

      if (
        this.productTxnSettingsData.autoGenerateBarcode &&
        this.productTxnSettingsData.autoGenerateUniqueBarcodeForBatches
      ) {
        this.singleBatchData.barcode = Date.now();
      }

      if (
        String(localStorage.getItem('isJewellery')).toLowerCase() === 'true' &&
        this.productTxnSettingsData.autoGenerateBarcode &&
        this.productTxnSettingsData.autoGenerateUniqueBarcodeForBatches
      ) {
        this.singleBatchData.barcode = uniqueCodeGenerator.generateUniqueCode();
      } else {
        if (this.productTxnSettingsData.autoGenerateUniqueBarcodeForBatches) {
          this.singleBatchData.barcode = Date.now();
        }
      }

      this.singleBatchData.properties = [];

      this.productDetail.batchData.push({ ...this.singleBatchData });
    });
    this.productAddBatchDialogOpen = false;

    if (isResetBatch) {
      this.resetSingleBatchData();
    }
  };

  updateAdjustedData = () => {
    if (this.singleAdjustedData.id === 0) {
      this.singleAdjustedData.id = Math.round(new Date().getTime() / 1000);
    }

    this.singleAdjustedData.purchasedPrice = parseFloat(
      this.singleAdjustedData.purchasedPrice
    );

    /**
     * revert stock qty value
     */
    if (this.existingSingleAdjustedData['adjustedType'] === 'Add Stock') {
      this.productDetail.stockQty =
        parseFloat(this.productDetail.stockQty) -
        parseFloat(this.existingSingleAdjustedData['qty']);
    } else {
      this.productDetail.stockQty =
        parseFloat(this.productDetail.stockQty) +
        parseFloat(this.existingSingleAdjustedData['qty']);
    }

    this.singleAdjustedData['oldQty'] = this.productDetail.stockQty;

    /**
     * revert batch qty if it has any
     * else revert defualt batch qty
     */
    if (this.existingSingleAdjustedData.batchNumber) {
      var index = 0;

      index = this.productDetail.batchData.findIndex(
        (x) => x.batchNumber === this.existingSingleAdjustedData.batchNumber
      );

      let oldBatchItem = this.productDetail.batchData[index];

      if (this.existingSingleAdjustedData['adjustedType'] === 'Add Stock') {
        oldBatchItem.qty =
          parseFloat(oldBatchItem.qty) -
          parseFloat(this.existingSingleAdjustedData.qty);
      } else {
        oldBatchItem.qty =
          parseFloat(oldBatchItem.qty) +
          parseFloat(this.existingSingleAdjustedData.qty);
      }

      this.productDetail.batchData[index] = oldBatchItem;
    } else {
      if (this.existingSingleAdjustedData['adjustedType'] === 'Add Stock') {
        this.productDetail.stockQty =
          parseFloat(this.productDetail.stockQty) -
          parseFloat(this.existingSingleAdjustedData.qty);
      } else {
        this.productDetail.stockQty =
          parseFloat(this.productDetail.stockQty) +
          parseFloat(this.existingSingleAdjustedData.qty);
      }
    }

    /**
     * increment/decrement new total quantity value
     */
    if (this.singleAdjustedData['adjustedType'] === 'Add Stock') {
      this.productDetail.stockQty =
        parseFloat(this.singleAdjustedData['oldQty']) +
        parseFloat(this.singleAdjustedData['qty']);
    } else {
      this.productDetail.stockQty =
        parseFloat(this.singleAdjustedData['oldQty']) -
        parseFloat(this.singleAdjustedData['qty']);
    }

    this.singleAdjustedData.qty = parseFloat(this.singleAdjustedData.qty);

    /**
     * increment/decrement new batch qty if it is a batch
     *
     * else increment/decrement deafult batch qty
     */
    var batchIndex = 0;

    if (this.singleAdjustedData.batchNumber) {
      batchIndex = this.productDetail.batchData.findIndex(
        (x) => x.batchNumber === this.singleAdjustedData.batchNumber
      );
    }

    if (batchIndex === -1) {
      alert('Enter Valid Batch Number');
    } else {
      if (batchIndex >= 0) {
        let batchItem = this.productDetail.batchData[batchIndex];

        if (this.singleAdjustedData['adjustedType'] === 'Add Stock') {
          batchItem.qty =
            parseFloat(batchItem.qty) + parseFloat(this.singleAdjustedData.qty);
        } else {
          batchItem.qty =
            parseFloat(batchItem.qty) - parseFloat(this.singleAdjustedData.qty);
        }

        if (batchItem.qty < 0) {
          batchItem.qty = 0;
        }
        this.productDetail.batchData[batchIndex] = batchItem;
      } else {
        if (this.singleAdjustedData['adjustedType'] === 'Add Stock') {
          this.productDetail.stockQty =
            parseFloat(this.productDetail.stockQty) +
            parseFloat(this.singleAdjustedData['qty']);
        } else {
          this.productDetail.stockQty =
            parseFloat(this.productDetail.stockQty) -
            parseFloat(this.singleAdjustedData['qty']);
        }
      }

      delete this.singleAdjustedData['stockValue'];
      delete this.singleAdjustedData['vendorName'];

      var foundIndex = this.productDetail.adjustedData.findIndex(
        (x) => x.id === this.existingSingleAdjustedData.id
      );

      this.productDetail.adjustedData[foundIndex] = this.singleAdjustedData;

      this.calculateAdjustedStockValue();

      this.resetSingleAdjustedData();
    }
  };

  setBatchProperty = (property, value) => {
    runInAction(() => {
      this.singleBatchData[property] = value;
    });
  };

  setDefaultBatchProperty = (property, value) => {
    runInAction(() => {
      if (property === 'qty') {
        this.productDetail[property] = parseFloat(value);
      } else {
        this.productDetail[property] = value;
      }
    });
  };

  setInitialAdjustedProperty = (property, value) => {
    var initialAdjusted = this.singleAdjustedData;

    if (property === 'qty') {
      initialAdjusted[property] = parseFloat(value);
      initialAdjusted['oldQty'] = parseFloat(this.productDetail.stockQty);
      initialAdjusted['newQty'] =
        parseFloat(this.productDetail.stockQty) + parseFloat(value);
    } else if (property === 'adjustedType') {
      initialAdjusted[property] = value;
    } else {
      initialAdjusted[property] = value;
    }

    this.singleAdjustedData = initialAdjusted;
  };

  calculateAdjustedStockValue() {
    this.adjustedStockValue = 0;

    if (this.productDetail.adjustedData.length > 0) {
      let batchData = [];

      let addedAdjBatchMap = new Map();
      let removeAdjBatchMap = new Map();

      const tempAdjData = this.productDetail.adjustedData;

      for (let adjusted of tempAdjData) {
        if (adjusted.batchNumber.length > 0) {
          if (adjusted.adjustedType === 'Add Stock') {
            addedAdjBatchMap.set(adjusted.batchNumber, adjusted.qty);

            this.adjustedStockValue =
              parseFloat(this.adjustedStockValue) +
              parseFloat(adjusted.qty * adjusted.purchasedPrice);
          } else {
            removeAdjBatchMap.set(adjusted.batchNumber, adjusted.qty);
          }
        }
      }

      if (addedAdjBatchMap.size > 0 || removeAdjBatchMap.size > 0) {
        const tempBatchData = this.productDetail.batchData;

        for (let batch of tempBatchData) {
          if (addedAdjBatchMap.has(batch.batchNumber)) {
            batch.qty =
              parseFloat(batch.qty) -
              parseFloat(addedAdjBatchMap.get(batch.batchNumber));
          }

          batchData.push(batch);
        }

        if (batchData.length > 0) {
          for (let batch of batchData) {
            this.adjustedStockValue =
              parseFloat(this.adjustedStockValue) +
              parseFloat(batch.qty * batch.purchasedPrice);
          }
        }
      } else {
        this.adjustedStockValue =
          parseFloat(this.productDetail.stockQty) *
          parseFloat(this.productDetail.purchasedPrice);
      }
    }
  }

  setProductCategory = (categories) => {
    // console.log('productCategory,', categories);
    runInAction(() => {
      this.productCategory = categories;
    });
  };

  setProductLevel2Category = (level2) => {
    if (level2) {
      runInAction(() => {
        this.productDetail['categoryLevel2'] = level2;
        this.selectedLevel2Category = level2;
      });
    }
  };

  setProductLevel3Category = (level3) => {
    if (level3) {
      runInAction(() => {
        this.productDetail['categoryLevel3'] = level3;
        this.selectedLevel3Category = level3;
      });
    }
  };

  setSelectedLevel3Category = (category) => {
    if (category) {
      runInAction(() => {
        this.selectedLevel3CategoryName = category.displayName;
      });
    }
  };

  resetSelectedLevel3Category = () => {
    runInAction(() => {
      this.selectedLevel3CategoryName = '';
    });
  };

  setLevel2SelectedCategory = (category) => {
    this.level2CategoriesList.map((data, i) => {
      if (data.name === category.name) {
        runInAction(() => {
          this.level2CategoriesList[i].isChecked = true;
        });
      }
    });
  };

  get getProductCategory() {
    return this.productCategory;
  }

  setBusinessProduct = (products) => {
    runInAction(() => {
      this.businessProductList = products;
    });
  };

  get getBusinessProduct() {
    return this.businessProductList;
  }

  setProductProperty = (property, value) => {
    runInAction(() => {
      if (property === 'taxIncluded') {
        let tax = value === 'true' ? true : false;
        this.productDetail[property] = !tax;
      } else if (property === 'purchaseTaxIncluded') {
        let tax = value === 'true' ? true : false;
        this.productDetail[property] = !tax;
      } else {
        this.productDetail[property] = value;
      }
    });
  };

  clearExistingProductStock = async () => {
    this.existingProductDetail.openingStockQty = 0;
    this.existingProductDetail.freeQty = 0;
    this.existingProductDetail.stockQty = 0;
  };

  setProductPrimaryUnit = async (value) => {
    if (value != null) {
      let unitCodeResult = await unitHelper
        .getUnits()
        .find((e) => e.fullName === value);

      this.productDetail.primaryUnit = {
        fullName: value,
        shortName: unitCodeResult ? unitCodeResult.shortName : ''
      };
    } else {
      this.productDetail.primaryUnit = value;
    }
  };

  setProductSecondaryUnit = async (value) => {
    let sU = value
      ? {
          fullName: value,
          shortName:
            unitHelper.getUnits().find((e) => e.fullName === value)
              ?.shortName || ''
        }
      : value;

    runInAction(() => {
      this.productDetail.secondaryUnit = sU;
    });
  };

  setOfferPrice = (value) => {
    runInAction(() => {
      this.productDetail.offerPrice = parseFloat(value) || 0;
    });
  };

  setProductOnlineOffLine = (key, value) => {
    runInAction(() => {
      if (key === 'online') {
        this.productDetail['isOnLine'] = value;
      } else if (key === 'pos') {
        this.productDetail['isOffLine'] = value;
      }
    });
  };

  setOpenLoader = (value) => {
    runInAction(() => {
      this.openLoader = value;
    });
  };

  formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  saveProduct = async (saveAndNew) => {
    runInAction(async () => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();
      const appId = businessData.posDeviceId;

      this.productDetail.posId = businessData.posDeviceId;

      this.productDetail.units = [];

      if (
        this.productDetail.primaryUnit &&
        this.productDetail.primaryUnit !== undefined &&
        this.productDetail.primaryUnit.fullName !== ''
      ) {
        this.productDetail.units.push(this.productDetail.primaryUnit.fullName);
      }

      if (
        this.productDetail.secondaryUnit &&
        this.productDetail.secondaryUnit !== undefined &&
        this.productDetail.secondaryUnit.fullName !== ''
      ) {
        this.productDetail.units.push(
          this.productDetail.secondaryUnit.fullName
        );
      }

      if (this.productDetail['productType'] === 'Service') {
        this.productDetail['enableQuantity'] = false;
      }

      if (this.productDetail.rawMaterialData === undefined) {
        this.productDetail.rawMaterialData = this.defaultRawMaterialData;
      }

      /**
       * remove un wanted fields and format free qty in batch data  -- start
       */
      // Iterate over each batch in productDetail
      this.productDetail.batchData.forEach((batch) => {
        // Remove mfDate property if it's falsy
        if (!batch.mfDate) delete batch.mfDate;

        // Remove expiryDate property if it's falsy
        if (!batch.expiryDate) delete batch.expiryDate;

        // Convert freeQty to a float, or set it to 0 if it's falsy
        batch.freeQty = parseFloat(batch.freeQty) || 0;

        // Convert finalMRPPrice to a float, or set it to 0 if it's falsy
        batch.finalMRPPrice = parseFloat(batch.finalMRPPrice) || 0;
      });
      /**
       * remove un wanted fields in batch data  -- end
       */

      if (!this.isProductUpdated) {
        const timestamp = Date.now();
        const id = _uniqueId('p');

        this.productDetail.stockQty = this.productDetail.openingStockQty;

        //add batch stock qty, free qty, manufacture qty to total stock
        let batchCount = 0;
        let batchFreeCount = 0;
        let batchOpeningCount = 0;

        for (let singleBatch of this.productDetail.batchData) {
          batchCount += parseFloat(singleBatch.qty) || 0;
          batchFreeCount += parseFloat(singleBatch.freeQty) || 0;
          batchOpeningCount += parseFloat(singleBatch.openingStockQty) || 0;
        }

        if (
          this.productDetail.batchData &&
          this.productDetail.batchData.length > 0
        ) {
          runInAction(() => {
            this.productDetail.stockQty = parseFloat(batchCount) || 0;
            this.productDetail.freeQty = parseFloat(batchFreeCount) || 0;
            this.productDetail.openingStockQty =
              parseFloat(batchOpeningCount) || 0;
          });
        }

        this.productDetail['productId'] = `${id}${appId}${timestamp}`;

        this.productDetail['businessId'] = businessData.businessId;
        this.productDetail['businessCity'] = businessData.businessCity;
        this.productDetail['updatedAt'] = Date.now();

        if (
          this.productDetail['stockQty'] <=
          this.productDetail['stockReOrderQty']
        ) {
          this.productDetail['isStockReOrderQtyReached'] = true;
        } else {
          this.productDetail['isStockReOrderQtyReached'] = false;
        }

        if (this.productTxnSettingsData.autoGenerateBarcode) {
          if (
            this.productDetail.batchData &&
            this.productDetail.batchData.length > 0 &&
            this.productTxnSettingsData.autoGenerateUniqueBarcodeForBatches
          ) {
            this.productDetail.barcode = '';
          } else {
            if (
              String(localStorage.getItem('isJewellery')).toLowerCase() ===
              'true'
            ) {
              this.productDetail.barcode =
                await uniqueCodeGenerator.generateUniqueCode();
            } else {
              this.productDetail.barcode = Date.now();
            }
          }
        }

        /**
         * get and increment business categories table to increment count level3 categories
         */
        this.productDetail.posId = parseFloat(businessData.posDeviceId);

        let InsertDoc = { ...this.productDetail };
        InsertDoc = new ProductDetail().convertTypes(InsertDoc);

        let userAction = '';

        if (this.isProductUpdated) {
          userAction = 'Update';
        } else {
          userAction = 'Save';
        }

        let today = new Date().getDate();
        let thisYear = new Date().getFullYear();
        let thisMonth = new Date().getMonth();

        //save to audit
        audit.addAuditEvent(
          InsertDoc.productId,
          '',
          'Product',
          userAction,
          JSON.stringify(InsertDoc),
          '',
          this.formatDate(new Date(thisYear, thisMonth, today))
        );

        InsertDoc.calculateStockAndBalance = true;

        await db.businessproduct
          .insert(InsertDoc)
          .then((data) => {
            console.log('Product data Inserted' + data);

            this.addOpeningStockTransaction(data);
            this.productDetail = this.defaultProductDetail;
            if (saveAndNew) {
              // do nothing
            } else {
              this.productDialogOpen = false;
            }
          })
          .catch((error) => {
            console.log('Product Insertion Failed - ', error);
          });
      } else {
        //productupdate
        //update total stock based on openingStock qty change or batched product and non batched product

        let existingOpeningStockQty = 0;
        let existingFreeQty = 0;

        if (this.existingProductDetail.batchData.length > 0) {
          for (let singleBatch of this.existingProductDetail.batchData) {
            existingOpeningStockQty += parseFloat(singleBatch.qty) || 0;
            existingFreeQty += parseFloat(singleBatch.freeQty) || 0;
          }
        } else {
          existingOpeningStockQty =
            parseFloat(this.existingProductDetail.openingStockQty) || 0;
          existingFreeQty = parseFloat(this.existingProductDetail.freeQty) || 0;
        }

        // let newOpeningStockQty = parseFloat(
        //   this.productDetail.openingStockQty || 0
        // );

        let newFreeQty = parseFloat(this.productDetail.freeQty || 0);

        let batchCount = this.productDetail.batchData.reduce(
          (sum, batch) => sum + parseFloat(batch.qty),
          0
        );
        let batchFreeCount = this.productDetail.batchData.reduce(
          (sum, batch) => sum + parseFloat(batch.freeQty || 0),
          0
        );
        let batchOpeningCount = this.productDetail.batchData.reduce(
          (sum, batch) => sum + parseFloat(batch.openingStockQty),
          0
        );

        if (batchCount > 0) {
          //newOpeningStockQty = batchCount;
          newFreeQty = batchFreeCount;

          this.productDetail.freeQty =
            parseFloat(this.productDetail.freeQty) +
            (parseFloat(newFreeQty) || 0) -
            (parseFloat(existingFreeQty) || 0);

          this.productDetail.openingStockQty = batchOpeningCount;
        } else {
          //since in batch we can't edit free qty directly
          //but in case of non batched products we can edit
          //so this logic is different
          this.productDetail.freeQty =
            (parseFloat(existingFreeQty) || 0) +
            (parseFloat(newFreeQty) || 0) -
            (parseFloat(existingFreeQty) || 0);
        }

        /**
         * for stockQty they can't edit in both cases so below logic works
         * handling this logoc in server
         */

        // this.productDetail.stockQty =
        //   parseFloat(this.productDetail.stockQty) +
        //   (parseFloat(newOpeningStockQty) || 0) -
        //   (parseFloat(existingOpeningStockQty) || 0);

        if (parseFloat(this.productDetail.freeQty) < 0) {
          this.productDetail.freeQty = 0;
        }

        if (
          this.productDetail['stockQty'] <=
          this.productDetail['stockReOrderQty']
        ) {
          this.productDetail['isStockReOrderQtyReached'] = true;
        } else {
          this.productDetail['isStockReOrderQtyReached'] = false;
        }

        if (this.productTxnSettingsData.autoGenerateBarcode) {
          if (
            this.productDetail.batchData &&
            this.productDetail.batchData.length > 0 &&
            this.productTxnSettingsData.autoGenerateUniqueBarcodeForBatches
          ) {
            this.productDetail.barcode = '';
          } else {
            if (
              this.productDetail.barcode === '' ||
              this.productDetail.barcode === null ||
              this.productDetail.barcode === undefined
            ) {
              if (
                String(localStorage.getItem('isJewellery')).toLowerCase() ===
                'true'
              ) {
                this.productDetail.barcode =
                  await uniqueCodeGenerator.generateUniqueCode();
              } else {
                this.productDetail.barcode = Date.now();
              }
            }
          }
        }

        this.productDetail.updatedAt = Date.now();

        let InsertDoc = { ...this.productDetail };
        InsertDoc = new ProductDetail().convertTypes(InsertDoc);

        let userAction = '';

        if (this.isProductUpdated) {
          userAction = 'Update';
        } else {
          userAction = 'Save';
        }

        let today = new Date().getDate();
        let thisYear = new Date().getFullYear();
        let thisMonth = new Date().getMonth();

        //save to audit
        audit.addAuditEvent(
          InsertDoc.productId,
          '',
          'Product',
          userAction,
          JSON.stringify(InsertDoc),
          '',
          this.formatDate(new Date(thisYear, thisMonth, today))
        );

        InsertDoc.calculateStockAndBalance = true;

        await db.businessproduct
          .atomicUpsert(InsertDoc)
          .then((data) => {
            this.addOpeningStockTransaction(data);

            this.productDetail = this.defaultProductDetail;
            if (saveAndNew) {
              // do nothing
            } else {
              this.productDialogOpen = false;
            }
          })
          .catch((error) => {
            console.log('update product Failed ' + error);
            //save to audit
            audit.addAuditEvent(
              InsertDoc.productId,
              '',
              'Product',
              userAction,
              JSON.stringify(InsertDoc),
              error.message,
              this.formatDate(new Date(thisYear, thisMonth, today))
            );
          });
      }

      this.setOpenLoader(false);
      this.isLoading = false;
    });
  };

  updateProduct = async (productDetail) => {
    const db = await Db.get();
    productDetail.updatedAt = Date.now();

    let InsertDoc = { ...productDetail };
    InsertDoc = new ProductDetail().convertTypes(InsertDoc);

    let userAction = 'Update';

    let today = new Date().getDate();
    let thisYear = new Date().getFullYear();
    let thisMonth = new Date().getMonth();

    //save to audit
    audit.addAuditEvent(
      InsertDoc.productId,
      '',
      'Product',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      this.formatDate(new Date(thisYear, thisMonth, today))
    );

    InsertDoc.calculateStockAndBalance = true;

    await db.businessproduct
      .atomicUpsert(InsertDoc)
      .then((data) => {
        runInAction(() => {
          this.isManufactureListRefreshed = true;
        });
      })
      .catch((error) => {
        console.log('update product Failed ' + error);
        //save to audit
        audit.addAuditEvent(
          InsertDoc.productId,
          '',
          'Product',
          userAction,
          JSON.stringify(InsertDoc),
          error.message,
          this.formatDate(new Date(thisYear, thisMonth, today))
        );
      });
  };

  checkForValidDate(date) {
    let result = false;
    if (date) {
      result = new Date(date) !== 'Invalid Date' && !isNaN(new Date(date));
    }

    return result;
  }

  viewOrEditBatchItem = async (item) => {
    // console.log('edititem',item);
    runInAction(() => {
      this.singleBatchData = item;
      this.isBatchUpdate = true;
      this.productAddBatchDialogOpen = true;
    });
  };

  copyBatchItem = async (item) => {
    runInAction(() => {
      this.singleBatchData = item;
      this.singleBatchData.batchNumber = '';
      this.singleBatchData.id = Math.round(new Date().getTime() / 1000);
      this.isBatchUpdate = false;
    });
  };

  deleteBatchItem = async (item) => {
    runInAction(() => {
      this.productDetail.batchData.splice(
        this.productDetail.batchData.findIndex((a) => a.id === item.id),
        1
      );
    });
  };

  viewOrEditAdjustmentItem = async (item) => {
    runInAction(() => {
      this.singleAdjustedData = item;
      this.existingSingleAdjustedData = item;
      this.isAdjustmentUpdate = true;
    });
  };

  deleteAdjustmentItem = async (item) => {
    this.productDetail.adjustedData.splice(
      this.productDetail.adjustedData.findIndex((a) => a.id === item.id),
      1
    );

    runInAction(() => {
      if (item['adjustedType'] === 'Add Stock') {
        this.productDetail.stockQty =
          parseFloat(this.productDetail.stockQty) - parseFloat(item['qty']);
      } else {
        this.productDetail.stockQty =
          parseFloat(this.productDetail.stockQty) + parseFloat(item['qty']);
      }
    });

    /**
     * revert batch qty if it has any
     * else revert defualt batch qty
     */
    if (item.batchNumber) {
      var index = 0;

      index = this.productDetail.batchData.findIndex(
        (x) => x.batchNumber === item.batchNumber
      );

      let oldBatchItem = this.productDetail.batchData[index];

      if (item['adjustedType'] === 'Add Stock') {
        oldBatchItem.qty = parseFloat(oldBatchItem.qty) - parseFloat(item.qty);
      } else {
        oldBatchItem.qty = parseFloat(oldBatchItem.qty) + parseFloat(item.qty);
      }

      this.productDetail.batchData[index] = oldBatchItem;
    } else {
      if (item['adjustedType'] === 'Add Stock') {
        this.productDetail.stockQty =
          parseFloat(this.productDetail.stockQty) - parseFloat(item.qty);
      } else {
        this.productDetail.stockQty =
          parseFloat(this.productDetail.stockQty) + parseFloat(item.qty);
      }
    }
  };

  saveExcelProductRowData = async (row, level2) => {
    const productTxnSettings = await this.getProductTransSettingdetails();
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const timestamp = Date.now();
    const id = _uniqueId('p');
    let product = new ProductDetail().defaultValues();

    product['productId'] = `${id}${appId}${timestamp}`;
    product['categoryLevel2'] = level2;
    product.calculateStockAndBalance = true;

    product['businessId'] = businessData.businessId;
    product['businessCity'] = businessData.businessCity;

    product['imageUrl'] =
      'https://firebasestorage.googleapis.com/v0/b/oneshell-d3a18.appspot.com/o/general_images%2Fno_product_image.jpeg?alt=media&token=6a37ec8e-c327-4069-bdba-48f8e60bd68a';

    product['pdfImageUrl'] = '';
    product.updatedAt = Date.now();

    let rMData = {
      rawMaterialList: [], 
      total: 0,
      subTotal: 0,
      directExpenses: []
    };

    product.rawMaterialData = rMData;

    let pU = {
      fullName: '',
      shortName: ''
    };
    product.primaryUnit = pU;

    let sU = {
      fullName: '',
      shortName: ''
    };
    product.secondaryUnit = sU;

    const level3Cell = row.getCell(3);
    const level3DisplayName = level3Cell ? level3Cell.value : null;
    const level3 = await this.getLevel3Category(level2, level3DisplayName);
    if (level3) {
      product['categoryLevel3'] = level3;
    } else {
      this.productsNotProcessed.push({
        name: row.getCell(1).value,
        reason:
          'Sub Category provided is not supported. Please revalidate id the category exists!!'
      });
      return;
    }

    // Iterate over each cell in the row
    row.eachCell((cell, colNumber) => { 
      if (colNumber === 3) {
        // skip picking category
      } else if (colNumber === 9) {
        const disc = parseFloat(cell.value || 0);
        if (disc > 0) {
          product.purchaseDiscountPercent = disc;
          product.purchaseDiscountType = 'percentage';

          if (
            product.purchaseDiscountPercent &&
            product.purchaseDiscountPercent > 0
          ) {
            product.purchaseDiscountAmount = parseFloat(
              (product.purchasedPrice * product.purchaseDiscountPercent) /
                100 || 0
            ).toFixed(2);
          } else {
            product.purchaseDiscountAmount = 0;
          }
        }
      } else if (colNumber === 11) {
        let tax = parseFloat(cell.value || 0);
        if (tax !== 0) {
          product.purchaseIgst = tax;
          product.purchaseCgst = tax / 2;
          product.purchaseSgst = tax / 2;
        }
      } else if (colNumber === 14) {
        const disc = parseFloat(cell.value || 0);
        product.saleDiscountPercent = disc;
        product.saleDiscountType = 'percentage';

        if (product.saleDiscountPercent && product.saleDiscountPercent > 0) {
          product.saleDiscountAmount = parseFloat(
            (product.salePrice * product.saleDiscountPercent) / 100 || 0
          ).toFixed(2);
        } else {
          product.saleDiscountAmount = 0;
        }
      } else if (colNumber === 16) {
        let tax = parseFloat(cell.value || 0);
        if (tax !== 0) {
          product.igst = tax;
          product.cgst = tax / 2;
          product.sgst = tax / 2;
        }
      } else if (colNumber === 22) {
        if (cell.value !== 'SELECT') {
          let unitCodeResult = unitHelper
            .getUnits()
            .find((e) => e.fullName === cell.value);

          if (unitCodeResult) {
            product.primaryUnit.fullName = cell.value;
            product.primaryUnit.shortName = unitCodeResult.shortName;
          }
        }
      } else if (colNumber === 23) {
        if (cell.value !== 'SELECT' && product.primaryUnit.fullName !== '') {
          let unitCodeResult = unitHelper
            .getUnits()
            .find((e) => e.fullName === cell.value);

          if (unitCodeResult) {
            product.secondaryUnit.fullName = cell.value;
            product.secondaryUnit.shortName = unitCodeResult.shortName;
          }
        }
      } else if (colNumber === 24) {
        if (
          product.primaryUnit.fullName !== '' &&
          product.secondaryUnit.fullName !== ''
        ) {
          product['unitConversionQty'] = cell.value
            ? parseFloat(cell.value)
            : 0;
        } else {
          product['unitConversionQty'] = 0;
        }
      } else {
        switch (excelMapping.list[colNumber]) {
          case 'taxIncluded':
            if (cell.value === 'Y') {
              product.taxIncluded = true;
            } else {
              product.taxIncluded = false;
            }
            break;
          case 'purchaseTaxIncluded':
            if (cell.value === 'Y') {
              product.purchaseTaxIncluded = true;
            } else {
              product.purchaseTaxIncluded = false;
            }
            break;
          case 'isOffLine':
            if (cell.value === 'Y') {
              product.isOffLine = true;
            } else {
              product.isOffLine = false;
            }
            break;
          case 'isOnLine':
            if (cell.value === 'Y') {
              product.isOnLine = true;
            } else {
              product.isOnLine = false;
            }
            break;
          default:
            return (product[excelMapping.list[colNumber]] = cell.value);
        }
      }
    });

    product['finalMRPPrice'] = parseFloat(product['finalMRPPrice'] || 0);
    product['purchasedPrice'] = parseFloat(product['purchasedPrice'] || 0);
    product['salePrice'] = parseFloat(product['salePrice'] || 0);

    product['stockQty'] = parseFloat(product['openingStockQty'] || 0);
    product['openingStockQty'] = parseFloat(product['openingStockQty'] || 0);
    product['freeQty'] = parseFloat(product['freeQty'] || 0);
    product['stockReOrderQty'] = parseFloat(product['stockReOrderQty'] || 0);
    product['cgst'] = parseFloat(product['cgst'] || 0);
    product['sgst'] = parseFloat(product['sgst'] || 0);
    product['igst'] = parseFloat(product['igst'] || 0);
    product['cess'] = parseFloat(product['cess'] || 0);
    product['purchaseCgst'] = parseFloat(product['purchaseCgst'] || 0);
    product['purchaseSgst'] = parseFloat(product['purchaseSgst'] || 0);
    product['purchaseIgst'] = parseFloat(product['purchaseIgst'] || 0);
    product['purchaseCess'] = parseFloat(product['purchaseCess'] || 0);

    if (product.barcode === '' && productTxnSettings.autoGenerateBarcode) {
      if (
        String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
      ) {
        product.barcode = await uniqueCodeGenerator.generateUniqueCode();
      } else {
        product.barcode = Date.now();
      }
    }

    product.enableQuantity = true;

    if (localStorage.getItem('isHotelOrRestaurant')) {
      let isHotelOrRestaurant = localStorage.getItem('isHotelOrRestaurant');
      if (String(isHotelOrRestaurant).toLowerCase() === 'true') {
        product.enableQuantity = false;
      }
    }

    let InsertDoc = { ...product };
    InsertDoc = new ProductDetail().convertTypes(InsertDoc);

    InsertDoc.calculateStockAndBalance = true;

    db.businessproduct
      .insert(InsertDoc)
      .then((data) => {
        this.addOpeningStockTransaction(data);
        console.log('Product data Inserted' + data);
      })
      .catch((error) => {
        console.log('Product Insertion Failed - ', error);
      });
  };

  updateExcelProductRowData = async (row, id) => {
    const productTxnSettings = await this.getProductTransSettingdetails();
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const productData = await db.businessproduct
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { productId: { $eq: id } }
          ]
        }
      })
      .exec();

    const changeData = async (oldData) => {
      // Iterate over each cell in the row
      row.eachCell((cell, colNumber) => {
        if (colNumber === 9) {
          const disc = parseFloat(cell.value || 0);
          if (disc > 0) {
            oldData.purchaseDiscountPercent = disc;
            oldData.purchaseDiscountType = 'percentage';

            if (
              oldData.purchaseDiscountPercent &&
              oldData.purchaseDiscountPercent > 0
            ) {
              oldData.purchaseDiscountAmount = parseFloat(
                (oldData.purchasedPrice * oldData.purchaseDiscountPercent) /
                  100 || 0
              ).toFixed(2);
            } else {
              oldData.purchaseDiscountAmount = 0;
            }
          }
        } else if (colNumber === 11) {
          let tax = parseFloat(cell.value);
          if (tax !== 0) {
            oldData.purchaseIgst = tax;
            oldData.purchaseCgst = tax / 2;
            oldData.purchaseSgst = tax / 2;
          }
        } else if (colNumber === 14) {
          const disc = parseFloat(cell.value || 0);
          oldData.saleDiscountPercent = disc;
          oldData.saleDiscountType = 'percentage';

          if (oldData.saleDiscountPercent && oldData.saleDiscountPercent > 0) {
            oldData.saleDiscountAmount = parseFloat(
              (oldData.salePrice * oldData.saleDiscountPercent) / 100 || 0
            ).toFixed(2);
          } else {
            oldData.saleDiscountAmount = 0;
          }
        } else if (colNumber === 16) {
          let tax = parseFloat(cell.value);
          if (tax !== 0) {
            oldData.igst = tax;
            oldData.cgst = tax / 2;
            oldData.sgst = tax / 2;
          }
        } else if (colNumber === 22) {
          if (cell.value !== 'SELECT') {
            let unitCodeResult = unitHelper
              .getUnits()
              .find((e) => e.fullName === cell.value);

            if (unitCodeResult) {
              oldData.primaryUnit.fullName = cell.value;
              oldData.primaryUnit.shortName = unitCodeResult.shortName;
            }
          }
        } else if (colNumber === 23) {
          if (cell.value !== 'SELECT' && oldData.primaryUnit.fullName !== '') {
            let unitCodeResult = unitHelper
              .getUnits()
              .find((e) => e.fullName === cell.value);

            if (unitCodeResult) {
              oldData.secondaryUnit.fullName = cell.value;
              oldData.secondaryUnit.shortName = unitCodeResult.shortName;
            }
          }
        } else if (colNumber === 24) {
          if (
            oldData.primaryUnit.fullName !== '' &&
            oldData.secondaryUnit.fullName !== ''
          ) {
            oldData['unitConversionQty'] = cell.value
              ? parseFloat(cell.value)
              : 0;
          } else {
            oldData['unitConversionQty'] = 0;
          }
        } else {
          switch (updateExcelMapping.list[colNumber]) {
            case 'taxIncluded':
              if (cell.value === 'Y') {
                oldData.taxIncluded = true;
              } else {
                oldData.taxIncluded = false;
              }
              break;
            case 'purchaseTaxIncluded':
              if (cell.value === 'Y') {
                oldData.purchaseTaxIncluded = true;
              } else {
                oldData.purchaseTaxIncluded = false;
              }
              break;
            case 'isOffLine':
              if (cell.value === 'Y') {
                oldData.isOffLine = true;
              } else {
                oldData.isOffLine = false;
              }
              break;
            case 'isOnLine':
              if (cell.value === 'Y') {
                oldData.isOnLine = true;
              } else {
                oldData.isOnLine = false;
              }
              break;
            default:
              return (oldData[updateExcelMapping.list[colNumber]] = cell.value);
          }
        }
      });

      oldData['finalMRPPrice'] = parseFloat(oldData['finalMRPPrice'] || 0);
      oldData['purchasedPrice'] = parseFloat(oldData['purchasedPrice'] || 0);
      oldData['salePrice'] = parseFloat(oldData['salePrice'] || 0);

      oldData['stockQty'] = parseFloat(oldData['openingStockQty'] || 0);
      oldData['openingStockQty'] = parseFloat(oldData['openingStockQty'] || 0);
      oldData['freeQty'] = parseFloat(oldData['freeQty'] || 0);
      oldData['stockReOrderQty'] = parseFloat(oldData['stockReOrderQty'] || 0);
      oldData['cgst'] = parseFloat(oldData['cgst'] || 0);
      oldData['sgst'] = parseFloat(oldData['sgst'] || 0);
      oldData['igst'] = parseFloat(oldData['igst'] || 0);
      oldData['cess'] = parseFloat(oldData['cess'] || 0);
      oldData['purchaseCgst'] = parseFloat(oldData['purchaseCgst'] || 0);
      oldData['purchaseSgst'] = parseFloat(oldData['purchaseSgst'] || 0);
      oldData['purchaseIgst'] = parseFloat(oldData['purchaseIgst'] || 0);
      oldData['purchaseCess'] = parseFloat(oldData['purchaseCess'] || 0);

      if (oldData.barcode === '' && productTxnSettings.autoGenerateBarcode) {
        if (
          String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
        ) {
          oldData.barcode = await uniqueCodeGenerator.generateUniqueCode();
        } else {
          oldData.barcode = Date.now();
        }
      }

      oldData.updatedAt = Date.now();

      return oldData;
    };
    await productData.atomicUpdate(changeData);
  };

  getLevel3Category = async (l2, l3) => {
    const db = await Db.get();
    let result = {};

    const businessData = await Bd.getBusinessData();

    let Query = await db.businesscategories.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { 'level2Category.displayName': { $eq: l2.displayName } }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (data) {
        let response = data.map((item) => item.toJSON());
        for (let res of response) {
          for (let l of res.level3Categories) {
            if (l.displayName === l3) {
              result = l;
              break;
            }
          }
        }
      }
    });

    return result;
  };

  handleEnableOrDisableProduct = async (product) => {
    // console.log('handleEnableOrDisableProduct::', product);

    let item = {};
    let data = product['data'];
    item.isOutOfStock = data.isOutOfStock;

    if (!item.isOutOfStock) {
      item.isOutOfStock = false;
    }

    if (item.isOutOfStock) {
      item.isOutOfStock = false;
    } else {
      item.isOutOfStock = true;
    }

    item.productId = data.productId;

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const productData = await db.businessproduct
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { productId: { $eq: item.productId } }
          ]
        }
      })
      .exec();

    const changeData = (oldData) => {
      // console.log('old data::', oldData);
      oldData.isOutOfStock = item.isOutOfStock;
      oldData.updatedAt = Date.now();
      return oldData;
    };
    await productData.atomicUpdate(changeData);
  };

  handleEditProductModal = async (item) => {
    runInAction(() => {
      if (item['data']) {
        let data = toJS(item['data']);
        this.getBatchProductChosenProperties(data);
        this.setProductDetailDataForEdit(data);
        this.setExistingProductDetailData(data);

        this.selectedLevel2Category = data['categoryLevel2'];
        this.selectedLevel3Category = data['categoryLevel3'];
        this.isProductUpdated = true;
        this.isProductComingFromRawMaterials = false;
        this.productDialogOpen = true;
      }
    });
  };
  
  getBatchProductChosenProperties = async (item) => {
    let reqData = {};
    console.log('items', item);
    reqData = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      productId: item.productId,
      category: item.categoryLevel3 ? item.categoryLevel3.name : ''
      // category: 'rose_gold_kadas_level3'
    };

    await axios
      .post(
        `${this.API_SERVER}/v1/web/pos/business/products/getBatchProductChosenProperties`,
        reqData
      )
      .then(async (response) => {
        console.log('ProductChosenProperties', response.data);
        runInAction(() => {
          this.ProductChosenProperties = response.data;
        });
      })
      .catch((err) => {
        throw err;
      });
  };

  handleEditProductModalLaunchFromReports = async (data) => {
    runInAction(() => {
      if (data) {
        this.setProductDetailDataForEdit(data);
        this.setExistingProductDetailData(data);

        this.selectedLevel2Category = data['categoryLevel2'];
        this.selectedLevel3Category = data['categoryLevel3'];
        this.isProductUpdated = true;
        this.isProductComingFromRawMaterials = false;
        this.productDialogOpen = true;
      }
    });
  };

  setProductDetailDataForEdit = async (data) => {
    runInAction(() => {
      let baseObj = new ProductDetail().defaultValues();

      if (baseObj) {
        Object.keys(baseObj).forEach((key) => {
          if (Array.isArray(baseObj[key])) {
            let finalArray = [];
            if (data[key]) {
              data[key].forEach((item) => {
                let innerObj = item;
                let temObj = {};

                if (innerObj) {
                  Object.keys(innerObj).forEach((subKey) => {
                    if (innerObj && innerObj[subKey]) {
                      temObj[subKey] = innerObj[subKey];
                    }
                  });
                }

                if (temObj) {
                  finalArray.push(temObj);
                }
              });
            }
            this.productDetail[key] = finalArray;
          } else if (typeof baseObj[key] === 'object') {
            let innerObj = baseObj[key];

            if (innerObj) {
              Object.keys(innerObj).forEach((subKey) => {
                if (data[key] && data[key][subKey]) {
                  this.productDetail[key][subKey] = data[key][subKey];
                }
              });
            }
          } else {
            this.productDetail[key] = data[key];
          }
        });
      }

      if (!this.productDetail.batchData) {
        this.productDetail.batchData = [];
      }

      if (!this.productDetail.adjustedData) {
        this.productDetail.adjustedData = [];
      }

      if (data.rawMaterialData === undefined || data.rawMaterialData === null) {
        this.productDetail.rawMaterialData = this.defaultRawMaterialData;
      } else {
        let rMData = {
          rawMaterialList: [],
          total: 0,
          subTotal: 0,
          directExpenses: []
        };

        rMData.rawMaterialList = data.rawMaterialData.rawMaterialList;
        rMData.total = data.rawMaterialData.total;
        rMData.subTotal = data.rawMaterialData.subTotal;
        rMData.directExpenses = data.rawMaterialData.directExpenses;
        this.productDetail.rawMaterialData = rMData;
      }

      let pU = {
        fullName: '',
        shortName: ''
      };
      if (data.primaryUnit) {
        pU.fullName = data.primaryUnit.fullName;
        pU.shortName = data.primaryUnit.shortName;
      }
      this.productDetail.primaryUnit = pU;

      let sU = {
        fullName: '',
        shortName: ''
      };
      if (data.secondaryUnit) {
        sU.fullName = data.secondaryUnit.fullName;
        sU.shortName = data.secondaryUnit.shortName;
      }
      this.productDetail.secondaryUnit = sU;

      this.productDetail.updatedAt = Date.now();
      this.singleSerialData = this.productDetail.serialData;

      console.log('this.productDetaildata', this.productDetail);
    });
  };

  setExistingProductDetailData = async (data) => {
    runInAction(() => {
      let baseObj = new ProductDetail().defaultValues();

      //copy objects properties inside objects -- start

      if (baseObj) {
        Object.keys(baseObj).forEach((key) => {
          if (Array.isArray(baseObj[key])) {
            let finalArray = [];
            if (data[key]) {
              data[key].forEach((item) => {
                let innerObj = item;
                let temObj = {};

                if (innerObj) {
                  Object.keys(innerObj).forEach((subKey) => {
                    if (innerObj && innerObj[subKey]) {
                      temObj[subKey] = innerObj[subKey];
                    }
                  });
                }

                if (temObj) {
                  finalArray.push(temObj);
                }
              });
            }
            this.existingProductDetail[key] = finalArray;
          } else if (typeof baseObj[key] === 'object') {
            let innerObj = baseObj[key];

            if (innerObj) {
              Object.keys(innerObj).forEach((subKey) => {
                if (data[key] && data[key][subKey]) {
                  this.existingProductDetail[key][subKey] = data[key][subKey];
                }
              });
            }
          } else {
            this.existingProductDetail[key] = data[key];
          }
        });
      }

      //copy objects properties inside objects -- end

      if (!this.existingProductDetail.batchData) {
        this.existingProductDetail.batchData = [];
      }

      if (!this.existingProductDetail.adjustedData) {
        this.existingProductDetail.adjustedData = [];
      }

      if (data.rawMaterialData === undefined || data.rawMaterialData === null) {
        this.existingProductDetail.rawMaterialData =
          this.defaultRawMaterialData;
      } else {
        let rMData = {
          rawMaterialList: [],
          total: 0,
          subTotal: 0,
          directExpenses: []
        };

        rMData.rawMaterialList = data.rawMaterialData.rawMaterialList;
        rMData.total = data.rawMaterialData.total;
        rMData.subTotal = data.rawMaterialData.subTotal;
        rMData.directExpenses = data.rawMaterialData.directExpenses;
        this.existingProductDetail.rawMaterialData = rMData;
      }

      let pU = {
        fullName: '',
        shortName: ''
      };
      if (data.primaryUnit) {
        pU.fullName = data.primaryUnit.fullName;
        pU.shortName = data.primaryUnit.shortName;
      }
      this.existingProductDetail.primaryUnit = pU;

      let sU = {
        fullName: '',
        shortName: ''
      };
      if (data.secondaryUnit) {
        sU.fullName = data.secondaryUnit.fullName;
        sU.shortName = data.secondaryUnit.shortName;
      }
      this.existingProductDetail.secondaryUnit = sU;
    });
  };

  setProductDetailDataForManufacture = async (data, isComingFromMfg) => {
    runInAction(() => {
      this.isComingFromManufacture = isComingFromMfg;
      if (data) {
        this.setProductDetailDataForEdit(data);
        this.setExistingProductDetailData(data);

        this.selectedLevel2Category = data['categoryLevel2'];
        this.selectedLevel3Category = data['categoryLevel3'];
      } else {
        this.productDetail = this.defaultProductDetail;
      }

      this.handleMfgModalOpen();
    });
  };

  resetSingleBatchData = async () => {
    runInAction(() => {
      /**
       * reset to defaults
       */
      this.singleBatchData = new BatchData().defaultValues();
    });
  };
  resetSingleSerialData = async () => {
    runInAction(() => {
      this.singleSerialData = [];
      this.singleSerialData.push(new SerialData().defaultValues());
    });
  };

  resetSingleAdjustedData = async () => {
    /**
     * reset to defaults
     */
    runInAction(() => {
      this.singleAdjustedData = new Adjustment().defaultValues('Add Stock');
      this.existingSingleAdjustedData = new Adjustment().defaultValues('');

      this.isAdjustmentUpdate = false;
    });
  };

  handleRemoveProduct = async (item) => {
    let arrayFilter = [];
    arrayFilter.push({ productId: { $eq: item['data']['productId'] } });

    await removeProduct(arrayFilter);
  };

  handleProductSearch = async (value) => {
    return await getBusinessProducts(value);
  };

  handleExcelModalClose = () => {
    runInAction(() => {
      this.ExcelDialogOpen = false;
    });
  };

  handleExcelModalOpen = () => {
    runInAction(() => {
      this.excelDetail = this.defaultExcelDetail;
      this.ExcelDialogOpen = true;
    });
  };

  setBatchVendor = async (vendor, isNewVendor) => {
    runInAction(() => {
      this.singleBatchData.vendorName = vendor.name;
      this.singleBatchData.vendorPhoneNumber = vendor.phoneNo;
    });
  };

  setBatchVendorName = (value) => {
    runInAction(() => {
      this.singleBatchData.vendorName = value;
    });
  };

  setAdjustmentVendor = async (vendor, isNewVendor) => {
    runInAction(() => {
      this.singleAdjustedData.vendorPhoneNumber = vendor.phoneNo;

      this.singleAdjustedData.vendor = vendor.name;
    });
  };

  setAdjustmentVendorName = (value) => {
    runInAction(() => {
      this.singleAdjustedData.vendor = value;
    });
  };

  setSaleDiscountPercent = (value) => {
    runInAction(async () => {
      this.productDetail.saleDiscountPercent = value ? parseFloat(value) : '';
      this.productDetail.saleDiscountType = 'percentage';

      if (
        this.productDetail.saleDiscountPercent &&
        this.productDetail.saleDiscountPercent > 0
      ) {
        this.productDetail.saleDiscountAmount = parseFloat(
          (this.productDetail.salePrice *
            this.productDetail.saleDiscountPercent) /
            100 || 0
        ).toFixed(2);
      } else {
        this.productDetail.saleDiscountAmount = 0;
      }

      let actualValue =
        parseFloat(this.productDetail.salePrice || 0) -
        parseFloat(this.productDetail.saleDiscountAmount || 0);

      if (actualValue !== '') {
        let auditSettings = await audit.getAuditSettingsData();
        if (
          auditSettings &&
          auditSettings.taxRateAutofillList &&
          auditSettings.taxRateAutofillList.length > 0
        ) {
          for (let taxRateObj of auditSettings.taxRateAutofillList) {
            if (actualValue >= taxRateObj.price) {
              this.setProductProperty('cgst', taxRateObj.tax / 2);
              this.setProductProperty('sgst', taxRateObj.tax / 2);
              this.setProductProperty('igst', parseFloat(taxRateObj.tax));
            }
          }
        }
      } else {
        this.setProductProperty('cgst', 0);
        this.setProductProperty('sgst', 0);
        this.setProductProperty('igst', 0);
      }
    });
  };

  setSaleDiscountAmount = (value) => {
    runInAction(async () => {
      this.productDetail.saleDiscountAmount = value ? parseFloat(value) : '';
      this.productDetail.saleDiscountType = 'amount';

      if (
        this.productDetail.saleDiscountAmount &&
        this.productDetail.saleDiscountAmount > 0
      ) {
        this.productDetail.saleDiscountPercent =
          Math.round(
            ((this.productDetail.saleDiscountAmount /
              this.productDetail.salePrice) *
              100 || 0) * 100
          ) / 100;
      } else {
        this.productDetail.saleDiscountPercent = 0;
      }

      let actualValue =
        parseFloat(this.productDetail.salePrice || 0) -
        parseFloat(this.productDetail.saleDiscountAmount || 0);

      if (actualValue !== '') {
        let auditSettings = await audit.getAuditSettingsData();
        if (
          auditSettings &&
          auditSettings.taxRateAutofillList &&
          auditSettings.taxRateAutofillList.length > 0
        ) {
          for (let taxRateObj of auditSettings.taxRateAutofillList) {
            if (actualValue >= taxRateObj.price) {
              this.setProductProperty('cgst', taxRateObj.tax / 2);
              this.setProductProperty('sgst', taxRateObj.tax / 2);
              this.setProductProperty('igst', parseFloat(taxRateObj.tax));
            }
          }
        }
      } else {
        this.setProductProperty('cgst', 0);
        this.setProductProperty('sgst', 0);
        this.setProductProperty('igst', 0);
      }
    });
  };

  setPurchaseDiscountPercent = (value) => {
    runInAction(async () => {
      this.productDetail.purchaseDiscountPercent = value
        ? parseFloat(value)
        : '';
      this.productDetail.purchaseDiscountType = 'percentage';

      if (
        this.productDetail.purchaseDiscountPercent &&
        this.productDetail.purchaseDiscountPercent > 0
      ) {
        this.productDetail.purchaseDiscountAmount = parseFloat(
          (this.productDetail.purchasedPrice *
            this.productDetail.purchaseDiscountPercent) /
            100 || 0
        ).toFixed(2);
      } else {
        this.productDetail.purchaseDiscountAmount = 0;
      }

      let actualValue =
        parseFloat(this.productDetail.purchasedPrice || 0) -
        parseFloat(this.productDetail.purchaseDiscountAmount || 0);
      if (actualValue !== '') {
        let auditSettings = await audit.getAuditSettingsData();
        if (
          auditSettings &&
          auditSettings.taxRateAutofillList &&
          auditSettings.taxRateAutofillList.length > 0
        ) {
          for (let taxRateObj of auditSettings.taxRateAutofillList) {
            if (actualValue >= taxRateObj.price) {
              this.setProductProperty('purchaseCgst', taxRateObj.tax / 2);
              this.setProductProperty('purchaseSgst', taxRateObj.tax / 2);
              this.setProductProperty(
                'purchaseIgst',
                parseFloat(taxRateObj.tax)
              );
            }
          }
        }
      } else {
        this.setProductProperty('purchaseCgst', 0);
        this.setProductProperty('purchaseSgst', 0);
        this.setProductProperty('purchaseIgst', 0);
      }
    });
  };

  setPurchaseDiscountAmount = (value) => {
    runInAction(async () => {
      this.productDetail.purchaseDiscountAmount = value
        ? parseFloat(value)
        : '';
      this.productDetail.purchaseDiscountType = 'amount';

      if (
        this.productDetail.purchaseDiscountAmount &&
        this.productDetail.purchaseDiscountAmount > 0
      ) {
        this.productDetail.purchaseDiscountPercent =
          Math.round(
            ((this.productDetail.purchaseDiscountAmount /
              this.productDetail.purchasedPrice) *
              100 || 0) * 100
          ) / 100;
      } else {
        this.productDetail.purchaseDiscountPercent = 0;
      }

      let actualValue =
        parseFloat(this.productDetail.purchasedPrice || 0) -
        parseFloat(this.productDetail.purchaseDiscountAmount || 0);
      if (actualValue !== '') {
        let auditSettings = await audit.getAuditSettingsData();
        if (
          auditSettings &&
          auditSettings.taxRateAutofillList &&
          auditSettings.taxRateAutofillList.length > 0
        ) {
          for (let taxRateObj of auditSettings.taxRateAutofillList) {
            if (actualValue >= taxRateObj.price) {
              this.setProductProperty('purchaseCgst', taxRateObj.tax / 2);
              this.setProductProperty('purchaseSgst', taxRateObj.tax / 2);
              this.setProductProperty(
                'purchaseIgst',
                parseFloat(taxRateObj.tax)
              );
            }
          }
        }
      } else {
        this.setProductProperty('purchaseCgst', 0);
        this.setProductProperty('purchaseSgst', 0);
        this.setProductProperty('purchaseIgst', 0);
      }
    });
  };

  setBatchSaleDiscountPercent = (value) => {
    runInAction(() => {
      this.singleBatchData.saleDiscountPercent = value ? parseFloat(value) : '';
      this.singleBatchData.saleDiscountType = 'percentage';

      if (
        this.singleBatchData.saleDiscountPercent &&
        this.singleBatchData.saleDiscountPercent > 0
      ) {
        this.singleBatchData.saleDiscountAmount = parseFloat(
          (this.singleBatchData.salePrice *
            this.singleBatchData.saleDiscountPercent) /
            100 || 0
        ).toFixed(2);
      } else {
        this.singleBatchData.saleDiscountAmount = 0;
      }
    });
  };

  setBatchSaleDiscountAmount = (value) => {
    runInAction(() => {
      this.singleBatchData.saleDiscountAmount = value ? parseFloat(value) : '';
      this.singleBatchData.saleDiscountType = 'amount';

      if (
        this.singleBatchData.saleDiscountAmount &&
        this.singleBatchData.saleDiscountAmount > 0
      ) {
        this.singleBatchData.saleDiscountPercent =
          Math.round(
            ((this.singleBatchData.saleDiscountAmount /
              this.singleBatchData.salePrice) *
              100 || 0) * 100
          ) / 100;
      } else {
        this.singleBatchData.saleDiscountPercent = 0;
      }
    });
  };

  setBatchPurchaseDiscountPercent = (value) => {
    runInAction(() => {
      this.singleBatchData.purchaseDiscountPercent = value
        ? parseFloat(value)
        : '';
      this.singleBatchData.purchaseDiscountType = 'percentage';

      if (
        this.singleBatchData.purchaseDiscountPercent &&
        this.singleBatchData.purchaseDiscountPercent > 0
      ) {
        this.singleBatchData.purchaseDiscountAmount = parseFloat(
          (this.singleBatchData.purchasedPrice *
            this.singleBatchData.purchaseDiscountPercent) /
            100 || 0
        ).toFixed(2);
      } else {
        this.singleBatchData.purchaseDiscountAmount = 0;
      }
    });
  };

  setBatchPurchaseDiscountAmount = (value) => {
    runInAction(() => {
      this.singleBatchData.purchaseDiscountAmount = value
        ? parseFloat(value)
        : '';
      this.singleBatchData.purchaseDiscountType = 'amount';

      if (
        this.singleBatchData.purchaseDiscountAmount &&
        this.singleBatchData.purchaseDiscountAmount > 0
      ) {
        this.singleBatchData.purchaseDiscountPercent =
          Math.round(
            ((this.singleBatchData.purchaseDiscountAmount /
              this.singleBatchData.purchasedPrice) *
              100 || 0) * 100
          ) / 100;
      } else {
        this.singleBatchData.purchaseDiscountPercent = 0;
      }
    });
  };

  setRawMaterialData = (data) => {
    this.productDetail.rawMaterialData = data;
  };

  findProductAndPrepareManufactureDetails = async (productId) => {
    var Query;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    Query = db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { productId: { $eq: productId } }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (data) {
        this.productDetail = data;
      } else {
        this.productDetail = this.defaultProductDetail;
      }
    });
  };

  setProductFromManufacture = (data) => {
    this.setProductDetailDataForEdit(data);
    this.setExistingProductDetailData(data);

    this.selectedLevel2Category = data['categoryLevel2'];
    this.selectedLevel3Category = data['categoryLevel3'];
  };

  addManufactureProductData = async (rawMaterialTotal, isNewBatch) => {
    this.isManufactureListRefreshed = false;
    this.isManufacturing = true;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.productDetail.batchCreatedFromManufacture = true;

    const timestamp = Math.floor(Date.now() / 1000);
    const appId = businessData.posDeviceId;
    const id = _uniqueId('m');
    const mfg_number = `${id}${appId}${timestamp}`;

    let sequenceData = {};
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      sequenceData.multiDeviceBillingSupport =
        transSettings.multiDeviceBillingSupport;
      sequenceData.prefix =
        transSettings.manufacture.prefixSequence &&
        transSettings.manufacture.prefixSequence.length > 0
          ? transSettings.manufacture.prefixSequence[0].prefix
          : '';
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      sequenceData.prefix = localStorage.getItem('deviceName');
      sequenceData.subPrefix = 'M';
      isOnline = false;
    }

    const sequenceNumber = await sequence.getFinalSequenceNumber(
      sequenceData,
      'Manufacture',
      null,
      mfg_number,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );

    if (sequenceNumber === '0') {
      this.handleCloseManufactureLoadingMessage();
      this.handleOpenMfgSequenceNumberFailureAlert();
      return;
    }

    if (isNewBatch) {
      await this.addSingleBatchData(false);
    } else {
      await this.updateBatchData(false);
    }

    let txnData = {};

    txnData.businessId = businessData.businessId;
    txnData.businessCity = businessData.businessCity;
    txnData.invoice_number = mfg_number;
    txnData.invoice_date = dateFormat(new Date(), 'yyyy-mm-dd');
    txnData.posId = parseFloat(businessData.posDeviceId);
    txnData.sequenceNumber = sequenceNumber;

    await productTxnHelper.saveProductTxnFromManufacture(
      rawMaterialTotal,
      txnData,
      this.singleBatchData,
      this.productDetail
    );

    let mfgQty = this.singleBatchData.manufacturingQty;
    let mfgFreeQty = this.singleBatchData.freeManufacturingQty;

    let totalMfgQty = parseFloat(mfgQty || 0) + parseFloat(mfgFreeQty || 0);

    const rawMaterialProductList = Array.from(
      this.productDetail.rawMaterialData.rawMaterialList
    );

    await productTxnHelper.saveRawMaterialProductTxn(
      txnData,
      db,
      rawMaterialProductList,
      totalMfgQty
    );

    this.isProductUpdated = true;
    this.isProductComingFromRawMaterials = false;
    await this.saveProduct(false);

    // await this.decrementRawMaterialsStockQuantity(
    //   db,
    //   rawMaterialProductList,
    //   totalMfgQty
    // );

    await this.resetSingleBatchData();

    this.handleCloseManufactureLoadingMessage();
    this.handleMfgModalClose();

    this.isManufactureListRefreshed = true;
  };

  updateProductFromManufacture = async (txnData) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let Query = await db.businessproduct.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { productId: { $eq: txnData.productId } }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (data) {
        runInAction(() => {
          this.isComingFromManufacture = false;
          this.oldTxnData = txnData;

          this.setProductDetailDataForEdit(data);
          this.setExistingProductDetailData(data);

          this.selectedLevel2Category = data['categoryLevel2'];
          this.selectedLevel3Category = data['categoryLevel3'];

          const index = this.productDetail.batchData
            .map(function(x) {
              return x.id;
            })
            .indexOf(txnData.batchNumber);

          if (index !== -1) {
            this.singleBatchData = this.existingProductDetail.batchData[index];
            this.handleEditMfgModalOpen();
          } else {
            this.batchNotAvailableError = true;
          }
        });
      }
    });
  };

  isProductNameAvailable = async (name) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    let isAvailable = false;

    let Query = await db.businessproduct.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { name: { $eq: name } }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (data) {
        isAvailable = true;
      } else {
        isAvailable = false;
      }
    });
    return isAvailable;
  };

  updateManufactureProductData = async (rawMaterialTotal, txnData) => {
    this.isManufactureListRefreshed = false;
    // await this.deleteManufactureData(txnData);

    this.productDetail.batchCreatedFromManufacture = true;

    this.isManufacturing = true;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      const index = this.productDetail.batchData
        .map(function(x) {
          return x.id;
        })
        .indexOf(this.singleBatchData.id);

      let existingBatchOpeningStockQty = 0;
      let existingBatchMfgQty = 0;
      let existingBatchData = this.existingProductDetail.batchData[index];

      if (existingBatchData) {
        existingBatchOpeningStockQty =
          parseFloat(existingBatchData.openingStockQty) || 0;
        existingBatchMfgQty =
          parseFloat(existingBatchData.manufacturingQty) || 0;
      }

      // now we are handling below logic in server

      // this.singleBatchData.qty =
      //   parseFloat(this.singleBatchData.qty) +
      //   (parseFloat(this.singleBatchData.openingStockQty) || 0) -
      //   (parseFloat(existingBatchOpeningStockQty) || 0) +
      //   (parseFloat(this.singleBatchData.manufacturingQty) || 0) -
      //   (parseFloat(existingBatchMfgQty) || 0);

      if (this.isManufacturing) {
        if (this.singleBatchData.freeManufacturingQty > 0) {
          this.singleBatchData.freeQty =
            parseFloat(this.singleBatchData.freeManufacturingQty) || 0;
        }
      }

      this.productDetail.batchData[index] = this.singleBatchData;

      this.isBatchUpdate = false;
      this.isManufactureListRefreshed = true;
    });

    let newTxnData = {};

    newTxnData.businessId = businessData.businessId;
    newTxnData.businessCity = businessData.businessCity;
    newTxnData.invoice_number = txnData.txnId;
    newTxnData.invoice_date = dateFormat(new Date(), 'yyyy-mm-dd');
    newTxnData.posId = parseFloat(businessData.posDeviceId);
    newTxnData.sequenceNumber = txnData.sequenceNumber;

    let mfgQty = this.singleBatchData.manufacturingQty;
    let mfgFreeQty = this.singleBatchData.freeManufacturingQty;

    let totalMfgQty = parseFloat(mfgQty || 0) + parseFloat(mfgFreeQty || 0);

    await productTxnHelper.updateProductTxnFromManufacture(
      rawMaterialTotal,
      newTxnData,
      this.singleBatchData,
      this.productDetail,
      db
    );

    const rawMaterialProductList = Array.from(
      this.productDetail.rawMaterialData.rawMaterialList
    );

    await productTxnHelper.updateRawMaterialProductTxn(
      newTxnData,
      db,
      rawMaterialProductList,
      totalMfgQty
    );

    // this.isProductUpdated = true;
    // await this.saveProduct(false);

    // await this.decrementRawMaterialsStockQuantity(
    //   db,
    //   rawMaterialProductList,
    //   totalMfgQty
    // );

    await this.resetSingleBatchData();

    this.txnData = {};
    this.handleCloseManufactureLoadingMessage();
    this.handleEditMfgModalClose();
    this.isManufactureListRefreshed = true;
  };

  decrementRawMaterialsStockQuantity = async (
    db,
    rawMaterialProductList,
    totalMfgQty
  ) => {
    rawMaterialProductList.forEach(async (element) => {
      if (element.product_id && element.categoryLevel2) {
        let totalQty = parseFloat(element.qty) * parseFloat(totalMfgQty);
        await this.updateProductStock(
          db,
          element.product_id,
          element.qtyUnit && element.qtyUnit !== ''
            ? this.getMfgQuantityByUnit(element, totalQty)
            : totalQty || 0,
          0,
          -1,
          element.batch_id // to handle batch count
        );
      }
    });
  };

  deleteManufactureData = async (txnData) => {
    var Query;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    let rawMaterialTxn = {};

    Query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { txnType: { $eq: 'Raw Material' } },
          { txnId: { $eq: txnData.txnId } }
        ]
      }
    });

    await Query.exec().then(async (data) => {
      if (!data) {
        return;
      }

      rawMaterialTxn = data.map((item) => item);

      for (let txndata of rawMaterialTxn) {
        // increment raw material stock
        // await this.updateProductStock(
        //   db,
        //   txndata.productId,
        //   txndata.qtyUnit && txndata.qtyUnit !== ''
        //     ? qtyUnitUtility.getQuantityByUnit(txndata)
        //     : txndata.txnQty || 0,
        //   txndata.qtyUnit && txndata.qtyUnit !== ''
        //     ? qtyUnitUtility.getFreeQuantityByUnit(txndata)
        //     : txndata.freeQty || 0,
        //   1,
        //   txndata.batchNumber // to handle batch count
        // );

        const query = db.producttxn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { id: { $eq: txndata.id } }
            ]
          }
        });

        await query
          .remove()
          .then(async (data) => {
            console.log('product txn data removed' + data);
          })
          .catch((error) => {
            console.log('product txn hand deletion Failed ' + error);
          });
      }

      // await this.updateProductStock(
      //   db,
      //   txnData.productId,
      //   txnData.txnQty,
      //   txnData.freeTxnQty,
      //   -1,
      //   txnData.batchNumber
      // );

      const query = db.producttxn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { txnType: { $eq: 'Manufacture' } },
            { txnId: { $eq: txnData.txnId } }
          ]
        }
      });

      await query
        .remove()
        .then(async (data) => {
          console.log('product txn data removed' + data);
        })
        .catch((error) => {
          console.log('product txn hand deletion Failed ' + error);
        });
    });

    this.isManufactureListRefreshed = true;
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

          oldData.updatedAt = Date.now();

          return oldData;
        };

        await categoryData.atomicUpdate(changeData);
      }
    }
  };

  handleOpenManufactureLoadingMessage = async () => {
    runInAction(() => {
      this.openManufactureLoadingAlertMessage = true;
    });
  };

  handleCloseManufactureLoadingMessage = async () => {
    runInAction(() => {
      this.openManufactureLoadingAlertMessage = false;
    });
  };

  handleOpenProductLoadingMessage = async () => {
    runInAction(() => {
      this.openProductLoadingAlertMessage = true;
    });
  };

  handleCloseProductLoadingMessage = async () => {
    runInAction(() => {
      this.openProductLoadingAlertMessage = false;
    });
  };

  getMfgQuantityByUnit = (product, newQty) => {
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

  getProductTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let productTransSettingData = {};

    const query = db.producttransactionsettings.findOne({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        // console.log(data)
        if (!data) {
          return;
        }

        if (data) {
          runInAction(() => {
            productTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Product Transaction Settings Internal Server Error', err);
      });

    return productTransSettingData;
  };

  setProductTxnEnableFieldsMap = (productTransSettingData) => {
    this.productTxnSettingsData = productTransSettingData;

    this.productTxnEnableFieldsMap = new Map();
    if (productTransSettingData.businessId.length > 2) {
      const productLevel = productTransSettingData.enableOnTxn.productLevel;
      productLevel.map((item) => {
        if (this.productTxnEnableFieldsMap.has(item.name)) {
          this.productTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.productTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      const billLevel = productTransSettingData.enableOnTxn.billLevel;
      billLevel.map((item) => {
        if (this.productTxnEnableFieldsMap.has(item.name)) {
          this.productTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.productTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      if (this.productTxnEnableFieldsMap.get('enable_in_store_by_default')) {
        this.productDetail.isOffLine = true;
      } else {
        this.productDetail.isOffLine = false;
      }

      if (this.productTxnEnableFieldsMap.get('enable_online_by_default')) {
        this.productDetail.isOnLine = true;
      } else {
        this.productDetail.isOnLine = false;
      }
    }
  };

  handleAlterStockModalOpen = () => {
    runInAction(() => {
      this.productDetail = this.defaultProductDetail;
      this.alterStockOpenDialog = true;
    });
  };

  handleAlterStockModalClose = () => {
    runInAction(() => {
      this.alterStockOpenDialog = false;
    });
  };

  setProductFromAlterStock = (data) => {
    runInAction(() => {
      this.setProductDetailDataForEdit(data);
      this.setExistingProductDetailData(data);

      this.selectedLevel2Category = data['categoryLevel2'];
      this.selectedLevel3Category = data['categoryLevel3'];
    });
  };

  getActualOpeningPurchasePrice = (
    purchasePrice,
    cgst,
    sgst,
    igst,
    taxIncluded,
    purchaseDiscountAmount,
    stockQty
  ) => {
    let tax = (parseFloat(cgst) || 0) + (parseFloat(sgst) || 0);

    let itemPrice = purchasePrice;

    let totalGST = 0;
    let mrp_before_tax = 0;

    if (taxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
    }

    mrp_before_tax = parseFloat(itemPrice - parseFloat(totalGST));
    let itemPriceAfterDiscount = mrp_before_tax - purchaseDiscountAmount;
    let cgst_amount = 0;
    let sgst_amount = 0;

    if (!taxIncluded) {
      const totalGST = (itemPriceAfterDiscount * tax) / 100;
      cgst_amount = totalGST / 2;
      sgst_amount = totalGST / 2;
    } else {
      let totalGST = 0;

      if (purchaseDiscountAmount > 0) {
        totalGST = itemPriceAfterDiscount * (tax / 100);
        cgst_amount = totalGST / 2;
        sgst_amount = totalGST / 2;
      }
    }

    const finalOfferAmount = parseFloat(
      mrp_before_tax - purchaseDiscountAmount + cgst_amount + sgst_amount
    );

    let returnData = { total: 0, tax: 0 };

    returnData.total = finalOfferAmount * stockQty || 0;
    returnData.tax = parseFloat(cgst_amount + sgst_amount) || 0;

    return returnData;
  };

  addStockAlteredProductData = async (
    total,
    totalTax,
    operationType,
    changedStock,
    changedFreeStock
  ) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Math.floor(Date.now() / 1000);
    const appId = businessData.posDeviceId;
    const id = _uniqueId('st');
    const stock_number = `${id}${appId}${timestamp}`;

    let sequenceData = {};
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      sequenceData.multiDeviceBillingSupport =
        transSettings.multiDeviceBillingSupport;
      sequenceData.prefix =
        transSettings.stock.prefixSequence &&
        transSettings.stock.prefixSequence.length > 0
          ? transSettings.stock.prefixSequence[0].prefix
          : '';
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      sequenceData.prefix = localStorage.getItem('deviceName');
      sequenceData.subPrefix = 'Stock';
      isOnline = false;
    }

    const sequenceNumber = await sequence.getFinalSequenceNumber(
      sequenceData,
      'Stock',
      null,
      stock_number,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );

    let txnData = {};

    txnData.businessId = businessData.businessId;
    txnData.businessCity = businessData.businessCity;
    txnData.invoice_number = stock_number;
    txnData.invoice_date = dateFormat(new Date(), 'yyyy-mm-dd');
    txnData.posId = parseFloat(businessData.posDeviceId);
    txnData.sequenceNumber = sequenceNumber;

    // calculate price before tax
    let tax =
      (parseFloat(this.productDetail.purchaseCgst) || 0) +
      (parseFloat(this.productDetail.purchaseSgst) || 0);

    let itemPrice = this.productDetail.purchasedPrice;

    let totalGST = 0;

    if (this.productDetail.purchaseTaxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
    }

    let mrp_before_tax = parseFloat(itemPrice - parseFloat(totalGST));
    txnData.purchasePriceWithoutTax = parseFloat(mrp_before_tax).toFixed(2);

    await productTxnHelper.saveStockProductTxn(
      total,
      totalTax,
      txnData,
      this.singleBatchData,
      this.productDetail,
      changedStock,
      changedFreeStock,
      operationType,
      db
    );

    let operation = -1;

    if ('Add Stock' === operationType) {
      operation = 1;
    } else if (
      'Remove Stock' === operationType ||
      'Damage Stock' === operationType
    ) {
      operation = -1;
    }

    this.handleCloseAlterStockLoadingMessage();
    this.handleAlterStockModalClose();

    runInAction(() => {
      this.isAlterStockListRefreshed = true;
    });
  };

  deleteStockAlteredProduct = async (txnData, operationType) => {
    var Query;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    Query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { txnType: { $eq: operationType } },
          { txnId: { $eq: txnData.txnId } }
        ]
      }
    });

    await Query.exec().then(async (data) => {
      if (!data) {
        return;
      }

      let operation = -1;

      if ('Add Stock' === operationType) {
        operation = -1;
      } else if (
        'Remove Stock' === operationType ||
        'Damage Stock' === operationType
      ) {
        operation = 1;
      }

      const query = db.producttxn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { txnType: { $eq: operationType } },
            { txnId: { $eq: txnData.txnId } }
          ]
        }
      });

      await query
        .remove()
        .then(async (data) => {
          // console.log('product txn data removed' + data);
        })
        .catch((error) => {
          console.log('product txn hand deletion Failed ' + error);
        });
    });

    runInAction(() => {
      this.isAlterStockListRefreshed = true;
    });
  };

  addOpeningStockTransaction = async (productDetail) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    if (
      productDetail.openingStockQty === undefined ||
      productDetail.openingStockQty === null ||
      productDetail.openingStockQty === 0
    ) {
      return;
    }

    const id = 'st';
    const stock_number = `${id}${productDetail.productId}`;

    // prepare by composite primary

    const query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { txnId: { $eq: stock_number } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        // console.log('product txn data removed' + data);
      })
      .catch((error) => {
        console.log('product txn hand deletion Failed ' + error);
      });

    let sequenceData = {};
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      sequenceData.multiDeviceBillingSupport =
        transSettings.multiDeviceBillingSupport;
      sequenceData.prefix =
        transSettings.stock.prefixSequence &&
        transSettings.stock.prefixSequence.length > 0
          ? transSettings.stock.prefixSequence[0].prefix
          : '';
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      sequenceData.prefix = localStorage.getItem('deviceName');
      sequenceData.subPrefix = 'Stock';
      isOnline = false;
    }

    const sequenceNumber = await sequence.getFinalSequenceNumber(
      sequenceData,
      'Stock',
      null,
      stock_number,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );

    let txnData = {};

    txnData.businessId = businessData.businessId;
    txnData.businessCity = businessData.businessCity;
    txnData.invoice_number = stock_number;
    txnData.invoice_date = dateFormat(new Date(), 'yyyy-mm-dd');
    txnData.posId = parseFloat(businessData.posDeviceId);
    txnData.sequenceNumber = sequenceNumber;

    let changedStock = productDetail.openingStockQty;
    let changedFreeStock = productDetail.freeQty;

    // Calculate By Purchase Price
    let totalCost = this.getActualOpeningPurchasePrice(
      productDetail.purchasedPrice,
      productDetail.purchaseCgst,
      productDetail.purchaseSgst,
      productDetail.purchaseIgst,
      productDetail.purchaseTaxIncluded,
      productDetail.purchaseDiscountAmount,
      productDetail.openingStockQty
    );

    // calculate price before tax
    let tax =
      (parseFloat(productDetail.purchaseCgst) || 0) +
      (parseFloat(productDetail.purchaseSgst) || 0);

    let itemPrice = productDetail.purchasedPrice;

    let totalGST = 0;

    if (productDetail.purchaseTaxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
    }

    let mrp_before_tax = parseFloat(itemPrice - parseFloat(totalGST));
    txnData.purchasePriceWithoutTax = parseFloat(mrp_before_tax).toFixed(2);

    await productTxnHelper.saveOpeningStockProductTxn(
      totalCost.total,
      totalCost.tax,
      txnData,
      this.singleBatchData,
      productDetail,
      changedStock,
      changedFreeStock,
      'Opening Stock',
      db
    );
  };

  getActualPurchasePrice = (quantity) => {
    let tax =
      (parseFloat(this.productDetail.purchaseCgst) || 0) +
      (parseFloat(this.productDetail.purchaseSgst) || 0);

    let itemPrice = this.productDetail.purchasedPrice;

    let totalGST = 0;
    let mrp_before_tax = 0;

    if (this.productDetail.purchaseTaxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
    }

    mrp_before_tax = parseFloat(itemPrice - parseFloat(totalGST));
    let itemPriceAfterDiscount =
      mrp_before_tax - this.productDetail.purchaseDiscountAmount;
    let cgst_amount = 0;
    let sgst_amount = 0;

    if (!this.productDetail.purchaseTaxIncluded) {
      const totalGST = (itemPriceAfterDiscount * tax) / 100;
      cgst_amount = totalGST / 2;
      sgst_amount = totalGST / 2;
    } else {
      let totalGST = 0;

      if (this.productDetail.purchaseDiscountAmount > 0) {
        totalGST = itemPriceAfterDiscount * (tax / 100);
        cgst_amount = totalGST / 2;
        sgst_amount = totalGST / 2;
      }
    }

    const finalOfferAmount = parseFloat(
      mrp_before_tax -
        this.productDetail.purchaseDiscountAmount +
        cgst_amount +
        sgst_amount
    );

    let finalObj = {
      total: finalOfferAmount,
      totalTax: (parseFloat(cgst_amount) + parseFloat(sgst_amount)) * quantity
    };

    return finalObj;
  };

  handleOpenAlterStockLoadingMessage = async () => {
    runInAction(() => {
      this.openAlterStockLoadingAlertMessage = true;
    });
  };

  handleCloseAlterStockLoadingMessage = async () => {
    runInAction(() => {
      this.openAlterStockLoadingAlertMessage = false;
    });
  };

  handleOpenMfgSequenceNumberFailureAlert = async () => {
    runInAction(() => {
      this.openMfgSequenceNumberFailureAlert = true;
    });
  };

  handleCloseMfgSequenceNumberFailureAlert = async () => {
    runInAction(() => {
      this.openMfgSequenceNumberFailureAlert = false;
    });
  };

  setDailyRate = (rateObj) => {
    if (rateObj !== null) {
      let rateData = {
        id: rateObj.id,
        metal: rateObj.metal,
        purity: rateObj.purity,
        rateByGram: rateObj.rateByGram
      };
      runInAction(() => {
        this.productDetail.rateData = rateData;
      });
    } else {
      runInAction(() => {
        this.productDetail.rateData = null;
      });
    }
  };

  setStoneWeight = (value) => {
    runInAction(() => {
      this.productDetail.stoneWeight = value;
      this.productDetail.netWeight =
        parseFloat(
          this.productDetail.grossWeight - this.productDetail.stoneWeight
        ) || 0;
    });
  };

  setGrossWeight = (value) => {
    runInAction(() => {
      this.productDetail.grossWeight = value;
      this.productDetail.netWeight =
        parseFloat(
          this.productDetail.grossWeight - this.productDetail.stoneWeight
        ) || 0;
    });
  };

  resetProductsNotProcessed = () => {
    runInAction(() => {
      this.productsNotProcessed = [];
    });
  };

  addProductsNotProcessed = (value) => {
    runInAction(() => {
      this.productsNotProcessed.push(value);
    });
  };

  resetMfgRefreshFlag = () => {
    runInAction(() => {
      this.isManufactureListRefreshed = false;
    });
  };

  handleOpenSerialModel = (isEdit, data) => {
    runInAction(() => {
      this.isSerialEdit = isEdit;
      if (isEdit && data) {
        this.getBatchProductChosenProperties(data);
        this.setProductDetailDataForEdit(data);
        this.setExistingProductDetailData(data);

        this.selectedLevel2Category = data['categoryLevel2'];
        this.selectedLevel3Category = data['categoryLevel3'];
        this.isProductUpdated = isEdit;
        this.isProductComingFromRawMaterials = false;
        this.serialModelOpen = true;
      } else {
        this.productDetail = this.defaultProductDetail;
        this.serialModelOpen = true;
      }
    });
  };

  handleCloseSerialModel = () => {
    runInAction(() => {
      this.serialModelOpen = false;
    });
  };

  setProductDetailsForSerialData = (productDetail) => {
    runInAction(() => {
    this.productDetail = productDetail;
    });
  };

  resetProductDetailsForSerialData = () => {
    runInAction(() => {
    this.productDetail = this.defaultProductDetail;
    });
  };
}

export default new ProductStore();