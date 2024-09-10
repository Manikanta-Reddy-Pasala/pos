import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import {
  Typography,
  Grid,
  Avatar,
  IconButton,
  Paper,
  MenuItem,
  Select,
  OutlinedInput,
  Button
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import Excel from '../../../../icons/Excel';
import useWindowDimensions from '../../../../components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import * as Db from '../../../../RxDb/Database/Database';
import dateFormat from 'dateformat';
import * as moment from 'moment';
import XLSX from 'xlsx';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import NoPermission from '../../../noPermission';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import AddnewPaymentOut from 'src/views/purchases/PaymentOut/AddPaymentOut';

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

const PaymentMadebyEmployeeReport = () => {
  const classes = useStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);

  const [records, setRecords] = useState(null);

  const [gridApi, setGridApi] = useState(null);

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const todayDate = new Date(thisYear, thisMonth, today);

  const [employeeList, setEmployeeList] = React.useState();
  const [employeeName, setEmployeeName] = React.useState('');
  const [employeeId, setEmployeeId] = React.useState();

  const { getAllReportEmployees } = stores.EmployeeStore;

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));

  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  const store = useStore();
  const { OpenAddPaymentOut } = toJS(store.PaymentOutStore);
  const { viewOrEditPaymentOutTxnItem } = store.PaymentOutStore;

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

  function dateFormatter(params) {
    var dateAsString = params.data.date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      viewOrEditPaymentOutTxnItem(event.data);
    }
  };

  const statusCellStyle = (params) => {
    let data = params['data'];

    if (data['balance'] === 0) {
      return { color: '#86ca94', fontWeight: 500 };
    } else if (
      data['balance'] < data['total'] ||
      data['balance'] === data['total']
    ) {
      return { color: '#faab53', fontWeight: 500 };
    }
    return null;
  };

  const [columnDefs] = useState([
    {
      headerName: 'REF NO.',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>REFERENCE</p>
            <p>NUMBER</p>
          </div>
        );
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'date',
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
      valueFormatter: dateFormatter
    },
    {
      headerName: 'NAME',
      field: 'vendorName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TYPE',
      field: 'paymentType',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TOTAL',
      field: 'total',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['paid']
          ? parseFloat(params['data']['paid']).toFixed(2)
          : '0';
      }
    },
    {
      headerName: 'PAID',
      field: 'paid',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['paid']
          ? parseFloat(params['data']['paid']).toFixed(2)
          : '0';
      }
    },
    {
      headerName: 'BALANCE',
      field: 'balance',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['balance']
          ? parseFloat(params['data']['balance']).toFixed(2)
          : '0';
      }
    },
    {
      headerName: 'PAYMENT STATUS',
      field: 'paymentStatus',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PAYMENT</p>
            <p>STATUS</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['balance'] === 0) {
          result = 'Used';
        } else if (parseFloat(data['balance']) < parseFloat(data['total'])) {
          result = 'Partial';
        } else if (parseFloat(data['balance']) === parseFloat(data['total'])) {
          result = 'Un Used';
        }
        return result;
      },
      cellStyle: statusCellStyle
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

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        await getPaymentOutDataByDate();
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      setEmployeeList([]);
      getEmployees();
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
      if (!businessData.posFeatures.includes('Employees Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  const getEmployees = async () => {
    setEmployeeList(await getAllReportEmployees());
  };

  const handleEmployeeClick = (employee) => {
    setEmployeeName(employee.name);
    setEmployeeId(employee.employeeId);
    getAllPaymentOutDataByDateAndEmployee(employee.employeeId);
    getPaymentOutDataByDate(employee.employeeId);
  };

  const getPaymentOutDataByDate = async (employeeId) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRecords([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPaymentOutDataByDate();
    }

    const businessData = await Bd.getBusinessData();

    if (employeeId) {
      Query = db.paymentout.find({
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
              employeeId: {
                $eq: employeeId
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }],
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.paymentout.find({
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
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }],
        skip: skip,
        limit: limit
      });
    }

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item.toJSON());
      setRecords(response);
    });
  };

  const getAllPaymentOutDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    Query = db.paymentout.find({
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

  const getAllPaymentOutDataByDateAndEmployee = async (employeeId) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.paymentout.find({
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
            employeeId: { $eq: employeeId }
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

  const getAllPaymentOutDataByDateXlsx = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.paymentout.find({
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

    let response = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      response = data.map((item) => item);
    });
    return response;
  };

  const getAllPaymentOutDataByDateAndEmployeeXlsx = async (employeeId) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.paymentout.find({
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
            employeeId: { $eq: employeeId }
          }
        ]
      }
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);
    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

  useEffect(() => {
    if (!!gridApi) {
      gridApi.setRowData(records);
    }
  }, [records, gridApi]);

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

  function getPaymentStatus(data) {
    let result = '';

    if (data['balance'] === 0) {
      result = 'Used';
    } else if (parseFloat(data['balance']) < parseFloat(data['total'])) {
      result = 'Partial';
    } else if (parseFloat(data['balance']) === parseFloat(data['total'])) {
      result = 'Un Used';
    }
    return result;
  }

  const getData = async () => {
    const wb = new Workbook();

    let xlsxPaymentReceiveList = [];

    if (employeeId) {
      xlsxPaymentReceiveList = await getAllPaymentOutDataByDateAndEmployeeXlsx(
        fromDate,
        toDate,
        employeeId
      );
    } else {
      xlsxPaymentReceiveList = await getAllPaymentOutDataByDateXlsx(
        fromDate,
        todayDate
      );
    }

    let data = [];
    if (xlsxPaymentReceiveList && xlsxPaymentReceiveList.length > 0) {
      for (var i = 0; i < xlsxPaymentReceiveList.length; i++) {
        const record = {
          DATE: xlsxPaymentReceiveList[i].date,
          'REF NO': xlsxPaymentReceiveList[i].receiptNumber,
          NAME: xlsxPaymentReceiveList[i].vendorName,
          TYPE: xlsxPaymentReceiveList[i].paymentType,
          TOTAL: xlsxPaymentReceiveList[i].paid
            ? parseFloat(xlsxPaymentReceiveList[i].paid).toFixed(2)
            : 0,
          PAID: xlsxPaymentReceiveList[i].paid
            ? parseFloat(xlsxPaymentReceiveList[i].paid).toFixed(2)
            : 0,
          BALANCE: xlsxPaymentReceiveList[i].balance
            ? xlsxPaymentReceiveList[i].balance.toFixed(2)
            : 0,
          STATUS: getPaymentStatus(xlsxPaymentReceiveList[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'REF NO': '',
        NAME: '',
        TYPE: '',
        TOTAL: '',
        PAID: '',
        BALANCE: '',
        STATUS: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Payment Made By Employee');

    console.log('test:: ws::', ws);
    wb.Sheets['Payment Made By Employee'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Payment_Made_by_Employee_Report';

    download(url, fileName + '.xlsx');
  };

  return (
    <div>
      <div className={classes.root} style={{ height: height - 83 }}>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div className={classes.root}>
            {isFeatureAvailable ? (
              <Paper className={classes.root} style={{ height: height - 51 }}>
                <div className={classes.content}>
                  <div className={classes.contentLeft}>
                    <Typography gutterBottom variant="h4" component="h4">
                      PAYMENTS MADE - EMPLOYEE
                    </Typography>
                  </div>
                </div>

                <div>
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
                              setOnChange(true);
                              setFromDate(formatDate(e.target.value));
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
                              setOnChange(true);
                              setToDate(formatDate(e.target.value));
                            }}
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </form>
                      </div>
                    </Grid>
                    <Grid item xs={4} style={{ marginTop: '16px' }}>
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
                    <Grid item xs={3} style={{ marginTop: '14px' }}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justify="flex-end"
                        className="category-actions-right"
                      >
                        <Avatar>
                          <IconButton onClick={() => getData()}>
                            <Excel fontSize="inherit" />
                          </IconButton>
                        </Avatar>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>

                <div
                  id="sales-return-grid"
                  style={{
                    width: '100%',
                    height: height - 172 + 'px',
                    marginTop: '10px'
                  }}
                  className=" blue-theme"
                >
                  <div
                    style={{ height: '95%', width: '100%' }}
                    className="ag-theme-material"
                  >
                    <AgGridReact
                      onGridReady={onGridReady}
                      enableRangeSelection={true}
                      paginationPageSize={10}
                      suppressMenuHide={true}
                      rowData={records}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      pagination={true}
                      rowSelection="single"
                      headerHeight={40}
                      suppressPaginationPanel={true}
                      suppressScrollOnNewData={true}
                      rowClassRules={rowClassRules}
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
            ) : (
              <NoPermission />
            )}
          </div>
        )}
      </div>
      {OpenAddPaymentOut ? <AddnewPaymentOut /> : null}
    </div>
  );
};

export default InjectObserver(PaymentMadebyEmployeeReport);