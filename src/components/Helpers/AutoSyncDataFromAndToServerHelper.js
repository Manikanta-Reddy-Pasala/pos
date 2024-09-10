import * as Db from '../../RxDb/Database/Database';
import * as dateHelper from './DateHelper';


export const getUnSyncedRecordsForBusiness = async (tablename, businessId) => {
  const db = await Db.get();
  let records = [];
  try {
    let dbQuery = db[tablename].find({
      selector: {
        $and: [
          { businessId: { $eq: businessId } },
          {
            updatedAt: { $exists: true }
          },
          {
            $or: [
              {
                isSyncedToServer: { $eq: false }
              },
              {
                isSyncedToServer: { $exists: false }
              },
              {
                isSyncedToServer: { $eq: null }
              }
            ]
          },
          {
            posId: { $gt: 0 }
          }
        ]
      },
      sort: [{ updatedAt: 'desc' }],
      limit: 10
    });

    await dbQuery.exec().then((data) => {
      if (!data) {
        // No data is available
        return;
      }
      // console.log('sales', item.toJSON());
      records = data.map((item) => item.toJSON());
    });
  } catch (e) {
    console.error(
      'Error at repush machanisim record for table : ' +
      tablename +
      '. Message' +
      e.message
    );
  }

  return records;
};


const getAllSalesInvoiceIdsFromLastMonth = async (
  db,
  businessId,
  businessCity,
  table
) => {
  const startDate = dateHelper.get30DaysBeforeDate();
  const endDate = dateHelper.getTodayDate();

  const query = db.sales.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessId } },
        {
          invoice_date: {
            $gte: startDate
          }
        },
        {
          invoice_date: {
            $lte: endDate
          }
        }
      ]
    }
  });
  query
    .exec()
    .then(async (data) => {
      if (data) {
        const invoiceList = data.map((obj) => obj.invoice_number);

        return await this.getServerResponse(
          businessId,
          businessCity,
          invoiceList,
          startDate,
          endDate,
          table
        );
      }
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });
};

const getAllSalesReturnInvoiceIdsFromLastMonth = async (
  db,
  businessId,
  businessCity,
  table
) => {
  const startDate = dateHelper.get30DaysBeforeDate();
  const endDate = dateHelper.getTodayDate();
  const query = db.salesreturn.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessId } },
        {
          date: {
            $gte: startDate
          }
        },
        {
          date: {
            $lte: endDate
          }
        }
      ]
    }
  });
  query
    .exec()
    .then(async (data) => {
      if (data) {
        const invoiceList = data.map((obj) => obj.sales_return_number);

        return await this.getServerResponse(
          businessId,
          businessCity,
          invoiceList,
          startDate,
          endDate,
          table
        );
      }
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });
};

const getAllPurchasesInvoiceIdsFromLastMonth = async (
  db,
  businessId,
  businessCity,
  table
) => {
  const startDate = dateHelper.get30DaysBeforeDate();
  const endDate = dateHelper.getTodayDate();

  const query = db.purchases.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessId } },
        {
          bill_date: {
            $gte: startDate
          }
        },
        {
          bill_date: {
            $lte: endDate
          }
        }
      ]
    }
  });
  query
    .exec()
    .then(async (data) => {
      if (data) {
        const invoiceList = data.map((obj) => obj.bill_number);

        return await this.getServerResponse(
          businessId,
          businessCity,
          invoiceList,
          startDate,
          endDate,
          table
        );
      }
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });
};

const getAllPurchasesReturnInvoiceIdsFromLastMonth = async (
  db,
  businessId,
  businessCity,
  table
) => {
  const startDate = dateHelper.get30DaysBeforeDate();
  const endDate = dateHelper.getTodayDate();

  const query = db.purchasesreturn.findOne({
    selector: {
      $and: [
        { businessId: { $eq: businessId } },
        {
          date: {
            $gte: startDate
          }
        },
        {
          date: {
            $lte: endDate
          }
        }
      ]
    }
  });
  query
    .exec()
    .then(async (data) => {
      if (data) {
        const invoiceList = data.map((obj) => obj.purchase_return_number);

        return await this.getServerResponse(
          businessId,
          businessCity,
          invoiceList,
          startDate,
          endDate,
          table
        );
      }
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });
};

const getServerResponse = async (
  businessId,
  businessCity,
  invoiceNumberList,
  invoiceStartDate,
  invoiceEndDate,
  table
) => {
  const API_SERVER = window.REACT_APP_API_SERVER;

  let finalResponse = [];

  const apiUrl = API_SERVER + '/v1/pos/missingInvoices/' + table;

  // Your input object
  const inputData = {
    businessId: businessId,
    businessCity: businessCity,
    invoiceNumberList: invoiceNumberList,
    invoiceStartDate: invoiceStartDate,
    invoiceEndDate: invoiceEndDate
  };

  // Convert the input data to JSON
  const requestBody = JSON.stringify(inputData);

  // Define the headers for the request
  const headers = {
    'Content-Type': 'application/json'
    // You may need to include any required headers here (e.g., authentication headers)
  };

  // Make the API request
  await fetch(apiUrl, {
    method: 'POST', // Adjust the HTTP method if needed (e.g., 'GET' for a GET request)
    headers: headers,
    body: requestBody
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the API response data here
      console.log(data);
      finalResponse = data;
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch request
      console.error('Error:', error);
    });

  return finalResponse;
};

export const pullUnSyncedRecordsForBusiness = async (tablename, businessId) => {
  let businessCity = localStorage.getItem('businessCity');

  let results = [];
  const db = await Db.get();

  if (tablename === 'sales') {
    results = await this.getAllSalesInvoiceIdsFromLastMonth(
      db,
      businessId,
      businessCity
    );
  } else if (tablename === 'salesreturn') {
    results = await this.getAllSalesReturnInvoiceIdsFromLastMonth(
      db,
      businessId,
      businessCity
    );
  } else if (tablename === 'purchases') {
    results = await this.getAllPurchasesInvoiceIdsFromLastMonth(
      db,
      businessId,
      businessCity
    );
  } else if (tablename === 'purchasesreturn') {
    results = await this.getAllPurchasesReturnInvoiceIdsFromLastMonth(
      db,
      businessId,
      businessCity
    );
  }

  return results;
};