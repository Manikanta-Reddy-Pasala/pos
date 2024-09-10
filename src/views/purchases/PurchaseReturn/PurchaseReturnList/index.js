import React, { useState, useEffect, useRef } from 'react';
import { Paper, Grid } from '@material-ui/core';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Typography from '@material-ui/core/Typography';
import { Add } from '@material-ui/icons';
import * as Db from '../../../../RxDb/Database/Database';
import dateFormat from 'dateformat';
import DateRangePicker from '../../../../components/controls/DateRangePicker';
import Styles from '../style';
import moreoption from '../../../../components/Options';
import Moreoptions from '../../../../components/MoreoptionsPurchasesReturns';
import Controls from '../../../../components/controls';
import { AgGridReact } from 'ag-grid-react';
import AddPurchaseReturn from '../AddDebitNote/index';
import Page from '../../../../components/Page';
import * as moment from 'moment';
import { toJS } from 'mobx';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import * as Bd from '../../../../components/SelectedBusiness';
import RecievePayment from 'src/components/RecievePayment';
import OpenPreview from 'src/components/OpenPreview';
import CustomPrintPopUp from 'src/views/Printers/Invoice/CustomPrintPopUp';

const PurchaseReturnList = (props) => {
  const classes = Styles.useStyles();
  let componentRef = useRef();
  const { height } = useWindowDimensions();
  const [records, setRecords] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(true);

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [limit] = useState(10);

  const store = useStore();
  const { openPurchaseReturnPrintSelectionAlert, printPurchaseReturnData } =
    toJS(store.PurchasesReturnsAddStore);
  const { handleClosePurchaseReturnPrintSelectionAlertMessage } =
    store.PurchasesReturnsAddStore;
  const { openForNewReturn } = store.PurchasesReturnsAddStore;

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal,openCustomPrintPopUp } = toJS(store.PrinterSettingsStore);
  const { receivePaymentOpen } = store.PaymentInStore;
  

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
      headerName: 'RETURN NUMBER',
      field: 'purchaseReturnBillNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>RETURN</p>
            <p>NUMBER</p>
          </div>
        );
      }
    },
    {
      headerName: 'VENDOR',
      field: 'vendor_name',
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
      valueFormatter: (params) => {
        return params['data']['total_amount']
          ? params['data']['total_amount']
          : '0';
      }
    },
    {
      headerName: 'RECEIVED',
      field: 'received_amount',
      valueFormatter: (params) => {
        return (
          (params['data']['received_amount'] || 0) +
          (params['data']['linked_amount'] || 0)
        );
      }
    },
    {
      headerName: 'BALANCE',
      field: 'balance',
      valueFormatter: (params) => {
        return params['data']['balance_amount']
          ? params['data']['balance_amount']
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

        if (data['balance_amount'] === 0) {
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
        await getPurchaseReturnDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getPurchaseReturnDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRecords([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseReturnDataByDate(dateRange);
    }

    const businessData = await Bd.getBusinessData();

    Query = db.purchasesreturn.find({
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
            date: { $exists: true }
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

  const getAllPurchaseReturnDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchasesreturn.find({
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
    if (!!gridApi) {
      gridApi.setRowData(records);
    }
  }, [records]);

  const TemplateMoreOptionRenderer = (props) => {
    console.log(props);
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        index={props['data']['vendor_id']}
        id={props['data']['purchase_return_number']}
        item={props['data']}
        component="purchaseReturn"
      />
    );
  };

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  const closePurchaseReturnDialog = () => {
    handleClosePurchaseReturnPrintSelectionAlertMessage();
  };

  return (
    <Page className={classes.root} title="Purchases Return">
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
          <Grid item xs={12} sm={6}>
            <Typography variant="h4" style={{ margin: '0 10px' }}>
              TRANSACTIONS
            </Typography>
          </Grid>
          <Grid item xs={8} sm={4} align="right"></Grid>
          <Grid item xs={4} sm={2} align="right">
            <Controls.Button
              text="Purchase Return"
              size="medium"
              variant="contained"
              color="primary"
              startIcon={<Add />}
              className={classes.newButton}
              onClick={() => openForNewReturn()}
            />
            <AddPurchaseReturn />
          </Grid>
        </Grid>
        <div
          style={{ width: '100%', height: height - 222 + 'px' }}
          className=" blue-theme"
        >
          <div
            id="sales-return-grid"
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

          {openPurchaseReturnPrintSelectionAlert === true ? (
            <OpenPreview
              open={true}
              onClose={closePurchaseReturnDialog}
              id={printPurchaseReturnData.purchase_return_number}
              invoiceData={printPurchaseReturnData}
              startPrint={false}
            />
          ) : (
            ''
          )}
        </div>
        {receivePaymentOpen ? <RecievePayment /> : null}
      </Paper>
    </Page>
  );
};
export default PurchaseReturnList;