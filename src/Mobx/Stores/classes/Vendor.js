import * as dateHelper from 'src/components/Helpers/DateHelper';
export default class Vendor {

  getDefaultValues() {
    return {
      name: '',
      id: '',
      phoneNo: '',
      balanceType: '',
      balance: 0,
      asOfDate: dateHelper.getTodayDateInYYYYMMDD(),
      gstNumber: '',
      gstType: 'Unregistered Vendor',
      address: '',
      pincode: '',
      city: '',
      emailId: '',
      vipCustomer: false,
      isVendor: true,
      isCustomer: false,
      updatedAt: Date.now(),
      businessId: '',
      businessCity: '',
      place_of_supply: ' ',
      shippingAddress: '',
      shippingPincode: '',
      shippingCity: '',
      state: '',
      country: 'India',
      shippingState: '',
      shippingCountry: 'India',
      registrationNumber: '',
      tradeName: '',
      legalName: '',
      panNumber: '',
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      additionalAddressList: [],
      isSyncedToServer: false,
      tallySyncedStatus: '',
      tallySynced: false,
      aadharNumber: '',
      creditLimit: 0,
      msmeRegNo: '',
      companyStatus: '',
      tallyMappingName: '',
      creditLimitDays: 0
    };
  }
}