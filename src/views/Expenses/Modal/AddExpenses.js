import React, { forwardRef, useEffect, useRef, useState } from 'react';

import { Cancel, DeleteOutlined } from '@material-ui/icons';
import {
  Select,
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
  MenuItem,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  makeStyles,
  Switch,
  InputAdornment,
  RadioGroup,
  Radio
} from '@material-ui/core';
//import local components
import CategoriesSearch from '../../../components/CategoriesSearch';
import * as Db from '../../../RxDb/Database/Database';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import styles from './style';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import * as moment from 'moment';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import getStateList from '../../../components/StateList';
import Arrowtopright from '../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../icons/Arrowbottomleft';
import VendorModal from 'src/views/Vendors/modal/AddVendor';
import plus from '../../../icons/plus.png';
import * as Bd from '../../../components/SelectedBusiness';
import Loader from 'react-js-loader';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import { styled } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import ExpenseSplitPaymentDetails from './ExpenseSplitPaymentDetails';
import InvSeqIcon from '@material-ui/icons/EditOutlined';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
import * as balanceUpdate from 'src/components/Helpers/CustomerAndVendorBalanceHelper';
import { FileUpload } from 'src/components/common/FileUpload';
import { getPartyDataById } from 'src/components/Helpers/dbQueries/parties';

var dateFormat = require('dateformat');

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useInnerStyles = makeStyles((theme) => ({
  headerFooterWrapper: {
    padding: 15,
    margin: '20px 0'
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
    /* marginBottom: 35, */
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
  formpadding: {
    padding: '0px 1rem',
    '& .formLabel': {
      position: 'relative',
      top: 15
    }
  },
  content: {
    top: '14%',
    position: 'absolute',
    bottom: '240px',
    left: '0px',
    right: '0px',
    overflow: 'auto',
    '@media (max-width: 1500px)': {
      top: '16%'
    }
  },
  total_val: {
    marginTop: '10px',
    border: '3px solid #FFAF01'
  },
  total_design: {
    marginTop: '10px !important',
    background: '#FFAF01',
    borderBottomLeftRadius: '20px',
    borderTopLeftRadius: '20px',
    padding: '6px 0px 5px 25px',
    color: 'white'
  },
  notesOption: {
    margin: '17px',
    border: '1px solid darkgrey',
    borderRadius: '10px',
    width: '200px',
    padding: '10px',

    '& .MuiInputBase-input': {
      background: 'white',
      padding: '10px'
    },
    '& .MuiInputLabel-formControl': {
      padding: '12px'
    }
  },
  root: {
    '& > *': {
      margin: '-10px',
      textTransform: 'capitalize',
      color: '#ef5350'
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

const AddExpenses = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();

  const store = useStore();

  const {
    handleAddExpensesModalClose,
    addNewItem,
    deleteItem,
    setExpenseItemName,
    setExpenseDate,
    setExpenseDueDate,
    setAmount,
    getTotalAmount,
    setPaymentType,
    setQuantity,
    toggleRoundOff,
    getRoundedAmount,
    saveExpense,
    setNotes,
    setPaymentMode,
    setBankAccountData,
    setPaymentReferenceNumber,
    setExpenseTxnEnableFieldsMap,
    setTaxSettingsData,
    setHsn,
    setDiscount,
    setDiscountAmount,
    setPackingCharge,
    setShippingCharge,
    setItemDiscount,
    setItemDiscountAmount,
    setCGST,
    setSGST,
    setIGST,
    setCess,
    setTaxIncluded,
    setCreditData,
    setReverseChargeEnable,
    setVendorName,
    setVendorId,
    setVendor,
    setPlaceOfSupply,
    setEditTable,
    setPlaceOfSupplyName,
    setBillNumber,
    setReverseChargeValue,
    setPrice,
    getBalanceData,
    handleCloseExpenseErrorAlertMessage,
    handleOpenExpenseLoadingMessage,
    setRoundingConfiguration,
    setFreeQuantity,
    setTDS,
    revertTDS,
    setBankAccountList,
    setSplitPaymentSettingsData,
    handleCloseSplitPaymentDetails,
    handleOpenSplitPaymentDetails,
    setChosenPaymentType,
    resetSplitPaymentDetails,
    setAutoGenMode,
    setExpenseType,
    setCGSTSGSTEnabledByPOS,
    handleCloseSequenceNumberFailureAlert,
    setDiscountType,
    setRCMEnable,
    setITCEnable,
    setDiscountPercentForAllItems,
    setExpensesUploadedFiles,
    setCreditLimitDays
  } = store.ExpensesStore;

  const {
    addExpensesDialogue,
    item_list,
    expense,
    isUpdate,
    categoryList,
    taxSettingsData,
    expenseTxnEnableFieldsMap,
    previousBalanceAmount,
    openExpenseLoadingAlertMessage,
    openExpenseErrorAlertMessage,
    expenseTransSettingData,
    openSplitPaymentDetails,
    chosenPaymentType,
    splitPaymentSettingsData,
    isAutoGenMode,
    isCGSTSGSTEnabledByPOS,
    sequenceNumberFailureAlert,
    customerCreditDays
  } = toJS(store.ExpensesStore);
  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);
  const { getTaxSettingsDetails } = store.TaxSettingsStore;
  const { getSplitPaymentSettingdetails } = store.SplitPaymentSettingsStore;
  const { getExpenseTransSettingdetails } =
    store.ExpenseTransactionSettingsStore;

  const [payment_type_val, setPaymentTypeVal] = React.useState('');

  const { getAuditSettingsData } = store.AuditSettingsStore;

  const payment_mode_list = [
    { val: 'cash', name: 'CASH' },
    { val: 'upi', name: 'UPI' },
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' }
  ];

  const ItemList = {
    item: '',
    quantity: 0,
    amount: 0,
    isEdit: true
  };

  const [bankAccounts, setBankAccounts] = React.useState([]);

  const [openCategorySelectionAlert, setCategorySelectionAlert] =
    React.useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [vendorNameWhileEditing, setVendorNameWhileEditing] = useState('');
  const [openVendorNotProvidedAlert, setVendorNotProvidedAlert] =
    React.useState(false);
  const { handleVendorModalOpenFromPurchases } = store.VendorStore;
  const { vendorDialogOpen, vendorFromPurchases } = toJS(store.VendorStore);
  const [place_of_supply, setPlaceOfSupplyValue] = React.useState('');
  const [printData, setPrintData] = React.useState(null);
  const [openDialogName, setOpenDialogName] = React.useState(null);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [stateList, setStateList] = useState([]);
  const [vendorList, setVendorList] = React.useState();
  const [menuOpenStatus, setMenuOpenStatus] = React.useState(false);
  const [openNoProductsAlert, setNoProductsAlert] = React.useState(false);
  const [openBillNoNotProvidedAlert, setBillNoNotProvidedAlert] =
    React.useState(false);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const { transaction } = toJS(store.TransactionStore);
  const { getTransactionData } = store.TransactionStore;

  const [tcsList, setTcsList] = React.useState([]);
  const { getTCS, getTCSDataByName } = store.TCSStore;
  const [tdsList, setTdsList] = React.useState([]);
  const { getTDS, getTDSDataByName } = store.TDSStore;

  const [businessStateCode, setBusinessStateCode] = React.useState('');
  const [isPlaceOfSupplyOverridden, setPlaceOfSupplyOverridden] =
    React.useState(false);

  const [openBalanceExceededAlert, setOpenBalanceExceededAlert] =
    React.useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleBalanceExceededAlertClose = () => {
    setOpenBalanceExceededAlert(false);
  };

  const handleAlertClose = () => {
    setCategorySelectionAlert(false);
  };

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const handleNoProductsAlertClose = () => {
    setNoProductsAlert(false);
  };

  const deleteRow = (index) => {
    deleteItem(index);
  };

  const handleDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');
    setExpenseDate(date);
  };

  const handleDueDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');
    setExpenseDueDate(date);
  };

  const handleAddRow = () => {
    console.log('add row');
    addNewItem(ItemList);
  };

  useEffect(() => {
    setStateList(getStateList());
    getBankAccounts();
  }, []);

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

    if (expense.category === '') {
      setCategorySelectionAlert(true);
    } else if (!isAutoGenMode && expense.billNumber === '') {
      setBillNoNotProvidedAlert(true);
    } else if (
      (expense.is_credit || parseFloat(expense.balance_amount) > 0) &&
      expense.vendor_id === ''
    ) {
      setVendorNotProvidedAlert(true);
    } else if (
      item_list.length === 0 ||
      (item_list.length === 1 && item_list[0].item === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setPlaceOfSupplyOverridden(false);
      handleOpenExpenseLoadingMessage();
      saveExpense()
        .then((data) => {
          console.log('data Inserted');
        })
        .catch((err) => {
          console.log('save expense Failed', err);
          // alert('Error in Adding Data');
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

    if (expense.category === '') {
      setCategorySelectionAlert(true);
    } else if (!isAutoGenMode && expense.billNumber === '') {
      setBillNoNotProvidedAlert(true);
    } else if (
      (expense.is_credit || parseFloat(expense.balance_amount) > 0) &&
      expense.vendor_id === ''
    ) {
      setVendorNotProvidedAlert(true);
    } else if (
      item_list.length === 0 ||
      (item_list.length === 1 && item_list[0].item === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setPlaceOfSupplyOverridden(false);
      handleOpenExpenseLoadingMessage();
      saveExpense(true)
        .then((data) => {
          console.log('data Inserted');
        })
        .catch((err) => {
          console.log('Expense Insertion Failed - ', err);
        });
    }
  };

  const isBalanceLimitExceeded = async () => {
    let isBalanceExceed = false;

    if (expense.is_credit) {
      let customerData = await balanceUpdate.getCustomerBalanceById(
        expense.vendor_id
      );
      if (customerData.creditLimit > 0) {
        let fullBalance = parseFloat(customerData.totalBalance) + expense.total;
        if (fullBalance > customerData.creditLimit) {
          isBalanceExceed = true;
        }
      }
    }

    return isBalanceExceed;
  };

  const isProductsValid = async () => {
    let isProductsValid = true;
    let errorMessage = '';

    let auditSettings = await getAuditSettingsData();

    if (chosenPaymentType === 'Split') {
      if (getSplitPaymentTotalAmount() !== expense.total) {
        setErrorAlertProductMessage(
          'Please check the total amount provided in Split Payment. Its not matching the expense total amount.'
        );
        setErrorAlertProduct(true);
        isProductsValid = false;
      }
    }

    for (var i = 0; i < item_list.length; i++) {
      let item = item_list[i];
      /*  if (item.amount === 0) {
        continue;
      } */

      if (item.amount === 0 && item.quantity === 0 && item.price === 0) {
        continue;
      }

      let slNo = i + 1;
      let itemMessage =
        '<br /><b>Sl No: </b>' +
        slNo +
        '<br /><b>Product Name: </b>' +
        item.item +
        '<br />';
      let itemValid = true;
      if (
        item.quantity === '' ||
        item.quantity === 0 ||
        item.quantity === undefined ||
        item.quantity === null
      ) {
        itemValid = false;
        itemMessage += 'Quantity should be greater than 0<br />';
      }
      if (
        item.price === '' ||
        item.price === 0 ||
        item.price === undefined ||
        item.price === null
      ) {
        itemValid = false;
        itemMessage += 'Price should be greater than 0<br />';
      }
      if (item.item === '') {
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
    if (expense.splitPaymentList && expense.splitPaymentList.length > 0) {
      for (let payment of expense.splitPaymentList) {
        if (payment.amount !== '') {
          result += parseFloat(payment.amount);
        }
      }
    }
    return result;
  };

  useEffect(() => {
    async function fetchData() {
      await getTransactionData();
    }

    fetchData();
  }, []);

  useEffect(() => {
    setRoundingConfiguration(transaction.roundingConfiguration);
  }, [transaction.roundingConfiguration]);

  const inputOnChange = (e, index, setFunction) => {
    e.persist();
    setFunction(index, e.target.value);
  };

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };
  const checkCloseDialog = () => {
    if (
      (item_list.length === 1 && item_list[0].item === '') ||
      item_list.length === 0 ||
      isUpdate
    ) {
      handleAddExpensesModalClose();
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

  const [payment_type_list, setPaymentTypeList] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      setExpenseTxnEnableFieldsMap(await getExpenseTransSettingdetails());
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setTaxSettingsData(await getTaxSettingsDetails());
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getBankAccounts();
      setSplitPaymentSettingsData(await getSplitPaymentSettingdetails());
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (expense.placeOfSupply) {
      let result = stateList.find((e) => e.val === expense.placeOfSupply);

      if (result) {
        setPlaceOfSupplyValue(result.name);
        setPlaceOfSupplyName(result.name);
      }
    } else {
      if (
        taxSettingsData &&
        taxSettingsData.gstin &&
        taxSettingsData.gstin !== ''
      ) {
        let extractedStateCode = taxSettingsData.gstin.slice(0, 2);
        setBusinessStateCode(extractedStateCode);
        let result = stateList.find((e) => e.code === extractedStateCode);
        if (result) {
          setPlaceOfSupplyValue(result.name);
          setPlaceOfSupplyName(result.name);
          setPlaceOfSupply(result.val);
        }
      } else {
        setPlaceOfSupplyValue('');
        setPlaceOfSupplyName('');
        setPlaceOfSupply('');
      }
    }
  }, [expense.placeOfSupply, stateList]);

  useEffect(() => {
    async function fetchData() {
      setTcsList([]);
      let tcsListData = await getTCS();
      for (let tcs of tcsListData) {
        tcsList.push(tcs.name);
      }
      setTcsList(tcsList);
    }

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

  useEffect(() => {
    if (expense.paymentType) {
      let result = payment_mode_list.find((e) => e.val === expense.paymentType);
      if (result) {
        setPaymentTypeVal(result.name);
      }
    } else {
      setPaymentTypeVal('');
    }
  }, [expense.paymentType]);

  const handleAddVendor = () => {
    handleVendorModalOpenFromPurchases();
  };

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  useEffect(() => {
    if (printData) {
      setIsStartPrint(true);
      setOpenDialogName('print');
      setTimeout(() => {
        setIsStartPrint(false);
        setOpenDialogName('');
        setPrintData(null);
        setCloseDialogAlert(false);
      }, 500);
    }
  }, [printData]);

  const handleVendorClick = (vendor) => {
    setVendorName(vendor.name);
    setVendorId(vendor.id);
    setVendor(vendor);
    setVendorNameWhileEditing('');
    setVendorList([]);
    setEditTable(0, true, 1);

    if (vendor.creditLimitDays > 0 && expense.is_credit) {
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() + vendor.creditLimitDays);
      setExpenseDueDate(dateFormat(currentDate, 'yyyy-mm-dd'));
    }

    if (vendor.state) {
      let result = stateList.find((e) => e.name === vendor.state);
      if (result) {
        setPlaceOfSupply(result.val);
        setPlaceOfSupplyName(result.name);
        setPlaceOfSupplyValue(result.name);
      }
    }

    if (vendor.gstNumber && vendor.gstNumber !== '') {
      let customerExtractedStateCode = vendor.gstNumber.slice(0, 2);
      if (
        businessStateCode !== '' &&
        customerExtractedStateCode !== '' &&
        businessStateCode === customerExtractedStateCode
      ) {
        setCGSTSGSTEnabledByPOS(true);
      } else {
        setCGSTSGSTEnabledByPOS(false);
      }
    } else if (vendor.state && vendor.state !== '') {
      let result = stateList.find((e) => e.code === businessStateCode);
      if (result) {
        let businessState = result.name;
        if (
          vendor.state !== '' &&
          businessState !== '' &&
          vendor.state !== null &&
          businessState !== null &&
          vendor.state.toLowerCase() === businessState.toLowerCase()
        ) {
          setCGSTSGSTEnabledByPOS(true);
        } else {
          setCGSTSGSTEnabledByPOS(false);
        }
      }
    }
  };

  const handleVendorNotProvidedAlertClose = () => {
    setVendorNotProvidedAlert(false);
  };

  const handleBillNoNotProvidedAlertClose = () => {
    setBillNoNotProvidedAlert(false);
  };

  const handleFilesUpload = (filesData) => {
    setExpensesUploadedFiles(filesData);
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
        open={addExpensesDialogue}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={11} className={innerClasses.alignCenter}>
                <Grid
                  container
                  className={classes.pageHeader}
                  spacing={5}
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
                      Expense
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xs="auto"
                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                  >
                    <FormControlLabel
                      control={<Switch color="secondary" />}
                      checked={expense.is_credit}
                      onChange={async (e) => {
                        setCreditData(e.target.checked);
                        if (e.target.checked === true) {
                          setPaymentType('Credit');
                          if (
                            customerCreditDays === 0 &&
                            expense.vendor_id !== ''
                          ) {
                            const customerData = await getPartyDataById(
                              expense.vendor_id,
                              ['creditLimitDays']
                            );
                            if (
                              customerData &&
                              customerData.creditLimitDays > 0
                            ) {
                              setCreditLimitDays(customerData.creditLimitDays);
                            }
                          }
                          if (customerCreditDays > 0) {
                            const currentDate = new Date();
                            currentDate.setDate(
                              currentDate.getDate() + customerCreditDays
                            );
                            setExpenseDueDate(
                              dateFormat(currentDate, 'yyyy-mm-dd')
                            );
                          } else {
                            setExpenseDueDate(
                              dateFormat(new Date(), 'yyyy-mm-dd')
                            );
                          }
                        } else {
                          setPaymentType('cash');
                          setExpenseDueDate(null);
                        }
                      }}
                      label={<Typography color="secondary">Credit</Typography>}
                      labelPlacement="end"
                      color="secondary"
                    />
                  </Grid>

                  <Grid
                    item
                    xs="auto"
                    className={innerClasses.alignCenter}
                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                  >
                    {expense.is_credit &&
                    isUpdate &&
                    previousBalanceAmount > 0 &&
                    expense.expenseId ? (
                      <Input
                        readOnly
                        id="component-simple"
                        value={expense.vendor_name}
                        fullWidth
                      />
                    ) : (
                      <div>
                        <TextField
                          fullWidth
                          placeholder="Select Vendor"
                          className={innerClasses.input}
                          value={
                            expense.vendor_name === ''
                              ? vendorNameWhileEditing
                              : expense.vendor_name
                          }
                          onChange={(e) => {
                            if (e.target.value !== vendorNameWhileEditing) {
                              setVendorName('');
                              setVendorId('');
                              setCGSTSGSTEnabledByPOS(true);
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
                                          <Grid item style={{ color: 'black' }}>
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
                          </>
                        ) : null}
                        <VendorModal open={vendorDialogOpen} />
                      </div>
                    )}
                  </Grid>

                  {transaction.enableVendor && (
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
                        disableRipple
                        className={innerClasses.buttonFocus}
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

                  <Grid item xs="auto" className={innerClasses.alignCenter}>
                    <Grid container className={innerClasses.alignCenter}>
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        style={{ textAlign: 'center', alignSelf: 'center' }}
                      >
                        <Typography
                          variant="span"
                          className="formLabel"
                          style={{ color: '#000000', fontSize: 'small' }}
                        >
                          Date
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={9}>
                        <TextField
                          fullWidth
                          variant="standard"
                          margin="dense"
                          type="date"
                          className="customTextField"
                          id="date-picker-inline"
                          value={expense.date}
                          onChange={(event) =>
                            handleDateChange(event.target.value)
                          }
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs="auto" className={innerClasses.alignCenter}>
                    <Grid container className={innerClasses.alignCenter}>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        style={{ textAlign: 'center', alignSelf: 'center' }}
                      >
                        <Typography
                          variant="span"
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
                          value={expense.dueDate}
                          onChange={(event) =>
                            handleDueDateChange(event.target.value)
                          }
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs="auto" style={{ textAlign: 'end' }}>
                <IconButton onClick={checkCloseDialog}>
                  <Cancel fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Toolbar>
          <Grid container>
            <Grid item xs={4} style={{ paddingLeft: '5px' }}>
              <CategoriesSearch
                fullWidth
                id="item"
                list={categoryList}
                expenses={expense}
              />
            </Grid>

            <Grid item xs={3} style={{ paddingLeft: '5px' }}>
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={expense.expenseType}
                onChange={(event) => setExpenseType(event.target.value)}
              >
                <div>
                  <FormControlLabel
                    value="Direct"
                    control={<Radio />}
                    label="Direct"
                  />
                  <FormControlLabel
                    value="Indirect"
                    control={<Radio />}
                    label="Indirect"
                  />
                </div>
              </RadioGroup>
            </Grid>

            <Grid item xs={3} className={innerClasses.alignCenter}>
              <Grid container style={{ alignItems: 'center' }}>
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
                    style={{
                      color: '#000000',
                      fontSize: 'small'
                    }}
                  >
                    Bill No
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <TextField
                      fullWidth
                      value={
                        expense.billNumber === '' && !isUpdate && isAutoGenMode
                          ? 'Auto Generated'
                          : expense.billNumber
                      }
                      disabled={isAutoGenMode ? true : false}
                      onChange={(e) => {
                        setBillNumber(e.target.value);
                      }}
                    ></TextField>

                    <InvSeqIcon
                      style={{
                        marginTop: '2px',
                        color: 'grey',
                        cursor: 'pointer',
                        marginLeft: '20px'
                      }}
                      onClick={() => {
                        setAutoGenMode(false);
                      }}
                    />
                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={2} className={innerClasses.alignCenter}>
              <Grid container style={{ alignItems: 'center' }}>
                <Grid
                  item
                  xs={12}
                  sm={6}
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
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant={'standard'}
                    value={place_of_supply}
                    margin="dense"
                    onClick={(e) => setMenuOpenStatus(true)}
                    onChange={(e) => setPlaceOfSupplyValue(e.target.value)}
                  ></TextField>
                  {menuOpenStatus ? (
                    <>
                      <ul className={innerClasses.PlaceOfsupplyListbox}>
                        <div>
                          {stateList
                            .filter((data) => {
                              if (place_of_supply === '') {
                                return data;
                              } else if (
                                data &&
                                data.name !== undefined &&
                                data.name !== '' &&
                                data.name !== null
                                  ? data.name
                                      .toLowerCase()
                                      .includes(
                                        place_of_supply.toLocaleLowerCase()
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
                                    setPlaceOfSupplyOverridden(true);
                                    setMenuOpenStatus(false);
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
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>

        {/*---------------- Table ------------------- */}

        <div className={innerClasses.content}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead className={classes.addtablehead}>
                <TableRow>
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
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    ITEM{' '}
                  </TableCell>
                  {expenseTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      HSN{' '}
                    </TableCell>
                  )}

                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    PRICE{' '}
                  </TableCell>

                  {expenseTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      QTY{' '}
                    </TableCell>
                  )}

                  {/*  *****Free Quantity***** */}
                  {expenseTxnEnableFieldsMap.get(
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

                  {expenseTxnEnableFieldsMap.get('enable_product_discount') && (
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
                    expenseTxnEnableFieldsMap.get('enable_product_igst') &&
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
                    expenseTxnEnableFieldsMap.get('enable_tax_included') && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        TAX INCLUDED{' '}
                      </TableCell>
                    )}

                  {expenseTxnEnableFieldsMap.get('enable_product_cess') && (
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
                  {expenseTxnEnableFieldsMap.get('enable_product_discount') && (
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
                    expenseTxnEnableFieldsMap.get('enable_product_igst') &&
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
                {item_list.map((item, idx) => (
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
                    >
                      {item.isEdit ? (
                        <TextField
                          variant="outlined"
                          fullWidth
                          onChange={(e) =>
                            inputOnChange(e, idx, setExpenseItemName)
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddRow();
                            }
                          }}
                          value={item.item}
                          InputProps={{
                            /* classes: { input: classes.outlineinputProps }, */
                            classes: { input: innerClasses.tableForm },
                            disableUnderline: true,
                            style: { minWidth: '250px' }
                          }}
                        />
                      ) : (
                        item.item
                      )}
                    </TableCell>

                    {expenseTxnEnableFieldsMap.get('enable_product_hsn') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.isEdit ? (
                          <TextField
                            variant="outlined"
                            fullWidth
                            onChange={(e) => inputOnChange(e, idx, setHsn)}
                            value={item.hsn}
                            InputProps={{
                              /* classes: { input: classes.outlineinputProps }, */
                              classes: { input: innerClasses.tableForm },
                              disableUnderline: true,
                              style: { minWidth: '100px' }
                            }}
                          />
                        ) : (
                          item.hsn
                        )}
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
                            type="number"
                            onFocus={(e) =>
                              item.price === 0 ? setPrice(idx, '') : ''
                            }
                            onChange={(e) => inputOnChange(e, idx, setPrice)}
                            value={item.price}
                            fullWidth
                            /* className={classes.selectMaterial} */
                            InputProps={{
                              /* classes: { input: classes.outlineinputProps }, */
                              classes: { input: innerClasses.tableForm },
                              disableUnderline: true,
                              style: { minWidth: '100px' }
                            }}
                          />
                        </div>
                      ) : (
                        item.price
                      )}{' '}
                    </TableCell>

                    {expenseTxnEnableFieldsMap.get('enable_product_qty') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.isEdit ? (
                          <TextField
                            variant="outlined"
                            value={item.quantity}
                            type="number"
                            onFocus={(e) =>
                              item.quantity === 0 ? setQuantity(idx, '') : ''
                            }
                            onChange={(e) => inputOnChange(e, idx, setQuantity)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddRow();
                              }
                            }}
                            InputProps={{
                              /* classes: { input: classes.outlineinputProps }, */
                              classes: { input: innerClasses.tableForm },
                              disableUnderline: true,
                              style: { minWidth: '50px' }
                            }}
                          />
                        ) : (
                          item.quantity
                        )}{' '}
                      </TableCell>
                    )}

                    {/*  *****Free Quantity***** */}
                    {expenseTxnEnableFieldsMap.get(
                      'enable_product_free_quantity'
                    ) && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.isEdit ? (
                          <TextField
                            variant="outlined"
                            value={item.freeQty}
                            type="number"
                            onFocus={(e) =>
                              item.freeQty === 0 ? setFreeQuantity(idx, '') : ''
                            }
                            onChange={(e) =>
                              inputOnChange(e, idx, setFreeQuantity)
                            }
                            onKeyDown={(e) => {
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
                              disableUnderline: true,
                              style: { minWidth: '50px' }
                            }}
                          />
                        ) : (
                          item.freeQty
                        )}{' '}
                      </TableCell>
                    )}

                    {expenseTxnEnableFieldsMap.get(
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
                                /* classes: { input: classes.outlineinputProps }, */
                                classes: { input: innerClasses.tableForm },
                                disableUnderline: true,
                                style: { minWidth: '50px' }
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
                                /* classes: { input: classes.outlineinputProps }, */
                                classes: { input: innerClasses.tableForm },
                                disableUnderline: true,
                                style: { minWidth: '50px' }
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
                            <div className={classes.wrapper}>
                              <TextField
                                variant={'outlined'}
                                onFocus={(e) =>
                                  item.cgst === 0 ? setCGST(idx, '') : ''
                                }
                                type="number"
                                onChange={(e) => inputOnChange(e, idx, setCGST)}
                                value={item.cgst}
                                /* className={classes.selectMaterial} */
                                InputProps={{
                                  /* classes: { input: classes.outlineinputProps }, */
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true,
                                  style: { minWidth: '50px' }
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
                          {parseFloat(item.cgst_amount || 0).toFixed(2)}
                        </TableCell>
                      )}

                    {taxSettingsData.enableGst &&
                      isCGSTSGSTEnabledByPOS === true && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <div className={classes.wrapper}>
                              <TextField
                                variant={'outlined'}
                                onChange={(e) => inputOnChange(e, idx, setSGST)}
                                type="number"
                                onFocus={(e) =>
                                  item.sgst === 0 ? setSGST(idx, '') : ''
                                }
                                value={item.sgst}
                                /* className={classes.selectMaterial} */
                                InputProps={{
                                  /* classes: { input: classes.outlineinputProps }, */
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true,
                                  style: { minWidth: '50px' }
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
                          {parseFloat(item.sgst_amount || 0).toFixed(2)}
                        </TableCell>
                      )}

                    {taxSettingsData.enableGst &&
                      expenseTxnEnableFieldsMap.get('enable_product_igst') &&
                      isCGSTSGSTEnabledByPOS === false && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <div className={classes.wrapper}>
                              <TextField
                                variant={'outlined'}
                                onFocus={(e) =>
                                  item.igst === 0 ? setIGST(idx, '') : ''
                                }
                                onChange={(e) => inputOnChange(e, idx, setIGST)}
                                value={item.igst}
                                /* className={classes.selectMaterial} */
                                InputProps={{
                                  /* classes: { input: classes.outlineinputProps }, */
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true,
                                  style: { minWidth: '50px' }
                                }}
                              />
                            </div>
                          ) : (
                            item.igst
                          )}{' '}
                        </TableCell>
                      )}

                    {taxSettingsData.enableGst &&
                      expenseTxnEnableFieldsMap.get('enable_product_igst') &&
                      isCGSTSGSTEnabledByPOS === false && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {parseFloat(item.igst_amount || 0).toFixed(2)}
                        </TableCell>
                      )}

                    {/* Tax Included */}
                    {taxSettingsData.enableGst &&
                      expenseTxnEnableFieldsMap.get('enable_tax_included') && (
                        <>
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            <Checkbox
                              checked={item.taxIncluded}
                              onChange={(e) => {
                                inputOnChange(e, idx, setTaxIncluded);
                              }}
                              style={{ padding: '0px' }}
                            />
                          </TableCell>
                        </>
                      )}

                    {/* CESS */}
                    {expenseTxnEnableFieldsMap.get('enable_product_cess') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.isEdit ? (
                          <div className={classes.wrapper}>
                            <TextField
                              variant={'outlined'}
                              onFocus={(e) =>
                                item.cess === 0 ? setCess(idx, '') : ''
                              }
                              onChange={(e) => inputOnChange(e, idx, setCess)}
                              value={item.cess}
                              /* className={classes.selectMaterial} */
                              InputProps={{
                                /* classes: { input: classes.outlineinputProps }, */
                                classes: { input: innerClasses.tableForm },
                                disableUnderline: true,
                                style: { minWidth: '50px' }
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
                            variant="outlined"
                            readOnly={true}
                            fullWidth
                            value={item.amount}
                            onChange={(e) => inputOnChange(e, idx, setAmount)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAddRow();
                              }
                            }}
                            InputProps={{
                              /* classes: { input: classes.outlineinputProps }, */
                              classes: { input: innerClasses.tableForm },
                              disableUnderline: true,
                              style: { minWidth: '200px' }
                            }}
                          />
                          <DeleteOutlined
                            color="secondary"
                            onClick={() => deleteRow(idx)}
                            style={{ fontSize: 'xx-large' }}
                          />
                        </div>
                      ) : (
                        item.amount
                      )}
                    </TableCell>
                  </EditTable>
                ))}

                <TableRow className={classes.addRowWrapper}>
                  <TableCell colSpan="2" style={{ paddingLeft: '15px' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleAddRow}
                    >
                      Add Row{' '}
                    </Button>
                  </TableCell>

                  {expenseTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell colSpan={1}></TableCell>
                  )}

                  <TableCell colSpan={1}></TableCell>

                  {expenseTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell colSpan={1}></TableCell>
                  )}

                  {/*  *****Free Quantity***** */}
                  {expenseTxnEnableFieldsMap.get(
                    'enable_product_free_quantity'
                  ) && <TableCell colSpan={1}></TableCell>}

                  {expenseTxnEnableFieldsMap.get('enable_product_discount') && (
                    <TableCell colSpan="2"></TableCell>
                  )}

                  {taxSettingsData.enableGst &&
                    isCGSTSGSTEnabledByPOS === true && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  {taxSettingsData.enableGst &&
                    isCGSTSGSTEnabledByPOS === true && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  {taxSettingsData.enableGst &&
                    expenseTxnEnableFieldsMap.get('enable_product_igst') &&
                    isCGSTSGSTEnabledByPOS === false && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  {taxSettingsData.enableGst &&
                    expenseTxnEnableFieldsMap.get('enable_tax_included') && (
                      <TableCell colSpan={1}></TableCell>
                    )}

                  {expenseTxnEnableFieldsMap.get('enable_product_cess') && (
                    <TableCell colSpan={1}></TableCell>
                  )}

                  <TableCell colSpan="1">
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
                      component="subtitle2"
                      style={{
                        float: 'right',
                        top: '4px',
                        position: 'relative'
                      }}
                    >
                      {expense.sub_total}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Dialog Footer */}
        <div className={classes.footer} style={{ height: '335px' }}>
          {/*------------ Notes------------ */}
          <Grid item xs={12}>
            {expenseTxnEnableFieldsMap.get('enable_bill_notes') ? (
              <TextField
                id="outlined-textarea"
                label="Notes"
                placeholder="Notes"
                multiline
                rows={2}
                maxRows={2}
                fullWidth
                fontSize="6"
                value={expense.notes}
                onChange={(e) => setNotes(e.target.value)}
              ></TextField>
            ) : (
              <TextField
                id="outlined-textarea"
                multiline
                rows={2}
                maxRows={2}
                fullWidth
                fontSize="6"
              ></TextField>
            )}
          </Grid>
          <Grid
            item
            xs={12}
            style={{ paddingTop: '15px', paddingBottom: '15px' }}
          >
            <FileUpload
              onFilesUpload={handleFilesUpload}
              uploadedFiles={expense.imageUrls}
            />
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              style={{
                display: 'flex',
                flexDirection: 'row',
                margin: '5px',
                marginLeft: '16px',
                alignItems: 'center'
              }}
            >
              <div
                style={{ width: '75%', display: 'flex', flexDirection: 'row' }}
              >
                <Grid item xs={12} sm={5}>
                  {expense.paymentType !== 'Credit' && (
                    <Grid
                      item
                      xs={12}
                      className="grid-padding"
                      style={{
                        paddingTop: '7px',
                        paddingLeft: '0px',
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <Grid item xs={2} className="grid-padding">
                        <Select
                          displayEmpty
                          disableUnderline
                          value={
                            expense.paymentType === 'Split'
                              ? 'cash'
                              : expense.paymentType
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
                                  setBankAccountData(
                                    bankAccount,
                                    e.target.value
                                  );
                                  setPaymentTypeVal(e.target.value);
                                }
                              } else {
                                setErrorAlertProductMessage(
                                  'Please set default bank from Settings > Payment Mode Settings to choose Bank options directly'
                                );
                                setErrorAlertProduct(true);
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
                        style={{ textAlign: 'end', marginTop: '-5px' }}
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
                        xs={8}
                        style={{
                          display: 'flex',
                          flexDirection: 'row'
                        }}
                      >
                        <Typography
                          style={
                            chosenPaymentType === 'Split'
                              ? { fontWeight: 'bold', color: 'black' }
                              : { fontWeight: 'normal', color: 'black' }
                          }
                          variant="subtitle1"
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
                  )}
                </Grid>

                <Grid item xs={12} sm={2}>
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
                        ITC
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
                      <Select
                        displayEmpty
                        disableUnderline
                        value={
                          expense.posITCAvailable
                            ? expense.posITCAvailable
                            : false
                        }
                        fullWidth
                        style={{ textAlign: 'center' }}
                        onChange={(e) => setITCEnable(e.target.value)}
                      >
                        <MenuItem value={false}>{'No'}</MenuItem>
                        <MenuItem value={true}>{'Yes'}</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={2}>
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
                        RCM
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
                      <Select
                        displayEmpty
                        disableUnderline
                        value={
                          expense.posRCMValue ? expense.posRCMValue : false
                        }
                        fullWidth
                        style={{ textAlign: 'center' }}
                        onChange={(e) => setRCMEnable(e.target.value)}
                      >
                        <MenuItem value={false}>{'No'}</MenuItem>
                        <MenuItem value={true}>{'Yes'}</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} sm={3}>
                  {expenseTransSettingData.enableTDS === true &&
                    tdsList &&
                    tdsList.length > 0 && (
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
                            TDS
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
                          <Select
                            displayEmpty
                            disableUnderline
                            value={expense.tdsName ? expense.tdsName : 'Select'}
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
                            <MenuItem value={'Select'}>{'Select'}</MenuItem>
                            {tdsList.map((option, index) => (
                              <MenuItem value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </Grid>
                      </Grid>
                    )}
                </Grid>
              </div>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid
              container
              justify="space-between"
              className={[classes.root, classes.paymentTypeWrap]}
              style={{ height: 'auto', flexWrap: 'nowrap' }}
            >
              <Grid item xs={3}>
                <Grid
                  container
                  direction="row"
                  spacing={0}
                  alignItems="center"
                  // style={{ marginTop: '7px' }}
                >
                  {expenseTxnEnableFieldsMap.get('enable_package_charge') && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        className={innerClasses.formWrapper}
                      >
                        <Typography style={{ fontSize: 'small' }}>
                          Packing Charge
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        className={[
                          classes.backgroundWhite,
                          innerClasses.formWrapper
                        ]}
                        style={{ marginLeft: '3px' }}
                      >
                        <TextField
                          className="total-wrapper-form"
                          id="Packing-charge"
                          autocomplete="off"
                          onFocus={(e) =>
                            expense.packageCharge === 0
                              ? setPackingCharge('')
                              : ''
                          }
                          onChange={(e) =>
                            setPackingCharge(
                              e.target.value ? e.target.value : 0
                            )
                          }
                          value={expense.packageCharge}
                          InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                              <InputAdornment position="end">₹</InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  <Grid xs={1} item></Grid>

                  {expenseTxnEnableFieldsMap.get('enable_shipping_charge') && (
                    <>
                      <Grid
                        item
                        xs={12}
                        sm={2}
                        className={innerClasses.formWrapper}
                      >
                        <Typography style={{ fontSize: 'small' }}>
                          Shipping Charge
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={3}
                        className={[
                          classes.backgroundWhite,
                          innerClasses.formWrapper
                        ]}
                        style={{ marginLeft: '6px' }}
                      >
                        <TextField
                          className="total-wrapper-form"
                          autocomplete="off"
                          onFocus={(e) =>
                            expense.shippingCharge === 0
                              ? setShippingCharge('')
                              : ''
                          }
                          onChange={(e) =>
                            setShippingCharge(
                              e.target.value ? e.target.value : 0
                            )
                          }
                          value={expense.shippingCharge}
                          InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                              <InputAdornment position="end">₹</InputAdornment>
                            )
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>

              {expenseTxnEnableFieldsMap.get('enable_bill_discount') && (
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
                          expense.discountType === 'percentage' ? '%' : '₹'
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
                            InputProps={{ disableUnderline: true }}
                            onChange={(e) => {
                              if (expense.discountType === 'percentage') {
                                setDiscount(e.target.value);
                              } else {
                                setDiscountAmount(e.target.value);
                              }
                            }}
                            value={
                              expense.discountType === 'percentage'
                                ? expense.discountPercent
                                : expense.discountAmount
                            }
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}

              {(expense.is_credit || isUpdate) && (
                <Grid item xs={2} style={{ marginTop: '7px' }}>
                  <>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      alignItems="center"
                    >
                      <Grid item xs={3} className={innerClasses.formWrapper}>
                        {/* <Typography style={{ fontSize: 'small' }}>
                          Paid
                        </Typography> */}
                      </Grid>
                      <Grid
                        item
                        xs={7}
                        className={[
                          classes.backgroundWhite,
                          innerClasses.formWrapper
                        ]}
                      >
                        {/* <TextField
                          className="total-wrapper-form"
                          id="received-payment"
                          placeholder="0"
                          inputRef={(el) => (inputRef.current[23] = el)}
                          onKeyDown={(e) => {
                            handleKeyDown(e, 18, 26, 26, 22);
                          }}
                          InputProps={{ disableUnderline: true }}
                          onChange={(e) => setPaid(e.target.value)}
                          value={billDetails.paid_amount}
                        /> */}
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              )}

              {expense.is_credit && (
                <Grid item xs={2} style={{ marginTop: '7px' }}>
                  <>
                    <Grid
                      container
                      direction="row"
                      spacing={0}
                      alignItems="center"
                    >
                      <Grid item xs={4} className={innerClasses.formWrapper}>
                        <Typography style={{ fontSize: 'small' }}>
                          Balance
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        className={[
                          classes.backgroundWhite,
                          innerClasses.formWrapper
                        ]}
                      >
                        {isUpdate ? (
                          <TextField
                            className="total-wrapper-form balance-payment"
                            id="balance-payment"
                            placeholder="0"
                            value={'₹ ' + expense.balance}
                            InputProps={{ disableUnderline: true }}
                          />
                        ) : (
                          <TextField
                            className="total-wrapper-form balance-payment"
                            id="balance-payment"
                            placeholder="0"
                            value={'₹ ' + getBalanceData}
                            InputProps={{ disableUnderline: true }}
                          />
                        )}
                      </Grid>
                    </Grid>
                  </>
                </Grid>
              )}
            </Grid>
          </Grid>
          <Grid container>
            <Grid
              item
              xs={6}
              style={{ marginTop: '10px', paddingLeft: '15px' }}
            >
              {/* {isUpdate && (
                <>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.footercontrols}
                  >
                    Share{' '}
                  </Button>

                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.footercontrols}
                    onClick={() => {}}
                  >
                    Print{' '}
                  </Button>
                </>
              )} */}
              <Button
                variant="outlined"
                color="secondary"
                className={classes.footercontrols}
                onClick={() => saveAndNewClick()}
              >
                Save & New{' '}
              </Button>
              <Button
                color="secondary"
                variant="contained"
                className={[classes.saveButton, classes.footercontrols]}
                onClick={() => saveDataClick()}
              >
                {' '}
                Save{' '}
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Grid container direction="row" spacing={0} alignItems="center">
                <Grid
                  item
                  xs={6}
                  sm={6}
                  className={innerClasses.formWrapper}
                  style={{ marginTop: '15px' }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={expense.isRoundOff}
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
                  xs={6}
                  sm={4}
                  className={[
                    classes.backgroundWhite,
                    innerClasses.formWrapper
                  ]}
                  style={{ marginTop: '15px' }}
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

            <Grid item xs={3}>
              <Grid
                container
                direction="row"
                spacing={0}
                alignItems="center"
                justifyContent="center"
              >
                <Grid
                  item
                  xs={3}
                  className={[
                    innerClasses.formWrapper,
                    innerClasses.total_design
                  ]}
                  style={{ marginTop: '0px', paddingTop: '0px' }}
                >
                  <Typography>Total</Typography>
                </Grid>
                <Grid
                  item
                  xs={5}
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
          {openSplitPaymentDetails ? (
            <ExpenseSplitPaymentDetails
              onClose={handleCloseSplitPaymentDetails}
            />
          ) : null}
        </div>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openCloseDialog}
        onClose={handleCloseDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Expense will not be saved, Do you want to close?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseDialogClose();
              handleAddExpensesModalClose();
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
        open={openCategorySelectionAlert}
        onClose={handleAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Please choose an Expense Category.
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
        open={openNoProductsAlert}
        onClose={handleNoProductsAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Expense cannot be performed without adding products.
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
            Please Choose Vendor from list to make an Expense.
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

      <Dialog
        fullScreen={fullScreen}
        open={openBillNoNotProvidedAlert}
        onClose={handleBillNoNotProvidedAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Expense cannot be performed without adding Bill Number.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleBillNoNotProvidedAlertClose}
            color="primary"
            autoFocus
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openExpenseLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Expense is being created!!!</p>
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
        open={openExpenseErrorAlertMessage}
        onClose={handleCloseExpenseErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Expense. Please try again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseExpenseErrorAlertMessage}
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
      <Dialog
        fullScreen={fullScreen}
        open={openBalanceExceededAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Credit provision for the vendor is exceeding the configured limit !!
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
const useOutsideAlerter = (ref, index) => {};
const EditTable = (props) => {
  const store = useStore();
  const { setEditTable } = store.ExpensesStore;
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
      onClick={() => setEditTable(props.index, true)}
    >
      {props.children}
    </TableRow>
  );
};
export default injectWithObserver(AddExpenses);