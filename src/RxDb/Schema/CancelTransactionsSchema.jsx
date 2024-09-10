import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const CancelTransactionsSchema = {
  title: 'CancelTransactionsSchema Schema',
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
    cancelledDate: {
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
    cancelledEmployeeName: {
      type: 'string'
    },
    cancelledEmployeePhoneNumber: {
      type: 'string'
    },
    reason: {
      type: 'string'
    },
    gstNumber: {
      type: 'string'
    },
    irn: {
      type: 'string'
    }
  },
  indexes: [['createdDate', 'updatedAt'], 'updatedAt'],
  required: ['businessId', 'businessCity', 'updatedAt', 'posId']
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
        'alltransactionscancelled',
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
        id: 0,
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
    mutation setCancelTransactions($input: CancelTransactionsInput) {
      setCancelTransactions(cancelTransactions: $input) {
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

const pullQueryBuilderInBackground = greenlet(async (doc) => {


  const BATCH_SIZE = 30;
  const query = `{
      getCancelledTransactions(lastId: "${doc.id}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE}, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        id
        transactionId
        sequenceNumber
        transactionType
        createdDate
        cancelledDate
        businessId
        businessCity
        total
        balance
        updatedAt
        posId
        restored
        data
        cancelledEmployeeName
        cancelledEmployeePhoneNumber
        reason
        gstNumber
        irn
        deleted
        }
  }`;

  return {
    query,
    variables: {}
  };
});

export const retrieveCancelTransactionsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.alltransactionscancelled.syncGraphQL({
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
        return await schemaSync.validateCancelDocumentBeforeSync(doc);
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
