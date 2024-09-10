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

const Gstr98Report = (props) => {
  const classes = useStyles();

  const store = useStore();


  const GSTR9_8_List = [
      {
          description:'AITC as per GSTR-2A (Table 3 & 5 thereof)',
          central_tax : 0,
          state_ut_tax : 0,
          integrated_tax : 0,
          cess : 0,
      },
      {
        description:'ITC as per sum total of 6(B) and 6(H) above',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'ITC on inward supplies (other than imports and inward supplies liable to reverse charge but includes services received from SEZs) received during 2017-18 but availed during April to September, 2018',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'Difference [A-(B+C)]',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'ITC available but not availed (out of D)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'ITC available but ineligible (out of D)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'IGST paid on import of goods (as per 6(E) above)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'IGST credit availed on import of goods (as per 6(E) above)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'Difference (G -H)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'ITC available but not availed on import of goods (Equal to I)',
        central_tax : 0,
        state_ut_tax : 0,
        integrated_tax : 0,
        cess : 0,
      },
      {
        description:'Total ITC to be lapsed in current financial year (E+F+J)',
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
             <p className={classes.r4}>8</p><p style={{display:'inline'}}>Other ITC related information</p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={4}>Description</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Central Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>State Tax/UT Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Integrated Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Cess</Grid>
             </Grid>

             {GSTR9_8_List.map((e,index) => (
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

export default InjectObserver(Gstr98Report);
