import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const SchemeManagementSchema = {
  title: 'Scheme Management table',
  description: 'List of Scheme Management txn',
  version: 0,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    id: {
      type: 'string',
      primary: true
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    sequenceNumber: {
      type: 'string'
    },
    date: {
      type: 'string'
    },
    type: {
      type: 'string'
    },
    period: {
      type: 'number'
    },
    depositAmount: {
      type: 'number'
    },
    discountContribution: {
      type: 'number'
    },
    total: {
      type: 'number'
    },
    balance: {
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
    aadharNumber: {
      type: 'string'
    },
    customerDob: {
      type: 'string'
    },
    customerAnniversary: {
      type: 'string'
    },
    notes: {
      type: 'string'
    },
    schemeOrderType: {
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
        'schememanagement',
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
      id: '0',
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
    getSchemeManagement(lastId: "${doc.id}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      id
      updatedAt
      businessId
      businessCity
      isSyncedToServer
      posId
      date
      type
      period
      depositAmount
      discountContribution
      total
      balance
      linkedTxnList {
        linkedId,
        date,
        linkedAmount,
        paymentType,
        transactionNumber,
        sequenceNumber
      }
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
      aadharNumber
      customerDob
      sequenceNumber
      customerAnniversary
      notes
      schemeOrderType
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
    mutation setSchemeManagement($input: SchemeManagementInput) {
      setSchemeManagement(schemeManagement: $input) {
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


export const schemeManagementSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.schememanagement.syncGraphQL({
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
        return await schemaSync.validateSchemeManagementDocumentBeforeSync(doc);
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
