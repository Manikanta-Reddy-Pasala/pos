import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class ProductTransactionSettingsStore {
  productTransSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    autoGenerateBarcode: false,
    autoGenerateUniqueBarcodeForBatches: true,
    expiryNotificationDays: 0,
    showStockAlertInDashboard: false,
    enableOnTxn: {
      productLevel: [],
      billLevel: []
    },
    displayOnBill: {
      productLevel: [],
      billLevel: []
    }
  };

  producttransactionsettings = [];

  getProductTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.producttransactionsettings.findOne({
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
            this.productTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Product Transaction Settings Internal Server Error', err);
      });

    return this.productTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.producttransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addProductTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                autoGenerateBarcode:
                  this.productTransSettingData.autoGenerateBarcode,
                autoGenerateUniqueBarcodeForBatches:
                  this.productTransSettingData
                    .autoGenerateUniqueBarcodeForBatches,
                enableOnTxn: this.productTransSettingData.enableOnTxn,
                displayOnBill: this.productTransSettingData.displayOnBill,
                showStockAlertInDashboard:
                  this.productTransSettingData.showStockAlertInDashboard,
                expiryNotificationDays:
                  this.productTransSettingData.expiryNotificationDays
              }
            })
            .then(async (data) => {
              // console.log('Product Transaction Settings inside update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Product Transaction Settings Internal Server Error', err);
      });
  };

  addProductTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.productTransSettingData.businessId = businessData.businessId;
      this.productTransSettingData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.productTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.producttransactionsettings
      .insert(InsertDoc)
      .then(() => {
        // console.log('product transaction settings data Inserted');
      })
      .catch((err) => {
        console.log(
          'product transaction settings data insertion Failed::',
          err
        );
      });
  };

  setProductTxnSettingProperty = (property, subProperty, index, value) => {
    runInAction(() => {
      this.productTransSettingData[property][subProperty][index]['enabled'] =
        value;
    });
    this.saveData();
  };

  setAutoGenerateBarcode = (value) => {
    runInAction(() => {
      this.productTransSettingData.autoGenerateBarcode = value;
      if (value === false) {
        this.productTransSettingData.autoGenerateUniqueBarcodeForBatches = false;
      } else {
        this.productTransSettingData.autoGenerateUniqueBarcodeForBatches = true;
      }
    });
    this.saveData();
  };

  setAutoGenerateBarcodeUniqueBarcodeForBatches = (value) => {
    runInAction(() => {
      this.productTransSettingData.autoGenerateUniqueBarcodeForBatches = value;
    });
    this.saveData();
  };

  setExpiryNotificationDays = (value) => {
    runInAction(() => {
      this.productTransSettingData.expiryNotificationDays = value
        ? parseInt(value)
        : 0;
    });
    this.saveData();
  };

  setShowStockAlertInDashboard = (value) => {
    runInAction(() => {
      this.productTransSettingData.showStockAlertInDashboard = value;
    });
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      productTransSettingData: observable,
      getProductTransSettingdetails: action,
      setProductTxnSettingProperty: action
    });
  }
}
export default new ProductTransactionSettingsStore();