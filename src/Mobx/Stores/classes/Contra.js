export default class Contra {
  convertTypes(data) {
    data.contraId = data.contraId || '';
    data.date = data.date || '';
    data.sequenceNumber = data.sequenceNumber || '';
    data.from = data.from || '';
    data.to = data.to || '';
    data.debit = parseFloat(data.debit) || 0;
    data.credit = parseFloat(data.credit) || 0;
    data.updatedAt = Number(data.updatedAt);
    data.businessId = data.businessId || '';
    data.businessCity = data.businessCity || '';
    data.isSyncedToServer = data.isSyncedToServer || false;
    data.splitPaymentList = data.splitPaymentList || [];
    data.paymentType = data.paymentType || 'cash';
    data.bankAccountName = data.bankAccountName || '';
    data.bankAccountId = data.bankAccountId || '';
    data.bankPaymentType = data.bankPaymentType || '';
    return data;
  }

  getDefaultValues() {
    return {
      contraId: '',
      date: '',
      sequenceNumber: '',
      from: '',
      to: '',
      debit: 0,
      credit: 0,
      updatedAt: Date.now(),
      businessId: '',
      businessCity: '',
      isSyncedToServer: false,
      paymentType: 'cash',
      bankAccountName: '',
      bankAccountId: '',
      bankPaymentType: '',
      splitPaymentList: []
    };
  }
}