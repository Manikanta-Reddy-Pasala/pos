import React, { useState } from 'react';
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
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';

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
  listbox: {
    margin: 5,
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
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

const AddAddOns = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { addOns, addOnsDialogOpen, isEdit } = toJS(store.AddOnsStore);
  const {
    handleAddOnsModalClose,
    updateState,
    saveData,
    updateData,
    setProductData
  } = store.AddOnsStore;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMesssage, setErrorMessage] = React.useState('');
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);
  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);
  const [productName, setProductName] = React.useState('');

  const handleErrorAlertClose = () => {
    setErrorMessage('');
    setOpenErrorMesssageDialog(false);
  };

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
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
          {isEdit ? 'Edit Group' : 'Add Group'}
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
                <Typography component="subtitle1">Add On Name</Typography>
                <div>
                  <TextField
                    fullWidth
                    className={classes.input}
                    placeholder="Select Product"                  
                    value={productName ? productName : addOns.name}
                    InputProps={{
                      disableUnderline: true,
                      classes: {
                        root: classes.bootstrapRoot,
                        input: classes.bootstrapInput
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      className: classes.bootstrapFormLabel
                    }}
                    onChange={(e) => {
                      if (e.target.value !== productName) {
                        setProductName('');
                        setProductData();
                      }

                      setProductName(e.target.value);
                      getProductList(e.target.value);
                    }}
                  />{' '}
                  {productlist.length > 0 ? (
                    <>
                      <ul
                        className={classes.listbox}
                        style={{ width: '80%', zIndex: '5' }}
                      >
                        {productlist.map((option, index) => (
                          <li
                            style={{ padding: 10, cursor: 'pointer' }}
                            onClick={() => {
                              setproductlist([]);
                              setProductNameWhileEditing('');
                              setProductName(option.name);
                              setProductData(option);
                            }}
                          >
                            <Grid
                              container
                              // justify="space-between"
                              style={{ display: 'flex' }}
                            >
                              <Grid item xs={12}>
                                <p>{option.name}</p>
                              </Grid>
                            </Grid>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : null}
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <FormControl fullWidth>
                <Typography component="subtitle1">Price</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Price"
                  value={addOns.price}
                  onChange={(e) => {
                    updateState('price', e.target.value);
                  }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={addOns.taxIncluded}
                    onChange={(e) => {
                      updateState('taxIncluded', e.target.checked);
                    }}
                  />
                }
                label="Is Tax Included in Sale Product MRP"
              />
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <Typography component="subtitle1">Type</Typography>
              <FormControl style={{ marginLeft: '10%' }} component="fieldset">
                <Select
                  value={addOns.type}
                  onChange={(e) => {
                    updateState('type', e.target.value);
                  }}
                >
                  <MenuItem value={'NA'}>NA</MenuItem>
                  <MenuItem value={'Veg'}>Veg</MenuItem>
                  <MenuItem value={'Non Veg'}>Non Veg</MenuItem>
                  <MenuItem value={'Egg'}>Egg</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <div className={classes.w_30}>
                <FormControl fullWidth>
                  <Typography component="subtitle1">CGST %</Typography>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    placeholder="Enter CGST %"
                    value={addOns.cgst}
                    onChange={(e) => {
                      updateState('cgst', e.target.value);
                    }}
                  />
                </FormControl>
              </div>
              <div className={classes.w_30}>
                <FormControl fullWidth>
                  <Typography component="subtitle1">SGST %</Typography>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    placeholder="Enter SGST %"
                    value={addOns.sgst}
                    onChange={(e) => {
                      updateState('sgst', e.target.value);
                    }}
                  />
                </FormControl>
              </div>
              <div className={classes.w_30}>
                <FormControl fullWidth>
                  <Typography component="subtitle1">IGST %</Typography>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    placeholder="Enter IGST %"
                    value={addOns.igst}
                    onChange={(e) => {
                      updateState('igst', e.target.value);
                    }}
                  />
                </FormControl>
              </div>
            </Grid>
            <Grid item xs={12} className={`grid-padding ${classes.mb_20}`}>
              <FormControl fullWidth>
                <Typography component="subtitle1">Cess (In Rupees)</Typography>
                <TextField
                  fullWidth
                  required
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  placeholder="Enter Cess in Rupees"
                  value={addOns.cess}
                  onChange={(e) => {
                    updateState('cess', e.target.value);
                  }}
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
              if (addOns.groupName === '') {
                setErrorMessage('Group name cannot be left blank');
                setOpenErrorMesssageDialog(true);
              } else if (addOns.productId === '') {
                setErrorMessage(
                  'Random product cannot be added. Please add as Inventory item and choose from the list.'
                );
                setOpenErrorMesssageDialog(true);
              } else {
                if (isEdit) {
                  updateData();
                } else {
                  saveData();
                }
              }
            }}
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

export default InjectObserver(AddAddOns);