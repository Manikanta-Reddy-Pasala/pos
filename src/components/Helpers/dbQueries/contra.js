import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';
import * as audit from 'src/components/Helpers/AuditHelper';

const getContraData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.contra.findOne({ selector })
    : await db.contra.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getContraById = async (id, fields) => {
  return getContraData({ $and: [{ contraId: { $eq: id } }] }, fields, true);
};

export const getAllContraByDateRange = async (fromDate, toDate, fields) => {
  return getContraData(
    {
      $and: [
        { date: { $gte: fromDate } },
        { date: { $lte: toDate } },
        { updatedAt: { $exists: true } }
      ]
    },
    fields
  );
};

export const saveContra = async (InsertDoc) => {
  try {
    const db = await Db.get();
    await db.contra.insert(InsertDoc);

    //save to audit
    audit.addAuditEvent(
      InsertDoc.contraId,
      InsertDoc.sequenceNumber,
      'Contra',
      'Save',
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.date
    );

    console.log('Contra inserted successfully');
    return true;
  } catch (error) {
    console.log('Contra update Failed ' + error);

    audit.addAuditEvent(
      InsertDoc.contraId,
      InsertDoc.sequenceNumber,
      'Contra',
      'Save',
      JSON.stringify(InsertDoc),
      error.message ? error.message : 'Contra save failed',
      InsertDoc.date
    );

    return false;
  }
};

export const updateContra = async (updateSelector, data) => {
  try {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.contra
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { contraId: { $eq: data.contraId } }
          ]
        }
      })
      .update(updateSelector);

    audit.addAuditEvent(
      data.contraId,
      data.sequenceNumber,
      'Contra',
      'Update',
      JSON.stringify(data),
      '',
      data.date
    );
    console.log('Contra updated successfully');
    return true;
  } catch (error) {
    console.log('Contra update Failed ' + error);
    audit.addAuditEvent(
      data.contraId,
      data.sequenceNumber,
      'Contra',
      'Update',
      JSON.stringify(data),
      error.message ? error.message : 'Contra update failed',
      data.date
    );
    return false;
  }
};

export const deleteContraById = async (contraId, data) => {
  try {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.contra.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { contraId: { $eq: contraId } }
        ]
      }
    });

    const document = await query.exec();
    if (!document) {
      console.log('No matching contra data found');
      return false;
    }

    await document.remove();

    audit.addAuditEvent(
      data.contraId,
      data.sequenceNumber,
      'Contra',
      'Delete',
      JSON.stringify(data),
      '',
      data.date
    );

    console.log('contra data removed');
    return true;
  } catch (error) {
    console.log('contra deletion Failed ' + error);
    audit.addAuditEvent(
      data.contraId,
      data.sequenceNumber,
      'Contra',
      'Delete',
      JSON.stringify(data),
      error.message ? error.message : 'Contra update failed',
      data.date
    );
    return false;
  }
};