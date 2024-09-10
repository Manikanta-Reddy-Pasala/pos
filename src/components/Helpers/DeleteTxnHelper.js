import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

export const addDeleteEvent = async (inputDeletedData) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  const newDate = new Date().toISOString().slice(0, 10);
  const {
    transactionId,
    sequenceNumber,
    transactionType,
    createdDate,
    total,
    balance,
    data
  } = inputDeletedData;

  const { posDeviceId, businessId, businessCity } = businessData;
  const loginDetails = JSON.parse(localStorage.getItem('loginDetails'));

  let InsertDoc = {
    id: transactionId,
    transactionId,
    sequenceNumber,
    transactionType,
    createdDate,
    deletedDate: newDate,
    total,
    balance,
    data,
    restored: false,
    posId: posDeviceId,
    businessId,
    businessCity,
    updatedAt: Date.now(),
    deletedEmployeeName: localStorage.getItem('userName'),
    deletedEmployeePhoneNumber: loginDetails?.username
  };

  try {
    await db.alltransactionsdeleted.insert(InsertDoc);
    console.log('Data inserted in deleted backup');
  } catch (err) {
    console.log('Deleted backup error while saving:', err);
  }
};
