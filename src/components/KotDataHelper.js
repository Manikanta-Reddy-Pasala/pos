import * as productTxn from './Helpers/ProductTxnHelper';
import * as txnHelper from './Helpers/AllTxnHelper';
import * as audit from './Helpers/AuditHelper';
import * as Bd from '../components/SelectedBusiness';
import * as txnSettings from './Helpers/TransactionSettingsHelper';
import * as numHelper from 'src/components/Helpers/StringAndNumberHelper';

export const saveToSalesTable = async (orderData, items, db) => {
  let insertDoc = {};

  if (orderData) {
    const businessData = await Bd.getBusinessData();

    let saleSettings = await txnSettings.getSalesTransSettingdetails();

    insertDoc.sequenceNumber = orderData.sequenceNumber;

    const seqParts = insertDoc.sequenceNumber.split('/');
    if (
      insertDoc.sequenceNumber.includes('/') &&
      seqParts &&
      seqParts.length > 0
    ) {
      const seqLastPart = seqParts[seqParts.length - 1];
      insertDoc.sortingNumber = parseFloat(seqLastPart);
    } else {
      if (numHelper.containsLettersAndNumbers(insertDoc.sequenceNumber)) {
        insertDoc.sortingNumber =
          numHelper.extractLastNumber(insertDoc.sequenceNumber) || 0;
      } else {
        insertDoc.sortingNumber = insertDoc.sequenceNumber;
      }
    }

    insertDoc.businessId = businessData.businessId;
    insertDoc.businessCity = businessData.businessCity;
    insertDoc.posId = parseFloat(businessData.posDeviceId);

    insertDoc.customer_id = orderData.customer_id;
    insertDoc.customerGSTNo = orderData.customerGSTNo;
    insertDoc.customer_name = orderData.customer_name;
    insertDoc.customer_address = orderData.customer_address;
    insertDoc.customer_phoneNo = orderData.customer_phoneNo;
    insertDoc.customer_city = orderData.customer_city;
    insertDoc.customer_emailId = orderData.customer_emailId;
    insertDoc.customer_pincode = orderData.customer_pincode;
    insertDoc.invoice_number = orderData.invoice_number;
    insertDoc.invoice_date = orderData.invoice_date;
    insertDoc.is_roundoff = orderData.is_roundoff;
    insertDoc.round_amount = orderData.round_amount;
    insertDoc.total_amount = orderData.total_amount;
    insertDoc.balance_amount = orderData.balance_amount;
    insertDoc.payment_type = orderData.payment_type;
    insertDoc.discount_percent = orderData.discount_percent;
    insertDoc.discount_amount = orderData.discount_amount;
    insertDoc.discount_type = orderData.discount_type;
    insertDoc.updatedAt = Date.now();
    insertDoc.packing_charge = orderData.packing_charge;
    insertDoc.shipping_charge = orderData.shipping_charge;

    insertDoc.customerGstType = orderData.customerGSTType;
    insertDoc.customerState = orderData.customerState;
    insertDoc.customerCountry = orderData.customerCountry;
    insertDoc.splitPaymentList = orderData.splitPaymentList;
    insertDoc.sub_total = orderData.subTotal;

    //stock calculation moved to server
    insertDoc.calculateStockAndBalance = true;

    try {
      //employee data
      insertDoc.employeeId = JSON.parse(
        localStorage.getItem('loginDetails')
      ).username;
    } catch (e) {
      console.error(' Error: ', e.message);
    }

    //kot specific fields
    insertDoc.order_type = 'kot';
    insertDoc.waiter_name = orderData.waiter_name;
    insertDoc.waiter_phoneNo = orderData.waiter_phoneNo;
    insertDoc.numberOfPax = orderData.numberOfPax;
    insertDoc.chairsUsedInString = orderData.chairsUsedInString;
    insertDoc.categoryId = orderData.categoryId;
    insertDoc.categoryName = orderData.categoryName;
    insertDoc.tableNumber = orderData.tableNumber;

    insertDoc.bankAccount = orderData.bankAccount;
    insertDoc.bankAccountId = orderData.bankAccountId;
    insertDoc.bankPaymentType = orderData.bankPaymentType;
    insertDoc.paymentReferenceNumber = orderData.paymentReferenceNumber;

    const propertiesToZero = [
      'round_amount',
      'total_amount',
      'balance_amount',
      'discount_percent',
      'discount_amount',
      'packing_charge',
      'shipping_charge',
      'numberOfPax'
    ];

    const propertiesToTrue = ['is_roundoff'];
    const propertiesToFalse = ['isUpdate'];

    [...propertiesToZero, ...propertiesToTrue, ...propertiesToFalse].forEach(
      (property) => {
        if (insertDoc[property] === null || insertDoc[property] === '') {
          insertDoc[property] = propertiesToZero.includes(property)
            ? 0
            : propertiesToTrue.includes(property);
        }
      }
    );

    let item_list = [];

    for (let item of items) {
      let product = {};

      product.product_id = item.product_id;
      product.batch_id = item.batch_id;
      product.unit = item.unit;
      product.hsn = item.hsn;
      product.item_name = item.item_name;
      product.sku = item.sku;
      product.barcode = item.barcode;
      product.mrp = item.mrp;
      product.mrp_before_tax = item.mrp_before_tax;
      product.purchased_price = item.purchased_price;
      product.offer_price = item.offer_price;
      product.size = item.size;
      product.qty = item.qty;
      product.cgst = item.cgst;
      product.sgst = item.sgst;
      product.igst = item.igst;
      product.cgst_amount = item.cgst_amount;
      product.sgst_amount = item.sgst_amount;
      product.igst_amount = item.igst_amount;
      product.cess = item.cess;
      product.amount = item.amount;
      product.isEdit = item.isEdit;
      product.taxIncluded = item.taxIncluded;
      product.roundOff = item.roundOff;
      product.returnedQty = item.returnedQty;
      product.stockQty = item.stockQty;
      product.vendorName = item.vendorName;
      product.vendorPhoneNumber = item.vendorPhoneNumber;
      product.brandName = item.brandName;
      product.categoryLevel2 = item.categoryLevel2;
      product.categoryLevel2DisplayName = item.categoryLevel2DisplayName;
      product.categoryLevel3 = item.categoryLevel3;
      product.categoryLevel3DisplayName = item.categoryLevel3DisplayName;
      product.batchNumber = item.batchNumber;
      product.discount_percent = item.discount_percent;
      product.discount_amount = item.discount_amount;
      product.discount_amount_per_item = item.discount_amount_per_item;
      product.discount_type = item.discount_type;
      product.taxIncluded = item.taxIncluded;
      product.addOnProperties = item.addOnProperties;

      const properties = [
        'batch_id',
        'qty',
        'mrp',
        'purchased_price',
        'offer_price',
        'mrp_before_tax',
        'size',
        'cgst',
        'sgst',
        'igst',
        'cess',
        'cgst_amount',
        'sgst_amount',
        'igst_amount',
        'amount',
        'roundOff',
        'returnedQty',
        'stockQty',
        'discount_amount',
        'discount_percent',
        'discount_amount_per_item'
      ];

      properties.forEach((property) => {
        if (product[property] === null || product[property] === '') {
          product[property] = 0;
        }
      });

      if (product.taxIncluded === null || product.taxIncluded === '') {
        product.taxIncluded = false;
      }

      if (product.isEdit === null || product.isEdit === '') {
        product.isEdit = true;
      }

      let desc = '';

      if (product.addOnProperties && product.addOnProperties.length > 0) {
        desc += 'AddOns: ';
        for (var j = 0; j < product.addOnProperties.length; j++) {
          desc += product.addOnProperties[j].name + ' ';
        }
      }
      product.description = desc;

      item_list.push(product);
    }

    insertDoc.item_list = item_list;

    if (
      !('calculateStockAndBalance' in insertDoc) ||
      !insertDoc.calculateStockAndBalance
    ) {
      //update product qty
       decrementStockQuantity(db, item_list);

      if (saleSettings.updateRawMaterialsStock) {
         decrementRawMaterialsStockQuantity(db, item_list);
      }
    }

    //save to sales table
     txnHelper.saveTxnFromKot(insertDoc, db);

    //save to audit
     audit.addAuditEvent(
      insertDoc.invoice_number,
      insertDoc.sequenceNumber,
      'Kot',
      'Save',
      JSON.stringify(insertDoc),
      '',
      insertDoc.invoice_date
    );

     db.sales
      .insert(insertDoc)
      .then((data) => {
        console.log('data Inserted sales:', data);
      })
      .catch((err) => {
        console.log('Error in Adding Sales:', err);

        //save to audit
        audit.addAuditEvent(
          insertDoc.invoice_number,
          insertDoc.sequenceNumber,
          'Kot',
          'Save',
          JSON.stringify(insertDoc),
          err.message ? err.message : 'KOT Finish Failed',
          insertDoc.invoice_date
        );
      });

    insertDoc.item_list = item_list.reduce((accumulator, current) => {
      const existingItem = accumulator.find(
        (item) => item.product_id === current.product_id
      );

      if (existingItem) {
        existingItem.qty += current.qty;
        existingItem.cgst_amount += current.cgst_amount;
        existingItem.sgst_amount += current.sgst_amount;
        existingItem.igst_amount += current.igst_amount;
        existingItem.amount += current.amount;
      } else {
        accumulator.push(current);
      }

      return accumulator;
    }, []);

     productTxn.saveProductTxnFromSales(insertDoc, db);
  }
};

const decrementStockQuantity = async (db, items) => {
  for (const element of items) {
    if (element.product_id && element.categoryLevel2) {
      await updateProductStock(
        db,
        element.product_id,
        element.qty,
        -1,
        element.batch_id // to handle batch count
      );
    }
  }
};

const updateProductStock = async (db, product_id, qty, operation, batch_id) => {
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
        let updatedQty;

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

        if (parseFloat(operation) < 0) {
          updatedQty = parseFloat(
            parseFloat(oldData.stockQty) - parseFloat(qty)
          );

          if (batchData) {
            batchData.qty = parseFloat(batchData.qty) - parseFloat(qty);
          } else {
            oldData.qty = parseFloat(parseFloat(oldData.qty) - parseFloat(qty));
          }
        } else {
          updatedQty = parseFloat(oldData.stockQty) + parseFloat(qty);

          if (batchData) {
            batchData.qty = parseFloat(batchData.qty) + parseFloat(qty);
          } else {
            oldData.qty = parseFloat(parseFloat(oldData.qty) + parseFloat(qty));
          }
        }

        oldData.stockQty = updatedQty;
        if (index >= 0 && batchData) {
          oldData.batchData[index] = batchData;
        }
        oldData.isStockReOrderQtyReached = oldData.stockQty <= oldData.stockReOrderQty;

        if (isNaN(oldData.qty) || oldData.qty === null) {
          oldData.qty = 0;
        }
        oldData.updatedAt = Date.now();

        return oldData;
      };

      await categoryData.atomicUpdate(changeData);
    }
  }
};

const decrementRawMaterialsStockQuantity = async (db, items) => {
  const businessData = await Bd.getBusinessData();

  for (const element of items) {
    if (element.product_id && element.categoryLevel2) {
      let Query = await db.businessproduct.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { productId: { $eq: element.product_id } }
          ]
        }
      });

      await Query.exec().then((data) => {
        let rawMaterialProductList = [];
        if (
          data &&
          data.rawMaterialData &&
          data.rawMaterialData.rawMaterialList &&
          data.rawMaterialData.rawMaterialList.length > 0
        ) {
          rawMaterialProductList = Array.from(
            data.rawMaterialData.rawMaterialList
          );
        }

        let totalQty = parseFloat(element.qty);

        rawMaterialProductList.forEach(async (element) => {
          if (element.product_id) {
            let newQty = parseFloat(element.qty) * parseFloat(totalQty);
            await updateProductStock(
              db,
              element.product_id,
              element.qtyUnit && element.qtyUnit !== ''
                ? getRawMaterialQuantityByUnit(element, newQty)
                : newQty || 0,
              -1,
              element.batch_id // to handle batch count
            );
          }
        });
      });
    }
  }
};

const getRawMaterialQuantityByUnit = (product, newQty) => {
  let qty = 0;
  if (product.primaryUnit && product.qtyUnit === product.primaryUnit.fullName) {
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