import React, { forwardRef, useState, useEffect, useRef } from 'react';
import _uniqueId from 'lodash/uniqueId';
import * as Bd from '../../../../components/SelectedBusiness';
import { Cancel, DeleteOutlined } from '@material-ui/icons';
import {
  Select as SelectMatetrial,
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
  Select,
  FormControl,
  DialogTitle
} from '@material-ui/core';
import LinkPaymentSalesReturn from '../../../../components/LinkPaymentSalesReturn';
import * as Db from '../../../../RxDb/Database/Database';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import injectWithObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import styles from './style';
import * as moment from 'moment';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Loader from 'react-js-loader';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
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
  formpadding: {
    padding: '0px 1rem',
    '& .formLabel': {
      position: 'relative',
      top: 15
    }
  },
  content: {
    position: 'absolute',
    top: '8%',
    bottom: '160px',
    left: '0px',
    right: '0px',
    overflow: 'auto',
    '@media (max-width: 1500px)': {
      top: '10%'
    }
  },
  total_val: {
    marginTop: '21px',
    border: '3px solid #4A83FB'
  },
  total_design: {
    marginBottom: '13px !important',
    background: '#4A83FB',
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
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  fontsz: {
    fontSize: 'small'
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
  addCustomerBtn: {
    '&:focus': {
      border: '1px solid'
    }
  }
}));

const AddSalesReturn = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  let componentRef = useRef();
  const [generateReturnNumber, setGenerateReturnNumber] = React.useState();
  const [openNegativeBalanceAlert, setNegativeBalanceAlert] =
    React.useState(false);

  const payment_mode_list = [
    // {val: 'CASH ON DELIVERY' ,name : 'CASH ON DELIVERY'},
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' },
    { val: 'upi', name: 'UPI' }
  ];
  const [bankAccounts, setBankAccounts] = React.useState([]);

  const [payment_type_list, setPaymentTypeList] = React.useState([]);
  const store = useStore();
  const {
    returnDetails,
    saleDetails,
    items,
    openAddSalesReturn,
    paymentLinkTransactions,
    salesTxnEnableFieldsMap,
    taxSettingsData,
    openSaleReturnLoadingAlertMessage,
    openSaleReturnErrorAlertMessage,
    salesReturnTxnSettingsData,
    sequenceNumberFailureAlert,
    isLocked,
    saleLockMessage,
    openAmendmentDialog,
    notPerformAmendment
  } = toJS(store.ReturnsAddStore);
  const {
    setSaleReturnProperty,
    loadSaleData,
    setDiscount,
    setNotes,
    setReturnDiscountAmount,
    setReturnsInvoiceRegular,
    setReturnsInvoiceThermal,
    setSequencePrefix,
    setSequenceSubPrefix,
    setTaxSettingsData,
    setPackingCharge,
    setShippingCharge,
    handleCloseSaleReturnErrorAlertMessage,
    handleOpenSaleReturnLoadingMessage,
    setRoundingConfiguration,
    handleCloseSequenceNumberFailureAlert
  } = store.ReturnsAddStore;

  const [isStartPrint, setIsStartPrint] = React.useState(false);

  const [rxdbSub] = useState([]);
  const {
    getTotalAmount,
    deleteItem,
    isUpdate,
    setQuantity,
    isRestore,
    toggleRoundOff,
    getBalanceData,
    saveData,
    saveDataAndNew,
    getRoundedAmount,
    closeDialog,
    setLinkPayment,
    closeLinkPayment,
    setReturnChecked,
    saleEnabledRow,
    setPaymentMode,
    setBankAccountData,
    setSalesTxnEnableFieldsMap,
    setPaymentReferenceNumber,
    setAllReturnChecked,
    setFreeQuantity,
    setTCS,
    revertTCS,
    setTDS,
    revertTDS,
    handleAmendmentDialogClose,
    setAmendmentDate,
    setAmendmentRemarks,
    setAmendmentFlag,
    shouldShowSaleReturnAmendmentPopUp,
    handleAmendmentDialogOpen,
    setNotPerformAmendement,
    setFileUploadImageurls,
  } = store.ReturnsAddStore;
  const { OpenLinkpaymentPage } = toJS(store.SaleslinkPayment);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openAmountAlert, setAmountAlert] = React.useState(false);
  const [openNoProductsAlert, setNoProductsAlert] = React.useState(false);

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { transaction } = toJS(store.TransactionStore);
  const { getTransactionData } = store.TransactionStore;

  const [printerList, setPrinterList] = React.useState([]);
  const { getTaxSettingsDetails } = store.TaxSettingsStore;
  const [allReturnsChecked, setAllReturns] = React.useState(false);

  const { getSalesTransSettingdetails } = store.SalesTransSettingsStore;

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const [isJewellery, setIsJewellery] = React.useState(false);

  const [tcsList, setTcsList] = React.useState([]);
  const { getTCS, getTCSDataByName } = store.TCSStore;
  const [tdsList, setTdsList] = React.useState([]);
  const { getTDS, getTDSDataByName } = store.TDSStore;

  const { getAuditSettingsData } = store.AuditSettingsStore;
  const [metalList, setMetalList] = React.useState();

  const [saveType, setSaveType] = useState('save');

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const deleteRow = (index) => {
    deleteItem(index);
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

  const handleAlertClose = () => {
    setAmountAlert(false);
  };

  const handleNoProductsAlertClose = () => {
    setNoProductsAlert(false);
  };

  const handleNegativeBalanceAlertClose = () => {
    setNegativeBalanceAlert(false);
  };

  const handleInvoiceNumberValueChange = (event) => {
    setSaleReturnProperty('saleSequenceNumber', event.target.value);

    loadSaleData(event.target.value);
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

  const saveDataClick = async () => {
    setSaveType('save');
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let showAmendmentPopup = await shouldShowSaleReturnAmendmentPopUp();
    if (
      showAmendmentPopup === true &&
      returnDetails.amended === false &&
      notPerformAmendment === false
    ) {
      handleAmendmentDialogOpen();
      return;
    }

    if (returnDetails.paid_amount > getTotalAmount) {
      setAmountAlert(true);
    } else if (returnDetails.balance_amount < 0) {
      setNegativeBalanceAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      handleOpenSaleReturnLoadingMessage();

      setPrefixes('##');
      setSubPrefixes('##');

      await saveData(generateReturnNumber, false)
        .then()
        .catch((err) => {
          console.log('data Insertion Failed, ', err);
          // alert('Error in Adding Data');
        });
    }
  };

  const onSaveAndPrintClicked = async () => {
    setSaveType('print');
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let showAmendmentPopup = await shouldShowSaleReturnAmendmentPopUp();
    if (
      showAmendmentPopup === true &&
      returnDetails.amended === false &&
      notPerformAmendment === false
    ) {
      handleAmendmentDialogOpen();
      return;
    }

    if (returnDetails.paid_amount > getTotalAmount) {
      setAmountAlert(true);
    } else if (returnDetails.balance_amount < 0) {
      setNegativeBalanceAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      handleOpenSaleReturnLoadingMessage();

      setReturnsInvoiceRegular(invoiceRegular);
      setReturnsInvoiceThermal(invoiceThermal);

      setPrefixes('##');
      setSubPrefixes('##');

      saveData(generateReturnNumber, true)
        .then((data) => {
          console.log('data Inserted');
        })
        .catch((err) => {
          console.log('data Insertion Failed, ', err);
          // alert('Error in Adding Data');
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

  const setSaleReturnDate = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');
    setSaleReturnProperty('date', date);
  };

  const setSaleReturnDueDate = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');
    setSaleReturnProperty('dueDate', date);
  };

  const inputOnChange = (e, index, setFunction) => {
    e.persist();
    setFunction(index, e.target.value);
  };

  useEffect(() => {
    async function fetchData() {
      setSalesTxnEnableFieldsMap(await getSalesTransSettingdetails());
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setTaxSettingsData(await getTaxSettingsDetails());
    }

    fetchData();
  }, []);

  /**
   * on loading the page
   */
  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      const appId = businessData.posDeviceId;
      const timestamp = Math.floor(Date.now() / 1000);
      const id = _uniqueId('sr');
      setGenerateReturnNumber(`${id}${appId}${timestamp}`);
      getBankAccounts();
    }
    setIsJewellery(localStorage.getItem('isJewellery'));
    fetchData();

    return () => rxdbSub.map((sub) => sub.unsubscribe());
  }, []);

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));

    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }
  }, []);

  const setBankIdDetails = async (payment_type) => {
    if (bankAccounts.length > 0) {
      let bankAccount = bankAccounts.find(
        (o) => o.accountDisplayName === payment_type
      );

      setBankAccountData(bankAccount);
    }
  };

  useEffect(() => {
    async function fetchData() {
      await getTransactionData();
      const businessData = await Bd.getBusinessData();
      const businessId = businessData.businessId;
      if (
        localStorage.getItem(businessId + '_saleReturnDefaultPrefix') !== '' &&
        localStorage.getItem(businessId + '_saleReturnDefaultPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_saleReturnDefaultPrefix') !== null
      ) {
        const defaultPrefix = localStorage.getItem(
          businessId + '_saleReturnDefaultPrefix'
        );
        setPrefixes(defaultPrefix);
        setSequencePrefix(defaultPrefix);
      }

      if (
        localStorage.getItem(businessId + '_saleReturnDefaultSubPrefix') !==
          '' &&
        localStorage.getItem(businessId + '_saleReturnDefaultSubPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_saleReturnDefaultSubPrefix') !==
          null
      ) {
        const defaultSubPrefix = localStorage.getItem(
          businessId + '_saleReturnDefaultSubPrefix'
        );
        setSubPrefixes(defaultSubPrefix);
        setSequenceSubPrefix(defaultSubPrefix);
      }
    }

    fetchData();
  }, [getTransactionData]);

  useEffect(() => {
    setRoundingConfiguration(transaction.roundingConfiguration);
  }, [transaction.roundingConfiguration]);

  const [prefixes, setPrefixes] = React.useState('##');
  const [subPrefixes, setSubPrefixes] = React.useState('##');

  const handleChangeSubPrefixes = (e) => {
    setSubPrefixes(e.target.value);
    setSequenceSubPrefix(e.target.value);
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
      }
    });
  };

  useEffect(() => {
    const isJewellery = localStorage.getItem('isJewellery');
    if (isJewellery === 'true' || isJewellery === true) {
      getRates();
    }
  }, []);

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
        saveDataClick();
      } else if (saveType === 'print') {
        onSaveAndPrintClicked();
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
        saveDataClick();
      } else if (saveType === 'print') {
        onSaveAndPrintClicked();
      }
    }, 2000);
  };

  const handleFileUpload = (files) => {
    setFileUploadImageurls(files);
  }

  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: '#f6f8fa'
          }
        }}
        onEscapeKeyDown={closeDialog}
        fullScreen
        open={openAddSalesReturn}
        onClose={closeDialog}
        TransitionComponent={Transition}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={1} className={innerClasses.alignCenter}>
                <Grid item xs={12} className={classes.pageHeader}>
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
                      Sales Return{' '}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid container className={innerClasses.alignCenter}>
                  <Typography
                    variant="h5"
                    className={[classes.baltypo, classes.formMargin]}
                    style={{ color: 'black' }}
                  >
                    Name : {returnDetails.customer_name}
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                style={{ paddingRight: '20px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid item xs={3} className={innerClasses.alignCenter}>
                    <Typography
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Return Number
                    </Typography>
                  </Grid>
                  <Grid item xs={9}>
                    {!isUpdate ? (
                      <>
                        {transaction.salesReturn.prefixSequence.length > 0 && (
                          <Select
                            value={prefixes}
                            style={{ fontSize: 'small', marginTop: '7px' }}
                            className={classes.multiSelectOption}
                            margin="dense"
                            inputProps={{
                              name: 'age',
                              id: 'age-simple',
                              className: classes.multiSelectOption
                            }}
                          >
                            <MenuItem value="##">
                              <em>##</em>
                            </MenuItem>
                            {transaction.salesReturn.prefixSequence
                              ? transaction.salesReturn.prefixSequence.map(
                                  (e, index) => (
                                    <MenuItem
                                      value={e.prefix}
                                      key={index}
                                      onClick={() => {
                                        setPrefixes(
                                          transaction.salesReturn
                                            .prefixSequence[index].prefix
                                        );
                                        setSequencePrefix(
                                          transaction.salesReturn
                                            .prefixSequence[index].prefix
                                        );
                                      }}
                                    >
                                      {e.prefix}
                                    </MenuItem>
                                  )
                                )
                              : ''}
                          </Select>
                        )}
                        {transaction.salesReturn.subPrefixesList.length > 0 && (
                          <Select
                            margin="dense"
                            value={subPrefixes}
                            style={{ fontSize: 'small', marginTop: '7px' }}
                            onChange={handleChangeSubPrefixes}
                            className={classes.multiSelectOption}
                            inputProps={{
                              name: 'age',
                              id: 'age-simple'
                            }}
                          >
                            <MenuItem value="##">
                              <em>##</em>
                            </MenuItem>
                            {transaction.salesReturn.subPrefixesList
                              ? transaction.salesReturn.subPrefixesList.map(
                                  (e, index) => (
                                    <MenuItem value={e} key={index}>
                                      {e}
                                    </MenuItem>
                                  )
                                )
                              : ''}
                          </Select>
                        )}
                        {/* <TextField
                          id="component-simple"
                          style={{ width: '50%' }}
                          value={
                            isUpdate
                              ? returnDetails.sales_return_number
                              : generateReturnNumber
                          }
                          onChange={(event) =>
                            setSaleReturnProperty(
                              'sales_return_number',
                              event.target.value
                            )
                          }
                        /> */}
                      </>
                    ) : (
                      <Input
                        id="component-simple"
                        value={returnDetails.sequenceNumber}
                        fullWidth
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                style={{ paddingRight: '20px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid item xs={3} className={innerClasses.alignCenter}>
                    <Typography
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Sale Inv No
                    </Typography>
                  </Grid>
                  {!isUpdate ? (
                    <Grid item xs={9}>
                      <>
                        <TextField
                          id="component-simple"
                          value={returnDetails.saleSequenceNumber}
                          style={{ width: '50%' }}
                          onChange={(event) =>
                            handleInvoiceNumberValueChange(event)
                          }
                        />
                      </>
                    </Grid>
                  ) : (
                    <Grid item xs={9}>
                      <Input
                        id="component-simple"
                        value={returnDetails.saleSequenceNumber}
                        fullWidth
                      />
                    </Grid>
                  )}
                </Grid>
              </Grid>

              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                style={{ paddingRight: '20px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={1}
                    style={{ textAlign: 'center' }}
                    className={innerClasses.alignCenter}
                  >
                    <Typography
                      variant="span"
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Date
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    {!isUpdate ? (
                      <Grid item className={innerClasses.formpadding}>
                        <TextField
                          fullWidth
                          variant="standard"
                          margin="dense"
                          type="date"
                          className="customTextField"
                          id="date-picker-inline"
                          value={returnDetails.date}
                          onChange={(event) =>
                            setSaleReturnDate(event.target.value)
                          }
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      </Grid>
                    ) : (
                      <Grid item className={innerClasses.formpadding}>
                        <Input
                          id="component-simple"
                          value={returnDetails.date}
                          fullWidth
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                style={{ paddingRight: '20px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={1}
                    style={{ textAlign: 'center' }}
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
                  <Grid item xs={10}>
                    {!isUpdate ? (
                      <Grid item className={innerClasses.formpadding}>
                        <TextField
                          fullWidth
                          variant="standard"
                          margin="dense"
                          type="date"
                          className="customTextField"
                          id="date-picker-inline"
                          value={returnDetails.dueDate}
                          onChange={(event) =>
                            setSaleReturnDueDate(event.target.value, true)
                          }
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      </Grid>
                    ) : (
                      <Grid item className={innerClasses.formpadding}>
                        <Input
                          id="component-simple"
                          value={returnDetails.dueDate}
                          fullWidth
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={1} style={{ textAlign: 'end' }}>
                <IconButton onClick={closeDialog}>
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
                    <Checkbox
                      checked={allReturnsChecked}
                      style={{ padding: '0px' }}
                      onChange={(e) => {
                        setAllReturns(e.target.checked);
                        setAllReturnChecked(e.target.checked);
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
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
                  {salesTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
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

                  {salesTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
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
                      width={90}
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
                        colSpan="3"
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
                    salesTxnEnableFieldsMap.get('enable_product_igst') && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        IGST{' '}
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
                          Incld.{' '}
                        </TableCell>
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
                    salesTxnEnableFieldsMap.get('enable_product_igst') && (
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
                      <Checkbox
                        checked={item.returnChecked || allReturnsChecked}
                        style={{ padding: '0px' }}
                        onChange={(e) => {
                          allReturnsChecked && setAllReturns(false);
                          allReturnsChecked
                            ? setReturnChecked(idx, false, false)
                            : setReturnChecked(
                                idx,
                                e.target.checked,
                                allReturnsChecked
                              );
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </TableCell>

                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {item.item_name}
                    </TableCell>

                    {isJewellery && metalList && metalList.length > 0 && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.dailyRate}
                      </TableCell>
                    )}

                    {/* HSN */}
                    {salesTxnEnableFieldsMap.get('enable_product_hsn') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.hsn}
                      </TableCell>
                    )}

                    {/* Barcode */}
                    {salesTxnEnableFieldsMap.get('enable_product_barcode') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.barcode}
                      </TableCell>
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
                          {item.serialOrImeiNo}
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
                        {item.batchNumber}
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
                        {item.brandName}
                      </TableCell>
                    )}

                    {/* Model Number */}
                    {salesTxnEnableFieldsMap.get('enable_product_model_no') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.modelNo}
                      </TableCell>
                    )}

                    {/* Price */}
                    {salesTxnEnableFieldsMap.get('enable_product_price') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.mrp >= 0 ? parseFloat(item.mrp).toFixed(2) : ''}
                      </TableCell>
                    )}

                    {salesTxnEnableFieldsMap.get(
                      'enable_product_price_per_gram'
                    ) && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.pricePerGram >= 0
                          ? parseFloat(item.pricePerGram).toFixed(2)
                          : ''}
                      </TableCell>
                    )}

                    {/****** Quanity ******/}
                    {salesTxnEnableFieldsMap.get('enable_product_qty') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        <TextField
                          variant={
                            saleEnabledRow === idx ? 'outlined' : 'standard'
                          }
                          fullWidth
                          value={item.qty}
                          type="number"
                          onChange={(e) => {
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
                            inputOnChange(e, idx, setQuantity);
                          }}
                          InputProps={{
                            classes: { input: classes.outlineinputProps },
                            disableUnderline: true
                          }}
                        />
                      </TableCell>
                    )}

                    {/* ********Free Quantity******* */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_free_quantity'
                    ) && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        <TextField
                          variant={
                            saleEnabledRow === idx ? 'outlined' : 'standard'
                          }
                          fullWidth
                          value={item.freeQty}
                          type="number"
                          onChange={(e) =>
                            inputOnChange(e, idx, setFreeQuantity)
                          }
                          InputProps={{
                            classes: { input: classes.outlineinputProps },
                            disableUnderline: true
                          }}
                        />
                      </TableCell>
                    )}

                    {/* Unit */}
                    {salesTxnEnableFieldsMap.get('enable_product_unit') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.qtyUnit}
                      </TableCell>
                    )}

                    {/* Gross Weight Grams */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_gross_weight'
                    ) &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.grossWeight}
                        </TableCell>
                      )}

                    {/* Stone Weight Grams */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_stone_weight'
                    ) &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.stoneWeight}
                        </TableCell>
                      )}

                    {/* Net Weight */}
                    {salesTxnEnableFieldsMap.get('enable_product_net_weight') &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.netWeight}
                        </TableCell>
                      )}

                    {/* Wastage Percentage */}
                    {salesTxnEnableFieldsMap.get('enable_product_wastage') &&
                      isJewellery === 'true' && (
                        <>
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.wastagePercentage}
                          </TableCell>
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.wastageGrams}
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
                            <Checkbox
                              disabled
                              checked={item.makingChargeIncluded}
                              style={{ padding: '0px' }}
                            />
                          </TableCell>
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.makingChargePercent
                              ? item.makingChargePercent
                              : 0}
                          </TableCell>

                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.makingChargeAmount
                              ? item.makingChargeAmount
                              : 0}
                          </TableCell>
                        </>
                      )}

                    {/* Making charge */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_making_charge_per_gram'
                    ) &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.makingChargePerGramAmount}
                        </TableCell>
                      )}

                    {/* Stone Charge */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_stone_charge'
                    ) &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.stoneCharge}
                        </TableCell>
                      )}

                    {/* Purity */}
                    {salesTxnEnableFieldsMap.get('enable_product_purity') &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.purity}
                        </TableCell>
                      )}

                    {/*  Hallmark charge */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_hallmark_charge'
                    ) &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.hallmarkCharge}
                        </TableCell>
                      )}

                    {/*  Certification charge */}
                    {salesTxnEnableFieldsMap.get(
                      'enable_product_certification_charge'
                    ) &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.certificationCharge}
                        </TableCell>
                      )}

                    {salesTxnEnableFieldsMap.get('enable_product_discount') && (
                      <>
                        {/* Discount Percentage*/}
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.discount_percent}
                        </TableCell>
                        {/* Discount Amount*/}
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.discount_amount}
                        </TableCell>
                      </>
                    )}

                    {taxSettingsData.enableGst && (
                      <>
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.cgst}
                        </TableCell>
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {parseFloat(item.cgst_amount).toFixed(2)}
                        </TableCell>
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.sgst}{' '}
                        </TableCell>
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {parseFloat(item.sgst_amount).toFixed(2)}{' '}
                        </TableCell>
                      </>
                    )}
                    {/* IGST Percentage*/}
                    {taxSettingsData.enableGst &&
                      salesTxnEnableFieldsMap.get('enable_product_igst') && (
                        <>
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.igst}{' '}
                          </TableCell>
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {parseFloat(item.igst_amount).toFixed(2)}{' '}
                          </TableCell>
                        </>
                      )}
                    {/* CESS */}
                    {salesTxnEnableFieldsMap.get('enable_product_cess') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.cess}{' '}
                      </TableCell>
                    )}

                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      <div className={classes.wrapper}>
                        <TextField
                          variant={
                            saleEnabledRow === idx ? 'outlined' : 'standard'
                          }
                          readOnly={true}
                          value={item.amount}
                          InputProps={{
                            classes: { input: classes.outlineinputProps },
                            disableUnderline: true
                          }}
                          fullWidth
                        />
                        <DeleteOutlined
                          color="secondary"
                          style={{ marginTop: '6px' }}
                          onClick={() => deleteRow(idx)}
                        />
                      </div>
                    </TableCell>
                  </EditTable>
                ))}

                <TableRow className={classes.addRowWrapper}>
                  <TableCell colSpan="3"></TableCell>

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

                  {/* Batch Number */}
                  {salesTxnEnableFieldsMap.get(
                    'enable_product_brand'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Model Number */}
                  {salesTxnEnableFieldsMap.get('enable_product_model_no') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_price') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {salesTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {/* ********Free Quantity******* */}
                  {salesTxnEnableFieldsMap.get(
                    'enable_product_free_quantity'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {salesTxnEnableFieldsMap.get('enable_product_unit') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {salesTxnEnableFieldsMap.get('enable_product_gross_weight') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_stone_weight'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {salesTxnEnableFieldsMap.get('enable_product_net_weight') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_wastage') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="3"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
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

                  {taxSettingsData.enableGst && (
                    <TableCell colSpan="2"></TableCell>
                  )}

                  {taxSettingsData.enableGst && (
                    <TableCell colSpan="2"></TableCell>
                  )}

                  {taxSettingsData.enableGst &&
                    salesTxnEnableFieldsMap.get('enable_product_igst') && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  {salesTxnEnableFieldsMap.get('enable_product_cess') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  <TableCell colSpan="1">
                    <Typography
                      style={{
                        float: 'left',
                        position: 'relative'
                      }}
                    >
                      SUB TOTAL{' '}
                    </Typography>
                    <Typography
                      style={{
                        float: 'right',
                        position: 'relative'
                      }}
                      component="subtitle2"
                    >
                      {returnDetails.sub_total}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* --------- Dialog Footer -------- */}
        <div className={classes.footer} style={{ height: '270px' }}>
         
          {/*------------ Notes------------ */}
          {/* {salesTxnEnableFieldsMap.get('enable_bill_notes') ? ( */}
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
              value={returnDetails.notes}
            ></TextField>
          </Grid>
          {/* ) : (
              <Grid item xs={12}>
                <TextField
                  multiline
                  rows={2}
                  maxRows={2}
                  fullWidth
                  fontSize="6"
                  disabled
                  InputProps={{ disableUnderline: true }}
                ></TextField>
              </Grid>
            )} */}
          <Grid item xs={12} style={{padding: '7px'}}>
             <FileUpload onFilesUpload={handleFileUpload} uploadedFiles={returnDetails.imageUrls} />
          </Grid>
          <Grid
            container
            spacing={0}
            className={[classes.root, classes.paymentTypeWrap]}
          >
            <Grid item xs={12} sm={3}>
              {salesReturnTxnSettingsData.enableTDS === true &&
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
                        value={
                          returnDetails.tdsName
                            ? returnDetails.tdsName
                            : 'Select'
                        }
                        fullWidth
                        style={{ textAlign: 'center' }}
                        onChange={async (e) => {
                          if (e.target.value !== 'Select') {
                            let tdsObj = await getTDSDataByName(e.target.value);

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

            <Grid item xs={12} sm={3}>
              {salesReturnTxnSettingsData.enableTCS === true &&
                tcsList &&
                tcsList.length > 0 && (
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
                        TCS
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
                          returnDetails.tcsName
                            ? returnDetails.tcsName
                            : 'Select'
                        }
                        fullWidth
                        style={{ textAlign: 'center' }}
                        onChange={async (e) => {
                          if (e.target.value !== 'Select') {
                            console.log('Value is: ' + e.target.value);
                            let tcsObj = await getTCSDataByName(e.target.value);
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
                )}
            </Grid>

            <Grid item xs={1}>
              <Grid
                container
                direction="row"
                spacing={0}
                alignItems="center"
                style={{ marginTop: '7px' }}
              >
                {salesTxnEnableFieldsMap.get('enable_package_charge') ? (
                  <>
                    <Grid item xs="auto" className={innerClasses.formWrapper}>
                      <div>Packing</div>
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper
                      ]}
                      style={{ marginLeft: '8px' }}
                    >
                      <TextField
                        className="total-wrapper-form"
                        id="Packing-charge"
                        autoComplete="off"
                        placeholder="0"
                        InputProps={{
                          inputProps: {
                            min: 0
                          },
                          disableUnderline: true
                        }}
                        onFocus={(e) =>
                          returnDetails.packing_charge === 0
                            ? setPackingCharge('')
                            : ''
                        }
                        onChange={(e) => {
                          setPackingCharge(e.target.value ? e.target.value : 0);
                        }}
                        value={returnDetails.packing_charge}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12} />
                )}
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <Grid
                container
                direction="row"
                spacing={0}
                alignItems="center"
                style={{ marginTop: '7px' }}
              >
                {salesTxnEnableFieldsMap.get('enable_shipping_charge') ? (
                  <>
                    <Grid item xs="auto" className={innerClasses.formWrapper}>
                      <div>Shipping</div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={5}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper
                      ]}
                      style={{ marginLeft: '8px' }}
                    >
                      <TextField
                        className="total-wrapper-form"
                        style={{ marginLeft: '3px' }}
                        placeholder="0"
                        onFocus={(e) =>
                          returnDetails.shipping_charge === 0
                            ? setShippingCharge('')
                            : ''
                        }
                        onChange={(e) =>
                          setShippingCharge(e.target.value ? e.target.value : 0)
                        }
                        value={returnDetails.shipping_charge}
                        InputProps={{
                          inputProps: {
                            min: 0
                          },
                          disableUnderline: true
                        }}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={2} />
                )}
              </Grid>
            </Grid>

            <Grid item xs={2}></Grid>

            {/* <Grid item xs={2}>
              {salesTxnEnableFieldsMap.get('enable_bill_discount') && (
                <>
                  <Grid
                    container
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    style={{ marginTop: '7px' }}
                  >
                    <Grid item xs="auto" className={innerClasses.formWrapper}>
                      <div>Return Disc</div>
                    </Grid>

                    <Grid
                      item
                      xs={6}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper
                      ]}
                      style={{ marginLeft: '8px' }}
                    >
                      <Grid container direction="row" spacing={0}>
                        <Grid item xs={2} className={innerClasses.prcnt}>
                          &nbsp; ₹
                        </Grid>
                        <Grid item xs={10}>
                          <TextField
                            className="total-wrapper-form"
                            id="discount-amount"
                            InputProps={{ disableUnderline: true }}
                            onChange={(e) =>
                              setReturnDiscountAmount(e.target.value)
                            }
                            value={returnDetails.return_discount_amount}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid> */}

            <Grid item xs={2}>
              {
                <>
                  <Grid
                    container
                    direction="row"
                    spacing={0}
                    alignItems="center"
                    style={{ marginTop: '7px' }}
                  >
                    <Grid item xs="auto" className={innerClasses.formWrapper}>
                      <div>Balance</div>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      className={[
                        classes.backgroundWhite,
                        innerClasses.formWrapper
                      ]}
                      style={{ marginLeft: '8px' }}
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
                </>
              }
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="space-between"
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

              {!isUpdate && !isLocked && (
                <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.footercontrols}
                  onClick={() => saveDataClick()}
                >
                  {' '}
                  Save{' '}
                </Button>
              )}

              {!isUpdate &&
                printerList &&
                printerList.length > 0 &&
                !isLocked && (
                  <Button
                    color="secondary"
                    variant="contained"
                    className={[classes.saveButton, classes.footercontrols]}
                    onClick={() => onSaveAndPrintClicked()}
                  >
                    {' '}
                    Save & Print{' '}
                  </Button>
                )}
            </Grid>

            <Grid item xs={2} style={{ marginTop: '20px' }}>
              {(paymentLinkTransactions.length > 0 ||
                returnDetails.linked_amount > 0) && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={returnDetails.linkPayment}
                      onChange={(e) => {
                        setLinkPayment();
                      }}
                      name="LinkPayment"
                    />
                  }
                  label={
                    'Link Payment'
                      .concat(' ( ₹')
                      .concat(returnDetails.linked_amount) + ' )'
                  }
                />
              )}
            </Grid>
            <Grid item xs={2} style={{ marginTop: '18px' }}>
              <Grid container direction="row" spacing={0} alignItems="center">
                <Grid item xs={12} sm={6} className={innerClasses.formWrapper}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={returnDetails.is_roundoff}
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
        <LinkPaymentSalesReturn
          open={OpenLinkpaymentPage}
          onClose={closeLinkPayment}
          isEditAllowed={!isUpdate && !isLocked}
        />

        <Dialog
          fullScreen={fullScreen}
          open={openAmountAlert}
          onClose={handleAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Paid amount can't be more than the sales return amount
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
        open={openNoProductsAlert}
        onClose={handleNoProductsAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Sale Return cannot be performed without adding products. Please
            re-validate your Bill number.
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
        open={openSaleReturnLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Return for Sale is being created!!!</p>
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
        open={openSaleReturnErrorAlertMessage}
        onClose={handleCloseSaleReturnErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Sale Return. Please try again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSaleReturnErrorAlertMessage}
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
const useOutsideAlerter = (ref, index) => {
  // const store = useStore();
  // const { setEditTable } = store.ReturnsAddStore;
  // useEffect(() => {
  //   /**
  //    * Alert if clicked on outside of element
  //    */
  //   // function handleClickOutside(event) {
  //   //   if (ref.current && !ref.current.contains(event.target)) {
  //   //     // console.log("You clicked outside of me!", index);
  //   //     setEditTable(index, false);
  //   //   }
  //   // }
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
  const { setEditTable } = store.ReturnsAddStore;
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
export default injectWithObserver(AddSalesReturn);