import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const WorkLossSchema = {
  title: '',
  description: '',
  version: 1,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    workLossId: {
      type: 'string',
      primary: true
    },
    invoiceDate: {
      type: 'string',
      format: 'date'
    },
    jobAssignedEmployeeId: {
      type: 'string'
    },
    jobAssignedEmployeeName: {
      type: 'string'
    },
    jobAssignedEmployeePhoneNumber: {
      type: 'string'
    },
    saleSequenceNumber: {
      type: 'string'
    },
    jobWorkSequenceNumber: {
      type: 'string'
    },
    jobWorkIn: {
      type: 'object',
      properties: {
        customerId: {
          type: 'string'
        },
        customerName: {
          type: 'string'
        },
        customerPhoneNumber: {
          type: 'string'
        },
        invoiceNumber: {
          type: 'string'
        },
        sequenceNumber: {
          type: 'string'
        },
        invoiceDate: {
          type: 'string',
          format: 'date'
        },
        totalAmount: {
          type: 'number'
        }
      }
    },
    sale: {
      type: 'object',
      properties: {
        customerId: {
          type: 'string'
        },
        customerName: {
          type: 'string'
        },
        customerPhoneNumber: {
          type: 'string'
        },
        invoiceNumber: {
          type: 'string'
        },
        sequenceNumber: {
          type: 'string'
        },
        invoiceDate: {
          type: 'string',
          format: 'date'
        },
        totalAmount: {
          type: 'number'
        }
      }
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    netWeightLoss: {
      type: 'number'
    },
    weightIn: {
      type: 'number'
    },
    weightOut: {
      type: 'number'
    }
  },
  indexes: [
    ['invoiceDate', 'updatedAt'],
    'updatedAt',
    'posId',
    'invoiceDate',
    'jobAssignedEmployeeId',
    'jobAssignedEmployeeName',
    'jobAssignedEmployeePhoneNumber',
    'saleSequenceNumber',
    'jobWorkSequenceNumber'
  ],
  required: ['businessId', 'businessCity', 'workLossId', 'updatedAt', 'posId']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();

  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;

    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'workloss',
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
      workLossId: '0',
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
      getWorkLoss(lastId: "${doc.workLossId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        businessId,
        businessCity,
        workLossId,
        invoiceDate,
        updatedAt,
        netWeightLoss,
        jobAssignedEmployeeId,
        jobAssignedEmployeeName,
        jobAssignedEmployeePhoneNumber,
        saleSequenceNumber,
        jobWorkSequenceNumber,
        posId,
        jobWorkIn {
          customerId,
          customerName,
          customerPhoneNumber,
          invoiceNumber,
          sequenceNumber,
          invoiceDate,
          totalAmount
        },
        sale {
          customerId,
          customerName,
          customerPhoneNumber,
          invoiceNumber,
          sequenceNumber,
          invoiceDate,
          totalAmount
        },
        weightIn
        weightOut
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
    mutation setWorkLossSchema($input: WorkLossInput) {
      setWorkLoss(workLoss: $input) {
        workLossId,
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

export const workLossSchemaSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.workloss.syncGraphQL({
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
        return await schemaSync.validateWorkLossDocumentBeforeSync(doc);
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
