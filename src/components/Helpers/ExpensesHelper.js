import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

export const searchExpenses = async (value) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let regexp = new RegExp(value, 'i');

  let expenseList = await db.expenses
    .find({
      selector: {
        businessId: { $eq: businessData.businessId },
        $or: [
          { billNumber: { $regex: regexp } },
          { total: { $eq: parseFloat(value) } },
          { date: { $eq: value } }
        ]
      }
    })
    .exec()
    .then((data) => data?.map((item) => item.toJSON()) || []);

  return expenseList;
};
