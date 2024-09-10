import { observable, makeObservable, runInAction, action } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

class MobileUserPermissionStore {
  selectedEmployee = {};
  selectedFeatureList = [];

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.mobileuserpermissions
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { name: { $eq: this.selectedEmployee.name } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No rate data is found so cannot update any information
          return;
        }

        await db.mobileuserpermissions
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { name: { $eq: this.selectedEmployee.name } }
              ]
            }
          })
          .update({
            $set: {
              posId: parseFloat(businessData.posDeviceId),
              updatedAt: Date.now(),
              businessId: businessData.businessId,
              businessCity: businessData.businessCity,
              businessFeatures: this.selectedFeatureList,
              name: this.selectedEmployee.name,
              userName: this.selectedEmployee.userName
            }
          })
          .then(async () => {
            console.log('mobile user permission update success');
          });
      })
      .catch((error) => {
        console.log('mobile user permission update Failed ' + error);
      });
  };

  setEmployeeSelected = (employee) => {
    this.selectedEmployee = employee;
  };

  setFeaturesSelected = (features) => {
    this.selectedFeatureList = features;
  };

  updateFeatureSelection = (index, checkedValue) => {
    this.selectedFeatureList[index].permission = checkedValue;
  };

  constructor() {
    makeObservable(this, {
      selectedEmployee: observable,
      selectedFeatureList: observable,
      updateData: action
    });
  }
}

// this is to make this component public so that it is assible from other componets
export default new MobileUserPermissionStore();
