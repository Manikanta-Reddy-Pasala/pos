import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import {
  getLocalStorageUserId,
} from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const TransactionSettingsSchema = {
  title: 'Transaction Settings Schema table',
  description: '',
  version: 13,
  type: 'object',
  properties: {
    businessId: {
      type: 'string',
      primary: true
    },
    businessCity: {
      type: 'string'
    },
    saleMoreThanStock: {
      type: 'boolean'
    },
    enablePasscodeForDelete: {
      type: 'boolean'
    },
    onlineOrderAccept: {
      type: 'boolean'
    },
    userId: {
      type: 'string'
    },
    passcode: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    enableEwayBillNo: {
      type: 'boolean'
    },
    enableEWayAmountLimit: {
      type: 'number'
    },
    enableEway: {
      type: 'boolean'
    },
    enableEinvoice: {
      type: 'boolean'
    },
    autoPushEWay: {
      type: 'boolean'
    },
    autoPushEInvoice: {
      type: 'boolean'
    },
    multiDeviceBillingSupport: {
      type: 'boolean'
    },
    resetSequenceNo: {
      type: 'boolean'
    },
    roundingConfiguration: {
      type: 'string'
    },
    enableCustomer: {
      type: 'boolean'
    },
    enableVendor: {
      type: 'boolean'
    },
    purchasePriceCode: {
      type: 'string'
    },
    sales: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        },
        noPrefixSequenceNo: 'number'
      }
    },
    salesReturn: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        },
        noPrefixSequenceNo: 'number'
      }
    },
    paymentIn: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        },
        noPrefixSequenceNo: 'number'
      }
    },
    paymentOut: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        },
        noPrefixSequenceNo: 'number'
      }
    },
    billTypes: {
      type: 'array'
    },
    salesQuotation: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    approval: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    jobWorkOrderIn: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    jobWorkOrderOut: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    workOrderReceipt: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    deliveryChallan: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    purchaseOrder: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    saleOrder: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    manufacture: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    expense: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    stock: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    tallyReceipt: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    scheme: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    },
    tallyPayment: {
      type: 'object',
      properties: {
        prefixes: 'string',
        subPrefixes: 'string',
        prefixesList: 'array',
        subPrefixesList: 'array',
        appendYear: 'boolean',
        prefixSequence: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              prefix: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'int'
              }
            }
          }
        }
      }
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'updatedAt', 'posId', 'userId']
};

const pullQueryBuilderInBackground = greenlet(async (doc, businessData, localStoragePosId, localStorageUserId) => {


  if (!doc) {
    doc = {
      updatedAt: 0,
      posId: businessData.posDeviceId,
      businessId: businessData.businessId,
      businessCity: businessData.businessCity,
      userId: localStorageUserId
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
    transactionSettings(lastId: "${doc.businessId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}", userId: "${doc.userId}") {
      businessId
      businessCity
      saleMoreThanStock
      enablePasscodeForDelete
      onlineOrderAccept
      enableEwayBillNo
      enableEWayAmountLimit
      enableEway
      enableEinvoice
      autoPushEWay
      autoPushEInvoice
      multiDeviceBillingSupport
      roundingConfiguration
      enableCustomer
      enableVendor
      purchasePriceCode
      sales{
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
        noPrefixSequenceNo
      }
      salesReturn{
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
        noPrefixSequenceNo
      }
      paymentIn{
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
        noPrefixSequenceNo
      }
      paymentOut{
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
        noPrefixSequenceNo
      }
      billTypes
      passcode
      userId
      salesQuotation {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      approval {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      jobWorkOrderIn {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      jobWorkOrderOut {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      workOrderReceipt {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      deliveryChallan {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      purchaseOrder {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      saleOrder {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      manufacture {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      expense {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      stock {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      tallyReceipt {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      scheme {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
      tallyPayment {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
      }
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
    mutation setTransactionSettings($input: TransactionSettingsInput) {
      setTransactionSettings(transactionSettings: $input) {
        userId,
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


export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();

  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    const localStorageUserId = getLocalStorageUserId();

    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'transactionsettings',
        businessData.businessId
      );

      if (lastRecord) {
        doc = lastRecord;
      } else {
        doc = null;
      }
    }

    return pullQueryBuilderInBackground(doc, businessData, localStoragePosId, localStorageUserId);
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

export const transactionSettingsQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.transactionsettings.syncGraphQL({
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
        return await schemaSync.validateTransactionSettingsDocumentBeforeSync(
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
