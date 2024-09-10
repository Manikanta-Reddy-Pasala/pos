import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import ManufactureDirectExpense from './classes/ManufactureDirectExpense';

class ManufacturingExpensesStore {
  expenseDialogOpen = false;
  expenseList = [];
  isExpensesList = false;
  isEdit = false;

  constructor() {
    this.expense = new ManufactureDirectExpense().getDefaultValues();
    this.expenseDefault = new ManufactureDirectExpense().getDefaultValues();

    makeObservable(this, {
      expense: observable,
      expenseDialogOpen: observable,
      handleExpenseModalOpen: action,
      handleExpenseModalClose: action,
      expenseList: observable,
      getExpenseCount: action
    });
  }

  handleExpenseModalOpen = () => {
    this.expenseDialogOpen = true;
  };

  handleExpenseModalClose = () => {
    this.expenseDialogOpen = false;
    this.isEdit = false;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('mde');
    this.expense.id = `${id}${appId}${timestamp}`;
    this.expense.businessId = businessData.businessId;
    this.expense.businessCity = businessData.businessCity;
    this.expense.posId = parseFloat(businessData.posDeviceId);
    this.expense.updatedAt = Date.now();

    let InsertDoc = { ...this.expense };
    InsertDoc = new ManufactureDirectExpense().convertTypes(InsertDoc);

    await db.manufacturedirectexpenses
      .insert(InsertDoc)
      .then(() => {
        console.log('this.expense:: data Inserted' + InsertDoc);
        this.isEdit = false;
        this.expense = this.expenseDefault;
        this.getExpense();
      })
      .catch((err) => {
        console.log('this.expense:: data insertion Failed::', err);
      });

    this.expenseDialogOpen = false;
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.manufacturedirectexpenses
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.expense.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No expense data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.id = oldTxnData.id;
        newTxnData.updatedAt = Date.now();
        newTxnData.name = this.expense.name;

        await db.manufacturedirectexpenses
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: { $eq: this.expense.id } }
              ]
            }
          })
          .update({
            $set: {
              name: newTxnData.name,
              updatedAt: newTxnData.updatedAt
            }
          })
          .then(async () => {
            console.log('expense update success');
            this.expense = this.expenseDefault;
            this.isEdit = false;
            this.getExpense();
          });
      })
      .catch((error) => {
        console.log('expense update Failed ' + error);
      });

    this.expenseDialogOpen = false;
    this.isEdit = false;
  };

  setExpenseName = (value) => {
    this.expense.name = value;
  };

  deleteExpenseData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.manufacturedirectexpenses.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: item.id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('expense data removed' + data);
        runInAction(() => {
          this.expense = this.expenseDefault;
          this.getExpense();
        });
      })
      .catch((error) => {
        console.log('expense deletion Failed ' + error);
      });
  };

  getExpense = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.expenseList = [];
    const query = db.manufacturedirectexpenses.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.expenseList = data.map((item) => item.toJSON());
      }
    });

    return this.expenseList;
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.manufacturedirectexpenses
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: item.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No expense data is found so cannot update any information
          return;
        }

        this.expense.businessCity = data.businessCity;
        this.expense.businessId = data.businessId;
        this.expense.name = data.name;
        this.expense.id = data.id;

        this.expenseDialogOpen = true;
      })
      .catch((error) => {
        console.log('expense update Failed ' + error);
      });
  };

  resetSingleExpenseData = async () => {
    /**
     * reset to defaults
     */
    this.expense = this.expenseDefault;
  };

  getExpenseCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.manufacturedirectexpenses.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isExpensesList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('expense Count Internal Server Error', err);
      });
  };
}
export default new ManufacturingExpensesStore();