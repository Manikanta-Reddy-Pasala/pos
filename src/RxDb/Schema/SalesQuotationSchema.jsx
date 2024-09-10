import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const SalesQuotationSchema = {
  title: 'sales quotation table',
  description: 'sales quotation list',
  version: 15,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    customer_id: {
      type: 'string'
    },
    company_name: {
      type: 'string'
    },
    customerGSTNo: {
      type: 'string'
    },
    customerGstType: {
      type: 'string'
    },
    mobile_no: {
      type: 'number'
    },
    customer_name: {
      type: 'string'
    },
    customer_address: {
      type: 'string'
    },
    customer_phoneNo: {
      type: 'string'
    },
    customer_city: {
      type: 'string'
    },
    customer_emailId: {
      type: 'string'
    },
    customer_pincode: {
      type: 'string'
    },
    invoice_number: {
      type: 'string',
      primary: true
    },
    sequenceNumber: {
      type: 'string'
    },
    invoice_date: {
      type: 'string',
      format: 'date'
    },
    is_roundoff: {
      type: 'boolean'
    },
    round_amount: {
      type: 'number'
    },
    total_amount: {
      type: 'number'
    },
    rounded_amount: {
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
    item_list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
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
          mrp: {
            type: 'number'
          },
          purchased_price: {
            type: 'number'
          },
          offer_price: {
            type: 'number'
          },
          mrp_before_tax: {
            type: 'number'
          },
          qty: {
            type: 'number'
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
          vendorName: {
            type: 'string'
          },
          vendorPhoneNumber: {
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
          roundOff: {
            type: 'number'
          },
          stockQty: {
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
          makingChargeIncluded: {
            type: 'boolean'
          },
          freeQty: {
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
          originalMrpWithoutConversionQty: {
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
          serialOrImeiNo: {
            type: 'string'
          },
          itemNumber: {
            type: 'number'
          },
          originalDiscountPercent: {
            type: 'number'
          },
          dailyRate: {
            type: 'string'
          },
          hallmarkCharge: {
            type: 'number'
          },
          certificationCharge: {
            type: 'number'
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
          purchased_price_before_tax: {
            type: 'number'
          }
        }
      }
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    packing_charge: {
      type: 'number'
    },
    shipping_charge: {
      type: 'number'
    },
    sub_total: {
      type: 'number'
    },
    employeeId: {
      type: 'string'
    },
    convertQuotationToSale: {
      type: 'boolean'
    },
    estimateType: {
      type: 'string'
    },
    notes: {
      type: 'string'
    },
    customerState: {
      type: 'string'
    },
    customerCountry: {
      type: 'string'
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    discountPercentForAllItems: {
      type: 'number'
    },
    imageUrls: {
      type: 'array',
      items: {
        type: 'string'
      }
    }
  },
  indexes: [
    ['invoice_date', 'updatedAt'],
    'updatedAt',
    'invoice_date',
    'customer_id',
    'posId',
    'customer_phoneNo',
    'item_list.[].hsn',
    'sequenceNumber'
  ],
  required: ['businessId', 'businessCity', 'invoice_date', 'updatedAt', 'posId']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'salesquotation',
        businessData.businessId
      );
      doc = lastRecord || null;
    }
    try {
      return await pullQueryBuilderInBackground(doc, localStoragePosId, businessData);
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

const pullQueryBuilderInBackground = greenlet(async (doc, localStoragePosId, businessData) => {
  if (!doc) {
    // the first pull does not have a start-document
    doc = {
      invoice_number: '0',
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

  const BATCH_SIZE = 30;

  const query = `{
      getSalesQuotation(lastId: "${doc.invoice_number}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        businessId
        businessCity
        customer_id,
        company_name,
        customerGSTNo,
        customerGstType,
        mobile_no,
        customer_name,
        customer_address,
        customer_phoneNo,
        customer_city,
        customer_emailId,
        customer_pincode,
        invoice_number,
        sequenceNumber,
        invoice_date,
        is_roundoff,
        round_amount,
        total_amount,
        rounded_amount,
        discount_percent,
        discount_amount,
        discount_type,
        item_list {
          product_id,
          description,
          imageUrl,
          batch_id,
          unit,
          hsn,
          item_name,
          sku,
          barcode,
          mrp,
          purchased_price,
          offer_price,
          mrp_before_tax,
          qty,
          taxType,
          stockQty,
          cgst,
          sgst,
          igst,
          cess,
          cgst_amount,
          sgst_amount,
          igst_amount,
          vendorName,
          vendorPhoneNumber,
          discount_percent,
          discount_amount,
          discount_amount_per_item,
          discount_type,
          amount,
          isEdit,
          taxIncluded,
          roundOff,
          brandName,
          categoryLevel2,
          categoryLevel2DisplayName,
          categoryLevel3,
          categoryLevel3DisplayName,
          wastagePercentage,
          wastageGrams,
          grossWeight,
          netWeight,
          purity,
          makingChargePercent
          makingChargeAmount
          makingChargeType
          makingChargePerGramAmount
          makingChargeIncluded
          freeQty
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
            originalMrpWithoutConversionQty
            mfDate
            expiryDate
            rack
            warehouseData
            batchNumber
            modelNo
            pricePerGram
            stoneWeight
            stoneCharge
            serialOrImeiNo
            itemNumber      
            originalDiscountPercent
            dailyRate
            hallmarkCharge
            certificationCharge
            purchased_price_before_tax
            properties {
              title
              value
            }
        },
        employeeId,
        updatedAt,
        posId,
        packing_charge,
        shipping_charge,
        estimateType,
        convertQuotationToSale,
        deleted,
        sub_total
        notes
        customerState
        customerCountry
        isSyncedToServer
        discountPercentForAllItems
        imageUrls
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
    mutation setSalesQuotation($input: SalesQuotationInput) {
      setSalesQuotation(salesQuotation: $input) {
        invoice_number
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

export const salesQuotationSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.salesquotation.syncGraphQL({
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
        return await schemaSync.validateSalesQuotationDocumentBeforeSync(doc);
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
