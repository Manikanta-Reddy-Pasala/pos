import React, { useState } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  FormControlLabel,
  Box,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  RadioGroup,
  Radio
} from '@material-ui/core';
import Controls from '../../components/controls/index';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import * as Db from '../../RxDb/Database/Database';
const Barcode = require('react-barcode');

const useStyles = makeStyles((theme) => ({

    contPad: {
        padding: '15px 0px 20px 0px'
      },
      headTab: {
        borderTop: '2px solid #cecdcd',
        paddingTop: '8px',
        paddingBottom: '10px',
        borderBottom: '1px solid #cecdcd',
        background: '#F4F4F4',
        fontSize: 'smaller',
        fontWeight: 'bold',
        fontFamily : 'Roboto',
      },
      marl: {
        marginLeft: '5px',
        fontSize:'15px',
        color:'black'
      },
      textAlign: {
        textAlign: 'center'
      },
      setPadding: {
        paddingTop: '10px',
        paddingBottom: '10px',
        textAlign: 'center',
        fontSize: 'smaller',
      },
      textAlignEnd : {
          textAlign : 'end'
      },
      cal:{
          borderTop : '1px solid #abaaaa',
          borderBottom : '1px solid #abaaaa',
          margin : '5px 0px',
          padding : '5px 0px',
      },
      
      
     
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

const barCodes = [];

const ProfitLossDetail = (props) => {
  const classes = useStyles();
  const stores = useStore();

  const [value, setValue] = React.useState('printall');
  const { profitLossDetailDialogOpen ,profitLossDetails} = toJS(stores.SalesAddStore);
  const { handleProfitLossDetailClose } = stores.SalesAddStore;

  const handleBarcodeChange = (event) => {
    setValue(event.target.value);
  };



  return (
    <Dialog
      open={profitLossDetailDialogOpen}
      fullWidth={true}
      maxWidth={'md'}
      onClose={handleProfitLossDetailClose}
    >
      <DialogTitle id="product-modal-title">
        Invoice #{profitLossDetails.invoice_number} {profitLossDetails.customer_name ? '-' : ''} {profitLossDetails.customer_name}
        <IconButton
          aria-label="close"
          className="closeButton"
          onClick={handleProfitLossDetailClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.productModalContent}>
       
      <div className={classes.contPad}>
          <h3 style={{marginBottom:10}}> Cost Calculation</h3>
          <Grid container className={classes.headTab}>
            <Grid item xs={3}>
              <p className={classes.marr}>ITEM NAME</p>
            </Grid>
            <Grid item xs={3} className={classes.textAlign}>
              <p className={classes.marr}>QUANTITY</p>
            </Grid>
            <Grid item xs={3} className={classes.textAlign}>
              <p className={classes.marr}>PURCHASE PRICE</p>
            </Grid>
            <Grid item xs={3} className={classes.textAlign}>
              <p className={classes.marr}>TOTAL COST</p>
            </Grid>
         
          </Grid>
          <div>
          {profitLossDetails.item_list.map((option, index) => (
          <Grid container className={classes.setPadding} key={index} style={{ backgroundColor: (index % 2 === 0) ? '#fff' : '#ecf0f1' }}>
            <Grid item xs={3} style={{textAlign: 'start'}}>
              <p className={classes.marl} key={index}> {option.item_name}</p>
            </Grid>
            <Grid item xs={3} >
              <p className={classes.marl} key={index}> {option.qty}</p>
            </Grid>
            <Grid item xs={3} >
              <p className={classes.marl} key={index}> {option.amount}</p>
            </Grid>
            <Grid item xs={3} >
              <p className={classes.marl} key={index}> {(option.amount*option.qty)}</p>
            </Grid>                     
          </Grid>
          ))}
          </div>


          <Grid container style={{marginTop:20,fontSize:'large'}}>
              <Grid item xs={6}>
                  <p>Sale Amount</p>
              </Grid>
              <Grid item xs={6} className={classes.textAlignEnd}>
                  <p>&#8377; 120</p>
              </Grid>
              <Grid item xs={6}>
                  <p>Total Cost</p>
              </Grid>
              <Grid item xs={6} className={classes.textAlignEnd}>
                  <p>&#8377; 120</p>
              </Grid>
              <Grid item xs={6}>
                  <p>Tax Payable</p>
              </Grid>
              <Grid item xs={6} className={classes.textAlignEnd}>
                  <p>&#8377; 120</p>
              </Grid>

              </Grid>

              <Grid container className={classes.cal}>
              <Grid item xs={6}>
                  <p>Profit(Sale Amount - Total Cost - Tax Payable)</p>
              </Grid>
              <Grid item xs={6} className={classes.textAlignEnd}>
                  <p>&#8377; 120</p>
              </Grid>
              </Grid>

              <Grid container >
              <Grid item xs={6}>
                  <p>Profit(Excluding Additional Charges)</p>
              </Grid>
              <Grid item xs={6} className={classes.textAlignEnd}>
                  <p>&#8377; 120</p>
              </Grid>
          </Grid>
         

    </div>
  

      </DialogContent>
     
    </Dialog>
  );
};

export default ProfitLossDetail;
