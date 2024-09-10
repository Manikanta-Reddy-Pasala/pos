import SequenceNumberItem from './SequenceNumberItem'

export default class TallySequenceNumber {
  
    convertTypes(data) {
      data.posId = data.posId || 0;
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.isSyncedToServer = data.isSyncedToServer || false;
      data.payment = data.payment || new SequenceNumberItem().defaultValues();
      data.receipt = data.receipt || new SequenceNumberItem().defaultValues();
      return data;
    }

    getDefaultValues() {
      return {
        posId: 0,
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        isSyncedToServer: false,
        payment: new SequenceNumberItem().defaultValues(),
        receipt: new SequenceNumberItem().defaultValues()
      };
    }
  }