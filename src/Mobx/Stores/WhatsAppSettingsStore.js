import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';

class WhatsAppSettingsStore {
  whatsAppSettingsDataList = [];

  openLoader = false;
  messageOpen = false;
  singleCustomerData = {};

  partyType = '';

  whatsAppSettingsData = {
    whatsAppLinkedEnabled: false,
    whatsAppBarcode: '',
    saleTransactionAlertEnabled: false,
    purchaseTransactionAlertEnabled: false,
    saleReturnTransactionAlertEnabled: false,
    purchaseReturnTransactionAlertEnabled: false,
    estimateTransactionAlertEnabled: false,
    receivePayTransactionAlertEnabled: false,
    makePayTransactionAlertEnabled: false,
    creditPaymentReminderAlertEnabled: false,
    creditPaymentReminderAlertDays: 0,
    templeCustomerRitualReminderAlertEnabled: false,
    templeCustomerRitualReminderAlertDays: 0,
    updatedAt: Date.now(),
    businessId: '',
    businessCity: '',
    linkedPhoneNumber: ''
  };

  defaultWhatsAppSettingsData = {
    whatsAppLinkedEnabled: false,
    whatsAppBarcode: '',
    saleTransactionAlertEnabled: false,
    purchaseTransactionAlertEnabled: false,
    saleReturnTransactionAlertEnabled: false,
    purchaseReturnTransactionAlertEnabled: false,
    estimateTransactionAlertEnabled: false,
    receivePayTransactionAlertEnabled: false,
    makePayTransactionAlertEnabled: false,
    creditPaymentReminderAlertEnabled: false,
    creditPaymentReminderAlertDays: 0,
    templeCustomerRitualReminderAlertEnabled: false,
    templeCustomerRitualReminderAlertDays: 0,
    updatedAt: Date.now(),
    businessId: '',
    businessCity: '',
    linkedPhoneNumber: ''
  };

  saveData = async () => {
    const db = await Db.get();
    const query = db.whatsappsettings.findOne({
      selector: {
        businessId: this.whatsAppSettingsData.businessId
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          this.addWhatsAppSettingsData();
        } else {
          await query
            .update({
              $set: {
                whatsAppLinkedEnabled:
                  this.whatsAppSettingsData.whatsAppLinkedEnabled,
                whatsAppBarcode: this.whatsAppSettingsData.whatsAppBarcode,
                saleTransactionAlertEnabled:
                  this.whatsAppSettingsData.saleTransactionAlertEnabled,
                purchaseTransactionAlertEnabled:
                  this.whatsAppSettingsData.purchaseTransactionAlertEnabled,
                saleReturnTransactionAlertEnabled:
                  this.whatsAppSettingsData.saleReturnTransactionAlertEnabled,
                purchaseReturnTransactionAlertEnabled:
                  this.whatsAppSettingsData
                    .purchaseReturnTransactionAlertEnabled,
                estimateTransactionAlertEnabled:
                  this.whatsAppSettingsData.estimateTransactionAlertEnabled,
                receivePayTransactionAlertEnabled:
                  this.whatsAppSettingsData.receivePayTransactionAlertEnabled,
                makePayTransactionAlertEnabled:
                  this.whatsAppSettingsData.makePayTransactionAlertEnabled,
                creditPaymentReminderAlertEnabled:
                  this.whatsAppSettingsData.creditPaymentReminderAlertEnabled,
                creditPaymentReminderAlertDays:
                  this.whatsAppSettingsData.creditPaymentReminderAlertDays,
                templeCustomerRitualReminderAlertEnabled:
                  this.whatsAppSettingsData
                    .templeCustomerRitualReminderAlertEnabled,
                templeCustomerRitualReminderAlertDays:
                  this.whatsAppSettingsData
                    .templeCustomerRitualReminderAlertDays,
                updatedAt: Date.now(),
                businessId: this.whatsAppSettingsData.businessId,
                businessCity: this.whatsAppSettingsData.businessCity,
                linkedPhoneNumber: this.whatsAppSettingsData.linkedPhoneNumber
              }
            })
            .then(async (data) => {
              // console.log('inside update', data);
            });
        }
      })
      .catch((err) => {
        console.log('WhatsApp Settings Internal Server Error', err);
      });
  };

  addWhatsAppSettingsData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.whatsAppSettingsData.businessId = businessData.businessId;
      this.whatsAppSettingsData.businessCity = businessData.businessCity;
    });

    const InsertDoc = this.whatsAppSettingsData;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);
    InsertDoc.updatedAt = Date.now();

    // console.log('this.barcode:: dataBase', InsertDoc);

    await db.whatsappsettings
      .insert(InsertDoc)
      .then(() => {
        console.log('whatsapp :: data Inserted');
      })
      .catch((err) => {
        console.log('whatsapp :: data insertion Failed::', err);
      });
  };

  getWhatsAppSettingsData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.whatsappsettings
      .findOne({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        // console.log(data)

        if (data) {
          runInAction(() => {
            this.whatsAppSettingsData.whatsAppLinkedEnabled =
              data.whatsAppLinkedEnabled;
            this.whatsAppSettingsData.whatsAppBarcode = data.whatsAppBarcode;
            this.whatsAppSettingsData.saleTransactionAlertEnabled =
              data.saleTransactionAlertEnabled;
            this.whatsAppSettingsData.purchaseTransactionAlertEnabled =
              data.purchaseTransactionAlertEnabled;
            this.whatsAppSettingsData.saleReturnTransactionAlertEnabled =
              data.saleReturnTransactionAlertEnabled;
            this.whatsAppSettingsData.purchaseReturnTransactionAlertEnabled =
              data.purchaseReturnTransactionAlertEnabled;
            this.whatsAppSettingsData.estimateTransactionAlertEnabled =
              data.estimateTransactionAlertEnabled;
            this.whatsAppSettingsData.receivePayTransactionAlertEnabled =
              data.receivePayTransactionAlertEnabled;
            this.whatsAppSettingsData.makePayTransactionAlertEnabled =
              data.makePayTransactionAlertEnabled;
            this.whatsAppSettingsData.creditPaymentReminderAlertEnabled =
              data.creditPaymentReminderAlertEnabled;
            this.whatsAppSettingsData.creditPaymentReminderAlertDays =
              data.creditPaymentReminderAlertDays;
            this.whatsAppSettingsData.templeCustomerRitualReminderAlertEnabled =
              data.templeCustomerRitualReminderAlertEnabled;
            this.whatsAppSettingsData.templeCustomerRitualReminderAlertDays =
              data.templeCustomerRitualReminderAlertDays;
            this.whatsAppSettingsData.businessId = data.businessId;
            this.whatsAppSettingsData.businessCity = data.businessCity;
            this.whatsAppSettingsData.linkedPhoneNumber =
              data.linkedPhoneNumber;
          });
        }
      })
      .catch((err) => {
        console.log('WhatsApp Internal Server Error', err);
      });
  };

  getWhatsAppSettingsDetails = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.whatsappsettings
      .findOne({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        if (data) {
          runInAction(() => {
            this.whatsAppSettingsData = data.toJSON();
          });
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    return this.whatsAppSettingsData;
  };

  setWhatsAppSettingsData = (params, val) => {
    this.whatsAppSettingsData[params] = val;
  };

  setOpenLoader = (value) => {
    this.openLoader = value;
  };

  handleWhatsAppCustomMessageCloseDialog = () => {
    this.messageOpen = false;
  };

  handleWhatsAppCustomMessageDialogOpen = (data, partyType) => {
    runInAction(() => {
      this.singleCustomerData = data;
      this.partyType = partyType;
      this.messageOpen = true;
    });
  };

  constructor() {
    makeObservable(this, {
      messageOpen: observable,
      singleCustomerData: observable,
      whatsAppSettingsData: observable,
      whatsAppSettingsDataList: observable,
      defaultWhatsAppSettingsData: observable,
      setWhatsAppSettingsData: action,
      addWhatsAppSettingsData: action,
      getWhatsAppSettingsData: action,
      getWhatsAppSettingsDetails: action,
      saveData: action,
      openLoader: observable,
      handleWhatsAppCustomMessageCloseDialog: action,
      handleWhatsAppCustomMessageDialogOpen: action,
      partyType: observable
    });
  }
}
export default new WhatsAppSettingsStore();