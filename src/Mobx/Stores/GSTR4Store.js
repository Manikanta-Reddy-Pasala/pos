import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

import { observable, makeObservable, action } from 'mobx';

class GSTR4Store {
  taxdata = {};
  taxDataList = [];
  GSTRDateRange = {};

  gstr4AandBData = [];
  gstr4CData = [];
  gstr4DData = [];
  gstr45BCDNRData = [];
  gstr45BCDNURData = [];
  gstr4AandBExcelData = [];
  gstr4CExcelData = [];
  gstr4DExcelData = [];
  gstr45BCDNRExcelData = [];
  gstr45BCDNURExcelData = [];

  setFromDateGSTR4 = async (fromDate) => {
    this.GSTRDateRange.fromDate = fromDate;
  };
  setToDateGSTR4 = async (toDate) => {
    this.GSTRDateRange.toDate = toDate;
  };

  getPurchasesRowData = async () => {
    return this.purchasesData;
  };

  getPurchasesGSTR4AandBData = async () => {
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
              vendor_gst_type: 'Registered Vendor'
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => {
          let row = item.toJSON();

          let items = row.item_list;

          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;

          for (let item of items) {
            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          }

          if (cgst_amount > 0 || sgst_amount > 0) {
            total_tax = parseFloat(cgst_amount) + parseFloat(sgst_amount);
          }

          if (igst_amount > 0) {
            total_tax = parseFloat(igst_amount);
          }

          row.total_tax = parseFloat(total_tax).toFixed(2);
          row.cess = cess;
          row.igst_amount = parseFloat(igst_amount).toFixed(2);
          row.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          row.sgst_amount = parseFloat(sgst_amount).toFixed(2);

          return row;
        });
        this.gstr4AandBData = result;
        this.gstr4AandBExcelData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchasesGSTR4CData = async () => {
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
              vendor_gst_type: 'Unregistered Vendor'
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => {
          let row = item.toJSON();

          let items = row.item_list;

          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;

          for (let item of items) {
            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          }

          if (cgst_amount > 0 || sgst_amount > 0) {
            total_tax = parseFloat(cgst_amount) + parseFloat(sgst_amount);
          }

          if (igst_amount > 0) {
            total_tax = parseFloat(igst_amount);
          }

          row.total_tax = parseFloat(total_tax).toFixed(2);
          row.cess = cess;
          row.igst_amount = parseFloat(igst_amount).toFixed(2);
          row.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          row.sgst_amount = parseFloat(sgst_amount).toFixed(2);

          return row;
        });
        this.gstr4CData = result;
        this.gstr4CExcelData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchasesGSTR4DData = async () => {
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
              vendor_gst_type: 'Oveseas Vendor'
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => {
          let row = item.toJSON();

          let items = row.item_list;

          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;

          for (let item of items) {
            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          }

          if (cgst_amount > 0 || sgst_amount > 0) {
            total_tax = parseFloat(cgst_amount) + parseFloat(sgst_amount);
          }

          if (igst_amount > 0) {
            total_tax = parseFloat(igst_amount);
          }
          row.total_tax = parseFloat(total_tax).toFixed(2);
          row.cess = cess;
          row.igst_amount = parseFloat(igst_amount).toFixed(2);
          row.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          row.sgst_amount = parseFloat(sgst_amount).toFixed(2);

          return row;
        });
        this.gstr4DData = result;
        this.gstr4DExcelData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchasesReturnGSTR45BCDNRData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let result = [];

    await db.purchasesreturn
      .find({
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
            },
            {
              vendor_gst_type: 'Registered Vendor'
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => {
          let row = item.toJSON();

          let items = row.item_list;
          let res = {};

          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;

          for (let item of items) {
            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          }

          if (cgst_amount > 0 || sgst_amount > 0) {
            total_tax = parseFloat(cgst_amount) + parseFloat(sgst_amount);
          }

          if (igst_amount > 0) {
            total_tax = parseFloat(igst_amount);
          }

          res.total_tax = parseFloat(total_tax).toFixed(2);
          res.cess = cess;
          res.igst_amount = parseFloat(igst_amount).toFixed(2);
          res.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          res.sgst_amount = parseFloat(sgst_amount).toFixed(2);
          res.invoice_number = row.bill_number;
          res.invoice_date = row.date;
          res.reverseChargeValue = row.reverseChargeValue;
          res.total_amount = parseFloat(row.total_amount).toFixed(2);
          res.taxable_value = parseFloat(
            Number(row.total_amount) - Number(total_tax)
          ).toFixed(2);
          res.gst_number = row.vendor_gst_number;
          res.document_type = 'Debit Note';

          return res;
        });
        this.gstr45BCDNRData = result;
        this.gstr45BCDNRExcelData = result;
        this.getSalesReturnGSTR45BCDNRData();
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getSalesReturnGSTR45BCDNRData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let result = [];

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              invoice_date: {
                $lte: this.GSTRDateRange.toDate
              }
            },
            {
              customerGstType: 'Registered Customer'
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => {
          let row = item.toJSON();

          let items = row.item_list;
          let res = {};
          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;

          for (let item of items) {
            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          }

          if (cgst_amount > 0 || sgst_amount > 0) {
            total_tax = parseFloat(cgst_amount) + parseFloat(sgst_amount);
          }

          if (igst_amount > 0) {
            total_tax = parseFloat(igst_amount);
          }

          res.total_tax = parseFloat(total_tax).toFixed(2);
          res.cess = cess;
          res.igst_amount = parseFloat(igst_amount).toFixed(2);
          res.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          res.sgst_amount = parseFloat(sgst_amount).toFixed(2);
          res.invoice_number = row.invoice_number;
          res.invoice_date = row.invoice_date;
          res.reverseChargeValue = row.reverseChargeValue;
          res.total_amount = parseFloat(row.total_amount).toFixed(2);
          res.taxable_value = parseFloat(
            Number(row.total_amount) - Number(total_tax)
          ).toFixed(2);
          res.gst_number = row.customerGSTNo;
          res.document_type = 'Credit Note';

          return res;
        });
        this.gstr45BCDNRData = this.gstr45BCDNRData.concat(result);
        this.gstr45BCDNRExcelData = this.gstr45BCDNRExcelData.concat(result);
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchasesReturnGSTR45BCDNURData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let result = [];

    await db.purchasesreturn
      .find({
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
            },
            {
              vendor_gst_type: 'Unregistered Vendor'
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => {
          let row = item.toJSON();

          let items = row.item_list;
          let res = {};

          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;

          for (let item of items) {
            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          }

          if (cgst_amount > 0 || sgst_amount > 0) {
            total_tax = parseFloat(cgst_amount) + parseFloat(sgst_amount);
          }

          if (igst_amount > 0) {
            total_tax = parseFloat(igst_amount);
          }

          res.total_tax = parseFloat(total_tax).toFixed(2);
          res.cess = cess;
          res.igst_amount = parseFloat(igst_amount).toFixed(2);
          res.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          res.sgst_amount = parseFloat(sgst_amount).toFixed(2);
          res.invoice_number = row.bill_number;
          res.invoice_date = row.date;
          res.reverseChargeValue = row.reverseChargeValue;
          res.total_amount = parseFloat(row.total_amount).toFixed(2);
          res.taxable_value = parseFloat(
            Number(row.total_amount) - Number(total_tax)
          ).toFixed(2);
          res.gst_number = row.vendor_gst_number;
          res.document_type = 'Debit Note';

          return res;
        });
        this.gstr45BCDNURData = result;
        this.gstr45BCDNURExcelData = result;
        this.getSalesReturnGSTR45BCDNURData();
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getSalesReturnGSTR45BCDNURData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let result = [];

    await db.salesreturn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: this.GSTRDateRange.fromDate
              }
            },
            {
              invoice_date: {
                $lte: this.GSTRDateRange.toDate
              }
            },
            {
              customerGstType: 'Unregistered Customer'
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        result = data.map((item) => {
          let row = item.toJSON();

          let items = row.item_list;
          let res = {};
          let cess = 0;
          let igst_amount = 0;
          let cgst_amount = 0;
          let sgst_amount = 0;
          let total_tax = 0;

          for (let item of items) {
            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
          }

          if (cgst_amount > 0 || sgst_amount > 0) {
            total_tax = parseFloat(cgst_amount) + parseFloat(sgst_amount);
          }

          if (igst_amount > 0) {
            total_tax = parseFloat(igst_amount);
          }

          res.total_tax = parseFloat(total_tax).toFixed(2);
          res.cess = cess;
          res.igst_amount = parseFloat(igst_amount).toFixed(2);
          res.cgst_amount = parseFloat(cgst_amount).toFixed(2);
          res.sgst_amount = parseFloat(sgst_amount).toFixed(2);
          res.invoice_number = row.invoice_number;
          res.invoice_date = row.invoice_date;
          res.reverseChargeValue = row.reverseChargeValue;
          res.total_amount = parseFloat(row.total_amount).toFixed(2);
          res.taxable_value = parseFloat(
            Number(row.total_amount) - Number(total_tax)
          ).toFixed(2);
          res.gst_number = row.customerGSTNo;
          res.document_type = 'Credit Note';

          return res;
        });
        this.gstr45BCDNURData = this.gstr45BCDNURData.concat(result);
        this.gstr45BCDNURExcelData = this.gstr45BCDNURExcelData.concat(result);
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  constructor() {
    makeObservable(this, {
      gstr4AandBData: observable,

      setFromDateGSTR4: action,
      setToDateGSTR4: action,

      gstr4CData: observable,
      gstr4DData: observable,

      gstr45BCDNRData: observable,
      gstr45BCDNURData: observable,
      gstr4AandBExcelData: observable,
      gstr4CExcelData: observable,
      gstr4DExcelData: observable,
      gstr45BCDNRExcelData: observable,
      gstr45BCDNURExcelData: observable
    });
  }
}
export default new GSTR4Store();
