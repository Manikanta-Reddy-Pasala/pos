import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const BackToBackPurchaseSchema = {
  title: '',
  description: '',
  version: 1,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    lrNumber: {
      type: 'string'
    },
    backToBackPurchaseNumber: {
      type: 'string',
      primary: true
    },
    sequenceNumber: {
      type: 'string'
    },
    bill_date: {
      type: 'string',
      format: 'date'
    },
    total_amount: {
      type: 'number'
    },
    item_list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          vendorId: {
            type: 'string'
          },
          vendorName: {
            type: 'string'
          },
          vendorGstNumber: {
            type: 'string'
          },
          vendorGstType: {
            type: 'string'
          },
          vendorPayable: {
            type: 'string'
          },
          vendorPhoneNumber: {
            type: 'string'
          },
          vendorCity: {
            type: 'string'
          },
          vendorPincode: {
            type: 'string'
          },
          vendorAddress: {
            type: 'string'
          },
          vendorState: {
            type: 'string'
          },
          vendorCountry: {
            type: 'string'
          },
          vendorEmailId: {
            type: 'string'
          },
          vendorPanNumber: {
            type: 'string'
          },
          product_id: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          imageUrl: {
            type: 'string'
          },
          batch_id: {
            type: 'number'
          },
          unit: {
            type: 'string'
          },
          hsn: {
            type: 'string'
          },
          item_name: {
            type: 'string'
          },
          sku: {
            type: 'string'
          },
          barcode: {
            type: 'string'
          },
          purchased_price: {
            type: 'number'
          },
          purchased_price_before_tax: {
            type: 'number'
          },
          mrp: {
            type: 'number'
          },
          offer_price: {
            type: 'number'
          },
          size: {
            type: 'number'
          },
          qty: {
            type: 'number'
          },
          taxType: {
            type: 'string'
          },
          stockQty: {
            type: 'number'
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
          cess: {
            type: 'number'
          },
          amount: {
            type: 'number'
          },
          isEdit: {
            type: 'boolean'
          },
          taxIncluded: {
            type: 'boolean'
          },
          returnedQty: {
            type: 'number'
          },
          brandName: {
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
          makingChargePercent: {
            type: 'number'
          },
          makingChargeAmount: {
            type: 'number'
          },
          makingChargeType: {
            type: 'string'
          },
          makingChargePerGramAmount: {
            type: 'number'
          },
          serialOrImeiNo: {
            type: 'string'
          },
          makingChargeIncluded: {
            type: 'boolean'
          },
          freeQty: {
            type: 'number'
          },
          freeStockQty: {
            type: 'number'
          },
          returnedFreeQty: {
            type: 'number'
          },
          qtyUnit: {
            type: 'string'
          },
          primaryUnit: {
            type: 'object',
            properties: {
              fullName: {
                type: 'string'
              },
              shortName: {
                type: 'string'
              }
            }
          },
          secondaryUnit: {
            type: 'object',
            properties: {
              fullName: {
                type: 'string'
              },
              shortName: {
                type: 'string'
              }
            }
          },
          unitConversionQty: {
            type: 'number'
          },
          units: {
            type: 'array'
          },
          originalPurchasePriceWithoutConversionQty: {
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
          batchNumber: {
            type: 'string'
          },
          modelNo: {
            type: 'string'
          },
          pricePerGram: {
            type: 'number'
          },
          stoneWeight: {
            type: 'number'
          },
          stoneCharge: {
            type: 'number'
          },
          finalMRPPrice: {
            type: 'number'
          },
          itemNumber: {
            type: 'number'
          }
        }
      }
    },
    employeeId: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    freightCharge: {
      type: 'number'
    },
    subTotal: {
      type: 'number'
    },
    notes: {
      type: 'string'
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    transporterVendorId: {
      type: 'string'
    },
    transporterVendorName: {
      type: 'string'
    },
    transporterVendorGstNumber: {
      type: 'string'
    },
    transporterVendorGstType: {
      type: 'string'
    },
    transporterVendorPayable: {
      type: 'boolean'
    },
    transporterVendorPhoneNumber: {
      type: 'string'
    },
    transporterVendorCity: {
      type: 'string'
    },
    transporterVendorPincode: {
      type: 'string'
    },
    transporterVendorAddress: {
      type: 'string'
    },
    transporterVendorState: {
      type: 'string'
    },
    transporterVendorCountry: {
      type: 'string'
    },
    transporterVendorEmailId: {
      type: 'string'
    },
    transporterVendorPanNumber: {
      type: 'string'
    },
    vehicleNumber: {
      type: 'string'
    },
    supervisorName: {
      type: 'string'
    },
    supervisorPhoneNumber: {
      type: 'string'
    },
    supervisorEmployeeId: {
      type: 'string'
    },
    materialsInChargeName: {
      type: 'string'
    },
    materialsInChargePhoneNumber: {
      type: 'string'
    },
    materialsInChargeEmployeeId: {
      type: 'string'
    },
    expenseIdForFreightCharge: {
      type: 'string'
    }
  },
  indexes: [
    ['bill_date', 'updatedAt'],
    'updatedAt',
    'bill_date',
    'backToBackPurchaseNumber',
    'sequenceNumber'
  ],
  required: ['businessId', 'businessCity', 'updatedAt']
};

const pushQueryBuilderInBackground = greenlet(async (doc, localStoragePosId) => {
  if (!doc.posId) {
    doc.posId = parseInt(localStoragePosId);
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setBackToBackPurchases($input: BackToBackPurchasesInput) {
      setBackToBackPurchases(backToBackPurchases: $input) {
        backToBackPurchaseNumber,
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

const pullQueryBuilderInBackground = greenlet(async (doc, businessData, localStoragePosId) => {


  if (!doc) {
    // the first pull does not have a start-document
    doc = {
      backToBackPurchaseNumber: '0',
      updatedAt: 0,
      posId: businessData.posDeviceId,
      businessId: businessData.businessId,
      businessCity: businessData.businessCity
    };
  }

  if (!doc.posId) {
    doc.posId = parseInt(localStoragePosId);
  }
  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const BATCH_SIZE = 30;
  const query = `{
    getBackToBackPurchases(lastId: "${doc.backToBackPurchaseNumber}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      backToBackPurchaseNumber
      lrNumber
      sequenceNumber
      bill_date
      total_amount
      updatedAt
      freightCharge
      notes
      isSyncedToServer
      subTotal
      transporterVendorId
      transporterVendorName
      transporterVendorGstNumber
      transporterVendorGstType
      transporterVendorPayable
      transporterVendorPhoneNumber
      transporterVendorCity
      transporterVendorPincode
      transporterVendorAddress
      transporterVendorState
      transporterVendorCountry
      transporterVendorEmailId
      transporterVendorPanNumber
      employeeId
      vehicleNumber
      supervisorName
      supervisorPhoneNumber
      supervisorEmployeeId
      materialsInChargeName
      materialsInChargePhoneNumber
      materialsInChargeEmployeeId
      expenseIdForFreightCharge
      item_list {
        vendorId
        vendorName
        vendorGstNumber
        vendorGstType
        vendorPayable
        vendorPhoneNumber
        vendorCity
        vendorPincode
        vendorAddress
        vendorState
        vendorCountry
        vendorEmailId
        vendorPanNumber
        product_id
        description
        imageUrl
        batch_id
        unit,
        hsn,
        item_name,
        sku,
        barcode,
        purchased_price,
        purchased_price_before_tax,
        mrp,
        offer_price,
        size,
        qty,
        taxType,
        stockQty,
        cgst,
        sgst,
        igst,
        cgst_amount,
        sgst_amount,
        igst_amount,
        discount_percent,
        discount_amount,
        discount_amount_per_item,
        discount_type,
        cess,
        amount,
        isEdit,
        returnedQty,
        taxIncluded,
        brandName,
        categoryLevel2,
        categoryLevel2DisplayName,
        categoryLevel3,
        categoryLevel3DisplayName,
        wastageGrams,
        grossWeight,
        netWeight,
        purity,
        makingChargePercent
        makingChargeAmount
        makingChargeType
        makingChargePerGramAmount
        serialOrImeiNo
        makingChargeIncluded
        freeQty
        freeStockQty
        returnedFreeQty
        qtyUnit
        primaryUnit {
          fullName
          shortName
        }
        secondaryUnit{
          fullName
          shortName
        }
        unitConversionQty
        units
        originalPurchasePriceWithoutConversionQty
        mfDate
        expiryDate
        rack
        warehouseData
        batchNumber
        modelNo
        pricePerGram
        stoneWeight
        stoneCharge
        finalMRPPrice
        itemNumber
      }
    }
}`;

  return {
    query,
    variables: {}
  };
});


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

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;

    /**
     * start
     * check if user clicked on switch business
     * if yes then get last updated record of the business and pull from that document
     */
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'backtobackpurchases',
        businessData.businessId
      );

      if (lastRecord) {
        doc = lastRecord;
      } else {
        doc = null;
      }
    }
    /**
     * End
     */

    return pullQueryBuilderInBackground(doc, businessData, localStoragePosId);
  }
  return null;
};


export const backToBackPurchasesSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.backtobackpurchases.syncGraphQL({
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
        return await schemaSync.validateBackToBackPurchasesDocumentBeforeSync(
          doc
        );
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
