import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getSaleOrderData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.saleorder.findOne({ selector })
    : await db.saleorder.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getSaleOrderDataById = async (id, fields) => {
  return getSaleOrderData(
    { $and: [{ sale_order_invoice_number: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllSaleOrdersByDateRange = async (fromDate, toDate, fields) => {
  return getSaleOrderData(
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
