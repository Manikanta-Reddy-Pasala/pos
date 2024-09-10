import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';
import * as Bd from '../../components/SelectedBusiness';

export const JobWorkSchema = {
  title: '',
  description: '',
  version: 6,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true
    },
    invoiceSequenceNumber: {
      type: 'string'
    },
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    orderDate: {
      type: 'string',
      format: 'date'
    },
    dueDate: {
      type: 'string',
      format: 'date'
    },
    vendorName: {
      type: 'string'
    },
    vendorId: {
      type: 'string'
    },
    vendorPhoneNo: {
      type: 'string'
    },
    vendorGstNumber: {
      type: 'string'
    },
    vendorAddress: {
      type: 'string'
    },
    subTotalAmount: {
      type: 'number'
    },
    totalAmount: {
      type: 'number'
    },
    employeeId: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    workOrderType: {
      type: 'string'
    },
    status: {
      type: 'string'
    },
    vendorCity: {
      type: 'string'
    },
    vendorPincode: {
      type: 'string'
    },
    vendorState: {
      type: 'string'
    },
    vendorCountry: {
      type: 'string'
    },
    vendorGstType: {
      type: 'string'
    },
    vendorEmailId: {
      type: 'string'
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    rateList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          metal: {
            type: 'string'
          },
          purity: {
            type: 'string'
          },
          rateByGram: {
            type: 'number'
          },
          defaultBool: {
            type: 'boolean'
          }
        }
      }
    },
    itemList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          itemId: {
            type: 'string'
          },
          itemName: {
            type: 'string'
          },
          weight: {
            type: 'string'
          },
          copperWeight: {
            type: 'string'
          },
          kdmWeight: {
            type: 'string'
          },
          toPay: {
            type: 'string'
          },
          amount: {
            type: 'number'
          },
          isEdit: {
            type: 'boolean'
          },
          receiptCreated: {
            type: 'boolean'
          }
        }
      }
    }
  },
  indexes: [['orderDate', 'updatedAt'], 'updatedAt', 'orderDate', 'vendorName']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'jobwork',
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
    const localStoragePosId = localStorage.getItem('posId') || 1;;
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
      id: 0,
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
        getJobWork(lastId: "${doc.id}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE}, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
          id
          businessId
          businessCity
          invoiceSequenceNumber
          orderDate
          dueDate
          vendorId
          vendorName
          vendorPhoneNo
          vendorGstNumber
          vendorAddress
          subTotalAmount
          totalAmount
          fullReceipt
          partialReceipt
          orderNotes
          workOrderType
          status
          employeeId
          updatedAt
          posId
          vendorCity
          vendorPincode
          vendorState
          vendorCountry
          vendorGstType
          vendorEmailId
          isSyncedToServer
          deleted
          itemList {
            itemId
            itemName
            weight
            copperWeight
            kdmWeight
            toPay
            amount
            receiptCreated
            isEdit
          }
          rateList {
            id
            metal
            purity
            rateByGram
            defaultBool
          }
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
    mutation setJobWork($input: JobWorkInput) {
      setJobWork(jobWork: $input) {
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

export const jobWorkSchemaSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.jobwork.syncGraphQL({
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
        return await schemaSync.validateJobWorkDocumentBeforeSync(doc);
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
