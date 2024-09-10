import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const PaymentOutSchema = {
  title: '',
  description: '',
  version: 10,
  type: 'object',
  properties: {
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
    receiptNumber: {
      type: 'string',
      primary: true
    },
    sequenceNumber: {
      type: 'string'
    },
    vendorId: {
      type: 'string'
    },
    vendorName: {
      type: 'string'
    },
    vendorPhoneNo: {
      type: 'string'
    },
    paymentType: {
      type: 'string'
    },
    balance: {
      type: 'number'
    },
    paid: {
      type: 'number'
    },
    total: {
      type: 'number'
    },
    linkPayment: {
      type: 'boolean'
    },
    linked_amount: {
      type: 'number'
    },
    paymentOut: {
      type: 'boolean'
    },
    linkedTxnList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          linkedId: {
            type: 'string'
          },
          date: {
            type: 'string',
            format: 'date'
          },
          linkedAmount: {
            type: 'number'
          },
          paymentType: {
            type: 'string'
          },
          transactionNumber: {
            type: 'string'
          },
          sequenceNumber: {
            type: 'string'
          }
        }
      }
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
    bankAccount: {
      type: 'string'
    },
    bankAccountId: {
      type: 'string'
    },
    bankPaymentType: {
      type: 'string'
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
    prefix: {
      type: 'string'
    },
    subPrefix: {
      type: 'string'
    },
    vendorGSTNo: {
      type: 'string'
    },
    vendorGSTType: {
      type: 'string'
    },
    vendorCity: {
      type: 'string'
    },
    vendorPincode: {
      type: 'string'
    },
    vendorAddress: {
      type: 'string'
    },
    vendorState: {
      type: 'string'
    },
    vendorCountry: {
      type: 'string'
    },
    vendorEmailId: {
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
    vendorPanNumber: {
      type: 'string'
    },
    vendorPayable: {
      type: 'boolean'
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
    isSyncedToServer: {
      type: 'boolean'
    },
    calculateStockAndBalance: {
      type: 'boolean'
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
  indexes: [['date', 'updatedAt'], 'balance', 'vendorId', 'updatedAt'],
  required: ['businessId', 'businessCity', 'updatedAt']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'paymentout',
        businessData.businessId
      );
      doc = lastRecord || null;
    }

    if (!doc) {
      doc = {
        receiptNumber: '0',
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
    const localStoragePosId = localStorage.getItem('posId') || 1;;
     try {
      return await pushQueryBuilderInBackground(doc, localStoragePosId);
    } catch (error) {
      console.error('Error executing pushQueryBuilderInBackground:', error);
    }
  }
  return null;
};

const pullQueryBuilderInBackground = greenlet(async (doc) => {


  const BATCH_SIZE = 30;

  const query = `{
    getPaymentOut(lastId: "${doc.receiptNumber}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      date
      receiptNumber
      sequenceNumber
      vendorId
      vendorName
      vendorPhoneNo
      paymentType
      balance
      paid
      total
      linkPayment
      linked_amount
      paymentOut
      linkedTxnList {
        linkedId
        date
        linkedAmount
        paymentType
        transactionNumber
        sequenceNumber
      }
      employeeId
      updatedAt
      bankAccount
      bankAccountId
      bankPaymentType
      waiter_name
      waiter_phoneNo
      deleted
      paymentReferenceNumber
      prefix
      subPrefix
      vendorGSTNo
      vendorGSTType
      vendorCity
      vendorPincode
      vendorAddress
      vendorState
      vendorCountry
      vendorEmailId
      tcsAmount
      tcsName
      tcsRate
      tcsCode
      tdsAmount
      tdsName
      tdsRate
      tdsCode
      vendorPanNumber
      vendorPayable
      splitPaymentList {
        id
        paymentType
        referenceNumber
        paymentMode
        accountDisplayName
        bankAccountId
        amount
      }
      isSyncedToServer
      calculateStockAndBalance
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
    mutation setPaymentOut($input: PaymentOutInput) {
      setPaymentOut(paymentOut: $input) {
        receiptNumber,
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


export const paymentoutSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.paymentout.syncGraphQL({
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
        return await schemaSync.validatePaymentOutDocumentBeforeSync(doc);
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
