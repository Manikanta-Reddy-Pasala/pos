import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const RetrieveDeletedTransactionsSchema = {
  title: 'RetrieveDeletedTransactions Schema',
  description: '',
  version: 1,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true
    },
    transactionId: {
      type: 'string'
    },
    sequenceNumber: {
      type: 'string'
    },
    transactionType: {
      type: 'string'
    },
    createdDate: {
      type: 'string',
      format: 'date'
    },
    deletedDate: {
      type: 'string',
      format: 'date'
    },
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    total: {
      type: 'number'
    },
    balance: {
      type: 'number'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    restored: {
      type: 'boolean'
    },
    data: {
      type: 'string'
    },
    deletedEmployeeName: {
      type: 'string'
    },
    deletedEmployeePhoneNumber: {
      type: 'string'
    }
  },
  indexes: [['createdDate', 'updatedAt'], 'updatedAt'],
  required: ['businessId', 'businessCity', 'updatedAt', 'posId']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'alltransactionsdeleted',
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
      id: 0,
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
      getDeletedTransactions(lastId: "${doc.id}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE}, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        id
        transactionId
        sequenceNumber
        transactionType
        createdDate
        deletedDate
        businessId
        businessCity
        total
        balance
        updatedAt
        posId
        restored
        data
        deletedEmployeeName
        deletedEmployeePhoneNumber
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
    mutation setRetrieveDeletedTransactions($input: RetrieveDeletedTransactionsInput) {
      setRetrieveDeletedTransactions(retrieveDeletedTransactions: $input) {
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


export const retrieveDeletedTransactionsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.alltransactionsdeleted.syncGraphQL({
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
        return await schemaSync.validateAllTransactionsDeletedDocumentBeforeSync(
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
