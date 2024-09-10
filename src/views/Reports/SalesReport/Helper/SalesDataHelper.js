const months = [
  { val: '01', name: 'JANUARY' },
  { val: '02', name: 'FEBRAUARY' },
  { val: '03', name: 'MARCH' },
  { val: '04', name: 'APRIL' },
  { val: '05', name: 'MAY' },
  { val: '06', name: 'JUNE' },
  { val: '07', name: 'JULY' },
  { val: '08', name: 'AUGUST' },
  { val: '09', name: 'SEPTEMBER' },
  { val: '10', name: 'OCTOBER' },
  { val: '11', name: 'NOVEMBER' },
  { val: '12', name: 'DECEMBER' }
];

const extractMonth = (inputDate) => {
  const parts = inputDate.split('-');
  return parts[1];
};

export const getDataByMonth = async (data) => {
  let salesMontlyMap = new Map();
  let dataObj = {
    invoiceCount: 0,
    invoiceValue: 0,
    paid: 0,
    unpaid: 0
  };

  let monthNames = months.map((reason) => reason.name);
  monthNames.forEach((property) => salesMontlyMap.set(property, dataObj));

  for (let saleData of data) {
    let matchingItem = months.find(
      (reason) => reason.val === extractMonth(saleData.invoice_date)
    );
    let oldDataObj = salesMontlyMap.get(matchingItem?.name);
    let dataObj = {
      invoiceCount: oldDataObj.invoiceCount,
      invoiceValue: oldDataObj.invoiceValue,
      paid: oldDataObj.paid,
      unpaid: oldDataObj.unpaid,
    };
    dataObj.invoiceCount += 1;
    dataObj.invoiceValue += parseFloat(saleData.total_amount || 0);
    dataObj.paid +=
      parseFloat(saleData.total_amount) - parseFloat(saleData.balance_amount);
    dataObj.unpaid += parseFloat(saleData.balance_amount);
    salesMontlyMap.set(matchingItem?.name, dataObj);
  }
  return salesMontlyMap;
};