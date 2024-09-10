export const BusinessListSchema = {
  title: 'business list schema',
  description: 'all list of business info for the user',
  version: 2,
  type: 'object',
  properties: {
    businessId: {
      type: 'string',
      primary: true
    },
    businessCity: {
      type: 'string'
    },
    businessName: {
      type: 'string'
    },
    businessArea: {
      type: 'string'
    },
    updatedAt: {
      type: 'number'
    },
    selectedBusinness: {
      type: 'boolean'
    },
    level1Categories: {
      type: 'boolean'
    },
    posFeature: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    billing_invoice_enabled: {
      type: 'boolean'
    },
    online_pos_permission: {
      type: 'boolean'
    },
    posId: {
      type: 'number'
    },
    planName: {
      type: 'string'
    },
    admin: {
      type: 'boolean'
    },
    subscriptionEndDate: {
      type: 'string'
    },
    enableEway: {
      type: 'boolean'
    },
    enableEinvoice: {
      type: 'boolean'
    },
    enableCustomer: {
      type: 'boolean'
    },
    enableVendor: {
      type: 'boolean'
    }
  },
  indexes: ['updatedAt'],
  required: ['businessCity', 'businessName', 'updatedAt']
};
