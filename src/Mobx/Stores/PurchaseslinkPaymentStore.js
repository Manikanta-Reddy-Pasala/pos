import { action, computed, observable, makeObservable, toJS } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

const dateFormat = require('dateformat');

const date = new Date();
const newDate = dateFormat(date, 'yyyy-mm-dd');
class PurchasesLinkPayment {

  purchaseDetails = {};

  paymentinList = [];

  selectedPayment = [
    // {
    //   transaction_date: '',
    //   reference_no: 123,
    //   transaction_type: '',
    //   linked_amount: 0
    // }
  ];

  openLinkPayment = (saleInvoice) => {
    this.purchaseDetails = saleInvoice;
    this.getpaymentin(this.purchaseDetails.vendor_id);
    this.dialogOpen = true;
  };

  getpaymentin = async (customerId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.paymentin
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { customerId: { $eq: customerId } }
          ]
        }
      })
      .exec()
      .then((data) => {
        this.paymentinList = data.map((item) => item.toJSON());
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  closeLinkPayment = () => {
    this.dialogOpen = false;
  };

  selectedpaymentitem = async (invoiceNumber) => {
    const selectedPaymentList = this.paymentinList.filter(
      (paymentIn, index) => {
        if (paymentIn.receiptNumber === invoiceNumber) {
          return true;
        }
      }
    );
    if (!selectedPaymentList) {
      return;
    }
    if (selectedPaymentList.length === 0) {
      return;
    }
    console.log('??????', toJS(selectedPaymentList[0]));
    const amountToLink = parseFloat(this.getAmountToLink);
    console.log('???????', toJS(amountToLink));
    const paymentSelected = selectedPaymentList[0];

    if (paymentSelected.balance >= amountToLink) {
      this.selectedPayment.push({
        transaction_date: new Date(),
        reference_no: paymentSelected.receiptNumber,
        transaction_type: paymentSelected.paymentType,
        linked_amount: amountToLink
      });
    } else {
      this.selectedPayment.push({
        transaction_date: new Date(),
        reference_no: paymentSelected.receiptNumber,
        transaction_type: paymentSelected.paymentType,
        linked_amount: paymentSelected.balance
      });
      console.log(' this.selectedPayment', this.selectedPayment);
    }
    console.log('????????', toJS(this.selectedPayment));
  };

  saveData = async () => {
    this.closeLinkPayment();
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const SalesData = await db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.purchaseDetails.vendor_id } }
          ]
        }
      })
      .exec();
    const changeData = (oldData) => {
      if (oldData && oldData.payment_history !== 'undefined') {
        oldData.payment_history.push(...this.selectedPayment);
      } else {
        oldData.payment_history = this.selectedPayment;
      }
      oldData.balance_amount = 0;
      oldData.updatedAt = Date.now();
      return oldData;
    };

    if (SalesData) {
      SalesData.atomicUpdate(changeData);
    }
    // update sales -> payment_history

    // update paymentin->salehistory
    // if (this.paymentinList && this.paymentinList['saleHistory'] && this.paymentinList['saleHistory'].object !== undefined)
    // {
    //   Object.assign(this.paymentinList.saleHistory, { transaction_date: new Date() });
    // } else
    // {
    //   this.paymentinList = this.paymentinList || {};
    //   this.paymentinList['saleHistory'] = this.paymentinList['saleHistory'] || {};
    //   this.paymentinList['saleHistory'] = {
    //     transaction_date: new Date()
    //   };
    // }
    // console.log("this.paymentlist", JSON.stringify(this.paymentinList));

    // update customer ->customerBalance
  };

  unselectedpaymentitem = (invoiceNumber) => {
    this.selectedPayment.splice(
      this.selectedPayment.findIndex(
        (item) => item.reference_no === invoiceNumber
      ),
      1
    );
    // add amount to linkpayment
  };

  get getAmountToLink() {
    if (!this.purchaseDetails) {
      return;
    }

    const balance = this.saleDetails.total_amount;
    const recievedAmount = parseFloat(this.saleDetails.received_amount) || 0;
    let linkedAmount = 0;
    this.selectedPayment.forEach((data) => {
      linkedAmount += parseFloat(data.linked_amount);
    });
    return balance - recievedAmount - linkedAmount;
  }

  constructor() {
    makeObservable(this, {
      paymentinList: observable,
      selectedpaymentitem: action,
      unselectedpaymentitem: action,
      closeLinkPayment: action,
      openLinkPayment: action,
      getAmountToLink: computed,
      purchaseDetails: observable,
      selectedPayment: observable,
      saveData: action
    });
  }
}
export default new PurchasesLinkPayment();
