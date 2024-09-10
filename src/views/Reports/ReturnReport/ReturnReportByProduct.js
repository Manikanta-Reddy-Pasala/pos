import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../Expenses/ExpenseTable.css';
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
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { toJS } from 'mobx';
import Excel from '../../../icons/Excel';
import XLSX from 'xlsx';
import * as Db from '../../../RxDb/Database/Database';
import NoPermission from '../../noPermission';
import * as Bd from '../../../components/SelectedBusiness';
import BubbleLoader from '../../../components/loader';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import useWindowDimensions from '../../../components/windowDimension';
import {
  getSaleReturnTxnByCategory,
  getReturnTxnByProduct,
  getReturnTxn
} from 'src/components/Helpers/ProductTxnQueryHelper';
import left_arrow from '../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../icons/svg/last_page_arrow.svg';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
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
  }
}));

const RetrunReportbyProduct = () => {
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
  const [category, setCategory] = React.useState([]);
  const [subCategory, setSubCategory] = React.useState([]);
  const [level2Category, setLevel2Category] = React.useState([]);
  const [level3Category, setLevel3Category] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = useState();
  const [productName, setProductName] = React.useState();
  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const { level2CategoriesList, level3CategoriesList } = toJS(
    store.ReportsStore
  );
  const {
    getBusinessLevel2Categorieslist,
    getBusinessLevel3Categorieslist,
    resetData
  } = store.ReportsStore;

  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleEditProductModalLaunchFromReports } = store.ProductStore;

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

  const [columnDefs] = useState([
    {
      headerName: 'PRODUCT NAME',
      field: 'productName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 110,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PRODUCT</p>
            <p>NAME</p>
          </div>
        );
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'SALES RETURN QTY',
      field: 'saleQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 110,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SALES</p>
            <p>RETURN QTY</p>
          </div>
        );
      }
    },
    {
      headerName: 'SALES RETURN AMOUNT',
      field: 'saleAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 110,
      minWidth: 120,
      valueFormatter: (params) => {
        return params['data']['saleAmount']
          ? parseFloat(params['data']['saleAmount']).toFixed(2)
          : '0';
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SALES</p>
            <p>RETURN AMOUNT</p>
          </div>
        );
      }
    },
    {
      headerName: 'PURCHASE RETURN QTY',
      field: 'purchaseQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 110,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASE</p>
            <p>RETURN QTY</p>
          </div>
        );
      }
    },
    {
      headerName: 'PURCHASE RETURN AMOUNT',
      field: 'purchaseAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 110,
      minWidth: 120,
      valueFormatter: (params) => {
        return params['data']['purchaseAmount']
          ? parseFloat(params['data']['purchaseAmount']).toFixed(2)
          : '0';
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PURCHASE</p>
            <p>RETURN AMOUNT</p>
          </div>
        );
      }
    }
  ]);

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

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromSalesByItemReport = () => {
    const wb = new Workbook();

    let data = [];

    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        const record = {
          'PRODUCT NAME': rowData[i].productName,
          'CUSTOMER NAME': rowData[i].customerName,
          'SALES RETURN QTY': rowData[i].saleQty,
          'SALES RETURN AMOUNT': rowData[i].saleAmount,
          'VENDOR NAME': rowData[i].vendorName,
          'PURCHASE RETURN QTY': rowData[i].purchaseQty,
          'PURCHASE RETURN AMOUNT': rowData[i].purchaseAmount
        };
        data.push(record);
      }
    } else {
      const record = {
        'PRODUCT NAME': '',
        'CUSTOMER NAME': '',
        'SALES RETURN AMOUNT': '',
        'VENDOR NAME': '',
        'PURCHASE RETURN QTY': '',
        'PURCHASE RETURN AMOUNT': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Product Return Report Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Product Return Report Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Return_By_Product_Report';

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
    setProductNameWhileEditing('');
    setProductName('');
    setproductlist([]);
    setCategory(event.displayName);
    setLevel2Category(event);
    getBusinessLevel3Categorieslist(event.name);
  };

  const handleChangeSubCategory = async (event) => {
    console.log(event);
    setSubCategory(event.displayName);
    setLevel3Category(event);

    const db = await Db.get();

    setRowData(
      await getSaleReturnTxnByCategory(
        db,
        level2Category.name,
        event.name,
        fromDate,
        toDate
      )
    );
  };

  const resetCategory = async () => {
    if (level3Category.name) {
      setRowData([]);
    }

    setLevel2Category({});
    setLevel3Category({});

    setCategory([]);
    setSubCategory([]);
    setproductlist([]);
    resetData();
    getBusinessLevel2Categorieslist();
    const db = await Db.get();

    if (selectedProduct && selectedProduct.productId) {
      setRowData(
        await getReturnTxnByProduct(
          db,
          selectedProduct.productId,
          fromDate,
          toDate
        )
      );
    } else {
      setRowData(await getReturnTxn(db, fromDate, toDate));
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

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    } else {
      setRowData(rowData);
    }
  }, [rowData]);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Returns Report')) {
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

  const handleProductClick = async (option) => {
    setProductName(option.name);
    setSelectedProduct(option);
    setProductNameWhileEditing('');
    setproductlist([]);

    const db = await Db.get();

    setRowData(
      await getReturnTxnByProduct(db, option.productId, fromDate, toDate)
    );
    setproductlist([]);
  };

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  async function fetchData() {
    const db = await Db.get();

    if (level2Category.name && level3Category.name) {
      setRowData(
        await getSaleReturnTxnByCategory(
          db,
          level2Category.name,
          level3Category.name,
          fromDate,
          toDate
        )
      );
    } else {
      if (selectedProduct && selectedProduct.productId) {
        setRowData(
          await getReturnTxnByProduct(
            db,
            selectedProduct.productId,
            fromDate,
            toDate
          )
        );
      } else {
        setRowData(await getReturnTxn(db, fromDate, toDate));
      }
    }
  }

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

  function convertPXToVW(px) {
    const result = px * (100 / document.documentElement.clientWidth) + 20;
    return result + 'vh';
  }

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
                    RETURN - PRODUCT
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
                  <Grid
                    item
                    xs={3}
                    style={{ marginTop: 'auto', marginLeft: '-10%' }}
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
                              setSelectedProduct();
                            }

                            setProductNameWhileEditing(e.target.value);
                            getProductList(e.target.value);

                            if (e.target.value.length === 0) {
                              fetchData();
                            }
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
                  <Grid
                    item
                    xs={2}
                    style={{ marginTop: 'auto', marginLeft: '10%' }}
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
                          onClick={() => getDataFromSalesByItemReport()}
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

              <Grid item xs={12}>
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
                    Reset Categories
                  </Button>
                </div>
              </Grid>

              <div className={classes.itemTable}>
                {/* <App />  */}

                <Box mt={2}>
                  <div
                    style={{
                      width: '100%',
                      height: height - 265 + 'px'
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
                        headerHeight={50}
                        suppressPaginationPanel={true}
                        suppressScrollOnNewData={true}
                        onCellClicked={handleCellClicked}
                        overlayLoadingTemplate={
                          '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                        }
                        overlayNoRowsTemplate={
                          '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
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
                </Box>
              </div>
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

export default InjectObserver(RetrunReportbyProduct);