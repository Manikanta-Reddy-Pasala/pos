import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import * as timestamp from '../../components/Helpers/TimeStampGeneratorHelper';

export const TallySequenceNumbersSchema = {
  title: 'Tally Sequence Numbers table',
  description: '',
  version: 0,
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
    isSyncedToServer: {
        type: 'boolean'
      },
    receipt: {
        type: 'object',
        properties: {
          prefixes: 'string',
          subPrefixes: 'string',
          prefixesList: 'array',
          subPrefixesList: 'array',
          appendYear: 'boolean',
          prefixSequence: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                prefix: {
                  type: 'string'
                },
                sequenceNumber: {
                  type: 'int'
                }
              }
            }
          }
        }
      },
      payment: {
        type: 'object',
        properties: {
          prefixes: 'string',
          subPrefixes: 'string',
          prefixesList: 'array',
          subPrefixesList: 'array',
          appendYear: 'boolean',
          prefixSequence: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                prefix: {
                  type: 'string'
                },
                sequenceNumber: {
                  type: 'int'
                }
              }
            }
          }
        }
      },
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'updatedAt', 'posId']
};

export const pullQueryBuilder = async (doc) => {
  let query = '';
  const businessData = await Bd.getBusinessData();

  if (window.navigator.onLine) {
    /**
     * start
     * check if user clicked on switch business
     * if yes then get last updated record of the business and pull from that document
     */
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'tallysequencenumbers',
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

    console.info('inside pull query tallysequencenumbers ::', doc);

    const BATCH_SIZE = window.REACT_APP_BATCH_SIZE;
    query = `{
      getTallySequenceNumbers(lastId: "${doc.businessId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        businessId
        businessCity
        updatedAt
        posId
        isSyncedToServer
        receipt {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
        noPrefixSequenceNo
        }
        payment {
        prefixes
        subPrefixes
        prefixesList
        subPrefixesList
        appendYear
        prefixSequence {
          prefix
          sequenceNumber
        }
        noPrefixSequenceNo
        }
      }
  }`;
    return {
      query,
      variables: {}
    };
  }
};

export const pushQueryBuilder = (doc) => {
  let query = '';
  if (!doc.posId) {
    doc.posId = parseInt(localStorage.getItem('posId') || 1);
  }
  console.debug('inside push query tallysequencenumbers::', doc);

  query = `
        mutation setTallySequenceNumbers($input: TallySequenceNumbersInput) {
            setTallySequenceNumbers(tallySequenceNumbers: $input) {
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
};

export const tallySequenceNumbersSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  const syncBuilder = db.tallysequencenumbers.syncGraphQL({
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
        return await schemaSync.validateTallySequenceNumbersDocumentBeforeSync(
          doc
        );
      }
    },
    pull: {
      queryBuilder: pullQueryBuilder
    },
    live: true,
    /**
     * Because the websocket is used to inform the client
     * when something has changed,
     * we can set the liveIntervall to a high value
     */
    liveInterval: 1000 * 60, // 1 minute
    autoStart: true,
    retryTime: 1000 * 60,
    deletedFlag: 'deleted'
  });

  return syncBuilder;
};