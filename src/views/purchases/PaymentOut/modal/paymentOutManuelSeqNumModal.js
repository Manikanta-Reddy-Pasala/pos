import React, {useState}  from 'react';
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
import PaymentOutManuelSeqNumCheck from './paymentOutManuelSeqNumCheck';

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

const PaymentOutManuelSeqNumModal = (props) => {
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const { openPayOutNumModal, manualSequenceNumber} = toJS(store.PaymentOutStore);

  const {
    handlePaymentOutManuelSeqNumModalClose,
    checkPaymentOutSequenceNumber,
    setPaymentOutManualSequenceNumber
  } = store.PaymentOutStore;

  const [isPayOutNoManual, setIsPayOutNoManual] = useState(false);

  const handleRadioManRAuto = (e) => {
    e.target.value === "paymentOutNumManual" ? 
    setIsPayOutNoManual(true) : setIsPayOutNoManual(false);
  }

  return (
    <Dialog
      open={openPayOutNumModal}
      onClose={handlePaymentOutManuelSeqNumModalClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="product-modal-title" styel={{ color: 'red' }}>
        <span style={{ color: 'red' }}>Payment-Out Number</span>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="row" justifyContent="center" alignItems="stretch">
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ fontSize: 13 }}>
              Your payment-out numbers are set on auto-generat mode.
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
               name="payOutManualRAuto"
               defaultValue="paymentOutNumAuotGen"
               onChange={handleRadioManRAuto}
                >
                <FormControlLabel
                  labelPlacement="end"
                  value="paymentOutNumAuotGen"
                  control={<Radio size="small" />}
                  label={
                    <Typography style={{ fontSize: 13 }}>
                      Continue auto generating payment-out numbers
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="paymentOutNumManual"
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
          
          {isPayOutNoManual && (
            <>
              <Grid item xs={12} className="grid-padding">
                <Grid container direction="row">
                  <Grid item xs="12" sm={5}>
                    <Typography style={{ fontSize: 13 }}>
                      Payment-Out Number
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
                        setPaymentOutManualSequenceNumber(event.target.value)
                      }
                    ></TextField>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
          
          <Grid item xs={12}>
            <PaymentOutManuelSeqNumCheck />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            checkPaymentOutSequenceNumber();
          }}
        >
          Save
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            handlePaymentOutManuelSeqNumModalClose();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InjectObserver(PaymentOutManuelSeqNumModal);
