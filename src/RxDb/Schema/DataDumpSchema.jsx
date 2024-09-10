export const DataDumpSchema = {
  title: 'datadump',
  description: '',
  version: 0,
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true
    },
    data: {
      type: 'string'
    }
  },
  required: ['id', 'data']
};
