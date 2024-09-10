import greenlet from 'greenlet';


export const DocumentSyncErrorSchema = {
  title: 'sync error schema table record',
  description: 'document sync error schema',
  version: 0,
  type: 'object',
  properties: {
    id: {
      //primary key of the record
      type: 'string',
      primary: true
    },
    sequenceNumber: {
      type: 'string'
    },
    tableName: {
      //name of table with sync issue
      type: 'string'
    },
    errorMessage: {
      type: 'string' //sync error message
    },
    data: {
      type: 'string' //json data in string
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    },
    date: {
      type: 'string',
      format: 'date'
    },
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'tableName', 'updatedAt', 'id']
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


const pushQueryBuilderInBackground = greenlet(async (doc, localStoragePosId) => {
  if (!doc.posId) {
    doc.posId = parseInt(localStoragePosId);
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setDocumentSyncError($input: DocumentSyncErrorInput) {
      setDocumentSyncError(documentsyncerror: $input) {
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

export const documentSyncErrorSchemaSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.documentsyncerror.syncGraphQL({
    url: syncURL,
    // headers: {
    //   Authorization: 'Bearer ' + token
    // },
    push: {
      batchSize,
      queryBuilder: pushQueryBuilder
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
