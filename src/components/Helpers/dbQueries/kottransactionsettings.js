import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

export const getKOTTransactionSettings = async (fields) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let selector = {
    $and: [{ businessId: { $eq: businessData.businessId } }]
  };

  const query = await db.kottransactionsettings.findOne({ selector });

  return commons.executeQuery(query, fields);
};