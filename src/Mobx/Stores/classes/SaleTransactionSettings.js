export default class SaleTransactionSettings {
  defaultValues() {
    return {
      businessId: '',
      businessCity: '',
      updatedAt: 0,
      posId: 0,
      billTitle: '',
      updateRawMaterialsStock: false,
      enableTDS: false,
      enableTCS: false,
      enableShipTo: false,
      enableSalesMan: false,
      enableNegativeStockAlert: false,
      terms: '',
      menuType: '',
      enableExport: false,
      enableBuyerOtherThanConsignee: false,
      enableOnTxn: {
        productLevel: [],
        billLevel: []
      },
      displayOnBill: {
        productLevel: [],
        billLevel: []
      }
    };
  }
}