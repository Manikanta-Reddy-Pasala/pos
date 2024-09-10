import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Button,
  IconButton,
  Paper,
  Checkbox,
  FormControl,
  FormControlLabel
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import * as Db from '../../../../RxDb/Database/Database';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import { getProductTxnListByDateAndProduct } from 'src/components/Helpers/ProductTxnQueryHelper';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import { toJS } from 'mobx';
import EditMfgModal from 'src/components/modal/EditMfgModal';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none'
  },

  selectFont: {
    fontSize: '13px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  datepickerbg: {
    '& .MuiPickersToolbar-toolbar': {
      backgroundColor: '#ef5350 !important'
    },
    '& .MuiButton-textPrimary': {
      color: '#ef5350 !important'
    },
    '& .MuiPickersDay-daySelected': {
      backgroundColor: '#ef5350 !important'
    }
  },
  selectOption: {
    float: 'left',
    '& .makeStyles-formControl-53': {
      borderRadius: '7px'
    }
  },
  datePickerOption: {
    float: 'right',
    display: 'inline-block',
    marginRight: '26px'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    '& .MuiSelect-selectMenu': {
      background: 'white'
    }
  },
  paymentTypeOption: {
    margin: theme.spacing(2),
    minWidth: 120
  },
  itemTable: {
    width: '100%',
    display: 'inline-block'
  },
  roundOff: {
    '& .MuiFormControl-root': {
      background: 'white',
      verticalAlign: 'inherit',
      width: '100px',
      paddingLeft: '10px'
    }
  },
  searchInputRoot: {
    borderRadius: 50,
    marginLeft: '-12px',
    marginTop: '13px'
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
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  nameList: {
    marginLeft: '12px',
    marginTop: '20px'
  },
  radioDate: {
    marginLeft: '13px',
    marginTop: '15px'
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
  root: {
    minHeight: '616px',
    padding: 2,
    borderRadius: '12px',
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
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
    textAlign: 'center'
  },
  totalQty: {
    color: '#80D5B8',
    textAlign: 'center'
  },
  categoryActionWrapper: {
    paddingRight: '10px',
    '& .category-actions-left': {
      '& > *': {
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .category-actions-right': {
      '& > *': {
        marginLeft: theme.spacing(2),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  },
  outlinedInput: {
    width: '100%'
  },
  tableForm: {
    padding: '10px 6px'
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  listbox: {
    margin: 5,
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  resetbtn: {
    margin: 20,
    padding: 6
  },
  tableStyle: {
    borderCollapse: 'collapse',
    border: '1px solid black',
    width: '100%',
  },
  borderRight: {
    borderRight: '1px solid black',
  },

  borderBottom: {
    borderBottom: '1px solid black',
  },
  pad: {
    padding: '10px'
  },
  numberCls: {
    textAlign: 'center'
  },
  rowCls: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e6e62b'
    },

  },
  filterBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    height: '30px',
    margin: '10px',
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    },
    fontSize: '12px'
  },
}));

const TransactionByItemV2 = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [rowData, setRowData] = useState([]);
  const [listRowData, setListRowData] = useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [productName, setProductName] = React.useState('');
  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);
  const [salesChecked, setSalesChecked] = useState(true);
  const [salesReturnChecked, setSalesReturnChecked] = useState(true);
  const [purchaseChecked, setPurchaseChecked] = useState(true);
  const [purchaseReturnChecked, setPurchaseReturnChecked] = useState(true);
  const [rawMaterialChecked, setRawMaterialChecked] = useState(true);
  const [manufactureChecked, setManufactureChecked] = useState(true);

  const [totalSalesQty, setTotalSalesQty] = useState(0);
  const [totalSalesReturnQty, setTotalSalesReturnQty] = useState(0);
  const [totalPurchasesQty, setTotalPurchasesQty] = useState(0);
  const [totalPurchasesReturnQty, setTotalPurchasesReturnQty] = useState(0);
  const [totalManufactureQty, setTotalManufactureQty] = useState(0);
  const [totalRawMaterialQty, setTotalRawMaterialQty] = useState(0);
  const [totalInQty, setTotalInQty] = useState(0);
  const [totalOutQty, setTotalOutQty] = useState(0);
  const [onChange, setOnChange] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));
  const [datePrice, setDatePrice] = React.useState({});


  const stores = useStore();
  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } =
    toJS(stores.SalesAddStore);
  const { openAddSalesReturn } = toJS(stores.ReturnsAddStore);
  const { OpenAddPurchaseBill } = toJS(stores.PurchasesAddStore);
  const { OpenAddPurchasesReturn } = toJS(stores.PurchasesReturnsAddStore);
  const { openEWayGenerateModal } = toJS(stores.EWayStore);
  const { productDialogOpen } = toJS(stores.ProductStore);

  const { viewOrEditSaleTxnItem, resetEWayLaunchFlag } = stores.SalesAddStore;
  const { viewOrEditSaleReturnTxnItem } = stores.ReturnsAddStore;
  const { viewOrEditPurchaseTxnItem } = stores.PurchasesAddStore;
  const { viewOrEditPurchaseReturnTxnItem } = stores.PurchasesReturnsAddStore;
  const { editMfgOpenDialog } = toJS(stores.ProductStore);
  const { updateProductFromManufacture } = stores.ProductStore;
  const { handleOpenEWayGenerateModal } = stores.EWayStore;
  const { selectedStockProduct, handleOpenTransactionByProduct } = toJS(
    stores.ReportsStore
  );
  let closingQuantity = 0;
  let closingQuantityFinal = 0;

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };


  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function getName(data) {
    let name = '';
    if (data.customerName && data.customerName !== undefined) {
      name = data.customerName;
    } else if (data.vendorName && data.vendorName !== undefined) {
      name = data.vendorName;
    }

    return name;
  }

  function getQuantityWithUnits(data) {
    let qtyName = data.txnQty;
    if (data.qtyUnit && data.qtyUnit !== '') {
      qtyName += ' ' + data.qtyUnit;
    }

    return qtyName;
  }

  function getFreeQuantityWithUnits(data) {
    let qtyName = data.freeTxnQty;
    if (data.qtyUnit && data.qtyUnit !== '') {
      qtyName += ' ' + data.qtyUnit;
    }

    return qtyName;
  }

  function getPricePerUnit(data) {
    let price = 0;
    if (
      'Sales' === data.txnType ||
      'KOT' === data.txnType ||
      'Sales Return' === data.txnType ||
      'Raw Material' === data.txnType ||
      'Manufacture' === data.txnType
    ) {
      price = parseFloat(data.amount) - parseFloat(data.taxAmount);
    } else if (
      'Purchases' === data.txnType ||
      'Purchases Return' === data.txnType
    ) {
      price = data.purchased_price_before_tax;
    }

    return parseFloat(price).toFixed(2);
  }

  function getStockInHand(data) {
    let finalStock = 0;
    if (
      'Sales' === data.txnType ||
      'KOT' === data.txnType ||
      'Purchases Return' === data.txnType ||
      'Raw Material' === data.txnType
    ) {
      finalStock = data.stockQty - data.txnQty;
    } else if (
      'Purchases' === data.txnType ||
      'Sales Return' === data.txnType ||
      'Manufacture' === data.txnType
    ) {
      finalStock = data.stockQty + data.txnQty;
    }
    return parseFloat(finalStock).toFixed(2);
  }

  const getDataFromSalesByItemReport = () => {
    const wb = new Workbook();

    let data = [];

    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        const record = {
          DATE: rowData[i].txnDate,
          TYPE: rowData[i].txnType,
          NO: rowData[i].sequenceNumber,
          NAME: getName(rowData[i]),
          QUANTITY: getQuantityWithUnits(rowData[i]),
          'FREE QUANTITY': getFreeQuantityWithUnits(rowData[i].freeTxnQty),
          'STOCK QUANTITY': getStockInHand(rowData[i]),
          'PRICE/UNIT': getPricePerUnit(rowData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        TYPE: '',
        NO: '',
        NAME: '',
        QUANTITY: '',
        'FREE QUANTITY': '',
        'STOCK QUANTITY': '',
        'PRICE/UNIT': ''
      };
      data.push(record);
    }

    const emptyRecord = {};
    data.push(emptyRecord);
    data.push(emptyRecord);

    const saleQtyRecord = {
      DATE: 'Total Sale Qty',
      TYPE: totalSalesQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(saleQtyRecord);

    const saleReturnQtyRecord = {
      DATE: 'Total Sale Return Qty',
      TYPE: totalSalesReturnQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(saleReturnQtyRecord);

    const purchaseQtyRecord = {
      DATE: 'Total Purchase Qty',
      TYPE: totalPurchasesQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(purchaseQtyRecord);

    const purchaseReturnQtyRecord = {
      DATE: 'Total Purchase Return Qty',
      TYPE: totalPurchasesReturnQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(purchaseReturnQtyRecord);

    const manufactureQtyRecord = {
      DATE: 'Total Manufacture Qty',
      TYPE: totalManufactureQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(manufactureQtyRecord);

    const rawMaterialQtyRecord = {
      DATE: 'Total Raw Material Qty',
      TYPE: totalRawMaterialQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(rawMaterialQtyRecord);

    const qtyInRecord = {
      DATE: 'Total Qty In',
      TYPE: totalInQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(qtyInRecord);

    const qtyOutRecord = {
      DATE: 'Total Qty Out',
      TYPE: totalOutQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(qtyOutRecord);

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Transaction Item Report Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Transaction Item Report Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Transaction_By_Item_Report';

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

  useEffect(() => {
    setproductlist([]);
    setTimeout(() => setLoadingShown(false), 200);
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await handleProductClick(selectedStockProduct);
    }

    fetchData();
    setOnChange(false);

  }, [onChange]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    } else {
      setRowData(rowData);
    }
  }, [rowData]);

  const getAllTxnList = async (checkBoxType, value) => {
    const db = await Db.get();

    let salesSelected = salesChecked;
    let salesReturnSelected = salesReturnChecked;
    let purchaseSelected = purchaseChecked;
    let purchaseReturnSelected = purchaseReturnChecked;
    let rawMaterialSelected = rawMaterialChecked;
    let manufactureSelected = manufactureChecked;

    let fromDateSelected = fromDate;
    let toDateSelected = toDate;

    if (checkBoxType === 'Sales') {
      salesSelected = value;
    } else if (checkBoxType === 'Sales Return') {
      salesReturnSelected = value;
    } else if (checkBoxType === 'Purchase') {
      purchaseSelected = value;
    } else if (checkBoxType === 'Purchase Return') {
      purchaseReturnSelected = value;
    } else if (checkBoxType === 'Raw Material') {
      rawMaterialSelected = value;
    } else if (checkBoxType === 'Manufacture') {
      manufactureSelected = value;
    } else if (checkBoxType === 'From Date') {
      fromDateSelected = value;
    } else if (checkBoxType === 'To Date') {
      toDateSelected = value;
    }

    if (selectedProduct) {
      let txndata = await getProductTxnListByDateAndProduct(
        db,
        selectedProduct.productId,
        fromDateSelected,
        toDateSelected,
        salesSelected,
        salesReturnSelected,
        purchaseSelected,
        purchaseReturnSelected,
        rawMaterialSelected,
        manufactureSelected
      );
      calculateAggrigatedValues(txndata);

      setRowData(txndata);
    }
  };

  const handleProductClick = async (option) => {
    setProductName(option.name);
    setSelectedProduct(option);
    setProductNameWhileEditing('');

    setproductlist([]);
    let skip = 0;
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllProductData(option);
    }

    const db = await Db.get();

    let txndata = await getProductTxnListByDateAndProduct(
      db,
      option.productId,
      fromDate,
      toDate,
      salesChecked,
      salesReturnChecked,
      purchaseChecked,
      purchaseReturnChecked,
      rawMaterialChecked,
      manufactureChecked,
      false,
      false,
      false,
      false,

    );

    // calculateAggrigatedValues(txndata);
  
  txndata.sort((a, b) => new Date(a.txnDate) - new Date(b.txnDate));

  const dateSums = txndata.reduce((acc, transaction) => {
      if (!acc[transaction.txnDate]) {
          // const previousDate = Object.keys(acc).sort().pop();
          // if (previousDate) {
          //     acc[transaction.txnDate] = { 
          //         value: acc[previousDate].value, 
          //         qty: acc[previousDate].qty, 
          //         type: transaction.txnType, 
          //     };
          // } else {
              acc[transaction.txnDate] = { value: 0, qty: 0,closingQty:0 };
          // }
      }
      if (transaction.txnType === 'Purchases') {
        acc[transaction.txnDate].value += transaction.amount;
        acc[transaction.txnDate].qty += transaction.txnQty;
      }else{
        acc[transaction.txnDate].closingQty += transaction.txnQty;
      }

      return acc;
  }, {});

  let accumulatedValue = 0;
  let accumulatedQty = 0;
  let accumulatedClosingQty = 0;

  Object.keys(dateSums).forEach(date => {
      accumulatedValue += dateSums[date].value;
      accumulatedQty += dateSums[date].qty;
      accumulatedClosingQty += dateSums[date].closingQty;
      if(dateSums[date].value != 0){
        dateSums[date].value = accumulatedValue;
        dateSums[date].qty = accumulatedQty;
        if(dateSums[date].closingQty != 0){
          dateSums[date].closingQty = accumulatedClosingQty;
        }
      }else if(dateSums[date].closingQty != 0){
        dateSums[date].closingQty = accumulatedClosingQty;
      }
      
  });
  
  console.log("joe",dateSums);


    // const dateSums = txndata.reduce((acc, transaction) => {
    //   if (!acc[transaction.txnDate]) {
    //     acc[transaction.txnDate] = { value: 0, qty: 0 };
    //   }

    //   if (transaction.txnType === 'Purchases') {
    //     acc[transaction.txnDate].value += transaction.amount;
    //     acc[transaction.txnDate].qty += transaction.txnQty;
    //   }
    //   return acc;
    // }, {});

    // console.log("joe", dateSums);

    Object.keys(dateSums).forEach(date => {
      dateSums[date].value += selectedStockProduct.openingStockPurchasedPrice * selectedStockProduct.openingQty;
      dateSums[date].qty += selectedStockProduct.openingQty;
      // dateSums[date].closingQty -= selectedStockProduct.openingQty;
    });

    const dateRatios = Object.keys(dateSums).reduce((acc, date) => {
      const { value, qty } = dateSums[date];
      acc[date] = value / qty;
      return acc;
    }, {});

    setDatePrice(dateRatios);

    setListRowData(txndata);
    // console.log("joe", dateSums);
  };

  const calculateConsumption = (date, qty, amount) => {
    let resp = {};
    if (datePrice[date]) {
      const consumptionVal = parseFloat(datePrice[date] * qty).toFixed(2);
      resp.consumption = consumptionVal;
      resp.grossProfit = parseFloat(amount - consumptionVal).toFixed(2);
      resp.grossProfitPerc = calculateGrossProfitPerc(consumptionVal, amount);
    }
    return resp;
  }
  const calculateClosing = (date, qty) => {
    let resp = {};
    if (datePrice[date]) {
      const closingRate = parseFloat(datePrice[date]).toFixed(2);
      resp.rate = closingRate;
      resp.amount = parseFloat(datePrice[date] * qty).toFixed(2);
    }
    return resp;
  }

  const calculateGrossProfitPerc = (num1, num2) => {
    if (num1 === 0) return 0;
    return (((num2 - num1) / num1) * 100).toFixed(2);
  };


  const getAllProductData = async (option) => {
    setProductName(option.name);
    setSelectedProduct(option);
    setProductNameWhileEditing('');

    setproductlist([]);
    const db = await Db.get();

    let txndata = await getProductTxnListByDateAndProduct(
      db,
      option.productId,
      fromDate,
      toDate,
      salesChecked,
      salesReturnChecked,
      purchaseChecked,
      purchaseReturnChecked,
      rawMaterialChecked,
      manufactureChecked
    );
    let count = 0;
    count = txndata.length;

    let numberOfPages = 1;

    if (count % limit === 0) {
      numberOfPages = parseInt(count / limit);
    } else {
      numberOfPages = parseInt(count / limit + 1);
    }
    setTotalPages(numberOfPages);

    calculateAggrigatedValues(txndata);
    setRowData(txndata);
  };

  const calculateAggrigatedValues = async (txnData) => {
    let totalSalesQty = 0;
    let totalSalesReturnQty = 0;
    let totalPurchasesQty = 0;
    let totalPurchasesReturnQty = 0;

    let totalManufactureQty = 0;
    let totalRawMaterialQty = 0;

    let totalInQty = 0;
    let totalOutQty = 0;

    txnData.forEach((res) => {
      if (res.txnType === 'Sales' || res.txnType === 'KOT') {
        totalSalesQty += res.txnQty;
      } else if (res.txnType === 'Sales Return') {
        totalSalesReturnQty += res.txnQty;
      } else if (res.txnType === 'Purchases') {
        totalPurchasesQty += res.txnQty;
      } else if (res.txnType === 'Purchases Return') {
        totalPurchasesReturnQty += res.txnQty;
      } else if (res.txnType === 'Raw Material') {
        totalRawMaterialQty += res.txnQty;
      } else if (res.txnType === 'Manufacture') {
        totalManufactureQty += res.txnQty;
      }
    });

    totalInQty = totalPurchasesQty + totalSalesReturnQty;
    totalOutQty = totalSalesQty + totalPurchasesReturnQty;

    //set env variables
    setTotalSalesQty(totalSalesQty);
    setTotalSalesReturnQty(totalSalesReturnQty);
    setTotalPurchasesQty(totalPurchasesQty);
    setTotalPurchasesReturnQty(totalPurchasesReturnQty);
    setTotalInQty(totalInQty);
    setTotalOutQty(totalOutQty);
    setTotalRawMaterialQty(totalRawMaterialQty);
    setTotalManufactureQty(totalManufactureQty);
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Item Stock Report')) {
        setFeatureAvailable(false);
      }
    }
  };


  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

  const getParticularname = (data) => {
    let name = '';
    if (data.customerName && data.customerName !== undefined) {
      name = data.customerName;
    } else if (data.vendorName && data.vendorName !== undefined) {
      name = data.vendorName;
    }

    return name;
  }

  const onFirstPageClicked = () => {
    setCurrentPage(1);
    setOnChange(true);
  };

  const onLastPageClicked = () => {
    setCurrentPage(totalPages);
    setOnChange(true);
  };

  const onPreviousPageClicked = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setOnChange(true);
    }
  };

  const onNextPageClicked = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setOnChange(true);
    }
  };

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
                    STOCK SUMMARY
                  </Typography>
                </div>
              </div>

              <div>
                <Grid
                  container
                  direction="row"
                  className={classes.sectionHeader}
                  style={{
                    display: 'flex',
                    marginLeft: '15px',
                    justifyContent: 'space-between',
                    marginBottom: '10px'
                  }}
                >
                  <Button
                    color="secondary"
                    onClick={() => handleOpenTransactionByProduct(false)}
                    className={classes.filterBtn}
                  >
                    <IconButton style={{ color: 'white', fontSize: '15px', padding: '5px' }}>
                      <ArrowBackIcon style={{ fontSize: 'inherit' }} />
                    </IconButton>
                    Back
                  </Button>
                  <FormControl>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="sales"
                          defaultChecked="true"
                          onChange={(event) => {
                            setSalesChecked(event.target.checked);
                            getAllTxnList('Sales', event.target.checked);
                          }}
                        />
                      }
                      label={`Sales`}
                      size="small"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          name="salesReturn"
                          defaultChecked="true"
                          onChange={(event) => {
                            setSalesReturnChecked(event.target.checked);
                            getAllTxnList('Sales Return', event.target.checked);
                          }}
                        />
                      }
                      label={`Sales Return`}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="purchase"
                          defaultChecked="true"
                          onChange={(event) => {
                            setPurchaseChecked(event.target.checked);
                            getAllTxnList('Purchase', event.target.checked);
                          }}
                        />
                      }
                      label={`Purchase`}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="purchaseReturn"
                          defaultChecked="true"
                          onChange={(event) => {
                            setPurchaseReturnChecked(event.target.checked);
                            getAllTxnList(
                              'Purchase Return',
                              event.target.checked
                            );
                          }}
                        />
                      }
                      label={`Purchase Return`}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rawMaterial"
                          defaultChecked="true"
                          onChange={(event) => {
                            setRawMaterialChecked(event.target.checked);
                            getAllTxnList('Raw Material', event.target.checked);
                          }}
                        />
                      }
                      label={`Raw Material`}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="manufacture"
                          defaultChecked="true"
                          onChange={(event) => {
                            setManufactureChecked(event.target.checked);
                            getAllTxnList('Manufacture', event.target.checked);
                          }}
                        />
                      }
                      label={`Manufacture`}
                      size="small"
                    />
                  </Grid>
                </FormControl>
                </Grid>             
              </div>

              <div className={classes.itemTable}>
                {/* <App />  */}

                <Box>
                  <div
                    style={{
                      width: '100%',
                      height: height - 256 + 'px'
                    }}
                    className=" blue-theme"
                  >
                    <div
                      id="product-list-grid"
                      style={{ height: '95%', width: '100%' }}
                      className="ag-theme-material"
                    >
                      <table className={classes.tableStyle}>
                        <thead>
                          <tr>
                            <th rowSpan="2" className={[classes.pad, classes.borderBottom].join(' ')}>Date</th>
                            <th rowSpan="2" className={[classes.pad, classes.borderBottom].join(' ')}>Particulars</th>
                            <th rowSpan="2" className={[classes.pad, classes.borderBottom].join(' ')}>Vch Type</th>
                            <th rowSpan="2" className={[classes.pad, classes.borderBottom, classes.borderRight].join(' ')}>Vch No</th>
                            <th colSpan="3" className={[classes.pad, classes.borderRight].join(' ')}>Inwards</th>
                            <th colSpan="6" className={[classes.pad, classes.borderRight].join(' ')}>Outwards</th>
                            <th colSpan="3" className={[classes.pad, classes.borderRight].join(' ')}>Closing</th>
                          </tr>
                          <tr>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Quantity</th>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Rate</th>
                            <th className={[classes.pad, classes.borderBottom, classes.borderRight].join(' ')}>Value</th>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Quantity</th>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Rate</th>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Value</th>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Consumption</th>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Gross Profit</th>
                            <th className={[classes.pad, classes.borderBottom, classes.borderRight].join(' ')}>Perc %</th>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Quantity</th>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Rate</th>
                            <th className={[classes.pad, classes.borderBottom].join(' ')}>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td style={{ padding: '5px' }}>{'2024-07-12'}</td>
                            <td className={classes.numberCls}>{'Opening Balance'}</td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}>{selectedStockProduct.openingQty}</td>
                            <td className={classes.numberCls}>{selectedStockProduct.openingStockPurchasedPrice}</td>
                            <td className={classes.numberCls}>{parseFloat(selectedStockProduct.openingQty * selectedStockProduct.openingStockPurchasedPrice).toFixed(2)}</td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}></td>
                          </tr>
                          {listRowData.map((item, index) => {
                            const isLastOccurrence = index === listRowData.length - 1 || item.txnDate !== listRowData[index + 1].txnDate;
                            if(item.txnType == 'Sales'){
                              closingQuantity+= item.txnQty;
                            }else if(item.txnType == 'Purchases'){
                              closingQuantity-= item.txnQty;
                            }
                            
                            closingQuantityFinal = selectedStockProduct.openingQty - closingQuantity;

                            return (
                              <tr>
                                <td style={{ padding: '5px' }}>{item.txnDate}</td>
                                <td className={classes.numberCls}>{getParticularname(item)}</td>
                                <td className={classes.numberCls}>{item.txnType}</td>
                                <td className={classes.numberCls}>{item.sequenceNumber}</td>
                                <td className={classes.numberCls}>{item.txnType == 'Purchases' ? item.txnQty : ''}</td>
                                <td className={classes.numberCls}>{item.txnType == 'Purchases' ? (item.amount / item.txnQty).toFixed(2) : ''}</td>
                                <td className={classes.numberCls}>{item.txnType == 'Purchases' ? item.amount : ''}</td>
                                <td className={classes.numberCls}>{item.txnType == 'Sales' ? item.txnQty : ''}</td>
                                <td className={classes.numberCls}>{item.txnType == 'Sales' ? (item.amount / item.txnQty).toFixed(2) : ''}</td>
                                <td className={classes.numberCls}>{item.txnType == 'Sales' ? item.amount : ''}</td>
                                <td className={classes.numberCls}>{item.txnType == 'Sales' ? calculateConsumption(item.txnDate, item.txnQty, item.amount).consumption : ''}</td>
                                {/* <td className={classes.numberCls}></td> */}
                                <td className={classes.numberCls}>{item.txnType == 'Sales' ? calculateConsumption(item.txnDate, item.txnQty, item.amount).grossProfit : ''}</td>
                                <td className={classes.numberCls}>{item.txnType == 'Sales' ? calculateConsumption(item.txnDate, item.txnQty, item.amount).grossProfitPerc+' %' : ''} </td>
                                <td className={classes.numberCls}>{isLastOccurrence ? closingQuantityFinal : ''}</td>
                                <td className={classes.numberCls}>{isLastOccurrence ? calculateClosing(item.txnDate, closingQuantityFinal).rate : ''}</td>
                                <td className={classes.numberCls}>{isLastOccurrence ? calculateClosing(item.txnDate, closingQuantityFinal).amount : ''}</td>
                              </tr>);
                            })
                          }
                        </tbody>
                      </table>
                      <div
                        style={{
                          display: 'flex',
                          float: 'right',
                          marginTop: '2px'
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
              <div>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginLeft: '15px',
                      marginTop: '-20px',
                      marginBottom: '10px'
                    }}
                  >
                    <Grid
                      item
                      xs={3}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Sale Qty :{' '}
                          {parseFloat(totalSalesQty).toFixed(2)}{' '}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total Sale Return Qty :{' '}
                          {parseFloat(totalSalesReturnQty).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Purchase Qty :{' '}
                          {parseFloat(totalPurchasesQty).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total Purchase Return Qty :{' '}
                          {parseFloat(totalPurchasesReturnQty).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Manufacture Qty :{' '}
                          {parseFloat(totalManufactureQty).toFixed(2)}{' '}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total Raw Material Qty :{' '}
                          {parseFloat(totalRawMaterialQty).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Qty In : {parseFloat(totalInQty).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total Qty Out : {parseFloat(totalOutQty).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openAddSalesReturn ? <AddCreditNote /> : null}
      {OpenAddPurchaseBill ? <AddPurchasesBill /> : null}
      {OpenAddPurchasesReturn ? <AddDebitNote /> : null}
      {editMfgOpenDialog ? <EditMfgModal /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(TransactionByItemV2);