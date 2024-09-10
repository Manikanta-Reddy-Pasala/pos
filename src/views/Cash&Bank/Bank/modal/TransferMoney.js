import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  FormControlLabel,
  Radio,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  Checkbox,
  TextField,
  Typography,
  Select,
  MenuItem,
  RadioGroup
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import * as Bd from '../../../../components/SelectedBusiness';
import * as Db from '../../../../RxDb/Database/Database';

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

const TransferMoneyModal = (props) => {
  const classes = useStyles();
  const store = useStore();
  const { fullWidth, maxWidth } = props;
  const { transferDialogOpen, transferMoneyData } = toJS(
    store.BankAccountsStore
  );
  const { handleTransferMoneyDialog, setTransferAmountProperty } =
    store.BankAccountsStore;
  const [cashType, setCashType] = useState('addCash');
  const fromList = React.useState([]);
  const toList = React.useState([]);
  const [bankList, setBankList] = React.useState([]);

  useEffect(() => {
    async function fetchData() {
      getBankAccounts();
    }

    fetchData();
  }, []);

  const getBankAccounts = async () => {
    const db = await Db.get();
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

      let bankAccountDataList = data.map((item) => {
        let bankAccount = {};

        bankAccount.accountDisplayName = item.accountDisplayName;
        bankAccount.balance = item.balance;
        bankAccount.id = item.id;

        return bankAccount;
      });

      if (bankAccountDataList && bankAccountDataList.length > 0) {
        setBankList(bankAccountDataList);
      }
    });
  };

  return (
    <div>
      <Dialog
        open={transferDialogOpen}
        onClose={(e) => handleTransferMoneyDialog(false)}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="product-modal-title">
          <Typography variant="h4"> {props.transferMoney.name}</Typography>

          <IconButton
            aria-label="close"
            onClick={(e) => handleTransferMoneyDialog(false)}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          {props.transferMoney.val === 'adjust' ? (
            <Grid container direction="row" alignItems="stretch">
              <Grid item md={6} sm={12} className="grid-padding">
                <FormControl fullWidth>
                  <Typography variant="subtitle1">Account Name</Typography>
                  <TextField
                    fullWidth
                    select
                    required
                    variant="outlined"
                    margin="dense"
                    className="customTextField"
                    value={transferMoneyData.from}
                    onChange={(event) =>
                      setTransferAmountProperty(
                        'from',
                        event.target.value.toString()
                      )
                    }
                    InputProps={{
                      className: classes.inputNumber
                    }}
                  >
                    {fromList.map((e) => (
                      <MenuItem value={e}>{e}</MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>

              <Grid item md={6} sm={12} className="grid-padding">
                <FormControl fullWidth>
                  <Typography variant="subtitle1">Amount</Typography>

                  <TextField
                    variant={'outlined'}
                    type="text"
                    value={transferMoneyData.amount}
                    margin="dense"
                    onChange={(event) =>
                      setTransferAmountProperty('amount', event.target.value)
                    }
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
                  <Typography variant="subtitle1">Adjustment Date</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    type="date"
                    className="customTextField"
                    value={transferMoneyData.adjustment_date}
                    onChange={(event) =>
                      setTransferAmountProperty(
                        'adjustment_date',
                        event.target.value
                      )
                    }
                    InputProps={{
                      className: classes.inputPad
                    }}
                  />
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
                    value={transferMoneyData.ifsc_code}
                    fullWidth
                    variant="outlined"
                    rows="4"
                    multiline
                    margin="dense"
                    style={{ marginTop: '8px', marginBottom: '4px' }}
                    className="customTextField"
                    onChange={(event) =>
                      setTransferAmountProperty('ifsc_code', event.target.value)
                    }
                    InputProps={{
                      className: classes.inputPad
                    }}
                  ></TextField>
                </FormControl>
              </Grid>
            </Grid>
          ) : (
            <Grid container direction="row" alignItems="stretch">
              <Grid item xs={12} className="grid-padding">
                <RadioGroup
                  aria-label="quiz"
                  name="quiz"
                  value={cashType}
                  onChange={(event) => setCashType(event.target.value)}
                >
                  <div>
                    <FormControlLabel
                      value="deposit"
                      control={<Radio />}
                      label="Deposit"
                    />
                    <FormControlLabel
                      value="withdraw"
                      control={<Radio />}
                      label="Withdraw"
                    />
                  </div>
                </RadioGroup>
              </Grid>
              <Grid item md={6} sm={12} className="grid-padding">
                <FormControl fullWidth>
                  <Typography variant="subtitle1">From</Typography>
                  <TextField
                    fullWidth
                    select
                    required
                    variant="outlined"
                    margin="dense"
                    className="customTextField"
                    value={transferMoneyData.from}
                    onChange={(event) =>
                      setTransferAmountProperty(
                        'from',
                        event.target.value.toString()
                      )
                    }
                    InputProps={{
                      className: classes.inputNumber
                    }}
                  >
                    {fromList.map((e) => (
                      <MenuItem value={e}>{e}</MenuItem>
                    ))}
                  </TextField>
                </FormControl>
              </Grid>
              <Grid item md={6} sm={12} className="grid-padding">
                <FormControl fullWidth>
                  <Typography variant="subtitle1">To</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    className="customTextField"
                    select
                    value={transferMoneyData.to}
                    onChange={(event) => {
                      setTransferAmountProperty('to', event.target.value);
                    }}
                    InputProps={{
                      className: classes.inputNumber
                    }}
                  >
                    {toList.map((e) => (
                      <MenuItem value={e}>{e}</MenuItem>
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
                  <Typography variant="subtitle1">Amount</Typography>

                  <TextField
                    variant={'outlined'}
                    type="text"
                    value={transferMoneyData.amount}
                    margin="dense"
                    onChange={(event) =>
                      setTransferAmountProperty('amount', event.target.value)
                    }
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
                  <Typography variant="subtitle1">Adjustment Date</Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    type="date"
                    className="customTextField"
                    value={transferMoneyData.adjustment_date}
                    onChange={(event) =>
                      setTransferAmountProperty(
                        'adjustment_date',
                        event.target.value
                      )
                    }
                    InputProps={{
                      className: classes.inputPad
                    }}
                  />
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
                    value={transferMoneyData.ifsc_code}
                    fullWidth
                    variant="outlined"
                    rows="4"
                    multiline
                    margin="dense"
                    style={{ marginTop: '8px', marginBottom: '4px' }}
                    className="customTextField"
                    onChange={(event) =>
                      setTransferAmountProperty('ifsc_code', event.target.value)
                    }
                    InputProps={{
                      className: classes.inputPad
                    }}
                  ></TextField>
                </FormControl>
              </Grid>
            </Grid>
          )}
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
              handleTransferMoneyDialog(false);
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(TransferMoneyModal);