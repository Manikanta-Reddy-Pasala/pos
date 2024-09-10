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
//import local components
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
import getStateList from '../../../../components/StateList';
import { salesRefs } from '../../../../components/Refs/SalesRefs';
import SaleOrderBatchListModal from 'src/components/modal/SaleOrderBatchListModal';
import * as Bd from '../../../../components/SelectedBusiness';
import Loader from 'react-js-loader';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getCustomerAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import SaleOrderAddressListModal from 'src/components/modal/AddressListModal/SaleOrderAddressListModal';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
import SaleOrderSerialListModal from 'src/components/modal/SaleOrderSerialListModal';
import { getCustomerName } from 'src/names/constants';
import { FileUpload } from 'src/components/common/FileUpload';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useInnerStyles = makeStyles((theme) => ({
  headerFooterWrapper: {
    padding: '10px',
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
  content: {
    top: '60px',
    bottom: '210px',
    position: 'absolute',
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
    zIndex: 10,
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
    zIndex: 10,
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
  }
}));

const AddSaleOrderInvoice = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  const inputRef = useRef([]);
  const store = useStore();
  const theme = useTheme();

  const {
    saleDetails,
    items,
    OpenAddSaleOrderInvoice,
    selectedProduct,
    FocusLastIndex,
    OpenSaleOrderBatchList,
    OpenSaleOrderSerialList,
    saleOrderTxnEnableFieldsMap,
    taxSettingsData,
    isRestore,
    openSaleOrderLoadingAlertMessage,
    openSaleOrderErrorAlertMessage,
    selectedIndex,
    descriptionCollapsibleMap,
    openAddressList,
    customerAddressList,
    isCGSTSGSTEnabledByPOS,
    sequenceNumberFailureAlert,
    errorAlertMessage,
    openSaleErrorAlertMessage,
    placeOfSupplyState
  } = toJS(store.SaleOrderStore);

  const {
    setInvoiceDate,
    setLinkPayment,
    getSaleOrderCount,
    getAmount,
    getTotalAmount,
    setPaymentType,
    getTotalNetWeight,
    getTotalGrossWeight,
    getTotalWatage,
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
    setReceived,
    toggleRoundOff,
    getBalanceData,
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
    setEditTable,
    setFocusLastIndex,
    setPaymentMode,
    setBankAccountData,
    setCGST,
    setSGST,
    setIGST,
    setCess,
    closeLinkPayment,
    handleBatchListModalClose,
    setGrossWeight,
    setWastagePercentage,
    setWastageGrams,
    setNetWeight,
    setPurity,
    setItemHSN,
    setSaleOrderTxnEnableFieldsMap,
    setTaxIncluded,
    setTaxSettingsData,
    setMakingCharge,
    setMakingChargeAmount,
    setPaymentReferenceNumber,
    setDueDate,
    setNotes,
    setPlaceOfSupply,
    setPlaceOfSupplyName,
    setMakingChargePerGramAmount,
    handleCloseSaleOrderErrorAlertMessage,
    handleOpenSaleOrderLoadingMessage,
    setMakingChargeIncluded,
    setRoundingConfiguration,
    setFreeQuantity,
    setItemUnit,
    setItemBatchNumber,
    setItemModelNumber,
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
    setItemBrand,
    setFileUploadUrls,
    checkForTaxAndLoadUI,
    setPlaceOfSupplyState
  } = store.SaleOrderStore;

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);
  const { handleCustomerModalOpenFromSales, resetCustomerFromSales } =
    store.CustomerStore;
  const { customerDialogOpen, customerFromSales } = toJS(store.CustomerStore);
  const { setcurrentBalance } = store.PaymentInStore;
  const { handleAddProductModalOpen } = store.ProductStore;
  const { getSaleOrderTransSettingdetails } =
    store.SaleOrderTransactionSettingsStore;
  const { getTaxSettingsDetails } = store.TaxSettingsStore;

  const [rxdbSub, setRxdbSub] = useState([]);
  const [records, setRecords] = useState([]);

  const [isJewellery, setIsJewellery] = React.useState(false);

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
  const [openCustomerNotProvidedAlert, setCustomerNotProvidedAlert] =
    React.useState(false);
  const [stateList, setStateList] = useState([]);
  const [productlist, setproductlist] = useState([]);
  const [openNegativeBalanceAlert, setNegativeBalanceAlert] =
    React.useState(false);
  const [openSaleMoreThanStockAlert, setSaleMoreThanStockAlert] =
    React.useState(false);
  const [saleMoreThanStockText, setsaleMoreThanStockText] = React.useState('');
  const [printerList, setPrinterList] = React.useState([]);
  const [isBarcodeFocus, setBarcodeFocus] = React.useState(true);
  const [payment_type_val, setPaymentTypeVal] = React.useState('');
  const [payment_mode_val, setPaymentModeVal] = React.useState('');
  const [paymentModeMenuOpenStatus, setPaymentModeMenuOpenStatus] =
    React.useState(false);
  const [bankAccounts, setBankAccounts] = React.useState([]);
  const [payment_type_list, setPaymentTypeList] = React.useState([]);
  const [rowCount, setRowCount] = useState(0);

  const payment_mode_list = [
    // {val: 'CASH ON DELIVERY' ,name : 'CASH ON DELIVERY'},
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' },
    { val: 'upi', name: 'UPI' }
  ];
  const salesRefsValue = salesRefs();

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);
  const [businessStateCode, setBusinessStateCode] = React.useState('');

  const { getAuditSettingsData } = store.AuditSettingsStore;
  const [isSerialFocus, setSerialFocus] = React.useState(true);
  const [metalList, setMetalList] = React.useState();

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const setBankIdDetails = async (payment_type) => {
    if (bankAccounts.length > 0) {
      let bankAccount = bankAccounts.find(
        (o) => o.accountDisplayName === payment_type
      );

      setBankAccountData(bankAccount);
    }
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

  const handleNegativeBalanceAlertClose = () => {
    setNegativeBalanceAlert(false);
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

  const onPrintAndSaveClicked = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (
      (saleDetails.is_credit || saleDetails.balance_amount > 0) &&
      saleDetails.customer_name === ''
    ) {
      setCustomerNotProvidedAlert(true);
    } else if (saleDetails.received_amount > getTotalAmount) {
      setAmountAlert(true);
    } else if (saleDetails.balance_amount < 0) {
      setNegativeBalanceAlert(true);
    } else if (
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
      setAlertOpen(false);
      setCustomerNameWhileEditing('');
      setPaymentType('Credit');

      setInvoiceRegularSetting(invoiceRegular);
      setInvoiceThermalSetting(invoiceThermal);

      handleOpenSaleOrderLoadingMessage();

      saveData(true)
        .then((data) => {
          console.log('data Inserted');
          getSaleOrderCount();
        })
        .catch((err) => {
          console.log('Sale Order Data Insertion Failed - ', err);
        });
    }
  };

  const isProductsValid = async () => {
    let isProductsValid = true;
    let errorMessage = '';

    let auditSettings = await getAuditSettingsData();

    if (saleOrderTxnEnableFieldsMap.get('enable_product_price') === true) {
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
      saleOrderTxnEnableFieldsMap.get('enable_product_price_per_gram') === true
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

  const handleCustomerNotProvidedAlertClose = () => {
    setCustomerNotProvidedAlert(false);
  };

  const handleCustomerClick = (customer) => {
    setCustomerName(customer.name);
    setCustomerId(customer.id);
    setCustomer(customer);
    setcurrentBalance(customer);

    setCustomerNameWhileEditing('');
    setEditTable(0, true, 1);
    setCustomerlist([]);

    if (customer.state) {
      let result = stateList.find((e) => e.name === customer.state);
      if (result) {
        setPlaceOfSupply(result.val);
        setPlaceOfSupplyName(result.name);
      }
    }

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
    // console.log(items);

    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (
      (saleDetails.is_credit || parseFloat(saleDetails.balance_amount) > 0) &&
      saleDetails.customer_name === ''
    ) {
      setCustomerNotProvidedAlert(true);
    } else if (
      parseFloat(saleDetails.received_amount) > parseFloat(getTotalAmount)
    ) {
      setAmountAlert(true);
    } else if (parseFloat(saleDetails.balance_amount) < 0) {
      setNegativeBalanceAlert(true);
    } else if (
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
      setPaymentType('Credit');

      handleOpenSaleOrderLoadingMessage();

      await saveData(false)
        .then((data) => {
          // handleClose();
          getSaleOrderCount();
          // closeDialog();
        })
        .catch((err) => {
          console.log('Internal Server Error ' + err);
          // alert('Error in Adding Data');
        });
    }
  };

  const saveAndNewClick = async (val) => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (saleDetails.is_credit && saleDetails.customer_name === '') {
      setCustomerNotProvidedAlert(true);
    } else if (saleDetails.received_amount > getTotalAmount) {
      setAmountAlert(true);
    } else if (saleDetails.balance_amount < 0) {
      setNegativeBalanceAlert(true);
    } else if (
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
      setPaymentType('Credit');

      handleOpenSaleOrderLoadingMessage();
      saveDataAndNew(false)
        .then((data) => {
          console.log('data Inserted');
          getSaleOrderCount();
        })
        .catch((err) => {
          console.log('Sale Order Insertion Failed - ', err);
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

  const handleDialogKeyDown = (e) => {
    let charCode = String.fromCharCode(e.which).toLowerCase();

    if (
      (e.ctrlKey || e.metaKey) &&
      (charCode === 's' || charCode === 'p' || charCode === 'n')
    ) {
      e.preventDefault();

      if ((e.ctrlKey || e.metaKey) && charCode === 's') {
        if (isUpdate || !isUpdate) {
          saveDataClick(false);
        }
      }
      if ((e.ctrlKey || e.metaKey) && charCode === 'p') {
        if (printerList && printerList.length > 0) {
          onPrintAndSaveClicked();
        }
      }

      if ((e.ctrlKey || e.metaKey) && charCode === 'n') {
        if (isUpdate || !isUpdate) {
          saveAndNewClick(false);
        }
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

  const getBankAccounts = async () => {
    const db = await Db.get();
    let list = [
      { val: 'cash', name: 'Cash' },
      { val: 'cheque', name: 'Cheque' }
    ];
    const businessData = await Bd.getBusinessData();

    let query = db.bankaccounts.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      let bankAccounts = data.map((item) => {
        let bankAccount = {};

        bankAccount.accountDisplayName = item.accountDisplayName;
        bankAccount.balance = item.balance;
        list.push({
          val: item.accountDisplayName,
          name: item.accountDisplayName
        });
        return item;
      });

      setBankAccounts(bankAccounts);
      setPaymentTypeList(list);
    });
  };

  useEffect(() => {
    // console.log('use effect of add invoice');

    setproductlist([]);
    setCustomerlist([]);

    /**
     * get all sale data
     */
    const initDB = async () => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const sub = db.jobworkin
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
    if (saleDetails.payment_type) {
      let result = payment_type_list.find(
        (e) => e.val === saleDetails.payment_type
      );
      if (result) {
        setPaymentTypeVal(result.name);
      }
    } else {
      setPaymentTypeVal('');
    }
  }, [saleDetails.payment_type, payment_type_list]);

  useEffect(() => {
    if (saleDetails.bankPaymentType) {
      let result = payment_mode_list.find(
        (e) => e.val === saleDetails.bankPaymentType
      );
      if (result) {
        setPaymentModeVal(result.name);
      }
    } else {
      setPaymentModeVal('');
    }
  }, [saleDetails.bankPaymentType, payment_mode_list]);

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
      setSaleOrderTxnEnableFieldsMap(await getSaleOrderTransSettingdetails());
    }

    fetchData();
  }, []);

  useEffect(() => {
    setStateList(getStateList());
    setIsJewellery(localStorage.getItem('isJewellery'));
  }, []);

  useEffect(() => {
    async function fetchData() {
      let settings = await getTaxSettingsDetails();
      setTaxSettingsData(settings);
      if (settings && settings.gstin && settings.gstin !== '') {
        let extractedStateCode = settings.gstin.slice(0, 2);
        setBusinessStateCode(extractedStateCode);
      }
    }

    setTimeout(() => {
      const countElement = document.querySelector('#myTable tr.row1');
      const count = countElement?.getElementsByTagName('th')?.length || 0;
      console.log('count', count);
      setRowCount(count);
    }, 3000);

    fetchData();
  }, []);

  useEffect(() => {
    setStateList(getStateList());
    getBankAccounts();
  }, []);

  const getRates = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.rates.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        let rateList = data.map((item) => item.toJSON());
        setMetalList(rateList);
        setRateMetalList(rateList);
      }
    });
  };

  useEffect(() => {
    const isJewellery = localStorage.getItem('isJewellery');
    if (isJewellery === 'true' || isJewellery === true) {
      getRates();
    }
  }, []);

  const handleFileUpload = (files) => {
    setFileUploadUrls(files);
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
        open={OpenAddSaleOrderInvoice}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
        onKeyDown={handleDialogKeyDown}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={7} className={innerClasses.alignCenter}>
                <Grid
                  container
                  className={classes.pageHeader}
                  style={{ flexWrap: 'nowrap' }}
                >
                  <Grid
                    item
                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                  >
                    <Button
                      aria-controls="simple-menu"
                      size="large"
                      variant="text"
                      className={classes.menubutton}
                    >
                      Sale Order
                    </Button>
                  </Grid>

                  <Grid item className={innerClasses.alignCenter}>
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
                              setPaymentModeMenuOpenStatus(false);
                              setMenuOpenStatus(false);
                              setPaymentTypeMenuOpenStatus(false);
                            }}
                            placeholder="Select Customer *"
                            value={
                              saleDetails.customer_name === ''
                                ? customerNameWhileEditing
                                : saleDetails.customer_name
                            }
                            onChange={(e) => {
                              if (e.target.value !== customerNameWhileEditing) {
                                setCustomerName('');
                                setCustomerId('');
                                setCGSTSGSTEnabledByPOS(true);
                                resetCustomer();
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
                                        <Grid container justify="space-between">
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

                  {taxSettingsData.enableGst && (
                    <Grid item className={innerClasses.alignCenter}>
                      <Grid container>
                        <Grid className={innerClasses.alignCenter}>
                          <Typography
                            variant="span"
                            className="formLabel"
                            style={{ color: '#000000', fontSize: 'small' }}
                          >
                            Supply State
                          </Typography>
                        </Grid>
                        <Grid item xs={5}>
                          {saleDetails.customerState === '' ? (
                            <>
                              <TextField
                                variant={'standard'}
                                value={placeOfSupplyState}
                                margin="dense"
                                style={{ marginLeft: '16px' }}
                                onClick={(e) => {
                                  setPaymentModeMenuOpenStatus(false);
                                  setPaymentTypeMenuOpenStatus(false);
                                  setMenuOpenStatus(true);
                                }}
                                onChange={(e) => checkForTaxAndLoadUI()}
                              ></TextField>
                              {menuOpenStatus ? (
                                <>
                                  <ul
                                    className={
                                      innerClasses.PlaceOfsupplyListbox
                                    }
                                  >
                                    <div>
                                      {stateList
                                        .filter((data) => {
                                          if (placeOfSupplyState === '') {
                                            return data;
                                          } else if (
                                            data && data.name
                                              ? data.name
                                                  .toLowerCase()
                                                  .includes(
                                                    placeOfSupplyState.toLocaleLowerCase()
                                                  )
                                              : ''
                                          ) {
                                            return data;
                                          }
                                        })
                                        .map((option, index) => (
                                          <li
                                            style={{ cursor: 'pointer' }}
                                            key={`${index}customer`}
                                          >
                                            <Button
                                              className={innerClasses.liBtn}
                                              disableRipple
                                              onClick={(e) => {
                                                setPlaceOfSupply(option.val);
                                                setPlaceOfSupplyName(
                                                  option.name
                                                );
                                                setMenuOpenStatus(false);

                                                if (
                                                  option.name &&
                                                  option.name !== ''
                                                ) {
                                                  let result = stateList.find(
                                                    (e) =>
                                                      e.code ===
                                                      businessStateCode
                                                  );
                                                  if (result) {
                                                    let businessState =
                                                      result.name;
                                                    if (
                                                      option.name ===
                                                      businessState
                                                    ) {
                                                      setCGSTSGSTEnabledByPOS(
                                                        true
                                                      );
                                                    } else {
                                                      setCGSTSGSTEnabledByPOS(
                                                        false
                                                      );
                                                    }
                                                  }
                                                }
                                              }}
                                            >
                                              {option.name}
                                            </Button>
                                          </li>
                                        ))}
                                    </div>
                                  </ul>
                                </>
                              ) : null}
                            </>
                          ) : (
                            <TextField
                              value={placeOfSupplyState}
                              disabled={true}
                            ></TextField>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>

              {isUpdate ? (
                <Grid item xs={1} className={innerClasses.alignCenter}>
                  <Grid container className={innerClasses.alignCenter}>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      style={{ textAlign: 'right', paddingRight: '10px' }}
                      className={innerClasses.alignCenter}
                    >
                      <Typography
                        variant="span"
                        className="formLabel"
                        style={{ color: '#000000', fontSize: 'small' }}
                      >
                        SO No
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        disabled
                        fullWidth
                        variant="standard"
                        margin="dense"
                        className="customTextField"
                        value={saleDetails.sequenceNumber}
                        style={{ color: '#000000', fontSize: 'small' }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={1} />
              )}

              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    style={{ textAlign: 'right', paddingRight: '10px' }}
                    className={innerClasses.alignCenter}
                  >
                    <Typography
                      variant="span"
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Order Date
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="standard"
                      margin="dense"
                      type="date"
                      className="customTextField"
                      id="date-picker-inline"
                      value={saleDetails.invoice_date}
                      onChange={(event) => setInvoiceDate(event.target.value)}
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    style={{ textAlign: 'right', paddingRight: '10px' }}
                    className={innerClasses.alignCenter}
                  >
                    <Typography
                      variant="span"
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Due Date
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      variant="standard"
                      margin="dense"
                      type="date"
                      className="customTextField"
                      id="date-picker-inline"
                      value={saleDetails.due_date}
                      onChange={(event) => setDueDate(event.target.value)}
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={1} style={{ textAlign: 'end' }}>
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
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {/* ------------------------------------PRODUCT TABLE-------------------------------------- */}

        <div className={innerClasses.content} style={{ bottom: '190px' }}>
          <Grid container className={innerClasses.headerFooterWrapper}></Grid>
          <TableContainer
            onClick={(e) => {
              setPaymentModeMenuOpenStatus(false);
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
                    ITEM{' '}
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
                  {saleOrderTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      HSN{' '}
                    </TableCell>
                  )}
                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_barcode'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      BARCODE{' '}
                    </TableCell>
                  )}

                  {/* Serial/IMEI No.  */}
                  {saleOrderTxnEnableFieldsMap.get(
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
                  {saleOrderTxnEnableFieldsMap.get(
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

                  {/* Brand */}
                  {saleOrderTxnEnableFieldsMap.get('enable_product_brand') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Brand{' '}
                    </TableCell>
                  )}

                  {/* Batch Number */}
                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_model_no'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Model No{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get('enable_product_price') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      PRICE{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
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

                  {saleOrderTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      QTY{' '}
                    </TableCell>
                  )}

                  {/* ********Free Quantity******* */}
                  {saleOrderTxnEnableFieldsMap.get(
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
                  {saleOrderTxnEnableFieldsMap.get('enable_product_unit') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      UNIT{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_gross_weight'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      GROSS WEIGHT g{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_stone_weight'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      STONE WEIGHT g{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_net_weight'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      NET WEIGHT g{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_wastage'
                  ) && (
                    <TableCell
                      variant="head"
                      colSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      WASTAGE{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) && (
                    <TableCell
                      variant="head"
                      colSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      MAKING CHARGE{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) && (
                    <TableCell
                      variant="head"
                      colSpan="1"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      MAKING CHARGE PER GRAM{' '}
                    </TableCell>
                  )}

                  {(saleOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    saleOrderTxnEnableFieldsMap.get(
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

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_stone_charge'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      STONE CHARGE{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get('enable_product_purity') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      PURITY{' '}
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
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

                  {saleOrderTxnEnableFieldsMap.get(
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

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_discount'
                  ) && (
                    <TableCell
                      variant="head"
                      colSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      DISCOUNT{' '}
                    </TableCell>
                  )}

                  {taxSettingsData.enableGst &&
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
                    saleOrderTxnEnableFieldsMap.get('enable_product_igst') &&
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
                    saleOrderTxnEnableFieldsMap.get('enable_tax_included') && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        width={'10px'}
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        TAX INCLUDED{' '}
                      </TableCell>
                    )}
                  {saleOrderTxnEnableFieldsMap.get('enable_product_cess') && (
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
                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_wastage'
                  ) && (
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

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) && (
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

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) && (
                    <>
                      <TableCell
                        variant="head"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        ₹{' '}
                      </TableCell>
                    </>
                  )}

                  {(saleOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    saleOrderTxnEnableFieldsMap.get(
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

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_discount'
                  ) && (
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
                    saleOrderTxnEnableFieldsMap.get('enable_product_igst') &&
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
                {items.map((item, idx) => (
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
                                            localStorage.getItem('isJewellery')
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
                            {saleOrderTxnEnableFieldsMap.get(
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
                            {saleOrderTxnEnableFieldsMap.get(
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
                      {isJewellery === 'true' &&
                        metalList &&
                        metalList.length > 0 && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              <>
                                {item.isEdit ? (
                                  <>
                                    {metalList && metalList.length > 0 && (
                                      <>
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
                                      </>
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
                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_hsn'
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
                                inputOnChange(e, idx, setItemHSN)
                              }
                              value={item.hsn}
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                                    Number('' + salesRefsValue.barcodeRef + idx)
                                  ] = el)
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                                value={item.serialOrImeiNo}
                                autoFocus={isSerialFocus ? true : false}
                                inputRef={(el) =>
                                  (inputRef.current[
                                    Number(
                                      '' + salesRefsValue.serialNoRef + idx
                                    )
                                  ] = el)
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                                inputOnChange(e, idx, setItemModelNumber)
                              }
                              value={item.modelNo}
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                              onKeyPress={(event) => {
                                if (
                                  event?.key === '-' ||
                                  event?.key === '+' ||
                                  event?.key === 'e'
                                ) {
                                  event.preventDefault();
                                }
                              }}
                              onFocus={(e) =>
                                item.mrp === 0 ? setMrp(idx, '') : ''
                              }
                              onChange={(e) => {
                                inputOnChange(e, idx, setMrp);
                                setItemNameForRandomProduct(idx, product_name);
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                              onKeyPress={(event) => {
                                if (
                                  event?.key === '-' ||
                                  event?.key === '+' ||
                                  event?.key === 'e'
                                ) {
                                  event.preventDefault();
                                }
                              }}
                              onFocus={(e) =>
                                item.pricePerGram === 0
                                  ? setItemPricePerGram(idx, '')
                                  : ''
                              }
                              onChange={(e) => {
                                inputOnChange(e, idx, setItemPricePerGram);
                                setItemNameForRandomProduct(idx, product_name);
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
                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_qty'
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
                                value={item.qty}
                                type="number"
                                inputRef={(el) =>
                                  (inputRef.current[Number('9' + idx)] = el)
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_unit'
                      ) && (
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

                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_gross_weight'
                      ) && (
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
                                onFocus={(e) =>
                                  item.grossWeight === 0
                                    ? setGrossWeight(idx, '')
                                    : ''
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setGrossWeight)
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_net_weight'
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
                                value={item.netWeight}
                                type="number"
                                inputRef={(el) =>
                                  (inputRef.current[Number('9' + idx)] = el)
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
                                  classes: { input: innerClasses.tableForm },
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
                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_wastage'
                      ) && (
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
                                  (inputRef.current[Number('30' + idx)] = el)
                                }
                                type="number"
                                onFocus={(e) =>
                                  item.wastagePercentage === 0
                                    ? setWastagePercentage(idx, '')
                                    : ''
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setWastagePercentage)
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
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
                                  (inputRef.current[Number('31' + idx)] = el)
                                }
                                type="number"
                                onFocus={(e) =>
                                  item.wastageGrams === 0
                                    ? setWastageGrams(idx, '')
                                    : ''
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setWastageGrams)
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
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
                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_making_charge'
                      ) && (
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
                                  (inputRef.current[Number('30' + idx)] = el)
                                }
                                type="number"
                                onFocus={(e) =>
                                  item.makingChargePercent === 0
                                    ? setMakingCharge(idx, '')
                                    : ''
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setMakingCharge)
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
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
                                  (inputRef.current[Number('31' + idx)] = el)
                                }
                                type="number"
                                onFocus={(e) =>
                                  item.makingChargeAmount === 0
                                    ? setMakingChargeAmount(idx, '')
                                    : ''
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setMakingChargeAmount)
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
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
                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_making_charge_per_gram'
                      ) && (
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
                                  (inputRef.current[Number('31' + idx)] = el)
                                }
                                type="number"
                                onFocus={(e) =>
                                  item.makingChargePerGramAmount === 0
                                    ? setMakingChargePerGramAmount(idx, '')
                                    : ''
                                }
                                onChange={(e) =>
                                  inputOnChange(
                                    e,
                                    idx,
                                    setMakingChargePerGramAmount
                                  )
                                }
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              item.makingChargePerGramAmount
                            )}{' '}
                          </TableCell>
                        </>
                      )}

                      {(saleOrderTxnEnableFieldsMap.get(
                        'enable_product_making_charge'
                      ) ||
                        saleOrderTxnEnableFieldsMap.get(
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
                              style={{ padding: '0px' }}
                            />
                          </TableCell>
                        )}

                      {/* Stone charge */}
                      {saleOrderTxnEnableFieldsMap.get(
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
                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_purity'
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
                                value={item.purity}
                                onFocus={(e) =>
                                  item.purity === 0 ? setPurity(idx, '') : ''
                                }
                                onChange={(e) => {
                                  // if (e.target.value > 0 || e.target.value === '') {
                                  inputOnChange(e, idx, setPurity);
                                  // }
                                }}
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
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
                      {saleOrderTxnEnableFieldsMap.get(
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
                      {saleOrderTxnEnableFieldsMap.get(
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

                      {saleOrderTxnEnableFieldsMap.get(
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
                                    disabled="true"
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
                              ) : (
                                parseFloat(item.cgst_amount).toFixed(2)
                              )}
                            </TableCell>
                          </>
                        )}

                      {/* SGST Percentage*/}
                      {taxSettingsData.enableGst &&
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

                      {/* SGST Amount*/}
                      {taxSettingsData.enableGst &&
                        isCGSTSGSTEnabledByPOS === true && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit ? (
                                <div className={classes.wrapper}>
                                  <TextField
                                    disabled="true"
                                    variant={'outlined'}
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
                              ) : (
                                parseFloat(item.sgst_amount).toFixed(2)
                              )}{' '}
                            </TableCell>
                          </>
                        )}

                      {/* IGST Percentage*/}
                      {taxSettingsData.enableGst &&
                        saleOrderTxnEnableFieldsMap.get(
                          'enable_product_igst'
                        ) &&
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
                                    value={parseFloat(item.igst_amount).toFixed(
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
                              ) : (
                                parseFloat(item.igst_amount).toFixed(2)
                              )}{' '}
                            </TableCell>
                          </>
                        )}

                      {/* Tax Included */}
                      {taxSettingsData.enableGst &&
                        saleOrderTxnEnableFieldsMap.get(
                          'enable_tax_included'
                        ) && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              <Checkbox
                                checked={item.taxIncluded}
                                onChange={(e) => {
                                  setTaxIncludedCheckerBox(idx);
                                }}
                                style={{ padding: '0px' }}
                              />
                            </TableCell>
                          </>
                        )}
                      {/* CESS */}
                      {saleOrderTxnEnableFieldsMap.get(
                        'enable_product_cess'
                      ) && (
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
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number('' + salesRefsValue.cessRef + idx)
                                    ] = el)
                                  }
                                  onFocus={(e) =>
                                    item.cess === 0 ? setCess(idx, '') : ''
                                  }
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
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
                              onChange={(e) => inputOnChange(e, idx, getAmount)}
                              InputProps={{
                                classes: { input: innerClasses.tableForm },
                                disableUnderline: true
                              }}
                              fullWidth
                            />
                            <Button
                              ref={(el) =>
                                (inputRef.current[
                                  Number('' + salesRefsValue.deleteBtnRef + idx)
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

                  {/* HSN */}
                  {saleOrderTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_barcode'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Serial/IMEI No.  */}
                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_serial_imei'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Batch Number */}
                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_batch_number'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Brand */}
                  {saleOrderTxnEnableFieldsMap.get('enable_product_brand') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {/* Model Number */}
                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_model_no'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/******************Price*****/}
                  {saleOrderTxnEnableFieldsMap.get('enable_product_price') && (
                    <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                      Total
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {saleOrderTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell colSpan="1" style={{ textAlign: 'center' }}>
                      {getTotalQuantity()}
                    </TableCell>
                  )}

                  {/* ********Free Quantity******* */}
                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_free_quantity'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* ********Unit******* */}
                  {saleOrderTxnEnableFieldsMap.get('enable_product_unit') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_gross_weight'
                  ) && (
                    <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                      <Typography component="subtitle2">
                        {getTotalGrossWeight} {' gms'}
                      </Typography>
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_stone_weight'
                  ) && (
                    <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                      <Typography component="subtitle2">
                        {getTotalStoneWeight} {' gms'}
                      </Typography>
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_net_weight'
                  ) && (
                    <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                      <Typography component="subtitle2">
                        {getTotalNetWeight}
                        {' gms'}
                      </Typography>
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_wastage'
                  ) && (
                    <TableCell colSpan="2" style={{ textAlign: 'right' }}>
                      <Typography component="subtitle2">
                        {getTotalWatage}
                        {' gms'}
                      </Typography>
                    </TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) && <TableCell colSpan="2"></TableCell>}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) && (
                    <TableCell
                      colSpan="1"
                      style={{ textAlign: 'right' }}
                    ></TableCell>
                  )}

                  {(saleOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    saleOrderTxnEnableFieldsMap.get(
                      'enable_product_making_charge_per_gram'
                    )) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="1"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_stone_charge'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {saleOrderTxnEnableFieldsMap.get('enable_product_purity') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_hallmark_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_certification_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {saleOrderTxnEnableFieldsMap.get(
                    'enable_product_discount'
                  ) && <TableCell colSpan="2"></TableCell>}

                  {taxSettingsData.enableGst &&
                    isCGSTSGSTEnabledByPOS === true && (
                      <TableCell colSpan="4"></TableCell>
                    )}

                  {taxSettingsData.enableGst &&
                    saleOrderTxnEnableFieldsMap.get('enable_product_igst') &&
                    isCGSTSGSTEnabledByPOS === false && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  {taxSettingsData.enableGst &&
                    saleOrderTxnEnableFieldsMap.get('enable_tax_included') && (
                      <TableCell colSpan="1"></TableCell>
                    )}
                  {saleOrderTxnEnableFieldsMap.get('enable_product_cess') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  <TableCell colSpan="1" style={{ textAlign: 'center' }}>
                    <Typography component="subtitle2">
                      {saleDetails.sub_total}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <div style={{ width: '100%' }}>
            <Grid container>
              {saleOrderTxnEnableFieldsMap.get('enable_bill_notes') ? (
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
                    variant="outlined"
                    multiline
                    rows={1}
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e2e2'
                    }}
                    maxRows={1}
                    fullWidth
                    fontSize="6"
                    onChange={(e) => setNotes(e.target.value)}
                    value={saleDetails.notes}
                  ></TextField>
                </Grid>
              ) : (
                <Grid item xs={12}></Grid>
              )}
            </Grid>
          </div>
        </div>
        {/*------------------------------------- Dialog Footer----------------------------------- */}
        <div className={[classes.footer]} style={{ height: '190px' }}>
          <Grid item xs={12}>
            <FileUpload
              onFilesUpload={handleFileUpload}
              uploadedFiles={saleDetails.imageUrls}
              fileNameDisplay={false}
            />
          </Grid>

          <Grid
            container
            justifyContent="space-between"
            className={[classes.root, classes.paymentTypeWrap]}
          >
            {/* <Grid item xs={3}></Grid> */}

            <Grid item xs={3}>
              {saleOrderTxnEnableFieldsMap.get('enable_bill_discount') && (
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
                        innerClasses.formWrapper
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

            {saleDetails.is_credit || isUpdate ? (
              <>
                <Grid item xs={2}>
                  <Grid
                    container
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    style={{ marginTop: '7px' }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={innerClasses.formWrapper}
                    >
                      {/* <Typography>Advance</Typography> */}
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={7}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper
                      ]}
                    ></Grid>
                  </Grid>
                </Grid>

                <Grid item xs={2}>
                  <Grid
                    container
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    style={{ marginTop: '7px' }}
                  >
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={innerClasses.formWrapper}
                    >
                      <Typography className={innerClasses.bottomFields}>
                        Balance
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={7}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper
                      ]}
                    >
                      <TextField
                        className="total-wrapper-form balance-payment"
                        id="balance-payment"
                        placeholder="0"
                        value={'₹ ' + getBalanceData}
                        InputProps={{ disableUnderline: true }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Grid item xs={4}></Grid>
            )}
          </Grid>
          <Grid
            container
            style={{ height: '100%', padding: '0px 0px 0px 14px' }}
          >
            <Grid item xs={6} style={{ marginTop: '10px' }}>
              <>
                {saleDetails.saleOrderType === 'close' &&
                  isRestore === true && (
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
                {saleDetails.saleOrderType === 'open' && (
                  <>
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

                    {printerList && printerList.length > 0 && (
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
                  </>
                )}
              </>
            </Grid>

            <Grid item xs={2} style={{ marginTop: '20px' }}></Grid>

            <Grid item xs={2} style={{ marginTop: '15px' }}>
              <Grid container direction="row" spacing={0} alignItems="center">
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
                    value={'₹ ' + getTotalAmount}
                    InputProps={{ disableUnderline: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>

        {OpenSaleOrderBatchList ? (
          <SaleOrderBatchListModal
            open={OpenSaleOrderBatchList}
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleBatchListModalClose}
          />
        ) : null}

        {OpenSaleOrderSerialList ? (
          <SaleOrderSerialListModal
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleSerialListModalClose}
          />
        ) : null}

        {openAddressList ? (
          <SaleOrderAddressListModal
            open={openAddressList}
            addressList={customerAddressList}
            onClose={handleCloseAddressList}
          />
        ) : null}

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

        <Dialog
          fullScreen={fullScreen}
          open={openAmountAlert}
          onClose={handleAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Received amount can't be more than the sale amount.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAlertClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openNegativeBalanceAlert}
        onClose={handleNegativeBalanceAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>Balance cannot be negative.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleNegativeBalanceAlertClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openCustomerNotProvidedAlert}
        onClose={handleCustomerNotProvidedAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Please select a customer to save the Sale Order.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCustomerNotProvidedAlertClose}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openNoProductsAlert}
        onClose={handleNoProductsAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Sale cannot be performed without adding products.
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
        open={openSaleOrderLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Sale Order is being created!!!</p>
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
        open={openSaleOrderErrorAlertMessage}
        onClose={handleCloseSaleOrderErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Sale Order. Please try again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSaleOrderErrorAlertMessage}
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
    store.SaleOrderStore;
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
export default injectWithObserver(AddSaleOrderInvoice);