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

const AddPrefixesModal = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;
  const [prefixesVal, setPrefixesVal] = React.useState('');
  const [sequenceNoVal, setSequenceNoVal] = React.useState(1);

  const store = useStore();
  const { openPrefixesModal, transaction } = toJS(store.TransactionStore);
  const {
    handlePrefixesModalClose,
    savePrefixe,
    saveSubPrefix
  } = store.TransactionStore;
  const [prefixNotSetMsg, setPrefixNotSetMsg] = useState('');

  useEffect(() => {
    if (openPrefixesModal) {
      setPrefixesVal('');
      setSequenceNoVal(1);
      setPrefixNotSetMsg('');
    }
  }, [openPrefixesModal]);

  const isPrefixAvailable = (type, value) => {
    let isAvailable = false;

    if ('sales' === type) {
      if (
        transaction.sales.prefixSequence &&
        transaction.sales.prefixSequence.length > 0
      ) {
        for (let item of transaction.sales.prefixSequence) {
          if (value === item.prefix) {
            isAvailable = true;
            break;
          }
        }
      }
    } else if ('salesReturn' === type) {
      if (
        transaction.salesReturn.prefixSequence &&
        transaction.salesReturn.prefixSequence.length > 0
      ) {
        for (let item of transaction.salesReturn.prefixSequence) {
          if (value === item.prefix) {
            isAvailable = true;
            break;
          }
        }
      }
    } else if ('paymentIn' === type) {
      if (
        transaction.paymentIn.prefixSequence &&
        transaction.paymentIn.prefixSequence.length > 0
      ) {
        for (let item of transaction.paymentIn.prefixSequence) {
          if (value === item.prefix) {
            isAvailable = true;
            break;
          }
        }
      }
    } else if ('paymentOut' === type) {
      if (
        transaction.paymentOut.prefixSequence &&
        transaction.paymentOut.prefixSequence.length > 0
      ) {
        for (let item of transaction.paymentOut.prefixSequence) {
          if (value === item.prefix) {
            isAvailable = true;
            break;
          }
        }
      }
    }

    return isAvailable;
  };


  return (
  
    <Dialog
      open={openPrefixesModal && props.title !== ''}
      onClose={handlePrefixesModalClose}
      fullWidth={true}
      maxWidth={'md'}
    >
      <DialogTitle id="product-modal-title">
        Add {props.title}
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handlePrefixesModalClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <Grid container direction="row" justify="center" alignItems="stretch">
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ fontSize: '13px' }}>{props.title}</Typography>
            <FormControl fullWidth>
              <TextField
                fullWidth
                autoFocus
                variant="outlined"
                margin="dense"
                type="text"
                className="customTextField"
                placeholder="Enter Prefix/ Sub Prefix"
                error={prefixNotSetMsg !== ''}
                helperText={prefixNotSetMsg !== '' ? prefixNotSetMsg : ''}
                value={prefixesVal}
                onChange={(event) => {
                  setPrefixesVal(event.target.value);
                  setPrefixNotSetMsg('');
                }}
              />
            </FormControl>
            {props.title === 'Prefix' && (
              <div>
                <Typography style={{ fontSize: '13px', marginTop: '16px' }}>
                  Sequence Number
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
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            if (props.title === 'Prefix') {
              if (prefixesVal === '') {
                setPrefixNotSetMsg('Prefix name not provided');
                return;
              }
              
              if (isPrefixAvailable(props.property, prefixesVal)) {
                setPrefixNotSetMsg(
                  'Sorry, prefix name already available. Please provide different name'
                );
                return;
              }
            }

            if (props.title === 'Prefix') {
              savePrefixe(
                props.property,
                props.subProperty,
                prefixesVal,
                sequenceNoVal
              );
              setPrefixesVal('');
              setSequenceNoVal(1);
            } else {
              saveSubPrefix(props.property, props.subProperty, prefixesVal);
              setPrefixesVal('');
            }
            handlePrefixesModalClose();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
   
)};

export default InjectObserver(AddPrefixesModal);