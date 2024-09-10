import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getDeletedData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  if (!selector.$and) {
    selector.$and = [];
  }
  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.alltransactionsdeleted.findOne({ selector })
    : await db.alltransactionsdeleted.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getDeletedDataById = async (id, fields) => {
  return getDeletedData({ $and: [{ id: { $eq: id } }] }, fields, true);
};

export const getAllDeletedByDateRange = async (fromDate, toDate, fields) => {
  return getDeletedData(
    {
      $and: [
        { createdDate: { $gte: fromDate } },
        { createdDate: { $lte: toDate } }
      ]
    },
    fields
  );
};

export const getAllDeletedByDateRangeAndType = async (fromDate, toDate, txnType, fields) => {
    return getDeletedData(
      {
        $and: [
          { createdDate: { $gte: fromDate } },
          { createdDate: { $lte: toDate } },
          {
            transactionType: { $eq: txnType }
          }
        ]
      },
      fields
    );
  };