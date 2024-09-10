import { action, observable, makeObservable, runInAction } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import { toJS } from 'mobx';
import moment from 'moment';
import * as Bd from '../../components/SelectedBusiness';
import {
  getFinancialYearStartDate,
  getFinancialYearStartDateByGivenDate,
  getYesterdayDate
} from '../../components/Helpers/DateHelper';
import { getProductTransactionSettings } from 'src/components/Helpers/dbQueries/producttransactionsettings';

class BalanceSheetStore {
  level2CategoriesList = [];

  level3CategoriesList = [];

  level2Selected = '';

  lowStockProductsList = null;

  cashFlowList = [];
  cashFlowReportsList = null;
  isCashFlowList = false;
  openingCashFlowList = null;

  taxdata = [];
  totalTaxBalance = 0;
  taxDataList = [];

  expiredProductData = [];

  totalCashInHand = 0;
  totalPaymnetInCash = 0;
  totalPaymnetOutCash = 0;
  finalCashInHand = 0;

  totalSaleAmount = 0;
  totalSaleReturnAmount = 0;
  totalPurchaseAmount = 0;
  totalPurchaseReturnAmount = 0;

  totalSalePurchasedAmount = 0;
  totalSaleReturnPurchasedAmount = 0;

  totalPurchaseReturnAmountFromAprilStart = 0;
  totalPurchaseAmountFromAprilStart = 0;

  totalSalesAmountFromAprilStart = 0;
  totalSalesReturnAmountFromAprilStart = 0;

  totalOpeningStockValue = 0;
  totalClosingStockValue = 0;
  openingStockValue = 0;
  totalGrossAmount = 0;
  totalExpensesAmount = 0;
  totalIndirectExpensesAmount = 0;
  netAmount = 0;
  totalMfgExpenses = new Map();
  totalMfgAmount = 0;
  totalMfgExpensesList = [];

  openExpiryAndLowStockReport = false;
  lowStockProductsCount = 0;
  expiredProductsCount = 0;
  reportRouterData = 'daybook';

  auditReportRouterData = 'sale';

  accountsPayableResult = [];
  accountsReceivableResult = [];
  accountsReceivableTotalToPay = 0;
  accountsPayableTotalToPay = 0;

  dayBookResults = [];
  dayBookTotal = {};
  cashBookResults = [];
  openingBalanceCashBook = 0;
  cashInTotalCashBook = 0;
  cashOutTotalCashBook = 0;

  selectedCustomer = {};
  selectedVendor = {};

  cashRegExp = new RegExp('^.*cash.*$', 'i');

  openingStockRawMaterialValue = 0;
  totalMfgOpeningStockRawMaterial = 0;
  totalMfgRawMaterialConsumptionAmount = 0;
  totalMfgPurchaseRawMaterialAmount = 0;
  totalMfgCarriageInwardsAmount = 0;
  totalMfgPurchaseReturnRawMaterialAmount = 0;
  totalMfgClosingStockRawMaterial = 0;
  totalCostOfRawMaterialsConsumed = 0;
  totalProductionCostOfGoodsProduced = 0;
  totalMfgPurchaseRawMaterialAmountFromAprilStart = 0;
  totalMfgPurchaseReturnRawMaterialAmountFromAprilStart = 0;

  // balance sheet fileds

  balanceSheetPayableAmount = 0;
  balanceSheetReceivableAmount = 0;

  balanceSheetTaxGstPayableAmount = 0;
  balanceSheetTaxGstReceivableAmount = 0;

  balanceSheetTaxTcsPayableAmount = 0;
  balanceSheetTaxTcsReceivableAmount = 0;

  balanceSheetOpeningCashInHand = 0;
  balanceSheetOpeningBankBalance = 0;
  balanceSheetOpeningPartyBalance = 0;

  balanceSheetOpeningStockValue = 0;
  balanceSheetClosingStockValue = 0;

  balanceSheetBankAccountsData = [];
  balanceSheetAdvancesAmount = 0;

  setReportRouterData = async (val) => {
    runInAction(() => {
      this.reportRouterData = val;
    });
  };

  setAuditReportRouterData = async (val) => {
    runInAction(() => {
      this.auditReportRouterData = val;
    });
  };

  setSelectedCustomer = async (customer) => {
    runInAction(() => {
      this.selectedCustomer = customer;
    });
  };

  resetSelectedCustomer = async () => {
    runInAction(() => {
      this.selectedCustomer = {};
    });
  };

  setSelectedVendor = async (vendor) => {
    runInAction(() => {
      this.selectedVendor = vendor;
    });
  };

  getAccountsPayableByData = async (customer) => {
    runInAction(() => {
      this.accountsPayableResult = [];
      this.accountsPayableTotalToPay = 0;
    });
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              date: { $exists: true }
            },
            {
              customerId: { $eq: customer.id }
            },
            {
              $or: [
                {
                  txnType: { $eq: 'Purchases' }
                },
                {
                  txnType: { $eq: 'Payment In' }
                },
                {
                  txnType: { $eq: 'Sales Return' }
                },
                {
                  txnType: { $eq: 'Opening Payable Balance' }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        let balanceTotal = 0;
        const finalData = data.map((item) => {
          let result = item.toJSON();
          balanceTotal = balanceTotal + parseFloat(item.balance);

          return result;
        });
        runInAction(() => {
          this.accountsPayableResult = finalData;
          this.accountsPayableTotalToPay = balanceTotal;
        });
      });
  };

  getAccountsPayableDataByVendor = async (vendor) => {
    runInAction(() => {
      this.accountsPayableResult = [];
      this.accountsPayableTotalToPay = 0;
    });
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              date: { $exists: true }
            },

            {
              vendorId: { $eq: vendor.id }
            },

            {
              $or: [
                {
                  txnType: { $eq: 'Purchases' }
                },
                {
                  txnType: { $eq: 'Expenses' }
                },
                {
                  txnType: { $eq: 'Payment In' }
                },
                {
                  txnType: { $eq: 'Sales Return' }
                },
                {
                  txnType: { $eq: 'Opening Payable Balance' }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        let balanceTotal = 0;
        const finalData = data.map((item) => {
          let result = item.toJSON();
          balanceTotal = balanceTotal + parseFloat(item.balance);

          return result;
        });
        runInAction(() => {
          this.accountsPayableResult = finalData;
          this.accountsPayableTotalToPay = balanceTotal;
        });
      });
  };

  resetAccountsPayableResult = async () => {
    runInAction(() => {
      this.accountsPayableResult = [];
      this.accountsPayableTotalToPay = 0;
    });
  };

  getAccountsReceivableFromAllTxn = async (customer) => {
    runInAction(() => {
      this.accountsReceivableResult = [];
      this.accountsReceivableTotalToPay = 0;
    });
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              date: { $exists: true }
            },
            {
              customerId: { $eq: customer.id }
            },
            {
              $or: [
                {
                  txnType: { $eq: 'Purchases Return' }
                },
                {
                  txnType: { $eq: 'Payment Out' }
                },
                {
                  txnType: { $eq: 'Sales' }
                },
                {
                  txnType: { $eq: 'KOT' }
                },
                {
                  txnType: { $eq: 'Opening Receivable Balance' }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        let balanceTotal = 0;
        const finalData = data.map((item) => {
          let result = item.toJSON();
          balanceTotal = balanceTotal + parseFloat(item.balance);

          return result;
        });
        runInAction(() => {
          this.accountsReceivableResult = finalData;
          this.accountsReceivableTotalToPay = balanceTotal;
        });
      });
  };

  getAccountsReceivableVendorFromAllTxn = async (vendor) => {
    runInAction(() => {
      this.accountsReceivableResult = [];
      this.accountsReceivableTotalToPay = 0;
    });
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              date: { $exists: true }
            },
            {
              vendorId: { $eq: vendor.id }
            },
            {
              $or: [
                {
                  txnType: { $eq: 'Purchases Return' }
                },
                {
                  txnType: { $eq: 'Payment Out' }
                },
                {
                  txnType: { $eq: 'Sales' }
                },
                {
                  txnType: { $eq: 'KOT' }
                },
                {
                  txnType: { $eq: 'Opening Receivable Balance' }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        let balanceTotal = 0;
        const finalData = data.map((item) => {
          let result = item.toJSON();
          balanceTotal = balanceTotal + parseFloat(item.balance);

          return result;
        });
        runInAction(() => {
          this.accountsReceivableResult = finalData;
          this.accountsReceivableTotalToPay = balanceTotal;
        });
      });
  };

  resetAccountsReceivableResult = async () => {
    runInAction(() => {
      this.accountsReceivableResult = [];
      this.accountsReceivableTotalToPay = 0;
    });
  };

  // get level2 and level3 categories
  getBusinessCategorieslist = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    db.businesscategories
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        const categoriesList = data.map((item) => item.toJSON());
        console.dir(categoriesList);
        /*
        extracting level2 and level3 categories
        */
        categoriesList.forEach((element) => {
          this.level2CategoriesList.push(element.level2Categories);
          this.level3CategoriesList.push(element.level3Categories);
        });

        /*
        removing the duplicates from level2 and level3 in case of any
        */

        runInAction(() => {
          try {
            this.level2CategoriesList = Array.from(
              new Set(this.level2CategoriesList.map(JSON.stringify))
            ).map(JSON.parse);
          } catch (e) {
            console.error(' Error: ', e.message);
          }

          try {
            this.level3CategoriesList = Array.from(
              new Set(this.level3CategoriesList.map(JSON.stringify))
            ).map(JSON.parse);
          } catch (e) {
            console.error(' Error: ', e.message);
          }
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getBusinessLevel2Categorieslist = async () => {
    const businessData = await Bd.getBusinessData();
    const db = await Db.get();
    db.businesscategories
      .find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec()
      .then((data) => {
        const categoriesList = data.map((item) => item.toJSON());
        /*
        extracting level2 categories
        */
        categoriesList.forEach((element) => {
          this.level2CategoriesList.push(element.level2Category);
        });
        /*
        removing the duplicates from level2 in case of any
        */

        runInAction(() => {
          try {
            this.level2CategoriesList = Array.from(
              new Set(this.level2CategoriesList.map(JSON.stringify))
            ).map(JSON.parse);
          } catch (e) {
            console.error(' Error: ', e.message);
          }
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getBusinessLevel3Categorieslist = async (level2Category) => {
    runInAction(() => {
      this.level2Selected = level2Category;
      this.level3CategoriesList = [];
    });
    const businessData = await Bd.getBusinessData();

    const db = await Db.get();
    db.businesscategories
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { 'level2Category.name': { $eq: level2Category } }
          ]
        }
      })
      .exec()
      .then((data) => {
        const categoriesList = data.map((item) => item.toJSON());
        let category = categoriesList[0].level3Categories;
        category.forEach((element) => {
          runInAction(() => {
            this.level3CategoriesList.push(element);
          });
        });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  getLowStockSummaryForAllCategories = async () => {
    return new Promise(async (resolve) => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      db.businessproduct
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { isStockReOrderQtyReached: { $eq: true } }
            ]
          }
        })
        .exec()
        .then((data) => {
          runInAction(() => {
            this.lowStockProductsList = data.map((item) => {
              let output = {};
              output.productId = item.productId;
              return output;
            });
          });

          resolve(`Resolved getLowStockSummaryForAllCategories`);
        })
        .catch((err) => {
          runInAction(() => {
            this.lowStockProductsList = [];
          });
          console.log('Internal Server Error', err);
        });
    });
  };

  getLowStockSummary = async (level3Category) => {
    const businessData = await Bd.getBusinessData();
    const db = await Db.get();
    db.businessproduct
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              'categoryLevel3.name': { $eq: level3Category }
            },
            { isStockReOrderQtyReached: { $eq: true } }
          ]
        }
      })
      .exec()
      .then((data) => {
        runInAction(() => {
          this.lowStockProductsList = [];
          this.lowStockProductsList = data.map((item) => item.toJSON());
        });
      })
      .catch((err) => {
        runInAction(() => {
          this.lowStockProductsList = [];
        });
        console.log('Internal Server Error', err);
      });
  };

  resetData = async () => {
    runInAction(() => {
      this.level2CategoriesList = [];
      this.level3CategoriesList = [];
      this.level2Selected = '';
      this.lowStockProductsList = [];
    });
  };

  openingCashFlowPaymentInData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentin.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  updatedAt: { $exists: true }
                },
                {
                  paymentType: { $regex: this.cashRegExp }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  updatedAt: { $exists: true }
                },
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Cash' },
                      amount: { $gt: 0 }
                    }
                  }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No data is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Payment In';
          runInAction(() => {
            this.openingCashFlowList = this.cashFlowList
              ? this.cashFlowList
              : [];
            this.openingCashFlowList.push(finalData);
          });
        });
        resolve(`done with openingCashFlowPaymentInData `);
      });
    });
  };

  openingCashFlowSalesReturnData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              payment_type: { $regex: this.cashRegExp }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No data is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Sales Return';

          if (
            typeof finalData.linkedTxnList === 'undefined' ||
            finalData.linkedTxnList.length === 0
          ) {
            runInAction(() => {
              this.openingCashFlowList = this.openingCashFlowList
                ? this.openingCashFlowList
                : [];
              this.openingCashFlowList.push(finalData);
            });
          }
        });
        resolve(`Resolved openingCashFlowSalesReturnData`);
      });
    });
  };

  openingCashFlowCreditPurchaseData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: fromDate
              }
            },
            {
              bill_date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              balance_amount: { $eq: 0 }
            },
            {
              is_credit: { $eq: false }
            }
          ]
        },
        sort: [{ bill_date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No data is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases';

          if (
            typeof finalData.linkedTxnList === 'undefined' ||
            finalData.linkedTxnList.length === 0
          ) {
            runInAction(() => {
              this.openingCashFlowList = this.openingCashFlowList
                ? this.openingCashFlowList
                : [];
              this.openingCashFlowList.push(finalData);
            });
          }
        });
        resolve(`Resolved openingCashFlowCreditPurchaseData`);
      });
    });
  };

  openingCashFlowSaledata = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              payment_type: { $regex: this.cashRegExp }
            },
            {
              is_credit: { $eq: false }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No data is available
          return;
        }
        data.map((item) => {
          //
          let finalData = item.toJSON();
          finalData.transactionType = 'Sales';

          if (
            typeof finalData.linkedTxnList === 'undefined' ||
            finalData.linkedTxnList.length === 0
          ) {
            runInAction(() => {
              this.openingCashFlowList = this.openingCashFlowList
                ? this.openingCashFlowList
                : [];
              this.openingCashFlowList.push(finalData);
            });
          }
        });
        resolve(`Resolved openingCashFlowSaledata`);
      });
    });
  };

  openingCashFlowPaymentOutData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentout.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  updatedAt: { $exists: true }
                },
                {
                  paymentType: { $regex: this.cashRegExp }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  updatedAt: { $exists: true }
                },
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Cash' },
                      amount: { $gt: 0 }
                    }
                  }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Payment Out';
          runInAction(() => {
            this.openingCashFlowList = this.openingCashFlowList
              ? this.openingCashFlowList
              : [];
            this.openingCashFlowList.push(finalData);
          });
        });
        resolve(`Resolved openingCashFlowPaymentOutData`);
      });
    });
  };

  openingCashFlowPurchaseReturnsData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchasesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              payment_type: { $regex: this.cashRegExp }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available

          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases Return';
          if (
            typeof finalData.linkedTxnList === 'undefined' ||
            finalData.linkedTxnList.length === 0
          ) {
            runInAction(() => {
              this.openingCashFlowList = this.openingCashFlowList
                ? this.openingCashFlowList
                : [];
              this.openingCashFlowList.push(finalData);
            });
          }
        });
        resolve(`Resolved openingCashFlowPurchaseReturnsData`);
      });
    });
  };

  openingCashFlowCashInHandData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.cashadjustments.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Cash Adjustment';
          runInAction(() => {
            this.openingCashFlowList = this.openingCashFlowList
              ? this.openingCashFlowList
              : [];
            this.openingCashFlowList.push(finalData);
          });
        });
        resolve(`done with openingCashFlowCashInHandData `);
      });
    });
  };

  getTotalCashInHand = async (fromDate, toDate) => {
    var query;

    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    query = db.alltransactions.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                paymentType: {
                  $regex: this.cashRegExp
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                splitPaymentList: {
                  $elemMatch: {
                    paymentType: { $eq: 'Cash' },
                    amount: { $gt: 0 }
                  }
                }
              }
            ]
          }
        ]
      }
    });

    let results = [];
    await query.exec().then((data) => {
      if (!data) {
        // No customer is available
        return;
      }
      results = data.map((item) => {
        let finalData = {};
        finalData.txnType = item.txnType;

        let amount = 0;
        let paymentType = item.paymentType;
        if (item.splitPaymentList && item.splitPaymentList.length > 0) {
          let splitAmount = 0;
          for (let payment of item.splitPaymentList) {
            if (payment.paymentType === 'Cash') {
              splitAmount += parseFloat(payment.amount);
              paymentType = 'Cash';
            }
          }
          amount = parseFloat(splitAmount);
        } else {
          amount = parseFloat(item.amount);
        }

        finalData.amount = parseFloat(amount);
        finalData.paymentType = paymentType;
        return finalData;
      });
    });

    /**
     * get total payment in , payment out data,
     * then calculate total cash in hand
     */
    let totalCashInHand = 0;
    let totalCashOutHand = 0;

    for (const data of results) {
      let cashOut = 0;
      let cashIn = 0;
      if (
        data['txnType'] === 'Payment Out' ||
        data['txnType'] === 'Sales Return' ||
        data['txnType'] === 'Purchases' ||
        data['txnType'] === 'Expenses'
      ) {
        cashOut = data['amount'];
      } else if (
        data['txnType'] === 'Payment In' ||
        data['txnType'] === 'Sales' ||
        data['txnType'] === 'Purchases Return' ||
        data['txnType'] === 'KOT'
      ) {
        cashIn = data['amount'];
      } else if (data['txnType'] === 'Cash Adjustment') {
        if (data['paymentType'] === 'addCash') {
          cashIn = data['amount'];
        } else {
          cashOut = data['amount'];
        }
      }

      if (cashIn > 0) {
        totalCashInHand = parseFloat(totalCashInHand) + parseFloat(cashIn);
      } else if (cashOut > 0) {
        totalCashOutHand = parseFloat(totalCashOutHand) + parseFloat(cashOut);
      }
    }

    let finalTotalCashInHand = (totalCashInHand =
      parseFloat(totalCashInHand) - parseFloat(totalCashOutHand));

    return finalTotalCashInHand;
  };

  bsCashInHandInSelctedDate = async (db, fromDate, toDate) => {
    return await this.getTotalCashInHand(fromDate, toDate);
  };

  openingPayableBalance = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.alltransactions.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              balance: { $gt: 0 }
            },

            {
              txnType: { $eq: 'Opening Payable Balance' }
            },

            {
              date: { $gte: fromDate }
            },
            {
              date: { $lte: toDate }
            }
          ]
        }
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance;
          output.type = 'Opening Payable Balance';
          output.refNo = item.id;
          output.date = item.date;

          if (item.vendorName) {
            output.name = item.vendorName;
          } else {
            output.name = item.customerName;
          }

          runInAction(() => {
            this.accountsPayableResult.push(output);
          });
        });
        resolve(`Resolved openingPayableBalance`);
      });
    });
  };

  getAccountsPayableData = async (fromDate, toDate) => {
    const db = await Db.get();

    let response = {};
    runInAction(() => {
      this.accountsPayableResult = [];
    });

    await Promise.all([
      this.payablePurchases(db, fromDate, toDate),
      this.payableSalesReturn(db, fromDate, toDate),
      this.payablePaymentIn(db, fromDate, toDate),
      this.openingPayableBalance(db, fromDate, toDate)
    ]).then(() => {
      let totalToPay = 0;
      for (const data of this.accountsPayableResult) {
        totalToPay = totalToPay + parseFloat(data.toPay || 0);
      }

      var listOfRecords = this.accountsPayableResult;

      //aggrigate deplicates
      let map = listOfRecords.reduce((prev, next) => {
        if (next.name in prev) {
          prev[next.name].toPay += next.toPay;
        } else {
          prev[next.name] = next;
        }
        return prev;
      }, {});

      let uniqueListOfRecords;
      if (map) {
        uniqueListOfRecords = Object.keys(map).map((name) => map[name]);
      }

      //sorting the unique list of records with out case sensitive
      uniqueListOfRecords.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );

      runInAction(() => {
        this.accountsReceivableResult = uniqueListOfRecords;
      });

      response.accountsPayableResult = this.accountsPayableResult;
      response.totalToPay = parseFloat(totalToPay).toFixed(2);
    });
    return response;
  };

  getAccountsPayableByCustomerData = async (id) => {
    const db = await Db.get();

    let response = {};
    runInAction(() => {
      this.accountsPayableResult = [];
    });

    await Promise.all([
      this.payableSalesReturnByCustomer(db, id),
      this.payablePaymentInByCustomer(db, id)
    ]).then(() => {
      let totalToPay = 0;
      for (const data of this.accountsPayableResult) {
        totalToPay = totalToPay + parseFloat(data.toPay || 0);
      }

      var listOfRecords = this.accountsPayableResult;
      listOfRecords.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);

        let test = d - c;
        return test;
      });

      runInAction(() => {
        this.accountsPayableResult = listOfRecords;
      });

      response.accountsPayableResult = this.accountsPayableResult;
      response.totalToPay = parseFloat(totalToPay).toFixed(2);

      runInAction(() => {
        this.accountsPayableTotalToPay = response.totalToPay;
      });
    });
    return response;
  };

  getAccountsPayableByVendorData = async (id) => {
    const db = await Db.get();

    let response = {};
    runInAction(() => {
      this.accountsPayableResult = [];
    });

    await Promise.all([
      this.payablePurchasesByVendor(db, id),
      this.payablePaymentInByVendor(db, id)
    ]).then(() => {
      let totalToPay = 0;
      for (const data of this.accountsPayableResult) {
        totalToPay = totalToPay + parseFloat(data.toPay || 0);
      }

      var listOfRecords = this.accountsPayableResult;
      listOfRecords.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);

        let test = d - c;
        return test;
      });

      runInAction(() => {
        this.accountsPayableResult = listOfRecords;
      });

      response.accountsPayableResult = this.accountsPayableResult;
      response.totalToPay = parseFloat(totalToPay).toFixed(2);

      runInAction(() => {
        this.accountsPayableTotalToPay = response.totalToPay;
      });
    });
    return response;
  };

  getDayBookData = async (date) => {
    const db = await Db.get();

    runInAction(() => {
      this.dayBookResults = [];
      this.dayBookTotal = {};
    });
    const businessData = await Bd.getBusinessData();

    let Query = db.alltransactions.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: { $eq: date }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let totalCredit = 0;
      let totalDebit = 0;
      let totalCashCredit = 0;
      let totalCashDebit = 0;
      let totalUpiCredit = 0;
      let totalUpiDebit = 0;
      let totalCardCredit = 0;
      let totalCardDebit = 0;
      let totalNetBankingCredit = 0;
      let totalNetBankingDebit = 0;
      let totalChequeCredit = 0;
      let totalChequeDebit = 0;
      let totalGiftCardCredit = 0;
      let totalGiftCardDebit = 0;
      let totalCustomFinanceCredit = 0;
      let totalCustomFinanceDebit = 0;
      let totalExchangeCredit = 0;

      const finalData = data.map((item) => {
        let result = item.toJSON();

        result['upi'] = 0;
        result['netBanking'] = 0;
        result['cheque'] = 0;
        result['card'] = 0;
        result['cash'] = 0;
        result['giftCard'] = 0;
        result['customFinance'] = 0;
        result['exchange'] = 0;

        if (result.splitPaymentList && result.splitPaymentList.length > 0) {
          for (let payment of result.splitPaymentList) {
            if (payment.paymentType === 'Cash') {
              result['cash'] += parseFloat(payment.amount);
            } else if (payment.paymentType === 'Gift Card') {
              result['giftCard'] += parseFloat(payment.amount);
            } else if (payment.paymentType === 'Custom Finance') {
              result['customFinance'] += parseFloat(payment.amount);
            } else if (payment.paymentType === 'Exchange') {
              result['exchange'] += parseFloat(payment.amount);
            } else if (payment.paymentMode === 'UPI') {
              result['upi'] += parseFloat(payment.amount);
            } else if (payment.paymentMode === 'Internet Banking') {
              result['netBanking'] += parseFloat(payment.amount);
            } else if (payment.paymentMode === 'Cheque') {
              result['cheque'] += parseFloat(payment.amount);
            } else if (
              payment.paymentMode === 'Credit Card' ||
              payment.paymentMode === 'Debit Card'
            ) {
              result['card'] += parseFloat(payment.amount);
            }
          }
        } else {
          if (
            (result.payment_type && result.payment_type === 'cash') ||
            (result.paymentType && result.paymentType === 'cash')
          ) {
            result['cash'] = parseFloat(result.amount);
          } else if (
            (result.payment_type && result.payment_type === 'upi') ||
            (result.paymentType && result.paymentType === 'upi')
          ) {
            result['upi'] = parseFloat(result.amount);
          } else if (
            (result.payment_type &&
              result.payment_type === 'internetbanking') ||
            (result.paymentType && result.paymentType === 'internetbanking')
          ) {
            result['netBanking'] = parseFloat(result.amount);
          } else if (
            (result.payment_type && result.payment_type === 'cheque') ||
            (result.paymentType && result.paymentType === 'cheque')
          ) {
            result['cheque'] = parseFloat(result.amount);
          } else if (
            (result.payment_type && result.payment_type === 'creditcard') ||
            (result.paymentType && result.paymentType === 'creditcard') ||
            (result.payment_type && result.payment_type === 'debitcard') ||
            (result.paymentType && result.paymentType === 'debitcard')
          ) {
            result['card'] = parseFloat(result.amount);
          }
        }

        if (
          result['txnType'] === 'Payment In' ||
          result['txnType'] === 'Sales' ||
          result['txnType'] === 'Purchases Return' ||
          result['txnType'] === 'KOT' ||
          result['txnType'] === 'Opening Balance'
        ) {
          if (result.isCredit) {
            if (result['paidOrReceivedAmount']) {
              totalCredit =
                totalCredit + parseFloat(result['paidOrReceivedAmount']);
            }
          } else {
            if (result['amount']) {
              totalCredit = totalCredit + parseFloat(result['amount']);
              totalCashCredit = totalCashCredit + parseFloat(result['cash']);
              totalUpiCredit = totalUpiCredit + parseFloat(result['upi']);
              totalCardCredit = totalCardCredit + parseFloat(result['card']);
              totalNetBankingCredit =
                totalNetBankingCredit + parseFloat(result['netBanking']);
              totalChequeCredit =
                totalChequeCredit + parseFloat(result['cheque']);
              totalGiftCardCredit =
                totalGiftCardCredit + parseFloat(result['giftCard']);
              totalCustomFinanceCredit =
                totalCustomFinanceCredit + parseFloat(result['customFinance']);
              totalExchangeCredit =
                totalExchangeCredit + parseFloat(result['exchange']);
            }
          }
        }

        if (
          result['txnType'] === 'Payment Out' ||
          result['txnType'] === 'Sales Return' ||
          result['txnType'] === 'Purchases' ||
          result['txnType'] === 'Expenses'
        ) {
          if (result.isCredit) {
            if (result['paidOrReceivedAmount']) {
              totalDebit =
                totalDebit + parseFloat(result['paidOrReceivedAmount']);
            }
          } else {
            if (result['amount']) {
              totalDebit = totalDebit + parseFloat(result['amount']);
              totalCashDebit = totalCashDebit + parseFloat(result['cash']);
              totalUpiDebit = totalUpiDebit + parseFloat(result['upi']);
              totalCardDebit = totalCardDebit + parseFloat(result['card']);
              totalNetBankingDebit =
                totalNetBankingDebit + parseFloat(result['netBanking']);
              totalChequeDebit =
                totalChequeDebit + parseFloat(result['cheque']);
              totalGiftCardDebit =
                totalGiftCardDebit + parseFloat(result['giftCard']);
              totalCustomFinanceDebit =
                totalCustomFinanceDebit + parseFloat(result['customFinance']);
            }
          }
        }

        return result;
      });

      runInAction(() => {
        this.dayBookTotal.cashIn = parseFloat(totalCredit).toFixed(2);
        this.dayBookTotal.cashOut = parseFloat(totalDebit).toFixed(2);
        this.dayBookTotal.totalCashCredit =
          parseFloat(totalCashCredit).toFixed(2);
        this.dayBookTotal.totalCashDebit =
          parseFloat(totalCashDebit).toFixed(2);
        this.dayBookTotal.totalCardCredit =
          parseFloat(totalCardCredit).toFixed(2);
        this.dayBookTotal.totalCardDebit =
          parseFloat(totalCardDebit).toFixed(2);
        this.dayBookTotal.totalUpiCredit =
          parseFloat(totalUpiCredit).toFixed(2);
        this.dayBookTotal.totalUpiDebit = parseFloat(totalUpiDebit).toFixed(2);
        this.dayBookTotal.totalNetBankingCredit = parseFloat(
          totalNetBankingCredit
        ).toFixed(2);
        this.dayBookTotal.totalNetBankingDebit =
          parseFloat(totalNetBankingDebit).toFixed(2);
        this.dayBookTotal.totalChequeCredit =
          parseFloat(totalChequeCredit).toFixed(2);
        this.dayBookTotal.totalChequeDebit =
          parseFloat(totalChequeDebit).toFixed(2);
        this.dayBookTotal.totalCustomFinanceCredit = parseFloat(
          totalCustomFinanceCredit
        ).toFixed(2);
        this.dayBookTotal.totalCustomFinanceDebit = parseFloat(
          totalCustomFinanceDebit
        ).toFixed(2);
        this.dayBookTotal.totalGiftCardCredit =
          parseFloat(totalGiftCardCredit).toFixed(2);
        this.dayBookTotal.totalGiftCardDebit =
          parseFloat(totalGiftCardDebit).toFixed(2);
        this.dayBookTotal.totalExchangeCredit =
          parseFloat(totalExchangeCredit).toFixed(2);

        this.dayBookResults = finalData;
      });
    });

    return this.dayBookResults;
  };

  getDayBookEmployeeData = async (date, id) => {
    const db = await Db.get();

    runInAction(() => {
      this.dayBookResults = [];
      this.dayBookTotal = {};
    });
    const businessData = await Bd.getBusinessData();

    let Query;
    if (id) {
      Query = db.alltransactions.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: { $eq: date }
            },
            {
              employeeId: { $eq: id }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              $or: [
                {
                  isCredit: { $eq: false }
                },
                {
                  paidOrReceivedAmount: { $gt: 0 }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });
    } else {
      Query = db.alltransactions.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: { $eq: date }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              $or: [
                {
                  isCredit: { $eq: false }
                },
                {
                  paidOrReceivedAmount: { $gt: 0 }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });
    }

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let cashIn = 0;
      let cashOut = 0;
      const finalData = data.map((item) => {
        let result = item.toJSON();

        if (
          result['txnType'] === 'Payment In' ||
          result['txnType'] === 'Sales' ||
          result['txnType'] === 'Purchases Return' ||
          result['txnType'] === 'KOT' ||
          result['txnType'] === 'Opening Balance'
        ) {
          if (result.isCredit) {
            if (result['paidOrReceivedAmount']) {
              cashIn = cashIn + parseFloat(result['paidOrReceivedAmount']);
            }
          } else {
            if (result['amount']) {
              cashIn = cashIn + parseFloat(result['amount']);
            }
          }
        }

        if (
          result['txnType'] === 'Payment Out' ||
          result['txnType'] === 'Sales Return' ||
          result['txnType'] === 'Purchases' ||
          result['txnType'] === 'Expenses'
        ) {
          if (result.isCredit) {
            if (result['paidOrReceivedAmount']) {
              cashOut = cashOut + parseFloat(result['paidOrReceivedAmount']);
            }
          } else {
            if (result['amount']) {
              cashOut = cashOut + parseFloat(result['amount']);
            }
          }
        }

        return result;
      });

      runInAction(() => {
        this.dayBookTotal.cashIn = parseFloat(cashIn).toFixed(2);
        this.dayBookTotal.cashOut = parseFloat(cashOut).toFixed(2);
        this.dayBookResults = finalData;
      });
    });

    return this.dayBookResults;
  };

  dayBookSales = async (db, date) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $eq: date
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.cashIn = item.total_amount;
          output.cashOut = 0;
          output.type = 'Sales';
          output.refNo = item.invoice_number;
          output.date = item.invoice_date;
          output.name = item.customer_name;

          runInAction(() => {
            this.dayBookResults.push(output);
          });
        });
        resolve(`Resolved dayBookSales`);
      });
    });
  };
  dayBookSalesReturn = async (db, date) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $eq: date
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};
          output.cashOut = item.total_amount;
          output.cashIn = 0;
          output.type = 'Sales Return';
          output.refNo = item.sales_return_number;
          output.date = item.date;
          output.name = item.customer_name;

          runInAction(() => {
            this.dayBookResults.push(output);
          });
        });
        resolve(`Resolved dayBookSalesReturn`);
      });
    });
  };
  dayBookPurchases = async (db, date) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $eq: date
              }
            }
          ]
        },
        sort: [{ bill_date: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.cashOut = item.total_amount;
          output.cashIn = 0;
          output.type = 'Purchases';
          output.refNo = item.bill_number;
          output.date = item.bill_date;
          output.name = item.vendor_name;

          runInAction(() => {
            this.dayBookResults.push(output);
          });
        });

        resolve(`Resolved dayBookPurchases`);
      });
    });
  };
  dayBookPurchasesReturn = async (db, date) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchasesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $eq: date
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available

          return;
        }
        data.map((item) => {
          let output = {};

          output.cashIn = item.total_amount;
          output.cashOut = 0;
          output.type = 'Purchases Return';
          output.refNo = item.purchaseReturnBillNumber;
          output.date = item.date;
          output.name = item.vendor_name;

          runInAction(() => {
            this.dayBookResults.push(output);
          });
        });
        resolve(`Resolved dayBookPurchasesReturn`);
      });
    });
  };
  dayBookPaymentIn = async (db, date) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentin.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $eq: date
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};
          output.cashIn = item.total;
          output.cashOut = 0;
          output.type = 'Payment In';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.customerName;

          runInAction(() => {
            this.dayBookResults.push(output);
          });
        });
        resolve(`done with dayBookPaymentIn `);
      });
    });
  };
  dayBookPaymentOut = async (db, date) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentout.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $eq: date
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.cashOut = item.total;
          output.cashIn = 0;
          output.type = 'Payment Out';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.vendorName;

          runInAction(() => {
            this.dayBookResults.push(output);
          });
        });
        resolve(`Resolved dayBookPaymentOut`);
      });
    });
  };
  dayBookExpenses = async (db, date) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.expenses.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $eq: date
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.cashOut = item.total;
          output.cashIn = 0;
          output.type = 'Expenses';
          output.refNo = item.expenseId;
          output.date = item.date;
          output.name = item.vendorName;

          runInAction(() => {
            this.dayBookResults.push(output);
          });
        });
        resolve(`Resolved dayBookExpenses`);
      });
    });
  };

  getCashBookTxnData = async (db, fromDate, toDate) => {
    runInAction(() => {
      this.cashBookResults = [];
      this.cashInTotalCashBook = 0;
      this.cashOutTotalCashBook = 0;
    });
    const businessData = await Bd.getBusinessData();

    let Query = db.alltransactions.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: { $gte: fromDate }
              },
              {
                date: { $lte: toDate }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                paymentType: { $regex: this.cashRegExp }
              },
              {
                $or: [
                  {
                    isCredit: { $eq: false }
                  },
                  {
                    paidOrReceivedAmount: { $gt: 0 }
                  }
                ]
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: { $gte: fromDate }
              },
              {
                date: { $lte: toDate }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                splitPaymentList: {
                  $elemMatch: {
                    paymentType: { $eq: 'Cash' },
                    amount: { $gt: 0 }
                  }
                }
              },
              {
                $or: [
                  {
                    isCredit: { $eq: false }
                  },
                  {
                    paidOrReceivedAmount: { $gt: 0 }
                  }
                ]
              }
            ]
          }
        ]
      },
      sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let cashIn = 0;
      let cashOut = 0;
      const finalData = data.map((item) => {
        let result = item.toJSON();

        let amount = 0;
        if (item.splitPaymentList && item.splitPaymentList.length > 0) {
          let splitAmount = 0;
          for (let payment of item.splitPaymentList) {
            if (payment.paymentType === 'Cash') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        } else {
          amount = parseFloat(item.amount);
        }

        if (
          result['txnType'] === 'Payment In' ||
          result['txnType'] === 'Sales' ||
          result['txnType'] === 'Purchases Return' ||
          result['txnType'] === 'KOT'
        ) {
          if (result.isCredit) {
            if (result['paidOrReceivedAmount']) {
              cashIn = cashIn + parseFloat(result['paidOrReceivedAmount']);
            }
          } else {
            if (amount) {
              cashIn = cashIn + parseFloat(amount);
            }
          }
        } else {
          if (result.isCredit) {
            if (result['paidOrReceivedAmount']) {
              cashOut = cashOut + parseFloat(result['paidOrReceivedAmount']);
            }
          } else {
            if (amount) {
              cashOut = cashOut + parseFloat(amount);
            }
          }
        }

        return result;
      });

      runInAction(() => {
        this.cashInTotalCashBook = parseFloat(cashIn).toFixed(2);
        this.cashOutTotalCashBook = parseFloat(cashOut).toFixed(2);
        this.cashBookResults = finalData;
      });
    });
  };

  getCashBookData = async (fromDate, toDate) => {
    const db = await Db.get();

    runInAction(() => {
      this.cashBookResults = [];
      this.openingBalanceCashBook = 0;
      this.currentTotalCashBook = 0;
    });

    await Promise.all([
      this.getCashBookTxnData(db, fromDate, toDate),

      this.cbCashInHandByDate(db, fromDate)
    ]).then(() => {
      //nothing to do here
    });
    return this.cashBookResults;
  };

  cashBookSales = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              payment_type: { $regex: this.cashRegExp }
            },
            {
              is_credit: { $eq: false }
            }
          ]
        }
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.cashIn = item.total_amount;
          output.cashOut = 0;
          output.type = 'Sales';
          output.refNo = item.invoice_number;
          output.date = item.invoice_date;
          output.name = item.customer_name;

          runInAction(() => {
            this.cashBookResults.push(output);
          });
        });
        resolve(`Resolved cashBookSales`);
      });
    });
  };
  cashBookSalesReturn = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              payment_type: { $regex: this.cashRegExp }
            },
            {
              is_credit: { $eq: false }
            }
          ]
        }
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};
          output.cashOut = item.total_amount;
          output.cashIn = 0;
          output.type = 'Sales Return';
          output.refNo = item.sales_return_number;
          output.date = item.date;
          output.name = item.customer_name;

          runInAction(() => {
            this.cashBookResults.push(output);
          });
        });
        resolve(`Resolved cashBookSalesReturn`);
      });
    });
  };
  cashBookPurchases = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: fromDate
              }
            },
            {
              bill_date: {
                $lte: toDate
              }
            },
            {
              payment_type: { $regex: this.cashRegExp }
            },
            {
              is_credit: { $eq: false }
            }
          ]
        },
        sort: [{ bill_date: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.cashOut = item.total_amount;
          output.cashIn = 0;
          output.type = 'Purchases';
          output.refNo = item.bill_number;
          output.date = item.bill_date;
          output.name = item.vendor_name;

          runInAction(() => {
            this.cashBookResults.push(output);
          });
        });

        resolve(`Resolved cashBookPurchases`);
      });
    });
  };
  cashBookPurchasesReturn = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchasesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              payment_type: { $regex: this.cashRegExp }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              is_credit: { $eq: false }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available

          return;
        }
        data.map((item) => {
          let output = {};

          output.cashIn = item.total_amount;
          output.cashOut = 0;
          output.type = 'Purchases Return';
          output.refNo = item.purchaseReturnBillNumber;
          output.date = item.date;
          output.name = item.vendor_name;

          runInAction(() => {
            this.cashBookResults.push(output);
          });
        });
        resolve(`Resolved cashBookPurchasesReturn`);
      });
    });
  };
  cashBookPaymentIn = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentin.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  paymentType: { $regex: this.cashRegExp }
                },
                {
                  updatedAt: { $exists: true }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Cash' },
                      amount: { $gt: 0 }
                    }
                  }
                },
                {
                  updatedAt: { $exists: true }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          let amount = 0;
          if (item.splitPaymentList && item.splitPaymentList.length > 0) {
            let splitAmount = 0;
            for (let payment of item.splitPaymentList) {
              if (payment.paymentType === 'Cash') {
                splitAmount += parseFloat(payment.amount);
              }
            }
            amount = parseFloat(splitAmount);
          } else {
            amount = parseFloat(item.total);
          }

          output.cashIn = amount;
          output.cashOut = 0;
          output.type = 'Payment In';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.customerName;

          runInAction(() => {
            this.cashBookResults.push(output);
          });
        });
        resolve(`done with cashbookPaymentIn `);
      });
    });
  };

  cashBookPaymentOut = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentout.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  paymentType: { $regex: this.cashRegExp }
                },
                {
                  updatedAt: { $exists: true }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Cash' },
                      amount: { $gt: 0 }
                    }
                  }
                },
                {
                  updatedAt: { $exists: true }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          let amount = 0;
          if (item.splitPaymentList && item.splitPaymentList.length > 0) {
            let splitAmount = 0;
            for (let payment of item.splitPaymentList) {
              if (payment.paymentType === 'Cash') {
                splitAmount += parseFloat(payment.amount);
              }
            }
            amount = parseFloat(splitAmount);
          } else {
            amount = parseFloat(item.total);
          }

          output.cashOut = amount;
          output.cashIn = 0;
          output.type = 'Payment Out';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.vendorName;

          runInAction(() => {
            this.cashBookResults.push(output);
          });
        });
        resolve(`Resolved cashbookPaymentOut`);
      });
    });
  };
  cashBookExpenses = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.expenses.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  paymentType: { $regex: this.cashRegExp }
                },
                {
                  updatedAt: { $exists: true }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                {
                  date: {
                    $gte: fromDate
                  }
                },
                {
                  date: {
                    $lte: toDate
                  }
                },
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Cash' },
                      amount: { $gt: 0 }
                    }
                  }
                },
                {
                  updatedAt: { $exists: true }
                }
              ]
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          let amount = 0;
          if (item.splitPaymentList && item.splitPaymentList.length > 0) {
            let splitAmount = 0;
            for (let payment of item.splitPaymentList) {
              if (payment.paymentType === 'Cash') {
                splitAmount += parseFloat(payment.amount);
              }
            }
            amount = parseFloat(splitAmount);
          } else {
            amount = parseFloat(item.total);
          }

          output.cashOut = amount;
          output.cashIn = 0;
          output.type = 'Expenses';
          output.refNo = item.expenseId;
          output.date = item.date;
          output.name = item.vendorName;

          runInAction(() => {
            this.cashBookResults.push(output);
          });
        });
        resolve(`Resolved cashBookExpenses`);
      });
    });
  };

  cbCashInHandByDate = async (db, date) => {
    this.openingBalanceCashBook = await this.getCashInHandByDate(db, date);
  };

  bsOpeningCashInHandByDate = async (db, date) => {
    return await this.getCashInHandByDate(db, date);
  };

  getCashInHandByDate = async (db, date) => {
    const oneDayBefore = moment(date).subtract(1, 'day').format('YYYY-MM-DD');
    const businessData = await Bd.getBusinessData();
    const startFinancialYear =
      getFinancialYearStartDateByGivenDate(oneDayBefore);

    try {
      const data = await db.cashinhand
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { date: { $gte: startFinancialYear } },
              { date: { $lte: oneDayBefore } }
            ]
          }
        })
        .exec();

      let cashinHand = 0;
      if (data) {
        cashinHand = data.totalCash;
      }
      return cashinHand;
    } catch (err) {
      console.log('Internal Server Error', err);
    }
  };

  payablePaymentIn = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentin.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};
          output.toPay = item.balance;
          output.type = 'Payment In';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.customerName;

          runInAction(() => {
            this.accountsPayableResult.push(output);
          });
        });
        resolve(`done with payablePaymentIn `);
      });
    });
  };

  payablePaymentInByCustomer = async (db, id) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentin.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              customerId: {
                $eq: id
              }
            },
            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              date: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};
          output.toPay = item.balance;
          output.type = 'Payment In';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.customerName;

          runInAction(() => {
            this.accountsPayableResult.push(output);
          });
        });
        resolve(`done with payablePaymentInByCustomer `);
      });
    });
  };

  payablePaymentInByVendor = async (db, id) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentin.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              customerId: {
                $eq: id
              }
            },
            {
              balance: { $gt: 0 }
            }
          ]
        }
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};
          output.toPay = item.balance;
          output.type = 'Payment In';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.customerName;

          runInAction(() => {
            this.accountsPayableResult.push(output);
          });
        });
        resolve(`done with payablePaymentInByVendor `);
      });
    });
  };
  payableSalesReturn = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              balance_amount: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance_amount;
          output.type = 'Sales Return';
          output.refNo = item.sales_return_number;
          output.date = item.date;
          output.name = item.customer_name;

          runInAction(() => {
            this.accountsPayableResult.push(output);
          });
        });
        resolve(`Resolved payableSalesReturn`);
      });
    });
  };

  payableSalesReturnByCustomer = async (db, id) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              customer_id: {
                $eq: id
              }
            },
            {
              balance_amount: { $gt: 0 }
            },
            {
              invoice_date: { $exists: true }
            },
            {
              updatedAt: { $exists: true }
            }
          ],
          sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
        }
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance_amount;
          output.type = 'Sales Return';
          output.refNo = item.sales_return_number;
          output.date = item.date;
          output.name = item.customer_name;

          runInAction(() => {
            this.accountsPayableResult.push(output);
          });
        });
        resolve(`Resolved payableSalesReturnByCustomer`);
      });
    });
  };

  payablePurchases = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: fromDate
              }
            },
            {
              bill_date: {
                $lte: toDate
              }
            },
            {
              balance_amount: { $gt: 0 }
            }
          ]
        },
        sort: [{ bill_date: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance_amount;
          output.type = 'Purchases';
          output.refNo = item.bill_number;
          output.date = item.bill_date;
          output.name = item.vendor_name;

          runInAction(() => {
            this.accountsPayableResult.push(output);
          });
        });

        resolve(`Resolved payablePurchases`);
      });
    });
  };

  payablePurchasesByVendor = async (db, id) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              vendor_id: {
                $eq: id
              }
            },
            {
              balance_amount: { $gt: 0 }
            },
            {
              bill_date: { $exists: true }
            }
          ]
        },
        sort: [{ bill_date: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance_amount;
          output.type = 'Purchases';
          output.refNo = item.bill_number;
          output.date = item.bill_date;
          output.name = item.vendor_name;

          runInAction(() => {
            this.accountsPayableResult.push(output);
          });
        });

        resolve(`Resolved payablePurchasesByVendor`);
      });
    });
  };

  openingReceivableBalance = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.alltransactions.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              balance: { $gt: 0 }
            },

            {
              txnType: { $eq: 'Opening Receivable Balance' }
            },

            {
              date: { $gte: fromDate }
            },
            {
              date: { $lte: toDate }
            }
          ]
        }
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance;
          output.type = 'Opening Receivable Balance';
          output.refNo = item.id;
          output.date = item.date;

          if (item.vendorName) {
            output.name = item.vendorName;
          } else {
            output.name = item.customerName;
          }

          runInAction(() => {
            this.accountsReceivableResult.push(output);
          });
        });
        resolve(`Resolved openingReceivableBalance`);
      });
    });
  };

  getAccountsReceivableData = async (fromDate, toDate) => {
    const db = await Db.get();

    let response = {};
    runInAction(() => {
      this.accountsReceivableResult = [];
    });

    await Promise.all([
      this.receivableSales(db, fromDate, toDate),
      this.receivablePurchaseReturn(db, fromDate, toDate),
      this.receivablePaymentOut(db, fromDate, toDate),
      this.openingReceivableBalance(db, fromDate, toDate)
    ]).then(() => {
      let totalToPay = 0;
      for (const data of this.accountsReceivableResult) {
        totalToPay = totalToPay + parseFloat(data.toPay || 0);
      }

      var listOfRecords = this.accountsReceivableResult;

      //aggrigate deplicates
      let map = listOfRecords.reduce((prev, next) => {
        if (next.name in prev) {
          prev[next.name].toPay += next.toPay;
        } else {
          prev[next.name] = next;
        }
        return prev;
      }, {});

      let uniqueListOfRecords = Object.keys(map).map((name) => map[name]);

      //sorting the unique list of records with out case sensitive
      uniqueListOfRecords.sort((a, b) =>
        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
      );

      runInAction(() => {
        this.accountsReceivableResult = uniqueListOfRecords;
      });

      response.accountsReceivableResult = this.accountsReceivableResult;
      response.totalToPay = parseFloat(totalToPay).toFixed(2);
    });
    return response;
  };

  getAccountsReceivableByCustomerData = async (id) => {
    const db = await Db.get();

    let response = {};
    runInAction(() => {
      this.accountsReceivableResult = [];
    });

    await Promise.all([
      this.receivableSalesByCustomer(db, id),
      this.receivablePaymentOutByCustomer(db, id)
    ]).then(() => {
      let totalToPay = 0;
      for (const data of this.accountsReceivableResult) {
        totalToPay = totalToPay + parseFloat(data.toPay || 0);
      }

      var listOfRecords = this.accountsReceivableResult;
      listOfRecords.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);

        let test = d - c;
        return test;
      });

      runInAction(() => {
        this.accountsReceivableResult = listOfRecords;
      });

      response.accountsReceivableResult = this.accountsReceivableResult;
      response.totalToPay = parseFloat(totalToPay).toFixed(2);

      runInAction(() => {
        this.accountsReceivableTotalToPay = response.totalToPay;
      });
    });
    return response;
  };

  getAccountsReceivableByVendorData = async (id) => {
    const db = await Db.get();

    let response = {};
    runInAction(() => {
      this.accountsReceivableResult = [];
    });

    await Promise.all([
      this.receivableSalesByVendor(db, id),
      this.receivablePurchaseReturnByVendor(db, id),
      this.receivablePaymentOutByVendor(db, id)
    ]).then(() => {
      let totalToPay = 0;
      for (const data of this.accountsReceivableResult) {
        totalToPay = totalToPay + parseFloat(data.toPay || 0);
      }

      var listOfRecords = this.accountsReceivableResult;
      listOfRecords.sort(function (a, b) {
        var c = new Date(a.date);
        var d = new Date(b.date);

        let test = d - c;
        return test;
      });

      runInAction(() => {
        this.accountsReceivableResult = listOfRecords;
      });

      response.accountsReceivableResult = this.accountsReceivableResult;
      response.totalToPay = parseFloat(totalToPay).toFixed(2);

      runInAction(() => {
        this.accountsReceivableTotalToPay = response.totalToPay;
      });
    });
    return response;
  };

  receivableSales = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            },
            {
              balance_amount: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance_amount;
          output.type = 'Sales';
          output.refNo = item.invoice_number;
          output.date = item.invoice_date;
          output.name = item.customer_name;

          runInAction(() => {
            this.accountsReceivableResult.push(output);
          });
        });
        resolve(`Resolved receivableSales`);
      });
    });
  };

  receivableSalesByCustomer = async (db, id) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              customer_id: {
                $eq: id
              }
            },
            {
              balance_amount: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              invoice_date: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance_amount;
          output.type = 'Sales';
          output.refNo = item.invoice_number;
          output.date = item.invoice_date;
          output.name = item.customer_name;

          runInAction(() => {
            this.accountsReceivableResult.push(output);
          });
        });
        resolve(`Resolved receivableSalesByCustomer`);
      });
    });
  };

  receivableSalesByVendor = async (db, id) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              customer_id: {
                $eq: id
              }
            },
            {
              balance_amount: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              invoice_date: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance_amount;
          output.type = 'Sales';
          output.refNo = item.invoice_number;
          output.date = item.invoice_date;
          output.name = item.customer_name;

          runInAction(() => {
            this.accountsReceivableResult.push(output);
          });
        });
        resolve(`Resolved receivableSalesByVendor`);
      });
    });
  };

  receivablePurchaseReturn = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchasesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              balance_amount: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available

          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance_amount;
          output.type = 'Purchases Return';
          output.refNo = item.purchaseReturnBillNumber;
          output.date = item.date;
          output.name = item.vendor_name;

          runInAction(() => {
            this.accountsReceivableResult.push(output);
          });
        });
        resolve(`Resolved receivablePurchaseReturn`);
      });
    });
  };

  receivablePurchaseReturnByVendor = async (db, id) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchasesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              vendor_id: {
                $eq: id
              }
            },
            {
              balance_amount: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              date: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available

          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance_amount;
          output.type = 'Purchases Return';
          output.refNo = item.purchaseReturnBillNumber;
          output.date = item.date;
          output.name = item.vendor_name;
          runInAction(() => {
            this.accountsReceivableResult.push(output);
          });
        });
        resolve(`Resolved receivablePurchaseReturnByVendor`);
      });
    });
  };

  receivablePaymentOut = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentout.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance;
          output.type = 'Payment Out';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.vendorName;

          runInAction(() => {
            this.accountsReceivableResult.push(output);
          });
        });
        resolve(`Resolved receivablePaymentOut`);
      });
    });
  };

  receivablePaymentOutByCustomer = async (db, id) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentout.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              vendorId: {
                $eq: id
              }
            },
            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              date: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance;
          output.type = 'Payment Out';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.vendorName;

          runInAction(() => {
            this.accountsReceivableResult.push(output);
          });
        });
        resolve(`Resolved receivablePaymentOutByCustomer`);
      });
    });
  };

  receivablePaymentOutByVendor = async (db, id) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.paymentout.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              vendorId: {
                $eq: id
              }
            },
            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              date: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let output = {};

          output.toPay = item.balance;
          output.type = 'Payment Out';
          output.refNo = item.receiptNumber;
          output.date = item.date;
          output.name = item.vendorName;

          runInAction(() => {
            this.accountsReceivableResult.push(output);
          });
        });
        resolve(`Resolved receivablePaymentOutByVendor`);
      });
    });
  };

  getCashFlowData = async (fromDate, toDate) => {
    //
    const db = await Db.get();

    runInAction(() => {
      this.cashFlowList = [];
    });
    this.cashFlowData(db, fromDate, toDate);
  };

  getProfitAndLossData = async (fromDate, toDate) => {
    runInAction(() => {
      this.totalSaleAmount = 0;
      this.totalSaleReturnAmount = 0;
      this.totalPurchaseAmount = 0;
      this.totalPurchaseReturnAmount = 0;
      this.totalOpeningStockValue = 0;
      this.totalClosingStockValue = 0;
      this.totalGrossAmount = 0;
      this.totalExpensesAmount = 0;
      this.totalIndirectExpensesAmount = 0;
      this.netAmount = 0;
      this.mfgExpenses = [];
      this.totalMfgAmount = 0;
      this.totalMfgExpenses = new Map();
      this.totalMfgExpensesList = [];
    });

    const db = await Db.get();

    runInAction(() => {
      this.cashFlowList = null;
    });

    const previousDay = getYesterdayDate(fromDate);
    const finantialYearStartDate = getFinancialYearStartDate();

    await Promise.all([
      this.plSalesReturnData(db, fromDate, toDate),
      this.plPurchaseData(db, fromDate, toDate),
      this.plSaleData(db, fromDate, toDate),
      this.plPurchaseReturnsData(db, fromDate, toDate),
      this.plExpenseData(db, fromDate, toDate),
      this.plIndirectExpenseData(db, fromDate, toDate),
      this.plMfgExpenseData(db, fromDate, toDate),
      this.plOpeningStockValue(db, fromDate, toDate),

      //to calculate total opening balance for the selected date
      this.plPurchaseDataFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      ),
      this.plPurchaseReturnsDataFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      ),
      this.plSaleFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      ),
      this.plSaleReturnsDataFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      )
    ]).then(() => {
      runInAction(() => {
        this.totalOpeningStockValue =
          parseFloat(this.openingStockValue) +
          parseFloat(this.totalPurchaseAmountFromAprilStart) -
          parseFloat(this.totalPurchaseReturnAmountFromAprilStart) -
          parseFloat(this.totalSalesAmountFromAprilStart) +
          parseFloat(this.totalSalesReturnAmountFromAprilStart);

        this.totalClosingStockValue =
          parseFloat(this.totalOpeningStockValue) -
          parseFloat(this.totalSalePurchasedAmount) +
          parseFloat(this.totalSaleReturnPurchasedAmount) +
          parseFloat(this.totalPurchaseAmount) -
          parseFloat(this.totalPurchaseReturnAmount);

        this.totalClosingStockValue = parseFloat(
          this.totalClosingStockValue
        ).toFixed(2);

        this.totalOpeningStockValue = parseFloat(
          this.totalOpeningStockValue
        ).toFixed(2);
      });
    });
  };

  getBalanceSheetData = async (fromDate, toDate) => {
    this.balanceSheetPayableAmount = 0;
    this.balanceSheetReceivableAmount = 0;

    this.balanceSheetTaxGstPayableAmount = 0;
    this.balanceSheetTaxGstReceivableAmount = 0;

    this.balanceSheetTaxTcsPayableAmount = 0;
    this.balanceSheetTaxTcsReceivableAmount = 0;

    this.balanceSheetOpeningCashInHand = 0;
    this.balanceSheetOpeningBankBalance = 0;
    this.balanceSheetOpeningPartyBalance = 0;

    this.balanceSheetOpeningStockValue = 0;
    this.balanceSheetClosingStockValue = 0;

    this.balanceSheetBankAccountsData = [];
    this.balanceSheetAdvancesAmount = 0;

    const db = await Db.get();

    const previousDay = getYesterdayDate(fromDate);
    const finantialYearStartDate = getFinancialYearStartDate();

    await Promise.all([
      this.bsSalesReturnData(db, fromDate, toDate),
      this.bsPurchaseData(db, fromDate, toDate),
      this.bsSaleData(db, fromDate, toDate),
      this.bsPurchaseReturnsData(db, fromDate, toDate),

      this.bsPaymentInUnusedAmount(db, fromDate, toDate),

      this.bsOpeningStockValue(db, fromDate, toDate),

      this.bsCashInHandInSelctedDate(db, fromDate, toDate),

      this.bsOpeningCashInHandByDate(db, fromDate),

      this.bsOpeningBankAndPartyBalanceData(db, fromDate),

      //to calculate total opening balance for the selected date
      this.bsPurchaseDataFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      ),
      this.bsPurchaseReturnsDataFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      ),
      this.bsSaleFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      ),
      this.bsSaleReturnsDataFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      )
    ]).then((results) => {
      // print all responses of the methods one by one
      results.forEach((result, i) => {
        console.log(`Result of method ${i + 1}:`, result);
      });

      const salesReturnData = results[0];
      const purchasesData = results[1];
      const saleData = results[2];
      const purchaseReturnsData = results[3];
      const paymentInUnusedAmount = results[4];
      const openingStockValue = results[5];
      const cashInHandInSelectedData = results[6];
      const openingCashInHandByData = results[7];
      const openingBankAndPartyBalanceData = results[8];
      const purchaseDataFromAprilToOneDayBefore = results[9];
      const purchaseReturnsDataFromAprilToOneDayBefore = results[10];
      const saleFromAprilToOneDayBefore = results[11];
      const saleReturnsDataFromAprilToOneDayBefore = results[12];

      runInAction(() => {
        this.balanceSheetPayableAmount =
          parseFloat(purchasesData.totalBalanceAmount) +
          parseFloat(salesReturnData.totalBalanceAmount);
        this.balanceSheetReceivableAmount =
          parseFloat(saleData.totalBalanceAmount) +
          parseFloat(purchaseReturnsData.totalBalanceAmount);

        //currently not sure about the logic keeping it to 0
        this.balanceSheetTaxGstPayableAmount = 0;
        this.balanceSheetTaxGstReceivableAmount = 0;

        this.balanceSheetTaxTcsPayableAmount =
          parseFloat(saleData.totalTcsAmount) +
          parseFloat(purchaseReturnsData.totalTcsAmount);
        this.balanceSheetTaxTcsReceivableAmount =
          parseFloat(purchasesData.totalTcsAmount) +
          parseFloat(salesReturnData.totalTcsAmount);

        this.balanceSheetOpeningCashInHand = (
          parseFloat(openingCashInHandByData) +
          parseFloat(cashInHandInSelectedData)
        ).toFixed(2);

        this.balanceSheetOpeningBankBalance =
          openingBankAndPartyBalanceData.totalBankBalance;
        this.balanceSheetOpeningPartyBalance =
          openingBankAndPartyBalanceData.totalPartyBalance;

        this.balanceSheetOpeningStockValue =
          parseFloat(openingStockValue) +
          parseFloat(purchaseDataFromAprilToOneDayBefore.totalPurchaseAmount) -
          parseFloat(purchaseReturnsDataFromAprilToOneDayBefore) -
          parseFloat(saleFromAprilToOneDayBefore) +
          parseFloat(saleReturnsDataFromAprilToOneDayBefore);

        this.balanceSheetClosingStockValue =
          parseFloat(this.balanceSheetOpeningStockValue) -
          parseFloat(saleData.totalPurchasedAmount) +
          parseFloat(salesReturnData.totalSaleReturnPurchasedAmount) +
          parseFloat(purchasesData.totalPurchaseAmount) -
          parseFloat(purchaseReturnsData.totalPurchaseReturnAmount);

        this.balanceSheetBankAccountsData =
          openingBankAndPartyBalanceData.bankTransactionList;
        this.balanceSheetAdvancesAmount = parseFloat(paymentInUnusedAmount);
      });
    });
  };

  getMfgProfitAndLossData = async (fromDate, toDate) => {
    runInAction(() => {
      this.totalMfgOpeningStockRawMaterial = 0;
      this.totalMfgPurchaseRawMaterialAmount = 0;
      this.totalMfgCarriageInwardsAmount = 0;
      this.totalMfgPurchaseReturnRawMaterialAmount = 0;
      this.totalMfgClosingStockRawMaterial = 0;
      this.totalCostOfRawMaterialsConsumed = 0;
      this.totalProductionCostOfGoodsProduced = 0;
      this.totalMfgPurchaseRawMaterialAmountFromAprilStart = 0;
      this.totalMfgPurchaseReturnRawMaterialAmountFromAprilStart = 0;
      this.totalMfgExpenses = new Map();
      this.totalMfgExpensesList = [];
      this.mfgExpenses = [];
      this.totalMfgAmount = 0;
      this.totalMfgRawMaterialConsumptionAmount = 0;
    });

    const db = await Db.get();

    runInAction(() => {
      this.cashFlowList = null;
    });

    const previousDay = getYesterdayDate(fromDate);
    const finantialYearStartDate = getFinancialYearStartDate();

    await Promise.all([
      this.plMfgRawMaterialPurchaseData(db, fromDate, toDate),
      this.plMfgRawMaterialConsumptionData(db, fromDate, toDate),
      this.plMfgPurchaseReturnsData(db, fromDate, toDate),
      this.plMfgExpenseData(db, fromDate, toDate),
      this.plOpeningStockRawMaterialValue(db, fromDate, toDate),

      //to calculate total opening balance for the selected date
      this.plMfgPurchaseDataFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      ),
      this.plMfgPurchaseReturnsDataFromAprilToOneDayBefore(
        db,
        finantialYearStartDate,
        previousDay
      )
    ]).then(() => {
      runInAction(() => {
        this.totalMfgOpeningStockRawMaterial =
          parseFloat(this.openingStockRawMaterialValue) +
          parseFloat(this.totalMfgPurchaseRawMaterialAmountFromAprilStart) -
          parseFloat(
            this.totalMfgPurchaseReturnRawMaterialAmountFromAprilStart
          );

        this.totalMfgClosingStockRawMaterial =
          parseFloat(this.totalMfgOpeningStockRawMaterial) +
          parseFloat(this.totalMfgPurchaseRawMaterialAmount) -
          parseFloat(this.totalMfgPurchaseReturnRawMaterialAmount) -
          parseFloat(this.totalMfgRawMaterialConsumptionAmount);

        this.totalMfgClosingStockRawMaterial = parseFloat(
          this.totalMfgClosingStockRawMaterial
        ).toFixed(2);

        this.totalMfgOpeningStockRawMaterial = parseFloat(
          this.totalMfgOpeningStockRawMaterial
        ).toFixed(2);
      });
    });
  };

  cashFlowCashInHandData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (!fromDate || !toDate) {
        query = db.cashadjustments.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: { $exists: true }
              },
              {
                updatedAt: { $exists: true }
              }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        });
      } else {
        query = db.cashadjustments.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                updatedAt: { $exists: true }
              }
            ]
          }
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        runInAction(() => {
          this.cashFlowList = this.cashFlowList ? this.cashFlowList : [];

          for (var i = this.cashFlowList.length; i--; ) {
            if (this.cashFlowList[i].transactionType === 'Cash Adjustment') {
              this.cashFlowList.splice(i, 1);
            }
          }
        });

        data.map((item) => {
          let finalData = {};

          if (data['cashType'] === 'addCash') {
            finalData.transactionType = 'Add Cash';
          } else {
            finalData.transactionType = 'Remove Cash';
          }
          finalData.amount = item.amount;
          finalData.date = item.date;
          runInAction(() => {
            this.cashFlowList.push(finalData);
          });
        });

        resolve(`done with cashFlowCashInHandData `);
      });
    });
  };

  cashFlowData = async (db, fromDate, toDate) => {
    var query;
    const businessData = await Bd.getBusinessData();

    query = db.alltransactions.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                paymentType: {
                  $regex: this.cashRegExp
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                splitPaymentList: {
                  $elemMatch: {
                    paymentType: { $eq: 'Cash' },
                    amount: { $gt: 0 }
                  }
                }
              }
            ]
          }
        ]
      },
      sort: [{ date: 'desc' }, { updatedAt: 'desc' }],
      limit: 100
    });

    await query.$.subscribe((data) => {
      if (!data) {
        // No customer is available
        return;
      }
      let results = data.map((item) => {
        let finalData = {};
        finalData.transactionType = item.txnType;
        finalData.name = item.customerName
          ? item.customerName
          : item.vendorName;
        finalData.paidOrReceivedAmount = item.paidOrReceivedAmount;
        finalData.isCredit = item.isCredit;
        finalData.date = item.date;
        finalData.id = item.id;

        let amount = 0;
        let paymentType = item.paymentType;
        if (item.splitPaymentList && item.splitPaymentList.length > 0) {
          let splitAmount = 0;
          for (let payment of item.splitPaymentList) {
            if (payment.paymentType === 'Cash') {
              splitAmount += parseFloat(payment.amount);
              paymentType = 'Cash';
            }
          }
          amount = parseFloat(splitAmount);
        } else {
          amount = parseFloat(item.amount);
        }

        finalData.amount = amount;
        finalData.paymentType = paymentType;

        return finalData;
      });

      runInAction(() => {
        this.cashFlowList = results;
      });
    });
  };

  cashFlowPaymentInData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (!fromDate || !toDate) {
        query = db.paymentin.find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: { $exists: true }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    paymentType: { $regex: this.cashRegExp }
                  }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: { $exists: true }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    splitPaymentList: {
                      $elemMatch: {
                        paymentType: { $eq: 'Cash' },
                        amount: { $gt: 0 }
                      }
                    }
                  }
                ]
              }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        });
      } else {
        query = db.paymentin.find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: {
                      $gte: fromDate
                    }
                  },
                  {
                    date: {
                      $lte: toDate
                    }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    paymentType: { $regex: this.cashRegExp }
                  }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: {
                      $gte: fromDate
                    }
                  },
                  {
                    date: {
                      $lte: toDate
                    }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    splitPaymentList: {
                      $elemMatch: {
                        paymentType: { $eq: 'Cash' },
                        amount: { $gt: 0 }
                      }
                    }
                  }
                ]
              }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = {};
          finalData.transactionType = 'Payment In';
          finalData.name = item.customerName;
          finalData.amount = item.received;
          finalData.date = item.date;
          runInAction(() => {
            this.cashFlowList.push(finalData);
          });
        });
        resolve(`done with cashFlowPaymentInData `);
      });
    });
  };

  cashFlowSalesReturnData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (!fromDate || !toDate) {
        query = db.salesreturn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: { $exists: true }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                payment_type: { $regex: this.cashRegExp }
              },
              {
                $or: [
                  {
                    balance_amount: { $eq: 0 }
                  },
                  {
                    paid_amount: { $gt: 0 }
                  }
                ]
              }
            ]
          },
          sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
        });
      } else {
        query = db.salesreturn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                payment_type: { $regex: this.cashRegExp }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                $or: [
                  {
                    balance_amount: { $eq: 0 }
                  },
                  {
                    paid_amount: { $gt: 0 }
                  }
                ]
              }
            ]
          },
          sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = {};

          let amount = 0;
          if (item['paid_amount'] >= 0) {
            amount = item['paid_amount'];
          } else {
            amount = item['total_amount'];
          }

          finalData.transactionType = 'Sales Return';
          finalData.name = item.customer_name;
          finalData.amount = amount;
          finalData.date = item.date;
          runInAction(() => {
            this.cashFlowList.push(finalData);
          });
        });
        resolve(`Resolved cashFlowSalesReturnData`);
      });
    });
  };

  cashFlowCreditPurchaseData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (!fromDate || !toDate) {
        query = db.purchases.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                bill_date: { $exists: true }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                payment_type: { $regex: this.cashRegExp }
              },
              {
                $or: [
                  {
                    balance_amount: { $eq: 0 }
                  },
                  {
                    paid_amount: { $gt: 0 }
                  }
                ]
              }
            ]
          },
          sort: [{ bill_date: 'desc' }, { updatedAt: 'desc' }]
        });
      } else {
        query = db.purchases.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              },
              {
                payment_type: { $regex: this.cashRegExp }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                $or: [
                  {
                    balance_amount: { $eq: 0 }
                  },
                  {
                    paid_amount: { $gt: 0 }
                  }
                ]
              }
            ]
          },
          sort: [{ bill_date: 'desc' }, { updatedAt: 'desc' }]
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = {};

          let amount = 0;
          if (item['paid_amount'] >= 0) {
            amount = item['paid_amount'];
          } else {
            amount = item['total_amount'];
          }

          finalData.transactionType = 'Purchases';
          finalData.name = item.vendor_name;
          finalData.amount = amount;
          finalData.date = item.bill_date;
          runInAction(() => {
            this.cashFlowList.push(finalData);
          });
        });
        resolve(`Resolved cashFlowCreditPurchaseData`);
      });
    });
  };

  cashFlowExpensesData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (!fromDate || !toDate) {
        query = db.expenses.find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: { $exists: true }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    paymentType: { $regex: this.cashRegExp }
                  }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: { $exists: true }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    splitPaymentList: {
                      $elemMatch: {
                        paymentType: { $eq: 'Cash' },
                        amount: { $gt: 0 }
                      }
                    }
                  }
                ]
              }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        });
      } else {
        query = db.expenses.find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: {
                      $gte: fromDate
                    }
                  },
                  {
                    date: {
                      $lte: toDate
                    }
                  },
                  {
                    paymentType: { $regex: this.cashRegExp }
                  },
                  {
                    updatedAt: { $exists: true }
                  }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: {
                      $gte: fromDate
                    }
                  },
                  {
                    date: {
                      $lte: toDate
                    }
                  },
                  {
                    splitPaymentList: {
                      $elemMatch: {
                        paymentType: { $eq: 'Cash' },
                        amount: { $gt: 0 }
                      }
                    }
                  },
                  {
                    updatedAt: { $exists: true }
                  }
                ]
              }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = {};
          finalData.transactionType = 'Expenses';
          finalData.date = item.date;

          let amount = 0;
          if (item.splitPaymentList && item.splitPaymentList.length > 0) {
            let splitAmount = 0;
            for (let payment of item.splitPaymentList) {
              if (payment.paymentType === 'Cash') {
                splitAmount += parseFloat(payment.amount);
              }
            }
            amount = parseFloat(splitAmount);
          } else {
            amount = parseFloat(item.total);
          }

          finalData.amount = amount;

          runInAction(() => {
            this.cashFlowList.push(finalData);
          });
        });
        resolve(`Resolved cashFlowExpensesData`);
      });
    });
  };

  cashFlowSaledata = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (!fromDate || !toDate) {
        query = db.sales.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: { $exists: true }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                payment_type: { $regex: this.cashRegExp }
              },
              {
                $or: [
                  {
                    balance_amount: { $eq: 0 }
                  },
                  {
                    received_amount: { $gt: 0 }
                  }
                ]
              }
            ]
          },
          sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
        });
      } else {
        query = db.sales.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              },
              {
                payment_type: { $regex: this.cashRegExp }
              },
              {
                $or: [
                  {
                    balance_amount: { $eq: 0 }
                  },
                  {
                    received_amount: { $gt: 0 }
                  }
                ]
              },
              {
                updatedAt: { $exists: true }
              }
            ]
          },
          sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }]
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = {};

          let amount = 0;
          if (item['received_amount'] >= 0) {
            amount = item['received_amount'];
          } else {
            amount = item['total_amount'];
          }

          finalData.transactionType = 'Sales';
          finalData.name = item.customer_name;
          finalData.amount = amount;
          finalData.date = item.invoice_date;
          runInAction(() => {
            this.cashFlowList.push(finalData);
          });
        });
        resolve(`Resolved cashFlowSalesdata`);
      });
    });
  };

  cashFlowPaymentOutData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (!fromDate || !toDate) {
        query = db.paymentout.find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: { $exists: true }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    paymentType: { $regex: this.cashRegExp }
                  }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: { $exists: true }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    splitPaymentList: {
                      $elemMatch: {
                        paymentType: { $eq: 'Cash' },
                        amount: { $gt: 0 }
                      }
                    }
                  }
                ]
              }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        });
      } else {
        query = db.paymentout.find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: {
                      $gte: fromDate
                    }
                  },
                  {
                    date: {
                      $lte: toDate
                    }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    paymentType: { $regex: this.cashRegExp }
                  }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },

                  {
                    date: {
                      $gte: fromDate
                    }
                  },
                  {
                    date: {
                      $lte: toDate
                    }
                  },
                  {
                    updatedAt: { $exists: true }
                  },
                  {
                    splitPaymentList: {
                      $elemMatch: {
                        paymentType: { $eq: 'Cash' },
                        amount: { $gt: 0 }
                      }
                    }
                  }
                ]
              }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = {};
          finalData.transactionType = 'Payment Out';
          finalData.name = item.vendorName;
          finalData.amount = item.paid;
          finalData.date = item.date;
          runInAction(() => {
            this.cashFlowList.push(finalData);
          });
        });
        resolve(`Resolved cashFlowPaymentOutData`);
      });
    });
  };

  cashFlowPurchaseReturnsData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (!fromDate || !toDate) {
        query = db.purchasesreturn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: { $exists: true }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                payment_type: { $regex: this.cashRegExp }
              },
              {
                $or: [
                  {
                    balance_amount: { $eq: 0 }
                  },
                  {
                    received_amount: { $gt: 0 }
                  }
                ]
              }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        });
      } else {
        query = db.purchasesreturn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              },
              {
                payment_type: { $regex: this.cashRegExp }
              },
              {
                updatedAt: { $exists: true }
              },
              {
                $or: [
                  {
                    balance_amount: { $eq: 0 }
                  },
                  {
                    received_amount: { $gt: 0 }
                  }
                ]
              }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available

          return;
        }
        data.map((item) => {
          let finalData = {};

          let amount = 0;
          if (item['received_amount'] >= 0) {
            amount = item['received_amount'];
          } else {
            amount = item['total_amount'];
          }

          finalData.transactionType = 'Purchases Return';
          finalData.name = item.vendor_name;
          finalData.amount = amount;
          finalData.date = item.date;
          runInAction(() => {
            this.cashFlowList.push(finalData);
          });
        });
        resolve(`Resolved cashFlowPurchaseReturnsData`);
      });
    });
  };

  salesreturnQueryByDateRange = async (db, fromDate, toDate, properties) => {
    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      { invoice_date: { $gte: fromDate } },
      { invoice_date: { $lte: toDate } },
      { updatedAt: { $exists: true } }
    ];

    if (properties.includes('balance_amount')) {
      filterArray.push({ balance_amount: { $gt: 0 } });
    }

    const query = db.salesreturn.find({
      selector: {
        $and: filterArray
      }
    });

    return await query.exec();
  };

  calculateTax = (product) => {
    return (
      (parseFloat(product.sgst_amount) || 0) +
      (parseFloat(product.cgst_amount) || 0) +
      (parseFloat(product.igst_amount) || 0)
    );
  };

  salesReturnData = async (db, fromDate, toDate, properties) => {
    const data = await this.salesreturnQueryByDateRange(
      db,
      fromDate,
      toDate,
      properties
    );

    if (!data) {
      // No customer is available
      return;
    }

    let response = data
      .map((item) => {
        let total_tax = this.calculateTax(item);
        let total_amount = parseFloat(item.total_amount);

        let total_purchased_amount = item.item_list.reduce((acc, product) => {
          total_tax += this.calculateTax(product);
          let purchased_price = parseFloat(product.purchased_price);

          if (product.taxIncluded) {
            const cgst = product.cgst || 0;
            const sgst = product.sgst || 0;
            const igst = product.igst || 0;

            purchased_price = purchased_price / (1 + (cgst + sgst) / 100);
            purchased_price = purchased_price / (1 + igst / 100);
          }
          return acc + parseFloat(purchased_price) * parseFloat(product.qty);
        }, 0);

        let output = {
          total_amount: total_amount - total_tax,
          total_purchased_amount,
          tcsAmount: properties.includes('tcsAmount')
            ? parseFloat(item.tcsAmount)
            : undefined,
          balanceAmount: properties.includes('balance_amount')
            ? parseFloat(item.balance_amount)
            : undefined
        };

        return output;
      })
      .reduce(
        (a, b) => {
          a.totalSaleReturnAmount = (
            parseFloat(a.totalSaleReturnAmount) + parseFloat(b.total_amount)
          ).toFixed(2);
          a.totalSaleReturnPurchasedAmount += parseFloat(
            b.total_purchased_amount
          );

          if (properties.includes('tcsAmount')) {
            a.totalTcsAmount = (
              parseFloat(a.totalTcsAmount) + parseFloat(b.tcsAmount)
            ).toFixed(2);
          }

          if (properties.includes('balance_amount')) {
            a.totalBalanceAmount = (
              parseFloat(a.totalBalanceAmount) + parseFloat(b.balanceAmount)
            ).toFixed(2);
          }

          return a;
        },
        {
          totalSaleReturnAmount: 0,
          totalSaleReturnPurchasedAmount: 0,
          totalTcsAmount: properties.includes('tcsAmount') ? 0 : undefined,
          totalBalanceAmount: properties.includes('balance_amount')
            ? 0
            : undefined
        }
      );

    return response;
  };

  plSalesReturnData = async (db, fromDate, toDate) => {
    const result = await this.salesReturnData(
      db,
      fromDate,
      toDate,
      'plSalesReturnData',
      ['total_amount']
    );

    runInAction(() => {
      this.totalSaleReturnAmount = result.data.totalSaleReturnAmount;
      this.totalSaleReturnPurchasedAmount =
        result.data.totalSaleReturnPurchasedAmount;
    });

    return result;
  };

  bsSalesReturnData = async (db, fromDate, toDate) => {
    const result = await this.salesReturnData(db, fromDate, toDate, [
      'total_amount',
      'tcsAmount',
      'balance_amount'
    ]);

    return result;
  };

  purchaseReturnsData = async (db, fromDate, toDate, properties) => {
    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      { date: { $gte: fromDate, $lte: toDate } },
      { updatedAt: { $exists: true } }
    ];

    if (properties.includes('balance_amount')) {
      filterArray.push({ balance_amount: { $gt: 0 } });
    }

    let query = db.purchasesreturn.find({
      selector: {
        $and: filterArray
      }
    });

    const data = await query.exec();

    if (!data) {
      // No purchases return is available
      return;
    }

    let response = data
      .map((item) => {
        let total_tax = item.item_list.reduce(
          (acc, product) =>
            acc +
            (parseFloat(product.sgst_amount) || 0) +
            (parseFloat(product.cgst_amount) || 0) +
            (parseFloat(product.igst_amount) || 0),
          0
        );
        let total_amount = parseFloat(item.total_amount) - total_tax;

        let output = {
          total_amount,
          tcsAmount: properties.includes('tcsAmount')
            ? parseFloat(item.tcsAmount)
            : undefined,
          totalTax: properties.includes('totalTax') ? total_tax : undefined,
          balanceAmount: properties.includes('balance_amount')
            ? item.balance_amount
            : undefined
        };

        return output;
      })
      .reduce(
        (a, b) => {
          a.totalPurchaseReturnAmount = (
            parseFloat(a.totalPurchaseReturnAmount) + parseFloat(b.total_amount)
          ).toFixed(2);

          if (properties.includes('tcsAmount')) {
            a.totalTcsAmount = (
              parseFloat(a.totalTcsAmount) + parseFloat(b.tcsAmount)
            ).toFixed(2);
          }

          if (properties.includes('totalTax')) {
            a.totalGstAmount = (
              parseFloat(a.totalGstAmount) + parseFloat(b.totalTax)
            ).toFixed(2);
          }

          if (properties.includes('balance_amount')) {
            a.totalBalanceAmount = (
              parseFloat(a.totalBalanceAmount) + parseFloat(b.balanceAmount)
            ).toFixed(2);
          }

          return a;
        },
        {
          totalPurchaseReturnAmount: 0,
          totalTcsAmount: properties.includes('tcsAmount') ? 0 : undefined,
          totalGstAmount: properties.includes('totalTax') ? 0 : undefined,
          totalBalanceAmount: properties.includes('balance_amount')
            ? 0
            : undefined
        }
      );

    return response;
  };

  plPurchaseReturnsData = async (db, fromDate, toDate) => {
    const result = await this.purchaseReturnsData(db, fromDate, toDate, [
      'total_amount'
    ]);

    runInAction(() => {
      this.totalPurchaseReturnAmount = result.data.totalPurchaseReturnAmount;
    });

    return result;
  };

  bsPurchaseReturnsData = async (db, fromDate, toDate) => {
    const result = await this.purchaseReturnsData(db, fromDate, toDate, [
      'total_amount',
      'tcsAmount',
      'totalTax',
      'balance_amount'
    ]);

    return result;
  };

  bsOpeningBankAndPartyBalanceData = async (db, date) => {
    const toDate = moment(date).subtract(1, 'day').format('YYYY-MM-DD');
    const fromDate = getFinancialYearStartDateByGivenDate(toDate);

    const businessData = await Bd.getBusinessData();

    try {
      const data = await db.alltransactions
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { date: { $gte: fromDate } },
              { date: { $lte: toDate } },
              { updatedAt: { $exists: true } },
              { isCredit: { $eq: false } }
            ]
          },
          sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
        })
        .exec();

      if (!data) {
        // No bank txn data is available
        return;
      }

      const inTransactionTypes = new Set([
        'Payment In',
        'Sales',
        'Purchases Return',
        'KOT',
        'Opening Balance'
      ]);

      let bankInTotal = 0;
      let bankOutTotal = 0;
      let vendorInTotal = 0;
      let vendorOutTotal = 0;
      let amountsByAccount = new Map();

      await data.reduce((acc, item) => {
        let result = item.toJSON();

        if (result.splitPaymentList && result.splitPaymentList.length > 0) {
          for (let payment of result.splitPaymentList) {
            let splitAmount = parseFloat(payment.amount);

            if (payment.accountDisplayName) {
              let currentAmount =
                amountsByAccount.get(payment.accountDisplayName) || 0;
              amountsByAccount.set(
                payment.accountDisplayName,
                currentAmount + splitAmount
              );

              if (inTransactionTypes.has(result['txnType'])) {
                bankInTotal += splitAmount;
                if (result['txnType'] === 'Payment In') {
                  vendorInTotal += splitAmount;
                }
              } else {
                bankOutTotal += splitAmount;
                if (result['txnType'] === 'Payment Out') {
                  vendorOutTotal += splitAmount;
                }
              }
            }
          }
        }
      }, {});

      let finalResponse = {
        bankTransactionList: Array.from(
          amountsByAccount,
          ([bankName, Amount]) => ({ bankName, Amount })
        ),
        totalBankBalance: bankInTotal - bankOutTotal,
        totalPartyBalance: vendorInTotal - vendorOutTotal
      };

      return finalResponse;
    } catch (err) {
      console.log('Internal Server Error', err);
    }
  };

  plMfgPurchaseReturnsData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchasesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No purchases return is available
          return;
        }

        let response = data
          .map((item) => {
            let output = {};

            //get total tax
            let total_tax = 0;
            let total_amount = 0;
            for (let product of item.item_list) {
              if (
                (product.categoryLevel2 === 'raw_materials_level2' &&
                  product.categoryLevel3 === 'raw_materials_level3') ||
                (product.categoryLevel2 === 'food_raw_materials_level2' &&
                  product.categoryLevel3 === 'food_raw_materials_level3')
              ) {
                total_tax =
                  total_tax +
                  (parseFloat(product.sgst_amount) || 0) +
                  (parseFloat(product.cgst_amount) || 0) +
                  (parseFloat(product.igst_amount) || 0);
                total_amount = total_amount + (parseFloat(product.amount) || 0);
              }
            }

            output.total_amount =
              parseFloat(total_amount) - parseFloat(total_tax);

            return output;
          })
          .reduce(
            (a, b) => {
              let data = toJS(b);

              a.totalPurchaseReturnAmount = parseFloat(
                parseFloat(a.totalPurchaseReturnAmount || 0) +
                  parseFloat(data.total_amount)
              ).toFixed(2);

              return a;
            },
            {
              totalPurchaseReturnAmount: 0
            }
          );

        runInAction(() => {
          this.totalMfgPurchaseReturnRawMaterialAmount = parseFloat(
            response.totalPurchaseReturnAmount || 0
          );
        });

        resolve(`Resolved plMfgPurchaseReturnsData`);
      });
    });
  };

  purchaseReturnsDataFromAprilToOneDayBefore = async (
    db,
    fromDate,
    toDate,
    balanceCheck = false
  ) => {
    const businessData = await Bd.getBusinessData();

    let selector = {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { date: { $gte: fromDate } },
        { date: { $lte: toDate } },
        { updatedAt: { $exists: true } }
      ]
    };

    if (balanceCheck) {
      selector.$and.push({ balance_amount: { $gt: 0 } });
    }

    try {
      const data = await db.purchasesreturn.find({ selector }).exec();

      if (!data) {
        // No purchases return is available
        return;
      }

      let totalPurchaseReturnAmount = data.reduce((acc, item) => {
        //get total tax
        let total_tax = 0;
        let total_amount = parseFloat(item.total_amount);
        for (let product of item.item_list) {
          total_tax +=
            (parseFloat(product.sgst_amount) || 0) +
            (parseFloat(product.cgst_amount) || 0) +
            (parseFloat(product.igst_amount) || 0);
        }

        let output_total_amount =
          parseFloat(total_amount) - parseFloat(total_tax);

        return acc + output_total_amount;
      }, 0);

      return totalPurchaseReturnAmount.toFixed(2);
    } catch (err) {
      console.log('Internal Server Error', err);
    }
  };

  plPurchaseReturnsDataFromAprilToOneDayBefore = async (
    db,
    fromDate,
    toDate
  ) => {
    runInAction(async () => {
      this.totalPurchaseReturnAmountFromAprilStart =
        await this.purchaseReturnsDataFromAprilToOneDayBefore(
          db,
          fromDate,
          toDate,
          false
        );
    });
  };

  bsPurchaseReturnsDataFromAprilToOneDayBefore = async (
    db,
    fromDate,
    toDate
  ) => {
    return await this.purchaseReturnsDataFromAprilToOneDayBefore(
      db,
      fromDate,
      toDate,
      true
    );
  };

  plMfgPurchaseReturnsDataFromAprilToOneDayBefore = async (
    db,
    fromDate,
    toDate
  ) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchasesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No purchases return is available
          return;
        }

        let response = data
          .map((item) => {
            let output = {};

            //get total tax
            let total_tax = 0;
            let total_amount = 0;
            for (let product of item.item_list) {
              if (
                (product.categoryLevel2 === 'raw_materials_level2' &&
                  product.categoryLevel3 === 'raw_materials_level3') ||
                (product.categoryLevel2 === 'food_raw_materials_level2' &&
                  product.categoryLevel3 === 'food_raw_materials_level3')
              ) {
                total_tax =
                  total_tax +
                  (parseFloat(product.sgst_amount) || 0) +
                  (parseFloat(product.cgst_amount) || 0) +
                  (parseFloat(product.igst_amount) || 0);
                total_amount = total_amount + (parseFloat(product.amount) || 0);
              }
            }

            output.total_amount =
              parseFloat(total_amount) - parseFloat(total_tax);

            return output;
          })
          .reduce(
            (a, b) => {
              let data = toJS(b);

              a.totalPurchaseReturnAmount = parseFloat(
                parseFloat(a.totalPurchaseReturnAmount) +
                  parseFloat(data.total_amount)
              ).toFixed(2);

              return a;
            },
            {
              totalPurchaseReturnAmount: 0
            }
          );

        runInAction(() => {
          this.totalMfgPurchaseReturnRawMaterialAmountFromAprilStart =
            response.totalPurchaseReturnAmount;
        });

        resolve(`Resolved plMfgPurchaseReturnsDataFromAprilToOneDayBefore`);
      });
    });
  };

  calculatePurchasedPrice = async (product) => {
    let purchased_price = parseFloat(product.purchased_price);
    if (product.taxIncluded) {
      const cgst = product.cgst || 0;
      const sgst = product.sgst || 0;
      const igst = product.igst || 0;

      purchased_price = purchased_price / (1 + (cgst + sgst) / 100);
      purchased_price = purchased_price / (1 + igst / 100);
    }
    return purchased_price;
  };

  saleReturnsDataFromAprilToOneDayBefore = async (
    db,
    fromDate,
    toDate,
    balanceCondition = null
  ) => {
    const businessData = await Bd.getBusinessData();

    let selector = {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { date: { $gte: fromDate } },
        { date: { $lte: toDate } }
      ]
    };

    if (balanceCondition !== null) {
      selector.$and.push(balanceCondition);
    }

    try {
      const data = await db.salesreturn.find({ selector }).exec();

      if (!data) {
        // No sales return is available
        return 0;
      }

      let total_purchased_amount = 0;

      for (let item of data) {
        //
        for (let product of item.item_list) {
          //
          let purchased_price = parseFloat(product.purchased_price);
          //
          if (product.taxIncluded) {
            const cgst = product.cgst || 0;
            const sgst = product.sgst || 0;
            const igst = product.igst || 0;

            purchased_price = purchased_price / (1 + (cgst + sgst) / 100);

            purchased_price = purchased_price / (1 + igst / 100);
          }
          total_purchased_amount =
            parseFloat(purchased_price) * parseFloat(product.qty) +
            parseFloat(total_purchased_amount);
        }
      }

      return total_purchased_amount;
    } catch (err) {
      console.log('Internal Server Error', err);
    }
  };

  plSaleReturnsDataFromAprilToOneDayBefore = async (db, fromDate, toDate) => {
    const total_purchased_amount =
      await this.saleReturnsDataFromAprilToOneDayBefore(db, fromDate, toDate);
    runInAction(() => {
      this.totalSalesReturnAmountFromAprilStart = total_purchased_amount;
    });
  };

  bsSaleReturnsDataFromAprilToOneDayBefore = async (db, fromDate, toDate) => {
    return await this.saleReturnsDataFromAprilToOneDayBefore(
      db,
      fromDate,
      toDate,
      {
        balance_amount: { $gt: 0 }
      }
    );
  };

  saleData = async (db, fromDate, toDate, properties) => {
    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      { invoice_date: { $gte: fromDate } },
      { invoice_date: { $lte: toDate } },
      { updatedAt: { $exists: true } }
    ];

    if (properties.includes('balance_amount')) {
      filterArray.push({ balance_amount: { $gt: 0 } });
    }

    let query = db.sales.find({
      selector: {
        $and: filterArray
      }
    });

    const data = await query.exec();

    if (!data) {
      // No customer is available
      return;
    }

    let total_purchased_amount = 0;

    let response = data
      .map((item) => {
        let output = {};

        let total_tax = item.item_list.reduce(
          (acc, product) =>
            acc +
            (parseFloat(product.sgst_amount) || 0) +
            (parseFloat(product.cgst_amount) || 0) +
            (parseFloat(product.igst_amount) || 0),
          0
        );
        let total_amount = parseFloat(item.total_amount);

        for (let product of item.item_list) {
          let purchased_price = parseFloat(product.purchased_price);

          if (product.taxIncluded) {
            const cgst = product.cgst || 0;
            const sgst = product.sgst || 0;
            const igst = product.igst || 0;

            purchased_price = purchased_price / (1 + (cgst + sgst) / 100);
            purchased_price = purchased_price / (1 + igst / 100);
          }

          total_purchased_amount =
            parseFloat(purchased_price) * parseFloat(product.qty) +
            parseFloat(total_purchased_amount);
        }

        output.total_amount = parseFloat(total_amount) - parseFloat(total_tax);

        output.balanceAmount = properties.includes('balance_amount')
          ? parseFloat(item.balance_amount)
          : undefined;

        output.purchasedAmount = total_purchased_amount;

        return output;
      })
      .reduce(
        (a, b) => {
          let data = toJS(b);

          a.totalSaleAmount = parseFloat(
            parseFloat(a.totalSaleAmount) + parseFloat(data.total_amount)
          ).toFixed(2);

          if (properties.includes('balance_amount')) {
            a.totalBalanceAmount = (
              parseFloat(a.totalBalanceAmount) + parseFloat(data.balanceAmount)
            ).toFixed(2);
          }

          a.totalPurchasedAmount =
            parseFloat(a.totalPurchasedAmount) +
            parseFloat(data.purchasedAmount);

          return a;
        },
        {
          totalSaleAmount: 0,
          totalBalanceAmount: 0,
          totalPurchasedAmount: 0
        }
      );

    return response;
  };

  plSaleData = async (db, fromDate, toDate) => {
    const result = await this.saleData(db, fromDate, toDate, []);

    runInAction(() => {
      this.totalSalePurchasedAmount = result.totalPurchasedAmount;
      this.totalSaleAmount = result.data.totalSaleAmount;
    });

    return result;
  };

  bsSaleData = async (db, fromDate, toDate) => {
    const result = await this.saleData(db, fromDate, toDate, [
      'balance_amount'
    ]);

    return result;
  };

  purchaseData = async (db, fromDate, toDate, properties) => {
    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      { bill_date: { $gte: fromDate } },
      { bill_date: { $lte: toDate } }
    ];

    if (properties.includes('balance_amount')) {
      filterArray.push({ balance_amount: { $gt: 0 } });
    }

    let query = await db.purchases.find({
      selector: {
        $and: filterArray
      }
    });

    const data = await query.exec();

    if (!data) {
      // No customer is available
      return;
    }

    let response = await data
      .map((item) => {
        let total_tax = item.item_list.reduce(
          (acc, product) =>
            acc +
            (parseFloat(product.sgst_amount) || 0) +
            (parseFloat(product.cgst_amount) || 0) +
            (parseFloat(product.igst_amount) || 0),
          0
        );
        let total_amount = parseFloat(item.total_amount) - total_tax;

        let output = {
          total_amount,
          tcsAmount: properties.includes('tcsAmount')
            ? parseFloat(item.tcsAmount)
            : undefined,
          balanceAmount: properties.includes('balance_amount')
            ? parseFloat(item.balance_amount)
            : undefined
        };

        return output;
      })
      .reduce(
        (a, b) => {
          a.totalPurchaseAmount = (
            parseFloat(a.totalPurchaseAmount) + parseFloat(b.total_amount)
          ).toFixed(2);

          if (properties.includes('tcsAmount')) {
            a.totalTcsAmount = (
              parseFloat(a.totalTcsAmount) + parseFloat(b.tcsAmount)
            ).toFixed(2);
          }

          if (properties.includes('balance_amount')) {
            a.totalBalanceAmount = (
              parseFloat(a.totalBalanceAmount) + parseFloat(b.balanceAmount)
            ).toFixed(2);
          }

          return a;
        },
        {
          totalPurchaseAmount: 0,
          totalTcsAmount: properties.includes('tcsAmount') ? 0 : undefined,
          totalBalanceAmount: properties.includes('balance_amount')
            ? 0
            : undefined
        }
      );

    return response;
  };

  plPurchaseData = async (db, fromDate, toDate) => {
    const result = await this.purchaseData(db, fromDate, toDate, [
      'total_amount'
    ]);

    runInAction(() => {
      this.totalPurchaseAmount = result.data.totalPurchaseAmount;
    });

    return result;
  };

  bsPurchaseData = async (db, fromDate, toDate) => {
    return await this.purchaseData(db, fromDate, toDate, [
      'total_amount',
      'tcsAmount',
      'balance_amount'
    ]);
  };
  plMfgRawMaterialPurchaseData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: fromDate
              }
            },
            {
              bill_date: {
                $lte: toDate
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

        let total_purchase_amount = 0;
        data.map((item) => {
          let total_tax = 0;
          let total_amount = 0;
          for (let product of item.item_list) {
            if (
              (product.categoryLevel2 === 'raw_materials_level2' &&
                product.categoryLevel3 === 'raw_materials_level3') ||
              (product.categoryLevel2 === 'food_raw_materials_level2' &&
                product.categoryLevel3 === 'food_raw_materials_level3')
            ) {
              total_tax =
                total_tax +
                (parseFloat(product.sgst_amount) || 0) +
                (parseFloat(product.cgst_amount) || 0) +
                (parseFloat(product.igst_amount) || 0);
              total_amount = total_amount + parseFloat(product.amount);
            }
          }

          total_purchase_amount =
            parseFloat(total_purchase_amount) +
            (parseFloat(total_amount) - parseFloat(total_tax));
        });

        runInAction(() => {
          this.totalMfgPurchaseRawMaterialAmount = parseFloat(
            total_purchase_amount
          );
        });

        resolve(`Resolved plMfgRawMaterialPurchaseData`);
      });
    });
  };

  plPurchaseDataFromAprilToOneDayBefore = async (db, fromDate, toDate) => {
    runInAction(async () => {
      this.totalPurchaseAmountFromAprilStart = await this.purchaseData(
        db,
        fromDate,
        toDate
      );
    });
  };

  bsPurchaseDataFromAprilToOneDayBefore = async (db, fromDate, toDate) => {
    return await this.purchaseData(db, fromDate, toDate, [
      'total_amount',
      'tcsAmount',
      'balance_amount'
    ]);
  };

  plMfgPurchaseDataFromAprilToOneDayBefore = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.purchases.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              bill_date: {
                $gte: fromDate
              }
            },
            {
              bill_date: {
                $lte: toDate
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

        let total_purchase_amount = 0;
        data.map((item) => {
          //get total tax per sale
          let total_tax = 0;
          let total_amount = 0;
          for (let product of item.item_list) {
            if (
              (product.categoryLevel2 === 'raw_materials_level2' &&
                product.categoryLevel3 === 'raw_materials_level3') ||
              (product.categoryLevel2 === 'food_raw_materials_level2' &&
                product.categoryLevel3 === 'food_raw_materials_level3')
            ) {
              total_tax =
                total_tax +
                (parseFloat(product.sgst_amount) || 0) +
                (parseFloat(product.cgst_amount) || 0) +
                (parseFloat(product.igst_amount) || 0);
              total_amount = total_amount + (parseFloat(product.amount) || 0);
            }
          }

          total_purchase_amount =
            parseFloat(total_purchase_amount) +
            (parseFloat(total_amount) - parseFloat(total_tax));
        });

        runInAction(() => {
          this.totalMfgPurchaseRawMaterialAmountFromAprilStart = parseFloat(
            total_purchase_amount
          );
        });

        resolve(`Resolved plMfgPurchaseDataFromAprilToOneDayBefore`);
      });
    });
  };

  salesFromAprilToOneDayBefore = async (
    db,
    fromDate,
    toDate,
    balanceCondition = null
  ) => {
    const businessData = await Bd.getBusinessData();

    let selector = {
      $and: [
        { businessId: { $eq: businessData.businessId } },
        { invoice_date: { $gte: fromDate } },
        { invoice_date: { $lte: toDate } }
      ]
    };

    if (balanceCondition !== null) {
      selector.$and.push(balanceCondition);
    }

    try {
      const data = await db.sales.find({ selector }).exec();

      if (!data) {
        // No sales data is available
        return 0;
      }
      let total_purchased_amount = 0;
      for (let item of data) {
        for (let product of item.item_list) {
          let purchased_price = parseFloat(product.purchased_price);
          if (product.taxIncluded) {
            const cgst = product.cgst || 0;
            const sgst = product.sgst || 0;
            const igst = product.igst || 0;

            purchased_price = purchased_price / (1 + (cgst + sgst) / 100);

            purchased_price = purchased_price / (1 + igst / 100);
          }

          total_purchased_amount =
            parseFloat(purchased_price) * parseFloat(product.qty) +
            parseFloat(total_purchased_amount);
        }
      }

      return parseFloat(total_purchased_amount);
    } catch (err) {
      console.log('Internal Server Error', err);
    }
  };

  plSaleFromAprilToOneDayBefore = async (db, fromDate, toDate) => {
    runInAction(async () => {
      this.totalSaleAmountFromAprilStart =
        await this.salesFromAprilToOneDayBefore(db, fromDate, toDate);
    });
  };

  bsSaleFromAprilToOneDayBefore = async (db, fromDate, toDate) => {
    return await this.salesFromAprilToOneDayBefore(db, fromDate, toDate);
  };

  plExpenseData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.expenses.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              expenseType: {
                $eq: 'Direct'
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        let response = data
          .map((item) => {
            let output = {};

            let total_tax = 0;
            let total_amount = parseFloat(item.total);
            for (let product of item.item_list) {
              total_tax =
                total_tax +
                (parseFloat(product.sgst_amount) || 0) +
                (parseFloat(product.cgst_amount) || 0) +
                (parseFloat(product.igst_amount) || 0);
            }

            output.total_amount =
              parseFloat(total_amount) - parseFloat(total_tax);

            return output;
          })
          .reduce(
            (a, b) => {
              let data = toJS(b);

              a.totalExpensesAmount = parseFloat(
                parseFloat(a.totalExpensesAmount) +
                  parseFloat(data.total_amount)
              ).toFixed(2);

              return a;
            },
            {
              totalExpensesAmount: 0
            }
          );

        runInAction(() => {
          this.totalExpensesAmount = response.totalExpensesAmount;
        });

        resolve(`Resolved plExpenseData`);
      });
    });
  };

  plIndirectExpenseData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.expenses.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              date: {
                $gte: fromDate
              }
            },
            {
              date: {
                $lte: toDate
              }
            },
            {
              expenseType: {
                $eq: 'Indirect'
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        let response = data
          .map((item) => {
            let output = {};

            let total_tax = 0;
            let total_amount = parseFloat(item.total);
            for (let product of item.item_list) {
              total_tax =
                total_tax +
                (parseFloat(product.sgst_amount) || 0) +
                (parseFloat(product.cgst_amount) || 0) +
                (parseFloat(product.igst_amount) || 0);
            }

            output.total_amount =
              parseFloat(total_amount) - parseFloat(total_tax);

            return output;
          })
          .reduce(
            (a, b) => {
              let data = toJS(b);

              a.totalExpensesAmount = parseFloat(
                parseFloat(a.totalExpensesAmount) +
                  parseFloat(data.total_amount)
              ).toFixed(2);

              return a;
            },
            {
              totalExpensesAmount: 0
            }
          );

        runInAction(() => {
          this.totalIndirectExpensesAmount = response.totalExpensesAmount;
        });

        resolve(`Resolved plIndirectExpenseData`);
      });
    });
  };

  plMfgExpenseData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      let expenseList = [];
      let mfgExpenseData = new Map();
      let totalExp = 0;
      query = db.manufacturedirectexpenses.find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      });

      await query.exec().then(async (data) => {
        if (!data) {
          return;
        }

        if (data && data.length > 0) {
          expenseList = data.map((item) => item.toJSON());
        }

        if (expenseList.length > 0) {
          for (let exp of expenseList) {
            mfgExpenseData.set(exp.name, 0);
          }
          query = db.producttxn.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { txnDate: { $gte: fromDate } },
                { txnDate: { $lte: toDate } },
                { txnType: { $eq: 'Manufacture' } }
              ]
            }
          });

          await query.exec().then((data) => {
            if (!data) {
              // No customer is available
              return;
            }

            let response = data.map((item) => {
              if (item.mfgDirectExpenses && item.mfgDirectExpenses.length > 0) {
                for (let exp of item.mfgDirectExpenses) {
                  let expenseAmount = parseFloat(mfgExpenseData.get(exp.name));
                  let totalQty =
                    parseFloat(item.txnQty) + parseFloat(item.freeTxnQty);
                  expenseAmount += parseFloat(exp.amount * totalQty);
                  mfgExpenseData.set(exp.name, expenseAmount);
                }
              }
            });

            runInAction(() => {
              this.totalMfgExpenses = mfgExpenseData;
            });
            if (expenseList && expenseList.length > 0) {
              for (let exp of expenseList) {
                totalExp += parseFloat(mfgExpenseData.get(exp.name));
                const expObj = {
                  expName: '',
                  expValue: 0
                };
                expObj.expName = exp.name;
                expObj.expValue = parseFloat(mfgExpenseData.get(exp.name));
                runInAction(() => {
                  this.totalMfgExpensesList.push(expObj);
                });
              }
            }

            runInAction(() => {
              this.totalMfgAmount = totalExp;
            });

            resolve(`Resolved plMfgExpenseData`);
          });
        } else {
          resolve(`Resolved plMfgExpenseData`);
        }
      });
    });
  };

  plMfgRawMaterialConsumptionData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.producttxn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { txnDate: { $gte: fromDate } },
            { txnDate: { $lte: toDate } },
            { txnType: { $eq: 'Raw Material' } }
          ]
        }
      });

      await query.exec().then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        let total_purchase_amount = 0;
        data.map((item) => {
          //get total tax per sale
          let total_tax = 0;
          let totalQty = item.txnQty + item.freeTxnQty;
          let total_amount = parseFloat(item.purchasedPrice) * totalQty;

          total_tax = total_tax + item.taxAmount;

          total_purchase_amount =
            parseFloat(total_purchase_amount) +
            (parseFloat(total_amount) - parseFloat(total_tax));
        });

        runInAction(() => {
          this.totalMfgRawMaterialConsumptionAmount = parseFloat(
            total_purchase_amount
          );
        });

        resolve(`Resolved plMfgRawMaterialConsumptionData`);
      });
    });
  };

  getDateInString = (date) => {
    let dateInString;
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    dateInString = yyyy + '-' + mm + '-' + dd;

    return dateInString;
  };

  openingStockValue = async (db) => {
    const businessData = await Bd.getBusinessData();

    const data = await db.openingstockvalue
      .findOne({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      })
      .exec();

    if (!data) {
      // No data is available
      return;
    }

    return data.stockValue;
  };

  plOpeningStockValue = async (db) => {
    const result = await this.openingStockValue(db);

    runInAction(() => {
      this.openingStockValue = result.data;
    });

    return result;
  };

  bsOpeningStockValue = async (db) => {
    const result = await this.openingStockValue(db);

    return result;
  };

  bsPaymentInUnusedAmount = async (db, fromDate, toDate) => {
    const businessData = await Bd.getBusinessData();

    const query = db.paymentin.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            date: {
              $gte: fromDate
            }
          },
          {
            date: {
              $lte: toDate
            }
          },
          { balance: { $gt: 0 } }
        ]
      }
    });

    return await query.exec().then(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }
      return await data.reduce((total, item) => total + item.balance, 0);
    });
  };
  plOpeningStockRawMaterialValue = async (db) => {
    const result = await this.openingStockValue(
      db,
      'plOpeningStockRawMaterialValue'
    );

    runInAction(() => {
      this.openingStockRawMaterialValue = result.data;
    });

    return result;
  };

  /**
   * input and output tax credit report
   */
  getTaxReportData = async (fromDate, toDate) => {
    const db = await Db.get();

    runInAction(() => {
      this.taxdata = [];
      this.taxDataList = [];
    });

    await Promise.all([
      this.taxInputOutputSalesData(db, fromDate, toDate),
      this.taxInputOutputSalesReturnData(db, fromDate, toDate),

      this.taxInputOutputPurchaseData(db, fromDate, toDate),
      this.taxInputOutputPurchaseReturnData(db, fromDate, toDate)
    ]).then((results) => {
      this.calculateTaxData();
    });
  };

  calculateTaxData = async () => {
    /**
     * get total payment in , payment out data,
     * then calculate total cash in hand
     */
    let totalInputCESS = 0;
    let totalInputIGST = 0;
    let totalInputSGST = 0;
    let totalInputCGST = 0;
    let totalInputTAX = 0;

    let totalOutputCESS = 0;
    let totalOutputIGST = 0;
    let totalOutputSGST = 0;
    let totalOutputCGST = 0;
    let totalOutputTAX = 0;

    runInAction(() => {
      this.taxDataList = this.taxDataList ? this.taxDataList : [];
    });
    for (const data of this.taxDataList) {
      if (
        data['transactionType'] === 'Sales' ||
        data['transactionType'] === 'Sales Return' ||
        data['transactionType'] === 'KOT'
      ) {
        if (
          data['transactionType'] === 'Sales' ||
          data['transactionType'] === 'KOT'
        ) {
          for (let item of data['item_list']) {
            totalOutputCESS = totalOutputCESS + (item.cess || 0);
            totalOutputIGST = totalOutputIGST + (item.igst_amount || 0);
            totalOutputSGST = totalOutputSGST + (item.sgst_amount || 0);
            totalOutputCGST = totalOutputCGST + (item.cgst_amount || 0);
          }
        } else if (data['transactionType'] === 'Sales Return') {
          for (let item of data['item_list']) {
            totalOutputCESS = totalOutputCESS - (item.cess || 0);
            totalOutputIGST = totalOutputIGST - (item.igst_amount || 0);
            totalOutputSGST = totalOutputSGST - (item.sgst_amount || 0);
            totalOutputCGST = totalOutputCGST - (item.cgst_amount || 0);
          }
        }
      } else if (
        data['transactionType'] === 'Purchases' ||
        data['transactionType'] === 'Purchases Return'
      ) {
        if (data['transactionType'] === 'Purchases') {
          for (let item of data['item_list']) {
            totalInputCESS = totalInputCESS + (item.cess || 0);
            totalInputIGST = totalInputIGST + (item.igst_amount || 0);
            totalInputSGST = totalInputSGST + (item.sgst_amount || 0);
            totalInputCGST = totalInputCGST + (item.cgst_amount || 0);
          }
        } else if (data['transactionType'] === 'Purchases Return') {
          for (let item of data['item_list']) {
            totalInputCESS = totalInputCESS - (item.cess || 0);
            totalInputIGST = totalInputIGST - (item.igst_amount || 0);
            totalInputSGST = totalInputSGST - (item.sgst_amount || 0);
            totalInputCGST = totalInputCGST - (item.cgst_amount || 0);
          }
        }
      }
    }

    totalInputTAX =
      totalInputTAX +
      totalInputCESS +
      totalInputIGST +
      totalInputSGST +
      totalInputCGST;

    totalOutputTAX =
      totalOutputTAX +
      totalOutputCESS +
      totalOutputIGST +
      totalOutputSGST +
      totalOutputCGST;

    let input = {};
    input.title = 'Input Tax';
    input.cess = parseFloat(totalInputCESS).toFixed(2);
    input.igst = parseFloat(totalInputIGST).toFixed(2);
    input.sgst = parseFloat(totalInputSGST).toFixed(2);
    input.cgst = parseFloat(totalInputCGST).toFixed(2);
    input.total = parseFloat(totalInputTAX).toFixed(2);

    let output = {};
    output.title = 'Output Tax';
    output.cess = parseFloat(totalOutputCESS).toFixed(2);
    output.igst = parseFloat(totalOutputIGST).toFixed(2);
    output.sgst = parseFloat(totalOutputSGST).toFixed(2);
    output.cgst = parseFloat(totalOutputCGST).toFixed(2);
    output.total = parseFloat(totalOutputTAX).toFixed(2);

    runInAction(() => {
      this.taxdata.push(output);
      this.taxdata.push(input);

      this.totalTaxBalance = input.total - output.total;
    });
  };

  taxInputOutputSalesData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: fromDate
              }
            },
            {
              invoice_date: {
                $lte: toDate
              }
            }
          ]
        }
      });

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Sales';

          runInAction(() => {
            this.taxDataList = this.taxDataList ? this.taxDataList : [];
            this.taxDataList.push(finalData);
          });
        });

        resolve(`done with taxInputOutputSalesData `);
      });
    });
  };

  taxInputOutputSalesReturnData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (fromDate && toDate) {
        query = db.salesreturn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                invoice_date: {
                  $gte: fromDate
                }
              },
              {
                invoice_date: {
                  $lte: toDate
                }
              }
            ]
          }
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Sales Return';

          runInAction(() => {
            this.taxDataList = this.taxDataList ? this.taxDataList : [];
            this.taxDataList.push(finalData);
          });
        });
        resolve(`Resolved taxInputOutputSalesReturnData`);
      });
    });
  };

  taxInputOutputPurchaseData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (fromDate && toDate) {
        query = db.purchases.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          }
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases';

          runInAction(() => {
            this.taxDataList = this.taxDataList ? this.taxDataList : [];
            this.taxDataList.push(finalData);
          });
        });
        resolve(`Resolved taxInputOutputPurchaseData`);
      });
    });
  };

  taxInputOutputPurchaseReturnData = async (db, fromDate, toDate) => {
    return new Promise(async (resolve) => {
      var query;
      const businessData = await Bd.getBusinessData();

      if (fromDate && toDate) {
        query = db.purchasesreturn.find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },

              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          }
        });
      }

      await query.$.subscribe((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        data.map((item) => {
          let finalData = item.toJSON();
          finalData.transactionType = 'Purchases Return';

          runInAction(() => {
            this.cashFlowList = this.cashFlowList ? this.cashFlowList : [];
            this.cashFlowList.push(finalData);
          });
        });
        resolve(`Resolved taxInputOutputPurchaseReturnData`);
      });
    });
  };

  /**
   * expiry report changes
   */

  formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('-');
  };

  getDateRangeMatchRecords(batchData, fromDate, toDate, isMfDate) {
    var resultData = [];

    if (isMfDate) {
      resultData = batchData.filter((a) => {
        var date = new Date(a.mfDate);
        return date >= new Date(fromDate) && date <= new Date(toDate);
      });
    } else {
      resultData = batchData.filter((a) => {
        var date = new Date(a.expiryDate);
        return date >= new Date(fromDate) && date <= new Date(toDate);
      });
    }

    return resultData;
  }

  getLowStockAndExpiry = async () => {
    let productSettings = await getProductTransactionSettings();
    if (productSettings.showStockAlertInDashboard === true) {
      await Promise.all([
        this.getLowStockSummaryForAllCategories(),
        this.getExpiryProductReportForNextTwoMonthsData()
      ]).then((results) => {
        this.checkLowStockAndExpiredProducts();
      });
    }
  };

  getExpiryProductReportForNextTwoMonthsData = async () => {
    return new Promise(async (resolve) => {
      const today = new Date().getDate();
      const thisYear = new Date().getFullYear();
      const thisMonth = new Date().getMonth();
      const toDate = new Date(thisYear, thisMonth, today);

      var fromDate = new Date(toDate);
      fromDate.setDate(fromDate.getDate() - 60);

      const db = await Db.get();
      runInAction(() => {
        this.expiredProductData = [];
      });
      var query;
      const businessData = await Bd.getBusinessData();

      query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              $or: [
                {
                  $and: [
                    {
                      batchData: {
                        $elemMatch: {
                          expiryDate: { $gte: fromDate }
                        }
                      }
                    },
                    {
                      batchData: {
                        $elemMatch: {
                          expiryDate: { $lte: toDate }
                        }
                      }
                    }
                  ]
                },
                {
                  $and: [
                    {
                      expiryDate: {
                        $gte: fromDate
                      }
                    },
                    {
                      expiryDate: {
                        $lte: toDate
                      }
                    }
                  ]
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
          let finalData = item.toJSON();

          let batchData = [];
          let finalBatchData = [];
          batchData = finalData.batchData;

          if (batchData.length > 0) {
            finalBatchData = this.getDateRangeMatchRecords(
              batchData,
              fromDate,
              toDate,
              false
            );
          }

          if (finalBatchData.length > 0) {
            for (let batch of finalBatchData) {
              var row = {};

              row.name = finalData.name;
              row.batchNumber = batch.batchNumber;
              row.qty = batch.qty;
              row.purchasedPrice = batch.purchasedPrice;
              row.mrp = batch.salePrice;
              row.offerPrice = batch.offerPrice;
              row.mfDate = batch.mfDate;
              row.expiryDate = batch.expiryDate;

              this.expiredProductData.push(row);
            }
          } else {
            row = {};

            row.name = finalData.name;
            row.qty = finalData.qty;
            row.purchasedPrice = finalData.purchasedPrice;
            row.mrp = finalData.salePrice;
            row.offerPrice = finalData.offerPrice;
            row.mfDate = finalData.mfDate;
            row.expiryDate = finalData.expiryDate;

            let isValidRecord = true;

            if (!row.expiryDate) {
              isValidRecord = false;
            }

            if (isValidRecord) {
              runInAction(() => {
                this.expiredProductData.push(row);
              });
            }
          }
        });
        resolve(`Resolved getExpiryProductReportForNextTwoMonthsData`);
      });
    });
  };

  checkLowStockAndExpiredProducts = async () => {
    runInAction(() => {
      this.lowStockProductsCount = this.lowStockProductsList.length;
      this.expiredProductsCount = this.expiredProductData.length;

      if (this.lowStockProductsCount > 0 || this.expiredProductsCount > 0) {
        this.openExpiryAndLowStockReport = true;
      }
    });
  };

  closeExpiryAndLowStockReport = async () => {
    runInAction(() => {
      this.openExpiryAndLowStockReport = false;
    });
  };

  // setting variables as observables so that it can be accesible
  // from other components and making methods as actions to invoke from other components
  constructor() {
    makeObservable(this, {
      level2Selected: observable,
      level2CategoriesList: observable,
      level3CategoriesList: observable,
      lowStockProductsList: observable,
      totalCashInHand: observable,
      totalPaymnetInCash: observable,
      totalPaymnetOutCash: observable,
      finalCashInHand: observable,
      cashFlowList: observable,
      getBusinessCategorieslist: action,
      getLowStockSummary: action,
      getAccountsPayableByData: action,

      /**
       * for profit and loss report
       */
      totalSaleAmount: observable,
      totalSaleReturnAmount: observable,
      totalPurchaseAmount: observable,
      totalPurchaseReturnAmount: observable,
      totalOpeningStockValue: observable,
      totalClosingStockValue: observable,
      totalGrossAmount: observable,
      totalExpensesAmount: observable,
      netAmount: observable,
      taxdata: observable,
      totalTaxBalance: observable,
      expiredProductData: observable,
      openExpiryAndLowStockReport: observable,
      lowStockProductsCount: observable,
      expiredProductsCount: observable,
      reportRouterData: observable,
      accountsPayableResult: observable,
      selectedCustomer: observable,
      selectedVendor: observable,
      accountsReceivableTotalToPay: observable,
      accountsPayableTotalToPay: observable,
      setReportRouterData: action,
      openingBalanceCashBook: observable,
      cashInTotalCashBook: observable,
      cashOutTotalCashBook: observable,
      dayBookTotal: observable,
      totalMfgAmount: observable,
      totalMfgExpenses: observable,
      totalMfgOpeningStockRawMaterial: observable,
      totalMfgPurchaseRawMaterialAmount: observable,
      totalMfgPurchaseReturnRawMaterialAmount: observable,
      totalMfgClosingStockRawMaterial: observable,
      totalMfgExpensesList: observable,
      totalIndirectExpensesAmount: observable,
      auditReportRouterData: observable,
      //balance sheet fields
      balanceSheetPayableAmount: observable,
      balanceSheetReceivableAmount: observable,
      balanceSheetTaxGstPayableAmount: observable,
      balanceSheetTaxGstReceivableAmount: observable,
      balanceSheetTaxTcsPayableAmount: observable,
      balanceSheetTaxTcsReceivableAmount: observable,
      balanceSheetOpeningCashInHand: observable,
      balanceSheetOpeningBankBalance: observable,
      balanceSheetOpeningPartyBalance: observable,
      balanceSheetOpeningStockValue: observable,
      balanceSheetClosingStockValue: observable,
      balanceSheetBankAccountsData: observable,
      balanceSheetAdvancesAmount: observable
      //balance sheet fields
    });
  }
}

// this is to make this component public so that it is assible from other componets
export default new BalanceSheetStore();