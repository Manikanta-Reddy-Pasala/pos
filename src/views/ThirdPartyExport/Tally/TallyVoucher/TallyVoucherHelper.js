import * as Db from 'src/RxDb/Database/Database';

export const getPaymentSplitLedgersList = async (_data, type, paymentsMap) => {
  let listOfPaymentInData = [];
  if (type === 'Sales') {
    for (let linkedTxn of _data.linkedTxnList) {
      let tableName = '';
      switch (linkedTxn.paymentType) {
        case 'Payment In':
          tableName = 'paymentin';
          break;
        case 'Sales Return':
          tableName = 'salesreturn';
          break;
        case 'Purchases':
          tableName = 'purchases';
          break;
        case 'Opening Payable Balance':
          tableName = 'alltransactions';
          break;
        default:
          return null;
      }

      if (tableName !== null) {
        const response = await getLinkedData(linkedTxn.linkedId, tableName);
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
        } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Opening Balance';
          linkedTxn.total = response.amount;
        }

        listOfPaymentInData.push(linkedTxn);
      }
    }
  } else if (type === 'Sales Return') {
    for (let linkedTxn of _data.linkedTxnList) {
      console.log('Sales Return linked transaction', linkedTxn);
      let tableName = '';
      switch (linkedTxn.paymentType) {
        case 'Payment Out':
          tableName = 'paymentout';
          break;
        case 'Sales':
          tableName = 'sales';
          break;
        case 'Purchases Return':
          tableName = 'purchasesreturn';
          break;
        case 'Opening Receivable Balance':
          tableName = 'alltransactions';
          break;
        default:
          return null;
      }

      if (tableName !== null) {
        const response = await getLinkedData(linkedTxn.linkedId, tableName);
        linkedTxn.splitPaymentList = response.splitPaymentList;
        linkedTxn.bankAccount = response.bankAccount;
        if ('Payment Out' === linkedTxn.paymentType) {
          linkedTxn.paymentType = response.paymentType;
          linkedTxn.total = response.total;
        } else if ('Sales' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Sales';
          linkedTxn.total = response.total_amount;
        } else if ('Purchases Return' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Purchases Return';
          linkedTxn.total = response.total_amount;
        } else if ('Opening Receivable Balance' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Opening Balance';
          linkedTxn.total = response.amount;
        }

        listOfPaymentInData.push(linkedTxn);
      }
    }
  } else if (type === 'Purchases') {
    for (let linkedTxn of _data.linkedTxnList) {
      let tableName = '';
      switch (linkedTxn.paymentType) {
        case 'Payment Out':
          tableName = 'paymentout';
          break;
        case 'Sales':
          tableName = 'sales';
          break;
        case 'Purchases Return':
          tableName = 'purchasesreturn';
          break;
        case 'Opening Receivable Balance':
          tableName = 'alltransactions';
          break;
        default:
          return null;
      }

      if (tableName !== null) {
        const response = await getLinkedData(linkedTxn.linkedId, tableName);
        linkedTxn.splitPaymentList = response.splitPaymentList;
        linkedTxn.bankAccount = response.bankAccount;
        if ('Payment Out' === linkedTxn.paymentType) {
          linkedTxn.paymentType = response.paymentType;
          linkedTxn.total = response.total;
        } else if ('Sales' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Sales';
          linkedTxn.total = response.total_amount;
        } else if ('Purchases Return' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Purchases Return';
          linkedTxn.total = response.total_amount;
        } else if ('Opening Receivable Balance' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Opening Balance';
          linkedTxn.total = response.amount;
        }

        listOfPaymentInData.push(linkedTxn);
      }
    }
  } else if (type === 'Purchases Return') {
    for (let linkedTxn of _data.linkedTxnList) {
      let tableName = '';
      switch (linkedTxn.paymentType) {
        case 'Payment In':
          tableName = 'paymentin';
          break;
        case 'Sales Return':
          tableName = 'salesreturn';
          break;
        case 'Purchases':
          tableName = 'purchases';
          break;
        case 'Opening Payable Balance':
          tableName = 'alltransactions';
          break;
        default:
          return null;
      }

      if (tableName !== null) {
        const response = await getLinkedData(linkedTxn.linkedId, tableName);
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
        } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
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
      if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
        paymentsMap.set('CUSTOM FINANCE', payment.amount);
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
  } else if (_data.payment_type === 'cash' || _data.payment_type === 'Cash') {
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
          if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
            if (paymentsMap.has('GIFT CARD')) {
              paymentsMap.set(
                'GIFT CARD',
                paymentsMap.get('GIFT CARD') + amount
              );
            } else {
              paymentsMap.set('GIFT CARD', amount);
            }
          }
          if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
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
      } else if (pI.paymentType === 'cash' || pI.paymentType === 'Cash') {
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
          paymentsMap.set('NEFT/RTGS', paymentsMap.get('NEFT/RTGS') + amount);
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
          paymentsMap.set('DEBIT CARD', paymentsMap.get('DEBIT CARD') + amount);
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

  return paymentsMap;
};

export const getBankPaymentSplitLedgersList = async (
  _data,
  type,
  paymentsMap
) => {
  let listOfPaymentInData = [];
  if (type === 'Sales') {
    for (let linkedTxn of _data.linkedTxnList) {
      let tableName = '';
      switch (linkedTxn.paymentType) {
        case 'Payment In':
          tableName = 'paymentin';
          break;
        case 'Sales Return':
          tableName = 'salesreturn';
          break;
        case 'Purchases':
          tableName = 'purchases';
          break;
        case 'Opening Payable Balance':
          tableName = 'alltransactions';
          break;
        default:
          return null;
      }

      if (tableName !== null) {
        const response = await getLinkedData(linkedTxn.linkedId, tableName);
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
        } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Opening Balance';
          linkedTxn.total = response.amount;
        }

        listOfPaymentInData.push(linkedTxn);
      }
    }
  } else if (type === 'Sales Return') {
    for (let linkedTxn of _data.linkedTxnList) {
      console.log('Sales Return linked transaction', linkedTxn);
      let tableName = '';
      switch (linkedTxn.paymentType) {
        case 'Payment Out':
          tableName = 'paymentout';
          break;
        case 'Sales':
          tableName = 'sales';
          break;
        case 'Purchases Return':
          tableName = 'purchasesreturn';
          break;
        case 'Opening Receivable Balance':
          tableName = 'alltransactions';
          break;
        default:
          return null;
      }

      if (tableName !== null) {
        const response = await getLinkedData(linkedTxn.linkedId, tableName);
        linkedTxn.splitPaymentList = response.splitPaymentList;
        linkedTxn.bankAccount = response.bankAccount;
        if ('Payment Out' === linkedTxn.paymentType) {
          linkedTxn.paymentType = response.paymentType;
          linkedTxn.total = response.total;
        } else if ('Sales' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Sales';
          linkedTxn.total = response.total_amount;
        } else if ('Purchases Return' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Purchases Return';
          linkedTxn.total = response.total_amount;
        } else if ('Opening Receivable Balance' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Opening Balance';
          linkedTxn.total = response.amount;
        }

        listOfPaymentInData.push(linkedTxn);
      }
    }
  } else if (type === 'Purchases') {
    for (let linkedTxn of _data.linkedTxnList) {
      let tableName = '';
      switch (linkedTxn.paymentType) {
        case 'Payment Out':
          tableName = 'paymentout';
          break;
        case 'Sales':
          tableName = 'sales';
          break;
        case 'Purchases Return':
          tableName = 'purchasesreturn';
          break;
        case 'Opening Receivable Balance':
          tableName = 'alltransactions';
          break;
        default:
          return null;
      }

      if (tableName !== null) {
        const response = await getLinkedData(linkedTxn.linkedId, tableName);
        linkedTxn.splitPaymentList = response.splitPaymentList;
        linkedTxn.bankAccount = response.bankAccount;
        if ('Payment Out' === linkedTxn.paymentType) {
          linkedTxn.paymentType = response.paymentType;
          linkedTxn.total = response.total;
        } else if ('Sales' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Sales';
          linkedTxn.total = response.total_amount;
        } else if ('Purchases Return' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Purchases Return';
          linkedTxn.total = response.total_amount;
        } else if ('Opening Receivable Balance' === linkedTxn.paymentType) {
          linkedTxn.paymentType = 'Opening Balance';
          linkedTxn.total = response.amount;
        }

        listOfPaymentInData.push(linkedTxn);
      }
    }
  } else if (type === 'Purchases Return') {
    for (let linkedTxn of _data.linkedTxnList) {
      let tableName = '';
      switch (linkedTxn.paymentType) {
        case 'Payment In':
          tableName = 'paymentin';
          break;
        case 'Sales Return':
          tableName = 'salesreturn';
          break;
        case 'Purchases':
          tableName = 'purchases';
          break;
        case 'Opening Payable Balance':
          tableName = 'alltransactions';
          break;
        default:
          return null;
      }

      if (tableName !== null) {
        const response = await getLinkedData(linkedTxn.linkedId, tableName);
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
        } else if ('Opening Payable Balance' === linkedTxn.paymentType) {
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
      if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
        paymentsMap.set('CUSTOM FINANCE', payment.amount);
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

        if (paymentsMap.has(payment.accountDisplayName)) {
          paymentsMap.set(
            payment.accountDisplayName,
            paymentsMap.get(payment.accountDisplayName) + payment.amount
          );
        } else {
          paymentsMap.set(payment.accountDisplayName, payment.amount);
        }
      }
    }
  } else if (_data.payment_type === 'cash' || _data.payment_type === 'Cash') {
    paymentsMap.set('CASH', _data.total_amount);
  } else if (_data.payment_type === 'upi') {
    paymentsMap.set(_data.bankAccount, _data.total_amount);
  } else if (_data.payment_type === 'internetbanking') {
    paymentsMap.set(_data.bankAccount, _data.total_amount);
  } else if (_data.payment_type === 'cheque') {
    paymentsMap.set(_data.bankAccount, _data.total_amount);
  } else if (_data.payment_type === 'creditcard') {
    paymentsMap.set(_data.bankAccount, _data.total_amount);
  } else if (_data.payment_type === 'debitcard') {
    paymentsMap.set(_data.bankAccount, _data.total_amount);
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
          if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
            if (paymentsMap.has('GIFT CARD')) {
              paymentsMap.set(
                'GIFT CARD',
                paymentsMap.get('GIFT CARD') + amount
              );
            } else {
              paymentsMap.set('GIFT CARD', amount);
            }
          }
          if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
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
            if (paymentsMap.has(payment.accountDisplayName)) {
              paymentsMap.set(
                payment.accountDisplayName,
                paymentsMap.get(payment.accountDisplayName) + amount
              );
            } else {
              paymentsMap.set(payment.accountDisplayName, amount);
            }
          }

          if (amountToConsider === 0) {
            continue;
          }
        }
      } else if (pI.paymentType === 'cash' || pI.paymentType === 'Cash') {
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
        if (paymentsMap.has(pI.bankAccount)) {
          paymentsMap.set(
            pI.bankAccount,
            paymentsMap.get(pI.bankAccount) + amount
          );
        } else {
          paymentsMap.set(pI.bankAccount, amount);
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
        if (paymentsMap.has(pI.bankAccount)) {
          paymentsMap.set(
            pI.bankAccount,
            paymentsMap.get(pI.bankAccount) + amount
          );
        } else {
          paymentsMap.set(pI.bankAccount, amount);
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
        if (paymentsMap.has(pI.bankAccount)) {
          paymentsMap.set(
            pI.bankAccount,
            paymentsMap.get(pI.bankAccount) + amount
          );
        } else {
          paymentsMap.set(pI.bankAccount, amount);
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
        if (paymentsMap.has(pI.bankAccount)) {
          paymentsMap.set(
            pI.bankAccount,
            paymentsMap.get(pI.bankAccount) + amount
          );
        } else {
          paymentsMap.set(pI.bankAccount, amount);
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
        if (paymentsMap.has(pI.bankAccount)) {
          paymentsMap.set(
            pI.bankAccount,
            paymentsMap.get(pI.bankAccount) + amount
          );
        } else {
          paymentsMap.set(pI.bankAccount, amount);
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

  return paymentsMap;
};

export const getExpensePaymentSplitLedgersList = async (_data, paymentsMap) => {
  if (_data.paymentType === 'Split') {
    for (let payment of _data.splitPaymentList) {
      if (payment.amount > 0 && payment.paymentType === 'Cash') {
        paymentsMap.set('CASH', payment.amount);
      }
      if (payment.amount > 0 && payment.paymentType === 'Gift Card') {
        paymentsMap.set('GIFT CARD', payment.amount);
      }
      if (payment.amount > 0 && payment.paymentType === 'Custom Finance') {
        paymentsMap.set('CUSTOM FINANCE', payment.amount);
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

        if (paymentsMap.has(payment.accountDisplayName)) {
          paymentsMap.set(
            payment.accountDisplayName,
            paymentsMap.get(payment.accountDisplayName) + payment.amount
          );
        } else {
          paymentsMap.set(payment.accountDisplayName, payment.amount);
        }
      }
    }
  } else if (_data.paymentType === 'cash' || _data.paymentType === 'Cash') {
    paymentsMap.set('CASH', _data.total);
  } else if (_data.paymentType === 'upi') {
    paymentsMap.set(_data.bankAccount, _data.total);
  } else if (_data.paymentType === 'internetbanking') {
    paymentsMap.set(_data.bankAccount, _data.total);
  } else if (_data.paymentType === 'cheque') {
    paymentsMap.set(_data.bankAccount, _data.total);
  } else if (_data.paymentType === 'creditcard') {
    paymentsMap.set(_data.bankAccount, _data.total);
  } else if (_data.paymentType === 'debitcard') {
    paymentsMap.set(_data.bankAccount, _data.total);
  }

  return paymentsMap;
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
