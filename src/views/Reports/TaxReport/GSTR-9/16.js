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
  },
  pd:{
    padding: '10px',textAlign:'center',background:'#F5F5F5'
  }
  
}));

const Gstr916Report = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { getPurchasesGSTR916Data ,setDataLoaded ,getPurchase16Data} = store.GSTR9Store;
  const { dataLoaded} = toJS(store.GSTR9Store);
  const [GSTR916List ,setGSTR916List] = React.useState([]);

  React.useEffect(() =>{
    async function fetchData() {
     await getPurchasesGSTR916Data();
     setDataLoaded(16)
    }
    fetchData();
   },[getPurchasesGSTR916Data, setDataLoaded]);


   React.useEffect(() => {
     
    getPurchase16Data().then((res) => {
      console.log(res)
      const GSTR9_16_List = [
        {
            details:'Supplies received from composition taxpayers',
            central_tax : '',
            tax_payable : res.totalAmount,
            state_ut_tax : '',
            integrated_tax : '',
            cess : '',
        },
        {
          details:'Deemed supply under section 143',
          central_tax : '',
          tax_payable : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
        },
        {
          details:'	Goods sent on approval basis but not returned',
          central_tax : '',
          tax_payable : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
        },
      
  ]
  setGSTR916List(GSTR9_16_List);
    })

   },[dataLoaded,getPurchase16Data])




  return (
    <div>
      <div>
        <div className={classes.contPad}>
         <div className={classes.headerFour} >
         <p className={classes.r4}>16</p><p style={{display:'inline'}}>Information On Supplies Received From Composition Taxpayers, Deemed Supply Under Section 143 And Goods Sent On Approval Basis </p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
               
                 <Grid item xs={4}>Details</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Taxable value</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Central Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>State Tax/UT Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Integrated Tax</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Cess</Grid>
             </Grid>

             {GSTR916List.map((e,index) => (
                   <Grid container className={classes.contPad}  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                  }}>
                  
                   <Grid item xs={4} style={{ padding: '10px'}}>{e.details}</Grid>
                   <Grid item xs={2} style={{ padding: '10px',textAlign:'center',background: e.tax_payable === '' ? '#F5F5F5' : 'white'}}>{e.tax_payable}</Grid>
                   <Grid item xs={1} style={{ padding: '10px',textAlign:'center',background: e.central_tax === '' ? '#F5F5F5' : 'white'}}>{e.central_tax}</Grid>
                   <Grid item xs={2} style={{ padding: '10px',textAlign:'center',background: e.state_ut_tax === '' ? '#F5F5F5' : 'white'}}>{e.state_ut_tax}</Grid>
                   <Grid item xs={2} style={{ padding: '10px',textAlign:'center',background: e.integrated_tax === '' ? '#F5F5F5' : 'white'}}>{e.integrated_tax}</Grid>
                   <Grid item xs={1} style={{ padding: '10px',textAlign:'center',background: e.cess === '' ? '#F5F5F5' : 'white'}}>{e.cess}</Grid>
                   </Grid>
             ))}
         </div>


         
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr916Report);
