import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class SaleOrderTransactionSettingsStore {
  saleOrderTransSettingData = {
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

  saleOrdertransactionsettings = [];

  getSaleOrderTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.saleordertransactionsettings
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
            this.saleOrderTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log(
          'Sale Order Transaction Settings Internal Server Error',
          err
        );
      });

    return this.saleOrderTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.saleordertransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addSaleOrderTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                terms: this.saleOrderTransSettingData.terms,
                enableOnTxn: this.saleOrderTransSettingData.enableOnTxn,
                displayOnBill: this.saleOrderTransSettingData.displayOnBill
              }
            })
            .then(async (data) => {
              console.log(
                'Sale Order Transaction Settings inside update',
                data
              );
            });
        }
      })
      .catch((err) => {
        console.log(
          'Sale Order Transaction Settings Internal Server Error',
          err
        );
      });
  };

  addSaleOrderTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.saleOrderTransSettingData.businessId = businessData.businessId;
      this.saleOrderTransSettingData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.saleOrderTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await db.saleordertransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('sale order transaction settings data Inserted');
      })
      .catch((err) => {
        console.log(
          'sale order transaction settings data insertion Failed::',
          err
        );
      });
  };

  setSaleOrderTxnSettingProperty = (property, subProperty, index, value) => {
    this.saleOrderTransSettingData[property][subProperty][index]['enabled'] =
      value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.saleOrderTransSettingData.terms = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      saleOrderTransSettingData: observable,
      getSaleOrderTransSettingdetails: action,
      setSaleOrderTxnSettingProperty: action
    });
  }
}
export default new SaleOrderTransactionSettingsStore();
