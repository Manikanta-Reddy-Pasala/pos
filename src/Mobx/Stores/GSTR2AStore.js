import { observable, makeObservable } from 'mobx';
import {
  getCurrentFinancialYear
} from 'src/components/Helpers/DateHelper';
import { runInAction } from 'mobx';

class GSTR2AStore {
  GSTRDateRange = {};
  b2b2AData = [];
  b2ba2AData = [];
  cdnr2AData = [];
  cdnra2AData = [];
  isd2AData = [];
  impg2AData = [];
  impsezg2AData = [];
  GSTINCollection = [];

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
  vendorStep = 1;

  setDateRageOfGSTR2 = async (fromDate, toDate) => {
    runInAction(() => {
      this.GSTRDateRange.fromDate = fromDate;
      this.GSTRDateRange.toDate = toDate;
    });
  };

  setDateRageOfGSTR2FromDate = async (fromDate) => {
    runInAction(() => {
      this.GSTRDateRange.fromDate = fromDate;
    });
  };

  setDateRageOfGSTR2ToDate = async (toDate) => {
    runInAction(() => {
      this.GSTRDateRange.toDate = toDate;
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

  GSTINCollectionUpdate = (GST) => {
    const existingIndex = this.GSTINCollection.findIndex(
      (item) => item.GSTIN === GST
    );

    if (existingIndex === -1) {
      this.GSTINCollection.push({ GSTIN: GST, selected: true, phone: '' });
    }
  };

  setGSTRPeriod = async (yearData, monthData) => {
    if (monthData > '03') {
      this.GSTRPeriod = monthData + yearData;
    } else {
      this.GSTRPeriod = monthData + (parseInt(yearData) + 1);
    }
    const year = this.GSTRPeriod.substring(2, 6);
    const month = this.GSTRPeriod.substring(0, 2);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    this.GSTRDateRange.fromDate = `${start.getFullYear()}-${(
      start.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`;
    this.GSTRDateRange.toDate = `${end.getFullYear()}-${(end.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')}`;
    console.log('this.GSTRDateRange', this.GSTRDateRange);
    console.log('this.GSTRDateRange', end);
  };

  resetAllData = () => {
    runInAction(() => {
      this.b2b2AData = [];
      this.b2ba2AData = [];
      this.cdnr2AData = [];
      this.cdnra2AData = [];
      this.isd2AData = [];
      this.impg2AData = [];
      this.impsezg2AData = [];
    });
  };

  updateB2BData = (data) => {
    runInAction(() => {
      this.b2b2AData = data;
    });
  };

  updateB2BAData = (data) => {
    runInAction(() => {
      this.b2ba2AData = data;
    });
  };

  updateCDNRData = (data) => {
    runInAction(() => {
      this.cdnr2AData = data;
    });
  };

  updateCDNRAData = (data) => {
    runInAction(() => {
      this.cdnra2AData = data;
    });
  };

  updateISDData = (data) => {
    runInAction(() => {
      this.isd2AData = data;
    });
  };

  updateIMPGData = (data) => {
    runInAction(() => {
      this.impg2AData = data;
    });
  };

  updateIMPGSEZData = (data) => {
    runInAction(() => {
      this.impsezg2AData = data;
    });
  };

  constructor() {
    makeObservable(this, {
      GSTRDateRange: observable,
      b2b2AData: observable,
      b2ba2AData: observable,
      cdnr2AData: observable,
      cdnra2AData: observable,
      isd2AData: observable,
      impg2AData: observable,
      impsezg2AData: observable,
      financialYear: observable,
      financialMonth: observable,
      vendorStep: observable,
      GSTINCollection: observable,
      GSTRPeriod: observable
    });
  }
}
export default new GSTR2AStore();