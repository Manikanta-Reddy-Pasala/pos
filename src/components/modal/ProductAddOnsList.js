import React, { useEffect, useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  Checkbox,
  IconButton,
  FormControl,
  TextField,
  Typography,
  Paper,
  DialogContentText
} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

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
  },
  w_30: {
    width: '30%',
    display: 'inline-flex',
    marginRight: '10px'
  },
  mb_20: {
    marginBottom: '20px'
  },
  addOnstyle: {
    backgroundColor: '#EF5350',
    color: 'white',
    fontWeight: 'bold',
    width: '100px',
    marginTop: '10px',
    marginBottom: '10px',
  },
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

const ProductAddOnsList = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { addOnsListDialogOpen, addOnsGroupList, addOnsList,choosenAddOnsList } = toJS(store.ProductStore);
  const { handleAddOnsListModalClose,saveAddOnsListModalClose,chooseAddOns } =
    store.ProductStore;
  // const { handleAddOnsModalClose, updateState, saveData, updateData } =
  //   store.AddOnsStore;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMesssage, setErrorMessage] = React.useState('');
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);



  const handleErrorAlertClose = () => {
    setErrorMessage('');
    setOpenErrorMesssageDialog(false);
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'xs'}
        open={addOnsListDialogOpen}
        onClose={handleAddOnsListModalClose}
      >
        <DialogTitle id="product-modal-title">
          {/* {isEdit ? 'Edit Group' : 'Add Group'} */}
          Choose Add On
          <IconButton
            aria-label="close"
            onClick={handleAddOnsListModalClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            {(addOnsGroupList && addOnsGroupList.length > 0)
              ? addOnsGroupList.map((option, index) => (
                <Grid item xs={12} style={{ marginBottom: '10px' }}>
                  <Paper elevation={3} style={{ padding: '20px' }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">{option.groupName}</Typography>
                      <div>
                        {/* <IconButton onClick={() => viewOrEditItem(option)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => deleteAddOnsGroupData(option)}>
                          <DeleteIcon />
                        </IconButton> */}
                      </div>
                    </Grid>

                    {(addOnsList && addOnsList.length > 0)
                      ? addOnsList.map((childoption, index) => (
                        <div>
                          {childoption.groupName === option.groupName && <Grid className={classes.addOnlist} container justifyContent="space-between" alignItems="center">
                            <FormControlLabel
                              control={
                                <Checkbox
                                checked={choosenAddOnsList.findIndex(item => item.additional_property_id === childoption.additionalPropertyId) !== -1}
                                  onChange={(e) => {
                                    chooseAddOns(childoption);
                                  }}
                                />
                              }
                              label={
                                <Typography>
                                  {childoption.name} : {childoption.price}
                                </Typography>
                              }
                            />

                          </Grid>}
                        </div>))
                      :
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '100%', paddingLeft: '5px', textAlign: 'center' }}>
                          No Add Ons to display
                        </div>
                      </div>
                    }
                  </Paper>
                </Grid>
              ))
              :
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                {/* <div style={{ width: '100%', paddingLeft: '5px', textAlign: 'center' }}>
                  No Add On Groups to display
                </div> */}
              </div>
            }
          </Grid>
        </DialogContent>
        {/* <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={saveAddOnsListModalClose}
          >
            Save
          </Button>
        </DialogActions> */}
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openErrorMesssageDialog}
        onClose={handleErrorAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMesssage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(ProductAddOnsList);