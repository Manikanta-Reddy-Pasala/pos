import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';

class CashStore {
  cashDialogOpen = false;
  cashTransactionList = [];
  isCashList = false;
  isEdit = false;

  cash = {
    id: '',
    transactionType: '',
    amount: '',
    date: '',
    description: '',
    updatedAt: Date.now(),
    cashType: 'addCash',
    businessId: '',
    businessCity: '',
    isSyncedToServer: false
  };

  cashDefault = {
    id: '',
    transactionType: '',
    amount: '',
    date: '',
    description: '',
    updatedAt: Date.now(),
    cashType: 'addCash',
    businessId: '',
    businessCity: '',
    isSyncedToServer: false
  };

  handleCashModalOpen = () => {
    this.cashDialogOpen = true;
    this.cash = this.cashDefault;
  };

  handleCashModalClose = () => {
    this.cashDialogOpen = false;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.cash.transactionType = 'Cash Adjustment';
    this.cash.amount = this.cash.amount || 0;

    // generate unique id
    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('cih');
    this.cash.id = `${id}${appId}${timestamp}`;
    this.cash.businessId = businessData.businessId;
    this.cash.businessCity = businessData.businessCity;

    const InsertDoc = this.cash;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    console.log('this.cash descr:: data Inserted' + InsertDoc.description);

    //insert into all txn
    allTxn.saveTxnFromAddAdjustments(InsertDoc, db);

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.id,
      '',
      'Cash Adjustment',
      'Save',
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.date
    );

    await db.cashadjustments
      .insert(InsertDoc)
      .then(() => {
        console.log('this.cash:: data Inserted');
      })
      .catch((err) => {
        console.log('this.cash:: data insertion Failed::', err);
        //save to audit
        audit.addAuditEvent(
          InsertDoc.id,
          '',
          'Cash Adjustment',
          'Save',
          JSON.stringify(InsertDoc),
          err.message ? err.message : 'Cash Adjustment Failed',
          InsertDoc.date
        );
      });

    this.cashDialogOpen = false;
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    let failedTxnData = {};
    db.cashadjustments
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.cash.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No cash data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.id = oldTxnData.id;
        newTxnData.updatedAt = Date.now();
        newTxnData.amount = this.cash.amount || 0;
        newTxnData.transactionType = 'Cash Adjustment';
        newTxnData.cashType = this.cash.cashType;
        newTxnData.date = this.cash.date;
        newTxnData.description = this.cash.description;
        newTxnData.isSyncedToServer = this.cash.isSyncedToServer;
        newTxnData.posId = this.cash.posId;
        newTxnData.businessId = this.cash.businessId;
        newTxnData.businessCity = this.cash.businessCity;

        allTxn.deleteAndSaveTxnFromAdjustments(oldTxnData, newTxnData, db);

        //save to audit
        await audit.addAuditEvent(
          newTxnData.id,
          '',
          'Cash Adjustment',
          'Update',
          JSON.stringify(newTxnData),
          '',
          newTxnData.date
        );

        failedTxnData = newTxnData;

        await db.cashadjustments
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: { $eq: this.cash.id } }
              ]
            }
          })
          .update({
            $set: {
              transactionType: newTxnData.transactionType,
              cashType: newTxnData.cashType,
              amount: newTxnData.amount,
              date: newTxnData.date,
              updatedAt: newTxnData.updatedAt,
              description: newTxnData.description,
              isSyncedToServer: newTxnData.isSyncedToServer
            }
          })
          .then(async () => {
            console.log('cash in hand update success');
            this.cash = this.cashDefault;
          });
      })
      .catch((error) => {
        console.log('cash in hand update Failed ' + error);
        //save to audit
        audit.addAuditEvent(
          failedTxnData.id,
          '',
          'Cash Adjustment',
          'Update',
          JSON.stringify(failedTxnData),
          error.message,
          failedTxnData.date
        );
      });

    this.cashDialogOpen = false;
  };

  setCashInHandTransactionType = (value) => {
    this.cash.transactionType = value;
  };

  setCashInHandCashType = (value) => {
    this.cash.cashType = value;
  };

  setCashInHandAmount = (value) => {
    this.cash.amount = value;
  };

  setCashInHandDate = (value) => {
    this.cash.date = value;
  };

  setCashInHandDescription = (value) => {
    this.cash.description = value;
  };

  deleteCashInHandData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.cashadjustments.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: item.id } }
        ]
      }
    });

    await allTxn.deleteTxnFromAddAdjustments(item, db);

    //save to audit
    await audit.addAuditEvent(
      item.id,
      '',
      'Cash Adjustment',
      'Delete',
      JSON.stringify(item),
      '',
      item.date
    );

    await query
      .remove()
      .then(async (data) => {
        console.log('cash in hand data removed' + data);
        runInAction(() => {
          this.cash = this.cashDefault;
        });
      })
      .catch((error) => {
        console.log('cash in hand deletion Failed ' + error);
        //save to audit
        audit.addAuditEvent(
          item.id,
          '',
          'Cash Adjustment',
          'Delete',
          JSON.stringify(item),
          error.message,
          item.date
        );
      });
  };

  getAllCashInHandTransactions = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.cashadjustments.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.cashTransactionList = data;
      }
    });
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.cashadjustments
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
          // No cash data is found so cannot update any information
          return;
        }

        this.cash.businessCity = data.businessCity;
        this.cash.businessId = data.businessId;
        this.cash.amount = data.amount;
        this.cash.date = data.date;
        this.cash.description = data.description;
        this.cash.cashType = data.cashType;
        this.cash.transactionType = data.transactionType;
        this.cash.id = data.id;
        this.cash.isSyncedToServer = data.isSyncedToServer;

        this.cashDialogOpen = true;
      })
      .catch((error) => {
        console.log('cash in hand update Failed ' + error);
      });
  };

  resetSingleCashData = async () => {
    /**
     * reset to defaults
     */
    this.cash = {
      id: '',
      transactionType: '',
      amount: '',
      date: '',
      description: '',
      updatedAt: Date.now(),
      cashType: 'addCash',
      businessId: '',
      businessCity: '',
      isSyncedToServer: false
    };
  };

  constructor() {
    makeObservable(this, {
      cash: observable,
      cashDialogOpen: observable,
      handleCashModalOpen: action,
      handleCashModalClose: action,
      cashTransactionList: observable
    });
  }
}
export default new CashStore();