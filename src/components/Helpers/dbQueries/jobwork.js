import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getJobWorkData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.jobwork.findOne({ selector })
    : await db.jobwork.find({
        selector,
        sort: [{ orderDate: 'desc' }, { updatedAt: 'desc' }]
      });

  return commons.executeQuery(query, fields);
};

export const getJobWorkDataById = async (id, fields) => {
  return getJobWorkData({ $and: [{ id: { $eq: id } }] }, fields, true);
};

export const getAllJobWorksByDateRange = async (fromDate, toDate, fields) => {
  return getJobWorkData(
    {
      $and: [
        { orderDate: { $gte: fromDate } },
        { orderDate: { $lte: toDate } },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};
