export default class ReportSettings {
  convertTypes(data) {
    data.updatedAt = Number(data.updatedAt);
    data.businessId = data.businessId || '';
    data.businessCity = data.businessCity || '';
    data.posId = data.posId || 0;
    data.reportsList = data.reportsList || [];

    return data;
  }

  getDefaultValues() {
    return {
      businessId: '',
      businessCity: '',
      updatedAt: 0,
      posId: 0,
      reportsList: []
    };
  }
}