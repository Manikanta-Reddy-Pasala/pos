import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import AuditSettings from './classes/AuditSettings';
import * as auditHelper from 'src/components/Helpers/AuditHelper';

class AuditSettingsStore {
  saveData = async () => {
    const db = await Db.get();

    const query = db.auditsettings.findOne({
      selector: {
        businessId: this.auditSettings.businessId
      }
    });
    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addAuditSettingsData();
        } else {
          await query
            .update({
              $set: {
                updatedAt: Date.now(),
                posId: this.auditSettings.posId,
                autoPushPendingFailed: this.auditSettings.autoPushPendingFailed,
                einvoiceAlert: this.auditSettings.einvoiceAlert,
                lockSales: this.auditSettings.lockSales,
                taxApplicability: this.auditSettings.taxApplicability,
                shippingPackingTax: this.auditSettings.shippingPackingTax,
                taxRateAutofillList: this.auditSettings.taxRateAutofillList,
                shippingChargeHsn: this.auditSettings.shippingChargeHsn,
                packingChargeHsn: this.auditSettings.packingChargeHsn,
                insuranceHsn: this.auditSettings.insuranceHsn
              }
            })
            .then(async (data) => {});
        }
      })
      .catch((err) => {
        console.log('Internal Server Error Audit Settings', err);
      });
  };

  addAuditSettingsData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.auditSettings.businessId = businessData.businessId;
      this.auditSettings.businessCity = businessData.businessCity;
    });

    this.auditSettings.posId = parseFloat(businessData.posDeviceId);
    this.auditSettings.updatedAt = Date.now();

    let InsertDoc = { ...this.auditSettings };
    InsertDoc = new AuditSettings().convertTypes(InsertDoc);

    await db.auditsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('this.auditSettings:: data Inserted');
      })
      .catch((err) => {
        console.log('this.auditSettings:: data insertion Failed::', err);
      });
  };

  getAuditSettingsData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.auditsettings
      .findOne({
        selector: {
          $and: [{ businessId: { $eq: businessData.businessId } }]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          this.auditSettings = this.auditSettingsDefault;
        }

        if (data) {
          runInAction(() => {
            this.auditSettings.updatedAt = data.updatedAt;
            this.auditSettings.businessId = data.businessId;
            this.auditSettings.businessCity = data.businessCity;
            this.auditSettings.autoPushPendingFailed =
              data.autoPushPendingFailed;
            this.auditSettings.einvoiceAlert = data.einvoiceAlert;
            this.auditSettings.lockSales = data.lockSales;
            this.auditSettings.taxApplicability = data.taxApplicability;
            this.auditSettings.shippingPackingTax = data.shippingPackingTax;
            this.auditSettings.taxRateAutofillList = data.taxRateAutofillList;
            this.auditSettings.shippingChargeHsn = data.shippingChargeHsn;
            this.auditSettings.packingChargeHsn = data.packingChargeHsn;
            this.auditSettings.insuranceHsn = data.insuranceHsn;
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.auditSettings;
  };

  setAuditSettingsData = (params, val) => {
    this.auditSettings[params] = val;
    this.saveData();
  };

  setLockSales = async (val, isChecked) => {
    let monthVal;
    let result = await auditHelper.getMonthValue().find((e) => e.name === val);

    if (result) {
      monthVal = result.val;
    }

    if (isChecked) {
      this.auditSettings.lockSales.push(monthVal);
    } else {
      let indexToRemove = -1;
      for (var i = 0; i < this.auditSettings.lockSales.length; i++) {
        if (monthVal === this.auditSettings.lockSales[i]) {
          indexToRemove = i;
          break;
        }
      }
      if (indexToRemove !== -1) {
        this.auditSettings.lockSales.splice(indexToRemove, 1);
      }
    }
    this.saveData();
  };

  setTaxRates = async (val, isChecked) => {
    let taxVal;
    let result = await auditHelper
      .getTaxRateValue()
      .find((e) => e.name === val);

    if (result) {
      taxVal = result.val;
    }

    if (isChecked) {
      this.auditSettings.taxApplicability.push(taxVal);
    } else {
      let indexToRemove = -1;
      for (var i = 0; i < this.auditSettings.taxApplicability.length; i++) {
        if (taxVal === this.auditSettings.taxApplicability[i]) {
          indexToRemove = i;
          break;
        }
      }
      if (indexToRemove !== -1) {
        this.auditSettings.taxApplicability.splice(indexToRemove, 1);
      }
    }
    this.saveData();
  };

  setShippingTaxRate = async (val) => {
    let taxVal;
    let result = await auditHelper
      .getTaxRateValue()
      .find((e) => e.name === val);

    if (result) {
      taxVal = result.val;
    }

    this.auditSettings.shippingPackingTax = taxVal;
    
    this.saveData();
  };

  addTaxRate = () => {
    let taxRateRow = {
      price: 0,
      tax: 0
    };

    runInAction(() => {
      if(this.auditSettings.taxRateAutofillList === undefined || this.auditSettings.taxRateAutofillList === null) {
        this.auditSettings.taxRateAutofillList = [];
      }
      this.auditSettings.taxRateAutofillList.push(taxRateRow);
    });

    this.saveData();
  };

  editTaxRate = (property, index, value) => {
    if (value !== '') {
      runInAction(() => {
        this.auditSettings.taxRateAutofillList[index][property] = value;
      });

      this.saveData();
    }
  };

  removeTaxRate = (index) => {
    runInAction(() => {
      this.auditSettings.taxRateAutofillList.splice(index, 1);
    });

    this.saveData();
  };

  constructor() {
    this.auditSettings = new AuditSettings().defaultValues();
    this.auditSettingsDefault = new AuditSettings().defaultValues();

    makeObservable(this, {
      auditSettings: observable,
      setAuditSettingsData: action,
      getAuditSettingsData: action,
      saveData: action
    });
  }
}
export default new AuditSettingsStore();