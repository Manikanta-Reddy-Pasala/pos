import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

import { observable, makeObservable,runInAction } from 'mobx';

class GSTR2Store {
  GSTRDateRange = {};

  //purchase
  purchasesData = [];
  //purchase return
  purchasesReturnData = [];
  b2b2AData = [];
  b2ba2AData = [];
  cdnr2AData = [];
  cdnra2AData = [];
  isd2AData = [];
  impg2AData = [];
  impsezg2AData = [];

  setDateRageOfGSTR2 = async (fromDate, toDate) => {
    this.GSTRDateRange.fromDate = fromDate;
    this.GSTRDateRange.toDate = toDate;
  };

  updateB2BData = async (data) => {
    runInAction(() => {
      this.b2b2AData = data;
      console.log("b2b2adata",this.b2b2AData);
    });
  };
  updateB2BAData = async (data) => {
    runInAction(() => {
      this.b2ba2AData = data;
    });
  };
  updateCDNRData = async (data) => {
    runInAction(() => {
      this.cdnr2AData = data;
    });
  };
  updateCDNRAData = async (data) => {
    runInAction(() => {
      this.cdnra2AData = data;
    });
  };
  updateISDData = async (data) => {
    runInAction(() => {
      this.isd2AData = data;
    });
  };
  updateIMPGData = async (data) => {
    runInAction(() => {
      this.impg2AData = data;
    });
  };
  updateIMPGSEZData = async (data) => {
    runInAction(() => {
      this.impsezg2AData = data;
    });
  };

  getPurchaseRowData = async () => {
    return this.purchasesData;
  };

  getPurchaseReturnRowData = async () => {
    return this.purchasesReturnData;
  };

  getPurchaseData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let result = [];
    await db.purchases
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              bill_date: {
                $lte: this.GSTRDateRange.toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        data.map((item) => {
          let row = item.toJSON();
          let items = row.item_list;
          let taxSlabs = new Map();

          for (let item of items) {
            let cess = 0;
            let igst_amount = 0;
            let cgst_amount = 0;
            let sgst_amount = 0;
            let total_tax = 0;
            let amount = 0;
            //add all items tax and amount details in map then finally that many rows in
            if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
              let existingRow = {};
  
              if (taxSlabs.has(item.cgst)) {
                existingRow = taxSlabs.get(item.cgst);
              } else {
                existingRow = taxSlabs.get(item.igst);
              }
              cess = parseFloat(existingRow.cess);
              igst_amount = parseFloat(existingRow.igst_amount);
              cgst_amount = parseFloat(existingRow.cgst_amount);
              sgst_amount = parseFloat(existingRow.sgst_amount);
              total_tax = parseFloat(existingRow.total_tax);
              amount = parseFloat(existingRow.amount);
            }

            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
            amount = parseFloat(amount) + parseFloat(item.amount);

            total_tax =
            parseFloat(cess) +
            parseFloat(cgst_amount) +
            parseFloat(sgst_amount) +
            parseFloat(igst_amount);

            let tempRow = {};
            tempRow.total_tax = parseFloat(total_tax).toFixed(2);
            tempRow.cess = cess;
            tempRow.igst_amount = parseFloat(igst_amount).toFixed(2);
            tempRow.cgst_amount = parseFloat(cgst_amount).toFixed(2);
            tempRow.sgst_amount = parseFloat(sgst_amount).toFixed(2);
            tempRow.amount = parseFloat(amount).toFixed(2);

            if (item.cgst > 0) {
              taxSlabs.set(item.cgst, tempRow);
            } else {
              taxSlabs.set(item.igst, tempRow);
            }
          }

          taxSlabs.forEach((value, key) => {
            // console.log(value, key);
            let individualTaxSlotRow = item.toJSON();

            let taxRecord = value;
            individualTaxSlotRow.total_tax = parseFloat(
              taxRecord.total_tax
            ).toFixed(2);
            individualTaxSlotRow.cess = taxRecord.cess;
            individualTaxSlotRow.igst_amount = parseFloat(
              taxRecord.igst_amount
            ).toFixed(2);
            individualTaxSlotRow.cgst_amount = parseFloat(
              taxRecord.cgst_amount
            ).toFixed(2);
            individualTaxSlotRow.sgst_amount = parseFloat(
              taxRecord.sgst_amount
            ).toFixed(2);
            individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(
              2
            );
            if (individualTaxSlotRow.igst_amount > 0) {
              individualTaxSlotRow.tax_percentage = parseFloat(key);
            } else {
              individualTaxSlotRow.tax_percentage = parseFloat(key) * 2;
            }

            result.push(individualTaxSlotRow);
            individualTaxSlotRow = {};
          });
        });

        this.purchasesData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchasesReturnData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var query;
    let result = [];
    query = db.purchasesreturn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: this.GSTRDateRange.fromDate
            }
          },
          {
            date: {
              $lte: this.GSTRDateRange.toDate
            }
          }
        ]
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        // No customer is available
        return;
      }

      data.map((item) => {
        let row = item.toJSON();
        let items = row.item_list;
        let taxSlabs = new Map();

        for (let item of items) {
          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;
          let amount = 0;
          //add all items tax and amount details in map then finally that many rows in
          if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
            let existingRow = {};

            if (taxSlabs.has(item.cgst)) {
              existingRow = taxSlabs.get(item.cgst);
            } else {
              existingRow = taxSlabs.get(item.igst);
            }
            cess = parseFloat(existingRow.cess);
            igst_amount = parseFloat(existingRow.igst_amount);
            cgst_amount = parseFloat(existingRow.cgst_amount);
            sgst_amount = parseFloat(existingRow.sgst_amount);
            total_tax = parseFloat(existingRow.total_tax);
            amount = parseFloat(existingRow.amount);
          }

          cess = cess + parseFloat(item.cess);
          igst_amount =
            parseFloat(igst_amount) + parseFloat(item.igst_amount);
          cgst_amount =
            parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
          sgst_amount =
            parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          amount = parseFloat(amount) + parseFloat(item.amount);

          total_tax =
          parseFloat(cess) +
          parseFloat(cgst_amount) +
          parseFloat(sgst_amount) +
          parseFloat(igst_amount);

          let tempRow = {};
          tempRow.total_tax = parseFloat(total_tax).toFixed(2);
          tempRow.cess = cess;
          tempRow.igst_amount = parseFloat(igst_amount).toFixed(2);
          tempRow.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          tempRow.sgst_amount = parseFloat(sgst_amount).toFixed(2);
          tempRow.amount = parseFloat(amount).toFixed(2);

          if (item.cgst > 0) {
            taxSlabs.set(item.cgst, tempRow);
          } else {
            taxSlabs.set(item.igst, tempRow);
          }
        }

        taxSlabs.forEach((value, key) => {
          // console.log(value, key);
          let individualTaxSlotRow = item.toJSON();

          let taxRecord = value;
          individualTaxSlotRow.total_tax = parseFloat(
            taxRecord.total_tax
          ).toFixed(2);
          individualTaxSlotRow.cess = taxRecord.cess;
          individualTaxSlotRow.igst_amount = parseFloat(
            taxRecord.igst_amount
          ).toFixed(2);
          individualTaxSlotRow.cgst_amount = parseFloat(
            taxRecord.cgst_amount
          ).toFixed(2);
          individualTaxSlotRow.sgst_amount = parseFloat(
            taxRecord.sgst_amount
          ).toFixed(2);
          individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(
            2
          );
          if (individualTaxSlotRow.igst_amount > 0) {
            individualTaxSlotRow.tax_percentage = parseFloat(key);
          } else {
            individualTaxSlotRow.tax_percentage = parseFloat(key) * 2;
          }

          result.push(individualTaxSlotRow);
          individualTaxSlotRow = {};
        });
      });
      this.purchasesReturnData = result;
    });
  };

  constructor() {
    makeObservable(this, {
      purchasesData: observable,
      purchasesReturnData: observable,
      b2b2AData: observable,
      b2ba2AData: observable,
      cdnr2AData: observable,
      cdnra2AData: observable,
      isd2AData: observable,
      impg2AData: observable,
      impsezg2AData: observable,
    });
  }
}
export default new GSTR2Store();
