import React, { useState, useEffect } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  Grid,
  Typography
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../../../components/controls/index';
import * as Db from '../../../../RxDb/Database/Database';
import moreoption from '../../../../components/Options';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { Add } from '@material-ui/icons';
import { AgGridReact } from 'ag-grid-react';
import '../../PaymentOut/purchase.css';
import Page from '../../../../components/Page';
import ProductModal from '../../../../components/modal/ProductModal';
import * as moment from 'moment';
import DateRangePicker from '../../../../components/controls/DateRangePicker';
import dateFormat from 'dateformat';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import AddPurchaseOrder from '../AddPurchaseOrder';
import MoreOptionsPurchaseOrder from 'src/components/MoreOptionsPurchaseOrder';
import AddPurchase from '../../PurchaseBill/AddPurchase';
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

const PurchaseOrderList = (props) => {
  const classes = useStyles();
  const headerClasses = useHeaderStyles();
  const { height } = useWindowDimensions();
  const stores = useStore();
  const [custSub, setCustSub] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [purchaseData, setPurchaseData] = useState([]);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { productDialogOpen } = stores.ProductStore;
  const { getInvoiceSettings } = stores.PrinterSettingsStore;
  const { openCustomPrintPopUp } = toJS(stores.PrinterSettingsStore);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  let [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);
  let [allPurchaseData, setAllPurchaseData] = useState([]);
  const { openPurchasePrintSelectionAlert, printPurchaseData } = toJS(
    stores.PurchasesAddStore
  );
  const { handleClosePrintSelectionAlertMessage } = stores.PurchasesAddStore;

  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

  const [searchText, setSearchText] = useState('');

  const statusCellStyle = (params) => {
    let data = params['data'];

    if (data['status'] === 'open') {
      return { color: '#faab53', fontWeight: 500 };
    } else {
      return { color: '#86ca94', fontWeight: 500 };
    }
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
    var dateAsString = params.data.po_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'po_date',
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
      headerName: 'INVOICE NO',
      field: 'sequenceNumber',
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
      headerName: 'VENDOR NAME',
      field: 'vendor_name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>VENDOR</p>
            <p>NAME</p>
          </div>
        );
      }
    },
    {
      headerName: 'PAYMENT TYPE',
      field: 'payment_type',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PAYMENT</p>
            <p>TYPE</p>
          </div>
        );
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
      headerName: 'BALANCE DUE',
      field: 'balance_amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>BALANCE</p>
            <p>DUE</p>
          </div>
        );
      }
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

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const TemplateActionRenderer = (props) => {
    return (
      <MoreOptionsPurchaseOrder
        menu={moreoption.moreoptionsdata}
        index={props['data']['sequenceNumber']}
        item={props['data']}
        id={props['data']['sequenceNumber']}
        component="billsList"
      />
    );
  };

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  const { setVendorList, handleClosePurchaseOrderPrintSelectionAlertMessage } =
    stores.PurchaseOrderStore;
  const store = useStore();

  const [rowData, setRowData] = useState([]);

  const { openForNewPurchaseOrder } = store.PurchaseOrderStore;
  const { printPurchaseOrderData, openPurchaseOrderPrintSelectionAlert } = toJS(
    store.PurchaseOrderStore
  );

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      setSearchText(target);

      if (target) {
        await getPurchaseDataBySearch(target);
      } else {
        await getPurchaseDataByDate(dateRange);
      }
    } else {
      await getPurchaseDataByDate(dateRange);
    }
  };

  useEffect(() => {
    const initDB = async () => {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      const sub = await db.parties
        .find({
          selector: {
            businessId: { $eq: businessData.businessId }
          }
        })
        .where('isVendor')
        .eq(true)
        .exec()
        .then((data) => {
          if (!data) {
            return;
          }
          let outData = data.map((item) => item.toJSON());
          setVendorList(outData);
        })
        .catch((err) => {
          console.log('Internal Server Error', err);
        });

      setCustSub((prevState) => [...prevState, sub]);
    };
    initDB();
    return () => custSub.map((sub) => sub.unsubscribe());
  }, []);

  useEffect(() => {
    // console.log('use effect:::', productData);
    if (gridApi) {
      if (purchaseData) {
        gridApi.setRowData(purchaseData);
      }
    }
  }, [gridApi, purchaseData]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setOnChange(false);
        setRowData([]);
        //check whether search is clicked or not
        if (searchText.length > 0) {
          let searchTextConverted = { target: { value: searchText } };
          handleSearch(searchTextConverted);
        } else {
          await getPurchaseDataByDate(dateRange);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getPurchaseDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchaseorder.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            po_date: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            po_date: {
              $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd')
            }
          },
          {
            updatedAt: { $exists: true }
          }
        ]
      },
      sort: [{ po_date: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
    });
  };

  const getAllPurchaseDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.purchaseorder.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },

          {
            po_date: {
              $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd')
            }
          },
          {
            po_date: {
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
      let response = data.map((item) => {
        let output = {};

        output.total_amount = item.total_amount;
        output.balance_amount = item.balance_amount;
        output.status = item.status;

        ++count;
        return output;
      });

      setAllPurchaseData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getPurchaseDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let skip = 0;
    setRowData([]);
    setPurchaseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllPurchaseDataBySearch(value);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.purchaseorder.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_bill_number: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_name: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } }
            ]
          }
        ]
      },
      sort: [{ po_date: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setPurchaseData(response);
    });
  };

  const getAllPurchaseDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.purchaseorder.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_bill_number: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { vendor_name: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { payment_type: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total_amount: { $eq: parseFloat(value) } }
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
        let output = {};

        output.total_amount = item.total_amount;
        output.balance_amount = item.balance_amount;
        output.status = item.status;

        ++count;
        return output;
      });

      setAllPurchaseData(response);

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const closeDialog = () => {
    handleClosePrintSelectionAlertMessage();
  };

  const closePurchaseOrderDialog = () => {
    handleClosePurchaseOrderPrintSelectionAlertMessage();
  };

  return (
    <Page className={classes.root} title="Purchase Order">
      {/* -------------------------------------------HEADER -------------------------------------- */}

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
                  setSearchText('');
                }}
              />
            </div>
          </Grid>
        </Grid>
      </Paper>

      {/* --------------------------------------------BODY ------------------------------------------- */}

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
                  text="Add Purchase Order"
                  size="medium"
                  variant="contained"
                  color="primary"
                  startIcon={<Add />}
                  className={classes.newButton}
                  onClick={() => openForNewPurchaseOrder()}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <div
          id="sales-invoice-grid"
          style={{ width: '100%', height: height - 242 + 'px' }}
          className=" blue-theme"
        >
          <div
            style={{ height: '95%', width: '100%' }}
            className="ag-theme-material"
          >
            <AgGridReact
              onGridReady={onGridReady}
              enableRangeSelection
              paginationPageSize={10}
              suppressMenuHide
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination
              headerHeight={40}
              rowSelection="single"
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
            />
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
        <AddPurchaseOrder />
        <AddPurchase />
        {productDialogOpen ? <ProductModal /> : null}

        {openPurchasePrintSelectionAlert === true ? (
          <OpenPreview
            open={true}
            onClose={closeDialog}
            id={printPurchaseData.bill_number}
            invoiceData={printPurchaseData}
            startPrint={false}
          />
        ) : (
          ''
        )}
        {openPurchaseOrderPrintSelectionAlert === true ? (
          <OpenPreview
            open={true}
            onClose={closePurchaseOrderDialog}
            id={printPurchaseOrderData.purchase_order_invoice_number}
            invoiceData={printPurchaseOrderData}
            startPrint={false}
          />
        ) : (
          ''
        )}
        {openCustomPrintPopUp ? (
          <CustomPrintPopUp isComingFromPrint={true} />
        ) : null}
      </Paper>
    </Page>
  );
};

export default InjectObserver(PurchaseOrderList);