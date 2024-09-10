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

const Gstr915Report = (props) => {
  const classes = useStyles();

  const store = useStore();


  const GSTR9_15_List = [
      {
          detail:'Total Refund claimed',
          central_tax : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
          interest : '',
          penality : '',
          late_fee : '',
      },
      {
        detail:'Total Refund sanctioned',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        interest : '',
        penality : '',
        late_fee : '',
      },
      {
        detail:'Total Refund rejected',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        interest : '',
        penality : '',
        late_fee : '',
      },
      {
        detail:'Total Refund pending',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        interest : '',
        penality : '',
        late_fee : '',
      },
      {
        detail:'Total demand of taxes',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        interest : '',
        penality : '',
        late_fee : '',
      },
      {
        detail:'Total taxes paid in respect of E above',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        interest : '',
        penality : '',
        late_fee : '',
      },
      {
        detail:'Total demands pending out of E above',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        interest : '',
        penality : '',
        late_fee : '',
      },
     
]

  return (
    <div>
      <div>
        <div className={classes.contPad}>
         <div className={classes.headerFour} >
             <p className={classes.r4}>15</p><p style={{display:'inline'}}>Particulars of Demands and Refunds</p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={2}>Details</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Central Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>State Tax/UT Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Integrated Tax</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Cess</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Interest</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Penality</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Late Fee/Others</Grid>
             </Grid>

             {GSTR9_15_List.map((e,index) => (
                   <Grid container className={classes.contPad}  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                  }}>
                   <Grid item xs={2}>{e.detail}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.central_tax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.state_ut_tax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.integrated_tax}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.cess}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.interest}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.penality}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.late_fee}</Grid>
                   </Grid>
             ))}
         </div>


         
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr915Report);
