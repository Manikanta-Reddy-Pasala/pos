import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Avatar,
  IconButton
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import XLSX from 'xlsx';
import useWindowDimensions from '../../../../components/windowDimension';
import * as Bd from '../../../../components/SelectedBusiness';
import * as Db from '../../../../RxDb/Database/Database';
import dateFormat from 'dateformat';
import * as moment from 'moment';
import Excel from '../../../../icons/Excel';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import { toJS } from 'mobx';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: '12px'
  },
  root: {
    // padding: 2,
    borderRadius: '12px'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  footer: {
    borderTop: '1px solid #d8d8d8'
  },
  amount: {
    textAlign: 'center',
    color: '#EF5350'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  greenText: {
    color: '#339900'
  },
  csh: {
    marginTop: '30px',
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
        marginLeft: theme.spacing(1),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  }
}));

const EmployeePerformance = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [gridAllInvoicesApi, setGridAllInvoicesApi] = useState(null);
  const [gridColumnAllInvoicesApi, setGridColumnAllInvoicesApi] =
    useState(null);

  const store = useStore();

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  let [totalData, setTotalData] = useState([]);
  let [employeeData, setEmployeeData] = useState([]);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));
  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const { getAllReportEmployees } = store.EmployeeStore;
  let [onChange, setOnChange] = useState(false);
  const [employeeDetailsDisplayMode, setEmployeeDetailsDisplayMode] =
    React.useState(false);
  const [employeeFilteredInvoiceData, setEmployeeFilteredInvoiceData] =
    React.useState([]);
  const [totalmployeeFilteredInvoiceData, setTotalEmployeeFilteredInvoiceData] =
    React.useState([]);
  const { viewOrEditSaleTxnItem, resetEWayLaunchFlag } = store.SalesAddStore;
  const { viewOrEditSaleReturnTxnItem } = store.ReturnsAddStore;
  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } =
    toJS(store.SalesAddStore);
  const { openAddSalesReturn } = toJS(store.ReturnsAddStore);
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleOpenEWayGenerateModal } = store.EWayStore;

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleEmployeeCellClicked = (event) => {
    const colId = event.column.getId();

    if ('name' === colId) {
      setEmployeeDetailsDisplayMode(true);
      prepareEmployeeFilteredInvoiceData(event.data.employeeId);
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'Employee Name',
      field: 'name',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'Sales Count',
      field: 'salesCount',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Sales Value',
      field: 'salesValue',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Sales Return Count',
      field: 'salesReturnCount',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Sales Return Value',
      field: 'salesReturnValue',
      width: 300,
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

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      if (event.data.sales_return_number) {
        let clone = JSON.parse(JSON.stringify(event.data));
        viewOrEditSaleReturnTxnItem(clone);
      } else {
        let clone = JSON.parse(JSON.stringify(event.data));
        viewOrEditSaleTxnItem(clone);
      }
    }
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
      headerName: 'TYPE',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = data.sales_return_number ? 'Sales Return' : 'Sales';
        return result;
      }
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

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Employee Performance Report')) {
        setFeatureAvailable(false);
      }
    }
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

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setFromDate(formatDate(firstThisMonth));
    setToDate(formatDate(todayDate));
    setOnChange(true);
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && fromDate && toDate) {
        setOnChange(false);
        prepareEmployeePerformanceData();
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    if (gridApi) {
      if (employeeData) {
        gridApi.setRowData(employeeData);
      }
    }
  }, [employeeData]);

  useEffect(() => {
    if (gridAllInvoicesApi) {
      if (employeeFilteredInvoiceData) {
        gridAllInvoicesApi.setRowData(employeeFilteredInvoiceData);
      }
    }
  }, [employeeFilteredInvoiceData]);

  const prepareEmployeePerformanceData = async () => {
    setTotalData([]);
    setEmployeeData([]);
    setTotalEmployeeFilteredInvoiceData([]);
    setEmployeeFilteredInvoiceData([]);
    await Promise.all([
      getAllSaleDataByDate(fromDate, toDate),
      getAllSaleReturnDataByDate(fromDate, toDate)
    ]).then(async () => {
      console.log('completed fetching');
      let employeeList = await getAllReportEmployees();
      let employeeMap = new Map();
      for (let emp of employeeList) {
        let key = emp.name + '_' + emp.phoneNumber;
        let employeeObj = {
          name: emp.name + ' (' + emp.phoneNumber + ')',
          employeeId: emp.phoneNumber,
          salesCount: 0,
          salesValue: 0,
          salesReturnCount: 0,
          salesReturnValue: 0
        };
        employeeMap.set(key, employeeObj);
      }
      for (let obj of totalData) {
        let key = obj.salesEmployeeName + '_' + obj.salesEmployeePhoneNumber;
        if (employeeMap.has(key)) {
          let oldEmpObj = employeeMap.get(key);
          if (obj.sales_return_number) {
            oldEmpObj.salesReturnCount = oldEmpObj.salesReturnCount + 1;
            oldEmpObj.salesReturnValue =
              oldEmpObj.salesReturnValue + obj.total_amount;
          } else {
            oldEmpObj.salesCount = oldEmpObj.salesCount + 1;
            oldEmpObj.salesValue = oldEmpObj.salesValue + obj.total_amount;
          }
        }
      }

      let employeeData = [];
      if (employeeMap) {
        for (let [key, value] of employeeMap) {
          employeeData.push(value);
        }
        setEmployeeData(employeeData);
      }
    });
  };

  const prepareEmployeeFilteredInvoiceData = async (employeeId) => {
    setTotalEmployeeFilteredInvoiceData([]);
    setTotalData([]);
    setEmployeeData([]);
    await Promise.all([
      getAllSaleDataByDateAndEmployee(fromDate, toDate, employeeId),
      getAllSaleReturnDataByDateAndEmployee(fromDate, toDate, employeeId)
    ]).then(async () => {
      console.log('completed fetching invoice data');
      setEmployeeFilteredInvoiceData(totalmployeeFilteredInvoiceData);
    });
  };

  const getAllSaleDataByDate = async (fromDate, toDate) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.sales.find({
      selector: {
        $and: [
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
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      totalData.push(...response);
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
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      let response = data.map((item) => item);
      totalData.push(...response);
    });
  };

  const getAllSaleDataByDateAndEmployee = async (
    fromDate,
    toDate,
    employeeId
  ) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.sales.find({
      selector: {
        $and: [
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
            salesEmployeePhoneNumber: { $eq: employeeId }
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      totalmployeeFilteredInvoiceData.push(...response);
    });
  };

  const getAllSaleReturnDataByDateAndEmployee = async (
    fromDate,
    toDate,
    employeeId
  ) => {
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
          },
          {
            salesEmployeePhoneNumber: { $eq: employeeId }
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      let response = data.map((item) => item);
      totalmployeeFilteredInvoiceData.push(...response);
    });
  };

  const getDataForExcel = async () => {
    const wb = new Workbook();

    let data = [];
    if (employeeData && employeeData.length > 0) {
      for (var i = 0; i < employeeData.length; i++) {
        const record = {
          NAME: employeeData[i].name,
          'SALES COUNT': employeeData[i].salesCount,
          'SALES VALUE': employeeData[i].salesValue,
          'SALES RETURN COUNT': employeeData[i].salesReturnCount,
          'SALES RETURN VALUE': employeeData[i].salesReturnValue
        };
        data.push(record);
      }
    } else {
      const record = {
        NAME: '',
        'SALES COUNT': '',
        'SALES VALUE': '',
        'PAYMENT TYPE': '',
        'SALES RETURN COUNT': '',
        'SALES RETURN VALUE': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Employee Performance Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Employee Performance Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Employee_Performance_Report';

    download(url, fileName + '.xlsx');
  };

  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

  return (
    <div>
      <div className={classes.root} style={{ height: height - 50 }}>
        <Paper className={classes.root} style={{ height: height - 50 }}>
          <div className={classes.content}>
            <div className={classes.contentLeft}>
              <Typography gutterBottom variant="h4" component="h4">
                EMPLOYEE PERFORMANCE
              </Typography>
            </div>
          </div>

          <div>
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
                xs={2}
                style={{ marginTop: 'auto', marginLeft: '10%' }}
              >
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  className="category-actions-right"
                >
                  <Avatar>
                    <IconButton onClick={() => getDataForExcel()}>
                      <Excel fontSize="inherit" />
                    </IconButton>
                  </Avatar>
                </Grid>
              </Grid>
            </Grid>
          </div>

          {employeeDetailsDisplayMode === true && (
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
                setEmployeeDetailsDisplayMode(false);
                // call for employee preparation data
                setOnChange(true);
              }}
            >
              Back
            </Button>
          )}

          <div>
            {/* <App />  */}
            <Box mt={2}>
              {employeeDetailsDisplayMode === false ? (
                <div
                  style={{
                    width: '100%',
                    height: height - 162 + 'px',
                    marginTop: '16px'
                  }}
                  className=" blue-theme"
                >
                  <div
                    id="product-list-grid"
                    style={{ height: '100%', width: '100%' }}
                    className="ag-theme-material"
                  >
                    <AgGridReact
                      onGridReady={onGridReady}
                      enableRangeSelection
                      paginationPageSize={10}
                      suppressMenuHide
                      rowData={employeeData}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      rowSelection="single"
                      pagination
                      headerHeight={40}
                      rowClassRules={rowClassRules}
                      onCellClicked={handleEmployeeCellClicked}
                      overlayLoadingTemplate={
                        '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                      }
                      frameworkComponents={{}}
                    />
                  </div>
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
                    rowData={employeeFilteredInvoiceData}
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
        </Paper>
      </div>
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openAddSalesReturn ? <AddCreditNote /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(EmployeePerformance);