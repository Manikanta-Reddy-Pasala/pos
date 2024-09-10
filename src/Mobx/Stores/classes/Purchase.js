import { getTodayDateInYYYYMMDD } from 'src/components/Helpers/DateHelper';
export default class Purchase {
  defaultValues() {
    return {
      businessId: '',
      businessCity: '',
      vendor_id: '',
      vendor_name: '',
      vendor_gst_number: '',
      vendor_gst_type: '',
      vendor_payable: false,
      vendor_phone_number: '',
      is_credit: false,
      bill_number: '',
      vendor_bill_number: '',
      bill_date: getTodayDateInYYYYMMDD(),
      is_roundoff: false,
      round_amount: 0.0,
      total_amount: 0.0,
      payment_type: 'cash',
      bankAccount: '',
      bankAccountId: '',
      bankPaymentType: '',
      paid_amount: 0.0,
      balance_amount: 0.0,
      isPartiallyReturned: false,
      isFullyReturned: false,
      linkedTxnList: [],
      linkPayment: false,
      linked_amount: 0,
      discount_percent: 0,
      discount_amount: 0,
      discount_type: '',
      updatedAt: '',
      packing_charge: 0,
      shipping_charge: 0,
      place_of_supply: '',
      placeOfSupplyName: '',
      reverseChargeEnable: false,
      reverseChargeValue: 0,
      paymentReferenceNumber: '',
      notes: '',
      vendorCity: '',
      vendorPincode: '',
      vendorAddress: '',
      vendorState: '',
      vendorCountry: '',
      vendor_email_id: '',
      rateList: [],
      tcsAmount: 0,
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      dueDate: null,
      tdsAmount: 0,
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      vendorPanNumber: '',
      splitPaymentList: [],
      isSyncedToServer: false,
      invoiceStatus: '',
      tallySyncedStatus: '',
      calculateStockAndBalance: true,
      tallySynced: false,
      aadharNumber: '',
      lrNumber: '',
      vendorMsmeRegNo: '',
      discountPercentForAllItems: 0,
      portalITCAvailable: false,
      posITCAvailable: false,
      portalRCMValue: false,
      posRCMValue: false,
      itcReversed: false,
      fromPortal: false,
      item_list: [],
      accountingDate:''
    };
  }

  convertTypes(data) {
    this.businessId = data.businessId || '';
    this.businessCity = data.businessCity || '';
    this.vendor_id = data.vendor_id || '';
    this.vendor_name = data.vendor_name || '';
    this.vendor_gst_number = data.vendor_gst_number || '';
    this.vendor_gst_type = data.vendor_gst_type || '';
    this.vendor_payable = data.vendor_payable || false;
    this.vendor_phone_number = data.vendor_phone_number || '';
    this.is_credit = data.is_credit || false;
    this.bill_number = data.bill_number || '';
    this.vendor_bill_number = data.vendor_bill_number || '';
    this.bill_date = data.bill_date || getTodayDateInYYYYMMDD();
    this.is_roundoff = data.is_roundoff || false;
    this.round_amount = parseFloat(data.round_amount) || 0.0;
    this.total_amount = parseFloat(data.total_amount) || 0.0;
    this.payment_type = data.payment_type || 'cash';
    this.bankAccount = data.bankAccount || '';
    this.bankAccountId = data.bankAccountId || '';
    this.bankPaymentType = data.bankPaymentType || '';
    this.paid_amount = parseFloat(data.paid_amount) || 0.0;
    this.balance_amount = parseFloat(data.balance_amount) || 0.0;
    this.isPartiallyReturned = data.isPartiallyReturned || false;
    this.isFullyReturned = data.isFullyReturned || false;
    this.linkedTxnList = data.linkedTxnList || [];
    this.linkPayment = data.linkPayment || false;
    this.linked_amount = parseFloat(data.linked_amount) || 0;
    this.discount_percent = parseFloat(data.discount_percent) || 0;
    this.discount_amount = parseFloat(data.discount_amount) || 0;
    this.discount_type = data.discount_type || '';
    this.updatedAt = data.updatedAt || '';
    this.packing_charge = parseFloat(data.packing_charge) || 0;
    this.shipping_charge = parseFloat(data.shipping_charge) || 0;
    this.place_of_supply = parseFloat(data.place_of_supply) || '';
    this.placeOfSupplyName = data.placeOfSupplyName || '';
    this.reverseChargeEnable = data.reverseChargeEnable || false;
    this.reverseChargeValue = parseFloat(data.reverseChargeValue) || 0;
    this.paymentReferenceNumber = data.paymentReferenceNumber || '';
    this.notes = data.notes || '';
    this.vendorCity = data.vendorCity || '';
    this.vendorPincode = data.vendorPincode || '';
    this.vendorAddress = data.vendorAddress || '';
    this.vendorState = data.vendorState || '';
    this.vendorCountry = data.vendorCountry || '';
    this.vendor_email_id = data.vendor_email_id || '';
    this.rateList = data.rateList || [];
    this.tcsAmount = parseFloat(data.tcsAmount) || 0;
    this.tcsName = data.tcsName || '';
    this.tcsRate = parseFloat(data.tcsRate) || 0;
    this.tcsCode = data.tcsCode || '';
    this.dueDate = data.dueDate || null;
    this.tdsAmount = parseFloat(data.tdsAmount) || 0;
    this.tdsName = data.tdsName || '';
    this.tdsRate = parseFloat(data.tdsRate) || 0;
    this.tdsCode = data.tdsCode || '';
    this.vendorPanNumber = data.vendorPanNumber || '';
    this.splitPaymentList = data.splitPaymentList || [];
    this.isSyncedToServer = data.isSyncedToServer || false;
    this.invoiceStatus = data.invoiceStatus || '';
    this.tallySyncedStatus = data.tallySyncedStatus || '';
    this.calculateStockAndBalance = data.calculateStockAndBalance || true;
    this.tallySynced = data.tallySynced || false;
    this.aadharNumber = data.aadharNumber || '';
    this.lrNumber = data.lrNumber || '';
    this.vendorMsmeRegNo = data.vendorMsmeRegNo || '';
    this.discountPercentForAllItems = parseFloat(data.discountPercentForAllItems) || 0;
    this.portalITCAvailable = data.portalITCAvailable || false;
    this.posITCAvailable = data.posITCAvailable || false;
    this.portalRCMValue = data.portalRCMValue || false;
    this.posRCMValue = data.posRCMValue || false;
    this.itcReversed = data.itcReversed || false;
    this.fromPortal = data.fromPortal || false;
    this.item_list = data.item_list || [];
    this.accountingDate = data.accountingDate || '';

    return data;
  }
}
