import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core';
import { toJS } from 'mobx';
import { Box } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import CategoryModal from './Modal/CategoryModal';
import CategoryViewModal from './Modal/CategoryViewModal';
import Moreoptions from '../../components/MoreoptionsExpenseCategory';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './ExpenseTable.css';
import * as dateHelper from '../../components/Helpers/DateHelper';

const useStyles = makeStyles({
  root: {
    width: '100%',
    paddingTop: 30
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

function Category() {
  const classes = useStyles();

  const store = useStore();
  const { categoryList, changeInExpense } = toJS(store.ExpensesStore);
  const {
    handleCategoryModalOpen,
    handleViewCategoryModelOpen,
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
      cellRendererFramework(params) {
        return (
          <div>
            <Grid container>
              <Grid item xs={9}>
                <p style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                  {params.data.amount}
                </p>
              </Grid>
              <Grid item xs={3}>
                <Moreoptions
                  index={params['data']['expenseId']}
                  id={params['data']['expenseId']}
                  item={params['data']}
                  component="expensesList"
                />
              </Grid>
            </Grid>
          </div>
        );
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
     // if (categoryList.length === 0) {
        await getCategoryList(
          dateHelper.getFinancialYearStartDate(),
          dateHelper.getFinancialYearEndDate()
        );
     // }
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (changeInExpense === true) {
        await getCategoryList(
          dateHelper.getFinancialYearStartDate(),
          dateHelper.getFinancialYearEndDate()
        );
      }
    }

    fetchData();
  }, [changeInExpense]);

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
    <Grid container className={classes.root}>
      <Grid className={classes.dFlex} item xs={6} />
      <Grid className={classes.dFlex} item xs={6}>
        <Button
          size="medium"
          variant="contained"
          onClick={handleCategoryModalOpen}
          className={classes.categoryBtn}
        >
          Add Category
        </Button>
        <CategoryModal open={handleCategoryModalOpen} fullWidth maxWidth="sm" />
        <CategoryViewModal
          open={handleViewCategoryModelOpen}
          fullWidth
          maxWidth="sm"
        />
      </Grid>

      <Grid container>
        <div className={classes.itemTable}>
          <Box mt={4}>
            <div
              id="grid-theme-wrapper"
              style={{ width: '100%', height: '75vh' }}
              className="red-theme"
            >
              <div
                style={{ height: '75vh', width: '100%' }}
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
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}

export default InjectObserver(Category);