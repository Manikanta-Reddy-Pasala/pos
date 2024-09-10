import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import AddOn from './classes/AddOn';

class AddOnsStore {
  addOnsDialogOpen = false;
  addOnsList = [];
  isAddOnsGroupList = false;
  selectedGroupList = false;
  isEdit = false;

  constructor() {
    this.addOns = new AddOn().getDefaultValues();
    this.addOnsDefault = new AddOn().getDefaultValues();

    makeObservable(this, {
      addOns: observable,
      addOnsDialogOpen: observable,
      selectedGroupList: observable,
      handleAddOnsModalOpen: action,
      handleAddOnsModalClose: action,
      addOnsList: observable
      // getAddOnsCount: action
    });
  }

  handleAddOnsModalOpen = (option) => {
    runInAction(() => {
      this.addOns = new AddOn().getDefaultValues();
      this.addOns['groupName'] = option.groupName;
      this.addOns['groupId'] = option.groupId;
      this.addOnsDialogOpen = true;
    });
  };

  handleAddOnsModalClose = () => {
    this.addOnsDialogOpen = false;
    this.isEdit = false;
    this.addOns = new AddOn().getDefaultValues();
  };

  saveData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const timestamp = Date.now();
    const appId = businessData.posDeviceId;

    const id = _uniqueId('addons');
    this.addOns.additionalPropertyId = `${id}${appId}${timestamp}`;
    this.addOns.businessId = businessData.businessId;
    this.addOns.businessCity = businessData.businessCity;
    this.addOns.posId = parseFloat(businessData.posDeviceId);
    this.addOns.updatedAt = Date.now();

    let InsertDoc = { ...this.addOns };

    InsertDoc = new AddOn().convertTypes(InsertDoc);
    await db.addons
      .insert(InsertDoc)
      .then(() => {
        console.log('this.addOns:: data Inserted' + InsertDoc);
        runInAction(() => {
          this.addOns = this.addOnsDefault;
          this.isEdit = false;
          this.getAddOns();
        });
      })
      .catch((err) => {
        console.log('this.addOns:: data insertion Failed::', err);
      });
    runInAction(() => {
      this.addOnsDialogOpen = false;
    });
  };

  updateData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.addons
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { additionalPropertyId: { $eq: this.addOns.additionalPropertyId } }
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
        newTxnData.additionalPropertyId = oldTxnData.additionalPropertyId;
        newTxnData.updatedAt = Date.now();
        newTxnData.groupName = this.addOns.groupName;
        newTxnData.groupId = this.addOns.groupId;
        newTxnData.name = this.addOns.name;
        newTxnData.price = this.addOns.price;
        newTxnData.type = this.addOns.type;
        newTxnData.offline = this.addOns.offline;
        newTxnData.cgst = this.addOns.cgst;
        newTxnData.sgst = this.addOns.sgst;
        newTxnData.igst = this.addOns.igst;
        newTxnData.cess = this.addOns.cess;
        newTxnData.taxIncluded = this.addOns.taxIncluded;
        newTxnData.purchasedPrice = this.addOns.purchasedPrice;
        newTxnData.barcode = this.addOns.barcode;
        newTxnData.hsn = this.addOns.hsn;
        newTxnData.stockQty = this.addOns.stockQty;
        newTxnData.businessCity = this.addOns.businessCity;
        newTxnData.businessId = this.addOns.businessId;
        newTxnData.isSyncedToServer = this.addOns.isSyncedToServer;
        console.log('newTxnData', newTxnData);
        await db.addons
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                {
                  additionalPropertyId: {
                    $eq: this.addOns.additionalPropertyId
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
          })
          .then(async () => {
            console.log('addOns update success');
            runInAction(() => {
              this.addOns = this.addOnsDefault;
              this.isEdit = false;
              this.getAddOns();
            });
          });
      })
      .catch((error) => {
        console.log('addOns update Failed ' + error);
      });

    runInAction(() => {
      this.addOnsDialogOpen = false;
      this.isEdit = false;
    });
  };

  updateState = (field, value) => {
    runInAction(() => {
      if (field === 'cgst' || field === 'sgst') {
        this.addOns['cgst'] = value;
        this.addOns['sgst'] = value;
        this.addOns['igst'] = Number(value) * 2;
      } else if (field === 'igst') {
        this.addOns['cgst'] = Number(value) / 2;
        this.addOns['sgst'] = Number(value) / 2;
      }
      this.addOns[field] = value;
    });
  };

  deleteAddOnsData = async (item) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.addons.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { additionalPropertyId: { $eq: item.additionalPropertyId } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('addOns data removed' + data);
        runInAction(() => {
          this.addOns = this.addOnsDefault;
          this.getAddOns();
        });
      })
      .catch((error) => {
        console.log('addOns deletion Failed ' + error);
      });
  };

  updateOfflineAddOns = async (item, offline) => {
    console.log('offline', !offline);
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let oldTxnData = {};
    db.addons
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { additionalPropertyId: { $eq: item.additionalPropertyId } }
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
        newTxnData.additionalPropertyId = oldTxnData.additionalPropertyId;
        newTxnData.updatedAt = Date.now();
        newTxnData.offline = !offline;
        await db.addons
          .findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { additionalPropertyId: { $eq: item.additionalPropertyId } }
              ]
            }
          })
          .update({
            $set: {
              offline: newTxnData.offline,
              updatedAt: newTxnData.updatedAt
            }
          })
          .then(async () => {
            console.log('addOns update success');
            this.getAddOns();
          });
      })
      .catch((error) => {
        console.log('addOns update Failed ' + error);
      });
  };

  getAddOns = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    this.addOnsList = [];

    const query = db.addons.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        this.addOnsList = data.map((item) => item.toJSON());
      }
    });

    return this.addOnsList;
  };

  viewOrEditAddon = async (item) => {
    this.isEdit = true;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    await db.addons
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { additionalPropertyId: { $eq: item.additionalPropertyId } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No add ons group data is found so cannot update any information
          return;
        }

        this.addOns.businessCity = data.businessCity;
        this.addOns.businessId = data.businessId;
        this.addOns.groupName = data.groupName;
        this.addOns.additionalPropertyId = data.additionalPropertyId;
        this.addOns.name = data.name;
        this.addOns.price = data.price;
        this.addOns.type = data.type;
        this.addOns.offline = data.offline;
        this.addOns.cgst = data.cgst;
        this.addOns.sgst = data.sgst;
        this.addOns.igst = data.igst;
        this.addOns.cess = data.cess;
        this.addOns.taxIncluded = data.taxIncluded;
        this.addOns.purchasedPrice = data.purchasedPrice;
        this.addOns.barcode = data.barcode;
        this.addOns.hsn = data.hsn;
        this.addOns.stockQty = data.stockQty;

        this.addOns.additionalPropertyId = data.additionalPropertyId;
        this.addOns.name = data.name;
        this.addOns.price = data.price;
        this.addOns.type = data.type;
        this.addOns.offline = data.offline;
        this.addOns.cgst = data.cgst;
        this.addOns.sgst = data.sgst;
        this.addOns.igst = data.igst;
        this.addOns.cess = data.cess;
        this.addOns.taxType = data.taxType;
        this.addOns.taxIncluded = data.taxIncluded;
        this.addOns.groupName = data.groupName;
        this.addOns.purchasedPrice = data.purchasedPrice;
        this.addOns.productId = data.productId;
        this.addOns.description = data.description;
        this.addOns.batchId = data.batchId;
        this.addOns.brandName = data.brandName;
        this.addOns.categoryLevel2 = data.categoryLevel2;
        this.addOns.categoryLevel2DisplayName = data.categoryLevel2DisplayName;
        this.addOns.categoryLevel3 = data.categoryLevel3;
        this.addOns.categoryLevel3DisplayName = data.categoryLevel3DisplayName;
        this.addOns.stockQty = data.stockQty;
        this.addOns.hsn = data.hsn;
        this.addOns.barcode = data.barcode;
        this.addOns.updatedAt = data.updatedAt;
        this.addOns.businessId = data.businessId;
        this.addOns.businessCity = data.businessCity;
        this.addOns.isSyncedToServer = data.isSyncedToServer;

        this.addOnsDialogOpen = true;
      })
      .catch((error) => {
        console.log('addOns update Failed ' + error);
      });
  };

  resetSingleAddOnGroupData = async () => {
    /**
     * reset to defaults
     */
    runInAction(() => {
      this.addOns = this.addOnsDefault;
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
        console.log('addOns Count Internal Server Error', err);
      });
  };

  setProductData = (product) => {
    runInAction(() => {
      if (product) {
        this.addOns.name = product.name;
        this.addOns.productId = product.productId;
        this.addOns.description = product.description;
        this.addOns.brandName = product.brandName;
        this.addOns.categoryLevel2 = product.categoryLevel2.name;
        this.addOns.categoryLevel2DisplayName =
          product.categoryLevel2.displayName;
        this.addOns.categoryLevel3 = product.categoryLevel3.name;
        this.addOns.categoryLevel3DisplayName =
          product.categoryLevel3.displayName;
        if (product.cgst > 0) {
          this.addOns['cgst'] = product.cgst;
          this.addOns['sgst'] = product.cgst;
          this.addOns['igst'] = Number(product.cgst) * 2;
        }
        this.addOns.taxIncluded = product.taxIncluded;
        this.addOns.cess = product.cess;
        this.addOns.price = parseFloat(product.salePrice);
        this.addOns.barcode = product.barcode;
        this.addOns.hsn = product.hsn;
        this.addOns.stockQty = product.stockQty;
      } else {
        this.addOns.name = '';
        this.addOns.productId = '';
        this.addOns.description = '';
        this.addOns.brandName = '';
        this.addOns.categoryLevel2 = '';
        this.addOns.categoryLevel2DisplayName = '';
        this.addOns.categoryLevel3 = '';
        this.addOns.categoryLevel3DisplayName = '';
        this.addOns['cgst'] = 0;
        this.addOns['sgst'] = 0;
        this.addOns['igst'] = 0;
        this.addOns.taxIncluded = true;
        this.addOns.cess = 0;
        this.addOns.price = 0;
        this.addOns.barcode = '';
        this.addOns.hsn = '';
        this.addOns.stockQty = 0;
      }
    });
  };
}
export default new AddOnsStore();