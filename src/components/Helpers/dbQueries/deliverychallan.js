import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getDeliveryChallanData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.deliverychallan.findOne({ selector })
    : await db.deliverychallan.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getDeliveryChallanDataById = async (id, fields) => {
  return getDeliveryChallanData(
    { $and: [{ delivery_challan_invoice_number: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllDeliveryChallanByDateRange = async (
  fromDate,
  toDate,
  fields
) => {
  return getDeliveryChallanData(
    {
      $and: [
        { invoice_date: { $gte: fromDate } },
        { invoice_date: { $lte: toDate } },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};
