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
  AppBar,
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel,
} from '@material-ui/core';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import Gstr1to3Report from './1to3';
import Gstr96Report from './6';
import Gstr9A7Report from './7';
import Gstr9A8Report from './8';
import Gstr9A9Report from './9';
import Gstr9A10to13Report from './10to13';
import Gstr9A14Report from './14';
import Gstr9A15Report from './15';
import Gstr9A16Report from './16';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 2,
    borderRadius: '12px',
    minHeight: '670px',
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

const GSTR9AReportsView = () => {
  const classes = useStyles();

  const [Tabvalue, setTabValue] = React.useState(0);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [financialYear ,setfinancialYear] = useState();
  const [financialYearList ,setfinancialYearList] = useState();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);   
  };

  const handleChangeFinancialYear = (event) => {
        setfinancialYear(event.target.value)
  }




  const store = useStore();

 const {DataList} = React.useState([]);

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromTax = () => {
    const wb = new Workbook();

    // Preparing GSTR-9(1to4) data
    let data = [];
 
    data.push({
        'Basic Details': 'Financial Year',
        '':financialYear
      })
      data.push({
        'Basic Details': 'GSTIN',
        '':''
      })
      data.push({
        'Basic Details': 'Name of the Taxable Person',
        '':''
      })
     

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('1-3');

    console.log('test:: ::', ws);
    wb.Sheets['1-3'] = ws;

    //Preparing 6 Sheet
    let GSTR96Data = [];

    if (DataList && DataList.length > 0) {
      for (var i = 0; i < DataList.length; i++) {
        const GSTR96Record = {
         'Description' :'',
         'Turnover' : '',
         'Rate of Tax(%)' : '',
         'Central Tax' : '',
         'State Tax/UT Tax': '',
         'Sheet Validation Error(s)' : '',
         'GST portal validation error(s)' : '',
        };
        GSTR96Data.push(GSTR96Record);
      }
    } else {
      const GSTR96Record = {
        'Description' :'',
         'Turnover' : '',
         'Rate of Tax(%)' : '',
         'Central Tax' : '',
         'State Tax/UT Tax': '',
         'Sheet Validation Error(s)' : '',
         'GST portal validation error(s)' : '',
      };
      GSTR96Data.push(GSTR96Record);
    }

    let ws6 = XLSX.utils.json_to_sheet(GSTR96Data);

    console.log(ws6);

    /* hide last column */
    ws6['!cols'] = [];

    wb.SheetNames.push('6');

    console.log('test:: ws6::', ws6);
    wb.Sheets['6'] = ws6;


    //Preparing 7 Sheet
    let GSTR97Data = [];

    if (DataList && DataList.length > 0) {
      for (var i = 0; i < DataList.length; i++) {
        const GSTR97DataRecord = {
          'Description': '',
          'Taxable' : '',
          'Integrated Tax': '',
          'Central Tax': '',
          'State/UT Tax': '',
          'Cess Amount': '',
          'Sheet Validation Error(s)' : '',
          'GST portal validation error(s)' : '',
        };

        GSTR97Data.push(GSTR97DataRecord);
      }
    } else {
      const GSTR97DataRecord = {
        'Description': '',
        'Taxable' : '',
        'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Cess Amount': '',
        'Sheet Validation Error(s)' : '',
        'GST portal validation error(s)' : '',
      };

      GSTR97Data.push(GSTR97DataRecord);
    }

    let ws7 = XLSX.utils.json_to_sheet(GSTR97Data);

    console.log(ws7);

    /* hide last column */
    ws7['!cols'] = [];

    wb.SheetNames.push('7');

    console.log('test:: ws7::', ws7);
    wb.Sheets['7'] = ws7;

    //Preparing 8 Sheet
    let GSTR98Data = [];

    if (DataList && DataList.length > 0) {
      for (var i = 0; i < DataList.length; i++) {
        const GSTR98DataRecord = {
            'Description': '',
            'Taxable' : '',
            'Integrated Tax': '',
            'Central Tax': '',
            'State/UT Tax': '',
            'Cess Amount': '',
            'Sheet Validation Error(s)' : '',
            'GST portal validation error(s)' : '',
        };

        GSTR98Data.push(GSTR98DataRecord);
      }
    } else {
      const GSTR98DataRecord = {
      
        'Description': '',
        'Taxable' : '',
        'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Cess Amount': '',
        'Sheet Validation Error(s)' : '',
        'GST portal validation error(s)' : '',
       
      };

      GSTR98Data.push(GSTR98DataRecord);
    }

    let ws8 = XLSX.utils.json_to_sheet(GSTR98Data);

    console.log(ws8);

    /* hide last column */
    ws8['!cols'] = [];

    wb.SheetNames.push('8');

    console.log('test:: ws8::', ws8);
    wb.Sheets['8'] = ws8;

     //Preparing 9 Sheet
     let GSTR99Data = [];

     if (DataList && DataList.length > 0) {
       for (var i = 0; i < DataList.length; i++) {
         const GSTR99DataRecord = {
           Description: '',
           'Total Tax Payable': '',
           'Paid': '',
           'Sheet Validation Error(s)' : '',
           'GST portal validation error(s)' : '',
         };
 
         GSTR99Data.push(GSTR99DataRecord);
       }
     } else {
       const GSTR99DataRecord = {
       
        Description: '',
           'Total Tax Payable': '',
           'Paid': '',
           'Sheet Validation Error(s)' : '',
           'GST portal validation error(s)' : '',
        
       };
 
       GSTR99Data.push(GSTR99DataRecord);
     }
 
     let ws9 = XLSX.utils.json_to_sheet(GSTR99Data);
 
     console.log(ws9);
 
     /* hide last column */
     ws9['!cols'] = [];
 
     wb.SheetNames.push('9');
 
     console.log('test:: ws9::', ws9);
     wb.Sheets['9'] = ws9;
 
      //Preparing 10 Sheet
 let GSTR910Data = [];

 if (DataList && DataList.length > 0) {
   for (var i = 0; i < DataList.length; i++) {
     const GSTR910DataRecord = {
      'Description': '',
      'Turnover':'',
      'Integrated Tax': '',
      'Central Tax': '',
      'State/UT Tax': '',
      'Cess Amount': '',
      'Sheet Validation Error(s)' : '',
      'GST portal validation error(s)' : '',
     };

     GSTR910Data.push(GSTR910DataRecord);
   }
 } else {
   const GSTR910DataRecord = {      
    'Description': '',
    'Turnover':'',
    'Integrated Tax': '',
    'Central Tax': '',
    'State/UT Tax': '',
    'Cess Amount': '',
    'Sheet Validation Error(s)' : '',
    'GST portal validation error(s)' : '',
    
   };

   GSTR910Data.push(GSTR910DataRecord);
 }

 let ws10 = XLSX.utils.json_to_sheet(GSTR910Data);

 console.log(ws10);

 /* hide last column */
 ws10['!cols'] = [];

 wb.SheetNames.push('10-13');

 console.log('test:: ws10::', ws10);
 wb.Sheets['10-13'] = ws10;

  //Preparing 14 Sheet
  let GSTR914Data = [];

  if (DataList && DataList.length > 0) {
    for (var i = 0; i < DataList.length; i++) {
      const GSTR914DataRecord = {
        'Description':'',
        'Payable': '',
        'Paid': '',
        'Sheet Validation Error(s)' : '',
        'GST portal validation error(s)' : '',
      };
 
      GSTR914Data.push(GSTR914DataRecord);
    }
  } else {
    const GSTR914DataRecord = {
        'Description':'',
        'Payable': '',
        'Paid': '',
        'Sheet Validation Error(s)' : '',
        'GST portal validation error(s)' : '',
          
    };
 
    GSTR914Data.push(GSTR914DataRecord);
  }
 
  let ws14 = XLSX.utils.json_to_sheet(GSTR914Data);
 
  console.log(ws14);
 
  /* hide last column */
  ws14['!cols'] = [];
 
  wb.SheetNames.push('14');
 
  console.log('test:: ws14::', ws14);
  wb.Sheets['14'] = ws14;
 
 //Preparing 15 Sheet
 let GSTR915Data = [];

 if (DataList && DataList.length > 0) {
   for (var i = 0; i < DataList.length; i++) {
     const GSTR915DataRecord = {
       Description: '',
       'Integrated Tax': '',
       'Central Tax': '',
       'State/UT Tax': '',
       'Cess Amount': '',
       'Interest':'',
       'Penality':'',
       'Late fee/Penality':'',
       'Sheet Validation Error(s)' : '',
       'GST portal validation error(s)' : '',
     };

     GSTR915Data.push(GSTR915DataRecord);
   }
 } else {
   const GSTR915DataRecord = {
   
    Description: '',
    'Integrated Tax': '',
    'Central Tax': '',
    'State/UT Tax': '',
    'Cess Amount': '',
    'Interest':'',
    'Penality':'',
    'Late fee/Penality':'',
    'Sheet Validation Error(s)' : '',
    'GST portal validation error(s)' : '',
    
   };

   GSTR915Data.push(GSTR915DataRecord);
 }

 let ws15 = XLSX.utils.json_to_sheet(GSTR915Data);

 console.log(ws15);

 /* hide last column */
 ws15['!cols'] = [];

 wb.SheetNames.push('15');

 console.log('test:: ws15::', ws15);
 wb.Sheets['15'] = ws15;

  //Preparing 16 Sheet
  let GSTR916Data = [];

  if (DataList && DataList.length > 0) {
    for (var i = 0; i < DataList.length; i++) {
      const GSTR916DataRecord = {
         Description: '',
        'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Cess Amount': '',
        'Sheet Validation Error(s)' : '',
        'GST portal validation error(s)' : '',
      };
 
      GSTR916Data.push(GSTR916DataRecord);
    }
  } else {
    const GSTR916DataRecord = {
    
        Description: '',
        'Integrated Tax': '',
        'Central Tax': '',
        'State/UT Tax': '',
        'Cess Amount': '',
        'Sheet Validation Error(s)' : '',
        'GST portal validation error(s)' : '',
     
    };
 
    GSTR916Data.push(GSTR916DataRecord);
  }
 
  let ws16 = XLSX.utils.json_to_sheet(GSTR916Data);
 
  console.log(ws16);
 
  /* hide last column */
  ws16['!cols'] = [];
 
  wb.SheetNames.push('16');
 
  console.log('test:: ws16::', ws16);
  wb.Sheets['16'] = ws16;

  
    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'GSTR_9A_Report';

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

  useEffect(() => {
    let financial_yr = [];
    const currentYear = (new Date()).getFullYear();
    const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
    let yearRange = range(currentYear, currentYear - 5, -1).reverse()
    yearRange.forEach((e,index) => {
      if(index !== 0){
        financial_yr.push(`${yearRange[index - 1]}-${e}` )
      }
    })
    console.log(financial_yr)
    setfinancialYearList(financial_yr)
    setfinancialYear(financial_yr[financial_yr.length-1])
  },[])

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
                    GSTR-9A
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
                    <div style={{padding:'16px'}}>
                   
                       <InputLabel id="demo-simple-select-helper-label" style={{marginBottom:'10px',marginTop:'-3%'}}>Financial Year</InputLabel>
                        <Select
                          style={{width:'35%'}}
                          value={financialYear}
                          input={<OutlinedInput  />}
                          onChange={handleChangeFinancialYear}
                        >
                          {financialYearList.map((e) => (
                          <MenuItem value={e}>{e}</MenuItem>
                          ))}
                        
                        
                        </Select>
                   
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
              
                  <AppBar position="static">
                    <Tabs
                      value={Tabvalue}
                      onChange={handleTabChange}
                      aria-label=""
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="1-3" {...a11yProps(0)} />
                      <Tab label="6" {...a11yProps(1)} />
                      <Tab label="7" {...a11yProps(2)} />
                      <Tab label="8" {...a11yProps(3)} />
                      <Tab label="9" {...a11yProps(4)} />
                      <Tab label="10-13" {...a11yProps(5)} />
                      <Tab label="14" {...a11yProps(6)} />
                      <Tab label="15" {...a11yProps(7)} />
                      <Tab label="16" {...a11yProps(8)} />
                     

                    </Tabs>
                  </AppBar>
                  <TabPanel value={Tabvalue} index={0}>
                    <Gstr1to3Report financialYear={financialYear} />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={1}>
                    <Gstr96Report />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={2}>
                    <Gstr9A7Report />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={3}>
                    <Gstr9A8Report />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={4}>
                    <Gstr9A9Report />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={5}>
                    <Gstr9A10to13Report />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={6}>
                    <Gstr9A14Report />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={7}>
                    <Gstr9A15Report />
                  </TabPanel>
                  <TabPanel value={Tabvalue} index={8}>
                    <Gstr9A16Report />
                  </TabPanel>
                 
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

export default InjectObserver(GSTR9AReportsView);
