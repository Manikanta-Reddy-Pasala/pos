import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles, Grid, FormControl, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import moment from 'moment';

var dateFormat = require('dateformat');
const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#FFFFFF',
    color: '#CCCCCC'
  },
  avatar: {
    width: 60,
    height: 60
  },
  toolbar: {
    minHeight: '20px'
  },
  typography: {
    position: 'absolute',
    paddingRight: 0,
    paddingLeft: '3%',
    fontFamily: 'Nunito Sans Roboto sans-serif',
    color: '#303030',
    fontSize: 12
  },
  text: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    color: '#303030',
    fontSize: 12
  },
  logout: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    color: '#303030',
    fontSize: 12,
    '&:hover': {
      cursor: 'pointer'
    }
  }
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: '400px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(0),
    color: theme.palette.grey[500]
  }
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => onClose()}
        >
          <CancelRoundedIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const PODetails = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { fullWidth, maxWidth } = props;

  const { saleDetails, openPODetails } = toJS(stores.SalesAddStore);
  const { handleClosePODetails, setPONumber, setPODate } = stores.SalesAddStore;

  const savePODetails = async () => {
    handleClosePODetails();
  };

  const handlePODateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setPODate(date);
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={openPODetails}
      onClose={() => handleClosePODetails()}
    >
      <DialogTitle
        id="responsive-dialog-title"
        onClose={() => handleClosePODetails()}
      >
        PO Details
      </DialogTitle>

      <DialogContent>
        <Grid container direction="row" alignItems="stretch">
          <Grid
            item
            md={6}
            sm={12}
            className="grid-padding"
            style={{ marginTop: '16px' }}
          >
            <FormControl fullWidth>
              <Typography component="subtitle1">PO No</Typography>
              <TextField
                variant={'standard'}
                margin="dense"
                value={saleDetails.poInvoiceNo}
                onChange={(e) => {
                  setPONumber(e.target.value);
                }}
              ></TextField>
            </FormControl>
          </Grid>
          <Grid
            item
            md={12}
            sm={12}
            className="grid-padding"
            style={{ marginTop: '16px' }}
          >
            <FormControl fullWidth>
              <Typography component="subtitle1">PO Date</Typography>
              <TextField
                fullWidth
                variant="standard"
                margin="dense"
                type="date"
                className="customTextField"
                id="date-picker-inline"
                value={saleDetails.poDate}
                onChange={(event) => handlePODateChange(event.target.value)}
                style={{ color: '#000000', fontSize: 'small' }}
              />
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => savePODetails()}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PODetails;