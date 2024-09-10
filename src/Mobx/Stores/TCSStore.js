import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import TCS from './classes/TCS';

class TCSStore {
  tcsDialogOpen = false;
  tcsList = [];
  isTCSList = false;
  isEdit = false;

  constructor() {
    this.tcs = new TCS().getDefaultValues();
    this.tcsDefault = new TCS().getDefaultValues();

    makeObservable(this, {
      tcs: observable,
      tcsDialogOpen: observable,
      handleTCSModalOpen: action,
      handleTCSModalClose: action,
      tcsList: observable,
      getTCSCount: action
    });
  }

  handleTCSModalOpen = () => {
    runInAction(() => {
      this.tcs = this.tcsDefault;
      this.tcsDialogOpen = true;
    });
  };

  handleTCSModalClose = () => {
    runInAction(() => {
      this.tcsDialogOpen = false;
      this.isEdit = false;
    });
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('tcs');
    this.tcs.id = `${id}${appId}${timestamp}`;
    this.tcs.businessId = businessData.businessId;
    this.tcs.businessCity = businessData.businessCity;
    this.tcs.posId = parseFloat(businessData.posDeviceId);
    this.tcs.updatedAt = Date.now();

    let InsertDoc = { ...this.tcs };
    InsertDoc = new TCS().convertTypes(InsertDoc);

    await db.tcs
      .insert(InsertDoc)
      .then(() => {
        console.log('this.tcs:: data Inserted' + InsertDoc);
        runInAction(() => {
          this.isEdit = false;
        });
        this.getTCS();
      })
      .catch((err) => {
        console.log('this.tcs:: data insertion Failed::', err);
      });
    runInAction(() => {
      this.tcsDialogOpen = false;
    });
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.tcs
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.tcs.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No tcs data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.id = oldTxnData.id;
        newTxnData.updatedAt = Date.now();
        newTxnData.code = this.tcs.code;
        newTxnData.name = this.tcs.name;
        newTxnData.rate = this.tcs.rate;
        newTxnData.isSyncedToServer = this.tcs.isSyncedToServer;

        await db.tcs
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: { $eq: this.tcs.id } }
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
            console.log('tcs update success');
            runInAction(() => {
              this.tcs = this.tcsDefault;
              this.isEdit = false;
            });
            this.getTCS();
          });
      })
      .catch((error) => {
        console.log('tcs update Failed ' + error);
      });

    runInAction(() => {
      this.tcsDialogOpen = false;
      this.isEdit = false;
    });
  };

  setTCSName = (value) => {
    runInAction(() => {
      this.tcs.name = value;
    });
  };

  setTCSCode = (value) => {
    runInAction(() => {
      this.tcs.code = value;
    });
  };

  setTCSRate = (value) => {
    runInAction(() => {
      this.tcs.rate = value;

      if (parseFloat(value) > 0) {
        this.tcs.rate = value ? parseFloat(value) : '';
      } else {
        this.tcs.rate = '';
      }
    });
  };

  deleteTCSData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.tcs.find({
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
        console.log('tcs data removed' + data);
        runInAction(() => {
          this.tcs = this.tcsDefault;
          this.getTCS();
        });
      })
      .catch((error) => {
        console.log('tcs deletion Failed ' + error);
      });
  };

  getTCS = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.tcsList = [];
    });

    const query = db.tcs.find({
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
          this.tcsList = data.map((item) => item.toJSON());
        });
      }
    });

    return this.tcsList;
  };

  getTCSDataByName = async (name) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let foundData = {
      code: '',
      name: '',
      rate: 0
    };
    const query = db.tcs.find({
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
        let tcsMatchList = data.map((item) => item.toJSON());

        foundData.name = tcsMatchList[0].name;
        foundData.code = tcsMatchList[0].code;
        foundData.rate = tcsMatchList[0].rate;
      }
    });

    return foundData;
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.tcs
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
          // No tcs data is found so cannot update any information
          return;
        }

        runInAction(() => {
          this.tcs.businessCity = data.businessCity;
          this.tcs.businessId = data.businessId;
          this.tcs.code = data.code;
          this.tcs.name = data.name;
          this.tcs.rate = data.rate;
          this.tcs.id = data.id;

          this.tcsDialogOpen = true;
        });
      })
      .catch((error) => {
        console.log('tcs update Failed ' + error);
      });
  };

  resetSingleTCSData = async () => {
    /**
     * reset to defaults
     */
    this.tcs = this.tcsDefault;
  };

  getTCSCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.tcs.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isTCSList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('tcs Count Internal Server Error', err);
      });
  };
}
export default new TCSStore();