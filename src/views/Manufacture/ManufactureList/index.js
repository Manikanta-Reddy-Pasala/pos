import React, { useState, useEffect } from 'react';
import Page from '../../../components/Page';
import {
  Paper,
  makeStyles,
  InputAdornment,
  Grid,
  Typography,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  Box
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from 'src/components/controls/index';
import * as Db from 'src/RxDb/Database/Database';
import moreoption from 'src/components/Options';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { Add } from '@material-ui/icons';
import { AgGridReact } from 'ag-grid-react';
import './ManufactureList.css';
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
import MfgModal from 'src/components/modal/MfgModal';
import MoreOptionsManufacture from 'src/components/MoreOptionsManufacture';
import EditMfgModal from 'src/components/modal/EditMfgModal';
import { toJS } from 'mobx';
import DialogActions from '@material-ui/core/DialogActions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { i } from 'react-dom-factories';

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
  searchWrapper: {
    marginLeft: 'auto',
    paddingRight: '2rem !important'
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

const ManufactureList = (props) => {
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
  let [manufactureData, setManufactureData] = useState([]);
  let [onChange, setOnChange] = useState(true);
  const [searchText, setSearchText] = useState('');

  const {
    isManufactureListRefreshed,
    batchNotAvailableError,
    mfgOpenDialog,
    editMfgOpenDialog
  } = toJS(stores.ProductStore);
  const {
    setProductDetailDataForManufacture,
    handleCloseBatchNotAvailableError
  } = stores.ProductStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [dateRange, setDateRange] = useState({
    fromDate: props?.isPL ? props.fromDate : new Date(),
    toDate: props?.isPL ? props.toDate : new Date()
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

  const getManufactureDataByDate = async (dateRange) => {
    const db = await Db.get();
    var query;

    let skip = 0;
    setRowData([]);
    setManufactureData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllManufactureDataByDate(dateRange);
    }
    const businessData = await Bd.getBusinessData();

    query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { txnDate: { $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd') } },
          { txnDate: { $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd') } },
          { txnType: { $eq: 'Manufacture' } },
          { updatedAt: { $exists: true } }
        ]
      },
      // sort: [{ txnDate: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let temp = item._data ? item._data : item;

        return temp;
      });
      setManufactureData(response);
    });
  };

  const getAllManufactureDataByDate = async (dateRange) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.producttxn.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { txnDate: { $gte: dateFormat(dateRange?.fromDate, 'yyyy-mm-dd') } },
          { txnDate: { $lte: dateFormat(dateRange?.toDate, 'yyyy-mm-dd') } },
          { txnType: { $eq: 'Manufacture' } }
        ]
      }
    });

    try {
      const data = await Query.exec();
      if (!data) {
        return;
      }

      const count = data.length;
      const numberOfPages = Math.ceil(count / limit);

      setTotalPages(numberOfPages);
    } catch (error) {
      console.error(error);
    }
  };

  const getManufactureDataBySearch = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let skip = 0;
    setRowData([]);
    setManufactureData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllManufactureDataBySearch(value);
    }

    let data;

    await db.producttxn
      .find({
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
                { productName: { $regex: regexp } }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { batchActualNumber: { $regex: regexp } }
              ]
            },
            {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { amount: { $eq: parseFloat(value) } }
              ]
            }
          ]
        },
        skip: skip,
        limit: limit,
        sort: [{ txnDate: 'desc' }, { updatedAt: 'desc' }]
      })
      .exec()
      .then((documents) => {
        data = documents.map((item) => item.toJSON());
        setManufactureData(data);
      });
  };

  const getAllManufactureDataBySearch = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();
    var Query;
    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    Query = db.producttxn.find({
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
              { productName: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { batchActualNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
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
        let output = {};

        ++count;
        return output;
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

  const expenseColumnProps =
    (props.isPL && {
      headerName: `MFG Expense `,
      field: 'mfgExpenseAmnt',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (prop) => {
        return (
          <div>
            <p>DIRECT MFG EXPENSE</p>
            <p
              style={{ textTransform: 'uppercase' }}
            >{`(${props?.category})`}</p>
          </div>
        );
      }
    }) ||
    null;

  const [columnDefs] = useState(
    [
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
        headerName: 'MANUFACTURE QTY',
        field: 'txnQty',
        filterParams: {
          buttons: ['reset', 'apply'],
          closeOnApply: true
        },
        headerComponentFramework: (props) => {
          return (
            <div>
              <p>MANUFACTURE</p>
              <p>QTY</p>
            </div>
          );
        }
      },
      {
        headerName: 'FREE MANUFACTURE QTY',
        field: 'freeTxnQty',
        filterParams: {
          buttons: ['reset', 'apply'],
          closeOnApply: true
        },
        headerComponentFramework: (props) => {
          return (
            <div>
              <p>FREE MANUFACTURE</p>
              <p>QTY</p>
            </div>
          );
        }
      },
      {
        headerName: 'COST',
        field: 'amount',
        filterParams: {
          buttons: ['reset', 'apply'],
          closeOnApply: true
        }
      },
      ...[expenseColumnProps],
      {
        headerName: '',
        field: '',
        suppressMenu: true,
        sortable: false,
        cellRenderer: 'templateActionRenderer'
      }
    ]?.filter(Boolean)
  );

  const rowClassRules = {
    rowHighlight: function (params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const TemplateActionRenderer = (props) => {
    return (
      <MoreOptionsManufacture
        menu={moreoption.moreoptionsdata}
        index={props['data']['sequenceNumber']}
        item={props['data']}
        id={props['data']['sequenceNumber']}
        component="maufactureList"
      />
    );
  };

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      setSearchText(target);
      if (target) {
        getManufactureDataBySearch(target);
      } else {
        getManufactureDataByDate(dateRange);
      }
    }
  };

  useEffect(() => {
    if (gridApi) {
      if (manufactureData) {
        const processedData = processRowData(manufactureData);

        gridApi.setRowData(processedData);
      }
    }
  }, [gridApi, manufactureData]);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [gridApi, rowData]);

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
          await getManufactureDataByDate(dateRange);
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (isManufactureListRefreshed === true) {
        setOnChange(false);
        setRowData([]);
        await getManufactureDataByDate(dateRange);
      }
    };

    loadPaginationData();
  }, [isManufactureListRefreshed]);

  const processRowData = (data) => {
    if (!props.isPL) return data;
    const updatedData = (data || [])?.reduce((final, item) => {
      const { txnQty, freeTxnQty, mfgDirectExpenses } = item;
      const qty = parseFloat(txnQty + freeTxnQty);
      const amount =
        parseFloat(
          mfgDirectExpenses.find((expense) => expense.name === props?.category)
            ?.amount || 0
        ) * qty;
      item.mfgExpenseAmnt = amount;
      final.push(item);
      return final;
    }, []);

    return updatedData;
  };

  return (
    <div>
      <Page className={classes.root} title="Manufacture">
        {/* <PageHeader /> */}

        {/* ------------------------------------------- HEADER -------------------------------------------- */}

        {!props.isPL && (
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
        )}

        {/* -------------------------------------------- BODY ------------------------------------------------- */}

        <Paper className={classes.paperRoot}>
          {props?.isPL && props?.plHeader}
          <Grid
            container
            direction="row"
            spacing={2}
            alignItems="center"
            className={classes.sectionHeader}
          >
            <Grid item xs={12} sm={4}>
              {!props.isPL && (
                <Typography variant="h4">Transaction </Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={3}></Grid>
            <Grid item xs={12} sm={5} align="right">
              {props.isPL ? (
                <Grid
                  container
                  direction="row"
                  spacing={2}
                  justifyContent="end"
                  component={Box}
                >
                  <Grid
                    item
                    xs={9}
                    align="right"
                    justifyContent="end"
                    component={Box}
                    pr={6}
                    className={classes.searchWrapper}
                  >
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
                </Grid>
              ) : (
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
                      text="Add Manufacture"
                      size="medium"
                      variant="contained"
                      color="primary"
                      autoFocus={true}
                      startIcon={<Add />}
                      className={classes.newButton}
                      onClick={() => {
                        setProductDetailDataForManufacture(null, true);
                      }}
                    />
                  </Grid>
                </Grid>
              )}
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
                rowData={processRowData(rowData)}
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
          {mfgOpenDialog ? <MfgModal /> : null}
          {editMfgOpenDialog ? <EditMfgModal /> : null}
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
export default InjectObserver(ManufactureList);
