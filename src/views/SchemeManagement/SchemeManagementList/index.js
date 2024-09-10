import React, { useState, useEffect } from 'react';
import Page from 'src/components/Page';
import {
  Paper,
  makeStyles,
  InputAdornment,
  Grid,
  Typography,
  Select,
  OutlinedInput,
  MenuItem
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from 'src/components/controls/index';
import * as Db from 'src/RxDb/Database/Database';
import moreoption from 'src/components/Options';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { Add } from '@material-ui/icons';
import { AgGridReact } from 'ag-grid-react';
import './SchemeList.css';
import * as moment from 'moment';
import DateRangePicker from 'src/components/controls/DateRangePicker';
import dateFormat from 'dateformat';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from 'src/icons/svg/left_arrow.svg';
import right_arrow from 'src/icons/svg/right_arrow.svg';
import first_page_arrow from 'src/icons/svg/first_page_arrow.svg';
import last_page_arrow from 'src/icons/svg/last_page_arrow.svg';
import * as Bd from 'src/components/SelectedBusiness';
import { toJS } from 'mobx';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import MoreOptionsSchemeManagement from 'src/components/MoreOptionsSchemeManagement';
import AddSchemeManagement from '../AddSchemeManagement';
import ReceiveSchemeManagementPayment from '../ReceiveSchemeManagementPayment';
import SchemePaymentHistory from '../PaymentHistory/SchemePaymentHistory';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice/index';

const useStyles = makeStyles((theme) => ({
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

  storebtn: {
    borderTop: '1px solid #d8d8d8',
    borderRadius: 'initial',
    borderBottom: '1px solid #d8d8d8',
    paddingLeft: '12px',
    paddingRight: '12px',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 5px 7px 5px'
  },
  onlinebtn: {
    // paddingRight: '14px',
    // paddingLeft: '12px',
    border: '1px solid #d8d8d8',
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 'initial',
    borderTopLeftRadius: 'initial',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 14px 7px 12px'
  },
  allbtn: {
    border: '1px solid #d8d8d8',
    borderBottomLeftRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 'initial',
    borderTopRightRadius: 'initial',
    position: 'relative',
    fontSize: 12,
    color: '#b5b3b3',
    padding: '9px 5px 7px 5px'
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

const SchemeManagementList = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);
  let [schemeData, setSchemeData] = useState([]);
  let [onChange, setOnChange] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [type, setType] = useState('');

  const { schemeTypesList } = toJS(stores.SchemeTypesStore);
  const { getSchemeTypes } = stores.SchemeTypesStore;

  const {
    isSchemeManagementList,
    schemeManagementDialogOpen,
    openSchemePaymentHistory
  } = toJS(stores.SchemeManagementStore);
  const { openReceivePaymentForScheme } = toJS(stores.PaymentInStore);

  const { handleSchemeManagementModalOpen } = stores.SchemeManagementStore;
  const { openAddSalesInvoice } = toJS(stores.SalesAddStore);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    suppressHorizontalScroll: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const getSchemeDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setSchemeData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSchemeDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    if (type !== '') {
      Query = db.schememanagement.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { date: { $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd') } },
            { date: { $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd') } },
            { type: { $eq: type } },
            { updatedAt: { $exists: true } }
          ]
        },
        sort: [{ updatedAt: 'desc' }],
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.schememanagement.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { date: { $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd') } },
            { date: { $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd') } },
            { updatedAt: { $exists: true } }
          ]
        },
        sort: [{ updatedAt: 'desc' }],
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

        return temp;
      });
      setSchemeData(response);
    });
  };

  const getAllSchemeDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    if (type !== '') {
      Query = db.schememanagement.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { date: { $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd') } },
            { date: { $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd') } },
            { type: { $eq: type } },
            { updatedAt: { $exists: true } }
          ]
        }
      });
    } else {
      Query = db.schememanagement.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { date: { $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd') } },
            { date: { $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd') } },
            { updatedAt: { $exists: true } }
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
    });
  };

  const getSchemeDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setSchemeData([]);
    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSchemeDataBySearch(value);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.schememanagement.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customerName: { $regex: regexp } }
            ]
          }
        ]
      },
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let temp = item;

        return temp;
      });
      setSchemeData(response);
    });
  };

  const getAllSchemeDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();
    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.schememanagement.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { customerName: { $regex: regexp } }
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
    });
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

  function dateFormatter(params) {
    var dateAsString = params.data.date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
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
      headerName: 'SCHEME NUMBER',
      field: 'sequenceNumber',
      width: 200,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SCHEME</p>
            <p>NUMBER</p>
          </div>
        );
      }
    },
    {
      headerName: 'SCHEME TYPE',
      field: 'type',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SCHEME</p>
            <p>TYPE</p>
          </div>
        );
      }
    },
    {
      headerName: 'CUSTOMER NAME',
      field: 'customerName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CUSTOMER</p>
            <p>NAME</p>
          </div>
        );
      }
    },
    {
      headerName: 'PERIOD',
      field: 'period',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'DEPOSIT',
      field: 'depositAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PAID',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let amount = 0;
        if (data.linkedTxnList && data.linkedTxnList.length > 0) {
          for (let p of data.linkedTxnList) {
            amount += parseFloat(p.linkedAmount || 0);
          }
        }
        return parseFloat(amount.toFixed(2));
      }
    },
    {
      headerName: 'STATUS',
      field: 'schemeOrderType',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      cellRenderer: 'templateActionRenderer'
    }
  ]);

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const TemplateActionRenderer = (props) => {
    return (
      <MoreOptionsSchemeManagement
        menu={moreoption.moreoptionsdata}
        index={props['data']['sequenceNumber']}
        item={props['data']}
        id={props['data']['sequenceNumber']}
        component="schemeList"
      />
    );
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        setSearchText(target);
        getSchemeDataBySearch(target);
      } else {
        getSchemeDataByDate(dateRange);
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (schemeData) {
        gridApi.setRowData(schemeData);
      }
    }
  }, [schemeData]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  useEffect(() => {
    async function fetchData() {
      await getSchemeTypes();
    }

    fetchData();
  }, []);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setRowData([]);
        if (searchText && searchText.length > 0) {
          await getSchemeDataBySearch(searchText);
        } else {
          await getSchemeDataByDate(dateRange);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (isSchemeManagementList === true) {
        setOnChange(false);
        setRowData([]);
        await getSchemeDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [isSchemeManagementList]);

  return (
    <div>
      <Page className={classes.root} title="Scheme List">
        {/* ------------------------------------------- HEADER -------------------------------------------- */}

        <Paper className={headerClasses.paperRoot}>
          <Grid container>
            <Grid item xs={12} sm={12} className={headerClasses.card}>
              <div
                style={{
                  marginRight: '10px',
                  marginTop: '20px',
                  cursor: 'pointer'
                }}
              >
                <DateRangePicker
                  value={dateRange}
                  onChange={(dateRange) => {
                    if (
                      moment(dateRange.fromDate).isValid() &&
                      moment(dateRange.toDate).isValid()
                    ) {
                      setDateRange(dateRange);
                    } else {
                      setDateRange({
                        fromDate: new Date(),
                        toDate: new Date()
                      });
                    }
                    setOnChange(true);
                    setCurrentPage(1);
                    setTotalPages(1);
                  }}
                />
              </div>
            </Grid>
          </Grid>
        </Paper>

        {/* -------------------------------------------- BODY ------------------------------------------------- */}

        <Paper className={classes.paperRoot}>
          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            className={classes.sectionHeader}
          >
            <Grid item xs={12} sm={4}>
              <Typography variant="h4">Transaction </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Grid item xs={11} style={{ display: 'flex' }}>
                <Select
                  displayEmpty
                  value={type === '' ? 'Select' : type}
                  input={
                    <OutlinedInput
                      style={{
                        width: '100%',
                        marginLeft: '15px',
                        height: '60%'
                      }}
                    />
                  }
                  inputProps={{ 'aria-label': 'Without label' }}
                  onChange={(e) => {
                    if ('Select' !== e.target.value) {
                      setType(e.target.value);
                      setOnChange(true);
                      setCurrentPage(1);
                      setTotalPages(1);
                    } else {
                      setType('');
                      setOnChange(true);
                      setCurrentPage(1);
                      setTotalPages(1);
                    }
                  }}
                >
                  <MenuItem value={'Select'}>{'Select'}</MenuItem>
                  {schemeTypesList.map((menutxt) => (
                    <MenuItem value={menutxt.name}>{menutxt.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5} align="right">
              <Grid container direction="row" spacing={2} alignItems="center">
                <Grid item xs={7} align="right">
                  <Controls.Input
                    placeholder="Search Transaction by No/Customer Name"
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
                <Grid item xs={5} align="right">
                  <Controls.Button
                    text="Add Scheme"
                    size="medium"
                    variant="contained"
                    color="primary"
                    autoFocus={true}
                    startIcon={<Add />}
                    className={classes.newButton}
                    onClick={() => {
                      handleSchemeManagementModalOpen();
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <div style={{ width: '100%', height: height - 242 + 'px' }}>
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
                suppressPaginationPanel={true}
                suppressScrollOnNewData={true}
                rowClassRules={rowClassRules}
                overlayLoadingTemplate={
                  '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                }
                overlayNoRowsTemplate={
                  '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                }
                frameworkComponents={{
                  templateActionRenderer: TemplateActionRenderer
                }}
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

          {schemeManagementDialogOpen ? <AddSchemeManagement /> : null}
          {openSchemePaymentHistory ? <SchemePaymentHistory /> : null}
          {openReceivePaymentForScheme ? (
            <ReceiveSchemeManagementPayment />
          ) : null}
          {openAddSalesInvoice ? <AddSalesInvoice /> : null}
        </Paper>
      </Page>
    </div>
  );
};
export default InjectObserver(SchemeManagementList);