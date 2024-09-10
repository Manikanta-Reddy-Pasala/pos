export const LoginSchema = {
  title: '',
  description: '',
  version: 0,
  type: 'object',
  properties: {
    username: {
      type: 'string',
      primary: true
    },
    password: {
      type: 'string'
    }
  },
  required: ['username', 'password']
};
