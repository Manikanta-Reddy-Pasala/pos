import React, { useEffect, useState } from 'react';
import Page from '../../../../components/Page';
import { Grid, InputAdornment, makeStyles, Paper, Typography } from '@material-ui/core';
import { Add, Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import moreoption from '../../../../components/Options';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import './OrderIn.css';
import * as moment from 'moment';
import DateRangePicker from '../../../../components/controls/DateRangePicker';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import AddJobWorkIn from '../AddJobWorkIn';
import MoreOptionsJobWorkIn from 'src/components/MoreOptionsJobWorkIn';
import AddSalesInvoice from '../../../../views/sales/SalesInvoices/AddInvoice/index';
import ProductModal from 'src/components/modal/ProductModal';
import OpenPreview from 'src/components/OpenPreview';
import CustomPrintPopUp from 'src/views/Printers/Invoice/CustomPrintPopUp';
import AddSalesQuotation from 'src/views/sales/SalesQuotation/AddSalesQuotation';
import FilterDropdown from '../../../common/FilterDropdown';
import { getJobWorkInDataByDate, getJobWorkInDataBySearch } from '../../../../components/Helpers/dbQueries/jobworkin';
import { getDateBeforeMonths, getFinancialYearStartDate } from '../../../../components/Helpers/DateHelper';


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

const Saleslist = (props) => {
    const classes = useStyles();
    const { height } = useWindowDimensions();
    const headerClasses = useHeaderStyles();
    const stores = useStore();
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    const { openCustomPrintPopUp } = toJS(
      stores.PrinterSettingsStore
    );

    const {
      OpenAddJobWorkInvoice,
      printJobWorkInData,
      openJobWorkInPrintSelectionAlert
    } = toJS(stores.JobWorkInStore);
    const {
      openForNewJobWorkIn,
      handleCloseJobWorkInPrintSelectionAlertMessage
    } = stores.JobWorkInStore;
    const { productDialogOpen } = stores.ProductStore;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [limit] = useState(10);

    const [rowData, setRowData] = useState(null);
    let [saleData, setSaleData] = useState([]);
    let [allSaleData, setAllSaleData] = useState([]);
    let [onChange, setOnChange] = useState(true);

    const { openAddSalesInvoice } = toJS(stores.SalesAddStore);
    const { OpenAddsalesQuotationInvoice } = toJS(stores.SalesQuotationAddStore);

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

    const [selectedMonthFilter] = useState(() => {
      // Initialize state from local storage if available
      return localStorage.getItem('jobWorkInSelectedMonthFilter') || 3;
    });

    const handleFilterChange = async (e) => {
      let newValue = e.target.value;

      console.log('Filter value:', newValue);
      localStorage.setItem('jobWorkInSelectedMonthFilter', newValue); // Store in local storage
      setOnChange(true);
    };

    const onGridReady = (params) => {
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      }, 100);

      window.addEventListener('resize', function() {
        setTimeout(function() {
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
      const dateAsString = params.data.invoice_date;
      const dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }

    const statusCellStyle = (params) => {
      let data = params['data'];

      if (data['status'] === 'open') {
        return { color: '#faab53', fontWeight: 500 };
      } else {
        return { color: '#86ca94', fontWeight: 500 };
      }
    };

    const [columnDefs] = useState([
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
        headerName: 'Work Order Number',
        field: 'sequenceNumber',
        width: 180,
        filterParams: {
          buttons: ['reset', 'apply'],
          closeOnApply: true
        },
        headerComponentFramework: (props) => {
          return (
            <div>
              <p>WORK ORDER</p>
              <p>NUMBER</p>
            </div>
          );
        }
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
        valueFormatter: dateFormatter
      },
      {
        headerName: 'STATUS',
        field: 'status',
        cellStyle: statusCellStyle,
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
      rowHighlight: function(params) {
        return params.node.rowIndex % 2 === 0;
      }
    };

    const TemplateActionRenderer = (props) => {
      return (
        <MoreOptionsJobWorkIn
          menu={moreoption.moreoptionsdata}
          index={props['data']['sequenceNumber']}
          item={props['data']}
          id={props['data']['sequenceNumber']}
          component="salesList"
        />
      );
    };

    const getJobWorkInData = async () => {
      if (saleData) {
        let updatedData = allSaleData;

        setRowData(saleData);
        setAllSaleData(updatedData);
      }
    };


    useEffect(() => {
      getJobWorkInData().then(r => {
      });
    }, []);

    useEffect(() => {
      if (gridApi) {
        if (saleData) {
          gridApi.setRowData(saleData);
        }
      }
    }, [saleData]);

    useEffect(() => {
      if (gridApi) {
        if (rowData) {
          gridApi.setRowData(rowData);
        }
      }
    }, [rowData]);

    useEffect(() => {
      const loadPaginationData = async () => {
        if (onChange) {
          setOnChange(false);
          setRowData([]);
          setSaleData([]);

          await getJobWorkInDataByDate(dateRange, currentPage, limit).then(r => {

            setSaleData(r.data);

            if (r.totalPages) {
              setTotalPages(r.totalPages);

            }

          });
        }
      };

      loadPaginationData().then(r => {
      });
    }, [onChange]);

    const closeJobWorkInDialog = () => {
      handleCloseJobWorkInPrintSelectionAlertMessage();
    };

const searchJobWorkIn = async (value) => {
  setRowData([]);
  setSaleData([]);
  let selectedMonthFilter = localStorage.getItem('jobWorkInSelectedMonthFilter');
  console.log('selectedMonthFilter', selectedMonthFilter);

  if (!selectedMonthFilter) {
    selectedMonthFilter = 3;
  }
  let date;
  if (selectedMonthFilter === 'FY') {
    date = getFinancialYearStartDate();
  } else {
    date = getDateBeforeMonths(selectedMonthFilter);
  }

  const requestId = Date.now().toString(); // Generate a unique request ID
  localStorage.setItem('currentRequestId', requestId);

  const response = await getJobWorkInDataBySearch(value, currentPage, limit, date, requestId);

  if (response && response.requestId === localStorage.getItem('currentRequestId')) {
    setSaleData(response.data);
    setTotalPages(response.totalPages);
  } else {
    console.log('Ignoring stale response:', response);
  }
};
    const handleSearch = async (target) => {
      if (target) {
        await searchJobWorkIn(target);
      } else {
        getJobWorkInDataByDate(dateRange, currentPage, limit).then(r => {
          setSaleData(r.saleData);
          setTotalPages(r.totalPages);
        });
      }

    };

    return (
      <div>
        <Page className={classes.root} title="Job Work - In">
          {/* <PageHeader /> */}

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
              <Grid item xs={12} sm={2}>
                <Grid item xs={11} style={{ display: 'flex', justifyContent: 'center' }}>
                  <FilterDropdown value={selectedMonthFilter}
                                  onChange={handleFilterChange} />
                </Grid>
              </Grid>
              <Grid item xs={12} sm={5} align="right">
                <Grid container direction="row" spacing={2} alignItems="center">
                  <Grid item xs={7} align="right">
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
                      onChange={ async (e) => {
                        await handleSearch(e.target.value);
                      }} />
                  </Grid>
                  <Grid item xs={5} align="right">
                    <Controls.Button
                      text="Add Job Work - In"
                      size="medium"
                      variant="contained"
                      color="primary"
                      autoFocus={true}
                      startIcon={<Add />}
                      className={classes.newButton}
                      onClick={() => openForNewJobWorkIn()}
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

            {OpenAddJobWorkInvoice ? <AddJobWorkIn /> : null}
            {openAddSalesInvoice ? <AddSalesInvoice /> : null}
            {productDialogOpen ? <ProductModal /> : null}
            {openCustomPrintPopUp ? <CustomPrintPopUp isComingFromPrint={true} /> : null}
            {OpenAddsalesQuotationInvoice ? <AddSalesQuotation /> : null}
            {openJobWorkInPrintSelectionAlert === true ? (
              <OpenPreview
                open={true}
                onClose={closeJobWorkInDialog}
                id={printJobWorkInData.job_work_in_invoice_number}
                invoiceData={printJobWorkInData}
                startPrint={false}
              />
            ) : (
              ''
            )}
          </Paper>
        </Page>
      </div>
    );
  }
;
export default InjectObserver(Saleslist);
