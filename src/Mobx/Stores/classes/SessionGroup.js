const sessionNotes =  {
    imageUrl: [],
    message: ''
  }

const list = [
  {
      sessionDate: '',
      doctorName: '',
      doctorPhoneNo: '',
      doctorId: '',
      sessionStartTime: '',
      sessionEndTime: '',
      sessionNotes: sessionNotes,
      status: 'pending',
      sessionId: 0,
      amount: 0,
      saleDetail: {
        saleId: '',
        sequenceNumber: '',
        saleDate: '',
      }
  }
]

export default class SessionGroup {
    convertTypes(data) {
      data.sessionGroupId = data.sessionGroupId || '';
      data.posId = data.posId || 0;
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
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
      data.customerAadharNumber = data.customerAadharNumber || '';
      data.date = data.date || '';
      data.sessionList = data.sessionList || '';
      data.noOfSession = data.noOfSession || 0;
      data.totalAmount = data.totalAmount || 0;
      data.perSession = data.perSession || false;
      data.amount = data.amount || 0;
      return data;
    }
  
    defaultValues() {
      return {
        sessionGroupId: '',
        posId: 0,
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
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
        customerAadharNumber: '',
        sessionList: list,
        date: '',
        noOfSession: 0,
        totalAmount: 0,
        amount: 0,
        perSession: false,
      };
    }

    sessionListdefaultValues() {
       return {
        sessionDate: '',
        doctorName: '',
        doctorPhoneNo: '',
        doctorId: '',
        sessionStartTime: '',
        sessionEndTime: '',
        sessionNotes: sessionNotes,
        status: 'pending',
        sessionId: '',
        amount: 0,
        saleDetail: {
          saleId: '',
          sequenceNumber: '',
          saleDate: '',
        }
        }
    }
  }