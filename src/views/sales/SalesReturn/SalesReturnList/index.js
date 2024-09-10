import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  Grid,
  DialogTitle,
  FormControl,
  TextField,
  Dialog,
  Button
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Add, Print } from '@material-ui/icons';
import * as Db from '../../../../RxDb/Database/Database';
import dateFormat from 'dateformat';
import DateRangePicker from '../../../../components/controls/DateRangePicker';
import Styles from '../style';
import moreoption from '../../../../components/Options';
import Moreoptions from '../../../../components/MoreoptionsSalesReturn';
import Controls from '../../../../components/controls';
import { AgGridReact } from 'ag-grid-react';
import AddSalesReturn from '../AddCreditNote/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import '../sale.css';
import Page from '../../../../components/Page';
import * as moment from 'moment';
import { toJS } from 'mobx';
import useWindowDimensions from '../../../../components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import * as Bd from '../../../../components/SelectedBusiness';
import MakePayment from 'src/components/MakePayment';
import OpenPreview from 'src/components/OpenPreview';
import CustomPrintPopUp from 'src/views/Printers/Invoice/CustomPrintPopUp';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DialogContentText from '@material-ui/core/DialogContentText';

const SalesReturnList = (props) => {
  const { height } = useWindowDimensions();
  const classes = Styles.useStyles();
  let componentRef = useRef();
  const [records, setRecords] = useState(null);

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const store = useStore();
  const {
    openSaleReturnPrintSelectionAlert,
    printDataSalesReturn,
    openCancelDialog,
    cancelRemark,
    cancelItem
  } = toJS(store.ReturnsAddStore);
  const {
    openForNewReturn,
    handleCloseSaleReturnPrintSelectionAlertMessage,
    isSaleReturnLockedForCancel,
    handleCancelClose,
    setCancelRemark,
    cancelSaleReturn
  } = store.ReturnsAddStore;
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal, openCustomPrintPopUp } = toJS(
    store.PrinterSettingsStore
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);

  const { OpenMakePayment } = toJS(store.PaymentOutStore);

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

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

  const rowClassRules = {
    rowHighlight: function (params) {
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
            <p>NO</p>
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
      headerName: 'TYPE',
      field: 'payment_type',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TOTAL',
      field: 'total_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['total_amount']
          ? params['data']['total_amount']
          : '0';
      }
    },
    {
      headerName: 'PAID',
      field: 'paid_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return (
          (params['data']['paid_amount'] || 0) +
          (params['data']['linked_amount'] || 0)
        );
      }
    },
    {
      headerName: 'BALANCE',
      field: 'balance_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['balance_amount']
          ? params['data']['balance_amount']
          : '0';
      }
    },
    {
      headerName: 'STATUS',
      field: 'paymentStatus',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['isCancelled'] === true) {
          result = 'Cancelled';
        } else if (data['balance_amount'] === 0) {
          result = 'Paid';
        } else if (data['balance_amount'] < data['total_amount']) {
          result = 'Partial';
        } else if (data['balance_amount'] === data['total_amount']) {
          result = 'Un Paid';
        }
        return result;
      },
      cellStyle: statusCellStyle
    },
    /*{
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      cellRenderer: 'tempaltePrintShareRenderer'
    },*/
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      width: 150,
      cellRenderer: 'templateMoreOptionRenderer'
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
        setRecords([]);
        await getSaleReturnDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getSaleReturnDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRecords([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSaleReturnDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    console.log('sale return flag: ' + openSaleReturnPrintSelectionAlert);

    Query = db.salesreturn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            date: {
              $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
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

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item.toJSON());
      setRecords(response);
    });
  };

  const getAllSaleReturnDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.salesreturn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            date: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            date: {
              $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
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

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  useEffect(() => {
    if (!!gridApi) {
      gridApi.setRowData(records);
    }
  }, [records]);

  const TemplateMoreOptionRenderer = (props) => {
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        index={props['data']['customerId']}
        id={props['data']['customer_id']}
        item={props['data']}
        component="salesReturn"
      />
    );
  };

  const closeDialog = () => {
    handleCloseSaleReturnPrintSelectionAlertMessage();
  };

  const cancelSaleReturnItem = async () => {
    let returnObj = await isSaleReturnLockedForCancel(cancelItem);
    if (returnObj.isLocked === true) {
      handleCancelClose();
      setErrorMessage(returnObj.saleLockMessage);
      setErrorAlertMessage(true);
    } else {
      cancelSaleReturn(cancelItem, cancelRemark);
      handleCancelClose(false);
    }
  };

  return (
    <div>
      <Page className={classes.root} title="Sales Return">
        <Paper className={classes.pageContent}>
          <Grid container spacing={1} className={classes.sectionHeader}>
            <Grid item xs={6} sm={5}>
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
            </Grid>
            <Grid item xs={6} sm={2}></Grid>
            {/* <Grid container item xs={12} sm={6} justify='flex-end' >
          <IconButton classes={{ label: classes.label }}>
            <Excel fontSize='inherit' />
            <span className={classes.iconLabel}>Excel</span>
          </IconButton>
          <IconButton classes={{ label: classes.label }}>
            <Print fontSize='inherit' />
            <span className={classes.iconLabel}>Print</span>
          </IconButton>
        </Grid> */}
          </Grid>

          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            className={classes.sectionHeader}
          >
            <Grid item xs={12} sm={6}>
              <Typography variant="h4" style={{ margin: '0 10px' }}>
                TRANSACTIONS
              </Typography>
            </Grid>
            <Grid item xs={8} sm={4} align="right"></Grid>
            <Grid item xs={4} sm={2} align="right">
              <Controls.Button
                text="Sales Return"
                size="medium"
                variant="contained"
                color="primary"
                startIcon={<Add />}
                className={classes.newButton}
                onClick={() => openForNewReturn()}
              />
              <AddSalesReturn />
            </Grid>
          </Grid>
          <div
            id="sales-return-grid"
            style={{ width: '100%', height: height - 222 + 'px' }}
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
                rowSelection="single"
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
                  templateMoreOptionRenderer: TemplateMoreOptionRenderer
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
            <CustomPrintPopUp isComingFromPrint={true} />
            {openSaleReturnPrintSelectionAlert === true ? (
              <OpenPreview
                open={true}
                onClose={closeDialog}
                id={printDataSalesReturn.sales_return_number}
                invoiceData={printDataSalesReturn}
                startPrint={false}
              />
            ) : (
              ''
            )}
          </div>
          <MakePayment />
        </Paper>
      </Page>
      <Dialog
        fullScreen={fullScreen}
        open={openCancelDialog}
        onClose={handleCancelClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Are you sure you want to cancel this invoice?
        </DialogTitle>

        <DialogContent>
          <FormControl fullWidth>
            <Typography variant="subtitle1">Reason</Typography>
            <TextField
              fullWidth
              multiline
              type="text"
              variant="outlined"
              margin="dense"
              minRows="3"
              className="customTextField"
              value={cancelRemark}
              onChange={(event) => setCancelRemark(event.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ marginLeft: '100px' }}>
              <Button
                variant="contained"
                onClick={() => cancelSaleReturnItem()}
              >
                Yes
              </Button>
            </div>
            <Button
              style={{ marginLeft: '10px' }}
              variant="contained"
              onClick={() => handleCancelClose()}
            >
              No
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default SalesReturnList;