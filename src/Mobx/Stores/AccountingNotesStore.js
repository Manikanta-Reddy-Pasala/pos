import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import AccountingNotes from './classes/AccountingNotes';

class AccountingNotesStore {
  accountingNotesDialogOpen = false;
  accountingNotesList = [];
  isAccountingNotesList = false;
  isEdit = false;

  constructor() {
    this.accountingNotes = new AccountingNotes().defaultValues();
    this.accountingNotesDefault = new AccountingNotes().defaultValues();

    makeObservable(this, {
      accountingNotes: observable,
      accountingNotesDialogOpen: observable,
      handleAccountingNotesModalOpen: action,
      handleAccountingNotesModalClose: action,
      accountingNotesList: observable,
      getAccountingNotesCount: action
    });
  }

  handleAccountingNotesModalOpen = () => {
    runInAction(() => {
      this.accountingNotes = new AccountingNotes().defaultValues();
      this.accountingNotesDialogOpen = true;
    });
  };

  handleAccountingNotesModalClose = () => {
    runInAction(() => {
      this.accountingNotesDialogOpen = false;
      this.isEdit = false;
    });
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('accn');
    this.accountingNotes.id = `${id}${appId}${timestamp}`;
    this.accountingNotes.businessId = businessData.businessId;
    this.accountingNotes.businessCity = businessData.businessCity;
    this.accountingNotes.posId = parseFloat(businessData.posDeviceId);
    this.accountingNotes.updatedAt = Date.now();

    let InsertDoc = { ...this.accountingNotes };
    InsertDoc = new AccountingNotes().convertTypes(InsertDoc);

    await db.accountingnotes
      .insert(InsertDoc)
      .then(() => {
        console.log('this.accountingNotes:: data Inserted' + InsertDoc);
        runInAction(() => {
          this.isEdit = false;
          this.isAccountingNotesList = true;
          this.accountingNotesDialogOpen = false;
        });
      })
      .catch((err) => {
        console.log('this.accountingNotes:: data insertion Failed::', err);
        runInAction(() => {
          this.isEdit = false;
          this.accountingNotesDialogOpen = false;
        });
      });
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.accountingnotes
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.accountingNotes.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Accounting notes data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.id = oldTxnData.id;
        newTxnData.posId = oldTxnData.posId;
        newTxnData.businessId = oldTxnData.businessId;
        newTxnData.businessCity = oldTxnData.businessCity;
        newTxnData.updatedAt = Date.now();
        newTxnData.isSyncedToServer = this.accountingNotes.isSyncedToServer;
        newTxnData.date = this.accountingNotes.date;
        newTxnData.partyName = this.accountingNotes.partyName;
        newTxnData.partyId = this.accountingNotes.partyId;
        newTxnData.partyGstNo = this.accountingNotes.partyGstNo;
        newTxnData.partyPhoneNo = this.accountingNotes.partyPhoneNo;
        newTxnData.notes = this.accountingNotes.notes;

        await db.accountingnotes
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: { $eq: this.accountingNotes.id } }
              ]
            }
          })
          .update({
            $set: {
              updatedAt: newTxnData.updatedAt,
              isSyncedToServer: false,
              date: newTxnData.date,
              partyName: newTxnData.partyName,
              partyId: newTxnData.partyId,
              partyGstNo: newTxnData.partyGstNo,
              partyPhoneNo: newTxnData.partyPhoneNo,
              notes: newTxnData.notes
            }
          })
          .then(async () => {
            console.log('accountingNotes update success');
            this.accountingNotes = this.accountingNotesDefault;
            this.isEdit = false;
            this.isAccountingNotesList = true;
          });
      })
      .catch((error) => {
        console.log('accountingNotes update Failed ' + error);
      });

    this.accountingNotesDialogOpen = false;
    this.isEdit = false;
  };

  deleteAccountingNotesData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.accountingnotes.find({
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
        console.log('accountingNotes data removed' + data);
        runInAction(() => {
          this.accountingNotes = this.accountingNotesDefault;
          this.isAccountingNotesList = true;
        });
      })
      .catch((error) => {
        console.log('accountingNotes deletion Failed ' + error);
      });
  };

  getAccountingNotes = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.accountingNotesList = [];

    const query = db.accountingnotes.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.accountingNotesList = data.map((item) => item.toJSON());
      }
    });

    return this.accountingNotesList;
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.accountingnotes
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
          // No AccountingNotes data is found so cannot update any information
          return;
        }

        this.accountingNotes.businessCity = data.businessCity;
        this.accountingNotes.businessId = data.businessId;
        this.accountingNotes.id = data.id;
        this.accountingNotes.isSyncedToServer = data.isSyncedToServer;
        this.accountingNotes.date = data.date;
        this.accountingNotes.partyName = data.partyName;
        this.accountingNotes.partyId = data.partyId;
        this.accountingNotes.partyGstNo = data.partyGstNo;
        this.accountingNotes.partyPhoneNo = data.partyPhoneNo;
        this.accountingNotes.notes = data.notes;

        this.accountingNotesDialogOpen = true;
      })
      .catch((error) => {
        console.log('accountingNotes update Failed ' + error);
      });
  };

  resetSingleAccountingNotesData = async () => {
    /**
     * reset to defaults
     */
    this.accountingNotes = this.accountingNotesDefault;
  };

  setDate = (date) => {
    this.accountingNotes.date = date;
  };

  setNotes = (notes) => {
    this.accountingNotes.notes = notes;
  };

  setParty = (party) => {
    if (party !== '') {
      this.accountingNotes.partyName = party.name;
      this.accountingNotes.partyGstNo = party.gstNumber;
      this.accountingNotes.partyId = party.id;
      this.accountingNotes.partyPhoneNo = party.phoneNo;
    } else {
      this.accountingNotes.partyName = '';
      this.accountingNotes.partyGstNo = '';
      this.accountingNotes.partyId = '';
      this.accountingNotes.partyPhoneNo = '';
    }
  };

  getAccountingNotesCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.accountingnotes.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isAccountingNotesList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('accountingNotes Count Internal Server Error', err);
      });
  };
}
export default new AccountingNotesStore();