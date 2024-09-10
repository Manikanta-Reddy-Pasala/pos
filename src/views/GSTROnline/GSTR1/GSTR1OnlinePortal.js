import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Grid,
  withStyles,
  IconButton,
  Typography,
  FormControl,
  TextField,
  Button,
  Card
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import styled, { css } from 'styled-components';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { Col } from 'react-flexbox-grid';
import useWindowDimensions from '../../../components/windowDimension';

import {
  generateOTP,
  validateOTP,
  validateSession,
  saveGSTR1API,
  resetGSTR1API,
  saveValidateAPI,
  fileValidateAPI,
  downloadGSTR1API,
  retStatusAPI,
  proceedToEvcOtpAPI,
  proceedToFileEVCAPI,
  returnsValidateAPI,
  checkGstr1DataAvailableAPI,
  isGSTRFiled,
  proceedToFileAPI,
  filedSummaryTotal
} from 'src/components/Helpers/GstrOnlineHelper';
import { toJS } from 'mobx';
import {
  getSelectedDateMonthAndYearMMYYYY,
  getSelectedMonthAndYearMMYYYY
} from 'src/components/Helpers/DateHelper';
import GSTError from '../GSTError';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    padding: 'inherit',
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '& .secondary-images': {
        '& button': {
          marginRight: theme.spacing(2)
        }
      }
    }
  },
  '& .grid-select': {
    selectedOption: {
      color: 'red'
    },
    marginLeft: '15px',
    '& .MuiFormControl-root': {
      width: '100%'
    },
    fullWidth: {
      width: '100%'
    }
  },

  itemTable: {
    width: '100%'
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
  },
  listli: {
    borderBottom: '1px solid #c5c4c4',
    paddingBottom: 10,
    marginBottom: 12,
    background: 'none'
  },
  listHeaderBox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 0px 30px'
  },
  listbox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 30px 30px',

    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    }
  },
  activeClass: {
    backgroundColor: '#2977f5',
    color: 'white'
  },
  content: {
    cursor: 'pointer'
  },
  w_30: {
    width: '30%',
    display: 'inline-flex'
  },
  step1: {
    width: '98%',
    margin: 'auto',
    backgroundColor: 'white',
    marginBottom: '2%'
  },
  step2: {
    width: '100%',
    margin: 'auto'
    // backgroundColor: '#d8cac01f',
    // marginBottom: '2%'
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
    width: '100%',
    fontSize: '12px'
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
    left: '0',
    width: '100%',
    color: '#fff',
    overflowX: 'hidden',
    position: 'fixed',
    textAlign: 'center',
    zIndex: '0',
    padding: '10px',
    backgroundColor: '#f8f8f8'
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
  rowBtn: {
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    }
  },
  wFull: {
    width: '97%',
    margin: 'auto',
    padding: '5px'
  },
  retFont: {
    fontSize: '14px',
    color: 'darkblue',
    fontWeight: 'bold'
  },
  resendOTP:{
    color:'#f44336',
    textAlign:'right',
    cursor:'pointer',
    fontSize: '13px',
    fontWeight: 'bold'
  }
}));
const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '22px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const gray = '#8080804d';
const darkgray = '#808080bf';
const blue = '#FF6666';
const white = '#DBF1FF';

const ProgressBar = styled.ol`
  margin: 0 auto;
  padding: 0em 0 2em;
  list-style: none;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const ProgressBarStep = styled.li`
  text-align: center;
  position: relative;
  width: 100%;

  &:before,
  &:after {
    content: '';
    height: 0.3em;
    background-color: ${gray};
    position: absolute;
    z-index: 1;
    width: 100%;
    left: -50%;
    top: 43%;
    transform: translateY(-50%);
    transition: all 1s ease-out;
  }

  &:first-child:before,
  &:first-child:after {
    display: none;
  }

  &:after {
    background-color: ${blue};
    width: 0%;
  }

  &.is-complete + &.is-current:after,
  &.is-complete + &.is-complete:after {
    width: 100%;
  }
`;

const ProgressBarIcon = styled.svg`
  width: 1.5em;
  height: 1.5em;
  background-color: ${darkgray};
  fill: ${darkgray};
  border-radius: 50%;
  padding: 0.5em;
  max-width: 100%;
  z-index: 10;
  position: relative;
  transition: all 1.75s ease-out;

  ${ProgressBarStep}.is-current & {
    fill: ${blue};
    background-color: ${blue};
  }

  ${ProgressBarStep}.is-complete & {
    fill: ${white};
    background-color: ${blue};
  }

  .is-complete & {
    fill: ${white};
    background-color: ${blue};
  }
`;

const ProgressBarStepLabel = styled.span`
  display: block;
  font-weight: bold;
  text-transform: uppercase;
  color: ${gray};
  position: absolute;
  padding-top: 0.5em;
  width: 100%;
  font-size: 12px;
  transition: all 1s ease-out;

  ${ProgressBarStep}.is-current > &,
  ${ProgressBarStep}.is-complete > & {
    color: ${blue};
  }
`;

const GSTR1OnlinePortal = (props) => {
  const myRef = useRef(null);
  const classes = useStyles();
  const stores = useStore();
  const [username, setUsername] = useState('');
  const [active, setActive] = useState('B2B Invoices');
  const [otp, setOtp] = useState('');
  const [pan, setPAN] = useState('');
  const [evcotp, setEvcOtp] = useState('');
  const [finalStep, setFinalStep] = useState(1);
  const [confirmSummary, setConfirmSummary] = useState(false);
  const [moreVisibility, setMoreVisibility] = useState({});
  const [downloadData, setDownloadData] = useState();
  const [downloadDataJson, setDownloadDataJson] = useState();
  const [loader, setLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  // const [taxData, setTaxData] = useState({});
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { height } = useWindowDimensions();

  const summaryTitles = [
    {
      label: 'B2B Invoices',
      value: 'b2b'
    },
    {
      label: 'B2B E-Invoices (In Portal)',
      value: 'b2beinv'
    },
    {
      label: 'B2BA',
      value: 'b2ba'
    },
    {
      label: 'B2CL',
      value: 'b2cl'
    },
    {
      label: 'B2CLA',
      value: 'b2cla'
    },
    {
      label: 'B2CS',
      value: 'b2cs'
    },
    {
      label: 'B2CSA',
      value: 'b2csa'
    },
    {
      label: 'CDNR',
      value: 'cdnr'
    },
    {
      label: 'CDNRA',
      value: 'cdnra'
    },
    {
      label: 'CDNUR',
      value: 'cdnur'
    },
    {
      label: 'CDNURA',
      value: 'cdnura'
    },
    {
      label: 'EXP',
      value: 'exp'
    },
    {
      label: 'EXPA',
      value: 'expa'
    },
    {
      label: 'NIL',
      value: 'nil'
    }
  ];

  const retSumTitles = {
    B2B_4A:
      '4A - Taxable outward supplies made to registered persons (other than reverse charge supplies) including supplies made through e-commerce operator attracting TCS - B2B Regular',
    B2B_4B:
      '4B - Taxable outward supplies made to registered persons attracting tax on reverse charge - B2B Reverse charge',
    B2CL: '5 - Taxable outward inter-state supplies made to unregistered persons (where invoice value is more than Rs.2.5 lakh) including supplies made through e-commerce operator, rate wise - B2CL (Large)',
    EXP: '6A - Exports',
    B2B_SEZWOP: '6B - Supplies made to SEZ unit or SEZ developer - SEZWOP',
    B2B_SEZWP: '6B - Supplies made to SEZ unit or SEZ developer - SEZWP',
    B2B_6C: '6C - Deemed Exports - DE',
    B2CS: '7- Taxable supplies (Net of debit and credit notes) to unregistered persons (other than the supplies covered in Table 5) including supplies made through e-commerce operator attracting TCS - B2CS (Others)',
    NIL: '8 - Nil rated, exempted and non GST outward supplies',
    B2BA_4A:
      '9A - Amendment to taxable outward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Regular',
    B2BA_4B:
      '9A - Amendment to taxableoutward supplies made to registered person in returns of earlier tax periods in table 4 - B2B Reverse charge',
    EXPA: '9A - Amendment to Export supplies in returns of earlier tax periods in table 6A (EXPWP/EXPWOP)',
    B2BA_SEZWP:
      '9A - Amendment to supplies made to SEZ unit or SEZ developer in returns of earlier tax periods in table 6B (SEZWP)',
    B2BA_SEZWOP:
      '9A - Amendment to supplies made to SEZ unit or SEZ developer in returns of earlier tax periods in table 6B (SEZWOP)',
    CDNR: '9B - Credit/Debit Notes (Registered) - CDNR',
    CDNUR: '9B - Credit/Debit Notes (Unregistered) - CDNUR',
    CDNRA: '9C - Amended Credit/Debit Notes (Registered) - CDNRA',
    CDNURA: '9C - Amended Credit/Debit Notes (Unregistered) - CDNURA',
    B2CSA:
      '10 - Amendment to taxable outward supplies made to unregistered person in returns for earlier tax periods in table 7 including supplies made through e-commerce operator attracting TCS - B2C (Others)',
    AT: '11A(1), 11A(2) - Advances received for which invoice has not been issued (tax amount to be added to the output tax liability) (Net of refund vouchers, if any)',
    TXPD: '11B(1), 11B(2) - Advance amount received in earlier tax period and adjusted against the supplies being shown in this tax period in Table Nos. 4, 5, 6 and 7 (Net of refund vouchers, if any)',
    ATA: '11A - Amendment to advances received in returns for earlier tax periods in table 11A(1), 11A(2) (Net of refund vouchers, if any)',
    TXPDA:
      '11B - Amendment to advances adjusted in returns for earlier tax periods in table 11B(1), 11B(2) (Net of refund vouchers, if any)',
    HSN: '12 - HSN-wise summary of outward supplies',
    DOC_ISSUE: '13 - Documents issued'
  };

  const {
    gstr1UploadData,
    openErrorMesssageDialog,
    loginStep,
    financialYear,
    financialMonth,
    taxData
  } = toJS(stores.GSTR1Store);

  const {
    updateStep,
    updateGSTAuth,
    step,
    updateRetSaveReviewStep,
    handleErrorAlertOpen,
    proceedToOnlineFilingScreen,
    setLoginStep
  } = stores.GSTR1Store;
  const { getTaxSettingsDetails } = stores.TaxSettingsStore;

  const [b2b, setB2B] = useState();
  const [b2ba, setB2BA] = useState();
  const [b2cl, setB2CL] = useState();
  const [b2cla, setB2CLA] = useState();
  const [cdnr, setCDNR] = useState();
  const [b2cs, setB2CS] = useState();
  const [cdnur, setCDNUR] = useState();
  const [hsn, setHSN] = useState();
  const [doc, setDOC] = useState();
  const [b2csa, setB2CSA] = useState();
  const [cdnra, setCDNRA] = useState();
  const [cdnura, setCDNURA] = useState();
  const [nil, setNIL] = useState();

  const [sb2b, setSB2B] = useState();
  const [sb2ba, setSB2BA] = useState();
  const [sb2cl, setSB2CL] = useState();
  const [sb2cla, setSB2CLA] = useState();
  const [scdnr, setSCDNR] = useState();
  const [sb2cs, setSB2CS] = useState();
  const [scdnur, setSCDNUR] = useState();
  const [shsn, setSHSN] = useState();
  const [sdoc, setSDOC] = useState();
  const [sb2csa, setSB2CSA] = useState();
  const [genSummary, setGenSummary] = useState();
  const [totalData, setTotalData] = useState({});

  const { GSTRDateRange, retSaveReviewStep, retSaveSummary } = toJS(
    stores.GSTR1Store
  );

  const { setFiled } = stores.GSTR1Store;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (gstr1UploadData) {
      setB2B(gstr1UploadData.b2b);
      setB2CL(gstr1UploadData.b2cl);
      setCDNR(gstr1UploadData.cdnr);
      setB2CS(gstr1UploadData.b2cs);
      setCDNUR(gstr1UploadData.cdnur);
      setHSN(gstr1UploadData.hsn);
      setDOC(gstr1UploadData.doc_issue);
      setB2CSA(gstr1UploadData.b2csa);
      setB2BA(gstr1UploadData.b2ba);
      setB2CLA(gstr1UploadData.b2cla);
      setCDNRA(gstr1UploadData.cdnra);
      setCDNURA(gstr1UploadData.cdnura);
      setNIL(gstr1UploadData.nil);
    }
  }, []);

  const fetchData = async () => {
    // const tData = await getTaxSettingsDetails();
    console.log("taxData",taxData);
    // setTaxData(taxData);
    setUsername(taxData.gstPortalUserName);
    setPAN(taxData.gstPortalEvcPan);
    validateSessionCall();
    // updateGSTAuth(true);
    // checkIsFiledasync();
    // checkGstr1DataAvailable(tData);
  };

  const validateSessionCall = async () => {
    setLoaderMsg('Please wait while validating session!!!');
    setLoader(true);
    const apiResponse = await validateSession(taxData.gstin);
    if (apiResponse.code == 200) {
      if (apiResponse && apiResponse.status === 1) {
        updateGSTAuth(true);
        setLoader(false);
        checkIsFiledasync();
      } else {
        updateGSTAuth(false);
        setLoader(false);
        if (taxData.gstPortalUserName != '' && taxData.gstPortalUserName != null) {
          setLoginStep(2);
          generateOTPCall();
        }
      }
    } else {
      updateGSTAuth(false);
      setLoader(false);
      if (taxData.gstPortalUserName != '' && taxData.gstPortalUserName != null) {
        setLoginStep(2);
        generateOTPCall();
      }
    }
  };

  const checkIsFiledasync = async () => {
    setLoader(true);
    let taxData = await getTaxSettingsDetails();
    let apiResponse = await isGSTRFiled(
      taxData.gstin,
      getSelectedMonthAndYearMMYYYY(financialYear, financialMonth)
    );

    if (apiResponse && apiResponse.status === 1) {
      const respData = apiResponse.message;
      if (respData?.EFiledlist && respData.EFiledlist.length > 0) {
        respData.EFiledlist.forEach((item, index) => {
          if (item.rtntype == 'GSTR1') {
            if (item.status == 'Filed') {
              setFiled(true);
            } else {
              checkGstr1DataAvailable(taxData);
            }
          }
        });
      } else {
        checkGstr1DataAvailable(taxData);
      }
    } else {
      checkGstr1DataAvailable(taxData);
      // errorMessageCall("Something Went Wrong. Please Try Again!");
    }

    setLoader(false);
  };

  const handleLoaderAlertClose = () => {
    setLoader(false);
  };

  const errorMessageCall = (message) => {
    handleErrorAlertOpen(message);
  };

  const generateOTPCall = async () => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let reqData = {};
    reqData = {
      gstin: taxData.gstin,
      username:
        taxData.gstPortalUserName != '' && taxData.gstPortalUserName != null ? taxData.gstPortalUserName : username
    };
    const apiResponse = await generateOTP(reqData);
    if (apiResponse.code == 200) {
      if (apiResponse && apiResponse.status === 1) {
        setLoginStep(2);
      } else {
        errorMessageCall(apiResponse.message);
      }
    } else {
      errorMessageCall(apiResponse.message);
    }
    setLoader(false);
  };

  const validateOTPCall = async () => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let reqData = {};
    reqData = {
      gstin: taxData.gstin,
      otp: otp
    };
    const apiResponse = await validateOTP(reqData);
    if (apiResponse.code == 200) {
      if (apiResponse && apiResponse.status === 1) {
        updateGSTAuth(true);
        updateStep(2);
        checkIsFiledasync();
      } else {
        errorMessageCall(apiResponse.message);
      }
    } else {
      errorMessageCall(apiResponse.message);
    }
    setLoader(false);
  };

  const checkGstr1DataAvailable = async (dataG) => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let reqData = {};
    reqData = {
      gstin: dataG.gstin,
      fp: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate)
    };
    const apiResponse = await checkGstr1DataAvailableAPI(reqData);
    if (apiResponse.status === true) {
      updateStep(3);
      let reqData = {};
      reqData = {
        gstin: dataG.gstin,
        ret_period: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate),
        api_name: 'retsum'
      };
      const apiResponse = await downloadGSTR1API(reqData);

      if (apiResponse && apiResponse.status === 1 && apiResponse.message) {
        setLoader(false);
        let response = JSON.parse(apiResponse.message.data_json_string);
        const sortedData = sortDataByRetSumTitles(response.sec_sum);
        setDownloadData(sortedData);

        const totalVal = await filedSummaryTotal(sortedData);
        setTotalData(totalVal);
        setDownloadDataJson(apiResponse.message.data_json_string);
      } else {
        errorMessageCall(apiResponse.message);
        setLoader(false);
        // Show Error pop up message
      }
    } else {
      updateStep(2);
    }
    setLoader(false);
  };

  const saveGSTR1 = async () => {
    let reqData = {};
    reqData = gstr1UploadData;

    const apiResponse = await saveGSTR1API(reqData);
    if (apiResponse && apiResponse.status === 1) {
      updateStep(3);
      myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const ref_id = apiResponse.message.reference_id;
      setTimeout(() => {
        retStatus(ref_id, 1);
      }, 5000);
    } else {
      errorMessageCall(apiResponse.message);
      setLoader(false);
    }
  };

  const resetGSTR1 = async () => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let reqData = {};
    reqData = {
      gstin: taxData?.gstin,
      ret_period: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate)
    };
    const apiResponse = await resetGSTR1API(reqData);
    if (apiResponse && apiResponse.status === 200) {
      updateStep(2);
    } else {
      errorMessageCall(apiResponse.message);
    }
    setLoader(false);
  };

  const returnsValidate = async () => {
    let reqData = {};
    reqData = gstr1UploadData;
    const apiResponse = await returnsValidateAPI(reqData);
    if (apiResponse && apiResponse.data?.status == 1) {
      updateStep(3);
      downloadGSTR1();
    } else {
      setLoader(false);
    }
  };

  const saveValidate = async () => {
    setConfirmSummary(false);
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let reqData = {};
    reqData = {
      gstin: taxData?.gstin,
      fp: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate)
    };

    const apiResponse = await saveValidateAPI(reqData);
    if (apiResponse) {
      if (apiResponse.message === 'JSON is valid') {
        saveGSTR1();
      } else {
        myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        downloadGSTR1();
      }
    } else {
      setLoader(false);
    }
  };

  const fileValidate = async () => {
    // setConfirmSummary(false);
    // setLoaderMsg('Please wait!!!');
    // setLoader(true);
    // let reqData = {};
    // reqData = {
    //   gstin: taxData?.gstin,
    //   fp: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate)
    // };
    // const apiResponse = await fileValidateAPI(reqData);
    // if (apiResponse && apiResponse.data?.success == false) {
    //   proceedToFinal();
    // }
    // setLoader(false);
    proceedToFinal();
  };

  const downloadGSTR1 = async () => {
    setLoader(true);
    setLoaderMsg('Please Wait....');
    let reqData = {};
    reqData = {
      gstin: taxData?.gstin,
      ret_period: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate),
      api_name: 'retsum'
    };
    const apiResponse = await downloadGSTR1API(reqData);
    if (apiResponse && apiResponse.status === 1 && apiResponse.message) {
      setLoader(false);
      let response = JSON.parse(apiResponse.message.data_json_string);
      const sortedData = sortDataByRetSumTitles(response.sec_sum);
      setDownloadData(sortedData);

      const totalVal = await filedSummaryTotal(sortedData);
      setTotalData(totalVal);
      setDownloadDataJson(apiResponse.message.data_json_string);
    } else {
      errorMessageCall(apiResponse.message);
      setLoader(false);
      // Show Error pop up message
    }
  };

  const retStatus = async (ref_id, type) => {
    let reqData = {};
    reqData = {
      gstin: taxData?.gstin,
      ret_period: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate),
      reference_id: ref_id
    };
    const apiResponse = await retStatusAPI(reqData);
    if (apiResponse && apiResponse.status === 1) {
      if (type == 1) {
        setTimeout(() => {
          proceedToFile();
        }, 5000);
      } else {
        setLoader(false);
      }
    } else {
      errorMessageCall(apiResponse.message);
      setLoader(false);
    }
  };

  const proceedToFile = async () => {
    let reqData = {};
    reqData = {
      gstin: taxData?.gstin,
      ret_period: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate)
    };
    const apiResponse = await proceedToFileAPI(reqData);
    if (apiResponse && apiResponse.status === 1) {
      // const ref_id = apiResponse.message.reference_id;
      setTimeout(() => {
        downloadGSTR1();
      }, 5000);
      // setLoader(false);
    } else {
      // errorMessageCall(apiResponse.message);
      setLoader(false);
    }
  };

  const toggleAnswerVisibility = (category) => {
    setMoreVisibility((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  const handleConfirmSummaryClose = () => {
    setConfirmSummary(false);
  };
  const proceedReview = () => {
    setConfirmSummary(true);
  };
  const proceedToFinal = () => {
    updateStep(4);
  };

  const proceedToEvcOtp = async () => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    let reqData = {};
    reqData = {
      ret_period: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate),
      gstin: taxData?.gstin,
      authorized_signatory_pan: pan
    };
    const apiResponse = await proceedToEvcOtpAPI(reqData);
    if (apiResponse && apiResponse.status == 1) {
      setFinalStep(2);
    } else {
      errorMessageCall(apiResponse.message);
    }
    setLoader(false);
  };
  const proceedToFileEVC = async () => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);

    let reqData = {};
    reqData = {
      ret_period: getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate),
      gstin: taxData?.gstin,
      otp: evcotp,
      authorized_signatory_pan: pan,
      data_json_string: downloadDataJson
    };
    const apiResponse = await proceedToFileEVCAPI(reqData);
    if (apiResponse && apiResponse.status === 1) {
      setFiled(true);
    } else {
      errorMessageCall(apiResponse.message);
      setFiled(false);
    }
    setLoader(false);
  };

  const gotoSection = (name) => {
    setActive(name);
    updateRetSaveReviewStep(2);
  };
  const backtoSection = () => {
    updateRetSaveReviewStep(1);
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

  const sortDataByRetSumTitles = (data) => {
    const orderedKeys = Object.keys(retSumTitles);
    return data.sort((a, b) => {
      return orderedKeys.indexOf(a.sec_nm) - orderedKeys.indexOf(b.sec_nm);
    });
  };

  return (
    <>
      <section ref={myRef} style={{ marginTop: '0%' }}>
        <ProgressBar style={{ width: '88%' }}>
          <ProgressBarStep className={step >= 1 && 'is-complete'}>
            <ProgressBarIcon />
            <ProgressBarStepLabel>Login</ProgressBarStepLabel>
          </ProgressBarStep>
          <ProgressBarStep className={step >= 2 && 'is-complete'}>
            <ProgressBarIcon />
            <ProgressBarStepLabel>RETURN Save</ProgressBarStepLabel>
          </ProgressBarStep>
          <ProgressBarStep className={step >= 3 && 'is-complete'}>
            <ProgressBarIcon />
            <ProgressBarStepLabel>Summary Review</ProgressBarStepLabel>
          </ProgressBarStep>
          <ProgressBarStep className={step >= 4 && 'is-complete'}>
            <ProgressBarIcon />
            <ProgressBarStepLabel>RETURN File</ProgressBarStepLabel>
          </ProgressBarStep>
        </ProgressBar>
      </section>

      <Card className={classes.wFull}>
        <Typography variant="h6">
          GSTIN : {taxData ? taxData.gstin : ''} FP :{' '}
          {getSelectedDateMonthAndYearMMYYYY(GSTRDateRange.fromDate)}
        </Typography>
      </Card>

      {step == 1 && (
        <div className={classes.step1} style={{ height: height - 50 }}>
          {loginStep == 1 && (
            <div className={classes.fGroup}>
              <Grid container direction="row" alignItems="stretch">
                <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                  <FormControl style={{ marginBottom: '6%' }} fullWidth>
                    <Typography component="subtitle1">Username</Typography>
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      margin="dense"
                      type="text"
                      className="customTextField"
                      placeholder="GST Portal Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={generateOTPCall}
                    style={{ width: '100%' }}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}

          {loginStep === 2 && (
            <div className={classes.fGroup}>
              <Grid container direction="row" alignItems="stretch">
                <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                  <FormControl style={{ marginBottom: '6%' }} fullWidth>
                    <Typography component="subtitle1">OTP</Typography>
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      margin="dense"
                      type="text"
                      className="customTextField"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <Typography onClick={generateOTPCall} className={classes.resendOTP} component="subtitle1">Resend OTP</Typography>
                  </FormControl>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={validateOTPCall}
                    style={{ width: '100%' }}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </div>
          )}
        </div>
      )}

      {step == 2 && (
        <div className={classes.step2}>
          <Grid fluid className="app-main">
            <Col className="content-column" xs>
              <Card className={classes.card}>
                {retSaveReviewStep == '1' && (
                  <>
                    <Grid container direction="row" alignItems="stretch">
                      <div style={{ marginTop: '10px', width: '100%',minHeight:'641px' }}>
                        <table className={`${classes.batchTable}`}>
                          <thead>
                            <tr>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Sl.no
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Particulars
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Voucher Count
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Taxable Amount
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                State Tax Amount
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Central Tax Amount
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Integrated Tax Amount
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Total
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {summaryTitles?.map((item, index) => (
                              <tr
                                style={{ cursor: 'pointer' }}
                                className={classes.rowBtn}
                                onClick={() => {
                                  gotoSection(item.label);
                                }}
                              >
                                <td className={`${classes.rowstyle}`}>
                                  {index + 1}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  <b>{item.label}</b>
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {
                                    retSaveSummary?.[item.value]
                                      ?.numberOfVoucher
                                  }
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    retSaveSummary?.[item.value]?.txval || 0
                                  ).toFixed(2)}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    retSaveSummary?.[item.value]?.samt || 0
                                  ).toFixed(2)}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    retSaveSummary?.[item.value]?.camt || 0
                                  ).toFixed(2)}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    retSaveSummary?.[item.value]?.iamt || 0
                                  ).toFixed(2)}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    retSaveSummary?.[item.value]?.total || 0
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                            <tr
                              style={{ cursor: 'pointer' }}
                              className={classes.rowBtn}
                              onClick={() => {
                                setActive('HSN Summary');
                                updateRetSaveReviewStep(2);
                              }}
                            >
                              <td colSpan={8} className={`${classes.rowstyle}`}>
                                HSN/SAC Summary : {hsn ? hsn?.data?.length : 0}
                              </td>
                            </tr>
                            <tr
                              style={{ cursor: 'pointer' }}
                              className={classes.rowBtn}
                              onClick={() => {
                                setActive('Document Summary');
                                updateRetSaveReviewStep(2);
                              }}
                            >
                              <td colSpan={8} className={`${classes.rowstyle}`}>
                                Document Summary :{' '}
                                {doc ? doc?.doc_det?.length : 0}
                              </td>
                            </tr>
                          </tbody>
                          <thead>
                            <tr>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              ></th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>TOTAL</b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {retSaveSummary?.['total']?.vouchersTotal ||
                                    0}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    retSaveSummary?.['total']?.taxableTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    retSaveSummary?.['total']?.cgstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    retSaveSummary?.['total']?.sgstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    retSaveSummary?.['total']?.igstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    retSaveSummary?.['total']?.invTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </Grid>
                    {/* <div
                      style={{
                        marginLeft: '10px',
                        cursor: 'pointer',
                        marginBottom: '50px'
                      }}
                    >
                      <Typography
                        variant="h6"
                        onClick={() => {
                          setActive('HSN Summary');
                          updateRetSaveReviewStep(2);
                        }}
                      >
                        HSN/SAC Summary : {hsn ? hsn?.data?.length : 0}
                      </Typography>
                      <Typography
                        variant="h6"
                        onClick={() => {
                          setActive('Document Summary');
                          updateRetSaveReviewStep(2);
                        }}
                      >
                        Document Summary : {doc ? doc?.doc_det?.length : 0}
                      </Typography>
                    </div> */}
                  </>
                )}

                {retSaveReviewStep == '2' && (
                  <Grid
                    container
                    direction="row"
                    style={{ padding: '20px' }}
                    alignItems="stretch"
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <Button
                        color="secondary"
                        onClick={() => backtoSection(1)}
                        className={classes.filterBtn}
                      >
                        Back
                      </Button>
                    </div>

                    {active === 'B2B Invoices' && (
                      <>
                        {b2b && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {b2b?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        GSTIN : {pitem?.ctin}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.inv?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('b2b_' + index)
                                      }
                                    ></div>
                                  </div>
                                  <div className="answer">
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              POS
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.inv?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.inum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.idt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.val}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.pos}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}
                    {active === 'B2B E-Invoices' && <></>}

                    {active === 'B2BA' && (
                      <>
                        {b2ba && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {b2ba?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        GSTIN : {pitem?.ctin}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.inv?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('b2b_' + index)
                                      }
                                    >
                                      <IconButton
                                        aria-label="chevron circle up"
                                        style={{
                                          color: '#fff',
                                          padding: '0px'
                                        }}
                                      >
                                        {moreVisibility['b2b_' + index] ? (
                                          <>
                                            <Typography
                                              style={{
                                                padding: '10px',
                                                color: '#fff'
                                              }}
                                              variant="h6"
                                            >
                                              Hide Details{' '}
                                            </Typography>
                                            <KeyboardArrowDownIcon />
                                          </>
                                        ) : (
                                          <>
                                            <Typography
                                              style={{
                                                padding: '10px',
                                                color: '#fff'
                                              }}
                                              variant="h6"
                                            >
                                              View Details{' '}
                                            </Typography>
                                            <KeyboardArrowDownIcon />
                                          </>
                                        )}
                                      </IconButton>
                                    </div>
                                  </div>
                                  <div
                                    className="answer"
                                    style={{
                                      display: moreVisibility['b2b_' + index]
                                        ? 'block'
                                        : 'none'
                                    }}
                                  >
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Amendment Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              POS
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.inv?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.inum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.odt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.idt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.val}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.pos}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'B2CL' && (
                      <>
                        {b2cl && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {b2cl?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        POS : {pitem?.pos}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.inv?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('b2cl_' + index)
                                      }
                                    >
                                      {/* <IconButton
                                      aria-label="chevron circle up"
                                      style={{
                                        color: '#fff',
                                        padding: '0px'
                                      }}
                                    >
                                      {moreVisibility['b2cl_' + index] ? (
                                        <>
                                          <Typography
                                            style={{
                                              padding: '10px',
                                              color: '#fff'
                                            }}
                                            variant="h6"
                                          >
                                            Hide Details{' '}
                                          </Typography>
                                          <KeyboardArrowDownIcon />
                                        </>
                                      ) : (
                                        <>
                                          <Typography
                                            style={{
                                              padding: '10px',
                                              color: '#fff'
                                            }}
                                            variant="h6"
                                          >
                                            View Details{' '}
                                          </Typography>
                                          <KeyboardArrowDownIcon />
                                        </>
                                      )}
                                    </IconButton> */}
                                    </div>
                                  </div>
                                  <div
                                    className="answer"
                                  // style={{
                                  //   display: moreVisibility['b2cl_' + index]
                                  //     ? 'block'
                                  //     : 'none'
                                  // }}
                                  >
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.inv?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.inum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.idt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.val}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'B2CLA' && (
                      <>
                        {b2cla && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {b2cla?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        POS : {pitem?.pos}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.inv?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('b2cl_' + index)
                                      }
                                    >
                                      <IconButton
                                        aria-label="chevron circle up"
                                        style={{
                                          color: '#fff',
                                          padding: '0px'
                                        }}
                                      >
                                        {moreVisibility['b2cl_' + index] ? (
                                          <>
                                            <Typography
                                              style={{
                                                padding: '10px',
                                                color: '#fff'
                                              }}
                                              variant="h6"
                                            >
                                              Hide Details{' '}
                                            </Typography>
                                            <KeyboardArrowDownIcon />
                                          </>
                                        ) : (
                                          <>
                                            <Typography
                                              style={{
                                                padding: '10px',
                                                color: '#fff'
                                              }}
                                              variant="h6"
                                            >
                                              View Details{' '}
                                            </Typography>
                                            <KeyboardArrowDownIcon />
                                          </>
                                        )}
                                      </IconButton>
                                    </div>
                                  </div>
                                  <div
                                    className="answer"
                                    style={{
                                      display: moreVisibility['b2cl_' + index]
                                        ? 'block'
                                        : 'none'
                                    }}
                                  >
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Amendment Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.inv?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.inum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.odt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.idt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.val}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'CDNR' && (
                      <>
                        {cdnr && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {cdnr?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        GSTIN : {pitem?.ctin}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.nt?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('cdnr_' + index)
                                      }
                                    >
                                      {/* <IconButton
                                      aria-label="chevron circle up"
                                      style={{
                                        color: '#fff',
                                        padding: '0px'
                                      }}
                                    >
                                      {moreVisibility['cdnr_' + index] ? (
                                        <>
                                          <Typography
                                            style={{
                                              padding: '10px',
                                              color: '#fff'
                                            }}
                                            variant="h6"
                                          >
                                            Hide Details{' '}
                                          </Typography>
                                          <KeyboardArrowDownIcon />
                                        </>
                                      ) : (
                                        <>
                                          <Typography
                                            style={{
                                              padding: '10px',
                                              color: '#fff'
                                            }}
                                            variant="h6"
                                          >
                                            View Details{' '}
                                          </Typography>
                                          <KeyboardArrowDownIcon />
                                        </>
                                      )}
                                    </IconButton> */}
                                    </div>
                                  </div>
                                  <div
                                    className="answer"
                                  // style={{
                                  //   display: moreVisibility['cdnr_' + index]
                                  //     ? 'block'
                                  //     : 'none'
                                  // }}
                                  >
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              ntty
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              nt_num
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              nt_dt
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              pos
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.nt?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.ntty}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.nt_num}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.nt_dt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.pos}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'B2CS' && (
                      <>
                        {b2cs && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div className="answer">
                              <div style={{ marginTop: '10px' }}>
                                <table className={`${classes.batchTable}`}>
                                  <thead>
                                    <tr>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        POS
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Rate
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Taxable Value
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        CGST
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        SGST
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        IGST
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {b2cs?.map((item) => (
                                      <tr>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.pos}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.rt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.txval}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.camt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.samt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.iamt}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'B2CSA' && (
                      <>
                        {b2csa && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div className="answer">
                              <div style={{ marginTop: '10px' }}>
                                <table className={`${classes.batchTable}`}>
                                  <thead>
                                    <tr>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        ORIGINAL INV MONTH
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        POS
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        SUPPLY TYPE
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {b2csa?.map((item) => (
                                      <tr>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.omon}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.pos}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.sply_ty}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'CDNUR' && (
                      <>
                        {cdnur && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div className="answer">
                              <div style={{ marginTop: '10px' }}>
                                <table className={`${classes.batchTable}`}>
                                  <thead>
                                    <tr>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        POS
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Invoice Number
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {cdnur?.map((item) => (
                                      <tr>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.pos}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.nt_num}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.val}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'EXP' && <></>}

                    {active === 'EXP - EINV' && <></>}

                    {active === 'EXPA' && <></>}

                    {active === 'NIL' && <></>}

                    {active === 'Document Summary' && (
                      <>
                        {doc && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {doc?.doc_det?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        {pitem?.doc_typ}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('doc_' + index)
                                      }
                                    ></div>
                                  </div>
                                  <div className="answer">
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              First Slno
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Last Slno
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Total
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Cancelled
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.docs?.map((item) => (
                                            <tr>
                                              {/* <td className={`${classes.rowstyle}`}>
                                       {item.doc_typ}
                                     </td> */}
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.from}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.to}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.totnum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.cancel}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'HSN Summary' && (
                      <>
                        {hsn && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div className="answer">
                              <div style={{ marginTop: '10px' }}>
                                <table className={`${classes.batchTable}`}>
                                  <thead>
                                    <tr>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        HSN Code
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Qty
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Unit
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Tax Rate
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Taxable Amount
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        CAMT
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        SAMT
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        IAMT
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {hsn?.data?.map((item) => (
                                      <tr>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.hsn_sc}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.qty}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.uqc}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.rt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.txval}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.camt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.samt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.iamt}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>
                )}
              </Card>
            </Col>
          </Grid>
          <Grid item xs={12} className={`grid-padding ${classes.sticky}`}>
            <Button
              className={classes.filterBtn}
              onClick={proceedReview}
              style={{ float: 'right' }}
            >
              Submit
            </Button>
            <Button
              className={classes.filterBtn}
              onClick={downloadJson}
              style={{ float: 'right', marginRight: '10px' }}
            >
              Download JSON
            </Button>
          </Grid>
        </div>
      )}

      {step == 3 && (
        <div className={classes.step2}>
          <Grid fluid className="app-main">
            <Col className="content-column" xs>
              <Card className={classes.card}>
                {retSaveReviewStep == '1' && (
                  <>
                    <Grid container direction="row" alignItems="stretch">
                      <div style={{ marginTop: '10px', width: '100%' }}>
                        <table className={`${classes.batchTable}`}>
                          <thead>
                            <tr>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Description
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                No. of records
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Document Type
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Value (₹)
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Integrated tax (₹)
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Central tax (₹)
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                State/UT tax (₹)
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                Cess (₹)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {downloadData?.map(
                              (item, index) =>
                                retSumTitles[item.sec_nm] && (
                                  <>
                                    <tr>
                                      <td
                                        colSpan="8"
                                        className={`${classes.rowstyle} ${classes.retFont}`}
                                      >
                                        {retSumTitles[item.sec_nm]}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td className={`${classes.rowstyle}`}>
                                        Total
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_rec}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        Invoice
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_tax}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_igst}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_cgst}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_sgst}
                                      </td>
                                      <td className={`${classes.rowstyle}`}>
                                        {item.ttl_cess}
                                      </td>
                                    </tr>
                                    {item?.sub_sections?.map(
                                      (itemsub, index1) => (
                                        <tr>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.typ}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_rec}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            Invoice
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_tax}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_igst}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_cgst}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_sgst}
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            {itemsub.ttl_cess}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </>
                                )
                            )}
                          </tbody>
                          <thead>
                            <tr>
                              
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>TOTAL</b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {totalData?.vouchersTotal || 0}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.taxableTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.igstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.cgstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.sgstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    totalData?.cessTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                            </tr>
                          </thead>
                        </table>
                      </div>
                    </Grid>
                    <div
                      style={{
                        marginLeft: '10px',
                        cursor: 'pointer',
                        marginBottom: '50px'
                      }}
                    >
                      {/* <Typography
                        variant="h6"
                        onClick={() => {
                          setActive('Document Summary');
                          updateRetSaveReviewStep(2);
                        }}
                      >
                        Document Summary : {0}
                      </Typography> */}
                    </div>
                  </>
                )}

                {retSaveReviewStep == '2' && (
                  <Grid
                    container
                    direction="row"
                    style={{ padding: '20px' }}
                    alignItems="stretch"
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <Button
                        color="secondary"
                        onClick={() => backtoSection(1)}
                        className={classes.filterBtn}
                      >
                        Back
                      </Button>
                    </div>

                    {active === 'B2B Invoices' && (
                      <>
                        {sb2b && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {sb2b?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        GSTIN : {pitem?.ctin}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.inv?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('b2b_' + index)
                                      }
                                    ></div>
                                  </div>
                                  <div className="answer">
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              POS
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.inv?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.inum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.idt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.val}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.pos}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}
                    {active === 'B2B E-Invoices' && <></>}

                    {active === 'B2BA' && (
                      <>
                        {sb2ba && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {sb2ba?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        GSTIN : {pitem?.ctin}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.inv?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('b2b_' + index)
                                      }
                                    >
                                      <IconButton
                                        aria-label="chevron circle up"
                                        style={{
                                          color: '#fff',
                                          padding: '0px'
                                        }}
                                      >
                                        {moreVisibility['b2b_' + index] ? (
                                          <>
                                            <Typography
                                              style={{
                                                padding: '10px',
                                                color: '#fff'
                                              }}
                                              variant="h6"
                                            >
                                              Hide Details{' '}
                                            </Typography>
                                            <KeyboardArrowDownIcon />
                                          </>
                                        ) : (
                                          <>
                                            <Typography
                                              style={{
                                                padding: '10px',
                                                color: '#fff'
                                              }}
                                              variant="h6"
                                            >
                                              View Details{' '}
                                            </Typography>
                                            <KeyboardArrowDownIcon />
                                          </>
                                        )}
                                      </IconButton>
                                    </div>
                                  </div>
                                  <div
                                    className="answer"
                                    style={{
                                      display: moreVisibility['b2b_' + index]
                                        ? 'block'
                                        : 'none'
                                    }}
                                  >
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Amendment Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              POS
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.inv?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.inum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.odt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.idt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.val}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.pos}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'B2CL' && (
                      <>
                        {sb2cl && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {sb2cl?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        POS : {pitem?.pos}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.inv?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('b2cl_' + index)
                                      }
                                    >
                                      {/* <IconButton
                                      aria-label="chevron circle up"
                                      style={{
                                        color: '#fff',
                                        padding: '0px'
                                      }}
                                    >
                                      {moreVisibility['b2cl_' + index] ? (
                                        <>
                                          <Typography
                                            style={{
                                              padding: '10px',
                                              color: '#fff'
                                            }}
                                            variant="h6"
                                          >
                                            Hide Details{' '}
                                          </Typography>
                                          <KeyboardArrowDownIcon />
                                        </>
                                      ) : (
                                        <>
                                          <Typography
                                            style={{
                                              padding: '10px',
                                              color: '#fff'
                                            }}
                                            variant="h6"
                                          >
                                            View Details{' '}
                                          </Typography>
                                          <KeyboardArrowDownIcon />
                                        </>
                                      )}
                                    </IconButton> */}
                                    </div>
                                  </div>
                                  <div
                                    className="answer"
                                  // style={{
                                  //   display: moreVisibility['b2cl_' + index]
                                  //     ? 'block'
                                  //     : 'none'
                                  // }}
                                  >
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.inv?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.inum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.idt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.val}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'B2CLA' && (
                      <>
                        {sb2cla && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {sb2cla?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        POS : {pitem?.pos}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.inv?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('b2cl_' + index)
                                      }
                                    >
                                      <IconButton
                                        aria-label="chevron circle up"
                                        style={{
                                          color: '#fff',
                                          padding: '0px'
                                        }}
                                      >
                                        {moreVisibility['b2cl_' + index] ? (
                                          <>
                                            <Typography
                                              style={{
                                                padding: '10px',
                                                color: '#fff'
                                              }}
                                              variant="h6"
                                            >
                                              Hide Details{' '}
                                            </Typography>
                                            <KeyboardArrowDownIcon />
                                          </>
                                        ) : (
                                          <>
                                            <Typography
                                              style={{
                                                padding: '10px',
                                                color: '#fff'
                                              }}
                                              variant="h6"
                                            >
                                              View Details{' '}
                                            </Typography>
                                            <KeyboardArrowDownIcon />
                                          </>
                                        )}
                                      </IconButton>
                                    </div>
                                  </div>
                                  <div
                                    className="answer"
                                    style={{
                                      display: moreVisibility['b2cl_' + index]
                                        ? 'block'
                                        : 'none'
                                    }}
                                  >
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Invoice Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Amendment Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.inv?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.inum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.odt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.idt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.val}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'CDNR' && (
                      <>
                        {scdnr && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {scdnr?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        GSTIN : {pitem?.ctin}
                                      </Typography>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        Total : {pitem?.nt?.length}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('cdnr_' + index)
                                      }
                                    >
                                      {/* <IconButton
                                      aria-label="chevron circle up"
                                      style={{
                                        color: '#fff',
                                        padding: '0px'
                                      }}
                                    >
                                      {moreVisibility['cdnr_' + index] ? (
                                        <>
                                          <Typography
                                            style={{
                                              padding: '10px',
                                              color: '#fff'
                                            }}
                                            variant="h6"
                                          >
                                            Hide Details{' '}
                                          </Typography>
                                          <KeyboardArrowDownIcon />
                                        </>
                                      ) : (
                                        <>
                                          <Typography
                                            style={{
                                              padding: '10px',
                                              color: '#fff'
                                            }}
                                            variant="h6"
                                          >
                                            View Details{' '}
                                          </Typography>
                                          <KeyboardArrowDownIcon />
                                        </>
                                      )}
                                    </IconButton> */}
                                    </div>
                                  </div>
                                  <div className="answer">
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              ntty
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              nt_num
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              nt_dt
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              pos
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.nt?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.ntty}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.nt_num}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.nt_dt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.pos}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'B2CS' && (
                      <>
                        {sb2cs && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div className="answer">
                              <div style={{ marginTop: '10px' }}>
                                <table className={`${classes.batchTable}`}>
                                  <thead>
                                    <tr>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        POS
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Rate
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Taxable Value
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        CGST
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        SGST
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        IGST
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sb2cs?.map((item) => (
                                      <tr>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.pos}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.rt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.txval}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.camt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.samt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.iamt}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'B2CSA' && (
                      <>
                        {sb2csa && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div className="answer">
                              <div style={{ marginTop: '10px' }}>
                                <table className={`${classes.batchTable}`}>
                                  <thead>
                                    <tr>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        ORIGINAL INV MONTH
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        POS
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        SUPPLY TYPE
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sb2csa?.map((item) => (
                                      <tr>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.omon}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.pos}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.sply_ty}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'CDNUR' && (
                      <>
                        {scdnur && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div className="answer">
                              <div style={{ marginTop: '10px' }}>
                                <table className={`${classes.batchTable}`}>
                                  <thead>
                                    <tr>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        POS
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Invoice Number
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Value
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {scdnur?.map((item) => (
                                      <tr>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.pos}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.nt_num}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.val}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'EXP' && <></>}

                    {active === 'EXP - EINV' && <></>}

                    {active === 'EXPA' && <></>}

                    {active === 'NIL' && <></>}

                    {active === 'Document Summary' && (
                      <>
                        {sdoc && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {sdoc?.doc_det?.map((pitem, index) => (
                                <div className={classes.mb_10}>
                                  <div className={classes.CenterStartEnd}>
                                    <div style={{ display: 'flex' }}>
                                      <Typography
                                        style={{
                                          padding: '10px',
                                          color: '#fff'
                                        }}
                                        variant="h6"
                                      >
                                        {pitem?.doc_typ}
                                      </Typography>
                                    </div>
                                    <div
                                      style={{ cursor: 'pointer' }}
                                      onClick={() =>
                                        toggleAnswerVisibility('doc_' + index)
                                      }
                                    ></div>
                                  </div>
                                  <div className="answer">
                                    <div style={{ marginTop: '10px' }}>
                                      <table
                                        className={`${classes.batchTable}`}
                                      >
                                        <thead>
                                          <tr>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              First Slno
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Last Slno
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Total
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Cancelled
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.docs?.map((item) => (
                                            <tr>
                                              {/* <td className={`${classes.rowstyle}`}>
                                       {item.doc_typ}
                                     </td> */}
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.from}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.to}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.totnum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.cancel}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'HSN Summary' && (
                      <>
                        {shsn && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div className="answer">
                              <div style={{ marginTop: '10px' }}>
                                <table className={`${classes.batchTable}`}>
                                  <thead>
                                    <tr>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        HSN Code
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Qty
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Unit
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Tax Rate
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Taxable Amount
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        CAMT
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        SAMT
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        IAMT
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {shsn?.data?.map((item) => (
                                      <tr>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.hsn_sc}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.qty}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.uqc}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.rt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.txval}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.camt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.samt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.iamt}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}
                  </Grid>
                )}
              </Card>
            </Col>
          </Grid>
          <Grid
            item
            xs={12}
            className={`grid-padding ${classes.sticky} ${classes.mb_20}`}
          >
            {downloadData ? (
              <>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={(e) => {
                    fileValidate();
                  }}
                  style={{ float: 'right', marginLeft: '10px' }}
                >
                  Proceed to File
                </Button>
                <Button
                  color="secondary"
                  variant="outlined"
                  onClick={(e) => {
                    downloadGSTR1();
                  }}
                  style={{ float: 'right', marginLeft: '10px' }}
                >
                  ReGenerate Summary
                </Button>
              </>
            ) : (
              <Button
                color="secondary"
                variant="outlined"
                onClick={(e) => {
                  downloadGSTR1();
                }}
                style={{ float: 'right', marginLeft: '10px' }}
              >
                Generate Summary
              </Button>
            )}
            <Button
              color="secondary"
              variant="outlined"
              onClick={(e) => {
                resetGSTR1();
              }}
              style={{ float: 'right' }}
            >
              Reset Data
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => proceedToOnlineFilingScreen(false)}
              style={{ float: 'right', marginRight: '10px' }}
            >
              Reupload Data
            </Button>
          </Grid>
        </div>
      )}

      {step == 4 && (
        <div className={classes.step1}>
          <div className={classes.fGroup}>
            <Grid container direction="row" alignItems="stretch">
              {finalStep == 1 && (
                <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                  <FormControl style={{ marginBottom: '6%' }} fullWidth>
                    <Typography component="subtitle1">PAN</Typography>
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      margin="dense"
                      type="text"
                      className="customTextField"
                      placeholder="Enter PAN"
                      value={pan}
                      onChange={(e) => setPAN(e.target.value)}
                    />
                  </FormControl>
                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={(e) => {
                      proceedToEvcOtp();
                    }}
                    style={{ width: '100%' }}
                  >
                    Generate OTP
                  </Button>
                </Grid>
              )}

              {finalStep == 2 && (
                <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
                  <FormControl style={{ marginBottom: '6%' }} fullWidth>
                    <Typography component="subtitle1">OTP</Typography>
                    <TextField
                      fullWidth
                      required
                      variant="outlined"
                      margin="dense"
                      type="text"
                      className="customTextField"
                      placeholder="Enter OTP"
                      value={evcotp}
                      onChange={(e) => setEvcOtp(e.target.value)}
                    />
                  </FormControl>

                  <Button
                    color="secondary"
                    variant="outlined"
                    onClick={(e) => {
                      proceedToFileEVC();
                    }}
                    style={{ width: '100%' }}
                  >
                    Complete
                  </Button>
                </Grid>
              )}
            </Grid>
          </div>
        </div>
      )}

      <Dialog
        open={confirmSummary}
        fullWidth={true}
        maxWidth={'sm'}
        onClose={handleConfirmSummaryClose}
      >
        <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleConfirmSummaryClose}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          className={`${classes.productModalContent} ${classes.wAuto}`}
        >
          <Typography variant="h4" className={classes.mb_20}>
            Do you wish to confirm?
          </Typography>
          <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
            <div className={classes.CenterStartEndWc}>
              <Button
                color="secondary"
                variant="outlined"
                onClick={handleConfirmSummaryClose}
                style={{ float: 'right' }}
              >
                Cancel
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                onClick={saveValidate}
                style={{ float: 'right' }}
              >
                Yes
              </Button>
            </div>
          </Grid>
        </DialogContent>
      </Dialog>

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
    </>
  );
};

export default injectWithObserver(GSTR1OnlinePortal);
