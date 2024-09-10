export default class AuditSettings {
    convertTypes(data) {
      data.id = data.id || '';
      data.posId = data.posId || 0;
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.autoPushPendingFailed = data.autoPushPendingFailed || false;
      data.einvoiceAlert = data.einvoiceAlert || false;
      data.lockSales = data.lockSales || [];
      data.taxApplicability = data.taxApplicability || [];
      data.shippingPackingTax = data.shippingPackingTax || 0;
      data.taxRateAutofillList = data.taxRateAutofillList || [];
      data.shippingChargeHsn = data.shippingChargeHsn || '';
      data.packingChargeHsn = data.packingChargeHsn || '';
      data.insuranceHsn = data.insuranceHsn || '';
      return data;
    }
  
    defaultValues() {
      return {
        id: '',
        posId: 0,
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        autoPushPendingFailed: false,
        einvoiceAlert: false,
        lockSales: [],
        taxApplicability: [],
        shippingPackingTax: 0,
        taxRateAutofillList: [],
        shippingChargeHsn: '',
        packingChargeHsn: '',
        insuranceHsn: ''
      };
    }
  }