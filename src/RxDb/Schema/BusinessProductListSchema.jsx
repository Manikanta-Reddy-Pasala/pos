import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const BusinessProductSchema = {
  title: 'Business Product Schema',
  description: 'Business Product Schema',
  version: 18,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    productId: {
      type: 'string',
      primary: true
    },
    categoryLevel2: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        displayName: {
          type: 'string'
        },
        imgurl: {
          type: 'string'
        },
        count: {
          type: 'number'
        }
      }
    },
    categoryLevel3: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        displayName: {
          type: 'string'
        },
        imgurl: {
          type: 'string'
        },
        count: {
          type: 'number'
        }
      }
    },
    name: {
      type: 'string'
    },
    brandName: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    finalMRPPrice: {
      type: 'number'
    },
    purchasedPrice: {
      type: 'number'
    },
    salePrice: {
      type: 'number'
    },
    offerPrice: {
      type: 'number'
    },
    stockQty: {
      type: 'number'
    },
    taxType: {
      type: 'string'
    },
    stockReOrderQty: {
      type: 'number'
    },
    isOutOfStock: {
      type: 'boolean',
      default: false
    },
    isStockReOrderQtyReached: {
      type: 'boolean',
      default: false
    },
    imageUrl: {
      type: 'string'
    },
    secondaryImageUrls: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    batchData: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number'
          },
          batchNumber: {
            type: 'string'
          },
          finalMRPPrice: {
            type: 'number'
          },
          purchasedPrice: {
            type: 'number'
          },
          salePrice: {
            type: 'number'
          },
          offerPrice: {
            type: 'number'
          },
          mfDate: {
            type: 'string',
            format: 'date'
          },
          expiryDate: {
            type: 'string',
            format: 'date'
          },
          //this field is total stock qty field which is non editable..
          qty: {
            type: 'number'
          },
          rack: {
            type: 'string'
          },
          warehouseData: {
            type: 'string'
          },
          // batch related vendor
          vendorName: {
            type: 'string'
          },
          vendorPhoneNumber: {
            type: 'string'
          },
          freeQty: {
            type: 'number'
          },
          openingStockQty: {
            type: 'number'
          },
          saleDiscountAmount: {
            type: 'number'
          },
          saleDiscountPercent: {
            type: 'number'
          },
          saleDiscountType: {
            type: 'string'
          },
          purchaseDiscountAmount: {
            type: 'number'
          },
          purchaseDiscountPercent: {
            type: 'number'
          },
          purchaseDiscountType: {
            type: 'string'
          },
          manufacturingQty: {
            type: 'number'
          },
          freeManufacturingQty: {
            type: 'number'
          },
          barcode: {
            type: 'string'
          },
          modelNo: {
            type: 'string'
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
          }
        }
      }
    },
    adjustedData: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'number'
          },
          purchasedPrice: {
            type: 'number'
          },
          adjustedDate: {
            type: ['string', 'null'],
            format: 'date'
          },
          adjustedType: {
            type: 'string'
          },
          batchNumber: {
            type: 'string'
          },
          oldQty: {
            type: 'number'
          },
          newQty: {
            type: 'number'
          },
          qty: {
            type: 'number'
          },
          reason: {
            type: 'string'
          },
          vendor: {
            type: 'string'
          },
          vendorPhoneNumber: {
            type: 'string'
          }
        }
      }
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
    taxIncluded: {
      type: 'boolean'
    },
    updatedAt: {
      type: 'number'
    },
    isOffLine: {
      type: 'boolean'
    },
    isOnLine: {
      type: 'boolean'
    },
    shareImageUrl: {
      type: 'string'
    },
    posId: {
      type: 'number'
    },
    mfDate: {
      type: 'string',
      format: 'date'
    },
    expiryDate: {
      type: 'string',
      format: 'date'
    },
    // non batch vendor data
    vendorName: {
      type: 'string'
    },
    vendorPhoneNumber: {
      type: 'string'
    },
    rack: {
      type: 'string'
    },
    warehouseData: {
      type: 'string'
    },
    enableQuantity: {
      type: 'boolean'
    },
    unitName: {
      type: 'string'
    },
    unitQty: {
      type: 'number'
    },
    serialOrImeiNo: {
      type: 'string'
    },
    saleDiscountAmount: {
      type: 'number'
    },
    saleDiscountPercent: {
      type: 'number'
    },
    saleDiscountType: {
      type: 'string'
    },
    purchaseDiscountAmount: {
      type: 'number'
    },
    purchaseDiscountPercent: {
      type: 'number'
    },
    purchaseDiscountType: {
      type: 'string'
    },
    purchaseCgst: {
      type: 'number'
    },
    purchaseSgst: {
      type: 'number'
    },
    purchaseIgst: {
      type: 'number'
    },
    purchaseCess: {
      type: 'number'
    },
    purchaseTaxIncluded: {
      type: 'boolean'
    },
    purchaseTaxType: {
      type: 'string'
    },
    productType: {
      type: 'string'
    },
    freeQty: {
      type: 'number'
    },
    openingStockQty: {
      type: 'number'
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
    rawMaterialData: {
      type: 'object',
      properties: {
        rawMaterialList: {
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
              batch_id: {
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
              cess: {
                type: 'number'
              },
              taxType: {
                type: 'string'
              },
              igst_amount: {
                type: 'number'
              },
              cgst_amount: {
                type: 'number'
              },
              sgst_amount: {
                type: 'number'
              },
              taxIncluded: {
                type: 'boolean'
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
              item_name: {
                type: 'string'
              },
              qty: {
                type: 'number'
              },
              purchased_price: {
                type: 'number'
              },
              purchased_price_before_tax: {
                type: 'number'
              },
              estimate: {
                type: 'number'
              },
              hsn: {
                type: 'string'
              },
              isEdit: {
                type: 'boolean'
              },
              barcode: {
                type: 'string'
              },
              sku: {
                type: 'string'
              },
              unitConversionQty: {
                type: 'number'
              },
              freeQty: {
                type: 'number'
              },
              stockQty: {
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
              }
            }
          }
        },
        total: {
          type: 'number'
        },
        subTotal: {
          type: 'number'
        },
        directExpenses: {
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
        }
      }
    },
    modelNo: {
      type: 'string'
    },
    makingChargePerGram: {
      type: 'number'
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    calculateStockAndBalance: {
      type: 'boolean'
    },
    shortCutCode: {
      type: 'string'
    },
    serialData: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          serialImeiNo: {
            type: 'string'
          },
          soldStatus: {
            type: 'boolean'
          },
          purchased: {
            type: 'boolean'
          },
          purchaseReturn: {
            type: 'boolean'
          },
          replacement: {
            type: 'boolean'
          }
        }
      }
    },
    grossWeight: {
      type: 'number'
    },
    stoneWeight: {
      type: 'number'
    },
    netWeight: {
      type: 'number'
    },
    wastagePercentage: {
      type: 'number'
    },
    wastageGrams: {
      type: 'number'
    },
    makingChargePercent: {
      type: 'number'
    },
    makingChargeAmount: {
      type: 'number'
    },
    stoneCharge: {
      type: 'number'
    },
    purity: {
      type: 'string'
    },
    hallmarkUniqueId: {
      type: 'string'
    },
    additional_property_group_list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          groupId: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          min_choices: {
            type: 'number'
          },
          max_choices: {
            type: 'number'
          },
          additional_property_list: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                additional_property_id: {
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
                tax_included: {
                  type: 'boolean'
                },
                taxType: {
                  type: 'string'
                },
                group_name: {
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
    },
    rateData: {
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
        }
      }
    },
    pdfImageUrl: {
      type: 'string'
    },
    hallmarkCharge: {
      type: 'number'
    },
    certificationCharge: {
      type: 'number'
    },
    onlineLink: {
      type: 'string'
    },
    batchCreatedFromManufacture: {
      type: 'boolean'
    },
    warrantyDays: {
      type: 'number'
    },
    partNumber: {
      type: 'string'
    }
  },
  required: ['businessId', 'businessCity', 'productId', 'updatedAt'],
  indexes: [
    'updatedAt',
    'categoryLevel3.name', // <- this will create a simple index for the `firstName` field
    'categoryLevel2.name',
    'barcode',
    'batchData.[].batchNumber',
    'batchData.[].rack',
    'mfDate',
    'expiryDate',
    'batchData.[].mfDate',
    'batchData.[].expiryDate',
    'batchData.[].barcode',
    'serialData.[].serialImeiNo'
  ]
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
        'businessproduct',
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

    if (!doc) {
      // the first pull does not have a start-document
      doc = {
        productId: '0',
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

    return pullQueryBuilderInBackground(doc);
  }
  return null;
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
    mutation setBusinessProduct($input: ProductInput) {
      setBusinessProduct(product: $input) {
        productId,
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

const pullQueryBuilderInBackground = greenlet(async (doc) => {


  const BATCH_SIZE = 30;
  const query = `{
    getBusinessProduct(lastId: "${doc.productId}", lastUpdatedAt: ${doc.updatedAt}, limit: ${BATCH_SIZE}, posId: ${doc.posId},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      productId
      name
      brandName
      description
      finalMRPPrice
      purchasedPrice
      salePrice
      offerPrice
      stockQty
      taxType
      stockReOrderQty
      isOutOfStock
      isStockReOrderQtyReached
      imageUrl
      secondaryImageUrls
      cgst
      sgst
      igst
      cess
      barcode
      sku
      hsn
      taxIncluded
      updatedAt
      isOffLine
      isOnLine
      shareImageUrl
      deleted
      categoryLevel2 {
        name
        displayName
        count
        imgurl
      }
      categoryLevel3 {
        name
        displayName
        count
        imgurl
      }
      adjustedData{
        purchasedPrice
        adjustedDate
        adjustedType
        batchNumber
        oldQty
        newQty
        qty
        reason
        vendor
        vendorPhoneNumber
      }
      batchData{
        id
        batchNumber
        properties{
          title
          value
        }
        finalMRPPrice
        purchasedPrice
        salePrice
        offerPrice
        mfDate
        expiryDate
        qty
        rack
        warehouseData
        vendorName
        vendorPhoneNumber
        freeQty
        openingStockQty
        saleDiscountAmount
        saleDiscountPercent
        saleDiscountType
        purchaseDiscountAmount
        purchaseDiscountPercent
        purchaseDiscountType
        manufacturingQty
        freeManufacturingQty
        barcode
        modelNo
      }
      posId
      mfDate
      expiryDate
      rack
      warehouseData
      enableQuantity
      unitName
      unitQty,
      serialOrImeiNo
      saleDiscountAmount
      saleDiscountPercent
      saleDiscountType
      purchaseDiscountAmount
      purchaseDiscountPercent
      purchaseDiscountType
      purchaseCgst
      purchaseSgst
      purchaseIgst
      purchaseCess
      purchaseTaxIncluded
      purchaseTaxType
      productType
      freeQty
      openingStockQty
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
      modelNo
      makingChargePerGram
      isSyncedToServer
      calculateStockAndBalance
      shortCutCode
      serialData {
        serialImeiNo
        soldStatus
        purchased
        purchaseReturn
        replacement
      }
      grossWeight
      stoneWeight
      netWeight
      wastagePercentage
      wastageGrams
      makingChargePercent
      makingChargeAmount
      stoneCharge
      purity
      hallmarkUniqueId
      additional_property_group_list {
        groupId
        name
        min_choices
        max_choices
        additional_property_list {
          additional_property_id
          name
          price
          type
          offline
          cgst
          sgst
          igst
          cess
          tax_included
          taxType
          group_name
          purchasedPrice
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
      rateData { 
        id
        metal
        purity
        rateByGram
      }
      pdfImageUrl
      hallmarkCharge
      certificationCharge
      onlineLink
      batchCreatedFromManufacture
      warrantyDays
      partNumber
      rawMaterialData {
        rawMaterialList {
          product_id
          description
          batch_id
          cgst
          sgst
          igst
          cess
          taxType
          igst_amount
          cgst_amount
          sgst_amount
          taxIncluded
          discount_percent
          discount_amount
          discount_amount_per_item
          discount_type
          brandName
          categoryLevel2
          categoryLevel2DisplayName
          categoryLevel3
          categoryLevel3DisplayName
          item_name
          qty
          purchased_price
          purchased_price_before_tax
          estimate
          hsn
          isEdit
          barcode
          sku
          unitConversionQty
          freeQty
          stockQty
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
          units
          originalPurchasePriceWithoutConversionQty
          mfDate
          expiryDate
          rack
          warehouseData
          }
          total
          subTotal
          directExpenses {
            name
            amount
          }
      }
    }
}`;

  return {
    query,
    variables: {}
  };
});

export const businessproductSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.businessproduct.syncGraphQL({
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
        return await schemaSync.validateBusinessProductDocumentBeforeSync(doc);
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
    liveInterval: 1000 * 60 * 2,
    autoStart: true,
    retryTime: 1000 * 60 * 10,
    deletedFlag: 'deleted'
  });
};
