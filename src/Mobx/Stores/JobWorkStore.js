import {
  action,
  observable,
  makeObservable,
  runInAction,
  toJS,
  computed
} from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';

class JobWorkStore {
  // ---------------------------------------------------ORDER OUT ---------------------------------------------------------------
  OpenNewOrderInvoice = false;

  isUpdate = false;
  orderInvoiceList = [];

  isRestore = false;

  chosenMetalString = '';
  chosenMetalList = [];

  sequenceNumberFailureAlert = false;

  handleNewOrderInvoice = (status) => {
    this.OpenNewOrderInvoice = status;
    this.resetAllData();
    this.isUpdate = false;
  };

  workOrderDetails = {
    businessId: '',
    businessCity: '',
    invoiceSequenceNumber: '',
    id: '',
    orderDate: getTodayDateInYYYYMMDD(),
    dueDate: getTodayDateInYYYYMMDD(),
    vendorId: '',
    vendorName: '',
    vendorPhoneNo: '',
    vendorGstNumber: '',
    vendorAddress: '',
    subTotalAmount: 0,
    totalAmount: 0,
    orderNotes: '',
    fullReceipt: false,
    partialReceipt: false,
    employeeId: '',
    updatedAt: '',
    posId: '',
    workOrderType: 'New',
    vendorCity: '',
    vendorPincode: '',
    vendorState: '',
    vendorCountry: '',
    vendorGstType: '',
    vendorEmailId: '',
    rateList: [],
    isSyncedToServer: false
  };

  items = [
    {
      itemId: '',
      itemName: '',
      weight: '',
      copperWeight: '',
      kdmWeight: '',
      toPay: '',
      amount: 0,
      isEdit: true,
      receiptCreated: false
    }
  ];

  addWorkOrderRow = () => {
    if (this.items.length > 0) {
      this.items = this.items.map((data, index) => ({
        ...data,
        itemId: index,
        isEdit: false
      }));
    }
    this.items.push({
      itemId: this.items.length,
      itemName: '',
      weight: '',
      copperWeight: '',
      kdmWeight: '',
      toPay: '',
      amount: 0,
      isEdit: true,
      receiptCreated: false
    });
  };

  printJobWorkOutData = null;
  openJobWorkOutLoadingAlertMessage = false;
  openJobWorkOutErrorAlertMessage = false;

  openJobWorkOutPrintSelectionAlert = false;

  jobWorkOutInvoiceRegular = {};
  jobWorkOutInvoiceThermal = {};

  setEditTable = (index) => {
    this.items = this.items.map((data, idx) => ({
      ...data,
      isEdit: idx === index ? true : false
    }));
  };

  setWorkOrderItemProperty = async (property, value, index) => {
    this.items[index][property] = value;
    if (property === 'amount' && this.items[index]['amount'] !== '') {
      this.workOrderDetails['subTotalAmount'] = this.getTotalAmount();
      this.workOrderDetails['totalAmount'] = this.getTotalAmount();
    }
    this.getTotalWeightPerItem(index);
  };

  setWorkOrderProperty = async (property, value) => {
    this.workOrderDetails[property] = value;
  };

  getTotalWeightPerItem = async (index) => {
    if (!this.items[index]) {
      return 0;
    }

    let totalWeight =
      parseFloat(this.items[index].weight || 0) +
      parseFloat(this.items[index].copperWeight || 0) +
      parseFloat(this.items[index].kdmWeight || 0);

    this.items[index].toPay = parseFloat(totalWeight).toFixed(3);
  };

  deleteItemRow = async (index) => {
    this.items.splice(index, 1);
    console.log(this.items);
    this.workOrderDetails['subTotalAmount'] = this.getTotalAmount();
    this.workOrderDetails['totalAmount'] = this.getTotalAmount();
    this.items = this.items.map((data, index) => ({
      ...data,
      isEdit: this.items.length - 1 === index ? true : false
    }));
  };

  getTotalAmount = () => {
    const totalAmount = this.items.reduce((a, b) => {
      const amount = toJS(b.amount);
      if (!Number.isNaN(amount)) {
        a = parseFloat(a) + parseFloat(amount);
      }
      return a;
    }, 0);
    return totalAmount;
  };

  get getTotalWeight() {
    const totalWeight = this.items.reduce((a, b) => {
      const weight = toJS(b.weight);
      const copperWeight = toJS(b.copperWeight);
      const kdmWeight = toJS(b.kdmWeight);
      a =
        parseFloat(a) +
        parseFloat(copperWeight || 0) +
        parseFloat(weight || 0) +
        parseFloat(kdmWeight || 0);

      return a;
    }, 0);

    return parseFloat(totalWeight).toFixed(3);
  }

  getSequenceNumber = async (type, date, id) => {
    let data = {};
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      data.multiDeviceBillingSupport = transSettings.multiDeviceBillingSupport;
      data.prefix =
        transSettings.jobWorkOrderOut.prefixSequence &&
        transSettings.jobWorkOrderOut.prefixSequence.length > 0
          ? transSettings.jobWorkOrderOut.prefixSequence[0].prefix
          : '';
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      data.prefix = localStorage.getItem('deviceName');
      data.subPrefix = 'JWO';
      isOnline = false;
    }

    const sequenceNumber = await sequence.getFinalSequenceNumber(
      data,
      type,
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
    return sequenceNumber;
  };

  generateOrderNo = async (date, id) => {
    this.workOrderDetails.invoiceSequenceNumber = await this.getSequenceNumber(
      'jobListInvoice',
      date,
      id
    );
  };

  saveWorkJob = async (saveAndNew, isPrint) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();
    runInAction(() => {
      this.workOrderDetails.businessId = businessData.businessId;
      this.workOrderDetails.businessCity = businessData.businessCity;
      this.workOrderDetails.posId = parseFloat(businessData.posDeviceId);
    });

    if (
      this.workOrderDetails.subTotalAmount === '' ||
      this.workOrderDetails.subTotalAmount === null
    ) {
      this.workOrderDetails.subTotalAmount = 0;
    }

    if (
      this.workOrderDetails.totalAmount === '' ||
      this.workOrderDetails.totalAmount === null
    ) {
      this.workOrderDetails.totalAmount = 0;
    }

    if (
      this.workOrderDetails.fullReceipt === '' ||
      this.workOrderDetails.fullReceipt === null
    ) {
      this.workOrderDetails.fullReceipt = false;
    }

    if (
      this.workOrderDetails.partialReceipt === '' ||
      this.workOrderDetails.partialReceipt === null
    ) {
      this.workOrderDetails.partialReceipt = false;
    }

    if (
      this.workOrderDetails.workOrderType === '' ||
      this.workOrderDetails.workOrderType === null
    ) {
      this.workOrderDetails.workOrderType = 'New';
    }

    //generate id
    const timestamp = Math.floor(Date.now() / 1000);
    const appId = businessData.posDeviceId;
    const id = _uniqueId('jw');
    this.workOrderDetails.id = `${id}${appId}${timestamp}`;

    if (this.workOrderDetails.invoiceSequenceNumber === '') {
      await this.generateOrderNo(
        this.workOrderDetails.orderDate,
        this.workOrderDetails.id
      );
    }

    if (this.workOrderDetails.invoiceSequenceNumber === '0') {
      this.workOrderDetails.invoiceSequenceNumber = '';
      this.handleCloseJobWorkOutLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    //clear empty rows
    let filteredArray = [];

    for (let item of this.items) {
      if (item.isEdit === null || item.isEdit === '') {
        item.isEdit = true;
      }

      if (item.receiptCreated === null || item.receiptCreated === '') {
        item.receiptCreated = false;
      }

      if (item.amount === null || item.amount === '') {
        item.amount = 0;
      }

      filteredArray.push(item);
    }
    this.items = filteredArray;

    const InsertDoc = {
      itemList: this.items,
      ...this.workOrderDetails
    };
    /**
     * updated date
     */
    InsertDoc.updatedAt = Date.now();

    if (this.isRestore) {
      InsertDoc.employeeId = this.workOrderDetails.employeeId;
    } else {
      try {
        InsertDoc.employeeId = JSON.parse(
          localStorage.getItem('loginDetails')
        ).username;
      } catch (e) {
        console.error(' Error: ', e.message);
      }
    }

    allTxn.saveTxnFromJobWorkOut(InsertDoc, db);

    if (this.isRestore) {
      await this.markJobWorkOutRestored();
    }

    let userAction = 'Save';

    if (this.isRestore) {
      userAction = 'Restore';
    }

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.id,
      InsertDoc.invoiceSequenceNumber,
      'JWO',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.orderDate
    );

    await db.jobwork
      .insert(InsertDoc)
      .then(async (data) => {
        this.handleCloseJobWorkOutLoadingMessage();
        if (
          this.jobWorkOutInvoiceRegular &&
          this.jobWorkOutInvoiceRegular.boolDefault &&
          isPrint
        ) {
          this.printJobWorkOutData = InsertDoc;

          if (saveAndNew) {
            this.openNewWorkOrder();
          } else {
            this.handleNewOrderInvoice(false);
          }
          this.resetAllData();

          this.handleOpenJobWorkOutPrintSelectionAlertMessage();
        } else {
          if (saveAndNew) {
            this.openNewWorkOrder();
          } else {
            this.handleNewOrderInvoice(false);
          }
          this.resetAllData();
        }
      })
      .catch((err) => {
        console.error('Error in Adding WorkJob', err);
        //save to audit
        audit.addAuditEvent(
          InsertDoc.id,
          InsertDoc.invoiceSequenceNumber,
          'JWO',
          userAction,
          JSON.stringify(InsertDoc),
          err.message ? err.message : 'JWO Failed',
          InsertDoc.orderDate
        );
      });
  };

  saveOrUpdateWorkJob = async (saveAndNew, isPrint) => {
    if (
      this.workOrderDetails.subTotalAmount === '' ||
      this.workOrderDetails.subTotalAmount === null
    ) {
      this.workOrderDetails.subTotalAmount = 0;
    }

    if (
      this.workOrderDetails.totalAmount === '' ||
      this.workOrderDetails.totalAmount === null
    ) {
      this.workOrderDetails.totalAmount = 0;
    }

    if (
      this.workOrderDetails.fullReceipt === '' ||
      this.workOrderDetails.fullReceipt === null
    ) {
      this.workOrderDetails.fullReceipt = false;
    }

    if (
      this.workOrderDetails.partialReceipt === '' ||
      this.workOrderDetails.partialReceipt === null
    ) {
      this.workOrderDetails.partialReceipt = false;
    }

    if (
      this.workOrderDetails.workOrderType === '' ||
      this.workOrderDetails.workOrderType === null
    ) {
      this.workOrderDetails.workOrderType = 'New';
    }

    let productsList = [];

    for (let item of this.items) {
      if (item.isEdit === null || item.isEdit === '') {
        item.isEdit = true;
      }

      if (item.receiptCreated === null || item.receiptCreated === '') {
        item.receiptCreated = false;
      }

      if (item.amount === '' || item.amount === null) {
        item.amount = 0;
      }
      productsList.push(item);
    }

    this.items = productsList;

    if (this.workOrderDetails.id.length > 0) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const query = db.jobwork.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.workOrderDetails.id } }
          ]
        }
      });

      let txnData = this.workOrderDetails;
      txnData.itemList = this.items;

      await allTxn.deleteAndSaveTxnFromJobWorkOut(
        this.workOrderDetails,
        txnData,
        db
      );

      await query
        .exec()
        .then(async (data) => {
          if (!data) {
            this.saveWorkJob(saveAndNew);
          } else {
            //save to audit
            await audit.addAuditEvent(
              txnData.id,
              txnData.invoiceSequenceNumber,
              'JWO',
              'Update',
              JSON.stringify(txnData),
              '',
              txnData.orderDate
            );

            try {
              await query
                .update({
                  $set: {
                    businessId: this.workOrderDetails.businessId,
                    businessCity: this.workOrderDetails.businessCity,
                    invoiceSequenceNumber:
                      this.workOrderDetails.invoiceSequenceNumber,
                    id: this.workOrderDetails.id,
                    orderDate: this.workOrderDetails.orderDate,
                    dueDate: this.workOrderDetails.dueDate,
                    vendorId: this.workOrderDetails.vendorId,
                    vendorName: this.workOrderDetails.vendorName,
                    vendorPhoneNo: this.workOrderDetails.vendorPhoneNo,
                    vendorGstNumber: this.workOrderDetails.vendorGstNumber,
                    vendorAddress: this.workOrderDetails.vendorAddress,
                    subTotalAmount: this.workOrderDetails.subTotalAmount,
                    totalAmount: this.workOrderDetails.totalAmount,
                    orderNotes: this.workOrderDetails.orderNotes,
                    partialReceipt: this.workOrderDetails.partialReceipt,
                    fullReceipt: this.workOrderDetails.fullReceipt,
                    employeeId: this.workOrderDetails.employeeId,
                    posId: this.workOrderDetails.posId,
                    workOrderType: this.workOrderDetails.workOrderType,
                    updatedAt: Date.now(),
                    vendorCity: this.workOrderDetails.vendorCity,
                    vendorPincode: this.workOrderDetails.vendorPincode,
                    vendorState: this.workOrderDetails.vendorState,
                    vendorCountry: this.workOrderDetails.vendorCountry,
                    vendorGstType: this.workOrderDetails.vendorGstType,
                    vendorEmailId: this.workOrderDetails.vendorEmailId,
                    itemList: this.items,
                    rateList: this.workOrderDetails.rateList,
                    isSyncedToServer: this.workOrderDetails.isSyncedToServer
                  }
                })
                .then(async (data) => {
                  this.handleCloseJobWorkOutLoadingMessage();
                  if (
                    this.jobWorkOutInvoiceRegular &&
                    this.jobWorkOutInvoiceRegular.boolDefault &&
                    isPrint
                  ) {
                    this.printJobWorkOutData = txnData;
                    if (saveAndNew) {
                      this.openNewWorkOrder();
                    } else {
                      this.handleNewOrderInvoice(false);
                    }
                    this.resetAllData();
                    this.handleOpenJobWorkOutPrintSelectionAlertMessage();
                  } else {
                    if (saveAndNew) {
                      this.openNewWorkOrder();
                    } else {
                      this.handleNewOrderInvoice(false);
                    }
                    this.resetAllData();
                  }
                });
            } catch (error) {
              await audit.addAuditEvent(
                txnData.id,
                txnData.invoiceSequenceNumber,
                'JWO',
                'Update',
                JSON.stringify(txnData),
                error.message,
                txnData.orderDate
              );
            }
          }
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else {
      await this.saveWorkJob(saveAndNew, isPrint);
    }
  };

  deleteOrderInvoice = async (item) => {
    let DeleteDataDoc = {
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      total: 0,
      balance: 0,
      data: ''
    };

    let restoreJobworkOutData = {};
    restoreJobworkOutData = item;
    restoreJobworkOutData.itemList = item.itemList;
    restoreJobworkOutData.employeeId = item.employeeId;

    DeleteDataDoc.transactionId = item.id;
    DeleteDataDoc.sequenceNumber = item.invoiceSequenceNumber;
    DeleteDataDoc.transactionType = 'Job Work Order - Out';
    DeleteDataDoc.data = JSON.stringify(restoreJobworkOutData);
    DeleteDataDoc.total = item.totalAmount;
    DeleteDataDoc.balance = 0;
    DeleteDataDoc.createdDate = item.orderDate;

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.jobwork.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: item.id } }
        ]
      }
    });

    await allTxn.deleteTxnFromJobWorkOut(item, db);

    await deleteTxn.addDeleteEvent(DeleteDataDoc);

    //save to audit
    audit.addAuditEvent(
      restoreJobworkOutData.id,
      restoreJobworkOutData.invoiceSequenceNumber,
      'JWO',
      'Delete',
      JSON.stringify(restoreJobworkOutData),
      '',
      restoreJobworkOutData.orderDate
    );

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        } else {
          await query.remove().then(async (data) => {
            // console.log('inside update', data);
            this.resetAllData();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        //save to audit
        audit.addAuditEvent(
          restoreJobworkOutData.id,
          restoreJobworkOutData.invoiceSequenceNumber,
          'JWO',
          'Delete',
          JSON.stringify(restoreJobworkOutData),
          err.message,
          restoreJobworkOutData.orderDate
        );
      });
  };

  handleOrderInvoiceSearch = async (value) => {
    const db = await Db.get();
    console.log('handleOrderInvoiceSearch', value);
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.jobwork
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                { invoiceSequenceNumber: { $regex: regexp } },
                { vendorName: { $regex: regexp } },
                { vendorPhoneNo: { $regex: regexp } },
                { totalAmount: { $eq: parseFloat(value) } }
              ]
            }
          ]
        }
      })
      .exec()
      .then((documents) => {
        data = documents.map((item) => item);
        // console.log(data);
      });
    return data;
  };

  openNewWorkOrder = () => {
    this.isUpdate = false;
    this.workOrderDetails = {
      businessId: '',
      businessCity: '',
      invoiceSequenceNumber: '',
      id: '',
      orderDate: getTodayDateInYYYYMMDD(),
      dueDate: getTodayDateInYYYYMMDD(),
      vendorId: '',
      vendorName: '',
      vendorPhoneNo: '',
      vendorGstNumber: '',
      vendorAddress: '',
      subTotalAmount: 0,
      totalAmount: 0,
      orderNotes: '',
      fullReceipt: false,
      partialReceipt: false,
      employeeId: '',
      updatedAt: '',
      posId: '',
      workOrderType: 'New',
      vendorCity: '',
      vendorPincode: '',
      vendorState: '',
      vendorCountry: '',
      vendorGstType: '',
      vendorEmailId: '',
      rateList: [],
      isSyncedToServer: false
    };

    this.items = [
      {
        itemId: '',
        itemName: '',
        weight: '',
        copperWeight: '',
        kdmWeight: '',
        toPay: '',
        amount: 0,
        isEdit: true,
        receiptCreated: false
      }
    ];
  };

  resetAllData = () => {
    this.isRestore = false;
    this.workOrderDetails = {
      businessId: '',
      businessCity: '',
      invoiceSequenceNumber: '',
      id: '',
      orderDate: getTodayDateInYYYYMMDD(),
      dueDate: getTodayDateInYYYYMMDD(),
      vendorId: '',
      vendorName: '',
      vendorPhoneNo: '',
      vendorGstNumber: '',
      vendorAddress: '',
      subTotalAmount: 0,
      totalAmount: 0,
      orderNotes: '',
      fullReceipt: false,
      partialReceipt: false,
      employeeId: '',
      updatedAt: '',
      posId: '',
      workOrderType: 'New',
      vendorCity: '',
      vendorPincode: '',
      vendorState: '',
      vendorCountry: '',
      vendorGstType: '',
      vendorEmailId: '',
      rateList: [],
      isSyncedToServer: false
    };

    this.items = [
      {
        itemId: '',
        itemName: '',
        weight: '',
        copperWeight: '',
        kdmWeight: '',
        toPay: '',
        amount: 0,
        isEdit: true,
        receiptCreated: false
      }
    ];
  };

  viewOrEditJobWorkOutItem = async (item) => {
    this.viewOrEditItem(item);
  };

  viewOrEditItem = async (item) => {
    // console.log(item);
    this.OpenNewOrderInvoice = true;
    this.isUpdate = true;
    this.workOrderDetails = item;
    this.items = item.itemList;
  };

  handleOrderInvoiceSearchWithDateAndEmployee = async (
    value,
    fromDate,
    toDate,
    employeeId
  ) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    let query;
    if (employeeId) {
      const businessData = await Bd.getBusinessData();

      query = await db.jobwork.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { invoiceSequenceNumber: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { vendorName: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { totalAmount: { $eq: parseFloat(value) } },
                { employeeId: { $eq: employeeId } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { workOrderType: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { dueDate: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        }
      });
    } else {
      const businessData = await Bd.getBusinessData();

      query = await db.jobwork.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { invoiceSequenceNumber: { $regex: regexp } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { vendorName: { $regex: regexp } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { totalAmount: { $eq: parseFloat(value) } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { workOrderType: { $regex: regexp } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { dueDate: { $regex: regexp } },
                {
                  orderDate: {
                    $gte: fromDate
                  }
                },
                {
                  orderDate: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        }
      });
    }

    await query.exec().then((documents) => {
      data = documents.map((item) => item.toJSON());
    });
    return data;
  };

  // ------------------------------------------------------- ORDER IN ---------------------------------------------------------

  OpenNewOrderIn = false;

  handleOrderInDialog = (status) => {
    this.OpenNewOrderIn = status;
    // console.log(this.OpenNewOrderIn);
  };

  viewAndRestoreJobWorkOutItem = async (item) => {
    this.OpenNewOrderInvoice = true;
    this.isUpdate = false;
    this.isRestore = true;
    this.workOrderDetails = item;
    this.workOrderDetails.employeeId = item.employeeId;
    this.items = item.itemList;
  };

  restoreJobWorkOutItem = async (item, isRestoreWithNextSequenceNo) => {
    this.isRestore = true;
    this.isUpdate = false;
    this.workOrderDetails = item;
    this.workOrderDetails.employeeId = item.employeeId;
    this.items = item.itemList;

    if (isRestoreWithNextSequenceNo) {
      const businessData = await Bd.getBusinessData();
      //generate id
      const timestamp = Math.floor(Date.now() / 1000);
      const appId = businessData.posDeviceId;
      const id = _uniqueId('jw');
      this.workOrderDetails.id = `${id}${appId}${timestamp}`;
      this.workOrderDetails.orderDate = getTodayDateInYYYYMMDD();

      await this.generateOrderNo(this.workOrderDetails.orderDate);
    }

    this.saveWorkJob(false);
  };

  markJobWorkOutRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: this.workOrderDetails.id } }
        ]
      }
    });
    await query
      .remove()
      .then(async (data) => {
        console.log('Deleted data removed' + data);
        this.workOrderDetails = {};
      })
      .catch((error) => {
        console.log('Deleted data deletion Failed ' + error);
      });
  };

  setRateList = (isChecked, value) => {
    let rateValue = {
      id: '',
      metal: '',
      purity: '',
      rateByGram: '',
      defaultBool: ''
    };

    rateValue.id = value.id;
    rateValue.metal = value.metal;
    rateValue.purity = value.purity;
    rateValue.rateByGram = value.rateByGram;
    rateValue.defaultBool = value.defaultBool;

    if (isChecked) {
      if (typeof this.workOrderDetails.rateList === 'undefined') {
        this.workOrderDetails.rateList = [];
      }

      this.workOrderDetails.rateList.push(rateValue);
      this.prepareRateList();
    } else {
      let indexToRemove = -1;
      for (var i = 0; i < this.workOrderDetails.rateList.length; i++) {
        if (value.metal === this.workOrderDetails.rateList[i].metal) {
          indexToRemove = i;
          break;
        }
      }
      if (indexToRemove !== -1) {
        this.workOrderDetails.rateList.splice(indexToRemove, 1);
        this.prepareRateList();
      }
    }
  };

  addRateToList = (value) => {
    let rateValue = {
      id: '',
      metal: '',
      purity: '',
      rateByGram: '',
      defaultBool: ''
    };

    rateValue.id = value.id;
    rateValue.metal = value.metal;
    rateValue.purity = value.purity;
    rateValue.rateByGram = value.rateByGram;
    rateValue.defaultBool = value.defaultBool;

    if (typeof this.workOrderDetails.rateList === 'undefined') {
      this.workOrderDetails.rateList = [];
    }

    this.workOrderDetails.rateList.push(rateValue);
    this.prepareRateList();
  };

  prepareRateList = () => {
    this.chosenMetalString = '';
    this.chosenMetalList = [];
    if (
      this.workOrderDetails.rateList &&
      this.workOrderDetails.rateList.length > 0
    ) {
      for (var i = 0; i < this.workOrderDetails.rateList.length; i++) {
        this.chosenMetalString += this.workOrderDetails.rateList[i].metal;
        if (i !== this.workOrderDetails.rateList.length - 1) {
          this.chosenMetalString += ', ';
        }
      }
      if (this.chosenMetalString !== '') {
        this.chosenMetalList = this.chosenMetalString
          .split(',')
          .map((item) => item.trim());
      }
    }
  };

  setInvoiceRegularSetting = (invoiceRegular) => {
    runInAction(() => {
      this.jobWorkOutInvoiceRegular = invoiceRegular;
    });
  };

  setInvoiceThermalSetting = (invoicThermal) => {
    runInAction(() => {
      this.jobWorkOutInvoiceThermal = invoicThermal;
    });
  };

  resetJobWorkOutPrintData = async () => {
    runInAction(() => {
      this.printJobWorkOutData = {};
      this.openJobWorkOutPrintSelectionAlert = false;
    });
  };

  handleOpenJobWorkOutLoadingMessage = async () => {
    runInAction(() => {
      this.openJobWorkOutLoadingAlertMessage = true;
    });
  };

  handleCloseJobWorkOutLoadingMessage = async () => {
    runInAction(() => {
      this.openJobWorkOutLoadingAlertMessage = false;
    });
  };

  handleOpenJobWorkOutErrorAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkOutErrorAlertMessage = true;
    });
  };

  handleCloseJobWorkOutErrorAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkOutErrorAlertMessage = false;
    });
  };

  handleOpenJobWorkOutPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkOutPrintSelectionAlert = true;
    });
  };

  handleCloseJobWorkOutPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkOutPrintSelectionAlert = false;
    });
  };

  handleOpenSequenceNumberFailureAlert = async () => {
    runInAction(() => {
      this.sequenceNumberFailureAlert = true;
    });
  };

  handleCloseSequenceNumberFailureAlert = async () => {
    runInAction(() => {
      this.sequenceNumberFailureAlert = false;
    });
  };

  constructor() {
    makeObservable(this, {
      handleNewOrderInvoice: action,
      OpenNewOrderInvoice: observable,
      isUpdate: observable,
      items: observable,
      workOrderDetails: observable,
      OpenNewOrderIn: observable,
      getTotalWeight: computed,
      viewAndRestoreJobWorkOutItem: action,
      restoreJobWorkOutItem: action,
      isRestore: observable,
      addRateToList: action,
      setRateList: action,
      chosenMetalList: observable,
      printJobWorkOutData: observable,
      openJobWorkOutLoadingAlertMessage: observable,
      openJobWorkOutErrorAlertMessage: observable,
      openJobWorkOutPrintSelectionAlert: observable,
      sequenceNumberFailureAlert: observable
    });
  }
}
export default new JobWorkStore();
