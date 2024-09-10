import { observable, makeObservable, runInAction, action } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

class POSUserPermissionStore {
  selectedEmployee = {};
  selectedFeatureList = [];

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.posuserpermissions
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

        await db.posuserpermissions
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
              posFeatures: this.selectedFeatureList,
              name: this.selectedEmployee.name,
              userName: this.selectedEmployee.userName
            }
          })
          .then(async () => {
            console.log('pos user permission update success');
          });
      })
      .catch((error) => {
        console.log('pos user permission update Failed ' + error);
      });
  };

  setEmployeeSelected = (employee) => {
    this.selectedEmployee = employee;
  };

  setFeaturesSelected = (features) => {
    this.selectedFeatureList = features;
  };

  updateFeatureSelection = (index, checkedValue) => {
    this.selectedFeatureList[index].selected = checkedValue;
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
export default new POSUserPermissionStore();
