import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar,
  MenuItem,
  Select,
  OutlinedInput,
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
import useWindowDimensions from '../../../../components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import dateFormat from 'dateformat';
import AddPurchaseOrder from 'src/views/purchases/PurchaseOrder/AddPurchaseOrder';
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
    minWidth: 140,
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

const PurchaseOrderByEmployee = (props) => {
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

  const { getAllReportEmployees } = stores.EmployeeStore;
  const { OpenAddPurchaseOrder } = toJS(stores.PurchaseOrderStore);
  const { viewOrEditPurchaseOrderTxnItem } = stores.PurchaseOrderStore;
  const { productDialogOpen } = toJS(stores.ProductStore);

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
    var dateAsString = params.data.po_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      viewOrEditPurchaseOrderTxnItem(event.data);
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'PO NO',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'po_date',
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
      headerName: 'PAYMENT TYPE',
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
      headerName: 'AMOUNT',
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
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
      cellStyle: statusCellStyle,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

  function getPurchaseStatus(purchaseData) {
    let result = '';

    if (purchaseData.balance_amount === 0) {
      result = 'Paid';
    } else if (purchaseData.balance_amount < purchaseData.total_amount) {
      result = 'Partial';
    } else if (purchaseData.balance_amount === purchaseData.total_amount) {
      result = 'Un Paid';
    }
    return result;
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

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const getDataFromPurchasesByEmployee = async () => {
    const wb = new Workbook();
    let xlsxPurchaseData = [];
    if (employeeId != null) {
      xlsxPurchaseData = await getAllPurchaseOrderDataByEmployeeXlsx(
        fromDate,
        toDate,
        employeeId
      );
    } else {
      xlsxPurchaseData = await getAllPurchaseOrderDataByDateXlsx(
        fromDate,
        toDate
      );
    }

    let data = [];
    if (xlsxPurchaseData && xlsxPurchaseData.length > 0) {
      for (var i = 0; i < xlsxPurchaseData.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(xlsxPurchaseData[i].po_date),
          'PO NO': xlsxPurchaseData[i].sequenceNumber,
          VENDOR: xlsxPurchaseData[i].vendor_name,
          'PAYMENT TYPE': xlsxPurchaseData[i].payment_type,
          AMOUNT: xlsxPurchaseData[i].total_amount,
          'BALANCE DUE': xlsxPurchaseData[i].balance_amount,
          STATUS: xlsxPurchaseData[i].status
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'PO NO': '',
        VENDOR: '',
        'PAYMENT TYPE': '',
        AMOUNT: '',
        'BALANCE DUE': '',
        STATUS: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('PO By Employee Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['PO By Employee Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Purchase_Order_By_Employee_Report';

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

  const {
    handlePurchaseOrderSearchByEmployeeAndDate,
    handlePurchaseOrderSearchWithDate
  } = stores.PurchaseOrderStore;

  const [purchasesData, setPurchaseData] = useState([]);

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [fromDate, setFromDate] = React.useState();
  const [toDate, setToDate] = React.useState();
  const [employeeList, setEmployeeList] = React.useState();
  const [employeeName, setEmployeeName] = React.useState('');
  const [employeeId, setEmployeeId] = React.useState();

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
        if (employeeId) {
          setPurchaseData(
            await handlePurchaseOrderSearchByEmployeeAndDate(
              target,
              fromDate,
              toDate,
              employeeId
            )
          );
        } else {
          setPurchaseData(
            await handlePurchaseOrderSearchWithDate(target, fromDate, toDate)
          );
        }
      } else {
        if (employeeId) {
          getPurchaseOrderDataByEmployee(fromDate, toDate, employeeId);
        } else {
          getPurchaseOrderDataByDate(fromDate, toDate);
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

    setEmployeeList([]);
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    setEmployeeList(await getAllReportEmployees());
  };

  const handleEmployeeClick = (employee) => {
    setEmployeeName(employee.name);
    setEmployeeId(employee.employeeId);
    getPurchaseOrderDataByEmployee(fromDate, toDate, employee.employeeId);
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Employees Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setPurchaseData([]);
        if (employeeId != null) {
          getPurchaseOrderDataByEmployee(fromDate, toDate, employeeId);
        } else {
          getPurchaseOrderDataByDate(fromDate, toDate);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getPurchaseOrderDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseOrderDataByDate(fromDate, toDate);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchaseorder.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            po_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            po_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ po_date: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
    });
  };

  const getAllPurchaseOrderDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchaseorder.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            po_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            po_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ po_date: 'desc' }]
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

  const getAllPurchaseOrderDataByDateXlsx = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchaseorder.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            po_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            po_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ po_date: 'asc' }]
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

  const getPurchaseOrderDataByEmployee = async (fromDate, toDate, phoneNo) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseOrderDataByEmployee(fromDate, toDate, phoneNo);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchaseorder.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            po_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            po_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            employeeId: { $eq: phoneNo }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ po_date: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
    });
  };

  const getAllPurchaseOrderDataByEmployee = async (
    fromDate,
    toDate,
    phoneNo
  ) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchaseorder.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            po_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            po_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            employeeId: { $eq: phoneNo }
          }
        ]
      },
      sort: [{ po_date: 'desc' }]
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

  const getAllPurchaseOrderDataByEmployeeXlsx = async (
    fromDate,
    toDate,
    phoneNo
  ) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchaseorder.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            po_date: {
              $gte: dateFormat(fromDate, 'yyyy-mm-dd')
            }
          },
          {
            po_date: {
              $lte: dateFormat(toDate, 'yyyy-mm-dd')
            }
          },
          {
            employeeId: { $eq: phoneNo }
          }
        ]
      },
      sort: [{ po_date: 'asc' }]
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
            <Paper className={classes.root} style={{ minHeight: height - 54 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    PURCHASE ORDERS - EMPLOYEE
                  </Typography>
                </div>
              </div>

              <Grid container className={classes.categoryActionWrapper}>
                <Grid item xs={6}>
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
                  <Grid style={{ display: 'flex' }} item xs={11}>
                    <Select
                      displayEmpty
                      value={employeeName}
                      input={
                        <OutlinedInput
                          style={{ width: '100%', marginLeft: '-3px' }}
                        />
                      }
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem disabled value="">
                        Select Employee
                      </MenuItem>
                      {employeeList &&
                        employeeList.map((c) => (
                          <MenuItem
                            key={c.name}
                            value={c.name}
                            name={c.name}
                            style={{ color: 'black' }}
                            onClick={() => {
                              setEmployeeName(c.name);
                              handleEmployeeClick(c);
                            }}
                          >
                            {c.name}
                          </MenuItem>
                        ))}
                    </Select>
                    <Button
                      className={classes.resetbtn}
                      size="small"
                      onClick={() => {
                        setEmployeeName('');
                        setEmployeeId(null);
                        setCurrentPage(1);
                        setTotalPages(1);
                        setOnChange(true);
                      }}
                      color="secondary"
                    >
                      RESET
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="center"
                className={classes.sectionHeader}
                style={{ marginTop: '16px' }}
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
                          onClick={() => getDataFromPurchasesByEmployee()}
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
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
       {OpenAddPurchaseOrder ? <AddPurchaseOrder /> : null}
       {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(PurchaseOrderByEmployee);
