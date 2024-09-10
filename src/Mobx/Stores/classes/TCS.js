export default class TCS {
  
    convertTypes(data) {
      data.id = data.id || '';
      data.code = data.code || '';
      data.name = data.name || '';
      data.rate = parseFloat(data.rate) || 0;
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.isSyncedToServer = data.isSyncedToServer || false;

      return data;
    }

    getDefaultValues() {
      return {
        id: '',
        code: '',
        name: '',
        rate: 0,
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        isSyncedToServer: false
      };
    }
  }