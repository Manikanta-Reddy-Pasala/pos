import {
  action,
  computed,
  observable,
  makeObservable,
  toJS,
  runInAction
} from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';


class SaleslinkPayment {
  OpenLinkpaymentPage = false;

  saleDetails = {};
  paymentinList = [];
  selectedPayment = [];

  openLinkPayment = (saleInvoice) => {
    runInAction(() => {
      this.saleDetails = saleInvoice;
      this.getpaymentin(this.saleDetails.customer_id);
      this.dialogOpen = true;
    });
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
        runInAction(() => {
          this.paymentinList = data.map((item) => item.toJSON());
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  closeLinkPayment = () => {
    runInAction(() => {
      this.dialogOpen = false;
    });
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

  unselectedpaymentitem = (invoiceNumber) => {
    console.log('???????', invoiceNumber);
    this.selectedPayment.splice(
      this.selectedPayment.findIndex(
        (item) => item.reference_no === invoiceNumber
      ),
      1
    );
    // add amount to linkpayment
  };

  get getAmountToLink() {
    if (!this.saleDetails) {
      return;
    }

    const balance = this.saleDetails.total_amount;
    const recievedAmount = parseFloat(this.saleDetails.received_amount);
    let linkedAmount = 0;
    this.selectedPayment.forEach((data) => {
      linkedAmount += parseFloat(data.linked_amount);
    });
    return balance - recievedAmount - linkedAmount;
  }

  constructor() {
    makeObservable(this, {
      OpenLinkpaymentPage: observable,
      paymentinList: observable,
      selectedpaymentitem: action,
      unselectedpaymentitem: action,
      closeLinkPayment: action,
      openLinkPayment: action,
      getAmountToLink: computed,
      saleDetails: observable,
      selectedPayment: observable
    });
  }
}
export default new SaleslinkPayment();
