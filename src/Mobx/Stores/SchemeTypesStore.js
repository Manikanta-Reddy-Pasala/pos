import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import SchemeTypes from './classes/SchemeTypes';

class SchemeTypesStore {
  schemeTypesDialogOpen = false;
  schemeTypesList = [];
  isSchemeTypesList = false;
  isEdit = false;

  constructor() {
    this.schemeTypes = new SchemeTypes().getDefaultValues();
    this.schemeTypesDefault = new SchemeTypes().getDefaultValues();

    makeObservable(this, {
      schemeTypes: observable,
      schemeTypesDialogOpen: observable,
      handleSchemeTypesModalOpen: action,
      handleSchemeTypesModalClose: action,
      schemeTypesList: observable,
      getSchemeTypesCount: action
    });
  }

  handleSchemeTypesModalOpen = () => {
    runInAction(() => {
      this.schemeTypesDialogOpen = true;
    });
  };

  handleSchemeTypesModalClose = () => {
    runInAction(() => {
      this.schemeTypesDialogOpen = false;
      this.isEdit = false;
    });
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('scht');
    this.schemeTypes.id = `${id}${appId}${timestamp}`;
    this.schemeTypes.businessId = businessData.businessId;
    this.schemeTypes.businessCity = businessData.businessCity;
    this.schemeTypes.posId = parseFloat(businessData.posDeviceId);
    this.schemeTypes.updatedAt = Date.now();

    let InsertDoc = { ...this.schemeTypes };
    InsertDoc = new SchemeTypes().convertTypes(InsertDoc);

    await db.schemetypes
      .insert(InsertDoc)
      .then(() => {
        console.log('this.schemeTypes:: data Inserted' + InsertDoc);
        runInAction(() => {
          this.isEdit = false;
          this.schemeTypes = this.schemeTypesDefault;
          this.getSchemeTypes();
        });
      })
      .catch((err) => {
        console.log('this.schemeTypesxpense:: data insertion Failed::', err);
      });

    runInAction(() => {
      this.schemeTypesDialogOpen = false;
    });
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.schemetypes
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.schemeTypes.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No scheme types data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.id = oldTxnData.id;
        newTxnData.updatedAt = Date.now();
        newTxnData.name = this.schemeTypes.name;

        await db.schemetypes
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: { $eq: this.schemeTypes.id } }
              ]
            }
          })
          .update({
            $set: {
              name: newTxnData.name,
              updatedAt: newTxnData.updatedAt
            }
          })
          .then(async () => {
            console.log('scheme types update success');
            runInAction(() => {
              this.schemeTypes = this.schemeTypesDefault;
              this.isEdit = false;
              this.getSchemeTypes();
            });
          });
      })
      .catch((error) => {
        console.log('scheme types update Failed ' + error);
      });

    runInAction(() => {
      this.schemeTypesDialogOpen = false;
      this.isEdit = false;
    });
  };

  setName = (value) => {
    runInAction(() => {
      this.schemeTypes.name = value;
    });
  };

  deleteSchemeTypesData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.schemetypes.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: item.id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('scheme types data removed' + data);
        runInAction(() => {
          this.schemeTypes = this.schemeTypesDefault;
          this.getSchemeTypes();
        });
      })
      .catch((error) => {
        console.log('scheme types deletion Failed ' + error);
      });
  };

  getSchemeTypes = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.schemeTypesList = [];
    const query = db.schemetypes.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        runInAction(() => {
          this.schemeTypesList = data.map((item) => item.toJSON());
        });
      }
    });

    return this.schemeTypesList;
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.schemetypes
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: item.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No scheme types data is found so cannot update any information
          return;
        }

        runInAction(() => {
          this.schemeTypes.businessCity = data.businessCity;
          this.schemeTypes.businessId = data.businessId;
          this.schemeTypes.name = data.name;
          this.schemeTypes.id = data.id;

          this.schemeTypesDialogOpen = true;
        });
      })
      .catch((error) => {
        console.log('scheme types update Failed ' + error);
      });
  };

  resetSingleSchemeTypeData = async () => {
    /**
     * reset to defaults
     */
    runInAction(() => {
      this.schemeTypes = this.schemeTypesDefault;
    });
  };

  getSchemeTypesCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.schemetypes.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isSchemeTypesList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('scheme types Count Internal Server Error', err);
      });
  };
}
export default new SchemeTypesStore();