export default class SchemeManagement {
  
    convertTypes(data) {
      data.id = data.id || '';
      data.sequenceNumber = data.sequenceNumber || '';
      data.date = data.date || '';
      data.type = data.type || '';
      data.period = data.period || 0;
      data.depositAmount = data.depositAmount || 0;
      data.discountContribution = data.discountContribution || 0;
      data.total = data.total || 0;
      data.balance = data.balance || 0;
      data.linkedTxnList = data.linkedTxnList || [];
      data.customerId = data.customerId || '';
      data.customerName = data.customerName || '';
      data.customerGSTNo = data.customerGSTNo || '';
      data.customerGstType = data.customerGstType || '';
      data.customerAddress = data.customerAddress || '';
      data.customerPhoneNo = data.customerPhoneNo || '';
      data.customerCity = data.customerCity || '';
      data.customerEmailId = data.customerEmailId || '';
      data.customerPincode = data.customerPincode || '';
      data.customerState = data.customerState || '';
      data.customerCountry = data.customerCountry || '';
      data.customerTradeName = data.customerTradeName || '';
      data.customerLegalName = data.customerLegalName || '';
      data.customerRegistrationNumber = data.customerRegistrationNumber || '';
      data.customerPanNumber = data.customerPanNumber || '';
      data.aadharNumber = data.aadharNumber || '';
      data.customerDob = data.customerDob || '';
      data.customerAnniversary = data.customerAnniversary || '';
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.isSyncedToServer = data.isSyncedToServer || false;
      data.notes = data.notes || '';
      data.schemeOrderType = data.schemeOrderType || 'open';

      return data;
    }

    defaultValues() {
      return {
        id: '',
        sequenceNumber: '',
        date: '',
        type: '',
        period: 0,
        depositAmount: 0,
        discountContribution: 0,
        total: 0,
        balance: 0,
        linkedTxnList: [],
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        isSyncedToServer: false,
        posId: 0,
        customerId: '',
        customerName: '',
        customerGSTNo: '',
        customerGstType: '',
        customerAddress: '',
        customerPhoneNo: '',
        customerCity: '',
        customerEmailId: '',
        customerPincode: '',
        customerState: '',
        customerCountry: '',
        customerTradeName: '',
        customerLegalName: '',
        customerRegistrationNumber: '',
        customerPanNumber: '',
        aadharNumber: '',
        customerDob: '',
        customerAnniversary: '',
        notes: '',
        schemeOrderType: 'open'
      };
    }
  }