import * as Bd from '../../SelectedBusiness';
import * as Db from '../../../RxDb/Database/Database';
import * as commons from './commonLogic';

const getSessionGroupData = async (selector, single = false) => {
  const db = await Db.get();
  const businessData = await Bd.getBusinessData();

  selector.$and.push({ businessId: { $eq: businessData.businessId } });
  const query = single
    ? await db.sessiongroup.findOne({ selector })
    : await db.sessiongroup.find({ selector });
  return commons.executeQuery(query);
};

export const getSessionGroupDataById = async (sessionGroupId) => {
  return getSessionGroupData({ $and: [{ sessionGroupId: { $eq: sessionGroupId } }] }, true);
};

export const getFilterSessionGroupByDateRange = (fromDate, toDate, filter, searchVal, isAdmin, doctorPhoneNo, allSession) => {
  let selector;
  if(isAdmin){
    if(allSession){
      selector = {
        $and: [
          {
            sessionList: {
              $elemMatch: {
                sessionDate: { $gte: fromDate, $lte: toDate }
              }
            }
          }
        ]
      }
    } else {
      selector =  {
        $and: [
          { date: { $gte: fromDate } },
          { date: { $lte: toDate } },
        ]
      }
    }
    
  } else {
    selector = {
      $and: [
        {
          sessionList: {
            $elemMatch: {
              doctorPhoneNo: { $eq: doctorPhoneNo },
              sessionDate: { $gte: fromDate, $lte: toDate }
            }
          }
        }
      ]
    }
  }
  if (filter === 'pending' || filter === 'completed'){
    selector.$and.push({
      sessionList: {
        $elemMatch: {
          status: { $eq: filter }
        }
      }
    });
  }
  
  if (searchVal){
    var regexp = new RegExp('^.*' + searchVal + '.*$', 'i');
    selector.$and.push( { customerName: { $regex: regexp } } )
  }

  return getSessionGroupData(selector);
};

export const deleteSessionGroupById = async (sessionGroupId) => {
  try {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const query = db.sessiongroup.findOne({
          selector: {
              $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { sessionGroupId: { $eq: sessionGroupId } }
              ]
          }
      });

      const document = await query.exec();
      if (!document) {
          console.log('No matching sessiongroup data found');
          return false;
      }
      
        await document.remove();
      console.log('sessiongroup data removed');
      return true;
  } catch (error) {
      console.log('sessiongroup deletion Failed ' + error);
      return false;
  }
};

export const updateSessionGroup = async(sessionGroupId, updateSelector) => {
  try{
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
  
    await db.sessiongroup
    .findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { sessionGroupId: { $eq: sessionGroupId } }
        ]
      }
    })
    .update(updateSelector)
    console.log('Session Group updated successfully')
    return true;
  } catch (error) {
      console.log('sessiongroup update Failed ' + error);
      return false;
  }
};