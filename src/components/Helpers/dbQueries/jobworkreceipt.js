import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getJobWorkReceiptData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.jobworkreceipt.findOne({ selector })
    : await db.jobworkreceipt.find({
        selector,
        sort: [{ receiptDate: 'desc' }, { updatedAt: 'desc' }]
      });

  return commons.executeQuery(query, fields);
};

export const getJobWorkReceiptDataById = async (id, fields) => {
  return getJobWorkReceiptData({ $and: [{ id: { $eq: id } }] }, fields, true);
};

export const getAllJobWorkReceiptsByDateRange = async (
  fromDate,
  toDate,
  fields
) => {
  return getJobWorkReceiptData(
    {
      $and: [
        { receiptDate: { $gte: fromDate } },
        { receiptDate: { $lte: toDate } },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};
