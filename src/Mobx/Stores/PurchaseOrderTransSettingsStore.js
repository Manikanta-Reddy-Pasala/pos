import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class PurchaseOrderTransSettingsStore {
  purchaseOrderTransSettingData = {
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

  purchaseOrdertransactionsettings = [];

  getPurchaseOrderTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.purchaseordertransactionsettings
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
            this.purchaseOrderTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.purchaseOrderTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.purchaseordertransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });
    // console.log(query);
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addPurchaseOrderTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                terms: this.purchaseOrderTransSettingData.terms,
                enableOnTxn: this.purchaseOrderTransSettingData.enableOnTxn,
                displayOnBill: this.purchaseOrderTransSettingData.displayOnBill
              }
            })
            .then(async (data) => {
              console.log('inside purchase order transaction update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error Purchase Order Transactions', err);
      });
  };

  addPurchaseOrderTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.purchaseOrderTransSettingData.businessId = businessData.businessId;
      this.purchaseOrderTransSettingData.businessCity =
        businessData.businessCity;
    });

    const InsertDoc = this.purchaseTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.purchaseordertransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('data Inserted Purchase Transaction');
      })
      .catch((err) => {
        console.log('data insertion Purchase Transaction Failed::', err);
      });
  };

  setPurchaseOrderTxnSettingProperty = (
    property,
    subProperty,
    index,
    value
  ) => {
    this.purchaseOrderTransSettingData[property][subProperty][index][
      'enabled'
    ] = value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.purchaseOrderTransSettingData.terms = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      purchaseOrderTransSettingData: observable,
      getPurchaseOrderTransSettingdetails: action,
      setPurchaseOrderTxnSettingProperty: action
    });
  }
}
export default new PurchaseOrderTransSettingsStore();
