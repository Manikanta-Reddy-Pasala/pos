import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Cancel } from '@material-ui/icons';
import InvSeqIcon from '@material-ui/icons/EditOutlined';
import Typography from '@material-ui/core/Typography';
import LinkPaymentPaymentIn from '../../../../components/LinkPaymentPaymentIn';
import {
  makeStyles,
  MenuItem,
  Select,
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox,
  Switch
} from '@material-ui/core';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import * as Db from '../../../../RxDb/Database/Database';
import injectWithObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import * as moment from 'moment';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import DatePicker from '../../../../components/controls/DatePicker';
import PaymentInManuelSeqNumModal from '../modal/paymentInManuelSeqNumModal';
import * as Bd from '../../../../components/SelectedBusiness';
import { getPartiesAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import Loader from 'react-js-loader';
import EditIcon from '@material-ui/icons/Edit';
import { styled } from '@material-ui/styles';
import PaymentInSplitPaymentDetails from './PaymentInSplitPaymentDetails';

var dateFormat = require('dateformat');

const useStyles = makeStyles((theme) => ({
  pageContent: {
    position: 'relative',
    margin: theme.spacing(1),
    width: '100%',
    maxHeight: '180%'
    // height:'150%'
    // padding: theme.spacing(1),
  },
  dialogPaper: {
    maxWidth: '70%',
    height: '500px'
  },
  formControl: {
    // margin: theme.spacing(1),
    // position: 'relative',
    minWidth: '48%',
    // bottom: '30px',
    minHeight: '5%'
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },
  receipt: {
    position: 'absolute',
    bottom: '355px',
    marginLeft: '500px'
    // left:'130px',
  },
  date: {
    position: 'relative',
    bottom: 130,
    // marginLeft:'500px',
    width: '100%'
  },
  dialogTitleRoot: {
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center'
  },
  baltypo: {
    color: 'red',
    paddingLeft: 5
  },
  typobal: {
    color: 'green',
    paddingLeft: 5
  },
  totaltypo: {
    color: '#3796E2',
    // paddingLeft:50,
    fontWeight: 'bold'
  },
  width50: {
    width: '50%'
  },
  labelColor: {
    color: '#999'
  },
  flexRow: {
    flexFlow: 'row',
    marginTop: '20px'
  },
  actBtn: {
    borderColor: '#ff5252',
    color: '#ff5252'
  },
  saveBtn: {
    background: '#ff5252',
    color: '#fff'
  },
  actGrid: {
    padding: '0px 15px'
  },
  contentGrid: {
    padding: '0px 10px'
  },
  formWrapper: {
    marginRight: '10rem',
    width: 'calc(100% - 133px)'
  },
  formMargin: {
    marginBottom: '20px'
  },
  totalInput: {
    '& input': {
      fontSize: '20px',
      paddingRight: '10px'
    }
  },
  textRight: {
    textAlign: 'right',
    '& button': {
      margin: '0 10px'
    }
  },
  textRightWrap: {
    '& input': {
      textAlign: 'right'
    }
  },
  linkpayment: {
    backgroundColor: '#9dcb6a',
    color: 'White',
    '&:focus': {
      backgroundColor: '#9dcb6a'
    },
    '&$focusVisible': {
      backgroundColor: '#9dcb6a'
    },
    '&:hover': {
      backgroundColor: '#9dcb6a'
    }
  },
  footercontrols: {
    marginRight: 20
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
    width: '40%'
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

const AddnewPayment = (props) => {
  const classes = useStyles();
  const [customerList, setCustomerlist] = React.useState();
  const store = useStore();

  const { closeLinkPayment, setSequencePrefix, setSequenceSubPrefix } =
    store.PaymentInStore;
  const { transaction } = toJS(store.TransactionStore);
  const { getTransactionData } = store.TransactionStore;
  const {
    paymentDetails,
    OpenAddPaymentIn,
    currentCustomerBalance,
    isUpdate,
    paymentLinkTransactions,
    isRestore,
    openPaymentInLoadingAlertMessage,
    openPaymentInErrorAlertMessage,
    openSplitPaymentDetails,
    chosenPaymentType,
    splitPaymentSettingsData,
    openLinkpaymentPage,
    sequenceNumberFailureAlert
  } = toJS(store.PaymentInStore);
  const {
    savePaymentData,
    closeDialog,
    setPaymentInProperty,
    setLinkPayment,
    setPaymentInCustomerName,
    setpaymentInCustomer,
    setcurrentBalance,
    setPaymentInInvoiceRegular,
    setPaymentInInvoiceThermal,
    setBankAccountData,
    handlePaymentInNumModalOpen,
    handleClosePaymentInErrorAlertMessage,
    handleOpenPaymentInLoadingMessage,
    setBankAccountList,
    setSplitPaymentSettingsData,
    handleCloseSplitPaymentDetails,
    handleOpenSplitPaymentDetails,
    setChosenPaymentType,
    resetSplitPaymentDetails,
    setPaymentType,
    handleCloseSequenceNumberFailureAlert
  } = store.PaymentInStore;

  const [openCustomerSelectionAlert, setCustomerSelectionAlert] =
    React.useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [customerNameWhileEditing, setCustomerNameWhileEditing] = useState('');

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getSplitPaymentSettingdetails } = store.SplitPaymentSettingsStore;

  const [printerList, setPrinterList] = React.useState([]);

  const [bankAccounts, setBankAccounts] = React.useState([]);
  const [payment_type_val, setPaymentTypeVal] = React.useState('');

  const payment_mode_list = [
    { val: 'cash', name: 'CASH' },
    { val: 'upi', name: 'UPI' },
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' }
  ];

  const [payment_type_list, setPaymentTypeList] = React.useState([]);

  const [openAmountZeroAlert, setAmountZeroAlert] = React.useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const handleDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setPaymentInProperty('date', date);
  };

  const handleAlertClose = () => {
    setCustomerSelectionAlert(false);
  };

  const handleZeroAlertClose = () => {
    setAmountZeroAlert(false);
  };

  useEffect(() => {
    // Clear customer list
    setCustomerlist([]);

    // Get invoice settings
    getInvoiceSettings(localStorage.getItem('businessId'));

    // Get printer data
    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }

    // Set payment type value
    if (paymentDetails.paymentType) {
      let result = payment_mode_list.find(
        (e) => e.val === paymentDetails.paymentType
      );
      if (result) {
        setPaymentTypeVal(result.name);
      }
    } else {
      setPaymentTypeVal('');
    }
  }, [paymentDetails.paymentType]);

  const getCustomerlist = async (value) => {
    setCustomerlist(await getPartiesAutoCompleteList(value));
  };

  const handleCustomerClick = (customer) => {
    setPaymentInCustomerName(customer.name);
    setpaymentInCustomer(customer);
    setcurrentBalance(customer);
    setCustomerNameWhileEditing('');
    setCustomerlist([]);
  };

  const saveDataClick = (val) => {
    if (
      chosenPaymentType === 'Split' &&
      getSplitPaymentTotalAmount() !== parseFloat(paymentDetails.total)
    ) {
      setErrorMessage(
        'Please check the total amount provided in Split Payment. Its not matching total amount.'
      );
      setErrorAlertMessage(true);
    } else if (paymentDetails.received === '') {
      setAmountZeroAlert(true);
    } else if (paymentDetails.received === '0') {
      setAmountZeroAlert(true);
    } else if (paymentDetails.customerName === '') {
      setCustomerSelectionAlert(true);
    } else {
      setPrefixes('##');
      setSubPrefixes('##');

      handleOpenPaymentInLoadingMessage();
      savePaymentData(false, false);
    }
  };

  const saveNewDataClick = (val) => {
    if (
      chosenPaymentType === 'Split' &&
      getSplitPaymentTotalAmount() !== parseFloat(paymentDetails.total)
    ) {
      setErrorMessage(
        'Please check the total amount provided in Split Payment. Its not matching total amount.'
      );
      setErrorAlertMessage(true);
    } else if (paymentDetails.received === '') {
      setAmountZeroAlert(true);
    } else if (paymentDetails.received === '0') {
      setAmountZeroAlert(true);
    } else if (paymentDetails.customerName === '') {
      setCustomerSelectionAlert(true);
    } else {
      setPrefixes('##');
      setSubPrefixes('##');

      handleOpenPaymentInLoadingMessage();
      savePaymentData(true, false);
    }
  };

  const onSaveAndPrintClicked = async () => {
    if (
      chosenPaymentType === 'Split' &&
      getSplitPaymentTotalAmount() !== parseFloat(paymentDetails.total)
    ) {
      setErrorMessage(
        'Please check the total amount provided in Split Payment. Its not matching total amount.'
      );
      setErrorAlertMessage(true);
    } else if (paymentDetails.received === '') {
      setAmountZeroAlert(true);
    } else if (paymentDetails.received === '0') {
      setAmountZeroAlert(true);
    } else if (paymentDetails.customerName === '') {
      setCustomerSelectionAlert(true);
    } else {
      setPrefixes('##');
      setSubPrefixes('##');

      setPaymentInInvoiceRegular(invoiceRegular);
      setPaymentInInvoiceThermal(invoiceThermal);

      handleOpenPaymentInLoadingMessage();
      savePaymentData(false, true);
    }
  };

  const getSplitPaymentTotalAmount = () => {
    let result = 0;
    if (
      paymentDetails.splitPaymentList &&
      paymentDetails.splitPaymentList.length > 0
    ) {
      for (let payment of paymentDetails.splitPaymentList) {
        if (payment.amount !== '') {
          result += parseFloat(payment.amount);
        }
      }
    }
    return result;
  };

  useEffect(() => {
    async function fetchData() {
      await getBankAccounts();
      setSplitPaymentSettingsData(await getSplitPaymentSettingdetails());
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
      setBankAccountList(bankAccounts);
      setPaymentTypeList(list);
    });
  };

  useEffect(() => {
    async function fetchData() {
      await getTransactionData();
      const businessData = await Bd.getBusinessData();
      const businessId = businessData.businessId;
      if (
        localStorage.getItem(businessId + '_paymentInDefaultPrefix') !== '' &&
        localStorage.getItem(businessId + '_paymentInDefaultPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_paymentInDefaultPrefix') !== null
      ) {
        const defaultPrefix = localStorage.getItem(
          businessId + '_paymentInDefaultPrefix'
        );
        setPrefixes(defaultPrefix);
        setSequencePrefix(defaultPrefix);
      }

      if (
        localStorage.getItem(businessId + '_paymentInDefaultSubPrefix') !==
          '' &&
        localStorage.getItem(businessId + '_paymentInDefaultSubPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_paymentInDefaultSubPrefix') !== null
      ) {
        const defaultSubPrefix = localStorage.getItem(
          businessId + '_paymentInDefaultSubPrefix'
        );
        setSubPrefixes(defaultSubPrefix);
        setSequenceSubPrefix(defaultSubPrefix);
      }
    }

    fetchData();
  }, [getTransactionData]);

  const [prefixes, setPrefixes] = React.useState('##');
  const [subPrefixes, setSubPrefixes] = React.useState('##');

  const handleChangePrefixes = (e) => {
    setPrefixes(e.target.value);
    setSequencePrefix(e.target.value);
  };

  const handleChangeSubPrefixes = (e) => {
    setSubPrefixes(e.target.value);
    setSequenceSubPrefix(e.target.value);
  };

  return (
    <div>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullWidth="true"
        maxWidth={'lg'}
        open={OpenAddPaymentIn}
        onClose={closeDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle
          className={classes.dialogTitleRoot}
          disableTypography
          id="alert-dialog-title"
        >
          <Typography variant="h4">Payment In</Typography>
          <div>
            <IconButton>
              <Cancel
                fontSize="inherit"
                onClick={() => {
                  closeDialog();
                }}
              />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent>
          <Grid container>
            <Grid item className={classes.contentGrid} xs={12} sm={12} md={6}>
              <Grid item xs={12} sm={12}>
                <div style={{ width: '800px' }}>
                  <Typography variant="h6" className={classes.labelColor}>
                    Customer/Vendor *
                  </Typography>
                  {isUpdate ? (
                    !paymentDetails.customerReceivable ? (
                      <Typography variant="h6" className={[classes.formMargin]}>
                        Name : {paymentDetails.customerName}
                      </Typography>
                    ) : (
                      <Typography variant="h6" className={[classes.formMargin]}>
                        Name : {paymentDetails.customerName}
                      </Typography>
                    )
                  ) : (
                    <div>
                      <TextField
                        fullWidth
                        placeholder="Select Vendor/Customer"
                        className={classes.input}
                        value={
                          paymentDetails.customerName === ''
                            ? customerNameWhileEditing
                            : paymentDetails.customerName
                        }
                        onChange={(e) => {
                          if (e.target.value !== customerNameWhileEditing) {
                            setPaymentInCustomerName('');
                          }
                          getCustomerlist(e.target.value);
                          setCustomerNameWhileEditing(e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveDataClick(false);
                          }
                        }}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: classes.bootstrapFormLabel
                        }}
                      />
                      {customerList && customerList.length > 0 ? (
                        <>
                          <ul
                            className={classes.listbox}
                            style={{ width: '20%' }}
                          >
                            <li>
                              <Grid container justify="space-between">
                                {customerList.length == 1 &&
                                customerList[0].name == '' ? (
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
                            {customerList.length === 1 &&
                            customerList[0].name === '' ? (
                              <li></li>
                            ) : (
                              <div>
                                {customerList.map((option, index) => (
                                  <li
                                    key={`${index}vendor`}
                                    style={{ padding: 10, cursor: 'pointer' }}
                                    onClick={() => {
                                      handleCustomerClick(option);
                                    }}
                                  >
                                    <Grid container justify="space-between">
                                      <Grid item>
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
                    </div>
                  )}
                  {paymentDetails.customerReceivable ? (
                    <Typography
                      variant="h5"
                      className={[classes.typobal, classes.formMargin]}
                    >
                      BAL: {parseFloat(currentCustomerBalance).toFixed(2)}
                    </Typography>
                  ) : (
                    <Typography
                      variant="h5"
                      className={[classes.baltypo, classes.formMargin]}
                    >
                      BAL: {parseFloat(currentCustomerBalance).toFixed(2)}
                    </Typography>
                  )}
                </div>
              </Grid>

              <Grid item xs={12} sm={12}>
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
                        paymentDetails.paymentType === 'Split'
                          ? 'cash'
                          : paymentDetails.paymentType
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
              </Grid>
            </Grid>
            <Grid item className={classes.contentGrid} xs={12} sm={12} md={6}>
              {!isRestore &&
                !isUpdate &&
                (transaction.paymentIn.prefixSequence.length > 0 ||
                  transaction.paymentIn.subPrefixesList.length > 0) && (
                  <Grid
                    container
                    item
                    xs={12}
                    sm={12}
                    className={classes.flexRow}
                    alignItems="center"
                  >
                    <Typography
                      variant="h6"
                      className={[classes.width50, classes.labelColor]}
                    >
                      Receipt Prefix
                    </Typography>

                    <>
                      {transaction.paymentIn.prefixSequence.length > 0 && (
                        <Select
                          fullWidth
                          value={prefixes}
                          className={classes.multiSelectOption}
                          style={{ fontSize: 'small', marginLeft: '20px' }}
                          inputProps={{
                            name: 'age',
                            id: 'age-simple',
                            className: classes.multiSelectOption
                          }}
                        >
                          <MenuItem value="##">
                            <em>##</em>
                          </MenuItem>
                          {transaction.paymentIn.prefixSequence
                            ? transaction.paymentIn.prefixSequence.map(
                                (e, index) => (
                                  <MenuItem
                                    value={e.prefix}
                                    key={index}
                                    onClick={() => {
                                      setPrefixes(
                                        transaction.paymentIn.prefixSequence[
                                          index
                                        ].prefix
                                      );
                                      setSequencePrefix(
                                        transaction.paymentIn.prefixSequence[
                                          index
                                        ].prefix
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
                      {transaction.paymentIn.subPrefixesList.length > 0 && (
                        <Select
                          fullWidth
                          value={subPrefixes}
                          onChange={handleChangeSubPrefixes}
                          className={classes.multiSelectOption}
                          inputProps={{
                            name: 'age',
                            id: 'age-simple'
                          }}
                          style={{ fontSize: 'small', marginLeft: '20px' }}
                        >
                          <MenuItem value="##">
                            <em>##</em>
                          </MenuItem>
                          {transaction.paymentIn.subPrefixesList
                            ? transaction.paymentIn.subPrefixesList.map(
                                (e, index) => (
                                  <MenuItem value={e} key={index}>
                                    {e}
                                  </MenuItem>
                                )
                              )
                            : ''}
                        </Select>
                      )}
                    </>
                  </Grid>
                )}

              <Grid
                container
                item
                xs={12}
                sm={12}
                className={classes.flexRow}
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  className={[classes.width50, classes.labelColor]}
                >
                  Receipt No
                </Typography>

                <TextField
                  fullWidth
                  value={
                    paymentDetails.sequenceNumber
                      ? paymentDetails.sequenceNumber
                      : 'Auto Generated'
                  }
                  disabled="true"
                ></TextField>

                <InvSeqIcon
                  style={{
                    marginTop: '2px',
                    color: 'grey',
                    cursor: 'pointer',
                    marginLeft: '20px'
                  }}
                  onClick={() => {
                    handlePaymentInNumModalOpen();
                  }}
                />

                <PaymentInManuelSeqNumModal />
              </Grid>

              <Grid
                container
                item
                xs={12}
                sm={12}
                className={classes.flexRow}
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  className={[classes.width50, classes.labelColor]}
                >
                  Date
                </Typography>

                <DatePicker
                  fullWidth
                  variant="inline"
                  format="dd/MM/yyyy"
                  id="date-picker-inline"
                  value={new Date(paymentDetails.date)}
                  onChange={handleDateChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveDataClick(false);
                    }
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>

              <Grid
                container
                item
                xs={12}
                sm={12}
                className={classes.flexRow}
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  className={[classes.width50, classes.labelColor]}
                >
                  Received
                </Typography>

                <TextField
                  fullWidth
                  onChange={(e) => {
                    setPaymentInProperty('received', e.target.value);
                    setPaymentInProperty('total', e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveDataClick(false);
                    }
                  }}
                  value={paymentDetails.received}
                  variant="standard"
                  margin="dense"
                  id="outlined-basic"
                  placeholder="1000"
                  type="number"
                  InputProps={{
                    inputProps: {
                      min: 0
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
                />
              </Grid>

              <Grid
                container
                item
                xs={12}
                sm={12}
                className={classes.flexRow}
                alignItems="center"
              >
                <Typography variant="h6" className={[classes.width50]}>
                  Total
                </Typography>
                <TextField
                  fullWidth
                  className={classes.totalInput}
                  value={paymentDetails.received}
                  InputProps={{
                    disableUnderline: true,
                    className: classes.totaltypo
                  }}
                  margin="dense"
                  type="text"
                />
              </Grid>
            </Grid>
            <Dialog
              fullScreen={fullScreen}
              open={openPaymentInLoadingAlertMessage}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogContent>
                <DialogContentText>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p>
                        Please wait while the Payment In receipt is being
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
              open={openPaymentInErrorAlertMessage}
              onClose={handleClosePaymentInErrorAlertMessage}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogContent>
                <DialogContentText>
                  Something went wrong while saving Payment In receipt. Please
                  try again!!
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClosePaymentInErrorAlertMessage}
                  color="primary"
                  autoFocus
                >
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container className={classes.actGrid}>
            <Grid item xs={12} sm={3}>
              {(paymentLinkTransactions.length > 0 ||
                paymentDetails.linked_amount > 0) &&
                paymentDetails.total > 0 && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={paymentDetails.linkPayment}
                        onChange={(e) => {
                          setLinkPayment();
                        }}
                        name="LinkPayment"
                      />
                    }
                    label={
                      'Link Payment'
                        .concat(' ( ₹')
                        .concat(paymentDetails.linked_amount) + ' )'
                    }
                  />
                )}
            </Grid>

            <Grid item xs={12} sm={9} className={classes.textRight}>
              <Button
                onClick={() => {
                  saveDataClick(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveDataClick(false);
                  }
                }}
                variant="outlined"
                className={classes.actBtn}
              >
                {' '}
                Save
              </Button>
              <Button
                variant="outlined"
                className={classes.actBtn}
                onClick={() => {
                  saveNewDataClick(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveDataClick(false);
                  }
                }}
              >
                {' '}
                Save & New
              </Button>
              {printerList && printerList.length > 0 && (
                <Button
                  onClick={() => {
                    onSaveAndPrintClicked();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSaveAndPrintClicked();
                    }
                  }}
                  variant="contained"
                  className={[classes.actBtn, classes.saveBtn]}
                >
                  {' '}
                  Save & Print
                </Button>
              )}
            </Grid>
          </Grid>
        </DialogActions>

        {openLinkpaymentPage ? (
          <LinkPaymentPaymentIn
            onClose={closeLinkPayment}
            isEditAllowed={true}
          />
        ) : null}

        {openSplitPaymentDetails ? (
          <PaymentInSplitPaymentDetails
            onClose={handleCloseSplitPaymentDetails}
          />
        ) : null}
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openCustomerSelectionAlert}
        onClose={handleAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Please choose Customer/Vendor to make a Payment In entry.
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
        open={openAmountZeroAlert}
        onClose={handleZeroAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>Received amount can't be 0.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleZeroAlertClose} color="primary" autoFocus>
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
export default injectWithObserver(AddnewPayment);
