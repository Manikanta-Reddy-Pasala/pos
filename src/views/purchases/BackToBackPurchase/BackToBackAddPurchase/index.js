import React, { forwardRef, useState, useEffect, useRef } from 'react';
import {
  Cancel,
  DeleteOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp
} from '@material-ui/icons';
import {
  Select,
  Slide,
  Button,
  Dialog,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Switch,
  DialogActions,
  TextField,
  Checkbox,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  makeStyles,
  InputAdornment,
  Input,
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
import moment from 'moment';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import VendorModal from 'src/views/Vendors/modal/AddVendor';
import PurchaseBatchListModal from 'src/components/modal/PurchaseBatchListModal';
import plus from '../../../../icons/plus.png';
import prodPlus from '../../../../icons/prod_plus.png';
import * as Bd from '../../../../components/SelectedBusiness';
import Loader from 'react-js-loader';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import { styled } from '@material-ui/styles';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
import * as balanceUpdate from 'src/components/Helpers/CustomerAndVendorBalanceHelper';

var dateFormat = require('dateformat');

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useInnerStyles = makeStyles((theme) => ({
  headerFooterWrapper: {
    padding: '10px',
    margin: 0
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
  employeeFormWrapper: {
    marginBottom: 35,
    '& .employee-wrapper-form': {
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
        textAlign: 'left'
      }
    }
  },
  formpadding: {
    padding: '0px 1rem',
    '& .formLabel': {
      position: 'relative',
      top: 15
    }
  },
  content: {
    position: 'absolute',
    top: '60px',
    bottom: '150px',
    left: '10px',
    right: '10px',
    overflow: 'auto',
    '@media (max-width: 1500px)': {
      top: '8%'
    }
  },
  row2Settings: {
    position: 'absolute',
    top: '60px',
    bottom: '50px',
    left: '0px',
    right: '0px',
    overflow: 'auto'
  },
  total_val: {
    marginTop: '21px',
    border: '3px solid #9DCB6A'
  },
  total_design: {
    marginBottom: '13px !important',
    background: '#9DCB6A',
    borderBottomLeftRadius: '20px',
    borderTopLeftRadius: '20px',
    padding: '6px 0px 5px 12px',
    color: 'white'
  },
  prcnt: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 'medium'
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
  input: {
    width: '90%'
  },
  PlaceOfsupplyListbox: {
    // minWidth: '38%',
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
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  outlinedInput: {
    width: '70%',
    marginTop: '8px',
    marginBottom: '4px',
    fontSize: 'small'
  },
  buttonFocus: {
    '&:focus': {
      border: '1px solid'
    }
  },
  selectOptn: {
    minWidth: '85%',
    maxWidth: '88%',
    background: 'white'
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
  bottomFields: {
    color: 'black'
  }
}));

const ProdServSwitch = styled(Switch)({
  // '& .MuiSwitch-track': {
  //   backgroundColor: 'red'
  // },
  // '& .MuiSwitch-switchBase': {
  //   '&:not(.Mui-checked)': {
  //     color: 'red'
  //   }
  // }
});

const AddBackToBackPurchasesBill = (props) => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  const [vendorList, setVendorList] = React.useState();
  const [itemVendorList, setItemVendorList] = React.useState();

  const store = useStore();

  const {
    billDetails,
    items,
    OpenAddBackToBackPurchaseBill,
    OpenBatchList,
    taxSettingsData,
    FocusLastIndex,
    purchaseTxnEnableFieldsMap,
    openBackToBackPurchaseErrorAlertMessage,
    openBackToBackPurchaseLoadingAlertMessage,
    descriptionCollapsibleMap
  } = toJS(store.BackToBackPurchaseStore);

  const { setNotes, setBillDate, setItemUnit } = store.BackToBackPurchaseStore;

  const { transaction } = toJS(store.TransactionStore);
  const { getTransactionData } = store.TransactionStore;
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getTaxSettingsDetails } = store.TaxSettingsStore;

  const [rxdbSub, setRxdbSub] = useState([]);
  const [records, setRecords] = useState([]);
  const {
    getAmount,
    getTotalAmount,
    addNewItem,
    deleteItem,
    isUpdate,
    setItemBarcode,
    setQuantity,
    saveData,
    saveDataAndNew,
    closeDialog,
    selectProduct,
    setVendorName,
    setVendorId,
    setVendor,
    setInvoiceRegularSetting,
    setInvoiceThermalSetting,
    setEditTable,
    setFocusLastIndex,
    setPurchasedPrice,
    setItemNameForRandomProduct,
    setCGST,
    setSGST,
    setIGST,
    setCess,
    setTaxSettingsData,
    setItemHSN,
    setGrossWeight,
    setWastagePercentage,
    setWastageGrams,
    setNetWeight,
    setPurity,
    setTaxIncluded,
    setMakingCharge,
    setMakingChargeAmount,
    setMakingChargePerGramAmount,
    setItemDiscount,
    setItemDiscountAmount,
    getTotalNetWeight,
    getTotalGrossWeight,
    getTotalWatage,
    setSerialOrImeiNo,
    handleCloseBackToBackPurchaseErrorAlertMessage,
    handleOpenBackToBackPurchaseLoadingMessage,
    setMakingChargeIncluded,
    setFreeQuantity,
    setItemBatchNumber,
    setItemModelNumber,
    resetVendor,
    setItemPricePerGram,
    setItemStoneCharge,
    setItemStoneWeight,
    getTotalStoneWeight,
    setFreightCharge,
    setItemDescriptionCollapsibleIndex,
    setItemDescription,
    handleBatchListModalClose,
    setPurchaseTxnEnableFieldsMap,
    setItemVendor,
    setLRNumber,
    setVehicleNumber,
    setSupervisor,
    setMaterialsInCharge
  } = store.BackToBackPurchaseStore;

  const { getPurchaseTransSettingdetails } = store.PurchaseTransSettingsStore;

  const [openAmountAlert, setAmountAlert] = React.useState(false);
  const [openNoProductsAlert, setNoProductsAlert] = React.useState(false);
  const [isSaveCliked, setSaveClicked] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [productlist, setproductlist] = useState([]);
  const { handleAddProductModalOpen } = store.ProductStore;
  const [vendorNameWhileEditing, setVendorNameWhileEditing] = useState('');
  const [openVendorNotProvidedAlert, setVendorNotProvidedAlert] =
    React.useState(false);
  const { handleVendorModalOpenFromPurchases, resetVendorFromPurchases } =
    store.VendorStore;
  const { vendorDialogOpen, vendorFromPurchases } = toJS(store.VendorStore);
  const { selectedProduct, selectedIndex } = toJS(store.PurchasesAddStore);
  const [openNegativeBalanceAlert, setNegativeBalanceAlert] =
    React.useState(false);
  const [openNoBillNumberAlert, setNoBillNumberAlert] = React.useState(false);
  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);
  const [printerList, setPrinterList] = React.useState([]);
  const [isBarcodeFocus, setBarcodeFocus] = React.useState(true);
  const [product_name, setProductName] = React.useState();
  const [itemVendorName, setItemVendorName] = React.useState();

  const [isJewellery, setIsJewellery] = React.useState(false);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const [supervisorList, setSupervisorList] = React.useState();
  const [supervisorNameWhileEditing, setSupervisorNameWhileEditing] =
    useState('');

  const [materialInChargeList, setMaterialInChargeList] = React.useState();
  const [
    materialInChargeNameWhileEditing,
    setmaterialInChargeNameWhileEditing
  ] = useState('');

  const [openBalanceExceededAlert, setOpenBalanceExceededAlert] =
    React.useState(false);
  const { getAuditSettingsData } = store.AuditSettingsStore;

  const handleBalanceExceededAlertClose = () => {
    setOpenBalanceExceededAlert(false);
  };

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  useEffect(() => {
    async function fetchData() {
      setPurchaseTxnEnableFieldsMap(await getPurchaseTransSettingdetails());
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setIsJewellery(localStorage.getItem('isJewellery'));
      setTaxSettingsData(await getTaxSettingsDetails());
    }

    fetchData();
  }, []);

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

  const handleNoBillNumberClose = () => {
    setNoBillNumberAlert(false);
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

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const getItemVendorList = async (value) => {
    setItemVendorList(await getVendorAutoCompleteList(value));
  };

  const setTaxIncludedCheckerBox = (index) => {
    setTaxIncluded(index);
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

  const handleVendorClick = (vendor) => {
    setVendorName(vendor.name);
    setVendorId(vendor.id);
    setVendor(vendor);
    setVendorNameWhileEditing('');
    setVendorList([]);
    setEditTable(0, true, 1);
  };

  const handleVendorNotProvidedAlertClose = () => {
    setVendorNotProvidedAlert(false);
  };

  const deleteRow = (index) => {
    deleteItem(index);
  };

  const handleDateChange = (date, isDueDate) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setBillDate(date);
  };

  const handleAddRow = () => {
    setProductName('');
    setItemVendorName('');
    addNewItem();
  };

  const saveDataClick = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let isBalanceExceeded = await isBalanceLimitExceeded();

    if (isBalanceExceeded === true) {
      setOpenBalanceExceededAlert(true);
      return;
    }

    setSaveClicked(true);

    if (billDetails.transporterVendorName === '') {
      setVendorNotProvidedAlert(true);
    } else if (!billDetails.lrNumber || billDetails.lrNumber.trim() === '') {
      setNoBillNumberAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setProductName('');
      setItemVendorName('');
      setSaveClicked(false);

      handleOpenBackToBackPurchaseLoadingMessage();
      saveData(false)
        .then((data) => {
          console.log('Purchase data Inserted');
          // handleClose();
          // closeDialog();
        })
        .catch((err) => {
          console.log('Purchase Insertion Failed - ', err);
        });
    }
  };

  const saveAndNewClick = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let isBalanceExceeded = await isBalanceLimitExceeded();

    if (isBalanceExceeded === true) {
      setOpenBalanceExceededAlert(true);
      return;
    }

    setSaveClicked(false);

    if (billDetails.transporterVendorName === '') {
      setVendorNotProvidedAlert(true);
    } else if (!billDetails.lrNumber || billDetails.lrNumber.trim() === '') {
      setNoBillNumberAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setProductName('');
      setItemVendorName('');
      setSaveClicked(false);

      handleOpenBackToBackPurchaseLoadingMessage();
      saveDataAndNew(false)
        .then((data) => {
          console.log('Purchase data Inserted');
        })
        .catch((err) => {
          console.log('Purchase Insertion Failed - ', err);
        });
    }
  };

  const onPrintAndSaveClick = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let isBalanceExceeded = await isBalanceLimitExceeded();

    if (isBalanceExceeded === true) {
      setOpenBalanceExceededAlert(true);
      return;
    }

    setSaveClicked(true);

    if (billDetails.transporterVendorName === '') {
      setVendorNotProvidedAlert(true);
    } else if (!billDetails.lrNumber || billDetails.lrNumber.trim() === '') {
      setNoBillNumberAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setProductName('');
      setItemVendorName('');
      setInvoiceRegularSetting(invoiceRegular);
      setInvoiceThermalSetting(invoiceThermal);
      setSaveClicked(false);

      handleOpenBackToBackPurchaseLoadingMessage();

      saveData(true)
        .then((data) => {
          console.log('Purchase data Inserted');
        })
        .catch((err) => {
          console.log('Purchase Insertion Failed - ', err);
        });
    }
  };

  const isBalanceLimitExceeded = async () => {
    let isBalanceExceed = false;

    let customerData = await balanceUpdate.getCustomerBalanceById(
      billDetails.transporterVendorId
    );
    if (customerData.creditLimit > 0) {
      let fullBalance =
        parseFloat(customerData.totalBalance) + billDetails.freightCharge;
      if (fullBalance > customerData.creditLimit) {
        isBalanceExceed = true;
      }
    }

    return isBalanceExceed;
  };

  const isProductsValid = async () => {
    let isProductsValid = true;
    let errorMessage = '';

    let auditSettings = await getAuditSettingsData();

    if (purchaseTxnEnableFieldsMap.get('enable_product_price') === true) {
      for (var i = 0; i < items.length; i++) {
        let item = items[i];

        if (
          item.amount === 0 &&
          item.qty === 0 &&
          item.purchased_price === 0 &&
          items.length > 1 &&
          item.vendorName === ''
        ) {
          continue;
        }

        let slNo = i + 1;
        let itemMessage = '<br /><b>Sl No: </b>' + slNo + '<br />';
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
        if (item.vendorName === '') {
          itemValid = false;
          itemMessage += 'Vendor Name should be provided<br >';
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
      purchaseTxnEnableFieldsMap.get('enable_product_price_per_gram') === true
    ) {
      for (let i = 0; i < items.length; i++) {
        let item = items[i];

        if (item.amount === 0 && item.pricePerGram === 0 && items.length > 1) {
          continue;
        }

        let slNo = i + 1;
        let itemMessage = '<br /><b>Sl No: </b>' + slNo + '<br />';
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
        if (item.vendorName === '') {
          itemValid = false;
          itemMessage += 'Vendor Name should be provided<br >';
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
        let itemMessage = '<br /><b>Sl No: </b>' + slNo + '<br />';
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
        if (item.vendorName === '') {
          itemValid = false;
          itemMessage += 'Vendor Name should be provided<br >';
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

  const inputOnChange = (e, index, setFunction) => {
    e.persist();
    setFunction(index, e.target.value);

    let funcName = setFunction;

    if (funcName === 'setItemBarcode') {
      setBarcodeFocus(true);
    }
  };

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
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
    if (vendorFromPurchases && vendorFromPurchases.id) {
      setVendor(vendorFromPurchases);
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

  const handleSupervisorClick = (employee) => {
    setSupervisor(employee);

    setSupervisorNameWhileEditing('');
    setSupervisorList([]);
  };

  const getSupervisorList = async (value) => {
    if (value) {
      const db = await Db.get();
      let data;
      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      var regexpMobile = new RegExp(value + '.*$', 'i');
      const businessData = await Bd.getBusinessData();

      await db.employees
        .find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { name: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { userName: { $regex: regexpMobile } }
                ]
              }
            ]
          }
        })
        .limit(10)
        // .sort()
        .exec()
        .then((documents) => {
          data = documents.map((item) => item.toJSON());

          setSupervisorList(data);
        });
    } else {
      setSupervisorList([]);
    }
  };

  const handleMaterialInChargeClick = (employee) => {
    setMaterialsInCharge(employee);

    setmaterialInChargeNameWhileEditing('');
    setMaterialInChargeList([]);
  };

  const getMaterialInChargeList = async (value) => {
    if (value) {
      const db = await Db.get();
      let data;
      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      var regexpMobile = new RegExp(value + '.*$', 'i');
      const businessData = await Bd.getBusinessData();

      await db.employees
        .find({
          selector: {
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { name: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { userName: { $regex: regexpMobile } }
                ]
              }
            ]
          }
        })
        .limit(10)
        // .sort()
        .exec()
        .then((documents) => {
          data = documents.map((item) => item.toJSON());

          setMaterialInChargeList(data);
        });
    } else {
      setMaterialInChargeList([]);
    }
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
        open={OpenAddBackToBackPurchaseBill}
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
                      Procurement
                    </Button>
                  </Grid>

                  <Grid item xs={2} className={innerClasses.alignCenter}>
                    <div>
                      <TextField
                        fullWidth
                        placeholder="Select Transporter *"
                        className={innerClasses.input}
                        inputRef={(el) => (inputRef.current[1] = el)}
                        onKeyDown={(e) => {
                          handleKeyDown(e, 26, 2, 80, 0);
                          if (vendorList && vendorList.length > 0) {
                            if (e.key === 'Escape') {
                              setVendorNameWhileEditing('');
                              setVendorName('');
                              setVendorId('');
                              setVendorList([]);
                              setFocusLastIndex(1);
                            }
                            handleKeyDown(e, 26, 2, 1000, 0);
                          } else {
                            handleKeyDown(e, 26, 2, 25, 0);

                            if (e.key === 'ArrowDown') {
                              setEditTable(0, true, '');
                            }
                          }
                        }}
                        value={
                          billDetails.transporterVendorName === ''
                            ? vendorNameWhileEditing
                            : billDetails.transporterVendorName
                        }
                        onChange={(e) => {
                          if (e.target.value !== vendorNameWhileEditing) {
                            setVendorName('');
                            setVendorId('');
                            resetVendor();
                          }
                          getVendorList(e.target.value);
                          setVendorNameWhileEditing(e.target.value);
                        }}
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
                      {vendorList && vendorList.length > 0 ? (
                        <>
                          <ul
                            className={innerClasses.listbox}
                            style={{ width: '18%' }}
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
                                    key={`${index}vendor`}
                                    style={{ padding: 10, cursor: 'pointer' }}
                                    onClick={() => {
                                      handleVendorClick(option);
                                    }}
                                  >
                                    <Button
                                      className={innerClasses.liBtn}
                                      disableRipple
                                      ref={(el) =>
                                        (inputRef.current[
                                          Number('10' + index + '0')
                                        ] = el)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          setVendorNameWhileEditing('');
                                          setVendorName('');
                                          setVendorId('');
                                          setVendorList([]);
                                          setFocusLastIndex(1);
                                        }
                                        handleKeyDown(
                                          e,
                                          Number('10' + (index - 1) + '0'),
                                          0,
                                          Number('10' + (index + 1) + '0'),
                                          0
                                        );
                                        if (e.key === 'Enter') {
                                          handleVendorClick(option);
                                        }
                                      }}
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
                                        <Grid item style={{ color: 'black' }}>
                                          {' '}
                                          <span>
                                            {parseFloat(option.balance).toFixed(
                                              2
                                            )}
                                          </span>
                                          {option.balance > 0 ? (
                                            option.balanceType === 'Payable' ? (
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
                  </Grid>

                  {transaction.enableVendor && (
                    <Grid
                      item
                      xs={1}
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
                        disableRipple
                        className={innerClasses.buttonFocus}
                        ref={(el) => (inputRef.current[2] = el)}
                        onKeyDown={(e) => {
                          handleKeyDown(e, 26, 3, 25, 1);
                        }}
                        style={{
                          position: 'relative',
                          fontSize: 12
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
                    xs={1}
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
                      className={innerClasses.buttonFocus}
                      disableRipple
                      ref={(el) => (inputRef.current[3] = el)}
                      onKeyDown={(e) => {
                        handleKeyDown(e, 26, 36, 25, 2);
                        if (e.key === 'getEventKey') {
                          handleAddProductModalOpen();
                        }
                      }}
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
                    xs={2}
                    style={{
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      display: 'flex',
                      marginLeft: '20px'
                    }}
                  >
                    <Grid container className={innerClasses.alignCenter}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={innerClasses.alignCenter}
                      >
                        <Typography
                          variant="span"
                          className="formLabel"
                          style={{ color: '#000000', fontSize: 'small' }}
                        >
                          LR Number
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={innerClasses.alignCenter}
                      >
                        <Input
                          id="component-simple"
                          style={{ color: '#000000', fontSize: 'small' }}
                          fullWidth
                          value={billDetails.lrNumber}
                          onChange={(e) => {
                            setLRNumber(e.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
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
                    <Grid container className={innerClasses.alignCenter}>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={innerClasses.alignCenter}
                      >
                        <Typography
                          variant="span"
                          className="formLabel"
                          style={{ color: '#000000', fontSize: 'small' }}
                        >
                          Vehicle No
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        className={innerClasses.alignCenter}
                      >
                        <Input
                          id="component-simple"
                          style={{ color: '#000000', fontSize: 'small' }}
                          fullWidth
                          value={billDetails.vehicleNumber}
                          onChange={(e) => {
                            setVehicleNumber(e.target.value);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
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
                    <Grid container className={innerClasses.alignCenter}>
                      <Grid item xs={3} className={innerClasses.alignCenter}>
                        <Typography
                          variant="span"
                          className="formLabel"
                          style={{
                            color: '#000000',
                            fontSize: 'small'
                          }}
                        >
                          Date
                        </Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <TextField
                          fullWidth
                          variant="standard"
                          margin="dense"
                          type="date"
                          className="customTextField"
                          id="date-picker-inline"
                          value={billDetails.bill_date}
                          inputRef={(el) => (inputRef.current[6] = el)}
                          onKeyDown={(e) => {
                            handleKeyDown(e, 1, 37, 80, 5);
                          }}
                          onChange={(event) =>
                            handleDateChange(event.target.value, false)
                          }
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={1} style={{ textAlign: 'end' }}>
                <IconButton
                  onClick={checkCloseDialog}
                  ref={(el) => (inputRef.current[7] = el)}
                  onKeyDown={(e) => {
                    handleKeyDown(e, 26, 25, 25, 36);
                  }}
                >
                  <Cancel fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <div className={innerClasses.content}>
          <Grid container className={innerClasses.headerFooterWrapper}></Grid>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead className={classes.addtablehead}>
                <TableRow>
                  <TableCell
                    variant="head"
                    colSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    {'SL'}
                  </TableCell>

                  <TableCell
                    variant="head"
                    rowSpan="2"
                    width={250}
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    VENDOR{' '}
                  </TableCell>

                  <TableCell
                    variant="head"
                    rowSpan="2"
                    width={330}
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    ITEM{' '}
                  </TableCell>

                  {/* HSN */}
                  {purchaseTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      HSN{' '}
                    </TableCell>
                  )}

                  {purchaseTxnEnableFieldsMap.get('enable_product_barcode') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      BARCODE{' '}
                    </TableCell>
                  )}

                  {/* Serial/IMEI No.  */}
                  {purchaseTxnEnableFieldsMap.get(
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
                  {purchaseTxnEnableFieldsMap.get(
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

                  {/* Model Number */}
                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get('enable_product_price') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Purchase Price{' '}
                    </TableCell>
                  )}

                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      QTY{' '}
                    </TableCell>
                  )}

                  {/* ********Free Quantity******* */}
                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get('enable_product_unit') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      UNIT{' '}
                    </TableCell>
                  )}

                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get('enable_product_wastage') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        WASTAGE{' '}
                      </TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get(
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

                  {(purchaseTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get('enable_product_purity') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        PURITY{' '}
                      </TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
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

                  {taxSettingsData.enableGst && (
                    <TableCell
                      variant="head"
                      colSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      CGST{' '}
                    </TableCell>
                  )}

                  {taxSettingsData.enableGst && (
                    <TableCell
                      variant="head"
                      colSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      SGST{' '}
                    </TableCell>
                  )}

                  {taxSettingsData.enableGst &&
                    purchaseTxnEnableFieldsMap.get('enable_product_igst') && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        IGST{' '}
                      </TableCell>
                    )}

                  {taxSettingsData.enableGst &&
                    purchaseTxnEnableFieldsMap.get('enable_tax_included') && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        width={'10px'}
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        TAX INCLUDED{' '}
                      </TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get('enable_product_cess') && (
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
                    rowSpan="6"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    AMOUNT{' '}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <>
                    <TableCell
                      variant="head"
                      style={{
                        borderLeft: '1px solid #e0e0e0',
                        borderBottom: '1px solid #e0e0e0',
                        padding: 0
                      }}
                    >
                      {' '}
                    </TableCell>
                    <TableCell
                      variant="head"
                      style={{
                        borderRight: '1px solid #e0e0e0',
                        borderBottom: '1px solid #e0e0e0',
                        padding: 0
                      }}
                    >
                      {' '}
                    </TableCell>
                  </>
                  {purchaseTxnEnableFieldsMap.get('enable_product_wastage') &&
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

                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get(
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

                  {(purchaseTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get(
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

                  {taxSettingsData.enableGst && (
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

                  {taxSettingsData.enableGst && (
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
                    purchaseTxnEnableFieldsMap.get('enable_product_igst') && (
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
                    <EditTable
                      key={idx + 1}
                      index={idx}
                      className={
                        idx % 2 === 0 ? classes.oddRow : classes.evenRow
                      }
                    >
                      <TableCell
                        variant="body"
                        style={{
                          borderLeft: '1px solid #e0e0e0',
                          borderTop: '1px solid #e0e0e0',
                          borderBottom: '1px solid #e0e0e0',
                          padding: 2
                        }}
                      >
                        {idx + 1}
                      </TableCell>
                      <TableCell
                        variant="body"
                        style={{
                          borderRight: '1px solid #e0e0e0',
                          borderTop: '1px solid #e0e0e0',
                          borderBottom: '1px solid #e0e0e0',
                          padding: 2
                        }}
                      ></TableCell>
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.isEdit ? (
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
                                value={
                                  item.vendorName === ''
                                    ? itemVendorName
                                    : item.vendorName
                                }
                                inputRef={(el) =>
                                  (inputRef.current[Number('8' + idx)] = el)
                                }
                                fullWidth
                                InputProps={{
                                  classes: { input: classes.outlineinputProps },
                                  disableUnderline: true
                                }}
                                onChange={(e) => {
                                  getItemVendorList(e.target.value);
                                  setItemVendorName(e.target.value);
                                }}
                              />{' '}
                              {itemVendorList && itemVendorList.length > 0 ? (
                                <div>
                                  <ul
                                    className={innerClasses.listbox}
                                    style={{ width: '18%' }}
                                  >
                                    {itemVendorList.length === 1 &&
                                    itemVendorList[0].name === '' ? (
                                      <li></li>
                                    ) : (
                                      <div>
                                        {itemVendorList.map((option, index) => (
                                          <li
                                            key={`${index}vendor`}
                                            style={{
                                              padding: 10,
                                              cursor: 'pointer'
                                            }}
                                            onClick={() => {
                                              setItemVendor(option, idx);
                                              setItemVendorList([]);
                                              setItemVendorName('');
                                            }}
                                          >
                                            <Button
                                              className={innerClasses.liBtn}
                                              disableRipple
                                              ref={(el) =>
                                                (inputRef.current[
                                                  Number('10' + index + '0')
                                                ] = el)
                                              }
                                            >
                                              <Grid
                                                container
                                                justifyContent="space-between"
                                              >
                                                <Grid
                                                  item
                                                  style={{ color: 'black' }}
                                                >
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
                                                <Grid
                                                  item
                                                  style={{ color: 'black' }}
                                                >
                                                  {' '}
                                                  <span>
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
                                </div>
                              ) : null}
                            </div>
                          </div>
                        ) : (
                          item.vendorName
                        )}
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
                                  classes: { input: classes.outlineinputProps },
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
                                          <Grid item xs={5}>
                                            {' '}
                                            <p> Name</p>
                                          </Grid>
                                          <Grid item xs={4}>
                                            <p>Purchased Price</p>
                                          </Grid>

                                          <Grid item xs={3}>
                                            <p>Stock</p>
                                          </Grid>
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
                                          setProductName('');
                                        }}
                                      >
                                        <Button
                                          className={innerClasses.liBtn}
                                          disableRipple
                                          buttonRef={(el) =>
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
                                            <Grid item xs={5}>
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

                                            <Grid item xs={3}>
                                              {/* {option.stockQty >= 0 ? ( */}
                                              <p className={classes.credit}>
                                                {option.stockQty}
                                              </p>
                                              {/* ) : ( */}
                                              {/* <p className={classes.debit}>10</p> */}
                                              {/* )} */}
                                            </Grid>
                                          </Grid>
                                        </Button>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                            {purchaseTxnEnableFieldsMap.get(
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
                                classes: { input: classes.outlineinputProps },
                                disableUnderline: true
                              }}
                            />
                            {purchaseTxnEnableFieldsMap.get(
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

                      {/* HSN */}
                      {purchaseTxnEnableFieldsMap.get('enable_product_hsn') && (
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
                                classes: { input: classes.outlineinputProps },
                                disableUnderline: true
                              }}
                            />
                          ) : (
                            item.hsn
                          )}
                        </TableCell>
                      )}

                      {purchaseTxnEnableFieldsMap.get(
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
                                classes: { input: classes.outlineinputProps },
                                disableUnderline: true
                              }}
                            />
                          ) : (
                            item.barcode
                          )}
                        </TableCell>
                      )}

                      {/* Serial/IMEI No.  */}
                      {purchaseTxnEnableFieldsMap.get(
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
                                inputRef={(el) =>
                                  (inputRef.current[Number('9' + idx)] = el)
                                }
                                onChange={(e) =>
                                  inputOnChange(e, idx, setSerialOrImeiNo)
                                }
                                value={item.serialOrImeiNo}
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
                                  classes: { input: classes.outlineinputProps },
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
                      {purchaseTxnEnableFieldsMap.get(
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
                                classes: { input: classes.outlineinputProps },
                                disableUnderline: true
                              }}
                            />
                          ) : (
                            item.batchNumber
                          )}
                        </TableCell>
                      )}

                      {/* Model Number */}
                      {purchaseTxnEnableFieldsMap.get(
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
                                classes: { input: classes.outlineinputProps },
                                disableUnderline: true
                              }}
                            />
                          ) : (
                            item.modelNo
                          )}
                        </TableCell>
                      )}

                      {purchaseTxnEnableFieldsMap.get(
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
                                  ? setPurchasedPrice(idx, '')
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
                                inputOnChange(e, idx, setPurchasedPrice);
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
                                classes: { input: classes.outlineinputProps },
                                disableUnderline: true
                              }}
                            />
                          ) : (
                            item.purchased_price
                          )}
                        </TableCell>
                      )}

                      {/* Price per gram*/}
                      {purchaseTxnEnableFieldsMap.get(
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

                      {purchaseTxnEnableFieldsMap.get('enable_product_qty') && (
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
                                classes: { input: classes.outlineinputProps },
                                disableUnderline: true
                              }}
                            />
                          ) : (
                            item.qty
                          )}{' '}
                        </TableCell>
                      )}

                      {/* ********Free Quantity******* */}
                      {purchaseTxnEnableFieldsMap.get(
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
                                classes: { input: classes.outlineinputProps },
                                disableUnderline: true
                              }}
                            />
                          ) : (
                            item.freeQty
                          )}{' '}
                        </TableCell>
                      )}

                      {/* ********Unit******* */}
                      {purchaseTxnEnableFieldsMap.get(
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

                      {purchaseTxnEnableFieldsMap.get(
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
                      {purchaseTxnEnableFieldsMap.get(
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
                      {purchaseTxnEnableFieldsMap.get(
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
                      {purchaseTxnEnableFieldsMap.get(
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
                      {purchaseTxnEnableFieldsMap.get(
                        'enable_product_making_charge'
                      ) &&
                        isJewellery === 'true' && (
                          <>
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit ? (
                                <div>
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
                                </div>
                              ) : (
                                <div>{item.makingChargePercent}</div>
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

                      {/* Making Charge per gram Percentage */}
                      {purchaseTxnEnableFieldsMap.get(
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

                      {(purchaseTxnEnableFieldsMap.get(
                        'enable_product_making_charge'
                      ) ||
                        purchaseTxnEnableFieldsMap.get(
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
                      {purchaseTxnEnableFieldsMap.get(
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
                      {purchaseTxnEnableFieldsMap.get(
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
                      {purchaseTxnEnableFieldsMap.get(
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

                      {taxSettingsData.enableGst && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <div>
                              <TextField
                                variant={'outlined'}
                                onFocus={(e) =>
                                  item.cgst === 0 ? setCGST(idx, '') : ''
                                }
                                type="number"
                                onChange={(e) => inputOnChange(e, idx, setCGST)}
                                inputRef={(el) =>
                                  (inputRef.current[Number('13' + idx)] = el)
                                }
                                value={item.cgst}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    if (productlist.length === 0 && idx >= 0) {
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
                                    if (productlist.length === 0 && idx >= 0) {
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
                                  classes: {
                                    input: classes.outlineinputProps
                                  },
                                  disableUnderline: true
                                }}
                              />
                            </div>
                          ) : (
                            item.cgst
                          )}
                        </TableCell>
                      )}
                      {taxSettingsData.enableGst && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <div>
                              <TextField
                                variant={'outlined'}
                                disabled="true"
                                value={parseFloat(item.cgst_amount.toFixed(2))}
                                className={classes.selectMaterial}
                                InputProps={{
                                  classes: {
                                    input: classes.outlineinputProps
                                  },
                                  disableUnderline: true
                                }}
                              />
                            </div>
                          ) : (
                            parseFloat(item.cgst_amount).toFixed(2)
                          )}
                        </TableCell>
                      )}
                      {taxSettingsData.enableGst && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <div>
                              <TextField
                                variant={'outlined'}
                                onChange={(e) => inputOnChange(e, idx, setSGST)}
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
                                    if (productlist.length === 0 && idx >= 0) {
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
                                    if (productlist.length === 0 && idx >= 0) {
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
                                  classes: {
                                    input: classes.outlineinputProps
                                  },
                                  disableUnderline: true
                                }}
                              />
                            </div>
                          ) : (
                            item.sgst
                          )}{' '}
                        </TableCell>
                      )}
                      {taxSettingsData.enableGst && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <div>
                              <TextField
                                variant={'outlined'}
                                disabled="true"
                                value={parseFloat(item.sgst_amount).toFixed(2)}
                                className={classes.selectMaterial}
                                InputProps={{
                                  classes: {
                                    input: classes.outlineinputProps
                                  },
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
                        purchaseTxnEnableFieldsMap.get(
                          'enable_product_igst'
                        ) && (
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <div>
                                <TextField
                                  variant={'outlined'}
                                  onFocus={(e) =>
                                    item.igst === 0 ? setIGST(idx, '') : ''
                                  }
                                  onChange={(e) =>
                                    inputOnChange(e, idx, setIGST)
                                  }
                                  value={item.igst}
                                  inputRef={(el) =>
                                    (inputRef.current[Number('15' + idx)] = el)
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
                                    classes: {
                                      input: classes.outlineinputProps
                                    },
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
                        purchaseTxnEnableFieldsMap.get(
                          'enable_product_igst'
                        ) && (
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
                                    classes: {
                                      input: classes.outlineinputProps
                                    },
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
                        purchaseTxnEnableFieldsMap.get(
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
                      {purchaseTxnEnableFieldsMap.get(
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
                                onFocus={(e) =>
                                  item.cess === 0 ? setCess(idx, '') : ''
                                }
                                onChange={(e) => inputOnChange(e, idx, setCess)}
                                inputRef={(el) =>
                                  (inputRef.current[Number('16' + idx)] = el)
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
                                className={classes.selectMaterial}
                                InputProps={{
                                  classes: { input: classes.outlineinputProps },
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
                              fullWidth
                              variant={'outlined'}
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
                                classes: { input: classes.outlineinputProps },
                                disableUnderline: true
                              }}
                            />
                            <Button
                              buttonRef={(el) =>
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
                  <TableCell colSpan="4">
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

                  {/* HSN */}
                  {purchaseTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {purchaseTxnEnableFieldsMap.get('enable_product_barcode') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {/* Serial/IMEI No.  */}
                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_serial_imei'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Batch Number */}
                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_batch_number'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Model Number */}
                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_model_no'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {purchaseTxnEnableFieldsMap.get('enable_product_price') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {purchaseTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {/* ********Free Quantity******* */}
                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_free_quantity'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* ********Unit******* */}
                  {purchaseTxnEnableFieldsMap.get('enable_product_unit') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_stone_weight'
                  ) && (
                    <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                      <Typography component="subtitle2">
                        {getTotalStoneWeight}
                        {'g'}
                      </Typography>
                    </TableCell>
                  )}

                  {purchaseTxnEnableFieldsMap.get(
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

                  {purchaseTxnEnableFieldsMap.get('enable_product_wastage') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="2" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalWatage}
                          {'g'}
                        </Typography>
                      </TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="2"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="1"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {(purchaseTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) ||
                    purchaseTxnEnableFieldsMap.get(
                      'enable_product_making_charge_per_gram'
                    )) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="1"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_stone_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get('enable_product_purity') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_discount'
                  ) && <TableCell colSpan="2"></TableCell>}

                  {taxSettingsData.enableGst && (
                    <TableCell colSpan="4"></TableCell>
                  )}

                  {taxSettingsData.enableGst &&
                    purchaseTxnEnableFieldsMap.get('enable_product_igst') && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  {taxSettingsData.enableGst &&
                    purchaseTxnEnableFieldsMap.get('enable_tax_included') && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get('enable_product_cess') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  <TableCell colSpan="2">
                    {' '}
                    <Typography
                      style={{
                        float: 'left',
                        top: '4px',
                        position: 'relative'
                      }}
                      variant="span"
                      component="span"
                    >
                      SUB TOTAL{' '}
                    </Typography>
                    <Typography
                      style={{
                        float: 'right',
                        top: '4px',
                        position: 'relative'
                      }}
                      component="subtitle2"
                    >
                      {billDetails.sub_total}
                    </Typography>
                  </TableCell>
                  {/* <TableCell style={{ textAlign: 'center' }}>
                    <Typography component="subtitle2">
                      {billDetails.sub_total}
                    </Typography>
                  </TableCell> */}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/*---------------- Dialog Footer ---------------*/}
        <div className={classes.footer} style={{ height: '200px' }}>
          {/*------------ Notes------------ */}
          {purchaseTxnEnableFieldsMap.get('enable_bill_notes') ? (
            <Grid item xs={12}>
              <TextField
                id="outlined-textarea"
                label="Notes"
                placeholder="Notes"
                multiline
                rows={2}
                maxRows={2}
                fullWidth
                fontSize="6"
                onChange={(e) => setNotes(e.target.value)}
                value={billDetails.notes}
              ></TextField>
            </Grid>
          ) : (
            <Grid item xs={12}></Grid>
          )}

          <Grid
            container
            justifyContent="space-between"
            className={[classes.root, classes.paymentTypeWrap]}
          >
            <Grid item xs={12} sm={2}>
              <Grid container direction="row" spacing={0} alignItems="center">
                <>
                  <Grid
                    item
                    xs={5}
                    style={{ textAlign: 'left' }}
                    className={innerClasses.formWrapper}
                  >
                    <Typography className={innerClasses.bottomFields}>
                      Freight Charge
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    className={[
                      classes.backgroundWhite,
                      innerClasses.formWrapper
                    ]}
                    style={{ marginLeft: '3px' }}
                  >
                    <TextField
                      className="total-wrapper-form"
                      id="Packing-charge"
                      style={{ marginLeft: '3px' }}
                      autoComplete="off"
                      type="number"
                      onFocus={(e) =>
                        billDetails.freightCharge === 0
                          ? setFreightCharge('')
                          : ''
                      }
                      onChange={(e) => {
                        setFreightCharge(e.target.value ? e.target.value : 0);
                      }}
                      value={billDetails.freightCharge}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="end">₹</InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Grid container direction="row" spacing={0} alignItems="center">
                <>
                  <Grid
                    item
                    xs={4}
                    style={{ textAlign: 'left' }}
                    className={innerClasses.formWrapper}
                  >
                    <Typography className={innerClasses.bottomFields}>
                      Supervisor
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={7}
                    className={[
                      classes.backgroundWhite,
                      innerClasses.formWrapper
                    ]}
                    style={{ marginLeft: '3px', marginTop: '10px' }}
                  >
                    <div>
                      <div>
                        <TextField
                          className="employee-wrapper-form"
                          placeholder="Supervisor Name"
                          value={
                            billDetails.supervisorName === ''
                              ? supervisorNameWhileEditing
                              : billDetails.supervisorName
                          }
                          onChange={(e) => {
                            if (e.target.value !== supervisorNameWhileEditing) {
                              setSupervisor('');
                            }
                            getSupervisorList(e.target.value);
                            setSupervisorNameWhileEditing(e.target.value);
                          }}
                          //className={innerClasses.input}
                          InputProps={{
                            disableUnderline: true,
                            classes: {
                              root: innerClasses.bootstrapRoot,
                              input: innerClasses.customerBootstrapInput
                            }
                          }}
                          InputLabelProps={{
                            shrink: true,
                            className: innerClasses.bootstrapFormLabel
                          }}
                        />
                      </div>
                      {supervisorList && supervisorList.length > 0 ? (
                        <>
                          <ul
                            className={innerClasses.listbox}
                            style={{ width: '20%' }}
                          >
                            {supervisorList.length === 1 &&
                            supervisorList[0].name === '' ? (
                              <li></li>
                            ) : (
                              <div>
                                {supervisorList.map((option, index) => (
                                  <li
                                    style={{ padding: 10, cursor: 'pointer' }}
                                    onClick={() => {
                                      handleSupervisorClick(option);
                                    }}
                                    key={`${index}employee`}
                                  >
                                    <Button
                                      className={innerClasses.liBtn}
                                      disableRipple
                                    >
                                      <Grid
                                        container
                                        justifyContent="space-between"
                                      >
                                        <Grid item style={{ color: 'black' }}>
                                          {option.name}
                                          <br />
                                          {option.phoneNo}
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
                    </div>
                  </Grid>
                </>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container direction="row" spacing={0} alignItems="center">
                <>
                  <Grid
                    item
                    xs={5}
                    style={{ textAlign: 'left' }}
                    className={innerClasses.formWrapper}
                  >
                    <Typography className={innerClasses.bottomFields}>
                      Materials In-Charge
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={6}
                    className={[
                      classes.backgroundWhite,
                      innerClasses.formWrapper
                    ]}
                    style={{ marginLeft: '3px', marginTop: '10px' }}
                  >
                    <div>
                      <div>
                        <TextField
                          className="employee-wrapper-form"
                          placeholder=" In-Charge Name"
                          value={
                            billDetails.materialsInChargeName === ''
                              ? materialInChargeNameWhileEditing
                              : billDetails.materialsInChargeName
                          }
                          onChange={(e) => {
                            if (
                              e.target.value !==
                              materialInChargeNameWhileEditing
                            ) {
                              setMaterialsInCharge('');
                            }
                            getMaterialInChargeList(e.target.value);
                            setmaterialInChargeNameWhileEditing(e.target.value);
                          }}
                          //className={innerClasses.input}
                          InputProps={{
                            disableUnderline: true,
                            classes: {
                              root: innerClasses.bootstrapRoot,
                              input: innerClasses.customerBootstrapInput
                            }
                          }}
                          InputLabelProps={{
                            shrink: true,
                            className: innerClasses.bootstrapFormLabel
                          }}
                        />
                      </div>
                      {materialInChargeList &&
                      materialInChargeList.length > 0 ? (
                        <>
                          <ul
                            className={innerClasses.listbox}
                            style={{ width: '20%' }}
                          >
                            {materialInChargeList.length === 1 &&
                            materialInChargeList[0].name === '' ? (
                              <li></li>
                            ) : (
                              <div>
                                {materialInChargeList.map((option, index) => (
                                  <li
                                    style={{ padding: 10, cursor: 'pointer' }}
                                    onClick={() => {
                                      handleMaterialInChargeClick(option);
                                    }}
                                    key={`${index}employee`}
                                  >
                                    <Button
                                      className={innerClasses.liBtn}
                                      disableRipple
                                    >
                                      <Grid
                                        container
                                        justifyContent="space-between"
                                      >
                                        <Grid item style={{ color: 'black' }}>
                                          {option.name}
                                          <br />
                                          {option.phoneNo}
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
                    </div>
                  </Grid>
                </>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={1}></Grid>

            <Grid item xs={4}></Grid>
          </Grid>

          <Grid
            container
            justifyContent="space-between"
            style={{ height: '100%', padding: '0px 0px 0px 14px' }}
          >
            <Grid item xs={6} style={{ marginTop: '10px' }}>
              <Button
                variant="outlined"
                color="secondary"
                buttonRef={(el) => (inputRef.current[26] = el)}
                onKeyDown={(e) => {
                  if (billDetails.is_credit || isUpdate) {
                    handleKeyDown(e, 19, 27, 1, 23);
                  } else {
                    handleKeyDown(e, 19, 27, 1, 22);
                  }
                  if (e.key === 'Enter') {
                    saveDataClick(false);
                  }
                }}
                className={classes.footercontrols}
                onClick={() => saveDataClick(false)}
              >
                {' '}
                Save{' '}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                buttonRef={(el) => (inputRef.current[27] = el)}
                className={classes.footercontrols}
                onClick={() => saveAndNewClick(false)}
                onKeyDown={(e) => {
                  if (
                    !(
                      billDetails.isPartiallyReturned ||
                      billDetails.isFullyReturned
                    ) &&
                    printerList &&
                    printerList.length > 0
                  ) {
                    handleKeyDown(e, 19, 28, 1, 26);
                  } else {
                    handleKeyDown(e, 19, 1, 1, 26);
                  }
                  if (e.key === 'Enter') {
                    saveAndNewClick(false);
                  }
                }}
              >
                Save & New{' '}
              </Button>

              <Button
                color="secondary"
                variant="contained"
                buttonRef={(el) => (inputRef.current[28] = el)}
                className={[classes.saveButton, classes.footercontrols]}
                onClick={() => {
                  onPrintAndSaveClick();
                }}
                onKeyDown={(e) => {
                  handleKeyDown(e, 19, 31, 1, 27);
                  if (e.key === 'Enter') {
                    onPrintAndSaveClick();
                  }
                }}
              >
                Save & Print{' '}
              </Button>

              {/*(billDetails.isPartiallyReturned ||
                billDetails.isFullyReturned) &&
                printerList &&
                printerList.length > 0 && (
                  <Button
                    color="secondary"
                    variant="contained"
                    buttonRef={(el) => (inputRef.current[29] = el)}
                    className={[classes.saveButton, classes.footercontrols]}
                    onClick={() => {
                      onPrintClick();
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, 19, 1, 1, 28);
                      if (e.key === 'Enter') {
                        onPrintClick();
                      }
                    }}
                  >
                    Print{' '}
                  </Button>
                  )}*/}
            </Grid>

            <Grid item xs={2} style={{ marginTop: '20px' }}></Grid>

            <Grid item xs={2} style={{ marginTop: '20px' }}></Grid>

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

        {OpenBatchList ? (
          <PurchaseBatchListModal
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleBatchListModalClose}
          />
        ) : null}

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
              Paid amount can't be more than the Purchase amount.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAlertClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={openNoBillNumberAlert}
          onClose={handleNoBillNumberClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>Please enter Bill Number.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleNoBillNumberClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
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
          open={openNoProductsAlert}
          onClose={handleNoProductsAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Purchase cannot be performed without adding products.
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
          open={openVendorNotProvidedAlert}
          onClose={handleVendorNotProvidedAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Please Choose Vendor from list to make a Purchase.
            </DialogContentText>
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
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openBackToBackPurchaseLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>
                  Please wait while the Back to Back Purchase bill is being
                  created!!!
                </p>
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
        open={openBackToBackPurchaseErrorAlertMessage}
        onClose={handleCloseBackToBackPurchaseErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Purchase bill. Please try again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseBackToBackPurchaseErrorAlertMessage}
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
        open={openBalanceExceededAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Credit provision for the transporter is exceeding the configured
            limit !!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleBalanceExceededAlertClose}
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
const useOutsideAlerter = (ref, index) => {
  // const store = useStore();
  // useEffect(async () => {
  //   /**
  //    * Alert if clicked on outside of element
  //    */
  //   function handleClickOutside(event) {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       // console.log("You clicked outside of me!", index);
  //       setEditTable(index, false);
  //     }
  //   }
  //   // Bind the event listener
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     // Unbind the event listener on clean up
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [ref]);
};
const EditTable = (props) => {
  const store = useStore();
  const { setEditTable, getAddRowEnabled, setAddRowEnabled } =
    store.BackToBackPurchaseStore;
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
export default injectWithObserver(AddBackToBackPurchasesBill);