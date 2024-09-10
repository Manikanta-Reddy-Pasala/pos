import * as Bd from '../../SelectedBusiness';
import * as Db from 'src/RxDb/Database/Database';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import * as commons from './commonLogic';

//get last 15 days audit data from audit collection filter by date field and auditType = sales action = save or delete
export const getLast15DaysAuditData = async () => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();
  const last15DaysDate = dateHelper.getLast15DaysUpdatedAt();

  let auditData = await db.audit
    .find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { updatedAt: { $gte: last15DaysDate } },
          { auditType: { $eq: 'Sale' } }
        ]
      }
    })
    .exec();

  auditData = auditData.sort((a, b) => b.updatedAt - a.updatedAt);

  const groupedData = auditData.reduce((acc, item) => {
    const key = `${item.id}-${item.sequenceNumber}`;
    if (!acc[key]) {
      acc[key] = item;
    }
    return acc;
  }, {});

  return Object.values(groupedData).filter((item) => item.action !== 'Delete');
};

export const getAuditData = async (id, auditType) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  const query = {
    selector: {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { id: { $eq: id } },
        { auditType: { $eq: auditType } },
        { updatedAt: { $exists: true } }
      ]
    },
    sort: [{ updatedAt: 'asc' }]
  };

  let result;
  try {
    result = await db.audit.find(query).exec();
    return result.map((item) => item.toJSON());
  } catch (error) {
    console.error('Error fetching audit data:', error);
    return [];
  }
};