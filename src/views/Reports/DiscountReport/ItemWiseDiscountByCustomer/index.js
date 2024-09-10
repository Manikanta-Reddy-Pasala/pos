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
import { getDiscountTxnForSales } from 'src/components/Helpers/ProductTxnQueryHelper';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getCustomerAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
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

const ItemWiseDiscountCustomer = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [rowData, setRowData] = useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [category, setCategory] = React.useState([]);
  const [subCategory, setSubCategory] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [productName, setProductName] = React.useState('');
  const [level2Category, setLevel2Category] = React.useState([]);
  const [level3Category, setLevel3Category] = React.useState([]);
  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [totalDiscountAmount, setTotalDiscountAmount] = useState(0);
  const [customerList, setcustomerList] = React.useState();
  const [customerName, setCustomerName] = React.useState('');
  const [customerId, setCustomerId] = React.useState('');

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
      headerName: 'NAME',
      field: 'productName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'CATEGORY',
      field: 'categoryLevel2DisplayName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100
    },
    {
      headerName: 'SUB CATEGORY',
      field: 'categoryLevel3DisplayName',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SUB</p>
            <p>CATEGORY</p>
          </div>
        );
      }
    },
    {
      headerName: 'SALE QTY',
      field: 'saleQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SALE</p>
            <p>QTY</p>
          </div>
        );
      }
    },
    {
      headerName: 'FREE QTY',
      field: 'freeQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>FREE</p>
            <p>QTY</p>
          </div>
        );
      }
    },
    {
      headerName: 'SALE AMOUNT',
      field: 'saleAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['saleAmount'] || 0).toFixed(2);
        return parseFloat(result).toFixed(2);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SALE</p>
            <p>AMOUNT</p>
          </div>
        );
      }
    },
    {
      headerName: 'DISCOUNT AMOUNT',
      field: 'discountAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = parseFloat(data['discountAmount'] || 0).toFixed(2);
        return parseFloat(result).toFixed(2);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>DISCOUNT</p>
            <p>AMOUNT</p>
          </div>
        );
      }
    },
    {
      headerName: 'DISCOUNT AMOUNT',
      field: 'discountAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        if (data['saleQty'] && data['saleQty'] > 0) {
          result = parseFloat(data['discountAmount'] || 0) / data['saleQty'];
        } else {
          result = parseFloat(data['discountAmount'] || 0);
        }
        return Number.isNaN(result) ? 0 : parseFloat(result).toFixed(2);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>AVG. DISCOUNT</p>
            <p>AMOUNT</p>
          </div>
        );
      }
    }
  ]);

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  const getCustomerList = async (value) => {
    setcustomerList(await getCustomerAutoCompleteList(value));
  };

  const calculateAggrigatedValues = async (txnData) => {
    let totalSalesAmount = 0;
    let totalDiscountAmount = 0;

    txnData.forEach((res) => {
      totalSalesAmount += res.saleAmount;
      totalDiscountAmount += res.discountAmount;
    });

    //set env variables
    setTotalSalesAmount(parseFloat(totalSalesAmount).toFixed(2) || 0);
    setTotalDiscountAmount(parseFloat(totalDiscountAmount).toFixed(2) || 0);
  };

  function getFilterArray() {
    let txnFilterArray = [];

    const saleTxnTypeFilter = {
      txnType: { $eq: 'Sales' }
    };
    txnFilterArray.push(saleTxnTypeFilter);

    const kotTxnTypeFilter = {
      txnType: { $eq: 'KOT' }
    };
    txnFilterArray.push(kotTxnTypeFilter);

    return txnFilterArray;
  }

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function getAvgDiscountData(data) {
    let result = 0;
    if (data['saleQty'] && data['saleQty'] > 0) {
      result = parseFloat(data['discountAmount'] || 0) / data['saleQty'];
    } else {
      result = parseFloat(data['discountAmount'] || 0);
    }
    return Number.isNaN(result) ? 0 : parseFloat(result).toFixed(2);
  }

  const getDataFromSalesByItemReport = () => {
    const wb = new Workbook();

    let data = [];

    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        const record = {
          NAME: rowData[i].productName,
          CATEGORY: rowData[i].categoryLevel2DisplayName,
          'SUB CATEGORY': rowData[i].categoryLevel3DisplayName,
          'SALE QTY': rowData[i].saleQty,
          'FREE QTY': rowData[i].freeQty,
          'SALE AMOUNT': parseFloat(rowData[i].saleAmount || 0).toFixed(2),
          'DISCOUNT AMOUNT': parseFloat(rowData[i].discountAmount || 0).toFixed(
            2
          ),
          'AVG. DISCOUNT AMOUNT': getAvgDiscountData(rowData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        NAME: '',
        CATEGORY: '',
        'SUB CATEGORY': '',
        'SALE QTY': '',
        'FREE QTY': '',
        'SALE AMOUNT': '',
        'DISCOUNT AMOUNT': '',
        'AVG. DISCOUNT AMOUNT': ''
      };
      data.push(record);
    }
    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Itemwise Discount Report Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Itemwise Discount Report Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Itemwise_Discount_Report';

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
    let txnData = await getDiscountTxnForSales(
      db,
      fromDate,
      toDate,
      selectedProduct && selectedProduct !== undefined
        ? selectedProduct.productId
        : '',
      customerId,
      level2Category.name,
      event.name,
      getFilterArray()
    );
    calculateAggrigatedValues(txnData);
    setRowData(txnData);
  };

  const resetCategory = async (event) => {
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
    let txnData = await getDiscountTxnForSales(
      db,
      fromDate,
      toDate,
      selectedProduct && selectedProduct !== undefined
        ? selectedProduct.productId
        : '',
      customerId,
      level2Category ? level2Category.name : '',
      level2Category ? level3Category.name : '',
      getFilterArray()
    );
    calculateAggrigatedValues(txnData);
    setRowData(txnData);
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      const db = await Db.get();
      let txnData = await getDiscountTxnForSales(
        db,
        fromDate,
        toDate,
        selectedProduct && selectedProduct !== undefined
          ? selectedProduct.productId
          : '',
        customerId,
        level2Category ? level2Category.name : '',
        level2Category ? level3Category.name : '',
        getFilterArray()
      );
      calculateAggrigatedValues(txnData);
      setRowData(txnData);
    }

    fetchData();
    setproductlist([]);
    resetData();
    getBusinessLevel2Categorieslist();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fromDate, toDate]);

  async function fetchData() {
    const db = await Db.get();

    let txnData = await getDiscountTxnForSales(
      db,
      fromDate,
      toDate,
      selectedProduct && selectedProduct !== undefined
        ? selectedProduct.productId
        : '',
      customerId,
      level2Category ? level2Category.name : '',
      level2Category ? level3Category.name : '',
      getFilterArray()
    );

    calculateAggrigatedValues(txnData);
    setRowData(txnData);
  }

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    } else {
      setRowData(rowData);
    }
  }, [rowData]);

  const handleProductClick = async (option) => {
    setProductName(option.name);
    setSelectedProduct(option);
    setProductNameWhileEditing('');

    const db = await Db.get();
    let txnData = await getDiscountTxnForSales(
      db,
      fromDate,
      toDate,
      option.productId,
      customerId,
      level2Category ? level2Category.name : '',
      level2Category ? level3Category.name : '',
      getFilterArray()
    );

    calculateAggrigatedValues(txnData);
    setRowData(txnData);
    setproductlist([]);
  };

  const getTransactionsForEmptyProduct = async () => {
    const db = await Db.get();
    let txnData = await getDiscountTxnForSales(
      db,
      fromDate,
      toDate,
      selectedProduct && selectedProduct !== undefined
        ? selectedProduct.productId
        : '',
      customerId,
      level2Category ? level2Category.name : '',
      level2Category ? level3Category.name : '',
      getFilterArray()
    );

    calculateAggrigatedValues(txnData);
    setRowData(txnData);
    setcustomerList([]);
  };

  const getTransactionsForEmptyCustomer = async () => {
    const db = await Db.get();
    let txnData = await getDiscountTxnForSales(
      db,
      fromDate,
      toDate,
      selectedProduct && selectedProduct !== undefined
        ? selectedProduct.productId
        : '',
      customerId,
      level2Category ? level2Category.name : '',
      level2Category ? level3Category.name : '',
      getFilterArray()
    );
    calculateAggrigatedValues(txnData);
    setRowData(txnData);
    setcustomerList([]);
  };

  const handleCustomerClick = async (customer) => {
    setCustomerName(customer.name);
    setCustomerId(customer.id);

    const db = await Db.get();
    let txnData = await getDiscountTxnForSales(
      db,
      fromDate,
      toDate,
      selectedProduct && selectedProduct !== undefined
        ? selectedProduct.productId
        : '',
      customer.id,
      level2Category ? level2Category.name : '',
      level2Category ? level3Category.name : '',
      getFilterArray()
    );

    calculateAggrigatedValues(txnData);
    setRowData(txnData);
    setcustomerList([]);
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Discount Report')) {
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
                    PRODUCT WISE DISCOUNT BY CUSTOMER
                  </Typography>
                </div>
              </div>

              <div>
                <Grid container className={classes.categoryActionWrapper}>
                  <Grid item xs={5}>
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
                    <div className={classes.blockLine}>
                      <div className={classes.nameList}>
                        <TextField
                          fullWidth
                          placeholder="Select Customer"
                          className={classes.input}
                          value={customerName}
                          onChange={(e) => {
                            if (e.target.value !== customerName) {
                              setCustomerName(e.target.value);
                              setCustomerId('');
                            }
                            getCustomerList(e.target.value);
                            if (e.target.value.length === 0) {
                              getTransactionsForEmptyCustomer();
                            }
                          }}
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
                        />
                        {customerList && customerList.length > 0 ? (
                          <>
                            <ul
                              className={classes.listbox}
                              style={{ width: '18%' }}
                            >
                              <li>
                                <Grid container justify="space-between">
                                  {customerList.length === 1 &&
                                  customerList[0].name === '' ? (
                                    <Grid item></Grid>
                                  ) : (
                                    <Grid item>
                                      <Button
                                        size="small"
                                        style={{
                                          position: 'relative',
                                          fontSize: 12
                                        }}
                                      >
                                        Balance
                                      </Button>
                                    </Grid>
                                  )}
                                </Grid>
                              </li>
                              {customerList.length === 1 &&
                              customerList[0].name === '' ? (
                                <li></li>
                              ) : (
                                <div>
                                  {customerList.map((option, index) => (
                                    <li
                                      key={`${index}vendor`}
                                      style={{ padding: 10, cursor: 'pointer' }}
                                      onClick={() => {
                                        handleCustomerClick(option);
                                      }}
                                    >
                                      <Grid container justify="space-between">
                                        <Grid item style={{ color: 'black' }}>
                                          {option.name}
                                          <br />
                                          {option.phoneNo}
                                          <b>
                                            {' '}
                                            GSTIN:{' '}
                                            {option.gstNumber
                                              ? option.gstNumber
                                              : 'NA'}{' '}
                                          </b>
                                        </Grid>
                                        <Grid item style={{ color: 'black' }}>
                                          {' '}
                                          <span>
                                            {parseFloat(option.balance).toFixed(
                                              2
                                            )}
                                          </span>
                                          {option.balance > 0 ? (
                                            option.balanceType === 'Payable' ? (
                                              <Arrowtopright fontSize="inherit" />
                                            ) : (
                                              <Arrowbottomleft fontSize="inherit" />
                                            )
                                          ) : (
                                            ''
                                          )}
                                        </Grid>
                                      </Grid>
                                    </li>
                                  ))}
                                </div>
                              )}
                            </ul>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={3} style={{ marginTop: 'auto' }}>
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
                              getTransactionsForEmptyProduct();
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
                    xs={1}
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
                      height: height - 256 + 'px'
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
                        paginationPageSize={10}
                        suppressMenuHide
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination
                        headerHeight={40}
                        rowClassRules={rowClassRules}
                        onCellClicked={handleCellClicked}
                      />
                    </div>
                  </div>
                </Box>
              </div>
              <div>
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginLeft: '15px',
                      marginTop: '-20px',
                      marginBottom: '10px'
                    }}
                  >
                    <Grid
                      item
                      xs={12}
                      style={{ display: 'flex', flexDirection: 'row' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Sale Amount : {totalSalesAmount}{' '}
                        </Typography>
                      </Grid>
                      <Grid item style={{ marginLeft: '20px' }}>
                        <Typography>
                          Total Discount Amount : {totalDiscountAmount}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
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

export default InjectObserver(ItemWiseDiscountCustomer);