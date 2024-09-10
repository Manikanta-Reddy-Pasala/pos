import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import { Search, Print } from '@material-ui/icons';
import * as Db from '../../../../RxDb/Database/Database';
import dateFormat from 'dateformat';
import DateRangePicker from '../../../../components/controls/DateRangePicker';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import moreoption from '../../../../components/Options';
import Moreoptions from '../../../../components/MoreoptionsOrderReceipt';
import Controls from '../../../../components/controls';
import { AgGridReact } from 'ag-grid-react';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import AddOrderReceipt from '../../OrderReceipt/AddOrderReceipt';
import 'src/views/JobWork/OrderReceipt/jobwork.css';
import Page from '../../../../components/Page';
import * as moment from 'moment';
import { toJS } from 'mobx';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import * as Bd from '../../../../components/SelectedBusiness';
import OpenPreview from 'src/components/OpenPreview';
import CustomPrintPopUp from 'src/views/Printers/Invoice/CustomPrintPopUp';

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

const OrderReceiptList = (props) => {
  const classes = useStyles();
  const innerClasses = useHeaderStyles();
  const store = useStore();
  const { height } = useWindowDimensions();
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const {
    handleOrderReceiptSearch,
    openNewOrderReceipt,
    handleNewOrderReceipt,
    handleCloseJobWorkReceiptPrintSelectionAlertMessage
  } = store.JobWorkReceiptStore;
  const { openJobWorkReceiptPrintSelectionAlert, printJobWorkReceiptData } =
    toJS(store.JobWorkReceiptStore);
  const { invoiceRegular, invoiceThermal,openCustomPrintPopUp } = toJS(store.PrinterSettingsStore);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);

  const [records, setRecords] = useState(null);

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const todayDate = new Date(thisYear, thisMonth, today);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const todayFormated = formatDate(todayDate);

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
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
    var dateAsString = params.data.receiptDate;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'receiptDate',
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
      headerName: 'RECEIPT NO.',
      field: 'receiptSequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'VENDOR NAME',
      field: 'vendorName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Amount',
      field: 'totalAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    /* {
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
        await getOrderReceiptDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getOrderReceiptDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRecords([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllOrderReceiptDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.jobworkreceipt.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            receiptDate: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            receiptDate: {
              $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ receiptDate: 'desc' }, { updatedAt: 'desc' }],
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

  const getAllOrderReceiptDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.jobworkreceipt.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            receiptDate: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            receiptDate: {
              $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ receiptDate: 'desc' }, { updatedAt: 'desc' }]
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
    if (!!gridApi) {
      gridApi.setRowData(records);
    }
  }, [records]);

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target.length > 0) {
        setRecords(await handleOrderReceiptSearch(target));
      } else {
        setCurrentPage(1);
        setRecords(await getOrderReceiptDataByDate(dateRange));
      }
    }
  };

  const TemplateMoreOptionRenderer = (props) => {
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        index={props['data']['receiptNumber']}
        id={props['data']['receiptNumber']}
        item={props['data']}
        component="orderReceipt"
        isOrderInvoice={false}
      />
    );
  };

  const closeJobWorkReceiptDialog = () => {
    handleCloseJobWorkReceiptPrintSelectionAlertMessage();
  };

  return (
    <Page className={classes.root} title="Job Work Order Receipt - Out">
      <Paper className={innerClasses.paperRoot}>
        <Grid container>
          <Grid item xs={12} sm={12} className={innerClasses.card}>
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

      <Paper className={classes.paperRoot}>
        <Grid
          container
          direction="row"
          spacing={2}
          alignItems="center"
          className={classes.sectionHeader}
        >
          <Grid item xs={12} sm={7}>
            <Typography variant="h4">Transaction</Typography>
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
                  onChange={handleSearch}
                />
              </Grid>
              <Grid item xs={5} align="right">
                <Controls.Button
                  text="Generate Receipt"
                  size="medium"
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  className={classes.newButton}
                  onClick={() => handleNewOrderReceipt(true)}
                />
                {openNewOrderReceipt ? <AddOrderReceipt /> : null}
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <div
          id="sales-return-grid"
          style={{ width: '100%', height: height - 242 + 'px' }}
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
          <AddOrderReceipt />
          {openCustomPrintPopUp ? <CustomPrintPopUp isComingFromPrint={true}/> : null}
          {openJobWorkReceiptPrintSelectionAlert === true ? (
            <OpenPreview
              open={true}
              onClose={closeJobWorkReceiptDialog}
              id={printJobWorkReceiptData.receiptSequenceNumber}
              invoiceData={printJobWorkReceiptData}
              startPrint={false}
              isJobWork={true}
              isOrderInvoice={false}
            />
          ) : (
            ''
          )}
        </div>
      </Paper>
    </Page>
  );
};
export default InjectObserver(OrderReceiptList);