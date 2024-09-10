import React, { useState, useEffect } from 'react';
import { Paper, Grid, InputAdornment } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { Add, Search } from '@material-ui/icons';
import * as Db from '../../../../RxDb/Database/Database';
import dateFormat from 'dateformat';
import DateRangePicker from '../../../../components/controls/DateRangePicker';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import Styles from '../style';
import moreoption from '../../../../components/Options';
import Moreoptions from '../../../../components/MoreoptionsPaymentOut';
import Controls from '../../../../components/controls';
import { AgGridReact } from 'ag-grid-react';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import AddnewPaymentOut from '../AddPaymentOut';
import '../purchase.css';
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

const PaymentOutList = (props) => {
  const classes = Styles.useStyles();
  const store = useStore();
  const { height } = useWindowDimensions();
  const {
    printPaymentOutData,
    openPaymentOutPrintSelectionAlert,
    OpenAddPaymentOut
  } = toJS(store.PaymentOutStore);
  const {
    openForNewPaymentOut,
    handleClosePaymentOutPrintSelectionAlertMessage
  } = store.PaymentOutStore;
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [rowData, setRowData] = useState(null);
  const { invoiceRegular, invoiceThermal, openCustomPrintPopUp } = toJS(
    store.PrinterSettingsStore
  );

  const addFirstPaymentOut = () => {
    openForNewPaymentOut();
  };

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
      headerName: 'REF. NO.',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
      /* headerComponentFramework: (props) => {
        return (
          <div>
            <p>REFERENCE</p>
            <p>NUMBER</p>
          </div>
        );
      } */
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
      headerName: 'AVAILABLE',
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
        setRecords([]);
        //check whether search is clicked or not
        if (searchText.length > 0) {
          let searchTextConverted = { target: { value: searchText } };
          handleSearch(searchTextConverted);
        } else {
          await getPaymentOutDataByDate(dateRange);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getPaymentOutDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRecords([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPaymentOutDataByDate(dateRange);
    }

    const businessData = await Bd.getBusinessData();

    Query = db.paymentout.find({
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

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      setSearchText(target);

      if (target) {
        getPaymentOutDataBySearch(target);
      } else {
        getPaymentOutDataByDate(dateRange);
      }
    } else {
      getPaymentOutDataByDate(dateRange);
    }
  };

  const getPaymentOutDataBySearch = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    var Query;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let skip = 0;
    setRecords([]);
    setRowData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPaymentOutDataBySearch(value);
    }

    Query = db.paymentout.find({
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
              { vendorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { paymentType: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total: { $eq: parseFloat(value) } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance: { $eq: parseFloat(value) } }
            ]
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

  const getAllPaymentOutDataBySearch = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    var Query;
    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.paymentout.find({
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
              { vendorName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { paymentType: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total: { $eq: parseFloat(value) } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { balance: { $eq: parseFloat(value) } }
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
  }, [records, gridApi]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        window.setTimeout(() => {
          gridApi.setRowData(rowData);
        });
      }
    }
  }, [rowData, gridApi]);

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  const TemplateMoreOptionRenderer = (props) => {
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        index={props['data']['vendorId']}
        id={props['data']['vendorId']}
        item={props['data']}
        component="paymentOut"
      />
    );
  };

  const closeDialog = () => {
    handleClosePaymentOutPrintSelectionAlertMessage();
  };

  return (
    <Page className={classes.root} title="Payment Out">
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
        </Grid>

        <Grid
          container
          direction="row"
          spacing={2}
          alignItems="center"
          className={classes.sectionHeader}
        >
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" style={{ margin: '0 10px' }}>
              TRANSACTIONS
            </Typography>
          </Grid>

          <Grid item xs={12} sm={8} align="right">
            <Grid container direction="row" spacing={2} alignItems="center">
              <Grid item xs={8} align="right">
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
              <Grid item xs={4} align="right">
                <Controls.Button
                  text="Payment"
                  size="medium"
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  className={classes.newButton}
                  onClick={() => addFirstPaymentOut()}
                />
                {OpenAddPaymentOut === true ? <AddnewPaymentOut /> : null}
              </Grid>
            </Grid>
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
          {openCustomPrintPopUp ? <CustomPrintPopUp isComingFromPrint={true}/> : null}      
          {openPaymentOutPrintSelectionAlert === true ? (
            <OpenPreview
              open={true}
              onClose={closeDialog}
              id={printPaymentOutData.receiptNumber}
              invoiceData={printPaymentOutData}
              startPrint={false}
            />
          ) : (
            ''
          )}
        </div>
      </Paper>
    </Page>
  );
};
export default InjectObserver(PaymentOutList);