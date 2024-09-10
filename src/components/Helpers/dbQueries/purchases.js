import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getPurchasesData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  if (!selector.$and) {
    selector.$and = [];
  }
  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.purchases.findOne({ selector })
    : await db.purchases.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getAllPurchasesByDateRange = async (fromDate, toDate, fields) => {
  return getPurchasesData(
    {
      $and: [
        { bill_date: { $gte: fromDate } },
        { bill_date: { $lte: toDate } },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};

export const getPurchasesDataById = async (id, fields) => {
  return getPurchasesData(
    { $and: [{ bill_number: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllPurchasesByGstinAndBillNumber = async (
  billNumber,
  gstin,
  fields
) => {
  return getPurchasesData(
    {
      $or: [
        { vendor_gst_number: { $in: gstin } },
        { vendor_bill_number: { $in: billNumber } }
      ]
    },
    fields
  );
};

export const isPurchaseAvailable = async (selector) => {
  const db = await Db.get();
  let isAvailable = false;

  let Query = await db.purchases.findOne({
    selector
  });

  await Query.exec().then((data) => {
    if (data) {
      isAvailable = true;
    }
  });
  return isAvailable;
};
