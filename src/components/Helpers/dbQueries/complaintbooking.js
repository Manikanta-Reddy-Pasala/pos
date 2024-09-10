import * as Bd from '../../SelectedBusiness';
import * as Db from 'src/RxDb/Database/Database';
import * as commons from './commonLogic';
import * as audit from 'src/components/Helpers/AuditHelper';

const getComplaintBookingData = async (selector, fields, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });

  const query = single
    ? await db.complaintbooking.findOne({ selector })
    : await db.complaintbooking.find({ selector });

  return commons.executeQuery(query, fields);
};

export const getComplaintBookingDataById = async (id, fields) => {
  return getComplaintBookingData(
    { $and: [{ bookingId: { $eq: id } }] },
    fields,
    true
  );
};

export const getAllComplaintBookingByDateRange = async (
  fromDate,
  toDate,
  fields
) => {
  return getComplaintBookingData(
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

export const getAllComplaintBooking = async (fields) => {
  return getComplaintBookingData(
    {
      $and: [{ updatedAt: { $exists: true } }]
    },
    fields
  );
};

export const saveComplaintBooking = async (InsertDoc) => {
  try {
    const db = await Db.get();

    await db.complaintbooking.insert(InsertDoc);
    console.log('Complaint Booking saved successfully');
    return true;
  } catch (error) {
    console.log('Complaint Booking save Failed ' + error);
    audit.addAuditEvent(
      InsertDoc.bookingId,
      '',
      'Complaint Booking',
      'Save',
      JSON.stringify(InsertDoc),
      error.message,
      InsertDoc.date
    );
    return false;
  }
};

export const updateComplaintBooking = async (updateSelector, data) => {
  try {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.complaintbooking
      .findOne({
        selector: {
          $and: [{ businessId: { $eq: businessData.businessId } }]
        }
      })
      .update(updateSelector);
    console.log('Complaint Booking updated successfully');
    return true;
  } catch (error) {
    console.log('Complaint Booking update Failed ' + error);
    audit.addAuditEvent(
      data.bookingId,
      '',
      'Complaint Booking',
      'Update',
      JSON.stringify(data),
      error.message,
      data.date
    );
    return false;
  }
};

export const deleteComplaintBookingById = async (bookingId, data) => {
  try {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.complaintbooking.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { bookingId: { $eq: bookingId } }
        ]
      }
    });

    const document = await query.exec();
    if (!document) {
      console.log('No matching complaint booking data found');
      return false;
    }

    await document.remove();
    console.log('complaint booking data removed');
    return true;
  } catch (error) {
    console.log('complaint booking deletion Failed ' + error);
    audit.addAuditEvent(
      data.bookingId,
      '',
      'Complaint Booking',
      'Delete',
      JSON.stringify(data),
      error.message,
      data.date
    );
    return false;
  }
};