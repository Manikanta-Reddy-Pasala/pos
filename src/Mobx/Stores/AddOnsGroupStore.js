import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import AddOnsGroup from './classes/AddOnsGroup';

class AddOnsGroupStore {
  addOnsGroupDialogOpen = false;
  addOnsGroupList = [];
  isAddOnsGroupList = false;
  isEdit = false;

  constructor() {
    this.addOnsGroup = new AddOnsGroup().getDefaultValues();
    this.addOnsGroupDefault = new AddOnsGroup().getDefaultValues();

    makeObservable(this, {
      addOnsGroup: observable,
      addOnsGroupDialogOpen: observable,
      handleAddOnsGroupModalOpen: action,
      handleAddOnsGroupModalClose: action,
      addOnsGroupList: observable,
      isAddOnsGroupList: observable
      // getAddOnsGroupCount: action
    });
  }

  handleAddOnsGroupModalOpen = () => {
    runInAction(() => {
      this.addOnsGroup = new AddOnsGroup().getDefaultValues();
      this.addOnsGroupDialogOpen = true;
    });
  };

  handleAddOnsGroupModalClose = () => {
    runInAction(() => {
      this.addOnsGroupDialogOpen = false;
      this.isEdit = false;
      this.addOnsGroup = this.addOnsGroupDefault;
    });
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('addonsgroup');
    this.addOnsGroup.groupId = `${id}${appId}${timestamp}`;
    this.addOnsGroup.businessId = businessData.businessId;
    this.addOnsGroup.businessCity = businessData.businessCity;
    this.addOnsGroup.posId = parseFloat(businessData.posDeviceId);
    this.addOnsGroup.updatedAt = Date.now();

    let InsertDoc = { ...this.addOnsGroup };

    InsertDoc = new AddOnsGroup().convertTypes(InsertDoc);
    await db.addonsgroup
      .insert(InsertDoc)
      .then(() => {
        runInAction(() => {
          this.addOnsGroup = this.addOnsGroupDefault;
          this.isEdit = false;
          this.getAddOnsGroup();
        });
      })
      .catch((err) => {
        console.log('this.addOnsGroup:: data insertion Failed::', err);
      });

    runInAction(() => {
      this.addOnsGroupDialogOpen = false;
    });
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.addonsgroup
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { groupId: { $eq: this.addOnsGroup.groupId } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No add ons group data is found so cannot update any information
          return;
        }
        oldTxnData = data;

        let newTxnData = {};
        newTxnData.groupId = oldTxnData.groupId;
        newTxnData.updatedAt = Date.now();
        newTxnData.groupName = this.addOnsGroup.groupName;
        newTxnData.businessCity = this.addOnsGroup.businessCity;
        newTxnData.businessId = this.addOnsGroup.businessId;
        newTxnData.isSyncedToServer = this.addOnsGroup.isSyncedToServer;

        await db.addonsgroup
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { groupId: { $eq: this.addOnsGroup.groupId } }
              ]
            }
          })
          .update({
            $set: {
              groupName: newTxnData.groupName,
              updatedAt: newTxnData.updatedAt
            }
          })
          .then(async () => {
            await this.setAddOnsByGroupName(newTxnData);
            runInAction(() => {
              this.addOnsGroup = this.addOnsGroupDefault;
              this.isEdit = false;
              this.isAddOnsGroupList = true;
            });
          });
      })
      .catch((error) => {
        console.log('addOnsGroup update Failed ' + error);
      });

    runInAction(() => {
      this.addOnsGroupDialogOpen = false;
      this.isEdit = false;
    });
  };

  setAddOnGroupName = (value) => {
    runInAction(() => {
      this.addOnsGroup.groupName = value;
    });
  };

  deleteAddOnsGroupData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.addonsgroup.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { groupId: { $eq: item.groupId } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('addOnsGroup data removed' + data);
        runInAction(() => {
          this.addOnsGroup = this.addOnsGroupDefault;
          this.getAddOnsGroup();
        });
      })
      .catch((error) => {
        console.log('addOnsGroup deletion Failed ' + error);
      });
  };

  getAddOnsGroup = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    runInAction(() => {
      this.addOnsGroupList = [];
    });

    const query = db.addonsgroup.find({
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
          this.addOnsGroupList = data.map((item) => item.toJSON());
        });
      }
    });

    console.log('this.addOnsGroupList', this.addOnsGroupList);

    return this.addOnsGroupList;
  };

  viewOrEditItem = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.addonsgroup
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { groupId: { $eq: item.groupId } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No add ons group data is found so cannot update any information
          return;
        }

        this.addOnsGroup.businessCity = data.businessCity;
        this.addOnsGroup.businessId = data.businessId;
        this.addOnsGroup.groupName = data.groupName;
        this.addOnsGroup.groupId = data.groupId;

        runInAction(() => {
          this.addOnsGroupDialogOpen = true;
        });
      })
      .catch((error) => {
        console.log('addOnsGroup update Failed ' + error);
      });
  };

  resetSingleAddOnGroupData = async () => {
    /**
     * reset to defaults
     */
    runInAction(() => {
      this.addOnsGroup = this.addOnsGroupDefault;
    });
  };

  getAddOnGroupCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.addonsgroup.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        runInAction(() => {
          this.isAddOnsGroupList = data.length > 0 ? true : false;
        });
      })
      .catch((err) => {
        console.log('addOnsGroup Count Internal Server Error', err);
      });
  };

  setAddOnsByGroupName = async (txnData) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.addons.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { groupId: { $eq: txnData.groupId } }
        ]
      }
    });

    await query.exec().then(async (data) => {
      if (!data) {
        runInAction(() => {
          this.addOnsGroup = this.addOnsGroupDefault;
          this.isEdit = false;
          this.getAddOnGroupCount();
        });
        return;
      }

      if (data && data.length > 0) {
        let response = data.map((item) => item.toJSON());
        for (let item of response) {
          await db.addons
            .findOne({
              selector: {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  {
                    additionalPropertyId: {
                      $eq: item.additionalPropertyId
                    }
                  }
                ]
              }
            })
            .exec()
            .then(async (data) => {
              if (!data) {
                // No add ons group data is found so cannot update any information
                return;
              }

              let newTxnData = {};
              newTxnData.additionalPropertyId = item.additionalPropertyId;
              newTxnData.updatedAt = Date.now();
              newTxnData.groupName = txnData.groupName;
              newTxnData.groupId = item.groupId;
              newTxnData.name = item.name;
              newTxnData.price = item.price;
              newTxnData.type = item.type;
              newTxnData.offline = item.offline;
              newTxnData.cgst = item.cgst;
              newTxnData.sgst = item.sgst;
              newTxnData.igst = item.igst;
              newTxnData.cess = item.cess;
              newTxnData.taxIncluded = item.taxIncluded;
              newTxnData.purchasedPrice = item.purchasedPrice;
              newTxnData.barcode = item.barcode;
              newTxnData.hsn = item.hsn;
              newTxnData.stockQty = item.stockQty;
              newTxnData.businessCity = item.businessCity;
              newTxnData.businessId = item.businessId;
              newTxnData.isSyncedToServer = item.isSyncedToServer;
              await db.addons
                .findOne({
                  selector: {
                    $and: [
                      { businessId: { $eq: businessData.businessId } },
                      {
                        additionalPropertyId: {
                          $eq: item.additionalPropertyId
                        }
                      }
                    ]
                  }
                })
                .update({
                  $set: {
                    updatedAt: Date.now(),
                    groupName: newTxnData.groupName,
                    groupId: newTxnData.groupId,
                    name: newTxnData.name,
                    price: newTxnData.price,
                    type: newTxnData.type,
                    offline: newTxnData.offline,
                    cgst: newTxnData.cgst,
                    sgst: newTxnData.sgst,
                    igst: newTxnData.igst,
                    cess: newTxnData.cess,
                    taxIncluded: newTxnData.taxIncluded,
                    purchasedPrice: newTxnData.purchasedPrice,
                    barcode: newTxnData.barcode,
                    hsn: newTxnData.hsn,
                    stockQty: newTxnData.stockQty,
                    isSyncedToServer: newTxnData.isSyncedToServer
                  }
                });
            })
            .catch((error) => {
              console.log('addOns update Failed ' + error);
            });
        }
      }
    });
  };
}
export default new AddOnsGroupStore();