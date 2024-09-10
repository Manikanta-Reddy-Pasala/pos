import {
  action,
  observable,
  makeObservable,
  toJS,
  computed,
  runInAction
} from 'mobx';
import _uniqueId from 'lodash/uniqueId';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import * as allTxn from '../../components/Helpers/AllTxnHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import * as deleteTxn from '../../components/Helpers/DeleteTxnHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as taxSettings from '../../components/Helpers/TaxSettingsHelper';
import getStateList from '../../components/StateList';
import * as dateHelper from '../../components/Helpers/DateHelper';
import * as timestamp from '../../components/Helpers/TimeStampGeneratorHelper';
import Expense from './classes/Expense';
import ExpenseItem from './classes/ExpenseItem';
import { formatDate } from 'src/components/Helpers/DateHelper';

class ExpenseStore {
  expenseDialogOpen = false;

  categoryDialogOpen = false;

  addExpensesDialogue = false;
  viewCategoryDialogOpen = false;

  isExpenseList = false;

  isUpdate = false;
  isUpdateCategory = false;

  expenseList = [];
  categoryList = [];

  expenseTxnEnableFieldsMap = new Map();
  taxSettingsData = {};
  expenseTransSettingData = {};

  isRestore = false;

  //below variable is temporary fix
  changeInCategory = false;
  changeInExpense = false;

  category = {
    businessId: '',
    businessCity: '',
    categoryId: '',
    category: '',
    expenseType: 'Indirect',
    amount: 0,
    updatedAt: Date.now(),
    tallySyncedStatus: '',
    tallySynced: false
  };

  categoryDefault = {
    businessId: '',
    businessCity: '',
    categoryId: '',
    category: '',
    expenseType: 'Indirect',
    amount: 0,
    updatedAt: Date.now(),
    tallySyncedStatus: '',
    tallySynced: false
  };

  newCustomer = false;
  isUpdate = false;
  dialogOpen = false;
  newCustomerData = {};

  items = {
    CategoryName: '',
    setAmount: ''
  };

  openExpenseLoadingAlertMessage = false;
  openExpenseErrorAlertMessage = false;

  roundingConfiguration = 'Nearest 50';

  currentSelectedCategory = {};

  splitPaymentSettingsData = {};
  chosenPaymentType = 'Cash';
  openSplitPaymentDetails = false;
  bankAccountsList = [];

  isAutoGenMode = true;
  invoiceData = {};

  isCGSTSGSTEnabledByPOS = true;

  sequenceNumberFailureAlert = false;

  isComingFromProcurement = false;
  backToBackPurchaseNumber = '';
  expensesUploadedFile = [];
  customerCreditDays = 0;

  saveData = async () => {
    const InsertDoc = this.items;
    InsertDoc.updatedAt = Date.now();

    const db = await Db.get();
    db.expensecategories
      .insert(InsertDoc)
      .then((data) => {
        console.log('data Inserted' + InsertDoc);
      })
      .catch((err) => {
        console.log('Business List Insertion Failed - ', err);
      });
  };

  setCategoryName = (value) => {
    runInAction(() => {
      this.items.CategoryName = value;
    });
  };

  updateCategoryName = (value) => {
    runInAction(() => {
      this.category.category = value;
    });
  };

  updateCategoryExpenseType = (value) => {
    runInAction(() => {
      this.category.expenseType = value;
    });
  };

  setRCMEnable = (value) => {
    runInAction(() => {
      this.expense.posRCMValue = value;
    });
  };
  setITCEnable = (value) => {
    runInAction(() => {
      this.expense.posITCAvailable = value;
    });
  };

  setAmount = (value) => {
    runInAction(() => {
      this.items.amount = value;
    });
  };

  setCustomer = (customer, isNewCustomer) => {
    runInAction(() => {
      this.isNewCustomer = isNewCustomer;
      if (isNewCustomer) {
        this.newCustomerData = customer;
      }
    });
  };

  closeDialog = () => {
    runInAction(() => {
      this.dialogOpen = false;
    });
  };

  generateExpenseId = async () => {
    if (!this.expense.expenseId) {
      const timestamp = Math.floor(Date.now() / 1000);
      const businessData = await Bd.getBusinessData();
      const appId = businessData.posDeviceId;
      const id = _uniqueId('e');
      runInAction(() => {
        this.expense.expenseId = `${id}${appId}${timestamp}`;

        this.expense.businessCity = businessData.businessCity;
        this.expense.businessId = businessData.businessId;
      });
    }
  };

  addNewItem = () => {
    const size = this.item_list.length;
    runInAction(() => {
      let item = new ExpenseItem().defaultValues();
      item.index = size + 1;
      this.item_list.push(item);
    });
  };

  deleteItem = (index) => {
    runInAction(() => {
      this.item_list.splice(index, 1);
    });
  };

  setExpenseItemName = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }
    this.item_list[index].item = value;

    if (this.item_list && this.item_list.length > 0) {
      for (var i = 0; i < this.item_list.length; i++) {
        if (value !== '' && this.item_list[i].item !== '') {
          let billdiscount = this.expense.discountPercentForAllItems
            ? parseFloat(this.expense.discountPercentForAllItems)
            : 0;
          this.item_list[i].discountPercent =
            parseFloat(this.item_list[i].originalDiscountPercent) +
            billdiscount;
          this.item_list[i].discountType = 'percentage';
          this.getAmount(i);
        } else {
          if (parseFloat(this.item_list[i].originalDiscountPercent) > 0) {
            this.item_list[i].discountPercent = parseFloat(
              this.item_list[i].originalDiscountPercent
            );
          } else {
            this.item_list[i].discountPercent = '';
          }
          this.item_list[i].discountType = 'percentage';
          if (this.item_list[i].discountPercent === '') {
            this.item_list[i].discountAmount = '';
            this.item_list[i].discount_amount_per_item = '';
          }
          this.getAmount(i);
        }
      }
    }
  };

  setExpenseDate = (value) => {
    this.expense.date = value;
  };

  setExpenseDueDate = (value) => {
    this.expense.dueDate = value;
  };

  setNotes = (value) => {
    console.log('setNotes::', value);
    this.expense.notes = value;
  };

  // to save expense properties during manual entry from user in add expense popo up
  setExpenseProperty = (property, value) => {
    console.log(value);
    this.category[property] = value;
  };

  setCategoryProperty = (property, value) => {
    console.log(value);
    this.category[property] = value;
  };

  setPrice = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    if (parseFloat(value) >= 0) {
      this.item_list[index].price_before_tax = parseFloat(value);
      this.item_list[index].price = parseFloat(value);

      if (this.item_list[index].quantity === 0) {
        this.item_list[index].quantity = 1;
      }

      this.getAmount(index);
    } else {
      this.item_list[index].price_before_tax = value ? parseFloat(value) : '';
      this.item_list[index].price = value ? parseFloat(value) : '';
    }
  };

  get getTotalAmount() {
    if (!this.item_list) {
      return 0;
    }

    let totalGST = 0;
    const returnValue = this.item_list.reduce((a, b) => {
      const amount = toJS(b.amount);
      const cgst_amount = toJS(b.cgst_amount);
      const sgst_amount = toJS(b.sgst_amount);

      if (!Number.isNaN(amount)) {
        a = parseFloat(a) + parseFloat(amount);
      }

      totalGST =
        parseFloat(totalGST) +
        parseFloat(cgst_amount) +
        parseFloat(sgst_amount);

      return a;
    }, 0);

    const overallTotalAmount = returnValue || 0;

    if (this.expense.reverseChargeEnable) {
      this.setReverseChargeValue(totalGST);
    } else {
      this.setReverseChargeValue(0);
    }

    if (parseFloat(returnValue)) {
      this.expense.sub_total = parseFloat(returnValue).toFixed(2);
    } else {
      this.expense.sub_total = parseFloat(0);
    }

    let discountAmount = 0;
    const discountType = this.expense.discountType;

    if (discountType === 'percentage') {
      let percentage = parseFloat(this.expense.discountPercent || 0);

      discountAmount = parseFloat((overallTotalAmount * percentage) / 100 || 0);

      this.expense.discountAmount = discountAmount;
    } else if (discountType === 'amount') {
      discountAmount = parseFloat(this.expense.discountAmount || 0);

      this.expense.discountPercent =
        Math.round(((discountAmount / overallTotalAmount) * 100 || 0) * 100) /
        100;
    }

    let totalAmount =
      overallTotalAmount -
      discountAmount +
      (this.expense.shippingCharge || 0) +
      (this.expense.packageCharge || 0);

    let totalTaxableAmount = 0;
    for (let item of this.item_list) {
      let taxableAmount =
        parseFloat(item.amount) -
        (parseFloat(item.cgst_amount) || 0) -
        (parseFloat(item.sgst_amount) || 0) -
        (parseFloat(item.igst_amount) || 0);

      totalTaxableAmount = totalTaxableAmount + parseFloat(taxableAmount);
    }

    let tcsAmount = 0;
    let tdsAmount = 0;

    if (this.expense.tcsRate > 0) {
      tcsAmount = (totalAmount * this.expense.tcsRate) / 100;
      this.expense.tcsAmount = tcsAmount;
    }

    if (this.expense.tdsRate > 0) {
      tdsAmount = (totalTaxableAmount * this.expense.tdsRate) / 100;
      this.expense.tdsAmount = tdsAmount;
    }

    totalAmount = totalAmount + tcsAmount;

    if (this.expense.isRoundOff) {
      let beforeRoundTotalAmount = totalAmount;

      if (this.roundingConfiguration === 'Nearest 50') {
        totalAmount = Math.round(totalAmount);
      } else if (this.roundingConfiguration === 'Upward Rounding') {
        totalAmount = Math.ceil(totalAmount);
      } else if (this.roundingConfiguration === 'Downward Rounding') {
        totalAmount = Math.floor(totalAmount);
      }

      runInAction(() => {
        this.expense.roundAmount = parseFloat(
          parseFloat(totalAmount) - parseFloat(beforeRoundTotalAmount)
        ).toFixed(2);
      });
    } else {
      this.expense.roundAmount = 0;
    }

    runInAction(() => {
      this.expense.total = totalAmount;
    });

    return parseFloat(this.expense.total).toFixed(2);
  }

  calculateDiscountAmount(tempAmount) {
    let discountAmount = 0;

    tempAmount =
      tempAmount +
      parseFloat(this.expense.packageCharge) +
      parseFloat(this.expense.shippingCharge);

    const discountType = this.expense.discountType;
    if (discountType === 'percentage') {
      let percentage = this.expense.discountPercent;

      if (percentage !== '') {
        discountAmount = parseFloat((tempAmount * percentage) / 100) || 0;
        runInAction(() => {
          this.expense.discountAmount = discountAmount || 0;
        });
      }
    } else if (discountType === 'amount') {
      discountAmount = this.expense.discountAmount;
      runInAction(() => {
        if (discountAmount !== '') {
          this.expense.discountPercent =
            Math.round((discountAmount / tempAmount) * 100 * 100) / 100 || 0;
        }
      });
    }

    return discountAmount;
  }

  setPaymentType = (value) => {
    this.expense.paymentType = value;
  };

  toggleRoundOff = () => {
    if (!this.expense) {
      return;
    }
    this.expense.isRoundOff = !this.expense.isRoundOff;

    console.log(this.expense.isRoundOff);
  };

  setQuantity = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    if (parseFloat(value) > 0) {
      runInAction(() => {
        this.item_list[index].quantity = value ? parseFloat(value) : '';
      });
      this.getAmount(index);
    } else {
      this.item_list[index].quantity = '';
      this.item_list[index].amount = 0;
    }
  };

  setFreeQuantity = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }
    if (parseFloat(value) > 0) {
      this.item_list[index].freeQty = value ? parseFloat(value) : '';
    } else {
      this.item_list[index].freeQty = '';
    }
    this.getAmount(index);
  };

  setHsn = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    this.item_list[index].hsn = value;
  };

  get getRoundedAmount() {
    if (!this.expense.isRoundOff) {
      return 0;
    }

    if (!isNaN(this.expense.roundAmount)) {
      return this.expense.roundAmount;
    } else {
      return 0;
    }
  }

  deleteExpenseCategory = async (item) => {
    console.log('delete clicked::', item);
    const db = await Db.get();

    /**
     * check expese txn's
     */

    const businessData = await Bd.getBusinessData();

    const expenses_query = db.expenses.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryId: { $eq: item.categoryId } }
        ]
      }
    });

    await expenses_query
      .exec()
      .then(async (data) => {
        if (!data) {
          const businessData = await Bd.getBusinessData();

          const query = db.expensecategories.find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { categoryId: { $eq: item.categoryId } }
              ]
            }
          });

          await query
            .remove()
            .then((data) => {
              console.log('expense category removed' + data);

              var matchedIndex = this.categoryList.findIndex(
                (x) => x.categoryId === item.categoryId
              );

              if (matchedIndex >= 0) {
                this.categoryList.splice(matchedIndex, 1);
                this.category = this.categoryDefault;
              }
            })
            .catch((error) => {
              console.log('deletion Failed ' + error);
              // alert('Error in Removing Data');
            });
          // No purchase data is found so cannot update any information
          return;
        }
        alert(
          'Expenses category having Transactions please delete them before deleting Category'
        );
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  deleteExpense = async (item) => {
    let DeleteDataDoc = {
      transactionId: '',
      sequenceNumber: '',
      transactionType: '',
      createdDate: '',
      total: 0,
      balance: 0,
      data: ''
    };

    DeleteDataDoc.transactionId = item.expenseId;
    DeleteDataDoc.sequenceNumber = item.billNumber;
    DeleteDataDoc.transactionType = 'Expenses';
    DeleteDataDoc.data = JSON.stringify(item);
    DeleteDataDoc.total = item.total;
    DeleteDataDoc.balance = item.balance;
    DeleteDataDoc.createdDate = item.date;

    await deleteTxn.addDeleteEvent(DeleteDataDoc);

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.expenses.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { expenseId: { $eq: item.expenseId } }
        ]
      }
    });

    await allTxn.deleteTxnFromExpense(item, db);

    await query
      .remove()
      .then((data) => {
        console.log('data removed' + data);

        const matchedIndex = this.categoryList.findIndex(
          (x) => x.categoryId === item.categoryId
        );

        if (matchedIndex >= 0) {
          this.expenseList.splice(matchedIndex, 1);
        }
        this.changeInExpense = true;
      })
      .catch((error) => {
        console.log('deletion Failed ' + error);
        // alert('Error in Removing Data');
      });
  };

  viewExpenseCategory = async (item) => {
    console.log('view or edit clicked::', item);

    console.log('edit::', item);
    this.isUpdateCategory = true;

    const cat = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      categoryId: item.categoryId,
      category: item.category,
      expenseType: item.expenseType,
      amount: item.amount,
      updatedAt: Date.now()
    };
    this.category = cat;

    console.log('this.category::', this.category);

    this.handleViewCategoryModelOpen();
  };

  handleViewCategoryModelOpen = () => {
    this.viewCategoryDialogOpen = true;
  };

  viewOrEditExpenseItem = async (item) => {
    this.viewOrEditItem(item);
  };

  viewOrEditItem = async (item) => {
    this.isUpdate = true;

    this.item_list = item.item_list;
    const exp = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      expenseId: item.expenseId,
      categoryId: item.categoryId,
      date: item.date,
      paymentType: item.paymentType,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      total: item.total,
      notes: item.notes,
      isRoundOff: item.isRoundOff,
      roundAmount: item.roundAmount,
      updatedAt: Date.now(),
      paymentReferenceNumber: item.paymentReferenceNumber,
      billNumber: item.billNumber,
      packageCharge: item.packageCharge,
      shippingCharge: item.shippingCharge,
      placeOfSupply: item.placeOfSupply,
      placeOfSupplyName: item.placeOfSupplyName,
      discountPercent: item.discountPercent,
      discountAmount: item.discountAmount,
      discountType: item.discountType,
      is_credit: item.is_credit,
      linked_amount: item.linked_amount,
      balance: item.balance,
      reverseChargeEnable: item.reverseChargeEnable,
      reverseChargeValue: item.reverseChargeValue,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      vendor_phone_number: item.vendor_phone_number,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      sub_total: item.sub_total,
      vendorPanNumber: item.vendorPanNumber,
      tcsAmount: item.tcsAmount,
      tcsName: item.tcsName,
      tcsRate: item.tcsRate,
      tcsCode: item.tcsCode,
      tdsAmount: item.tdsAmount,
      tdsName: item.tdsName,
      tdsRate: item.tdsRate,
      tdsCode: item.tdsCode,
      splitPaymentList: item.splitPaymentList,
      expenseType: item.expenseType,
      isSyncedToServer: item.isSyncedToServer,
      invoiceStatus: item.invoiceStatus,
      tallySyncedStatus: item.tallySyncedStatus,
      tallySynced: item.tallySynced,
      categoryName: item.categoryName,
      adjustVendorBalance: item.adjustVendorBalance,
      dueDate: item.dueDate,
      discountPercentForAllItems: item.discountPercentForAllItems,
      portalITCAvailable: item.portalITCAvailable,
      posITCAvailable: item.posITCAvailable,
      portalRCMValue: item.portalRCMValue,
      posRCMValue: item.posRCMValue,
      itcReversed: item.itcReversed,
      fromPortal: item.fromPortal,
      imageUrls: item.imageUrls
    };

    //get category from category table
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.expensecategories.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryId: { $eq: item.categoryId } }
        ]
      }
    });

    await query
      .exec()
      .then(async (data) => {
        if (!data) {
          return;
        }

        exp.category = data.category;
        this.expense = exp;

        let taxData = await taxSettings.getTaxSettingsDetails();
        if (taxData && taxData.gstin && taxData.gstin !== '') {
          let businessStateCode = taxData.gstin.slice(0, 2);
          if (item.vendor_gst_number && item.vendor_gst_number !== '') {
            let customerExtractedStateCode = item.vendor_gst_number.slice(0, 2);
            if (
              businessStateCode !== '' &&
              customerExtractedStateCode !== '' &&
              businessStateCode === customerExtractedStateCode
            ) {
              this.setCGSTSGSTEnabledByPOS(true);
            } else {
              this.setCGSTSGSTEnabledByPOS(false);
            }
          } else if (item.vendorState && item.vendorState !== '') {
            let result = getStateList().find(
              (e) => e.code === businessStateCode
            );
            if (result) {
              let businessState = result.name;
              if (
                item.vendorState !== '' &&
                item.vendorState !== null &&
                businessState !== '' &&
                businessState !== null &&
                item.vendorState.toLowerCase() === businessState.toLowerCase()
              ) {
                this.setCGSTSGSTEnabledByPOS(true);
              } else {
                this.setCGSTSGSTEnabledByPOS(false);
              }
            }
          }
        }

        if (this.expense.paymentType === 'Split') {
          this.chosenPaymentType = 'Split';
        } else {
          this.chosenPaymentType = 'Cash';
        }

        this.existingExpense = exp;
        this.categoryDialogOpen = false;
        this.addExpensesDialogue = true;
        this.isComingFromProcurement = false;
        this.isAutoGenMode = true;
      })
      .catch((err) => {
        console.log('data insersion failed::', err);
      });
  };

  raiseExpenseForProcurement = async (
    vendor,
    productName,
    amount,
    backToBackPurchaseNumber
  ) => {
    this.expense = this.expenseDefault;
    this.chosenPaymentType = 'Cash';
    this.isCGSTSGSTEnabledByPOS = true;
    this.isComingFromProcurement = true;
    this.backToBackPurchaseNumber = backToBackPurchaseNumber;
    this.generateExpenseId();

    runInAction(() => {
      this.expense.vendor_id = vendor.vendor_id;
      this.expense.vendor_name = vendor.vendor_name;
      this.expense.vendor_gst_number = vendor.vendor_gst_number;
      this.expense.vendor_gst_type = vendor.vendor_gst_type;
      this.expense.vendor_phone_number = vendor.vendor_phone_number;
      this.expense.vendorCity = vendor.vendorCity;
      this.expense.vendorPincode = vendor.vendorPincode;
      this.expense.vendorAddress = vendor.vendorAddress;
      this.expense.vendorState = vendor.vendorState;
      this.expense.vendorCountry = vendor.vendorCountry;
      this.expense.vendor_email_id = vendor.vendor_email_id;
      this.expense.vendorPanNumber = vendor.vendorPanNumber;

      if (
        this.expenseTransSettingData &&
        this.expenseTransSettingData.enableTDS
      ) {
        this.expense.tdsName = vendor.tdsName;
        this.expense.tdsRate = vendor.tdsRate;
        this.expense.tdsCode = vendor.tdsCode;
      }
    });

    if (this.categoryList && this.categoryList.length === 0) {
      await this.getCategoryListIfEmpty(
        dateHelper.getFinancialYearStartDate(),
        dateHelper.getFinancialYearEndDate()
      );
    }

    this.item_list = [];
    this.item_list.push({
      index: 1,
      item: productName,
      quantity: 1,
      amount: 0,
      price: amount,
      price_before_tax: amount,
      isEdit: true,
      hsn: '',
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      taxType: '',
      igst_amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      taxIncluded: false,
      discountPercent: 0,
      discountAmount: 0,
      discount_amount_per_item: 0,
      discountType: '',
      freeQty: 0,
      originalDiscountPercent: 0
    });

    this.getAmount(0);

    this.addExpensesDialogue = true;
    this.isAutoGenMode = true;
    this.invoiceData = {};
    this.customerCreditDays = 0;
  };

  // save expense category
  saveCategory = async () => {
    const businessData = await Bd.getBusinessData();

    // generate unique id
    const timestamp = Math.floor(Date.now() / 60000);
    const appId = businessData.posDeviceId;

    const id = _uniqueId('ec');
    this.category.categoryId = `${id}${appId}${timestamp}`;
    this.category.businessCity = businessData.businessCity;
    this.category.businessId = businessData.businessId;
    this.category.updatedAt = Date.now();

    const InsertDoc = this.category;
    InsertDoc.posId = parseFloat(businessData.posDeviceId);

    console.log('dataBase', InsertDoc);
    const db = await Db.get();
    await db.expensecategories
      .insert(InsertDoc)
      .then(() => {
        console.log('category data Inserted');

        this.categoryList.push(InsertDoc);
        this.categoryDialogOpen = false;
      })
      .catch((err) => {
        console.log('data insersion failed::', err);
      });

    this.categoryDialogOpen = false;
  };

  updateCategory = async () => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    const query = db.expensecategories.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryId: { $eq: this.category.categoryId } }
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
              category: this.category.category,
              expenseType: this.category.expenseType,
              updatedAt: Date.now()
            }
          })
          .then(async (data) => {
            console.log('inside updte expense: ', data);

            var matchedIndex = this.categoryList.findIndex(
              (x) => x.categoryId === this.category.categoryId
            );

            if (matchedIndex >= 0) {
              this.categoryList[matchedIndex] = this.category;
            }

            this.category = this.categoryDefault;
            this.viewCategoryDialogOpen = false;
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  setExpensesUploadedFiles = async (files) => {
    this.expensesUploadedFile = files;
  };

  // save single expense
  saveExpense = async (isSaveAndNew) => {
    const db = await Db.get();

    let filteredArray = [];

    for (let item of this.item_list) {
      if (item.item === '') {
        continue;
      }

      this.setDefaultValue(item, 'quantity', 0);
      this.setDefaultValue(item, 'amount', 0);
      this.setDefaultValue(item, 'price', 0);
      this.setDefaultValue(item, 'price_before_tax', 0);
      this.setDefaultValue(item, 'isEdit', true);
      this.setDefaultValue(item, 'cgst', 0);
      this.setDefaultValue(item, 'sgst', 0);
      this.setDefaultValue(item, 'igst', 0);
      this.setDefaultValue(item, 'cess', 0);
      this.setDefaultValue(item, 'igst_amount', 0);
      this.setDefaultValue(item, 'cgst_amount', 0);
      this.setDefaultValue(item, 'sgst_amount', 0);
      this.setDefaultValue(item, 'taxIncluded', false);
      this.setDefaultValue(item, 'discountPercent', 0);
      this.setDefaultValue(item, 'discountAmount', false);
      this.setDefaultValue(item, 'discount_amount_per_item', 0);
      this.setDefaultValue(item, 'freeQty', 0);
      this.setDefaultValue(item, 'originalDiscountPercent', 0);

      filteredArray.push(item);
    }

    this.expense.item_list = filteredArray;
    this.expense.imageUrls = this.expensesUploadedFile;

    const properties = [
      'total',
      'roundAmount',
      'packageCharge',
      'shippingCharge',
      'discountPercent',
      'discountAmount',
      'linked_amount',
      'balance',
      'reverseChargeValue',
      'sub_total',
      'tcsAmount',
      'tcsRate',
      'tdsAmount',
      'tdsRate',
      'discountPercentForAllItems'
    ];

    properties.forEach((property) =>
      this.setDefaultValue(this.expense, property, 0)
    );

    if (this.expense.expenseId === '') {
      this.generateExpenseId();
    }

    if (
      this.isAutoGenMode &&
      (this.expense.billNumber === '' || this.expense.billNumber === undefined)
    ) {
      await this.getSequenceNumber(this.expense.date, this.expense.expenseId);

      if (this.isAutoGenMode && this.expense.billNumber === '0') {
        this.expense.billNumber = '';
        this.handleCloseExpenseLoadingMessage();
        this.handleOpenSequenceNumberFailureAlert();
        return;
      }
    }

    if (
      this.expense.splitPaymentList &&
      this.expense.splitPaymentList.length > 0
    ) {
      for (let i = 0; i < this.expense.splitPaymentList.length; i++) {
        this.expense.splitPaymentList[i].amount =
          parseFloat(this.expense.splitPaymentList[i].amount) || 0;
      }
    }

    if (this.chosenPaymentType === 'Split') {
      this.expense.paymentType = this.chosenPaymentType;
    }

    if (
      !('adjustVendorBalance' in this.expense) ||
      !this.expense.adjustVendorBalance
    ) {
      this.expense.adjustVendorBalance = true;
    }

    console.log('this.expense', this.expense);

    const InsertDoc = this.expense;
    const businessData = await Bd.getBusinessData();
    InsertDoc.posId = parseFloat(businessData.posDeviceId);

    InsertDoc.updatedAt = Date.now();

    delete InsertDoc['category'];

    if (this.isUpdate) {
      await this.updateExpenseData(db, isSaveAndNew);
    } else {
      this.expense.balance = this.getBalanceData;

      if (
        !('adjustVendorBalance' in this.expense) ||
        !this.expense.adjustVendorBalance
      ) {
        /**
         * update vendor balance based
         * linked amount + balance amount
         */
        const money_to_be_credited =
          parseFloat(this.expense.linked_amount) ||
          0 + parseFloat(this.expense.balance) ||
          0;

        if (parseFloat(money_to_be_credited) > 0) {
          // await balanceUpdate.incrementBalance(
          //   db,
          //   this.expense.vendor_id,
          //   money_to_be_credited
          // );
        }
      }

      try {
        /**
         * add employee information
         */
        InsertDoc.employeeId = JSON.parse(
          localStorage.getItem('loginDetails')
        ).username;
      } catch (e) {
        console.error(' Error: ', e.message);
      }

      let userAction = 'Save';

      if (this.isRestore) {
        userAction = 'Restore';
        await this.markExpenseRestored();
      }

      //update alltxn table
      const receiptOrPayment = await allTxn.saveTxnFromExpense(InsertDoc, db);

      InsertDoc.receiptOrPayment = receiptOrPayment;

      //save to audit
      audit.addAuditEvent(
        InsertDoc.expenseId,
        InsertDoc.billNumber,
        'Expenses',
        userAction,
        JSON.stringify(InsertDoc),
        '',
        InsertDoc.date
      );
      await db.expenses
        .insert(InsertDoc)
        .then(async (data) => {
          console.log('expense data Inserted::', data);

          if (this.isComingFromProcurement) {
            await this.updateExpenseIdInProcurement(this.expense.expenseId);
          }

          this.handleCloseExpenseLoadingMessage();
          if (!isSaveAndNew) {
            this.handleAddExpensesModalClose();
          }
          this.expense = this.expenseDefault;
          this.expense.category = this.category.category;
          this.expense.categoryId = this.category.categoryId;
          this.item_list = this.item_list_default;
          this.isExpenseList = true;
          this.changeInExpense = true;
        })
        .catch((err) => {
          console.log('expense data insersion Failed::', err);

          //save to audit
          audit.addAuditEvent(
            InsertDoc.expenseId,
            InsertDoc.billNumber,
            'Expenses',
            userAction,
            JSON.stringify(InsertDoc),
            err.message,
            InsertDoc.date
          );

          this.handleCloseExpenseLoadingMessage();
          this.handleOpenExpenseErrorAlertMessage();
        });
    }
  };

  setDefaultValue = async (item, property, defaultValue) => {
    if (
      item[property] === null ||
      item[property] === '' ||
      item[property] === undefined ||
      Number.isNaN(item[property])
    ) {
      item[property] = defaultValue;
    }
  };

  updateExpenseData = async (db, isSaveAndNew) => {
    const businessData = await Bd.getBusinessData();

    const query = db.expenses.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { expenseId: { $eq: this.expense.expenseId } }
        ]
      }
    });

    if (
      !('adjustVendorBalance' in this.expense) ||
      !this.expense.adjustVendorBalance
    ) {
      let putMoneyToVendor = false;
      let putMoneyToVendorAmount = 0;
      let getMoneyFromVendor = false;
      let getMoneyFromVendorAmount = 0;

      //1)status is "Paid"
      if (!this.expense.is_credit || parseFloat(this.expense.balance) === 0) {
        if (this.existingExpense.balance > 0) {
          getMoneyFromVendor = true;
        }

        if (getMoneyFromVendor) {
          getMoneyFromVendorAmount =
            this.existingExpense.balance + this.existingExpense.linked_amount;
        }

        if (parseFloat(this.expense.balance) > 0) {
          putMoneyToVendor = true;
        }

        if (putMoneyToVendor) {
          putMoneyToVendorAmount =
            parseFloat(this.expense.balance) ||
            0 + parseFloat(this.expense.linked_amount) ||
            0;
        }
      } else if (
        // status is Credit

        this.expense.is_credit ||
        parseFloat(this.expense.balance) > 0
      ) {
        if (parseFloat(this.existingExpense.balance) > 0) {
          getMoneyFromVendor = true;
        }

        if (getMoneyFromVendor) {
          getMoneyFromVendorAmount =
            parseFloat(this.existingExpense.balance) ||
            0 + parseFloat(this.existingExpense.linked_amount) ||
            0;
        }

        if (parseFloat(this.expense.balance) > 0) {
          putMoneyToVendor = true;
        }

        if (putMoneyToVendor) {
          putMoneyToVendorAmount =
            parseFloat(this.expense.balance) ||
            0 + parseFloat(this.expense.linked_amount) ||
            0;
        }
      }

      /**
       * clear balance by subtrcting get money and put money
       * since there is an issue with server sync
       */
      if (getMoneyFromVendor && putMoneyToVendor) {
        const finalBalance =
          parseFloat(putMoneyToVendorAmount) -
          parseFloat(getMoneyFromVendorAmount);

        if (finalBalance < 0) {
          putMoneyToVendor = false;
          getMoneyFromVendorAmount = Math.abs(finalBalance);
        } else if (finalBalance > 0) {
          getMoneyFromVendor = false;
          putMoneyToVendorAmount = Math.abs(finalBalance);
        } else {
          getMoneyFromVendor = false;
          putMoneyToVendor = false;
        }
      }

      if (getMoneyFromVendor && getMoneyFromVendorAmount > 0) {
        // await balanceUpdate.decrementBalance(
        //   db,
        //   this.existingExpense.vendor_id,
        //   getMoneyFromVendorAmount
        // );
      }

      if (putMoneyToVendor && putMoneyToVendorAmount > 0) {
        // await balanceUpdate.incrementBalance(
        //   db,
        //   this.expense.vendor_id,
        //   putMoneyToVendorAmount
        // );
      }
    }

    const receiptOrPayment = await allTxn.deleteAndSaveTxnFromExpense(
      this.existingExpense,
      this.expense,
      db
    );

    this.expense.receiptOrPayment = receiptOrPayment;

    //save to audit
    audit.addAuditEvent(
      this.expense.expenseId,
      this.expense.billNumber,
      'Expenses',
      'Update',
      JSON.stringify(this.expense),
      '',
      this.expense.date
    );

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
              categoryId: this.expense.categoryId,
              date: this.expense.date,
              paymentType: this.expense.paymentType,
              bankAccount: this.expense.bankAccount,
              bankAccountId: this.expense.bankAccountId,
              bankPaymentType: this.expense.bankPaymentType,
              total: parseFloat(this.expense.total),
              notes: this.expense.notes,
              updatedAt: Date.now(),
              isRoundOff: this.expense.isRoundOff,
              roundAmount: parseFloat(this.expense.roundAmount),
              item_list: this.item_list,
              paymentReferenceNumber: this.expense.paymentReferenceNumber,
              billNumber: this.expense.billNumber,
              packageCharge: this.expense.packageCharge,
              shippingCharge: this.expense.shippingCharge,
              placeOfSupply: this.expense.placeOfSupply,
              placeOfSupplyName: this.expense.placeOfSupplyName,
              discountPercent: this.expense.discountPercent,
              discountAmount: this.expense.discountAmount,
              discountType: this.expense.discountType,
              is_credit: this.expense.is_credit,
              linked_amount: this.expense.linked_amount,
              balance: this.expense.balance,
              reverseChargeEnable: this.expense.reverseChargeEnable,
              reverseChargeValue: this.expense.reverseChargeValue,
              vendor_id: this.expense.vendor_id,
              vendor_name: this.expense.vendor_name,
              vendor_gst_number: this.expense.vendor_gst_number,
              vendor_gst_type: this.expense.vendor_gst_type,
              vendor_payable: this.expense.vendor_payable,
              vendor_phone_number: this.expense.vendor_phone_number,
              vendorCity: this.expense.vendorCity,
              vendorPincode: this.expense.vendorPincode,
              vendorAddress: this.expense.vendorAddress,
              vendorState: this.expense.vendorState,
              vendorCountry: this.expense.vendorCountry,
              vendor_email_id: this.expense.vendor_email_id,
              sub_total: this.expense.sub_total,
              vendorPanNumber: this.expense.vendorPanNumber,
              tcsAmount: this.expense.tcsAmount,
              tcsName: this.expense.tcsName,
              tcsRate: this.expense.tcsRate,
              tcsCode: this.expense.tcsCode,
              tdsAmount: this.expense.tdsAmount,
              tdsName: this.expense.tdsName,
              tdsRate: this.expense.tdsRate,
              tdsCode: this.expense.tdsCode,
              splitPaymentList: this.expense.splitPaymentList,
              expenseType: this.expense.expenseType,
              isSyncedToServer: this.expense.isSyncedToServer,
              invoiceStatus: this.expense.invoiceStatus,
              tallySyncedStatus: this.expense.tallySyncedStatus,
              tallySynced: this.expense.tallySynced,
              categoryName: this.expense.categoryName,
              adjustVendorBalance: this.expense.adjustVendorBalance,
              dueDate: this.expense.dueDate,
              portalITCAvailable: this.expense.portalITCAvailable,
              posITCAvailable: this.expense.posITCAvailable,
              portalRCMValue: this.expense.portalRCMValue,
              posRCMValue: this.expense.posRCMValue,
              itcReversed: this.expense.itcReversed,
              fromPortal: this.expense.fromPortal,
              receiptOrPayment: this.expense.receiptOrPayment
            }
          })
          .then(async () => {
            console.log('inside updte expense');

            if (this.isComingFromProcurement) {
              await this.updateExpenseIdInProcurement(this.expense.expenseId);
            }

            this.handleCloseExpenseLoadingMessage();

            if (!isSaveAndNew) {
              this.handleAddExpensesModalClose();
            }

            this.expense = this.expenseDefault;
            this.expense.category = this.category.category;
            this.expense.categoryId = this.category.categoryId;
            this.item_list = this.item_list_default;
            this.isUpdate = false;
            this.expenseList = true;
            this.changeInExpense = true;
          });
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
        //save to audit
        audit.addAuditEvent(
          this.expense.expenseId,
          this.expense.billNumber,
          'Expenses',
          'Update',
          JSON.stringify(this.expense),
          err.message,
          this.expense.date
        );

        this.handleCloseExpenseLoadingMessage();
        this.handleOpenExpenseErrorAlertMessage();
      });
  };

  setSelectedCategory = async (row) => {
    this.category = row;
    this.currentSelectedCategory = row;

    //below variable is temporary fix
    if (this.changeInCategory) {
      this.changeInCategory = false;
    } else {
      this.changeInCategory = true;
    }
  };

  // get all Expenses data
  getExpensesList = async (fromDate, toDate) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    const result = [];

    let query;

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
          }
        ]
      }
    });

    await query.exec().then(async (data) => {
      if (!data) {
        // No expenses data is available
        return;
      }

      data.forEach((item) => {
        const { categoryId, total } = item;

        const index = result.findIndex((obj) => obj.categoryId === categoryId);

        if (index === -1) {
          result.push({ categoryId, total });
        } else {
          result[index].total += parseFloat(total);
        }
      });
    });
    return result;
  };

  getExpensesCount = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.expenses.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query
      .exec()
      .then((data) => {
        console.log('data::', data);
        this.isExpenseList = data.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  resetCategoryList = () => {
    this.categoryList = [];
  };

  getCategoryList = async (fromDate, toDate) => {
    this.expenseList = [];
    this.currentSelectedCategory = {};
    this.category = {};
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    this.categoryList = [];

    const query = db.expensecategories.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      let categoryDataList = data.map((item) => item.toJSON());

      let categoryAmountList = await this.getExpensesList(fromDate, toDate);

      if (!categoryAmountList) {
        categoryAmountList = [];
      }
      categoryDataList.forEach((category) => {
        const { categoryId } = category;

        const matchingResult = categoryAmountList.find(
          (item) => item.categoryId === categoryId
        );

        if (matchingResult) {
          category.amount = matchingResult.total;
        }
      });

      this.categoryList = categoryDataList;
      this.changeInExpense = false;
    });
  };

  getCategoryListIfEmpty = async (fromDate, toDate) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    this.categoryList = [];

    const query = db.expensecategories.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe(async (data) => {
      if (!data) {
        // No customer is available
        return;
      }

      let categoryDataList = data.map((item) => item.toJSON());

      let categoryAmountList = await this.getExpensesList(fromDate, toDate);

      if (!categoryAmountList) {
        categoryAmountList = [];
      }
      categoryDataList.forEach((category) => {
        const { categoryId } = category;

        const matchingResult = categoryAmountList.find(
          (item) => item.categoryId === categoryId
        );

        if (matchingResult) {
          category.amount = matchingResult.total;
        }
      });

      this.categoryList = categoryDataList;
    });
  };

  // get single Expense data
  getExpenser = async (id) => {
    const businessData = await Bd.getBusinessData();
    const db = await Db.get();

    const query = db.expenses.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { expenseId: { $eq: id } }
        ]
      }
    });

    query
      .exec()
      .then((data) => {
        this.expense = data.map((item) => item.toJSON());
      })
      .catch((err) => {
        console.log('Internal Server Error', err);
      });
  };

  // to handle add expense popup
  handleExpenseModalOpen = () => {
    this.expense = this.expenseDefault;
    this.chosenPaymentType = 'Cash';
    this.isCGSTSGSTEnabledByPOS = true;
    this.expenseDialogOpen = true;
    this.invoiceData = {};
    this.customerCreditDays = 0;
  };

  // to hanle close expense popup
  handleExpenseModalClose = () => {
    this.expenseDialogOpen = false;
  };

  handleCategoryModalOpen = () => {
    this.category = this.categoryDefault;
    this.categoryDialogOpen = true;
  };

  handleViewCategoryModalOpen = () => {
    this.viewCategoryDialogOpen = true;
  };

  // to hanle close expense popup
  handleCategoryModalClose = () => {
    console.log('clicked category dialoge close');
    if (this.categoryList.length > 0) {
      this.category = this.categoryList[0];
    } else {
      this.category['category'] = '';
    }
    this.categoryDialogOpen = false;
  };

  handleViewCategoryModalClose = () => {
    this.viewCategoryDialogOpen = false;
  };

  handleAddExpensesModalClose = () => {
    console.log('clicked category dialoge close');
    this.addExpensesDialogue = false;
    this.isComingFromProcurement = false;
    this.expense = this.expenseDefault;
    this.item_list = this.item_list_default;
  };

  setSelectedCategoryId = (name) => {
    this.expense.categoryId = name;
  };

  setSelectedCategoryName = (name) => {
    this.expense.category = name;
    this.expense.categoryName = name;
  };

  handleAddexpensesModalOpen = () => {
    this.addExpensesDialogue = true;
    this.isAutoGenMode = true;
    this.isComingFromProcurement = false;
    this.chosenPaymentType = 'Cash';
    this.isCGSTSGSTEnabledByPOS = true;
    this.invoiceData = {};
    this.customerCreditDays = 0;
    this.generateExpenseId();
  };

  setEditTable = (index, value) => {
    if (index && value) {
      if (this.item_list[index]) {
        this.item_list[index].isEdit = value;
      }
    }
  };

  setPaymentMode = (value) => {
    this.expense.bankPaymentType = value;
  };

  setBankAccountData = (value, chosenType) => {
    this.expense.paymentType = chosenType;
    this.expense.bankAccount = value.accountDisplayName;
    this.expense.bankAccountId = value.id;
  };

  setPaymentReferenceNumber = (value) => {
    this.expense.paymentReferenceNumber = value;
  };

  setTaxSettingsData = (value) => {
    this.taxSettingsData = value;
  };

  setExpenseTxnEnableFieldsMap = (expenseTransSettingData) => {
    this.expenseTransSettingData = expenseTransSettingData;

    this.expenseTxnEnableFieldsMap = new Map();
    if (expenseTransSettingData.businessId.length > 2) {
      const productLevel = expenseTransSettingData.enableOnTxn.productLevel;
      productLevel.map((item) => {
        if (this.expenseTxnEnableFieldsMap.has(item.name)) {
          this.expenseTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.expenseTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      const billLevel = expenseTransSettingData.enableOnTxn.billLevel;
      billLevel.map((item) => {
        if (this.expenseTxnEnableFieldsMap.has(item.name)) {
          this.expenseTxnEnableFieldsMap.set(item.name, item.enabled);
        } else {
          this.expenseTxnEnableFieldsMap.set(item.name, item.enabled);
        }
      });

      if (
        !this.isUpdate &&
        this.expenseTxnEnableFieldsMap.get('enable_roundoff_default')
      ) {
        this.expense.isRoundOff = true;
      }
    }
  };

  setCGST = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    this.item_list[index].cgst = value ? parseFloat(value) : '';
    this.item_list[index].sgst = value ? parseFloat(value) : '';

    this.getAmount(index);
  };

  setSGST = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    this.item_list[index].cgst = value ? parseFloat(value) : '';
    this.item_list[index].sgst = value ? parseFloat(value) : '';

    this.getAmount(index);
  };

  setIGST = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    this.item_list[index].igst = value ? parseFloat(value) : '';
    this.getAmount(index);
  };

  setCess = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    this.item_list[index].cess = value ? value : '';

    this.getAmount(index);
  };

  getAmount = async (index) => {
    const quantity =
      parseFloat(this.item_list[index].quantity) ||
      (this.item_list[index].freeQty ? 0 : 1);
    // GST should be calculated after applying the discount product level

    if (quantity > 0) {
      await this.calculateTaxAndDiscountValue(index);
    }

    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    let cgst_amount = 0;
    let sgst_amount = 0;
    let igst_amount = 0;
    let cess = 0;
    cgst_amount = parseFloat(this.item_list[index].cgst_amount || 0);
    sgst_amount = parseFloat(this.item_list[index].sgst_amount || 0);
    igst_amount = parseFloat(this.item_list[index].igst_amount || 0);
    cess = parseFloat(this.item_list[index].cess || 0);

    const discount_amount = parseFloat(
      this.item_list[index].discountAmount || 0
    );
    const amount_before_tax = parseFloat(
      this.item_list[index].price_before_tax
    );

    const finalAmount = parseFloat(
      amount_before_tax * quantity -
        discount_amount +
        cgst_amount +
        sgst_amount +
        igst_amount +
        cess * quantity
    );

    this.item_list[index].amount = Math.round(finalAmount * 100) / 100 || 0;
  };

  calculateTaxAndDiscountValue = async (index) => {
    const amount = parseFloat(this.item_list[index].price || 0);
    const quantity = parseFloat(this.item_list[index].quantity) || 1;

    let tax =
      (parseFloat(this.item_list[index].cgst) || 0) +
      (parseFloat(this.item_list[index].sgst) || 0);
    let igst_tax = parseFloat(this.item_list[index].igst || 0);

    const taxIncluded = this.item_list[index].taxIncluded;

    if (!amount || amount === 0 || !quantity || quantity === 0) {
      return 0;
    }

    let itemPrice = amount;

    let discountAmount = 0;
    /**
     * if discount given at product level then discount logic changes based on
     * whether price is included with tax or eclused with tax
     *
     * if price is included tax then remove tax before calculating the discount
     * if price is excluding the tax then calculate discount on the price directly
     */
    let totalGST = 0;
    let totalIGST = 0;
    let amount_before_tax = 0;

    if (taxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
      totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
    }

    amount_before_tax =
      itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

    let totalItemPriceBeforeTax = parseFloat(amount_before_tax);

    if (this.item_list[index].discountType) {
      totalItemPriceBeforeTax = amount_before_tax * quantity;

      discountAmount = parseFloat(
        this.getItemDiscountAmount(index, totalItemPriceBeforeTax)
      );
    }

    // price before tax
    this.item_list[index].price_before_tax = parseFloat(amount_before_tax);

    let discountAmountPerProduct =
      parseFloat(discountAmount) / parseFloat(quantity);

    //per item dicount is removed from per item
    let itemPriceAfterDiscount = 0;

    itemPriceAfterDiscount = amount_before_tax - discountAmountPerProduct;

    if (discountAmountPerProduct === 0) {
      this.item_list[index].cgst_amount = (totalGST / 2) * quantity;
      this.item_list[index].sgst_amount = (totalGST / 2) * quantity;
      this.item_list[index].igst_amount = totalIGST * quantity;
    }

    await this.calculateTaxAmount(
      index,
      itemPriceAfterDiscount,
      discountAmount
    );
  };

  getItemDiscountAmount = (index, totalPrice) => {
    let discountAmount = 0;
    const discountType = this.item_list[index].discountType;
    if (discountType === 'percentage') {
      let percentage = this.item_list[index].discountPercent || 0;

      discountAmount = parseFloat((totalPrice * percentage) / 100 || 0).toFixed(
        2
      );

      this.item_list[index].discount_amount_per_item =
        parseFloat(discountAmount) / this.item_list[index].quantity;
    } else if (discountType === 'amount') {
      discountAmount =
        this.item_list[index].discount_amount_per_item *
          this.item_list[index].quantity || 0;
      this.item_list[index].discountPercent =
        Math.round(((discountAmount / totalPrice) * 100 || 0) * 100) / 100;
    }

    this.item_list[index].discountAmount = parseFloat(discountAmount);

    return discountAmount;
  };

  calculateTaxAmount = (index, itemPriceAfterDiscount, discountAmount) => {
    let tax =
      (parseFloat(this.item_list[index].cgst) || 0) +
      (parseFloat(this.item_list[index].sgst) || 0);
    let igst_tax = parseFloat(this.item_list[index].igst || 0);
    const quantity = this.item_list[index].quantity;
    const taxIncluded = this.item_list[index].taxIncluded;

    if (!taxIncluded) {
      const totalGST = (itemPriceAfterDiscount * quantity * tax) / 100;
      this.item_list[index].cgst_amount = totalGST / 2;
      this.item_list[index].sgst_amount = totalGST / 2;
      this.item_list[index].igst_amount =
        (itemPriceAfterDiscount * quantity * igst_tax) / 100;
    } else {
      let totalGST = 0;
      let amount = 0;

      if (discountAmount > 0) {
        totalGST = itemPriceAfterDiscount * quantity * (tax / 100);
        this.item_list[index].cgst_amount = totalGST / 2;
        this.item_list[index].sgst_amount = totalGST / 2;

        amount = itemPriceAfterDiscount * (igst_tax / 100);
        this.item_list[index].igst_amount = Math.round(amount * 100) / 100;
      }
    }
  };

  setBillNumber = (value) => {
    this.expense.billNumber = value;
  };

  setDiscountPercentForAllItems = (value) => {
    this.expense.discountPercentForAllItems = value ? parseFloat(value) : '';
    this.expense.discountType = 'percentage';

    if (this.item_list && this.item_list.length > 0) {
      for (var i = 0; i < this.item_list.length; i++) {
        if (value !== '' && this.item_list[i].item !== '') {
          let billdiscount = parseFloat(value);
          this.item_list[i].discountPercent =
            parseFloat(this.item_list[i].originalDiscountPercent) +
            billdiscount;
          this.item_list[i].discountType = 'percentage';
          this.getAmount(i);
        } else {
          if (parseFloat(this.item_list[i].originalDiscountPercent) > 0) {
            this.item_list[i].discountPercent = parseFloat(
              this.item_list[i].originalDiscountPercent
            );
          } else {
            this.item_list[i].discountPercent = '';
          }
          this.item_list[i].discountType = 'percentage';
          if (this.item_list[i].discountPercent === '') {
            this.item_list[i].discountAmount = '';
            this.item_list[i].discount_amount_per_item = '';
          }
          this.getAmount(i);
        }
      }
    }
  };

  setDiscount = (value) => {
    if (!this.expense) {
      return;
    }

    runInAction(() => {
      this.expense.discountType = 'percentage';
      this.expense.discountPercent = value ? parseFloat(value) : '';
    });
  };

  setDiscountAmount = (value) => {
    if (!this.expense) {
      return;
    }

    runInAction(() => {
      this.expense.discountAmount = value ? parseFloat(value) : '';
      this.expense.discountType = 'amount';
    });
  };

  setDiscountType = (value) => {
    if (!this.expense) {
      return;
    }
    runInAction(() => {
      if (value === '%') {
        this.expense.discountType = 'percentage';
      } else {
        this.expense.discountType = 'amount';
      }
    });
  };

  setItemDiscount = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    this.item_list[index].discountPercent = value ? parseFloat(value) : '';
    this.item_list[index].discountType = 'percentage';

    if (this.item_list[index].discountPercent === '') {
      this.item_list[index].discountAmount = '';
      this.item_list[index].discount_amount_per_item = '';
    }
    this.getAmount(index);
  };

  setItemDiscountAmount = (index, value) => {
    if (!this.item_list) {
      return;
    }
    if (!this.item_list[index]) {
      return;
    }

    if (value) {
      let discountPerItem = value ? parseFloat(value) : 0;

      this.item_list[index].discount_amount_per_item =
        parseFloat(discountPerItem);

      this.item_list[index].discountAmount = parseFloat(discountPerItem)
        ? parseFloat(discountPerItem * this.item_list[index].quantity)
        : '';
      this.item_list[index].discountType = 'amount';
    } else {
      this.item_list[index].discountAmount = value ? parseFloat(value) : '';

      if (this.item_list[index].discountAmount === '') {
        this.item_list[index].discountPercent = '';
        this.item_list[index].discount_amount_per_item = '';
      }
    }
    this.getAmount(index);
  };

  setPackingCharge = (value) => {
    runInAction(() => {
      this.expense.packageCharge = value ? parseFloat(value) : '';
    });
  };

  handleSearch = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    await db.expenses
      .find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { billNumber: { $regex: regexp } }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { total: { $eq: parseFloat(value) } }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { date: { $eq: value } }
              ]
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }
        this.expenseList = data.map((item) => item.toJSON());
      })
      .catch((err) => {
        this.expenseList = [];
      });
  };

  setShippingCharge = (value) => {
    runInAction(() => {
      this.expense.shippingCharge = value ? parseFloat(value) : '';
    });
  };

  setTaxIncluded = (index) => {
    if (this.item_list[index].taxIncluded === true) {
      this.item_list[index].taxIncluded = false;
    } else {
      this.item_list[index].taxIncluded = true;
    }

    this.getAmount(index);
  };

  setCreditData = (value) => {
    runInAction(() => {
      this.expense.is_credit = value;
    });

    if (!this.expense.is_credit) {
      runInAction(() => {
        this.expense.balance = 0;
      });
    }
  };

  setReverseChargeEnable = (val) => {
    runInAction(() => {
      this.expense.reverseChargeEnable = val;

      if (val === false) {
        this.expense.reverseChargeValue = 0;
      }
    });
  };

  setReverseChargeValue = (val) => {
    runInAction(() => {
      this.expense.reverseChargeValue = val;
    });
  };

  setPlaceOfSupply = (value) => {
    runInAction(() => {
      this.expense.placeOfSupply = value;
    });
  };

  setPlaceOfSupplyName = (value) => {
    runInAction(() => {
      this.expense.placeOfSupplyName = value;
    });
  };

  setVendorName = (value) => {
    runInAction(() => {
      this.expense.vendor_name = value;
    });
  };

  setVendorId = (value) => {
    runInAction(() => {
      this.expense.vendor_id = value;
    });
  };

  setVendor = async (vendor, isNewVendor) => {
    // console.log('vendor::', vendor);
    if (!vendor) {
      return;
    }
    runInAction(() => {
      this.expense.vendor_id = vendor.id;
      this.expense.vendor_name = vendor.name;
      this.expense.vendor_gst_number = vendor.gstNumber;
      this.expense.vendor_gst_type = vendor.gstType;
      this.expense.vendor_phone_number = vendor.phoneNo;
      this.expense.vendorCity = vendor.city;
      this.expense.vendorPincode = vendor.pincode;
      this.expense.vendorAddress = vendor.address;
      this.expense.vendorState = vendor.state;
      this.expense.vendorCountry = vendor.country;
      this.expense.vendor_email_id = vendor.emailId;
      this.expense.vendorPanNumber = vendor.panNumber;
      this.customerCreditDays = vendor.creditLimitDays;

      if (this.expenseTransSettingData.enableTDS) {
        this.expense.tdsName = vendor.tdsName;
        this.expense.tdsRate = vendor.tdsRate;
        this.expense.tdsCode = vendor.tdsCode;
      }

      this.isNewVendor = isNewVendor;
      if (isNewVendor) {
        this.newVendorData = vendor;
      }
    });
  };

  setTCS = (value) => {
    runInAction(() => {
      this.expense.tcsName = value.name;
      this.expense.tcsRate = value.rate;
      this.expense.tcsCode = value.code;
    });
  };

  revertTCS = () => {
    runInAction(() => {
      this.expense.tcsName = '';
      this.expense.tcsRate = 0;
      this.expense.tcsAmount = 0;
      this.expense.tcsCode = '';
    });
  };

  setTDS = (value) => {
    runInAction(() => {
      this.expense.tdsName = value.name;
      this.expense.tdsRate = value.rate;
    });
  };

  revertTDS = () => {
    runInAction(() => {
      this.expense.tdsName = '';
      this.expense.tdsRate = 0;
      this.expense.tdsAmount = 0;
    });
  };

  get getBalanceData() {
    let balance = 0;
    if (this.expense.is_credit) {
      const total_amount = isNaN(parseFloat(this.getTotalAmount))
        ? 0
        : parseFloat(this.getTotalAmount);

      const linked_amount = isNaN(this.expense.linked_amount)
        ? 0
        : this.expense.linked_amount;

      balance =
        parseFloat(total_amount) -
        // parseFloat(paid_amount || 0) -
        parseFloat(linked_amount);
    }
    runInAction(() => {
      this.expense.balance = parseFloat(balance);
    });

    return balance;
  }

  viewAndRestoreExpenseItem = async (item) => {
    runInAction(() => {
      this.isRestore = true;
      this.isUpdate = false;
      this.invoiceData = {};
      this.customerCreditDays = 0;
      this.item_list = item.item_list;
    });
    const exp = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      expenseId: item.expenseId,
      categoryId: item.categoryId,
      date: item.date,
      paymentType: item.paymentType,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      total: item.total,
      notes: item.notes,
      isRoundOff: item.isRoundOff,
      roundAmount: item.roundAmount,
      updatedAt: Date.now(),
      paymentReferenceNumber: item.paymentReferenceNumber,
      billNumber: item.billNumber,
      packageCharge: item.packageCharge,
      shippingCharge: item.shippingCharge,
      placeOfSupply: item.placeOfSupply,
      placeOfSupplyName: item.placeOfSupplyName,
      discountPercent: item.discountPercent,
      discountAmount: item.discountAmount,
      discountType: item.discountType,
      is_credit: item.is_credit,
      linked_amount: item.linked_amount,
      balance: this.getBalanceData,
      reverseChargeEnable: item.reverseChargeEnable,
      reverseChargeValue: item.reverseChargeValue,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      vendor_phone_number: item.vendor_phone_number,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      sub_total: item.sub_total,
      employeeId: item.employeeId,
      vendorPanNumber: item.vendorPanNumber,
      tcsAmount: item.tcsAmount,
      tcsName: item.tcsName,
      tcsRate: item.tcsRate,
      tcsCode: item.tcsCode,
      tdsAmount: item.tdsAmount,
      tdsName: item.tdsName,
      tdsRate: item.tdsRate,
      tdsCode: item.tdsCode,
      splitPaymentList: item.splitPaymentList,
      expenseType: item.expenseType,
      isSyncedToServer: item.isSyncedToServer,
      invoiceStatus: item.invoiceStatus,
      tallySyncedStatus: item.tallySyncedStatus,
      tallySynced: item.tallySynced,
      categoryName: item.categoryName,
      adjustVendorBalance: item.adjustVendorBalance,
      dueDate: item.dueDate,
      portalITCAvailable: item.portalITCAvailable,
      posITCAvailable: item.posITCAvailable,
      portalRCMValue: item.portalRCMValue,
      posRCMValue: item.posRCMValue,
      itcReversed: item.itcReversed,
      fromPortal: item.fromPortal,
      imageUrls: item.imageUrls
    };

    //get category from category table
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.expensecategories.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryId: { $eq: item.categoryId } }
        ]
      }
    });

    await query
      .exec()
      .then((data) => {
        if (!data) {
          return;
        }

        exp.category = data.category;
        runInAction(() => {
          this.expense = exp;
          if (this.expense.paymentType === 'Split') {
            this.chosenPaymentType = 'Split';
          } else {
            this.chosenPaymentType = 'Cash';
          }
          this.existingExpense = exp;
          this.categoryDialogOpen = false;
        });

        this.handleAddexpensesModalOpen();
      })
      .catch((err) => {
        console.log('data insersion failed::', err);
      });
  };

  restoreExpenseItem = async (item) => {
    this.isRestore = true;
    this.isUpdate = false;

    this.item_list = item.item_list;
    const exp = {
      businessId: item.businessId,
      businessCity: item.businessCity,
      expenseId: item.expenseId,
      categoryId: item.categoryId,
      date: item.date,
      paymentType: item.paymentType,
      bankAccount: item.bankAccount,
      bankAccountId: item.bankAccountId,
      bankPaymentType: item.bankPaymentType,
      total: item.total,
      notes: item.notes,
      isRoundOff: item.isRoundOff,
      roundAmount: item.roundAmount,
      updatedAt: Date.now(),
      paymentReferenceNumber: item.paymentReferenceNumber,
      billNumber: item.billNumber,
      packageCharge: item.packageCharge,
      shippingCharge: item.shippingCharge,
      placeOfSupply: item.placeOfSupply,
      placeOfSupplyName: item.placeOfSupplyName,
      discountPercent: item.discountPercent,
      discountAmount: item.discountAmount,
      discountType: item.discountType,
      is_credit: item.is_credit,
      linked_amount: item.linked_amount,
      balance: this.getBalanceData,
      reverseChargeEnable: item.reverseChargeEnable,
      reverseChargeValue: item.reverseChargeValue,
      vendor_id: item.vendor_id,
      vendor_name: item.vendor_name,
      vendor_gst_number: item.vendor_gst_number,
      vendor_gst_type: item.vendor_gst_type,
      vendor_payable: item.vendor_payable,
      vendor_phone_number: item.vendor_phone_number,
      vendorCity: item.vendorCity,
      vendorPincode: item.vendorPincode,
      vendorAddress: item.vendorAddress,
      vendorState: item.vendorState,
      vendorCountry: item.vendorCountry,
      vendor_email_id: item.vendor_email_id,
      sub_total: item.sub_total,
      employeeId: item.employeeId,
      vendorPanNumber: item.vendorPanNumber,
      tcsAmount: item.tcsAmount,
      tcsName: item.tcsName,
      tcsRate: item.tcsRate,
      tcsCode: item.tcsCode,
      tdsAmount: item.tdsAmount,
      tdsName: item.tdsName,
      tdsRate: item.tdsRate,
      tdsCode: item.tdsCode,
      splitPaymentList: item.splitPaymentList,
      expenseType: item.expenseType,
      isSyncedToServer: item.isSyncedToServer,
      invoiceStatus: item.invoiceStatus,
      tallySyncedStatus: item.tallySyncedStatus,
      tallySynced: item.tallySynced,
      categoryName: item.categoryName,
      adjustVendorBalance: item.adjustVendorBalance,
      dueDate: item.dueDate,
      portalITCAvailable: item.portalITCAvailable,
      posITCAvailable: item.posITCAvailable,
      portalRCMValue: item.portalRCMValue,
      posRCMValue: item.posRCMValue,
      itcReversed: item.itcReversed,
      fromPortal: item.fromPortal,
      imageUrls: item.imageUrls
    };

    //get category from category table
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.expensecategories.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { categoryId: { $eq: item.categoryId } }
        ]
      }
    });

    await query
      .exec()
      .then((data) => {
        if (!data) {
          return;
        }

        exp.category = data.category;
        runInAction(() => {
          this.expense = exp;
          if (this.expense.paymentType === 'Split') {
            this.chosenPaymentType = 'Split';
          } else {
            this.chosenPaymentType = 'Cash';
          }
          this.existingExpense = exp;
          this.categoryDialogOpen = false;
        });
        this.saveExpense(false);
      })
      .catch((err) => {
        console.log('data insersion failed::', err);
      });
  };

  markExpenseRestored = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.alltransactionsdeleted.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { transactionId: { $eq: this.expense.expenseId } }
        ]
      }
    });
    await query
      .remove()
      .then(async (data) => {
        console.log('Deleted data removed' + data);
        runInAction(() => {
          this.expense = {};
        });
      })
      .catch((error) => {
        console.log('Deleted data deletion Failed ' + error);
      });
  };

  handleOpenExpenseLoadingMessage = async () => {
    runInAction(() => {
      this.openExpenseLoadingAlertMessage = true;
    });
  };

  handleCloseExpenseLoadingMessage = async () => {
    runInAction(() => {
      this.openExpenseLoadingAlertMessage = false;
    });
  };

  handleOpenExpenseErrorAlertMessage = async () => {
    runInAction(() => {
      this.openExpenseErrorAlertMessage = true;
    });
  };

  handleCloseExpenseErrorAlertMessage = async () => {
    runInAction(() => {
      this.openExpenseErrorAlertMessage = false;
    });
  };

  setRoundingConfiguration = (value) => {
    runInAction(() => {
      this.roundingConfiguration = value;
    });
  };

  setSplitPaymentSettingsData = (value) => {
    runInAction(() => {
      this.splitPaymentSettingsData = value;
    });
    if (
      !this.isUpdate ||
      (this.expense.splitPaymentList &&
        this.expense.splitPaymentList.length === 0)
    ) {
      this.prepareSplitPaymentList();
    }
  };

  setBankAccountList = (value) => {
    runInAction(() => {
      this.bankAccountsList = value;
    });
  };

  setSplitPayment = (property, index, value) => {
    runInAction(() => {
      this.expense.splitPaymentList[index][property] = value;
    });
  };

  prepareSplitPaymentList = async () => {
    this.expense.splitPaymentList = [];
    const businessData = await Bd.getBusinessData();

    if (this.splitPaymentSettingsData) {
      if (this.splitPaymentSettingsData.cashEnabled) {
        const timestamp = Date.now();
        const appId = businessData.posDeviceId;
        const id = _uniqueId('sp');

        let cashPayment = {
          id: `${id}${appId}${timestamp}`,
          paymentType: 'Cash',
          referenceNumber: '',
          paymentMode: '',
          accountDisplayName: null,
          bankAccountId: null,
          amount: 0
        };
        runInAction(() => {
          this.expense.splitPaymentList.push(cashPayment);
        });
      }

      if (this.splitPaymentSettingsData.giftCardEnabled) {
        if (
          this.splitPaymentSettingsData.giftCardList &&
          this.splitPaymentSettingsData.giftCardList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let giftCardPayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Gift Card',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: null,
            bankAccountId: null,
            amount: 0
          };
          runInAction(() => {
            this.expense.splitPaymentList.push(giftCardPayment);
          });
        }
      }

      if (this.splitPaymentSettingsData.customFinanceEnabled) {
        if (
          this.splitPaymentSettingsData.customFinanceList &&
          this.splitPaymentSettingsData.customFinanceList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let customFinancePayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Custom Finance',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: null,
            bankAccountId: null,
            amount: 0
          };

          runInAction(() => {
            this.expense.splitPaymentList.push(customFinancePayment);
          });
        }
      }

      if (this.splitPaymentSettingsData.bankEnabled) {
        if (
          this.splitPaymentSettingsData.bankList &&
          this.splitPaymentSettingsData.bankList.length > 0 &&
          this.bankAccountsList &&
          this.bankAccountsList.length > 0
        ) {
          const timestamp = Date.now();
          const appId = businessData.posDeviceId;
          const id = _uniqueId('sp');

          let bankPayment = {
            id: `${id}${appId}${timestamp}`,
            paymentType: 'Bank',
            referenceNumber: '',
            paymentMode: '',
            accountDisplayName: '',
            bankAccountId: '',
            amount: 0
          };

          if (this.splitPaymentSettingsData.defaultBankSelected !== '') {
            let bankAccount = this.bankAccountsList.find(
              (o) =>
                o.accountDisplayName ===
                this.splitPaymentSettingsData.defaultBankSelected
            );

            if (bankAccount) {
              bankPayment.accountDisplayName = bankAccount.accountDisplayName;
              bankPayment.bankAccountId = bankAccount.id;
            }
          }
          runInAction(() => {
            this.expense.splitPaymentList.push(bankPayment);
          });
        }
      }
    }
  };

  addSplitPayment = async (type) => {
    const businessData = await Bd.getBusinessData();
    if (type === 'Bank') {
      const timestamp = Date.now();
      const appId = businessData.posDeviceId;
      const id = _uniqueId('sp');

      let bankPayment = {
        id: `${id}${appId}${timestamp}`,
        paymentType: 'Bank',
        referenceNumber: '',
        paymentMode: 'UPI',
        accountDisplayName: '',
        bankAccountId: '',
        amount: 0
      };

      if (this.splitPaymentSettingsData.defaultBankSelected !== '') {
        let bankAccount = this.bankAccountsList.find(
          (o) =>
            o.accountDisplayName ===
            this.splitPaymentSettingsData.defaultBankSelected
        );

        if (bankAccount) {
          bankPayment.accountDisplayName = bankAccount.accountDisplayName;
          bankPayment.bankAccountId = bankAccount.id;
        }
      }

      runInAction(() => {
        this.expense.splitPaymentList.push(bankPayment);
      });
    }
  };

  removeSplitPayment = (index) => {
    runInAction(() => {
      this.expense.splitPaymentList.splice(index, 1);
    });
  };

  setChosenPaymentType = (value) => {
    runInAction(() => {
      this.chosenPaymentType = value;
    });
  };

  handleOpenSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openSplitPaymentDetails = true;
    });
  };

  handleCloseSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openSplitPaymentDetails = false;
    });
  };

  handleCloseAndResetSplitPaymentDetails = async () => {
    runInAction(() => {
      this.openSplitPaymentDetails = false;
      let splitPaymentAmt = 0;
      for (let payment of this.expense.splitPaymentList) {
        splitPaymentAmt += parseFloat(payment.amount);
      }
      if (splitPaymentAmt === 0) {
        this.resetSplitPaymentDetails();
      }
    });
  };

  resetSplitPaymentDetails = async () => {
    runInAction(() => {
      this.expense.paymentType = 'cash';
      this.chosenPaymentType = 'Cash';
    });
    this.prepareSplitPaymentList();
  };

  setAutoGenMode = (value) => {
    runInAction(() => {
      this.isAutoGenMode = value;
    });
  };

  setExpenseType = (value) => {
    runInAction(() => {
      this.expense.expenseType = value;
    });
  };

  getSequenceNumber = async (date, id) => {
    //sequence number
    let transSettings = {};
    let multiDeviceSettings = {};
    let isOnline = true;
    if (window.navigator.onLine) {
      transSettings = await txnSettings.getTransactionData();
      runInAction(() => {
        this.invoiceData.multiDeviceBillingSupport =
          transSettings.multiDeviceBillingSupport;
        this.invoiceData.prefix =
          transSettings.expense.prefixSequence &&
          transSettings.expense.prefixSequence.length > 0
            ? transSettings.expense.prefixSequence[0].prefix
            : '';
      });
      isOnline = true;
    } else {
      multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
      runInAction(() => {
        this.invoiceData.prefix = localStorage.getItem('deviceName');
        this.invoiceData.subPrefix = 'EXP';
      });
      isOnline = false;
    }

    this.expense.billNumber = await sequence.getFinalSequenceNumber(
      this.invoiceData,
      'Expense',
      date,
      id,
      txnSettings,
      multiDeviceSettings,
      isOnline
    );
  };

  setCGSTSGSTEnabledByPOS = (value) => {
    runInAction(() => {
      this.isCGSTSGSTEnabledByPOS = value;
    });
  };

  updateExpenseTallySyncStatus = async (status, invoiceNumber) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.expenses.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            expenseId: {
              $eq: invoiceNumber
            }
          }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Purchases data is not found so cannot update any information
          return;
        }

        await query
          .update({
            $set: {
              updatedAt: Date.now(),
              tallySynced: status
            }
          })
          .then(async (data) => {
            // define the custom event
            runInAction(() => {
              const myEvent = new CustomEvent('onTallyStatusChangedEvent', {
                data: {}
              });

              // dispatch the event
              window.dispatchEvent(myEvent);
            });
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      })
      .catch((err) => {
        console.log('Internal Server Error Sale Order', err);
      });
  };

  updateBulkExpenseTallySyncStatus = async (inputItems, status) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    for (var i = 0; i < inputItems.length; i++) {
      let item = inputItems[i];
      let updatedAtNewTime = timestamp.getUniqueTimestamp();
      const query = await db.expenses.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              expenseId: {
                $eq: item.expenseId
              }
            }
          ]
        }
      });
      query
        .exec()
        .then(async (data) => {
          if (!data) {
            // No Purchases data is not found so cannot update any information
            return;
          }

          if (data.tallySynced !== status) {
            await query
              .update({
                $set: {
                  updatedAt: updatedAtNewTime,
                  tallySynced: status
                }
              })
              .catch((err) => {
                console.log('Internal Server Error', err);
              });
          }
        })
        .catch((err) => {
          console.log('Internal Server Error Sale Order', err);
        });
    }
  };

  handleOpenSequenceNumberFailureAlert = async () => {
    runInAction(() => {
      this.sequenceNumberFailureAlert = true;
    });
  };

  handleCloseSequenceNumberFailureAlert = async () => {
    runInAction(() => {
      this.sequenceNumberFailureAlert = false;
    });
  };

  updateExpenseIdInProcurement = async (expenseId) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.backtobackpurchases.findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          {
            backToBackPurchaseNumber: {
              $eq: this.backToBackPurchaseNumber
            }
          }
        ]
      }
    });
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          // No Procurement data is not found so cannot update any information
          return;
        }

        await query
          .update({
            $set: {
              updatedAt: Date.now(),
              expenseIdForFreightCharge: expenseId
            }
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      })
      .catch((err) => {
        console.log('Internal Server Error Sale Order', err);
      });
  };

  raiseExpenseFrom2B = async (vendor, expenseData) => {
    this.expense = this.expenseDefault;
    this.chosenPaymentType = 'Cash';
    this.isUpdate = false;
    this.isComingFromProcurement = false;

    runInAction(() => {
      this.expense.vendor_id = vendor.id;
      this.expense.vendor_name = vendor.name;
      this.expense.vendor_gst_number = vendor.gstNumber;
      this.expense.vendor_gst_type = vendor.gstType;
      this.expense.vendor_phone_number = vendor.phoneNumber;
      this.expense.vendorCity = vendor.city;
      this.expense.vendorPincode = vendor.pincode;
      this.expense.vendorAddress = vendor.address;
      this.expense.vendorState = vendor.state;
      this.expense.vendorCountry = vendor.country;
      this.expense.vendor_email_id = vendor.emailId;
      this.expense.vendorPanNumber = vendor.panNumber;
    });

    this.expense.billNumber = expenseData.inum; // to add from data
    this.expense.date = formatDate(expenseData.dt);
    let result = getStateList().find((e) => e.code === expenseData.pos);
    if (result) {
      this.setPlaceOfSupplyName(result.name);
      this.setPlaceOfSupply(result.val);
    }
    if (expenseData.itcavl === 'Y') {
      this.expense.portalITCAvailable = true;
    }
    if (expenseData.rev === 'Y') {
      this.expense.portalRCMValue = true;
    }
    if (expenseData.posITC === 'Y') {
      this.expense.posITCAvailable = true;
    }
    if (expenseData.posRCM === 'Y') {
      this.expense.posRCMValue = true;
    }

    this.expense.fromPortal = true;
    this.expense.paymentType = 'Credit';
    this.expense.is_credit = true;
    this.expense.notes = expenseData.notes;

    this.expense.categoryId = expenseData.categoryId;
    this.expense.category = expenseData.category;
    this.expense.categoryName = expenseData.category;

    this.item_list = [];
    await expenseData.items.forEach(async (purchaseItem, index) => {
      let newItem = new ExpenseItem().defaultValues();
      newItem.index = index + 1;
      newItem.item = this.expense.categoryName + ' Payment';
      newItem.taxIncluded = false;
      newItem.quantity = 1;
      newItem.price = parseFloat(purchaseItem.txval);
      newItem.price_before_tax = parseFloat(purchaseItem.txval);
      if (purchaseItem.igst > 0) {
        newItem.igst_amount = parseFloat(purchaseItem.igst);
        newItem.igst = parseFloat(purchaseItem.rt);
      } else {
        newItem.cgst_amount = parseFloat(purchaseItem.cgst);
        newItem.sgst_amount = parseFloat(purchaseItem.sgst);
        newItem.cgst = parseFloat(purchaseItem.rt / 2);
        newItem.sgst = parseFloat(purchaseItem.rt / 2);
      }

      const finalAmount =
        newItem.price +
        newItem.cgst_amount +
        newItem.sgst_amount +
        newItem.igst_amount;
      newItem.amount = Math.round(finalAmount * 100) / 100 || 0;

      await this.item_list.push(newItem);
      this.expense.total += parseFloat(newItem.amount).toFixed(2);
    });

    this.expense.balance = parseFloat(this.expense.total).toFixed(2);

    await this.saveExpense(false);
  };

  setCreditLimitDays = (value) => {
    runInAction(() => {
      this.customerCreditDays = value;
    });
  };

  // setting variables as observables so that it can be accesible
  // from other components and making methods as actions to invoke from other components
  constructor() {
    this.expenseDefault = new Expense().defaultValues();
    this.expense = new Expense().defaultValues();
    this.existingExpense = new Expense().defaultValues();
    this.item_list = [new ExpenseItem().defaultValues()];
    this.item_list_default = [new ExpenseItem().defaultValues()];

    makeObservable(this, {
      expense: observable,
      category: observable,
      item_list: observable,
      expenseDialogOpen: observable,
      expenseList: observable,
      categoryList: observable,
      categoryDialogOpen: observable,
      addExpensesDialogue: observable,
      viewCategoryDialogOpen: observable,
      isExpenseList: observable,
      isUpdate: observable,
      setExpenseProperty: action,
      handleExpenseModalClose: action,
      handleExpenseModalOpen: action,
      handleCategoryModalClose: action,
      handleCategoryModalOpen: action,
      getCategoryList: action,
      saveExpense: action,
      getExpensesCount: action,
      handleAddexpensesModalOpen: action,
      setSelectedCategory: action,
      handleAddExpensesModalClose: action,
      setAmount: action,
      setPaymentType: action,
      setQuantity: action,
      toggleRoundOff: action,
      deleteExpense: action,
      getRoundedAmount: computed,
      getTotalAmount: computed,
      isUpdateCategory: observable,
      items: observable,
      setPaymentMode: action,
      setBankAccountData: action,
      setPaymentReferenceNumber: action,
      taxSettingsData: observable,
      setTaxSettingsData: action,
      setHsn: action,
      setBillNumber: action,
      setDiscount: action,
      setDiscountAmount: action,
      setItemDiscount: action,
      setItemDiscountAmount: action,
      setPackingCharge: action,
      setShippingCharge: action,
      setTaxIncluded: action,
      setCreditData: action,
      setReverseChargeEnable: action,
      setReverseChargeValue: action,
      setPlaceOfSupply: action,
      setPlaceOfSupplyName: action,
      setExpenseDueDate: action,
      setPrice: action,
      getBalanceData: computed,
      viewAndRestoreExpenseItem: action,
      restoreExpenseItem: action,
      isRestore: observable,
      openExpenseLoadingAlertMessage: observable,
      openExpenseErrorAlertMessage: observable,
      setRoundingConfiguration: action,
      currentSelectedCategory: observable,
      expensesUploadedFile: observable,
      setExpensesUploadedFiles: action,
      //below variable is temporary fix

      changeInCategory: observable,
      changeInExpense: observable,
      expenseTransSettingData: observable,
      openSplitPaymentDetails: observable,
      chosenPaymentType: observable,
      splitPaymentSettingsData: observable,
      isAutoGenMode: observable,
      isCGSTSGSTEnabledByPOS: observable,
      sequenceNumberFailureAlert: observable,
      isComingFromProcurement: observable,
      customerCreditDays: observable
    });
  }
}

// this is to make this component public so that it is assible from other componets
export default new ExpenseStore();