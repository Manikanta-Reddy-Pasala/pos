import React, { useState, useEffect } from 'react';
import Page from 'src/components/Page';
import {
  Paper,
  makeStyles,
  InputAdornment,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  Button
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from 'src/components/controls/index';
import * as Db from 'src/RxDb/Database/Database';
import moreoption from 'src/components/Options';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { Add } from '@material-ui/icons';
import { AgGridReact } from 'ag-grid-react';
import './RemoveStockList.css';
import * as moment from 'moment';
import DateRangePicker from 'src/components/controls/DateRangePicker';
import dateFormat from 'dateformat';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from 'src/icons/svg/left_arrow.svg';
import right_arrow from 'src/icons/svg/right_arrow.svg';
import first_page_arrow from 'src/icons/svg/first_page_arrow.svg';
import last_page_arrow from 'src/icons/svg/last_page_arrow.svg';
import ProductModal from 'src/components/modal/ProductModal';
import * as Bd from 'src/components/SelectedBusiness';
import { toJS } from 'mobx';
import DialogActions from '@material-ui/core/DialogActions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import StockModal from 'src/components/modal/StockModal';
import MoreOptionsAlterStock from 'src/components/MoreOptionsAlterStock';

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

const AddStockList = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const headerClasses = useHeaderStyles();
  const stores = useStore();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const { productDialogOpen } = stores.ProductStore;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [limit] = useState(10);

  const [rowData, setRowData] = useState(null);
  let [stockData, setStockData] = useState([]);
  let [onChange, setOnChange] = useState(true);
  const [searchText, setSearchText] = useState('');

  const {
    isAddStockListRefreshed,
    batchNotAvailableError,
    alterStockOpenDialog
  } = toJS(stores.ProductStore);
  const { handleCloseBatchNotAvailableError, handleAlterStockModalOpen } =
    stores.ProductStore;

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

  const getStockDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setStockData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllStockDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { txnDate: { $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd') } },
          { txnDate: { $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd') } },
          { txnType: { $eq: 'Add Stock' } },
          { updatedAt: { $exists: true } }
        ]
      },
      sort: [{ txnDate: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let results = data.map((item) => item.toJSON());
      setStockData(results);
    });
  };

  const getAllStockDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { txnDate: { $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd') } },
          { txnDate: { $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd') } },
          { txnType: { $eq: 'Add Stock' } }
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

  const getStockDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setRowData([]);
    setStockData([]);
    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllStockDataBySearch(value);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.producttxn.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnType: { $eq: 'Add Stock' } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnType: { $eq: 'Add Stock' } },
              { productName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnType: { $eq: 'Add Stock' } },
              { batchActualNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnType: { $eq: 'Add Stock' } },
              { amount: { $eq: parseFloat(value) } }
            ]
          }
        ]
      },
      sort: [{ txnDate: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let results = data.map((item) => item.toJSON());
      setStockData(results);
    });
  };

  const getAllStockDataBySearch = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();
    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    Query = db.producttxn.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnType: { $eq: 'Add Stock' } },
              { sequenceNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnType: { $eq: 'Add Stock' } },
              { productName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnType: { $eq: 'Add Stock' } },
              { batchActualNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { txnType: { $eq: 'Add Stock' } },
              { amount: { $eq: parseFloat(value) } }
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
    var dateAsString = params.data ? params.data.txnDate : '';
    if (
      dateAsString !== '' &&
      dateAsString !== undefined &&
      dateAsString !== null
    ) {
      var dateParts = dateAsString.split('-');
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    } else {
      return '';
    }
  }

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'txnDate',
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
      headerName: 'INVOICE NUMBER',
      field: 'sequenceNumber',
      width: 200,
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
      headerName: 'PRODUCT NAME',
      field: 'productName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PRODUCT</p>
            <p>NAME</p>
          </div>
        );
      }
    },
    {
      field: 'batchActualNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>BATCH</p>
            <p>NO</p>
          </div>
        );
      }
    },
    {
      headerName: 'ADDED QTY',
      field: 'txnQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>ADDED</p>
            <p>QTY</p>
          </div>
        );
      }
    },
    {
      headerName: 'FREE ADDED QTY',
      field: 'freeTxnQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>FREE ADDED</p>
            <p>QTY</p>
          </div>
        );
      }
    },
    {
      headerName: 'PURCHASE PRICE',
      field: 'amount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASE</p>
            <p>PRICE</p>
          </div>
        );
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
      <MoreOptionsAlterStock
        menu={moreoption.moreoptionsdata}
        index={props['data']['sequenceNumber']}
        item={props['data']}
        id={props['data']['sequenceNumber']}
        operationType={'Add Stock'}
        component="maufactureList"
      />
    );
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        setSearchText(target);
        getStockDataBySearch(target);
      } else {
        getStockDataByDate(dateRange);
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (stockData) {
        gridApi.setRowData(stockData);
      }
    }
  }, [stockData]);

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
        if (searchText && searchText.length > 0) {
          await getStockDataBySearch(searchText);
        } else {
          await getStockDataByDate(dateRange);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (isAddStockListRefreshed === true) {
        setOnChange(false);
        setRowData([]);
        await getStockDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [isAddStockListRefreshed]);

  return (
    <div>
      <Page className={classes.root} title="Add Stock">
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
            <Grid item xs={12} sm={3}></Grid>
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
                    text="Add Stock"
                    size="medium"
                    variant="contained"
                    color="primary"
                    autoFocus={true}
                    startIcon={<Add />}
                    className={classes.newButton}
                    onClick={() => {
                      handleAlterStockModalOpen();
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

          {productDialogOpen ? <ProductModal /> : null}
          {alterStockOpenDialog ? (
            <StockModal operationType="Add Stock" />
          ) : null}
        </Paper>
      </Page>
      <Dialog
        fullScreen={fullScreen}
        open={batchNotAvailableError}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Sorry! Batch you are looking to edit is no more available.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseBatchNotAvailableError();
            }}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default InjectObserver(AddStockList);