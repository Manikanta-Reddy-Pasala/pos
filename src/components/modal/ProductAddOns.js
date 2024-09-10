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
  Switch,
  Typography,
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
import DeleteIcon from '@material-ui/icons/Delete';
import ProductAddOnsList from './ProductAddOnsList';

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

const ProductAddOns = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { addOnsDialogOpen, addOnsListDialogOpen, choosenAddOnsList,productAddonData,isAddOnsEdit } = toJS(store.ProductStore);
  const { handleAddOnsModalClose, getAddOnsGroup, getAddOns, openAddOnListModal,updateState,removeAddonList,saveAddon,updateAddon,updateOfflineAddOns } =
    store.ProductStore;
  // const { handleAddOnsModalClose, updateState, saveData, updateData } =
  //   store.AddOnsStore;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMesssage, setErrorMessage] = React.useState('');
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);

  useEffect(() => {
    async function fetchData() {
      await getAddOnsGroup();
      await getAddOns();
    }

    fetchData();
  }, []);

  const saveData = () => {
    if(productAddonData.name === ''){
      setErrorMessage('Group name cannot be left blank');
      setOpenErrorMesssageDialog(true);
    }else if(productAddonData.min_choices === ''){
      setErrorMessage('Minimum Choice cannot be left blank');
      setOpenErrorMesssageDialog(true);
    }else if(productAddonData.max_choices === ''){
      setErrorMessage('Maximum Choice cannot be left blank');
      setOpenErrorMesssageDialog(true);
    }else{
      if(isAddOnsEdit){
        updateAddon();
      }else{
        saveAddon(true);
      }
      
    }
  };
  const handleErrorAlertClose = () => {
    setErrorMessage('');
    setOpenErrorMesssageDialog(false);
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={addOnsDialogOpen}
        onClose={handleAddOnsModalClose}
      >
        <DialogTitle id="product-modal-title">
          {/* {isEdit ? 'Edit Group' : 'Add Group'} */}
          Add On
          <IconButton
            aria-label="close"
            onClick={handleAddOnsModalClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <FormControl fullWidth>
                <Typography component="subtitle1">Add On Group Name</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Add On Group Name"
                  value={productAddonData.name}
                  onChange={(e) => {
                    updateState('name', e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <FormControl fullWidth>
                <Typography component="subtitle1">Minimum Choices</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Minimum Choices"
                  value={productAddonData.min_choices}
                  onChange={(e) => {
                    updateState('min_choices', e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <FormControl fullWidth>
                <Typography component="subtitle1">Maximum Choices</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Maximum Choices"
                  value={productAddonData.max_choices}
                  onChange={(e) => {
                    updateState('max_choices', e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <Button
                onClick={openAddOnListModal}
                className={classes.addOnstyle}
              >
                + Add On
              </Button>
              {addOnsListDialogOpen ? <ProductAddOnsList /> : ' '}
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              {(choosenAddOnsList && choosenAddOnsList.length > 0)
                ? choosenAddOnsList.map((option, index) => (
                  <div>
                    <Grid style={{borderBottom:'1px solid #80808040'}} className={classes.addOnlist} container justify="space-between" alignItems="center">
                      <Typography>{option.name}: {option.price}</Typography>
                      <div>
                        <IconButton onClick={() => {
                          removeAddonList(index);
                        }}>
                          <DeleteIcon />
                        </IconButton>
                        <FormControlLabel
                          control={
                            <Switch 
                              checked={!option.offline}
                              onChange={(e) => {
                                updateOfflineAddOns(index, e.target.checked);
                              }}
                            />
                          }
                        />
                      </div>

                    </Grid>
                  </div>))
                :
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  <div style={{ width: '100%', paddingLeft: '5px', textAlign: 'center' }}>
                    No Add Ons to display
                  </div>
                </div>
              }
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={saveData}
          >
            Save
          </Button>
        </DialogActions>
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

export default InjectObserver(ProductAddOns);