import { action, observable, makeObservable, toJS, runInAction } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

class PrinterSettingsStore {
  invoiceRegular = {
    userId: localStorage.getItem('mobileNumber'),
    boolDefault: false,
    boolCompanyName: false,
    strCompanyName: '',
    boolCompanyLogo: false,
    fileCompanyLogo: '',
    boolAddress: false,
    strAddress: '',
    boolEmail: false,
    strEmail: '',
    boolPhone: false,
    strPhone: '',
    boolGSTIN: false,
    strGSTIN: '',
    boolSignature: false,
    strSignature: '',
    fileSignature: '',
    boolDesc: false,
    strDesc: '',
    boolTerms: false,
    strTerms: '',
    boolTaxDetails: false,
    boolPaymentMode: false,
    boolAcknowledgement: false,
    ddlPageSize: 'A4',
    headerSpace: false,
    headerSize: 0,
    headerUnit: '',
    footerSpace: false,
    footerSize: 0,
    footerUnit: '',
    boolBankDetail: false,
    bankName: '',
    bankIfscCode: '',
    bankAccountNumber: '',
    boolBankDetailsOnCreditSaleOnly: false,
    boolQrCode: false,
    strqrcode: '',
    qrCodeValueOptn: 'upi',
    paymentbankNumber: '',
    paymentifsc: '',
    paymentUpi: '',
    theme: 'Theme 1',
    textSize: 'Medium',
    logoSize: 'Medium',
    signatureSize: 'Medium',
    boolWebsite: false,
    strWebsite: '',
    bankAccountHolderName: '',
    boolPAN: false,
    strPAN: '',
    boolPreviousBalance: false,
    paymentPayeeName: '',
    showCustomPrintPopUp: false,
    printOriginal: false,
    printOriginalCopies: 0,
    printDuplicate: false,
    printDuplicateCopies: 0,
    printTriplicate: false,
    printTriplicateCopies: 0,
    printCustom: false,
    printCustomName: '',
    printCustomCopies: 0,
    companyNameColor: '#000000',
    boolBisHallmark: false,
    schemeBoolTerms: false,
    schemeStrTerms: '',
    boolCompanyAdditionalDesc: false,
    companyAdditionalDesc: '',
    boolJurisdiction: false,
    jurisdiction: ''
  };

  invoiceThermal = {
    userId: localStorage.getItem('mobileNumber'),
    boolDefault: false,
    boolCompanyName: false,
    strCompanyName: '',
    boolCompanyLogo: false,
    fileCompanyLogo: '',
    boolAddress: false,
    strAddress: '',
    boolEmail: false,
    strEmail: '',
    boolPhone: false,
    strPhone: '',
    boolGSTIN: false,
    strGSTIN: '',
    boolTerms: false,
    strTerms: '',
    boolTaxDetails: false,
    boolPaymentMode: false,
    boolCutPaperSize: false,
    rbgPageSize: '2',
    strPageSize: '',
    boolBankDetail: false,
    bankName: ' ',
    bankIfscCode: '',
    bankAccountNumber: '',
    boolBankDetailsOnCreditSaleOnly: false,
    boolSignature: false,
    strSignature: '',
    boolQrCode: false,
    strqrcode: '',
    qrCodeValueOptn: 'upi',
    paymentbankNumber: '',
    paymentifsc: '',
    paymentUpi: '',
    boolCustomization: false,
    customWidth: '',
    customMargin: '',
    boolPageSize: false,
    pageSizeWidth: '',
    pageSizeHeight: '',
    boolWebsite: false,
    strWebsite: '',
    bankAccountHolderName: '',
    boolPAN: false,
    strPAN: '',
    boolPreviousBalance: false,
    paymentPayeeName: '',
    showCustomPrintPopUp: false,
    printOriginal: false,
    printOriginalCopies: 0,
    printDuplicate: false,
    printDuplicateCopies: 0,
    printTriplicate: false,
    printTriplicateCopies: 0,
    printCustom: false,
    printCustomName: '',
    printCustomCopies: 0
  };

  defaultInvoiceRegular = {
    userId: localStorage.getItem('mobileNumber'),
    boolDefault: false,
    boolCompanyName: false,
    strCompanyName: '',
    boolCompanyLogo: false,
    fileCompanyLogo: '',
    boolAddress: false,
    strAddress: '',
    boolEmail: false,
    strEmail: '',
    boolPhone: false,
    strPhone: '',
    boolGSTIN: false,
    strGSTIN: '',
    boolSignature: false,
    strSignature: '',
    fileSignature: '',
    boolDesc: false,
    strDesc: '',
    boolTerms: false,
    strTerms: '',
    boolTaxDetails: false,
    boolPaymentMode: false,
    boolAcknowledgement: false,
    ddlPageSize: 'A4',
    headerSpace: false,
    headerSize: 0,
    headerUnit: '',
    footerSpace: false,
    footerSize: 0,
    footerUnit: '',
    boolBankDetail: false,
    bankName: '',
    bankIfscCode: '',
    bankAccountNumber: '',
    boolBankDetailsOnCreditSaleOnly: false,
    boolQrCode: false,
    strqrcode: '',
    qrCodeValueOptn: 'upi',
    paymentbankNumber: '',
    paymentifsc: '',
    paymentUpi: '',
    theme: 'Theme 1',
    textSize: 'Medium',
    logoSize: 'Medium',
    signatureSize: 'Medium',
    boolWebsite: false,
    strWebsite: '',
    bankAccountHolderName: '',
    boolPAN: false,
    strPAN: '',
    boolPreviousBalance: false,
    paymentPayeeName: '',
    companyNameColor: '#000000',
    boolBisHallmark: false,
    schemeBoolTerms: false,
    schemeStrTerms: '',
    boolCompanyAdditionalDesc: false,
    companyAdditionalDesc: '',
    boolJurisdiction: false,
    jurisdiction: ''
  };

  defaultInvoiceThermal = {
    userId: localStorage.getItem('mobileNumber'),
    boolDefault: false,
    boolCompanyName: false,
    strCompanyName: '',
    boolCompanyLogo: false,
    fileCompanyLogo: '',
    boolAddress: false,
    strAddress: '',
    boolEmail: false,
    strEmail: '',
    boolPhone: false,
    strPhone: '',
    boolGSTIN: false,
    strGSTIN: '',
    boolTerms: false,
    strTerms: '',
    boolTaxDetails: false,
    boolPaymentMode: false,
    boolCutPaperSize: false,
    rbgPageSize: '2',
    strPageSize: '',
    boolBankDetail: false,
    bankName: ' ',
    bankIfscCode: '',
    bankAccountNumber: '',
    boolBankDetailsOnCreditSaleOnly: false,
    boolSignature: false,
    strSignature: '',
    boolQrCode: false,
    strqrcode: '',
    qrCodeValueOptn: 'upi',
    paymentbankNumber: '',
    paymentifsc: '',
    paymentUpi: '',
    boolCustomization: false,
    customWidth: '',
    customMargin: '',
    boolPageSize: false,
    pageSizeWidth: '',
    pageSizeHeight: '',
    boolWebsite: false,
    strWebsite: '',
    bankAccountHolderName: '',
    boolPAN: false,
    strPAN: '',
    boolPreviousBalance: false,
    paymentPayeeName: ''
  };

  openLoader = false;

  openCustomPrintPopUp = false;
  openCustomPreviewPrintPopUp = false;

  updateRegularSettingsField = (page, field, value) => {
    if (page === 'invoiceRegular') {
      runInAction(() => {
        this.invoiceRegular[field] = value;
      });

      console.log(toJS(this.invoiceRegular));
      if (this.invoiceRegular.boolDefault && this.invoiceThermal.boolDefault) {
        runInAction(() => {
          this.invoiceThermal.boolDefault = false;
        });
      }
    } else if (page === 'invoiceThermal') {
      runInAction(() => {
        this.invoiceThermal[field] = value;
        if (
          this.invoiceThermal.boolDefault &&
          this.invoiceRegular.boolDefault
        ) {
          this.invoiceRegular.boolDefault = false;
        }
      });
    }
  };

  getInvoiceSettings = async (businessId) => {
    const db = await Db.get();

    await db.printersettings
      .findOne({
        selector: {
          $and: [
            {
              businessId: { $eq: businessId }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        try {
          function isArray(arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
          }
          if (data) {
            const _dataRegular = {
              userId: localStorage.getItem('mobileNumber'),
              boolDefault: data.invoiceRegular.boolDefault,
              boolCompanyName: data.invoiceRegular.boolCompanyName,
              strCompanyName: data.invoiceRegular.strCompanyName,
              boolCompanyLogo: data.invoiceRegular.boolCompanyLogo,
              fileCompanyLogo: data.invoiceRegular.fileCompanyLogo,
              boolAddress: data.invoiceRegular.boolAddress,
              strAddress: data.invoiceRegular.strAddress,
              boolEmail: data.invoiceRegular.boolEmail,
              strEmail: data.invoiceRegular.strEmail,
              boolPhone: data.invoiceRegular.boolPhone,
              strPhone: data.invoiceRegular.strPhone,
              boolGSTIN: data.invoiceRegular.boolGSTIN,
              strGSTIN: data.invoiceRegular.strGSTIN,
              boolSignature: data.invoiceRegular.boolSignature,
              strSignature: data.invoiceRegular.strSignature,
              fileSignature: data.invoiceRegular.fileSignature,
              boolDesc: data.invoiceRegular.boolDesc,
              strDesc: data.invoiceRegular.strDesc,
              boolTerms: data.invoiceRegular.boolTerms,
              strTerms: data.invoiceRegular.strTerms,
              boolTaxDetails: data.invoiceRegular.boolTaxDetails,
              boolPaymentMode: data.invoiceRegular.boolPaymentMode,
              boolAcknowledgement: data.invoiceRegular.boolAcknowledgement,
              ddlPageSize: data.invoiceRegular.ddlPageSize,
              headerSpace: data.invoiceRegular.headerSpace,
              headerSize: data.invoiceRegular.headerSize,
              headerUnit: data.invoiceRegular.headerUnit,
              footerSpace: data.invoiceRegular.footerSpace,
              footerSize: data.invoiceRegular.footerSize,
              footerUnit: data.invoiceRegular.footerUnit,
              boolBankDetail: data.invoiceRegular.boolBankDetail,
              bankName: data.invoiceRegular.bankName,
              bankIfscCode: data.invoiceRegular.bankIfscCode,
              bankAccountNumber: data.invoiceRegular.bankAccountNumber,
              boolBankDetailsOnCreditSaleOnly:
                data.invoiceRegular.boolBankDetailsOnCreditSaleOnly,
              boolQrCode: data.invoiceRegular.boolQrCode,
              strqrcode: data.invoiceRegular.strqrcode,
              qrCodeValueOptn: data.invoiceRegular.qrCodeValueOptn,
              paymentbankNumber: data.invoiceRegular.paymentbankNumber,
              paymentifsc: data.invoiceRegular.paymentifsc,
              paymentUpi: data.invoiceRegular.paymentUpi,
              theme: data.invoiceRegular.theme,
              textSize: data.invoiceRegular.textSize,
              logoSize: data.invoiceRegular.logoSize,
              signatureSize: data.invoiceRegular.signatureSize,
              boolWebsite: data.invoiceRegular.boolWebsite,
              strWebsite: data.invoiceRegular.strWebsite,
              bankAccountHolderName: data.invoiceRegular.bankAccountHolderName,
              boolPAN: data.invoiceRegular.boolPAN,
              strPAN: data.invoiceRegular.strPAN,
              boolPreviousBalance: data.invoiceRegular.boolPreviousBalance,
              paymentPayeeName: data.invoiceRegular.paymentPayeeName,
              showCustomPrintPopUp: data.invoiceRegular.showCustomPrintPopUp,
              printOriginal: data.invoiceRegular.printOriginal,
              printOriginalCopies: data.invoiceRegular.printOriginalCopies,
              printDuplicate: data.invoiceRegular.printDuplicate,
              printDuplicateCopies: data.invoiceRegular.printDuplicateCopies,
              printTriplicate: data.invoiceRegular.printTriplicate,
              printTriplicateCopies: data.invoiceRegular.printTriplicateCopies,
              printCustom: data.invoiceRegular.printCustom,
              printCustomName: data.invoiceRegular.printCustomName,
              printCustomCopies: data.invoiceRegular.printCustomCopies,
              companyNameColor: data.invoiceRegular.companyNameColor,
              boolBisHallmark: data.invoiceRegular.boolBisHallmark,
              schemeBoolTerms: data.invoiceRegular.schemeBoolTerms,
              schemeStrTerms: data.invoiceRegular.schemeStrTerms,
              boolCompanyAdditionalDesc: data.invoiceRegular.boolCompanyAdditionalDesc,
              companyAdditionalDesc: data.invoiceRegular.companyAdditionalDesc,
              boolJurisdiction: data.invoiceRegular.boolJurisdiction,
              jurisdiction: data.invoiceRegular.jurisdiction
            };
            runInAction(() => {
              this.invoiceRegular = _dataRegular;
            });

            const _dataThermal = {
              userId: localStorage.getItem('mobileNumber'),
              boolDefault: data.invoiceThermal.boolDefault,
              boolCompanyName: data.invoiceThermal.boolCompanyName,
              strCompanyName: data.invoiceThermal.strCompanyName,
              boolCompanyLogo: data.invoiceThermal.boolCompanyLogo,
              fileCompanyLogo: data.invoiceThermal.fileCompanyLogo,
              boolAddress: data.invoiceThermal.boolAddress,
              strAddress: data.invoiceThermal.strAddress,
              boolEmail: data.invoiceThermal.boolEmail,
              strEmail: data.invoiceThermal.strEmail,
              boolPhone: data.invoiceThermal.boolPhone,
              strPhone: data.invoiceThermal.strPhone,
              boolGSTIN: data.invoiceThermal.boolGSTIN,
              strGSTIN: data.invoiceThermal.strGSTIN,
              boolTerms: data.invoiceThermal.boolTerms,
              strTerms: data.invoiceThermal.strTerms,
              boolSignature: data.invoiceThermal.boolSignature,
              strSignature: data.invoiceThermal.strSignature,
              boolTaxDetails: data.invoiceThermal.boolTaxDetails,
              boolPaymentMode: data.invoiceThermal.boolPaymentMode,
              boolCutPaperSize: data.invoiceThermal.boolCutPaperSize,
              rbgPageSize: data.invoiceThermal.rbgPageSize,
              strPageSize: data.invoiceThermal.strPageSize,
              boolBankDetail: data.invoiceThermal.boolBankDetail,
              bankName: data.invoiceThermal.bankName,
              bankIfscCode: data.invoiceThermal.bankIfscCode,
              bankAccountNumber: data.invoiceThermal.bankAccountNumber,
              boolBankDetailsOnCreditSaleOnly:
                data.invoiceThermal.boolBankDetailsOnCreditSaleOnly,
              boolQrCode: data.invoiceThermal.boolQrCode,
              strqrcode: data.invoiceThermal.strqrcode,
              qrCodeValueOptn: data.invoiceThermal.qrCodeValueOptn,
              paymentbankNumber: data.invoiceThermal.paymentbankNumber,
              paymentifsc: data.invoiceThermal.paymentifsc,
              paymentUpi: data.invoiceThermal.paymentUpi,
              boolCustomization: data.invoiceThermal.boolCustomization,
              customWidth: data.invoiceThermal.customWidth,
              customMargin: data.invoiceThermal.customMargin,
              boolPageSize: data.invoiceThermal.boolPageSize,
              pageSizeWidth: data.invoiceThermal.pageSizeWidth,
              pageSizeHeight: data.invoiceThermal.pageSizeHeight,
              boolWebsite: data.invoiceThermal.boolWebsite,
              strWebsite: data.invoiceThermal.strWebsite,
              bankAccountHolderName: data.invoiceThermal.bankAccountHolderName,
              boolPAN: data.invoiceThermal.boolPAN,
              strPAN: data.invoiceThermal.strPAN,
              boolPreviousBalance: data.invoiceThermal.boolPreviousBalance,
              paymentPayeeName: data.invoiceThermal.paymentPayeeName,
              showCustomPrintPopUp: data.invoiceThermal.showCustomPrintPopUp,
              printOriginal: data.invoiceThermal.printOriginal,
              printOriginalCopies: data.invoiceThermal.printOriginalCopies,
              printDuplicate: data.invoiceThermal.printDuplicate,
              printDuplicateCopies: data.invoiceThermal.printDuplicateCopies,
              printTriplicate: data.invoiceThermal.printTriplicate,
              printTriplicateCopies: data.invoiceThermal.printTriplicateCopies,
              printCustom: data.invoiceThermal.printCustom,
              printCustomName: data.invoiceThermal.printCustomName,
              printCustomCopies: data.invoiceThermal.printCustomCopies
            };
            runInAction(() => {
              this.invoiceThermal = _dataThermal;
            });
          } else {
            runInAction(() => {
              this.invoiceRegular = this.defaultInvoiceRegular;
              this.invoiceThermal = this.defaultInvoiceThermal;
            });
          }
        } catch (err) {}
      })
      .catch(() => {
        // console.log('settings data fetching Failed');
      });
  };

  getRegularInvoiceSettings = async (businessId) => {
    const db = await Db.get();

    await db.printersettings
      .findOne({
        selector: {
          $and: [
            {
              businessId: { $eq: businessId }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        try {
          function isArray(arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
          }
          if (data) {
            const _dataRegular = {
              userId: localStorage.getItem('mobileNumber'),
              boolDefault: data.invoiceRegular.boolDefault,
              boolCompanyName: data.invoiceRegular.boolCompanyName,
              strCompanyName: data.invoiceRegular.strCompanyName,
              boolCompanyLogo: data.invoiceRegular.boolCompanyLogo,
              fileCompanyLogo: data.invoiceRegular.fileCompanyLogo,
              boolAddress: data.invoiceRegular.boolAddress,
              strAddress: data.invoiceRegular.strAddress,
              boolEmail: data.invoiceRegular.boolEmail,
              strEmail: data.invoiceRegular.strEmail,
              boolPhone: data.invoiceRegular.boolPhone,
              strPhone: data.invoiceRegular.strPhone,
              boolGSTIN: data.invoiceRegular.boolGSTIN,
              strGSTIN: data.invoiceRegular.strGSTIN,
              boolSignature: data.invoiceRegular.boolSignature,
              strSignature: data.invoiceRegular.strSignature,
              fileSignature: data.invoiceRegular.fileSignature,
              boolDesc: data.invoiceRegular.boolDesc,
              strDesc: data.invoiceRegular.strDesc,
              boolTerms: data.invoiceRegular.boolTerms,
              strTerms: data.invoiceRegular.strTerms,
              boolTaxDetails: data.invoiceRegular.boolTaxDetails,
              boolPaymentMode: data.invoiceRegular.boolPaymentMode,
              boolAcknowledgement: data.invoiceRegular.boolAcknowledgement,
              ddlPageSize: data.invoiceRegular.ddlPageSize,
              boolBankDetail: data.invoiceRegular.boolBankDetail,
              bankName: data.invoiceRegular.bankName,
              bankIfscCode: data.invoiceRegular.bankIfscCode,
              bankAccountNumber: data.invoiceRegular.bankAccountNumber,
              boolBankDetailsOnCreditSaleOnly:
                data.invoiceRegular.boolBankDetailsOnCreditSaleOnly,
              boolQrCode: data.invoiceRegular.boolQrCode,
              strqrcode: data.invoiceRegular.strqrcode,
              qrCodeValueOptn: data.invoiceRegular.qrCodeValueOptn,
              paymentbankNumber: data.invoiceRegular.paymentbankNumber,
              paymentifsc: data.invoiceRegular.paymentifsc,
              paymentUpi: data.invoiceRegular.paymentUpi,
              theme: data.invoiceRegular.theme,
              textSize: data.invoiceRegular.textSize,
              logoSize: data.invoiceRegular.logoSize,
              signatureSize: data.invoiceRegular.signatureSize,
              boolWebsite: data.invoiceRegular.boolWebsite,
              strWebsite: data.invoiceRegular.strWebsite,
              bankAccountHolderName: data.invoiceRegular.bankAccountHolderName,
              boolPAN: data.invoiceRegular.boolPAN,
              strPAN: data.invoiceRegular.strPAN,
              boolPreviousBalance: data.invoiceRegular.boolPreviousBalance,
              paymentPayeeName: data.invoiceRegular.paymentPayeeName,
              showCustomPrintPopUp: data.invoiceRegular.showCustomPrintPopUp,
              printOriginal: data.invoiceRegular.printOriginal,
              printOriginalCopies: data.invoiceRegular.printOriginalCopies,
              printDuplicate: data.invoiceRegular.printDuplicate,
              printDuplicateCopies: data.invoiceRegular.printDuplicateCopies,
              printTriplicate: data.invoiceRegular.printTriplicate,
              printTriplicateCopies: data.invoiceRegular.printTriplicateCopies,
              printCustom: data.invoiceRegular.printCustom,
              printCustomName: data.invoiceRegular.printCustomName,
              printCustomCopies: data.invoiceRegular.printCustomCopies,
              companyNameColor: data.invoiceRegular.companyNameColor,
              boolBisHallmark: data.invoiceRegular.boolBisHallmark,
              schemeBoolTerms: data.invoiceRegular.schemeBoolTerms,
              schemeStrTerms: data.invoiceRegular.schemeStrTerms,
              boolCompanyAdditionalDesc: data.invoiceRegular.boolCompanyAdditionalDesc,
              companyAdditionalDesc: data.invoiceRegular.companyAdditionalDesc,
              boolJurisdiction: data.invoiceRegular.boolJurisdiction,
              jurisdiction: data.invoiceRegular.jurisdiction
            };
            runInAction(() => {
              this.invoiceRegular = _dataRegular;
            });
          }
        } catch (err) {}
      })
      .catch(() => {
        // console.log('settings data fetching Failed');
      });
    return this.invoiceRegular;
  };

  getThermalInvoiceSettings = async (businessId) => {
    const db = await Db.get();
    let _dataThermal = {};
    await db.printersettings
      .findOne({
        selector: {
          $and: [
            {
              businessId: { $eq: businessId }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        try {
          function isArray(arr) {
            return Object.prototype.toString.call(arr) === '[object Array]';
          }
          if (data) {
            _dataThermal = {
              userId: localStorage.getItem('mobileNumber'),
              boolDefault: data.invoiceThermal.boolDefault,
              boolCompanyName: data.invoiceThermal.boolCompanyName,
              strCompanyName: data.invoiceThermal.strCompanyName,
              boolCompanyLogo: data.invoiceThermal.boolCompanyLogo,
              fileCompanyLogo: data.invoiceThermal.fileCompanyLogo,
              boolAddress: data.invoiceThermal.boolAddress,
              strAddress: data.invoiceThermal.strAddress,
              boolEmail: data.invoiceThermal.boolEmail,
              strEmail: data.invoiceThermal.strEmail,
              boolPhone: data.invoiceThermal.boolPhone,
              strPhone: data.invoiceThermal.strPhone,
              boolGSTIN: data.invoiceThermal.boolGSTIN,
              strGSTIN: data.invoiceThermal.strGSTIN,
              boolTerms: data.invoiceThermal.boolTerms,
              strTerms: data.invoiceThermal.strTerms,
              boolSignature: data.invoiceThermal.boolSignature,
              strSignature: data.invoiceThermal.strSignature,
              boolTaxDetails: data.invoiceThermal.boolTaxDetails,
              boolPaymentMode: data.invoiceThermal.boolPaymentMode,
              boolCutPaperSize: data.invoiceThermal.boolCutPaperSize,
              rbgPageSize: data.invoiceThermal.rbgPageSize,
              strPageSize: data.invoiceThermal.strPageSize,
              boolBankDetail: data.invoiceThermal.boolBankDetail,
              bankName: data.invoiceThermal.bankName,
              bankIfscCode: data.invoiceThermal.bankIfscCode,
              bankAccountNumber: data.invoiceThermal.bankAccountNumber,
              boolBankDetailsOnCreditSaleOnly:
                data.invoiceThermal.boolBankDetailsOnCreditSaleOnly,
              boolQrCode: data.invoiceThermal.boolQrCode,
              strqrcode: data.invoiceThermal.strqrcode,
              qrCodeValueOptn: data.invoiceThermal.qrCodeValueOptn,
              paymentbankNumber: data.invoiceThermal.paymentbankNumber,
              paymentifsc: data.invoiceThermal.paymentifsc,
              paymentUpi: data.invoiceThermal.paymentUpi,
              boolCustomization: data.invoiceThermal.boolCustomization,
              customWidth: data.invoiceThermal.customWidth,
              customMargin: data.invoiceThermal.customMargin,
              boolPageSize: data.invoiceThermal.boolPageSize,
              pageSizeWidth: data.invoiceThermal.pageSizeWidth,
              pageSizeHeight: data.invoiceThermal.pageSizeHeight,
              boolWebsite: data.invoiceThermal.boolWebsite,
              strWebsite: data.invoiceThermal.strWebsite,
              bankAccountHolderName: data.invoiceThermal.bankAccountHolderName,
              boolPAN: data.invoiceThermal.boolPAN,
              strPAN: data.invoiceThermal.strPAN,
              boolPreviousBalance: data.invoiceThermal.boolPreviousBalance,
              paymentPayeeName: data.invoiceThermal.paymentPayeeName,
              showCustomPrintPopUp: data.invoiceThermal.showCustomPrintPopUp,
              printOriginal: data.invoiceThermal.printOriginal,
              printOriginalCopies: data.invoiceThermal.printOriginalCopies,
              printDuplicate: data.invoiceThermal.printDuplicate,
              printDuplicateCopies: data.invoiceThermal.printDuplicateCopies,
              printTriplicate: data.invoiceThermal.printTriplicate,
              printTriplicateCopies: data.invoiceThermal.printTriplicateCopies,
              printCustom: data.invoiceThermal.printCustom,
              printCustomName: data.invoiceThermal.printCustomName,
              printCustomCopies: data.invoiceThermal.printCustomCopies
            };
            runInAction(() => {
              this.invoiceThermal = _dataThermal;
            });
          }
        } catch (err) {}
      })
      .catch(() => {
        // console.log('settings data fetching Failed');
      });
    return _dataThermal;
  };

  setOpenLoader = (value) => {
    this.openLoader = value;
  };

  saveInvoiceRegularSettings = async () => {
    runInAction(() => {
      this.saveInvoiceSettings(localStorage.getItem('businessId'));
    });
  };

  saveInvoiceThermalSettings = async () => {
    runInAction(() => {
      this.saveInvoiceSettings(localStorage.getItem('businessId'));
    });
  };

  saveInvoiceSettings = async (businessId) => {
    const db = await Db.get();

    const query = db.printersettings.findOne({
      selector: { businessId: businessId }
    });

    this.invoiceRegular.userId = localStorage.getItem('mobileNumber');
    query
      .exec()
      .then(async (data) => {
        if (!data) {
          const db = await Db.get();
          const businessData = await Bd.getBusinessData();

          db.printersettings
            .insert({
              userId: localStorage.getItem('mobileNumber'),
              businessId: businessData.businessId,
              businessCity: businessData.businessCity,
              updatedAt: Date.now(),
              invoiceRegular: this.invoiceRegular,
              invoiceThermal: this.invoiceThermal
            })
            .then(() => {
              console.log('data Inserted');
              this.setOpenLoader(false);
            })
            .catch(() => {
              console.log('data insertion Failed');
            });
        } else {
          const businessData = await Bd.getBusinessData();

          await query
            .update({
              $set: {
                userId: localStorage.getItem('mobileNumber'),
                businessId: businessData.businessId,
                businessCity: businessData.businessCity,
                updatedAt: Date.now(),
                invoiceRegular: this.invoiceRegular,
                invoiceThermal: this.invoiceThermal
              }
            })
            .then(async () => {
              console.log('inside updte settings');
              this.setOpenLoader(false);
            });
        }
      })
      .catch((err) => {
        console.log('Internal Server error', err);
      });
  };

  handleCloseCustomPrintPopUp = () => {
    runInAction(() => {
      this.openCustomPrintPopUp = false;
    });
  };

  handleOpenCustomPrintPopUp = () => {
    runInAction(() => {
      this.openCustomPrintPopUp = true;
    });
  };

  handleCloseCustomPreviewPrintPopUp = () => {
    runInAction(() => {
      this.openCustomPreviewPrintPopUp = false;
    });
  };

  handleOpenCustomPreviewPrintPopUp = () => {
    runInAction(() => {
      this.openCustomPreviewPrintPopUp = true;
    });
  };

  // setting variables as observables so that it can be accesible
  // from other components and making methods as actions to invoke from other components
  constructor() {
    makeObservable(this, {
      invoiceRegular: observable,
      invoiceThermal: observable,
      updateRegularSettingsField: action,
      openLoader: observable,
      openCustomPrintPopUp: observable,
      openCustomPreviewPrintPopUp: observable
    });
  }
}

// this is to make this component public so that it is assible from other componets
export default new PrinterSettingsStore();