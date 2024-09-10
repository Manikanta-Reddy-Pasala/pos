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
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import './einvoice.css';
import * as moment from 'moment';
import DateRangePicker from '../../components/controls/DateRangePicker';
import dateFormat from 'dateformat';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../icons/svg/left_arrow.svg';
import right_arrow from '../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../icons/svg/last_page_arrow.svg';
import {
  EinvoiceTransactionTypes,
  EinvoiceStatusTypes
} from '../EInvoice/einvoicedata';
import * as Bd from '../../components/SelectedBusiness';
import MoreOptionsEInvoice from 'src/components/MoreOptionsEInvoice';
import { toJS } from 'mobx';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';
import BubbleLoader from 'src/components/loader';
import NoPermission from 'src/views/noPermission';
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

const EInvoice = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const [gridApi, setGridApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);
  let [invoiceData, setInvoiceData] = useState([]);
  let [onChange, setOnChange] = useState(true);
  const [einvoiceTxnType, setEinvoiceTxnType] = useState('Invoice');
  const [einvoiceStatusType, setEinvoiceStatusType] = useState('Pending');

  const [gridColumnApi, setGridColumnApi] = useState(null);

  const { openAddSalesInvoice } = toJS(stores.SalesAddStore);
  const { transaction } = toJS(stores.TransactionStore);
  let enableEinvoice = transaction.enableEinvoice;

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

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

  const getInvoiceDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let skip = 0;
    setRowData([]);
    setInvoiceData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllInvoiceDataByDate(dateRange);
    }

    if (einvoiceTxnType === 'Invoice') {
      Query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              invoice_date: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            { einvoiceBillStatus: { $eq: einvoiceStatusType } },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }],
        skip: skip,
        limit: limit
      });
    }

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let temp = item;

        temp.item_count = 0;

        if (item.item_list) {
          temp.item_count = item.item_list.length;
        }

        return temp;
      });
      setInvoiceData(response);
    });
  };

  const getAllInvoiceDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (einvoiceTxnType === 'Invoice') {
      Query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              invoice_date: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            { einvoiceBillStatus: { $eq: einvoiceStatusType } },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      });
    }

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getSalesSearchWithDateForEInvoice = async (
    value,
    fromDate,
    toDate,
    status
  ) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();
    let query;

    let skip = 0;
    setRowData([]);
    setInvoiceData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSalesSearchWithDateForEInvoice(value, fromDate, toDate, status);
    }

    query = await db.sales.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customer_name: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customerGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { irnNo: { $regex: regexp } }
            ]
          }
        ]
      },
      sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let temp = item;

        temp.item_count = 0;

        if (item.item_list) {
          temp.item_count = item.item_list.length;
        }

        return temp;
      });
      setInvoiceData(response);
    });
  };

  const getAllSalesSearchWithDateForEInvoice = async (
    value,
    fromDate,
    toDate,
    status
  ) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();
    let query;

    query = await db.sales.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customer_name: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customerGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { irnNo: { $regex: regexp } }
            ]
          }
        ]
      }
    });

    await query.exec().then((data) => {
      let count = data.length;

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

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
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
            <p>DATE</p>
          </div>
        );
      }
    },
    {
      headerName: 'TRANSACTION NO',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'CUSTOMER NAME',
      field: 'customer_name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'CUSTOMER GSTN',
      field: 'customerGSTNo',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TOTAL',
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'IRN DETAILS',
      field: 'irnNo',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      hide: true,
      suppressToolPanel: true,
      valueGetter: (params) => {
        let data = params['data'];
        let result = '';

        result += 'IRN No: ' + data['irnNo'] + '\n';
        result += 'Date: ' + data['einvoiceBillGeneratedDate'];

        return result;
      }
    },
    {
      headerName: 'ERROR',
      field: 'eInvoiceErrorMessage',
      width: 150,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      hide: true,
      suppressToolPanel: true
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
    if ('Invoice' === einvoiceTxnType) {
      return (
        <MoreOptionsEInvoice
          menu={moreoption.moreoptionsdata}
          index={props['data']['invoice_id']}
          item={props['data']}
          id={props['data']['invoice_id']}
          type={einvoiceTxnType}
          status={einvoiceStatusType}
          component="eWayList"
        />
      );
    }
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        if ('Invoice' === einvoiceTxnType) {
          getSalesSearchWithDateForEInvoice(
            target,
            dateRange?.fromDate,
            dateRange?.toDate,
            einvoiceStatusType
          );
        }
      } else {
        getInvoiceDataByDate(dateRange);
      }
    } else {
      getInvoiceDataByDate(dateRange);
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (invoiceData) {
        gridApi.setRowData(invoiceData);
      }
    }
  }, [invoiceData]);

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
        await getInvoiceDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [onChange]);

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
      if (!businessData.posFeatures.includes('E-Invoice')) {
        setFeatureAvailable(false);
      }
    }
  };

  const getExcelInvoiceDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (einvoiceTxnType === 'Invoice') {
      Query = db.sales.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoice_date: {
                $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
              }
            },
            {
              invoice_date: {
                $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
              }
            },
            {
              sortingNumber: { $exists: true }
            }
          ]
        },
        sort: [{ sortingNumber: 'asc' }]
      });
    }

    let response = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      response = data.map((item) => item);
    });
    return response;
  };

  const getAllExcelEInvoiceDataByDate = async () => {
    const wb = new Workbook();

    let allData = await getExcelInvoiceDataByDate(dateRange);

    let data = [];
    if (allData && allData.length > 0) {
      for (var i = 0; i < allData.length; i++) {
        const record = {
          DATE: dateFormatterExcel(allData[i].invoice_date),
          'TXN NUMBER': allData[i].sequenceNumber,
          'CUSTOMER NAME': allData[i].customer_name,
          'CUSTOMER GSTN': allData[i].customerGSTNo,
          TOTAL: parseFloat(allData[i].total_amount).toFixed(2),
          'E-INVOICE STATUS': allData[i].einvoiceBillStatus,
          'IRN DETAILS':
            allData[i].einvoiceBillStatus === 'Completed' ||
            allData[i].einvoiceBillStatus === 'Cancelled'
              ? getEInvoiceDetails(allData[i])
              : '',
          ERROR: allData[i].eInvoiceErrorMessage
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'TXN NUMBER': '',
        'CUSTOMER NAME': '',
        'CUSTOMER GSTN': '',
        TOTAL: '',
        'E-INVOICE STATUS': '',
        'IRN DETAILS': '',
        ERROR: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('EInvoice Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['EInvoice Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'All_EInvoice_Report';

    download(url, fileName + '.xlsx');
  };

  const getEInvoiceDetails = (data) => {
    let result = '';

    result += 'IRN No: ' + data['irnNo'] + '\n';
    result += 'Date: ' + data['einvoiceBillGeneratedDate'];

    return result;
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

  function dateFormatterExcel(date) {
    var dateAsString = date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable && enableEinvoice ? (
            <div>
              <Page className={classes.root} title="E-Invoice">
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
                    <Grid item xs={12} sm={2}>
                      <Typography variant="h4">Transaction</Typography>
                    </Grid>

                    <Grid item xs={12} sm={2}>
                      <Grid item xs={11} style={{ display: 'flex' }}>
                        <Select
                          displayEmpty
                          value={einvoiceTxnType}
                          input={
                            <OutlinedInput
                              style={{ width: '100%', marginLeft: '15px' }}
                            />
                          }
                          inputProps={{ 'aria-label': 'Without label' }}
                          onChange={(e) => {
                            setEinvoiceTxnType(e.target.value);

                            setOnChange(true);
                            setCurrentPage(1);
                            setTotalPages(1);
                          }}
                        >
                          {EinvoiceTransactionTypes.map((menutxt) => (
                            <MenuItem value={menutxt}>{menutxt}</MenuItem>
                          ))}
                        </Select>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Grid item xs={11} style={{ display: 'flex' }}>
                        <Select
                          displayEmpty
                          value={einvoiceStatusType}
                          input={
                            <OutlinedInput
                              style={{ width: '100%', marginLeft: '15px' }}
                            />
                          }
                          inputProps={{ 'aria-label': 'Without label' }}
                          onChange={(e) => {
                            setEinvoiceStatusType(e.target.value);

                            if (
                              'Pending' === e.target.value ||
                              'Failed' === e.target.value
                            ) {
                              gridColumnApi.setColumnVisible('irnNo', false);
                            } else {
                              gridColumnApi.setColumnVisible('irnNo', true);
                            }

                            if ('Failed' === e.target.value) {
                              gridColumnApi.setColumnVisible(
                                'eInvoiceErrorMessage',
                                true
                              );
                            } else {
                              gridColumnApi.setColumnVisible(
                                'eInvoiceErrorMessage',
                                false
                              );
                            }

                            setOnChange(true);
                            setCurrentPage(1);
                            setTotalPages(1);
                          }}
                        >
                          {EinvoiceStatusTypes.map((menutxt) => (
                            <MenuItem value={menutxt}>{menutxt}</MenuItem>
                          ))}
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
                            onClick={() => getAllExcelEInvoiceDataByDate()}
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
            </div>
          ) : (
            <>
              {!enableEinvoice ? (
                <div
                  style={{
                    width: '100%',
                    marginTop: '250px',
                    textAlign: 'center'
                  }}
                >
                  <Typography variant="h5">
                    Kindly enable the E-Invoice option from the Settings page
                  </Typography>
                </div>
              ) : (
                <NoPermission />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default InjectObserver(EInvoice);