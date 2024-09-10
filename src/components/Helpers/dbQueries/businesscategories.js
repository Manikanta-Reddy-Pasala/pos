import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

export const getLevel2BusinessCategories = async (fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  const query = single
    ? await db.businesscategories.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } }
          ]
        }
      })
    : await db.businesscategories.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } }
          ]
        }
      });

  return commons.executeQuery(query, fields);
};