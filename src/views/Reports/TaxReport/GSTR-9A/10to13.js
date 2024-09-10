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

const Gstr9A10to13Report = (props) => {
  const classes = useStyles();

  const store = useStore();


  const GSTR9_1013_List = [
    {
        description:'Supplies / tax (outward) declared through amendments (+) (net of debit notes)',
        turnover : '',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        sheet_validation_error : '',
        gst_portal_vali_error : '',

    },
    {
      description:'Inward supplies liable to reverse charge declared through amendments (+) (net of debit notes)',
      turnover : '',
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      sheet_validation_error : '',
      gst_portal_vali_error : '',
    },
    {
        description:'Supplies / tax (outward) reduced through amendments (-) (net of credit notes)',
        turnover : '',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        sheet_validation_error : '',
        gst_portal_vali_error : '',
      },
      {
        description:'Inward supplies liable to reverse charge reduced through amendments (-) (net of credit notes)',
        turnover : '',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        sheet_validation_error : '',
        gst_portal_vali_error : '',
      },
]



  return (
    <div>
      <div>
        <div className={classes.contPad}>
         <div className={classes.headerFour} >
            <p style={{display:'inline'}}>Particulars of the transactions for the previous FY declared in returns of April to September of current FY or upto date of filing of annual return of previous FY whichever is earlier</p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={3}>Description</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Turnover</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Central Tax</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>State Tax/UT Tax</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Integrated Tax</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Cess</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Sheet Validation Error(s)</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>GST portal validation error(s)</Grid>
             
             </Grid>

             {GSTR9_1013_List.map((e,index) => (
                   <Grid container className={classes.contPad}  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                  }}>
                   <Grid item xs={1}>1{index}</Grid>
                   <Grid item xs={3}>{e.description}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.turnover}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.central_tax}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.state_ut_tax}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.integrated_tax}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.cess}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{e.sheet_validation_error}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{e.gst_portal_vali_error}</Grid>
                
                   </Grid>
             ))}
               <Grid container className={classes.contPad}  >
                   <Grid item xs={1}></Grid>
                   <Grid item xs={3}>Turnover (6C+10-12)</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{''}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{''}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{''}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{''}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{''}</Grid>
                   <Grid item xs={1} style={{textAlign:'center'}}>{''}</Grid>
                   <Grid item xs={2} style={{textAlign:'center'}}>{''}</Grid>
                
                   </Grid>
         </div>


       
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr9A10to13Report);
