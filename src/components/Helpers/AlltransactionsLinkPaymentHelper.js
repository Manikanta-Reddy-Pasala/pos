import * as Bd from '../SelectedBusiness';

export const updateLinkPaymentAllTxnTable = async (db, doc) => {
  const businessData = await Bd.getBusinessData();

  const openingBalanceData = await db.alltransactions
    .findOne({
      selector: {
        $and: [
          {
            id: { $eq: doc.id }
          },
          {
            businessId: { $eq: businessData.businessId }
          }
        ]
      }
    })
    .exec();

  const changeData = await (async (oldData) => {
    if (parseFloat(oldData.balance) > 0) {
      console.log('balance is more than 0');

      if (oldData.balance > doc.linkedAmount) {
        oldData.balance =
          parseFloat(oldData.balance) - parseFloat(doc.linkedAmount);

        oldData.linkedAmount =
          parseFloat(oldData.linkedAmount || 0) + doc.linkedAmount;
      } else {
        oldData.linkedAmount = parseFloat(oldData.balance);
        oldData.balance = 0;
      }
    }

    oldData.updatedAt = Date.now();
    console.log('updated old data alltransactions::', oldData);
    return oldData;
  });

  if (openingBalanceData) {
    await openingBalanceData.atomicUpdate(changeData);
  }
};

export const removeLinkedTxnBalance = async (db, doc) => {
  const businessData = await Bd.getBusinessData();

  const openingBalanceData = await db.alltransactions
    .findOne({
      selector: {
        $and: [
          {
            id: { $eq: doc.linkedId }
          },
          { businessId: { $eq: businessData.businessId } }
        ]
      }
    })
    .exec();

  const changeData = await ((oldData) => {
    /**
     * remove transaction data
     * and
     *
     * add balance back to balance
     */

    const linkedAmount = parseFloat(doc.linkedAmount);
    oldData.balance += linkedAmount;

    oldData.linkedAmount =
      (parseFloat(oldData.linkedAmount) || 0) - linkedAmount;

    oldData.updatedAt = Date.now();
    console.log(
      'updated old data removeLinkedTxnOpeningPartyReceivableBalance::',
      oldData
    );
    return oldData;
  });

  if (openingBalanceData) {
    await openingBalanceData.atomicUpdate(changeData);
  }
};
