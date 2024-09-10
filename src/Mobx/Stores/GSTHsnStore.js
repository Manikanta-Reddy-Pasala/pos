import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

import { observable, makeObservable } from 'mobx';

class GSTHsnStore {
  taxdata = {};
  taxDataList = [];
  GSTRDateRange = {};

  //sales
  salesData = [];
  //sales return
  purchasesData = [];

  hsnWiseSalesData = [];
  getSalesRowData = async () => {
    return this.salesData;
  };

  getPurchaseRowData = async () => {
    return this.purchasesData;
  };

  getHsnWiseSalesRowData = async () => {
    return this.hsnWiseSalesData;
  };

  getSalesData = async (fromDate, toDate) => {
    let result = [];

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              txnDate: {
                $gte: fromDate
              }
            },
            {
              txnDate: {
                $lte: toDate
              }
            },
            {
              $or: [{ txnType: { $eq: 'Sales' } }, { txnType: { $eq: 'KOT' } }]
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        data.map((dataItem) => {
          let product = dataItem.toJSON();

          const total_tax =
            parseFloat(product.igst_amount) +
            parseFloat(product.cgst_amount) +
            parseFloat(product.sgst_amount);

          const total_tax_rate =
            parseFloat(product.igst) +
            parseFloat(product.cgst) +
            parseFloat(product.sgst);

          product.total_tax = parseFloat(total_tax).toFixed(2);
          product.total_tax_rate = parseFloat(total_tax_rate).toFixed(2);

          result.push(product);
        });

        this.salesData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
    return this.salesData;
  };

  getPurchaseData = async (fromDate, toDate) => {
    let result = [];

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              txnDate: {
                $gte: fromDate
              }
            },
            {
              txnDate: {
                $lte: toDate
              }
            },
            {
              txnType: {
                $eq: 'Purchases'
              }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        data.map((dataItem) => {
          let product = dataItem.toJSON();

          const total_tax =
            parseFloat(product.igst_amount) +
            parseFloat(product.cgst_amount) +
            parseFloat(product.sgst_amount);

          const total_tax_rate =
            parseFloat(product.igst) +
            parseFloat(product.cgst) +
            parseFloat(product.sgst);

          product.total_tax = parseFloat(total_tax).toFixed(2);
          product.total_tax_rate = parseFloat(total_tax_rate).toFixed(2);

          result.push(product);
        });

        this.purchasesData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
    return this.purchasesData;
  };

  getHSNWiseSalesData = async (fromDate, toDate) => {
    let result = [];

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              txnDate: {
                $gte: fromDate
              }
            },
            {
              txnDate: {
                $lte: toDate
              }
            },
            {
              $or: [{ txnType: { $eq: 'Sales' } }, { txnType: { $eq: 'KOT' } }]
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        let intermediate_result = new Map();
        data.map((dataItem) => {
          let finalData = dataItem.toJSON();

          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let keyToFind = '';

          if (finalData.hsn !== '') {
            keyToFind = finalData.hsn;
          }

          if (finalData.cgst && finalData.cgst > 0) {
            keyToFind = keyToFind + '_' + finalData.cgst;
          } else if (finalData.igst && finalData.igst > 0) {
            keyToFind = keyToFind + '_' + finalData.igst;
          }

          cess = cess + parseFloat(finalData.cess);
          igst_amount =
            parseFloat(igst_amount) + parseFloat(finalData.igst_amount) || 0;
          cgst_amount =
            parseFloat(cgst_amount) + parseFloat(finalData.cgst_amount) || 0;
          sgst_amount =
            parseFloat(sgst_amount) + parseFloat(finalData.sgst_amount) || 0;

          if (intermediate_result.has(keyToFind)) {
            let itemData = intermediate_result.get(keyToFind);

            // add all required fields
            itemData.amount =
              parseFloat(itemData.amount) + parseFloat(finalData.amount);
            itemData.txnQty =
              parseFloat(itemData.txnQty) + parseFloat(finalData.txnQty);
            itemData.cess = parseFloat(itemData.cess) || 0 + cess;
            itemData.igst_amount =
              parseFloat(itemData.igst_amount) || 0 + parseFloat(igst_amount);
            itemData.cgst_amount =
              parseFloat(itemData.cgst_amount) || 0 + parseFloat(cgst_amount);
            itemData.sgst_amount =
              parseFloat(itemData.sgst_amount) || 0 + parseFloat(sgst_amount);

            itemData.total_tax =
              parseFloat(itemData.total_tax) +
                parseFloat(finalData.igst_amount) ||
              0 + parseFloat(finalData.cgst_amount) ||
              0 + parseFloat(finalData.sgst_amount) ||
              0;

            itemData.txnQty = parseFloat(itemData.txnQty).toFixed(2);
            itemData.cess = parseFloat(itemData.cess).toFixed(2);
            itemData.amount = parseFloat(itemData.amount).toFixed(2);

            itemData.igst_amount = parseFloat(itemData.igst_amount).toFixed(2);
            itemData.cgst_amount = parseFloat(itemData.cgst_amount).toFixed(2);
            itemData.sgst_amount = parseFloat(itemData.sgst_amount).toFixed(2);

            intermediate_result.set(keyToFind, itemData);
          } else {
            finalData.total_tax =
              parseFloat(igst_amount) +
              parseFloat(cgst_amount) +
              parseFloat(sgst_amount);
            intermediate_result.set(keyToFind, finalData);
          }

          intermediate_result.forEach((value, key) => {
            // console.log(value, key);
            let individualTaxSlotRow = dataItem.toJSON();

            let taxRecord = value;
            individualTaxSlotRow.hsn = taxRecord.hsn;
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
            let tax = key.split('_');
            if (individualTaxSlotRow.igst_amount > 0) {
              individualTaxSlotRow.tax_percentage = parseFloat(tax[1]) || 0;
            } else {
              individualTaxSlotRow.tax_percentage = parseFloat(tax[1]) * 2 || 0;
            }

            result.push(individualTaxSlotRow);
            individualTaxSlotRow = {};
          });
        });

        this.hsnWiseSalesData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
    return this.hsnWiseSalesData;
  };

  constructor() {
    makeObservable(this, {
      salesData: observable,
      purchasesData: observable
    });
  }
}
export default new GSTHsnStore();
