import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

export const addAuditEvent = async (
  id,
  sequenceNumber,
  auditType,
  action,
  data,
  errorMessage,
  date
) => {
  const db = await Db.get();
  const { posDeviceId, businessId, businessCity } = await Bd.getBusinessData();

  const InsertDoc = {
    id,
    sequenceNumber,
    auditType,
    action,
    data,
    errorMessage,
    timestampString: Date.now().toString(),
    employeeId: localStorage.getItem('mobileNumber'),
    employeeName: localStorage.getItem('userName'),
    posId: posDeviceId,
    businessId,
    businessCity,
    updatedAt: Date.now(),
    date,
    description: ''
  };

  try {
    const data = await db.audit.insert(InsertDoc);
    console.log('data Inserted:', data);
  } catch (err) {
    console.log('audit data error while saving:', err);
  }
};

export const getMonthValue = () => [
  { val: 1, name: 'Jan' },
  { val: 2, name: 'Feb' },
  { val: 3, name: 'Mar' },
  { val: 4, name: 'Apr' },
  { val: 5, name: 'May' },
  { val: 6, name: 'June' },
  { val: 7, name: 'July' },
  { val: 8, name: 'Aug' },
  { val: 9, name: 'Sep' },
  { val: 10, name: 'Oct' },
  { val: 11, name: 'Nov' },
  { val: 12, name: 'Dec' }
];

export const getTaxRateValue = () => [
  { val: 0, name: '0 %' },
  { val: 0.25, name: '0.25 %' },
  { val: 1.5, name: '1.5 %' },
  { val: 3, name: '3 %' },
  { val: 5, name: '5 %' },
  { val: 12, name: '12 %' },
  { val: 18, name: '18 %' },
  { val: 28, name: '28 %' }
];

export const getAuditSettingsData = async () => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let auditSettings = {
    id: '',
    posId: 0,
    updatedAt: Date.now(),
    businessId: '',
    businessCity: '',
    autoPushPendingFailed: false,
    einvoiceAlert: false,
    lockSales: [],
    taxApplicability: [],
    shippingPackingTax: 0,
    taxRateAutofillList: []
  };

  try {
    const data = await db.auditsettings
      .findOne({
        selector: { $and: [{ businessId: { $eq: businessData.businessId } }] }
      })
      .exec();
    if (data) {
      auditSettings = data;
    }
  } catch (err) {
    console.log('Internal Server Error', err);
  }

  return auditSettings;
};