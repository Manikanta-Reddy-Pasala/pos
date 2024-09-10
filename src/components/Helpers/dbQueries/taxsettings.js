import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

export const getTaxSettings = async (fields) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let selector = {
    $and: [{ businessId: { $eq: businessData.businessId } }]
  };

  const query = await db.taxsettings.findOne({ selector });

  return commons.executeQuery(query, fields);
};

export const saveTaxSettings = async (InsertDoc) => {
  try {
    const db = await Db.get();

    await db.taxsettings.insert(InsertDoc);
    console.log('Tax Settings updated successfully');
    return true;
  } catch (error) {
    console.log('Tax Settings update Failed ' + error);
    return false;
  }
};

export const updateTaxSettings = async (updateSelector) => {
  try {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.taxsettings
      .findOne({
        selector: {
          $and: [{ businessId: { $eq: businessData.businessId } }]
        }
      })
      .update(updateSelector);
    console.log('Tax Settings updated successfully');
    return true;
  } catch (error) {
    console.log('Tax Settings update Failed ' + error);
    return false;
  }
};