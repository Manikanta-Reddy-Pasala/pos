import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const BarcodeSchema = {
  title: 'barcode settings table',
  description: 'List of barcode settings',
  version: 4,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true
    },
    name: {
      type: 'string'
    },
    label: {
      type: 'string'
    },
    header: {
      type: 'string'
    },
    line: {
      type: 'string'
    },
    footer: {
      type: 'string'
    },
    barcode: {
      type: 'string'
    },
    printType: {
      type: 'string'
    },
    barcodeValue: {
      type: 'string'
    },
    headerVal: {
      type: 'string'
    },
    lineVal: {
      type: 'string'
    },
    footerVal: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    isProduct: {
      type: 'boolean'
    },
    printStartFrom: {
      type: 'number'
    },
    addtionalTextTwo: {
      type: 'string'
    },
    addtionalTextTwoVal: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    enablePurchasePriceCode: {
      type: 'boolean'
    },
    enableMrp: {
      type: 'boolean'
    },
    enableOfferPrice: {
      type: 'boolean'
    },
    purchasePriceCode: {
      type: 'string'
    },
    mrpValue: {
      type: 'number'
    },
    offerPriceValue: {
      type: 'number'
    },
    grossWeight: {
      type: 'string'
    },
    stoneWeight: {
      type: 'string'
    },
    netWeight: {
      type: 'string'
    },
    wastage: {
      type: 'string'
    },
    stoneCharge: {
      type: 'string'
    },
    purity: {
      type: 'string'
    },
    hallmarkUniqueId: {
      type: 'string'
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'id', 'updatedAt']
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
    mutation setBarcodeSettings($input: BarcodeInput) {
      setBarcodeSettings(barcode: $input) {
        id,
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

  const BATCH_SIZE = 30;
  const query = `{
      getBarcodeSettings(lastId: "${doc.id}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE}, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        id
        name
        label
        header
        line
        footer
        barcode
        printType
        barcodeValue
        headerVal
        lineVal
        footerVal
        updatedAt
        businessId
        businessCity
        deleted
        isProduct
        printStartFrom
        addtionalTextTwo
        addtionalTextTwoVal
        description
        enablePurchasePriceCode
        enableMrp
        enableOfferPrice
        purchasePriceCode
        mrpValue
        offerPriceValue
        grossWeight
        stoneWeight
        netWeight
        wastage
        stoneCharge
        purity
        hallmarkUniqueId
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
        'barcodesettings',
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

export const barcodeSettingsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.barcodesettings.syncGraphQL({
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
        return await schemaSync.validateBarcodeSettingsDocumentBeforeSync(doc);
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
