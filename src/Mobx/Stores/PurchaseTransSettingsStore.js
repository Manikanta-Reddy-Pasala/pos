import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class PurchaseTransSettingsStore {
  purchaseTransSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    terms: '',
    enableTDS: false,
    enableTCS: false,
    updatePurchasePriceFromTransaction: false,
    enableOnTxn: {
      productLevel: [],
      billLevel: []
    },
    displayOnBill: {
      productLevel: [],
      billLevel: []
    }
  };

  purchasetransactionsettings = [];

  getPurchaseTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.purchasetransactionsettings
      .findOne({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        // console.log(data)
        if (!data) {
          return;
        }

        if (data) {
          runInAction(() => {
            this.purchaseTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.purchaseTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.purchasetransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });
    // console.log(query);
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addPurchaseTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                terms: this.purchaseTransSettingData.terms,
                enableTDS: this.purchaseTransSettingData.enableTDS,
                enableTCS: this.purchaseTransSettingData.enableTCS,
                updatePurchasePriceFromTransaction: this.purchaseTransSettingData.updatePurchasePriceFromTransaction,
                enableOnTxn: this.purchaseTransSettingData.enableOnTxn,
                displayOnBill: this.purchaseTransSettingData.displayOnBill
              }
            })
            .then(async (data) => {
              console.log('inside purchase transaction update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error Purchase Transactions', err);
      });
  };

  addPurchaseTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.purchaseTransSettingData.businessId = businessData.businessId;
      this.purchaseTransSettingData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.purchaseTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.purchasetransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('data Inserted Purchase Transaction');
      })
      .catch((err) => {
        console.log('data insertion Purchase Transaction Failed::', err);
      });
  };

  setPurchaseTxnSettingProperty = (property, subProperty, index, value) => {
    this.purchaseTransSettingData[property][subProperty][index]['enabled'] =
      value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.purchaseTransSettingData.terms = value;
    this.saveData();
  };

  setEnableTCS = (value) => {
    this.purchaseTransSettingData.enableTCS = value;
    this.saveData();
  };

  setEnableTDS = (value) => {
    this.purchaseTransSettingData.enableTDS = value;
    this.saveData();
  };

  setUpdatePurchasePriceFromTransaction = (value) => {
    this.purchaseTransSettingData.updatePurchasePriceFromTransaction = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      purchaseTransSettingData: observable,
      getPurchaseTransSettingdetails: action,
      setPurchaseTxnSettingProperty: action
    });
  }
}
export default new PurchaseTransSettingsStore();
