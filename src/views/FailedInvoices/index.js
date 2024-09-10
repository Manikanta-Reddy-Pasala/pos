import React, { useState, useEffect, useRef } from 'react';
import Page from '../../components/Page';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Select,
  MenuItem,
  OutlinedInput
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../components/controls/index';
import * as Db from '../../RxDb/Database/Database';
import moreoption from '../../components/Options';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import './sale.css';
import * as moment from 'moment';
import DateRangePicker from '../../components/controls/DateRangePicker';
import dateFormat from 'dateformat';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../icons/svg/left_arrow.svg';
import right_arrow from '../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../icons/svg/last_page_arrow.svg';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddSalesQuotation from 'src/views/sales/SalesQuotation/AddSalesQuotation';
import AddSaleOrder from 'src/views/sales/SaleOrder/AddSaleOrder';
import AddDeliveryChallan from 'src/views/sales/DeliveryChallan/AddDeliveryChallan';
import AddApproval from 'src/views/sales/Approval/AddApproval';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import AddPurchaseOrder from 'src/views/purchases/PurchaseOrder/AddPurchaseOrder';
import AddJobWorkIn from 'src/views/JobWork/OrderIn';
import AddOrderInvoice from 'src/views/JobWork/OrderInvoice';
import AddPayment from '../sales/PaymentIn/AddPayment';
import AddOrderReceipt from '../JobWork/OrderReceipt/AddOrderReceipt';
import AddnewPaymentOut from 'src/views/purchases/PaymentOut/AddPaymentOut';
import * as Bd from '../../components/SelectedBusiness';
import AddExpenses from '../Expenses/Modal/AddExpenses';
import MoreOptionsFailedData from 'src/components/MoreOptionsFailedData';

const useStyles = makeStyles((theme) => ({
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

  storebtn: {
    borderTop: '1px solid #d8d8d8',
    borderRadius: 'initial',
    borderBottom: '1px solid #d8d8d8',
    paddingLeft: '12px',
    paddingRight: '12px',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 5px 7px 5px'
  },
  onlinebtn: {
    // paddingRight: '14px',
    // paddingLeft: '12px',
    border: '1px solid #d8d8d8',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 'initial',
    borderTopLeftRadius: 'initial',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 14px 7px 12px'
  },
  allbtn: {
    border: '1px solid #d8d8d8',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 'initial',
    borderTopRightRadius: 'initial',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 5px 7px 5px'
  }
}));

const useHeaderStyles = makeStyles((theme) => ({
  paperRoot: {
    margin: theme.spacing(1),
    borderRadius: 6
  },
  pageHeader: {
    padding: theme.spacing(2)
  },
  pageIcon: {
    display: 'inline-block',
    padding: theme.spacing(2),
    color: '#3c44b1'
  },
  pageTitle: {
    paddingLeft: theme.spacing(4),
    '& .MuiTypography-subtitle2': {
      opacity: '0.6'
    }
  },
  mySvgStyle: {
    fillColor: theme.palette.primary.main
  },
  card: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    flexDirection: 'row'
  },

  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  root: {
    minWidth: 200,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    padding: '3px 0px 0px 8px'
  },
  texthead: {
    textColor: '#86ca94',
    marginLeft: theme.spacing(2)
  },
  text: { textColor: '#faab53' },
  plus: {
    margin: 6,
    paddingTop: 23,
    fontSize: '20px'
  }
}));

const FailedInvoices = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  let componentRef = useRef();
  const [custSub, setCustSub] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);
  let [failedData, setFailedData] = useState([]);
  let [onChange, setOnChange] = useState(true);
  const [txnType, setTxnType] = useState('All Invoices');
  const { openAddSalesInvoice } = toJS(stores.SalesAddStore);
  const { OpenAddsalesQuotationInvoice } = toJS(stores.SalesQuotationAddStore);
  const { OpenAddSaleOrderInvoice } = toJS(stores.SaleOrderStore);
  const { OpenAddDeliveryChallanInvoice } = toJS(stores.DeliveryChallanStore);
  const { OpenAddApprovalInvoice } = toJS(stores.ApprovalsStore);
  const { openAddSalesReturn } = toJS(stores.ReturnsAddStore);
  const { OpenAddPurchaseBill } = toJS(stores.PurchasesAddStore);
  const { OpenAddPurchasesReturn } = toJS(stores.PurchasesReturnsAddStore);
  const { OpenAddPurchaseOrder } = toJS(stores.PurchaseOrderStore);
  const { OpenAddJobWorkInvoice } = toJS(stores.JobWorkInStore);
  const { OpenNewOrderInvoice } = toJS(stores.JobWorkStore);
  const { OpenAddPaymentIn } = toJS(stores.PaymentInStore);
  const { openNewOrderReceipt } = toJS(stores.JobWorkReceiptStore);
  const { OpenAddPaymentOut } = toJS(stores.PaymentOutStore);
  const { addExpensesDialogue } = toJS(stores.ExpensesStore);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const [dateRange, setDateRange] = useState({
    fromDate: formatDate(firstThisMonth),
    toDate: formatDate(todayDate)
  });

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    suppressHorizontalScroll: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const getFailedDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setFailedData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllFailedDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    if (txnType === 'All Invoices') {
      
    } else {
      
    }

  /*  await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      let response = data.map((item) => item);
      setFailedData(response);
    });*/
  };

  const getAllFailedDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (txnType === 'All Invoices') {
      
    } else {
      
    }

   /* await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        let output = {};

        output.total_amount = item.total_amount;
        output.balance_amount = item.balance_amount;
        output.status = item.status;

        ++count;
        return output;
      });

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    }); */
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);

    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const onFirstPageClicked = () => {
    if (gridApi) {
      setCurrentPage(1);
      setOnChange(true);
    }
  };

  const onLastPageClicked = () => {
    if (gridApi) {
      setCurrentPage(totalPages);
      setOnChange(true);
    }
  };

  const onPreviousPageClicked = () => {
    if (gridApi) {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        setOnChange(true);
      }
    }
  };

  const onNextPageClicked = () => {
    if (gridApi) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        setOnChange(true);
      }
    }
  };

  function dateFormatter(params) {
    var dateAsString = params.data.createdDate;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function failedDateFormatter(params) {
    var dateAsString = params.data.failedDate;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'CREATED DATE',
      field: 'createdDate',
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
      filter: 'agDateColumnFilter',
      valueFormatter: dateFormatter,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CREATED</p>
            <p>DATE</p>
          </div>
        );
      }
    },
    {
      headerName: 'TXN NUMBER',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TXN</p>
            <p>NUMBER</p>
          </div>
        );
      }
    },
    {
      headerName: 'TXN TYPE',
      field: 'transactionType',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TXN</p>
            <p>TYPE</p>
          </div>
        );
      }
    },
    {
      headerName: 'FAILED ON',
      field: 'failedDate',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>FAILED</p>
            <p>ON</p>
          </div>
        );
      }
    },
    {
      headerName: 'AMOUNT',
      field: 'total',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'BALANCE DUE',
      field: 'balance',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>BALANCE</p>
            <p>DUE</p>
          </div>
        );
      }
    },
    {
      headerName: 'REASON',
      field: 'reason',
      filter: false
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      cellRenderer: 'templateActionRenderer'
    }
  ]);

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const TemplateActionRenderer = (props) => {
    return (
      <MoreOptionsFailedData
        menu={moreoption.moreoptionsdata}
        index={props['data']['id']}
        item={props['data']}
        id={props['data']['id']}
        component="failedList"
      />
    );
  };

  const TempalteStatusRenderer = (props) => {
    return (
      <div>
        <IconButton disableRipple disableFocusRipple></IconButton>
      </div>
    );
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        // Handle search with custom pagination
      } else {
        if (failedData) {
          setRowData(failedData);
        }
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (failedData) {
        gridApi.setRowData(failedData);
      }
    }
  }, [failedData]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setRowData([]);
        await getFailedDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [onChange]);

  return (
    <div>
      <Page className={classes.root} title="Failed Invoices">
        {/* <PageHeader /> */}

        {/* ------------------------------------------- HEADER -------------------------------------------- */}

        <Paper className={headerClasses.paperRoot}>
          <Grid container>
            <Grid item xs={12} sm={12} className={headerClasses.card}>
              <div
                style={{
                  marginRight: '10px',
                  marginTop: '20px',
                  cursor: 'pointer'
                }}
              >
                <DateRangePicker
                  value={dateRange}
                  onChange={(dateRange) => {
                    if (
                      moment(dateRange.fromDate).isValid() &&
                      moment(dateRange.toDate).isValid()
                    ) {
                      setDateRange(dateRange);
                    } else {
                      setDateRange({
                        fromDate: new Date(),
                        toDate: new Date()
                      });
                    }
                    setOnChange(true);
                    setCurrentPage(1);
                    setTotalPages(1);
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Paper>

        {/* -------------------------------------------- BODY ------------------------------------------------- */}

        <Paper className={classes.paperRoot}>
          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            className={classes.sectionHeader}
          >
            <Grid item xs={12} sm={4}>
              <Typography variant="h4">Transaction</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Grid item xs={11} style={{ display: 'flex' }}>
                  <Select
                    displayEmpty
                    value={txnType}
                    input={
                      <OutlinedInput
                        style={{ width: '100%', marginLeft: '15px' }}
                      />
                    }
                    inputProps={{ 'aria-label': 'Without label' }}
                    onChange={(e) => {
                      setTxnType(e.target.value);
                      setOnChange(true);
                      setCurrentPage(1);
                      setTotalPages(1);
                    }}
                  >
                    <MenuItem value={'All Invoices'}>All Invoices</MenuItem>
                    <MenuItem value={'Sales'}>Sales</MenuItem>
                    <MenuItem value={'Sales Return'}>Sales Return</MenuItem>
                    <MenuItem value={'Payment In'}>Payment In</MenuItem>
                    <MenuItem value={'Expenses'}>Expenses</MenuItem>
                    <MenuItem value={'Purchases'}>Purchases</MenuItem>
                    <MenuItem value={'Purchases Return'}>
                      Purchases Return
                    </MenuItem>
                    <MenuItem value={'Payment Out'}>Payment Out</MenuItem>
                  </Select>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5} align="right">
              <Grid container direction="row" spacing={2} alignItems="center">
                <Grid item xs={12} align="right">
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
              </Grid>
            </Grid>
          </Grid>
          <div style={{ width: '100%', height: height - 242 + 'px' }}>
            <div
              id="sales-invoice-grid"
              style={{ height: '95%', width: '100%' }}
              className="ag-theme-material"
            >
              <AgGridReact
                onGridReady={onGridReady}
                paginationPageSize={10}
                suppressMenuHide={true}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                headerHeight={40}
                suppressPaginationPanel={true}
                suppressScrollOnNewData={true}
                rowClassRules={rowClassRules}
                overlayLoadingTemplate={
                  '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                }
                overlayNoRowsTemplate={
                  '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                }
                frameworkComponents={{
                  templateActionRenderer: TemplateActionRenderer,
                  tempalteStatusRenderer: TempalteStatusRenderer
                }}
              ></AgGridReact>
              <div
                style={{
                  display: 'flex',
                  float: 'right',
                  marginTop: '5px',
                  marginBottom: '5px'
                }}
              >
                <img
                  alt="Logo"
                  src={first_page_arrow}
                  width="20px"
                  height="20px"
                  style={{ marginRight: '10px' }}
                  onClick={() => onFirstPageClicked()}
                />
                <img
                  alt="Logo"
                  src={right_arrow}
                  width="20px"
                  height="20px"
                  onClick={() => onPreviousPageClicked()}
                />
                <p
                  style={{
                    marginLeft: '10px',
                    marginRight: '10px',
                    marginTop: '2px'
                  }}
                >
                  Page {currentPage} of {totalPages}
                </p>
                <img
                  alt="Logo"
                  src={left_arrow}
                  width="20px"
                  height="20px"
                  style={{ marginRight: '10px' }}
                  onClick={() => onNextPageClicked()}
                />
                <img
                  alt="Logo"
                  src={last_page_arrow}
                  width="20px"
                  height="20px"
                  onClick={() => onLastPageClicked()}
                />
              </div>
            </div>
          </div>
        </Paper>
      </Page>
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {OpenAddsalesQuotationInvoice ? <AddSalesQuotation /> : null}
      {OpenAddSaleOrderInvoice ? <AddSaleOrder /> : null}
      {OpenAddDeliveryChallanInvoice ? <AddDeliveryChallan /> : null}
      {OpenAddApprovalInvoice ? <AddApproval /> : null}
      {openAddSalesReturn ? <AddCreditNote /> : null}
      {OpenAddPurchaseBill ? <AddPurchasesBill /> : null}
      {OpenAddPurchasesReturn ? <AddDebitNote /> : null}
      {OpenAddPurchaseOrder ? <AddPurchaseOrder /> : null}
      {OpenAddJobWorkInvoice ? <AddJobWorkIn /> : null}
      {OpenNewOrderInvoice ? <AddOrderInvoice /> : null}
      {OpenAddPaymentIn ? <AddPayment /> : null}
      {openNewOrderReceipt ? <AddOrderReceipt /> : null}
      {OpenAddPaymentOut ? <AddnewPaymentOut /> : null}
      {addExpensesDialogue ? <AddExpenses /> : null}
    </div>
  );
};
export default InjectObserver(FailedInvoices);