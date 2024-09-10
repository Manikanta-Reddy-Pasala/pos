import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import EmployeeTypes from './classes/EmployeeTypes';

import  {getEmployeeTypes, getEmployeeTypesCount, deleteEmployeeTypesById, updateEmployeeTypes}  from 'src/components/Helpers/dbQueries/employeetypes';

class EmployeeTypesStore {
  employeeTypesDialogOpen = false;
  employeeTypesList = [];
  isemployeeTypesList = false;
  isEdit = false;

  constructor() {
    this.employeeTypes = new EmployeeTypes().getDefaultValues();
    this.employeeTypesDefault = new EmployeeTypes().getDefaultValues();

    makeObservable(this, {
      employeeTypes: observable,
      employeeTypesDialogOpen: observable,
      handleEmployeeTypesModalOpen: action,
      handleEmployeeTypesModalClose: action,
      employeeTypesList: observable,
      getAllEmployeeTypes: action,
    });
  }

  handleEmployeeTypesModalOpen = () => {
    runInAction(() => {
      this.employeeTypesDialogOpen = true;
    });
  };

  handleEmployeeTypesModalClose = () => {
    runInAction(() => {
      this.employeeTypesDialogOpen = false;
      this.isEdit = false;
    });
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('scht');
    this.employeeTypes.id = `${id}${appId}${timestamp}`;
    this.employeeTypes.businessId = businessData.businessId;
    this.employeeTypes.businessCity = businessData.businessCity;
    this.employeeTypes.posId = parseFloat(businessData.posDeviceId);
    this.employeeTypes.updatedAt = Date.now();

    let InsertDoc = { ...this.employeeTypes };
    InsertDoc = new EmployeeTypes().convertTypes(InsertDoc);

    await db.employeetypes
      .insert(InsertDoc)
      .then(async () => {
        console.log('this.employeeTypes:: data Inserted' + InsertDoc);
        runInAction(async () => {
          this.isEdit = false;
          this.employeeTypes = this.employeeTypesDefault;
           this.employeeTypesList = await getEmployeeTypes();
        });
      })
      .catch((err) => {
        console.log('this.employeeTypesxpense:: data insertion Failed::', err);
      });

    runInAction(() => {
      this.employeeTypesDialogOpen = false;
    });
  };

  getAllEmployeeTypes = async() => {
   this.employeeTypesList = await getEmployeeTypes('', false);
  }

  updateData = async () => {

    const data = await getEmployeeTypes(this.employeeTypes.id);

    if(data) {

      let newTxnData = {};
      newTxnData.id = data.id;
      newTxnData.updatedAt = Date.now();
      newTxnData.name = this.employeeTypes.name;
    
      await updateEmployeeTypes(this.employeeTypes.id, {
        name: newTxnData.name,
        updatedAt: newTxnData.updatedAt
      }).then(async () => {
        runInAction(async () => {
          this.employeeTypes = this.employeeTypesDefault;
          this.isEdit = false;
          this.employeeTypesList = await getEmployeeTypes();
        });
      });
      }

    runInAction(() => {
      this.employeeTypesDialogOpen = false;
      this.isEdit = false;
    });
  };

  setName = (value) => {
    runInAction(() => {
      this.employeeTypes.name = value;
    });
  };

  deleteEmployeeTypesData = async (item) => {

    const deleted = await deleteEmployeeTypesById(item.id);

    if(deleted){
      this.employeeTypes = this.employeeTypesDefault;
      this.employeeTypesList = await getEmployeeTypes();
    }

  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const data = await getEmployeeTypes(item.id);

    if (!data) {
        runInAction(() => {
          this.employeeTypes.businessCity = data.businessCity;
          this.employeeTypes.businessId = data.businessId;
          this.employeeTypes.name = data.name;
          this.employeeTypes.id = data.id;

          this.employeeTypesDialogOpen = true;
        });
      } 

  };


  getEmployeeTypesCount = async () => {

    this.isEmployeeTypesList = await getEmployeeTypesCount();
  }

  resetSingleEmployeeTypesData = async () => {
    /**
     * reset to defaults
     */
    runInAction(() => {
      this.employeeTypes = this.employeeTypesDefault;
    });
  };


}
export default new EmployeeTypesStore();