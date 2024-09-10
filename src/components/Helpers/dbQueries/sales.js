import * as Bd from '../../SelectedBusiness';
import * as Db from 'src/RxDb/Database/Database';
import * as commons from './commonLogic';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import { retry } from 'src/components/Helpers/commonHelper';

const getSalesData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.sales.findOne({ selector })
    : await db.sales.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getSalesDataById = async (id, fields) => {
  return getSalesData(
    { $and: [{ invoice_number: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllSalesByDateRange = async (fromDate, toDate, fields) => {
  return getSalesData(
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

export const getAllSalesByDateRangeSorted = async (
  fromDate,
  toDate,
  fields
) => {
  return getSalesData(
    {
      $and: [
        { invoice_date: { $gte: fromDate } },
        { invoice_date: { $lte: toDate } },
        { updatedAt: { $exists: true } },
        { sortingNumber: { $exists: true } }
      ]
    },
    fields
  );
};

export const getAllSalesByDateRangeSortedWithLimit = async (
  fromDate,
  toDate,
  currentPage,
  limit,
  sorting,
  fields
) => {
  const db = await Db.get();

  const skip = currentPage && currentPage > 1 ? (currentPage - 1) * limit : 0;

  const query = {
    selector: {
      $and: [
        { invoice_date: { $gte: fromDate } },
        { invoice_date: { $lte: toDate } },
        { updatedAt: { $exists: true } },
        { sortingNumber: { $exists: true } }
      ]
    },
    skip: skip,
    limit: limit,
    sort: [{ sortingNumber: sorting }]
  };

  let result;
  try {
    result = await db.sales.find(query).exec();
    return result.map((item) => item.toJSON());
  } catch (error) {
    console.error('Error fetching sale data:', error);
    return [];
  }
};

export const checkSaleSequenceNumberExists = async (
  invoiceDate,
  currentSequenceNumber
) => {
  let isSequenceNuberExist = false;
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  await db.sales
    .findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { sequenceNumber: { $eq: currentSequenceNumber } },
          {
            invoice_date: {
              $gte: dateHelper.getFinancialYearStartDateByGivenDate(invoiceDate)
            }
          },
          {
            invoice_date: {
              $lte: dateHelper.getFinancialYearEndDateByGivenDate(invoiceDate)
            }
          }
        ]
      }
    })
    .exec()
    .then((data) => {
      if (data && data.invoice_number) {
        isSequenceNuberExist = true;
      }
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });

  return isSequenceNuberExist;
};

//search related
export const searchSaleData = async (
  searchString,
  currentPage,
  limit,
  selector
) => {
  const db = await Db.get();

  const skip = currentPage && currentPage > 1 ? (currentPage - 1) * limit : 0;

  const query = {
    selector: selector,
    skip: skip,
    limit: limit,
    sort: [{ sortingNumber: 'desc' }]
  };

  try {
    return await db.sales.find(query).exec();
  } catch (error) {
    console.error('Error fetching sale data:', error);
    return [];
  }
};

export const searchAllSaleData = async (value, selector, limit) => {
  const db = await Db.get();
  try {
    const data = await db.sales
      .find({
        selector: selector
      })
      .exec();

    if (!data || data.length === 0) return { allSaleData: [], totalPages: 1 };

    const response = data.reduce(
      (acc, item) => {
        const totalPaid = parseFloat(item.total_amount - item.balance_amount);
        const balanceAmount = parseFloat(item.balance_amount);

        acc.allPaid += totalPaid;
        acc.allUnPaid += balanceAmount;

        if (
          ['POS', 'KOT', 'INVOICE'].includes(item.order_type?.toUpperCase())
        ) {
          acc.storePaid += totalPaid;
          acc.storeUnPaid += balanceAmount;
        } else {
          acc.onlinePaid += totalPaid;
          acc.onlineUnPaid += balanceAmount;
        }

        return acc;
      },
      {
        paid: 0,
        unPaid: 0,
        allPaid: 0,
        allUnPaid: 0,
        storePaid: 0,
        storeUnPaid: 0,
        onlinePaid: 0,
        onlineUnPaid: 0
      }
    );

    console.log('response:', response);

    const numberOfPages = Math.ceil(data.length / limit);

    return {
      allSaleData: response,
      totalPages: numberOfPages
    };
  } catch (error) {
    console.error('Error fetching all sale data:', error);
    return { allSaleData: [], totalPages: 1 };
  }
};

//get last 15 days sale invoice_date, invoice_number, sequenceNumber filed from sales collection
export const getLast15DaysSalesData = async () => {
  const fields = ['invoice_date', 'invoice_number', 'sequenceNumber'];
  const last15DaysDate = dateHelper.getLast15DaysDate();

  return getSalesData(
    {
      $and: [{ invoice_date: { $gte: last15DaysDate } }]
    },
    fields
  );
};

export const importBulkSalesData = async (data) => {
  const db = await Db.get();

  try {
    await retry(() => db.sales.bulkInsert(data));
  } catch (error) {
    console.error(
      'All attempts failed to save sale bulk import  with error:',
      error
    );
  }
};