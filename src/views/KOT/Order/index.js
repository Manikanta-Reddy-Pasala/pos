import React, { forwardRef, useState, useEffect, useRef } from 'react';

import { Cancel, DeleteOutlined } from '@material-ui/icons';
import {
  Slide,
  Button,
  Dialog,
  Grid,
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
  DialogTitle,
  InputAdornment,
  ListItemText,
  Switch,
  Select,
  FormControl,
  Input
} from '@material-ui/core';

import KOTBatchListModal from 'src/components/modal/KotBatchListModal';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import injectWithObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import styles from './style';
import * as moment from 'moment';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Arrowtopright from '../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../icons/Arrowbottomleft';
import CustomerModal from 'src/views/customers/modal/AddCustomer';
import prodPlus from '../../../icons/prod_plus.png';
import plus from '../../../icons/plus.png';
import { kotRefs } from '../../../components/Refs/KotRefs';
import Loader from 'react-js-loader';
import { getKOTAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getCustomerAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import EditIcon from '@material-ui/icons/Edit';
import { styled } from '@material-ui/styles';
import SplitPaymentDetails from './SplitPaymentDetails';
import clsx from 'clsx';
import * as taxUtilityTxn from 'src/components/Utility/TaxUtility';
import KOTAddOnsList from 'src/components/modal/KOTAddOnsList';
import { getCustomerName } from 'src/names/constants';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

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
    width: '70%'
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
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
  }
}));

const AddOrder = () => {
  const innerClasses = useInnerStyles();
  const classes = styles.useStyles();
  const theme = useTheme();
  const store = useStore();
  const kotRefsValues = kotRefs();
  const inputRef = useRef([]);

  const {
    orderData,
    openAddSaleDialog,
    waiters,
    selectedProduct,
    items,
    OpenBatchList,
    availableChairs,
    chairsList,
    openKOTLoadingAlertMessage,
    openKOTErrorAlertMessage,
    kotTxnEnableFieldsMap,
    taxSettingsData,
    openSplitPaymentDetails,
    chosenPaymentType,
    splitPaymentSettingsData,
    openAddonList,
    productAddOnsData,
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
    setCustomerName,
    setCustomerId,
    setPackingCharge,
    handleBatchListModalClose,
    selectCustomer,
    setPaymentType,
    setWaiterData,
    selectProduct,
    selectedCategory,
    selectedTable,
    setBankAccountData,
    setInoicePrefix,
    setInvoiceSubPrefix,
    handleCloseKOTErrorAlertMessage,
    handleOpenKOTLoadingMessage,
    setInvoiceDate,
    setItemDiscount,
    setItemDiscountAmount,
    setCGST,
    setSGST,
    setIGST,
    setCess,
    setTaxIncluded,
    handleCloseSplitPaymentDetails,
    handleOpenSplitPaymentDetails,
    setChosenPaymentType,
    resetSplitPaymentDetails,
    setMenuType,
    setMrp,
    setRoundingConfiguration,
    getRoundedAmount,
    handleOpenAddon,
    getItemTotalAmount,
    setDiscountAmount,
    setDiscountType,
    toggleRoundOff
  } = store.KotStore;

  const { resetCustomerFromSales, handleCustomerModalOpenFromSales } =
    store.CustomerStore;
  const { customerDialogOpen, customerFromSales } = toJS(store.CustomerStore);
  const { handleAddProductModalOpen } = store.ProductStore;

  const [order_type, setOrderType] = React.useState('KOT');
  const [waiter, setWaiter] = React.useState('');
  const [chair, setChair] = React.useState([]);
  const [Customerlist, setCustomerlist] = React.useState();
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

  const menuTypeList = ['AC', 'Non-AC', 'Self Service'];

  const getProductList = async (value) => {
    setproductlist(await getKOTAutoCompleteList(value, orderData.menuType));
  };

  const handleAddCustomer = () => {
    handleCustomerModalOpenFromSales();
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
    setRoundingConfiguration(transaction.roundingConfiguration);
  }, [transaction.roundingConfiguration]);

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

  const handleDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setInvoiceDate(date);
  };

  const inputOnChange = (e, index, setFunction) => {
    e.persist();
    setFunction(index, e.target.value);
  };

  const handleOrderType = (e) => {
    setOrderType(e);
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
    if (customerFromSales.id) {
      resetCustomerFromSales();
    }
  }, [customerFromSales]);

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

  const setTaxIncludedCheckerBox = (index) => {
    setTaxIncluded(index);
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
        open={openAddSaleDialog}
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
                      Order
                    </Button>
                  </Grid>
                  <Grid
                    item
                    className={innerClasses.alignCenter}
                    style={{ textAlign: 'center' }}
                  >
                    <div>
                      <div>
                        <TextField
                          fullWidth
                          inputRef={(el) =>
                            (inputRef.current[
                              kotRefsValues.customerNameRefVal
                            ] = el)
                          }
                          placeholder="Customer *"
                          className={innerClasses.input}
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
                                      selectCustomer(option);
                                    }}
                                    key={`${index}customer`}
                                  >
                                    <Button
                                      className={innerClasses.liBtn}
                                      disableRipple
                                      buttonRef={(el) =>
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
                      <CustomerModal open={customerDialogOpen} />
                    </div>
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
                          (inputRef.current[kotRefsValues.addCustomerBtnRef] =
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
                        (inputRef.current[kotRefsValues.addProductBtnRef] = el)
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

              {/* <Grid item xs={1}></Grid> */}
              {/*  {transaction.sales.prefixesList.length > 0 ||
              transaction.sales.subPrefixesList.length > 0 ? ( */}
              <Grid
                item
                xs={3}
                className={innerClasses.alignCenter}
                style={{ paddingRight: '20px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid item xs={3} className={innerClasses.alignCenter}>
                    <Typography
                      className="formLabel"
                      style={{
                        color: '#000000',
                        fontSize: 'small',
                        marginLeft: '10px'
                      }}
                    >
                      Invoice Number
                    </Typography>
                  </Grid>
                  <Grid item xs={9} style={{ display: 'flex' }}>
                    <>
                      {transaction &&
                        transaction.sales &&
                        transaction.sales.prefixSequence.length > 0 && (
                          <div>
                            <TextField
                              style={{ width: '80%' }}
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
                                      style={{ cursor: 'pointer' }}
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
                                                  handleChangePrefixes(option);
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
              {/*  ) : (
                <Grid item xs={3}></Grid>
              )} */}

              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                style={{ paddingRight: '20px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={3}
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
                      value={orderData.invoice_date}
                      onChange={(event) => handleDateChange(event.target.value)}
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={1} style={{ textAlign: 'end' }}>
                <IconButton
                  onClick={(e) => {
                    checkCloseDialog();
                  }}
                  ref={(el) =>
                    (inputRef.current[kotRefsValues.cancelBtnRef] = el)
                  }
                >
                  <Cancel fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {/* -------------------------------------KOT ------------------------------------------ */}
        <div>
          <Toolbar style={{ background: '#EBEBEB' }}>
            <Grid container>
              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid container direction="row" spacing={0} alignItems="center">
                  <Grid item xs={4}>
                    <Typography className={innerClasses.fontSizesmall}>
                      Type
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl
                      required
                      className={clsx(classes.formControl, classes.noLabel)}
                    >
                      <Select
                        disableUnderline
                        className={classes.selectFont}
                        value={
                          orderData.menuType ? orderData.menuType : 'Select'
                        }
                        disabled={orderData.total_amount > 0 ? true : false}
                        input={<Input />}
                        onChange={async (e) => {
                          if (e.target.value !== 'Select') {
                            setMenuType(e.target.value);
                          } else {
                            setMenuType('');
                          }
                        }}
                      >
                        <MenuItem value={'Select'}>{'Select'}</MenuItem>

                        {menuTypeList &&
                          menuTypeList.map((option, index) => (
                            <MenuItem value={option}>{option}</MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid
                  container
                  direction="row"
                  spacing={0}
                  alignItems="center"
                  // style={{ marginTop: '7px' }}
                >
                  <Grid item xs={4}>
                    <Typography className={innerClasses.fontSizesmall}>
                      Waiter Name
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      id="filled-select-currency-native"
                      style={{ background: 'white' }}
                      value={orderData.waiter_name}
                      margin="dense"
                      className={innerClasses.selectOptn}
                      autoComplete="off"
                      inputRef={(el) =>
                        (inputRef.current[kotRefsValues.waiterNameRef] = el)
                      }
                      onClick={(e) => {
                        setWaiterMenuOpenStatus(true);
                      }}
                      variant="outlined"
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
              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid
                  container
                  direction="row"
                  spacing={0}
                  alignItems="center"
                  // style={{ marginTop: '7px' }}
                >
                  <Grid item xs={4}>
                    <Typography className={innerClasses.fontSizesmall}>
                      Division
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={innerClasses.fontSizesmall}>
                    {selectedCategory.categoryName}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid
                  container
                  direction="row"
                  spacing={0}
                  alignItems="center"
                  // style={{ marginTop: '7px' }}
                >
                  <Grid item xs={4}>
                    <Typography className={innerClasses.fontSizesmall}>
                      Table No
                    </Typography>
                  </Grid>
                  <Grid item xs={8} className={innerClasses.fontSizesmall}>
                    {selectedTable.tableNumber}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid
                  container
                  direction="row"
                  spacing={0}
                  alignItems="center"
                  // style={{ marginTop: '7px' }}
                >
                  <Grid item xs={4}>
                    <Typography className={innerClasses.fontSizesmall}>
                      Chair No
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    {!orderData.isUpdate ? (
                      <TextField
                        displayEmpty
                        className={innerClasses.selectOptn}
                        value={
                          orderData.selectedChairs
                            ? orderData.selectedChairs
                            : []
                        }
                        margin="dense"
                        variant="outlined"
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
                          }
                        }}
                        inputRef={(el) =>
                          (inputRef.current[kotRefsValues.chairNoRef] = el)
                        }
                        inputProps={{ 'aria-label': 'Without label' }}
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
                                      ? orderData.selectedChairs.indexOf(c) > -1
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
                                      ? orderData.selectedChairs.indexOf(c) > -1
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
              <Grid item xs={2} className={innerClasses.alignCenter}>
                <Grid
                  container
                  direction="row"
                  spacing={0}
                  alignItems="center"
                  // style={{ marginTop: '7px' }}
                >
                  <Grid item xs={4} style={{ textAlign: 'center' }}>
                    <Typography className={innerClasses.fontSizesmall}>
                      Pax
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      variant={'outlined'}
                      fullWidth
                      inputRef={(el) =>
                        (inputRef.current[kotRefsValues.paxRef] = el)
                      }
                      type="number"
                      value={orderData.numberOfPax}
                      className={[
                        innerClasses.selectOptn,
                        innerClasses.fontSizesmall
                      ]}
                      onChange={handlePax}
                      InputProps={{
                        classes: { input: innerClasses.paxInput },
                        disableUnderline: true
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Toolbar>
        </div>

        {/* ------------------------------------PRODUCT TABLE------------------------------------ */}
        <div className={innerClasses.content}>
          <Grid container className={innerClasses.headerFooterWrapper}>
            <TableContainer>
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
                      width={330}
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      ITEM{' '}
                    </TableCell>

                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      PRICE{' '}
                    </TableCell>

                    <TableCell
                      variant="head"
                      rowSpan="2"
                      classes={{ root: classes.tableCellHeaderRoot }}
                    >
                      QTY{' '}
                    </TableCell>

                    {kotTxnEnableFieldsMap.get('enable_product_discount') && (
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
                      kotTxnEnableFieldsMap.get('enable_product_igst') && (
                        <TableCell
                          variant="head"
                          colSpan="2"
                          classes={{ root: classes.tableCellHeaderRoot }}
                        >
                          IGST{' '}
                        </TableCell>
                      )}
                    {taxSettingsData.enableGst && (
                      <TableCell
                        variant="head"
                        rowSpan="2"
                        width={'10px'}
                        classes={{ root: classes.tableCellHeaderRoot }}
                      >
                        TAX INCLUDED{' '}
                      </TableCell>
                    )}
                    {kotTxnEnableFieldsMap.get('enable_product_cess') && (
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
                  {/* ------------------- */}
                  <TableRow>
                    {kotTxnEnableFieldsMap.get('enable_product_discount') && (
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
                      kotTxnEnableFieldsMap.get('enable_product_igst') && (
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
                  </TableRow>
                </TableHead>

                <TableBody>
                  {items
                    ? items.map((item, idx) => (
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
                            >
                              {item.isEdit &&
                              !item.item_name &&
                              !item.served ? (
                                <div>
                                  <TextField
                                    variant={'outlined'}
                                    value={product_name}
                                    inputRef={(el) =>
                                      (inputRef.current[
                                        Number(
                                          '' +
                                            kotRefsValues.productNameRef +
                                            idx
                                        )
                                      ] = el)
                                    }
                                    autoFocus={isBarcodeFocus ? false : true}
                                    fullWidth
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
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

                                              <Grid item xs={4}>
                                                <p> Stock </p>
                                              </Grid>
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
                                              setBarcodeFocus(false);
                                              setProductName('');
                                            }}
                                          >
                                            <Button
                                              className={innerClasses.liBtn}
                                              disableRipple
                                              buttonRef={(el) =>
                                                (inputRef.current[
                                                  Number(
                                                    '9' + idx + '0' + index
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
                                                    {option.salePrice}
                                                  </p>
                                                </Grid>

                                                <Grid item xs={4}>
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
                              ) : (
                                <TextField
                                  variant={'standard'}
                                  fullWidth
                                  autoFocus={isBarcodeFocus ? true : false}
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number(
                                        '' + kotRefsValues.productNameRef + idx
                                      )
                                    ] = el)
                                  }
                                  value={item.item_name}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              )}
                            </TableCell>

                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit && !item.served ? (
                                <TextField
                                  variant={'outlined'}
                                  fullWidth
                                  value={item.mrp}
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number('' + kotRefsValues.mrpRef + idx)
                                    ] = el)
                                  }
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
                                    disableUnderline: true
                                  }}
                                />
                              ) : (
                                item.mrp
                              )}
                            </TableCell>

                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit && !item.served ? (
                                <TextField
                                  variant={'outlined'}
                                  fullWidth
                                  value={item.qty}
                                  type="number"
                                  inputRef={(el) =>
                                    (inputRef.current[
                                      Number('' + kotRefsValues.qtyRef + idx)
                                    ] = el)
                                  }
                                  onChange={(e) =>
                                    inputOnChange(e, idx, setQuantity)
                                  }
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />
                              ) : (
                                item.qty
                              )}{' '}
                            </TableCell>

                            {kotTxnEnableFieldsMap.get(
                              'enable_product_discount'
                            ) && (
                              <>
                                {/* Discount Percentage*/}
                                <TableCell
                                  variant="body"
                                  classes={{ root: classes.tableCellBodyRoot }}
                                >
                                  {item.isEdit && !item.served ? (
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
                                        native="true"
                                        type="number"
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
                            {taxSettingsData.enableGst && (
                              <>
                                <TableCell
                                  variant="body"
                                  classes={{ root: classes.tableCellBodyRoot }}
                                >
                                  {/* {item.isEdit ? (
                                <div className={classes.wrapper}>
                                  <TextField
                                    variant={'outlined'}
                                    disabled="true"
                                    native
                                    value={parseFloat(item.cgst_amount).toFixed(
                                      2
                                    )}
                                    InputProps={{
                                      classes: { input: innerClasses.tableForm },
                                      disableUnderline: true
                                    }}
                                  />
                                </div>
                              ) : (
                                parseFloat(item.cgst_amount).toFixed(2)
                              )} */}

                                  {parseFloat(item.cgst_amount).toFixed(2)}
                                </TableCell>
                              </>
                            )}

                            {/* SGST Percentage*/}
                            {taxSettingsData.enableGst && (
                              <>
                                <TableCell
                                  variant="body"
                                  classes={{ root: classes.tableCellBodyRoot }}
                                >
                                  {item.isEdit ? (
                                    <div className={classes.wrapper}>
                                      <TextField
                                        type="number"
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

                            {/* CGST Amount*/}
                            {taxSettingsData.enableGst && (
                              <>
                                <TableCell
                                  variant="body"
                                  classes={{ root: classes.tableCellBodyRoot }}
                                >
                                  {/* {item.isEdit ? (
                                <div className={classes.wrapper}>
                                  <TextField
                                    disabled="true"
                                    variant={'outlined'}
                                    value={parseFloat(item.sgst_amount).toFixed(
                                      2
                                    )}
                                    InputProps={{
                                      classes: { input: innerClasses.tableForm },
                                      disableUnderline: true
                                    }}
                                  />
                                </div>
                              ) : (
                                parseFloat(item.sgst_amount).toFixed(2)
                              )}{' '} */}

                                  {parseFloat(item.sgst_amount).toFixed(2)}
                                </TableCell>
                              </>
                            )}

                            {/* IGST Percentage*/}
                            {taxSettingsData.enableGst &&
                              kotTxnEnableFieldsMap.get(
                                'enable_product_igst'
                              ) && (
                                <>
                                  <TableCell
                                    variant="body"
                                    classes={{
                                      root: classes.tableCellBodyRoot
                                    }}
                                  >
                                    {item.isEdit ? (
                                      <div className={classes.wrapper}>
                                        <TextField
                                          variant={'outlined'}
                                          onChange={(e) =>
                                            inputOnChange(e, idx, setIGST)
                                          }
                                          value={item.igst}
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
                                    classes={{
                                      root: classes.tableCellBodyRoot
                                    }}
                                  >
                                    {/* {item.isEdit ? (
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
                                )}{' '} */}
                                    {parseFloat(item.igst_amount).toFixed(2)}
                                  </TableCell>
                                </>
                              )}

                            {/* Tax Included */}
                            {taxSettingsData.enableGst && (
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
                            {kotTxnEnableFieldsMap.get(
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
                                        onFocus={(e) =>
                                          item.cess === 0
                                            ? setCess(idx, '')
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
                                    item.cess
                                  )}{' '}
                                </TableCell>
                              </>
                            )}

                            <TableCell
                              variant="body"
                              classes={{ root: classes.tableCellBodyRoot }}
                            >
                              {item.isEdit && !item.served ? (
                                <div className={classes.wrapper}>
                                  <TextField
                                    variant={'outlined'}
                                    readOnly={true}
                                    value={item.amount}
                                    inputRef={(el) =>
                                      (inputRef.current[
                                        Number(
                                          '' + kotRefsValues.amountRef + idx
                                        )
                                      ] = el)
                                    }
                                    onChange={(e) => {
                                      // inputOnChange(e, idx, getAmount)
                                    }}
                                    InputProps={{
                                      classes: {
                                        input: innerClasses.tableForm
                                      },
                                      disableUnderline: true
                                    }}
                                  />
                                  <Button
                                    ref={(el) =>
                                      (inputRef.current[
                                        Number(
                                          '' + kotRefsValues.deleteBtnRef + idx
                                        )
                                      ] = el)
                                    }
                                    style={{
                                      padding: '0px'
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
                              colSpan={8}
                            ></TableCell>
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
                                            kotRefsValues.addCustomerBtnRef
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
                                        onClick={() =>
                                          handleOpenAddon(item, idx)
                                        }
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
                                        <Typography
                                          style={{
                                            lineHeight: '2',
                                            marginRight: '10px'
                                          }}
                                        >
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

                            {openAddonList && <KOTAddOnsList />}
                          </TableRow>
                        </>
                      ))
                    : null}

                  <TableRow className={classes.addRowWrapper}>
                    <TableCell colSpan="3">
                      <Button
                        variant="outlined"
                        size="small"
                        ref={(el) =>
                          (inputRef.current['' + kotRefsValues.addRowRef] = el)
                        }
                        onClick={handleAddRow}
                        className={innerClasses.addButton}
                      >
                        Add Row{' '}
                      </Button>

                      <Typography
                        style={{
                          float: 'right',
                          top: '11px',
                          position: 'relative'
                        }}
                        variant="span"
                        component="span"
                      >
                        SUB TOTAL{' '}
                      </Typography>
                    </TableCell>
                    <TableCell colSpan="6"></TableCell>
                    {kotTxnEnableFieldsMap.get('enable_product_discount') && (
                      <TableCell colSpan="2"></TableCell>
                    )}
                    {kotTxnEnableFieldsMap.get('enable_product_cess') && (
                      <TableCell colSpan="1"></TableCell>
                    )}
                    <TableCell style={{ textAlign: 'center' }}>
                      <Typography component="subtitle2">
                        {parseFloat(orderData.subTotal).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </div>
        {/*------------------------------------- Dialog Footer----------------------------------- */}
        <div className={classes.footer}>
          <Grid
            container
            justifyContent="space-between"
            direction="row"
            className={[classes.root, classes.paymentTypeWrap]}
          >
            <Grid item xs={3}>
              {kotTxnEnableFieldsMap.get('enable_package_charge') && (
                <Grid
                  container
                  direction="row"
                  spacing={0}
                  alignItems="center"
                  // style={{ marginTop: '7px' }}
                >
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
                      placeholder="0"
                      inputRef={(el) =>
                        (inputRef.current[kotRefsValues.packingChargeRef] = el)
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
                        startAdornment: (
                          <InputAdornment position="end">₹</InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid xs={1} item></Grid>
                </Grid>
              )}
            </Grid>

            <Grid item xs={2} style={{ marginTop: '7px' }}>
              {kotTxnEnableFieldsMap.get('enable_bill_discount') && (
                <Grid container direction="row" spacing={0} alignItems="center">
                  <Grid
                    item
                    xs={12}
                    sm={3}
                    className={innerClasses.formWrapper}
                  >
                    <Typography style={{ fontSize: 'small' }}>
                      Discount
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
                        orderData.discount_type === 'percentage' ? '%' : '₹'
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
                    xs={12}
                    sm={6}
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
                            if (orderData.discount_type === 'percentage') {
                              setDiscount(e.target.value);
                            } else {
                              setDiscountAmount(e.target.value);
                            }
                          }}
                          value={
                            orderData.discount_type === 'percentage'
                              ? orderData.discount_percent
                              : orderData.discount_amount
                          }
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </Grid>

            <Grid item xs={12} sm={5}>
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
                <Grid
                  item
                  xs={2}
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
                    style={{ textAlign: 'center' }}
                    onChange={(e) => {
                      if ('cash' === e.target.value) {
                        setPaymentType('cash');
                      } else {
                        if (
                          splitPaymentSettingsData.defaultBankSelected !== '' &&
                          splitPaymentSettingsData.defaultBankSelected !==
                            undefined &&
                          splitPaymentSettingsData.defaultBankSelected !== null
                        ) {
                          let bankAccount = bankAccountsList.find(
                            (o) =>
                              o.accountDisplayName ===
                              splitPaymentSettingsData.defaultBankSelected
                          );

                          if (bankAccount) {
                            setBankAccountData(bankAccount, e.target.value);
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
          </Grid>

          <Grid
            container
            style={{ height: '100%', padding: '0px 0px 0px 14px' }}
          >
            <Grid item xs={6} style={{ marginTop: '10px' }}>
              <></>

              <Button
                variant="outlined"
                color="secondary"
                className={classes.footercontrols}
                onClick={() => {
                  saveOrEditOrderDataClick();
                }}
                ref={(el) => (inputRef.current[kotRefsValues.saveBtnRef] = el)}
              >
                {' '}
                Save{' '}
              </Button>
            </Grid>
            <Grid item xs={2} style={{ marginTop: '20px' }}></Grid>
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
                        checked={orderData.is_roundoff}
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
                    value={'₹ ' + parseFloat(orderData.total_amount).toFixed(2)}
                    InputProps={{ disableUnderline: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>

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

        {OpenBatchList && (
          <KOTBatchListModal
            open={OpenBatchList}
            productDetail={selectedProduct}
            onClose={handleBatchListModalClose}
          />
        )}
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
    </div>
  );
};

const EditTable = (props) => {
  const store = useStore();
  const { setEditTable, getAddRowEnabled, setAddRowEnabled } = store.KotStore;
  const wrapperRef = useRef(null);
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
export default injectWithObserver(AddOrder);