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

const Gstr910to13Report = (props) => {
  const classes = useStyles();

  const store = useStore();


  const GSTR9_10_List = [
      {
          description:'Supplies/tax declared through Amendments (+) (net of debit notes)',
          central_tax : '',
          tax_payable : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
      },
      {
        description:'Supplies/tax reduced through Amendments (+) (net of credit notes)',
        central_tax : '',
        tax_payable : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
      },
      {
        description:'Reversal of ITC availed during previous financial year',
        central_tax : '',
        tax_payable : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
      },
      {
        description:'ITC availed for the previous financial year',
        central_tax : '',
        tax_payable : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
      },
      
]

  return (
    <div>
      <div>
        <div className={classes.contPad}>
         <div className={classes.headerFour} >
             <p style={{display:'inline'}}>Particulars Of The Transactions For The Previous FY Declared In Returns Of April To September Of Current FY Or Upto Date Of Filing Of Annual Return Of Previous FY Whichever Is </p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={1}></Grid>
                 <Grid item xs={4}>Description</Grid>
                 <Grid item xs={2}>Tax Payable</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Central Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>State Tax/UT Tax</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Integrated Tax</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Cess</Grid>
             </Grid>

             {GSTR9_10_List.map((e,index) => (
                   <Grid container className={classes.contPad}  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                  }}>
                   <Grid item xs={1}>1{index}</Grid>
                   <Grid item xs={4}>{e.description}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.tax_payable}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.central_tax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.state_ut_tax}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.integrated_tax}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.cess}</Grid>
                   </Grid>
             ))}
         </div>


         
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr910to13Report);
