import Unit from './Unit';

export default class ProductGroupItemList {
  convertTypes(data) {
    data.product_id = parseInt(data.product_id) || '';
    data.description = data.description || '';
    data.imageUrl = data.description || '';
    data.batch_id = parseInt(data.batch_id) || '';
    data.item_name = data.item_name || '';
    data.sku = data.sku || '';
    data.barcode = data.barcode || '';
    data.mrp = parseFloat(data.mrp) || 0;
    data.purchased_price = parseFloat(data.purchased_price) || 0;
    data.offer_price = parseFloat(data.offer_price) || 0;
    data.mrp_before_tax = parseFloat(data.mrp_before_tax) || 0;
    data.size= parseFloat(data.size) || 0;
    data.qty= parseFloat(data.qty) || 0;
    data.freeQty= parseFloat(data.freeQty) || 0;
    data.freeStockQty= parseFloat(data.freeStockQty) || 0;
    data.cgst= parseFloat(data.cgst) || 0;
    data.sgst= parseFloat(data.sgst) || 0;
    data.igst= parseFloat(data.igst) || 0;
    data.cess= parseFloat(data.cess) || 0;
    data.taxType = data.taxType || '';
    data.igst_amount= parseFloat(data.igst_amount) || 0;
    data.cgst_amount= parseFloat(data.cgst_amount) || 0;
    data.sgst_amount= parseFloat(data.sgst_amount) || 0;
    data.taxIncluded = data.taxIncluded || true;
    data.discount_percent= parseFloat(data.discount_percent) || 0;
    data.discount_amount= parseFloat(data.discount_amount) || 0;
    data.discount_amount_per_item= parseFloat(data.discount_amount_per_item) || 0;
    data.discount_type = data.discount_type || '';
    data.amount= parseFloat(data.amount) || 0;
    data.roundOff= parseFloat(data.roundOff) || 0;
    data.isEdit = data.isEdit || false;
    data.stockQty= parseFloat(data.stockQty) || 0;
    data.vendorName = data.vendorName || '';
    data.vendorPhoneNumber = data.vendorPhoneNumber || '';
    data.brandName = data.brandName || '';
    data.categoryLevel2 = data.categoryLevel2 || '';
    data.categoryLevel2DisplayName = data.categoryLevel2DisplayName || '';
    data.categoryLevel3 = data.categoryLevel3 || '';
    data.categoryLevel3DisplayName = data.categoryLevel3DisplayName || '';
    data.wastagePercentage = data.wastagePercentage || '';
    data.wastageGrams = data.wastageGrams || '';
    data.grossWeight = data.grossWeight || '';
    data.netWeight = data.netWeight || '';
    data.purity = data.purity || '';
    data.hsn = data.hsn || '';
    data.makingChargePercent= parseFloat(data.makingChargePercent) || 0;
    data.makingChargeAmount= parseFloat(data.makingChargeAmount) || 0;
    data.makingChargePerGramAmount= parseFloat(data.makingChargePerGramAmount) || 0;
    data.makingChargeType = data.makingChargeType || '';
    data.serialOrImeiNo = data.serialOrImeiNo || '';
    data.finalMRPPrice= parseFloat(data.finalMRPPrice) || 0;
    data.makingChargeIncluded= data.makingChargeIncluded || false;
    data.qtyUnit= data.qtyUnit || '';
    data.primaryUnit= data.primaryUnit || null;
    data.secondaryUnit= data.secondaryUnit || null;
    data.unitConversionQty= parseFloat(data.unitConversionQty) || 0;
    data.units= data.units || [];
    data.originalMrpWithoutConversionQty = parseFloat(data.originalMrpWithoutConversionQty) || 0;
    data.mfDate= data.mfDate || null;
    data.expiryDate= data.expiryDate || null;
    data.rack= data.rack || null;
    data.warehouseData= data.warehouseData || '';
    data.batchNumber= data.batchNumber || '';
    data.modelNo= data.modelNo || '';
    data.pricePerGram= parseFloat(data.pricePerGram) || 0;
    data.stoneWeight= parseFloat(data.stoneWeight) || 0;
    data.stoneCharge= parseFloat(data.stoneCharge) || 0;
    data.itemNumber= parseFloat(data.itemNumber) || 0;
    data.originalDiscountPercent= parseFloat(data.originalDiscountPercent) || 0;
    
    return data;
  }

  defaultValues() {
    return {
      product_id: '',
      description: '',
      imageUrl: '',
      batch_id: 0,
      item_name: '',
      sku: '',
      barcode: '',
      mrp: 0,
      purchased_price: 0,
      offer_price: 0,
      mrp_before_tax: 0,
      size: 0,
      qty: 0,
      freeQty: 0,
      freeStockQty: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      taxType: '',
      igst_amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      taxIncluded: false,
      discount_percent: 0,
      discount_amount: 0,
      discount_amount_per_item: 0,
      discount_type: '',
      amount: 0,
      roundOff: 0,
      isEdit: true,
      stockQty: 0,
      vendorName: '',
      vendorPhoneNumber: '',
      brandName: '',
      categoryLevel2: '',
      categoryLevel2DisplayName: '',
      categoryLevel3: '',
      categoryLevel3DisplayName: '',
      wastagePercentage: '',
      wastageGrams: '',
      grossWeight: '',
      netWeight: '',
      purity: '',
      hsn: '',
      makingChargePercent: 0,
      makingChargeAmount: 0,
      makingChargePerGramAmount: 0,
      makingChargeType: '',
      serialOrImeiNo: '',
      finalMRPPrice: 0,
      makingChargeIncluded: false,
      qtyUnit: '',
      primaryUnit: null,
      secondaryUnit: null,
      unitConversionQty: 0,
      units: [],
      originalMrpWithoutConversionQty: 0,
      mfDate: null,
      expiryDate: null,
      rack: '',
      warehouseData: '',
      batchNumber: '',
      modelNo: '',
      pricePerGram: 0,
      stoneWeight: 0,
      stoneCharge: 0,
      itemNumber: 0,
      originalDiscountPercent: 0
    };
  }
}