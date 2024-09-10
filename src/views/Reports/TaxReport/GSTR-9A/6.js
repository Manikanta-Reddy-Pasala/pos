import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Grid } from '@material-ui/core';
import { useStore } from '../../../../Mobx/Helpers/UseStore';

import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';


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

const Gstr96Report = (props) => {
  const classes = useStyles();

  const store = useStore();


  return (
    <div>
      <div>
        <div className={classes.contPad}>
         <div className={classes.headerFour} >
             <p className={classes.r4}>6</p><p style={{display:'inline'}}>Details of outward supplies made during financial year</p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={3}>Description</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Turnover</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Rate of Tax(%)</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Central Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>State Tax/UT Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Sheet Validation Error(s)</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>GST portal validation error(s)</Grid>
             </Grid>
             <Grid container className={classes.contPad}>
                 <Grid item xs={3}>Taxable</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>1</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={3}></Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>1</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={3}></Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>1</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={3}></Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>1</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
             </Grid>

             <Grid container className={classes.contPad} style={{background:'#ecf0f1'}}>
                 <Grid item xs={3}>Exempted, Nil Rated</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
            </Grid>
            <Grid container className={classes.contPad} >
                 <Grid item xs={3}>Total</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>0</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
            </Grid>

          
             
         </div>


         
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr96Report);
