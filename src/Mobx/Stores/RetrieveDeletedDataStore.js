import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

class RetrieveDeletedDataStore {
  deletedDataTransactionList = [];

  deletedData = {
    id: '',
    transactionId: '',
    sequenceNumber: '',
    transactionType: '',
    createdDate: '',
    deletedDate: '',
    deletedBy: '',
    businessId: '',
    businessCity: '',
    total: 0,
    balance: 0,
    updatedAt: Date.now(),
    posId: 0,
    restored: false
  };

  deleteDataPermanently = async (deletedData) => {
    // console.log(deletedData);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: deletedData.id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        // console.log('Deleted data removed' + data);
      })
      .catch((error) => {
        console.log('Deleted data deletion Failed ' + error);
      });
  };

  getDeletedTransactionDetails = async (deletedData) => {

    let actualData;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: deletedData.transactionId } }
        ]
      }
    });

    query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        try {
          actualData = JSON.parse(data.data);
        } catch (e) {
          console.error(' Error: ', e.message);
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
    return actualData;
  };

  handleDeletedDataTransactionSearch = async (
    value,
    txnType,
    fromDate,
    toDate
  ) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    let data = [];
    let query;
    if (txnType === 'All Invoices') {
      const businessData = await Bd.getBusinessData();

      query = db.alltransactionsdeleted.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { createdDate: { $gte: fromDate } },
            { createdDate: { $lte: toDate } },
            {
              $or: [
                { sequenceNumber: { $regex: regexp } },
                { deletedBy: { $regex: regexp } },
                { total: { $eq: parseFloat(value) } },
                { balance: { $eq: parseFloat(value) } }
              ]
            }
          ]
        }
      });
    } else {
      const businessData = await Bd.getBusinessData();

      query = db.alltransactionsdeleted.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { createdDate: { $gte: fromDate } },
            { createdDate: { $lte: toDate } },
            { transactionType: { $eq: txnType } },
            {
              $or: [
                { sequenceNumber: { $regex: regexp } },
                { deletedBy: { $regex: regexp } },
                { total: { $eq: parseFloat(value) } },
                { balance: { $eq: parseFloat(value) } }
              ]
            }
          ]
        }
      });
    }

    await query.exec().then((documents) => {
      data = documents.map((item) => item);
    });

    return data;
  };

  getDeletedDataTransactionList = async (fromDate, toDate) => {
    const db = await Db.get();

    runInAction(() => {
      this.deletedDataTransactionList = [];
    });
    const businessData = await Bd.getBusinessData();

    await db.alltransactionsdeleted
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              start_date: {
                $gte: fromDate
              }
            },
            {
              end_date: {
                $lte: toDate
              }
            },
            {
              restored: { $eq: false }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ updatedAt: 'desc' }]
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No txn data is available
          return;
        }

        const finalData = data.map((item) => item.toJSON());
        runInAction(() => {
          this.deletedDataTransactionList = finalData;
        });
      });
  };

  getActualDeletedTransaction = async (deletedData) => {
    let restoreData;
    let query;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    query = db.deletedbackuptransactions.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: deletedData.transactionId } }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        restoreData = data;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
    return restoreData;
  };

  constructor() {
    makeObservable(this, {
      deletedDataTransactionList: observable,
      getDeletedDataTransactionList: action,
      handleDeletedDataTransactionSearch: action,
      getDeletedTransactionDetails: action
    });
  }
}

export default new RetrieveDeletedDataStore();