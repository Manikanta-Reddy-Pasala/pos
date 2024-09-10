import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const SalesReturnSchema = {
  title: 'sales retuen table',
  description: 'sales return list',
  version: 27,
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
    customerGSTNo: {
      type: 'string'
    },
    customerGstType: {
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
      type: 'string'
    },
    sequenceNumber: {
      type: 'string'
    },
    saleSequenceNumber: {
      type: 'string'
    },
    sales_return_number: {
      type: 'string',
      primary: true
    },
    invoice_date: {
      type: 'string',
      format: 'date'
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
    is_credit: {
      type: 'boolean'
    },
    payment_type: {
      type: 'string'
    },
    paid_amount: {
      type: 'number'
    },
    linkPayment: {
      type: 'boolean'
    },
    linked_amount: {
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
          mrp: {
            type: 'number'
          },
          purchased_price: {
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
          roundOff: {
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
          discount_percent: {
            type: 'number'
          },
          discount_amount: {
            type: 'number'
          },
          discount_type: {
            type: 'string'
          },
          discount_amount_per_item: {
            type: 'number'
          },
          mrp_before_tax: {
            type: 'number'
          },
          sub_total: {
            type: 'number'
          },
          returnChecked: {
            type: 'boolean'
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
          finalMRPPrice: {
            type: 'number'
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
                },
                productId: {
                  type: 'string'
                },
                description: {
                  type: 'string'
                },
                batchId: {
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
                stockQty: {
                  type: 'number'
                },
                hsn: {
                  type: 'string'
                },
                barcode: {
                  type: 'string'
                }
              }
            }
          },
          startPackingNo: {
            type: 'number'
          },
          endPackingNo: {
            type: 'number'
          },
          totalPackingNos: {
            type: 'number'
          },
          netWeightPerPackage: {
            type: 'number'
          },
          grossWeightPerPackage: {
            type: 'number'
          },
          totalPackageNetWeight: {
            type: 'number'
          },
          totalPackageGrossWeight: {
            type: 'number'
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
          },
          purchased_price_before_tax: {
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
    prefix: {
      type: 'string'
    },
    subPrefix: {
      type: 'string'
    },
    customerState: {
      type: 'string'
    },
    customerCountry: {
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
    customerPanNumber: {
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
    isCancelled: {
      type: 'boolean'
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
    salesEmployeeName: {
      type: 'string'
    },
    salesEmployeeId: {
      type: 'string'
    },
    salesEmployeePhoneNumber: {
      type: 'string'
    },
    calculateStockAndBalance: {
      type: 'boolean'
    },
    saleTotalAmount: {
      type: 'number'
    },
    shippingTax: {
      type: 'object',
      properties: {
        cgst: {
          type: 'number'
        },
        sgst: {
          type: 'number'
        },
        igst: {
          type: 'number'
        },
        cgstAmount: {
          type: 'number'
        },
        sgstAmount: {
          type: 'number'
        },
        igstAmount: {
          type: 'number'
        }
      }
    },
    packingTax: {
      type: 'object',
      properties: {
        cgst: {
          type: 'number'
        },
        sgst: {
          type: 'number'
        },
        igst: {
          type: 'number'
        },
        cgstAmount: {
          type: 'number'
        },
        sgstAmount: {
          type: 'number'
        },
        igstAmount: {
          type: 'number'
        }
      }
    },
    amendmentDate: {
      type: 'string'
    },
    amended: {
      type: 'boolean'
    },
    amendmentReason: {
      type: 'string'
    },
    discountPercentForAllItems: {
      type: 'number'
    },
    insurance: {
      type: 'object',
      properties: {
        amount: {
          type: 'number'
        },
        percent: {
          type: 'number'
        },
        type: {
          type: 'string'
        },
        policyNo: {
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
        cgstAmount: {
          type: 'number'
        },
        sgstAmount: {
          type: 'number'
        },
        igstAmount: {
          type: 'number'
        },
        amountOtherCurrency: {
          type: 'number'
        }
      }
    },
    imageUrls: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    oldSequenceNumber: {
      type: 'string'
    },
    placeOfReceiptByPreCarrier: {
      type: 'string'
    },
    vesselFlightNo: {
      type: 'string'
    },
    portOfLoading: {
      type: 'string'
    },
    portOfDischarge: {
      type: 'string'
    },
    otherReference: {
      type: 'string'
    },
    billOfLadingNo: {
      type: 'string'
    },
    terms: {
      type: 'string'
    },
    buyerOtherBillTo: {
      type: 'object',
      properties: {
        id: {
          type: 'string'
        },
        phoneNo: {
          type: 'string'
        },
        name: {
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
        gstNo: {
          type: 'string'
        },
        gstType: {
          type: 'string'
        },
        pan: {
          type: 'string'
        },
        aadhar: {
          type: 'string'
        },
        tradeName: {
          type: 'string'
        },
        legalName: {
          type: 'string'
        },
        regNo: {
          type: 'string'
        }
      }
    },
    totalOtherCurrency: {
      type: 'number'
    },
    exportCountryOrigin: {
      type: 'string'
    },
    shippingChargeOtherCurrency: {
      type: 'number'
    },
    packingChargeOtherCurrency: {
      type: 'number'
    }
  },
  indexes: [
    ['invoice_date', 'updatedAt'],
    ['date', 'updatedAt'],
    'updatedAt',
    'customer_id',
    'balance_amount',
    'linkedTxnList.[].linkedId',
    'customer_phoneNo',
    'date',
    'dueDate'
  ],
  required: ['businessId', 'businessCity', 'updatedAt']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'salesreturn',
        businessData.businessId
      );
      doc = lastRecord || null;
    }

    if (!doc) {
      // the first pull does not have a start-document
      doc = {
        sales_return_number: '0',
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
    getSalesReturn(lastId: "${doc.sales_return_number}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      customer_id,
      company_name,
      mobile_no,
      customer_name,
      customerGSTNo,
      customerGstType,
      customer_address
      customer_phoneNo
      customer_city
      customer_emailId
      customer_pincode
      invoice_number,
      sequenceNumber,
      saleSequenceNumber,
      sales_return_number,
      invoice_date,
      date,
      is_roundoff,
      round_amount,
      total_amount,
      rounded_amount,
      balance_amount,
      is_credit,
      payment_type,
      paid_amount,
      linkPayment,
      linked_amount
      discount_percent,
      discount_amount,
      discount_type,
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
        mrp,
        purchased_price,
        offer_price,
        size,
        qty,
        taxType,
        stockQty,
        cgst,
        sgst,
        igst,
        cess,
        igst_amount,
        cgst_amount,
        sgst_amount,
        amount,
        isEdit,
        roundOff,
        taxIncluded,
        brandName,
        categoryLevel2,
        categoryLevel2DisplayName,
        categoryLevel3,
        categoryLevel3DisplayName,
        vendorName,
        vendorPhoneNumber,
        mrp_before_tax,
        discount_percent,
        discount_amount,
        discount_type,
        discount_amount_per_item,
        returnChecked,
        vendorName,
        vendorPhoneNumber,
        wastagePercentage,
        wastageGrams,
        grossWeight,
        netWeight,
        purity
        makingChargePercent
        makingChargeAmount
        makingChargeType
        makingChargePerGramAmount
        finalMRPPrice
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
            itemNumber
            originalDiscountPercent
            dailyRate
            hallmarkCharge
            certificationCharge
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
              productId
              description
              batchId
              brandName
              categoryLevel2
              categoryLevel2DisplayName
              categoryLevel3
              categoryLevel3DisplayName
              stockQty
              hsn
              barcode
            }
            startPackingNo
            endPackingNo
            totalPackingNos
            netWeightPerPackage
            grossWeightPerPackage
            totalPackageNetWeight
            totalPackageGrossWeight
            mrpOtherCurrency
            amountOtherCurrency
            discountOtherCurrency
            warrantyDays
            warrantyEndDate
            purchased_price_before_tax
            serialOrImeiNo
        },
      employeeId,
      updatedAt,
      posId,
      deleted,
      sub_total,
      bankAccount,
      bankAccountId,
      bankPaymentType,
      waiter_name,
      waiter_phoneNo,
      paymentReferenceNumber,
      notes
      prefix
      subPrefix
      customerState
      customerCountry
      packing_charge,
      shipping_charge,
      return_discount_amount
      tcsAmount
      tcsName
      tcsRate
      tcsCode
      dueDate
      tdsAmount
      tdsName
      tdsRate
      tdsCode
      customerPanNumber
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
      isCancelled
      isSyncedToServer
      invoiceStatus
      tallySyncedStatus
      tallySynced
      salesEmployeeName
      salesEmployeeId
      salesEmployeePhoneNumber
      calculateStockAndBalance
      saleTotalAmount
      shippingTax {
        cgst
        sgst
        igst
        cgstAmount
        sgstAmount
        igstAmount
    }
      packingTax {
          cgst
          sgst
          igst
          cgstAmount
          sgstAmount
          igstAmount
      }
      amendmentDate
      amended
      amendmentReason
      discountPercentForAllItems
      insurance {
        amount
        percent
        type
        policyNo
        cgst
        sgst
        igst
        cgstAmount
        sgstAmount
        igstAmount
        amountOtherCurrency
    }
      imageUrls
      oldSequenceNumber
      placeOfReceiptByPreCarrier
      vesselFlightNo
      portOfLoading
      portOfDischarge
      otherReference
      billOfLadingNo
      terms
      buyerOtherBillTo {
        id
        phoneNo
        name
        address
        pincode
        city
        state
        country
        email
        gstNo
        gstType
        pan
        aadhar
        tradeName
        legalName
        regNo
      }
      totalOtherCurrency
      exportCountryOrigin
      shippingChargeOtherCurrency
      packingChargeOtherCurrency
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
    mutation setSalesReturn($input: SalesReturnInput) {
      setSalesReturn(salesReturn: $input) {
        sales_return_number
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

export const salesreturnSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.salesreturn.syncGraphQL({
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
        return await schemaSync.validateSalesReturnDocumentBeforeSync(doc);
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
