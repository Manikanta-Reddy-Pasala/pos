import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class JobWorkInTransactionSettingsStore {
  jobWorkInTransSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    terms: '',
    enableOnTxn: {
      productLevel: [],
      billLevel: []
    },
    displayOnBill: {
      productLevel: [],
      billLevel: []
    }
  };

  jobWorkInTransactionSettings = [];

  getJobWorkInTransSettingdetails = async () => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    const query = db.jobworkintransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then((data) => {
        // console.log(data)
        if (!data) {
          return;
        }

        if (data) {
          runInAction(() => {
            this.jobWorkInTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log(
          'Job Work In Transaction Settings Internal Server Error',
          err
        );
      });

    return this.jobWorkInTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.jobworkintransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addJobWorkInTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                terms: this.jobWorkInTransSettingData.terms,
                enableOnTxn: this.jobWorkInTransSettingData.enableOnTxn,
                displayOnBill: this.jobWorkInTransSettingData.displayOnBill
              }
            })
            .then(async (data) => {
              console.log(
                'Job Work In Transaction Settings inside update',
                data
              );
            });
        }
      })
      .catch((err) => {
        console.log(
          'Job Work In Transaction Settings Internal Server Error',
          err
        );
      });
  };

  addJobWorkInTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.jobWorkInTransSettingData.businessId = businessData.businessId;
      this.jobWorkInTransSettingData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.jobWorkInTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.jobworkintransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('Job Work In Transaction Settings data Inserted');
      })
      .catch((err) => {
        console.log(
          'Job Work In Transaction Settings data insertion Failed::',
          err
        );
      });
  };

  setJobWorkInTxnSettingProperty = (property, subProperty, index, value) => {
    this.jobWorkInTransSettingData[property][subProperty][index]['enabled'] =
      value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.jobWorkInTransSettingData.terms = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      jobWorkInTransSettingData: observable,
      getJobWorkInTransSettingdetails: action,
      setJobWorkInTxnSettingProperty: action
    });
  }
}
export default new JobWorkInTransactionSettingsStore();
