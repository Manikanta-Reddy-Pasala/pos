import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const AddOnsSchema = {
  title: 'add ons table',
  description: 'List of add ons',
  version: 0,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    additionalPropertyId: {
      type: 'string',
      primary: true
    },
    name: {
      type: 'string'
    },
    price: {
      type: 'number'
    },
    type: {
      type: 'string'
    },
    offline: {
      type: 'boolean'
    },
    cgst: {
      type: 'number'
    },
    sgst: {
      type: 'number'
    },
    igst: {
      type: 'number'
    },
    cess: {
      type: 'number'
    },
    taxIncluded: {
      type: 'boolean'
    },
    taxType: {
      type: 'string'
    },
    groupName: {
      type: 'string'
    },
    groupId: {
      type: 'string'
    },
    purchasedPrice: {
      type: 'number'
    },
    productId: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    batchId: {
      type: 'number'
    },
    brandName: {
      type: 'string'
    },
    categoryLevel2: {
      type: 'string'
    },
    categoryLevel2DisplayName: {
      type: 'string'
    },
    categoryLevel3: {
      type: 'string'
    },
    categoryLevel3DisplayName: {
      type: 'string'
    },
    stockQty: {
      type: 'number'
    },
    hsn: {
      type: 'string'
    },
    barcode: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    isSyncedToServer: {
      type: 'boolean'
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'updatedAt', 'posId']
};

const pullQueryBuilderInBackground = greenlet(async (doc, businessData, localStoragePosId) => {
  let query = '';

  if (!doc) {
    doc = {
      additionalPropertyId: 0,
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
  query = `{
    getAddOns(lastId: "${doc.additionalPropertyId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      additionalPropertyId
      name
      price
      type
      offline
      cgst
      sgst
      igst
      cess
      taxType
      taxIncluded
      groupName
      groupId
      purchasedPrice
      productId
      description
      batchId
      brandName
      categoryLevel2
      categoryLevel2DisplayName
      categoryLevel3
      categoryLevel3DisplayName
      stockQty
      hsn
      barcode
      updatedAt
      businessId
      businessCity
      isSyncedToServer
      deleted
      }
}`;
  return {
    query,
    variables: {}
  };
});

const pushQueryBuilderInBackground = greenlet(async (doc, localStoragePosId) => {
  let query = '';

  if (!doc.posId) {
    doc.posId = localStoragePosId;
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  query = `
    mutation setAddOns($input: AddOnsInput) {
      setAddOns(addOns: $input) {
        additionalPropertyId
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
        'addons',
        businessData.businessId
      );

      if (lastRecord) {
        doc = lastRecord;
      } else {
        doc = null;
      }
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

export const addOnsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.addons.syncGraphQL({
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
        return await schemaSync.validateAddOnsDocumentBeforeSync(doc);
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
