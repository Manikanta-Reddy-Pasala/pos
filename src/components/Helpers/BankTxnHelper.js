import * as Bd from '../SelectedBusiness';

const updateBankAccountBalance = async (txnData, db, operation) => {
  try {
    const { businessId } = await Bd.getBusinessData();

    const query = db.bankaccounts.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessId } },
          { id: { $eq: txnData.bankAccountId } }
        ]
      }
    });

    const data = await query.exec();
    if (!data) {
      return;
    }

    let currentBalance = parseFloat(data.balance);
    let updatedBalance =
      operation === 'add'
        ? currentBalance + parseFloat(txnData.amount)
        : currentBalance - parseFloat(txnData.amount);

    if (updatedBalance < 0) {
      updatedBalance = 0;
    }

    await query.update({
      $set: {
        balance: updatedBalance,
        updatedAt: Date.now()
      }
    });
  } catch (err) {
    console.log('Internal Server Error', err);
  }
};

export const addBalanceToBankAccount = async (txnData, db) => {
  await updateBankAccountBalance(txnData, db, 'add');
};

export const removeBalanceFromBankAccount = async (txnData, db) => {
  await updateBankAccountBalance(txnData, db, 'remove');
};
