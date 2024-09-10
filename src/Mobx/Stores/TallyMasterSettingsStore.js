import * as Db from '../../RxDb/Database/Database';
import { observable, makeObservable, runInAction, action } from 'mobx';
import * as Bd from '../../components/SelectedBusiness';
import TallyMasterSettings from './classes/TallyMasterSettings';

class TallyMasterSettingsStore {
  mastersSelectionMap = new Map();

  allTrnasactionsDataForPagination = 0;

  getExportToTallyData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.tallymastersettings.findOne({
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
            this.tallymastersettingsData = data.toJSON();
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.salesMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .salesMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.purchasesMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .purchasesMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.creditNoteMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .creditNoteMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.debitNoteMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .debitNoteMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.expensesMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .expensesMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.taxesMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .taxesMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.roundOffMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .roundOffMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.packingChargesMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .packingChargesMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.shippingChargesMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .shippingChargesMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.shippingChargesMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .shippingChargesMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
            if (
              this.tallymastersettingsData &&
              this.tallymastersettingsData.discountMastersMapping
            ) {
              for (let option of this.tallymastersettingsData
                .discountMastersMapping) {
                this.setMasterSelectionIndex(option.oneshellLedgerName, true);
              }
            }
          });
        }
      })
      .catch((err) => {
        console.log('Export To Tally Get Internal Server Error', err);
      });
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.tallymastersettings.findOne({
      selector: {
        businessId: businessData.businessId
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
              salesMastersMapping:
                this.tallymastersettingsData.salesMastersMapping,
              purchasesMastersMapping:
                this.tallymastersettingsData.purchasesMastersMapping,
              creditNoteMastersMapping:
                this.tallymastersettingsData.creditNoteMastersMapping,
              debitNoteMastersMapping:
                this.tallymastersettingsData.debitNoteMastersMapping,
              expensesMastersMapping:
                this.tallymastersettingsData.expensesMastersMapping,
              taxesMastersMapping:
                this.tallymastersettingsData.taxesMastersMapping,
              roundOffMastersMapping:
                this.tallymastersettingsData.roundOffMastersMapping,
              packingChargesMastersMapping:
                this.tallymastersettingsData.packingChargesMastersMapping,
              shippingChargesMastersMapping:
                this.tallymastersettingsData.shippingChargesMastersMapping,
              discountMastersMapping:
                this.tallymastersettingsData.discountMastersMapping,
              customerMastersMapping:
                this.tallymastersettingsData.customerMastersMapping,
              vendorMastersMapping:
                this.tallymastersettingsData.vendorMastersMapping,
              tallyCompanyName: this.tallymastersettingsData.tallyCompanyName,
              b2b: this.tallymastersettingsData.b2b,
              b2c: this.tallymastersettingsData.b2c
            }
          })
          .then(async (data) => {
            console.log('Export To Tally inside update', data);
          });
      })
      .catch((err) => {
        console.log('Export To Tally update Internal Server Error', err);
      });
  };

  setTxnProperty = (property, subProperty, index, value) => {
    runInAction(() => {
      this.tallymastersettingsData[property][index][subProperty] = value;
    });
  };

  setTallyCompanyName = (value) => {
    runInAction(() => {
      this.tallymastersettingsData.tallyCompanyName = value;
    });
  };

  setTallyB2B = (value) => {
    runInAction(() => {
      this.tallymastersettingsData.b2b = value;
    });
    this.saveData();
  };

  setTallyB2C = (value) => {
    runInAction(() => {
      this.tallymastersettingsData.b2c = value;
    });
    this.saveData();
  };

  resetMastersToDefaultSettings = (tallyDefaultSettings) => {
    runInAction(() => {
      this.tallymastersettingsData.salesMastersMapping =
        tallyDefaultSettings.salesMastersMapping;
      this.tallymastersettingsData.purchasesMastersMapping =
        tallyDefaultSettings.purchasesMastersMapping;
      this.tallymastersettingsData.creditNoteMastersMapping =
        tallyDefaultSettings.creditNoteMastersMapping;
      this.tallymastersettingsData.debitNoteMastersMapping =
        tallyDefaultSettings.debitNoteMastersMapping;
      this.tallymastersettingsData.expensesMastersMapping =
        tallyDefaultSettings.expensesMastersMapping;
      this.tallymastersettingsData.taxesMastersMapping =
        tallyDefaultSettings.taxesMastersMapping;
      this.tallymastersettingsData.roundOffMastersMapping =
        tallyDefaultSettings.roundOffMastersMapping;
      this.tallymastersettingsData.packingChargesMastersMapping =
        tallyDefaultSettings.packingChargesMastersMapping;
      this.tallymastersettingsData.shippingChargesMastersMapping =
        tallyDefaultSettings.shippingChargesMastersMapping;
      this.tallymastersettingsData.discountMastersMapping =
        tallyDefaultSettings.discountMastersMapping;
      this.tallymastersettingsData.tallyCompanyName =
        tallyDefaultSettings.tallyCompanyName;
      this.tallymastersettingsData.b2b = tallyDefaultSettings.b2b;
      this.tallymastersettingsData.b2c = tallyDefaultSettings.b2c;
    });
    this.saveData();
  };

  resetPartiesToDefaultSettings = (tallyDefaultSettings) => {
    runInAction(() => {
      this.tallymastersettingsData.customerMastersMapping =
        tallyDefaultSettings.customerMastersMapping;
      this.tallymastersettingsData.vendorMastersMapping =
        tallyDefaultSettings.vendorMastersMapping;
    });

    this.saveData();
  };

  getTallyLedgerName = (oneshellLedgerName, property) => {
    let tallyLedgerName = '';
    for (let obj of this.tallymastersettingsData[property]) {
      if (oneshellLedgerName === obj.oneshellLedgerName) {
        tallyLedgerName = obj.tallyLedgerName;
        break;
      }
    }

    return tallyLedgerName;
  };

  getTallyGroupName = (oneshellLedgerName, property) => {
    let tallyLedgerName = '';
    for (let obj of this.tallymastersettingsData[property]) {
      if (oneshellLedgerName === obj.oneshellLedgerName) {
        tallyLedgerName = obj.tallyLedgerGroup
          ? obj.tallyLedgerGroup
          : obj.tallyParentGroup;
        break;
      }
    }

    return tallyLedgerName;
  };

  setMasterSelectionIndex = (oneshellLedgerName, value) => {
    runInAction(() => {
      this.mastersSelectionMap.set(oneshellLedgerName, value);
    });
  };

  setAllTrnasactionsDataForPagination = (value) => {
    runInAction(() => {
      this.allTrnasactionsDataForPagination = value;
    });
  };

  getAllTrnasactionsDataForPagination = () => {
    return this.allTrnasactionsDataForPagination;
  };

  constructor() {
    this.tallymastersettingsData = new TallyMasterSettings().getDefaultValues();
    this.tallymastersettingsDataDefault =
      new TallyMasterSettings().getDefaultValues();

    makeObservable(this, {
      tallymastersettingsData: observable,
      mastersSelectionMap: observable,
      setMasterSelectionIndex: action,
      allTrnasactionsDataForPagination: observable
    });
  }
}
export default new TallyMasterSettingsStore();