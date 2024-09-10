import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Grid,
  Typography,
  TextField,
  Button,
  Card,
  Dialog,
  DialogContent,
  FormControl,
  Select,
  MenuItem,
  IconButton
} from '@material-ui/core';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import useWindowDimensions from '../../../components/windowDimension';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import List from '@material-ui/core/List';
import { Col } from 'react-flexbox-grid';
import classnames from 'classnames';
import GSTRITCAvailable from './GSTRITCAvailable';
import GSTRITCNotAvailable from './GSTRITCNotAvailable';
import { validateSession } from 'src/components/Helpers/GstrOnlineHelper';
import GSTRB2B from './GSTRB2B';
import GSTRB2BA from './GSTRB2BA';
import GSTRCDNR from './GSTRCDNR';
import GSTRCDNRA from './GSTRCDNRA';
import GSTRISD from './GSTRISD';
import GSTRISDA from './GSTRISDA';
import GSTRIMPG from './GSTRIMPG';
import GSTRIMPGSEZ from './GSTRIMPGSEZ';
import GSTAuth from '../GSTAuth';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import {
  get2BData,
  get2BDummyData
} from 'src/components/Helpers/GstrOnlineHelper';
import { getSelectedDateMonthAndYearMMYYYY } from 'src/components/Helpers/DateHelper';
import { toJS } from 'mobx';
import GSTError from '../GSTError';
import XLSX from 'xlsx';
import CustomVendorPurchases from '../CustomVendorPurchases';
import Excel from '../../../icons/Excel';
import * as ExcelJS from 'exceljs';
import {
  prepare2BITCAVAILABLEHeaderRow,
  prepare2BSheet1,
  prepare2BSheet2,
  prepare2BOtherSheet,
  prepare2AB2BHeaderRow,
  prepare2BB2BAHeaderRow,
  prepare2BCDNRHeaderRow,
  prepare2BCDNRAHeaderRow,
  prepare2BISDHeaderRow,
  prepare2BISDAHeaderRow,
  prepare2BIMPGHeaderRow,
  prepare2BIMPGSEZHeaderRow
} from '../GSTR1/GSTRExcelHelper';

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
    width: '65%',
    margin: 'auto',
    backgroundColor: '#d8cac01f',
    marginBottom: '2%'
  },
  step2: {
    width: '99%',
    margin: 'auto',
    backgroundColor: '#d8cac01f'
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
    fontSize: '14px'
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
  headstyle1: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: '#ef5350c4',
    color: 'white'
  },
  headstyle2: {
    textAlign: 'left',
    backgroundColor: 'orange',
    color: 'white'
  },
  headstyle3: {
    textAlign: 'left',
    backgroundColor: '#e0691791',
    color: 'white'
  },
  mb_20: {
    marginBottom: '20px'
  },
  pointer: {
    cursor: 'pointer'
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
  invGrid: {
    backgroundColor: '#3a3a811f',
    margin: '20px 0px 20px 0px'
  },
  itemGrid: {
    backgroundColor: '#3a3a811f',
    margin: '20px 0px 20px 0px'
  },
  filterSection: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    margin: 'auto'
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
  }
}));

const GSTR2BOnline = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [active, setActive] = useState('ITC Available');
  const sections = [
    'ITC Available',
    'ITC not Available',
    'B2B',
    'B2BA',
    'B2B-CDNR',
    'B2B-CDNRA',
    'ECO',
    'ISD',
    'ISDA',
    'IMPG',
    'IMPGSEZ'
  ];
  const { height } = useWindowDimensions();

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const [itcavl, setItcavl] = useState({});
  const [itcunavl, setItcunavl] = useState({});
  const [b2b, setB2B] = useState([]);
  const [b2ba, setB2BA] = useState([]);
  const [cdnr, setCDNR] = useState([]);
  const [cdnra, setCDNRA] = useState([]);
  const [isd, setISD] = useState([]);
  const [isda, setISDA] = useState([]);
  const [impg, setIMPG] = useState({});
  const [impgsez, setIMPGSEZ] = useState([]);

  const [filter, setFilter] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState(false);

  const [loader, setLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const { financialYear, financialMonth, months, openPurchasesImportFrom2B } =
    toJS(stores.GSTR2BStore);
  const {
    setFinancialYear,
    setFinancialMonth,
    setGSTRPeriod,
    setOpenPurchasesImportFrom2B,
    GSTINCollectionUpdate,
    GSTINInvoiceCollectionUpdate,
    resetGSTNAndInvoiceData
  } = stores.GSTR2BStore;

  const { getTaxSettingsDetails } = stores.TaxSettingsStore;
  const { updateGSTAuth, handleErrorAlertOpen, setLoginStep, setTaxData } =
    stores.GSTR1Store;
  const { openErrorMesssageDialog, gstAuth } = toJS(stores.GSTR1Store);
  const { getAuditSettingsData } = stores.AuditSettingsStore;

  const errorMessageCall = (message) => {
    handleErrorAlertOpen(message);
  };

  const validateSessionCall = async (dataG) => {
    setLoaderMsg('Please wait while validating session!!!');
    setLoader(true);

    const apiResponse = await validateSession(dataG.gstin);
    if (apiResponse.code === 200) {
      if (apiResponse && apiResponse.status === 1) {
        setLoader(false);
        updateGSTAuth(true);
        setFilter(true);
        fetchData(financialYear, financialMonth);
        // setFData(1);
      } else {
        //errorMessageCall(apiResponse.message);
        setFilter(true);
        setLoginStep(1);
        setLoader(false);
      }
    } else {
      setFilter(true);
      updateGSTAuth(false);
      setLoginStep(1);
      //errorMessageCall(apiResponse.message);
      setLoader(false);
    }
  };

  const setActiveData = (data) => {
    setActive(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (filter) {
      fetchData(financialYear, financialMonth);
    }
  }, [gstAuth]);

  const loadData = async () => {
    await getAuditSettingsData();
    let tData = await getTaxSettingsDetails();
    await setTaxData(tData);
  };

  const proceedToFetchData = async () => {
    setItcavl([]);
    setItcunavl([]);
    setB2B([]);
    setB2BA([]);
    setCDNR([]);
    setCDNRA([]);
    setISD([]);
    setISDA([]);
    setIMPG([]);
    setIMPGSEZ([]);
    setGSTRPeriod(financialYear, financialMonth);
    setLoader(true);
    let taxData = await getTaxSettingsDetails();

    validateSessionCall(taxData);
  };

  const fetchData = async (yearData, monthData) => {
    setLoaderMsg('Please wait!!!');
    setLoader(true);
    await resetGSTNAndInvoiceData();
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
    const tData = await getTaxSettingsDetails();
    let reqData = {};
    reqData = {
      gstin: tData?.gstin,
      ret_period: getSelectedDateMonthAndYearMMYYYY(fDate)
    };
    const apiResponse = await get2BData(reqData);
    console.log('apiResponse', apiResponse);
    if (apiResponse && apiResponse.status && apiResponse.status === 1) {
      const respData = apiResponse.message;
      if (respData?.data?.itcsumm?.itcavl) {
        setItcavl(respData?.data?.itcsumm?.itcavl);
      }
      if (respData?.data?.itcsumm?.itcunavl) {
        setItcunavl(respData?.data?.itcsumm?.itcunavl);
      }
      if (respData?.data?.docdata?.b2b) {
        setB2B(respData?.data?.docdata?.b2b);
        respData.data.docdata.b2b.forEach(async (element) => {
          await GSTINCollectionUpdate(element.ctin, element.trdnm);
          await GSTINInvoiceCollectionUpdate(
            element.ctin,
            element.trdnm,
            element.inv
          );
        });
      }
      if (respData?.data?.docdata?.b2ba) {
        setB2BA(respData?.data?.docdata?.b2ba);
        respData.data.docdata.b2ba.forEach(async (element) => {
          await GSTINCollectionUpdate(element.ctin, element.trdnm);
          // await GSTINInvoiceCollectionUpdate(
          //   element.ctin,
          //   element.trdnm,
          //   element.inv
          // );
        });
      }
      if (respData?.data?.docdata?.cdnr) {
        setCDNR(respData?.data?.docdata?.cdnr);
        respData.data.docdata.cdnr.forEach(async (element) => {
          await GSTINCollectionUpdate(element.ctin, element.trdnm);
          // await GSTINInvoiceCollectionUpdate(
          //   element.ctin,
          //   element.trdnm,
          //   element.nt
          // );
        });
      }
      if (respData?.data?.docdata?.cdnra) {
        setCDNRA(respData?.data?.docdata?.cdnra);
        respData.data.docdata.cdnra.forEach(async (element) => {
          await GSTINCollectionUpdate(element.ctin, element.trdnm);
          // await GSTINInvoiceCollectionUpdate(
          //   element.ctin,
          //   element.trdnm,
          //   element.nt
          // );
        });
      }
      if (respData?.data?.docdata?.isd) {
        setISD(respData?.data?.docdata?.isd);
      }
      if (respData?.data?.docdata?.isda) {
        setISDA(respData?.data?.docdata?.isda);
      }
      if (respData?.data?.docdata?.impg) {
        setIMPG(respData?.data?.docdata?.impg);
      }
      if (respData?.data?.docdata?.impgsez) {
        setIMPGSEZ(respData?.data?.docdata?.impgsez);
        respData.data.docdata.impgsez.forEach(async (element) => {
          await GSTINCollectionUpdate(element.ctin, element.trdnm);
          // await GSTINInvoiceCollectionUpdate(
          //   element.ctin,
          //   element.trdnm,
          //   element.boe
          // );
        });
      }
      setSectionsVisible(true);
      setLoader(false);
    } else {
      setLoader(false);
      setSectionsVisible(true);
      errorMessageCall(apiResponse.message);
    }
  };

  const getExcelDataNew = async () => {
    const workbook = new ExcelJS.Workbook();
    let mergeRange = ['A1:H1', 'A3:H3', 'B4:H4'];
    await prepare2BSheet1(
      workbook,
      itcavl,
      'ITCAVAILABLE',
      prepare2BITCAVAILABLEHeaderRow,
      mergeRange,
      ''
    );
    await prepare2BSheet2(
      workbook,
      itcunavl,
      'ITC NOT AVAILABLE',
      prepare2BITCAVAILABLEHeaderRow,
      mergeRange,
      ''
    );
    await prepare2BOtherSheet(
      workbook,
      b2b,
      'B2B',
      prepare2AB2BHeaderRow,
      'C1:F1',
      'K1:N1'
    );
    await prepare2BOtherSheet(
      workbook,
      b2ba,
      'B2BA',
      prepare2BB2BAHeaderRow,
      'E1:H1',
      'M1:P1'
    );
    await prepare2BOtherSheet(
      workbook,
      cdnr,
      'CDNR',
      prepare2BCDNRHeaderRow,
      'C1:G1',
      'L1:O1'
    );
    await prepare2BOtherSheet(
      workbook,
      cdnra,
      'CDNRA',
      prepare2BCDNRAHeaderRow,
      'F1:J1',
      'O1:R1'
    );
    await prepare2BOtherSheet(
      workbook,
      isd,
      'ISD',
      prepare2BISDHeaderRow,
      'H1:K1',
      ''
    );
    await prepare2BOtherSheet(
      workbook,
      isda,
      'ISDA',
      prepare2BISDAHeaderRow,
      'K1:N1',
      ''
    );
    await prepare2BOtherSheet(
      workbook,
      impg,
      'IMPG',
      prepare2BIMPGHeaderRow,
      'C1:E1',
      'F1:G1'
    );
    await prepare2BOtherSheet(
      workbook,
      impgsez,
      'IMPGSEZ',
      prepare2BIMPGSEZHeaderRow,
      'E1:G1',
      'H1:I1'
    );

    let GSTRPeriod = '';
    const year = GSTRPeriod.substring(2, 6);
    const month = GSTRPeriod.substring(0, 2);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    const fDate = `${start.getFullYear()}-${(start.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${start.getDate().toString().padStart(2, '0')}`;

    // Generate Excel file buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fileName = `${localStorage.getItem(
        'businessName'
      )}_2B_Report_${financialMonth}${financialYear}.xlsx`;
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  return (
    <>
      <Typography
        className={`${classes.mb_10}`}
        style={{
          padding: '5px',
          width: '95%',
          margin: 'auto',
          marginTop: '5px'
        }}
        variant="h3"
      >
        GSTR2B
      </Typography>
      {filter && (
        <div style={{ marginLeft: '18px', marginRight: '18px' }}>
          <Button
            color="secondary"
            onClick={() => {
              setFilter(false);
              setSectionsVisible(false);
            }}
            className={classes.filterBtn}
          >
            Back to Filter
          </Button>
          {/* <IconButton style={{ float: 'right' }}>
            <Excel fontSize="inherit" />
          </IconButton> */}
          <Button
            color="secondary"
            style={{ float: 'right' }}
            onClick={() => {
              setOpenPurchasesImportFrom2B(true);
            }}
            className={classes.filterBtn}
          >
            Import Purchases/Expenses
          </Button>
          <IconButton
            style={{ float: 'right' }}
            onClick={() => getExcelDataNew()}
          >
            <Excel fontSize="inherit" />
          </IconButton>
        </div>
      )}

      <div>
        {!filter && (
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
                <div className={classes.filterSection}>
                  <Button
                    onClick={(e) => {
                      proceedToFetchData();
                    }}
                    className={classes.filterBtn}
                  >
                    VIEW 2B DATA
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
        )}
        {filter && (
          <>
            {!gstAuth ? (
              <GSTAuth type={'GSTR2B'} />
            ) : (
              <Grid fluid className="app-main" style={{ height: height - 125 }}>
                <Col className="nav-column" xs={12} sm={1}>
                  <Card className={classes.card}>
                    <Grid container className={classes.cardList}>
                      <div className={classes.card}>
                        <List
                          component="nav"
                          style={{ padding: '10px', textAlign: 'start' }}
                        >
                          {sections?.map((pitem, index) => (
                            <Typography
                              onClick={() => {
                                setActiveData(pitem);
                              }}
                              className={classnames([
                                classes.cardLists,
                                'menu-item',
                                active === pitem
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
                  {sectionsVisible && (
                    <Card className={classes.card}>
                      <Grid
                        container
                        direction="row"
                        style={{ padding: '20px' }}
                        alignItems="stretch"
                      >
                        {active === 'ITC Available' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            <GSTRITCAvailable data={itcavl} />
                          </Grid>
                        )}

                        {active === 'ITC not Available' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            <GSTRITCNotAvailable data={itcunavl} />
                          </Grid>
                        )}

                        {active === 'B2B' && (
                          <Grid
                            item
                            style={{ overflow: 'scroll' }}
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            {b2b.length > 0 && <GSTRB2B data={b2b} />}
                          </Grid>
                        )}

                        {active === 'B2BA' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            {b2ba.length > 0 && <GSTRB2BA data={b2ba} />}
                          </Grid>
                        )}

                        {active === 'B2B-CDNR' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            {cdnr.length > 0 && <GSTRCDNR data={cdnr} />}
                          </Grid>
                        )}

                        {active === 'B2B-CDNRA' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            {cdnra.length > 0 && <GSTRCDNRA data={cdnra} />}
                          </Grid>
                        )}

                        {active === 'ECO' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          ></Grid>
                        )}

                        {active === 'ISD' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            {isd.length > 0 && <GSTRISD data={isd} />}
                          </Grid>
                        )}

                        {active === 'ISDA' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            {isda.length > 0 && <GSTRISDA data={isda} />}
                          </Grid>
                        )}

                        {active === 'IMPG' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            {impg.length > 0 && <GSTRIMPG data={impg} />}
                          </Grid>
                        )}

                        {active === 'IMPGSEZ' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            {impgsez.length > 0 && (
                              <GSTRIMPGSEZ data={impgsez} />
                            )}
                          </Grid>
                        )}
                      </Grid>
                    </Card>
                  )}
                </Col>
              </Grid>
            )}
          </>
        )}
      </div>
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
      {openPurchasesImportFrom2B && <CustomVendorPurchases />}
    </>
  );
};

export default injectWithObserver(GSTR2BOnline);