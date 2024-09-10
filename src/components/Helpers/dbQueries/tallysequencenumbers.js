import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

export const getTallySequenceNumbers = async (fields) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let selector = {
    $and: [{ businessId: { $eq: businessData.businessId } }]
  };

  const query = await db.tallysequencenumbers.findOne({ selector });

  return commons.executeQuery(query, fields);
};

export const saveTallySequenceNumbers = async (InsertDoc) => {
  try {
    const db = await Db.get();

    await db.tallysequencenumbers.insert(InsertDoc);
    console.log('Tally Sequence Numbers updated successfully');
    return true;
  } catch (error) {
    console.log('Tally Sequence Numbers update Failed ' + error);
    return false;
  }
};

export const updateTallySequenceNumbers = async (updateSelector) => {
  try {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.tallysequencenumbers
      .findOne({
        selector: {
          $and: [{ businessId: { $eq: businessData.businessId } }]
        }
      })
      .update(updateSelector);
    console.log('Tally Sequence Numbers updated successfully');
    return true;
  } catch (error) {
    console.log('Tally Sequence Numbers update Failed ' + error);
    return false;
  }
};