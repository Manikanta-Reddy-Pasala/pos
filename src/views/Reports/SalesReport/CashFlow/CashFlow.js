import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Paper
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import * as moment from 'moment';

const useStyles = makeStyles((theme) => ({
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
  root: {
    // padding: 2,
    borderRadius: '12px',
    minHeight: '616px'
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
    textAlign: 'center',
    color: '#EF5350'
  },
  totalQty: {
    color: '#80D5B8',
    textAlign: 'center'
  },
  cash_hand: {
    marginTop: '5px',
    padding: '15px'
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
  }
}));

const CashFlow = () => {
  const theme = useTheme();
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [category, setCategory] = React.useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const store = useStore();
  const { getCashFlowData } = store.ReportsStore;
  const {
    cashFlowList,
    totalCashInHand,
    totalPaymnetInCash,
    totalPaymnetOutCash,
    finalCashInHand
  } = toJS(store.ReportsStore);

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const firstYear = new Date(thisYear, 0, 1);

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
  const [startOfTheYear] = React.useState(formatDate(firstYear));

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'transactionDate',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          const cellDate = moment(cellValue).startOf('day').toDate();

          if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
            return 0;
          }

          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }

          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        }
      },
      // filter: 'agDateColumnFilter',
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['date']) {
          result = data['date'];
        } else if (data['bill_date']) {
          result = data['bill_date'];
        } else if (data['invoice_date']) {
          result = data['invoice_date'];
        }

        var dateParts = result.split('-');
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    },
    {
      headerName: 'REF NO',
      field: 'ref_no',
      width: 300,
      // headerComponentFramework: (props) => {
      //   return (
      //    <div>
      //      <p>Ref</p>
      //      <p>No</p>
      //    </div>
      //   );
      // },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['receiptNumber']) {
          result = data['receiptNumber'];
        } else if (data['invoice_number']) {
          result = data['invoice_number'];
        } else if (data['bill_number']) {
          result = data['bill_number'];
        } else if (data['transactionType'] === 'Cash Adjustment') {
          result = data['id'];
        }
        return result;
      }
    },
    {
      headerName: 'NAME',
      field: 'name',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['customerName']) {
          result = data['customerName'];
        } else if (data['vendor_name']) {
          result = data['vendor_name'];
        } else if (data['customer_name']) {
          result = data['customer_name'];
        } else if (data['vendorName']) {
          result = data['vendorName'];
        } else if (data['transactionType'] === 'Cash Adjustment') {
          result = 'Self';
        }
        return result;
      }
    },
    {
      headerName: 'TYPE',
      field: 'transactionType',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'CASH IN',
      field: 'cash_in',
      width: 300,
      // headerComponentFramework: (props) => {
      //   return (
      //    <div>
      //      <p>Cash</p>
      //      <p>In</p>
      //    </div>
      //   );
      // },
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (
          data['transactionType'] === 'Payment In' ||
          data['transactionType'] === 'Sales' ||
          data['transactionType'] === 'Purchases Return' ||
          data['transactionType'] === 'KOT'
        ) {
          if ((data['transactionType'] === 'Sales' || data['transactionType'] === 'KOT') && data['received_amount']) {
            result = data['received_amount'];
          } else if (
            (data['transactionType'] === 'Sales' || data['transactionType'] === 'KOT') &&
            data['total_amount']
          ) {
            result = data['total_amount'];

            //Purchase Return
          } else if (
            data['transactionType'] === 'Purchases Return' &&
            data['received_amount']
          ) {
            result = data['received_amount'];
            // payment in
          } else if (
            data['transactionType'] === 'Payment In' &&
            data['received']
          ) {
            result = data['received'];
          }
        } else if (
          data['transactionType'] === 'Cash Adjustment' &&
          data['cashType'] === 'addCash'
        ) {
          result = data['amount'];
        }

        if (!result) {
          result = 0;
        }
        return parseFloat(result).toFixed(2);
      }
    },
    {
      headerName: 'CASH OUT',
      field: 'cash_out',
      width: 300,
      // headerComponentFramework: (props) => {
      //   return (
      //    <div>
      //      <p>Cash</p>
      //      <p>Out</p>
      //    </div>
      //   );
      // },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (
          data['transactionType'] === 'Payment Out' ||
          data['transactionType'] === 'Sales Return' ||
          data['transactionType'] === 'Purchases'
        ) {
          /**
           * purchases
           */
          if (
            data['transactionType'] === 'Purchases' &&
            data['paid_amount'] === 0
          ) {
            result = data['total_amount'];
          } else if (
            data['transactionType'] === 'Purchases' &&
            data['paid_amount'] > 0
          ) {
            result = data['paid_amount'];
          }
          // payment out
          else if (data['paid']) {
            result = data['paid'];
          }
          //sales return
          else if (
            data['transactionType'] === 'Sales Return' &&
            data['paid_amount']
          ) {
            result = data['paid_amount'];
          }
        } else if (
          data['transactionType'] === 'Cash Adjustment' &&
          data['cashType'] === 'reduceCash'
        ) {
          result = data['amount'];
        }

        if (!result) {
          result = 0;
        }
        return parseFloat(result).toFixed(2);
      }
    }
    // {
    //   headerName: 'Liquid Cash in Hand',
    //   field: 'cash_in_hand',
    //   width: 500,
    //   filterParams: {
    //     buttons: ['reset', 'apply'],
    //     closeOnApply: true
    //   }
    // }
  ]);

  function getDate(cashFlowData) {
    let result = '';

    if (cashFlowData.date) {
      result = cashFlowData.date;
    } else if (cashFlowData.bill_date) {
      result = cashFlowData.bill_date;
    } else if (cashFlowData.invoice_date) {
      result = cashFlowData.invoice_date;
    }
    return result;
  }

  function getRefNo(cashFlowData) {
    let result = '';

    if (cashFlowData.receiptNumber) {
      result = cashFlowData.receiptNumber;
    } else if (cashFlowData.invoice_number) {
      result = cashFlowData.invoice_number;
    } else if (cashFlowData.bill_number) {
      result = cashFlowData.bill_number;
    }
    return result;
  }

  function getName(cashFlowData) {
    let result = '';

    if (cashFlowData.customerName) {
      result = cashFlowData.customerName;
    } else if (cashFlowData.vendor_name) {
      result = cashFlowData.vendor_name;
    } else if (cashFlowData.customer_name) {
      result = cashFlowData.customer_name;
    } else if (cashFlowData.vendorName) {
      result = cashFlowData.vendorName;
    }
    return result;
  }

  function getCashIn(cashFlowData) {
    let result = '';

    if (
      cashFlowData.transactionType === 'Payment In' ||
      cashFlowData.transactionType === 'Sales' ||
      cashFlowData.transactionType === 'Purchases Return' ||
      cashFlowData.transactionType === 'KOT'
    ) {
      if (
        (cashFlowData.transactionType === 'Sales' || cashFlowData.transactionType === 'KOT') &&
        cashFlowData.received_amount
      ) {
        result = cashFlowData.received_amount;
      } else if (
        (cashFlowData.transactionType === 'Sales' || cashFlowData.transactionType === 'KOT') &&
        cashFlowData.total_amount
      ) {
        result = cashFlowData.total_amount;

        //Purchase Return
      } else if (
        cashFlowData.transactionType === 'Purchases Return' &&
        cashFlowData.received_amount
      ) {
        result = cashFlowData.received_amount;
        // payment in
      } else if (
        cashFlowData.transactionType === 'Payment In' &&
        cashFlowData.received
      ) {
        result = cashFlowData.received;
      }
    }

    if (!result) {
      result = 0;
    }
    return result;
  }

  function getCashOut(cashFlowData) {
    let result = '';

    if (
      cashFlowData.transactionType === 'Payment Out' ||
      cashFlowData.transactionType === 'Sales Return' ||
      cashFlowData.transactionType === 'Purchases'
    ) {
      /**
       * purchases
       */
      if (
        cashFlowData.transactionType === 'Purchases' &&
        cashFlowData.paid_amount === 0
      ) {
        result = cashFlowData.total_amount;
      } else if (
        cashFlowData.transactionType === 'Purchases' &&
        cashFlowData.paid_amount > 0
      ) {
        result = cashFlowData.paid_amount;
      }
      // payment out
      else if (cashFlowData.paid) {
        result = cashFlowData.paid;
      }
      //sales return
      else if (
        cashFlowData.transactionType === 'Sales Return' &&
        cashFlowData.paid_amount
      ) {
        result = cashFlowData.paid_amount;
      }
    }

    if (!result) {
      result = 0;
    }
    return result;
  }

  const getFloatWithTwoDecimal = (val) => {
    return parseFloat(val).toFixed(2);
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromCashFlow = () => {
    const wb = new Workbook();

    let data = [];
    if (cashFlowList && cashFlowList.length > 0) {
      for (var i = 0; i < cashFlowList.length; i++) {
        const record = {
          DATE: getDate(cashFlowList[i]),
          'REF NO': getRefNo(cashFlowList[i]),
          NAME: getName(cashFlowList[i]),
          TYPE: cashFlowList[i].transactionType,
          'CASH IN': getCashIn(cashFlowList[i]),
          'CASH OUT': getCashOut(cashFlowList[i])
        };
        data.push(record);
      }
      const emptyRecord = {};
      data.push(emptyRecord);
      data.push(emptyRecord);
      const totalCashRecord = {
        DATE: 'Total Cash - In Amount',
        'REF NO': totalPaymnetInCash
      };
      data.push(totalCashRecord);

      const totalCashOutRecord = {
        DATE: 'Total Cash - Out Amount',
        'REF NO': totalPaymnetOutCash
      };
      data.push(totalCashOutRecord);

      const totalCashInHandRecord = {
        DATE: 'Closing Cash - in Hand',
        'REF NO': finalCashInHand
      };
      data.push(totalCashInHandRecord);
    } else {
      const record = {
        DATE: '',
        'REF NO': '',
        NAME: '',
        TYPE: '',
        'CASH IN': '',
        'CASH OUT': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Cash Flow Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Cash Flow Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Cash_Flow_Report';

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
    // getOpeningCashInHandForCashFlow(startOfTheYear, fromDate);
    getCashFlowData(fromDate, toDate);
    setTimeout(() => setLoadingShown(false), 200);
  }, [fromDate, toDate]);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if(!businessData.posFeatures.includes('Accounts Report')) {
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

  function convertPXToVW(px) {
    const result = px * (100 / document.documentElement.clientWidth) + 20;
    return result + 'vh';
  }

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 83 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 83 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    CASH FLOW
                  </Typography>
                </div>
              </div>

              <div>
                <Grid container className={classes.categoryActionWrapper}>
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
                      justify="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton onClick={() => getDataFromCashFlow()}>
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

              <div className={classes.cash_hand}>
                <p>
                  Opening Cash in Hand :{' '}
                  <span className={classes.greenText}>
                    &#8377; {getFloatWithTwoDecimal(totalCashInHand)}
                  </span>
                </p>
              </div>
              <div className={classes.itemTable}>
                {/* <App />  */}

                <Box>
                  <div
                    style={{
                      width: '100%',
                      height:(height - 345) +'px'
                    }}
                    className=" blue-theme"
                  >
                    <div
                      id="product-list-grid"
                      style={{ height: '100%', width: '100%' }}
                      className="ag-theme-material"
                    >
                      <AgGridReact
                        onGridReady={onGridReady}
                        enableRangeSelection
                        paginationPageSize={10}
                        suppressMenuHide
                        rowData={cashFlowList}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection="single"
                        pagination
                        headerHeight={40}
                        rowClassRules={rowClassRules}
                        overlayLoadingTemplate={
                          '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                        }
                        frameworkComponents={{}}
                      />
                    </div>
                  </div>
                </Box>
              </div>

              <div className={classes.footer}>
                <div>
                  <Grid container>
                    {/* <Grid item xs={6} /> */}

                    <Grid item xs={6} className={classes.greenText}>
                      <p>
                        Total Cash - In Amount: &#8377;{' '}
                        {getFloatWithTwoDecimal(totalPaymnetInCash)}
                      </p>
                    </Grid>

                    <Grid item xs={6} className={classes.amount}>
                      <p>
                        Total Cash - Out Amount: &#8377;{' '}
                        {getFloatWithTwoDecimal(totalPaymnetOutCash)}
                      </p>
                    </Grid>
                  </Grid>
                </div>
                <div>
                  <Grid container>
                    <Grid item xs={6} />
                    <Grid item xs={6} className={classes.csh}>
                      <p>
                        Closing Cash - in Hand:{' '}
                        <span className={classes.greenText}>
                          {' '}
                          &#8377; {getFloatWithTwoDecimal(finalCashInHand)}
                        </span>
                      </p>
                    </Grid>
                  </Grid>
                </div>
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

export default InjectObserver(CashFlow);
