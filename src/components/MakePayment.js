import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Cancel } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import * as moment from 'moment';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import * as Bd from '../components/SelectedBusiness';

import {
  makeStyles,
  FormControlLabel,
  MenuItem,
  Select,
  IconButton,
  Grid,
  Switch
} from '@material-ui/core';
import { useStore } from '../Mobx/Helpers/UseStore';
import * as Db from '../RxDb/Database/Database';
import injectWithObserver from '..//Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import DatePicker from './controls/DatePicker';
import PaymentOutManuelSeqNumModal from 'src/views/purchases/PaymentOut/modal/paymentOutManuelSeqNumModal';
import SaveAndPrintReceiptToPrint from '../views/Printers/ComponentsToPrint/SavePrint/receiptSave';
import InvSeqIcon from '@material-ui/icons/EditOutlined';
import Loader from 'react-js-loader';
import EditIcon from '@material-ui/icons/Edit';
import { styled } from '@material-ui/styles';
import MakePaymentSplitPaymentDetails from './modal/MakePaymentSplitPaymentDetails';

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
    width: '70%'
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
  typovendor: {
    color: 'black',
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
    marginBottom: '20px'
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
    marginRight: '10rem'
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

const MakePayment = (props) => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [vendorList, setVendorList] = React.useState();
  const store = useStore();

  const { OpenLinkpaymentPage } = toJS(store.SaleslinkPayment);
  const { openLinkPayment, closeLinkPayment } = store.SaleslinkPayment;
  const {
    paymentDetails,
    OpenMakePayment,
    currentVendorBalance,
    printPaymentOutData: printData,
    printPaymentOutBalance: printBalance,
    openPaymentOutLoadingAlertMessage,
    openPaymentOutErrorAlertMessage,
    openMakePaymentSplitPaymentDetails,
    chosenPaymentType,
    splitPaymentSettingsData
  } = toJS(store.PaymentOutStore);

  const {
    setPaymentType,
    setPaymentMode,
    savePaymentData,
    setReceiptNo,
    setPaymentDate,
    closeDialog,
    setPaid,
    setTotal,
    setLinkPayment,
    closeMakePaymentDialog,
    setBankAccountData,
    setPaymentOutInvoiceRegular,
    setPaymentOutInvoiceThermal,
    setPaymentReferenceNumber,
    setSequencePrefix,
    setSequenceSubPrefix,
    handlePaymentOutManuelSeqNumModalOpen,
    closeDialogForSaveAndPrint,
    handleClosePaymentOutErrorAlertMessage,
    handleOpenPaymentOutLoadingMessage,
    setSplitPaymentSettingsData,
    setBankAccountList,
    handleCloseMakePaymentSplitPaymentDetails,
    handleOpenMakePaymentSplitPaymentDetails,
    setChosenPaymentType,
    resetSplitPaymentDetails
  } = store.PaymentOutStore;

  const { transaction } = toJS(store.TransactionStore);
  const { getTransactionData } = store.TransactionStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openAmountAlert, setAmountAlert] = React.useState(false);
  const [openAmountZeroAlert, setAmountZeroAlert] = React.useState(false);
  const [bankAccounts, setBankAccounts] = React.useState([]);

  const [isStartPrint, setIsStartPrint] = React.useState(false);

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);

  const [printerList, setPrinterList] = React.useState([]);

  const [prefixes, setPrefixes] = React.useState('##');
  const [subPrefixes, setSubPrefixes] = React.useState('##');

  const [printFinalData, setPrintFinalData] = React.useState();
  const [printFinalBalanceData, setPrintFinalBalanceData] = React.useState();
  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);

  const [payment_type_val, setPaymentTypeVal] = React.useState('');
  const { getSplitPaymentSettingdetails } = store.SplitPaymentSettingsStore;

  const payment_mode_list = [
    { val: 'cash', name: 'CASH' },
    { val: 'upi', name: 'UPI' },
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' }
  ];

  const [errorMessage, setErrorMessage] = React.useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = React.useState(false);

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const handlePrintAlertClose = () => {
    // console.log('Calling print alert close');
    setPrintSelectionAlert(false);
    // setPrintFinalData(null);
    // setPrintFinalBalanceData(null);
    closeDialogForSaveAndPrint();
  };

  useEffect(() => {
    async function fetchData() {
      await getTransactionData();
    }

    fetchData();
  }, [getTransactionData]);

  const handleChangeSubPrefixes = (e) => {
    setSubPrefixes(e.target.value);
    setSequenceSubPrefix(e.target.value);
  };

  const handleAlertClose = () => {
    setAmountAlert(false);
  };

  const handleZeroAlertClose = () => {
    setAmountZeroAlert(false);
  };

  const checkPaidAmountStatus = () => {
    if (paymentDetails.paid === '') {
      setAmountZeroAlert(true);
    } else if (paymentDetails.paid === '0') {
      setAmountZeroAlert(true);
    } else if (
      parseFloat(paymentDetails.balanceToPay) < parseFloat(paymentDetails.paid)
    ) {
      setAmountAlert(true);
    } else {
      setPrefixes('##');
      setSubPrefixes('##');

      handleOpenPaymentOutLoadingMessage();
      savePaymentData();
    }
  };

  const onPrintClicked = async () => {
    if (paymentDetails.paid === '') {
      setAmountZeroAlert(true);
    } else if (paymentDetails.paid === '0') {
      setAmountZeroAlert(true);
    } else if (paymentDetails.balanceToPay < paymentDetails.paid) {
      setAmountAlert(true);
    } else {
      setPrefixes('##');
      setSubPrefixes('##');

      setPaymentOutInvoiceRegular(invoiceRegular);
      setPaymentOutInvoiceThermal(invoiceThermal);

      handleOpenPaymentOutLoadingMessage();
      savePaymentData(false, true);
    }
  };

  const handleDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setPaymentDate(date);
  };

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

  useEffect(() => {
    if (printData && printData.receiptNumber) {
      setPrintFinalData(printData);

      setPrintFinalBalanceData(printBalance);
      if (printBalance) {
        console.log('Receipt Print data:' + printBalance.totalBalance);
      }

      setIsStartPrint(true);
      setPrintSelectionAlert(true);

      setTimeout(() => {
        handlePrintAlertClose();
      }, 500);
    }
  }, [printData]);

  useEffect(() => {
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

  const [payment_type_list, setPaymentTypeList] = React.useState([]);

  return (
    <div>
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        fullWidth="true"
        maxWidth={'lg'}
        open={OpenMakePayment}
        onClose={closeMakePaymentDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle
          className={classes.dialogTitleRoot}
          disableTypography
          id="alert-dialog-title"
        >
          <Typography variant="h4">Payment Out</Typography>
          <div>
            {/* <IconButton>
              <Calculator fontSize="inherit" onClick={handleClose} />
            </IconButton> */}
            <IconButton>
              <Cancel
                fontSize="inherit"
                onClick={() => {
                  closeMakePaymentDialog();
                }}
              />
            </IconButton>
          </div>
        </DialogTitle>

        <DialogContent>
          <Grid container>
            <Grid item className={classes.contentGrid} xs={12} sm={6}>
              <Grid item xs={12} sm={12}>
                <div>
                  <Typography
                    variant="h5"
                    className={[classes.typovendor, classes.formMargin]}
                  >
                    Customer/Vendor : {paymentDetails.vendorName}
                  </Typography>
                  {/* {paymentDetails.customerReceivable ? (
                    <Typography
                      variant="h5"
                      className={[classes.typobal, classes.formMargin]}
                    >
                      BAL : {paymentDetails.balanceToPay}
                    </Typography>
                  ) : ( */}
                  <Typography
                    variant="h5"
                    className={[classes.baltypo, classes.formMargin]}
                  >
                    BAL : {paymentDetails.balanceToPay}
                  </Typography>
                  {/* )} */}
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
                              handleOpenMakePaymentSplitPaymentDetails();
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
                      component="subtitle1"
                      className={classes.fntClr}
                    >
                      Split Payment
                    </Typography>
                    {chosenPaymentType === 'Split' && (
                      <EditIcon
                        onClick={() =>
                          handleOpenMakePaymentSplitPaymentDetails()
                        }
                        style={{ marginLeft: 20 }}
                        className={classes.deleteIcon}
                      />
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item className={classes.contentGrid} xs={12} sm={6}>
              {(transaction.paymentOut.prefixSequence.length > 0 ||
                transaction.paymentOut.subPrefixesList.length > 0) && (
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

                  {transaction.paymentOut.prefixSequence.length > 0 && (
                    <Select
                      value={prefixes}
                      className={classes.multiSelectOption}
                      style={{ fontSize: 'small' }}
                      inputProps={{
                        name: 'age',
                        id: 'age-simple',
                        className: classes.multiSelectOption
                      }}
                    >
                      <MenuItem value="##">
                        <em>##</em>
                      </MenuItem>
                      {transaction.paymentOut.prefixSequence
                        ? transaction.paymentOut.prefixSequence.map(
                            (e, index) => (
                              <MenuItem
                                value={e.prefix}
                                key={index}
                                onClick={() => {
                                  setPrefixes(
                                    transaction.paymentOut.prefixSequence[index]
                                      .prefix
                                  );
                                  setSequencePrefix(
                                    transaction.paymentOut.prefixSequence[index]
                                      .prefix
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
                  {transaction.paymentOut.subPrefixesList.length > 0 && (
                    <Select
                      value={subPrefixes}
                      onChange={handleChangeSubPrefixes}
                      className={classes.multiSelectOption}
                      inputProps={{
                        name: 'age',
                        id: 'age-simple'
                      }}
                      style={{ fontSize: 'small' }}
                    >
                      <MenuItem value="##">
                        <em>##</em>
                      </MenuItem>
                      {transaction.paymentOut.subPrefixesList
                        ? transaction.paymentOut.subPrefixesList.map(
                            (e, index) => (
                              <MenuItem value={e} key={index}>
                                {e}
                              </MenuItem>
                            )
                          )
                        : ''}
                    </Select>
                  )}
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

                <>
                  <TextField
                    fullWidth
                    placeholder="Auto Generated"
                    disabled="true"
                  ></TextField>
                </>

                <InvSeqIcon
                  style={{
                    marginTop: '2px',
                    color: 'grey',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    handlePaymentOutManuelSeqNumModalOpen();
                  }}
                />
                <PaymentOutManuelSeqNumModal />
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
                  variant="inline"
                  format="dd/MM/yyyy"
                  id="date-picker-inline"
                  value={new Date(paymentDetails.date)}
                  onChange={handleDateChange}
                />
                {/* <DatePickerBasic onChange={(value) => setFormValues('date', value)}
                                    value={formData?.date} /> */}
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
                  Paid
                </Typography>
                <TextField
                  fullWidth
                  className={classes.textRightWrap}
                  onChange={(e) => setPaid(e.target.value)}
                  value={paymentDetails.paid}
                  variant="outlined"
                  margin="dense"
                  id="outlined-basic"
                  placeholder="Paid"
                  type="text"
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
                {/* <Typography variant='h5' className={classes.totaltypo}>{setTotal}</Typography> */}
                <TextField
                  fullWidth
                  className={[classes.textRightWrap, classes.totalInput]}
                  onChange={(e) => setTotal(e.target.value)}
                  value={paymentDetails.paid}
                  InputProps={{
                    disableUnderline: true,
                    className: classes.totaltypo
                  }}
                  margin="dense"
                  type="text"
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container className={classes.actGrid}>
            <Grid item xs={12} sm={12} className={classes.textRight}>
              {printerList && printerList.length > 0 && (
                <Button
                  onClick={() => {
                    onPrintClicked();
                  }}
                  variant="outlined"
                  className={classes.actBtn}
                >
                  {' '}
                  Save & Print
                </Button>
              )}
              <Button
                onClick={() => {
                  checkPaidAmountStatus();
                }}
                variant="contained"
                className={[classes.actBtn, classes.saveBtn]}
              >
                {' '}
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
        <Dialog
          fullScreen={fullScreen}
          open={openAmountAlert}
          onClose={handleAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Paid amount can't be more than the balance amount
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAlertClose} color="primary" autoFocus>
              Ok
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
            <DialogContentText>Paid amount can't be 0.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleZeroAlertClose} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        <MakePaymentSplitPaymentDetails
          open={openMakePaymentSplitPaymentDetails}
          onClose={handleCloseMakePaymentSplitPaymentDetails}
        />
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openPaymentOutLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>
                  Please wait while the Payment Out receipt is being created!!!
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
        open={openPaymentOutErrorAlertMessage}
        onClose={handleClosePaymentOutErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Payment Out receipt. Please try
            again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePaymentOutErrorAlertMessage}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPrintSelectionAlert}
        onClose={handleAlertClose}
        aria-labelledby="responsive-dialog-title"
        style={{ display: 'none' }}
      >
        <DialogContent>
          <DialogContentText>
            <SaveAndPrintReceiptToPrint
              data={printFinalData}
              printMe={isStartPrint}
              isThermal={invoiceThermal.boolDefault}
              balanceData={printFinalBalanceData}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose} color="primary" autoFocus>
            PROCEED TO PRINT
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default injectWithObserver(MakePayment);
