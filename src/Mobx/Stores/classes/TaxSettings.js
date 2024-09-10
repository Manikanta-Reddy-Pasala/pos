export default class TaxSettings {
  convertTypes(data) {
    data.tradeName = data.tradeName || '';
    data.gstin = data.gstin || '';
    data.legalName = data.legalName || '';
    data.reverseCharge = data.reverseCharge || false;
    data.state = data.state || '';
    data.compositeScheme = data.compositeScheme || false;
    data.enableGst = data.enableGst || false;
    data.compositeSchemeValue = data.compositeSchemeValue || '1';
    data.updatedAt = data.updatedAt || '';
    data.businessId = data.businessId || '';
    data.businessCity = data.businessCity || '';
    data.dispatchAddress = data.dispatchAddress || '';
    data.dispatchPincode = data.dispatchPincode || '';
    data.dispatchState = data.dispatchState || '';
    data.dispatchCity = data.dispatchCity || '';
    data.dispatchArea = data.dispatchArea || '';
    data.billingAddress = data.billingAddress || '';
    data.area = data.area || '';
    data.city = data.city || '';
    data.pincode = data.pincode || '';
    data.compositeSchemeType = data.compositeSchemeType || '';
    data.gstPortalUserName = data.gstPortalUserName || '';
    data.gstPortalEvcPan = data.gstPortalEvcPan || '';
    data.exporterCodeNo = data.exporterCodeNo || '';
    data.exporterRegistrationDate = data.exporterRegistrationDate || '';
    return data;
  }

  getDefaultValues() {
    return {
      tradeName: '',
      gstin: '',
      legalName: '',
      reverseCharge: false,
      state: '',
      compositeScheme: false,
      enableGst: false,
      compositeSchemeValue: '1',
      updatedAt: Date.now(),
      businessId: '',
      businessCity: '',
      dispatchAddress: '',
      dispatchPincode: '',
      dispatchState: '',
      dispatchCity: '',
      dispatchArea: '',
      billingAddress: '',
      area: '',
      city: '',
      pincode: '',
      compositeSchemeType: '',
      gstPortalUserName: '',
      gstPortalEvcPan: '',
      exporterCodeNo: '',
      exporterRegistrationDate: ''
    };
  }
}