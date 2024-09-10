export default class AddOnsGroup {
    convertTypes(data) {
      data.groupId = data.groupId || '';
      data.groupName = data.groupName || '';
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.posId = parseFloat(data.posId) || 0;
      data.isSyncedToServer = Boolean(data.isSyncedToServer);

      return data;
    }
  
    getDefaultValues() {
      return {
        groupId: '',
        groupName: '',
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        posId: 0,
        isSyncedToServer: false
      };
    }
  }
  