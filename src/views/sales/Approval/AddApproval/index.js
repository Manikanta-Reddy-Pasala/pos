import React, { forwardRef, useState, useEffect, useRef } from 'react';

import { Cancel, DeleteOutlined } from '@material-ui/icons';
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
  TextField,
  Checkbox,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  makeStyles,
  DialogActions,
  DialogContent,
  DialogContentText,
  useMediaQuery,
  FormControlLabel,
  useTheme
} from '@material-ui/core';
//import local components
import * as Db from '../../../../RxDb/Database/Database';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import injectWithObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import styles from '../style';
import moment from 'moment';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { approvalRefs } from '../../../../components/Refs/ApprovalRefs';
import * as Bd from '../../../../components/SelectedBusiness';
import Loader from 'react-js-loader';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';

var dateFormat = require('dateformat');
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useInnerStyles = makeStyles((theme) => ({
  headerFooterWrapper: {
    /*  padding: '7px',
    margin: 0 */
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
    position: 'absolute',
    top: '60px',
    bottom: '150px',
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
  }
}));

const AddApproval = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  const inputRef = useRef([]);
  const store = useStore();
  const theme = useTheme();

  const {
    approvalDetails,
    items,
    OpenAddApprovalInvoice,
    FocusLastIndex,
    approvalTxnEnableFieldsMap,
    taxSettingsData,
    openApprovalLoadingAlertMessage,
    openApprovalErrorAlertMessage,
    sequenceNumberFailureAlert
  } = toJS(store.ApprovalsStore);

  const {
    closeDialog,
    setApprovalDate,
    getAmount,
    getTotalAmount,
    addNewItem,
    deleteItem,
    isUpdate,
    setMrp,
    setItemNameForRandomProduct,
    setQuantity,
    saveData,
    saveDataAndNew,
    selectProduct,
    setEmployeeName,
    setEmployeeId,
    setEmployee,
    setInvoiceRegularSetting,
    setInvoiceThermalSetting,
    setEditTable,
    setFocusLastIndex,
    setCGST,
    setNotes,
    setSGST,
    setIGST,
    setGrossWeight,
    setWastagePercentage,
    setWastageGrams,
    setNetWeight,
    setPurity,
    setItemHSN,
    setItemBatchId,
    setIsSelectedCheckerBox,
    setTaxIncluded,
    setApprovalTxnEnableFieldsMap,
    setTaxSettingsData,
    setMakingCharge,
    setMakingChargeAmount,
    getTotalNetWeight,
    getTotalGrossWeight,
    getTotalWatage,
    getRoundedAmount,
    toggleRoundOff,
    setMakingChargePerGramAmount,
    handleCloseApprovalErrorAlertMessage,
    handleOpenApprovalLoadingMessage,
    setMakingChargeIncluded,
    setRoundingConfiguration,
    setItemPricePerGram,
    setItemStoneCharge,
    setItemStoneWeight,
    getTotalStoneWeight,
    handleCloseSequenceNumberFailureAlert,
    setItemHallmarkCharge,
    setItemCertificationCharge
  } = store.ApprovalsStore;

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);
  const { getTaxSettingsDetails } = store.TaxSettingsStore;

  const { getApprovalTransSettingdetails } =
    store.ApprovalTransactionSettingsStore;

  const [rxdbSub, setRxdbSub] = useState([]);
  const [records, setRecords] = useState([]);

  const [employeeList, setEmployeeList] = React.useState();
  const [product_name, setProductName] = React.useState();
  const [menuOpenStatus, setMenuOpenStatus] = React.useState(false);

  const [openAlert, setAlertOpen] = React.useState(false);
  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [proceedOptn, setProceedOptn] = React.useState('save');
  const [openAmountAlert, setAmountAlert] = React.useState(false);
  const [openNoProductsAlert, setNoProductsAlert] = React.useState(false);
  const [employeeNameWhileEditing, setEmployeeNameWhileEditing] = useState('');
  const [openEmployeeNotProvidedAlert, setEmployeeNotProvidedAlert] =
    React.useState(false);
  const [productlist, setproductlist] = useState([]);
  const [openNegativeBalanceAlert, setNegativeBalanceAlert] =
    React.useState(false);

  const [printerList, setPrinterList] = React.useState([]);
  const [isBarcodeFocus, setBarcodeFocus] = React.useState(true);

  const [isJewellery, setIsJewellery] = React.useState(false);

  const approvalRefsValue = approvalRefs();

  const [isStartPrint, setIsStartPrint] = React.useState(false);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const { getAuditSettingsData } = store.AuditSettingsStore;

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  useEffect(() => {
    async function fetchData() {
      setApprovalTxnEnableFieldsMap(await getApprovalTransSettingdetails());
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setTaxSettingsData(await getTaxSettingsDetails());
    }

    fetchData();
  }, []);

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    setAmountAlert(false);
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

  const handleDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setApprovalDate(date);
  };

  const deleteRow = (index) => {
    deleteItem(index);
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

  const onPrintAndSaveClicked = async () => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (approvalDetails.employeeName === '') {
      setEmployeeNotProvidedAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setProceedOptn('save_new');
      setAlertOpen(false);
      setInvoiceRegularSetting(invoiceRegular);
      setInvoiceThermalSetting(invoiceThermal);

      handleOpenApprovalLoadingMessage();
      saveData(true)
        .then((data) => {
          console.log('Approval data Inserted');
        })
        .catch((err) => {
          console.log('Approval Data insertion Failed');
          // alert('Error in Adding Data');
        });
    }
  };

  const isProductsValid = async () => {
    let isProductsValid = true;
    let errorMessage = '';

    let auditSettings = await getAuditSettingsData();

    if (approvalTxnEnableFieldsMap.get('enable_product_price') === true) {
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
      approvalTxnEnableFieldsMap.get('enable_product_price_per_gram') === true
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

  const handleEmployeeNotProvidedAlertClose = () => {
    setEmployeeNotProvidedAlert(false);
  };

  const handlEmployeeClick = (employee) => {
    setEmployeeName(employee.name);
    //  setEmployeeId(employee.id);
    setEmployee(employee);

    setEmployeeNameWhileEditing('');
    setEditTable(0, true, 1);
    setEmployeeList([]);
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

    if (approvalDetails.employeeName === '') {
      setEmployeeNotProvidedAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setProceedOptn('save');
      setProductName('');
      setAlertOpen(false);
      setEmployeeNameWhileEditing('');

      handleOpenApprovalLoadingMessage();
      await saveData(false)
        .then((data) => {
          // handleClose();
          // getApprovalsCount();
          // closeDialog();
        })
        .catch((err) => {
          console.log('save approval Failed');
          // alert('Error in Adding Data');
        });
    }
  };

  const saveAndNewClick = async (val) => {
    let isProdsValid = await isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (approvalDetails.employeeName === '') {
      setEmployeeNotProvidedAlert(true);
    } else if (
      items.length === 0 ||
      (items.length === 1 && items[0].item_name === '')
    ) {
      setNoProductsAlert(true);
    } else {
      setProceedOptn('save_new');
      setProductName('');
      setEmployeeNameWhileEditing('');
      setAlertOpen(false);

      handleOpenApprovalLoadingMessage();
      saveDataAndNew(false)
        .then((data) => {
          console.log('data Inserted');
          // handleClose();
          // getApprovalsCount();
          // closeDialog();
        })
        .catch((err) => {
          console.log('Approval Insertion Failed - ', err);
        });
    }
  };

  const inputOnChange = (e, index, setFunction) => {
    e.persist();
    setFunction(index, e.target.value);
  };

  const inputOnQtyChange = (e, index, setFunction) => {
    e.persist();
    setFunction(index, e.target.value);
  };

  const handleDialogKeyDown = (e) => {
    let charCode = String.fromCharCode(e.which).toLowerCase();

    if (
      (e.ctrlKey || e.metaKey) &&
      (charCode === 's' || charCode === 'p' || charCode === 'n')
    ) {
      e.preventDefault();

      if ((e.ctrlKey || e.metaKey) && charCode === 's') {
        saveDataClick(false);
      }
      if ((e.ctrlKey || e.metaKey) && charCode === 'p') {
        if (!isUpdate && printerList && printerList.length > 0) {
          onPrintAndSaveClicked();
        }
      }

      if ((e.ctrlKey || e.metaKey) && charCode === 'n') {
        if (!isUpdate) {
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

  useEffect(() => {
    // console.log('use effect of add invoice');

    setproductlist([]);

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
      setEmployeeList(null);
    };
  }, []);

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
    setIsJewellery(localStorage.getItem('isJewellery'));
  }, []);

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
        open={OpenAddApprovalInvoice}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
        onKeyDown={handleDialogKeyDown}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={6} className={innerClasses.alignCenter}>
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
                      Approval
                    </Button>
                  </Grid>

                  <Grid item className={innerClasses.alignCenter} sm="4">
                    {!isUpdate ? (
                      <div>
                        <div>
                          <TextField
                            inputRef={(el) =>
                              (inputRef.current[
                                approvalRefsValue.employeeNameRefVal
                              ] = el)
                            }
                            onClick={(e) => {
                              setMenuOpenStatus(false);
                            }}
                            onKeyDown={(e) => {
                              if (employeeList && employeeList.length > 0) {
                                if (e.key === 'Escape') {
                                  setEmployeeList([]);
                                  setEmployeeNameWhileEditing('');
                                }
                                handleKeyDown(
                                  e,
                                  approvalRefsValue.saveBtnRef,
                                  approvalRefsValue.employeeListFirstIndexRef,
                                  approvalRefsValue.noRef
                                );
                              } else {
                                handleKeyDown(
                                  e,
                                  approvalRefsValue.saveBtnRef,
                                  approvalRefsValue.paymentTypeRef,
                                  approvalRefsValue.noRef
                                );

                                if (e.key === 'ArrowDown') {
                                  setEditTable(0, true, '');
                                }
                              }
                            }}
                            placeholder="Select Employee *"
                            value={
                              approvalDetails.employeeName === ''
                                ? employeeNameWhileEditing
                                : approvalDetails.employeeName
                            }
                            onChange={(e) => {
                              if (e.target.value !== employeeNameWhileEditing) {
                                setEmployeeName('');
                              }
                              getEmployeeList(e.target.value);
                              setEmployeeNameWhileEditing(e.target.value);
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
                                        ref={(el) =>
                                          (inputRef.current[
                                            Number(
                                              approvalRefsValue.employeeNameRefVal +
                                                '0' +
                                                index +
                                                '0'
                                            )
                                          ] = el)
                                        }
                                        onKeyDown={(e) => {
                                          if (e.key === 'Escape') {
                                            setEmployeeList([]);
                                            setEmployeeNameWhileEditing('');
                                            setFocusLastIndex(1);
                                          }
                                          handleKeyDown(
                                            e,
                                            Number(
                                              approvalRefsValue.employeeNameRefVal +
                                                '0' +
                                                (index - 1) +
                                                '0'
                                            ),
                                            approvalRefsValue.noRef,
                                            Number(
                                              approvalRefsValue.employeeNameRefVal +
                                                '0' +
                                                (index + 1) +
                                                '0'
                                            ),
                                            approvalRefsValue.noRef
                                          );
                                          if (e.key === 'Enter') {
                                            handlEmployeeClick(option);
                                          }
                                        }}
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
                    ) : (
                      <Input
                        readOnly
                        id="component-simple"
                        value={approvalDetails.employeeName}
                        fullWidth
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={3} className={innerClasses.alignCenter}>
                {isUpdate && (
                  <Grid container className={innerClasses.alignCenter}>
                    <Grid
                      item
                      xs={12}
                      sm={3}
                      style={{ textAlign: 'left' }}
                      className={innerClasses.alignCenter}
                    >
                      <Typography
                        variant="span"
                        className="formLabel"
                        style={{ color: '#000000', fontSize: 'small' }}
                      >
                        Approval No. :
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <TextField
                        readOnly
                        id="component-simple"
                        value={approvalDetails.sequenceNumber}
                        style={{ color: '#000000', fontSize: 'small' }}
                      />
                    </Grid>
                  </Grid>
                )}
              </Grid>

              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    style={{ textAlign: 'left' }}
                    className={innerClasses.alignCenter}
                  >
                    <Typography
                      variant="span"
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Approval Date :
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
                      inputRef={(el) => (inputRef.current[6] = el)}
                      value={approvalDetails.approvalDate}
                      onKeyDown={(e) => {
                        handleKeyDown(e, 1, 37, 80, 5);
                      }}
                      onChange={(event) => handleDateChange(event.target.value)}
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={1} style={{ textAlign: 'end' }}>
                <IconButton
                  onClick={checkCloseDialog}
                  ref={(el) =>
                    (inputRef.current[approvalRefsValue.cancelBtnRef] = el)
                  }
                >
                  <Cancel fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {/* ------------------------------------PRODUCT TABLE-------------------------------------- */}

        <div className={innerClasses.content}>
          <TableContainer
            onClick={(e) => {
              setMenuOpenStatus(false);
            }}
          >
            <Table aria-label="simple table">
              <TableHead className={classes.addtablehead}>
                <TableRow>
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
                    width={50}
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    SELECT{' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    width={300}
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    ITEM{' '}
                  </TableCell>

                  {/* HSN */}
                  {approvalTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      width={90}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      HSN{' '}
                    </TableCell>
                  )}

                  {/* Batch Number */}
                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get('enable_product_price') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      PRICE{' '}
                    </TableCell>
                  )}

                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      QTY{' '}
                    </TableCell>
                  )}

                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get('enable_product_wastage') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        WASTAGE{' '}
                      </TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get('enable_product_purity') &&
                    isJewellery === 'true' && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        PURITY{' '}
                      </TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get(
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
                    approvalTxnEnableFieldsMap.get('enable_product_igst') && (
                      <TableCell
                        variant="head"
                        colSpan="2"
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        IGST{' '}
                      </TableCell>
                    )}
                  {taxSettingsData.enableGst &&
                    approvalTxnEnableFieldsMap.get('enable_tax_included') && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        width={'10px'}
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        TAX INCLUDED{' '}
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
                  {approvalTxnEnableFieldsMap.get('enable_product_wastage') &&
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
                  {approvalTxnEnableFieldsMap.get(
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

                  {approvalTxnEnableFieldsMap.get(
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
                    approvalTxnEnableFieldsMap.get('enable_product_igst') && (
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
                  <EditTable key={idx + 1} index={idx}>
                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {idx + 1}
                    </TableCell>
                    {/* checkbox  */}
                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      <Checkbox
                        checked={item.isSelected}
                        onChange={(e) => {
                          setIsSelectedCheckerBox(idx);
                        }}
                        style={{ padding: '0px' }}
                      />
                    </TableCell>
                    {/* Product name */}
                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {item.isEdit && !item.item_name ? (
                        <div>
                          <TextField
                            variant={'outlined'}
                            inputRef={(el) =>
                              (inputRef.current[
                                Number(
                                  '' + approvalRefsValue.productNameRef + idx
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
                            onKeyDown={(e) => {
                              handleKeyDown(
                                e,
                                idx === 0
                                  ? approvalRefsValue.paymentTypeRef
                                  : Number(
                                      '' +
                                        approvalRefsValue.productNameRef +
                                        (idx - 1)
                                    ),
                                '' + approvalRefsValue.barcodeRef + idx,
                                idx === items.length - 1
                                  ? productlist.length > 0
                                    ? Number(
                                        '' +
                                          approvalRefsValue.productNameRef +
                                          idx +
                                          '00'
                                      )
                                    : approvalRefsValue.addRowRef
                                  : productlist.length > 0
                                  ? Number(
                                      '' +
                                        approvalRefsValue.productNameRef +
                                        idx +
                                        '00'
                                    )
                                  : Number(
                                      '' +
                                        approvalRefsValue.productNameRef +
                                        (idx + 1)
                                    ),
                                idx === 0
                                  ? approvalRefsValue.placeOfSupplyRef
                                  : Number(
                                      '' +
                                        approvalRefsValue.amountRef +
                                        (idx - 1)
                                    )
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
                              if (productlist.length > 0) {
                                if (e.key === 'Escape') {
                                  setproductlist([]);
                                  setProductName('');
                                  setEditTable(
                                    idx,
                                    true,
                                    Number(
                                      approvalRefsValue.productNameRef + idx
                                    )
                                  );
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
                                    <Grid container style={{ display: 'flex' }}>
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
                                    }}
                                  >
                                    <Button
                                      className={innerClasses.liBtn}
                                      disableRipple
                                      ref={(el) =>
                                        (inputRef.current[
                                          Number(
                                            '' +
                                              approvalRefsValue.productNameRef +
                                              idx +
                                              '0' +
                                              index
                                          )
                                        ] = el)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          setproductlist([]);
                                          setProductName('');
                                          setEditTable(
                                            idx,
                                            true,
                                            Number(
                                              '' +
                                                approvalRefsValue.productNameRef +
                                                idx
                                            )
                                          );
                                        }
                                        handleKeyDown(
                                          e,
                                          '' +
                                            approvalRefsValue.productNameRef +
                                            idx +
                                            '0' +
                                            (index - 1),
                                          0,
                                          '' +
                                            approvalRefsValue.productNameRef +
                                            idx +
                                            '0' +
                                            (index + 1),
                                          0
                                        );
                                        if (e.key === 'Enter') {
                                          setproductlist([]);
                                          selectProduct(option, idx);
                                          setProductName('');
                                          setBarcodeFocus(false);
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
                                            {option.salePrice
                                              ? parseFloat(
                                                  option.salePrice
                                                ).toFixed(2)
                                              : 0}
                                          </p>
                                        </Grid>

                                        {String(
                                          localStorage.getItem('isJewellery')
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
                      ) : (
                        <TextField
                          variant={'standard'}
                          fullWidth
                          inputRef={(el) =>
                            (inputRef.current[
                              Number(
                                '' + approvalRefsValue.productNameRef + idx
                              )
                            ] = el)
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
                              idx === 0
                                ? approvalRefsValue.paymentTypeRef
                                : Number(
                                    '' +
                                      approvalRefsValue.productNameRef +
                                      (idx - 1)
                                  ),
                              '' + approvalRefsValue.barcodeRef + idx,
                              idx === items.length - 1
                                ? productlist.length > 0
                                  ? Number(
                                      '' +
                                        approvalRefsValue.productNameRef +
                                        idx +
                                        '00'
                                    )
                                  : approvalRefsValue.addRowRef
                                : productlist.length > 0
                                ? Number(
                                    '' +
                                      approvalRefsValue.productNameRef +
                                      idx +
                                      '00'
                                  )
                                : Number(
                                    '' +
                                      approvalRefsValue.productNameRef +
                                      (idx + 1)
                                  ),
                              idx === 0
                                ? approvalRefsValue.placeOfSupplyRef
                                : Number(
                                    '' + approvalRefsValue.amountRef + (idx - 1)
                                  )
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
                      )}
                    </TableCell>

                    {/* HSN */}
                    {approvalTxnEnableFieldsMap.get('enable_product_hsn') && (
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
                            onChange={(e) => inputOnChange(e, idx, setItemHSN)}
                            onKeyDown={(e) => {
                              handleKeyDown(
                                e,
                                idx === 0 ? 21 : Number('5' + (idx - 1)),
                                Number('6' + idx),
                                idx === items.length - 1
                                  ? 15
                                  : Number('5' + (idx + 1)),
                                Number('4' + idx)
                              );
                              if (e.key === 'ArrowDown') {
                                if (productlist.length === 0 && idx >= 0) {
                                  setEditTable(
                                    idx + 1,
                                    true,
                                    idx === items.length - 1
                                      ? ''
                                      : Number('5' + (idx + 1))
                                  );
                                }
                              }
                              if (e.key === 'ArrowUp') {
                                if (productlist.length === 0 && idx >= 0) {
                                  setEditTable(
                                    idx - 1,
                                    true,
                                    idx ? Number('5' + (idx - 1)) : ''
                                  );
                                }
                              }
                              if (e.key === 'Enter') {
                                handleAddRow();
                              }
                            }}
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

                    {/* Batch Number */}
                    {approvalTxnEnableFieldsMap.get(
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
                              inputOnChange(e, idx, setItemBatchId)
                            }
                            onKeyDown={(e) => {
                              handleKeyDown(
                                e,
                                idx === 0 ? 21 : Number('5' + (idx - 1)),
                                Number('6' + idx),
                                idx === items.length - 1
                                  ? 15
                                  : Number('5' + (idx + 1)),
                                Number('4' + idx)
                              );
                              if (e.key === 'ArrowDown') {
                                if (productlist.length === 0 && idx >= 0) {
                                  setEditTable(
                                    idx + 1,
                                    true,
                                    idx === items.length - 1
                                      ? ''
                                      : Number('5' + (idx + 1))
                                  );
                                }
                              }
                              if (e.key === 'ArrowUp') {
                                if (productlist.length === 0 && idx >= 0) {
                                  setEditTable(
                                    idx - 1,
                                    true,
                                    idx ? Number('5' + (idx - 1)) : ''
                                  );
                                }
                              }
                              if (e.key === 'Enter') {
                                handleAddRow();
                              }
                            }}
                            value={item.batch_id}
                            InputProps={{
                              classes: { input: innerClasses.tableForm },
                              disableUnderline: true
                            }}
                          />
                        ) : (
                          item.batch_id
                        )}
                      </TableCell>
                    )}

                    {/* Price */}
                    {approvalTxnEnableFieldsMap.get('enable_product_price') && (
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
                                Number('' + approvalRefsValue.mrpRef + idx)
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
                              if (
                                !(
                                  isUpdate &&
                                  item.taxIncluded &&
                                  item.categoryLevel2
                                )
                              ) {
                                inputOnChange(e, idx, setMrp);
                                setItemNameForRandomProduct(idx, product_name);
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
                                      : Number(
                                          '' +
                                            approvalRefsValue.mrpRef +
                                            (idx + 1)
                                        )
                                  );
                                }
                              }
                              if (e.key === 'ArrowUp') {
                                if (productlist.length === 0 && idx >= 0) {
                                  setEditTable(
                                    idx - 1,
                                    true,
                                    idx
                                      ? Number(
                                          '' +
                                            approvalRefsValue.mrpRef +
                                            (idx - 1)
                                        )
                                      : ''
                                  );
                                }
                              }
                              handleKeyDown(
                                e,
                                idx === 0
                                  ? approvalRefsValue.paymentTypeRef
                                  : Number(
                                      '' + approvalRefsValue.mrpRef + (idx - 1)
                                    ),
                                Number('' + approvalRefsValue.qtyRef + idx),
                                idx === items.length - 1
                                  ? approvalRefsValue.addRowRef
                                  : Number(
                                      '' + approvalRefsValue.mrpRef + (idx + 1)
                                    ),
                                Number('' + approvalRefsValue.barcodeRef + idx)
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
                          parseFloat(item.mrp).toFixed(2)
                        )}
                      </TableCell>
                    )}

                    {/* Price per gram*/}
                    {approvalTxnEnableFieldsMap.get(
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
                    {approvalTxnEnableFieldsMap.get('enable_product_qty') && (
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
                              if (e.target.value > 0 || e.target.value === '') {
                                inputOnQtyChange(e, idx, setQuantity);
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
                              handleKeyDown(
                                e,
                                idx === 0 ? 21 : Number('9' + (idx - 1)),
                                Number('30' + idx),
                                idx === items.length - 1
                                  ? 15
                                  : Number('9' + (idx + 1)),
                                Number('7' + idx)
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
                    {approvalTxnEnableFieldsMap.get(
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
                                onKeyDown={(e) => {
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
                                  handleKeyDown(
                                    e,
                                    idx === 0 ? 21 : Number('9' + (idx - 1)),
                                    Number('30' + idx),
                                    idx === items.length - 1
                                      ? 15
                                      : Number('9' + (idx + 1)),
                                    Number('7' + idx)
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
                              item.grossWeight
                            )}{' '}
                          </TableCell>
                        </>
                      )}

                    {/* Stone Weight */}
                    {approvalTxnEnableFieldsMap.get(
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
                    {approvalTxnEnableFieldsMap.get(
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
                                }}
                                onKeyDown={(e) => {
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
                                  handleKeyDown(
                                    e,
                                    idx === 0 ? 21 : Number('9' + (idx - 1)),
                                    Number('30' + idx),
                                    idx === items.length - 1
                                      ? 15
                                      : Number('9' + (idx + 1)),
                                    Number('7' + idx)
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
                              item.netWeight
                            )}{' '}
                          </TableCell>
                        </>
                      )}

                    {/* Wastage Percentage */}
                    {approvalTxnEnableFieldsMap.get('enable_product_wastage') &&
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
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(
                                        idx + 1,
                                        true,
                                        idx === items.length - 1
                                          ? ''
                                          : Number('30' + (idx + 1))
                                      );
                                    }
                                  }
                                  if (e.key === 'ArrowUp') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(
                                        idx - 1,
                                        true,
                                        idx ? Number('30' + (idx - 1)) : ''
                                      );
                                    }
                                  }
                                  handleKeyDown(
                                    e,
                                    idx === 0 ? 21 : Number('30' + (idx - 1)),
                                    Number('31' + idx),
                                    idx === items.length - 1
                                      ? 15
                                      : Number('30' + (idx + 1)),
                                    Number('9' + idx)
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
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    if (productlist.length === 0 && idx >= 0) {
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
                                    if (productlist.length === 0 && idx >= 0) {
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
                              item.wastageGrams
                            )}{' '}
                          </TableCell>
                        </>
                      )}

                    {/* Making Charge Percentage */}
                    {approvalTxnEnableFieldsMap.get(
                      'enable_product_making_charge'
                    ) &&
                      isJewellery === 'true' && (
                        <>
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
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <div
                                style={{
                                  marginLeft: '10px',
                                  alignSelf: 'center'
                                }}
                              >
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
                                            : Number('30' + (idx + 1))
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
                                          idx ? Number('30' + (idx - 1)) : ''
                                        );
                                      }
                                    }
                                    handleKeyDown(
                                      e,
                                      idx === 0 ? 21 : Number('30' + (idx - 1)),
                                      Number('31' + idx),
                                      idx === items.length - 1
                                        ? 15
                                        : Number('30' + (idx + 1)),
                                      Number('9' + idx)
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
                              <div
                                style={{
                                  marginLeft: '10px',
                                  alignSelf: 'center'
                                }}
                              >
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
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    if (productlist.length === 0 && idx >= 0) {
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
                                    if (productlist.length === 0 && idx >= 0) {
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
                              item.makingChargeAmount
                            )}{' '}
                          </TableCell>
                        </>
                      )}

                    {/* Making Charge per gram Amount */}
                    {approvalTxnEnableFieldsMap.get(
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
                                    if (productlist.length === 0 && idx >= 0) {
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
                                    if (productlist.length === 0 && idx >= 0) {
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

                    {/* Stone charge */}
                    {approvalTxnEnableFieldsMap.get(
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
                    {approvalTxnEnableFieldsMap.get('enable_product_purity') &&
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
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(
                                        idx + 1,
                                        true,
                                        idx === items.length - 1
                                          ? ''
                                          : Number(
                                              '' +
                                                approvalRefsValue.qtyRef +
                                                (idx + 1)
                                            )
                                      );
                                    }
                                  }
                                  if (e.key === 'ArrowUp') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(
                                        idx - 1,
                                        true,
                                        idx
                                          ? Number(
                                              '' +
                                                approvalRefsValue.qtyRef +
                                                (idx - 1)
                                            )
                                          : ''
                                      );
                                    }
                                  }
                                  handleKeyDown(
                                    e,
                                    idx === 0
                                      ? approvalRefsValue.paymentTypeRef
                                      : Number(
                                          '' +
                                            approvalRefsValue.qtyRef +
                                            (idx - 1)
                                        ),
                                    Number(
                                      '' +
                                        approvalRefsValue.productDiscountPercentRef +
                                        idx
                                    ),
                                    idx === items.length - 1
                                      ? approvalRefsValue.addRowRef
                                      : Number(
                                          '' +
                                            approvalRefsValue.qtyRef +
                                            (idx + 1)
                                        ),
                                    Number('' + approvalRefsValue.mrpRef + idx)
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
                              item.purity
                            )}{' '}
                          </TableCell>
                        </>
                      )}

                    {/* Hallmark charge */}
                    {approvalTxnEnableFieldsMap.get(
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
                                  inputOnChange(e, idx, setItemHallmarkCharge);
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
                    {approvalTxnEnableFieldsMap.get(
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

                    {/* CGST Percentage*/}
                    {taxSettingsData.enableGst && (
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
                                    Number('' + approvalRefsValue.cgstRef + idx)
                                  ] = el)
                                }
                                type="number"
                                onFocus={(e) =>
                                  item.cgst === 0 ? setCGST(idx, '') : ''
                                }
                                onChange={(e) => inputOnChange(e, idx, setCGST)}
                                value={item.cgst}
                                onKeyDown={(e) => {
                                  if (e.key === 'ArrowDown') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(
                                        idx + 1,
                                        true,
                                        idx === items.length - 1
                                          ? ''
                                          : Number(
                                              '' +
                                                approvalRefsValue.cgstRef +
                                                (idx + 1)
                                            )
                                      );
                                    }
                                  }
                                  if (e.key === 'ArrowUp') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(
                                        idx - 1,
                                        true,
                                        idx
                                          ? Number(
                                              '' +
                                                approvalRefsValue.cgstRef +
                                                (idx - 1)
                                            )
                                          : ''
                                      );
                                    }
                                  }
                                  handleKeyDown(
                                    e,
                                    idx === 0
                                      ? approvalRefsValue.paymentTypeRef
                                      : Number(
                                          '' +
                                            approvalRefsValue.cgstRef +
                                            (idx - 1)
                                        ),
                                    Number(
                                      '' + approvalRefsValue.cgstAmountRef + idx
                                    ),
                                    idx === items.length - 1
                                      ? approvalRefsValue.addRowRef
                                      : Number(
                                          '' +
                                            approvalRefsValue.cgstRef +
                                            (idx + 1)
                                        ),
                                    Number(
                                      '' +
                                        approvalRefsValue.productDiscountAmountRef +
                                        idx
                                    )
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
                            item.cgst
                          )}
                        </TableCell>
                      </>
                    )}
                    {/* CGST Amount*/}
                    {taxSettingsData.enableGst && (
                      <>
                        <TableCell
                          variant="body"
                          classes={{ root: classes.tableCellBodyRoot }}
                        >
                          {item.isEdit ? (
                            <div className={classes.wrapper}>
                              <TextField
                                variant={'outlined'}
                                disabled="true"
                                native
                                value={parseFloat(item.cgst_amount).toFixed(2)}
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
                      </>
                    )}
                    {/* SGST Percentage*/}
                    {taxSettingsData.enableGst && taxSettingsData.enableGst && (
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
                                    Number('' + approvalRefsValue.sgstRef + idx)
                                  ] = el)
                                }
                                type="number"
                                variant={'outlined'}
                                onChange={(e) => inputOnChange(e, idx, setSGST)}
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
                                          : Number(
                                              '' +
                                                approvalRefsValue.sgstRef +
                                                (idx + 1)
                                            )
                                      );
                                    }
                                  }
                                  if (e.key === 'ArrowUp') {
                                    if (productlist.length === 0 && idx >= 0) {
                                      setEditTable(
                                        idx - 1,
                                        true,
                                        idx
                                          ? Number(
                                              '' +
                                                approvalRefsValue.sgstRef +
                                                (idx - 1)
                                            )
                                          : ''
                                      );
                                    }
                                  }
                                  handleKeyDown(
                                    e,
                                    idx === 0
                                      ? approvalRefsValue.paymentTypeRef
                                      : Number(
                                          '' +
                                            approvalRefsValue.sgstRef +
                                            (idx - 1)
                                        ),
                                    Number(
                                      '' + approvalRefsValue.sgstAmountRef + idx
                                    ),
                                    idx === items.length - 1
                                      ? approvalRefsValue.addRowRef
                                      : Number(
                                          '' +
                                            approvalRefsValue.sgstRef +
                                            (idx + 1)
                                        ),
                                    Number(
                                      '' + approvalRefsValue.cgstAmountRef + idx
                                    )
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
                            item.sgst
                          )}{' '}
                        </TableCell>
                      </>
                    )}
                    {/* SGST Amount*/}
                    {taxSettingsData.enableGst && taxSettingsData.enableGst && (
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
                                value={parseFloat(item.sgst_amount).toFixed(2)}
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
                      </>
                    )}
                    {/* IGST Percentage*/}
                    {taxSettingsData.enableGst &&
                      approvalTxnEnableFieldsMap.get('enable_product_igst') && (
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
                                        '' + approvalRefsValue.igstRef + idx
                                      )
                                    ] = el)
                                  }
                                  type="number"
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
                                            : Number(
                                                '' +
                                                  approvalRefsValue.igstRef +
                                                  (idx + 1)
                                              )
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
                                          idx
                                            ? Number(
                                                '' +
                                                  approvalRefsValue.igstRef +
                                                  (idx - 1)
                                              )
                                            : ''
                                        );
                                      }
                                    }
                                    handleKeyDown(
                                      e,
                                      idx === 0
                                        ? approvalRefsValue.paymentTypeRef
                                        : Number(
                                            '' +
                                              approvalRefsValue.igstRef +
                                              (idx - 1)
                                          ),
                                      Number(
                                        '' +
                                          approvalRefsValue.igstAmountRef +
                                          idx
                                      ),
                                      idx === items.length - 1
                                        ? approvalRefsValue.addRowRef
                                        : Number(
                                            '' +
                                              approvalRefsValue.igstRef +
                                              (idx + 1)
                                          ),
                                      Number(
                                        '' +
                                          approvalRefsValue.sgstAmountRef +
                                          idx
                                      )
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
                                  disabled="true"
                                  variant={'outlined'}
                                  value={parseFloat(item.igst_amount).toFixed(
                                    2
                                  )}
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
                        </>
                      )}
                    {/* Tax Included */}
                    {taxSettingsData.enableGst &&
                      approvalTxnEnableFieldsMap.get('enable_tax_included') && (
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
                                Number('' + approvalRefsValue.amountRef + idx)
                              ] = el)
                            }
                            onChange={(e) => inputOnChange(e, idx, getAmount)}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowDown') {
                                if (productlist.length === 0 && idx >= 0) {
                                  setEditTable(
                                    idx + 1,
                                    true,
                                    idx === items.length - 1
                                      ? ''
                                      : Number(
                                          '' +
                                            approvalRefsValue.amountRef +
                                            (idx + 1)
                                        )
                                  );
                                }
                              }
                              if (e.key === 'ArrowUp') {
                                if (productlist.length === 0 && idx >= 0) {
                                  setEditTable(
                                    idx - 1,
                                    true,
                                    idx
                                      ? Number(
                                          '' +
                                            approvalRefsValue.amountRef +
                                            (idx - 1)
                                        )
                                      : ''
                                  );
                                }
                              }
                              handleKeyDown(
                                e,
                                idx === 0
                                  ? approvalRefsValue.paymentTypeRef
                                  : Number(
                                      '' +
                                        approvalRefsValue.amountRef +
                                        (idx - 1)
                                    ),
                                Number(
                                  '' + approvalRefsValue.deleteBtnRef + idx
                                ),
                                idx === items.length - 1
                                  ? approvalRefsValue.addRowRef
                                  : Number(
                                      '' +
                                        approvalRefsValue.amountRef +
                                        (idx + 1)
                                    ),
                                Number('' + approvalRefsValue.cessRef + idx)
                              );
                              if (e.key === 'Enter') {
                                handleAddRow();
                              }
                            }}
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
                                  '' + approvalRefsValue.deleteBtnRef + idx
                                )
                              ] = el)
                            }
                            style={{
                              padding: '0px'
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'ArrowDown') {
                                if (productlist.length === 0 && idx >= 0) {
                                  setEditTable(
                                    idx + 1,
                                    true,
                                    idx === items.length - 1
                                      ? ''
                                      : Number(
                                          '' +
                                            approvalRefsValue.deleteBtnRef +
                                            (idx + 1)
                                        )
                                  );
                                }
                              }
                              if (e.key === 'ArrowUp') {
                                if (productlist.length === 0 && idx >= 0) {
                                  setEditTable(
                                    idx - 1,
                                    true,
                                    idx
                                      ? Number(
                                          '' +
                                            approvalRefsValue.deleteBtnRef +
                                            (idx - 1)
                                        )
                                      : ''
                                  );
                                }
                              }
                              handleKeyDown(
                                e,
                                idx === 0
                                  ? approvalRefsValue.paymentTypeRef
                                  : Number(
                                      '' +
                                        approvalRefsValue.deleteBtnRef +
                                        (idx - 1)
                                    ),
                                idx === items.length - 1
                                  ? approvalRefsValue.addRowRef
                                  : Number(
                                      '' +
                                        approvalRefsValue.productNameRef +
                                        (idx + 1)
                                    ),
                                idx === items.length - 1
                                  ? approvalRefsValue.addRowRef
                                  : Number(
                                      '' +
                                        approvalRefsValue.deleteBtnRef +
                                        (idx + 1)
                                    ),
                                Number('' + approvalRefsValue.amountRef + idx)
                              );
                              if (e.key === 'Enter') {
                                deleteRow(idx);
                              }
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
                ))}

                <TableRow className={classes.addRowWrapper}>
                  <TableCell colSpan="3">
                    <Button
                      variant="outlined"
                      size="small"
                      ref={(el) =>
                        (inputRef.current[approvalRefsValue.addRowRef] = el)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(
                          e,
                          Number(
                            approvalRefsValue.productNameRef +
                              (items.length - 1)
                          ),
                          approvalRefsValue.packingChargeRef,
                          approvalRefsValue.packingChargeRef,
                          Number(
                            approvalRefsValue.deleteBtnRef + (items.length - 1)
                          )
                        );

                        if (e.key === 'ArrowUp') {
                          setEditTable(items.length - 1, true, '');
                        }
                        if (e.key === 'Enter') {
                          handleAddRow();
                        }
                      }}
                      onClick={handleAddRow}
                      className={innerClasses.addButton}
                    >
                      Add Row{' '}
                    </Button>
                  </TableCell>

                  {/* HSN */}
                  {approvalTxnEnableFieldsMap.get('enable_product_hsn') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {/* Batch Number */}
                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_batch_number'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {approvalTxnEnableFieldsMap.get('enable_product_price') && (
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

                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_price_per_gram'
                  ) && <TableCell colSpan="1"></TableCell>}

                  {approvalTxnEnableFieldsMap.get('enable_product_qty') && (
                    <TableCell colSpan="1"></TableCell>
                  )}

                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_gross_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalGrossWeight} {'g'}
                        </Typography>
                      </TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_stone_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalStoneWeight} {'g'}
                        </Typography>
                      </TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_net_weight'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalNetWeight} {'g'}
                        </Typography>
                      </TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get('enable_product_wastage') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="2" style={{ textAlign: 'right' }}>
                        <Typography component="subtitle2">
                          {getTotalWatage} {'g'}
                        </Typography>
                      </TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_making_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="3"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_making_charge_per_gram'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell
                        colSpan="1"
                        style={{ textAlign: 'right' }}
                      ></TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_stone_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get('enable_product_purity') &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_hallmark_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {approvalTxnEnableFieldsMap.get(
                    'enable_product_certification_charge'
                  ) &&
                    isJewellery === 'true' && (
                      <TableCell colSpan="1"></TableCell>
                    )}

                  {taxSettingsData.enableGst && (
                    <TableCell colSpan="4"></TableCell>
                  )}

                  {taxSettingsData.enableGst &&
                    approvalTxnEnableFieldsMap.get('enable_product_igst') && (
                      <TableCell colSpan="2"></TableCell>
                    )}

                  <TableCell colSpan="2" style={{ textAlign: 'center' }}>
                    <Typography component="subtitle2">
                      {approvalDetails.subTotal}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/*------------------------------------- Dialog Footer----------------------------------- */}
        <div className={classes.footer}>
          {approvalTxnEnableFieldsMap.get('enable_bill_notes') ? (
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
                value={approvalDetails.notes}
              ></TextField>
            </Grid>
          ) : (
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
          )}
          <Grid
            container
            style={{ height: '100%', padding: '0px 0px 0px 14px' }}
          >
            <Grid item xs={6} style={{ marginTop: '3px' }}>
              <Button
                variant="outlined"
                color="secondary"
                className={classes.footercontrols}
                onClick={() => saveDataClick(false)}
                ref={(el) =>
                  (inputRef.current[approvalRefsValue.saveBtnRef] = el)
                }
                onKeyDown={(e) => {
                  if (approvalDetails.is_credit || isUpdate) {
                    handleKeyDown(
                      e,
                      approvalRefsValue.packingChargeRef,
                      approvalRefsValue.saveNewRef,
                      approvalRefsValue.employeeNameRefVal,
                      approvalRefsValue.receivedPaymentRef
                    );
                  } else {
                    handleKeyDown(
                      e,
                      approvalRefsValue.packingChargeRef,
                      approvalRefsValue.saveNewRef,
                      approvalRefsValue.employeeNameRefVal,
                      approvalRefsValue.discountAmountRef
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

              <>
                {/* <Button
                  variant="outlined"
                  color="secondary"
                  className={classes.footercontrols}
                >
                  Print{' '}
              </Button> */}
              </>

              <Button
                variant="outlined"
                color="secondary"
                ref={(el) =>
                  (inputRef.current[approvalRefsValue.saveNewRef] = el)
                }
                className={classes.footercontrols}
                onClick={() => saveAndNewClick(false)}
                onKeyDown={(e) => {
                  if (printerList && printerList.length > 0) {
                    handleKeyDown(
                      e,
                      approvalRefsValue.packingChargeRef,
                      approvalRefsValue.printNewRef,
                      approvalRefsValue.employeeNameRefVal,
                      approvalRefsValue.saveBtnRef
                    );
                  } else {
                    handleKeyDown(
                      e,
                      approvalRefsValue.packingChargeRef,
                      approvalRefsValue.employeeNameRefVal,
                      approvalRefsValue.employeeNameRefVal,
                      approvalRefsValue.saveBtnRef
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
                <>
                  <Button
                    color="secondary"
                    variant="contained"
                    className={[classes.saveButton, classes.footercontrols]}
                    onClick={() => onPrintAndSaveClicked()}
                  >
                    Save & Print{' '}
                  </Button>
                </>
              )}
            </Grid>
            <Grid item xs={2} style={{ marginTop: '3px' }}></Grid>

            <Grid item xs={2} style={{ marginTop: '10px' }}>
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
                        checked={approvalDetails.is_roundoff}
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
                style={{ marginTop: '-18px', marginLeft: '-12px' }}
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

        <Dialog
          fullScreen={fullScreen}
          open={openAlert}
          onClose={handleAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
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
        open={openEmployeeNotProvidedAlert}
        onClose={handleEmployeeNotProvidedAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Please Choose Employee from list before performing a Approval.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleEmployeeNotProvidedAlertClose}
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
        open={openApprovalLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Approval bill is being created!!!</p>
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
        open={openApprovalErrorAlertMessage}
        onClose={handleCloseApprovalErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Approval bill. Please try again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseApprovalErrorAlertMessage}
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
    store.ApprovalsStore;
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
export default injectWithObserver(AddApproval);