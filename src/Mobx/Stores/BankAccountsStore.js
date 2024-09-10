import { action, observable, makeObservable, runInAction } from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import * as allTxn from '../../components/Helpers/AllTxnHelper';

var dateFormat = require('dateformat');
var date = new Date();
var newDate = dateFormat(date, 'yyyy-mm-dd');

class BankAccountsStore {
  bankDialogOpen = false;
  transferDialogOpen = false;
  isEdit = false;

  bankAccountData = {
    id: '',
    accountDisplayName: '',
    balance: 0,
    asOfDate: newDate,
    accountNumber: '',
    ifscCode: '',
    upiIdForQrCode: '',
    bankName: '',
    accountHolderName: '',
    updatedAt: 0,
    businessId: '',
    businessCity: '',
    isSyncedToServer: false
  };

  defaultBankAccountData = {
    id: '',
    accountDisplayName: '',
    balance: 0,
    asOfDate: newDate,
    accountNumber: '',
    ifscCode: '',
    upiIdForQrCode: '',
    bankName: '',
    accountHolderName: '',
    updatedAt: 0,
    businessId: '',
    businessCity: '',
    isSyncedToServer: false
  };

  transferMoneyData = {
    from: '',
    to: '',
    amount: '',
    description: '',
    adjustment_date: newDate
  };

  bankAccountDataList = [];
  bankTransactionList = [];
  bankBookCashInTotal = 0;
  bankBookCashOutTotal = 0;
  bankBookUpiTotal = 0;
  bankBookCardTotal = 0;
  bankBookNeftTotal = 0;
  bankBookChequeTotal = 0;

  chequeTransactionList = [];
  chequeTotalIn = 0;
  chequeTotalOut = 0;

  customFinanceTransactionList = [];
  customFinanceTotalIn = 0;
  customFinanceTotalOut = 0;

  giftCardTransactionList = [];
  giftCardTotalIn = 0;
  giftCardTotalOut = 0;

  exchangeTransactionList = [];
  exchangeTotalIn = 0;
  exchangeTotalOut = 0;

  selectedBankAccountForFiltering = {};

  generateBankId = async () => {
    console.log('inside generateBankId');
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('bi');
    this.bankAccountData.id = `${id}${appId}${timestamp}`;
  };

  handleTransferMoneyDialog = (val) => {
    this.transferDialogOpen = val;
  };

  handleCloseDialog = () => {
    this.bankDialogOpen = false;
  };

  getBankAccountTransactionsByDate = async (bankAccount, fromDate, toDate) => {
    const db = await Db.get();

    this.selectedBankAccountForFiltering = bankAccount;

    runInAction(() => {
      this.bankTransactionList = [];
      this.bankBookCashInTotal = 0;
      this.bankBookCashOutTotal = 0;
      this.bankBookUpiTotal = 0;
    });
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
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
              isCredit: { $eq: false }
            },
            {
              $or: [
                {
                  splitPaymentList: {
                    $elemMatch: {
                      bankAccountId: { $eq: bankAccount.id },
                      amount: { $gt: 0 }
                    }
                  }
                },
                {
                  bankAccountId: { $eq: bankAccount.id }
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
          // No bank txn data is available
          return;
        }

        let cashInTotal = 0;
        let cashOutTotal = 0;
        const finalData = data.map((item) => {
          let result = item.toJSON();
          result['upi'] = 0;
          result['netBanking'] = 0;
          result['cheque'] = 0;
          result['card'] = 0;

          let amount = 0;
          if (result.splitPaymentList && result.splitPaymentList.length > 0) {
            let splitAmount = 0;
            for (let payment of result.splitPaymentList) {
              if (
                bankAccount.id !== '' &&
                payment.bankAccountId !== '' &&
                payment.bankAccountId === bankAccount.id
              ) {
                splitAmount += parseFloat(payment.amount);

                if (payment.paymentMode === 'UPI') {
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
            }
            amount = parseFloat(splitAmount);
          } else {
            if (
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
            amount = parseFloat(result.amount);
          }

          if (
            result['txnType'] === 'Payment In' ||
            result['txnType'] === 'Sales' ||
            result['txnType'] === 'Purchases Return' ||
            result['txnType'] === 'KOT' ||
            result['txnType'] === 'Opening Balance'
          ) {
            cashInTotal = cashInTotal + parseFloat(amount);
          } else {
            cashOutTotal = cashOutTotal + parseFloat(amount);
          }
          return result;
        });

        runInAction(() => {
          this.bankTransactionList = finalData;

          this.bankBookCashInTotal = cashInTotal;
          this.bankBookCashOutTotal = cashOutTotal;

          this.bankBookUpiTotal = 0;
          this.bankBookNeftTotal = 0;
          this.bankBookCardTotal = 0;
          this.bankBookChequeTotal = 0;

          for (let res of this.bankTransactionList) {
            this.bankBookUpiTotal += parseFloat(res.upi) || 0;
            this.bankBookNeftTotal += parseFloat(res.netBanking) || 0;
            this.bankBookCardTotal += parseFloat(res.card) || 0;
            this.bankBookChequeTotal += parseFloat(res.cheque) || 0;
          }
        });
      });
  };

  getBankAccountTransactions = async (bankAccount) => {
    const db = await Db.get();

    this.selectedBankAccountForFiltering = bankAccount;

    runInAction(() => {
      this.bankTransactionList = [];
    });
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
          businessId: { $eq: businessData.businessId },
          updatedAt: { $exists: true },
          isCredit: { $eq: false },
          date: { $exists: true },
          $or: [
            {
              splitPaymentList: {
                $elemMatch: {
                  bankAccountId: { $eq: bankAccount.id },
                  amount: { $gt: 0 }
                }
              }
            },
            {
              bankAccountId: { $eq: bankAccount.id }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No bank txn data is available
          return;
        }

        const finalData = data.map((item) => item.toJSON());
        runInAction(() => {
          this.bankTransactionList = finalData;
        });
      });
  };

  getChequeTransactions = async () => {
    const db = await Db.get();

    runInAction(() => {
      this.chequeTransactionList = [];
    });
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
          businessId: { $eq: businessData.businessId },
          updatedAt: { $exists: true },
          isCredit: { $eq: false },
          date: { $exists: true },
          $or: [
            {
              splitPaymentList: {
                $elemMatch: {
                  paymentMode: { $eq: 'Cheque' },
                  amount: { $gt: 0 }
                }
              }
            },
            {
              paymentType: { $eq: 'cheque' }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }]
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No bank txn data is available
          return;
        }

        const finalData = data.map((item) => item.toJSON());
        runInAction(() => {
          this.chequeTransactionList = finalData;
        });
      });
  };

  getChequeTransactionsByDate = async (fromDate, toDate) => {
    const db = await Db.get();

    runInAction(() => {
      this.chequeTransactionList = [];
      this.chequeTotalIn = 0;
      this.chequeTotalOut = 0;
    });
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
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
              isCredit: { $eq: false }
            },
            {
              $or: [
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentMode: { $eq: 'Cheque' },
                      amount: { $gt: 0 }
                    }
                  }
                },
                {
                  paymentType: { $eq: 'cheque' }
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
          // No bank txn data is available
          return;
        }

        let cashInTotal = 0;
        let cashOutTotal = 0;
        const finalData = data.map((item) => {
          let result = item.toJSON();

          let amount = 0;
          if (result.splitPaymentList && result.splitPaymentList.length > 0) {
            let splitAmount = 0;
            for (let payment of result.splitPaymentList) {
              if (payment.paymentMode === 'Cheque') {
                splitAmount += parseFloat(payment.amount);
              }
            }
            amount = parseFloat(splitAmount);
          } else {
            amount = parseFloat(result.amount);
          }

          if (
            result['txnType'] === 'Payment In' ||
            result['txnType'] === 'Sales' ||
            result['txnType'] === 'Purchases Return' ||
            result['txnType'] === 'KOT' ||
            result['txnType'] === 'Opening Balance'
          ) {
            cashInTotal = cashInTotal + parseFloat(amount);
          } else {
            cashOutTotal = cashOutTotal + parseFloat(amount);
          }

          return result;
        });

        runInAction(() => {
          this.chequeTransactionList = finalData;

          this.chequeTotalIn = cashInTotal;
          this.chequeTotalOut = cashOutTotal;
        });
      });
  };

  getCustomFinanceTransactionsByDate = async (
    fromDate,
    toDate,
    selectedFinance
  ) => {
    const db = await Db.get();

    runInAction(() => {
      this.customFinanceTransactionList = [];
      this.customFinanceTotalIn = 0;
      this.customFinanceTotalOut = 0;
    });
    const businessData = await Bd.getBusinessData();

    var Query;

    if (selectedFinance) {
      Query = db.alltransactions.find({
        selector: {
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
              isCredit: { $eq: false }
            },
            {
              $or: [
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Custom Finance' },
                      amount: { $gt: 0 },
                      paymentMode: { $eq: selectedFinance }
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
      Query = db.alltransactions.find({
        selector: {
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
              isCredit: { $eq: false }
            },
            {
              $or: [
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Custom Finance' },
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

    await Query.$.subscribe((data) => {
      if (!data) {
        // No bank txn data is available
        return;
      }

      let cashInTotal = 0;
      let cashOutTotal = 0;
      const finalData = data.map((item) => {
        let result = item.toJSON();

        let amount = 0;
        if (result.splitPaymentList && result.splitPaymentList.length > 0) {
          let splitAmount = 0;
          for (let payment of result.splitPaymentList) {
            if (payment.paymentType === 'Custom Finance') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        }

        if (
          result['txnType'] === 'Payment In' ||
          result['txnType'] === 'Sales' ||
          result['txnType'] === 'Purchases Return' ||
          result['txnType'] === 'KOT' ||
          result['txnType'] === 'Opening Balance'
        ) {
          cashInTotal = cashInTotal + parseFloat(amount);
        } else {
          cashOutTotal = cashOutTotal + parseFloat(amount);
        }

        return result;
      });

      runInAction(() => {
        this.customFinanceTransactionList = finalData;

        this.customFinanceTotalIn = cashInTotal;
        this.customFinanceTotalOut = cashOutTotal;
      });
    });
  };

  getGiftCardTransactionsByDate = async (fromDate, toDate, selectedCard) => {
    const db = await Db.get();

    runInAction(() => {
      this.giftCardTransactionList = [];
      this.giftCardTotalIn = 0;
      this.giftCardTotalOut = 0;
    });
    const businessData = await Bd.getBusinessData();

    var Query;

    if (selectedCard) {
      Query = db.alltransactions.find({
        selector: {
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
              isCredit: { $eq: false }
            },
            {
              $or: [
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Gift Card' },
                      amount: { $gt: 0 },
                      paymentMode: { $eq: selectedCard }
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
      Query = db.alltransactions.find({
        selector: {
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
              isCredit: { $eq: false }
            },
            {
              $or: [
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Gift Card' },
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

    await Query.$.subscribe((data) => {
      if (!data) {
        // No bank txn data is available
        return;
      }

      let cashInTotal = 0;
      let cashOutTotal = 0;
      const finalData = data.map((item) => {
        let result = item.toJSON();

        let amount = 0;
        if (result.splitPaymentList && result.splitPaymentList.length > 0) {
          let splitAmount = 0;
          for (let payment of result.splitPaymentList) {
            if (payment.paymentType === 'Gift Card') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        }

        if (
          result['txnType'] === 'Payment In' ||
          result['txnType'] === 'Sales' ||
          result['txnType'] === 'Purchases Return' ||
          result['txnType'] === 'KOT' ||
          result['txnType'] === 'Opening Balance'
        ) {
          cashInTotal = cashInTotal + parseFloat(amount);
        } else {
          cashOutTotal = cashOutTotal + parseFloat(amount);
        }

        return result;
      });

      runInAction(() => {
        this.giftCardTransactionList = finalData;

        this.giftCardTotalIn = cashInTotal;
        this.giftCardTotalOut = cashOutTotal;
      });
    });
  };

  getExchangeTransactionsByDate = async (fromDate, toDate, selectedCard) => {
    const db = await Db.get();

    runInAction(() => {
      this.exchangeTransactionList = [];
      this.exchangeTotalIn = 0;
      this.exchangeTotalOut = 0;
    });
    const businessData = await Bd.getBusinessData();

    var Query;

    if (selectedCard) {
      Query = db.alltransactions.find({
        selector: {
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
              isCredit: { $eq: false }
            },
            {
              $or: [
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Exchange' },
                      amount: { $gt: 0 },
                      paymentMode: { $eq: selectedCard }
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
      Query = db.alltransactions.find({
        selector: {
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
              isCredit: { $eq: false }
            },
            {
              $or: [
                {
                  splitPaymentList: {
                    $elemMatch: {
                      paymentType: { $eq: 'Exchange' },
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

    await Query.$.subscribe((data) => {
      if (!data) {
        // No bank txn data is available
        return;
      }

      let cashInTotal = 0;
      let cashOutTotal = 0;
      const finalData = data.map((item) => {
        let result = item.toJSON();

        let amount = 0;
        if (result.splitPaymentList && result.splitPaymentList.length > 0) {
          let splitAmount = 0;
          for (let payment of result.splitPaymentList) {
            if (payment.paymentType === 'Exchange') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        }

        if (
          result['txnType'] === 'Sales'
        ) {
          cashInTotal = cashInTotal + parseFloat(amount);
        } else {
          cashOutTotal = cashOutTotal + parseFloat(amount);
        }

        return result;
      });

      runInAction(() => {
        this.exchangeTransactionList = finalData;

        this.exchangeTotalIn = cashInTotal;
        this.exchangeTotalOut = cashOutTotal;
      });
    });
  };

  viewOrEditBankAccount = async (bankAccount) => {
    //get data from Db and assign to variable
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.bankaccounts
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: bankAccount.id } }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (data) {
          this.bankAccountData.accountDisplayName = data.accountDisplayName;
          this.bankAccountData.balance = data.balance;
          this.bankAccountData.asOfDate = data.asOfDate;
          this.bankAccountData.accountNumber = data.accountNumber;
          this.bankAccountData.ifscCode = data.ifscCode;
          this.bankAccountData.upiIdForQrCode = data.upiIdForQrCode;
          this.bankAccountData.bankName = data.bankName;
          this.bankAccountData.accountHolderName = data.accountHolderName;
          this.bankAccountData.businessId = data.businessId;
          this.bankAccountData.businessCity = data.businessCity;
          this.bankAccountData.id = data.id;
          this.bankAccountData.isSyncedToServer = data.isSyncedToServer;
        }
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });

    this.handleOpenDialog(true);
  };

  deleteBankAccount = async (bankAccount) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.bankaccounts.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { id: { $eq: bankAccount.id } }
        ]
      }
    });

    await query
      .remove()
      .then(async (data) => {
        console.log('bankaccount data removed' + data);
      })
      .catch((error) => {
        console.log('bankaccount deletion Failed ' + error);
      });
  };

  handleOpenDialog = (isEdit) => {
    runInAction(() => {
      this.isEdit = isEdit;
      if (!isEdit) {
        this.bankAccountData = this.defaultBankAccountData;
      }
      this.bankDialogOpen = true;
    });
  };

  setBankAccountProperty = (property, value) => {
    this.bankAccountData[property] = value;
  };

  setTransferAmountProperty = (property, value) => {
    this.transferMoneyData[property] = value;
  };

  saveData = async () => {
    const db = await Db.get();

    this.bankAccountData.updatedAt = Date.now();

    const businessData = await Bd.getBusinessData();
    this.bankAccountData.businessId = businessData.businessId;
    this.bankAccountData.businessCity = businessData.businessCity;

    if (!this.isEdit) {
      // console.log('InsertDoc::', InsertDoc);

      await this.generateBankId();

      let txnData = this.bankAccountData;
      await db.bankaccounts
        .insert(this.bankAccountData)
        .then((data) => {
          console.log('data Inserted:', data);
          this.bankAccountData = this.defaultBankAccountData;
          this.handleCloseDialog();
        })
        .catch((err) => {
          console.log('Error in saving bank accounts :', err);
        });

      //save as opening balance in all transaction if opening balance > 0
      if (parseFloat(txnData.balance) > 0) {
        allTxn.saveTxnFromAddBankAccount(txnData, db);
      }
    } else {
      const businessData = await Bd.getBusinessData();

      const query = db.bankaccounts.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { id: { $eq: this.bankAccountData.id } }
          ]
        }
      });

      await query
        .exec()
        .then(async (data) => {
          if (!data) {
            // No Sales data is found so cannot update any information
            return;
          }

          await query
            .update({
              $set: {
                accountDisplayName: this.bankAccountData.accountDisplayName,
                balance: this.bankAccountData.balance,
                asOfDate: this.bankAccountData.asOfDate,
                accountNumber: this.bankAccountData.accountNumber,
                ifscCode: this.bankAccountData.ifscCode,
                upiIdForQrCode: this.bankAccountData.upiIdForQrCode,
                bankName: this.bankAccountData.bankName,
                accountHolderName: this.bankAccountData.accountHolderName,
                businessId: this.bankAccountData.businessId,
                businessCity: this.bankAccountData.businessCity,
                isSyncedToServer: this.bankAccountData.isSyncedToServer,
                updatedAt: Date.now()
              }
            })
            .then(async () => {
              console.log('inside update bankAccountData');

              await allTxn.deleteTxnFromAddBankAccount(
                this.bankAccountData,
                db
              );

              if (parseFloat(this.bankAccountData.balance) > 0) {
                await allTxn.saveTxnFromAddBankAccount(
                  this.bankAccountData,
                  db
                );
              }
              this.handleCloseDialog();
              this.isEdit = false;
            });
        })
        .catch((err) => {
          console.log('Internal Server Error bankAccountData ', err);
        });
    }
  };

  constructor() {
    makeObservable(this, {
      bankDialogOpen: observable,
      handleCloseDialog: action,
      bankAccountData: observable,
      handleOpenDialog: action,
      transferDialogOpen: observable,
      transferMoneyData: observable,
      handleTransferMoneyDialog: action,
      setTransferAmountProperty: action,
      bankAccountDataList: observable,
      bankTransactionList: observable,
      bankBookCashInTotal: observable,
      bankBookCashOutTotal: observable,
      chequeTransactionList: observable,
      chequeTotalIn: observable,
      chequeTotalOut: observable,
      selectedBankAccountForFiltering: observable,
      customFinanceTransactionList: observable,
      customFinanceTotalIn: observable,
      customFinanceTotalOut: observable,
      giftCardTransactionList: observable,
      giftCardTotalIn: observable,
      giftCardTotalOut: observable,
      bankBookCardTotal: observable,
      bankBookChequeTotal: observable,
      bankBookNeftTotal: observable,
      bankBookUpiTotal: observable,
      exchangeTransactionList: observable,
      exchangeTotalIn: observable,
      exchangeTotalOut: observable
    });
  }
}
export default new BankAccountsStore();