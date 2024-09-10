import * as Bd from '../SelectedBusiness';
import * as Db from '../../RxDb/Database/Database';

export const decrementBalance = async (db, id, amount) => {
  if (!id || id === 0) {
    // Customer/vendor balance is updated only when the sale is a credit sale
    // If there is no customer/vendor, then the customer/vendor balance cannot be updated
    return;
  }

  const businessData = await Bd.getBusinessData();

  try {
    const query = db.parties.findOne({
      selector: {
        $and: [{ businessId: { $eq: businessData.businessId } }, { id: id }]
      }
    });

    const data = await query.exec();

    if (!data) {
      // No customer/vendor data is found, so cannot update any information
      return;
    }

    let finalBalance;
    let finalBalanceType;

    if (data.balanceType === 'Payable') {
      finalBalance = parseFloat(data.balance) - parseFloat(amount);
      finalBalanceType = 'Payable';
      if (finalBalance < 0) {
        finalBalanceType = 'Receivable';
        finalBalance = Math.abs(finalBalance);
      }
    } else if (data.balanceType === 'Receivable') {
      finalBalance = parseFloat(data.balance) + parseFloat(amount);
      finalBalanceType = 'Receivable';
    }

    if (parseFloat(finalBalance) >= 0 && finalBalanceType) {
      await query.update({
        $set: {
          balance: finalBalance,
          balanceType: finalBalanceType,
          updatedAt: Date.now()
        }
      });
    }
  } catch (err) {
    console.log('Internal Server Error', err);
  }
};

export const incrementBalance = async (db, id, amount) => {
  if (!id || id === 0) {
    // Customer/vendor balance is updated only when the sale is a credit sale
    // If there is no customer/vendor, then the customer/vendor balance cannot be updated
    return;
  }

  const businessData = await Bd.getBusinessData();

  try {
    const query = db.parties.findOne({
      selector: {
        $and: [{ businessId: { $eq: businessData.businessId } }, { id: id }]
      }
    });

    const data = await query.exec();

    if (!data) {
      // No customer/vendor data is found, so cannot update any information
      return;
    }

    let finalBalance;
    let finalBalanceType;

    if (data.balanceType === 'Payable') {
      finalBalance = parseFloat(data.balance) + parseFloat(amount);
      finalBalanceType = 'Payable';
    } else if (data.balanceType === 'Receivable') {
      finalBalance = parseFloat(data.balance) - parseFloat(amount);
      finalBalanceType = 'Receivable';
      if (finalBalance < 0) {
        finalBalanceType = 'Payable';
        finalBalance = Math.abs(finalBalance);
      }
    }

    if (parseFloat(finalBalance) >= 0 && finalBalanceType) {
      await query.update({
        $set: {
          balance: finalBalance,
          balanceType: finalBalanceType,
          updatedAt: Date.now()
        }
      });
    }
  } catch (err) {
    console.log('Internal Server Error', err);
  }
};

export const getCustomerBalanceById = async (partyId) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  let balance = 0;
  let balanceType = '';
  let creditLimit = 0;

  if (partyId) {
    await db.parties
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: partyId } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          return;
        }

        balance = data.balance;
        balanceType = data.balanceType;
        creditLimit = data.creditLimit;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  }

  var data = {
    totalBalance: balance,
    balanceType: balanceType,
    creditLimit: creditLimit
  };

  return data;
};
