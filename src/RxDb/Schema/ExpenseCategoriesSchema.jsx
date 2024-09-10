import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const ExpenseCategoriesSchema = {
  title: 'Expense category table',
  description: 'List of Expense categories',
  version: 3,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    categoryId: {
      type: 'string',
      primary: true
    },
    category: {
      type: 'string'
    },
    amount: {
      type: 'number'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    expenseType: {
      type: 'string'
    },
    tallySyncedStatus: {
      type: 'string'
    },
    tallySynced: {
      type: 'boolean'
    }
  },
  indexes: ['updatedAt'],
  required: [
    'businessId',
    'businessCity',
    'categoryId',
    'category',
    'updatedAt'
  ]
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();

  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;

    /**
     * Start
     * Check if user clicked on switch business
     * If yes then get the last updated record of the business and pull from that document
     */
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'expensecategories',
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


const pullQueryBuilderInBackground = greenlet(async (doc, businessData, localStoragePosId) => {

  if (!doc) {
    // The first pull does not have a start-document
    doc = {
      category: '0',
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
    getExpenseCategories(lastId: "${doc.category}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      categoryId
      businessId
      businessCity
      category
      amount
      expenseType
      tallySyncedStatus
      tallySynced
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
    doc.posId = parseInt(localStoragePosId);
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setExpenseCategories($input: ExpenseCategoriesInput) {
      setExpenseCategories(expenses: $input) {
        category,
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

export const expensecategoriesSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.expensecategories.syncGraphQL({
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
        return await schemaSync.validateExpenseCategoriesDocumentBeforeSync(
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
