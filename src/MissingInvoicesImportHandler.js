import { getLast15DaysSalesData, importBulkSalesData } from './components/Helpers/dbQueries/sales';

import { getLast15DaysAuditData } from './components/Helpers/dbQueries/audit';

class MissingInvoicesImportHandler {
  async compareAuditDataAndImportToSales() {
    const auditData = await getLast15DaysAuditData();
    const salesData = await getLast15DaysSalesData();

    const salesMap = new Map();

    // Map sales data for quick lookup
    salesData.forEach((item) => {
      // if(item.sequenceNumber === '311')
      //   return;
      salesMap.set(item.sequenceNumber, item);
    });

    const missingData = auditData
      .filter((item) => {
        const salesItem = salesMap.get(item.sequenceNumber);
        return (
          !salesItem ||
          salesItem.invoice_number !== item.id ||
          salesItem.invoice_date !== item.date
        );
      })
      .map((item) => JSON.parse(item.data));

    // Log missing data
    console.log('Missing data:', missingData);

    // Import missing data
    if (missingData.length > 0) {
      await importBulkSalesData(missingData);
    }
  }
}

export default MissingInvoicesImportHandler;
