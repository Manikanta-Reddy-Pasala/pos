import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getExpenseData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  if (!selector.$and) {
    selector.$and = [];
  }
  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.expenses.findOne({ selector })
    : await db.expenses.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getExpenseDataById = async (id, fields) => {
  return getExpenseData({ $and: [{ expenseId: { $eq: id } }] }, fields, true);
};

export const getAllExpensesByDateRange = async (fromDate, toDate, fields) => {
  return getExpenseData(
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

export const getAllExpensesByDateRangeAndType = async (fromDate, toDate, type, fields) => {
  return getExpenseData(
    {
      $and: [
        { date: { $gte: fromDate } },
        { date: { $lte: toDate } },
        {
          expenseType: {
            $eq: type
          }
        },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};

export const getAllExpensesByGstinAndBillNumber = async (
  billNumber,
  gstin,
  fields
) => {
  return getExpenseData(
    {
      $or: [
        { vendor_gst_number: { $in: gstin } },
        { billNumber: { $in: billNumber } }
      ]
    },
    fields
  );
};

export const isExpenseAvailable = async (selector) => {
  const db = await Db.get();
  let isAvailable = false;

  let Query = await db.expenses.findOne({
    selector
  });

  await Query.exec().then((data) => {
    if (data) {
      isAvailable = true;
    }
  });
  return isAvailable;
};