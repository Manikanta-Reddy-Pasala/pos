import React, { useEffect, useState } from 'react';
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
  Snackbar,
  TextField,
  Typography
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
  },
  inputNumber: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
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

function CustomerSupportModal(props) {
  const classes = useStyles();
  const store = useStore();
  const API_SERVER = window.REACT_APP_API_SERVER;
  const [comment, setComment] = React.useState();
  const { customerSupportDialog, handleCustomerSupportCloseDialog } =
    store.BusinessListStore;

  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
    handleCustomerSupportCloseDialog();
  };

  const submitQuery = async () => {
    let name = localStorage.getItem('userName')
      ? localStorage.getItem('userName')
      : '';
    let businessName = localStorage.getItem('businessName')
      ? localStorage.getItem('businessName')
      : '';
    let emailId = localStorage.getItem('emailId')
      ? localStorage.getItem('emailId')
      : '';
    let phoneNumber = localStorage.getItem('mobileNumber')
      ? localStorage.getItem('mobileNumber')
      : '';
    let businessCity = localStorage.getItem('businessCity')
      ? localStorage.getItem('businessCity')
      : '';
    let businessId = localStorage.getItem('businessId')
      ? localStorage.getItem('businessId')
      : '';
    let partnerCity = localStorage.getItem('partnerCity')
      ? localStorage.getItem('partnerCity')
      : '';
    let partnerProfileId = localStorage.getItem('partnerProfileId')
      ? localStorage.getItem('partnerProfileId')
      : '';

    await axios
      .post(`${API_SERVER}/v1/pos/business/postContactUs`, {
        name,
        businessName,
        emailId,
        phoneNumber,
        comment,
        businessCity,
        businessId,
        partnerCity,
        partnerProfileId
      })
      .then((response) => {
        setOpen(true);
        setTimeout(() => {
          handleCustomerSupportCloseDialog();
          setOpen(false);
        }, 500);
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const ButtonMailto = ({ mailto, label }) => {
    return (
      <Link
        to="#"
        onClick={(e) => {
          window.location = mailto;
          e.preventDefault();
        }}
      >
        {label}
      </Link>
    );
  };

  return (
    <div>
      <Dialog
        open={customerSupportDialog}
        onClose={handleCustomerSupportCloseDialog}
        fullWidth
      >
        <DialogTitle id="product-modal-title">
          Post your Query
          <IconButton
            aria-label="close"
            onClick={handleCustomerSupportCloseDialog}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid
            item
            md={12}
            sm={12}
            className="grid-padding"
            style={{ marginTop: '16px' }}
          >

            <FormControl fullWidth >
              <Typography component="subtitle1">Comments</Typography>
              <TextField
                fullWidth
                multiline
                variant="outlined"
                margin="dense"
                type="text"
                rows="10"
                className="customTextField"
                placeholder="Comments"
                value={comment}
                onChange={handleComment}
              />
            </FormControl>
          </Grid>
          <Snackbar
            open={open}
            autoHideDuration={1000}
            onClose={handleClose}
            message="Submitted Succesfully"
          />
        </DialogContent>
        <DialogActions>
          <div style={{ width: '100%', marginLeft: '18px' }}>
          <Typography style={{ fontSize: '14px'}}>
          Customer Support Phone Number{': '}
          {'+91 88846767777'}
        </Typography>
            <ButtonMailto
              label="Customer Support Email Id: contactus@oneshell.in"
              mailto="mailto:contactus@oneshell.in"
            />
          </div>
          <div>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                submitQuery();
              }}
            >
              Okay
            </Button>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InjectObserver(CustomerSupportModal);
