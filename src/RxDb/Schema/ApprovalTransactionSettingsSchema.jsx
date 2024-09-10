import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';
import * as Bd from '../../components/SelectedBusiness';

export const ApprovalTransactionSettingsSchema = {
  title: 'Approval Transaction Settings Schema table',
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

const pullQueryBuilderInBackground = greenlet(async (doc, businessData, localStoragePosId) => {

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
      saleApprovalTransactionSettings(lastId: "${doc.businessId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
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

const pushQueryBuilderInBackground = greenlet(async (doc, localStoragePosId) => {
  if (!doc.posId) {
    doc.posId = parseInt(localStoragePosId);
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setApprovalTransactionSettings($input: ApprovalTransactionSettingsInput) {
      setApprovalTransactionSettings(approvalTransactionSettings: $input) {
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
  if (window.navigator.onLine) {
    const businessData = await Bd.getBusinessData();
    const localStoragePosId = localStorage.getItem('posId') || 1;

    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'approvaltransactionsettings',
        businessData.businessId
      );

      doc = lastRecord || null;
    }

    return await pullQueryBuilderInBackground(doc, businessData, localStoragePosId);
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


export const approvalTransactionSettingsQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.approvaltransactionsettings.syncGraphQL({
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
        return await schemaSync.validateApprovalTransactionSettingsDocumentBeforeSync(
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
