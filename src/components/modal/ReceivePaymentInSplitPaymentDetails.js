import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  Grid,
  FormControl,
  TextField,
  MenuItem,
  Select,
  OutlinedInput,
  DialogContentText
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import DeleteIcon from '@material-ui/icons/Delete';

var dateFormat = require('dateformat');
const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#FFFFFF',
    color: '#CCCCCC'
  },
  avatar: {
    width: 60,
    height: 60
  },
  toolbar: {
    minHeight: '20px'
  },
  typography: {
    position: 'absolute',
    paddingRight: 0,
    paddingLeft: '3%',
    fontFamily: 'Nunito Sans Roboto sans-serif',
    color: '#303030',
    fontSize: 12
  },
  text: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    color: '#303030',
    fontSize: 12
  },
  logout: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    color: '#303030',
    fontSize: 12,
    '&:hover': {
      cursor: 'pointer'
    }
  },
  mfgDetailsButton: {
    borderRadius: '4px',
    color: '#FFFFFF',
    marginLeft: '14px',
    padding: '8px 20px 8px 20px',
    backgroundColor: '#4a83fb',
    '&:hover': {
      backgroundColor: '#4a83fb'
    }
  },
  deleteIcon: {
    cursor: 'pointer'
  }
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: '400px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(0),
    color: theme.palette.grey[500]
  }
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => onClose()}
        >
          <CancelRoundedIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const ReceivePaymentInSplitPaymentDetails = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { fullWidth, maxWidth } = props;

  const {
    paymentDetails,
    openReceivePaymentSplitPaymentDetails,
    splitPaymentSettingsData,
    bankAccountsList
  } = toJS(stores.PaymentInStore);
  const {
    handleCloseReceivePaymentSplitPaymentDetails,
    setSplitPayment,
    handleCloseAndResetSplitPaymentDetails,
    addSplitPayment,
    removeSplitPayment
  } = stores.PaymentInStore;

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const saveSplitPaymentDetails = async () => {
    if (getTotalAmount() !== parseFloat(paymentDetails.received)) {
      setErrorAlertProductMessage(
        'Please check the total amount provided. Its not matching the payment in total amount.'
      );
      setErrorAlertProduct(true);
    } else if (checkPaymentModeProvision() === true) {
      setErrorAlertProductMessage(
        'One or more bank or payment modes are missing. Please provide Payment modes to proceed further'
      );
      setErrorAlertProduct(true);
    } else {
      for (let payment of paymentDetails.splitPaymentList) {
        if (
          payment.amount === '' ||
          payment.amount === null ||
          payment.amount === undefined
        ) {
          payment.amount = 0;
        }
      }
      handleCloseReceivePaymentSplitPaymentDetails();
    }
  };

  const bankPaymentModeList = [
    'UPI',
    'Internet Banking',
    'Credit Card',
    'Debit Card',
    'Cheque'
  ];

  const getTotalAmountGiven = () => {
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
    return paymentDetails.received - result;
  };

  const getTotalAmount = () => {
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

  const checkPaymentModeProvision = () => {
    let result = false;
    if (
        paymentDetails.splitPaymentList &&
        paymentDetails.splitPaymentList.length > 0
    ) {
      for (let payment of paymentDetails.splitPaymentList) {
        if (payment.amount > 0 && payment.paymentType !== 'Cash') {
          if (payment.paymentMode === '' || payment.bankAccountId === '') {
            result = true;
            break;
          }
        }
      }
    }
    return result;
  };

  return (
    <Dialog
      open={openReceivePaymentSplitPaymentDetails}
      onClose={handleCloseAndResetSplitPaymentDetails}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        style: {
          maxHeight: '75%',
          height: '75%',
          width: '50%'
        }
      }}
    >
      <DialogTitle
        id="responsive-dialog-title"
        onClose={() => handleCloseAndResetSplitPaymentDetails()}
      >
        <h4>Split Payment Details</h4>
      </DialogTitle>

      <DialogContent>
        <div>
          <div>
            {paymentDetails && paymentDetails.splitPaymentList &&
              paymentDetails.splitPaymentList.length > 0 &&
              paymentDetails.splitPaymentList.map((option, index) => (
                <div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      margin: '12px',
                      overflowY: 'scroll'
                    }}
                  >
                    <div style={{ margin: '5px', width: '20%' }}>
                      <TextField
                        variant={'outlined'}
                        value={option.amount}
                        type="text"
                        label="Amount"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onFocus={(e) =>
                          option.amount === 0
                            ? setSplitPayment('amount', index, '')
                            : ''
                        }
                        onChange={(event) => {
                          setSplitPayment('amount', index, event.target.value);
                        }}
                      />
                    </div>
                    {option.paymentType === 'Bank' ? (
                      <div style={{ margin: '5px', width: '25%' }}>
                        <FormControl fullWidth>
                          <Select
                            displayEmpty
                            label="Bank"
                            size="small"
                            value={
                              option.accountDisplayName
                                ? option.accountDisplayName
                                : 'Select Bank'
                            }
                            fullWidth
                            input={
                              <OutlinedInput
                                style={{ width: '100%', height: '80%' }}
                              />
                            }
                            onChange={(e) => {
                              if (e.target.value !== 'Select Bank') {
                                setSplitPayment(
                                  'accountDisplayName',
                                  index,
                                  e.target.value
                                );

                                let bankAccount = bankAccountsList.find(
                                  (o) => o.accountDisplayName === e.target.value
                                );

                                if (bankAccount) {
                                  setSplitPayment(
                                    'bankAccountId',
                                    index,
                                    bankAccount.id
                                  );
                                }
                              } else {
                                setSplitPayment(
                                  'accountDisplayName',
                                  index,
                                  ''
                                );
                                setSplitPayment('bankAccountId', index, '');
                              }
                            }}
                          >
                            <MenuItem value={'Select Bank'}>
                              {'Select Bank'}
                            </MenuItem>

                            {splitPaymentSettingsData.bankList &&
                              splitPaymentSettingsData.bankList.map(
                                (option, index) => (
                                  <MenuItem
                                    value={option}
                                    onChange={(e) => {
                                      if (e.target.value !== 'Select Bank') {
                                        setSplitPayment(
                                          'accountDisplayName',
                                          index,
                                          e.target.value
                                        );

                                        let bankAccount =
                                          this.bankAccountsList.find(
                                            (o) =>
                                              o.accountDisplayName ===
                                              e.target.value
                                          );

                                        if (bankAccount) {
                                          setSplitPayment(
                                            'bankAccountId',
                                            index,
                                            bankAccount.id
                                          );
                                        }
                                      } else {
                                        setSplitPayment(
                                          'accountDisplayName',
                                          index,
                                          ''
                                        );
                                        setSplitPayment(
                                          'bankAccountId',
                                          index,
                                          ''
                                        );
                                      }
                                    }}
                                  >
                                    {option}
                                  </MenuItem>
                                )
                              )}
                          </Select>
                        </FormControl>
                      </div>
                    ) : (
                      <div style={{ margin: '5px', width: '25%' }}>
                        <TextField
                          variant={'filled'}
                          value={option.paymentType}
                          size="small"
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </div>
                    )}
                    {option.paymentType === 'Bank' && (
                      <div style={{ margin: '5px', width: '25%' }}>
                        <FormControl fullWidth>
                          <Select
                            displayEmpty
                            size="small"
                            label="Payment Mode"
                            value={
                              option.paymentMode
                                ? option.paymentMode
                                : setSplitPayment(
                                    'paymentMode',
                                    index,
                                    bankPaymentModeList[0]
                                  )
                            }
                            fullWidth
                            input={<OutlinedInput style={{ width: '100%' }} />}
                            onChange={(e) => {
                              if (e.target.value !== 'Select') {
                                setSplitPayment(
                                  'paymentMode',
                                  index,
                                  e.target.value
                                );
                              } else {
                                setSplitPayment('paymentMode', index, '');
                              }
                            }}
                          >
                            {bankPaymentModeList.map((option, index) => (
                              <MenuItem
                                value={option}
                                onChange={(e) => {
                                  if (e.target.value !== 'Select') {
                                    setSplitPayment(
                                      'paymentMode',
                                      index,
                                      e.target.value
                                    );
                                  } else {
                                    setSplitPayment('paymentMode', index, '');
                                  }
                                }}
                              >
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                    {option.paymentType === 'Gift Card' && (
                      <div style={{ margin: '5px', width: '25%' }}>
                        <FormControl fullWidth>
                          <Select
                            displayEmpty
                            label="Payment Mode"
                            size="small"
                            value={
                              option.paymentMode
                                ? option.paymentMode
                                : setSplitPayment(
                                    'paymentMode',
                                    index,
                                    splitPaymentSettingsData.giftCardList[0]
                                  )
                            }
                            fullWidth
                            input={
                              <OutlinedInput
                                style={{ width: '100%', height: '80%' }}
                              />
                            }
                            onChange={(e) => {
                              if (e.target.value !== 'Select') {
                                setSplitPayment(
                                  'paymentMode',
                                  index,
                                  e.target.value
                                );
                              } else {
                                setSplitPayment('paymentMode', index, '');
                              }
                            }}
                          >
                            {splitPaymentSettingsData.giftCardList.map(
                              (option, index) => (
                                <MenuItem value={option}>{option}</MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                    {option.paymentType === 'Custom Finance' && (
                      <div style={{ margin: '5px', width: '25%' }}>
                        <FormControl fullWidth>
                          <Select
                            displayEmpty
                            label="Payment Mode"
                            size="small"
                            value={
                              option.paymentMode
                                ? option.paymentMode
                                : setSplitPayment(
                                    'paymentMode',
                                    index,
                                    splitPaymentSettingsData
                                      .customFinanceList[0]
                                  )
                            }
                            fullWidth
                            input={
                              <OutlinedInput
                                style={{ width: '100%', height: '80%' }}
                              />
                            }
                            onChange={(e) => {
                              if (e.target.value !== 'Select') {
                                setSplitPayment(
                                  'paymentMode',
                                  index,
                                  e.target.value
                                );
                              } else {
                                setSplitPayment('paymentMode', index, '');
                              }
                            }}
                          >
                            {splitPaymentSettingsData.customFinanceList.map(
                              (option, index) => (
                                <MenuItem value={option}>{option}</MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                    {option.paymentType !== 'Cash' && (
                      <div style={{ margin: '5px', width: '20%' }}>
                        <TextField
                          variant={'outlined'}
                          value={option.referenceNumber}
                          type="text"
                          label="Reference Number"
                          InputLabelProps={{
                            shrink: true
                          }}
                          onChange={(event) => {
                            setSplitPayment(
                              'referenceNumber',
                              index,
                              event.target.value
                            );
                          }}
                        />
                      </div>
                    )}
                    {option.paymentType === 'Bank' && (
                      <DeleteIcon
                        onClick={() => removeSplitPayment(index)}
                        style={{ marginTop: 16 }}
                        className={classes.deleteIcon}
                      />
                    )}
                  </div>
                </div>
              ))}
            <Button
              text="+ Add Bank"
              size="small"
              variant="contained"
              color="secondary"
              className={classes.mfgDetailsButton}
              onClick={() => {
                addSplitPayment('Bank');
              }}
            >
              + Add Bank
            </Button>
          </div>
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
        </div>
      </DialogContent>
      <DialogActions>
        <div>
          <b style={{ marginRight: '20px' }}>
            TOTAL: {paymentDetails.received}
          </b>
          <b style={{ marginRight: '20px' }}>
            BALANCE: {getTotalAmountGiven()}
          </b>
          <Button
            text="Manufacture"
            size="small"
            variant="contained"
            color="secondary"
            className={classes.mfgDetailsButton}
            onClick={() => {
              saveSplitPaymentDetails();
            }}
          >
            Save
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};

export default ReceivePaymentInSplitPaymentDetails;