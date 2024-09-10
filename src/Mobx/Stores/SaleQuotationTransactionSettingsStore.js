import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class SaleQuotationTransactionSettingsStore {
  saleQuotationTransSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    billTitle: '',
    terms: '',
    enableOnTxn: {
      productLevel: [],
      billLevel: []
    },
    displayOnBill: {
      productLevel: [],
      billLevel: []
    }
  };

  saleQuotationtransactionsettings = [];

  getSaleQuotationTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.salequotationtransactionsettings
      .findOne({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          return;
        }

        if (data) {
          runInAction(() => {
            this.saleQuotationTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log(
          'Sale Quotation Transaction Settings Internal Server Error',
          err
        );
      });

    return this.saleQuotationTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.salequotationtransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addSaleQuotationTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                billTitle: this.saleQuotationTransSettingData.billTitle,
                terms: this.saleQuotationTransSettingData.terms,
                enableOnTxn: this.saleQuotationTransSettingData.enableOnTxn,
                displayOnBill: this.saleQuotationTransSettingData.displayOnBill
              }
            })
            .then(async (data) => {
              console.log(
                'Sale Quotation Transaction Settings inside update',
                data
              );
            });
        }
      })
      .catch((err) => {
        console.log(
          'Sale Quotation Transaction Settings Internal Server Error',
          err
        );
      });
  };

  addSaleQuotationTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.saleQuotationTransSettingData.businessId = businessData.businessId;
      this.saleQuotationTransSettingData.businessCity =
        businessData.businessCity;
    });

    const InsertDoc = this.saleQuotationTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await db.salequotationtransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('Sale Quotation transaction settings data Inserted');
      })
      .catch((err) => {
        console.log(
          'Sale Quotation transaction settings data insertion Failed::',
          err
        );
      });
  };

  setSaleQuotationTxnSettingProperty = (
    property,
    subProperty,
    index,
    value
  ) => {
    this.saleQuotationTransSettingData[property][subProperty][index][
      'enabled'
    ] = value;
    this.saveData();
  };

  setBillTitle = (value) => {
    this.saleQuotationTransSettingData.billTitle = value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.saleQuotationTransSettingData.terms = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      saleQuotationTransSettingData: observable,
      getSaleQuotationTransSettingdetails: action,
      setSaleQuotationTxnSettingProperty: action,
      setBillTitle: action
    });
  }
}
export default new SaleQuotationTransactionSettingsStore();
