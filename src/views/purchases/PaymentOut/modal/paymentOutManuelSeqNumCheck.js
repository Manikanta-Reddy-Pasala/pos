import React from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  IconButton,
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
    // '& .grid-padding': {
    //   paddingLeft: theme.spacing(2),
    //   paddingRight: theme.spacing(2)
    // }
  }
}));

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

const PaymentOutManuelSeqNumCheck = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const { openPayOutSeqNumCheck } = toJS(store.PaymentOutStore);

  const { handlePaymentOutManuelSeqNumCheckClose } = store.PaymentOutStore;

  return (
    <Dialog
      open={openPayOutSeqNumCheck}
      onClose={handlePaymentOutManuelSeqNumCheckClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="product-modal-title">
        <span style={{ color: 'red' }}>Alert</span>
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handlePaymentOutManuelSeqNumCheckClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ fontSize: 13 }}>
              Payment-Out Number Already Exist
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            handlePaymentOutManuelSeqNumCheckClose();
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InjectObserver(PaymentOutManuelSeqNumCheck);
