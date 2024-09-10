import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const BusinessCategoriesSchema = {
  title: 'Business Categories Schema',
  description: 'Business Categories Schema',
  version: 1,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    /**
     * nothing but levlel-2 category name
     */
    categoryId: {
      type: 'string',
      primary: true
    },
    level2Category: {
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
    level3Categories: {
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
          imgurl: {
            type: 'string'
          },
          count: {
            type: 'number'
          }
        }
      }
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    }
  },
  required: ['businessId', 'businessCity', 'updatedAt'],
  indexes: [
    'updatedAt',
    'level2Category.name',
    'level2Category.displayName', // <- this will create a simple index for the `firstName` field
    'level3Categories.[].name',
    'level3Categories.[].displayName'
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
        'businesscategories',
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


const pushQueryBuilderInBackground = greenlet(async (doc, localStoragePosId) => {
  if (!doc.posId) {
    doc.posId = parseInt(localStoragePosId);
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setBusinessCategories($input: BusinessCategoriesInput) {
      setBusinessCategories(businessCategories: $input) {
        categoryId,
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
      categoryId: '0',
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
    getBusinessCategories(lastId: "${doc.categoryId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      categoryId
      businessId
      businessCity
      level2Category {
        name
        displayName
        count
        imgurl
      }
      level3Categories {
        name
        displayName
        count
        imgurl
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

export const businesscategoriesQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  // console.log("syncURL",syncURL);
  return db.businesscategories.syncGraphQL({
    url: syncURL,
    // headers: {
    //   Authorization: 'Bearer ' + token
    // },
    // push: {
    //   batchSize,
    //   queryBuilder: pushQueryBuilder
    // },
    pull: {
      queryBuilder: pullQueryBuilder
      /**
       *  Modifies all pushed documents before they are send to the GraphQL endpoint.
       * Returning null will skip the document.
       */
      // modifier: async (doc) => {
      //   return await schemaSync.validateBusinessCategoriesDocumentBeforeSync(
      //     doc
      //   );
      // }
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
