import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Paper,
  AppBar,
  OutlinedInput,
  MenuItem,
  Button,
  Select,
  useMediaQuery,
  useTheme,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog
} from '@material-ui/core';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import { toJS } from 'mobx';
import getStateList from 'src/components/StateList';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import OnlineGSTRModal from 'src/components/modal/OnlineGSTRModal';
import useWindowDimensions from 'src/components/windowDimension';

import {
  getSelectedDateMonthAndYearMMYYYY,
  getSelectedDayDateMonthAndYearMMYYYY
} from '../../../../components/Helpers/DateHelper';
import AddInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import Moreoptions from 'src/components/MoreOptionsGstr1Error';
import MoreOptionsSales from 'src/components/MoreOptionsGstr1Sales';
import moreoption from '../../../../components/Options';
import { AgGridReact } from 'ag-grid-react';
import * as Db from 'src/RxDb/Database/Database';
import left_arrow from 'src/icons/svg/left_arrow.svg';
import right_arrow from 'src/icons/svg/right_arrow.svg';
import first_page_arrow from 'src/icons/svg/first_page_arrow.svg';
import last_page_arrow from 'src/icons/svg/last_page_arrow.svg';
import styled from 'styled-components';

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
  }
}));

const Dropbtn = styled.button`
  background-color: rgb(239, 83, 80);
  color: white;
  padding: 7px;
  font-size: 16px;
  border: none;
`;

const Dropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  background-color: #f1f1f1;
  min-width: 250px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  left: -10rem;
`;

const DropdownLink = styled.a`
  color: #fff;
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  justify-content: space-around;
`;

const DropdownLinkHover = styled(DropdownLink)`
  &:hover {
    background-color: #ddd;
  }
`;

const DropdownHoverContent = styled(DropdownContent)`
  ${Dropdown}:hover & {
    display: block;
  }
`;

const DropdownHoverBtn = styled(Dropbtn)`
  ${Dropdown}:hover & {
    background-color: rgb(239, 83, 80);
  }
`;

const GSTR1ReportsView = () => {
  const classes = useStyles();
  const stores = useStore();
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [Tabvalue, setTabValue] = React.useState(0);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  let [onChange, setOnChange] = useState(false);

  const [isLoading, setLoadingShown] = useState(true);

  const [prefixSelect, setPrefixSelect] = React.useState('');
  const { getTransactionData } = stores.TransactionStore;
  const { transaction } = toJS(stores.TransactionStore);
  const { getTaxSettingsDetails } = stores.TaxSettingsStore;

  const { docErrorsListJSON } = toJS(stores.GSTR1Store);
  const [errorGridApi, setErrorGridApi] = useState(null);
  const [errorGridColumnApi, setErrorGridColumnApi] = useState(null);
  const [saleReturnGridApi, setSaleReturnGridApi] = useState(null);
  const [saleReturnGridColumnApi, setSaleReturnGridColumnApi] = useState(null);

  const [salesGridApi, setSalesGridApi] = useState(null);
  const [salesGridColumnApi, setSalesGridColumnApi] = useState(null);

  const [limit] = useState(10);
  const [salesData, setSalesData] = useState([]);
  const [onlineJsonData, setOnlineJsonData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { GSTRDateRange, prefixData } = toJS(stores.GSTR1Store);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setHeaderVal('Sales');
    }
    if (newValue === 1) {
      setHeaderVal('Sales Return');
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${year}-${month}-${day}`;
  };

  const store = useStore();
  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));
  const [headerVal, setHeaderVal] = React.useState('Sales');
  const [finalExpData, setExpDataList] = React.useState([]);

  const theme = useTheme();
  const { height } = useWindowDimensions();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);
  const { openAddSalesInvoice } = toJS(store.SalesAddStore);
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);
  const [includeHSN, setIncludeHSN] = React.useState(false);
  const [gstr1ResultsLoaded, setGstr1ResultsLoaded] = React.useState(false);

  const handleErrorAlertMessageClose = () => {
    setErrorMessage('');
    setErrorAlertMessage(false);
  };

  const {
    resetDocErrorsListJSON,
    getB2bSalesDataForGSTR,
    setDateRageOfGSTR1,
    setDateRageOfGSTR1FromDate,
    setDateRageOfGSTR1ToDate,
    getB2bSalesData,
    getB2CLSalesDataForGSTR,
    getB2CSSalesDataForGSTR,
    getHSNSalesDataForGSTR,
    getSalesReturnData,
    getCDNRData,
    getCDNURData,
    getHSNWiseSalesData,
    getJSONErrorList,
    handleOnlineGSTRModalOpen,
    getB2CSASalesDataForGSTR,
    getB2bASalesDataForGSTR,
    getB2CLASalesDataForGSTR,
    getCDNRAData,
    getCDNURAData,
    getNilDataFromSale,
    getNilDataFromSalesReturn,
    getExportSalesDataForGSTR,
    getExportASalesDataForGSTR
  } = store.GSTR1Store;

  const {
    b2bSalesList,
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
    salesReturnData,
    b2csaSalesListJSON,
    b2baSalesListJSON,
    b2claSalesListJSON,
    cdnraListJSON,
    cdnuraSalesReturnListJSON,
    nilSalesListData,
    nilSalesReturnListData,
    expSalesListJSON,
    expASalesListJSON
  } = store.GSTR1Store;

  const { isLaunchEWayAfterSaleCreation, printData } = toJS(
    store.SalesAddStore
  );
  const { resetEWayLaunchFlag } = store.SalesAddStore;
  const { handleOpenEWayGenerateModal } = store.EWayStore;

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const useGridEffect = (gridApi, data, dependency) => {
    useEffect(() => {
      if (gridApi && data) {
        gridApi.setRowData(data);
      }
    }, [gridApi, data, dependency]);
  };

  const useDataEffect = (fetchData, dependencies) => {
    useEffect(() => {
      console.log('useEffect called');
      fetchData();
    }, dependencies);
  };

  const useAsyncEffect = (asyncFunction, dependencies) => {
    useEffect(() => {
      const fetchDataAsync = async () => {
        await asyncFunction();
        setLoadingShown(false);
      };

      fetchDataAsync();
    }, dependencies);
  };

  useGridEffect(errorGridApi, docErrorsListJSON, docErrorsListJSON);
  useGridEffect(salesGridApi, salesData, salesData);
  useGridEffect(saleReturnGridApi, salesReturnData, salesReturnData);

  useDataEffect(fetchData, [fromDate, toDate]);

  useAsyncEffect(async () => {
    const businessData = await Bd.getBusinessData();
    await checkPermissionAvailable(businessData);
  }, []);

  useAsyncEffect(async () => {
    // Uncomment the line below if needed
    await getSalesData();
  }, []);

  useAsyncEffect(async () => {
    if (onChange) {
      setOnChange(false);
      // Uncomment the line below if needed
      await getSalesData();
    }
  }, [onChange]);

  async function fetchData() {
    setGstr1ResultsLoaded(false);

    console.log('Fetching data started...');
    const startTime = Date.now();

    await resetDocErrorsListJSON();
    let taxData = await getTaxSettingsDetails();

    // Run some functions concurrently using Promise.all
    await Promise.all([
      getB2bSalesDataForGSTR(fromDate, toDate),
      getB2bSalesData(fromDate, toDate),
      getB2CLSalesDataForGSTR(taxData.state, fromDate, toDate),
      getB2CSSalesDataForGSTR(taxData.state, fromDate, toDate),
      getHSNSalesDataForGSTR(fromDate, toDate),
      getSalesReturnData(fromDate, toDate),
      getCDNRData(fromDate, toDate),
      getCDNURData(taxData.state, fromDate, toDate),
      getB2CSASalesDataForGSTR(taxData.state, fromDate, toDate),
      getB2bASalesDataForGSTR(fromDate, toDate),
      getB2CLASalesDataForGSTR(taxData.state, fromDate, toDate),
      getCDNRAData(fromDate, toDate),
      getCDNURAData(taxData.state, fromDate, toDate),
      getNilDataFromSale(fromDate, toDate),
      getNilDataFromSalesReturn(fromDate, toDate),
      getExportSalesDataForGSTR(fromDate, toDate),
      getExportASalesDataForGSTR(fromDate, toDate),
      getHSNWiseSalesData(fromDate, toDate),
      getJSONErrorList()
    ]);
    console.log('b2csSalesList', b2csSalesList);
    // getTransactionData();
    // let dataList = await getExpDataList();
    // setExpDataList(dataList);

    const endTime = Date.now();
    console.log(
      'Fetching data completed. Time taken:',
      endTime - startTime,
      'milliseconds'
    );
    setGstr1ResultsLoaded(true);
  }

  const getPlaceOfSupplyString = (_data) => {
    const { placeOfSupplyName } = _data;
    if (placeOfSupplyName) {
      const result = getStateList().find((e) => e.name === placeOfSupplyName);
      return result ? `${result.code}-${placeOfSupplyName}` : '';
    }
    return '';
  };

  const formatDateForXls = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, parseInt(month) - 1, day);
    const shortName = date.toLocaleString('en-US', { month: 'short' });
    return `${day}-${shortName}-${year}`;
  };

  const getDataFromTax = async () => {
    const wb = new Workbook();
    //Preparing B2B Sheet

    let b2bData = [];

    if (b2bSalesList && b2bSalesList.length > 0) {
      for (var i = 0; i < b2bSalesList.length; i++) {
        const invoice_date = await formatDateForXls(
          b2bSalesList[i].invoice_date
        );
        const b2bRecord = {
          'GSTIN/UIN': b2bSalesList[i].customerGSTNo,
          'Receiver Name': b2bSalesList[i].customer_name,
          'Invoice Number': b2bSalesList[i].sequenceNumber,
          'Invoice Date': invoice_date,
          'Invoice Value': b2bSalesList[i].total_amount,
          'Place of Supply': getPlaceOfSupplyString(b2bSalesList[i]),
          'Reverse Charge': b2bSalesList[i].reverseChargeValue ? 'Y' : 'N',
          'Applicable % of Tax Rate': '',
          'Invoice Type': 'Regular',
          'E-Commerce GSTIN': '',
          Rate: b2bSalesList[i].tax_percentage,
          'Taxable Value': Number(b2bSalesList[i].txval),
          'Cess Amount': b2bSalesList[i].cess
        };
        b2bData.push(b2bRecord);
      }
    } else {
      const b2bRecord = {
        'GSTIN/UIN': '',
        'Receiver Name': '',
        'Invoice Number': '',
        'Invoice Date': '',
        'Invoice Value': '',
        'Place of Supply': '',
        'Reverse Charge': '',
        'Applicable % of Tax Rate': '',
        'Invoice Type': '',
        'E-Commerce GSTIN': '',
        Rate: '',
        'Taxable Value': '',
        'Cess Amount': ''
      };
      b2bData.push(b2bRecord);
    }

    let wsB2B = XLSX.utils.json_to_sheet(b2bData);

    /* hide last column */
    wsB2B['!cols'] = [];

    wb.SheetNames.push('B2B');

    wb.Sheets['B2B'] = wsB2B;

    //Preparing B2BA Sheet
    let b2baData = [];

    const b2baRecord = {
      'GSTIN/UIN': '',
      'Receiver Name': '',
      'Original Invoice Number': '',
      'Original Invoice Date': '',
      'Revised Invoice Number': '',
      'Revised Invoice Date': '',
      'Invoice Value': '',
      'Place of Supply': '',
      'Reverse Charge': '',
      'Applicable % of Tax Rate': '',
      'Invoice Type': '',
      'E-Commerce GSTIN': '',
      Rate: '',
      'Taxable Value': '',
      'Cess Amount': ''
    };
    b2baData.push(b2baRecord);

    let wsB2BA = XLSX.utils.json_to_sheet(b2baData);

    /* hide last column */
    wsB2B['!cols'] = [];

    wb.SheetNames.push('B2BA');

    wb.Sheets['B2BA'] = wsB2BA;

    //Preparing B2CL Sheet
    let b2clData = [];
    console.log(b2clSalesList);
    if (b2clSalesList && b2clSalesList.length > 0) {
      for (var i = 0; i < b2clSalesList.length; i++) {
        const invoice_date = await formatDateForXls(
          b2clSalesList[i].invoice_date
        );

        const b2clRecord = {
          'Invoice Number': b2clSalesList[i].sequenceNumber,
          'Invoice Date': invoice_date,
          'Invoice Value': b2clSalesList[i].total_amount,
          'Place of Supply': getPlaceOfSupplyString(b2clSalesList[i]),
          'Applicable % of Tax Rate': '',
          Rate: b2clSalesList[i].tax_percentage,
          'Taxable Value': Number(b2clSalesList[i].txval),
          'Cess Amount': b2clSalesList[i].cess,
          'E-Commerce GSTIN': ''
        };
        b2clData.push(b2clRecord);
      }
    } else {
      const b2clRecord = {
        'Invoice Number': '',
        'Invoice Date': '',
        'Invoice Value': '',
        'Place of Supply': '',
        'Applicable % of Tax Rate': '',
        Rate: '',
        'Taxable Value': '',
        'Cess Amount': '',
        'E-Commerce GSTIN': ''
      };
      b2clData.push(b2clRecord);
    }

    let wsB2CL = XLSX.utils.json_to_sheet(b2clData);

    /* hide last column */
    wsB2CL['!cols'] = [];

    wb.SheetNames.push('B2CL');

    wb.Sheets['B2CL'] = wsB2CL;

    //Preparing B2CL Sheet
    let b2claData = [];

    const b2claRecord = {
      'Original Invoice Number': '',
      'Original Invoice Date': '',
      'Original Place of Supply': '',
      'Revised Invoice Number': '',
      'Revised Invoice Date': '',
      'Invoice Value': '',
      'Applicable % of Tax Rate': '',
      Rate: '',
      'Taxable Value': '',
      'Cess Amount': '',
      'E-Commerce GSTIN': ''
    };
    b2claData.push(b2claRecord);

    let wsB2CLA = XLSX.utils.json_to_sheet(b2claData);

    /* hide last column */
    wsB2CLA['!cols'] = [];

    wb.SheetNames.push('B2CLA');

    wb.Sheets['B2CLA'] = wsB2CLA;

    //Preparing B2CS Sheet
    let b2csData = [];

    if (b2csSalesList && b2csSalesList.length > 0) {
      for (var i = 0; i < b2csSalesList.length; i++) {
        const b2csRecord = {
          'Invoice Type': b2csSalesList[i].invoice_type,
          'Place of Supply': getPlaceOfSupplyString(b2csSalesList[i]),
          'Applicable % of Tax Rate': '',
          Rate: b2csSalesList[i].tax_percentage,
          'Taxable Value': b2csSalesList[i].txval,
          'Cess Amount': b2csSalesList[i].cess,
          'E-Commerce GSTIN': b2csSalesList[i].ecommerce
        };

        b2csData.push(b2csRecord);
      }
    } else {
      const b2csRecord = {
        'Invoice Type': '',
        'Place of Supply': '',
        'Applicable % of Tax Rate': '',
        Rate: '',
        'Taxable Value': '',
        'Cess Amount': '',
        'E-Commerce GSTIN': ''

        /* 'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Total Tax Amount': '', */
      };

      b2csData.push(b2csRecord);
    }

    let wsB2CS = XLSX.utils.json_to_sheet(b2csData);

    /* hide last column */
    wsB2CS['!cols'] = [];

    wb.SheetNames.push('B2CS');

    wb.Sheets['B2CS'] = wsB2CS;

    //Preparing B2CSA Sheet
    let b2csaData = [];

    const b2csaRecord = {
      'Financial Year': '',
      'Original Month': '',
      'Place of Supply': '',
      Type: '',
      'Applicable % of Tax Rate': '',
      Rate: '',
      'Taxable Value': '',
      'Cess Amount': '',
      'E-Commerce GSTIN': ''
    };

    b2csaData.push(b2csaRecord);

    let wsB2CSA = XLSX.utils.json_to_sheet(b2csaData);

    /* hide last column */
    wsB2CSA['!cols'] = [];

    wb.SheetNames.push('B2CSA');

    wb.Sheets['B2CSA'] = wsB2CSA;

    //Preparing CDNR Sheet
    let cdnrData = [];

    if (cdnrList && cdnrList.length > 0) {
      for (var i = 0; i < cdnrList.length; i++) {
        const invoice_date = await formatDateForXls(cdnrList[i].invoice_date);

        const cdnrRecord = {
          'GSTIN/UIN': cdnrList[i].gstin ? cdnrList[i].gstin : '',
          'Receiver Name': cdnrList[i].receiverName,
          'Note Number': cdnrList[i].sequenceNumber,
          'Note Date': invoice_date,
          'Note Type': cdnrList[i].type,
          'Place of Supply': getPlaceOfSupplyString(cdnrList[i]),
          'Reverse Charge': cdnrList[i].reverseChargeValue ? 'Y' : 'N',
          'Note Supply Type': '',
          'Note Value': cdnrList[i].total_amount,
          'Applicable % of Tax Rate': '',
          Rate: cdnrList[i].tax_percentage,
          'Taxable Value': Number(cdnrList[i].txval),
          'Cess Amount': cdnrList[i].cess
        };

        cdnrData.push(cdnrRecord);
      }
    } else {
      const cdnrRecord = {
        'GSTIN/UIN': '',
        'Receiver Name': '',
        'Note Number': '',
        'Note Date': '',
        'Note Type': '',
        'Place of Supply': '',
        'Reverse Charge': '',
        'Note Supply Type': '',
        'Note Value': '',
        'Applicable % of Tax Rate': '',
        Rate: '',
        'Taxable Value': '',
        'Cess Amount': ''
      };

      cdnrData.push(cdnrRecord);
    }

    let wsCDNR = XLSX.utils.json_to_sheet(cdnrData);

    /* hide last column */
    wsCDNR['!cols'] = [];

    wb.SheetNames.push('CDNR');

    wb.Sheets['CDNR'] = wsCDNR;

    //Preparing CDNRA Sheet
    let cdnraData = [];

    const cdnraRecord = {
      'GSTIN/UIN': '',
      'Receiver Name': '',
      'Original Note Number': '',
      'Original Note Date': '',
      'Received Note Number': '',
      'Received Note Date': '',
      'Note Type': '',
      'Place of Supply': '',
      'Reverse Charge': '',
      'Note Supply Type': '',
      'Note Value': '',
      'Applicable % of Tax Rate': '',
      Rate: '',
      'Taxable Value': '',
      'Cess Amount': ''
    };

    cdnraData.push(cdnraRecord);

    let wsCDNRA = XLSX.utils.json_to_sheet(cdnraData);

    /* hide last column */
    wsCDNRA['!cols'] = [];

    wb.SheetNames.push('CDNRA');

    wb.Sheets['CDNRA'] = wsCDNRA;

    //Preparing CDNUR Sheet
    let cdnurData = [];

    if (cdnurList && cdnurList.length > 0) {
      for (var i = 0; i < cdnurList.length; i++) {
        const invoice_date = await formatDateForXls(cdnurList[i].invoice_date);

        const cdnurRecord = {
          'UR Type': cdnurList[i].cdnur,
          'Note Number': cdnurList[i].sequenceNumber,
          'Note Date': invoice_date,
          'Note Type': cdnurList[i].type,
          'Place of Supply': getPlaceOfSupplyString(cdnurList[i]),
          'Note Value': cdnurList[i].total_amount,
          'Applicable % of Tax Rate': '',
          Rate: cdnurList[i].tax_percentage,
          'Taxable Value': Number(cdnurList[i].txval),
          'Cess Amount': cdnurList[i].cess

          /* 'GSTIN/UIN': cdnurList[i].gstin ? cdnurList[i].gstin : '',
          'Receiver Name': cdnurList[i].receiverName,
          'Note Supply Type': '',          
          'Reverse Charge': cdnurList[i].reverseChargeValue ? 'Y' : 'N', */
        };

        cdnurData.push(cdnurRecord);
      }
    } else {
      const cdnurRecord = {
        'UR Type': '',
        'Note Number': '',
        'Note Date': '',
        'Note Type': '',
        'Place of Supply': '',
        'Note Value': '',
        'Applicable % of Tax Rate': '',
        Rate: '',
        'Taxable Value': '',
        'Cess Amount': ''

        /* 'GSTIN/UIN': '',
        'Receiver Name': '', 
        'Note Supply Type': '',
        'Reverse Charge': '',*/
      };

      cdnurData.push(cdnurRecord);
    }

    let wsCDNUR = XLSX.utils.json_to_sheet(cdnurData);

    /* hide last column */
    wsCDNUR['!cols'] = [];

    wb.SheetNames.push('CDNUR');

    wb.Sheets['CDNUR'] = wsCDNUR;

    //Preparing CDNURA Sheet
    let cdnuraData = [];

    const cdnuraRecord = {
      'UR Type': '',
      'Original Note Number': '',
      'Original Note Date': '',
      'Revised Note Number': '',
      'Revised Note Date': '',
      'Note Type': '',
      'Note Value': '',
      'Place of Supply': '',
      'Applicable % of Tax Rate': '',
      Rate: '',
      'Taxable Value': '',
      'Cess Amount': ''
    };

    cdnuraData.push(cdnuraRecord);

    let wsCDNURA = XLSX.utils.json_to_sheet(cdnuraData);

    /* hide last column */
    wsCDNURA['!cols'] = [];

    wb.SheetNames.push('CDNURA');

    wb.Sheets['CDNURA'] = wsCDNURA;

    //Preparing EXP Sheet
    let expDataList = [];

    if (finalExpData && finalExpData.length > 0) {
      for (var i = 0; i < finalExpData.length; i++) {
        const invoice_date = await formatDateForXls(
          finalExpData[i].invoice_date
        );

        const expRecord = {
          'Export Type': '',
          'Invoice Number': finalExpData[i].sequenceNumber,
          'Invoice Date': invoice_date,
          'Invoice Value': finalExpData[i].total_amount,
          'Port Code': '',
          'Shipping Bill Number': '',
          'Shipping Bill Date': '',
          Rate: finalExpData[i].tax_percentage,
          'Taxable Value': Number(finalExpData[i].txval),
          'Cess Amount': finalExpData[i].cess
        };
        expDataList.push(expRecord);
      }
    } else {
      const expRecord = {
        'Export Type': '',
        'Invoice Number': '',
        'Invoice Date': '',
        'Invoice Value': '',
        'Port Code': '',
        'Shipping Bill Number': '',
        'Shipping Bill Date': '',
        Rate: '',
        'Taxable Value': '',
        'Cess Amount': ''
      };
      expDataList.push(expRecord);
    }

    let wsEXP = XLSX.utils.json_to_sheet(expDataList);

    /* hide last column */
    wsEXP['!cols'] = [];

    wb.SheetNames.push('EXP');

    wb.Sheets['EXP'] = wsEXP;

    //Preparing EXPA Sheet
    let expaDataList = [];

    const expaRecord = {
      'Export Type': '',
      'Original Invoice Number': '',
      'Original Invoice Date': '',
      'Revised Invoice Number': '',
      'Revised Invoice Date': '',
      'Invoice Value': '',
      'Port Code': '',
      'Shipping Bill Number': '',
      'Shipping Bill Date': '',
      Rate: '',
      'Taxable Value': '',
      'Cess Amount': ''
    };
    expaDataList.push(expaRecord);

    let wsEXPA = XLSX.utils.json_to_sheet(expaDataList);

    /* hide last column */
    wsEXPA['!cols'] = [];

    wb.SheetNames.push('EXPA');

    wb.Sheets['EXPA'] = wsEXPA;

    //Preparing AT Sheet
    let atDataList = [];

    const atRecord = {
      'Place of Supply': '',
      'Applicable % of Tax Rate': '',
      Rate: '',
      'Gross Advance Received': '',
      'Cess Amount': ''
    };
    atDataList.push(atRecord);

    let wsAT = XLSX.utils.json_to_sheet(atDataList);

    /* hide last column */
    wsAT['!cols'] = [];

    wb.SheetNames.push('AT');

    wb.Sheets['AT'] = wsAT;

    //Preparing ATA Sheet
    let ataDataList = [];

    const ataRecord = {
      'Financial Year': '',
      'Original Month ': '',
      'Original Place of Supply': '',
      'Applicable % of Tax Rate': '',
      Rate: '',
      'Gross Advance Received': '',
      'Cess Amount': ''
    };
    ataDataList.push(ataRecord);

    let wsATA = XLSX.utils.json_to_sheet(ataDataList);

    /* hide last column */
    wsATA['!cols'] = [];

    wb.SheetNames.push('ATA');

    wb.Sheets['ATA'] = wsATA;

    //Preparing ATADJ Sheet
    let atadjDataList = [];

    const atadjRecord = {
      'Place of Supply': '',
      'Applicable % of Tax Rate': '',
      Rate: '',
      'Gross Advance Received': '',
      'Cess Amount': ''
    };
    atadjDataList.push(atadjRecord);

    let wsATADJ = XLSX.utils.json_to_sheet(atadjDataList);

    /* hide last column */
    wsATADJ['!cols'] = [];

    wb.SheetNames.push('ATADJ');

    wb.Sheets['ATADJ'] = wsATADJ;

    //Preparing ATADJA Sheet
    let atadjaDataList = [];

    const atadjaRecord = {
      'Financial Year': '',
      'Original Month ': '',
      'Original Place of Supply': '',
      'Applicable % of Tax Rate': '',
      Rate: '',
      'Gross Advance Received': '',
      'Cess Amount': ''
    };
    atadjaDataList.push(atadjaRecord);

    let wsATADJA = XLSX.utils.json_to_sheet(atadjaDataList);

    /* hide last column */
    wsATADJA['!cols'] = [];

    wb.SheetNames.push('ATADJA');

    wb.Sheets['ATADJA'] = wsATADJA;

    //Preparing EXEMP Sheet
    let exempData = [];

    for (var e = 0; e < exempList.length; e++) {
      const exempRecord = {
        Description: exempList[e].description,
        'Nil Rated Supplies': exempList[e].nill_rated,
        Exempted: exempList[e].exempted,
        'Non-GST Supplies': exempList[e].non_gst
      };

      exempData.push(exempRecord);
    }

    let wsEXEMP = XLSX.utils.json_to_sheet(exempData);

    /* hide last column */
    wsEXEMP['!cols'] = [];

    wb.SheetNames.push('EXEMP');

    wb.Sheets['EXEMP'] = wsEXEMP;

    //Preparing HSN Sheet
    let hsnData = [];

    if (hsnSalesList && hsnSalesList.length > 0) {
      for (var i = 0; i < hsnSalesList.length; i++) {
        const hsnRecord = {
          HSN: hsnSalesList[i].hsn,
          Description: hsnSalesList[i].supply,
          UQC: hsnSalesList[i].rate,
          'Total Quantity': parseFloat(hsnSalesList[i].qty).toFixed(2),
          'Total Value': parseFloat(hsnSalesList[i].amount).toFixed(2),
          'Taxable Value': parseFloat(Number(hsnSalesList[i].txval)).toFixed(2),
          'Integrated Tax': parseFloat(hsnSalesList[i].igst_amount).toFixed(2),
          'Central Tax': parseFloat(hsnSalesList[i].central_tax).toFixed(2),
          'State/UT Tax': parseFloat(hsnSalesList[i].state_ui_tax).toFixed(2),
          'Cess Amount': parseFloat(hsnSalesList[i].cess_amount).toFixed(2),
          Rate: parseFloat(hsnSalesList[i].tax_percentage).toFixed(2)
        };

        hsnData.push(hsnRecord);
      }
    } else {
      const hsnRecord = {
        HSN: '',
        Description: '',
        UQC: '',
        'Total Quantity': '',
        'Total Value': '',
        'Taxable Value': '',
        'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Cess Amount': '',
        Rate: ''
      };

      hsnData.push(hsnRecord);
    }

    let wsHSN = XLSX.utils.json_to_sheet(hsnData);

    /* hide last column */
    wsHSN['!cols'] = [];

    wb.SheetNames.push('HSN');

    wb.Sheets['HSN'] = wsHSN;

    //Preparing DOCS Sheet
    let docsDataList = [];

    const docsRecord = {
      'Nature of Document': '',
      'Sr. No. From': '',
      'Sr. No. To': '',
      'Total Number': '',
      Cancelled: ''
    };
    docsDataList.push(docsRecord);

    let wsDOCS = XLSX.utils.json_to_sheet(docsDataList);

    /* hide last column */
    wsDOCS['!cols'] = [];

    wb.SheetNames.push('DOCS');

    wb.Sheets['DOCS'] = wsDOCS;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'GSTR_1_Report';

    download(url, fileName + '.xlsx');
  };

  const download = (url, name) => {
    let a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);

    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

    return buf;
  }

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

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`
    };
  }

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

        if (stateCodeData) {
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
      fp: getSelectedDateMonthAndYearMMYYYY(fromDate),
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

    const data = JSON.stringify(finalJson);
    setOnlineJsonData(data);
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

  const onFirstPageClicked = () => {
    if (salesGridApi) {
      setCurrentPage(1);
      setOnChange(true);
    }
  };

  const onLastPageClicked = () => {
    if (salesGridApi) {
      setCurrentPage(totalPages);
      setOnChange(true);
    }
  };

  const onPreviousPageClicked = () => {
    if (salesGridApi) {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        setOnChange(true);
      }
    }
  };

  const onNextPageClicked = () => {
    if (salesGridApi) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        setOnChange(true);
      }
    }
  };

  const getSalesData = async () => {
    const db = await Db.get();

    let result = [];

    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      {
        invoice_date: {
          $gte: fromDate
        }
      },
      {
        invoice_date: {
          $lte: toDate
        }
      },
      {
        sortingNumber: { $exists: true }
      }
    ];

    if (prefixData.sales && prefixData.sales !== '') {
      let prefixFilter = {};

      if (prefixData.sales === 'NoPrefix' || prefixData.sales === 'AllPrefix') {
        if (prefixData.sales === 'NoPrefix') {
          prefixFilter = {
            prefix: { $exists: false }
          };
        } else if (prefixData.sales === 'AllPrefix') {
          prefixFilter = {
            prefix: { $exists: true }
          };
        }
      } else {
        var regexp = new RegExp('^.*' + prefixData.sales + '.*$', 'i');
        prefixFilter = {
          prefix: { $regex: regexp }
        };
      }
      filterArray.push(prefixFilter);
    }

    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSalesData();
    }

    await db.sales
      .find({
        selector: {
          $and: filterArray
        },
        sort: [{ sortingNumber: 'asc' }],
        skip: skip,
        limit: limit
      })
      .exec()
      .then((data) => {
        // console.log(data);
        data.map((item) => {
          let row = item.toJSON();
          let items = row.item_list;
          let taxSlabs = new Map();

          for (let item of items) {
            let cess = 0;
            let igst_amount = 0;
            let cgst_amount = 0;
            let sgst_amount = 0;
            let total_tax = 0;
            let amount = 0;
            //add all items tax and amount details in map then finally that many rows in
            if (taxSlabs.has(item.cgst) || taxSlabs.has(item.igst)) {
              let existingRow = {};

              if (taxSlabs.has(item.cgst)) {
                existingRow = taxSlabs.get(item.cgst);
              } else {
                existingRow = taxSlabs.get(item.igst);
              }
              cess = parseFloat(existingRow.cess);
              igst_amount = parseFloat(existingRow.igst_amount);
              cgst_amount = parseFloat(existingRow.cgst_amount);
              sgst_amount = parseFloat(existingRow.sgst_amount);
              total_tax = parseFloat(existingRow.total_tax);
              amount = parseFloat(existingRow.amount);
            }

            cess = cess + parseFloat(item.cess);
            igst_amount =
              parseFloat(igst_amount) + parseFloat(item.igst_amount);
            cgst_amount =
              parseFloat(cgst_amount) + parseFloat(item.cgst_amount);
            sgst_amount =
              parseFloat(sgst_amount) + parseFloat(item.sgst_amount);
            amount = parseFloat(amount) + parseFloat(item.amount);

            total_tax =
              parseFloat(cess) +
              parseFloat(cgst_amount) +
              parseFloat(sgst_amount) +
              parseFloat(igst_amount);

            let tempRow = {};
            tempRow.total_tax = parseFloat(total_tax).toFixed(2);
            tempRow.cess = cess;
            tempRow.igst_amount = parseFloat(igst_amount).toFixed(2);
            tempRow.cgst_amount = parseFloat(cgst_amount).toFixed(2);
            tempRow.sgst_amount = parseFloat(sgst_amount).toFixed(2);
            tempRow.amount = parseFloat(amount).toFixed(2);

            if (item.cgst > 0) {
              taxSlabs.set(item.cgst, tempRow);
            } else {
              taxSlabs.set(item.igst, tempRow);
            }
          }

          taxSlabs.forEach((value, key) => {
            // console.log(value, key);
            let individualTaxSlotRow = item.toJSON();

            let taxRecord = value;
            individualTaxSlotRow.total_tax = parseFloat(
              taxRecord.total_tax
            ).toFixed(2);
            individualTaxSlotRow.cess = taxRecord.cess;
            individualTaxSlotRow.igst_amount = parseFloat(
              taxRecord.igst_amount
            ).toFixed(2);
            individualTaxSlotRow.cgst_amount = parseFloat(
              taxRecord.cgst_amount
            ).toFixed(2);
            individualTaxSlotRow.sgst_amount = parseFloat(
              taxRecord.sgst_amount
            ).toFixed(2);
            individualTaxSlotRow.amount = parseFloat(taxRecord.amount).toFixed(
              2
            );
            if (individualTaxSlotRow.igst_amount > 0) {
              individualTaxSlotRow.tax_percentage = parseFloat(key);
            } else {
              individualTaxSlotRow.tax_percentage = parseFloat(key) * 2;
            }

            result.push(individualTaxSlotRow);
            individualTaxSlotRow = {};
          });
        });
        setSalesData(result);
      });
  };

  const getAllSalesData = async () => {
    const db = await Db.get();

    let result = [];

    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      {
        invoice_date: {
          $gte: fromDate
        }
      },
      {
        invoice_date: {
          $lte: toDate
        }
      }
    ];

    if (prefixData.sales && prefixData.sales !== '') {
      let prefixFilter = {};

      if (prefixData.sales === 'NoPrefix' || prefixData.sales === 'AllPrefix') {
        if (prefixData.sales === 'NoPrefix') {
          prefixFilter = {
            prefix: { $exists: false }
          };
        } else if (prefixData.sales === 'AllPrefix') {
          prefixFilter = {
            prefix: { $exists: true }
          };
        }
      } else {
        var regexp = new RegExp('^.*' + prefixData.sales + '.*$', 'i');
        prefixFilter = {
          prefix: { $regex: regexp }
        };
      }
      filterArray.push(prefixFilter);
    }

    await db.sales
      .find({
        selector: {
          $and: filterArray
        }
      })
      .exec()
      .then((data) => {
        let count = data.length;

        let numberOfPages = 1;

        if (count % limit === 0) {
          numberOfPages = parseInt(count / limit);
        } else {
          numberOfPages = parseInt(count / limit + 1);
        }
        setTotalPages(numberOfPages);
      });
  };

  const onSalesGridReady = (params) => {
    setSalesGridApi(params.api);
    setSalesGridColumnApi(params.columnApi);
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

  const [salesColumnDefs] = useState([
    createColumnDef('GSTIN/UIN', 'customerGSTNo'),
    createColumnDef('Customer Name', 'customer_name'),
    createColumnDef('Place of Supply', 'place_of_supply'),
    createColumnDef('Invoice Number', 'sequenceNumber'),
    createColumnDef('Invoice Date', 'invoice_date'),
    createColumnDef('Invoice Value', 'amount'),
    createColumnDef('Total Tax %', 'tax_percentage', 100, 100),
    createColumnDef('Taxable Value', '', 100, 120, (params) => {
      const data = params.data;
      const result = parseFloat(data.amount - data.total_tax).toFixed(2);
      return parseFloat(result).toFixed(2);
    }),
    createColumnDef('SGST', 'sgst_amount'),
    createColumnDef('CGST', 'cgst_amount'),
    createColumnDef('IGST', 'igst_amount'),
    createColumnDef('Cess', 'cess'),
    createColumnDef('Total Tax', 'total_tax'),
    {
      headerName: '',
      field: '',
      width: 100,
      minWidth: 100,
      suppressMenu: true,
      sortable: false,
      cellRenderer: 'templateSaleActionRenderer'
    }
  ]);

  const TemplateSaleActionRenderer = (props) => {
    return (
      <MoreOptionsSales
        menu={moreoption.moreoptionsdata}
        index={props['data']['sequenceNumber']}
        item={props['data']}
        id={props['data']['sequenceNumber']}
        component="salesList"
      />
    );
  };

  const onSaleReturnGridReady = (params) => {
    setSaleReturnGridApi(params.api);
    setSaleReturnGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const [saleReturnColumnDefs] = useState([
    createColumnDef('GSTIN/UIN', 'customerGSTNo'),
    createColumnDef('Customer Name', 'customer_name'),
    createColumnDef('Place of Supply', 'place_of_supply'),
    createColumnDef('Invoice Number', 'sequenceNumber'),
    createColumnDef('Invoice Date', 'invoice_date'),
    createColumnDef('Invoice Value', 'amount'),
    createColumnDef('Total Tax %', 'tax_percentage', 100, 100),
    createColumnDef('Taxable Value', '', 100, 120, (params) => {
      const data = params.data;
      const result = parseFloat(data.amount - data.total_tax).toFixed(2);
      return parseFloat(result).toFixed(2);
    }),
    createColumnDef('SGST', 'sgst_amount'),
    createColumnDef('CGST', 'cgst_amount'),
    createColumnDef('IGST', 'igst_amount'),
    createColumnDef('Cess', 'cess'),
    createColumnDef('Total Tax', 'total_tax')
  ]);

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
  const openFileOnline = () => {
    downloadJson(false, true, false);
    setTimeout(() => {
      handleOnlineGSTRModalOpen();
    }, 1000);
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
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 83 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 83 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    GSTR-1 (Offline Download)
                  </Typography>
                </div>
              </div>

              <div>
                <Grid container className={classes.categoryActionWrapper}>
                  <Grid item xs={12} sm={4}>
                    <div>
                      <form className={classes.blockLine} noValidate>
                        <TextField
                          id="date"
                          label="From"
                          type="date"
                          value={fromDate}
                          onChange={(e) => {
                            setDateRageOfGSTR1FromDate(
                              formatDate(e.target.value)
                            );
                            setFromDate(formatDate(e.target.value));
                            setCurrentPage(1);
                            setTotalPages(1);
                            setOnChange(true);
                          }}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </form>
                      <form className={classes.blockLine} noValidate>
                        <TextField
                          id="date"
                          label="To"
                          type="date"
                          value={toDate}
                          onChange={(e) => {
                            setDateRageOfGSTR1ToDate(
                              formatDate(e.target.value)
                            );
                            setToDate(formatDate(e.target.value));
                            setCurrentPage(1);
                            setTotalPages(1);
                            setOnChange(true);
                          }}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </form>
                    </div>
                  </Grid>

                  {/* Prefix Filter */}

                  {transaction.sales.prefixSequence &&
                  transaction.sales.prefixSequence.length > 0 ? (
                    <Grid
                      item
                      xs={12}
                      sm={2}
                      style={{ display: 'flex', marginTop: '10px' }}
                    >
                      <Select
                        displayEmpty
                        value={prefixSelect}
                        input={
                          <OutlinedInput
                            style={{
                              width: '100%',
                              height: '35px'
                            }}
                          />
                        }
                        inputProps={{ 'aria-label': 'Without label' }}
                      >
                        <MenuItem disabled value="">
                          Prefix
                        </MenuItem>

                        {transaction.sales.prefixSequence.map(
                          (option, index) =>
                            option.prefix !== '' && (
                              <MenuItem
                                value={option.prefix}
                                style={{ color: 'black' }}
                                onClick={() => {
                                  setPrefixSelect(option.prefix);
                                  setOnChange(true);
                                }}
                              >
                                {option.prefix}
                              </MenuItem>
                            )
                        )}
                        <MenuItem
                          value="NoPrefix"
                          key="NoPrefix"
                          name="NoPrefix"
                          style={{ color: 'black' }}
                          onClick={() => {
                            setPrefixSelect('NoPrefix');
                            setOnChange(true);
                          }}
                        >
                          No Prefix
                        </MenuItem>
                        <MenuItem
                          value="AllPrefix"
                          key="AllPrefix"
                          name="AllPrefix"
                          onClick={() => {
                            setPrefixSelect('AllPrefix');
                            setOnChange(true);
                          }}
                        >
                          All Prefix
                        </MenuItem>
                      </Select>
                      <Button
                        className={classes.resetbtn}
                        size="small"
                        onClick={() => {
                          setPrefixSelect('');

                          setOnChange(true);
                        }}
                        color="secondary"
                      >
                        RESET
                      </Button>
                    </Grid>
                  ) : (
                    <Grid item xs={12} sm={2}></Grid>
                  )}

                  <Grid item xs={12} sm={6} style={{ marginTop: '10px' }}>
                    {gstr1ResultsLoaded && (
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        className="category-actions-right"
                      >
                        {/* <Button
                          variant="contained"
                          color="primary"
                          className="customTextField"
                          style={{
                            color: 'black',
                            marginRight: 15,
                            height: '35px'
                          }}
                          onClick={() => downloadJson(false, true, true)}
                        >
                          GSTR1 JSON (HSN Incl.)
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          className="customTextField"
                          style={{
                            color: 'black',
                            marginRight: 15,
                            height: '35px'
                          }}
                          onClick={() => downloadJson(false, false, true)}
                        >
                          GSTR1 JSON
                        </Button> */}

                        <Dropdown>
                          <DropdownHoverBtn style={{ cursor: 'pointer' }}>
                            Download
                          </DropdownHoverBtn>
                          <DropdownHoverContent>
                            <DropdownLinkHover>
                              <Typography
                                onClick={() => downloadJson(false, true, true)}
                                style={{ cursor: 'pointer', color: '#000' }}
                              >
                                GSTR1 JSON (HSN Incl.)
                              </Typography>
                            </DropdownLinkHover>
                            <DropdownLinkHover>
                              <Typography
                                onClick={() => downloadJson(false, false, true)}
                                style={{ cursor: 'pointer', color: '#000' }}
                              >
                                GSTR1 JSON
                              </Typography>
                            </DropdownLinkHover>
                          </DropdownHoverContent>
                        </Dropdown>
                        {/* <Button
                          variant="contained"
                          color="primary"
                          className="customTextField"
                          style={{
                            color: 'black',
                            marginRight: 15,
                            height: '35px'
                          }}
                          onClick={openFileOnline}
                        >
                          File GST
                        </Button> */}
                        {/* <Avatar>
                        <IconButton onClick={() => getDataFromTax()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar> */}
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </div>

              <div className={classes.itemTable} style={{ marginTop: '10px' }}>
                <AppBar position="static">
                  <Tabs
                    value={Tabvalue}
                    onChange={handleTabChange}
                    aria-label=""
                  >
                    <Tab label="Sales" {...a11yProps(0)} />
                    <Tab label="Sales Return" {...a11yProps(1)} />
                    <Tab label="Error Report" {...a11yProps(2)} />
                  </Tabs>
                </AppBar>
                {Tabvalue === 0 && (
                  <div
                    className={classes.root}
                    style={{ minHeight: height - 262 }}
                  >
                    <div className={classes.itemTable}>
                      {/* <App />  */}

                      <Box mt={4}>
                        <div
                          style={{
                            width: '100%',
                            height: height - 290 + 'px'
                          }}
                          className=" blue-theme"
                        >
                          <div
                            id="product-list-grid"
                            style={{ height: '100%', width: '100%' }}
                            className="ag-theme-material"
                          >
                            <AgGridReact
                              onGridReady={onSalesGridReady}
                              enableRangeSelection
                              paginationPageSize={20}
                              suppressMenuHide
                              rowData={salesData}
                              columnDefs={salesColumnDefs}
                              defaultColDef={defaultColDef}
                              rowSelection="single"
                              pagination
                              headerHeight={40}
                              rowClassRules={rowClassRules}
                              suppressPaginationPanel={true}
                              suppressScrollOnNewData={true}
                              overlayLoadingTemplate={
                                '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                              }
                              frameworkComponents={{
                                templateSaleActionRenderer:
                                  TemplateSaleActionRenderer
                              }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                float: 'right',
                                marginTop: '5px',
                                marginBottom: '5px'
                              }}
                            >
                              <img
                                alt="Logo"
                                src={first_page_arrow}
                                width="20px"
                                height="20px"
                                style={{ marginRight: '10px' }}
                                onClick={() => onFirstPageClicked()}
                              />
                              <img
                                alt="Logo"
                                src={right_arrow}
                                width="20px"
                                height="20px"
                                onClick={() => onPreviousPageClicked()}
                              />
                              <p
                                style={{
                                  marginLeft: '10px',
                                  marginRight: '10px',
                                  marginTop: '2px'
                                }}
                              >
                                Page {currentPage} of {totalPages}
                              </p>
                              <img
                                alt="Logo"
                                src={left_arrow}
                                width="20px"
                                height="20px"
                                style={{ marginRight: '10px' }}
                                onClick={() => onNextPageClicked()}
                              />
                              <img
                                alt="Logo"
                                src={last_page_arrow}
                                width="20px"
                                height="20px"
                                onClick={() => onLastPageClicked()}
                              />
                            </div>
                          </div>
                        </div>
                      </Box>
                    </div>
                  </div>
                )}
                {Tabvalue === 1 && (
                  <div
                    className={classes.root}
                    style={{ minHeight: height - 262 }}
                  >
                    <div className={classes.itemTable}>
                      {/* <App />  */}

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
                              onGridReady={onSaleReturnGridReady}
                              enableRangeSelection
                              paginationPageSize={20}
                              suppressMenuHide
                              rowData={salesReturnData}
                              columnDefs={saleReturnColumnDefs}
                              defaultColDef={defaultColDef}
                              rowSelection="single"
                              pagination
                              headerHeight={40}
                              rowClassRules={rowClassRules}
                              overlayLoadingTemplate={
                                '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                              }
                              frameworkComponents={{}}
                            />
                          </div>
                        </div>
                      </Box>
                    </div>
                  </div>
                )}
                {Tabvalue === 2 && (
                  <div
                    className={classes.root}
                    style={{ minHeight: height - 262 }}
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
                                templateActionRenderer: TemplateActionRenderer
                              }}
                            />
                          </div>
                        </div>
                      </Box>
                    </div>
                  </div>
                )}
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}

          {openAddSalesInvoice ? <AddInvoice /> : null}
          {openEWayGenerateModal ? <EWayGenerate /> : null}
          {productDialogOpen ? <ProductModal /> : null}
          {/* {onlineGSTRDialogOpen ? <OnlineGSTRModal jsonData={onlineJsonData}/> : null} */}
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
        </div>
      )}
    </div>
  );
};

export default InjectObserver(GSTR1ReportsView);