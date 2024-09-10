import * as Db from '../../RxDb/Database/Database';
import * as SchemaSyncHelper from './SchemaSyncBackgroundJobs';
import * as syncError from './SyncErrorHelper';
import { toJS } from 'mobx';

export const getLastSyncedRecordForBusiness = async (tablename, businessId) => {
  const db = await Db.get();
  let doc = null;
  try {
    let dbQuery = db[tablename].findOne({
      selector: {
        $and: [
          { businessId: { $eq: businessId } },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ updatedAt: 'desc' }]
    });

    await dbQuery.exec().then((data) => {
      if (!data) {
        // No data is available
        doc = null;
        return;
      }
      // console.log('sales', item.toJSON());
      doc = data.toJSON();
    });
  } catch (e) {
    console.error(
      'Error at Switch Business lastSync record for table : ' +
      tablename +
      '. Message' +
      e.message
    );
  }

  return doc;
};


export const getLocalStorageUserId = () => {
  return localStorage.getItem('mobileNumber');
};

export const getLocalStorageDeviceId = () => {
  return localStorage.getItem('deviceId') || 0;
};

export const validateSalesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSalesDocumentInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateAllTransactionsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateTransactionsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateApprovalsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateApprovalsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateApprovalTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateApprovalTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateJobWorkInDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateJobWorkInInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateJobWorkInTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateJobWorkInTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateJobWorkReceiptDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateJobWorkReceiptInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateJobWorkDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateJobWorkInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateKotDataDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateKotDataInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateAuditDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateAuditInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateBankAccountsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateBankAccountsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateBarcodeSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateBarcodeSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateBusinessCategoriesLevel1DocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateBusinessCategoriesLevel1InBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateBusinessCategoriesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateBusinessCategoriesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateBusinessProductDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateBusinessProductInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateCashAdjustmentsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateCashAdjustmentsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateDeliveryChallanDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateDeliveryChallanInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateDeliveryChallanTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateDeliveryChallanTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateEmployeesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateEmployeesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateExpenseCategoriesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateExpenseCategoriesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateExpensesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateExpensesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateExpenseTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateExpenseTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateMobileUserPermissionsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateMobileUserPermissionsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePosUserPermissionsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePosUserPermissionsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePartiesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePartiesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePaymentInDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePaymentInInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePaymentOutDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePaymentOutInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePrinterSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePrinterSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateProductTxnDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateProductTxnDocumentInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePurchaseOrderDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePurchaseOrderInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePurchaseOrderTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePurchaseOrderTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePurchasesReturnDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePurchasesReturnInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePurchasesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePurchasesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePurchaseTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePurchaseTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateRatesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateRatesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateTCSDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateTCSInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateWarehouseDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateWarehouseInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateAllTransactionsDeletedDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateAllTransactionsDeletedInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSaleOrderDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSaleOrderInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSaleOrderTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSaleOrderTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSaleQuotationTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSaleQuotationTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSalesQuotationDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSalesQuotationInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSalesReturnDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSalesReturnInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSaleTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSaleTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSequenceNumbersDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSequenceNumbersInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSpecialDaysDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSpecialDaysInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateTaxSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateTaxSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateWaitersDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateWaitersInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateWhatsAppSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateWhatsAppSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateLoyaltySettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateLoyaltySettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateCloudPrinterSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateCloudPrinterSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateManufacturingDirectExpensesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateManufacturingDirectExpensesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateProductTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateProductTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateTDSDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateTDSInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSplitPaymentSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSplitPaymentSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePaymentInTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePaymentInTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validatePaymentOutTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validatePaymentOutTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateWorkLossDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateWorkLossInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateKotTransactionSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateKotTransactionSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateCancelDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateCancelInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateMultiDeviceSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateMultiDeviceSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateTallyMasterSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateTallyMasterSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateTallyBankMasterSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateTallyBankMasterSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateBackToBackPurchasesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateBackToBackPurchasesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateAuditSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateAuditSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateAccountingNotesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateAccountingNotesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateReminderSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateReminderSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateAddOnsGroupDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateAddOnsGroupInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateAddOnsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateAddOnsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSchemeManagementDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSchemeManagementInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSchemeTypesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSchemeTypesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateProductGroupDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateProductGroupInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateSessionGroupDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateSessionGroupInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateEmployeeTypesDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateEmployeeTypesInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateReportSettingsDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;
    return await SchemaSyncHelper.validateReportSettingsInBackground(doc, SYNC_URL);
  }
  return doc;
};

export const validateTallySequenceNumbersDocumentBeforeSync = async (doc) => {
  if (window.navigator.onLine) {
    const SYNC_URL = window.REACT_APP_SYNC_URL;

    try {
      const query = JSON.stringify({
        query: `mutation setTallySequenceNumbers($input: TallySequenceNumbersInput) {
            setTallySequenceNumbers(tallySequenceNumbers: $input) {
                updatedAt
            }
        }
      `,
        variables: { input: toJS(doc) }
      });

      const response = await fetch(SYNC_URL, {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: query
      });

      const responseJson = await response.json();

      const errors = responseJson.errors;

      if (errors) {
        //store into db
        var errorMessageArray = errors.map(function (item) {
          return item['message'];
        });

        const errorMessage = errorMessageArray.join('\r\n');

        await syncError.createDocumentSyncError(
          'tallysequencenumbers',
          errorMessage,
          doc,
          doc.businessId,
          'NA',
          'NA'
        );
      }
      return null;
    } catch (err) {
      console.log(err);
      return doc;
    }
  }
  return doc;
};