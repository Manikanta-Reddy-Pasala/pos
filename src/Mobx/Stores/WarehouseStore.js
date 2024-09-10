import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import Warehouse from './classes/Warehouse';

class WarehouseStore {
  warehouseDialogOpen = false;
  warehouseList = [];
  isWarehouseList = false;
  isEdit = false;

  constructor() {
    this.warehouse = new Warehouse().getDefaultValues();
    this.warehouseDefault = new Warehouse().getDefaultValues();

    makeObservable(this, {
      warehouse: observable,
      warehouseDialogOpen: observable,
      handleWarehouseModalOpen: action,
      handleWarehouseModalClose: action,
      warehouseList: observable,
      getWarehouseCount: action
    });
  }

  handleWarehouseModalOpen = () => {
    this.warehouseDialogOpen = true;
  };

  handleWarehouseModalClose = () => {
    this.warehouseDialogOpen = false;
    this.isEdit = false;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('w');
    this.warehouse.id = `${id}${appId}${timestamp}`;
    this.warehouse.businessId = businessData.businessId;
    this.warehouse.businessCity = businessData.businessCity;
    this.warehouse.posId = parseFloat(businessData.posDeviceId);
    this.warehouse.updatedAt = Date.now();

    let InsertDoc = { ...this.warehouse };
    InsertDoc = new Warehouse().convertTypes(InsertDoc);

    await db.warehouse
      .insert(InsertDoc)
      .then(() => {
        console.log('this.warehouse:: data Inserted' + InsertDoc);
        this.isEdit = false;
        this.warehouse = this.warehouseDefault;
        this.getWarehouse();
      })
      .catch((err) => {
        console.log('this.warehouse:: data insertion Failed::', err);
      });

    this.warehouseDialogOpen = false;
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.warehouse
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.warehouse.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No warehouse data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.id = oldTxnData.id;
        newTxnData.updatedAt = Date.now();
        newTxnData.name = this.warehouse.name;
        newTxnData.isSyncedToServer = this.warehouse.isSyncedToServer;

        await db.warehouse
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: { $eq: this.warehouse.id } }
              ]
            }
          })
          .update({
            $set: {
              name: newTxnData.name,
              updatedAt: newTxnData.updatedAt,
              isSyncedToServer: newTxnData.isSyncedToServer
            }
          })
          .then(async () => {
            console.log('warehouse update success');
            this.warehouse = this.warehouseDefault;
            this.isEdit = false;
            this.getWarehouse();
          });
      })
      .catch((error) => {
        console.log('warehouse update Failed ' + error);
      });

    this.warehouseDialogOpen = false;
    this.isEdit = false;
  };

  setWarehouseName = (value) => {
    this.warehouse.name = value;
  };

  deleteWarehouseData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.warehouse.find({
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
        console.log('warehouse data removed' + data);
        runInAction(() => {
          this.warehouse = this.warehouseDefault;
          this.getWarehouse();
        });
      })
      .catch((error) => {
        console.log('warehouse deletion Failed ' + error);
      });
  };

  getWarehouse = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.warehouseList = [];
    const query = db.warehouse.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.warehouseList = data.map((item) => item.toJSON());
      }
    });

    return this.warehouseList;
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.warehouse
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
          // No warehouse data is found so cannot update any information
          return;
        }

        this.warehouse.businessCity = data.businessCity;
        this.warehouse.businessId = data.businessId;
        this.warehouse.name = data.name;
        this.warehouse.id = data.id;
        this.warehouse.isSyncedToServer = data.isSyncedToServer;

        this.warehouseDialogOpen = true;
      })
      .catch((error) => {
        console.log('warehouse update Failed ' + error);
      });
  };

  resetSingleWarehouseData = async () => {
    /**
     * reset to defaults
     */
    this.warehouse = this.warehouseDefault;
  };

  getWarehouseCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.warehouse.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isWarehouseList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('warehouse Count Internal Server Error', err);
      });
  };
}
export default new WarehouseStore();