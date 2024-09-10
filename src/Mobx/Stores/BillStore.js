import * as Db from '../../RxDb/Database/Database';
import { action, observable, makeObservable, toJS } from 'mobx';
import * as Bd from '../../components/SelectedBusiness';

class BillStore {
  billData = [];
  openPreview = false;
  constructor() {
    makeObservable(this, {
      getBillList: action,
      billData: observable,
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

  getBillList = async (id) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.purchases.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { bill_number: { $eq: id } }
        ]
      }
    });

    query
      .exec()
      .then((data) => {
        this.billData = data;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };
}
export default new BillStore();
