import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getPaymentInData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.paymentin.findOne({ selector })
    : await db.paymentin.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getPaymentInDataById = async (id, fields) => {
  return getPaymentInData(
    { $and: [{ receiptNumber: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllPaymentInsByDateRange = async (fromDate, toDate, fields) => {
  return getPaymentInData(
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
