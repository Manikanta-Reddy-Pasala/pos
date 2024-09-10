import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

export const getProductAutoCompleteList = async (value) => {
  let productList = [];
  if (value) {
    const db = await Db.get();
    let finalValue = value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    var regexp = new RegExp('^.*' + finalValue + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.businessproduct
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                {
                  $and: [{ name: { $regex: regexp } }]
                },
                {
                  $and: [{ shortCutCode: { $regex: regexp } }]
                }
              ]
            }
          ]
        }
      })
      .limit(100)
      // .sort()
      .exec()
      .then((documents) => {
        let dataList = documents.map((item) => item.toJSON());

        for (let data of dataList) {
          if (data.batchData.length > 0) {
            let firstBatchData = data.batchData[0];
            data.salePrice = parseFloat(firstBatchData.salePrice);
            data.purchasedPrice = parseFloat(firstBatchData.purchasedPrice);

            if (firstBatchData.offerPrice > 0) {
              data.offerPrice = parseFloat(firstBatchData.offerPrice);
            } else {
              data.offerPrice = parseFloat(firstBatchData.salePrice);
            }
          }

          if (data.offerPrice === 0) {
            data.offerPrice = parseFloat(data.salePrice);
          }

          let finalSalePrice = parseFloat(data.salePrice);
          let finalPurchasedPrice = parseFloat(data.purchasedPrice);
          let finalOfferPrice = parseFloat(data.offerPrice);
          let unitQty = parseFloat(data.unitQty);

          if (unitQty && unitQty > 1) {
            finalPurchasedPrice = finalPurchasedPrice * unitQty;
            finalSalePrice = finalSalePrice * unitQty;
            finalOfferPrice = finalOfferPrice * unitQty;

            data.salePrice = finalSalePrice;
            data.purchasedPrice = finalPurchasedPrice;
            data.offerPrice = finalOfferPrice;
          }
        }
        productList = dataList;
      });
    return productList;
  }
  return productList;
};

export const getRawMaterialProductAutoCompleteList = async (value) => {
  let productList = [];
  if (value) {
    const db = await Db.get();
    let finalValue = value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    var regexp = new RegExp('^.*' + finalValue + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.businessproduct
      .find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                {
                  name: { $regex: regexp }
                },
                { 'categoryLevel2.name': { $eq: 'raw_materials_level2' } },
                { 'categoryLevel3.name': { $eq: 'raw_materials_level3' } }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                {
                  name: { $regex: regexp }
                },
                { 'categoryLevel2.name': { $eq: 'food_raw_materials_level2' } },
                { 'categoryLevel3.name': { $eq: 'food_raw_materials_level3' } }
              ]
            }
          ]
        }
      })
      .limit(100)
      // .sort()
      .exec()
      .then((documents) => {
        let dataList = documents.map((item) => item.toJSON());

        for (let data of dataList) {
          if (data.batchData.length > 0) {
            let firstBatchData = data.batchData[0];
            data.salePrice = parseFloat(firstBatchData.salePrice);
            data.purchasedPrice = parseFloat(firstBatchData.purchasedPrice);

            if (firstBatchData.offerPrice > 0) {
              data.offerPrice = parseFloat(firstBatchData.offerPrice);
            } else {
              data.offerPrice = parseFloat(firstBatchData.salePrice);
            }
          }

          if (data.offerPrice === 0) {
            data.offerPrice = parseFloat(data.salePrice);
          }

          let finalSalePrice = parseFloat(data.salePrice);
          let finalPurchasedPrice = parseFloat(data.purchasedPrice);
          let finalOfferPrice = parseFloat(data.offerPrice);
          let unitQty = parseFloat(data.unitQty);

          if (unitQty && unitQty > 1) {
            finalPurchasedPrice = finalPurchasedPrice * unitQty;
            finalSalePrice = finalSalePrice * unitQty;
            finalOfferPrice = finalOfferPrice * unitQty;

            data.salePrice = finalSalePrice;
            data.purchasedPrice = finalPurchasedPrice;
            data.offerPrice = finalOfferPrice;
          }
        }
        productList = dataList;
      });
    return productList;
  }
  return productList;
};

export const getManufactureProductAutoCompleteList = async (value) => {
  let productList = [];
  if (value) {
    const db = await Db.get();
    let finalValue = value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    var regexp = new RegExp('^.*' + finalValue + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.businessproduct
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              name: { $regex: regexp }
            }
          ]
        }
      })
      .limit(100)
      // .sort()
      .exec()
      .then((documents) => {
        let dataList = documents.map((item) => item.toJSON());

        for (let data of dataList) {
          if (
            data.rawMaterialData &&
            data.rawMaterialData.rawMaterialList &&
            data.rawMaterialData.rawMaterialList.length > 0
          ) {
            if (data.batchData.length > 0) {
              let firstBatchData = data.batchData[0];
              data.salePrice = parseFloat(firstBatchData.salePrice);
              data.purchasedPrice = parseFloat(firstBatchData.purchasedPrice);

              if (firstBatchData.offerPrice > 0) {
                data.offerPrice = parseFloat(firstBatchData.offerPrice);
              } else {
                data.offerPrice = parseFloat(firstBatchData.salePrice);
              }
            }

            if (data.offerPrice === 0) {
              data.offerPrice = parseFloat(data.salePrice);
            }

            let finalSalePrice = parseFloat(data.salePrice);
            let finalPurchasedPrice = parseFloat(data.purchasedPrice);
            let finalOfferPrice = parseFloat(data.offerPrice);
            let unitQty = parseFloat(data.unitQty);

            if (unitQty && unitQty > 1) {
              finalPurchasedPrice = finalPurchasedPrice * unitQty;
              finalSalePrice = finalSalePrice * unitQty;
              finalOfferPrice = finalOfferPrice * unitQty;

              data.salePrice = finalSalePrice;
              data.purchasedPrice = finalPurchasedPrice;
              data.offerPrice = finalOfferPrice;
            }
            productList.push(data);
          }
        }
      });
    return productList;
  }
  return productList;
};

export const getKOTAutoCompleteList = async (value, menuType) => {
  let productList = [];
  if (value) {
    const db = await Db.get();
    let finalValue = value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    var regexp = new RegExp('^.*' + finalValue + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.businessproduct
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                {
                  $and: [{ name: { $regex: regexp } }]
                },
                {
                  $and: [{ shortCutCode: { $regex: regexp } }]
                }
              ]
            }
          ]
        }
      })
      .limit(100)
      // .sort()
      .exec()
      .then((documents) => {
        let dataList = documents.map((item) => item.toJSON());

        for (let data of dataList) {
          if (data.batchData.length > 0 && menuType !== '') {
            for (let firstBatchData of data.batchData) {
              if (firstBatchData.batchNumber === menuType) {
                data.salePrice = parseFloat(firstBatchData.salePrice);
                data.purchasedPrice = parseFloat(firstBatchData.purchasedPrice);
                data.batch_id = firstBatchData.id;
                data.batchNumber = firstBatchData.batchNumber;
                data.saleDiscountPercent = firstBatchData.saleDiscountPercent;

                if (firstBatchData.offerPrice > 0) {
                  data.offerPrice = parseFloat(firstBatchData.offerPrice);
                } else {
                  data.offerPrice = parseFloat(firstBatchData.salePrice);
                }
                break;
              }
            }
          }

          if (data.offerPrice === 0) {
            data.offerPrice = parseFloat(data.salePrice);
          }

          let finalSalePrice = parseFloat(data.salePrice);
          let finalPurchasedPrice = parseFloat(data.purchasedPrice);
          let finalOfferPrice = parseFloat(data.offerPrice);
          let unitQty = parseFloat(data.unitQty);

          if (unitQty && unitQty > 1) {
            finalPurchasedPrice = finalPurchasedPrice * unitQty;
            finalSalePrice = finalSalePrice * unitQty;
            finalOfferPrice = finalOfferPrice * unitQty;

            data.salePrice = finalSalePrice;
            data.purchasedPrice = finalPurchasedPrice;
            data.offerPrice = finalOfferPrice;
          }
        }
        productList = dataList;
      });
    return productList;
  }
  return productList;
};

export const getCompleteProductDataAutoCompleteList = async (value) => {
  let productList = [];
  if (value) {
    const db = await Db.get();
    let finalValue = value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    var regexp = new RegExp('^.*' + finalValue + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.businessproduct
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              name: { $regex: regexp }
            }
          ]
        }
      })
      .limit(100)
      // .sort()
      .exec()
      .then((documents) => {
        let dataList = documents.map((item) => item.toJSON());

        productList = dataList;
      });
    return productList;
  }
  return productList;
};