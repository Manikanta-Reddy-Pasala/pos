import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Grid,
  withStyles,
  IconButton,
  Typography,
  Button
} from '@material-ui/core';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    padding: 'inherit',
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '& .secondary-images': {
        '& button': {
          marginRight: theme.spacing(2)
        }
      }
    }
  },
  '& .grid-select': {
    selectedOption: {
      color: 'red'
    },
    marginLeft: '15px',
    '& .MuiFormControl-root': {
      width: '100%'
    },
    fullWidth: {
      width: '100%'
    }
  },

  itemTable: {
    width: '100%'
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
  },
  listli: {
    borderBottom: '1px solid #c5c4c4',
    paddingBottom: 10,
    marginBottom: 12,
    background: 'none'
  },
  listHeaderBox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 0px 30px'
  },
  listbox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 30px 30px',

    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    }
  },
  activeClass: {
    backgroundColor: '#2977f5',
    color: 'white'
  },
  content: {
    cursor: 'pointer'
  }
}));
const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '22px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const PurchaseOrderAddressListModal = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const [active, setActive] = useState(0);
  const inputRef = useRef([]);

  const { selectAddressFromVendor, handleCloseAddressList} = stores.PurchaseOrderStore;

  const { openAddressList } = toJS(stores.PurchaseOrderStore);

  useEffect(() => {
    setActive(0);
  }, [props]);

  return (
    <Dialog
      open={openAddressList}
      fullWidth={true}
      maxWidth={'md'}
      onClose={function (event) {
        handleCloseAddressList();
      }}
    >
      <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
        Choose Address
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={function (event) {
            handleCloseAddressList();
          }}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
        <ul className={classes.listHeaderBox}>
          <li className={classes.listli}>
            <Grid container style={{ display: 'flex' }}>
              <Grid item xs={3}>
                <Typography variant="h5">Type</Typography>
              </Grid>

              <Grid item xs={3}>
                <Typography variant="h5">Trade Name</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="h5">Address</Typography>
              </Grid>
            </Grid>
          </li>
        </ul>
        <ul className={classes.listbox}>
          {props.addressList
            ? props.addressList.map((option, index) => (
                <li
                  style={{ padding: '10px 0 10px 0', cursor: 'pointer' }}
                  onClick={function (event) {
                    setActive(index);
                    selectAddressFromVendor(index);
                  }}
                  className={active === index ? classes.activeClass : ''}
                  key={index + 'batchno'}
                >
                  <Button
                    key={index + 'btn'}
                    disableRipple
                    style={{
                      width: '100%',
                      textAlign: 'inherit'
                    }}
                    buttonRef={(el) => (inputRef.current[Number(index)] = el)}
                  >
                    <Grid
                      container
                      style={{ display: 'flex' }}
                      className={classes.listitemGroup}
                    >
                      <Grid item xs={3}>
                        <p>{option.type}</p>
                      </Grid>
                      <Grid item xs={3}>
                        <p>{option.tradeName}</p>
                      </Grid>
                      <Grid item xs={6} key={index}>
                        <p>{option.address}</p>
                      </Grid>
                    </Grid>
                  </Button>
                </li>
              ))
            : null}
        </ul>
      </DialogContent>
    </Dialog>
  );
};

export default injectWithObserver(PurchaseOrderAddressListModal);
