import * as Db from 'src/RxDb/Database/Database';
import { makeObservable, observable, runInAction } from 'mobx';
import * as Bd from 'src/components/SelectedBusiness';
import getStateList from 'src/components/StateList';
import * as taxSettings from 'src/components/Helpers/TaxSettingsHelper';
import Gstr1ErrorObj from 'src/components/Helpers/Classes/Gstr1ErrorObj';
import {
  getCurrentFinancialYear,
  getSelectedDateMonthAndYearMMYYYY
} from 'src/components/Helpers/DateHelper';
import * as unitHelper from 'src/components/Helpers/ProductUnitHelper';
import * as audit from 'src/components/Helpers/AuditHelper';

class GSTRDashboardStore {
  retPeriod = [];

  setRetPeriod = async (value) => {
    runInAction(() => {
      this.retPeriod = value;
    });
  };


  constructor() {
    makeObservable(this, {
      retPeriod: observable,
    });
  }
}

export default new GSTRDashboardStore();