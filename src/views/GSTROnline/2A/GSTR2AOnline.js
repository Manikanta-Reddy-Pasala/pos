import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Grid,
  withStyles,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogContent
} from '@material-ui/core';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import useWindowDimensions from '../../../components/windowDimension';
import { useTheme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Col } from 'react-flexbox-grid';
import classnames from 'classnames';
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
import { toJS } from 'mobx';
import Loader from 'react-js-loader';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import GSTError from 'src/views/GSTROnline/GSTError';
import CustomVendorPurchases from 'src/views/GSTROnline/CustomVendorPurchases';
import {
  getSelectedDateMonthAndYearMMYYYY,
  getSelectedMonthAndYearMMYYYY
} from 'src/components/Helpers/DateHelper';
import { get2AData, get2ADummyData } from 'src/components/Helpers/GstrOnlineHelper';
import XLSX from 'xlsx';
import Excel from '../../../icons/Excel';
import * as ExcelJS from 'exceljs';
import {
  prepare2AB2BHeaderRow,
  prepare2AB2BAHeaderRow,
  prepare2ACDNRHeaderRow,
  prepare2ACDNRAHeaderRow,
  prepare2AISDHeaderRow,
  prepare2AIMPGHeaderRow,
  prepare2AIMPGSEZHeaderRow 
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
  },
  center: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  }
}));

const GSTR2AOnline = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const [active, setActive] = useState('B2B');
  const sections = [
    'B2B',
    'B2BA',
    'B2B-CDNR',
    'B2B-CDNRA',
    // 'ECO',
    'ISD',
    // 'ISDA',
    'IMPG',
    'IMPGSEZ'
  ];
  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const { height } = useWindowDimensions();

  const [filter, setFilter] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    updateGSTAuth,
    handleErrorAlertOpen,
    setLoginStep,
    setTaxData,
    gstAuth,
    openErrorMesssageDialog
  } = stores.GSTR1Store;
  const {
    setFinancialYear,
    setFinancialMonth,
    setGSTRPeriod,
    updateB2BData,
    updateB2BAData,
    updateCDNRData,
    updateCDNRAData,
    updateISDData,
    updateIMPGData,
    updateIMPGSEZData,
    resetAllData
  } = stores.GSTR2AStore;

  const {
    financialYear,
    financialMonth,
    months,
    b2b2AData,
    b2ba2AData,
    cdnr2AData,
    cdnra2AData,
    isd2AData,
    impg2AData,
    impsezg2AData
  } = toJS(stores.GSTR2AStore);

  const { getTaxSettingsDetails } = stores.TaxSettingsStore;
  const { getAuditSettingsData } = stores.AuditSettingsStore;

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
  const errorMessageCall = (message) => {
    handleErrorAlertOpen(message);
  };

  const setActiveData = (data) => {
    setActive(data);
  };

  const proceedToFetchData = async () => {
    resetAllData();
    setGSTRPeriod(financialYear, financialMonth);

    let taxData = await getTaxSettingsDetails();
    validateSessionCall(taxData);
  };

  const validateSessionCall = async (dataG) => {
    setLoaderMsg('Please wait while validating session!!!');
    setLoader(true);
    const apiResponse = await validateSession(dataG.gstin);
    if (apiResponse.code === 200) {
      if (apiResponse && apiResponse.status === 1) {
        updateGSTAuth(true);
        setFilter(true);
        fetchData(financialYear, financialMonth);
        // setFData(1);
      } else {
        setLoginStep(1);
        setFilter(true);
        // errorMessageCall(apiResponse.message);
        setLoader(false);
      }
    } else {
      updateGSTAuth(false);
      setLoginStep(1);
      setFilter(true);
      //errorMessageCall(apiResponse.message);
      setLoader(false);
    }
  };

  const fetchData = async (yearData, monthData) => {
    setLoaderMsg('Please wait!!!');
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

    const apiResponse = await get2AData(reqData, 'b2b');
    if (apiResponse && apiResponse.status === 1) {
      updateB2BData(apiResponse.message?.b2b);
    }
    const apiResponseb2ba = await get2AData(reqData, 'b2ba');
    if (
      apiResponseb2ba &&
      apiResponseb2ba.status === 1 &&
      apiResponseb2ba.message.b2ba
    ) {
      updateB2BAData(apiResponseb2ba.message?.b2ba);
    }
    const apiResponsecdn = await get2AData(reqData, 'cdn');
    if (apiResponsecdn && apiResponsecdn.status === 1) {
      updateCDNRData(apiResponsecdn.message?.cdn);
    }
    const apiResponsecdna = await get2AData(reqData, 'cdna');
    if (apiResponsecdna && apiResponsecdna.status === 1) {
      updateCDNRAData(apiResponsecdna.message?.cdna);
    }
    const apiResponseisd = await get2AData(reqData, 'isdCredit');
    if (apiResponseisd && apiResponseisd.status === 1) {
      updateISDData(apiResponseisd.message?.isd);
    }
    const apiResponseimpg = await get2AData(reqData, 'impg');
    if (apiResponseimpg && apiResponseimpg.status === 1) {
      updateIMPGData(apiResponseimpg.message?.impg);
    }
    const apiResponseimpgsez = await get2AData(reqData, 'impgsez');
    if (apiResponseimpgsez && apiResponseimpgsez.status === 1) {
      updateIMPGSEZData(apiResponseimpgsez.message?.impgsez);
    }

    setLoader(false);
  };

  const getExcelDataNew = async () => {
    const workbook = new ExcelJS.Workbook();
    await prepareSheet(workbook, b2b2AData, 'B2B', prepare2AB2BHeaderRow, 'C1:F1', 'K1:N1');
    await prepareSheet(workbook, b2ba2AData, 'B2BA', prepare2AB2BAHeaderRow, 'E1:H1', 'M1:P1');
    await prepareSheet(workbook, cdnr2AData, 'CDNR', prepare2ACDNRHeaderRow, 'C1:G1', 'L1:O1');
    await prepareSheet(workbook, cdnra2AData, 'CDNRA', prepare2ACDNRAHeaderRow, 'G1:J1', 'O1:R1');
    await prepareSheet(workbook, isd2AData, 'ISD', prepare2AISDHeaderRow, 'K1:N1', '');
    await prepareSheet(workbook, impg2AData, 'IMPG', prepare2AIMPGHeaderRow, 'C1:E1', 'F1:G1');
    await prepareSheet(workbook, impsezg2AData, 'IMPGSEZ', prepare2AIMPGSEZHeaderRow, 'E1:G1', 'H1:I1');

    // Generate Excel file buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const fileName = `${localStorage.getItem('businessName')}_2A_Report_${financialMonth}${financialYear}.xlsx`;
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  };

  const prepareSheet = async (workbook, xlsxData, sheetName, headerRowFunction, mergeRange1, mergeRange2) => {
    const worksheet = workbook.addWorksheet(sheetName);
    const filteredColumns = [];
    await headerRowFunction(filteredColumns);
    worksheet.columns = filteredColumns;

    const headerValues = getHeaderValues(sheetName);

    // Set first row values to empty
    const firstRow = worksheet.getRow(1);
    firstRow.values = new Array(headerValues.length).fill('');

    // Merge cells in the first row
    if(sheetName === 'B2B' || sheetName === 'B2BA'){
      mergeCells(worksheet, mergeRange1, 'Invoice details');
      mergeCells(worksheet, mergeRange2, 'Tax Amount');
    }else if(sheetName === 'CDNR' || sheetName === 'CDNRA'){
      mergeCells(worksheet, mergeRange1, 'Credit note/Debit note details');
      mergeCells(worksheet, mergeRange2, 'Tax Amount');
    }else if(sheetName === 'ISD'){
      mergeCells(worksheet, mergeRange1, 'Input tax distribution by ISD');
    }else if(sheetName === 'IMPG' || sheetName === 'IMPGSEZ'){
      mergeCells(worksheet, mergeRange1, 'Bill of entry details');
      mergeCells(worksheet, mergeRange2, 'Amount of tax (₹)');
    }
    

    const headerRow = worksheet.getRow(2);
    worksheet.getRow(2).values = headerValues;
    formatHeaderRow(headerRow);

    if (xlsxData && xlsxData.length > 0) {
        xlsxData.forEach((data) => {
          if(sheetName === 'B2B'){
            data.inv.forEach((inv) => {
                inv.itms.forEach((item) => {
                    const newRow = worksheet.addRow({});
                    prepareB2BDataRow(newRow, data, inv, item);
                });
            });
          }
          if(sheetName === 'B2BA'){
            data.inv.forEach((inv) => {
                inv.itms.forEach((item) => {
                    const newRow = worksheet.addRow({});
                    prepareB2BADataRow(newRow, data, inv, item);
                });
            });
          }
          if(sheetName === 'CDNR'){
            data.nt.forEach((nt) => {
                nt.itms.forEach((item) => {
                    const newRow = worksheet.addRow({});
                    prepareCDNRDataRow(newRow, data, nt, item);
                });
            });
          }
          if(sheetName === 'CDNRA'){
            data.nt.forEach((nt) => {
                nt.itms.forEach((item) => {
                    const newRow = worksheet.addRow({});
                    prepareCDNRADataRow(newRow, data, nt, item);
                });
            });
          }
          if(sheetName === 'ISD'){
            data.doclist.forEach((doclist) => {
                const newRow = worksheet.addRow({});
                prepareISDDataRow(newRow, data, doclist);
            });
          }
          if(sheetName === 'IMPG'){
            const newRow = worksheet.addRow({});
            prepareIMPGDataRow(newRow, data);
          }
          if(sheetName === 'IMPGSEZ'){
            const newRow = worksheet.addRow({});
            prepareIMPGSEZDataRow(newRow, data);
          }
        });
    }
};


  const getHeaderValues = (sheetName) => {
    if (sheetName === 'B2B') {
      return [
        'GSTIN of supplier',
        'Trade/Legal name of the Supplier',
        'Invoice number.',
        'Invoice type',
        'Invoice Date',
        'Invoice Value (₹)',
        'Place of supply',
        'Supply Attract Reverse Charge',
        'Rate (%)',
        'Taxable Value (₹)',
        'Integrated Tax  (₹)',
        'Central Tax (₹)',
        'State/UT tax (₹)',
        'Cess  (₹)',
        'GSTR-1/5 Filing Status',
        'GSTR-1/5 Filing Date',
        'GSTR-1/5 Filing Period',
        'GSTR-3B Filing Status',
        'Amendment made, if any',
        'Tax Period in which Amended',
        'Effective date of cancellation',
        'Source',
        'IRN',
        'IRN date'
      ];
    } else if(sheetName === 'B2BA') {
      return [
        'Invoice number',
        'Invoice Date',
        'GSTIN of supplier',
        'Trade/Legal name of the Supplier',
        'Invoice number.',
        'Invoice type',
        'Invoice Date',
        'Invoice Value (₹)',
        'Place of supply',
        'Supply Attract Reverse Charge',
        'Rate (%)',
        'Taxable Value (₹)',
        'Integrated Tax  (₹)',
        'Central Tax (₹)',
        'State/UT tax (₹)',
        'Cess  (₹)',
        'GSTR-1/5 Filing Status',
        'GSTR-1/5 Filing Date',
        'GSTR-1/5 Filing Period',
        'GSTR-3B Filing Status',
        'Effective date of cancellation',
        'Amendment made, if any',
        'Original tax period in which reported'
      ];
    }else if(sheetName === 'CDNR') {
      return [
        'GSTIN of supplier',
        'Trade/Legal name of the Supplier',
        'Note type',
        'Note number',
        'Note Supply type',
        'Note date',
        'Note Value (₹)',
        'Place of supply',
        'Supply Attract Reverse Charge',
        'Rate (%)',
        'Taxable Value (₹)',
        'Integrated Tax  (₹)',
        'Central Tax (₹)',
        'State/UT tax (₹)',
        'Cess  (₹)',
        'GSTR-1/5 Filing Status',
        'GSTR-1/5 Filing Date',
        'GSTR-1/5 Filing Period',
        'GSTR-3B Filing Status',
        'Amendment made, if any',
        'Tax Period in which Amended',
        'Effective date of cancellation',
        'Source',
        'IRN',
        'IRN date'
      ];
    }else if(sheetName === 'CDNRA') {
      return [
        'Note type',
        'Note Number',
        'Note date',
        'GSTIN of supplier',
        'Trade/Legal name of the Supplier',
        'Note type',
        'Note number',
        'Note Supply type',
        'Note date',
        'Note Value (₹)',
        'Place of supply',
        'Supply Attract Reverse Charge',
        'Rate (%)',
        'Taxable Value (₹)',
        'Integrated Tax  (₹)',
        'Central Tax (₹)',
        'State/UT tax (₹)',
        'Cess  (₹)',
        'GSTR-1/5 Filing Status',
        'GSTR-1/5 Filing Date',
        'GSTR-1/5 Filing Period',
        'GSTR-3B Filing Status',
        'Amendment made, if any',
        'Tax Period in which reported earlier',
        'Effective date of cancellation'
      ];
    }else if(sheetName === 'ISD') {
      return [
        'Eligibility of ITC',
        'GSTIN of ISD',
        'Trade/Legal name of the ISD',
        'ISD Document type',
        'ISD Invoice number',
        'ISD Invoice date',
        'ISD credit note number',
        'ISD credit note date',
        'Original Invoice Number',
        'Original invoice date',
        'Integrated Tax (₹)',
        'Central Tax (₹)',
        'State/UT Tax (₹)',
        'Cess (₹)',
        'ISD GSTR-6 Filing status',
        'Amendment made, if any',
        'Tax Period in which Amended'
      ];
    }else if(sheetName === 'IMPG') {
      return [
        'Reference date (ICEGATE)',
        'Port cod',
        'Number',
        'Date',
        'Taxable value (₹)',
        'Integrated tax (₹)',
        'Cess  (₹)',
        'Amended (Yes)'
      ];
    }else if(sheetName === 'IMPGSEZ') {
      return [
        'GSTIN of supplier',
        'Trade/Legal name',
        'Reference date (ICEGATE)',
        'Port cod',
        'Number',
        'Date',
        'Taxable value (₹)',
        'Integrated tax (₹)',
        'Cess  (₹)',
        'Amended (Yes)'
      ];
    }
  };

  const mergeCells = (worksheet, range, text) => {
    worksheet.mergeCells(range);
    const startCell = worksheet.getCell(range.split(':')[0]);
    startCell.value = text;
    startCell.font = { bold: true };
    startCell.alignment = { vertical: 'middle', horizontal: 'center' };
    startCell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
};

  const prepareB2BDataRow = (newRow, topRowData, invRowData, itemRowData) => {
    newRow.getCell('ctin').value = topRowData.ctin;
    newRow.getCell('supplierName').value = '';
    newRow.getCell('inum').value = invRowData.inum;
    newRow.getCell('inv_typ').value = invRowData.inv_typ;
    newRow.getCell('idt').value = invRowData.idt;
    newRow.getCell('val').value = invRowData.val;
    newRow.getCell('pos').value = invRowData.pos;
    newRow.getCell('rchrg').value = invRowData.rchrg;
    newRow.getCell('rt').value = itemRowData?.itm_det.rt;
    newRow.getCell('txval').value = itemRowData?.itm_det.txval;
    newRow.getCell('iamt').value = itemRowData?.itm_det.iamt;
    newRow.getCell('camt').value = itemRowData?.itm_det.camt;
    newRow.getCell('samt').value = itemRowData?.itm_det.samt;
    newRow.getCell('csamt').value = itemRowData?.itm_det.csamt;
    newRow.getCell('cfs').value = topRowData.cfs;
    newRow.getCell('fldtr1').value = topRowData.fldtr1;
    newRow.getCell('flprdr1').value = topRowData.flprdr1;
    newRow.getCell('cfs3b').value = topRowData.cfs3b;
  };
  const prepareB2BADataRow = (newRow, topRowData, invRowData, itemRowData) => {
    newRow.getCell('inumUp').value = invRowData.inum;
    newRow.getCell('idtUp').value = invRowData.inv_typ;
    newRow.getCell('ctin').value = topRowData.ctin;
    newRow.getCell('supplierName').value = '';
    newRow.getCell('inum').value = invRowData.inum;
    newRow.getCell('inv_typ').value = invRowData.inv_typ;
    newRow.getCell('idt').value = invRowData.idt;
    newRow.getCell('val').value = invRowData.val;
    newRow.getCell('pos').value = invRowData.pos;
    newRow.getCell('rchrg').value = invRowData.rchrg;
    newRow.getCell('rt').value = itemRowData?.itm_det.rt;
    newRow.getCell('txval').value = itemRowData?.itm_det.txval;
    newRow.getCell('iamt').value = itemRowData?.itm_det.iamt;
    newRow.getCell('camt').value = itemRowData?.itm_det.camt;
    newRow.getCell('samt').value = itemRowData?.itm_det.samt;
    newRow.getCell('csamt').value = itemRowData?.itm_det.csamt;
    newRow.getCell('cfs').value = topRowData.cfs;
    newRow.getCell('fldtr1').value = topRowData.fldtr1;
    newRow.getCell('flprdr1').value = topRowData.flprdr1;
    newRow.getCell('cfs3b').value = topRowData.cfs3b;
  };
  const prepareCDNRDataRow = (newRow, topRowData, invRowData, itemRowData) => {
    newRow.getCell('ctin').value = topRowData.ctin;
    newRow.getCell('supplierName').value = '';
    newRow.getCell('ntty').value = invRowData.ntty;
    newRow.getCell('nt_num').value = invRowData.nt_num;
    newRow.getCell('nt_dt').value = invRowData.nt_dt;
    newRow.getCell('val').value = invRowData.val;
    newRow.getCell('pos').value = invRowData.pos;
    newRow.getCell('rchrg').value = invRowData.rchrg;
    newRow.getCell('rt').value = itemRowData?.itm_det.rt;
    newRow.getCell('txval').value = itemRowData?.itm_det.txval;
    newRow.getCell('iamt').value = itemRowData?.itm_det.iamt;
    newRow.getCell('camt').value = itemRowData?.itm_det.camt;
    newRow.getCell('samt').value = itemRowData?.itm_det.samt;
    newRow.getCell('csamt').value = itemRowData?.itm_det.csamt;
    newRow.getCell('cfs').value = topRowData.cfs;
    newRow.getCell('fldtr1').value = topRowData.fldtr1;
    newRow.getCell('flprdr1').value = topRowData.flprdr1;
    newRow.getCell('cfs3b').value = topRowData.cfs3b;
  };
  const prepareCDNRADataRow = (newRow, topRowData, invRowData, itemRowData) => {
    newRow.getCell('nttyUp').value = invRowData.ntty;
    newRow.getCell('nt_numUp').value = invRowData.nt_num;
    newRow.getCell('nt_dtUp').value = invRowData.nt_dt;
    newRow.getCell('ctin').value = topRowData.ctin;
    newRow.getCell('supplierName').value = '';
    newRow.getCell('ntty').value = invRowData.ntty;
    newRow.getCell('nt_num').value = invRowData.nt_num;
    newRow.getCell('nt_dt').value = invRowData.nt_dt;
    newRow.getCell('val').value = invRowData.val;
    newRow.getCell('pos').value = invRowData.pos;
    newRow.getCell('rchrg').value = invRowData.rchrg;
    newRow.getCell('rt').value = itemRowData?.itm_det.rt;
    newRow.getCell('txval').value = itemRowData?.itm_det.txval;
    newRow.getCell('iamt').value = itemRowData?.itm_det.iamt;
    newRow.getCell('camt').value = itemRowData?.itm_det.camt;
    newRow.getCell('samt').value = itemRowData?.itm_det.samt;
    newRow.getCell('csamt').value = itemRowData?.itm_det.csamt;
    newRow.getCell('cfs').value = topRowData.cfs;
    newRow.getCell('fldtr1').value = topRowData.fldtr1;
    newRow.getCell('flprdr1').value = topRowData.flprdr1;
    newRow.getCell('cfs3b').value = topRowData.cfs3b;
  };
  const prepareISDDataRow = (newRow, topRowData, invRowData) => {
    newRow.getCell('itc_elg').value = invRowData.itc_elg;
    newRow.getCell('ctin').value = topRowData.ctin;
    newRow.getCell('isd_docty').value = invRowData.isd_docty;
    newRow.getCell('iamt').value = invRowData.iamt;
    newRow.getCell('camt').value = invRowData.camt;
    newRow.getCell('samt').value = invRowData.samt;
    newRow.getCell('cess').value = invRowData.cess;
  };
  const prepareIMPGDataRow = (newRow, topRowData) => {
    newRow.getCell('refdt').value = topRowData.refdt;
    newRow.getCell('portcd').value = topRowData.portcd;
    newRow.getCell('benum').value = topRowData.benum;
    newRow.getCell('bedt').value = topRowData.bedt;
    newRow.getCell('txval').value = topRowData.txval;
    newRow.getCell('iamt').value = topRowData.iamt;
    newRow.getCell('csamt').value = topRowData.csamt;
    newRow.getCell('amd').value = topRowData.amd;
  };
  const prepareIMPGSEZDataRow = (newRow, topRowData) => {
    newRow.getCell('sgstin').value = topRowData.sgstin;
    newRow.getCell('tdname').value = topRowData.tdname;
    newRow.getCell('refdt').value = topRowData.refdt;
    newRow.getCell('portcd').value = topRowData.portcd;
    newRow.getCell('benum').value = topRowData.benum;
    newRow.getCell('bedt').value = topRowData.bedt;
    newRow.getCell('txval').value = topRowData.txval;
    newRow.getCell('iamt').value = topRowData.iamt;
    newRow.getCell('csamt').value = topRowData.csamt;
    newRow.getCell('amd').value = topRowData.amd;
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
        GSTR2A
      </Typography>
      {filter && (
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
          <IconButton
            style={{ float: 'right' }}
            onClick={() => getExcelDataNew()}
          >
            <Excel fontSize="inherit" />
          </IconButton>
        </div>
      )}
      <div>
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
                            <MenuItem value={month.value}>
                              {month.name}
                            </MenuItem>
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
                      VIEW 2A DATA
                    </Button>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          )}
          {filter && (
            <>
              {!gstAuth ? (
                <GSTAuth type={'GSTR2A'} />
              ) : (
                <Grid
                  fluid
                  className="app-main"
                  style={{ height: height - 125 }}
                >
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
                    <Card className={classes.card}>
                      <Grid
                        container
                        direction="row"
                        style={{ padding: '20px' }}
                        alignItems="stretch"
                      >
                        {active === 'B2B' && (
                          <Grid
                            item
                            style={{ overflowX: 'scroll' }}
                            className={`grid-padding ${classes.mb_20} ${classes.pointer} `}
                          >
                            <GSTRB2B />
                          </Grid>
                        )}

                        {active === 'B2BA' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            <GSTRB2BA />
                          </Grid>
                        )}

                        {active === 'B2B-CDNR' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            <GSTRCDNR />
                          </Grid>
                        )}

                        {active === 'B2B-CDNRA' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            <GSTRCDNRA />
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
                            <GSTRISD />
                          </Grid>
                        )}

                        {active === 'ISDA' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          ></Grid>
                        )}

                        {active === 'IMPG' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            <GSTRIMPG />
                          </Grid>
                        )}

                        {active === 'IMPGSEZ' && (
                          <Grid
                            item
                            className={`grid-padding ${classes.mb_20} ${classes.pointer}`}
                          >
                            <GSTRIMPGSEZ />
                          </Grid>
                        )}
                      </Grid>
                    </Card>
                  </Col>
                </Grid>
              )}
            </>
          )}
        </div>
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
    </>
  );
};

export default injectWithObserver(GSTR2AOnline);
