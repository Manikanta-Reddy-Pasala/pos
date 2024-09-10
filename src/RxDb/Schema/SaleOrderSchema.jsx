import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const SaleOrderSchema = {
  title: 'Sale Order Schema Table',
  description: '',
  version: 14,
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
    mobile_no: {
      type: 'number'
    },
    customer_name: {
      type: 'string'
    },
    customer_phoneNo: {
      type: 'string'
    },
    customer_emailId: {
      type: 'string'
    },
    sale_order_invoice_number: {
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
    balance_amount: {
      type: 'number'
    },
    is_credit: {
      type: 'boolean'
    },
    payment_type: {
      type: 'string'
    },
    received_amount: {
      type: 'number'
    },
    isFullyReturned: {
      type: 'boolean'
    },
    isPartiallyReturned: {
      type: 'boolean'
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
    linkPayment: {
      type: 'boolean'
    },
    linked_amount: {
      type: 'number'
    },
    linkedTxnList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          linkedId: {
            type: 'string'
          },
          date: {
            type: 'string',
            format: 'date'
          },
          linkedAmount: {
            type: 'number'
          },
          paymentType: {
            type: 'string'
          },
          transactionNumber: {
            type: 'string'
          },
          sequenceNumber: {
            type: 'string'
          }
        }
      }
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
          size: {
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
          returnedQty: {
            type: 'number'
          },
          stockQty: {
            type: 'number'
          },
          vendorName: {
            type: 'string'
          },
          vendorPhoneNumber: {
            type: 'string'
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
    place_of_supply: {
      type: 'string'
    },
    placeOfSupplyName: {
      type: 'string'
    },
    sub_total: {
      type: 'number'
    },
    employeeId: {
      type: 'string'
    },
    bankAccount: {
      type: 'string'
    },
    bankAccountId: {
      type: 'string'
    },
    bankPaymentType: {
      type: 'string'
    },
    paymentReferenceNumber: {
      type: 'string'
    },
    due_date: {
      type: 'string',
      format: 'date'
    },
    notes: {
      type: 'string'
    },
    convertSOToSale: {
      type: 'boolean'
    },
    saleOrderType: {
      type: 'string'
    },
    customerGSTNo: {
      type: 'string'
    },
    customerGstType: {
      type: 'string'
    },
    customerPincode: {
      type: 'string'
    },
    customerCity: {
      type: 'string'
    },
    customerAddress: {
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
    customer: {
      type: 'object',
      properties: {
        customer_phoneNo: {
          type: 'string'
        },
        customer_name: {
          type: 'string'
        },
        customer_id: {
          type: 'string'
        },
        address: {
          type: 'string'
        },
        pincode: {
          type: 'string'
        },
        city: {
          type: 'string'
        },
        state: {
          type: 'string'
        },
        country: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
        gstNumber: {
          type: 'string'
        },
        gstType: {
          type: 'string'
        }
      }
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
    'balance_amount',
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
        'saleorder',
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
    doc = {
      sale_order_invoice_number: '0',
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
      getSaleOrder(lastId: "${doc.invoice_number}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        businessId
        businessCity
        customer_id,
        company_name,
        mobile_no,
        customer_name,
        customer_phoneNo,
        customer_emailId,
        sale_order_invoice_number,
        sequenceNumber,
        invoice_date,
        is_roundoff,
        round_amount,
        total_amount,
        rounded_amount,
        balance_amount,
        is_credit,
        payment_type,
        received_amount,
        isFullyReturned,
        isPartiallyReturned,
        linkPayment,
        linked_amount,
        linkedTxnList {
          linkedId,
          date,
          linkedAmount,
          paymentType,
          transactionNumber,
          sequenceNumber
        },
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
          size,
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
          discount_percent,
          discount_amount,
          discount_amount_per_item,
          discount_type,
          amount,
          isEdit,
          taxIncluded,
          roundOff,
          returnedQty,
          brandName,
          categoryLevel2,
          categoryLevel2DisplayName,
          categoryLevel3,
          categoryLevel3DisplayName,
          vendorName,
          vendorPhoneNumber,
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
            properties {
              title
              value
            }
            purchased_price_before_tax
        },
        employeeId,
        updatedAt,
        posId,
        deleted,
        sub_total,
        bankAccount,
        bankAccountId,
        bankPaymentType,
        paymentReferenceNumber,
        due_date,
        notes
        saleOrderType
        convertSOToSale
        place_of_supply
        placeOfSupplyName
        customerGSTNo
        customerGstType
        customerPincode
        customerCity
        customerAddress
        customerState
        customerCountry
        isSyncedToServer
        discountPercentForAllItems
        imageUrls
        customer {
          customer_id
          customer_name
          customer_phoneNo
          address
          pincode
          city
          state
          country
          email
          gstNumber
          gstType
        }
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
    mutation setSaleOrder($input: SaleOrderInput) {
      setSaleOrder(saleOrder: $input) {
        sale_order_invoice_number
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

export const saleOrderSchemaSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.saleorder.syncGraphQL({
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
        return await schemaSync.validateSaleOrderDocumentBeforeSync(doc);
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
