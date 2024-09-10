import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getWarehouseData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.warehouse.findOne({ selector })
    : await db.warehouse.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getWarehouseDataById = async (id, fields) => {
  return getWarehouseData(
    { $and: [{ id: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllWarehouseData = async (
  fields
) => {
  return getWarehouseData(
    {
      $and: [
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};
