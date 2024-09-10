import React, { useState, useEffect, useRef } from 'react';
import {
  Paper,
  makeStyles,
  InputAdornment,
  Grid,
  Typography,
  Box
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import Controls from '../../components/controls/index';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';

import { AgGridReact } from 'ag-grid-react';
import { getSaleName, getCustomerName } from 'src/names/constants';

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: '24px',
    boxShadow: '0px 0px 12px -3px #0000004a',
    borderRadius: '10px'
  },
  newButton: {
    position: 'relative',
    borderRadius: 25,
    paddingRight: '15px'
  },

  searchInputRoot: {
    borderRadius: 50
  },
  searchIcon: {
    color: '#ccc'
  },

  tableRow: {
    '&.Mui-selected': {
      backgroundColor: '#CEE6F3 !important'
    }
  },
  itemTable: {
    width: '100%',
    display: 'inline-block'
  }
}));

const TransactionTable = (props) => {
  const classes = useStyles();

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

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const stores = useStore();
  const { openAddSalesInvoice } = toJS(stores.SalesAddStore);

  function dateFormatter(params) {
    var dateAsString = params.data.invoice_date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'invoice_date',
      width: 240,
      valueFormatter: dateFormatter
    },
    {
      headerName: 'INVOICE NUMBER',
      field: 'sequenceNumber',
      width: 300,
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>VOUCHER</p>
            <p>NUMBER</p>
          </div>
        );
      }
    },
    {
      headerName: getCustomerName().toUpperCase(),
      field: 'customer_name',
      width: 400,
      filter: false
    },
    {
      headerName: 'PAYMENT TYPE',
      field: 'payment_type',
      width: 390,
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
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'BALANCE DUE',
      field: 'balance_amount',
      width: 350,
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
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
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
    }
  ]);

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

  useEffect(() => {
    getsalesListWithLimit(todayFormated, todayFormated);
  }, []);

  const handleSearch = async (e) => {
    if (e) {
      let target = e.target.value.toLowerCase();
      if (target) {
        addSalesData(await handleSalesSearch(target));
      } else {
        getsalesListWithLimit(todayFormated, todayFormated);
      }
    }
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const rowClassRules = {
    rowHighlight(params) {
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

  const { openForNewSale } = stores.SalesAddStore;
  const { salesData } = toJS(stores.SalesAddStore);
  const { addSalesData, getsalesListWithLimit, handleSalesSearch } =
    stores.SalesAddStore;

  return (
    <>
      <Paper p={3} className={classes.paperRoot}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">Recent {getSaleName()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} align="right">
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
                    <Search className={classes.searchIcon} />
                  </InputAdornment>
                )
              }}
              onChange={handleSearch}
            />
          </Grid>
          {/* <Grid item xs={4} sm={2} align="right">
            <Controls.Button
              text="Add Sale"
              size="medium"
              variant="contained"
              color="primary"
              startIcon={<Add />}
              className={classes.newButton}
              onClick={() => openForNewSale()}
            />
            {openAddSalesInvoice ? <AddSalesInvoice /> : null}
            </Grid> */}
        </Grid>

        <div className={classes.itemTable}>
          <Box mt={4}>
            <div style={{ width: '100%', height: '37vh' }}>
              <div
                id="product-list-grid"
                style={{ height: '100%', width: '100%' }}
                className="ag-theme-material"
              >
                <AgGridReact
                  onGridReady={onGridReady}
                  enableRangeSelection
                  paginationPageSize={5}
                  suppressMenuHide
                  rowData={salesData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination
                  rowSelection="single"
                  headerHeight={40}
                  overlayLoadingTemplate={
                    '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                  }
                  rowClassRules={rowClassRules}
                  frameworkComponents={{}}
                />
              </div>
            </div>
          </Box>
        </div>
      </Paper>
    </>
  );
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, []);
  return ref.current;
}

export default InjectObserver(TransactionTable);
