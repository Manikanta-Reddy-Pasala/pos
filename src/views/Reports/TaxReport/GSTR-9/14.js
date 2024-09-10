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

const Gstr914Report = (props) => {
  const classes = useStyles();

  const store = useStore();


  const GSTR9_14_List = [
      {
          description:'Integrated Tax',
          tax_payable : '',
          paid : '',
          
      },
      {
        description:'Central Tax',
        tax_payable : '',
        paid : '',
    
      },
      {
        description:'State/ UT Tax',
        tax_payable : '',
        paid : '',
    
      },
      {
        description:'Cess',
        tax_payable : '',
        paid : '',
    
      },
      {
        description:'Interest',
        tax_payable : '',
        paid : '',
    
      },
           
]

  return (
    <div>
      <div>
        <div className={classes.contPad}>
         <div className={classes.headerFour} >
             <p className={classes.r4}>14</p><p style={{display:'inline'}}>Differential Tax Paid On Account Of Declaration In 10 & 11 Above</p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={6}>Description</Grid>
                 <Grid item xs={3}>Payable</Grid>
                 <Grid item xs={3}>Paid</Grid>
               
             </Grid>

             {GSTR9_14_List.map((e,index) => (
                   <Grid container className={classes.contPad}  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                  }}>
                   <Grid item xs={6}>{e.description}</Grid>
                   <Grid item xs={3} style={{textAlign:'center'}}>{e.tax_payable}</Grid>
                   <Grid item xs={3} style={{textAlign:'center'}}>{e.paid}</Grid>
                  
                   </Grid>
             ))}
         </div>


         
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr914Report);
