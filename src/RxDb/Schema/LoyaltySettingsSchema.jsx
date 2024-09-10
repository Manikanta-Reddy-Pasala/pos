import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const LoyaltySettingsSchema = {
  title: 'LoyaltySettings Schema',
  version: 0,
  type: 'object',
  properties: {
    amountPerPoint: {
      type: 'number'
    },
    minValueToEarnPoints: {
      type: 'number'
    },
    pointExpiry: {
      type: 'boolean'
    },
    expiryDays: {
      type: 'number'
    },
    pointPerAmount: {
      type: 'number'
    },
    minValueForRedemption: {
      type: 'number'
    },
    minRedemptionPoints: {
      type: 'number'
    },
    maxRedemptionPoints: {
      type: 'number'
    },
    maxDiscount: {
      type: 'number'
    },
    otpRequired: {
      type: 'boolean'
    },
    enableRedemption: {
      type: 'boolean'
    },
    updatedAt: {
      type: 'number'
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
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'posId', 'updatedAt']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;
    ;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'loyaltysettings',
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

const pullQueryBuilderInBackground = greenlet(async (doc, localStoragePosId, businessData) => {
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
        getLoyaltySettings(lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE}, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
            amountPerPoint
            minValueToEarnPoints
            pointExpiry
            expiryDays
            pointPerAmount
            minValueForRedemption
            minRedemptionPoints
            maxRedemptionPoints
            maxDiscount
            otpRequired
            enableRedemption
            updatedAt
            businessId
            businessCity
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
    mutation setLoyaltySettings($input: LoyaltySettingsInput) {
      setLoyaltySettings(loyaltysettings: $input) {        
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

export const loyaltySettingsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  const syncBuilder = db.loyaltysettings.syncGraphQL({
    url: syncURL,
    // headers: {
    //   Authorization: 'Bearer ' + token
    // },
    // push: {
    //   batchSize,
    //   queryBuilder: pushQueryBuilder,
    //   /**
    //    *  Modifies all pushed documents before they are send to the GraphQL endpoint.
    //    * Returning null will skip the document.
    //    */
    //   modifier: async (doc) => {
    //     return await schemaSync.validateLoyaltySettingsDocumentBeforeSync(doc);
    //   }
    // },
    // pull: {
    //   queryBuilder: pullQueryBuilder
    // },
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