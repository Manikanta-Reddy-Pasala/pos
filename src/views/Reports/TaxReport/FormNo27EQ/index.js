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
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import dateFormat from 'dateformat';
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

const FormNo27EQ = (props) => {
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
  let [totalTCS, setTotalTCS] = useState(0);

  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } = toJS(store.SalesAddStore);
  const { OpenAddPurchasesReturn } = toJS(store.PurchasesReturnsAddStore);
  const { viewOrEditSaleTxnItem, resetEWayLaunchFlag } = store.SalesAddStore;
  const { viewOrEditPurchaseReturnTxnItem } = store.PurchasesReturnsAddStore;
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleOpenEWayGenerateModal } = store.EWayStore;

  const [limit] = useState(10);

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
    var dateAsString = params.data.date;
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

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    if ('sequenceNumber' === colId) {
      if ('Sales' === event.data.txnType || 'KOT' === event.data.txnType) {
        const query = db.sales.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { invoice_number: { $eq: event.data.id } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (!data) {
              // No Sales data is not found so cannot update any information
              return;
            }

            viewOrEditSaleTxnItem(data);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Purchases Return' === event.data.txnType) {
        const query = db.purchasesreturn.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { purchase_return_number: { $eq: event.data.id } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (!data) {
              // No Sales data is not found so cannot update any information
              return;
            }

            let clone = JSON.parse(JSON.stringify(data));
            viewOrEditPurchaseReturnTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      }
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
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE</p>
            <p>NO</p>
          </div>
        );
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'date',
      valueFormatter: dateFormatter,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'CUSTOMER NAME',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PARTY</p>
            <p>NAME</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data.txnType === 'Sales') {
          result = data.customerName;
        } else {
          result = data.vendorName;
        }
        return result;
      }
    },
    {
      headerName: 'PARTY GSTN',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PARTY</p>
            <p>GSTN</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data.txnType === 'Sales') {
          result = data.customerGSTNo;
        } else {
          result = data.vendorGSTNo;
        }
        return result;
      }
    },
    {
      headerName: 'PARTY PAN',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PARTY</p>
            <p>PAN</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data.txnType === 'Sales') {
          result = data.customerPAN;
        } else {
          result = data.vendorPAN;
        }
        return result;
      }
    },
    {
      headerName: 'TOTAL VALUE',
      field: 'amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['amount']).toFixed(2);
        return result;
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>VALUE</p>
          </div>
        );
      }
    },
    {
      headerName: 'AMOUNT RECEIVED',
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        if (data['isCredit']) {
          result = data['linkedAmount'];
        } else {
          result = data['amount'];
        }
        return parseFloat(result).toFixed(2);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>AMOUNT</p>
            <p>RECEIVABLE</p>
          </div>
        );
      }
    },
    {
      headerName: 'TCS COLLECTED',
      field: 'tcsAmount',
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TCS</p>
            <p>COLLECTED</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['tcsAmount']).toFixed(2);
        return result;
      }
    },
    {
      headerName: 'TCS Code',
      field: 'tcsCode',
      width: 80,
      minWidth: 80,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TCS</p>
            <p>CODE</p>
          </div>
        );
      }
    },
    {
      headerName: 'TCS NAME',
      field: 'tcsName',
      width: 90,
      minWidth: 100,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TCS</p>
            <p>NAME</p>
          </div>
        );
      }
    },
    {
      headerName: 'TCS RATE(%)',
      field: 'tcsRate',
      width: 90,
      minWidth: 100,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TCS</p>
            <p>RATE(%)</p>
          </div>
        );
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

  const calculateAggrigatedValues = async (response) => {
    let totalTCS = 0;

    response.forEach((res) => {
      totalTCS += res.tcsAmount;
    });

    totalTCS = parseFloat(totalTCS).toFixed(2);

    //set env variables
    setTotalTCS(totalTCS);
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function getReceivableData(data) {
    let result = 0;

    if (data.isCredit) {
      result = data.linkedAmount;
    } else {
      result = data.amount;
    }

    return result;
  }

  function getVendorName(data) {
    let result = '';
    if (data.txnType === 'Sales') {
      result = data.customerName;
    } else {
      result = data.vendorName;
    }
    return result;
  }

  function getVendorGSTN(data) {
    let result = '';
    if (data.txnType === 'Sales') {
      result = data.customerGSTNo;
    } else {
      result = data.vendorGSTNo;
    }
    return result;
  }

  function getVendorPAN(data) {
    let result = '';
    if (data.txnType === 'Sales') {
      result = data.customerPAN;
    } else {
      result = data.vendorPAN;
    }
    return result;
  }

  const getDataFromSales = async () => {
    const wb = new Workbook();

    let allSalesData = await getAllTodaySalesData();
    let data = [];
    if (allSalesData && allSalesData.length > 0) {
      for (var i = 0; i < allSalesData.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(allSalesData[i].date),
          'PARTY NAME': getVendorName(allSalesData[i]),
          'PARTY GSTN': getVendorGSTN(allSalesData[i]),
          'PARTY PAN': getVendorPAN(allSalesData[i]),
          'INVOICE NO': allSalesData[i].sequenceNumber,
          'TOTAL VALUE': allSalesData[i].amount,
          'AMOUNT RECEIVED': getReceivableData(allSalesData[i]),
          'TCS COLLECTED': parseFloat(allSalesData[i].tcsAmount).toFixed(2),
          'TCS CODE': allSalesData[i].tcsCode,
          'TCS NAME': allSalesData[i].tcsName,
          'TCS RATE(%)': allSalesData[i].tcsRate
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'PARTY NAME': '',
        'PARTY GSTN': '',
        'PARTY PAN': '',
        'INVOICE NO': '',
        'TOTAL VALUE': '',
        'AMOUNT RECEIVED': '',
        'TCS COLLECTED': '',
        'TCS CODE': '',
        'TCS NAME': '',
        'TCS RATE(%)': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('FormNo27EQ Sheet');

    // console.log('test:: ws::', ws);
    wb.Sheets['FormNo27EQ Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'FormNo27EQ_Report';

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
        getSaleDataBySearch(target);
      } else {
        getSaleDataByDate(fromDate, toDate);
      }
    } else {
      getSaleDataByDate(fromDate, toDate);
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
      if (!businessData.posFeatures.includes('Tax Report')) {
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
        tcsAmount: {
          $gt: 0
        }
      },
      {
        $or: [
          { txnType: { $eq: 'Sales' } },
          { txnType: { $eq: 'Purchases Return' } }
        ]
      }
    ];

    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSaleDataByDate(fromDate, toDate);
    }

    Query = db.alltransactions.find({
      selector: {
        $and: filterArray
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
      setSalesData(response);
      calculateAggrigatedValues(response);
    });
  };

  const getAllSaleDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    let filterArray = [
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
        tcsAmount: {
          $gt: 0
        }
      },
      {
        $or: [
          { txnType: { $eq: 'Sales' } },
          { txnType: { $eq: 'Purchases Return' } }
        ]
      }
    ];

    Query = db.alltransactions.find({
      selector: {
        $and: filterArray
      },
      sort: [{ date: 'desc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        let output = {};

        output.total_amount = item.total_amount;
        output.balance_amount = item.balance_amount;

        ++count;
        return output;
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

  const getSaleDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let skip = 0;
    setSalesData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSaleDataBySearch(fromDate, toDate);
    }

    Query = db.alltransactions.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { customerName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { vendorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { customerGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { vendorGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { customerPAN: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { vendorPAN: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { tcsName: { $regex: regexp } }
            ]
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
      setSalesData(response);
      calculateAggrigatedValues(response);
    });
  };

  const getAllSaleDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    const businessData = await Bd.getBusinessData();

    Query = db.alltransactions.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { customerName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { vendorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { customerGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { vendorGSTNo: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { customerPAN: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { vendorPAN: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                tcsAmount: {
                  $gt: 0
                }
              },
              {
                $or: [
                  { txnType: { $eq: 'Sales' } },
                  { txnType: { $eq: 'Purchases Return' } }
                ]
              },
              { tcsName: { $regex: regexp } }
            ]
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
      let response = data.map((item) => {
        let output = {};

        output.total_amount = item.total_amount;
        output.balance_amount = item.balance_amount;

        ++count;
        return output;
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

  const getAllTodaySalesData = async () => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let response = [];
    let filterArray = [
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
        tcsAmount: {
          $gt: 0
        }
      },
      {
        $or: [
          { txnType: { $eq: 'Sales' } },
          { txnType: { $eq: 'Purchases Return' } }
        ]
      }
    ];

    Query = db.alltransactions.find({
      selector: {
        $and: filterArray
      },
      sort: [{ date: 'asc' }]
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      response = data.map((item) => item);
    });

    return response;
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
                    FORM NO. 27EQ
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
                        <Typography>Total TCS : {totalTCS} </Typography>
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
      {OpenAddPurchasesReturn ? <AddDebitNote /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(FormNo27EQ);