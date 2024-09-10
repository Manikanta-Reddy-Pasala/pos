import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
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
import TextField from '@material-ui/core/TextField';
import { AgGridReact } from 'ag-grid-react';
import MenuItem from '@material-ui/core/MenuItem';
import clsx from 'clsx';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import left_arrow from '../../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../../icons/svg/last_page_arrow.svg';
import * as Db from '../../../../RxDb/Database/Database';
import ProductModal from 'src/components/modal/ProductModal';
import TransactionByItemV2 from '../TransactionByItem/TransactionByItemV2';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getStockDataForAllProducts } from '../../../../components/Helpers/StockDataHelper';

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
    padding: '3px 6px 3px 6px',
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
    color: '#339900',
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
  resetbtn: {
    margin: 20,
    padding: 6
  },
  tableStyle: {
    borderCollapse: 'collapse',
    width: '100%'
  },
  tableStylewithBorder: {
    border: '1px solid black'
  },
  borderRight: {
    borderRight: '1px solid black'
  },

  borderBottom: {
    borderBottom: '1px solid black'
  },
  pad: {
    padding: '5px 5px 5px 5px',
    textAlign: 'center'
  },
  padCenter: {
    padding: '10px'
  },
  numberCls: {
    textAlign: 'center'
  },
  rowCls: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#F7F8FA',
      color: '#ef5350'
    }
  },
  listbox: {
    width: '100%',
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
  }
}));

const StockSummaryV2 = () => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const { height } = useWindowDimensions();
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [category, setCategory] = React.useState([]);
  const [categoryLevel3, setCategoryLevel3] = React.useState('');
  const [subCategory, setSubCategory] = React.useState([]);
  const [rowData, setRowData] = React.useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(true);
  const [productData, setProductData] = useState(false);
  const [productName, setProductName] = React.useState('');
  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [categoryLevel2, setCategoryLevel2] = React.useState('');
  let openingValue = 0;
  let inwardValue = 0;
  let inwardPrice = 0;
  let value = 0;
  let consumption = 0;
  let grossPft = 0;
  let grossPftPerc = 0;
  let totOpeningQty = 0;
  let totInwardQty = 0;
  let totOutwardQty = 0;
  let totOpeningValue = 0;
  let totInwardValue = 0;
  let totValue = 0;
  let totgrossPft = 0;
  let totGrossPftPerc = 0;
  let totClosingQty = 0;
  let totCloseValue = 0;
  let inwardsOpeningTotal = 0;
  let inwardsOpeningQty = 0;
  let consumptionPrice = 0;
  let consumptionTotal = 0;
  let closingTotal = 0;

  const [totals, setTotals] = useState({
    totOpeningQty: 0,
    totOpeningValue: 0,
    totInwardQty: 0,
    totInwardValue: 0,
    totOutwardQty: 0,
    totValue: 0,
    totConsumption: 0,
    totGrossPft: 0,
    totGrossPftPerc: 0,
    totClosingQty: 0,
    totCloseValue: 0
  });

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

  const [limit] = useState(10);

  let [allProductData, setAllProductData] = useState({});

  const store = useStore();
  const {
    level2CategoriesList,
    level3CategoriesList,
    openTransactionByProduct,
    selectedStockProduct
  } = toJS(store.ReportsStore);
  const {
    getBusinessLevel2Categorieslist,
    getBusinessLevel3Categorieslist,
    handleOpenTransactionByProduct,
    updateSelectedStockProduct,
    resetData
  } = store.ReportsStore;

  const [warehouse, setWarehouse] = React.useState('');
  const [warehouseList, setWarehouseList] = React.useState([]);

  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleEditProductModalLaunchFromReports } = store.ProductStore;

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = async (item) => {
    updateSelectedStockProduct(item);
    handleOpenTransactionByProduct(true);
  };

  const { getWarehouse } = store.WarehouseStore;

  useEffect(() => {
    async function fetchData() {
      setWarehouseList(await getWarehouse());
    }

    fetchData();
  }, []);

  const onFirstPageClicked = () => {
    // if (gridApi) {
    setCurrentPage(1);
    setOnChange(true);
    // }
  };

  const onLastPageClicked = () => {
    // if (gridApi) {
    setCurrentPage(totalPages);
    setOnChange(true);
    // }
  };

  const onPreviousPageClicked = () => {
    // if (gridApi) {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setOnChange(true);
    }
    // }
  };

  const onNextPageClicked = () => {
    // if (gridApi) {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setOnChange(true);
    }
    // }
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromStockSummary = async () => {
    const wb = new Workbook();

    let xlsxStockData = [];

    if (categoryLevel3) {
      xlsxStockData = await getAllStockSummaryByCategoryXlsx(categoryLevel3);
    } else {
      xlsxStockData = await getAllStockSummaryDataXlsx();
    }

    let data = [];
    if (xlsxStockData && xlsxStockData.length > 0) {
      var totalStockQty = 0;
      var totalStockPurchase = 0;
      var totalNetWeight = 0;

      let record;
      for (var i = 0; i < xlsxStockData.length; i++) {
        if (
          String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
        ) {
          record = {
            '#': i + 1,
            'Product Name': xlsxStockData[i].name,
            Hsn: xlsxStockData[i].hsn,
            'Sale Price': xlsxStockData[i].salePrice,
            'Purchase Price': xlsxStockData[i].purchasedPrice,
            'Stock Qty': xlsxStockData[i].stockQty,
            'Stock Value':
              parseFloat(xlsxStockData[i].stockQty) *
              parseFloat(xlsxStockData[i].purchasedPrice),
            'Total Net Weight': parseFloat(
              parseFloat(xlsxStockData[i].netWeight) *
              parseFloat(xlsxStockData[i].stockQty)
            ).toFixed(3)
          };
        } else {
          record = {
            '#': i + 1,
            'Product Name': xlsxStockData[i].name,
            Hsn: xlsxStockData[i].hsn,
            'Sale Price': xlsxStockData[i].salePrice,
            'Purchase Price': xlsxStockData[i].purchasedPrice,
            'Stock Qty': xlsxStockData[i].stockQty,
            'Stock Value':
              parseFloat(xlsxStockData[i].stockQty) *
              parseFloat(xlsxStockData[i].purchasedPrice)
          };
        }

        totalStockQty += xlsxStockData[i].stockQty;
        totalStockPurchase +=
          parseFloat(xlsxStockData[i].stockQty || 0) *
          parseFloat(xlsxStockData[i].purchasedPrice || 0);
        totalNetWeight += parseFloat(
          parseFloat(xlsxStockData[i].netWeight || 0) *
          parseFloat(xlsxStockData[i].stockQty || 0) || 0
        ).toFixed(3);
        data.push(record);
      }

      const emptyRecord = {};
      data.push(emptyRecord);
      data.push(emptyRecord);
      let totalRecord;
      if (
        String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
      ) {
        totalRecord = {
          '#': 'Total',
          'Product Name': '',
          Hsn: '',
          'Sale Price': '',
          'Purchase Price': '',
          'Stock Qty': totalStockQty,
          'Stock Value': totalStockPurchase,
          'Net Weight': totalNetWeight
        };
      } else {
        totalRecord = {
          '#': 'Total',
          'Product Name': '',
          Hsn: '',
          'Sale Price': '',
          'Purchase Price': '',
          'Stock Qty': totalStockQty,
          'Stock Value': totalStockPurchase
        };
      }
      data.push(totalRecord);
    } else {
      let record;
      if (
        String(localStorage.getItem('isJewellery')).toLowerCase() === 'true'
      ) {
        record = {
          '#': '',
          'Product Name': '',
          'Sale Price': '',
          'Purchase Price': '',
          'Stock Qty': '',
          'Stock Value': '',
          'Net Weight': ''
        };
      } else {
        record = {
          '#': '',
          'Product Name': '',
          'Sale Price': '',
          'Purchase Price': '',
          'Stock Qty': '',
          'Stock Value': ''
        };
      }
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Stock Summary Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Stock Summary Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Stock_Summary_Report';

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
    console.log(event);
    setCategory(event.displayName);
    getBusinessLevel3Categorieslist(event.name);
  };

  const handleChangeSubCategory = (event) => {
    setSubCategory(event.displayName);
    getStockSummaryByCategory(event.name);
    setCategoryLevel3(event.name);
  };

  const resetCategory = (event) => {
    setCategory([]);
    setSubCategory([]);
    resetData();
    setRowData([]);
    getBusinessLevel2Categorieslist();
    getStockSummaryData(warehouse);
  };

  const getFloatWithTwoDecimal = (val) => {
    return parseFloat(val).toFixed(2);
  };

  const getStockSummaryByCategory = async (level3Category, warehouse) => {
    setRowData(
      await getStockDataForAllProducts(
        fromDate,
        toDate,
        warehouse,
        selectedProduct ? selectedProduct.productId : '',
        categoryLevel2,
        level3Category
      )
    );
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
    resetData();
    getBusinessLevel2Categorieslist();
    setTimeout(() => setLoadingShown(false), 200);
  }, [getBusinessLevel2Categorieslist, resetData]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        if (categoryLevel3.length > 1) {
          await getStockSummaryByCategory(categoryLevel3, warehouse);
        } else {
          await getStockSummaryData(warehouse);
        }
        setOnChange(false);
      }
    };

    loadPaginationData();
  }, [onChange]);

  const getStockSummaryDataByWarehouse = async (warehouse) => {
    if (categoryLevel3.length > 1) {
      await getStockSummaryByCategory(categoryLevel3, warehouse);
    } else {
      await getStockSummaryData(warehouse);
    }
  };

  const getStockSummaryData = async (warehouse) => {
    let skip = 0;
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      // getAllCustomerData();
    }
    const allData = await getStockDataForAllProducts(
      fromDate,
      toDate,
      warehouse,
      selectedProduct ? selectedProduct.productId : '',
      categoryLevel2,
      categoryLevel3
    );
    setRowData(
      allData
    );

    let count = 0;
    let overallInwardValue = 0;
    let overallOpeningValue = 0;
    let overallInwardsOpeningTotal = 0;
    let overallInwardsOpeningQty = 0;
    let overallConsumptionPrice = 0;
    let overallConsumptionTotal = 0;

    allData.map((item) => {
      totOpeningQty += item.openingQty;
      totOpeningValue += parseFloat(item.openingQty * item.openingStockPurchasedPrice);
      totInwardQty += item.qtyIn;
      overallInwardValue = item.amountIn;
      totInwardValue += overallInwardValue;
      totOutwardQty +=item.qtyOut;
      totValue +=item.salesAmount;

      overallInwardsOpeningTotal = parseFloat(item.openingQty * item.openingStockPurchasedPrice) + parseFloat(overallInwardValue);
      overallInwardsOpeningQty = item.openingQty + item.qtyIn;

      overallConsumptionPrice =overallInwardsOpeningQty > 0 ? parseFloat(overallInwardsOpeningTotal) / parseFloat(overallInwardsOpeningQty) : 0;
      overallConsumptionTotal += (parseFloat(overallConsumptionPrice) * parseFloat(item.qtyOut))  || 0;
      
      // console.log("rai",overallInwardsOpeningQty);
      totgrossPft += parseFloat(item.salesAmount - (parseFloat(overallConsumptionPrice) * parseFloat(item.qtyOut))  || 0);
      totGrossPftPerc += Math.abs(calculateGrossProfitPerc(value, consumption));
      totClosingQty += overallConsumptionPrice > 0 ? overallConsumptionPrice : 0;
      totCloseValue += parseFloat(item.closingQty * item.salePrice);
    });

    setTotals({
      totOpeningQty: totOpeningQty,
      totOpeningValue: totOpeningValue,
      totInwardQty: totInwardQty,
      totInwardValue: totInwardValue,
      totOutwardQty: totOutwardQty,
      totValue: totValue,
      totConsumption: overallConsumptionTotal,
      totGrossPft: totgrossPft,
      totGrossPftPerc: totGrossPftPerc,
      totClosingQty: totClosingQty,
      totCloseValue: totCloseValue
    });
  };

  const getAllStockSummaryByCategoryXlsx = async (level3Category) => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { 'categoryLevel3.name': { $eq: level3Category } },
            { warehouseData: { $eq: warehouse } }
          ]
        }
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { 'categoryLevel3.name': { $eq: level3Category } }
          ]
        }
      });
    }

    let response = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      response = data.map((item) => item);
    });
    return response;
  };

  const getAllStockSummaryDataXlsx = async () => {
    const db = await Db.get();
    var Query;

    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { warehouseData: { $eq: warehouse } }
          ]
        }
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          businessId: { $eq: businessData.businessId }
        }
      });
    }

    let response = [];
    await Query.exec().then((data) => {
      if (!data) {
        return;
      }

      response = data.map((item) => item);
      console.log(response);
    });
    return response;
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

  useEffect(() => {
    setRowData(productData);
  }, [productData]);

  const handleProductClick = async (option) => {
    setProductName(option.name);
    setSelectedProduct(option);
    setProductNameWhileEditing('');

    setRowData(
      await getStockDataForAllProducts(
        fromDate,
        toDate,
        warehouse,
        option.productId,
        categoryLevel2,
        categoryLevel3
      )
    );

    setproductlist([]);
  };

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  const fetchDataOnProductRemoval = async () => {
    setRowData(
      await getStockDataForAllProducts(
        fromDate,
        toDate,
        warehouse,
        selectedProduct ? selectedProduct.productId : '',
        categoryLevel2,
        categoryLevel3
      )
    );
  };

  const calculateGrossProfitPerc = (num1, num2) => {
    if (num1 === 0) return 0; // Avoid division by zero
    return (((num2 - num1) / num1) * 100).toFixed(2);
  };

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && !openTransactionByProduct && (
        <div className={classes.root} style={{ minHeight: height - 83 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 83 }}>
              <div className={classes.content}>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
                  <Grid item xs={4}>
                    <Typography gutterBottom variant="h4" component="h4">
                      STOCK SUMMARY
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <div className={classes.selectOption}>
                      <TextField
                        fullWidth
                        variant={'outlined'}
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
                        onChange={async (e) => {
                          if (e.target.value !== productNameWhileEditing) {
                            setProductName('');
                            setSelectedProduct({});
                          }

                          setProductNameWhileEditing(e.target.value);
                          if (e.target.value !== '') {
                            getProductList(e.target.value);
                          } else {
                            setproductlist([]);
                            fetchDataOnProductRemoval();
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
                  </Grid>
                  <Grid item xs={2}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justify="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton onClick={() => getDataFromStockSummary()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                    </Grid>
                  </Grid>
                </Grid>
              </div>

              <div>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
                  <Grid item xs={12}>
                    <div
                      className={classes.selectOption}
                      style={{ margin: '0 0 0 8px' }}
                    >
                      <TextField
                        id="date"
                        label="From"
                        type="date"
                        className={classes.textField}
                        value={fromDate}
                        onChange={(e) =>
                          setFromDate(formatDate(e.target.value))
                        }
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </div>
                    <div
                      className={classes.selectOption}
                      style={{ margin: '0 0 0 8px' }}
                    >
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
                    </div>

                    <div
                      className={classes.selectOption}
                      style={{ margin: '0 0 0 -2px' }}
                    >
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
                    <div
                      className={classes.selectOption}
                      style={{ margin: '0 0 0 -2px' }}
                    >
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
                        Reset
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
                                getStockSummaryDataByWarehouse(e.target.value);
                              } else {
                                setWarehouse('');
                                getStockSummaryDataByWarehouse('');
                              }
                            }}
                          >
                            <MenuItem value={'Select'}>
                              {'Select Warehouse'}
                            </MenuItem>

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
                      height: height - 325 + 'px'
                    }}
                    className=" blue-theme"
                  >
                    <div
                      id="product-list-grid"
                      style={{ height: '100%', width: '100%' }}
                      className="ag-theme-material"
                    >
                      <table className={classes.tableStyle}>
                        <thead className={classes.tableStylewithBorder}>
                          <tr>
                            <th
                              rowSpan="3"
                              className={[
                                classes.padCenter,
                                classes.borderRight,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Particulars
                            </th>
                            <th
                              colSpan="3"
                              className={[
                                classes.padCenter,
                                classes.borderRight
                              ].join(' ')}
                            >
                              Opening
                            </th>
                            <th
                              colSpan="3"
                              className={[
                                classes.padCenter,
                                classes.borderRight
                              ].join(' ')}
                            >
                              Inwards
                            </th>
                            <th
                              colSpan="6"
                              className={[
                                classes.padCenter,
                                classes.borderRight
                              ].join(' ')}
                            >
                              Outwards
                            </th>
                            <th className={[classes.padCenter].join(' ')}>
                              Closing
                            </th>
                          </tr>
                          <tr>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Qty
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Avg Rate
                            </th>
                            {String(
                              localStorage.getItem('isJewellery')
                            ).toLowerCase() === 'true' && (
                                <th className={classes.numberCls}>Net Wt</th>
                              )}
                            <th
                              className={[
                                classes.pad,
                                classes.borderRight,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Value
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Qty
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Avg Rate
                            </th>
                            {String(
                              localStorage.getItem('isJewellery')
                            ).toLowerCase() === 'true' && (
                                <th className={classes.numberCls}>Net Wt</th>
                              )}
                            <th
                              className={[
                                classes.pad,
                                classes.borderRight,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Value
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Qty
                            </th>
                            {String(
                              localStorage.getItem('isJewellery')
                            ).toLowerCase() === 'true' && (
                                <th className={classes.numberCls}>Net Wt</th>
                              )}
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Avg Rate
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Value
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Consumption
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Gross Profit
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderRight,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Perc %
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Qty
                            </th>
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Avg Rate
                            </th>
                            {String(
                              localStorage.getItem('isJewellery')
                            ).toLowerCase() === 'true' && (
                                <th className={classes.numberCls}>Net Wt</th>
                              )}
                            <th
                              className={[
                                classes.pad,
                                classes.borderBottom
                              ].join(' ')}
                            >
                              Value
                            </th>
                          </tr>
                        </thead>
                        <tbody className={classes.tableStylewithBorder}>
                          {rowData && rowData.map((item) => {
                            openingValue = parseFloat(
                              item.openingQty * item.openingStockPurchasedPrice
                            );
                            inwardPrice = parseFloat(
                              item.amountIn && item.qtyIn
                                ? (item.amountIn / item.qtyIn).toFixed(2)
                                : 0
                            );
                            inwardValue = parseFloat(item.amountIn).toFixed(2);
                            value = parseFloat(
                              item.openingQty * item.salePrice
                            );
                            inwardsOpeningTotal =
                              parseFloat(openingValue) +
                              parseFloat(inwardValue);
                            inwardsOpeningQty =
                              parseFloat(item.openingQty) +
                              parseFloat(item.qtyIn);
                            consumptionPrice =
                            inwardsOpeningQty >0 ? parseFloat(inwardsOpeningTotal) /
                              parseFloat(inwardsOpeningQty) : 0;
                            consumptionTotal =
                              inwardsOpeningQty >0 ?(parseFloat(consumptionPrice) *
                                parseFloat(item.qtyOut)) || 0 : 0.00;
                            grossPft = parseFloat(
                              item.salesAmount - consumptionTotal
                            ).toFixed(2);
                            grossPftPerc = calculateGrossProfitPerc(
                              consumptionTotal,
                              item.salesAmount
                            );
                            closingTotal =
                              parseFloat(consumptionPrice) *
                              parseFloat(item.closingQty);

                            return (
                              <tr
                                onClick={() => handleCellClicked(item)}
                                className={classes.rowCls}
                              >
                                <td style={{ padding: '5px' }}>
                                  {item.productName}
                                </td>
                                <td className={classes.numberCls}>
                                  {item.openingQty}
                                </td>
                                <td className={classes.numberCls}>
                                  {item.openingPurchaseQty > 0 ? parseFloat(item.openingPurchasePrice/item.openingPurchaseQty).toFixed(2) : 0}
                                </td>
                                {String(
                                  localStorage.getItem('isJewellery')
                                ).toLowerCase() === 'true' && (
                                  <td className={classes.numberCls}>
                                    {item.netWeight}
                                  </td>
                                )}
                                <td className={classes.numberCls}>
                                  {item.openingPurchaseQty > 0 ? parseFloat((item.openingPurchasePrice/item.openingPurchaseQty) * item.openingQty).toFixed(2) : 0}
                                </td>
                                <td className={classes.numberCls}>
                                  {item.qtyIn}
                                </td>
                                <td className={classes.numberCls}>
                                  {inwardPrice}
                                </td>
                                {String(
                                  localStorage.getItem('isJewellery')
                                ).toLowerCase() === 'true' && (
                                    <td className={classes.numberCls}>
                                      {item.netWeight}
                                    </td>
                                  )}
                                <td className={classes.numberCls}>
                                  {inwardValue}
                                </td>
                                <td className={classes.numberCls}>
                                  {item.qtyOut}
                                </td>
                                {String(
                                  localStorage.getItem('isJewellery')
                                ).toLowerCase() === 'true' && (
                                    <td className={classes.numberCls}>
                                      {item.netWeight}
                                    </td>
                                  )}
                                <td className={classes.numberCls}>
                                  {item.salesAmount && item.qtyOut
                                    ? (item.salesAmount / item.qtyOut).toFixed(
                                      2
                                    )
                                    : 0}
                                </td>
                                <td className={classes.numberCls}>
                                  {item.salesAmount.toFixed(2)}
                                </td>
                                <td className={classes.numberCls}>
                                  {consumptionTotal.toFixed(2)}
                                </td>
                                <td className={classes.numberCls}>
                                  {grossPft}
                                </td>
                                <td className={classes.numberCls}>
                                  {grossPftPerc} %
                                </td>
                                <td className={classes.numberCls}>
                                  {parseFloat(item.closingQty)}
                                </td>
                                <td className={classes.numberCls}>
                                  {consumptionPrice.toFixed(2)}
                                </td>
                                {String(
                                  localStorage.getItem('isJewellery')
                                ).toLowerCase() === 'true' && (
                                    <td className={classes.numberCls}>
                                      {item.netWeight}
                                    </td>
                                  )}
                                <td className={classes.numberCls}>
                                  {closingTotal.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ fontWeight: 'bold' }}>
                            <td style={{ padding: '5px' }}>Total</td>
                            <td className={classes.numberCls}>
                              {totals.totOpeningQty}
                            </td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}>
                              {totals.totOpeningValue.toFixed(2)}
                            </td>
                            <td className={classes.numberCls}>
                              {totals.totInwardQty} pcs
                            </td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}>
                              {totals.totInwardValue}
                            </td>
                            <td className={classes.numberCls}>
                              {totals.totOutwardQty} pcs
                            </td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}>
                              {totals.totValue.toFixed(2)}
                            </td>
                            <td className={classes.numberCls}>
                              {totals.totConsumption.toFixed(2)}
                            </td>
                            <td className={classes.numberCls}>
                              {Math.abs(parseFloat(totals.totGrossPft)).toFixed(2)}
                            </td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}>
                              {totals.totClosingQty}
                            </td>
                            <td className={classes.numberCls}></td>
                            <td className={classes.numberCls}>
                              {totals.totCloseValue}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                      <div
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
                      </div>
                    </div>
                  </div>
                </Box>
              </div>

              <div className={classes.footer} style={{ display: 'none' }}>
                {String(localStorage.getItem('isJewellery')).toLowerCase() ===
                  'true' ? (
                  <div>
                    <Grid container>
                      <Grid item xs={6}>
                        <p>Total</p>
                      </Grid>
                      <Grid item xs={2} className={classes.totalQty}>
                        <p>
                          T.Qty:{' '}
                          {getFloatWithTwoDecimal(
                            allProductData.totalStockQty || 0
                          )}
                        </p>
                      </Grid>
                      <Grid item xs={2} className={classes.amount}>
                        <p>
                          T.Stk P.: &#8377;{' '}
                          {getFloatWithTwoDecimal(
                            allProductData.totalStockPurchase || 0
                          )}
                        </p>
                      </Grid>
                      <Grid item xs={2} className={classes.amount}>
                        <p>
                          {' '}
                          T.N. Wt:{' '}
                          {parseFloat(allProductData.totalNetWeight).toFixed(3)}
                        </p>
                      </Grid>
                    </Grid>
                  </div>
                ) : (
                  <div>
                    <Grid container>
                      <Grid item xs={8}>
                        <p>Total</p>
                      </Grid>
                      <Grid item xs={2} className={classes.totalQty}>
                        <p>
                          T. Qty:{' '}
                          {getFloatWithTwoDecimal(
                            allProductData.totalStockQty || 0
                          )}
                        </p>
                      </Grid>
                      <Grid item xs={2} className={classes.amount}>
                        <p>
                          T. Stk P.: &#8377;{' '}
                          {getFloatWithTwoDecimal(
                            allProductData.totalStockPurchase || 0
                          )}
                        </p>
                      </Grid>
                    </Grid>
                  </div>
                )}
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {productDialogOpen ? <ProductModal /> : null}
      {openTransactionByProduct ? <TransactionByItemV2 /> : null}
    </div>
  );
};

export default InjectObserver(StockSummaryV2);