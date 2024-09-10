import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';

class MultiDeviceSettingsStore {
  multiDeviceSettingsData = {
    businessId: '',
    businessCity: '',
    updatedAt: 0,
    posId: 0,
    deviceName: '',
    deviceId: '',
    billOnlyOnline: true,
    autoInjectLocalDeviceNo: false,
    showLocalDeviceNoPopUpBeforeInject: false,
    sales: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: [],
      noPrefixSequenceNo: 0
    },
    salesReturn: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: [],
      noPrefixSequenceNo: 0
    },
    paymentIn: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: [],
      noPrefixSequenceNo: 0
    },
    paymentOut: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: [],
      noPrefixSequenceNo: 0
    },
    billTypes: [],
    salesQuotation: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    approval: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    jobWorkOrderIn: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    jobWorkOrderOut: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    workOrderReceipt: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    deliveryChallan: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    purchaseOrder: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    saleOrder: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    manufacture: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    expense: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    stock: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    tallyReceipt: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    scheme: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    },
    tallyPayment: {
      prefixes: '',
      subPrefixes: '',
      prefixesList: [],
      subPrefixesList: [],
      appendYear: false,
      prefixSequence: []
    }
  };

  multiDeviceSettings = [];

  getMultiDeviceSettings = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    console.log('Device Name: ', localStorage.getItem('deviceName'));
    await db.multidevicesettings
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { deviceName: { $eq: localStorage.getItem('deviceName') } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          return;
        }

        if (data) {
          runInAction(() => {
            this.multiDeviceSettingsData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.multiDeviceSettingsData;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const query = db.multidevicesettings.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { deviceName: { $eq: localStorage.getItem('deviceName') } }
        ]
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addMultiDeviceSetting();
        } else {
          await query
            .exec()
            .then(async (data) => {
              if (!data) {
                await this.saveData();
                return;
              }

              const transactionData = await db.multidevicesettings
                .findOne({
                  selector: {
                    $and: [
                      { businessId: { $eq: businessData.businessId } },
                      {
                        deviceName: { $eq: localStorage.getItem('deviceName') }
                      }
                    ]
                  }
                })
                .exec();

              const changeData = (oldData) => {
                oldData.businessId = businessData.businessId;
                oldData.businessCity = businessData.businessCity;
                oldData.updatedAt = Date.now();
                oldData.posId = parseFloat(businessData.posDeviceId);
                oldData.deviceName = this.multiDeviceSettingsData.deviceName;
                oldData.deviceId = this.multiDeviceSettingsData.deviceId;
                oldData.billOnlyOnline =
                  this.multiDeviceSettingsData.billOnlyOnline;
                oldData.autoInjectLocalDeviceNo =
                  this.multiDeviceSettingsData.autoInjectLocalDeviceNo;
                oldData.showLocalDeviceNoPopUpBeforeInject =
                  this.multiDeviceSettingsData.showLocalDeviceNoPopUpBeforeInject;
                oldData.sales.prefixSequence =
                  this.multiDeviceSettingsData.sales.prefixSequence;
                oldData.salesReturn.prefixSequence =
                  this.multiDeviceSettingsData.salesReturn.prefixSequence;
                oldData.paymentIn.prefixSequence =
                  this.multiDeviceSettingsData.paymentIn.prefixSequence;
                oldData.paymentOut.prefixSequence =
                  this.multiDeviceSettingsData.paymentOut.prefixSequence;
                oldData.salesQuotation.prefixSequence =
                  this.multiDeviceSettingsData.salesQuotation.prefixSequence;
                oldData.approval.prefixSequence =
                  this.multiDeviceSettingsData.approval.prefixSequence;
                oldData.jobWorkOrderIn.prefixSequence =
                  this.multiDeviceSettingsData.jobWorkOrderIn.prefixSequence;
                oldData.jobWorkOrderOut.prefixSequence =
                  this.multiDeviceSettingsData.jobWorkOrderOut.prefixSequence;
                oldData.workOrderReceipt.prefixSequence =
                  this.multiDeviceSettingsData.workOrderReceipt.prefixSequence;
                oldData.deliveryChallan.prefixSequence =
                  this.multiDeviceSettingsData.deliveryChallan.prefixSequence;
                oldData.purchaseOrder.prefixSequence =
                  this.multiDeviceSettingsData.purchaseOrder.prefixSequence;
                oldData.saleOrder.prefixSequence =
                  this.multiDeviceSettingsData.saleOrder.prefixSequence;
                oldData.manufacture.prefixSequence =
                  this.multiDeviceSettingsData.manufacture.prefixSequence;
                oldData.expense.prefixSequence =
                  this.multiDeviceSettingsData.expense.prefixSequence;
                oldData.stock.prefixSequence =
                  this.multiDeviceSettingsData.stock.prefixSequence;
                oldData.tallyReceipt.prefixSequence =
                  this.multiDeviceSettingsData.tallyReceipt.prefixSequence;
                oldData.scheme.prefixSequence =
                  this.multiDeviceSettingsData.scheme.prefixSequence;
                oldData.tallyPayment.prefixSequence =
                  this.multiDeviceSettingsData.tallyPayment.prefixSequence;
                return oldData;
              };

              if (transactionData) {
                await transactionData.atomicUpdate(changeData);
                console.log('this.multiDeviceSettingsData:: Data Updated');
              }
            })
            .catch((err) => {
              console.log('this.multiDeviceSettingsData:: Internal Server Error', err);
            });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  addMultiDeviceSetting = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.multiDeviceSettingsData.businessId = businessData.businessId;
      this.multiDeviceSettingsData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.multiDeviceSettingsData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    await db.multidevicesettings
      .insert(InsertDoc)
      .then(() => {
        console.log('multi device data Inserted');
      })
      .catch((err) => {
        console.log('data insertion Failed::', err);
      });
  };

  saveSinglePrefix = async (property, subProperty, value, seqNoValue) => {
    runInAction(() => {
      this.multiDeviceSettingsData[property][subProperty] = [];
      let prefixSequence = {};
      prefixSequence.prefix = value;
      prefixSequence.sequenceNumber = seqNoValue === '' ? 1 : seqNoValue;
      this.multiDeviceSettingsData[property][subProperty].push(prefixSequence);
    });
    this.saveData();
  };

  setBillOnlyOnline = (value) => {
    runInAction(() => {
      this.multiDeviceSettingsData.billOnlyOnline = value;
    });
    this.saveData();
  };

  setAutoInjectLocalDeviceNo = (value) => {
    runInAction(() => {
      this.multiDeviceSettingsData.autoInjectLocalDeviceNo = value;
    });
    this.saveData();
  };

  setShowLocalDeviceNoPopUpBeforeInject = (value) => {
    runInAction(() => {
      this.multiDeviceSettingsData.showLocalDeviceNoPopUpBeforeInject = value;
    });
    this.saveData();
  };

  resetMultiDeviceData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    let deviceName = localStorage.getItem('deviceName');

    const query = db.multidevicesettings.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            deviceName: { $eq: localStorage.getItem('deviceName') }
          }
        ]
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        const transactionData = await db.multidevicesettings
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                {
                  deviceName: { $eq: localStorage.getItem('deviceName') }
                }
              ]
            }
          })
          .exec();

        const changeData = (oldData) => {
          oldData.businessId = businessData.businessId;
          oldData.businessCity = businessData.businessCity;
          oldData.updatedAt = Date.now();
          oldData.posId = parseFloat(businessData.posDeviceId);
          oldData.deviceName = localStorage.getItem('deviceName');
          oldData.deviceId = this.multiDeviceSettingsData.deviceId;
          oldData.billOnlyOnline = this.multiDeviceSettingsData.billOnlyOnline;
          oldData.autoInjectLocalDeviceNo =
            this.multiDeviceSettingsData.autoInjectLocalDeviceNo;
          oldData.showLocalDeviceNoPopUpBeforeInject =
            this.multiDeviceSettingsData.showLocalDeviceNoPopUpBeforeInject;

          let salesPrefixSequenceList = [];
          let salesSequenceObj = {};
          salesSequenceObj.prefix = deviceName;
          salesSequenceObj.sequenceNumber = 1;
          salesPrefixSequenceList.push(salesSequenceObj);
          oldData.sales.prefixSequence = salesPrefixSequenceList;

          let salesReturnPrefixSequenceList = [];
          let salesReturnSequenceObj = {};
          salesReturnSequenceObj.prefix = deviceName;
          salesReturnSequenceObj.sequenceNumber = 1;
          salesReturnPrefixSequenceList.push(salesReturnSequenceObj);
          oldData.salesReturn.prefixSequence = salesReturnPrefixSequenceList;

          let paymentInPrefixSequenceList = [];
          let paymentInSequenceObj = {};
          paymentInSequenceObj.prefix = deviceName;
          paymentInSequenceObj.sequenceNumber = 1;
          paymentInPrefixSequenceList.push(paymentInSequenceObj);
          oldData.paymentIn.prefixSequence = paymentInPrefixSequenceList;

          let paymentOutPrefixSequenceList = [];
          let paymentOutSequenceObj = {};
          paymentOutSequenceObj.prefix = deviceName;
          paymentOutSequenceObj.sequenceNumber = 1;
          paymentOutPrefixSequenceList.push(paymentOutSequenceObj);
          oldData.paymentOut.prefixSequence = paymentOutPrefixSequenceList;

          let salesQuotationPrefixSequenceList = [];
          let salesQuotationSequenceObj = {};
          salesQuotationSequenceObj.prefix = deviceName;
          salesQuotationSequenceObj.sequenceNumber = 1;
          salesQuotationPrefixSequenceList.push(salesQuotationSequenceObj);
          oldData.salesQuotation.prefixSequence =
            salesQuotationPrefixSequenceList;

          let approvalPrefixSequenceList = [];
          let approvalSequenceObj = {};
          approvalSequenceObj.prefix = deviceName;
          approvalSequenceObj.sequenceNumber = 1;
          approvalPrefixSequenceList.push(approvalSequenceObj);
          oldData.approval.prefixSequence = approvalPrefixSequenceList;

          let jobWorkOrderInPrefixSequenceList = [];
          let jobWorkOrderInSequenceObj = {};
          jobWorkOrderInSequenceObj.prefix = deviceName;
          jobWorkOrderInSequenceObj.sequenceNumber = 1;
          jobWorkOrderInPrefixSequenceList.push(jobWorkOrderInSequenceObj);
          oldData.jobWorkOrderIn.prefixSequence =
            jobWorkOrderInPrefixSequenceList;

          let jobWorkOrderOutPrefixSequenceList = [];
          let jobWorkOrderOutSequenceObj = {};
          jobWorkOrderOutSequenceObj.prefix = deviceName;
          jobWorkOrderOutSequenceObj.sequenceNumber = 1;
          jobWorkOrderOutPrefixSequenceList.push(jobWorkOrderOutSequenceObj);
          oldData.jobWorkOrderOut.prefixSequence =
            jobWorkOrderOutPrefixSequenceList;

          let workOrderReceiptPrefixSequenceList = [];
          let workOrderReceiptSequenceObj = {};
          workOrderReceiptSequenceObj.prefix = deviceName;
          workOrderReceiptSequenceObj.sequenceNumber = 1;
          workOrderReceiptPrefixSequenceList.push(workOrderReceiptSequenceObj);
          oldData.workOrderReceipt.prefixSequence =
            workOrderReceiptPrefixSequenceList;

          let deliveryChallanPrefixSequenceList = [];
          let deliveryChallanSequenceObj = {};
          deliveryChallanSequenceObj.prefix = deviceName;
          deliveryChallanSequenceObj.sequenceNumber = 1;
          deliveryChallanPrefixSequenceList.push(deliveryChallanSequenceObj);
          oldData.deliveryChallan.prefixSequence =
            deliveryChallanPrefixSequenceList;

          let purchaseOrderPrefixSequenceList = [];
          let purchaseOrderSequenceObj = {};
          purchaseOrderSequenceObj.prefix = deviceName;
          purchaseOrderSequenceObj.sequenceNumber = 1;
          purchaseOrderPrefixSequenceList.push(purchaseOrderSequenceObj);

          oldData.purchaseOrder.prefixSequence =
            purchaseOrderPrefixSequenceList;

          let saleOrderPrefixSequenceList = [];
          let saleOrderSequenceObj = {};
          saleOrderSequenceObj.prefix = deviceName;
          saleOrderSequenceObj.sequenceNumber = 1;
          saleOrderPrefixSequenceList.push(saleOrderSequenceObj);
          oldData.saleOrder.prefixSequence = saleOrderPrefixSequenceList;

          let manufacturePrefixSequenceList = [];
          let manufactureSequenceObj = {};
          manufactureSequenceObj.prefix = deviceName;
          manufactureSequenceObj.sequenceNumber = 1;
          manufacturePrefixSequenceList.push(manufactureSequenceObj);
          oldData.manufacture.prefixSequence = manufacturePrefixSequenceList;

          let expensePrefixSequenceList = [];
          let expenseSequenceObj = {};
          expenseSequenceObj.prefix = deviceName;
          expenseSequenceObj.sequenceNumber = 1;
          expensePrefixSequenceList.push(expenseSequenceObj);
          oldData.expense.prefixSequence = expensePrefixSequenceList;

          let stockPrefixSequenceList = [];
          let stockSequenceObj = {};
          stockSequenceObj.prefix = deviceName;
          stockSequenceObj.sequenceNumber = 1;
          stockPrefixSequenceList.push(stockSequenceObj);
          oldData.stock.prefixSequence = stockPrefixSequenceList;

          let tallyPrefixPrefixSequenceList = [];
          let tallyPrefixSequenceObj = {};
          tallyPrefixSequenceObj.prefix = deviceName;
          tallyPrefixSequenceObj.sequenceNumber = 1;
          tallyPrefixPrefixSequenceList.push(tallyPrefixSequenceObj);
          oldData.tallyReceipt.prefixSequence = tallyPrefixPrefixSequenceList;

          let schemePrefixPrefixSequenceList = [];
          let schemePrefixSequenceObj = {};
          schemePrefixSequenceObj.prefix = deviceName;
          schemePrefixSequenceObj.sequenceNumber = 1;
          schemePrefixPrefixSequenceList.push(schemePrefixSequenceObj);
          oldData.scheme.prefixSequence = schemePrefixPrefixSequenceList;

          let tallyPaymentPrefixSequenceList = [];
          let tallyPaymentPrefixSequenceObj = {};
          tallyPaymentPrefixSequenceObj.prefix = deviceName;
          tallyPaymentPrefixSequenceObj.sequenceNumber = 1;
          tallyPaymentPrefixSequenceList.push(tallyPaymentPrefixSequenceObj);
          oldData.tallyPayment.prefixSequence = tallyPaymentPrefixSequenceList;

          return oldData;
        };

        if (transactionData) {
          await transactionData.atomicUpdate(changeData);
          console.log('multidevice:: Data Reset');
        }
      })
      .catch((err) => {
        console.log('multidevice:: Internal Server Error', err);
      });
  };

  constructor() {
    makeObservable(this, {
      multiDeviceSettingsData: observable,
      getMultiDeviceSettings: action
    });
  }
}
export default new MultiDeviceSettingsStore();