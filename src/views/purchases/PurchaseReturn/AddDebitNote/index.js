import React, { forwardRef, useState, useEffect, useRef } from 'react';
import * as Bd from '../../../../components/SelectedBusiness';
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
  makeStyles
} from '@material-ui/core';
import LinkPaymentPurchaseReturn from '../../../../components/LinkPaymentPurchaseReturn';
import * as Db from '../../../../RxDb/Database/Database';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import injectWithObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import styles from '../styleDebitNote';
import * as moment from 'moment';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import PurchaseMultipleBillNoModal from 'src/components/modal/PurchaseMultipleBillNoModal';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import VendorModal from 'src/views/Vendors/modal/AddVendor';
import Loader from 'react-js-loader';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
import { FileUpload } from 'src/components/common/FileUpload';
import prodPlus from '../../../../icons/prod_plus.png';
import PurchaseReturnSerialListModal from 'src/components/modal/PurchaseReturnSerialListModal';

var dateFormat = require('dateformat');

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useInnerStyles = makeStyles((theme) => ({
  headerFooterWrapper: {
    padding: 15,
    margin: '20px 0'
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
  baltypo: {
    color: 'red',
    paddingLeft: 5
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
    top: '9%',
    bottom: '200px',
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
  bootstrapRoot: {
    padding: 5,
    'label + &': {
      marginTop: theme.spacing(3)
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
  },
  fontsz: {
    fontSize: 'small'
  }
}));

const AddPurchaseReturn = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  const [vendorList, setVendorList] = React.useState();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openAmountAlert, setAmountAlert] = React.useState(false);
  const [vendorNameWhileEditing, setVendorNameWhileEditing] = useState('');
  const [openVendorNotProvidedAlert, setVendorNotProvidedAlert] =
    React.useState(false);
  const [openBillNotExistAlert, setBillNotExistAlert] = React.useState(false);
  const [openBillNoAlreadyExistAlert, setBillNoAlreadyAlert] =
    React.useState(false);
  const [openBillEmptyAlert, setBillEmptyAlert] = React.useState(false);
  const [bankAccounts, setBankAccounts] = React.useState([]);
  const [allReturnsChecked, setAllReturns] = React.useState(false);
  const [openReturnNoEmptyAlert, setReturnNoEmptyAlert] = React.useState(false);

  const store = useStore();
  const {
    returnDetails,
    items,
    OpenAddPurchasesReturn,
    paymentLinkTransactions,
    multiplePurchaseBillsByVendor,
    taxSettingsData,
    purchaseTxnEnableFieldsMap,
    purchaseReturnTxnSettingsData,
    openPurchaseReturnLoadingAlertMessage,
    openPurchaseReturnErrorAlertMessage,
    selectedProduct,
    selectedIndex,
    OpenPurchaseReturnSerialList
  } = toJS(store.PurchasesReturnsAddStore);

  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);

  const { getAuditSettingsData } = store.AuditSettingsStore;

  const [rxdbSub, setRxdbSub] = useState([]);
  const [records, setRecords] = useState([]);
  const {
    getAmount,
    getTotalAmount,
    deleteItem,
    isUpdate,
    setNotes,
    setQuantity,
    toggleRoundOff,
    getBalanceData,
    saveData,
    getRoundedAmount,
    isPurchaseReturnConvertion,
    closeDialog,
    setPurchaseReturnProperty,
    setLinkPayment,
    closeLinkPayment,
    closeMultipleBillForSameVendorSelectionPopUp,
    openMultipleBillForSameVendorSelectionPopUp,
    checkPurchaseDataByVendorWithMultipleBillNumbers,
    setPurchasesReturnVendorName,
    setPurchasesReturnVendorId,
    isBillNumberInValid,
    enabledrow,
    setReturnsInvoiceRegular,
    setReturnsInvoiceThermal,
    setReturnChecked,
    setBankAccountData,
    setTaxSettingsData,
    setPackingCharge,
    setShippingCharge,
    setAllReturnChecked,
    setPurchaseReturnBillNumber,
    setPurchaseTxnEnableFieldsMap,
    handleClosePurchaseReturnErrorAlertMessage,
    handleOpenPurchaseReturnLoadingMessage,
    setRoundingConfiguration,
    setFreeQuantity,
    isSameReturnNumberExists,
    setBillDate,
    setDueDate,
    setTCS,
    revertTCS,
    setTDS,
    revertTDS,
    setPurchaseReturnUploadedFile,
    launchSerialDataDialog,
    handleSerialListModalClose
  } = store.PurchasesReturnsAddStore;

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getTaxSettingsDetails } = store.TaxSettingsStore;

  const { OpenLinkpaymentPage } = toJS(store.SaleslinkPayment);
  const { handleVendorModalOpen } = store.VendorStore;
  const [openNegativeBalanceAlert, setNegativeBalanceAlert] =
    React.useState(false);

  const [printerList, setPrinterList] = React.useState([]);
  const { getPurchaseTransSettingdetails } = store.PurchaseTransSettingsStore;

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);
  const [isJewellery, setIsJewellery] = React.useState(false);

  const [tcsList, setTcsList] = React.useState([]);
  const { getTCS, getTCSDataByName } = store.TCSStore;
  const [tdsList, setTdsList] = React.useState([]);
  const { getTDS, getTDSDataByName } = store.TDSStore;
  const [metalList, setMetalList] = React.useState();

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
      setTaxSettingsData(await getTaxSettingsDetails());
    }

    fetchData();
  }, []);

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

  const [payment_type_list, setPaymentTypeList] = React.useState([]);
  const [openNoProductsAlert, setNoProductsAlert] = React.useState(false);
  const { vendorDialogOpen } = toJS(store.VendorStore);
  const [isSaveCliked, setSaveClicked] = React.useState(false);

  const handleNoProductsAlertClose = () => {
    setNoProductsAlert(false);
  };

  const handleNegativeBalanceAlertClose = () => {
    setNegativeBalanceAlert(false);
  };

  const handleBillNotExistAlertClose = () => {
    setBillNotExistAlert(false);
  };

  const handleBillNoAlreadyExistAlertClose = () => {
    setBillNoAlreadyAlert(false);
  };

  const handleAddVendor = () => {
    handleVendorModalOpen();
  };

  const handleBillEmptyAlert = () => {
    setBillEmptyAlert(false);
  };

  const handleReturnNoEmptyAlertClose = () => {
    setReturnNoEmptyAlert(false);
  };

  const deleteRow = (index) => {
    deleteItem(index);
  };

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorClick = (vendor) => {
    setPurchasesReturnVendorName(vendor.name);
    setPurchasesReturnVendorId(vendor.id);
    //setPurchasesReturnVendor(vendor);
    setVendorNameWhileEditing('');
    setVendorList([]);
  };

  const handleAlertClose = () => {
    setAmountAlert(false);
  };

  const handleVendorNotProvidedAlertClose = () => {
    setVendorNotProvidedAlert(false);
  };

  const handleBillNumberChange = (e) => {
    setPurchaseReturnProperty('vendor_bill_number', e.target.value);

    // loadPurchaseDataByVendorBillNumber(e.target.value);
    checkPurchaseDataByVendorWithMultipleBillNumbers(
      returnDetails.vendor_id,
      e.target.value
    );
  };

  useEffect(() => {
    async function fetchData() {
      await getTransactionData();
    }

    getInvoiceSettings(localStorage.getItem('businessId'));
    getBankAccounts();
    setIsJewellery(localStorage.getItem('isJewellery'));
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

  const saveDataClick = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    let isSameBillNoExists = await isSameReturnNumberExists(
      returnDetails.vendor_id,
      returnDetails.purchaseReturnBillNumber
    );

    //remove un selected returned items
    let returnedItems = 0;
    for (let i = items.length - 1; i >= 0; --i) {
      if (items[i].returnChecked === false || !items[i].returnChecked) {
        returnedItems += 1;
      }
    }

    setSaveClicked(true);
    if (returnDetails.vendor_bill_number === '') {
      setBillEmptyAlert(true);
    } else if (returnDetails.purchaseReturnBillNumber === '') {
      setReturnNoEmptyAlert(true);
    } else if (isBillNumberInValid) {
      setBillNotExistAlert(true);
    } else if (returnDetails.received_amount > getTotalAmount) {
      setAmountAlert(true);
    } else if (returnDetails.balance_amount < 0) {
      setNegativeBalanceAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else if (items.length - returnedItems === 0) {
      setNoProductsAlert(true);
    } else if (isSameBillNoExists) {
      setBillNoAlreadyAlert(true);
    } else {
      setSaveClicked(false);

      handleOpenPurchaseReturnLoadingMessage();

      saveData(false)
        .then((data) => {
          console.log('data Inserted');
          // handleClose();
          // getsalescount();
          // closeDialog();
        })
        .catch((err) => {
          console.log('data Insertion Failed Purchase: ' + err);
          // alert('Error in Adding Data');
        });
    }
  };

  const onSaveAndPrintClicked = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    setSaveClicked(true);
    if (returnDetails.vendor_bill_number === '') {
      setBillEmptyAlert(true);
    } else if (returnDetails.purchaseReturnBillNumber === '') {
      setReturnNoEmptyAlert(true);
    } else if (isBillNumberInValid) {
      setBillNotExistAlert(true);
    } else if (returnDetails.received_amount > getTotalAmount) {
      setAmountAlert(true);
    } else if (returnDetails.balance_amount < 0) {
      setNegativeBalanceAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setReturnsInvoiceRegular(invoiceRegular);
      setReturnsInvoiceThermal(invoiceThermal);

      setSaveClicked(true);

      handleOpenPurchaseReturnLoadingMessage();
      saveData(true)
        .then((data) => {
          console.log('data Inserted');
          // handleClose();
          // getsalescount();
          // closeDialog();
        })
        .catch((err) => {
          console.log('Debit Note Insertion Failed - ', err);
        });
    }
  };

  const handleDateChange = (date, isDueDate) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    if (isDueDate) {
      setDueDate(date);
    } else {
      setBillDate(date);
    }
  };

  const inputOnChange = (e, index, setFunction) => {
    console.log('on edit');
    e.persist();
    setFunction(index, e.target.value);
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
        .then(async (data) => {
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
      purchaseTxnEnableFieldsMap.get('enable_product_price_per_gram') === true
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

  const handleFilesUpload = (filesData) => {
    setPurchaseReturnUploadedFile(filesData);
  };

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
        open={OpenAddPurchasesReturn}
        onClose={closeDialog}
        TransitionComponent={Transition}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={4} className={innerClasses.alignCenter}>
                <Grid container className={classes.pageHeader}>
                  <Grid item>
                    <Button
                      aria-controls="simple-menu"
                      size="large"
                      variant="text"
                      className={classes.menubutton}
                    >
                      Purchase Return{' '}
                    </Button>
                  </Grid>
                  <Grid item className={innerClasses.alignCenter}>
                    <div>
                      <TextField
                        fullWidth
                        placeholder="Select Vendor *"
                        className={innerClasses.input}
                        value={
                          returnDetails.vendor_name === ''
                            ? vendorNameWhileEditing
                            : returnDetails.vendor_name
                        }
                        onChange={(e) => {
                          if (e.target.value !== vendorNameWhileEditing) {
                            setPurchasesReturnVendorId('');
                            setPurchasesReturnVendorName('');
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
                            style={{ width: '20%' }}
                          >
                            <li>
                              <Grid container justify="space-between">
                                {transaction.enableVendor && (
                                  <Grid item>
                                    <Button
                                      size="small"
                                      style={{
                                        position: 'relative',
                                        fontSize: 12
                                      }}
                                      color="secondary"
                                      onClick={handleAddVendor}
                                    >
                                      + Add Vendor
                                    </Button>
                                  </Grid>
                                )}
                                {vendorList.length == 1 &&
                                vendorList[0].name == '' ? (
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
                            {vendorList.length == 1 &&
                            vendorList[0].name == '' ? (
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
                                    <Grid container justify="space-between">
                                      <Grid item style={{ color: 'black' }}>
                                        {option.name}
                                        <br />
                                        {option.phoneNo}
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
                </Grid>
              </Grid>

              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                style={{ paddingRight: '10px' }}
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
                      Return No
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
                      value={returnDetails.purchaseReturnBillNumber}
                      style={{ color: '#000000', fontSize: 'small' }}
                      fullWidth
                      onChange={(e) => {
                        setPurchaseReturnBillNumber(e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={1}
                className={innerClasses.alignCenter}
                style={{ paddingRight: '20px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
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
                      Bill No
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {!isUpdate ? (
                      <Input
                        id="component-simple"
                        value={returnDetails.vendor_bill_number}
                        fullWidth
                        style={{ color: '#000000', fontSize: 'small' }}
                        onChange={(e) => {
                          if (returnDetails.vendor_name !== '') {
                            handleBillNumberChange(e);
                          } else {
                            setVendorNotProvidedAlert(true);
                          }
                        }}
                      />
                    ) : (
                      <Input
                        id="component-simple"
                        style={{ color: '#000000', fontSize: 'small' }}
                        value={returnDetails.vendor_bill_number}
                        fullWidth
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid container direction="column" alignItems="baseline">
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={2}
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

                    {!isUpdate ? (
                      <Grid item xs={12} sm={7}>
                        <TextField
                          fullWidth
                          variant="standard"
                          margin="dense"
                          type="date"
                          className="customTextField"
                          id="date-picker-inline"
                          value={returnDetails.date}
                          onChange={(event) =>
                            handleDateChange(event.target.value, false)
                          }
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={7}>
                        <Input
                          style={{ color: '#000000', fontSize: 'small' }}
                          id="component-simple"
                          value={returnDetails.date}
                          fullWidth
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid container direction="column" alignItems="baseline">
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      sm={2}
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

                    {!isUpdate ? (
                      <Grid item xs={12} sm={7}>
                        <TextField
                          fullWidth
                          variant="standard"
                          margin="dense"
                          type="date"
                          className="customTextField"
                          id="date-picker-inline"
                          value={returnDetails.dueDate}
                          onChange={(event) =>
                            handleDateChange(event.target.value, true)
                          }
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      </Grid>
                    ) : (
                      <Grid item xs={12} sm={7}>
                        <Input
                          style={{ color: '#000000', fontSize: 'small' }}
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

                  {/* *****Brand***** */}
                  {purchaseTxnEnableFieldsMap.get('enable_product_brand') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      Brand{' '}
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
                      Price/g{' '}
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
                        colSpan="3"
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

                  {purchaseTxnEnableFieldsMap.get(
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
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    AMOUNT{' '}
                  </TableCell>
                </TableRow>

                <TableRow>
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

                  {/* <TableCell
                    variant="head"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    {' '}
                  </TableCell> */}
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
                          /* setReturnChecked(
                            idx,
                            e.target.checked,
                            allReturnsChecked
                          ); */
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
                    {purchaseTxnEnableFieldsMap.get('enable_product_hsn') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.hsn}
                      </TableCell>
                    )}

                    {purchaseTxnEnableFieldsMap.get(
                      'enable_product_barcode'
                    ) && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.barcode}
                      </TableCell>
                    )}

                    {/* Serial/IMEI No.  */}
                    {purchaseTxnEnableFieldsMap.get(
                      'enable_product_serial_imei'
                    ) && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
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
                            item.serialOrImeiNo
                          )}
                        </>
                      </TableCell>
                    )}

                    {/* Batch Number */}
                    {purchaseTxnEnableFieldsMap.get(
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
                    {purchaseTxnEnableFieldsMap.get('enable_product_brand') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.brandName}
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
                        {item.modelNo}
                      </TableCell>
                    )}

                    {purchaseTxnEnableFieldsMap.get('enable_product_price') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.purchased_price_before_tax}
                      </TableCell>
                    )}

                    {purchaseTxnEnableFieldsMap.get(
                      'enable_product_price_per_gram'
                    ) && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.pricePerGram}
                      </TableCell>
                    )}

                    {purchaseTxnEnableFieldsMap.get('enable_product_qty') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {!isUpdate ? (
                          <TextField
                            variant={
                              enabledrow === idx ? 'outlined' : 'standard'
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
                        ) : (
                          item.qty
                        )}
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
                        {!isUpdate ? (
                          <TextField
                            variant={
                              enabledrow === idx ? 'outlined' : 'standard'
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
                        ) : (
                          item.freeQty
                        )}
                      </TableCell>
                    )}

                    {/* Unit */}
                    {purchaseTxnEnableFieldsMap.get('enable_product_unit') && (
                      <TableCell
                        variant="body"
                        classes={{ root: classes.tableCellBodyRoot }}
                      >
                        {item.qtyUnit}
                      </TableCell>
                    )}

                    {/* Gross Weight Grams */}
                    {purchaseTxnEnableFieldsMap.get(
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
                    {purchaseTxnEnableFieldsMap.get(
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
                    {purchaseTxnEnableFieldsMap.get(
                      'enable_product_net_weight'
                    ) &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.netWeight}
                        </TableCell>
                      )}

                    {/* Wastage Percentage */}
                    {purchaseTxnEnableFieldsMap.get('enable_product_wastage') &&
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
                    {purchaseTxnEnableFieldsMap.get(
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
                    {purchaseTxnEnableFieldsMap.get(
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
                    {purchaseTxnEnableFieldsMap.get(
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
                    {purchaseTxnEnableFieldsMap.get('enable_product_purity') &&
                      isJewellery === 'true' && (
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.purity}
                        </TableCell>
                      )}

                    {/*  Hallmark charge */}
                    {purchaseTxnEnableFieldsMap.get(
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
                    {purchaseTxnEnableFieldsMap.get(
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

                    {purchaseTxnEnableFieldsMap.get(
                      'enable_product_discount'
                    ) && (
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
                      purchaseTxnEnableFieldsMap.get('enable_product_igst') && (
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
                    {purchaseTxnEnableFieldsMap.get('enable_product_cess') && (
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
                      {item.isEdit ? (
                        <div>
                          <TextField
                            variant="standard"
                            readOnly={true}
                            value={item.amount}
                            onChange={(e) => inputOnChange(e, idx, getAmount)}
                            InputProps={{
                              classes: { input: classes.outlineinputProps },
                              disableUnderline: true
                            }}
                          />
                          {!isUpdate && (
                            <DeleteOutlined
                              color="secondary"
                              style={{ marginTop: '6px' }}
                              onClick={() => deleteRow(idx)}
                            />
                          )}
                        </div>
                      ) : (
                        item.amount
                      )}
                    </TableCell>
                  </EditTable>
                ))}

                <TableRow className={classes.addRowWrapper}>
                  <TableCell colSpan="3"></TableCell>

                  {isJewellery && metalList && metalList.length > 0 && (
                    <TableCell colSpan="1"></TableCell>
                  )}

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

                  {/* Brand */}
                  {purchaseTxnEnableFieldsMap.get('enable_product_brand') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {/* Model Number */}
                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_model_no'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {/* Purchased Price */}
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

                  {/* ********Free Quantity******* */}
                  {purchaseTxnEnableFieldsMap.get('enable_product_unit') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_gross_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_stone_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_net_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get('enable_product_wastage') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="3"
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
                    'enable_product_hallmark_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {purchaseTxnEnableFieldsMap.get(
                    'enable_product_certification_charge'
                  ) &&
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

                  {purchaseTxnEnableFieldsMap.get('enable_product_cess') && (
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

        {/* Dialog Footer */}
        <div className={classes.footer} style={{ height: '265px' }}>
          {/*------------ Notes------------ */}
          {/* {purchaseTxnEnableFieldsMap.get('enable_bill_notes') ? ( */}

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
          {!isPurchaseReturnConvertion && (
          <Grid container >
            <Grid item xs={12} style={{padding:'7px', background: '#EBEBEB', borderBottom: '1px solid #cec1c1'}}>
              <FileUpload onFilesUpload={handleFilesUpload} uploadedFiles={returnDetails.imageUrls} />
            </Grid>
          </Grid>
          )}
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

          <Grid
            container
            spacing={0}
            className={[classes.root, classes.paymentTypeWrap]}
          >
            <Grid item xs={12} sm={3}>
              {purchaseReturnTxnSettingsData.enableTDS === true &&
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
              {purchaseReturnTxnSettingsData.enableTCS === true &&
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
              </Grid>
            </Grid>

            <Grid item xs={2}></Grid>

            {/* <Grid item xs={2}>
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
              <>
                {/* {!isUpdate && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.footercontrols}
                  >
                    Share{' '}
                  </Button>
                )} */}
              </>

              {/* {isUpdate && printerList && printerList.length > 0 && (
                <Button
                  color="secondary"
                  variant="contained"
                  className={[classes.saveButton, classes.footercontrols]}
                  onClick={() => {
                    onPrintClicked();
                  }}
                >
                  Print{' '}
                </Button>
                )} */}

              {!isUpdate && (
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

              {!isUpdate && printerList && printerList.length > 0 && (
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
                  className={[innerClasses.formWrapper]}
                >
                  <TextField
                    className="total-wrapper-form"
                    id="roundoff-payment"
                    placeholder="0"
                    style={{ border: '1px solid #a8a8a8', borderRadius: '5px' }}
                    disabled={true}
                    value={getRoundedAmount}
                    InputProps={{ disableUnderline: true }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={2} style={{ marginTop: '20px' }}>
              {(paymentLinkTransactions.length > 0 ||
                returnDetails.linked_amount > 0) &&
                items.length > 0 &&
                items[0].amount > 0 && (
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
        <LinkPaymentPurchaseReturn
          open={OpenLinkpaymentPage}
          onClose={closeLinkPayment}
          isEditAllowed={!isUpdate}
        />

        <Dialog
          fullScreen={fullScreen}
          open={openAmountAlert}
          onClose={handleAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Received amount can't be more than the Purchase return amount.
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
              Purchase Return cannot be performed without selecting/adding
              products.
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
              Please Choose Vendor from list before providing Bill number.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleVendorNotProvidedAlertClose}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={openBillNotExistAlert}
          onClose={handleBillNotExistAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Purchase Bill Does not exist to save a Purchase Return.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleBillNotExistAlertClose}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={openBillNoAlreadyExistAlert}
          onClose={handleBillNoAlreadyExistAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Purchase Return No already exists. Please provide a different
              Return No.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleBillNoAlreadyExistAlertClose}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={openBillEmptyAlert}
          onClose={handleBillEmptyAlert}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Purchase provide Bill No to save a Purchase Return.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBillEmptyAlert} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={openReturnNoEmptyAlert}
          onClose={handleReturnNoEmptyAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Purchase provide Return No to save a Purchase Return.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleReturnNoEmptyAlertClose}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          open={openPurchaseReturnLoadingAlertMessage}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ textAlign: 'center' }}>
                  <p>
                    Please wait while the Purchase Return bill is being
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
          open={openPurchaseReturnErrorAlertMessage}
          onClose={handleClosePurchaseReturnErrorAlertMessage}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Something went wrong while saving Purchase Return bill. Please try
              again!!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClosePurchaseReturnErrorAlertMessage}
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

        {OpenPurchaseReturnSerialList ? (
          <PurchaseReturnSerialListModal
            productDetail={selectedProduct}
            selectedIndex={selectedIndex}
            onClose={handleSerialListModalClose}
          />
        ) : null}

        <PurchaseMultipleBillNoModal
          open={openMultipleBillForSameVendorSelectionPopUp}
          multiplePurchaseBillsByVendor={multiplePurchaseBillsByVendor}
          onClose={closeMultipleBillForSameVendorSelectionPopUp}
        />
      </Dialog>
    </div>
  );
};
const useOutsideAlerter = (ref, index) => {
  const store = useStore();

  // useEffect(() => {
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
  const { setEditTable, setRowClicked } = store.PurchasesReturnsAddStore;
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
        setRowClicked(props.index);
        setEditTable(props.index, true);
      }}
    >
      {props.children}
    </TableRow>
  );
};
export default injectWithObserver(AddPurchaseReturn);