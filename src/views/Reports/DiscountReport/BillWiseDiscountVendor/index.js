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
import { Search, Print } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import Moreoptions from '../../../../components/MoreoptionsPurchases';
import * as Db from '../../../../RxDb/Database/Database';
import moreoption from '../../../../components/Options';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import useWindowDimensions from '../../../../components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import dateFormat from 'dateformat';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import ProductModal from 'src/components/modal/ProductModal';

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
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
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
  headerRoot: {
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

const BillWiseDiscountVendor = (props) => {
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
  const [allPurchaseData, setAllPurchaseData] = useState([]);

  const { OpenAddPurchaseBill } = toJS(stores.PurchasesAddStore);
  const { productDialogOpen } = toJS(stores.ProductStore);
  const { viewOrEditItem } = stores.PurchasesAddStore;

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
    var dateAsString = params.data.bill_date;
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
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
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

  const calculateAggrigatedValues = async (txnData) => {
    let totalPurchaseAmount = 0;
    let totalDiscountAmount = 0;

    txnData.forEach((res) => {
      totalPurchaseAmount += res.total_amount;
      totalDiscountAmount += getDiscountData(res);
    });

    //set env variables
    setTotalPurchaseAmount(parseFloat(totalPurchaseAmount).toFixed(2) || 0);
    setTotalDiscountAmount(parseFloat(totalDiscountAmount).toFixed(2) || 0);
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function getDiscountData(data) {
    let result = 0;
    let itemsList = data['item_list'];

    for (let item of itemsList) {
      result += parseFloat(item.discount_amount);
    }

    return parseFloat(result);
  }

  const getDataFromPurchasesByVendor = async () => {
    const wb = new Workbook();
    let xlsxPurchaseData = [];
    if (vendorId) {
      xlsxPurchaseData = await getAllPurchaseDataByVendorXlsx(
        fromDate,
        toDate,
        vendorId
      );
    } else {
      xlsxPurchaseData = await getAllPurchaseDataByDateXlsx(fromDate, toDate);
    }

    let data = [];
    if (xlsxPurchaseData && xlsxPurchaseData.length > 0) {
      for (var i = 0; i < xlsxPurchaseData.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(xlsxPurchaseData[i].bill_date),
          'BILL NO': xlsxPurchaseData[i].vendor_bill_number,
          VENDOR: xlsxPurchaseData[i].vendor_name,
          'TOTAL AMOUNT': xlsxPurchaseData[i].total_amount,
          'DISCOUNT AMOUNT': getDiscountData(xlsxPurchaseData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'BILL NO': '',
        VENDOR: '',
        'TOTAL AMOUNT': '',
        'DISCOUNT AMOUNT': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Bill Wise Disc Vendor Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Bill Wise Disc Vendor Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Bill_Wise_Disc_Vendor_Report';

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

  const TemplateActionRenderer = (props) => {
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        index={props['data']['bill_number']}
        item={props['data']}
        id={props['data']['bill_number']}
        component="billsList"
      />
    );
  };

  const TempaltePrintShareRenderer = (props) => {
    return (
      <div>
        <IconButton disableRipple disableFocusRipple disableTouchRipple>
          <Print fontSize="inherit" />{' '}
        </IconButton>
      </div>
    );
  };

  const [purchasesData, setPurchaseData] = useState([]);

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

  const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(0);
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
        if (vendorId) {
          getPurchasesSearchByVendorAndDate(target, fromDate, toDate, vendorId);
        } else {
          getPurchasesSearchWithDate(target, fromDate, toDate);
        }
      } else {
        if (vendorId) {
          getPurchaseDataByVendor(fromDate, toDate, vendorId);
        } else {
          getPurchaseDataByDate(fromDate, toDate);
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
    setOnChange(true);

    setVendorList([]);
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorClick = async (vendor) => {
    setVendorName(vendor.name);
    setVendorId(vendor.id);
    setCurrentPage(1);
    setTotalPages(1);
    await getPurchaseDataByVendor(fromDate, toDate, vendor.id);
    setVendorList([]);
  };

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
      if (onChange) {
        setOnChange(false);
        setPurchaseData([]);
        if (vendorId) {
          getPurchaseDataByVendor(fromDate, toDate, vendorId);
        } else {
          getPurchaseDataByDate(fromDate, toDate);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getPurchaseDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseDataByDate(fromDate, toDate);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchases.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            bill_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            bill_date: {
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
        ]
      },
      sort: [{ bill_date: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
      calculateAggrigatedValues(response);
    });
  };

  const getAllPurchaseDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchases.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            bill_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            bill_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            discount_percent: {
              $gt: 0
            }
          }
        ]
      },
      sort: [{ bill_date: 'desc' }]
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
          output.order_type = item.order_type;

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

  const getAllPurchaseDataByDateXlsx = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchases.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            bill_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            bill_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            discount_percent: {
              $gt: 0
            }
          }
        ]
      },
      sort: [{ bill_date: 'asc' }]
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

  const getPurchaseDataByVendor = async (fromDate, toDate, vendorId) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseDataByVendor(fromDate, toDate, vendorId);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchases.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            bill_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            bill_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            vendor_id: { $eq: vendorId }
          },
          {
            discount_percent: {
              $gt: 0
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ bill_date: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
      calculateAggrigatedValues(response);
    });
  };

  const getAllPurchaseDataByVendor = async (fromDate, toDate, phoneNo) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchases.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            bill_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            bill_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            discount_percent: {
              $gt: 0
            }
          },
          {
            vendor_id: { $eq: vendorId }
          }
        ]
      },
      sort: [{ bill_date: 'desc' }]
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
          output.order_type = item.order_type;

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

  const getAllPurchaseDataByVendorXlsx = async (fromDate, toDate, phoneNo) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchases.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            bill_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            bill_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            discount_percent: {
              $gt: 0
            }
          },
          {
            vendor_id: { $eq: vendorId }
          }
        ]
      },
      sort: [{ bill_date: 'asc' }]
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

  const getPurchasesSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();
    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    var Query;

    let skip = 0;
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchasesSearchWithDate(value, fromDate, toDate);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchases.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_bill_number: { $regex: regexp } },
              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
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
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
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
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
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
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          }
        ]
      },
      sort: [{ bill_date: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
      calculateAggrigatedValues(response);
    });
  };

  const getAllPurchasesSearchWithDate = async (value, fromDate, toDate) => {
    const db = await Db.get();
    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchases.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } },
              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
                  $lte: toDate
                }
              }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_bill_number: { $regex: regexp } },
              {
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
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
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
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
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
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
                bill_date: {
                  $gte: fromDate
                }
              },
              {
                bill_date: {
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
      let response = data
        .map((item) => {
          let output = {};

          output.total_amount = item.total_amount;
          output.balance_amount = item.balance_amount;
          output.order_type = item.order_type;

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

  const getPurchasesSearchByVendorAndDate = async (
    value,
    fromDate,
    toDate,
    vendorId
  ) => {
    if (vendorId) {
      const db = await Db.get();
      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      var Query;

      let skip = 0;
      setPurchaseData([]);
      if (currentPage && currentPage > 1) {
        skip = (currentPage - 1) * limit;
      } else if (currentPage === 1) {
        getAllPurchasesSearchByVendorAndDate(value, fromDate, toDate, vendorId);
      }
      const businessData = await Bd.getBusinessData();

      Query = db.purchases.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { payment_type: { $regex: regexp } },
                { vendor_id: { $eq: vendorId } },
                {
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
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
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
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
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
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
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
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
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { payment_type: { $regex: regexp } },
                { vendor_id: { $eq: vendorId } },
                {
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        },
        sort: [{ bill_date: 'desc' }],
        skip: skip,
        limit: limit
      });

      await Query.$.subscribe((data) => {
        if (!data) {
          return;
        }
        let response = data.map((item) => item);
        setPurchaseData(response);
        calculateAggrigatedValues(response);
      });
    }
  };

  const getAllPurchasesSearchByVendorAndDate = async (
    value,
    fromDate,
    toDate,
    vendorId
  ) => {
    if (vendorId) {
      const db = await Db.get();
      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      var Query;
      const businessData = await Bd.getBusinessData();

      Query = db.purchases.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { payment_type: { $regex: regexp } },
                { vendor_id: { $eq: vendorId } },
                {
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
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
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
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
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
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
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
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
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { payment_type: { $regex: regexp } },
                { vendor_id: { $eq: vendorId } },
                {
                  bill_date: {
                    $gte: fromDate
                  }
                },
                {
                  bill_date: {
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
        let response = data
          .map((item) => {
            let output = {};

            output.total_amount = item.total_amount;
            output.balance_amount = item.balance_amount;
            output.order_type = item.order_type;

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

        setAllPurchaseData(response);

        let numberOfPages = 1;

        if (count % limit === 0) {
          numberOfPages = parseInt(count / limit);
        } else {
          numberOfPages = parseInt(count / limit + 1);
        }
        setTotalPages(numberOfPages);
      });
    }
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
                    BILL WISE DISCOUNT (VENDOR)
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={5}>
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
                            setVendorId('');
                          }
                          getVendorList(e.target.value);

                          if (e.target.value.length === 0) {
                            getPurchaseDataByDate(fromDate, toDate);
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
                alignItems="center"
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={7}>
                  {/* <Typography variant="h4" style={{marginLeft:'10px'}}>Transaction</Typography> */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  align="right"
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
                          onClick={() => getDataFromPurchasesByVendor()}
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
                    enableRangeSelection
                    paginationPageSize={10}
                    suppressMenuHide
                    rowData={purchasesData}
                    rowSelection="single"
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination
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
                    frameworkComponents={{
                      templateActionRenderer: TemplateActionRenderer
                    }}
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
                          Total Purchase Amount : {totalPurchaseAmount}{' '}
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
            <NoPermission />
          )}
        </div>
      )}
      {OpenAddPurchaseBill ? <AddPurchasesBill /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(BillWiseDiscountVendor);