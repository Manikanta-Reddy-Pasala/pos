import { action, observable, makeObservable, runInAction, toJS } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import { getTodayDateInYYYYMMDD } from '../../components/Helpers/DateHelper';

class JobWorkReceiptStore {
  // ---------------------------------------------------ORDER OUT ---------------------------------------------------------------

  //Order Receipt
  openNewOrderReceipt = false;

  isUpdate = false;
  orderInvoiceList = [];

  sequenceNumberFailureAlert = false;

  //Order Receipt
  handleNewOrderReceipt = async (status) => {
    //reset old data
    await this.resetAllData();
    runInAction(() => {
      this.openNewOrderReceipt = status;

      if (status === false) {
        this.isUpdate = false;
      }
    });
  };

  closeDialog = () => {
    runInAction(() => {
      this.openNewOrderReceipt = false;
    });
  };

  workOrderReceiptDetails = {
    businessId: '',
    businessCity: '',
    receiptDate: getTodayDateInYYYYMMDD(),
    receiptSequenceNumber: '',
    receiptNotes: '',
    invoiceSequenceNumber: '',
    id: '',
    jobWorkId: '',
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
    purity: '',
    grossWeight: '',
    netWeight: '',
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
    isSyncedToServer: false
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
    items: [],
    vendorGstType: '',
    vendorEmailId: ''
  };

  items = [
    {
      itemId: '',
      orderReceiptChecked: false,
      itemName: '',
      weight: '',
      copperWeight: '',
      kdmWeight: '',
      toPay: '',
      amount: 0,
      isEdit: true
    }
  ];

  isRestore = false;

  printJobWorkReceiptData = null;
  openJobWorkReceiptLoadingAlertMessage = false;
  openJobWorkReceiptErrorAlertMessage = false;

  openJobWorkReceiptPrintSelectionAlert = false;

  jobWorkReceiptInvoiceRegular = {};
  jobWorkReceiptInvoiceThermal = {};

  setEditTable = (index) => {
    this.items = this.items.map((data, idx) => ({
      ...data,
      isEdit: idx === index ? true : false
    }));
  };

  setOrderReceiptChecked = (index, value) => {
    runInAction(() => {
      this.items[index].orderReceiptChecked = value;
    });

    const totalAmount = this.items.reduce((a, b) => {
      if (b.orderReceiptChecked) {
        const amount = toJS(b.amount);
        if (!Number.isNaN(amount)) {
          a = parseFloat(a) + parseFloat(amount);
        }
      }
      return a;
    }, 0);

    runInAction(() => {
      this.workOrderReceiptDetails.totalAmount = totalAmount;
      this.workOrderReceiptDetails.subTotalAmount = totalAmount;
    });
  };

  setWorkOrderReceiptItemProperty = async (property, value, index) => {
    this.items[index][property] = value;
    if (property === 'amount' && this.items[index]['amount'] !== '') {
      this.workOrderReceiptDetails['subTotalAmount'] = this.getTotalAmount();
      this.workOrderReceiptDetails['totalAmount'] = this.getTotalAmount();
    }
    this.getTotalWeightPerItem();
  };

  setWorkOrderReceiptProperty = async (property, value) => {
    this.workOrderReceiptDetails[property] = value;
  };

  deleteItemRow = async (index) => {
    this.items.splice(index, 1);
    console.log(this.items);
    this.workOrderReceiptDetails['subTotalAmount'] = this.getTotalAmount();
    this.workOrderReceiptDetails['totalAmount'] = this.getTotalAmount();
    this.items = this.items.map((data, index) => ({
      ...data,
      isEdit: this.items.length - 1 === index ? true : false
    }));
  };

  getTotalAmount = () => {
    console.log(this.items);
    const totalAmount = this.items.reduce((a, b) => {
      console.log(b);
      if (b.orderReceiptChecked) {
        const amount = toJS(b.amount);
        if (!Number.isNaN(amount)) {
          a = parseFloat(a) + parseFloat(amount);
        }
      }
      return a;
    }, 0);

    runInAction(() => {
      this.workOrderReceiptDetails.totalAmount = totalAmount;
      this.workOrderReceiptDetails.subTotalAmount = totalAmount;
    });

    return totalAmount;
  };

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
        transSettings.workOrderReceipt.prefixSequence &&
        transSettings.workOrderReceipt.prefixSequence.length > 0
          ? transSettings.workOrderReceipt.prefixSequence[0].prefix
          : '';
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      data.prefix = localStorage.getItem('deviceName');
      data.subPrefix = 'WO';
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

  generateOrderReceiptNo = async (date, id) => {
    this.workOrderReceiptDetails.receiptSequenceNumber =
      await this.getSequenceNumber('jobListReceipt', date, id);
  };

  saveJobWorkReceipt = async (saveAndNew, items, isPrint) => {
    const db = await Db.get();

    //clear empty rows
    let filteredArray = [];

    for (let item of items) {
      let item_json = toJS(item);

      if (item.isEdit === '' || item.isEdit === null) {
        item.isEdit = true;
      }

      if (item.amount === '' || item.amount === null) {
        item.amount = 0;
      }

      if (parseFloat(item_json.amount) > 0) {
        filteredArray.push(item);
      }
    }

    this.items = filteredArray;

    const businessData = await Bd.getBusinessData();
    runInAction(() => {
      this.workOrderReceiptDetails.businessId = businessData.businessId;
      this.workOrderReceiptDetails.businessCity = businessData.businessCity;
      this.workOrderReceiptDetails.posId = parseFloat(businessData.posDeviceId);
    });

    if (
      this.workOrderReceiptDetails.subTotalAmount === '' ||
      this.workOrderReceiptDetails.subTotalAmount === null
    ) {
      this.workOrderReceiptDetails.subTotalAmount = 0;
    }

    if (
      this.workOrderReceiptDetails.totalAmount === '' ||
      this.workOrderReceiptDetails.totalAmount === null
    ) {
      this.workOrderReceiptDetails.totalAmount = 0;
    }

    if (this.workOrderReceiptDetails.receiptSequenceNumber === '') {
      await this.generateOrderReceiptNo(
        this.workOrderReceiptDetails.orderDate,
        this.workOrderReceiptDetails.id
      );
    }

    if (this.workOrderReceiptDetails.receiptSequenceNumber === '0') {
      this.workOrderReceiptDetails.receiptSequenceNumber = '';
      this.handleCloseJobWorkReceiptLoadingMessage();
      this.handleOpenSequenceNumberFailureAlert();
      return;
    }

    const InsertDoc = {
      ...this.workOrderReceiptDetails
    };

    InsertDoc.itemList = filteredArray;
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

    await this.updateJobWorkTableWithGeneratedReceipts(this.items);

    if (!this.isUpdate) {
      await allTxn.saveTxnFromJobWorkOutReceipt(InsertDoc, db);
    } else {
      await allTxn.deleteAndSaveTxnFromJobWorkOutReceipt(
        InsertDoc,
        InsertDoc,
        db
      );
    }

    if (this.isRestore) {
      await this.deleteJobWorkFromDeletedList(InsertDoc);
    }

    let userAction = 'Save';

    if (this.isRestore) {
      userAction = 'Restore';
    }

    //save to audit
    await audit.addAuditEvent(
      InsertDoc.id,
      InsertDoc.receiptSequenceNumber,
      'Order Receipt',
      userAction,
      JSON.stringify(InsertDoc),
      '',
      InsertDoc.receiptDate
    );

    await db.jobworkreceipt
      .insert(InsertDoc)
      .then((data) => {
        this.handleCloseJobWorkReceiptLoadingMessage();
        if (
          this.jobWorkReceiptInvoiceRegular &&
          this.jobWorkReceiptInvoiceRegular.boolDefault &&
          isPrint
        ) {
          this.printJobWorkReceiptData = InsertDoc;

          if (saveAndNew) {
            this.handleNewOrderReceipt(true);
          } else {
            this.closeDialog();
          }
          this.resetAllData();

          this.handleOpenJobWorkReceiptPrintSelectionAlertMessage();
        } else {
          if (saveAndNew) {
            this.handleNewOrderReceipt(true);
          } else {
            this.closeDialog();
          }
          this.resetAllData();
        }
      })
      .catch((err) => {
        console.error('Error in Adding WorkJob', err);

        //save to audit
        audit.addAuditEvent(
          InsertDoc.id,
          InsertDoc.receiptSequenceNumber,
          'Order Receipt',
          userAction,
          JSON.stringify(InsertDoc),
          err.message ? err.message : 'Order Receipt Failed',
          InsertDoc.receiptDate
        );

        this.handleCloseJobWorkReceiptLoadingMessage();
        this.handleOpenJobWorkReceiptErrorAlertMessage();
      });
  };

  updateJobWorkTableWithGeneratedReceipts = async (items) => {
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

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          //do nothing
        } else {
          //update item list
          let newItemList = [];
          let count = 0;
          for (let item of data.itemList) {
            let filteredData = items.filter((ele) => {
              return ele.itemId === item.itemId;
            });

            if (filteredData.length > 0) {
              item.receiptCreated = true;
            }

            if (item.receiptCreated === true) {
              count++;
            }
            newItemList.push(item);
          }

          let fullReceipt = data.fullReceipt;
          let partialReceipt = data.partialReceipt;
          if (count === data.itemList.length) {
            fullReceipt = true;
            partialReceipt = false;
          } else {
            fullReceipt = false;
            partialReceipt = true;
          }

          await query
            .update({
              $set: {
                fullReceipt: fullReceipt,
                partialReceipt: partialReceipt,
                itemList: newItemList
              }
            })
            .then(async (data) => {});
        }
      })
      .catch((err) => {
        console.log(
          'Internal Server Error while updating jobwork table from jobwork receipts',
          err
        );
      });
  };

  deleteJobWorkTableWithGeneratedReceipts = async (jobWorkReceipt) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.jobwork.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: jobWorkReceipt.jobWorkId } }
        ]
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          //do nothing
        } else {
          //update item list
          let newItemList = [];
          let count = 0;
          for (let item of data.itemList) {
            let filteredData = jobWorkReceipt.itemList.filter((ele) => {
              return ele.itemId === item.itemId;
            });

            if (filteredData.length > 0) {
              item.receiptCreated = false;
            }

            if (item.receiptCreated === true) {
              count++;
            }
            newItemList.push(item);
          }

          let fullReceipt = data.fullReceipt;
          let partialReceipt = data.partialReceipt;
          if (count === data.itemList.length) {
            fullReceipt = true;
            partialReceipt = false;
          } else {
            fullReceipt = false;
            partialReceipt = true;
          }

          await query
            .update({
              $set: {
                fullReceipt: fullReceipt,
                partialReceipt: partialReceipt,
                itemList: newItemList
              }
            })
            .then(async (data) => {
              //updated job work
              console.log(data);
            });
        }
      })
      .catch((err) => {
        console.log(
          'Internal Server Error while updating jobwork table from jobwork receipts',
          err
        );
      });
  };

  saveOrUpdateJobWorkReceipt = async (saveAndNew, isPrint) => {
    //generate id
    if (
      this.workOrderReceiptDetails.id === '' ||
      this.workOrderReceiptDetails.id === undefined
    ) {
      const timestamp = Math.floor(Date.now() / 1000);
      const businessData = await Bd.getBusinessData();

      const appId = businessData.posDeviceId;
      const id = _uniqueId('jwr');
      this.workOrderReceiptDetails.id = `${id}${appId}${timestamp}`;
    }

    if (
      this.isUpdate &&
      this.workOrderReceiptDetails.receiptSequenceNumber.length === 0
    ) {
      this.workOrderReceiptDetails.receiptSequenceNumber =
        await this.getSequenceNumber(
          'jobListReceipt',
          this.workOrderReceiptDetails.orderDate,
          this.workOrderReceiptDetails.id
        );
    }

    //if there is only one item then auto select the item
    if (this.items.length === 1) {
      this.items[0].orderReceiptChecked = true;
      //calculate total amount
      this.workOrderReceiptDetails['subTotalAmount'] = this.getTotalAmount();
      this.workOrderReceiptDetails['totalAmount'] = this.getTotalAmount();
    }

    let returnedItems = 0;
    for (let i = this.items.length - 1; i >= 0; --i) {
      if (
        this.items[i].orderReceiptChecked === false ||
        !this.items[i].orderReceiptChecked
      ) {
        returnedItems += 1;
      }
    }

    if (this.items.length - returnedItems === 0) {
      alert('Please check atleast one product to generate receipt');
      return;
    } else {
      for (let i = this.items.length - 1; i >= 0; --i) {
        if (
          this.items[i].orderReceiptChecked === false ||
          !this.items[i].orderReceiptChecked
        ) {
          this.items.splice(i, 1);
        }
      }
    }

    let productsList = [];

    for (let item of this.items) {
      if (item.amount === '') {
        item.amount = 0;
      }
      delete item['orderReceiptChecked'];
      productsList.push(item);
    }

    this.items = productsList;

    await this.saveJobWorkReceipt(saveAndNew, productsList, isPrint);
  };

  deleteOrderReceipt = async (item) => {
    let DeleteDataDoc = {
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      total: 0,
      balance: 0,
      data: ''
    };

    let restoreJobworkReceiptData = {};
    restoreJobworkReceiptData = item;
    restoreJobworkReceiptData.itemList = item.itemList;
    restoreJobworkReceiptData.employeeId = item.employeeId;

    DeleteDataDoc.transactionId = item.id;
    DeleteDataDoc.sequenceNumber = item.receiptSequenceNumber;
    DeleteDataDoc.transactionType = 'Work Order Receipt';
    DeleteDataDoc.data = JSON.stringify(restoreJobworkReceiptData);
    DeleteDataDoc.total = item.totalAmount;
    DeleteDataDoc.balance = 0;
    DeleteDataDoc.createdDate = item.orderDate;

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.jobworkreceipt.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: item.id } }
        ]
      }
    });

    await allTxn.deleteTxnFromJobWorkOutReceipt(item, db);

    await deleteTxn.addDeleteEvent(DeleteDataDoc);

    this.deleteJobWorkTableWithGeneratedReceipts(item);

    //save to audit
    await audit.addAuditEvent(
      restoreJobworkReceiptData.id,
      restoreJobworkReceiptData.receiptSequenceNumber,
      'Order Receipt',
      'Delete',
      JSON.stringify(restoreJobworkReceiptData),
      '',
      restoreJobworkReceiptData.receiptDate
    );

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        } else {
          await query.remove().then(async (data) => {
            this.resetAllData();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        //save to audit
        audit.addAuditEvent(
          restoreJobworkReceiptData.id,
          restoreJobworkReceiptData.receiptSequenceNumber,
          'Order Receipt',
          'Delete',
          JSON.stringify(restoreJobworkReceiptData),
          err.message,
          restoreJobworkReceiptData.receiptDate
        );
      });
  };

  handleOrderReceiptSearch = async (value) => {
    const db = await Db.get();
    let data;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    await db.jobworkreceipt
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              $or: [
                { receiptSequenceNumber: { $regex: regexp } },
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
      });
    return data;
  };

  searchJobWorkByInvoiceSequenceNumber = async (value) => {
    runInAction(() => {
      this.workOrderReceiptDetails.invoiceSequenceNumber = value;
    });
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query = await db.jobwork.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { invoiceSequenceNumber: { $eq: value } }
        ]
      }
    });

    await query.exec().then((data) => {
      this.loadJobWorkDataForReceipt(data);
    });
  };

  resetAllData = () => {
    this.isRestore = false;
    this.workOrderReceiptDetails = {
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
      receiptDate: getTodayDateInYYYYMMDD(),
      receiptSequenceNumber: '',
      receiptNotes: '',
      orderNotes: '',
      fullReceipt: false,
      partialReceipt: false,
      purity: '',
      grossWeight: '',
      netWeight: '',
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
      isSyncedToServer: false
    };

    this.items = [
      {
        itemId: '',
        orderReceiptChecked: false,
        itemName: '',
        weight: '',
        copperWeight: '',
        kdmWeight: '',
        toPay: '',
        amount: 0,
        isEdit: true
      }
    ];
  };

  // ------------------------------------------------------- ORDER IN ---------------------------------------------------------

  //view Work Order Receipt
  viewOrderReceipt = async (data) => {
    this.openNewOrderReceipt = true;
    this.isUpdate = true;
    this.workOrderReceiptDetails = data;

    for (let item of data.itemList) {
      item.orderReceiptChecked = true;
    }

    this.items = data.itemList;
  };

  //Convert to Work Order Receipt
  convertToReceipt = async (item) => {
    this.openNewOrderReceipt = true;
    this.isUpdate = false;

    await this.loadJobWorkDataForReceipt(item);
  };

  getTotalWeightPerItem = async (index) => {
    if (!this.items[index]) {
      return 0;
    }

    this.items[index].toPay =
      parseFloat(this.items[index].weight || 0) +
      parseFloat(this.items[index].copperWeight || 0) +
      parseFloat(this.items[index].kdmWeight || 0);
  };

  addWorkOrderReceiptRow = () => {
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
      orderReceiptChecked: false,
      weight: '',
      copperWeight: '',
      kdmWeight: '',
      toPay: '',
      amount: 0,
      isEdit: true
    });
  };

  handleOrderReceiptSearchByDateAndEmployee = async (
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

      query = await db.jobworkreceipt.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { receiptSequenceNumber: { $regex: regexp } },
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
            }
          ]
        }
      });
    } else {
      const businessData = await Bd.getBusinessData();

      query = await db.jobworkreceipt.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { receiptSequenceNumber: { $regex: regexp } },
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
            }
          ]
        }
      });
    }

    await query.exec().then((documents) => {
      data = documents.map((item) => item);
    });
    return data;
  };

  loadJobWorkDataForReceipt = async (data) => {
    if (data) {
      runInAction(() => {
        let jsonData = data;

        //reset few fileds
        this.workOrderReceiptDetails.jobWorkId = data.id;
        this.workOrderReceiptDetails.receiptDate = getTodayDateInYYYYMMDD();
        this.workOrderReceiptDetails.totalAmount = 0;
        this.workOrderReceiptDetails.subTotalAmount = 0;
        this.workOrderReceiptDetails.receiptSequenceNumber = '';
        this.workOrderReceiptDetails.id = '';

        this.workOrderReceiptDetails.invoiceSequenceNumber =
          jsonData.invoiceSequenceNumber;
        this.workOrderReceiptDetails.orderDate = jsonData.orderDate;
        this.workOrderReceiptDetails.dueDate = jsonData.dueDate;
        this.workOrderReceiptDetails.vendorId = jsonData.vendorId;
        this.workOrderReceiptDetails.vendorName = jsonData.vendorName;
        this.workOrderReceiptDetails.vendorPhoneNo = jsonData.vendorPhoneNo;
        this.workOrderReceiptDetails.vendorGstNumber = jsonData.vendorGstNumber;
        this.workOrderReceiptDetails.vendorAddress = jsonData.vendorAddress;
        this.workOrderReceiptDetails.vendorPhoneNo = jsonData.vendorPhoneNo;
        this.workOrderReceiptDetails.orderNotes = jsonData.orderNotes;
        this.workOrderReceiptDetails.purity = jsonData.purity;
        this.workOrderReceiptDetails.grossWeight = jsonData.grossWeight;
        this.workOrderReceiptDetails.netWeight = jsonData.netWeight;
        this.workOrderReceiptDetails.workOrderType = jsonData.workOrderType;
        this.workOrderReceiptDetails.vendorCity = jsonData.vendorCity;
        this.workOrderReceiptDetails.vendorPincode = jsonData.vendorPincode;
        this.workOrderReceiptDetails.vendorState = jsonData.vendorState;
        this.workOrderReceiptDetails.vendorCountry = jsonData.vendorCountry;
        this.workOrderReceiptDetails.vendorGstType = jsonData.vendorGstType;
        this.workOrderReceiptDetails.vendorEmailId = jsonData.vendorEmailId;
        this.workOrderReceiptDetails.isSyncedToServer = false;

        this.workOrderDetails = { ...jsonData };
        this.workOrderDetails.items = jsonData.itemList;

        //remove already receipt generated products
        let filteredArray = [];

        for (let item of jsonData.itemList) {
          if (!item.receiptCreated) {
            let itemData = {
              itemId: item.itemId,
              orderReceiptChecked: false,
              itemName: item.itemName,
              weight: item.weight,
              copperWeight: item.copperWeight,
              kdmWeight: item.kdmWeight,
              toPay: item.toPay,
              amount: item.amount,
              isEdit: item.isEdit
            };

            filteredArray.push(itemData);
          }
        }
        this.items = filteredArray;
      });
    }
  };

  viewAndRestoreJobWorkReceiptItem = async (item) => {
    // console.log('data' + toJS(item));
    runInAction(() => {
      this.openNewOrderReceipt = true;
      this.isUpdate = false;
      this.isRestore = true;
      this.workOrderReceiptDetails = item;
      this.workOrderReceiptDetails.employeeId = item.employeeId;
    });

    for (let it of item.itemList) {
      it.orderReceiptChecked = true;
    }

    runInAction(() => {
      this.items = item.itemList;
    });
  };

  restoreJobWorkReceiptItem = async (item, isRestoreWithNextSequenceNo) => {
    runInAction(() => {
      this.isUpdate = false;
      this.isRestore = true;
      this.workOrderReceiptDetails = item;
      this.workOrderReceiptDetails.employeeId = item.employeeId;
    });

    for (let it of item.itemList) {
      it.orderReceiptChecked = true;
    }

    runInAction(() => {
      this.items = item.itemList;
    });

    if (isRestoreWithNextSequenceNo) {
      const businessData = await Bd.getBusinessData();
      //generate id
      const timestamp = Math.floor(Date.now() / 1000);
      const appId = businessData.posDeviceId;
      const id = _uniqueId('jwr');
      this.workOrderReceiptDetails.id = `${id}${appId}${timestamp}`;

      await this.generateOrderReceiptNo(this.workOrderReceiptDetails.orderDate);

      runInAction(() => {
        this.workOrderReceiptDetails.orderDate = getTodayDateInYYYYMMDD();
      });
    }

    this.saveJobWorkReceipt(false, item.itemList);
  };

  deleteJobWorkFromDeletedList = async (workOrderReceiptDetails) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    console.log('Deleted data id' + workOrderReceiptDetails.id);

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            transactionId: { $eq: workOrderReceiptDetails.id }
          }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('Deleted data removed' + data);
      })
      .catch((err) => {
        console.log('Deleted data deletion Failed ' + err);
      });
  };

  setInvoiceRegularSetting = (invoiceRegular) => {
    runInAction(() => {
      this.jobWorkReceiptInvoiceRegular = invoiceRegular;
    });
  };

  setInvoiceThermalSetting = (invoicThermal) => {
    runInAction(() => {
      this.jobWorkReceiptInvoiceThermal = invoicThermal;
    });
  };

  resetJobWorkReceiptPrintData = async () => {
    runInAction(() => {
      this.printJobWorkReceiptData = {};
      this.openJobWorkReceiptPrintSelectionAlert = false;
    });
  };

  handleOpenJobWorkReceiptLoadingMessage = async () => {
    runInAction(() => {
      this.openJobWorkReceiptLoadingAlertMessage = true;
    });
  };

  handleCloseJobWorkReceiptLoadingMessage = async () => {
    runInAction(() => {
      this.openJobWorkReceiptLoadingAlertMessage = false;
    });
  };

  handleOpenJobWorkReceiptErrorAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkReceiptErrorAlertMessage = true;
    });
  };

  handleCloseJobWorkReceiptErrorAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkReceiptErrorAlertMessage = false;
    });
  };

  handleOpenJobWorkReceiptPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkReceiptPrintSelectionAlert = true;
    });
  };

  handleCloseJobWorkReceiptPrintSelectionAlertMessage = async () => {
    runInAction(() => {
      this.openJobWorkReceiptPrintSelectionAlert = false;
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
      handleNewOrderReceipt: action,
      convertToReceipt: action,
      addWorkOrderReceiptRow: action,
      openNewOrderReceipt: observable,
      isUpdate: observable,
      items: observable,
      workOrderReceiptDetails: observable,
      getTotalWeightPerItem: action,
      workOrderDetails: observable,
      viewAndRestoreJobWorkReceiptItem: action,
      restoreJobWorkReceiptItem: action,
      printJobWorkReceiptData: observable,
      openJobWorkReceiptLoadingAlertMessage: observable,
      openJobWorkReceiptErrorAlertMessage: observable,
      openJobWorkReceiptPrintSelectionAlert: observable,
      sequenceNumberFailureAlert: observable
    });
  }
}
export default new JobWorkReceiptStore();
