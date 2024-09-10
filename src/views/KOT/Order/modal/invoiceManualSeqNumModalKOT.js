import React from 'react';
import {
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

import { toJS } from 'mobx';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import InvoiceManualSeqNumCheck from './invoiceManualSeqNumCheckKOT';
import { useState } from 'react';

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

const InvoiceManuelSeqNumModal = (props) => {
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const { openInvoiceNumModal /* , saleDetails */ } = toJS(store.KotStore);

  const {
    handleInvoiceNumModalClose /* ,
    checkSaleSequenceNumber,
    setSaleSequenceNumber */
  } = store.KotStore;

  const [isInvoiceManual, setIsInvoiceManual] = useState(false);

  const handleRadioManRAuto = (e) => {
    e.target.value === 'invoiceNumManual'
      ? setIsInvoiceManual(true)
      : setIsInvoiceManual(false);
  };

  return (
    <Dialog
      open={openInvoiceNumModal}
      onClose={handleInvoiceNumModalClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="product-modal-title" styel={{ color: 'red' }}>
        <span style={{ color: 'red' }}>Invoice Number</span>
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handleInvoiceNumModalClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Grid container direction="row" justifyContent="center" alignItems="stretch">
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ fontSize: 13 }}>
              Your invoice numbers are set on auto-generat mode.
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
                name="invoiceManualRAuto"
                defaultValue="invoiceNumAuotGen"
                onChange={handleRadioManRAuto}
              >
                <FormControlLabel
                  labelPlacement="end"
                  value="invoiceNumAuotGen"
                  control={<Radio size="small" />}
                  label={
                    <Typography style={{ fontSize: 13 }}>
                      Continue auto generating invoice numbers
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="invoiceNumManual"
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

          {isInvoiceManual && (
            <>
              <Grid item xs={12} className="grid-padding">
                <Grid container direction="row">
                  <Grid item xs="12" sm={5}>
                    <Typography style={{ fontSize: 13 }}>
                      Invoice Number
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
                      /* value={saleDetails.sequenceNumber}
                      onChange={(event) =>
                        setSaleSequenceNumber(event.target.value)
                      } */
                    ></TextField>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <InvoiceManualSeqNumCheck />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          /*  onClick={() => {
            checkSaleSequenceNumber();
          }} */
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InjectObserver(InvoiceManuelSeqNumModal);
