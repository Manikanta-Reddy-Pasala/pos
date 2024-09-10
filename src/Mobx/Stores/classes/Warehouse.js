export default class Warehouse {
  
    convertTypes(data) {
      data.id = data.id || '';
      data.name = data.name || '';
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.isSyncedToServer = data.isSyncedToServer || false;

      return data;
    }

    getDefaultValues() {
      return {
        id: '',
        name: '',
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        isSyncedToServer: false
      };
    }
  }