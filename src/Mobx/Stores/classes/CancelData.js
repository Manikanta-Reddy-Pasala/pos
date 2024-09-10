export default class CancelData {
  convertTypes(data) {
    data.id = data.id || '';
    data.transactionId = data.transactionId || '';
    data.sequenceNumber = data.sequenceNumber || '';
    data.transactionType = data.transactionType || '';
    data.createdDate = data.createdDate || '';
    data.deletedDate = data.deletedDate || '';
    data.deletedBy = data.deletedBy || '';
    data.businessId = data.businessId || '';
    data.businessCity = data.businessCity || '';
    data.total = parseFloat(data.total) || 0;
    data.balance = parseFloat(data.balance) || 0;
    data.updatedAt = Number(data.updatedAt);
    data.posId = parseFloat(data.posId) || 0;
    data.restored = data.restored || false;
    data.gstNumber = data.gstNumber || '';
    data.irn = data.irn || '';
    return data;
  }

  getDefaultValues() {
    return {
      id: '',
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      deletedDate: '',
      deletedBy: '',
      businessId: '',
      businessCity: '',
      total: 0,
      balance: 0,
      updatedAt: Date.now(),
      posId: 0,
      restored: false,
      gstNumber: '',
      irn: ''
    };
  }
}