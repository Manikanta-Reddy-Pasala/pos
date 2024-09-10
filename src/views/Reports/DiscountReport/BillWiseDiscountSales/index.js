import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar,
  TextField
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import * as Db from '../../../../RxDb/Database/Database';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import * as moment from 'moment';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import dateFormat from 'dateformat';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';

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
  texthead: {
    textColor: '#86ca94',
    marginLeft: theme.spacing(2)
  },
  text: { textColor: '#faab53' },
  plus: {
    margin: 6,
    paddingTop: 23,
    fontSize: '20px'
  },
  headerRoot: {
    minWidth: 200,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    padding: '3px 0px 0px 8px'
  }
}));

const BillWiseDiscountSales = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();
  const [custSub, setCustSub] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [salesData, setSalesData] = useState([]);
  let [onChange, setOnChange] = useState(false);
  let [allSaleData, setAllSaleData] = useState([]);

  const store = useStore();

  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);

  const [limit] = useState(10);

  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } =
    toJS(store.SalesAddStore);
  const { openEWayGenerateModal } = toJS(stores.EWayStore);
  const { productDialogOpen } = toJS(stores.ProductStore);
  const { viewOrEditItem, resetEWayLaunchFlag } = store.SalesAddStore;
  const { handleOpenEWayGenerateModal } = stores.EWayStore;

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 500);

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
    suppressHorizontalScroll: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  function dateFormatter(params) {
    var dateAsString = params.data.invoice_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      viewOrEditItem(event.data);
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'INVOICE NO',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'invoice_date',
      valueFormatter: dateFormatter,
      // filter:false,
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
      headerName: 'AMOUNT',
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>AMOUNT</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['total_amount']).toFixed(2);
        return result;
      }
    },
    {
      headerName: 'AMOUNT',
      field: 'discount_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>DISCOUNT</p>
            <p>AMOUNT</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        let itemsList = data['item_list'];

        for (let item of itemsList) {
          result += parseFloat(item.discount_amount || 0);
        }

        return parseFloat(result).toFixed(2);
      }
    }
  ]);

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

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function getDiscountData(data) {
    let result = 0;
    let itemsList = data['item_list'];

    for (let item of itemsList) {
      result += parseFloat(item.discount_amount);
    }

    return parseFloat(result);
  }

  const getDataFromSales = async () => {
    const wb = new Workbook();

    let allSalesData = await getAllTodaySalesData();
    let data = [];
    if (allSalesData && allSalesData.length > 0) {
      for (var i = 0; i < allSalesData.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(allSalesData[i].invoice_date),
          'INVOICE NUMBER': allSalesData[i].sequenceNumber,
          CUSTOMER: allSalesData[i].customer_name,
          'TOTAL AMOUNT': allSalesData[i].total_amount,
          'DISCOUNT AMOUNT': getDiscountData(allSalesData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'INVOICE NUMBER': '',
        CUSTOMER: '',
        'TOTAL AMOUNT': '',
        'DISCOUNT AMOUNT': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Bill Wise Disc Sale Sheet');

    // console.log('test:: ws::', ws);
    wb.Sheets['Bill Wise Disc Sale Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Bill_Wise_Disc_Sale_Report';

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

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();

  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [fromDate, setFromDate] = React.useState();
  const [toDate, setToDate] = React.useState();

  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);

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
        getSaleDataBySearch(target, fromDate, toDate);
      } else {
        getSaleDataByDate(fromDate, toDate);
      }
    }
  };

  const calculateAggrigatedValues = async (txnData) => {
    let totalSalesAmount = 0;
    let totalDiscountAmount = 0;

    txnData.forEach((res) => {
      totalSalesAmount += res.total_amount;
      totalDiscountAmount += getDiscountData(res);
    });

    //set env variables
    setTotalSalesAmount(parseFloat(totalSalesAmount).toFixed(2) || 0);
    setTotalDiscountAmount(parseFloat(totalDiscountAmount).toFixed(2) || 0);
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await getTransactionData();
      console.log(transaction);
    }

    fetchData();
    // Setting From and To Dates for today
    setFromDate(formatDate(firstThisMonth));
    setToDate(formatDate(todayDate));
    setOnChange(true);

    setTimeout(() => setLoadingShown(false), 200);
    return () => custSub.map((sub) => sub.unsubscribe());
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Discount Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && fromDate && toDate) {
        setOnChange(false);
        await getSaleDataByDate(fromDate, toDate);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getSaleDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },

      {
        invoice_date: {
          $gte: dateFormat(fromDate, 'yyyy-mm-dd')
        }
      },
      {
        invoice_date: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        discount_percent: {
          $gt: 0
        }
      },
      {
        updatedAt: { $exists: true }
      }
    ];

    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSaleDataByDate(fromDate, toDate);
    }

    Query = db.sales.find({
      selector: {
        $and: filterArray
      },
      sort: [{ invoice_date: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setSalesData(response);
      calculateAggrigatedValues(response);
    });
  };

  const getAllTodaySalesData = async () => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let response = [];
    let filterArray = [
      { businessId: { $eq: businessData.businessId } },

      {
        invoice_date: {
          $gte: dateFormat(fromDate, 'yyyy-mm-dd')
        }
      },
      {
        invoice_date: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        discount_percent: {
          $gt: 0
        }
      },
      {
        updatedAt: { $exists: true }
      }
    ];

    Query = db.sales.find({
      selector: {
        $and: filterArray
      },
      sort: [{ invoice_date: 'asc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      response = data.map((item) => item);
    });

    return response;
  };

  const getAllSaleDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },

      {
        invoice_date: {
          $gte: dateFormat(fromDate, 'yyyy-mm-dd')
        }
      },
      {
        invoice_date: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        discount_percent: {
          $gt: 0
        }
      },
      {
        updatedAt: { $exists: true }
      }
    ];

    Query = db.sales.find({
      selector: {
        $and: filterArray
      },
      sort: [{ invoice_date: 'desc' }]
    });

    Query = db.sales.find({
      selector: {
        $and: filterArray
      },
      sort: [{ invoice_date: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data
        .map((item) => {
          let output = {};

          output.total_amount = item.total_amount;
          output.balance_amount = item.balance_amount;

          ++count;
          return output;
        })
        .reduce(
          (a, b) => {
            let data = toJS(b);

            a.paid = parseFloat(
              parseFloat(a.paid) +
                (parseFloat(data.total_amount) -
                  parseFloat(data.balance_amount))
            ).toFixed(2);

            a.unPaid = parseFloat(
              parseFloat(a.unPaid) + parseFloat(data.balance_amount)
            ).toFixed(2);

            return a;
          },
          {
            paid: 0,
            unPaid: 0
          }
        );

      setAllSaleData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getSaleDataBySearch = async (value, fromDate, toDate) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSaleDataBySearch(value);
    }

    let data;

    await db.sales
      .find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { sequenceNumber: { $regex: regexp } },
                {
                  discount_percent: {
                    $gt: 0
                  }
                },
                {
                  invoice_date: {
                    $gte: dateFormat(fromDate, 'yyyy-mm-dd')
                  }
                },
                {
                  invoice_date: {
                    $lte: dateFormat(toDate, 'yyyy-mm-dd')
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { customer_name: { $regex: regexp } },
                {
                  discount_percent: {
                    $gt: 0
                  }
                },
                {
                  invoice_date: {
                    $gte: dateFormat(fromDate, 'yyyy-mm-dd')
                  }
                },
                {
                  invoice_date: {
                    $lte: dateFormat(toDate, 'yyyy-mm-dd')
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { payment_type: { $regex: regexp } },
                {
                  discount_percent: {
                    $gt: 0
                  }
                },
                {
                  invoice_date: {
                    $gte: dateFormat(fromDate, 'yyyy-mm-dd')
                  }
                },
                {
                  invoice_date: {
                    $lte: dateFormat(toDate, 'yyyy-mm-dd')
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { total_amount: { $eq: parseFloat(value) } },
                {
                  discount_percent: {
                    $gt: 0
                  }
                },
                {
                  invoice_date: {
                    $gte: dateFormat(fromDate, 'yyyy-mm-dd')
                  }
                },
                {
                  invoice_date: {
                    $lte: dateFormat(toDate, 'yyyy-mm-dd')
                  }
                }
              ]
            }
          ]
        },
        skip: skip,
        limit: limit,
        sort: [{ invoice_date: 'desc' }]
      })
      .exec()
      .then((documents) => {
        data = documents.map((item) => item);
        setSalesData(data);
        calculateAggrigatedValues(data);
      });
  };

  const getAllSaleDataBySearch = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    var Query;
    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    Query = db.sales.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } },
              {
                discount_percent: {
                  $gt: 0
                }
              },
              {
                invoice_date: {
                  $gte: dateFormat(fromDate, 'yyyy-mm-dd')
                }
              },
              {
                invoice_date: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customer_name: { $regex: regexp } },
              {
                discount_percent: {
                  $gt: 0
                }
              },
              {
                invoice_date: {
                  $gte: dateFormat(fromDate, 'yyyy-mm-dd')
                }
              },
              {
                invoice_date: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              {
                discount_percent: {
                  $gt: 0
                }
              },
              {
                invoice_date: {
                  $gte: dateFormat(fromDate, 'yyyy-mm-dd')
                }
              },
              {
                invoice_date: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              {
                discount_percent: {
                  $gt: 0
                }
              },
              {
                invoice_date: {
                  $gte: dateFormat(fromDate, 'yyyy-mm-dd')
                }
              },
              {
                invoice_date: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              }
            ]
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        ++count;
      });

      setAllSaleData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 60 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 60 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    BILL WISE DISCOUNT (SALES)
                  </Typography>
                </div>
              </div>

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
                          setFromDate(formatDate(e.target.value));
                          setOnChange(true);
                          setCurrentPage(1);
                          setTotalPages(1);
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
                        onChange={(e) => {
                          setToDate(formatDate(e.target.value));
                          setOnChange(true);
                          setCurrentPage(1);
                          setTotalPages(1);
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </form>
                  </div>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="right"
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={3}></Grid>
                <Grid item xs={12} sm={3}></Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  align="right"
                  className={classes.categoryActionWrapper}
                >
                  <Grid container direction="row" alignItems="center">
                    <Grid item xs={10}>
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
                    <Grid item xs={2} className="category-actions-right">
                      <Avatar>
                        <IconButton onClick={() => getDataFromSales()}>
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
                  height: height - 256 + 'px'
                }}
                className=" blue-theme"
              >
                <div
                  id="sales-invoice-grid"
                  style={{ height: '95%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    paginationPageSize={10}
                    suppressMenuHide={true}
                    rowData={salesData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    headerHeight={40}
                    rowClassRules={rowClassRules}
                    suppressPaginationPanel={true}
                    suppressScrollOnNewData={true}
                    onCellClicked={handleCellClicked}
                    overlayLoadingTemplate={
                      '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                    }
                    overlayNoRowsTemplate={
                      '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                    }
                  ></AgGridReact>
                  <div
                    style={{
                      display: 'flex',
                      float: 'right',
                      marginTop: '4px'
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
              <div>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginLeft: '15px',
                      marginTop: '15px'
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      style={{ display: 'flex', flexDirection: 'row' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Sale Amount : {totalSalesAmount}{' '}
                        </Typography>
                      </Grid>
                      <Grid item style={{ marginLeft: '20px' }}>
                        <Typography>
                          Total Discount Amount : {totalDiscountAmount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Paper>
          ) : (
            // </Paper>
            <NoPermission />
          )}
        </div>
      )}
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(BillWiseDiscountSales);