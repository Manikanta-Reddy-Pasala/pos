import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import CloudPrinterSettings from './classes/CloudPrinterSettings';
import * as deviceIdHelper from '../../components/Helpers/PrintHelper/CloudPrintHelper';

class CloudPrintSettingsStore {
  
  
  saveData = async () => {
    const db = await Db.get();

    const query = db.cloudprintsettings.findOne({
      selector: {
        businessId: this.cloudPrinterSettings.businessId
      }
    });
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addCloudPrintSettingsData();
        } else {
          await query
            .update({
              $set: {
                deviceName: this.cloudPrinterSettings.deviceName,
                id: this.cloudPrinterSettings.id,
                cloudPrinterSelected:
                  this.cloudPrinterSettings.cloudPrinterSelected,
                enableMessageReceive:
                  this.cloudPrinterSettings.enableMessageReceive,
                enableMessageSend: this.cloudPrinterSettings.enableMessageSend,
                updatedAt: Date.now(),
                businessId: this.cloudPrinterSettings.businessId,
                businessCity: this.cloudPrinterSettings.businessCity,
                posId: this.cloudPrinterSettings.posId,
                playerId: this.cloudPrinterSettings.playerId,
              }
            })
            .then(async (data) => {});
        }
      })
      .catch((err) => {
        console.log('Internal Server Error Cloud Printer Settings', err);
      });
  };

  addCloudPrintSettingsData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.cloudPrinterSettings.businessId = businessData.businessId;
      this.cloudPrinterSettings.businessCity = businessData.businessCity;
    });
    
    this.cloudPrinterSettings.id = localStorage.getItem('deviceId');

    this.cloudPrinterSettings.posId = parseFloat(businessData.posDeviceId);
    this.cloudPrinterSettings.updatedAt = Date.now();

    this.cloudPrinterSettings.playerId = localStorage.getItem('firebasePlayerId');

    let InsertDoc = { ...this.cloudPrinterSettings };
    InsertDoc = new CloudPrinterSettings().convertTypes(InsertDoc);

    await db.cloudprintsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('this.cloudPrinterSettings:: data Inserted');
      })
      .catch((err) => {
        console.log('this.cloudPrinterSettings:: data insertion Failed::', err);
      });
  };

  getCloudPrinterSettingsData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let id = localStorage.getItem('deviceId');
    await db.cloudprintsettings
      .findOne({
        selector: {
          $and: [
            { id: id },
            { businessId: { $eq: businessData.businessId } }
          ]
        }
      })
      .exec()
      .then((data) => {
        
        if(!data) {
          this.cloudPrinterSettings = this.cloudPrinterSettingsDefault;
        }

        if (data) {
          runInAction(() => {
            this.cloudPrinterSettings.deviceName = data.deviceName;
            this.cloudPrinterSettings.id = data.id;
            this.cloudPrinterSettings.cloudPrinterSelected =
              data.cloudPrinterSelected;
            this.cloudPrinterSettings.enableMessageReceive =
              data.enableMessageReceive;
            this.cloudPrinterSettings.enableMessageSend =
              data.enableMessageSend;
            this.cloudPrinterSettings.updatedAt = data.updatedAt;
            this.cloudPrinterSettings.businessId = data.businessId;
            this.cloudPrinterSettings.businessCity = data.businessCity;
            this.cloudPrinterSettings.posId = data.posId;
            this.cloudPrinterSettings.playerId = data.playerId;
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setCloudPrinterSettingsData = (params, val) => {
    this.cloudPrinterSettings[params] = val;
  };

  constructor() {
    this.cloudPrinterSettings = new CloudPrinterSettings().defaultValues();
    this.cloudPrinterSettingsDefault =
      new CloudPrinterSettings().defaultValues();

    makeObservable(this, {
      cloudPrinterSettings: observable,
      setCloudPrinterSettingsData: action,
      getCloudPrinterSettingsData: action,
      saveData: action
    });
  }
}
export default new CloudPrintSettingsStore();