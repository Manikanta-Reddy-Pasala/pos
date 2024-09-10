import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Paper, InputAdornment } from '@material-ui/core';
import { toJS } from 'mobx';
import { AgGridReact } from 'ag-grid-react';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './customer.css';
import * as Db from '../../../../RxDb/Database/Database';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import XLSX from 'xlsx';
import SearchIcon from '@material-ui/icons/Search';
import * as Bd from '../../../../components/SelectedBusiness';
import Controls from 'src/components/controls/index';
import { getCustomerName } from 'src/names/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: 2,
    borderRadius: '12px'
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

function CustomerList() {
  const store = useStore();
  const { height } = useWindowDimensions();

  const {
    setSelectedCustomer,
    resetSelectedCustomer,
    getAccountsPayableByData,
    resetAccountsPayableResult
  } = store.ReportsStore;
  const { accountsPayableTotalToPay, accountsPayableResult } = toJS(
    store.ReportsStore
  );

  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [index, setIndex] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(true);
  const [customerData, setCustomerData] = useState([]);
  const [totalPayable, setTotalPayable] = React.useState(0);
  const [limit] = useState(10);

  const numberSort = (num1, num2) => {
    return num1 - num2;
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
      headerName: 'Name',
      field: 'name',
      suppressNavigable: true,
      cellClass: 'no-border',
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellRendererFramework(params) {
        return (
          <div>
            <Grid container>
              <Grid item xs={12}>
                <p
                  style={{
                    wordBreak: 'break-all',
                    whiteSpace: 'normal',
                    display: 'inline-block'
                  }}
                >
                  {params.data.name || 0}
                </p>
                {params.data.vipCustomer && (
                  <>
                    <p style={{ display: 'inline-block' }}>
                      <span
                        style={{
                          background: '#B3B20F',
                          fontSize: '8px',
                          padding: '2px 6px 2px 6px',
                          color: 'white',
                          borderRadius: '5px',
                          marginLeft: '10px'
                        }}
                      >
                        VIP
                      </span>
                    </p>
                  </>
                )}
              </Grid>
            </Grid>
          </div>
        );
      }
    },
    {
      headerName: 'Payable',
      field: 'balance',
      resizable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data['balance']).toFixed(2);
      },
      comparator: numberSort
    }
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
      window.addEventListener('resize', () => {
        params.api.sizeColumnsToFit();
      });
      params.api.addEventListener('cellFocused', ({ rowIndex }) => {
        params.api.getDisplayedRowAtIndex(rowIndex).setSelected(true);
      });
    }, 500);
  };

  useEffect(() => {
    if (customerData) {
      setRowData(customerData);
    }

    if (gridApi) {
      if (customerData) {
        gridApi.setRowData(customerData);
        gridApi.sizeColumnsToFit();
        if (gridApi.getDisplayedRowAtIndex(index)) {
          gridApi.getDisplayedRowAtIndex(index).setSelected(true);
        }
      }
    }
  }, [customerData, gridApi, index]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setCustomerData([]);
        resetAccountsPayableResult();
        setSelectedCustomer(null);
        setOnChange(false);
        await getCustomerData();
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getCustomerData = async (value) => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    let filterArray = [
      { businessId: { $eq: businessData.businessId } },

      {
        isCustomer: {
          $eq: true
        }
      },
      {
        balanceType: {
          $eq: 'Payable'
        }
      },
      {
        balance: { $gt: 0 }
      }
    ];

    if (value) {
      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      const filter = { name: { $regex: regexp } };
      filterArray.push(filter);
    }

    var Query;

    let skip = 0;
    setCustomerData([]);
    resetAccountsPayableResult();
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllCustomerData(filterArray);
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

      let total = 0;
      let response = [];
      data.map((item) => {
        let customer = item.toJSON();

        total = total + parseFloat(customer.balance);

        response.push(customer);
      });

      setTotalPayable(parseFloat(total).toFixed(2));
      setCustomerData(response);
      if (response.length > 0) {
        let firstCustomer = response[0];
        setSelectedCustomer(firstCustomer);
        getAccountsPayableByData(firstCustomer);

        onFirstDataRendered();
      } else {
        resetSelectedCustomer();
      }
    });
  };

  const getAllCustomerData = async (filterArray) => {
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
    },
    flex: 1
  });

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  async function onRowClicked(row) {
    setSelectedCustomer(row.data);
    // console.log('row:data', row.data);
    await getAccountsPayableByData(row.data);
  }

  const getDataFromCashFlow = () => {
    const wb = new Workbook();

    let data = [];

    if (accountsPayableResult && accountsPayableResult.length > 0) {
      for (var i = 0; i < accountsPayableResult.length; i++) {
        const record = {
          Name: '',
          'To Pay': ''
        };
        data.push(record);
      }
      const emptyRecord = {};
      data.push(emptyRecord);
      data.push(emptyRecord);
      const totalCashRecord = {
        Date: '',
        'Ref No': '',
        Type: 'Total Payable',
        'To Pay': accountsPayableTotalToPay
      };
      data.push(totalCashRecord);
    } else {
      const record = {
        Name: '',
        'To Pay': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Accounts Payable by Customer');

    console.log('test:: ws::', ws);
    wb.Sheets['Accounts Payable by Customer'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Accounts_Payable_by_customer_Sheet';

    download(url, fileName + '.xlsx');
  };

  const download = (url, name) => {
    let a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);

    const view = new Uint8Array(buf);

    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;

    return buf;
  }

  function onFirstDataRendered(params) {
    if (gridApi && gridApi.getDisplayedRowAtIndex(0)) {
      gridApi.getDisplayedRowAtIndex(0).setSelected(true);
    }
  }

  const searchCustomer = async (value) => {
    await getCustomerData(value);
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
              placeholder={'Search ' + getCustomerName()}
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
                searchCustomer(event.target.value.toString().toLowerCase());
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
                      Total Payable :
                    </Grid>
                    <Grid item xs={6} style={{ textAlign: 'start' }}>
                      &#8377; {totalPayable}
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

export default InjectObserver(CustomerList);
