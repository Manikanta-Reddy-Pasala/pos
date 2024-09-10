import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Grid,
  Button,
  withStyles,
  IconButton,
  Typography
} from '@material-ui/core';
import { toJS } from 'mobx';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { Optional } from 'ag-grid-community';

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
  listli:{
  borderBottom : '1px solid #c5c4c4',
  paddingBottom : 10,
  marginBottom : 12,
  background: 'none',
 
  },
  listHeaderBox : {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding : '10px 30px 0px 30px',
  },
  listbox: {
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    padding: '10px 30px 30px 30px',

    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
   
   
  },
  activeClass : {
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

const DialogActions = withStyles((theme) => ({
  root: {
    marginTop: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const PurchaseMultipleBillNoModal = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const [active , setActive] = useState(0);

  const {selectBillNoFromMultipleBillsPopUpForSameVendor} = stores.PurchasesReturnsAddStore;

  const {
    openMultipleBillForSameVendorSelectionPopUp
  } = stores.PurchasesReturnsAddStore;


  useEffect(() => { 
    setActive(0);
    console.log("Opening Multi Bill dialog");

  }, [props]);

  return (
   
      <Dialog
        open={openMultipleBillForSameVendorSelectionPopUp}
        fullWidth={true}
        maxWidth={'md'}
        onClose={function(event) {
          selectBillNoFromMultipleBillsPopUpForSameVendor(props.multiplePurchaseBillsByVendor[0].vendor_bill_number,props.multiplePurchaseBillsByVendor[0].vendor_id,props.multiplePurchaseBillsByVendor[0].bill_number)
        }}
      >
        <DialogTitle id="product-modal-title" style={{textAlign:'center'}}>
          Choose Bill Numbers
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={function(event) {
                selectBillNoFromMultipleBillsPopUpForSameVendor(props.multiplePurchaseBillsByVendor[0].vendor_bill_number,props.multiplePurchaseBillsByVendor[0].vendor_id,props.multiplePurchaseBillsByVendor[0].bill_number)
            }
            }
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>

        <ul className={classes.listHeaderBox}>
            <li className={classes.listli}>
              <Grid container style={{ display: 'flex' }}>
                <Grid item xs={4}>
               
                 <Typography variant="h5">Bill Number</Typography>
                </Grid>
               
                <Grid item xs={4}>
                 <Typography variant="h5">Vendor Name</Typography>
                </Grid>

                <Grid item xs={4}>
                 <Typography variant="h5">Bill Amount</Typography>
                </Grid>
              </Grid>
            </li>
            </ul>
            <ul className={classes.listbox}>
            {props.multiplePurchaseBillsByVendor ? props.multiplePurchaseBillsByVendor.map((option, index) => (
              <li
                style={{ padding: '10px 0 10px 0',cursor: 'pointer' }}
                onClick={function(event) {
                  setActive(index)
                  selectBillNoFromMultipleBillsPopUpForSameVendor(option.vendor_bill_number,option.vendor_id,option.bill_number)
                }}
                className={active == index ? classes.activeClass : ''}
              >
                <Grid
                  container
                  // justify="space-between"
                  style={{ display: 'flex' }}
                  className={classes.listitemGroup}
                >
                  <Grid item xs={4} key={index} >
                    <p>{option.vendor_bill_number}</p>
                  </Grid>
                  <Grid item xs={4} key={index} >
                    <p>{option.vendor_name}</p>
                  </Grid>
                  <Grid item xs={4} key={index} >
                    <p>{option.total_amount}</p>
                  </Grid>
                 
                </Grid>
              </li>
        
         )) : null}
          </ul>

        </DialogContent>
      </Dialog>
   
   
  );
};

export default injectWithObserver(PurchaseMultipleBillNoModal);
