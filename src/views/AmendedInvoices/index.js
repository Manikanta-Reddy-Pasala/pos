import React, { useState, useEffect } from 'react';
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
  OutlinedInput,
  Avatar
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
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import * as Bd from '../../components/SelectedBusiness';
import NoPermission from 'src/views/noPermission';
import BubbleLoader from 'src/components/loader';
import Excel from 'src/icons/Excel';
import XLSX from 'xlsx';
import MoreOptionsAmendedData from 'src/components/MoreOptionsAmendedData';

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

const AmendedInvoices = (props) => {
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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);
  let [amendedData, setAmendedData] = useState([]);
  let [onChange, setOnChange] = useState(true);
  const [txnType, setTxnType] = useState('Sales');
  const { openAddSalesInvoice } = toJS(stores.SalesAddStore);
  const { openAddSalesReturn } = toJS(stores.ReturnsAddStore);

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

  const getamendedDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setAmendedData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllamendedDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    if (txnType === 'Sales') {
      Query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              amendmentDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              amendmentDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            { amended: { $eq: true } }
          ]
        },
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              amendmentDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              amendmentDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            { amended: { $eq: true } }
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
      setAmendedData(response);
    });
  };

  const getAllamendedDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (txnType === 'Sales') {
      Query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              amendmentDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              amendmentDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            { amended: { $eq: true } }
          ]
        }
      });
    } else {
      Query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              amendmentDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              amendmentDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            { amended: { $eq: true } }
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
    var dateAsString = params.data.invoice_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function amendmentDateFormatter(params) {
    var dateAsString = params.data.amendmentDate;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function returnDateFormatter(params) {
    var dateAsString = params.data.date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [saleColumnDefs] = useState([
    {
      headerName: 'CREATED DATE',
      field: 'invoice_date',
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
      headerName: 'AMENDED DATE',
      field: 'amendmentDate',
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
      valueFormatter: amendmentDateFormatter,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>AMENDED</p>
            <p>DATE</p>
          </div>
        );
      }
    },
    {
      headerName: 'INVOICE NUMBER',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE</p>
            <p>NUMBER</p>
          </div>
        );
      }
    },
    {
      headerName: 'AMOUNT',
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'BALANCE DUE',
      field: 'balance_amount',
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
      field: 'amendmentReason',
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

  const [saleReturnColumnDefs] = useState([
    {
      headerName: 'CREATED DATE',
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
      valueFormatter: returnDateFormatter,
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
      headerName: 'AMENDED DATE',
      field: 'amendmentDate',
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
      valueFormatter: amendmentDateFormatter,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>AMENDED</p>
            <p>DATE</p>
          </div>
        );
      }
    },
    {
      headerName: 'RETURN NUMBER',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>RETURN</p>
            <p>NUMBER</p>
          </div>
        );
      }
    },
    {
      headerName: 'AMOUNT',
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'BALANCE DUE',
      field: 'balance_amount',
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
      field: 'amendmentReason',
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
      <MoreOptionsAmendedData
        menu={moreoption.moreoptionsdata}
        index={props['data']['sequenceNumber']}
        item={props['data']}
        id={props['data']['sequenceNumber']}
        component="amendedList"
        txnType={txnType}
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
        if (amendedData) {
          setRowData(amendedData);
        }
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (amendedData) {
        gridApi.setRowData(amendedData);
      }
    }
  }, [amendedData]);

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
        await getamendedDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getAllamendedDataByDateExcel = async (dateRange) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    if (txnType === 'Sales') {
      Query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              amendmentDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              amendmentDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            { amended: { $eq: true } }
          ]
        }
      });
    } else {
      Query = db.salesreturn.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              amendmentDate: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              amendmentDate: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            { amended: { $eq: true } }
          ]
        }
      });
    }

    let allData = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      allData = data.map((item) => item);
    });
    return allData;
  };

  function dateFormatterExcel(data) {
    var dateAsString = data.createdDate;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function cancelledDateFormatterExcel(data) {
    var dateAsString = data.cancelledDate;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const getAllExcelamendedDataByDate = async () => {
    const wb = new Workbook();

    let allData = await getAllamendedDataByDateExcel(dateRange);

    let data = [];
    if (allData && allData.length > 0) {
      for (var i = 0; i < allData.length; i++) {
        const record = {
          'CREATED DATE': dateFormatterExcel(allData[i]),
          'TXN NUMBER': allData[i].sequenceNumber,
          'TXN TYPE': allData[i].transactionType,
          'CANCELLED DATE': cancelledDateFormatterExcel(allData[i]),
          'CANCELLED TIME': getTimefromTimeStamp(allData[i].updatedAt),
          AMOUNT: parseFloat(allData[i].total).toFixed(2),
          'BALANCE DUE': parseFloat(allData[i].balance).toFixed(2),
          REASON: allData[i].reason
        };
        data.push(record);
      }
    } else {
      const record = {
        'CREATED DATE': '',
        'TXN NUMBER': '',
        'TXN TYPE': '',
        'CANCELLED DATE': '',
        'CANCELLED TIME': '',
        AMOUNT: '',
        'BALANCE DUE': '',
        REASON: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Cancelled Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Cancelled Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'All_Cancelled_Report';

    download(url, fileName + '.xlsx');
  };

  function getTimefromTimeStamp(date) {
    var timefromTimeStamp = new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: 'true'
    });
    return `${timefromTimeStamp}`;
  }

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
              <Page className={classes.root} title="Cancelled Invoices">
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
                          <MenuItem value={'Sales'}>Sales</MenuItem>
                          <MenuItem value={'Sales Return'}>
                            Sales Return
                          </MenuItem>
                        </Select>
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
                            onClick={() => getAllExcelamendedDataByDate()}
                          >
                            <Excel fontSize="inherit" />
                          </IconButton>
                        </Avatar>
                      </Grid>
                    </Grid>
                  </Grid>
                  {txnType === 'Sales' ? (
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
                          columnDefs={saleColumnDefs}
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
                  ) : (
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
                          columnDefs={saleColumnDefs}
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
                  )}
                </Paper>
              </Page>
              {openAddSalesInvoice ? <AddSalesInvoice /> : null}
              {openAddSalesReturn ? <AddCreditNote /> : null}
            </div>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};
export default InjectObserver(AmendedInvoices);