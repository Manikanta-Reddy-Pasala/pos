import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import CancelData from './classes/CancelData';

class CancelDataStore {
  cancelDataTransactionList = [];

  constructor() {
    this.cancelledData = new CancelData().getDefaultValues();

    makeObservable(this, {
        cancelledData: observable,
        cancelDataTransactionList: observable,
        getCancelTransactionList: action,
        handleCancelTransactionSearch: action,
        getCancelTransactionDetails: action
    });
  }

  getCancelTransactionDetails = async (cancelledData) => {
    console.log(cancelledData);

    let actualData;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionscancelled.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: cancelledData.transactionId } }
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

  handleCancelTransactionSearch = async (
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

      query = db.alltransactionscancelled.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { createdDate: { $gte: fromDate } },
            { createdDate: { $lte: toDate } },
            {
              $or: [
                { sequenceNumber: { $regex: regexp } },
                { cancelledBy: { $regex: regexp } },
                { total: { $eq: parseFloat(value) } },
                { balance: { $eq: parseFloat(value) } }
              ]
            }
          ]
        }
      });
    } else {
      const businessData = await Bd.getBusinessData();

      query = db.alltransactionscancelled.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { createdDate: { $gte: fromDate } },
            { createdDate: { $lte: toDate } },
            { transactionType: { $eq: txnType } },
            {
              $or: [
                { sequenceNumber: { $regex: regexp } },
                { cancelledBy: { $regex: regexp } },
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

  getCancelTransactionList = async (fromDate, toDate) => {
    const db = await Db.get();

    runInAction(() => {
      this.cancelDataTransactionList = [];
    });
    const businessData = await Bd.getBusinessData();

    await db.alltransactionscancelled
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
          this.cancelDataTransactionList = finalData;
        });
      });
  };
}

export default new CancelDataStore();