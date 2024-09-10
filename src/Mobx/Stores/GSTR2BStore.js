import { observable, makeObservable } from 'mobx';
import { getCurrentFinancialYear } from 'src/components/Helpers/DateHelper';
import { runInAction } from 'mobx';
import { findParty } from 'src/components/Helpers/dbQueries/parties';
import { isExpenseAvailable } from 'src/components/Helpers/dbQueries/expenses';
import * as Bd from 'src/components/SelectedBusiness';
import { isPurchaseAvailable } from 'src/components/Helpers/dbQueries/purchases';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import { getAuditSettings } from 'src/components/Helpers/dbQueries/auditsettings';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';

class GSTR2BStore {
  GSTR2BDateRange = {};

  financialYear = getCurrentFinancialYear();
  financialMonth = '01';
  months = [
    { name: 'January', value: '01' },
    { name: 'February', value: '02' },
    { name: 'March', value: '03' },
    { name: 'April', value: '04' },
    { name: 'May', value: '05' },
    { name: 'June', value: '06' },
    { name: 'July', value: '07' },
    { name: 'August', value: '08' },
    { name: 'September', value: '09' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' }
  ];
  GSTRPeriod = '';
  openPurchasesImportFrom2B = false;
  GSTINCollection = [];
  GSTINInvoiceCollection = [];
  vendorStep = 1;
  showInvoice = false;
  auditSettings = {};

  setDateRageOfGSTR2B = async (fromDate, toDate) => {
    runInAction(() => {
      this.GSTR2BDateRange.fromDate = fromDate;
      this.GSTR2BDateRange.toDate = toDate;
    });
  };

  setDateRageOfGSTR2BFromDate = async (fromDate) => {
    runInAction(() => {
      this.GSTR2BDateRange.fromDate = fromDate;
    });
  };

  setDateRageOfGSTR2BToDate = async (toDate) => {
    runInAction(() => {
      this.GSTR2BDateRange.toDate = toDate;
    });
  };

  setFinancialYear = async (value) => {
    runInAction(() => {
      this.financialYear = value;
    });
  };

  setFinancialMonth = async (value) => {
    runInAction(() => {
      this.financialMonth = value;
    });
  };

  setGSTRPeriod = async (yearData, monthData) => {
    runInAction(() => {
      if (monthData > '03') {
        this.GSTRPeriod = monthData + yearData;
      } else {
        this.GSTRPeriod = monthData + (parseInt(yearData) + 1);
      }
      const year = this.GSTRPeriod.substring(2, 6);
      const month = this.GSTRPeriod.substring(0, 2);
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      this.GSTR2BDateRange.fromDate = `${start.getFullYear()}-${(
        start.getMonth() + 1
      )
        .toString()
        .padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`;
      this.GSTR2BDateRange.toDate = `${end.getFullYear()}-${(end.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')}`;
    });
  };

  setOpenPurchasesImportFrom2B = async (value) => {
    const auditSettings = await getAuditSettings();
    runInAction(() => {
      this.auditSettings = auditSettings;
      this.openPurchasesImportFrom2B = value;
    });
  };

  GSTINCollectionUpdate = async (GST, tradeName) => {
    const existingIndex = this.GSTINCollection.findIndex(
      (item) => item.GSTIN === GST
    );

    const vendorData = await findParty({
      $and: [{ gstNumber: { $eq: GST } }, { isVendor: true }]
    });

    // console.log("vendorData",vendorData);

    if (existingIndex === -1 && !vendorData) {
      console.log('vendorData', vendorData);
      this.GSTINCollection.push({
        GSTIN: GST,
        tradeName: tradeName,
        selected: vendorData && vendorData.length > 0 ? false : true,
        phone: '',
        vendorExists: vendorData && vendorData.length > 0 ? true : false,
        tallyMappedName: ''
      });
      this.vendorStep = 1;
    }

    if (this.GSTINCollection && this.GSTINCollection.length === 0) {
      this.vendorStep = 2;
    }
  };

  GSTINInvoiceCollectionUpdate = (GST, tradeName, invData) => {
    let data = {};
    invData.forEach(async (element) => {
      let inum = String(element.inum).toLocaleLowerCase();
      const businessData = await Bd.getBusinessData();
      const purchases = await isPurchaseAvailable({
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { vendor_gst_number: { $eq: GST } },
          { vendor_bill_number: { $eq: inum } }
        ]
      });

      const expenses = await isExpenseAvailable({
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { vendor_gst_number: { $eq: GST } },
          { billNumber: { $eq: inum } }
        ]
      });

      if (!purchases || !expenses) {
        this.showInvoice = true;
      }

      let rate =
        element.items && element.items.length > 0 ? element.items[0].rt : '';
      let taxUtilRes;
      if (rate !== '') {
        taxUtilRes = await taxUtilityTxn.isTaxRateValid(
          parseFloat(rate),
          this.auditSettings
        );
      }

      data = element;
      data.GSTIN = GST;
      data.accountingDate =
        dateHelper.getCurrentFinancialYear() == this.financialYear
          ? dateHelper.convertDateToYYYYMMDD(element.dt)
          : '';
      data.tradeName = tradeName;
      data.type =
        taxUtilRes && taxUtilRes.isTaxRateValid ? 'Purchase' : 'Expense';
      data.category = '';
      data.categoryId = '';
      data.posITC = 'Y';
      data.posRCM = 'N';
      data.itcReversed = 'N';
      data.selected = purchases || expenses ? false : true;
      data.exists = purchases || expenses ? true : false;
      data.notes = '';
      runInAction(() => {
        this.GSTINInvoiceCollection.push(data);
      });
    });
  };

  GSTINPhoneUpdate = (phone, index) => {
    runInAction(() => {
      this.GSTINCollection[index].phone = phone;
    });
  };

  GSTINVendorSelectionUpdate = (selected, index) => {
    runInAction(() => {
      this.GSTINCollection[index].selected = selected;
    });
  };

  GSTINTallyMappedNameUpdate = (value, index) => {
    runInAction(() => {
      this.GSTINCollection[index].tallyMappedName = value;
    });
  };

  purchaseExpenseUpdate = (value, index, name) => {
    runInAction(() => {
      this.GSTINInvoiceCollection[index][name] = value;
    });
  };

  updateVendorStep = (step) => {
    runInAction(() => {
      this.vendorStep = step;
    });
  };

  resetGSTNAndInvoiceData = () => {
    runInAction(() => {
      this.GSTINCollection = [];
      this.GSTINInvoiceCollection = [];
      this.showInvoice = false;
      this.updateVendorStep(1);
    });
  };

  constructor() {
    makeObservable(this, {
      GSTR2BDateRange: observable,
      financialYear: observable,
      financialMonth: observable,
      GSTRPeriod: observable,
      vendorStep: observable,
      GSTINCollection: observable,
      GSTINInvoiceCollection: observable,
      openPurchasesImportFrom2B: observable,
      showInvoice: observable
    });
  }
}
export default new GSTR2BStore();