import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const ApprovalsSchema = {
  title: '',
  description: '',
  version: 9,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    approvalNumber: {
      type: 'string',
      primary: true
    },
    sequenceNumber: {
      type: 'string'
    },
    approvalDate: {
      type: 'string',
      format: 'date'
    },
    totalAmount: {
      type: 'number'
    },
    subTotal: {
      type: 'number'
    },
    itemList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          product_id: {
            type: 'string'
          },
          description: {
            type: 'string'
          },
          imageUrl: {
            type: 'string'
          },
          batch_id: {
            type: 'number'
          },
          unit: {
            type: 'string'
          },
          hsn: {
            type: 'string'
          },
          item_name: {
            type: 'string'
          },
          sku: {
            type: 'string'
          },
          barcode: {
            type: 'string'
          },
          mrp: {
            type: 'number'
          },
          purchased_price: {
            type: 'number'
          },
          offer_price: {
            type: 'number'
          },
          mrp_before_tax: {
            type: 'number'
          },
          size: {
            type: 'number'
          },
          qty: {
            type: 'number'
          },
          taxType: {
            type: 'string'
          },
          cgst: {
            type: 'number'
          },
          sgst: {
            type: 'number'
          },
          cgst_amount: {
            type: 'number'
          },
          sgst_amount: {
            type: 'number'
          },
          igst: {
            type: 'number'
          },
          igst_amount: {
            type: 'number'
          },
          discount_percent: {
            type: 'number'
          },
          discount_amount: {
            type: 'number'
          },
          discount_amount_per_item: {
            type: 'number'
          },
          discount_type: {
            type: 'string'
          },
          cess: {
            type: 'number'
          },
          amount: {
            type: 'number'
          },
          isEdit: {
            type: 'boolean'
          },
          taxIncluded: {
            type: 'boolean'
          },
          roundOff: {
            type: 'number'
          },
          vendorName: {
            type: 'string'
          },
          vendorPhoneNumber: {
            type: 'string'
          },
          brandName: {
            type: 'string'
          },
          categoryLevel2: {
            type: 'string'
          },
          categoryLevel2DisplayName: {
            type: 'string'
          },
          categoryLevel3: {
            type: 'string'
          },
          categoryLevel3DisplayName: {
            type: 'string'
          },
          wastagePercentage: {
            type: 'string'
          },
          wastageGrams: {
            type: 'string'
          },
          grossWeight: {
            type: 'string'
          },
          netWeight: {
            type: 'string'
          },
          purity: {
            type: 'string'
          },
          isSelected: {
            type: 'boolean'
          },
          makingChargePercent: {
            type: 'number'
          },
          makingChargeAmount: {
            type: 'number'
          },
          makingChargeType: {
            type: 'string'
          },
          makingChargePerGramAmount: {
            type: 'number'
          },
          makingChargeIncluded: {
            type: 'boolean'
          },
          batchNumber: {
            type: 'string'
          },
          modelNo: {
            type: 'string'
          },
          itemNumber: {
            type: 'number'
          },
          hallmarkCharge: {
            type: 'number'
          },
          certificationCharge: {
            type: 'number'
          }
        }
      }
    },
    numberOfItems: {
      type: 'number'
    },
    numberOfSelectedItems: {
      type: 'number'
    },
    numberOfPendingItems: {
      type: 'number'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    employeeId: {
      type: 'string'
    },
    employeeName: {
      type: 'string'
    },
    employeePhoneNumber: {
      type: 'string'
    },
    approvalCreatedEmployeeId: {
      type: 'string'
    },
    notes: {
      type: 'string'
    },
    round_amount: {
      type: 'number'
    },
    is_roundoff: {
      type: 'boolean'
    },
    isSyncedToServer: {
      type: 'boolean'
    }
  },
  indexes: [
    ['approvalDate', 'updatedAt'],
    'updatedAt',
    'approvalDate',
    'employeePhoneNumber',
    'itemList.[].hsn',
    'sequenceNumber',
    'approvalCreatedEmployeeId'
  ],
  required: ['businessId', 'businessCity', 'approvalDate', 'updatedAt', 'posId']
};

const pullQueryBuilderInBackground = greenlet(async (doc, businessData, localStoragePosId) => {

  if (!doc) {
    doc = {
      approvalNumber: '0',
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
    getApprovals(lastId: "${doc.approvalNumber}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      approvalNumber
      sequenceNumber
      approvalDate
      totalAmount
      subTotal
      posId
      updatedAt
      employeeId
      employeeName
      employeePhoneNumber
      approvalCreatedEmployeeId
      notes
      numberOfItems,
      numberOfSelectedItems,
      numberOfPendingItems
      round_amount
      is_roundoff
      isSyncedToServer
      deleted
      itemList {
        product_id,
        description,
        imageUrl,
        batch_id,
        unit,
        hsn,
        item_name,
        sku,
        barcode,
        mrp,
        purchased_price,
        offer_price,
        mrp_before_tax,
        size,
        qty,
        taxType,
        cgst,
        sgst,
        igst,
        cess,
        cgst_amount,
        sgst_amount,
        igst_amount,
        discount_percent,
        discount_amount,
        discount_amount_per_item,
        discount_type,
        amount,
        isEdit,
        taxIncluded,
        roundOff,
        brandName,
        categoryLevel2,
        categoryLevel2DisplayName,
        categoryLevel3,
        categoryLevel3DisplayName,
        vendorName,
        vendorPhoneNumber,
        wastagePercentage,
        wastageGrams,
        grossWeight,
        netWeight,
        purity,
        isSelected,
        makingChargePercent
        makingChargeAmount
        makingChargeType
        makingChargePerGramAmount
        makingChargeIncluded
        batchNumber
        modelNo
        itemNumber
        hallmarkCharge
        certificationCharge
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
    mutation setApprovals($input: ApprovalsInput) {
      setApprovals(approvals: $input) {
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

    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'approvals',
        businessData.businessId
      );

      doc = lastRecord || null;
    }


    return await pullQueryBuilderInBackground(doc, businessData, localStoragePosId);
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

export const approvalsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.approvals.syncGraphQL({
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
        return await schemaSync.validateApprovalsDocumentBeforeSync(doc);
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
