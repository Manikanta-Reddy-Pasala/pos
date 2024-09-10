import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS
} from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import _uniqueId from 'lodash/uniqueId';

import * as kotHelper from '../../components/KotDataHelper';
import * as txnSettings from '../../components/Helpers/TransactionSettingsHelper';
import * as sequence from '../../components/Helpers/SequenceNumberHelper';
import * as deviceIdHelper from '../../components/Helpers/PrintHelper/CloudPrintHelper';
import * as audit from '../../components/Helpers/AuditHelper';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import { getKOTTransactionSettings } from 'src/components/Helpers/dbQueries/kottransactionsettings';
import { getTaxSettings } from 'src/components/Helpers/dbQueries/taxsettings';
import { getBankAccounts } from 'src/components/Helpers/dbQueries/bankaccounts';
import { getAuditSettings } from 'src/components/Helpers/dbQueries/auditsettings';
import { getWaiters } from 'src/components/Helpers/dbQueries/waiters';
import { getSplitPaymentSettings } from 'src/components/Helpers/dbQueries/splitpaymentsettings';
import { getTransactionSettings } from 'src/components/Helpers/dbQueries/transactionsettings';
import { getPrinterSettings } from 'src/components/Helpers/dbQueries/printersettings';
import { cloneDeep } from 'lodash';
import { sendContentForThermalPrinter } from 'src/components/Helpers/PrintHelper/ThermalPrintHelper';

const colorArray = [
  {
    background: '#EEFFD5',
    table: '#FFFFFF',
    selected: '#33cc33',
    no_serve: '#FFFFFF'
  },
  {
    background: '#FFFABA',
    table: '#FFFFFF',
    selected: '#ffcc00',
    no_serve: '#FFFFFF'
  },
  {
    background: '#D8F4FF',
    table: '#FFFFFF',
    selected: '#cc33ff',
    no_serve: '#FFFFFF'
  }
];

class KotStore {
  kotDetails = [];
  waiters = [];

  selectedTable = {};
  selectedCategory = {};
  firstTimeLoading = false;
  FocusLastIndex = false;
  level3CategoriesList = [];
  lastSelectedTableNo = 0;
  previousOrderData = {
    businessId: '',
    businessCity: '',
    prefix: '',
    subPrefix: '',
    customer_id: '',
    customer_name: '',
    customerGSTNo: null,
    customer_address: '',
    customer_phoneNo: '',
    customer_city: '',
    customer_emailId: '',
    customer_pincode: '',
    waiter_name: '',
    waiter_phoneNo: '',
    invoice_number: '',
    sequenceNumber: '',
    invoice_date: null,
    is_roundoff: true,
    round_amount: 0.0,
    total_amount: 0.0,
    payment_type: 'cash',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    balance_amount: 0.0,
    updatedAt: '',
    discount_percent: 0,
    discount_amount: 0,
    discount_type: '',
    packing_charge: 0,
    shipping_charge: 0,
    selectedChairs: [],
    numberOfPax: 0,
    tableNumber: '',
    categoryId: '',
    categoryName: '',
    isUpdate: false,
    paymentReferenceNumber: '',
    customerGSTType: '',
    customerState: '',
    customerCountry: '',
    splitPaymentList: [],
    menuType: '',
    subTotal: 0
  };
  tableDetailsLoader = false;
  openAddSaleDialog = false;
  OpenBatchList = false;
  selectedIndex = '';
  previousSelectedTableIndex = 0;
  kotCategoryData = {
    name: '',
    tableDetails: []
  };
  availableChairs = [];
  chairsList = [];

  selectedProduct = {};

  addNewRowEnabled = false;

  tablePropertiesData = {
    tableDetails: '',
    floorDetails: '',
    tableIndex: '',
    floorNoDataStatus: false
  };

  orderData = {
    businessId: '',
    businessCity: '',
    prefix: '',
    subPrefix: '',
    customer_id: '',
    customer_name: '',
    customerGSTNo: null,
    customer_address: '',
    customer_phoneNo: '',
    customer_city: '',
    customer_emailId: '',
    customer_pincode: '',
    waiter_name: '',
    waiter_phoneNo: '',
    invoice_number: '',
    sequenceNumber: '',
    invoice_date: null,
    is_roundoff: true,
    round_amount: 0.0,
    total_amount: 0.0,
    payment_type: 'cash',
    bankAccount: '',
    bankAccountId: '',
    bankPaymentType: '',
    balance_amount: 0.0,
    updatedAt: '',
    discount_percent: 0,
    discount_amount: 0,
    discount_type: '',
    packing_charge: 0,
    shipping_charge: 0,
    selectedChairs: [],
    numberOfPax: 0,
    tableNumber: '',
    categoryId: '',
    categoryName: '',
    isUpdate: false,
    paymentReferenceNumber: '',
    customerGSTType: '',
    customerState: '',
    customerCountry: '',
    splitPaymentList: [],
    menuType: '',
    subTotal: 0,
    chairsAvailableInString: ''
  };

  items = [
    {
      id: Date.now() + '',
      product_id: '',
      batch_id: 0,
      item_name: '',
      sku: '',
      barcode: '',
      mrp: 0,
      mrp_before_tax: 0,
      purchased_price: 0,
      offer_price: 0,
      size: 0,
      qty: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      igst_amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      amount: 0,
      roundOff: 0,
      isEdit: true,
      returnedQty: 0,
      stockQty: 0,
      vendorName: '',
      vendorPhoneNumber: '',
      brandName: '',
      categoryLevel2: '',
      categoryLevel2DisplayName: '',
      categoryLevel3: '',
      categoryLevel3DisplayName: '',
      served: false,
      batchNumber: '',
      discount_percent: 0,
      discount_amount: 0,
      discount_amount_per_item: 0,
      discount_type: '',
      taxIncluded: false,
      taxType: '',
      addOnProperties: [],
      originalDiscountPercent: 0
    }
  ];

  openInvoiceNumModal = false;
  openInvNumDubCheck = false;

  openKOTLoadingAlertMessage = false;
  openKOTErrorAlertMessage = false;
  openKOTServeLoadingAlertMessage = false;

  kotTxnEnableFieldsMap = new Map();

  taxSettingsData = {};

  kotTxnSettingsData = {};

  splitPaymentSettingsData = {};

  chosenPaymentType = 'Cash';

  openSplitPaymentDetails = false;

  bankAccountsList = [];

  roundingConfiguration = 'Nearest 50';

  saleTxnSettingsData = {};

  sequenceNumberFailureAlert = false;

  salesInvoiceThermal = {};

  openKOTCompleteLoadingAlertMessage = false;

  productAddOnsData = [];
  selectedProductData = {};
  addonIndex = '';

  openAddonList = false;
  openTouchAddSaleDialog = false;

  discType = 'percentage';
  auditSettings = {};
  transaction = {};

  setDiscType = async (value) => {
    runInAction(() => {
      this.orderData.discount_type = value;
      this.discType = value;
    });

    await parseFloat(this.calculateTotalAmount());
  };

  handleInvoiceNumModalClose = async () => {
    runInAction(() => {
      this.openInvoiceNumModal = false;
    });
  };

  handleInvoiceNumModalOpen = async () => {
    runInAction(async () => {
      this.openInvoiceNumModal = true;
    });
  };

  handleInvNumDubCheckClose = async () => {
    runInAction(() => {
      this.openInvNumDubCheck = false;
    });
  };

  handleInvNumDubCheckOpen = async () => {
    runInAction(() => {
      this.openInvNumDubCheck = true;
    });
  };

  loadKotDetails = async (loadFromDb) => {
    if (this.kotDetails.length === 0 || loadFromDb) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const query = db.kotdata.find({
        selector: { businessId: { $eq: businessData.businessId } }
      });

      query.$.subscribe(async (data) => {
        if (!data || data.length === 0) {
          this.setNoFloorDataProperty(true);
          return;
        }
        this.convertToCategoryDataRow(data);
      });
    }
  };

  convertToCategoryDataRow = async (data) => {
    const categories = [];

    data.forEach((item) => {
      const row = item.toJSON();
      if (!row.chairsUsedInString && !row.chairsAvailableInString) {
        row.chairsAvailableInString = row.chairsData
          .map((c) => c.chairNumber)
          .join(', ');
      }

      const index = categories.findIndex(
        (el) => el.categoryId === row.categoryId
      );
      if (index >= 0) {
        categories[index].tableData.push(row);
      } else {
        categories.push({
          categoryName: row.categoryName,
          categoryId: row.categoryId,
          tableData: [row]
        });
      }
    });

    await this.getTableData(toJS(categories));
  };

  getTableData = async (data) => {
    const selectedTableId = await this.getLastSelectedTableNo();
    let isFirstTimeloading = false;

    data.forEach((res, index) => {
      const colorSet = colorArray[index % colorArray.length];
      res.background = colorSet.background;
      res.selected = false;

      if (res.tableData) {
        res.tableData.forEach((subRes, subIndex) => {
          const subColorSet = colorArray[subIndex % colorArray.length];
          subRes.background = subRes.toServe
            ? colorSet.table
            : subColorSet.no_serve;
          subRes.selectedColor = colorSet.selected;
          subRes.textColor =
            subRes.ordersData?.length > 0 ? colorSet.selected : 'black';
          subRes.textColor2 = 'black';

          if (selectedTableId && selectedTableId === subRes.tableId) {
            subRes.selected = true;
            subRes.background = colorSet.selected;
            subRes.textColor = '#F7FD1E';
            subRes.textColor2 = 'white';
          } else {
            isFirstTimeloading = true;
          }
        });
      }

      if (index === data.length - 1 && !this.getFirstTimeLoading()) {
        this.setNoFloorDataProperty(false);
      }
    });

    await this.setKotData(data);

    if (isFirstTimeloading) {
      this.setFirstTimeLoading(true);
    }
  };

  removeOrderDataFromKotDetails = async (tableData) => {
    this.setAvailableChairsFromPreviousScreen(
      tableData.chairsAvailableInString
    );
    this.setChairsUsedFromPreviousScreen(tableData.chairsUsedInString);

    runInAction(() => {
      this.kotDetails.forEach((res) => {
        if (res.categoryName === this.selectedCategory.categoryName) {
          if (res.tableData) {
            res.tableData.forEach((subRes, subIndex) => {
              if (subRes.tableNumber === this.selectedTable.tableNumber) {
                res.tableData[subIndex] = tableData; // Update the array directly
                this.setFloorData({
                  tableDetails: tableData, // Use tableData directly
                  floorDetails: res,
                  tableIndex: subIndex,
                  floorNoDataStatus: false
                });
              }
            });
          }
        }
      });
    });
  };

  handleTableClick = async (arrayindex, arraysubIndex, table, data) => {
    if (data) {
      runInAction(() => {
        data.forEach((res, index) => {
          const colorSet = colorArray[index % colorArray.length];
          res.background = colorSet.background;

          if (res.tableData) {
            res.tableData.forEach((subRes, subIndex) => {
              const subColorSet = colorArray[subIndex % colorArray.length];
              subRes.background = subRes.toServe
                ? colorSet.table
                : subColorSet.no_serve;
              subRes.detail_background = colorSet.table;
              subRes.textColor =
                subRes.ordersData?.length > 0 ? colorSet.selected : 'black';
              subRes.textColor2 = 'black';
              subRes.selectedColor = colorSet.selected;

              if (arrayindex === index && arraysubIndex === subIndex) {
                subRes.selected = true;
                subRes.background = colorSet.selected;
                subRes.textColor = '#F7FD1E';
                subRes.textColor2 = 'white';
                this.setFloorData({
                  tableDetails: subRes,
                  floorDetails: res,
                  tableIndex: subIndex,
                  floorNoDataStatus: false
                });
              } else {
                subRes.selected = false;
              }
            });
          }
        });
      });
      await this.selectOrderDataByTable(table);
    }
  };

  setNoFloorDataProperty = async (value) => {
    runInAction(() => {
      this.tablePropertiesData = {
        tableDetails: '',
        floorDetails: '',
        tableIndex: '',
        floorNoDataStatus: value
      };
    });
  };

  setFloorData = async (data) => {
    runInAction(() => {
      this.tablePropertiesData = { ...data };
    });
  };

  generateInvoiceNumber = async () => {
    const timestamp = Math.floor(Date.now() / 1000);
    const businessData = await Bd.getBusinessData();
    const appId = businessData.posDeviceId;
    const id = _uniqueId('i');

    runInAction(() => {
      if (
        this.orderData.invoice_number === '' ||
        this.orderData.invoice_number === undefined
      ) {
      }
      this.orderData.invoice_number = `${id}${appId}${timestamp}`;
    });
  };

  setKotData = async (data) => {
    runInAction(() => {
      this.kotDetails = data;
    });
  };

  getTableDataFromKotData = async (category, table, index) => {
    this.setLastSelectedTableNo(table.tableId);

    runInAction(() => {
      this.selectedCategory = category;
      this.selectedTable = table;
      this.selectedIndex = index;

      this.kotDetails.forEach((res, index) => {
        if (res.tableData) {
          res.tableData.forEach(async (subRes, subIndex) => {
            if (table.tableId) {
              subRes.selected = table.tableId === subRes.tableId;
            }

            if (subRes.selected) {
              // console.log('getTableDataFromKotData::' + subRes.tableNumber);
              await this.handleTableClick(
                index,
                subIndex,
                subRes,
                this.kotDetails
              );
            }
          });
        }
      });
    });
  };

  setFirstTimeLoading = async (data) => {
    runInAction(() => {
      this.firstTimeLoading = data;
    });
  };

  getFirstTimeLoading = () => {
    return this.firstTimeLoading;
  };

  setLastSelectedTableNo = async (table_no) => {
    runInAction(() => {
      this.lastSelectedTableNo = table_no;
    });
  };

  getLastSelectedTableNo = () => {
    return this.lastSelectedTableNo;
  };

  getAvailableChairsForTable = async () => {
    const category = this.kotDetails.find((element) => {
      return element.categoryName === this.selectedCategory.categoryName;
    });

    if (category) {
      const table = category.tableData.find((element) => {
        return element.tableNumber === this.selectedTable.tableNumber;
      });
      // console.log(table)

      let availableChairsString;
      if (table) {
        // Check for the existence of "ordersData" and "chairsData"
        if (table.chairsData) {
          // Extract all occupied chairs from the ordersData, if it exists
          const occupiedChairs = table.ordersData
            ? table.ordersData.reduce((acc, order) => {
                const usedChairsArray = order.chairsUsedInString
                  .split(',')
                  .map((item) => item.trim());
                return acc.concat(usedChairsArray);
              }, [])
            : [];

          // Filter out occupied chairs from the chairsData
          const availableChairs = table.chairsData.filter(
            (chair) => !occupiedChairs.includes(chair.chairNumber)
          );

          // Convert availableChairs array to string
          availableChairsString = availableChairs
            .map((chair) => chair.chairNumber)
            .join(',');
        }

        runInAction(() => {
          this.chairsList = [];

          table.chairsData.forEach((ele) => {
            this.chairsList.push(ele.chairNumber);
          });

          runInAction(() => {
            this.availableChairs = availableChairsString
              .split(',')
              .map((item) => item.trim());
          });
        });
      }
    }
  };

  resetOrderData = async (chairs) => {
    runInAction(() => {
      this.orderData = {
        businessId: '',
        businessCity: '',
        prefix: '',
        subPrefix: '',
        customer_id: '',
        customer_name: '',
        customerGSTNo: null,
        customer_address: '',
        customer_phoneNo: '',
        customer_city: '',
        customer_emailId: '',
        customer_pincode: '',
        invoice_number: '',
        sequenceNumber: '',
        invoice_date: '',
        is_roundoff: true,
        round_amount: 0.0,
        total_amount: 0.0,
        payment_type: 'cash',
        balance_amount: 0.0,
        updatedAt: '',
        discount_percent: 0,
        discount_amount: 0,
        discount_type: '',
        packing_charge: 0,
        shipping_charge: 0,
        selectedChairs: chairs
          ? chairs.split(',').map((item) => item.trim())
          : [],
        numberOfPax: 0,
        waiter_ame: '',
        waiter_phoneNo: '',
        tableNumber: '',
        categoryId: '',
        categoryName: '',
        isUpdate: false,
        paymentReferenceNumber: '',
        bankAccount: '',
        bankAccountId: '',
        bankPaymentType: '',
        customerGSTType: '',
        customerState: '',
        customerCountry: '',
        splitPaymentList: [],
        menuType: '',
        subTotal: 0
      };

      this.items = [
        {
          id: Date.now() + '',
          product_id: '',
          batch_id: 0,
          item_name: '',
          sku: '',
          barcode: '',
          mrp: 0,
          mrp_before_tax: 0,
          purchased_price: 0,
          offer_price: 0,
          size: 0,
          qty: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          cess: 0,
          igst_amount: 0,
          cgst_amount: 0,
          sgst_amount: 0,
          amount: 0,
          roundOff: 0,
          isEdit: true,
          returnedQty: 0,
          stockQty: 0,
          vendorName: '',
          vendorPhoneNumber: '',
          brandName: '',
          categoryLevel2: '',
          categoryLevel2DisplayName: '',
          categoryLevel3: '',
          categoryLevel3DisplayName: '',
          served: false,
          batchNumber: '',
          discount_percent: 0,
          discount_amount: 0,
          discount_amount_per_item: 0,
          discount_type: '',
          taxIncluded: false,
          taxType: '',
          originalDiscountPercent: 0,
          addOnProperties: []
        }
      ];
    });

    await this.generateInvoiceNumber();
  };

  openForNewSale = async (category, table, index) => {
    await this.resetOrderData(table.chairsAvailableInString);
    let currentDate = await dateHelper.getTodayDateInYYYYMMDD();

    runInAction(async () => {
      this.selectedTable = table;
      this.selectedIndex = index;
      this.previousOrderData = this.orderData;
      await this.getAvailableChairsForTable();
      this.setAvailableChairsFromPreviousScreen(table.chairsAvailableInString);
    });

    runInAction(() => {
      this.orderData.invoice_date = currentDate;
      this.chosenPaymentType = 'Cash';
      this.selectedCategory = category;
      if (
        category &&
        category.categoryName !== null &&
        category.categoryName.includes('Non-AC')
      ) {
        this.orderData.menuType = 'Non-AC';
      } else if (category && category.categoryName.includes('AC')) {
        this.orderData.menuType = 'AC';
      } else if (category && category.categoryName.includes('Self Service')) {
        this.orderData.menuType = 'Self Service';
      }
      if (
        this.kotTxnSettingsData &&
        this.kotTxnSettingsData.enableTouchKOTUI === true
      ) {
        this.openTouchAddSaleDialog = true;
      } else {
        this.openAddSaleDialog = true;
      }
    });
  };

  setAvailableChairsFromPreviousScreen = (chairs) => {
    runInAction(() => {
      this.orderData.chairsAvailableInString = chairs;
    });
  };

  setChairsUsedFromPreviousScreen = (chairs) => {
    runInAction(() => {
      this.orderData.chairsUsedInString = chairs;
    });
  };

  editOrAddItems = async () => {
    runInAction(() => {
      if (
        this.kotTxnSettingsData &&
        this.kotTxnSettingsData.enableTouchKOTUI === true
      ) {
        this.openTouchAddSaleDialog = true;
      } else {
        this.openAddSaleDialog = true;
      }

      if (
        this.orderData &&
        this.orderData.items &&
        this.orderData.items.length > 0
      ) {
        this.orderData.isUpdate = true;
      }

      this.selectedCategory.categoryId = this.orderData.categoryId;
      this.selectedCategory.categoryName = this.orderData.categoryName;

      this.selectedTable.tableNumber = this.orderData.tableNumber;

      if (this.orderData.splitPaymentList === undefined) {
        runInAction(() => {
          this.orderData.splitPaymentList = [];
        });
      }

      runInAction(() => {
        if (this.orderData.payment_type === 'Split') {
          this.chosenPaymentType = 'Split';
        } else {
          this.chosenPaymentType = 'Cash';
        }
      });

      if (this.orderData.chairsUsedInString) {
        this.orderData.selectedChairs =
          typeof this.orderData.chairsUsedInString === 'string'
            ? this.orderData.chairsUsedInString
                .split(',')
                .map((item) => item.trim())
            : this.orderData.chairsUsedInString;
      }

      this.getAvailableChairsForTable();
      this.previousOrderData = this.orderData;
    });
  };

  closeDialog = async () => {
    runInAction(() => {
      if (
        this.kotTxnSettingsData &&
        this.kotTxnSettingsData.enableTouchKOTUI === true
      ) {
        this.openTouchAddSaleDialog = false;
      } else {
        this.openAddSaleDialog = false;
      }
    });

    let chairs = this.orderData.chairsAvailableInString;
    this.setAvailableChairsFromPreviousScreen(chairs);
  };

  closeDialogWithoutSave = async () => {
    runInAction(async () => {
      if (
        this.kotTxnSettingsData &&
        this.kotTxnSettingsData.enableTouchKOTUI === true
      ) {
        this.openTouchAddSaleDialog = false;
      } else {
        this.openAddSaleDialog = false;
      }

      await this.resetOrderData();

      //reload by selected table ...
      this.getTableDataFromKotData(
        this.selectedCategory,
        this.selectedTable,
        this.selectedIndex
      );
    });
  };

  setPaymentType = (value) => {
    runInAction(() => {
      this.orderData.payment_type = value;
    });
  };

  setInoicePrefix = (value) => {
    runInAction(() => {
      this.orderData.prefix = value;
    });
  };

  setInvoiceSubPrefix = (value) => {
    runInAction(() => {
      this.orderData.subPrefix = value;
    });
  };

  setEditTable = (index, value, lastIndexFocusIndex) => {
    runInAction(() => {
      if (this.items && this.items.length > 0) {
        for (let i = 0; i < this.items.length; i++) {
          this.items[i].isEdit = index === i;
        }
      }
      if (index && value) {
        if (this.items[index]) {
          this.items[index].isEdit = value;
        }
      }
      this.FocusLastIndex = lastIndexFocusIndex;
    });
  };

  getAddRowEnabled = () => {
    return this.addNewRowEnabled;
  };

  setAddRowEnabled = (value) => {
    runInAction(() => {
      this.addNewRowEnabled = value;
    });
  };

  setItemSku = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    runInAction(() => {
      this.items[index].sku = value;
    });
  };

  setItemBarcode = async (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    runInAction(() => {
      this.items[index].barcode = value;
    });

    /**
     * get product by barcode
     * if match found then add new row
     */
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.businessproduct
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { barcode: { $eq: value } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No proudct match found
          return;
        }
        await this.selectProduct(data, index);
        // this.addNewItem();
      });
  };

  setDiscount = async (value) => {
    if (!this.orderData) {
      return;
    }
    runInAction(() => {
      this.orderData.discount_percent = value ? parseFloat(value) : '';
      this.orderData.discount_type = 'percentage';
    });

    await parseFloat(this.calculateTotalAmount());
  };

  setDiscountAmount = async (value) => {
    if (!this.orderData) {
      return;
    }

    runInAction(() => {
      this.orderData.discount_amount = value ? parseFloat(value) : '';
      this.orderData.discount_type = 'amount';
    });
    await parseFloat(this.calculateTotalAmount());
  };

  setDiscountType = async (value) => {
    if (!this.orderData) {
      return;
    }
    runInAction(() => {
      if (value === '%') {
        this.orderData.discount_type = 'percentage';
      } else {
        this.orderData.discount_type = 'amount';
      }
    });
    await parseFloat(this.calculateTotalAmount());
  };

  setQuantity = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }
    // console.log(this.items[index]);
    if (parseFloat(value) > 0) {
      runInAction(() => {
        this.items[index].qty = parseFloat(value);
      });
      this.getAmount(index);
    } else {
      this.items[index].qty = '';
      this.getAmount(index);
    }
  };

  setCustomerName = (value) => {
    runInAction(() => {
      this.orderData.customer_name = value;
    });
  };

  setCustomerId = (value) => {
    runInAction(() => {
      this.orderData.customer_id = value;
    });
  };

  setPackingCharge = async (value) => {
    runInAction(() => {
      this.orderData.packing_charge = value;
    });
    await parseFloat(this.calculateTotalAmount());
  };

  setShippingCharge = async (value) => {
    runInAction(() => {
      this.orderData.shipping_charge = value;
    });
    await parseFloat(this.calculateTotalAmount());
  };

  selectCustomer = (customer) => {
    runInAction(() => {
      this.orderData.customer_id = customer.id;
      this.orderData.customer_name = customer.name;
      this.orderData.customerGSTNo = customer.gstNumber;
      this.orderData.customer_address = customer.address;
      this.orderData.customer_phoneNo = customer.phoneNo;
      this.orderData.customer_city = customer.city;
      this.orderData.customer_emailId = customer.emailId;
      this.orderData.customer_pincode = customer.pincode;
      this.orderData.customerGSTType = customer.gstType;
      this.orderData.customerState = customer.state;
      this.orderData.customerCountry = customer.country;
    });
  };

  selectProduct = (productItem, index) => {
    if (!productItem) {
      return;
    }
    const {
      name,
      salePrice,
      purchasedPrice,
      offerPrice,
      barcode,
      sku,
      cgst,
      sgst,
      igst,
      cess,
      hsn,
      productId,
      taxIncluded,
      stockQty,
      vendorName,
      vendorPhoneNumber,
      categoryLevel2,
      categoryLevel3,
      brandName,
      saleDiscountPercent,
      taxType,
      batchNumber,
      batch_id,
      additional_property_group_list
    } = productItem;
    if (!this.items) {
      return;
    }
    if (!this.items[index] && !this.openTouchAddSaleDialog) {
      return;
    }

    runInAction(() => {
      this.items.push({
        id: Date.now() + '',
        product_id: '',
        batch_id: 0,
        item_name: '',
        sku: '',
        barcode: '',
        mrp: 0,
        mrp_before_tax: 0,
        purchased_price: 0,
        offer_price: 0,
        size: 0,
        qty: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        cess: 0,
        igst_amount: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        amount: 0,
        roundOff: 0,
        isEdit: true,
        returnedQty: 0,
        stockQty: 0,
        served: false,
        addOnProperties: []
      });
      this.items[index].id = Date.now() + '';
      this.items[index].mrp = parseFloat(salePrice);
      this.items[index].purchased_price = parseFloat(purchasedPrice);

      if (offerPrice > 0) {
        this.items[index].offer_price = parseFloat(offerPrice);
      } else {
        this.items[index].offer_price = parseFloat(salePrice);
      }

      this.items[index].vendorName = vendorName;
      this.items[index].vendorPhoneNumber = vendorPhoneNumber;
      this.addNewRowEnabled = true;

      this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;

      this.setEditTable(this.enabledRow, true, Number('9' + this.enabledRow));
    });

    runInAction(() => {
      this.productAddOnsData[index] = [];
      for (let prodAddOn of additional_property_group_list) {
        const addOn = {
          groupId: prodAddOn.groupId,
          name: prodAddOn.name,
          min_choices: prodAddOn.min_choices,
          max_choices: prodAddOn.max_choices,
          additional_property_list: this.getSaleItemAdditionalPropertiesList(
            prodAddOn.additional_property_list
          )
        };
        this.productAddOnsData[index].push(addOn);
      }

      this.items[index].item_name = name;
      this.items[index].barcode = barcode;
      this.items[index].sku = sku;
      this.items[index].product_id = productId;
      this.items[index].cess = cess;
      this.items[index].taxIncluded = taxIncluded;
      this.items[index].stockQty = stockQty;
      this.items[index].hsn = hsn;
      this.items[index].taxType = taxType;

      // categories
      if (categoryLevel2 && categoryLevel3) {
        this.items[index].categoryLevel2 = categoryLevel2.name
          ? categoryLevel2.name
          : '';
        this.items[index].categoryLevel2DisplayName = categoryLevel2.displayName
          ? categoryLevel2.displayName
          : '';
        this.items[index].categoryLevel3 = categoryLevel3.name
          ? categoryLevel3.name
          : '';
        this.items[index].categoryLevel3DisplayName = categoryLevel3.displayName
          ? categoryLevel3.displayName
          : '';
      }

      this.items[index].brandName = brandName;
      this.items[index].batchNumber = batchNumber;
      this.items[index].batch_id = batch_id;

      if (cgst > 0) {
        this.items[index].cgst = cgst;
      }
      if (sgst > 0) {
        this.items[index].sgst = sgst;
      }
    });

    this.setQuantity(index, 1);
    let billdiscount = this.orderData.discount_percent
      ? parseFloat(this.orderData.discount_percent)
      : 0;
    this.items[index].originalDiscountPercent =
      saleDiscountPercent + billdiscount;
    this.setItemDiscount(index, this.items[index].originalDiscountPercent);

    console.log('this.items', this.items);
  };

  getSaleItemAdditionalPropertiesList = (additionalPropertiesList) => {
    let newAddOnsList = [];
    for (let addOn of additionalPropertiesList) {
      let newAddOn = {
        additionalPropertyId: addOn.additional_property_id,
        name: addOn.name,
        price: addOn.price,
        type: addOn.type,
        offline: addOn.offline,
        cgst: addOn.cgst,
        sgst: addOn.sgst,
        igst: addOn.igst,
        cgst_amount: 0,
        sgst_amount: 0,
        igst_amount: 0,
        discount_percent: 0,
        discount_amount: 0,
        discount_amount_per_item: 0,
        discount_type: '',
        amount: 0,
        amount_before_tax: 0,
        cess: 0,
        taxIncluded: addOn.tax_included,
        groupName: addOn.group_name,
        purchasedPrice: addOn.purchasedPrice,
        taxType: addOn.taxType,
        productId: addOn.productId,
        description: addOn.description,
        batchId: addOn.batchId,
        brandName: addOn.brandName,
        categoryLevel2: addOn.categoryLevel2,
        categoryLevel2DisplayName: addOn.categoryLevel2DisplayName,
        categoryLevel3: addOn.categoryLevel3,
        categoryLevel3DisplayName: addOn.categoryLevel3DisplayName,
        hsn: addOn.hsn,
        barcode: addOn.barcode,
        stockQty: addOn.stockQty
      };
      newAddOnsList.push(newAddOn);
    }

    return newAddOnsList;
  };

  handleOpenAddon = async (item, index) => {
    this.selectedProductData = item;
    this.openAddonList = true;
    this.addonIndex = index;
  };

  pushAddonProperties = async (properties, total) => {
    runInAction(() => {
      this.items[this.addonIndex].addOnProperties = properties;
    });
  };

  handleAddOnsListModalClose = async () => {
    this.openAddonList = false;
  };

  resetSingleProduct = (index) => {
    let defaultItem = {
      id: Date.now() + '',
      product_id: '',
      batch_id: 0,
      item_name: '',
      sku: '',
      barcode: '',
      mrp: 0,
      mrp_before_tax: 0,
      purchased_price: 0,
      offer_price: 0,
      size: 0,
      qty: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      cess: 0,
      igst_amount: 0,
      cgst_amount: 0,
      sgst_amount: 0,
      amount: 0,
      roundOff: 0,
      isEdit: true,
      returnedQty: 0,
      stockQty: 0,
      addOnProperties: []
    };
    runInAction(() => {
      this.items[index] = defaultItem;
      this.FocusLastIndex = Number('4' + index);
    });
  };

  selectProductFromBatch = (productItem) => {
    if (!productItem) {
      return;
    }

    // console.log('batch item::', productItem);
    const { salePrice, offerPrice, qty, purchasedPrice } = productItem;

    runInAction(() => {
      this.items[this.selectedIndex].mrp = parseFloat(salePrice);

      this.items[this.selectedIndex].purchased_price =
        parseFloat(purchasedPrice);

      this.items[this.selectedIndex].stockQty = qty;

      this.items[this.selectedIndex].batch_id = productItem.id;

      if (offerPrice > 0) {
        this.items[this.selectedIndex].offer_price = parseFloat(offerPrice);
      } else {
        this.items[this.selectedIndex].offer_price = parseFloat(salePrice);
      }
      this.items[this.selectedIndex].vendorName = productItem.vendorName;
      this.items[this.selectedIndex].vendorPhoneNumber =
        productItem.vendorPhoneNumber;
    });

    this.getAmount(this.selectedIndex);
    this.handleBatchListModalClose();
    setTimeout(() => {
      this.addNewItem(true, true);
    }, 100);
  };

  converToSelectedProduct = (item) => {
    runInAction(() => {
      this.selectedProduct.name = item.name;
      this.selectedProduct.salePrice = item.salePrice;
      this.selectedProduct.purchasedPrice = item.purchasedPrice;
      this.selectedProduct.offerPrice = item.offerPrice;
      this.selectedProduct.barcode = item.barcode;
      this.selectedProduct.sku = item.sku;
      this.selectedProduct.cgst = item.cgst;
      this.selectedProduct.sgst = item.sgst;
      this.selectedProduct.igst = 0;
      this.selectedProduct.cess = item.cess;
      this.selectedProduct.hsn = item.hsn;
      this.selectedProduct.productId = item.productId;
      this.selectedProduct.taxIncluded = item.taxIncluded;
      this.selectedProduct.stockQty = item.stockQty;
      this.selectedProduct.batchData = item.batchData;
      this.selectedProduct.vendorName = item.vendorName;
      this.selectedProduct.vendorPhoneNumber = item.vendorPhoneNumber;
      this.selectedProduct.categoryLevel2 = item.categoryLevel2;
      this.selectedProduct.categoryLevel3 = item.categoryLevel3;
      this.selectedProduct.brandName = item.brandName;
      this.selectedProduct.saleDiscountAmount = item.saleDiscountAmount;
      this.selectedProduct.saleDiscountPercent = item.saleDiscountPercent;
      this.selectedProduct.saleDiscountType = item.saleDiscountType;
    });
  };

  handleBatchListModalClose = (val) => {
    runInAction(() => {
      this.OpenBatchList = false;
      if (val) {
        this.items[this.selectedIndex].mrp = parseFloat(val.salePrice);

        this.items[this.selectedIndex].stockQty = val.qty;

        if (val.offerPrice > 0) {
          this.items[this.selectedIndex].offer_price = parseFloat(
            val.offerPrice
          );
        } else {
          this.items[this.selectedIndex].offer_price = parseFloat(
            val.salePrice
          );
        }

        this.items[this.selectedIndex].vendorName = val.vendorName;
        this.items[this.selectedIndex].vendorPhoneNumber =
          val.vendorPhoneNumber;
      }
      this.selectedProduct = {};
    });
  };

  addNewItem = (status, focusIndexStatus) => {
    if (status) {
      this.addNewRowEnabled = true;
    }
    let lastItem = [];

    if (this.items.length > 0) {
      lastItem = this.items[this.items.length - 1]; // Getting last element
      if (lastItem.qty > 0) {
        this.items.push({
          id: Date.now() + '',
          product_id: '',
          batch_id: 0,
          item_name: '',
          sku: '',
          barcode: '',
          mrp: 0,
          mrp_before_tax: 0,
          purchased_price: 0,
          offer_price: 0,
          size: 0,
          qty: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          cess: 0,
          igst_amount: 0,
          cgst_amount: 0,
          sgst_amount: 0,
          amount: 0,
          roundOff: 0,
          isEdit: true,
          returnedQty: 0,
          stockQty: 0,
          addOnProperties: [],
          served: false
        });

        runInAction(() => {
          this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;
        });

        this.setEditTable(
          this.enabledRow,
          true,
          focusIndexStatus ? Number('9' + this.enabledRow) : ''
        );
      }
    } else {
      this.items.push({
        id: Date.now() + '',
        product_id: '',
        batch_id: 0,
        item_name: '',
        sku: '',
        barcode: '',
        mrp: 0,
        mrp_before_tax: 0,
        purchased_price: 0,
        offer_price: 0,
        size: 0,
        qty: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        cess: 0,
        igst_amount: 0,
        cgst_amount: 0,
        sgst_amount: 0,
        amount: 0,
        roundOff: 0,
        isEdit: true,
        returnedQty: 0,
        stockQty: 0,
        addOnProperties: [],
        served: false
      });

      runInAction(() => {
        this.enabledRow = this.items.length > 0 ? this.items.length - 1 : 0;
      });

      this.setEditTable(
        this.enabledRow,
        true,
        focusIndexStatus ? Number('9' + this.enabledRow) : ''
      );
    }
  };

  calculateTaxAndDiscountValue = async (index) => {
    const mrp = parseFloat(this.items[index].mrp || 0);
    const quantity = parseFloat(this.items[index].qty) || 1;
    const offerPrice = parseFloat(this.items[index].offer_price || 0);

    let tax =
      (parseFloat(this.items[index].cgst) || 0) +
      (parseFloat(this.items[index].sgst) || 0);
    let igst_tax = parseFloat(this.items[index].igst || 0);

    const taxIncluded = this.items[index].taxIncluded;

    if (!mrp || mrp === 0 || !quantity || quantity === 0) {
      return 0;
    }

    let itemPrice;
    if (offerPrice && offerPrice > 0 && mrp > offerPrice) {
      itemPrice = offerPrice;
    } else {
      itemPrice = mrp;
    }

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
    let mrp_before_tax = 0;

    if (taxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
      totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
    }

    mrp_before_tax = itemPrice - parseFloat(totalGST) - parseFloat(totalIGST);

    let totalItemPriceBeforeTax = parseFloat(mrp_before_tax);

    if (this.items[index].discount_type) {
      totalItemPriceBeforeTax = mrp_before_tax * quantity;

      discountAmount = parseFloat(
        this.getItemDiscountAmount(index, totalItemPriceBeforeTax)
      );
    }

    // price before tax
    this.items[index].mrp_before_tax = parseFloat(mrp_before_tax);

    let discountAmountPerProduct =
      parseFloat(discountAmount) / parseFloat(quantity);

    //per item dicount is removed from per item

    let itemPriceAfterDiscount = 0;

    itemPriceAfterDiscount = mrp_before_tax - discountAmountPerProduct;

    if (discountAmountPerProduct === 0) {
      this.items[index].cgst_amount = (totalGST / 2) * quantity;
      this.items[index].sgst_amount = (totalGST / 2) * quantity;
      this.items[index].igst_amount = totalIGST * quantity;
    }

    await this.calculateTaxAmount(
      index,
      itemPriceAfterDiscount,
      discountAmount
    );
  };

  calculateTaxAmount = (index, itemPriceAfterDiscount, discountAmount) => {
    let tax =
      (parseFloat(this.items[index].cgst) || 0) +
      (parseFloat(this.items[index].sgst) || 0);

    let igst_tax = parseFloat(this.items[index].igst || 0);
    const quantity = this.items[index].qty;
    const taxIncluded = this.items[index].taxIncluded;

    if (!taxIncluded) {
      const totalGST = (itemPriceAfterDiscount * quantity * tax) / 100;
      this.items[index].cgst_amount = totalGST / 2;
      this.items[index].sgst_amount = totalGST / 2;
      this.items[index].igst_amount =
        (itemPriceAfterDiscount * quantity * igst_tax) / 100;
    } else {
      let totalGST = 0;
      let amount = 0;

      if (discountAmount > 0) {
        totalGST = itemPriceAfterDiscount * (tax / 100);
        this.items[index].cgst_amount = totalGST / 2;
        this.items[index].sgst_amount = totalGST / 2;

        amount = itemPriceAfterDiscount * (igst_tax / 100);
        this.items[index].igst_amount = Math.round(amount * 100) / 100;
      }
    }
  };

  getItemDiscountAmount = (index, totalPrice) => {
    let discountAmount = 0;
    const discountType = this.items[index].discount_type;
    if (discountType === 'percentage') {
      let percentage = this.items[index].discount_percent || 0;

      discountAmount = parseFloat((totalPrice * percentage) / 100 || 0).toFixed(
        2
      );

      this.items[index].discount_amount_per_item =
        parseFloat(discountAmount) / this.items[index].qty;
    } else if (discountType === 'amount') {
      discountAmount =
        this.items[index].discount_amount_per_item * this.items[index].qty || 0;
      this.items[index].discount_percent =
        Math.round(((discountAmount / totalPrice) * 100 || 0) * 100) / 100;
    }

    this.items[index].discount_amount = parseFloat(discountAmount);

    return discountAmount;
  };

  changeQuantity = (index, qty) => {
    this.items[index]['qty'] = qty;
    // this.items[index]['qty'] = qty;
  };

  getAmount = async (index) => {
    const quantity = parseFloat(this.items[index].qty) || 1;

    // GST should be calculated after applying the discount product level
    if (quantity > 0) {
      await this.calculateTaxAndDiscountValue(index);
    }
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    let cgst_amount = 0;
    let sgst_amount = 0;
    let igst_amount = 0;
    let cess = 0;
    let discount_amount = 0;
    let mrp_before_tax = 0;

    if (quantity > 0) {
      cgst_amount = parseFloat(this.items[index].cgst_amount || 0);
      sgst_amount = parseFloat(this.items[index].sgst_amount || 0);
      igst_amount = parseFloat(this.items[index].igst_amount || 0);
      cess = parseFloat(this.items[index].cess || 0);
      discount_amount = parseFloat(this.items[index].discount_amount || 0);
      mrp_before_tax = parseFloat(this.items[index].mrp_before_tax || 0);
    } else {
      /*this.items[index].cgst_amount = 0;
      this.items[index].sgst_amount = 0;
      this.items[index].igst_amount = 0;
      this.items[index].cess = 0;
      this.items[index].discount_amount = 0;
      this.items[index].mrp_before_tax = 0;*/
    }

    const finalAmount = parseFloat(
      mrp_before_tax * quantity -
        discount_amount +
        cgst_amount +
        sgst_amount +
        igst_amount +
        cess * quantity
    );

    this.items[index].amount = Math.round(finalAmount * 100) / 100 || 0;

    await parseFloat(this.calculateTotalAmount());
  };

  setWaiterData = (data) => {
    runInAction(() => {
      this.orderData.waiter_name = data.name;
      this.orderData.waiter_phoneNo = data.phoneNumber;
    });
  };

  handleSelectedChairs = (data) => {
    runInAction(() => {
      this.orderData.selectedChairs = data;
    });
  };

  setPaxData = (data) => {
    runInAction(() => {
      this.orderData.numberOfPax = data || 0;
    });
  };

  saveOrEditOrderData = async () => {
    runInAction(() => {
      this.orderData.discount_amount =
        parseFloat(this.orderData.discount_amount) || 0;
      this.orderData.discount_percent =
        parseFloat(this.orderData.discount_percent) || 0;
      this.orderData.packing_charge =
        parseFloat(this.orderData.packing_charge) || 0;
      this.orderData.shipping_charge =
        parseFloat(this.orderData.shipping_charge) || 0;
      this.orderData.numberOfPax = parseFloat(this.orderData.numberOfPax) || 0;

      if (
        this.orderData.splitPaymentList &&
        this.orderData.splitPaymentList.length > 0
      ) {
        for (let i = 0; i < this.orderData.splitPaymentList.length; i++) {
          runInAction(() => {
            this.orderData.splitPaymentList[i].amount =
              parseFloat(this.orderData.splitPaymentList[i].amount) || 0;
          });
        }
      }

      if (this.chosenPaymentType === 'Split') {
        this.orderData.payment_type = this.chosenPaymentType;
      }
    });

    let filteredArray = [];
    for (let item of this.items) {
      let item_json = toJS(item);
      if (parseFloat(item_json.qty) > 0 && item_json.item_name.length > 1) {
        if (item_json.batch_id === null || item_json.batch_id === '') {
          item_json.batch_id = 0;
        }

        if (item_json.mrp === null || item_json.mrp === '') {
          item_json.mrp = 0;
        }

        if (
          item_json.mrp_before_tax === null ||
          item_json.mrp_before_tax === ''
        ) {
          item_json.mrp_before_tax = 0;
        }

        if (
          item_json.purchased_price === null ||
          item_json.purchased_price === ''
        ) {
          item_json.purchased_price = 0;
        }

        if (item_json.offer_price === null || item_json.offer_price === '') {
          item_json.offer_price = 0;
        }

        if (item_json.size === null || item_json.size === '') {
          item_json.size = 0;
        }

        if (item_json.qty === null || item_json.qty === '') {
          item_json.qty = 0;
        }

        if (item_json.cgst === null || item_json.cgst === '') {
          item_json.cgst = 0;
        }

        if (item_json.sgst === null || item_json.sgst === '') {
          item_json.sgst = 0;
        }

        if (item_json.igst === null || item_json.igst === '') {
          item_json.igst = 0;
        }

        if (item_json.cess === null || item_json.cess === '') {
          item_json.cess = 0;
        }

        if (item_json.igst_amount === null || item_json.igst_amount === '') {
          item_json.igst_amount = 0;
        }

        if (item_json.cgst_amount === null || item_json.cgst_amount === '') {
          item_json.cgst_amount = 0;
        }

        if (item_json.sgst_amount === null || item_json.sgst_amount === '') {
          item_json.sgst_amount = 0;
        }

        if (item_json.amount === null || item_json.amount === '') {
          item_json.amount = 0;
        }

        if (item_json.roundOff === null || item_json.roundOff === '') {
          item_json.roundOff = 0;
        }

        if (item_json.returnedQty === null || item_json.returnedQty === '') {
          item_json.returnedQty = 0;
        }

        if (item_json.stockQty === null || item_json.stockQty === '') {
          item_json.stockQty = 0;
        }

        if (
          item_json.discount_amount === null ||
          item_json.discount_amount === ''
        ) {
          item_json.discount_amount = 0;
        } else {
          item_json.discount_amount = parseFloat(item_json.discount_amount);
        }

        if (
          item_json.discount_percent === null ||
          item_json.discount_percent === ''
        ) {
          item_json.discount_percent = 0;
        }

        if (
          item_json.discount_amount_per_item === null ||
          item_json.discount_amount_per_item === ''
        ) {
          item_json.discount_amount_per_item = 0;
        } else {
          item_json.discount_amount_per_item = parseFloat(
            item_json.discount_amount_per_item
          );
        }

        filteredArray.push(item_json);
      }
    }

    runInAction(() => {
      this.items = filteredArray;
    });

    this.items.forEach(async (value, index) => await this.getAmount(index));

    if (this.orderData.isUpdate === false) {
      //check for number of items in the order if it is 0 then don't save
      if (
        (this.items.length === 1 && this.items[0].qty >= 1) ||
        this.items.length > 1
      ) {
        await this.saveOrderData();
      }
    } else {
      if (
        (this.items.length === 1 && this.items[0].qty >= 1) ||
        this.items.length > 1
      ) {
        await this.updateOrderData();
      } else {
        alert('please add atleast one product');
        return;
      }
    }
    await this.loadKotDetails(true);
  };

  saveOrderData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    //get category data and filter by table name
    const kotQueryData = await db.kotdata
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { categoryId: { $eq: this.selectedCategory.categoryId } },
            { tableNumber: { $eq: this.selectedTable.tableNumber } }
          ]
        }
      })
      .exec();

    const changeData = await (async (oldData) => {
      let orders = oldData.ordersData;
      let chairs = oldData.chairsData;

      let existingMatchedOrderIndex = -1;

      let currentItems = 0;
      for (let item of this.items) {
        if (item.qty > 0) {
          ++currentItems;
        }
      }

      //check for number orders
      // if more than 1 then need to check chairs used in other orders
      if (orders && orders !== undefined && orders.length >= 1) {
        //find all other orders in that table
        //find all items to be served in other order + current order items
        //find all used chairs in all other order + current used chairs

        let otherItemsToBeServed = 0;
        let otherOrders = oldData.ordersData.filter(
          (val) => this.orderData.invoice_number !== val.invoice_number
        );

        for (let otherOrder of otherOrders) {
          let items = otherOrder.items;

          for (let item of items) {
            if (!item.served || item.served === false) {
              ++otherItemsToBeServed;
            }
          }
        }

        // Extract all occupied chairs from the ordersData, if it exists
        const occupiedChairs = oldData.ordersData
          ? oldData.ordersData.reduce((acc, order) => {
              const usedChairsArray = order.chairsUsedInString
                .split(',')
                .map((item) => item.trim());
              return acc.concat(usedChairsArray);
            }, [])
          : [];

        let existingSelectedChairs = occupiedChairs;

        let currentOrdersSelctedChairs =
          typeof this.orderData.selectedChairs === 'string'
            ? this.orderData.selectedChairs
                .split(',')
                .map((item) => item.trim())
            : this.orderData.selectedChairs;

        let allSelectedChairs = existingSelectedChairs.concat(
          currentOrdersSelctedChairs
        );

        let allSelectedChairsNoDup = allSelectedChairs.filter(
          (item, index) => allSelectedChairs.indexOf(item) === index
        );

        let availableChairs = [];
        for (let chair of chairs) {
          if (allSelectedChairsNoDup.includes(chair.chairNumber)) {
            chair.isOccupied = true;
          } else {
            chair.isOccupied = false;
            availableChairs.push(chair.chairNumber);
          }
        }

        oldData.chairsAvailableInString = availableChairs.join(',');
        oldData.chairsUsedInString = allSelectedChairsNoDup.join(',');
        oldData.chairsData = chairs;
        oldData.toServe = otherItemsToBeServed + currentItems;

        //check for order is already avaible or not
        existingMatchedOrderIndex = oldData.ordersData.findIndex(
          (el) => el.invoice_number === this.orderData.invoice_number
        );
      } else {
        // initilize as array
        oldData.ordersData = [];

        let selctedChairs =
          typeof this.orderData.selectedChairs === 'string'
            ? this.orderData.selectedChairs
                .split(',')
                .map((item) => item.trim())
            : this.orderData.selectedChairs;

        let avaibleChairs = chairs
          .filter((val) => selctedChairs.indexOf(val.chairNumber) === -1)
          .map((item) => item.chairNumber);

        for (let chair of chairs) {
          chair.isOccupied = selctedChairs.indexOf(chair.chairNumber) !== -1;
        }

        oldData.chairsAvailableInString = avaibleChairs.join(',');
        // console.log(this.orderData.selectedChairs);
        oldData.chairsUsedInString =
          typeof this.orderData.selectedChairs === 'object'
            ? this.orderData.selectedChairs.join(',')
            : this.orderData.selectedChairs;
        oldData.chairsData = chairs;
        oldData.toServe = currentItems;
      }

      //* in case of edit we are not allowing editing selected chairs *
      //in case of editing same order

      let newOrder = {};
      newOrder.invoice_number = this.orderData.invoice_number;
      newOrder.sequenceNumber = this.orderData.sequenceNumber;
      newOrder.waiter_name = this.orderData.waiter_name;
      newOrder.waiter_phoneNo = this.orderData.waiter_phoneNo;
      newOrder.customer_id = this.orderData.customer_id;
      newOrder.customer_name = this.orderData.customer_name;
      newOrder.customer_phoneNo = this.orderData.customer_phoneNo;
      newOrder.invoice_date = this.orderData.invoice_date;
      newOrder.numberOfPax = this.orderData.numberOfPax;

      newOrder.chairsUsedInString =
        typeof this.orderData.selectedChairs === 'object'
          ? this.orderData.selectedChairs.join(',')
          : this.orderData.selectedChairs;
      newOrder.total_amount = this.orderData.total_amount;

      for (let i = this.items.length - 1; i >= 0; --i) {
        if (this.items[i].qty === 0) {
          this.items.splice(i, 1);
        }
      }
      newOrder.items = this.items;

      /**
       * these below fileds not mentioned in kot table
       */
      newOrder.customerGSTNo = this.orderData.customerGSTNo;
      newOrder.customer_address = this.orderData.customer_address;
      newOrder.customer_city = this.orderData.customer_city;
      newOrder.customer_emailId = this.orderData.customer_emailId;
      newOrder.customer_pincode = this.orderData.customer_pincode;
      newOrder.is_roundoff = this.orderData.is_roundoff;
      newOrder.round_amount = this.orderData.round_amount;
      newOrder.total_amount = this.orderData.total_amount;
      newOrder.payment_type = this.orderData.payment_type;
      newOrder.balance_amount = this.orderData.balance_amount;
      newOrder.discount_percent = this.orderData.discount_percent;
      newOrder.discount_amount = this.orderData.discount_amount;
      newOrder.discount_type = this.orderData.discount_type;
      newOrder.packing_charge = this.orderData.packing_charge;
      newOrder.shipping_charge = this.orderData.shipping_charge;
      newOrder.categoryId = this.selectedCategory.categoryId;
      newOrder.categoryName = this.selectedCategory.categoryName;
      newOrder.tableNumber = this.selectedTable.tableNumber;

      newOrder.prefix = this.orderData.prefix;
      newOrder.subPrefix = this.orderData.subPrefix;

      newOrder.bankAccount = this.orderData.bankAccount;
      newOrder.bankAccountId = this.orderData.bankAccountId;
      newOrder.bankPaymentType = this.orderData.bankPaymentType;
      newOrder.paymentReferenceNumber = this.orderData.paymentReferenceNumber;

      newOrder.customerGSTType = this.orderData.customerGSTType;
      newOrder.customerState = this.orderData.customerState;
      newOrder.customerCountry = this.orderData.customerCountry;
      newOrder.splitPaymentList = this.orderData.splitPaymentList;
      newOrder.menuType = this.orderData.menuType;
      newOrder.subTotal = this.orderData.subTotal;

      runInAction(() => {
        //below two are for supporting next screen
        this.orderData.chairsUsedInString =
          typeof this.orderData.selectedChairs === 'object'
            ? this.orderData.selectedChairs.join(',')
            : this.orderData.selectedChairs;
        this.orderData.tableNumber = this.selectedTable.tableNumber;
      });

      //in case of edit of order
      if (existingMatchedOrderIndex >= 0) {
        oldData.ordersData[existingMatchedOrderIndex] = newOrder;
      } else {
        //in case of new order
        oldData.ordersData.push(newOrder);
      }

      oldData.updatedAt = Date.now();

      //save to audit
      audit.addAuditEvent(
        newOrder.invoice_number,
        newOrder.sequenceNumber,
        'Kot-Audit',
        'Save',
        JSON.stringify(oldData),
        '',
        newOrder.invoice_date
      );

      return oldData;
    });

    // console.log(changeData);
    if (kotQueryData) {
      await kotQueryData.atomicUpdate(changeData);
    }

    await this.getTableDataFromKotData(
      this.selectedCategory,
      this.selectedTable,
      this.selectedIndex
    );

    this.handleCloseKOTLoadingMessage();
    this.closeDialog();
  };

  updateOrderData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    //get category data and filter by table name
    const kotQueryData = await db.kotdata
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { categoryId: { $eq: this.selectedCategory.categoryId } },
            { tableNumber: { $eq: this.selectedTable.tableNumber } }
          ]
        }
      })
      .exec();

    const changeData = await (async (oldData) => {
      let orders = oldData.ordersData;

      //check for number orders
      // if more than 1 then need to check chairs used in other orders
      if (orders && orders !== undefined && orders.length >= 1) {
        //find all other orders in that table
        //find all items to be served in other order + current order items
        //find all used chairs in all other order + current used chairs

        for (let i = this.items.length - 1; i >= 0; --i) {
          if (this.items[i].qty === 0) {
            this.items.splice(i, 1);
          }
        }

        let existingOrderIndex = oldData.ordersData.findIndex(
          (el) => el.invoice_number === this.orderData.invoice_number
        );

        let existingOrder = oldData.ordersData[existingOrderIndex];

        let existingOrderUsedChairs = [];

        if (existingOrder && existingOrder.chairsUsedInString) {
          existingOrderUsedChairs = existingOrder.chairsUsedInString
            .split(',')
            .map((item) => item.trim());
        }

        let editedOrderUsedChairs = this.orderData.chairsUsedInString
          .split(',')
          .map((item) => item.trim());

        // add existing order used chairs
        // remove edited order used chairs
        let existingTableCharisAvailable = oldData.chairsAvailableInString
          .split(',')
          .map((item) => item.trim());

        for (let ch of existingOrderUsedChairs) {
          if (!existingTableCharisAvailable.includes()) {
            existingTableCharisAvailable.push(ch);
          }
        }

        for (let ch of editedOrderUsedChairs) {
          let index = existingTableCharisAvailable.findIndex((el) => el === ch);
          existingTableCharisAvailable.splice(index, 1);
        }

        // remove existing order used chairs
        // add edited order used chairs
        let existingTableChairsUsed = oldData.chairsUsedInString
          .split(',')
          .map((item) => item.trim());

        for (let ch of editedOrderUsedChairs) {
          if (!existingTableChairsUsed.includes()) {
            existingTableChairsUsed.push(ch);
          }
        }

        for (let ch of existingOrderUsedChairs) {
          let index = existingTableChairsUsed.findIndex((el) => el === ch);
          existingTableChairsUsed.splice(index, 1);
        }

        // remove existing order to serve
        // add edited order to serve
        let existingTableToServe = oldData.toServe;

        let existingItemsToServe = 0;
        let items = existingOrder ? existingOrder.items : null;
        for (let item of items) {
          if (!item.served || item.served === false) {
            ++existingItemsToServe;
          }
        }

        let editedItemsToServe = 0;
        for (let item of this.items) {
          if (!item.served || item.served === false) {
            ++editedItemsToServe;
          }
        }

        existingTableToServe =
          existingTableToServe - existingItemsToServe + editedItemsToServe;

        // remove old order chars as occupied
        // add edited order chairs as occupied
        let existingTableChairs = oldData.chairsData;

        for (let ch of existingTableChairs) {
          if (existingTableChairsUsed.includes(ch.chairNumber)) {
            ch.isOccupied = false;
          }

          if (editedOrderUsedChairs.includes(ch.chairNumber)) {
            ch.isOccupied = true;
          }
        }

        oldData.chairsAvailableInString =
          existingTableCharisAvailable.join(',');
        oldData.chairsUsedInString = existingTableChairsUsed.join(',');
        oldData.chairsData = existingTableChairs;
        oldData.toServe = existingTableToServe;

        let modifiedOrder = {};
        modifiedOrder.invoice_number = this.orderData.invoice_number;
        modifiedOrder.sequenceNumber = this.orderData.sequenceNumber;
        modifiedOrder.waiter_name = this.orderData.waiter_name;
        modifiedOrder.waiter_phoneNo = this.orderData.waiter_phoneNo;
        modifiedOrder.customer_id = this.orderData.customer_id;
        modifiedOrder.customer_name = this.orderData.customer_name;
        modifiedOrder.customer_phoneNo = this.orderData.customer_phoneNo;
        modifiedOrder.invoice_date = this.orderData.invoice_date;
        modifiedOrder.numberOfPax = this.orderData.numberOfPax;
        modifiedOrder.chairsUsedInString = this.orderData.chairsUsedInString;
        modifiedOrder.total_amount = this.orderData.total_amount;

        modifiedOrder.items = this.items;

        /**
         * these below fileds not mentioned in kot table
         */
        modifiedOrder.customerGSTNo = this.orderData.customerGSTNo;
        modifiedOrder.customer_address = this.orderData.customer_address;
        modifiedOrder.customer_city = this.orderData.customer_city;
        modifiedOrder.customer_emailId = this.orderData.customer_emailId;
        modifiedOrder.customer_pincode = this.orderData.customer_pincode;
        modifiedOrder.is_roundoff = this.orderData.is_roundoff;
        modifiedOrder.round_amount = this.orderData.round_amount;
        modifiedOrder.total_amount = this.orderData.total_amount;
        modifiedOrder.payment_type = this.orderData.payment_type;
        modifiedOrder.balance_amount = this.orderData.balance_amount;
        modifiedOrder.discount_percent = this.orderData.discount_percent;
        modifiedOrder.discount_amount = this.orderData.discount_amount;
        modifiedOrder.discount_type = this.orderData.discount_type;
        modifiedOrder.packing_charge = this.orderData.packing_charge;
        modifiedOrder.shipping_charge = this.orderData.shipping_charge;
        modifiedOrder.categoryId = this.selectedCategory.categoryId;
        modifiedOrder.categoryName = this.selectedCategory.categoryName;
        modifiedOrder.tableNumber = this.selectedTable.tableNumber;

        modifiedOrder.bankAccount = this.orderData.bankAccount;
        modifiedOrder.bankAccountId = this.orderData.bankAccountId;
        modifiedOrder.bankPaymentType = this.orderData.bankPaymentType;
        modifiedOrder.paymentReferenceNumber =
          this.orderData.paymentReferenceNumber;

        modifiedOrder.customerGSTType = this.orderData.customerGSTType;
        modifiedOrder.customerState = this.orderData.customerState;
        modifiedOrder.customerCountry = this.orderData.customerCountry;
        modifiedOrder.splitPaymentList = this.orderData.splitPaymentList;
        modifiedOrder.menuType = this.orderData.menuType;
        modifiedOrder.subTotal = this.orderData.subTotal;

        modifiedOrder.prefix = this.orderData.prefix;
        modifiedOrder.subPrefix = this.orderData.subPrefix;

        runInAction(() => {
          //below two are for supporting next screen
          this.orderData.tableNumber = this.selectedTable.tableNumber;
        });

        //in case of edit of order
        if (existingOrderIndex >= 0) {
          oldData.ordersData[existingOrderIndex] = modifiedOrder;
        }
        oldData.updatedAt = Date.now();
      }

      //save to audit
      audit.addAuditEvent(
        this.orderData.invoice_number,
        this.orderData.sequenceNumber,
        'Kot-Audit',
        'Update',
        JSON.stringify(oldData),
        '',
        this.orderData.invoice_date
      );

      runInAction(() => {
        this.orderData.isUpdate = false;
      });
      return oldData;
    });

    await kotQueryData.atomicUpdate(changeData);

    this.handleCloseKOTLoadingMessage();
    this.closeDialog();
  };

  completeOrder = async (isPrint) => {
    const startTime = performance.now(); // Start timing

    const db = await Db.get();

    for (const value of this.items) {
      const index = this.items.indexOf(value);
      await this.getAmount(index);
    }
    let invoiceData = {};
    let multiDeviceSettings = {};
    let isOnline = true;

    //generate sequenceNumber start

    if (
      this.orderData.sequenceNumber === '' ||
      this.orderData.sequenceNumber === undefined ||
      this.orderData.sequenceNumber === null
    ) {
      if (this.orderData.prefix && this.orderData.prefix.length > 0) {
        invoiceData.prefix = this.orderData.prefix;
      }

      if (this.orderData.subPrefix && this.orderData.subPrefix.length > 0) {
        invoiceData.subPrefix = this.orderData.subPrefix;
      }

      let transSettings = {};

      if (window.navigator.onLine) {
        transSettings = await txnSettings.getTransactionData();
        this.autoPushEInvoice = transSettings.autoPushEInvoice;
        invoiceData.appendYear = transSettings.sales.appendYear;
        invoiceData.multiDeviceBillingSupport =
          transSettings.multiDeviceBillingSupport;
        isOnline = true;
      } else {
        multiDeviceSettings = await txnSettings.getMultiDeviceTransactionData();
        invoiceData.prefix = localStorage.getItem('deviceName');
        invoiceData.subPrefix = '';
        isOnline = false;
      }

      this.orderData.sequenceNumber = await sequence.getFinalSequenceNumber(
        invoiceData,
        'Sales',
        this.orderData.invoice_date,
        this.orderData.invoice_number,
        txnSettings,
        multiDeviceSettings,
        isOnline
      );
    }
    //generate sequenceNumber end

    if (
      this.orderData.sequenceNumber === null ||
      this.orderData.sequenceNumber === '0' ||
      this.orderData.sequenceNumber === '' ||
      this.orderData.sequenceNumber === undefined
    ) {
      this.orderData.sequenceNumber = '';
      await this.handleCloseKOTLoadingMessage();
      await this.handleOpenSequenceNumberFailureAlert();
      await this.handleCloseKOTCompleteLoadingMessage();
      return;
    }

    if (isPrint === true) {
      try {
        const printerList = window.localStorage.getItem('printers');

        if (
          printerList !== null &&
          printerList !== undefined &&
          this.salesInvoiceThermal &&
          this.salesInvoiceThermal.boolDefault
        ) {
          let cloudPrinterSettings =
            await deviceIdHelper.getCloudPrinterSettingsData();
          if (cloudPrinterSettings.enableMessageSend) {
            await deviceIdHelper.submitPrintCommandToServer(
              this.orderData.invoice_number,
              'Kot'
            );
          }

          let data = { ...this.orderData };
          data.items = this.items;
          sendContentForThermalPrinter(
            '',
            this.salesInvoiceThermal,
            data,
            this.kotTxnSettingsData,
            'Kot'
          );
        }
      } catch (error) {
        console.error('An error occurred while printing the kot data:', error);
      }
    }

    const salesData = { ...this.orderData };
    const itemData = cloneDeep(this.items);

    if (salesData.sequenceNumber === null || salesData.sequenceNumber === '') {
      salesData.sequenceNumber = await sequence.getFinalSequenceNumber(
        invoiceData,
        'Sales',
        salesData.invoice_date,
        salesData.invoice_number,
        txnSettings,
        multiDeviceSettings,
        isOnline
      );
    }

    // save to sales table
    kotHelper.saveToSalesTable(salesData, itemData, db);
    //remove from kotdata table
    this.removeFromKotDataTable(salesData, itemData, db);

    this.resetOnlyOrderRelatedData();
    await this.generateInvoiceNumber();
    this.selectOrderDataByTable(this.selectedTable);
    this.loadKotDetails(true);

    this.handleCloseKOTCompleteLoadingMessage();

    const endTime = performance.now(); // End timing
    console.log(
      `completeOrder execution time: ${endTime - startTime} milliseconds`
    );
  };

  resetOnlyOrderRelatedData = async () => {
    runInAction(() => {
      this.items = [];

      this.orderData.numberOfItems = 0;
      this.orderData.total_amount = 0;
      this.orderData.prefix = '';
      this.orderData.prefix = '';
      this.orderData.subPrefix = '';
      this.orderData.customer_id = '';
      this.orderData.customer_name = '';
      this.orderData.customerGSTNo = null;
      this.orderData.customer_address = '';
      this.orderData.customer_phoneNo = '';
      this.orderData.customer_city = '';
      this.orderData.customer_emailId = '';
      this.orderData.customer_pincode = '';
      this.orderData.waiter_name = '';
      this.orderData.waiter_phoneNo = '';
      this.orderData.is_roundoff = true;
      this.orderData.round_amount = 0.0;
      this.orderData.payment_type = 'cash';
      this.orderData.bankAccount = '';
      this.orderData.bankAccountId = '';
      this.orderData.bankPaymentType = '';
      this.orderData.balance_amount = 0.0;
      this.orderData.discount_percent = 0;
      this.orderData.numberOfPax = 0;
      this.orderData.discount_percent = 0;
      this.orderData.discount_amount = 0;
      this.orderData.discount_type = '';
      this.orderData.packing_charge = 0;
      this.orderData.shipping_charge = 0;
      this.orderData.isUpdate = false;
      this.orderData.paymentReferenceNumber = '';
      this.orderData.customerGSTType = '';
      this.orderData.customerState = '';
      this.orderData.customerCountry = '';
      this.orderData.splitPaymentList = [];
      this.orderData.menuType = '';
      this.orderData.subTotal = 0;
      this.orderData.invoice_number = '';
      this.orderData.chairsAvailableInString = '';
    });
  };

  checkOrUncheckOrderItem = async (item) => {
    //used to identify invoice numer
    item.invoice_number = this.orderData.invoice_number;

    if (item.served && item.served === true) {
      await this.markItemAsNotServed(item);
    } else {
      await this.markItemAsServed(item);
    }
  };

  updateItemServedStatus = async (item, isServed) => {
    console.log(item.item_name, isServed);
    //save to DB
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    //get category data and filter by table name
    const kotData = await db.kotdata
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { categoryName: { $eq: this.selectedCategory.categoryName } },
            { tableNumber: { $eq: this.selectedTable.tableNumber } }
          ]
        }
      })
      .exec();

    const changeData = await (async (oldData) => {
      let orders = oldData.ordersData;

      if (orders && orders !== undefined && orders.length > 0) {
        const index = orders.findIndex(
          (el) => el.invoice_number === item.invoice_number
        );
        let actualOrder = orders[index];

        const indexOfItem = actualOrder.items.findIndex(
          (el) => el.id === item.id
        );
        let actualItem = actualOrder.items[indexOfItem];
        actualItem.served = isServed;

        actualOrder.items[indexOfItem] = actualItem;

        // this is to update current cached item list
        let currentCachedItemIndex = this.items.findIndex(
          (el) => el.id === item.id
        );

        runInAction(() => {
          if (currentCachedItemIndex >= 0) {
            this.items[currentCachedItemIndex] = actualItem;
          }
        });

        orders[index] = actualOrder;

        oldData.ordersData = orders;

        // Loop through oldData.ordersData and get toServe quantity
        let toServeCount = 0;
        for (let i = 0; i < oldData.ordersData.length; i++) {
          let order = oldData.ordersData[i];
          for (let j = 0; j < order.items.length; j++) {
            let item = order.items[j];
            if (!item.served) {
              toServeCount++;
            }
          }
        }

        oldData.toServe = toServeCount;

        await this.getTableDataFromKotData(
          this.selectedCategory,
          this.selectedTable,
          this.selectedIndex
        );
      }

      oldData.updatedAt = Date.now();

      return oldData;
    });

    if (kotData) {
      await kotData.atomicUpdate(changeData);
    }

    this.handleCloseKOTServeLoadingMessage();
  };

  markItemAsServed = async (item) => {
    await this.updateItemServedStatus(item, true);
  };

  markItemAsNotServed = async (item) => {
    await this.updateItemServedStatus(item, false);
  };

  setSelectedTableDetails = async (table) => {
    const timestamp = Date.now();
    const businessData = await Bd.getBusinessData();

    const appId = businessData.posDeviceId;
    const id = _uniqueId('i');

    runInAction(() => {
      this.orderData.tableNumber = table.tableNumber;
      this.orderData.categoryId = table.categoryId;
      this.orderData.categoryName = table.categoryName;
      this.orderData.numberOfOrders = 0;
      this.orderData.invoice_number = `${id}${appId}${timestamp}`;
      this.orderData.sequenceNumber = '';
      this.orderData.shipping_charge = 0;
      this.orderData.packing_charge = 0;
      this.orderData.total_amount = 0;
      this.orderData.chairsUsedInString = '';
      this.orderData.numberOfPax = '';
      this.orderData.waiter_name = '';

      //to handle UI refresh. with out this UI refresh not happening

      this.selectedTable.tableNumber = table.tableNumber;
      this.items = [];
    });
  };

  selectOrderDataByTable = async (table) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.kotdata
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { categoryId: { $eq: table.categoryId } },
            { tableNumber: { $eq: table.tableNumber } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No table data is available
          return;
        }

        let numberOfOrders = 0;

        runInAction(() => {
          let orders = data.ordersData;
          if (orders && orders.length > 0) {
            let tableSelectedIndex =
              orders.length - 1 >= this.previousSelectedTableIndex
                ? this.previousSelectedTableIndex
                : orders.length - 1;

            this.orderData = toJS(orders[tableSelectedIndex]);

            this.items = orders[tableSelectedIndex].items;

            //for single order
            if (orders.length === 1) {
              numberOfOrders = 1;
              // console.log(this.orderData);
              // console.log(this.items);
            } else {
              //for multiple orders
              numberOfOrders = orders.length;

              let occupiedChairs = [];
              for (let order of orders) {
                let element = {};
                element.invoice_number = order.invoice_number;
                element.occupiedChairs = order.chairsUsedInString;
                occupiedChairs.push(element);
              }
              this.orderData.occupiedChairs = occupiedChairs;
            }
          }

          if (this.items) {
            if (this.items.length === 1) {
              if (this.items[0].qty > 0) {
                this.orderData.numberOfItems = this.items.length;
              } else {
                this.orderData.numberOfItems = 0;
              }
            } else {
              this.orderData.numberOfItems = this.items.length;
            }
          }

          this.orderData.chairsAvailableInString = data.chairsAvailableInString;
          this.orderData.tableNumber = table.tableNumber;
          this.orderData.categoryId = table.categoryId;
          this.orderData.categoryName = table.categoryName;
          this.orderData.numberOfOrders = numberOfOrders;

          //to handle UI refresh. with out this UI refresh not happening
          this.selectedCategory.categoryId = this.orderData.categoryId;
          this.selectedCategory.categoryName = this.orderData.categoryName;
          this.selectedTable.tableNumber = this.orderData.tableNumber;
        });

        // this.setTableDetailLoader(true);
      });
    // }
  };

  selectAdditionalOrderDataByTable = async (invoice_number, index) => {
    this.previousSelectedTableIndex = index;
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.kotdata
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { categoryId: { $eq: this.selectedCategory.categoryId } },
            { tableNumber: { $eq: this.selectedTable.tableNumber } }
          ]
        }
      })
      .exec()
      .then(async (data) => {
        if (!data) {
          // No table data is available
          return;
        }

        let numberOfOrders = 0;

        runInAction(() => {
          let orders = data.ordersData;

          if (orders && orders !== undefined && orders.length > 0) {
            let orderIndex = orders.findIndex(
              (el) => el.invoice_number === invoice_number
            );

            if (orderIndex <= 0) {
              orderIndex = 0;
            }

            this.orderData = orders[orderIndex];

            let orderItems = this.orderData.items;
            this.items = toJS(orderItems);

            // console.log(this.orderData);
            // console.log(this.items);

            //to handle multiple orders UI
            numberOfOrders = orders.length;

            let occupiedChairs = [];
            for (let order of orders) {
              let element = {};
              element.invoice_number = order.invoice_number;
              element.occupiedChairs = order.chairsUsedInString;
              occupiedChairs.push(element);
            }
            this.orderData.occupiedChairs = occupiedChairs;
          }

          if (
            (this.items.length === 1 && this.items[0].qty >= 1) ||
            this.items.length > 1
          ) {
            this.orderData.numberOfItems = this.items.length;
          } else {
            this.orderData.numberOfItems = 0;
          }

          this.orderData.numberOfOrders = numberOfOrders;
          this.orderData.chairsAvailableInString = data.chairsAvailableInString;
        });
      });
  };

  calculateTotalAmount() {
    if (!this.items) {
      return 0;
    }

    const returnValue = this.items.reduce((a, b) => {
      const amount = toJS(this.getItemTotalAmount(b));

      if (!isNaN(amount)) {
        a = parseFloat(a) + parseFloat(amount);
      }
      return a;
    }, 0);

    let finalValue = returnValue;

    //sun total is exluded with overal discount and shipping charges
    runInAction(() => {
      this.orderData.subTotal = parseFloat(returnValue).toFixed(2);
    });

    const discountAmount = this.calculateDiscountAmount(finalValue);

    let totalAmount = parseFloat(
      parseFloat(finalValue) -
        parseFloat(discountAmount) +
        (parseFloat(this.orderData.packing_charge) || 0)
    );

    let totalTaxableAmount = 0;
    for (let item of this.items) {
      let taxableAmount =
        parseFloat(item.amount) -
        (parseFloat(item.cgst_amount) || 0) -
        (parseFloat(item.sgst_amount) || 0) -
        (parseFloat(item.igst_amount) || 0) -
        (parseFloat(item.cess) || 0);

      totalTaxableAmount = totalTaxableAmount + parseFloat(taxableAmount);
    }

    if (this.orderData.is_roundoff) {
      let beforeRoundTotalAmount = totalAmount;

      if (this.roundingConfiguration === 'Nearest 50') {
        totalAmount = Math.round(totalAmount);
      } else if (this.roundingConfiguration === 'Upward Rounding') {
        totalAmount = Math.ceil(totalAmount);
      } else if (this.roundingConfiguration === 'Downward Rounding') {
        totalAmount = Math.floor(totalAmount);
      }

      runInAction(() => {
        this.orderData.round_amount = parseFloat(
          totalAmount - beforeRoundTotalAmount
        ).toFixed(2);
      });
    }

    runInAction(() => {
      this.orderData.total_amount = totalAmount;
    });
    return totalAmount;
  }

  get getTotalAmount() {
    if (!this.items) {
      return 0;
    }

    const returnValue = this.items.reduce((a, b) => {
      const amount = toJS(this.getItemTotalAmount(b));

      if (!isNaN(amount)) {
        a = parseFloat(a) + parseFloat(amount);
      }
      return a;
    }, 0);

    let finalValue = returnValue;

    //sun total is exluded with overal discount and shipping charges
    runInAction(() => {
      this.orderData.subTotal = parseFloat(returnValue).toFixed(2);
    });

    const discountAmount = this.calculateDiscountAmount(finalValue);

    let totalAmount = parseFloat(
      parseFloat(finalValue) -
        parseFloat(discountAmount) +
        (parseFloat(this.orderData.packing_charge) || 0)
    );

    let totalTaxableAmount = 0;
    for (let item of this.items) {
      let taxableAmount =
        parseFloat(item.amount) -
        (parseFloat(item.cgst_amount) || 0) -
        (parseFloat(item.sgst_amount) || 0) -
        (parseFloat(item.igst_amount) || 0) -
        (parseFloat(item.cess) || 0);

      totalTaxableAmount = totalTaxableAmount + parseFloat(taxableAmount);
    }

    if (this.orderData.is_roundoff) {
      let beforeRoundTotalAmount = totalAmount;

      if (this.roundingConfiguration === 'Nearest 50') {
        totalAmount = Math.round(totalAmount);
      } else if (this.roundingConfiguration === 'Upward Rounding') {
        totalAmount = Math.ceil(totalAmount);
      } else if (this.roundingConfiguration === 'Downward Rounding') {
        totalAmount = Math.floor(totalAmount);
      }

      runInAction(() => {
        this.orderData.round_amount = parseFloat(
          totalAmount - beforeRoundTotalAmount
        ).toFixed(2);
      });
    }

    runInAction(() => {
      this.orderData.total_amount = totalAmount;
    });
    return totalAmount;
  }

  calculateDiscountAmount(tempAmount) {
    let discountAmount = 0;

    runInAction(() => {
      const discountType = this.orderData.discount_type;

      if (discountType === 'percentage') {
        let percentage = parseFloat(this.orderData.discount_percent || 0);

        discountAmount = parseFloat((tempAmount * percentage) / 100 || 0);

        this.orderData.discount_amount = discountAmount;
      } else if (discountType === 'amount') {
        discountAmount = parseFloat(this.orderData.discount_amount || 0);

        this.orderData.discount_percent =
          Math.round(((discountAmount / tempAmount) * 100 || 0) * 100) / 100;
      }
    });

    return discountAmount;
  }

  setFocusLastIndex = (val) => {
    runInAction(() => {
      this.FocusLastIndex = val;
    });
  };

  deleteItem = async (index) => {
    runInAction(() => {
      this.items.splice(index, 1);

      this.enabledRow = index > 0 ? index - 1 : 0;

      if (this.items.length > 0) {
        this.setEditTable(this.enabledRow, true, Number('9' + this.enabledRow));
      } else {
        this.FocusLastIndex = 21;
      }
    });

    await parseFloat(this.calculateTotalAmount());
  };

  handleBatchListModalClose = () => {
    this.OpenBatchList = false;
  };

  addEditItemsToOrder = async () => {
    //---------
    //take data from kot details
    // load in sales pop up
    // update data from kot details object and table
  };

  getOrdersDataForTable = async () => {
    //get all orders sorted by chairs
  };

  setTableDetailLoader = async (value) => {
    runInAction(() => {
      this.tableDetailsLoader = value;
    });
  };

  setPaymentMode = (value) => {
    runInAction(() => {
      this.orderData.bankPaymentType = value;
    });
  };

  setPaymentReferenceNumber = (value) => {
    runInAction(() => {
      this.orderData.paymentReferenceNumber = value;
    });
  };

  setBankAccountData = (value, typeChosen) => {
    if (value.accountDisplayName && value.id) {
      runInAction(() => {
        this.orderData.payment_type = typeChosen;
        this.orderData.bankAccount = value.accountDisplayName;
        this.orderData.bankAccountId = value.id;
      });
    }
  };

  removeFromKotDataTable = async (orderData, items, db) => {
    const businessData = await Bd.getBusinessData();

    const kotQueryData = await db.kotdata
      .findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { categoryId: { $eq: orderData.categoryId } },
            { tableNumber: { $eq: orderData.tableNumber } }
          ]
        }
      })
      .exec();

    const changeData = await (async (oldData) => {
      let orders = oldData.ordersData;
      let chairs = oldData.chairsData;

      //check for number orders
      // if more than 1 then need to check chairs used in other orders
      if (orders && orders.length > 1) {
        let otherOrders = oldData.ordersData.filter(
          (val) => orderData.invoice_number !== val.invoice_number
        );

        const matchedOrderIndex = oldData.ordersData.findIndex(
          (val) => orderData.invoice_number === val.invoice_number
        );

        let matchedOrder = oldData.ordersData[matchedOrderIndex];

        let removeToServedCount = 0;
        let items = matchedOrder.items;

        for (let item of items) {
          if (!item.served || item.served === false) {
            ++removeToServedCount;
          }
        }

        let chairsUsed = oldData.chairsUsedInString
          .split(',')
          .map((item) => item.trim());

        let chairsAvailable = oldData.chairsAvailableInString
          .split(',')
          .map((item) => item.trim());

        let chairsUsedInCurrentOrder = matchedOrder.chairsUsedInString
          .split(',')
          .map((item) => item.trim());

        for (let ch of chairsUsedInCurrentOrder) {
          if (!chairsAvailable.includes(ch)) {
            chairsAvailable.push(ch);
          }

          const index = chairsUsed.indexOf(ch);
          if (index > -1) {
            chairsUsed.splice(index, 1);
          }
        }

        for (let chair of chairs) {
          if (chairsUsedInCurrentOrder.includes(chair.chairNumber)) {
            chair.isOccupied = false;
          }
        }

        oldData.chairsAvailableInString = chairsAvailable.join(',');
        oldData.chairsUsedInString = chairsUsed.join(',');
        oldData.chairsData = chairs;
        oldData.toServe = parseInt(oldData.toServe) - removeToServedCount;

        if (oldData.toServe < 0) {
          oldData.toServe = 0;
        }
        oldData.ordersData = otherOrders;
      } else {
        // initilize as array
        let availableChairs = [];

        for (let chair of chairs) {
          chair.isOccupied = false;
          availableChairs.push(chair.chairNumber);
        }

        oldData.chairsAvailableInString = availableChairs.join(',');
        oldData.chairsUsedInString = null;
        oldData.chairsData = chairs;
        oldData.toServe = 0;
        oldData.ordersData = [];
      }

      oldData.updatedAt = Date.now();
      return oldData;
    });

    // console.log(changeData);
    try {
      if (kotQueryData) {
        await kotQueryData.atomicUpdate(changeData);
      }
    } catch (err) {
      console.log('error occured in update');
    }
  };

  handleOpenKOTLoadingMessage = async () => {
    runInAction(() => {
      this.openKOTLoadingAlertMessage = true;
    });
  };

  handleCloseKOTLoadingMessage = async () => {
    runInAction(() => {
      this.openKOTLoadingAlertMessage = false;
    });
  };

  handleOpenKOTErrorAlertMessage = async () => {
    runInAction(() => {
      this.openKOTErrorAlertMessage = true;
    });
  };

  handleCloseKOTErrorAlertMessage = async () => {
    runInAction(() => {
      this.openKOTErrorAlertMessage = false;
    });
  };

  setInvoiceDate = (value) => {
    runInAction(() => {
      this.orderData.invoice_date = value;
    });
  };

  setItemDiscount = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].discount_percent = value ? parseFloat(value) : '';
    this.items[index].discount_type = 'percentage';

    if (this.items[index].discount_percent === '') {
      this.items[index].discount_amount = '';
      this.items[index].discount_amount_per_item = '';
    }
    this.getAmount(index);
  };

  setItemDiscountAmount = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (value) {
      let discountPerItem = value ? parseFloat(value) : 0;

      this.items[index].discount_amount_per_item = parseFloat(discountPerItem);

      this.items[index].discount_amount = parseFloat(discountPerItem)
        ? parseFloat(discountPerItem * this.items[index].qty)
        : '';
      this.items[index].discount_type = 'amount';
    } else {
      this.items[index].discount_amount = value ? parseFloat(value) : '';

      if (this.items[index].discount_amount === '') {
        this.items[index].discount_percent = '';
        this.items[index].discount_amount_per_item = '';
      }
    }

    this.getAmount(index);
  };

  setCGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].cgst = value ? parseFloat(value) : '';
    this.items[index].sgst = value ? parseFloat(value) : '';

    this.getAmount(index);
  };

  setSGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].cgst = value ? parseFloat(value) : '';
    this.items[index].sgst = value ? parseFloat(value) : '';

    this.getAmount(index);
  };

  setIGST = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].igst = value ? parseFloat(value) : '';
    this.getAmount(index);
  };

  setCess = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    this.items[index].cess = value ? value : '';
    this.getAmount(index);
  };

  setTaxIncluded = (index) => {
    this.items[index].taxIncluded = this.items[index].taxIncluded !== true;

    this.getAmount(index);
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
      for (let payment of this.orderData.splitPaymentList) {
        splitPaymentAmt += parseFloat(payment.amount);
      }
      if (splitPaymentAmt === 0) {
        this.resetSplitPaymentDetails();
      }
    });
  };

  resetSplitPaymentDetails = async () => {
    runInAction(() => {
      this.orderData.payment_type = 'cash';
      this.chosenPaymentType = 'Cash';
    });
    this.prepareSplitPaymentList();
  };

  setSplitPaymentSettingsData = (value) => {
    runInAction(() => {
      this.splitPaymentSettingsData = value;
    });
    if (
      !this.orderData.isUpdate ||
      (this.orderData.splitPaymentList &&
        this.orderData.splitPaymentList.length === 0)
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
      this.orderData.splitPaymentList[index][property] = value;
    });
  };

  prepareSplitPaymentList = async () => {
    runInAction(() => {
      this.orderData.splitPaymentList = [];
    });
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
          this.orderData.splitPaymentList.push(cashPayment);
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
            this.orderData.splitPaymentList.push(giftCardPayment);
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
            this.orderData.splitPaymentList.push(customFinancePayment);
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
            this.orderData.splitPaymentList.push(bankPayment);
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
        this.orderData.splitPaymentList.push(bankPayment);
      });
    }
  };

  removeSplitPayment = (index) => {
    runInAction(() => {
      this.orderData.splitPaymentList.splice(index, 1);
    });
  };

  setChosenPaymentType = (value) => {
    runInAction(() => {
      this.chosenPaymentType = value;
    });
  };

  setTaxSettingsData = (value) => {
    runInAction(() => {
      this.taxSettingsData = value;
    });
  };

  setKotTxnEnableFieldsMap = (salesTransSettingData) => {
    runInAction(() => {
      this.kotTxnEnableFieldsMap = new Map();
      this.kotTxnSettingsData = salesTransSettingData;
      if (salesTransSettingData.businessId.length > 2) {
        const productLevel = salesTransSettingData.enableOnTxn.productLevel;
        productLevel.map((item) => {
          if (this.kotTxnEnableFieldsMap.has(item.name)) {
            this.kotTxnEnableFieldsMap.set(item.name, item.enabled);
          } else {
            this.kotTxnEnableFieldsMap.set(item.name, item.enabled);
          }
        });

        const billLevel = salesTransSettingData.enableOnTxn.billLevel;
        billLevel.map((item) => {
          if (this.kotTxnEnableFieldsMap.has(item.name)) {
            this.kotTxnEnableFieldsMap.set(item.name, item.enabled);
          } else {
            this.kotTxnEnableFieldsMap.set(item.name, item.enabled);
          }
        });

        if (
          this.orderData &&
          !this.orderData.isUpdate &&
          this.kotTxnEnableFieldsMap.get('enable_roundoff_default')
        ) {
          this.orderData.is_roundoff = true;
        }
      }
    });
  };

  setMenuType = (value) => {
    runInAction(() => {
      this.orderData.menuType = value;
    });
  };
  setLevel3CategoriesList = (value) => {
    runInAction(() => {
      this.level3CategoriesList = value;
    });
  };

  setMrp = (index, value) => {
    if (!this.items) {
      return;
    }
    if (!this.items[index]) {
      return;
    }

    if (parseFloat(value) >= 0) {
      this.items[index].offer_price = parseFloat(value);
      this.items[index].mrp = parseFloat(value);

      if (this.items[index].qty === 0) {
        this.items[index].qty = 1;
      }

      if (this.items[index].qty) {
        this.getAmount(index);
      }
    } else {
      this.items[index].mrp_before_tax = value ? parseFloat(value) : '';
      this.items[index].mrp = value ? parseFloat(value) : '';
    }
  };

  toggleRoundOff = () => {
    if (!this.orderData) {
      return;
    }
    this.orderData.is_roundoff = !this.orderData.is_roundoff;

    parseFloat(this.calculateTotalAmount());
  };

  setRoundOff = (value) => {
    this.orderData.is_roundoff = value;
  };

  setRoundingConfiguration = (value) => {
    runInAction(() => {
      this.roundingConfiguration = value;
    });
  };

  get getRoundedAmount() {
    if (!this.orderData.is_roundoff) {
      return 0;
    }
    return parseFloat(this.orderData.round_amount);
  }

  setSalesTxnSettings = (salesTransSettingData) => {
    runInAction(() => {
      this.saleTxnSettingsData = salesTransSettingData;
    });
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

  setInvoiceThermalSetting = (invoicThermal) => {
    this.salesInvoiceThermal = invoicThermal;
  };

  cancelKOTData = async () => {
    const db = await Db.get();
    await this.removeFromKotDataTable(this.orderData, this.items, db);
    await this.resetOnlyOrderRelatedData();
  };

  handleOpenKOTCompleteLoadingMessage = async () => {
    runInAction(() => {
      this.openKOTCompleteLoadingAlertMessage = true;
    });
  };

  handleCloseKOTCompleteLoadingMessage = async () => {
    runInAction(() => {
      this.openKOTCompleteLoadingAlertMessage = false;
    });
  };

  handleOpenKOTServeLoadingMessage = async () => {
    runInAction(() => {
      this.openKOTServeLoadingAlertMessage = true;
    });
  };

  handleCloseKOTServeLoadingMessage = async () => {
    runInAction(() => {
      this.openKOTServeLoadingAlertMessage = false;
    });
  };

  getItemTotalAmount = (item) => {
    let total = parseFloat(item.amount);
    if (item.addOnProperties && item.addOnProperties.length > 0) {
      item.addOnProperties.forEach((addOn) => {
        total += parseFloat(addOn.amount || 0) * parseFloat(item.qty || 0);
      });
    }
    return total;
  };

  initializeSettings = () => {
    console.log('kot initializeSettings called');
    runInAction(async () => {
      const saleTransSettings = await getKOTTransactionSettings();
      this.setKotTxnEnableFieldsMap(saleTransSettings);
      this.setTaxSettingsData(await getTaxSettings());
      let bankAccountsData = await getBankAccounts();
      let bankAccounts = bankAccountsData.map((item) => {
        let bankAccount = {};

        bankAccount.accountDisplayName = item.accountDisplayName;
        bankAccount.balance = item.balance;
        return item;
      });
      this.setBankAccountList(bankAccounts);
      this.auditSettings = await getAuditSettings();
      this.waiters = await getWaiters();
      this.setSplitPaymentSettingsData(await getSplitPaymentSettings());
      this.transaction = await getTransactionSettings();
      const printerObject = await getPrinterSettings();
      this.setInvoiceThermalSetting(printerObject.invoiceThermal);
    });
  };

  constructor() {
    makeObservable(this, {
      waiters: observable,
      selectedIndex: observable,
      openForNewSale: action,
      openAddSaleDialog: observable,
      handleBatchListModalClose: action,
      OpenBatchList: observable,
      orderData: observable,
      selectCustomer: action,
      getAmount: action,
      getTotalAmount: computed,
      selectedProduct: observable,
      addNewRowEnabled: observable,
      getAddRowEnabled: action,
      setAddRowEnabled: action,
      selectProductFromBatch: action,
      selectedTable: observable,
      selectedCategory: observable,
      kotDetails: observable,
      firstTimeLoading: observable,
      getFirstTimeLoading: action,
      setFirstTimeLoading: action,
      lastSelectedTableNo: observable,
      items: observable,
      getLastSelectedTableNo: observable,
      previousOrderData: observable,
      previousSelectedTableIndex: observable,
      FocusLastIndex: observable,
      setFocusLastIndex: action,
      tableDetailsLoader: observable,
      setBankAccountData: action,
      setPaymentMode: action,
      setPaymentReferenceNumber: action,
      openInvoiceNumModal: observable,
      openInvNumDubCheck: observable,
      setNoFloorDataProperty: action,
      setFloorData: action,
      openKOTLoadingAlertMessage: observable,
      openKOTErrorAlertMessage: observable,
      setInvoiceDate: action,
      kotTxnEnableFieldsMap: observable,
      taxSettingsData: observable,
      getRoundedAmount: computed,
      openSplitPaymentDetails: observable,
      saleTxnSettingsData: observable,
      sequenceNumberFailureAlert: observable,
      openKOTCompleteLoadingAlertMessage: observable,
      openKOTServeLoadingAlertMessage: observable,
      productAddOnsData: observable,
      openAddonList: observable,
      addonIndex: observable,
      level3CategoriesList: observable,
      selectedProductData: observable,
      openTouchAddSaleDialog: observable,
      discType: observable,
      bankAccountsList: observable,
      auditSettings: observable,
      transaction: observable,
      salesInvoiceThermal: observable
    });
  }
}

export default new KotStore();