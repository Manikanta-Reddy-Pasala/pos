import React from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  Typography
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';

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

const AddBankAccountModal = (props) => {
  const classes = useStyles();
  const store = useStore();

  const { fullWidth, maxWidth } = props;
  const { bankDialogOpen, bankAccountData, isEdit } = toJS(
    store.BankAccountsStore
  );
  const { handleCloseDialog, setBankAccountProperty, saveData } =
    store.BankAccountsStore;

  return (
    <div>
      <Dialog
        open={bankDialogOpen}
        onClose={handleCloseDialog}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="product-modal-title">
          {isEdit ? 'Edit Bank Account' : 'Add Bank Account'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item md={6} sm={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography variant="subtitle1">
                  Account Display Name
                </Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  value={bankAccountData.accountDisplayName}
                  onChange={(event) =>
                    setBankAccountProperty(
                      'accountDisplayName',
                      event.target.value.toString()
                    )
                  }
                  InputProps={{
                    className: classes.inputPad
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item md={6} sm={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography variant="subtitle1">Opening Balance</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  className="customTextField"
                  value={bankAccountData.balance}
                  onChange={(event) => {
                    setBankAccountProperty('balance', event.target.value);
                  }}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                />
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
                <Typography variant="subtitle1">As of Date</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="date"
                  className="customTextField"
                  value={bankAccountData.asOfDate}
                  onChange={(event) =>
                    setBankAccountProperty('asOfDate', event.target.value)
                  }
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
                <Typography variant="subtitle1">Account Number</Typography>

                <TextField
                  variant={'outlined'}
                  value={bankAccountData.accountNumber}
                  margin="dense"
                  onChange={(event) =>
                    setBankAccountProperty('accountNumber', event.target.value)
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
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">IFSC Code</Typography>
                <TextField
                  value={bankAccountData.ifscCode}
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  style={{ marginTop: '8px', marginBottom: '4px' }}
                  className="customTextField"
                  onChange={(event) =>
                    setBankAccountProperty('ifscCode', event.target.value)
                  }
                  InputProps={{
                    className: classes.inputPad
                  }}
                ></TextField>
              </FormControl>
            </Grid>
            {/*
            <Grid
              item
              md={6}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">UPI ID for QR Code</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  value={bankAccountData.upiIdForQrCode}
                  onChange={(event) =>
                    setBankAccountProperty('upiIdForQrCode', event.target.value)
                  }
                  InputProps={{
                    className: classes.inputPad
                  }}
                />
              </FormControl>
            </Grid>
                */}

            <Grid
              item
              md={6}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Bank Name</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  value={bankAccountData.bankName}
                  onChange={(event) =>
                    setBankAccountProperty('bankName', event.target.value)
                  }
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
                <Typography variant="subtitle1">Account Holder Name</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  value={bankAccountData.accountHolderName}
                  onChange={(event) =>
                    setBankAccountProperty(
                      'accountHolderName',
                      event.target.value
                    )
                  }
                  InputProps={{
                    className: classes.inputPad
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              saveData();
            }}
          >
            Save
          </Button>

          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleCloseDialog();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(AddBankAccountModal);
