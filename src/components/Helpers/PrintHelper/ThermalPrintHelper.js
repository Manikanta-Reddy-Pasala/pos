import { printThermal } from 'src/views/Printers/ComponentsToPrint/printThermalContent';
import { InvoiceThermalPrintContent } from 'src/views/Printers/ComponentsToPrint/invoiceThermalPrintContent';
import * as balanceUpdate from 'src/components/Helpers/CustomerAndVendorBalanceHelper';
import { InvoiceThermalReceiptPrintContent } from 'src/views/Printers/ComponentsToPrint/invoiceThermalReceiptPrintContent';
import { KOTFullBillThermalPrintContent } from 'src/views/Printers/ComponentsToPrint/kotFullBillThermalPrintContent';

export const sendContentForThermalPrinter = async (
  partyId,
  invoiceThermal,
  dataItem,
  settings,
  type
) => {
  let printBalance = 0;

  if (partyId !== '' || partyId !== undefined) {
    printBalance = await balanceUpdate.getCustomerBalanceById(partyId);
  }

  let printContent = {};

  if (dataItem.receiptNumber) {
    printContent = InvoiceThermalReceiptPrintContent(
      invoiceThermal,
      dataItem,
      printBalance
    );
  } else {
    if (type === 'Kot') {
      printContent = KOTFullBillThermalPrintContent(
        invoiceThermal,
        dataItem,
        settings
      );
    } else {
      printContent = InvoiceThermalPrintContent(
        invoiceThermal,
        dataItem,
        printBalance,
        settings,
        type
      );
    }
  }

  if (invoiceThermal.boolCustomization) {
    const customData = {
      pageSize: invoiceThermal.boolPageSize,
      width: invoiceThermal.customWidth,
      pageWidth: invoiceThermal.pageSizeWidth,
      pageHeight: invoiceThermal.pageSizeHeight,
      margin: invoiceThermal.customMargin
    };
    printContent.customData = customData;
  }
  let copies =
    invoiceThermal.printOriginalCopies > 0
      ? invoiceThermal.printOriginalCopies
      : 1;
  for (let i = 0; i < copies; i++) {
    printThermal(printContent);
  }
};