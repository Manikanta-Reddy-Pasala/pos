import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const PurchaseOrderSchema = {
  title: '',
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
    vendor_id: {
      type: 'string'
    },
    company_name: {
      type: 'string'
    },
    mobile_no: {
      type: 'number'
    },
    vendor_name: {
      type: 'string'
    },
    vendor_gst_number: {
      type: 'string'
    },
    vendor_gst_type: {
      type: 'string'
    },
    vendor_phone_number: {
      type: 'string'
    },
    vendor_email_id: {
      type: 'string'
    },
    purchase_order_invoice_number: {
      type: 'string',
      primary: true
    },
    po_date: {
      type: 'string',
      format: 'date'
    },
    due_date: {
      type: 'string',
      format: 'date'
    },
    is_roundoff: {
      type: 'boolean'
    },
    is_credit: {
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
    payment_type: {
      type: 'string'
    },
    paid_amount: {
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
          serialNo: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      }
    },
    employeeId: {
      type: 'string'
    },
    imageUrls: {
      type: 'array',
      items: {
       type: 'string'
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
    sequenceNumber: {
      type: 'string'
    },
    notes: {
      type: 'string'
    },
    status: {
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
    isSyncedToServer: {
      type: 'boolean'
    },
    vendorMsmeRegNo: {
      type: 'string'
    },
    discountPercentForAllItems: {
      type: 'number'
    }
  },
  indexes: [
    ['po_date', 'updatedAt'],
    'updatedAt',
    'po_date',
    'vendor_id',
    'purchase_order_invoice_number',
    'vendor_phone_number',
    'balance_amount'
  ],
  required: ['businessId', 'businessCity', 'updatedAt']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;
    ;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'purchaseorder',
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
    const localStoragePosId = localStorage.getItem('posId') || 1;
    ;
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
      purchase_order_invoice_number: '0',
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
      getPurchaseOrder(lastId: "${doc.purchase_order_invoice_number}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        businessId
        businessCity
        vendor_id,
        company_name,
        mobile_no,
        vendor_name,
        vendor_gst_number,
        vendor_gst_type
        vendor_phone_number,
        purchase_order_invoice_number,
        po_date,
        due_date,
        is_roundoff,
        is_credit,
        round_amount,
        total_amount,
        rounded_amount,
        balance_amount,
        payment_type,
        paid_amount,
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
        discount_type
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
          vendorName,
          vendorPhoneNumber,
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
        itemNumber
        originalDiscountPercent
        dailyRate
        hallmarkCharge
        certificationCharge
        serialNo
        properties {
          title
          value
        }
        },
        employeeId,
        imageUrls
        updatedAt,
        place_of_supply,
        placeOfSupplyName,
        sequenceNumber,
        notes,
        deleted,
        sub_total,
        vendor_email_id,
        bankAccount,
        bankAccountId,
        bankPaymentType,
        paymentReferenceNumber,
        status
        vendorCity
        vendorPincode
        vendorAddress
        vendorState
        vendorCountry
        isSyncedToServer
        vendorMsmeRegNo
        discountPercentForAllItems
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
    mutation setPurchaseOrder($input: PurchaseOrderInput) {
      setPurchaseOrder(purchaseOrder: $input) {
        purchase_order_invoice_number
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


export const purchaseOrderSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.purchaseorder.syncGraphQL({
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
        return await schemaSync.validatePurchaseOrderDocumentBeforeSync(doc);
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
