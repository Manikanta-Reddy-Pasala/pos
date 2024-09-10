export default class AddOnsGroup {
    convertTypes(data) {
      data.additionalPropertyId = data.additionalPropertyId || '';
      data.name = data.name || '';
      data.price = parseFloat(data.price) || 0;
      data.type = data.type || '';
      data.offline = Boolean(data.offline);
      data.cgst = parseFloat(data.cgst) || 0;
      data.sgst = parseFloat(data.sgst) || 0;
      data.igst = parseFloat(data.igst) || 0;
      data.cess = parseFloat(data.cess) || 0;
      data.taxType = parseFloat(data.taxType) || '';
      data.taxIncluded = Boolean(data.taxIncluded);
      data.groupName = data.groupName || '';
      data.groupId = data.groupId || ''
      data.purchasedPrice = parseFloat(data.purchasedPrice) || 0;
      data.productId = data.productId || '';
      data.description = data.description || '';
      data.batchId = data.batchId || 0;
      data.brandName = data.brandName || '';
      data.categoryLevel2 = data.categoryLevel2 || '';
      data.categoryLevel2DisplayName = data.categoryLevel2DisplayName || '';
      data.categoryLevel3 = data.categoryLevel3 || '';
      data.categoryLevel3DisplayName = data.categoryLevel3DisplayName || '';
      data.stockQty = parseFloat(data.stockQty) || 0;
      data.hsn = data.hsn || '';
      data.barcode = data.barcode || '';
      data.updatedAt = Number(data.updatedAt);
      data.businessId = data.businessId || '';
      data.businessCity = data.businessCity || '';
      data.posId = parseFloat(data.posId) || 0;
      data.isSyncedToServer = Boolean(data.isSyncedToServer); 

      return data;
    }
  
    getDefaultValues() {
      return {
        additionalPropertyId: '',
        name: '',
        price: 0,
        type: '',
        offline: false,
        cgst: 0,
        sgst: 0,
        igst: 0,
        cess: 0,
        taxType: '',
        taxIncluded: true,
        groupName: '',
        groupId: '',
        purchasedPrice: 0,
        productId: '',
        description: '',
        batchId: 0,
        brandName: '',
        categoryLevel2: '',
        categoryLevel2DisplayName: '',
        categoryLevel3: '',
        categoryLevel3DisplayName: '',
        stockQty: 0,
        hsn: '',
        barcode: '',
        updatedAt: Date.now(),
        businessId: '',
        businessCity: '',
        isSyncedToServer: false
      };
    }
  }
  