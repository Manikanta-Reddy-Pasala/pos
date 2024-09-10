import { searchAllSaleData, searchSaleData } from 'src/components/Helpers/dbQueries/sales';
import * as Bd from '../SelectedBusiness';


export const getSaleDataBySearch = async (searchString, currentPage, limit, date, requestId) => {

  const businessData = await Bd.getBusinessData();

  let response = {
    saleData: [],
    allSaleData: [],
    totalPages: 1,
    requestId: requestId
  };

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
  const [allSaleResponse, saleData] = await Promise.all([
    currentPage === 1 ? searchAllSaleData(searchString, selector, limit) : Promise.resolve({
      totalPages: undefined,
      allSaleData: undefined
    }),
    searchSaleData(searchString, currentPage, limit, selector)
  ]);
  console.timeEnd('Db fetch Time');

  if (currentPage === 1) {
    response.totalPages = allSaleResponse.totalPages;
    response.allSaleData = allSaleResponse.allSaleData;
  }

  response.saleData = saleData;

  console.log('final response:', response);

  return response;
};
