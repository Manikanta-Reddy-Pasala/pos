import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const ExpensesSchema = {
  title: 'Expenses table',
  description: 'List of Expenses by category',
  version: 17,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    expenseId: {
      type: 'string',
      primary: true
    },
    categoryId: {
      type: 'string'
    },
    date: {
      type: 'string',
      format: 'date'
    },
    dueDate: {
      type: 'string',
      format: 'date'
    },
    paymentType: {
      type: 'string'
    },
    total: {
      type: 'number'
    },
    notes: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    isRoundOff: {
      type: 'boolean'
    },
    roundAmount: {
      type: 'number'
    },
    discountAmount: {
      type: 'number'
    },
    discountPercent: {
      type: 'number'
    },
    discountType: {
      type: 'number'
    },
    packageCharge: {
      type: 'number'
    },
    shippingCharge: {
      type: 'number'
    },
    balance: {
      type: 'number'
    },
    payableAmount: {
      type: 'number'
    },
    placeOfSupply: {
      type: 'string'
    },
    placeOfSupplyName: {
      type: 'string'
    },
    billNumber: {
      type: 'string'
    },
    is_credit: {
      type: 'boolean'
    },
    linked_amount: {
      type: 'number'
    },
    reverseChargeEnable: {
      type: 'boolean'
    },
    reverseChargeValue: {
      type: 'number'
    },
    vendor_id: {
      type: 'string'
    },
    vendor_name: {
      type: 'string'
    },
    vendor_gst_number: {
      type: 'string'
    },
    vendor_gst_type: {
      type: 'string'
    },
    vendor_payable: {
      type: 'boolean'
    },
    vendor_phone_number: {
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
    vendor_email_id: {
      type: 'string'
    },
    sub_total: {
      type: 'number'
    },
    waiter: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        phoneNumber: {
          type: 'string'
        }
      }
    },
    item_list: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: {
            type: 'number'
          },
          item: {
            type: 'string'
          },
          quantity: {
            type: 'number'
          },
          amount: {
            type: 'number'
          },
          isEdit: {
            type: 'boolean'
          },
          price: {
            type: 'number'
          },
          tax: {
            type: 'number'
          },
          discountAmount: {
            type: 'number'
          },
          discountPercent: {
            type: 'number'
          },
          discountType: {
            type: 'string'
          },
          taxIncluded: {
            type: 'boolean'
          },
          taxType: {
            type: 'string'
          },
          cess: {
            type: 'number'
          },
          price_before_tax: {
            type: 'number'
          },
          hsn: {
            type: 'string'
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
          igst_amount: {
            type: 'number'
          },
          cgst_amount: {
            type: 'number'
          },
          sgst_amount: {
            type: 'number'
          },
          discount_amount_per_item: {
            type: 'number'
          },
          freeQty: {
            type: 'number'
          },
          originalDiscountPercent: {
            type: 'number'
          }
        }
      }
    },
    employeeId: {
      type: 'string'
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
    paymentReferenceNumber: {
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
    expenseType: {
      type: 'string'
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    invoiceStatus: {
      type: 'string'
    },
    tallySyncedStatus: {
      type: 'string'
    },
    tallySynced: {
      type: 'boolean'
    },
    categoryName: {
      type: 'string'
    },
    adjustVendorBalance: {
      type: 'boolean'
    },
    discountPercentForAllItems: {
      type: 'number'
    },
    portalITCAvailable: {
      type: 'boolean'
    },
    posITCAvailable: {
      type: 'boolean'
    },
    portalRCMValue: {
      type: 'boolean'
    },
    posRCMValue: {
      type: 'boolean'
    },
    itcReversed: {
      type: 'boolean'
    },
    fromPortal: {
      type: 'boolean'
    },
    imageUrls: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    accountingDate: {
      type: 'string'
    },
    oldSequenceNumber: {
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
  required: [
    'businessId',
    'businessCity',
    'expenseId',
    'date',
    'categoryId',
    'total',
    'updatedAt'
  ],
  indexes: [['date', 'updatedAt'], 'date', 'updatedAt', 'categoryId']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();

  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;

    /**
     * Start
     * Check if user clicked on switch business
     * If yes then get the last updated record of the business and pull from that document
     */
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'expenses',
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
    // The first pull does not have a start-document
    doc = {
      expenseId: '0',
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
    getExpenses(lastId: "${doc.expenseId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      expenseId
      categoryId
      date
      paymentType
      total
      notes
      businessId
      businessCity
      updatedAt
      isRoundOff
      roundAmount
      discountAmount
      discountPercent
      discountType
      packageCharge
      shippingCharge
      balance
      payableAmount
      placeOfSupply
      placeOfSupplyName
      waiter {
        name
        phoneNumber
      }
      billNumber
      item_list{
        index
        item
        quantity
        amount
        isEdit
        price
        tax
        discountAmount
        discountPercent
        discountType
        taxIncluded
        taxType
        cess
        price
        price_before_tax
        hsn
        cgst
        sgst
        igst
        igst_amount
        cgst_amount
        sgst_amount
        discount_amount_per_item
        freeQty
        originalDiscountPercent
      }
      employeeId
      bankAccount
      bankAccountId
      bankPaymentType
      deleted
      paymentReferenceNumber
      is_credit
      linked_amount
      reverseChargeEnable
      reverseChargeValue
      vendor_id
      vendor_name
      vendor_gst_number
      vendor_gst_type
      vendor_payable
      vendor_phone_number
      vendorCity
      vendorPincode
      vendorAddress
      vendorState
      vendorCountry
      vendor_email_id
      sub_total
      dueDate
      vendorPanNumber
      tcsAmount
      tcsName
      tcsRate
      tcsCode
      tdsAmount
      tdsName
      tdsRate
      tdsCode
      splitPaymentList {
        id
        paymentType
        referenceNumber
        paymentMode
        accountDisplayName
        bankAccountId
        amount
      }
      expenseType
      isSyncedToServer
      invoiceStatus
      tallySyncedStatus
      tallySynced
      categoryName
      adjustVendorBalance
      discountPercentForAllItems
      portalITCAvailable
      posITCAvailable
      portalRCMValue
      posRCMValue
      itcReversed
      fromPortal
      imageUrls
      accountingDate
      oldSequenceNumber
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
    doc.posId = parseInt(localStoragePosId);
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setExpenses($input: ExpensesInput) {
      setExpenses(expenses: $input) {
        expenseId,
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

export const expensesSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.expenses.syncGraphQL({
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
        return await schemaSync.validateExpensesDocumentBeforeSync(doc);
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
