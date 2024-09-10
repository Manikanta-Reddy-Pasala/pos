export const DeviceIDSchema = {
  title: '',
  description: '',
  version: 0,
  type: 'object',
  properties: {
    deviceId: {
      type: 'number'
    }
  },
  required: ['deviceId']
};
