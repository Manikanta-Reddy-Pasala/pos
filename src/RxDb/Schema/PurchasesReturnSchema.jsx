import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const PurchasesReturnSchema = {
  title: '',
  description: '',
  version: 26,
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
    bill_number: {
      type: 'string'
    },
    vendor_bill_number: {
      type: 'string'
    },
    purchase_return_number: {
      type: 'string',
      primary: true
    },
    date: {
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
    payment_type: {
      type: 'string'
    },
    received_amount: {
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
          sub_total: {
            type: 'number'
          },
          returnChecked: {
            type: 'boolean'
          },
          serialOrImeiNo: {
            type: 'string'
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
          makingChargeIncluded: {
            type: 'boolean'
          },
          freeQty: {
            type: 'number'
          },
          freeStockQty: {
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
    reverseChargeValue: {
      type: 'number'
    },
    reverseChargeEnable: {
      type: 'boolean'
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
    //kot fields
    waiter_name: {
      type: 'string'
    },
    waiter_phoneNo: {
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
    vendor_email_id: {
      type: 'string'
    },
    packing_charge: {
      type: 'number'
    },
    shipping_charge: {
      type: 'number'
    },
    return_discount_amount: {
      type: 'number'
    },
    purchaseReturnBillNumber: {
      type: 'number'
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
    aadharNumber: {
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
    invoiceStatus: {
      type: 'string'
    },
    tallySyncedStatus: {
      type: 'string'
    },
    tallySynced: {
      type: 'boolean'
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    calculateStockAndBalance: {
      type: 'boolean'
    },
    purchaseDate: {
      type: 'string'
    },
    purchaseTotalAmount: {
      type: 'number'
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
    }
  },
  indexes: [
    ['date', 'updatedAt'],
    'updatedAt',
    'vendor_id',
    'vendor_phone_number',
    'date',
    'dueDate'
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
        'purchasesreturn',
        businessData.businessId
      );
      doc = lastRecord || null;
    }

    if (!doc) {
      doc = {
        purchase_return_number: '0',
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
    getPurchasesReturn(lastId: "${doc.purchase_return_number}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      vendor_id,
      mobile_no,
      vendor_name,
      vendor_gst_number,
      vendor_gst_type,
      vendor_phone_number,
      bill_number,
      vendor_bill_number,
      purchase_return_number,
      date,
      is_roundoff,
      round_amount,
      total_amount,
      rounded_amount,
      balance_amount,
      payment_type,
      received_amount,
      discount_percent,
      discount_amount,
      discount_type,
      linkPayment,
      reverseChargeEnable,
      reverseChargeValue,
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
        cess,
        amount,
        isEdit,
        taxIncluded,
        brandName,
        categoryLevel2,
        categoryLevel2DisplayName,
        categoryLevel3,
        categoryLevel3DisplayName,
        vendorName,
        vendorPhoneNumber,
        returnChecked,
        discount_percent,
        discount_amount,
        discount_amount_per_item
        discount_type,
        makingChargePercent
        makingChargeAmount
        makingChargeType
        makingChargePerGramAmount
        wastagePercentage,
        wastageGrams,
        grossWeight,
        netWeight,
        purity
        makingChargeIncluded
        freeQty
        freeStockQty
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
        serialOrImeiNo
      }
      employeeId,
      updatedAt
      deleted,
      sub_total,
      bankAccount,
      bankAccountId,
      bankPaymentType,
      waiter_name,
      waiter_phoneNo
      paymentReferenceNumber
      notes
      vendorCity
      vendorPincode
      vendorAddress
      vendorState
      vendorCountry
      vendor_email_id
      notes,
      packing_charge,
      shipping_charge,
      return_discount_amount,
      purchaseReturnBillNumber
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
      invoiceStatus
      tallySyncedStatus
      tallySynced
      isSyncedToServer
      calculateStockAndBalance
      purchaseDate
      purchaseTotalAmount
      vendorMsmeRegNo
      discountPercentForAllItems
      portalITCAvailable
      posITCAvailable
      portalRCMValue
      posRCMValue
      itcReversed
      imageUrls
      accountingDate
      oldSequenceNumber
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
    mutation setPurchasesReturn($input: PurchaseReturnsInput) {
      setPurchasesReturn(purchaseReturns: $input) {
        purchase_return_number
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


export const purchasesreturnSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.purchasesreturn.syncGraphQL({
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
        return await schemaSync.validatePurchasesReturnDocumentBeforeSync(doc);
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
