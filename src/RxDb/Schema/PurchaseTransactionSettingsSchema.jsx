import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const PurchaseTransactionSettingsSchema = {
  title: 'Purchase Transaction Settings Schema table',
  description: '',
  version: 3,
  type: 'object',
  properties: {
    businessId: {
      type: 'string',
      primary: true
    },
    businessCity: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    terms: {
      type: 'string'
    },
    enableTDS: {
      type: 'boolean'
    },
    enableTCS: {
      type: 'boolean'
    },
    updatePurchasePriceFromTransaction: {
      type: 'boolean'
    },
    enableOnTxn: {
      type: 'object',
      properties: {
        productLevel: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              displayName: {
                type: 'string'
              },
              enabled: {
                type: 'boolean'
              }
            }
          }
        },
        billLevel: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              displayName: {
                type: 'string'
              },
              enabled: {
                type: 'boolean'
              }
            }
          }
        }
      }
    },
    displayOnBill: {
      type: 'object',
      properties: {
        productLevel: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              displayName: {
                type: 'string'
              },
              enabled: {
                type: 'boolean'
              }
            }
          }
        },
        billLevel: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string'
              },
              displayName: {
                type: 'string'
              },
              enabled: {
                type: 'boolean'
              }
            }
          }
        }
      }
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'updatedAt', 'posId']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'purchasetransactionsettings',
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
      purchaseTransactionSettings(lastId: "${doc.businessId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        businessId
        businessCity
        updatedAt
        posId
        terms
        updatePurchasePriceFromTransaction
        enableTDS
        enableTCS
        enableOnTxn{
          productLevel{
            name
            displayName
            enabled
          }
          billLevel{
            name
            displayName
            enabled
          }
        }
        displayOnBill{
          productLevel{
            name
            displayName
            enabled
          }
          billLevel{
            name
            displayName
            enabled
          }
        }
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
    mutation setPurchaseTransactionSettings($input: PurchaseTransactionSettingsInput) {
      setPurchaseTransactionSettings(purchaseTransactionSettings: $input) {
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


export const purchaseTransactionSettingsQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.purchasetransactionsettings.syncGraphQL({
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
        return await schemaSync.validatePurchaseTransactionSettingsDocumentBeforeSync(
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
