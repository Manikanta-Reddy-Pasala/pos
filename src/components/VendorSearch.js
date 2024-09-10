import React, { useState } from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { makeStyles } from '@material-ui/core/styles';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import { Button, Grid, TextField } from '@material-ui/core';
import Arrowtopright from '../icons/Arrowtopright';
import Arrowbottomleft from '../icons/Arrowbottomleft';
import VendorModal from '../views/Vendors/modal/AddVendor';

const useStyles = makeStyles((theme) => ({
  label: {
    display: 'inline'
  },
  input: {
    width: '100%',
    marginTop : '12px',
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
  container: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(3)
  },

  bootstrapRoot: {
    padding: 5,
    'label + &': {
      marginTop: theme.spacing(3)
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
  },
  root: {
    margin: 0,
    padding: theme.spacing(2)
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
}));

function VendorSearch(props) {

  const store = useStore();
  const { handleVendorModalOpen } = store.VendorStore;
  const { vendorDialogOpen } = toJS(store.VendorStore);
  const { billDetails } = toJS(store.PurchasesAddStore);
  const { paymentDetails, setcurrentBalance } = toJS(store.PaymentOutStore);
  const { setVendor, setVendorName } = store.PurchasesAddStore;
  const { returnDetails } = toJS(store.PurchasesReturnsAddStore);
  const { singleBatchData } = toJS(store.ProductStore);
  const { setBatchVendor, setBatchVendorName } = store.ProductStore;
  const { setPurchasesReturnVendor, setPurchasesReturnVendorName } =
    store.PurchasesReturnsAddStore;
  const { setpaymentOutVendor, setPaymentOutVendorName } =
    store.PaymentOutStore;

  const classes = useStyles();

  const updateState = (e, value, reason) => {
    console.log('updateState', e.target.value);

    if (props.id === 'paymentOut') {
      setpaymentOutVendor(value);
    }
    if (props.id === 'purchase') {
      setVendor(value);
    }
    if (props.id === 'purchaseReturns') {
      setPurchasesReturnVendor(value);
    }

    if (props.id === 'batch') {
      setBatchVendor(value);
    }
  };

  const handleOnInputChange = (e) => {
    if (!e) {
      return;
    }
    console.log('handleOnInputChange', e.target.value);

    if (props.id === 'paymentOut') {
      setPaymentOutVendorName(e.target.value);
    }
    if (props.id === 'purchase') {
      setVendorName(e.target.value);
    }
    if (props.id === 'purchaseReturns') {
      setPurchasesReturnVendorName(e.target.value);
    }

    if (props.id === 'batch') {
      setBatchVendorName(e.target.value);
    }
  };
  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    id: props.id,
    options: props.list.length > 0 ? props.list : [{name:'',balanceType:'',balance:0}],
    onChange: updateState,
    inputValue:
      props.id === 'paymentOut'
        ? paymentDetails.vendorName
        : props.id === 'purchase'
        ? billDetails.vendor_name
        : props.id === 'purchaseReturns'
        ? returnDetails.vendor_name
        : props.id === 'batch'
        ? singleBatchData.vendorName
        : billDetails.vendor_name,
    onInputChange: handleOnInputChange,
    getOptionLabel: (option) => option.name
  });

  const handleAddVendor = () => {
    handleVendorModalOpen();
  };

  return (
    <div>
      <div {...getRootProps()}>
        {props.id === 'batch' ? (
          <TextField
            fullWidth
            required
            margin="dense"
            variant="outlined"
            InputProps={{
              disableUnderline: true
            }}
            InputLabelProps={{
              shrink: true,
              className: classes.bootstrapFormLabel
            }}
            {...getInputProps()}
          />
        ) : (
          <TextField
            fullWidth
            placeholder="Select vendor *"
            required
            className={classes.input}
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
            {...getInputProps()}
          />
        )}
      </div>
      {groupedOptions.length > 0 ? (
        <>
          <ul
            className={classes.listbox}
            {...getListboxProps()}
            style={{ width: props.id == 'batch' ? '100%' : '18%' }}
          >
            <li>
              <Grid container justify="space-between">
                <Grid item>
                  {props.id != 'batch' && props.id != 'vendorReport' && (
                    <Button
                      size="small"
                      style={{ position: 'relative', fontSize: 12 }}
                      color="secondary"
                      onClick={handleAddVendor}
                    >
                      + Add vendor
                    </Button>
                  )}
                </Grid>
                {groupedOptions.length == 1 && groupedOptions[0].name=='' ? (
                <Grid item></Grid>
                ) :
                <Grid item>
                  <Button
                    size="small"
                    style={{ position: 'relative', fontSize: 12 }}
                  >
                    Balance
                  </Button>
                </Grid> 
                }
              </Grid>
            </li>
            {groupedOptions.length == 1 && groupedOptions[0].name=='' ? (
              <li></li>
            ) : (
              <div>
            {groupedOptions.map((option, index) => (
              <li
                {...getOptionProps({ option, index })}
                key={`${index}vendor`}
                style={{ padding: 10 }}
              >
                <Grid container justify="space-between">
                  <Grid item>{option.name}</Grid>
                  <Grid item>
                    {' '}
                    <span>{parseFloat(option.balance).toFixed(2)}</span>
                    {option.balance > 0 ? (
                      option.balanceType === 'Payable' ? (
                        <Arrowtopright fontSize="inherit" />
                      ) : (
                        <Arrowbottomleft fontSize="inherit" />
                      )
                    ) : (
                      ''
                    )}
                  </Grid>
                </Grid>
              </li>
            ))}
             </div>
            )}
          </ul>
        </>
      ) : null}
      <VendorModal open={vendorDialogOpen} />
    </div>
  );
}

export default injectWithObserver(VendorSearch);
