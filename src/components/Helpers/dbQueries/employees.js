const Bd = require('../../SelectedBusiness');
const Db = require('../../../RxDb/Database/Database');
const commons = require('./commonLogic');

export const getEmployees = async (id, isSingle, types) => {
  const businessData = await Bd.getBusinessData();
  const db = await Db.get();
  let selector = {
      $and: [
          { businessId: { $eq: businessData.businessId } },
      ]
  };
  if (isSingle) {
      selector.$and.push({ id: { $eq: id } });
  }
  if (Array.isArray(types) && types.length > 0) {
      const regexStr = types.map(type => `.*${type}.*`).join('|');
      const regexp = new RegExp(`^(${regexStr})$`, 'i');
      selector.$and.push({ type: { $regex: regexp } });
  }
  const query = isSingle
      ? await db.employees.findOne({ selector })
      : await db.employees.find({ selector });
  return commons.executeQuery(query);
};
