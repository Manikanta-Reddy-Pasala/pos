import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../Expenses/ExpenseTable.css';
import {
  Typography,
  Grid,
  IconButton,
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog,
  Card,
  useMediaQuery,
  useTheme
} from '@material-ui/core';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import getStateList from 'src/components/StateList';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import useWindowDimensions from 'src/components/windowDimension';
import { Col } from 'react-flexbox-grid';

import {
  getSelectedDateMonthAndYearMMYYYY,
  getSelectedDayDateMonthAndYearMMYYYY,
  getSelectedMonthAndYearMMYYYY
} from 'src/components/Helpers/DateHelper';
import AddInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import List from '@material-ui/core/List';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import classnames from 'classnames';
import GSTR1OnlinePortal from './GSTR1OnlinePortal';
import Loader from 'react-js-loader';

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
    paddingBottom: 10,
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
  filterBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    height: '38px',
    marginTop: '10px',
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    }
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    color: 'grey'
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
  categoryActionWrapper: {
    paddingRight: '10px',
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
  sticky: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '99999',
    padding: '10px'
  },
  stickyTop: {
    color: '#fff',
    overflowX: 'hidden',
    position: 'absolute',
    textAlign: 'center',
    zIndex: '99999',
    padding: '10px',
    top: '77px',
    right: '28px'
  }
}));

const GSTR1ReviewDataStep2 = () => {
  const classes = useStyles();
  const stores = useStore();
  const { getTaxSettingsDetails } = stores.TaxSettingsStore;

  const [onlineJsonData, setOnlineJsonData] = useState({});

  const [active, setActive] = useState('Document Summary');
  const [moreVisibility, setMoreVisibility] = useState({});

  const store = useStore();
  const { height } = useWindowDimensions();
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);
  const { openAddSalesInvoice } = toJS(store.SalesAddStore);
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);
  const [includeHSN, setIncludeHSN] = React.useState(false);
  const titles = [
    'Document Summary',
    'HSN Summary'
  ];
  const [showDataPrepLoader, setShowDataPrepLoader] = React.useState(false);

  const handleShowDataPrepLoaderClose = () => {
    setShowDataPrepLoader(false);
  };

  const handleErrorAlertMessageClose = () => {
    setErrorMessage('');
    setErrorAlertMessage(false);
  };

  const {
    resetDocErrorsListJSON,
    getB2bSalesDataForGSTR,
    getB2bSalesData,
    getB2CLSalesDataForGSTR,
    getB2CSSalesDataForGSTR,
    getHSNSalesDataForGSTR,
    getSalesReturnData,
    getCDNRData,
    getCDNURData,
    getHSNWiseSalesData,
    getJSONErrorList,
    proceedToOnlineFilingScreen,
    getB2CSASalesDataForGSTR,
    getB2bASalesDataForGSTR,
    getB2CLASalesDataForGSTR,
    setGSTR1UploadData,
    Dummy
  } = store.GSTR1Store;

  const {
    b2clSalesList,
    b2csSalesList,
    hsnWiseSalesData,
    b2bSalesListJSON,
    b2bSalesListJSONDummy,
    cdnurListJSON,
    cdnrListJSON,
    docIssueSales,
    docIssueSalesReturn,
    GSTRDateRange,
    prepareOnlineData,
    proceedToOnlineFiling,
    b2csaSalesListJSON,
    b2baSalesListJSON,
    b2claSalesListJSON,
    financialYear,
    financialMonth
  } = store.GSTR1Store;
  const { isLaunchEWayAfterSaleCreation, printData } = toJS(
    store.SalesAddStore
  );
  const { resetEWayLaunchFlag } = store.SalesAddStore;
  const { handleOpenEWayGenerateModal } = store.EWayStore;

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
  const [fData, setFData] = useState(0);
  const [summary, setSummary] = useState();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (prepareOnlineData === true) {
      fetchData();
    }
  }, [prepareOnlineData]);

  async function fetchData() {
    console.log('Fetching data started...');
    const startTime = Date.now();

    await resetDocErrorsListJSON();
    let taxData = await getTaxSettingsDetails();

    setShowDataPrepLoader(true);
    // Run some functions concurrently using Promise.all
    await Promise.all([
      getB2bSalesDataForGSTR(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getB2bSalesData(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getB2CLSalesDataForGSTR(
        taxData.state,
        GSTRDateRange.fromDate,
        GSTRDateRange.toDate
      ),
      getB2CSSalesDataForGSTR(
        taxData.state,
        GSTRDateRange.fromDate,
        GSTRDateRange.toDate
      ),
      getHSNSalesDataForGSTR(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getSalesReturnData(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getCDNRData(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getCDNURData(taxData.state, GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getB2CSASalesDataForGSTR(taxData.state, GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getB2bASalesDataForGSTR(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getB2CLASalesDataForGSTR(taxData.state, GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getHSNWiseSalesData(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getJSONErrorList()
    ]);
    setFData(1);
    const endTime = Date.now();
    console.log(
      'Fetching data completed. Time taken:',
      endTime - startTime,
      'milliseconds'
    );

    console.log('filter12', b2bSalesListJSON);

    // setTimeout(() => {
    //   downloadJson(false, true, false);
    // }, 500);
  }

  useEffect(() => {
    if (onlineJsonData) {
      setB2B(onlineJsonData.b2b);
      setB2CL(onlineJsonData.b2cl);
      setCDNR(onlineJsonData.cdnr);
      setB2CS(onlineJsonData.b2cs);
      setCDNUR(onlineJsonData.cdnur);
      setHSN(onlineJsonData.hsn);
      setDOC(onlineJsonData.doc_issue);
      setB2CSA(onlineJsonData.b2csa);
      setB2BA(onlineJsonData.b2ba);
      setB2CLA(onlineJsonData.b2cla);

      // Prepare
      handleShowDataPrepLoaderClose();
    } else {
      handleShowDataPrepLoaderClose();
    }
  }, [onlineJsonData]);

  useEffect(() => {
    downloadJson(false, true, false);
  }, [fData]);

  const toggleAnswerVisibility = (category) => {
    setMoreVisibility((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const downloadJson = async (ignoreErrorAndProceed, includeHSN, download) => {
    setIncludeHSN(includeHSN);
    if (download) {
      if (!ignoreErrorAndProceed) {
        let errorData = await getJSONErrorList();

        if (errorData && errorData.length > 0) {
          setErrorMessage(
            'Please resolve all errors provided under Error Report before you proceed to download JSON file for download.'
          );
          setErrorAlertMessage(true);
          return;
        }
      }
    }

    let taxData = await getTaxSettingsDetails();

    //prepare b2cs data
    //all other data are already formatted
    const b2csSalesListJson = b2csSalesList.map((obj) => {
      let sply_ty = 'INTRA';
      let defaultState = getStateList().find((e) => e.name === taxData.state);
      let stateCode;

      if (
        obj.placeOfSupplyName === '' ||
        obj.placeOfSupplyName === ' ' ||
        obj.placeOfSupplyName === null ||
        taxData.state === obj.placeOfSupplyName
      ) {
        sply_ty = 'INTRA';
        stateCode = defaultState.code;
      } else if (taxData.state === obj.placeOfSupplyName) {
        sply_ty = 'INTRA';
        stateCode = defaultState.code;
      } else {
        sply_ty = 'INTER';
        const stateCodeData = getStateList().find(
          (e) => e.name === obj.placeOfSupplyName
        );

        if (stateCodeData && stateCodeData !== null) {
          stateCode = stateCodeData.code;
        }
      }

      let jsonData;
      if (obj.igst_amount && obj.igst_amount > 0) {
        jsonData = {
          sply_ty: sply_ty,
          rt: obj.tax_percentage,
          typ: 'OE',
          pos: stateCode,
          txval: parseFloat(obj.txval.toFixed(2)),
          iamt: parseFloat(obj.igst_amount.toFixed(2)),
          csamt: 0
        };
      } else {
        jsonData = {
          sply_ty: sply_ty,
          rt: obj.tax_percentage,
          typ: 'OE',
          pos: stateCode,
          txval: parseFloat(obj.txval.toFixed(2)),
          camt: parseFloat(obj.cgst_amount.toFixed(2)),
          samt: parseFloat(obj.sgst_amount.toFixed(2)),
          csamt: 0
        };
      }

      // const checksum = calculateChecksum(jsonData);

      return {
        ...jsonData
      };
    });

    let finalHsnWiseSalesData = {
      data: hsnWiseSalesData ? hsnWiseSalesData : []
    };

    let docIsuues = {};
    if (
      docIssueSales &&
      docIssueSales.length > 0 &&
      docIssueSalesReturn &&
      docIssueSalesReturn.length > 0
    ) {
      docIsuues = {
        doc_det: [
          {
            doc_num: 1,
            doc_typ: 'Invoices for outward supply',
            docs: docIssueSales
          },
          {
            doc_num: 5, //sales return
            doc_typ: 'Credit Note',
            docs: docIssueSalesReturn
          }
        ]
      };
    } else if (docIssueSales && docIssueSales.length > 0) {
      docIsuues = {
        doc_det: [
          {
            doc_num: 1,
            doc_typ: 'Invoices for outward supply',
            docs: docIssueSales
          }
        ]
      };
    } else if (docIssueSalesReturn && docIssueSalesReturn.length > 0) {
      docIsuues = {
        doc_det: [
          {
            doc_num: 5, //sales return
            doc_typ: 'Credit Note',
            docs: docIssueSalesReturn
          }
        ]
      };
    }

    let finalJson = {
      gstin: taxData.gstin,
      fp: getSelectedMonthAndYearMMYYYY(financialYear,financialMonth),
      //  version: 'GST3.0.4',
      // hash: 'hash',
      gt: 0.0,
      cur_gt: 0.0
    };

    if (b2bSalesListJSON && b2bSalesListJSON.length > 0) {
      finalJson.b2b = b2bSalesListJSON;
    }

    if (b2csSalesListJson && b2csSalesListJson.length > 0) {
      finalJson.b2cs = b2csSalesListJson;
    }

    if (b2clSalesList && b2clSalesList.length > 0) {
      finalJson.b2cl = b2clSalesList;
    }

    if (cdnrListJSON && cdnrListJSON.length > 0) {
      finalJson.cdnr = cdnrListJSON;
    }

    if (cdnurListJSON && cdnurListJSON.length > 0) {
      finalJson.cdnur = cdnurListJSON;
    }

    if (b2csaSalesListJSON && b2csaSalesListJSON.length > 0) {
      finalJson.b2csa = b2csaSalesListJSON;
    }

    if (b2baSalesListJSON && b2baSalesListJSON.length > 0) {
      finalJson.b2ba = b2baSalesListJSON;
    }

    if (b2claSalesListJSON && b2claSalesListJSON.length > 0) {
      finalJson.b2cla = b2claSalesListJSON;
    }

    if (docIsuues) {
      finalJson.doc_issue = docIsuues;
    }

    if (
      finalHsnWiseSalesData &&
      finalHsnWiseSalesData.data.length > 0 &&
      includeHSN === true
    ) {
      finalJson.hsn = finalHsnWiseSalesData;
    }
    console.log('finalJson', finalJson);
    const data = JSON.stringify(finalJson);
    setOnlineJsonData(finalJson);
    setGSTR1UploadData(finalJson);
    if (download) {
      const blob = new Blob([data], { type: 'application/json' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      link.download =
        'GSTR-1_' +
        taxData.gstin +
        '_' +
        getSelectedDayDateMonthAndYearMMYYYY() +
        '.json';
      link.click();

      URL.revokeObjectURL(link.href);
    }
  };

  const proceedtoUpload = () => {
    proceedToOnlineFilingScreen(true);
  };

  return (
    <div>
      {!proceedToOnlineFiling && (
        <div className={classes.step2}>
          <Grid fluid className="app-main" style={{ height: height - 110 }}>
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
                            setActive(pitem);
                          }}
                          className={classnames([
                            classes.cardLists,
                            'menu-item',
                            active === pitem ? 'menu-active' : 'menu-default'
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
                <Grid
                  container
                  direction="row"
                  style={{ padding: '20px' }}
                  alignItems="stretch"
                >
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
                                  >
                                    {/* <IconButton
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
                                    </IconButton> */}
                                  </div>
                                </div>
                                <div
                                  className="answer"
                                // style={{
                                //   display: moreVisibility['b2b_' + index]
                                //     ? 'block'
                                //     : 'none'
                                // }}
                                >
                                  <div style={{ marginTop: '10px' }}>
                                    <table className={`${classes.batchTable}`}>
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
                                    <table className={`${classes.batchTable}`}>
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
                                    <table className={`${classes.batchTable}`}>
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
                                    <table className={`${classes.batchTable}`}>
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
                                    <table className={`${classes.batchTable}`}>
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
                                  >
                                    {/* <IconButton
                                      aria-label="chevron circle up"
                                      style={{
                                        color: '#fff',
                                        padding: '0px'
                                      }}
                                    >
                                      {moreVisibility['doc_' + index] ? (
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
                                //   display: moreVisibility['doc_' + index]
                                //     ? 'block'
                                //     : 'none'
                                // }}
                                >
                                  <div style={{ marginTop: '10px' }}>
                                    <table className={`${classes.batchTable}`}>
                                      <thead>
                                        <tr>
                                          {/* <th className={`${classes.headstyle} ${classes.rowstyle}`}>
                                    Document Type
                                  </th> */}
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
              </Card>
            </Col>
          </Grid>
        </div>
      )}

      {proceedToOnlineFiling ? (
        <GSTR1OnlinePortal jsonData={onlineJsonData} />
      ) : null}
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            {' '}
            <div dangerouslySetInnerHTML={{ __html: errorMessage }}></div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleErrorAlertMessageClose();
              downloadJson(true, includeHSN, true);
            }}
            color="primary"
            autoFocus
          >
            PROCEED ANYWAY
          </Button>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={showDataPrepLoader}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while we are preparing GSTR-1 data!!!</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {openAddSalesInvoice ? <AddInvoice /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(GSTR1ReviewDataStep2);