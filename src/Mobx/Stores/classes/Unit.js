export default class Unit {
  convertTypes() {
    this.fullName = this.fullName || '';
    this.shortName = this.shortName || '';
  }

  defaultValues() {
    return {
      fullName: '',
      shortName: ''
    };
  }
}
