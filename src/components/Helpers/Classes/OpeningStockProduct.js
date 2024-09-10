class OpeningStockProduct {
  constructor(name, productId, openingStockValue,salePrice,purchasedPrice) {
    this._name = String(name);
    this._productId = String(productId);
    this._openingStockValue = parseFloat(openingStockValue);
    this._salePrice = parseFloat(salePrice);
    this._purchasedPrice = parseFloat(purchasedPrice);
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (typeof value !== 'string') throw new TypeError('Name must be a string');
    this._name = value;
  }

  get productId() {
    return this._productId;
  }

  set productId(value) {
    if (typeof value !== 'string')
      throw new TypeError('Product ID must be a string');
    this._productId = value;
  }

  get openingStockValue() {
    return this._openingStockValue;
  }

  set openingStockValue(value) {
    if (typeof value !== 'number') {
      value = parseFloat(value);
    }
    this._openingStockValue = value;
  }
  get salePrice() {
    return this._salePrice;
  }

  set salePrice(value) {
    if (typeof value !== 'number') {
      value = parseFloat(value);
    }
    this._salePrice = value;
  }
  get purchasedPrice() {
    return this._purchasedPrice;
  }

  set purchasedPrice(value) {
    if (typeof value !== 'number') {
      value = parseFloat(value);
    }
    this._purchasedPrice = value;
  }
  
}

export default OpeningStockProduct;
