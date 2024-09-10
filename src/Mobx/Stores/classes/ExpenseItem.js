export default class ExpenseItem {
  defaultValues() {
    return {
      index: 1,
      item: '',
      quantity: 0,
      amount: 0,
      price: 0,
      price_before_tax: 0,
      isEdit: true,
      hsn: '',
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      taxType: '',
      igst_amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      taxIncluded: false,
      discountPercent: 0,
      discountAmount: 0,
      discount_amount_per_item: 0,
      discountType: '',
      freeQty: 0,
      originalDiscountPercent: 0
    };
  }

  convertTypes(data) {
    this.index = data.index || 1;
    this.item = data.item || '';
    this.quantity = data.quantity || 0;
    this.amount = data.amount || 0;
    this.price = data.price || 0;
    this.price_before_tax = data.price_before_tax || 0;
    this.isEdit = data.isEdit || true;
    this.hsn = data.hsn || '';
    this.cgst = data.cgst || 0;
    this.sgst = data.sgst || 0;
    this.igst = data.igst || 0;
    this.cess = data.cess || 0;
    this.taxType = data.taxType || '';
    this.igst_amount = data.igst_amount || 0;
    this.cgst_amount = data.cgst_amount || 0;
    this.sgst_amount = data.sgst_amount || 0;
    this.taxIncluded = data.taxIncluded || false;
    this.discountPercent = data.discountPercent || 0;
    this.discountAmount = data.discountAmount || 0;
    this.discount_amount_per_item = data.discount_amount_per_item || 0;
    this.discountType = data.discountType || '';
    this.freeQty = data.freeQty || 0;
    this.originalDiscountPercent = data.originalDiscountPercent || 0;

    return data;
  }
}