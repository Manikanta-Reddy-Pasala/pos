import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const WhatsAppSettingsSchema = {
  title: 'WhatsAppSettings Schema',
  version: 4,
  type: 'object',
  properties: {
    whatsAppLinkedEnabled: {
      type: 'boolean'
    },
    whatsAppBarcode: {
      type: 'string'
    },
    saleTransactionAlertEnabled: {
      type: 'boolean'
    },
    purchaseTransactionAlertEnabled: {
      type: 'boolean'
    },
    saleReturnTransactionAlertEnabled: {
      type: 'boolean'
    },
    purchaseReturnTransactionAlertEnabled: {
      type: 'boolean'
    },
    estimateTransactionAlertEnabled: {
      type: 'boolean'
    },
    receivePayTransactionAlertEnabled: {
      type: 'boolean'
    },
    makePayTransactionAlertEnabled: {
      type: 'boolean'
    },
    creditPaymentReminderAlertEnabled: {
      type: 'boolean'
    },
    creditPaymentReminderAlertDays: {
      type: 'number'
    },
    templeCustomerRitualReminderAlertEnabled: {
      type: 'boolean'
    },
    templeCustomerRitualReminderAlertDays: {
      type: 'number'
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
    },
    linkedPhoneNumber: {
      type: 'string'
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'posId', 'updatedAt']
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
        getWhatsAppSettings(lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE}, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
            whatsAppLinkedEnabled
            whatsAppBarcode
            saleTransactionAlertEnabled
            purchaseTransactionAlertEnabled
            saleReturnTransactionAlertEnabled
            purchaseReturnTransactionAlertEnabled
            estimateTransactionAlertEnabled
            receivePayTransactionAlertEnabled
            makePayTransactionAlertEnabled
            creditPaymentReminderAlertEnabled
            creditPaymentReminderAlertDays
            templeCustomerRitualReminderAlertEnabled
            templeCustomerRitualReminderAlertDays
            updatedAt
            businessId
            businessCity
            linkedPhoneNumber
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
    mutation setWhatsAppSettings($input: WhatsAppSettingsInput) {
      setWhatsAppSettings(whatsappsettings: $input) {
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
  const businessData = await Bd.getBusinessData();

  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;

    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'whatsappsettings',
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

export const whatsAppSettingsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.whatsappsettings.syncGraphQL({
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
        return await schemaSync.validateWhatsAppSettingsDocumentBeforeSync(doc);
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
