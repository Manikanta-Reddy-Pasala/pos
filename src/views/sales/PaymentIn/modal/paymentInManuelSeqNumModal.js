import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  FormControl,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import { toJS } from 'mobx';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import PaymentInManuelSeqNumCheck from './paymentInManuelSeqNumCheck';

const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '17px'
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

const PaymentInManuelSeqNumModal = (props) => {
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const { openPayInManuelSeqNumModal, manualSequenceNumber } =
    toJS(store.PaymentInStore);

  const {
    handlePaymentInManuelSeqNumModalClose,
    checkPaymentInSequenceNumber,
    setPaymentInManualSequenceNumber
  } = store.PaymentInStore;

  const [isPayInNoManual, setIsPayInNoManual] = useState(false);

  const handleRadioManRAuto = (e) => {
    e.target.value === 'paymentInNumManual'
      ? setIsPayInNoManual(true)
      : setIsPayInNoManual(false);
  };

  return (
    <Dialog
      open={openPayInManuelSeqNumModal}
      onClose={handlePaymentInManuelSeqNumModalClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="product-modal-title" styel={{ color: 'red' }}>
        <span style={{ color: 'red' }}>Payment-In Number</span>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ fontSize: 13 }}>
              Your payment-in numbers are set on auto-generat mode.
            </Typography>
          </Grid>
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ fontSize: 13 }}>
              Are you sure about changing the setting ?
            </Typography>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item md={12} sm={12} className="grid-padding">
            <FormControl fullWidth>
              <RadioGroup
                direction="column"
                name="payInManualRAuto"
                defaultValue="paymentInNumAuotGen"
                onChange={handleRadioManRAuto}
              >
                <FormControlLabel
                  labelPlacement="end"
                  value="paymentInNumAuotGen"
                  control={<Radio size="small" />}
                  label={
                    <Typography style={{ fontSize: 13 }}>
                      Continue auto generating payment-in numbers
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="paymentInNumManual"
                  labelPlacement="end"
                  control={<Radio size="small" />}
                  label={
                    <Typography style={{ fontSize: 13 }}>
                      I will add them manually for the current transaction
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {isPayInNoManual && (
            <>
              <Grid item xs={12} className="grid-padding">
                <Grid container direction="row">
                  <Grid item xs="12" sm={5}>
                    <Typography style={{ fontSize: 13 }}>
                      Payment-In Number
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} className="grid-padding">
                <Grid container direction="row">
                  <Grid item xs="12" sm={5}>
                    <TextField
                      variant={'standard'}
                      margin="dense"
                      value={manualSequenceNumber}
                      onChange={(event) =>
                        setPaymentInManualSequenceNumber(event.target.value)
                      }
                    ></TextField>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <PaymentInManuelSeqNumCheck />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            checkPaymentInSequenceNumber();
          }}
        >
          Save
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            handlePaymentInManuelSeqNumModalClose();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InjectObserver(PaymentInManuelSeqNumModal);