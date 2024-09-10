import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import SessionGroup from './classes/SessionGroup';
import { deleteSessionGroupById, getFilterSessionGroupByDateRange, getSessionGroupDataById, updateSessionGroup } from 'src/components/Helpers/dbQueries/sessionGroup';

const { formatDateToYYYYMMDD } = require('src/components/Helpers/DateHelper');

class SessionGroupStore {
    sessionGroupDialogOpen = false;
    isEdit = false;
    sessionGroupList = null;
    doctorSessionList = []
    addSessionNotesDialogOpen = false;
    dateRange = '';
    filter = '';
    searchData = '';
    isAdmin = false;
    isAllSession = false;
    viewHistory = false;
    employeeFilter = 'all';
    viewSessionDialogOpen = false;
    openPaymentHistory = false;

  constructor() {
    this.sessionGroup = new SessionGroup().defaultValues();
    this.sessionGroupDefault = new SessionGroup().defaultValues();
    this.sessionGroupListDefault = new SessionGroup().sessionListdefaultValues();
  

    makeObservable(this, {
     sessionGroup: observable,
     sessionGroupDialogOpen: observable,
     setCustomerDetails: action,
     sessionGroupListDefault: observable,
     handleSessionGroupValues: action,
     sessionGroupList: observable,
     handleSessionGroupList: action,
     doctorSessionList: observable,
     sessionGroupDefault: observable,
     addSessionNotesDialogOpen: observable,
     handleAddSessionDialogClose: action,
     handleAddSessionDialogOpen: action,
     deleteSessionMgmtData: action,
     getSessionId: action,
     viewSessionDialogOpen: observable,
     handleViewSessionDialogClose: action,
     handleViewSessionDialogOpen: action,
     openPaymentHistory: observable
    });
  }

  setCustomerDetails = (customer) => {
      this.sessionGroup.customerId = customer.id;
      this.sessionGroup.customerName = customer.name;
      this.sessionGroup.customerGSTNo = customer.gstNumber;
      this.sessionGroup.customerGstType = customer.gstType;
      this.sessionGroup.customerAddress = customer.address;
      this.sessionGroup.customerPhoneNo = customer.phoneNo;
      this.sessionGroup.customerCity = customer.shippingCity;
      this.sessionGroup.customerEmailId = customer.emailId;
      this.sessionGroup.customerPincode = customer.shippingPincode;
      this.sessionGroup.customerState = customer.shippingState;
      this.sessionGroup.customerCountry = customer.shippingCountry;
      this.sessionGroup.customerTradeName = customer.tradeName;
      this.sessionGroup.customerLegalName = customer.legalName;
      this.sessionGroup.customerRegistrationNumber = customer.registrationNumber;
      this.sessionGroup.customerPanNumber = customer.panNumber;
      this.sessionGroup.customerAadharNumber = customer.aadharNumber;
  }

  handleSessionGroupValues = (values, isUpdate) => {
    this.sessionGroup.noOfSession = parseInt(values.noOfSession) || 0;
    this.sessionGroup.date = values.date;
    this.sessionGroup.amount = parseFloat(values.amount) || 0;
    this.sessionGroup.perSession = values.perSession;
    if(!values.perSession){
      const perAmount = (values.amount / values.sessionList.length).toFixed(2);
      values.sessionList.map((session) => {
          session.amount = parseFloat(perAmount || 0);
      });
      this.sessionGroup.totalAmount = parseFloat(values.amount) || 0;
    } else {
      values.sessionList.map((session) => {
        session.amount = parseFloat(values.amount) || 0;
      });
      this.sessionGroup.totalAmount = (values.amount * values.sessionList.length).toFixed(2);
      this.sessionGroup.totalAmount = parseFloat(this.sessionGroup.totalAmount || 0);
    }
    this.sessionGroup.sessionList = values.sessionList;
    if(isUpdate){
      this.updateData(values.sessionGroupId, '', '', '', true);
    } else {
      this.saveData();
    }
   
  }

  handleViewSessionDialogOpen = (sessionGroupId) => {
    runInAction(async() => {
        this.sessionGroup = await getSessionGroupDataById(sessionGroupId);
        this.viewSessionDialogOpen = true;
    });
  }

  handleViewSessionDialogClose = () => {
    runInAction(() => {
        this.viewSessionDialogOpen = false;
    });
  }

  handleOpenSessionGroupDialog = () => {
    runInAction(() => {
        this.sessionGroupDialogOpen = true;
        this.viewHistory = false;
    });
  }

  handleCloseSessionGroupDialog = () => {
    runInAction(() => {
        this.sessionGroupDialogOpen = false;
    });
  }

  handleAddSessionDialogOpen = () => {
    runInAction(() => {
      this.addSessionNotesDialogOpen = true;
    })
  }

  handleAddSessionDialogClose = () => {
    runInAction(() => {
      this.addSessionNotesDialogOpen = false;
      this.viewHistory = false;
    })
  }

  handleViewHistory = (sessionGroupId) => {
    runInAction(async () => {
      this.sessionGroup = await getSessionGroupDataById(sessionGroupId);
      this.viewHistory = true;
      this.sessionGroupDialogOpen = true;
    });
  }

  handleSessionGroupList = async (dateRange, filter, searchVal, isAdmin, isAllSession, employeeFilter) => {
    const fromDate = formatDateToYYYYMMDD(dateRange.fromDate);
    const toDate = formatDateToYYYYMMDD(dateRange.toDate);
    const userName = JSON.parse(
      localStorage.getItem('loginDetails')
    ).username
    this.dateRange = dateRange;
    this.filter = filter;
    this.searchData = searchVal;
    this.isAllSession = isAllSession;
    this.employeeFilter = employeeFilter;
    this.isAdmin = isAdmin;
    let list = await getFilterSessionGroupByDateRange(fromDate, toDate, filter, searchVal, isAdmin, userName, isAllSession);
    this.doctorSessionList = [];
    list.forEach(item => {
      item.completedCount = 0;
      item.pendingCount = 0;
      item.cancelledCount = 0;
      item.sessionList.forEach(session => {
        if(isAdmin && !isAllSession){
          if (session.status === 'completed') {
            if(filter === 'completed' || filter === 'all'){
             item.completedCount = item.completedCount + 1;
            }          
         } else if (session.status === 'pending') {
             if(filter === 'pending' || filter === 'all'){
               item.pendingCount = item.pendingCount + 1;
             }           
         } else if (session.status === 'rescheduled') {
          if(filter === 'rescheduled' || filter === 'all'){
            item.pendingCount = item.pendingCount + 1;
           }
         } else if (session.status === 'cancelled') {
          if(filter === 'cancelled' || filter === 'all'){
            item.cancelledCount = item.cancelledCount + 1;
           }
         }
        } else {
           session.patientName = item.customerName;
           session.sessionGroupId = item.sessionGroupId;

           if(isAdmin && session.sessionDate >= fromDate && session.sessionDate <= toDate && (employeeFilter === 'all' ? true : session.doctorPhoneNo == employeeFilter)) {
            if(filter === 'all'){
              this.doctorSessionList.push(session)
            } else {
             if(session.status === filter ){
              this.doctorSessionList.push(session);
             } 
            }
           }  else if (!isAdmin && session.sessionDate >= fromDate && session.sessionDate <= toDate && session.doctorPhoneNo == userName){
            if(filter === 'all'){
              this.doctorSessionList.push(session)
            } else {
             if(session.status === filter ){
              this.doctorSessionList.push(session);
             } 
            }
           }       
          
        }       
          
      });
  });
    
    this.doctorSessionList = [...new Set(this.doctorSessionList)]

     this.sessionGroupList = list;
  }

  getSessionId = async() => {
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const timestamp = Date.now();
    const id = _uniqueId('ssn');
    return `${id}${appId}${timestamp}`;
  }

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();


    const id = await this.getSessionId();
    this.sessionGroup.sessionGroupId = id;
    this.sessionGroup.businessId = businessData.businessId;
    this.sessionGroup.businessCity = businessData.businessCity;
    this.sessionGroup.posId = parseFloat(businessData.posDeviceId);
    this.sessionGroup.updatedAt = Date.now();

    let InsertDoc = { ...this.sessionGroup };
    InsertDoc = new SessionGroup().convertTypes(InsertDoc);

    await db.sessiongroup
      .insert(InsertDoc)
      .then(() => {
        console.log('this.sessiongroup:: data Inserted' , InsertDoc);
        runInAction(() => {
          this.sessionGroup = this.sessionGroupDefault;
          this.handleSessionGroupList(this.dateRange, this.filter, this.searchData, this.isAdmin, false, this.employeeFilter);
          this.sessionGroupDialogOpen = false;
        });
      })
      .catch((err) => {
        console.log('sessiongroup:: data insertion Failed::', err);
        runInAction(() => {
         
        });
      });
  };

  updateData = async (sessionGroupId, notes, sessionId, markCompleted, adminUpdate, notesImage) => {

    let oldTxnData = await getSessionGroupDataById(sessionGroupId);
    if(!oldTxnData){
      return;
    }       
        let newTxnData = {};
        newTxnData.sessionGroupId = oldTxnData.sessionGroupId;
        newTxnData.updatedAt = Date.now();
        let updateSelector;
        if(adminUpdate){
          newTxnData.date = this.sessionGroup.date;
          newTxnData.noOfSession = this.sessionGroup.noOfSession;
          newTxnData.sessionList = this.sessionGroup.sessionList;
          newTxnData.amount = this.sessionGroup.amount;
          newTxnData.totalAmount = this.sessionGroup.totalAmount;
          newTxnData.perSession = this.sessionGroup.perSession;
          updateSelector = {
            $set: {
              date: newTxnData.date,
              noOfSession: newTxnData.noOfSession,
              sessionList: newTxnData.sessionList,
              updatedAt: newTxnData.updatedAt,
              totalAmount: newTxnData.totalAmount,
              amount: newTxnData.amount,
              perSession: newTxnData.perSession,
            }
          }
        } else {
          oldTxnData.sessionList.map((list) => {
            if(list.sessionId === sessionId){
              if(notes){
                list.sessionNotes.message = notes;
              }
              if(notesImage){
                list.sessionNotes.imageUrl = notesImage;
              }
              if(markCompleted){
                list.status = 'completed';
              }
            }
          });
          newTxnData.sessionList = oldTxnData.sessionList;
          updateSelector = {
            $set: {
              sessionList: newTxnData.sessionList,
              updatedAt: newTxnData.updatedAt
            }
          }
        }
        const updated = await updateSessionGroup(sessionGroupId, updateSelector);
        if(updated) {
          this.addSessionNotesDialogOpen = false;
          this.sessionGroupDialogOpen = false;
          this.handleSessionGroupList(this.dateRange, this.filter, this.searchData, this.isAdmin, this.isAllSession, this.employeeFilter);  
        }
  };

  deleteSessionMgmtData = async (item) => {

    const deleted = await deleteSessionGroupById(item.sessionGroupId);

    if(deleted){
      this.handleSessionGroupList(this.dateRange, this.filter, this.searchData, this.isAdmin, this.isAllSession, this.employeeFilter);
    }

  };

  deleteSingleSession = async(item) => {
    let oldTxnData = await getSessionGroupDataById(item.sessionGroupId);
    oldTxnData.sessionList.map((data, index) => {
      if(data.sessionId == item.sessionId){
        oldTxnData.sessionList.splice(index, 1);
      }
    })
    const  updateSelector = {
      $set: {
        sessionList: oldTxnData.sessionList,
        noOfSession: oldTxnData.sessionList.length,
        updatedAt: Date.now()
      }
    }
    const updated = await updateSessionGroup(item.sessionGroupId, updateSelector);
    if(updated) {
      this.handleSessionGroupList(this.dateRange, this.filter, this.searchData, this.isAdmin, this.isAllSession, this.employeeFilter);  
    }
  }

  handlePaymentHistoryDialogOpen = (sessionGroupId) => {
    runInAction(async() => {
        this.sessionGroup = await getSessionGroupDataById(sessionGroupId);
        this.openPaymentHistory = true;
    });
  }

  handlePaymentHistoryDialogClose = () => {
    runInAction(() => {
        this.openPaymentHistory = false;
    });
  }
}
export default new SessionGroupStore();