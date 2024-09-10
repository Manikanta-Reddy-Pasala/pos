// import * as Bd from '../../components/SelectedBusiness';
// import * as sync from '../Helpers/SchemaSyncHelper';
//
// export const pushNotSyncedRecordsFormTables = async () => {
//   if (window.navigator.onLine) {
//     const tables = [
//       'sales',
//       'salesreturn',
//       'salesquotation',
//       'saleorder',
//       'deliverychallan',
//       'approvals',
//       'jobworkin',
//       'jobwork',
//       'paymentin',
//       'paymentout',
//       'purchases',
//       'purchasesreturn',
//       'purchaseorder',
//       'businessproduct',
//       'parties',
//       'warehouse',
//       'bankaccounts',
//       'cashadjustments',
//       'employees',
//       'expenses',
//       'tds',
//       'tcs'
//     ];
//
//     const businessData = await Bd.getBusinessData();
//
//     const tableToValidationFunction = {
//       sales: sync.validateSalesDocumentBeforeSync,
//       salesreturn: sync.validateSalesReturnDocumentBeforeSync,
//       salesquotation: sync.validateSalesQuotationDocumentBeforeSync,
//       saleorder: sync.validateSaleOrderDocumentBeforeSync,
//       deliverychallan: sync.validateDeliveryChallanDocumentBeforeSync,
//       approvals: sync.validateApprovalsDocumentBeforeSync,
//       jobworkin: sync.validateJobWorkInDocumentBeforeSync,
//       jobwork: sync.validateJobWorkDocumentBeforeSync,
//       paymentin: sync.validatePaymentInDocumentBeforeSync,
//       paymentout: sync.validatePaymentOutDocumentBeforeSync,
//       purchases: sync.validatePurchasesDocumentBeforeSync,
//       purchasesreturn: sync.validatePurchasesReturnDocumentBeforeSync,
//       purchaseorder: sync.validatePurchaseOrderDocumentBeforeSync,
//       businessproduct: sync.validateBusinessProductDocumentBeforeSync,
//       parties: sync.validatePartiesDocumentBeforeSync,
//       warehouse: sync.validateWarehouseDocumentBeforeSync,
//       bankaccounts: sync.validateBankAccountsDocumentBeforeSync,
//       cashadjustments: sync.validateCashAdjustmentsDocumentBeforeSync,
//       employees: sync.validateEmployeesDocumentBeforeSync,
//       expenses: sync.validateExpensesDocumentBeforeSync,
//       tds: sync.validateTDSDocumentBeforeSync,
//       tcs: sync.validateTCSDocumentBeforeSync
//     };
//
//     tables.forEach(async (table) => {
//       const records = await sync.getUnSyncedRecordsForBusiness(table, businessData.businessId);
//
//       if (records != null || records.length > 0) {
//         records.forEach(async (record) => {
//           const validationFunction = tableToValidationFunction[table];
//           if (validationFunction) {
//             await validationFunction(record);
//           }
//         });
//       }
//     });
//   }
// };
//
