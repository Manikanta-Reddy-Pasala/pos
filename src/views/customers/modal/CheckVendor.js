import React from 'react';
import { makeStyles, Dialog, DialogContent } from '@material-ui/core';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles(() => ({
  paper: { maxWidth: '400px' }
}));

const CheckVendorModal = (props) => {
  const classes = useStyles();
  const store = useStore();

  const { openAleadyVendorFoundModel } = toJS(store.CustomerStore);

  const { closeAleadyVendorFoundModel, isChecked } = store.CustomerStore;

  return (
    <Dialog
      open={openAleadyVendorFoundModel}
      onClose={closeAleadyVendorFoundModel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle id="confirm-modal-title"></DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <DialogContentText id="alert-dialog-description">
          The same number is registered as Vendor, Do u want to save it as
          Customer too?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            isChecked(false);
          }}
        >
          No
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            isChecked(true);
          }}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InjectObserver(CheckVendorModal);
