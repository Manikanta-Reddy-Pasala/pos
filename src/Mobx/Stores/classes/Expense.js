import { getTodayDateInYYYYMMDD } from '../../../components/Helpers/DateHelper';
export default class Expense {
  defaultValues() {
    return {
      businessId: '',
      businessCity: '',
      expenseId: '',
      category: '',
      date: getTodayDateInYYYYMMDD(),
      dueDate: getTodayDateInYYYYMMDD(),
      paymentType: 'cash',
      total: 0,
      notes: '',
      isRoundOff: false,
      roundAmount: 0,
      updatedAt: Date.now(),
      bankAccount: '',
      bankAccountId: '',
      bankPaymentType: '',
      paymentReferenceNumber: '',
      billNumber: '',
      packageCharge: 0,
      shippingCharge: 0,
      placeOfSupply: '',
      placeOfSupplyName: '',
      discountPercent: 0,
      discountAmount: 0,
      discountType: '',
      is_credit: false,
      linked_amount: 0,
      balance: 0.0,
      reverseChargeEnable: false,
      reverseChargeValue: 0,
      vendor_id: '',
      vendor_name: '',
      vendor_gst_number: '',
      vendor_gst_type: '',
      vendor_payable: false,
      vendor_phone_number: '',
      vendorCity: '',
      vendorPincode: '',
      vendorAddress: '',
      vendorState: '',
      vendorCountry: '',
      vendor_email_id: '',
      sub_total: 0,
      vendorPanNumber: '',
      tcsAmount: 0,
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      tdsAmount: 0,
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      splitPaymentList: [],
      isSyncedToServer: false,
      expenseType: 'Indirect',
      invoiceStatus: '',
      tallySyncedStatus: '',
      tallySynced: false,
      categoryName: '',
      adjustVendorBalance: true,
      discountPercentForAllItems: 0,
      portalITCAvailable: false,
      posITCAvailable: false,
      portalRCMValue: false,
      posRCMValue: false,
      itcReversed: false,
      fromPortal: false,
      item_list: [],
      imageUrls: [],
    };
  }

  convertTypes(data) {
    this.businessId = data.businessId || '';
    this.businessCity = data.businessCity || '';
    this.expenseId = data.expenseId || '';
    this.category = data.category || '';
    this.date = data.date || getTodayDateInYYYYMMDD();
    this.dueDate = data.dueDate || getTodayDateInYYYYMMDD();
    this.paymentType = data.paymentType || 'cash';
    this.total = parseFloat(data.total) || 0;
    this.notes = data.notes || '';
    this.isRoundOff = data.isRoundOff || false;
    this.roundAmount = parseFloat(data.roundAmount) || 0;
    this.updatedAt = data.updatedAt || Date.now();
    this.bankAccount = data.bankAccount || '';
    this.bankAccountId = data.bankAccountId || '';
    this.bankPaymentType = data.bankPaymentType || '';
    this.paymentReferenceNumber = data.paymentReferenceNumber || '';
    this.billNumber = data.billNumber || '';
    this.packageCharge = parseFloat(data.packageCharge) || 0;
    this.shippingCharge = parseFloat(data.shippingCharge) || 0;
    this.placeOfSupply = data.placeOfSupply || '';
    this.placeOfSupplyName = data.placeOfSupplyName || '';
    this.discountPercent = parseFloat(data.discountPercent) || 0;
    this.discountAmount = parseFloat(data.discountAmount) || 0;
    this.discountType = data.discountType || '';
    this.is_credit = data.is_credit || false;
    this.linked_amount = data.linked_amount || 0;
    this.balance = parseFloat(data.balance) || 0.0;
    this.reverseChargeEnable = data.reverseChargeEnable || false;
    this.reverseChargeValue = parseFloat(data.reverseChargeValue) || 0;
    this.vendor_id = data.vendor_id || '';
    this.vendor_name = data.vendor_name || '';
    this.vendor_gst_number = data.vendor_gst_number || '';
    this.vendor_gst_type = data.vendor_gst_type || '';
    this.vendor_payable = data.vendor_payable || false;
    this.vendor_phone_number = data.vendor_phone_number || '';
    this.vendorCity = data.vendorCity || '';
    this.vendorPincode = data.vendorPincode || '';
    this.vendorAddress = data.vendorAddress || '';
    this.vendorState = data.vendorState || '';
    this.vendorCountry = data.vendorCountry || '';
    this.vendor_email_id = data.vendor_email_id || '';
    this.sub_total = data.sub_total || 0;
    this.vendorPanNumber = data.vendorPanNumber || '';
    this.tcsAmount = parseFloat(data.tcsAmount) || 0;
    this.tcsName = data.tcsName || '';
    this.tcsRate = parseFloat(data.tcsRate) || 0;
    this.tcsCode = data.tcsCode || '';
    this.tdsAmount = parseFloat(data.tdsAmount) || 0;
    this.tdsName = data.tdsName || '';
    this.tdsRate = parseFloat(data.tdsRate) || 0;
    this.tdsCode = data.tdsCode || '';
    this.splitPaymentList = data.splitPaymentList || [];
    this.isSyncedToServer = data.isSyncedToServer || false;
    this.expenseType = data.expenseType || 'Indirect';
    this.invoiceStatus = data.invoiceStatus || '';
    this.tallySyncedStatus = data.tallySyncedStatus || '';
    this.tallySynced = data.tallySynced || false;
    this.categoryName = data.categoryName || '';
    this.adjustVendorBalance = data.adjustVendorBalance || true;
    this.discountPercentForAllItems = parseFloat(data.discountPercentForAllItems) || 0;
    this.portalITCAvailable = data.portalITCAvailable || false;
    this.posITCAvailable = data.posITCAvailable || false;
    this.portalRCMValue = data.portalRCMValue || false;
    this.posRCMValue = data.posRCMValue || false;
    this.itcReversed = data.itcReversed || false;
    this.fromPortal = data.fromPortal || false;
    this.item_list = data.item_list || [];
    this.imageUrls = data.imageUrls || [];

    return data;
  }
}
