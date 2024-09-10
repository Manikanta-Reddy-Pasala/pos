export default class AccountingNotes {
    convertTypes(data) {
      data.id = data.id || '';
      data.posId = data.posId || 0;
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.isSyncedToServer = data.isSyncedToServer || false;
      data.date = data.date || '';
      data.partyName = data.partyName || '';
      data.partyId = data.partyId || '';
      data.partyGstNo = data.partyGstNo || '';
      data.partyPhoneNo = data.partyPhoneNo || '';
      data.notes = data.notes || '';
      return data;
    }
  
    defaultValues() {
      return {
        id: '',
        posId: 0,
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        isSyncedToServer: false,
        date: '',
        partyName: '',
        partyId: '',
        partyGstNo: '',
        partyPhoneNo: '',
        notes: ''
      };
    }
  }