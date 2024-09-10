import {
  action,
  observable,
  makeObservable,
  runInAction,
  toJS,
  computed
} from 'mobx';
import ProductGroupData from './classes/ProductGroup';
import ProductGroupListData from './classes/ProductGroupItemList';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';

class ProductGroupStore {
  // Product Group

  productGroupOpenDialog = false;
  selectedProduct = {};
  OpenBatchList = false;
  productGroupFocusLastIndex = false;
  addNewRowEnabled = false;
  FocusLastIndex = false;

  isProductGroupUpdate = false;

  productGroupList = [];

  isProductGroupList = false;

  openProductGroupModal = () => {
    this.isProductGroupUpdate = false;
    this.productGroupOpenDialog = true;
    this.productGroupData = this.productGroupDataDefault;
    this.productGroupList = [];
  };

  handleProductGroupModalClose = () => {
    this.productGroupOpenDialog = false;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('pgpr');
    this.productGroupData.groupId = `${id}${appId}${timestamp}`;
    this.productGroupData.businessId = businessData.businessId;
    this.productGroupData.businessCity = businessData.businessCity;

    this.productGroupData.posId = parseFloat(businessData.posDeviceId);
    this.productGroupData.updatedAt = Date.now();

    //code to save raw materials details
    let filteredArray = [];

    for (let item of this.productGroupList) {
      if (item.item_name === '') {
        continue;
      }

      if (item.batch_id === null || item.batch_id === '') {
        item.batch_id = 0;
      }

      if (item.qty === null || item.qty === '') {
        item.qty = 0;
      }

      if (item.freeQty === null || item.freeQty === '') {
        item.freeQty = 0;
      }

      if (item.mrp === null || item.mrp === '') {
        item.mrp = 0;
      }

      if (item.purchased_price === null || item.purchased_price === '') {
        item.purchased_price = 0;
      }

      if (item.mrp_before_tax === null || item.mrp_before_tax === '') {
        item.mrp_before_tax = 0;
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

      if (item.amount === null || item.anount === '') {
        item.anount = 0;
      }

      if (item.isEdit === null || item.isEdit === '') {
        item.isEdit = true;
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

      filteredArray.push(item);
    }

    this.productGroupData.itemList = filteredArray;

    let InsertDoc = this.productGroupData;

    await db.productgroup
      .insert(InsertDoc)
      .then(() => {
        console.log('this.productGroupData:: data Inserted' + InsertDoc);
        this.isProductGroupList = true;
        this.isProductGroupUpdate = false;
      })
      .catch((err) => {
        console.log('this.productGroupData:: data insertion Failed::', err);
      });

    this.productGroupOpenDialog = false;
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.productgroup
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { groupId: { $eq: this.productGroupData.groupId } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No group data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.groupId = oldTxnData.groupId;
        newTxnData.updatedAt = Date.now();
        newTxnData.groupName = this.productGroupData.groupName;
        newTxnData.isSyncedToServer = this.productGroupData.isSyncedToServer;
        newTxnData.subTotal = this.productGroupData.subTotal;
        newTxnData.total = this.productGroupData.total;

        //code to save raw materials details
        let filteredArray = [];

        for (let item of this.productGroupList) {
          if (item.item_name === '') {
            continue;
          }

          if (item.batch_id === null || item.batch_id === '') {
            item.batch_id = 0;
          }

          if (item.qty === null || item.qty === '') {
            item.qty = 0;
          }

          if (item.freeQty === null || item.freeQty === '') {
            item.freeQty = 0;
          }

          if (item.mrp === null || item.mrp === '') {
            item.mrp = 0;
          }

          if (item.purchased_price === null || item.purchased_price === '') {
            item.purchased_price = 0;
          }

          if (item.mrp_before_tax === null || item.mrp_before_tax === '') {
            item.mrp_before_tax = 0;
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

          if (item.amount === null || item.anount === '') {
            item.anount = 0;
          }

          if (item.isEdit === null || item.isEdit === '') {
            item.isEdit = true;
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

          filteredArray.push(item);
        }

        newTxnData.itemList = filteredArray;

        await db.productgroup
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { groupId: { $eq: this.productGroupData.groupId } }
              ]
            }
          })
          .update({
            $set: {
              groupName: newTxnData.groupName,
              itemList: newTxnData.itemList,
              updatedAt: newTxnData.updatedAt,
              isSyncedToServer: newTxnData.isSyncedToServer,
              subTotal: newTxnData.subTotal,
              total: newTxnData.total
            }
          })
          .then(async () => {
            console.log('product group update success');
            this.productGroupData = this.productGroupDataDefault;
            this.isProductGroupUpdate = true;
            this.isProductGroupList = true;
          });
      })
      .catch((error) => {
        console.log('product group update Failed ' + error);
      });

    this.productGroupOpenDialog = false;
  };

  selectProductGroupProduct = (productItem, index) => {
    // console.log('SELECT PRODUCT', productItem, index);
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
      rateData
    } = productItem;

    if (!this.productGroupList) {
      return;
    }
    if (!this.productGroupList[index]) {
      return;
    }

    let salePercent = '';

    // adding same product to purchase
    let existingPurchaseProduct;
    if (!(batchData.length > 1)) {
      existingPurchaseProduct = this.productGroupList.find((product, index) =>
        this.findProduct(product, index, productItem)
      );
    }

    if (existingPurchaseProduct) {
      this.productGroupList[existingPurchaseProduct.index] =
        existingPurchaseProduct;
      this.setProductGroupQuantity(
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
            this.selectedProduct = productItem;
            this.selectedIndex = index;
            this.OpenBatchList = true;
          } else if (batchData.length === 1) {
            let firstBatchData = batchData[0];
            this.productGroupList[index].mrp = parseFloat(
              firstBatchData.salePrice
            );
            if (firstBatchData.offerPrice > 0) {
              this.productGroupList[index].offer_price = parseFloat(
                firstBatchData.offerPrice
              );
            } else {
              this.productGroupList[index].offer_price = parseFloat(
                firstBatchData.salePrice
              );
            }
            this.productGroupList[index].originalMrpWithoutConversionQty =
              parseFloat(firstBatchData.salePrice);
            this.productGroupList[index].finalMRPPrice = parseFloat(
              firstBatchData.finalMRPPrice
            );
            this.productGroupList[index].batch_id = parseFloat(
              firstBatchData.id
            );
            this.productGroupList[index].qty = 1;
            this.productGroupList[index].mfDate = firstBatchData.mfDate;
            this.productGroupList[index].expiryDate = firstBatchData.expiryDate;
            this.productGroupList[index].rack = firstBatchData.rack;
            this.productGroupList[index].warehouseData =
              firstBatchData.warehouseData;

            salePercent = firstBatchData.saleDiscountPercent;
            setTimeout(() => {
              this.addNewProductGroupItem(true, false);
            }, 200);
          }
        } else {
          runInAction(() => {
            this.productGroupList[index].mrp = parseFloat(salePrice);
            if (offerPrice > 0) {
              this.productGroupList[index].offer_price = parseFloat(offerPrice);
            } else {
              this.productGroupList[index].offer_price = parseFloat(salePrice);
            }

            this.productGroupList[index].originalMrpWithoutConversionQty =
              parseFloat(salePrice);
            this.productGroupList[index].purchased_price =
              parseFloat(purchasedPrice);
            this.productGroupList[index].finalMRPPrice =
              parseFloat(finalMRPPrice);

            this.productGroupList[index].vendorName = vendorName;
            this.productGroupList[index].vendorPhoneNumber = vendorPhoneNumber;
            this.productGroupList[index].barcode = barcode;
            this.productGroupList[index].mfDate = mfDate;
            this.productGroupList[index].expiryDate = expiryDate;
            this.productGroupList[index].rack = rack;
            this.productGroupList[index].warehouseData = warehouseData;
            this.productGroupList[index].modelNo = modelNo;
          });
        }

        this.productGroupList[index].item_name = name;
        this.productGroupList[index].product_id = productId;
        this.productGroupList[index].description = description;   
        this.productGroupList[index].cess = cess;
        this.productGroupList[index].taxIncluded = taxIncluded;
        this.productGroupList[index].hsn = hsn;
        this.productGroupList[index].taxType = taxType;

        // categories
        this.productGroupList[index].categoryLevel2 = categoryLevel2.name;
        this.productGroupList[index].categoryLevel2DisplayName =
          categoryLevel2.displayName;
        this.productGroupList[index].categoryLevel3 = categoryLevel3.name;
        this.productGroupList[index].categoryLevel3DisplayName =
          categoryLevel3.displayName;

        this.productGroupList[index].brandName = brandName;

        this.productGroupList[index].stockQty = stockQty;
        this.productGroupList[index].freeStockQty = freeQty;

        if (cgst > 0) {
          this.productGroupList[index].cgst = cgst;
        }
        if (sgst > 0) {
          this.productGroupList[index].sgst = sgst;
        }

        this.productGroupList[index].mfDate = mfDate;
        this.productGroupList[index].expiryDate = expiryDate;
        this.productGroupList[index].rack = rack;
        this.productGroupList[index].warehouseData = warehouseData;

        // units addition
        this.productGroupList[index].primaryUnit = primaryUnit;
        this.productGroupList[index].secondaryUnit = secondaryUnit;
        this.productGroupList[index].units =
          units && units.length > 2 ? units.slice(0, 2) : units;
        this.productGroupList[index].unitConversionQty = unitConversionQty;
      });

      this.setProductGroupQuantity(index, 1);
      this.setProductGroupItemDiscount(index, saleDiscountPercent);
    }
  };

  resetSingleProduct = (index) => {
    this.productGroupList[index] = new ProductGroupListData().defaultValues();
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

  selectProductGroupFromBatch = (batchItem, currentProductRowIndexToReset) => {
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

    let existingPurchaseProduct;
    existingPurchaseProduct = this.productGroupList.find((product, index) =>
      this.findBatchProduct(product, index, batchItem)
    );

    if (existingPurchaseProduct) {
      this.productGroupList[existingPurchaseProduct.index] =
        existingPurchaseProduct;
      this.setProductGroupQuantity(
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
        this.productGroupList[this.selectedIndex].mrp = parseFloat(salePrice);
        if (offerPrice > 0) {
          this.productGroupList[this.selectedIndex].offer_price =
            parseFloat(offerPrice);
        } else {
          this.productGroupList[this.selectedIndex].offer_price =
            parseFloat(salePrice);
        }
        this.productGroupList[
          this.selectedIndex
        ].originalMrpWithoutConversionQty = parseFloat(salePrice);
        this.productGroupList[this.selectedIndex].purchased_price =
          parseFloat(purchasedPrice);

        this.productGroupList[this.selectedIndex].finalMRPPrice =
          parseFloat(purchasedPrice);

        this.productGroupList[this.selectedIndex].stockQty = qty;

        this.productGroupList[this.selectedIndex].freeStockQty = freeQty;

        this.productGroupList[this.selectedIndex].batch_id = batchItem.id;

        this.productGroupList[this.selectedIndex].vendorName =
          batchItem.vendorName;
        this.productGroupList[this.selectedIndex].vendorPhoneNumber =
          batchItem.vendorPhoneNumber;

        this.productGroupList[this.selectedIndex].mfDate = mfDate;
        this.productGroupList[this.selectedIndex].expiryDate = expiryDate;
        this.productGroupList[this.selectedIndex].rack = rack;
        this.productGroupList[this.selectedIndex].warehouseData = warehouseData;
        this.productGroupList[this.selectedIndex].modelNo = modelNo;
        this.productGroupList[this.selectedIndex].barcode = barcode;
      });

      this.setProductGroupQuantity(this.selectedIndex, 1);
      this.setProductGroupItemDiscount(this.selectedIndex, saleDiscountPercent);
      this.handleBatchListModalClose();
      this.addNewProductGroupItem(true, true, true);
    }
  };

  addNewProductGroupItem = (status, focusIndexStatus, isBarcode) => {
    if (status) {
      this.addNewRowEnabled = true;
    }

    var lastItem;

    if (this.productGroupList && this.productGroupList.length > 0) {
      lastItem = this.productGroupList[this.productGroupList.length - 1]; // Getting last element
    }
    if (lastItem) {
      if (lastItem.qty > 0) {
        this.productGroupList.push(new ProductGroupListData().defaultValues());
        this.enabledRow =
          this.productGroupList.length > 0
            ? this.productGroupList.length - 1
            : 0;

        this.setEditTable(
          this.enabledRow,
          true,
          focusIndexStatus ? Number('8' + this.enabledRow) : ''
        );
      }
    } else {
      this.productGroupList.push(new ProductGroupListData().defaultValues());
      this.enabledRow =
        this.productGroupList.length > 0 ? this.productGroupList.length - 1 : 0;

      console.log('set edit table: add New time Edit');
      this.setProductGroupEditTable(
        this.enabledRow,
        true,
        focusIndexStatus ? Number('8' + this.enabledRow) : ''
      );
    }
  };

  setEditTable = (index, value, lastIndexFocusIndex) => {
    // this.enabledRow = index;
    if (this.productGroupList && this.productGroupList.length > 0) {
      for (var i = 0; i < this.productGroupList.length; i++) {
        if (index === i) {
          this.productGroupList[i].isEdit = true;
        } else {
          this.productGroupList[i].isEdit = false;
        }
      }
    }
    if (index && value) {
      if (this.productGroupList[index]) {
        this.productGroupList[index].isEdit = value;
      }
    }
    this.FocusLastIndex = lastIndexFocusIndex;
  };

  handleBatchListModalClose = (val) => {
    this.OpenBatchList = false;
    if (val) {
      this.productGroupList[this.selectedIndex].purchased_price = parseFloat(
        val.purchasedPrice
      );

      // TODO: Add logic here
    }
    runInAction(() => {
      this.selectedProduct = {};
    });
  };

  setProductGroupEditTable = (index, value, lastIndexFocusIndex) => {
    this.enabledRow = index;
    if (this.productGroupList && this.productGroupList.length > 0) {
      for (var i = 0; i < this.productGroupList.length; i++) {
        if (index === i) {
          this.productGroupList[i].isEdit = true;
        } else {
          this.productGroupList[i].isEdit = false;
        }
      }
    }

    if (index && value) {
      if (this.productGroupList[index]) {
        this.productGroupList[index].isEdit = value;
      }
    }
    this.productGroupFocusLastIndex = lastIndexFocusIndex;
  };

  setProductGroupQuantity = (index, value) => {
    if (!this.productGroupList) {
      return;
    }

    if (!this.productGroupList[index]) {
      return;
    }

    if (this.productGroupList[index].product_id === '') {
      return;
    }

    if (parseFloat(value) > 0) {
      runInAction(() => {
        this.productGroupList[index].qty = value ? parseFloat(value) : '';
      });
      this.getProductGroupAmount(index);
    } else {
      this.productGroupList[index].qty = '';
    }
  };

  setProductGroupFreeQuantity = (index, value) => {
    if (!this.productGroupList) {
      return;
    }
    if (!this.productGroupList[index]) {
      return;
    }

    if (this.productGroupList[index].product_id === '') {
      return;
    }

    if (parseFloat(value) > 0) {
      runInAction(() => {
        this.productGroupList[index].freeQty = value ? parseFloat(value) : '';
      });
    } else {
      this.productGroupList[index].freeQty = '';
    }
  };

  setProductGroupSalePrice = (index, value) => {
    if (!this.productGroupList) {
      return;
    }
    if (!this.productGroupList[index]) {
      return;
    }

    if (this.productGroupList[index].product_id === '') {
      return;
    }

    if (parseFloat(value) >= 0) {
      this.productGroupList[index].offer_price = parseFloat(value);
      this.productGroupList[index].mrp = parseFloat(value);
      this.productGroupList[index].originalMrpWithoutConversionQty =
        parseFloat(value);

      if (this.productGroupList[index].qty === 0) {
        this.productGroupList[index].qty = 1;
      }

      if (this.productGroupList[index].qty) {
        this.getProductGroupAmount(index);
      }
    } else {
      this.productGroupList[index].mrp_before_tax = value
        ? parseFloat(value)
        : '';
      this.productGroupList[index].mrp = value ? parseFloat(value) : '';
      this.productGroupList[index].originalMrpWithoutConversionQty = value
        ? parseFloat(value)
        : '';
    }
  };

  setProductGroupItemUnit = (index, value) => {
    if (!this.productGroupList) {
      return;
    }
    if (!this.productGroupList[index]) {
      return;
    }

    if (value === this.productGroupList[index].qtyUnit) {
      return;
    }

    this.productGroupList[index].qtyUnit = value;

    if (
      this.productGroupList[index].secondaryUnit &&
      this.productGroupList[index].secondaryUnit.fullName ===
        this.productGroupList[index].qtyUnit
    ) {
      this.productGroupList[index].purchased_price =
        this.productGroupList[index].purchased_price /
        this.productGroupList[index].unitConversionQty;
    } else if (
      this.productGroupList[index].primaryUnit &&
      this.productGroupList[index].primaryUnit.fullName ===
        this.productGroupList[index].qtyUnit
    ) {
      this.productGroupList[index].purchased_price =
        this.productGroupList[index].originalPurchasePriceWithoutConversionQty;
    } else {
      this.productGroupList[index].purchased_price =
        this.productGroupList[index].originalPurchasePriceWithoutConversionQty;
    }
    this.getProductGroupAmount(index);
  };

  setProductGroupItemDiscount = (index, value) => {
    if (!this.productGroupList) {
      return;
    }
    if (!this.productGroupList[index]) {
      return;
    }

    this.productGroupList[index].discount_percent = value
      ? parseFloat(value)
      : '';
    this.productGroupList[index].discount_type = 'percentage';

    if (this.productGroupList[index].discount_percent === '') {
      this.productGroupList[index].discount_amount = '';
      this.productGroupList[index].discount_amount_per_item = '';
    }
    this.getProductGroupAmount(index);
  };

  getProductGroupAmount = async (index) => {
    // GST should be calculated after applying the discount product level
    await this.calculateTaxAndDiscountValue(index);

    if (!this.productGroupList) {
      return;
    }
    if (!this.productGroupList[index]) {
      return;
    }
    const quantity = this.productGroupList[index].qty;

    let cgst_amount = 0;
    let sgst_amount = 0;
    let igst_amount = 0;
    let cess = 0;
    cgst_amount = parseFloat(this.productGroupList[index].cgst_amount || 0);
    sgst_amount = parseFloat(this.productGroupList[index].sgst_amount || 0);
    igst_amount = parseFloat(this.productGroupList[index].igst_amount || 0);
    cess = parseFloat(this.productGroupList[index].cess || 0);

    const discount_amount = parseFloat(
      this.productGroupList[index].discount_amount || 0
    );
    const mrp_before_tax = parseFloat(
      this.productGroupList[index].mrp_before_tax
    );

    const finalAmount = parseFloat(
      mrp_before_tax * quantity -
        discount_amount +
        cgst_amount +
        sgst_amount +
        igst_amount +
        cess * quantity
    );

    this.productGroupList[index].amount =
      Math.round(finalAmount * 100) / 100 || 0;
  };

  calculateTaxAndDiscountValue = async (index) => {
    const mrp = parseFloat(this.productGroupList[index].mrp || 0);
    const quantity = this.productGroupList[index].qty;

    let tax =
      (parseFloat(this.productGroupList[index].cgst) || 0) +
      (parseFloat(this.productGroupList[index].sgst) || 0);
    let igst_tax = parseFloat(this.productGroupList[index].igst || 0);

    const taxIncluded = this.productGroupList[index].taxIncluded;

    if (!mrp || mrp === 0 || !quantity || quantity === 0) {
      return 0;
    }

    let itemPrice = mrp;

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
    let mrp_before_tax = 0;

    if (taxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
      totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
    }

    mrp_before_tax = itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

    let totalItemPriceBeforeTax = parseFloat(mrp_before_tax);

    if (this.productGroupList[index].discount_type) {
      totalItemPriceBeforeTax = mrp_before_tax * quantity;

      discountAmount = parseFloat(
        this.getItemDiscountAmount(index, totalItemPriceBeforeTax)
      );
    }

    // price before tax
    this.productGroupList[index].mrp_before_tax = parseFloat(mrp_before_tax);

    let discountAmountPerProduct =
      parseFloat(discountAmount) / parseFloat(quantity);

    //per item dicount is removed from per item
    let itemPriceAfterDiscount = 0;

    itemPriceAfterDiscount = mrp_before_tax - discountAmountPerProduct;

    if (discountAmountPerProduct === 0) {
      this.productGroupList[index].cgst_amount = (totalGST / 2) * quantity;
      this.productGroupList[index].sgst_amount = (totalGST / 2) * quantity;
      this.productGroupList[index].igst_amount = totalIGST * quantity;
    }

    await this.calculateTaxAmount(
      index,
      itemPriceAfterDiscount,
      discountAmount
    );
  };

  calculateTaxAmount = (index, itemPriceAfterDiscount, discountAmount) => {
    let tax =
      (parseFloat(this.productGroupList[index].cgst) || 0) +
      (parseFloat(this.productGroupList[index].sgst) || 0);
    let igst_tax = parseFloat(this.productGroupList[index].igst || 0);
    const quantity = this.productGroupList[index].qty;
    const taxIncluded = this.productGroupList[index].taxIncluded;

    if (!taxIncluded) {
      const totalGST = (itemPriceAfterDiscount * quantity * tax) / 100;
      this.productGroupList[index].cgst_amount = totalGST / 2;
      this.productGroupList[index].sgst_amount = totalGST / 2;
      this.productGroupList[index].igst_amount =
        (itemPriceAfterDiscount * quantity * igst_tax) / 100;
    } else {
      let totalGST = 0;
      let amount = 0;

      if (discountAmount > 0) {
        totalGST = itemPriceAfterDiscount * quantity * (tax / 100);
        this.productGroupList[index].cgst_amount = totalGST / 2;
        this.productGroupList[index].sgst_amount = totalGST / 2;

        amount = itemPriceAfterDiscount * (igst_tax / 100);
        this.productGroupList[index].igst_amount =
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

  deleteProductGroupItem = (index) => {
    this.productGroupList.splice(index, 1);
    this.enabledRow = index > 0 ? index - 1 : 0;

    console.log('set edit table: delete New time Edit');
    if (this.productGroupList.length > 0) {
      this.setProductGroupEditTable(
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
    const discountType = this.productGroupList[index].discount_type;
    if (discountType === 'percentage') {
      let percentage = this.productGroupList[index].discount_percent || 0;

      discountAmount = parseFloat((totalPrice * percentage) / 100 || 0).toFixed(
        2
      );

      this.productGroupList[index].discount_amount_per_item =
        parseFloat(discountAmount) / this.productGroupList[index].qty;
    } else if (discountType === 'amount') {
      discountAmount =
        this.productGroupList[index].discount_amount_per_item *
          this.productGroupList[index].qty || 0;
      this.productGroupList[index].discount_percent =
        Math.round(((discountAmount / totalPrice) * 100 || 0) * 100) / 100;
    }

    this.productGroupList[index].discount_amount = parseFloat(discountAmount);

    return discountAmount;
  };

  get getTotalAmount() {
    if (!this.productGroupList) {
      return 0;
    }

    let totalGST = 0;
    const returnValue = this.productGroupList.reduce((a, b) => {
      const amount = toJS(b.amount) || 0;
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

    this.productGroupData.subTotal = parseFloat(returnValue).toFixed(2);

    totalAmount = parseFloat(this.productGroupData.subTotal);

    runInAction(() => {
      this.productGroupData.total = parseFloat(totalAmount).toFixed(2);
    });

    return parseFloat(this.productGroupData.total).toFixed(2);
  }

  setProductGroupName = (value) => {
    this.productGroupData.groupName = value;
  };

  getProductGroupCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.productgroup
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isProductGroupList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.productgroup
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { groupId: { $eq: item.groupId } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No product group data is found so cannot update any information
          return;
        }

        this.productGroupData.businessCity = data.businessCity;
        this.productGroupData.businessId = data.businessId;
        this.productGroupData.groupName = data.groupName;
        this.productGroupData.groupId = data.groupId;
        this.productGroupData.isSyncedToServer = data.isSyncedToServer;
        this.productGroupData.itemList = data.itemList;
        this.productGroupList = data.itemList;

        this.isProductGroupUpdate = true;
        this.productGroupOpenDialog = true;
      })
      .catch((error) => {
        console.log('product group update Failed ' + error);
      });
  };

  deleteProductGroupData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.productgroup.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { groupId: { $eq: item.groupId } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('product group data removed' + data);
        runInAction(() => {
          this.productGroupData = this.productGroupDataDefault;
          this.isProductGroupList = true;
        });
      })
      .catch((error) => {
        console.log('product group deletion Failed ' + error);
      });
  };

  constructor() {
    this.productGroupData = new ProductGroupData().defaultValues();
    this.productGroupDataDefault = new ProductGroupData().defaultValues();
    this.singleProductGroupData = new ProductGroupListData().defaultValues();

    makeObservable(this, {
      singleProductGroupData: observable,
      deleteProductGroupItem: action,
      productGroupOpenDialog: observable,
      openProductGroupModal: action,
      handleProductGroupModalClose: action,
      isProductGroupUpdate: observable,
      getAddRowEnabled: action,
      setAddRowEnabled: action,
      productGroupList: observable,
      getTotalAmount: computed,
      isProductGroupList: observable,
      productGroupData: observable
    });
  }
}

export default new ProductGroupStore();