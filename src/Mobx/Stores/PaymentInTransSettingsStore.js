import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class PaymentInTransSettingsStore {
  paymentInTransSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    enableTDS: false,
    enableTCS: false,
    terms: ''
  };

  paymentIntransactionsettings = [];

  getPaymentInTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.paymentintransactionsettings
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
            this.paymentInTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.paymentInTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.paymentintransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });
    // console.log(query);
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addPaymentInTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                enableTDS: this.paymentInTransSettingData.enableTDS,
                enableTCS: this.paymentInTransSettingData.enableTCS,
                terms: this.paymentInTransSettingData.terms
              }
            })
            .then(async (data) => {
              console.log('inside update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  addPaymentInTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.paymentInTransSettingData.businessId = businessData.businessId;
      this.paymentInTransSettingData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.paymentInTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await db.paymentintransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('data Inserted');
      })
      .catch((err) => {
        console.log('data insertion Failed::', err);
      });
  };

  setPaymentInTxnSettingProperty = (property, subProperty, index, value) => {
    this.paymentInTransSettingData[property][subProperty][index]['enabled'] = value;
    this.saveData();
  };

  setEnableTCS = (value) => {
    this.paymentInTransSettingData.enableTCS = value;
    this.saveData();
  };

  setEnableTDS = (value) => {
    this.paymentInTransSettingData.enableTDS = value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.paymentInTransSettingData.terms = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      paymentInTransSettingData: observable,
      getPaymentInTransSettingdetails: action,
      setPaymentInTxnSettingProperty: action
    });
  }
}
export default new PaymentInTransSettingsStore();
