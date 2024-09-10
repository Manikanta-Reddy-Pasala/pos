import { observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';
import ReportSettings from './classes/ReportSettings';
import {
  getReportSettings,
  saveReportSettings,
  updateReportSettings
} from 'src/components/Helpers/dbQueries/reportsettings';

class ReportSettingsStore {
  reportTxnEnableFieldsMap = new Map();

  getReportSettingdetails = async () => {
    const reportSettings = await getReportSettings();
    this.reportSettingsData = reportSettings;

    return this.reportSettingsData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.reportsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addReportSetting();
        } else {
          let updateSelector = {
            $set: {
              posId: parseFloat(businessData.posDeviceId),
              updatedAt: Date.now(),
              businessId: businessData.businessId,
              businessCity: businessData.businessCity,
              reportsList: this.reportSettingsData.reportsList
            }
          };

          await updateReportSettings(updateSelector);
        }
      })
      .catch((err) => {
        console.log(
          'Sale Order Transaction Settings Internal Server Error',
          err
        );
      });
  };

  addReportSetting = async () => {
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.reportSettingsData.businessId = businessData.businessId;
      this.reportSettingsData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.reportSettingsData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await saveReportSettings(InsertDoc);
  };

  setReportSettingProperty = (index, value) => {
    this.reportSettingsData.reportsList[index]['enabled'] = value;
    this.saveData();
  };

  setReportTxnEnableFieldsMap = (salesTransSettingData) => {
    runInAction(() => {
      this.reportTxnEnableFieldsMap = new Map();
      if (salesTransSettingData.businessId.length > 2) {
        const productLevel = salesTransSettingData.reportsList;
        productLevel.map((item) => {
          if (this.reportTxnEnableFieldsMap.has(item.name)) {
            this.reportTxnEnableFieldsMap.set(item.name, item.enabled);
          } else {
            this.reportTxnEnableFieldsMap.set(item.name, item.enabled);
          }
        });
      }
    });
  };

  constructor() {
    this.reportSettingsData = new ReportSettings().getDefaultValues();

    makeObservable(this, {
      reportSettingsData: observable,
      reportTxnEnableFieldsMap: observable
    });
  }
}
export default new ReportSettingsStore();