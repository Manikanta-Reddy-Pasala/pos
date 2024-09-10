import React, { useRef, useState } from 'react';
import {
  Button,
  Card,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles
} from '@material-ui/core';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';

import useWindowDimensions from '../../components/windowDimension';
import List from '@material-ui/core/List';
import { Col } from 'react-flexbox-grid';
import classnames from 'classnames';
import clsx from 'clsx';
import { toJS } from 'mobx';

import { getGstinNumber } from '../../components/Helpers/TaxSettingsHelper';
import { get2AData, get2BData, validateSession } from 'src/components/Helpers/GstrOnlineHelper';

import { getAllPurchasesByGstinAndBillNumber } from 'src/components/Helpers/dbQueries/purchases';
import { getAllExpensesByGstinAndBillNumber } from 'src/components/Helpers/dbQueries/expenses';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import GSTAuth from './GSTAuth';
import Excel from '../../icons/Excel';
import * as ExcelJS from 'exceljs';
import {
  prepare2A2BHeaderRow
} from './GSTR1/GSTRExcelHelper';

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
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  bgColor: {
    background: '#F7F7F7'
  },
  marl: {
    marginLeft: '5px'
  },
  marr: {
    marginRight: '5px'
  },
  greenText: {
    color: '#339900'
  },
  redText: {
    color: '#EF5350'
  },
  tableCellHeaderRoot: {
    border: '1px solid #e0e0e0',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    padding: '0px 30px 0 30px'
  },
  tableCellBodyRoot: {
    border: '1px solid #e0e0e0',
    padding: 2
  },
  filterSection: {
    display: 'flex',
    justifyContent: 'space-around',
    width: '100%',
    margin: 'auto'
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
  centerDiv: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: '-20%'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '8px',
    fontWeight: '400',
    fontSize: '12px',
    color: '#000'
  },
  red: {
    color: 'red'
  },
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


const Purchase2A2BReconciliations = (props) => {
  const myRef = useRef(null);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles();
  const stores = useStore();
  const [active, setActive] = useState('B2B');
  const [b2bData, setB2bData] = useState([]);
  const [b2baData, setB2baData] = useState([]);
  const [cdnData, setCdnData] = useState([]);
  const [cdnaData, setCdnaData] = useState([]);
  const [impgData, setImpgData] = useState([]);
  const [impgsezData, setImpgsezData] = useState([]);
  const [isdData, setIsdData] = useState([]);
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const sections = [
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

  const [dateFilter, setDateFilter] = useState(false);
  const [matched, setMatched] = useState(true);
  const [unmatched, setUnmatched] = useState(true);
  const [onlyInPOS, setOnlyInPOS] = React.useState(0);
  const [matchedRecords, setMatchedRecords] = React.useState(0);
  const [unmatchedRecords, setUnmatchedRecords] = React.useState(0);
  const [onlyInPortal, setOnlyInPortal] = React.useState(0);

  const {
    setFinancialYear,
    setFinancialMonth,
    setGSTRPeriod
  } = stores.GSTR3BStore;
  const {
    financialYear,
    financialMonth,
    months
  } = toJS(stores.GSTR3BStore);

  const {
    updateGSTAuth,
    handleErrorAlertOpen,
    setLoginStep,
    gstAuth,
    openErrorMesssageDialog
  } = stores.GSTR1Store;

  const recTypeList = [
    'Purchase v/s 2A',
    'Purchase v/s 2B',
    '2A v/s 2B',
    'Purchase v/s 2A v/s 2B'
  ];

  const [recType, setRecType] = React.useState(' ');

  const filterList = [
    'Supplier',
    'Reverse Charge',
    'Invoice Type',
    'Filing Status',
    'Amount Mismatch'
  ];

  const [filter, setFilter] = React.useState(' ');



  const setActiveData = (data) => {
    setActive(data);

    switch (data) {
      case 'B2B':
        setData(b2bData);
        checkInBooksOrPortal(b2bData);
        break;
      case 'B2BA':
        setData(b2baData);
        checkInBooksOrPortal(b2baData);
        break;
      case 'B2B-CDNR':
        setData(cdnData);
        checkInBooksOrPortal(cdnData);
        break;
      case 'B2B-CDNRA':
        setData(cdnaData);
        checkInBooksOrPortal(cdnaData);
        break;
      case 'ECO':
        break;
      case 'ISD':
        setData(isdData);
        checkInBooksOrPortal(isdData);
        break;
      case 'ISDA':
        break;
      case 'IMPG':
        setData(impgData);
        checkInBooksOrPortal(impgData);
        break;
      case 'IMPGSEZ':
        setData(impgsezData);
        checkInBooksOrPortal(impgsezData);
        break;
      default:
        return null;
    }
  };

  const load2BData = (type) => {
    switch (type) {
      case 'B2B':
        break;
      case 'B2BA':
        break;
      case 'B2B-CDNR':
        break;
      case 'B2B-CDNRA':
        break;
      case 'ECO':
        break;
      case 'ISD':
        break;
      case 'ISDA':
        break;
      case 'IMPG':
        break;
      case 'IMPGSEZ':
        break;
      default:
        return null;
    }
  };

  const extractData2b = (data, invType) => {
    const result = [];
    if (
      data &&
      data.message &&
      data.message.data &&
      data.message.data.docdata &&
      data.message.data.docdata[invType]
    ) {
      data.message.data.docdata[invType].forEach((invTypeData) => {
        const invDataArray = invTypeData.inv || invTypeData.nt;
        invDataArray.forEach((invData) => {
          const totalTxval = invData.items.reduce(
            (sum, item) => sum + item.txval,
            0
          );
          const totalIgst = invData.items.reduce(
            (sum, item) => sum + item.igst,
            0
          );
          const totalCgst = invData.items.reduce(
            (sum, item) => sum + item.cgst,
            0
          );
          const totalSgst = invData.items.reduce(
            (sum, item) => sum + item.sgst,
            0
          );
          const totalCess = invData.items.reduce(
            (sum, item) => sum + item.cess,
            0
          );
          result.push({
            ctin: invTypeData.ctin,
            supplierName: invTypeData.trdnm,
            inum: invData.inum || invData.ntnum,
            date: invData.dt,
            val: invData.val,
            itc: invData.itcavl,
            rc: invData.rev,
            filledDate: invTypeData.supfildt,
            totalTxval,
            totalIgst,
            totalCgst,
            totalSgst,
            totalCess,
            invType: '2B'
          });
        });
      });
    }
    return result;
  };

  const extractData2a = (data, invType) => {
    const result = [];
    if (data && data.message && data.message[invType]) {
      data.message[invType].forEach((invTypeData) => {
        const invDataArray = invTypeData.inv || invTypeData.nt;

        invDataArray.forEach((invData) => {
          const totalTxval = invData.itms.reduce(
            (sum, item) => sum + item.itm_det.txval,
            0
          );
          const totalIgst = invData.itms.reduce(
            (sum, item) => sum + item.itm_det.iamt,
            0
          );
          const totalCgst = invData.itms.reduce(
            (sum, item) => sum + item.itm_det.camt,
            0
          );
          const totalSgst = invData.itms.reduce(
            (sum, item) => sum + item.itm_det.samt,
            0
          );
          const totalCess = invData.itms.reduce(
            (sum, item) => sum + item.itm_det.csamt,
            0
          );
          result.push({
            ctin: invTypeData.ctin,
            supplierName: null,
            inum: invData.inum,
            date: invData.idt,
            val: invData.val,
            itc: null,
            rc: null,
            filledDate: invTypeData.fldtr1,
            totalTxval,
            totalIgst,
            totalCgst,
            totalSgst,
            totalCess,
            invType: '2A'
          });
        });
      });
    }
    return result;
  };

  const getInvoiceNumberNameByType = () => {
    let name = '';
    switch (active) {
      case 'B2B':
        name = 'INV <br /> NUMBER';
        break;
      case 'B2BA':
        name = 'INV<br />NUMBER';
        break;
      case 'B2B-CDNR':
        name = 'NOTE<br />NUMBER';
        break;
      case 'B2B-CDNRA':
        name = 'NOTE<br />NUMBER';
        break;
      case 'ECO':
        name = 'DOC<br />NUMBER';
        break;
      case 'ISD':
        name = 'ISD DOC<br />NUMBER';
        break;
      case 'ISDA':
        name = 'ISD DOC<br />NUMBER';
        break;
      case 'IMPG':
        name = 'NUMBER';
        break;
      case 'IMPGSEZ':
        name = 'NUMBER';
        break;
      default:
        return null;
    }

    return name;
  };

  const extractDataPurchases = (data) => {
    const result = [];
    if (data && data.length > 0) {
      data.forEach((purchase) => {
        const totalTxval = purchase.item_list.reduce(
          (sum, item) => sum + item.purchased_price_before_tax,
          0
        );
        const totalIgst = purchase.item_list.reduce(
          (sum, item) => sum + item.igst_amount,
          0
        );
        const totalCgst = purchase.item_list.reduce(
          (sum, item) => sum + item.cgst_amount,
          0
        );
        const totalSgst = purchase.item_list.reduce(
          (sum, item) => sum + item.sgst_amount,
          0
        );
        const totalCess = purchase.item_list.reduce(
          (sum, item) => sum + item.cess,
          0
        );

        result.push({
          ctin: purchase.vendor_gst_number,
          supplierName: purchase.vendor_name,
          inum: purchase.vendor_bill_number,
          date: purchase.bill_date,
          val: purchase.total_amount,
          itc: null,
          rc: null,
          filledDate: null,
          totalTxval: totalTxval,
          totalIgst: totalIgst,
          totalCgst: totalCgst,
          totalSgst: totalSgst,
          totalCess: totalCess,
          invType: 'Purchases'
        });
      });
    }

    return result;
  };

  const extractDataExpenses = (data) => {
    const result = [];
    if (data && data.length > 0) {
      data.forEach((expense) => {
        const totalTxval = expense.item_list.reduce(
          (sum, item) => sum + item.price_before_tax,
          0
        );
        const totalIgst = expense.item_list.reduce(
          (sum, item) => sum + item.igst_amount,
          0
        );
        const totalCgst = expense.item_list.reduce(
          (sum, item) => sum + item.cgst_amount,
          0
        );
        const totalSgst = expense.item_list.reduce(
          (sum, item) => sum + item.sgst_amount,
          0
        );
        const totalCess = expense.item_list.reduce(
          (sum, item) => sum + item.cess,
          0
        );

        result.push({
          ctin: expense.vendor_gst_number,
          supplierName: expense.vendor_name,
          inum: expense.billNumber,
          date: expense.date,
          val: expense.total,
          itc: null,
          rc: null,
          filledDate: null,
          totalTxval: totalTxval,
          totalIgst: totalIgst,
          totalCgst: totalCgst,
          totalSgst: totalSgst,
          totalCess: totalCess,
          invType: 'Expenses'
        });
      });
    }

    return result;
  };

  const reconcileData = (
    gstr2aDataArray,
    purchasesExtracted,
    gstr2bDataArray
  ) => {
    // Combine both arrays, keeping unique records based on ctin and inum
    const combinedData = [
      ...gstr2aDataArray,
      ...gstr2bDataArray.filter(
        (b) =>
          !gstr2aDataArray.some(
            (a) => a.ctin === b.ctin && a.inum === b.inum
          )
      )
    ];

    return combinedData.map((entry) => {
      const gstr2a = gstr2aDataArray.find(
        (data) => data.ctin === entry.ctin && data.inum === entry.inum
      ) || {};
      const gstr2b = gstr2bDataArray.find(
        (data) => data.ctin === entry.ctin && data.inum === entry.inum
      ) || {};
      const purchaseData = purchasesExtracted.find(
        (data) => data.ctin === entry.ctin && data.inum === entry.inum
      ) || {};

      const age = gstr2a.filledDate
        ? Math.floor(
          (new Date() - new Date(gstr2a.filledDate)) / (1000 * 60 * 60 * 24)
        )
        : null; // age in days

      return {
        ctin: entry.ctin,
        supplierName:
          gstr2a.supplierName ||
          gstr2b.supplierName ||
          purchaseData.supplierName ||
          null,
        inum: entry.inum,
        date: entry.date,
        age,
        books: Boolean(
          purchasesExtracted.some(
            (data) => data.ctin === entry.ctin && data.inum === entry.inum
          )
        ),
        '2a': Boolean(gstr2a.ctin),
        '2b': Boolean(gstr2b.ctin),
        gstr1_fp: gstr2a.filledDate || gstr2b.filledDate,
        rc: gstr2b.rc || gstr2a.rc,
        itc_available: gstr2b.itc || gstr2a.itc,
        val_books: purchaseData.totalTxval,
        igst_books: purchaseData.totalIgst,
        cgst_books: purchaseData.totalCgst,
        sgst_books: purchaseData.totalSgst,
        cess_books: purchaseData.totalCess,
        val: gstr2b.totalTxval || gstr2a.totalTxval,
        igst: gstr2b.totalIgst || gstr2a.totalIgst,
        cgst: gstr2b.totalCgst || gstr2a.totalCgst,
        sgst: gstr2b.totalSgst || gstr2a.totalSgst,
        cess: gstr2b.totalCess || gstr2a.totalCess
      };
    });
  };


  const validateSessionCall = async (request) => {
    setLoaderMsg('Please wait while validating session!!!');
    setLoader(true);
    let gstin = await getGstinNumber();
    const apiResponse = await validateSession(gstin);
    if (apiResponse.code === 200) {
      if (apiResponse && apiResponse.status === 1) {
        updateGSTAuth(true);
        setDateFilter(true);
        setLoaderMsg('');
        loadData(request);
      } else {
        setLoginStep(1);
        setDateFilter(true);
        // errorMessageCall(apiResponse.message);
        setLoader(false);
      }
    } else {
      updateGSTAuth(false);
      setLoginStep(1);
      setDateFilter(true);
      //errorMessageCall(apiResponse.message);
      setLoader(false);
    }
  };

  const proceedToFetchData = async () => {
    setGSTRPeriod(financialYear, financialMonth);


    const request = {
      gstin: await getGstinNumber(),
      ret_period: financialMonth + financialYear
    };
    await validateSessionCall(request);
  };

  const checkInBooksOrPortal = (data) => {
    let books = 0;
    let portal = 0;
    let matched = 0;
    let unMatched = 0;
    data.map(entry => {
      if (entry.books && entry['2a'] && entry['2b']) {
        matched += 1;
      } else {
        unMatched += 1;
      }
      if (entry.books && (!entry['2b'])) {
        books += 1;

      } else if (!entry.books && (entry['2a'] || entry['2b'])) {
        portal += 1;
      }
    });

    setOnlyInPOS(books);
    setOnlyInPortal(portal);
    setMatchedRecords(matched);
    setUnmatchedRecords(unMatched);
  }

  const loadData = async (request) => {
    const gstr2bData = await get2BData(request);

    const respB2B = await fetchData(gstr2bData, request, 'b2b');
    checkInBooksOrPortal(respB2B);
    console.log("joe", respB2B);
    setB2bData(respB2B);
    setData(respB2B);
    const respB2BA = await fetchData(gstr2bData, request, 'b2ba');
    setB2baData(respB2BA);
    const respCDN = await fetchData(gstr2bData, request, 'cdn');
    setCdnData(respCDN);
    const respCDNA = await fetchData(gstr2bData, request, 'cdna');
    setCdnaData(respCDNA);
    const respIMPG = await fetchData(gstr2bData, request, 'impg');
    setImpgData(respIMPG);
    const respIMPGSEZ = await fetchData(gstr2bData, request, 'impgSez');
    setImpgsezData(respIMPGSEZ);
    const respISD = await fetchData(gstr2bData, request, 'isdCredit');
    setIsdData(respISD);
    setLoader(false);
  }

  const fetchData = async (gstr2bData, request, type) => {
    const gstr2aData = await get2AData(request, type);
    const gstr2bDataArray = extractData2b(gstr2bData, type);
    const gstr2aDataArray = extractData2a(gstr2aData, type);

    // Merge the arrays
    const mergedArray = [...gstr2bDataArray, ...gstr2aDataArray];

    // Group by ctin and keep all invoices
    const groupedResult = mergedArray.reduce((acc, curr) => {
      if (!acc[curr.ctin]) {
        acc[curr.ctin] = [curr];
      } else {
        acc[curr.ctin].push(curr);
      }
      return acc;
    }, {});

    // Create a separate list of unique invoices per ctin
    const uniqueInvoices = Object.keys(groupedResult).reduce(
      (acc, ctin) => {
        const seenInums = new Set();
        groupedResult[ctin].forEach((invoice) => {
          if (!seenInums.has(invoice.inum)) {
            seenInums.add(invoice.inum);
            acc.inumList.push(invoice.inum);
            acc.ctinList.push(ctin);
          }
        });
        return acc;
      },
      { inumList: [], ctinList: [] }
    );
    const [purchases, expenses] = await Promise.all([
      getAllPurchasesByGstinAndBillNumber(
        uniqueInvoices.ctinList,
        uniqueInvoices.inumList,
        [
          'vendor_gst_number',
          'vendor_name',
          'vendor_bill_number',
          'bill_date',
          'total_amount',
          'item_list'
        ]
      ),
      getAllExpensesByGstinAndBillNumber(
        uniqueInvoices.ctinList,
        uniqueInvoices.inumList,
        [
          'vendor_gst_number',
          'vendor_name',
          'billNumber',
          'date',
          'total',
          'item_list'
        ]
      )
    ]);

    let purchasesExtracted = extractDataPurchases(purchases);
    const expensesExtracted = extractDataExpenses(expenses);

    purchasesExtracted = purchasesExtracted.concat(expensesExtracted);

    const response = await reconcileData(
      gstr2aDataArray,
      purchasesExtracted,
      gstr2bDataArray
    );

    return response;
  }

  const filterData = (checked, type) => {
    if (type == 'unMatched') {
      setUnmatched(checked);
    } else if (type == 'matched') {
      setMatched(checked);
    }
  }

  const getExcelDataNew = async () => {
    const workbook = new ExcelJS.Workbook();
    await prepareSheet(workbook, b2bData, 'B2B', prepare2A2BHeaderRow);
    await prepareSheet(workbook, b2baData, 'B2BA', prepare2A2BHeaderRow);
    await prepareSheet(workbook, cdnData, 'CDNR', prepare2A2BHeaderRow);
    await prepareSheet(workbook, cdnaData, 'CDNRA', prepare2A2BHeaderRow);
    await prepareSheet(workbook, isdData, 'ISD', prepare2A2BHeaderRow);
    await prepareSheet(workbook, impgData, 'IMPG', prepare2A2BHeaderRow);
    await prepareSheet(workbook, impgsezData, 'IMPGSEZ', prepare2A2BHeaderRow);

    // Generate Excel file buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fileName = `${localStorage.getItem('businessName')}_Audit_Report_.xlsx`;
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const prepareSheet = async (workbook, xlsxData, sheetName, headerRowFunction) => {
    const worksheet = workbook.addWorksheet(sheetName);
    const filteredColumns = [];
    await headerRowFunction(filteredColumns);
    worksheet.columns = filteredColumns;

    const headerValues = getHeaderValues(sheetName);

    const headerRow = worksheet.getRow(1);
    worksheet.getRow(1).values = headerValues;
    formatHeaderRow(headerRow);

    if (xlsxData && xlsxData.length > 0) {
      xlsxData.forEach((data) => {
        const newRow = worksheet.addRow({});
        prepareDataRow(newRow, data);
      });
    }
  };

  const formatHeaderRow = (headerRow) => {
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd8f3fc' }
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


  const getHeaderValues = () => {
    return [
      'GSTIN',
      'SUPPLIER NAME',
      'INVOICE NUMBER',
      'DATE',
      'AGE',
      'BOOKS',
      '2A',
      '2B',
      'GSTR-1 FP',
      'RC',
      'ITC AVAILABLE',
      'TAXABLE AMT (BOOKS)',
      'IGST AMT (BOOKS)',
      'CGST AMT (BOOKS)',
      'SGST AMT (BOOKS)',
      'CESS AMT (BOOKS)',
      'TAXABLE AMT (PORTAL)',
      'IGST AMT (PORTAL)',
      'CGST AMT (PORTAL)',
      'SGST AMT (PORTAL)',
      'CESS AMT (PORTAL)'
    ];
  };

  const prepareDataRow = (newRow, topRowData) => {
    newRow.getCell('ctin').value = topRowData.ctin;
    newRow.getCell('supplierName').value = topRowData.supplierName;
    newRow.getCell('inum').value = topRowData.inum;
    newRow.getCell('date').value = topRowData.date;
    newRow.getCell('age').value = parseFloat(topRowData?.age || 0);
    newRow.getCell('books').value = topRowData.books ? "Yes" : 'No';
    newRow.getCell('2a').value = topRowData['2a'] ? "Yes" : 'No';
    newRow.getCell('2b').value = topRowData['2b'] ? "Yes" : 'No';
    newRow.getCell('gstr1_fp').value = topRowData?.filledDate;
    newRow.getCell('rc').value = topRowData?.rc;
    newRow.getCell('itc_available').value = topRowData.itc_available;
    newRow.getCell('val_books').value = parseFloat(topRowData?.val_books || 0);
    newRow.getCell('igst_books').value = parseFloat(topRowData?.igst_books || 0);
    newRow.getCell('cgst_books').value = parseFloat(topRowData?.cgst_books || 0);
    newRow.getCell('sgst_books').value = parseFloat(topRowData?.sgst_books || 0);
    newRow.getCell('cess_books').value = parseFloat(topRowData?.cess_books || 0);
    newRow.getCell('val').value = parseFloat(topRowData?.val || 0);
    newRow.getCell('igst').value = parseFloat(topRowData?.igst || 0);
    newRow.getCell('cgst').value = parseFloat(topRowData?.cgst || 0);
    newRow.getCell('sgst').value = parseFloat(topRowData?.sgst || 0);
    newRow.getCell('cess').value = parseFloat(topRowData?.cess || 0);
  };

  return (
    <>
      <Typography
        className={`${classes.mb_10}`}
        style={{
          padding: '10px',
          width: '95%',
          margin: 'auto',
          marginTop: '5px'
        }}
        variant="h3"
      >
        2A v/s 2B Reconciliations
      </Typography>

      {!dateFilter && (
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
                <div className={classes.filterSection}>
                  <Button
                    color="secondary"
                    onClick={(e) => {
                      proceedToFetchData();
                    }}
                    className={classes.filterBtn}
                  >
                    VIEW 2A v/s 2B DATA
                  </Button>
                </div>
              </Grid>
            </Grid>
          </Grid>
        </div>
      )}
      {dateFilter && (
        <>
          {!gstAuth ? (
            <GSTAuth type={'GSTR2A'} />
          ) : (
            <>
              <div>
                <Grid container className={classes.categoryActionWrapper}>
                  <Grid item xs={12} sm={4}>
                    <div style={{ marginLeft: '18px' }}>
                      <Button
                        color="secondary"
                        onClick={() => {
                          setDateFilter(false);
                        }}
                        className={classes.filterBtn}
                      >
                        Back to Filter
                      </Button>
                      
                    </div>
                  </Grid>

                  <Grid item xs={12} sm={3} className="grid-padding">
                    {/* <FormControl fullWidth>
                      <Select
                        value={recType}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        className="customTextField"
                        style={{ marginTop: '10px' }}
                        onChange={(event) => setRecType(event.target.value)}
                      >
                        <MenuItem value={' '}>Choose Reconciliation Type</MenuItem>
                        {recTypeList.map((e) => (
                          <MenuItem value={e}>{e}</MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                  </Grid>

                  <Grid item xs={12} sm={1} className="grid-padding"></Grid>

                  <Grid item xs={12} sm={3} className="grid-padding">
                    {/* <FormControl fullWidth>
                      <Select
                        value={filter}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        className="customTextField"
                        style={{ marginTop: '10px' }}
                        onChange={(event) => setFilter(event.target.value)}
                      >
                        <MenuItem value={' '}>Choose Filter</MenuItem>
                        {filterList.map((e) => (
                          <MenuItem value={e}>{e}</MenuItem>
                        ))}
                      </Select>
                    </FormControl> */}
                    <IconButton
                        style={{ float: 'right' }}
                        onClick={() => getExcelDataNew()}
                      >
                        <Excel fontSize="inherit" />
                      </IconButton>
                  </Grid>
                </Grid>
              </div>
              <div className={classes.step2}>
                <Grid fluid className="app-main" style={{ height: height - 110 }}>
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
                        style={{ padding: '5px', overflowX: 'scroll' }}
                        alignItems="stretch"
                      >
                        {active === 'B2B' && (
                          <Grid
                            item
                            xs={12}
                            onClick={() => load2BData('B2B')}
                          ></Grid>
                        )}

                        {active === 'B2BA' && (
                          <Grid
                            item
                            xs={12}
                            onClick={() => load2BData('B2BA')}
                          ></Grid>
                        )}

                        {active === 'B2B-CDNR' && (
                          <Grid
                            item
                            xs={12}
                            onClick={() => load2BData('B2B-CDNR')}
                          ></Grid>
                        )}

                        {active === 'B2B-CDNRA' && (
                          <Grid
                            item
                            xs={12}
                            onClick={() => load2BData('B2B-CDNRA')}
                          ></Grid>
                        )}

                        {active === 'ECO' && (
                          <Grid
                            item
                            xs={12}
                            onClick={() => load2BData('ECO')}
                          ></Grid>
                        )}

                        {active === 'ISD' && (
                          <Grid
                            item
                            xs={12}
                            onClick={() => load2BData('ISD')}
                          ></Grid>
                        )}

                        {active === 'ISDA' && (
                          <Grid
                            item
                            xs={12}
                            onClick={() => load2BData('ISDA')}
                          ></Grid>
                        )}

                        {active === 'IMPG' && (
                          <Grid
                            item
                            xs={12}
                            onClick={() => load2BData('IMPG')}
                          ></Grid>
                        )}

                        {active === 'IMPGSEZ' && (
                          <Grid
                            item
                            xs={12}
                            onClick={() => load2BData('IMPGSEZ')}
                          ></Grid>
                        )}

                        <Grid
                          container
                          className={clsx(classes.setPadding, classes.bgColor)}
                        >
                          <Grid justifyContent="flex-start">
                            <FormControl>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="sales"
                                    defaultChecked="true"
                                    onChange={(event) => { filterData(event.target.checked, 'unMatched') }}
                                    style={{ marginLeft: '5px' }}
                                  />
                                }
                                size="small"
                              />
                            </FormControl>
                          </Grid>
                          <Grid
                            item
                            justifyContent="flex-start"
                            style={{ marginTop: '8px' }}
                          >
                            <p className={clsx(classes.marl, classes.redText)}>
                              {' '}
                              Unmatched Records
                            </p>
                          </Grid>
                          <Grid
                            item
                            className={classes.textAlign}
                            style={{ marginLeft: '16px', marginTop: '8px' }}
                          >
                            <p className={clsx(classes.marr, classes.redText)}>
                              {unmatchedRecords}
                            </p>
                          </Grid>
                          <Grid
                            justifyContent="flex-start"
                            style={{ marginTop: '8px', marginLeft: '30px' }}
                          >
                            <p className={clsx(classes.marl)}> In BOOKS Only</p>
                          </Grid>
                          <Grid
                            className={classes.textAlign}
                            style={{ marginLeft: '16px', marginTop: '8px' }}
                          >
                            <p className={clsx(classes.marr)}>{onlyInPOS}</p>
                          </Grid>
                          <Grid
                            justifyContent="flex-start"
                            style={{ marginTop: '8px', marginLeft: '30px' }}
                          >
                            <p className={clsx(classes.marl)}> In Portal Only</p>
                          </Grid>
                          <Grid
                            className={classes.textAlign}
                            style={{ marginLeft: '16px', marginTop: '8px' }}
                          >
                            <p className={clsx(classes.marr)}>{onlyInPortal}</p>
                          </Grid>
                          {/* <Grid
                            className={classes.textAlign}
                            style={{
                              marginLeft: '20px',
                              marginTop: '8px',
                              display: 'flex'
                            }}
                          >
                            <p className={clsx(classes.marr)}>
                              Reminder on missing Invoices:
                            </p>
                            <Button color="secondary" variant="outlined">
                              WhatsApp{' '}
                            </Button>
                            <Button
                              color="secondary"
                              variant="outlined"
                              style={{ marginLeft: '10px' }}
                            >
                              E-Mail{' '}
                            </Button>
                          </Grid> */}
                        </Grid>
                        <Grid
                          container
                          className={clsx(classes.setPadding, classes.bgColor)}
                        >
                          <Grid justifyContent="flex-start">
                            <FormControl>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    name="sales"
                                    defaultChecked="true"
                                    onChange={(event) => { filterData(event.target.checked, 'matched') }}
                                    style={{ marginLeft: '5px' }}
                                  />
                                }
                                size="small"
                              />
                            </FormControl>
                          </Grid>
                          <Grid
                            justifyContent="flex-start"
                            style={{ marginTop: '8px' }}
                          >
                            <p className={clsx(classes.marl, classes.greenText)}>
                              {' '}
                              Matched Records
                            </p>
                          </Grid>
                          <Grid
                            className={classes.textAlign}
                            style={{ marginLeft: '16px', marginTop: '8px' }}
                          >
                            <p className={clsx(classes.marr, classes.greenText)}>
                              {matchedRecords}
                            </p>
                          </Grid>
                        </Grid>
                        <Table style={{ fontSize: '12px', overflowX: 'scroll' }} aria-label="simple table">
                          <TableHead className={classes.addtablehead}>
                            <TableRow>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                GSTIN
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                SUPPLIER NAME
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: getInvoiceNumberNameByType()
                                  }}
                                ></div>
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                DATE
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                AGE
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                BOOKS
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                2A
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                2B
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                GSTR-1 FP
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                RC
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                ITC AVAILABLE
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                TAXABLE AMT (BOOKS)
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                IGST AMT (BOOKS)
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                CGST AMT (BOOKS)
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                SGST AMT (BOOKS)
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                CESS AMT (BOOKS)
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                TAXABLE AMT (PORTAL)
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                IGST AMT (PORTAL)
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                CGST AMT (PORTAL)
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                SGST AMT (PORTAL)
                              </TableCell>
                              <TableCell
                                variant="head"
                                classes={{ root: classes.tableCellHeaderRoot }}
                              >
                                CESS AMT (PORTAL)
                              </TableCell>
                            </TableRow>
                            {data?.map((pitem, index) => {
                              let showData = true;
                              if (!matched && !unmatched) {
                                showData = false;
                              }
                              else if (matched && !unmatched) {
                                showData = pitem.books && pitem['2a'] && pitem['2b'];
                              }
                              else if (!matched && unmatched) {
                                showData = !(pitem.books && pitem['2a'] && pitem['2b']);
                              }
                              else if (matched && unmatched) {
                                showData = true;
                              }

                              if (showData) {
                                return (
                                  <TableRow>
                                    <TableCell className={`${classes.rowstyle} ${(pitem.books && pitem['2a'] && pitem['2b']) ? '' : classes.red}`}>
                                      {pitem.ctin}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {pitem?.supplierName}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {pitem?.inum}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {pitem?.date}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.age || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {pitem.books ? "Yes" : 'No'}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {pitem['2a'] ? "Yes" : 'No'}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {pitem['2b'] ? "Yes" : 'No'}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {pitem?.gstr1_fp}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {pitem?.rc}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {pitem?.itc_available}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.val_books || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.igst_books || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.cgst_books || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.sgst_books || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.cess_books || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.val || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.igst || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.cgst || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.sgst || 0)}
                                    </TableCell>
                                    <TableCell className={`${classes.rowstyle}`}>
                                      {parseFloat(pitem?.cess || 0)}
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                            })}
                          </TableHead>
                        </Table>
                      </Grid>
                    </Card>
                  </Col>
                </Grid>
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
              </div>
            </>)}
        </>
      )}
    </>
  );
};

export default injectWithObserver(Purchase2A2BReconciliations);
