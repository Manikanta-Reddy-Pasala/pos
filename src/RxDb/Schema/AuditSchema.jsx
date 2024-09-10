import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import greenlet from 'greenlet';

export const AuditSchema = {
  title: 'auditing table',
  description:
    'auditing for sales,sales return, purchases, purchase return, payment in and out',
  version: 3,
  type: 'object',
  properties: {
    id: {
      //invoice id, payment in id , etc..
      type: 'string'
    },
    sequenceNumber: {
      type: 'string'
    },
    auditType: {
      //sales, payment in , paymet out
      type: 'string'
    },
    data: {
      type: 'string' //txn data(sales, payment in, payment out) in string format
    },
    action: {
      type: 'string' //save,edit delete
    },
    errorMessage: {
      type: 'string' //any errors occurs during this process
    },
    timestampString: {
      // its just timestamp in string format
      type: 'string',
      primary: true
    },
    updatedAt: {
      type: 'number'
    },
    date: {
      type: 'string',
      format: 'date'
    },
    employeeId: {
      type: 'string'
    },
    posId: {
      type: 'number'
    },
    businessId: {
      type: 'string'
    },
    businessCity: {
      type: 'string'
    },
    employeeName: {
      type: 'string'
    },
    description: {
      type: 'string'
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'id', 'updatedAt']
};

const pushQueryBuilderInBackground = greenlet(async (doc) => {

  const query = `
    mutation setAudit($input: AuditInput) {
      setAudit(audit: $input) {
        id,
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


export const pushQueryBuilder = async (doc) => {
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;

    if (!doc.posId) {
      doc.posId = parseInt(localStoragePosId);
    }

    const currentUpdatedAt = Date.now();
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

export const auditSchemaSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.audit.syncGraphQL({
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
        return await schemaSync.validateAuditDocumentBeforeSync(doc);
      }
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
