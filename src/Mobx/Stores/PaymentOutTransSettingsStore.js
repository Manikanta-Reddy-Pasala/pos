import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class PaymentOutTransSettingsStore {
  paymentOutTransSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    enableTDS: false,
    enableTCS: false,
    terms: ''
  };

  paymentOuttransactionsettings = [];

  getPaymentOutTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.paymentouttransactionsettings
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
            this.paymentOutTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.paymentOutTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.paymentouttransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });
    // console.log(query);
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addPaymentOutTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                enableTDS: this.paymentOutTransSettingData.enableTDS,
                enableTCS: this.paymentOutTransSettingData.enableTCS,
                terms: this.paymentOutTransSettingData.terms
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

  addPaymentOutTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.paymentOutTransSettingData.businessId = businessData.businessId;
      this.paymentOutTransSettingData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.paymentOutTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await db.paymentouttransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('data Inserted');
      })
      .catch((err) => {
        console.log('data insertion Failed::', err);
      });
  };

  setPaymentOutTxnSettingProperty = (property, subProperty, index, value) => {
    this.paymentOutTransSettingData[property][subProperty][index]['enabled'] = value;
    this.saveData();
  };

  setEnableTCS = (value) => {
    this.paymentOutTransSettingData.enableTCS = value;
    this.saveData();
  };

  setEnableTDS = (value) => {
    this.paymentOutTransSettingData.enableTDS = value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.paymentOutTransSettingData.terms = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      paymentOutTransSettingData: observable,
      getPaymentOutTransSettingdetails: action,
      setPaymentOutTxnSettingProperty: action
    });
  }
}
export default new PaymentOutTransSettingsStore();
