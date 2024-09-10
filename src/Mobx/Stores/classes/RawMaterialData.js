export default class RawMaterialData {
  defaultValues() {
    return {
      rawMaterialList: [],
      subTotal: 0,
      total: 0,
      directExpenses: []
    };
  }

  convertTypes(data) {
    data.rawMaterialList = data.rawMaterialList || [];
    data.subTotal = parseFloat(data.subTotal) || 0;
    data.total = parseFloat(data.total) || 0;
    data.directExpenses = data.directExpenses || [];

    return data;
  }
}