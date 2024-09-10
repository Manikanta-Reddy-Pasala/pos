import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const BusinessCategoriesLevel1Schema = {
  title: 'Categories Level1 Schema',
  description: 'Business Categories Level1 Schema',
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
     * nothing but levlel-1 category name
     */
    categoryId: {
      type: 'string',
      primary: true
    },
    globalCategory: {
      type: 'object',
      uniqueItems: true,
      name: {
        name: {
          type: 'string'
        },
        displayName: {
          type: 'string'
        },
        imgurl: {
          type: 'string'
        }
      }
    },
    level1Category: {
      type: 'object',
      name: {
        type: 'string'
      },
      displayName: {
        type: 'string'
      },
      imgurl: {
        type: 'string'
      }
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'updatedAt']
};

export const pullQueryBuilder = async (doc) => { // todo mani

  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    /**
     * start
     * check if user clicked on switch business
     * if yes then get last updated record of the business and pull from that document
     */
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'businesscategorieslevel1',
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

    return pullQueryBuilderInBackground(doc, businessData);


  }
};


const pullQueryBuilderInBackground = greenlet(async (doc, businessData) => {

  let query = '';
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
    doc.posId = localStorage.getItem('posId') || 1;
  }
  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  ////console.log('inside pull query businesscategoriesLevel1::', doc);
  const BATCH_SIZE = 30;

  query = `{
    getBusinessCategoriesLevel1(lastId: "${doc.categoryId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
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


export const pushQueryBuilder = async (doc) => {
  let query = '';
  if (window.navigator.onLine) {
    if (!doc.posId) {
      doc.posId = localStorage.getItem('posId') || 1;
    }
    const currentUpdatedAt = Date.now();
    if (!(doc.updatedAt <= currentUpdatedAt)) {
      doc.updatedAt = currentUpdatedAt;
    }
    console.debug('inside push query businesscategories::', doc);

    query = `
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
  }
};

export const businesscategoriesLevel1QueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  const syncBuilder = db.businesscategorieslevel1.syncGraphQL({
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
        return await schemaSync.validateBusinessCategoriesLevel1DocumentBeforeSync(
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

  return syncBuilder;
};
