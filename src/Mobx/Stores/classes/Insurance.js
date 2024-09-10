export default class Insurance {
  defaultValues() {
    return {
      amount: 0,
      percent: 0,
      type: 'amount',
      policyNo: '',
      cgst: 0,
      sgst: 0,
      igst: 0,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      amountOtherCurrency: 0
    };
  }
}