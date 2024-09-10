import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';
import { formatDateToYYYYMMDD } from '../DateHelper';

const getJobWorkInData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.jobworkin.findOne({ selector })
    : await db.jobworkin.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getJobWorkInDataById = async (id, fields) => {
  return getJobWorkInData(
    { $and: [{ job_work_in_invoice_number: { $eq: id } }] },
    fields,
    true
  );
};

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}


const getJobWorkInDataBySearchHandler = async (searchString, currentPage, limit, date, requestId, resolve) => {
  const businessData = await Bd.getBusinessData();
  const db = await Db.get();
  const regexp = new RegExp('^.*' + searchString + '.*$', 'i');

  const selector = {
    $or: [
      {
        $and: [
          { businessId: businessData.businessId },
          { invoice_date: { $gte: date } },
          { sequenceNumber: { $regex: regexp } }
        ]
      },
      {
        $and: [
          { businessId: businessData.businessId },
          { invoice_date: { $gte: date } },
          { sequenceNumber: searchString }
        ]
      },
      {
        $and: [
          { businessId: businessData.businessId },
          { invoice_date: { $gte: date } },
          { customer_name: { $regex: regexp } }
        ]
      }
    ]
  };

  // Check if searchString is a number before adding the total_amount filter
  if (!isNaN(searchString)) {
    selector.$or.push({
      $and: [
        { businessId: businessData.businessId },
        { invoice_date: { $gte: date } },
        { total_amount: { $eq: parseFloat(searchString) } }
      ]
    });
  }

  console.log('selector:', selector);

  console.time('Db fetch Time');

  let response = await jobWorkDataWithPageNumber(currentPage, limit, db, selector);

  response.requestId = requestId;
  console.timeEnd('Db fetch Time');
  resolve(response);
};

const debouncedGetJobWorkInDataBySearchHandler = debounce(getJobWorkInDataBySearchHandler, 500);

export const getJobWorkInDataBySearch = async (searchString, currentPage, limit, date, requestId) => {
  return new Promise((resolve) => {
    debouncedGetJobWorkInDataBySearchHandler(searchString, currentPage, limit, date, requestId, resolve);
  });
};


const createSelector = (businessId, dateRange) => ({
  $and: [
    { businessId: { $eq: businessId } },
    { invoice_date: { $gte: formatDateToYYYYMMDD(dateRange.fromDate) } },
    { invoice_date: { $lte: formatDateToYYYYMMDD(dateRange.toDate) } },
    { updatedAt: { $exists: true } }
  ]
});


//search by date range and totalPages for pagination
export const getJobWorkInDataByDate = async (dateRange, currentPage, limit) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();
  const selector = createSelector(businessData.businessId, dateRange);
  return await jobWorkDataWithPageNumber(currentPage, limit, db, selector);
};


async function jobWorkDataWithPageNumber(currentPage, limit, db, selector) {
  let response = {
    data: [],
    totalPages: 1
  };

  let skip = currentPage && currentPage > 1 ? (currentPage - 1) * limit : 0;

  const jobWorkInQuery = db.jobworkin.find({
    selector,
    sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }],
    skip: skip,
    limit: limit
  }).exec();

  let allJobWorkInDataQuery;
  if (currentPage <= 1) {
    allJobWorkInDataQuery = db.jobworkin.find({
      selector
    }).exec();

    response.totalPages = undefined;
  }

  const [jobWorkInData, allJobWorkInData] = await Promise.all([jobWorkInQuery, allJobWorkInDataQuery]);

  if (jobWorkInData) {
    response.data = jobWorkInData.map((item) => {
      let temp = item;
      temp.item_count = item.item_list ? item.item_list.length : 0;
      return temp;
    });
  }

  if (allJobWorkInData) {
    const count = allJobWorkInData.length;
    response.totalPages = Math.ceil(count / limit);
  }

  return response;
}