import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Paper,
  AppBar
} from '@material-ui/core';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import CDNR5BReport from './5B_CDNR';
import B2B4ABReport from './4AB';
import B2BUR4CReport from './4C';
import CDNUR5BReport from './5B_CDNUR';
import B2BUR4DReport from './4D';
import TXOS6Report from './6_TXOS';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 2,
    borderRadius: '12px',
    height: '670px'
  },
  padding: {
    padding: theme.spacing(3)
  },
  demo1: {
    backgroundColor: theme.palette.background.paper
  },
  popover: {
    pointerEvents: 'none'
  },

  selectFont: {
    fontSize: '13px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: '12px'
  },
  contentRight: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  inputField: {
    '& .MuiOutlinedInput-input': {
      padding: '8px'
    },
    '& .MuiOutlinedInput-root': {
      position: 'relative',
      borderRadius: 18
    }
  },

  addExpenseBtn: {
    background: '#ffaf00',
    '&:hover': {
      backgroundColor: '#ffaf00'
    },
    color: 'white',
    borderRadius: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
    textTransform: 'none'
  },
  searchField: {
    marginRight: 20
  },
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
    border: '1px solid grey',
    padding: '6px',
    background: 'white'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  iconAlign: {
    textAlign: 'end',
    padding: '14px'
  },
  footer: {
    borderTop: '1px solid #d8d8d8',
    padding: '20px'
  },
  amount: {
    textAlign: 'end',
    color: '#000000'
  },
  totalQty: {
    color: '#80D5B8',
    textAlign: 'center'
  },
  cash_hand: {
    marginTop: '20px',
    padding: '15px'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  csh: {
    marginTop: '30px',
    textAlign: 'center'
  },
  categoryActionWrapper: {
    paddingRight: '10px',
    '& .category-actions-left': {
      '& > *': {
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .category-actions-right': {
      '& > *': {
        marginLeft: theme.spacing(2),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  }
}));

const GSTR4ReportsView = () => {
  const classes = useStyles();


  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [Tabvalue, setTabValue] = React.useState(0);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const handleTabChange = (event, newValue) => {

    setTabValue(newValue);
    if (newValue === 0) {
      setHeaderVal('4A&B(B2B)');
    }
    if (newValue === 1) {
      setHeaderVal('4C(B2BUR)');
    }
    if (newValue === 2) {
      setHeaderVal('4D(IMPS)');
    }
    if (newValue === 3) {
      setHeaderVal('5B(CDNR)');
    }
    if (newValue === 4) {
      setHeaderVal('5B(CDNUR)');
    }
    if (newValue === 5) {
      setHeaderVal('6(TXOS)');
    }
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));
  const [headerVal, setHeaderVal] = React.useState('4A&B(B2B)');


  const store = useStore();
  const { setToDateGSTR4,setFromDateGSTR4 } = store.GSTR4Store;


  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromTax = () => {

    const { 
      gstr4AandBExcelData,
      gstr4CExcelData,
      gstr4DExcelData,
      gstr45BCDNRExcelData,
      gstr45BCDNURExcelData,
     } = toJS(store.GSTR4Store);
     const { taxSettingsData } = toJS(store.TaxSettingsStore);
     const {
      totalSaleAmount,
      totalSaleReturnAmount,
    } = toJS(store.ReportsStore);
    const wb = new Workbook();

    // Preparing 4A&B(B2B) data
    let data = [];
    if (gstr4AandBExcelData && gstr4AandBExcelData.length > 0) {
      for (var i = 0; i < gstr4AandBExcelData.length; i++) {
        const record = {
          'GSTIN of supplier': gstr4AandBExcelData[i].vendor_gst_number,
          'Bill No': gstr4AandBExcelData[i].bill_number,
          'Bill Date': gstr4AandBExcelData[i].bill_date,
          'Invoice Value': gstr4AandBExcelData[i].total_amount,
          'Place of Supply': gstr4AandBExcelData[i].place_of_supply,
          'Reverse Charge': gstr4AandBExcelData[i].reverseChargeValue,
          'Rate': gstr4AandBExcelData[i].total_tax,
          'Taxable Value': parseFloat(Number(gstr4AandBExcelData[i].total_amount) - Number(gstr4AandBExcelData[i].total_tax)).toFixed(2),
          'Integrated Tax': gstr4AandBExcelData[i].igst_amount,
          'Central Tax': gstr4AandBExcelData[i].cgst_amount,
          'State UT Tax': gstr4AandBExcelData[i].sgst_amount,
          'Cess Amount': gstr4AandBExcelData[i].cess,
        };

        data.push(record);
      }
    } else {
      const record = {
       'GSTIN of supplier':'',
       'Bill No': '',
       'Bill Date':'',
       'Invoice Value': '',
       'Place of Supply': '',
       'Reverse Charge': '',
       'Invoice Type': '',
       'Rate': '',
       'Taxable Value': '',
       'Integrated Tax': '',
       'Central Tax': '',
       'State UT Tax': '',
       'Cess Amount': '',
      };

      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);



    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('4A&B(B2B)');


    wb.Sheets['4A&B(B2B)'] = ws;

    //Preparing 4C Sheet
    let b2burData = [];

    if (gstr4CExcelData && gstr4CExcelData.length > 0) {
      for (var j = 0; j < gstr4CExcelData.length; j++) {
        let supply_type = '';
        if(gstr4CExcelData[j].cgst_amount > 0 || gstr4CExcelData[j].sgst_amount > 0){
          supply_type = 'Intrastate'
        }
        if(gstr4CExcelData[j].igst_amount > 0){
          supply_type = 'Interstate'
        }
        const b2bRecord = {
          'Bill Number': gstr4CExcelData[j].bill_number,
          'Bill Date': gstr4CExcelData[j].bill_date,
          'Invoice Value': gstr4CExcelData[j].total_amount,
          'Place of Supply': gstr4CExcelData[j].place_of_supply,
          'Supply Type': supply_type,
          'Rate': gstr4CExcelData[j].total_tax,
          'Taxable Value': parseFloat(Number(gstr4CExcelData[j].total_amount) - Number(gstr4CExcelData[j].total_tax)).toFixed(2),
          'Integrated Tax': gstr4CExcelData[j].igst_amount,
          'Central Tax': gstr4CExcelData[j].cgst_amount,
          'State/UT Tax': gstr4CExcelData[j].sgst_amount,
          'Cess Amount': gstr4CExcelData[j].cess,
        };
        b2burData.push(b2bRecord);
      }
    } else {
      const b2bRecord = {
        'Bill Number': '',
        'Bill Date': '',
        'Invoice Value': '',
        'Place of Supply': '',
        'Supply Type': '',
        'Rate': '',
        'Taxable Value': '',
        'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Cess Amount': '',
      };
      b2burData.push(b2bRecord);
    }

    let wsB2BUR = XLSX.utils.json_to_sheet(b2burData);


    /* hide last column */
    wsB2BUR['!cols'] = [];

    wb.SheetNames.push('4C(B2BUR)');

 
    
    wb.Sheets['4C(B2BUR)'] = wsB2BUR;

    //Preparing 4D Sheet
    let impsData = [];

    if (gstr4DExcelData && gstr4DExcelData.length > 0) {
      for (var k = 0; k < gstr4DExcelData.length; k++) {
     
        const impsRecord = {
          'Bill Number': gstr4DExcelData[k].bill_number,
          'Bill Date': gstr4DExcelData[k].bill_date,
          'Invoice Value': gstr4DExcelData[k].total_amount,
          'Place of Supply': gstr4DExcelData[k].place_of_supply,
          'Rate': gstr4DExcelData[k].total_tax,
          'Taxable Value': parseFloat(Number(gstr4DExcelData[k].total_amount) - Number(gstr4DExcelData[k].total_tax)).toFixed(2),
          'Integrated Tax': gstr4DExcelData[k].igst_amount,
          'Central Tax': gstr4DExcelData[k].cgst_amount,
          'State/UT Tax': gstr4DExcelData[k].sgst_amount,
          'Cess Amount': gstr4DExcelData[k].cess,
        };
        impsData.push(impsRecord);
      }
    } else {
      const impsRecord = {
        'Bill Number': '',
        'Bill Date': '',
        'Invoice Value': '',
        'Place of Supply': '',
        'Rate': '',
        'Taxable Value': '',
        'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Cess Amount': '',
      };
      impsData.push(impsRecord);
    }

    let wsIMPS = XLSX.utils.json_to_sheet(impsData);

  
    
    /* hide last column */
    wsIMPS['!cols'] = [];

    wb.SheetNames.push('4D(IMPS)');

 
    
    wb.Sheets['4D(IMPS)'] = wsIMPS;

    //Preparing 5B(CDNR) Sheet
    let cdnrData = [];

    if (gstr45BCDNRExcelData && gstr45BCDNRExcelData.length > 0) {
      for (var l = 0; l < gstr45BCDNRExcelData.length; l++) {
        let supply_type = '';
        if(gstr45BCDNRExcelData[l].cgst_amount > 0 || gstr45BCDNRExcelData[l].sgst_amount > 0){
          supply_type = 'Intrastate'
        }
        if(gstr45BCDNRExcelData[l].igst_amount > 0){
          supply_type = 'Interstate'
        }
        const cdnrRecord = {
          'GSTIN of Supplier': gstr45BCDNRExcelData[l].gst_number,
          'Invoice No': gstr45BCDNRExcelData[l].invoice_number,
          'Invoice Date': gstr45BCDNRExcelData[l].invoice_date,
          'Document Type': gstr45BCDNRExcelData[l].document_type,
          'Supply Type': supply_type,
          'Reverse Charge': gstr45BCDNRExcelData[l].reverseChargeValue,
          'Rate': gstr45BCDNRExcelData[l].total_tax,
          'Taxable Value': parseFloat(Number(gstr45BCDNRExcelData[l].total_amount) - Number(gstr45BCDNRExcelData[l].total_tax)).toFixed(2),
          'Integrated Tax': gstr45BCDNRExcelData[l].igst_amount,
          'Central Tax': gstr45BCDNRExcelData[l].cgst_amount,
          'State/UT Tax': gstr45BCDNRExcelData[l].sgst_amount,
          'Cess Amount': gstr45BCDNRExcelData[l].cess,
        };
        cdnrData.push(cdnrRecord);
      }
    } else {
      const cdnrRecord = {
        'GSTIN of Supplier': '',
        'Invoice No': '',
        'Invoice Date': '',
        'Document Type': '',
        'Supply Type': '',
        'Reverse Charge': '',
        'Rate': '',
        'Taxable Value': '',
        'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Cess Amount': '',
      };
      cdnrData.push(cdnrRecord);
    }

    let wsCDNR = XLSX.utils.json_to_sheet(cdnrData);


    /* hide last column */
    wsCDNR['!cols'] = [];

    wb.SheetNames.push('5B(CDNR)');


    wb.Sheets['5B(CDNR)'] = wsCDNR;

    //Preparing CDNUR Sheet
    let cdnurData = [];

    if (gstr45BCDNURExcelData && gstr45BCDNURExcelData.length > 0) {
      for (var m = 0; m < gstr45BCDNURExcelData.length; m++) {
        let supply_type = '';
        if(gstr45BCDNURExcelData[m].cgst_amount > 0 || gstr45BCDNURExcelData[m].sgst_amount > 0){
          supply_type = 'Intrastate'
        }
        if(gstr45BCDNURExcelData[m].igst_amount > 0){
          supply_type = 'Interstate'
        }
        const cdnurRecord = {
          'Invoice No': gstr45BCDNURExcelData[m].invoice_number,
          'Invoice Date': gstr45BCDNURExcelData[m].invoice_date,
          'Document Type': gstr45BCDNURExcelData[m].document_type,
          'Supply Type': supply_type,
           Rate: gstr45BCDNURExcelData[m].total_tax,
          'Taxable Value': parseFloat(Number(gstr45BCDNURExcelData[m].total_amount) - Number(gstr45BCDNURExcelData[m].total_tax)).toFixed(2),
          'Integrated Tax': gstr45BCDNURExcelData[m].igst_amount,
          'Central Tax': gstr45BCDNURExcelData[m].cgst_amount,
          'State/UT Tax': gstr45BCDNURExcelData[m].sgst_amount,
          'Cess Amount': gstr45BCDNURExcelData[m].cess,
        };

        cdnurData.push(cdnurRecord);
      }
    } else {
      const cdnurRecord = {
        'Invoice No': '',
        'Invoice Date': '',
        'Document Type': '',
        'Supply Type': '',
         Rate: '',
        'Taxable Value': '',
        'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Cess Amount': '',
      };

      cdnurData.push(cdnurRecord);
    }

    let wsCDNUR = XLSX.utils.json_to_sheet(cdnurData);

    /* hide last column */
    wsCDNUR['!cols'] = [];

    wb.SheetNames.push('5B(CDNUR)');


    wb.Sheets['5B(CDNUR)'] = wsCDNUR;

    //Preparing 6(TXOS) Sheet
    let txosData = [];

  
      const txosRecord = {
       'Rate of Tax': taxSettingsData.compositeSchemeValue,
       'Turnover': (Number(totalSaleAmount)-Number(totalSaleReturnAmount)).toFixed(2),
       'Composition Central Tax Amount': (((Number(totalSaleAmount)-Number(totalSaleReturnAmount)) * (taxSettingsData.compositeSchemeValue/2)) / 100).toFixed(2),
       'Composition State/UT Tax Amount': (((Number(totalSaleAmount)-Number(totalSaleReturnAmount)) * (taxSettingsData.compositeSchemeValue/2)) / 100).toFixed(2)
      };

      txosData.push(txosRecord);
    

    let wsTXOS = XLSX.utils.json_to_sheet(txosData);


    /* hide last column */
    wsTXOS['!cols'] = [];

    wb.SheetNames.push('6(TXOS)');


    wb.Sheets['6(TXOS)'] = wsTXOS;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'GSTR_4_Report';

    download(url, fileName + '.xlsx');
  };

  const download = (url, name) => {
    let a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);

    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

    return buf;
  }

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setFromDateGSTR4(fromDate)
    setToDateGSTR4(toDate)
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if(!businessData.posFeatures.includes('Tax Report')) {
          setFeatureAvailable(false);
        }
      }
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`
    };
  }

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root}>
          {isFeatureAvailable ? (
            <Paper className={classes.root}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography
                    gutterBottom
                     
                    variant="h4"
                    component="h4"
                  >
                   {headerVal}
                  </Typography>
                </div>
              </div>

              <div>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
                  <Grid item xs={8}>
                    <div>
                      <form className={classes.blockLine} noValidate>
                        <TextField
                          id="date"
                          label="From"
                          type="date"
                          value={fromDate}
                          onChange={(e) =>{
                            setFromDate(formatDate(e.target.value))
                            setFromDateGSTR4(formatDate(e.target.value))
                          }
                          }
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </form>
                      <form className={classes.blockLine} noValidate>
                        <TextField
                          id="date"
                          label="To"
                          type="date"
                          value={toDate}
                          onChange={(e) =>{
                            setToDate(formatDate(e.target.value))
                            setToDateGSTR4(formatDate(e.target.value))
                          }
                          }
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </form>
                    </div>
                  </Grid>
                  <Grid item xs={4} style={{ marginTop: '14px' }}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton onClick={() => getDataFromTax()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                      {/* <IconButton classes={{ label: classes.label }}>
              <Print fontSize="inherit" />
              <span className={classes.iconLabel}>Print</span>
                  </IconButton> */}
                    </Grid>
                  </Grid>
                </Grid>
              </div>

              <div className={classes.itemTable} style={{ marginTop: '10px' }}>
                {/* <Paper className={classes.paper}> */}
                  <AppBar position="static">
                    <Tabs
                      value={Tabvalue}
                      onChange={handleTabChange}
                      aria-label=""
                    >
                      <Tab label="4A&B(B2B)" {...a11yProps(0)} />
                      <Tab label="4C(B2BUR)" {...a11yProps(1)} />
                      <Tab label="4D(IMPS)" {...a11yProps(2)} />
                      <Tab label="5B(CDNR)" {...a11yProps(3)} />
                      <Tab label="5B(CDNUR)" {...a11yProps(4)} />
                      <Tab label="6(TXOS)" {...a11yProps(5)} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={Tabvalue} index={0}>
                    <B2B4ABReport />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={1}>
                    <B2BUR4CReport />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={2}>
                    <B2BUR4DReport />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={3}>
                    <CDNR5BReport />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={4}>
                    <CDNUR5BReport />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={5}>
                    <TXOS6Report fromDate={fromDate} toDate={toDate} />
                  </TabPanel>
                {/* </Paper> */}
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};

export default InjectObserver(GSTR4ReportsView);
