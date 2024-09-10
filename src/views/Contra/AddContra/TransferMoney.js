import React, { useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  FormControlLabel,
  Switch,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  Typography,
  MenuItem,
  Select
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import * as Bd from 'src/components/SelectedBusiness';
import * as Db from 'src/RxDb/Database/Database';
import { styled } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  marginSet: {
    marginTop: 'auto'
  },
  datecol: {
    width: '90%',
    marginLeft: '14px'
  },
  inputPad: {
    padding: '3px'
  },
  inputNumber: {
    padding: '3px',
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
    marginTop: '78px',
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
  }
}));

const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '24px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

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

const TransferMoneyModal = () => {
  const classes = useStyles();
  const store = useStore();
  const {
    contraDialogOpen,
    contra,
    splitPaymentSettingsData,
    chosenPaymentType,
    bankAccounts,
    bankAccountsList
  } = toJS(store.ContraStore);
  const { handleContraModalClose } = store.ContraStore;
  const fromList = React.useState([]);
  const toList = React.useState([]);

  const [errorMessage, setErrorMessage] = React.useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = React.useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const payment_mode_list = [
    { val: 'cash', name: 'CASH' },
    { val: 'upi', name: 'UPI' },
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' }
  ];

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  return (
    <div>
      <Dialog
        open={contraDialogOpen}
        onClose={(e) => handleContraModalClose()}
        fullWidth={true}
      >
        <DialogTitle id="product-modal-title">
          <Typography variant="h4"> Transfer Money </Typography>

          <IconButton
            aria-label="close"
            onClick={(e) => handleContraModalClose()}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            {/* <Grid
              item
              md={6}
              sm={12}
              className={('grid-padding', classes.marginSet)}
              style={{ marginTop: '16px' }}
            ></Grid> */}
            <Grid
              item
              md={6}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Amount</Typography>

                <TextField
                  variant={'outlined'}
                  type="text"
                  value={contra.amount}
                  margin="dense"
                  onChange={(event) => {}}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                ></TextField>
              </FormControl>
            </Grid>

            <Grid
              item
              md={6}
              sm={12}
              className={('grid-padding', classes.marginSet)}
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth className={classes.datecol}>
                <Typography variant="subtitle1">Date</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="date"
                  className="customTextField"
                  value={contra.adjustment_date}
                  onChange={(event) => {}}
                  InputProps={{
                    className: classes.inputPad
                  }}
                />
              </FormControl>
            </Grid>
            <Grid
              item
              md={6}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">From</Typography>
                <TextField
                  fullWidth
                  select
                  required
                  variant="outlined"
                  margin="dense"
                  className="customTextField"
                  value={contra.from}
                  onChange={(event) => {}}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                >
                  {bankAccountsList.map((e) => (
                    <MenuItem value={e.accountDisplayName}>{e.accountDisplayName}</MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>
            <Grid
              item
              md={6}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">To</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  className="customTextField"
                  select
                  value={contra.to}
                  onChange={(event) => {}}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                >
                  {bankAccountsList.map((e) => (
                    <MenuItem value={e.accountDisplayName}>{e.accountDisplayName}</MenuItem>
                  ))}
                </TextField>
              </FormControl>
            </Grid>

            <Grid item sm={12}  className="grid-padding"
              style={{ marginTop: '16px' }}>
              <FormControl fullWidth>
                <Typography variant="subtitle1">Payment Type</Typography>
                <Grid
                  item
                  xs={12}
                  style={{
                    paddingTop: '7px',
                    paddingLeft: '0px',
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                >
                  <Grid item xs={4}>
                    <Select
                      displayEmpty
                      disableUnderline
                      value={
                        contra.paymentType === 'Split'
                          ? 'cash'
                          : contra.paymentType
                      }
                      fullWidth
                      style={{ 
                        textAlign: 'center'
                      }}
                      onChange={(e) => {
                        if ('cash' === e.target.value) {
                          //setPaymentType('cash');
                          //setPaymentTypeVal('Cash');
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
                              //setBankAccountData(bankAccount, e.target.value);
                              //setPaymentTypeVal(e.target.value);
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
                              //setChosenPaymentType('Split');
                              //handleOpenReceivePaymentSplitPaymentDetails();
                            } else {
                              //setChosenPaymentType('Cash');
                              //resetSplitPaymentDetails();
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
                        onClick={() => {
                          //handleOpenReceivePaymentSplitPaymentDetails();
                        }}
                        style={{ marginLeft: 20 }}
                        className={classes.deleteIcon}
                      />
                    )}
                  </Grid>
                </Grid>
              </FormControl>
            </Grid>

            
            <Grid
              item
              md={12}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Description</Typography>
                <TextField
                  value={contra.ifsc_code}
                  fullWidth
                  variant="outlined"
                  rows="4"
                  multiline
                  margin="dense"
                  style={{ marginTop: '8px', marginBottom: '4px' }}
                  className="customTextField"
                  onChange={(event) => {}}
                  InputProps={{
                    className: classes.inputPad
                  }}
                ></TextField>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"

            //   onClick={() => {
            //     saveDataAndNewOnClick();
            //   }}
          >
            Save
          </Button>

          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleContraModalClose();
            }}
          >
            Cancel
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

export default InjectObserver(TransferMoneyModal);