import React, { useState, useEffect } from 'react';
import {
  Grid,
  makeStyles,
  Avatar,
  Button,
  FormControl,
  Typography
} from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import 'react-table/react-table.css';
import '../Expenses/ExpenseTable.css';
import { Box, TextField, IconButton, Switch } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import './vendor.css';
import useWindowDimensions from 'src/components/windowDimension';
import Excel from '../../icons/Excel';
import XLSX from 'xlsx';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import LedgerPDF from '../PDF/Ledger/LedgerPDF';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import ShareIcon from '@material-ui/icons/Share';
import AddPayment from 'src/views/sales/PaymentIn/AddPayment';
import AddnewPaymentOut from 'src/views/purchases/PaymentOut/AddPaymentOut';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import AddExpenses from 'src/views/Expenses/Modal/AddExpenses';
import AddDeliveryChallan from 'src/views/sales/DeliveryChallan/AddDeliveryChallan';
import AddSalesQuotation from 'src/views/sales/SalesQuotation/AddSalesQuotation';
import AddSaleOrder from 'src/views/sales/SaleOrder/AddSaleOrder';
import AddApproval from 'src/views/sales/Approval/AddApproval';
import AddPurchaseOrder from 'src/views/purchases/PurchaseOrder/AddPurchaseOrder';
import AddJobWorkIn from 'src/views/JobWork/OrderIn';
import AddOrderInvoice from 'src/views/JobWork/OrderInvoice';
import AddOrderReceipt from 'src/views/JobWork/OrderReceipt/AddOrderReceipt';
import * as dateHelper from 'src/components/Helpers/DateHelper';
import * as qrcodeHelper from 'src/components/Helpers/QRcodeHelper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { getSalesDataById } from 'src/components/Helpers/dbQueries/sales';
import { getSalesReturnDataById } from 'src/components/Helpers/dbQueries/salesreturn';
import { getPurchasesDataById } from 'src/components/Helpers/dbQueries/purchases';
import { getPurchasesReturnDataById } from 'src/components/Helpers/dbQueries/purchasesreturn';
import { getPaymentInDataById } from 'src/components/Helpers/dbQueries/paymentin';
import { getPaymentOutDataById } from 'src/components/Helpers/dbQueries/paymentout';
import { getExpenseDataById } from 'src/components/Helpers/dbQueries/expenses';
import { getDeliveryChallanDataById } from 'src/components/Helpers/dbQueries/deliverychallan';
import { getSalesQuotationDataById } from 'src/components/Helpers/dbQueries/salesquotation';
import { getSaleOrderDataById } from 'src/components/Helpers/dbQueries/saleorder';
import { getApprovalDataById } from 'src/components/Helpers/dbQueries/approvals';
import { getPurchaseOrderDataById } from 'src/components/Helpers/dbQueries/purchaseorder';
import { getJobWorkInDataById } from 'src/components/Helpers/dbQueries/jobworkin';
import { getJobWorkDataById } from 'src/components/Helpers/dbQueries/jobwork';
import { getJobWorkReceiptDataById } from 'src/components/Helpers/dbQueries/jobworkreceipt';
import {
  getAllLedgerTransactionListByPartyIdAndDateRange,
  getAllOutStandingTransactionListByPartyIdAndDateRange
} from 'src/components/Helpers/dbQueries/alltransactions';
import * as Bd from 'src/components/SelectedBusiness';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as fbUpload from 'src/components/Helpers/ShareDocHelper';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none'
  },

  selectFont: {
    fontSize: '14px'
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
    float: 'left'
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
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15
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
  searchInputRoot: {
    borderRadius: 50
  },
  searchInputInput: {
    padding: '7px 12px 7px 0px'
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
        marginLeft: theme.spacing(1),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  },
  sticky: {
    bottom: '0',
    color: '#fff',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '999',
    padding: '10px',
    backgroundColor: '#f6f8fa'
  },
  fText: {
    color: '#000',
    float: 'left',
    paddingLeft: '35px',
    paddingRight: '23px',
    fontWeight: 'bold'
  },
  fTextEB: {
    color: '#000',
    float: 'left',
    paddingLeft: '13px',
    paddingRight: '23px',
    fontWeight: 'bold'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  }
}));

const VendorLedger = (props) => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { height } = useWindowDimensions();
  const localenableBalance = localStorage.getItem('enableBalance');
  const [enableBalance, setEnableBalance] = useState(false);
  const [gridKey, setGridKey] = useState(0);
  const store = useStore();
  const [base64, setBase64] = useState('');

  const [fbfileUrl, setFbfileUrl] = useState('');
  const [emailId, setEmailId] = useState('');
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [showOutstanding, setOnlyOutstanding] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  // const { selectedParty } = toJS(store.VendorStore);
  const { selectedParty, vendorFromDate, vendorToDate } = toJS(
    store.VendorStore
  );
  const {
    setVendorFromDate,
    setVendorToDate,
    setVendorProperty,
    saveData,
    setIsUpdate
  } = store.VendorStore;
  const [fromDate, setFromDate] = React.useState(vendorFromDate);
  const [toDate, setToDate] = React.useState(vendorToDate);

  let [onChange, setOnChange] = useState(true);

  const [vendorLedgerTransactionList, setVendorLedgerTransactionList] =
    useState([]);

  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { vendor } = toJS(store.VendorStore);

  const { openAddSalesInvoice } = toJS(store.SalesAddStore);
  const { openAddSalesReturn } = toJS(store.ReturnsAddStore);
  const { OpenAddPurchaseBill } = toJS(store.PurchasesAddStore);
  const { OpenAddPurchasesReturn } = toJS(store.PurchasesReturnsAddStore);
  const { OpenAddPaymentOut } = toJS(store.PaymentOutStore);
  const { addExpensesDialogue } = toJS(store.ExpensesStore);
  const { OpenAddPaymentIn } = toJS(store.PaymentInStore);
  const { OpenAddDeliveryChallanInvoice } = toJS(store.DeliveryChallanStore);
  const { OpenAddsalesQuotationInvoice } = toJS(store.SalesQuotationAddStore);
  const { OpenAddSaleOrderInvoice } = toJS(store.SaleOrderStore);
  const { OpenAddApprovalInvoice } = toJS(store.ApprovalsStore);
  const { OpenAddPurchaseOrder } = toJS(store.PurchaseOrderStore);
  const { OpenAddJobWorkInvoice } = toJS(store.JobWorkInStore);
  const { OpenNewOrderInvoice } = toJS(store.JobWorkStore);
  const { openNewOrderReceipt } = toJS(store.JobWorkReceiptStore);

  const { viewOrEditSaleTxnItem } = store.SalesAddStore;
  const { viewOrEditSaleReturnTxnItem } = store.ReturnsAddStore;
  const { viewOrEditPurchaseTxnItem } = store.PurchasesAddStore;
  const { viewOrEditPurchaseReturnTxnItem } = store.PurchasesReturnsAddStore;
  const { viewOrEditPaymentInTxnItem } = store.PaymentInStore;
  const { viewOrEditPaymentOutTxnItem } = store.PaymentOutStore;
  const { viewOrEditExpenseItem } = store.ExpensesStore;
  const { viewOrEditDeliveryChallanTxnItem } = store.DeliveryChallanStore;
  const { viewOrEditSaleQuotationItem } = store.SalesQuotationAddStore;
  const { viewOrEditSaleOrderTxnItem } = store.SaleOrderStore;
  const { viewOrEditApprovalTxnItem } = store.ApprovalsStore;
  const { viewOrEditPurchaseOrderTxnItem } = store.PurchaseOrderStore;
  const { viewOrEditJobWorkInTxnItem } = store.JobWorkInStore;
  const { viewOrEditJobWorkOutItem } = store.JobWorkStore;
  const { viewOrderReceipt } = store.JobWorkReceiptStore;

  const handleCellClicked = async (event) => {
    const colId = event.column.getId();

    if ('sequenceNumber' === colId) {
      let data;
      switch (event.data.txnType) {
        case 'Sales':
        case 'KOT':
          data = await getSalesDataById(event.data.id);
          if (data) viewOrEditSaleTxnItem(data);
          break;
        case 'Purchases Return':
          data = await getPurchasesReturnDataById(event.data.id);
          if (data) viewOrEditPurchaseReturnTxnItem(data);
          break;
        case 'Purchases':
          data = await getPurchasesDataById(event.data.id);
          if (data) viewOrEditPurchaseTxnItem(data);
          break;
        case 'Sales Return':
          data = await getSalesReturnDataById(event.data.id);
          if (data) viewOrEditSaleReturnTxnItem(data);
          break;
        case 'Payment In':
          data = await getPaymentInDataById(event.data.id);
          if (data) viewOrEditPaymentInTxnItem(data);
          break;
        case 'Payment Out':
          data = await getPaymentOutDataById(event.data.id);
          if (data) viewOrEditPaymentOutTxnItem(data);
          break;
        case 'Expenses':
          data = await getExpenseDataById(event.data.id);
          if (data) viewOrEditExpenseItem(data);
          break;
        case 'Delivery Challan':
          data = await getDeliveryChallanDataById(event.data.id);
          if (data) viewOrEditDeliveryChallanTxnItem(data);
          break;
        case 'Sale Order':
          data = await getSaleOrderDataById(event.data.id);
          if (data) viewOrEditSaleOrderTxnItem(data);
          break;
        case 'Sales Quotation':
          data = await getSalesQuotationDataById(event.data.id);
          if (data) viewOrEditSaleQuotationItem(data);
          break;
        case 'Job Work In':
          data = await getJobWorkInDataById(event.data.id);
          if (data) viewOrEditJobWorkInTxnItem(data);
          break;
        case 'Purchase Order':
          data = await getPurchaseOrderDataById(event.data.id);
          if (data) viewOrEditPurchaseOrderTxnItem(data);
          break;
        case 'Approval':
          data = await getApprovalDataById(event.data.id);
          if (data) viewOrEditApprovalTxnItem(data);
          break;
        case 'Job Work Out':
          data = await getJobWorkDataById(event.data.id);
          if (data) viewOrEditJobWorkOutItem(data);
          break;
        case 'Job Work Out Receipt':
          data = await getJobWorkReceiptDataById(event.data.id);
          if (data) viewOrderReceipt(data);
          break;
        default:
          break;
      }
    }
  };

  function formatNumber(number) {
    return number.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'date',
      width: 300,
      editable: false,
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['date']) {
          result = data['date'];
        }
        var dateParts = result.split('-');
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
      }
    },
    {
      headerName: 'PARTICULARS',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data['debit'] > 0) {
          result = 'To ';
        } else if (data['credit'] > 0) {
          result = 'By  ';
        }
        result = data['customerName'] || data['vendorName'] || '';
        return result;
      }
    },
    {
      headerName: 'VCH TYPE',
      field: 'voucherType',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'VCH NO.',
      field: 'sequenceNumber',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'DEBIT',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data['debit'] == 0) {
          result = '';
        } else {
          result = formatNumber(data['debit']);
        }
        return result;
      }
    },

    {
      headerName: 'CREDIT',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data['credit'] == 0) {
          result = '';
        } else {
          result = formatNumber(data['credit']);
        }
        return result;
      }
    },
    {
      headerName: 'BALANCE',
      field: 'runningBalance',
      width: 300,
      editable: false,
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data.runningBalance !== 0) {
          if (data.runningBalance > 0) {
            result = formatNumber(Math.abs(data.runningBalance)) + ' Cr';
          } else {
            result = formatNumber(Math.abs(data.runningBalance)) + ' Dr';
          }
        }

        return result;
      }
    }
  ]);

  useEffect(() => {
    setOnChange(true);
    if (props.data && props.data == 'payable') {
    } else {
      getInvoiceSettings(localStorage.getItem('businessId'));
    }

    if (localenableBalance == 'true') {
      updateEnableBalance(localenableBalance);
    } else {
      updateEnableBalance(false);
    }
    if (invoiceRegular.strqrcode && invoiceRegular.boolQrCode) {
      qrcodeHelper
        .generateQRcode(invoiceRegular)
        .then((dataUrl) => {
          setBase64(dataUrl);
        })
        .catch((error) => {
          console.error('Error generating QR code:', error);
        });
    }
  }, []);

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDateFormat = (data) => {
    let result = '';

    if (data['date']) {
      result = data['date'];
    }
    var dateParts = result.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  };

  const getParticulars = (data) => {
    let result = '';
    if (data['debit'] > 0) {
      result = 'To ';
    } else if (data['credit'] > 0) {
      result = 'By  ';
    }
    result = data['customerName'] || data['vendorName'] || '';
    return result;
  };

  const getDataForExcel = () => {
    const wb = new Workbook();

    let data = [];
    if (vendorLedgerTransactionList && vendorLedgerTransactionList.length > 0) {
      for (var i = 0; i < vendorLedgerTransactionList.length; i++) {
        let record = {};
        record['DATE'] = getDateFormat(vendorLedgerTransactionList[i]);
        record['PARTICULARS'] = getParticulars(vendorLedgerTransactionList[i]);
        record['VCH TYPE'] = vendorLedgerTransactionList[i].voucherType;
        record['VCH NO.'] = vendorLedgerTransactionList[i].sequenceNumber;
        record['DEBIT'] = vendorLedgerTransactionList[i].debit;
        record['CREDIT'] = vendorLedgerTransactionList[i].credit;
        if (enableBalance) {
          record['BALANCE'] = vendorLedgerTransactionList[i].runningBalance;
        }

        data.push(record);
      }
    } else {
      let record = {};
      record['DATE'] = '';
      record['PARTICULARS'] = '';
      record['VCH TYPE'] = '';
      record['VCH NO.'] = '';
      record['DEBIT'] = '';
      record['CREDIT'] = '';
      if (enableBalance) {
        record['BALANCE'] = '';
      }

      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Vendor Ledger Sheet');

    wb.Sheets['Vendor Ledger Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = vendor.name + '_Ledger';

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

  useEffect(() => {
    const fetchTransactions = async () => {
      if (onChange) {
        setVendorFromDate(fromDate);
        setVendorToDate(toDate);
        setOnChange(false);

        let transactions = '';
        let fDate;
        let tDate;
        if (props.data && props.data == 'payable') {
          fDate = props.fromDate;
          tDate = props.toDate;
        } else {
          fDate = fromDate;
          tDate = toDate;
        }
        if (showOutstanding) {
          transactions =
            await getAllOutStandingTransactionListByPartyIdAndDateRange(
              selectedParty,
              fDate,
              tDate
            );
        } else {
          transactions = await getAllLedgerTransactionListByPartyIdAndDateRange(
            selectedParty,
            fDate,
            tDate
          );
        }
        setVendorLedgerTransactionList(transactions);
      }
    };

    fetchTransactions();
  }, [selectedParty, onChange]);

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  const generatePDFDocument = async (isUpload, type) => {
    let totalDebit = 0;
    let totalCredit = 0;

    if (vendorLedgerTransactionList && vendorLedgerTransactionList.length > 0) {
      for (var i = 0; i < vendorLedgerTransactionList.length; i++) {
        totalDebit += parseFloat(vendorLedgerTransactionList[i].debit);
        totalCredit += parseFloat(vendorLedgerTransactionList[i].credit);
      }
    }

    const total = {
      totalDebit: totalDebit,
      totalCredit: totalCredit
    };

    const blob = await pdf(
      <LedgerPDF
        data={vendorLedgerTransactionList}
        settings={invoiceRegular}
        party={vendor}
        total={total}
        fromDate={fromDate}
        toDate={toDate}
        base64={base64}
        enableBalance={enableBalance}
      />
    ).toBlob();

    if (isUpload) {
      handleClose();
      const pdfFile = new File([blob], `${vendor.name}_Ledger.pdf`, {
        type: 'application/pdf'
      });
      if (type == 1) {
        shareOnWhatsapp(pdfFile, vendor.name + '_Ledger.pdf');
      } else {
        shareOnEmail(pdfFile, vendor.name + '_Ledger.pdf');
      }
    } else {
      saveAs(blob, vendor.name + '_Ledger.pdf');
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

  const getTotalDebit = () => {
    let totalDebit = 0;
    if (vendorLedgerTransactionList && vendorLedgerTransactionList.length > 0) {
      for (var i = 0; i < vendorLedgerTransactionList.length; i++) {
        totalDebit += parseFloat(vendorLedgerTransactionList[i].debit || 0);
      }
    }
    return totalDebit;
  };

  const getTotalCredit = () => {
    let totalCredit = 0;
    if (vendorLedgerTransactionList && vendorLedgerTransactionList.length > 0) {
      for (var i = 0; i < vendorLedgerTransactionList.length; i++) {
        totalCredit += parseFloat(vendorLedgerTransactionList[i].credit || 0);
      }
    }
    return totalCredit;
  };

  const getClosingBalanceCredit = () => {
    let closingBalance = 0;
    const a = getTotalDebit();
    const b = getTotalCredit();
    if (a > b) {
      closingBalance = Math.abs(a - b);
    }
    return closingBalance;
  };
  const getClosingBalanceDebit = () => {
    let closingBalance = 0;
    const a = getTotalDebit();
    const b = getTotalCredit();
    if (b > a) {
      closingBalance = Math.abs(a - b);
    }
    return closingBalance;
  };

  const updateEnableBalance = (isVisible) => {
    setEnableBalance(isVisible);
    const updatedColumnDefs = columnDefs.map((columnDef) => {
      if (columnDef.field === 'runningBalance') {
        return { ...columnDef, hide: !isVisible };
      }
      return columnDef;
    });
    setColumnDefs(updatedColumnDefs);
    setGridKey((prevKey) => prevKey + 1);
    localStorage.setItem('enableBalance', isVisible);
  };

  const formatDateForLedger = (inputDate) => {
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = new Date(inputDate).toLocaleDateString(
      'en-GB',
      options
    );
    return formattedDate;
  };

  const getPendingBalanceToReceiveOrPay = () => {
    let balance = Math.abs(
      parseFloat(getTotalDebit()) - parseFloat(getTotalCredit())
    );
    if (parseFloat(getTotalDebit()) > parseFloat(getTotalCredit())) {
      balance += ' Dr';
    } else if (parseFloat(getTotalDebit()) < parseFloat(getTotalCredit())) {
      balance += ' Cr';
    } else {
      balance = 'No Pending Balance';
    }
    return balance;
  };

  const handleSendPDFViaWhatsApp = async (fileUrl) => {
    const API_SERVER = window.REACT_APP_API_SERVER;

    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;

    const pdfSendReq = {
      businessId: businessId,
      businessCity: businessCity,
      pdfUrl: fileUrl,
      phoneNumber: vendor.phoneNo,
      customerName: vendor.name,
      ledgerBalance: getPendingBalanceToReceiveOrPay(),
      ledgerDate: formatDateForLedger(toDate),
      ledgerFileName: vendor.name + '_Ledger.pdf'
    };

    await axios
      .post(`${API_SERVER}/pos/v1/whatsApp/sendLedger`, pdfSendReq)
      .then((response) => {
        if (response && response.data && response.data.success === true) {
          toast.info('Ledger sent successfully', {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: true
          });
        } else {
          toast.error(
            'Something went wrong while sharing ledger. Please try again!',
            {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: true
            }
          );
        }
      })
      .catch((err) => {
        toast.error(
          'Something went wrong while sharing ledger. Please try again!',
          {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: true
          }
        );
        console.log(err);
        throw err;
      });
  };

  const handleSendPDFViaEmail = async (fileUrl, email) => {
    const API_SERVER = window.REACT_APP_API_SERVER;

    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;

    const pdfSendReq = {
      businessId: businessId,
      businessCity: businessCity,
      pdfUrl: fileUrl,
      email: vendor.emailId !== '' ? vendor.emailId : email,
      customerName: vendor.name,
      ledgerBalance: getPendingBalanceToReceiveOrPay(),
      ledgerDate: formatDateForLedger(toDate),
      ledgerFileName: vendor.name + '_Ledger.pdf'
    };

    await axios
      .post(`${API_SERVER}/pos/v1/email/sendLedger`, pdfSendReq)
      .then((response) => {
        if (response && response.data && response.data.success === true) {
          toast.info('Ledger sent successfully', {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: true
          });
        } else {
          toast.error(
            'Something went wrong while sharing ledger. Please try again!',
            {
              position: toast.POSITION.BOTTOM_CENTER,
              autoClose: true
            }
          );
        }
      })
      .catch((err) => {
        toast.error(
          'Something went wrong while sharing ledger. Please try again!',
          {
            position: toast.POSITION.BOTTOM_CENTER,
            autoClose: true
          }
        );
        console.log(err);
        throw err;
      });
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const shareOnWhatsapp = async (pdfFile, pdfName) => {
    try {
      const fileUrl = await fbUpload.uploadToFirebase(pdfFile, pdfName);
      console.log('fileUrl', fileUrl);
      handleSendPDFViaWhatsApp(fileUrl);
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  };

  const shareOnEmail = async (pdfFile, pdfName) => {
    try {
      const fileUrl = await fbUpload.uploadToFirebase(pdfFile, pdfName);
      setFbfileUrl(fileUrl);
      if (vendor.emailId != '') {
        handleSendPDFViaEmail(fileUrl, emailId);
      } else {
        setEmailEmpty(true);
      }
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  };

  const handleCloseemailEmptyModel = () => {
    setEmailEmpty(false);
  };

  const updateEmailID = () => {
    if (emailId) {
      setIsUpdate();
      setVendorProperty('emailId', emailId);
      setEmailEmpty(false);
      saveData(false);
      handleSendPDFViaEmail(fbfileUrl, emailId);
      // console.log("customer", customer);
    } else {
      toast.error('Email Id should not be empty!!!', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: true
      });
    }
  };

  return (
    <div>
      <Grid
        container
        direction="row"
        spacing={2}
        alignItems="center"
        justifyContent="center"
      >
        <Grid item xs={12} sm={12}>
          <div className={classes.content}>
            <Grid item xs={12} sm={10}>
              <div>
                {!props.data && (
                  <>
                    <form className={classes.blockLine} noValidate>
                      <TextField
                        id="date"
                        label="From"
                        type="date"
                        value={fromDate}
                        onChange={(e) => {
                          setOnChange(true);
                          setFromDate(
                            dateHelper.formatDateToYYYYMMDD(e.target.value)
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
                        onChange={(e) => {
                          setOnChange(true);
                          setToDate(
                            dateHelper.formatDateToYYYYMMDD(e.target.value)
                          );
                        }}
                        className={classes.textField}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                    </form>
                  </>
                )}
                <FormControlLabel
                  style={{ marginTop: '10px',marginRight:'0px' }}
                  className={classes.blockLine}
                  control={
                    <Switch
                      checked={enableBalance}
                      onChange={(e) => {
                        updateEnableBalance(e.target.checked);
                      }}
                    />
                  }
                  label="Enable Balance"
                />
                <FormControlLabel
                  style={{ marginTop: '10px' }}
                  className={classes.blockLine}
                  control={
                    <Switch
                      checked={showOutstanding}
                      onChange={(e) => {
                        setOnlyOutstanding(e.target.checked);
                        setOnChange(true);
                      }}
                    />
                  }
                  label="Outstanding"
                />
              </div>
            </Grid>
            <Grid item xs={2}>
              <div>
                <Grid container className={classes.categoryActionWrapper}>
                  {/* <Grid item xs={6}></Grid> */}
                  <Grid item xs={4}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton onClick={() => getDataForExcel()}>
                          <Excel fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton
                          onClick={() => generatePDFDocument(false, 0)}
                        >
                          <PDFIcon fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                    </Grid>
                  </Grid>
                  <Grid item xs={4}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton
                          id="basic-button"
                          aria-controls={open ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={handleClick}
                        >
                          <ShareIcon fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                    </Grid>
                  </Grid>
                  <Menu
                    id="basic-menu"
                    style={{ marginTop: '50px', marginLeft: '-20px' }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button'
                    }}
                  >
                    <MenuItem onClick={() => generatePDFDocument(true, 1)}>
                      Share via Whatsapp
                    </MenuItem>
                    <MenuItem onClick={() => generatePDFDocument(true, 2)}>
                      Share via Email
                    </MenuItem>
                  </Menu>
                </Grid>
              </div>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12}>
          <Box mt={4} style={{ marginTop: '0px' }}>
            <div
              id="product-list-grid"
              className="red-theme "
              style={{ width: '100%', height: height - 350 + 'px' }}
            >
              <div
                id="product-list-grid"
                style={{ height: '97%', width: '100%' }}
                className="ag-theme-material"
              >
                <AgGridReact
                  key={gridKey}
                  onGridReady={onGridReady}
                  enableRangeSelection
                  paginationPageSize={10}
                  suppressMenuHide
                  rowData={vendorLedgerTransactionList}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  rowSelection="single"
                  pagination
                  headerHeight={40}
                  rowClassRules={rowClassRules}
                  onCellClicked={handleCellClicked}
                  // frameworkComponents={{
                  //   templateMoreOptionRenderer: TemplateMoreOptionRenderer
                  // }}
                  overlayLoadingTemplate={
                    '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                  }
                  overlayNoRowsTemplate={
                    '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                  }
                />

                <div className={classes.sticky}>
                  <Grid
                    container
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #00000030'
                    }}
                    className={classes.categoryActionWrapper}
                  >
                    {enableBalance ? (
                      <>
                        <Grid item xs={7}></Grid>
                        <Grid item xs={2}>
                          <div className={classes.fTextEB}>
                            {getTotalDebit() == 0
                              ? ''
                              : formatNumber(getTotalDebit())}
                          </div>
                        </Grid>
                        <Grid item xs={2}>
                          <div className={classes.fTextEB}>
                            {getTotalCredit() == 0
                              ? ''
                              : formatNumber(getTotalCredit())}
                          </div>
                        </Grid>
                        <Grid item xs={1}></Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2}>
                          <div className={classes.fText}>
                            {getTotalDebit() == 0
                              ? ''
                              : formatNumber(getTotalDebit())}
                          </div>
                        </Grid>
                        <Grid item xs={2}>
                          <div className={classes.fText}>
                            {getTotalCredit() == 0
                              ? ''
                              : formatNumber(getTotalCredit())}
                          </div>
                        </Grid>
                      </>
                    )}
                  </Grid>
                  <Grid
                    container
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #00000030'
                    }}
                    className={classes.categoryActionWrapper}
                  >
                    <Grid item xs={2}>
                      <div className={classes.fText}>To</div>
                    </Grid>
                    {enableBalance ? (
                      <Grid item xs={3}>
                        <div className={classes.fText}>Closing Balance</div>
                      </Grid>
                    ) : (
                      <Grid item xs={4}>
                        <div className={classes.fText}>Closing Balance</div>
                      </Grid>
                    )}
                    <Grid item xs={2}></Grid>
                    <Grid item xs={2}>
                      {getClosingBalanceDebit() !== 0 && (
                        <div
                          className={
                            !enableBalance ? classes.fText : classes.fTextEB
                          }
                        >
                          {formatNumber(getClosingBalanceDebit())}
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={2}>
                      {getClosingBalanceCredit() !== 0 && (
                        <div
                          className={
                            !enableBalance ? classes.fText : classes.fTextEB
                          }
                        >
                          {formatNumber(getClosingBalanceCredit())}
                        </div>
                      )}
                    </Grid>
                    <Grid item xs={1}></Grid>
                  </Grid>
                  <Grid
                    container
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #00000030'
                    }}
                    className={classes.categoryActionWrapper}
                  >
                    {enableBalance ? (
                      <>
                        <Grid item xs={7}></Grid>
                        <Grid item xs={2}>
                          <div className={classes.fTextEB}>
                            {formatNumber(
                              parseFloat(getTotalDebit()) +
                                parseFloat(getClosingBalanceDebit())
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={2}>
                          <div className={classes.fTextEB}>
                            {formatNumber(
                              parseFloat(getTotalCredit()) +
                                parseFloat(getClosingBalanceCredit())
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={1}></Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2}>
                          <div className={classes.fText}>
                            {formatNumber(
                              parseFloat(getTotalDebit()) +
                                parseFloat(getClosingBalanceDebit())
                            )}
                          </div>
                        </Grid>
                        <Grid item xs={2}>
                          <div className={classes.fText}>
                            {formatNumber(
                              parseFloat(getTotalCredit()) +
                                parseFloat(getClosingBalanceCredit())
                            )}
                          </div>
                        </Grid>
                      </>
                    )}
                  </Grid>
                </div>
              </div>
            </div>
          </Box>
        </Grid>
      </Grid>

      <Dialog
        maxWidth="sm"
        open={emailEmpty}
        classes={{ paper: classes.paper }}
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>
                  Customer Email Address is empty. Please fill Email address to
                  proceed.
                </p>
              </div>
            </div>
            <FormControl fullWidth>
              <Typography variant="subtitle1">Email</Typography>
              <TextField
                fullWidth
                variant="outlined"
                margin="dense"
                type="text"
                placeholder="Enter Email"
                className="customTextField"
                value={emailId}
                onChange={(event) => setEmailId(event.target.value)}
              />
            </FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseemailEmptyModel}
            color="primary"
            autoFocus
          >
            CANCEL
          </Button>
          <Button onClick={(e) => updateEmailID()} color="primary" autoFocus>
            PROCEED TO SHARE
          </Button>
        </DialogActions>
      </Dialog>

      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openAddSalesReturn ? <AddCreditNote /> : null}
      {OpenAddPurchaseBill ? <AddPurchasesBill /> : null}
      {OpenAddPurchasesReturn ? <AddDebitNote /> : null}
      {OpenAddPaymentIn ? <AddPayment /> : null}
      {OpenAddPaymentOut ? <AddnewPaymentOut /> : null}
      {addExpensesDialogue ? <AddExpenses /> : null}
      {OpenAddDeliveryChallanInvoice ? <AddDeliveryChallan /> : null}
      {OpenAddsalesQuotationInvoice ? <AddSalesQuotation /> : null}
      {OpenAddSaleOrderInvoice ? <AddSaleOrder /> : null}
      {OpenAddApprovalInvoice ? <AddApproval /> : null}
      {OpenAddPurchaseOrder ? <AddPurchaseOrder /> : null}
      {OpenAddJobWorkInvoice ? <AddJobWorkIn /> : null}
      {OpenNewOrderInvoice ? <AddOrderInvoice /> : null}
      {openNewOrderReceipt ? <AddOrderReceipt /> : null}
    </div>
  );
};

export default InjectObserver(VendorLedger);