import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import * as timestamp from '../../components/Helpers/TimeStampGeneratorHelper';
import greenlet from 'greenlet';

export const TallyMasterSettingsSchema = {
  title: 'Export To Tally table',
  description: 'Export To Tally txn',
  version: 1,
  type: 'object',
  properties: {
    businessId: {
      type: 'string',
      primary: true
    },
    businessCity: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    tallyCompanyName: {
      type: 'string'
    },
    b2b: {
      type: 'boolean'
    },
    b2c: {
      type: 'boolean'
    },
    salesMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    purchasesMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    creditNoteMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    debitNoteMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    expensesMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    taxesMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    roundOffMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    packingChargesMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    shippingChargesMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    discountMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    customerMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    },
    vendorMastersMapping: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string'
          },
          oneshellLedgerName: {
            type: 'string'
          },
          tallyLedgerName: {
            type: 'string'
          },
          tallyLedgerGroup: {
            type: 'string'
          },
          tallyParentGroup: {
            type: 'string'
          },
          description: {
            type: 'string'
          }
        }
      }
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'updatedAt', 'posId']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    // Check if user clicked on switch business
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'tallymastersettings',
        businessData.businessId
      );

      doc = lastRecord || null;
    }

    // Initialize document if not provided
    if (!doc) {
      doc = {
        updatedAt: 0,
        posId: businessData.posDeviceId,
        businessId: businessData.businessId,
        businessCity: businessData.businessCity
      };
    }

    if (!doc.posId) {
      doc.posId = localStorage.getItem('posId') || 1;
    }

    const currentUpdatedAt = timestamp.getUniqueTimestamp();
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
    if (!doc.posId) {
      doc.posId = localStorage.getItem('posId') || 1;
    }

    const currentUpdatedAt = timestamp.getUniqueTimestamp();
    if (!(doc.updatedAt <= currentUpdatedAt)) {
      doc.updatedAt = currentUpdatedAt;
    }

    try {
      return await pushQueryBuilderInBackground(doc);
    } catch (error) {
      console.error('Error executing pushQueryBuilderInBackground:', error);
    }
  }
  return null;
};

const pullQueryBuilderInBackground = greenlet(async (doc) => {
  const BATCH_SIZE = 30;

  const query = `{
    getTallyMasterSettings(lastId: "${doc.businessId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
      businessId,
  businessCity,
  updatedAt,
  posId,
  tallyCompanyName
  b2b
  b2c
  salesMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  purchasesMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  creditNoteMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  debitNoteMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  expensesMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  taxesMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  roundOffMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  packingChargesMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  shippingChargesMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  discountMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  customerMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  vendorMastersMapping{
    id,
    oneshellLedgerName,
    tallyLedgerName,
    tallyLedgerGroup,
    tallyParentGroup,
    description,
    
  },
  deleted
}
}`;

  return {
    query,
    variables: {}
  };
});

const pushQueryBuilderInBackground = greenlet(async (doc) => {
  const query = `
    mutation setTallyMasterSettings($input: TallyMasterSettingsInput) {
      setTallyMasterSettings(tallyMasterSettings: $input) {
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

export const tallyMasterSettingsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.tallymastersettings.syncGraphQL({
    url: syncURL,
    // headers: {
    //   Authorization: 'Bearer ' + token
    // },
    push: {
      batchSize,
      queryBuilder: pushQueryBuilder
      /**
       *  Modifies all pushed documents before they are send to the GraphQL endpoint.
       * Returning null will skip the document.
       */
      // modifier: async (doc) => {
      //   return await schemaSync.validateTallyMasteSettingsDocumentBeforeSync(
      //     doc
      //   );
      // }
    },
    pull: {
      queryBuilder: pullQueryBuilder
    },
    live: true,
    /**
     * Because the websocket is used to inform the client
     * when something has changed,
     * we can set the live Interval to a high value
     */
    liveInterval: 1000 * 60 * 10,
    autoStart: true,
    retryTime: 1000 * 60 * 5,
    deletedFlag: 'deleted'
  });
};