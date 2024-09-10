import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';
import * as Bd from '../../components/SelectedBusiness';

export const SessionGroupSchema = {
  title: 'Session Group table',
  description: 'List of Session Group txn',
  version: 0,
  type: 'object',
  properties: {
    sessionGroupId: {
      type: 'string',
      primary: true
    },
    businessId: {
      type: 'string'
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
    date: {
      type: 'string'
    },
    noOfSession: {
      type: 'number'
    },
    totalAmount: {
      type: 'number'
    },
    amount: {
      type: 'number'
    },
    perSession: {
      type: 'boolean'
    },
    sessionList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          sessionId: {
            type: 'string'
          },
          sessionDate: {
            type: 'string'
          },
          doctorName: {
            type: 'string'
          },
          doctorPhoneNo: {
            type: 'string'
          },
          doctorId: {
            type: 'string'
          },
          sessionStartTime: {
            type: 'string'
          },
          sessionEndTime: {
            type: 'string'
          },
          sessionNotes: {
            type: 'object',
            properties: {
              imageUrl: 'array',
              message: 'string'
            }
          },
          status: {
            type: 'string'
          },
          amount: {
            type: 'number'
          },
          saleDetail: {
            type: 'object',
            properties: {
              saleId: {
                type: 'string'
              },
              sequenceNumber: {
                type: 'string'
              },
              saleDate: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    customerId: {
      type: 'string'
    },
    customerName: {
      type: 'string'
    },
    customerGSTNo: {
      type: 'string'
    },
    customerGstType: {
      type: 'string'
    },
    customerAddress: {
      type: 'string'
    },
    customerPhoneNo: {
      type: 'string'
    },
    customerCity: {
      type: 'string'
    },
    customerEmailId: {
      type: 'string'
    },
    customerPincode: {
      type: 'string'
    },
    customerState: {
      type: 'string'
    },
    customerCountry: {
      type: 'string'
    },
    customerTradeName: {
      type: 'string'
    },
    customerLegalName: {
      type: 'string'
    },
    customerRegistrationNumber: {
      type: 'string'
    },
    customerPanNumber: {
      type: 'string'
    },
    customerAadharNumber: {
      type: 'string'
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
        'sessiongroup',
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
    // the first pull does not have a start-document
    doc = {
      sessionGroupId: '0',
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
      getSessionGroup(lastId: "${doc.sessionGroupId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      sessionGroupId
      updatedAt
      businessId
      businessCity
      customerId
      customerName
      customerGSTNo
      customerGstType
      customerAddress
      customerPhoneNo
      customerCity
      customerEmailId
      customerPincode
      customerState
      customerCountry
      customerTradeName
      customerLegalName
      customerRegistrationNumber
      customerPanNumber
      customerAadharNumber
      date
      sessionList {
        sessionId
        sessionDate
        doctorName
        doctorPhoneNo
        doctorId
        sessionStartTime
        sessionEndTime
        sessionNotes {
          imageUrl
          message
        }
        status
        amount
        saleDetail {
          saleId
          sequenceNumber
          saleDate
        }
      }
      noOfSession
      totalAmount
      amount
      perSession
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
    mutation setSessionGroup($input: SessionGroupInput) {
      setSessionGroup(sessionGroup: $input) {
        sessionGroupId
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


export const sessionGroupSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.sessiongroup.syncGraphQL({
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
        return await schemaSync.validateSessionGroupDocumentBeforeSync(doc);
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
