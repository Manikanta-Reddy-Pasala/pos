import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class KOTTransactionSettingsStore {

  kotTransSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    enableOnTxn: {
      productLevel: [],
      billLevel: []
    },
    displayOnBill: {
      productLevel: [],
      billLevel: []
    },
    enableTouchKOTUI: false
  };

  kottransactionsettings = [];

  getKotTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.kottransactionsettings
      .findOne({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
       
        if (!data) {
          return;
        }

        if (data) {
          runInAction(() => {
            this.kotTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.kotTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.kottransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });
    
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addKotTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                enableOnTxn: this.kotTransSettingData.enableOnTxn,
                displayOnBill: this.kotTransSettingData.displayOnBill,
                enableTouchKOTUI: this.kotTransSettingData.enableTouchKOTUI
              }
            })
            .then(async (data) => {
              console.log('inside kot update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  addKotTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.kotTransSettingData.businessId = businessData.businessId;
      this.kotTransSettingData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.kotTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.kottransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('kot settings data Inserted');
      })
      .catch((err) => {
        console.log('kot settings data insertion Failed::', err);
      });
  };

  setEnableTouchKOTUI = (value) => {
    this.kotTransSettingData.enableTouchKOTUI = value;
    this.saveData();
  }

  setKotTxnSettingProperty = (property, subProperty, index, value) => {
    this.kotTransSettingData[property][subProperty][index]['enabled'] = value;
    if(String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      // To do handle simultaneous check of price and price per gram
    }
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      kotTransSettingData: observable,
      getKotTransSettingdetails: action,
      setKotTxnSettingProperty: action
    });
  }
}
export default new KOTTransactionSettingsStore();
