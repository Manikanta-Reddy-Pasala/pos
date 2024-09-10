import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import TDS from './classes/TDS';

class TDSStore {
  tdsDialogOpen = false;
  tdsList = [];
  isTDSList = false;
  isEdit = false;

  constructor() {
    this.tds = new TDS().getDefaultValues();
    this.tdsDefault = new TDS().getDefaultValues();

    makeObservable(this, {
      tds: observable,
      tdsDialogOpen: observable,
      handleTDSModalOpen: action,
      handleTDSModalClose: action,
      tdsList: observable,
      getTDSCount: action
    });
  }

  handleTDSModalOpen = () => {
    this.tds = this.tdsDefault;
    this.tdsDialogOpen = true;
  };

  handleTDSModalClose = () => {
    this.tdsDialogOpen = false;
    this.isEdit = false;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('tds');
    this.tds.id = `${id}${appId}${timestamp}`;
    this.tds.businessId = businessData.businessId;
    this.tds.businessCity = businessData.businessCity;
    this.tds.posId = parseFloat(businessData.posDeviceId);
    this.tds.updatedAt = Date.now();

    let InsertDoc = { ...this.tds };
    InsertDoc = new TDS().convertTypes(InsertDoc);

    await db.tds
      .insert(InsertDoc)
      .then(() => {
        console.log('this.tds:: data Inserted' + InsertDoc);
        this.isEdit = false;
        this.getTDS();
      })
      .catch((err) => {
        console.log('this.tds:: data insertion Failed::', err);
      });

    this.tdsDialogOpen = false;
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.tds
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.tds.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No tds data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.id = oldTxnData.id;
        newTxnData.updatedAt = Date.now();
        newTxnData.code = this.tds.code;
        newTxnData.name = this.tds.name;
        newTxnData.rate = this.tds.rate;
        newTxnData.isSyncedToServer = this.tds.isSyncedToServer;

        await db.tds
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: { $eq: this.tds.id } }
              ]
            }
          })
          .update({
            $set: {
              code: newTxnData.code,
              name: newTxnData.name,
              rate: newTxnData.rate,
              updatedAt: newTxnData.updatedAt
            }
          })
          .then(async () => {
            console.log('tds update success');
            this.tds = this.tdsDefault;
            this.isEdit = false;
            this.getTDS();
          });
      })
      .catch((error) => {
        console.log('tds update Failed ' + error);
      });

    this.tdsDialogOpen = false;
    this.isEdit = false;
  };

  setTDSName = (value) => {
    this.tds.name = value;
  };

  setTDSCode = (value) => {
    this.tds.code = value;
  };

  setTDSRate = (value) => {
    this.tds.rate = value;

    if (parseFloat(value) > 0) {
      this.tds.rate = value ? parseFloat(value) : '';
    } else {
      this.tds.rate = '';
    }
  };

  deleteTDSData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.tds.find({
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
        console.log('tds data removed' + data);
        runInAction(() => {
          this.tds = this.tdsDefault;
          this.getTDS();
        });
      })
      .catch((error) => {
        console.log('tds deletion Failed ' + error);
      });
  };

  getTDS = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.tdsList = [];
    
    const query = db.tds.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.tdsList = data.map((item) => item.toJSON());
      }
    });

    return this.tdsList;
  };

  getTDSDataByName = async (name) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    
    let foundData = {
      code: '',
      name: '',
      rate: 0
    };
    const query = db.tds.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { name: { $eq: name } }
        ]
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        let tdsMatchList = data.map((item) => item.toJSON());

        foundData.name = tdsMatchList[0].name;
        foundData.rate = tdsMatchList[0].rate;
        foundData.code = tdsMatchList[0].code;
      }

    });

    return foundData;
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.tds
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
          // No tds data is found so cannot update any information
          return;
        }

        this.tds.businessCity = data.businessCity;
        this.tds.businessId = data.businessId;
        this.tds.code = data.code;
        this.tds.name = data.name;
        this.tds.rate = data.rate;
        this.tds.id = data.id;

        this.tdsDialogOpen = true;
      })
      .catch((error) => {
        console.log('tds update Failed ' + error);
      });
  };

  resetSingleTDSData = async () => {
    /**
     * reset to defaults
     */
    this.tds = this.tdsDefault;
  };

  getTDSCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.tds.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isTDSList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('tds Count Internal Server Error', err);
      });
  };
}
export default new TDSStore();