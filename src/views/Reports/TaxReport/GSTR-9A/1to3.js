import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Grid } from '@material-ui/core';
import { useStore } from '../../../../Mobx/Helpers/UseStore';

import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },
  textAlign: {
    textAlign: 'center'
  },
  contPad: {
    padding: '10px',
    fontSize:'small'
  },
  header_basic : {
      textAlign: 'center',
      background:'#e3e3e3',
      fontWeight: 'bold',
      paddingTop: '5px',
      paddingBottom: '5px'
  },
  headerFour : {
    textAlign: 'center',
    background:'#e3e3e3',
    fontWeight: 'bold',
    paddingTop: '5px',
    paddingBottom: '5px',
    marginTop:'20px'
  },
  r4:{
      display:'inline-block',
     
      paddingLeft:'10px',
      float:'left',
  },
  fourSubHeader: {
    padding: '10px',
    fontSize:'small',
    marginTop: '20px',
    background:'#e3e3e3'
  }
  
}));

const Gstr1to3Report = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { taxSettingsData } = toJS(store.TaxSettingsStore);


  return (
    <div>
      <div>
        <div className={classes.contPad}>
         <div className={classes.header_basic}>
             <p>Simplified Annual Return for Compounding Taxable Persons</p>
         </div>

         <div>
             <Grid container className={classes.contPad}>
                 <Grid item xs={1}>1</Grid>
                 <Grid item xs={5}>Financial Year</Grid>
                 <Grid item xs={6}>{props.financialYear}</Grid>
             </Grid>
             <Grid container className={classes.contPad} style={{background:'#ECF0F1'}}>
                 <Grid item xs={1}>2</Grid>
                 <Grid item xs={5}>GSTIN</Grid>
                 <Grid item xs={6}>{taxSettingsData.gstin}</Grid>
             </Grid>
             <Grid container className={classes.contPad}>
                 <Grid item xs={1}>3</Grid>
                 <Grid item xs={5}>Name of the Taxable Person</Grid>
                 <Grid item xs={6}>{taxSettingsData.legalName}</Grid>
             </Grid>
           
         </div>
       


         
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr1to3Report);
