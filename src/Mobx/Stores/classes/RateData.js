export default class RateData {
    convertTypes(data) {
      this.id = data.id || '';
      this.metal = data.metal || '';
      this.purity = data.purity || '';
      this.rateByGram = parseFloat(data.rateByGram) || 0;
    }
  
    defaultValues() {
      return {
        id: '',
        metal: '',
        purity: '',
        rateByGram: 0
      };
    }
}