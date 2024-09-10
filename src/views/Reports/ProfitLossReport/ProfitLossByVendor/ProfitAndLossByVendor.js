import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar,
  Button
} from '@material-ui/core';
import { Search, Print, WhatsApp, Email, Sms } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import useWindowDimensions from '../../../../components/windowDimension';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 2,
    borderRadius: '12px',
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },
  paperRoot: {
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    borderRadius: 6
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },
  searchInputRoot: {
    borderRadius: 50
  },
  sectionHeader: {
    marginBottom: 30
  },
  tableRow: {
    '&.Mui-selected': {
      backgroundColor: '#CEE6F3 !important'
    }
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
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
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
  },
  listbox: {
    minWidth: '30%',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  tableForm: {
    padding: '10px 6px'
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  listbox: {
    margin: 5,
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  }
}));

const ProfitAndLossByVendor = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();
  const [localInvoiceNumber, setLocalInvoiceNumber] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const statusCellStyle = (params) => {
    let data = params['data'];

    if (data['balance_amount'] === 0) {
      return { color: '#86ca94', fontWeight: 500 };
    } else if (
      data['balance_amount'] < data['total_amount'] ||
      data['balance_amount'] === data['total_amount']
    ) {
      return { color: '#faab53', fontWeight: 500 };
    }
    return null;
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    minWidth: 150,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  function dateFormatter(params) {
    var dateAsString = params.data.bill_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'VENDOR',
      field: 'vendor_name',
      valueFormatter: dateFormatter
    },
    {
      headerName: 'PHONE NUMBER',
      field: 'vendor_phone_number'
    },
    {
      headerName: 'TOTAL SALE AMOUNT',
      field: 'total_sale_amount'
    },
    {
      headerName: 'PROFIT/LOSS',
      field: 'payment_type'
    }
  ]);

  function getPurchaseStatus(purchaseData) {
    let result = '';

    if (purchaseData.balance_amount === 0) {
      result = 'Paid';
    } else if (purchaseData.balance_amount < purchaseData.total_amount) {
      result = 'Partial';
    } else if (purchaseData.balance_amount === purchaseData.total_amount) {
      result = 'Un Paid';
    }
    return result;
  }

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromPurchases = () => {
    const wb = new Workbook();

    let data = [];
    if (purchasesData && purchasesData.length > 0) {
      for (var i = 0; i < purchasesData.length; i++) {
        const record = {
          DATE: purchasesData[i].bill_date,
          'Bill NO': purchasesData[i].vendor_bill_number,
          'PARTY NAME': purchasesData[i].vendor_name,
          'PARTY TYPE': purchasesData[i].payment_type,
          AMOUNT: purchasesData[i].total_amount,
          'BALANCE DUE': purchasesData[i].balance_amount,
          STATUS: getPurchaseStatus(purchasesData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'Bill NO': '',
        'PARTY NAME': '',
        'PARTY TYPE': '',
        AMOUNT: '',
        'BALANCE DUE': '',
        STATUS: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Purchases Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Purchases Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Purchases_Report';

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

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const { dateDropValue, purchasesData } = toJS(stores.PurchasesAddStore);
  const { addPurchasesData, getPurchasesList, handlePurchasesSearch } =
    stores.PurchasesAddStore;
  const store = useStore();

  const prevAmount = usePrevious(dateDropValue);
  const sharemenu = [
    { name: 'Whats app', icon: WhatsApp },
    { name: 'Email', icon: Email },
    { name: 'Sms', icon: Sms }
  ];
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [fromDate, setFromDate] = React.useState();
  const [toDate, setToDate] = React.useState();
  const [vendorList, setVendorList] = React.useState();
  const [vendorName, setVendorName] = React.useState('');

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        addPurchasesData(await handlePurchasesSearch(target));
      } else {
        getPurchasesList(fromDate, toDate);
      }
    }
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setFromDate(formatDate(firstThisMonth));
    setToDate(formatDate(todayDate));
    setVendorList([]);
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorClick = (vendor) => {
    setVendorName(vendor.name);
    setVendorList([]);
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('P&L Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    getPurchasesList(fromDate, toDate);
  }, [fromDate, toDate]);

  function convertPXToVW(px) {
    const result = px * (100 / document.documentElement.clientWidth) + 20;
    return result + 'vh';
  }

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 53 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 53 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    PROFIT AND LOSS - VENDOR
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={6}>
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
                        onChange={(e) => setToDate(formatDate(e.target.value))}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </form>
                  </div>
                </Grid>
                <Grid
                  item
                  xs={3}
                  style={{ marginTop: 'auto', marginLeft: '-10%' }}
                >
                  <div className={classes.blockLine}>
                    <div className={classes.nameList}>
                      <TextField
                        fullWidth
                        placeholder="Select Vendor *"
                        className={classes.input}
                        value={vendorName}
                        onChange={(e) => {
                          if (e.target.value !== vendorName) {
                            setVendorName(e.target.value);
                          }
                          getVendorList(e.target.value);
                        }}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: classes.bootstrapFormLabel
                        }}
                      />
                      {vendorList && vendorList.length > 0 ? (
                        <>
                          <ul
                            className={classes.listbox}
                            style={{ width: '18%' }}
                          >
                            <li>
                              <Grid container justify="space-between">
                                {vendorList.length === 1 &&
                                vendorList[0].name === '' ? (
                                  <Grid item></Grid>
                                ) : (
                                  <Grid item>
                                    <Button
                                      size="small"
                                      style={{
                                        position: 'relative',
                                        fontSize: 12
                                      }}
                                    >
                                      Balance
                                    </Button>
                                  </Grid>
                                )}
                              </Grid>
                            </li>
                            {vendorList.length === 1 &&
                            vendorList[0].name === '' ? (
                              <li></li>
                            ) : (
                              <div>
                                {vendorList.map((option, index) => (
                                  <li
                                    key={`${index}vendor`}
                                    style={{ padding: 10, cursor: 'pointer' }}
                                    onClick={() => {
                                      handleVendorClick(option);
                                    }}
                                  >
                                    <Grid container justify="space-between">
                                      <Grid item style={{ color: 'black' }}>
                                        {option.name}
                                        <br />
                                        {option.phoneNo}
                                      </Grid>
                                      <Grid item style={{ color: 'black' }}>
                                        {' '}
                                        <span>
                                          {parseFloat(option.balance).toFixed(
                                            2
                                          )}
                                        </span>
                                        {option.balance > 0 ? (
                                          option.balanceType === 'Payable' ? (
                                            <Arrowtopright fontSize="inherit" />
                                          ) : (
                                            <Arrowbottomleft fontSize="inherit" />
                                          )
                                        ) : (
                                          ''
                                        )}
                                      </Grid>
                                    </Grid>
                                  </li>
                                ))}
                              </div>
                            )}
                          </ul>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Grid>
              </Grid>

              <Paper className={classes.paperRoot}>
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  className={classes.sectionHeader}
                >
                  <Grid item xs={12} sm={7}>
                    <Typography variant="h4">Transaction</Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    align="right"
                    className={classes.categoryActionWrapper}
                  >
                    <Grid
                      container
                      direction="row"
                      spacing={2}
                      alignItems="center"
                    >
                      <Grid item xs={10} align="right">
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
                                <Search />
                              </InputAdornment>
                            )
                          }}
                          onChange={handleSearch}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Grid
                          container
                          direction="row"
                          alignItems="center"
                          justify="flex-end"
                          className="category-actions-right"
                        >
                          <Avatar>
                            <IconButton onClick={() => getDataFromPurchases()}>
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
                  </Grid>
                </Grid>
                <div
                  style={{
                    width: '100%',
                    height:
                      purchasesData && purchasesData.length < 6
                        ? purchasesData.length === 0
                          ? convertPXToVW(height)
                          : '56vh'
                        : '93vh'
                  }}
                  className=" blue-theme"
                >
                  <div
                    id="sales-invoice-grid"
                    style={{ height: '100%', width: '100%' }}
                    className="ag-theme-material"
                  >
                    <AgGridReact
                      onGridReady={onGridReady}
                      enableRangeSelection
                      paginationPageSize={10}
                      suppressMenuHide
                      rowData={purchasesData}
                      rowSelection="single"
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      pagination
                      headerHeight={40}
                      rowClassRules={rowClassRules}
                      overlayLoadingTemplate={
                        '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                      }
                    />
                  </div>
                </div>
              </Paper>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
export default InjectObserver(ProfitAndLossByVendor);
