import { getAllSalesByDateRange } from 'src/components/Helpers/dbQueries/sales';
import { getAllPurchasesByDateRange } from 'src/components/Helpers/dbQueries/purchases';
import * as dateHelper from 'src/components/Helpers/DateHelper';

export const getPartyPerformers = async (type, filter, size) => {
  const startDate = dateHelper.getFinancialYearStartDate();
  const endDate = dateHelper.getFinancialYearEndDate();

  let fullData;

  if (type === 'Customer') {
    fullData = await getAllSalesByDateRange(startDate, endDate, [
      'customer_id',
      'customer_name',
      'customerGSTNo',
      'total_amount',
      'item_list'
    ]);
  } else if (type === 'Vendor') {
    fullData = await getAllPurchasesByDateRange(startDate, endDate, [
      'vendor_id',
      'vendor_name',
      'vendor_gst_number',
      'total_amount',
      'item_list'
    ]);
  }

  return processData(type, fullData, filter, size);
};

const processData = (party, allData, filter, size) => {
  let performersList = [];
  let performersMap = new Map();
  for (let dataItem of allData) {
    let total_amount = parseFloat(dataItem.total_amount || dataItem.total || 0);
    let total_tax = 0;

    for (let product of dataItem.item_list) {
      total_tax =
        parseFloat(total_tax || 0) +
        parseFloat(product.sgst_amount || 0) +
        parseFloat(product.cgst_amount || 0) +
        parseFloat(product.igst_amount || 0);
    }

    const totalAmount =
      parseFloat(total_amount || 0) - parseFloat(total_tax || 0);

    const id = party === 'Customer' ? dataItem.customer_id : dataItem.vendor_id;
    const name =
      party === 'Customer' ? dataItem.customer_name : dataItem.vendor_name;
    const gstNumber =
      party === 'Customer'
        ? dataItem.customerGSTNo
        : dataItem.vendor_gst_number;

    if (performersMap.has(id)) {
      let dataObj = performersMap.get(id);
      dataObj.total += parseFloat(totalAmount);
      performersMap.set(id, dataObj);
    } else {
      let dataObj = {
        total: parseFloat(totalAmount),
        name: name,
        gstNumber: gstNumber
      };
      performersMap.set(id, dataObj);
    }
  }

  performersList = Array.from(performersMap.values());
  if (filter === 'Bottom') {
    performersList = [...performersList].sort((a, b) => a.total - b.total);
  } else {
    performersList = [...performersList].sort((a, b) => b.total - a.total);
  }

  return performersList.slice(0, size);
};