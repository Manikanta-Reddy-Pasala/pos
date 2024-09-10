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
  Card,
  Select,
  MenuItem
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import styled, { css } from 'styled-components';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import useWindowDimensions from '../../../components/windowDimension';
import List from '@material-ui/core/List';
import { Col } from 'react-flexbox-grid';
import classnames from 'classnames';
import Gstr31EditReport from '../../Reports/TaxReport/GSTR3B/edit3.1';
import Gstr311EditReport from '../../Reports/TaxReport/GSTR3B/edit3.1.1';
import Gstr32EditReport from '../../Reports/TaxReport/GSTR3B/edit3.2';
import Gstr4EditReport from '../../Reports/TaxReport/GSTR3B/edit4';
import Gstr5EditReport from '../../Reports/TaxReport/GSTR3B/edit5';
import Gstr51EditReport from '../../Reports/TaxReport/GSTR3B/edit5.1';

import { validateSession } from 'src/components/Helpers/GstrOnlineHelper';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import {
  get3BData,
  save3BDataAPI,
  save3BDataCopyAPI,
  retTrack
} from 'src/components/Helpers/GstrOnlineHelper';
import {
  getSelectedDateMonthAndYearMMYYYY,
  isCurrentOrFutureYearMonth,
  getMonthStartEndDates
} from 'src/components/Helpers/DateHelper';
import {
  getAllPurchasesByDateRange
} from 'src/components/Helpers/dbQueries/purchases';
import {
  getAllExpensesByDateRange
} from 'src/components/Helpers/dbQueries/expenses';
import GSTAuth from '../GSTAuth';
import GSTR3BReturnSummary from './GSTR3BReturnSummary';
import { toJS } from 'mobx';
import GSTError from '../GSTError';
import { forEach } from 'lodash';
import * as Db from '../../../RxDb/Database/Database';
import * as Bd from '../../../components/SelectedBusiness';
import dateFormat from 'dateformat';

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
  content:{
    overflow: 'hidden'
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
  pointer: {
    cursor: 'pointer',
    padding: '10px'
  },
  mb_10: {
    marginBottom: '10px'
  },
  wAuto: {
    width: '80%',
    margin: 'auto',
    textAlign: 'center'
  },
  dHead: {
    height: '100px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgb(239, 83, 80)',
    color: '#fff'
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
  filterSection: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    margin: 'auto'
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
  },
  filterBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    height: '30px',
    fontSize: '12px',
    marginTop: '10px',
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    }
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  sticky: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '999',
    padding: '10px',
    backgroundColor: '#f6f8fa'
  },
  step3: {
    width: '40%',
    margin: 'auto',
    textAlign: 'center',
    fontSize: '20px'
  },
  CenterStartEnd: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    margin: 'auto',
    marginTop: '32px'
  },
  success: {
    backgroundColor: '#0080002e',
    padding: '34px',
    borderRadius: '5px'
  },
  note:{
    padding: '15px',
    fontSize: '15px',
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

const GSTR3BOnline = (props) => {
  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const myRef = useRef(null);
  const classes = useStyles();
  const stores = useStore();
  const [active, setActive] = useState('Summary');
  const [filter, setFilter] = useState(false);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(false);
  const [step, setStep] = useState(0);

  const titles = [
    'Summary',
    'Section 3.1',
    'Section 3.1.1',
    'Section 3.2',
    'Section 4',
    'Section 5',
    'Section 5.1'
  ];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const API_SERVER = window.REACT_APP_API_SERVER;
  const { height } = useWindowDimensions();

  const {
    handleOnlineGSTR3BModalClose,
    handleEditGSTR3B,
    handleCloseEditGSTR3B,
    getGSTR3BData,
    setDateRageOfGSTR2BFromDate,
    setDateRageOfGSTR2BToDate,
    setFinancialYear,
    setFinancialMonth,
    setGSTRPeriod,
    setGSTINandFP,
    setActiveTab,
    setFiled,
    addRcmITCPurchases,
    setPurchaseData,
    setExpenseData,
    setOpenPurchasesExpenses2B
  } = stores.GSTR3BStore;
  const {
    financialYear,
    financialMonth,
    months,
    onlineGSTR3BDialogOpen,
    isEdit3B,
    edit3BSection,
    Section31SummaryTotal,
    Section311SummaryTotal,
    Section32SummaryTotal,
    Section4SummaryTotal,
    Section5SummaryTotal,
    Section51SummaryTotal,
    save3BData,
    activeTab,
    finalSave3BData,
    isFiled
  } = toJS(stores.GSTR3BStore);
  const { getTaxSettingsDetails } = stores.TaxSettingsStore;
  const {
    updateGSTAuth,
    handleErrorAlertOpen,
    setLoginStep,
    setTaxData,
    gstAuth,
    openErrorMesssageDialog,
    taxData
  } = stores.GSTR1Store;

  const editedData = '';

  useEffect(() => {
    fetchTaxData();
  }, []);


  useEffect(() => {
    if(filter){
      if (isCurrentOrFutureYearMonth(financialYear, financialMonth)) {
        errorMessageCall('Invalid Finacial Year / Month');
      } else {
        checkIsFiled(financialYear, financialMonth);
      }
    }
  }, [gstAuth]);

  const fetchTaxData = async () => {
    let tData = await getTaxSettingsDetails();
    
    setTaxData(tData);
  };

  const proceedToFetchData = async () => {
    setLoading(true);
    setGSTRPeriod(financialYear, financialMonth);
    const { startDate, endDate } = getMonthStartEndDates(financialMonth, financialYear);
    let purchaseData = await getAllPurchasesByDateRange(dateFormat(startDate, 'yyyy-mm-dd'),dateFormat(endDate, 'yyyy-mm-dd'));
    let expenseData = await getAllExpensesByDateRange(dateFormat(startDate, 'yyyy-mm-dd'),dateFormat(endDate, 'yyyy-mm-dd'));
    setPurchaseData(purchaseData);
    setExpenseData(expenseData);
    // let taxData = await getTaxSettingsDetails();
    validateSessionCall();
  };

  const errorMessageCall = (message) => {
    handleErrorAlertOpen(message);
  };

  const validateSessionCall = async () => {
    
    setLoadingMsg('Please wait while validating session!!!');
    setLoading(true);
    const apiResponse = await validateSession(taxData.gstin);
    if (apiResponse.code === 200) {
      if (apiResponse && apiResponse.status === 1) {
        updateGSTAuth(true);
        setFilter(true);
        if (isCurrentOrFutureYearMonth(financialYear, financialMonth)) {
          errorMessageCall('Invalid Finacial Year / Month');
        } else {
          checkIsFiled(financialYear, financialMonth);
        }
      } else {
        
        // errorMessageCall(apiResponse.message);
        setLoading(false);
        setFilter(true);
      }
    } else {
      updateGSTAuth(false);
      setLoginStep(1);
      setFilter(true);
      // errorMessageCall(apiResponse.message);
      setLoading(false);
    }
  };

  const checkIsFiled = async (yearData, monthData) => {
    const tData = await getTaxSettingsDetails();
    let GSTRPeriod = '';
    if (monthData > '03') {
      GSTRPeriod = monthData + yearData;
    } else {
      GSTRPeriod = monthData + (parseInt(yearData) + 1);
    }
    const year = GSTRPeriod.substring(2, 6);
    const month = GSTRPeriod.substring(0, 2);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const fDate = `${start.getFullYear()}-${(start.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`;
    let reqData = {};
    reqData = {
      gstin: tData?.gstin,
      ret_period: getSelectedDateMonthAndYearMMYYYY(fDate)
    };
    const apiResponse = await retTrack(reqData);
    setLoading(false);
    setFilter(true);
    if (apiResponse && apiResponse.status === 1) {
      const respData = apiResponse.message;
      if (respData?.EFiledlist && respData.EFiledlist.length > 0) {
        if(respData.EFiledlist.length == 1){
          fetchData(financialYear, financialMonth);
          setStep(2);
        }else{
          respData.EFiledlist.forEach((item, index) => {
            if (item.rtntype == 'GSTR3B') {
              if (item.status == 'Filed') {
                setStep(4);
                // setStep(2);
                // fetchData(financialYear, financialMonth);
              } else {
                fetchData(financialYear, financialMonth);
                setStep(2);
              }
            }
          });
        }
        
      } else {
        fetchData(financialYear, financialMonth);
        setStep(2);
      }
      // setStep(2);
    } else {
      // errorMessageCall("Please Choose Correct financial Year and Month");
      setStep(2);
    }
  };

  const fetchData = async (yearData, monthData) => {
    const tData = await getTaxSettingsDetails();
    let GSTRPeriod = '';
    if (monthData > '03') {
      GSTRPeriod = monthData + yearData;
    } else {
      GSTRPeriod = monthData + (parseInt(yearData) + 1);
    }
    const year = GSTRPeriod.substring(2, 6);
    const month = GSTRPeriod.substring(0, 2);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const fDate = `${start.getFullYear()}-${(start.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`;
    console.log('fDate', fDate);
    let reqData = {};
    reqData = {
      gstin: tData?.gstin,
      retPeriod: getSelectedDateMonthAndYearMMYYYY(fDate)
    };
    const apiResponse = await get3BData(reqData);
    setLoading(false);
    setFilter(true);
    if (apiResponse && apiResponse.status === 1) {
      setGSTINandFP(tData?.gstin, getSelectedDateMonthAndYearMMYYYY(fDate));
      const respData = apiResponse.message;
      getGSTR3BData(respData, editedData);
      setStep(2);
    } else {
      errorMessageCall(apiResponse.message);
    }
  };

  const saveData = async () => {
    setLoading(true);
    setLoadingMsg('Please wait!!!');
    const apiResponse = await save3BDataAPI(save3BData);
    const apiResponseCopy = await save3BDataCopyAPI(finalSave3BData);
    setLoading(false);
    if (apiResponse && apiResponse.status === 1) {
      setStep(3);
    } else {
      errorMessageCall(apiResponse.message);
    }
  };

  const viewSummary = async () => {
    setGSTRPeriod(financialYear, financialMonth);
    setFiled(true);
    setFilter(true);
  };

  const downloadJson = () => {
    const data = JSON.stringify(save3BData);
    const blob = new Blob([data], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);

    link.download =
      'GSTR-3B_' + save3BData.gstin + '_' + save3BData.ret_period + '.json';
    link.click();

    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <Typography
        className={`${classes.mb_10}`}
        style={{ padding: '10px', width: '95%', margin: 'auto' }}
        variant="h3"
      >
        GSTR-3B - Monthly Return
      </Typography>

      {filter && (
        <>
          <div style={{ marginLeft: '18px' }}>
            <Button
              color="secondary"
              onClick={() => {
                setFilter(false);
              }}
              className={classes.filterBtn}
            >
              Back to Filter
            </Button>
          </div>

          <section ref={myRef} style={{ marginTop: '0%' }}>
            <ProgressBar>
              <ProgressBarStep className={step >= 1 && 'is-complete'}>
                <ProgressBarIcon />
                <ProgressBarStepLabel>Login</ProgressBarStepLabel>
              </ProgressBarStep>
              <ProgressBarStep className={step >= 2 && 'is-complete'}>
                <ProgressBarIcon />
                <ProgressBarStepLabel>System Generated</ProgressBarStepLabel>
              </ProgressBarStep>
              <ProgressBarStep className={step >= 3 && 'is-complete'}>
                <ProgressBarIcon />
                <ProgressBarStepLabel>Ret Save</ProgressBarStepLabel>
              </ProgressBarStep>
            </ProgressBar>
          </section>
        </>
      )}

      {!filter && (
        <div className={classes.step2}>
          <Grid
            container
            style={{ minHeight: height - 125 }}
            className={classes.categoryActionWrapper}
          >
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
                          <MenuItem value={month.value}>{month.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </form>
                </div>
                <div className={classes.filterSectionBtn}>
                  <Button onClick={viewSummary} className={classes.filterBtn}>
                    View Summary
                  </Button>
                  <Button
                    color="secondary"
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
          </Grid>
        </div>
      )}
      {filter && (
        <>
          {!isFiled && !gstAuth ? (
            <GSTAuth type={'GSTR3B'} />
          ) : !isFiled ? (
            <>
              {step == 2 && (
                <div className={classes.step2}>
                  <Grid
                    fluid
                    className="app-main"
                    style={{ height: height-285 }}
                  >
                    <Col className="nav-column" xs={12} sm={2}>
                      <Card className={classes.card}>
                        <Grid container className={classes.cardList}>
                          <div className={classes.card}>
                            <List
                              component="nav"
                              style={{ padding: '10px', textAlign: 'start' }}
                            >
                              {titles?.map((pitem, index) => (
                                <Typography
                                  onClick={() => {
                                    setActiveTab(pitem);
                                  }}
                                  className={classnames([
                                    classes.cardLists,
                                    'menu-item',
                                    activeTab === pitem
                                      ? 'menu-active'
                                      : 'menu-default'
                                  ])}
                                  gutterBottom
                                  variant="h6"
                                  component="h6"
                                >
                                  {pitem}
                                </Typography>
                              ))}
                            </List>
                          </div>
                        </Grid>
                      </Card>
                    </Col>
                    <Col className="content-column" xs>
                      <Card className={classes.card}>
                        {!isEdit3B ? (
                          <div>
                            <Grid
                              container
                              direction="row"
                              style={{ padding: '20px' }}
                              alignItems="stretch"
                            >
                              {activeTab == 'Summary' && (
                                <Grid
                                  container
                                  direction="row"
                                  style={{ padding: '20px' }}
                                  alignItems="stretch"
                                >
                                  <Grid
                                    item
                                    xs={4}
                                    className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                                    onClick={() => handleEditGSTR3B('31')}
                                  >
                                    <div className={classes.dHead}>
                                      <Typography
                                        style={{ padding: '10px' }}
                                        variant="h4"
                                      >
                                        3.1 Tax on outward and reverse charge
                                        inward supplies
                                      </Typography>
                                    </div>
                                    <Grid
                                      container
                                      direction="row"
                                      alignItems="stretch"
                                      style={{
                                        backgroundColor: '#fff',
                                        minHeight: '139px',
                                        border: '1px solid rgb(239 83 80)'
                                      }}
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Integrated Tax <br />{' '}
                                          {Section31SummaryTotal.integrated_tax}
                                        </Typography>
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          State/UT Tax <br />{' '}
                                          {Section31SummaryTotal.state_ut_tax}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Central Tax <br />{' '}
                                          {Section31SummaryTotal.central_tax}
                                        </Typography>
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          CESS <br />{' '}
                                          {Section31SummaryTotal.cess}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                                    onClick={() => handleEditGSTR3B('31')}
                                  >
                                    <div className={classes.dHead}>
                                      <Typography
                                        style={{ padding: '10px' }}
                                        variant="h4"
                                      >
                                        3.1.1 Supplies notified under section
                                        9(5) of the CGST Act,2017
                                      </Typography>
                                    </div>
                                    <Grid
                                      container
                                      direction="row"
                                      alignItems="stretch"
                                      style={{
                                        backgroundColor: '#fff',
                                        minHeight: '139px',
                                        border: '1px solid rgb(239 83 80)'
                                      }}
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Integrated Tax <br />{' '}
                                          {
                                            Section311SummaryTotal.integrated_tax
                                          }
                                        </Typography>
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          State/UT Tax <br />{' '}
                                          {Section311SummaryTotal.state_ut_tax}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Central Tax <br />{' '}
                                          {Section311SummaryTotal.central_tax}
                                        </Typography>
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          CESS <br />{' '}
                                          {Section311SummaryTotal.cess}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                                    onClick={() => handleEditGSTR3B('32')}
                                  >
                                    <div className={classes.dHead}>
                                      <Typography
                                        style={{ padding: '10px' }}
                                        variant="h4"
                                      >
                                        3.2 Inter-state supplies
                                      </Typography>
                                    </div>
                                    <Grid
                                      container
                                      direction="row"
                                      alignItems="stretch"
                                      style={{
                                        backgroundColor: '#fff',
                                        minHeight: '139px',
                                        border: '1px solid rgb(239 83 80)'
                                      }}
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Taxable Value <br />{' '}
                                          {
                                            Section32SummaryTotal.total_taxable_value
                                          }
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Integrated Tax <br />{' '}
                                          {Section32SummaryTotal.integrated_tax}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                                    onClick={() => handleEditGSTR3B('4')}
                                  >
                                    <div className={classes.dHead}>
                                      <Typography
                                        style={{ padding: '10px' }}
                                        variant="h4"
                                      >
                                        4. Eligible ITC
                                      </Typography>
                                    </div>
                                    <Grid
                                      container
                                      direction="row"
                                      alignItems="stretch"
                                      style={{
                                        backgroundColor: '#fff',
                                        minHeight: '139px',
                                        border: '1px solid rgb(239 83 80)'
                                      }}
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Integrated Tax <br />{' '}
                                          {Section4SummaryTotal.integrated_tax}
                                        </Typography>
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          State/UT Tax <br />{' '}
                                          {Section4SummaryTotal.state_ut_tax}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Central Tax <br />{' '}
                                          {Section4SummaryTotal.central_tax}
                                        </Typography>
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          CESS <br />{' '}
                                          {Section4SummaryTotal.cess}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                                    onClick={() => handleEditGSTR3B('5')}
                                  >
                                    <div className={classes.dHead}>
                                      <Typography
                                        style={{ padding: '10px' }}
                                        variant="h4"
                                      >
                                        5. Excempt, nil and Non GST inward
                                        supplies
                                      </Typography>
                                    </div>
                                    <Grid
                                      container
                                      direction="row"
                                      alignItems="stretch"
                                      style={{
                                        backgroundColor: '#fff',
                                        minHeight: '139px',
                                        border: '1px solid rgb(239 83 80)'
                                      }}
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Inter-state supplies <br />{' '}
                                          {
                                            Section5SummaryTotal.inter_state_supplies
                                          }
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Intra-state supplies <br />{' '}
                                          {
                                            Section5SummaryTotal.intra_state_supplies
                                          }
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid
                                    item
                                    xs={4}
                                    className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                                    onClick={() => handleEditGSTR3B('51')}
                                  >
                                    <div className={classes.dHead}>
                                      <Typography
                                        style={{ padding: '10px' }}
                                        variant="h4"
                                      >
                                        5.1 Interest and Late fee
                                      </Typography>
                                    </div>
                                    <Grid
                                      container
                                      direction="row"
                                      alignItems="stretch"
                                      style={{
                                        backgroundColor: '#fff',
                                        minHeight: '139px',
                                        border: '1px solid rgb(239 83 80)'
                                      }}
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Integrated Tax <br />{' '}
                                          {Section51SummaryTotal.integrated_tax}
                                        </Typography>
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          State/UT Tax <br />{' '}
                                          {Section51SummaryTotal.state_ut_tax}
                                        </Typography>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={`grid-padding ${classes.mb_10}`}
                                      >
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          Central Tax <br />{' '}
                                          {Section51SummaryTotal.central_tax}
                                        </Typography>
                                        <Typography
                                          style={{ padding: '10px' }}
                                          variant="h6"
                                        >
                                          CESS <br />{' '}
                                          {Section51SummaryTotal.cess}
                                        </Typography>
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              )}

                              {activeTab == 'Section 3.1' && (
                                <Gstr31EditReport />
                              )}

                              {activeTab == 'Section 3.1.1' && (
                                <Gstr311EditReport />
                              )}

                              {activeTab == 'Section 3.2' && (
                                <Gstr32EditReport />
                              )}

                              {activeTab == 'Section 4' && <Gstr4EditReport />}

                              {activeTab == 'Section 5' && <Gstr5EditReport />}

                              {activeTab == 'Section 5.1' && (
                                <Gstr51EditReport />
                              )}
                            </Grid>
                          </div>
                        ) : (
                          <>
                            <div className={classes.note}>Note: Portal Values Highlighted in Blue</div>
                            {edit3BSection == '31' && <Gstr31EditReport />}
                            {edit3BSection == '32' && <Gstr32EditReport />}
                            {edit3BSection == '4' && <Gstr4EditReport />}
                            {edit3BSection == '5' && <Gstr5EditReport />}
                            {edit3BSection == '51' && <Gstr51EditReport />}
                          </>
                        )}
                      </Card>
                    </Col>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    className={`grid-padding ${classes.sticky}`}
                  >
                    <Button
                      className={classes.filterBtn}
                      style={{ float: 'right' }}
                      onClick={saveData}
                    >
                      Proceed to upload
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
                  <Grid
                    fluid
                    className="app-main"
                    style={{ height: height - 250, backgroundColor: 'white' }}
                  >
                    <div className={classes.step3}>
                      <Typography
                        variant="h5"
                        component="h5"
                        className={classes.success}
                      >
                        Your request has been successfully saved. You may now
                        proceed to file it on the GST portal.
                      </Typography>

                      <Grid
                        item
                        xs={12}
                        className={`grid-padding ${classes.CenterStartEnd}`}
                      >
                        <Button
                          className={classes.filterBtn}
                          style={{ float: 'right' }}
                          onClick={() => setStep(2)}
                        >
                          Go Back
                        </Button>
                        <Button
                          className={classes.filterBtn}
                          style={{ float: 'right' }}
                        >
                          <a
                            style={{ color: 'white' }}
                            href="https://services.gst.gov.in/services/login"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Go to GST Portal
                          </a>
                        </Button>
                      </Grid>
                    </div>
                  </Grid>
                </div>
              )}
              {step == 4 && <GSTR3BReturnSummary type={'GSTR3B'} />}
            </>
          ) : (
            <GSTR3BReturnSummary type={'GSTR3B'} />
          )}
        </>
      )}

      <Dialog
        fullScreen={fullScreen}
        open={loading}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>{loadingMsg}</p>
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

export default injectWithObserver(GSTR3BOnline);
