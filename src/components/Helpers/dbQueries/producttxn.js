import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

export const getAllProductTransactions = async (
  selector,
  fields,
  single = false
) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  if (selector === undefined) {
    selector = {};
    selector.$and = [];
  }
  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.producttxn.findOne({ selector })
    : await db.producttxn.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getAllSalesByWarrantyEndDateSorted = async (
  warrantyEndDate,
  fields
) => {
  const db = await Db.get();

  const query = {
    selector: {
      $and: [
        { txnType: { $eq: 'Sales' } },
        { warrantyEndDate: { $lte: warrantyEndDate } },
        { warrantyDays: { $gt: 0 } },
        { updatedAt: { $exists: true } }
      ]
    }
  };

  let result;
  try {
    result = await db.producttxn.find(query).exec();
    return result.map((item) => item.toJSON());
  } catch (error) {
    console.error('Error fetching sale data:', error);
    return [];
  }
};