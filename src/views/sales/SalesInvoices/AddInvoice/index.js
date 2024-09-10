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
  Switch,
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
  MenuItem,
  ListItemText,
  Select,
  Collapse,
  Box,
  FormControl
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import LinkPaymentSales from '../../../../components/LinkPaymentSales';
import BatchListModal from 'src/components/modal/BatchListModal';
import SerialListModal from 'src/components/modal/SerialListModal';
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
import plusBlue from '../../../../icons/svg/plusBlue.svg';
import InvSeqIcon from '@material-ui/icons/EditOutlined';
import prodPlus from '../../../../icons/prod_plus.png';
import getStateList from '../../../../components/StateList';
import { salesRefs } from '../../../../components/Refs/SalesRefs';
import TempleComponent from './Temple';
import moment from 'moment';
import InvoiceManuelSeqNumModal from '../modal/invoiceManuelSeqNumModal';
import * as Bd from '../../../../components/SelectedBusiness';
import PODetails from './PODetails';
import Loader from 'react-js-loader';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { styled } from '@material-ui/styles';
import SplitPaymentDetails from './SplitPaymentDetails';
import EditIcon from '@material-ui/icons/Edit';
import SaleAddressListModal from 'src/components/modal/SaleAddressListModal';
import { getCustomerAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
import * as balanceUpdate from 'src/components/Helpers/CustomerAndVendorBalanceHelper';
import SalesAddOnsList from 'src/components/modal/SalesAddOnsList';
import Controls from 'src/components/controls/index';
import { getCustomerName, getSaleName } from 'src/names/constants';
import { throttle } from 'lodash';
import SaleProductDetails from './SaleProductDetails';
import { FileUpload } from 'src/components/common/FileUpload';
import MFGDetails from './MFGDetails/index';
import TransportDetails from './TransportDetails/index';
import { getPartyDataById } from 'src/components/Helpers/dbQueries/parties';

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
  formWrapperSm: {
    marginBottom: 15
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
    top: '14%',
    position: 'absolute',
    bottom: '230px',
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
  customerBootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: '100px',
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
  customerInput: {
    width: '60%'
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
  deleteIcon: {
    cursor: 'pointer',
    color: 'balck'
  },
  selectOption: {
    float: 'left',
    '& .makeStyles-formControl-53': {
      borderRadius: '7px'
    }
  },
  expButton: {
    width: '15%',
    marginTop: '5px',
    marginBottom: '12px',
    display: 'flex',
    backgroundColor: '#fff',
    padding: '3px 10px 3px 10px',
    marginRight: '20px'
  },
  expSection: {
    width: '20%',
    marginTop: '-3px',
    marginBottom: '12px',
    display: 'flex',
    padding: '3px 10px 3px 10px',
    marginRight: '20px'
    // marginLeft: '10%',
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

const AddSalesInvoice = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  const inputRef = useRef([]);
  const store = useStore();
  const theme = useTheme();

  const {
    saleDetails,
    items,
    openAddSalesInvoice,
    paymentLinkTransactions,
    selectedProduct,
    FocusLastIndex,
    openLinkpaymentPage,
    OpenBatchList,
    OpenSerialList,
    salesTxnEnableFieldsMap,
    taxSettingsData,
    previousBalanceAmount,
    isRestore,
    chosenMetalList,
    openTransportDetails,
    openPODetails,
    openSaleLoadingAlertMessage,
    openSaleErrorAlertMessage,
    selectedIndex,
    sequenceNumberFailureAlert,
    previousCreditFlag,
    descriptionCollapsibleMap,
    saleTxnSettingsData,
    openSplitPaymentDetails,
    chosenPaymentType,
    splitPaymentSettingsData,
    openAddressList,
    customerAddressList,
    errorAlertMessage,
    isCGSTSGSTEnabledByPOS,
    isCancelledRestore,
    isLocked,
    saleLockMessage,
    productOutOfStockAlert,
    productOutOfStockName,
    openAddonList,
    productAddOnsData,
    openAmendmentDialog,
    notPerformAmendment,
    openMfgDetails,
    shippingTax,
    packingTax,
    openProductDetails,
    insurance,
    insuranceTax,
    columnIndexMap,
    metalList,
    placeOfSupplyState,
    customerCreditDays
  } = toJS(store.SalesAddStore);

  const {
    setCreditData,
    setInvoiceDate,
    setDueDate,
    setLinkPayment,
    setPlaceOfSupply,
    setPlaceOfSupplyName,
    getsalescount,
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
    setNotes,
    setItemNameForRandomProduct,
    setQuantity,
    setDiscount,
    setDiscountAmount,
    setItemDiscount,
    setItemDiscountAmount,
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
    setPackingCharge,
    setPackingTax,
    setShippingTax,
    setShippingCharge,
    setEditTable,
    setFocusLastIndex,
    setEwayBillNo,
    setBankAccountData,
    setCGST,
    setSGST,
    setIGST,
    setCess,
    closeLinkPayment,
    handleBatchListModalClose,
    handleSerialListModalClose,
    setInoicePrefix,
    setInvoiceSubPrefix,
    setGothra,
    setRashi,
    setStar,
    setTempleBillType,
    setGrossWeight,
    setWastagePercentage,
    setWastageGrams,
    setNetWeight,
    setPurity,
    setItemHSN,
    setItemBatchNumber,
    setTaxIncluded,
    setMakingCharge,
    setMakingChargeAmount,
    setMakingChargePerGramAmount,
    setShipToCustomerName,
    setShipToCustomer,
    setCustomerState,
    setCustomerCountry,
    handleInvoiceNumModalOpen,
    setSerialOrImeiNo,
    setRateList,
    handleOpenPODetails,
    handleOpenTransportDetails,
    handleClosePODetails,
    handleCloseTransportDetails,
    handleCloseSaleErrorAlertMessage,
    handleOpenSaleLoadingMessage,
    setMakingChargeIncluded,
    setRoundingConfiguration,
    setFreeQuantity,
    setItemUnit,
    setTCS,
    revertTCS,
    handleCloseSequenceNumberFailureAlert,
    setItemModelNo,
    setItemDescription,
    setItemDescriptionCollapsibleIndex,
    setTDS,
    revertTDS,
    resetCustomer,
    setBankAccountList,
    setSplitPaymentSettingsData,
    handleCloseSplitPaymentDetails,
    handleOpenSplitPaymentDetails,
    setChosenPaymentType,
    resetSplitPaymentDetails,
    handleCloseAddressList,
    setItemPricePerGram,
    setItemStoneCharge,
    setItemStoneWeight,
    getTotalStoneWeight,
    setWeightIn,
    setWeightOut,
    setCGSTSGSTEnabledByPOS,
    setSalesEmployee,
    resetShipToCustomer,
    handleCloseOOSAlert,
    handleOpenAddon,
    setItemRate,
    getItemTotalAmount,
    loadProductsFromGroup,
    handleAmendmentDialogClose,
    setAmendmentDate,
    setAmendmentRemarks,
    setAmendmentFlag,
    shouldShowSaleAmendmentPopUp,
    handleAmendmentDialogOpen,
    setNotPerformAmendement,
    handleOpenMfgDetails,
    setDiscountType,
    setDiscountPercentForAllItems,
    getTotalQuantity,
    handleOpenProductDetails,
    setItemHallmarkCharge,
    setItemCertificationCharge,
    setInsuranceAmount,
    setInsurancePercent,
    setInsuranceType,
    setInsurancePolicyNo,
    setInsuranceTax,
    setItemBrand,
    setTerms,
    setFileUploadImageUrls,
    setPlaceOfSupplyState,
    checkForTaxAndLoadUI,
    setBuyerOtherThanConsignee,
    resetBuyerOtherThanConsignee,
    setCreditLimitDays
  } = store.SalesAddStore;

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);
  const { handleCustomerModalOpenFromSales, resetCustomerFromSales } =
    store.CustomerStore;
  const { customerDialogOpen, customerFromSales } = toJS(store.CustomerStore);
  const { setcurrentBalance } = store.PaymentInStore;
  const { handleAddProductModalOpen } = store.ProductStore;

  const { getSplitPaymentSettingdetails } = store.SplitPaymentSettingsStore;
  const { getAuditSettingsData, auditSettings } = store.AuditSettingsStore;

  const [rxdbSub, setRxdbSub] = useState([]);

  const [Customerlist, setCustomerlist] = React.useState();
  const [shipToCustomerlist, setShipToCustomerlist] = React.useState();
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
  const [shipToCustomerNameWhileEditing, setShipToCustomerNameWhileEditing] =
    useState('');
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
  const [paymentModeMenuOpenStatus, setPaymentModeMenuOpenStatus] =
    React.useState(false);
  const [bankAccounts, setBankAccounts] = React.useState([]);
  const [payment_type_list, setPaymentTypeList] = React.useState([]);
  const [prefixes, setPrefixes] = React.useState('##');
  const [subPrefixes, setSubPrefixes] = React.useState('##');
  const [prefixesMenuOpenStatus, setPrefixesMenuOpenStatus] =
    React.useState(false);
  const [subPrefixesMenuOpenStatus, setSubPrefixesMenuOpenStatus] =
    React.useState(false);
  const [isTemple, setIsTemple] = React.useState(false);
  const [isJewellery, setIsJewellery] = React.useState(false);
  const [returnData, setReturndata] = React.useState('sample data');
  const [billTypeMenuOpen, handleBillTypeMenuOpen] = React.useState(false);
  const [openCreditSaleNoConversionAlert, setCreditSaleNoConversionAlert] =
    React.useState(false);
  const [employeeList, setEmployeeList] = React.useState();
  const [employeeNameWhileEditing, setEmployeeNameWhileEditing] = useState('');
  const selectRef = useRef(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);
  const [tcsList, setTcsList] = React.useState([]);
  const { getTCS, getTCSDataByName } = store.TCSStore;
  const [tdsList, setTdsList] = React.useState([]);
  const { getTDS, getTDSDataByName } = store.TDSStore;

  const [businessStateCode, setBusinessStateCode] = React.useState('');

  const [openBalanceExceededAlert, setOpenBalanceExceededAlert] =
    React.useState(false);
  const [isSerialFocus, setSerialFocus] = React.useState(true);
  const [productGroupList, setProductGroupList] = useState([]);
  const [productGroupName, setProductGroupName] = useState('');
  const [productGroupNameWhileEditing, setProductGroupNameWhileEditing] =
    useState('');
  const [isProductGroupList, setIsProductGroupList] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const [saveType, setSaveType] = useState('save');
  const [selectedRow, setSelectedRow] = useState(0);

  const [
    buyerOtherConsigneeNameWhileEditing,
    setBuyerOtherConsigneeNameWhileEditing
  ] = useState('');
  const [buyerOtherConsigneeCustomerlist, setBuyerOtherConsigneeCustomerlist] =
    React.useState();

  const handleBalanceExceededAlertClose = () => {
    setOpenBalanceExceededAlert(false);
  };

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const handleBillType = (val) => {
    handleBillTypeMenuOpen(false);
  };

  const payment_mode_list = [
    { val: 'cash', name: 'CASH' },
    { val: 'upi', name: 'UPI' },
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' }
  ];
  const salesRefsValue = salesRefs();

  const handleDateChange = (date, isDueDate) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    if (isDueDate) {
      setDueDate(date);
    } else {
      setInvoiceDate(date);
    }
  };

  useEffect(() => {
    async function fetchData() {
      setTcsList([]);
      let tcsListData = await getTCS();
      for (let tcs of tcsListData) {
        tcsList.push(tcs.name);
      }
      setTcsList(tcsList);
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
      setTdsList([]);
      let tdsListData = await getTDS();
      for (let tds of tdsListData) {
        tdsList.push(tds.name);
      }
      setTdsList(tdsList);
    }

    fetchData();
  }, []);

  const throttleDetProductList = throttle(async (value) => {
    getProductList(value);
  }, 250);

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  const handleAddCustomer = () => {
    handleCustomerModalOpenFromSales();
  };

  const handleAddProduct = () => {
    handleAddProductModalOpen();
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    setAmountAlert(false);
  };

  const handleCreditSaleNoConversionAlertClose = () => {
    setCreditSaleNoConversionAlert(false);
  };

  const handleSaleMoreThanStockAlertOKClose = () => {
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
      saveDataClick(true, false);
    }
    if (proceedOptn === 'save_new') {
      saveAndNewClick(true, false);
    }
  };

  const deleteRow = (index) => {
    deleteItem(index);
  };

  const throttleGetCustomerList = throttle(async (value) => {
    setCustomerlist(await getCustomerAutoCompleteList(value));
  }, 250);

  const throttleGetShipToCustomerList = throttle(async (value) => {
    setShipToCustomerlist(await getCustomerAutoCompleteList(value));
  }, 250);

  const throttleGetBuyerOtherConsigneeCustomerList = throttle(async (value) => {
    setBuyerOtherConsigneeCustomerlist(
      await getCustomerAutoCompleteList(value)
    );
  }, 250);

  const getCustomerList = (value) => {
    throttleGetCustomerList(value);
  };

  const handlEmployeeClick = (employee) => {
    setSalesEmployee(employee);

    setEmployeeNameWhileEditing('');
    setEditTable(0, true, 1);
    setEmployeeList([]);
  };

  const onPrintAndSaveClicked = async () => {
    setSaveType('print');
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let isBalanceExceeded = await isBalanceLimitExceeded();

    if (isBalanceExceeded === true) {
      setOpenBalanceExceededAlert(true);
      return;
    }

    let isGenPossible = true;
    if (transaction.autoPushEInvoice === true) {
      isGenPossible = isEInvoiceGeneratePossible();
    }

    if (isGenPossible === false) {
      return;
    }

    let showAmendmentPopup = await shouldShowSaleAmendmentPopUp();
    if (
      showAmendmentPopup === true &&
      saleDetails.amended === false &&
      notPerformAmendment === false
    ) {
      handleAmendmentDialogOpen();
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
      setProceedOptn('save_new');
      setAlertOpen(false);
      if (saleDetails.customer_name === '') {
        setCustomerName(customerNameWhileEditing);
      }

      if (saleDetails.shipToCustomerName === '') {
        setShipToCustomerName(shipToCustomerNameWhileEditing);
      }

      setInvoiceRegularSetting(invoiceRegular);
      setInvoiceThermalSetting(invoiceThermal);

      handleOpenSaleLoadingMessage();
      saveData(true, false)
        .then((data) => {
          console.log('data Inserted');
        })
        .catch((err) => {
          console.log('Sale Data Insertion Failed - ', err);
          // alert('Error in Adding Data');
        });
    }
  };

  const handleCustomerNotProvidedAlertClose = () => {
    setCustomerNotProvidedAlert(false);
  };

  const handleCustomerClick = async (customer) => {
    setCustomerName(customer.name);
    setCustomerId(customer.id);
    setcurrentBalance(customer);
    setCustomerState(customer.state);
    setCustomerCountry(customer.country);

    if (customer.creditLimitDays > 0 && saleDetails.is_credit) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + customer.creditLimitDays);
      setDueDate(dateFormat(currentDate, 'yyyy-mm-dd'));
    }

    if (customer.gothra !== '') {
      setGothra(customer.gothra);
    }

    if (customer.rashi !== '') {
      setRashi(customer.rashi);
    }

    if (customer.star !== '') {
      setStar(customer.star);
    }

    if (customer.state) {
      let result = stateList.find((e) => e.name === customer.state);
      if (result) {
        setPlaceOfSupply(result.val);
        setPlaceOfSupplyName(result.name);
        setPlaceOfSupplyState(result.name);
      }
    }

    setCustomer(customer);
    checkForTaxAndLoadUI(true);

    setCustomerNameWhileEditing('');
    setEditTable(0, true, 1);
    setCustomerlist([]);
  };

  const handleShipToCustomerClick = (customer) => {
    setShipToCustomerNameWhileEditing('');
    setEditTable(0, true, 1);
    setShipToCustomerlist([]);
    setShipToCustomer(customer);
  };

  const handleAddRow = () => {
    setProductName('');
    addNewItem(false, true);
  };

  const setTaxIncludedCheckerBox = (index) => {
    setTaxIncluded(index);
  };

  const saveDataClick = async (val) => {
    setSaveType('save');
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let isBalanceExceeded = await isBalanceLimitExceeded();

    if (isBalanceExceeded === true) {
      setOpenBalanceExceededAlert(true);
      return;
    }

    let isGenPossible = true;
    if (transaction.autoPushEInvoice === true) {
      isGenPossible = isEInvoiceGeneratePossible();
    }

    if (isGenPossible === false) {
      return;
    }

    let showAmendmentPopup = await shouldShowSaleAmendmentPopUp();
    if (
      showAmendmentPopup === true &&
      saleDetails.amended === false &&
      notPerformAmendment === false
    ) {
      handleAmendmentDialogOpen();
      return;
    }

    if (
      (saleDetails.is_credit || parseFloat(saleDetails.balance_amount) > 0) &&
      saleDetails.customer_id === ''
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
      setProceedOptn('save');
      setProductName('');
      setAlertOpen(false);
      setCustomerNameWhileEditing('');
      setShipToCustomerNameWhileEditing('');
      setPrefixes('##');
      setSubPrefixes('##');
      if (saleDetails.customer_name === '') {
        setCustomerName(customerNameWhileEditing);
      }

      if (saleDetails.shipToCustomerName === '') {
        setShipToCustomerName(shipToCustomerNameWhileEditing);
      }

      handleOpenSaleLoadingMessage();
      await saveData(false, false)
        .then((data) => {
          // handleClose();
          getsalescount();
          // closeDialog();
        })
        .catch((err) => {
          console.log('Sale Data Insertion Failed - ', err);
        });
    }
  };

  const saveAndNewClick = async (val) => {
    setSaveType('new');
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let isBalanceExceeded = await isBalanceLimitExceeded();

    if (isBalanceExceeded === true) {
      setOpenBalanceExceededAlert(true);
      return;
    }

    let isGenPossible = true;
    if (transaction.autoPushEInvoice === true) {
      isGenPossible = isEInvoiceGeneratePossible();
    }

    if (isGenPossible === false) {
      return;
    }

    let showAmendmentPopup = await shouldShowSaleAmendmentPopUp();
    if (
      showAmendmentPopup === true &&
      saleDetails.amended === false &&
      notPerformAmendment === false
    ) {
      handleAmendmentDialogOpen();
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
      setProceedOptn('save_new');
      setProductName('');
      setCustomerNameWhileEditing('');
      setShipToCustomerNameWhileEditing('');
      setAlertOpen(false);

      setPrefixes('##');
      setSubPrefixes('##');
      if (saleDetails.customer_name === '') {
        setCustomerName(customerNameWhileEditing);
      }
      if (saleDetails.shipToCustomerName === '') {
        setShipToCustomerName(shipToCustomerNameWhileEditing);
      }

      handleOpenSaleLoadingMessage();
      saveDataAndNew(false, false)
        .then((data) => {
          console.log('data Inserted');
          // handleClose();
          getsalescount();
          // closeDialog();
        })
        .catch((err) => {
          console.log('Sale Data Insertion Failed - ', err);
          // alert('Error in Adding Data');
        });
    }
  };

  const saveAndGenEWayClick = async (val) => {
    setSaveType('eway');
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let isBalanceExceeded = await isBalanceLimitExceeded();

    if (isBalanceExceeded === true) {
      setOpenBalanceExceededAlert(true);
      return;
    }

    let isGenPossible = true;
    if (transaction.autoPushEInvoice === true) {
      isGenPossible = isEInvoiceGeneratePossible();
    }

    if (isGenPossible === false) {
      return;
    }

    let showAmendmentPopup = await shouldShowSaleAmendmentPopUp();
    if (
      showAmendmentPopup === true &&
      saleDetails.amended === false &&
      notPerformAmendment === false
    ) {
      handleAmendmentDialogOpen();
      return;
    }

    if (
      (saleDetails.is_credit || parseFloat(saleDetails.balance_amount) > 0) &&
      saleDetails.customer_id === ''
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
      setProceedOptn('save');
      setProductName('');
      setAlertOpen(false);
      setCustomerNameWhileEditing('');
      setShipToCustomerNameWhileEditing('');
      setPrefixes('##');
      setSubPrefixes('##');
      if (saleDetails.customer_name === '') {
        setCustomerName(customerNameWhileEditing);
      }

      if (saleDetails.shipToCustomerName === '') {
        setShipToCustomerName(shipToCustomerNameWhileEditing);
      }

      handleOpenSaleLoadingMessage();
      await saveData(false, true)
        .then((data) => {
          // handleClose();
          getsalescount();
          // closeDialog();
        })
        .catch((err) => {
          console.log('Sale Data Insertion Failed - ', err);
        });
    }
  };

  const isEInvoiceGeneratePossible = () => {
    let isEInvoiceGenPossible = true;

    let isHSNMissing = false;
    for (let item of items) {
      if (item.qty > 0 && item.hsn === '') {
        isHSNMissing = true;
        break;
      }
    }

    if (saleDetails.customer_id === '') {
      setErrorMessage(
        'Please provide Buyer details to proceed with auto push of E-Invoice.'
      );
      setErrorAlertMessage(true);
      isEInvoiceGenPossible = false;
    } else if (items.length === 0) {
      setErrorMessage(
        'Please add atleast one product to proceed with auto push of E-Invoice.'
      );
      setErrorAlertMessage(true);
      isEInvoiceGenPossible = false;
    } else if (isHSNMissing) {
      setErrorMessage(
        'One or more products have missing HSN. Please provide it to proceed with auto push of E-Invoice.'
      );
      setErrorAlertMessage(true);
      isEInvoiceGenPossible = false;
    } else if (saleDetails.placeOfSupplyName === '') {
      setErrorMessage(
        'Place of Supply not provided. Please provide it to proceed with auto push of E-Invoice.'
      );
      setErrorAlertMessage(true);
      isEInvoiceGenPossible = false;
    }

    return isEInvoiceGenPossible;
  };

  const isProductsValid = async () => {
    let isProductsValid = true;
    let errorMessage = '';

    let auditSettings = await getAuditSettingsData();

    if (
      chosenPaymentType === 'Split' &&
      !(localStorage.getItem('acceptPaymentOtherThanTotal')
        ? JSON.parse(
            localStorage
              .getItem('acceptPaymentOtherThanTotal')
              .toLocaleLowerCase()
          )
        : false)
    ) {
      if (getSplitPaymentTotalAmount() !== saleDetails.total_amount) {
        setErrorAlertProductMessage(
          'Please check the total amount provided in Split Payment. Its not matching the sale bill total amount.'
        );
        setErrorAlertProduct(true);
        isProductsValid = false;
      }
    }

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

  const isBalanceLimitExceeded = async () => {
    let isBalanceExceed = false;

    if (saleDetails.is_credit) {
      let customerData = await balanceUpdate.getCustomerBalanceById(
        saleDetails.customer_id
      );
      if (customerData.creditLimit > 0) {
        let fullBalance =
          parseFloat(customerData.totalBalance) + saleDetails.total_amount;
        if (fullBalance > customerData.creditLimit) {
          isBalanceExceed = true;
        }
      }
    }

    return isBalanceExceed;
  };

  const getSplitPaymentTotalAmount = () => {
    let result = 0;
    if (
      saleDetails.splitPaymentList &&
      saleDetails.splitPaymentList.length > 0
    ) {
      for (let payment of saleDetails.splitPaymentList) {
        if (payment.amount !== '') {
          result += parseFloat(payment.amount);
        }
      }
    }
    return result;
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
      setBankAccountList(bankAccounts);
      setPaymentTypeList(list);
    });
  };

  const handleChangePrefixes = (value) => {
    setInoicePrefix(value.prefix);
    setPrefixes(value.prefix);
  };

  const handleChangeSubPrefixes = (value) => {
    setInvoiceSubPrefix(value);
    setSubPrefixes(value);
  };

  useEffect(() => {
    // console.log('use effect of add invoice');

    setproductlist([]);
    setCustomerlist([]);
    setShipToCustomerlist([]);
    setNotPerformAmendement(false);
    setSaveType('save');
    setIsProductGroupList(false);

    return () => {
      rxdbSub.map((sub) => sub.unsubscribe());
      setCustomerlist(null);
      setShipToCustomerlist(null);
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
      const businessData = await Bd.getBusinessData();
      const businessId = businessData.businessId;
      if (
        localStorage.getItem(businessId + '_saleDefaultPrefix') !== '' &&
        localStorage.getItem(businessId + '_saleDefaultPrefix') !== undefined &&
        localStorage.getItem(businessId + '_saleDefaultPrefix') !== null
      ) {
        const defaultPrefix = localStorage.getItem(
          businessId + '_saleDefaultPrefix'
        );
        setInoicePrefix(defaultPrefix);
        setPrefixes(defaultPrefix);
      }

      if (
        localStorage.getItem(businessId + '_saleDefaultSubPrefix') !== '' &&
        localStorage.getItem(businessId + '_saleDefaultSubPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_saleDefaultSubPrefix') !== null
      ) {
        const defaultSubPrefix = localStorage.getItem(
          businessId + '_saleDefaultSubPrefix'
        );
        setInvoiceSubPrefix(defaultSubPrefix);
        setSubPrefixes(defaultSubPrefix);
      }
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
      let result = payment_mode_list.find(
        (e) => e.val === saleDetails.payment_type
      );
      if (result) {
        setPaymentTypeVal(result.name);
      }
    } else {
      setPaymentTypeVal('');
    }
  }, [saleDetails.payment_type]);

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
      await getBankAccounts();
      setSplitPaymentSettingsData(await getSplitPaymentSettingdetails());
    }

    fetchData();
  }, []);

  useEffect(() => {
    setStateList(getStateList());
    setIsTemple(localStorage.getItem('isTemple'));
    setIsJewellery(localStorage.getItem('isJewellery'));
  }, []);

  const isRateAvailable = (value) => {
    let isAvailable = false;
    if (saleDetails.rateList && saleDetails.rateList.length > 0) {
      for (var i = 0; i < saleDetails.rateList.length; i++) {
        if (value.id === saleDetails.rateList[i].id) {
          isAvailable = true;
          break;
        }
      }
    }
    return isAvailable;
  };

  const getEmployeeList = async (value) => {
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

          setEmployeeList(data);
        });
    } else {
      setEmployeeList([]);
    }
  };

  const handleGroupSearch = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    const query = db.productgroup.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { groupName: { $regex: regexp } }
        ]
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        setProductGroupList([]);
        return;
      }

      let response = data.map((item) => item.toJSON());
      setProductGroupList(response);
    });
  };

  const handleProductGroupClick = async (option) => {
    await loadProductsFromGroup(option);
    setProductGroupList([]);
    setProductGroupName(option.groupName);
    setProductGroupNameWhileEditing('');
  };

  useEffect(() => {
    getProductGroups();
  }, []);

  const getProductGroups = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.productgroup.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (data && data.length > 0) {
        setIsProductGroupList(true);
      } else {
        setIsProductGroupList(false);
      }
    });
  };

  const proceedToSaveWithAmendmentDetails = () => {
    setNotPerformAmendement(true);
    var dateFormat = require('dateformat');
    var date = new Date();
    var newDate = dateFormat(date, 'yyyy-mm-dd');
    setAmendmentDate(newDate);
    setAmendmentFlag(true);
    setTimeout(() => {
      handleAmendmentDialogClose();
      if (saveType === 'save') {
        saveDataClick(false);
      } else if (saveType === 'new') {
        saveAndNewClick(false);
      } else if (saveType === 'eway') {
        saveAndGenEWayClick(false);
      } else if (saveType === 'print') {
        onPrintAndSaveClicked();
      }
    }, 2000);
  };

  const proceedToSaveWithoutAmendmentDetails = () => {
    setNotPerformAmendement(true);
    setAmendmentDate('');
    setAmendmentFlag(false);
    setAmendmentRemarks('');
    setTimeout(() => {
      handleAmendmentDialogClose();
      if (saveType === 'save') {
        saveDataClick(false);
      } else if (saveType === 'new') {
        saveAndNewClick(false);
      } else if (saveType === 'eway') {
        saveAndGenEWayClick(false);
      } else if (saveType === 'print') {
        onPrintAndSaveClicked();
      }
    }, 2000);
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

  const handleBuyerOtherConsigneeCustomerClick = (customer) => {
    setBuyerOtherConsigneeNameWhileEditing('');
    setBuyerOtherThanConsignee(customer);
    setEditTable(0, true, 1);
    setBuyerOtherConsigneeCustomerlist([]);
  };

  const handleFileUpload = (files) => {
    setFileUploadImageUrls(files);
  };

  const isOtheCurrencyEnabled = salesTxnEnableFieldsMap.get(
    'enable_product_price_other_currency'
  );

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
        open={openAddSalesInvoice}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
        onKeyDown={handleDialogKeyDown}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={12} sm={11} className={innerClasses.alignCenter}>
                <Grid
                  container
                  className={classes.pageHeader}
                  spacing={1}
                  style={{ flexWrap: 'Nowrap' }}
                >
                  <Grid
                    item
                    xs="auto"
                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                  >
                    <Button
                      aria-controls="simple-menu"
                      size="large"
                      variant="text"
                      className={classes.menubutton}
                    >
                      {getSaleName()}
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs="auto"
                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          color="secondary"
                          onChange={async (e, c) => {
                            if (
                              saleDetails.linked_amount > 0 &&
                              saleDetails.is_credit &&
                              saleDetails.sequenceNumber !== '' &&
                              previousBalanceAmount > 0
                            ) {
                              setCreditData(true);
                              setCreditSaleNoConversionAlert(true);
                              return;
                            }
                            setCreditData(e.target.checked);
                            if (e.target.checked === true) {
                              if (
                                customerCreditDays === 0 &&
                                saleDetails.customer_id !== ''
                              ) {
                                const customerData = await getPartyDataById(
                                  saleDetails.customer_id,
                                  ['creditLimitDays']
                                );
                                if (
                                  customerData &&
                                  customerData.creditLimitDays > 0
                                ) {
                                  setCreditLimitDays(
                                    customerData.creditLimitDays
                                  );
                                }
                              }
                              setPaymentType('Credit');
                              if (customerCreditDays > 0) {
                                const currentDate = new Date();
                                currentDate.setDate(
                                  currentDate.getDate() + customerCreditDays
                                );
                                setDueDate(
                                  dateFormat(currentDate, 'yyyy-mm-dd')
                                );
                              } else {
                                setDueDate(
                                  dateFormat(new Date(), 'yyyy-mm-dd')
                                );
                              }
                            } else {
                              setPaymentType('cash');
                              setDueDate(null);
                            }
                            const next =
                              inputRef.current[
                                salesRefsValue.customerNameRefVal
                              ];
                            if (next) {
                              next.focus();
                            }
                          }}
                        />
                      }
                      checked={saleDetails.is_credit}
                      label={<Typography color="secondary">Credit</Typography>}
                      labelPlacement="end"
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs="auto" className={innerClasses.alignCenter}>
                    {previousCreditFlag && isUpdate ? (
                      <Input
                        readOnly
                        id="component-simple"
                        value={saleDetails.customer_name}
                        fullWidth
                      />
                    ) : (
                      <div>
                        <div>
                          <TextField
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
                            placeholder="Bill To"
                            value={
                              saleDetails.customer_name === ''
                                ? customerNameWhileEditing
                                : saleDetails.customer_name
                            }
                            onChange={(e) => {
                              if (e.target.value !== customerNameWhileEditing) {
                                resetCustomer();
                                setGothra('');
                                setRashi('');
                                setStar('');
                                setCGSTSGSTEnabledByPOS(true);
                                checkForTaxAndLoadUI(true);
                                setCustomerlist([]);
                              }
                              if (e.target.value !== '') {
                                getCustomerList(e.target.value);
                              }
                              setCustomerNameWhileEditing(e.target.value);
                            }}
                            //className={innerClasses.customerInput}
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
                      </div>
                    )}
                  </Grid>

                  {saleTxnSettingsData.enableBuyerOtherThanConsignee ===
                  true ? (
                    <Grid item xs="auto" className={innerClasses.alignCenter}>
                      <div>
                        <div>
                          <TextField
                            onClick={(e) => {
                              setPaymentModeMenuOpenStatus(false);
                              setMenuOpenStatus(false);
                              setPaymentTypeMenuOpenStatus(false);
                            }}
                            placeholder="Buyer (Other Bill to)"
                            value={
                              saleDetails.buyerOtherBillTo &&
                              saleDetails.buyerOtherBillTo.name === ''
                                ? buyerOtherConsigneeNameWhileEditing
                                : saleDetails.buyerOtherBillTo &&
                                  saleDetails.buyerOtherBillTo.name
                            }
                            onChange={(e) => {
                              if (
                                e.target.value !==
                                buyerOtherConsigneeNameWhileEditing
                              ) {
                                resetBuyerOtherThanConsignee();
                              }
                              throttleGetBuyerOtherConsigneeCustomerList(
                                e.target.value
                              );
                              setBuyerOtherConsigneeNameWhileEditing(
                                e.target.value
                              );
                            }}
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
                        {buyerOtherConsigneeCustomerlist &&
                        buyerOtherConsigneeCustomerlist.length > 0 ? (
                          <>
                            <ul
                              className={innerClasses.listbox}
                              style={{ width: '20%' }}
                            >
                              <li>
                                <Grid container justifyContent="space-between">
                                  {buyerOtherConsigneeCustomerlist.length ===
                                    1 &&
                                  buyerOtherConsigneeCustomerlist[0].name ===
                                    '' ? (
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
                              {buyerOtherConsigneeCustomerlist.length === 1 &&
                              buyerOtherConsigneeCustomerlist[0].name === '' ? (
                                <li></li>
                              ) : (
                                <div>
                                  {buyerOtherConsigneeCustomerlist.map(
                                    (option, index) => (
                                      <li
                                        style={{
                                          padding: 10,
                                          cursor: 'pointer'
                                        }}
                                        onClick={() => {
                                          handleBuyerOtherConsigneeCustomerClick(
                                            option
                                          );
                                        }}
                                        key={`${index}customer`}
                                      >
                                        <Button
                                          className={innerClasses.liBtn}
                                          disableRipple
                                          ref={(el) =>
                                            (inputRef.current[
                                              Number(
                                                salesRefsValue.shipToCustomerNameRefVal +
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
                                            <Grid
                                              item
                                              style={{ color: 'black' }}
                                            >
                                              {option.name}
                                              <br />
                                              {option.phoneNo}
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
                                    )
                                  )}
                                </div>
                              )}
                            </ul>
                          </>
                        ) : null}
                      </div>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs="auto"
                      className={innerClasses.alignCenter}
                    ></Grid>
                  )}

                  {saleTxnSettingsData.enableShipTo === true ? (
                    <Grid item xs="auto" className={innerClasses.alignCenter}>
                      <div>
                        <div>
                          <TextField
                            inputRef={(el) =>
                              (inputRef.current[
                                salesRefsValue.shipToCustomerNameRefVal
                              ] = el)
                            }
                            onClick={(e) => {
                              setPaymentModeMenuOpenStatus(false);
                              setMenuOpenStatus(false);
                              setPaymentTypeMenuOpenStatus(false);
                            }}
                            placeholder="Ship To"
                            value={
                              saleDetails.shipToCustomerName === ''
                                ? shipToCustomerNameWhileEditing
                                : saleDetails.shipToCustomerName
                            }
                            onChange={(e) => {
                              if (
                                e.target.value !==
                                shipToCustomerNameWhileEditing
                              ) {
                                setShipToCustomerName('');
                                resetShipToCustomer();
                              }
                              throttleGetShipToCustomerList(e.target.value);
                              setShipToCustomerNameWhileEditing(e.target.value);
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
                        {shipToCustomerlist && shipToCustomerlist.length > 0 ? (
                          <>
                            <ul
                              className={innerClasses.listbox}
                              style={{ width: '20%' }}
                            >
                              <li>
                                <Grid container justifyContent="space-between">
                                  {shipToCustomerlist.length === 1 &&
                                  shipToCustomerlist[0].name === '' ? (
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
                              {shipToCustomerlist.length === 1 &&
                              shipToCustomerlist[0].name === '' ? (
                                <li></li>
                              ) : (
                                <div>
                                  {shipToCustomerlist.map((option, index) => (
                                    <li
                                      style={{ padding: 10, cursor: 'pointer' }}
                                      onClick={() => {
                                        handleShipToCustomerClick(option);
                                      }}
                                      key={`${index}customer`}
                                    >
                                      <Button
                                        className={innerClasses.liBtn}
                                        disableRipple
                                        ref={(el) =>
                                          (inputRef.current[
                                            Number(
                                              salesRefsValue.shipToCustomerNameRefVal +
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
                      </div>
                    </Grid>
                  ) : (
                    <Grid
                      item
                      xs="auto"
                      className={innerClasses.alignCenter}
                    ></Grid>
                  )}

                  {saleTxnSettingsData.enableSalesMan === true ? (
                    <Grid item xs="auto" className={innerClasses.alignCenter}>
                      <div>
                        <div>
                          <TextField
                            onClick={(e) => {
                              setMenuOpenStatus(false);
                            }}
                            placeholder={getSaleName() + ' By'}
                            value={
                              saleDetails.salesEmployeeName === ''
                                ? employeeNameWhileEditing
                                : saleDetails.salesEmployeeName
                            }
                            onChange={(e) => {
                              if (e.target.value !== employeeNameWhileEditing) {
                                setSalesEmployee('');
                              }
                              getEmployeeList(e.target.value);
                              setEmployeeNameWhileEditing(e.target.value);
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
                        {employeeList && employeeList.length > 0 ? (
                          <>
                            <ul
                              className={innerClasses.listbox}
                              style={{ width: '20%' }}
                            >
                              {employeeList.length === 1 &&
                              employeeList[0].name === '' ? (
                                <li></li>
                              ) : (
                                <div>
                                  {employeeList.map((option, index) => (
                                    <li
                                      style={{ padding: 10, cursor: 'pointer' }}
                                      onClick={() => {
                                        handlEmployeeClick(option);
                                      }}
                                      key={`${index}employee`}
                                    >
                                      <Button
                                        className={innerClasses.liBtn}
                                        disableRipple
                                      >
                                        <Grid container justify="space-between">
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
                  ) : (
                    <Grid
                      item
                      xs="auto"
                      className={innerClasses.alignCenter}
                    ></Grid>
                  )}

                  {transaction.enableCustomer && (
                    <Grid
                      item
                      xs="auto"
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
                        {getCustomerName()}
                      </Button>
                    </Grid>
                  )}

                  <Grid
                    item
                    xs="auto"
                    style={{
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      display: 'flex',
                      marginLeft: '10px'
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
                        handleAddProduct();
                      }}
                    >
                      Product
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs="auto"
                    style={{
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      display: 'flex',
                      marginLeft: '10px'
                    }}
                  >
                    {transaction.billTypes &&
                      transaction.billTypes.length > 0 && (
                        <div>
                          <TextField
                            placeholder="Bill Type"
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
                            value={saleDetails.templeBillType}
                            onClick={(e) => {
                              handleBillTypeMenuOpen(true);
                            }}
                          ></TextField>
                          <>
                            {billTypeMenuOpen && (
                              <ul className={innerClasses.BillTypeListbox}>
                                <div>
                                  {transaction.billTypes &&
                                    transaction.billTypes.map(
                                      (option, index) => (
                                        <li
                                          style={{ cursor: 'pointer' }}
                                          key={`${index}customer`}
                                        >
                                          <Button
                                            className={classes.liBtn}
                                            disableRipple
                                            onClick={(e) => {
                                              setTempleBillType(option);
                                              handleBillType(option);
                                            }}
                                          >
                                            {option}
                                          </Button>
                                        </li>
                                      )
                                    )}
                                </div>
                              </ul>
                            )}
                          </>
                        </div>
                      )}
                  </Grid>

                  <Grid item xs="auto" className={innerClasses.alignCenter}>
                    <Grid
                      container
                      className={innerClasses.alignCenter}
                      style={{ display: 'flex', flexDirection: 'row' }}
                    >
                      <Grid
                        item
                        xs={12}
                        sm={5}
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
                      <Grid item xs={12} sm={7}>
                        <TextField
                          fullWidth
                          variant="standard"
                          margin="dense"
                          type="date"
                          className="customTextField"
                          id="date-picker-inline"
                          inputRef={(el) => (inputRef.current[6] = el)}
                          value={saleDetails.invoice_date}
                          onChange={(event) =>
                            handleDateChange(event.target.value, false)
                          }
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs="auto" className={innerClasses.alignCenter}>
                    {saleDetails.is_credit && (
                      <Grid container className={innerClasses.alignCenter}>
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          style={{ textAlign: 'center' }}
                          className={innerClasses.alignCenter}
                        >
                          <Typography
                            className="formLabel"
                            style={{ color: '#000000', fontSize: 'small' }}
                          >
                            Due Date
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            fullWidth
                            variant="standard"
                            margin="dense"
                            type="date"
                            className="customTextField"
                            id="date-picker-inline"
                            inputRef={(el) => (inputRef.current[6] = el)}
                            value={saleDetails.dueDate}
                            onChange={(event) =>
                              handleDateChange(event.target.value, true)
                            }
                            style={{ color: '#000000', fontSize: 'small' }}
                          />
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
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
          </Toolbar>
        </AppBar>

        {/* ------------------------------------INVOICE DETAILS ----------------------------------- */}

        <Toolbar>
          <Grid container>
            {/************  Inovice No *********/}
            {/* {((transaction.sales.prefixesList.length > 0 && !isUpdate) ||
              isUpdate) && ( */}
            <Grid
              item
              xs={12}
              sm={4}
              className={innerClasses.alignCenter}
              style={{ paddingRight: '10px' }}
            >
              <Grid container className={innerClasses.alignCenter}>
                {!isUpdate &&
                  !isRestore &&
                  !isCancelledRestore &&
                  (transaction.sales.prefixSequence.length > 0 ||
                    transaction.sales.subPrefixesList.length > 0) && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        className={innerClasses.alignCenter}
                      >
                        <Typography
                          className="formLabel"
                          style={{
                            color: '#000000',
                            fontSize: 'small',
                            marginLeft: '10px'
                          }}
                        >
                          Invoice Prefix
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={3} style={{ display: 'content' }}>
                        <Grid container>
                          {transaction.sales.prefixSequence.length > 0 &&
                            !isUpdate && (
                              <Grid item xs={12} sm={5}>
                                <div>
                                  <TextField
                                    style={{ width: '75px' }}
                                    inputRef={(el) =>
                                      (inputRef.current[
                                        salesRefsValue.prefixesRef
                                      ] = el)
                                    }
                                    value={prefixes}
                                    inputProps={{
                                      style: {
                                        padding: 10
                                      }
                                    }}
                                    className={classes.selectData}
                                    variant="standard"
                                    onClick={(e) => {
                                      setPrefixesMenuOpenStatus(true);
                                      setSubPrefixesMenuOpenStatus(false);
                                    }}
                                  ></TextField>

                                  {prefixesMenuOpenStatus ? (
                                    <>
                                      <ul
                                        className={
                                          innerClasses.PlaceOfsupplyListbox
                                        }
                                      >
                                        <div>
                                          <li
                                            style={{ cursor: 'pointer' }}
                                            key={`prefixes`}
                                          >
                                            <Button
                                              className={innerClasses.liBtn}
                                              disableRipple
                                              onClick={(e) => {
                                                handleChangePrefixes('##');
                                                setPrefixesMenuOpenStatus(
                                                  false
                                                );
                                                setFocusLastIndex(
                                                  salesRefsValue.prefixesRef
                                                );
                                              }}
                                              ref={(el) =>
                                                (inputRef.current[
                                                  Number(
                                                    salesRefsValue.prefixesRef +
                                                      '00'
                                                  )
                                                ] = el)
                                              }
                                            >
                                              ##
                                            </Button>
                                          </li>
                                          {transaction.sales.prefixSequence
                                            ? transaction.sales.prefixSequence.map(
                                                (option, index) => (
                                                  <li
                                                    style={{
                                                      cursor: 'pointer'
                                                    }}
                                                    key={`${index}prefixes`}
                                                  >
                                                    <Button
                                                      className={
                                                        innerClasses.liBtn
                                                      }
                                                      disableRipple
                                                      onClick={(e) => {
                                                        handleChangePrefixes(
                                                          option
                                                        );
                                                        setPrefixesMenuOpenStatus(
                                                          false
                                                        );
                                                        setFocusLastIndex(
                                                          salesRefsValue.prefixesRef
                                                        );
                                                      }}
                                                      ref={(el) =>
                                                        (inputRef.current[
                                                          Number(
                                                            salesRefsValue.prefixesRef +
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
                              </Grid>
                            )}
                          {transaction.sales.subPrefixesList.length > 0 &&
                            !isUpdate && (
                              <Grid item xs={12} sm={5}>
                                <div>
                                  <TextField
                                    style={{ width: '75px' }}
                                    inputRef={(el) =>
                                      (inputRef.current[
                                        salesRefsValue.subPrefixesRef
                                      ] = el)
                                    }
                                    value={subPrefixes}
                                    inputProps={{
                                      style: {
                                        padding: 10
                                      }
                                    }}
                                    className={classes.selectData}
                                    variant="standard"
                                    onClick={(e) => {
                                      setSubPrefixesMenuOpenStatus(true);
                                      setPrefixesMenuOpenStatus(false);
                                    }}
                                  ></TextField>

                                  {subPrefixesMenuOpenStatus ? (
                                    <>
                                      <ul
                                        className={
                                          innerClasses.PlaceOfsupplyListbox
                                        }
                                      >
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
                                                setSubPrefixesMenuOpenStatus(
                                                  false
                                                );
                                                setFocusLastIndex(
                                                  salesRefsValue.subPrefixesRef
                                                );
                                              }}
                                              ref={(el) =>
                                                (inputRef.current[
                                                  Number(
                                                    salesRefsValue.subPrefixesRef +
                                                      '00'
                                                  )
                                                ] = el)
                                              }
                                            >
                                              ##
                                            </Button>
                                          </li>
                                          {transaction.sales.subPrefixesList
                                            ? transaction.sales.subPrefixesList.map(
                                                (option, index) => (
                                                  <li
                                                    style={{
                                                      cursor: 'pointer'
                                                    }}
                                                    key={`${index}prefixes`}
                                                  >
                                                    <Button
                                                      className={
                                                        innerClasses.liBtn
                                                      }
                                                      disableRipple
                                                      onClick={(e) => {
                                                        handleChangeSubPrefixes(
                                                          option
                                                        );
                                                        setSubPrefixesMenuOpenStatus(
                                                          false
                                                        );
                                                        setFocusLastIndex(
                                                          salesRefsValue.subPrefixesRef
                                                        );
                                                      }}
                                                      ref={(el) =>
                                                        (inputRef.current[
                                                          Number(
                                                            salesRefsValue.subPrefixesRef +
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
                              </Grid>
                            )}
                        </Grid>
                      </Grid>
                    </>
                  )}

                <Grid item xs={12} sm={2} className={innerClasses.alignCenter}>
                  <Typography
                    className="formLabel"
                    style={{
                      color: '#000000',
                      fontSize: 'small',
                      marginLeft: '10px'
                    }}
                  >
                    Invoice No.
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3} className={innerClasses.alignCenter}>
                  <TextField
                    value={
                      saleDetails.sequenceNumber
                        ? saleDetails.sequenceNumber
                        : 'Auto Generated'
                    }
                    disabled={true}
                  ></TextField>
                </Grid>

                <Grid item xs={12} sm={1}>
                  <InvSeqIcon
                    style={{
                      marginTop: '2px',
                      color: 'grey',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      handleInvoiceNumModalOpen();
                      setPrefixesMenuOpenStatus(false);
                      setSubPrefixesMenuOpenStatus(false);
                    }}
                  />
                  <InvoiceManuelSeqNumModal />
                </Grid>
              </Grid>
            </Grid>
            {/* )} */}

            {/************  PO NO *********/}

            {salesTxnEnableFieldsMap.get('enable_po') && (
              <Grid
                item
                xs={12}
                sm={1}
                style={{
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  display: 'flex'
                }}
              ></Grid>
            )}

            {/************  Metal Rate *********/}
            {isJewellery === 'true' && (
              <Grid
                item
                xs={12}
                sm={2}
                style={{ textAlign: 'center', paddingRight: '5px' }}
                className={innerClasses.alignCenter}
              >
                <Grid container>
                  {metalList && (
                    <>
                      <Grid item xs={3} className={innerClasses.alignCenter}>
                        <Typography
                          className="formLabel"
                          style={{ color: '#000000', fontSize: 'small' }}
                        >
                          Rates
                        </Typography>
                      </Grid>
                      <Grid item xs={9}>
                        <TextField
                          className={innerClasses.selectOptn}
                          name="metals"
                          id="metalstxtID"
                          value={chosenMetalList ? chosenMetalList : []}
                          margin="dense"
                          variant="outlined"
                          select
                          SelectProps={{
                            //native: true,
                            multiple: true,
                            className: innerClasses.fontSizesmall,
                            renderValue: (selected) => selected.join(', ')
                          }}
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          {metalList &&
                            metalList.length > 0 &&
                            metalList.map((option, index) => (
                              <MenuItem key={index} value={option.metal}>
                                <Checkbox
                                  checked={
                                    saleDetails.rateList
                                      ? isRateAvailable(option)
                                      : false
                                  }
                                  onChange={(e) => {
                                    setRateList(e.target.checked, option);
                                  }}
                                />
                                <ListItemText
                                  primary={option.metal}
                                  secondary={option.metalRate}
                                />
                              </MenuItem>
                            ))}
                        </TextField>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
            )}

            {/************  Place of Supply *********/}

            {taxSettingsData &&
              taxSettingsData.enableGst &&
              (saleDetails.exportType === '' ||
                saleDetails.exportType === null) && (
                <Grid
                  item
                  xs={12}
                  sm={2}
                  style={{ textAlign: 'center', paddingRight: '5px' }}
                  className={innerClasses.alignCenter}
                >
                  <Grid container>
                    <Grid item xs={6} className={innerClasses.alignCenter}>
                      <Typography
                        className="formLabel"
                        style={{
                          color: '#000000',
                          fontSize: 'small',
                          fontFamily: 'Roboto'
                        }}
                      >
                        Place of Supply
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {saleDetails.customerState === '' ? (
                        <>
                          <TextField
                            variant={'standard'}
                            value={placeOfSupplyState}
                            margin="dense"
                            inputRef={(el) =>
                              (inputRef.current[
                                salesRefsValue.placeOfSupplyRef
                              ] = el)
                            }
                            onClick={(e) => {
                              setPaymentModeMenuOpenStatus(false);
                              setPaymentTypeMenuOpenStatus(false);
                              setMenuOpenStatus(true);
                            }}
                            onChange={(e) => {
                              checkForTaxAndLoadUI();
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
                                            setPlaceOfSupply(option.val);
                                            setPlaceOfSupplyName(option.name);
                                            setMenuOpenStatus(false);
                                            setFocusLastIndex(
                                              salesRefsValue.placeOfSupplyRef
                                            );

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
                                                  setCGSTSGSTEnabledByPOS(
                                                    false
                                                  );
                                                }
                                              }
                                            }
                                          }}
                                          ref={(el) =>
                                            (inputRef.current[
                                              Number(
                                                salesRefsValue.placeOfSupplyRef +
                                                  '0' +
                                                  index
                                              )
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

            {/************  E-Way Bill No *********/}

            <Grid
              item
              xs={12}
              sm={2}
              className={innerClasses.alignCenter}
              style={{ paddingRight: '20px' }}
            >
              <Grid container>
                <Grid
                  item
                  xs={5}
                  style={{ textAlign: 'left' }}
                  className={innerClasses.alignCenter}
                >
                  <Typography
                    className="formLabel"
                    style={{
                      color: '#000000',
                      fontSize: 'small',
                      fontFamily: 'Roboto'
                    }}
                  >
                    E-way Bill No.
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    variant={'standard'}
                    value={saleDetails.ewayBillNo}
                    margin="dense"
                    inputRef={(el) =>
                      (inputRef.current[salesRefsValue.ewayBillNoRef] = el)
                    }
                    onChange={(e) => setEwayBillNo(e.target.value)}
                  ></TextField>
                </Grid>
              </Grid>
            </Grid>

            {isProductGroupList === true && (
              <Grid
                item
                xs={12}
                sm={3}
                className={innerClasses.alignCenter}
                style={{ paddingRight: '20px' }}
              >
                <div className={innerClasses.selectOption}>
                  <div>
                    <Controls.Input
                      placeholder="Search By Group"
                      size="small"
                      fullWidth
                      value={
                        productGroupName === ''
                          ? productGroupNameWhileEditing
                          : productGroupName
                      }
                      InputProps={{
                        classes: {
                          root: classes.searchInputRoot,
                          input: classes.searchInputInput
                        },
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        )
                      }}
                      onChange={(e) => {
                        if (e.target.value !== productGroupNameWhileEditing) {
                          setProductGroupName('');
                        }

                        setProductGroupNameWhileEditing(e.target.value);
                        setProductGroupList([]);
                        if (e.target.value !== '') {
                          handleGroupSearch(e.target.value);
                        }
                      }}
                    />
                    {productGroupList.length > 0 ? (
                      <div>
                        <ul
                          className={innerClasses.PlaceOfsupplyListbox}
                          style={{ width: '25%' }}
                        >
                          {productGroupList.map((option, index) => (
                            <li
                              style={{ padding: 10, cursor: 'pointer' }}
                              onClick={() => {
                                handleProductGroupClick(option);
                              }}
                            >
                              <Grid
                                container
                                // justify="space-between"
                                style={{ display: 'flex' }}
                                className={classes.listitemGroup}
                              >
                                <Grid item xs={12}>
                                  <p>{option.groupName}</p>
                                </Grid>
                              </Grid>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Grid>
            )}
          </Grid>
        </Toolbar>

        {/* ------------------------------------TEMPLE DETAILS ------------------------------------ */}

        {String(isTemple).toLowerCase() === 'true' && (
          <TempleComponent
            saleDetails={saleDetails}
            returnData={setReturndata}
          />
        )}

        {/* ------------------------------------PRODUCT TABLE-------------------------------------- */}

        <div
          style={{ bottom: '130px' }}
          className={
            String(isTemple).toLowerCase() === 'true'
              ? innerClasses.templeContent
              : innerClasses.content
          }
        >
          <Grid container className={innerClasses.headerFooterWrapper}>
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

                    {/* *****Batch Number***** */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_batch_number'
                    ) && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
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
                      'enable_product_price_other_currency'
                    ) && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        PRICE {saleDetails?.exportCurrency?.split(' - ')[0]}
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

                    {salesTxnEnableFieldsMap.get(
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

                    {salesTxnEnableFieldsMap.get(
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

                    {salesTxnEnableFieldsMap.get(
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
                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
                      isCGSTSGSTEnabledByPOS === true && (
                        <TableCell
                          variant="head"
                          colSpan="2"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          CGST{' '}
                        </TableCell>
                      )}
                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
                      isCGSTSGSTEnabledByPOS === true && (
                        <TableCell
                          variant="head"
                          colSpan="2"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          SGST{' '}
                        </TableCell>
                      )}
                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
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
                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
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

                    {salesTxnEnableFieldsMap.get(
                      'enable_product_price_other_currency'
                    ) && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        AMOUNT {saleDetails?.exportCurrency?.split(' - ')[0]}
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
                  {/* ------------------- */}
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
                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
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
                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
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

                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
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
                        <EditTable
                          key={idx + 1}
                          index={idx}
                          orderType={saleDetails.order_type}
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
                                          '' +
                                            salesRefsValue.productNameRef +
                                            idx
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
                                      classes: { input: innerClasses.tableForm }
                                    }}
                                    onChange={(e) => {
                                      throttleDetProductList(e.target.value);
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

                                              selectProduct(option, idx, false);
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
                                                style={{ display: 'flex' }}
                                                className={
                                                  classes.listitemGroup
                                                }
                                              >
                                                <Grid item xs={4}>
                                                  <p>{option.name}</p>
                                                </Grid>
                                                <Grid item xs={4}>
                                                  {''}
                                                  <p
                                                    className={classes.listitem}
                                                  >
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
                                                    <p
                                                      className={classes.credit}
                                                    >
                                                      {parseFloat(
                                                        option.netWeight
                                                      ).toFixed(3)}
                                                    </p>
                                                  </Grid>
                                                ) : (
                                                  <Grid item xs={4}>
                                                    <p
                                                      className={classes.credit}
                                                    >
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
                                              {metalList.map(
                                                (option, index) => (
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
                                                )
                                              )}
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

                          {/* ******HSN***** */}
                          {salesTxnEnableFieldsMap.get(
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
                                  id={`cell-${idx}-${columnIndexMap.get(
                                    'HSN'
                                  )}`}
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
                                    onChange={(e) =>
                                      inputOnChange(e, idx, setItemBarcode)
                                    }
                                    onClick={(e) => {
                                      setBarcodeFocus(true);
                                    }}
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
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
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
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                ) : (
                                  item.serialOrImeiNo
                                )}
                              </TableCell>
                            </>
                          )}

                          {/* *****Batch Number***** */}
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

                          {/* *****Brand***** */}
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

                          {/* *****Model Number***** */}
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
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number('' + salesRefsValue.mrpRef + idx)
                                    ] = el)
                                  }
                                  type="number"
                                  onFocus={(e) =>
                                    item.mrp === 0 ? setMrp(idx, '') : ''
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
                                parseFloat(item.mrp)
                              )}
                            </TableCell>
                          )}

                          {salesTxnEnableFieldsMap.get(
                            'enable_product_price_other_currency'
                          ) && (
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {parseFloat(item?.mrpOtherCurrency)?.toFixed(2)}
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
                                  onChange={(e) => {
                                    inputOnChange(e, idx, setItemPricePerGram);
                                    setItemNameForRandomProduct(
                                      idx,
                                      product_name
                                    );
                                  }}
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
                          {salesTxnEnableFieldsMap.get(
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
                                        inputOnQtyChange(e, idx, setQuantity);
                                      }
                                    }}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
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
                                        inputOnQtyChange(
                                          e,
                                          idx,
                                          setFreeQuantity
                                        );
                                      }
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
                                ) : (
                                  item.freeQty
                                )}{' '}
                              </TableCell>
                            </>
                          )}

                          {/* ********Unit******* */}
                          {salesTxnEnableFieldsMap.get(
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
                                            (inputRef.current[
                                              Number('9' + idx)
                                            ] = el)
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
                                        (inputRef.current[Number('9' + idx)] =
                                          el)
                                      }
                                      onFocus={(e) =>
                                        item.grossWeight === 0
                                          ? setGrossWeight(idx, '')
                                          : ''
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
                                      onChange={(e) => {
                                        inputOnChange(e, idx, setGrossWeight);
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
                                      inputRef={(el) =>
                                        (inputRef.current[Number('9' + idx)] =
                                          el)
                                      }
                                      onFocus={(e) =>
                                        item.stoneWeight === 0
                                          ? setItemStoneWeight(idx, '')
                                          : ''
                                      }
                                      onChange={(e) => {
                                        inputOnChange(
                                          e,
                                          idx,
                                          setItemStoneWeight
                                        );
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
                                        (inputRef.current[Number('9' + idx)] =
                                          el)
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
                                      onFocus={(e) =>
                                        item.wastageGrams === 0
                                          ? setWastageGrams(idx, '')
                                          : ''
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
                                    <div style={{ alignSelf: 'center' }}>
                                      <TextField
                                        variant="outlined"
                                        fullWidth
                                        value={item.makingChargePercent}
                                        inputRef={(el) =>
                                          (inputRef.current[
                                            Number('30' + idx)
                                          ] = el)
                                        }
                                        type="number"
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
                                    <div style={{ alignSelf: 'center' }}>
                                      {item.makingChargePercent}
                                    </div>
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
                                      onFocus={(e) =>
                                        item.makingChargeAmount === 0
                                          ? setMakingChargeAmount(idx, '')
                                          : ''
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
                              <TableCell
                                variant="body"
                                classes={{ root: classes.tableCellBodyRoot }}
                              >
                                {item.isEdit ? (
                                  <>
                                    <TextField
                                      variant="outlined"
                                      fullWidth
                                      value={item.makingChargePerGramAmount}
                                      inputRef={(el) =>
                                        (inputRef.current[Number('31' + idx)] =
                                          el)
                                      }
                                      type="number"
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
                                      onFocus={(e) =>
                                        item.makingChargePerGramAmount === 0
                                          ? setMakingChargePerGramAmount(
                                              idx,
                                              ''
                                            )
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
                                        classes: {
                                          input: innerClasses.tableForm
                                        },
                                        disableUnderline: true
                                      }}
                                    />
                                  </>
                                ) : (
                                  item.makingChargePerGramAmount
                                )}{' '}
                              </TableCell>
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
                                        inputOnChange(
                                          e,
                                          idx,
                                          setItemStoneCharge
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
                                    item.stoneCharge
                                  )}{' '}
                                </TableCell>
                              </>
                            )}

                          {/* Purity */}
                          {salesTxnEnableFieldsMap.get(
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
                          {taxSettingsData &&
                            taxSettingsData.enableGst &&
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
                                        native="true"
                                        type="number"
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
                                        onFocus={(e) =>
                                          item.cgst === 0
                                            ? setCGST(idx, '')
                                            : ''
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
                          {taxSettingsData &&
                            taxSettingsData.enableGst &&
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
                                      value={parseFloat(
                                        item.cgst_amount
                                      ).toFixed(2)}
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
                          {taxSettingsData &&
                            taxSettingsData.enableGst &&
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
                                          item.sgst === 0
                                            ? setSGST(idx, '')
                                            : ''
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
                          {taxSettingsData &&
                            taxSettingsData.enableGst &&
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
                                      value={parseFloat(
                                        item.sgst_amount
                                      ).toFixed(2)}
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
                          {taxSettingsData &&
                            taxSettingsData.enableGst &&
                            salesTxnEnableFieldsMap.get(
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
                                        inputRef={(el) =>
                                          (inputRef.current[
                                            Number(
                                              '' + salesRefsValue.igstRef + idx
                                            )
                                          ] = el)
                                        }
                                        type="number"
                                        onFocus={(e) =>
                                          item.igst === 0
                                            ? setIGST(idx, '')
                                            : ''
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
                                  <div className={classes.wrapper}>
                                    <TextField
                                      variant={'outlined'}
                                      native="true"
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
                                      value={parseFloat(
                                        item.igst_amount
                                      ).toFixed(2)}
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

                          {/* Tax Included */}
                          {taxSettingsData &&
                            taxSettingsData.enableGst &&
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
                          {salesTxnEnableFieldsMap.get(
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

                          {salesTxnEnableFieldsMap.get(
                            'enable_product_price_other_currency'
                          ) && (
                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item?.amountOtherCurrency?.toFixed(2)}
                            </TableCell>
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
                                      Number(
                                        '' + salesRefsValue.amountRef + idx
                                      )
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
                            colSpan={9}
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
                          {item.item_name !== '' &&
                            ((productAddOnsData &&
                              productAddOnsData.length > 0 &&
                              productAddOnsData[idx] &&
                              productAddOnsData[idx].length > 0) ||
                              (item.addOnProperties &&
                                item.addOnProperties.length > 0)) && (
                              <>
                                <TableCell
                                  style={{
                                    paddingBottom: 0,
                                    paddingTop: 0,
                                    borderBottom: 'hidden'
                                  }}
                                  colSpan={2}
                                >
                                  <div>
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
                                        (inputRef.current[
                                          salesRefsValue.addCustomerBtnRef
                                        ] = el)
                                      }
                                      disableRipple
                                      className={innerClasses.addCustomerBtn}
                                      style={{
                                        position: 'relative',
                                        marginTop: '-10px',
                                        fontSize: 12,
                                        '&:focus': {
                                          border: '1px solid #F44336'
                                        },
                                        '&$focusVisible': {
                                          border: '1px solid #F44336'
                                        }
                                      }}
                                      color="secondary"
                                      onClick={() => handleOpenAddon(item, idx)}
                                    >
                                      AddOns
                                    </Button>
                                  </div>
                                </TableCell>
                                <TableCell
                                  style={{
                                    paddingBottom: 0,
                                    paddingTop: 0,
                                    borderBottom: 'hidden'
                                  }}
                                  colSpan={10}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-around'
                                    }}
                                  >
                                    <div className={classes.wrapper}>
                                      <Typography style={{ lineHeight: '2' }}>
                                        Total
                                      </Typography>
                                    </div>
                                    <div className={classes.wrapper}>
                                      <TextField
                                        variant={'outlined'}
                                        readOnly={true}
                                        value={getItemTotalAmount(item)}
                                        InputProps={{
                                          classes: {
                                            input: innerClasses.tableForm
                                          },
                                          disableUnderline: true
                                        }}
                                        fullWidth
                                        style={{
                                          marginTop: '3px',
                                          marginBottom: '3px'
                                        }}
                                      />
                                    </div>
                                  </div>
                                </TableCell>
                              </>
                            )}

                          {openAddonList && <SalesAddOnsList />}
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
                                    setDiscountPercentForAllItems(
                                      e.target.value
                                    )
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
                      {((saleDetails.order_type
                        ? saleDetails.order_type.toUpperCase() === 'POS' ||
                          saleDetails.order_type.toUpperCase() === 'KOT' ||
                          saleDetails.order_type.toUpperCase() === 'INVOICE'
                        : saleDetails.order_type) &&
                        isUpdate) ||
                      !isUpdate ? (
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
                      {/* <Typography
                        style={{
                          float: 'right',
                          //position: 'relative'
                          marginTop:'10px'
                        }}                 
                        component="span"
                      >
                        Total{' '}
                      </Typography> */}
                    </TableCell>

                    {isJewellery && metalList && metalList.length > 0 && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                    {/* ******HSN***** */}
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

                    {/* ******Batch Number***** */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_batch_number'
                    ) && <TableCell colSpan="1"></TableCell>}

                    {/* ******Brand***** */}
                    {salesTxnEnableFieldsMap.get('enable_product_brand') && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                    {/* ******Model Number***** */}
                    {salesTxnEnableFieldsMap.get('enable_product_model_no') && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                    {/* ******Other currency Placeholder cell***** */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_price_other_currency'
                    ) && <TableCell colSpan="1"></TableCell>}

                    {/* Price Colomn is not dynamic, using it for showing Total */}
                    {salesTxnEnableFieldsMap.get('enable_product_price') && (
                      <TableCell colSpan="1">
                        <Typography
                          style={{
                            float: 'right',
                            position: 'relative'
                          }}
                          component="span"
                        >
                          Total{' '}
                        </Typography>
                      </TableCell>
                    )}

                    {/* {salesTxnEnableFieldsMap.get(
                      'enable_product_price_other_currency'
                    ) && <TableCell colSpan="1"></TableCell>} */}

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

                    {salesTxnEnableFieldsMap.get(
                      'enable_product_gross_weight'
                    ) &&
                      isJewellery === 'true' && (
                        <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                          <Typography>
                            {getTotalGrossWeight}
                            {'g'}
                          </Typography>
                        </TableCell>
                      )}

                    {salesTxnEnableFieldsMap.get(
                      'enable_product_stone_weight'
                    ) &&
                      isJewellery === 'true' && (
                        <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                          <Typography>
                            {getTotalStoneWeight}
                            {'g'}
                          </Typography>
                        </TableCell>
                      )}

                    {salesTxnEnableFieldsMap.get('enable_product_net_weight') &&
                      isJewellery === 'true' && (
                        <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                          <Typography>
                            {getTotalNetWeight}
                            {'g'}
                          </Typography>
                        </TableCell>
                      )}

                    {salesTxnEnableFieldsMap.get('enable_product_wastage') &&
                      isJewellery === 'true' && (
                        <TableCell colSpan="2" style={{ textAlign: 'right' }}>
                          <Typography>
                            {getTotalWatage}
                            {'g'}
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

                    {salesTxnEnableFieldsMap.get(
                      'enable_product_stone_charge'
                    ) &&
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
                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
                      isCGSTSGSTEnabledByPOS === true && (
                        <TableCell colSpan="4"></TableCell>
                      )}
                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
                      salesTxnEnableFieldsMap.get('enable_product_igst') &&
                      isCGSTSGSTEnabledByPOS === false && (
                        <TableCell colSpan="2"></TableCell>
                      )}
                    {taxSettingsData &&
                      taxSettingsData.enableGst &&
                      salesTxnEnableFieldsMap.get('enable_tax_included') && (
                        <TableCell colSpan="1"></TableCell>
                      )}
                    {salesTxnEnableFieldsMap.get('enable_product_cess') && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                    {salesTxnEnableFieldsMap.get(
                      'enable_product_price_other_currency'
                    ) && (
                      <TableCell colSpan="1" style={{ textAlign: 'center' }}>
                        <Typography
                          style={{
                            float: 'center',
                            position: 'relative'
                          }}
                          component="span"
                        >
                          {saleDetails.totalOtherCurrency?.toFixed(2)}
                        </Typography>
                      </TableCell>
                    )}

                    <TableCell colSpan="1" style={{ textAlign: 'center' }}>
                      <Typography
                        style={{
                          float: 'center',
                          position: 'relative'
                        }}
                        component="span"
                      >
                        {saleDetails.sub_total}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  {/* <TableRow>
                    <TableCell colSpan="10" style={{ textAlign: 'center' }}>
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      
                    </TableCell>
                  </TableRow> */}

                  {/* <TableRow className={classes.addRowWrapper}>
                    <>
                      
                    </>
                  </TableRow> */}
                </TableBody>
              </Table>
            </TableContainer>

            <div style={{ width: '100%' }}>
              {salesTxnEnableFieldsMap.get('enable_total_weight') ? (
                <>
                  <Grid
                    container
                    style={{
                      backgroundColor: '#EBEBEB',
                      padding: '10px 5px 10px 5px'
                    }}
                  >
                    <Grid
                      item
                      xs={9}
                      style={{
                        borderRight: '3px solid #fff',
                        marginRight: '-1px',
                        paddingRight: '10px'
                      }}
                    >
                      {salesTxnEnableFieldsMap.get('enable_bill_notes') ? (
                        <>
                          <TextField
                            id="outlined-textarea"
                            label="Notesvvvv"
                            placeholder="Notesfff"
                            multiline
                            minRows={2}
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
                        </>
                      ) : (
                        <>
                          <TextField
                            multiline
                            minRows={2}
                            maxRows={2}
                            style={{
                              backgroundColor: '#fff',
                              border: '1px solid #e2e2e2'
                            }}
                            fullWidth
                            fontSize="6"
                            disabled={true}
                            InputProps={{ disableUnderline: true }}
                          ></TextField>
                        </>
                      )}
                      <Grid
                        container
                        className={[classes.root, classes.paymentTypeWrap]}
                      >
                        {saleTxnSettingsData.enableExport && (
                          <div className={innerClasses.expButton}>
                            <img
                              alt="Logo"
                              src={plusBlue}
                              width="20px"
                              height="20px"
                              style={{ marginTop: '2px' }}
                            />
                            <Button
                              size="small"
                              disableRipple
                              style={{
                                color: '#4A83FB',
                                height: '25px',
                                marginTop: '2px'
                              }}
                              onClick={(e) => {
                                handleOpenMfgDetails();
                              }}
                            >
                              EXPORT
                            </Button>
                          </div>
                        )}
                        {/************  PO NO *********/}

                        {salesTxnEnableFieldsMap.get('enable_po') && (
                          <div
                            className={innerClasses.expButton}
                            onClick={(e) => {
                              handleOpenPODetails();
                            }}
                          >
                            <img
                              alt="Logo"
                              src={plusBlue}
                              width="20px"
                              height="20px"
                              style={{ marginTop: '2px' }}
                            />
                            <Button
                              size="small"
                              disableRipple
                              style={{
                                color: '#4A83FB',
                                height: '25px',
                                marginTop: '2px'
                              }}
                            >
                              PO
                            </Button>
                          </div>
                        )}
                        {salesTxnEnableFieldsMap.get(
                          'enable_transportation'
                        ) && (
                          <div
                            className={innerClasses.expButton}
                            onClick={(e) => {
                              handleOpenTransportDetails();
                            }}
                          >
                            <img
                              alt="Logo"
                              src={plusBlue}
                              width="20px"
                              height="20px"
                              style={{ marginTop: '2px' }}
                            />
                            <Button
                              size="small"
                              disableRipple
                              style={{
                                color: '#4A83FB',
                                height: '25px',
                                marginTop: '2px'
                              }}
                            >
                              TRANSPORT
                            </Button>
                          </div>
                        )}
                        {/* <div className={innerClasses.expSection}></div> */}
                        {saleTxnSettingsData.enableTDS === true && (
                          // tdsList &&
                          // tdsList.length > 0 &&
                          <>
                            <div className={innerClasses.expSection}>
                              <Grid
                                container
                                direction="row"
                                spacing={0}
                                alignItems="center"
                                style={{ marginTop: '7px' }}
                              >
                                <Grid item xs={12} sm={4}>
                                  <Typography
                                    className={innerClasses.bottomFields}
                                  >
                                    TDS
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  sm={7}
                                  className={[classes.backgroundWhite]}
                                >
                                  <Select
                                    displayEmpty
                                    disableUnderline
                                    value={
                                      saleDetails.tdsName
                                        ? saleDetails.tdsName
                                        : 'Select'
                                    }
                                    fullWidth
                                    style={{ textAlign: 'center' }}
                                    onChange={async (e) => {
                                      if (e.target.value !== 'Select') {
                                        let tdsObj = await getTDSDataByName(
                                          e.target.value
                                        );

                                        setTDS(tdsObj);
                                      } else {
                                        revertTDS();
                                      }
                                    }}
                                  >
                                    <MenuItem value={'Select'}>
                                      {'Select'}
                                    </MenuItem>
                                    {tdsList.map((option, index) => (
                                      <MenuItem value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </Grid>
                              </Grid>
                            </div>
                          </>
                        )}

                        {saleTxnSettingsData.enableTCS === true && (
                          // tcsList &&
                          // tcsList.length > 0 &&
                          <div className={innerClasses.expSection}>
                            <Grid
                              container
                              direction="row"
                              spacing={0}
                              alignItems="center"
                              style={{ marginTop: '7px' }}
                            >
                              <Grid item xs={12} sm={4}>
                                <Typography
                                  className={innerClasses.bottomFields}
                                >
                                  TCS
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={7}
                                className={[classes.backgroundWhite]}
                              >
                                <Select
                                  displayEmpty
                                  disableUnderline
                                  value={
                                    saleDetails.tcsName
                                      ? saleDetails.tcsName
                                      : 'Select'
                                  }
                                  fullWidth
                                  style={{ textAlign: 'center' }}
                                  onChange={async (e) => {
                                    if (e.target.value !== 'Select') {
                                      console.log(
                                        'Value is: ' + e.target.value
                                      );
                                      let tcsObj = await getTCSDataByName(
                                        e.target.value
                                      );
                                      console.log('Value is: ' + tcsObj.name);
                                      setTCS(tcsObj);
                                    } else {
                                      revertTCS();
                                    }
                                  }}
                                >
                                  <MenuItem value={'Select'}>
                                    {'Select'}
                                  </MenuItem>
                                  {tcsList.map((option, index) => (
                                    <MenuItem value={option}>{option}</MenuItem>
                                  ))}
                                </Select>
                              </Grid>
                            </Grid>
                          </div>
                        )}
                      </Grid>
                    </Grid>
                    {isJewellery && (
                      <Grid container xs={3}>
                        <Grid item xs={12}>
                          <Grid
                            container
                            direction="row"
                            spacing={0}
                            alignItems="center"
                            style={{ marginLeft: '16px' }}
                          >
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              className={innerClasses.formWrapperSm}
                            >
                              <Typography className={innerClasses.bottomFields}>
                                Weight In
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              className={[
                                classes.backgroundWhite,
                                innerClasses.formWrapperSm
                              ]}
                            >
                              <TextField
                                className="total-wrapper-form"
                                style={{ marginLeft: '3px' }}
                                type="number"
                                onFocus={(e) =>
                                  saleDetails.weightIn === 0
                                    ? setWeightIn('')
                                    : ''
                                }
                                onChange={(e) =>
                                  setWeightIn(
                                    e.target.value ? e.target.value : 0
                                  )
                                }
                                value={saleDetails.weightIn}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12}>
                          <Grid
                            container
                            direction="row"
                            spacing={0}
                            alignItems="center"
                            style={{ marginLeft: '16px' }}
                          >
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              className={innerClasses.formWrapperSm}
                            >
                              <Typography className={innerClasses.bottomFields}>
                                Weight Out
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              className={[
                                classes.backgroundWhite,
                                innerClasses.formWrapperSm
                              ]}
                            >
                              <TextField
                                className="total-wrapper-form"
                                style={{ marginLeft: '3px' }}
                                type="number"
                                onFocus={(e) =>
                                  saleDetails.weightOut === 0
                                    ? setWeightOut('')
                                    : ''
                                }
                                onChange={(e) =>
                                  setWeightOut(
                                    e.target.value ? e.target.value : 0
                                  )
                                }
                                value={saleDetails.weightOut}
                              />
                            </Grid>
                          </Grid>
                        </Grid>

                        <Grid item xs={12}>
                          <Grid
                            container
                            direction="row"
                            spacing={0}
                            alignItems="center"
                            style={{ marginLeft: '16px' }}
                          >
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              className={innerClasses.formWrapperSm}
                            >
                              <Typography className={innerClasses.bottomFields}>
                                Wastage:&nbsp;&nbsp;&nbsp;
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              className={innerClasses.formWrapperSm}
                            >
                              <Typography>
                                {parseFloat(saleDetails.wastage || 0).toFixed(
                                  2
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </>
              ) : (
                <>
                  <Grid
                    container
                    style={{
                      backgroundColor: '#EBEBEB',
                      padding: '10px 5px 10px 5px'
                    }}
                  >
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
                          style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e2e2'
                          }}
                          placeholder="Notes"
                          multiline
                          minRows={2}
                          maxRows={2}
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
                          minRows={2}
                          maxRows={2}
                          style={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e2e2'
                          }}
                          fullWidth
                          fontSize="6"
                          disabled={true}
                          InputProps={{ disableUnderline: true }}
                        ></TextField>
                      </Grid>
                    )}
                    <Grid
                      container
                      className={[classes.root, classes.paymentTypeWrap]}
                    >
                      {saleTxnSettingsData.enableExport && (
                        <div className={innerClasses.expButton}>
                          <img
                            alt="Logo"
                            src={plusBlue}
                            width="20px"
                            height="20px"
                            style={{ marginTop: '2px' }}
                          />
                          <Button
                            size="small"
                            disableRipple
                            style={{
                              color: '#4A83FB',
                              height: '25px',
                              marginTop: '2px'
                            }}
                            onClick={(e) => {
                              handleOpenMfgDetails();
                            }}
                          >
                            EXPORT
                          </Button>
                        </div>
                      )}
                      {/************  PO NO *********/}

                      {salesTxnEnableFieldsMap.get('enable_po') && (
                        <div
                          className={innerClasses.expButton}
                          onClick={(e) => {
                            handleOpenPODetails();
                          }}
                        >
                          <img
                            alt="Logo"
                            src={plusBlue}
                            width="20px"
                            height="20px"
                            style={{ marginTop: '2px' }}
                          />
                          <Button
                            size="small"
                            disableRipple
                            style={{
                              color: '#4A83FB',
                              height: '25px',
                              marginTop: '2px'
                            }}
                          >
                            PO
                          </Button>
                        </div>
                      )}
                      {salesTxnEnableFieldsMap.get('enable_transportation') && (
                        <div
                          className={innerClasses.expButton}
                          onClick={(e) => {
                            handleOpenTransportDetails();
                          }}
                        >
                          <img
                            alt="Logo"
                            src={plusBlue}
                            width="20px"
                            height="20px"
                            style={{ marginTop: '2px' }}
                          />
                          <Button
                            size="small"
                            disableRipple
                            style={{
                              color: '#4A83FB',
                              height: '25px',
                              marginTop: '2px'
                            }}
                          >
                            TRANSPORT
                          </Button>
                        </div>
                      )}
                      {/* <div className={innerClasses.expSection}></div> */}
                      {saleTxnSettingsData.enableTDS === true && (
                        // tdsList &&
                        // tdsList.length > 0 &&
                        <>
                          <div className={innerClasses.expSection}>
                            <Grid
                              container
                              direction="row"
                              spacing={0}
                              alignItems="center"
                              style={{ marginTop: '7px' }}
                            >
                              <Grid item xs={12} sm={4}>
                                <Typography
                                  className={innerClasses.bottomFields}
                                >
                                  TDS
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={12}
                                sm={7}
                                className={[classes.backgroundWhite]}
                              >
                                <Select
                                  displayEmpty
                                  disableUnderline
                                  value={
                                    saleDetails.tdsName
                                      ? saleDetails.tdsName
                                      : 'Select'
                                  }
                                  fullWidth
                                  style={{ textAlign: 'center' }}
                                  onChange={async (e) => {
                                    if (e.target.value !== 'Select') {
                                      let tdsObj = await getTDSDataByName(
                                        e.target.value
                                      );

                                      setTDS(tdsObj);
                                    } else {
                                      revertTDS();
                                    }
                                  }}
                                >
                                  <MenuItem value={'Select'}>
                                    {'Select'}
                                  </MenuItem>
                                  {tdsList.map((option, index) => (
                                    <MenuItem value={option}>{option}</MenuItem>
                                  ))}
                                </Select>
                              </Grid>
                            </Grid>
                          </div>
                        </>
                      )}

                      {saleTxnSettingsData.enableTCS === true && (
                        // tcsList &&
                        // tcsList.length > 0 &&
                        <div className={innerClasses.expSection}>
                          <Grid
                            container
                            direction="row"
                            spacing={0}
                            alignItems="center"
                            style={{ marginTop: '7px' }}
                          >
                            <Grid item xs={12} sm={4}>
                              <Typography className={innerClasses.bottomFields}>
                                TCS
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              sm={7}
                              className={[classes.backgroundWhite]}
                            >
                              <Select
                                displayEmpty
                                disableUnderline
                                value={
                                  saleDetails.tcsName
                                    ? saleDetails.tcsName
                                    : 'Select'
                                }
                                fullWidth
                                style={{ textAlign: 'center' }}
                                onChange={async (e) => {
                                  if (e.target.value !== 'Select') {
                                    console.log('Value is: ' + e.target.value);
                                    let tcsObj = await getTCSDataByName(
                                      e.target.value
                                    );
                                    console.log('Value is: ' + tcsObj.name);
                                    setTCS(tcsObj);
                                  } else {
                                    revertTCS();
                                  }
                                }}
                              >
                                <MenuItem value={'Select'}>{'Select'}</MenuItem>
                                {tcsList.map((option, index) => (
                                  <MenuItem value={option}>{option}</MenuItem>
                                ))}
                              </Select>
                            </Grid>
                          </Grid>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </>
              )}
            </div>

            <Grid container>
              <Grid item xs={5} justifyContent="flex-start">
                <FileUpload
                  onFilesUpload={handleFileUpload}
                  uploadedFiles={saleDetails.imageUrls}
                  fileNameDisplay={false}
                />
              </Grid>
              <Grid item xs={4}>
                {salesTxnEnableFieldsMap.get('enable_bill_insurance') && (
                  <>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      alignItems="center"
                      style={{ marginTop: '7px', marginLeft: '10px' }}
                    >
                      <Grid item>
                        <Typography className={innerClasses.bottomFields}>
                          Insurance
                        </Typography>
                      </Grid>

                      <Grid
                        item
                        className={[classes.backgroundWhite]}
                        style={{ marginLeft: '10px' }}
                      >
                        <Select
                          displayEmpty
                          disableUnderline
                          value={insurance.type === 'amount' ? '₹' : '%'}
                          fullWidth
                          style={{ textAlign: 'center' }}
                          onChange={(e) => {
                            setInsuranceType(e.target.value);
                          }}
                        >
                          <MenuItem value={'%'}>{'%'}</MenuItem>
                          <MenuItem value={'₹'}>{'₹'}</MenuItem>
                        </Select>
                      </Grid>

                      <Grid
                        item
                        style={{ padding: '0 0 0 10px', marginLeft: '10px' }}
                        className={[classes.backgroundWhite]}
                      >
                        <Grid container direction="row" spacing={0}>
                          <Grid
                            item
                            sm={
                              isOtheCurrencyEnabled &&
                              insurance.type === 'amount'
                                ? 8
                                : 10
                            }
                          >
                            <TextField
                              className="total-wrapper-form"
                              id="insurance"
                              inputRef={(el) =>
                                (inputRef.current[salesRefsValue.discountRef] =
                                  el)
                              }
                              type="number"
                              autoComplete="off"
                              InputProps={{ disableUnderline: true }}
                              onChange={(e) => {
                                if (insurance.type === 'percentage') {
                                  setInsurancePercent(e.target.value);
                                } else {
                                  setInsuranceAmount(e.target.value);
                                }
                              }}
                              value={
                                insurance.type === 'percentage'
                                  ? insurance.percent
                                  : insurance.amount
                              }
                            />
                          </Grid>
                          {isOtheCurrencyEnabled &&
                            insurance.type === 'amount' && (
                              <Grid
                                item
                                xs={12}
                                sm={2}
                                className={[classes.backgroundWhite]}
                                style={{
                                  height: '32px',
                                  padding: '4px 6px',
                                  marginLeft: '4px',
                                  fontSize: '18px'
                                }}
                              >
                                {insurance?.amountOtherCurrency?.toFixed(2)}
                              </Grid>
                            )}
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        className={[classes.backgroundWhite]}
                        style={{ marginLeft: '10px', paddingLeft: '10px' }}
                      >
                        <Select
                          displayEmpty
                          disableUnderline
                          value={insuranceTax}
                          fullWidth
                          style={{ textAlign: 'center' }}
                          onChange={(e) => {
                            setInsuranceTax(e.target.value);
                          }}
                        >
                          <MenuItem value={'0'}>{'0 %'}</MenuItem>
                          <MenuItem value={'3'}>{'3 %'}</MenuItem>
                          <MenuItem value={'5'}>{'5 %'}</MenuItem>
                          <MenuItem value={'12'}>{'12 %'}</MenuItem>
                          <MenuItem value={'18'}>{'18 %'}</MenuItem>
                          <MenuItem value={'28'}>{'28 %'}</MenuItem>
                        </Select>
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>

              <Grid item xs={3}>
                {salesTxnEnableFieldsMap.get('enable_bill_insurance') && (
                  <>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      alignItems="center"
                      style={{ marginTop: '7px' }}
                    >
                      <Grid item xs={4}>
                        <Typography className={innerClasses.bottomFields}>
                          Policy No
                        </Typography>
                      </Grid>

                      <Grid item xs={8} className={[classes.backgroundWhite]}>
                        <TextField
                          className="total-wrapper-form"
                          id="insurance_policy_no"
                          InputProps={{ disableUnderline: true }}
                          onChange={(e) => {
                            setInsurancePolicyNo(e.target.value);
                          }}
                          value={insurance.policyNo}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>

            <div style={{ width: '100%' }}>
              {salesTxnEnableFieldsMap.get('enable_bill_notes') && (
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
                    label="Terms & Conditions"
                    style={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e2e2'
                    }}
                    placeholder="Terms & Conditions"
                    multiline
                    minRows={2}
                    maxRows={2}
                    fullWidth
                    fontSize="6"
                    onChange={(e) => setTerms(e.target.value)}
                    value={saleDetails.terms}
                  ></TextField>
                </Grid>
              )}
            </div>
          </Grid>
        </div>
        {/*------------------------------------- Dialog Footer----------------------------------- */}
        <div className={classes.footer} style={{ height: '130px' }}>
          {/*********** PO Details, Transport & Payment row ********/}

          {/*********** Packing Charges Row ********/}
          <Grid
            container
            justifyContent="space-between"
            className={[classes.root, classes.paymentTypeWrap]}
          >
            {saleDetails.payment_type !== 'Credit' ? (
              <>
                <Grid item xs={12} style={{ display: 'flex' }} sm={2}>
                  <Grid
                    container
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    // style={{ marginTop: '7px' }}
                  >
                    <Grid item xs={4} style={{ textAlign: 'left' }}>
                      <Typography className={innerClasses.bottomFields}>
                        Payment
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={7}
                      className={[classes.backgroundWhite]}
                      style={{ marginLeft: '3px' }}
                    >
                      <Select
                        displayEmpty
                        disableUnderline
                        value={
                          saleDetails.payment_type === 'Split'
                            ? 'cash'
                            : saleDetails.payment_type
                        }
                        fullWidth
                        style={{ textAlign: 'center' }}
                        onChange={(e) => {
                          if ('cash' === e.target.value) {
                            setPaymentType('cash');
                            setPaymentTypeVal('Cash');
                          } else {
                            if (
                              splitPaymentSettingsData.defaultBankSelected !==
                                '' &&
                              splitPaymentSettingsData.defaultBankSelected !==
                                undefined &&
                              splitPaymentSettingsData.defaultBankSelected !==
                                null
                            ) {
                              let bankAccount = bankAccounts.find(
                                (o) =>
                                  o.accountDisplayName ===
                                  splitPaymentSettingsData.defaultBankSelected
                              );

                              if (bankAccount) {
                                setBankAccountData(bankAccount, e.target.value);
                                setPaymentTypeVal(e.target.value);
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
                          <MenuItem value={option.val}>{option.name}</MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{ display: 'flex' }}
                  className={innerClasses.footerSide}
                  sm={2}
                >
                  <Grid
                    container
                    direction="row"
                    spacing={0}
                    alignItems="center"
                  >
                    <Grid item xs={3} style={{ textAlign: 'left' }}>
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
                    <Grid item xs={8}>
                      <Typography
                        className={[classes.fntClr, innerClasses.bottomFields]}
                      >
                        Split Pay
                      </Typography>
                      {chosenPaymentType === 'Split' && (
                        <EditIcon
                          onClick={() => handleOpenSplitPaymentDetails()}
                          //style={{ marginLeft: 10 }}
                          className={classes.deleteIcon}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : (
              <></>
            )}
            <Grid
              item
              xs={12}
              style={{ display: 'flex' }}
              className={innerClasses.footerSide}
              sm={3}
            >
              <Grid
                container
                direction="row"
                spacing={0}
                alignItems="center"
                // style={{ marginTop: '7px' }}
              >
                {salesTxnEnableFieldsMap.get('enable_package_charge') ? (
                  <>
                    <Grid
                      item
                      xs={isOtheCurrencyEnabled ? 3 : 5}
                      style={{ textAlign: 'left' }}
                    >
                      <Typography className={innerClasses.bottomFields}>
                        Packing Charge
                      </Typography>
                    </Grid>
                    <Grid item xs={3} className={[classes.backgroundWhite]}>
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
                    {isOtheCurrencyEnabled && (
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        className={[classes.backgroundWhite]}
                        style={{
                          height: '32px',
                          padding: '4px 6px',
                          marginLeft: '4px',
                          fontSize: '18px'
                        }}
                      >
                        {saleDetails?.packingChargeOtherCurrency?.toFixed(2)}
                      </Grid>
                    )}
                    <Grid
                      item
                      xs={3}
                      className={[classes.backgroundWhite]}
                      style={{ marginLeft: '3px' }}
                    >
                      <Select
                        displayEmpty
                        disableUnderline
                        value={packingTax}
                        fullWidth
                        style={{ textAlign: 'center' }}
                        onChange={(e) => {
                          setPackingTax(e.target.value);
                        }}
                      >
                        <MenuItem value={'0'}>{'0 %'}</MenuItem>
                        <MenuItem value={'3'}>{'3 %'}</MenuItem>
                        <MenuItem value={'5'}>{'5 %'}</MenuItem>
                        <MenuItem value={'12'}>{'12 %'}</MenuItem>
                        <MenuItem value={'18'}>{'18 %'}</MenuItem>
                        <MenuItem value={'28'}>{'28 %'}</MenuItem>
                      </Select>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12} />
                )}
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: 'flex' }}
              className={innerClasses.footerSide}
              sm={3}
            >
              <Grid
                container
                direction="row"
                spacing={0}
                alignItems="center"
                // style={{ marginTop: '7px' }}
              >
                {salesTxnEnableFieldsMap.get('enable_shipping_charge') ? (
                  <>
                    <Grid item xs={12} sm={isOtheCurrencyEnabled ? 3 : 5}>
                      <Typography className={innerClasses.bottomFields}>
                        Shipping Charge
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      className={[classes.backgroundWhite]}
                      style={{ marginLeft: '3px' }}
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
                    {isOtheCurrencyEnabled && (
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        className={[classes.backgroundWhite]}
                        style={{
                          height: '32px',
                          padding: '4px 6px',
                          marginLeft: '4px',
                          fontSize: '18px'
                        }}
                      >
                        {saleDetails?.shippingChargeOtherCurrency?.toFixed(2)}
                      </Grid>
                    )}
                    <Grid
                      item
                      xs={3}
                      className={[classes.backgroundWhite]}
                      style={{ marginLeft: '3px' }}
                    >
                      <Select
                        displayEmpty
                        disableUnderline
                        value={shippingTax}
                        fullWidth
                        style={{ textAlign: 'center' }}
                        onChange={(e) => {
                          setShippingTax(e.target.value);
                        }}
                      >
                        <MenuItem value={'0'}>{'0 %'}</MenuItem>
                        <MenuItem value={'3'}>{'3 %'}</MenuItem>
                        <MenuItem value={'5'}>{'5 %'}</MenuItem>
                        <MenuItem value={'12'}>{'12 %'}</MenuItem>
                        <MenuItem value={'18'}>{'18 %'}</MenuItem>
                        <MenuItem value={'28'}>{'28 %'}</MenuItem>
                      </Select>
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12} sm={5} />
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} className={innerClasses.footerSide} sm={2}>
              {salesTxnEnableFieldsMap.get('enable_bill_discount') && (
                <>
                  <Grid
                    container
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    style={{ marginTop: '7px' }}
                  >
                    <Grid item xs={3}>
                      <Typography className={innerClasses.bottomFields}>
                        Disc
                      </Typography>
                    </Grid>

                    <Grid item xs={3} className={[classes.backgroundWhite]}>
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
                      xs={4}
                      style={{ marginLeft: '2%', padding: '0 0 0 10px' }}
                      className={[classes.backgroundWhite]}
                    >
                      <Grid container direction="row" spacing={0}>
                        <Grid item xs={10}>
                          {((saleDetails.order_type
                            ? saleDetails.order_type.toUpperCase() === 'POS' ||
                              saleDetails.order_type.toUpperCase() === 'KOT' ||
                              saleDetails.order_type.toUpperCase() === 'INVOICE'
                            : saleDetails.order_type) &&
                            isUpdate) ||
                          !isUpdate ? (
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
                                if (
                                  saleDetails.discount_type === 'percentage'
                                ) {
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
                          ) : (
                            <TextField
                              className="total-wrapper-form"
                              id="discount"
                              InputProps={{ disableUnderline: true }}
                              value={
                                saleDetails.discount_type === '%'
                                  ? saleDetails.discount_percent
                                  : saleDetails.discount_amount
                              }
                            />
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>

            {/* <Grid item xs={12} sm={2}></Grid> */}

            {saleDetails.is_credit ? (
              <>
                <Grid item xs={12} sm={2} className={innerClasses.footerSide}>
                  <Grid
                    container
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    style={{ marginTop: '7px' }}
                  >
                    <Grid item xs={12} sm={5}>
                      <Typography className={innerClasses.bottomFields}>
                        Balance
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      className={[classes.backgroundWhite]}
                      style={{ padding: '0 0 0 10px' }}
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
              <></>
            )}
          </Grid>

          {/*********** Save N Total Row ********/}
          <Grid
            container
            style={{ height: '100%', padding: '0px 0px 0px 14px' }}
          >
            <Grid item xs={6} style={{ marginTop: '10px' }}>
              {isLocked === true && (
                <div style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                  <p style={{ color: '#EF5350' }}>
                    <b>{saleLockMessage}</b>
                  </p>
                </div>
              )}

              {(isUpdate || !isUpdate) &&
              !(
                saleDetails.isPartiallyReturned ||
                saleDetails.isFullyReturned ||
                saleDetails.isCancelled ||
                isLocked
              ) ? (
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
                <div style={{ marginTop: '10px' }}></div>
              )}

              {transaction.enableEway &&
              saleDetails.total_amount >= transaction.enableEWayAmountLimit &&
              (saleDetails.ewayBillNo === '' ||
                saleDetails.ewayBillNo === null) ? (
                <>
                  {(isUpdate || !isUpdate) &&
                    !(
                      saleDetails.isPartiallyReturned ||
                      saleDetails.isFullyReturned ||
                      saleDetails.isCancelled ||
                      isLocked
                    ) && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        ref={(el) =>
                          (inputRef.current[salesRefsValue.saveNewRef] = el)
                        }
                        className={classes.footercontrols}
                        onClick={() => saveAndGenEWayClick(false)}
                      >
                        Save & Gen E-Way{' '}
                      </Button>
                    )}
                </>
              ) : (
                <>
                  {(isUpdate || !isUpdate) &&
                    !(
                      saleDetails.isPartiallyReturned ||
                      saleDetails.isFullyReturned ||
                      saleDetails.isCancelled ||
                      isLocked
                    ) && (
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
                </>
              )}

              {(isUpdate || !isUpdate) &&
                !(
                  saleDetails.isPartiallyReturned ||
                  saleDetails.isFullyReturned ||
                  saleDetails.isCancelled ||
                  isLocked
                ) &&
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
            <Grid item xs={2} style={{ marginTop: '20px' }}>
              {saleDetails.is_credit &&
                (saleDetails.linked_amount > 0 ||
                  paymentLinkTransactions.length > 0) &&
                items.length > 0 &&
                items[0].amount > 0 && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={saleDetails.linkPayment}
                        ref={(el) =>
                          (inputRef.current[salesRefsValue.linkpaymentRef] = el)
                        }
                        onChange={(e) => {
                          setLinkPayment();
                        }}
                        name="LinkPayment"
                      />
                    }
                    label={
                      'Link Payment'
                        .concat(' (₹')
                        .concat(saleDetails.linked_amount) + ' )'
                    }
                  />
                )}
            </Grid>
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

        {openLinkpaymentPage ? (
          <LinkPaymentSales
            onClose={closeLinkPayment}
            isEditAllowed={
              !(
                saleDetails.isPartiallyReturned ||
                saleDetails.isFullyReturned ||
                saleDetails.isCancelled ||
                isLocked
              )
            }
          />
        ) : null}

        {OpenBatchList ? (
          <BatchListModal
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleBatchListModalClose}
          />
        ) : null}

        {OpenSerialList ? (
          <SerialListModal
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleSerialListModalClose}
          />
        ) : null}

        {openTransportDetails ? (
          <TransportDetails onClose={handleCloseTransportDetails} />
        ) : null}

        {openPODetails ? <PODetails onClose={handleClosePODetails} /> : null}

        {openMfgDetails ? <MFGDetails onClose={handleOpenMfgDetails} /> : null}

        {openSplitPaymentDetails ? (
          <SplitPaymentDetails onClose={handleCloseSplitPaymentDetails} />
        ) : null}

        {openAddressList ? (
          <SaleAddressListModal
            open={openAddressList}
            addressList={customerAddressList}
            onClose={handleCloseAddressList}
          />
        ) : null}

        {customerDialogOpen ? <CustomerModal /> : null}

        {openProductDetails ? (
          <SaleProductDetails onClose={handleOpenProductDetails} />
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
            Please Choose {getCustomerName()} from list before performing a
            Credit {getSaleName()}.
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
            {getSaleName()} cannot be performed without adding products.
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
        open={openCreditSaleNoConversionAlert}
        onClose={handleCreditSaleNoConversionAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Sorry! Please Link payment to convert Credit {getSaleName()} to Paid{' '}
            {getSaleName()}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCreditSaleNoConversionAlertClose}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openSaleMoreThanStockAlert}
        onClose={handleSaleMoreThanStockAlertOKClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>Low Stock Alert!</DialogTitle>
        <DialogContent>
          <DialogContentText>{saleMoreThanStockText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSaleMoreThanStockAlertOKClose}
            color="primary"
            autoFocus
          >
            Ok
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
      <Dialog
        fullScreen={fullScreen}
        open={openSaleLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Invoice is being created!!!</p>
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
            We are unable to reach our Server to get next sequence No due to
            Network fluctuations. Please try again!
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
      <Dialog
        fullScreen={fullScreen}
        open={openBalanceExceededAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Credit provision for the customer is exceeding the configured limit
            !!
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
      <Dialog
        fullScreen={fullScreen}
        open={productOutOfStockAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <b>{productOutOfStockName}</b> is currently Out of Stock. Please
            purchase to proceed with {getSaleName()}!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseOOSAlert} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openAmendmentDialog}
        onClose={proceedToSaveWithoutAmendmentDetails}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Do you wish to amend this Invoice?
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth>
            <Typography variant="subtitle1">Reason</Typography>
            <TextField
              fullWidth
              multiline
              type="text"
              variant="outlined"
              margin="dense"
              minRows="3"
              className="customTextField"
              onChange={(event) => setAmendmentRemarks(event.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ marginLeft: '100px' }}>
              <Button
                variant="contained"
                onClick={() => proceedToSaveWithAmendmentDetails()}
              >
                Yes
              </Button>
            </div>
            <Button
              style={{ marginLeft: '10px' }}
              variant="contained"
              onClick={() => proceedToSaveWithoutAmendmentDetails()}
            >
              No
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};
const useOutsideAlerter = (ref, index) => {};
const EditTable = (props) => {
  const store = useStore();
  const { setEditTable, getAddRowEnabled, setAddRowEnabled } =
    store.SalesAddStore;
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
        if (!getAddRowEnabled() && props.orderType !== 'kot') {
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
export default injectWithObserver(AddSalesInvoice);