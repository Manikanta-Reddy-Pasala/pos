import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getPartyData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  if (!selector.$and) {
    selector.$and = [];
  }
  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.parties.findOne({ selector })
    : await db.parties.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getPartyDataById = async (id, fields) => {
  return getPartyData({ $and: [{ id: { $eq: id } }] }, fields, true);
};

export const getAllPartyData = async (selector, fields) => {
  return getPartyData(selector);
};

export const findParty = async (selector) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let vdata;

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  let Query = await db.parties.findOne({
    selector
  });

  await Query.exec().then((data) => {
    if (data) {
      vdata = data;
    }
  });

  return vdata;
};

export const saveParty = async (InsertDoc) => {
  try {
    const db = await Db.get();

    await db.parties.insert(InsertDoc);
    console.log('Party inserted successfully');
    return true;
  } catch (error) {
    console.log('Party insertion Failed ' + error);
    return false;
  }
};

export const updateParty = async(id, updateSelector) => {
  try{
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
  
    await db.parties
    .findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: id } }
        ]
      }
    })
    .update(updateSelector)
    console.log('Party updated successfully')
    return true;
  } catch (error) {
      console.log('Party update Failed ' + error);
      return false;
  }
};