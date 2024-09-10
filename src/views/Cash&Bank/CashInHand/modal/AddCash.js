import React, { useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  FormControlLabel,
  Radio,
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
import RadioGroup from '@material-ui/core/RadioGroup';
import { toJS } from 'mobx';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import DialogContentText from '@material-ui/core/DialogContentText';
import * as moment from 'moment';

var dateFormat = require('dateformat');

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

const AddCashModal = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const { cash, cashDialogOpen } = toJS(store.CashStore);

  const {
    handleCashModalClose,
    saveData,
    setCashInHandAmount,
    setCashInHandDate,
    setCashInHandDescription,
    isEdit,
    updateData,
    setCashInHandCashType
  } = store.CashStore;

  const [openAmountBlankAlert, setAmountBlankAlert] = useState(false);
  const [openDateBlankAlert, setDateBlankAlert] = useState(false);

  const handleAmountBlankAlertClose = () => {
    setAmountBlankAlert(false);
  };

  const handleDateBlankAlertClose = () => {
    setDateBlankAlert(false);
  };

  const saveDataOnClick = () => {
    if (cash.amount === '') {
      setAmountBlankAlert(true);
    } else if (cash.date === '') {
      setDateBlankAlert(true);
    } else {
      if (isEdit) {
        updateData();
      } else {
        saveData();
      }
    }
  };

  const handleDateChange = (date) => {
    console.log('handleDateChange');
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setCashInHandDate(date);
  };

  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };
  const checkCloseDialog = () => {
    if (
      isEdit ||
      (cash.amount === '' && cash.description === '' && cash.date === '')
    ) {
      handleCashModalClose();
    } else {
      setCloseDialogAlert(true);
    }
  };

  return (
    <div>
      <Dialog
        open={cashDialogOpen}
        onClose={checkCloseDialog}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="product-modal-title">
          Add Cash Adjustment
          <IconButton
            aria-label="close"
            onClick={checkCloseDialog}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item md={12} sm={12} className="grid-padding">
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={cash.cashType}
                onChange={(event) => setCashInHandCashType(event.target.value)}
              >
                <div>
                  <FormControlLabel
                    value="addCash"
                    control={<Radio />}
                    label="Add Cash"
                  />
                  <FormControlLabel
                    value="reduceCash"
                    control={<Radio />}
                    label="Reduce Cash"
                  />
                </div>
              </RadioGroup>
            </Grid>
            <Grid
              item
              md={6}
              sm={12}
              className={('grid-padding', classes.marginSet)}
            >
              <FormControl fullWidth className={classes.datecol}>
                <Typography variant="subtitle1">Adjustment Date</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="date"
                  className="customTextField"
                  value={cash.date}
                  onChange={(event) => handleDateChange(event.target.value)}
                />
              </FormControl>
            </Grid>

            <Grid item md={6} sm={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography variant="subtitle1">Amount</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  className="customTextField"
                  value={cash.amount}
                  onChange={(event) => setCashInHandAmount(event.target.value)}
                />
              </FormControl>
            </Grid>

            <Grid item md={12} sm={12} className="grid-padding">
              <FormControl fullWidth>
                <Typography variant="subtitle1">Description</Typography>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  margin="dense"
                  type="text"
                  rows="5"
                  className="customTextField"
                  value={cash.description}
                  onChange={(event) =>
                    setCashInHandDescription(event.target.value)
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
            disabled={false}
            onClick={() => {
              saveDataOnClick();
            }}
          >
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openAmountBlankAlert}
        onClose={handleAmountBlankAlertClose}
        maxWidth="sm"
        classes={{ paper: classes.paper }}
      >
        <DialogTitle id="confirm-modal-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Amount cannot be left blank.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleAmountBlankAlertClose();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        // fullScreen={fullScreen}
        open={openCloseDialog}
        onClose={handleCloseDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Cash Adjustment will not be saved, Do you want to close?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseDialogClose();
              handleCashModalClose();
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button onClick={handleCloseDialogClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDateBlankAlert}
        onClose={handleDateBlankAlertClose}
        maxWidth="sm"
        classes={{ paper: classes.paper }}
      >
        <DialogTitle id="confirm-modal-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Date cannot be left blank.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleDateBlankAlertClose();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(AddCashModal);
