import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

export const getTaxSettingsDetails = async () => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let taxSettingsData = {};

  await db.taxsettings
    .findOne({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    })
    .exec()
    .then((data) => {
      // console.log(data)

      if (data) {
        taxSettingsData.tradeName = data.tradeName;
        taxSettingsData.gstin = data.gstin;
        taxSettingsData.legalName = data.legalName;
        taxSettingsData.reverseCharge = data.reverseCharge;
        taxSettingsData.state = data.state;
        taxSettingsData.compositeScheme = data.compositeScheme;
        taxSettingsData.enableGst = data.enableGst;
        taxSettingsData.compositeSchemeValue = data.compositeSchemeValue;
        taxSettingsData.updatedAt = data.updatedAt;
        taxSettingsData.businessId = data.businessId;
        taxSettingsData.businessCity = data.businessCity;
        taxSettingsData.dispatchAddress = data.dispatchAddress;
        taxSettingsData.dispatchPincode = data.dispatchPincode;
        taxSettingsData.dispatchState = data.dispatchState;
        taxSettingsData.dispatchArea = data.dispatchArea;
        taxSettingsData.dispatchCity = data.dispatchCity;
        taxSettingsData.billingAddress = data.billingAddress;
        taxSettingsData.area = data.area;
        taxSettingsData.city = data.city;
        taxSettingsData.pincode = data.pincode;
        taxSettingsData.compositeSchemeType = data.compositeSchemeType;
      }
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });

  return taxSettingsData;
};

export const getGstinNumber = async () => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let gstin;

  await db.taxsettings
    .findOne({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    })
    .exec()
    .then((data) => {
      // console.log(data)

      if (data) {
        gstin = data.gstin;
      }
    })
    .catch((err) => {
      console.log('Internal Server Error', err);
    });

  return gstin;
};
