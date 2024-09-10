import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import Page from '../../components/Page';

import {
  Typography,
  makeStyles,
  Button,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  MenuItem,
  Select,
  OutlinedInput,
  TextField,
  Box,
  Dialog,
  DialogContent,
  DialogContentText,
  IconButton,
  withStyles,
  Grid as MuiGrid,
  useTheme,
  useMediaQuery,
  Switch
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { Print } from '@material-ui/icons';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { AgGridReact } from 'ag-grid-react';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { useBarcode } from '@createnextapp/react-barcode';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import * as Db from '../../RxDb/Database/Database';
import { toJS } from 'mobx';
import PreviewModal from './PreviewandPrint';
import { Grid, Col } from 'react-flexbox-grid';
import useWindowDimensions from '../../components/windowDimension';
import './style.css';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getPartiesAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import * as Bd from 'src/components/SelectedBusiness';
import left_arrow from 'src/icons/svg/left_arrow.svg';
import right_arrow from 'src/icons/svg/right_arrow.svg';
import first_page_arrow from 'src/icons/svg/first_page_arrow.svg';
import last_page_arrow from 'src/icons/svg/last_page_arrow.svg';
import QRCode from 'react-qr-code';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: '10px 0px 0px 0px'
  },
  paper: {
    padding: 15
  },
  Header: {
    color: 'black',
    textAlign: 'center'
  },
  type: {
    fontWeight: 500,
    color: 'black',
    marginBottom: 5,
    marginTop: 10
  },
  printerText: {
    fontWeight: 500,
    color: 'black',
    marginBottom: '10PX',
    marginTop: '0PX'
  },
  labelSize: {
    display: 'block',
    marginTop: 5
  },
  mrgTp: {
    marginTop: 10
  },
  outlinedInput: {
    width: '100%'
  },
  tableForm: {
    padding: '10px 6px'
  },
  deleteIcon: {
    cursor: 'pointer'
  },
  listbox: {
    width: '-webkit-fill-available',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
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
  addBarcode: {
    borderRadius: 25,
    color: '#EF5350',
    /* padding: '8px 20px 8px 20px', */
    backgroundColor: 'white',
    textTransform: 'inherit',
    '&:hover': {
      backgroundColor: '#EF5350',
      color: '#FFFFFF'
    }
  },
  goToPage: {
    color: '#EF5350',
    backgroundColor: 'white'
  },
  previewBtn: {
    borderRadius: 8,
    color: '#FFFFFF',
    padding: '8px 20px 8px 20px',
    backgroundColor: '#EF5350',
    textTransform: 'inherit',
    '&:hover': {
      backgroundColor: '#EF5350'
    }
  },
  icon: {
    width: '100%'
  },
  headerContain: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 10px 40px 20px'
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  },
  leftCol: {
    fontFamily: 'Helvetica',
    fontSize: '18px',
    padding: 'initial'
  },
  leftpanelscroll: {
    fontFamily: 'Helvetica',
    fontSize: '18px',
    padding: 'initial',
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.5em',
      borderRadius: 12
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)'
      // outline: '1px solid slategrey'
    }
  },
  contentCol: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.5em',
      borderRadius: 12
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)'
      // outline: '1px solid slategrey'
    }
  },
  fieldControl: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.down('xs')]: {
      minWidth: '100%',
      marginRight: theme.spacing(0),
      marginBottom: theme.spacing(1)
    }
  },
  text: {
    minWidth: 120
  },
  barcodePaper: {
    position: 'relative',
    width: '50%',
    float: 'left',
    height: '160px',
    padding: '15px',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.5em',
      borderRadius: 12
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)'
      // outline: '1px solid slategrey'
    }
  },
  inputNumber: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  removeArrow: {
    '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  dropdownStyle: {
    height: '200px'
  },
  withoutBarcodeLabelDisplay: {
    width: '64mm',
    height: '34mm',
    boxShadow: 'rgb(204 204 204) 0px 0px 10px',
    padding: '10px',
    margin: 'auto'
  },
  withoutBarcodAddress: {
    whiteSpace: 'break-spaces',
    maxHeight: '62px' /* ,
    overflow: 'hidden' */
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

const DialogActions = withStyles((theme) => ({
  root: {
    marginTop: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const BarcodePrinter = () => {
  const classes = useStyles();
  const stores = useStore();
  const theme = useTheme();
  const { height } = useWindowDimensions();
  const [printType, setPrintType] = useState('regular');
  const [labelType, setLabelType] = useState('withbarcode');
  const [titleType, setTitleType] = useState('product');
  const [labelSize, setLabelSize] = useState();
  const [pageSize, setPageSize] = useState();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const blockInvalidChar = (e) =>
    ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();
  const [unit, setUnit] = useState('mm');
  const fontSizeArray = Array(100)
    .fill(0)
    .map((e, i) => i + 1);
  const [fontSizeList, setFontSizeList] = useState(fontSizeArray);
  const marginArrayList = Array(20)
    .fill(0)
    .map((e, i) => i + 1);

  const getCustomData = () => {
    var list = {
      paperWidth: '',
      paperHeight: '',
      customWidth: 189,
      customHeight: 132,
      customHeightDisplay: 35,
      customWidthDisplay: 50,
      paperWidthDisplay: '',
      paperHeightDisplay: '',
      barcodeWidth: '',
      barcodeHeight: '',
      marginTop: 0,
      marginBottom: 0,
      marginRight: 0,
      marginLeft: 0,
      headerFont: 16,
      itemCode: 16,
      additionalFont: 16,
      footerFont: 16,
      headerWeight: true,
      itemcodeWeight: false,
      additionalWeight: false,
      footerWeight: false,
      unit: unit
    };

    if (localStorage.getItem('customBarcodeData')) {
      try {
        list = JSON.parse(localStorage.getItem('customBarcodeData'));
      } catch (e) {
        console.error(' Error: ', e.message);
      }
    }

    return list;
  };

  const [customData, setCustomData] = useState(getCustomData());

  const handleCustomDataChange = (prop) => (event) => {
    setCustomData({ ...customData, [prop]: event.target.value });
  };

  const handleCheckboxCustomDataChange = (prop) => (event) => {
    setCustomData({ ...customData, [prop]: event.target.checked });
  };

  const withoutBarcodeLabelSizeList = [
    { val: 24, name: '24 Labels (64*34mm)' }
  ];

  let labelSizeList = [];

  if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
    labelSizeList = [
      { val: 2.3, name: '1 Label (92mm x 15mm)' },
      { val: 2.4, name: '2 Label (85mm x 40mm)' }
    ];
  } else {
    labelSizeList = [
      { val: 2.2, name: '2 Labels (50 x 50mm)' },
      { val: 2, name: '2 Labels (50 x 25mm)' },
      { val: 2.1, name: '2 Labels (25 x 15mm)' },
      { val: 1, name: '1 Label (100 x 50mm)' },
      { val: 1.1, name: '1 Label (25 x 15mm)' }
    ];
  }

  const regularSizeList = [
    // { val: 65, name: '65 Labels (38 x 21mm)' },
    // { val: 48, name: '48 Labels (48 x 24mm)' },
    { val: 24, name: '24 Labels (64 x 34mm)' }
    // { val: 12, name: '12 Labels (100 x 44mm)' }
  ];

  const headerList = [
    { val: 'business_name', name: 'Business Name' },
    { val: 'product_name', name: 'Product Name' },
    { val: 'sale_price', name: 'Sale Price & Offer Price' },
    { val: 'exp_date', name: 'Exp. Date & Mfg. Date' }
  ];

  const addtionalCustdetail = [
    { val: 'pincode', name: 'Pincode' },
    { val: 'phoneNo', name: 'Phone Number' },
    { val: 'gstNumber', name: 'GSTN' },
    { val: 'emailId', name: 'Email ID' },
    { val: 'registrationNumber', name: 'Registration Number' }
  ];

  const regularSizeOption = [
    { val: 'a4', name: 'A4' },
    { val: 'a3', name: 'A3' },
    { val: 'a5', name: 'A5' }
  ];

  const labelSizeOption = [
    { val: '2', name: '2 inch' },
    { val: '4', name: '4 inch' },
    { val: '6', name: '6 inch' }
  ];
  const [paperSizeList, setPaperSizeList] = useState(regularSizeOption);
  const [sizeList, setSizeList] = useState(labelSizeList);
  const [productlist, setproductlist] = useState([]);

  const [custList, setCustList] = useState([]);

  const { sectedProductForBarcode } = toJS(stores.ProductStore);

  const {
    barcodeData,
    barcodeDisplayData,
    barcodeDataList,
    barcodeFullDataList,
    previewBarcodeDialog,
    barcodeLabelAlertDialog,
    BarcodeFinalArrayList,
    BarcodeFinalLabelArrayList,
    openEditLabel
  } = toJS(stores.BarcodeStore);

  const {
    setBarcodeDataProperty,
    setBarcodeData,
    addBarcodeData,
    handleRemoveBarcodeListData,
    handelPreviewBarcodeOpen,
    handleBarcodeLabelAlertClose,
    handleReplaceProduct,
    resetBarcodeListData,
    getAllBarcodeData,
    addBulkBarcodeData,
    updateBarcodeData,
    editBarcodeData,
    handleBarcodeEditClose,
    addBulkBarcodeDataForVariations
  } = stores.BarcodeStore;

  const { header, footer, line } = useState();
  const [label, setLabel] = useState();
  const [selectedProduct, setSelectedProduct] = useState();
  const [businessName, setBusinessName] = React.useState();
  const [productName, setProductName] = React.useState();
  const [sizeVal, setSizeVal] = React.useState();
  const [pages, setPages] = React.useState();
  const [sizeType, setSizeType] = useState('custom');
  const [selectedPrinter, setselectedPrinter] = useState('');
  const [printersList, setPrinterList] = React.useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [selectedCust, setSelectedCust] = useState();
  const [custName, setCustName] = React.useState('');
  const [custAddress, setCustAddress] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [purchasePriceCode, setPurchasePriceCode] = React.useState(true);
  const [enableMrp, setEnableMrp] = React.useState(true);
  const [enableOfferPrice, setEnableOfferPrice] = React.useState(true);
  const [additionTextWithoutBarcode, setadditionTextWithoutBarcode] =
    React.useState('');
  const [additionTextWithoutBarcode2, setadditionTextWithoutBarcode2] =
    React.useState('');
  const [custGSTN, setCustGSTN] = React.useState('');
  const [printStartFrom, setPrintStartFrom] = React.useState(1);
  const [customerData, setCustomerData] = React.useState({});
  const [isJewellery, setIsJewellery] = React.useState(false);

  /* const [vendorName, setVendorName] = React.useState(''); */
  /* const [partiesType, setPartiesType] = React.useState(); */

  const [productNameWhileEditing, setProductNameWhileEditing] = useState('');
  const [custNameWhileEditing, setCustNameWhileEditing] = useState('');

  const [openAddPage, setOpenAddPage] = useState(false);
  const [addPageAdditionalText1, setAddPageAdditionalText1] =
    React.useState('');
  const [addPageAdditionalText2, setAddPageAdditionalText2] =
    React.useState('');

  const handleAddPageClick = () => {
    if (!openAddPage) {
      setAddPageAdditionalText1('');
      setAddPageAdditionalText2('');
    }
    openAddPage ? setOpenAddPage(false) : setOpenAddPage(true);
  };

  const [openVariationsAddPage, setOpenVariationsAddPage] = useState(false);
  const [
    addPageVariationsAdditionalText1,
    setAddPageVariationsAdditionalText1
  ] = React.useState(1);
  const [
    addPageVariationsAdditionalText2,
    setAddPageVariationsAdditionalText2
  ] = React.useState('');

  const handleVariationsAddPageClick = () => {
    if (!openVariationsAddPage) {
      setAddPageVariationsAdditionalText1('');
      setAddPageVariationsAdditionalText2('');
    }
    openVariationsAddPage
      ? setOpenVariationsAddPage(false)
      : setOpenVariationsAddPage(true);
  };

  const [rowData, setRowData] = useState(null);
  const [allCustVendList, setAllCustVendList] = useState([]);
  let [custVendList, setCustVendList] = useState([]);
  let [onChange, setOnChange] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(24);
  const [goToPage, setGoToPage] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [openErrorDialog, setOpenErrorDialog] = React.useState('');

  const { getTransactionData } = stores.TransactionStore;
  const { transaction } = toJS(stores.TransactionStore);

  //Jewellry fields
  const [enableGrossWeight, setEnableGrossWeight] = React.useState(true);
  const [enableWastage, setEnableWastage] = React.useState(true);
  const [enableNetWeight, setEnableNetWeight] = React.useState(true);
  const [enableStoneWeight, setEnableStoneWeight] = React.useState(true);
  const [enablePurity, setEnablePurity] = React.useState(true);

  let [variationsList, setVariationsList] = useState([]);
  let [actualProduct, setActualProduct] = useState();

  useEffect(() => {
    async function fetchData() {
      await getTransactionData();
      setIsJewellery(localStorage.getItem('isJewellery'));
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (variationsList && variationsList.length > 0) {
      setOpenVariationsAddPage(true);
    }
  }, [variationsList]);

  const handleCloseErrorDialog = () => {
    setErrorMessage('');
    setOpenErrorDialog(false);
  };

  const getPurchasePriceCode = (purchasePrice) => {
    let purchasePurchaseCode = transaction.purchasePriceCode;
    let codeMap = new Map();

    let number = 1;

    if (purchasePurchaseCode && purchasePurchaseCode.length > 0) {
      const purchasePurchaseCodeArray = purchasePurchaseCode.split('');
      if (purchasePurchaseCodeArray && purchasePurchaseCodeArray.length > 0) {
        for (let code of purchasePurchaseCodeArray) {
          const newNumber = number.toString();
          codeMap.set(newNumber, code);
          if (number === 9) {
            number = 0;
          } else {
            number++;
          }
        }
      }
    }

    let purchasePriceString = '';

    if (codeMap) {
      const purchasePriceArray = purchasePrice.toString().split('');
      if (purchasePriceArray && purchasePriceArray.length > 0) {
        for (let p of purchasePriceArray) {
          purchasePriceString +=
            codeMap.get(p) !== undefined ? codeMap.get(p) : '';
        }
      }
    }

    console.log('PPC: ', purchasePriceString);

    if (purchasePriceString === undefined) {
      purchasePriceString = '';
    }

    return purchasePriceString;
  };

  const printStartFromList = Array(24)
    .fill(0)
    .map((e, i) => i + 1);

  const handlePrintType = (e) => {
    setBarcodeDataProperty(e.target.value, 'printType');
    setPrintType(e.target.value);
    localStorage.setItem('barcodePrintType', e.target.value);
    if (e.target.value === 'regular') {
      setSizeList(regularSizeList);
      setPaperSizeList(regularSizeOption);
    }
    if (e.target.value === 'label') {
      setSizeList(labelSizeList);
      setPaperSizeList(labelSizeOption);
      setSizeType('default');
      setSizeVal(labelSizeList[0].val);
      setLabelSize(labelSizeList[0].name);
    }
  };

  const handleLabelType = (e) => {
    setLabelType(e.target.value);
    localStorage.setItem('barcodeLabelType', e.target.value);
    if (e.target.value === 'withbarcode') {
      setTitleType('product');
      // Reset all data
      setProductName('');
      setCustAddress('');
      setCustName('');
      setDescription('');
      setCustomerData({});
      setadditionTextWithoutBarcode('');
      setadditionTextWithoutBarcode2('');
      setEnableMrp(true);
      setEnableOfferPrice(true);
      setPurchasePriceCode(true);
      resetBarcodeListData();
    }
    if (e.target.value === 'withoutbarcode') {
      setTitleType('customer');
      // Reset all data
      setProductName('');
      setCustAddress('');
      setCustName('');
      setDescription('');
      setCustomerData({});
      setadditionTextWithoutBarcode('');
      setadditionTextWithoutBarcode2('');
      setEnableMrp(true);
      setEnableOfferPrice(true);
      setPurchasePriceCode(true);
      resetBarcodeListData();
    }
  };

  const handleTitleType = (e) => {
    setTitleType(e.target.value);
    setPages('');

    if (e.target.value === 'product') {
      //product functionaliy
      setBarcodeDataProperty(true, 'isProduct');
    }
    if (e.target.value === 'customer') {
      //customer functionaliy
      setBarcodeDataProperty(false, 'isProduct');
    }
    if (e.target.value === 'vendor') {
      //vendor functionaliy
    }
  };

  const handleSizeType = (e) => {
    setSizeType(e.target.value);
  };

  const handleUnitChange = (e) => {
    setCustomData({ ...customData, unit: e.target.value });
    setUnit(e.target.value);
  };

  const handleChange = (e) => {
    setLabel(e.target.value);
    setBarcodeDataProperty(e.target.value, 'label');

    const val = Math.ceil(e.target.value / sizeVal);
    setPages(val);
    if (labelType === 'withoutbarcode') {
      setBarcodeDataProperty(1, 'printStartFrom');
    }
  };

  const getBarcodeInputRef = () => {
    if (customData.unit === 'mm') {
      customData.customWidth = Number(
        3.77952 * customData.customWidthDisplay
      ).toFixed();
      customData.customHeight = Number(
        3.77952 * customData.customHeightDisplay
      ).toFixed();
    }
    if (customData.unit === 'cm') {
      customData.customWidth = Number(
        37.7952 * customData.customWidthDisplay
      ).toFixed();
      customData.customHeight = Number(
        37.7952 * customData.customHeightDisplay
      ).toFixed();
    }
    if (customData.unit === 'px') {
      customData.customWidth = Number(customData.customWidthDisplay).toFixed();
      customData.customHeight = Number(
        customData.customHeightDisplay
      ).toFixed();
    }

    /*----------Condition to remove Barcode--------*/

    var ref = {
      value:
        barcodeData && barcodeData.barcode !== ''
          ? barcodeData.barcode
          : 'Item code',
      options: {
        background: '#ffffff',
        fontSize: customData.itemCode ? customData.itemCode : 15,
        font: 'caption',
        // displayValue: false,
        fontOptions: customData.itemcodeWeight ? 'bold' : '',
        margin: 0,
        width:
          customData.customWidth <= 100
            ? 0.5
            : customData.customWidth > 100 && customData.customWidth <= 200
            ? 1
            : customData.customWidth > 200 && customData.customWidth <= 300
            ? 2
            : customData.customWidth > 300 && customData.customWidth <= 400
            ? 3
            : customData.customWidth > 400 && customData.customWidth <= 500
            ? 4
            : customData.customWidth > 500 && customData.customWidth <= 800
            ? 5
            : customData.customWidth > 800 && customData.customWidth <= 1000
            ? 6
            : 7,
        textAlign: 'center',
        height:
          customData.customHeight <= 70
            ? 15
            : customData.customHeight > 70 && customData.customHeight <= 100
            ? 23
            : customData.customHeight > 100 && customData.customHeight <= 200
            ? 35
            : customData.customHeight > 200 && customData.customHeight <= 300
            ? 45
            : 100,
        marginTop: customData.marginTop ? customData.marginTop : undefined,
        marginBottom: customData.marginBottom
          ? customData.marginBottom
          : undefined,
        marginLeft: customData.marginLeft ? customData.marginLeft : undefined,
        marginRight: customData.marginRight ? customData.marginRight : undefined
      }
    };

    return ref;
  };

  const getDefaultInputRef = () => {
    /*----------Condition to remove Barcode----------*/

    var ref = {
      value:
        barcodeData && barcodeData.barcode && barcodeData.barcode !== ''
          ? barcodeData.barcode
          : 'Item code',
      options: {
        background: '#ffffff',
        fontSize: 14,
        font: 'caption',
        margin: 0,
        width: 1,
        height: 35,
        fontOptions: 'bold'
      }
    };

    return ref;
  };

  const { inputRef } = useBarcode(
    sizeType === 'default' ? getDefaultInputRef() : getBarcodeInputRef()
  );

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const [columnDefs] = useState([
    {
      headerName: 'NAME',
      field: 'name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'NO OF LABELS',
      field: 'label',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      minWidth: 200,
      sortable: false,
      cellRenderer: 'templateActionRenderer',
      cellRendererParams: {
        clicked: function (field) {}
      }
    }
  ]);

  const [columnDefsAddPage] = useState([
    {
      headerName: 'NAME',
      field: 'name',
      sortable: false,
      filter: false,
      width: 225
    },
    {
      headerName: 'ADDRESS',
      field: 'address',
      sortable: false,
      filter: false,
      width: 350
    },
    {
      headerName: 'ADDITION TEXT 1',
      field: 'additionalText1',
      sortable: false,
      filter: false,
      width: 150
    },
    {
      headerName: 'ADDITION TEXT 2',
      field: 'additionalText2',
      sortable: false,
      filter: false,
      width: 150
    }
  ]);

  const [columnDefsVariationsAddPage] = useState([
    {
      headerName: 'VARIATION',
      field: 'name',
      sortable: false,
      filter: false,
      width: 225,
      valueFormatter: (params) => {
        let batchData = params['data'];
        let propertiesStr = '';
        for (let i = 0; i < batchData.properties.length; i++) {
          propertiesStr += batchData.properties[i].value;

          if (i < batchData.properties.length - 1) {
            propertiesStr += '-';
          }
        }
        return propertiesStr;
      }
    },
    {
      headerName: 'BATCH NUMBER',
      field: 'batchNumber',
      sortable: false,
      filter: false,
      width: 350
    },
    {
      headerName: 'SALE PRICE',
      field: 'salePrice',
      sortable: false,
      filter: false,
      width: 150
    },
    {
      headerName: 'PUR. PRICE',
      field: 'purchasedPrice',
      sortable: false,
      filter: false,
      width: 150
    }
  ]);

  const TempaltePrintShareRenderer = (props) => {
    return (
      <div>
        <IconButton
          disableRipple
          disableFocusRipple
          disableTouchRipple
          onClick={() => onPrintClicked(props)}
        >
          <Print fontSize="inherit" />{' '}
        </IconButton>
      </div>
    );
  };

  const TemplateActionRenderer = (props) => {
    return (
      <Box>
        <EditIcon
          onClick={() => editBarcodeData(props.data)}
          style={{ marginTop: 8, marginLeft: 25 }}
          className={classes.deleteIcon}
        />
        <DeleteIcon
          onClick={() => handleRemoveBarcodeListData(props.data)}
          style={{ marginTop: 8, marginLeft: 40 }}
          className={classes.deleteIcon}
        />
      </Box>
    );
  };

  const getCustomerData = async () => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setCustVendList([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllCustomerData();
    }
    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $and: [{ businessId: { $eq: businessData.businessId } }]
      },
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let temp = item;

        temp.item_count = 0;

        if (item.item_list) {
          temp.item_count = item.item_list.length;
        }

        if (addPageAdditionalText1 !== '') {
          temp.additionalText1 = temp[addPageAdditionalText1];
        } else {
          temp.additionalText1 = '';
        }

        if (addPageAdditionalText2 !== '') {
          temp.additionalText2 = temp[addPageAdditionalText2];
        } else {
          temp.additionalText2 = '';
        }

        return temp;
      });
      setCustVendList(response);
    });
  };

  const getAllCustomerData = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $and: [{ businessId: { $eq: businessData.businessId } }]
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        let output = {};
        ++count;
        return output;
      });

      setAllCustVendList(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const onPrintClicked = (props) => {
    // Add Single Barcode Print Logic
  };

  const handleLabelSize = (e) => {
    setLabelSize(e.name);
    setSizeVal(e.val);
    localStorage.setItem('barcodeLabelSizeName', e.name);
    localStorage.setItem('barcodeLabelSizeVal', e.val);
  };

  const handlePageSize = (e) => {
    setPageSize(e.name);
  };

  const sizeFunction = () => {
    var result = false;
    if (sizeType === 'default') {
      result = sizeVal ? true : false;
    }
    if (sizeType === 'custom') {
      if (printType === 'label') {
        result =
          customData.paperWidthDisplay &&
          customData.customHeightDisplay &&
          customData.customWidthDisplay
            ? true
            : false;
      } else {
        result =
          customData.paperHeightDisplay &&
          customData.paperWidthDisplay &&
          customData.customHeightDisplay &&
          customData.customWidthDisplay
            ? true
            : false;
      }
    }

    return result;
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  function onFirstDataRendered(params) {
    if (gridApi && gridApi.getDisplayedRowAtIndex(0)) {
      gridApi.getDisplayedRowAtIndex(0).setSelected(true);
    }
  }

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  useEffect(() => {
    setBusinessName(localStorage.getItem('businessName'));

    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
    } catch (e) {
      console.error(' Error: ', e.message);
    }

    // printerlist = [{"name":"HP_DeskJet_1200_series","displayName":"HP DeskJet 1200 series"}];

    setPrinterList(printerData ? printerData : []);

    if (window.localStorage.getItem('barcodeThermalPrinterName')) {
      setselectedPrinter(
        window.localStorage.getItem('barcodeThermalPrinterName')
      );
    }
    getAllBarcodeData();
  }, [getAllBarcodeData]);

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  const getCustomerList = async (value) => {
    setCustList(await getPartiesAutoCompleteList(value));
  };

  const getAllCustVendList = async () => {
    await getCustomerData();
  };

  const onFirstPageClicked = () => {
    if (gridApi) {
      setCurrentPage(1);
      setOnChange(true);
    }
  };

  const onLastPageClicked = () => {
    if (gridApi) {
      setCurrentPage(totalPages);
      setOnChange(true);
    }
  };

  const onPreviousPageClicked = () => {
    if (gridApi) {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        setOnChange(true);
      }
    }
  };

  const onNextPageClicked = () => {
    if (gridApi) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        setOnChange(true);
      }
    }
  };

  const setGoToCurrentPage = (page) => {
    if (page === '') {
      setGoToPage('');
      return;
    }
    if (page < -1 || page > totalPages) {
      setGoToPage('');
      setErrorMessage('Please provide a valid page number');
      setOpenErrorDialog(true);
      return;
    }

    setGoToPage(page);
    if (gridApi) {
      if (page <= totalPages) {
        setCurrentPage(Number(page));
        setOnChange(true);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setRowData([]);
        await getCustomerData();
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    const loadPaginationData = async () => {
      setRowData([]);
      await getCustomerData();
    };

    loadPaginationData();
  }, [addPageAdditionalText1]);

  useEffect(() => {
    const loadPaginationData = async () => {
      setRowData([]);
      await getCustomerData();
    };

    loadPaginationData();
  }, [addPageAdditionalText2]);

  useEffect(() => {
    if (
      localStorage.getItem('barcodeLabelType') !== '' &&
      localStorage.getItem('barcodeLabelType') !== undefined &&
      localStorage.getItem('barcodeLabelType') !== null
    ) {
      setLabelType(localStorage.getItem('barcodeLabelType'));
      if (localStorage.getItem('barcodeLabelType') === 'withbarcode') {
        setTitleType('product');
        // Reset all data
        setProductName('');
        setCustAddress('');
        setCustName('');
        setDescription('');
        setCustomerData({});
        setadditionTextWithoutBarcode('');
        setadditionTextWithoutBarcode2('');
        setEnableMrp(true);
        setEnableOfferPrice(true);
        setPurchasePriceCode(true);
      }
      if (localStorage.getItem('barcodeLabelType') === 'withoutbarcode') {
        setTitleType('customer');
        // Reset all data
        setProductName('');
        setCustAddress('');
        setCustName('');
        setDescription('');
        setCustomerData({});
        setadditionTextWithoutBarcode('');
        setadditionTextWithoutBarcode2('');
        setEnableMrp(true);
        setEnableOfferPrice(true);
        setPurchasePriceCode(true);
      }
    }

    if (
      localStorage.getItem('barcodePrintType') !== '' &&
      localStorage.getItem('barcodePrintType') !== undefined &&
      localStorage.getItem('barcodePrintType') !== null
    ) {
      setBarcodeDataProperty(
        localStorage.getItem('barcodePrintType'),
        'printType'
      );
      setPrintType(localStorage.getItem('barcodePrintType'));
      if (localStorage.getItem('barcodePrintType') === 'regular') {
        setSizeList(regularSizeList);
        setPaperSizeList(regularSizeOption);
      }
      if (localStorage.getItem('barcodePrintType') === 'label') {
        setSizeList(labelSizeList);
        setPaperSizeList(labelSizeOption);
        setSizeType('default');
        if (localStorage.getItem('barcodeLabelSizeName') !== '') {
          setLabelSize(localStorage.getItem('barcodeLabelSizeName'));
        } else {
          setLabelSize(labelSizeList[0].name);
        }
      }
      if (localStorage.getItem('barcodeLabelSizeVal') !== '') {
        setSizeVal(Number(localStorage.getItem('barcodeLabelSizeVal')));
      } else {
        setSizeVal(labelSizeList[0].val);
      }
    }
  }, []);

  const saveSelectedThermalPrinter = (printer) => {
    localStorage.setItem('barcodeThermalPrinterName', printer.name);
  };

  const onRowClicked = (event) => {
    setBarcodeData(event.data);
  };

  // useEffect(() => {
  //   if (printType === 'regular') {
  //     setSizeVal(withoutBarcodeLabelSizeList[0].val);
  //   }
  // }, [labelType, printType, withoutBarcodeLabelSizeList]);

  // useEffect(() => {
  //   if (printType === 'label') {
  //     setSizeVal(sizeList[0].val);
  //   }
  // }, [labelType, printType, sizeList]);

  const onAddPageClicked = async () => {
    let data = await getCurrentPageCustomerData();
    if (data && data.length > 0) {
      addBulkBarcodeData(await getCurrentPageCustomerData());
    } else {
      setErrorMessage('No data found to create labels');
      setOpenErrorDialog(true);
    }

    setOpenAddPage(false);
  };

  const onVariationsAddPageClicked = async () => {
    if (variationsList && variationsList.length > 0) {
      addBulkBarcodeDataForVariations(
        variationsList,
        addPageVariationsAdditionalText1,
        actualProduct,
        printType
      );
    } else {
      setErrorMessage('No data found to create barcode labels');
      setOpenErrorDialog(true);
    }

    setOpenVariationsAddPage(false);
  };

  const getCurrentPageCustomerData = async () => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let skip = 0;
    let pageData = [];

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    }

    Query = db.parties.find({
      selector: {
        $and: [{ businessId: { $eq: businessData.businessId } }]
      },
      skip: skip,
      limit: limit
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      data.map((item) => {
        let temp = item.toJSON();

        if (addPageAdditionalText1 !== '') {
          temp.additionalText1 = temp[addPageAdditionalText1];
        } else {
          temp.additionalText1 = '';
        }

        if (addPageAdditionalText2 !== '') {
          temp.additionalText2 = temp[addPageAdditionalText2];
        } else {
          temp.additionalText2 = '';
        }

        pageData.push(temp);
      });
    });
    return pageData;
  };

  const getSalePriceData = (
    productItem,
    salePrice,
    cgst,
    sgst,
    igst,
    taxIncluded,
    saleDiscountAmount
  ) => {
    let saleObj = {
      mrp: 0,
      offerPrice: 0
    };

    if (saleDiscountAmount > 0) {
      let tax = (parseFloat(cgst) || 0) + (parseFloat(sgst) || 0);
      let igst_tax = parseFloat(igst || 0);

      let itemPrice = salePrice;

      let totalGST = 0;
      let totalIGST = 0;
      let mrp_before_tax = 0;

      if (taxIncluded) {
        totalGST = itemPrice - itemPrice * (100 / (100 + tax));
        //totalIGST = itemPrice - itemPrice * (100 / (100 + igst_tax));
      }

      mrp_before_tax = parseFloat(
        itemPrice - parseFloat(totalGST) - parseFloat(totalIGST)
      );
      let itemPriceAfterDiscount = mrp_before_tax - saleDiscountAmount;
      let cgst_amount = 0;
      let sgst_amount = 0;
      let igst_amount = 0;

      if (!taxIncluded) {
        const totalGST = (itemPriceAfterDiscount * tax) / 100;
        cgst_amount = totalGST / 2;
        sgst_amount = totalGST / 2;
        // igst_amount = (itemPriceAfterDiscount * igst_tax) / 100;
      } else {
        let totalGST = 0;
        let amount = 0;

        if (saleDiscountAmount > 0) {
          totalGST = itemPriceAfterDiscount * (tax / 100);
          cgst_amount = totalGST / 2;
          sgst_amount = totalGST / 2;

          amount = itemPriceAfterDiscount * (igst_tax / 100);

          // igst_amount = Math.round(amount * 100) / 100;
        }
      }

      const finalOfferAmount = parseFloat(
        mrp_before_tax -
          saleDiscountAmount +
          cgst_amount +
          sgst_amount +
          igst_amount
      );

      saleObj.mrp = salePrice;
      saleObj.offerPrice = Math.round(finalOfferAmount * 100) / 100 || 0;
    } else if (productItem.finalMRPPrice > 0 && productItem.salePrice > 0) {
      saleObj.mrp = productItem.finalMRPPrice;
      saleObj.offerPrice = productItem.salePrice;
    } else if (productItem.finalMRPPrice > 0 && productItem.salePrice === 0) {
      saleObj.mrp = productItem.finalMRPPrice;
      saleObj.offerPrice = 0;
    } else {
      saleObj.mrp = salePrice;
      saleObj.offerPrice = 0;
    }

    saleObj.mrp = parseFloat(saleObj.mrp.toFixed(2));
    saleObj.offerPrice = parseFloat(saleObj.offerPrice.toFixed(2));

    return saleObj;
  };

  return (
    <Page className={classes.root} title="Barcode and Label Print">
      <Grid fluid className="app-main" style={{ height: height - 50 }}>
        <Col className={classes.leftCol} xs={12} sm={6}>
          <div
            style={{ height: height - 40 }}
            className={classes.leftpanelscroll}
          >
            <Paper className="selectPrinter">
              <FormControl component="fieldset">
                <Typography variant="h5" className={classes.type}>
                  Label Type
                </Typography>
                <RadioGroup
                  row
                  aria-label="barcode"
                  name="barcode"
                  value={labelType}
                  onChange={handleLabelType}
                >
                  <FormControlLabel
                    labelPlacement="end"
                    value="withbarcode"
                    control={<Radio size="small" />}
                    label={
                      <Typography style={{ fontSize: 13 }}>
                        With Barcode
                      </Typography>
                    }
                  />
                  <FormControlLabel
                    value="withoutbarcode"
                    labelPlacement="end"
                    control={<Radio size="small" />}
                    label={
                      <Typography style={{ fontSize: 13 }}>
                        Without Barcode
                      </Typography>
                    }
                  />
                </RadioGroup>
              </FormControl>
              <FormControl
                style={{
                  display: 'inline-block',
                  float: 'right',
                  width: '45%'
                }}
                className={classes.labelSize}
                sx={{ m: 1, width: 300, mt: 3 }}
              ></FormControl>
            </Paper>

            <Paper className="selectPrinter">
              <MuiGrid container>
                <MuiGrid item xs={7}>
                  <FormControl component="fieldset">
                    <Typography variant="h5" className={classes.type}>
                      Select Printer
                    </Typography>
                    <RadioGroup
                      row
                      aria-label="printer"
                      name="printer"
                      value={printType}
                      onChange={handlePrintType}
                    >
                      <FormControlLabel
                        labelPlacement="end"
                        value="label"
                        control={<Radio size="small" />}
                        label={
                          <Typography style={{ fontSize: 13 }}>
                            Label Printer
                          </Typography>
                        }
                      />
                      {/* {labelType === 'withoutbarcode' && ( */}
                      <FormControlLabel
                        value="regular"
                        labelPlacement="end"
                        control={<Radio size="small" />}
                        label={
                          <Typography style={{ fontSize: 13 }}>
                            Regular Printer
                          </Typography>
                        }
                      />
                      {/* )} */}
                    </RadioGroup>
                  </FormControl>
                </MuiGrid>
                {printType === 'label' && (
                  <MuiGrid item xs={5}>
                    <FormControl
                      style={{
                        display: 'inline-block',
                        width: '100%'
                      }}
                      className={classes.labelSize}
                      sx={{ m: 1, width: 300, mt: 3 }}
                    >
                      <Typography variant="h5" className={classes.printerText}>
                        Choose Printer
                      </Typography>
                      <Select
                        displayEmpty
                        value={selectedPrinter}
                        input={
                          <OutlinedInput
                            className={classes.outlinedInput}
                            size="small"
                          />
                        }
                        inputProps={{ 'aria-label': 'Without label' }}
                        onOpen={(e) => {
                          let printerData;
                          try {
                            printerData = JSON.parse(
                              window.localStorage.getItem('printers')
                            );
                          } catch (e) {
                            console.error(' Error: ', e.message);
                          }

                          setPrinterList(printerData ? printerData : []);
                        }}
                      >
                        <MenuItem disabled value="">
                          Select Printer
                        </MenuItem>
                        {printersList.map((c) => (
                          <MenuItem
                            key={c.name}
                            value={c.name}
                            name={c.name}
                            onClick={() => {
                              setselectedPrinter(c.name);
                              if (printType === 'label') {
                                saveSelectedThermalPrinter(c);
                              }
                            }}
                          >
                            {c.displayName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </MuiGrid>
                )}
              </MuiGrid>
            </Paper>

            <Paper className={classes.paper}>
              <FormControl component="fieldset" style={{ width: '100%' }}>
                <Typography variant="h5" className={classes.type}>
                  Size
                </Typography>
                {printType === 'regular' ? (
                  <FormControl
                    className={classes.labelSize}
                    sx={{ m: 1, width: 300, mt: 3 }}
                  >
                    <Select
                      value={printType !== 'regular' ? labelSize : 24}
                      input={
                        <OutlinedInput
                          className={classes.outlinedInput}
                          size="small"
                        />
                      }
                      displayEmpty
                    >
                      {withoutBarcodeLabelSizeList.map((ele) => (
                        <MenuItem
                          value={ele.val}
                          onClick={() => handleLabelSize(ele)}
                        >
                          {ele.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <>
                    <RadioGroup
                      aria-label="printer"
                      name="printer"
                      value={sizeType}
                      onChange={handleSizeType}
                    >
                      <FormControlLabel
                        value="default"
                        labelPlacement="end"
                        control={<Radio size="small" />}
                        label={
                          <Typography style={{ fontSize: 13 }}>
                            Default
                          </Typography>
                        }
                      />
                      <FormControl
                        className={classes.labelSize}
                        sx={{ m: 1, width: 300, mt: 3 }}
                      >
                        <Select
                          disabled={sizeType === 'custom' ? true : false}
                          value={sizeVal}
                          input={
                            <OutlinedInput
                              className={classes.outlinedInput}
                              size="small"
                            />
                          }
                          displayEmpty
                        >
                          {sizeList.map((ele) => (
                            <MenuItem
                              value={ele.val}
                              onClick={() => handleLabelSize(ele)}
                            >
                              {ele.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {/* <FormControlLabel
                        labelPlacement="end"
                        value="custom"
                        control={<Radio size="small" />}
                        label={
                          <Typography style={{ fontSize: 13 }}>
                            Custom
                          </Typography>
                        }
                      /> */}
                      {/* <form>
                        <div className="displayInline">
                          <Typography style={{ fontSize: 13 }}>
                            {' '}
                            Unit{' '}
                          </Typography>
                          <FormControl style={{ width: 60 }}>
                            <Select
                              disabled={sizeType === 'default' ? true : false}
                              value={unit}
                              onChange={handleUnitChange}
                              input={<OutlinedInput />}
                            >
                              <MenuItem value="mm">mm</MenuItem>
                              <MenuItem value="cm">cm</MenuItem>
                              <MenuItem value="px">px</MenuItem>
                            </Select>
                          </FormControl>
                        </div>

                        <div className="paperDesign" style={{ marginLeft: 10 }}>
                          <Typography style={{ fontSize: 13 }}>
                            Paper Width
                          </Typography>
                          <FormControl
                            sx={{ m: 1, width: '25ch' }}
                            variant="outlined"
                          >
                            <OutlinedInput
                              disabled={sizeType === 'default' ? true : false}
                              id="outlined-adornment-weight"
                              value={customData.paperWidthDisplay}
                              endAdornment={
                                <InputAdornment
                                  style={{ marginLeft: 0 }}
                                  position="end"
                                >
                                  {unit}
                                </InputAdornment>
                              }
                              aria-describedby="outlined-weight-helper-text"
                              inputProps={{
                                'aria-label': 'paperWidthDisplay',
                                className: classes.inputNumber
                              }}
                              type="number"
                              onKeyDown={blockInvalidChar}
                              className={classes.removeArrow}
                              onChange={handleCustomDataChange(
                                'paperWidthDisplay'
                              )}
                            />
                          </FormControl>
                        </div>

                        {printType === 'regular' && (
                          <div
                            className="paperDesign"
                            style={{ marginLeft: 10 }}
                          >
                            <Typography style={{ fontSize: 13 }}>
                              Paper Height
                            </Typography>
                            <FormControl
                              sx={{ m: 5, width: '25ch' }}
                              variant="outlined"
                            >
                              <OutlinedInput
                                disabled={sizeType === 'default' ? true : false}
                                type="number"
                                onKeyDown={blockInvalidChar}
                                className={classes.removeArrow}
                                id="standard-adornment-weight"
                                value={customData.paperHeightDisplay}
                                onChange={handleCustomDataChange(
                                  'paperHeightDisplay'
                                )}
                                endAdornment={
                                  <InputAdornment
                                    style={{ marginLeft: 0 }}
                                    position="end"
                                  >
                                    {unit}
                                  </InputAdornment>
                                }
                                aria-describedby="standard-weight-helper-text"
                                inputProps={{
                                  'aria-label': 'weight',
                                  className: classes.inputNumber
                                }}
                              />
                            </FormControl>
                          </div>
                        )}

                        <div className="paperDesign" style={{ marginLeft: 10 }}>
                          <Typography style={{ fontSize: 13 }}>
                            Label Width
                          </Typography>
                          <FormControl
                            sx={{ m: 1, width: '25ch' }}
                            variant="outlined"
                          >
                            <OutlinedInput
                              disabled={sizeType === 'default' ? true : false}
                              id="outlined-adornment-weight"
                              value={customData.customWidthDisplay}
                              endAdornment={
                                <InputAdornment
                                  style={{ marginLeft: 0 }}
                                  position="end"
                                >
                                  {unit}
                                </InputAdornment>
                              }
                              aria-describedby="outlined-weight-helper-text"
                              inputProps={{
                                'aria-label': 'customWidthDisplay',
                                className: classes.inputNumber
                              }}
                              type="number"
                              onKeyDown={blockInvalidChar}
                              className={classes.removeArrow}
                              onChange={handleCustomDataChange(
                                'customWidthDisplay'
                              )}
                            />
                          </FormControl>
                        </div>

                        <div className="paperDesign" style={{ marginLeft: 10 }}>
                          <Typography style={{ fontSize: 13 }}>
                            Label Height
                          </Typography>
                          <FormControl
                            sx={{ m: 1, width: '25ch' }}
                            variant="outlined"
                          >
                            <OutlinedInput
                              disabled={sizeType === 'default' ? true : false}
                              id="outlined-adornment-weight"
                              value={customData.customHeightDisplay}
                              endAdornment={
                                <InputAdornment
                                  style={{ marginLeft: 0 }}
                                  position="end"
                                >
                                  {unit}
                                </InputAdornment>
                              }
                              aria-describedby="outlined-weight-helper-text"
                              inputProps={{
                                'aria-label': 'customHeightDisplay',
                                className: classes.inputNumber
                              }}
                              type="number"
                              onKeyDown={blockInvalidChar}
                              className={classes.removeArrow}
                              onChange={handleCustomDataChange(
                                'customHeightDisplay'
                              )}
                            />
                          </FormControl>
                        </div>
                      </form> */}

                      {/* --------------- MARGIN SETTING --------------------- */}

                      {/* <form className="marginBtm">
                        <div>
                          <p className="barcodeSetting">Margins</p>
                        </div>                     

                        <div className="fontDesignFirst">
                          <Typography style={{ fontSize: 13 }}>Left</Typography>
                          <FormControl
                            style={{ width: '100%' }}
                            variant="outlined"
                          >
                            <Select
                              disabled={sizeType === 'default' ? true : false}
                              value={customData.marginLeft}
                              input={
                                <OutlinedInput
                                  className={classes.outlinedInput}
                                  size="small"
                                />
                              }
                              displayEmpty
                              onChange={handleCustomDataChange('marginLeft')}
                              MenuProps={{
                                classes: { paper: classes.dropdownStyle }
                              }}
                            >
                              <MenuItem value={0}>0</MenuItem>
                              {marginArrayList.map((ele) => (
                                <MenuItem value={ele}>{ele}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <div className="fontDesign">
                          <Typography style={{ fontSize: 13 }}>
                            Right
                          </Typography>
                          <FormControl
                            style={{ width: '100%' }}
                            variant="outlined"
                          >
                            <Select
                              disabled={sizeType === 'default' ? true : false}
                              value={customData.marginRight}
                              input={
                                <OutlinedInput
                                  className={classes.outlinedInput}
                                  size="small"
                                />
                              }
                              displayEmpty
                              onChange={handleCustomDataChange('marginRight')}
                              MenuProps={{
                                classes: { paper: classes.dropdownStyle }
                              }}
                            >
                              <MenuItem value={0}>0</MenuItem>
                              {marginArrayList.map((ele) => (
                                <MenuItem value={ele}>{ele}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <div className="fontDesign">
                          <Typography style={{ fontSize: 13 }}>Top</Typography>
                          <FormControl
                            style={{ width: '100%' }}
                            variant="outlined"
                          >
                            <Select
                              disabled={sizeType === 'default' ? true : false}
                              value={customData.marginTop}
                              input={
                                <OutlinedInput
                                  className={classes.outlinedInput}
                                  size="small"
                                />
                              }
                              displayEmpty
                              onChange={handleCustomDataChange('marginTop')}
                              MenuProps={{
                                classes: { paper: classes.dropdownStyle }
                              }}
                            >
                              <MenuItem value={0}>0</MenuItem>
                              {marginArrayList.map((ele) => (
                                <MenuItem value={ele}>{ele}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>

                        <div className="fontDesign">
                          <Typography style={{ fontSize: 13 }}>
                            Bottom
                          </Typography>
                          <FormControl
                            style={{ width: '100%' }}
                            variant="outlined"
                          >
                            <Select
                              disabled={sizeType === 'default' ? true : false}
                              value={customData.marginBottom}
                              input={
                                <OutlinedInput
                                  className={classes.outlinedInput}
                                  size="small"
                                />
                              }
                              displayEmpty
                              onChange={handleCustomDataChange('marginBottom')}
                              MenuProps={{
                                classes: { paper: classes.dropdownStyle }
                              }}
                            >
                              <MenuItem value={0}>0</MenuItem>
                              {marginArrayList.map((ele) => (
                                <MenuItem value={ele}>{ele}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </div>
                      </form>*/}

                      {/* --------------- FONT SIZE SETTING ------------------------- */}

                      {/* <form style={{ marginBottom: '-128px' }}>
                        <div>
                          <p className="barcodeSetting">Font Size</p>
                        </div>
                        <div className="fontDesignFirst">
                          <Typography style={{ fontSize: 13 }}>
                            Header
                          </Typography>
                          <FormControl
                            variant="outlined"
                            style={{ width: '100%' }}
                          >
                            <Select
                              disabled={sizeType === 'default' ? true : false}
                              value={customData.headerFont}
                              input={
                                <OutlinedInput
                                  className={classes.outlinedInput}
                                  size="small"
                                />
                              }
                              displayEmpty
                              onChange={handleCustomDataChange('headerFont')}
                              MenuProps={{
                                classes: { paper: classes.dropdownStyle }
                              }}
                            >
                              {fontSizeList.map((ele) => (
                                <MenuItem value={ele}>{ele}</MenuItem>
                              ))}
                            </Select>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={customData.headerWeight}
                                  onChange={handleCheckboxCustomDataChange(
                                    'headerWeight'
                                  )}
                                />
                              }
                              label="Bold"
                              size="small"
                            />
                          </FormControl>
                        </div>

                        <div className="fontDesign">
                          <Typography style={{ fontSize: 13 }}>
                            Item Code
                          </Typography>
                          <FormControl
                            style={{ width: '100%' }}
                            variant="outlined"
                          >
                            <Select
                              disabled={sizeType === 'default' ? true : false}
                              value={customData.itemCode}
                              input={
                                <OutlinedInput
                                  className={classes.outlinedInput}
                                  size="small"
                                />
                              }
                              displayEmpty
                              onChange={handleCustomDataChange('itemCode')}
                              MenuProps={{
                                classes: { paper: classes.dropdownStyle }
                              }}
                            >
                              {fontSizeList.map((ele) => (
                                <MenuItem value={ele}>{ele}</MenuItem>
                              ))}
                            </Select>

                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={customData.itemcodeWeight}
                                  onChange={handleCheckboxCustomDataChange(
                                    'itemcodeWeight'
                                  )}
                                />
                              }
                              label="Bold"
                              size="small"
                            />
                          </FormControl>
                        </div>

                        <div className="fontDesign">
                          <Typography style={{ fontSize: 13 }}>
                            Additional Text
                          </Typography>
                          <FormControl
                            style={{ width: '100%' }}
                            variant="outlined"
                          >
                            <Select
                              disabled={sizeType === 'default' ? true : false}
                              value={customData.additionalFont}
                              input={
                                <OutlinedInput
                                  className={classes.outlinedInput}
                                  size="small"
                                />
                              }
                              displayEmpty
                              onChange={handleCustomDataChange(
                                'additionalFont'
                              )}
                              MenuProps={{
                                classes: { paper: classes.dropdownStyle }
                              }}
                            >
                              {fontSizeList.map((ele) => (
                                <MenuItem value={ele}>{ele}</MenuItem>
                              ))}
                            </Select>

                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={customData.additionalWeight}
                                  onChange={handleCheckboxCustomDataChange(
                                    'additionalWeight'
                                  )}
                                />
                              }
                              label="Bold"
                              size="small"
                            />
                          </FormControl>
                        </div>

                        <div className="fontDesign">
                          <Typography style={{ fontSize: 13 }}>
                            Footer
                          </Typography>
                          <FormControl
                            style={{ width: '100%' }}
                            variant="outlined"
                          >
                            <Select
                              disabled={sizeType === 'default' ? true : false}
                              value={customData.footerFont}
                              input={
                                <OutlinedInput
                                  className={classes.outlinedInput}
                                  size="small"
                                />
                              }
                              displayEmpty
                              onChange={handleCustomDataChange('footerFont')}
                              MenuProps={{
                                classes: { paper: classes.dropdownStyle }
                              }}
                            >
                              {fontSizeList.map((ele) => (
                                <MenuItem value={ele}>{ele}</MenuItem>
                              ))}
                            </Select>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={customData.footerWeight}
                                  onChange={handleCheckboxCustomDataChange(
                                    'footerWeight'
                                  )}
                                />
                              }
                              label="Bold"
                              size="small"
                            />
                          </FormControl>
                        </div>
                      </form>  */}
                    </RadioGroup>
                  </>
                )}
              </FormControl>
            </Paper>

            <Paper className="addBarcode" style={{ height: '87%' }}>
              {/* <Paper className="addBarcode"> */}
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div>
                  <FormControl component="fieldset">
                    {/* <Typography variant="h5" className={classes.type}>
                        Select Title
                      </Typography> */}
                    <RadioGroup
                      row
                      aria-label="title"
                      name="title"
                      value={titleType}
                      onChange={handleTitleType}
                    >
                      {labelType === 'withbarcode' ? (
                        <FormControlLabel
                          labelPlacement="end"
                          value="product"
                          control={<Radio size="small" />}
                          label={
                            <Typography style={{ fontSize: 13 }}>
                              Product
                            </Typography>
                          }
                        />
                      ) : (
                        <FormControlLabel
                          value="customer"
                          labelPlacement="end"
                          control={<Radio size="small" />}
                          label={
                            <Typography style={{ fontSize: 13 }}>
                              Customer / Vendor
                            </Typography>
                          }
                        />
                      )}

                      {/* <FormControlLabel
                        value="vendor"
                        labelPlacement="end"
                        control={<Radio size="small" />}
                        label={
                        <Typography style={{ fontSize: 13 }}>
                          Vendor
                        </Typography>
                        }
                      /> */}
                    </RadioGroup>
                  </FormControl>
                </div>
                {titleType === 'customer' && printType === 'regular' && (
                  <div>
                    <Button
                      variant="contained"
                      className={classes.addBarcode}
                      /* disabled={
                      barcodeData.name && barcodeData.label > 0 ? false : true
                    } */
                      onClick={() => {
                        getAllBarcodeData();
                        getAllCustVendList();
                        handleAddPageClick();
                      }}
                    >
                      <span>Add Page</span>
                    </Button>
                  </div>
                )}
                <div style={{ marginLeft: '10px' }}>
                  <Button
                    variant="contained"
                    className={classes.addBarcode}
                    /* disabled={
                      barcodeData.name && barcodeData.label > 0 ? false : true
                    } */
                    onClick={() => {
                      if (barcodeData.name === '') {
                        setErrorMessage('Empty data cannot be added');
                        setOpenErrorDialog(true);
                      } else if (barcodeData.label === '') {
                        setErrorMessage('No of labels cannot be left blank');
                        setOpenErrorDialog(true);
                      } else if (variationsList.length > 0) {
                        handleVariationsAddPageClick();
                      } else {
                        addBarcodeData();
                        setLabel('');
                        setProductName('');
                        setCustAddress('');
                        setCustName('');
                        setDescription('');
                        setCustomerData({});
                        setadditionTextWithoutBarcode('');
                        setadditionTextWithoutBarcode2('');
                        setEnableMrp(true);
                        setEnableOfferPrice(true);
                        setPurchasePriceCode(true);
                      }
                    }}
                  >
                    {labelType === 'withoutbarcode' ? (
                      <span>Add Label</span>
                    ) : (
                      <span>Add Barcode</span>
                    )}
                  </Button>
                </div>
              </div>
              <Typography variant="h5" className={classes.type}>
                Name<span style={{ color: '#EF5350' }}>*</span>
              </Typography>

              {titleType === 'product' ? (
                <div style={{ position: 'relative' }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    required
                    value={
                      productName === '' ? productNameWhileEditing : productName
                    }
                    InputProps={{
                      classes: { input: classes.tableForm },
                      disableUnderline: true
                    }}
                    onChange={(e) => {
                      getProductList(e.target.value);
                      if (e.target.value !== productNameWhileEditing) {
                        setProductName('');
                        setSelectedProduct('');
                      }
                      getProductList(e.target.value);
                      setProductNameWhileEditing(e.target.value);
                    }}
                  />{' '}
                  {productlist.length > 0 ? (
                    <div>
                      <ul className={classes.listbox}>
                        {productlist.map((option, index) => (
                          <li
                            style={{ padding: 10, cursor: 'pointer' }}
                            onClick={() => {
                              if (option.barcode) {
                                setBarcodeDataProperty(option.name, 'name');
                                setBarcodeDataProperty(
                                  option.barcode,
                                  'barcode'
                                );
                                let saleObject = getSalePriceData(
                                  option,
                                  option.salePrice,
                                  option.cgst,
                                  option.sgst,
                                  option.igst,
                                  option.taxIncluded,
                                  option.saleDiscountAmount
                                );
                                setProductName(option.name);
                                setDescription(option.description);
                                setBarcodeDataProperty(
                                  option.description,
                                  'description'
                                );
                                setSelectedProduct(option);
                                sectedProductForBarcode(option);
                                if (printType === 'regular') {
                                  if (option.purchasedPrice > 0) {
                                    let ppc = getPurchasePriceCode(
                                      option.purchasedPrice
                                    );
                                    if (ppc) {
                                      setBarcodeDataProperty(
                                        ppc,
                                        'purchasePriceCode'
                                      );
                                    }
                                  }
                                  setBarcodeDataProperty(
                                    purchasePriceCode,
                                    'enablePurchasePriceCode'
                                  );
                                  setBarcodeDataProperty(
                                    enableMrp,
                                    'enableMrp'
                                  );
                                  setBarcodeDataProperty(
                                    enableOfferPrice,
                                    'enableOfferPrice'
                                  );
                                  setBarcodeDataProperty(
                                    'business_name',
                                    'headerVal'
                                  );
                                  setBarcodeDataProperty(
                                    businessName,
                                    'header'
                                  );

                                  setBarcodeDataProperty(
                                    'product_name',
                                    'lineVal'
                                  );
                                  setBarcodeDataProperty(option.name, 'line');
                                  setBarcodeDataProperty(
                                    saleObject.mrp,
                                    'mrpValue'
                                  );
                                  setBarcodeDataProperty(
                                    saleObject.offerPrice,
                                    'offerPriceValue'
                                  );
                                  setBarcodeDataProperty(option.name, 'line');
                                } else {
                                  if (
                                    String(
                                      localStorage.getItem('isJewellery')
                                    ).toLowerCase() === 'true'
                                  ) {
                                    setBarcodeDataProperty(
                                      option.netWeight,
                                      'netWeight'
                                    );
                                    setBarcodeDataProperty(
                                      option.grossWeight,
                                      'grossWeight'
                                    );
                                    setBarcodeDataProperty(
                                      option.stoneWeight,
                                      'stoneWeight'
                                    );
                                    setBarcodeDataProperty(
                                      option.wastageGrams,
                                      'wastage'
                                    );
                                    setBarcodeDataProperty(
                                      option.purity,
                                      'purity'
                                    );
                                    setBarcodeDataProperty(
                                      option.hallmarkUniqueId,
                                      'hallmarkUniqueId'
                                    );
                                    setBarcodeDataProperty(
                                      'business_name',
                                      'headerVal'
                                    );
                                    setBarcodeDataProperty(
                                      businessName,
                                      'header'
                                    );

                                    setBarcodeDataProperty(
                                      'product_name',
                                      'lineVal'
                                    );
                                    setBarcodeDataProperty(option.name, 'line');
                                  } else {
                                    setBarcodeDataProperty(
                                      'business_name',
                                      'headerVal'
                                    );
                                    setBarcodeDataProperty(
                                      businessName,
                                      'header'
                                    );

                                    setBarcodeDataProperty(
                                      'product_name',
                                      'lineVal'
                                    );
                                    if (
                                      saleObject.mrp > 0 &&
                                      saleObject.offerPrice > 0
                                    ) {
                                      setBarcodeDataProperty(
                                        `MRP: ₹${saleObject.mrp} OFFER: ₹${saleObject.offerPrice}`,
                                        'footer'
                                      );
                                    } else {
                                      setBarcodeDataProperty(
                                        `MRP: ₹${saleObject.mrp}`,
                                        'footer'
                                      );
                                    }
                                    setBarcodeDataProperty(
                                      'sale_price',
                                      'footerVal'
                                    );
                                    setBarcodeDataProperty(option.name, 'line');
                                  }
                                }
                                setProductNameWhileEditing('');
                                setproductlist([]);
                              } else if (
                                option.batchData &&
                                option.batchData.length > 0
                              ) {
                                setBarcodeDataProperty(option.name, 'name');
                                setBarcodeDataProperty(
                                  option.barcode,
                                  'barcode'
                                );
                                let saleObject = getSalePriceData(
                                  option,
                                  option.salePrice,
                                  option.cgst,
                                  option.sgst,
                                  option.igst,
                                  option.taxIncluded,
                                  option.saleDiscountAmount
                                );
                                setProductName(option.name);
                                setDescription(option.description);
                                setBarcodeDataProperty(
                                  option.description,
                                  'description'
                                );
                                setSelectedProduct(option);
                                sectedProductForBarcode(option);
                                if (printType === 'regular') {
                                  if (option.purchasedPrice > 0) {
                                    let ppc = getPurchasePriceCode(
                                      option.purchasedPrice
                                    );
                                    if (ppc) {
                                      setBarcodeDataProperty(
                                        ppc,
                                        'purchasePriceCode'
                                      );
                                    }
                                  }
                                  setBarcodeDataProperty(
                                    purchasePriceCode,
                                    'enablePurchasePriceCode'
                                  );
                                  setBarcodeDataProperty(
                                    enableMrp,
                                    'enableMrp'
                                  );
                                  setBarcodeDataProperty(
                                    enableOfferPrice,
                                    'enableOfferPrice'
                                  );
                                  setBarcodeDataProperty(
                                    'business_name',
                                    'headerVal'
                                  );
                                  setBarcodeDataProperty(
                                    businessName,
                                    'header'
                                  );

                                  setBarcodeDataProperty(
                                    'product_name',
                                    'lineVal'
                                  );
                                  setBarcodeDataProperty(option.name, 'line');
                                  setBarcodeDataProperty(
                                    saleObject.mrp,
                                    'mrpValue'
                                  );
                                  setBarcodeDataProperty(
                                    saleObject.offerPrice,
                                    'offerPriceValue'
                                  );
                                } else {
                                  if (
                                    String(
                                      localStorage.getItem('isJewellery')
                                    ).toLowerCase() === 'true'
                                  ) {
                                    setBarcodeDataProperty(
                                      option.netWeight,
                                      'netWeight'
                                    );
                                    setBarcodeDataProperty(
                                      option.grossWeight,
                                      'grossWeight'
                                    );
                                    setBarcodeDataProperty(
                                      option.stoneWeight,
                                      'stoneWeight'
                                    );
                                    setBarcodeDataProperty(
                                      option.wastageGrams,
                                      'wastage'
                                    );
                                    setBarcodeDataProperty(
                                      option.purity,
                                      'purity'
                                    );
                                    setBarcodeDataProperty(
                                      option.hallmarkUniqueId,
                                      'hallmarkUniqueId'
                                    );
                                  } else {
                                    setBarcodeDataProperty(
                                      'business_name',
                                      'headerVal'
                                    );
                                    setBarcodeDataProperty(
                                      businessName,
                                      'header'
                                    );

                                    setBarcodeDataProperty(
                                      'product_name',
                                      'lineVal'
                                    );
                                    if (
                                      saleObject.mrp > 0 &&
                                      saleObject.offerPrice > 0
                                    ) {
                                      setBarcodeDataProperty(
                                        `MRP: ₹${saleObject.mrp} OFFER: ₹${saleObject.offerPrice}`,
                                        'footer'
                                      );
                                    } else {
                                      setBarcodeDataProperty(
                                        `MRP: ₹${saleObject.mrp}`,
                                        'footer'
                                      );
                                    }
                                    setBarcodeDataProperty(
                                      'sale_price',
                                      'footerVal'
                                    );
                                    setBarcodeDataProperty(option.name, 'line');
                                  }
                                }
                                setProductNameWhileEditing('');
                                setproductlist([]);

                                setActualProduct(option);
                                setVariationsList(option.batchData);
                                setProductNameWhileEditing('');
                                setproductlist([]);
                              } else {
                                setproductlist([]);
                                alert(
                                  'The Product you selected doesnot have Barcode number! '
                                );
                              }
                            }}
                          >
                            <Grid
                              container
                              // justify="space-between"
                              style={{ display: 'flex' }}
                              className={classes.listitemGroup}
                            >
                              <Grid item xs={12}>
                                <p style={{ fontSize: '14px' }}>
                                  <b>{option.name}</b>
                                </p>
                                {String(
                                  localStorage.getItem('isJewellery')
                                ).toLowerCase() === 'true' ? (
                                  <p style={{ fontSize: '14px' }}>
                                    G WT: <b>{option.grossWeight}</b>
                                    &nbsp;&nbsp;&nbsp; &nbsp;L WT:{' '}
                                    <b>{option.stoneWeight}</b>
                                    &nbsp;&nbsp;&nbsp; &nbsp;N WT:{' '}
                                    <b>{option.netWeight}</b>
                                  </p>
                                ) : (
                                  <p style={{ fontSize: '14px' }}>
                                    MRP: <b>₹{option.finalMRPPrice}</b>
                                    &nbsp;&nbsp;&nbsp; &nbsp;Sale Price:{' '}
                                    <b>₹{option.salePrice}</b>&nbsp;&nbsp;&nbsp;
                                    &nbsp;Purchase Price:{' '}
                                    <b>₹{option.purchasedPrice}</b>
                                  </p>
                                )}
                              </Grid>
                            </Grid>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <TextField
                    variant="outlined"
                    fullWidth
                    required
                    defaultValue={''}
                    value={custName === '' ? custNameWhileEditing : custName}
                    InputProps={{
                      classes: { input: classes.tableForm },
                      disableUnderline: true
                    }}
                    onChange={(e) => {
                      getCustomerList(e.target.value);
                      setCustName(e.target.value);
                      setBarcodeDataProperty(e.target.value, 'name');
                      setBarcodeDataProperty(e.target.value, 'header');
                      if (e.target.value !== custNameWhileEditing) {
                        setCustName('');
                        setSelectedCust('');
                        setCustAddress('');
                        setadditionTextWithoutBarcode('');
                        setadditionTextWithoutBarcode2('');
                        setCustGSTN('');
                      }
                      setCustNameWhileEditing(e.target.value);
                    }}
                  />{' '}
                  {custList.length > 0 ? (
                    <div>
                      <ul className={classes.listbox}>
                        {custList.map((option, index) => (
                          <li
                            style={{ padding: 10, cursor: 'pointer' }}
                            onClick={() => {
                              setCustomerData(option);
                              setCustName(option.name);
                              setCustAddress(option.address);
                              setBarcodeDataProperty(option.name, 'name');
                              setBarcodeDataProperty(option.name, 'header');
                              setBarcodeDataProperty(option.address, 'line');
                              setBarcodeDataProperty(undefined, 'barcode');
                              setCustNameWhileEditing('');
                              setCustList([]);
                            }}
                          >
                            <MuiGrid
                              container
                              // justify="space-between"

                              className={classes.listitemGroup}
                            >
                              <MuiGrid item xs={12}>
                                <p style={{ fontSize: '14px' }}>
                                  <b>{option.name}</b>
                                </p>
                                <p style={{ fontSize: '14px' }}>
                                  Phone No: {option.phoneNo}
                                </p>
                              </MuiGrid>
                            </MuiGrid>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <MuiGrid
                    container
                    //justify="space-between"

                    style={{ margin: '0', padding: '0' }}
                  >
                    <MuiGrid
                      item
                      xs={12}
                      align="left"
                      style={{ paddingLeft: '0' }}
                    >
                      <Typography
                        variant="h6"
                        className={classes.type}
                        align="left"
                      >
                        Address
                      </Typography>
                      <TextField
                        multiline
                        rows="2"
                        style={{ width: '100%' }}
                        variant="outlined"
                        value={custAddress}
                        onChange={(e) => {
                          setCustAddress(e.target.value);
                          setBarcodeDataProperty(e.target.value, 'line');
                        }}
                      />
                    </MuiGrid>
                  </MuiGrid>
                  <FormControl
                    style={{ width: '100%' }}
                    sx={{ m: 1, width: 300, mt: 3 }}
                  >
                    <Typography variant="h5" className="headerText">
                      Additional Text 1
                    </Typography>
                    <Select
                      value={additionTextWithoutBarcode}
                      input={
                        <OutlinedInput
                          className={classes.outlinedInput}
                          size="small"
                        />
                      }
                      displayEmpty
                      onChange={(e) => {
                        if (e.target.value !== '') {
                          setBarcodeDataProperty(
                            customerData[e.target.value],
                            'footer'
                          );
                          setadditionTextWithoutBarcode(e.target.value);
                        }
                      }}
                    >
                      <MenuItem
                        value=""
                        onClick={() => {
                          setBarcodeDataProperty('', 'footer');
                          setBarcodeDataProperty('', 'footerVal');
                        }}
                      >
                        <em>None</em>
                      </MenuItem>
                      {addtionalCustdetail.map((ele) => (
                        <MenuItem value={ele.val} onClick={() => {}}>
                          {ele.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl
                    style={{ width: '100%' }}
                    sx={{ m: 1, width: 300, mt: 3 }}
                  >
                    <Typography variant="h5" className="headerText">
                      Additional Text 2
                    </Typography>
                    <Select
                      value={additionTextWithoutBarcode2}
                      input={
                        <OutlinedInput
                          className={classes.outlinedInput}
                          size="small"
                        />
                      }
                      displayEmpty
                      onChange={(e) => {
                        if (e.target.value !== '') {
                          setBarcodeDataProperty(
                            customerData[e.target.value],
                            'addtionalTextTwo'
                          );
                          setadditionTextWithoutBarcode2(e.target.value);
                        }
                      }}
                    >
                      <MenuItem
                        value=""
                        onClick={() => {
                          setBarcodeDataProperty('', 'addtionalTextTwo');
                          setBarcodeDataProperty('', 'addtionalTextTwoVal');
                        }}
                      >
                        <em>None</em>
                      </MenuItem>
                      {addtionalCustdetail.map((ele) => (
                        <MenuItem value={ele.val} onClick={() => {}}>
                          {ele.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <Typography variant="h5" className={classes.type} required>
                      No of Labels <span style={{ color: '#EF5350' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      value={label}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl
                    className="rightAlign"
                    sx={{ m: 1, width: 300, mt: 3 }}
                  >
                    <Typography variant="h5" className="headerText">
                      Print Start from
                    </Typography>
                    <Select
                      value={
                        barcodeDataList.length > 0
                          ? barcodeDataList[0].printStartFrom
                          : barcodeData.printStartFrom
                      }
                      input={
                        <OutlinedInput
                          className={classes.outlinedInput}
                          size="small"
                        />
                      }
                      displayEmpty
                      disabled={barcodeDataList.length === 0 ? false : true}
                      onChange={(e) =>
                        setBarcodeDataProperty(e.target.value, 'printStartFrom')
                      }
                    >
                      {printStartFromList.map((ele) => (
                        <MenuItem value={ele} onClick={() => {}}>
                          {ele}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
              )}

              {titleType === 'product' && printType === 'regular' && (
                <>
                  <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={purchasePriceCode}
                          onChange={(e) => {
                            setPurchasePriceCode(e.target.checked);
                            setBarcodeDataProperty(
                              e.target.checked,
                              'enablePurchasePriceCode'
                            );
                          }}
                          name="enablePurchasePriceCode"
                        />
                      }
                      label="Enable Purchase Price Code"
                    />
                  </div>

                  <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableMrp}
                          onChange={(e) => {
                            setEnableMrp(e.target.checked);
                            setBarcodeDataProperty(
                              e.target.checked,
                              'enableMrp'
                            );
                          }}
                          name="enableMrp"
                        />
                      }
                      label="Enable MRP"
                    />
                  </div>

                  <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={enableOfferPrice}
                          onChange={(e) => {
                            setEnableOfferPrice(e.target.checked);
                            setBarcodeDataProperty(
                              e.target.checked,
                              'enableOfferPrice'
                            );
                          }}
                          name="enableOfferPrice"
                        />
                      }
                      label="Enable Offer Price"
                    />
                  </div>

                  <MuiGrid
                    container
                    //justify="space-between"

                    style={{ margin: '0', padding: '0' }}
                  >
                    <MuiGrid
                      item
                      xs={12}
                      align="left"
                      style={{ paddingLeft: '0' }}
                    >
                      <Typography
                        variant="h6"
                        className={classes.type}
                        align="left"
                      >
                        Description
                      </Typography>
                      <TextField
                        style={{ width: '100%' }}
                        variant="outlined"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setBarcodeDataProperty(e.target.value, 'description');
                        }}
                      />
                    </MuiGrid>
                  </MuiGrid>

                  <FormControl>
                    <Typography variant="h5" className={classes.type} required>
                      No of Labels <span style={{ color: '#EF5350' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      value={label}
                      onChange={handleChange}
                    />
                  </FormControl>

                  <FormControl
                    className="rightAlign"
                    sx={{ m: 1, width: 300, mt: 3 }}
                  >
                    <Typography variant="h5" className="headerText">
                      Print Start from
                    </Typography>
                    <Select
                      value={
                        barcodeDataList.length > 0
                          ? barcodeDataList[0].printStartFrom
                          : barcodeData.printStartFrom
                      }
                      input={
                        <OutlinedInput
                          className={classes.outlinedInput}
                          size="small"
                        />
                      }
                      displayEmpty
                      disabled={barcodeDataList.length === 0 ? false : true}
                      onChange={(e) =>
                        setBarcodeDataProperty(e.target.value, 'printStartFrom')
                      }
                    >
                      {printStartFromList.map((ele) => (
                        <MenuItem value={ele} onClick={() => {}}>
                          {ele}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}

              {titleType === 'product' && printType === 'label' && (
                <>
                  {String(localStorage.getItem('isJewellery')).toLowerCase() ===
                  'true' ? (
                    <>
                      {/* <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={enableGrossWeight}
                              onChange={(e) => {
                                setEnableGrossWeight(e.target.checked);
                                if (e.target.checked) {
                                  if (selectedProduct) {
                                    setBarcodeDataProperty(
                                      selectedProduct.grossWeight,
                                      'grossWeight');
                                   
                                  } else {
                                    setBarcodeDataProperty(
                                      selectedProduct.grossWeight,
                                      ''
                                    );
                                  }
                                }
                              }}
                              name="enableGrossWeight"
                            />
                          }
                          label="Enable Gross Weight"
                        />
                      </div>

                      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={enableWastage}
                              onChange={(e) => {
                                setEnableWastage(e.target.checked);
                                if (e.target.checked) {
                                  if (selectedProduct) {
                                    setBarcodeDataProperty(
                                      selectedProduct.wastageGrams,
                                      'wastage'
                                    );
                                  }
                                } else {
                                  setBarcodeDataProperty(
                                    selectedProduct.wastageGrams,
                                    ''
                                  );
                                }
                              }}
                              name="enableWastage"
                            />
                          }
                          label="Enable Wastage"
                        />
                      </div>

                      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={enableNetWeight}
                              onChange={(e) => {
                                setEnableNetWeight(e.target.checked);
                                if (e.target.checked) {
                                  if (selectedProduct) {
                                    setBarcodeDataProperty(
                                      selectedProduct.netWeight,
                                      'netWeight'
                                    );
                                  }
                                } else {
                                  setBarcodeDataProperty(
                                    selectedProduct.netWeight,
                                    ''
                                  );
                                }
                              }}
                              name="enableNetWeight"
                            />
                          }
                          label="Enable Net Weight"
                        />
                      </div> */}

                      {/* <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={enableStoneWeight}
                              onChange={(e) => {
                                setEnableStoneWeight(e.target.checked);
                                if (selectedProduct) {
                                  setBarcodeDataProperty(
                                    selectedProduct.stoneWeight,
                                    'stoneWeight'
                                  );
                                }
                              }}
                              name="enableStoneWeight"
                            />
                          }
                          label="Enable Stone Weight"
                        />
                      </div> */}

                      {/* <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={enablePurity}
                              onChange={(e) => {
                                setEnablePurity(e.target.checked);
                                if (e.target.checked) {
                                  if (selectedProduct) {
                                    setBarcodeDataProperty(
                                      selectedProduct.purity,
                                      'purity'
                                    );
                                  }
                                } else {
                                  setBarcodeDataProperty(
                                    selectedProduct.purity,
                                    ''
                                  );
                                }
                              }}
                              name="enablePurity"
                            />
                          }
                          label="Enable Purity"
                        />
                      </div> */}

                      <div className="leftAlign">
                        <FormControl fullWidth>
                          <Typography
                            variant="h5"
                            className={classes.type}
                            required
                          >
                            No of Labels{' '}
                            <span style={{ color: '#EF5350' }}>*</span>
                          </Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            type="number"
                            value={label}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </div>

                      <MuiGrid
                        container
                        //justify="space-between"

                        style={{ margin: '0', padding: '0' }}
                      >
                        <MuiGrid
                          item
                          xs={12}
                          align="left"
                          style={{ paddingLeft: '0' }}
                        >
                          <Typography
                            variant="h6"
                            className={classes.type}
                            align="left"
                          >
                            Description
                          </Typography>
                          <TextField
                            style={{ width: '100%' }}
                            variant="outlined"
                            value={description}
                            onChange={(e) => {
                              setDescription(e.target.value);
                              setBarcodeDataProperty(
                                e.target.value,
                                'description'
                              );
                            }}
                          />
                        </MuiGrid>
                      </MuiGrid>
                    </>
                  ) : (
                    <>
                      <div className="leftAlign">
                        <FormControl fullWidth>
                          <Typography
                            variant="h5"
                            className={classes.type}
                            required
                          >
                            No of Labels{' '}
                            <span style={{ color: '#EF5350' }}>*</span>
                          </Typography>
                          <TextField
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            type="number"
                            value={label}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </div>

                      <MuiGrid
                        container
                        //justify="space-between"

                        style={{ margin: '0', padding: '0' }}
                      >
                        <MuiGrid
                          item
                          xs={12}
                          align="left"
                          style={{ paddingLeft: '0' }}
                        >
                          <Typography
                            variant="h6"
                            className={classes.type}
                            align="left"
                          >
                            Description
                          </Typography>
                          <TextField
                            style={{ width: '100%' }}
                            variant="outlined"
                            value={description}
                            onChange={(e) => {
                              setDescription(e.target.value);
                              setBarcodeDataProperty(
                                e.target.value,
                                'description'
                              );
                            }}
                          />
                        </MuiGrid>
                      </MuiGrid>
                    </>
                  )}
                </>
              )}

              <div style={{ textAlign: 'center', padding: 20 }}></div>
            </Paper>
          </div>
        </Col>

        <Col className={classes.contentCol} xs sm={6}>
          <Paper className={classes.paper} style={{ marginBottom: 8 }}>
            <Grid className={classes.headerContain}>
              <div>
                {/* <Typography className={classes.header} variant="inherit">
                  Customize your Barcode
                </Typography> */}
              </div>

              <div style={{ padding: '0px', display: 'flex' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={resetBarcodeListData}
                >
                  Reset
                </Button>
              </div>
            </Grid>

            <Box mt={1}>
              <div
                style={{
                  width: '100%',
                  height:
                    barcodeDataList && barcodeDataList.length < 6
                      ? '48vh'
                      : '93vh'
                }}
                className=" blue-theme"
              >
                <div
                  id="product-list-grid"
                  style={{ height: '100%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    onFirstDataRendered={onFirstDataRendered}
                    enableRangeSelection
                    paginationPageSize={10}
                    suppressMenuHide
                    rowData={barcodeDataList}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    pagination
                    headerHeight={40}
                    rowClassRules={rowClassRules}
                    onRowClicked={(e) => onRowClicked(e)}
                    frameworkComponents={{
                      tempaltePrintShareRenderer: TempaltePrintShareRenderer,
                      templateActionRenderer: TemplateActionRenderer
                    }}
                    overlayLoadingTemplate={
                      '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                    }
                  />
                </div>
              </div>
            </Box>
          </Paper>

          {/* ------------------------------------ BARCODE DISPLAY ------------------------------------------------- */}
          {labelType === 'withoutbarcode' ? (
            <Paper className={classes.barcodePaper}>
              <div className={classes.withoutBarcodeLabelDisplay}>
                <Typography variant="h5" className={classes.Header}>
                  {barcodeDisplayData.name ? barcodeDisplayData.name : 'Name'}
                </Typography>

                <Typography
                  variant="h6"
                  className={[classes.Header, classes.withoutBarcodAddress]}
                >
                  {barcodeDisplayData.line
                    ? barcodeDisplayData.line
                    : 'Address'}
                </Typography>

                <Typography variant="h6" className={classes.Header}>
                  {barcodeDisplayData.footer
                    ? barcodeDisplayData.footer
                    : 'Additional Text 1'}
                </Typography>

                <Typography variant="h6" className={classes.Header}>
                  {barcodeDisplayData.addtionalTextTwo
                    ? barcodeDisplayData.addtionalTextTwo
                    : 'Additional Text 2'}
                </Typography>
              </div>
              <div
                style={{ width: '100%', textAlign: 'center', display: 'none' }}
              >
                <svg ref={inputRef} />
              </div>
            </Paper>
          ) : (
            <>
              {sizeType === 'custom' && printType === 'label' && (
                <Paper className={classes.barcodePaper}>
                  <div
                    className="barcodeDiv"
                    style={{
                      width: `${customData.customWidth}px`,
                      height: `${customData.customHeight}px`
                    }}
                  >
                    <div
                      style={{
                        paddingLeft: `${customData.marginLeft}px`,
                        paddingRight: `${customData.marginRight}px`,
                        paddingTop: `${customData.marginTop}px`,
                        paddingBottom: `${customData.marginBottom}px`
                      }}
                    >
                      <div>
                        <Typography
                          style={{
                            fontSize:
                              sizeType === 'default'
                                ? barcodeDisplayData.headerVal === 'sale_price'
                                  ? '17px'
                                  : '14px'
                                : customData.headerFont
                                ? `${customData.headerFont}px`
                                : '14px',
                            fontWeight:
                              sizeType === 'custom'
                                ? customData.headerWeight
                                  ? 'bold'
                                  : 'unset'
                                : 'unset'
                          }}
                          className={classes.Header}
                        >
                          {barcodeDisplayData.header
                            ? barcodeDisplayData.header
                            : barcodeDataList.length > 0
                            ? ''
                            : 'Header'}
                        </Typography>

                        <div style={{ width: '100%', textAlign: 'center' }}>
                          <svg ref={inputRef} />
                        </div>

                        <Typography
                          style={{
                            fontSize:
                              sizeType === 'default'
                                ? barcodeDisplayData.lineVal === 'sale_price'
                                  ? '17px'
                                  : '14px'
                                : customData.additionalFont
                                ? `${customData.additionalFont}px`
                                : '14px',
                            marginTop: '-4px',
                            fontWeight:
                              sizeType === 'custom'
                                ? customData.additionalWeight
                                  ? 'bold'
                                  : 'unset'
                                : 'unset'
                          }}
                          className={classes.Header}
                        >
                          {barcodeData.line
                            ? barcodeData.line
                            : barcodeDataList.length > 0
                            ? ''
                            : 'Additional Text 1'}
                        </Typography>

                        <Typography
                          style={{
                            fontSize:
                              sizeType === 'default'
                                ? barcodeDisplayData.footerVal === 'sale_price'
                                  ? '17px'
                                  : '14px'
                                : customData.footerFont
                                ? `${customData.footerFont}px`
                                : '14px',
                            marginTop: '-6px',
                            fontWeight:
                              sizeType === 'custom'
                                ? customData.footerWeight
                                  ? 'bold'
                                  : 'unset'
                                : 'unset'
                          }}
                          className={classes.Header}
                        >
                          {barcodeDisplayData.footer
                            ? barcodeDisplayData.footer
                            : barcodeDataList.length > 0
                            ? ''
                            : 'Footer'}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </Paper>
              )}
              {sizeType === 'default' &&
                printType === 'label' &&
                sizeVal !== 2.3 &&
                sizeVal !== 2.4 && (
                  <Paper className={classes.barcodePaper}>
                    <Typography
                      style={{
                        fontSize:
                          barcodeDisplayData.headerVal === 'sale_price'
                            ? 17
                            : 16
                      }}
                      variant="h5"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.header
                        ? barcodeDisplayData.header
                        : barcodeDataList.length > 0
                        ? ''
                        : 'Header'}
                    </Typography>

                    <hr />

                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <svg ref={inputRef} />
                    </div>

                    <Typography
                      style={{
                        fontSize:
                          barcodeDisplayData.lineVal === 'sale_price' ? 17 : 14
                      }}
                      variant="h6"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.line
                        ? barcodeDisplayData.line
                        : barcodeDataList.length > 0
                        ? ''
                        : 'Additional Text'}
                    </Typography>

                    <Typography
                      style={{
                        fontSize:
                          barcodeDisplayData.footerVal === 'sale_price'
                            ? 17
                            : 14
                      }}
                      variant="h6"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.footer
                        ? barcodeDisplayData.footer
                        : barcodeDataList.length > 0
                        ? ''
                        : 'Footer'}
                    </Typography>
                    <div style={{ width: '100%' }}>
                      <Typography
                        style={{ fontSize: 12, textAlign: 'center' }}
                        variant="h1"
                        className={classes.Header}
                      >
                        {barcodeDisplayData.description
                          ? barcodeDisplayData.description
                          : barcodeDataList.length > 0
                          ? ''
                          : 'Description'}
                      </Typography>
                    </div>
                  </Paper>
                )}
              {sizeType === 'default' &&
                printType === 'label' &&
                sizeVal === 2.3 && (
                  <Paper
                    className={classes.barcodePaper}
                    style={{ textAlign: 'center' }}
                  >
                    <br />
                    <div
                      style={{
                        width: '100%',
                        textAlign: 'center',
                        display: 'none'
                      }}
                    >
                      <svg ref={inputRef} />
                    </div>

                    <div style={{ width: '100%', display: 'flex' }}>
                      <div
                        style={{
                          width: '80%',
                          textAlign: 'left',
                          display: 'flex'
                        }}
                      >
                        <div style={{ width: '50%', textAlign: 'left' }}>
                          <Typography
                            style={{
                              fontSize:
                                barcodeDisplayData.headerVal === 'sale_price'
                                  ? 17
                                  : 16
                            }}
                            variant="h5"
                            className={classes.Header}
                          >
                            {barcodeDisplayData.description
                              ? barcodeDisplayData.description
                              : barcodeDataList.description > 0
                              ? ''
                              : 'Description'}
                          </Typography>
                        </div>
                        <div
                          style={{
                            width: '30%',
                            textAlign: 'right',
                            margin: '0px'
                          }}
                        >
                          <Typography
                            style={{
                              fontSize: 12,
                              margin: '0px'
                            }}
                            variant="h6"
                            className={classes.Header}
                          >
                            {barcodeDisplayData.grossWeight
                              ? 'G WT: ' + barcodeDisplayData.grossWeight
                              : barcodeDataList.length > 0
                              ? ''
                              : 'G WT: 0'}
                          </Typography>

                          <Typography
                            style={{
                              fontSize: 12,
                              margin: '0px'
                            }}
                            variant="h6"
                            className={classes.Header}
                          >
                            {barcodeDisplayData.stoneWeight
                              ? 'L WT: ' + barcodeDisplayData.stoneWeight
                              : barcodeDataList.length > 0
                              ? ''
                              : 'L WT: 0'}
                          </Typography>
                          {/* <Typography
                            style={{
                              fontSize: 12,
                              margin: '0px'
                            }}
                            variant="h6"
                            className={classes.Header}
                          >
                            {barcodeDisplayData.stoneWeight
                              ? 'SW: ' + barcodeDisplayData.stoneWeight
                              : barcodeDataList.length > 0
                              ? ''
                              : 'SW: 0'}
                          </Typography> */}
                          <Typography
                            style={{
                              fontSize: 12,
                              margin: '0px'
                            }}
                            variant="h6"
                            className={classes.Header}
                          >
                            {barcodeDisplayData.netWeight
                              ? 'N WT: ' + barcodeDisplayData.netWeight
                              : barcodeDataList.length > 0
                              ? ''
                              : 'N WT: 0'}
                          </Typography>
                          <Typography
                            style={{
                              fontSize: 12,
                              margin: '0px'
                            }}
                            variant="h6"
                            className={classes.Header}
                          >
                            {barcodeDisplayData.purity
                              ? barcodeDisplayData.purity
                              : barcodeDataList.length > 0
                              ? ''
                              : 'Purity'}
                          </Typography>
                          <Typography
                            style={{
                              fontSize: 12,
                              margin: '0px'
                            }}
                            variant="h6"
                            className={classes.Header}
                          >
                            {barcodeDisplayData.hallmarkUniqueId
                              ? barcodeDisplayData.hallmarkUniqueId
                              : barcodeDataList.length > 0
                              ? ''
                              : 'HUID'}
                          </Typography>
                        </div>
                      </div>
                      <div style={{ width: '20%', display: 'flex' }}>
                        <QRCode
                          value={
                            barcodeDisplayData.barcode &&
                            barcodeDisplayData.barcode !== ''
                              ? barcodeDisplayData.barcode
                              : 'Item code'
                          }
                          size={45}
                        />
                      </div>
                    </div>
                  </Paper>
                )}
              {sizeType === 'default' &&
                printType === 'label' &&
                sizeVal === 2.4 && (
                  <Paper className={classes.barcodePaper}>
                    <Typography
                      style={{
                        fontSize:
                          barcodeDisplayData.headerVal === 'sale_price'
                            ? 17
                            : 16
                      }}
                      variant="h5"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.header
                        ? barcodeDisplayData.header
                        : barcodeDataList.length > 0
                        ? ''
                        : 'Header'}
                    </Typography>

                    <hr />

                    <div style={{ width: '100%', textAlign: 'center' }}>
                      <svg ref={inputRef} />
                    </div>

                    <Typography
                      style={{
                        fontSize: 12,
                        margin: '0px'
                      }}
                      variant="h6"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.grossWeight
                        ? 'G WT: ' + barcodeDisplayData.grossWeight
                        : barcodeDataList.length > 0
                        ? ''
                        : 'G WT: 0'}
                    </Typography>

                    <Typography
                      style={{
                        fontSize: 12,
                        margin: '0px'
                      }}
                      variant="h6"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.stoneWeight
                        ? 'L WT: ' + barcodeDisplayData.stoneWeight
                        : barcodeDataList.length > 0
                        ? ''
                        : 'L WT: 0'}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: 12,
                        margin: '0px'
                      }}
                      variant="h6"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.netWeight
                        ? 'N WT: ' + barcodeDisplayData.netWeight
                        : barcodeDataList.length > 0
                        ? ''
                        : 'N WT: 0'}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: 12,
                        margin: '0px'
                      }}
                      variant="h6"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.purity
                        ? barcodeDisplayData.purity
                        : barcodeDataList.length > 0
                        ? ''
                        : 'Purity'}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: 12,
                        margin: '0px'
                      }}
                      variant="h6"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.hallmarkUniqueId
                        ? barcodeDisplayData.hallmarkUniqueId
                        : barcodeDataList.length > 0
                        ? ''
                        : 'HUID'}
                    </Typography>
                  </Paper>
                )}
              {printType === 'regular' && (
                <Paper className={classes.barcodePaper}>
                  <Typography
                    style={{ fontSize: 10, textAlign: 'left' }}
                    variant="h1"
                    className={classes.Header}
                  >
                    {barcodeDisplayData.enablePurchasePriceCode ? (
                      <>
                        {barcodeDisplayData.enablePurchasePriceCode &&
                        barcodeDisplayData.purchasePriceCode
                          ? barcodeDisplayData.purchasePriceCode
                          : barcodeDataList.length > 0
                          ? ''
                          : 'Purchase Price Code'}
                      </>
                    ) : (
                      ''
                    )}
                  </Typography>
                  <Typography
                    style={{
                      fontSize:
                        barcodeDisplayData.headerVal === 'sale_price' ? 17 : 16
                    }}
                    variant="h5"
                    className={classes.Header}
                  >
                    {barcodeDisplayData.header
                      ? barcodeDisplayData.header
                      : barcodeDataList.length > 0
                      ? ''
                      : 'Header'}
                  </Typography>
                  <hr />

                  <div style={{ width: '100%', textAlign: 'center' }}>
                    <Typography
                      style={{ fontSize: 13 }}
                      variant="h3"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.line
                        ? barcodeDisplayData.line
                        : barcodeDataList.length > 0
                        ? ''
                        : 'Additional Text'}
                    </Typography>
                    <svg ref={inputRef} />
                  </div>

                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <div style={{ width: '50%', textAlign: 'left' }}>
                      <Typography
                        style={{ fontSize: 10 }}
                        variant="h3"
                        className={classes.Header}
                      >
                        {barcodeDisplayData.enableMrp ? (
                          <>
                            {barcodeDisplayData.enableMrp &&
                            barcodeDisplayData.mrpValue
                              ? 'MRP: ₹' + barcodeDisplayData.mrpValue
                              : barcodeDataList.length > 0
                              ? ''
                              : 'MRP ₹'}
                          </>
                        ) : (
                          ''
                        )}
                      </Typography>
                    </div>
                    <div style={{ width: '50%', textAlign: 'right' }}>
                      <Typography
                        style={{ fontSize: 10 }}
                        variant="h3"
                        className={classes.Header}
                      >
                        {barcodeDisplayData.enableOfferPrice ? (
                          <>
                            {barcodeDisplayData.enableOfferPrice &&
                            barcodeDisplayData.offerPriceValue
                              ? 'OFFER PRICE: ₹' +
                                barcodeDisplayData.offerPriceValue
                              : barcodeDataList.length > 0
                              ? ''
                              : 'OFFER PRICE ₹'}
                          </>
                        ) : (
                          ''
                        )}
                      </Typography>
                    </div>
                  </div>
                  <hr />
                  <div style={{ width: '100%' }}>
                    <Typography
                      style={{ fontSize: 12, textAlign: 'center' }}
                      variant="h1"
                      className={classes.Header}
                    >
                      {barcodeDisplayData.description
                        ? barcodeDisplayData.description
                        : barcodeDataList.length > 0
                        ? ''
                        : 'Description'}
                    </Typography>
                  </div>
                </Paper>
              )}
            </>
          )}
          <Paper className="preview-paper">
            <div style={{ textAlign: 'end', marginTop: 90 }}>
              {pages ? (
                <div
                  style={{ float: 'left', marginTop: 10, fontWeight: 'bold' }}
                >
                  {pages === 1
                    ? `${pages} page Required`
                    : `${pages} pages Required`}
                </div>
              ) : (
                ''
              )}
              {labelType === ''}
              <Button
                variant="contained"
                className={classes.previewBtn}
                disabled={
                  barcodeDataList.length > 0
                    ? //  &&
                      // selectedPrinter &&
                      // sizeFunction()
                      false
                    : true
                }
                onClick={() => {
                  localStorage.setItem(
                    'customBarcodeData',
                    JSON.stringify(customData)
                  );
                  handelPreviewBarcodeOpen(
                    sizeType,
                    sizeVal,
                    labelType,
                    printType
                  );
                }}
              >
                Preview and Print All
              </Button>
            </div>
          </Paper>
        </Col>
      </Grid>

      <PreviewModal
        printType={printType}
        size={sizeVal}
        sizeType={sizeType}
        customData={customData}
        barcodeDataList={barcodeDataList}
        labelType={labelType}
      />

      <Dialog
        open={barcodeLabelAlertDialog}
        onClose={handleBarcodeLabelAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="product-modal-title">
          Add New
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleBarcodeLabelAlertClose}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can only add one product while using Label Printing. Do you want
            to replace the Product added already
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleBarcodeLabelAlertClose}
            color="secondary"
            autoFocus
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleReplaceProduct();
              setLabel('');
              setProductName('');
            }}
            color="secondary"
            autoFocus
            variant="contained"
            style={{ color: 'white' }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Page - Pop Up */}
      <div>
        <Dialog open={openAddPage} fullWidth maxWidth={'md'}>
          <DialogTitle id="product-modal-title">
            Label Print - Add Page
            <IconButton
              aria-label="close"
              className="closeButton"
              onClick={handleAddPageClick}
            >
              <CancelRoundedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid
              item
              xs={12}
              sm={12}
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              <Grid container style={{ display: 'flex' }}>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  <FormControl
                    style={{ width: '100%' }}
                    sx={{ m: 1, width: 300, mt: 3 }}
                  >
                    <Typography variant="h5" className="headerText">
                      Additional Text 1
                    </Typography>
                    <Select
                      value={addPageAdditionalText1}
                      input={
                        <OutlinedInput
                          className={classes.outlinedInput}
                          size="small"
                        />
                      }
                      displayEmpty
                      onChange={(e) => {
                        setAddPageAdditionalText1(e.target.value);
                      }}
                    >
                      <MenuItem
                        value=""
                        onClick={() => {
                          setAddPageAdditionalText2('');
                        }}
                      >
                        <em>None</em>
                      </MenuItem>
                      {addtionalCustdetail.map((ele) => (
                        <MenuItem value={ele.val} onClick={() => {}}>
                          {ele.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  <FormControl
                    style={{ width: '100%' }}
                    sx={{ m: 1, width: 300, mt: 3 }}
                  >
                    <Typography variant="h5" className="headerText">
                      Additional Text 2
                    </Typography>
                    <Select
                      value={addPageAdditionalText2}
                      input={
                        <OutlinedInput
                          className={classes.outlinedInput}
                          size="small"
                        />
                      }
                      displayEmpty
                      onChange={(e) => {
                        setAddPageAdditionalText2(e.target.value);
                      }}
                    >
                      <MenuItem
                        value=""
                        onClick={() => {
                          setAddPageAdditionalText2('');
                        }}
                      >
                        <em>None</em>
                      </MenuItem>
                      {addtionalCustdetail.map((ele) => (
                        <MenuItem value={ele.val} onClick={() => {}}>
                          {ele.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <hr style={{ marginTop: '15px' }} />
            <Box mt={1}>
              <div
                style={{
                  width: '100%',
                  height:
                    barcodeDataList && barcodeDataList.length < 6
                      ? '48vh'
                      : '93vh'
                }}
                className=" blue-theme"
              >
                <div
                  id="product-list-grid"
                  style={{ height: '100%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    paginationPageSize={24}
                    suppressMenuHide
                    rowData={custVendList}
                    columnDefs={columnDefsAddPage}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    suppressPaginationPanel={true}
                    suppressScrollOnNewData={true}
                    headerHeight={40}
                    rowClassRules={rowClassRules}
                    overlayLoadingTemplate={
                      '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                    }
                  />
                  <div
                    style={{
                      display: 'flex',
                      float: 'right',
                      marginTop: '15px'
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
            <div
              style={{
                width: '78%',
                paddingLeft: '480px',
                display: 'flex',
                flexDirection: 'row'
              }}
            >
              <div
                className={classes.goToPage}
                style={{ alignSelf: 'center', marginRight: '10px' }}
              >
                Go To Page No.
              </div>
              <TextField
                style={{ width: '75px' }}
                variant="outlined"
                margin="dense"
                type="number"
                value={goToPage}
                InputProps={{
                  inputProps: {
                    min: 0
                  }
                }}
                onChange={(e) => setGoToCurrentPage(e.target.value)}
                onKeyPress={(event) => {
                  if (
                    event?.key === '-' ||
                    event?.key === '+' ||
                    event?.key === 'e'
                  ) {
                    event.preventDefault();
                  }
                }}
              />
            </div>
            <hr style={{ width: '100%' }} />
            <DialogContentText></DialogContentText>
          </DialogContent>
          <DialogActions>
            <div
              style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
            >
              <div style={{ width: '50%', textAlign: 'left' }}>
                <Typography>24 Labels (64 x 34 mm)</Typography>
              </div>
              <div style={{ width: '50%', textAlign: 'right' }}>
                <Button
                  color="secondary"
                  autoFocus
                  variant="contained"
                  style={{ color: 'white' }}
                  onClick={() => onAddPageClicked()}
                >
                  Add Page {currentPage}
                </Button>
              </div>
            </div>
          </DialogActions>
        </Dialog>
        <Dialog
          fullScreen={fullScreen}
          open={openErrorDialog}
          onClose={handleCloseErrorDialog}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* Edit Pop Up */}
      <div>
        <Dialog open={openEditLabel} fullWidth maxWidth={'md'}>
          <DialogTitle id="product-modal-title">
            Edit Label
            <IconButton
              aria-label="close"
              className="closeButton"
              onClick={handleBarcodeEditClose}
            >
              <CancelRoundedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div>
              <Typography variant="h6" className={classes.type} align="left">
                NAME:&nbsp; {barcodeData.name}
              </Typography>
              {barcodeData.isProduct ? (
                <>
                  <Typography
                    variant="h6"
                    className={classes.type}
                    align="left"
                  >
                    MRP:&nbsp; ₹{barcodeData.mrpValue}&nbsp;&nbsp;&nbsp; OFFER
                    PRICE:&nbsp; ₹{barcodeData.offerPriceValue}
                  </Typography>
                  <Typography
                    variant="h6"
                    className={classes.type}
                    align="left"
                  >
                    {barcodeData.additionalText2}
                  </Typography>

                  <MuiGrid container style={{ margin: '0', padding: '0' }}>
                    <MuiGrid
                      item
                      xs={12}
                      align="left"
                      style={{ paddingLeft: '0' }}
                    >
                      <Typography
                        variant="h6"
                        className={classes.type}
                        align="left"
                      >
                        Description
                      </Typography>
                      <TextField
                        style={{ width: '100%' }}
                        variant="outlined"
                        value={barcodeData.description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          setBarcodeDataProperty(e.target.value, 'description');
                        }}
                      />
                    </MuiGrid>
                  </MuiGrid>
                </>
              ) : (
                <>
                  <Typography
                    variant="h6"
                    className={classes.type}
                    align="left"
                  >
                    {barcodeData.footer}
                  </Typography>
                  <Typography
                    variant="h6"
                    className={classes.type}
                    align="left"
                  >
                    {barcodeData.additionalText2}
                  </Typography>
                  <MuiGrid container style={{ margin: '0', padding: '0' }}>
                    <MuiGrid
                      item
                      xs={12}
                      align="left"
                      style={{ paddingLeft: '0' }}
                    >
                      <Typography
                        variant="h6"
                        className={classes.type}
                        align="left"
                      >
                        Address
                      </Typography>
                      <TextField
                        style={{ width: '100%' }}
                        variant="outlined"
                        value={barcodeData.line}
                        onChange={(e) => {
                          setCustAddress(e.target.value);
                          setBarcodeDataProperty(e.target.value, 'line');
                        }}
                      />
                    </MuiGrid>
                  </MuiGrid>
                </>
              )}

              <FormControl>
                <Typography variant="h5" className={classes.type} required>
                  No of Labels <span style={{ color: '#EF5350' }}>*</span>
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  value={barcodeData.label}
                  error={barcodeData.label === ''}
                  helperText={
                    barcodeData.label === ''
                      ? 'Please enter No of labels to proceed further'
                      : ''
                  }
                  onChange={(e) => {
                    setBarcodeDataProperty(e.target.value, 'label');

                    const val = Math.ceil(e.target.value / sizeVal);
                    setPages(val);
                    if (labelType === 'withoutbarcode') {
                      setBarcodeDataProperty(1, 'printStartFrom');
                    }
                  }}
                />
              </FormControl>
            </div>
            <DialogContentText></DialogContentText>
          </DialogContent>
          <DialogActions>
            <div
              style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
            >
              <div style={{ width: '100%', textAlign: 'right' }}>
                <Button
                  color="secondary"
                  autoFocus
                  variant="contained"
                  style={{ color: 'white' }}
                  onClick={() => {
                    if (barcodeData.label !== '') {
                      updateBarcodeData();
                    }
                  }}
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogActions>
        </Dialog>
        <Dialog
          fullScreen={fullScreen}
          open={openErrorDialog}
          onClose={handleCloseErrorDialog}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      {/* Add Variations Page - Pop Up */}
      <div>
        <Dialog open={openVariationsAddPage} fullWidth maxWidth={'md'}>
          <DialogTitle id="product-modal-title">
            Product Variations - Add Page
            <IconButton
              aria-label="close"
              className="closeButton"
              onClick={handleVariationsAddPageClick}
            >
              <CancelRoundedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Grid
              item
              xs={12}
              sm={12}
              style={{ display: 'flex', flexDirection: 'row' }}
            >
              <Grid container style={{ display: 'flex' }}>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  style={{ display: 'flex', flexDirection: 'row' }}
                >
                  <FormControl
                    style={{ width: '100%' }}
                    sx={{ m: 1, width: 300, mt: 3 }}
                  >
                    <Typography variant="h5" className="headerText">
                      No Of Labels
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      value={addPageVariationsAdditionalText1}
                      error={addPageVariationsAdditionalText1 === ''}
                      helperText={
                        addPageVariationsAdditionalText1 === ''
                          ? 'Please enter No of labels to proceed further'
                          : ''
                      }
                      InputProps={{
                        inputProps: {
                          min: 0
                        }
                      }}
                      onChange={(e) =>
                        setAddPageVariationsAdditionalText1(e.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>

            <hr style={{ marginTop: '15px' }} />
            <Box mt={1}>
              <div
                style={{
                  width: '100%',
                  height:
                    barcodeDataList && barcodeDataList.length < 6
                      ? '48vh'
                      : '93vh'
                }}
                className=" blue-theme"
              >
                <div
                  id="product-list-grid"
                  style={{ height: '100%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    paginationPageSize={10}
                    suppressMenuHide
                    rowData={variationsList}
                    columnDefs={columnDefsVariationsAddPage}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    suppressPaginationPanel={false}
                    suppressScrollOnNewData={true}
                    headerHeight={40}
                    rowClassRules={rowClassRules}
                    overlayLoadingTemplate={
                      '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                    }
                  />
                </div>
              </div>
            </Box>
            <hr style={{ width: '100%' }} />
            <DialogContentText></DialogContentText>
          </DialogContent>
          <DialogActions>
            <div
              style={{ width: '100%', display: 'flex', flexDirection: 'row' }}
            >
              <div style={{ width: '50%', textAlign: 'left' }}>
                <Typography>{labelSize}</Typography>
              </div>
              <div style={{ width: '50%', textAlign: 'right' }}>
                <Button
                  color="secondary"
                  autoFocus
                  variant="contained"
                  style={{ color: 'white' }}
                  onClick={() => {
                    if (addPageVariationsAdditionalText1 !== '') {
                      onVariationsAddPageClicked();
                    }
                  }}
                >
                  Add
                </Button>
              </div>
            </div>
          </DialogActions>
        </Dialog>
        <Dialog
          fullScreen={fullScreen}
          open={openErrorDialog}
          onClose={handleCloseErrorDialog}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>{errorMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Page>
  );
};

export default InjectObserver(BarcodePrinter);