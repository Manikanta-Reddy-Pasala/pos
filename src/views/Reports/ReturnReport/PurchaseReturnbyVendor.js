import React, { useState, useEffect } from 'react';
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
import Arrowtopright from '../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../icons/Arrowbottomleft';
import useWindowDimensions from '../../../components/windowDimension';
import * as moment from 'moment';
import left_arrow from '../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../icons/svg/last_page_arrow.svg';
import dateFormat from 'dateformat';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import { toJS } from 'mobx';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';

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
        marginRight: theme.spacing(2),
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
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  }
}));

const PurchaseReturnByVendor = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(false);
  const [limit] = useState(10);
  const [returnDetailsList, setReturnDetailsList] = useState([]);

  const store = useStore();
  const { viewOrEditItem } =
    store.PurchasesReturnsAddStore;
  const { OpenAddPurchasesReturn } = toJS(store.PurchasesReturnsAddStore);

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('purchaseReturnBillNumber' === colId) {
      let clone = JSON.parse(JSON.stringify(event.data));
      viewOrEditItem(clone);
    }
  };

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

  const [columnDefs] = useState([
    {
      headerName: 'RETURN NO',
      field: 'purchaseReturnBillNumber',
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
      // filter:false,
      minWidth: 120,
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
      headerName: 'VENDOR',
      field: 'vendor_name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TYPE',
      field: 'payment_type',
      width: 90,
      minWidth: 100,
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
      headerName: 'RECEIVED',
      field: 'received_amount',
      width: 110,
      minWidth: 120,
      filter: false,
      valueFormatter: (params) => {
        return (
          (params['data']['received_amount'] || 0) +
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
      width: 110,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'STATUS',
      field: 'paymentStatus',
      width: 110,
      minWidth: 120,
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

  function getPurchaseReturnsreceivedAmount(returnsData) {
    return returnsData.received_amount + returnsData.linked_amount;
  }

  function getPurchaseReturnStatus(returnsData) {
    let result = '';

    if (returnsData.balance_amount === 0) {
      result = 'Paid';
    } else if (returnsData.balance_amount < returnsData.total_amount) {
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

  const getDataFromPurchasesReturnByVendor = async () => {
    const wb = new Workbook();

    let xlsxReturnData = [];

    if (vendorId) {
      xlsxReturnData = await getAllPurchasesReturnListByVendorXlsx(
        fromDate,
        toDate,
        vendorId
      );
    } else {
      xlsxReturnData = await getAllPurchasesReturnListByDateXlsx(
        fromDate,
        toDate
      );
    }

    let data = [];
    if (xlsxReturnData && xlsxReturnData.length > 0) {
      for (var i = 0; i < xlsxReturnData.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(xlsxReturnData[i].date),
          'RETURN NO': xlsxReturnData[i].purchaseReturnBillNumber,
          VENDOR: xlsxReturnData[i].vendor_name,
          'PAYMENT TYPE': xlsxReturnData[i].payment_type,
          TOTAL: xlsxReturnData[i].total_amount
            ? xlsxReturnData[i].total_amount
            : 0,
          RECEIVED: getPurchaseReturnsreceivedAmount(xlsxReturnData[i]),
          BALANCE: xlsxReturnData[i].balance_amount
            ? xlsxReturnData[i].balance_amount
            : 0,
          STATUS: getPurchaseReturnStatus(xlsxReturnData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'REF NO': '',
        VENDOR: '',
        'PAYMENT TYPE': '',
        TOTAL: '',
        RECEIVED: '',
        BALANCE: '',
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

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [fromDate, setFromDate] = React.useState();
  const [toDate, setToDate] = React.useState();
  const [vendorList, setVendorList] = React.useState();
  const [vendorName, setVendorName] = React.useState('');
  const [vendorId, setVendorId] = React.useState('');

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
        if (vendorId) {
          getPurchasesReturnSearchWithVendorAndDate(
            target,
            fromDate,
            toDate,
            vendorId
          );
        } else {
          getPurchasesReturnSearchWithDate(target, fromDate, toDate);
        }
      } else {
        if (vendorId) {
          getPurchasesReturnListByVendor(fromDate, toDate, vendorId);
        } else {
          getPurchasesReturnListByDate(fromDate, toDate);
        }
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
    setReturnDetailsList([]);

    setOnChange(true);

    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && fromDate && toDate) {
        setOnChange(false);

        if (vendorId) {
          getPurchasesReturnListByVendor(fromDate, toDate, vendorId);
        } else {
          getPurchasesReturnListByDate(fromDate, toDate);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorClick = (vendor) => {
    setVendorName(vendor.name);
    setVendorId(vendor.id);
    getPurchasesReturnListByVendor(fromDate, toDate, vendor.id);
    setVendorList([]);
  };

  const getPurchasesReturnListByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setReturnDetailsList([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchasesReturnListByDate(fromDate, toDate);
    }

    const businessData = await Bd.getBusinessData();
    Query = db.purchasesreturn.find({
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

  const getAllPurchasesReturnListByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchasesreturn.find({
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

  const getPurchasesReturnSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    var Query;

    let skip = 0;
    setReturnDetailsList([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchasesReturnSearchWithDate(value, fromDate, toDate);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchasesreturn.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { purchaseReturnBillNumber: { $regex: regexp } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_name: { $regex: regexp } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance_amount: { $eq: parseFloat(value) } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
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
      setReturnDetailsList(response);
    });
  };

  const getAllPurchasesReturnSearchWithDate = async (
    value,
    fromDate,
    toDate
  ) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();
    var Query;

    Query = db.purchasesreturn.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { purchaseReturnBillNumber: { $regex: regexp } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_name: { $regex: regexp } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance_amount: { $eq: parseFloat(value) } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
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

  const getPurchasesReturnSearchWithVendorAndDate = async (
    value,
    fromDate,
    toDate,
    vendorId
  ) => {
    const db = await Db.get();
    var Query;
    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    let skip = 0;
    setReturnDetailsList([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchasesReturnSearchWithVendorAndDate(
        value,
        fromDate,
        toDate,
        vendorId
      );
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchasesreturn.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_bill_number: { $regex: regexp } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_name: { $regex: regexp } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance_amount: { $eq: parseFloat(value) } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
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
      setReturnDetailsList(response);
    });
  };

  const getAllPurchasesReturnSearchWithVendorAndDate = async (
    value,
    fromDate,
    toDate,
    vendorId
  ) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();
    var Query;

    Query = db.purchasesreturn.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_bill_number: { $regex: regexp } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_name: { $regex: regexp } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance_amount: { $eq: parseFloat(value) } },
              { vendor_id: { $eq: vendorId } },
              {
                date: {
                  $gte: fromDate
                }
              },
              {
                date: {
                  $lte: toDate
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

  const getAllPurchasesReturnListByDateXlsx = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchasesreturn.find({
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

  const getPurchasesReturnListByVendor = async (fromDate, toDate, vendorId) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setReturnDetailsList([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchasesReturnListByVendor(fromDate, toDate, vendorId);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchasesreturn.find({
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
          },
          { vendor_id: { $eq: vendorId } }
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

  const getAllPurchasesReturnListByVendor = async (
    fromDate,
    toDate,
    vendorId
  ) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchasesreturn.find({
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
          { vendor_id: { $eq: vendorId } }
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

  const getAllPurchasesReturnListByVendorXlsx = async (
    fromDate,
    toDate,
    mobileNo
  ) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchasesreturn.find({
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
          { vendor_id: { $eq: vendorId } }
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
                    PURCHASES RETURN - VENDOR
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={7}>
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
                        onChange={(e) => {
                          setCurrentPage(1);
                          setTotalPages(1);
                          setToDate(formatDate(e.target.value));
                          setOnChange(true);
                        }}
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
                          if (e.target.value.length === 0) {
                            getPurchasesReturnListByDate(fromDate, toDate);
                          }
                          if (!e.target.value) {
                            setVendorId('');
                          }
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
                                        <br />
                                        <b>
                                          {' '}
                                          GSTIN:{' '}
                                          {option.gstNumber
                                            ? option.gstNumber
                                            : 'NA'}{' '}
                                        </b>
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

              <Grid
                container
                direction="row"
                spacing={2}
                alignItems="center"
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={7}>
                  {/* <Typography variant="h4" style={{ marginLeft: '10px' }}>
                    Transaction
                  </Typography> */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  align="right"
                  style={{ marginTop: '16px' }}
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
                    <Grid xs={2} className="category-actions-right">
                      <Avatar>
                        <IconButton
                          onClick={() => getDataFromPurchasesReturnByVendor()}
                        >
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
                  height: height - 232 + 'px'
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
                    enableRangeSelection
                    paginationPageSize={10}
                    suppressMenuHide
                    rowData={returnDetailsList}
                    rowSelection="single"
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination
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
                      marginTop: '3px'
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
              {/* <AddPurchasesBill /> */}
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {OpenAddPurchasesReturn ? <AddDebitNote /> : null}
    </div>
  );
};

export default InjectObserver(PurchaseReturnByVendor);