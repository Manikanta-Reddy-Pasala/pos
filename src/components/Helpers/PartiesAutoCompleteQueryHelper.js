import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

export const getAutoCompleteList = async (value, isCustomer, isVendor, isEmployee) => {
  let list = [];
  
  if (!value) return list;

  const db = await Db.get();
  const regexp = new RegExp('^.*' + value + '.*$', 'i');
  const regexpMobile = new RegExp(value + '.*$', 'i');
  const businessData = await Bd.getBusinessData();
  let conditions;
  if (isEmployee) {
    conditions = [
      { businessId: { $eq: businessData.businessId } }
    ];
    await db.employees
      .find({ selector: { $and: conditions } })
      .limit(20)
      .exec()
      .then((documents) => {
        list = documents.map((item) => item.toJSON());
      });
  } else {
    conditions = [
      { businessId: { $eq: businessData.businessId } },
      {
        $or: [
          { $and: [{ phoneNo: { $regex: regexpMobile } }] },
          { $and: [{ name: { $regex: regexp } }] },
          { $and: [{ gstNumber: { $regex: regexp } }] }
        ]
      }
    ];

    if (isCustomer !== undefined) {
      conditions.push({ isCustomer: isCustomer });
    }

    if (isVendor !== undefined) {
      conditions.push({ isVendor: isVendor });
    }

    await db.parties
    .find({ selector: { $and: conditions } })
    .limit(20)
    .exec()
    .then((documents) => {
      list = documents.map((item) => item.toJSON());
    });
  }

  return list;
};

export const getCustomerAutoCompleteList = async (value) => {
  return getAutoCompleteList(value, true, undefined, undefined);
};

export const getVendorAutoCompleteList = async (value) => {
  return getAutoCompleteList(value, undefined, true, undefined);
};

export const getPartiesAutoCompleteList = async (value) => {
  return getAutoCompleteList(value, undefined, undefined, undefined);
};

export const getEmployeeAutoCompleteList = async (value) => {
  return getAutoCompleteList(value, undefined, undefined, true);
};
