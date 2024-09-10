import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const DeliveryChallanTransactionSettingsSchema = {
  title: 'Delivery Challan Transaction Settings Schema table',
  description: '',
  version: 2,
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

const pushQueryBuilderInBackground = greenlet(async (doc, localStoragePosId) => {
  if (!doc.posId) {
    doc.posId = parseInt(localStoragePosId);
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setDeliveryChallanTransactionSettings($input: DeliveryChallanTransactionSettingsInput) {
      setDeliveryChallanTransactionSettings(deliveryChallanTransactionSettings: $input) {
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

const pullQueryBuilderInBackground = greenlet(async (doc, businessData, localStoragePosId) => {


  if (!doc) {
    // the first pull does not have a start-document
    doc = {
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

  const BATCH_SIZE = 30;
  const query = `{
        saleDeliveryChallanTransactionSettings(lastId: "${doc.businessId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
          businessId
          businessCity
          updatedAt
          posId
          terms
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
        'deliverychallantransactionsettings',
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

    return pullQueryBuilderInBackground(doc, businessData, localStoragePosId);
  }
  return null;
};

export const deliveryChallanTransactionSettingsQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.deliverychallantransactionsettings.syncGraphQL({
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
        return await schemaSync.validateDeliveryChallanTransactionSettingsDocumentBeforeSync(
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
