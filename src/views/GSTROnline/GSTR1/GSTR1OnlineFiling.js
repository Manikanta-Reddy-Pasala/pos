import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DialogContentText from '@material-ui/core/DialogContentText';
import Loader from 'react-js-loader';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import useWindowDimensions from 'src/components/windowDimension';
import BubbleLoader from 'src/components/loader';
import * as Bd from 'src/components/SelectedBusiness';
import NoPermission from '../../noPermission';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import GSTR1ReviewDataStep1 from './GSTR1ReviewDataStep1';
import {
  getSelectedDateMonthAndYearMMYYYY,
  getSelectedMonthAndYearMMYYYY,
  isCurrentOrFutureYearMonth
} from 'src/components/Helpers/DateHelper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import GSTR1ReturnSummaryPage from './GSTR1ReturnSummaryPage';
import GSTR1OnlinePortal from './GSTR1OnlinePortal';
import { toJS } from 'mobx';
import GSTError from '../GSTError';
import getStateList from 'src/components/StateList';
import {
  checkGstr1DataAvailableAPI,
  isGSTRFiled,
  validateSession
} from 'src/components/Helpers/GstrOnlineHelper';
import { getAllSalesByDateRangeSorted } from 'src/components/Helpers/dbQueries/sales';
import { getDataByTaxSplit } from 'src/components/Helpers/GSTHelper/SaleDataPreparationHelper';
import GstObject from 'src/components/Helpers/GSTHelper/GstObject';
import * as ExcelJS from 'exceljs';
import { getAllDeletedByDateRangeAndType } from 'src/components/Helpers/dbQueries/alltransactionsdeleted';
import { getAllSalesReturnByDateRange } from 'src/components/Helpers/dbQueries/salesreturn';
import { getSalesReturnDataByTaxSplit } from 'src/components/Helpers/GSTHelper/SaleReturnDataPreparationHelper';
import {
  prepareSalesHeaderRow,
  prepareSalesReturnHeaderRow,
  prepareErrorHeaderRow,
  prepareInvoiceCheckHeaderRow,
  prepareHSNHeaderRow,
  prepareDOCSummaryHeaderRow
} from './GSTRExcelHelper';
import { getPrefixStatsBasedonInvoice } from 'src/components/Helpers/GstrOnlineHelper';
import { getHSNWiseSalesData } from 'src/components/Helpers/GSTHelper/HsnDataPreparationHelper';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 2,
    borderRadius: '12px',
    height: '670px'
  },
  padding: {
    padding: theme.spacing(3)
  },
  demo1: {
    backgroundColor: theme.palette.background.paper
  },
  popover: {
    pointerEvents: 'none'
  },
  selectFont: {
    fontSize: '13px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: '12px'
  },
  contentRight: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  inputField: {
    '& .MuiOutlinedInput-input': {
      padding: '8px'
    },
    '& .MuiOutlinedInput-root': {
      position: 'relative',
      borderRadius: 18
    }
  },
  addExpenseBtn: {
    background: '#ffaf00',
    '&:hover': {
      backgroundColor: '#ffaf00'
    },
    color: 'white',
    borderRadius: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
    textTransform: 'none'
  },
  searchField: {
    marginRight: 20
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
    border: '1px solid grey',
    padding: '6px',
    background: 'white'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  iconAlign: {
    textAlign: 'end',
    padding: '14px'
  },
  footer: {
    borderTop: '1px solid #d8d8d8',
    padding: '20px'
  },
  amount: {
    textAlign: 'end',
    color: '#000000'
  },
  totalQty: {
    color: '#80D5B8',
    textAlign: 'center'
  },
  centerStartEnd: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  cash_hand: {
    marginTop: '20px',
    padding: '15px'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  csh: {
    marginTop: '30px',
    textAlign: 'center'
  },
  categoryActionWrapper: {
    // paddingRight: '10px',
    '& .category-actions-left, & .category-actions-right': {
      '& > *': {
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .category-actions-right > *': {
      marginLeft: theme.spacing(2)
    }
  },
  w_30: {
    width: '30%',
    display: 'inline-flex'
  },
  step1: {
    width: '65%',
    margin: 'auto',
    backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  step2: {
    width: '95%',
    margin: 'auto',
    backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  fGroup: {
    width: '50%',
    margin: 'auto'
  },
  CenterStartEnd: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'grey'
  },
  CenterStartEndWc: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  batchTable: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    width: '100%'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '8px'
  },
  headstyle: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: '#EF5350',
    color: 'white'
  },
  mb_20: {
    marginBottom: '20px'
  },
  mb_10: {
    marginBottom: '10px'
  },
  wAuto: {
    width: '80%',
    margin: 'auto',
    textAlign: 'center'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    height: '100%',
    borderRadius: 1,
    paddingTop: 10,
    overflowY: 'auto',
    overflowX: 'hidden',
    background: 'white'
  },
  sticky: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '99999',
    padding: '10px',
    backgroundColor: 'white'
  },
  filterBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    height: '30px',
    marginTop: '10px',
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    },
    fontSize: '12px'
  },
  filterSection: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    margin: 'auto',
    marginBottom: '20px'
  },
  filterSectionBtn: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '45%',
    margin: 'auto',
    marginBottom: '20px'
  },
  centerDiv: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '-20%'
  }
}));

const GSTR1OnlineFiling = (props) => {
  const classes = useStyles();
  const store = useStore();

  const { height } = useWindowDimensions();
  const [loader, setLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [isLoading, setLoadingShown] = useState(false);
  const [filter, setFilter] = useState(false);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const { getTaxSettingsDetails } = store.TaxSettingsStore;

  const { getAuditSettingsData } = store.AuditSettingsStore;
  const { auditSettings } = toJS(store.AuditSettingsStore);

  const {
    prepareGSTR1OnlineData,
    proceedToOnlineFilingScreen,
    setFinancialYear,
    setFinancialMonth,
    setGSTRPeriod,
    updateReviewStep,
    updateStep,
    setFiled,
    setIsSaved,
    handleErrorAlertOpen,
    updateGSTAuth,
    setLoginStep,
    setTaxData
  } = store.GSTR1Store;

  const {
    proceedToOnlineFiling,
    gstr1UploadData,
    GSTRDateRange,
    taxData,
    financialYear,
    financialMonth,
    months,
    reviewStep,
    isFiled,
    isSaved,
    openErrorMesssageDialog
  } = toJS(store.GSTR1Store);

  useEffect(() => {
    setFilter(false);
    prepareGSTR1OnlineData(false);
    proceedToOnlineFilingScreen(false);
    setIsSaved(false);
    fetchData();
  }, []);

  const fetchData = async () => {
    await getAuditSettingsData();
    let tData = await getTaxSettingsDetails();
    await setTaxData(tData);
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Tax Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  const errorMessageCall = (message) => {
    handleErrorAlertOpen(message);
  };

  const checkIsFiledasync = async () => {
    setLoadingShown(true);
    const businessData = await Bd.getBusinessData();
    await checkPermissionAvailable(businessData);
    let taxData = await getTaxSettingsDetails();
    let apiResponse = await isGSTRFiled(
      taxData.gstin,
      getSelectedMonthAndYearMMYYYY(financialYear, financialMonth)
    );

    if (apiResponse && apiResponse.status === 1) {
      const respData = apiResponse.message;
      if (respData?.EFiledlist && respData.EFiledlist.length > 0) {
        respData.EFiledlist.forEach((item, index) => {
          if (item.rtntype === 'GSTR1') {
            if (item.status === 'Filed') {
              prepareGSTR1OnlineData(false);
              setFiled(true);
              setFilter(true);
            } else {
              checkISaved(taxData);
            }
          }
        });
      } else {
        await checkISaved(taxData);
      }
    } else {
      await checkISaved(taxData);
      // errorMessageCall("Something Went Wrong. Please Try Again!");
    }

    setLoadingShown(false);
  };

  const checkISaved = async (taxData) => {
    let reqData = {};
    reqData = {
      gstin: taxData.gstin,
      fp: getSelectedMonthAndYearMMYYYY(financialYear, financialMonth)
    };
    const apiResponse = await checkGstr1DataAvailableAPI(reqData);
    if (apiResponse.code === 200) {
      setFilter(true);
      if (apiResponse.status === true) {
        setIsSaved(true);
        setFiled(false);
      } else {
        prepareGSTR1OnlineData(true);
        setFiled(false);
      }
    } else {
      errorMessageCall('Something Went Wrong. Please Try Again!');
    }
  };
  const proceedToFetchData = async () => {
    await setGSTRPeriod(financialYear, financialMonth);
    setFilter(true);
    await updateReviewStep(1);
    updateStep(1);
    prepareGSTR1OnlineData(true);
  };

  const checkSession = async (data) => {
    await setGSTRPeriod(financialYear, financialMonth);
    let taxData = await getTaxSettingsDetails();
    await validateSessionCall(taxData);
  };
  const viewSummary = async () => {
    await setGSTRPeriod(financialYear, financialMonth);
    setFiled(true);
    setFilter(true);
  };

  const validateSessionCall = async (dataG) => {
    setLoaderMsg('Please wait while validating session!!!');
    setLoader(true);
    const apiResponse = await validateSession(dataG.gstin);
    if (apiResponse.code === 200) {
      if (apiResponse && apiResponse.status === 1) {
        await updateGSTAuth(true);
        setLoader(false);
        await checkIsFiledasync();
      } else {
        await updateGSTAuth(false);
        setFilter(true);
        errorMessageCall(apiResponse.message);
        setLoader(false);
      }
    } else {
      await updateGSTAuth(false);
      setFilter(true);
      setLoginStep(2);
      errorMessageCall(apiResponse.message);
      setLoader(false);
    }
  };

  const proceedtoUpload = () => {
    if (isCurrentOrFutureYearMonth(financialYear, financialMonth)) {
      errorMessageCall('Invalid Financial Year / Month');
    } else {
      proceedToOnlineFilingScreen(true);
    }
  };

  const downloadJson = () => {
    const data = JSON.stringify(gstr1UploadData);
    const blob = new Blob([data], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    link.download =
      'GSTR-1_' +
      taxData.gstin +
      '_' +
      getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate) +
      '.json';
    link.click();

    URL.revokeObjectURL(link.href);
  };

  const getSaleDataByDatexlsx = async () => {
    const salesData = await getAllSalesByDateRangeSorted(
      GSTRDateRange.fromDate,
      GSTRDateRange.toDate
    );

    let response = await Promise.all(
      salesData.map(async (item) => {
        return await getDataByTaxSplit(item);
      })
    );

    return response;
  };

  const getSalesReturnDataByDatexlsx = async () => {
    const salesData = await getAllSalesReturnByDateRange(
      GSTRDateRange.fromDate,
      GSTRDateRange.toDate
    );

    let response = await Promise.all(
      salesData.map(async (item) => {
        return await getSalesReturnDataByTaxSplit(item);
      })
    );

    return response;
  };

  function formatDownloadExcelDate(dateAsString) {
    if (dateAsString !== '' && dateAsString !== null) {
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return '';
    }
  }

  function getGrossWeight(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.grossWeight || 0);
    }

    return result;
  }

  function getWastage(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.wastageGrams || 0);
    }

    return result;
  }

  function getNetWeight(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.netWeight || 0);
    }

    return result;
  }

  function getMakingCharge(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.makingChargeAmount || 0);
    }

    return result;
  }

  function getMakingChargePerGram(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.makingChargePerGramAmount || 0);
    }

    return result;
  }

  function getTotalDiscount(data) {
    let result = 0;

    for (let item of data.item_list) {
      result += parseFloat(item.discount_amount || 0);
    }

    return result;
  }

  const getExcelDataNew = async () => {
    const xlsxData = await getSaleDataByDatexlsx(
      GSTRDateRange.fromDate,
      GSTRDateRange.toDate
    );
    const salesReturnXlsxData = await getSalesReturnDataByDatexlsx(
      GSTRDateRange.fromDate,
      GSTRDateRange.toDate
    );
    const deletedData = await getAllDeletedByDateRangeAndType(
      GSTRDateRange.fromDate,
      GSTRDateRange.toDate,
      'Sales'
    );
    const deletedDataSalesReturn = await getAllDeletedByDateRangeAndType(
      GSTRDateRange.fromDate,
      GSTRDateRange.toDate,
      'Sales Return'
    );
    const auditSettingsExists =
      auditSettings &&
      auditSettings.taxApplicability &&
      auditSettings.taxApplicability.length > 0;

    let taxData = await getTaxSettingsDetails();
    let defaultState = getStateList().find((e) => e.name === taxData.state);

    let b2bGstTotal = new GstObject().getDefaultValues();
    let b2bCancelledGstTotal = new GstObject().getDefaultValues();
    let b2bAGstTotal = new GstObject().getDefaultValues();
    let b2bACancelledGstTotal = new GstObject().getDefaultValues();
    let b2bEInvoiceGstTotal = new GstObject().getDefaultValues();
    let b2bEInvoiceCancelledGstTotal = new GstObject().getDefaultValues();
    let b2cGstTotal = new GstObject().getDefaultValues();
    let b2cCancelledGstTotal = new GstObject().getDefaultValues();
    let b2clGstTotal = new GstObject().getDefaultValues();
    let b2clCancelledGstTotal = new GstObject().getDefaultValues();
    let deletedGstTotal = new GstObject().getDefaultValues();
    let deletedSalesReturnGstTotal = new GstObject().getDefaultValues();
    let salesGstTotal = new GstObject().getDefaultValues();
    let salesReturnGstTotal = new GstObject().getDefaultValues();
    let cdnrGstTotal = new GstObject().getDefaultValues();
    let cdnrCancelledGstTotal = new GstObject().getDefaultValues();
    let cdnurGstTotal = new GstObject().getDefaultValues();
    let cdnurCancelledGstTotal = new GstObject().getDefaultValues();

    let b2bData = [];
    let b2bCancelledData = [];
    let b2bAData = [];
    let b2bACancelledData = [];
    let b2bEInvoicesData = [];
    let b2bEInvoicesCancelledData = [];
    let b2cCancelledData = [];
    let b2cData = [];
    let b2clData = [];
    let b2clCancelledData = [];
    let errorData = [];
    let cdnrData = [];
    let cdnrCancelledData = [];
    let cdnurData = [];
    let cdnurCancelledData = [];

    let prefixMAp = await getPrefixStatsBasedonInvoice(xlsxData);
    let hsnSummaryData = await getHSNWiseSalesData(auditSettings, xlsxData);
    let salesReturnMAp = await getPrefixStatsBasedonInvoice(
      salesReturnXlsxData
    );

    if (xlsxData && xlsxData.length > 0) {
      let type = '';
      for (let i = 0; i < xlsxData.length; i++) {
        type = 'B2C';
        let isCGSTSGST = true;
        let businessState = '';
        if (taxData && taxData.gstin && taxData.gstin !== '') {
          let businessStateCode = taxData.gstin.slice(0, 2);
          if (xlsxData[i].customerGSTNo && xlsxData[i].customerGSTNo !== '') {
            let customerExtractedStateCode = xlsxData[i].customerGSTNo.slice(
              0,
              2
            );
            if (
              businessStateCode !== '' &&
              customerExtractedStateCode !== '' &&
              businessStateCode === customerExtractedStateCode
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          } else if (
            xlsxData[i].customerState &&
            xlsxData[i].customerState !== ''
          ) {
            let result = getStateList().find(
              (e) => e.code === businessStateCode
            );
            if (result) {
              businessState = result.name;
              if (
                xlsxData[i].customerState !== '' &&
                xlsxData[i].customerState !== null &&
                businessState !== '' &&
                businessState !== null &&
                xlsxData[i].customerState.toLowerCase() ===
                  businessState.toLowerCase()
              ) {
                isCGSTSGST = true;
              } else {
                isCGSTSGST = false;
              }
            }
          }
        }
        if (
          xlsxData[i].customerGSTNo === '' ||
          xlsxData[i].customerGSTNo === null ||
          xlsxData[i].customerGSTNo === undefined
        ) {
          if (
            (xlsxData[i].isCancelled && xlsxData[i].isCancelled === true) ||
            xlsxData[i].einvoiceBillStatus === 'Cancelled'
          ) {
            if (xlsxData[i].total_amount > 250000 && (xlsxData[i].customerState &&
              xlsxData[i].customerState !== '' &&  xlsxData[i].customerState !== businessState)) {
              b2clCancelledData.push(xlsxData[i]);
            } else {
              b2cCancelledData.push(xlsxData[i]);
            }
          } else {
            if (xlsxData[i].total_amount > 250000 && (xlsxData[i].customerState &&
              xlsxData[i].customerState !== '' &&  xlsxData[i].customerState !== businessState)) {
              type = 'B2CL';
              b2clData.push(xlsxData[i]);
            } else {
              b2cData.push(xlsxData[i]);
            }
          }
        } else {
          type = 'B2B';
          if (
            (xlsxData[i].isCancelled && xlsxData[i].isCancelled === true) ||
            xlsxData[i].einvoiceBillStatus === 'Cancelled'
          ) {
            if (xlsxData[i].einvoiceBillStatus === 'Cancelled') {
              b2bEInvoicesCancelledData.push(xlsxData[i]);
            } else {
              if (xlsxData[i].amended === true) {
                b2bACancelledData.push(xlsxData[i]);
              } else {
                b2bCancelledData.push(xlsxData[i]);
              }
            }
          } else {
            if (
              xlsxData[i].irnNo !== '' &&
              xlsxData[i].irnNo !== null &&
              xlsxData[i].irnNo !== undefined
            ) {
              b2bEInvoicesData.push(xlsxData[i]);
            } else {
              if (xlsxData[i].amended === true) {
                b2bAData.push(xlsxData[i]);
              } else {
                b2bData.push(xlsxData[i]);
              }
            }
          }
        }

        let prodMessage = '';
        for (let product of xlsxData[i].item_list) {
          if (
            product.cgst_amount === 0 &&
            product.sgst_amount === 0 &&
            product.igst_amount === 0 &&
            (product.discount_percent === 0 ||
              product.discount_percent == null ||
              product.discount_percent === undefined)
          ) {
            prodMessage += product.item_name + ' - Tax rate is not defined.\n';
          } else if (isCGSTSGST === true && product.igst_amount > 0) {
            prodMessage +=
              product.item_name +
              ' - IGST Tax rate is defined. It should be CGST-SGST \n';
          } else if (isCGSTSGST === false && product.cgst_amount > 0) {
            prodMessage +=
              product.item_name +
              ' - CGST-SGST Tax rate is defined. It should be IGST \n';
          }

          const taxUtilRes = await taxUtilityTxn.isTaxRateValid(
            parseFloat(product.cgst) +
              parseFloat(product.sgst) +
              parseFloat(product.igst),
            auditSettings
          );

          if (!taxUtilRes.isTaxRateValid) {
            prodMessage +=
              product.item_name + ' - Tax rate defined is invalid.\n';
          }

          if (product.hsn === '') {
            prodMessage += product.item_name + ' - HSN is not defined.\n';
          } else if (product.hsn !== '') {
            if (
              product.hsn.length === 4 ||
              product.hsn.length === 6 ||
              product.hsn.length === 8
            ) {
              // do nothing
            } else {
              prodMessage +=
                product.item_name +
                ' - HSN code' +
                ' (' +
                product.hsn +
                ')' +
                ' length is not valid.\n';
            }
          }
        }

        if (prodMessage !== '') {
          errorData.push({
            sequenceNumber: xlsxData[i].sequenceNumber,
            customerName: xlsxData[i].customer_name,
            type: type,
            errorMessage: prodMessage
          });
        }
      }
    }

    if (salesReturnXlsxData && salesReturnXlsxData.length > 0) {
      let type = '';
      for (let i = 0; i < salesReturnXlsxData.length; i++) {
        type = 'CDNUR';
        let isCGSTSGST = true;
        if (taxData && taxData.gstin && taxData.gstin !== '') {
          let businessStateCode = taxData.gstin.slice(0, 2);
          if (
            salesReturnXlsxData[i].customerGSTNo &&
            salesReturnXlsxData[i].customerGSTNo !== ''
          ) {
            let customerExtractedStateCode = salesReturnXlsxData[
              i
            ].customerGSTNo.slice(0, 2);
            if (
              businessStateCode !== '' &&
              customerExtractedStateCode !== '' &&
              businessStateCode === customerExtractedStateCode
            ) {
              isCGSTSGST = true;
            } else {
              isCGSTSGST = false;
            }
          } else if (
            salesReturnXlsxData[i].customerState &&
            salesReturnXlsxData[i].customerState !== ''
          ) {
            let result = getStateList().find(
              (e) => e.code === businessStateCode
            );
            if (result) {
              let businessState = result.name;
              if (
                salesReturnXlsxData[i].customerState !== '' &&
                salesReturnXlsxData[i].customerState !== null &&
                businessState !== '' &&
                businessState !== null &&
                salesReturnXlsxData[i].customerState.toLowerCase() ===
                  businessState.toLowerCase()
              ) {
                isCGSTSGST = true;
              } else {
                isCGSTSGST = false;
              }
            }
          }
        }
        if (
          salesReturnXlsxData[i].customerGSTNo === '' ||
          salesReturnXlsxData[i].customerGSTNo === null ||
          salesReturnXlsxData[i].customerGSTNo === undefined
        ) {
          if (
            salesReturnXlsxData[i].isCancelled &&
            salesReturnXlsxData[i].isCancelled === true
          ) {
            cdnurCancelledData.push(salesReturnXlsxData[i]);
          } else {
            cdnurData.push(salesReturnXlsxData[i]);
          }
        } else {
          type = 'CDNR';
          if (
            (salesReturnXlsxData[i].isCancelled &&
              salesReturnXlsxData[i].isCancelled === true) ||
            salesReturnXlsxData[i].einvoiceBillStatus === 'Cancelled'
          ) {
            if (salesReturnXlsxData[i].einvoiceBillStatus === 'Cancelled') {
              //handle later
            } else {
              if (salesReturnXlsxData[i].amended === true) {
                //handle later
              } else {
                cdnrCancelledData.push(salesReturnXlsxData[i]);
              }
            }
          } else {
            if (
              salesReturnXlsxData[i].irnNo !== '' &&
              salesReturnXlsxData[i].irnNo !== null &&
              salesReturnXlsxData[i].irnNo !== undefined
            ) {
              //handle later
            } else {
              if (salesReturnXlsxData[i].amended === true) {
                //handle later
              } else {
                cdnrData.push(salesReturnXlsxData[i]);
              }
            }
          }
        }

        let prodMessage = '';
        for (let product of salesReturnXlsxData[i].item_list) {
          if (
            product.cgst_amount === 0 &&
            product.sgst_amount === 0 &&
            product.igst_amount === 0 &&
            (product.discount_percent === 0 ||
              product.discount_percent == null ||
              product.discount_percent === undefined)
          ) {
            prodMessage += product.item_name + ' - Tax rate is not defined.\n';
          } else if (isCGSTSGST === true && product.igst_amount > 0) {
            prodMessage +=
              product.item_name +
              ' - IGST Tax rate is defined. It should be CGST-SGST \n';
          } else if (isCGSTSGST === false && product.cgst_amount > 0) {
            prodMessage +=
              product.item_name +
              ' - CGST-SGST Tax rate is defined. It should be IGST \n';
          }

          const taxUtilRes = await taxUtilityTxn.isTaxRateValid(
            parseFloat(product.cgst) +
              parseFloat(product.sgst) +
              parseFloat(product.igst),
            auditSettings
          );

          if (!taxUtilRes.isTaxRateValid) {
            prodMessage +=
              product.item_name + ' - Tax rate defined is invalid.\n';
          }

          if (product.hsn === '') {
            prodMessage += product.item_name + ' - HSN is not defined.\n';
          } else if (product.hsn !== '') {
            if (
              product.hsn.length === 4 ||
              product.hsn.length === 6 ||
              product.hsn.length === 8
            ) {
              // do nothing
            } else {
              prodMessage +=
                product.item_name +
                ' - HSN code' +
                ' (' +
                product.hsn +
                ')' +
                ' length is not valid.\n';
            }
          }
        }

        if (prodMessage !== '') {
          errorData.push({
            sequenceNumber: salesReturnXlsxData[i].sequenceNumber,
            customerName: salesReturnXlsxData[i].customer_name,
            type: type,
            errorMessage: prodMessage
          });
        }
      }
    }

    // Create a workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    await prepareSalesSheet(
      workbook,
      auditSettingsExists,
      auditSettings,
      xlsxData,
      deletedData,
      deletedGstTotal,
      salesGstTotal
    );
    await prepareSalesReturnSheet(
      workbook,
      auditSettingsExists,
      auditSettings,
      salesReturnXlsxData,
      deletedDataSalesReturn,
      deletedSalesReturnGstTotal,
      salesReturnGstTotal
    );
    await prepareB2BSheet(
      workbook,
      auditSettingsExists,
      auditSettings,
      b2bData,
      b2bCancelledData,
      b2bGstTotal,
      b2bCancelledGstTotal,
      defaultState,
      'B2B'
    );
    await prepareB2BSheet(
      workbook,
      auditSettingsExists,
      auditSettings,
      b2bEInvoicesData,
      b2bEInvoicesCancelledData,
      b2bEInvoiceGstTotal,
      b2bEInvoiceCancelledGstTotal,
      defaultState,
      'B2B E-Invoice'
    );
    // await prepareB2BSheet(
    //   workbook,
    //   auditSettingsExists,
    //   auditSettings,
    //   b2bAData,
    //   b2bACancelledData,
    //   b2bAGstTotal,
    //   b2bACancelledGstTotal,
    //   defaultState,
    //   'B2BA'
    // );
    await prepareB2COrB2CLSheet(
      workbook,
      auditSettingsExists,
      auditSettings,
      b2cData,
      b2cCancelledData,
      b2cGstTotal,
      b2cCancelledGstTotal,
      defaultState,
      'B2C'
    );
    await prepareB2COrB2CLSheet(
      workbook,
      auditSettingsExists,
      auditSettings,
      b2clData,
      b2clCancelledData,
      b2clGstTotal,
      b2clCancelledGstTotal,
      defaultState,
      'B2CL'
    );
    await prepareCDNRSheet(
      workbook,
      auditSettingsExists,
      auditSettings,
      cdnrData,
      cdnrCancelledData,
      cdnrGstTotal,
      cdnrCancelledGstTotal,
      defaultState,
      'CDNR'
    );
    await prepareCDNURSheet(
      workbook,
      auditSettingsExists,
      auditSettings,
      cdnurData,
      cdnurCancelledData,
      cdnurGstTotal,
      cdnurCancelledGstTotal,
      defaultState,
      'CDNUR'
    );
    //prepareHSN
    if (hsnSummaryData && hsnSummaryData.length > 0) {
      prepareHsnSheet(
        workbook,
        hsnSummaryData,
        salesGstTotal,
        salesReturnGstTotal
      );
    }
    if (prefixMAp) {
      await prepareDocSummary(
        workbook,
        auditSettingsExists,
        auditSettings,
        prefixMAp
      );
    }
    if (errorData.length > 0) {
      await prepareErrorSheet(
        workbook,
        auditSettingsExists,
        auditSettings,
        errorData
      );
    }
    if (prefixMAp) {
      await prepareInvoiceCheckSheet(
        workbook,
        auditSettingsExists,
        auditSettings,
        prefixMAp
      );
    }

    // Generate Excel file buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Create a Blob from the buffer
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
      // Create a link element
      const a = document.createElement('a');
      // Set the link's href attribute to the URL of the Blob
      a.href = url;
      // Set the download attribute to specify the filename
      const fileName =
        localStorage.getItem('businessName') +
        '_Audit_Report_' +
        getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate);
      a.download = fileName + '.xlsx';
      // Append the link to the body
      document.body.appendChild(a);
      // Click the link programmatically to start the download
      a.click();
      // Remove the link from the body
      document.body.removeChild(a);
    });
  };

  const prepareSalesSheet = async (
    workbook,
    auditSettingsExists,
    auditSettings,
    xlsxData,
    deletedData,
    deletedGstTotal,
    salesGstTotal
  ) => {
    const worksheet = workbook.addWorksheet(
      'SALES (' + parseInt(xlsxData.length || 0) + ')'
    );

    let filteredColumns = [];
    await prepareSalesHeaderRow(
      filteredColumns,
      auditSettingsExists,
      auditSettings
    );

    worksheet.columns = filteredColumns;

    let totalRowsDrawn = 0;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);
    totalRowsDrawn += 1;

    let taxData = await getTaxSettingsDetails();
    let defaultState = getStateList().find((e) => e.name === taxData.state);

    if (xlsxData && xlsxData.length > 0) {
      for (let i = 0; i < xlsxData.length; i++) {
        // Add a blank row
        let newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          xlsxData[i],
          salesGstTotal,
          auditSettingsExists,
          defaultState
        );

        if (
          (xlsxData[i].isCancelled && xlsxData[i].isCancelled === true) ||
          xlsxData[i].einvoiceBillStatus === 'Cancelled'
        ) {
          applyColorToRow(worksheet, newRow, 'FFFF474C');
        }
      }

      totalRowsDrawn += xlsxData.length;

      // Add a total row
      const totalRow = worksheet.addRow({});
      await prepareTotalRow(
        totalRow,
        salesGstTotal,
        auditSettingsExists,
        'Sales Total',
        false
      );

      totalRowsDrawn += 1;
    }

    if (deletedData && deletedData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      await prepareSubtitle(
        'DELETED INVOICES',
        worksheet,
        totalRowsDrawn,
        'FFFF474C'
      );
      totalRowsDrawn += 1;

      for (let record of deletedData) {
        let parsedData = JSON.parse(record.data);

        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          parsedData,
          deletedGstTotal,
          auditSettingsExists,
          defaultState
        );
      }

      totalRowsDrawn += deletedData.length;

      // Add a b2c total row
      const deletedTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        deletedTotalRow,
        deletedGstTotal,
        auditSettingsExists,
        'Deleted Total',
        false
      );

      totalRowsDrawn += 1;
    }
  };

  const prepareB2BSheet = async (
    workbook,
    auditSettingsExists,
    auditSettings,
    b2bData,
    b2bCancelledData,
    b2bGstTotal,
    b2bCancelledGstTotal,
    defaultState,
    type
  ) => {
    const worksheet = workbook.addWorksheet(
      type + ' (' + parseInt(b2bData.length || 0) + ')'
    );

    let filteredColumns = [];
    let totalRowsDrawn = 2;
    await prepareSalesHeaderRow(
      filteredColumns,
      auditSettingsExists,
      auditSettings,
      type
    );

    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    if (b2bData.length > 0) {
      for (let record of b2bData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          record,
          b2bGstTotal,
          auditSettingsExists,
          defaultState,
          type
        );
      }
      totalRowsDrawn += b2bData.length;

      const b2bTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        b2bTotalRow,
        b2bGstTotal,
        auditSettingsExists,
        type + ' Total',
        false,
        type
      );

      totalRowsDrawn += 1;
    }

    if (b2bCancelledData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});

      totalRowsDrawn += 2;

      await prepareSubtitle(
        type + ' CANCELLED INVOICES',
        worksheet,
        totalRowsDrawn,
        'FFFF474C'
      );
      totalRowsDrawn += 1;

      for (let record of b2bCancelledData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          record,
          b2bCancelledGstTotal,
          auditSettingsExists,
          defaultState,
          type
        );
      }
      totalRowsDrawn += b2bCancelledData.length;

      // Add a b2b total row
      const b2bCancelledTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        b2bCancelledTotalRow,
        b2bCancelledGstTotal,
        auditSettingsExists,
        type + ' Cancelled Total',
        false,
        type
      );

      totalRowsDrawn += 1;
    }

    if (b2bData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      worksheet.addRow({});
      totalRowsDrawn += 1;
      totalRowsDrawn = await preparePaymentSnapshot(
        worksheet,
        b2bGstTotal,
        totalRowsDrawn,
        type
      );

      totalRowsDrawn = await prepareSalesSnapshot(
        worksheet,
        b2bGstTotal,
        totalRowsDrawn,
        auditSettings,
        type,
        false
      );

      worksheet.addRow({});
      totalRowsDrawn += 1;

      const row = worksheet.addRow({});
      row.getCell('gstin').value = getB2BPaymentTotal(b2bGstTotal);
      row.getCell('gstin').font = {
        bold: true
      };
      row.getCell('gstin').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      row.getCell('invoiceValue').value = getB2BSalesTotal(b2bGstTotal);
      row.getCell('invoiceValue').font = {
        bold: true
      };
      row.getCell('invoiceValue').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      let isDrawn = false;
      if (auditSettingsExists) {
        if (auditSettings.taxApplicability.includes(0)) {
          row.getCell('zerotaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(3) && !isDrawn) {
          row.getCell('threetaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(5) && !isDrawn) {
          row.getCell('fivetaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(12) && !isDrawn) {
          row.getCell('twelvetaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(18) && !isDrawn) {
          row.getCell('eighteentaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(28) && !isDrawn) {
          row.getCell('twentyeighttaxable').value = b2bGstTotal.roundoff;
          isDrawn = true;
        }
      }
      totalRowsDrawn += 1;
    }
  };

  const prepareB2COrB2CLSheet = async (
    workbook,
    auditSettingsExists,
    auditSettings,
    b2cData,
    b2cCancelledData,
    b2cGstTotal,
    b2cCancelledGstTotal,
    defaultState,
    type
  ) => {
    const worksheet = workbook.addWorksheet(
      type + ' (' + parseInt(b2cData.length || 0) + ')'
    );

    let filteredColumns = [];
    let totalRowsDrawn = 1;
    await prepareSalesHeaderRow(
      filteredColumns,
      auditSettingsExists,
      auditSettings
    );

    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    if (b2cData.length > 0) {
      for (let record of b2cData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          record,
          b2cGstTotal,
          auditSettingsExists,
          defaultState
        );
      }

      totalRowsDrawn += b2cData.length;

      // Add a b2c total row
      const b2cTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        b2cTotalRow,
        b2cGstTotal,
        auditSettingsExists,
        type + ' Total',
        false
      );

      totalRowsDrawn += 1;
    }

    if (b2cCancelledData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      await prepareSubtitle(
        type + ' CANCELLED INVOICES',
        worksheet,
        totalRowsDrawn,
        'FFFF474C'
      );
      totalRowsDrawn += 1;

      for (let record of b2cCancelledData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareDataRow(
          newRow,
          record,
          b2cCancelledGstTotal,
          auditSettingsExists,
          defaultState
        );
      }
      totalRowsDrawn += b2cCancelledData.length;

      // Add a b2c total row
      const b2cCancelledTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        b2cCancelledTotalRow,
        b2cCancelledGstTotal,
        auditSettingsExists,
        type + ' Cancelled Total',
        false
      );

      totalRowsDrawn += 1;
    }

    if (b2cData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      worksheet.addRow({});
      totalRowsDrawn += 1;
      totalRowsDrawn = await preparePaymentSnapshot(
        worksheet,
        b2cGstTotal,
        totalRowsDrawn,
        type
      );

      worksheet.addRow({});
      totalRowsDrawn += 1;

      totalRowsDrawn = await prepareSalesSnapshot(
        worksheet,
        b2cGstTotal,
        totalRowsDrawn,
        auditSettings,
        type,
        false
      );

      worksheet.addRow({});
      totalRowsDrawn += 1;

      const row = worksheet.addRow({});
      row.getCell('gstin').value = getB2CPaymentTotal(b2cGstTotal);
      row.getCell('gstin').font = {
        bold: true
      };
      row.getCell('gstin').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      row.getCell('invoiceValue').value = getB2CSalesTotal(b2cGstTotal);
      row.getCell('invoiceValue').font = {
        bold: true
      };
      row.getCell('invoiceValue').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      let isDrawn = false;
      if (auditSettingsExists) {
        if (auditSettings.taxApplicability.includes(0)) {
          row.getCell('zerotaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(3) && !isDrawn) {
          row.getCell('threetaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(5) && !isDrawn) {
          row.getCell('fivetaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(12) && !isDrawn) {
          row.getCell('twelvetaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(18) && !isDrawn) {
          row.getCell('eighteentaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(28) && !isDrawn) {
          row.getCell('twentyeighttaxable').value = b2cGstTotal.roundoff;
          isDrawn = true;
        }
      }

      totalRowsDrawn += 1;
    }
  };

  const prepareErrorSheet = async (
    workbook,
    auditSettingsExists,
    auditSettings,
    errorData
  ) => {
    const worksheet = workbook.addWorksheet(
      'ERROR (' + parseInt(errorData.length || 0) + ')'
    );

    let filteredColumns = [];
    let totalRowsDrawn = 1;
    await prepareErrorHeaderRow(
      filteredColumns,
      auditSettingsExists,
      auditSettings
    );

    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    if (errorData && errorData.length > 0) {
      for (let record of errorData) {
        const row = worksheet.addRow({});
        row.getCell('invoiceNumber').value = record.sequenceNumber;
        row.getCell('date').value = record.type;
        row.getCell('customerName').value = record.customerName;

        row.getCell('gstin').value = record.errorMessage;
        row.getCell('gstin').alignment = {
          vertical: 'top',
          wrapText: true
        };
      }

      totalRowsDrawn += errorData.length;
    }
  };

  const prepareHsnSheet = async (
    workbook,
    hsnSummary,
    salesGstTotal,
    salesReturnGstTotal
  ) => {
    const worksheet = workbook.addWorksheet(
      'HSN SUMMARY (' + hsnSummary.length + ')'
    );

    let filteredColumns = [];
    let totalRowsDrawn = 1;

    await prepareHSNHeaderRow(filteredColumns);
    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    let hsnTotal = {
      qty: 0,
      taxableAmt: 0,
      camt: 0,
      samt: 0,
      iamt: 0
    };

    for (let record of hsnSummary) {
      const row = worksheet.addRow({});
      row.getCell('hsnCode').value = record.hsn_sc;
      row.getCell('qty').value = record.qty;
      row.getCell('unit').value = record.uqc;
      row.getCell('taxRate').value = record.rt;
      row.getCell('taxableAmt').value = record.txval;
      row.getCell('camt').value = record.camt;
      row.getCell('samt').value = record.samt;
      row.getCell('iamt').value = record.iamt;

      hsnTotal.qty += parseFloat(record.qty || 0);
      hsnTotal.taxableAmt += parseFloat(record.txval || 0);
      hsnTotal.camt += parseFloat(record.camt || 0);
      hsnTotal.samt += parseFloat(record.samt || 0);
      hsnTotal.iamt += parseFloat(record.iamt || 0);
    }

    totalRowsDrawn += hsnSummary.length;

    // Add a hsn total row
    const hsnTotalRow = worksheet.addRow({});

    hsnTotalRow.getCell('hsnCode').value = 'TOTAL';
    hsnTotalRow.getCell('qty').value = hsnTotal.qty;
    hsnTotalRow.getCell('unit').value = '';
    hsnTotalRow.getCell('taxRate').value = '';
    hsnTotalRow.getCell('taxableAmt').value = hsnTotal.taxableAmt;
    hsnTotalRow.getCell('camt').value = hsnTotal.camt;
    hsnTotalRow.getCell('samt').value = hsnTotal.samt;
    hsnTotalRow.getCell('iamt').value = hsnTotal.iamt;

    hsnTotalRow.font = { bold: true };
    hsnTotalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });
    totalRowsDrawn += 1;

    worksheet.addRow({});
    worksheet.addRow({});
    totalRowsDrawn += 2;

    // Add a sales total row
    const salesReturnRow = worksheet.addRow({});
    salesReturnRow.getCell('taxRate').value = 'SALES';
    salesReturnRow.getCell('taxRate').font = { bold: true };
    salesReturnRow.getCell('taxableAmt').value = getTaxableTotal(salesGstTotal);
    salesReturnRow.getCell('camt').value = getCAMTTaxableTotal(salesGstTotal);
    salesReturnRow.getCell('samt').value = getSAMTTaxableTotal(salesGstTotal);
    salesReturnRow.getCell('iamt').value = getIAMTTaxableTotal(salesGstTotal);

    // Add a returns total row
    const hsnRow = worksheet.addRow({});
    hsnRow.getCell('taxRate').value = 'RETURNS';
    hsnRow.getCell('taxRate').font = { bold: true };
    hsnRow.getCell('taxableAmt').value = getTaxableTotal(salesReturnGstTotal);
    hsnRow.getCell('camt').value = getCAMTTaxableTotal(salesReturnGstTotal);
    hsnRow.getCell('samt').value = getSAMTTaxableTotal(salesReturnGstTotal);
    hsnRow.getCell('iamt').value = getIAMTTaxableTotal(salesReturnGstTotal);

    // Add a hsn total row
    const salesRow = worksheet.addRow({});
    salesRow.getCell('taxRate').value = 'HSN';
    salesRow.getCell('taxRate').font = { bold: true };
    salesRow.getCell('taxableAmt').value = parseFloat(hsnTotal.taxableAmt);
    salesRow.getCell('camt').value = parseFloat(hsnTotal.camt);
    salesRow.getCell('samt').value = parseFloat(hsnTotal.samt);
    salesRow.getCell('iamt').value = parseFloat(hsnTotal.iamt);

    console.log('1: ' + getTaxableTotal(salesGstTotal));
    console.log('2: ' + getTaxableTotal(salesReturnGstTotal));
    console.log('3: ' + hsnTotal.taxableAmt);

    // Add a discrepancy total row
    const discrepancyRow = worksheet.addRow({});
    discrepancyRow.getCell('taxRate').value = 'DISCREPANCY';
    discrepancyRow.getCell('taxRate').font = { bold: true };
    discrepancyRow.getCell('taxableAmt').value =
      getTaxableTotal(salesGstTotal).toFixed(2) -
      getTaxableTotal(salesReturnGstTotal).toFixed(2) -
      hsnTotal.taxableAmt.toFixed(2);
    discrepancyRow.getCell('camt').value =
      getCAMTTaxableTotal(salesGstTotal).toFixed(2) -
      getCAMTTaxableTotal(salesReturnGstTotal).toFixed(2) -
      hsnTotal.camt.toFixed(2);
    discrepancyRow.getCell('samt').value =
      getSAMTTaxableTotal(salesGstTotal).toFixed(2) -
      getSAMTTaxableTotal(salesReturnGstTotal).toFixed(2) -
      hsnTotal.samt.toFixed(2);
    discrepancyRow.getCell('iamt').value =
      getIAMTTaxableTotal(salesGstTotal).toFixed(2) -
      getIAMTTaxableTotal(salesReturnGstTotal).toFixed(2) -
      hsnTotal.iamt.toFixed(2);
    totalRowsDrawn += 4;

    discrepancyRow.font = { bold: true };
    discrepancyRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };
      if (cell.value > 0) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFCCCB' } // Yellow color
        };
      }
    });
  };

  const prepareInvoiceCheckSheet = async (
    workbook,
    auditSettingsExists,
    auditSettings,
    prefixMap
  ) => {
    const worksheet = workbook.addWorksheet('SALES MISSING INVOICE CHECK');

    let filteredColumns = [];
    let totalRowsDrawn = 1;
    await prepareInvoiceCheckHeaderRow(
      filteredColumns,
      auditSettingsExists,
      auditSettings
    );

    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    if (prefixMap) {
      for (const [key, value] of prefixMap.entries()) {
        const row = worksheet.addRow({});
        row.getCell('seqNum').value = 'Prefix:';
        row.getCell('seqNumSeries').value = key;
        row.getCell('seqNum').font = { bold: true };
        row.getCell('seqNumSeries').font = { bold: true };
        totalRowsDrawn += 1;
        let seqNoStart = value.sequenceNumbers[0];
        const sortedNumbers = [...value.sequenceNumbers].sort((a, b) => a - b);
        for (let seqno of sortedNumbers) {
          const seqNumRow = worksheet.addRow({});
          seqNumRow.getCell('seqNum').value = seqno;
          seqNumRow.getCell('seqNumSeries').value = seqNoStart;
          seqNumRow.getCell('finalDiff').value =
            parseInt(seqno) - parseInt(seqNoStart);
          seqNoStart = seqNoStart + 1;
        }
        totalRowsDrawn += value.sequenceNumbers.length;
      }
    }
  };

  const prepareDocSummary = async (
    workbook,
    auditSettingsExists,
    auditSettings,
    prefixMap
  ) => {
    const worksheet = workbook.addWorksheet('DOC SUMMARY');

    let filteredColumns = [];
    let totalRowsDrawn = 1;
    await prepareDOCSummaryHeaderRow(filteredColumns);

    worksheet.columns = filteredColumns;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    if (prefixMap) {
      for (const [key, value] of prefixMap.entries()) {
        const row = worksheet.addRow({});
        row.getCell('firstSlNo').value = value.prefix
          ? value.prefix + '/' + value.lowest
          : value.lowest;
        row.getCell('lastSlNo').value = value.prefix
          ? value.prefix + '/' + value.highest
          : value.highest;
        row.getCell('total').value = value.highest - value.lowest + 1;
        row.getCell('cancelled').value = value.cancelNumber;
        row.getCell('netIssue').value =
          value.highest - value.lowest - value.cancelNumber;
        row.getCell('missingNos').value = value.missingNumbers
          ? value.missingNumbers.join(', ')
          : '';
        totalRowsDrawn += 1;
      }
    }
  };

  const prepareSalesReturnSheet = async (
    workbook,
    auditSettingsExists,
    auditSettings,
    xlsxData,
    deletedDataSalesReturn,
    deletedSalesReturnGstTotal,
    salesReturnGstTotal
  ) => {
    const worksheet = workbook.addWorksheet(
      'SALES RETURN (' + parseInt(xlsxData.length || 0) + ')'
    );

    let filteredColumns = [];
    await prepareSalesReturnHeaderRow(
      filteredColumns,
      auditSettingsExists,
      auditSettings
    );

    worksheet.columns = filteredColumns;

    let totalRowsDrawn = 0;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);
    totalRowsDrawn += 1;

    let taxData = await getTaxSettingsDetails();
    let defaultState = getStateList().find((e) => e.name === taxData.state);

    if (xlsxData && xlsxData.length > 0) {
      for (let i = 0; i < xlsxData.length; i++) {
        // Add a blank row
        let newRow = worksheet.addRow({});
        await prepareSalesReturnDataRow(
          newRow,
          xlsxData[i],
          salesReturnGstTotal,
          auditSettingsExists,
          defaultState
        );

        if (
          (xlsxData[i].isCancelled && xlsxData[i].isCancelled === true) ||
          xlsxData[i].einvoiceBillStatus === 'Cancelled'
        ) {
          applyColorToRow(worksheet, newRow, 'FFFF474C');
        }
      }

      totalRowsDrawn += xlsxData.length;

      // Add a total row
      const totalRow = worksheet.addRow({});
      await prepareTotalRow(
        totalRow,
        salesReturnGstTotal,
        auditSettingsExists,
        'Sales Return Total',
        true
      );

      totalRowsDrawn += 1;
    }

    if (deletedDataSalesReturn && deletedDataSalesReturn.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      await prepareSubtitle(
        'DELETED INVOICES',
        worksheet,
        totalRowsDrawn,
        'FFFF474C'
      );
      totalRowsDrawn += 1;

      for (let record of deletedDataSalesReturn) {
        let parsedData = JSON.parse(record.data);

        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareSalesReturnDataRow(
          newRow,
          parsedData,
          deletedSalesReturnGstTotal,
          auditSettingsExists,
          defaultState
        );
      }

      totalRowsDrawn += deletedDataSalesReturn.length;

      // Add a b2c total row
      const deletedTotalRow = worksheet.addRow({});
      await prepareTotalRow(
        deletedTotalRow,
        deletedSalesReturnGstTotal,
        auditSettingsExists,
        'Deleted Total',
        true
      );

      totalRowsDrawn += 1;
    }
  };

  const prepareCDNRSheet = async (
    workbook,
    auditSettingsExists,
    auditSettings,
    cdnrData,
    cdnrCancelledData,
    cdnrGstTotal,
    cdnrCancelledGstTotal,
    defaultState,
    type
  ) => {
    const worksheet = workbook.addWorksheet(
      type + ' (' + parseInt(cdnrData.length || 0) + ')'
    );

    let filteredColumns = [];
    await prepareSalesReturnHeaderRow(
      filteredColumns,
      auditSettingsExists,
      auditSettings
    );

    worksheet.columns = filteredColumns;

    let totalRowsDrawn = 0;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    if (cdnrData.length > 0) {
      for (let record of cdnrData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareSalesReturnDataRow(
          newRow,
          record,
          cdnrGstTotal,
          auditSettingsExists,
          defaultState,
          type
        );
      }
      totalRowsDrawn += cdnrData.length;

      const totalRow = worksheet.addRow({});
      await prepareTotalRow(
        totalRow,
        cdnrGstTotal,
        auditSettingsExists,
        type + ' Total',
        true
      );

      totalRowsDrawn += 1;
    }

    if (cdnrCancelledData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});

      totalRowsDrawn += 2;

      await prepareSubtitle(
        type + ' CANCELLED INVOICES',
        worksheet,
        totalRowsDrawn,
        'FFFF474C'
      );
      totalRowsDrawn += 1;

      for (let record of cdnrCancelledData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareSalesReturnDataRow(
          newRow,
          record,
          cdnrCancelledGstTotal,
          auditSettingsExists,
          defaultState,
          type
        );
      }
      totalRowsDrawn += cdnrCancelledData.length;

      // Add a b2b total row
      const totalRow = worksheet.addRow({});
      await prepareTotalRow(
        totalRow,
        cdnrGstTotal,
        auditSettingsExists,
        type + ' Total',
        true
      );

      totalRowsDrawn += 1;
    }

    if (cdnrData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      worksheet.addRow({});
      totalRowsDrawn += 1;
      totalRowsDrawn = await preparePaymentSnapshot(
        worksheet,
        cdnrGstTotal,
        totalRowsDrawn,
        type
      );

      totalRowsDrawn = await prepareSalesSnapshot(
        worksheet,
        cdnrGstTotal,
        totalRowsDrawn,
        auditSettings,
        type,
        true
      );

      worksheet.addRow({});
      totalRowsDrawn += 1;

      const row = worksheet.addRow({});
      row.getCell('gstin').value = getB2BPaymentTotal(cdnrGstTotal);
      row.getCell('gstin').font = {
        bold: true
      };
      row.getCell('gstin').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      row.getCell('invoiceValue').value = getB2BSalesTotal(cdnrGstTotal);
      row.getCell('invoiceValue').font = {
        bold: true
      };
      row.getCell('invoiceValue').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      let isDrawn = false;
      if (auditSettingsExists) {
        if (auditSettings.taxApplicability.includes(0)) {
          row.getCell('zerotaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(3) && !isDrawn) {
          row.getCell('threetaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(5) && !isDrawn) {
          row.getCell('fivetaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(12) && !isDrawn) {
          row.getCell('twelvetaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(18) && !isDrawn) {
          row.getCell('eighteentaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(28) && !isDrawn) {
          row.getCell('twentyeighttaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }
      }
      totalRowsDrawn += 1;
    }
    
  };

  const prepareCDNURSheet = async (
    workbook,
    auditSettingsExists,
    auditSettings,
    cdnrData,
    cdnrCancelledData,
    cdnrGstTotal,
    cdnrCancelledGstTotal,
    defaultState,
    type
  ) => {
    const worksheet = workbook.addWorksheet(
      type + ' (' + parseInt(cdnrData.length || 0) + ')'
    );

    let filteredColumns = [];
    await prepareSalesReturnHeaderRow(
      filteredColumns,
      auditSettingsExists,
      auditSettings
    );

    worksheet.columns = filteredColumns;

    let totalRowsDrawn = 0;

    // Make header row bold and color header cells
    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    if (cdnrData.length > 0) {
      for (let record of cdnrData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareSalesReturnDataRow(
          newRow,
          record,
          cdnrGstTotal,
          auditSettingsExists,
          defaultState,
          type
        );
      }
      totalRowsDrawn += cdnrData.length;

      const totalRow = worksheet.addRow({});
      await prepareTotalRow(
        totalRow,
        cdnrGstTotal,
        auditSettingsExists,
        type + ' Total',
        true
      );

      totalRowsDrawn += 1;
    }

    if (cdnrCancelledData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});

      totalRowsDrawn += 2;

      await prepareSubtitle(
        type + ' CANCELLED INVOICES',
        worksheet,
        totalRowsDrawn,
        'FFFF474C'
      );
      totalRowsDrawn += 1;

      for (let record of cdnrCancelledData) {
        // Add a blank row
        const newRow = worksheet.addRow({});
        await prepareSalesReturnDataRow(
          newRow,
          record,
          cdnrCancelledGstTotal,
          auditSettingsExists,
          defaultState,
          type
        );
      }
      totalRowsDrawn += cdnrCancelledData.length;

      // Add a b2b total row
      const totalRow = worksheet.addRow({});
      await prepareTotalRow(
        totalRow,
        cdnrGstTotal,
        auditSettingsExists,
        type + ' Total',
        true
      );

      totalRowsDrawn += 1;
    }

    if (cdnrData.length > 0) {
      worksheet.addRow({});
      worksheet.addRow({});
      totalRowsDrawn += 2;

      worksheet.addRow({});
      totalRowsDrawn += 1;
      totalRowsDrawn = await preparePaymentSnapshot(
        worksheet,
        cdnrGstTotal,
        totalRowsDrawn,
        type
      );

      worksheet.addRow({});
      totalRowsDrawn += 1;

      totalRowsDrawn = await prepareSalesSnapshot(
        worksheet,
        cdnrGstTotal,
        totalRowsDrawn,
        auditSettings,
        type,
        true
      );

      worksheet.addRow({});
      totalRowsDrawn += 1;

      const row = worksheet.addRow({});
      row.getCell('gstin').value = getB2CPaymentTotal(cdnrGstTotal);
      row.getCell('gstin').font = {
        bold: true
      };
      row.getCell('gstin').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      row.getCell('invoiceValue').value = getB2CSalesTotal(cdnrGstTotal);
      row.getCell('invoiceValue').font = {
        bold: true
      };
      row.getCell('invoiceValue').border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };

      let isDrawn = false;
      if (auditSettingsExists) {
        if (auditSettings.taxApplicability.includes(0)) {
          row.getCell('zerotaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(3) && !isDrawn) {
          row.getCell('threetaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(5) && !isDrawn) {
          row.getCell('fivetaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(12) && !isDrawn) {
          row.getCell('twelvetaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(18) && !isDrawn) {
          row.getCell('eighteentaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }

        if (auditSettings.taxApplicability.includes(28) && !isDrawn) {
          row.getCell('twentyeighttaxable').value = cdnrGstTotal.roundoff;
          isDrawn = true;
        }
      }

      totalRowsDrawn += 1;
    }
  };

  const formatHeaderRow = (headerRow) => {
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd8f3fc' } // Yellow color
      };
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  };

  const getB2BPaymentTotal = (b2bGstTotal) => {
    return (
      b2bGstTotal.cash +
      b2bGstTotal.creditnote +
      b2bGstTotal.upi +
      b2bGstTotal.card +
      b2bGstTotal.neft +
      b2bGstTotal.cheque +
      b2bGstTotal.balancedue
    );
  };

  const getB2CPaymentTotal = (b2cGstTotal) => {
    return (
      b2cGstTotal.cash +
      b2cGstTotal.creditnote +
      b2cGstTotal.upi +
      b2cGstTotal.card +
      b2cGstTotal.neft +
      b2cGstTotal.cheque +
      b2cGstTotal.balancedue
    );
  };

  const getB2BSalesTotal = (b2bGstTotal) => {
    return (
      b2bGstTotal.zerotaxable +
      b2bGstTotal.zerocgst +
      b2bGstTotal.zerosgst +
      b2bGstTotal.zeroigst +
      b2bGstTotal.threetaxable +
      b2bGstTotal.threecgst +
      b2bGstTotal.threesgst +
      b2bGstTotal.threeigst +
      b2bGstTotal.fivetaxable +
      b2bGstTotal.fivecgst +
      b2bGstTotal.fivesgst +
      b2bGstTotal.fiveigst +
      b2bGstTotal.twelvetaxable +
      b2bGstTotal.twelvecgst +
      b2bGstTotal.twelvesgst +
      b2bGstTotal.twelveigst +
      b2bGstTotal.eighteentaxable +
      b2bGstTotal.eighteencgst +
      b2bGstTotal.eighteensgst +
      b2bGstTotal.eighteenigst +
      b2bGstTotal.twentyeighttaxable +
      b2bGstTotal.twentyeightcgst +
      b2bGstTotal.twentyeightsgst +
      b2bGstTotal.twentyeightigst
    );
  };

  const getB2CSalesTotal = (b2cGstTotal) => {
    return (
      b2cGstTotal.zerotaxable +
      b2cGstTotal.zerocgst +
      b2cGstTotal.zerosgst +
      b2cGstTotal.zeroigst +
      b2cGstTotal.threetaxable +
      b2cGstTotal.threecgst +
      b2cGstTotal.threesgst +
      b2cGstTotal.threeigst +
      b2cGstTotal.fivetaxable +
      b2cGstTotal.fivecgst +
      b2cGstTotal.fivesgst +
      b2cGstTotal.fiveigst +
      b2cGstTotal.twelvetaxable +
      b2cGstTotal.twelvecgst +
      b2cGstTotal.twelvesgst +
      b2cGstTotal.twelveigst +
      b2cGstTotal.eighteentaxable +
      b2cGstTotal.eighteencgst +
      b2cGstTotal.eighteensgst +
      b2cGstTotal.eighteenigst +
      b2cGstTotal.twentyeighttaxable +
      b2cGstTotal.twentyeightcgst +
      b2cGstTotal.twentyeightsgst +
      b2cGstTotal.twentyeightigst
    );
  };

  const getTaxableTotal = (gstTotal) => {
    return (
      gstTotal.zerotaxable +
      gstTotal.threetaxable +
      gstTotal.fivetaxable +
      gstTotal.twelvetaxable +
      gstTotal.eighteentaxable +
      gstTotal.twentyeighttaxable
    );
  };

  const getCAMTTaxableTotal = (gstTotal) => {
    return (
      gstTotal.zerocgst +
      gstTotal.threecgst +
      gstTotal.fivecgst +
      gstTotal.twelvecgst +
      gstTotal.eighteencgst +
      gstTotal.twentyeightcgst
    );
  };

  const getSAMTTaxableTotal = (gstTotal) => {
    return (
      gstTotal.zerosgst +
      gstTotal.threesgst +
      gstTotal.fivesgst +
      gstTotal.twelvesgst +
      gstTotal.eighteensgst +
      gstTotal.twentyeightsgst
    );
  };

  const getIAMTTaxableTotal = (gstTotal) => {
    return (
      gstTotal.zeroigst +
      gstTotal.threeigst +
      gstTotal.fiveigst +
      gstTotal.twelveigst +
      gstTotal.eighteenigst +
      gstTotal.twentyeightigst
    );
  };

  const preparePaymentSnapshot = (worksheet, total, totalRowsDrawn, type) => {
    preparePaymentsWorkingRow(worksheet, 'CASH', total.cash, type);
    preparePaymentsWorkingRow(worksheet, 'CREDIT NOTE', total.creditnote);
    preparePaymentsWorkingRow(worksheet, 'UPI', total.upi);
    preparePaymentsWorkingRow(worksheet, 'CARD', total.card);
    preparePaymentsWorkingRow(worksheet, 'NEFT', total.neft);
    preparePaymentsWorkingRow(worksheet, 'CHEQUE', total.cheque);
    preparePaymentsWorkingRow(worksheet, 'DEBTORS', total.balancedue);
    totalRowsDrawn += 7;

    return totalRowsDrawn;
  };

  const prepareSalesSnapshot = (
    worksheet,
    total,
    totalRowsDrawn,
    auditSettingsExists,
    type,
    isReturns
  ) => {
    worksheet.addRow({});
    totalRowsDrawn += 1;

    if (auditSettingsExists) {
      if (auditSettings.taxApplicability.includes(0)) {
        prepareSalesWorkingRow(worksheet, 'SALES 0%', total.zerotaxable, type);
        prepareSalesWorkingRow(worksheet, 'CGST 0%', total.zerocgst);
        prepareSalesWorkingRow(worksheet, 'SGST 0%', total.zerosgst);
        prepareSalesWorkingRow(worksheet, 'IGST 0%', total.zeroigst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(3)) {
        prepareSalesWorkingRow(worksheet, 'SALES 3%', total.threetaxable, type);
        prepareSalesWorkingRow(worksheet, 'CGST 3%', total.threecgst);
        prepareSalesWorkingRow(worksheet, 'SGST 3%', total.threesgst);
        prepareSalesWorkingRow(worksheet, 'IGST 3%', total.threeigst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(5)) {
        prepareSalesWorkingRow(worksheet, 'SALES 5%', total.fivetaxable, type);
        prepareSalesWorkingRow(worksheet, 'CGST 5%', total.fivecgst);
        prepareSalesWorkingRow(worksheet, 'SGST 5%', total.fivesgst);
        prepareSalesWorkingRow(worksheet, 'IGST 5%', total.fiveigst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(12)) {
        prepareSalesWorkingRow(
          worksheet,
          'SALES 12%',
          total.twelvetaxable,
          type
        );
        prepareSalesWorkingRow(worksheet, 'CGST 12%', total.twelvecgst);
        prepareSalesWorkingRow(worksheet, 'SGST 12%', total.twelvesgst);
        prepareSalesWorkingRow(worksheet, 'IGST 12%', total.twelveigst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(18)) {
        prepareSalesWorkingRow(
          worksheet,
          'SALES 18%',
          total.eighteentaxable,
          type
        );
        prepareSalesWorkingRow(worksheet, 'CGST 18%', total.eighteencgst);
        prepareSalesWorkingRow(worksheet, 'SGST 18%', total.eighteensgst);
        prepareSalesWorkingRow(worksheet, 'IGST 18%', total.eighteensgst);
        totalRowsDrawn += 4;
      }

      if (auditSettings.taxApplicability.includes(28)) {
        prepareSalesWorkingRow(
          worksheet,
          'SALES 28%',
          total.twentyeighttaxable,
          type
        );
        prepareSalesWorkingRow(worksheet, 'CGST 28%', total.twentyeightcgst);
        prepareSalesWorkingRow(worksheet, 'SGST 28%', total.twentyeightsgst);
        prepareSalesWorkingRow(worksheet, 'IGST 28%', total.twentyeightigst);
        totalRowsDrawn += 4;
      }
    }

    return totalRowsDrawn;
  };

  const preparePaymentsWorkingRow = (worksheet, title, value, type) => {
    const row = worksheet.addRow({});
    if (type) {
      if (type === 'B2BA') {
        row.getCell('originaldate').value = type;
        row.getCell('originaldate').font = {
          bold: true
        };
      } else {
        row.getCell('date').value = type;
        row.getCell('date').font = {
          bold: true
        };
      }
    }

    row.getCell('customerName').value = title;
    row.getCell('customerName').font = {
      bold: true
    };
    row.getCell('gstin').value = value;
    row.getCell('gstin').font = {
      bold: true
    };
  };

  const prepareSalesWorkingRow = (worksheet, title, value, type) => {
    const row = worksheet.addRow({});

    if (type) {
      row.getCell('date').value = type;
      row.getCell('date').font = {
        bold: true
      };
    }
    row.getCell('invoiceNumber').value = '';
    row.getCell('customerName').value = title;
    row.getCell('customerName').font = {
      bold: true
    };
    row.getCell('gstin').value = '';
    row.getCell('placeOfSupply').value = '';
    row.getCell('invoiceValue').value = value;
    row.getCell('invoiceValue').font = {
      bold: true
    };
  };

  const prepareDataRow = (
    newRow,
    rowData,
    totalGST,
    auditSettingsExists,
    defaultState,
    type
  ) => {
    // Set values for the specific row (1-based index)
    newRow.getCell('invoiceNumber').value = rowData.sequenceNumber;
    newRow.getCell('date').value = formatDownloadExcelDate(
      rowData.invoice_date
    );
    if (type && type === 'B2BA') {
      newRow.getCell('invoiceNumber').value = rowData.sequenceNumber;
      newRow.getCell('date').value = formatDownloadExcelDate(
        rowData.amendmentDate
      );
      newRow.getCell('originalinvoiceNumber').value = rowData.sequenceNumber;
      newRow.getCell('originaldate').value = formatDownloadExcelDate(
        rowData.invoice_date
      );
    }
    newRow.getCell('customerName').value = rowData.customer_name;
    newRow.getCell('gstin').value = rowData.customerGSTNo;
    newRow.getCell('placeOfSupply').value = rowData.place_of_supply
      ? rowData.place_of_supply
      : defaultState
      ? defaultState.val
      : '';
    newRow.getCell('invoiceValue').value = parseFloat(
      rowData.total_amount || 0
    );

    // To add dynamic GST data
    if (auditSettingsExists) {
      if (auditSettings.taxApplicability.includes(0)) {
        newRow.getCell('zerotaxable').value = parseFloat(
          rowData.taxable_zero || 0
        );
        newRow.getCell('zerosgst').value = parseFloat(
          rowData.sgst_amount_zero || 0
        );
        newRow.getCell('zerocgst').value = parseFloat(
          rowData.cgst_amount_zero || 0
        );
        newRow.getCell('zeroigst').value = parseFloat(
          rowData.igst_amount_zero || 0
        );
      }

      if (auditSettings.taxApplicability.includes(3)) {
        newRow.getCell('threetaxable').value = parseFloat(
          rowData.taxable_three || 0
        );
        newRow.getCell('threesgst').value = parseFloat(
          rowData.sgst_amount_three || 0
        );
        newRow.getCell('threecgst').value = parseFloat(
          rowData.cgst_amount_three || 0
        );
        newRow.getCell('threeigst').value = parseFloat(
          rowData.igst_amount_three || 0
        );
      }

      if (auditSettings.taxApplicability.includes(5)) {
        newRow.getCell('fivetaxable').value = parseFloat(
          rowData.taxable_five || 0
        );
        newRow.getCell('fivesgst').value = parseFloat(
          rowData.sgst_amount_five || 0
        );
        newRow.getCell('fivecgst').value = parseFloat(
          rowData.cgst_amount_five || 0
        );
        newRow.getCell('fiveigst').value = parseFloat(
          rowData.igst_amount_five || 0
        );
      }

      if (auditSettings.taxApplicability.includes(12)) {
        newRow.getCell('twelvetaxable').value = parseFloat(
          rowData.taxable_twelve || 0
        );
        newRow.getCell('twelvesgst').value = parseFloat(
          rowData.sgst_amount_twelve || 0
        );
        newRow.getCell('twelvecgst').value = parseFloat(
          rowData.cgst_amount_twelve || 0
        );
        newRow.getCell('twelveigst').value = parseFloat(
          rowData.igst_amount_twelve || 0
        );
      }

      if (auditSettings.taxApplicability.includes(18)) {
        newRow.getCell('eighteentaxable').value = parseFloat(
          rowData.taxable_eighteen || 0
        );
        newRow.getCell('eighteensgst').value = parseFloat(
          rowData.sgst_amount_eighteen || 0
        );
        newRow.getCell('eighteencgst').value = parseFloat(
          rowData.cgst_amount_eighteen || 0
        );
        newRow.getCell('eighteenigst').value = parseFloat(
          rowData.igst_amount_eighteen || 0
        );
      }

      if (auditSettings.taxApplicability.includes(28)) {
        newRow.getCell('twentyeighttaxable').value = parseFloat(
          rowData.taxable_twenty_eight || 0
        );
        newRow.getCell('twentyeightsgst').value = parseFloat(
          rowData.sgst_amount_twenty_eight || 0
        );
        newRow.getCell('twentyeightcgst').value = parseFloat(
          rowData.cgst_amount_twenty_eight || 0
        );
        newRow.getCell('twentyeightigst').value = parseFloat(
          rowData.igst_amount_twenty_eight || 0
        );
      }
    }

    newRow.getCell('roundOff').value = parseFloat(rowData.round_amount || 0);
    newRow.getCell('cash').value = parseFloat(rowData.cash || 0);
    newRow.getCell('creditNote').value = parseFloat(rowData.creditNote || 0);
    newRow.getCell('upi').value = parseFloat(rowData.upi || 0);
    newRow.getCell('card').value = parseFloat(rowData.card || 0);
    newRow.getCell('neft').value = parseFloat(rowData.netBanking || 0);
    newRow.getCell('cheque').value = parseFloat(rowData.cheque || 0);
    newRow.getCell('giftCard').value = parseFloat(rowData.giftCard || 0);
    newRow.getCell('customFinance').value = parseFloat(
      rowData.customFinance || 0
    );
    newRow.getCell('exchange').value = parseFloat(rowData.exchange || 0);
    newRow.getCell('balanceDue').value = parseFloat(
      rowData.balance_amount || 0
    );

    newRow.getCell('irn').value = rowData.irnNo;
    newRow.getCell('eway').value = rowData.ewayBillNo;
    newRow.getCell('dueDate').value = formatDownloadExcelDate(rowData.dueDate);

    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      newRow.getCell('grossWeight').value = getGrossWeight(rowData);
      newRow.getCell('wastage').value = getWastage(rowData);
      newRow.getCell('netWeight').value = getNetWeight(rowData);
      newRow.getCell('makingCharge').value = getMakingCharge(rowData);
      newRow.getCell('makingChargePerGram').value =
        getMakingChargePerGram(rowData);
    }

    newRow.getCell('totalDisc').value = getTotalDiscount(rowData);
    newRow.getCell('totalBillDisc').value = rowData.discount_amount;

    if (
      (rowData.isCancelled && rowData.isCancelled === true) ||
      rowData.einvoiceBillStatus === 'Cancelled'
    ) {
      // do nothing..skip the row
    } else {
      totalGST.invoiceValue += parseFloat(rowData.total_amount || 0);
      totalGST.zerotaxable += parseFloat(rowData.taxable_zero || 0);
      totalGST.zerosgst += parseFloat(rowData.sgst_amount_zero || 0);
      totalGST.zerocgst += parseFloat(rowData.cgst_amount_zero || 0);
      totalGST.zeroigst += parseFloat(rowData.igst_amount_zero || 0);
      totalGST.threetaxable += parseFloat(rowData.taxable_three || 0);
      totalGST.threesgst += parseFloat(rowData.sgst_amount_three || 0);
      totalGST.threecgst += parseFloat(rowData.cgst_amount_three || 0);
      totalGST.threeigst += parseFloat(rowData.igst_amount_three || 0);
      totalGST.fivetaxable += parseFloat(rowData.taxable_five || 0);
      totalGST.fivesgst += parseFloat(rowData.sgst_amount_five || 0);
      totalGST.fivecgst += parseFloat(rowData.cgst_amount_five || 0);
      totalGST.fiveigst += parseFloat(rowData.igst_amount_five || 0);
      totalGST.twelvetaxable += parseFloat(rowData.taxable_twelve || 0);
      totalGST.twelvesgst += parseFloat(rowData.sgst_amount_twelve || 0);
      totalGST.twelvecgst += parseFloat(rowData.cgst_amount_twelve || 0);
      totalGST.twelveigst += parseFloat(rowData.igst_amount_twelve || 0);
      totalGST.eighteentaxable += parseFloat(rowData.taxable_eighteen || 0);
      totalGST.eighteensgst += parseFloat(rowData.sgst_amount_eighteen || 0);
      totalGST.eighteencgst += parseFloat(rowData.cgst_amount_eighteen || 0);
      totalGST.eighteenigst += parseFloat(rowData.igst_amount_eighteen || 0);
      totalGST.twentyeighttaxable += parseFloat(
        rowData.taxable_twenty_eight || 0
      );
      totalGST.twentyeightsgst += parseFloat(
        rowData.sgst_amount_twenty_eight || 0
      );
      totalGST.twentyeightcgst += parseFloat(
        rowData.cgst_amount_twenty_eight || 0
      );
      totalGST.twentyeightigst += parseFloat(
        rowData.igst_amount_twenty_eight || 0
      );

      totalGST.roundoff += parseFloat(rowData.round_amount || 0);
      totalGST.cash += parseFloat(rowData.cash || 0);
      totalGST.creditnote += parseFloat(rowData.creditNote || 0);
      totalGST.upi += parseFloat(rowData.upi || 0);
      totalGST.card += parseFloat(rowData.card || 0);
      totalGST.neft += parseFloat(rowData.netBanking || 0);
      totalGST.cheque += parseFloat(rowData.cheque || 0);
      totalGST.giftcard += parseFloat(rowData.giftCard || 0);
      totalGST.customfinance += parseFloat(rowData.customFinance || 0);
      totalGST.exchange += parseFloat(rowData.exchange || 0);
      totalGST.balancedue += parseFloat(rowData.balance_amount || 0);
      totalGST.itemdisc += getTotalDiscount(rowData);
      totalGST.billdisc += parseFloat(rowData.discount_amount).toFixed(2);
    }
  };

  const prepareSalesReturnDataRow = (
    newRow,
    rowData,
    totalGST,
    auditSettingsExists,
    defaultState
  ) => {
    // Set values for the specific row (1-based index)
    newRow.getCell('invoiceNumber').value = rowData.sequenceNumber;
    newRow.getCell('date').value = formatDownloadExcelDate(
      rowData.invoice_date
    );
    newRow.getCell('customerName').value = rowData.customer_name;
    newRow.getCell('gstin').value = rowData.customerGSTNo;
    newRow.getCell('placeOfSupply').value = rowData.place_of_supply
      ? rowData.place_of_supply
      : defaultState
      ? defaultState.val
      : '';
    newRow.getCell('invoiceValue').value = parseFloat(
      rowData.total_amount || 0
    );

    // To add dynamic GST data
    if (auditSettingsExists) {
      if (auditSettings.taxApplicability.includes(0)) {
        newRow.getCell('zerotaxable').value = parseFloat(
          rowData.taxable_zero || 0
        );
        newRow.getCell('zerosgst').value = parseFloat(
          rowData.sgst_amount_zero || 0
        );
        newRow.getCell('zerocgst').value = parseFloat(
          rowData.cgst_amount_zero || 0
        );
        newRow.getCell('zeroigst').value = parseFloat(
          rowData.igst_amount_zero || 0
        );
      }

      if (auditSettings.taxApplicability.includes(3)) {
        newRow.getCell('threetaxable').value = parseFloat(
          rowData.taxable_three || 0
        );
        newRow.getCell('threesgst').value = parseFloat(
          rowData.sgst_amount_three || 0
        );
        newRow.getCell('threecgst').value = parseFloat(
          rowData.cgst_amount_three || 0
        );
        newRow.getCell('threeigst').value = parseFloat(
          rowData.igst_amount_three || 0
        );
      }

      if (auditSettings.taxApplicability.includes(5)) {
        newRow.getCell('fivetaxable').value = parseFloat(
          rowData.taxable_five || 0
        );
        newRow.getCell('fivesgst').value = parseFloat(
          rowData.sgst_amount_five || 0
        );
        newRow.getCell('fivecgst').value = parseFloat(
          rowData.cgst_amount_five || 0
        );
        newRow.getCell('fiveigst').value = parseFloat(
          rowData.igst_amount_five || 0
        );
      }

      if (auditSettings.taxApplicability.includes(12)) {
        newRow.getCell('twelvetaxable').value = parseFloat(
          rowData.taxable_twelve || 0
        );
        newRow.getCell('twelvesgst').value = parseFloat(
          rowData.sgst_amount_twelve || 0
        );
        newRow.getCell('twelvecgst').value = parseFloat(
          rowData.cgst_amount_twelve || 0
        );
        newRow.getCell('twelveigst').value = parseFloat(
          rowData.igst_amount_twelve || 0
        );
      }

      if (auditSettings.taxApplicability.includes(18)) {
        newRow.getCell('eighteentaxable').value = parseFloat(
          rowData.taxable_eighteen || 0
        );
        newRow.getCell('eighteensgst').value = parseFloat(
          rowData.sgst_amount_eighteen || 0
        );
        newRow.getCell('eighteencgst').value = parseFloat(
          rowData.cgst_amount_eighteen || 0
        );
        newRow.getCell('eighteenigst').value = parseFloat(
          rowData.igst_amount_eighteen || 0
        );
      }

      if (auditSettings.taxApplicability.includes(28)) {
        newRow.getCell('twentyeighttaxable').value = parseFloat(
          rowData.taxable_twenty_eight || 0
        );
        newRow.getCell('twentyeightsgst').value = parseFloat(
          rowData.sgst_amount_twenty_eight || 0
        );
        newRow.getCell('twentyeightcgst').value = parseFloat(
          rowData.cgst_amount_twenty_eight || 0
        );
        newRow.getCell('twentyeightigst').value = parseFloat(
          rowData.igst_amount_twenty_eight || 0
        );
      }
    }

    newRow.getCell('saleInvNo').value = rowData.saleSequenceNumber;
    newRow.getCell('saleInvDate').value = rowData.invoice_date;
    newRow.getCell('saleInvValue').value = parseFloat(
      rowData.saleTotalAmount || 0
    );

    newRow.getCell('roundOff').value = parseFloat(rowData.round_amount || 0);
    newRow.getCell('cash').value = parseFloat(rowData.cash || 0);
    newRow.getCell('saleAdjust').value = parseFloat(rowData.creditNote || 0);
    newRow.getCell('upi').value = parseFloat(rowData.upi || 0);
    newRow.getCell('card').value = parseFloat(rowData.card || 0);
    newRow.getCell('neft').value = parseFloat(rowData.netBanking || 0);
    newRow.getCell('cheque').value = parseFloat(rowData.cheque || 0);
    newRow.getCell('giftCard').value = parseFloat(rowData.giftCard || 0);
    newRow.getCell('customFinance').value = parseFloat(
      rowData.customFinance || 0
    );
    newRow.getCell('balanceDue').value = parseFloat(
      rowData.balance_amount || 0
    );

    newRow.getCell('irn').value = rowData.irnNo;
    newRow.getCell('eway').value = rowData.ewayBillNo;
    newRow.getCell('dueDate').value = formatDownloadExcelDate(rowData.dueDate);

    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      newRow.getCell('grossWeight').value = getGrossWeight(rowData);
      newRow.getCell('wastage').value = getWastage(rowData);
      newRow.getCell('netWeight').value = getNetWeight(rowData);
      newRow.getCell('makingCharge').value = getMakingCharge(rowData);
      newRow.getCell('makingChargePerGram').value =
        getMakingChargePerGram(rowData);
    }

    newRow.getCell('totalDisc').value = getTotalDiscount(rowData);
    newRow.getCell('totalBillDisc').value = rowData.discount_amount;

    if (
      (rowData.isCancelled && rowData.isCancelled === true) ||
      rowData.einvoiceBillStatus === 'Cancelled'
    ) {
      // do nothing
    } else {
      totalGST.invoiceValue += parseFloat(rowData.total_amount || 0);

      totalGST.zerotaxable += parseFloat(rowData.taxable_zero || 0);
      totalGST.zerosgst += parseFloat(rowData.sgst_amount_zero || 0);
      totalGST.zerocgst += parseFloat(rowData.cgst_amount_zero || 0);
      totalGST.zeroigst += parseFloat(rowData.igst_amount_zero || 0);
      totalGST.threetaxable += parseFloat(rowData.taxable_three || 0);
      totalGST.threesgst += parseFloat(rowData.sgst_amount_three || 0);
      totalGST.threecgst += parseFloat(rowData.cgst_amount_three || 0);
      totalGST.threeigst += parseFloat(rowData.igst_amount_three || 0);
      totalGST.fivetaxable += parseFloat(rowData.taxable_five || 0);
      totalGST.fivesgst += parseFloat(rowData.sgst_amount_five || 0);
      totalGST.fivecgst += parseFloat(rowData.cgst_amount_five || 0);
      totalGST.fiveigst += parseFloat(rowData.igst_amount_five || 0);
      totalGST.twelvetaxable += parseFloat(rowData.taxable_twelve || 0);
      totalGST.twelvesgst += parseFloat(rowData.sgst_amount_twelve || 0);
      totalGST.twelvecgst += parseFloat(rowData.cgst_amount_twelve || 0);
      totalGST.twelveigst += parseFloat(rowData.igst_amount_twelve || 0);
      totalGST.eighteentaxable += parseFloat(rowData.taxable_eighteen || 0);
      totalGST.eighteensgst += parseFloat(rowData.sgst_amount_eighteen || 0);
      totalGST.eighteencgst += parseFloat(rowData.cgst_amount_eighteen || 0);
      totalGST.eighteenigst += parseFloat(rowData.igst_amount_eighteen || 0);
      totalGST.twentyeighttaxable += parseFloat(
        rowData.taxable_twenty_eight || 0
      );
      totalGST.twentyeightsgst += parseFloat(
        rowData.sgst_amount_twenty_eight || 0
      );
      totalGST.twentyeightcgst += parseFloat(
        rowData.cgst_amount_twenty_eight || 0
      );
      totalGST.twentyeightigst += parseFloat(
        rowData.igst_amount_twenty_eight || 0
      );
      totalGST.roundoff += parseFloat(rowData.round_amount || 0);
      totalGST.cash += parseFloat(rowData.cash || 0);
      totalGST.creditnote += parseFloat(rowData.creditNote || 0);
      totalGST.upi += parseFloat(rowData.upi || 0);
      totalGST.card += parseFloat(rowData.card || 0);
      totalGST.neft += parseFloat(rowData.netBanking || 0);
      totalGST.cheque += parseFloat(rowData.cheque || 0);
      totalGST.giftcard += parseFloat(rowData.giftCard || 0);
      totalGST.customfinance += parseFloat(rowData.customFinance || 0);
      totalGST.balancedue += parseFloat(rowData.balance_amount || 0);
      totalGST.itemdisc += getTotalDiscount(rowData);
      totalGST.billdisc += parseFloat(rowData.discount_amount).toFixed(2);
    }
  };

  const prepareTotalRow = (
    totalRow,
    totalGST,
    auditSettingsExists,
    totalName,
    isSalesReturn,
    type
  ) => {
    totalRow.getCell('customerName').value = totalName;
    totalRow.getCell('invoiceValue').value = totalGST.invoiceValue;

    if (auditSettingsExists) {
      if (auditSettings.taxApplicability.includes(0)) {
        totalRow.getCell('zerotaxable').value = totalGST.zerotaxable;
        totalRow.getCell('zerosgst').value = totalGST.zerotaxable;
        totalRow.getCell('zerocgst').value = totalGST.zerocgst;
        totalRow.getCell('zeroigst').value = totalGST.zeroigst;
      }

      if (auditSettings.taxApplicability.includes(3)) {
        totalRow.getCell('threetaxable').value = totalGST.threetaxable;
        totalRow.getCell('threesgst').value = totalGST.threesgst;
        totalRow.getCell('threecgst').value = totalGST.threecgst;
        totalRow.getCell('threeigst').value = totalGST.threeigst;
      }

      if (auditSettings.taxApplicability.includes(5)) {
        totalRow.getCell('fivetaxable').value = totalGST.fivetaxable;
        totalRow.getCell('fivesgst').value = totalGST.fivesgst;
        totalRow.getCell('fivecgst').value = totalGST.fivecgst;
        totalRow.getCell('fiveigst').value = totalGST.fiveigst;
      }

      if (auditSettings.taxApplicability.includes(12)) {
        totalRow.getCell('twelvetaxable').value = totalGST.twelvetaxable;
        totalRow.getCell('twelvesgst').value = totalGST.twelvesgst;
        totalRow.getCell('twelvecgst').value = totalGST.twelvecgst;
        totalRow.getCell('twelveigst').value = totalGST.twelveigst;
      }

      if (auditSettings.taxApplicability.includes(18)) {
        totalRow.getCell('eighteentaxable').value = totalGST.eighteentaxable;
        totalRow.getCell('eighteensgst').value = totalGST.eighteensgst;
        totalRow.getCell('eighteencgst').value = totalGST.eighteencgst;
        totalRow.getCell('eighteenigst').value = totalGST.eighteenigst;
      }

      if (auditSettings.taxApplicability.includes(28)) {
        totalRow.getCell('twentyeighttaxable').value =
          totalGST.twentyeighttaxable;
        totalRow.getCell('twentyeightsgst').value = totalGST.twentyeightsgst;
        totalRow.getCell('twentyeightcgst').value = totalGST.twentyeightcgst;
        totalRow.getCell('twentyeightigst').value = totalGST.twentyeightigst;
      }
    }

    totalRow.getCell('roundOff').value = parseFloat(totalGST.roundoff || 0);
    totalRow.getCell('cash').value = parseFloat(totalGST.cash || 0);
    if (isSalesReturn) {
      totalRow.getCell('saleAdjust').value = parseFloat(
        totalGST.creditnote || 0
      );
    } else {
      totalRow.getCell('creditNote').value = parseFloat(
        totalGST.creditnote || 0
      );
    }
    totalRow.getCell('upi').value = parseFloat(totalGST.upi || 0);
    totalRow.getCell('card').value = parseFloat(totalGST.card || 0);
    totalRow.getCell('neft').value = parseFloat(totalGST.neft || 0);
    totalRow.getCell('cheque').value = parseFloat(totalGST.cheque || 0);
    totalRow.getCell('giftCard').value = parseFloat(totalGST.giftcard || 0);
    totalRow.getCell('customFinance').value = parseFloat(
      totalGST.customfinance || 0
    );
    if (!isSalesReturn) {
      totalRow.getCell('exchange').value = parseFloat(totalGST.exchange || 0);
    }
    totalRow.getCell('balanceDue').value = parseFloat(totalGST.balancedue || 0);

    totalRow.getCell('totalDisc').value = parseFloat(totalGST.itemdisc || 0);
    totalRow.getCell('totalBillDisc').value = parseFloat(
      totalGST.billdisc || 0
    );

    totalRow.font = { bold: true };
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' }
      };
    });
  };

  const prepareSubtitle = (title, worksheet, rowNumber, color) => {
    // Define the header
    const header = title;

    let cellNumber = 1;

    worksheet.getRow(rowNumber + 1).getCell(cellNumber).value = header;
    worksheet.getRow(rowNumber + 1).getCell(cellNumber).font = {
      bold: true,
      size: 14
    };

    worksheet.getRow(rowNumber + 1).getCell(cellNumber).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };
    worksheet.getRow(rowNumber + 1).getCell(cellNumber + 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };
    worksheet.getRow(rowNumber + 1).getCell(cellNumber + 1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: color }
    };
  };

  // Function to apply color to a specific row
  function applyColorToRow(worksheet, row, color) {
    row.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: color }
      };
    });
  }

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div style={{ minHeight: height - 125 }}>
          {isFeatureAvailable ? (
            <>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    GSTR-1 Online Filing
                  </Typography>
                </div>
              </div>

              <div>
                <Grid
                  container
                  style={{ minHeight: height - 125 }}
                  className={classes.categoryActionWrapper}
                >
                  {!filter && (
                    <Grid xs={12} className={classes.centerDiv}>
                      <Grid
                        item
                        xs={6}
                        style={{
                          border: '1px solid #cacaca',
                          padding: '20px',
                          justifyContent: 'center'
                        }}
                      >
                        <div className={classes.filterSection}>
                          <Typography gutterBottom variant="h6" component="h6">
                            Choose Date Range
                          </Typography>
                        </div>
                        <div className={classes.filterSection}>
                          <form className={classes.blockLine} noValidate>
                            <FormControl component="fieldset">
                              <Typography component="subtitle1" variant="h5">
                                Select Financial Year
                              </Typography>
                              <Select
                                value={financialYear}
                                className="customTextField"
                                onChange={(e) => {
                                  setFinancialYear(e.target.value);
                                }}
                              >
                                <MenuItem value={2023}>2023-2024</MenuItem>
                                <MenuItem value={2024}>2024-2025</MenuItem>
                                <MenuItem value={2025}>2025-2026</MenuItem>
                              </Select>
                            </FormControl>
                          </form>
                          <form className={classes.blockLine} noValidate>
                            <FormControl component="fieldset">
                              <Typography component="subtitle1" variant="h5">
                                Select Month
                              </Typography>
                              <Select
                                value={financialMonth}
                                className="customTextField"
                                onChange={(e) => {
                                  setFinancialMonth(e.target.value);
                                }}
                              >
                                {months.map((month) => (
                                  <MenuItem value={month.value}>
                                    {month.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </form>
                        </div>
                        <div className={classes.filterSectionBtn}>
                          <Button
                            onClick={viewSummary}
                            className={classes.filterBtn}
                          >
                            View Summary
                          </Button>
                          <Button
                            onClick={(e) => {
                              proceedToFetchData();
                            }}
                            className={classes.filterBtn}
                          >
                            Proceed To File
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  )}

                  {filter && (
                    <Grid item xs={12}>
                      <div className={classes.centerStartEnd}>
                        <div style={{ marginLeft: '10px' }}>
                          {reviewStep === 2 ? (
                            <Button
                              color="secondary"
                              onClick={() => updateReviewStep(1)}
                              className={classes.filterBtn}
                            >
                              Back
                            </Button>
                          ) : (
                            <Button
                              color="secondary"
                              onClick={() => {
                                setFilter(false);
                                prepareGSTR1OnlineData(false);
                                proceedToOnlineFilingScreen(false);
                                setIsSaved(false);
                                setFiled(false);
                              }}
                              className={classes.filterBtn}
                            >
                              Back to Filter
                            </Button>
                          )}
                        </div>
                        {!isFiled &&
                          !proceedToOnlineFiling &&
                          reviewStep == 1 &&
                          !isSaved && (
                            <div style={{ marginRight: '10px' }}>
                              <Button
                                className={`${classes.filterBtn}`}
                                onClick={(e) => proceedtoUpload()}
                                style={{ float: 'right' }}
                              >
                                Proceed Online
                              </Button>
                              <Button
                                className={classes.filterBtn}
                                onClick={(e) => downloadJson()}
                                style={{ float: 'right', marginRight: '10px' }}
                              >
                                Download JSON
                              </Button>
                              <Button
                                className={classes.filterBtn}
                                onClick={(e) => getExcelDataNew()}
                                style={{ float: 'right', marginRight: '10px' }}
                              >
                                Download Excel
                              </Button>
                            </div>
                          )}
                      </div>

                      <div style={{ marginTop: '16px' }}>
                        {isFiled ? (
                          <GSTR1ReturnSummaryPage />
                        ) : !isFiled && isSaved ? (
                          <GSTR1OnlinePortal />
                        ) : (
                          <GSTR1ReviewDataStep1 />
                        )}
                      </div>
                    </Grid>
                  )}
                </Grid>
              </div>
            </>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      <Dialog
        fullScreen={fullScreen}
        open={loader}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>{loaderMsg}</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      {openErrorMesssageDialog && <GSTError />}
    </div>
  );
};

export default injectWithObserver(GSTR1OnlineFiling);