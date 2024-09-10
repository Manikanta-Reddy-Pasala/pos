import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Button
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import TextField from '@material-ui/core/TextField';
import { toJS } from 'mobx';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import * as Db from '../../../../RxDb/Database/Database';
import dateFormat from 'dateformat';
import { getCustomerAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import * as moment from 'moment';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';
import CustomerAccountingPDF from 'src/views/PDF/CustomerAccountAging/CustomerAccountingPDF';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none'
  },

  selectFont: {
    fontSize: '13px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  datepickerbg: {
    '& .MuiPickersToolbar-toolbar': {
      backgroundColor: '#ef5350 !important'
    },
    '& .MuiButton-textPrimary': {
      color: '#ef5350 !important'
    },
    '& .MuiPickersDay-daySelected': {
      backgroundColor: '#ef5350 !important'
    }
  },
  selectOption: {
    float: 'left',
    '& .makeStyles-formControl-53': {
      borderRadius: '7px'
    }
  },
  datePickerOption: {
    float: 'right',
    display: 'inline-block',
    marginRight: '26px'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    '& .MuiSelect-selectMenu': {
      background: 'white'
    }
  },
  paymentTypeOption: {
    margin: theme.spacing(2),
    minWidth: 120
  },
  itemTable: {
    width: '100%',
    display: 'inline-block'
  },
  roundOff: {
    '& .MuiFormControl-root': {
      background: 'white',
      verticalAlign: 'inherit',
      width: '100px',
      paddingLeft: '10px'
    }
  },
  searchInputRoot: {
    borderRadius: 50,
    marginLeft: '-12px',
    marginTop: '13px'
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

  inputField: {
    '& .MuiOutlinedInput-input': {
      padding: '8px'
    },
    '& .MuiOutlinedInput-root': {
      position: 'relative',
      borderRadius: 18
    }
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  nameList: {
    marginLeft: '12px',
    marginTop: '20px'
  },
  radioDate: {
    marginLeft: '13px',
    marginTop: '15px'
  },

  addExpenseBtn: {
    background: '#ffaf00',
    '&:hover': {
      backgroundColor: '#ffaf00'
    },
    color: 'white',
    borderRadius: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
    textTransform: 'none'
  },
  searchField: {
    marginRight: 20
  },
  root: {
    minHeight: '616px',
    padding: 2,
    borderRadius: '12px',
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },

  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
    border: '1px solid grey',
    padding: '6px',
    background: 'white'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  iconAlign: {
    textAlign: 'end',
    padding: '14px'
  },
  footer: {
    borderTop: '1px solid #d8d8d8',
    padding: '20px'
  },
  amount: {
    textAlign: 'center'
  },
  totalQty: {
    color: '#80D5B8',
    textAlign: 'center'
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
  }
}));

const CustomerSaleAgingPayableSummary = () => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const { height } = useWindowDimensions();
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const todayDate = new Date(thisYear, thisMonth, today);
  const [customerItemsList, setCustomerItemsList] = useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [customerList, setcustomerList] = React.useState();
  const [customerName, setCustomerName] = React.useState('');
  const [customerId, setCustomerId] = React.useState('');
  const [salesData, setSalesData] = useState([]);
  let [onChange, setOnChange] = useState(false);
  let [allSaleData, setAllSaleData] = useState([]);
  const [limit] = useState(10);
  const [toDate, setToDate] = React.useState();
  const [current, setCurrentAmount] = React.useState(0);
  const [oneToFifteen, setOneToFifteenAmount] = React.useState(0);
  const [sixteenToThirty, setSixteenToThirtyAmount] = React.useState(0);
  const [thirtyoneToFortyfive, setThirtyoneToFortyfiveAmount] =
    React.useState(0);
  const [fortysixTosixty, setFortysixTosixtyAmount] = React.useState(0);
  const [overSixty, setOverSixtyAmount] = React.useState(0);
  const [customerDisplayMode, setCustomerDisplayMode] = React.useState(true);
  let [allInvoicesData, setAllInvoicesData] = useState([]);
  const [gridAllInvoicesApi, setGridAllInvoicesApi] = useState(null);
  const [gridColumnAllInvoicesApi, setGridColumnAllInvoicesApi] =
    useState(null);
  const [gridKey, setGridKey] = useState(0);
  const store = useStore();

  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } =
    toJS(store.SalesAddStore);
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);
  const { viewOrEditItem, resetEWayLaunchFlag } = store.SalesAddStore;

  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { handleOpenEWayGenerateModal } = store.EWayStore;

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  useEffect(() => {
    if (gridApi) {
      if (salesData) {
        gridApi.setRowData(salesData);
      }
    }
  }, [gridApi, salesData]);

  useEffect(() => {
    if (gridAllInvoicesApi) {
      if (allInvoicesData) {
        gridAllInvoicesApi.setRowData(allInvoicesData);
      }
    }
  }, [gridAllInvoicesApi, allInvoicesData]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && toDate) {
        setOnChange(false);
        await getCustomerData();
      }
    };

    loadPaginationData();
  }, [onChange]);

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
      headerName: 'NAME',
      field: 'customer_name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PHONE NO',
      field: 'customer_phone_no',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'CURRENT',
      field: 'current',
      filter: false
    },
    {
      headerName: '1-15 DAYS',
      field: 'oneToFifteen',
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>1-15</p>
            <p>DAYS</p>
          </div>
        );
      }
    },
    {
      headerName: '16-30 DAYS',
      field: 'sixteenToThirty',
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>16-30</p>
            <p>DAYS</p>
          </div>
        );
      }
    },
    {
      headerName: '31-45 DAYS',
      field: 'thirtyoneToFortyfive',
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>31-45</p>
            <p>DAYS</p>
          </div>
        );
      }
    },
    {
      headerName: '46-60 DAYS',
      field: 'fortysixTosixty',
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>46-60</p>
            <p>DAYS</p>
          </div>
        );
      }
    },
    {
      headerName: 'Over 60 DAYS',
      field: 'overSixty',
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Over 60</p>
            <p>DAYS</p>
          </div>
        );
      }
    },
    {
      headerName: 'TOTAL PAYABLE',
      field: 'totalPayable',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>PAYABLE</p>
          </div>
        );
      }
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      minWidth: 80,
      cellRenderer: 'templateViewRenderer',
      cellRendererParams: {
        clicked: function (field) {
          alert(`${field} was clicked`);
        }
      }
    }
  ]);

  const TemplateViewRenderer = (props) => {
    let data = props['data'];

    return (
      <Button
        style={{
          fontSize: '12px',
          width: '35px',
          height: '25px',
          color: '#FFFFFF',
          backgroundColor: '#4a83fb'
        }}
        onClick={() => {
          setCustomerDisplayMode(false);
          setSalesData([]);
          getAllInvoicesData(data.customer_phone_no);
        }}
      >
        View
      </Button>
    );
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

  const [invoiceColumnDefs] = useState([
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
      headerName: 'CUSTOMER',
      field: 'customer_name',
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

  function dateFormatter(params) {
    var dateAsString = params.data.invoice_date;
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

  const getExcelDataDownload = async () => {
    const wb = new Workbook();

    let data = [];
    if (salesData && salesData.length > 0) {
      for (var i = 0; i < salesData.length; i++) {
        const record = {
          NAME: salesData[i].customer_name,
          'PHONE NUMBER': salesData[i].customer_phone_no,
          CURRENT: salesData[i].current,
          '1-15 DAYS': salesData[i].oneToFifteen,
          '16-30 DAYS': salesData[i].sixteenToThirty,
          '31-45 DAYS': salesData[i].thirtyoneToFortyfive,
          '46-60 DAYS': salesData[i].fortysixTosixty,
          'Over 60 DAYS': salesData[i].overSixty,
          'TOTAL PAYABLE': salesData[i].totalPayable
        };
        data.push(record);
      }
    } else {
      const record = {
        NAME: '',
        'PHONE NUMBER': '',
        CURRENT: '',
        '1-15 DAYS': '',
        '16-30 DAYS': '',
        '31-45 DAYS': '',
        '46-60 DAYS': '',
        'Over 60 DAYS': '',
        'TOTAL PAYABLE': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Customer Payable Sheet');

    // console.log('test:: ws::', ws);
    wb.Sheets['Customer Payable Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Customer_Sale_Aging_Payable_Report';

    download(url, fileName + '.xlsx');
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
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

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await getCustomerData();
    }

    fetchData();
    // Setting To Dates for today
    setToDate(formatDate(todayDate));
    setcustomerList([]);
    setTimeout(() => setLoadingShown(false), 200);
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const onGridAllInvoicesReady = (params) => {
    setGridAllInvoicesApi(params.api);
    setGridColumnAllInvoicesApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const handleCustomerClick = async (customer) => {
    setCustomerName(customer.name);
    setCustomerId(customer.id);

    getCustomerData(customer.id);
    setcustomerList([]);
  };

  const getCustomerData = async (id) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();
    let agingDataList = [];
    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      {
        isCustomer: {
          $eq: true
        }
      },
      {
        balance: { $gt: 0 }
      }
    ];

    if (id) {
      const filter = { id: { $eq: id } };
      filterArray.push(filter);
    }

    setSalesData([]);

    Query = db.parties.find({
      selector: {
        $and: filterArray
      }
    });

    await Query.$.subscribe(async (data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let customer = item.toJSON();

        return customer;
      });

      if (response.length > 0) {
        for (let customer of response) {
          await getAccountsReceivableFromAllTxn(customer, agingDataList);
        }
      }

      setSalesData(agingDataList);
      calculateAggrigatedValues(agingDataList);
    });
  };

  const calculateAggrigatedValues = async (agingDataList) => {
    let totalCurrent = 0;
    let totalOneToFifteen = 0;
    let totalSixteenToThirty = 0;
    let totalThirtyoneToFortyfive = 0;
    let totalFortysixTosixty = 0;
    let totalOverSixty = 0;

    agingDataList.forEach((res) => {
      totalCurrent += res.current;
      totalOneToFifteen += res.oneToFifteen;
      totalSixteenToThirty += res.sixteenToThirty;
      totalThirtyoneToFortyfive += res.thirtyoneToFortyfive;
      totalFortysixTosixty += res.fortysixTosixty;
      totalOverSixty += res.overSixty;
    });

    //set env variables
    setCurrentAmount(parseFloat(totalCurrent).toFixed(2) || 0);
    setOneToFifteenAmount(parseFloat(totalOneToFifteen).toFixed(2) || 0);
    setSixteenToThirtyAmount(parseFloat(totalSixteenToThirty).toFixed(2) || 0);
    setThirtyoneToFortyfiveAmount(
      parseFloat(totalThirtyoneToFortyfive).toFixed(2) || 0
    );
    setFortysixTosixtyAmount(parseFloat(totalFortysixTosixty).toFixed(2) || 0);
    setOverSixtyAmount(parseFloat(totalOverSixty).toFixed(2) || 0);
  };

  const getAccountsReceivableFromAllTxn = async (customer, agingDataList) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    await db.alltransactions
      .find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              balance: { $gt: 0 }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              dueDate: { $exists: true }
            },
            {
              customerId: { $eq: customer.id }
            },
            {
              txnType: { $eq: 'Sales Return' }
            }
          ]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          // No customer is available
          return;
        }

        const finalData = data.map((item) => {
          let result = item.toJSON();

          return result;
        });

        for (let item of finalData) {
          let searchIndex = -1;
          for (let index = 0; index < agingDataList.length; index++) {
            if (agingDataList[index].customer_phone_no === customer.phoneNo) {
              searchIndex = index;
              break;
            }
          }

          let agingData = {};

          if (searchIndex !== -1) {
            agingData = agingDataList[searchIndex];
          } else {
            agingData = {
              customer_name: '',
              customer_phone_no: '',
              current: 0,
              oneToFifteen: 0,
              sixteenToThirty: 0,
              thirtyoneToFortyfive: 0,
              fortysixTosixty: 0,
              overSixty: 0,
              totalPayable: 0
            };
          }
          if (item.dueDate !== null && item.dueDate !== undefined) {
            var date1 = new Date(item.dueDate);
            var date2 = new Date(dateFormat(toDate, 'yyyy-mm-dd'));
            let Difference_In_Days = 0;

            if (date2 !== undefined && date1 !== undefined) {
              // To calculate the time difference of two dates
              var Difference_In_Time = date2.getTime() - date1.getTime();

              // To calculate the no. of days between two dates
              Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            }
            agingData.customer_name = customer.name;
            agingData.customer_phone_no = customer.phoneNo;
            agingData.totalPayable += item.balance;
            if (Difference_In_Days === 0) {
              agingData.current += item.balance;
            } else if (Difference_In_Days >= 1 && Difference_In_Days <= 15) {
              agingData.oneToFifteen += item.balance;
            } else if (Difference_In_Days >= 16 && Difference_In_Days <= 30) {
              agingData.sixteenToThirty += item.balance;
            } else if (Difference_In_Days >= 31 && Difference_In_Days <= 45) {
              agingData.thirtyoneToFortyfive += item.balance;
            } else if (Difference_In_Days >= 46 && Difference_In_Days <= 60) {
              agingData.fortysixTosixty += item.balance;
            } else if (Difference_In_Days >= 61) {
              agingData.overSixty += item.balance;
            }

            if (searchIndex !== -1) {
              agingDataList.splice(searchIndex, 1); // 2nd parameter means remove one item only

              agingDataList.push(agingData);
            } else {
              agingDataList.push(agingData);
            }
          }
        }
      });
  };

  const getCustomerList = async (value) => {
    setcustomerList(await getCustomerAutoCompleteList(value));
  };

  const getAllInvoicesData = async (customerPhNo) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let allInvoicesData = [];
    setAllInvoicesData([]);
    let filterArray = [
      { businessId: { $eq: businessData.businessId } },
      {
        dueDate: { $exists: true }
      },
      {
        dueDate: {
          $lte: dateFormat(toDate, 'yyyy-mm-dd')
        }
      },
      {
        balance_amount: { $gt: 0 }
      },
      {
        customer_phoneNo: { $eq: customerPhNo }
      },
      {
        updatedAt: { $exists: true }
      }
    ];

    Query = db.salesreturn.find({
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
          allInvoicesData.push(item);
        }
      }
    });

    setAllInvoicesData(allInvoicesData);
  };

  const generatePDFDocument = async () => {
    let total = {
      totalCurrent: 0,
      totalOneToFifteen: 0,
      totalSixteenToThirty: 0,
      totalThirtyoneToFortyfive: 0,
      totalFortysixTosixty: 0,
      totalOverSixty: 0,
      totalPayable: 0
    };

    salesData.forEach((res) => {
      total.totalCurrent += res.current;
      total.totalOneToFifteen += res.oneToFifteen;
      total.totalSixteenToThirty += res.sixteenToThirty;
      total.totalThirtyoneToFortyfive += res.thirtyoneToFortyfive;
      total.totalFortysixTosixty += res.fortysixTosixty;
      total.totalOverSixty += res.overSixty;
      total.totalPayable += res.totalPayable;
    });

    const blob = await pdf(
      <CustomerAccountingPDF
        data={salesData}
        settings={invoiceRegular}
        date={formatDownloadExcelDate(toDate)}
        toDate={toDate}
        total={total}
        type={'Payable'}
        title={'Customer Accounts Payable (Aging)'}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, 'Customer_Accounts_Payable_(Aging)');
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
        <div className={classes.root} style={{ minHeight: height - 53 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 53 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    CUSTOMER ACCOUNTS PAYABLE (AGING)
                  </Typography>
                </div>
              </div>

              <div>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
                  <Grid item xs={7} style={{ marginTop: 3 }}>
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
                          }}
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </form>
                    </div>
                  </Grid>
                  <Grid item xs={3}>
                    <div className={classes.blockLine}>
                      <div className={classes.nameList}>
                        <TextField
                          fullWidth
                          placeholder="Select Customer"
                          className={classes.input}
                          value={customerName}
                          onChange={(e) => {
                            if (e.target.value !== customerName) {
                              setCustomerName(e.target.value);
                              setCustomerId('');
                            }
                            getCustomerList(e.target.value);
                            if (e.target.value.length === 0) {
                              // call for all customers
                              getCustomerData();
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
                        {customerList && customerList.length > 0 ? (
                          <>
                            <ul
                              className={classes.listbox}
                              style={{ width: '18%' }}
                            >
                              <li>
                                <Grid container justify="space-between">
                                  {customerList.length === 1 &&
                                  customerList[0].name === '' ? (
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
                              {customerList.length === 1 &&
                              customerList[0].name === '' ? (
                                <li></li>
                              ) : (
                                <div>
                                  {customerList.map((option, index) => (
                                    <li
                                      key={`${index}vendor`}
                                      style={{ padding: 10, cursor: 'pointer' }}
                                      onClick={() => {
                                        handleCustomerClick(option);
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
                  <Grid item xs={1}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton onClick={() => getExcelDataDownload()}>
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
              </div>

              {customerDisplayMode === false && (
                <Button
                  style={{
                    fontSize: '12px',
                    width: '60px',
                    height: '30px',
                    color: '#FFFFFF',
                    backgroundColor: '#4a83fb',
                    marginTop: '16px',
                    marginLeft: '16px'
                  }}
                  onClick={() => {
                    setCustomerDisplayMode(true);
                    setGridKey((prevKey) => prevKey + 1);
                    // call for all customers
                    getCustomerData();
                  }}
                >
                  Back
                </Button>
              )}

              <div className={classes.itemTable}>
                {/* <App />  */}

                <Box mt={2}>
                  {customerDisplayMode === true ? (
                    <div
                      id="product-list-grid"
                      style={{ height: height - 256, width: '100%' }}
                      className="ag-theme-material"
                    >
                      <AgGridReact
                        key={gridKey}
                        onGridReady={onGridReady}
                        enableRangeSelection
                        paginationPageSize={10}
                        suppressMenuHide
                        rowData={salesData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection="single"
                        pagination
                        headerHeight={40}
                        rowClassRules={rowClassRules}
                        overlayLoadingTemplate={
                          '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                        }
                        overlayNoRowsTemplate={
                          '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                        }
                        frameworkComponents={{
                          templateViewRenderer: TemplateViewRenderer
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      id="product-list-grid"
                      style={{ height: height - 256, width: '100%' }}
                      className="ag-theme-material"
                    >
                      <AgGridReact
                        onGridReady={onGridAllInvoicesReady}
                        enableRangeSelection
                        paginationPageSize={10}
                        suppressMenuHide
                        rowData={allInvoicesData}
                        columnDefs={invoiceColumnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection="single"
                        pagination
                        headerHeight={40}
                        rowClassRules={rowClassRules}
                        onCellClicked={handleCellClicked}
                        overlayLoadingTemplate={
                          '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                        }
                        overlayNoRowsTemplate={
                          '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                        }
                      />
                    </div>
                  )}
                </Box>
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
                      marginBottom: '10px'
                    }}
                  >
                    <Grid
                      item
                      xs={4}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Current : {parseFloat(current).toFixed(2)}{' '}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total 31-45 DAYS :{' '}
                          {parseFloat(thirtyoneToFortyfive).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total 1-15 DAYS: {parseFloat(oneToFifteen).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total 46-60 DAYS :{' '}
                          {parseFloat(fortysixTosixty).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total 16-30 DAYS :{' '}
                          {parseFloat(sixteenToThirty).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total Over 60 DAYS :{' '}
                          {parseFloat(overSixty).toFixed(2)}
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
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(CustomerSaleAgingPayableSummary);