import React, { useState, useEffect } from 'react';
import Page from '../../components/Page';
import {
  Paper,
  makeStyles,
  InputAdornment,
  Grid,
  Typography,
  Select,
  MenuItem,
  OutlinedInput,
  Avatar,
  IconButton
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
import MoreOptionsDeletedData from 'src/components/MoreOptionsDeletedData';
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
import AddPayment from 'src/views/sales/PaymentIn/AddPayment';
import AddOrderReceipt from 'src/views/JobWork/OrderReceipt/AddOrderReceipt';
import AddnewPaymentOut from 'src/views/purchases/PaymentOut/AddPaymentOut';
import * as Bd from '../../components/SelectedBusiness';
import AddExpenses from '../Expenses/Modal/AddExpenses';
import NoPermission from 'src/views/noPermission';
import BubbleLoader from 'src/components/loader';
import AddBackToBackPurchasesBill from 'src/views/purchases/BackToBackPurchase/BackToBackAddPurchase/index';
import Excel from 'src/icons/Excel';
import XLSX from 'xlsx';

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

const RetrieveDeletedData = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const { handleDeletedDataTransactionSearch } =
    stores.RetrieveDeletedDataStore;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);
  let [deletedData, setDeletedData] = useState([]);
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
  const { OpenAddBackToBackPurchaseBill } = toJS(
    stores.BackToBackPurchaseStore
  );

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

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
      if (!businessData.posFeatures.includes('Accounting & Audit')) {
        setFeatureAvailable(false);
      }
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

  const getDeletedDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setDeletedData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllDeletedDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    if (txnType === 'All Invoices') {
      Query = db.alltransactionsdeleted.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              createdDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              createdDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            }
          ]
        },
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.alltransactionsdeleted.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              createdDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              createdDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            {
              transactionType: { $eq: txnType }
            }
          ]
        },
        skip: skip,
        limit: limit
      });
    }

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      let response = data.map((item) => item);
      setDeletedData(response);
    });
  };

  const getAllDeletedDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (txnType === 'All Invoices') {
      Query = db.alltransactionsdeleted.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              createdDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              createdDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            }
          ]
        }
      });
    } else {
      Query = db.alltransactionsdeleted.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              createdDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              createdDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            {
              transactionType: { $eq: txnType }
            }
          ]
        }
      });
    }

    await Query.exec().then((data) => {
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
    });
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

  function deletedDateFormatter(params) {
    var dateAsString = params.data.deletedDate;
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
      headerName: 'DELETED BY',
      field: 'deletedEmployeeName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>DELETED</p>
            <p>BY</p>
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
      headerName: 'DELETED DATE',
      field: 'deletedDate',
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
      valueFormatter: deletedDateFormatter,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>DELETED</p>
            <p>DATE</p>
          </div>
        );
      }
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
      <MoreOptionsDeletedData
        menu={moreoption.moreoptionsdata}
        index={props['data']['id']}
        item={props['data']}
        id={props['data']['id']}
        component="deletedList"
      />
    );
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        setRowData(
          await handleDeletedDataTransactionSearch(
            target,
            txnType,
            dateRange.fromDate,
            dateRange.toDate
          )
        );
      } else {
        if (deletedData) {
          setRowData(deletedData);
        }
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (deletedData) {
        gridApi.setRowData(deletedData);
      }
    }
  }, [deletedData]);

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
        await getDeletedDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getExcelDeletedDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    if (txnType === 'All Invoices') {
      Query = db.alltransactionsdeleted.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              createdDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              createdDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            }
          ]
        }
      });
    } else {
      Query = db.alltransactionsdeleted.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              createdDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              createdDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            {
              transactionType: { $eq: txnType }
            }
          ]
        }
      });
    }

    let deletedData = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      deletedData = data.map((item) => item);
    });
    return deletedData;
  };

  function dateFormatterExcel(date) {
    var dateAsString = date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const getAllExcelDeletedDataByDate = async () => {
    const wb = new Workbook();

    let allData = await getExcelDeletedDataByDate(dateRange);

    let data = [];
    if (allData && allData.length > 0) {
      for (var i = 0; i < allData.length; i++) {
        const record = {
          'CREATED DATE': dateFormatterExcel(allData[i].createdDate),
          'TXN NUMBER': allData[i].sequenceNumber,
          'TXN TYPE': allData[i].transactionType,
          AMOUNT: parseFloat(allData[i].total).toFixed(2),
          'BALANCE DUE': parseFloat(allData[i].balance).toFixed(2),
          'DELETED DATE': dateFormatterExcel(allData[i].deletedDate)
        };
        data.push(record);
      }
    } else {
      const record = {
        'CREATED DATE': '',
        'TXN NUMBER': '',
        'TXN TYPE': '',
        'DELETED BY': '',
        AMOUNT: '',
        'BALANCE DUE': '',
        'DELETED DATE': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Deleted Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Deleted Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'All_Deleted_Report';

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

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable ? (
            <div>
              <Page className={classes.root} title="Retrieve Deleted Data">
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
                    className={[
                      classes.sectionHeader,
                      classes.categoryActionWrapper
                    ]}
                  >
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h4">Transaction</Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Grid item xs={11} style={{ display: 'flex' }}>
                        {String(
                          localStorage.getItem('isJewellery')
                        ).toLowerCase() === 'true' ? (
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
                            <MenuItem value={'All Invoices'}>
                              All Invoices
                            </MenuItem>
                            <MenuItem value={'Sales'}>Sales</MenuItem>
                            <MenuItem value={'Sales Return'}>
                              Sales Return
                            </MenuItem>
                            <MenuItem value={'Payment In'}>Payment In</MenuItem>
                            <MenuItem value={'Sales Quotation'}>
                              Sales Quotation
                            </MenuItem>
                            <MenuItem value={'Sale Order'}>Sale Order</MenuItem>
                            <MenuItem value={'Delivery Challan'}>
                              Delivery Challan
                            </MenuItem>
                            <MenuItem value={'Job Work Order - In'}>
                              Job Work Order - In
                            </MenuItem>
                            <MenuItem value={'Expenses'}>Expenses</MenuItem>
                            <MenuItem value={'Purchases'}>Purchases</MenuItem>
                            <MenuItem value={'Purchases Return'}>
                              Purchases Return
                            </MenuItem>
                            <MenuItem value={'Payment Out'}>
                              Payment Out
                            </MenuItem>
                            <MenuItem value={'Purchase Order'}>
                              Purchase Order
                            </MenuItem>
                            <MenuItem value={'Approval'}>Approval</MenuItem>
                            <MenuItem value={'Job Work Order - Out'}>
                              Job Work Order - Out
                            </MenuItem>
                            <MenuItem value={'Work Order Receipt'}>
                              Work Order Receipt
                            </MenuItem>
                          </Select>
                        ) : (
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
                            <MenuItem value={'All Invoices'}>
                              All Invoices
                            </MenuItem>
                            <MenuItem value={'Sales'}>Sales</MenuItem>
                            <MenuItem value={'Sales Return'}>
                              Sales Return
                            </MenuItem>
                            <MenuItem value={'Payment In'}>Payment In</MenuItem>
                            <MenuItem value={'Sales Quotation'}>
                              Sales Quotation
                            </MenuItem>
                            <MenuItem value={'Sale Order'}>Sale Order</MenuItem>
                            <MenuItem value={'Delivery Challan'}>
                              Delivery Challan
                            </MenuItem>
                            <MenuItem value={'Job Work Order - In'}>
                              Job Work Order - In
                            </MenuItem>
                            <MenuItem value={'Expenses'}>Expenses</MenuItem>
                            <MenuItem value={'Purchases'}>Purchases</MenuItem>
                            <MenuItem value={'Purchases Return'}>
                              Purchases Return
                            </MenuItem>
                            <MenuItem value={'Payment Out'}>
                              Payment Out
                            </MenuItem>
                            <MenuItem value={'Purchase Order'}>
                              Purchase Order
                            </MenuItem>
                          </Select>
                        )}
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={4} align="right">
                      <Grid
                        container
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
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
                    <Grid item xs={1}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        className="category-actions-right"
                      >
                        <Avatar>
                          <IconButton
                            onClick={() => getAllExcelDeletedDataByDate()}
                          >
                            <Excel fontSize="inherit" />
                          </IconButton>
                        </Avatar>
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
                          templateActionRenderer: TemplateActionRenderer
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
              {OpenAddBackToBackPurchaseBill ? (
                <AddBackToBackPurchasesBill />
              ) : null}
            </div>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};
export default InjectObserver(RetrieveDeletedData);