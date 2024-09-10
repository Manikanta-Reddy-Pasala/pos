import { observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';
import TaxSettings from './classes/TaxSettings';
import {
  getTaxSettings,
  saveTaxSettings,
  updateTaxSettings
} from 'src/components/Helpers/dbQueries/taxsettings';

class TaxSettingsStore {
  taxSettingsDataList = [];

  saveData = async () => {
    const taxData = await getTaxSettings();
    if (taxData) {
      let updateSelector = {
        $set: {
          tradeName: this.taxSettingsData.tradeName,
          gstin: this.taxSettingsData.gstin,
          legalName: this.taxSettingsData.legalName,
          reverseCharge: this.taxSettingsData.reverseCharge,
          enableGst: this.taxSettingsData.enableGst,
          state: this.taxSettingsData.state,
          compositeScheme: this.taxSettingsData.compositeScheme,
          compositeSchemeValue: this.taxSettingsData.compositeSchemeValue,
          updatedAt: Date.now(),
          businessId: this.taxSettingsData.businessId,
          businessCity: this.taxSettingsData.businessCity,
          dispatchAddress: this.taxSettingsData.dispatchAddress,
          dispatchPincode: this.taxSettingsData.dispatchPincode,
          dispatchState: this.taxSettingsData.dispatchState,
          dispatchCity: this.taxSettingsData.dispatchCity,
          dispatchArea: this.taxSettingsData.dispatchArea,
          billingAddress: this.taxSettingsData.billingAddress,
          area: this.taxSettingsData.area,
          city: this.taxSettingsData.city,
          pincode: this.taxSettingsData.pincode,
          compositeSchemeType: this.taxSettingsData.compositeSchemeType,
          gstPortalUserName: this.taxSettingsData.gstPortalUserName,
          gstPortalEvcPan: this.taxSettingsData.gstPortalEvcPan,
          exporterCodeNo: this.taxSettingsData.exporterCodeNo,
          exporterRegistrationDate:
            this.taxSettingsData.exporterRegistrationDate
        }
      };
      await updateTaxSettings(updateSelector);
    } else {
      this.addTaxSettingsData();
    }
  };

  addTaxSettingsData = async () => {
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.taxSettingsData.businessId = businessData.businessId;
      this.taxSettingsData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.taxSettingsData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await saveTaxSettings(InsertDoc);
  };

  getTaxSettingsData = async () => {
    const taxData = await getTaxSettings();
    runInAction(() => {
      this.taxSettingsData = taxData;
    });
  };

  getTaxSettingsDetails = async () => {
    const taxData = await getTaxSettings();
    runInAction(() => {
      this.taxSettingsData = taxData;
    });

    return this.taxSettingsData;
  };

  setTaxSettingsData = (params, val) => {
    runInAction(() => {
      this.taxSettingsData[params] = val;
    });
  };

  setCompositeSchemeType = (val) => {
    runInAction(() => {
      switch (val) {
        case '1':
          this.taxSettingsData.compositeSchemeType = 'Trader(Goods) 1.0%';
          break;
        case '1.0':
          this.taxSettingsData.compositeSchemeType = 'Manufacturer 1.0%';
          break;
        case '5':
          this.taxSettingsData.compositeSchemeType = 'Restaurant 5.0%';
          break;
        case '6':
          this.taxSettingsData.compositeSchemeType = 'Service Provider 6.0%';
          break;
        default:
          return null;
      }
    });
  };

  constructor() {
    this.taxSettingsData = new TaxSettings().getDefaultValues();
    this.defaultTaxSettingsData = new TaxSettings().getDefaultValues();
    makeObservable(this, {
      taxSettingsData: observable,
      taxSettingsDataList: observable,
      defaultTaxSettingsData: observable
    });
  }
}
export default new TaxSettingsStore();