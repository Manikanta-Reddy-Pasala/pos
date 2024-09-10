import React from 'react';
import { Dialog, DialogContent, makeStyles } from '@material-ui/core';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles(() => ({
  paper: { maxWidth: '400px' }
}));

const CheckCustomerModal = (props) => {
  const store = useStore();

  const { openAleadyCustomerFoundModel } = toJS(store.VendorStore);
  const classes = useStyles();

  const { closeAleadyCustomerFoundModel, isChecked } = store.VendorStore;

  return (
    <Dialog
      open={openAleadyCustomerFoundModel}
      onClose={closeAleadyCustomerFoundModel}
      maxWidth="sm"
      classes={{ paper: classes.paper }}
    >
      <DialogTitle id="confirm-modal-title"></DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          The same number is registered as Customer, Do u want to save it as
          Vendor too?
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

export default InjectObserver(CheckCustomerModal);
