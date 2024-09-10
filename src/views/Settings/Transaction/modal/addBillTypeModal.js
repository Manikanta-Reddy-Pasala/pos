import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField
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

const AddBillTypeModal = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;
  const [prefixesVal ,setPrefixesVal] = React.useState('');


  const store = useStore();
  const { openBillTypeModal } = toJS(store.TransactionStore);
  const {
    handleBillTypeModalClose,
    setBillType,
  } = store.TransactionStore;


  return (
    <Dialog
      open={openBillTypeModal}
      onClose={handleBillTypeModalClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="product-modal-title">
        Add Bill Type
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handleBillTypeModalClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item md={12} sm={12} className="grid-padding">
            <FormControl fullWidth>
              <TextField
                fullWidth
                autoFocus
                variant="outlined"
                margin="dense"
                type="text"
                className="customTextField"
                placeholder="Enter Bill Type"
                value={prefixesVal}
                onChange={(event) =>{
                  setPrefixesVal(event.target.value)
                }
                }
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
            setBillType(prefixesVal);
            setPrefixesVal('');
            handleBillTypeModalClose();
          }}
        >
          Save
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default InjectObserver(AddBillTypeModal);
