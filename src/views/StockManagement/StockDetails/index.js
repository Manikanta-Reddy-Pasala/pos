import React, { useState, useEffect, useMemo, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import 'src/views/Expenses/ExpenseTable.css';
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
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import Excel from 'src/icons/Excel';
import NoPermission from '../../noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';
import useWindowDimensions from 'src/components/windowDimension';
import ProductModal from 'src/components/modal/ProductModal';
import TransactionByItemV2 from './TransactionByItemV2';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import { getStockDataForAllProducts } from '../../../components/Helpers/StockDataHelper';
import { prepareStockSummaryHeaderRow } from '../Helper/ExcelHelper';
import * as ExcelJS from 'exceljs';
import { getSelectedDateMonthAndYearMMYYYY } from 'src/components/Helpers/DateHelper';

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
  },
  agCell: {
    padding: '0 !important'
  },
  agCellHead: {
    padding: '0 !important',
    '& div': {
      justifyContent: 'space-around',
      fontWeight: 'bold',
      color: '#000'
    }
  },
  agHeaderCell: {
    padding: '0 !important'
  },
  boldCell: {
    fontWeight: 'bold'
  }
}));

const StockSummaryV2 = (props) => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const { height } = useWindowDimensions();
  const [category, setCategory] = React.useState([]);
  const [categoryLevel3, setCategoryLevel3] = React.useState('');
  const [subCategory, setSubCategory] = React.useState([]);
  const [rowData, setRowData] = React.useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = props?.isPL
    ? props?.fromDate
    : new Date(thisYear, thisMonth, 1);
  const todayDate = props?.isPL
    ? props?.toDate
    : new Date(thisYear, thisMonth, today);
  const [onChange, setOnChange] = useState(true);
  const [productData, setProductData] = useState(false);
  const [productName, setProductName] = React.useState('');
  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [categoryLevel2, setCategoryLevel2] = React.useState('');
  const [footerData, setFooterData] = useState([]);
  const gridContainerRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const [resetComplete, setResetComplete] = useState(false);

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

  const store = useStore();
  const {
    level2CategoriesList,
    level3CategoriesList,
    openTransactionByProduct
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

  const handleCellClicked = async (item) => {
    updateSelectedStockProduct(item.data);
    handleOpenTransactionByProduct(true);
  };

  const { getWarehouse } = store.WarehouseStore;

  useEffect(() => {
    async function fetchData() {
      setWarehouseList(await getWarehouse());
    }
    handleOpenTransactionByProduct(false);
    fetchData();
  }, []);

  const getDataFromStockSummary = async () => {
    // Create a workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      'STOCK SUMMARY (' + parseInt(rowData.length || 0) + ')'
    );

    const isJewellery =
      String(localStorage.getItem('isJewellery')).toLowerCase() === 'true';

    //Add columns in the second row
    const headerRow = worksheet.getRow(2);
    if (isJewellery) {
      worksheet.getRow(2).values = [
        'PARTICULARS',
        'QTY',
        'NT. WT.',
        'RATE',
        'VALUE',
        'QTY',
        'NT. WT.',
        'RATE',
        'VALUE',
        'QTY',
        'NT. WT.',
        'RATE',
        'VALUE',
        'CONSUMPTION',
        'GROSS PROFIT',
        'PERC %',
        'QTY',
        'NT. WT.',
        'RATE',
        'VALUE'
      ];
    } else {
      worksheet.getRow(2).values = [
        'PARTICULARS',
        'QTY',
        'RATE',
        'VALUE',
        'QTY',
        'RATE',
        'VALUE',
        'QTY',
        'RATE',
        'VALUE',
        'CONSUMPTION',
        'GROSS PROFIT',
        'PERC %',
        'QTY',
        'RATE',
        'VALUE'
      ];
    }

    let filteredColumns = [];
    await prepareStockSummaryHeaderRow(filteredColumns, isJewellery);
    worksheet.columns = filteredColumns;
    // Make header row bold and color header cells
    formatHeaderRow(headerRow);

    worksheet.getCell('A1').value = '';
    if (isJewellery) {
      mergeCells(worksheet, 'B1', 'E1', 'OPENING BALANCE');
      mergeCells(worksheet, 'F1', 'H1', 'INWARDS');
      mergeCells(worksheet, 'I1', 'N1', 'OUTWARDS');
      mergeCells(worksheet, 'O1', 'Q1', 'CLOSING');
    } else {
      mergeCells(worksheet, 'B1', 'D1', 'OPENING BALANCE');
      mergeCells(worksheet, 'E1', 'G1', 'INWARDS');
      mergeCells(worksheet, 'H1', 'M1', 'OUTWARDS');
      mergeCells(worksheet, 'N1', 'P1', 'CLOSING');
    }

    for (let data of rowData) {
      // Add a blank row
      let newRow = worksheet.addRow({});
      newRow.getCell('particulars').value = data.productName;
      newRow.getCell('particulars').alignment = {
        vertical: 'top',
        wrapText: true
      };
      newRow.getCell('openingQty').value = parseFloat(
        data.openingStock.totalQty || 0
      );
      if (isJewellery)
        newRow.getCell('openingNetWeight').value = parseFloat(
          data.openingStock.netWeight || 0
        );
      newRow.getCell('openingRate').value = parseFloat(
        data.openingStock.avgPrice || 0
      );
      newRow.getCell('openingValue').value = parseFloat(
        data.openingStock.value || 0
      );
      newRow.getCell('inwardsQty').value = parseFloat(
        data.purchases.totalQty || 0
      );
      if (isJewellery)
        newRow.getCell('inwardsNetWeight').value = parseFloat(
          data.purchases.netWeight || 0
        );
      newRow.getCell('inwardsRate').value = parseFloat(
        data.purchases.avgPrice || 0
      );
      newRow.getCell('inwardsValue').value = parseFloat(
        data.purchases.value || 0
      );
      newRow.getCell('outwardsQty').value = parseFloat(
        data.sales.totalQty || 0
      );
      if (isJewellery)
        newRow.getCell('outwardsNetWeight').value = parseFloat(
          data.sales.netWeight || 0
        );
      newRow.getCell('outwardsRate').value = parseFloat(
        data.sales.avgPrice || 0
      );
      newRow.getCell('outwardsValue').value = parseFloat(data.sales.value || 0);
      newRow.getCell('consumption').value = parseFloat(
        data.sales.stockConsumed || 0
      );
      newRow.getCell('grossProfit').value = parseFloat(
        data.sales.grossProfit || 0
      );
      newRow.getCell('percentage').value = parseFloat(data.sales.perc || 0);
      newRow.getCell('closingQty').value = parseFloat(
        data.closingStock.totalQty || 0
      );
      if (isJewellery)
        newRow.getCell('closingNetWeight').value = parseFloat(
          data.closingStock.netWeight || 0
        );
      newRow.getCell('closingRate').value = parseFloat(
        data.closingStock.avgPrice || 0
      );
      newRow.getCell('closingValue').value = parseFloat(
        data.closingStock.value || 0
      );
    }

    if (footerData) {
      // Add a blank footer row
      let footerRow = worksheet.addRow({});
      footerRow.getCell('particulars').value = 'TOTAL';
      footerRow.getCell('openingQty').value = parseFloat(
        footerData[0].openingStock.totalQty || 0
      );
      if (isJewellery)
        footerRow.getCell('openingNetWeight').value = parseFloat(
          footerData[0].openingStock.netWeight || 0
        );
      footerRow.getCell('openingRate').value = parseFloat(
        footerData[0].openingStock.avgPrice || 0
      );
      footerRow.getCell('openingValue').value = parseFloat(
        footerData[0].openingStock.value || 0
      );
      footerRow.getCell('inwardsQty').value = parseFloat(
        footerData[0].purchases.totalQty || 0
      );
      if (isJewellery)
        footerRow.getCell('inwardsNetWeight').value = parseFloat(
          footerData[0].purchases.netWeight || 0
        );
      footerRow.getCell('inwardsRate').value = parseFloat(
        footerData[0].purchases.avgPrice || 0
      );
      footerRow.getCell('inwardsValue').value = parseFloat(
        footerData[0].purchases.value || 0
      );
      footerRow.getCell('outwardsQty').value = parseFloat(
        footerData[0].sales.totalQty || 0
      );
      if (isJewellery)
        footerRow.getCell('outwardsNetWeight').value = parseFloat(
          footerData[0].sales.netWeight || 0
        );
      footerRow.getCell('outwardsRate').value = parseFloat(
        footerData[0].sales.avgPrice || 0
      );
      footerRow.getCell('outwardsValue').value = parseFloat(
        footerData[0].sales.value || 0
      );
      footerRow.getCell('consumption').value = parseFloat(
        footerData[0].sales.stockConsumed || 0
      );
      footerRow.getCell('grossProfit').value = parseFloat(
        footerData[0].sales.grossProfit || 0
      );
      footerRow.getCell('percentage').value = '';
      footerRow.getCell('closingQty').value = parseFloat(
        footerData[0].closingStock.totalQty || 0
      );
      if (isJewellery)
        footerRow.getCell('closingNetWeight').value = parseFloat(
          footerData[0].closingStock.netWeight || 0
        );
      footerRow.getCell('closingRate').value = parseFloat(
        footerData[0].closingStock.avgPrice || 0
      );
      footerRow.getCell('closingValue').value = parseFloat(
        footerData[0].closingStock.value || 0
      );

      footerRow.font = { bold: true };
      footerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' }
        };
      });
    }

    // Generate Excel file buffer
    workbook.xlsx.writeBuffer().then((buffer) => {
      // Create a Blob from the buffer
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      // Create a URL for the Blob
      const url = window.URL.createObjectURL(blob);
      // Create a link element
      const a = document.createElement('a');
      // Set the link's href attribute to the URL of the Blob
      a.href = url;
      // Set the download attribute to specify the filename
      const fileName =
        localStorage.getItem('businessName') +
        '_Stock_Summary_Report_' +
        getSelectedDateMonthAndYearMMYYYY(fromDate) +
        'to' +
        getSelectedDateMonthAndYearMMYYYY(toDate);
      a.download = fileName + '.xlsx';
      // Append the link to the body
      document.body.appendChild(a);
      // Click the link programmatically to start the download
      a.click();
      // Remove the link from the body
      document.body.removeChild(a);
    });
  };

  const formatHeaderRow = (headerRow) => {
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'd8f3fc' } // Yellow color
      };
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  };

  const mergeCells = (worksheet, cellStartValue, cellEndValue, text) => {
    worksheet.mergeCells(cellStartValue, cellEndValue);
    worksheet.getCell(cellStartValue).value = text;
    worksheet.getCell(cellStartValue).font = { bold: true };
    worksheet.getCell(cellStartValue).alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    worksheet.getCell(cellStartValue).border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  };

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

  const resetCategory = () => {
    setCategoryLevel2(null);
    setCategoryLevel3(null);
    setCategory([]);
    setSubCategory([]);
    resetData();
    setRowData([]);
    setResetComplete(true);
  };

  useEffect(() => {
    if (resetComplete) {
      getBusinessLevel2Categorieslist();
      getStockSummaryData(warehouse);
      setResetComplete(false); // Reset the flag after actions are complete
    }
  }, [resetComplete]);

  const getStockSummaryByCategory = async (level3Category, warehouse) => {
    const data = await getStockDataForAllProducts(
      fromDate,
      toDate,
      warehouse,
      selectedProduct ? selectedProduct.productId : '',
      categoryLevel2,
      level3Category
    );

    console.log(data);

    setRowData(data.rows);
    populateFooter(data.footer);
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
        if (categoryLevel3.length > 3) {
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
    const allData = await getStockDataForAllProducts(
      fromDate,
      toDate,
      warehouse,
      selectedProduct ? selectedProduct.productId : '',
      categoryLevel2,
      categoryLevel3
    );
    setRowData(allData.rows);
    populateFooter(allData.footer);
  };

  const populateFooter = async (totalData) => {
    const openingTotalQty =
      totalData && totalData.totalOpening
        ? totalData.totalOpening.totalQty
        : '';
    const openingTotalValue =
      totalData && totalData.totalOpening ? totalData.totalOpening.value : '';

    const closingTotalQty =
      totalData && totalData.totalClosing
        ? totalData.totalClosing.totalQty
        : '';
    const closingTotalValue =
      totalData && totalData.totalClosing ? totalData.totalClosing.value : '';

    const inwardTotalQty =
      totalData && totalData.totalPurchases
        ? totalData.totalPurchases.totalQty
        : '';
    const inwardTotalValue =
      totalData && totalData.totalPurchases
        ? totalData.totalPurchases.value
        : '';

    const outwardTotalQty =
      totalData && totalData.totalPurchases
        ? totalData.totalPurchases.totalQty
        : '';
    const outwardTotalValue =
      totalData && totalData.totalPurchases
        ? totalData.totalPurchases.value
        : '';

    const openingStock = {
      totalQty: openingTotalQty,
      netWeight:
        totalData && totalData.totalOpening
          ? totalData.totalOpening.netWeight
          : '',
      value: openingTotalValue,
      avgPrice: isNaN(
        parseFloat(parseFloat(openingTotalValue) / parseFloat(openingTotalQty))
      )
        ? 0
        : parseFloat(
          parseFloat(openingTotalValue) / parseFloat(openingTotalQty)
        )
    };
    const closingStock = {
      totalQty:
        totalData && totalData.totalClosing
          ? totalData.totalClosing.totalQty
          : '',
      netWeight:
        totalData && totalData.totalClosing
          ? totalData.totalClosing.netWeight
          : '',
      value:
        totalData && totalData.totalClosing ? totalData.totalClosing.value : '',
      avgPrice: isNaN(
        parseFloat(parseFloat(closingTotalValue) / parseFloat(closingTotalQty))
      )
        ? 0
        : parseFloat(
          parseFloat(closingTotalValue) / parseFloat(closingTotalQty)
        )
    };
    const sales = {
      totalQty:
        totalData && totalData.totalSales ? totalData.totalSales.totalQty : '',
      value:
        totalData && totalData.totalSales ? totalData.totalSales.value : '',
      stockConsumed:
        totalData && totalData.totalSales
          ? totalData.totalSales?.stockConsumed
          : '',
      grossProfit:
        totalData && totalData.totalSales
          ? totalData.totalSales?.grossProfit
          : '',
      netWeight:
        totalData && totalData.totalSales ? totalData.totalSales.netWeight : '',
      avgPrice: isNaN(
        parseFloat(parseFloat(outwardTotalValue) / parseFloat(outwardTotalQty))
      )
        ? 0
        : parseFloat(
          parseFloat(outwardTotalValue) / parseFloat(outwardTotalQty)
        )
    };
    const purchases = {
      totalQty:
        totalData && totalData.totalPurchases
          ? totalData.totalPurchases.totalQty
          : '',
      value:
        totalData && totalData.totalPurchases
          ? totalData.totalPurchases.value
          : '',
      netWeight:
        totalData && totalData.totalPurchases
          ? totalData.totalPurchases.netWeight
          : '',
      avgPrice: isNaN(
        parseFloat(parseFloat(inwardTotalValue) / parseFloat(inwardTotalQty))
      )
        ? 0
        : parseFloat(parseFloat(inwardTotalValue) / parseFloat(inwardTotalQty))
    };
    const footer = {
      productName: 'Total',
      openingStock,
      closingStock,
      sales,
      purchases
    };
    setFooterData([footer]);
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

    const data = await getStockDataForAllProducts(
      fromDate,
      toDate,
      warehouse,
      option.productId,
      categoryLevel2,
      categoryLevel3
    );

    setRowData(data.rows);
    populateFooter(data.footer);

    setproductlist([]);
  };

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  const fetchDataOnProductRemoval = async () => {
    const data = await getStockDataForAllProducts(
      fromDate,
      toDate,
      warehouse,
      '',
      categoryLevel2,
      categoryLevel3
    );
    setRowData(data.rows);
    populateFooter(data.footer);
  };

  const columnDefs = useMemo(
    () => [
      {
        headerName: '',
        marryChildren: true,
        width: 190,
        children: [
          {
            headerName: 'Particulars',
            width: 500,
            field: 'productName',
            cellClass: classes.agCell,
            autoHeight: true,
            cellStyle: {
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: '1.5',
              display: 'flex',
              alignItems: 'center'
            }
          }
        ]
      },
      {
        headerName: 'Opening Balance',
        marryChildren: true,
        hide: props?.isPL && props?.closingStock,
        children: [
          {
            headerName: 'Qty',
            field: 'openingStock.totalQty',
            cellClass: classes.agCell,
            hide: props?.isPL && props?.closingStock
          },
          {
            headerName: 'Rate',
            field: 'openingStock.avgPrice',
            cellClass: classes.agCell,
            hide: props?.isPL && props?.closingStock,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          },
          {
            headerName: 'Net Wt',
            field: 'openingStock.netWeight',
            cellClass: classes.agCell,
            hide:
              String(localStorage.getItem('isJewellery')).toLowerCase() ===
                'true'
                ? false
                : true || (props?.isPL && props?.closingStock),
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          },
          {
            headerName: 'Value',
            field: 'openingStock.value',
            cellClass: classes.agCell,
            hide: props?.isPL && props?.closingStock,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          }
        ],
        headerClass: classes.agCellHead
      },
      {
        headerName: 'Inwards',
        marryChildren: true,
        children: [
          {
            headerName: 'Qty',
            field: 'purchases.totalQty',
            cellClass: classes.agCell
          },
          {
            headerName: 'Rate',
            field: 'purchases.avgPrice',
            cellClass: classes.agCell,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          },
          {
            headerName: 'Net Wt',
            field: 'purchases.netWeight',
            cellClass: classes.agCell,
            hide:
              String(localStorage.getItem('isJewellery')).toLowerCase() ===
                'true'
                ? false
                : true,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          },
          {
            headerName: 'Value',
            field: 'purchases.value',
            cellClass: classes.agCell,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          }
        ],
        headerClass: classes.agCellHead
      },
      {
        headerName: 'Outward',
        marryChildren: true,
        children: [
          {
            headerName: 'Qty',
            field: 'sales.totalQty',
            cellClass: classes.agCell
          },
          {
            headerName: 'Rate',
            field: 'sales.avgPrice',
            cellClass: classes.agCell,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          },
          {
            headerName: 'Net Wt',
            field: 'sales.netWeight',
            cellClass: classes.agCell,
            hide:
              String(localStorage.getItem('isJewellery')).toLowerCase() ===
                'true'
                ? false
                : true,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            },
            headerComponentFramework: (props) => {
              return (
                <div>
                  <p>Net</p>
                  <p>Wt</p>
                </div>
              );
            }
          },
          {
            headerName: 'Value',
            field: 'sales.value',
            cellClass: classes.agCell,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          },
          {
            headerName: 'Consumed',
            field: 'sales.stockConsumed',
            cellClass: classes.agCell,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          },
          {
            headerName: 'Gross Profit',
            field: 'sales.grossProfit',
            cellClass: classes.agCell,
            hide:
              String(localStorage.getItem('isJewellery')).toLowerCase() ===
                'true'
                ? true
                : false,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            },
            headerComponentFramework: (props) => {
              return (
                <div>
                  <p>Gross</p>
                  <p>Profit</p>
                </div>
              );
            }
          },
          {
            headerName: 'Perc %',
            field: 'sales.perc',
            cellClass: classes.agCell,
            hide:
              String(localStorage.getItem('isJewellery')).toLowerCase() ===
                'true'
                ? true
                : false
          }
        ],
        headerClass: classes.agCellHead
      },
      {
        headerName: 'Closing',
        marryChildren: true,
        hide: props.isPL && props.openingStock,
        children: [
          {
            headerName: 'Qty',
            field: 'closingStock.totalQty',
            cellClass: classes.agCell,
            hide: props.isPL && props.openingStock
          },
          {
            headerName: 'Rate',
            field: 'closingStock.avgPrice',
            cellClass: classes.agCell,
            hide: props.isPL && props.openingStock,

            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          },
          {
            headerName: 'Net Wt',
            field: 'closingStock.netWeight',
            cellClass: classes.agCell,
            hide:
              String(localStorage.getItem('isJewellery')).toLowerCase() ===
                'true'
                ? false
                : true || (props.isPL && props.openingStock),
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            },
            headerComponentFramework: (props) => {
              return (
                <div>
                  <p>Net</p>
                  <p>Wt</p>
                </div>
              );
            }
          },
          {
            headerName: 'Value',
            field: 'closingStock.value',
            cellClass: classes.agCell,
            hide: props.isPL && props.openingStock,
            valueFormatter: (params) => {
              if (
                params.value !== null &&
                params.value !== undefined &&
                params.value !== ''
              ) {
                return parseFloat(params.value).toFixed(2);
              }
              return params.value;
            }
          }
        ],
        headerClass: classes.agCellHead
      }
    ],
    []
  );

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    // filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    headerClass: classes.agHeaderCell,
    cellClassRules: {
      [classes.boldCell]: (params) => params.node.rowPinned
    }
  });

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();

    const resizeObserver = new ResizeObserver(() => {
      params.api.sizeColumnsToFit();
    });

    if (gridContainerRef.current) {
      resizeObserver.observe(gridContainerRef.current);
    }

    resizeObserverRef.current = resizeObserver;

    // Clean up ResizeObserver on component unmount
    return () => {
      if (resizeObserverRef.current && gridContainerRef.current) {
        resizeObserverRef.current.unobserve(gridContainerRef.current);
      }
    };
  };
  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  return (
    <div>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && !openTransactionByProduct && (
        <div className={classes.root} style={{ minHeight: height - 83 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 83 }}>
              {!props.isPL && (
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
              )}

              {props.isPL && props.plHeader}

              <div>
                <Grid
                  container
                  spacing={1}
                  className={classes.categoryActionWrapper}
                >
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: props?.isPL ? 'flex' : 'block',
                      justifyContent: 'end'
                    }}
                  >
                    {!props.isPL && (
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
                          onChange={(e) => {
                              setFromDate(formatDate(e.target.value));
                              setOnChange(true);
                            }
                          }
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </div>
                    )}
                    {!props.isPL && (
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
                          onChange={(e) => {
                            setToDate(formatDate(e.target.value));
                              setOnChange(true);
                            }
                          }
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                      </div>
                    )}

                    {props.isPL && (
                      <div
                        className={classes.selectOption}
                        style={{ margin: '16px' }}
                      >
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
                    )}

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
                      height: height - 225 + 'px',
                      paddingLeft: '10px'
                    }}
                    className=" blue-theme"
                  >
                    <div
                      id="product-list-grid"
                      ref={gridContainerRef}
                      style={{ height: '100%', width: '100%' }}
                      className="ag-theme-material"
                    >
                      <AgGridReact
                        onGridReady={onGridReady}
                        onFirstDataRendered={(params) =>
                          params.api.sizeColumnsToFit()
                        }
                        paginationPageSize={10}
                        rowData={rowData}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        pagination
                        headerHeight={40}
                        rowClassRules={rowClassRules}
                        pinnedBottomRowData={footerData}
                        onCellClicked={handleCellClicked}
                      />
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
      {openTransactionByProduct ? <TransactionByItemV2 fromDate={fromDate} toDate={toDate}  /> : null}
    </div>
  );
};

export default InjectObserver(StockSummaryV2);
