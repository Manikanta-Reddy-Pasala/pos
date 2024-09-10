import React, { useState, useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import 'react-table/react-table.css';
import SearchIcon from '@material-ui/icons/Search';
import '../Expenses/ExpenseTable.css';
import { InputAdornment } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import Moreoptions from '../../components/MoreOptionEmployeeTxnList';
import './Employee.css';
import useWindowDimensions from 'src/components/windowDimension';
import Controls from 'src/components/controls/index';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none'
  },

  selectFont: {
    fontSize: '14px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  datepickerbg: {
    '& .MuiPickersToolbar-toolbar': {
      backgroundColor: '#ef5350 !important'
    },
    '& .MuiButton-textPrimary': {
      color: '#ef5350 !important'
    },
    '& .MuiPickersDay-daySelected': {
      backgroundColor: '#ef5350 !important'
    }
  },
  selectOption: {
    float: 'left'
  },
  datePickerOption: {
    float: 'right',
    display: 'inline-block',
    marginRight: '26px'
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
    '& .MuiSelect-selectMenu': {
      background: 'white'
    }
  },
  paymentTypeOption: {
    margin: theme.spacing(2),
    minWidth: 120
  },
  itemTable: {
    width: '100%',
    display: 'inline-block'
  },
  roundOff: {
    '& .MuiFormControl-root': {
      background: 'white',
      verticalAlign: 'inherit',
      width: '100px',
      paddingLeft: '10px'
    }
  },

  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  contentRight: {
    display: 'flex',
    justifyContent: 'space-between'
  },

  inputField: {
    '& .MuiOutlinedInput-input': {
      padding: '8px'
    },
    '& .MuiOutlinedInput-root': {
      position: 'relative',
      borderRadius: 18
    }
  },

  addExpenseBtn: {
    background: '#ffaf00',
    '&:hover': {
      backgroundColor: '#ffaf00'
    },
    color: 'white',
    borderRadius: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
    textTransform: 'none'
  },
  searchField: {
    marginRight: 20
  },
  searchInputRoot: {
    borderRadius: 50
  },
  searchInputInput: {
    padding: '7px 12px 7px 0px'
  }
}));

const TransactionTable = () => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { height } = useWindowDimensions();

  const store = useStore();
  const { employeeTransactionList } = toJS(store.EmployeeStore);
  const { handleEmployeeTransactionSearch } = store.EmployeeStore;
  const [dateRange, setDateRange] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });
  const TemplateMoreOptionRenderer = (props) => {
    return (
      <Moreoptions
        index={props['data']['expenseId']}
        id={props['data']['expenseId']}
        item={props['data']}
        component="expensesList"
      />
    );
  };

  const [columnDefs] = useState([
    {
      headerName: 'Date',
      field: 'date',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['date']) {
          result = data['date'];
        }
        var dateParts = result.split('-');
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    },
    {
      headerName: 'Ref. No',
      field: 'sequenceNumber',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
      // filter: 'agDateColumnFilter',
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let name = '';

        if (data['customerName']) {
          name = data['customerName'];
        }

        if (data['vendorName']) {
          name = data['vendorName'];
        }
        return name;
      },
      filter: true
    },
    {
      headerName: 'Type',
      field: 'txnType',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Total',
      field: 'amount',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      editable: false
    },
    // {
    //   headerName: 'Received',
    //   field: 'received',
    //   width: 300,
    //   filterParams: {
    //     buttons: ['reset', 'apply'],
    //     closeOnApply: true
    //   }
    // },
    {
      headerName: 'Balance',
      field: 'balance',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
    // {
    //   headerName: 'New/Edit',
    //   field: 'newEdit',
    //   width: 300,
    //   filterParams: {
    //     buttons: ['reset', 'apply'],
    //     closeOnApply: true
    //   }
    // }
  ]);

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

  useEffect(() => {
    if (gridApi) {
      if (employeeTransactionList) {
        gridApi.setRowData(employeeTransactionList);
      }
    }
  }, [employeeTransactionList, gridApi]);

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

  return (
    <Grid
      container
      direction="row"
      spacing={2}
      alignItems="center"
      justify="center"
    >
    {/* <Grid item xs={12} sm={6}>
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
          }}
        />
        </Grid> */} 

      <Grid item xs={12} sm={6}>
        <div style={{ float: 'right' }}>
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
                <SearchIcon />
              </InputAdornment>
            )
          }}
          onChange={(event) => {
            handleEmployeeTransactionSearch(
              event.target.value.toString().toLowerCase()
            )

          }}
        />
        </div>
      </Grid>
      <Grid item xs={12}>
        <div
          id="product-list-grid"
          className="red-theme "
          style={{ width: '100%', height: height - 190 + 'px' }}
        >
          <div
            id="product-list-grid"
            style={{ height: '100%', width: '100%' }}
            className="ag-theme-material"
          >
            <AgGridReact
              onGridReady={onGridReady}
              enableRangeSelection
              paginationPageSize={10}
              suppressMenuHide
              rowData={employeeTransactionList}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              rowSelection="single"
              pagination
              headerHeight={40}
              rowClassRules={rowClassRules}
              frameworkComponents={{
                templateMoreOptionRenderer: TemplateMoreOptionRenderer
              }}
              overlayLoadingTemplate={
                '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
              }
              overlayNoRowsTemplate={
                '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
              }
            />
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default InjectObserver(TransactionTable);
