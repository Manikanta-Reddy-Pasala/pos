import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

export const getReportSettings = async (fields) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let selector = {
    $and: [{ businessId: { $eq: businessData.businessId } }]
  };

  const query = await db.reportsettings.findOne({ selector });

  return commons.executeQuery(query, fields);
};

export const saveReportSettings = async (InsertDoc) => {
  try {
    const db = await Db.get();

    await db.reportsettings.insert(InsertDoc);
    console.log('Report Settings updated successfully');
    return true;
  } catch (error) {
    console.log('Report Settings update Failed ' + error);
    return false;
  }
};

export const updateReportSettings = async (updateSelector) => {
  try {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.reportsettings
      .findOne({
        selector: {
          $and: [{ businessId: { $eq: businessData.businessId } }]
        }
      })
      .update(updateSelector);
    console.log('Report Settings updated successfully');
    return true;
  } catch (error) {
    console.log('Report Settings update Failed ' + error);
    return false;
  }
};