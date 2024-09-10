import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';
import InvoiceRegular from 'src/Mobx/Stores/classes/InvoiceRegular';
import InvoiceThermal from 'src/Mobx/Stores/classes/InvoiceThermal';

export const getPrinterSettings = async (fields) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let printerObject = {
    invoiceThermal : {},
    invoiceRegular: {}
  }

  let selector = {
    $and: [{ businessId: { $eq: businessData.businessId } }]
  };

  const query = await db.printersettings.findOne({ selector });
  let data = await commons.executeQuery(query, fields);

  printerObject.invoiceRegular = data ? data.invoiceRegular : new InvoiceRegular().defaultValues();
  printerObject.invoiceRegular.userId = localStorage.getItem('mobileNumber');

  printerObject.invoiceThermal = data ? data.invoiceThermal : new InvoiceThermal().defaultValues();
  printerObject.invoiceThermal.userId = localStorage.getItem('mobileNumber');

  return printerObject;
};

export const savePrinterSettings = async (InsertDoc) => {
  try {
    const db = await Db.get();

    await db.printersettings.insert(InsertDoc);
    console.log('Printer Settings updated successfully');
    return true;
  } catch (error) {
    console.log('Printer Settings update Failed ' + error);
    return false;
  }
};

export const updatePrinterSettings = async (updateSelector) => {
  try {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.printersettings
      .findOne({
        selector: {
          $and: [{ businessId: { $eq: businessData.businessId } }]
        }
      })
      .update(updateSelector);
    console.log('Printer Settings updated successfully');
    return true;
  } catch (error) {
    console.log('Printer Settings update Failed ' + error);
    return false;
  }
};