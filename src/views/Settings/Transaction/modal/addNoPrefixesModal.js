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

const AddNoPrefixesModal = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;
  const [sequenceNoVal, setSequenceNoVal] = React.useState(1);

  const store = useStore();
  const { openNoPrefixesModal } = toJS(store.TransactionStore);
  const { handleNoPrefixesModalClose, saveNoPrefix } = store.TransactionStore;

  useEffect(() => {
    if (openNoPrefixesModal) {
      setSequenceNoVal(1);
    }
  }, [openNoPrefixesModal]);

  return (
    <Dialog
      open={openNoPrefixesModal}
      onClose={handleNoPrefixesModalClose}
      fullWidth={true}
      maxWidth={'md'}
    >
      <DialogTitle id="product-modal-title">
        Add No Prefix Sequence No
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handleNoPrefixesModalClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item md={12} sm={12} className="grid-padding">
            {props.currentNo > 1 && (
              <Typography style={{ fontSize: '16px' }}>
                Current Running No: {props.currentNo}
              </Typography>
            )}

            <div>
              <Typography style={{ fontSize: '13px', marginTop: '16px' }}>
                New Sequence Number
              </Typography>
              <FormControl fullWidth>
                <TextField
                  fullWidth
                  autoFocus
                  variant="outlined"
                  margin="dense"
                  type="number"
                  className="customTextField"
                  placeholder="Enter Sequence No"
                  value={sequenceNoVal}
                  onChange={(event) => {
                    setSequenceNoVal(event.target.value);
                  }}
                />
              </FormControl>
            </div>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            saveNoPrefix(props.property, sequenceNoVal);
            handleNoPrefixesModalClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InjectObserver(AddNoPrefixesModal);