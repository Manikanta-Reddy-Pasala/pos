import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

export const addCancelEvent = async (inputCancelledData) => {
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
    data,
    reason
  } = inputCancelledData;

  const { posDeviceId, businessId, businessCity } = businessData;
  const loginDetails = JSON.parse(localStorage.getItem('loginDetails'));

  let InsertDoc = {
    id: transactionId,
    transactionId,
    sequenceNumber,
    transactionType,
    createdDate,
    cancelledDate: newDate,
    total,
    balance,
    data,
    restored: false,
    posId: posDeviceId,
    businessId,
    businessCity,
    updatedAt: Date.now(),
    cancelledEmployeeName: localStorage.getItem('userName'),
    cancelledEmployeePhoneNumber: loginDetails?.username,
    reason
  };

  try {
    const data = await db.alltransactionscancelled.insert(InsertDoc);
    console.log('Data inserted in cancelled invoices:', data);
  } catch (err) {
    console.log('Cancelled error while saving:', err);
  }
};
