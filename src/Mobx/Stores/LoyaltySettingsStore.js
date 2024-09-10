import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';
import LoyaltySettings from './classes/LoyaltySettings';

class LoyaltySettingsStore {
  
  loyaltySettingsData = new LoyaltySettings().getDefaultValues();

  defaultLoyaltySettingsData = new LoyaltySettings().getDefaultValues();
  openLoader = false;
  messageOpen = false;
  partyType = '';

  saveData = async () => {
    const db = await Db.get();
    const query = db.loyaltysettings.findOne({
      selector: {
        businessId: this.loyaltySettingsData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addLoyaltySettingsData();
        } else {
          await query
            .update({
              $set: {
                amountPerPoint:this.loyaltySettingsData.amountPerPoint,
                minValueToEarnPoints:this.loyaltySettingsData.minValueToEarnPoints,
                pointExpiry:this.loyaltySettingsData.pointExpiry,
                expiryDays:this.loyaltySettingsData.expiryDays,
                pointPerAmount:this.loyaltySettingsData.pointPerAmount,
                minValueForRedemption:this.loyaltySettingsData.minValueForRedemption,
                minRedemptionPoints:this.loyaltySettingsData.minRedemptionPoints,
                maxRedemptionPoints:this.loyaltySettingsData.maxRedemptionPoints,
                maxDiscount:this.loyaltySettingsData.maxDiscount,
                otpRequired:this.loyaltySettingsData.otpRequired,
                enableRedemption:this.loyaltySettingsData.enableRedemption,
                updatedAt: Date.now(),
                businessId: this.loyaltySettingsData.businessId,
                businessCity: this.loyaltySettingsData.businessCity
              }
            })
            .then(async (data) => {
              // console.log('inside update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Loyalty Settings Internal Server Error', err);
      });
  };

  addLoyaltySettingsData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.loyaltySettingsData.businessId = businessData.businessId;
      this.loyaltySettingsData.businessCity = businessData.businessCity;
    });

    let InsertDoc = this.loyaltySettingsData;
    InsertDoc = new LoyaltySettings().convertTypes(InsertDoc);
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    console.log('Loyalty Settings', InsertDoc);

    await db.loyaltysettings
      .insert(InsertDoc)
      .then(() => {
        console.log('loyalty :: data Inserted');
      })
      .catch((err) => {
        console.log('loyalty :: data insertion Failed::', err);
      });
  };

  getLoyaltySettingsData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.loyaltysettings
      .findOne({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        // console.log(data)

        if (data) {
          runInAction(() => {
            this.loyaltySettingsData.amountPerPoint = data.amountPerPoint;
            this.loyaltySettingsData.minValueToEarnPoints = data.minValueToEarnPoints;
            this.loyaltySettingsData.pointExpiry = data.pointExpiry;
            this.loyaltySettingsData.expiryDays = data.expiryDays;
            this.loyaltySettingsData.pointPerAmount = data.pointPerAmount;
            this.loyaltySettingsData.minValueForRedemption = data.minValueForRedemption;
            this.loyaltySettingsData.minRedemptionPoints = data.minRedemptionPoints;
            this.loyaltySettingsData.maxRedemptionPoints = data.maxRedemptionPoints;
            this.loyaltySettingsData.maxDiscount = data.maxDiscount;
            this.loyaltySettingsData.otpRequired = data.otpRequired;
            this.loyaltySettingsData.enableRedemption = data.enableRedemption;
            this.loyaltySettingsData.businessId = data.businessId;
            this.loyaltySettingsData.businessCity = data.businessCity;
            
          });
        }
      })
      .catch((err) => {
        console.log('loyalty Internal Server Error', err);
      });
  };

  getLoyaltySettingsDetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.loyaltysettings
      .findOne({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        if (data) {
          runInAction(() => {
            this.loyaltySettingsData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.loyaltySettingsData;
  };

  setLoyaltySettingsData = (params, val) => {
    this.loyaltySettingsData[params] = val;
    console.log("this.loyaltySettingsData",this.loyaltySettingsData);
  };

  setOpenLoader = (value) => {
    this.openLoader = value;
  };

  handleWhatsAppCustomMessageCloseDialog = () => {
    this.messageOpen = false;
  };

  handleWhatsAppCustomMessageDialogOpen = (data, partyType) => {
    runInAction(() => {
      this.partyType = partyType;
      this.messageOpen = true;
    });
  };

  constructor() {
    makeObservable(this, {
      messageOpen: observable,
      loyaltySettingsData: observable,
      defaultLoyaltySettingsData: observable,
      setLoyaltySettingsData: action,
      addLoyaltySettingsData: action,
      getLoyaltySettingsData: action,
      getLoyaltySettingsDetails: action,
      saveData: action,
      openLoader: observable,
      handleWhatsAppCustomMessageCloseDialog: action,
      handleWhatsAppCustomMessageDialogOpen: action,
      partyType: observable
    });
  }
}
export default new LoyaltySettingsStore();