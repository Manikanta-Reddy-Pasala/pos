import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getPurchasesReturnData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.purchasesreturn.findOne({ selector })
    : await db.purchasesreturn.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getAllPurchasesReturnByDateRange = async (
  fromDate,
  toDate,
  fields
) => {
  return getPurchasesReturnData(
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

export const getPurchasesReturnDataById = async (id, fields) => {
  return getPurchasesReturnData(
    { $and: [{ purchase_return_number: { $eq: id } }] },
    fields,
    true
  );
};