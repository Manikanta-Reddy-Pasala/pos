export const UserSchema = {
  title: 'user Schema',
  version: 0,
  type: 'object',
  properties: {
    userId: {
      type: 'string',
      primary: true
    },
    userPass: {
      type: 'string'
    }
  },
  required: ['userId', 'userPass']
};
