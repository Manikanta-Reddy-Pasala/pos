import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Grid ,Typography} from '@material-ui/core';
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
    setDataLoaded,
    getSalesSEZCustomerData,
    getGSTR95Data,
    getSaleDataByExemptedProduct,
    getSaleDataByNilRatedProduct,
    getSaleDataByNonGSTProduct,
    getSaleReturnDataByProduct,
  } = store.GSTR9Store;
  const { dataLoaded ,gstr94NValue ,gstr94GValue} =toJS(store.GSTR9Store);
  const [GSTR95List ,setGSTR95List] = React.useState([]);

  React.useEffect(() =>{
    async function fetchData() {
     await getSalesSEZCustomerData();
     await getSaleDataByExemptedProduct();
     await getSaleDataByNilRatedProduct();
     await getSaleDataByNonGSTProduct();
     await getSaleReturnDataByProduct();
     setDataLoaded(5) 
    }
    fetchData();
   },[getSaleDataByExemptedProduct, getSaleDataByNilRatedProduct, getSaleDataByNonGSTProduct, getSaleReturnDataByProduct, getSalesSEZCustomerData, setDataLoaded]);

   React.useEffect(() => {

    getGSTR95Data().then((data) => {
 let gTaxableValues =  Number(Number(data.sezData.taxableValues) + Number(data.exemedData.taxableValues) +Number(data.nillratedData.taxableValues) + Number(data.nonGSTData.taxableValues)).toFixed(2);
 let MTaxableValues = Number(Number(gTaxableValues) + Number(data.salesReturn.taxableValues)).toFixed(2);
 let NTaxableValues = Number((Number(gstr94NValue.taxable_vaues)+Number(MTaxableValues))-Number(gstr94GValue.taxable_vaues)).toFixed(2);
 let NCentralTax = Number((Number(gstr94NValue.central_tax)+Number(0))-Number(gstr94GValue.central_tax)).toFixed(2);
 let NStateTax = Number((Number(gstr94NValue.state_ut_tax)+Number(0))-Number(gstr94GValue.state_ut_tax)).toFixed(2);
 let NIgst = Number((Number(gstr94NValue.integrated_tax)+Number(0))-Number(gstr94GValue.integrated_tax)).toFixed(2);
 let NCess = Number((Number(gstr94NValue.cess)+Number(0))-Number(gstr94GValue.cess)).toFixed(2);

   const GSTR9_5_List = [
    {
        nature_of_supplies:'Zero rated supply (Export) without payment of tax',
        taxable_vaues : '',
        central_tax : '',
        state_ut_tax : '',
        integrated_tax : '',
        cess : '',
        name : 'A'
    },
    {
      nature_of_supplies:'Supply to SEZs without payment of tax',
      taxable_vaues : data.sezData.taxableValues,
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'B'
    },
    {
      nature_of_supplies:'Supplies on which tax is to be paid by the recipient on reverse charge basis',
      taxable_vaues : '',
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'C'
    },
    {
      nature_of_supplies:'Exempted',
      taxable_vaues : data.exemedData.taxableValues,
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'D'
    },
    {
      nature_of_supplies:'Nil Rated',
      taxable_vaues : data.nillratedData.taxableValues,
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'E'
    },
    {
      nature_of_supplies:'Non-GST supply',
      taxable_vaues : data.nonGSTData.taxableValues,
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'F'
    },
    {
      nature_of_supplies:'Sub-total (A to F above)',
      taxable_vaues :Number(gTaxableValues).toFixed(2),
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'G'
    },
    {
      nature_of_supplies:'Credit Notes issued in respect of transactions specified in A to F above (-)',
      taxable_vaues : data.salesReturn.taxableValues,
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'H'
    },
    {
      nature_of_supplies:'Debit Notes issued in respect of transactions specified in A to F above (+)',
      taxable_vaues : '',
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'I'
    },
    {
      nature_of_supplies:'Supplies declared through Amendments(+)',
      taxable_vaues : '',
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'J'
    },
    {
      nature_of_supplies:'Supplies reduced through Amendments(+)',
      taxable_vaues : '',
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'K'
    },
    {
      nature_of_supplies:'Sub-Total (H to K above)',
      taxable_vaues : data.salesReturn.taxableValues,
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'L'
    },
    {
      nature_of_supplies:'Turnover on which tax is not to be paid (G + L above)',
      taxable_vaues : MTaxableValues,
      central_tax : '',
      state_ut_tax : '',
      integrated_tax : '',
      cess : '',
      name : 'M'
    },
    {
      nature_of_supplies:'Total Turnover (including advances) (4N + 5M - 4G above)',
      taxable_vaues : NTaxableValues,
      central_tax : NCentralTax,
      state_ut_tax : NStateTax,
      integrated_tax : NIgst,
      cess : NCess,
      name : 'N'
    },
]
setGSTR95List(GSTR9_5_List)
    })

   },[dataLoaded, getGSTR95Data, gstr94GValue, gstr94NValue])




  return (
    <div>
      <div>
        <div style={{ padding: '10px',fontSize:'small'}}>
         <div className={classes.headerFour} >
           <Grid container>
             <Grid item xs={1} style={{textAlign:'start',paddingLeft:'13px'}}>5</Grid>
             <Grid item xs={11}>
               <Typography variant='string' >
               Details of Outward supplies on which tax is not payable as declared in returns filed during the financial year
               </Typography>
             </Grid>
           </Grid>
            
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={1}></Grid>
                 <Grid item xs={3}> <Typography variant='string' >Nature of Supplies</Typography></Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}> <Typography variant='string' >Taxable Value</Typography></Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}> <Typography variant='string' >Central Tax</Typography></Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}> <Typography variant='string' >State Tax/UT Tax</Typography></Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}> <Typography variant='string' >Integrated Tax </Typography></Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}> <Typography variant='string' >Cess</Typography></Grid>
             </Grid>

             {GSTR95List.map((e,index) => (
                   <Grid container key={index} className={classes.contPad}  style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                  }}>
                   <Grid item xs={1} style={{ padding: '10px'}}>{e.name}</Grid>
                   <Grid item xs={3} style={{ padding: '10px'}}> <Typography variant='string' >{e.nature_of_supplies}</Typography></Grid>
                   <Grid item xs={2} style={{padding: '10px',textAlign:'center'}}>{e.taxable_vaues}</Grid>
                   <Grid item xs={1} style={{padding: '10px',textAlign:'center'}}>{e.central_tax}</Grid>
                   <Grid item xs={2} style={{padding: '10px',textAlign:'center'}}>{e.state_ut_tax}</Grid>
                   <Grid item xs={2} style={{padding: '10px',textAlign:'center'}}>{e.integrated_tax}</Grid>
                   <Grid item xs={1} style={{padding: '10px',textAlign:'center'}}>{e.cess}</Grid>
                     </Grid>
             ))}
         </div>


         
        </div>
      </div>
    </div>
  );
};

export default InjectObserver(Gstr95Report);
