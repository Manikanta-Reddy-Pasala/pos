import * as Bd from '../../components/SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

const getDbAndBusinessData = async () => {
  const db = await Db.get();
  const { businessId, posDeviceId, businessCity } = await Bd.getBusinessData();
  return { db, businessId, posDeviceId, businessCity };
};

export const createTableSyncError = async (tableName, errorMessage) => {
  if (
    !errorMessage.includes(
      "Cannot read properties of undefined (reading 'query')"
    )
  ) {
    const { db, businessId, posDeviceId, businessCity } =
      await getDbAndBusinessData();

    const data = await db.syncerror
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessId } },
            { tableName: { $eq: tableName } }
          ]
        }
      })
      .exec();

    if (data.length === 0) {
      const InsertDoc = {
        id: businessId + '|' + tableName,
        tableName,
        errorMessage,
        posId: posDeviceId,
        businessId,
        businessCity,
        updatedAt: Date.now()
      };

     try {
        const dat = await db.syncerror.insert(InsertDoc);
      } catch (error) {
        console.log('An error occurred:', error);
      }
    }
  }
};

export const createDocumentSyncError = async (
  tableName,
  errorMessage,
  document,
  id,
  date,
  sequenceNumber
) => {
  const { db, businessId, posDeviceId, businessCity } =
    await getDbAndBusinessData();

  const InsertDoc = {
    id: id.includes('|') ? id : businessId + '|' + id,
    tableName,
    errorMessage,
    posId: parseInt(posDeviceId),
    businessId,
    businessCity,
    updatedAt: Date.now(),
    data: document,
    date,
    sequenceNumber
  };

  const data = await db.documentsyncerror.insert(InsertDoc);
  console.log('sync error data Inserted:', data);
};
