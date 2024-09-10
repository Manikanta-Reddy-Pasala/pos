import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const JobWorkReceiptSchema = {
  title: '',
  description: '',
  version: 3,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true
    },
    jobWorkId: {
      type: 'string'
    },
    invoiceSequenceNumber: {
      type: 'string'
    },
    receiptSequenceNumber: {
      type: 'string'
    },
    receiptNotes: {
      type: 'string'
    },
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    receiptDate: {
      type: 'string',
      format: 'date'
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
    orderNotes: {
      type: 'string'
    },
    purity: {
      type: 'string'
    },
    grossWeight: {
      type: 'string'
    },
    netWeight: {
      type: 'string'
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
    fullReceipt: {
      type: 'boolean'
    },
    partialReceipt: {
      type: 'boolean'
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
          orderReceiptChecked: {
            type: 'boolean'
          }
        }
      }
    },
    isSyncedToServer: {
      type: 'boolean'
    }
  },
  indexes: [
    ['receiptDate', 'updatedAt'],
    'updatedAt',
    'receiptDate',
    'vendorName'
  ]
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();

  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;

    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'jobworkreceipt',
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
        getJobWorkReceipt(lastId: "${doc.id}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE}, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
          id
          jobWorkId
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
          receiptDate
          receiptNotes
          receiptSequenceNumber
          orderNotes
          workOrderType
          status
          purity
          grossWeight
          netWeight
          employeeId
          updatedAt
          posId
          vendorCity
          vendorPincode
          vendorState
          vendorCountry
          vendorGstType
          vendorEmailId
          itemList {
            itemId
            itemName
            weight
            copperWeight
            kdmWeight
            toPay
            amount
            isEdit
            orderReceiptChecked
          },
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
  if (!doc.posId) {
    doc.posId = localStoragePosId;
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setJobWorkReceipt($input: JobWorkReceiptInput) {
      setJobWorkReceipt(jobWorkReceipt: $input) {
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


export const jobWorkReceiptSchemaSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.jobworkreceipt.syncGraphQL({
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
        return await schemaSync.validateJobWorkReceiptDocumentBeforeSync(doc);
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
