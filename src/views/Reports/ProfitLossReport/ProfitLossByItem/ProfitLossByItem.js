import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Paper,
  Input,
  Select,
  Button
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { toJS } from 'mobx';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import * as Db from '../../../../RxDb/Database/Database';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import useWindowDimensions from '../../../../components/windowDimension';
import {
  getProfitAndLossReportByProduct,
  getProfitAndLossReportByCategory
} from 'src/components/Helpers/ProductTxnQueryHelper';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';

// import left_arrow from '../../../../icons/svg/left_arrow.svg';
// import right_arrow from '../../../../icons/svg/right_arrow.svg';
// import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
// import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';

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
  searchInputRoot: {
    borderRadius: 50,
    marginLeft: '-12px',
    marginTop: '13px'
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
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  nameList: {
    marginLeft: '12px',
    marginTop: '20px'
  },
  radioDate: {
    marginLeft: '13px',
    marginTop: '15px'
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
    minHeight: '616px',
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
  outlinedInput: {
    width: '100%'
  },
  tableForm: {
    padding: '10px 6px'
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  listbox: {
    margin: 5,
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  resetbtn: {
    margin: 20,
    padding: 6
  },
  greenText: {
    color: '#339900'
  },
  redText: {
    color: '#EF5350'
  }
}));

const ProfitLossByItem = () => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const { height } = useWindowDimensions();
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [category, setCategory] = React.useState('');
  const [subCategory, setSubCategory] = React.useState('');
  const [selectedProduct, setSelectedProduct] = useState();
  const [productName, setProductName] = React.useState();
  const [productId, setProductId] = React.useState('');

  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);

  const [categoryLevel2, setCategoryLevel2] = React.useState('');
  const [categoryLevel3, setCategoryLevel3] = React.useState('');
  // const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(false);

  const store = useStore();

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

  const { level2CategoriesList, level3CategoriesList } = toJS(
    store.ReportsStore
  );
  const {
    getBusinessLevel2Categorieslist,
    getBusinessLevel3Categorieslist,
    resetData
  } = store.ReportsStore;

  const statusCellStyle = (params) => {
    let data = params['data'];
    if (data['profitOrLoss'] >= 0) {
      return { color: '#339900', fontWeight: 500 };
    } else {
      return { color: '#EF5350', fontWeight: 500 };
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'NAME',
      field: 'productName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'OPENING STOCK',
      field: 'openingStockValue',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['openingStockValue']
          ? parseFloat(params['data']['openingStockValue']).toFixed(2)
          : '0';
      }
    },
    {
      headerName: 'CLOSING STOCK',
      field: 'closingStockValue',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['closingStockValue']
          ? parseFloat(params['data']['closingStockValue']).toFixed(2)
          : '0';
      }
    },
    {
      headerName: 'SALE',
      field: 'saleAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['saleAmount']
          ? parseFloat(params['data']['saleAmount']).toFixed(2)
          : '0';
      }
    },
    {
      headerName: 'SALE RETURN',
      field: 'salesReturnAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['salesReturnAmount']
          ? parseFloat(params['data']['salesReturnAmount']).toFixed(2)
          : '0';
      },
      width: 100,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SALE</p>
            <p>RETURN</p>
          </div>
        );
      }
    },
    {
      headerName: 'PURCHASE',
      field: 'purchaseAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['purchaseAmount']
          ? parseFloat(params['data']['purchaseAmount']).toFixed(2)
          : '0';
      }
    },
    {
      headerName: 'PURCHASE RETURN',
      field: 'purchaseReturnAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['purchaseReturnAmount']
          ? parseFloat(params['data']['purchaseReturnAmount']).toFixed(2)
          : '0';
      },
      width: 100,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASE</p>
            <p>RETURN</p>
          </div>
        );
      }
    },

    {
      headerName: 'INPUT TAX',
      field: 'taxIn',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['taxIn']
          ? parseFloat(params['data']['taxIn']).toFixed(2)
          : '0';
      },
      width: 100,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INPUT</p>
            <p>TAX</p>
          </div>
        );
      }
    },
    {
      headerName: 'OUTPUT TAX',
      field: 'taxOut',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['taxOut']
          ? parseFloat(params['data']['taxOut']).toFixed(2)
          : '0';
      },
      width: 100,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>OUTPUT</p>
            <p>TAX</p>
          </div>
        );
      }
    },
    {
      headerName: 'TOTAL PROFIT/LOSS',
      field: 'profitOrLoss',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['profitOrLoss']
          ? parseFloat(params['data']['profitOrLoss']).toFixed(2)
          : '0';
      },
      width: 100,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>PROFIT/LOSS</p>
          </div>
        );
      },
      cellStyle: statusCellStyle
    }
  ]);

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  // const onFirstPageClicked = () => {
  //   if (gridApi) {
  //     setCurrentPage(1);
  //     setOnChange(true);
  //   }
  // };

  // const onLastPageClicked = () => {
  //   if (gridApi) {
  //     setCurrentPage(totalPages);
  //     setOnChange(true);
  //   }
  // };

  // const onPreviousPageClicked = () => {
  //   if (gridApi) {
  //     if (currentPage > 1) {
  //       setCurrentPage(currentPage - 1);
  //       setOnChange(true);
  //     }
  //   }
  // };

  // const onNextPageClicked = () => {
  //   if (gridApi) {
  //     if (currentPage < totalPages) {
  //       setCurrentPage(currentPage + 1);
  //       setOnChange(true);
  //     }
  //   }
  // };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromProfitLossByItemReport = () => {
    const wb = new Workbook();

    let data = [];
    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        const record = {
          NAME: rowData[i].productName,
          SALE: rowData[i].saleAmount,
          'SALE RETURN': rowData[i].salesReturnAmount,
          PURCHASE: rowData[i].purchaseAmount,
          'PURCHASE RETURN': rowData[i].purchaseReturnAmount,
          'INPUT TAX': rowData[i].taxIn,
          'OUTPUT TAX': rowData[i].taxOut,
          'TOTAL PROFIT/LOSS': rowData[i].profitOrLoss
        };
        data.push(record);
      }
    } else {
      const record = {
        NAME: '',
        SALE: '',
        'SALE RETURN': '',
        PURCHASE: '',
        'PURCHASE RETURN': '',
        'INPUT TAX': '',
        'OUTPUT TAX': '',
        'TOTAL PROFIT/LOSS': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Profit Loss Report Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Profit Loss Report Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Profit_Loss_By_Item_Report';

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

  const handleChange = (event) => {
    console.log('event', event);
    setCategory(event.displayName);

    setCategoryLevel2(event.name);
    getBusinessLevel3Categorieslist(event.name);
  };

  const handleChangeSubCategory = async (event) => {
    console.log(event);
    setSubCategory(event.displayName);

    setCategoryLevel3(event.name);

    setOnChange(true);
  };

  const resetCategory = async () => {
    setCategory([]);
    setSubCategory([]);
    resetData();
    getBusinessLevel2Categorieslist();
    const db = await Db.get();
    if (productId.length > 1) {
      setRowData(
        await getProfitAndLossReportByProduct(db, productId, fromDate, toDate)
      );
    } else {
      setRowData([]);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    setproductlist([]);
    resetData();
    getBusinessLevel2Categorieslist();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('P&L Report')) {
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

  const handleProductClick = async (product) => {
    setProductName(product.name);
    setProductId(product.productId);
    setSelectedProduct(product);
    setProductNameWhileEditing('');
    setproductlist([]);
    setOnChange(true);
  };

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange && fromDate && toDate) {
        setOnChange(false);
        const db = await Db.get();

        if (productId.length > 1) {
          setRowData(
            await getProfitAndLossReportByProduct(
              db,
              productId,
              fromDate,
              toDate
            )
          );
        } else if (category.length !== 0 && subCategory.length !== 0) {
          setRowData(
            await getProfitAndLossReportByCategory(
              db,
              categoryLevel2,
              categoryLevel3,
              fromDate,
              toDate
            )
          );
        } else {
          setRowData([]);
        }
      }
    };

    loadPaginationData();
  }, [
    category,
    categoryLevel2,
    categoryLevel3,
    fromDate,
    onChange,
    productId,
    subCategory,
    toDate
  ]);

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 40,
    minWidth: 150,
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
                    PROFIT AND LOSS - PRODUCT
                  </Typography>
                </div>
              </div>

              <div>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
                  <Grid item xs={7}>
                    <div>
                      <form className={classes.blockLine} noValidate>
                        <TextField
                          id="date"
                          label="From"
                          type="date"
                          value={fromDate}
                          onChange={(e) => {
                            setFromDate(formatDate(e.target.value));
                            setOnChange(true);
                          }}
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
                          onChange={(e) => {
                            setToDate(formatDate(e.target.value));
                            setOnChange(true);
                          }}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </form>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    style={{ marginTop: '16px', marginLeft: '-10%' }}
                  >
                    <div className={classes.selectOption}>
                      <div>
                        <TextField
                          fullWidth
                          className={classes.input}
                          placeholder="Select Product"
                          value={
                            productName === ''
                              ? productNameWhileEditing
                              : productName
                          }
                          InputProps={{
                            disableUnderline: true,
                            classes: {
                              root: classes.bootstrapRoot,
                              input: classes.bootstrapInput
                            }
                          }}
                          InputLabelProps={{
                            shrink: true,
                            className: classes.bootstrapFormLabel
                          }}
                          onChange={(e) => {
                            if (e.target.value !== productNameWhileEditing) {
                              setProductName('');
                              setProductId('');
                              setSelectedProduct();
                              setOnChange(true);
                            }

                            setProductNameWhileEditing(e.target.value);
                            getProductList(e.target.value);
                          }}
                        />{' '}
                        {productlist.length > 0 ? (
                          <div>
                            <ul
                              className={classes.listbox}
                              style={{ width: '25%' }}
                            >
                              {productlist.map((option, index) => (
                                <li
                                  style={{ padding: 10, cursor: 'pointer' }}
                                  onClick={() => {
                                    handleProductClick(option);
                                  }}
                                >
                                  <Grid
                                    container
                                    // justify="space-between"
                                    style={{ display: 'flex' }}
                                    className={classes.listitemGroup}
                                  >
                                    <Grid item xs={12}>
                                      <p>{option.name}</p>
                                    </Grid>
                                  </Grid>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Grid>

                  <Grid item xs={2} style={{ marginTop: '15px' }}>
                    {/* <FormControlLabel
                      control={<Checkbox />}
                      label="Show Only Products Sold"
                    /> */}
                  </Grid>

                  <Grid item xs={10}>
                    <div className={classes.selectOption}>
                      <FormControl
                        required
                        className={clsx(classes.formControl, classes.noLabel)}
                      >
                        <Select
                          displayEmpty
                          value={category}
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
                              name={c.name}
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
                    <div>
                      <Button
                        className={classes.resetbtn}
                        size="small"
                        onClick={resetCategory}
                        color="secondary"
                      >
                        Reset
                      </Button>
                    </div>
                  </Grid>
                  <Grid
                    xs={2}
                    style={{ marginBottom: 'auto', marginTop: 'auto' }}
                  >
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton
                          onClick={() => getDataFromProfitLossByItemReport()}
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
              </div>

              <div className={classes.itemTable}>
                {/* <App />  */}

                <Box mt={2}>
                  <div
                    style={{
                      width: '100%',
                      height: height - 260 + 'px'
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
                        // suppressPaginationPanel={true}
                        // suppressScrollOnNewData={true}
                        // overlayLoadingTemplate={
                        //   '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                        // }
                        // overlayNoRowsTemplate={
                        //   '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                        // }
                      />
                      {/* <div
                        style={{
                          display: 'flex',
                          float: 'right',
                          marginTop: '2px'
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
                      </div> */}
                    </div>
                  </div>
                </Box>
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};

export default InjectObserver(ProfitLossByItem);
