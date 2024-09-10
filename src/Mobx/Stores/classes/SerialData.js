export default class SerialData {
    convertTypes(data) {
      data.serialImeiNo = data.serialImeiNo || '';
      data.soldStatus = data.soldStatus || false;
      data.purchased = data.purchased || false;
      data.purchaseReturn = data.purchaseReturn || false;
      data.replacement = data.replacement || false;
      return data;
    }
  
    defaultValues() {
      return {
        serialImeiNo: '',
        soldStatus: false,
        purchased: false,
        purchaseReturn: false,
        replacement: false
      };
    }
  }