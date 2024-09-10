import {
  action,
  observable,
  makeObservable,
  runInAction,
  toJS,
  computed
} from 'mobx';
import RawMaterialData from './classes/RawMaterialData';
import RawMaterialListData from './classes/RawMaterialListData';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

class RawMaterialsStore {
  // Raw Material Management

  rawMaterialOpenDialog = false;
  selectedRawMaterialProduct = {};
  OpenBatchList = false;
  rawMaterialFocusLastIndex = false;
  addNewRowEnabled = false;
  FocusLastIndex = false;

  isRawMaterialUpdate = false;

  rawMaterialsList = [];
  expenseList = [];
  productDetail = {};
  isEdit = false;
  rawMaterialSingleOpenDialog = false;

  openRawMaterialModal = (productDetail) => {
    this.isRawMaterialUpdate = false;
    this.rawMaterialOpenDialog = true;
    this.rawMaterialsList = [];
    this.productDetail = productDetail;

    this.rawMaterialData = productDetail.rawMaterialData;

    if (this.rawMaterialData === null || this.rawMaterialData === undefined) {
      let rMData = {
        rawMaterialList: [],
        total: 0,
        subTotal: 0,
        directExpenses: []
      };

      productDetail.rawMaterialData = rMData;
      this.rawMaterialData = rMData;
    }

    if (
      this.rawMaterialData.rawMaterialList === undefined ||
      this.rawMaterialData.rawMaterialList === null
    ) {
      this.rawMaterialsList = [];
    }

    if (
      productDetail.rawMaterialData.rawMaterialList &&
      productDetail.rawMaterialData.rawMaterialList.length > 0
    ) {
      this.rawMaterialsList = productDetail.rawMaterialData.rawMaterialList;
    } else {
      this.rawMaterialsList.push(new RawMaterialListData().defaultValues());
    }

    this.prepareExpenseList();
  };

  openNewRawMAterialModal = () => {
    this.isRawMaterialUpdate = false;
    this.rawMaterialSingleOpenDialog = true;
    this.rawMaterialsList = [];
    this.productDetail = {};
    this.isEdit = false;
    this.expenseList = [];
  };

  setRawMaterialProduct = (productDetail) => {
    this.isRawMaterialUpdate = false;
    this.rawMaterialOpenDialog = true;
    this.rawMaterialsList = [];
    this.productDetail = productDetail;
    this.expenseList = [];

    this.rawMaterialData = productDetail.rawMaterialData;

    if (this.rawMaterialData === null || this.rawMaterialData === undefined) {
      let rMData = {
        rawMaterialList: [],
        total: 0,
        subTotal: 0,
        directExpenses: []
      };

      productDetail.rawMaterialData = rMData;
      this.rawMaterialData = rMData;
    }

    if (
      this.rawMaterialData.rawMaterialList === undefined ||
      this.rawMaterialData.rawMaterialList === null
    ) {
      this.rawMaterialsList = [];
    }

    if (
      productDetail.rawMaterialData.rawMaterialList &&
      productDetail.rawMaterialData.rawMaterialList.length > 0
    ) {
      this.rawMaterialsList = productDetail.rawMaterialData.rawMaterialList;
    } else {
      this.rawMaterialsList.push(new RawMaterialListData().defaultValues());
    }

    this.prepareExpenseList();
  };

  resetRawMaterialProduct = () => {
    this.rawMaterialsList = [];
    this.productDetail = {};
    this.expenseList = [];
  };

  editRawMAterialModal = (productDetail) => {
    this.isRawMaterialUpdate = true;
    this.rawMaterialSingleOpenDialog = true;
    this.rawMaterialsList = [];
    this.expenseList = [];
    this.productDetail = productDetail;
    this.isEdit = true;

    this.rawMaterialData = productDetail.rawMaterialData;

    if (
      this.rawMaterialData.rawMaterialList === undefined ||
      this.rawMaterialData.rawMaterialList === null
    ) {
      this.rawMaterialsList = [];
    }

    if (
      productDetail.rawMaterialData.rawMaterialList &&
      productDetail.rawMaterialData.rawMaterialList.length > 0
    ) {
      this.rawMaterialsList = productDetail.rawMaterialData.rawMaterialList;
    } else {
      this.rawMaterialsList.push(new RawMaterialListData().defaultValues());
    }

    this.prepareExpenseList();
  };

  prepareExpenseList = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.expenseList = [];
    const query = db.manufacturedirectexpenses.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      let expList = [];
      let list = [];
      if (data && data.length > 0) {
        list = data.map((item) => item.toJSON());
      }
      for (let item of list) {
        let expData = {
          name: '',
          amount: 0
        };
        expData.name = item.name;
        expList.push(expData);
      }
      if (
        this.rawMaterialData.directExpenses &&
        this.rawMaterialData.directExpenses.length > 0
      ) {
        for (let item of this.rawMaterialData.directExpenses) {
          for (let exp of expList) {
            if (exp.name === item.name) {
              exp.amount = item.amount;
            }
          }
        }
      }

      this.expenseList = expList;
    });
  };

  handleRawMaterialModalClose = () => {
    this.rawMaterialOpenDialog = false;
  };

  handleRawMaterialSingleModalClose = () => {
    this.rawMaterialSingleOpenDialog = false;
  };

  selectRawMaterialProduct = (productItem, index) => {
    // console.log('SELECT PRODUCT', productItem, index);
    if (!productItem) {
      return;
    }
    const {
      name,
      description,
      hsn,
      purchaseCgst,
      purchaseSgst,
      purchaseIgst,
      purchaseCess,
      purchaseTaxIncluded,
      purchaseTaxType,
      productId,
      purchasedPrice,
      batchData,
      stockQty,
      categoryLevel2,
      categoryLevel3,
      brandName,
      unitConversionQty,
      freeQty,
      primaryUnit,
      secondaryUnit,
      units,
      mfDate,
      expiryDate,
      rack,
      warehouseData
    } = productItem;

    if (!this.rawMaterialsList) {
      return;
    }
    if (!this.rawMaterialsList[index]) {
      return;
    }

    let purchasePercent = '';

    // adding same product to purchase
    let existingPurchaseProduct;
    if (!(batchData.length > 1)) {
      existingPurchaseProduct = this.rawMaterialsList.find((product, index) =>
        this.findProduct(product, index, productItem)
      );
    }

    if (existingPurchaseProduct) {
      this.rawMaterialsList[existingPurchaseProduct.index] =
        existingPurchaseProduct;
      this.setRawMaterialQuantity(
        existingPurchaseProduct.index,
        existingPurchaseProduct.qty
      );
      this.resetSingleProduct(index);
      setTimeout(() => {
        this.FocusLastIndex = Number('4' + index);
      }, 100);
    } else {
      runInAction(() => {
        if (batchData.length > 0) {
          if (batchData.length > 1) {
            this.selectedRawMaterialProduct = productItem;
            this.selectedIndex = index;
            this.OpenBatchList = true;
          } else if (batchData.length === 1) {
            let firstBatchData = batchData[0];
            this.rawMaterialsList[index].purchased_price = parseFloat(
              firstBatchData.purchasedPrice
            );
            this.rawMaterialsList[
              index
            ].originalPurchasePriceWithoutConversionQty = parseFloat(
              firstBatchData.purchasedPrice
            );
            this.rawMaterialsList[index].batch_id = parseFloat(
              firstBatchData.id
            );
            this.rawMaterialsList[index].qty = 1;
            this.rawMaterialsList[index].mfDate = firstBatchData.mfDate;
            this.rawMaterialsList[index].expiryDate = firstBatchData.expiryDate;
            this.rawMaterialsList[index].rack = firstBatchData.rack;
            this.rawMaterialsList[index].warehouseData =
              firstBatchData.warehouseData;

            purchasePercent = firstBatchData.purchaseDiscountPercent;
            setTimeout(() => {
              this.addNewRawMaterialItem(true, false);
            }, 200);
          }
        } else {
          this.rawMaterialsList[index].purchased_price =
            parseFloat(purchasedPrice);
          this.rawMaterialsList[
            index
          ].originalPurchasePriceWithoutConversionQty =
            parseFloat(purchasedPrice);
          setTimeout(() => {
            this.addNewRawMaterialItem(true, false);
          }, 200);
        }

        this.rawMaterialsList[index].item_name = name;
        this.rawMaterialsList[index].product_id = productId;
        this.rawMaterialsList[index].description = description;
        this.rawMaterialsList[index].cgst = purchaseCgst;
        this.rawMaterialsList[index].sgst = purchaseSgst;
        this.rawMaterialsList[index].igst = purchaseIgst;
        this.rawMaterialsList[index].cess = purchaseCess;
        this.rawMaterialsList[index].taxIncluded = purchaseTaxIncluded;
        this.rawMaterialsList[index].hsn = hsn;
        this.rawMaterialsList[index].taxType = purchaseTaxType;

        // categories
        this.rawMaterialsList[index].categoryLevel2 = categoryLevel2.name;
        this.rawMaterialsList[index].categoryLevel2DisplayName =
          categoryLevel2.displayName;
        this.rawMaterialsList[index].categoryLevel3 = categoryLevel3.name;
        this.rawMaterialsList[index].categoryLevel3DisplayName =
          categoryLevel3.displayName;

        this.rawMaterialsList[index].brandName = brandName;

        this.rawMaterialsList[index].stockQty = stockQty;
        this.rawMaterialsList[index].freeStockQty = freeQty;

        console.log(this.rawMaterialsList[index]);

        if (purchaseCgst > 0) {
          this.rawMaterialsList[index].cgst = purchaseCgst;
        }
        if (purchaseSgst > 0) {
          this.rawMaterialsList[index].sgst = purchaseSgst;
        }

        this.rawMaterialsList[index].mfDate = mfDate;
        this.rawMaterialsList[index].expiryDate = expiryDate;
        this.rawMaterialsList[index].rack = rack;
        this.rawMaterialsList[index].warehouseData = warehouseData;

        // units addition
        this.rawMaterialsList[index].primaryUnit = primaryUnit;
        this.rawMaterialsList[index].secondaryUnit = secondaryUnit;
        this.rawMaterialsList[index].units =
          units && units.length > 2 ? units.slice(0, 2) : units;
        this.rawMaterialsList[index].unitConversionQty = unitConversionQty;
      });

      this.setRawMaterialQuantity(index, 1);
      this.setRawMaterialItemDiscount(index, purchasePercent);
    }
  };

  resetSingleProduct = (index) => {
    this.rawMaterialsList[index] = new RawMaterialListData().defaultValues();
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

  selectRawMaterialFromBatch = (batchItem, currentProductRowIndexToReset) => {
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
      warehouseData
    } = batchItem;

    let existingPurchaseProduct;
    existingPurchaseProduct = this.rawMaterialsList.find((product, index) =>
      this.findBatchProduct(product, index, batchItem)
    );

    if (existingPurchaseProduct) {
      this.rawMaterialsList[existingPurchaseProduct.index] =
        existingPurchaseProduct;
      this.setRawMaterialQuantity(
        existingPurchaseProduct.index,
        existingPurchaseProduct.qty
      );
      this.resetSingleProduct(currentProductRowIndexToReset);
      setTimeout(() => {
        this.FocusLastIndex = Number('4' + currentProductRowIndexToReset);
      }, 100);
      this.handleBatchListModalClose();
    } else {
      runInAction(() => {
        this.rawMaterialsList[this.selectedIndex].purchased_price =
          parseFloat(purchasedPrice);

        this.rawMaterialsList[this.selectedIndex].batch_id = batchItem.id;

        this.rawMaterialsList[this.selectedIndex].mfDate = mfDate;
        this.rawMaterialsList[this.selectedIndex].expiryDate = expiryDate;
        this.rawMaterialsList[this.selectedIndex].rack = rack;
        this.rawMaterialsList[this.selectedIndex].warehouseData = warehouseData;
        this.rawMaterialsList[this.selectedIndex].freeStockQty = freeQty;
      });

      this.setRawMaterialQuantity(this.selectedIndex, 1);
      this.setRawMaterialItemDiscount(
        this.selectedIndex,
        purchaseDiscountPercent
      );
      this.handleBatchListModalClose();
      this.addNewRawMaterialItem(true, true, true);
    }
  };

  addNewRawMaterialItem = (status, focusIndexStatus, isBarcode) => {
    if (status) {
      this.addNewRowEnabled = true;
    }

    var lastItem;

    if (this.rawMaterialsList && this.rawMaterialsList.length > 0) {
      lastItem = this.rawMaterialsList[this.rawMaterialsList.length - 1]; // Getting last element
    }
    if (lastItem) {
      if (lastItem.qty > 0) {
        this.rawMaterialsList.push(new RawMaterialListData().defaultValues());
        this.enabledRow =
          this.rawMaterialsList.length > 0
            ? this.rawMaterialsList.length - 1
            : 0;

        this.setEditTable(
          this.enabledRow,
          true,
          focusIndexStatus ? Number('8' + this.enabledRow) : ''
        );
      }
    } else {
      this.rawMaterialsList.push(new RawMaterialListData().defaultValues());
      this.enabledRow =
        this.rawMaterialsList.length > 0 ? this.rawMaterialsList.length - 1 : 0;

      console.log('set edit table: add New time Edit');
      this.setRawMaterialEditTable(
        this.enabledRow,
        true,
        focusIndexStatus ? Number('8' + this.enabledRow) : ''
      );
    }
  };

  setEditTable = (index, value, lastIndexFocusIndex) => {
    // this.enabledRow = index;
    if (this.rawMaterialsList && this.rawMaterialsList.length > 0) {
      for (var i = 0; i < this.rawMaterialsList.length; i++) {
        if (index === i) {
          this.rawMaterialsList[i].isEdit = true;
        } else {
          this.rawMaterialsList[i].isEdit = false;
        }
      }
    }
    if (index && value) {
      if (this.rawMaterialsList[index]) {
        this.rawMaterialsList[index].isEdit = value;
      }
    }
    this.FocusLastIndex = lastIndexFocusIndex;
  };

  handleBatchListModalClose = (val) => {
    this.OpenBatchList = false;
    if (val) {
      this.rawMaterialsList[this.selectedIndex].purchased_price = parseFloat(
        val.purchasedPrice
      );

      // TODO: Add logic here
    }
    runInAction(() => {
      this.selectedProduct = {};
    });
  };

  setRawMaterialEditTable = (index, value, lastIndexFocusIndex) => {
    this.enabledRow = index;
    if (this.rawMaterialsList && this.rawMaterialsList.length > 0) {
      for (var i = 0; i < this.rawMaterialsList.length; i++) {
        if (index === i) {
          this.rawMaterialsList[i].isEdit = true;
        } else {
          this.rawMaterialsList[i].isEdit = false;
        }
      }
    }

    if (index && value) {
      if (this.rawMaterialsList[index]) {
        this.rawMaterialsList[index].isEdit = value;
      }
    }
    this.rawMaterialFocusLastIndex = lastIndexFocusIndex;
  };

  setRawMaterialQuantity = (index, value) => {
    if (!this.rawMaterialsList) {
      return;
    }

    if (!this.rawMaterialsList[index]) {
      return;
    }

    if (this.rawMaterialsList[index].product_id === '') {
      return;
    }

    if (parseFloat(value) > 0) {
      runInAction(() => {
        this.rawMaterialsList[index].qty = value ? parseFloat(value) : '';
      });
      this.getRawMaterialEstimateAmount(index);
    } else {
      this.rawMaterialsList[index].qty = '';
    }
  };

  setRawMaterialFreeQuantity = (index, value) => {
    if (!this.rawMaterialsList) {
      return;
    }
    if (!this.rawMaterialsList[index]) {
      return;
    }

    if (this.rawMaterialsList[index].product_id === '') {
      return;
    }

    if (parseFloat(value) > 0) {
      runInAction(() => {
        this.rawMaterialsList[index].freeQty = value ? parseFloat(value) : '';
      });
    } else {
      this.rawMaterialsList[index].freeQty = '';
    }
  };

  setRawMaterialPurchasedPrice = (index, value) => {
    if (!this.rawMaterialsList) {
      return;
    }
    if (!this.rawMaterialsList[index]) {
      return;
    }

    if (this.rawMaterialsList[index].product_id === '') {
      return;
    }

    if (parseFloat(value) >= 0) {
      this.rawMaterialsList[index].purchased_price_before_tax =
        parseFloat(value);
      this.rawMaterialsList[index].purchased_price = parseFloat(value);

      if (this.rawMaterialsList[index].qty === 0) {
        this.rawMaterialsList[index].qty = 1;
      }

      if (this.rawMaterialsList[index].qty) {
        this.getRawMaterialEstimateAmount(index);
      }
    } else {
      this.rawMaterialsList[index].purchased_price_before_tax = value
        ? parseFloat(value)
        : '';
      this.rawMaterialsList[index].purchased_price = value
        ? parseFloat(value)
        : '';
    }
  };

  setRawMaterialItemUnit = (index, value) => {
    if (!this.rawMaterialsList) {
      return;
    }
    if (!this.rawMaterialsList[index]) {
      return;
    }

    if (value === this.rawMaterialsList[index].qtyUnit) {
      return;
    }

    this.rawMaterialsList[index].qtyUnit = value;

    if (
      this.rawMaterialsList[index].secondaryUnit &&
      this.rawMaterialsList[index].secondaryUnit.fullName ===
        this.rawMaterialsList[index].qtyUnit
    ) {
      this.rawMaterialsList[index].purchased_price =
        this.rawMaterialsList[index].purchased_price /
        this.rawMaterialsList[index].unitConversionQty;
    } else if (
      this.rawMaterialsList[index].primaryUnit &&
      this.rawMaterialsList[index].primaryUnit.fullName ===
        this.rawMaterialsList[index].qtyUnit
    ) {
      this.rawMaterialsList[index].purchased_price =
        this.rawMaterialsList[index].originalPurchasePriceWithoutConversionQty;
    } else {
      this.rawMaterialsList[index].purchased_price =
        this.rawMaterialsList[index].originalPurchasePriceWithoutConversionQty;
    }
    this.getRawMaterialEstimateAmount(index);
  };

  setRawMaterialItemDiscount = (index, value) => {
    if (!this.rawMaterialsList) {
      return;
    }
    if (!this.rawMaterialsList[index]) {
      return;
    }

    this.rawMaterialsList[index].discount_percent = value
      ? parseFloat(value)
      : '';
    this.rawMaterialsList[index].discount_type = 'percentage';

    if (this.rawMaterialsList[index].discount_percent === '') {
      this.rawMaterialsList[index].discount_amount = '';
      this.rawMaterialsList[index].discount_amount_per_item = '';
    }
    this.getRawMaterialEstimateAmount(index);
  };

  getRawMaterialEstimateAmount = async (index) => {
    // GST should be calculated after applying the discount product level
    await this.calculateTaxAndDiscountValue(index);

    if (!this.rawMaterialsList) {
      return;
    }
    if (!this.rawMaterialsList[index]) {
      return;
    }
    const quantity = this.rawMaterialsList[index].qty;

    let cgst_amount = 0;
    let sgst_amount = 0;
    let igst_amount = 0;
    let cess = 0;
    cgst_amount = parseFloat(this.rawMaterialsList[index].cgst_amount || 0);
    sgst_amount = parseFloat(this.rawMaterialsList[index].sgst_amount || 0);
    igst_amount = parseFloat(this.rawMaterialsList[index].igst_amount || 0);
    cess = parseFloat(this.rawMaterialsList[index].cess || 0);

    const discount_amount = parseFloat(
      this.rawMaterialsList[index].discount_amount || 0
    );
    const purchased_price_before_tax = parseFloat(
      this.rawMaterialsList[index].purchased_price_before_tax
    );

    const finalAmount = parseFloat(
      purchased_price_before_tax * quantity -
        discount_amount +
        cgst_amount +
        sgst_amount +
        igst_amount +
        cess * quantity
    );

    this.rawMaterialsList[index].estimate =
      Math.round(finalAmount * 100) / 100 || 0;
  };

  calculateTaxAndDiscountValue = async (index) => {
    const purchased_price = parseFloat(
      this.rawMaterialsList[index].purchased_price || 0
    );
    const quantity = this.rawMaterialsList[index].qty;

    let tax =
      (parseFloat(this.rawMaterialsList[index].cgst) || 0) +
      (parseFloat(this.rawMaterialsList[index].sgst) || 0);
    let igst_tax = parseFloat(this.rawMaterialsList[index].igst || 0);

    const taxIncluded = this.rawMaterialsList[index].taxIncluded;

    if (
      !purchased_price ||
      purchased_price === 0 ||
      !quantity ||
      quantity === 0
    ) {
      return 0;
    }

    let itemPrice = purchased_price;

    let discountAmount = 0;

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

    if (this.rawMaterialsList[index].discount_type) {
      totalItemPriceBeforeTax = purchased_price_before_tax * quantity;

      discountAmount = parseFloat(
        this.getItemDiscountAmount(index, totalItemPriceBeforeTax)
      );
    }

    // price before tax
    this.rawMaterialsList[index].purchased_price_before_tax = parseFloat(
      purchased_price_before_tax
    );

    let discountAmountPerProduct =
      parseFloat(discountAmount) / parseFloat(quantity);

    //per item dicount is removed from per item
    let itemPriceAfterDiscount = 0;

    itemPriceAfterDiscount =
      purchased_price_before_tax - discountAmountPerProduct;

    if (discountAmountPerProduct === 0) {
      this.rawMaterialsList[index].cgst_amount = (totalGST / 2) * quantity;
      this.rawMaterialsList[index].sgst_amount = (totalGST / 2) * quantity;
      this.rawMaterialsList[index].igst_amount = totalIGST * quantity;
    }

    await this.calculateTaxAmount(
      index,
      itemPriceAfterDiscount,
      discountAmount
    );
  };

  calculateTaxAmount = (index, itemPriceAfterDiscount, discountAmount) => {
    let tax =
      (parseFloat(this.rawMaterialsList[index].cgst) || 0) +
      (parseFloat(this.rawMaterialsList[index].sgst) || 0);
    let igst_tax = parseFloat(this.rawMaterialsList[index].igst || 0);
    const quantity = this.rawMaterialsList[index].qty;
    const taxIncluded = this.rawMaterialsList[index].taxIncluded;

    if (!taxIncluded) {
      const totalGST = (itemPriceAfterDiscount * quantity * tax) / 100;
      this.rawMaterialsList[index].cgst_amount = totalGST / 2;
      this.rawMaterialsList[index].sgst_amount = totalGST / 2;
      this.rawMaterialsList[index].igst_amount =
        (itemPriceAfterDiscount * quantity * igst_tax) / 100;
    } else {
      let totalGST = 0;
      let amount = 0;

      if (discountAmount > 0) {
        totalGST = itemPriceAfterDiscount * quantity * (tax / 100);
        this.rawMaterialsList[index].cgst_amount = totalGST / 2;
        this.rawMaterialsList[index].sgst_amount = totalGST / 2;

        amount = itemPriceAfterDiscount * (igst_tax / 100);
        this.rawMaterialsList[index].igst_amount =
          Math.round(amount * 100) / 100;
      }
    }
  };

  getAddRowEnabled = () => {
    return this.addNewRowEnabled;
  };

  setAddRowEnabled = (value) => {
    this.addNewRowEnabled = value;
  };

  deleteRawMaterialItem = (index) => {
    this.rawMaterialsList.splice(index, 1);
    this.enabledRow = index > 0 ? index - 1 : 0;

    console.log('set edit table: delete New time Edit');
    if (this.rawMaterialsList.length > 0) {
      this.setRawMaterialEditTable(
        this.enabledRow,
        true,
        Number('8' + this.enabledRow)
      );
    } else {
      this.FocusLastIndex = 18;
    }
  };

  getItemDiscountAmount = (index, totalPrice) => {
    let discountAmount = 0;
    const discountType = this.rawMaterialsList[index].discount_type;
    if (discountType === 'percentage') {
      let percentage = this.rawMaterialsList[index].discount_percent || 0;

      discountAmount = parseFloat((totalPrice * percentage) / 100 || 0).toFixed(
        2
      );

      this.rawMaterialsList[index].discount_amount_per_item =
        parseFloat(discountAmount) / this.rawMaterialsList[index].qty;
    } else if (discountType === 'amount') {
      discountAmount =
        this.rawMaterialsList[index].discount_amount_per_item *
          this.rawMaterialsList[index].qty || 0;
      this.rawMaterialsList[index].discount_percent =
        Math.round(((discountAmount / totalPrice) * 100 || 0) * 100) / 100;
    }

    this.rawMaterialsList[index].discount_amount = parseFloat(discountAmount);

    return discountAmount;
  };

  setDirectExpense = (value, index) => {
    if (this.expenseList) {
      this.expenseList[index].amount = value ? parseFloat(value) : '';
    }
  };

  get getTotalAmount() {
    if (!this.rawMaterialsList) {
      return 0;
    }

    let totalGST = 0;
    const returnValue = this.rawMaterialsList.reduce((a, b) => {
      const amount = toJS(b.estimate) || 0;
      const cgst_amount = toJS(b.cgst_amount) || 0;
      const sgst_amount = toJS(b.sgst_amount) || 0;

      if (!Number.isNaN(amount)) {
        a = parseFloat(a) + parseFloat(amount);
      }

      totalGST =
        parseFloat(totalGST) +
        parseFloat(cgst_amount) +
        parseFloat(sgst_amount);

      return a;
    }, 0);

    let totalAmount = 0;

    this.rawMaterialData.subTotal = parseFloat(returnValue).toFixed(2);

    totalAmount = parseFloat(this.rawMaterialData.subTotal);

    if (this.expenseList && this.expenseList.length > 0) {
      for (let item of this.expenseList) {
        if (!isNaN(item.amount)) {
          totalAmount += parseFloat(item.amount) || 0;
        }
      }
    }

    runInAction(() => {
      this.rawMaterialData.total = parseFloat(totalAmount).toFixed(2);
    });

    return parseFloat(this.rawMaterialData.total).toFixed(2);
  }

  constructor() {
    this.rawMaterialData = new RawMaterialData().defaultValues();
    this.singleRawMaterialData = new RawMaterialListData().defaultValues();

    makeObservable(this, {
      singleRawMaterialData: observable,
      deleteRawMaterialItem: action,
      rawMaterialOpenDialog: observable,
      openRawMaterialModal: action,
      handleRawMaterialModalClose: action,
      isRawMaterialUpdate: observable,
      getAddRowEnabled: action,
      setAddRowEnabled: action,
      rawMaterialsList: observable,
      expenseList: observable,
      getTotalAmount: computed,
      productDetail: observable,
      isEdit: observable,
      rawMaterialSingleOpenDialog: observable
    });
  }
}

export default new RawMaterialsStore();