import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getPurchaseOrderData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.purchaseorder.findOne({ selector })
    : await db.purchaseorder.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getPurchaseOrderDataById = async (id, fields) => {
  return getPurchaseOrderData(
    { $and: [{ purchase_order_invoice_number: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllPurchaseOrdersByDateRange = async (
  fromDate,
  toDate,
  fields
) => {
  return getPurchaseOrderData(
    {
      $and: [
        { po_date: { $gte: fromDate } },
        { po_date: { $lte: toDate } },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};
