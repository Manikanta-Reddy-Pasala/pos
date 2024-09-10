export default class TallyMasterSettings {
  convertTypes(data) {
    data.businessId = data.businessId || '';
    data.businessCity = data.businessCity || '';
    data.updatedAt = Number(data.updatedAt);
    data.posId = data.posId || 0;
    data.salesMastersMapping = data.salesMastersMapping || [];
    data.purchasesMastersMapping = data.purchasesMastersMapping || [];
    data.creditNoteMastersMapping = data.creditNoteMastersMapping || [];
    data.debitNoteMastersMapping = data.debitNoteMastersMapping || [];
    data.expensesMastersMapping = data.expensesMastersMapping || [];
    data.taxesMastersMapping = data.taxesMastersMapping || [];
    data.roundOffMastersMapping = data.roundOffMastersMapping || [];
    data.packingChargesMastersMapping = data.packingChargesMastersMapping || [];
    data.shippingChargesMastersMapping =
      data.shippingChargesMastersMapping || [];
    data.discountMastersMapping = data.discountMastersMapping || [];
    data.customerMastersMapping = data.customerMastersMapping || [];
    data.vendorMastersMapping = data.vendorMastersMapping || [];
    data.tallyCompanyName = data.tallyCompanyName || '';
    data.b2b = data.b2b || true;
    data.b2c = data.b2c || true;
    return data;
  }

  getDefaultValues() {
    return {
      businessId: '',
      businessCity: '',
      updatedAt: Date.now(),
      posId: 0,
      salesMastersMapping: [],
      purchasesMastersMapping: [],
      creditNoteMastersMapping: [],
      debitNoteMastersMapping: [],
      expensesMastersMapping: [],
      taxesMastersMapping: [],
      roundOffMastersMapping: [],
      packingChargesMastersMapping: [],
      shippingChargesMastersMapping: [],
      discountMastersMapping: [],
      customerMastersMapping: [],
      vendorMastersMapping: [],
      tallyCompanyName: '',
      b2b: true,
      b2c: true
    };
  }
}
