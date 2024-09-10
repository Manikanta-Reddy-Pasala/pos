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
  }
}));

const StockSummary = () => {
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

  const [limit] = useState(10);

  let [allProductData, setAllProductData] = useState({});

  const store = useStore();
  const { level2CategoriesList, level3CategoriesList } = toJS(
    store.ReportsStore
  );
  const {
    getBusinessLevel2Categorieslist,
    getBusinessLevel3Categorieslist,
    resetData
  } = store.ReportsStore;

  const [warehouse, setWarehouse] = React.useState('');
  const [warehouseList, setWarehouseList] = React.useState([]);

  const { productDialogOpen } = toJS(store.ProductStore);
  const { handleEditProductModalLaunchFromReports } = store.ProductStore;

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    if ('name' === colId) {
      handleEditProductModalLaunchFromReports(event.data);
    }
  };

  // const formatDate = (date) => {
  //   var d = new Date(date),
  //     month = '' + (d.getMonth() + 1),
  //     day = '' + d.getDate(),
  //     year = d.getFullYear();

  //   if (month.length < 2) month = '0' + month;
  //   if (day.length < 2) day = '0' + day;

  //   return [year, month, day].join('-');
  // };

  // const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  // const [toDate, setToDate] = React.useState(formatDate(todayDate));

  const { getWarehouse } = store.WarehouseStore;

  useEffect(() => {
    async function fetchData() {
      setWarehouseList(await getWarehouse());
    }

    fetchData();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: 'NAME',
      field: 'name',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'HSN',
      field: 'hsn',
      width: 200,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'SALE PRICE',
      field: 'salePrice',
      width: 300,
      valueFormatter: (params) => {
        return params['data']['salePrice']
          ? parseFloat(params['data']['salePrice']).toFixed(2)
          : '0';
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'PURCHASE PRICE',
      field: 'purchasedPrice',
      width: 400,
      valueFormatter: (params) => {
        return params['data']['purchasedPrice']
          ? parseFloat(params['data']['purchasedPrice']).toFixed(2)
          : '0';
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'STOCK QTY',
      field: 'stockQty',
      width: 300,
      cellStyle() {
        return { color: '#339900' };
      },
      valueFormatter: (params) => {
        return params['data']['stockQty']
          ? parseFloat(params['data']['stockQty']).toFixed(2)
          : '0';
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'STOCK VALUE',
      field: 'stockValue',
      width: 300,
      valueGetter: multiplierGetter,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'T N WT.',
      field: 'netWeight',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        return params['data']['netWeight']
          ? parseFloat(
              params['data']['netWeight'] * params['data']['stockQty'] ||
                parseFloat(0).toFixed(3)
            ).toFixed(3)
          : parseFloat(0).toFixed(3);
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>NT. W</p>
          </div>
        );
      },
      hide: true,
      suppressToolPanel: true
    }
  ]);

  function multiplierGetter(params) {
    let qty = params.data.stockQty * params.data.purchasedPrice;
    return parseFloat(qty).toFixed(2);
  }

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
    const db = await Db.get();
    var Query;

    let skip = 0;
    setProductData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllStockSummaryByCategory(level3Category);
    }
    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { 'categoryLevel3.name': { $eq: level3Category } },
            { warehouseData: { $eq: warehouse } }
          ]
        },
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { 'categoryLevel3.name': { $eq: level3Category } }
          ]
        },
        skip: skip,
        limit: limit
      });
    }

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setProductData(response);
    });
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
    const db = await Db.get();
    var Query;

    let skip = 0;
    setProductData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllStockSummaryData(warehouse);
    }
    const businessData = await Bd.getBusinessData();

    if (warehouse) {
      Query = db.businessproduct.find({
        selector: {
          $and: [
            { businessId: { $eq: businessData.businessId } },
            { warehouseData: { $eq: warehouse } }
          ]
        },
        skip: skip,
        limit: limit
      });
    } else {
      Query = db.businessproduct.find({
        selector: {
          businessId: { $eq: businessData.businessId }
        },
        skip: skip,
        limit: limit
      });
    }

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item);
      setProductData(response);
    });
  };

  const getAllStockSummaryByCategory = async (level3Category) => {
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

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;

      let response = data
        .map((item) => {
          let output = {};

          output.stockQty = item.stockQty;
          output.purchasedPrice = item.purchasedPrice;
          output.netWeight = item.netWeight;

          ++count;
          return output;
        })
        .reduce(
          (a, b) => {
            let data = toJS(b);

            a.totalStockQty = a.totalStockQty + data.stockQty;
            a.totalStockPurchase =
              a.totalStockPurchase +
              parseFloat(data.stockQty || 0) *
                parseFloat(data.purchasedPrice || 0);
            a.totalNetWeight =
              parseFloat(a.totalNetWeight || 0) +
              (parseFloat(data.stockQty || 0) *
                parseFloat(data.netWeight || 0) || 0);

            return a;
          },
          {
            totalStockQty: 0,
            totalStockPurchase: 0,
            totalNetWeight: 0
          }
        );

      count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);

      setAllProductData(response);
    });
  };

  const getAllStockSummaryData = async (warehouse) => {
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

    await Query.exec().then(async (data) => {
      if (!data) {
        return;
      }
      let count = 0;

      let response = await data
        .map((item) => {
          let output = {};

          output.stockQty = item.stockQty;
          output.purchasedPrice = item.purchasedPrice;
          output.netWeight = item.netWeight;

          ++count;
          return output;
        })
        .reduce(
          (a, b) => {
            let data = toJS(b);

            a.totalStockQty = a.totalStockQty + data.stockQty;
            a.totalStockPurchase =
              a.totalStockPurchase +
              (parseFloat(data.stockQty || 0) *
                parseFloat(data.purchasedPrice) || 0);
            a.totalNetWeight =
              parseFloat(a.totalNetWeight || 0) +
              (parseFloat(data.stockQty || 0) *
                parseFloat(data.netWeight || 0) || 0);

            return a;
          },
          {
            totalStockQty: 0,
            totalStockPurchase: 0,
            totalNetWeight: 0
          }
        );

      count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);

      setAllProductData(response);
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    params.api.sizeColumnsToFit();
    if (String(localStorage.getItem('isJewellery')).toLowerCase() === 'true') {
      params.columnApi.setColumnVisible('netWeight', true);
    } else {
      params.columnApi.setColumnVisible('netWeight', false);
    }
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
                    STOCK SUMMARY
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
                    {/* <div>
                      <form className={classes.blockLine} noValidate>
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
                    </div> */}
                  </Grid>
                  <Grid item xs={2} style={{ marginTop: '14px' }}>
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
                      {/* <IconButton classes={{ label: classes.label }}>
              <Print fontSize="inherit" />
              <span className={classes.iconLabel}>Print</span>
                  </IconButton> */}
                    </Grid>
                  </Grid>
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
                                getStockSummaryDataByWarehouse(e.target.value);
                              } else {
                                setWarehouse('');
                                getStockSummaryDataByWarehouse('');
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
                      height: height - 325 + 'px'
                    }}
                    className=" blue-theme"
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
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        rowSelection="single"
                        pagination
                        headerHeight={40}
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

              <div className={classes.footer}>
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
    </div>
  );
};

export default InjectObserver(StockSummary);