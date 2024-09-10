
import * as Bd from '../../SelectedBusiness';


export const getTransactionData = async (db, selector, paymentTypeDetails, txnType) => {

  const data = await db[paymentTypeDetails.collection].find({ selector }).exec();

  if (!data) {
    return ;
  }

  return data.map(item => {
    let finalData = item.toJSON();
    finalData.paymentType = txnType;
    finalData.id = item[paymentTypeDetails.idField];
    finalData.total = item[paymentTypeDetails.totalAmountField];
    finalData.balance = item[paymentTypeDetails.balanceField];
    finalData.date = item[paymentTypeDetails.dateField];
    finalData.sequenceNumber = item.sequenceNumber;
    return finalData;
  });
};


  export const getLinkedTxnDataQuery = async (db, linkedTxn, paymentTypeDetails) => {

    const businessData = await Bd.getBusinessData();

    let selector = {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { [paymentTypeDetails.idField]: { $eq: linkedTxn.linkedId }}
      ]
    }

    return await db[paymentTypeDetails.collection]
    .find({
      selector: selector
    })
    .exec();

}

export const updateWithLinkTxnQuery = async (db, collectionName, uniqueField, uniqueValue) => {
    const businessData = await Bd.getBusinessData();

    return await db[collectionName]
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { [uniqueField]: { $eq: uniqueValue } }
          ]
        }
      })
      .exec()
      .catch((err) => {
        console.log(`Internal Server Error ${collectionName}`, err);
      });
    }