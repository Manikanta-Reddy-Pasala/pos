import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class ApprovalTransactionSettingsStore {
  approvalTransSettingData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
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

  approvaltransactionsettings = [];

  getApprovalTransSettingdetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.approvaltransactionsettings.findOne({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        // console.log(data)
        if (!data) {
          return;
        }

        if (data) {
          runInAction(() => {
            this.approvalTransSettingData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Approval Internal Server Error', err);
      });

    return this.approvalTransSettingData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.approvaltransactionsettings.findOne({
      selector: {
        businessId: businessData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addApprovalTxnSetting();
        } else {
          await query
            .update({
              $set: {
                posId: parseFloat(businessData.posDeviceId),
                updatedAt: Date.now(),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                terms: this.approvalTransSettingData.terms,
                enableOnTxn: this.approvalTransSettingData.enableOnTxn,
                displayOnBill: this.approvalTransSettingData.displayOnBill
              }
            })
            .then(async (data) => {
              console.log('Approval inside update', data);
            });
        }
      })
      .catch((err) => {
        console.log('Approval Internal Server Error', err);
      });
  };

  addApprovalTxnSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.approvalTransSettingData.businessId = businessData.businessId;
      this.approvalTransSettingData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.approvalTransSettingData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.approvaltransactionsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('approval data Inserted');
      })
      .catch((err) => {
        console.log('approval data insertion Failed::', err);
      });
  };

  setApprovalTxnSettingProperty = (property, subProperty, index, value) => {
    this.approvalTransSettingData[property][subProperty][index]['enabled'] =
      value;
    this.saveData();
  };

  setBillTerms = (value) => {
    this.approvalTransSettingData.terms = value;
    this.saveData();
  };

  constructor() {
    makeObservable(this, {
      approvalTransSettingData: observable,
      getApprovalTransSettingdetails: action,
      setApprovalTxnSettingProperty: action
    });
  }
}
export default new ApprovalTransactionSettingsStore();
