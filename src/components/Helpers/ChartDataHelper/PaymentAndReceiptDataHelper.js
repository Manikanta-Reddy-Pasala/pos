import { getAllTransactionListByDateRange } from 'src/components/Helpers/dbQueries/alltransactions';

export const getPaymentAndReceiptData = async (startDate, endDate) => {
  let payment = 0;
  let receipt = 0;
  let fullData = await getAllTransactionListByDateRange(startDate, endDate);

  for (let item of fullData) {
    if (item.isCredit === true && item.balance === 0) {
      continue;
    }
    if (
      item['txnType'] === 'Payment In' ||
      item['txnType'] === 'Sales' ||
      item['txnType'] === 'Purchases Return' ||
      item['txnType'] === 'KOT' ||
      item['txnType'] === 'Opening Balance'
    ) {
      if (item.isCredit === true && item.linkedAmount > 0) {
        receipt += item.linkedAmount;
      } else {
        receipt += item.amount;
      }
    } else {
      if (item.isCredit === true && item.linkedAmount > 0) {
        payment += item.linkedAmount;
      } else {
        payment += item.amount;
      }
    }
  }

  return {
    receipt: parseFloat(receipt).toFixed(2),
    payment: parseFloat(payment).toFixed(2)
  }
};