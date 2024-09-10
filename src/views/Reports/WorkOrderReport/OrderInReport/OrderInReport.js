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

const OrderInReport = (props) => {
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
  const [employeeId, setEmployeeId] = React.useState();

  const { getAllReportEmployees } = stores.EmployeeStore;

  const [rowData, setRowData] = useState([]);

  const { OpenAddJobWorkInvoice } = toJS(stores.JobWorkInStore);
  const { viewOrEditItem } = stores.JobWorkInStore;
  const { productDialogOpen } = toJS(stores.ProductStore);

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
      headerName: 'INVOICE NUMBER',
      field: 'sequenceNumber',
      width: 180,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE</p>
            <p>NUMBER</p>
          </div>
        );
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'invoice_date',
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
      headerName: 'CUSTOMER',
      field: 'customer_name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
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
      headerName: 'AMOUNT',
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>NET</p>
            <p>WEIGHT</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;

        for (let item of data.item_list) {
          if (item.netWeight !== '') {
            result = result + parseFloat(item.netWeight);
          }
        }

        return parseFloat(result || 0).toFixed(2);
      }
    },
    {
      headerName: 'TOTAL ITEMS',
      field: 'numberOfItems',
      width: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>ITEMS</p>
          </div>
        );
      }
    },
    {
      headerName: 'PENDING ITEMS',
      field: 'numberOfPendingItems',
      width: 150,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PENDING</p>
            <p>ITEMS</p>
          </div>
        );
      }
    },
    {
      headerName: 'DUE DATE',
      field: 'due_date',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: dueDateFormatter
    },
    {
      headerName: 'STATUS',
      field: 'status',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

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

  const getNetWeight = (data) => {
    let result = 0;

    for (let item of data.item_list) {
      if (item.netWeight !== '') {
        result = result + parseFloat(item.netWeight);
      }
    }

    return parseFloat(result).toFixed(2);
  };

  const getDataForXls = async () => {
    const wb = new Workbook();

    let allSalesData = await getAllJobWorkInDataByDateAndEmployeeToDownload(
      fromDate,
      toDate,
      employeeId
    );

    let data = [];
    if (allSalesData && allSalesData.length > 0) {
      for (var i = 0; i < allSalesData.length; i++) {
        const record = {
          DATE: formatDownloadExcelDate(allSalesData[i].invoice_date),
          'INVOICE NUMBER': allSalesData[i].sequenceNumber,
          CUSTOMER: allSalesData[i].customer_name,
          EMPLOYEE: allSalesData[i].jobAssignedEmployeeName,
          AMOUNT: allSalesData[i].total_amount,
          'NET WEIGHT': getNetWeight(allSalesData[i]),
          'TOTAL ITEMS': allSalesData[i].numberOfItems,
          'PENDING ITEMS': allSalesData[i].numberOfPendingItems,
          'DUE DATE': allSalesData[i].due_date,
          STATUS: allSalesData[i].status
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'INVOICE NUMBER': '',
        CUSTOMER: '',
        EMPLOYEE: '',
        AMOUNT: '',
        'NET WEIGHT': '',
        'TOTAL ITEMS': '',
        'PENDING ITEMS': '',
        'DUE DATE': '',
        STATUS: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('JWI Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['JWI Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'JWI_Report';

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

  const { handleJobWorkInSearchWithDateAndEmployee } = stores.JobWorkInStore;

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
    setEmployeeId(employee.employeeId);
    getJobWorkInDataByDate(fromDate, toDate, employee.employeeId);
  };

  const getJobWorkInDataByDate = async (fromDate, toDate, employeeId) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllJobWorkInDataByDate(fromDate, toDate, employeeId);
    }
    const businessData = await Bd.getBusinessData();

    if (employeeId) {
      Query = db.jobworkin.find({
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
              updatedAt: { $exists: true }
            },
            {
              jobAssignedEmployeePhoneNumber: { $eq: employeeId }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }],
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.jobworkin.find({
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
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }],
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

  const getAllJobWorkInDataByDate = async (fromDate, toDate, employeeId) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (employeeId) {
      Query = db.jobworkin.find({
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
              updatedAt: { $exists: true }
            },
            {
              jobAssignedEmployeePhoneNumber: { $eq: employeeId }
            }
          ]
        }
      });
    } else {
      Query = db.jobworkin.find({
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

      setRowData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getAllJobWorkInDataByDateAndEmployeeToDownload = async (
    fromDate,
    toDate
  ) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (employeeId) {
      Query = db.jobworkin.find({
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
              updatedAt: { $exists: true }
            },
            {
              jobAssignedEmployeePhoneNumber: { $eq: employeeId }
            }
          ]
        },
        sort: [{ invoice_date: 'asc' }]
      });
    } else {
      Query = db.jobworkin.find({
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
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ invoice_date: 'asc' }]
      });
    }

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
        getJobWorkInDataByDate(fromDate, toDate);
      }
    };

    loadPaginationData();
  }, [onChange]);

  function dateFormatter(params) {
    if (params && params.data && params.data.invoice_date) {
      var dateAsString = params.data.invoice_date;
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
  }

  function dueDateFormatter(params) {
    if (params && params.data && params.data.due_date) {
      var dateAsString = params.data.due_date;
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
  }

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        getJobWorkInSearchWithDateAndEmployee(
          target,
          fromDate,
          toDate,
          employeeId
        );
      } else {
        getJobWorkInDataByDate(fromDate, toDate);
      }
    }
  };

  const getJobWorkInSearchWithDateAndEmployee = async (
    value,
    fromDate,
    toDate,
    employeeId
  ) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllJobWorkInSearchWithDateAndEmployee(
        value,
        fromDate,
        toDate,
        employeeId
      );
    }

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();

    if (employeeId) {
      Query = await db.jobworkin.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { sequenceNumber: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { customer_name: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { jobAssignedEmployeeName: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { total_amount: { $eq: parseFloat(value) } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { balance_amount: { $eq: parseFloat(value) } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { status: { $eq: value } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }],
        skip: skip,
        limit: limit
      });
    } else {
      Query = await db.jobworkin.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { sequenceNumber: { $regex: regexp } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { customer_name: { $regex: regexp } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { jobAssignedEmployeeName: { $regex: regexp } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { total_amount: { $eq: parseFloat(value) } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { balance_amount: { $eq: parseFloat(value) } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { status: { $eq: value } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        },
        sort: [{ invoice_date: 'desc' }, { updatedAt: 'desc' }],
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

  const getAllJobWorkInSearchWithDateAndEmployee = async (
    value,
    fromDate,
    toDate,
    employeeId
  ) => {
    const db = await Db.get();
    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    const businessData = await Bd.getBusinessData();
    let Query;

    if (employeeId) {
      Query = db.jobworkin.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { sequenceNumber: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { customer_name: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { jobAssignedEmployeeName: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { total_amount: { $eq: parseFloat(value) } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { balance_amount: { $eq: parseFloat(value) } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { status: { $eq: value } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            }
          ]
        }
      });
    } else {
      Query = db.jobworkin.find({
        selector: {
          $or: [
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },

                { sequenceNumber: { $regex: regexp } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { customer_name: { $regex: regexp } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { jobAssignedEmployeeName: { $regex: regexp } },
                { employeeId: { $eq: employeeId } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { total_amount: { $eq: parseFloat(value) } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { balance_amount: { $eq: parseFloat(value) } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
                    $lte: toDate
                  }
                }
              ]
            },
            {
              $and: [
                { status: { $eq: value } },
                {
                  invoice_date: {
                    $gte: fromDate
                  }
                },
                {
                  invoice_date: {
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

      setRowData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
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
                    JOB WORK ORDER IN
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
                <Grid item xs={3}>
                  <Grid container style={{ marginTop: '-14px' }}>
                    <Grid item className={headerClasses.card}></Grid>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="center"
                style={{ marginTop: '10px' }}
                className={classes.sectionHeader}
              >
                <Grid item xs={12} sm={7}>
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
                  height: height - 225 + 'px'
                }}
                className=" blue-theme"
              >
                <div
                  id="sales-invoice-grid"
                  style={{ height: '93%', width: '100%' }}
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
      {OpenAddJobWorkInvoice ? <AddJobWorkIn /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(OrderInReport);