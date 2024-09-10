import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getSalesReturnData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.salesreturn.findOne({ selector })
    : await db.salesreturn.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getSalesReturnDataById = async (id, fields) => {
  return getSalesReturnData(
    { $and: [{ sales_return_number: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllSalesReturnByDateRange = async (
  fromDate,
  toDate,
  fields
) => {
  return getSalesReturnData(
    {
      $and: [
        { date: { $gte: fromDate } },
        { date: { $lte: toDate } },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};