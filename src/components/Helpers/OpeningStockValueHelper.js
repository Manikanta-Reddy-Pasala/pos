import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';
import OpeningStockProduct from './Classes/OpeningStockProduct';

// todo : date logic is not covered for this version
export const getOpeningStockForProduct = async (productId, batchId, date) => {
  let openingStockValue = 0;
  const db = await Db.get();

  const businessData = await Bd.getBusinessData();

  const query = db.businessproduct.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { productId: { $eq: productId } }
      ]
    }
  });

  await query.exec().then(async (data) => {
    if (data) {
      //if given product is batch product
      openingStockValue = calculateOpeningStockValue(data, batchId);
    }
  });

  return openingStockValue;
};

export const getOpeningStockForProductsByCategory = async (categoryLevel3) => {
  const productList = [];

  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  const query = await db.businessproduct.find({
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { 'categoryLevel3.name': { $eq: categoryLevel3 } }
      ]
    }
  });

  await query.exec().then(async (data) => {
    if (!data) {
      console.log('Internal Server Error');
      return;
    }

    data.forEach((product) => {
      console.log(product);

      let openingStockValue = 0;
      const batchdata = product.batchData;

      if (batchdata && batchdata.length > 0) {
        let totalOpeningStockValue = 0;
        batchdata.forEach((batch) => {
          openingStockValue = calculateOpeningStockValue(product, batch.id);

          totalOpeningStockValue = totalOpeningStockValue + openingStockValue;
        });

        //add to list
        const productObj = new OpeningStockProduct(
          product.name,
          product.productId,
          totalOpeningStockValue
        );

        productList.push(productObj);
      } else {
        openingStockValue = calculateOpeningStockValue(product);

        //add to list
        const productInstance = new OpeningStockProduct(
          product.name,
          product.productId,
          openingStockValue
        );

        productList.push(productInstance);
      }
    });
  });
  return productList;
};

export const getOpeningStockQtyForProductsByCategory = async (
  categoryLevel3,
  warehouse
) => {
  const productList = [];

  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let txnFilterArray = [];
  if (warehouse !== undefined && warehouse !== '' && warehouse !== null) {
    const warehouseFilter = {
      warehouse: { $eq: warehouse }
    };
    txnFilterArray.push(warehouseFilter);
  }

  let query;

  if (txnFilterArray.length > 0) {
    query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { 'categoryLevel3.name': { $eq: categoryLevel3 } },
          {
            $or: txnFilterArray
          }
        ]
      }
    });
  } else {
    query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { 'categoryLevel3.name': { $eq: categoryLevel3 } }
        ]
      }
    });
  }

  await query.exec().then(async (data) => {
    if (!data) {
      console.log('Internal Server Error');
      return;
    }

    data.forEach((product) => {
      let openingStockQty = 0;
      const batchdata = product.batchData;

      if (batchdata && batchdata.length > 0) {
        let totalOpeningStockQtyValue = 0;
        batchdata.forEach((batch) => {
          openingStockQty = calculateOpeningStockQty(product, batch.id);

          totalOpeningStockQtyValue =
            totalOpeningStockQtyValue + openingStockQty;
        });

        //add to list
        const productObj = new OpeningStockProduct(
          product.name,
          product.productId,
          totalOpeningStockQtyValue
        );

        productList.push(productObj);
      } else {
        openingStockQty = calculateOpeningStockQty(product);

        //add to list
        const productInstance = new OpeningStockProduct(
          product.name,
          product.productId,
          openingStockQty
        );

        productList.push(productInstance);
      }
    });
  });
  return productList;
};

export const getOpeningStockQtyForProducts = async (warehouse) => {
  const productList = [];

  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let query;

  if (warehouse) {
    query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            warehouseData: { $eq: warehouse }
          }
        ]
      }
    });
  } else {
    query = await db.businessproduct.find({
      selector: {
        $and: [{ businessId: { $eq: businessData.businessId } }]
      }
    });
  }

  await query.exec().then(async (data) => {
    if (!data) {
      console.log('Internal Server Error');
      return;
    }

    data.forEach((product) => {
      let openingStockQty = 0;
      const batchdata = product.batchData;

      if (batchdata && batchdata.length > 0) {
        let totalOpeningStockQtyValue = 0;
        batchdata.forEach((batch) => {
          openingStockQty = calculateOpeningStockQty(product, batch.id);

          totalOpeningStockQtyValue =
            totalOpeningStockQtyValue + openingStockQty;
        });

        //add to list
        const productObj = new OpeningStockProduct(
          product.name,
          product.productId,
          totalOpeningStockQtyValue,
          product.salePrice,
          product.purchasedPrice
        );

        productList.push(productObj);
      } else {
        openingStockQty = calculateOpeningStockQty(product);

        //add to list
        const productInstance = new OpeningStockProduct(
          product.name,
          product.productId,
          openingStockQty,
          product.salePrice,
          product.purchasedPrice
        );

        productList.push(productInstance);
      }
    });
  });
  return productList;
};

export const getOpeningStockQtyForProduct = async (productId, warehouse) => {
  const productList = [];

  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let query;

  if (warehouse) {
    query = await db.businessproduct.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            warehouseData: { $eq: warehouse }
          },
          {productId: {$eq: productId}}
        ]
      }
    });
  } else {
    query = await db.businessproduct.find({
      selector: {
        $and: [{ businessId: { $eq: businessData.businessId } },
          {productId: {$eq: productId}}]
      }
    });
  }

  await query.exec().then(async (data) => {
    if (!data) {
      console.log('Internal Server Error');
      return;
    }

    data.forEach((product) => {
      let openingStockQty = 0;
      const batchdata = product.batchData;

      if (batchdata && batchdata.length > 0) {
        let totalOpeningStockQtyValue = 0;
        batchdata.forEach((batch) => {
          openingStockQty = calculateOpeningStockQty(product, batch.id);

          totalOpeningStockQtyValue =
            totalOpeningStockQtyValue + openingStockQty;
        });

        //add to list
        const productObj = new OpeningStockProduct(
          product.name,
          product.productId,
          totalOpeningStockQtyValue
        );

        productList.push(productObj);
      } else {
        openingStockQty = calculateOpeningStockQty(product);

        //add to list
        const productInstance = new OpeningStockProduct(
          product.name,
          product.productId,
          openingStockQty
        );

        productList.push(productInstance);
      }
    });
  });
  return productList;
};

const calculateOpeningStockValue = (data, batchId) => {
  let openingStockValue = 0;
  let openingStockQty = 0;
  let salePrice = 0;
  if (batchId) {
    let batchDataArray = data.batchData;

    if (batchDataArray) {
      let batchData = batchDataArray.find((obj) => obj.id === batchId);

      salePrice = parseFloat(batchData.salePrice) || 0;
      openingStockQty = parseFloat(batchData.openingStockQty) || 0;
    }
  } else {
    // if given product is normal product
    salePrice = parseFloat(data.salePrice) || 0;
    openingStockQty = parseFloat(data.openingStockQty) || 0;
  }

  if (data.taxIncluded) {
    const cgst = data.cgst || 0;
    const sgst = data.cgst || 0;

    salePrice = salePrice / (1 + (cgst + sgst) / 100);
  }

  openingStockValue = openingStockQty * salePrice;

  return openingStockValue;
};

const calculateOpeningStockQty = (data, batchId) => {
  let openingStockQty = 0;
  if (batchId) {
    let batchDataArray = data.batchData;

    if (batchDataArray) {
      let batchData = batchDataArray.find((obj) => obj.id === batchId);

      openingStockQty = parseFloat(batchData.openingStockQty) || 0;
    }
  } else {
    openingStockQty = parseFloat(data.openingStockQty) || 0;
  }

  return openingStockQty;
};