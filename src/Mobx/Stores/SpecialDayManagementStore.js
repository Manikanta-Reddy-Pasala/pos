import { action, observable, makeObservable } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';

class SpecialDayManagementStore {
  addSpecialDayDialogOpen = false;
  isEdit = false;

  specialDayManagementData = {
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    timings: '',
    updatedAt: 0,
    businessId: '',
    businessCity: '',
    posId: 0
  };

  defaultSpecialDayManagementData = {
    id: '',
    name: '',
    startDate: '',
    endDate: '',
    timings: '',
    updatedAt: 0,
    businessId: '',
    businessCity: '',
    posId: 0
  };

  spealDayManagementList = [];

  generateSpecialDayId = async () => {
    console.log('inside generateSpecialDayId');
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('bi');
    this.specialDayManagementData.id = `${id}${appId}${timestamp}`;
  };

  handleAddSpecialDayDialog = (status) => {
    this.addSpecialDayDialogOpen = status;
  };

  deleteSpecialDay = async (specialDay) => {
    console.log(specialDay);
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();
    const query = db.specialdays.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: specialDay.id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('specialdays data removed' + data);
      })
      .catch((error) => {
        console.log('specialdays deletion Failed ' + error);
      });
  };

  saveData = async () => {
    const db = await Db.get();

    this.specialDayManagementData.updatedAt = Date.now();

    const businessData = await Bd.getBusinessData();
    this.specialDayManagementData.businessId = businessData.businessId;
    this.specialDayManagementData.businessCity = businessData.businessCity;
    this.specialDayManagementData.posId = parseFloat(businessData.posDeviceId);

    if (!this.isEdit) {
      // console.log('InsertDoc::', InsertDoc);

      await this.generateSpecialDayId();

      await db.specialdays
        .insert(this.specialDayManagementData)
        .then((data) => {
          console.log('data Inserted:', data);
          this.specialDayManagementData = this.defaultSpecialDayManagementData;
          this.handleCloseDialog();
        })
        .catch((err) => {
          console.log('Error in saving specialdays :', err);
        });
    } else {
      const businessData = await Bd.getBusinessData();

      const query = db.specialdays.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.specialDayManagementData.id } }
          ]
        }
      });

      await query
        .exec()
        .then(async (data) => {
          if (!data) {
            // No data is found so cannot update any information
            return;
          }

          await query
            .update({
              $set: {
                name: this.specialDayManagementData.name,
                startDate: this.specialDayManagementData.startDate,
                endDate: this.specialDayManagementData.endDate,
                timings: this.specialDayManagementData.timings,
                businessId: this.specialDayManagementData.businessId,
                businessCity: this.specialDayManagementData.businessCity,
                updatedAt: Date.now(),
                posId: this.specialDayManagementData.posId
              }
            })
            .then(async () => {
              console.log('inside update specialdays');
              this.handleCloseDialog();
              this.isEdit = false;
            });
        })
        .catch((err) => {
          console.log('Internal Server Error specialdays ', err);
        });
    }
  };

  viewOrSpecialDayManagment = async (specialDay) => {
    //get data from Db and assign to variable
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.specialdays
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: specialDay.id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data) {
          this.specialDayManagementData.name = data.name;
          this.specialDayManagementData.startDate = data.startDate;
          this.specialDayManagementData.endDate = data.endDate;
          this.specialDayManagementData.timings = data.timings;
          this.specialDayManagementData.businessId = data.businessId;
          this.specialDayManagementData.businessCity = data.businessCity;
          this.specialDayManagementData.id = data.id;
          this.specialDayManagementData.posId = data.posId;
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    this.isEdit = true;
    this.handleAddSpecialDayDialog(true);
  };

  handleCloseDialog = () => {
    this.addSpecialDayDialogOpen = false;
  };

  setSpecialDayProperty = (property, value) => {
    this.specialDayManagementData[property] = value;
  };

  constructor() {
    makeObservable(this, {
      handleAddSpecialDayDialog: action,
      addSpecialDayDialogOpen: observable,
      specialDayManagementData: observable,
      handleCloseDialog: action,
      spealDayManagementList: observable
    });
  }
}
export default new SpecialDayManagementStore();
