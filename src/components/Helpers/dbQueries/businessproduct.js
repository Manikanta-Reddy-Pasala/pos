import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import ProductDetail from 'src/Mobx/Stores/classes/ProductDetail';
import * as audit from 'src/components/Helpers/AuditHelper';
import * as commons from './commonLogic';

export const isProductAvailable = async (selector) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();
  let isAvailable = false;

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  let Query = await db.businessproduct.findOne({
    selector
  });

  await Query.exec().then((data) => {
    if (data) {
      isAvailable = true;
    }
  });
  return isAvailable;
};

export const getAllProductsDataWithRawMaterials = async (skip, limit) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();
  let response;

  if (skip && limit) {
    let Query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            'rawMaterialData.total': { $gt: 0 }
          }
        ]
      },
      skip: skip,
      limit: limit
    });

    await Query.exec().then((data) => {
      if (data) {
        response = data.map((item) => item.toJSON());
      }
    });
  } else {
    let Query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            'rawMaterialData.total': { $gt: 0 }
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (data) {
        response = data.map((item) => item.toJSON());
      }
    });
  }
  return response;
};

export const getAllProductsDataWithRawMaterialsBySearch = async (
  name,
  skip,
  limit
) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();
  let response;

  if (skip && limit) {
    let Query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { name: { $regex: name } },
          {
            'rawMaterialData.total': { $gt: 0 }
          }
        ]
      },
      skip: skip,
      limit: limit
    });

    await Query.exec().then((data) => {
      if (data) {
        response = data.map((item) => item.toJSON());
      }
    });
  } else {
    let Query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { name: { $regex: name } },
          {
            'rawMaterialData.total': { $gt: 0 }
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (data) {
        response = data.map((item) => item.toJSON());
      }
    });
  }
  return response;
};

export const getAllProductsData = async (selector) => {
  const db = await Db.get();

  let productList = [];

  let Query = await db.businessproduct.find({ selector });

  await Query.exec().then((data) => {
    let dataList = data.map((item) => item.toJSON());

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
};

export const getProductDataById = async (selector) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });
  let product = {};

  let Query = await db.businessproduct.findOne({ selector });

  await Query.exec().then((data) => {
    product = data;
  });
  return product;
};

export const getProductData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.businessproduct.findOne({ selector })
    : await db.businessproduct.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getAllProductsDataWithSerial = async (skip, limit) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();
  let response;

  if (skip && limit) {
    let Query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            serialData: { $ne: [] }
          }
        ]
      },
      skip: skip,
      limit: limit
    });

    await Query.exec().then((data) => {
      if (data) {
        response = data.map((item) => item.toJSON());
      }
    });
  } else {
    let Query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            serialData: { $ne: [] }
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (data) {
        response = data.map((item) => item.toJSON());
      }
    });
  }
  return response;
};

export const getAllProductsDataWithSerialBySearch = async (
  name,
  skip,
  limit
) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();
  let response;

  if (skip && limit) {
    let Query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { name: { $regex: name } },
          {
            serialData: { $ne: [] }
          }
        ]
      },
      skip: skip,
      limit: limit
    });

    await Query.exec().then((data) => {
      if (data) {
        response = data.map((item) => item.toJSON());
      }
    });
  } else {
    let Query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { name: { $regex: name } },
          {
            serialData: { $ne: [] }
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (data) {
        response = data.map((item) => item.toJSON());
      }
    });
  }
  return response;
};

export const updateProduct = async (data) => {

  let productDetail = JSON.parse(JSON.stringify(data));
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
    formatDate(new Date(thisYear, thisMonth, today))
  );

  InsertDoc.calculateStockAndBalance = true;
  try {
    await db.businessproduct.atomicUpsert(InsertDoc);
    return true;
  } catch (error) {
    console.log('Product update Failed ' + error);
    audit.addAuditEvent(
      InsertDoc.productId,
      '',
      'Product',
      userAction,
      JSON.stringify(InsertDoc),
      error.message,
      formatDate(new Date(thisYear, thisMonth, today))
    );
    return false;
  }
};

const formatDate = (date) => {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
};