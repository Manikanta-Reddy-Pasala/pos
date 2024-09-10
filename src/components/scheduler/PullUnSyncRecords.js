// import * as Bd from '../SelectedBusiness';
// import * as sync from '../Helpers/SchemaSyncHelper';
//
// export const PullUnSyncRecordsFromTables = async () => {
//   if (window.navigator.onLine) {
//     const tables = [
//       'sales',
//       'salesreturn',
//       // 'salesquotation',
//       // 'saleorder',
//       // 'deliverychallan',
//       // 'approvals',
//       // 'jobworkin',
//       // 'jobwork',
//       // 'paymentin',
//       // 'paymentout',
//       'purchases',
//       'purchasesreturn'
//       // 'purchaseorder',
//       // 'businessproduct',
//       // 'parties',
//       // 'warehouse',
//       // 'bankaccounts',
//       // 'cashadjustments',
//       // 'employees',
//       // 'expenses',
//       // 'tds',
//       // 'tcs'
//     ];
//
//     const businessData = await Bd.getBusinessData();
//
//     tables.forEach(async (table) => {
//       const records = await sync.pullUnSyncedRecordsForBusiness(
//         table,
//         businessData.businessId
//       );
//
//       if (records != null || records.length > 0) {
//         records.forEach(async (record) => {
//           await db[table]
//             .insert(InsertDoc)
//             .then((data) => {
//               // console.log('data Inserted:', data);
//             })
//             .catch((err) => {
//               console.log('Error in Adding userdata:', err);
//             });
//         });
//       }
//     });
//   }
// };
