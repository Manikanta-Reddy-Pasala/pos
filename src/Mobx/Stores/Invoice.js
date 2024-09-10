import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

import { action, observable, makeObservable } from 'mobx';

class Invoice {
  invoiceData = [];
  constructor() {
    makeObservable(this, {
      getInvoice: action,
      invoiceData: observable
    });
  }
  getInvoiceList = async (id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.sales.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { invoice_number: { $eq: id } }
        ]
      }
    });

    query
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
