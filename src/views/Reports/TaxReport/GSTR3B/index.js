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
  Button,
  Paper,
  AppBar
} from '@material-ui/core';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';

import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import Gstr31Report from './3.1';
import Gstr311Report from './3.1.1';
import Gstr5Report from './5';
import Gstr51Report from './5.1';
import Gstr61Report from './6.1';
import Gstr4Report from './4';
import GSTR32Report from './3.2';
import BreakupReport from './breakup';
import { toJS } from 'mobx';
import OnlineGSTR3BModal from 'src/components/modal/OnlineGSTR3BModal';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 2,
    borderRadius: '12px',
    height: '660px'
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

const GSTR3BReports = () => {
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
    console.log(event);
    setTabValue(newValue);
    if (newValue === 0) {
      setHeaderVal('SECTION 3.1');
    }
    if (newValue === 1) {
      setHeaderVal('SECTION 3.1.1');
    }
    if (newValue === 2) {
      setHeaderVal('SECTION 3.2');
    }
    if (newValue === 3) {
      setHeaderVal('SECTION 4');
    }
    if (newValue === 4) {
      setHeaderVal('SECTION 5');
    }
    if (newValue === 5) {
      setHeaderVal('SECTION 5.1');
    }
    if (newValue === 6) {
      setHeaderVal('SECTION 6.1');
    }
    if (newValue === 6) {
      setHeaderVal('Breakup');
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
  const [headerVal, setHeaderVal] = React.useState('SECTION 3.1');

  const store = useStore();

  const { setDateRageOfGSTR3B, getGSTR3BData,handleOnlineGSTR3BModalOpen } = store.GSTR3BStore;

  const {
    Section31Summary,
    Section311Summary,
    Section5Summary,
    Section51Summary,
    section4DSummary,
    section4ASummary,
    unregisteredPersonData,
    taxablePersonData,
    uinHoldersData,
    onlineGSTR3BDialogOpen
    
  } = toJS(store.GSTR3BStore);

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromTax = () => {
    const wb = new Workbook();

    // Preparing Section 3.1 data
    let data = [];

    for (var i = 0; i < Section31Summary.length; i++) {
      const record = {
        'Nature of Supplies': Section31Summary[i].name,
        'Total Taxable Value': Section31Summary[i].total_taxable_value,
        'Integrated Tax': Section31Summary[i].integrated_tax,
        'Central Tax': Section31Summary[i].central_tax,
        'State/UT Tax': Section31Summary[i].state_ut_tax,
        'Cess Amount': Section31Summary[i].cess
      };

      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Section 3.1');

    console.log('test:: ws::', ws);
    wb.Sheets['Section 3.1'] = ws;

    //Preparing Section 3.2 Sheet
    let section32Data = [];

    section32Data.push({
      'Place of Supply (State/UT)': 'Supplies Made To Unregistered Persons',
      'Total Taxable Value (₹)': '',
      'Amount of Integrated Tax (₹)': ''
    });
    for (var i = 0; i < unregisteredPersonData.length; i++) {
      const section32Record = {
        'Place of Supply (State/UT)': unregisteredPersonData[i].place_of_supply,
        'Total Taxable Value (₹)': unregisteredPersonData[i].taxableValue,
        'Amount of Integrated Tax (₹)': unregisteredPersonData[i].integratedTax
      };
      section32Data.push(section32Record);
    }

    section32Data.push({
      'Place of Supply (State/UT)':
        'Supplies Made To Composition Taxable Persons',
      'Total Taxable Value (₹)': '',
      'Amount of Integrated Tax (₹)': ''
    });

    for (var i = 0; i < taxablePersonData.length; i++) {
      const section32Record = {
        'Place of Supply (State/UT)': taxablePersonData[i].place_of_supply,
        'Total Taxable Value (₹)': taxablePersonData[i].taxableValue,
        'Amount of Integrated Tax (₹)': taxablePersonData[i].integratedTax
      };
      section32Data.push(section32Record);
    }

    section32Data.push({
      'Place of Supply (State/UT)': 'Supplies Made To UIN Holders',
      'Total Taxable Value (₹)': '',
      'Amount of Integrated Tax (₹)': ''
    });

    for (var i = 0; i < uinHoldersData.length; i++) {
      const section32Record = {
        'Place of Supply (State/UT)': uinHoldersData[i].place_of_supply,
        'Total Taxable Value (₹)': uinHoldersData[i].taxableValue,
        'Amount of Integrated Tax (₹)': uinHoldersData[i].integratedTax
      };
      section32Data.push(section32Record);
    }

    let w232 = XLSX.utils.json_to_sheet(section32Data);

    console.log(w232);

    /* hide last column */
    w232['!cols'] = [];

    wb.SheetNames.push('Section 3.2');

    wb.Sheets['Section 3.2'] = w232;

    //Preparing Section 4 Sheet

    let section4Data = [];

    section4Data.push({
      Details: '(A) ITC Available (Whether in full or part)',
      'Integrated Tax': '',
      'Central Tax': '',
      'State/UT Tax': '',
      'Cess Amount': ''
    });

    for (var i = 0; i < section4ASummary.length; i++) {
      const section4Record = {
        Details: section4ASummary[i].name,
        'Integrated Tax': section4ASummary[i].integrated_tax,
        'Central Tax': section4ASummary[i].central_tax,
        'State/UT Tax': section4ASummary[i].state_ut_tax,
        'Cess Amount': section4ASummary[i].cess
      };
      section4Data.push(section4Record);
    }

    section4Data.push({
      Details: '(D) Ineligible ITC',
      'Integrated Tax': '',
      'Central Tax': '',
      'State/UT Tax': '',
      'Cess Amount': ''
    });

    for (var i = 0; i < section4DSummary.length; i++) {
      const section4Record = {
        Details: section4DSummary[i].name,
        'Integrated Tax': section4DSummary[i].integrated_tax,
        'Central Tax': section4DSummary[i].central_tax,
        'State/UT Tax': section4DSummary[i].state_ut_tax,
        'Cess Amount': section4DSummary[i].cess
      };
      section4Data.push(section4Record);
    }

    let w2section4 = XLSX.utils.json_to_sheet(section4Data);

    /* hide last column */
    w2section4['!cols'] = [];

    wb.SheetNames.push('Section 4');
    console.log('test:: wsB2CS::', w2section4);
    wb.Sheets['Section 4'] = w2section4;

    //Preparing Section 5 Sheet
    let section5Data = [];

    for (var i = 0; i < Section5Summary.length; i++) {
      const section5Record = {
        'Nature of Supplies': Section5Summary[i].name,
        'Inter-State supplies': Section5Summary[i].inter_state_supplies,
        'Intra-State supplies': Section5Summary[i].intra_state_supplies
      };

      section5Data.push(section5Record);
    }

    let wsSection5 = XLSX.utils.json_to_sheet(section5Data);

    console.log(wsSection5);

    /* hide last column */
    wsSection5['!cols'] = [];

    wb.SheetNames.push('Section 5');

    wb.Sheets['Section 5'] = wsSection5;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'GSTR_1_Report';

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

      await setDateRageOfGSTR3B(fromDate, toDate);
      await getGSTR3BData();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, [fromDate, toDate]);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Tax Report')) {
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
                  <Grid item xs={4}>
                    <div>
                      <form className={classes.blockLine} noValidate>
                        <TextField
                          id="date"
                          label="From"
                          type="date"
                          value={fromDate}
                          onChange={(e) =>
                            setFromDate(formatDate(e.target.value))
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
                          onChange={(e) =>
                            setToDate(formatDate(e.target.value))
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
                    <Button
                      variant="contained"
                      color="primary"
                      className="customTextField"
                      style={{
                        color: 'black',
                        marginRight: 15,
                        height: '35px'
                      }}
                      onClick={handleOnlineGSTR3BModalOpen}
                    >
                      File GST
                    </Button>
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
                  >
                    <Tab label="Section 3.1" {...a11yProps(0)} />
                    <Tab label="Section 3.1.1" {...a11yProps(1)} />
                    <Tab label="Section 3.2" {...a11yProps(2)} />
                    <Tab label="Section 4" {...a11yProps(3)} />
                    <Tab label="Section 5" {...a11yProps(4)} />
                    <Tab label="Section 5.1" {...a11yProps(5)} />
                    <Tab label="Section 6.1" {...a11yProps(6)} />
                    <Tab label="Breakup" {...a11yProps(7)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={Tabvalue} index={0}>
                  <Gstr31Report />
                </TabPanel>
                <TabPanel value={Tabvalue} index={1}>
                  <Gstr311Report />
                </TabPanel>
                <TabPanel value={Tabvalue} index={2}>
                  <GSTR32Report />
                </TabPanel>
                <TabPanel value={Tabvalue} index={3}>
                  <Gstr4Report />
                </TabPanel>
                <TabPanel value={Tabvalue} index={4}>
                  <Gstr5Report />
                </TabPanel>
                <TabPanel value={Tabvalue} index={5}>
                  <Gstr51Report />
                </TabPanel>
                <TabPanel value={Tabvalue} index={6}>
                  <Gstr61Report />
                </TabPanel>
                <TabPanel value={Tabvalue} index={7}>
                  <BreakupReport />
                </TabPanel>

              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {onlineGSTR3BDialogOpen ? <OnlineGSTR3BModal jsonData='' /> : null}
    </div>
  );
};

export default InjectObserver(GSTR3BReports);
