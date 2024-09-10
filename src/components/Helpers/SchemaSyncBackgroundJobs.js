import greenlet from 'greenlet';
import * as syncError from './SyncErrorHelper';

export const validateSalesDocumentInBackground = greenlet(async (doc, syncUrl) => {

  // Remove unnecessary units
  for (const item of doc.item_list) {
    if (item.units && item.units.length > 2) {
      item.units = item.units.slice(0, 2);
    }
  }

  try {
    const query = JSON.stringify({
      query: `mutation setSales($input: SalesInput) {
        setSales(sales: $input) {
          invoice_number,
          updatedAt
        }
      }`,
      variables: { input: doc }
    });

    const response = await fetch(syncUrl, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();

    const errors = responseJson.errors;

    if (errors) {
      // Store into db
      const errorMessageArray = errors.map((item) => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'sales',
        errorMessage,
        doc,
        doc.invoice_number,
        doc.invoice_date,
        doc.sequenceNumber
      );
    }

    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});


export const validateTransactionsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setTransactions($input: TransactionsInput) {
        setTransactions(transactions: $input) {
              id,
              updatedAt
          }
      }
      `,
      variables: { input: doc }
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
      var errorMessageArray = errors.map(function(item) {
        return item['message'];
      });

      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'alltransactions',
        errorMessage,
        doc,
        doc.id,
        doc.date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateApprovalsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setApprovals($input: ApprovalsInput) {
        setApprovals(approvals: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
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
      var errorMessageArray = errors.map(function(item) {
        return item['message'];
      });

      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'approvals',
        errorMessage,
        doc,
        doc.approvalNumber,
        doc.approvalDate,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateApprovalTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setApprovalTransactionSettings($input: ApprovalTransactionSettingsInput) {
        setApprovalTransactionSettings(approvalTransactionSettings: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();

    const errors = responseJson.errors;

    if (errors) {
      // Store into db
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'approvaltransactionsettings',
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
});


export const validateSchemeManagementInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSchemeManagement($input: SchemeManagementInput) {
        setSchemeManagement(schemeManagement: $input) {
              id
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'schememanagement',
        errorMessage,
        doc,
        doc.id,
        doc.date,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateSchemeTypesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSchemeTypes($input: SchemeTypesInput) {
        setSchemeTypes(schemeTypes: $input) {
              id
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'schemetypes',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateProductGroupInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setProductGroup($input: ProductGroupInput) {
        setProductGroup(productGroup: $input) {
              groupId
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'productgroup',
        errorMessage,
        doc,
        doc.groupId,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateSessionGroupInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSessionGroup($input: SessionGroupInput) {
        setSessionGroup(sessionGroup: $input) {
              sessionGroupId
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'sessiongroup',
        errorMessage,
        doc,
        doc.id,
        doc.date,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateEmployeeTypesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setEmployeeTypes($input: EmployeeTypesInput) {
        setEmployeeTypes(employeeTypes: $input) {
              id
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'employeetypes',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateReportSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setReportSettings($input: ReportSettingsInput) {
        setReportSettings(reportSettings: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'reportsettings',
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
});


export const validateTallyMasterSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setTallyMasterSettings($input: TallyMasterSettingsInput) {
        setTallyMasterSettings(tallyMasterSettings: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'tallymastersettings',
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
});

export const validateTallyBankMasterSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setTallyBankMasterSettings($input: TallyBankMasterSettingsInput) {
        setTallyBankMasterSettings(tallyBankMasterSettings: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'tallybankmastersettings',
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
});

export const validateBackToBackPurchasesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setBackToBackPurchases($input: BackToBackPurchasesInput) {
        setBackToBackPurchases(backToBackPurchases: $input) {
              backToBackPurchaseNumber,
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'backtobackpurchases',
        errorMessage,
        doc,
        doc.backToBackPurchaseNumber,
        doc.bill_date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateAuditSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setAuditSettings($input: AuditSettingsInput) {
        setAuditSettings(auditSettings: $input) {
              id
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'auditsettings',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateAccountingNotesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setAccountingNotes($input: AccountingNotesInput) {
        setAccountingNotes(accountingNotes: $input) {
              id
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'accountingnotes',
        errorMessage,
        doc,
        doc.id,
        doc.date,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateReminderSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setReminders($input: BusinessRemindersInput) {
        setReminders(businessReminders: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'reminders',
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
});

export const validateAddOnsGroupInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setAddOnsGroup($input: AddOnsGroupInput) {
        setAddOnsGroup(addOnsGroup: $input) {
              groupId
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'addonsgroup',
        errorMessage,
        doc,
        doc.groupId,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateAddOnsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setAddOns($input: AddOnsInput) {
        setAddOns(addOns: $input) {
              additionalPropertyId
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'addons',
        errorMessage,
        doc,
        doc.additionalPropertyId,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});


export const validatePaymentInTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPaymentInTransactionSettings($input: PaymentInTransactionSettingsInput) {
        setPaymentInTransactionSettings(paymentInTransactionSettings: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'paymentintransactionsettings',
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
});

export const validatePaymentOutTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPaymentOutTransactionSettings($input: PaymentOutTransactionSettingsInput) {
        setPaymentOutTransactionSettings(paymentOutTransactionSettings: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'paymentouttransactionsettings',
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
});

export const validateWorkLossInBackground = greenlet(async (doc, SYNC_URL) => {
  doc.netWeightLoss = doc.netWeightLoss
    ? parseFloat(doc.netWeightLoss).toFixed(4) || 0
    : 0;

  if (doc.netWeightLoss > 0) {
    try {
      const query = JSON.stringify({
        query: `mutation setWorkLossSchema($input: WorkLossInput) {
          setWorkLoss(workLoss: $input) {
                workLossId,
                updatedAt
          }
      }
      `,
        variables: { input: doc }
      });

      const response = await fetch(SYNC_URL, {
        headers: { 'content-type': 'application/json' },
        method: 'POST',
        body: query
      });

      const responseJson = await response.json();
      const errors = responseJson.errors;

      if (errors) {
        const errorMessageArray = errors.map(item => item['message']);
        const errorMessage = errorMessageArray.join('\r\n');

        await syncError.createDocumentSyncError(
          'workloss',
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
});

export const validateKotTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setKotTransactionSettings($input: KotTransactionSettingsInput) {
        setKotTransactionSettings(kotTransactionSettings: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'kottransactionsettings',
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
});

export const validateCancelInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setCancelTransactions($input: CancelTransactionsInput) {
        setCancelTransactions(cancelTransactions: $input) {
              id        
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'alltransactionscancelled',
        errorMessage,
        doc,
        doc.id,
        doc.createdDate,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateMultiDeviceSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setMultiDeviceSettings($input: MultiDeviceSettingsInput) {
        setMultiDeviceSettings(multiDeviceSettings: $input) {
              updatedAt
          }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'multidevicesettings',
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
});

export const validateSpecialDaysInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation SpecialDaysManagement($input: SpecialDaysManagementInput) {
        setSpecialDaysManagement(specialDaysManagement: $input) {        
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'specialdays',
        errorMessage,
        doc,
        doc.id,
        doc.startDate,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateTaxSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setTaxSettings($input: TaxSettingsInput) {
        setTaxSettings(taxsettings: $input) {        
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'taxsettings',
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
});

export const validateTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setTransactionSettings($input: TransactionSettingsInput) {
        setTransactionSettings(transactionSettings: $input) {
          userId,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'transactionsettings',
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
});

export const validateWaitersInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setWaiter($input: WaiterInput) {
        setWaiter(waiter: $input) {
          phoneNumber,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'waiters',
        errorMessage,
        doc,
        doc.phoneNumber,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateWhatsAppSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setWhatsAppSettings($input: WhatsAppSettingsInput) {
        setWhatsAppSettings(whatsappsettings: $input) {        
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'whatsappsettings',
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
});

export const validateLoyaltySettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setLoyaltySettings($input: LoyaltySettingsInput) {
        setLoyaltySettings(loyaltysettings: $input) {        
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'loyaltysettings',
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
});

export const validateCloudPrinterSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setCloudPrinterSettings($input: CloudPrinterSettingsInput) {
        setCloudPrinterSettings(cloudPrinterSettings: $input) {
          id
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'cloudprintsettings',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateManufacturingDirectExpensesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setManufacturingDirectExpenses($input: ManufacturingDirectExpensesInput) {
        setManufacturingDirectExpenses(manufacturingDirectExpenses: $input) {
          id
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'manufacturedirectexpenses',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateProductTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setProductTransactionSettings($input: ProductTransactionSettingsInput) {
        setProductTransactionSettings(productTransactionSettings: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'producttransactionsettings',
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
});

export const validateTDSInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setTDS($input: TDSInput) {
        setTDS(tds: $input) {
          id
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'tds',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateSplitPaymentSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSplitPaymentSettings($input: SplitPaymentSettingsInput) {
        setSplitPaymentSettings(splitPaymentSettings: $input) {        
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'splitpaymentsettings',
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
});

export const validatePurchaseOrderTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPurchaseOrderTransactionSettings($input: PurchaseOrderTransactionSettingsInput) {
        setPurchaseOrderTransactionSettings(purchaseOrderTransactionSettings: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'purchaseordertransactionsettings',
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
});

export const validatePurchasesReturnInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPurchasesReturn($input: PurchaseReturnsInput) {
        setPurchasesReturn(purchaseReturns: $input) {
          purchase_return_number,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'purchasesreturn',
        errorMessage,
        doc,
        doc.purchase_return_number,
        doc.date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validatePurchasesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPurchases($input: PurchasesInput) {
        setPurchases(purchases: $input) {
          bill_number,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'purchases',
        errorMessage,
        doc,
        doc.bill_number,
        doc.bill_date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validatePurchaseTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPurchaseTransactionSettings($input: PurchaseTransactionSettingsInput) {
        setPurchaseTransactionSettings(purchaseTransactionSettings: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'purchasetransactionsettings',
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
});

export const validateRatesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setRates($input: RatesInput) {
        setRates(rates: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'rates',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateTCSInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setTCS($input: TCSInput) {
        setTCS(tcs: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'tcs',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateWarehouseInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setWarehouse($input: WarehouseInput) {
        setWarehouse(warehouse: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'warehouse',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateAllTransactionsDeletedInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setRetrieveDeletedTransactions($input: RetrieveDeletedTransactionsInput) {
        setRetrieveDeletedTransactions(retrieveDeletedTransactions: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'alltransactionsdeleted',
        errorMessage,
        doc,
        doc.id,
        doc.createdDate,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateSaleOrderInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSaleOrder($input: SaleOrderInput) {
        setSaleOrder(saleOrder: $input) {
          sale_order_invoice_number,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'saleorder',
        errorMessage,
        doc,
        doc.sale_order_invoice_number,
        doc.invoice_date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateSaleOrderTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSaleOrderTransactionSettings($input: SaleOrderTransactionSettingsInput) {
        setSaleOrderTransactionSettings(saleOrderTransactionSettings: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'saleordertransactionsettings',
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
});

export const validateSaleQuotationTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSaleQuotationTransactionSettings($input: SaleQuotationTransactionSettingsInput) {
        setSaleQuotationTransactionSettings(saleQuotationTransactionSettings: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'salequotationtransactionsettings',
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
});

export const validateSalesQuotationInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSalesQuotation($input: SalesQuotationInput) {
        setSalesQuotation(salesQuotation: $input) {
          invoice_number,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'salesquotation',
        errorMessage,
        doc,
        doc.invoice_number,
        doc.invoice_date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateSalesReturnInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSalesReturn($input: SalesReturnInput) {
        setSalesReturn(salesReturn: $input) {
          sales_return_number,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'salesreturn',
        errorMessage,
        doc,
        doc.sales_return_number,
        doc.date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateSaleTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSaleTransactionSettings($input: SaleTransactionSettingsInput) {
        setSaleTransactionSettings(saleTransactionSettings: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'saletransactionsettings',
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
});

export const validateSequenceNumbersInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setSequence($input: SequenceInput) {
        setSequence(sequence: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'sequencenumbers',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateJobWorkInInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setJobWorkInSchema($input: JobWorkInInput) {
        setJobWorkIn(jobWorkIn: $input) {
          job_work_in_invoice_number,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'jobworkin',
        errorMessage,
        doc,
        doc.job_work_in_invoice_number,
        doc.invoice_date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateJobWorkInTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setJobWorkInTransactionSettings($input: JobWorkInTransactionSettingsInput) {
        setJobWorkInTransactionSettings(jobWorkInTransactionSettings: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'jobworkintransactionsettings',
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
});

export const validateJobWorkReceiptInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setJobWorkReceipt($input: JobWorkReceiptInput) {
        setJobWorkReceipt(jobWorkReceipt: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'jobworkreceipt',
        errorMessage,
        doc,
        doc.id,
        doc.receiptDate,
        doc.receiptSequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateJobWorkInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setJobWork($input: JobWorkInput) {
        setJobWork(jobWork: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'jobwork',
        errorMessage,
        doc,
        doc.id,
        doc.orderDate,
        doc.invoiceSequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateKotDataInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setKotData($input: KotInput) {
        setKotData(kotData: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'kotdata',
        errorMessage,
        doc,
        doc.id,
        doc.invoice_date,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateMobileUserPermissionsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setMobileUserPermissions($input: MobileUserPermissionsInput) {
        setMobileUserPermissions(mobileUserPermissions: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'mobileuserpermissions',
        errorMessage,
        doc,
        doc.userName,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validatePosUserPermissionsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPosUserPermissions($input: PosUserPermissionsInput) {
        setPosUserPermissions(posUserPermissions: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'posuserpermissions',
        errorMessage,
        doc,
        doc.userName,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validatePartiesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setParties($input: PartiesInput) {
        setParties(parties: $input) {
          phoneNo,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'parties',
        errorMessage,
        doc,
        doc.id,
        doc.asOfDate,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validatePaymentInInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPaymentIn($input: PaymentInInput) {
        setPaymentIn(paymentIn: $input) {
          receiptNumber,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'paymentin',
        errorMessage,
        doc,
        doc.receiptNumber,
        doc.date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validatePaymentOutInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPaymentOut($input: PaymentOutInput) {
        setPaymentOut(paymentOut: $input) {
          receiptNumber,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'paymentout',
        errorMessage,
        doc,
        doc.receiptNumber,
        doc.date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validatePrinterSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPrinterSettings($input: PrinterSettingsInput) {
        setPrinterSettings(printerSettings: $input) {
          userId,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'printersettings',
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
});

export const validateProductTxnDocumentInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setProductTxn($input: ProductTxnInput) {
        setProductTxn(productTxn: $input) {
          txnId,
          updatedAt
        }
      }`,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'producttxn',
        errorMessage,
        doc,
        doc.id,
        doc.txnDate,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validatePurchaseOrderInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setPurchaseOrder($input: PurchaseOrderInput) {
        setPurchaseOrder(purchaseOrder: $input) {
          purchase_order_invoice_number,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'purchaseorder',
        errorMessage,
        doc,
        doc.purchase_order_invoice_number,
        doc.po_date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateAuditInBackground = greenlet(async (doc, SYNC_URL) => {
  doc.id = doc.id ? doc.id : doc.timestampString;

  try {
    const query = JSON.stringify({
      query: `mutation setAudit($input: AuditInput) {
        setAudit(audit: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'audit',
        errorMessage,
        doc,
        doc.timestampString,
        doc.date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateBankAccountsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setBankAccounts($input: BankAccountsInput) {
        setBankAccounts(bankAccounts: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'bankaccounts',
        errorMessage,
        doc,
        doc.id,
        doc.asOfDate,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateBarcodeSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setBarcodeSettings($input: BarcodeInput) {
        setBarcodeSettings(barcode: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'barcodesettings',
        errorMessage,
        doc,
        doc.id,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateBusinessCategoriesLevel1InBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setBusinessCategories($input: BusinessCategoriesInput) {
        setBusinessCategories(businessCategories: $input) {
          categoryId,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'businesscategorieslevel1',
        errorMessage,
        doc,
        doc.categoryId,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateBusinessCategoriesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setBusinessCategories($input: BusinessCategoriesInput) {
        setBusinessCategories(businessCategories: $input) {
          categoryId,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'businesscategories',
        errorMessage,
        doc,
        doc.categoryId,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateBusinessProductInBackground = greenlet(async (doc, SYNC_URL) => {
  if (doc.units && doc.units.length > 2) {
    doc.units = doc.units.slice(0, 2);
  }

  try {
    const query = JSON.stringify({
      query: `mutation setBusinessProduct($input: ProductInput) {
        setBusinessProduct(product: $input) {
          productId,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'businessproduct',
        errorMessage,
        doc,
        doc.productId,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateCashAdjustmentsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setCashAdjustments($input: CashAdjustmentsInput) {
        setCashAdjustments(adjustments: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'cashadjustments',
        errorMessage,
        doc,
        doc.id,
        doc.date,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateDeliveryChallanInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setDeliveryChallan($input: DeliveryChallanInput) {
        setDeliveryChallan(deliveryChallan: $input) {
          delivery_challan_invoice_number,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'deliverychallan',
        errorMessage,
        doc,
        doc.delivery_challan_invoice_number,
        doc.invoice_date,
        doc.sequenceNumber
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateDeliveryChallanTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setDeliveryChallanTransactionSettings($input: DeliveryChallanTransactionSettingsInput) {
        setDeliveryChallanTransactionSettings(deliveryChallanTransactionSettings: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'deliverychallantransactionsettings',
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
});

export const validateEmployeesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setEmployee($input: EmployeeInput) {
        setEmployee(employee: $input) {
          id,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'employees',
        errorMessage,
        doc,
        doc.id,
        doc.date,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateExpenseCategoriesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setExpenseCategories($input: ExpenseCategoriesInput) {
        setExpenseCategories(expenses: $input) {
          category,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'expensecategories',
        errorMessage,
        doc,
        doc.categoryId,
        'NA',
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateExpensesInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setExpenses($input: ExpensesInput) {
        setExpenses(expenses: $input) {
          expenseId,
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'expenses',
        errorMessage,
        doc,
        doc.expenseId,
        doc.date,
        'NA'
      );
    }
    return null;
  } catch (err) {
    console.log(err);
    return doc;
  }
});

export const validateExpenseTransactionSettingsInBackground = greenlet(async (doc, SYNC_URL) => {
  try {
    const query = JSON.stringify({
      query: `mutation setExpenseTransactionSettings($input: ExpenseTransactionSettingsInput) {
        setExpenseTransactionSettings(expenseTransactionSettings: $input) {
          updatedAt
        }
      }
      `,
      variables: { input: doc }
    });

    const response = await fetch(SYNC_URL, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: query
    });

    const responseJson = await response.json();
    const errors = responseJson.errors;

    if (errors) {
      const errorMessageArray = errors.map(item => item['message']);
      const errorMessage = errorMessageArray.join('\r\n');

      await syncError.createDocumentSyncError(
        'expensetransactionsettings',
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
});

