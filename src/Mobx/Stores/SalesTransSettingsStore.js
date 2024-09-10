import { observable, makeObservable, runInAction } from 'mobx';
import * as Bd from 'src/components/SelectedBusiness';
import SaleTransactionSettings from 'src/Mobx/Stores/classes/SaleTransactionSettings';
import {
  getSaleTransactionSettings,
  updateSaleTransactionSettings
} from 'src/components/Helpers/dbQueries/saletransactionsettings';

class SalesTransSettingsStore {
  saletransactionsettings = [];

  getSalesTransSettingdetails = async () => {
    this.salesTransSettingData = await getSaleTransactionSettings();
    return this.salesTransSettingData;
  };

  saveData = async () => {
    const businessData = await Bd.getBusinessData();
    let updateSelector = {
      $set: {
        posId: parseFloat(businessData.posDeviceId),
        updatedAt: Date.now(),
        businessId: businessData.businessId,
        businessCity: businessData.businessCity,
        billTitle: this.salesTransSettingData.billTitle,
        updateRawMaterialsStock:
          this.salesTransSettingData.updateRawMaterialsStock,
        enableTDS: this.salesTransSettingData.enableTDS,
        enableTCS: this.salesTransSettingData.enableTCS,
        enableShipTo: this.salesTransSettingData.enableShipTo,
        enableSalesMan: this.salesTransSettingData.enableSalesMan,
        enableNegativeStockAlert:
          this.salesTransSettingData.enableNegativeStockAlert,
        terms: this.salesTransSettingData.terms,
        enableOnTxn: this.salesTransSettingData.enableOnTxn,
        displayOnBill: this.salesTransSettingData.displayOnBill,
        menuType: this.salesTransSettingData.menuType,
        enableExport: this.salesTransSettingData.enableExport,
        enableBuyerOtherThanConsignee: this.salesTransSettingData.enableBuyerOtherThanConsignee
      }
    };

    await updateSaleTransactionSettings(updateSelector);
  };

  setSalesTxnSettingProperty = (property, subProperty, index, value) => {
    this.salesTransSettingData[property][subProperty][index]['enabled'] = value;
    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      // To do handle simultaneous check of price and price per gram
    }
    this.saveData();
  };

  setBillTitle = (value) => {
    runInAction(() => {
      this.salesTransSettingData.billTitle = value;
    });
    this.saveData();
  };

  setBillTerms = (value) => {
    runInAction(() => {
      this.salesTransSettingData.terms = value;
    });
    this.saveData();
  };

  setMenuType = (value) => {
    runInAction(() => {
      this.salesTransSettingData.menuType = value;
    });
    this.saveData();
  };

  setFeatureProperty = (property, value) => {
    runInAction(() => {
      this.salesTransSettingData[property] = value;
    });
    this.saveData();
  };

  constructor() {
    this.salesTransSettingData = new SaleTransactionSettings().defaultValues();
    makeObservable(this, {
      salesTransSettingData: observable
    });
  }
}
export default new SalesTransSettingsStore();