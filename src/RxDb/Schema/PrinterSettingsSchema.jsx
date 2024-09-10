import * as Bd from '../../components/SelectedBusiness';
import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';

import greenlet from 'greenlet';

export const PrinterSettingsSchema = {
  title: 'Printer Settings table',
  description: 'printer settings table',
  version: 9,
  type: 'object',
  properties: {
    userId: { type: 'string' },
    businessId: {
      type: 'string',
      primary: true
    },
    businessCity: {
      type: 'string'
    },
    invoiceRegular: {
      userId: { type: 'string' },
      boolDefault: { type: 'boolean' },
      boolCompanyName: { type: 'boolean' },
      strCompanyName: { type: 'string' },
      boolCompanyLogo: { type: 'boolean' },
      fileCompanyLogo: { type: 'string' },
      boolAddress: { type: 'boolean' },
      strAddress: { type: 'string' },
      boolEmail: { type: 'boolean' },
      strEmail: { type: 'string' },
      boolPhone: { type: 'boolean' },
      strPhone: { type: 'string' },
      boolGSTIN: { type: 'boolean' },
      strGSTIN: { type: 'string' },
      boolSignature: { type: 'boolean' },
      strSignature: { type: 'string' },
      fileSignature: { type: 'string' },
      boolDesc: { type: 'boolean' },
      strDesc: { type: 'string' },
      boolTerms: { type: 'boolean' },
      strTerms: { type: 'string' },
      boolTaxDetails: { type: 'boolean' },
      boolPaymentMode: { type: 'boolean' },
      boolAcknowledgement: { type: 'boolean' },
      ddlPageSize: { type: 'string' },
      headerSpace: { type: 'boolean' },
      headerSize: { type: 'number' },
      headerUnit: { type: 'string' },
      footerSpace: { type: 'boolean' },
      footerSize: { type: 'number' },
      footerUnit: { type: 'string' },
      boolBankDetail: { type: 'boolean' },
      bankName: { type: 'string' },
      bankIfscCode: { type: 'string' },
      bankAccountNumber: { type: 'string' },
      boolBankDetailsOnCreditSaleOnly: { type: 'boolean' },
      boolQrCode: { type: 'boolean' },
      strqrcode: { type: 'string' },
      qrCodeValueOptn: { type: 'string' },
      paymentbankNumber: { type: 'string' },
      paymentifsc: { type: 'string' },
      paymentUpi: { type: 'string' },
      theme: { type: 'string' },
      textSize: { type: 'string' },
      logoSize: { type: 'string' },
      signatureSize: { type: 'string' },
      boolWebsite: { type: 'boolean' },
      strWebsite: { type: 'string' },
      bankAccountHolderName: { type: 'string' },
      boolPAN: { type: 'boolean' },
      strPAN: { type: 'string' },
      boolPreviousBalance: { type: 'boolean' },
      paymentPayeeName: { type: 'string' },
      showCustomPrintPopUp: { type: 'boolean' },
      printOriginal: { type: 'boolean' },
      printOriginalCopies: { type: 'number' },
      printDuplicate: { type: 'boolean' },
      printDuplicateCopies: { type: 'number' },
      printTriplicate: { type: 'boolean' },
      printTriplicateCopies: { type: 'number' },
      printCustom: { type: 'boolean' },
      printCustomName: { type: 'string' },
      printCustomCopies: { type: 'number' },
      companyNameColor: { type: 'string' },
      boolBisHallmark: { type: 'boolean' },
      schemeBoolTerms: { type: 'boolean' },
      schemeStrTerms: { type: 'string' },
      boolCompanyAdditionalDesc: { type: 'boolean' },
      companyAdditionalDesc: { type: 'string' },
      boolJurisdiction: { type: 'boolean' },
      jurisdiction: { type: 'string' }
    },
    invoiceThermal: {
      userId: { type: 'string' },
      boolDefault: { type: 'boolean' },
      boolCompanyName: { type: 'boolean' },
      strCompanyName: { type: 'string' },
      boolCompanyLogo: { type: 'boolean' },
      fileCompanyLogo: { type: 'string' },
      boolAddress: { type: 'boolean' },
      strAddress: { type: 'string' },
      boolEmail: { type: 'boolean' },
      strEmail: { type: 'string' },
      boolPhone: { type: 'boolean' },
      strPhone: { type: 'string' },
      boolGSTIN: { type: 'boolean' },
      strGSTIN: { type: 'string' },
      boolTerms: { type: 'boolean' },
      strTerms: { type: 'string' },
      boolTaxDetails: { type: 'boolean' },
      boolPaymentMode: { type: 'boolean' },
      boolCutPaperSize: { type: 'boolean' },
      rbgPageSize: { type: 'string' },
      strPageSize: { type: 'string' },
      boolBankDetail: { type: 'boolean' },
      bankName: { type: 'string' },
      bankIfscCode: { type: 'string' },
      bankAccountNumber: { type: 'string' },
      boolBankDetailsOnCreditSaleOnly: { type: 'boolean' },
      boolSignature: { type: 'boolean' },
      strSignature: { type: 'string' },
      boolQrCode: { type: 'boolean' },
      strqrcode: { type: 'string' },
      qrCodeValueOptn: { type: 'string' },
      paymentbankNumber: { type: 'string' },
      paymentifsc: { type: 'string' },
      paymentUpi: { type: 'string' },
      boolCustomization: { type: 'boolean' },
      customWidth: { type: 'string' },
      customMargin: { type: 'string' },
      boolPageSize: { type: 'boolean' },
      pageSizeWidth: { type: 'string' },
      pageSizeHeight: { type: 'string' },
      boolWebsite: { type: 'boolean' },
      strWebsite: { type: 'string' },
      bankAccountHolderName: { type: 'string' },
      boolPAN: { type: 'boolean' },
      strPAN: { type: 'string' },
      boolPreviousBalance: { type: 'boolean' },
      paymentPayeeName: { type: 'string' },
      showCustomPrintPopUp: { type: 'boolean' },
      printOriginal: { type: 'boolean' },
      printOriginalCopies: { type: 'number' },
      printDuplicate: { type: 'boolean' },
      printDuplicateCopies: { type: 'number' },
      printTriplicate: { type: 'boolean' },
      printTriplicateCopies: { type: 'number' },
      printCustom: { type: 'boolean' },
      printCustomName: { type: 'string' },
      printCustomCopies: { type: 'number' }
    },
    updatedAt: {
      type: 'number'
    },
    posId: {
      type: 'number'
    }
  },
  indexes: ['updatedAt'],
  required: ['businessId', 'businessCity', 'posId']
};

export const pullQueryBuilder = async (doc) => {
  const businessData = await Bd.getBusinessData();
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
    if (doc && doc.businessId !== businessData.businessId) {
      let lastRecord = await schemaSync.getLastSyncedRecordForBusiness(
        'printersettings',
        businessData.businessId
      );
      doc = lastRecord || null;
    }
    try {
      return await pullQueryBuilderInBackground(doc, localStoragePosId, businessData);
    } catch (error) {
      console.error('Error executing pullQueryBuilderInBackground:', error);
    }
  }
  return null;
};

export const pushQueryBuilder = async (doc) => {
  if (window.navigator.onLine) {
    const localStoragePosId = localStorage.getItem('posId') || 1;;
     try {
      return await pushQueryBuilderInBackground(doc, localStoragePosId);
    } catch (error) {
      console.error('Error executing pushQueryBuilderInBackground:', error);
    }
  }
  return null;
};

const pullQueryBuilderInBackground = greenlet(async (doc, localStoragePosId, businessData) => {
  if (!doc) {
    doc = {
      categoryId: '0',
      updatedAt: 0,
      posId: businessData.posDeviceId,
      businessId: businessData.businessId,
      businessCity: businessData.businessCity
    };
  }

  if (!doc.posId) {
    doc.posId = localStoragePosId;
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const BATCH_SIZE = 30;

  const query = `{
    printerSettings(lastId: "${doc.categoryId}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: ${BATCH_SIZE},   businessId: "${doc.businessId}", businessCity: "${doc.businessCity}", userId: "${doc.userId}") {
      userId
      businessId
      businessCity
      invoiceRegular {
        userId
        boolDefault
        boolCompanyName
        strCompanyName
        boolCompanyLogo
        fileCompanyLogo
        boolAddress
        strAddress
        boolEmail
        strEmail
        boolPhone
        strPhone
        boolGSTIN
        strGSTIN
        boolSignature
        strSignature
        fileSignature
        boolDesc
        strDesc
        boolTerms
        strTerms
        boolTaxDetails
        boolPaymentMode
        boolAcknowledgement
        ddlPageSize
        headerSpace
        headerSize
        headerUnit
        footerSpace
        footerSize
        footerUnit
        boolBankDetail
        bankName
        bankIfscCode
        bankAccountNumber
        boolBankDetailsOnCreditSaleOnly
        boolQrCode
        strqrcode
        qrCodeValueOptn
        paymentbankNumber
        paymentifsc
        paymentUpi
        theme
        textSize
        logoSize
        signatureSize
        boolWebsite
        strWebsite
        bankAccountHolderName
        boolPAN
        strPAN
        boolPreviousBalance
        paymentPayeeName
        showCustomPrintPopUp
        printOriginal
        printOriginalCopies
        printDuplicate
        printDuplicateCopies
        printTriplicate
        printTriplicateCopies
        printCustom
        printCustomName
        printCustomCopies
        companyNameColor
        boolBisHallmark
        schemeBoolTerms
        schemeStrTerms
        boolCompanyAdditionalDesc
        companyAdditionalDesc
        boolJurisdiction
        jurisdiction
      },
      invoiceThermal {
        userId
        boolDefault
        boolCompanyName
        strCompanyName
        boolCompanyLogo
        fileCompanyLogo
        boolAddress
        strAddress
        boolEmail
        strEmail
        boolPhone
        strPhone
        boolGSTIN
        strGSTIN
        boolTerms
        strTerms
        boolTaxDetails
        boolPaymentMode
        boolCutPaperSize
        rbgPageSize
        strPageSize
        boolBankDetail
        bankName
        bankIfscCode
        bankAccountNumber
        boolBankDetailsOnCreditSaleOnly
        boolSignature
        strSignature
        boolQrCode
        strqrcode
        qrCodeValueOptn
        paymentbankNumber
        paymentifsc
        paymentUpi
        boolCustomization
        customWidth
        customMargin
        boolPageSize
        pageSizeWidth
        pageSizeHeight
        boolWebsite
        strWebsite
        bankAccountHolderName
        boolPAN
        strPAN
        boolPreviousBalance
        paymentPayeeName
        showCustomPrintPopUp
        printOriginal
        printOriginalCopies
        printDuplicate
        printDuplicateCopies
        printTriplicate
        printTriplicateCopies
        printCustom
        printCustomName
        printCustomCopies
      }
      updatedAt
      deleted
    }
}`;

  return {
    query,
    variables: {}
  };
});

const pushQueryBuilderInBackground = greenlet(async (doc, localStoragePosId) => {
  if (!doc.posId) {
    doc.posId = localStoragePosId;
  }

  const currentUpdatedAt = Date.now();
  if (!(doc.updatedAt <= currentUpdatedAt)) {
    doc.updatedAt = currentUpdatedAt;
  }

  const query = `
    mutation setPrinterSettings($input: PrinterSettingsInput) {
      setPrinterSettings(printerSettings: $input) {
        userId
        updatedAt
      }
    }
  `;
  const variables = {
    input: doc
  };

  return {
    query,
    variables
  };
});

export const printerSettingsSyncQueryBuilder = (
  db,
  syncURL,
  batchSize,
  posId,
  token
) => {
  return db.printersettings.syncGraphQL({
    url: syncURL,
    // headers: {
    //   /* optional, set an auth header */
    //   Authorization: 'Bearer ' + token
    // },
    push: {
      batchSize,
      queryBuilder: pushQueryBuilder,
      /**
       *  Modifies all pushed documents before they are send to the GraphQL endpoint.
       * Returning null will skip the document.
       */
      modifier: async (doc) => {
        return await schemaSync.validatePrinterSettingsDocumentBeforeSync(doc);
      }
    },
    pull: {
      queryBuilder: pullQueryBuilder
    },
    live: true,
    /**
     * Because the websocket is used to inform the client
     * when something has changed,
     * we can set the liveInterval to a high value
     */
    liveInterval: 1000 * 60 * 10, 
    autoStart: true,
    retryTime: 1000 * 60 * 5,
    deletedFlag: 'deleted'
  });
};
