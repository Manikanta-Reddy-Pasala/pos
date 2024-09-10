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
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import PurchasesAgingPDF from 'src/views/PDF/SalesAging/SalesAgingPDF';
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

const PurchaseAgingDetails = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [custSub, setCustSub] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [purchaseData, setPurchaseData] = useState([]);
  let [onChange, setOnChange] = useState(false);
  let [allPurchaseData, setAllPurchaseData] = useState([]);

  const store = useStore();

  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);
  const { productDialogOpen } = toJS(store.ProductStore);

  const [limit] = useState(10);

  const { OpenAddPurchaseBill } = toJS(store.PurchasesAddStore);
  const { viewOrEditItem } = store.PurchasesAddStore;

  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

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
    var dateAsString = params.data.bill_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function dueDateFormatter(params) {
    var dateAsString = params.data.dueDate;
    if (dateAsString !== undefined && dateAsString !== null) {
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return '';
    }
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

    if ('vendor_bill_number' === colId) {
      viewOrEditItem(event.data);
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'BILL NO',
      field: 'vendor_bill_number',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'bill_date',
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
      headerName: 'DUE DATE',
      field: 'dueDate',
      valueFormatter: dueDateFormatter,
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
      headerName: 'VENDOR',
      field: 'vendor_name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'AGE',
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        var date1 = new Date(data.dueDate);
        var date2 = new Date(dateFormat(toDate, 'yyyy-mm-dd'));
        let Difference_In_Days = 0;

        if (date2 !== undefined && date1 !== undefined) {
          // To calculate the time difference of two dates
          var Difference_In_Time = date2.getTime() - date1.getTime();

          // To calculate the no. of days between two dates
          Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        }
        return Difference_In_Days;
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
      headerName: 'BALANCE DUE',
      field: 'balance_amount',
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data['balance_amount']).toFixed(2);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>BALANCE</p>
            <p>DUE</p>
          </div>
        );
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

  function getAge(data) {
    var date1 = new Date(data.dueDate);
    var date2 = new Date(dateFormat(toDate, 'yyyy-mm-dd'));
    let Difference_In_Days = 0;

    if (date2 !== undefined && date1 !== undefined) {
      // To calculate the time difference of two dates
      var Difference_In_Time = date2.getTime() - date1.getTime();

      // To calculate the no. of days between two dates
      Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    }
    return Difference_In_Days;
  }

  function getStatus(data) {
    let result = '';

    if (data['balance_amount'] === 0) {
      result = 'Paid';
    } else if (data['balance_amount'] < data['total_amount']) {
      result = 'Partial';
    } else {
      result = 'Un Paid';
    }
    return result;
  }

  const getExcelDataFromPurchase = async () => {
    const wb = new Workbook();

    let allPurchaseData = await getAllExcelPurchaseData();
    let data = [];
    if (allPurchaseData && allPurchaseData.length > 0) {
      for (var i = 0; i < allPurchaseData.length; i++) {
        const record = {
          'BILL NUMBER': allPurchaseData[i].vendor_bill_number,
          DATE: formatDownloadExcelDate(allPurchaseData[i].bill_date),
          'DUE DATE': formatDownloadExcelDate(allPurchaseData[i].dueDate),
          VENDOR: allPurchaseData[i].vendor_name,
          AGE: getAge(allPurchaseData[i]),
          'TOTAL AMOUNT': allPurchaseData[i].total_amount,
          'BALANCE DUE': allPurchaseData[i].balance_amount,
          STATUS: getStatus(allPurchaseData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        'BILL NUMBER': '',
        DATE: '',
        'DUE DATE': '',
        VENDOR: '',
        AGE: '',
        'TOTAL AMOUNT': '',
        'BALANCE DUE': '',
        STATUS: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Purchase Aging Details Sheet');

    // console.log('test:: ws::', ws);
    wb.Sheets['Purchase Aging Details Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Purchase_Aging_Details_Report';

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

  const todayDate = new Date(thisYear, thisMonth, today);

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
        // to add search
        getPurchaseDataBySearch(target);
      } else {
        getPurchaseDataByDate(toDate);
      }
    }
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
      if (!businessData.posFeatures.includes('Aging Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && toDate) {
        setOnChange(false);
        await getPurchaseDataByDate(toDate);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getPurchaseDataByDate = async (toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      {
        dueDate: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        balance_amount: { $gt: 0 }
      },
      {
        updatedAt: { $exists: true }
      }
    ];

    let skip = 0;
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseDataByDate(toDate);
    }

    Query = db.purchases.find({
      selector: {
        $and: filterArray
      },
      sort: [{ dueDate: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      let filteredData = [];
      for (let item of response) {
        if (item.dueDate !== null) {
          filteredData.push(item);
        }
      }
      setPurchaseData(filteredData);
    });
  };

  const getPurchaseDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let skip = 0;
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseDataBySearch(value);
    }

    Query = db.purchases.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_bill_number: { $regex: regexp } },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_name: { $regex: regexp } },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          }
        ]
      },
      sort: [{ dueDate: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      let filteredData = [];
      for (let item of response) {
        if (item.dueDate !== null) {
          filteredData.push(item);
        }
      }
      setPurchaseData(filteredData);
    });
  };

  const getAllPurchaseDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.purchases.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_bill_number: { $regex: regexp } },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_name: { $regex: regexp } },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              {
                dueDate: {
                  $lte: dateFormat(toDate, 'yyyy-mm-dd')
                }
              },
              {
                balance_amount: { $gt: 0 }
              }
            ]
          }
        ]
      },
      sort: [{ dueDate: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        let output = {};

        if (item.dueDate !== null) {
          ++count;
        }
        return output;
      });

      setAllPurchaseData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getAllExcelPurchaseData = async () => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let response = [];
    let filteredData = [];
    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      {
        dueDate: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        balance_amount: { $gt: 0 }
      },
      {
        updatedAt: { $exists: true }
      }
    ];

    Query = db.purchases.find({
      selector: {
        $and: filterArray
      },
      sort: [{ dueDate: 'asc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      for (let item of response) {
        if (item.dueDate !== null) {
          filteredData.push(item);
        }
      }
    });

    return filteredData;
  };

  const getAllPurchaseDataByDate = async (toDate) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      {
        dueDate: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        balance_amount: { $gt: 0 }
      },
      {
        updatedAt: { $exists: true }
      }
    ];

    Query = db.purchases.find({
      selector: {
        $and: filterArray
      },
      sort: [{ dueDate: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        let output = {};

        if (item.dueDate !== null) {
          ++count;
        }
        return output;
      });

      setAllPurchaseData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const generatePDFDocument = async () => {
    let allSalesData = await getAllExcelPurchaseData();

    const blob = await pdf(
      <PurchasesAgingPDF
        data={allSalesData}
        settings={invoiceRegular}
        date={formatDownloadExcelDate(toDate)}
        toDate={toDate}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, 'Purchase_Aging_Details');
  };

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
                    PURCHASE AGING DETAILS BY BILL DUE DATE
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={8}>
                  <div>
                    <form className={classes.blockLine} noValidate>
                      <TextField
                        id="date"
                        label="Choose Date"
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
                <Grid item xs={12} sm={1}></Grid>

                <Grid
                  item
                  xs={12}
                  sm={8}
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
                            onClick={() => getExcelDataFromPurchase()}
                          >
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
                </Grid>
              </Grid>
              <div
                style={{
                  width: '100%',
                  height: height - 225 + 'px'
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
                    rowData={purchaseData}
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
            </Paper>
          ) : (
            // </Paper>
            <NoPermission />
          )}
        </div>
      )}
      {OpenAddPurchaseBill ? <AddPurchasesBill /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(PurchaseAgingDetails);