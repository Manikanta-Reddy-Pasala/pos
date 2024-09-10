import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { AgGridReact } from 'ag-grid-react';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './vendor.css';
import * as Db from '../../../../RxDb/Database/Database';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import { makeStyles, Paper, InputAdornment } from '@material-ui/core';
import XLSX from 'xlsx';
import SearchIcon from '@material-ui/icons/Search';
import * as Bd from '../../../../components/SelectedBusiness';
import Controls from 'src/components/controls/index';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  list: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#cbe7f7',
      color: 'white'
    }
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    // height: '55vw',
    borderRadius: 12
  },

  listItemText: {
    fontSize: '0.5em'
  },
  search: {
    borderWidth: 1,
    borderColor: 'grey !important',
    borderRadius: '50%',
    padding: 6,
    borderStyle: 'solid'
  },
  excelIcon: {
    borderWidth: 1,
    borderColor: 'grey !important',
    borderRadius: '50%',
    padding: 6,
    borderStyle: 'solid',
    marginLeft: '10px'
  },
  categoryBtn: {
    background: '#ef5251',
    '&:hover': {
      backgroundColor: '#ef5251'
    },
    color: 'white',
    borderRadius: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
    textTransform: 'none',
    marginRight: 15
  },
  dFlex: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  categoryHeadLeft: {
    color: 'grey',
    display: 'flex'
  },
  categoryHeadLeftIcon: {
    marginLeft: '12'
  },
  categoryHeadRight: {
    color: 'grey',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  categoryHeaderRight: {
    marginRight: 12
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
  },
  moreIcon: {
    marginBottom: '-5px'
  },
  itemTable: {
    width: '100%'
  },
  categoryActionWrapper: {
    padding: '10px',
    marginTop: '0px',
    // background: 'white',
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

function ReceivableVendorList() {
  const store = useStore();
  const { height } = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [rowData, setRowData] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);
  const [vendorData, setVendorData] = useState([]);

  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const {
    setSelectedVendor,
    getAccountsReceivableVendorFromAllTxn,
    resetAccountsReceivableResult
  } = store.ReportsStore;
  const { accountsReceivableResult, accountsReceivableTotalToPay } = toJS(
    store.ReportsStore
  );

  const [totalReceivable, setTotalReceivable] = React.useState(0);

  const numberSort = (num1, num2) => {
    return num1 - num2;
  };

  const [columnDefs] = useState([
    {
      headerName: 'Name',
      field: 'name',
      suppressNavigable: true,
      cellClass: 'no-border',
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['clear', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Receivable',
      field: 'balance',
      resizable: true,
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      comparator: numberSort,
      filterParams: {
        buttons: ['clear', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data['balance']).toFixed(2);
      }
    }
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
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

  useEffect(() => {
    if (vendorData) {
      setRowData(vendorData);
    }

    if (gridApi) {
      if (vendorData) {
        gridApi.setRowData(vendorData);
        gridApi.sizeColumnsToFit();
        if (gridApi.getDisplayedRowAtIndex(index)) {
          gridApi.getDisplayedRowAtIndex(index).setSelected(true);
        }
      }
    }
  }, [gridApi, index, vendorData]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setVendorData([]);
        resetAccountsReceivableResult();
        setSelectedVendor(null);
        setOnChange(false);
        await getVendorData();
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getVendorData = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },

      {
        isVendor: {
          $eq: true
        },
        balanceType: {
          $eq: 'Receivable'
        },
        balance: {
          $gt: 0
        }
      }
    ];

    if (value) {
      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      const filter = { name: { $regex: regexp } };
      filterArray.push(filter);
    }

    let skip = 0;
    setVendorData([]);
    resetAccountsReceivableResult();
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllVendorData(filterArray);
    }

    Query = db.parties.find({
      selector: {
        $and: filterArray
      },
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let vendor = item.toJSON();

        return vendor;
      });

      if (response.length > 0) {
        let firstVendor = response[0];
        setSelectedVendor(firstVendor);
        getAccountsReceivableVendorFromAllTxn(firstVendor);
      }

      setVendorData(response);
    });
  };

  const getAllVendorData = async (filterArray) => {
    const db = await Db.get();
    var Query;

    Query = db.parties.find({
      selector: {
        $and: filterArray
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

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  async function onRowClicked(row) {
    setSelectedVendor(row.data);
    // console.log('row:data', row.data);
    await getAccountsReceivableVendorFromAllTxn(row.data);
  }

  function onFirstDataRendered(params) {
    if (gridApi && gridApi.getDisplayedRowAtIndex(0)) {
      gridApi.getDisplayedRowAtIndex(0).setSelected(true);
    }
  }

  const searchVendor = async (value) => {
    await getVendorData(value);
  };

  return (
    <div className={classes.root} style={{ height: height - 66 }}>
      <Paper className={classes.root} style={{ height: height - 66 }}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="center"
          className={classes.categoryActionWrapper}
        >
          <Grid container>
            <Controls.Input
              placeholder="Search Vendor"
              size="small"
              fullWidth
              InputProps={{
                classes: {
                  root: classes.searchInputRoot,
                  input: classes.searchInputInput
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              onChange={(event) => {
                searchVendor(event.target.value.toString().toLowerCase());
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <div
              id="product-list-grid"
              className="red-theme "
              style={{ width: '100%', height: height - 136 + 'px' }}
            >
              <div
                id="product-list-grid"
                style={{ height: '100%', width: '100%' }}
                className="ag-theme-material"
              >
                <AgGridReact
                  onGridReady={onGridReady}
                  onFirstDataRendered={onFirstDataRendered}
                  enableRangeSelection
                  paginationPageSize={10}
                  suppressMenuHide
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  rowSelection="single"
                  headerHeight={40}
                  onRowClicked={(e) => onRowClicked(e)}
                  rowClassRules={rowClassRules}
                  suppressPaginationPanel={true}
                  suppressScrollOnNewData={true}
                  overlayLoadingTemplate={
                    '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                  }
                  overlayNoRowsTemplate={
                    '<span className="ag-overlay-loading-center">No Rows to Show...</span>'
                  }
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

            {/* <div className={classes.footer}>
              <div>
                <Grid container>
                  <Grid container style={{ padding: '5px' }}>
                    <Grid item xs={6} style={{ textAlign: 'center' }}>
                      Total Receivable :
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'start' }}>
                      &#8377; {totalReceivable}
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </div> */}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export default InjectObserver(ReceivableVendorList);
