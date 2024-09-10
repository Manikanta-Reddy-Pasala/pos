import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getPaymentOutData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.paymentout.findOne({ selector })
    : await db.paymentout.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getPaymentOutDataById = async (id, fields) => {
  return getPaymentOutData(
    { $and: [{ receiptNumber: { $eq: id } }] },
    fields,
    true
  );
};

export const getPaymentOutDataByDateRange = async (
  startDate,
  endDate,
  fields
) => {
  return getPaymentOutData(
    {
      $and: [
        { date: { $gte: startDate } },
        { date: { $lte: endDate } },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};
