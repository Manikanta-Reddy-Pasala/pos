import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getSalesQuotationData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.salesquotation.findOne({ selector })
    : await db.salesquotation.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getSalesQuotationDataById = async (id, fields) => {
  return getSalesQuotationData(
    { $and: [{ invoice_number: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllSalesQuotationsByDateRange = async (
  fromDate,
  toDate,
  fields
) => {
  return getSalesQuotationData(
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
