class Gstr1ErrorObj {
  constructor(
    sequenceNumber,
    invoiceNumber,
    date,
    total,
    balance,
    customerName,
    gstNumber,
    paymentType,
    placeOfSupply,
    errorReason,
    taxableValue,
    type
  ) {
    this.sequenceNumber = sequenceNumber;
    this.invoiceNumber = invoiceNumber;
    this.date = date;
    this.total = total;
    this.balance = balance;
    this.customerName = customerName;
    this.gstNumber = gstNumber;
    this.paymentType = paymentType;
    this.placeOfSupply = placeOfSupply;
    this.errorReason = errorReason;
    this.taxableValue = taxableValue;
    this.type = type;
  }

  static createGstr1ErrorObject(
    sequenceNumber,
    invoiceNumber,
    date,
    total,
    balance,
    customerName,
    gstNumber,
    paymentType,
    placeOfSupply,
    errorReason,
    taxableValue,
    type
  ) {
    return new Gstr1ErrorObj(
      sequenceNumber,
      invoiceNumber,
      date,
      total,
      balance,
      customerName,
      gstNumber,
      paymentType,
      placeOfSupply,
      errorReason,
      taxableValue,
      type
    );
  }
}

export default Gstr1ErrorObj;
