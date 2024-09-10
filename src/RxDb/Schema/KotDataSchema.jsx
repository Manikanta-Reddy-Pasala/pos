import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const KotSchema = {
  title: 'KOT Schema',
  version: 5,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true
    },
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    categoryId: {
      type: 'string'
    },
    categoryName: {
      type: 'string'
    },
    tableId: {
      type: 'string'
    },
    tableNumber: {
      type: 'string'
    },
    chairsAvailableInString: {
      type: 'string'
    },
    chairsUsedInString: {
      type: 'string'
    },
    toServe: {
      type: 'number'
    },
    chairsData: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          chairNumber: {
            type: 'string'
          },
          isOccupied: {
            type: 'boolean'
          }
        }
      }
    },
    ordersData: {
      type: 'array',
      order: {
        type: 'object',
        properties: {
          sequenceNumber: {
            type: 'number'
          },
          invoice_number: {
            type: 'string'
            //consider this as primary key
          },
          prefix: {
            type: 'string'
          },
          subPrefix: {
            type: 'string'
          },
          waiter_name: {
            type: 'string'
          },
          waiter_phoneNo: {
            type: 'string'
          },
          customer_id: {
            type: 'string'
          },
          customer_name: {
            type: 'string'
          },
          customer_phoneNo: {
            type: 'string'
          },
          invoice_date: {
            type: 'string',
            format: 'date'
          },
          numberOfPax: {
            type: 'number'
          },
          chairsUsedInString: {
            type: 'string'
          },
          total_amount: {
            type: 'number'
          },
          customerGSTNo: {
            type: 'string'
          },
          customer_address: {
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
          is_roundoff: {
            type: 'boolean'
          },
          round_amount: {
            type: 'number'
          },
          payment_type: {
            type: 'string'
          },
          balance_amount: {
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
          packing_charge: {
            type: 'number'
          },
          shipping_charge: {
            type: 'number'
          },
          categoryId: {
            type: 'string'
          },
          categoryName: {
            type: 'string'
          },
          tableNumber: {
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
          customerGSTType: {
            type: 'string'
          },
          customerState: {
            type: 'string'
          },
          customerCountry: {
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
          menuType: {
            type: 'string'
          },
          subTotal: {
            type: 'number'
          },
          // items list with data
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string'
                },
                product_id: {
                  type: 'string'
                },
                batch_id: {
                  type: 'number'
                },
                served: {
                  type: 'boolean'
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
                batchNumber: {
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
                taxType: {
                  type: 'string'
                },
                originalDiscountPercent: {
                  type: 'number'
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
                }
              }
            }
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
    employeeId: {
      type: 'string'
    }
  },
  indexes: ['categoryName', 'tableNumber', 'updatedAt'],
  required: ['id', 'businessId', 'businessCity', 'categoryName', 'updatedAt']
};

export const pullQueryBuilder = async (doc) => {
  const isHotelOrRestaurant = localStorage.getItem('isHotelOrRestaurant');

  if (isHotelOrRestaurant) {
    const businessData = await Bd.getBusinessData();
    if (
      window.navigator.onLine &&
      !(businessData.businessId === undefined || businessData.businessId === '')
    ) {
      if (doc && doc.businessId !== businessData.businessId) {
        let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
          'kotdata',
          businessData.businessId
        );
        doc = lastRecord || null;
      }
      return pullQueryBuilderInBackground(doc, businessData);
    }
  }
  return null;
};

export const pushQueryBuilder = async (doc) => {
  if (window.navigator.onLine) {
    return pushQueryBuilderInBackground(doc);
  }
  return null;
};

const pullQueryBuilderInBackground = greenlet(async (doc, businessData) => {
  if (!doc) {
    doc = {
      phoneNumber: '0',
      updatedAt: 0,
      posId: businessData.posDeviceId,
      businessId: businessData.businessId,
      businessCity: businessData.businessCity
    };
  }

  // Attempt to parse doc.posId as an integer, default to 1 if not a valid integer
  doc.posId = Number.isInteger(doc.posId)
    ? doc.posId
    : Number.isInteger(Number(localStorage.getItem('posId')))
      ? Number(localStorage.getItem('posId'))
      : 1;

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const BATCH_SIZE = 30;

  const query = `{
    getKotData(lastId: "${doc.id}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      id
      businessId
      businessCity
      categoryId
      categoryName
      tableId
      tableNumber
      chairsAvailableInString
      chairsUsedInString
      toServe
      chairsData {
        chairNumber
        isOccupied
      }
      ordersData {
        sequenceNumber
        invoice_number
        prefix
        subPrefix
        waiter_name
        waiter_phoneNo
        customer_id
        customer_name
        customer_phoneNo
        invoice_date
        numberOfPax
        chairsUsedInString
        total_amount
        customerGSTNo
        customer_address
        customer_city
        customer_emailId
        customer_pincode
        is_roundoff
        round_amount
        payment_type
        balance_amount
        discount_percent
        discount_amount
        discount_type
        packing_charge
        shipping_charge
        categoryId
        categoryName
        tableNumber
        paymentReferenceNumber
        customerGSTType
        customerState
        customerCountry
        splitPaymentList {
          id
          paymentType
          referenceNumber
          paymentMode
          accountDisplayName
          bankAccountId
          amount
        }
        menuType
        subTotal
        items {
          id
          product_id
          batch_id
          served
          unit
          hsn
          item_name
          sku
          barcode
          mrp
          purchased_price
          offer_price
          mrp_before_tax
          size
          qty
          cgst
          sgst
          igst
          cgst_amount
          sgst_amount
          igst_amount
          cess
          amount
          isEdit
          taxIncluded
          roundOff
          returnedQty
          stockQty
          vendorName
          vendorPhoneNumber
          brandName
          categoryLevel2
          categoryLevel2DisplayName
          categoryLevel3
          categoryLevel3DisplayName
          batchNumber
          discount_percent
          discount_amount
          discount_amount_per_item
          discount_type
          taxType
          originalDiscountPercent
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
        }
      }
      updatedAt
      posId
      deleted
    }
}`;

  return {
    query,
    variables: {}
  };
});

const pushQueryBuilderInBackground = greenlet(async (doc) => {
  doc.posId = Number.isInteger(doc.posId)
    ? doc.posId
    : Number.isInteger(Number(localStorage.getItem('posId')))
      ? Number(localStorage.getItem('posId'))
      : 1;

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setKotData($input: KotInput) {
      setKotData(kotData: $input) {
        id
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


let canPull = true;

export const kotSyncQueryBuilder = (db, syncURL, batchSize, posId, token) => {
  return db.kotdata.syncGraphQL({
    url: syncURL,
    pull: {
      queryBuilder: (doc) => {
        if (canPull) {
          return pullQueryBuilder(doc);
        } else {
          return null; // Skip the pull operation if canPull is false
        }
      }
    },
    push: {
      batchSize,
      queryBuilder: (doc) => {
        canPull = false; // Set canPull to false before the push operation
        setTimeout(() => {
          canPull = true; // Set canPull to true 1 minute after the push operation
        }, 1000 * 60);
        return pushQueryBuilder(doc);
      }
    },
    live: true,
    liveInterval: 1000 * 60,
    autoStart: true,
    retryTime: 1000 * 60 * 5,
    deletedFlag: 'deleted'
  });
};
