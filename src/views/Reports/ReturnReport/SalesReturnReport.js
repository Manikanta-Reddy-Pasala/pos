import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../components/controls/index';
import * as Db from '../../../RxDb/Database/Database';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../noPermission';
import * as Bd from '../../../components/SelectedBusiness';
import BubbleLoader from '../../../components/loader';
import useWindowDimensions from '../../../components/windowDimension';
import * as moment from 'moment';
import left_arrow from '../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../icons/svg/last_page_arrow.svg';
import dateFormat from 'dateformat';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 2,
    borderRadius: '12px'
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
    marginBottom: 10
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
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

const SalesReturnReport = (props) => {
  const { isPL } = props || {};

  const classes = useStyles();
  const { height } = useWindowDimensions();
  const stores = useStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(false);
  const [limit] = useState(10);

  const { handleSalesReturnSearchWithDate } = stores.ReturnsAddStore;

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [returnDetailsList, setReturnDetailsList] = useState([]);

  const { openAddSalesReturn } = toJS(stores.ReturnsAddStore);
  const { viewOrEditItem } = stores.ReturnsAddStore;

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
    var dateAsString = params.data.date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

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

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      let clone = JSON.parse(JSON.stringify(event.data));
      viewOrEditItem(clone);
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'RETURN NO',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'date',
      width: 100,
      minWidth: 120,
      // filter:false,
      valueFormatter: dateFormatter,
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
      filter: 'agDateColumnFilter'
    },
    {
      headerName: 'CUSTOMER',
      field: 'customer_name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      // headerName: 'PAYMENT TYPE',
      field: 'payment_type',
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PAYMENT</p>
            <p>TYPE</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TOTAL',
      field: 'total_amount',
      width: 90,
      minWidth: 100,
      filter: false,
      valueFormatter: (params) => {
        return params['data']['total_amount']
          ? parseFloat(params['data']['total_amount']).toFixed(2)
          : '0';
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PAID',
      field: 'paid_amount',
      filter: false,
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        return (
          (params['data']['paid_amount'] || 0) +
          (params['data']['linked_amount'] || 0)
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'BALANCE',
      field: 'balance_amount',
      width: 100,
      minWidth: 120,
      filter: false,
      valueFormatter: (params) => {
        return params['data']['balance_amount']
          ? parseFloat(params['data']['balance_amount']).toFixed(2)
          : '0';
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'STATUS',
      field: 'status',
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['balance_amount'] === 0) {
          result = 'Paid';
        } else if (data['balance_amount'] < data['total_amount']) {
          result = 'Partial';
        } else {
          result = 'Un Paid';
        }
        return result;
      },
      cellStyle: statusCellStyle,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

  function getSaleStatus(saleData) {
    let result = '';

    if (saleData.balance_amount === 0) {
      result = 'Paid';
    } else if (saleData.balance_amount < saleData.total_amount) {
      result = 'Partial';
    } else {
      result = 'Un Paid';
    }
    return result;
  }

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const getDataFromSalesReturns = async () => {
    const wb = new Workbook();
    let xlsxReturnsList = await getAllSaleReturnDataByDateXLSX(
      fromDate,
      todayDate
    );

    let data = [];
    if (xlsxReturnsList && xlsxReturnsList.length > 0) {
      for (var i = 0; i < xlsxReturnsList.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(xlsxReturnsList[i].date),
          'RETURN NO': xlsxReturnsList[i].sequenceNumber,
          CUSTOMER: xlsxReturnsList[i].customer_name,
          'PAYMENT TYPE': xlsxReturnsList[i].payment_type,
          TOTAL: xlsxReturnsList[i].total_amount
            ? xlsxReturnsList[i].total_amount
            : 0,
          PAID:
            (xlsxReturnsList[i].paid_amount || 0) +
            (xlsxReturnsList[i].linked_amount || 0),
          BALANCE: xlsxReturnsList[i].balance_amount
            ? xlsxReturnsList[i].balance_amount
            : 0,
          STATUS: getSaleStatus(xlsxReturnsList[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'RETURN NO': '',
        CUSTOMER: '',
        'PAYMENT TYPE': '',
        TOTAL: '',
        PAID: '',
        BALANCE: '',
        STATUS: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Sales Return Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Sales Return Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Sales_Return_Report';

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

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = isPL
    ? props.fromDate
    : new Date(thisYear, thisMonth, 1);
  const todayDate = isPL ? props.toDate : new Date(thisYear, thisMonth, today);

  const [fromDate, setFromDate] = React.useState();
  const [toDate, setToDate] = React.useState();

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
        if (fromDate && toDate) {
          setReturnDetailsList(
            await handleSalesReturnSearchWithDate(target, fromDate, toDate)
          );
        }
      } else {
        await getSaleReturnDataByDate(fromDate, toDate);
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
    setOnChange(true);
    setReturnDetailsList([]);
    setLoadingShown(false);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Returns Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && fromDate && toDate) {
        setOnChange(false);
        await getSaleReturnDataByDate(fromDate, toDate);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getSaleReturnDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setReturnDetailsList([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSaleReturnDataByDate(fromDate, toDate);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.salesreturn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ date: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setReturnDetailsList(response);
    });
  };

  const getAllSaleReturnDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.salesreturn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          }
        ]
      },
      sort: [{ date: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getAllSaleReturnDataByDateXLSX = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.salesreturn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          }
        ]
      },
      sort: [{ date: 'asc' }]
    });

    let response = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      response = data.map((item) => item);
    });
    return response;
  };

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 83 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 83 }}>
              {!isPL && (
                <div className={classes.content}>
                  <div className={classes.contentLeft}>
                    <Typography gutterBottom variant="h4" component="h4">
                      SALES RETURN
                    </Typography>
                  </div>
                </div>
              )}

              {!isPL ? (
                <Grid container className={classes.categoryActionWrapper}>
                  <Grid item xs={8}>
                    <div>
                      <form className={classes.blockLine} noValidate>
                        <TextField
                          id="date"
                          label="From"
                          type="date"
                          value={fromDate}
                          onChange={(e) => {
                            setCurrentPage(1);
                            setTotalPages(1);
                            setFromDate(formatDate(e.target.value));
                            setOnChange(true);
                          }}
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
                          className={classes.textField}
                          onChange={(e) => {
                            setCurrentPage(1);
                            setTotalPages(1);
                            setToDate(formatDate(e.target.value));
                            setOnChange(true);
                          }}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </form>
                    </div>
                  </Grid>
                </Grid>
              ) : (
                props.plHeader
              )}

              <Grid
                container
                direction="row"
                alignItems="center"
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={7}>
                  {/* <Typography variant="h4">Transaction</Typography> */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  align="right"
                  className={classes.categoryActionWrapper}
                >
                  <Grid container direction="row" alignItems="center">
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
                    <Grid XS={2} className="category-actions-right">
                      <Avatar>
                        <IconButton onClick={() => getDataFromSalesReturns()}>
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
              <div
                style={{
                  width: '100%',
                  height: height - 208 + 'px'
                }}
                className="blue-theme"
              >
                <div
                  id="sales-invoice-grid"
                  style={{ height: '95%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    enableRangeSelection={true}
                    paginationPageSize={10}
                    suppressMenuHide={true}
                    rowData={returnDetailsList}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    pagination={true}
                    headerHeight={40}
                    suppressPaginationPanel={true}
                    suppressScrollOnNewData={true}
                    onCellClicked={handleCellClicked}
                    overlayLoadingTemplate={
                      '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                    }
                    overlayNoRowsTemplate={
                      '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                    }
                  />
                  <div
                    style={{
                      display: 'flex',
                      float: 'right',
                      marginTop: '2px'
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
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {openAddSalesReturn ? <AddCreditNote /> : null}
    </div>
  );
};

export default InjectObserver(SalesReturnReport);
