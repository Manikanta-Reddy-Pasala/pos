import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getApprovalData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.approvals.findOne({ selector })
    : await db.approvals.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getApprovalDataById = async (id, fields) => {
  return getApprovalData(
    { $and: [{ approvalNumber: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllApprovalsByDateRange = async (fromDate, toDate, fields) => {
  return getApprovalData(
    {
      $and: [
        { approvalDate: { $gte: fromDate } },
        { approvalDate: { $lte: toDate } },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};
