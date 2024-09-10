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
  TextField,
  useMediaQuery,
  useTheme,
  Box
} from '@material-ui/core';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import getStateList from 'src/components/StateList';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import useWindowDimensions from 'src/components/windowDimension';
import { Col } from 'react-flexbox-grid';
import DeleteIcon from '@material-ui/icons/Delete';
import { AgGridReact } from 'ag-grid-react';

import {
  getSelectedDateMonthAndYearMMYYYY,
  getSelectedDayDateMonthAndYearMMYYYY,
  getSelectedMonthAndYearMMYYYY
} from 'src/components/Helpers/DateHelper';
import AddInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import GSTR1OnlinePortal from './GSTR1OnlinePortal';
import Loader from 'react-js-loader';
import Moreoptions from 'src/components/MoreOptionsGstr1Error';
import moreoption from 'src/components/Options';

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
    width: '100%',
    fontSize: '12px',
    marginBottom: '20px'
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
  rowBtn: {
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    }
  },
  errorSummaryBtn: {
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
  },
  btn: {
    backgroundColor: '#185291',
    border: '1px solid #14375d',
    color: '#fff'
  }
}));

const GSTR1ReviewDataStep1 = () => {
  const classes = useStyles();
  const stores = useStore();
  const { getTaxSettingsDetails } = stores.TaxSettingsStore;

  const [onlineJsonData, setOnlineJsonData] = useState({});

  const [active, setActive] = useState('');
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
    getCDNRAData,
    getCDNURAData,
    setGSTR1UploadData,
    getGstr1SummaryData,
    updateReviewStep,
    setGSTR1SummaryUploadData,
    getNilDataFromSale,
    getNilDataFromSalesReturn,
    resetData,
    getExportSalesDataForGSTR,
    getExportASalesDataForGSTR,
    getB2bEInvoiceSalesDataForGSTR
  } = store.GSTR1Store;

  const {
    b2clSalesList,
    b2csSalesList,
    cdnrList,
    cdnurList,
    exempList,
    hsnSalesList,
    hsnWiseSalesData,
    b2bSalesListJSON,
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
    financialMonth,
    reviewStep,
    docErrorsListJSON,
    cdnraListJSON,
    cdnuraSalesReturnListJSON,
    nilSalesListData,
    nilSalesReturnListData,
    expSalesListJSON,
    expASalesListJSON,
    b2bEInvoiceSalesListJSON
  } = toJS(store.GSTR1Store);

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
  const [cdnra, setCDNRA] = useState();
  const [b2cs, setB2CS] = useState();
  const [cdnur, setCDNUR] = useState();
  const [cdnura, setCDNURA] = useState();
  const [hsn, setHSN] = useState();
  const [doc, setDOC] = useState({});
  const [b2csa, setB2CSA] = useState();
  const [fData, setFData] = useState(0);
  const [summary, setSummary] = useState();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorGridApi, setErrorGridApi] = useState(null);
  const [errorGridColumnApi, setErrorGridColumnApi] = useState(null);
  const [taxData, setTaxData] = useState();
  const [nil, setNil] = useState();
  const [exp, setEXP] = useState();
  const [expa, setEXPA] = useState();

  let hsn_qty = 0;
  let hsn_txval = 0;
  let hsn_camt = 0;
  let hsn_samt = 0;
  let hsn_iamt = 0;

  useEffect(() => {
    if (prepareOnlineData === true) {
      fetchData();
    }
  }, [prepareOnlineData]);

  async function fetchData() {
    console.log('Fetching data started...');

    const startTime = Date.now();

    await resetDocErrorsListJSON();
    setShowDataPrepLoader(true);
    let taxData = await getTaxSettingsDetails();
    setTaxData(taxData);

    await resetData();
    // Run some functions concurrently using Promise.all
    await Promise.all([
      getB2bSalesDataForGSTR(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getB2bSalesData(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getB2bEInvoiceSalesDataForGSTR(
        GSTRDateRange.fromDate,
        GSTRDateRange.toDate
      ),
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
      getB2CSASalesDataForGSTR(
        taxData.state,
        GSTRDateRange.fromDate,
        GSTRDateRange.toDate
      ),
      getB2bASalesDataForGSTR(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getB2CLASalesDataForGSTR(
        taxData.state,
        GSTRDateRange.fromDate,
        GSTRDateRange.toDate
      ),
      getCDNRAData(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getCDNURAData(
        taxData.state,
        GSTRDateRange.fromDate,
        GSTRDateRange.toDate
      ),
      getNilDataFromSale(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getNilDataFromSalesReturn(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getExportSalesDataForGSTR(GSTRDateRange.fromDate, GSTRDateRange.toDate),
      getExportASalesDataForGSTR(GSTRDateRange.fromDate, GSTRDateRange.toDate),
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
  }

  useEffect(() => {
    async function fetchData() {
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
        setCDNRA(onlineJsonData.cdnra);
        setCDNURA(onlineJsonData.chnura);
        setNil(onlineJsonData.nil);
        setEXP(onlineJsonData.exp);
        setEXPA(onlineJsonData.expa);

        let taxData = await getTaxSettingsDetails();
        const sumData = await getGstr1SummaryData(
          GSTRDateRange.fromDate,
          GSTRDateRange.toDate,
          taxData.state
        );

        setSummary(sumData);
        setGSTR1SummaryUploadData(sumData);

        // Prepare
        handleShowDataPrepLoaderClose();
      } else {
        handleShowDataPrepLoaderClose();
      }
    }
    fetchData();
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
        stateCode = defaultState ? defaultState.code : '';
      } else if (taxData.state === obj.placeOfSupplyName) {
        sply_ty = 'INTRA';
        stateCode = defaultState ? defaultState.code : '';
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
        //chksum: checksum
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
      fp: getSelectedMonthAndYearMMYYYY(financialYear, financialMonth),
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

    if (cdnraListJSON && cdnraListJSON.length > 0) {
      finalJson.cdnra = cdnraListJSON;
    }

    if (cdnuraSalesReturnListJSON && cdnuraSalesReturnListJSON.length > 0) {
      finalJson.cdnura = cdnuraSalesReturnListJSON;
    }

    if (expSalesListJSON && expSalesListJSON.length > 0) {
      finalJson.exp = expSalesListJSON;
    }

    if (expASalesListJSON && expASalesListJSON.length > 0) {
      finalJson.expa = expASalesListJSON;
    }

    let nilData;
    if (
      nilSalesListData &&
      nilSalesListData.length > 0 &&
      nilSalesReturnListData &&
      nilSalesReturnListData.length === 0
    ) {
      nilData = {
        inv: nilSalesListData
      };
    } else if (
      nilSalesListData &&
      nilSalesListData.length > 0 &&
      nilSalesReturnListData &&
      nilSalesReturnListData.length > 0
    ) {
      for (let nil of nilSalesListData) {
        for (let nilReturn of nilSalesReturnListData) {
          if (nil.sply_ty === nilReturn.sply_ty) {
            nil.expt_amt = nil.expt_amt - nilReturn.expt_amt;
            nil.nil_amt = nil.nil_amt - nilReturn.nil_amt;
            nil.ngsup_amt = nil.ngsup_amt - nilReturn.ngsup_amt;
          }
        }
      }

      if (nilSalesListData && nilSalesListData.length > 0) {
        nilData = {
          inv: nilSalesListData
        };
      }
    }

    if (nilData) {
      finalJson.nil = nilData;
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

  const addRow = (index) => {
    const newData = doc;
    newData.doc_det[index].docs.push({
      num: newData.doc_det[index].docs.length + 1,
      to: '0',
      from: '0',
      totnum: '0',
      cancel: '0',
      net_issue: '0'
    });
    setDOC(newData);
  };

  const addHSNRow = () => {
    setHSN((prevDoc) => {
      const newData = { ...prevDoc };
      newData.data.push({
        num: newData.data.length + 1,
        hsn_sc: '',
        desc: '',
        uqc: '',
        qty: 0,
        txval: 0,
        camt: 0,
        samt: 0,
        csamt: 0,
        rt: 0
      });

      return newData;
    });
  };
  const deleteDocData = (index, index1) => {
    setDOC((prevDoc) => {
      const newData = { ...prevDoc };
      newData.doc_det[index].docs.splice(index1, 1);
      if (newData.doc_det[index].docs.length === 0) {
        const updateJson = { ...onlineJsonData };
        delete updateJson.doc_issue;
        setOnlineJsonData(updateJson);
        setGSTR1UploadData(updateJson);
      } else {
        const updateJson = { ...onlineJsonData };
        updateJson.doc_issue = newData;
        setOnlineJsonData(updateJson);
        setGSTR1UploadData(updateJson);
      }

      return newData;
    });
  };
  const deleteHSNData = (index) => {
    setHSN((prevDoc) => {
      const newData = { ...prevDoc };
      newData.data.splice(index, 1);

      if (newData.data.length === 0) {
        const updateJson = { ...onlineJsonData };
        delete updateJson.hsn;
        setOnlineJsonData(updateJson);
        setGSTR1UploadData(updateJson);
      } else {
        const updateJson = { ...onlineJsonData };
        updateJson.hsn = newData;
        setOnlineJsonData(updateJson);
        setGSTR1UploadData(updateJson);
      }
      return newData;
    });
  };

  const preUpdateJSON = (index, index1, value, name) => {
    setDOC((prevDoc) => {
      if (name === 'totnum' || name === 'cancel') {
        value = parseInt(value || 0);
      }
      const newData = { ...prevDoc };
      newData.doc_det[index].docs[index1][name] = value;
      if (name === 'totnum' || name === 'cancel') {
        newData.doc_det[index].docs[index1].net_issue =
          newData.doc_det[index].docs[index1].totnum -
          newData.doc_det[index].docs[index1].cancel;
      }
      const updateJson = { ...onlineJsonData };
      updateJson.doc_issue = newData;
      setOnlineJsonData(updateJson);
      setGSTR1UploadData(updateJson);
      return newData;
    });
  };

  const preUpdateHSNJSON = (index, value, name) => {
    setHSN((prevDoc) => {
      let newData = { ...prevDoc };
      if (name === 'hsn_sc' || name === 'desc' || name === 'uqc') {
        newData.data[index][name] = value;
      } else {
        newData.data[index][name] = value ? parseFloat(value) : '';
      }

      newData.desc =
        newData.desc && newData.desc.length > 30
          ? `${newData.desc.substring(0, 30)}...`
          : newData.desc;

      const updateJson = { ...onlineJsonData };
      updateJson.hsn = newData;
      setOnlineJsonData(updateJson);
      setGSTR1UploadData(updateJson);
      return newData;
    });
  };

  const gotoSection = (name) => {
    setActive(name);
    updateReviewStep(2);
  };

  const onErrorGridReady = (params) => {
    setErrorGridApi(params.api);
    setErrorGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const createColumnDef = (
    headerName,
    field,
    width = 100,
    minWidth = 120,
    valueFormatter
  ) => ({
    headerName,
    field,
    width,
    minWidth,
    filterParams: {
      buttons: ['reset', 'apply'],
      closeOnApply: true
    },
    valueFormatter
  });

  const [errorColumnDefs] = useState([
    createColumnDef('GSTIN/UIN', 'gstNumber'),
    createColumnDef('Customer Name', 'customerName'),
    createColumnDef('Place of Supply', 'placeOfSupply'),
    createColumnDef('Type', 'type', 150, 150),
    createColumnDef('Invoice Number', 'sequenceNumber'),
    createColumnDef('Invoice Date', 'date'),
    createColumnDef('Invoice Value', 'total', 100, 120, null, false),
    createColumnDef('Taxable Value', 'taxableValue', 100, 120, null, false),
    {
      headerName: '',
      field: '',
      width: 100,
      minWidth: 100,
      suppressMenu: true,
      sortable: false,
      cellRenderer: 'templateActionRenderer'
    }
  ]);

  const TemplateActionRenderer = (props) => {
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        index={props['data']['sequenceNumber']}
        item={props['data']}
        id={props['data']['sequenceNumber']}
        component="salesList"
      />
    );
  };

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 100,
    headerHeight: 30,
    suppressMenuHide: true,

    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  return (
    <div>
      {!proceedToOnlineFiling && (
        <div className={classes.step2}>
          <Grid fluid className="app-main" style={{ height: height - 110 }}>
            <Col className="content-column" xs>
              <Card className={classes.card}>
                {reviewStep == '1' && (
                  <>
                    <Typography style={{ paddingLeft: '10px' }} variant="h6">
                      GSTIN : {taxData ? taxData.gstin : ''}
                    </Typography>
                    <Typography
                      style={{ paddingLeft: '10px', paddingTop: '10px' }}
                      variant="h6"
                    >
                      FP :{' '}
                      {getSelectedDateMonthAndYearMMYYYY(
                        GSTRDateRange.fromDate
                      )}
                    </Typography>
                    <Grid
                      container
                      direction="row"
                      style={{ padding: '20px 20px 0px 20px' }}
                      alignItems="stretch"
                    >
                      <div style={{ marginTop: '10px', width: '100%' }}>
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
                            {titles?.map((item, index) => (
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
                                  {summary?.[item.value]?.numberOfVoucher}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    summary?.[item.value]?.txval || 0
                                  ).toFixed(2)}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    summary?.[item.value]?.samt || 0
                                  ).toFixed(2)}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    summary?.[item.value]?.camt || 0
                                  ).toFixed(2)}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    summary?.[item.value]?.iamt || 0
                                  ).toFixed(2)}
                                </td>
                                <td className={`${classes.rowstyle}`}>
                                  {parseFloat(
                                    summary?.[item.value]?.total || 0
                                  ).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                            <tr
                              style={{ cursor: 'pointer' }}
                              className={classes.rowBtn}
                              onClick={() => {
                                setActive('HSN Summary');
                                updateReviewStep(2);
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
                                updateReviewStep(2);
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
                                <b>{summary?.['total']?.vouchersTotal || 0}</b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    summary?.['total']?.taxableTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    summary?.['total']?.cgstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    summary?.['total']?.sgstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    summary?.['total']?.igstTotal || 0
                                  ).toFixed(2)}
                                </b>
                              </th>
                              <th
                                className={`${classes.headstyle} ${classes.rowstyle}`}
                              >
                                <b>
                                  {parseFloat(
                                    summary?.['total']?.invTotal || 0
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
                        padding: '0 20px 0 20px',
                        cursor: 'pointer',
                        marginBottom: '50px'
                      }}
                    >
                      <Typography
                        variant="h6"
                        className={classes.errorSummaryBtn}
                        style={{ border: '1px solid #ddd', padding: '8px' }}
                        onClick={() => {
                          setActive('Error Summary');
                          updateReviewStep(2);
                        }}
                      >
                        Error Summary :{' '}
                        {docErrorsListJSON ? docErrorsListJSON.length : 0}
                      </Typography>
                    </div>
                  </>
                )}

                {reviewStep == '2' && (
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
                    {active === 'B2B E-Invoices (In Portal)' && (
                      <>
                        {b2bEInvoiceSalesListJSON && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {b2bEInvoiceSalesListJSON?.map((pitem, index) => (
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
                                        toggleAnswerVisibility(
                                          'b2beinv_' + index
                                        )
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
                                  </div>
                                  <div
                                    className="answer"
                                    style={{
                                      display: 'block'
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
                                              Return Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Return Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Pos
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.nt?.map((item) => (
                                            <tr>
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

                    {active === 'CDNRA' && (
                      <>
                        {cdnra && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {cdnra?.map((pitem, index) => (
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
                                              Return Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Return Date
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
                                              Pos
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.nt?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.nt_num}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.ont_dt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.nt_dt}
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
                                        Date
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
                                          {item.nt_dt}
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

                    {active === 'CDNURA' && (
                      <>
                        {cdnura && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {cdnura?.map((pitem, index) => (
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
                                              Return Number
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Return Date
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
                                              Pos
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.nt?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.nt_num}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.ont_dt}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.nt_dt}
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

                    {active === 'EXP' && (
                      <>
                        {exp && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {exp?.map((pitem, index) => (
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
                                        EXPORT TYPE : {pitem?.exp_type}
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
                                        toggleAnswerVisibility('exp_' + index)
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
                                              Inv No
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Inv Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Shipping Port Code
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Shipping Bill No
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Shipping Bill Date
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
                                                {item.sbpcode}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.sbnum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.sbdt}
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

                    {active === 'EXP - EINV' && <></>}

                    {active === 'EXPA' && (
                      <>
                        {expa && (
                          <Grid
                            item
                            xs={12}
                            className={`grid-padding ${classes.mb_20}`}
                          >
                            <div>
                              {expa?.map((pitem, index) => (
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
                                        EXPORT TYPE : {pitem?.exp_type}
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
                                        toggleAnswerVisibility('exp_' + index)
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
                                              Inv No
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Inv Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Amended No
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Amended Date
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Value
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Shipping Port Code
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Shipping Bill No
                                            </th>
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Shipping Bill Date
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.inv?.map((item) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.oinum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.odt}
                                              </td>
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
                                                {item.sbpcode}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.sbnum}
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                {item.sbdt}
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

                    {active === 'NIL' && (
                      <>
                        {nil && (
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
                                        Description
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Nil Rated Supplies
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Exempted(Other than Nil rated/non-GST
                                        supply)
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        Non-GST Supplies
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {nil.inv?.map((item) => (
                                      <tr>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.sply_ty}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.nil_amt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.expt_amt}
                                        </td>
                                        <td className={`${classes.rowstyle}`}>
                                          {item.ngsup_amt}
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
                                      style={{
                                        cursor: 'pointer',
                                        padding: '10px'
                                      }}
                                      onClick={() =>
                                        toggleAnswerVisibility('doc_' + index)
                                      }
                                    >
                                      <Button
                                        variant="outlined"
                                        onClick={() => addRow(index)}
                                        className={classes.btn}
                                      >
                                        Add Row
                                      </Button>
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
                                            <th
                                              className={`${classes.headstyle} ${classes.rowstyle}`}
                                            >
                                              Net Issue
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {pitem?.docs?.map((item, index1) => (
                                            <tr>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                <TextField
                                                  style={{ width: '70%' }}
                                                  required
                                                  variant="outlined"
                                                  margin="dense"
                                                  type="text"
                                                  className="customTextField"
                                                  value={item.from}
                                                  onChange={(e) =>
                                                    preUpdateJSON(
                                                      index,
                                                      index1,
                                                      e.target.value,
                                                      'from'
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                <TextField
                                                  style={{ width: '70%' }}
                                                  required
                                                  variant="outlined"
                                                  margin="dense"
                                                  type="text"
                                                  className="customTextField"
                                                  value={item.to}
                                                  onChange={(e) =>
                                                    preUpdateJSON(
                                                      index,
                                                      index1,
                                                      e.target.value,
                                                      'to'
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                <TextField
                                                  style={{ width: '70%' }}
                                                  required
                                                  variant="outlined"
                                                  margin="dense"
                                                  type="number"
                                                  className="customTextField"
                                                  value={item.totnum}
                                                  onChange={(e) =>
                                                    preUpdateJSON(
                                                      index,
                                                      index1,
                                                      e.target.value,
                                                      'totnum'
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                              >
                                                <TextField
                                                  style={{ width: '70%' }}
                                                  required
                                                  variant="outlined"
                                                  margin="dense"
                                                  type="number"
                                                  className="customTextField"
                                                  value={item.cancel}
                                                  onChange={(e) =>
                                                    preUpdateJSON(
                                                      index,
                                                      index1,
                                                      e.target.value,
                                                      'cancel'
                                                    )
                                                  }
                                                />
                                              </td>
                                              <td
                                                className={`${classes.rowstyle}`}
                                                style={{ display: 'flex' }}
                                              >
                                                <TextField
                                                  style={{
                                                    width: '70%',
                                                    backgroundColor: '#80808033'
                                                  }}
                                                  disabled
                                                  variant="outlined"
                                                  margin="dense"
                                                  type="number"
                                                  className="customTextField"
                                                  value={item.net_issue}
                                                />
                                                <IconButton
                                                  onClick={() =>
                                                    deleteDocData(index, index1)
                                                  }
                                                >
                                                  <DeleteIcon />
                                                </IconButton>
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
                              <Button
                                variant="outlined"
                                onClick={addHSNRow}
                                className={classes.btn}
                              >
                                Add Row
                              </Button>
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
                                    {hsn?.data?.map((item, index) => {
                                      hsn_qty += parseFloat(item.qty || 0);
                                      hsn_txval += parseFloat(item.txval || 0);
                                      hsn_camt += parseFloat(item.camt || 0);
                                      hsn_samt += parseFloat(item.samt || 0);
                                      hsn_iamt += parseFloat(item.iamt || 0);

                                      return (
                                        <tr>
                                          <td className={`${classes.rowstyle}`}>
                                            <TextField
                                              style={{
                                                width: '70%'
                                              }}
                                              variant="outlined"
                                              onChange={(e) =>
                                                preUpdateHSNJSON(
                                                  index,
                                                  e.target.value,
                                                  'hsn_sc'
                                                )
                                              }
                                              margin="dense"
                                              type="text"
                                              className="customTextField"
                                              value={item.hsn_sc}
                                            />
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            <TextField
                                              style={{
                                                width: '70%'
                                              }}
                                              variant="outlined"
                                              margin="dense"
                                              type="number"
                                              onChange={(e) =>
                                                preUpdateHSNJSON(
                                                  index,
                                                  e.target.value,
                                                  'qty'
                                                )
                                              }
                                              className="customTextField"
                                              value={item.qty}
                                            />
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            <TextField
                                              style={{
                                                width: '70%'
                                              }}
                                              variant="outlined"
                                              margin="dense"
                                              type="text"
                                              className="customTextField"
                                              onChange={(e) =>
                                                preUpdateHSNJSON(
                                                  index,
                                                  e.target.value,
                                                  'uqc'
                                                )
                                              }
                                              value={item.uqc}
                                            />
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            <TextField
                                              style={{
                                                width: '70%'
                                              }}
                                              variant="outlined"
                                              margin="dense"
                                              type="number"
                                              className="customTextField"
                                              onChange={(e) =>
                                                preUpdateHSNJSON(
                                                  index,
                                                  e.target.value,
                                                  'rt'
                                                )
                                              }
                                              value={item.rt}
                                            />
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            <TextField
                                              style={{
                                                width: '70%'
                                              }}
                                              variant="outlined"
                                              margin="dense"
                                              type="number"
                                              className="customTextField"
                                              value={item.txval}
                                              onChange={(e) =>
                                                preUpdateHSNJSON(
                                                  index,
                                                  e.target.value,
                                                  'txval'
                                                )
                                              }
                                            />
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            <TextField
                                              style={{
                                                width: '70%'
                                              }}
                                              variant="outlined"
                                              margin="dense"
                                              type="number"
                                              className="customTextField"
                                              value={item.camt}
                                              onChange={(e) =>
                                                preUpdateHSNJSON(
                                                  index,
                                                  e.target.value,
                                                  'camt'
                                                )
                                              }
                                            />
                                          </td>
                                          <td className={`${classes.rowstyle}`}>
                                            <TextField
                                              style={{
                                                width: '70%'
                                              }}
                                              variant="outlined"
                                              margin="dense"
                                              type="number"
                                              className="customTextField"
                                              value={item.samt}
                                              onChange={(e) =>
                                                preUpdateHSNJSON(
                                                  index,
                                                  e.target.value,
                                                  'samt'
                                                )
                                              }
                                            />
                                          </td>
                                          <td
                                            className={`${classes.rowstyle}`}
                                            style={{ display: 'flex' }}
                                          >
                                            <TextField
                                              style={{
                                                width: '70%'
                                              }}
                                              variant="outlined"
                                              margin="dense"
                                              type="number"
                                              className="customTextField"
                                              value={item.iamt}
                                              onChange={(e) =>
                                                preUpdateHSNJSON(
                                                  index,
                                                  e.target.value,
                                                  'iamt'
                                                )
                                              }
                                            />
                                            <IconButton
                                              onClick={() =>
                                                deleteHSNData(index)
                                              }
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </td>
                                        </tr>
                                      );
                                    })}
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
                                        <b>{hsn_qty}</b>
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      ></th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      ></th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        <b>
                                          {parseFloat(hsn_txval).toFixed(2)}
                                        </b>
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        <b>{parseFloat(hsn_camt).toFixed(2)}</b>
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        <b>{parseFloat(hsn_samt).toFixed(2)}</b>
                                      </th>
                                      <th
                                        className={`${classes.headstyle} ${classes.rowstyle}`}
                                      >
                                        <b>{parseFloat(hsn_iamt).toFixed(2)}</b>
                                      </th>
                                    </tr>
                                  </thead>
                                </table>
                              </div>
                            </div>
                          </Grid>
                        )}
                      </>
                    )}

                    {active === 'Error Summary' && (
                      <div
                        className={classes.root}
                        style={{ minHeight: height - 262, width: '100%' }}
                      >
                        <div className={classes.itemTable}>
                          <Box mt={4}>
                            <div
                              style={{
                                width: '100%',
                                height: height - 255 + 'px'
                              }}
                              className=" blue-theme"
                            >
                              <div
                                id="product-list-grid"
                                style={{ height: '100%', width: '100%' }}
                                className="ag-theme-material"
                              >
                                <AgGridReact
                                  onGridReady={onErrorGridReady}
                                  enableRangeSelection
                                  paginationPageSize={20}
                                  suppressMenuHide
                                  rowData={docErrorsListJSON}
                                  columnDefs={errorColumnDefs}
                                  defaultColDef={defaultColDef}
                                  rowSelection="single"
                                  pagination
                                  headerHeight={40}
                                  rowClassRules={rowClassRules}
                                  overlayLoadingTemplate={
                                    '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                                  }
                                  frameworkComponents={{
                                    templateActionRenderer:
                                      TemplateActionRenderer
                                  }}
                                />
                              </div>
                            </div>
                          </Box>
                        </div>
                      </div>
                    )}
                  </Grid>
                )}
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

export default InjectObserver(GSTR1ReviewDataStep1);