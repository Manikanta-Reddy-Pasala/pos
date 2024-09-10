import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const TaxSettingsSchema = {
  title: 'TaxSettings Schema',
  version: 3,
  type: 'object',
  properties: {
    tradeName: {
      type: 'string'
    },
    gstin: {
      type: 'string'
    },
    legalName: {
      type: 'string'
    },
    state: {
      type: 'string'
    },
    enableGst: {
      type: 'boolean'
    },
    reverseCharge: {
      type: 'boolean'
    },
    compositeScheme: {
      type: 'boolean'
    },
    compositeSchemeValue: {
      type: 'string'
    },
    posId: {
      type: 'number'
    },
    businessId: {
      type: 'string',
      primary: true
    },
    businessCity: {
      type: 'string'
    },
    dispatchAddress: {
      type: 'string'
    },
    dispatchPincode: {
      type: 'string'
    },
    dispatchState: {
      type: 'string'
    },
    dispatchCity: {
      type: 'string'
    },
    dispatchArea: {
      type: 'string'
    },
    billingAddress: {
      type: 'string'
    },
    area: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    pincode: {
      type: 'string'
    },
    compositeSchemeType: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    gstPortalUserName: {
      type: 'string'
    },
    gstPortalEvcPan: {
      type: 'string'
    },
    exporterCodeNo: {
      type: 'string'
    },
    exporterRegistrationDate: {
      type: 'string'
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'posId', 'updatedAt']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();

  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;

    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'taxsettings',
        businessData.businessId
      );

      if (lastRecord) {
        doc = lastRecord;
      } else {
        doc = null;
      }
    }

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
      getTaxSettings(lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE}, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        businessId
        businessCity
        legalName
        tradeName
        state
        gstin
        updatedAt
        deleted
        compositeScheme
        compositeSchemeValue
        reverseCharge
        enableGst
        dispatchAddress
        dispatchPincode
        dispatchState
        dispatchCity
        dispatchArea
        billingAddress
        area
        city
        pincode
        compositeSchemeType
        gstPortalUserName
        gstPortalEvcPan
        exporterCodeNo
        exporterRegistrationDate
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
    mutation setTaxSettings($input: TaxSettingsInput) {
      setTaxSettings(taxsettings: $input) {
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

export const TaxSettingsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.taxsettings.syncGraphQL({
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
        return await schemaSync.validateTaxSettingsDocumentBeforeSync(doc);
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
