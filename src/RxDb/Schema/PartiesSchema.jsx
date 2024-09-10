import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const PartiesSchema = {
  title: 'Parties table',
  description: 'List of vendors/customers',
  version: 12,
  type: 'object',
  properties: {
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    id: {
      type: 'string',
      primary: true
    },
    name: {
      type: 'string'
    },
    phoneNo: {
      type: 'string'
    },
    balanceType: {
      type: 'string'
    },
    balance: {
      type: 'number'
    },
    asOfDate: {
      type: 'string'
    },
    gstNumber: {
      type: 'string'
    },
    gstType: {
      type: 'string'
    },
    address: {
      type: 'string'
    },
    pincode: {
      type: 'string'
    },
    city: {
      type: 'string'
    },
    emailId: {
      type: 'string'
    },
    isCustomer: {
      type: 'boolean'
    },
    isVendor: {
      type: 'boolean'
    },
    vipCustomer: {
      type: 'boolean'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    place_of_supply: {
      type: 'string'
    },
    gothra: {
      type: 'string'
    },
    rashi: {
      type: 'string'
    },
    star: {
      type: 'string'
    },
    shippingAddress: {
      type: 'string'
    },
    shippingPincode: {
      type: 'string'
    },
    shippingCity: {
      type: 'string'
    },
    state: {
      type: 'string'
    },
    country: {
      type: 'string'
    },
    shippingState: {
      type: 'string'
    },
    shippingCountry: {
      type: 'string'
    },
    registrationNumber: {
      type: 'string'
    },
    tradeName: {
      type: 'string'
    },
    legalName: {
      type: 'string'
    },
    panNumber: {
      type: 'string'
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
    tdsName: {
      type: 'string'
    },
    tdsRate: {
      type: 'number'
    },
    tdsCode: {
      type: 'string'
    },
    isSyncedToServer: {
      type: 'boolean'
    },
    additionalAddressList: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          tradeName: {
            type: 'string'
          },
          placeOfSupply: {
            type: 'string'
          },
          billingAddress: {
            type: 'string'
          },
          billingPincode: {
            type: 'string'
          },
          billingCity: {
            type: 'string'
          },
          billingState: {
            type: 'string'
          },
          billingCountry: {
            type: 'string'
          },
          shippingAddress: {
            type: 'string'
          },
          shippingPincode: {
            type: 'string'
          },
          shippingCity: {
            type: 'string'
          },
          shippingState: {
            type: 'string'
          },
          shippingCountry: {
            type: 'string'
          }
        }
      }
    },
    tallySyncedStatus: {
      type: 'string'
    },
    tallySynced: {
      type: 'boolean'
    },
    aadharNumber: {
      type: 'string'
    },
    creditLimit: {
      type: 'number'
    },
    msmeRegNo: {
      type: 'string'
    },
    companyStatus: {
      type: 'string'
    },
    tallyMappingName: {
      type: 'string'
    },
    creditLimitDays: {
      type: 'number'
    },
  },
  indexes: ['phoneNo', 'name', 'businessId', 'updatedAt'],
  required: ['businessId', 'businessCity', 'id', 'name', 'phoneNo', 'updatedAt']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'parties',
        businessData.businessId
      );
      doc = lastRecord || null;
    }

    if (!doc) {
      doc = {
        phoneNo: '0',
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

const pullQueryBuilderInBackground = greenlet(async (doc, localStoragePosId, businessData) => {

  const BATCH_SIZE = 30;

  const query = `{
    getParties(lastId: "${doc.phoneNo}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId
      businessCity
      id
      name
      phoneNo
      balanceType
      balance
      asOfDate
      gstNumber
      gstType
      place_of_supply
      address
      pincode
      city
      emailId
      isCustomer
      isVendor
      vipCustomer
      gothra
      rashi
      star
      state
      country
      shippingAddress
      shippingPincode
      shippingCity
      shippingState
      shippingCountry
      registrationNumber
      panNumber
      tradeName
      legalName
      tcsName
      tcsRate
      tcsCode
      tdsName
      tdsRate
      tdsCode
      isSyncedToServer
      additionalAddressList {
        id
        tradeName
        placeOfSupply
        billingAddress
        billingPincode
        billingCity
        billingState
        billingCountry
        shippingAddress
        shippingPincode
        shippingCity
        shippingState
        shippingCountry
      }
      aadharNumber
      updatedAt
      tallySyncedStatus
      tallySynced
      creditLimit
      msmeRegNo
      companyStatus
      tallyMappingName
      creditLimitDays
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
    mutation setParties($input: PartiesInput) {
      setParties(parties: $input) {
        phoneNo,
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


export const partiesSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.parties.syncGraphQL({
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
        return await schemaSync.validatePartiesDocumentBeforeSync(doc);
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
