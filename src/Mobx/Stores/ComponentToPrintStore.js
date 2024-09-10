import { action, observable, makeObservable, runInAction } from 'mobx';
import { getPrinterSettings } from 'src/components/Helpers/dbQueries/printersettings';
import { getSaleTransactionSettings } from 'src/components/Helpers/dbQueries/saletransactionsettings';
import { getSaleQuotationTransactionSettings } from 'src/components/Helpers/dbQueries/salequotationtransactionsettings';

class ComponentToPrintStore {
  invoiceRegular = {};
  invoiceThermal = {};
  salesTransSettingData = {};
  approvalTransSettingData = {};
  jobWorkInTransSettingData = {};
  purchaseTransSettingData = {};
  purchaseOrderTransSettingData = {};
  deliveryChallanTransSettingData = {};
  saleOrderTransSettingData = {};
  saleQuotationTransSettingData = {};
  paymentInTransSettingData = {};
  paymentOutTransSettingData = {};
  auditSettings = {};

  initializeData = () => {
    runInAction(async () => {
        
    });
  };

  constructor() {
    makeObservable(this, {
      invoiceRegular: observable,
      invoiceThermal: observable,
      salesTransSettingData: observable,
      approvalTransSettingData: observable,
      jobWorkInTransSettingData: observable,
      purchaseTransSettingData: observable,
      purchaseOrderTransSettingData: observable,
      deliveryChallanTransSettingData: observable,
      saleOrderTransSettingData: observable,
      saleQuotationTransSettingData: observable,
      paymentInTransSettingData: observable,
      paymentOutTransSettingData: observable,
      auditSettings: observable
    });
  }
}
export default new ComponentToPrintStore();