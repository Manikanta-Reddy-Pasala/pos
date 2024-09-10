import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import * as Db from '../../../../RxDb/Database/Database';

import {
  Box,
  Typography,
  IconButton,
  FormControl,
  Input,
  Select,
  Grid,
  Avatar,
  Paper,
  Button
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import {
  getStockDetailReport,
  getStockDetailReportForAllProducts
} from 'src/components/Helpers/ProductTxnQueryHelper';
import XLSX from 'xlsx';
import ProductModal from 'src/components/modal/ProductModal';

const useStyles = makeStyles((theme) => ({
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
    marginLeft: '13px'
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
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
    padding: 2,
    borderRadius: '12px',
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
  categoryActionWrapper: {
    paddingRight: '10px',
    '& .category-actions-left': {
      '& > *': {
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .category-actions-right': {
      '& > *': {
        marginLeft: theme.spacing(2),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  },
  resetbtn: {
    margin: 20,
    padding: 6
  }
}));

const StockDetail = () => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const { height } = useWindowDimensions();
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [category, setCategory] = React.useState([]);
  const [categoryLevel2, setCategoryLevel2] = React.useState('');
  const [categoryLevel3, setCategoryLevel3] = React.useState('');

  const [subCategory, setSubCategory] = React.useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(false);
  const [warehouse, setWarehouse] = React.useState('');
  const [warehouseList, setWarehouseList] = React.useState([]);

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
    resetData
  } = store.ReportsStore;

  const { getWarehouse } = store.WarehouseStore;

  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleEditProductModalLaunchFromReports } = store.ProductStore;
  const [columnDefs, setColumnDefs] = useState([]);

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    if ('productName' === colId) {
      const db = await Db.get();
      const businessData = await Bd.getBusinessData();

      await db.businessproduct
        .findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { productId: { $eq: event.data.productId } }
            ]
          }
        })
        .exec()
        .then(async (data) => {
          if (!data) {
            // No proudct match found
            return;
          }

          handleEditProductModalLaunchFromReports(data);
        });
    }
  };

  useEffect(() => {
    async function fetchData() {
      setWarehouseList(await getWarehouse());
      setColumnDefs(getColumnDefs());
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setColumnDefs(await getColumnDefs());
    }

    fetchData();
  }, []);

  function getColumnDefs() {
    let columnDefs = [];
    setColumnDefs(columnDefs);

    const name = {
      headerName: 'NAME',
      field: 'productName',
      width: 150,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    };

    const hsn = {
      headerName: 'HSN',
      field: 'productHsn',
      width: 150,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const openingQty = {
      headerName: 'OPENING QTY',
      field: 'openingQty',
      width: 150,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>OPENING</p>
            <p>QTY</p>
          </div>
        );
      }
    };

    const qtyIn = {
      headerName: 'QTY IN',
      field: 'qtyIn',
      width: 150,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const purchaseAmt = {
      headerName: 'PURCHASE AMOUNT',
      field: 'purchasesAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 150,
      valueFormatter: (params) => {
        return params['data']['purchasesAmount']
          ? parseFloat(params['data']['purchasesAmount']).toFixed(2)
          : '0';
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASE</p>
            <p>AMOUNT</p>
          </div>
        );
      }
    };

    const qtyOut = {
      headerName: 'QTY OUT',
      field: 'qtyOut',
      width: 150,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    };

    const saleAmt = {
      headerName: 'SALE AMOUNT',
      field: 'salesAmount',
      width: 150,
      valueFormatter: (params) => {
        return params['data']['salesAmount']
          ? parseFloat(params['data']['salesAmount']).toFixed(2)
          : '0';
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SALE</p>
            <p>AMOUNT</p>
          </div>
        );
      }
    };

    const closingQty = {
      headerName: 'CLOSING QTY',
      field: 'closingQty',
      width: 150,
      //   valueGetter: multiplierGetter,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CLOSING</p>
            <p>QTY</p>
          </div>
        );
      }
    };

    const netWeight = {
      field: 'netWeight',
      width: 100,
      //   valueGetter: multiplierGetter,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>NT. W</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        return params['data']['netWeight']
          ? parseFloat(
              params['data']['netWeight'] * params['data']['closingQty']
            ).toFixed(3)
          : parseFloat(0).toFixed(3);
      }
    };

    columnDefs.push(name);
    columnDefs.push(hsn);
    columnDefs.push(openingQty);
    columnDefs.push(qtyIn);
    columnDefs.push(purchaseAmt);
    columnDefs.push(qtyOut);
    columnDefs.push(saleAmt);
    columnDefs.push(closingQty);
    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      columnDefs.push(netWeight);
    }

    return columnDefs;
  }

  const handleChange = (event) => {
    console.log(event);
    setCategory(event.displayName);
    setCategoryLevel2(event.name);
    getBusinessLevel3Categorieslist(event.name);
  };

  const handleChangeSubCategory = async (event) => {
    setSubCategory(event.displayName);
    setCategoryLevel3(event.name);

    const db = await Db.get();
    let data = await getStockDetailReport(
      db,
      categoryLevel2,
      event.name,
      fromDate,
      toDate,
      warehouse
    );
    setRowData(data);
  };

  const resetCategory = async (event) => {
    setCategory([]);
    setSubCategory([]);
    setCategoryLevel2('');
    setCategoryLevel3('');
    getBusinessLevel2Categorieslist();
    setRowData([]);
    const db = await Db.get();
    setRowData(
      await getStockDetailReportForAllProducts(db, fromDate, toDate, warehouse)
    );
  };

  const getTotalNetWeight = () => {
    let total = 0;
    for (let data of rowData) {
      total = total + parseFloat(data.netWeight * data.closingQty || 0);
    }

    return parseFloat(total).toFixed(3);
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromStockDetailReport = () => {
    const wb = new Workbook();

    let data = [];
    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        let record;
        if (
          String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
        ) {
          record = {
            NAME: rowData[i].productName,
            HSN: rowData[i].productHsn,
            'OPENING QTY': rowData[i].openingQty,
            'QTY IN': rowData[i].qtyIn,
            'PURCHASE AMOUNT': rowData[i].purchasesAmount,
            'QTY OUT': rowData[i].qtyOut,
            'SALE AMOUNT': rowData[i].salesAmount,
            'CLOSING QTY': rowData[i].closingQty,
            'TOTAL NT. W': rowData[i].netWeight
              ? parseFloat(
                  rowData[i].netWeight * rowData[i].closingQty
                ).toFixed(3)
              : '0'
          };
        } else {
          record = {
            NAME: rowData[i].productName,
            HSN: rowData[i].productHsn,
            'OPENING QTY': rowData[i].openingQty,
            'QTY IN': rowData[i].qtyIn,
            'PURCHASE AMOUNT': rowData[i].purchasesAmount,
            'QTY OUT': rowData[i].qtyOut,
            'SALE AMOUNT': rowData[i].salesAmount,
            'CLOSING QTY': rowData[i].closingQty
          };
        }
        data.push(record);
      }
    } else {
      let record;
      if (
        String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
      ) {
        record = {
          NAME: '',
          HSN: '',
          'OPENING QTY': '',
          'QTY IN': '',
          'PURCHASE AMOUNT': '',
          'QTY OUT': '',
          'SALE AMOUNT': '',
          'CLOSING QTY': '',
          'TOTAL NT. W': ''
        };
      } else {
        record = {
          NAME: '',
          HSN: '',
          'OPENING QTY': '',
          'QTY IN': '',
          'PURCHASE AMOUNT': '',
          'QTY OUT': '',
          'SALE AMOUNT': '',
          'CLOSING QTY': ''
        };
      }
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Stock Detail Report Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Stock Detail Report Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Stock_Detail_Report';

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

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    resetData();
    getBusinessLevel2Categorieslist();
    setTimeout(() => setLoadingShown(false), 200);
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
            warehouse
          )
        );
      } else {
        setRowData(
          await getStockDetailReportForAllProducts(
            db,
            fromDate,
            toDate,
            warehouse
          )
        );
      }
    }

    fetchData();
  }, [fromDate, toDate]);

  const fetchDataOnWarehouseChange = async (warehouse) => {
    const db = await Db.get();
    if (categoryLevel2.length > 1 && categoryLevel2.length > 2) {
      setRowData(
        await getStockDetailReport(
          db,
          categoryLevel2,
          categoryLevel3,
          fromDate,
          toDate,
          warehouse
        )
      );
    } else {
      setRowData(
        await getStockDetailReportForAllProducts(
          db,
          fromDate,
          toDate,
          warehouse
        )
      );
    }
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Item Stock Report')) {
        setFeatureAvailable(false);
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
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root} style={{ minHeight: height - 83 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 83 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4" component="h4">
                    STOCK DETAIL
                  </Typography>
                </div>
              </div>

              <div>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
                  <Grid item xs={10}>
                    <div>
                      <form className={classes.blockLine} noValidate>
                        <TextField
                          id="date"
                          label="From"
                          type="date"
                          value={fromDate}
                          onChange={(e) =>
                            setFromDate(formatDate(e.target.value))
                          }
                          className={classes.textField}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </form>
                      <form className={classes.blockLine} noValidate>
                        <TextField
                          id="date"
                          label="To"
                          type="date"
                          value={toDate}
                          className={classes.textField}
                          onChange={(e) =>
                            setToDate(formatDate(e.target.value))
                          }
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </form>
                    </div>
                  </Grid>
                  <Grid item xs={2} style={{ marginTop: '14px' }}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton
                          onClick={() => getDataFromStockDetailReport()}
                        >
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                      {/* <IconButton classes={{ label: classes.label }}>
              <Print fontSize="inherit" />
              <span className={classes.iconLabel}>Print</span>
                  </IconButton> */}
                    </Grid>
                  </Grid>
                </Grid>

                <Grid container className={classes.categoryActionWrapper}>
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
                    {warehouseList && warehouseList.length > 0 && (
                      <div className={classes.selectOption}>
                        <FormControl
                          required
                          className={clsx(classes.formControl, classes.noLabel)}
                        >
                          <Select
                            disableUnderline
                            className={classes.selectFont}
                            value={warehouse ? warehouse : 'Select'}
                            input={<Input />}
                            onChange={async (e) => {
                              if (e.target.value !== 'Select') {
                                setWarehouse(e.target.value);
                                fetchDataOnWarehouseChange(e.target.value);
                              } else {
                                setWarehouse('');
                                fetchDataOnWarehouseChange('');
                              }
                            }}
                          >
                            <MenuItem value={'Select'}>{'Select'}</MenuItem>

                            {warehouseList &&
                              warehouseList.map((option, index) => (
                                <MenuItem value={option.name}>
                                  {option.name}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                  </Grid>
                </Grid>
              </div>

              <div className={classes.itemTable}>
                {/* <App />  */}

                <Box mt={1}>
                  <div
                    style={{
                      width: '100%',
                      height: height - 280 + 'px'
                    }}
                    className=" blue-theme"
                  >
                    <div
                      id="product-list-grid"
                      style={{ height: '95%', width: '100%' }}
                      className="ag-theme-material"
                    >
                      <AgGridReact
                        onGridReady={onGridReady}
                        enableRangeSelection
                        paginationPageSize={10}
                        suppressMenuHide
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection="single"
                        pagination
                        headerHeight={40}
                        onCellClicked={handleCellClicked}
                        overlayLoadingTemplate={
                          '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                        }
                        overlayNoRowsTemplate={
                          '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                        }
                      />
                    </div>
                  </div>
                </Box>
              </div>

              {String(localStorage.getItem('isJewellery')).toLowerCase() ===
                'true' && (
                <div>
                  <Grid container>
                    <Grid item xs={10}>
                      <p>Total</p>
                    </Grid>
                    <Grid item xs={2} className={classes.totalQty}>
                      <p>Total Net Weight : {getTotalNetWeight()}</p>
                    </Grid>
                  </Grid>
                </div>
              )}
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(StockDetail);