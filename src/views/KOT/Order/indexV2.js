import React, { forwardRef, useState, useEffect, useRef } from 'react';

import { Cancel } from '@material-ui/icons';
import {
  Slide,
  Button,
  Dialog,
  Grid,
  AppBar,
  IconButton,
  Typography,
  FormControlLabel,
  TextField,
  Checkbox,
  MenuItem,
  makeStyles,
  DialogTitle,
  InputAdornment,
  ListItemText,
  Switch,
  Select,
  FormControl,
  OutlinedInput
} from '@material-ui/core';

import KOTBatchListModal from 'src/components/modal/KotBatchListModal';
import * as Db from '../../../RxDb/Database/Database';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import styles from './style';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import * as moment from 'moment';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Arrowtopright from '../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../icons/Arrowbottomleft';
import CustomerModal from 'src/views/customers/modal/AddCustomer';
import plus from '../../../icons/plus.png';
import { kotRefs } from '../../../components/Refs/KotRefs';
import * as Bd from '../../../components/SelectedBusiness';
import Loader from 'react-js-loader';
import { getKOTAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getCustomerAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import EditIcon from '@material-ui/icons/Edit';
import { styled } from '@material-ui/styles';
import SplitPaymentDetails from './SplitPaymentDetails';
import clsx from 'clsx';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
import { getLevel2Categorieslist } from 'src/components/Helpers/BusinessCategoriesQueryHelper';
import { getAllProductsData } from 'src/components/Helpers/dbQueries/businessproduct';
import { RemoveCircle, AddCircle } from '@material-ui/icons';
import CancelIcon from '@material-ui/icons/Cancel';
import Controls from 'src/components/controls/index';
import SearchIcon from '@material-ui/icons/Search';

var dateFormat = require('dateformat');

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

const useInnerStyles = makeStyles((theme) => ({
  headerFooterWrapper: {
    padding: '10px',
    margin: 0
  },
  tableForm: {
    padding: '10px 6px'
  },
  paxInput: {
    padding: '10px 6px',
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
  addButton: {
    padding: '8px 20px'
  },
  classData: {
    height: '40px'
  },
  formWrapper: {
    // marginBottom: 35,
    '& .total-wrapper-form': {
      '&.total-payment': {
        '& input': {
          fontSize: 17,
          fontWeight: 'bold',
          height: 30
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
    marginBottom: '-20px !important',
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
    position: 'absolute',
    top: '12%',
    bottom: '135px',
    left: '0px',
    right: '0px',
    overflow: 'auto',
    '@media (max-width: 1500px)': {
      top: '16%'
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
    fontSize: '11px',
    padding: '0px 12px',
    height: '30px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    },
    display: 'flex',
    alignItems: 'center'
  },
  PlaceOfsupplyListbox: {
    minWidth: '140px',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 115,
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
  Listbox: {
    minWidth: '10%',
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
  bootstrapFormLabel: {
    fontSize: 16
  },
  input: {
    width: '100%'
  },
  alignCenter: {
    // marginTop: 'auto',
    // marginBottom: 'auto',
    height: '90vh',
    overflowY: 'scroll'
  },
  outlinedInput: {
    width: '80%',
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
    fontSize: '11px',
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
    fontSize: 'small',
    color: '#000'
  },
  notactiveClass: {
    border: '1px solid grey',
    margin: '5px',
    color: '#fff',
    backgroundColor: 'grey',
    padding: '20px',
    textAlign: 'center'
  },
  activeClass: {
    border: '1px solid rgb(157, 203, 106)',
    margin: '5px',
    color: '#fff',
    backgroundColor: 'rgb(157, 203, 106)',
    padding: '20px',
    textAlign: 'center'
  },
  tooltip: {
    position: 'relative',
    display: 'inline-block',
    '&:hover $tooltiptext': {
      visibility: 'visible'
    }
  },
  tooltiptext: {
    visibility: 'hidden',
    width: 120,
    backgroundColor: 'black',
    color: '#fff',
    textAlign: 'center',
    padding: '5px 0',
    borderRadius: 6,
    position: 'absolute',
    zIndex: 1,
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)'
  },
  prodItem: {
    background: 'rgb(255, 255, 255)',
    boxShadow: 'rgb(228, 225, 225) 0px 0px 12px 0px',
    borderRadius: '5px',
    minHeight: '78px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    position: 'relative'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerStart: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftCenter: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  centerStartEnd: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  batchTable: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    width: '100%'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '4px'
  },
  headstyle: {
    paddingTop: '3px',
    paddingBottom: '3px',
    textAlign: 'left',
    backgroundColor: '#EF5350',
    color: 'white'
  },
  badgeCnt: {
    color: '#fff',
    position: 'absolute',
    top: '-7px',
    left: '94%',
    backgroundColor: '#EF5350',
    fontSize: '12px',
    padding: '0 6px',
    borderRadius: '44%'
  },
  sticky: {
    bottom: '0',
    overflowX: 'hidden',
    position: 'sticky',
    zIndex: '999',
    backgroundColor: '#F6F8FA'
  },
  stickyBotom: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '999',
    padding: '0 10px 0 10px',
    backgroundColor: '#F6F8FA'
  },
  footercontrols: {
    padding: '2px 23px',
    marginRight: '20px',
    marginTop: '14px',
    float: 'left',
    marginLeft: '0%'
  },
  borderRight: {
    // borderRight: '2px solid #8080802e',
    paddingRight: '5px'
  },
  topCenter: {
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'space-between'
  },
  addOnstyle: {
    backgroundColor: '#EF5350',
    color: 'white',
    fontWeight: 'bold',
    width: '150px',
    marginTop: '10px',
    marginBottom: '10px',
    float: 'left'
  },
  footerRow: {
    display: 'flex',
    color: '#fff',
    backgroundColor: '#EF5350',
    borderBottom: '1px solid grey',
    width: '98%'
  },
  discountSub: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '80%',
    margin: 'auto'
  }
}));

const AddOrderV2 = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  const theme = useTheme();
  const store = useStore();
  const kotRefsValues = kotRefs();
  const inputRef = useRef([]);

  const {
    orderData,
    openTouchAddSaleDialog,
    waiters,
    selectedProduct,
    items,
    OpenBatchList,
    availableChairs,
    FocusLastIndex,
    chairsList,
    openKOTLoadingAlertMessage,
    openKOTErrorAlertMessage,
    kotTxnEnableFieldsMap,
    openSplitPaymentDetails,
    chosenPaymentType,
    splitPaymentSettingsData,
    level3CategoriesList,
    bankAccountsList,
    auditSettings,
    transaction
  } = toJS(store.KotStore);

  const {
    deleteItem,
    handleSelectedChairs,
    addNewItem,
    setPaxData,
    saveOrEditOrderData,
    closeDialogWithoutSave,
    setEditTable,
    setQuantity,
    setDiscount,
    setDiscountAmount,
    toggleRoundOff,
    setCustomerName,
    setCustomerId,
    setPackingCharge,
    handleBatchListModalClose,
    selectCustomer,
    setPaymentType,
    setWaiterData,
    setFocusLastIndex,
    selectProduct,
    selectedCategory,
    selectedTable,
    setBankAccountData,
    setInoicePrefix,
    setInvoiceSubPrefix,
    handleCloseKOTErrorAlertMessage,
    handleOpenKOTLoadingMessage,
    setInvoiceDate,
    setTaxSettingsData,
    setKotTxnEnableFieldsMap,
    setBankAccountList,
    setSplitPaymentSettingsData,
    handleCloseSplitPaymentDetails,
    handleOpenSplitPaymentDetails,
    setChosenPaymentType,
    resetSplitPaymentDetails,
    setMenuType,
    setRoundingConfiguration,
    getRoundedAmount,
    setDiscType,
    discType,
    setMrp,
    setItemDiscount,
    setItemDiscountAmount
  } = store.KotStore;

  const { resetCustomerFromKot, handleCustomerModalOpenFromKot } =
    store.CustomerStore;
  const { customerDialogOpen, customerFromKot } = toJS(store.CustomerStore);

  const [waiter, setWaiter] = React.useState('');
  const [chair, setChair] = React.useState([]);
  const [Customerlist, setCustomerlist] = React.useState();
  const [openAlert, setAlertOpen] = React.useState(false);
  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openAmountAlert, setAmountAlert] = React.useState(false);
  const [openNoProductsAlert, setNoProductsAlert] = React.useState(false);
  const [customerNameWhileEditing, setCustomerNameWhileEditing] = useState('');
  const [openCustomerNotProvidedAlert, setCustomerNotProvidedAlert] =
    React.useState(false);
  const [product_name, setProductName] = React.useState();
  const [productlist, setproductlist] = useState([]);
  const [openNegativeBalanceAlert, setNegativeBalanceAlert] =
    React.useState(false);
  const [openSaleMoreThanStockAlert, setSaleMoreThanStockAlert] =
    React.useState(false);
  const [saleMoreThanStockText, setsaleMoreThanStockText] = React.useState('');
  const [isBarcodeFocus, setBarcodeFocus] = React.useState(true);
  const [chairMenuOpenStatus, setChairMenuOpenStatus] = React.useState(false);
  const [waiterMenuOpenStatus, setWaiterMenuOpenStatus] = React.useState(false);
  const [payment_type_list, setPaymentTypeList] = React.useState([]);
  const [prefixes, setPrefixes] = React.useState('##');
  const [subPrefixes, setSubPrefixes] = React.useState('##');
  const [prefixesMenuOpenStatus, setPrefixesMenuOpenStatus] =
    React.useState(false);
  const [subPrefixesMenuOpenStatus, setSubPrefixesMenuOpenStatus] =
    React.useState(false);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);
  const [productLists, setProductLists] = React.useState([]);
  const [tablerowStyle, setTablerowStyle] = React.useState([]);
  const [subCategory, setSubCategory] = React.useState();
  const [subCategoryName, setSubCategoryName] = React.useState('');
  let totQty = 0;
  let totPrice = 0;
  let totAmount = 0;
  let subTotal = 0;

  const enableDisc = ['0 0 29%', '0 0 15%', '0 0 20%', '0 0 15%'];
  const disableDisc = ['0 0 37%', '0 0 18%', '0 0 25%', '0 0 15%'];

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const payment_mode_list = [
    { val: 'cash', name: 'CASH' },
    { val: 'upi', name: 'UPI' },
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' }
  ];

  const orderTypeList = ['KOT'];

  const menuTypeList = ['AC', 'Non-AC', 'Self Service'];

  const getProductList = async (value) => {
    setproductlist(await getKOTAutoCompleteList(value, orderData.menuType));
  };

  const handleAddCustomer = () => {
    handleCustomerModalOpenFromKot();
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

  const deleteRow = (index) => {
    deleteItem(index);
  };

  const getCustomerList = async (value) => {
    setCustomerlist(await getCustomerAutoCompleteList(value));
  };

  useEffect(() => {
    if (kotTxnEnableFieldsMap.get('enable_product_discount') === true) {
      setTablerowStyle(enableDisc);
    } else {
      setTablerowStyle(disableDisc);
    }
    async function fetchData() {
      handleChangeSubCategory(level3CategoriesList[0]);
    }

    fetchData();
  }, []);

  const handleChangeSubCategory = async (event) => {
    setProductLists([]);
    let subC = event;
    setSubCategory(event);
    const businessData = await Bd.getBusinessData();
    let prodsData = [];
    if (subC) {
      setSubCategoryName(subC.name);
      prodsData = await getAllProductsData({
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { 'categoryLevel3.name': { $eq: subC.name } }
        ]
      });
      filterAndSetData(prodsData);
    } else {
      setProductLists([]);
    }
  };

  const filterAndSetData = async (prodsData) => {
    if (items && items.length > 0) {
      for (let item of prodsData) {
        item.qty = 0;
        for (let i = 0; i < items.length; i++) {
          if (items[i].product_id === item.productId) {
            item.qty += items[i].qty;
            item.productIndex = i;
          }
        }
      }
      setProductLists(prodsData);
    } else {
      setProductLists(prodsData);
    }
  };

  useEffect(() => {
    setRoundingConfiguration(transaction.roundingConfiguration);
  }, [transaction.roundingConfiguration]);

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

  const handleCustomerNotProvidedAlertClose = () => {
    setCustomerNotProvidedAlert(false);
  };

  const handleCustomerClick = (customer) => {
    setCustomerNameWhileEditing('');
    setCustomerlist([]);
    setEditTable(0, true, 1);
  };

  const handleAddRow = () => {
    addNewItem(false, true);
  };

  const handleDialogKeyDown = (e) => {
    let charCode = String.fromCharCode(e.which).toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (charCode === 's' || charCode === 'p')) {
      e.preventDefault();

      if ((e.ctrlKey || e.metaKey) && charCode === 's') {
        saveOrEditOrderDataClick();
      }
      if ((e.ctrlKey || e.metaKey) && charCode === 'p') {
        // onPrintAndSaveClicked();
      }
    }
  };

  const handleWaiter = (e) => {
    setWaiter(e);
  };

  const handleChair = (e) => {
    const {
      target: { value }
    } = e;

    const chairs = typeof value === 'string' ? value.split(',') : value;
    setChair(chairs);

    handleSelectedChairs(chairs);
  };

  const handlePax = (e) => {
    if (e.target.value >= 0) {
      setPaxData(e.target.value);
    }
  };

  const checkCloseDialog = () => {
    if (
      (items.length === 1 && items[0].item_name === '') ||
      orderData.isUpdate
    ) {
      closeDialogWithoutSave();
    } else {
      setCloseDialogAlert(true);
    }
  };

  const handleChangePrefixes = (value) => {
    setInoicePrefix(value.prefix);
    setPrefixes(value.prefix);
  };

  const saveOrEditOrderDataClick = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
      return;
    }

    if (
      orderData &&
      orderData.selectedChairs &&
      orderData.selectedChairs.length === 0
    ) {
      setErrorAlertProductMessage(
        'KOT cannot be performed without selecting chairs'
      );
      setErrorAlertProduct(true);
      return;
    }

    setPrefixes('##');
    setSubPrefixes('##');

    handleOpenKOTLoadingMessage();
    saveOrEditOrderData();
  };

  const handleChangeSubPrefixes = (value) => {
    setSubPrefixes(value);
    setInvoiceSubPrefix(value);
  };

  useEffect(() => {
    setproductlist([]);
    setCustomerlist([]);
  }, []);

  useEffect(() => {
    if (customerFromKot.id) {
      selectCustomer(customerFromKot);
      resetCustomerFromKot();
    }
  }, [customerFromKot]);

  const isProductsValid = async () => {
    let isProductsValid = true;
    let errorMessage = '';

    if (chosenPaymentType === 'Split') {
      if (getSplitPaymentTotalAmount() !== orderData.total_amount) {
        setErrorAlertProductMessage(
          'Please check the total amount provided in Split Payment. Its not matching the sale bill total amount.'
        );
        setErrorAlertProduct(true);
        isProductsValid = false;
      }
    }

    for (var i = 0; i < items.length; i++) {
      let item = items[i];
      /* if (item.amount === 0) {
        continue;
      } */

      if (item.amount === 0 && item.qty === 0 && item.mrp === 0) {
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
        item.qty === '' ||
        item.qty === 0 ||
        item.qty === undefined ||
        item.qty === null
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

    if (errorMessage !== '') {
      setErrorAlertProductMessage(errorMessage);
      setErrorAlertProduct(true);
      isProductsValid = false;
    }

    return isProductsValid;
  };

  const getSplitPaymentTotalAmount = () => {
    let result = 0;
    if (orderData.splitPaymentList && orderData.splitPaymentList.length > 0) {
      for (let payment of orderData.splitPaymentList) {
        if (payment.amount !== '') {
          result += parseFloat(payment.amount);
        }
      }
    }
    return result;
  };

  const handleSearch = async (e) => {
    if (e) {
      setProductLists([]);
      let target = e.target.value.toLowerCase();
      if (target.length > 0) {
        var regexp = new RegExp('^.*' + target + '.*$', 'i');

        const businessData = await Bd.getBusinessData();
        let prodsData = [];
        if (subCategory) {
          prodsData = await getAllProductsData({
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { name: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { brand: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { barcode: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { salePrice: { $eq: parseFloat(target) } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { hsn: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { sku: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { shortCutCode: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { modelNo: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              }
            ]
          });
        } else {
          prodsData = await getAllProductsData({
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
                  { brand: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { barcode: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { salePrice: { $eq: parseFloat(target) } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { hsn: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { sku: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { shortCutCode: { $regex: regexp } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { modelNo: { $regex: regexp } }
                ]
              }
            ]
          });
        }
        filterAndSetData(prodsData);
      } else {
        const businessData = await Bd.getBusinessData();
        let prodsData = [];
        if (subCategory) {
          prodsData = await getAllProductsData({
            $or: [
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { name: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { brand: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { barcode: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { salePrice: { $eq: parseFloat(target) } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { hsn: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { sku: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { shortCutCode: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              },
              {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { modelNo: { $regex: regexp } },
                  { 'categoryLevel3.name': { $eq: subCategory.name } }
                ]
              }
            ]
          });
        }
        filterAndSetData(prodsData);
      }
    }
  };

  const inputOnChange = (e, index, setFunction) => {
    e.persist();
    setFunction(index, e.target.value);
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
        open={openTouchAddSaleDialog}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
        onKeyDown={handleDialogKeyDown}
      >
        <AppBar
          elevation={1}
          style={{ position: 'fixed' }}
          className={classes.appBar}
        >
          <div style={{ padding: '0px 5px 0px 5px', display: 'flex' }}>
            <div
              style={{ backgroundColor: 'grey', padding: '10px', width: '58%' }}
            >
              <Controls.Input
                placeholder="Search By Item Name"
                size="small"
                style={{ background: '#fff', borderRadius: '6px' }}
                fullWidth
                InputProps={{
                  classes: {
                    root: classes.searchInputRoot,
                    input: classes.searchInputInput
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleSearch}
              />
            </div>
            <div style={{ width: '38%', backgroundColor: 'grey' }}>
              <Grid container style={{ marginTop: '7px' }}>
                <Grid
                  item
                  className={[innerClasses.center, innerClasses.borderRight]}
                  xs={6}
                >
                  <Grid container>
                    <Grid item xs={4} className={innerClasses.leftCenter}>
                      <Typography
                        className="formLabel"
                        style={{
                          color: '#fff',
                          fontSize: '12px',
                          marginLeft: '10px',
                          marginTop: '2px',
                          fontWeight: 'bold'
                        }}
                      >
                        Type
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <FormControl
                        style={{
                          width: '100%',
                          marginTop: '4px',
                          padding: '7.5px 14px'
                        }}
                        required
                        className={clsx(classes.formControl, classes.noLabel)}
                      >
                        <Select
                          disableUnderline
                          className={innerClasses.select}
                          value={
                            orderData.menuType ? orderData.menuType : 'Select'
                          }
                          disabled={orderData.total_amount > 0 ? true : false}
                          input={
                            <OutlinedInput
                              style={{
                                height: '30px',
                                fontSize: '12px',
                                color: 'white',
                                border: '1px solid #fff'
                              }}
                            />
                          }
                          onChange={async (e) => {
                            if (e.target.value !== 'Select') {
                              setMenuType(e.target.value);
                            } else {
                              setMenuType('');
                            }
                          }}
                        >
                          <MenuItem
                            style={{ fontSize: '12px' }}
                            value={'Select'}
                          >
                            {'Select'}
                          </MenuItem>

                          {menuTypeList &&
                            menuTypeList.map((option, index) => (
                              <MenuItem
                                style={{ fontSize: '12px' }}
                                value={option}
                              >
                                {option}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  className={[innerClasses.borderRight, innerClasses.topCenter]}
                  xs={6}
                >
                  <Grid container>
                    <Grid item xs={5}>
                      <Typography
                        style={{
                          marginLeft: '10px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          color: '#fff'
                        }}
                        className={innerClasses.fontSizesmall}
                      >
                        Division:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={7}
                      style={{
                        fontSize: '12px',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    >
                      {selectedCategory.categoryName}
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={5}>
                      <Typography
                        style={{
                          marginLeft: '10px',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          color: '#fff'
                        }}
                        className={innerClasses.fontSizesmall}
                      >
                        Table No:
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={7}
                      style={{
                        fontSize: '12px',
                        color: '#fff',
                        fontWeight: 'bold'
                      }}
                    >
                      {selectedTable.tableNumber}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
            <div
              style={{
                width: '4%',
                backgroundColor: 'grey',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <IconButton
                onClick={(e) => {
                  checkCloseDialog();
                }}
                ref={(el) =>
                  (inputRef.current[kotRefsValues.cancelBtnRef] = el)
                }
                onKeyDown={(e) => {
                  handleKeyDown(e, 27, 5, 5, 3);
                  if (e.key === 'getEventKey') {
                    closeDialogWithoutSave();
                  }
                }}
              >
                <Cancel style={{ color: '#fff' }} fontSize="inherit" />
              </IconButton>
            </div>
          </div>
          <Grid container>
            <Grid item xs={2} className={innerClasses.alignCenter}>
              <div className={classes.centered}>
                {level3CategoriesList &&
                  level3CategoriesList.map((option) => (
                    <Grid
                      onClick={(e) => handleChangeSubCategory(option)}
                      className={
                        subCategoryName === option.name
                          ? innerClasses.activeClass
                          : innerClasses.notactiveClass
                      }
                    >
                      {option.displayName}
                    </Grid>
                  ))}
              </div>
            </Grid>
            <Grid
              item
              xs={5}
              style={{ background: '#effff6', marginTop: '10px' }}
            >
              <Grid container fullWidth>
                {productLists &&
                  productLists.length > 0 &&
                  productLists.map((option, index) => (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        style={{ textAlign: 'center', padding: '10px' }}
                      >
                        <div
                          className={innerClasses.prodItem}
                          onClick={() => {
                            setproductlist([]);
                            if (orderData.isUpdate === true) {
                              selectProduct(option, items.length);
                            } else {
                              selectProduct(option, items.length - 1);
                            }

                            setBarcodeFocus(false);
                            setProductName('');
                          }}
                        >
                          {items.filter(
                            (item) => item.product_id === option.productId
                          ).length > 0 && (
                            <span className={innerClasses.badgeCnt}>
                              {
                                items.filter(
                                  (item) => item.product_id === option.productId
                                ).length
                              }
                            </span>
                          )}
                          <div style={{ margin: '5px' }}>
                            <div className={innerClasses.tooltip}>
                              <Typography
                                variant="h6"
                                className={innerClasses.center}
                                style={{
                                  fontSize: '14px',
                                  minHeight: '43px',
                                  color: '#000',
                                  fontWeight: 'bold'
                                }}
                              >
                                {option.name.length > 35
                                  ? option.name.slice(0, 35) + '...'
                                  : option.name}
                              </Typography>
                              <span className={innerClasses.tooltiptext}>
                                {option.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Grid>
                    </>
                  ))}
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Grid
                container
                style={{ paddingTop: '5px', backgroundColor: '#F6F8FA' }}
              >
                <Grid item className={innerClasses.center} xs={4}>
                  <Grid container>
                    <Grid item xs={5} className={innerClasses.leftCenter}>
                      <Typography
                        className="formLabel"
                        style={{
                          color: '#000000',
                          fontSize: '11px',
                          marginLeft: '10px',
                          fontWeight: 'bold'
                        }}
                      >
                        Customer
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        fullWidth
                        style={{ width: '100%', fontSize: '11px' }}
                        inputRef={(el) =>
                          (inputRef.current[kotRefsValues.customerNameRefVal] =
                            el)
                        }
                        placeholder="Customer *"
                        value={
                          orderData.customer_name === ''
                            ? customerNameWhileEditing
                            : orderData.customer_name
                        }
                        onChange={(e) => {
                          if (e.target.value !== customerNameWhileEditing) {
                            setCustomerName('');
                            setCustomerId('');
                          }
                          getCustomerList(e.target.value);
                          setCustomerNameWhileEditing(e.target.value);
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
                    </Grid>
                  </Grid>
                  {Customerlist && Customerlist.length > 0 ? (
                    <>
                      <ul
                        className={innerClasses.listbox}
                        style={{ width: '20%' }}
                      >
                        <li>
                          <Grid container justifyContent="space-between">
                            {Customerlist.length === 1 &&
                            Customerlist[0].name === '' ? (
                              <Grid item></Grid>
                            ) : (
                              <Grid item>
                                <Button
                                  size="small"
                                  style={{
                                    position: 'relative',
                                    fontSize: '11px'
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
                                  selectCustomer(option);
                                }}
                                key={`${index}customer`}
                              >
                                <Button
                                  className={innerClasses.liBtn}
                                  disableRipple
                                  ref={(el) =>
                                    (inputRef.current[
                                      Number(
                                        '' +
                                          kotRefsValues.customerNameRefVal +
                                          index +
                                          '00'
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
                                      <b style={{ fontSize: '11px' }}>
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
                                        {parseFloat(option.balance).toFixed(2)}
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
                  <CustomerModal open={customerDialogOpen} />
                </Grid>
                <Grid item xs={2}>
                  <Grid item xs={12} className={innerClasses.leftCenter}>
                    <img
                      alt="Logo"
                      src={plus}
                      width="20px"
                      height="20px"
                      onClick={handleAddCustomer}
                      style={{ marginTop: '10px', cursor: 'pointer' }}
                    />
                    {/* <Button
                      size="small"
                      
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
                      
                    >

                    </Button> */}
                  </Grid>
                </Grid>
                <Grid
                  item
                  className={[innerClasses.center, innerClasses.borderRight]}
                  xs={6}
                >
                  <Grid container>
                    <Grid item xs={5} className={innerClasses.center}>
                      <Typography
                        className="formLabel"
                        style={{
                          color: '#000000',
                          fontSize: '11px',
                          marginLeft: '10px',
                          fontWeight: 'bold'
                        }}
                      >
                        Invoice Prefix
                      </Typography>
                    </Grid>
                    <Grid item xs={7} style={{ display: 'flex' }}>
                      <>
                        {transaction &&
                          transaction.sales &&
                          transaction.sales.prefixSequence.length > 0 && (
                            <div>
                              <TextField
                                style={{ width: '80%', fontSize: '11px' }}
                                inputRef={(el) =>
                                  (inputRef.current[kotRefsValues.prefixesRef] =
                                    el)
                                }
                                value={
                                  orderData.prefix ? orderData.prefix : prefixes
                                }
                                inputProps={{
                                  style: {
                                    padding: 10
                                  }
                                }}
                                className={classes.selectData}
                                variant="standard"
                                onClick={(e) => setPrefixesMenuOpenStatus(true)}
                              ></TextField>

                              {prefixesMenuOpenStatus ? (
                                <>
                                  <ul className={innerClasses.Listbox}>
                                    <div>
                                      <li
                                        style={{
                                          cursor: 'pointer',
                                          fontSize: '11px'
                                        }}
                                        key={`prefixes`}
                                      >
                                        <Button
                                          className={innerClasses.liBtn}
                                          disableRipple
                                          onClick={(e) => {
                                            handleChangePrefixes('##');
                                            setPrefixesMenuOpenStatus(false);
                                          }}
                                          ref={(el) =>
                                            (inputRef.current[
                                              Number(
                                                kotRefsValues.prefixesRef + '00'
                                              )
                                            ] = el)
                                          }
                                        >
                                          ##
                                        </Button>
                                      </li>
                                      {transaction &&
                                      transaction.sales &&
                                      transaction.sales.prefixSequence
                                        ? transaction.sales.prefixSequence.map(
                                            (option, index) => (
                                              <li
                                                style={{ cursor: 'pointer' }}
                                                key={`${index}prefixes`}
                                              >
                                                <Button
                                                  className={innerClasses.liBtn}
                                                  disableRipple
                                                  onClick={(e) => {
                                                    handleChangePrefixes(
                                                      option
                                                    );
                                                    setPrefixesMenuOpenStatus(
                                                      false
                                                    );
                                                  }}
                                                  ref={(el) =>
                                                    (inputRef.current[
                                                      Number(
                                                        kotRefsValues.prefixesRef +
                                                          '0' +
                                                          (index + 1)
                                                      )
                                                    ] = el)
                                                  }
                                                >
                                                  {option.prefix}
                                                </Button>
                                              </li>
                                            )
                                          )
                                        : ''}
                                    </div>
                                  </ul>
                                </>
                              ) : null}
                            </div>
                          )}
                        {transaction &&
                          transaction.sales &&
                          transaction.sales.subPrefixesList.length > 0 && (
                            <div>
                              <TextField
                                style={{ width: '80%' }}
                                inputRef={(el) =>
                                  (inputRef.current[
                                    kotRefsValues.subPrefixesRef
                                  ] = el)
                                }
                                value={
                                  orderData.subPrefix
                                    ? orderData.subPrefix
                                    : subPrefixes
                                }
                                inputProps={{
                                  style: {
                                    padding: 10
                                  }
                                }}
                                className={classes.selectData}
                                variant="standard"
                                onClick={(e) =>
                                  setSubPrefixesMenuOpenStatus(true)
                                }
                              ></TextField>

                              {subPrefixesMenuOpenStatus ? (
                                <>
                                  <ul className={innerClasses.Listbox}>
                                    <div>
                                      <li
                                        style={{ cursor: 'pointer' }}
                                        key={`prefixes`}
                                      >
                                        <Button
                                          className={innerClasses.liBtn}
                                          disableRipple
                                          onClick={(e) => {
                                            handleChangeSubPrefixes('##');
                                            setSubPrefixesMenuOpenStatus(false);
                                          }}
                                          ref={(el) =>
                                            (inputRef.current[
                                              Number(
                                                kotRefsValues.subPrefixesRef +
                                                  '00'
                                              )
                                            ] = el)
                                          }
                                        >
                                          ##
                                        </Button>
                                      </li>
                                      {transaction &&
                                      transaction.sales &&
                                      transaction.sales.subPrefixesList
                                        ? transaction.sales.subPrefixesList.map(
                                            (option, index) => (
                                              <li
                                                style={{ cursor: 'pointer' }}
                                                key={`${index}prefixes`}
                                              >
                                                <Button
                                                  className={innerClasses.liBtn}
                                                  disableRipple
                                                  onClick={(e) => {
                                                    handleChangeSubPrefixes(
                                                      option
                                                    );
                                                    setSubPrefixesMenuOpenStatus(
                                                      false
                                                    );
                                                  }}
                                                  ref={(el) =>
                                                    (inputRef.current[
                                                      Number(
                                                        kotRefsValues.subPrefixesRef +
                                                          '0' +
                                                          (index + 1)
                                                      )
                                                    ] = el)
                                                  }
                                                >
                                                  {option}
                                                </Button>
                                              </li>
                                            )
                                          )
                                        : ''}
                                    </div>
                                  </ul>
                                </>
                              ) : null}
                            </div>
                          )}
                      </>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                style={{
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  backgroundColor: '#F6F8FA'
                }}
              >
                <Grid
                  item
                  className={[innerClasses.center, innerClasses.borderRight]}
                  xs={4}
                >
                  <Grid container>
                    <Grid item xs={5} className={innerClasses.leftCenter}>
                      <Typography
                        className="formLabel"
                        style={{
                          color: '#000000',
                          fontSize: '11px',
                          marginLeft: '10px',
                          fontWeight: 'bold'
                        }}
                      >
                        Chair
                      </Typography>
                    </Grid>
                    <Grid item xs={7} style={{ color: '#000' }}>
                      {!orderData.isUpdate ? (
                        <TextField
                          displayEmpty
                          value={
                            orderData.selectedChairs
                              ? orderData.selectedChairs
                              : []
                          }
                          margin="dense"
                          style={{ fontSize: '11px', width: '100%' }}
                          variant="outlined"
                          InputProps={{
                            disableUnderline: true,
                            classes: {
                              root: innerClasses.bootstrapRoot,
                              input: innerClasses.bootstrapInput
                            }
                          }}
                          select
                          SelectProps={{
                            // native: true,
                            multiple: true,
                            className: innerClasses.fontSizesmall,
                            renderValue: (selected) => selected.join(', '),
                            onOpen: (e) => {
                              setChairMenuOpenStatus(true);
                            },
                            onClose: (e) => {
                              setChairMenuOpenStatus(false);
                            },
                            style: {
                              display: 'flex',
                              alignItems: 'center'
                            }
                          }}
                          inputRef={(el) =>
                            (inputRef.current[kotRefsValues.chairNoRef] = el)
                          }
                          onChange={(e) => {
                            handleChair(e);
                          }}
                        >
                          {chairsList && orderData.isUpdate
                            ? chairsList.map((c, index) => (
                                <MenuItem
                                  key={c + index}
                                  value={c}
                                  name={c}
                                  innerRef={(el) =>
                                    (inputRef.current[
                                      Number('7' + index + '00')
                                    ] = el)
                                  }
                                >
                                  <Checkbox
                                    style={{ padding: '0px' }}
                                    checked={
                                      orderData.selectedChairs
                                        ? orderData.selectedChairs.indexOf(c) >
                                          -1
                                        : false
                                    }
                                  />
                                  <ListItemText
                                    style={{ marginLeft: '7px' }}
                                    primary={c}
                                  />
                                </MenuItem>
                              ))
                            : null}

                          {availableChairs && !orderData.isUpdate
                            ? availableChairs.map((c, index) => (
                                <MenuItem
                                  key={c + index}
                                  value={c}
                                  name={c}
                                  innerRef={(el) =>
                                    (inputRef.current[
                                      Number('7' + index + '00')
                                    ] = el)
                                  }
                                >
                                  <Checkbox
                                    style={{ padding: '0px' }}
                                    checked={
                                      orderData.selectedChairs
                                        ? orderData.selectedChairs.indexOf(c) >
                                          -1
                                        : false
                                    }
                                  />
                                  <ListItemText
                                    style={{ marginLeft: '7px' }}
                                    primary={c}
                                  />
                                </MenuItem>
                              ))
                            : null}
                        </TextField>
                      ) : orderData.selectedChairs ? (
                        orderData.selectedChairs.join(',')
                      ) : (
                        ''
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={3} className={innerClasses.center}>
                  <Grid container>
                    <Grid item xs={5} className={innerClasses.leftCenter}>
                      <Typography
                        className="formLabel"
                        style={{
                          color: '#000000',
                          fontSize: '11px',
                          marginLeft: '10px',
                          fontWeight: 'bold'
                        }}
                      >
                        Pax
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        id="filled-select-currency-native"
                        style={{ fontSize: '11px' }}
                        autoComplete="off"
                        inputRef={(el) =>
                          (inputRef.current[kotRefsValues.waiterNameRef] = el)
                        }
                        type="number"
                        value={orderData.numberOfPax}
                        onChange={handlePax}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: innerClasses.bootstrapRoot,
                            input: innerClasses.bootstrapInput
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={5}
                  className={[innerClasses.center, innerClasses.borderRight]}
                >
                  <Grid container>
                    <Grid item xs={5} className={innerClasses.leftCenter}>
                      <Typography
                        className="formLabel"
                        style={{
                          color: '#000000',
                          fontSize: '11px',
                          marginLeft: '10px',
                          fontWeight: 'bold'
                        }}
                      >
                        Waiter Name
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        id="filled-select-currency-native"
                        value={orderData.waiter_name}
                        autoComplete="off"
                        inputRef={(el) =>
                          (inputRef.current[kotRefsValues.waiterNameRef] = el)
                        }
                        onClick={(e) => {
                          setWaiterMenuOpenStatus(true);
                        }}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: innerClasses.bootstrapRoot,
                            input: innerClasses.bootstrapInput
                          }
                        }}
                      ></TextField>
                      {waiterMenuOpenStatus ? (
                        <>
                          <ul className={innerClasses.Listbox}>
                            <div>
                              {waiters.map((option, index) => (
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`${index}customer`}
                                >
                                  <Button
                                    className={innerClasses.liBtn}
                                    disableRipple
                                    onClick={(e) => {
                                      setWaiterData(option);
                                      handleWaiter(option.name);
                                      setWaiterMenuOpenStatus(false);
                                    }}
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number('6' + index + '0')
                                      ] = el)
                                    }
                                  >
                                    {option.name}
                                  </Button>
                                </li>
                              ))}
                            </div>
                          </ul>
                        </>
                      ) : null}
                    </Grid>
                  </Grid>
                </Grid>
                <div
                  className={innerClasses.footerRow}
                  style={{ marginTop: '10px' }}
                >
                  <div
                    style={{
                      flex: tablerowStyle[0],
                      textAlign: 'left',
                      borderRight: '1px solid #ddd',
                      padding: '4px'
                    }}
                  >
                    <Typography variant="h6">Items</Typography>
                  </div>
                  <div
                    style={{
                      flex: tablerowStyle[1],
                      textAlign: 'center',
                      borderRight: '1px solid #ddd',
                      padding: '4px'
                    }}
                  >
                    <Typography variant="h6">Price</Typography>
                  </div>
                  <div
                    style={{
                      flex: tablerowStyle[2],
                      textAlign: 'center',
                      borderRight: '1px solid #ddd',
                      padding: '4px'
                    }}
                  >
                    <Typography variant="h6">QTY</Typography>
                  </div>
                  {kotTxnEnableFieldsMap.get('enable_product_discount') ===
                    true && (
                    <div
                      style={{
                        flex: '0 0 20%',
                        textAlign: 'center',
                        borderRight: '1px solid #ddd',
                        padding: '4px'
                      }}
                    >
                      <Typography variant="h6">Discount</Typography>
                      <div className={innerClasses.discountSub}>
                        <Typography variant="h6">%</Typography>
                        <Typography variant="h6">₹</Typography>
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      flex: '0 0 15%',
                      textAlign: 'center',
                      padding: '4px'
                    }}
                  >
                    <Typography variant="h6">Amount</Typography>
                  </div>
                </div>
              </Grid>
              <Grid container style={{ height: '100vh' }}>
                <table
                  style={{
                    display:
                      items.length == 1 && items[0].item_name == ''
                        ? 'table'
                        : 'block',
                    height: '50vh',
                    overflowY: 'scroll'
                  }}
                  className={`${innerClasses.batchTable}`}
                >
                  <tbody>
                    {(() => {
                      const rows = items.map((item, idx) => {
                        totQty += item.qty;
                        totPrice += item.mrp;
                        totAmount += item.amount;
                        subTotal = item.qty;
                        if (item.item_name !== '') {
                          return (
                            <tr style={{ cursor: 'pointer' }}>
                              <td
                                style={{ width: '29%' }}
                                className={`${innerClasses.rowstyle}`}
                              >
                                <div className={innerClasses.centerStartEnd}>
                                  <p
                                    style={{ color: '#000', fontSize: '13px' }}
                                  >
                                    {item.item_name}
                                  </p>
                                </div>
                              </td>
                              <td
                                style={{ width: '15%' }}
                                className={`${innerClasses.rowstyle}`}
                              >
                                <TextField
                                  variant={'outlined'}
                                  fullWidth
                                  value={item.mrp}
                                  type="number"
                                  onFocus={(e) =>
                                    item.mrp === 0 &&
                                    kotTxnEnableFieldsMap.get(
                                      'enable_product_price_edit'
                                    ) === true
                                      ? setMrp(idx, '')
                                      : ''
                                  }
                                  onChange={(e) => {
                                    if (
                                      kotTxnEnableFieldsMap.get(
                                        'enable_product_price_edit'
                                      ) === true
                                    ) {
                                      setMrp(idx, e.target.value);
                                    }
                                  }}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    style: { fontSize: '12px' },
                                    disableUnderline: true
                                  }}
                                />
                              </td>

                              <td
                                style={{ width: '20%' }}
                                className={`${innerClasses.rowstyle}`}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around'
                                  }}
                                >
                                  <div style={{ width: '27%' }}>
                                    <IconButton
                                      variant="outlined"
                                      color="secondary"
                                      style={{ padding: '3px' }}
                                    >
                                      <RemoveCircle
                                        style={{ fontSize: '25px' }}
                                        onClick={async () => {
                                          item.qty = item.qty - 1;
                                          if (item.qty === 0) {
                                            await deleteItem(idx);
                                          } else {
                                            setQuantity(idx, item.qty);
                                          }
                                        }}
                                      />
                                    </IconButton>
                                  </div>
                                  <div
                                    style={{
                                      width: '36%',
                                      alignSelf: 'center'
                                    }}
                                  >
                                    <TextField
                                      fullWidth
                                      variant="outlined"
                                      disabled
                                      size="small"
                                      value={item.qty ? item.qty : 0}
                                      InputProps={{
                                        inputProps: {
                                          min: 0,
                                          style: {
                                            padding: '6px',
                                            textAlign: 'center',
                                            fontSize: '12px'
                                          }
                                        }
                                      }}
                                    />
                                  </div>
                                  <div style={{ width: '27%' }}>
                                    <IconButton
                                      variant="outlined"
                                      color="secondary"
                                      style={{ padding: '3px' }}
                                    >
                                      <AddCircle
                                        style={{ fontSize: '25px' }}
                                        onClick={async () => {
                                          item.qty = item.qty + 1;
                                          setQuantity(idx, item.qty);
                                        }}
                                      />
                                    </IconButton>
                                  </div>
                                </div>
                              </td>
                              {kotTxnEnableFieldsMap.get(
                                'enable_product_discount'
                              ) === true && (
                                <td
                                  style={{ width: '20%' }}
                                  className={`${innerClasses.rowstyle}`}
                                >
                                  <div style={{ display: 'flex' }}>
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
                                        classes: {
                                          input: innerClasses.tableForm
                                        },
                                        style: {
                                          fontSize: '12px',
                                          width: '90%'
                                        },
                                        disableUnderline: true
                                      }}
                                    />

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
                                        inputOnChange(
                                          e,
                                          idx,
                                          setItemDiscountAmount
                                        )
                                      }
                                      InputProps={{
                                        classes: {
                                          input: innerClasses.tableForm
                                        },
                                        style: {
                                          fontSize: '12px',
                                          width: '90%'
                                        },
                                        disableUnderline: true
                                      }}
                                    />
                                  </div>
                                </td>
                              )}
                              <td
                                style={{ width: '15%' }}
                                className={`${innerClasses.rowstyle}`}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                  }}
                                >
                                  <p
                                    style={{ color: '#000', fontSize: '13px' }}
                                  >
                                    {item.amount}
                                  </p>
                                  <IconButton
                                    variant="outlined"
                                    color="secondary"
                                    style={{ padding: '3px' }}
                                  >
                                    <CancelIcon
                                      style={{ fontSize: '25px' }}
                                      onClick={async () => {
                                        await deleteItem(idx);
                                      }}
                                    />
                                  </IconButton>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                        return null;
                      });
                      return rows;
                    })()}
                  </tbody>
                </table>
              </Grid>
              <div className={innerClasses.sticky}>
                <div className={innerClasses.footerRow}>
                  <div
                    style={{
                      flex: tablerowStyle[0],
                      textAlign: 'left',
                      borderRight: '1px solid #ddd',
                      padding: '4px'
                    }}
                  >
                    <Typography variant="h6">Total</Typography>
                  </div>
                  <div
                    style={{
                      flex: tablerowStyle[1],
                      textAlign: 'left',
                      borderRight: '1px solid #ddd',
                      padding: '4px'
                    }}
                  >
                    <Typography variant="h6">
                      {parseFloat(totPrice).toFixed(2)}
                    </Typography>
                  </div>
                  <div
                    style={{
                      flex: tablerowStyle[2],
                      textAlign: 'center',
                      borderRight: '1px solid #ddd',
                      padding: '4px'
                    }}
                  >
                    <Typography variant="h6">{totQty}</Typography>
                  </div>
                  {kotTxnEnableFieldsMap.get('enable_product_discount') ===
                    true && (
                    <div
                      style={{
                        flex: '0 0 20%',
                        textAlign: 'center',
                        borderRight: '1px solid #ddd',
                        padding: '4px'
                      }}
                    >
                      <Typography variant="h6"></Typography>
                    </div>
                  )}
                  <div
                    style={{
                      flex: '0 0 15%',
                      textAlign: 'center',
                      padding: '4px'
                    }}
                  >
                    <Typography variant="h6">
                      {parseFloat(totAmount).toFixed(2)}
                    </Typography>
                  </div>
                </div>
                <div className={innerClasses.stickyBotom}>
                  <Grid container>
                    <Grid item className={innerClasses.center} xs={4}>
                      <Grid
                        item
                        xs={12}
                        className="grid-padding"
                        style={{
                          paddingTop: '3px',
                          paddingLeft: '0px',
                          display: 'flex',
                          flexDirection: 'row'
                        }}
                      >
                        <Grid
                          item
                          xs={4}
                          style={{ height: '30px' }}
                          className={[
                            classes.backgroundWhite,
                            innerClasses.formWrapper
                          ]}
                        >
                          <Select
                            displayEmpty
                            disableUnderline
                            value={
                              orderData.payment_type === 'Split'
                                ? 'cash'
                                : orderData.payment_type
                            }
                            fullWidth
                            style={{ textAlign: 'center', fontSize: '11px' }}
                            onChange={(e) => {
                              if ('cash' === e.target.value) {
                                setPaymentType('cash');
                              } else {
                                if (
                                  splitPaymentSettingsData.defaultBankSelected !==
                                    '' &&
                                  splitPaymentSettingsData.defaultBankSelected !==
                                    undefined &&
                                  splitPaymentSettingsData.defaultBankSelected !==
                                    null
                                ) {
                                  let bankAccount = bankAccountsList.find(
                                    (o) =>
                                      o.accountDisplayName ===
                                      splitPaymentSettingsData.defaultBankSelected
                                  );

                                  if (bankAccount) {
                                    setBankAccountData(
                                      bankAccount,
                                      e.target.value
                                    );
                                  }
                                } else {
                                  setErrorMessage(
                                    'Please set default bank from Settings > Payment Mode Settings to choose Bank options directly'
                                  );
                                  setErrorAlertMessage(true);
                                }
                              }
                            }}
                          >
                            {payment_mode_list.map((option, index) => (
                              <MenuItem value={option.val}>
                                {option.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          className="grid-padding"
                          style={{
                            textAlign: 'end',
                            marginTop: '-4px',
                            marginLeft: '10px'
                          }}
                        >
                          <FormControlLabel
                            control={
                              <ProdServSwitch
                                checked={
                                  chosenPaymentType === 'Cash' ||
                                  chosenPaymentType === null
                                    ? false
                                    : true
                                }
                                onChange={(e) => {
                                  if (e.target.checked === true) {
                                    setChosenPaymentType('Split');
                                    handleOpenSplitPaymentDetails();
                                  } else {
                                    setChosenPaymentType('Cash');
                                    resetSplitPaymentDetails();
                                  }
                                }}
                                name="switchPaymentType"
                              />
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={6}
                          style={{ marginLeft: '10px', marginTop: '-4px' }}
                          className={innerClasses.leftCenter}
                        >
                          <Typography
                            style={
                              chosenPaymentType === 'Split'
                                ? {
                                    fontWeight: 'bold',
                                    color: 'black',
                                    fontSize: '11px'
                                  }
                                : {
                                    fontWeight: 'bold',
                                    color: 'black',
                                    fontSize: '11px'
                                  }
                            }
                            className={classes.fntClr}
                          >
                            Split Payment
                          </Typography>
                          {chosenPaymentType === 'Split' && (
                            <EditIcon
                              onClick={() => handleOpenSplitPaymentDetails()}
                              style={{ marginLeft: 20 }}
                              className={classes.deleteIcon}
                            />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item className={innerClasses.center} xs={4}>
                      {kotTxnEnableFieldsMap.get('enable_package_charge') ===
                        true && (
                        <Grid container>
                          <Grid item xs={6} className={innerClasses.leftCenter}>
                            <Typography
                              className="formLabel"
                              style={{
                                color: '#000000',
                                fontSize: '11px',
                                marginLeft: '10px',
                                fontWeight: 'bold'
                              }}
                            >
                              Packing Charge
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <TextField
                              className="total-wrapper-form"
                              id="Packing-charge"
                              style={{ background: '#fff' }}
                              placeholder="0"
                              inputRef={(el) =>
                                (inputRef.current[
                                  kotRefsValues.packingChargeRef
                                ] = el)
                              }
                              onChange={(e) => {
                                e.target.value === ''
                                  ? setPackingCharge(0)
                                  : setPackingCharge(e.target.value);
                              }}
                              value={
                                orderData.packing_charge === 0
                                  ? ''
                                  : orderData.packing_charge
                              }
                              InputProps={{
                                disableUnderline: true,
                                style: {
                                  fontSize: '11px'
                                },
                                startAdornment: (
                                  <InputAdornment
                                    style={{ marginRight: '10px' }}
                                    position="end"
                                  >
                                    ₹
                                  </InputAdornment>
                                )
                              }}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item className={innerClasses.center} xs={4}>
                      {kotTxnEnableFieldsMap.get('enable_bill_discount') ===
                        true && (
                        <Grid container>
                          <Grid item xs={4} className={innerClasses.leftCenter}>
                            <Typography
                              className="formLabel"
                              style={{
                                color: '#000000',
                                fontSize: '11px',
                                marginLeft: '10px',
                                fontWeight: 'bold'
                              }}
                            >
                              Discount
                            </Typography>
                          </Grid>
                          <Grid item xs={8} style={{ display: 'flex' }}>
                            <Grid container>
                              <Grid
                                item
                                xs={3}
                                style={{ display: 'flex', marginRight: '2px' }}
                              >
                                <FormControl
                                  style={{ width: '100%' }}
                                  required
                                  className={clsx(
                                    classes.formControl,
                                    classes.noLabel
                                  )}
                                >
                                  <Select
                                    disableUnderline
                                    className={classes.selectFont}
                                    value={discType}
                                    style={{
                                      width: '100%',
                                      height: '30px',
                                      fontSize: '11px',
                                      backgroundColor: '#fff'
                                    }}
                                    onChange={async (e) => {
                                      setDiscType(e.target.value);
                                    }}
                                  >
                                    <MenuItem
                                      style={{ fontSize: '11px' }}
                                      value={'percentage'}
                                    >
                                      {'%'}
                                    </MenuItem>
                                    <MenuItem
                                      style={{ fontSize: '11px' }}
                                      value={'amount'}
                                    >
                                      {'₹'}
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid item xs={8} style={{ display: 'flex' }}>
                                {discType == 'percentage' ? (
                                  <TextField
                                    className="total-wrapper-form"
                                    id="discount"
                                    style={{
                                      background: '#fff',
                                      paddingLeft: '10px'
                                    }}
                                    inputRef={(el) =>
                                      (inputRef.current[
                                        kotRefsValues.discountPercentageRef
                                      ] = el)
                                    }
                                    InputProps={{
                                      disableUnderline: true,
                                      style: { fontSize: '11px' }
                                    }}
                                    onChange={(e) =>
                                      setDiscount(e.target.value)
                                    }
                                    value={orderData.discount_percent}
                                  />
                                ) : (
                                  <TextField
                                    className="total-wrapper-form"
                                    id="discount"
                                    style={{
                                      background: '#fff',
                                      paddingLeft: '10px'
                                    }}
                                    InputProps={{
                                      disableUnderline: true,
                                      style: { fontSize: '11px' }
                                    }}
                                    onChange={(e) =>
                                      setDiscountAmount(e.target.value)
                                    }
                                    value={orderData.discount_amount}
                                  />
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  <Grid container style={{ alignItems: 'center' }}>
                    <Grid item xs={4}>
                      <Button
                        className={innerClasses.addOnstyle}
                        onClick={() => {
                          saveOrEditOrderDataClick();
                        }}
                        ref={(el) =>
                          (inputRef.current[kotRefsValues.saveBtnRef] = el)
                        }
                      >
                        {' '}
                        Save{' '}
                      </Button>
                    </Grid>
                    <Grid item xs={4} style={{ marginTop: '7px' }}>
                      {kotTxnEnableFieldsMap.get('enable_roundoff_default') ===
                        true && (
                        <Grid
                          container
                          direction="row"
                          spacing={0}
                          alignItems="center"
                          className={classes.roundOffMarginTop}
                        >
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            className={innerClasses.formWrapper}
                          >
                            <FormControlLabel
                              style={{ color: '#000' }}
                              control={
                                <Checkbox
                                  checked={orderData.is_roundoff}
                                  icon={
                                    <CheckBoxOutlineBlankIcon
                                      style={{ fontSize: 22 }}
                                    />
                                  }
                                  checkedIcon={
                                    <CheckBoxIcon style={{ fontSize: 22 }} />
                                  }
                                  onChange={(e) => {
                                    toggleRoundOff();
                                  }}
                                  name="checkedA"
                                />
                              }
                              label={
                                <Typography
                                  style={{
                                    fontSize: '11px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  RoundOff
                                </Typography>
                              }
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
                              InputProps={{
                                disableUnderline: true,
                                style: { fontSize: '11px' }
                              }}
                            />
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                    <Grid item className={innerClasses.center} xs={4}>
                      <Grid
                        container
                        direction="row"
                        spacing={0}
                        alignItems="center"
                        style={{ marginTop: '-20px', marginLeft: '16px' }}
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
                          <Typography
                            style={{ fontSize: '12px', fontWeight: 'bold' }}
                          >
                            Total
                          </Typography>
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
                            style={{
                              height: '31px',
                              display: 'flex',
                              justifyContent: 'center'
                            }}
                            value={
                              '₹ ' +
                              parseFloat(orderData.total_amount).toFixed(2)
                            }
                            InputProps={{ disableUnderline: true }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
          </Grid>
          {/* </Toolbar> */}
        </AppBar>

        {openSplitPaymentDetails ? (
          <SplitPaymentDetails onClose={handleCloseSplitPaymentDetails} />
        ) : null}

        <Dialog
          fullScreen={fullScreen}
          open={openCloseDialog}
          onClose={handleCloseDialogClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Order will not be saved, Do you want to close?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={(e) => {
                handleCloseDialogClose();
                closeDialogWithoutSave();
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

        <KOTBatchListModal
          open={OpenBatchList}
          productDetail={selectedProduct}
          onClose={handleBatchListModalClose}
        />
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
            Please Choose Customer from list before performing a Credit Sale.
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
            KOT cannot be performed without adding products.
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
        open={openKOTLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the KOT Order is being created!!!</p>
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
        open={openKOTErrorAlertMessage}
        onClose={handleCloseKOTErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving KOT order. Please try again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseKOTErrorAlertMessage}
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
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* {openDialogName === 'print' ? (
        <ComponentToPrint
          data={orderData}
          printMe={isStartPrint}
          isThermal={invoiceThermal.boolDefault}
        />
      ) : (
        ''
      )} */}
    </div>
  );
};

export default injectWithObserver(AddOrderV2);