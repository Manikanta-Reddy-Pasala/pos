import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const PurchasesSchema = {
  title: '',
  description: '',
  version: 27,
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
    bill_number: {
      type: 'string',
      primary: true
    },
    vendor_bill_number: {
      type: 'string'
    },
    bill_date: {
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
    rateList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          metal: {
            type: 'string'
          },
          purity: {
            type: 'string'
          },
          rateByGram: {
            type: 'number'
          },
          defaultBool: {
            type: 'boolean'
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
    place_of_supply: {
      type: 'string'
    },
    placeOfSupplyName: {
      type: 'string'
    },
    reverseChargeEnable: {
      type: 'boolean'
    },
    reverseChargeValue: {
      type: 'number'
    },
    sub_total: {
      type: 'number'
    },
    waiter: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        phoneNumber: {
          type: 'string'
        }
      }
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
    notes: {
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
    tcsAmount: {
      type: 'number'
    },
    tcsName: {
      type: 'string'
    },
    tcsRate: {
      type: 'number'
    },
    tcsCode: {
      type: 'string'
    },
    dueDate: {
      type: 'string'
    },
    tdsAmount: {
      type: 'number'
    },
    tdsName: {
      type: 'string'
    },
    tdsRate: {
      type: 'number'
    },
    tdsCode: {
      type: 'string'
    },
    vendorPanNumber: {
      type: 'string'
    },
    splitPaymentList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          paymentType: {
            type: 'string'
          },
          referenceNumber: {
            type: 'string'
          },
          paymentMode: {
            type: 'string'
          },
          accountDisplayName: {
            type: 'string'
          },
          bankAccountId: {
            type: 'string'
          },
          amount: {
            type: 'number'
          }
        }
      }
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    invoiceStatus: {
      type: 'string'
    },
    tallySyncedStatus: {
      type: 'string'
    },
    tallySynced: {
      type: 'boolean'
    },
    aadharNumber: {
      type: 'string'
    },
    calculateStockAndBalance: {
      type: 'boolean'
    },
    lrNumber: {
      type: 'string'
    },
    vendorMsmeRegNo: {
      type: 'string'
    },
    discountPercentForAllItems: {
      type: 'number'
    },
    portalITCAvailable: {
      type: 'boolean'
    },
    posITCAvailable: {
      type: 'boolean'
    },
    portalRCMValue: {
      type: 'boolean'
    },
    posRCMValue: {
      type: 'boolean'
    },
    itcReversed: {
      type: 'boolean'
    },
    fromPortal: {
      type: 'boolean'
    },
    imageUrls: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    accountingDate: {
      type: 'string'
    },
    oldSequenceNumber: {
      type: 'string'
    },
    receiptOrPayment: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          sequenceNumber: {
            type: 'string'
          },
          paymentType: {
            type: 'string'
          },
          paymentMode: {
            type: 'string'
          },
          amount: {
            type: 'number'
          },
          bankName: {
            type: 'string'
          },
          bankId: {
            type: 'string'
          },
          referenceNumber: {
            type: 'string'
          },
          createdAt: {
            type: 'number'
          },
          narration: {
            type: 'string'
          },
          cancelled: {
            type: 'boolean'
          }
        }
      }
    }
  },
  indexes: [
    ['bill_date', 'updatedAt'],
    'updatedAt',
    'dueDate',
    'bill_date',
    'vendor_id',
    'vendor_bill_number',
    'vendor_phone_number',
    'balance_amount',
    'tcsAmount'
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
        'purchases',
        businessData.businessId
      );
      doc = lastRecord || null;
    }

    if (!doc) {
      doc = {
        bill_number: '0',
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

const pullQueryBuilderInBackground = greenlet(async (doc) => {


  const BATCH_SIZE = 30;

  const query = `{
    getPurchases(lastId: "${doc.bill_number}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      vendor_id,
      company_name,
      mobile_no,
      vendor_name,
      vendor_gst_number,
      vendor_gst_type
      vendor_phone_number,
      bill_number,
      vendor_bill_number,
      bill_date,
      is_roundoff,
      is_credit,
      round_amount,
      total_amount,
      rounded_amount,
      balance_amount,
      payment_type,
      paid_amount,
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
      rateList {
        id
        metal
        purity
        rateByGram
        defaultBool
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
      updatedAt,
      packing_charge,
      shipping_charge,
      place_of_supply,
      placeOfSupplyName,
      reverseChargeEnable,
      reverseChargeValue,
      deleted,
      sub_total,
      waiter {
        name
        phoneNumber
      },
      vendor_email_id,
      bankAccount,
      bankAccountId,
      bankPaymentType,
      paymentReferenceNumber
      notes
      vendorCity
      vendorPincode
      vendorAddress
      vendorState
      vendorCountry
      tcsAmount
      tcsName
      tcsRate
      tcsCode
      dueDate
      tdsAmount
      tdsName
      tdsRate
      tdsCode
      vendorPanNumber
      aadharNumber
      splitPaymentList {
        id
        paymentType
        referenceNumber
        paymentMode
        accountDisplayName
        bankAccountId
        amount
      }
      isSyncedToServer
      invoiceStatus
      tallySyncedStatus
      tallySynced
      calculateStockAndBalance
      lrNumber
      vendorMsmeRegNo
      discountPercentForAllItems
      portalITCAvailable
      posITCAvailable
      portalRCMValue
      posRCMValue
      itcReversed
      fromPortal
      imageUrls
      accountingDate
      oldSequenceNumber
      receiptOrPayment {
        id
        sequenceNumber
        paymentType
        paymentMode
        amount
        bankName
        bankId
        referenceNumber
        createdAt
        narration
        cancelled
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
    mutation setPurchases($input: PurchasesInput) {
      setPurchases(purchases: $input) {
        bill_number
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


export const purchasesSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.purchases.syncGraphQL({
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
        return await schemaSync.validatePurchasesDocumentBeforeSync(doc);
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
