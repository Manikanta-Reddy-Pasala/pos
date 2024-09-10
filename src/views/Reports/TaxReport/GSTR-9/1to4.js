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
  contsPad : {
   padding : '10px',
   fontSize:'small'
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

const Gstr1to4Report = (props) => {
  const classes = useStyles();

  const store = useStore();
  const { taxSettingsData } = toJS(store.TaxSettingsStore);
  const [ salesDataList, setSalesData] = React.useState();
  const { 
    getSalesRowData,
    getSalesRegisteredCustomerData,
    getGSTR1To4Data ,
    getSalesUnRegisteredCustomerData ,
    setDataLoaded,
    getSalesSEZCustomerData,
    getSalesDeemedCustomerData,
    getPurchaseReverseChargeData,
    getSalesReturnData,
    setGSTR94NValues,
    setGST94GValues,
  } = store.GSTR9Store;
  const { dataLoaded } =toJS(store.GSTR9Store);
  const [GSTR91to4List ,setGSTR1to9List] = React.useState([]);
 



    React.useEffect(() =>{
     async function fetchData() {
      await getSalesRegisteredCustomerData();
      await getSalesUnRegisteredCustomerData();
      await getSalesSEZCustomerData();
      await getSalesDeemedCustomerData();
      await getPurchaseReverseChargeData();
      await getSalesReturnData();
      setDataLoaded(1)
     }
     fetchData();
    },[getSalesRowData, props, getSalesRegisteredCustomerData, getSalesUnRegisteredCustomerData, setDataLoaded, getSalesSEZCustomerData, getSalesDeemedCustomerData, getPurchaseReverseChargeData, getSalesReturnData]);

    React.useEffect(() => {
      async function fetchData() {
        setSalesData(await getSalesRowData());
       }
       fetchData();
    },[dataLoaded, getSalesRowData])


    React.useEffect(() =>{

      getGSTR1To4Data().then((data) => {
      let taxable_vaues = (Number(data.unRegisteredData.taxableValues)+Number(data.registeredData.taxableValues)+Number(data.sezData.taxableValues)+Number(data.deemedData.taxableValues)+Number(data.reverseCharge.taxableValues)).toFixed(2);
      let central_tax = (Number(data.unRegisteredData.centralTax)+Number(data.registeredData.centralTax)+Number(data.sezData.centralTax)+Number(data.deemedData.centralTax)+Number(data.reverseCharge.centralTax)).toFixed(2);
      let state_ut_tax = Number(Number(data.unRegisteredData.sgst)+Number(data.registeredData.sgst)+Number(data.sezData.sgst)+Number(data.deemedData.sgst)+Number(data.reverseCharge.sgst)).toFixed(2);
      let integrated_tax = Number(Number(data.unRegisteredData.igst)+Number(data.registeredData.igst)+Number(data.sezData.igst)+Number(data.deemedData.igst)+Number(data.reverseCharge.igst)).toFixed(2);
      let cess = Number(Number(data.unRegisteredData.cess)+Number(data.registeredData.cess)+Number(data.sezData.cess)+Number(data.deemedData.cess)+Number(data.reverseCharge.cess)).toFixed(2);
        const GSTR9_4_List = [
          {   name:'A',
              nature_of_supplies:'Supplies made to un-registered persons(B2C)',
              taxable_vaues : data.unRegisteredData.taxableValues,
              central_tax : data.unRegisteredData.centralTax,
              state_ut_tax : data.unRegisteredData.sgst,
              integrated_tax : data.unRegisteredData.igst,
              cess : data.unRegisteredData.cess,
          },
          {
            name:'B',
            nature_of_supplies:'Supplies made to registered persons(B2B)',
            taxable_vaues : data.registeredData.taxableValues,
            central_tax : data.registeredData.centralTax,
            state_ut_tax : data.registeredData.sgst,
            integrated_tax : data.registeredData.igst,
            cess : data.registeredData.cess,
          },
          {
            name:'C',
            nature_of_supplies:'Zero rated supply(Export) on payment of tax (except supplies to SEZs)',
            taxable_vaues : '',
            central_tax : '',
            state_ut_tax : '',
            integrated_tax : '',
            cess : '',
          },
          {
            name:'D',
            nature_of_supplies:'Supplies to SEZs on payment of tax',
            taxable_vaues : data.sezData.taxableValues,
            central_tax : data.sezData.centralTax,
            state_ut_tax : data.sezData.sgst,
            integrated_tax : data.sezData.igst,
            cess : data.sezData.cess,
          },
          {
            name:'E',
            nature_of_supplies:'Deemed Exports',
            taxable_vaues : data.deemedData.taxableValues,
            central_tax : data.deemedData.centralTax,
            state_ut_tax : data.deemedData.sgst,
            integrated_tax : data.deemedData.igst,
            cess : data.deemedData.cess,
          },
          {
            name:'F',
            nature_of_supplies:'Advances on which tax has been paid but invoice has not been issued (not cover under (A) to (E) above)',
            taxable_vaues : '',
            central_tax : '',
            state_ut_tax : '',
            integrated_tax : '',
            cess : '',
          },
          {
            name:'G',
            nature_of_supplies:'Inward supplies on which tax is to be paid on reverse charge basis',
            taxable_vaues : data.reverseCharge.taxableValues,
            central_tax : data.reverseCharge.centralTax,
            state_ut_tax : data.reverseCharge.sgst,
            integrated_tax : data.reverseCharge.igst,
            cess : data.reverseCharge.cess,
          },
          {
            name:'H',
            nature_of_supplies:'Sub-total (A to G above)',
            taxable_vaues :taxable_vaues,
            central_tax : central_tax,
            state_ut_tax : state_ut_tax,
            integrated_tax : integrated_tax,
            cess : cess,
          },
          {
            name:'I',
            nature_of_supplies:'Credit Notes issued in respect of transactions specified in (B) to (E) above (-)',
            taxable_vaues : data.salesReturn.taxableValues,
            central_tax : data.salesReturn.centralTax,
            state_ut_tax : data.salesReturn.sgst,
            integrated_tax : data.salesReturn.igst,
            cess : data.salesReturn.cess,
          },
          {
            name:'J',
            nature_of_supplies:'Debit Notes issued in respect of transactions specified in (B) to (E) above (+)',
            taxable_vaues : '',
            central_tax : '',
            state_ut_tax : '',
            integrated_tax : '',
            cess : '',
          },
          {
            name:'K',
            nature_of_supplies:'Supplies/tax declared through Amendments(+)',
            taxable_vaues : '',
            central_tax : '',
            state_ut_tax : '',
            integrated_tax : '',
            cess : '',
          },
          {
            name:'L',
            nature_of_supplies:'Supplies/tax reduced through Amendments(+)',
            taxable_vaues : '',
            central_tax : '',
            state_ut_tax : '',
            integrated_tax : '',
            cess : '',
          },
          {
            name:'M',
            nature_of_supplies:'Sub-total (I to L above)',
            taxable_vaues : data.salesReturn.taxableValues,
            central_tax : data.salesReturn.centralTax,
            state_ut_tax : data.salesReturn.sgst,
            integrated_tax : data.salesReturn.igst,
            cess : data.salesReturn.cess,
          },
          {
            name:'N',
            nature_of_supplies:'Supplies and advances on which tax is to be paid (H+M) above',
            taxable_vaues : Number(Number(taxable_vaues)+Number(data.salesReturn.taxableValues)).toFixed(2),
            central_tax : Number(Number(central_tax) + Number(data.salesReturn.centralTax)).toFixed(2),
            state_ut_tax : Number(Number(state_ut_tax) + Number(data.salesReturn.sgst)).toFixed(2),
            integrated_tax : Number(Number(integrated_tax) + Number(data.salesReturn.igst)).toFixed(2),
            cess : Number(Number(cess) + Number(data.salesReturn.cess)),
          },
    ];   
         setGSTR1to9List(GSTR9_4_List);
         setGSTR94NValues({
          taxable_vaues : Number(Number(taxable_vaues)+Number(data.salesReturn.taxableValues)).toFixed(2),
          central_tax : Number(Number(central_tax) + Number(data.salesReturn.centralTax)).toFixed(2),
          state_ut_tax : Number(Number(state_ut_tax) + Number(data.salesReturn.sgst)).toFixed(2),
          integrated_tax : Number(Number(integrated_tax) + Number(data.salesReturn.igst)).toFixed(2),
          cess : Number(Number(cess) + Number(data.salesReturn.cess)),
         });
         setGST94GValues({
          taxable_vaues : data.reverseCharge.taxableValues,
          central_tax : data.reverseCharge.centralTax,
          state_ut_tax : data.reverseCharge.sgst,
          integrated_tax : data.reverseCharge.igst,
          cess : data.reverseCharge.cess,
         });

      });   

    },[getGSTR1To4Data, salesDataList, setGST94GValues, setGSTR94NValues])


  return (
  
    
        <div className={classes.contsPad}>
         <div className={classes.header_basic}>
             <Typography variant='h6'>Basic Details</Typography>
         </div>

         <div>
             <Grid container className={classes.contsPad}>
                 <Grid item xs={1}>1</Grid>
                 <Grid item xs={5}>Financial Year</Grid>
                 <Grid item xs={6}>{props.financialYear}</Grid>
             </Grid>
             <Grid container className={classes.contsPad} style={{background:'#ECF0F1'}}>
                 <Grid item xs={1}>2</Grid>
                 <Grid item xs={5}>GSTIN</Grid>
                 <Grid item xs={6}>{taxSettingsData.gstin}</Grid>
             </Grid>
             <Grid container className={classes.contsPad}>
                 <Grid item xs={1}>3.i</Grid>
                 <Grid item xs={5}>Legal Name</Grid>
                 <Grid item xs={6}>{taxSettingsData.legalName}</Grid>
             </Grid>
             <Grid container className={classes.contsPad} style={{background:'#ECF0F1'}}>
                 <Grid item xs={1}>3.ii</Grid>
                 <Grid item xs={5}>Trade Name(If any)</Grid>
                 <Grid item xs={6}>{taxSettingsData.tradeName}</Grid>
             </Grid>
         </div>
         <div className={classes.headerFour} >
             <p className={classes.r4}>4</p><p style={{display:'inline'}}>Details of advances, inward and outward supplies on which tax is payable as declared in returns filed during the financial year</p>
         </div>

         <div>
             <Grid container className={classes.fourSubHeader}>
                 <Grid item xs={1}></Grid>
                 <Grid item xs={3}>Nature of Supplies</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Taxable Value</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Central Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>State Tax/UT Tax</Grid>
                 <Grid item xs={2} style={{textAlign:'center'}}>Integrated Tax</Grid>
                 <Grid item xs={1} style={{textAlign:'center'}}>Cess</Grid>
             </Grid>

             {GSTR91to4List.map((e,index) => (
                   <Grid container className={classes.contPad} key={index} style={{
                    backgroundColor: index % 2 === 0 ? '#fff' : '#ecf0f1'
                  }}>
                     <Grid item xs={1} style={{ padding: '10px'}}>{e.name}</Grid>
                   <Grid item xs={3} style={{ padding: '10px'}}>{e.nature_of_supplies}</Grid>
                   <Grid item xs={2} style={{padding: '10px',textAlign:'center',background: e.taxable_vaues === '' ? '#F5F5F5' : ''}}>{e.taxable_vaues}</Grid>
                   <Grid item xs={1} style={{padding: '10px',textAlign:'center',background: e.central_tax === '' ? '#F5F5F5' : ''}}>{e.central_tax}</Grid>
                   <Grid item xs={2} style={{padding: '10px',textAlign:'center',background: e.state_ut_tax === '' ? '#F5F5F5' : ''}}>{e.state_ut_tax}</Grid>
                   <Grid item xs={2} style={{padding: '10px',textAlign:'center',background: e.integrated_tax === '' ? '#F5F5F5' : ''}}>{e.integrated_tax}</Grid>
                   <Grid item xs={1} style={{padding: '10px',textAlign:'center',background: e.cess === '' ? '#F5F5F5' : ''}}>{e.cess}</Grid>
                   </Grid>
             ))}
         </div>


         
        </div>
     
  
  );
};

export default InjectObserver(Gstr1to4Report);
