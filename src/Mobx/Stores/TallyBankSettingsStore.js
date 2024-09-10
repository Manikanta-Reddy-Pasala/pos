import * as Db from '../../RxDb/Database/Database';
import { observable, makeObservable, runInAction } from 'mobx';
import * as Bd from '../../components/SelectedBusiness';

class TallyBankSettingsStore {
  tallybankmastersettingsData = [];

  getBankExportToTallyData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.tallybankmastersettings.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        if (!data) {
          return;
        }

        if (data) {
          runInAction(() => {
            if (data && data.length > 0) {
              this.tallybankmastersettingsData = data.map((item) =>
                item.toJSON()
              );
            }
          });
        }
      })
      .catch((err) => {
        console.log('Export To Tally Banks Get Internal Server Error', err);
      });
  };

  saveData = async (bankSetting) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.tallybankmastersettings.findOne({
      selector: {
        businessId: businessData.businessId,
        id: bankSetting.id
      }
    });

    await query
      .exec()
      .then(async (data) => {
        await query
          .update({
            $set: {
              posId: parseFloat(businessData.posDeviceId),
              updatedAt: Date.now(),
              businessId: businessData.businessId,
              businessCity: businessData.businessCity,
              id: data.id,
              oneshellLedgerName:
              bankSetting.oneshellLedgerName,
              tallyLedgerName: bankSetting.tallyLedgerName,
              tallyLedgerGroup:
              bankSetting.tallyLedgerGroup,
              tallyParentGroup:
              bankSetting.tallyParentGroup,
              description: bankSetting.description
            }
          })
          .then(async (data) => {
            console.log('Export To Tally Bank inside update', data);
          });
      })
      .catch((err) => {
        console.log('Export To Tally Bank update Internal Server Error', err);
      });
  };

  setTxnProperty = (subProperty, index, value) => {
    this.tallybankmastersettingsData[index][subProperty] = value;
    this.saveData(this.tallybankmastersettingsData[index]);
  };

  getBankTallyLedgerName = (oneshellLedgerName) => {
    let tallyLedgerName = '';
    for (let obj of this.tallybankmastersettingsData) {
      if (oneshellLedgerName === obj.oneshellLedgerName) {
        tallyLedgerName = obj.tallyLedgerName;
        break;
      }
    }

    return tallyLedgerName;
  };

  constructor() {
    makeObservable(this, {
      tallybankmastersettingsData: observable
    });
  }
}
export default new TallyBankSettingsStore();
