import React, { useState, useEffect } from 'react';
import Page from '../../components/Page';
import {
  Paper,
  makeStyles,
  InputAdornment,
  Grid,
  Typography,
  Button,
  Select,
  OutlinedInput,
  MenuItem,
  Dialog
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from 'src/components/controls/index';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { AgGridReact } from 'ag-grid-react';
import * as moment from 'moment';
import DateRangePicker from 'src/components/controls/DateRangePicker';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../icons/svg/left_arrow.svg';
import right_arrow from '../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../icons/svg/last_page_arrow.svg';
import * as Bd from '../../components/SelectedBusiness';
import NoPermission from 'src/views/noPermission';
import BubbleLoader from 'src/components/loader';
import axios from 'axios';
import RecordLogs from './RecordLogs';
import { checkDateRange } from 'src/components/Helpers/DateHelper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

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

const AuditTrail = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const headerClasses = useHeaderStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [rowData, setRowData] = useState(null);
  let [onChange, setOnChange] = useState(true);
  const [txnType, setTxnType] = useState('Sale');
  const [openDetail, setDetailOpen] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [sequenceNumber, setSequenceNumber] = useState('');

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const [errorAlertMessage, setErrorAlertMessage] = useState('');
  const [openErrorAlert, setErrorAlert] = useState(false);

  const handleErrorAlertClose = () => {
    setErrorAlert(false);
    setErrorAlertMessage('');
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
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
      if (!businessData.posFeatures.includes('Accounting & Audit')) {
        setFeatureAvailable(false);
      }
    }
  };

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const [dateRange, setDateRange] = useState({
    fromDate: formatDate(firstThisMonth),
    toDate: formatDate(todayDate)
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

  const [columnDefs] = useState([
    {
      headerName: 'CREATED DATE',
      field: 'orderRequestedDate',
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
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CREATED</p>
            <p>DATE</p>
          </div>
        );
      }
    },
    {
      headerName: 'INVOICE NUMBER',
      field: 'invoiceBillNumber',
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
      }
    },
    {
      headerName: 'LAST MODIFIED DATE',
      field: 'lastModifiedDate',
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
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>LAST</p>
            <p>MODIFIED DATE</p>
          </div>
        );
      }
    },
    {
      headerName: 'MODIFIED BY',
      field: 'modifiedBy',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>MODIFIED</p>
            <p>BY</p>
          </div>
        );
      }
    },
    {
      headerName: 'NO OF TIMES EDITED',
      field: 'numberOfTimesEdited',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>NO OF TIMES</p>
            <p>EDITED</p>
          </div>
        );
      }
    },
    {
      headerName: 'COMMENTS',
      field: 'comments',
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
      <Button
        onClick={() => {
          handleOpenDetail(props['data']);
        }}
      >
        View Detail
      </Button>
    );
  };

  const handleOpenDetail = (data) => {
    setInvoiceNumber(data.invoiceId);
    setSequenceNumber(data.invoiceBillNumber);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
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
      if (onChange) {
        setOnChange(false);
        setRowData([]);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getAllAuditData = async () => {
    const dateRangeInValid = await checkDateRange(
      dateRange.fromDate,
      dateRange.toDate,
      30
    );

    if (dateRangeInValid) {
      setErrorAlertMessage('Date range cannot exceed 30 days of time peroid!!');
      setErrorAlert(true);
      return;
    }

    const API_SERVER = window.REACT_APP_API_SERVER;
    let isValid = false;
    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;
    const data = {
      businessCity: businessCity,
      businessId: businessId,
      type: txnType && txnType === 'Kot' ? 'Kot-Audit' : txnType,
      startDate: dateRange.fromDate,
      endDate: dateRange.toDate
    };
    await axios
      .post(`${API_SERVER}/pos/v1/audit/getAllData`, data)
      .then((res) => {
        if (res && res.data) {
          let rowData = [];
          for(let item of res.data) {
            if(item.numberOfTimesEdited > 0) rowData.push(item);
          }
          setRowData(rowData);
        } else {
        }
      })
      .catch((err) => {});

    return isValid;
  };

  useEffect(() => {
    getAllAuditData();
  }, [dateRange, txnType]);

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable ? (
            <div>
              <Page className={classes.root} title="Audit Trail">
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
                              setDateRange({
                                fromDate: formatDate(dateRange.fromDate),
                                toDate: formatDate(dateRange.toDate)
                              });
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
                    className={[
                      classes.sectionHeader,
                      classes.categoryActionWrapper
                    ]}
                  >
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h4">Transaction</Typography>
                    </Grid>
                    <Grid item xs={12} sm={2} />
                    <Grid item xs={12} sm={2}>
                      <Select
                        displayEmpty
                        value={txnType}
                        input={
                          <OutlinedInput
                            style={{ width: '100%', marginLeft: '15px' }}
                          />
                        }
                        inputProps={{ 'aria-label': 'Without label' }}
                        onChange={(e) => {
                          setTxnType(e.target.value);
                        }}
                      >
                        <MenuItem value={'Sale'}>Sale</MenuItem>
                        <MenuItem value={'Kot'}>Kot</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} sm={1} />
                    <Grid item xs={12} sm={3} align="right">
                      <Grid
                        container
                        direction="row"
                        spacing={2}
                        alignItems="center"
                      >
                        {/*<Grid item xs={12} align="right">
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
                          />
                        </Grid>*/}
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
                </Paper>
              </Page>
            </div>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {openDetail && (
        <RecordLogs
          openDetail={openDetail}
          closeDialog={handleCloseDetail}
          invoiceNumber={invoiceNumber}
          sequenceNumber={sequenceNumber}
          auditType={txnType}
        />
      )}
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openErrorAlert}
        onClose={handleErrorAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div dangerouslySetInnerHTML={{ __html: errorAlertMessage }}></div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default InjectObserver(AuditTrail);