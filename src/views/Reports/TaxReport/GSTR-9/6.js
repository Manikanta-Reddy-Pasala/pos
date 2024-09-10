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
  }
  
}));

const Gstr95Report = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { 
    getPurchasesGSTR96sezData ,
    getGSTR6Data ,
    setDataLoaded,
    getPurchaseUnRegGSTR96Data,
    getPurchaseRegGSTR96Data,
    getPurchaseOverseasGSTR96Data,
  } = store.GSTR9Store;
  const { dataLoaded } =toJS(store.GSTR9Store);
  const [ GSTR96DataList ,setGSTR96DataList] = React.useState({
    purchaseSEZWithNoReverseCharge : {},
    purchaseUnRegReverseCharge : {},
    purchaseRegReverseCharge : {},
    purchaseOverseas : {}
  });
  const [GSTR9_6_List ,setGSTR9_6_List] = React.useState([]);

  React.useEffect(() => {
   async function fetchData() {
      getPurchasesGSTR96sezData();
      getPurchaseUnRegGSTR96Data();
      getPurchaseRegGSTR96Data();
      getPurchaseOverseasGSTR96Data();
     setTimeout(() => {
      setDataLoaded(6)
     }, 1000);
   }
   fetchData();
  },[getPurchaseUnRegGSTR96Data, getPurchasesGSTR96sezData, setDataLoaded, getPurchaseRegGSTR96Data, getPurchaseOverseasGSTR96Data]);


  React.useEffect(() => {
    
    getGSTR6Data().then((ele) => {
      console.log(ele)
      setGSTR96DataList(ele)
      let subtotalCgst = Number(
                          Number(ele.purchaseSEZWithNoReverseCharge.centralTax) +
                          Number(ele.purchaseUnRegReverseCharge.centralTax) +
                          Number(ele.purchaseRegReverseCharge.centralTax) +
                          Number(ele.purchaseOverseas.centralTax)
                         ).toFixed(2);
      let subtotalIgst = Number(
                          Number(ele.purchaseSEZWithNoReverseCharge.igst) +
                          Number(ele.purchaseUnRegReverseCharge.igst) +
                          Number(ele.purchaseRegReverseCharge.igst) +
                          Number(ele.purchaseOverseas.igst)
                         ).toFixed(2);
       let subtotalSgst = Number(
                          Number(ele.purchaseSEZWithNoReverseCharge.sgst) +
                          Number(ele.purchaseUnRegReverseCharge.sgst) +
                          Number(ele.purchaseRegReverseCharge.sgst) +
                          Number(ele.purchaseOverseas.sgst)
                         ).toFixed(2);
       let subtotalCess = Number(
                          Number(ele.purchaseSEZWithNoReverseCharge.cess) +
                          Number(ele.purchaseUnRegReverseCharge.cess) +
                          Number(ele.purchaseRegReverseCharge.cess) +
                          Number(ele.purchaseOverseas.cess)
                         ).toFixed(2);
      let GSTR96list = [
      
        {
          nature_of_supplies:'Import of services (excluding inward supplies from SEZs)',
          
          central_tax : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
          name : 'F',
          type : []
        },
        {
          nature_of_supplies:'Input Tax credit received from ISD',
          
          central_tax : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
          name : 'G',
          type : []
        },
        {
          nature_of_supplies:'Amount of ITC reclaimed (other than B above) under the provisons of Act',
          
          central_tax : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
          name : 'H',
          type : []
        },
        {
          nature_of_supplies:'Sub-total (B to H above)',
          
          central_tax : subtotalCgst,
          state_ut_tax : subtotalSgst,
          integrated_tax : subtotalIgst,
          cess : subtotalCess,
          name : 'I',
          type : []
        },
        {
          nature_of_supplies:'Difference (I - A above)',
          
          central_tax : subtotalCgst,
          state_ut_tax : subtotalSgst,
          integrated_tax : subtotalIgst,
          cess : subtotalCess,
          name : 'J',
          type : []
        },
        {
          nature_of_supplies:'Transition credit through TRAN-I (including revisions if any)',
          
          central_tax : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
          name : 'K',
          type : []
        },
        {
          nature_of_supplies:'Transition credit through TRAN-II',
          
          central_tax : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
          name : 'L',
          type : []
        },
        {
          nature_of_supplies:'Any other ITC availed but not specified above',
          
          central_tax : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
          name : 'M',
          type : []
        },
        {
          nature_of_supplies:'Sub-total (K to M above)',
          
          central_tax : '',
          state_ut_tax : '',
          integrated_tax : '',
          cess : '',
          name : 'N',
          type : []
        },
        {
          nature_of_supplies:'Total ITC availed (I + N above)',
          
          central_tax : subtotalCgst,
          state_ut_tax : subtotalSgst,
          integrated_tax : subtotalIgst,
          cess : subtotalCess,
          name : 'O',
          type : []
        },
  ]

     setGSTR9_6_List(GSTR96list)
    })

  },[getGSTR6Data,dataLoaded]);


 

  return (
    <div>
      <div>
        <div className={classes.contPad}>
         <div className={classes.headerFour} >
             <p className={classes.r4}>6</p><p style={{display:'inline'}}>Details of ITC availed as declared in returns filed during the financial year</p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}></Grid>
                 <Grid item xs={3} style={{textAlign:'center',padding:'10px'}}>Description</Grid>
                 <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Type</Grid>
                 <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>Central Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>State Tax/UT Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Integrated Tax</Grid>
                 <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>Cess</Grid>
             </Grid>
             <Grid container className={classes.contPad}>
             <Grid item xs={1} style={{padding:'10px'}}>A</Grid>
                 <Grid item xs={5} style={{padding:'10px'}}>Total amount of input tax credit availed through FORM GSTR-3B (sum total of Table 4A of FORM GSTR-3B)</Grid>
                 <Grid item xs={6} style={{background: '#F5F5F5'}}></Grid>
             </Grid>
             <Grid container className={classes.contPad} style={{background:'#ecf0f1'}}>
                   <Grid item xs={1} style={{padding:'10px'}}>B</Grid>
                   <Grid item xs={3} style={{padding:'10px'}}>Inward supplies (other than imports and inward supplies liable to reverse charge but includes service received from SEZs)</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Inputs</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseSEZWithNoReverseCharge.centralTax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseSEZWithNoReverseCharge.sgst}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseSEZWithNoReverseCharge.igst}</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseSEZWithNoReverseCharge.cess}</Grid>
                
             </Grid>
             <Grid container className={classes.contPad}>
                   <Grid item xs={4} style={{textAlign:'center',padding:'10px'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Capital Goods</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                
             </Grid>
             <Grid container className={classes.contPad}>
                   <Grid item xs={4} style={{textAlign:'center',padding:'10px'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}} >Input Services</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                
             </Grid>
             <Grid container className={classes.contPad} style={{background:'#ecf0f1'}}>
                   <Grid item xs={1} style={{padding:'10px'}}>C</Grid>
                   <Grid item xs={3} style={{padding:'10px'}}>Inward supplies received from unregistered persons liable to reverse charge (other than B above) on which tax is paid & ITC availed</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Inputs</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseUnRegReverseCharge.centralTax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseUnRegReverseCharge.sgst}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseUnRegReverseCharge.igst}</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseUnRegReverseCharge.cess}</Grid>

                
             </Grid>
             <Grid container className={classes.contPad}>
                   <Grid item xs={4} style={{textAlign:'center',padding:'10px'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Capital Goods</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>

                
             </Grid>
             <Grid container className={classes.contPad}>
                   <Grid item xs={4} style={{textAlign:'center',padding:'10px'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Input Services</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>

                
             </Grid>
             <Grid container className={classes.contPad} style={{background:'#ecf0f1'}}>
                   <Grid item xs={1} style={{padding:'10px'}}>D</Grid>
                   <Grid item xs={3} style={{padding:'10px'}}>Inward supplies received from registered persons liable to reverse charge (other than B above) on which tax is paid and ITC availed</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Inputs</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseRegReverseCharge.centralTax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseRegReverseCharge.sgst}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseRegReverseCharge.igst}</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseRegReverseCharge.cess}</Grid>

                
             </Grid>
             <Grid container className={classes.contPad}>
                   <Grid item xs={4} style={{textAlign:'center',padding:'10px'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Capital Goods</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>

                
             </Grid>
             <Grid container className={classes.contPad}>
                   <Grid item xs={4} style={{textAlign:'center',padding:'10px'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Input Services</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>

                
             </Grid>
             <Grid container className={classes.contPad} style={{background:'#ecf0f1'}}>
                   <Grid item xs={1} style={{padding:'10px'}}>E</Grid>
                   <Grid item xs={3} style={{padding:'10px'}}>Import of goods (including suppliesfrom SEZs)</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Inputs</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseOverseas.centralTax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseOverseas.sgst}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseOverseas.igst}</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px'}}>{GSTR96DataList.purchaseOverseas.cess}</Grid>

                
             </Grid>
             <Grid container className={classes.contPad}>
                  
                   <Grid item xs={4} style={{textAlign:'center',padding:'10px'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px'}}>Capital Goods</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',background: '#F5F5F5'}}></Grid>

                
             </Grid>
            


             {GSTR9_6_List.map((e,index) => (
                   <Grid container className={classes.contPad}  style={{
                    backgroundColor: index % 2 === 0 ? '#ecf0f1' : '#fff'
                  }}>
                     <Grid item xs={1} style={{padding:'10px'}}>{e.name}</Grid>
                   <Grid item xs={5} style={{padding:'10px'}}>{e.nature_of_supplies}</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',}}>{e.central_tax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',}}>{e.state_ut_tax}</Grid>
                   <Grid item xs={2} style={{textAlign:'center',padding:'10px',}}>{e.integrated_tax}</Grid>
                   <Grid item xs={1} style={{textAlign:'center',padding:'10px',}}>{e.cess}</Grid>
                   </Grid>
             ))}
         </div>


         
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr95Report);
