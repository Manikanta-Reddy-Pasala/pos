const crypto = require('crypto');

export const generateUniqueCode = (value) => {
  let buffer = crypto.randomBytes(4);
  let numericCode = parseInt(buffer.toString('hex'), 16) % 1e8;
  return numericCode.toString().padStart(8, '0');
};
