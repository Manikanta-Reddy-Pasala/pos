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
  Checkbox,
  FormControl,
  FormControlLabel
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import TextField from '@material-ui/core/TextField';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import * as Db from '../../../../RxDb/Database/Database';
import NoPermission from '../../../noPermission';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import { getProductTxnListByDateAndProduct } from 'src/components/Helpers/ProductTxnQueryHelper';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import { toJS } from 'mobx';
import EditMfgModal from 'src/components/modal/EditMfgModal';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
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

const TransactionByItem = () => {
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

  const [totalSalesQty, setTotalSalesQty] = useState(0);
  const [totalSalesReturnQty, setTotalSalesReturnQty] = useState(0);
  const [totalPurchasesQty, setTotalPurchasesQty] = useState(0);
  const [totalPurchasesReturnQty, setTotalPurchasesReturnQty] = useState(0);
  const [totalManufactureQty, setTotalManufactureQty] = useState(0);
  const [totalRawMaterialQty, setTotalRawMaterialQty] = useState(0);
  const [totalInQty, setTotalInQty] = useState(0);
  const [totalOutQty, setTotalOutQty] = useState(0);

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

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    if ('sequenceNumber' === colId) {
      if ('Sales' === event.data.txnType || 'KOT' === event.data.txnType) {
        const query = db.sales.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { invoice_number: { $eq: event.data.txnId } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (!data) {
              // No Sales data is not found so cannot update any information
              return;
            }

            viewOrEditSaleTxnItem(data);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Purchases Return' === event.data.txnType) {
        const query = db.purchasesreturn.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { purchase_return_number: { $eq: event.data.txnId } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (!data) {
              // No Sales data is not found so cannot update any information
              return;
            }

            let clone = JSON.parse(JSON.stringify(data));
            viewOrEditPurchaseReturnTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Purchases' === event.data.txnType) {
        const query = db.purchases.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { bill_number: { $eq: event.data.txnId } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (!data) {
              // No Sales data is not found so cannot update any information
              return;
            }

            viewOrEditPurchaseTxnItem(data);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Sales Return' === event.data.txnType) {
        const query = db.salesreturn.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sales_return_number: { $eq: event.data.txnId } }
            ]
          }
        });
        query
          .exec()
          .then(async (data) => {
            if (!data) {
              // No Sales data is not found so cannot update any information
              return;
            }

            let clone = JSON.parse(JSON.stringify(data));
            viewOrEditSaleReturnTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Manufacture' === event.data.txnType) {
        db.producttxn
          .find({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { txnId: { $eq: event.data.txnId } },
                { txnType: { $eq: event.data.txnType } }
              ]
            }
          })
          .exec()
          .then(async (data) => {
            if (!data) {
              // No data is available
              return;
            }

            updateProductFromManufacture(data);
          });
      } else if ('Raw Material' === event.data.txnType) {
        if (event.data.txnId.startsWith('m')) {
          db.producttxn
            .findOne({
              selector: {
                $and: [
                  { businessId: { $eq: businessData.businessId } },
                  { txnId: { $eq: event.data.txnId } },
                  { txnType: { $eq: 'Manufacture' } }
                ]
              }
            })
            .exec()
            .then(async (data) => {
              if (!data) {
                // No data is available
                return;
              }

              updateProductFromManufacture(data);
            });
        } else {
          const query = db.sales.findOne({
            selector: {
              $and: [
                { businessId: { $eq: businessData.businessId } },
                { invoice_number: { $eq: event.data.txnId } }
              ]
            }
          });
          query
            .exec()
            .then(async (data) => {
              if (!data) {
                // No Sales data is not found so cannot update any information
                return;
              }

              viewOrEditSaleTxnItem(data);
            })
            .catch((err) => {
              console.log('Internal Server Error', err);
            });
        }
      }
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'NO',
      field: 'sequenceNumber',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle,
      width: 90,
      minWidth: 100
    },
    {
      headerName: 'DATE',
      field: 'txnDate',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100
    },
    {
      headerName: 'TYPE',
      field: 'txnType',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100
    },
    {
      headerName: 'NAME',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        let data = params['data'];
        let name = '';
        if (data.customerName && data.customerName !== undefined) {
          name = data.customerName;
        } else if (data.vendorName && data.vendorName !== undefined) {
          name = data.vendorName;
        }

        return name;
      }
    },
    {
      headerName: 'QUANTITY',
      field: 'txnQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        let data = params['data'];
        let qtyName = parseFloat(data.txnQty).toFixed(2);
        if (data.qtyUnit && data.qtyUnit !== '') {
          qtyName += ' ' + data.qtyUnit;
        }

        return qtyName;
      }
    },
    {
      headerName: 'FREE QUANTITY',
      field: 'freeTxnQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        let data = params['data'];
        let qtyName = parseFloat(data.freeTxnQty).toFixed(2);
        if (data.qtyUnit && data.qtyUnit !== '') {
          qtyName += ' ' + data.qtyUnit;
        }

        return qtyName;
      }
    },
    {
      headerName: 'CLOSING STOCK',
      field: 'stockQty',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        let data = params['data'];
        let finalStock = 0;
        if (
          'Sales' === data.txnType ||
          'KOT' === data.txnType ||
          'Purchases Return' === data.txnType ||
          'Raw Material' === data.txnType
        ) {
          finalStock = data.stockQty - data.txnQty;
        } else if (
          'Purchases' === data.txnType ||
          'Sales Return' === data.txnType ||
          'Manufacture' === data.txnType
        ) {
          finalStock = data.stockQty + data.txnQty;
        }
        return parseFloat(finalStock).toFixed(2);
      }
    },
    {
      headerName: 'PRICE/UNIT',
      field: 'saleAmount',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      width: 90,
      minWidth: 100,
      valueFormatter: (params) => {
        let data = params['data'];
        let price = 0;
        if (
          'Sales' === data.txnType ||
          'KOT' === data.txnType ||
          'Sales Return' === data.txnType ||
          'Raw Material' === data.txnType ||
          'Manufacture' === data.txnType
        ) {
          price = parseFloat(data.amount) - parseFloat(data.taxAmount);
        } else if (
          'Purchases' === data.txnType ||
          'Purchases Return' === data.txnType
        ) {
          price = data.purchased_price_before_tax;
        }

        return parseFloat(price).toFixed(2);
      }
    }
  ]);

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  function getName(data) {
    let name = '';
    if (data.customerName && data.customerName !== undefined) {
      name = data.customerName;
    } else if (data.vendorName && data.vendorName !== undefined) {
      name = data.vendorName;
    }

    return name;
  }

  function getQuantityWithUnits(data) {
    let qtyName = data.txnQty;
    if (data.qtyUnit && data.qtyUnit !== '') {
      qtyName += ' ' + data.qtyUnit;
    }

    return qtyName;
  }

  function getFreeQuantityWithUnits(data) {
    let qtyName = data.freeTxnQty;
    if (data.qtyUnit && data.qtyUnit !== '') {
      qtyName += ' ' + data.qtyUnit;
    }

    return qtyName;
  }

  function getPricePerUnit(data) {
    let price = 0;
    if (
      'Sales' === data.txnType ||
      'KOT' === data.txnType ||
      'Sales Return' === data.txnType ||
      'Raw Material' === data.txnType ||
      'Manufacture' === data.txnType
    ) {
      price = parseFloat(data.amount) - parseFloat(data.taxAmount);
    } else if (
      'Purchases' === data.txnType ||
      'Purchases Return' === data.txnType
    ) {
      price = data.purchased_price_before_tax;
    }

    return parseFloat(price).toFixed(2);
  }

  function getStockInHand(data) {
    let finalStock = 0;
    if (
      'Sales' === data.txnType ||
      'KOT' === data.txnType ||
      'Purchases Return' === data.txnType ||
      'Raw Material' === data.txnType
    ) {
      finalStock = data.stockQty - data.txnQty;
    } else if (
      'Purchases' === data.txnType ||
      'Sales Return' === data.txnType ||
      'Manufacture' === data.txnType
    ) {
      finalStock = data.stockQty + data.txnQty;
    }
    return parseFloat(finalStock).toFixed(2);
  }

  const getDataFromSalesByItemReport = () => {
    const wb = new Workbook();

    let data = [];

    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        const record = {
          DATE: rowData[i].txnDate,
          TYPE: rowData[i].txnType,
          NO: rowData[i].sequenceNumber,
          NAME: getName(rowData[i]),
          QUANTITY: getQuantityWithUnits(rowData[i]),
          'FREE QUANTITY': getFreeQuantityWithUnits(rowData[i].freeTxnQty),
          'STOCK QUANTITY': getStockInHand(rowData[i]),
          'PRICE/UNIT': getPricePerUnit(rowData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        TYPE: '',
        NO: '',
        NAME: '',
        QUANTITY: '',
        'FREE QUANTITY': '',
        'STOCK QUANTITY': '',
        'PRICE/UNIT': ''
      };
      data.push(record);
    }

    const emptyRecord = {};
    data.push(emptyRecord);
    data.push(emptyRecord);

    const saleQtyRecord = {
      DATE: 'Total Sale Qty',
      TYPE: totalSalesQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(saleQtyRecord);

    const saleReturnQtyRecord = {
      DATE: 'Total Sale Return Qty',
      TYPE: totalSalesReturnQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(saleReturnQtyRecord);

    const purchaseQtyRecord = {
      DATE: 'Total Purchase Qty',
      TYPE: totalPurchasesQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(purchaseQtyRecord);

    const purchaseReturnQtyRecord = {
      DATE: 'Total Purchase Return Qty',
      TYPE: totalPurchasesReturnQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(purchaseReturnQtyRecord);

    const manufactureQtyRecord = {
      DATE: 'Total Manufacture Qty',
      TYPE: totalManufactureQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(manufactureQtyRecord);

    const rawMaterialQtyRecord = {
      DATE: 'Total Raw Material Qty',
      TYPE: totalRawMaterialQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(rawMaterialQtyRecord);

    const qtyInRecord = {
      DATE: 'Total Qty In',
      TYPE: totalInQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(qtyInRecord);

    const qtyOutRecord = {
      DATE: 'Total Qty Out',
      TYPE: totalOutQty,
      NO: '',
      NAME: '',
      QUANTITY: '',
      'FREE QUANTITY': '',
      'PRICE/UNIT': ''
    };
    data.push(qtyOutRecord);

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Transaction Item Report Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Transaction Item Report Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Transaction_By_Item_Report';

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
    setproductlist([]);
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

  const getAllTxnList = async (checkBoxType, value) => {
    const db = await Db.get();

    let salesSelected = salesChecked;
    let salesReturnSelected = salesReturnChecked;
    let purchaseSelected = purchaseChecked;
    let purchaseReturnSelected = purchaseReturnChecked;
    let rawMaterialSelected = rawMaterialChecked;
    let manufactureSelected = manufactureChecked;

    let fromDateSelected = fromDate;
    let toDateSelected = toDate;

    if (checkBoxType === 'Sales') {
      salesSelected = value;
    } else if (checkBoxType === 'Sales Return') {
      salesReturnSelected = value;
    } else if (checkBoxType === 'Purchase') {
      purchaseSelected = value;
    } else if (checkBoxType === 'Purchase Return') {
      purchaseReturnSelected = value;
    } else if (checkBoxType === 'Raw Material') {
      rawMaterialSelected = value;
    } else if (checkBoxType === 'Manufacture') {
      manufactureSelected = value;
    } else if (checkBoxType === 'From Date') {
      fromDateSelected = value;
    } else if (checkBoxType === 'To Date') {
      toDateSelected = value;
    }

    if (selectedProduct) {
      let txndata = await getProductTxnListByDateAndProduct(
        db,
        selectedProduct.productId,
        fromDateSelected,
        toDateSelected,
        salesSelected,
        salesReturnSelected,
        purchaseSelected,
        purchaseReturnSelected,
        rawMaterialSelected,
        manufactureSelected
      );
      calculateAggrigatedValues(txndata);

      setRowData(txndata);
    }
  };

  const handleProductClick = async (option) => {
    setProductName(option.name);
    setSelectedProduct(option);
    setProductNameWhileEditing('');

    setproductlist([]);

    const db = await Db.get();

    let txndata = await getProductTxnListByDateAndProduct(
      db,
      option.productId,
      fromDate,
      toDate,
      salesChecked,
      salesReturnChecked,
      purchaseChecked,
      purchaseReturnChecked,
      rawMaterialChecked,
      manufactureChecked
    );
    calculateAggrigatedValues(txndata);
    setRowData(txndata);
  };

  const calculateAggrigatedValues = async (txnData) => {
    let totalSalesQty = 0;
    let totalSalesReturnQty = 0;
    let totalPurchasesQty = 0;
    let totalPurchasesReturnQty = 0;

    let totalManufactureQty = 0;
    let totalRawMaterialQty = 0;

    let totalInQty = 0;
    let totalOutQty = 0;

    txnData.forEach((res) => {
      if (res.txnType === 'Sales' || res.txnType === 'KOT') {
        totalSalesQty += res.txnQty;
      } else if (res.txnType === 'Sales Return') {
        totalSalesReturnQty += res.txnQty;
      } else if (res.txnType === 'Purchases') {
        totalPurchasesQty += res.txnQty;
      } else if (res.txnType === 'Purchases Return') {
        totalPurchasesReturnQty += res.txnQty;
      } else if (res.txnType === 'Raw Material') {
        totalRawMaterialQty += res.txnQty;
      } else if (res.txnType === 'Manufacture') {
        totalManufactureQty += res.txnQty;
      }
    });

    totalInQty = totalPurchasesQty + totalSalesReturnQty;
    totalOutQty = totalSalesQty + totalPurchasesReturnQty;

    //set env variables
    setTotalSalesQty(totalSalesQty);
    setTotalSalesReturnQty(totalSalesReturnQty);
    setTotalPurchasesQty(totalPurchasesQty);
    setTotalPurchasesReturnQty(totalPurchasesReturnQty);
    setTotalInQty(totalInQty);
    setTotalOutQty(totalOutQty);
    setTotalRawMaterialQty(totalRawMaterialQty);
    setTotalManufactureQty(totalManufactureQty);
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

  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

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
                    TRANSACTIONS BY PRODUCT
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
                            getAllTxnList(
                              'From Date',
                              formatDate(e.target.value)
                            );
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
                            getAllTxnList(
                              'To Date',
                              formatDate(e.target.value)
                            );
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
                              setSelectedProduct({});
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
                    </Grid>
                  </Grid>
                </Grid>
              </div>

              <Grid
                container
                direction="row"
                spacing={2}
                className={classes.sectionHeader}
                style={{
                  display: 'flex',
                  marginLeft: '15px',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                  marginTop: '25px'
                }}
              >
                <FormControl>
                  <Grid item style={{ width: '100%' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="sales"
                          defaultChecked="true"
                          onChange={(event) => {
                            setSalesChecked(event.target.checked);
                            getAllTxnList('Sales', event.target.checked);
                          }}
                        />
                      }
                      label={`Sales`}
                      size="small"
                    />

                    <FormControlLabel
                      control={
                        <Checkbox
                          name="salesReturn"
                          defaultChecked="true"
                          onChange={(event) => {
                            setSalesReturnChecked(event.target.checked);
                            getAllTxnList('Sales Return', event.target.checked);
                          }}
                        />
                      }
                      label={`Sales Return`}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="purchase"
                          defaultChecked="true"
                          onChange={(event) => {
                            setPurchaseChecked(event.target.checked);
                            getAllTxnList('Purchase', event.target.checked);
                          }}
                        />
                      }
                      label={`Purchase`}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="purchaseReturn"
                          defaultChecked="true"
                          onChange={(event) => {
                            setPurchaseReturnChecked(event.target.checked);
                            getAllTxnList(
                              'Purchase Return',
                              event.target.checked
                            );
                          }}
                        />
                      }
                      label={`Purchase Return`}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="rawMaterial"
                          defaultChecked="true"
                          onChange={(event) => {
                            setRawMaterialChecked(event.target.checked);
                            getAllTxnList('Raw Material', event.target.checked);
                          }}
                        />
                      }
                      label={`Raw Material`}
                      size="small"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="manufacture"
                          defaultChecked="true"
                          onChange={(event) => {
                            setManufactureChecked(event.target.checked);
                            getAllTxnList('Manufacture', event.target.checked);
                          }}
                        />
                      }
                      label={`Manufacture`}
                      size="small"
                    />
                  </Grid>
                </FormControl>
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
                      xs={3}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Sale Qty :{' '}
                          {parseFloat(totalSalesQty).toFixed(2)}{' '}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total Sale Return Qty :{' '}
                          {parseFloat(totalSalesReturnQty).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Purchase Qty :{' '}
                          {parseFloat(totalPurchasesQty).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total Purchase Return Qty :{' '}
                          {parseFloat(totalPurchasesReturnQty).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Manufacture Qty :{' '}
                          {parseFloat(totalManufactureQty).toFixed(2)}{' '}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total Raw Material Qty :{' '}
                          {parseFloat(totalRawMaterialQty).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Grid item>
                        <Typography>
                          Total Qty In : {parseFloat(totalInQty).toFixed(2)}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography>
                          Total Qty Out : {parseFloat(totalOutQty).toFixed(2)}
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
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openAddSalesReturn ? <AddCreditNote /> : null}
      {OpenAddPurchaseBill ? <AddPurchasesBill /> : null}
      {OpenAddPurchasesReturn ? <AddDebitNote /> : null}
      {editMfgOpenDialog ? <EditMfgModal /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(TransactionByItem);