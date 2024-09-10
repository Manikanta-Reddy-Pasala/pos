import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class SplitPaymentSettingsStore {
  splitPaymentSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    cashEnabled: true,
    bankEnabled: false,
    chequeEnabled: false,
    bankList: [],
    giftCardEnabled: false,
    giftCardList: [],
    customFinanceEnabled: false,
    customFinanceList: [],
    defaultBankSelected: '',
    exchangeEnabled: false,
    exchangeList: []
  };

  defaultSplitPaymentSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    cashEnabled: true,
    bankEnabled: false,
    chequeEnabled: false,
    bankList: [],
    giftCardEnabled: false,
    giftCardList: [],
    customFinanceEnabled: false,
    customFinanceList: [],
    defaultBankSelected: '',
    exchangeEnabled: false,
    exchangeList: []
  };

  bankAccounts = [];

  getSplitPaymentSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.splitpaymentsettings
      .findOne({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        // console.log(data)
        if (!data) {
          this.splitPaymentSettingData = this.defaultSplitPaymentSettingData;
          return;
        }

        if (data) {
          runInAction(() => {
            this.splitPaymentSettingData = data.toJSON();
            if (
              this.splitPaymentSettingData.bankList &&
              this.splitPaymentSettingData.bankList.length > 0
            ) {
              for (let bank of this.bankAccounts) {
                bank.enabled =
                  this.splitPaymentSettingData.bankList.indexOf(
                    bank.accountDisplayName
                  ) > -1
                    ? true
                    : false;
              }
            }
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.splitPaymentSettingData;
  };

  setBankAccounts = async (value) => {
    this.bankAccounts = value;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.splitpaymentsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addSplitPaymentTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                cashEnabled: true,
                bankEnabled: this.splitPaymentSettingData.bankEnabled,
                chequeEnabled: this.splitPaymentSettingData.chequeEnabled,
                bankList: this.splitPaymentSettingData.bankList,
                giftCardEnabled: this.splitPaymentSettingData.giftCardEnabled,
                giftCardList: this.splitPaymentSettingData.giftCardList,
                customFinanceEnabled:
                  this.splitPaymentSettingData.customFinanceEnabled,
                customFinanceList:
                  this.splitPaymentSettingData.customFinanceList,
                defaultBankSelected:
                  this.splitPaymentSettingData.defaultBankSelected,
                exchangeEnabled: this.splitPaymentSettingData.exchangeEnabled,
                exchangeList:
                  this.splitPaymentSettingData.exchangeList
              }
            })
            .then(async (data) => {
              console.log('inside update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  addSplitPaymentTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.splitPaymentSettingData.businessId = businessData.businessId;
      this.splitPaymentSettingData.businessCity = businessData.businessCity;
    });

    this.splitPaymentSettingData.cashEnabled = true;

    const InsertDoc = this.splitPaymentSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await db.splitpaymentsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('data Inserted');
      })
      .catch((err) => {
        console.log('data insertion Failed::', err);
      });
  };

  setCash = (value) => {
    this.splitPaymentSettingData.cashEnabled = value;
    this.saveData();
  };

  setBank = (value) => {
    this.splitPaymentSettingData.bankEnabled = value;
    this.saveData();
  };

  setCheque = (value) => {
    this.splitPaymentSettingData.chequeEnabled = value;
    this.saveData();
  };

  setDefaultBank = (value) => {
    this.splitPaymentSettingData.defaultBankSelected = value;
    this.saveData();
  };

  setGiftCard = (value) => {
    this.splitPaymentSettingData.giftCardEnabled = value;
    this.saveData();
  };

  addGiftCard = (value) => {
    this.splitPaymentSettingData.giftCardList.push(value);
    this.saveData();
  };

  removeGiftCard = (index, value) => {
    this.splitPaymentSettingData.giftCardList.splice(index, 1);
    this.saveData();
  };

  setCustomFinance = (value) => {
    this.splitPaymentSettingData.customFinanceEnabled = value;
    this.saveData();
  };

  addCustomFinance = (value) => {
    this.splitPaymentSettingData.customFinanceList.push(value);
    this.saveData();
  };

  removeCustomFinance = (index, value) => {
    this.splitPaymentSettingData.customFinanceList.splice(index, 1);
    this.saveData();
  };

  setExchange = (value) => {
    this.splitPaymentSettingData.exchangeEnabled = value;
    this.saveData();
  };

  addExchange = (value) => {
    this.splitPaymentSettingData.exchangeList.push(value);
    this.saveData();
  };

  removeExchange = (index, value) => {
    this.splitPaymentSettingData.exchangeList.splice(index, 1);
    this.saveData();
  };

  setBankChecked = (index, value) => {
    this.bankAccounts[index].enabled = value;
    this.splitPaymentSettingData.bankList = [];
    for (let bank of this.bankAccounts) {
      if (bank.enabled === true) {
        this.splitPaymentSettingData.bankList.push(bank.accountDisplayName);
      }
    }
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      splitPaymentSettingData: observable,
      bankAccounts: observable,
      getSplitPaymentSettingdetails: action
    });
  }
}
export default new SplitPaymentSettingsStore();