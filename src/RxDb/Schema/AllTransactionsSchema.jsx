import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const AllTransactionsSchema = {
  title: '',
  description: '',
  version: 9,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true
    },
    sequenceNumber: {
      type: 'string'
    },
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    date: {
      type: 'string',
      format: 'date'
    },
    vendorName: {
      type: 'string'
    },
    vendorId: {
      type: 'string'
    },
    customerName: {
      type: 'string'
    },
    customerId: {
      type: 'string'
    },
    amount: {
      type: 'number'
    },
    linkedAmount: {
      type: 'number'
    },
    paidOrReceivedAmount: {
      type: 'number'
    },
    balance: {
      type: 'number'
    },
    txnType: {
      type: 'string'
    },
    paymentType: {
      type: 'string'
    },
    isCredit: {
      type: 'boolean'
    },
    bankAccount: {
      type: 'string'
    },
    bankAccountId: {
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
    //kot fields
    waiter_name: {
      type: 'string'
    },
    waiter_phoneNo: {
      type: 'string'
    },
    paymentReferenceNumber: {
      type: 'string'
    },
    dueDate: {
      type: 'string',
      format: 'date'
    },
    vendorGSTNo: {
      type: 'string'
    },
    tcsAmount: {
      type: 'number'
    },
    tcsName: {
      type: 'string'
    },
    tcsRate: {
      type: 'number'
    },
    tcsCode: {
      type: 'string'
    },
    tdsAmount: {
      type: 'number'
    },
    tdsName: {
      type: 'string'
    },
    tdsRate: {
      type: 'number'
    },
    tdsCode: {
      type: 'string'
    },
    customerGSTNo: {
      type: 'string'
    },
    vendorPAN: {
      type: 'string'
    },
    customerPAN: {
      type: 'string'
    },
    splitPaymentList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          paymentType: {
            type: 'string'
          },
          referenceNumber: {
            type: 'string'
          },
          paymentMode: {
            type: 'string'
          },
          accountDisplayName: {
            type: 'string'
          },
          bankAccountId: {
            type: 'string'
          },
          amount: {
            type: 'number'
          }
        }
      }
    },
    aadharNumber: {
      type: 'string'
    },
    receiptOrPayment: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          sequenceNumber: {
            type: 'string'
          },
          paymentType: {
            type: 'string'
          },
          paymentMode: {
            type: 'string'
          },
          amount: {
            type: 'number'
          },
          bankName: {
            type: 'string'
          },
          bankId: {
            type: 'string'
          },
          referenceNumber: {
            type: 'string'
          },
          createdAt: {
            type: 'number'
          },
          narration: {
            type: 'string'
          },
          cancelled: {
            type: 'boolean'
          }
        }
      }
    }
  },
  indexes: [
    ['date', 'updatedAt'],
    'updatedAt',
    'date',
    'customerId',
    'vendorId',
    'vendorName',
    'customerName',
    'paymentType',
    'employeeId',
    'dueDate',
    'businessId',
    'balance',
    'sequenceNumber',
    'splitPaymentList.[].paymentType',
    'splitPaymentList.[].amount',
    'splitPaymentList.[].paymentMode',
    'splitPaymentList.[].bankAccountId'
  ],
  required: ['stockValue', 'businessCity', 'date']
};

const pullQueryBuilderInBackground = greenlet(async (doc) => {


  const BATCH_SIZE = 30;
  const query = `{
        getAllTransactions(lastId: "${doc.id}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE}, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
          id
          businessId
          businessCity
          date
          vendorName
          customerName
          vendorId
          customerId
          amount
          linkedAmount
          balance
          isCredit
          paidOrReceivedAmount
          txnType
          paymentType
          bankAccount
          bankAccountId
          employeeId
          waiter_name
          waiter_phoneNo
          updatedAt
          posId
          deleted
          sequenceNumber
          paymentReferenceNumber
          dueDate
          tcsAmount
          tcsName
          tcsRate
          tcsCode
          tdsAmount
          tdsName
          tdsRate
          tdsCode
          vendorGSTNo
          customerGSTNo
          vendorPAN
          customerPAN
          aadharNumber
          splitPaymentList {
            id
            paymentType
            referenceNumber
            paymentMode
            accountDisplayName
            bankAccountId
            amount
          }
          receiptOrPayment {
            id
            sequenceNumber
            paymentType
            paymentMode
            amount
            bankName
            bankId
            referenceNumber
            createdAt
            narration
            cancelled
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
    mutation setTransactions($input: TransactionsInput) {
      setTransactions(transactions: $input) {
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

export const pullQueryBuilder = async (doc) => {
  if (window.navigator.onLine) {
    const businessData = await Bd.getBusinessData();
    const localStoragePosId = localStorage.getItem('posId') || 1;
    ;

    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'alltransactions',
        businessData.businessId
      );

      doc = lastRecord || null;
    }

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

    try {
      return await pullQueryBuilderInBackground(doc);
    } catch (error) {
      console.error('Error executing pullQueryBuilderInBackground:', error);
    }
  }
  return null;
};

export const pushQueryBuilder = async (doc) => {
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;

    try {
      return await pushQueryBuilderInBackground(doc, localStoragePosId);
    } catch (error) {
      console.error('Error executing pushQueryBuilderInBackground:', error);
    }
  }
  return null;
};

export const allTransactionsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.alltransactions.syncGraphQL({
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
        return await schemaSync.validateAllTransactionsDocumentBeforeSync(doc);
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
