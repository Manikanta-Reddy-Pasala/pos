import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import Rates from './classes/Rates';

class RateStore {
  rateDialogOpen = false;
  rateList = [];
  isRateList = false;
  isEdit = false;

  openRateLoadingAlertMessage = false;

  handleRateModalOpen = () => {
    this.rateDialogOpen = true;
    this.rate = this.rateDefault;
  };

  handleRateModalClose = () => {
    this.rateDialogOpen = false;
    this.isEdit = false;
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('r');
    this.rate.id = `${id}${appId}${timestamp}`;
    this.rate.businessId = businessData.businessId;
    this.rate.businessCity = businessData.businessCity;

    this.rate.posId = parseFloat(businessData.posDeviceId);
    this.rate.updatedAt = Date.now();

    let InsertDoc = this.rate;

    await db.rates
      .insert(InsertDoc)
      .then(() => {
        console.log('this.rate:: data Inserted' + InsertDoc);
        this.isEdit = false;
        this.isRateList = true;
      })
      .catch((err) => {
        console.log('this.rate:: data insertion Failed::', err);
      });

    this.rateDialogOpen = false;
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.rates
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.rate.id } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No rate data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.id = oldTxnData.id;
        newTxnData.updatedAt = Date.now();
        newTxnData.metal = this.rate.metal;
        newTxnData.purity = this.rate.purity;
        newTxnData.defaultBool = this.rate.defaultBool;
        newTxnData.isSyncedToServer = this.rate.isSyncedToServer;

        if (this.rate.rateByGram === '') {
          newTxnData.rateByGram = 0;
        } else {
          newTxnData.rateByGram = this.rate.rateByGram;
        }

        await db.rates
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { id: { $eq: this.rate.id } }
              ]
            }
          })
          .update({
            $set: {
              metal: newTxnData.metal,
              purity: newTxnData.purity,
              rateByGram: newTxnData.rateByGram,
              defaultBool: newTxnData.defaultBool,
              updatedAt: newTxnData.updatedAt,
              isSyncedToServer: newTxnData.isSyncedToServer
            }
          })
          .then(async () => {
            console.log('rate update success');
            this.rate = this.rateDefault;
            this.isEdit = false;
            this.isRateList = true;
          });
      })
      .catch((error) => {
        console.log('rate update Failed ' + error);
      });

    this.rateDialogOpen = false;
    this.isEdit = false;
  };

  setMetal = (value) => {
    this.rate.metal = value;
  };

  setPurity = (value) => {
    this.rate.purity = value;
  };

  setRateByGram = (value) => {
    this.rate.rateByGram = value;
  };

  setDefaultBool = (value) => {
    this.rate.defaultBool = value;
  };

  deleteRateData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.rates.find({
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
        console.log('rate data removed' + data);
        runInAction(() => {
          this.rate = this.rateDefault;
          this.isRateList = true;
        });
      })
      .catch((error) => {
        console.log('rate deletion Failed ' + error);
      });
  };

  getRates = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.rates.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.rateList = data.map((item) => item.toJSON());
      }
    });
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.rates
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
          // No rate data is found so cannot update any information
          return;
        }

        this.rate.businessCity = data.businessCity;
        this.rate.businessId = data.businessId;
        this.rate.metal = data.metal;
        this.rate.purity = data.purity;
        this.rate.rateByGram = data.rateByGram;
        this.rate.id = data.id;
        this.rate.defaultBool = data.defaultBool;
        this.rate.isSyncedToServer = data.isSyncedToServer;

        this.rateDialogOpen = true;
      })
      .catch((error) => {
        console.log('rate update Failed ' + error);
      });
  };

  resetSingleRateData = async () => {
    /**
     * reset to defaults
     */
    this.rate = this.createDefaultRate;
  };

  getRatesCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.rates.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isRateList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('Rate Count Internal Server Error', err);
      });
  };

  handleOpenRateLoadingMessage = async () => {
    runInAction(() => {
      this.openRateLoadingAlertMessage = true;
    });
  };

  handleCloseRateLoadingMessage = async () => {
    runInAction(() => {
      this.openRateLoadingAlertMessage = false;
    });
  };

  constructor() {
    this.rate = new Rates().getDefaultValues();
    this.rateDefault = new Rates().getDefaultValues();

    makeObservable(this, {
      rate: observable,
      rateDialogOpen: observable,
      handleRateModalOpen: action,
      handleRateModalClose: action,
      rateList: observable,
      getRatesCount: action,
      setDefaultBool: action,
      openRateLoadingAlertMessage: observable
    });
  }
}
export default new RateStore();