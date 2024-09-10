import React, { useState, useEffect, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import Controls from 'src/components/controls/index';
import SearchIcon from '@material-ui/icons/Search';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Button,
  AppBar,
  Tabs,
  Tab,
  Switch,
  InputAdornment
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import useWindowDimensions from '../../../../components/windowDimension';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import NoPermission from '../../../noPermission';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import { toJS } from 'mobx';
import AccountsReceivableSundryPDF from 'src/views/PDF/AccountsReceivableSundry/AccountsReceivableSundryPDF';
import CustomerLedger from 'src/views/customers/CustomerLedger';
import Transaction from 'src/views/customers/Transaction';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getAllLedgerTransactionListDateRangeAndHavingBalance } from 'src/components/Helpers/dbQueries/alltransactions';
import {uploadToFirebase} from 'src/components/Helpers/ShareDocHelper';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: '12px'
  },
  root: {
    // padding: 2,
    borderRadius: '12px'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  footer: {
    borderTop: '1px solid #d8d8d8'
  },
  amount: {
    textAlign: 'center',
    color: '#EF5350'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  greenText: {
    color: '#339900'
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
        marginLeft: theme.spacing(1),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  },
  sticky: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '999',
    padding: '10px',
    backgroundColor: '#f6f8fa'
  },
  fText: {
    color: '#000',
    float: 'left',
    paddingLeft: '35px',
    paddingRight: '23px',
    fontWeight: 'bold'
  },
  fTextEB: {
    color: '#000',
    float: 'left',
    paddingLeft: '13px',
    paddingRight: '23px',
    fontWeight: 'bold'
  },
  documentUploadButtonWrapper: {
    '& #product-doc-upload': {
      display: 'none'
    },
    '& #product-secDoc-upload': {
      display: 'none'
    },
    '& .docUploadButton': {
      color: '#fff',
      bottom: '10px',
      backgroundColor: '#4a83fb',
      padding: '7px',
      fontSize: '14px',
      fontFamily: 'Roboto',
      fontWeight: 500,
      lineHeight: 1.75,
      borderRadius: '4px',
      marginRight: theme.spacing(2),
      '&.primaryDocImage': {
        margin: '5px',
        position: 'relative',
        top: '-20px'
      },
      '& i': {
        marginRight: '8px'
      }
    }
  }
}));

const AccountsReceivableReport = () => {
  const classes = useStyles();
  const fileInputRef = useRef(null);
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isLoading, setLoadingShown] = useState(true);
  const [rowData, setrowData] = useState([]);
  const [totalReceivable, setTotalReceivable] = useState(0);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [enableBalance, setEnableBalance] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  const localenableReceivableBalance = localStorage.getItem(
    'enableReceivableBalance'
  );

  const store = useStore();

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

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

  const { invoiceRegular } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const [displayMode, setDisplayMode] = React.useState('all');
  const { setSelectedPartyId } = store.CustomerStore;

  const { setCustFromDate, setCustToDate,setSelectedCustomer } = store.CustomerStore;

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));

    if (localenableReceivableBalance == 'true') {
      updateEnableBalance(true);
    } else {
      updateEnableBalance(false);
    }
  }, []);

  function dateFormatter(data) {
    var dateParts = data.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const handleCellClicked = async (event) => {
    setSelectedCustomer(event.data);
    setCustFromDate(fromDate);
    setCustToDate(toDate);
    setSelectedPartyId(event.data.id);
    setDisplayMode('single');
  };

  function formatNumber(number) {
    return number.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'NAME',
      field: 'name',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: true
    },
    {
      field: 'openingBalance',
      width: 300,
      filter: true,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>OPENING</p>
            <p>BALANCE</p>
          </div>
        );
      },
      hide: true,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data.openingBalance !== 0) {
          if (data.openingBalance > 0) {
            result = formatNumber(Math.abs(data.openingBalance)) + ' Cr';
          } else {
            result = formatNumber(Math.abs(data.openingBalance)) + ' Dr';
          }
        }

        return result;
      }
    },
    {
      headerName: 'DEBIT',
      field: 'debit',
      width: 300,
      filter: true,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data['debit'] === 0) {
          result = '';
        } else {
          result = formatNumber(data['debit']);
        }
        return result;
      }
    },
    {
      headerName: 'CREDIT',
      field: 'credit',
      width: 300,
      filter: true,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data['credit'] == 0) {
          result = '';
        } else {
          result = formatNumber(data['credit']);
        }
        return result;
      }
    },
    {
      field: 'closingBalance',
      width: 300,
      filter: true,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CLOSING</p>
            <p>BALANCE</p>
          </div>
        );
      },
      hide: true,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data.closingBalance !== 0) {
          if (data.closingBalance > 0) {
            result = formatNumber(Math.abs(data.closingBalance)) + ' Cr';
          } else {
            result = formatNumber(Math.abs(data.closingBalance)) + ' Dr';
          }
        }

        return result;
      }
    }
  ]);

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromCashFlow = () => {
    const wb = new Workbook();

    let data = [];
    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        let result = '';
        if (rowData[i]['date']) {
          result = rowData[i]['date'];
        }

        var dateParts = result.split('-');
        let record = {};
        if (enableBalance) {
          record = {
            Name: rowData[i].name,
            'Opening Balance': rowData[i].openingBalance,
            Debit: rowData[i].debit,
            Credit: rowData[i].credit,
            'Closing Balance': rowData[i].closingBalance
          };
        } else {
          record = {
            Name: rowData[i].name,
            Debit: rowData[i].debit,
            Credit: rowData[i].credit
          };
        }

        data.push(record);
      }
      const emptyRecord = {};
      data.push(emptyRecord);
      data.push(emptyRecord);
      // const totalCashRecord = {
      //   Name: 'Total Receivable',
      //   'To Receive': totalReceivable
      // };
      // data.push(totalCashRecord);
    } else {
      let record = {};
      if (enableBalance) {
        record = {
          Name: '',
          'Opening Balance': '',
          Debit: '',
          Credit: '',
          'Closing Balance': ''
        };
      } else {
        record = {
          Name: '',
          Debit: '',
          Credit: ''
        };
      }
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Accounts Receivable Sheet');

    // console.log('test:: ws::', ws);
    wb.Sheets['Accounts Receivable Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Accounts_Receivable_Sheet';

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

      let result = await getAllLedgerTransactionListDateRangeAndHavingBalance(
        fromDate,
        toDate,
        null,
        'receivable'
      );

      if (result && result.length > 0) {
        setrowData(result);
        // setTotalReceivable(result.totalToPay);
      } else {
        setrowData([]);
      }
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
      if (!businessData.posFeatures.includes('Accounts Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const [Tabvalue, setTabValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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

  const generatePDFDocument = async () => {
    const total = {
      balance: totalReceivable
    };

    console.log('rowdata', invoiceRegular);

    const blob = await pdf(
      <AccountsReceivableSundryPDF
        data={rowData}
        settings={invoiceRegular}
        date={dateFormatter(fromDate) + ' to ' + dateFormatter(toDate)}
        total={total}
        fromDate={fromDate}
        toDate={toDate}
        isPayable={false}
        title={'Accounts Receivable/Sundry Debtors'}
        type={'Receivable'}
        enableBalance={enableBalance}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, 'Accounts_Receivable');
  };

  useEffect(() => {
    setColumnDefs(prevDefs => {
      const newDefs = [...prevDefs];
      newDefs.forEach(def => {
        if(def.field !== 'name' && def.field !== 'openingBalance' && def.field !== 'closingBalance'){
          def.valueFormatter = params => {
            const data = params.data;
            if (!enableBalance) {
              if (data.closingBalance < 0 && def.field === 'debit') {
                return data.closingBalance == 0 ? '' : formatNumber(Math.abs(data.closingBalance));
              } else if (data.closingBalance > 0 && def.field === 'credit') {
                return data.closingBalance == 0 ? '' : formatNumber(Math.abs(data.closingBalance));
              }
            } else {
              
              return data[def.field] == 0 ? '' :formatNumber(Math.abs(data[def.field]));
              
            }
            return '';
          };
        }
      });
  
      return newDefs;
    });
    setGridKey(prevKey => prevKey + 1);
    console.log("enableBalance",enableBalance);
  }, [enableBalance]); // Add enableBalance as a dependency

  const updateEnableBalance = (isVisible) => {
    setEnableBalance(isVisible);
    const updatedColumnDefs = columnDefs.map((columnDef) => {
      if (
        columnDef.field === 'openingBalance' ||
        columnDef.field === 'closingBalance'
      ) {
        return { ...columnDef, hide: !isVisible };
      }
      return columnDef;
    });
    setColumnDefs(updatedColumnDefs);

    console.log("updatedColumnDefs",updatedColumnDefs);
    setGridKey((prevKey) => prevKey + 1);
    localStorage.setItem('enableReceivableBalance', isVisible);
  };


  const getTotalDebit = () => {
    let totalDebit = 0;
    if (
      rowData &&
      rowData.length > 0
    ) {
      for (var i = 0; i < rowData.length; i++) {
        if (!enableBalance) {
          if (rowData[i].closingBalance < 0) {
            totalDebit += parseFloat(rowData[i].closingBalance);
          }
        }else{
          totalDebit += parseFloat(rowData[i].debit || 0);
        }
      }
    }
    return Math.abs(totalDebit);
  };

  const getTotalCredit = () => {
    let totalCredit = 0;
    if (
      rowData &&
      rowData.length > 0
    ) {
      for (var i = 0; i < rowData.length; i++) {
        if (!enableBalance) {
          if (rowData[i].closingBalance > 0) {
            totalCredit += parseFloat(rowData[i].closingBalance);
          }
        }else{
          totalCredit += parseFloat(rowData[i].credit || 0);
        }
      }
    }
    return Math.abs(totalCredit);
  };
  const getTotalOpeningBalance = () => {
    let totalDebit = 0;
    if (
      rowData &&
      rowData.length > 0
    ) {
      for (var i = 0; i < rowData.length; i++) {
        totalDebit += parseFloat(rowData[i].openingBalance || 0);
      }
    }
    return totalDebit;
  };
  const getTotalClosingBalance = () => {
    let totalDebit = 0;
    if (
      rowData &&
      rowData.length > 0
    ) {
      for (var i = 0; i < rowData.length; i++) {
        totalDebit += parseFloat(rowData[i].closingBalance || 0);
      }
    }
    return totalDebit;
  };

  const handlePDFFileUpload = (e) => {
    const pdfFile = e.target.files[0];
    if (!pdfFile) {
      return;
    }
    uploadToFirebase(pdfFile);
    
  };

  return (
    <div>
      <div className={classes.root} style={{ height: height - 50 }}>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div className={classes.root}>
            {isFeatureAvailable ? (
              <Paper className={classes.root} style={{ height: height - 50 }}>
                <div className={classes.content}>
                  <div className={classes.contentLeft}>
                    <Typography gutterBottom variant="h4" component="h4">
                      Accounts Receivable/Sundry Debtors
                    </Typography>
                  </div>
                </div>

                <div>
                  <Grid container className={classes.categoryActionWrapper}>
                    <Grid item xs={5}>
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
                  </Grid>
                  {displayMode === 'all' && (
                    <Grid
                      container
                      style={{ marginTop: '10px' }}
                      className={classes.categoryActionWrapper}
                    >
                      <Grid item xs={5} style={{ paddingLeft: '12px' }}>
                        <Controls.Input
                          placeholder="Search Transaction"
                          size="small"
                          fullWidth
                          InputProps={{
                            classes: {
                              root: classes.searchInputRoot,
                              input: classes.searchInputInput
                            },
                            startAdornment: (
                              <InputAdornment position="start">
                                <SearchIcon className={classes.searchIcon} />
                              </InputAdornment>
                            )
                          }}
                          onChange={async (event) => {
                            let result =
                              await getAllLedgerTransactionListDateRangeAndHavingBalance(
                                fromDate,
                                toDate,
                                event.target.value,
                                'receivable'
                              );

                            if (result && result.length > 0) {
                              setrowData(result);
                              // setTotalReceivable(result.totalToPay);
                            } else {
                              setrowData([]);
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <FormControlLabel
                          className={classes.blockLine}
                          control={
                            <Switch
                              checked={enableBalance}
                              onChange={(e) => {
                                updateEnableBalance(e.target.checked);
                              }}
                            />
                          }
                          label="Enable Balance"
                        />
                      </Grid>

                      {/* <Grid item xs={2}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="flex-end"
                          className="category-actions-right"
                        >
                          <Box
                            component="span"
                            className={classes.documentUploadButtonWrapper}
                          >
                            <label
                              htmlFor="product-doc-upload"
                              className="docUploadButton primaryDocImage"
                              style={{ position: 'static', cursor: 'pointer' }}
                            >
                              <i className="fa fa-upload fa-1 " aria-hidden="true" />
                              <span>Upload</span>
                            </label>
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handlePDFFileUpload}
                              id="product-doc-upload"
                              ref={fileInputRef}
                            />
                          </Box>
                        </Grid>
                      </Grid> */}
                      <Grid item xs={1}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="flex-end"
                          className="category-actions-right"
                        >
                          <Avatar>
                            <IconButton onClick={() => getDataFromCashFlow()}>
                              <Excel fontSize="inherit" />
                            </IconButton>
                          </Avatar>
                        </Grid>
                      </Grid>
                      <Grid item xs={1}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="flex-end"
                          className="category-actions-right"
                        >
                          <Avatar>
                            <IconButton onClick={() => generatePDFDocument()}>
                              <PDFIcon fontSize="inherit" />
                            </IconButton>
                          </Avatar>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </div>

                {displayMode === 'single' && (
                  <Button
                    style={{
                      fontSize: '12px',
                      width: '60px',
                      height: '30px',
                      color: '#FFFFFF',
                      backgroundColor: '#4a83fb',
                      marginTop: '5px',
                      marginLeft: '16px',
                      marginBottom: '5px'
                    }}
                    onClick={() => {
                      setDisplayMode('all');
                      // load data for all customers balances
                    }}
                  >
                    Back
                  </Button>
                )}

                {displayMode === 'all' ? (
                  <>
                    <div style={{ marginTop: '20px' }}>
                      {/* <App />  */}

                      <Box>
                        <div
                          style={{
                            width: '100%',
                            height: height - 210 + 'px'
                          }}
                          className=" blue-theme"
                        >
                          <div
                            id="product-list-grid"
                            style={{ height: '100%', width: '100%' }}
                            className="ag-theme-material"
                          >
                            <AgGridReact
                              key={gridKey}
                              onGridReady={onGridReady}
                              enableRangeSelection
                              paginationPageSize={10}
                              suppressMenuHide
                              rowData={rowData}
                              columnDefs={columnDefs}
                              defaultColDef={defaultColDef}
                              rowSelection="single"
                              pagination
                              headerHeight={40}
                              rowClassRules={rowClassRules}
                              onCellClicked={handleCellClicked}
                              overlayLoadingTemplate={
                                '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                              }
                              frameworkComponents={{}}
                            />
                          </div>
                        </div>
                      </Box>
                    </div>
                    <div className={classes.sticky}>
                      
                    {enableBalance ? (<Grid
                      container
                      style={{
                        padding: '10px',
                        borderBottom: '1px solid #00000030'
                        }}
                        className={classes.categoryActionWrapper}
                      >
                        <Grid item xs={2}>
                          <Typography gutterBottom variant="h6" component="h6" className={classes.fText}>Total</Typography>
                        </Grid>
                        
                        <Grid item xs={3}>
                          <Typography gutterBottom variant="h6" component="h6"  className={classes.fText}>{(getTotalOpeningBalance() == 0) ? '' : (getTotalOpeningBalance() < 0 ? formatNumber(Math.abs(getTotalOpeningBalance())) + ' Dr' : formatNumber(getTotalOpeningBalance()) + ' Cr')}</Typography>
                        </Grid>
                      
                        <Grid item xs={2}>
                          <Typography gutterBottom variant="h6" component="h6" style={{marginLeft:'-23%'}}  className={classes.fText}>{getTotalDebit() == 0 ? '' : formatNumber(getTotalDebit())}</Typography>
                        </Grid>
                      
                        <Grid item xs={2}>
                          <Typography gutterBottom variant="h6" component="h6"  className={classes.fText}>{getTotalCredit() == 0 ? '' : formatNumber(getTotalCredit())}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                          <Typography gutterBottom variant="h6" component="h6" style={{marginLeft:'15%'}}  className={classes.fText}>{(getTotalClosingBalance() == 0) ? '' : (getTotalClosingBalance() < 0 ? formatNumber(Math.abs(getTotalClosingBalance())) + ' Dr' : formatNumber(getTotalClosingBalance()) + ' Cr')}</Typography>
                        </Grid>
                      </Grid>) : (
                        <Grid
                        container
                        style={{
                          padding: '10px',
                          borderBottom: '1px solid #00000030'
                          }}
                          className={classes.categoryActionWrapper}
                        >
                          <Grid item xs={4}>
                            <Typography gutterBottom variant="h6" component="h6" className={classes.fText}>Total</Typography>
                          </Grid>
                        
                          <Grid item xs={4}>
                            <Typography gutterBottom variant="h6" component="h6" style={{marginLeft:'-5%'}}  className={classes.fText}>{getTotalDebit() == 0 ? '' : formatNumber(getTotalDebit())}</Typography>
                          </Grid>
                        
                          <Grid item xs={4}>
                            <Typography gutterBottom variant="h6" component="h6"  className={classes.fText}>{getTotalCredit() == 0 ? '' : formatNumber(getTotalCredit())}</Typography>
                          </Grid>
                        </Grid>
                      )}
                    </div>
                  </>
                ) : (
                  <div className={classes.itemTable}>
                    <AppBar position="static">
                      <Tabs
                        value={Tabvalue}
                        aria-label=""
                        onChange={handleTabChange}
                      >
                        <Tab label="Transactions" {...a11yProps(0)} />
                        <Tab label="Ledger" {...a11yProps(1)} />
                      </Tabs>
                    </AppBar>
                    <TabPanel value={Tabvalue} index={0}>
                      <Transaction fromDate={fromDate} toDate={toDate} data="receivable" />
                    </TabPanel>
                    <TabPanel value={Tabvalue} index={1}>
                      <CustomerLedger fromDate={fromDate} toDate={toDate} data="receivable" />
                    </TabPanel>
                  </div>
                )}
              </Paper>
            ) : (
              <NoPermission />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default InjectObserver(AccountsReceivableReport);