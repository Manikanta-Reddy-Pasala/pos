/* eslint-disable import/newline-after-import */
import { createRxDatabase, removeRxDatabase } from 'rxdb';
import { addRxPlugin } from 'rxdb/plugins/core';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { RxDBReplicationPlugin } from 'rxdb/plugins/replication';
import { RxDBUpdatePlugin } from 'rxdb/plugins/update';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBReplicationGraphQLPlugin } from 'rxdb/plugins/replication-graphql';
import { RxDBNoValidatePlugin } from 'rxdb/plugins/no-validate';

import * as syncError from '../../components/Helpers/SyncErrorHelper';

import { BusinessListSchema } from '../Schema/BusinessListSchema';
import { SalesSchema, salesSyncQueryBuilder } from '../Schema/SalesSchema';
import {
  CashAdjustmentsSchema,
  cashAdjustmentsSyncQueryBuilder
} from '../Schema/CashAdjustmentsSchema';
import {
  PaymentInSchema,
  paymentinSyncQueryBuilder
} from '../Schema/PaymentInSchema';
import {
  PaymentOutSchema,
  paymentoutSyncQueryBuilder
} from '../Schema/PaymentOutSchema';
import {
  SalesReturnSchema,
  salesreturnSyncQueryBuilder
} from '../Schema/SalesReturnSchema';
import {
  BusinessCategoriesSchema,
  businesscategoriesQueryBuilder
} from '../Schema/BusinessCategoriesSchema';
import {
  BusinessProductSchema,
  businessproductSyncQueryBuilder
} from '../Schema/BusinessProductListSchema';
import {
  ExpensesSchema,
  expensesSyncQueryBuilder
} from '../Schema/ExpensesSchema';
import {
  PartiesSchema,
  partiesSyncQueryBuilder
} from '../Schema/PartiesSchema';
import {
  ExpenseCategoriesSchema,
  expensecategoriesSyncQueryBuilder
} from '../Schema/ExpenseCategoriesSchema';
import { BusinessCategoriesLevel1Schema } from '../Schema/BusinessCategoriesLevel1Schema';
import { UserSchema } from '../Schema/UserSchema';
import {
  PurchasesSchema,
  purchasesSyncQueryBuilder
} from '../Schema/PurchasesSchema';
import {
  PurchasesReturnSchema,
  purchasesreturnSyncQueryBuilder
} from '../Schema/PurchasesReturnSchema';
import {
  TransactionSettingsSchema,
  transactionSettingsQueryBuilder
} from '../Schema/TransactionSettingsSchema';
import { DeviceIDSchema } from '../Schema/DeviceIdSchema';
import { LoginSchema } from '../Schema/LoginSchema';
import {
  SequenceNumbersSchema,
  sequenceSyncQueryBuilder
} from '../Schema/SequenceNumbersSchema';
import {
  PrinterSettingsSchema,
  printerSettingsSyncQueryBuilder
} from '../Schema/PrinterSettingsSchema';

import {
  ProductTxnSchema,
  productTxnSyncQueryBuilder
} from '../Schema/ProductTxnSchema';
import {
  BarcodeSchema,
  barcodeSettingsSyncQueryBuilder
} from '../Schema/BarcodeSchema';

import {
  WaitersSchema,
  waitersSyncQueryBuilder
} from '../Schema/WaitersSchema';

import { KotSchema, kotSyncQueryBuilder } from '../Schema/KotDataSchema';
import {
  TaxSettingsSchema,
  TaxSettingsSyncQueryBuilder
} from '../Schema/TaxSettingsSchema';

import {
  OpeningStockValueSchema,
  openingStockValueSyncQueryBuilder
} from '../Schema/OpeningStockValue';

import {
  CashInHandSchema,
  cashInHandSyncQueryBuilder
} from '../Schema/CashInHand';

import {
  BankAccountsSchema,
  bankAccountsSyncQueryBuilder
} from '../Schema/BankAccountsSchema';

import {
  AllTransactionsSchema,
  allTransactionsSyncQueryBuilder
} from '../Schema/AllTransactionsSchema';

import {
  EmployeesSchema,
  employeesSyncQueryBuilder
} from '../Schema/Employees';

import {
  SpecialDaysManagementSchema,
  specialDaysManagementSyncQueryBuilder
} from '../Schema/SpecialDaysManagementSchema';

import {
  SaleTransactionSettingsSchema,
  saleTransactionSettingsQueryBuilder
} from '../Schema/SaleTransactionSettingsSchema';

import {
  ApprovalsSchema,
  approvalsSyncQueryBuilder
} from '../Schema/ApprovalsSchema';

import {
  JobWorkSchema,
  jobWorkSchemaSyncQueryBuilder
} from '../Schema/JobWorkSchema';

import {
  JobWorkReceiptSchema,
  jobWorkReceiptSchemaSyncQueryBuilder
} from '../Schema/JobWorkReceiptSchema';

import {
  WhatsAppSettingsSchema,
  whatsAppSettingsSyncQueryBuilder
} from '../Schema/WhatsAppSettingsSchema';

import {
  WorkLossSchema,
  workLossSchemaSyncQueryBuilder
} from '../Schema/WorkLossSchema';

import {
  ApprovalTransactionSettingsSchema,
  approvalTransactionSettingsQueryBuilder
} from '../Schema/ApprovalTransactionSettingsSchema';

import {
  SalesQuotationSchema,
  salesQuotationSyncQueryBuilder
} from '../Schema/SalesQuotationSchema';

import {
  MobileUserPermissionsSchema,
  mobileUserPermissionsSyncQueryBuilder
} from '../Schema/MobileUserPermissionSchema';
import {
  JobWorkInSchema,
  jobWorkInSchemaSyncQueryBuilder
} from '../Schema/JobWorkInSchema';
import {
  JobWorkInTransactionSettingsSchema,
  jobWorkInTransactionSettingsQueryBuilder
} from '../Schema/JobWorkInTransactionSettingsSchema';
import {
  PurchaseTransactionSettingsSchema,
  purchaseTransactionSettingsQueryBuilder
} from '../Schema/PurchaseTransactionSettingsSchema';
import {
  PurchaseOrderTransactionSettingsSchema,
  purchaseOrderTransactionSettingsQueryBuilder
} from '../Schema/PurchaseOrderTransactionSettingsSchema';
import {
  DeliveryChallanSchema,
  deliveryChallanSyncQueryBuilder
} from '../Schema/DeliveryChallanSchema';
import {
  DeliveryChallanTransactionSettingsSchema,
  deliveryChallanTransactionSettingsQueryBuilder
} from '../Schema/DeliveryChallanTransactionSettingsSchema';
import {
  PurchaseOrderSchema,
  purchaseOrderSyncQueryBuilder
} from '../Schema/PurchaseOrderSchema';

import {
  AuditSchema,
  auditSchemaSyncQueryBuilder
} from '../Schema/AuditSchema';

import {
  SyncErrorSchema,
  syncErrorSchemaSyncQueryBuilder
} from '../Schema/SyncErrorSchema';

import {
  DocumentSyncErrorSchema,
  documentSyncErrorSchemaSyncQueryBuilder
} from '../Schema/DocumentSyncErrorSchema';

import {
  SaleOrderTransactionSettingsSchema,
  saleOrderTransactionSettingsQueryBuilder
} from '../Schema/SaleOrderTransactionSettingsSchema';

import {
  SaleOrderSchema,
  saleOrderSchemaSyncQueryBuilder
} from '../Schema/SaleOrderSchema';

import {
  ReportEmployeeListSchema,
  reportEmployeeListSyncQueryBuilder
} from '../Schema/ReportEmployeeListSchema';

import {
  SaleQuotationTransactionSettingsSchema,
  saleQuotationTransactionSettingsQueryBuilder
} from '../Schema/SaleQuotationTransactionSettingsSchema';

import {
  RetrieveDeletedTransactionsSchema,
  retrieveDeletedTransactionsSyncQueryBuilder
} from '../Schema/RetrieveDeletedTransactionsSchema';

import {
  ExpenseTransactionSettingsSchema,
  expenseTransactionSettingsQueryBuilder
} from '../Schema/ExpenseTransactionSettingsSchema';

import { RateSchema, rateSyncQueryBuilder } from '../Schema/RateSchema';

import { TCSSchema, tcsSyncQueryBuilder } from '../Schema/TCSSchema';

import {
  WarehouseSchema,
  warehouseSyncQueryBuilder
} from '../Schema/WarehouseSchema';

import {
  POSUserPermissionsSchema,
  posUserPermissionsSyncQueryBuilder
} from '../Schema/POSUserPermissionSchema';

import {
  CloudPrinterSettingsSchema,
  cloudPrinterSettingsSyncQueryBuilder
} from '../Schema/CloudPrinterSettingsSchema';

import {
  ManufacturingExpensesSchema,
  manufacturingDirectExpensesSyncQueryBuilder
} from '../Schema/ManufacturingExpensesSchema';

import {
  RawMaterialsOpeningStockValueSchema,
  rawmaterialsopeningStockValueSyncQueryBuilder
} from '../Schema/RawMaterialsOpeningStockValue';

import {
  ProductTransactionSettingsSchema,
  productTransactionSettingsQueryBuilder
} from '../Schema/ProductTransactionSettingsSchema';

import {
  SplitPaymentSettingsSchema,
  splitPaymentSettingsSyncQueryBuilder
} from '../Schema/SplitPaymentSettingsSchema';

import { TDSSchema, tdsSyncQueryBuilder } from '../Schema/TDSSchema';

import {
  PaymentInTransSettingsSchema,
  paymentInTransactionSettingsQueryBuilder
} from '../Schema/PaymentInTransSettingsSchema';

import {
  PaymentOutTransSettingsSchema,
  paymentOutTransactionSettingsQueryBuilder
} from '../Schema/PaymentOutTransSettingsSchema';

import {
  KotTransactionSettingsSchema,
  kotTransactionSettingsQueryBuilder
} from '../Schema/KotTransactionSettingsSchema';

import { DataDumpSchema } from '../Schema/DataDumpSchema';

import {
  MultiDeviceSettingsSchema,
  multiDeviceSettingsQueryBuilder
} from '../Schema/MultiDeviceSettingsSchema';

import {
  CancelTransactionsSchema,
  retrieveCancelTransactionsSyncQueryBuilder
} from '../Schema/CancelTransactionsSchema';

import {
  TallyMasterSettingsSchema,
  tallyMasterSettingsSyncQueryBuilder
} from '../Schema/TallyMasterSettingsSchema';

import {
  TallyBankSettingsSchema,
  tallyBankMasterSettingsSyncQueryBuilder
} from '../Schema/TallyBankSettingsSchema';

import {
  BackToBackPurchaseSchema,
  backToBackPurchasesSyncQueryBuilder
} from '../Schema/BackToBackPurchaseSchema';

import {
  AuditSettingsSchema,
  auditSettingsSyncQueryBuilder
} from '../Schema/AuditSettingsSchema';

import {
  AccountingNotesSchema,
  accountingNotesSyncQueryBuilder
} from '../Schema/AccountingNotesSchema';

import {
  RemindersSchema,
  reminderSettingsSyncQueryBuilder
} from '../Schema/RemindersSchema';

import {
  AddOnsGroupSchema,
  addOnsGroupSyncQueryBuilder
} from '../Schema/AddOnsGroupSchema';

import { AddOnsSchema, addOnsSyncQueryBuilder } from '../Schema/AddOnsSchema';

import {
  LoyaltySettingsSchema,
  loyaltySettingsSyncQueryBuilder
} from '../Schema/LoyaltySettingsSchema';

import {
  SchemeManagementSchema,
  schemeManagementSyncQueryBuilder
} from '../Schema/SchemeManagementSchema';

import {
  SchemeTypesSchema,
  schemeTypesSyncQueryBuilder
} from '../Schema/SchemeTypesSchema';

import {
  ProductGroupSchema,
  productGroupSyncQueryBuilder
} from '../Schema/ProductGroupSchema';

import {
  SessionGroupSchema,
  sessionGroupSyncQueryBuilder
} from '../Schema/SessionGroupSchema';

import {
  EmployeeTypesSchema,
  employeeTypesSyncQueryBuilder
} from '../Schema/EmployeeTypesSchema';

import {
  ReportSettingsSchema,
  reportSettingsSyncQueryBuilder
} from '../Schema/ReportSettingsSchema';

import {
  TallySequenceNumbersSchema,
  tallySequenceNumbersSyncQueryBuilder
} from '../Schema/TallySequenceNumbersSchema';

require('dotenv').config();

addRxPlugin(require('pouchdb-adapter-idb'));
addRxPlugin(require('pouchdb-adapter-http'));
addRxPlugin(require('pouchdb-find'));
addRxPlugin(RxDBLeaderElectionPlugin);
addRxPlugin(RxDBReplicationPlugin);
addRxPlugin(RxDBReplicationGraphQLPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBNoValidatePlugin);

const collections = [
  SalesSchema,
  PaymentInSchema,
  BusinessCategoriesSchema,
  BusinessProductSchema,
  ExpensesSchema,
  ExpenseCategoriesSchema,
  BusinessCategoriesLevel1Schema,
  UserSchema,
  PartiesSchema,
  SalesReturnSchema,
  PurchasesSchema,
  PurchasesReturnSchema,
  PaymentOutSchema,
  BusinessListSchema,
  TransactionSettingsSchema,
  DeviceIDSchema,
  LoginSchema,
  PrinterSettingsSchema,
  CashAdjustmentsSchema,
  ProductTxnSchema,
  BarcodeSchema,
  WaitersSchema,
  KotSchema,
  TaxSettingsSchema,
  OpeningStockValueSchema,
  CashInHandSchema,
  BankAccountsSchema,
  AllTransactionsSchema,
  EmployeesSchema,
  SequenceNumbersSchema,
  SpecialDaysManagementSchema,
  SaleTransactionSettingsSchema,
  ApprovalsSchema,
  JobWorkSchema,
  JobWorkReceiptSchema,
  WhatsAppSettingsSchema,
  WorkLossSchema,
  MobileUserPermissionsSchema,
  JobWorkInSchema,
  JobWorkInTransactionSettingsSchema,
  AuditSchema,
  SyncErrorSchema,
  DocumentSyncErrorSchema,
  SaleOrderTransactionSettingsSchema,
  SaleOrderSchema,
  RateSchema,
  ExpenseTransactionSettingsSchema,
  POSUserPermissionsSchema,
  TCSSchema,
  WarehouseSchema,
  CloudPrinterSettingsSchema,
  ManufacturingExpensesSchema,
  RawMaterialsOpeningStockValueSchema,
  ProductTransactionSettingsSchema,
  TDSSchema,
  SplitPaymentSettingsSchema,
  PaymentInTransSettingsSchema,
  PaymentOutTransSettingsSchema,
  KotTransactionSettingsSchema,
  DataDumpSchema,
  MultiDeviceSettingsSchema,
  CancelTransactionsSchema,
  TallyMasterSettingsSchema,
  TallyBankSettingsSchema,
  BackToBackPurchaseSchema,
  AuditSettingsSchema,
  AccountingNotesSchema,
  RemindersSchema,
  AddOnsGroupSchema,
  AddOnsSchema,
  LoyaltySettingsSchema,
  SchemeManagementSchema,
  SchemeTypesSchema,
  ProductGroupSchema,
  SessionGroupSchema,
  EmployeeTypesSchema,
  ReportSettingsSchema,
  TallySequenceNumbersSchema
];

let posId;
let token;

let dbPromise = null;
let dataDumpDbPromise = null;

const BATCH_SIZE = 30;
const SYNC_URL = window.REACT_APP_SYNC_URL;

const createDumpDb = async () => {
  const db = await createRxDatabase({
    name: 'oneshelldatadumpdb',
    adapter: 'idb'
  });

  await db.addCollections({
    datadump: {
      schema: DataDumpSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    }
  });

  db.waitForLeadership().then(() => {
    // document.title = document.title + ' ♛';
  });

  dataDumpDbPromise = db;

  return db;
};

export const getDataDumpDb = () => {
  try {
    if (!dataDumpDbPromise) {
      return createDumpDb();
    } else {
      return dataDumpDbPromise;
    }
  } catch (error) {}
};

const _create = async () => {
  const db = await createRxDatabase({
    name: 'oneshelldb',
    adapter: 'idb'
  });
  window['db'] = db; // write to window for debugging

  /**
   * leader election in case of multiple windows
   */
  db.waitForLeadership().then(() => {
    // document.title = document.title + ' ♛';
  });

  /**
   * create tables
   */
  const collection = await db.addCollections({
    businesscategorieslevel1: {
      schema: BusinessCategoriesLevel1Schema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    user: {
      schema: UserSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    businesscategories: {
      schema: BusinessCategoriesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    businesslist: {
      schema: BusinessListSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    businessproduct: {
      schema: BusinessProductSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.finalMRPPrice = 0;

          let batchData = [];

          for (let item of oldDoc.batchData) {
            item.finalMRPPrice = 0;
            batchData.push(item);
          }

          oldDoc.batchData = batchData;
          oldDoc.serialOrImeiNo = '';
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        },
        15: (oldDoc) => {
          return oldDoc;
        },
        16: (oldDoc) => {
          return oldDoc;
        },
        17: (oldDoc) => {
          return oldDoc;
        },
        18: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    deviceid: {
      schema: DeviceIDSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    login: {
      schema: LoginSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    sequencenumbers: {
      schema: SequenceNumbersSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.prefix = '';
          oldDoc.id = oldDoc.type + '';

          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    expensecategories: {
      schema: ExpenseCategoriesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    expenses: {
      schema: ExpensesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.paymentReferenceNumber = '';
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        },
        15: (oldDoc) => {
          return oldDoc;
        },
        16: (oldDoc) => {
          return oldDoc;
        },
        17: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    parties: {
      schema: PartiesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.shippingAddress = '';
          oldDoc.shippingPincode = '';
          oldDoc.shippingCity = '';
          oldDoc.state = '';
          oldDoc.country = '';
          oldDoc.shippingState = '';
          oldDoc.shippingCountry = '';
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    paymentin: {
      schema: PaymentInSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.paymentReferenceNumber = '';
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    paymentout: {
      schema: PaymentOutSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.paymentReferenceNumber = '';
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    printersettings: {
      schema: PrinterSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          let invoiceRegular = oldDoc.invoiceRegular;
          let invoiceThermal = oldDoc.invoiceThermal;

          invoiceRegular.boolQrCode = false;
          invoiceRegular.strqrcode = '';
          invoiceRegular.qrCodeValueOptn = '';
          invoiceRegular.paymentbankNumber = '';
          invoiceRegular.paymentifsc = '';
          invoiceRegular.paymentUpi = '';

          invoiceThermal.boolQrCode = false;
          invoiceThermal.boolSignature = false;
          invoiceThermal.strqrcode = '';
          invoiceThermal.qrCodeValueOptn = '';
          invoiceThermal.paymentbankNumber = '';
          invoiceThermal.paymentifsc = '';
          invoiceThermal.paymentUpi = '';
          invoiceThermal.strSignature = '';

          oldDoc.invoiceRegular = invoiceRegular;
          oldDoc.invoiceThermal = invoiceThermal;

          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    purchasesreturn: {
      schema: PurchasesReturnSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.paymentReferenceNumber = '';
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.makingChargePerGramAmount = 0;
            newitems.push(item);
          }

          oldDoc.itemList = newitems;
          oldDoc.notes = '';
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        },
        15: (oldDoc) => {
          return oldDoc;
        },
        16: (oldDoc) => {
          return oldDoc;
        },
        17: (oldDoc) => {
          return oldDoc;
        },
        18: (oldDoc) => {
          return oldDoc;
        },
        19: (oldDoc) => {
          return oldDoc;
        },
        20: (oldDoc) => {
          return oldDoc;
        },
        21: (oldDoc) => {
          return oldDoc;
        },
        22: (oldDoc) => {
          return oldDoc;
        },
        23: (oldDoc) => {
          return oldDoc;
        },
        24: (oldDoc) => {
          return oldDoc;
        },
        25: (oldDoc) => {
          return oldDoc;
        },
        26: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    purchases: {
      schema: PurchasesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.paymentReferenceNumber = '';
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.makingChargePerGramAmount = 0;
            newitems.push(item);
          }

          oldDoc.itemList = newitems;
          oldDoc.notes = '';
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        },
        15: (oldDoc) => {
          return oldDoc;
        },
        16: (oldDoc) => {
          return oldDoc;
        },
        17: (oldDoc) => {
          return oldDoc;
        },
        18: (oldDoc) => {
          return oldDoc;
        },
        19: (oldDoc) => {
          return oldDoc;
        },
        20: (oldDoc) => {
          return oldDoc;
        },
        21: (oldDoc) => {
          return oldDoc;
        },
        22: (oldDoc) => {
          return oldDoc;
        },
        23: (oldDoc) => {
          return oldDoc;
        },
        24: (oldDoc) => {
          return oldDoc;
        },
        25: (oldDoc) => {
          return oldDoc;
        },
        26: (oldDoc) => {
          return oldDoc;
        },
        27: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    salesreturn: {
      schema: SalesReturnSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          let items = oldDoc.item_list;
          let newitems = [];

          for (let item of items) {
            item.wastagePercentage = '';
            item.wastageGrams = '';
            item.grossWeight = '';
            item.netWeight = '';
            item.purity = '';

            newitems.push(item);
          }

          oldDoc.item_list = newitems;

          return oldDoc;
        },
        2: (oldDoc) => {
          let items = oldDoc.item_list;
          let newitems = [];

          for (let item of items) {
            item.makingChargePercent = 0;
            item.makingChargeAmount = 0;
            item.makingChargeType = '';

            newitems.push(item);
          }

          oldDoc.item_list = newitems;
          oldDoc.paymentReferenceNumber = '';

          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.makingChargePerGramAmount = 0;
            newitems.push(item);
          }

          oldDoc.itemList = newitems;

          oldDoc.notes = '';

          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        },
        15: (oldDoc) => {
          return oldDoc;
        },
        16: (oldDoc) => {
          return oldDoc;
        },
        17: (oldDoc) => {
          return oldDoc;
        },
        18: (oldDoc) => {
          return oldDoc;
        },
        19: (oldDoc) => {
          return oldDoc;
        },
        20: (oldDoc) => {
          return oldDoc;
        },
        21: (oldDoc) => {
          return oldDoc;
        },
        22: (oldDoc) => {
          return oldDoc;
        },
        23: (oldDoc) => {
          return oldDoc;
        },
        24: (oldDoc) => {
          return oldDoc;
        },
        25: (oldDoc) => {
          return oldDoc;
        },
        26: (oldDoc) => {
          return oldDoc;
        },
        27: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    sales: {
      schema: SalesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          let items = oldDoc.item_list;
          let newitems = [];

          for (let item of items) {
            item.wastagePercentage = '';
            item.wastageGrams = '';
            item.grossWeight = '';
            item.netWeight = '';
            item.purity = '';
            item.discount_amount_per_item = 0;

            newitems.push(item);
          }

          oldDoc.item_list = newitems;

          return oldDoc;
        },
        2: (oldDoc) => {
          let items = oldDoc.item_list;
          let newitems = [];

          for (let item of items) {
            item.makingChargePercent = 0;
            item.makingChargeAmount = 0;
            item.makingChargeType = '';

            newitems.push(item);
          }

          oldDoc.item_list = newitems;
          oldDoc.paymentReferenceNumber = '';

          return oldDoc;
        },
        3: (oldDoc) => {
          oldDoc.poDate = '';
          oldDoc.poInvoiceNo = '';
          oldDoc.vehicleNo = '';
          oldDoc.transportMode = '';
          oldDoc.shipToCustomerName = '';
          oldDoc.shipToCustomerGSTNo = '';
          oldDoc.shipToCustomerGstType = '';
          oldDoc.shipToCustomerAddress = '';
          oldDoc.shipToCustomerPhoneNo = '';
          oldDoc.shipToCustomerCity = '';
          oldDoc.shipToCustomerEmailId = '';
          oldDoc.shipToCustomerPincode = '';
          oldDoc.shipToCustomerId = '';
          oldDoc.customerState = '';
          oldDoc.customerCountry = '';
          oldDoc.shipToCustomerState = '';
          oldDoc.shipToCustomerCountry = '';

          return oldDoc;
        },
        4: (oldDoc) => {
          let items = oldDoc.item_list;
          let newitems = [];

          for (let item of items) {
            item.finalMRPPrice = 0;
            item.makingChargePerGramAmount = 0;
            newitems.push(item);
          }

          oldDoc.item_list = newitems;
          oldDoc.convertedToDC = false;
          oldDoc.notes = '';

          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        },
        15: (oldDoc) => {
          return oldDoc;
        },
        16: (oldDoc) => {
          return oldDoc;
        },
        17: (oldDoc) => {
          return oldDoc;
        },
        18: (oldDoc) => {
          return oldDoc;
        },
        19: (oldDoc) => {
          return oldDoc;
        },
        20: (oldDoc) => {
          return oldDoc;
        },
        21: (oldDoc) => {
          return oldDoc;
        },
        22: (oldDoc) => {
          return oldDoc;
        },
        23: (oldDoc) => {
          return oldDoc;
        },
        24: (oldDoc) => {
          return oldDoc;
        },
        25: (oldDoc) => {
          return oldDoc;
        },
        26: (oldDoc) => {
          return oldDoc;
        },
        27: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    transactionsettings: {
      schema: TransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    cashadjustments: {
      schema: CashAdjustmentsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    producttxn: {
      schema: ProductTxnSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.wastagePercentage = '';
          oldDoc.wastageGrams = '';
          oldDoc.grossWeight = '';
          oldDoc.netWeight = '';
          oldDoc.purity = '';
          oldDoc.sequenceNumber = '';

          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    barcodesettings: {
      schema: BarcodeSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    waiters: {
      schema: WaitersSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    kotdata: {
      schema: KotSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.paymentReferenceNumber = '';
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    taxsettings: {
      schema: TaxSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    openingstockvalue: {
      schema: OpeningStockValueSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    cashinhand: {
      schema: CashInHandSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    bankaccounts: {
      schema: BankAccountsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    alltransactions: {
      schema: AllTransactionsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          oldDoc.paymentReferenceNumber = '';
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    employees: {
      schema: EmployeesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    specialdays: {
      schema: SpecialDaysManagementSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    saletransactionsettings: {
      schema: SaleTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    approvals: {
      schema: ApprovalsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.igst = 0.0;
            item.makingChargePercent = 0.0;
            item.makingChargeAmount = 0.0;
            item.makingChargeType = 0.0;

            newitems.push(item);
          }

          oldDoc.itemList = newitems;

          return oldDoc;
        },
        2: (oldDoc) => {
          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.makingChargePerGramAmount = 0;
            newitems.push(item);
          }

          oldDoc.itemList = newitems;

          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    jobwork: {
      schema: JobWorkSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.fullReceipt = false;
          oldDoc.partialReceipt = false;

          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.receiptCreated = false;

            newitems.push(item);
          }

          oldDoc.itemList = newitems;

          delete oldDoc['purity'];
          delete oldDoc['grossWeight'];
          delete oldDoc['netWeight'];
          delete oldDoc['generateReceipt'];
          delete oldDoc['receiptDate'];
          delete oldDoc['receiptSequenceNumber'];
          delete oldDoc['receiptNotes'];

          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    jobworkreceipt: {
      schema: JobWorkReceiptSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.orderReceiptChecked = true;

            newitems.push(item);
          }

          oldDoc.itemList = newitems;

          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    whatsappsettings: {
      schema: WhatsAppSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    approvaltransactionsettings: {
      schema: ApprovalTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    salesquotation: {
      schema: SalesQuotationSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.notes = '';

          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        },
        15: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    mobileuserpermissions: {
      schema: MobileUserPermissionsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    jobworkin: {
      schema: JobWorkInSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.makingChargePerGramAmount = 0;
            newitems.push(item);
          }

          oldDoc.itemList = newitems;

          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        },
        15: (oldDoc) => {
          return oldDoc;
        },
        16: (oldDoc) => {
          return oldDoc;
        },
        17: (oldDoc) => {
          return oldDoc;
        },
        18: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    jobworkintransactionsettings: {
      schema: JobWorkInTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    purchasetransactionsettings: {
      schema: PurchaseTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    purchaseordertransactionsettings: {
      schema: PurchaseOrderTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    deliverychallan: {
      schema: DeliveryChallanSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          oldDoc.convertedFromSale = false;

          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.makingChargePerGramAmount = 0;
            newitems.push(item);
          }

          oldDoc.itemList = newitems;

          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    deliverychallantransactionsettings: {
      schema: DeliveryChallanTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    purchaseorder: {
      schema: PurchaseOrderSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.makingChargePerGramAmount = 0;
            newitems.push(item);
          }

          oldDoc.itemList = newitems;

          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    audit: {
      schema: AuditSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    syncerror: {
      schema: SyncErrorSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          oldDoc.id = oldDoc.businessId + '|' + oldDoc.tableName;
          return oldDoc;
        }
      }
    },

    documentsyncerror: {
      schema: DocumentSyncErrorSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },

    saleordertransactionsettings: {
      schema: SaleOrderTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    saleorder: {
      schema: SaleOrderSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          let items = oldDoc.itemList;
          let newitems = [];

          for (let item of items) {
            item.makingChargePerGramAmount = 0;
            newitems.push(item);
          }

          oldDoc.itemList = newitems;

          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        },
        4: (oldDoc) => {
          return oldDoc;
        },
        5: (oldDoc) => {
          return oldDoc;
        },
        6: (oldDoc) => {
          return oldDoc;
        },
        7: (oldDoc) => {
          return oldDoc;
        },
        8: (oldDoc) => {
          return oldDoc;
        },
        9: (oldDoc) => {
          return oldDoc;
        },
        10: (oldDoc) => {
          return oldDoc;
        },
        11: (oldDoc) => {
          return oldDoc;
        },
        12: (oldDoc) => {
          return oldDoc;
        },
        13: (oldDoc) => {
          return oldDoc;
        },
        14: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    reportemployees: {
      schema: ReportEmployeeListSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    salequotationtransactionsettings: {
      schema: SaleQuotationTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    alltransactionsdeleted: {
      schema: RetrieveDeletedTransactionsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    expensetransactionsettings: {
      schema: ExpenseTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    rates: {
      schema: RateSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    posuserpermissions: {
      schema: POSUserPermissionsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    tcs: {
      schema: TCSSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    warehouse: {
      schema: WarehouseSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    cloudprintsettings: {
      schema: CloudPrinterSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    manufacturedirectexpenses: {
      schema: ManufacturingExpensesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    rawmaterialsopeningstockvalue: {
      schema: RawMaterialsOpeningStockValueSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    producttransactionsettings: {
      schema: ProductTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    tds: {
      schema: TDSSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    splitpaymentsettings: {
      schema: SplitPaymentSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    paymentintransactionsettings: {
      schema: PaymentInTransSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    paymentouttransactionsettings: {
      schema: PaymentOutTransSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    workloss: {
      schema: WorkLossSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    kottransactionsettings: {
      schema: KotTransactionSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    multidevicesettings: {
      schema: MultiDeviceSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    tallymastersettings: {
      schema: TallyMasterSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    alltransactionscancelled: {
      schema: CancelTransactionsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    tallybankmastersettings: {
      schema: TallyBankSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    backtobackpurchases: {
      schema: BackToBackPurchaseSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    auditsettings: {
      schema: AuditSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      },
      migrationStrategies: {
        1: (oldDoc) => {
          return oldDoc;
        },
        2: (oldDoc) => {
          return oldDoc;
        },
        3: (oldDoc) => {
          return oldDoc;
        }
      }
    },
    accountingnotes: {
      schema: AccountingNotesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    reminders: {
      schema: RemindersSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    addonsgroup: {
      schema: AddOnsGroupSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    schememanagement: {
      schema: SchemeManagementSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    addons: {
      schema: AddOnsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    loyaltysettings: {
      schema: LoyaltySettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    schemetypes: {
      schema: SchemeTypesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    productgroup: {
      schema: ProductGroupSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    sessiongroup: {
      schema: SessionGroupSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    employeetypes: {
      schema: EmployeeTypesSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    reportsettings: {
      schema: ReportSettingsSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    },
    tallysequencenumbers: {
      schema: TallySequenceNumbersSchema,
      methods: {
        hpPercent() {
          return (this.hp / this.maxHP) * 100;
        }
      }
    }
  });

  return db;
};

export const get = () => {
  try {
    if (!dbPromise) dbPromise = _create();
  } catch (error) {
    deleteAndRecreateDb();
  }

  return dbPromise;
};

export const deleteDb = async () => {
  await removeRxDatabase('oneshelldb', 'idb');
};

export const deleteAndRecreateDb = async () => {
  let db = await get();

  await db.destroy();
  await db.remove();
  await _create();
  db = await get();
  window.location.reload();
};

export const getCollectionList = () => {
  let collectionList = [];
  collections.map((colData) => collectionList.push(colData.name));

  return collectionList;
};

/**
 *
 * #################################################################### SERVER SYNC LOGIC
 */
/**
 *
 * businesscategories table
 */

if (window.navigator.onLine && localStorage.getItem('businessId')) {
  async function businesscategoriesSync() {
    const db = await get();
    // set up replication
    const businesscategoriesReplicationState = businesscategoriesQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    // show replication-errors in logs
    businesscategoriesReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('businesscategories replication error:');
        syncError.createTableSyncError('businesscategories', err.message);
        console.error(err);
      }
    });

    businesscategoriesReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('businesscategories is canceled');
        alert('sync canceled');
      }
    });

    return businesscategoriesReplicationState;
  }
  businesscategoriesSync().catch((err) => {
    console.log('businesscategoriesSync error:');
    syncError.createTableSyncError('businesscategories', err.message);
    console.error(err);
  });

  /**
   * businessproduct table
   */
  async function businessproductSync() {
    const db = await get();

    const businessproductSyncReplicationState = businessproductSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    businessproductSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('businessproductSync error:');
        syncError.createTableSyncError('businessproduct', err.message);
        console.error(err);
      }
    });

    businessproductSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('businessproductSync is canceled');
        alert('sync canceled');
      }
    });

    return businessproductSyncReplicationState;
  }
  businessproductSync().catch((err) => {
    console.log('businessproductSync error:');
    syncError.createTableSyncError('businessproduct', err.message);
    console.error(err);
  });

  /**
   * product Txn table
   */
  async function productTxnSync() {
    const db = await get();

    const productTxnSyncReplicationState = productTxnSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    productTxnSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('productTxnSync error:');
        console.error(err);
        syncError.createTableSyncError('productTxn', err.message);
      }
    });

    productTxnSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('productTxnSyncReplicationState is canceled');
        alert('sync canceled');
      }
    });

    return productTxnSyncReplicationState;
  }
  productTxnSync().catch((err) => {
    console.log('productTxnSync error:');
    syncError.createTableSyncError('productTxn', err.message);
    console.error(err);
  });

  /**
   * expensecategories table
   */
  async function expensecategoriesSync() {
    const db = await get();

    const expensecategoriesSyncReplicationState =
      expensecategoriesSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    expensecategoriesSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('expensecategoriesSync error:');
        syncError.createTableSyncError('expensecategories', err.message);
        console.error(err);
      }
    });

    expensecategoriesSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('expensecategoriesSyncReplicationState is canceled');
        alert('sync canceled');
      }
    });

    return expensecategoriesSyncReplicationState;
  }
  expensecategoriesSync().catch((err) => {
    console.log('expensecategoriesSync error:');
    syncError.createTableSyncError('expensecategories', err.message);
    console.error(err);
  });

  /**
   * expenses table
   */
  async function expensesSync() {
    const db = await get();

    const expensesSyncReplicationState = expensesSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    expensesSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('expensesSync error:');
        syncError.createTableSyncError('expenses', err.message);
        console.error(err);
      }
    });

    expensesSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('expensesSyncReplicationState is canceled');
        alert('sync canceled');
      }
    });

    return expensesSyncReplicationState;
  }
  expensesSync().catch((err) => {
    console.log('expensesSync error:');
    syncError.createTableSyncError('expenses', err.message);
    console.error(err);
  });

  /**
   * parties table
   */
  async function partiesSync() {
    const db = await get();

    const partiesSyncReplicationState = partiesSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    partiesSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('partiesSync error:');
        syncError.createTableSyncError('parties', err.message);
        console.error(err);
      }
    });

    return partiesSyncReplicationState;
  }
  partiesSync().catch((err) => {
    console.log('partiesSync error:');
    syncError.createTableSyncError('parties', err.message);
    console.error(err);
  });

  /**
   * paymentin table
   */
  async function paymentinSync() {
    const db = await get();

    const paymentinSyncReplicationState = paymentinSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    paymentinSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('paymentinSync error:');
        syncError.createTableSyncError('paymentin', err.message);
        console.error(err);
      }
    });

    paymentinSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('paymentinSyncReplicationState is canceled');
        alert('sync canceled');
      }
    });

    return paymentinSyncReplicationState;
  }
  paymentinSync().catch((err) => {
    console.log('paymentinSync error:');
    syncError.createTableSyncError('paymentin', err.message);
    console.error(err);
  });

  /**
   * paymentout table
   */
  async function paymentoutSync() {
    const db = await get();

    const paymentoutSyncReplicationState = paymentoutSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    paymentoutSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('paymentoutSync error:');
        syncError.createTableSyncError('paymentout', err.message);
        console.error(err);
      }
    });

    paymentoutSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('paymentoutSyncReplicationState is canceled');
        alert('sync canceled');
      }
    });

    return paymentoutSyncReplicationState;
  }
  paymentoutSync().catch((err) => {
    console.log('paymentoutSync error:');
    syncError.createTableSyncError('paymentout', err.message);
    console.error(err);
  });

  /**
   * purchasesreturn table
   */
  async function purchasesreturnSync() {
    const db = await get();

    const purchasesreturnSyncReplicationState = purchasesreturnSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    purchasesreturnSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('purchasesreturnSync error:');
        syncError.createTableSyncError('purchasesreturn', err.message);
        console.error(err);
      }
    });

    purchasesreturnSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('purchasesreturnSyncReplicationState is canceled');
        alert('sync canceled');
      }
    });

    return purchasesreturnSyncReplicationState;
  }
  purchasesreturnSync().catch((err) => {
    console.log('purchasesreturnSync error:');
    syncError.createTableSyncError('purchasesreturn', err.message);
    console.error(err);
  });

  /**
   * purchases table
   */
  async function purchasesSync() {
    const db = await get();

    const purchasesSyncReplicationState = purchasesSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    purchasesSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('purchasesSync error:');
        syncError.createTableSyncError('purchases', err.message);
        console.error(err);
      }
    });

    purchasesSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('purchasesSyncReplicationState is canceled');
        alert('sync canceled');
      }
    });

    return purchasesSyncReplicationState;
  }
  purchasesSync().catch((err) => {
    console.log('purchasesSync error:');
    syncError.createTableSyncError('purchases', err.message);
    console.error(err);
  });

  /**
   * salesreturn table
   */
  async function salesreturnSync() {
    const db = await get();

    const salesreturnSyncReplicationState = salesreturnSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    salesreturnSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('salesreturnSync error:');
        syncError.createTableSyncError('salesreturn', err.message);
        console.error(err);
      }
    });

    salesreturnSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('salesreturnSyncReplicationState is canceled');
        alert('sync canceled');
      }
    });

    return salesreturnSyncReplicationState;
  }
  salesreturnSync().catch((err) => {
    console.log('salesreturnSync error:');
    syncError.createTableSyncError('salesreturn', err.message);
    console.error(err);
  });

  /**
   * sales table
   */
  async function salesSync() {
    const db = await get();

    const salesSyncReplicationState = salesSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    salesSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('salesSync error:');
        syncError.createTableSyncError('sales', err.message);
        console.error(err);
      }
    });

    salesSyncReplicationState.canceled$.subscribe((bool) => {
      if (bool) {
        console.error('salesSyncReplicationState is canceled');
        alert('sync canceled');
      }
    });

    return salesSyncReplicationState;
  }
  salesSync().catch((err) => {
    console.log('salesSync error:');
    syncError.createTableSyncError('sales', err.message);
    console.error(err);
  });

  /**
   * cashadjustmentsSchema table
   */
  async function cashAdjustmentsSync() {
    const db = await get();

    const cashAdjustmentsSyncReplicationState = cashAdjustmentsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    cashAdjustmentsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('cashAdjustmentsSync error:');
        syncError.createTableSyncError('cashadjustments', err.message);
        console.error(err);
      }
    });

    return cashAdjustmentsSyncReplicationState;
  }
  cashAdjustmentsSync().catch((err) => {
    console.log('cashAdjustmentsSync error:');
    syncError.createTableSyncError('cashadjustments', err.message);
    console.error(err);
  });

  /**
   * TransactionSettingsSchema table
   */
  async function transactionSettingsSchemaSync() {
    const db = await get();

    const transactionSettingsSchemaSyncReplicationState =
      transactionSettingsQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    transactionSettingsSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('transactionSettingsSchema error:');
        syncError.createTableSyncError('transactionsettings', err.message);
        console.error(err);
      }
    });

    return transactionSettingsSchemaSyncReplicationState;
  }
  transactionSettingsSchemaSync().catch((err) => {
    console.log('transactionSettings error:');
    syncError.createTableSyncError('transactionsettings', err.message);
    console.error(err);
  });

  /**
   * printerSettings table
   */
  async function printerSettingsSchemaSync() {
    const db = await get();

    const printerSettingsSchemaSyncSchemaSyncReplicationState =
      printerSettingsSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    printerSettingsSchemaSyncSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('printerSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return printerSettingsSchemaSyncSchemaSyncReplicationState;
  }
  printerSettingsSchemaSync().catch((err) => {
    console.log('printerSettingsSchemaSync error:');
    syncError.createTableSyncError('printersettings', err.message);
    console.error(err);
  });

  /**
   * sequence number table sync
   */

  async function sequenceNumberSchemaSync() {
    const db = await get();

    const sequenceSyncQueryBuilderSyncReplicationState =
      sequenceSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    sequenceSyncQueryBuilderSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('sequenceSyncQueryBuilder error:');
        syncError.createTableSyncError('sequencenumber', err.message);
        console.error(err);
      }
    });

    return sequenceSyncQueryBuilderSyncReplicationState;
  }
  sequenceNumberSchemaSync().catch((err) => {
    console.log('sequenceSyncQueryBuilder error:');
    syncError.createTableSyncError('sequencenumber', err.message);
    console.error(err);
  });

  /**
   * barcode table
   */
  async function barcodeSettingsSchemaSync() {
    const db = await get();

    const barcodeSettingsSchemaSyncSchemaSyncReplicationState =
      barcodeSettingsSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    barcodeSettingsSchemaSyncSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('barcodeSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return barcodeSettingsSchemaSyncSchemaSyncReplicationState;
  }
  barcodeSettingsSchemaSync().catch((err) => {
    console.log('barcodeSettingsSchemaSync error:');
    syncError.createTableSyncError('barcodesettings', err.message);
    console.error(err);
  });

  /**
   * waiters table
   */
  async function waitersSchemaSync() {
    const db = await get();

    const waitersSchemaSyncSchemaSyncReplicationState = waitersSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    waitersSchemaSyncSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('waitersSchemaSync error:');
        syncError.createTableSyncError('waiters', err.message);
        console.error(err);
      }
    });

    return waitersSchemaSyncSchemaSyncReplicationState;
  }
  waitersSchemaSync().catch((err) => {
    console.log('waitersSchemaSync error:');
    syncError.createTableSyncError('waiters', err.message);
    console.error(err);
  });

  /**
   * kotdata table
   */
  async function kotSchemaSync() {
    const db = await get();

    const kotSchemaSyncSchemaSyncReplicationState = kotSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    kotSchemaSyncSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        // console.error('kotSchemaSync error:');
        // console.error(err);
      }
    });

    return kotSchemaSyncSchemaSyncReplicationState;
  }
  kotSchemaSync().catch((err) => {
    // console.log('kotSchemaSync error:');
    // console.error(err);
  });

  /**
   * Tax Settings table
   */
  async function TaxSettingsSchemaSync() {
    const db = await get();

    const TaxSettingsSchemaSyncSchemaSyncReplicationState =
      TaxSettingsSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    TaxSettingsSchemaSyncSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('waitersSchemaSync error:');
        syncError.createTableSyncError('taxsettings', err.message);
        console.error(err);
      }
    });

    return TaxSettingsSchemaSyncSchemaSyncReplicationState;
  }
  TaxSettingsSchemaSync().catch((err) => {
    console.log('TaxSettingsSchemaSync error:');
    syncError.createTableSyncError('taxsettings', err.message);
    console.error(err);
  });

  /**
   * stock Value table
   */
  async function stockValueSync() {
    const db = await get();

    const stockValueSyncSchemaSyncReplicationState =
      openingStockValueSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    stockValueSyncSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('openingstockValueSchemaSync error:');
        syncError.createTableSyncError('openingstockvalue', err.message);
        console.error(err);
      }
    });

    return stockValueSyncSchemaSyncReplicationState;
  }
  stockValueSync().catch((err) => {
    console.log('stockValueSchemaSync error:');
    syncError.createTableSyncError('openingstockvalue', err.message);
    console.error(err);
  });

  /**
   * cash in hand table
   */
  async function cashInHandSync() {
    const db = await get();

    const cashInHandSyncSchemaSyncReplicationState = cashInHandSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    cashInHandSyncSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('cashInHandSchemaSync error:');
        syncError.createTableSyncError('cashinhand', err.message);
        console.error(err);
      }
    });

    return cashInHandSyncSchemaSyncReplicationState;
  }
  cashInHandSync().catch((err) => {
    console.log('cashInHandSchemaSync error:');
    syncError.createTableSyncError('cashinhand', err.message);
    console.error(err);
  });

  /**
   * bank accounts
   */
  async function bankAccountsSync() {
    const db = await get();

    const bankAccountsSyncSchemaSyncReplicationState =
      bankAccountsSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    bankAccountsSyncSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('bankAccountsSchemaSync error:');
        syncError.createTableSyncError('bankaccounts', err.message);
        console.error(err);
      }
    });

    return bankAccountsSyncSchemaSyncReplicationState;
  }
  bankAccountsSync().catch((err) => {
    console.log('bankAccountsSync error:');
    syncError.createTableSyncError('bankaccounts', err.message);
    console.error(err);
  });

  /**
   * All transactions  hand table
   */
  async function allTransactionsSync() {
    const db = await get();

    const allTransactionsSyncSchemaSyncReplicationState =
      allTransactionsSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    allTransactionsSyncSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('allTransactionsSync error:');
        syncError.createTableSyncError('alltransactions', err.message);
        console.error(err);
      }
    });

    return allTransactionsSyncSchemaSyncReplicationState;
  }
  allTransactionsSync().catch((err) => {
    console.log('allTransactionsSync error:');
    syncError.createTableSyncError('alltransactions', err.message);
    console.error(err);
  });
  /**
   * employees table
   */

  async function employeesSync() {
    const db = await get();

    const employeesSyncSchemaSyncReplicationState = employeesSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    employeesSyncSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('employeesSync error:');
        syncError.createTableSyncError('employees', err.message);
        console.error(err);
      }
    });

    return employeesSyncSchemaSyncReplicationState;
  }
  employeesSync().catch((err) => {
    console.log('employeesSync error:');
    syncError.createTableSyncError('employees', err.message);
    console.error(err);
  });

  /**
   * special days table
   */

  async function specialDaysSync() {
    const db = await get();

    const specialDaysSyncSchemaSyncReplicationState =
      specialDaysManagementSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    specialDaysSyncSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('specialDaysSync error:');
        syncError.createTableSyncError('specialdays', err.message);
        console.error(err);
      }
    });

    return specialDaysSyncSchemaSyncReplicationState;
  }
  specialDaysSync().catch((err) => {
    console.log('specialDaysSync error:');
    syncError.createTableSyncError('specialdays', err.message);
    console.error(err);
  });

  /**
   * SaleTransactionSettingsSchema table
   */

  async function saleTransactionSettingsSchemaSync() {
    const db = await get();

    const saleTransactionSettingsSchemaSyncReplicationState =
      saleTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    saleTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('saleTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return saleTransactionSettingsSchemaSyncReplicationState;
  }
  saleTransactionSettingsSchemaSync().catch((err) => {
    console.log('saleTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError('saletransactionsettings', err.message);
    console.error(err);
  });

  /**
   * approvalsSchema table
   */
  async function approvalsSchemaSync() {
    const db = await get();

    const approvalsSchemaSyncReplicationState = approvalsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    approvalsSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('approvalsSchemaSync error:');
        syncError.createTableSyncError('approvals', err.message);
        console.error(err);
      }
    });

    return approvalsSchemaSyncReplicationState;
  }
  approvalsSchemaSync().catch((err) => {
    console.log('approvalsSchemaSync error:');
    syncError.createTableSyncError('approvals', err.message);
    console.error(err);
  });

  /**
   * jobwork table
   */
  async function jobWorkSchemaSync() {
    const db = await get();

    const jobWorkSchemaSyncReplicationState = jobWorkSchemaSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    jobWorkSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('jobWorkSchemaSync error:');
        syncError.createTableSyncError('jobWork', err.message);
        console.error(err);
      }
    });

    return jobWorkSchemaSyncReplicationState;
  }
  jobWorkSchemaSync().catch((err) => {
    console.log('jobWorkSchemaSync error:');
    syncError.createTableSyncError('jobWork', err.message);
    console.error(err);
  });

  /**
   * jobwork Receipt table
   */
  async function jobWorkReceiptSchemaSync() {
    const db = await get();

    const jobWorkReceiptSchemaSyncReplicationState =
      jobWorkReceiptSchemaSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    jobWorkReceiptSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('jobWorkReceiptSchemaSync error:');
        syncError.createTableSyncError('jobworkreceipt', err.message);
        console.error(err);
      }
    });

    return jobWorkReceiptSchemaSyncReplicationState;
  }
  jobWorkReceiptSchemaSync().catch((err) => {
    console.log('jobWorkReceiptSchemaSync error:');
    syncError.createTableSyncError('jobworkreceipt', err.message);
    console.error(err);
  });

  /**
   * jobwork in table
   */
  async function jobWorkInSchemaSync() {
    const db = await get();

    const jobWorkInSchemaSyncReplicationState = jobWorkInSchemaSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    jobWorkInSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('jobWorkInSchemaSync error:');
        syncError.createTableSyncError('jobworkin', err.message);
        console.error(err);
      }
    });

    return jobWorkInSchemaSyncReplicationState;
  }
  jobWorkInSchemaSync().catch((err) => {
    console.log('jobWorkInSchemaSync error:');
    syncError.createTableSyncError('jobworkin', err.message);
    console.error(err);
  });

  /**
   * whatsapp settings table
   */
  async function whatsAppSettingsSchemaSync() {
    const db = await get();

    const whatsAppSettingsSchemaSyncReplicationState =
      whatsAppSettingsSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    whatsAppSettingsSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('whatsAppSettingsSchemaSync error:');
        syncError.createTableSyncError('whatsappsettings', err.message);
        console.error(err);
      }
    });

    return whatsAppSettingsSchemaSyncReplicationState;
  }
  whatsAppSettingsSchemaSync().catch((err) => {
    console.log('whatsAppSettingsSchemaSync error:');
    syncError.createTableSyncError('whatsappsettings', err.message);
    console.error(err);
  });

  /**
   * ApprovalTransactionSettingsSchema table
   */

  async function approvalTransactionSettingsSchemaSync() {
    const db = await get();

    const approvalTransactionSettingsSchemaSyncReplicationState =
      approvalTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    approvalTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('approvalTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return approvalTransactionSettingsSchemaSyncReplicationState;
  }
  approvalTransactionSettingsSchemaSync().catch((err) => {
    console.log('approvalTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError('approvaltransactionsettings', err.message);
    console.error(err);
  });

  /**
   * SalesQuotationSchema table
   */
  async function salesQuotationSchemaSync() {
    const db = await get();

    const salesQuotationSchemaSyncReplicationState =
      salesQuotationSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    salesQuotationSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('salesQuotationSchemaSync error:');
        syncError.createTableSyncError('salesquotation', err.message);
        console.error(err);
      }
    });

    return salesQuotationSchemaSyncReplicationState;
  }
  salesQuotationSchemaSync().catch((err) => {
    console.log('salesQuotationSchemaSync error:');
    syncError.createTableSyncError('salesquotation', err.message);
    console.error(err);
  });

  /**
   * MobileUserSchema table
   */

  async function mobileUserPermissionsSchemaSync() {
    const db = await get();

    const mobileUserPermissionsSchemaSyncReplicationState =
      mobileUserPermissionsSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    mobileUserPermissionsSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('mobileUserPermissionsSchemaSync error:');
        syncError.createTableSyncError('mobileUserpermissions', err.message);
        console.error(err);
      }
    });

    return mobileUserPermissionsSchemaSyncReplicationState;
  }
  mobileUserPermissionsSchemaSync().catch((err) => {
    console.log('mobileUserPermissionsSchemaSync error:');
    syncError.createTableSyncError('mobileUserpermissions', err.message);
    console.error(err);
  });

  /**
   * POSUserSchema table
   */

  async function posUserPermissionsSchemaSync() {
    const db = await get();

    const posUserPermissionsSchemaSyncReplicationState =
      posUserPermissionsSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    posUserPermissionsSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('posUserPermissionsSchemaSync error:');
        syncError.createTableSyncError('posUserpermissions', err.message);
        console.error(err);
      }
    });

    return posUserPermissionsSchemaSyncReplicationState;
  }
  posUserPermissionsSchemaSync().catch((err) => {
    console.log('posUserPermissionsSchemaSync error:');
    syncError.createTableSyncError('posUserpermissions', err.message);
    console.error(err);
  });

  /**
   * JobWorkInTransactionSettingsSchema table
   */

  async function jobWorkInTransactionSettingsSchemaSync() {
    const db = await get();

    const jobWorkInTransactionSettingsSchemaSyncReplicationState =
      jobWorkInTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    jobWorkInTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('jobWorkInTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return jobWorkInTransactionSettingsSchemaSyncReplicationState;
  }
  jobWorkInTransactionSettingsSchemaSync().catch((err) => {
    console.log('jobWorkInTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError('jobworkin', err.message);
    console.error(err);
  });

  /**
   * PurchaseTransactionSettingsSchema table
   */

  async function purchaseTransactionSettingsSchemaSync() {
    const db = await get();

    const purchaseTransactionSettingsSchemaSyncReplicationState =
      purchaseTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    purchaseTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('purchaseTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return purchaseTransactionSettingsSchemaSyncReplicationState;
  }
  purchaseTransactionSettingsSchemaSync().catch((err) => {
    console.log('purchaseTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError('purchasetransactionsettings', err.message);
    console.error(err);
  });

  /**
   * PurchaseOrderTransactionSettingsSchema table
   */

  async function purchaseOrderTransactionSettingsSchemaSync() {
    const db = await get();

    const purchaseOrderTransactionSettingsSchemaSyncReplicationState =
      purchaseOrderTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    purchaseOrderTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('purchaseOrderTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return purchaseOrderTransactionSettingsSchemaSyncReplicationState;
  }
  purchaseOrderTransactionSettingsSchemaSync().catch((err) => {
    console.log('purchaseOrderTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError(
      'purchaseordertransactionsettings',
      err.message
    );
    console.error(err);
  });

  /**
   * DeliveryChallanSchema table
   */
  async function deliveryChallanSchemaSync() {
    const db = await get();

    const deliveryChallanSchemaSyncReplicationState =
      deliveryChallanSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    deliveryChallanSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('deliveryChallanSchemaSync error:');
        syncError.createTableSyncError('deliverychallan', err.message);
        console.error(err);
      }
    });

    return deliveryChallanSchemaSyncReplicationState;
  }
  deliveryChallanSchemaSync().catch((err) => {
    console.log('deliveryChallanSchemaSync error:');
    syncError.createTableSyncError('deliverychallan', err.message);
    console.error(err);
  });

  /**
   * DeliveryChallanTransactionSettingsSchema table
   */

  async function deliveryChallanTransactionSettingsSchemaSync() {
    const db = await get();

    const deliveryChallanTransactionSettingsSchemaSyncReplicationState =
      deliveryChallanTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    deliveryChallanTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('deliveryChallanTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return deliveryChallanTransactionSettingsSchemaSyncReplicationState;
  }
  deliveryChallanTransactionSettingsSchemaSync().catch((err) => {
    console.log('deliveryChallanTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError(
      'deliverychallantransactionsettings',
      err.message
    );
    console.error(err);
  });

  /**
   * PurchaseOrderSchema table
   */
  async function purchaseOrderSchemaSync() {
    const db = await get();

    const purchaseOrderSchemaSyncReplicationState =
      purchaseOrderSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    purchaseOrderSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('purchaseOrderSchemaSync error:');
        syncError.createTableSyncError('purchaseorder', err.message);
        console.error(err);
      }
    });

    return purchaseOrderSchemaSyncReplicationState;
  }

  purchaseOrderSchemaSync().catch((err) => {
    console.log('purchaseOrderSchemaSync error:');
    syncError.createTableSyncError('purchaseorder', err.message);
    console.error(err);
  });

  //audit table
  async function auditSchemaSync() {
    const db = await get();

    const auditSchemaSyncReplicationState = auditSchemaSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    auditSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('auditSchema sync error:');
        syncError.createTableSyncError('audit', err.message);
        console.error(err);
      }
    });

    return auditSchemaSyncReplicationState;
  }
  auditSchemaSync().catch((err) => {
    console.log('auditSchema sync error:');
    syncError.createTableSyncError('audit', err.message);
    console.error(err);
  });

  //sync document sync error
  async function documentSyncErrorSchemaSync() {
    const db = await get();

    const documentSyncErrorSchemaSyncReplicationState =
      documentSyncErrorSchemaSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    documentSyncErrorSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('documentsyncerror sync error:');
        syncError.createTableSyncError('documentsyncerror', err.message);
        console.error(err);
      }
    });

    return documentSyncErrorSchemaSyncReplicationState;
  }
  documentSyncErrorSchemaSync().catch((err) => {
    console.log('documentsyncerror sync error:');
    syncError.createTableSyncError('documentsyncerror', err.message);
    console.error(err);
  });

  // sync error table
  async function syncErrorSchemaSync() {
    const db = await get();

    const syncErrorSchemaSyncReplicationState = syncErrorSchemaSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    syncErrorSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('syncError sync error:');
        syncError.createTableSyncError('syncerror', err.message);
        console.error(err);
      }
    });

    return syncErrorSchemaSyncReplicationState;
  }
  syncErrorSchemaSync().catch((err) => {
    console.log('syncErrorSchema sync error:');
    syncError.createTableSyncError('syncerror', err.message);
    console.error(err);
  });

  /**
   * SaleOrderTransactionSettingsSchema table
   */

  async function saleOrderTransactionSettingsSchemaSync() {
    const db = await get();

    const saleOrderTransactionSettingsSchemaSyncReplicationState =
      saleOrderTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    saleOrderTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('saleOrderTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return saleOrderTransactionSettingsSchemaSyncReplicationState;
  }
  saleOrderTransactionSettingsSchemaSync().catch((err) => {
    console.log('saleOrderTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError('saleOrdertransactionsettings', err.message);
    console.error(err);
  });

  /**
   * SaleOrderSchema table
   */
  async function saleOrderSchemaSync() {
    const db = await get();

    const saleOrderSchemaSyncReplicationState = saleOrderSchemaSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    saleOrderSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('saleOrderSchemaSync error:');
        syncError.createTableSyncError('saleOrder', err.message);
        console.error(err);
      }
    });

    return saleOrderSchemaSyncReplicationState;
  }

  saleOrderSchemaSync().catch((err) => {
    console.log('saleOrderSchemaSync error:');
    syncError.createTableSyncError('saleOrder', err.message);
    console.error(err);
  });

  /**
   * ReportEmployeesSchema table
   */
  async function reportEmployeesSchemaSync() {
    const db = await get();

    const reportEmployeesSchemaSyncReplicationState =
      reportEmployeeListSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    reportEmployeesSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('reportEmployeesSchemaSync error:');
        syncError.createTableSyncError('reportEmployees', err.message);
        console.error(err);
      }
    });

    return reportEmployeesSchemaSyncReplicationState;
  }

  reportEmployeesSchemaSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('reportEmployeesSchemaSync error:');
      syncError.createTableSyncError('reportEmployees', err.message);
      console.error(err);
    }
  });

  /**
   * SaleQuotationTransactionSettingsSchema table
   */

  async function saleQuotationTransactionSettingsSchemaSync() {
    const db = await get();

    const saleQuotationTransactionSettingsSchemaSyncReplicationState =
      saleQuotationTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    saleQuotationTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('saleQuotationTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return saleQuotationTransactionSettingsSchemaSyncReplicationState;
  }
  saleQuotationTransactionSettingsSchemaSync().catch((err) => {
    console.log('saleQuotationTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError(
      'saleQuotationtransactionsettings',
      err.message
    );
    console.error(err);
  });

  /**
   * RetrieveDeletedTransactionsSchema table
   */

  async function retrieveDeletedTransactionsSchemaSync() {
    const db = await get();

    const retrieveDeletedTransactionsSchemaSyncReplicationState =
      retrieveDeletedTransactionsSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    retrieveDeletedTransactionsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('retrieveDeletedTransactionsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return retrieveDeletedTransactionsSchemaSyncReplicationState;
  }
  retrieveDeletedTransactionsSchemaSync().catch((err) => {
    console.log('retrieveDeletedTransactionsSchemaSync error:');
    syncError.createTableSyncError('retrieveDeletedTransactions', err.message);
    console.error(err);
  });

  /**
   *  ExpenseTransactionSettingsSchema table
   */

  async function expenseTransactionSettingsSchemaSync() {
    const db = await get();

    const expenseTransactionSettingsSchemaSyncReplicationState =
      expenseTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    expenseTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('expenseTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return expenseTransactionSettingsSchemaSyncReplicationState;
  }
  expenseTransactionSettingsSchemaSync().catch((err) => {
    console.log('expenseTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError('expensetransactionsettings', err.message);
    console.error(err);
  });

  /**
   * Rates table
   */
  async function rateSync() {
    const db = await get();

    const rateSyncReplicationState = rateSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    rateSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('rateSync error:');
        syncError.createTableSyncError('rate', err.message);
        console.error(err);
      }
    });

    return rateSyncReplicationState;
  }
  rateSync().catch((err) => {
    console.log('rateSync error:');
    syncError.createTableSyncError('rate', err.message);
    console.error(err);
  });

  /**
   * TCS table
   */
  async function tcsSync() {
    const db = await get();

    const tcsSyncReplicationState = tcsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    tcsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('tcsSync error:');
        syncError.createTableSyncError('tcs', err.message);
        console.error(err);
      }
    });

    return tcsSyncReplicationState;
  }
  tcsSync().catch((err) => {
    console.log('tcsSync error:');
    syncError.createTableSyncError('tcs', err.message);
    console.error(err);
  });

  /**
   * Warehouse table
   */
  async function warehouseSync() {
    const db = await get();

    const warehouseSyncReplicationState = warehouseSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    warehouseSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('warehouseSync error:');
        syncError.createTableSyncError('warehouse', err.message);
        console.error(err);
      }
    });

    return warehouseSyncReplicationState;
  }
  warehouseSync().catch((err) => {
    console.log('warehouseSync error:');
    syncError.createTableSyncError('warehouse', err.message);
    console.error(err);
  });

  /**
   * Cloud Printer Settings table
   */
  async function cloudPrinterSettingsSync() {
    const db = await get();

    const cloudPrintSyncReplicationState = cloudPrinterSettingsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    cloudPrintSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('cloudPrintSync error:');
        syncError.createTableSyncError('cloudprintsettings', err.message);
        console.error(err);
      }
    });

    return cloudPrintSyncReplicationState;
  }
  cloudPrinterSettingsSync().catch((err) => {
    console.log('rateSync error:');
    syncError.createTableSyncError('cloudprintsettings', err.message);
    console.error(err);
  });

  /**
   * Manufacturing Direct Expenses table
   */
  async function manufacturingDirectExpensesSync() {
    const db = await get();

    const manufacturingDirectExpensesSyncReplicationState =
      manufacturingDirectExpensesSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    manufacturingDirectExpensesSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('manufacturingDirectExpensesSync error:');
        syncError.createTableSyncError(
          'manufacturedirectexpenses',
          err.message
        );
        console.error(err);
      }
    });

    return manufacturingDirectExpensesSyncReplicationState;
  }
  manufacturingDirectExpensesSync().catch((err) => {
    console.log('manufacturingDirectExpensesSync error:');
    syncError.createTableSyncError('manufacturedirectexpenses', err.message);
    console.error(err);
  });

  /**
   * raw material stock Value table
   */
  async function rawMaterialStockValueSync() {
    const db = await get();

    const rawMaterialStockValueSyncSchemaSyncReplicationState =
      rawmaterialsopeningStockValueSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    rawMaterialStockValueSyncSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('rawmaterialsopeningStockValueSync error:');
          syncError.createTableSyncError(
            'rawmaterialsopeningstockvalue',
            err.message
          );
          console.error(err);
        }
      }
    );

    return rawMaterialStockValueSyncSchemaSyncReplicationState;
  }
  rawMaterialStockValueSync().catch((err) => {
    console.log('rawmaterialsopeningStockValueSync error:');
    syncError.createTableSyncError(
      'rawmaterialsopeningStockValueSync',
      err.message
    );
    console.error(err);
  });

  /**
   *  ProductTransactionSettingsSchema table
   */

  async function productTransactionSettingsSchemaSync() {
    const db = await get();

    const productTransactionSettingsSchemaSyncReplicationState =
      productTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    productTransactionSettingsSchemaSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('productTransactionSettingsSchemaSync error:');
          console.error(err);
        }
      }
    );

    return productTransactionSettingsSchemaSyncReplicationState;
  }
  productTransactionSettingsSchemaSync().catch((err) => {
    console.log('productTransactionSettingsSchemaSync error:');
    syncError.createTableSyncError('producttransactionsettings', err.message);
    console.error(err);
  });

  /**
   * TDS table
   */
  async function tdsSync() {
    const db = await get();

    const tdsSyncReplicationState = tdsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    tdsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('tdsSync error:');
        syncError.createTableSyncError('tds', err.message);
        console.error(err);
      }
    });

    return tdsSyncReplicationState;
  }
  tdsSync().catch((err) => {
    console.log('tdsSync error:');
    syncError.createTableSyncError('tds', err.message);
    console.error(err);
  });

  /**
   * Split Payment table
   */
  async function splitPaymentSettingsSync() {
    const db = await get();

    const splitPaymentSettingsSyncReplicationState =
      splitPaymentSettingsSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    splitPaymentSettingsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('splitPaymentSettingsSync error:');
        syncError.createTableSyncError('splitpaymentsettings', err.message);
        console.error(err);
      }
    });

    return splitPaymentSettingsSyncReplicationState;
  }
  splitPaymentSettingsSync().catch((err) => {
    console.log('splitPaymentSettingsSync error:');
    syncError.createTableSyncError('splitpaymentsettings', err.message);
    console.error(err);
  });

  /**
   * Payment In Transaction Settings table
   */
  async function paymentInTransactionSettingsSync() {
    const db = await get();

    const paymentInTransactionSettingsSyncReplicationState =
      paymentInTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    paymentInTransactionSettingsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('paymentInTransactionSettingsSync error:');
        syncError.createTableSyncError(
          'paymentintransactionsettings',
          err.message
        );
        console.error(err);
      }
    });

    return paymentInTransactionSettingsSyncReplicationState;
  }
  paymentInTransactionSettingsSync().catch((err) => {
    console.log('paymentInTransactionSettingsSettingsSync error:');
    syncError.createTableSyncError('paymentintransactionsettings', err.message);
    console.error(err);
  });

  /**
   * Payment Out Transaction Settings table
   */
  async function paymentOutTransactionSettingsSync() {
    const db = await get();

    const paymentOutTransactionSettingsSyncReplicationState =
      paymentOutTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    paymentOutTransactionSettingsSyncReplicationState.error$.subscribe(
      (err) => {
        if (window.navigator.onLine && localStorage.getItem('businessId')) {
          console.error('paymentOutTransactionSettingsSync error:');
          syncError.createTableSyncError(
            'paymentouttransactionsettings',
            err.message
          );
          console.error(err);
        }
      }
    );

    return paymentOutTransactionSettingsSyncReplicationState;
  }
  paymentOutTransactionSettingsSync().catch((err) => {
    console.log('paymentOutTransactionSettingsSync error:');
    syncError.createTableSyncError(
      'paymentouttransactionsettings',
      err.message
    );
    console.error(err);
  });

  /**
   * whatsapp settings table
   */
  async function workLossSchemaSync() {
    const db = await get();

    const workLossSchemaSyncReplicationState = workLossSchemaSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    workLossSchemaSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('workLossSchemaSync error:');
        syncError.createTableSyncError('workLoss', err.message);
        console.error(err);
      }
    });

    return workLossSchemaSyncReplicationState;
  }
  workLossSchemaSync().catch((err) => {
    console.log('workLoss error:');
    syncError.createTableSyncError('workLoss', err.message);
    console.error(err);
  });

  /**
   * KOT Transaction Settings table
   */
  async function kotTransactionSettingsSync() {
    const db = await get();

    const kotTransactionSettingsSyncReplicationState =
      kotTransactionSettingsQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    kotTransactionSettingsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('kotTransactionSettingsSync error:');
        syncError.createTableSyncError('kottransactionsettings', err.message);
        console.error(err);
      }
    });

    return kotTransactionSettingsSyncReplicationState;
  }
  kotTransactionSettingsSync().catch((err) => {
    console.log('kotTransactionSettingsSync error:');
    syncError.createTableSyncError('kottransactionsettings', err.message);
    console.error(err);
  });

  /**
   * Multi Device table
   */
  async function multiDeviceSettingsSync() {
    const db = await get();

    const multiDeviceSettingsSyncReplicationState =
      multiDeviceSettingsQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    multiDeviceSettingsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('multiDeviceSettingsSync error:');
        syncError.createTableSyncError('multiDevicesettings', err.message);
        console.error(err);
      }
    });

    return multiDeviceSettingsSyncReplicationState;
  }
  multiDeviceSettingsSync().catch((err) => {
    console.log('multiDeviceSettingsSync error:');
    syncError.createTableSyncError('multidevicesettings', err.message);
  });

  /*
   * Tally Master Settings table
   */
  async function exportToTallySync() {
    const db = await get();

    const exportToTallySyncReplicationState =
      tallyMasterSettingsSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    exportToTallySyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('exportToTallySync error:');
        syncError.createTableSyncError('tallymastersettings', err.message);
        console.error(err);
      }
    });

    return exportToTallySyncReplicationState;
  }
  exportToTallySync().catch((err) => {
    console.log('exportToTallySync error:');
    syncError.createTableSyncError('tallymastersettings', err.message);
    console.error(err);
  });

  /**
   * Cancel table
   */
  async function cancelTransactionsSync() {
    const db = await get();

    const cancelTransactionsSyncReplicationState =
      retrieveCancelTransactionsSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    cancelTransactionsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('cancelTransactionsSync error:');
        syncError.createTableSyncError('alltransactionscancelled', err.message);
        console.error(err);
      }
    });

    return cancelTransactionsSyncReplicationState;
  }
  cancelTransactionsSync().catch((err) => {
    console.log('cancelTransactionsSync error:');
    syncError.createTableSyncError('alltransactionscancelled', err.message);
  });

  /*
   * Tally Bank Master Settings table
   */
  async function bankMasterTallySync() {
    const db = await get();

    const bankMasterTallySyncReplicationState =
      tallyBankMasterSettingsSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    bankMasterTallySyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('bankMasterTallySync error:');
        syncError.createTableSyncError('tallybankmastersettings', err.message);
        console.error(err);
      }
    });

    return bankMasterTallySyncReplicationState;
  }
  bankMasterTallySync().catch((err) => {
    console.log('bankMasterTallySync error:');
    syncError.createTableSyncError('tallybankmastersettings', err.message);
    console.error(err);
  });

  /*
   * Tally Back To Back Purchase table
   */
  async function backToBackPurchaseSync() {
    const db = await get();

    const backToBackPurchaseSyncReplicationState =
      backToBackPurchasesSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    backToBackPurchaseSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('backToBackPurchaseSync error:');
        syncError.createTableSyncError('backtobackpurchases', err.message);
        console.error(err);
      }
    });

    return backToBackPurchaseSyncReplicationState;
  }
  backToBackPurchaseSync().catch((err) => {
    console.log('backToBackPurchaseSync error:');
    syncError.createTableSyncError('backtobackpurchases', err.message);
    console.error(err);
  });

  /*
   * Audit Settings table
   */
  async function auditSettingsSync() {
    const db = await get();

    const auditSettingsSyncReplicationState = auditSettingsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    auditSettingsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('auditSettingsSync error:');
        syncError.createTableSyncError('auditsettings', err.message);
        console.error(err);
      }
    });

    return auditSettingsSyncReplicationState;
  }
  auditSettingsSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('auditSettingsSync error:');
      syncError.createTableSyncError('auditsettings', err.message);
      console.error(err);
    }
  });

  /*
   * Accounting Notes table
   */
  async function accountingNotesSync() {
    const db = await get();

    const accountingNotesSyncReplicationState = accountingNotesSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    accountingNotesSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('accountingNotesSync error:');
        syncError.createTableSyncError('accountingnotes', err.message);
        console.error(err);
      }
    });

    return accountingNotesSyncReplicationState;
  }
  accountingNotesSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('accountingNotesSync error:');
      syncError.createTableSyncError('accountingnotes', err.message);
      console.error(err);
    }
  });

  /*
   * Reminders table
   */
  async function remindersSync() {
    const db = await get();

    const remindersSyncReplicationState = reminderSettingsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    remindersSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('remindersSync error:');
        syncError.createTableSyncError('reminders', err.message);
        console.error(err);
      }
    });

    return remindersSyncReplicationState;
  }
  remindersSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('remindersSync error:');
      syncError.createTableSyncError('reminders', err.message);
      console.error(err);
    }
  });

  /*
   * Add Ons Group table
   */
  async function addOnsGroupSync() {
    const db = await get();

    const addOnsGroupSyncReplicationState = addOnsGroupSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    addOnsGroupSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('addOnsGroupSync error:');
        syncError.createTableSyncError('addonsgroup', err.message);
        console.error(err);
      }
    });

    return addOnsGroupSyncReplicationState;
  }

  addOnsGroupSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('addOnsGroupSync error:');
      syncError.createTableSyncError('addonsgroup', err.message);
      console.error(err);
    }
  });

  /*
   * Scheme Management table
   */
  async function schemeManagementSync() {
    const db = await get();

    const schemeManagementSyncReplicationState =
      schemeManagementSyncQueryBuilder(db, SYNC_URL, BATCH_SIZE, posId, token);

    schemeManagementSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('schemeManagementSync error:');
        syncError.createTableSyncError('schememanagement', err.message);
        console.error(err);
      }
    });
    return schemeManagementSyncReplicationState;
  }

  schemeManagementSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('schemeManagementSync error:');
      syncError.createTableSyncError('schememanagement', err.message);
      console.error(err);
    }
  });

  /*
   * Scheme Types table
   */
  async function schemeTypesSync() {
    const db = await get();

    const schemeTypesSyncReplicationState = schemeTypesSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    schemeTypesSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('schemeTypesSync error:');
        syncError.createTableSyncError('schemetypes', err.message);
        console.error(err);
      }
    });

    return schemeTypesSyncReplicationState;
  }
  schemeTypesSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('schemeTypesSync error:');
      syncError.createTableSyncError('schemetypes', err.message);
      console.error(err);
    }
  });

  /*
   * Add Ons table
   */
  async function addOnsSync() {
    const db = await get();

    const addOnsSyncReplicationState = addOnsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    addOnsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('addOnsSync error:');
        syncError.createTableSyncError('addons', err.message);
        console.error(err);
      }
    });
    return addOnsSyncReplicationState;
  }
  addOnsSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('addOnsSync error:');
      syncError.createTableSyncError('addons', err.message);
      console.error(err);
    }
  });

  async function loyaltySettingsSync() {
    const db = await get();

    const loyaltySettingsSyncReplicationState = loyaltySettingsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    loyaltySettingsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('loyaltySettingsSync error:');
        syncError.createTableSyncError('loyaltysettings', err.message);
        console.error(err);
      }
    });
    return loyaltySettingsSyncReplicationState;
  }
  loyaltySettingsSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('loyaltySettingsSync error:');
      syncError.createTableSyncError('loyaltysettings', err.message);
      console.error(err);
    }
  });

  /*
   * Product Group table
   */
  async function productGroupSync() {
    const db = await get();

    const productGroupSyncReplicationState = productGroupSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    productGroupSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('productGroupSync error:');
        syncError.createTableSyncError('productgroup', err.message);
        console.error(err);
      }
    });
    return productGroupSyncReplicationState;
  }
  productGroupSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('productGroupSync error:');
      syncError.createTableSyncError('productgroup', err.message);
      console.error(err);
    }
  });

  /*
   * Session Management table
   */
  async function sessionGroupSync() {
    const db = await get();

    const sessionGroupSyncReplicationState = sessionGroupSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    sessionGroupSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('sessionGroupSync error:');
        syncError.createTableSyncError('sessiongroup', err.message);
        console.error(err);
      }
    });

    return sessionGroupSyncReplicationState;
  }
  sessionGroupSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('sessionGroupSync error:');
      syncError.createTableSyncError('sessiongroup', err.message);
      console.error(err);
    }
  });

  /*
   * Employee Types table
   */
  async function employeeTypesSync() {
    const db = await get();

    const employeeTypesSyncReplicationState = employeeTypesSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    employeeTypesSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('employeeTypesSync error:');
        syncError.createTableSyncError('employeetypes', err.message);
        console.error(err);
      }
    });

    return employeeTypesSyncReplicationState;
  }
  employeeTypesSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('employeeTypesSync error:');
      syncError.createTableSyncError('employeetypes', err.message);
      console.error(err);
    }
  });

  /*
   * Report Settings table
   */
  async function reportSettingsSync() {
    const db = await get();

    const reportSettingsSyncReplicationState = reportSettingsSyncQueryBuilder(
      db,
      SYNC_URL,
      BATCH_SIZE,
      posId,
      token
    );

    reportSettingsSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('reportSettingsSync error:');
        syncError.createTableSyncError('reportsettings', err.message);
        console.error(err);
      }
    });
    return reportSettingsSyncReplicationState;
  }
  reportSettingsSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('reportSettingsSync error:');
      syncError.createTableSyncError('reportsettings', err.message);
      console.error(err);
    }
  });

  /*
   * Tally Sequence Numbers table
   */
  async function tallySequenceNumbersSync() {
    const db = await get();

    const tallySequenceNumbersSyncReplicationState =
      tallySequenceNumbersSyncQueryBuilder(
        db,
        SYNC_URL,
        BATCH_SIZE,
        posId,
        token
      );

    tallySequenceNumbersSyncReplicationState.error$.subscribe((err) => {
      if (window.navigator.onLine && localStorage.getItem('businessId')) {
        console.error('tallySequenceNumbersSync error:');
        syncError.createTableSyncError('tallysequencenumbers', err.message);
        console.error(err);
      }
    });
    return tallySequenceNumbersSyncReplicationState;
  }
  tallySequenceNumbersSync().catch((err) => {
    if (window.navigator.onLine && localStorage.getItem('businessId')) {
      console.log('tallySequenceNumbersSync error:');
      syncError.createTableSyncError('tallysequencenumbers', err.message);
      console.error(err);
    }
  });
}