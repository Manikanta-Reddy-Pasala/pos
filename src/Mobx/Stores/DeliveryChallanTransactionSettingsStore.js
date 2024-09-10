import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class DeliveryChallanTransactionSettingsStore {
  deliveryChallanTransSettingData = {
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

  deliveryChallantransactionsettings = [];

  getDeliveryChallanTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.deliverychallantransactionsettings.findOne({
      selector: {
        businessId: { $eq: businessData.businessId }
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
            this.deliveryChallanTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Delivery Challan Internal Server Error', err);
      });

    return this.deliveryChallanTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.deliverychallantransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addDeliveryChallanTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                terms: this.deliveryChallanTransSettingData.terms,
                enableOnTxn: this.deliveryChallanTransSettingData.enableOnTxn,
                displayOnBill:
                  this.deliveryChallanTransSettingData.displayOnBill
              }
            })
            .then(async (data) => {
              console.log('Delivery Challan inside update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Delivery Challan Internal Server Error', err);
      });
  };

  addDeliveryChallanTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.deliveryChallanTransSettingData.businessId = businessData.businessId;
      this.deliveryChallanTransSettingData.businessCity =
        businessData.businessCity;
    });

    const InsertDoc = this.deliveryChallanTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.deliverychallantransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('delivery challan data Inserted');
      })
      .catch((err) => {
        console.log('delivery challan data insertion Failed::', err);
      });
  };

  setDeliveryChallanTxnSettingProperty = (
    property,
    subProperty,
    index,
    value
  ) => {
    this.deliveryChallanTransSettingData[property][subProperty][index][
      'enabled'
    ] = value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.deliveryChallanTransSettingData.terms = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      deliveryChallanTransSettingData: observable,
      getDeliveryChallanTransSettingdetails: action,
      setDeliveryChallanTxnSettingProperty: action
    });
  }
}
export default new DeliveryChallanTransactionSettingsStore();
