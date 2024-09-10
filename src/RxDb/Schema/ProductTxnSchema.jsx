import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const ProductTxnSchema = {
  title: 'Product Txn Schema',
  description: 'Product Txn Schema',
  version: 9,
  type: 'object',
  properties: {
    id: {
      // ['txnId', 'productId'], separator "|"
      type: 'string',
      primary: true
    },
    sequenceNumber: {
      type: 'string'
    },
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    txnId: {
      type: 'string'
    },
    txnType: {
      type: 'string'
    },
    txnDate: {
      type: 'string',
      format: 'date',
      default: ''
    },
    // details of the supplier/vendor
    vendorId: {
      type: 'string'
    },
    vendorName: {
      type: 'string'
    },
    vendorPhoneNumber: {
      type: 'string'
    },
    vendorGSTNo: {
      type: 'string'
    },
    vendorGstType: {
      type: 'string'
    },
    productId: {
      type: 'string'
    },
    categoryLevel2: {
      type: 'string'
    },
    categoryLevel2DisplayName: {
      type: 'string'
    },
    categoryLevel3: {
      type: 'string'
    },
    categoryLevel3DisplayName: {
      type: 'string'
    },
    productName: {
      type: 'string'
    },
    brandName: {
      type: 'string'
    },
    purchasedPrice: {
      type: 'number'
    },
    purchased_price_before_tax: {
      type: 'number'
    },
    reverseChargeEnable: {
      type: 'boolean'
    },
    reverseChargeValue: {
      type: 'number'
    },
    salePrice: {
      type: 'number'
    },
    offerPrice: {
      type: 'number'
    },
    mrp_before_tax: {
      type: 'number'
    },
    // stock qty at the time of txn
    stockQty: {
      type: 'number'
    },
    amount: {
      type: 'number'
    },
    taxAmount: {
      type: 'number'
    },
    taxIncluded: {
      type: 'boolean'
    },
    taxType: {
      type: 'string'
    },
    cgst: {
      type: 'number'
    },
    sgst: {
      type: 'number'
    },
    igst: {
      type: 'number'
    },
    cess: {
      type: 'number'
    },
    cgst_amount: {
      type: 'number'
    },
    sgst_amount: {
      type: 'number'
    },
    igst_amount: {
      type: 'number'
    },
    discount_percent: {
      type: 'number'
    },
    discount_amount: {
      type: 'number'
    },
    discount_type: {
      type: 'string'
    },
    barcode: {
      type: 'string',
      default: ''
    },
    sku: {
      type: 'string',
      default: ''
    },
    hsn: {
      type: 'string',
      default: ''
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    //product batch data
    batchNumber: {
      type: 'string'
    },
    // product txn qty sold/purchased
    txnQty: {
      type: 'number'
    },
    // customer / vendor data sale/purchased/sales return/purchased returned
    customerId: {
      type: 'string'
    },
    customerName: {
      type: 'string'
    },
    customerPhoneNo: {
      type: 'string'
    },
    customerGSTNo: {
      type: 'string'
    },
    customerGstType: {
      type: 'string'
    },
    wastagePercentage: {
      type: 'string'
    },
    wastageGrams: {
      type: 'string'
    },
    grossWeight: {
      type: 'string'
    },
    netWeight: {
      type: 'string'
    },
    purity: {
      type: 'string'
    },
    freeQty: {
      type: 'number'
    },
    freeTxnQty: {
      type: 'number'
    },
    mfDate: {
      type: 'string'
    },
    expiryDate: {
      type: 'string'
    },
    rack: {
      type: 'string'
    },
    warehouseData: {
      type: 'string'
    },
    qtyUnit: {
      type: 'string'
    },
    unitConversionQty: {
      type: 'number'
    },
    batchActualNumber: {
      type: 'string'
    },
    modelNo: {
      type: 'string'
    },
    serialOrImeiNo: {
      type: 'string'
    },
    mfgDirectExpenses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          amount: {
            type: 'number'
          }
        }
      }
    },
    properties: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: {
            type: 'string'
          },
          value: {
            type: 'string'
          }
        }
      }
    },
    addOnProperties: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          additionalPropertyId: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          price: {
            type: 'number'
          },
          type: {
            type: 'string'
          },
          offline: {
            type: 'boolean'
          },
          taxType: {
            type: 'string'
          },
          cgst: {
            type: 'number'
          },
          sgst: {
            type: 'number'
          },
          igst: {
            type: 'number'
          },
          cgst_amount: {
            type: 'number'
          },
          sgst_amount: {
            type: 'number'
          },
          igst_amount: {
            type: 'number'
          },
          discount_percent: {
            type: 'number'
          },
          discount_amount: {
            type: 'number'
          },
          discount_amount_per_item: {
            type: 'number'
          },
          discount_type: {
            type: 'string'
          },
          amount: {
            type: 'number'
          },
          cess: {
            type: 'number'
          },
          taxIncluded: {
            type: 'boolean'
          },
          groupName: {
            type: 'string'
          },
          purchasedPrice: {
            type: 'number'
          }
        }
      }
    },
    hallmarkCharge: {
      type: 'number'
    },
    certificationCharge: {
      type: 'number'
    },
    serialNo: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    mrpOtherCurrency: {
      type: 'number'
    },
    amountOtherCurrency: {
      type: 'number'
    },
    discountOtherCurrency: {
      type: 'number'
    },
    warrantyDays: {
      type: 'number'
    },
    warrantyEndDate: {
      type: 'string'
    }
  },
  required: [
    'txnId',
    'txnType',
    'txnDate',
    'productId',
    'updatedAt',
    'txnQty',
    'productName',
    'categoryLevel2',
    'categoryLevel3',
    'businessId',
    'businessCity'
  ],
  indexes: [
    ['txnDate', 'updatedAt'],
    'updatedAt',
    'txnType',
    'txnDate',
    'productName',
    'barcode',
    'productId',
    'categoryLevel2',
    'categoryLevel3',
    'batchNumber',
    'customerId',
    'customerName',
    'customerPhoneNo',
    'vendorPhoneNumber',
    'vendorName',
    'vendorId',
    'hsn',
    'sequenceNumber'
  ]
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'producttxn',
        businessData.businessId
      );
      doc = lastRecord || null;
    }

    if (!doc) {
      doc = {
        txnId: '0',
        updatedAt: 0,
        posId: businessData.posDeviceId,
        businessId: businessData.businessId,
        businessCity: businessData.businessCity
      };
    }

    if (!doc.posId) {
      doc.posId = localStoragePosId;
    }

    const currentUpdatedAt = Date.now();
    if (!(doc.updatedAt <= currentUpdatedAt)) {
      doc.updatedAt = currentUpdatedAt;
    }
    
    try {
      return await pullQueryBuilderInBackground(doc);
    } catch (error) {
      console.error('Error executing pullQueryBuilderInBackground:', error);
    }
  }
  return null;
};

export const pushQueryBuilder = async (doc) => {
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
     try {
      return await pushQueryBuilderInBackground(doc, localStoragePosId);
    } catch (error) {
      console.error('Error executing pushQueryBuilderInBackground:', error);
    }
  }
  return null;
};

const pullQueryBuilderInBackground = greenlet(async (doc) => {


  const BATCH_SIZE = 30;

  const query = `{
    getProductTxn(lastId: "${doc.txnId}", lastUpdatedAt: ${doc.updatedAt}, limit: ${BATCH_SIZE}, posId: ${doc.posId},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      id
      sequenceNumber
      txnId
      txnType
      txnDate
      vendorId
      vendorName
      vendorPhoneNumber
      vendorGSTNo
      vendorGstType
      productId
      categoryLevel2
      categoryLevel2DisplayName
      categoryLevel3
      categoryLevel3DisplayName
      productName
      brandName
      purchasedPrice
      purchased_price_before_tax
      reverseChargeEnable
      reverseChargeValue
      salePrice
      offerPrice
      mrp_before_tax
      stockQty
      amount
      taxAmount
      taxIncluded
      cgst
      sgst
      igst
      cess
      cgst_amount
      sgst_amount
      igst_amount
      discount_percent
      discount_amount
      discount_type
      barcode
      sku
      hsn
      posId
      batchNumber
      txnQty
      taxType
      customerId
      customerName
      customerPhoneNo
      customerGSTNo
      customerGstType
      wastagePercentage
      wastageGrams
      grossWeight
      netWeight
      purity
      freeQty
      freeTxnQty
      mfDate
      expiryDate
      rack
      warehouseData
      qtyUnit
      unitConversionQty
      batchActualNumber
      modelNo
      serialOrImeiNo
      mfgDirectExpenses {
        name
        amount
      }
      properties {
        title
        value
      }
      addOnProperties {
        additionalPropertyId
        name
        price
        type
        offline
        cgst
        sgst
        igst
        cgst_amount
        sgst_amount
        igst_amount
        discount_percent
        discount_amount
        discount_amount_per_item
        discount_type
        amount
        amount_before_tax
        cess
        taxIncluded
        groupName
        purchasedPrice
        taxType
      }
      hallmarkCharge
      certificationCharge
      serialNo
      mrpOtherCurrency
      amountOtherCurrency
      discountOtherCurrency
      warrantyDays
      warrantyEndDate
      updatedAt
      deleted
    }
}`;

  return {
    query,
    variables: {}
  };
});

const pushQueryBuilderInBackground = greenlet(async (doc, localStoragePosId) => {
  if (!doc.posId) {
    doc.posId = localStoragePosId;
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setProductTxn($input: ProductTxnInput) {
      setProductTxn(productTxn: $input) {
        txnId
        updatedAt
      }
    }
  `;
  const variables = {
    input: doc
  };

  return {
    query,
    variables
  };
});

export const productTxnSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.producttxn.syncGraphQL({
    url: syncURL,
    // headers: {
    //   Authorization: 'Bearer ' + token
    // },
    push: {
      batchSize,
      queryBuilder: pushQueryBuilder,
      /**
       *  Modifies all pushed documents before they are send to the GraphQL endpoint.
       * Returning null will skip the document.
       */
      modifier: async (doc) => {
        return await schemaSync.validateProductTxnDocumentBeforeSync(doc);
      }
    },
    pull: {
      queryBuilder: pullQueryBuilder
    },
    live: true,
    /**
     * Because the websocket is used to inform the client
     * when something has changed,
     * we can set the liveInterval to a high value
     */
    liveInterval: 1000 * 60 * 10, 
    autoStart: true,
    retryTime: 1000 * 60 * 5,
    deletedFlag: 'deleted'
  });
};
