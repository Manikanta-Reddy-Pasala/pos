import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import { toJS } from 'mobx';
import { Box, Paper } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './ExpenseTable.css';
import useWindowDimensions from 'src/components/windowDimension';
import * as dateHelper from '../../../components/Helpers/DateHelper';

const useStyles = makeStyles({
  root: {
    width: '100%'
    //paddingTop: 30
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
    marginTop: -2,
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
  }
});

function ExpenseCategoryReport() {
  const classes = useStyles();
  const { height } = useWindowDimensions();

  const store = useStore();
  const { categoryList, currentSelectedCategory } = toJS(store.ExpensesStore);
  const {
    getCategoryList,
    setSelectedCategory
  } = store.ExpensesStore;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const numberSort = (num1, num2) => {
    return num1 - num2;
  };

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const [columnDefs] = useState([
    {
      headerName: 'CATEGORY',
      field: 'category',
      filter: 'agTextColumnFilter',
      cellClass: 'no-border',
      resizable: true,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'AMOUNT',
      field: 'amount',
      resizable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      comparator: numberSort,
      valueFormatter: (params) => {
        console.log('params', params);
        let data = params['data']['amount'];
        let result = 0;

        if (data) {
          result = data;
        }

        return result;
      }
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
      params.api.addEventListener('cellFocused', ({ rowIndex }) =>
        params.api.getDisplayedRowAtIndex(rowIndex).setSelected(true)
      );
    }, 500);
  };

  useEffect(() => {
    async function fetchData() {
      if (categoryList.length === 0) {
        await getCategoryList(dateHelper.getFinancialYearStartDate(), dateHelper.getFinancialYearEndDate());
      }
    }

    fetchData();
  }, []);

  async function onRowClicked(row) {
    await setSelectedCategory(row.data);
  }

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
    <div className={classes.root} style={{ height: height - 60 }}>
      <Paper className={classes.root} style={{ height: height - 60 }}>

      <Grid container>
            <div
              id="grid-theme-wrapper"
              style={{ width: '100%', height: height - 75 + 'px' }}
              className="red-theme"
            >
              <div
                style={{ height: '100%', width: '100%', padding:'5px' }}
                className="ag-theme-material"
              >
                <AgGridReact
                  onGridReady={onGridReady}
                  enableRangeSelection
                  paginationPageSize={15}
                  suppressMenuHide
                  rowData={categoryList}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination
                  headerHeight={40}
                  rowSelection="single"
                  frameworkComponents={{}}
                  onRowClicked={(e) => onRowClicked(e)}
                  className={classes.agGridclass}
                  style={{ width: '100%', height: '100%;' }}
                />
              </div>
            </div>
      </Grid>
      </Paper>
    </div>
  );
}

export default InjectObserver(ExpenseCategoryReport);