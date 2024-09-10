import { action, observable, makeObservable } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

class PaymentHistoryStore {
  paymentHistory = [];
  paymentHistoryTotal = 0;

  resetPaymentHistory = async () => {
    this.paymentHistory = [];
    this.paymentHistoryTotal = 0;
  };

  getSalesPaymentHistory = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { invoice_number: { $eq: item.invoice_number } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        if(data.linkedTxnList && data.linkedTxnList.length > 0){

          this.paymentHistory = data.linkedTxnList.filter(Boolean);

          if (parseFloat(data.received_amount) > 0) {
            let receivedAtCounter = {
              date: data.invoice_date,
              linkedAmount: parseFloat(data.received_amount),
              linkedId: data.invoice_number,
              paymentType: 'Payment At Counter',
              transactionNumber: data.invoice_number,
              sequenceNumber: data.sequenceNumber
            };

            this.paymentHistory.push(receivedAtCounter);
          }

          let total = 0;
          for (const data of this.paymentHistory) {
            total = total + data.linkedAmount;
          }
          this.paymentHistoryTotal = total;
      }
      });
  };

  getPaymentInPaymentHistory = async (item) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    await db.paymentin
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { receiptNumber: { $eq: item.receiptNumber } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        if(data.linkedTxnList && data.linkedTxnList.length > 0){

          this.paymentHistory = data.linkedTxnList.filter(Boolean);

          let total = 0;
          for (const data of this.paymentHistory) {
            total = total + data.linkedAmount;
          }
          this.paymentHistoryTotal = total;
      }
      });
  };

  getSalesReturnPaymentHistory = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.salesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { sales_return_number: { $eq: item.sales_return_number } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        if(data.linkedTxnList && data.linkedTxnList.length > 0){

          this.paymentHistory = data.linkedTxnList.filter(Boolean);

          if (parseFloat(data.paid_amount) > 0) {
            let receivedAtCounter = {
              date: data.date,
              linkedAmount: parseFloat(data.paid_amount),
              linkedId: data.sales_return_number,
              paymentType: 'Payment At Counter',
              transactionNumber: data.sales_return_number,
              sequenceNumber: data.sequenceNumber
            };

            this.paymentHistory.push(receivedAtCounter);
          }

          let total = 0;
          for (const data of this.paymentHistory) {
            total = total + data.linkedAmount;
          }
          this.paymentHistoryTotal = total;

      }
      });
  };

  getPurchasePaymentHistory = async (item) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    await db.purchases
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { bill_number: { $eq: item.bill_number } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        if(data.linkedTxnList && data.linkedTxnList.length > 0){

          this.paymentHistory = data.linkedTxnList.filter(Boolean);

          if (parseFloat(data.paid_amount) > 0) {
            let receivedAtCounter = {
              date: data.bill_date,
              linkedAmount: parseFloat(data.paid_amount),
              linkedId: data.bill_number,
              paymentType: 'Payment At Counter',
              transactionNumber: data.bill_number,
              sequenceNumber: data.sequenceNumber
            };

            this.paymentHistory.push(receivedAtCounter);
          }

          let total = 0;
          for (const data of this.paymentHistory) {
            total = total + data.linkedAmount;
          }
          this.paymentHistoryTotal = total;
      }
      });
  };

  getPaymentOutPaymentHistory = async (item) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    await db.paymentout
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { receiptNumber: { $eq: item.receiptNumber } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        if(data.linkedTxnList && data.linkedTxnList.length > 0){

          this.paymentHistory = data.linkedTxnList.filter(Boolean);

          let total = 0;
          for (const data of this.paymentHistory) {
            total = total + data.linkedAmount;
          }
          this.paymentHistoryTotal = total;
        }
      });
  };

  getPurchaseReturnPaymentHistory = async (item) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    await db.purchasesreturn
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { purchase_return_number: { $eq: item.purchase_return_number } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        if(data.linkedTxnList && data.linkedTxnList.length > 0){
          this.paymentHistory = data.linkedTxnList.filter(Boolean);

          if (parseFloat(data.paid_amount) > 0) {
            let receivedAtCounter = {
              date: data.date,
              linkedAmount: parseFloat(data.paid_amount),
              linkedId: data.purchase_return_number,
              paymentType: 'Payment At Counter',
              transactionNumber: data.purchase_return_number,
              sequenceNumber: data.sequenceNumber
            };

            this.paymentHistory.push(receivedAtCounter);
          }

          let total = 0;
          for (const data of this.paymentHistory) {
            total = total + data.linkedAmount;
          }
          this.paymentHistoryTotal = total;

      }
      });
  };

  constructor() {
    makeObservable(this, {
      paymentHistory: observable,
      paymentHistoryTotal: observable,
      getSalesPaymentHistory: action,
      getPaymentInPaymentHistory: action
    });
  }
}
export default new PaymentHistoryStore();
