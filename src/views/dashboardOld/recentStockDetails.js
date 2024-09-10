import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import {
  Paper,
  Box,
  Typography,
  Grid,
  FormControl,
  Input,
  Select,
  Button
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import { toJS } from 'mobx';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import TextField from '@material-ui/core/TextField';
import LowAndExpiryStockAlertModal from './LowAndExpiryStockAlert';
import * as Db from '../../RxDb/Database/Database';
import {
  getStockDetailReport,
  getStockDetailReportForAllProducts
} from 'src/components/Helpers/ProductTxnQueryHelper';

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: '24px',
    boxShadow: '0px 0px 12px -3px #0000004a',
    borderRadius: '10px'
  },
  popover: {
    pointerEvents: 'none'
  },

  selectFont: {
    fontSize: '13px'
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
    float: 'left',
    '& .makeStyles-formControl-53': {
      borderRadius: '7px'
    }
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
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px',
    margin: '4px',
    padding: '6px'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 30,
    borderRadius: '12px'
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
  root: {
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },

  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
    border: '1px solid grey',
    padding: '6px',
    background: 'white'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  iconAlign: {
    textAlign: 'end',
    padding: '14px'
  },
  footer: {
    borderTop: '1px solid #d8d8d8',
    padding: '20px'
  },
  amount: {
    textAlign: 'center'
  },
  totalQty: {
    color: '#80D5B8',
    textAlign: 'center'
  },
  datefield: {
    margin: '-12px 5px 0px 5px',
    '& .MuiInput-root': {
      fontSize: 'small',
      width: '93%'
    }
  },
  datelabel: {
    fontSize: 'small',
    marginRight: '10px'
  },
  resetbtn: {
    margin: 20,
    padding: 6
  }
}));

const RecentStockDetail = () => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [category, setCategory] = React.useState([]);
  const [subCategory, setSubCategory] = React.useState([]);
  const [categoryLevel2, setCategoryLevel2] = React.useState('');
  const [categoryLevel3, setCategoryLevel3] = React.useState('');

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
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

  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));
  const [rowData, setRowData] = React.useState([]);

  const store = useStore();
  const { level2CategoriesList, level3CategoriesList } = toJS(
    store.ReportsStore
  );
  const {
    getBusinessLevel2Categorieslist,
    getBusinessLevel3Categorieslist,
    resetData,
    getLowStockAndExpiry
  } = store.ReportsStore;

  const [columnDefs] = useState([
    {
      headerName: 'Item Name',
      field: 'productName',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Opening Quantity',
      field: 'openingQty',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Quantity In',
      field: 'qtyIn',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Purchase Amount',
      field: 'purchasesAmount',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Quantity Out',
      field: 'qtyOut',
      width: 300,
      //   cellStyle() {
      //     return { color: '#80D5B8' };
      //   },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Sale Amount',
      field: 'salesAmount',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Closing Quantity',
      field: 'closingQty',
      width: 300,
      //   valueGetter: multiplierGetter,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

  const handleChange = (event) => {
    console.log(event);
    setCategory(event.displayName);
    setCategoryLevel2(event.name);
    getBusinessLevel3Categorieslist(event.name);
  };

  const handleChangeSubCategory = async (event) => {
    console.log(event);
    setSubCategory(event.displayName);

    const db = await Db.get();
    setRowData(
      await getStockDetailReport(
        db,
        categoryLevel2,
        event.name,
        fromDate,
        toDate
      )
    );
  };

  useEffect(() => {
    resetData();
    getLowStockAndExpiry();
    getBusinessLevel2Categorieslist();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const db = await Db.get();
      if (categoryLevel2.length > 1 && categoryLevel2.length > 2) {
        setRowData(
          await getStockDetailReport(
            db,
            categoryLevel2,
            categoryLevel3,
            fromDate,
            toDate,
            ''
          )
        );
      } else {
        setRowData(
          await getStockDetailReportForAllProducts(db, fromDate, toDate, '')
        );
      }
    }

    fetchData();
  }, [fromDate, toDate]);

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

  const resetCategory = async (event) => {
    setCategory([]);
    setSubCategory([]);
    getBusinessLevel2Categorieslist();
    const db = await Db.get();
    setRowData(
      await getStockDetailReportForAllProducts(db, fromDate, toDate, '')
    );
  };

  return (
    <Paper p={3} className={classes.paperRoot}>
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={2}>
            <div style={{ marginTop: 13 }}>
              <Typography gutterBottom variant="h4" component="h4">
                Recent Stock Detail
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={1}>
              <Grid item xs={5}>
                <form className={classes.blockLine} noValidate>
                  <TextField
                    id="date"
                    label="From"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(formatDate(e.target.value))}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </form>
              </Grid>
              <Grid item xs={7}>
                <form className={classes.blockLine} noValidate>
                  <TextField
                    id="date"
                    label="To"
                    type="date"
                    value={toDate}
                    className={classes.textField}
                    onChange={(e) => setToDate(formatDate(e.target.value))}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </form>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <div className={classes.selectOption}>
                  <FormControl
                    required
                    className={clsx(classes.formControl, classes.noLabel)}
                  >
                    <Select
                      displayEmpty
                      value={category}
                      // onChange={handleChange}
                      input={<Input />}
                      disableUnderline
                      className={classes.selectFont}
                    >
                      <MenuItem disabled value="">
                        Choose Category
                      </MenuItem>
                      {level2CategoriesList.map((c) => (
                        <MenuItem
                          key={c.name}
                          value={c.displayName}
                          onClick={() => handleChange(c)}
                        >
                          {c.displayName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.selectOption}>
                  <FormControl
                    required
                    className={clsx(classes.formControl, classes.noLabel)}
                  >
                    <Select
                      displayEmpty
                      value={subCategory}
                      input={<Input />}
                      disableUnderline
                      className={classes.selectFont}
                    >
                      <MenuItem disabled value="">
                        Choose Sub Category
                      </MenuItem>
                      {level3CategoriesList.map((c) => (
                        <MenuItem
                          key={c.name}
                          value={c.displayName}
                          onClick={() => handleChangeSubCategory(c)}
                        >
                          {c.displayName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className={classes.selectOption}>
                  <Button
                    className={classes.resetbtn}
                    size="small"
                    onClick={resetCategory}
                    color="secondary"
                  >
                    Reset Categories
                  </Button>
                </div>
              </Grid>
            </Grid>

            <LowAndExpiryStockAlertModal />
          </Grid>
          <Grid item xs={12}>
            <div className={classes.itemTable}>
              {/* <App />  */}

              <Box mt={4}>
                <div style={{ width: '100%', height: '54vh' }}>
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
                      rowData={rowData}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      pagination
                      headerHeight={40}
                      rowSelection="single"
                      rowClassRules={rowClassRules}
                      frameworkComponents={{}}
                      overlayLoadingTemplate={
                        '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                      }
                    />
                  </div>
                </div>
              </Box>
            </div>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};

export default InjectObserver(RecentStockDetail);