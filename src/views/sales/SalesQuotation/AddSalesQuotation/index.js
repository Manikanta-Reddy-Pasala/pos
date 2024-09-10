import React, { forwardRef, useState, useEffect, useRef } from 'react';

import {
  Cancel,
  DeleteOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@material-ui/icons';
import {
  Slide,
  Button,
  Dialog,
  Grid,
  Input,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  FormControlLabel,
  TextField,
  Checkbox,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  makeStyles,
  DialogTitle,
  InputAdornment,
  DialogActions,
  DialogContent,
  DialogContentText,
  useMediaQuery,
  useTheme,
  Select,
  MenuItem,
  Collapse,
  Box
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import * as Db from '../../../../RxDb/Database/Database';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import injectWithObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import styles from '../style';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import CustomerModal from 'src/views/customers/modal/AddCustomer';
import plus from '../../../../icons/plus.png';
import prodPlus from '../../../../icons/prod_plus.png';
import { salesRefs } from '../../../../components/Refs/SalesRefs';
import QuotationBatchListModal from 'src/components/modal/QuotationBatchListModal';
import * as Bd from '../../../../components/SelectedBusiness';
import moment from 'moment';
import Loader from 'react-js-loader';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getCustomerAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import SaleQuotationAddressListModal from 'src/components/modal/AddressListModal/SaleQuotationAddressListModal';
import getStateList from 'src/components/StateList';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
import SaleQuotationSerialListModal from 'src/components/modal/SaleQuotationSerialListModal';
import { getCustomerName } from 'src/names/constants';
import SaleQuotationProductDetails from './SaleQuotationProductDetails';
import { FileUpload } from 'src/components/common/FileUpload';

var dateFormat = require('dateformat');

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useInnerStyles = makeStyles((theme) => ({
  headerFooterWrapper: {
    /* padding: '10px', */
    margin: 0
  },
  tableForm: {
    padding: '10px 6px'
  },
  addButton: {
    padding: '8px 20px'
  },
  classData: {
    height: '40px'
  },
  formWrapper: {
    marginBottom: 35,
    '& .total-wrapper-form': {
      '&.total-payment': {
        '& input': {
          fontSize: 22,
          fontWeight: 500,
          height: 40
        }
      },
      '&.balance-payment': {
        '& input': {
          color: '#f44336'
        }
      },
      '& input': {
        padding: '6px 10px',
        textAlign: 'right'
      }
    }
  },
  total_design: {
    marginBottom: '13px !important',
    background: '#4A83FB',
    borderBottomLeftRadius: '20px',
    borderTopLeftRadius: '20px',
    padding: '6px 0px 5px 12px',
    color: 'white'
  },
  total_val: {
    marginTop: '21px',
    border: '3px solid #4A83FB'
  },
  formpadding: {
    padding: '0px 1rem',
    '& .formLabel': {
      position: 'relative',
      top: 15
    }
  },
  Templecontent: {
    position: 'absolute',
    top: '30%',
    bottom: '135px',
    left: '0px',
    right: '0px',
    overflow: 'auto',
    '@media (max-width: 1500px)': {
      top: '32%'
    }
  },
  content: {
    position: 'absolute',
    top: '60px',
    bottom: '200px',
    left: '0px',
    right: '0px',
    overflow: 'auto',
    '@media (max-width: 1500px)': {
      top: '8%'
    }
  },
  prcnt: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 'medium'
  },
  ProdListbox: {
    minWidth: '38%',
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
  PlaceOfsupplyListbox: {
    // minWidth: '30%',
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
  listbox: {
    minWidth: '30%',
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
  input: {
    width: '70%'
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  outlinedInput: {
    width: '70%',
    marginTop: '8px',
    marginBottom: '4px'
  },
  place_supply: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '20%',
    marginLeft: '12px'
  },

  addCustomerBtn: {
    '&:focus': {
      border: '1px solid'
    }
  },
  liBtn: {
    width: '100%',
    padding: '7px 8px',
    textTransform: 'none',
    fontWeight: '300',
    fontSize: 'small',
    '&:focus': {
      background: '#ededed',
      outline: 0,
      border: 0,
      fontWeight: 'bold'
    }
  },
  selectOptn: {
    minWidth: '85%',
    maxWidth: '88%',
    background: 'white'
  },
  fontSizesmall: {
    fontSize: 'small'
  },
  multiSelectOption: {
    maxWidth: '20px !important',
    fontSize: 'small'
  },
  BillTypeListbox: {
    minWidth: '11%',
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
  billTypeTextField: {
    // marginTop: '18%',
    width: '87%',
    marginLeft: '13px'
  },
  row2Settings: {
    position: 'absolute',
    top: '60px',
    bottom: '50px',
    left: '0px',
    right: '0px',
    overflow: 'auto'
    /*  '@media (max-width: 1500px)': {
      top: '5%' 
    }*/
  },
  bottomFields: {
    color: 'black',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  footerSide: {
    paddingLeft: '1%',
    borderRight: '3px solid #fff'
  },
  fSize: {
    fontSize: '14px',
    fontWeight: 'bold'
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

const AddSalesQuotationInvoice = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  const inputRef = useRef([]);
  const store = useStore();
  const theme = useTheme();

  const {
    saleDetails,
    items,
    OpenAddsalesQuotationInvoice,
    selectedProduct,
    selectedIndex,
    FocusLastIndex,
    OpenQuotationBatchList,
    salesTxnEnableFieldsMap,
    taxSettingsData,
    isRestore,
    openSaleQuotationLoadingAlertMessage,
    openSaleQuotationErrorAlertMessage,
    descriptionCollapsibleMap,
    openAddressList,
    customerAddressList,
    isCGSTSGSTEnabledByPOS,
    sequenceNumberFailureAlert,
    OpenSaleQuotationSerialList,
    errorAlertMessage,
    openSaleErrorAlertMessage,
    openProductDetails,
    columnIndexMap,
    metalList
  } = toJS(store.SalesQuotationAddStore);

  const {
    setInvoiceDate,
    getSalesQuotationCount,
    getAmount,
    getTotalAmount,
    addNewItem,
    deleteItem,
    isUpdate,
    setItemBarcode,
    setMrp,
    setItemNameForRandomProduct,
    setQuantity,
    setDiscount,
    setDiscountAmount,
    setItemDiscount,
    setItemDiscountAmount,
    toggleRoundOff,
    saveData,
    saveDataAndNew,
    getRoundedAmount,
    closeDialog,
    selectProduct,
    setCustomerName,
    setCustomerId,
    setCustomer,
    setInvoiceRegularSetting,
    setInvoiceThermalSetting,
    setPackingCharge,
    setShippingCharge,
    setEditTable,
    setFocusLastIndex,
    setCGST,
    setSGST,
    setIGST,
    setCess,
    handleBatchListModalClose,
    setGrossWeight,
    setWastagePercentage,
    setWastageGrams,
    setNetWeight,
    setPurity,
    setItemHSN,
    setItemBatchNumber,
    setSalesTxnEnableFieldsMap,
    setTaxIncluded,
    setTaxSettingsData,
    setMakingCharge,
    setMakingChargeAmount,
    getTotalGrossWeight,
    getTotalWatage,
    getTotalNetWeight,
    setNotes,
    setMakingChargePerGramAmount,
    setMakingChargeIncluded,
    handleCloseSaleQuotationErrorAlertMessage,
    handleOpenSaleQuotationLoadingMessage,
    setRoundingConfiguration,
    setFreeQuantity,
    setItemUnit,
    setItemModelNo,
    setItemDescription,
    setItemDescriptionCollapsibleIndex,
    handleCloseAddressList,
    setItemPricePerGram,
    setItemStoneCharge,
    setItemStoneWeight,
    getTotalStoneWeight,
    setSerialOrImeiNo,
    setCGSTSGSTEnabledByPOS,
    handleCloseSequenceNumberFailureAlert,
    revalidateItemsTaxRate,
    resetCustomer,
    handleSerialListModalClose,
    handleCloseSaleErrorAlertMessage,
    setItemRate,
    setRateMetalList,
    setDiscountType,
    setDiscountPercentForAllItems,
    getTotalQuantity,
    setItemHallmarkCharge,
    setItemCertificationCharge,
    handleOpenProductDetails,
    setItemBrand,
    setFileUploadImageUrls,
    checkForTaxAndLoadUI
  } = store.SalesQuotationAddStore;

  const salesRefsValue = salesRefs();

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { setcurrentBalance } = store.PaymentInStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);
  const { handleCustomerModalOpenFromSales, resetCustomerFromSales } =
    store.CustomerStore;
  const { customerDialogOpen, customerFromSales } = toJS(store.CustomerStore);
  const { handleAddProductModalOpen } = store.ProductStore;

  const [rxdbSub, setRxdbSub] = useState([]);
  const [records, setRecords] = useState([]);

  const [Customerlist, setCustomerlist] = React.useState();
  const [product_name, setProductName] = React.useState();
  const [menuOpenStatus, setMenuOpenStatus] = React.useState(false);
  const [paymentMenuOpenStatus, setPaymentTypeMenuOpenStatus] =
    React.useState(false);
  const [openAlert, setAlertOpen] = React.useState(false);
  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [proceedOptn, setProceedOptn] = React.useState('save');
  const [openAmountAlert, setAmountAlert] = React.useState(false);
  const [openNoProductsAlert, setNoProductsAlert] = React.useState(false);
  const [customerNameWhileEditing, setCustomerNameWhileEditing] = useState('');
  const [productlist, setproductlist] = useState([]);
  const [openSaleMoreThanStockAlert, setSaleMoreThanStockAlert] =
    React.useState(false);
  const [saleMoreThanStockText, setsaleMoreThanStockText] = React.useState('');
  const [printerList, setPrinterList] = React.useState([]);
  const [isBarcodeFocus, setBarcodeFocus] = React.useState(true);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const [isJewellery, setIsJewellery] = React.useState(false);
  const [businessStateCode, setBusinessStateCode] = React.useState('');
  const [rowCount, setRowCount] = useState(0);

  const { getAuditSettingsData } = store.AuditSettingsStore;

  const [isSerialFocus, setSerialFocus] = React.useState(true);
  const selectRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(0);
  const { getTaxSettingsDetails } = store.TaxSettingsStore;

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  const handleAddCustomer = () => {
    handleCustomerModalOpenFromSales();
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    setAmountAlert(false);
  };

  const handleSaleMoreThanStockAlertClose = () => {
    setSaleMoreThanStockAlert(false);
  };

  const handleNoProductsAlertClose = () => {
    setNoProductsAlert(false);
  };

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };

  const handleAlertProceed = () => {
    if (proceedOptn === 'save') {
      saveDataClick(true);
    }
    if (proceedOptn === 'save_new') {
      saveAndNewClick(true);
    }
  };

  const deleteRow = (index) => {
    deleteItem(index);
  };

  const getCustomerList = async (value) => {
    setCustomerlist(await getCustomerAutoCompleteList(value));
  };

  const handleDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setInvoiceDate(date);
  };

  const onPrintAndSaveClicked = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      if (saleDetails.customer_name === '') {
        setCustomerName(customerNameWhileEditing);
      }

      setInvoiceRegularSetting(invoiceRegular);
      setInvoiceThermalSetting(invoiceThermal);

      setProceedOptn('save');
      setProductName('');
      setAlertOpen(false);
      setCustomerNameWhileEditing('');

      handleOpenSaleQuotationLoadingMessage();

      saveData(true)
        .then((data) => {
          console.log('data Inserted');

          getSalesQuotationCount();
        })
        .catch((err) => {
          console.log('Sale Quotation Data Insertion Failed - ', err);
        });
    }
  };

  const isProductsValid = async () => {
    let isProductsValid = true;
    let errorMessage = '';

    let auditSettings = await getAuditSettingsData();

    if (salesTxnEnableFieldsMap.get('enable_product_price') === true) {
      for (var i = 0; i < items.length; i++) {
        let item = items[i];

        if (
          item.amount === 0 &&
          item.qty === 0 &&
          item.mrp === 0 &&
          items.length > 1
        ) {
          continue;
        }

        let slNo = i + 1;
        let itemMessage =
          '<br /><b>Sl No: </b>' +
          slNo +
          '<br /><b>Product Name: </b>' +
          item.item_name +
          '<br />';
        let itemValid = true;
        if (
          (item.freeQty === 0 || item.freeQty === '') &&
          (item.qty === '' ||
            item.qty === 0 ||
            item.qty === undefined ||
            item.qty === null)
        ) {
          itemValid = false;
          itemMessage += 'Quantity should be greater than 0<br />';
        }
        if (
          item.mrp === '' ||
          item.mrp === 0 ||
          item.mrp === undefined ||
          item.mrp === null
        ) {
          itemValid = false;
          itemMessage += 'Price should be greater than 0<br />';
        }
        if (item.item_name === '') {
          itemValid = false;
          itemMessage += 'Product Name should be provided<br >';
        }
        if (item.hsn !== '') {
          if (
            item.hsn.length === 4 ||
            item.hsn.length === 6 ||
            item.hsn.length === 8
          ) {
            // do nothing
          } else {
            itemValid = false;
            itemMessage += 'HSN code length is not valid.\n';
          }
        }
        const taxUtilRes = await taxUtilityTxn.isTaxRateValid(
          parseFloat(item.cgst) + parseFloat(item.sgst) + parseFloat(item.igst),
          auditSettings
        );

        if (!taxUtilRes.isTaxRateValid) {
          itemValid = false;
          itemMessage += taxUtilRes.errorMessage;
        }
        if (!itemValid) {
          errorMessage += itemMessage;
        }
      }
    } else if (
      salesTxnEnableFieldsMap.get('enable_product_price_per_gram') === true
    ) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];

        if (item.amount === 0 && item.pricePerGram === 0 && items.length > 1) {
          continue;
        }

        let slNo = i + 1;
        let itemMessage =
          '<br /><b>Sl No: </b>' +
          slNo +
          '<br /><b>Product Name: </b>' +
          item.item_name +
          '<br />';
        let itemValid = true;
        if (
          item.pricePerGram === '' ||
          item.pricePerGram === 0 ||
          item.pricePerGram === undefined ||
          item.pricePerGram === null
        ) {
          itemValid = false;
          itemMessage += 'Price/g should be greater than 0<br />';
        }
        if (
          item.grossWeight === '' ||
          item.grossWeight === 0 ||
          item.grossWeight === '0' ||
          item.grossWeight === undefined ||
          item.grossWeight === null
        ) {
          itemValid = false;
          itemMessage += 'Gross weight should be provided<br />';
        }
        if (item.item_name === '') {
          itemValid = false;
          itemMessage += 'Product Name should be provided<br >';
        }
        if (item.hsn !== '') {
          if (
            item.hsn.length === 4 ||
            item.hsn.length === 6 ||
            item.hsn.length === 8
          ) {
            // do nothing
          } else {
            itemValid = false;
            itemMessage += 'HSN code length is not valid.\n';
          }
        }
        const taxUtilRes = await taxUtilityTxn.isTaxRateValid(
          parseFloat(item.cgst) + parseFloat(item.sgst) + parseFloat(item.igst),
          auditSettings
        );

        if (!taxUtilRes.isTaxRateValid) {
          itemValid = false;
          itemMessage += taxUtilRes.errorMessage;
        }
        if (!itemValid) {
          errorMessage += itemMessage;
        }
      }
    } else {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];

        if (
          item.amount === 0 &&
          item.makingChargePerGramAmount === 0 &&
          items.length > 1
        ) {
          continue;
        }

        let slNo = i + 1;
        let itemMessage =
          '<br /><b>Sl No: </b>' +
          slNo +
          '<br /><b>Product Name: </b>' +
          item.item_name +
          '<br />';
        let itemValid = true;
        if (
          item.makingChargePerGramAmount === '' ||
          item.makingChargePerGramAmount === 0 ||
          item.makingChargePerGramAmount === undefined ||
          item.makingChargePerGramAmount === null
        ) {
          itemValid = false;
          itemMessage += 'Making Charge Price should be greater than 0<br />';
        }
        if (item.item_name === '') {
          itemValid = false;
          itemMessage += 'Product Name should be provided<br >';
        }
        if (item.hsn !== '') {
          if (
            item.hsn.length === 4 ||
            item.hsn.length === 6 ||
            item.hsn.length === 8
          ) {
            // do nothing
          } else {
            itemValid = false;
            itemMessage += 'HSN code length is not valid.\n';
          }
        }
        if (item.netWeight === '') {
          itemValid = false;
          itemMessage += 'Net Weight should be provided<br >';
        }
        const taxUtilRes = await taxUtilityTxn.isTaxRateValid(
          parseFloat(item.cgst) + parseFloat(item.sgst) + parseFloat(item.igst),
          auditSettings
        );

        if (!taxUtilRes.isTaxRateValid) {
          itemValid = false;
          itemMessage += taxUtilRes.errorMessage;
        }
        if (!itemValid) {
          errorMessage += itemMessage;
        }
      }
    }

    if (errorMessage !== '') {
      setErrorAlertProductMessage(errorMessage);
      setErrorAlertProduct(true);
      isProductsValid = false;
    }

    return isProductsValid;
  };

  const handleCustomerClick = (customer) => {
    setCustomerName(customer.name);
    setCustomerId(customer.id);
    setCustomer(customer);
    setcurrentBalance(customer);

    setCustomerNameWhileEditing('');
    setEditTable(0, true, 1);
    setCustomerlist([]);
    checkForTaxAndLoadUI(true);
  };

  const handleAddRow = () => {
    setProductName('');
    addNewItem(false, true);
  };

  const setTaxIncludedCheckerBox = (index) => {
    setTaxIncluded(index);
  };

  const saveDataClick = async (val) => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      if (saleDetails.customer_name === '') {
        setCustomerName(customerNameWhileEditing);
      }

      setProceedOptn('save');
      setProductName('');
      setAlertOpen(false);
      setCustomerNameWhileEditing('');

      handleOpenSaleQuotationLoadingMessage();

      await saveData(false)
        .then((data) => {
          getSalesQuotationCount();
        })
        .catch((err) => {
          console.log('Sale Quotation Data Save Failed');
        });
    }
  };

  const saveAndNewClick = async (val) => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      if (saleDetails.customer_name === '') {
        setCustomerName(customerNameWhileEditing);
      }

      setProceedOptn('save_new');
      setProductName('');
      setCustomerNameWhileEditing('');
      setAlertOpen(false);

      handleOpenSaleQuotationLoadingMessage();
      saveDataAndNew(false)
        .then((data) => {
          console.log('data Inserted');

          getSalesQuotationCount();
        })
        .catch((err) => {
          console.log('Sale Quotation Data Save Failed');
        });
    }
  };

  const inputOnChange = (e, index, setFunction) => {
    setsaleMoreThanStockText('');
    e.persist();
    setFunction(index, e.target.value);

    let funcName = setFunction;

    if (funcName === 'setQuantity') {
      let productName = items[index].name;
      let stockQty = items[index].stockQty;

      if (e.target.value > stockQty) {
        setsaleMoreThanStockText(
          'Current stock availability of ' +
            { productName } +
            ' is ' +
            { stockQty } +
            ' only!'
        );
        setSaleMoreThanStockAlert(true);
      }
    }

    if (funcName === 'setItemBarcode') {
      setBarcodeFocus(true);
    }

    if (funcName === 'setSerialOrImeiNo') {
      setSerialFocus(true);
    }
  };

  const inputOnQtyChange = (e, index, setFunction) => {
    setsaleMoreThanStockText('');
    e.persist();
    setFunction(index, e.target.value);
    if (items[index]) {
      let productName = items[index].item_name;
      let stockQty = items[index].stockQty;

      if (
        e.target.value > stockQty &&
        transaction &&
        transaction.saleMoreThanStock
      ) {
        setsaleMoreThanStockText(
          'Current stock availability of ' +
            productName +
            ' is ' +
            stockQty +
            ' only!'
        );
        setSaleMoreThanStockAlert(true);
      }
    }
  };

  const checkCloseDialog = () => {
    if ((items.length === 1 && items[0].item_name === '') || isUpdate) {
      closeDialog();
    } else {
      setCloseDialogAlert(true);
    }
  };

  useEffect(() => {
    async function setPrinterData() {
      getCustomerList();
    }
    setIsJewellery(localStorage.getItem('isJewellery'));
    setPrinterData();
  }, []);

  useEffect(() => {
    setproductlist([]);
    setCustomerlist([]);

    /**
     * get all sale data
     */
    const initDB = async () => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const sub = db.sales
        .find({
          selector: {
            businessId: { $eq: businessData.businessId }
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }
          setRecords(data.map((item) => item.toJSON()));
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });

      setRxdbSub((prevState) => [...prevState, sub]);
    };
    initDB();
    return () => {
      rxdbSub.map((sub) => sub.unsubscribe());
      setCustomerlist(null);
    };
  }, []);

  useEffect(() => {
    if (customerFromSales.id) {
      handleCustomerClick(customerFromSales);
      resetCustomerFromSales();
    }
  }, [customerFromSales, resetCustomerFromSales]);

  useEffect(() => {
    async function fetchData() {
      await getTransactionData();
    }
    getInvoiceSettings(localStorage.getItem('businessId'));

    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }

    fetchData();
  }, []);

  useEffect(() => {
    setRoundingConfiguration(transaction.roundingConfiguration);
  }, [transaction.roundingConfiguration]);

  useEffect(() => {
    if (FocusLastIndex >= 0) {
      let next = inputRef.current[FocusLastIndex];
      if (next) {
        next.focus();
        setFocusLastIndex('');
      }
    }
  }, [FocusLastIndex, setFocusLastIndex]);

  useEffect(() => {
    async function fetchData() {
      let settings = await getTaxSettingsDetails();
      if (settings && settings.gstin && settings.gstin !== '') {
        let extractedStateCode = settings.gstin.slice(0, 2);
        setBusinessStateCode(extractedStateCode);
      }
    }

    setTimeout(() => {
      const countElement = document.querySelector('#myTable tr.row1');
      const count = countElement?.getElementsByTagName('th')?.length || 0;
      setRowCount(count);
    }, 3000);

    fetchData();
  }, []);

  const handleDialogKeyDown = (e) => {
    let charCode = String.fromCharCode(e.which).toLowerCase();

    if (
      (e.ctrlKey || e.metaKey) &&
      (charCode === 's' || charCode === 'p' || charCode === 'n')
    ) {
      e.preventDefault();

      if ((e.ctrlKey || e.metaKey) && charCode === 's') {
        if (
          (((saleDetails.order_type
            ? saleDetails.order_type.toUpperCase() === 'POS' ||
              saleDetails.order_type.toUpperCase() === 'KOT' ||
              saleDetails.order_type.toUpperCase() === 'INVOICE'
            : saleDetails.order_type) &&
            isUpdate) ||
            !isUpdate) &&
          !(saleDetails.isPartiallyReturned || saleDetails.isFullyReturned)
        ) {
          saveDataClick(false);
        }
      }
      if ((e.ctrlKey || e.metaKey) && charCode === 'p') {
        if (
          (((saleDetails.order_type
            ? saleDetails.order_type.toUpperCase() === 'POS' ||
              saleDetails.order_type.toUpperCase() === 'KOT' ||
              saleDetails.order_type.toUpperCase() === 'INVOICE'
            : saleDetails.order_type) &&
            isUpdate) ||
            !isUpdate) &&
          !(saleDetails.isPartiallyReturned || saleDetails.isFullyReturned) &&
          printerList &&
          printerList.length > 0
        ) {
          onPrintAndSaveClicked();
        }
      }

      if ((e.ctrlKey || e.metaKey) && charCode === 'n') {
        if (
          (((saleDetails.order_type
            ? saleDetails.order_type.toUpperCase() === 'POS' ||
              saleDetails.order_type.toUpperCase() === 'KOT' ||
              saleDetails.order_type.toUpperCase() === 'INVOICE'
            : saleDetails.order_type) &&
            isUpdate) ||
            !isUpdate) &&
          !(saleDetails.isPartiallyReturned || saleDetails.isFullyReturned)
        ) {
          saveAndNewClick(false);
        }
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectRef.current && selectRef.current.contains(event.target)) {
        console.log('Keydown event detected:', event.key);
        handleKeyDownEvent(
          event,
          selectedRow,
          columnIndexMap.get('TODAY RATE')
        );
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleKeyDownEvent = (event, rowIndex, colIndex) => {
    setSelectedRow(rowIndex);
    let nextElement;
    switch (event.key) {
      case 'Tab':
        event.preventDefault();
        nextElement = getNextElement(rowIndex, colIndex, 'Tab');
        break;
      case 'ArrowLeft':
        event.preventDefault();
        nextElement = getNextElement(rowIndex, colIndex, 'ArrowLeft');
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextElement = getNextElement(rowIndex, colIndex, 'ArrowRight');
        break;
      case 'ArrowUp':
        event.preventDefault();
        nextElement = getNextElement(rowIndex, colIndex, 'ArrowUp');
        break;
      case 'ArrowDown':
        event.preventDefault();
        nextElement = getNextElement(rowIndex, colIndex, 'ArrowDown');
        break;
      default:
        return;
    }
    if (nextElement) {
      nextElement.focus();
    }
  };

  const handleFilesUpload = (files) => {
    setFileUploadImageUrls(files)
  }

  const getNextElement = (rowIndex, colIndex, direction) => {
    const totalRows = items.length;
    const totalCols = columnIndexMap.size;
    let nextRow = rowIndex;
    let nextCol = colIndex;

    if (direction === 'Tab' || direction === 'ArrowRight') {
      nextCol = (nextCol + 1) % totalCols;
      if (nextCol === 0) {
        nextRow = (nextRow + 1) % totalRows;
      }
    } else if (direction === 'ArrowLeft') {
      nextCol = (nextCol - 1 + totalCols) % totalCols;
      if (nextCol === totalCols - 1) {
        nextRow = (nextRow - 1 + totalRows) % totalRows;
      }
    } else if (direction === 'ArrowUp') {
      nextRow = (nextRow - 1 + totalRows) % totalRows;
    } else if (direction === 'ArrowDown') {
      nextRow = (nextRow + 1) % totalRows;
    }

    return document.querySelector(`#cell-${nextRow}-${nextCol}`);
  };

  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: '#f6f8fa'
          }
        }}
        onEscapeKeyDown={checkCloseDialog}
        fullScreen
        open={OpenAddsalesQuotationInvoice}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
        onKeyDown={handleDialogKeyDown}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={11} className={innerClasses.alignCenter}>
                <Grid container className={classes.pageHeader}>
                  <Grid
                    item
                    xs={1}
                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                  >
                    <Button
                      aria-controls="simple-menu"
                      size="large"
                      variant="text"
                      className={classes.menubutton}
                    >
                      Quotation
                    </Button>
                  </Grid>

                  <Grid item xs={3} className={innerClasses.alignCenter}>
                    {isUpdate || !isUpdate ? (
                      <div>
                        <div>
                          <TextField
                            fullWidth
                            inputRef={(el) =>
                              (inputRef.current[
                                salesRefsValue.customerNameRefVal
                              ] = el)
                            }
                            onClick={(e) => {
                              setMenuOpenStatus(false);
                              setPaymentTypeMenuOpenStatus(false);
                            }}
                            placeholder="Select Customer"
                            value={
                              saleDetails.customer_name === ''
                                ? customerNameWhileEditing
                                : saleDetails.customer_name
                            }
                            onChange={(e) => {
                              if (e.target.value !== customerNameWhileEditing) {
                                setCustomerName('');
                                setCustomerId('');
                                resetCustomer();
                                setCGSTSGSTEnabledByPOS(true);
                                checkForTaxAndLoadUI(true);
                              }
                              getCustomerList(e.target.value);
                              setCustomerNameWhileEditing(e.target.value);
                            }}
                            className={innerClasses.input}
                            InputProps={{
                              disableUnderline: true,
                              classes: {
                                root: innerClasses.bootstrapRoot,
                                input: innerClasses.bootstrapInput
                              }
                            }}
                            InputLabelProps={{
                              shrink: true,
                              className: innerClasses.bootstrapFormLabel
                            }}
                          />
                        </div>
                        {Customerlist && Customerlist.length > 0 ? (
                          <>
                            <ul
                              className={innerClasses.listbox}
                              style={{ width: '20%' }}
                            >
                              <li>
                                <Grid container justify="space-between">
                                  {Customerlist.length === 1 &&
                                  Customerlist[0].name === '' ? (
                                    <Grid item></Grid>
                                  ) : (
                                    <Grid item>
                                      <Button
                                        size="small"
                                        style={{
                                          position: 'relative',
                                          fontSize: 12
                                        }}
                                      >
                                        Balance
                                      </Button>
                                    </Grid>
                                  )}
                                </Grid>
                              </li>
                              {Customerlist.length === 1 &&
                              Customerlist[0].name === '' ? (
                                <li></li>
                              ) : (
                                <div>
                                  {Customerlist.map((option, index) => (
                                    <li
                                      style={{ padding: 10, cursor: 'pointer' }}
                                      onClick={() => {
                                        handleCustomerClick(option);
                                      }}
                                      key={`${index}customer`}
                                    >
                                      <Button
                                        className={innerClasses.liBtn}
                                        disableRipple
                                        ref={(el) =>
                                          (inputRef.current[
                                            Number(
                                              salesRefsValue.customerNameRefVal +
                                                '0' +
                                                index +
                                                '0'
                                            )
                                          ] = el)
                                        }
                                      >
                                        <Grid
                                          container
                                          justifyContent="space-between"
                                        >
                                          <Grid item style={{ color: 'black' }}>
                                            {option.name}
                                            <br />
                                            {option.phoneNo}
                                            <br />
                                            <b>
                                              {' '}
                                              GSTIN:{' '}
                                              {option.gstNumber
                                                ? option.gstNumber
                                                : 'NA'}{' '}
                                            </b>
                                          </Grid>
                                          <Grid item>
                                            {' '}
                                            <span style={{ color: 'black' }}>
                                              {parseFloat(
                                                option.balance
                                              ).toFixed(2)}
                                            </span>
                                            {option.balance > 0 ? (
                                              option.balanceType ===
                                              'Payable' ? (
                                                <Arrowtopright fontSize="inherit" />
                                              ) : (
                                                <Arrowbottomleft fontSize="inherit" />
                                              )
                                            ) : (
                                              ''
                                            )}
                                          </Grid>
                                        </Grid>
                                      </Button>
                                    </li>
                                  ))}
                                </div>
                              )}
                            </ul>
                          </>
                        ) : null}
                        <CustomerModal open={customerDialogOpen} />
                      </div>
                    ) : (
                      <Input
                        readOnly
                        id="component-simple"
                        value={saleDetails.customer_name}
                        fullWidth
                      />
                    )}
                  </Grid>

                  {transaction.enableCustomer && (
                    <Grid
                      item
                      xs={2}
                      style={{
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        display: 'flex'
                      }}
                    >
                      <img
                        alt="Logo"
                        src={plus}
                        width="20px"
                        height="20px"
                        style={{ marginTop: '2px' }}
                      />
                      <Button
                        size="small"
                        ref={(el) =>
                          (inputRef.current[salesRefsValue.addCustomerBtnRef] =
                            el)
                        }
                        disableRipple
                        className={innerClasses.addCustomerBtn}
                        style={{
                          position: 'relative',
                          fontSize: 12,
                          '&:focus': {
                            border: '1px solid #F44336'
                          },
                          '&$focusVisible': {
                            border: '1px solid #F44336'
                          }
                        }}
                        color="secondary"
                        onClick={handleAddCustomer}
                      >
                        {'Add ' + getCustomerName()}
                      </Button>
                    </Grid>
                  )}

                  <Grid
                    item
                    xs={2}
                    style={{
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      display: 'flex',
                      marginLeft: '20px'
                    }}
                  >
                    <img
                      alt="Logo"
                      src={prodPlus}
                      width="20px"
                      height="20px"
                      style={{ marginTop: '2px' }}
                    />
                    <Button
                      size="small"
                      disableRipple
                      className={innerClasses.addCustomerBtn}
                      ref={(el) =>
                        (inputRef.current[salesRefsValue.addProductBtnRef] = el)
                      }
                      style={{
                        position: 'relative',
                        fontSize: 12,
                        color: '#9dcb6a'
                      }}
                      onClick={() => {
                        handleAddProductModalOpen();
                      }}
                    >
                      Add Product
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs={1}
                    style={{ textAlign: 'center' }}
                    className={innerClasses.alignCenter}
                  >
                    <Typography
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Invoice Date
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    style={{ textAlign: 'center' }}
                    className={innerClasses.alignCenter}
                  >
                    <TextField
                      fullWidth
                      variant="standard"
                      margin="dense"
                      type="date"
                      className="customTextField"
                      id="date-picker-inline"
                      inputRef={(el) => (inputRef.current[6] = el)}
                      value={saleDetails.invoice_date}
                      onChange={(event) => handleDateChange(event.target.value)}
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={1} style={{ textAlign: 'end' }}>
                {/* <IconButton>
                    <DateRangeRounded fontSize="inherit" />
                  </IconButton> */}
                {/* <IconButton
                    onClick={() => {
                      navigate('/app/settings', { replace: false });
                    }}
                  >
                    <Settings fontSize="inherit" />
                  </IconButton> */}
                <IconButton
                  onClick={checkCloseDialog}
                  ref={(el) =>
                    (inputRef.current[salesRefsValue.cancelBtnRef] = el)
                  }
                >
                  <Cancel fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {/* ------------------------------------INVOICE DETAILS ----------------------------------- */}

        {/* ------------------------------------PRODUCT TABLE-------------------------------------- */}

        <div className={innerClasses.content} style={{ bottom: '130px' }}>
          <Grid container className={innerClasses.headerFooterWrapper}></Grid>
          <TableContainer
            onClick={(e) => {
              setMenuOpenStatus(false);
              setPaymentTypeMenuOpenStatus(false);
            }}
          >
            <Table aria-label="simple table">
              <TableHead className={classes.addtablehead} id="myTable">
                <TableRow className="row1">
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    {'   '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    width={330}
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    <div className={innerClasses.centered}>
                      ITEM{' '}
                      <div
                        style={{
                          marginLeft: '10px',
                          marginTop: '6px',
                          color: '#f44336',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          handleOpenProductDetails();
                        }}
                      >
                        <Search />{' '}
                      </div>
                    </div>
                  </TableCell>

                  {isJewellery && metalList && metalList.length > 0 && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      TODAY's RATE{' '}
                    </TableCell>
                  )}

                  {/* HSN */}
                  {salesTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      HSN{' '}
                    </TableCell>
                  )}
                  {salesTxnEnableFieldsMap.get('enable_product_barcode') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      BARCODE{' '}
                    </TableCell>
                  )}

                  {/* Serial/IMEI No.  */}
                  {salesTxnEnableFieldsMap.get(
                    'enable_product_serial_imei'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Serial/IMEI No.{' '}
                    </TableCell>
                  )}

                  {/* Batch Number */}
                  {salesTxnEnableFieldsMap.get(
                    'enable_product_batch_number'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Batch No.{' '}
                    </TableCell>
                  )}

                  {/* *****Brand***** */}
                  {salesTxnEnableFieldsMap.get('enable_product_brand') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Brand{' '}
                    </TableCell>
                  )}

                  {/* *****Model Number***** */}
                  {salesTxnEnableFieldsMap.get('enable_product_model_no') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Model No{' '}
                    </TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_price') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      PRICE{' '}
                    </TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      PRICE/g{' '}
                    </TableCell>
                  )}

                  {/* Quantity */}
                  {salesTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      QTY{' '}
                    </TableCell>
                  )}

                  {/* ********Free Quantity******* */}
                  {salesTxnEnableFieldsMap.get(
                    'enable_product_free_quantity'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      FREE QTY{' '}
                    </TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_unit') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      UNIT{' '}
                    </TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_gross_weight') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        GROSS WEIGHT g{' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_stone_weight') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        STONE WEIGHT g{' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_net_weight') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        NET WEIGHT g{' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_wastage') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        WASTAGE{' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        MAKING CHARGE{' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        colSpan="1"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        MAKING CHARGE PER GRAM{' '}
                      </TableCell>
                    )}

                  {(salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    salesTxnEnableFieldsMap.get(
                      'enable_product_making_charge_per_gram'
                    )) && (
                    <TableCell
                      variant="head"
                      rowSpan="1"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      MC INCL{' '}
                    </TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_stone_charge') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        STONE CHARGE{' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_purity') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        PURITY{' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_hallmark_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        HALLMARK CHARGE{' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_certification_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        CERT CHARGE{' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_discount') && (
                    <TableCell
                      variant="head"
                      colSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      DISCOUNT{' '}
                    </TableCell>
                  )}
                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_product_cgst_sgst') &&
                    isCGSTSGSTEnabledByPOS === true && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        CGST{' '}
                      </TableCell>
                    )}
                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_product_cgst_sgst') &&
                    isCGSTSGSTEnabledByPOS === true && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        SGST{' '}
                      </TableCell>
                    )}
                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_product_igst') &&
                    isCGSTSGSTEnabledByPOS === false && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        IGST{' '}
                      </TableCell>
                    )}
                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_tax_included') && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        width={'10px'}
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        TAX INCLUDED{' '}
                      </TableCell>
                    )}
                  {salesTxnEnableFieldsMap.get('enable_product_cess') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      CESS{' '}
                    </TableCell>
                  )}
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    AMOUNT{' '}
                  </TableCell>
                </TableRow>
                <TableRow>
                  {salesTxnEnableFieldsMap.get('enable_product_wastage') &&
                    isJewellery === 'true' && (
                      <>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          %{' '}
                        </TableCell>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          grams{' '}
                        </TableCell>
                      </>
                    )}
                  {salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          %{' '}
                        </TableCell>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          ₹{' '}
                        </TableCell>
                      </>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) &&
                    isJewellery === 'true' && (
                      <>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          ₹{' '}
                        </TableCell>
                      </>
                    )}

                  {(salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    salesTxnEnableFieldsMap.get(
                      'enable_product_making_charge_per_gram'
                    )) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        {' '}
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_discount') && (
                    <>
                      <TableCell
                        variant="head"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        %{' '}
                      </TableCell>
                      <TableCell
                        variant="head"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        ₹{' '}
                      </TableCell>
                    </>
                  )}
                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_product_cgst_sgst') &&
                    isCGSTSGSTEnabledByPOS === true && (
                      <>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          %{' '}
                        </TableCell>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          ₹{' '}
                        </TableCell>
                      </>
                    )}
                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_product_cgst_sgst') &&
                    isCGSTSGSTEnabledByPOS === true && (
                      <>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          %{' '}
                        </TableCell>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          ₹{' '}
                        </TableCell>
                      </>
                    )}

                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_product_igst') &&
                    isCGSTSGSTEnabledByPOS === false && (
                      <>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          %{' '}
                        </TableCell>
                        <TableCell
                          variant="head"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          ₹{' '}
                        </TableCell>
                      </>
                    )}
                  <TableCell
                    variant="head"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    {' '}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items &&
                  items.length > 0 &&
                  items.map((item, idx) => (
                    <>
                      <EditTable key={idx + 1} index={idx}>
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {idx + 1}
                        </TableCell>

                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                          inputProps={{ border: 'none' }}
                        >
                          {item.isEdit && !item.item_name ? (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%'
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  width: '100%'
                                }}
                              >
                                <TextField
                                  variant={'outlined'}
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number(
                                        '' + salesRefsValue.productNameRef + idx
                                      )
                                    ] = el)
                                  }
                                  value={product_name}
                                  id={`cell-${idx}-${columnIndexMap.get(
                                    'ITEM'
                                  )}`}
                                  onKeyDown={(event) =>
                                    handleKeyDownEvent(
                                      event,
                                      idx,
                                      columnIndexMap.get('ITEM')
                                    )
                                  }
                                  autoFocus={isBarcodeFocus ? false : true}
                                  fullWidth
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                  onChange={(e) => {
                                    getProductList(e.target.value);
                                    setProductName(e.target.value);
                                  }}
                                />{' '}
                                {productlist.length > 0 ? (
                                  <div>
                                    <ul className={innerClasses.ProdListbox}>
                                      <li>
                                        <Button
                                          size="small"
                                          disableRipple
                                          style={{
                                            position: 'relative',
                                            fontSize: 12,
                                            width: '100%',
                                            cursor: 'not-allowed',
                                            fontWeight: 'bold'
                                          }}
                                        >
                                          <Grid
                                            container
                                            style={{ display: 'flex' }}
                                          >
                                            <Grid item xs={4}>
                                              <p>Name</p>
                                            </Grid>
                                            <Grid item xs={4}>
                                              <p> Sale Price</p>
                                            </Grid>

                                            {String(
                                              localStorage.getItem(
                                                'isJewellery'
                                              )
                                            ).toLowerCase() === 'true' ? (
                                              <Grid item xs={4}>
                                                <p> N Wt. </p>
                                              </Grid>
                                            ) : (
                                              <Grid item xs={4}>
                                                <p> Stock </p>
                                              </Grid>
                                            )}
                                          </Grid>
                                        </Button>
                                      </li>

                                      {productlist.map((option, index) => (
                                        <li
                                          key={index}
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => {
                                            setproductlist([]);

                                            selectProduct(option, idx);
                                            setProductName('');
                                            setBarcodeFocus(false);
                                            setSerialFocus(false);
                                          }}
                                        >
                                          <Button
                                            className={innerClasses.liBtn}
                                            disableRipple
                                            ref={(el) =>
                                              (inputRef.current[
                                                Number(
                                                  '' +
                                                    salesRefsValue.productNameRef +
                                                    idx +
                                                    '0' +
                                                    index
                                                )
                                              ] = el)
                                            }
                                          >
                                            <Grid
                                              container
                                              // justify="space-between"
                                              style={{ display: 'flex' }}
                                              className={classes.listitemGroup}
                                            >
                                              <Grid item xs={4}>
                                                <p>{option.name}</p>
                                              </Grid>
                                              <Grid item xs={4}>
                                                {''}
                                                <p className={classes.listitem}>
                                                  {option.salePrice
                                                    ? parseFloat(
                                                        option.salePrice
                                                      ).toFixed(2)
                                                    : 0}
                                                </p>
                                              </Grid>

                                              {String(
                                                localStorage.getItem(
                                                  'isJewellery'
                                                )
                                              ).toLowerCase() === 'true' ? (
                                                <Grid item xs={4}>
                                                  <p className={classes.credit}>
                                                    {parseFloat(
                                                      option.netWeight
                                                    ).toFixed(3)}
                                                  </p>
                                                </Grid>
                                              ) : (
                                                <Grid item xs={4}>
                                                  <p className={classes.credit}>
                                                    {option.stockQty}
                                                  </p>
                                                </Grid>
                                              )}
                                            </Grid>
                                          </Button>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ) : null}
                              </div>
                              {salesTxnEnableFieldsMap.get(
                                'enable_product_description'
                              ) && (
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={() =>
                                    setItemDescriptionCollapsibleIndex(
                                      idx,
                                      descriptionCollapsibleMap.get(idx)
                                        ? !descriptionCollapsibleMap.get(idx)
                                        : true
                                    )
                                  }
                                >
                                  {descriptionCollapsibleMap.get(idx) ? (
                                    <KeyboardArrowUp />
                                  ) : (
                                    <KeyboardArrowDown />
                                  )}
                                </IconButton>
                              )}
                            </div>
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: '100%'
                              }}
                            >
                              <TextField
                                variant={'standard'}
                                fullWidth
                                inputRef={(el) =>
                                  (inputRef.current[
                                    Number(
                                      '' + salesRefsValue.productNameRef + idx
                                    )
                                  ] = el)
                                }
                                value={item.item_name}
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                              {salesTxnEnableFieldsMap.get(
                                'enable_product_description'
                              ) && (
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={() =>
                                    setItemDescriptionCollapsibleIndex(
                                      idx,
                                      descriptionCollapsibleMap.get(idx)
                                        ? !descriptionCollapsibleMap.get(idx)
                                        : true
                                    )
                                  }
                                >
                                  {descriptionCollapsibleMap.get(idx) ? (
                                    <KeyboardArrowUp />
                                  ) : (
                                    <KeyboardArrowDown />
                                  )}
                                </IconButton>
                              )}
                            </div>
                          )}
                        </TableCell>

                        {/* ********Daily Rate******* */}
                        {isJewellery === 'true' && metalList && metalList.length > 0 && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              <>
                                {item.isEdit ? (
                                  <>
                                    {metalList && metalList.length > 0 && (
                                      <div ref={selectRef}>
                                        <Select
                                          value={item.dailyRate}
                                          fullWidth
                                          variant="outlined"
                                          margin="dense"
                                          style={{
                                            marginTop: '8px',
                                            marginBottom: '4px'
                                          }}
                                          className="customTextField"
                                        >
                                          {metalList.map((option, index) => (
                                            <MenuItem
                                              value={option.metal}
                                              name={option.metal}
                                              onClick={() => {
                                                setItemRate(
                                                  idx,
                                                  metalList[index].metal
                                                );
                                                setItemNameForRandomProduct(
                                                  idx,
                                                  product_name
                                                );
                                              }}
                                            >
                                              {option.metal}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  item.dailyRate
                                )}
                              </>
                            </TableCell>
                          </>
                        )}

                        {/* HSN */}
                        {salesTxnEnableFieldsMap.get('enable_product_hsn') && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <TextField
                                variant={'outlined'}
                                fullWidth
                                inputRef={(el) =>
                                  (inputRef.current[Number('5' + idx)] = el)
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setItemHSN)
                                }
                                value={item.hsn}
                                id={`cell-${idx}-${columnIndexMap.get('HSN')}`}
                                onKeyDown={(event) =>
                                  handleKeyDownEvent(
                                    event,
                                    idx,
                                    columnIndexMap.get('HSN')
                                  )
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              item.hsn
                            )}
                          </TableCell>
                        )}

                        {/* Barcode */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_barcode'
                        ) && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit ? (
                                <TextField
                                  variant={'outlined'}
                                  autoFocus={isBarcodeFocus ? true : false}
                                  fullWidth
                                  value={item.barcode}
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number(
                                        '' + salesRefsValue.barcodeRef + idx
                                      )
                                    ] = el)
                                  }
                                  id={`cell-${idx}-${columnIndexMap.get(
                                    'BARCODE'
                                  )}`}
                                  onKeyDown={(event) =>
                                    handleKeyDownEvent(
                                      event,
                                      idx,
                                      columnIndexMap.get('BARCODE')
                                    )
                                  }
                                  onChange={(e) =>
                                    inputOnChange(e, idx, setItemBarcode)
                                  }
                                  onClick={(e) => {
                                    setBarcodeFocus(true);
                                  }}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              ) : (
                                item.barcode
                              )}
                            </TableCell>
                          </>
                        )}

                        {/* Serial/IMEI No.  */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_serial_imei'
                        ) && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit ? (
                                <TextField
                                  variant={'outlined'}
                                  fullWidth
                                  autoFocus={isSerialFocus ? true : false}
                                  value={item.serialOrImeiNo}
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number(
                                        '' + salesRefsValue.serialNoRef + idx
                                      )
                                    ] = el)
                                  }
                                  id={`cell-${idx}-${columnIndexMap.get(
                                    'SERIAL'
                                  )}`}
                                  onKeyDown={(event) =>
                                    handleKeyDownEvent(
                                      event,
                                      idx,
                                      columnIndexMap.get('SERIAL')
                                    )
                                  }
                                  onClick={(e) => {
                                    setSerialFocus(true);
                                  }}
                                  onChange={(e) =>
                                    inputOnChange(e, idx, setSerialOrImeiNo)
                                  }
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              ) : (
                                item.serialOrImeiNo
                              )}
                            </TableCell>
                          </>
                        )}

                        {/* Batch Number */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_batch_number'
                        ) && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <TextField
                                variant={'outlined'}
                                fullWidth
                                inputRef={(el) =>
                                  (inputRef.current[Number('5' + idx)] = el)
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setItemBatchNumber)
                                }
                                value={item.batchNumber}
                                id={`cell-${idx}-${columnIndexMap.get(
                                  'BATCH'
                                )}`}
                                onKeyDown={(event) =>
                                  handleKeyDownEvent(
                                    event,
                                    idx,
                                    columnIndexMap.get('BATCH')
                                  )
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              item.batchNumber
                            )}
                          </TableCell>
                        )}

                        {/* Brand */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_brand'
                        ) && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <TextField
                                variant={'outlined'}
                                fullWidth
                                inputRef={(el) =>
                                  (inputRef.current[Number('5' + idx)] = el)
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setItemBrand)
                                }
                                value={item.brandName}
                                id={`cell-${idx}-${columnIndexMap.get(
                                  'BRAND'
                                )}`}
                                onKeyDown={(event) =>
                                  handleKeyDownEvent(
                                    event,
                                    idx,
                                    columnIndexMap.get('BRAND')
                                  )
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              item.brandName
                            )}
                          </TableCell>
                        )}

                        {/* Model Number */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_model_no'
                        ) && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <TextField
                                variant={'outlined'}
                                fullWidth
                                inputRef={(el) =>
                                  (inputRef.current[Number('5' + idx)] = el)
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setItemModelNo)
                                }
                                value={item.modelNo}
                                id={`cell-${idx}-${columnIndexMap.get(
                                  'MODEL NO'
                                )}`}
                                onKeyDown={(event) =>
                                  handleKeyDownEvent(
                                    event,
                                    idx,
                                    columnIndexMap.get('MODEL NO')
                                  )
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              item.modelNo
                            )}
                          </TableCell>
                        )}

                        {/* Price */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_price'
                        ) && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <TextField
                                variant={'outlined'}
                                fullWidth
                                value={item.mrp}
                                inputRef={(el) =>
                                  (inputRef.current[
                                    Number('' + salesRefsValue.mrpRef + idx)
                                  ] = el)
                                }
                                type="number"
                                onFocus={(e) =>
                                  item.mrp === 0 ? setMrp(idx, '') : ''
                                }
                                id={`cell-${idx}-${columnIndexMap.get(
                                  'PRICE'
                                )}`}
                                onKeyDown={(event) =>
                                  handleKeyDownEvent(
                                    event,
                                    idx,
                                    columnIndexMap.get('PRICE')
                                  )
                                }
                                onChange={(e) => {
                                  inputOnChange(e, idx, setMrp);
                                  setItemNameForRandomProduct(
                                    idx,
                                    product_name
                                  );
                                }}
                                InputProps={{
                                  inputProps: {
                                    min: 1
                                  },
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              parseFloat(item.mrp).toFixed(2)
                            )}
                          </TableCell>
                        )}

                        {/* Price per gram*/}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_price_per_gram'
                        ) && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <TextField
                                variant={'outlined'}
                                fullWidth
                                value={item.pricePerGram}
                                type="number"
                                onFocus={(e) =>
                                  item.pricePerGram === 0
                                    ? setItemPricePerGram(idx, '')
                                    : ''
                                }
                                id={`cell-${idx}-${columnIndexMap.get(
                                  'PRICE PER GRAM'
                                )}`}
                                onKeyDown={(event) =>
                                  handleKeyDownEvent(
                                    event,
                                    idx,
                                    columnIndexMap.get('PRICE PER GRAM')
                                  )
                                }
                                onChange={(e) => {
                                  inputOnChange(e, idx, setItemPricePerGram);
                                  setItemNameForRandomProduct(
                                    idx,
                                    product_name
                                  );
                                }}
                                InputProps={{
                                  inputProps: {
                                    min: 1
                                  },
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              parseFloat(item.pricePerGram)
                            )}
                          </TableCell>
                        )}

                        {/* Quantity */}
                        {salesTxnEnableFieldsMap.get('enable_product_qty') && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit ? (
                                <TextField
                                  variant={'outlined'}
                                  fullWidth
                                  value={item.qty}
                                  type="number"
                                  inputRef={(el) =>
                                    (inputRef.current[Number('9' + idx)] = el)
                                  }
                                  id={`cell-${idx}-${columnIndexMap.get(
                                    'QTY'
                                  )}`}
                                  onKeyDown={(event) =>
                                    handleKeyDownEvent(
                                      event,
                                      idx,
                                      columnIndexMap.get('QTY')
                                    )
                                  }
                                  onFocus={(e) =>
                                    item.qty === 0 ? setQuantity(idx, '') : ''
                                  }
                                  onChange={(e) => {
                                    if (
                                      e.target.value > 0 ||
                                      e.target.value === ''
                                    ) {
                                      inputOnQtyChange(e, idx, setQuantity);
                                    }
                                  }}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              ) : (
                                item.qty
                              )}{' '}
                            </TableCell>
                          </>
                        )}

                        {/* ********Free Quantity******* */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_free_quantity'
                        ) && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit ? (
                                <TextField
                                  variant={'outlined'}
                                  fullWidth
                                  value={item.freeQty}
                                  type="number"
                                  inputRef={(el) =>
                                    (inputRef.current[Number('9' + idx)] = el)
                                  }
                                  onFocus={(e) =>
                                    item.freeQty === 0
                                      ? setFreeQuantity(idx, '')
                                      : ''
                                  }
                                  id={`cell-${idx}-${columnIndexMap.get(
                                    'FREE QTY'
                                  )}`}
                                  onKeyDown={(event) =>
                                    handleKeyDownEvent(
                                      event,
                                      idx,
                                      columnIndexMap.get('FREE QTY')
                                    )
                                  }
                                  onChange={(e) => {
                                    if (
                                      e.target.value > 0 ||
                                      e.target.value === ''
                                    ) {
                                      if (
                                        e.target.value > 1 &&
                                        item.serialOrImeiNo !== '' &&
                                        item.serialOrImeiNo !== null &&
                                        item.serialOrImeiNo !== undefined
                                      ) {
                                        setErrorAlertProductMessage(
                                          'Serial Product cannot have more than 1 quantity'
                                        );
                                        setErrorAlertProduct(true);
                                        return;
                                      }
                                      inputOnQtyChange(e, idx, setFreeQuantity);
                                    }
                                  }}
                                  InputProps={{
                                    inputProps: {
                                      min: 0
                                    },
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              ) : (
                                item.freeQty
                              )}{' '}
                            </TableCell>
                          </>
                        )}

                        {/* ********Unit******* */}
                        {salesTxnEnableFieldsMap.get('enable_product_unit') && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              <>
                                {item.isEdit ? (
                                  <>
                                    {item.units && item.units.length > 0 ? (
                                      <>
                                        {item.qtyUnit === '' &&
                                          setItemUnit(idx, item.units[0])}
                                        <Select
                                          value={item.qtyUnit}
                                          fullWidth
                                          variant="outlined"
                                          margin="dense"
                                          style={{
                                            marginTop: '8px',
                                            marginBottom: '4px'
                                          }}
                                          className="customTextField"
                                        >
                                          {item.units.map((option, index) => (
                                            <MenuItem
                                              value={option}
                                              name={option}
                                              onClick={() => {
                                                setItemUnit(idx, option);
                                              }}
                                            >
                                              {option}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </>
                                    ) : (
                                      <TextField
                                        variant={'outlined'}
                                        fullWidth
                                        value={item.qtyUnit}
                                        inputRef={(el) =>
                                          (inputRef.current[Number('9' + idx)] =
                                            el)
                                        }
                                        onChange={(e) => {
                                          setItemUnit(idx, e.target.value);
                                        }}
                                        id={`cell-${idx}-${columnIndexMap.get(
                                          'UNIT'
                                        )}`}
                                        onKeyDown={(event) =>
                                          handleKeyDownEvent(
                                            event,
                                            idx,
                                            columnIndexMap.get('UNIT')
                                          )
                                        }
                                        InputProps={{
                                          inputProps: {
                                            min: 0
                                          },
                                          classes: {
                                            input: innerClasses.tableForm
                                          },
                                          disableUnderline: true
                                        }}
                                      />
                                    )}
                                  </>
                                ) : (
                                  item.qtyUnit
                                )}
                              </>
                            </TableCell>
                          </>
                        )}

                        {salesTxnEnableFieldsMap.get(
                          'enable_product_gross_weight'
                        ) &&
                          isJewellery === 'true' && (
                            <>
                              {/* Gross Weight Grams */}
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant={'outlined'}
                                    fullWidth
                                    value={item.grossWeight}
                                    type="number"
                                    inputRef={(el) =>
                                      (inputRef.current[Number('9' + idx)] = el)
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'GROSS WEIGHT'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('GROSS WEIGHT')
                                      )
                                    }
                                    onFocus={(e) =>
                                      item.grossWeight === 0
                                        ? setGrossWeight(idx, '')
                                        : ''
                                    }
                                    onChange={(e) =>
                                      inputOnChange(e, idx, setGrossWeight)
                                    }
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.grossWeight
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* Stone Weight */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_stone_weight'
                        ) &&
                          isJewellery === 'true' && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant={'outlined'}
                                    fullWidth
                                    value={item.stoneWeight}
                                    type="number"
                                    inputRef={(el) =>
                                      (inputRef.current[Number('9' + idx)] = el)
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'STONE WEIGHT'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('STONE WEIGHT')
                                      )
                                    }
                                    onFocus={(e) =>
                                      item.stoneWeight === 0
                                        ? setItemStoneWeight(idx, '')
                                        : ''
                                    }
                                    onChange={(e) => {
                                      inputOnChange(e, idx, setItemStoneWeight);
                                    }}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.stoneWeight
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* Net Weight */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_net_weight'
                        ) &&
                          isJewellery === 'true' && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant={'outlined'}
                                    fullWidth
                                    value={item.netWeight}
                                    type="number"
                                    inputRef={(el) =>
                                      (inputRef.current[Number('9' + idx)] = el)
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'NET WEIGHT'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('NET WEIGHT')
                                      )
                                    }
                                    onFocus={(e) =>
                                      item.netWeight === 0
                                        ? setNetWeight(idx, '')
                                        : ''
                                    }
                                    onChange={(e) => {
                                      inputOnChange(e, idx, setNetWeight);
                                      setItemNameForRandomProduct(
                                        idx,
                                        product_name
                                      );
                                    }}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.netWeight
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* Wastage Percentage */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_wastage'
                        ) &&
                          isJewellery === 'true' && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant="outlined"
                                    fullWidth
                                    value={item.wastagePercentage}
                                    inputRef={(el) =>
                                      (inputRef.current[Number('30' + idx)] =
                                        el)
                                    }
                                    type="number"
                                    onFocus={(e) =>
                                      item.wastagePercentage === 0
                                        ? setWastagePercentage(idx, '')
                                        : ''
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'WASTAGE PERCENT'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('WASTAGE PERCENT')
                                      )
                                    }
                                    onChange={(e) =>
                                      inputOnChange(
                                        e,
                                        idx,
                                        setWastagePercentage
                                      )
                                    }
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.wastagePercentage
                                )}{' '}
                              </TableCell>

                              {/* Wastage Grams */}
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant="outlined"
                                    fullWidth
                                    value={item.wastageGrams}
                                    inputRef={(el) =>
                                      (inputRef.current[Number('31' + idx)] =
                                        el)
                                    }
                                    type="number"
                                    onFocus={(e) =>
                                      item.wastageGrams === 0
                                        ? setWastageGrams(idx, '')
                                        : ''
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'WASTAGE GRAMS'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('WASTAGE GRAMS')
                                      )
                                    }
                                    onChange={(e) =>
                                      inputOnChange(e, idx, setWastageGrams)
                                    }
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.wastageGrams
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* Making Charge Percentage */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_making_charge'
                        ) &&
                          isJewellery === 'true' && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant="outlined"
                                    fullWidth
                                    value={item.makingChargePercent}
                                    inputRef={(el) =>
                                      (inputRef.current[Number('30' + idx)] =
                                        el)
                                    }
                                    type="number"
                                    onFocus={(e) =>
                                      item.makingChargePercent === 0
                                        ? setMakingCharge(idx, '')
                                        : ''
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'MC PERCENT'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('MC PERCENT')
                                      )
                                    }
                                    onChange={(e) =>
                                      inputOnChange(e, idx, setMakingCharge)
                                    }
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.makingChargePercent
                                )}{' '}
                              </TableCell>

                              {/* Making Charge Amount */}
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant="outlined"
                                    fullWidth
                                    value={item.makingChargeAmount}
                                    inputRef={(el) =>
                                      (inputRef.current[Number('31' + idx)] =
                                        el)
                                    }
                                    type="number"
                                    onFocus={(e) =>
                                      item.makingChargeAmount === 0
                                        ? setMakingChargeAmount(idx, '')
                                        : ''
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'MC GRAMS'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('MC GRAMS')
                                      )
                                    }
                                    onChange={(e) =>
                                      inputOnChange(
                                        e,
                                        idx,
                                        setMakingChargeAmount
                                      )
                                    }
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.makingChargeAmount
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* Making Charge per gram Amount */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_making_charge_per_gram'
                        ) &&
                          isJewellery === 'true' && (
                            <>
                              {/* Making Charge per gram Amount */}
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant="outlined"
                                    fullWidth
                                    value={item.makingChargePerGramAmount}
                                    inputRef={(el) =>
                                      (inputRef.current[Number('31' + idx)] =
                                        el)
                                    }
                                    type="number"
                                    onFocus={(e) =>
                                      item.makingChargePerGramAmount === 0
                                        ? setMakingChargePerGramAmount(idx, '')
                                        : ''
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'MC PER GRAM'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('MC PER GRAM')
                                      )
                                    }
                                    onChange={(e) =>
                                      inputOnChange(
                                        e,
                                        idx,
                                        setMakingChargePerGramAmount
                                      )
                                    }
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.makingChargePerGramAmount
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {(salesTxnEnableFieldsMap.get(
                          'enable_product_making_charge'
                        ) ||
                          salesTxnEnableFieldsMap.get(
                            'enable_product_making_charge_per_gram'
                          )) &&
                          isJewellery === 'true' && (
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              <Checkbox
                                checked={item.makingChargeIncluded}
                                onChange={(e) => {
                                  setMakingChargeIncluded(idx);
                                }}
                                id={`cell-${idx}-${columnIndexMap.get(
                                  'MC INCL'
                                )}`}
                                onKeyDown={(event) =>
                                  handleKeyDownEvent(
                                    event,
                                    idx,
                                    columnIndexMap.get('MC INCL')
                                  )
                                }
                                style={{ padding: '0px' }}
                              />
                            </TableCell>
                          )}

                        {/* Stone charge */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_stone_charge'
                        ) &&
                          isJewellery === 'true' && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant={'outlined'}
                                    fullWidth
                                    value={item.stoneCharge}
                                    onFocus={(e) =>
                                      item.stoneCharge === 0
                                        ? setItemStoneCharge(idx, '')
                                        : ''
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'STONE CHARGE'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('STONE CHARGE')
                                      )
                                    }
                                    onChange={(e) => {
                                      // if (e.target.value > 0 || e.target.value === '') {
                                      inputOnChange(e, idx, setItemStoneCharge);
                                      // }
                                    }}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.stoneCharge
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* Purity */}
                        {salesTxnEnableFieldsMap.get('enable_product_purity') &&
                          isJewellery === 'true' && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant={'outlined'}
                                    fullWidth
                                    value={item.purity}
                                    onFocus={(e) =>
                                      item.purity === 0
                                        ? setPurity(idx, '')
                                        : ''
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'PURITY'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('PURITY')
                                      )
                                    }
                                    onChange={(e) => {
                                      // if (e.target.value > 0 || e.target.value === '') {
                                      inputOnChange(e, idx, setPurity);
                                      // }
                                    }}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.purity
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* Hallmark charge */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_hallmark_charge'
                        ) &&
                          isJewellery === 'true' && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant={'outlined'}
                                    fullWidth
                                    value={item.hallmarkCharge}
                                    onFocus={(e) =>
                                      item.stoneCharge === 0
                                        ? setItemHallmarkCharge(idx, '')
                                        : ''
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'HALLMARK'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('HALLMARK')
                                      )
                                    }
                                    onChange={(e) => {
                                      // if (e.target.value > 0 || e.target.value === '') {
                                      inputOnChange(
                                        e,
                                        idx,
                                        setItemHallmarkCharge
                                      );
                                      // }
                                    }}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.hallmarkCharge
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* Certification charge */}
                        {salesTxnEnableFieldsMap.get(
                          'enable_product_certification_charge'
                        ) &&
                          isJewellery === 'true' && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <TextField
                                    variant={'outlined'}
                                    fullWidth
                                    value={item.certificationCharge}
                                    onFocus={(e) =>
                                      item.stoneCharge === 0
                                        ? setItemCertificationCharge(idx, '')
                                        : ''
                                    }
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'CERTIFICATION'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('CERTIFICATION')
                                      )
                                    }
                                    onChange={(e) => {
                                      // if (e.target.value > 0 || e.target.value === '') {
                                      inputOnChange(
                                        e,
                                        idx,
                                        setItemCertificationCharge
                                      );
                                      // }
                                    }}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.certificationCharge
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {salesTxnEnableFieldsMap.get(
                          'enable_product_discount'
                        ) && (
                          <>
                            {/* Discount Percentage*/}
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit ? (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  value={item.discount_percent}
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number(
                                        '' +
                                          salesRefsValue.productDiscountPercentRef +
                                          idx
                                      )
                                    ] = el)
                                  }
                                  type="number"
                                  onFocus={(e) =>
                                    item.discount_percent === 0
                                      ? setItemDiscount(idx, '')
                                      : ''
                                  }
                                  id={`cell-${idx}-${columnIndexMap.get(
                                    'DISC PERCENT'
                                  )}`}
                                  onKeyDown={(event) =>
                                    handleKeyDownEvent(
                                      event,
                                      idx,
                                      columnIndexMap.get('DISC PERCENT')
                                    )
                                  }
                                  onChange={(e) =>
                                    inputOnChange(e, idx, setItemDiscount)
                                  }
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              ) : (
                                item.discount_percent
                              )}{' '}
                            </TableCell>

                            {/* Discount Amount*/}
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit ? (
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  value={item.discount_amount_per_item}
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number(
                                        '' +
                                          salesRefsValue.productDiscountAmountRef +
                                          idx
                                      )
                                    ] = el)
                                  }
                                  type="number"
                                  onFocus={(e) =>
                                    item.discount_amount === 0
                                      ? setItemDiscountAmount(idx, '')
                                      : ''
                                  }
                                  id={`cell-${idx}-${columnIndexMap.get(
                                    'DISC AMOUNT'
                                  )}`}
                                  onKeyDown={(event) =>
                                    handleKeyDownEvent(
                                      event,
                                      idx,
                                      columnIndexMap.get('DISC AMOUNT')
                                    )
                                  }
                                  onChange={(e) =>
                                    inputOnChange(e, idx, setItemDiscountAmount)
                                  }
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              ) : (
                                item.discount_amount
                              )}{' '}
                            </TableCell>
                          </>
                        )}

                        {/* CGST Percentage*/}
                        {taxSettingsData.enableGst &&
                          salesTxnEnableFieldsMap.get(
                            'enable_product_cgst_sgst'
                          ) &&
                          isCGSTSGSTEnabledByPOS === true && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <div className={classes.wrapper}>
                                    <TextField
                                      variant={'outlined'}
                                      native
                                      inputRef={(el) =>
                                        (inputRef.current[
                                          Number(
                                            '' + salesRefsValue.cgstRef + idx
                                          )
                                        ] = el)
                                      }
                                      type="number"
                                      onFocus={(e) =>
                                        item.cgst === 0 ? setCGST(idx, '') : ''
                                      }
                                      id={`cell-${idx}-${columnIndexMap.get(
                                        'CGST'
                                      )}`}
                                      onKeyDown={(event) =>
                                        handleKeyDownEvent(
                                          event,
                                          idx,
                                          columnIndexMap.get('CGST')
                                        )
                                      }
                                      onChange={(e) =>
                                        inputOnChange(e, idx, setCGST)
                                      }
                                      value={item.cgst}
                                      InputProps={{
                                        classes: {
                                          input: innerClasses.tableForm
                                        },
                                        disableUnderline: true
                                      }}
                                    />
                                  </div>
                                ) : (
                                  item.cgst
                                )}
                              </TableCell>
                            </>
                          )}

                        {/* CGST Amount*/}
                        {taxSettingsData.enableGst &&
                          salesTxnEnableFieldsMap.get(
                            'enable_product_cgst_sgst'
                          ) &&
                          isCGSTSGSTEnabledByPOS === true && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                <div className={classes.wrapper}>
                                  <TextField
                                    variant={'outlined'}
                                    native="true"
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'CGST AMT'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('CGST AMT')
                                      )
                                    }
                                    value={parseFloat(item.cgst_amount).toFixed(
                                      2
                                    )}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                </div>
                              </TableCell>
                            </>
                          )}

                        {/* SGST Percentage*/}
                        {taxSettingsData.enableGst &&
                          salesTxnEnableFieldsMap.get(
                            'enable_product_cgst_sgst'
                          ) &&
                          isCGSTSGSTEnabledByPOS === true && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <div className={classes.wrapper}>
                                    <TextField
                                      inputRef={(el) =>
                                        (inputRef.current[
                                          Number(
                                            '' + salesRefsValue.sgstRef + idx
                                          )
                                        ] = el)
                                      }
                                      type="number"
                                      id={`cell-${idx}-${columnIndexMap.get(
                                        'SGST'
                                      )}`}
                                      onKeyDown={(event) =>
                                        handleKeyDownEvent(
                                          event,
                                          idx,
                                          columnIndexMap.get('SGST')
                                        )
                                      }
                                      variant={'outlined'}
                                      onChange={(e) =>
                                        inputOnChange(e, idx, setSGST)
                                      }
                                      onFocus={(e) =>
                                        item.sgst === 0 ? setSGST(idx, '') : ''
                                      }
                                      value={item.sgst}
                                      InputProps={{
                                        classes: {
                                          input: innerClasses.tableForm
                                        },
                                        disableUnderline: true
                                      }}
                                    />
                                  </div>
                                ) : (
                                  item.sgst
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* CGST Amount*/}
                        {taxSettingsData.enableGst &&
                          salesTxnEnableFieldsMap.get(
                            'enable_product_cgst_sgst'
                          ) &&
                          isCGSTSGSTEnabledByPOS === true && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                <div className={classes.wrapper}>
                                  <TextField
                                    variant={'outlined'}
                                    native="true"
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'SGST AMT'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('SGST AMT')
                                      )
                                    }
                                    value={parseFloat(item.sgst_amount).toFixed(
                                      2
                                    )}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                </div>
                              </TableCell>
                            </>
                          )}

                        {/* IGST Percentage*/}
                        {taxSettingsData.enableGst &&
                          salesTxnEnableFieldsMap.get('enable_product_igst') &&
                          isCGSTSGSTEnabledByPOS === false && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <div className={classes.wrapper}>
                                    <TextField
                                      variant={'outlined'}
                                      onChange={(e) =>
                                        inputOnChange(e, idx, setIGST)
                                      }
                                      value={item.igst}
                                      inputRef={(el) =>
                                        (inputRef.current[
                                          Number(
                                            '' + salesRefsValue.igstRef + idx
                                          )
                                        ] = el)
                                      }
                                      type="number"
                                      id={`cell-${idx}-${columnIndexMap.get(
                                        'IGST'
                                      )}`}
                                      onKeyDown={(event) =>
                                        handleKeyDownEvent(
                                          event,
                                          idx,
                                          columnIndexMap.get('IGST')
                                        )
                                      }
                                      onFocus={(e) =>
                                        item.igst === 0 ? setIGST(idx, '') : ''
                                      }
                                      InputProps={{
                                        classes: {
                                          input: innerClasses.tableForm
                                        },
                                        disableUnderline: true
                                      }}
                                    />
                                  </div>
                                ) : (
                                  item.igst
                                )}{' '}
                              </TableCell>

                              {/* IGST Amount*/}
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <div className={classes.wrapper}>
                                    <TextField
                                      variant={'outlined'}
                                      disabled="true"
                                      value={parseFloat(
                                        item.igst_amount
                                      ).toFixed(2)}
                                      id={`cell-${idx}-${columnIndexMap.get(
                                        'IGST AMT'
                                      )}`}
                                      onKeyDown={(event) =>
                                        handleKeyDownEvent(
                                          event,
                                          idx,
                                          columnIndexMap.get('IGST AMT')
                                        )
                                      }
                                      InputProps={{
                                        classes: {
                                          input: innerClasses.tableForm
                                        },
                                        disableUnderline: true
                                      }}
                                    />
                                  </div>
                                ) : (
                                  parseFloat(item.igst_amount).toFixed(2)
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                        {/* Tax Included */}
                        {taxSettingsData.enableGst &&
                          salesTxnEnableFieldsMap.get(
                            'enable_tax_included'
                          ) && (
                            <>
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                <Checkbox
                                  checked={item.taxIncluded}
                                  id={`cell-${idx}-${columnIndexMap.get(
                                    'TAX INC'
                                  )}`}
                                  onKeyDown={(event) =>
                                    handleKeyDownEvent(
                                      event,
                                      idx,
                                      columnIndexMap.get('TAX INC')
                                    )
                                  }
                                  onChange={(e) => {
                                    setTaxIncludedCheckerBox(idx);
                                  }}
                                  style={{ padding: '0px' }}
                                />
                              </TableCell>
                            </>
                          )}
                        {/* CESS */}
                        {salesTxnEnableFieldsMap.get('enable_product_cess') && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit ? (
                                <div className={classes.wrapper}>
                                  <TextField
                                    variant={'outlined'}
                                    onChange={(e) =>
                                      inputOnChange(e, idx, setCess)
                                    }
                                    value={item.cess}
                                    id={`cell-${idx}-${columnIndexMap.get(
                                      'CESS'
                                    )}`}
                                    onKeyDown={(event) =>
                                      handleKeyDownEvent(
                                        event,
                                        idx,
                                        columnIndexMap.get('CESS')
                                      )
                                    }
                                    inputRef={(el) =>
                                      (inputRef.current[
                                        Number(
                                          '' + salesRefsValue.cessRef + idx
                                        )
                                      ] = el)
                                    }
                                    onFocus={(e) =>
                                      item.cess === 0 ? setCess(idx, '') : ''
                                    }
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                </div>
                              ) : (
                                item.cess
                              )}{' '}
                            </TableCell>
                          </>
                        )}

                        {/* Amount */}
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <div className={classes.wrapper}>
                              <TextField
                                variant={'outlined'}
                                readOnly={true}
                                value={item.amount}
                                inputRef={(el) =>
                                  (inputRef.current[
                                    Number('' + salesRefsValue.amountRef + idx)
                                  ] = el)
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, getAmount)
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                                fullWidth
                              />
                              <Button
                                ref={(el) =>
                                  (inputRef.current[
                                    Number(
                                      '' + salesRefsValue.deleteBtnRef + idx
                                    )
                                  ] = el)
                                }
                                style={{
                                  padding: '0px',
                                  width: '100%'
                                }}
                              >
                                <DeleteOutlined
                                  color="secondary"
                                  onClick={() => deleteRow(idx)}
                                  style={{ fontSize: 'xx-large' }}
                                />
                              </Button>
                            </div>
                          ) : (
                            item.amount
                          )}
                        </TableCell>
                      </EditTable>

                      <TableRow>
                        <TableCell
                          style={{
                            paddingBottom: 0,
                            paddingTop: 0,
                            borderBottom: 'hidden'
                          }}
                          colSpan={10}
                        >
                          <Collapse
                            in={descriptionCollapsibleMap.get(idx)}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ margin: 1 }}>
                              <Table size="small" aria-label="purchases">
                                <TableBody>
                                  <TableRow>
                                    <TableCell
                                      variant="body"
                                      classes={{
                                        root: classes.tableCellBodyRoot
                                      }}
                                      colSpan={2}
                                      style={{ border: 'hidden' }}
                                    >
                                      <div className={classes.wrapper}>
                                        <TextField
                                          variant={'outlined'}
                                          onChange={(e) =>
                                            inputOnChange(
                                              e,
                                              idx,
                                              setItemDescription
                                            )
                                          }
                                          value={item.description}
                                          /* InputProps={{
                                            classes: {
                                              input: innerClasses.tableForm
                                            },
                                            disableUnderline: true
                                          }} */
                                          fullWidth
                                          label=""
                                          placeholder="Description"
                                        />
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                <TableRow className={classes.addRowWrapper}>
                  <TableCell colSpan={rowCount}></TableCell>
                  <TableCell colSpan={4}>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      alignItems="center"
                    >
                      <Grid item xs={6}>
                        <Typography className={innerClasses.bottomFields}>
                          Item Level Discount
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        xs={6}
                        style={{
                          border: '1px solid #e0e0e0',
                          paddingLeft: '10px'
                        }}
                        className={[classes.backgroundWhite]}
                      >
                        <Grid container direction="row" spacing={0}>
                          <Grid item xs={10}>
                            {isUpdate || !isUpdate ? (
                              <TextField
                                className="total-wrapper-form"
                                id="discount"
                                inputRef={(el) =>
                                  (inputRef.current[
                                    salesRefsValue.discountRef
                                  ] = el)
                                }
                                type="number"
                                autoComplete="off"
                                onFocus={(e) =>
                                  saleDetails.discount_percent === 0
                                    ? setDiscountPercentForAllItems('')
                                    : ''
                                }
                                InputProps={{ disableUnderline: true }}
                                onChange={(e) =>
                                  setDiscountPercentForAllItems(e.target.value)
                                }
                                value={saleDetails.discountPercentForAllItems}
                              />
                            ) : (
                              <TextField
                                className="total-wrapper-form"
                                id="discount"
                                InputProps={{
                                  inputProps: {
                                    min: 0
                                  },
                                  disableUnderline: true
                                }}
                                value={saleDetails.discountPercentForAllItems}
                              />
                            )}
                          </Grid>
                          <Grid item xs={2} className={innerClasses.prcnt}>
                            %
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
                <TableRow className={classes.addRowWrapper}>
                  <TableCell colSpan="2">
                    {isUpdate || !isUpdate ? (
                      <Button
                        variant="outlined"
                        size="small"
                        ref={(el) =>
                          (inputRef.current[salesRefsValue.addRowRef] = el)
                        }
                        onClick={handleAddRow}
                        className={innerClasses.addButton}
                      >
                        Add Row{' '}
                      </Button>
                    ) : (
                      ''
                    )}
                  </TableCell>

                  {isJewellery && metalList && metalList.length > 0 && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_barcode') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {/* Serial/IMEI No.  */}
                  {salesTxnEnableFieldsMap.get(
                    'enable_product_serial_imei'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Batch Number */}
                  {salesTxnEnableFieldsMap.get(
                    'enable_product_batch_number'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Brand */}
                  {salesTxnEnableFieldsMap.get('enable_product_brand') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {/* Model Number */}
                  {salesTxnEnableFieldsMap.get('enable_product_model_no') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_price') && (
                    <TableCell colSpan="1">
                      <Typography
                        style={{
                          float: 'right',
                          position: 'relative'
                        }}
                        variant="span"
                        component="span"
                      >
                        Total{' '}
                      </Typography>
                    </TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell colSpan="1" style={{ textAlign: 'center' }}>
                      {getTotalQuantity()}
                    </TableCell>
                  )}

                  {/* ********Free Quantity******* */}
                  {salesTxnEnableFieldsMap.get(
                    'enable_product_free_quantity'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* ********Unit******* */}
                  {salesTxnEnableFieldsMap.get('enable_product_unit') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_gross_weight') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalGrossWeight}
                          {' gms'}
                        </Typography>
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_stone_weight') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalStoneWeight}
                          {' gms'}
                        </Typography>
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_net_weight') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalNetWeight}
                          {' gms'}
                        </Typography>
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_wastage') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="2" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalWatage}
                          {' gms'}
                        </Typography>
                      </TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="2"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="1"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {(salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    salesTxnEnableFieldsMap.get(
                      'enable_product_making_charge_per_gram'
                    )) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="1"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_stone_charge') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_purity') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_hallmark_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_certification_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_discount') && (
                    <TableCell colSpan="2"></TableCell>
                  )}
                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_product_cgst_sgst') &&
                    isCGSTSGSTEnabledByPOS === true && (
                      <TableCell colSpan="4"></TableCell>
                    )}
                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_product_igst') &&
                    isCGSTSGSTEnabledByPOS === false && (
                      <TableCell colSpan="2"></TableCell>
                    )}
                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_tax_included') && (
                      <TableCell colSpan="1"></TableCell>
                    )}
                  {salesTxnEnableFieldsMap.get('enable_product_cess') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  <TableCell colSpan="2" style={{ textAlign: 'center' }}>
                    <Typography
                      style={{
                        float: 'center',
                        position: 'relative'
                      }}
                      variant="span"
                      component="span"
                    >
                      {saleDetails.sub_total}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ width: '100%' }}>
            {salesTxnEnableFieldsMap.get('enable_bill_notes') ? (
              <Grid
                item
                xs={12}
                style={{
                  backgroundColor: '#EBEBEB',
                  padding: '10px 5px 10px 5px'
                }}
              >
                <TextField
                  id="outlined-textarea"
                  label="Notes"
                  placeholder="Notes"
                  multiline
                  rows={2}
                  maxRows={2}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e2e2'
                  }}
                  fullWidth
                  fontSize="6"
                  onChange={(e) => setNotes(e.target.value)}
                  value={saleDetails.notes}
                ></TextField>
              </Grid>
            ) : (
              <Grid
                item
                xs={12}
                style={{
                  backgroundColor: '#EBEBEB',
                  padding: '10px 5px 10px 5px'
                }}
              >
                <TextField
                  multiline
                  rows={2}
                  maxRows={2}
                  style={{
                    backgroundColor: '#fff',
                    border: '1px solid #e2e2e2'
                  }}
                  fullWidth
                  fontSize="6"
                  disabled
                  InputProps={{ disableUnderline: true }}
                ></TextField>
              </Grid>
            )}
          </div>
        </div>
        {/*------------------------------------- Dialog Footer----------------------------------- */}
        <div className={classes.footer} style={{ height: '190px' }}>
          <Grid item xs={12}>
            <FileUpload onFilesUpload={handleFilesUpload} uploadedFiles={saleDetails.imageUrls} />
          </Grid>
          <Grid
            container
            justify="space-between"
            className={[classes.root, classes.paymentTypeWrap]}
          >
            <Grid item xs={6}>
              <Grid
                container
                direction="row"
                spacing={0}
                alignItems="center"
                style={{ marginTop: '7px' }}
              >
                {salesTxnEnableFieldsMap.get('enable_package_charge') ? (
                  <>
                    <Grid
                      item
                      xs={12}
                      sm={2}
                      className={[innerClasses.formWrapper]}
                    >
                      <Typography className={innerClasses.bottomFields}>
                        Packing Charge
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper,
                        innerClasses.footerSide
                      ]}
                      style={{ marginLeft: '3px' }}
                    >
                      <TextField
                        className="total-wrapper-form"
                        id="Packing-charge"
                        style={{ marginLeft: '3px' }}
                        inputRef={(el) =>
                          (inputRef.current[salesRefsValue.packingChargeRef] =
                            el)
                        }
                        autoComplete="off"
                        type="number"
                        onFocus={(e) =>
                          saleDetails.packing_charge === 0
                            ? setPackingCharge('')
                            : ''
                        }
                        onChange={(e) => {
                          setPackingCharge(e.target.value ? e.target.value : 0);
                        }}
                        value={saleDetails.packing_charge}
                        InputProps={{
                          inputProps: {
                            min: 0
                          },
                          disableUnderline: true,
                          startAdornment: (
                            <InputAdornment position="end">₹</InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12} sm={5} />
                )}
                <Grid xs={1} item></Grid>
                {salesTxnEnableFieldsMap.get('enable_shipping_charge') ? (
                  <>
                    <Grid
                      item
                      xs={12}
                      sm={2}
                      className={innerClasses.formWrapper}
                    >
                      <Typography className={innerClasses.bottomFields}>
                        Shipping Charge
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper,
                        innerClasses.footerSide
                      ]}
                      style={{ marginLeft: '8px' }}
                    >
                      <TextField
                        className="total-wrapper-form"
                        style={{ marginLeft: '3px' }}
                        inputRef={(el) =>
                          (inputRef.current[salesRefsValue.shippingChargeRef] =
                            el)
                        }
                        type="number"
                        onFocus={(e) =>
                          saleDetails.shipping_charge === 0
                            ? setShippingCharge('')
                            : ''
                        }
                        onChange={(e) =>
                          setShippingCharge(e.target.value ? e.target.value : 0)
                        }
                        value={saleDetails.shipping_charge}
                        InputProps={{
                          inputProps: {
                            min: 0
                          },
                          disableUnderline: true,
                          startAdornment: (
                            <InputAdornment position="end">₹</InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12} sm={5} />
                )}
              </Grid>
            </Grid>

            <Grid item xs={3}>
              {salesTxnEnableFieldsMap.get('enable_bill_discount') && (
                <>
                  <Grid
                    container
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    style={{ marginTop: '7px' }}
                  >
                    <Grid item xs={3} className={innerClasses.formWrapper}>
                      <Typography className={innerClasses.bottomFields}>
                        Disc
                      </Typography>
                    </Grid>

                    <Grid
                      item
                      xs={3}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper,
                        innerClasses.footerSide
                      ]}
                    >
                      <Select
                        displayEmpty
                        disableUnderline
                        value={
                          saleDetails.discount_type === 'percentage' ? '%' : '₹'
                        }
                        fullWidth
                        style={{ textAlign: 'center' }}
                        onChange={(e) => {
                          setDiscountType(e.target.value);
                        }}
                      >
                        <MenuItem value={'%'}>{'%'}</MenuItem>
                        <MenuItem value={'₹'}>{'₹'}</MenuItem>
                      </Select>
                    </Grid>

                    <Grid
                      item
                      xs={5}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper
                      ]}
                    >
                      <Grid container direction="row" spacing={0}>
                        <Grid item xs={10}>
                          <TextField
                            className="total-wrapper-form"
                            id="discount"
                            inputRef={(el) =>
                              (inputRef.current[salesRefsValue.discountRef] =
                                el)
                            }
                            type="number"
                            autoComplete="off"
                            InputProps={{
                              inputProps: {
                                min: 0
                              },
                              disableUnderline: true
                            }}
                            onChange={(e) => {
                              if (saleDetails.discount_type === 'percentage') {
                                setDiscount(e.target.value);
                              } else {
                                setDiscountAmount(e.target.value);
                              }
                            }}
                            value={
                              saleDetails.discount_type === 'percentage'
                                ? saleDetails.discount_percent
                                : saleDetails.discount_amount
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            style={{ height: '100%', padding: '0px 0px 0px 14px' }}
          >
            <Grid item xs={6} style={{ marginTop: '10px' }}>
              <>
                {/* <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.footercontrols}
                  >
                    Share{' '}
                  </Button> */}
              </>

              {saleDetails.estimateType === 'close' && isRestore === true && (
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.footercontrols}
                  onClick={() => saveDataClick(false)}
                  ref={(el) =>
                    (inputRef.current[salesRefsValue.saveBtnRef] = el)
                  }
                >
                  {' '}
                  Restore{' '}
                </Button>
              )}

              {(isUpdate || !isUpdate) &&
              saleDetails.estimateType === 'open' ? (
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.footercontrols}
                  onClick={() => saveDataClick(false)}
                  ref={(el) =>
                    (inputRef.current[salesRefsValue.saveBtnRef] = el)
                  }
                >
                  {' '}
                  Save{' '}
                </Button>
              ) : (
                <div style={{ marginTop: '10px' }}>
                  <Typography>
                    {/* Status : {saleDetails.onlineOrderStatus} */}
                  </Typography>
                </div>
              )}

              {(isUpdate || !isUpdate) &&
                saleDetails.estimateType === 'open' && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    ref={(el) =>
                      (inputRef.current[salesRefsValue.saveNewRef] = el)
                    }
                    className={classes.footercontrols}
                    onClick={() => saveAndNewClick(false)}
                  >
                    Save & New{' '}
                  </Button>
                )}

              {(isUpdate || !isUpdate) &&
                saleDetails.estimateType === 'open' &&
                printerList &&
                printerList.length > 0 && (
                  <Button
                    variant="contained"
                    color="secondary"
                    ref={(el) =>
                      (inputRef.current[salesRefsValue.printRef] = el)
                    }
                    className={[classes.saveButton, classes.footercontrols]}
                    onClick={() => {
                      onPrintAndSaveClicked();
                    }}
                  >
                    Save & Print{' '}
                  </Button>
                )}
            </Grid>
            <Grid item xs={2}></Grid>
            <Grid item xs={2} style={{ marginTop: '20px' }}>
              <Grid
                container
                direction="row"
                spacing={0}
                alignItems="center"
                className={classes.roundOffMarginTop}
              >
                <Grid item xs={12} sm={6} className={innerClasses.formWrapper}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={saleDetails.is_roundoff}
                        icon={
                          <CheckBoxOutlineBlankIcon style={{ fontSize: 30 }} />
                        }
                        checkedIcon={<CheckBoxIcon style={{ fontSize: 30 }} />}
                        onChange={(e) => {
                          toggleRoundOff();
                        }}
                        name="checkedA"
                      />
                    }
                    label="RoundOff"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={4}
                  className={[
                    classes.backgroundWhite,
                    innerClasses.formWrapper
                  ]}
                >
                  <TextField
                    className="total-wrapper-form"
                    id="roundoff-payment"
                    placeholder="0"
                    disabled={true}
                    value={getRoundedAmount}
                    InputProps={{ disableUnderline: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid
                container
                direction="row"
                spacing={0}
                alignItems="center"
                style={{ marginTop: '-11px', marginLeft: '-12px' }}
              >
                <Grid
                  item
                  xs={12}
                  sm={3}
                  className={[
                    innerClasses.formWrapper,
                    innerClasses.total_design
                  ]}
                >
                  <Typography>Total</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={9}
                  className={[
                    classes.backgroundWhite,
                    innerClasses.formWrapper,
                    innerClasses.total_val
                  ]}
                >
                  <TextField
                    className="total-wrapper-form total-payment"
                    id="total-payment"
                    placeholder="0"
                    value={'₹ ' + parseFloat(getTotalAmount).toFixed(2)}
                    InputProps={{ disableUnderline: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>

        {OpenQuotationBatchList ? (
          <QuotationBatchListModal
            open={OpenQuotationBatchList}
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleBatchListModalClose}
          />
        ) : null}

        {OpenSaleQuotationSerialList ? (
          <SaleQuotationSerialListModal
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleSerialListModalClose}
          />
        ) : null}

        {openAddressList ? (
          <SaleQuotationAddressListModal
            open={openAddressList}
            addressList={customerAddressList}
            onClose={handleCloseAddressList}
          />
        ) : null}

        {openProductDetails ? (
          <SaleQuotationProductDetails onClose={handleOpenProductDetails} />
        ) : null}

        <Dialog
          fullScreen={fullScreen}
          open={openSaleErrorAlertMessage}
          onClose={handleCloseSaleErrorAlertMessage}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>{errorAlertMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseSaleErrorAlertMessage}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={openAlert}
          onClose={handleAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          {/* <DialogContent>
            <DialogContentText>
              {alertText} stock not available, Do you want to proceed ?
            </DialogContentText>
          </DialogContent> */}
          <DialogActions>
            <Button autoFocus onClick={handleAlertClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAlertProceed} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={openCloseDialog}
          onClose={handleCloseDialogClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Transaction will not be saved, Do you want to close?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={(e) => {
                handleCloseDialogClose();
                closeDialog();
              }}
              color="primary"
            >
              Yes
            </Button>
            <Button onClick={handleCloseDialogClose} color="primary" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openNoProductsAlert}
        onClose={handleNoProductsAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Sale Quotation cannot be performed without adding products.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleNoProductsAlertClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openSaleMoreThanStockAlert}
        onClose={handleSaleMoreThanStockAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>Low Stock Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText>{saleMoreThanStockText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSaleMoreThanStockAlertClose}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openSaleQuotationLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Sale Quotation is being created!!!</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openSaleQuotationErrorAlertMessage}
        onClose={handleCloseSaleQuotationErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Sale Quotation. Please try again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSaleQuotationErrorAlertMessage}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openErrorAlertProduct}
        onClose={handleErrorAlertProductClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div
              dangerouslySetInnerHTML={{ __html: errorAlertProductMessage }}
            ></div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertProductClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={sequenceNumberFailureAlert}
        onClose={handleCloseSequenceNumberFailureAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            We are unable to reach our Server to get next sequence No. Please
            try again!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSequenceNumberFailureAlert}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
const useOutsideAlerter = (ref, index) => {};
const EditTable = (props) => {
  const store = useStore();
  const { setEditTable, getAddRowEnabled, setAddRowEnabled } =
    store.SalesQuotationAddStore;
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.index);
  return (
    <TableRow
      ref={wrapperRef}
      style={
        props.index % 2 === 0
          ? { backgroundColor: 'rgb(246, 248, 250)' }
          : { backgroundColor: '#fff' }
      }
      onClick={() => {
        if (!getAddRowEnabled()) {
          setEditTable(props.index, true, '');
        } else {
          setAddRowEnabled(false);
        }
      }}
    >
      {props.children}
    </TableRow>
  );
};
export default injectWithObserver(AddSalesQuotationInvoice);