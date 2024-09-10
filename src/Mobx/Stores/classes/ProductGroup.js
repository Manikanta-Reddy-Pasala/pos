export default class ProductGroup {
    defaultValues() {
      return {
        groupName: '',
        groupId: '',
        itemList: [],
        subTotal: 0,
        total: 0,
        updatedAt: 0,
        businessId: '',
        businessCity: '',
        isSyncedToServer: false
      };
    }
  
    convertTypes(data) {
      data.groupName = data.groupName || '';
      data.groupId = data.groupId || '';
      data.itemList = data.itemList || [];
      data.subTotal = parseFloat(data.subTotal) || 0;
      data.total = parseFloat(data.total) || 0;
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.isSyncedToServer = data.isSyncedToServer || '';

      return data;
    }
  }
  