import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class ExpenseTransactionSettingsStore {
  expenseTransSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    terms: '',
    enableTDS: false,
    enableTCS: false,
    enableOnTxn: {
      productLevel: [],
      billLevel: []
    },
    displayOnBill: {
      productLevel: [],
      billLevel: []
    }
  };

  expensetransactionsettings = [];

  getExpenseTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.expensetransactionsettings.findOne({
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
            this.expenseTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Expense Internal Server Error', err);
      });

    return this.expenseTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.expensetransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addExpenseTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                terms: this.expenseTransSettingData.terms,
                enableTDS: this.expenseTransSettingData.enableTDS,
                enableTCS: this.expenseTransSettingData.enableTCS,
                enableOnTxn: this.expenseTransSettingData.enableOnTxn,
                displayOnBill: this.expenseTransSettingData.displayOnBill
              }
            })
            .then(async (data) => {
              console.log('Expense inside update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Expense Internal Server Error', err);
      });
  };

  addExpenseTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.expenseTransSettingData.businessId = businessData.businessId;
      this.expenseTransSettingData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.expenseTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.expensetransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('expense data Inserted');
      })
      .catch((err) => {
        console.log('expense data insertion Failed::', err);
      });
  };

  setExpenseTxnSettingProperty = (property, subProperty, index, value) => {
    this.expenseTransSettingData[property][subProperty][index]['enabled'] =
      value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.expenseTransSettingData.terms = value;
    this.saveData();
  };

  setEnableTCS = (value) => {
    this.expenseTransSettingData.enableTCS = value;
    this.saveData();
  };

  setEnableTDS = (value) => {
    this.expenseTransSettingData.enableTDS = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      expenseTransSettingData: observable,
      getExpenseTransSettingdetails: action,
      setExpenseTxnSettingProperty: action
    });
  }
}
export default new ExpenseTransactionSettingsStore();
