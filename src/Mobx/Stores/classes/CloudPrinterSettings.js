export default class CloudPrinterSettings {
    convertTypes(data) {
      data.id = data.id || '';
      data.posId = data.posId || 0;
      data.deviceName = data.deviceName || '';
      data.cloudPrinterSelected = data.cloudPrinterSelected || '';
      data.enableMessageReceive = Boolean(data.enableMessageReceive);
      data.enableMessageSend = Boolean(data.enableMessageSend);
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.playerId = data.playerId || '';
      return data;
    }
  
    defaultValues() {
      return {
        id: '',
        posId: 0,
        deviceName: '',
        cloudPrinterSelected: '',
        enableMessageReceive: false,
        enableMessageSend: false,
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        playerId: ''
      };
    }
  }