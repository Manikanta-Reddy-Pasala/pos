import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

import { action, observable, makeObservable } from 'mobx';

class Invoice {
  invoiceData = [];
  openPreview = false;
  constructor() {
    makeObservable(this, {
      getInvoiceList: action,
      invoiceData: observable,
      openPreview: observable,
      openForPreview: action,
      closePreview: action
    });
  }
  openForPreview = () => {
    this.openPreview = true;
  };
  closePreview = () => {
    this.openPreview = false;
  };

  getInvoiceList = async (id) => {
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();
    db.sales
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { invoice_number: { $eq: id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        this.invoiceData = data;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };
}
export default new Invoice();
