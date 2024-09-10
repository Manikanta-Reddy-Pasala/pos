import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

import { observable, makeObservable, action } from 'mobx';

class GSTR9Store {
  taxdata = {};
  taxDataList = [];
  GSTRDateRange = {};
  gstr1to4DataList = {};

  dataLoaded = false;

  //sales
  registeredCustomersaleData = [];
  unRegisteredCustomerSaleData = [];
  SEZCustomerSalesData = [];
  DeemedCustomerData = [];
  reverseChargePurchasesData = [];
  salesDataByProductExemed = [];
  salesDataByProductNillRated = [];
  salesDataByProductNonGST = [];
  salesReturnDataByProduct = [];
  gstr96OverseasData = [];
  gstr96UnRegData = [];
  gstr96sezData = [];
  gstr916Data = [];
  gstr96RegData = [];
  gstr94NValue = {
    taxable_vaues: 0,
    central_tax: 0,
    state_ut_tax: 0,
    integrated_tax: 0,
    cess: 0
  };
  gstr94GValue = {
    taxable_vaues: 0,
    central_tax: 0,
    state_ut_tax: 0,
    integrated_tax: 0,
    cess: 0
  };
  //sales return
  salesReturnData = [];

  setDateRageOfGSTR9 = async (fromDate, toDate) => {
    this.GSTRDateRange.fromDate = fromDate;
    this.GSTRDateRange.toDate = toDate;
  };

  getSalesRowData = async () => {
    return this.registeredCustomersaleData;
  };

  getSalesReturnRowData = async () => {
    return this.salesReturnData;
  };

  setDataLoaded = async (val) => {
    this.dataLoaded = val;
  };

  // ----------------------- GSTR 9 (1-4) ----------------------------

  getGSTR1To4Data = async () => {
    return new Promise((resolve, reject) => {
      let taxableValues = 0;
      let centralTax = 0;
      let sgst = 0;
      let igst = 0;
      let cess = 0;
      let unRegisteredtaxableValues = 0;
      let unRegisteredcentralTax = 0;
      let unRegisteredsgst = 0;
      let unRegisteredigst = 0;
      let unRegisteredcess = 0;
      let SEZtaxableValues = 0;
      let SEZcentralTax = 0;
      let SEZsgst = 0;
      let SEZigst = 0;
      let SEZcess = 0;
      let DeemedtaxableValues = 0;
      let DeemedcentralTax = 0;
      let Deemedsgst = 0;
      let Deemedigst = 0;
      let Deemedcess = 0;
      let reverseChargetaxableValues = 0;
      let reverseChargecentralTax = 0;
      let reverseChargesgst = 0;
      let reverseChargeigst = 0;
      let reverseChargecess = 0;
      let salesReturntaxableValues = 0;
      let salesReturncentralTax = 0;
      let salesReturnsgst = 0;
      let salesReturnigst = 0;
      let salesReturncess = 0;
      var result = {
        registeredData: {
          taxableValues: 0,
          centralTax: 0,
          sgst: 0,
          igst: 0,
          cess: 0
        },
        unRegisteredData: {
          taxableValues: 0,
          centralTax: 0,
          sgst: 0,
          igst: 0,
          cess: 0
        },
        sezData: {
          taxableValues: 0,
          centralTax: 0,
          sgst: 0,
          igst: 0,
          cess: 0
        },
        deemedData: {
          taxableValues: 0,
          centralTax: 0,
          sgst: 0,
          igst: 0,
          cess: 0
        },
        reverseCharge: {
          taxableValues: 0,
          centralTax: 0,
          sgst: 0,
          igst: 0,
          cess: 0
        },
        salesReturn: {
          taxableValues: 0,
          centralTax: 0,
          sgst: 0,
          igst: 0,
          cess: 0
        }
      };
      this.registeredCustomersaleData.forEach((ele, index) => {
        let total_amount = Number(ele.total_amount);
        let total_tax = Number(ele.total_tax);
        taxableValues = Number(
          Number(taxableValues) + (total_amount - total_tax)
        ).toFixed(2);
        centralTax = Number(
          Number(centralTax) + Number(ele.cgst_amount)
        ).toFixed(2);
        sgst = Number(Number(sgst) + Number(ele.sgst_amount)).toFixed(2);
        igst = Number(Number(igst) + Number(ele.igst_amount)).toFixed(2);
        cess = Number(Number(cess) + Number(ele.cess)).toFixed(2);

        if (index === this.registeredCustomersaleData.length - 1) {
          result.registeredData = {
            taxableValues: taxableValues,
            centralTax: centralTax,
            sgst: sgst,
            igst: igst,
            cess: cess
          };
        }
      });

      this.unRegisteredCustomerSaleData.forEach((ele, index) => {
        let total_amount = Number(ele.total_amount);
        let total_tax = Number(ele.total_tax);
        unRegisteredtaxableValues = Number(
          Number(unRegisteredtaxableValues) + total_amount - total_tax
        ).toFixed(2);
        unRegisteredcentralTax = Number(
          Number(unRegisteredcentralTax) + Number(ele.cgst_amount)
        ).toFixed(2);
        unRegisteredsgst = Number(
          Number(unRegisteredsgst) + Number(ele.sgst_amount)
        ).toFixed(2);
        unRegisteredigst = Number(
          Number(unRegisteredigst) + Number(ele.igst_amount)
        ).toFixed(2);
        unRegisteredcess = Number(
          Number(unRegisteredcess) + Number(ele.cess)
        ).toFixed(2);

        if (index === this.unRegisteredCustomerSaleData.length - 1) {
          result.unRegisteredData = {
            taxableValues: unRegisteredtaxableValues,
            centralTax: unRegisteredcentralTax,
            sgst: unRegisteredsgst,
            igst: unRegisteredigst,
            cess: unRegisteredcess
          };
        }
      });

      this.SEZCustomerSalesData.forEach((ele, index) => {
        let total_amount = Number(ele.total_amount);
        let total_tax = Number(ele.total_tax);
        SEZtaxableValues = Number(
          Number(SEZtaxableValues) + (total_amount - total_tax)
        ).toFixed(2);
        SEZcentralTax = Number(
          Number(SEZcentralTax) + Number(ele.cgst_amount)
        ).toFixed(2);
        SEZsgst = Number(Number(SEZsgst) + Number(ele.sgst_amount)).toFixed(2);
        SEZigst = Number(Number(SEZigst) + Number(ele.igst_amount)).toFixed(2);
        SEZcess = Number(Number(SEZcess) + Number(ele.cess)).toFixed(2);

        if (index === this.SEZCustomerSalesData.length - 1) {
          result.sezData = {
            taxableValues: SEZtaxableValues,
            centralTax: SEZcentralTax,
            sgst: SEZsgst,
            igst: SEZigst,
            cess: SEZcess
          };
        }
      });

      this.DeemedCustomerData.forEach((ele, index) => {
        let total_amount = Number(ele.total_amount);
        let total_tax = Number(ele.total_tax);
        DeemedtaxableValues = Number(
          Number(DeemedtaxableValues) + total_amount - total_tax
        ).toFixed(2);
        DeemedcentralTax = Number(
          Number(DeemedcentralTax) + Number(ele.cgst_amount)
        ).toFixed(2);
        Deemedsgst = Number(
          Number(Deemedsgst) + Number(ele.sgst_amount)
        ).toFixed(2);
        Deemedigst = Number(
          Number(Deemedigst) + Number(ele.igst_amount)
        ).toFixed(2);
        Deemedcess = Number(Number(Deemedcess) + Number(ele.cess)).toFixed(2);

        if (index === this.DeemedCustomerData.length - 1) {
          result.deemedData = {
            taxableValues: DeemedtaxableValues,
            centralTax: DeemedcentralTax,
            sgst: Deemedsgst,
            igst: Deemedigst,
            cess: Deemedcess
          };
        }
      });

      this.reverseChargePurchasesData.forEach((ele, index) => {
        let total_amount = Number(ele.total_amount);
        let total_tax = Number(ele.total_tax);
        reverseChargetaxableValues = Number(
          Number(reverseChargetaxableValues) + total_amount - total_tax
        ).toFixed(2);
        reverseChargecentralTax = Number(
          Number(reverseChargecentralTax) + Number(ele.cgst_amount)
        ).toFixed(2);
        reverseChargesgst = Number(
          Number(reverseChargesgst) + Number(ele.sgst_amount)
        ).toFixed(2);
        reverseChargeigst = Number(
          Number(reverseChargeigst) + Number(ele.igst_amount)
        ).toFixed(2);
        reverseChargecess = Number(
          Number(reverseChargecess) + Number(ele.cess)
        ).toFixed(2);

        if (index === this.reverseChargePurchasesData.length - 1) {
          result.reverseCharge = {
            taxableValues: reverseChargetaxableValues,
            centralTax: reverseChargecentralTax,
            sgst: reverseChargesgst,
            igst: reverseChargeigst,
            cess: reverseChargecess
          };
        }
      });

      this.salesReturnData.forEach((ele, index) => {
        let total_amount = Number(ele.total_amount);
        let total_tax = Number(ele.total_tax);
        salesReturntaxableValues = Number(
          Number(salesReturntaxableValues) + total_amount - total_tax
        ).toFixed(2);
        salesReturncentralTax = Number(
          Number(salesReturncentralTax) + Number(ele.cgst_amount)
        ).toFixed(2);
        salesReturnsgst = Number(
          Number(salesReturnsgst) + Number(ele.sgst_amount)
        ).toFixed(2);
        salesReturnigst = Number(
          Number(salesReturnigst) + Number(ele.igst_amount)
        ).toFixed(2);
        salesReturncess = Number(
          Number(salesReturncess) + Number(ele.cess)
        ).toFixed(2);

        if (index === this.salesReturnData.length - 1) {
          result.salesReturn = {
            taxableValues: salesReturntaxableValues,
            centralTax: salesReturncentralTax,
            sgst: salesReturnsgst,
            igst: salesReturnigst,
            cess: salesReturncess
          };
        }
      });
      resolve(result);
    });
  };

  // ---------------------- GSTR 9 (5) --------------------------------

  getGSTR95Data = async () => {
    let SEZtaxableValues = 0;
    let ExemedtaxableValues = 0;
    let NillRateTaxableValues = 0;
    let NonGSTTaxableValues = 0;
    let salesReturnTaxableValues = 0;

    let result = {
      sezData: {
        taxableValues: 0,
        centralTax: 0,
        sgst: 0,
        igst: 0,
        cess: 0
      },
      exemedData: {
        taxableValues: 0,
        centralTax: 0,
        sgst: 0,
        igst: 0,
        cess: 0
      },
      nillratedData: {
        taxableValues: 0,
        centralTax: 0,
        sgst: 0,
        igst: 0,
        cess: 0
      },
      nonGSTData: {
        taxableValues: 0,
        centralTax: 0,
        sgst: 0,
        igst: 0,
        cess: 0
      },
      salesReturn: {
        taxableValues: 0,
        centralTax: 0,
        sgst: 0,
        igst: 0,
        cess: 0
      }
    };

    this.SEZCustomerSalesData.forEach((ele, index) => {
      let total_amount = Number(ele.total_amount);
      let total_tax = Number(ele.total_tax);
      if (
        Number(ele.cgst_amount) +
          Number(ele.sgst_amount) +
          Number(ele.igst_amount) ===
        0
      ) {
        SEZtaxableValues = Number(
          Number(SEZtaxableValues) + total_amount + total_tax
        ).toFixed(2);
      }
      if (index === this.SEZCustomerSalesData.length - 1) {
        result.sezData = {
          taxableValues: SEZtaxableValues
        };
      }
    });

    this.salesDataByProductExemed.forEach((ele, index) => {
      if (Number(ele.cgst) + Number(ele.sgst) + Number(ele.igst) === 0) {
        ExemedtaxableValues = Number(
          Number(ExemedtaxableValues) +
            Number(ele.offerPrice ? ele.offerPrice : ele.salePrice)
        ).toFixed(2);
      }
      if (index === this.salesDataByProductExemed.length - 1) {
        result.exemedData = {
          taxableValues: ExemedtaxableValues
        };
      }
    });

    this.salesDataByProductNillRated.forEach((ele, index) => {
      if (Number(ele.cgst) + Number(ele.sgst) + Number(ele.igst) === 0) {
        NillRateTaxableValues = Number(
          Number(NillRateTaxableValues) +
            Number(ele.offerPrice ? ele.offerPrice : ele.salePrice)
        ).toFixed(2);
      }
      if (index === this.salesDataByProductNillRated.length - 1) {
        result.nillratedData = {
          taxableValues: NillRateTaxableValues
        };
      }
    });

    this.salesDataByProductNonGST.forEach((ele, index) => {
      if (Number(ele.cgst) + Number(ele.sgst) + Number(ele.igst) === 0) {
        NonGSTTaxableValues = Number(
          Number(NonGSTTaxableValues) +
            Number(ele.offerPrice ? ele.offerPrice : ele.salePrice)
        ).toFixed(2);
      }
      if (index === this.salesDataByProductNonGST.length - 1) {
        result.nonGSTData = {
          taxableValues: NonGSTTaxableValues
        };
      }
    });

    this.salesReturnDataByProduct.forEach((ele, index) => {
      if (Number(ele.cgst) + Number(ele.sgst) + Number(ele.igst) === 0) {
        salesReturnTaxableValues = Number(
          Number(salesReturnTaxableValues) +
            Number(ele.offerPrice ? ele.offerPrice : ele.salePrice)
        ).toFixed(2);
      }
      if (index === this.salesReturnDataByProduct.length - 1) {
        result.salesReturn = {
          taxableValues: salesReturnTaxableValues
        };
      }
    });

    return result;
  };

  // --------------------- GSTR 9 (6) --------------------------------

  getGSTR6Data = async () => {
    let seznoreversecentralTax = 0;
    let seznoreversesgst = 0;
    let seznoreverseigst = 0;
    let seznoreversecess = 0;
    let unRegcentralTax = 0;
    let unRegsgst = 0;
    let unRegigst = 0;
    let unRegcess = 0;
    let RegcentralTax = 0;
    let Regsgst = 0;
    let Regigst = 0;
    let Regcess = 0;
    let overseascentralTax = 0;
    let overseassgst = 0;
    let overseasigst = 0;
    let overseascess = 0;
    let result = {
      purchaseSEZWithNoReverseCharge: {
        taxableValues: 0,
        centralTax: 0,
        sgst: 0,
        igst: 0,
        cess: 0
      },
      purchaseUnRegReverseCharge: {
        taxableValues: 0,
        centralTax: 0,
        sgst: 0,
        igst: 0,
        cess: 0
      },
      purchaseRegReverseCharge: {
        taxableValues: 0,
        centralTax: 0,
        sgst: 0,
        igst: 0,
        cess: 0
      },
      purchaseOverseas: {
        taxableValues: 0,
        centralTax: 0,
        sgst: 0,
        igst: 0,
        cess: 0
      }
    };

    this.gstr96sezData.forEach((ele, index) => {
      seznoreversecentralTax = Number(
        Number(seznoreversecentralTax) + Number(ele.cgst_amount)
      ).toFixed(2);
      seznoreverseigst = Number(
        Number(seznoreverseigst) + Number(ele.igst_amount)
      ).toFixed(2);
      seznoreversesgst = Number(
        Number(seznoreversesgst) + Number(ele.sgst_amount)
      ).toFixed(2);
      seznoreversecess = Number(
        Number(seznoreversecess) + Number(ele.cess)
      ).toFixed(2);

      if (index === this.gstr96sezData.length - 1) {
        result.purchaseSEZWithNoReverseCharge = {
          centralTax: seznoreversecentralTax,
          igst: seznoreverseigst,
          sgst: seznoreversesgst,
          cess: seznoreversecess
        };
      }
    });

    this.gstr96UnRegData.forEach((ele, index) => {
      unRegcentralTax = Number(
        Number(unRegcentralTax) + Number(ele.cgst_amount)
      ).toFixed(2);
      unRegigst = Number(Number(unRegigst) + Number(ele.igst_amount)).toFixed(
        2
      );
      unRegsgst = Number(Number(unRegsgst) + Number(ele.sgst_amount)).toFixed(
        2
      );
      unRegcess = Number(Number(unRegcess) + Number(ele.cess)).toFixed(2);

      if (index === this.gstr96UnRegData.length - 1) {
        result.purchaseUnRegReverseCharge = {
          centralTax: unRegcentralTax,
          igst: unRegigst,
          sgst: unRegsgst,
          cess: unRegcess
        };
      }
    });

    this.gstr96RegData.forEach((ele, index) => {
      RegcentralTax = Number(
        Number(RegcentralTax) + Number(ele.cgst_amount)
      ).toFixed(2);
      Regigst = Number(Number(Regigst) + Number(ele.igst_amount)).toFixed(2);
      Regsgst = Number(Number(Regsgst) + Number(ele.sgst_amount)).toFixed(2);
      Regcess = Number(Number(Regcess) + Number(ele.cess)).toFixed(2);

      if (index === this.gstr96RegData.length - 1) {
        result.purchaseRegReverseCharge = {
          centralTax: RegcentralTax,
          igst: Regigst,
          sgst: Regsgst,
          cess: Regcess
        };
      }
    });

    this.gstr96OverseasData.forEach((ele, index) => {
      overseascentralTax = Number(
        Number(overseascentralTax) + Number(ele.cgst_amount)
      ).toFixed(2);
      overseasigst = Number(
        Number(overseasigst) + Number(ele.igst_amount)
      ).toFixed(2);
      overseassgst = Number(
        Number(overseassgst) + Number(ele.sgst_amount)
      ).toFixed(2);
      overseascess = Number(Number(overseascess) + Number(ele.cess)).toFixed(2);

      if (index === this.gstr96OverseasData.length - 1) {
        result.purchaseOverseas = {
          centralTax: overseascentralTax,
          igst: overseasigst,
          sgst: overseassgst,
          cess: overseascess
        };
      }
    });

    return result;
  };

  getSalesRegisteredCustomerData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let result = [];

    await db.sales
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
        this.registeredCustomersaleData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getSalesSEZCustomerData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let result = [];

    await db.sales
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
              customerGstType: 'SEZ Customer'
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
        this.SEZCustomerSalesData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getSalesUnRegisteredCustomerData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let result = [];

    await db.sales
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
        this.unRegisteredCustomerSaleData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getSalesDeemedCustomerData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let result = [];

    await db.sales
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
              customerGstType: 'Deemed Export Customer'
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
        this.DeemedCustomerData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchaseReverseChargeData = async () => {
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
              reverseChargeEnable: true
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
        this.reverseChargePurchasesData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getSalesReturnData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var query;
    let result = [];

    query = db.salesreturn.find({
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
            $or: [
              {
                customerGstType: 'Registered Customer'
              },
              {
                customerGstType: 'SEZ Customer'
              },
              {
                customerGstType: 'Deemed Export Customer'
              }
            ]
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

      this.salesReturnData = result;
    });
  };

  getSaleDataByExemptedProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { taxType: { $eq: 'Exempted' } },
            {
              $or: [{ txnType: { $eq: 'Sales' } }, { txnType: { $eq: 'KOT' } }]
            },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        this.salesDataByProductExemed = data;
      });
  };

  getSaleDataByNilRatedProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { taxType: { $eq: 'Nil-Rated' } },
            {
              $or: [{ txnType: { $eq: 'Sales' } }, { txnType: { $eq: 'KOT' } }]
            },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        this.salesDataByProductNillRated = data;
      });
  };

  getSaleDataByNonGSTProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { taxType: { $eq: 'Non-GST' } },
            {
              $or: [{ txnType: { $eq: 'Sales' } }, { txnType: { $eq: 'KOT' } }]
            },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        this.salesDataByProductNonGST = data;
      });
  };

  getSaleReturnDataByProduct = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.producttxn
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              $or: [
                { taxType: { $eq: 'Non-GST' } },
                { taxType: { $eq: 'Nil-Rated' } },
                { taxType: { $eq: 'Exempted' } },
                { customerGstType: { $eq: 'SEZ Customer' } }
              ]
            },
            { txnType: { $eq: 'Sales Return' } },
            { txnDate: { $gte: this.GSTRDateRange.fromDate } },
            { txnDate: { $lte: this.GSTRDateRange.toDate } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No data is available
          return;
        }
        this.salesReturnDataByProduct = data;
      });
  };

  setGSTR94NValues = (val) => {
    this.gstr94NValue = val;
  };

  setGST94GValues = (val) => {
    this.gstr94GValue = val;
  };

  getPurchasesGSTR916Data = async () => {
    const db = await Db.get();

    let result = [];
    const businessData = await Bd.getBusinessData();

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
              vendor_gst_type: 'Composition Reg Vendor'
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
        this.gstr916Data = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchasesGSTR96sezData = async () => {
    const db = await Db.get();

    let result = [];
    const businessData = await Bd.getBusinessData();

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
              vendor_gst_type: 'SEZ Vendor'
            },
            {
              reverseChargeEnable: false
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
        this.gstr96sezData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchaseUnRegGSTR96Data = async () => {
    const db = await Db.get();

    let result = [];
    const businessData = await Bd.getBusinessData();

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
            },
            {
              reverseChargeEnable: true
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
        this.gstr96UnRegData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchaseRegGSTR96Data = async () => {
    const db = await Db.get();

    let result = [];
    const businessData = await Bd.getBusinessData();

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
            },
            {
              reverseChargeEnable: true
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
        this.gstr96RegData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchaseOverseasGSTR96Data = async () => {
    const db = await Db.get();

    let result = [];
    const businessData = await Bd.getBusinessData();

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
        this.gstr96OverseasData = result;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getPurchase16Data = async () => {
    let totalAmount = 0;
    let result = {
      totalAmount: 0
    };

    this.gstr916Data.forEach((ele, index) => {
      totalAmount = Number(
        Number(totalAmount) + Number(ele.total_amount)
      ).toFixed(2);
      if (index === this.gstr916Data.length - 1) {
        result = {
          totalAmount: totalAmount
        };
      }
    });

    return result;
  };

  constructor() {
    makeObservable(this, {
      registeredCustomersaleData: observable,
      salesReturnData: observable,
      getSalesRegisteredCustomerData: action,
      dataLoaded: observable,
      unRegisteredCustomerSaleData: observable,
      getSalesUnRegisteredCustomerData: action,
      getSalesSEZCustomerData: action,
      SEZCustomerSalesData: observable,
      DeemedCustomerData: observable,
      getSalesDeemedCustomerData: action,
      reverseChargePurchasesData: observable,
      getPurchaseReverseChargeData: action,
      getSalesReturnData: action,
      getGSTR95Data: action,
      getSaleDataByExemptedProduct: action,
      getSaleDataByNilRatedProduct: action,
      getSaleDataByNonGSTProduct: action,
      getSaleReturnDataByProduct: action
    });
  }
}
export default new GSTR9Store();
