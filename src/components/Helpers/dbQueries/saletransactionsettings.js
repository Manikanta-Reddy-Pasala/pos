import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

export const getSaleTransactionSettings = async (fields) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let selector = {
    $and: [{ businessId: { $eq: businessData.businessId } }]
  };

  const query = await db.saletransactionsettings.findOne({ selector });

  return commons.executeQuery(query, fields);
};

export const saveSaleTransactionSettings = async (InsertDoc) => {
  try {
    const db = await Db.get();

    await db.saletransactionsettings.insert(InsertDoc);
    console.log('SaleTransaction Settings updated successfully');
    return true;
  } catch (error) {
    console.log('SaleTransaction Settings update Failed ' + error);
    return false;
  }
};

export const updateSaleTransactionSettings = async (updateSelector) => {
  try {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.saletransactionsettings
      .findOne({
        selector: {
          $and: [{ businessId: { $eq: businessData.businessId } }]
        }
      })
      .update(updateSelector);
    console.log('SaleTransaction Settings updated successfully');
    return true;
  } catch (error) {
    console.log('SaleTransaction Settings update Failed ' + error);
    return false;
  }
};