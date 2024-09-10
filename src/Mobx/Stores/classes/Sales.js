import { getTodayDateInYYYYMMDD } from 'src/components/Helpers/DateHelper';
export default class Sales {
  defaultValues() {
    return {
      businessId: '',
      businessCity: '',
      customer_id: '',
      customer_name: '',
      customerGSTNo: null,
      customerGstType: '',
      customer_address: '',
      customer_phoneNo: '',
      customer_city: '',
      customer_emailId: '',
      customer_pincode: '',
      invoice_number: 0,
      invoice_date: getTodayDateInYYYYMMDD(),
      is_roundoff: false,
      round_amount: 0.0,
      total_amount: 0.0,
      is_credit: false,
      payment_type: 'cash',
      bankAccount: '',
      bankAccountId: '',
      bankPaymentType: '',
      received_amount: 0.0,
      balance_amount: 0.0,
      linked_amount: 0.0,
      isPartiallyReturned: false,
      isFullyReturned: false,
      linkPayment: false,
      linkedTxnList: [],
      updatedAt: '',
      discount_percent: 0,
      discount_amount: 0,
      discount_type: '',
      packing_charge: 0,
      shipping_charge: 0,
      place_of_supply: '',
      placeOfSupplyName: '',
      order_type: '',
      onlineOrderStatus: '',
      ewayBillNo: '',
      sequenceNumber: '',
      templeBillType: '',
      templeSpecialDayName: '',
      templeSpecialDayStartDate: '',
      templeSpecialDayEndDate: '',
      templeSpecialDayTimings: '',
      templeCustomTypeComments: '',
      templeOccursEveryYear: false,
      gothra: '',
      rashi: '',
      star: '',
      specialDayEnabled: true,
      paymentReferenceNumber: '',
      poDate: '',
      poInvoiceNo: '',
      vehicleNo: '',
      transportMode: 'Road',
      shipToCustomerName: '',
      shipToCustomerGSTNo: null,
      shipToCustomerGstType: '',
      shipToCustomerAddress: '',
      shipToCustomerPhoneNo: '',
      shipToCustomerCity: '',
      shipToCustomerEmailId: '',
      shipToCustomerPincode: '',
      shipToCustomerId: '',
      customerState: '',
      customerCountry: '',
      shipToCustomerState: '',
      shipToCustomerCountry: '',
      convertedToDC: false,
      notes: '',
      rateList: [],
      ewayBillStatus: 'Not Generated',
      ewayBillDetails: null,
      einvoiceBillStatus: 'Pending',
      einvoiceDetails: null,
      irnNo: '',
      vehicleType: 'Regular',
      approxDistance: 0,
      transporterName: '',
      transporterId: '',
      ewayBillGeneratedDate: '',
      einvoiceBillGeneratedDate: '',
      ewayBillValidDate: '',
      customerTradeName: '',
      customerLegalName: '',
      shipToCustomerTradeName: '',
      shipToCustomerLegalName: '',
      customerRegistrationNumber: '',
      customerPanNumber: '',
      shipToCustomerRegistrationNumber: '',
      shipToCustomerPanNumber: '',
      tcsAmount: 0,
      tcsName: '',
      tcsRate: 0,
      tcsCode: '',
      dueDate: null,
      tdsAmount: 0,
      tdsName: '',
      tdsRate: 0,
      tdsCode: '',
      splitPaymentList: [],
      weightIn: 0,
      weightOut: 0,
      wastage: 0,
      jobAssignedEmployeeId: '',
      jobAssignedEmployeeName: '',
      jobAssignedEmployeePhoneNumber: '',
      isCancelled: false,
      isSyncedToServer: false,
      invoiceStatus: '',
      tallySyncedStatus: '',
      calculateStockAndBalance: true,
      tallySynced: false,
      aadharNumber: '',
      sortingNumber: 0,
      eWayErrorMessage: '',
      eInvoiceErrorMessage: '',
      salesEmployeeName: '',
      salesEmployeeId: '',
      salesEmployeePhoneNumber: '',
      schemeId: '',
      shippingTax: null,
      packingTax: null,
      amendmentDate: '',
      amended: false,
      amendmentReason: '',
      exportType: '',
      exportCountry: '',
      exportCurrency: 'USD - United States Dollar',
      exportConversionRate: 0,
      exportShippingBillNo: '',
      exportShippingBillDate: '',
      exportShippingPortCode: '',
      discountPercentForAllItems: 0,
      insurance: null,
      oldSequenceNumber: '',
      imageUrls: [],
      placeOfReceiptByPreCarrier: '',
      vesselFlightNo: '',
      portOfLoading: '',
      portOfDischarge: '',
      otherReference: '',
      billOfLadingNo: '',
      terms: '',
      buyerOtherBillTo: {
        id: '',
        phoneNo: '',
        name: '',
        address: '',
        pincode: '',
        city: '',
        state: '',
        country: '',
        email: '',
        gstNo: '',
        gstType: '',
        pan: '',
        aadhar: '',
        tradeName: '',
        legalName: '',
        regNo: ''
      },
      totalOtherCurrency: 0,
      exportCountryOrigin: 'India', //To change
      shippingChargeOtherCurrency: 0,
      packingChargeOtherCurrency: 0
    };
  }

  convertTypes(data) {
    data.businessId = data.businessId || '';
    data.businessCity = data.businessCity || '';
    data.customer_id = data.customer_id || '';
    data.customer_name = data.customer_name || '';
    data.customerGSTNo = data.customerGSTNo || null;
    data.customerGstType = data.customerGstType || '';
    data.customer_address = data.customer_address || '';
    data.customer_phoneNo = data.customer_phoneNo || '';
    data.customer_city = data.customer_city || '';
    data.customer_emailId = data.customer_emailId || '';
    data.customer_pincode = data.customer_pincode || '';
    data.invoice_number = data.invoice_number || 0;
    data.invoice_date = data.invoice_date || getTodayDateInYYYYMMDD();
    data.is_roundoff = data.is_roundoff || false;
    data.round_amount = parseFloat(data.round_amount) || 0.0;
    data.total_amount = parseFloat(data.total_amount) || 0.0;
    data.is_credit = data.is_credit || false;
    data.payment_type = data.payment_type || 'cash';
    data.bankAccount = data.bankAccount || '';
    data.bankAccountId = data.bankAccountId || '';
    data.bankPaymentType = data.bankPaymentType || '';
    data.balance_amount = parseFloat(data.balance_amount) || 0.0;
    data.linked_amount = parseFloat(data.linked_amount) || 0.0;
    data.isPartiallyReturned = data.isPartiallyReturned || false;
    data.isFullyReturned = data.isFullyReturned || false;
    data.linkPayment = data.linkPayment || false;
    data.linkedTxnList = data.linkedTxnList || [];
    data.updatedAt = data.updatedAt || '';
    data.discount_percent = parseFloat(data.discount_percent) || 0;
    data.discount_amount = parseFloat(data.discount_amount) || 0;
    data.discount_type = data.discount_type || '';
    data.packing_charge = parseFloat(data.packing_charge) || 0;
    data.shipping_charge = parseFloat(data.shipping_charge) || 0;
    data.place_of_supply = data.place_of_supply || '';
    data.placeOfSupplyName = data.placeOfSupplyName || '';
    data.order_type = data.order_type || '';
    data.onlineOrderStatus = data.onlineOrderStatus || '';
    data.ewayBillNo = data.ewayBillNo || '';
    data.sequenceNumber = data.sequenceNumber || '';
    data.templeBillType = data.templeBillType || '';
    data.templeSpecialDayName = data.templeSpecialDayName || '';
    data.templeSpecialDayStartDate = data.templeSpecialDayStartDate || '';
    data.templeSpecialDayEndDate = data.templeSpecialDayEndDate || '';
    data.templeSpecialDayTimings = data.templeSpecialDayTimings || '';
    data.templeCustomTypeComments = data.templeCustomTypeComments || '';
    data.templeOccursEveryYear = data.templeOccursEveryYear || false;
    data.gothra = data.gothra || '';
    data.rashi = data.rashi || '';
    data.star = data.star || '';
    data.specialDayEnabled = data.specialDayEnabled || true;
    data.paymentReferenceNumber = data.paymentReferenceNumber || '';
    data.poDate = data.poDate || '';
    data.poInvoiceNo = data.poInvoiceNo || '';
    data.vehicleNo = data.vehicleNo || '';
    data.transportMode = data.transportMode || 'Road';
    data.shipToCustomerName = data.shipToCustomerName || '';
    data.shipToCustomerGSTNo = data.shipToCustomerGSTNo || null;
    data.shipToCustomerGstType = data.shipToCustomerGstType || '';
    data.shipToCustomerAddress = data.shipToCustomerAddress || '';
    data.shipToCustomerPhoneNo = data.shipToCustomerPhoneNo || '';
    data.shipToCustomerCity = data.shipToCustomerCity || '';
    data.shipToCustomerEmailId = data.shipToCustomerEmailId || '';
    data.shipToCustomerPincode = data.shipToCustomerPincode || '';
    data.shipToCustomerId = data.shipToCustomerId || '';
    data.customerState = data.customerState || '';
    data.customerCountry = data.customerCountry || '';
    data.shipToCustomerState = data.shipToCustomerState || '';
    data.shipToCustomerCountry = data.shipToCustomerCountry || '';
    data.convertedToDC = data.convertedToDC || false;
    data.notes = data.notes || '';
    data.rateList = data.rateList || [];
    data.ewayBillStatus = data.ewayBillStatus || 'Not Generated';
    data.ewayBillDetails = data.ewayBillDetails || null;
    data.einvoiceBillStatus = data.einvoiceBillStatus || 'Pending';
    data.einvoiceDetails = data.einvoiceDetails || null;
    data.irnNo = data.irnNo || '';
    data.vehicleType = data.vehicleType || 'Regular';
    data.approxDistance = parseFloat(data.approxDistance) || 0;
    data.transporterName = data.transporterName || '';
    data.transporterId = data.transporterId || '';
    data.ewayBillGeneratedDate = data.ewayBillGeneratedDate || '';
    data.einvoiceBillGeneratedDate = data.einvoiceBillGeneratedDate || '';
    data.ewayBillValidDate = data.ewayBillValidDate || '';
    data.customerTradeName = data.customerTradeName || '';
    data.customerLegalName = data.customerLegalName || '';
    data.shipToCustomerTradeName = data.shipToCustomerTradeName || '';
    data.shipToCustomerLegalName = data.shipToCustomerLegalName || '';
    data.customerRegistrationNumber = data.customerRegistrationNumber || '';
    data.customerPanNumber = data.customerPanNumber || '';
    data.shipToCustomerRegistrationNumber =
      data.shipToCustomerRegistrationNumber || '';
    data.shipToCustomerPanNumber = data.shipToCustomerPanNumber || '';
    data.tcsAmount = parseFloat(data.tcsAmount) || 0;
    data.tcsName = data.tcsName || '';
    data.tcsRate = parseFloat(data.tcsRate) || 0;
    data.tcsCode = data.tcsCode || '';
    data.dueDate = data.dueDate || null;
    data.tdsAmount = parseFloat(data.tdsAmount) || 0;
    data.tdsName = data.tdsName || '';
    data.tdsRate = parseFloat(data.tdsRate) || 0;
    data.tdsCode = data.tdsCode || '';
    data.splitPaymentList = data.splitPaymentList || [];
    data.weightIn = parseFloat(data.weightIn) || 0;
    data.weightOut = parseFloat(data.weightOut) || 0;
    data.wastage = parseFloat(data.wastage) || 0;
    data.jobAssignedEmployeeId = data.jobAssignedEmployeeId || '';
    data.jobAssignedEmployeeName = data.jobAssignedEmployeeName || '';
    data.jobAssignedEmployeePhoneNumber =
      data.jobAssignedEmployeePhoneNumber || '';
    data.isCancelled = data.isCancelled || false;
    data.isSyncedToServer = data.isSyncedToServer || false;
    data.invoiceStatus = data.invoiceStatus || '';
    data.tallySyncedStatus = data.tallySyncedStatus || '';
    data.calculateStockAndBalance = data.calculateStockAndBalance || true;
    data.tallySynced = data.tallySynced || false;
    data.aadharNumber = data.aadharNumber || '';
    data.sortingNumber = parseInt(data.sortingNumber) || 0;
    data.eWayErrorMessage = data.eWayErrorMessage || '';
    data.eInvoiceErrorMessage = data.eInvoiceErrorMessage || '';
    data.salesEmployeeName = data.salesEmployeeName || '';
    data.salesEmployeeId = data.salesEmployeeId || '';
    data.salesEmployeePhoneNumber = data.salesEmployeePhoneNumber || '';
    data.schemeId = data.schemeId || '';
    data.shippingTax = data.shippingTax ? JSON.parse(JSON.stringify(data.shippingTax)) : null;
    data.packingTax = data.packingTax ? JSON.parse(JSON.stringify(data.packingTax)) : null;
    data.amendmentDate = data.amendmentDate || '';
    data.amended = data.amended || false;
    data.amendmentReason = data.amendmentReason || '';
    data.exportType = data.exportType || '';
    data.exportCountry = data.exportCountry || '';
    data.exportCurrency = data.exportCurrency || '';
    data.exportConversionRate = parseFloat(data.exportConversionRate) || 0;
    data.exportShippingBillNo = data.exportShippingBillNo || '';
    data.exportShippingBillDate = data.exportShippingBillDate || '';
    data.exportShippingPortCode = data.exportShippingPortCode || '';
    data.discountPercentForAllItems =
      parseFloat(data.discountPercentForAllItems) || 0;
    data.insurance = data.insurance || null;
    data.oldSequenceNumber = data.oldSequenceNumber || '';
    data.imageUrls = data.imageUrls || [];
    data.placeOfReceiptByPreCarrier = data.placeOfReceiptByPreCarrier || '';
    data.vesselFlightNo = data.vesselFlightNo || '';
    data.portOfLoading = data.portOfLoading || '';
    data.portOfDischarge = data.portOfDischarge || '';
    data.otherReference = data.otherReference || '';
    data.billOfLadingNo = data.billOfLadingNo || '';
    data.terms = data.terms || '';
    data.buyerOtherBillTo = data.buyerOtherBillTo || {
      id: '',
      phoneNo: '',
      name: '',
      address: '',
      pincode: '',
      city: '',
      state: '',
      country: '',
      email: '',
      gstNo: '',
      gstType: '',
      pan: '',
      aadhar: '',
      tradeName: '',
      legalName: '',
      regNo: ''
    };
    data.totalOtherCurrency = parseFloat(data.totalOtherCurrency) || 0;
    data.exportCountryOrigin = data.exportCountryOrigin || '';
    data.shippingChargeOtherCurrency = parseFloat(data.shippingChargeOtherCurrency) || 0;
    data.packingChargeOtherCurrency = parseFloat(data.packingChargeOtherCurrency) || 0;
    return data;
  }
}