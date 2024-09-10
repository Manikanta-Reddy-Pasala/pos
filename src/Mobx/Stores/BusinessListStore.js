import { action, observable, makeObservable } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import axios from 'axios';

class BusinessListStore {
  businessList = [];

  mobileNumber = '';

  userName = '';

  token = '';

  triggerEvent = false;
  customerSupportDialog = false;

  deviceName = '';

  defaultBusiness = {
    businessId: '',
    businessCity: '',
    businessArea: '',
    businessName: '',
    selectedBusinness: false,
    posFeature: [],
    level1Categories: [],
    onlinePOSPermission: false,
    createBillPermission: false,
    globalCategory: '',
    planName: '',
    admin: false,
    enableEway: false,
    enableEinvoice: false,
    enableCustomer: false,
    enableVendor: false,
    subscriptionEndDate: ''
  };

  business = {
    businessId: '',
    businessCity: '',
    businessArea: '',
    businessName: '',
    updatedAt: Date.now(),
    selectedBusinness: false,
    posFeature: [],
    level1Categories: [],
    onlinePOSPermission: false,
    createBillPermission: false,
    globalCategory: '',
    planName: '',
    admin: false,
    enableEway: false,
    enableEinvoice: false,
    subscriptionEndDate: ''
  };

  setUserName = async (id) => {
    this.mobileNumber = id;
  };

  setToken = async (id) => {
    this.token = id;
  };

  saveData = async (data) => {
    this.userName = data.userName;
    localStorage.setItem('userName', data.userName);

    this.businessList = data.businessList;

    const db = await Db.get();
    for (const bd of this.businessList) {
      this.business.businessId = bd.businessId;
      this.business.businessCity = bd.businessCity;
      this.business.businessArea = bd.businessArea;
      this.business.businessName = bd.businessName;
      this.business.updatedAt = Date.now();
      this.business.selectedBusinness = false;
      this.business.posFeature = bd.pos_features;
      this.business.level1Categories = bd.level1_categories;
      this.business.online_pos_permission = bd.online_pos_permission;
      this.business.billing_invoice_enabled = bd.billing_invoice_enabled;
      this.business.globalCategory = bd.globalCategory;
      this.business.planName = bd.planName;
      this.business.admin = bd.admin;
      this.business.enableEway = bd.enableEway;
      this.business.enableEinvoice = bd.enableEinvoice;
      this.business.enableCustomer = bd.enableCustomer;
      this.business.enableVendor = bd.enableVendor;
      this.business.subscriptionEndDate = bd.subscriptionEndDate;

      await db.businesslist
        .insert(this.business)
        .then((data) => {
        })
        .catch((err) => {
          console.log('Business List Failed::', err);
        });
    }
  };

  updateData = async (data) => {
    let businessList = data.businessList;
    const db = await Db.get();

    for (const bd of businessList) {
      const businessListData = await db.businesslist
        .findOne({ selector: { businessId: bd.businessId } })
        .exec();

      const changeData = (oldData) => {
        oldData.businessCity = bd.businessCity;
        oldData.businessArea = bd.businessArea;
        oldData.businessName = bd.businessName;
        oldData.updatedAt = Date.now();
        oldData.posFeature = bd.pos_features;
        oldData.level1Categories = bd.level1_categories;
        oldData.onlinePOSPermission = bd.online_pos_permission;
        oldData.createBillPermission = bd.billing_invoice_enabled;
        oldData.globalCategory = bd.globalCategory;
        oldData.planName = bd.planName;
        oldData.admin = bd.admin;
        oldData.enableEway = bd.enableEway;
        oldData.enableEinvoice = bd.enableEinvoice;
        oldData.enableCustomer = bd.enableCustomer;
        oldData.enableVendor = bd.enableVendor;
        oldData.subscriptionEndDate = bd.subscriptionEndDate;

        return oldData;
      };

      if (businessListData) {
        await businessListData.atomicUpdate(changeData);
      }
    }
  };

  updateSelectedBusiness = async (item) => {
    const db = await Db.get();
    console.log('update selected business');

    if (item) {
      //make existing selected business to false

      const existingBusinessListData = await db.businesslist
        .findOne({ selector: { selectedBusinness: true } })
        .exec();

      const existingChangeData = (oldData) => {
        oldData.selectedBusinness = false;
        oldData.updatedAt = Date.now();

        return oldData;
      };

      if (existingBusinessListData) {
        await existingBusinessListData.atomicUpdate(existingChangeData);
      }

      // make selected new business to true
      const businessListData = await db.businesslist
        .findOne({ selector: { businessId: item.businessId } })
        .exec();

      const changeData = (oldData) => {
        oldData.selectedBusinness = true;
        oldData.updatedAt = Date.now();

        return oldData;
      };

      if (businessListData) {
        await businessListData.atomicUpdate(changeData);
      }
    }

    /**
     * check for existing pos device Id
     * if not present call an api to get devce ID
     * after getting device id store in table and local storage
     */

    if (localStorage.getItem('posDeviceId') === null) {
      const businessId = item.businessId;
      const businessCity = item.businessCity;
      const phoneNumber = localStorage.getItem('mobileNumber');
      // const token = localStorage.getItem('token');
      const API_SERVER = window.REACT_APP_API_SERVER;
      await axios
        .post(
          API_SERVER + '/v1/pos/device/getDeviceId',
          {
            businessId,
            businessCity,
            phoneNumber
          }
          // {
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //     user_type: 'partner',
          //     'content-type': 'application/json'
          //   }
          // }
        )
        .then((response) => {
          let deviceId = 1;
          if (response.data.deviceId) {
            deviceId = response.data.deviceId;
          }

          localStorage.setItem('posId', deviceId);
          /**
           * save to db
           */
          let data = {
            deviceId: deviceId || 1
          };

          db.deviceid
            .insert(data)
            .then(() => {
              console.log('data Inserted');
            })
            .catch((err) => {
              console.log('data insertion Failed::', err);
            });
        });
    }
  };

  setTriggerEvent = () => {
    this.triggerEvent = true;
  };

  getTriggerEvent = () => {
    return this.triggerEvent;
  };

  handleCustomerSupportCloseDialog = () => {
    this.customerSupportDialog = false;
  };

  handleCustomerSupportDialogOpen = () => {
    this.customerSupportDialog = true;
  };

  setDeviceName = (value) => {
    this.deviceName = value;
  };

  constructor() {
    makeObservable(this, {
      userName: observable,
      mobileNumber: observable,
      token: observable,
      businessList: observable,
      saveData: action,
      setUserName: action,
      updateSelectedBusiness: action,
      triggerEvent: observable,
      setTriggerEvent: action,
      getTriggerEvent: action,
      customerSupportDialog: observable,
      handleCustomerSupportCloseDialog: action,
      handleCustomerSupportDialogOpen: action,
      deviceName: observable
    });
  }
}
export default new BusinessListStore();
