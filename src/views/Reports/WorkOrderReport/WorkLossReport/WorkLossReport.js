import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  IconButton,
  Grid,
  Typography,
  Avatar,
  Select,
  MenuItem,
  OutlinedInput,
  Button
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import dateFormat from 'dateformat';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import * as moment from 'moment';
import * as Db from '../../../../RxDb/Database/Database';
import { toJS } from 'mobx';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import AddJobWorkIn from 'src/views/JobWork/OrderIn';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';

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

const WorkLossReport = (props) => {
  const classes = useStyles();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const { height } = useWindowDimensions();
  const [custSub] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const [employeeList, setEmployeeList] = React.useState();
  const [employeeName, setEmployeeName] = React.useState('');
  const [employeePhoneNumber, setEmployeePhoneNumber] = React.useState();

  const { getAllReportEmployees } = stores.EmployeeStore;

  const [rowData, setRowData] = useState([]);

  const [totalWeightLoss, setTotalWeightLoss] = React.useState(0);

  const store = useStore();
  const { openAddSalesInvoice } = toJS(store.SalesAddStore);
  const { viewOrEditItem } = store.SalesAddStore;

  const { OpenAddJobWorkInvoice } = toJS(stores.JobWorkInStore);
  const { viewOrEditJobWorkInTxnItem } = stores.JobWorkInStore;

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

  const getEmployees = async () => {
    setEmployeeList(await getAllReportEmployees());
  };

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    if ('jobWorkIn.sequenceNumber' === colId) {
      const query = db.jobworkin.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            {
              job_work_in_invoice_number: {
                $eq: event.data.jobWorkIn.invoiceNumber
              }
            }
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

          viewOrEditJobWorkInTxnItem(data);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    } else if ('sale.sequenceNumber' === colId) {
      const query = db.sales.findOne({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { invoice_number: { $eq: event.data.sale.invoiceNumber } }
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

          viewOrEditItem(data);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });
    }
  };

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const [columnDefs] = useState([
    {
      headerName: 'ORDER NO',
      field: 'jobWorkIn.sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'SALE NO',
      field: 'sale.sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'invoiceDate',
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
      valueFormatter: orddateFormatter
    },
    {
      headerName: 'EMPLOYEE',
      field: 'jobAssignedEmployeeName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'WEIGHT IN',
      field: 'weightIn',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.weightIn || 0).toFixed(2);
      }
    },
    {
      headerName: 'WEIGHT OUT',
      field: 'weightOut',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.weightOut || 0).toFixed(2);
      }
    },
    {
      headerName: 'WASTAGE',
      field: 'netWeightLoss',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.netWeightLoss || 0).toFixed(2);
      }
    }
  ]);

  function orddateFormatter(params) {
    var dateAsString = params.data.invoiceDate;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

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

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  function formatDownloadExcelDate(dateAsString) {
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  function getTotal(data) {
    let total = 0;
    for (let item of data) {
      total += parseFloat(item.netWeightLoss);
    }

    return parseFloat(total).toFixed(2);
  }

  const getDataForXls = async () => {
    const wb = new Workbook();

    let data = [];
    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(rowData[i].invoiceDate),
          'ORDER NO': rowData[i].jobWorkSequenceNumber,
          'SALE NO': rowData[i].saleSequenceNumber,
          'EMPLOYEE NAME': rowData[i].jobAssignedEmployeeName,
          'WEIGHT IN': parseFloat(rowData[i].weightIn).toFixed(2),
          'WEIGHT OUT': parseFloat(rowData[i].weightOut).toFixed(2),
          'WEIGHT LOSS': parseFloat(rowData[i].netWeightLoss).toFixed(2)
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'ORDER NO': '',
        'SALE NO': '',
        'EMPLOYEE NAME': '',
        'WEIGHT IN': '',
        'WEIGHT OUT': '',
        'WEIGHT LOSS': ''
      };
      data.push(record);
    }

    const emptyRecord = {};
    data.push(emptyRecord);
    data.push(emptyRecord);

    const record = {
      DATE: 'TOTAL WEIGHT LOSS',
      'ORDER NO': getTotal(rowData),
      'SALE NO': '',
      'EMPLOYEE NAME': '',
      'WEIGHT LOSS': ''
    };
    data.push(record);

    let ws = XLSX.utils.json_to_sheet(data);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Work Loss Sheet');

    wb.Sheets['Work Loss Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Work_Loss_Report';

    download(url, fileName + '.xlsx');
  };

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [fromDate, setFromDate] = React.useState();
  const [toDate, setToDate] = React.useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(false);

  const [limit] = useState(10);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getEmployees();
    }

    fetchData();
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
      if (!businessData.posFeatures.includes('Work Order Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  const handleEmployeeClick = (employee) => {
    setEmployeeName(employee.name);
    setEmployeePhoneNumber(employee.phoneNumber);
    setTotalWeightLoss(0);
    setCurrentPage(1);
    setTotalPages(1);
    getWorkLossDataByDate(fromDate, toDate, employee.phoneNumber);
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
    console.log('onNextPageClicked');
    if (gridApi) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        setOnChange(true);
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && fromDate && toDate) {
        setOnChange(false);
        setRowData([]);
        getWorkLossDataByDate(fromDate, toDate);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getWorkLossDataByDate = async (
    fromDate,
    toDate,
    employeePhoneNumber
  ) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllWorkLossDataByDate(fromDate, toDate, employeePhoneNumber);
    }
    const businessData = await Bd.getBusinessData();

    if (employeePhoneNumber) {
      Query = db.workloss.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoiceDate: {
                $gte: dateFormat(fromDate, 'yyyy-mm-dd')
              }
            },
            {
              invoiceDate: {
                $lte: dateFormat(toDate, 'yyyy-mm-dd')
              }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              jobAssignedEmployeePhoneNumber: { $eq: employeePhoneNumber }
            }
          ]
        },
        sort: [{ invoiceDate: 'desc' }, { updatedAt: 'desc' }],
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.workloss.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoiceDate: {
                $gte: dateFormat(fromDate, 'yyyy-mm-dd')
              }
            },
            {
              invoiceDate: {
                $lte: dateFormat(toDate, 'yyyy-mm-dd')
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoiceDate: 'desc' }, { updatedAt: 'desc' }],
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
      setRowData(response);
    });
  };

  const getAllWorkLossDataByDate = async (
    fromDate,
    toDate,
    employeePhoneNumber
  ) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (employeePhoneNumber) {
      Query = db.workloss.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoiceDate: {
                $gte: dateFormat(fromDate, 'yyyy-mm-dd')
              }
            },
            {
              invoiceDate: {
                $lte: dateFormat(toDate, 'yyyy-mm-dd')
              }
            },
            {
              updatedAt: { $exists: true }
            },
            {
              jobAssignedEmployeePhoneNumber: { $eq: employeePhoneNumber }
            }
          ]
        }
      });
    } else {
      Query = db.workloss.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            {
              invoiceDate: {
                $gte: dateFormat(fromDate, 'yyyy-mm-dd')
              }
            },
            {
              invoiceDate: {
                $lte: dateFormat(toDate, 'yyyy-mm-dd')
              }
            },
            {
              updatedAt: { $exists: true }
            }
          ]
        }
      });
    }

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        ++count;
        return item;
      });

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
      calculateAggregatedValues(response);
    });
  };

  const calculateAggregatedValues = (data) => {
    let total = 0;
    for (let item of data) {
      total += parseFloat(item.netWeightLoss);
    }

    setTotalWeightLoss(parseFloat(total).toFixed(2));
  };

  const getWorkLossSearchWithDateAndEmployee = async (
    value,
    fromDate,
    toDate,
    employeePhoneNumber
  ) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllWorkLossSearchWithDateAndEmployee(
        value,
        fromDate,
        toDate,
        employeePhoneNumber
      );
    }

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    if (employeePhoneNumber) {
      Query = db.workloss.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { saleSequenceNumber: { $regex: regexp } },
                {
                  jobAssignedEmployeePhoneNumber: { $eq: employeePhoneNumber }
                },
                {
                  invoiceDate: {
                    $gte: fromDate
                  }
                },
                {
                  invoiceDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                {
                  jobAssignedEmployeePhoneNumber: { $eq: employeePhoneNumber }
                },
                { jobWorkSequenceNumber: { $regex: regexp } },
                {
                  invoiceDate: {
                    $gte: fromDate
                  }
                },
                {
                  invoiceDate: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        },
        sort: [{ invoiceDate: 'desc' }],
        skip: skip,
        limit: limit
      });
    } else {
      const businessData = await Bd.getBusinessData();

      Query = db.workloss.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { saleSequenceNumber: { $regex: regexp } },
                {
                  invoiceDate: {
                    $gte: fromDate
                  }
                },
                {
                  invoiceDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { jobWorkSequenceNumber: { $regex: regexp } },
                {
                  invoiceDate: {
                    $gte: fromDate
                  }
                },
                {
                  invoiceDate: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        },
        sort: [{ invoiceDate: 'desc' }],
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
      setRowData(response);
    });
  };

  const getAllWorkLossSearchWithDateAndEmployee = async (
    value,
    fromDate,
    toDate,
    employeePhoneNumber
  ) => {
    const db = await Db.get();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();
    let Query;
    if (employeePhoneNumber) {
      Query = db.workloss.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { saleSequenceNumber: { $regex: regexp } },
                {
                  jobAssignedEmployeePhoneNumber: { $eq: employeePhoneNumber }
                },
                {
                  invoiceDate: {
                    $gte: fromDate
                  }
                },
                {
                  invoiceDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                {
                  jobAssignedEmployeePhoneNumber: { $eq: employeePhoneNumber }
                },
                { jobWorkSequenceNumber: { $regex: regexp } },
                {
                  invoiceDate: {
                    $gte: fromDate
                  }
                },
                {
                  invoiceDate: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        }
      });
    } else {
      Query = db.workloss.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { saleSequenceNumber: { $regex: regexp } },
                {
                  invoiceDate: {
                    $gte: fromDate
                  }
                },
                {
                  invoiceDate: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { jobWorkSequenceNumber: { $regex: regexp } },
                {
                  invoiceDate: {
                    $gte: fromDate
                  }
                },
                {
                  invoiceDate: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        }
      });
    }

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      let response = data.map((item) => {
        ++count;
        return item;
      });

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
      calculateAggregatedValues(response);
    });
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        getWorkLossSearchWithDateAndEmployee(
          target,
          fromDate,
          toDate,
          employeePhoneNumber
        );
      } else {
        getWorkLossDataByDate(fromDate, toDate);
      }
    }
  };

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 63 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 63 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    WORK LOSS REPORT
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
                        className={classes.textField}
                        onChange={(e) => {
                          setCurrentPage(1);
                          setTotalPages(1);
                          setOnChange(true);
                          setToDate(formatDate(e.target.value));
                        }}
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
                        setEmployeePhoneNumber(null);
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
                <Grid item xs={3}>
                  <Grid container style={{ marginTop: '-14px' }}>
                    <Grid item className={headerClasses.card}></Grid>
                  </Grid>
                </Grid>
              </Grid>

              {/* <Paper className={classes.paperRoot}> */}
              <Grid
                container
                direction="row"
                alignItems="center"
                style={{ marginTop: '10px' }}
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={7}>
                  {/* <Typography variant="h4">Transaction</Typography> */}
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={5}
                  align="right"
                  className={classes.categoryActionWrapper}
                >
                  <Grid container direction="row" alignItems="center">
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

                    <Grid xs={12} sm={2} className="category-actions-right">
                      <Avatar>
                        <IconButton onClick={() => getDataForXls()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <div
                style={{
                  width: '100%',
                  height: height - 275 + 'px'
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
                    rowData={rowData}
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
                      marginTop: '10px',
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
                          xs={12}
                          style={{ display: 'flex', flexDirection: 'row' }}
                        >
                          <Grid item>
                            <Typography>
                              Total Weight Loss : {totalWeightLoss}{' '}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
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
      {OpenAddJobWorkInvoice ? <AddJobWorkIn /> : null}
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
    </div>
  );
};

export default InjectObserver(WorkLossReport);