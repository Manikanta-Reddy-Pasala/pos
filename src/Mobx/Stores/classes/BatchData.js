export default class BatchData {
  convertTypes(data) {
    data.id = parseInt(data.id) || 0;
    data.purchasedPrice = parseFloat(data.purchasedPrice) || 0;
    data.salePrice = parseFloat(data.salePrice) || 0;
    data.offerPrice = parseFloat(data.offerPrice) || 0;
    data.qty = parseFloat(data.qty) || 0;
    data.finalMRPPrice = parseFloat(data.finalMRPPrice) || 0;
    data.freeQty = parseFloat(data.freeQty) || 0;
    data.openingStockQty = parseFloat(data.openingStockQty) || 0;
    data.saleDiscountAmount = parseFloat(data.saleDiscountAmount) || 0;
    data.saleDiscountPercent = parseFloat(data.saleDiscountPercent) || 0;
    data.purchaseDiscountAmount = parseFloat(data.purchaseDiscountAmount) || 0;
    data.purchaseDiscountPercent =
      parseFloat(data.purchaseDiscountPercent) || 0;

    // set default values for empty or null string fields
    data.batchNumber = data.batchNumber || '';
    data.mfDate = data.mfDate || null;
    data.expiryDate = data.expiryDate || null;
    data.rack = data.rack || '';
    data.warehouseData = data.warehouseData || '';
    data.vendorName = data.vendorName || '';
    data.vendorPhoneNumber = data.vendorPhoneNumber || '';
    data.saleDiscountType = data.saleDiscountType || '';
    data.purchaseDiscountType = data.purchaseDiscountType || '';
    data.manufacturingQty = parseFloat(data.manufacturingQty) || 0;
    data.freeManufacturingQty = parseFloat(data.freeManufacturingQty) || 0;
    data.barcode = data.barcode || '';
    data.modelNo = data.modelNo || '';
    data.properties = data.properties || [];

    return data;
  }

  defaultValues() {
    return {
      id: 0,
      batchNumber: '',
      purchasedPrice: 0,
      salePrice: 0,
      offerPrice: 0,
      mfDate: '',
      expiryDate: '',
      qty: 0,
      rack: '',
      warehouseData: '',
      vendorName: '',
      vendorPhoneNumber: '',
      finalMRPPrice: '',
      freeQty: 0,
      openingStockQty: 0,
      saleDiscountAmount: 0,
      saleDiscountPercent: 0,
      saleDiscountType: '',
      purchaseDiscountAmount: 0,
      purchaseDiscountPercent: 0,
      purchaseDiscountType: '',
      manufacturingQty: 0,
      freeManufacturingQty: 0,
      barcode: '',
      modelNo: '',
      properties: []
    };
  }
}