import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

export const getRateData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  if (selector === undefined) {
    selector = {};
    selector.$and = [];
  }
  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.rates.findOne({ selector })
    : await db.rates.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getRateDataById = async (id, fields) => {
  return getRateData({ $and: [{ id: { $eq: id } }] }, fields, true);
};