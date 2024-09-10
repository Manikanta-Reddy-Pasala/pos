/* eslint-disable no-use-before-define */
import React from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { makeStyles } from '@material-ui/core/styles';
import injectWithObserver from '../Mobx/Helpers/injectWithObserver';
import { useStore } from '../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import { Button, Grid, TextField } from '@material-ui/core';
import Arrowtopright from '../icons/Arrowtopright';
import Arrowbottomleft from '../icons/Arrowbottomleft';
import CustomerModal from '../views/customers/modal/AddCustomer';
import { getCustomerName } from 'src/names/constants';

const useStyles = makeStyles((theme) => ({
  label: {
    display: 'inline'
  },
  input: {
    width: '100%'
  },
  listbox: {
    width: '18%',
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
    padding: '10px 12px',
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

function CustomerSearch(props) {
  const store = useStore();
  const { handleCustomerModalOpen } = store.CustomerStore;
  const { customerDialogOpen } = toJS(store.CustomerStore);
  const { saleDetails } = toJS(store.SalesAddStore);
  const { paymentDetails } = toJS(store.PaymentInStore);
  const { setcurrentBalance } = store.PaymentInStore;
  const { setCustomer, setCustomerName } = store.SalesAddStore;

  const { returnDetails } = toJS(store.ReturnsAddStore);
  const { setSalesReturnCustomer, setSalesReturnCustomerName } =
    store.ReturnsAddStore;
  const { setpaymentInCustomer, setPaymentInCustomerName } =
    store.PaymentInStore;

  const classes = useStyles();

  const updateState = (e, value, reason) => {
    if (!value) {
      return;
    }
    if (props.id === 'paymentIn') {
      setpaymentInCustomer(value);
    }
    if (props.id === 'salesReturn') {
      setSalesReturnCustomer(value);
    } else {
      setCustomer(value);
    }
    setcurrentBalance(value);
  };

  const handleOnInputChange = (e) => {
    if (!e) {
      return;
    }
    console.log(e);

    if (props.id === 'paymentIn') {
      setPaymentInCustomerName(e.target.value);
    }
    if (props.id === 'salesReturn') {
      setSalesReturnCustomerName(e.target.value);
    } else {
      setCustomerName(e.target.value);
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
    options:
      props.list.length > 0
        ? props.list
        : [{ name: '', balanceType: '', balance: 0 }],
    onChange: updateState,
    inputValue:
      props.id === 'paymentIn'
        ? paymentDetails.customerName
        : props.id === 'salesReturn'
        ? returnDetails.customer_name
        : saleDetails.customer_name,
    onInputChange: handleOnInputChange,
    getOptionLabel: (option) => option.name
  });

  const handleAddCustomer = () => {
    handleCustomerModalOpen();
  };

  return (
    <div>
      <div {...getRootProps()}>
        <TextField
          fullWidth
          placeholder="Select customer*"
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
      </div>

      {groupedOptions.length > 0 ? (
        <>
          <ul className={classes.listbox} {...getListboxProps()}>
            <li>
              <Grid container justifyContent="space-between">
                <Grid item>
                  {props.id !== 'customerReport' && (
                    <Button
                      size="small"
                      style={{ position: 'relative', fontSize: 12 }}
                      color="secondary"
                      onClick={handleAddCustomer}
                    >
                      + {'Add ' + getCustomerName()}
                    </Button>
                  )}
                </Grid>
                {groupedOptions.length == 1 && groupedOptions[0].name == '' ? (
                  <Grid item></Grid>
                ) : (
                  <Grid item>
                    <Button
                      size="small"
                      style={{ position: 'relative', fontSize: 12 }}
                    >
                      Balance
                    </Button>
                  </Grid>
                )}
              </Grid>
            </li>
            {groupedOptions.length === 1 && groupedOptions[0].name === '' ? (
              <li></li>
            ) : (
              <div>
                {groupedOptions.map((option, index) => (
                  <li
                    style={{ padding: 10 }}
                    {...getOptionProps({ option, index })}
                    key={`${index}customer`}
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
      <CustomerModal open={customerDialogOpen} />
    </div>
  );
}

export default injectWithObserver(CustomerSearch);
