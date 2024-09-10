import { observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';
import Contra from './classes/Contra';
import {
  getAllContraByDateRange,
  saveContra,
  updateContra,
  deleteContraById
} from 'src/components/Helpers/dbQueries/contra';
import { getBankAccounts } from 'src/components/Helpers/dbQueries/bankaccounts';
import { getSplitPaymentSettings } from 'src/components/Helpers/dbQueries/splitpaymentsettings';
import { getTransactionSettings } from 'src/components/Helpers/dbQueries/transactionsettings';
import { getPrinterSettings } from 'src/components/Helpers/dbQueries/printersettings';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import { getCashInHand } from 'src/components/Helpers/dbQueries/alltransactions';

class ContraStore {
  contraDialogOpen = false;
  contraList = [];
  isContraList = false;
  isEdit = false;
  chosenPaymentType = 'Cash';
  splitPaymentSettingsData = {};
  bankAccountsList = [];

  openContraErrorAlertMessage = false;
  errorAlertMessage = '';
  transaction = {};
  invoiceThermal = {};
  invoiceRegular = {};

  constructor() {
    this.contra = new Contra().getDefaultValues();
    this.contraDefault = new Contra().getDefaultValues();

    makeObservable(this, {
      contra: observable,
      contraDialogOpen: observable,
      contraList: observable,
      bankAccountsList: observable,
      openContraErrorAlertMessage: observable,
      errorAlertMessage: observable,
      splitPaymentSettingsData: observable,
      chosenPaymentType: observable,
      isContraList: observable,
      isEdit: observable
    });
  }

  handleContraModalOpen = () => {
    runInAction(() => {
      this.contra = this.contraDefault;
      this.contraDialogOpen = true;
    });
  };

  handleContraModalClose = () => {
    runInAction(() => {
      this.contraDialogOpen = false;
      this.isEdit = false;
    });
  };

  saveData = async () => {
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('ctr');
    this.contra.id = `${id}${appId}${timestamp}`;
    this.contra.businessId = businessData.businessId;
    this.contra.businessCity = businessData.businessCity;
    this.contra.posId = parseFloat(businessData.posDeviceId);
    this.contra.updatedAt = Date.now();

    let InsertDoc = { ...this.contra };
    InsertDoc = new Contra().convertTypes(InsertDoc);

    const status = await saveContra(InsertDoc);
    if (status) {
      runInAction(() => {
        this.isContraList = true;
        this.handleContraModalClose();
      });
    } else {
      //show error
      runInAction(() => {
        this.handleContraModalClose();
        this.errorAlertMessage = 'Something went wrong while saving Contra!!!';
        this.handleOpenContraErrorAlertMessage();
      });
    }
  };

  updateData = async () => {
    let updateSelector = {
      $set: {
        date: this.contra.date,
        sequenceNumber: this.contra.sequenceNumber,
        from: this.contra.from,
        to: this.contra.to,
        debit: this.contra.debit,
        credit: this.contra.credit,
        updatedAt: Date.now(),
        businessId: this.contra.businessId,
        businessCity: this.contra.businessCity,
        isSyncedToServer: this.contra.isSyncedToServer,
        paymentType: this.contra.paymentType,
        bankAccountName: this.contra.bankAccountName,
        bankAccountId: this.contra.bankAccountId,
        bankPaymentType: this.contra.bankPaymentType,
        splitPaymentList: this.contra.splitPaymentList
      }
    };
    const status = await updateContra(updateSelector);
    if (status) {
      runInAction(() => {
        this.isContraList = true;
        this.handleContraModalClose();
      });
    } else {
      //show error
      runInAction(() => {
        this.handleContraModalClose();
        this.errorAlertMessage = 'Something went wrong while saving Contra!!!';
        this.handleOpenContraErrorAlertMessage();
      });
    }
  };

  deleteContra = async (item) => {
    const status = await deleteContraById(item.contraId, item);
    if (status) {
      runInAction(() => {
        this.isContraList = true;
      });
    } else {
      //show error
      runInAction(() => {
        this.errorAlertMessage =
          'Something went wrong while deleting Contra!!!';
        this.handleOpenContraErrorAlertMessage();
      });
    }
  };

  getContra = async (fromDate, toDate) => {
    const data = await getAllContraByDateRange(fromDate, toDate);

    runInAction(() => {
      this.contraList = data;
      this.isContraList = true;
    });

    return this.contraList;
  };

  viewOrEditItem = async (item) => {
    this.initializeSettings();
    const contraDetails = new Contra().convertTypes(
      JSON.parse(JSON.stringify(item))
    );

    runInAction(() => {
      this.contra = contraDetails;
      if (this.contra.paymentType === 'Split') {
        this.chosenPaymentType = 'Split';
      } else {
        this.chosenPaymentType = 'Cash';
      }
      this.isEdit = true;
      this.contraDialogOpen = true;
    });
  };

  handleOpenContraErrorAlertMessage = async (message) => {
    runInAction(() => {
      this.openContraErrorAlertMessage = true;
      this.errorAlertMessage = message;
    });
  };

  handleCloseContraErrorAlertMessage = async () => {
    runInAction(() => {
      this.openContraErrorAlertMessage = false;
      this.errorAlertMessage = '';
    });
  };

  setBankAccountList = (value) => {
    runInAction(() => {
      this.bankAccountsList = value;
    });
  };

  setChosenPaymentType = (value) => {
    runInAction(() => {
      this.chosenPaymentType = value;
    });
  };

  initializeSettings = () => {
    runInAction(async () => {
      let bankAccountsData = await getBankAccounts();
      let bankAccounts = bankAccountsData.map((item) => {
        let bankAccount = {};

        bankAccount.accountDisplayName = item.accountDisplayName;
        bankAccount.balance = item.balance;
        return item;
      });
      this.setBankAccountList(bankAccounts);
      const openingCash = await getCashInHand(
        dateHelper.getTodayDateInYYYYMMDD()
      );
      this.bankAccountsList.unshift({
        accountDisplayName: 'Cash',
        balance: openingCash
      });
      this.setSplitPaymentSettingsData(await getSplitPaymentSettings());
      this.transaction = await getTransactionSettings();
      const printerObject = await getPrinterSettings();
      this.invoiceThermal = printerObject.invoiceThermal;
      this.invoiceRegular = printerObject.invoiceRegular;
    });
  };

  setSplitPaymentSettingsData = (value) => {
    runInAction(() => {
      this.splitPaymentSettingsData = value;
    });
    if (
      !this.isEdit ||
      (this.contra.splitPaymentList &&
        this.contra.splitPaymentList.length === 0)
    ) {
      this.prepareSplitPaymentList();
    }
  };

  setSplitPayment = (property, index, value) => {
    runInAction(() => {
      this.contra.splitPaymentList[index][property] = value;
    });
  };

  prepareSplitPaymentList = async () => {
    runInAction(() => {
      this.contra.splitPaymentList = [];
    });
    const businessData = await Bd.getBusinessData();

    if (this.splitPaymentSettingsData) {
      if (this.splitPaymentSettingsData.cashEnabled) {
        const timestamp = Date.now();
        const appId = businessData.posDeviceId;
        const id = _uniqueId('sp');

        let cashPayment = {
          id: `${id}${appId}${timestamp}`,
          paymentType: 'Cash',
          referenceNumber: '',
          paymentMode: '',
          accountDisplayName: null,
          bankAccountId: null,
          amount: 0
        };

        runInAction(() => {
          this.contra.splitPaymentList.push(cashPayment);
        });
      }

      if (this.splitPaymentSettingsData.giftCardEnabled) {
        if (
          this.splitPaymentSettingsData.giftCardList &&
          this.splitPaymentSettingsData.giftCardList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let giftCardPayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Gift Card',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: null,
            bankAccountId: null,
            amount: 0
          };

          runInAction(() => {
            this.contra.splitPaymentList.push(giftCardPayment);
          });
        }
      }

      if (this.splitPaymentSettingsData.customFinanceEnabled) {
        if (
          this.splitPaymentSettingsData.customFinanceList &&
          this.splitPaymentSettingsData.customFinanceList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let customFinancePayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Custom Finance',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: null,
            bankAccountId: null,
            amount: 0
          };

          runInAction(() => {
            this.contra.splitPaymentList.push(customFinancePayment);
          });
        }
      }

      if (this.splitPaymentSettingsData.bankEnabled) {
        if (
          this.splitPaymentSettingsData.bankList &&
          this.splitPaymentSettingsData.bankList.length > 0 &&
          this.bankAccountsList &&
          this.bankAccountsList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let bankPayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Bank',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: '',
            bankAccountId: '',
            amount: 0
          };

          if (this.splitPaymentSettingsData.defaultBankSelected !== '') {
            let bankAccount = this.bankAccountsList.find(
              (o) =>
                o.accountDisplayName ===
                this.splitPaymentSettingsData.defaultBankSelected
            );

            if (bankAccount) {
              bankPayment.accountDisplayName = bankAccount.accountDisplayName;
              bankPayment.bankAccountId = bankAccount.id;
            }
          }

          runInAction(() => {
            this.contra.splitPaymentList.push(bankPayment);
          });
        }
      }
    }
  };

  addSplitPayment = async (type) => {
    const businessData = await Bd.getBusinessData();
    if (type === 'Bank') {
      const timestamp = Date.now();
      const appId = businessData.posDeviceId;
      const id = _uniqueId('sp');

      let bankPayment = {
        id: `${id}${appId}${timestamp}`,
        paymentType: 'Bank',
        referenceNumber: '',
        paymentMode: 'UPI',
        accountDisplayName: '',
        bankAccountId: '',
        amount: 0
      };

      if (this.splitPaymentSettingsData.defaultBankSelected !== '') {
        let bankAccount = this.bankAccountsList.find(
          (o) =>
            o.accountDisplayName ===
            this.splitPaymentSettingsData.defaultBankSelected
        );

        if (bankAccount) {
          bankPayment.accountDisplayName = bankAccount.accountDisplayName;
          bankPayment.bankAccountId = bankAccount.id;
        }
      }

      runInAction(() => {
        this.contra.splitPaymentList.push(bankPayment);
      });
    }
  };

  removeSplitPayment = (index) => {
    runInAction(() => {
      this.contra.splitPaymentList.splice(index, 1);
    });
  };
}
export default new ContraStore();