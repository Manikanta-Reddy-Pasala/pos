import Unit from './Unit';

export default class RawMaterialListData {
  convertTypes(data) {
    data.product_id = parseInt(data.product_id) || '';
    data.description = data.description || '';
    data.batch_id = parseInt(data.batch_id) || 0;
    data.cgst = parseFloat(data.cgst) || 0;
    data.sgst = parseFloat(data.sgst) || 0;
    data.igst = parseFloat(data.igst) || 0;
    data.cess = parseFloat(data.cess) || 0;
    data.taxType = data.taxType || '';
    data.igst_amount = parseFloat(data.igst_amount) || 0;
    data.cgst_amount = parseFloat(data.cgst_amount) || 0;
    data.sgst_amount = parseFloat(data.sgst_amount) || 0;
    data.taxIncluded = data.taxIncluded || true;
    data.discount_percent = parseFloat(data.discount_percent) || 0;
    data.discount_amount = parseFloat(data.discount_amount) || 0;
    data.discount_amount_per_item =
      parseFloat(data.discount_amount_per_item) || 0;
    data.discount_type = data.discount_type || '';
    data.brandName = data.brandName || '';
    data.categoryLevel2 = data.categoryLevel2 || '';
    data.categoryLevel2DisplayName = data.categoryLevel2DisplayName || '';
    data.categoryLevel3 = data.categoryLevel3 || '';
    data.categoryLevel3DisplayName = data.categoryLevel3DisplayName || '';
    data.item_name = data.item_name || '';
    data.qty = parseFloat(data.qty) || 0;
    data.purchased_price = parseFloat(data.purchased_price) || 0;
    data.purchased_price_before_tax =
      parseFloat(data.purchased_price_before_tax) || 0;
    data.estimate = parseFloat(data.estimate) || 0;
    data.hsn = data.hsn || '';
    data.barcode = data.barcode || '';
    data.sku = data.sku || '';
    data.isEdit = data.isEdit || true;
    data.unitConversionQty = parseFloat(data.unitConversionQty) || 0;
    data.freeQty = parseFloat(data.freeQty) || 0;
    data.stockQty = parseFloat(data.stockQty) || 0;
    data.freeStockQty = parseFloat(data.freeStockQty) || 0;
    data.qtyUnit = data.qtyUnit || '';
    data.primaryUnit = data.primaryUnit || null;
    data.secondaryUnit = data.secondaryUnit || null;
    data.units = data.units || [];
    data.originalPurchasePriceWithoutConversionQty =
      parseFloat(data.originalPurchasePriceWithoutConversionQty) || 0;
    data.mfDate = data.mfDate || null;
    data.expiryDate = data.expiryDate || null;
    data.rack = data.rack || '';
    data.warehouseData = data.warehouseData || '';

    return data;
  }

  defaultValues() {
    return {
      product_id: '',
      description: '',
      batch_id: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      taxType: '',
      igst_amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      taxIncluded: true,
      discount_percent: 0,
      discount_amount: 0,
      discount_amount_per_item: 0,
      discount_type: '',
      brandName: '',
      categoryLevel2: '',
      categoryLevel2DisplayName: '',
      categoryLevel3: '',
      categoryLevel3DisplayName: '',
      item_name: '',
      qty: 0,
      purchased_price: 0,
      purchased_price_before_tax: 0,
      estimate: 0,
      hsn: '',
      barcode: '',
      sku: '',
      isEdit: true,
      unitConversionQty: 0,
      freeQty: 0,
      stockQty: 0,
      freeStockQty: 0,
      qtyUnit: '',
      primaryUnit: new Unit().defaultValues(),
      secondaryUnit: new Unit().defaultValues(),
      units: [],
      originalPurchasePriceWithoutConversionQty: 0,
      mfDate: null,
      expiryDate: null,
      rack: '',
      warehouseData: ''
    };
  }
}