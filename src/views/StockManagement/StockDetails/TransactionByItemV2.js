import React, { useEffect, useMemo, useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import 'src/views/Expenses/ExpenseTable.css';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Typography
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import XLSX from 'xlsx';
import * as Db from 'src/RxDb/Database/Database';
import NoPermission from '../../noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';
import useWindowDimensions from 'src/components/windowDimension';
import { getProductTxnListByDateAndProduct } from 'src/components/Helpers/ProductTxnQueryHelper';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import { toJS } from 'mobx';
import EditMfgModal from 'src/components/modal/EditMfgModal';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Excel from 'src/icons/Excel';
import * as ExcelJS from 'exceljs';
import { prepareTxnByProductHeaderRow } from '../Helper/ExcelHelper';
import { getSelectedDateMonthAndYearMMYYYY } from 'src/components/Helpers/DateHelper';
import { getYesterdayDate } from 'src/components/Helpers/DateHelper';

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
  tableStyle: {
    borderCollapse: 'collapse',
    border: '1px solid black',
    width: '100%'
  },
  borderRight: {
    borderRight: '1px solid black'
  },

  borderBottom: {
    borderBottom: '1px solid black'
  },
  pad: {
    padding: '10px'
  },
  numberCls: {
    textAlign: 'center'
  },
  rowCls: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#e6e62b'
    }
  },
  filterBtn: {
    backgroundColor: '#f44336',
    color: 'white',
    height: '30px',
    margin: '10px',
    '&:hover': {
      backgroundColor: '#f443369e',
      color: 'white'
    },
    fontSize: '12px'
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

const TransactionByItemV2 = (props) => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);
  const [rowData, setRowData] = useState([]);
  const [listRowData, setListRowData] = useState([]);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [productName, setProductName] = React.useState('');
  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);
  const [salesChecked, setSalesChecked] = useState(true);
  const [salesReturnChecked, setSalesReturnChecked] = useState(true);
  const [purchaseChecked, setPurchaseChecked] = useState(true);
  const [purchaseReturnChecked, setPurchaseReturnChecked] = useState(true);
  const [rawMaterialChecked, setRawMaterialChecked] = useState(true);
  const [manufactureChecked, setManufactureChecked] = useState(true);
  const [addChecked, setAddChecked] = useState(true);
  const [removeChecked, setRemoveChecked] = useState(true);
  const [damagedChecked, setDamagedChecked] = useState(true);

  const [onChange, setOnChange] = useState(true);
  const gridContainerRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const fromDate = props.fromDate;
  const toDate = props.toDate;
  // const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  // const [toDate, setToDate] = React.useState(formatDate(todayDate));

  const stores = useStore();
  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } =
    toJS(stores.SalesAddStore);
  const { openAddSalesReturn } = toJS(stores.ReturnsAddStore);
  const { OpenAddPurchaseBill } = toJS(stores.PurchasesAddStore);
  const { OpenAddPurchasesReturn } = toJS(stores.PurchasesReturnsAddStore);
  const { openEWayGenerateModal } = toJS(stores.EWayStore);
  const { productDialogOpen } = toJS(stores.ProductStore);

  const { viewOrEditSaleTxnItem, resetEWayLaunchFlag } = stores.SalesAddStore;
  const { viewOrEditSaleReturnTxnItem } = stores.ReturnsAddStore;
  const { viewOrEditPurchaseTxnItem } = stores.PurchasesAddStore;
  const { viewOrEditPurchaseReturnTxnItem } = stores.PurchasesReturnsAddStore;
  const { editMfgOpenDialog } = toJS(stores.ProductStore);
  const { updateProductFromManufacture } = stores.ProductStore;
  const { handleOpenEWayGenerateModal } = stores.EWayStore;
  const { selectedStockProduct, handleOpenTransactionByProduct } = toJS(
    stores.ReportsStore
  );
  let closingQuantity = 0;
  let closingQuantityFinal = 0;
  const [footerData, setFooterData] = useState([]);

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getName = (data) => data.customerName || data.vendorName || '';

  const getQuantityWithUnits = (data) =>
    `${data.txnQty || ''} ${data.qtyUnit || ''}`.trim();

  const getFreeQuantityWithUnits = (data) =>
    `${data.freeTxnQty || ''} ${data.qtyUnit || ''}`.trim();

  const getPricePerUnit = (data) => {
    const txnTypes = [
      'Sales',
      'KOT',
      'Sales Return',
      'Raw Material',
      'Manufacture'
    ];
    let price = 0;
    if (txnTypes.includes(data.txnType)) {
      price = parseFloat(data.amount) - parseFloat(data.taxAmount);
    } else if (['Purchases', 'Purchases Return'].includes(data.txnType)) {
      price = data.purchased_price_before_tax;
    }
    return parseFloat(price || 0).toFixed(2);
  };

  useEffect(() => {
    setproductlist([]);
    setTimeout(() => setLoadingShown(false), 200);
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await handleProductClick(selectedStockProduct);
    }

    fetchData();
    setOnChange(false);
  }, [onChange]);

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
    setProductName(option.productName);
    setSelectedProduct(option);
    setProductNameWhileEditing('');
    setproductlist([]);

    const yesterdayDate = getYesterdayDate(fromDate);

    const db = await Db.get();
    const openingTxndata = await getProductTxnListByDateAndProduct(
      db,
      option.productId,
      '',
      yesterdayDate,
      salesChecked,
      salesReturnChecked,
      purchaseChecked,
      purchaseReturnChecked,
      rawMaterialChecked,
      manufactureChecked,
      addChecked,
      removeChecked,
      damagedChecked
    );

    const openingTransactionResults = processTransactions(
      openingTxndata,
      selectedStockProduct.closingStock.avgPrice
    );

    const openingclosingTotalQty =
      openingTransactionResults?.summary?.totalClosing?.totalQty;
    const openingclosingTotalValue =
      openingTransactionResults?.summary?.totalClosing?.value;

    const openinginwardTotalQty =
      openingTransactionResults?.summary?.totalInwards?.totalQty;
    const openinginwardTotalValue =
      openingTransactionResults?.summary?.totalInwards?.value;

    const openingoutwardTotalQty =
      openingTransactionResults?.summary?.totalOutwards?.totalQty;
    const openingoutwardTotalValue =
      openingTransactionResults?.summary?.totalOutwards?.value;

    const openingBalanceTxn = {
      txnType: 'Opening Stock',
      txnDate: '',
      sequenceNumber: '',
      closingStock: {
        totalQty: openingclosingTotalQty,
        value: openingclosingTotalValue,
        avgPrice: isNaN(
          parseFloat(
            parseFloat(openingclosingTotalValue) /
              parseFloat(openingclosingTotalQty)
          )
        )
          ? 0
          : parseFloat(
              parseFloat(openingclosingTotalValue) /
                parseFloat(openingclosingTotalQty)
            ),
        netWeight: openingTransactionResults?.summary?.totalClosing?.netWeight
      },
      outwardsStock: {
        totalQty: openingoutwardTotalQty,
        value: openingoutwardTotalValue,
        avgPrice: isNaN(
          parseFloat(
            parseFloat(openingoutwardTotalValue) /
              parseFloat(openingoutwardTotalQty)
          )
        )
          ? 0
          : parseFloat(
              parseFloat(openingoutwardTotalValue) /
                parseFloat(openingoutwardTotalQty)
            ),
        netWeight: openingTransactionResults?.summary?.totalOutwards?.netWeight
      },
      inwardsStock: {
        totalQty: openinginwardTotalQty,
        avgPrice: isNaN(
          parseFloat(
            parseFloat(openinginwardTotalValue) /
              parseFloat(openinginwardTotalQty)
          )
        )
          ? 0
          : parseFloat(
              parseFloat(openinginwardTotalValue) /
                parseFloat(openinginwardTotalQty)
            ),
        netWeight: openingTransactionResults?.summary?.totalInwards?.netWeight,
        value: openinginwardTotalValue
      }
    };

    const txndata = await getProductTxnListByDateAndProduct(
      db,
      option.productId,
      fromDate,
      toDate,
      salesChecked,
      salesReturnChecked,
      purchaseChecked,
      purchaseReturnChecked,
      rawMaterialChecked,
      manufactureChecked,
      addChecked,
      removeChecked,
      damagedChecked
    );

    const results = processTransactions(
      txndata,
      selectedStockProduct.closingStock.avgPrice,
      openingBalanceTxn
    );

    const closingTotalQty = results?.summary?.totalClosing?.totalQty;
    const closingTotalValue = results?.summary?.totalClosing?.value;

    const inwardTotalQty = results?.summary?.totalInwards?.totalQty;
    const inwardTotalValue = results?.summary?.totalInwards?.value;

    const outwardTotalQty = results?.summary?.totalOutwards?.totalQty;
    const outwardTotalValue = results?.summary?.totalOutwards?.value;

    const footer = {
      txnDate: 'Total',
      particulars: '',
      txnType: '',
      sequenceNumber: '',
      closingStock: {
        totalQty: closingTotalQty,
        value: closingTotalValue,
        avgPrice: isNaN(
          parseFloat(
            parseFloat(closingTotalValue) / parseFloat(closingTotalQty)
          )
        )
          ? 0
          : parseFloat(
              parseFloat(closingTotalValue) / parseFloat(closingTotalQty)
            ),
        netWeight: results?.summary?.totalClosing?.netWeight
      },
      outwardsStock: {
        totalQty: outwardTotalQty,
        value: outwardTotalValue,
        avgPrice: isNaN(
          parseFloat(
            parseFloat(outwardTotalValue) / parseFloat(outwardTotalQty)
          )
        )
          ? 0
          : parseFloat(
              parseFloat(outwardTotalValue) / parseFloat(outwardTotalQty)
            ),
        netWeight: results?.summary?.totalOutwards?.netWeight,
        consumption: results?.summary?.totalOutwards?.consumption,
        grossProfit: results?.summary?.totalOutwards?.grossProfit
      },
      inwardsStock: {
        totalQty: inwardTotalQty,
        avgPrice: isNaN(
          parseFloat(parseFloat(inwardTotalValue) / parseFloat(inwardTotalQty))
        )
          ? 0
          : parseFloat(
              parseFloat(inwardTotalValue) / parseFloat(inwardTotalQty)
            ),
        netWeight: results?.summary?.totalInwards?.netWeight,
        value: inwardTotalValue
      }
    };

    setFooterData([footer]);

    // const updatedData = results;
    const updatedData = [...results.transactions];

    setTimeout(() => {
      setRowData(updatedData);
    }, 1000);
  };

  const initializeTransactionModel = (
    item,
    index,
    cumulativeQty,
    cumulativeValue,
    cumulativeNetWeight,
    closingAvgPrice
  ) => {
    const txnQty = parseFloat(item.txnQty || 0);
    const purchasedPrice = txnQty
      ? parseFloat(item.purchased_price_before_tax || 0) -
          parseFloat(item.discount_amount || 0) / txnQty || 0
      : 0;
    const salePrice = txnQty
      ? parseFloat(item.mrp_before_tax || 0) -
          parseFloat(item.discount_amount || 0) / txnQty || 0
      : 0;
    const netWeight = parseFloat(item.netWeight || 0);

    const isInward = [
      'Sales Return',
      'Purchases',
      'Manufacture',
      'Add Stock',
      'Opening Stock'
    ].includes(item.txnType);
    const isOutward = [
      'Sales',
      'KOT',
      'Raw Material',
      'Remove Stock',
      'Damage Stock',
      'Purchases Return'
    ].includes(item.txnType);

    const totalAmount = isInward
      ? parseFloat(purchasedPrice * txnQty || 0)
      : parseFloat(salePrice * txnQty || 0); //mani todo
    const grossProfit = isOutward
      ? salePrice * txnQty - closingAvgPrice * txnQty
      : 0;
    const percentageProfit =
      isOutward && salePrice
        ? ((grossProfit / (salePrice * txnQty)) * 100).toFixed(2)
        : 0;
    const consumption = isOutward ? closingAvgPrice * txnQty : 0;

    const avgPrice = parseFloat(totalAmount / txnQty || 0).toFixed(2);

    const inwardsStock = isInward
      ? {
          totalQty: txnQty,
          avgPrice: closingAvgPrice,
          value: totalAmount.toFixed(2),
          netWeight: netWeight
        }
      : {
          totalQty: 0,
          avgPrice: 0,
          value: 0,
          netWeight: 0
        };

    const outwardsStock = isOutward
      ? {
          totalQty: txnQty,
          avgPrice: avgPrice,
          value: totalAmount.toFixed(2),
          netWeight: netWeight,
          grossProfit: grossProfit.toFixed(2),
          percentageProfit: percentageProfit,
          consumption: consumption.toFixed(2)
        }
      : {
          totalQty: 0,
          avgPrice: 0,
          value: 0,
          netWeight: 0,
          grossProfit: 0,
          percentageProfit: 0,
          consumption: 0
        };

    const closingStock = {
      totalQty: cumulativeQty,
      avgPrice: closingAvgPrice,
      value: parseFloat(cumulativeQty) * parseFloat(closingAvgPrice),
      netWeight: cumulativeNetWeight
    };

    return {
      productId: item.productId,
      productName: item.productName,
      txnType: item.txnType,
      txnDate: item.txnDate,
      sequenceNumber: item.sequenceNumber,
      category: isInward ? 'Inwards' : isOutward ? 'Outwards' : 'Uncategorized',
      inwardsStock,
      outwardsStock,
      closingStock
    };
  };

  const processTransactions = (
    transactions,
    closingAvgPrice,
    openingtransaction
  ) => {
    let finalResults = [];

    let cumulativeQty = 0;
    let cumulativeValue = 0;
    let cumulativeNetWeight = 0;

    let totalInwards = {
      totalQty: 0,
      netWeight: 0,
      value: 0
    };

    let totalOutwards = {
      totalQty: 0,
      netWeight: 0,
      value: 0,
      consumption: 0,
      grossProfit: 0
    };

    if (openingtransaction) {
      finalResults.push(openingtransaction);

      cumulativeQty += parseFloat(openingtransaction.closingStock.totalQty);
      cumulativeValue += parseFloat(openingtransaction.closingStock.value);
      cumulativeNetWeight += parseFloat(
        openingtransaction.closingStock.netWeight
      );

      totalInwards.totalQty += parseFloat(
        openingtransaction.inwardsStock.totalQty
      );
      totalInwards.value += parseFloat(openingtransaction.inwardsStock.value);
      totalInwards.netWeight += parseFloat(
        openingtransaction.inwardsStock.netWeight
      );

      totalOutwards.totalQty += parseFloat(
        openingtransaction.outwardsStock.totalQty
      );
      totalOutwards.value += parseFloat(openingtransaction.outwardsStock.value);
      totalOutwards.netWeight += parseFloat(
        openingtransaction.outwardsStock.netWeight
      );
    }

    transactions.sort((a, b) => new Date(a.txnDate) - new Date(b.txnDate));
    transactions.forEach((item, index) => {
      const txnQty = parseFloat(item.txnQty || 0);
      const totalAmount =
        parseFloat(
          item.txnType.includes('Sales')
            ? parseFloat(item.mrp_before_tax || 0) -
                parseFloat(item.discount_amount || 0) / txnQty ||
                0 ||
                0
            : parseFloat(item.purchased_price_before_tax || 0) -
                parseFloat(item.discount_amount || 0) / txnQty ||
                0 ||
                0
        ) * parseFloat(txnQty || 0);
      const netWeight = parseFloat(item.netWeight || 0);

      if (
        [
          'Sales Return',
          'Purchases',
          'Manufacture',
          'Add Stock',
          'Opening Stock'
        ].includes(item.txnType)
      ) {
        cumulativeQty += parseFloat(txnQty);
        cumulativeValue += parseFloat(totalAmount);
        cumulativeNetWeight += parseFloat(netWeight);

        totalInwards.totalQty += parseFloat(txnQty);
        totalInwards.value += parseFloat(totalAmount);
        totalInwards.netWeight += parseFloat(netWeight);
      } else if (
        [
          'Sales',
          'KOT',
          'Raw Material',
          'Remove Stock',
          'Damage Stock',
          'Purchases Return'
        ].includes(item.txnType)
      ) {
        cumulativeQty -= parseFloat(txnQty);
        cumulativeValue -= parseFloat(totalAmount);
        cumulativeNetWeight -= parseFloat(netWeight);

        totalOutwards.totalQty += parseFloat(txnQty);
        totalOutwards.value += parseFloat(totalAmount);
        totalOutwards.netWeight += parseFloat(netWeight);
      }

      const transactionModel = initializeTransactionModel(
        item,
        index,
        cumulativeQty,
        cumulativeValue,
        cumulativeNetWeight,
        closingAvgPrice
      );
      finalResults.push(transactionModel);
    });

    finalResults.forEach((item, index) => {
      totalOutwards.consumption += parseFloat(item.outwardsStock.consumption || 0);
      totalOutwards.grossProfit += parseFloat(item.outwardsStock.grossProfit || 0);
    });

    const totalClosing = {
      totalQty: cumulativeQty,
      netWeight: cumulativeNetWeight,
      value: cumulativeQty
        ? parseFloat(closingAvgPrice) * parseFloat(cumulativeQty)
        : 0
    };

    return {
      transactions: finalResults,
      summary: {
        totalInwards: {
          totalQty: totalInwards.totalQty,
          netWeight: totalInwards.netWeight,
          value: totalInwards.value
        },
        totalOutwards: {
          totalQty: totalOutwards.totalQty,
          netWeight: totalOutwards.netWeight,
          value: totalOutwards.value,
          consumption: totalOutwards.consumption,
          grossProfit: totalOutwards.grossProfit
        },
        totalClosing: {
          totalQty: totalClosing.totalQty,
          netWeight: totalClosing.netWeight,
          value: totalClosing.value
        }
      }
    };
  };

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

  const columnDefs = useMemo(() => {
    const createColumn = (headerName, field, width = 300, tofixed = false) => ({
      headerName,
      field,
      width,
      cellClass: classes.agCell,
      autoHeight: true,
      cellStyle: {
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        overflowWrap: 'break-word',
        lineHeight: '1.5',
        display: 'flex',
        alignItems: 'center'
      },
      valueFormatter: (params) => {
        const value = params.value;
        if (typeof value === 'number' && tofixed) {
          return value.toFixed(2);
        }
        return value;
      }
    });

    const createGroupColumn = (headerName, children) => ({
      headerName,
      marryChildren: true,
      headerClass: classes.agCellHead,
      children
    });
    const isJewellery =
      String(localStorage.getItem('isJewellery')).toLowerCase() === 'true';
    return [
      createGroupColumn('', [createColumn('Date', 'txnDate')]),
      // createGroupColumn('', [createColumn('Particulars', 'productName', 500)]),
      createGroupColumn('', [createColumn('Vch Type', 'txnType')]),
      createGroupColumn('', [createColumn('Vch No', 'sequenceNumber')]),
      {
        headerName: 'Inwards',
        headerClass: classes.agCellHead,
        children: [
          createColumn('Quantity', 'inwardsStock.totalQty'),
          createColumn('Avg Rate', 'inwardsStock.avgPrice', '', true),
          ...(isJewellery
            ? [createColumn('Net Wt', 'inwardsStock.netWeight', '', true)]
            : []),
          createColumn('Value', 'inwardsStock.value', '', true)
        ]
      },
      {
        headerName: 'Outwards',
        headerClass: classes.agCellHead,
        children: [
          createColumn('Quantity', 'outwardsStock.totalQty'),
          createColumn('Avg Rate', 'outwardsStock.avgPrice', '', true),
          ...(isJewellery
            ? [createColumn('Net Wt', 'outwardsStock.netWeight', '', true)]
            : []),
          createColumn('Value', 'outwardsStock.value', '', true),
          createColumn('Consumed', 'outwardsStock.consumption', '', true),
          createColumn('Gross Profit', 'outwardsStock.grossProfit', '', true),
          createColumn('Perc %', 'outwardsStock.percentageProfit')
        ]
      },
      {
        headerName: 'Closing',
        headerClass: classes.agCellHead,
        children: [
          createColumn('Quantity', 'closingStock.totalQty'),
          createColumn('Avg Rate', 'closingStock.avgPrice', '', true),
          ...(isJewellery
            ? [createColumn('Net Wt', 'closingStock.netWeight', '', true)]
            : []),
          createColumn('Value', 'closingStock.value', '', true)
        ]
      }
    ];
  }, [classes.agCell, classes.agCellHead]);

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
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

  const getDataFromTxnList = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      'TRANSACTION BY PRODUCT (' + parseInt(listRowData.length || 0) + ')'
    );

    const isJewellery =
      String(localStorage.getItem('isJewellery')).toLowerCase() === 'true';

    //Add columns in the second row
    const headerRow = worksheet.getRow(2);
    if (isJewellery) {
      worksheet.getRow(2).values = [
        'DATE',
        'PARTICULARS',
        'VCH TYPE',
        'VCH NO',
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
        'DATE',
        'PARTICULARS',
        'VCH TYPE',
        'VCH NO',
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
    await prepareTxnByProductHeaderRow(filteredColumns, isJewellery);
    worksheet.columns = filteredColumns;
    // Make header row bold and color header cells
    formatHeaderRow(headerRow);

    worksheet.getCell('A1').value = '';
    if (isJewellery) {
      mergeCells(worksheet, 'B1', 'E1', '');
      mergeCells(worksheet, 'F1', 'H1', 'INWARDS');
      mergeCells(worksheet, 'I1', 'N1', 'OUTWARDS');
      mergeCells(worksheet, 'O1', 'Q1', 'CLOSING');
    } else {
      mergeCells(worksheet, 'B1', 'D1', '');
      mergeCells(worksheet, 'E1', 'G1', 'INWARDS');
      mergeCells(worksheet, 'H1', 'M1', 'OUTWARDS');
      mergeCells(worksheet, 'N1', 'P1', 'CLOSING');
    }
    for (let data of rowData) {
      let newRow = worksheet.addRow({});
      newRow.getCell('txnDate').value = data.txnDate;
      newRow.getCell('txnDate').alignment = {
        vertical: 'top',
        wrapText: true
      };
      newRow.getCell('particulars').value = data.productName;
      newRow.getCell('particulars').alignment = {
        vertical: 'top',
        wrapText: true
      };
      newRow.getCell('txnType').value = data.txnType;
      newRow.getCell('txnType').alignment = {
        vertical: 'top',
        wrapText: true
      };
      newRow.getCell('sequenceNumber').value = data.sequenceNumber;
      newRow.getCell('sequenceNumber').alignment = {
        vertical: 'top',
        wrapText: true
      };

      newRow.getCell('inwardsQty').value = parseFloat(
        data.inwardsStock.totalQty || 0
      );
      if (isJewellery)
        newRow.getCell('inwardsNetWeight').value = parseFloat(
          data.inwardsStock.netWeight || 0
        );
      newRow.getCell('inwardsRate').value = parseFloat(
        data.inwardsStock.avgPrice || 0
      );
      newRow.getCell('inwardsValue').value = parseFloat(
        data.inwardsStock.value || 0
      );
      newRow.getCell('outwardsQty').value = parseFloat(
        data.outwardsStock.totalQty || 0
      );
      if (isJewellery)
        newRow.getCell('outwardsNetWeight').value = parseFloat(
          data.outwardsStock.netWeight || 0
        );
      newRow.getCell('outwardsRate').value = parseFloat(
        data.outwardsStock.avgPrice || 0
      );
      newRow.getCell('outwardsValue').value = parseFloat(
        data.outwardsStock.value || 0
      );
      newRow.getCell('consumption').value = parseFloat(
        data.outwardsStock.consumption || 0
      );
      newRow.getCell('grossProfit').value = parseFloat(
        data.outwardsStock.grossProfit || 0
      );
      newRow.getCell('percentage').value = parseFloat(
        data.outwardsStock.percentageProfit || 0
      );
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
      let footerRow = worksheet.addRow({});
      footerRow.getCell('txnDate').value = 'TOTAL';
      footerRow.getCell('particulars').value = '';
      footerRow.getCell('txnType').value = '';
      footerRow.getCell('sequenceNumber').value = '';

      footerRow.getCell('inwardsQty').value = parseFloat(
        footerData[0].inwardsStock.totalQty || 0
      );
      if (isJewellery)
        footerRow.getCell('inwardsNetWeight').value = parseFloat(
          footerData[0].inwardsStock.netWeight || 0
        );
      footerRow.getCell('inwardsRate').value = parseFloat(
        footerData[0].inwardsStock.avgPrice || 0
      );
      footerRow.getCell('inwardsValue').value = parseFloat(
        footerData[0].inwardsStock.value || 0
      );
      footerRow.getCell('outwardsQty').value = parseFloat(
        footerData[0].outwardsStock.totalQty || 0
      );
      if (isJewellery)
        footerRow.getCell('outwardsNetWeight').value = parseFloat(
          footerData[0].outwardsStock.netWeight || 0
        );
      footerRow.getCell('outwardsRate').value = parseFloat(
        footerData[0].outwardsStock.avgPrice || 0
      );
      footerRow.getCell('outwardsValue').value = parseFloat(
        footerData[0].outwardsStock.value || 0
      );
      footerRow.getCell('consumption').value = parseFloat(
        footerData[0].outwardsStock.consumption || 0
      );
      footerRow.getCell('grossProfit').value = parseFloat(
        footerData[0].outwardsStock.grossProfit || 0
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

  return (
    <div>
      {isLoading ? (
        <BubbleLoader />
      ) : (
        <div className={classes.root} style={{ minHeight: height - 83 }}>
          {isFeatureAvailable ? (
            <Paper className={classes.root} style={{ minHeight: height - 83 }}>
              <div className={classes.content}>
                <div className={classes.contentLeft}>
                  <Typography gutterBottom variant="h4">
                    STOCK SUMMARY
                  </Typography>
                </div>
              </div>

              <Grid
                container
                direction="row"
                className={[
                  classes.sectionHeader,
                  classes.categoryActionWrapper
                ]}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginLeft: '15px',
                  marginBottom: '10px'
                }}
              >
                <div style={{ display: 'flex' }}>
                  <Button
                    color="secondary"
                    onClick={() => handleOpenTransactionByProduct(false)}
                    className={classes.filterBtn}
                  >
                    <IconButton
                      style={{
                        color: 'white',
                        fontSize: '15px',
                        padding: '5px'
                      }}
                    >
                      <ArrowBackIcon style={{ fontSize: 'inherit' }} />
                    </IconButton>
                    Back
                  </Button>
                  <Grid
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginLeft: '20px'
                    }}
                  >
                    <Typography style={{ color: '#000', fontWeight: '600' }}>
                      Product Name : {productName}
                    </Typography>
                  </Grid>
                </div>

                <Grid
                  className="category-actions-right"
                  style={{ marginRight: '20px' }}
                >
                  <Avatar>
                    <IconButton>
                      <Excel
                        onClick={() => getDataFromTxnList()}
                        fontSize="inherit"
                      />
                    </IconButton>
                  </Avatar>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                className={[
                  classes.sectionHeader,
                  classes.categoryActionWrapper
                ]}
                style={{
                  display: 'flex',
                  marginLeft: '15px',
                  marginBottom: '10px'
                }}
              >
                <FormControl style={{ marginLeft: '10px' }}>
                  <Grid item>
                    {[
                      { label: 'Sales', stateSetter: setSalesChecked },
                      {
                        label: 'Sales Return',
                        stateSetter: setSalesReturnChecked
                      },
                      { label: 'Purchase', stateSetter: setPurchaseChecked },
                      {
                        label: 'Purchase Return',
                        stateSetter: setPurchaseReturnChecked
                      },
                      {
                        label: 'Raw Material',
                        stateSetter: setRawMaterialChecked
                      },
                      {
                        label: 'Manufacture',
                        stateSetter: setManufactureChecked
                      },
                      { label: 'Add', stateSetter: setAddChecked },
                      { label: 'Remove', stateSetter: setRemoveChecked },
                      { label: 'Damaged', stateSetter: setDamagedChecked }
                    ].map(({ label, stateSetter }) => (
                      <FormControlLabel
                        key={label}
                        control={
                          <Checkbox
                            name={label.toLowerCase().replace(' ', '')}
                            defaultChecked
                            onChange={(event) => {
                              stateSetter(event.target.checked);
                              // getAllTxnList(label, event.target.checked);
                              setOnChange(true);
                            }}
                          />
                        }
                        label={label}
                        size="small"
                      />
                    ))}
                  </Grid>
                </FormControl>
              </Grid>

              <div className={classes.itemTable}>
                <Box>
                  <div
                    style={{
                      width: '100%',
                      height: `${height - 225}px`,
                      paddingLeft: '10px'
                    }}
                    className="blue-theme"
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
      {openAddSalesInvoice && <AddSalesInvoice />}
      {openAddSalesReturn && <AddCreditNote />}
      {OpenAddPurchaseBill && <AddPurchasesBill />}
      {OpenAddPurchasesReturn && <AddDebitNote />}
      {editMfgOpenDialog && <EditMfgModal />}
      {openEWayGenerateModal && <EWayGenerate />}
      {productDialogOpen && <ProductModal />}
    </div>
  );
};

export default InjectObserver(TransactionByItemV2);