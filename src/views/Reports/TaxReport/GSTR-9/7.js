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

const Gstr97Report = (props) => {
  const classes = useStyles();

  const store = useStore();


  const GSTR9_7_List = [
      {
          description:'As per Rule 37',
          central_tax : 0,
          state_ut_tax : 0,
          integrated_tax : 0,
          cess : 0,
      },
      {
        description:'As per Rule 39',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'As per Rule 42',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'As per Rule 43',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'As per section 17(5)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'Reversal of TRAN-I credit',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'Reversal of TRAN-II credit',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'Other reversals (pl. specify)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'Total ITC reversed (A to H above)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'Net ITC Available for Utilization (6O -7I)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      
]

  return (
    <div>
      <div>
        <div className={classes.contPad}>
         <div className={classes.headerFour} >
             <p className={classes.r4}>7</p><p style={{display:'inline'}}>Details of ITC Reversed and Ineligible ITC as declared in rerurns filed during the financial year</p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={4}>Description</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Central Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>State Tax/UT Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Integrated Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Cess</Grid>
             </Grid>

             {GSTR9_7_List.map((e,index) => (
                   <Grid container className={classes.contPad}  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                  }}>
                   <Grid item xs={4}>{e.description}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.central_tax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.state_ut_tax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.integrated_tax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.cess}</Grid>
                   </Grid>
             ))}
         </div>


         
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr97Report);
