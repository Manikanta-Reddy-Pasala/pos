import * as Db from 'src/RxDb/Database/Database';

export const getDataByTaxSplit = async (_data) => {

        let listOfPaymentInData = [];
        let paymentsMap = new Map();

        //0,3,5,12,18,28

        let taxable_zero = 0;
        let cgst_amount_zero = 0;
        let sgst_amount_zero = 0;
        let igst_amount_zero = 0;

        let taxable_three = 0;
        let cgst_amount_three = 0;
        let sgst_amount_three = 0;
        let igst_amount_three = 0;

        let taxable_five = 0;
        let cgst_amount_five = 0;
        let sgst_amount_five = 0;
        let igst_amount_five = 0;

        let taxable_twelve = 0;
        let cgst_amount_twelve = 0;
        let sgst_amount_twelve = 0;
        let igst_amount_twelve = 0;

        let taxable_eighteen = 0;
        let cgst_amount_eighteen = 0;
        let sgst_amount_eighteen = 0;
        let igst_amount_eighteen = 0;

        let taxable_twenty_eight = 0;
        let cgst_amount_twenty_eight = 0;
        let sgst_amount_twenty_eight = 0;
        let igst_amount_twenty_eight = 0;

        for (let product of _data.item_list) {
          let finalAmount =
            parseFloat(product.amount) -
            (parseFloat(product.cgst_amount) +
              parseFloat(product.sgst_amount) +
              parseFloat(product.igst_amount) +
              parseFloat(product.cess));

          if (
            parseFloat(product.cgst) +
              parseFloat(product.sgst) +
              parseFloat(product.igst) ===
            0
          ) {
            taxable_zero +=
              Math.round((finalAmount + Number.EPSILON) * 100) / 100;
            cgst_amount_zero +=
              Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
            sgst_amount_zero +=
              Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
            igst_amount_zero +=
              Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
          }

          if (
            parseFloat(product.cgst) +
              parseFloat(product.sgst) +
              parseFloat(product.igst) ===
            3
          ) {
            taxable_three +=
              Math.round((finalAmount + Number.EPSILON) * 100) / 100;
            cgst_amount_three +=
              Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
            sgst_amount_three +=
              Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
            igst_amount_three +=
              Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
          }

          if (
            parseFloat(product.cgst) +
              parseFloat(product.sgst) +
              parseFloat(product.igst) ===
            5
          ) {
            taxable_five +=
              Math.round((finalAmount + Number.EPSILON) * 100) / 100;
            cgst_amount_five +=
              Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
            sgst_amount_five +=
              Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
            igst_amount_five +=
              Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
          }

          if (
            parseFloat(product.cgst) +
              parseFloat(product.sgst) +
              parseFloat(product.igst) ===
            12
          ) {
            taxable_twelve +=
              Math.round((finalAmount + Number.EPSILON) * 100) / 100;
            cgst_amount_twelve +=
              Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
            sgst_amount_twelve +=
              Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
            igst_amount_twelve +=
              Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
          }

          if (
            parseFloat(product.cgst) +
              parseFloat(product.sgst) +
              parseFloat(product.igst) ===
            18
          ) {
            taxable_eighteen +=
              Math.round((finalAmount + Number.EPSILON) * 100) / 100;
            cgst_amount_eighteen +=
              Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
            sgst_amount_eighteen +=
              Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
            igst_amount_eighteen +=
              Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
          }

          if (
            parseFloat(product.cgst) +
              parseFloat(product.sgst) +
              parseFloat(product.igst) ===
            28
          ) {
            taxable_twenty_eight +=
              Math.round((finalAmount + Number.EPSILON) * 100) / 100;
            cgst_amount_twenty_eight +=
              Math.round((product.cgst_amount + Number.EPSILON) * 100) / 100;
            sgst_amount_twenty_eight +=
              Math.round((product.sgst_amount + Number.EPSILON) * 100) / 100;
            igst_amount_twenty_eight +=
              Math.round((product.igst_amount + Number.EPSILON) * 100) / 100;
          }
        }

        _data['taxable_zero'] = parseFloat(taxable_zero.toFixed(2));
        _data['cgst_amount_zero'] = parseFloat(cgst_amount_zero.toFixed(2));
        _data['sgst_amount_zero'] = parseFloat(sgst_amount_zero.toFixed(2));
        _data['igst_amount_zero'] = parseFloat(igst_amount_zero.toFixed(2));

        _data['taxable_three'] = parseFloat(taxable_three.toFixed(2));
        _data['cgst_amount_three'] = parseFloat(cgst_amount_three.toFixed(2));
        _data['sgst_amount_three'] = parseFloat(sgst_amount_three.toFixed(2));
        _data['igst_amount_three'] = parseFloat(igst_amount_three.toFixed(2));

        _data['taxable_five'] = parseFloat(taxable_five.toFixed(2));
        _data['cgst_amount_five'] = parseFloat(cgst_amount_five.toFixed(2));
        _data['sgst_amount_five'] = parseFloat(sgst_amount_five.toFixed(2));
        _data['igst_amount_five'] = parseFloat(igst_amount_five.toFixed(2));

        _data['taxable_twelve'] = parseFloat(taxable_twelve.toFixed(2));
        _data['cgst_amount_twelve'] = parseFloat(
          cgst_amount_twelve.toFixed(2)
        );
        _data['sgst_amount_twelve'] = parseFloat(
          sgst_amount_twelve.toFixed(2)
        );
        _data['igst_amount_twelve'] = parseFloat(
          igst_amount_twelve.toFixed(2)
        );

        _data['taxable_eighteen'] = parseFloat(taxable_eighteen.toFixed(2));
        _data['cgst_amount_eighteen'] = parseFloat(
          cgst_amount_eighteen.toFixed(2)
        );
        _data['sgst_amount_eighteen'] = parseFloat(
          sgst_amount_eighteen.toFixed(2)
        );
        _data['igst_amount_eighteen'] = parseFloat(
          igst_amount_eighteen.toFixed(2)
        );

        _data['taxable_twenty_eight'] = parseFloat(
          taxable_twenty_eight.toFixed(2)
        );
        _data['cgst_amount_twenty_eight'] = parseFloat(
          cgst_amount_twenty_eight.toFixed(2)
        );
        _data['sgst_amount_twenty_eight'] = parseFloat(
          sgst_amount_twenty_eight.toFixed(2)
        );
        _data['igst_amount_twenty_eight'] = parseFloat(
          igst_amount_twenty_eight.toFixed(2)
        );

        _data['creditNote'] = 0;

        if (_data.linkedTxnList) {
          for (let linkedTxn of _data.linkedTxnList) {
            let tableName = '';
            switch (linkedTxn.paymentType) {
              case 'Payment In':
                tableName = 'paymentin';
                break;
              case 'Sales Return':
                tableName = 'salesreturn';
                break;
              default:
                return null;
            }

            if (tableName !== null) {
              const response = await getLinkedData(
                linkedTxn.linkedId,
                tableName
              );
              linkedTxn.splitPaymentList = response.splitPaymentList;
              linkedTxn.bankAccount = response.bankAccount;
              if ('Payment In' === linkedTxn.paymentType) {
                linkedTxn.paymentType = response.paymentType;
                linkedTxn.total = response.total;
              } else if ('Sales Return' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Sales Return';
                linkedTxn.total = response.total_amount;
              } else if ('Purchases' === linkedTxn.paymentType) {
                linkedTxn.paymentType = 'Purchases';
                linkedTxn.total = response.total_amount;
              } else if (
                'Opening Payable Balance' === linkedTxn.paymentType
              ) {
                linkedTxn.paymentType = 'Opening Balance';
                linkedTxn.total = response.amount;
              }

              listOfPaymentInData.push(linkedTxn);
            }
          }
        }

        if (_data.payment_type === 'Split') {
          for (let payment of _data.splitPaymentList) {
            if (payment.amount > 0 && payment.paymentType === 'Cash') {
              paymentsMap.set('CASH', payment.amount);
            }
            if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
              paymentsMap.set('GIFT CARD', payment.amount);
            }
            if (
              payment.amount > 0 &&
              payment.paymentType === 'Custom Finance'
            ) {
              paymentsMap.set('CUSTOM FINANCE', payment.amount);
            }
            if (payment.amount > 0 && payment.paymentType === 'Exchange') {
              paymentsMap.set('EXCHANGE', payment.amount);
            }

            if (
              payment.paymentMode === 'UPI' ||
              payment.paymentMode === 'Internet Banking' ||
              payment.paymentMode === 'Credit Card' ||
              payment.paymentMode === 'Debit Card' ||
              payment.paymentMode === 'Cheque'
            ) {
              let mode = '';
              switch (payment.paymentMode) {
                case 'UPI':
                  mode = 'UPI';
                  break;
                case 'Internet Banking':
                  mode = 'NEFT/RTGS';
                  break;
                case 'Credit Card':
                  mode = 'CREDIT CARD';
                  break;
                case 'Debit Card':
                  mode = 'DEBIT CARD';
                  break;
                case 'Cheque':
                  mode = 'CHEQUE';
                  break;
                default:
                  return '';
              }

              if (paymentsMap.has(mode)) {
                paymentsMap.set(mode, paymentsMap.get(mode) + payment.amount);
              } else {
                paymentsMap.set(mode, payment.amount);
              }
            }
          }
        } else if (
          _data.payment_type === 'cash' ||
          _data.payment_type === 'Cash'
        ) {
          paymentsMap.set('CASH', _data.total_amount);
        } else if (_data.payment_type === 'upi') {
          paymentsMap.set('UPI', _data.total_amount);
        } else if (_data.payment_type === 'internetbanking') {
          paymentsMap.set('NEFT/RTGS', _data.total_amount);
        } else if (_data.payment_type === 'cheque') {
          paymentsMap.set('CHEQUE', _data.total_amount);
        } else if (_data.payment_type === 'creditcard') {
          paymentsMap.set('CREDIT CARD', _data.total_amount);
        } else if (_data.payment_type === 'debitcard') {
          paymentsMap.set('DEBIT CARD', _data.total_amount);
        } else if (_data.payment_type === 'Credit') {
          for (let pI of listOfPaymentInData) {
            let amountToConsider = pI.linkedAmount;
            if (pI.paymentType === 'Split') {
              for (let payment of pI.splitPaymentList) {
                let amount = 0;
                if (amountToConsider >= payment.amount) {
                  amount = payment.amount;
                  amountToConsider = amountToConsider - payment.amount;
                } else {
                  amount = amountToConsider;
                  amountToConsider = 0;
                }
                if (payment.amount > 0 && payment.paymentType === 'Cash') {
                  if (paymentsMap.has('CASH')) {
                    paymentsMap.set('CASH', paymentsMap.get('CASH') + amount);
                  } else {
                    paymentsMap.set('CASH', amount);
                  }
                }
                if (
                  payment.amount > 0 &&
                  payment.paymentType === 'Gift Card'
                ) {
                  if (paymentsMap.has('GIFT CARD')) {
                    paymentsMap.set(
                      'GIFT CARD',
                      paymentsMap.get('GIFT CARD') + amount
                    );
                  } else {
                    paymentsMap.set('GIFT CARD', amount);
                  }
                }
                if (
                  payment.amount > 0 &&
                  payment.paymentType === 'Custom Finance'
                ) {
                  if (paymentsMap.has('CUSTOM FINANCE')) {
                    paymentsMap.set(
                      'CUSTOM FINANCE',
                      paymentsMap.get('CUSTOM FINANCE') + amount
                    );
                  } else {
                    paymentsMap.set('CUSTOM FINANCE', amount);
                  }
                }
                if (
                  payment.amount > 0 &&
                  payment.paymentType === 'Exchange'
                ) {
                  if (paymentsMap.has('EXCHANGE')) {
                    paymentsMap.set(
                      'EXCHANGE',
                      paymentsMap.get('EXCHANGE') + amount
                    );
                  } else {
                    paymentsMap.set('EXCHANGE', amount);
                  }
                }

                if (
                  payment.paymentMode === 'UPI' ||
                  payment.paymentMode === 'Internet Banking' ||
                  payment.paymentMode === 'Credit Card' ||
                  payment.paymentMode === 'Debit Card' ||
                  payment.paymentMode === 'Cheque'
                ) {
                  let mode = '';
                  switch (payment.paymentMode) {
                    case 'UPI':
                      mode = 'UPI';
                      break;
                    case 'Internet Banking':
                      mode = 'NEFT/RTGS';
                      break;
                    case 'Credit Card':
                      mode = 'CREDIT CARD';
                      break;
                    case 'Debit Card':
                      mode = 'DEBIT CARD';
                      break;
                    case 'Cheque':
                      mode = 'CHEQUE';
                      break;
                    default:
                      return '';
                  }
                  if (paymentsMap.has(mode)) {
                    paymentsMap.set(mode, paymentsMap.get(mode) + amount);
                  } else {
                    paymentsMap.set(mode, amount);
                  }
                }

                if (amountToConsider === 0) {
                  continue;
                }
              }
            } else if (
              pI.paymentType === 'cash' ||
              pI.paymentType === 'Cash'
            ) {
              let amount = 0;
              if (amountToConsider >= pI.total) {
                amount = pI.total;
                amountToConsider = amountToConsider - pI.total;
              } else {
                amount = amountToConsider;
                amountToConsider = 0;
              }
              if (paymentsMap.has('CASH')) {
                paymentsMap.set('CASH', paymentsMap.get('CASH') + amount);
              } else {
                paymentsMap.set('CASH', amount);
              }

              if (amountToConsider === 0) {
                continue;
              }
            } else if (pI.paymentType === 'upi') {
              let amount = 0;
              if (amountToConsider >= pI.total) {
                amount = pI.total;
                amountToConsider = amountToConsider - pI.total;
              } else {
                amount = amountToConsider;
                amountToConsider = 0;
              }
              if (paymentsMap.has('UPI')) {
                paymentsMap.set('UPI', paymentsMap.get('UPI') + amount);
              } else {
                paymentsMap.set('UPI', amount);
              }

              if (amountToConsider === 0) {
                continue;
              }
            } else if (pI.paymentType === 'internetbanking') {
              let amount = 0;
              if (amountToConsider >= pI.total) {
                amount = pI.total;
                amountToConsider = amountToConsider - pI.total;
              } else {
                amount = amountToConsider;
                amountToConsider = 0;
              }
              if (paymentsMap.has('NEFT/RTGS')) {
                paymentsMap.set(
                  'NEFT/RTGS',
                  paymentsMap.get('NEFT/RTGS') + amount
                );
              } else {
                paymentsMap.set('NEFT/RTGS', amount);
              }

              if (amountToConsider === 0) {
                continue;
              }
            } else if (pI.paymentType === 'cheque') {
              let amount = 0;
              if (amountToConsider >= pI.total) {
                amount = pI.total;
                amountToConsider = amountToConsider - pI.total;
              } else {
                amount = amountToConsider;
                amountToConsider = 0;
              }
              if (paymentsMap.has('CHEQUE')) {
                paymentsMap.set('CHEQUE', paymentsMap.get('CHEQUE') + amount);
              } else {
                paymentsMap.set('CHEQUE', amount);
              }

              if (amountToConsider === 0) {
                continue;
              }
            } else if (pI.paymentType === 'creditcard') {
              let amount = 0;
              if (amountToConsider >= pI.total) {
                amount = pI.total;
                amountToConsider = amountToConsider - pI.total;
              } else {
                amount = amountToConsider;
                amountToConsider = 0;
              }
              if (paymentsMap.has('CREDIT CARD')) {
                paymentsMap.set(
                  'CREDIT CARD',
                  paymentsMap.get('CREDIT CARD') + amount
                );
              } else {
                paymentsMap.set('CREDIT CARD', amount);
              }

              if (amountToConsider === 0) {
                continue;
              }
            } else if (pI.paymentType === 'debitcard') {
              let amount = 0;
              if (amountToConsider >= pI.total) {
                amount = pI.total;
                amountToConsider = amountToConsider - pI.total;
              } else {
                amount = amountToConsider;
                amountToConsider = 0;
              }
              if (paymentsMap.has('DEBIT CARD')) {
                paymentsMap.set(
                  'DEBIT CARD',
                  paymentsMap.get('DEBIT CARD') + amount
                );
              } else {
                paymentsMap.set('DEBIT CARD', amount);
              }

              if (amountToConsider === 0) {
                continue;
              }
            } else if (
              pI.paymentType === 'Sales Return' ||
              pI.paymentType === 'Purchases' ||
              pI.paymentType === 'Sales' ||
              pI.paymentType === 'Opening Balance' ||
              pI.paymentType === 'Purchases Return'
            ) {
              let amount = 0;
              if (amountToConsider >= pI.total) {
                amount = pI.total;
                amountToConsider = amountToConsider - pI.total;
              } else {
                amount = amountToConsider;
                amountToConsider = 0;
              }
              let type = '';
              switch (pI.paymentType) {
                case 'Sales Return':
                  type = 'RETURNED SALE';
                  break;
                case 'Sales':
                  type = 'CREDIT SALE';
                  break;
                case 'Purchases':
                  type = 'CREDIT PURCHASE';
                  break;
                case 'Purchases Return':
                  type = 'RETURNED PURCHASE';
                  break;
                case 'Opening Balance':
                  type = 'OPENING BALANCE';
                  break;
                default:
                  return null;
              }
              if (paymentsMap.has(type)) {
                paymentsMap.set(type, paymentsMap.get(type) + amount);
              } else {
                paymentsMap.set(type, amount);
              }

              if (amountToConsider === 0) {
                continue;
              }
            }
          }
        }

        _data['upi'] = 0;
        _data['netBanking'] = 0;
        _data['cheque'] = 0;
        _data['card'] = 0;
        _data['cash'] = 0;
        _data['giftCard'] = 0;
        _data['customFinance'] = 0;
        _data['exchange'] = 0;

        if (paymentsMap) {
          for (const [key, value] of paymentsMap.entries()) {
            if (value !== 0) {
              switch (key) {
                case 'CASH':
                  _data['cash'] = value;
                  break;
                case 'UPI':
                  _data['upi'] = value;
                  break;
                case 'NEFT/RTGS':
                  _data['netBanking'] = value;
                  break;
                case 'CHEQUE':
                  _data['cheque'] = value;
                  break;
                case 'CREDIT CARD':
                  _data['card'] += value;
                  break;
                case 'DEBIT CARD':
                  _data['card'] += value;
                  break;
                case 'GIFT CARD':
                  _data['giftCard'] = value;
                  break;
                case 'CUSTOM FINANCE':
                  _data['customFinance'] = value;
                  break;
                case 'EXCHANGE':
                  _data['exchange'] = value;
                  break;
                case 'RETURNED SALE':
                  _data['creditNote'] = value;
                  break;
                default:
                  break;
              }
            }
          }
        }
        return _data;
};

const getLinkedData = async (id, table) => {
    const db = await Db.get();
    const businessId = localStorage.getItem('businessId');

    let response = {};

    if (table === 'paymentin' || table === 'paymentout') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { receiptNumber: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'salesreturn') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { sales_return_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'sales') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { invoice_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'purchases') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { bill_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'purchasesreturn') {
      await db[table]
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessId } },
              { purchase_return_number: { $eq: id } }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if (table === 'alltransactions') {
      await db[table]
        .findOne({
          selector: {
            $and: [{ businessId: { $eq: businessId } }, { id: { $eq: id } }]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }

          response = data;
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    }

    return response;
  };