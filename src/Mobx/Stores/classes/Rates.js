export default class Rates {
  convertTypes(data) {
    this.id = data.id || '';
    this.metal = data.metal || '';
    this.purity = data.purity || '';
    this.rateByGram = parseFloat(data.rateByGram) || 0;
    this.updatedAt = Number(data.updatedAt);
    this.businessId = data.businessId || '';
    this.businessCity = data.businessCity || '';
    this.defaultBool = Boolean(data.defaultBool);
    this.isSyncedToServer = Boolean(data.isSyncedToServer);
  }

  getDefaultValues() {
    return {
      id: '',
      metal: '',
      purity: '',
      rateByGram: 0,
      updatedAt: Date.now(),
      businessId: '',
      businessCity: '',
      defaultBool: false,
      isSyncedToServer: false
    };
  }
}
