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
import PurchaseGstr2Report from './Purchase';
import PurchaseReturnGstr2Report from './purchase_return';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';

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

const GSTR2ReportsView = () => {
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
      setHeaderVal('Purchases');
    }
    if (newValue === 1) {
      setHeaderVal('Purchases Return');
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
  const [headerVal, setHeaderVal] = React.useState('Purchases');

  const store = useStore();
  const { setDateRageOfGSTR2 } = store.GSTR2Store;

  const { getPurchaseData, getPurchasesReturnData } = store.GSTR2Store;
  const { purchasesData, purchasesReturnData } = store.GSTR2Store;

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromTax = () => {
    const wb = new Workbook();

    // Preparing GSTR-1 (Purchase) data
    let data = [];
    if (purchasesData && purchasesData.length > 0) {
      for (var i = 0; i < purchasesData.length; i++) {
        const record = {
          GSTIN: purchasesData[i].vendor_gst_number,
          'VENDOR NAME': purchasesData[i].vendor_name,
          'PLACE OF SUPPLY': purchasesData[i].place_of_supply,
          'BILL NUMBER': purchasesData[i].vendor_bill_number,
          'BILL DATE': purchasesData[i].bill_date,
          'BILL VALUE': purchasesData[i].amount,
          'TOTAL TAX %': purchasesData[i].tax_percentage,
          'TAXABLE VALUE': parseFloat(
            purchasesData[i].amount - purchasesData[i].total_tax
          ).toFixed(2),
          SGST: purchasesData[i].sgst_amount,
          CGST: purchasesData[i].cgst_amount,
          IGST: purchasesData[i].igst_amount,
          CESS: purchasesData[i].cess,
          'TOTAL TAX': purchasesData[i].total_tax
        };

        data.push(record);
      }
    } else {
      const record = {
        GSTIN: '',
        'VENDOR NAME': '',
        'PLACE OF SUPPLY': '',
        'BILL NUMBER': '',
        'BILL DATE': '',
        'BILL VALUE': '',
        'TOTAL TAX %': '',
        'TAXABLE VALUE': '',
        SGST: '',
        CGST: '',
        IGST: '',
        CESS: '',
        'TOTAL TAX': ''
      };

      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('GSTR-2');

    console.log('test:: ws::', ws);
    wb.Sheets['GSTR-2'] = ws;

    //Preparing GSTR-1 Purchase Return Sheet
    let GSTRPrchaseReturnData = [];

    if (purchasesReturnData && purchasesReturnData.length > 0) {
      for (var i = 0; i < purchasesReturnData.length; i++) {
        const GSTRPrchaseReturnRecord = {
          GSTIN: purchasesReturnData[i].vendor_gst_number,
          'VENDOR NAME': purchasesReturnData[i].vendor_name,
          'PLACE OF SUPPLY': purchasesReturnData[i].place_of_supply,
          'RETURN NUMBER': purchasesReturnData[i].purchaseReturnBillNumber,
          'RETURN DATE': purchasesReturnData[i].date,
          'BILL VALUE': purchasesReturnData[i].amount,
          'TOTAL TAX %': purchasesReturnData[i].tax_percentage,
          'TAXABLE VALUE': parseFloat(
            purchasesReturnData[i].amount - purchasesReturnData[i].total_tax
          ).toFixed(2),
          SGST: purchasesReturnData[i].sgst_amount,
          CGST: purchasesReturnData[i].cgst_amount,
          IGST: purchasesReturnData[i].igst_amount,
          CESS: purchasesReturnData[i].cess,
          'TOTAL TAX': purchasesReturnData[i].total_tax
        };
        GSTRPrchaseReturnData.push(GSTRPrchaseReturnRecord);
      }
    } else {
      const GSTRPrchaseReturnRecord = {
        GSTIN: '',
        'VENDOR NAME': '',
        'PLACE OF SUPPLY': '',
        'RETURN NUMBER': '',
        'RETURN DATE': '',
        'BILL VALUE': '',
        'TOTAL TAX %': '',
        'TAXABLE VALUE': '',
        SGST: '',
        CGST: '',
        IGST: '',
        CESS: '',
        'TOTAL TAX': ''
      };
      GSTRPrchaseReturnData.push(GSTRPrchaseReturnRecord);
    }

    let wsB2B = XLSX.utils.json_to_sheet(GSTRPrchaseReturnData);

    console.log(wsB2B);

    /* hide last column */
    wsB2B['!cols'] = [];

    wb.SheetNames.push('B2B');

    console.log('test:: wsB2B::', wsB2B);
    wb.Sheets['B2B'] = wsB2B;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'GSTR_2_Report';

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

  async function fetchData() {
    await getPurchaseData();
    await getPurchasesReturnData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      await setDateRageOfGSTR2(fromDate, toDate);
    }

    fetchData();
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
                  <Typography gutterBottom variant="h4" component="h4">
                    GSTR-2 ({headerVal})
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
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
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
                    <Tab label="Purchases" {...a11yProps(0)} />
                    <Tab label="Purchases Return" {...a11yProps(1)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={Tabvalue} index={0}>
                  <PurchaseGstr2Report />
                </TabPanel>
                <TabPanel value={Tabvalue} index={1}>
                  <PurchaseReturnGstr2Report />
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

export default InjectObserver(GSTR2ReportsView);
