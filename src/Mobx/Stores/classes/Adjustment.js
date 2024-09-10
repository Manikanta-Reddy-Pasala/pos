export default class Adjustment {
  defaultValues(value) {
    return {
      id: 0,
      adjustedDate: new Date(),
      purchasedPrice: 0,
      oldQty: 0,
      newQty: 0,
      qty: 0,
      reason: '',
      vendor: '',
      vendorPhoneNumber: '',
      batchNumber: '',
      adjustedType: value || ''
    };
  }

  convertTypes(data) {
    data.id = parseFloat(data.id) || 0;
    data.purchasedPrice = parseFloat(data.purchasedPrice) || 0;
    data.oldQty = parseFloat(data.oldQty) || 0;
    data.newQty = parseFloat(data.newQty) || 0;
    data.qty = parseFloat(data.qty) || 0;

    data.reason = data.reason || '';
    data.adjustedDate = data.adjustedDate || 0;
    data.vendor = data.vendor || '';
    data.vendorPhoneNumber = data.vendorPhoneNumber || '';
    data.batchNumber = data.batchNumber || '';

    return data;
  }
}
