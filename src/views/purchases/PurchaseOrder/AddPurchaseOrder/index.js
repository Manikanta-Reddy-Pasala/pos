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
import plus from '../../../../icons/plus.png';
import prodPlus from '../../../../icons/prod_plus.png';
import getStateList from '../../../../components/StateList';
import moment from 'moment';
import PurchaseOrderBatchListModal from 'src/components/modal/PurchaseOrderBatchListModal';
import VendorModal from 'src/views/Vendors/modal/AddVendor';
import * as Bd from '../../../../components/SelectedBusiness';
import Loader from 'react-js-loader';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import PurchaseOrderAddressListModal from 'src/components/modal/AddressListModal/PurchaseOrderAddressListModal';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
import PurchaseOrderSerialListModal from 'src/components/modal/PurchaseOrderSerialListModal';
import { FileUpload } from 'src/components/common/FileUpload';

var dateFormat = require('dateformat');

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
    bottom: '230px',
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

const AddPurchaseOrder = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  const store = useStore();
  const theme = useTheme();

  const {
    billDetails,
    items,
    OpenAddPurchaseOrder,
    paymentLinkTransactions,
    OpenPurchaseOrderBatchList,
    FocusLastIndex,
    taxSettingsData,
    purchaseOrderTxnEnableFieldsMap,
    selectedProduct,
    selectedIndex,
    setPurchaseOrderPlaceOfSupply,
    setPlaceOfSupplyName,
    isRestore,
    openPurchaseOrderLoadingAlertMessage,
    openPurchaseOrderErrorAlertMessage,
    descriptionCollapsibleMap,
    openAddressList,
    customerAddressList,
    isCGSTSGSTEnabledByPOS,
    sequenceNumberFailureAlert,
    OpenPurchaseOrderSerialList,
    errorAlertMessage,
    openPurchaseOrderValidationMessage,
    placeOfSupplyState
  } = toJS(store.PurchaseOrderStore);

  const {
    setLinkPayment,
    getAmount,
    setBillDate,
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
    // setPaid,
    toggleRoundOff,
    getBalanceData,
    saveData,
    saveDataAndNew,
    getRoundedAmount,
    closeDialog,
    selectProduct,
    setVendorName,
    setVendorId,
    setVendor,
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
    setPurchaseOrderTxnEnableFieldsMap,
    setTaxIncluded,
    setTaxSettingsData,
    setMakingCharge,
    setMakingChargeAmount,
    setPaymentReferenceNumber,
    setDueDate,
    setNotes,
    setSerialOrImeiNo,
    setMakingChargePerGramAmount,
    handleClosePurchaseOrderErrorAlertMessage,
    handleOpenPurchaseOrderLoadingMessage,
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
    setCGSTSGSTEnabledByPOS,
    handleCloseSequenceNumberFailureAlert,
    resetVendor,
    handleSerialListModalClose,
    handleClosePurchaseOrderValidationAlertMessage,
    setRateMetalList,
    setItemRate,
    setDiscountType,
    setDiscountPercentForAllItems,
    getTotalQuantity,
    setItemHallmarkCharge,
    setItemCertificationCharge,
    setPurchaseOrderUploadedFiles,
    setItemBrand,
    launchSerialDataDialog,
    setPlaceOfSupplyState,
    checkForTaxAndLoadUI
  } = store.PurchaseOrderStore;

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);
  const [vendorNameWhileEditing, setVendorNameWhileEditing] = useState('');
  const [openVendorNotProvidedAlert, setVendorNotProvidedAlert] =
    React.useState(false);
  const [isPlaceOfSupplyOverridden, setPlaceOfSupplyOverridden] =
    React.useState(false);
  const { handleVendorModalOpenFromPurchases, resetVendorFromPurchases } =
    store.VendorStore;
  const { vendorDialogOpen, vendorFromPurchases } = toJS(store.VendorStore);
  const { setcurrentBalance } = store.PaymentInStore;
  const { handleAddProductModalOpen } = store.ProductStore;
  const { getPurchaseOrderTransSettingdetails } =
    store.PurchaseOrderTransSettingsStore;
  const { getTaxSettingsDetails } = store.TaxSettingsStore;

  const [rxdbSub, setRxdbSub] = useState([]);
  const [records, setRecords] = useState([]);

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

  const [stateList, setStateList] = useState([]);
  const [productlist, setproductlist] = useState([]);
  const [openNegativeBalanceAlert, setNegativeBalanceAlert] =
    React.useState(false);
  const [printerList, setPrinterList] = React.useState([]);
  const [isBarcodeFocus, setBarcodeFocus] = React.useState(true);
  const [payment_type_val, setPaymentTypeVal] = React.useState('');
  const [payment_mode_val, setPaymentModeVal] = React.useState('');
  const [paymentModeMenuOpenStatus, setPaymentModeMenuOpenStatus] =
    React.useState(false);
  const [bankAccounts, setBankAccounts] = React.useState([]);
  const [payment_type_list, setPaymentTypeList] = React.useState([]);
  const [vendorList, setVendorList] = React.useState();
  const [isSaveCliked, setSaveClicked] = React.useState(false);
  const [openTotalZeoAlert, setTotalZeroAlert] = React.useState(false);
  const [isJewellery, setIsJewellery] = React.useState(false);

  const [businessStateCode, setBusinessStateCode] = React.useState('');
  const [isSerialFocus, setSerialFocus] = React.useState(true);
  const [metalList, setMetalList] = React.useState();
  const [rowCount, setRowCount] = useState(0);

  const handleCloseTotalZeroAlert = () => {
    setTotalZeroAlert(false);
  };

  const payment_mode_list = [
    // {val: 'CASH ON DELIVERY' ,name : 'CASH ON DELIVERY'},
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' },
    { val: 'upi', name: 'UPI' }
  ];

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const { getAuditSettingsData } = store.AuditSettingsStore;

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  useEffect(() => {
    async function fetchData() {
      setPurchaseOrderTxnEnableFieldsMap(
        await getPurchaseOrderTransSettingdetails()
      );
    }

    setTimeout(() => {
      const countElement = document.querySelector('#myTable tr.row1');
      const count = countElement?.getElementsByTagName('th')?.length || 0;
      setRowCount(count);
    }, 3000);
    fetchData();
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

    fetchData();
  }, []);

  useEffect(() => {
    if (
      taxSettingsData.state !== '' &&
      billDetails.placeOfSupplyName === '' &&
      !isPlaceOfSupplyOverridden
    ) {
      setPlaceOfSupplyName(taxSettingsData.state);
      setPlaceOfSupplyState(taxSettingsData.state);

      let result = stateList.find((e) => e.name === taxSettingsData.state);
      if (result) {
        setPurchaseOrderPlaceOfSupply(result.val);
      }
    }
  }, [taxSettingsData]);

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  const inputOnChange = (e, index, setFunction) => {
    e.persist();
    setFunction(index, e.target.value);

    let funcName = setFunction;

    if (funcName === 'setItemBarcode') {
      setBarcodeFocus(true);
      setSerialFocus(false);
    }

    if (funcName === 'setSerialOrImeiNo') {
      setSerialFocus(true);
      setBarcodeFocus(false);
    }
  };

  useEffect(() => {
    if (billDetails.payment_type) {
      let result = payment_type_list.find(
        (e) => e.val === billDetails.payment_type
      );
      if (result) {
        setPaymentTypeVal(result.name);
      }
    } else {
      setPaymentTypeVal('');
    }
  }, [billDetails.payment_type, payment_type_list]);

  useEffect(() => {
    if (billDetails.bankPaymentType) {
      let result = payment_mode_list.find(
        (e) => e.val === billDetails.bankPaymentType
      );
      if (result) {
        setPaymentModeVal(result.name);
      }
    } else {
      setPaymentModeVal('');
    }
  }, [billDetails.bankPaymentType, payment_mode_list]);

  const setBankIdDetails = async (payment_type) => {
    if (bankAccounts.length > 0) {
      let bankAccount = bankAccounts.find(
        (o) => o.accountDisplayName === payment_type
      );

      setBankAccountData(bankAccount);
    }
  };

  const inputRef = useRef([]);

  const handleKeyDown = (e, TopIndex, RightIndex, BottomIndex, LeftIndex) => {
    let next = '';

    if (e.keyCode === 37) {
      next = inputRef.current[LeftIndex];
    }
    if (e.keyCode === 38) {
      next = inputRef.current[TopIndex];
    }
    if (e.keyCode === 39) {
      next = inputRef.current[RightIndex];
    }
    if (e.keyCode === 40) {
      next = inputRef.current[BottomIndex];
    }

    if (next) {
      setTimeout(() => {
        next.focus();
      }, 50);
    }
  };

  useEffect(() => {
    if (FocusLastIndex >= 0) {
      let next = inputRef.current[FocusLastIndex];
      if (next) {
        next.focus();
        setFocusLastIndex('');
      }
    }
  }, [FocusLastIndex, setFocusLastIndex]);

  const handleDialogKeyDown = (e) => {
    let charCode = String.fromCharCode(e.which).toLowerCase();

    if (
      (e.ctrlKey || e.metaKey) &&
      (charCode === 's' || charCode === 'p' || charCode === 'n')
    ) {
      e.preventDefault();

      if ((e.ctrlKey || e.metaKey) && charCode === 's') {
        if (!(billDetails.isPartiallyReturned || billDetails.isFullyReturned)) {
          saveDataClick(false);
        }
      }
      if ((e.ctrlKey || e.metaKey) && charCode === 'p') {
        if (
          (billDetails.isPartiallyReturned || billDetails.isFullyReturned) &&
          printerList &&
          printerList.length > 0
        ) {
        }
      }

      if ((e.ctrlKey || e.metaKey) && charCode === 'n') {
        if (!(billDetails.isPartiallyReturned || billDetails.isFullyReturned)) {
          saveAndNewClick(false);
        }
      }
    }
  };

  const handleAlertClose = () => {
    setAmountAlert(false);
  };

  const handleNegativeBalanceAlertClose = () => {
    setNegativeBalanceAlert(false);
  };

  const handleNoProductsAlertClose = () => {
    setNoProductsAlert(false);
  };

  const handleAddVendor = () => {
    handleVendorModalOpenFromPurchases();
  };

  useEffect(() => {
    setStateList(getStateList());
    setBankAccounts([]);
    getBankAccounts();
    setIsJewellery(localStorage.getItem('isJewellery'));
  }, []);

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const setTaxIncludedCheckerBox = (index) => {
    setTaxIncluded(index);
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

  const handleVendorClick = (vendor) => {
    setVendorName(vendor.name);
    setVendorId(vendor.id);
    setVendor(vendor);
    setVendorNameWhileEditing('');
    setVendorList([]);
    setEditTable(0, true, 1);

    if (vendor.state) {
      let result = stateList.find((e) => e.name === vendor.state);
      if (result) {
        setPlaceOfSupplyState(result.name);
        setPlaceOfSupplyName(result.name);
        setPurchaseOrderPlaceOfSupply(result.val);
      }
    }

    checkForTaxAndLoadUI(true);
  };

  const handleVendorNotProvidedAlertClose = () => {
    setVendorNotProvidedAlert(false);
  };

  const deleteRow = (index) => {
    deleteItem(index);
  };

  const handler = (idx) => (e) => {
    const next = inputRef.current[idx];
    if (next) {
      next.focus();
    }
  };

  const handleDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setBillDate(date);
  };

  const handleAddRow = () => {
    setProductName('');
    addNewItem();
  };

  const saveDataClick = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    setSaveClicked(true);

    if (billDetails.vendor_name === '') {
      setVendorNotProvidedAlert(true);
    } else if (billDetails.paid_amount > getTotalAmount) {
      setAmountAlert(true);
    } else if (billDetails.balance_amount < 0) {
      setNegativeBalanceAlert(true);
    } else if (billDetails.total_amount === 0) {
      setNegativeBalanceAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setProductName('');
      setPaymentType('Credit');
      setSaveClicked(false);
      setPlaceOfSupplyOverridden(false);

      handleOpenPurchaseOrderLoadingMessage();
      saveData(false)
        .then((data) => {
          console.log('data Inserted');
          // handleClose();
          // closeDialog();
        })
        .catch((err) => {
          console.log('data Inserted failed' + err);
          // alert('Error in Adding Data');
        });
    }
  };

  const saveAndNewClick = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }
    setSaveClicked(false);

    if (billDetails.vendor_name === '') {
      setVendorNotProvidedAlert(true);
    } else if (billDetails.paid_amount > getTotalAmount) {
      setAmountAlert(true);
    } else if (billDetails.balance_amount < 0) {
      setNegativeBalanceAlert(true);
    } else if (billDetails.total_amount === 0) {
      setNegativeBalanceAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setProductName('');
      setPaymentType('Credit');
      setSaveClicked(false);
      setPlaceOfSupplyOverridden(false);

      handleOpenPurchaseOrderLoadingMessage();
      saveDataAndNew(false)
        .then((data) => {
          console.log('data Inserted');
        })
        .catch((err) => {
          console.log('Purchase Order Insertion Failed - ', err);
        });
    }
  };

  const onPrintAndSaveClick = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    setSaveClicked(true);

    if (billDetails.vendor_name === '') {
      setVendorNotProvidedAlert(true);
    } else if (billDetails.paid_amount > getTotalAmount) {
      setAmountAlert(true);
    } else if (billDetails.balance_amount < 0) {
      setNegativeBalanceAlert(true);
    } else if (billDetails.total_amount === 0) {
      setNegativeBalanceAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setInvoiceRegularSetting(invoiceRegular);
      setInvoiceThermalSetting(invoiceThermal);
      setProductName('');
      setPlaceOfSupplyOverridden(false);

      setSaveClicked(false);

      handleOpenPurchaseOrderLoadingMessage();
      saveData(true)
        .then((data) => {
          console.log('data Inserted');
        })
        .catch((err) => {
          console.log('Purchase Order Insertion Failed - ', err);
        });
    }
  };

  const isProductsValid = async () => {
    let isProductsValid = true;
    let errorMessage = '';

    let auditSettings = await getAuditSettingsData();

    if (purchaseOrderTxnEnableFieldsMap.get('enable_product_price') === true) {
      for (var i = 0; i < items.length; i++) {
        let item = items[i];

        if (
          item.amount === 0 &&
          item.qty === 0 &&
          item.purchased_price === 0 &&
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
          item.purchased_price === '' ||
          item.purchased_price === 0 ||
          item.purchased_price === undefined ||
          item.purchased_price === null
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
      purchaseOrderTxnEnableFieldsMap.get('enable_product_price_per_gram') ===
      true
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

  useEffect(() => {
    const initDB = async () => {
      const db = await Db.get();

      const businessData = await Bd.getBusinessData();

      const sub = db.purchases
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
    return () => rxdbSub.map((sub) => sub.unsubscribe());
  }, []);

  useEffect(() => {
    if (vendorFromPurchases.id) {
      handleVendorClick(vendorFromPurchases);
      resetVendorFromPurchases();
    }
  }, [vendorFromPurchases]);

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };
  const checkCloseDialog = () => {
    if ((items.length === 1 && items[0].item_name === '') || isUpdate) {
      closeDialog();
    } else {
      setCloseDialogAlert(true);
    }
  };

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
    getRates();
  }, []);

  const handleFilesUpload = (filesData) => {
    setPurchaseOrderUploadedFiles(filesData);
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
        open={OpenAddPurchaseOrder}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
        onKeyDown={handleDialogKeyDown}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={5} className={innerClasses.alignCenter}>
                <Grid container className={classes.pageHeader}>
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
                      Purchase Order
                    </Button>
                  </Grid>

                  <Grid item className={innerClasses.alignCenter}>
                    {isUpdate || !isUpdate ? (
                      <div>
                        <div>
                          <TextField
                            fullWidth
                            onClick={(e) => {
                              setPaymentModeMenuOpenStatus(false);
                              setMenuOpenStatus(false);
                              setPaymentTypeMenuOpenStatus(false);
                            }}
                            placeholder="Select Vendor *"
                            value={
                              billDetails.vendor_name === ''
                                ? vendorNameWhileEditing
                                : billDetails.vendor_name
                            }
                            onChange={(e) => {
                              if (e.target.value !== vendorNameWhileEditing) {
                                setVendorName('');
                                setVendorId('');
                                resetVendor();
                                setCGSTSGSTEnabledByPOS(true);
                                checkForTaxAndLoadUI(true);
                              }
                              getVendorList(e.target.value);
                              setVendorNameWhileEditing(e.target.value);
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
                        {vendorList && vendorList.length > 0 ? (
                          <>
                            <ul
                              className={innerClasses.listbox}
                              style={{ width: '20%' }}
                            >
                              <li>
                                <Grid container justify="space-between">
                                  {vendorList.length === 1 &&
                                  vendorList[0].name === '' ? (
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
                              {vendorList.length === 1 &&
                              vendorList[0].name === '' ? (
                                <li></li>
                              ) : (
                                <div>
                                  {vendorList.map((option, index) => (
                                    <li
                                      style={{ padding: 10, cursor: 'pointer' }}
                                      onClick={() => {
                                        handleVendorClick(option);
                                      }}
                                      key={`${index}customer`}
                                    >
                                      <Button
                                        className={innerClasses.liBtn}
                                        disableRipple
                                        ref={(el) =>
                                          (inputRef.current[
                                            Number(
                                              inputRef.customerNameRefVal +
                                                '0' +
                                                index +
                                                '0'
                                            )
                                          ] = el)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            setVendorList([]);
                                            setVendorNameWhileEditing('');
                                            setFocusLastIndex(1);
                                          }
                                          handleKeyDown(
                                            e,
                                            Number(
                                              inputRef.customerNameRefVal +
                                                '0' +
                                                (index - 1) +
                                                '0'
                                            ),
                                            inputRef.noRef,
                                            Number(
                                              inputRef.customerNameRefVal +
                                                '0' +
                                                (index + 1) +
                                                '0'
                                            ),
                                            inputRef.noRef
                                          );
                                          if (e.key === 'Enter') {
                                            handleVendorClick(option);
                                          }
                                        }}
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
                        <VendorModal open={vendorDialogOpen} />
                      </div>
                    ) : (
                      <Input
                        readOnly
                        id="component-simple"
                        value={billDetails.vendor_name}
                        fullWidth
                      />
                    )}
                  </Grid>

                  {transaction.enableVendor && (
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
                          (inputRef.current[inputRef.addCustomerBtnRef] = el)
                        }
                        onKeyDown={(e) => {
                          handleKeyDown(
                            e,
                            inputRef.saveBtnRef,
                            inputRef.addProductBtnRef,
                            inputRef.paymentTypeRef,
                            inputRef.customerNameRefVal
                          );
                          if (e.key === 'getEventKey') {
                            handleAddVendor();
                          }
                        }}
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
                        onClick={handleAddVendor}
                      >
                        Add Vendor
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
                        (inputRef.current[inputRef.addProductBtnRef] = el)
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
                </Grid>
              </Grid>

              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    style={{ textAlign: 'center' }}
                    className={innerClasses.alignCenter}
                  >
                    <Typography
                      variant="span"
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Place of Supply
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    {billDetails.vendorState === '' ? (
                      <>
                        <TextField
                          variant={'standard'}
                          value={placeOfSupplyState}
                          margin="dense"
                          inputRef={(el) => (inputRef.current[4] = el)}
                          onClick={(e) => setMenuOpenStatus(true)}
                          onChange={(e) => checkForTaxAndLoadUI()}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setMenuOpenStatus(false);
                            }
                            if (e.key === 'Enter') {
                              setMenuOpenStatus(true);
                            } else {
                              if (!menuOpenStatus) {
                                handleKeyDown(e, 7, 80, 80, 37);
                              } else {
                                handleKeyDown(e, 0, 0, 400, 0);
                              }
                            }
                          }}
                        ></TextField>
                        {menuOpenStatus ? (
                          <>
                            <ul className={innerClasses.PlaceOfsupplyListbox}>
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
                                          setPurchaseOrderPlaceOfSupply(
                                            option.val
                                          );
                                          setPlaceOfSupplyName(option.name);
                                          setMenuOpenStatus(false);
                                          setFocusLastIndex(4);
                                          setPlaceOfSupplyOverridden(true);

                                          if (
                                            option.name &&
                                            option.name !== ''
                                          ) {
                                            let result = stateList.find(
                                              (e) =>
                                                e.code === businessStateCode
                                            );
                                            if (result) {
                                              let businessState = result.name;
                                              if (
                                                option.name === businessState
                                              ) {
                                                setCGSTSGSTEnabledByPOS(true);
                                              } else {
                                                setCGSTSGSTEnabledByPOS(false);
                                              }
                                            }
                                          }
                                        }}
                                        ref={(el) =>
                                          (inputRef.current[
                                            Number('4' + index + '0')
                                          ] = el)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            setMenuOpenStatus(false);
                                          }
                                          handleKeyDown(
                                            e,
                                            Number('4' + (index - 1) + '0'),
                                            0,
                                            Number('4' + (index + 1) + '0'),
                                            0
                                          );
                                          if (e.key === 'Enter') {
                                            setPurchaseOrderPlaceOfSupply(
                                              option.val
                                            );
                                            setPlaceOfSupplyName(option.name);
                                            setMenuOpenStatus(false);
                                            setFocusLastIndex(4);
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
                      value={billDetails.po_date}
                      onChange={(event) => setBillDate(event.target.value)}
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
                    sm={6}
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
                      value={billDetails.due_date}
                      onChange={(event) => setDueDate(event.target.value)}
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={1} className={innerClasses.alignCenter}>
                <Grid item xs={12} sm={12} style={{ textAlign: 'end' }}>
                  <IconButton
                    onClick={checkCloseDialog}
                    ref={(el) => (inputRef.current[inputRef.cancelBtnRef] = el)}
                  >
                    <Cancel fontSize="inherit" />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {/* ------------------------------------PRODUCT TABLE-------------------------------------- */}

        <div className={innerClasses.content} style={{ bottom: '230px' }}>
          <Grid container className={innerClasses.headerFooterWrapper}></Grid>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead className={classes.addtablehead} id="myTable">
                <TableRow className="row1">
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    {' '}
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
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_hsn'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      HSN{' '}
                    </TableCell>
                  )}

                  {/* Barcode */}
                  {purchaseOrderTxnEnableFieldsMap.get(
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

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_serial_imei'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Serial / IMEI No.{' '}
                    </TableCell>
                  )}

                  {/* Batch Number */}
                  {purchaseOrderTxnEnableFieldsMap.get(
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
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_brand'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Brand{' '}
                    </TableCell>
                  )}

                  {/* Model Number */}
                  {purchaseOrderTxnEnableFieldsMap.get(
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

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_price'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Purchase Price{' '}
                    </TableCell>
                  )}

                  {purchaseOrderTxnEnableFieldsMap.get(
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

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_qty'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      QTY{' '}
                    </TableCell>
                  )}

                  {/* ********Free Quantity******* */}
                  {purchaseOrderTxnEnableFieldsMap.get(
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

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_unit'
                  ) && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      UNIT{' '}
                    </TableCell>
                  )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_gross_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        GROSS WEIGHT g{' '}
                      </TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_stone_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        STONE WEIGHT g{' '}
                      </TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_net_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        NET WEIGHT g{' '}
                      </TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_wastage'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        WASTAGE{' '}
                      </TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
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

                  {purchaseOrderTxnEnableFieldsMap.get(
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

                  {(purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    purchaseOrderTxnEnableFieldsMap.get(
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

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_stone_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        STONE CHARGE{' '}
                      </TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_purity'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        PURITY{' '}
                      </TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
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

                  {purchaseOrderTxnEnableFieldsMap.get(
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

                  {purchaseOrderTxnEnableFieldsMap.get(
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
                    purchaseOrderTxnEnableFieldsMap.get(
                      'enable_product_igst'
                    ) &&
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
                    purchaseOrderTxnEnableFieldsMap.get(
                      'enable_tax_included'
                    ) && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        width={'10px'}
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        TAX INCLUDED{' '}
                      </TableCell>
                    )}
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_cess'
                  ) && (
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
                {taxSettingsData.enableGst && (
                  <TableRow>
                    {purchaseOrderTxnEnableFieldsMap.get(
                      'enable_product_wastage'
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
                            grams{' '}
                          </TableCell>
                        </>
                      )}
                    {purchaseOrderTxnEnableFieldsMap.get(
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

                    {purchaseOrderTxnEnableFieldsMap.get(
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

                    {(purchaseOrderTxnEnableFieldsMap.get(
                      'enable_product_making_charge'
                    ) ||
                      purchaseOrderTxnEnableFieldsMap.get(
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

                    {purchaseOrderTxnEnableFieldsMap.get(
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
                      purchaseOrderTxnEnableFieldsMap.get(
                        'enable_product_igst'
                      ) &&
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
                )}
              </TableHead>

              <TableBody>
                {items.map((item, idx) => (
                  <>
                    <EditTable
                      key={idx + 1}
                      index={idx}
                      // className={(idx %2 === 0 ? classes.oddRow : classes.evenRow)}
                    >
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {idx + 1}
                      </TableCell>
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
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
                                value={product_name}
                                autoFocus={isBarcodeFocus ? false : true}
                                inputRef={(el) =>
                                  (inputRef.current[Number('8' + idx)] = el)
                                }
                                fullWidth
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                                onChange={(e) => {
                                  getProductList(e.target.value);
                                  setProductName(e.target.value);
                                }}
                                onKeyDown={(e) => {
                                  if (productlist.length > 0) {
                                    if (e.key === 'Escape') {
                                      setproductlist([]);
                                      setProductName('');
                                      setEditTable(
                                        idx,
                                        true,
                                        Number('8' + idx)
                                      );
                                    }
                                  }
                                  handleKeyDown(
                                    e,
                                    idx === 0 ? 25 : Number('8' + (idx - 1)),
                                    Number('9' + idx),
                                    idx === items.length - 1
                                      ? productlist.length > 0
                                        ? Number('8' + idx + '00')
                                        : 18
                                      : productlist.length > 0
                                      ? Number('8' + idx + '00')
                                      : Number('8' + (idx + 1)),
                                    idx === 0 ? 4 : Number('17' + (idx - 1))
                                  );

                                  if (e.key === 'ArrowDown') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(idx + 1, true, '');
                                    }
                                  }
                                  if (e.key === 'ArrowUp') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(idx - 1, true, '');
                                    }
                                  }
                                  if (e.key === 'Enter') {
                                    setBarcodeFocus(false);
                                    setSerialFocus(false);
                                    handleAddRow();
                                  }
                                }}
                              />{' '}
                              {productlist.length > 0 ? (
                                <div>
                                  <ul className={innerClasses.listbox}>
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
                                            {' '}
                                            <p> Name</p>
                                          </Grid>
                                          <Grid item xs={4}>
                                            <p>Purchased Price</p>
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
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                          setproductlist([]);
                                          selectProduct(option, idx);
                                          setBarcodeFocus(false);
                                          setSerialFocus(false);
                                          setProductName('');
                                        }}
                                      >
                                        <Button
                                          className={innerClasses.liBtn}
                                          disableRipple
                                          ref={(el) =>
                                            (inputRef.current[
                                              Number('8' + idx + '0' + index)
                                            ] = el)
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === 'Escape') {
                                              setproductlist([]);
                                              setProductName('');
                                              setEditTable(
                                                idx,
                                                true,
                                                Number('8' + idx)
                                              );
                                            }
                                            handleKeyDown(
                                              e,
                                              '8' + idx + '0' + (index - 1),
                                              0,
                                              '8' + idx + '0' + (index + 1),
                                              0
                                            );
                                            if (e.key === 'Enter') {
                                              setproductlist([]);
                                              selectProduct(option, idx);
                                              setBarcodeFocus(false);
                                              setSerialFocus(false);
                                              setProductName('');
                                            }
                                          }}
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
                                                {option.purchasedPrice
                                                  ? parseFloat(
                                                      option.purchasedPrice
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
                            {purchaseOrderTxnEnableFieldsMap.get(
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
                                (inputRef.current[Number('8' + idx)] = el)
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(idx + 1, true, '');
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(idx - 1, true, '');
                                  }
                                }
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('8' + (idx - 1)),
                                  Number('9' + idx),
                                  idx === items.length - 1
                                    ? productlist.length > 0
                                      ? Number('8' + idx + '00')
                                      : 18
                                    : productlist.length > 0
                                    ? Number('8' + idx + '00')
                                    : Number('8' + (idx + 1)),
                                  idx === 0 ? 4 : Number('17' + (idx - 1))
                                );
                                if (e.key === 'Enter') {
                                  handleAddRow();
                                }
                              }}
                              value={item.item_name}
                              InputProps={{
                                classes: { input: innerClasses.tableForm },
                                disableUnderline: true
                              }}
                            />
                            {purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                                (inputRef.current[Number('9' + idx)] = el)
                              }
                              onChange={(e) =>
                                inputOnChange(e, idx, setItemHSN)
                              }
                              value={item.hsn}
                              onKeyDown={(e) => {
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('9' + (idx - 1)),
                                  Number('10' + idx),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('9' + (idx + 1)),
                                  Number('8' + idx)
                                );
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('9' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('9' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                if (e.key === 'Enter') {
                                  handleAddRow();
                                }
                              }}
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

                      {purchaseOrderTxnEnableFieldsMap.get(
                        'enable_product_barcode'
                      ) && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <TextField
                              variant={'outlined'}
                              autoFocus={isBarcodeFocus ? true : false}
                              fullWidth
                              inputRef={(el) =>
                                (inputRef.current[Number('10' + idx)] = el)
                              }
                              value={item.barcode}
                              onChange={(e) =>
                                inputOnChange(e, idx, setItemBarcode)
                              }
                              onClick={(e) => {
                                setBarcodeFocus(true);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('10' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('10' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('10' + (idx - 1)),
                                  Number('11' + idx),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('10' + (idx + 1)),
                                  Number('9' + idx)
                                );
                                if (e.key === 'Enter') {
                                  setBarcodeFocus(true);
                                  handleAddRow();
                                }
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
                      )}

                      {/* Serial/IMEI No.  */}
                      {purchaseOrderTxnEnableFieldsMap.get(
                        'enable_product_serial_imei'
                      ) && (
                        <>
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <>
                                {item.serialNo && item.serialNo.length > 0 ? (
                                  <img
                                    alt="Logo"
                                    src={prodPlus}
                                    width="20px"
                                    height="20px"
                                    style={{
                                      marginTop: '2px',
                                      cursor: 'pointer'
                                    }}
                                    onClick={(e) => {
                                      launchSerialDataDialog(item, idx);
                                    }}
                                  />
                                ) : (
                                  <TextField
                                    variant={'outlined'}
                                    fullWidth
                                    inputRef={(el) =>
                                      (inputRef.current[Number('9' + idx)] = el)
                                    }
                                    value={item.serialOrImeiNo}
                                    autoFocus={isSerialFocus ? true : false}
                                    onClick={(e) => {
                                      setSerialFocus(true);
                                    }}
                                    onChange={(e) =>
                                      inputOnChange(e, idx, setSerialOrImeiNo)
                                    }
                                    onKeyDown={(e) => {
                                      handleKeyDown(
                                        e,
                                        idx === 0
                                          ? 25
                                          : Number('9' + (idx - 1)),
                                        Number('10' + idx),
                                        idx === items.length - 1
                                          ? 18
                                          : Number('9' + (idx + 1)),
                                        Number('8' + idx)
                                      );
                                      if (e.key === 'ArrowDown') {
                                        if (
                                          productlist.length === 0 &&
                                          idx >= 0
                                        ) {
                                          setEditTable(
                                            idx + 1,
                                            true,
                                            idx === items.length - 1
                                              ? ''
                                              : Number('9' + (idx + 1))
                                          );
                                        }
                                      }
                                      if (e.key === 'ArrowUp') {
                                        if (
                                          productlist.length === 0 &&
                                          idx >= 0
                                        ) {
                                          setEditTable(
                                            idx - 1,
                                            true,
                                            idx ? Number('9' + (idx - 1)) : ''
                                          );
                                        }
                                      }
                                      if (e.key === 'Enter') {
                                        setSerialFocus(true);
                                        handleAddRow();
                                      }
                                    }}
                                    InputProps={{
                                      classes: {
                                        input: classes.outlineinputProps
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                )}
                              </>
                            ) : (
                              <>
                                {item.serialNo && item.serialNo.length > 0 ? (
                                  <img
                                    alt="Logo"
                                    src={prodPlus}
                                    width="20px"
                                    height="20px"
                                    style={{
                                      marginTop: '2px',
                                      cursor: 'pointer'
                                    }}
                                  />
                                ) : (
                                  item.serialOrImeiNo
                                )}
                              </>
                            )}
                          </TableCell>
                        </>
                      )}

                      {/* Batch Number */}
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                                (inputRef.current[Number('9' + idx)] = el)
                              }
                              onChange={(e) =>
                                inputOnChange(e, idx, setItemBatchNumber)
                              }
                              value={item.batchNumber}
                              onKeyDown={(e) => {
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('9' + (idx - 1)),
                                  Number('10' + idx),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('9' + (idx + 1)),
                                  Number('8' + idx)
                                );
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('9' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('9' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                if (e.key === 'Enter') {
                                  handleAddRow();
                                }
                              }}
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                                (inputRef.current[Number('9' + idx)] = el)
                              }
                              onChange={(e) =>
                                inputOnChange(e, idx, setItemBrand)
                              }
                              value={item.brandName}
                              onKeyDown={(e) => {
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('9' + (idx - 1)),
                                  Number('10' + idx),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('9' + (idx + 1)),
                                  Number('8' + idx)
                                );
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('9' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('9' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                if (e.key === 'Enter') {
                                  handleAddRow();
                                }
                              }}
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                                (inputRef.current[Number('9' + idx)] = el)
                              }
                              onChange={(e) =>
                                inputOnChange(e, idx, setItemModelNumber)
                              }
                              value={item.modelNo}
                              onKeyDown={(e) => {
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('9' + (idx - 1)),
                                  Number('10' + idx),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('9' + (idx + 1)),
                                  Number('8' + idx)
                                );
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('9' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('9' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                if (e.key === 'Enter') {
                                  handleAddRow();
                                }
                              }}
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

                      {purchaseOrderTxnEnableFieldsMap.get(
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
                              inputRef={(el) =>
                                (inputRef.current[Number('11' + idx)] = el)
                              }
                              value={item.purchased_price}
                              onFocus={(e) =>
                                item.purchased_price === 0
                                  ? setMrp(idx, '')
                                  : ''
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
                              onChange={(e) => {
                                inputOnChange(e, idx, setMrp);
                                setItemNameForRandomProduct(idx, product_name);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('11' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('11' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('11' + (idx - 1)),
                                  Number('12' + idx),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('11' + (idx + 1)),
                                  Number('10' + idx)
                                );
                                if (e.key === 'Enter') {
                                  handleAddRow();
                                }
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
                            item.purchased_price
                          )}
                        </TableCell>
                      )}

                      {/* Price per gram*/}
                      {purchaseOrderTxnEnableFieldsMap.get(
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

                      {purchaseOrderTxnEnableFieldsMap.get(
                        'enable_product_qty'
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
                                (inputRef.current[Number('12' + idx)] = el)
                              }
                              onFocus={(e) =>
                                item.qty === 0 ? setQuantity(idx, '') : ''
                              }
                              value={item.qty}
                              type="number"
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
                                  setQuantity(idx, e.target.value);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('12' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('12' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('12' + (idx - 1)),
                                  Number('13' + idx),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('12' + (idx + 1)),
                                  Number('11' + idx)
                                );
                                if (e.key === 'Enter') {
                                  handleAddRow();
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
                      )}

                      {/* ********Free Quantity******* */}
                      {purchaseOrderTxnEnableFieldsMap.get(
                        'enable_product_free_quantity'
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
                                (inputRef.current[Number('12' + idx)] = el)
                              }
                              onFocus={(e) =>
                                item.freeQty === 0
                                  ? setFreeQuantity(idx, '')
                                  : ''
                              }
                              value={item.freeQty}
                              type="number"
                              onChange={(e) => {
                                if (
                                  e.target.value > 0 ||
                                  e.target.value === ''
                                ) {
                                  setFreeQuantity(idx, e.target.value);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('12' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('12' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('12' + (idx - 1)),
                                  Number('13' + idx),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('12' + (idx + 1)),
                                  Number('11' + idx)
                                );
                                if (e.key === 'Enter') {
                                  handleAddRow();
                                }
                              }}
                              onKeyPress={(event) => {
                                if (
                                  event?.key === '-' ||
                                  event?.key === '+' ||
                                  event?.key === 'e'
                                ) {
                                  event.preventDefault();
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
                      )}

                      {/* ********Unit******* */}
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                                      {(item.qtyUnit === '' || !item.qtyUnit) &&
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

                      {}
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                      if (
                                        productlist.length === 0 &&
                                        idx >= 0
                                      ) {
                                        setEditTable(
                                          idx + 1,
                                          true,
                                          idx === items.length - 1
                                            ? ''
                                            : Number('31' + (idx + 1))
                                        );
                                      }
                                    }
                                    if (e.key === 'ArrowUp') {
                                      if (
                                        productlist.length === 0 &&
                                        idx >= 0
                                      ) {
                                        setEditTable(
                                          idx - 1,
                                          true,
                                          idx ? Number('31' + (idx - 1)) : ''
                                        );
                                      }
                                    }
                                    handleKeyDown(
                                      e,
                                      idx === 0 ? 21 : Number('31' + (idx - 1)),
                                      Number('10' + idx),
                                      idx === items.length - 1
                                        ? 15
                                        : Number('31' + (idx + 1)),
                                      Number('30' + idx)
                                    );
                                    if (e.key === 'Enter') {
                                      handleAddRow();
                                    }
                                  }}
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

                      {(purchaseOrderTxnEnableFieldsMap.get(
                        'enable_product_making_charge'
                      ) ||
                        purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
                        'enable_product_purity'
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
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

                      {purchaseOrderTxnEnableFieldsMap.get(
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

                      {taxSettingsData.enableGst &&
                        isCGSTSGSTEnabledByPOS === true && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <div>
                                <TextField
                                  variant={'outlined'}
                                  inputRef={(el) =>
                                    (inputRef.current[Number('13' + idx)] = el)
                                  }
                                  onFocus={(e) =>
                                    item.cgst === 0 ? setCGST(idx, '') : ''
                                  }
                                  type="number"
                                  onChange={(e) =>
                                    inputOnChange(e, idx, setCGST)
                                  }
                                  value={item.cgst}
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                      if (
                                        productlist.length === 0 &&
                                        idx >= 0
                                      ) {
                                        setEditTable(
                                          idx + 1,
                                          true,
                                          idx === items.length - 1
                                            ? ''
                                            : Number('13' + (idx + 1))
                                        );
                                      }
                                    }
                                    if (e.key === 'ArrowUp') {
                                      if (
                                        productlist.length === 0 &&
                                        idx >= 0
                                      ) {
                                        setEditTable(
                                          idx - 1,
                                          true,
                                          idx ? Number('13' + (idx - 1)) : ''
                                        );
                                      }
                                    }
                                    handleKeyDown(
                                      e,
                                      idx === 0 ? 25 : Number('13' + (idx - 1)),
                                      Number('32' + idx),
                                      idx === items.length - 1
                                        ? 18
                                        : Number('13' + (idx + 1)),
                                      Number('12' + idx)
                                    );
                                    if (e.key === 'Enter') {
                                      handleAddRow();
                                    }
                                  }}
                                  className={classes.selectMaterial}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              </div>
                            ) : (
                              item.cgst
                            )}
                          </TableCell>
                        )}
                      {taxSettingsData.enableGst &&
                        isCGSTSGSTEnabledByPOS === true && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <div>
                                <TextField
                                  variant={'outlined'}
                                  disabled="true"
                                  value={parseFloat(
                                    item.cgst_amount.toFixed(2)
                                  )}
                                  className={classes.selectMaterial}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              </div>
                            ) : (
                              parseFloat(item.cgst_amount).toFixed(2)
                            )}
                          </TableCell>
                        )}
                      {taxSettingsData.enableGst &&
                        isCGSTSGSTEnabledByPOS === true && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <div>
                                <TextField
                                  variant={'outlined'}
                                  onChange={(e) =>
                                    inputOnChange(e, idx, setSGST)
                                  }
                                  inputRef={(el) =>
                                    (inputRef.current[Number('14' + idx)] = el)
                                  }
                                  type="number"
                                  onFocus={(e) =>
                                    item.sgst === 0 ? setSGST(idx, '') : ''
                                  }
                                  value={item.sgst}
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                      if (
                                        productlist.length === 0 &&
                                        idx >= 0
                                      ) {
                                        setEditTable(
                                          idx + 1,
                                          true,
                                          idx === items.length - 1
                                            ? ''
                                            : Number('14' + (idx + 1))
                                        );
                                      }
                                    }
                                    if (e.key === 'ArrowUp') {
                                      if (
                                        productlist.length === 0 &&
                                        idx >= 0
                                      ) {
                                        setEditTable(
                                          idx - 1,
                                          true,
                                          idx ? Number('14' + (idx - 1)) : ''
                                        );
                                      }
                                    }
                                    handleKeyDown(
                                      e,
                                      idx === 0 ? 25 : Number('14' + (idx - 1)),
                                      Number('33' + idx),
                                      idx === items.length - 1
                                        ? 18
                                        : Number('14' + (idx + 1)),
                                      Number('32' + idx)
                                    );
                                    if (e.key === 'Enter') {
                                      handleAddRow();
                                    }
                                  }}
                                  className={classes.selectMaterial}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              </div>
                            ) : (
                              item.sgst
                            )}{' '}
                          </TableCell>
                        )}
                      {taxSettingsData.enableGst &&
                        isCGSTSGSTEnabledByPOS === true && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <div>
                                <TextField
                                  variant={'outlined'}
                                  disabled="true"
                                  value={parseFloat(item.sgst_amount).toFixed(
                                    2
                                  )}
                                  className={classes.selectMaterial}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              </div>
                            ) : (
                              parseFloat(item.sgst_amount).toFixed(2)
                            )}{' '}
                          </TableCell>
                        )}
                      {taxSettingsData.enableGst &&
                        purchaseOrderTxnEnableFieldsMap.get(
                          'enable_product_igst'
                        ) &&
                        isCGSTSGSTEnabledByPOS === false && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <div>
                                <TextField
                                  variant={'outlined'}
                                  onChange={(e) =>
                                    inputOnChange(e, idx, setIGST)
                                  }
                                  value={item.igst}
                                  inputRef={(el) =>
                                    (inputRef.current[Number('15' + idx)] = el)
                                  }
                                  onFocus={(e) =>
                                    item.igst === 0 ? setIGST(idx, '') : ''
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'ArrowDown') {
                                      if (
                                        productlist.length === 0 &&
                                        idx >= 0
                                      ) {
                                        setEditTable(
                                          idx + 1,
                                          true,
                                          idx === items.length - 1
                                            ? ''
                                            : Number('15' + (idx + 1))
                                        );
                                      }
                                    }
                                    if (e.key === 'ArrowUp') {
                                      if (
                                        productlist.length === 0 &&
                                        idx >= 0
                                      ) {
                                        setEditTable(
                                          idx - 1,
                                          true,
                                          idx ? Number('15' + (idx - 1)) : ''
                                        );
                                      }
                                    }
                                    handleKeyDown(
                                      e,
                                      idx === 0 ? 25 : Number('15' + (idx - 1)),
                                      Number('34' + idx),
                                      idx === items.length - 1
                                        ? 15
                                        : Number('15' + (idx + 1)),
                                      Number('33' + idx)
                                    );
                                    if (e.key === 'Enter') {
                                      handleAddRow();
                                    }
                                  }}
                                  className={classes.selectMaterial}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              </div>
                            ) : (
                              item.igst
                            )}{' '}
                          </TableCell>
                        )}
                      {taxSettingsData.enableGst &&
                        purchaseOrderTxnEnableFieldsMap.get(
                          'enable_product_igst'
                        ) &&
                        isCGSTSGSTEnabledByPOS === false && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <div>
                                <TextField
                                  variant={'outlined'}
                                  disabled="true"
                                  value={parseFloat(item.igst_amount).toFixed(
                                    2
                                  )}
                                  className={classes.selectMaterial}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              </div>
                            ) : (
                              parseFloat(item.igst_amount).toFixed(2)
                            )}{' '}
                          </TableCell>
                        )}
                      {/* Tax Included */}
                      {taxSettingsData.enableGst &&
                        purchaseOrderTxnEnableFieldsMap.get(
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
                      {purchaseOrderTxnEnableFieldsMap.get(
                        'enable_product_cess'
                      ) && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <div>
                              <TextField
                                variant={'outlined'}
                                onChange={(e) => inputOnChange(e, idx, setCess)}
                                inputRef={(el) =>
                                  (inputRef.current[Number('16' + idx)] = el)
                                }
                                onFocus={(e) =>
                                  item.cess === 0 ? setCess(idx, '') : ''
                                }
                                value={item.cess}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(
                                        idx + 1,
                                        true,
                                        idx === items.length - 1
                                          ? ''
                                          : Number('16' + (idx + 1))
                                      );
                                    }
                                  }
                                  if (e.key === 'ArrowUp') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(
                                        idx - 1,
                                        true,
                                        idx ? Number('16' + (idx - 1)) : ''
                                      );
                                    }
                                  }
                                  handleKeyDown(
                                    e,
                                    idx === 0 ? 25 : Number('16' + (idx - 1)),
                                    Number('17' + idx),
                                    idx === items.length - 1
                                      ? 18
                                      : Number('16' + (idx + 1)),
                                    Number('15' + idx)
                                  );
                                  if (e.key === 'Enter') {
                                    handleAddRow();
                                  }
                                }}
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
                      )}

                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.isEdit ? (
                          <div className={classes.wrapper}>
                            <TextField
                              variant={'outlined'}
                              fullWidth
                              inputRef={(el) =>
                                (inputRef.current[Number('17' + idx)] = el)
                              }
                              readOnly={true}
                              value={item.amount}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('17' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('17' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('17' + (idx - 1)),
                                  Number('30' + idx),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('17' + (idx + 1)),
                                  Number('16' + idx)
                                );
                                if (e.key === 'Enter') {
                                  handleAddRow();
                                }
                              }}
                              onChange={(e) => inputOnChange(e, idx, getAmount)}
                              InputProps={{
                                classes: { input: innerClasses.tableForm },
                                disableUnderline: true
                              }}
                            />
                            <Button
                              ref={(el) =>
                                (inputRef.current[Number('30' + idx)] = el)
                              }
                              style={{
                                padding: '0px',
                                width: '100%'
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx + 1,
                                      true,
                                      idx === items.length - 1
                                        ? ''
                                        : Number('17' + (idx + 1))
                                    );
                                  }
                                }
                                if (e.key === 'ArrowUp') {
                                  if (productlist.length === 0 && idx >= 0) {
                                    setEditTable(
                                      idx - 1,
                                      true,
                                      idx ? Number('17' + (idx - 1)) : ''
                                    );
                                  }
                                }
                                handleKeyDown(
                                  e,
                                  idx === 0 ? 25 : Number('29' + (idx - 1)),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('8' + (idx + 1)),
                                  idx === items.length - 1
                                    ? 18
                                    : Number('29' + (idx + 1)),
                                  Number('17' + idx)
                                );
                                if (e.key === 'Enter') {
                                  deleteRow(idx);
                                }
                              }}
                            >
                              <DeleteOutlined
                                color="secondary"
                                style={{ marginTop: '6px' }}
                                onClick={() => deleteRow(idx)}
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
                                // inputRef={(el) =>
                                // (inputRef.current[salesRefsValue.discountRef] =
                                //   el)
                                // }
                                type="number"
                                autoComplete="off"
                                onFocus={(e) =>
                                  billDetails.discount_percent === 0
                                    ? setDiscountPercentForAllItems('')
                                    : ''
                                }
                                InputProps={{ disableUnderline: true }}
                                onChange={(e) =>
                                  setDiscountPercentForAllItems(e.target.value)
                                }
                                value={billDetails.discountPercentForAllItems}
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
                                value={billDetails.discountPercentForAllItems}
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
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddRow}
                      ref={(el) => (inputRef.current[18] = el)}
                      onKeyDown={(e) => {
                        handleKeyDown(
                          e,
                          Number('8' + (items.length - 1)),
                          19,
                          19,
                          Number('17' + (items.length - 1))
                        );

                        if (e.key === 'ArrowUp') {
                          setEditTable(items.length - 1, true, '');
                        }
                        if (e.key === 'Enter') {
                          handleAddRow();
                        }
                      }}
                      className={innerClasses.buttonFocus}
                      // disableRipple
                    >
                      Add Row{' '}
                    </Button>
                  </TableCell>

                  {isJewellery && metalList && metalList.length > 0 && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {/* HSN */}
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_hsn'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_barcode'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Serial/IMEI No.  */}
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_serial_imei'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Batch Number */}
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_batch_number'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Brand */}
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_brand'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Model Number */}
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_model_no'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_price'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_qty'
                  ) && (
                    <TableCell colSpan="1" style={{ textAlign: 'center' }}>
                      {getTotalQuantity()}
                    </TableCell>
                  )}

                  {/* ********Free Quantity******* */}
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_free_quantity'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* ********Unit******* */}
                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_unit'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_gross_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalGrossWeight}
                          {'g'}
                        </Typography>
                      </TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_stone_weight'
                  ) && (
                    <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                      <Typography component="subtitle2">
                        {getTotalStoneWeight}
                        {'g'}
                      </Typography>
                    </TableCell>
                  )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_net_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalNetWeight}
                          {'g'}
                        </Typography>
                      </TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_wastage'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="2" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalWatage}
                          {'g'}
                        </Typography>
                      </TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="2"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="1"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {(purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    purchaseOrderTxnEnableFieldsMap.get(
                      'enable_product_making_charge_per_gram'
                    )) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="1"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_stone_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_purity'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_hallmark_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_certification_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_discount'
                  ) && <TableCell colSpan="2"></TableCell>}

                  {taxSettingsData.enableGst &&
                    isCGSTSGSTEnabledByPOS === true && (
                      <TableCell colSpan="4"></TableCell>
                    )}

                  {taxSettingsData.enableGst &&
                    purchaseOrderTxnEnableFieldsMap.get(
                      'enable_product_igst'
                    ) &&
                    isCGSTSGSTEnabledByPOS === false && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  {taxSettingsData.enableGst &&
                    purchaseOrderTxnEnableFieldsMap.get(
                      'enable_tax_included'
                    ) && <TableCell colSpan="1"></TableCell>}

                  {purchaseOrderTxnEnableFieldsMap.get(
                    'enable_product_cess'
                  ) && <TableCell colSpan="1"></TableCell>}

                  <TableCell colSpan="2" style={{ textAlign: 'center' }}>
                    <Typography
                      style={{
                        float: 'center',
                        position: 'relative'
                      }}
                      component="span"
                    >
                      {billDetails.sub_total}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <div style={{ width: '100%' }}>
            <Grid
              container
              style={{
                backgroundColor: '#EBEBEB',
                padding: '10px 5px 10px 5px',
                height: '80px'
              }}
              className={[classes.root, classes.paymentTypeWrap]}
            >
              {purchaseOrderTxnEnableFieldsMap.get('enable_bill_notes') ? (
                <Grid item xs={12}>
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
                    value={billDetails.notes}
                  ></TextField>
                </Grid>
              ) : (
                <Grid item xs={5}></Grid>
              )}
              {/* <Grid item xs={1}></Grid> */}

              {/* Payment Type Disabled as per the ticket 1902 */}
              {/* <Grid item xs={2}>
                <Grid container>
                  <Grid item xs={4} className={innerClasses.alignCenter}>
                    <div>Payment Type</div>
                  </Grid>
                  <Grid item xs={7}>
                    <div>
                      <div>
                        <TextField
                          inputRef={(el) =>
                            (inputRef.current[inputRef.paymentTypeRef] = el)
                          }
                          // onChange={(e) => {
                          //   setPaymentType(e.target.value);
                          //   handlePaymentFocusExisted();
                          // }}
                          value={payment_type_val}
                          inputProps={{
                            style: {
                              padding: 10
                            }
                          }}
                          className={classes.selectData}
                          variant="standard"
                          onClick={(e) => {
                            setPaymentModeMenuOpenStatus(false);
                            setMenuOpenStatus(false);
                            setPaymentTypeMenuOpenStatus(true);
                          }}
                          // onBlur={(e) => {setPaymentTypeMenuOpenStatus(false)}}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setPaymentTypeMenuOpenStatus(false);
                            }
                            if (e.key === 'Enter') {
                              setPaymentTypeMenuOpenStatus(true);
                            } else {
                              if (!paymentMenuOpenStatus) {
                                if (
                                  inputRef.payment_type !== 'cash' &&
                                  billDetails.payment_type !== 'cheque'
                                ) {
                                  handleKeyDown(
                                    e,
                                    inputRef.customerNameRefVal,
                                    inputRef.paymentModeRef,
                                    inputRef.productNameRef,
                                    inputRef.cancelBtnRef
                                  );
                                } else {
                                  if (
                                    transaction.sales.prefixesList.length > 0 &&
                                    !isUpdate
                                  ) {
                                    handleKeyDown(
                                      e,
                                      inputRef.customerNameRefVal,
                                      inputRef.prefixesRef,
                                      inputRef.firstIndexProductNameRef,
                                      inputRef.cancelBtnRef
                                    );
                                  } else if (
                                    transaction.sales.subPrefixesList.length >
                                      0 &&
                                    !isUpdate
                                  ) {
                                    handleKeyDown(
                                      e,
                                      inputRef.customerNameRefVal,
                                      inputRef.subPrefixesRef,
                                      inputRef.firstIndexProductNameRef,
                                      inputRef.cancelBtnRef
                                    );
                                  } else {
                                    handleKeyDown(
                                      e,
                                      inputRef.customerNameRefVal,
                                      inputRef.invoiceDateRef,
                                      inputRef.firstIndexProductNameRef,
                                      inputRef.cancelBtnRef
                                    );
                                  }
                                }
                              } else {
                                handleKeyDown(
                                  e,
                                  inputRef.noRef,
                                  inputRef.noRef,
                                  inputRef.paymentTypeFirstIndexRef,
                                  inputRef.noRef
                                );
                              }
                            }
                          }}
                        ></TextField>

                        {paymentMenuOpenStatus ? (
                          <>
                            <ul className={innerClasses.PlaceOfsupplyListbox}>
                              <div>
                                {payment_type_list.map((option, index) => (
                                  <li
                                    style={{ cursor: 'pointer' }}
                                    key={`${index}customer`}
                                  >
                                    <Button
                                      className={innerClasses.liBtn}
                                      disableRipple
                                      onClick={(e) => {
                                        setPaymentType(option.val);
                                        setPaymentTypeMenuOpenStatus(false);
                                        if (
                                          option.val !== 'cash' &&
                                          option.val !== 'cheque'
                                        ) {
                                          setBankIdDetails(option.val);
                                        }
                                        setFocusLastIndex(
                                          inputRef.paymentTypeRef
                                        );
                                      }}
                                      ref={(el) =>
                                        (inputRef.current[
                                          Number(
                                            inputRef.paymentTypeRef + '0' + index
                                          )
                                        ] = el)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          setPaymentTypeMenuOpenStatus(false);
                                        }
                                        handleKeyDown(
                                          e,
                                          Number(
                                            inputRef.paymentTypeRef +
                                              '0' +
                                              (index - 1)
                                          ),
                                          0,
                                          Number(
                                            inputRef.paymentTypeRef +
                                              '0' +
                                              (index + 1)
                                          ),
                                          0
                                        );
                                        if (e.key === 'Enter') {
                                          setPaymentType(option.val);
                                          setPaymentTypeMenuOpenStatus(false);
                                          if (
                                            billDetails.payment_type !== 'cash' &&
                                            billDetails.payment_type !== 'cheque'
                                          ) {
                                            setBankIdDetails(option.val);
                                          }
                                          setFocusLastIndex(
                                            inputRef.paymentTypeRef
                                          );
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
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
              {billDetails.payment_type !== 'cash' &&
              billDetails.payment_type !== 'cheque' ? (
                <Grid item xs={2}>
                  <Grid container>
                    <Grid item xs={4} className={innerClasses.alignCenter}>
                      <div>Payment Mode</div>
                    </Grid>
                    <Grid item xs={7}>
                      <div>
                        <div>
                          <TextField
                            inputRef={(el) =>
                              (inputRef.current[inputRef.paymentModeRef] = el)
                            }
                            // onChange={(e) => {
                            //   setPaymentType(e.target.value);
                            //   handlePaymentFocusExisted();
                            // }}
                            value={payment_mode_val}
                            inputProps={{
                              style: {
                                padding: 10
                              }
                            }}
                            className={classes.selectData}
                            variant="standard"
                            onClick={(e) => {
                              setMenuOpenStatus(false);
                              setPaymentTypeMenuOpenStatus(false);
                              setPaymentModeMenuOpenStatus(true);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setPaymentModeMenuOpenStatus(false);
                              }
                              if (e.key === 'Enter') {
                                setPaymentModeMenuOpenStatus(true);
                              } else {
                                if (!paymentModeMenuOpenStatus) {
                                  if (
                                    transaction.sales.prefixesList.length > 0 &&
                                    !isUpdate
                                  ) {
                                    handleKeyDown(
                                      e,
                                      inputRef.customerNameRefVal,
                                      inputRef.prefixesRef,
                                      inputRef.firstIndexProductNameRef,
                                      inputRef.paymentTypeRef
                                    );
                                  } else if (
                                    transaction.sales.subPrefixesList.length >
                                      0 &&
                                    !isUpdate
                                  ) {
                                    handleKeyDown(
                                      e,
                                      inputRef.customerNameRefVal,
                                      inputRef.subPrefixesRef,
                                      inputRef.firstIndexProductNameRef,
                                      inputRef.paymentTypeRef
                                    );
                                  } else {
                                    handleKeyDown(
                                      e,
                                      inputRef.customerNameRefVal,
                                      inputRef.invoiceDateRef,
                                      inputRef.firstIndexProductNameRef,
                                      inputRef.paymentTypeRef
                                    );
                                  }
                                } else {
                                  handleKeyDown(
                                    e,
                                    inputRef.noRef,
                                    inputRef.noRef,
                                    inputRef.paymentModeFirstIndexRef,
                                    inputRef.noRef
                                  );
                                }
                              }
                            }}
                          ></TextField>

                          {paymentModeMenuOpenStatus ? (
                            <>
                              <ul className={innerClasses.PlaceOfsupplyListbox}>
                                <div>
                                  {payment_mode_list.map((option, index) => (
                                    <li
                                      style={{ cursor: 'pointer' }}
                                      key={`${index}customer`}
                                    >
                                      <Button
                                        className={innerClasses.liBtn}
                                        disableRipple
                                        onClick={(e) => {
                                          setPaymentMode(option.val);
                                          setPaymentModeMenuOpenStatus(false);
                                          setFocusLastIndex(
                                            inputRef.paymentModeRef
                                          );
                                        }}
                                        ref={(el) =>
                                          (inputRef.current[
                                            Number(
                                              inputRef.paymentModeRef +
                                                '0' +
                                                index
                                            )
                                          ] = el)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            setPaymentModeMenuOpenStatus(false);
                                          }
                                          handleKeyDown(
                                            e,
                                            Number(
                                              inputRef.paymentModeRef +
                                                '0' +
                                                (index - 1)
                                            ),
                                            0,
                                            Number(
                                              inputRef.paymentModeRef +
                                                '0' +
                                                (index + 1)
                                            ),
                                            0
                                          );
                                          if (e.key === 'Enter') {
                                            setPaymentModeMenuOpenStatus(false);
                                            setFocusLastIndex(
                                              inputRef.paymentModeRef
                                            );
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
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={2}></Grid>
              )}
              {billDetails.payment_type !== 'cash' ? (
                <Grid item xs={2}>
                  <Grid container>
                    <Grid item xs={4} className={innerClasses.alignCenter}>
                      <div>Payment Ref No.</div>
                    </Grid>
                    <Grid item xs={7}>
                      <div>
                        <div>
                          <TextField
                            variant={'standard'}
                            value={billDetails.paymentReferenceNumber}
                            margin="dense"
                            inputRef={(el) =>
                              (inputRef.current[inputRef.ewayBillNoRef] = el)
                            }
                            onChange={(e) =>
                              setPaymentReferenceNumber(e.target.value)
                            }
                            onKeyDown={(e) => {
                              handleKeyDown(
                                e,
                                inputRef.saveBtnRef,
                                inputRef.cancelBtnRef,
                                inputRef.paymentTypeRef,
                                inputRef.addProductBtnRef
                              );

                              if (e.key === 'ArrowDown') {
                                setEditTable(0, true, '');
                              }
                            }}
                          ></TextField>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid item xs={2}></Grid>
              )} */}
            </Grid>
          </div>
        </div>

        {/*------------------------------------- Dialog Footer----------------------------------- */}
        <div className={[classes.footer]} style={{ height: '230px' }}>
          <Grid container>
            <Grid
              item
              xs={12}
              style={{ paddingTop: '15px', paddingBottom: '15px' }}
            >
              <FileUpload
                onFilesUpload={handleFilesUpload}
                uploadedFiles={billDetails.imageUrls}
              />
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-between"
            style={{ paddingTop: '7px' }}
            className={[classes.root, classes.paymentTypeWrap]}
          >
            <Grid item xs={3}>
              {purchaseOrderTxnEnableFieldsMap.get('enable_bill_discount') && (
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
                          billDetails.discount_type === 'percentage' ? '%' : '₹'
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
                            type="number"
                            autoComplete="off"
                            InputProps={{
                              inputProps: {
                                min: 0
                              },
                              disableUnderline: true
                            }}
                            onChange={(e) => {
                              if (billDetails.discount_type === 'percentage') {
                                setDiscount(e.target.value);
                              } else {
                                setDiscountAmount(e.target.value);
                              }
                            }}
                            value={
                              billDetails.discount_type === 'percentage'
                                ? billDetails.discount_percent
                                : billDetails.discount_amount
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>

            <Grid item xs={3}>
              <Grid container direction="row" spacing={0} alignItems="center">
                <Grid item xs={12} sm={5} />

                <Grid xs={1} item></Grid>

                <Grid item xs={12} sm={5} />
              </Grid>
            </Grid>

            {billDetails.is_credit || isUpdate ? (
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
                      {/* <Typography>Paid</Typography> */}
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
                      {/* {isUpdate || !isUpdate ? (
                        <TextField
                          className="total-wrapper-form"
                          id="received-payment"
                          inputRef={(el) =>
                            (inputRef.current[inputRef.receivedPaymentRef] = el)
                          }
                          autoComplete="off"
                          type="number"
                          onFocus={(e) =>
                            billDetails.paid_amount === 0 ? setPaid('') : ''
                          }
                          onChange={(e) =>
                            setPaid(e.target.value ? e.target.value : 0)
                          }
                          onKeyDown={(e) => {
                            handleKeyDown(
                              e,
                              inputRef.addRowRef,
                              inputRef.saveBtnRef,
                              inputRef.saveBtnRef,
                              inputRef.discountAmountRef
                            );
                          }}
                          InputProps={{ disableUnderline: true }}
                          value={billDetails.paid_amount}
                        />
                      ) : (
                        <TextField
                          className="total-wrapper-form"
                          id="received-payment"
                          placeholder="0"
                          InputProps={{ disableUnderline: true }}
                          value={billDetails.paid_amount}
                        />
                      )} */}
                    </Grid>
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
            <Grid item xs={6} style={{ marginTop: '25px' }}>
              <>
                {billDetails.status === 'close' && isRestore === true && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.footercontrols}
                    onClick={() => saveDataClick(false)}
                    ref={(el) => (inputRef.current[inputRef.saveBtnRef] = el)}
                  >
                    {' '}
                    Restore{' '}
                  </Button>
                )}
                {billDetails.status === 'open' && (
                  <>
                    <Button
                      variant="outlined"
                      color="secondary"
                      className={classes.footercontrols}
                      onClick={() => saveDataClick(false)}
                      ref={(el) => (inputRef.current[inputRef.saveBtnRef] = el)}
                      onKeyDown={(e) => {
                        if (inputRef.is_credit || isUpdate) {
                          handleKeyDown(
                            e,
                            inputRef.packingChargeRef,
                            inputRef.saveNewRef,
                            inputRef.customerNameRefVal,
                            inputRef.receivedPaymentRef
                          );
                        } else {
                          handleKeyDown(
                            e,
                            inputRef.packingChargeRef,
                            inputRef.saveNewRef,
                            inputRef.customerNameRefVal,
                            inputRef.discountAmountRef
                          );
                        }
                        if (e.key === 'Enter') {
                          saveDataClick(false);
                        }
                      }}
                    >
                      {' '}
                      Save{' '}
                    </Button>

                    <Button
                      variant="outlined"
                      color="secondary"
                      ref={(el) => (inputRef.current[inputRef.saveNewRef] = el)}
                      className={classes.footercontrols}
                      onClick={() => saveAndNewClick(false)}
                      onKeyDown={(e) => {
                        if (
                          (isUpdate || !isUpdate) &&
                          printerList &&
                          printerList.length > 0
                        ) {
                          handleKeyDown(
                            e,
                            inputRef.packingChargeRef,
                            inputRef.printNewRef,
                            inputRef.customerNameRefVal,
                            inputRef.saveBtnRef
                          );
                        } else {
                          handleKeyDown(
                            e,
                            inputRef.packingChargeRef,
                            inputRef.customerNameRefVal,
                            inputRef.customerNameRefVal,
                            inputRef.saveBtnRef
                          );
                        }
                        if (e.key === 'Enter') {
                          saveAndNewClick(false);
                        }
                      }}
                    >
                      Save & New{' '}
                    </Button>

                    {printerList && printerList.length > 0 && (
                      <Button
                        variant="contained"
                        color="secondary"
                        ref={(el) => (inputRef.current[inputRef.printRef] = el)}
                        className={[classes.saveButton, classes.footercontrols]}
                        onClick={() => {
                          onPrintAndSaveClick();
                        }}
                        onKeyDown={(e) => {
                          handleKeyDown(
                            e,
                            inputRef.packingChargeRef,
                            inputRef.customerNameRefVal,
                            inputRef.customerNameRefVal,
                            inputRef.printNewRef
                          );

                          if (e.key === 'Enter') {
                            onPrintAndSaveClick();
                          }
                        }}
                      >
                        Save & Print{' '}
                      </Button>
                    )}
                  </>
                )}
              </>
            </Grid>

            <Grid item xs={2} style={{ marginTop: '35px' }}></Grid>

            <Grid item xs={2} style={{ marginTop: '30px' }}>
              <Grid container direction="row" spacing={0} alignItems="center">
                <Grid item xs={12} sm={6} className={innerClasses.formWrapper}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={billDetails.is_roundoff}
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
                style={{ marginTop: '-2px', marginLeft: '-12px' }}
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

        {OpenPurchaseOrderBatchList ? (
          <PurchaseOrderBatchListModal
            open={OpenPurchaseOrderBatchList}
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleBatchListModalClose}
          />
        ) : null}

        {OpenPurchaseOrderSerialList ? (
          <PurchaseOrderSerialListModal
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleSerialListModalClose}
          />
        ) : null}

        {openAddressList ? (
          <PurchaseOrderAddressListModal
            open={openAddressList}
            addressList={customerAddressList}
            onClose={handleCloseAddressList}
          />
        ) : null}

        <Dialog
          fullScreen={fullScreen}
          open={openPurchaseOrderValidationMessage}
          onClose={handleClosePurchaseOrderValidationAlertMessage}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>{errorAlertMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClosePurchaseOrderValidationAlertMessage}
              color="primary"
              autoFocus
            >
              OK
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
              Paid amount can't be more than the purchase order amount.
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
        open={openVendorNotProvidedAlert}
        onClose={handleVendorNotProvidedAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>Please Choose Vendor from list.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleVendorNotProvidedAlertClose}
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
            Purchase Order cannot be performed without adding products.
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
        open={openPurchaseOrderLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Purchase order is being created!!!</p>
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
        open={openPurchaseOrderErrorAlertMessage}
        onClose={handleClosePurchaseOrderErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Purchase order. Please try again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePurchaseOrderErrorAlertMessage}
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
        open={openTotalZeoAlert}
        onClose={handleCloseTotalZeroAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText>Total cannot be zero.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTotalZeroAlert} color="primary" autoFocus>
            Ok
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
    store.PurchaseOrderStore;
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
export default injectWithObserver(AddPurchaseOrder);