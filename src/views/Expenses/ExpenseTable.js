import React, { useState, useEffect } from 'react';
import 'react-table/react-table.css';
import { Grid, makeStyles, Button } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import '../Expenses/ExpenseTable.css';
import { Box, InputAdornment, Typography } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import { toJS } from 'mobx';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import './ExpenseTable.css';
import Moreoptions from '../../components/MoreoptionsExpenseList';
import * as moment from 'moment';
import useWindowDimensions from '../../components/windowDimension';
import AddExpenses from './Modal/AddExpenses';
import DateRangePicker from '../../components/controls/DateRangePicker';
import left_arrow from '../../icons/svg/left_arrow.svg';
import right_arrow from '../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../icons/svg/last_page_arrow.svg';
import * as dateHelper from '../../components/Helpers/DateHelper';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';
import dateFormat from 'dateformat';
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

  searchField: {
    marginRight: 0
  },
  searchInputRoot: {
    borderRadius: 50
  },
  searchInputInput: {
    padding: '7px 12px 7px 0px'
  },
  addExpenseBtn: {
    background: '#ffaf00',
    '&:hover': {
      backgroundColor: '#ffaf00'
    },
    color: 'white',
    borderRadius: '20px',
    padding: '8px 20px 8px 20px',
    textTransform: 'none',
    width: 'max-content'
  }
}));

const ExpensesTable = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchText, setSearchText] = useState('');

  const [rowData, setRowData] = useState(null);
  let [expenseData, setExpenseData] = useState([]);

  const [dateRange, setDateRange] = useState({
    fromDate: dateHelper.getFinancialYearStartDate(),
    toDate: dateHelper.getFinancialYearEndDate()
  });

  let [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);

  const store = useStore();
  const { currentSelectedCategory, changeInCategory, addExpensesDialogue } = toJS(
    store.ExpensesStore
  );
  const { handleAddexpensesModalOpen } = store.ExpensesStore;

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
        await getExpensesList(dateRange);
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    if (Object.keys(currentSelectedCategory).length > 0) {
      setCurrentPage(1);
      setRowData([]);
      getExpensesList(dateRange);
    }
  }, [changeInCategory]);

  const getExpensesList = async (dateRange) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query;
    let skip = 0;
    setRowData([]);
    setExpenseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllExpensesList(currentSelectedCategory);
    }

    if (Object.keys(currentSelectedCategory).length > 0) {
      query = db.expenses.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { categoryId: { $eq: currentSelectedCategory.categoryId } },
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
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }],
        skip: skip,
        limit: limit
      });
    } else {
      query = db.expenses.find({
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
              updatedAt: { $exists: true }
            }
          ]
        },
        sort: [{ date: 'desc' }, { updatedAt: 'desc' }],
        skip: skip,
        limit: limit
      });
    }

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let temp = item;

        temp.item_count = 0;

        if (item.item_list) {
          temp.item_count = item.item_list.length;
        }

        return temp;
      });
      setRowData(response);
    });
  };

  const getAllExpensesList = async (currentSelectedCategory) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query;
    if (Object.keys(currentSelectedCategory).length > 0) {
      query = db.expenses.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },

            { categoryId: { $eq: currentSelectedCategory.categoryId } },
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
    } else {
      query = db.expenses.find({
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
    }

    await query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getSearchExpensesList = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query;
    let skip = 0;
    setRowData([]);
    setExpenseData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSearchExpensesList(value);
    }

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    query = db.expenses.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { billNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total: { $eq: parseFloat(value) } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { date: { $eq: value } }
            ]
          }
        ]
      },
      sort: [{ date: 'desc' }, { updatedAt: 'desc' }],
      skip: skip,
      limit: limit
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => {
        let temp = item;

        temp.item_count = 0;

        if (item.item_list) {
          temp.item_count = item.item_list.length;
        }

        return temp;
      });
      setRowData(response);
    });
  };

  const getAllSearchExpensesList = async (value) => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');

    let query;

    query = db.expenses.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { billNumber: { $regex: regexp } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { total: { $eq: parseFloat(value) } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { date: { $eq: value } }
            ]
          }
        ]
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

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

  function dateFormatter(params) {
    var dateAsString = params.data.date;
    var dateParts = dateAsString.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [columnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'date',
      width: 200,
      editable: false,
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
      headerName: 'BILL NUMBER',
      field: 'billNumber',
      width: 180,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TOTAL',
      field: 'total',
      width: 180,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'BALANCE DUE',
      field: 'balance',
      width: 180,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PAYMENT TYPE',
      field: 'paymentType',
      width: 220,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'CATEGORY',
      field: 'categoryName',
      width: 220,
      editable: false,
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
      width: 150,
      cellRenderer: 'templateMoreOptionRenderer'
    }
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);

    window.addEventListener('resize', () => {
      setTimeout(() => {
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
      justifyContent="center"
    >
      <Grid item xs={12} sm={12}>
        <div className={classes.content}>
          <div className={classes.contentLeft}>
            <Typography gutterBottom variant="h4" component="h4">
              Expenses
            </Typography>
          </div>
          <div className={classes.contentRight}>
            <Button
              size="small"
              variant="contained"
              onClick={handleAddexpensesModalOpen}
              className={classes.addExpenseBtn}
            >
              Add Expense
            </Button>
            { addExpensesDialogue ? <AddExpenses /> : null }
          </div>
        </div>
      </Grid>
      <Grid item xs={12} sm={12}>
        <div className={classes.content} style={{ paddingLeft: '0px' }}>
          <div className={classes.contentLeft}>
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

          <div className={classes.searchField}>
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
              onChange={async (event) => {
                if (event.target.value.toString().toLowerCase()) {
                  getSearchExpensesList(
                    event.target.value.toString().toLowerCase()
                  );
                } else {
                  getExpensesList(dateRange);
                }
              }}
            />
          </div>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Box mt={4}>
          <div
            id="product-list-grid"
            className="red-theme "
            style={{ width: '100%', height: height - 295 + 'px' }}
          >
            <div
              id="product-list-grid"
              style={{ height: '100%', width: '100%' }}
              className="ag-theme-material"
            >
              <AgGridReact
                onGridReady={onGridReady}
                paginationPageSize={10}
                suppressMenuHide
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination={true}
                rowSelection="single"
                headerHeight={40}
                rowClassRules={rowClassRules}
                suppressPaginationPanel={true}
                suppressScrollOnNewData={true}
                frameworkComponents={{
                  templateMoreOptionRenderer: TemplateMoreOptionRenderer
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
        </Box>
      </Grid>
    </Grid>
  );
};

export default InjectObserver(ExpensesTable);