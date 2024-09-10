import React, { useState, useEffect, useRef } from 'react';
import { Grid, makeStyles, Avatar } from '@material-ui/core';
import 'react-table/react-table.css';
import { Box, TextField, IconButton, Switch } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import './customer.css';
import useWindowDimensions from 'src/components/windowDimension';
import Excel from 'src/icons/Excel';
import XLSX from 'xlsx';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import LedgerPDF from 'src/views/PDF/Ledger/LedgerPDF';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
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
import { getAllLedgerTransactionListByPartyIdAndDateRangeAndHavingBalance } from 'src/components/Helpers/dbQueries/alltransactions';

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

const CustomerLedger = () => {
  const gridRef = useRef(null);
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [enableBalance, setEnableBalance] = useState(false);
  const [rowWidth, setRowWidth] = useState(300);
  const { height } = useWindowDimensions();
  const localenableBalance = localStorage.getItem('enableBalance');

  const store = useStore();
  // const { selectedParty } = toJS(store.CustomerStore);
  const { selectedParty, custFromDate, custToDate } = toJS(store.CustomerStore);
  const { setCustFromDate, setCustToDate } = store.CustomerStore;

  const { invoiceRegular } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { customer } = toJS(store.CustomerStore);

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

  const [fromDate, setFromDate] = React.useState(custFromDate);
  const [toDate, setToDate] = React.useState(custToDate);

  let [onChange, setOnChange] = useState(true);

  const [customerLedgerTransactionList, setCustomerLedgerTransactionList] =
    useState([]);

  const invoiceNumberCellStyle = (params) => {
    return { fontWeight: 500, textDecoration: 'underline', cursor: 'pointer' };
  };

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
  const [gridKey, setGridKey] = useState(0);
  const [columnDefs, setColumnDefs] = useState([
    {
      headerName: 'DATE',
      field: 'date',
      width: rowWidth,
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
      width: rowWidth,
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
      field: 'txnType',
      width: rowWidth,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'VCH NO.',
      field: 'sequenceNumber',
      width: rowWidth,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DEBIT',
      field: 'debit',
      width: rowWidth,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'CREDIT',
      field: 'credit',
      width: rowWidth,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'BALANCE',
      field: 'runningBalance',
      width: rowWidth,
      editable: false,
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      hide: true
    }
  ]);

  useEffect(() => {
    setOnChange(true);

    getInvoiceSettings(localStorage.getItem('businessId'));
    if (localenableBalance) {
      updateEnableBalance(localenableBalance);
    } else {
      updateEnableBalance(false);
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

  const getTotalDebit = () => {
    // console.log('customerLedgerTransactionList', customerLedgerTransactionList);
    let totalDebit = 0;
    if (
      customerLedgerTransactionList &&
      customerLedgerTransactionList.length > 0
    ) {
      for (var i = 0; i < customerLedgerTransactionList.length; i++) {
        totalDebit += parseFloat(customerLedgerTransactionList[i].debit || 0);
      }
    }
    return totalDebit;
  };

  const getTotalCredit = () => {
    let totalCredit = 0;
    if (
      customerLedgerTransactionList &&
      customerLedgerTransactionList.length > 0
    ) {
      for (var i = 0; i < customerLedgerTransactionList.length; i++) {
        totalCredit += parseFloat(customerLedgerTransactionList[i].credit || 0);
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

  const getDataForExcel = () => {
    const wb = new Workbook();

    let data = [];
    if (
      customerLedgerTransactionList &&
      customerLedgerTransactionList.length > 0
    ) {
      for (var i = 0; i < customerLedgerTransactionList.length; i++) {
        const record = {
          DATE: getDateFormat(customerLedgerTransactionList[i]),
          'REF NO.': customerLedgerTransactionList[i].sequenceNumber,
          TYPE: customerLedgerTransactionList[i].txnType,
          DEBIT: customerLedgerTransactionList[i].debit,
          CREDIT: customerLedgerTransactionList[i].credit,
          BALANCE: customerLedgerTransactionList[i].balance
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'REF NO.': '',
        TYPE: '',
        DEBIT: '',
        CREDIT: '',
        BALANCE: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Customer Ledger Sheet');

    wb.Sheets['Customer Ledger Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = customer.name + '_Ledger';

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
        setCustFromDate(fromDate);
        setCustToDate(toDate);
        const transactions =
          await getAllLedgerTransactionListByPartyIdAndDateRangeAndHavingBalance(
            selectedParty,
            fromDate,
            toDate
          );
        console.log('transactions', transactions);
        setCustomerLedgerTransactionList(transactions);
        setOnChange(false);
      }
    };

    fetchTransactions();
  }, [selectedParty, onChange]);

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
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const generatePDFDocument = async () => {
    let totalDebit = 0;
    let totalCredit = 0;

    if (
      customerLedgerTransactionList &&
      customerLedgerTransactionList.length > 0
    ) {
      for (var i = 0; i < customerLedgerTransactionList.length; i++) {
        totalDebit += parseFloat(customerLedgerTransactionList[i].debit);
        totalCredit += parseFloat(customerLedgerTransactionList[i].credit);
      }
    }

    const total = {
      totalDebit: totalDebit,
      totalCredit: totalCredit
    };

    const blob = await pdf(
      <LedgerPDF
        data={customerLedgerTransactionList}
        settings={invoiceRegular}
        party={customer}
        total={total}
        fromDate={fromDate}
        toDate={toDate}
        enableBalance={enableBalance}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, customer.name + '_Ledger.pdf');
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
            <Grid item xs={12} sm={8}></Grid>
            <Grid item xs={4}>
              <div>
                <Grid container className={classes.categoryActionWrapper}>
                  <Grid item xs={8}></Grid>
                  <Grid item xs={2}>
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
                  <Grid item xs={2}>
                    <Grid
                      container
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      className="category-actions-right"
                    >
                      <Avatar>
                        <IconButton onClick={() => generatePDFDocument()}>
                          <PDFIcon fontSize="inherit" />
                        </IconButton>
                      </Avatar>
                    </Grid>
                  </Grid>
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
              style={{ width: '100%', height: height - 430 + 'px' }}
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
                  rowData={customerLedgerTransactionList}
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
                            {getTotalDebit()}
                          </div>
                        </Grid>
                        <Grid item xs={2}>
                          <div className={classes.fTextEB}>
                            {getTotalCredit()}
                          </div>
                        </Grid>
                        <Grid item xs={1}></Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2}>
                          <div className={classes.fText}>{getTotalDebit()}</div>
                        </Grid>
                        <Grid item xs={2}>
                          <div className={classes.fText}>
                            {getTotalCredit()}
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
                          {getClosingBalanceDebit()}
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
                          {getClosingBalanceCredit()}
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
                            {parseInt(getTotalDebit()) +
                              parseInt(getClosingBalanceDebit())}
                          </div>
                        </Grid>
                        <Grid item xs={2}>
                          <div className={classes.fTextEB}>
                            {parseInt(getTotalCredit()) +
                              parseInt(getClosingBalanceCredit())}
                          </div>
                        </Grid>
                        <Grid item xs={1}></Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={8}></Grid>
                        <Grid item xs={2}>
                          <div className={classes.fText}>
                            {parseInt(getTotalDebit()) +
                              parseInt(getClosingBalanceDebit())}
                          </div>
                        </Grid>
                        <Grid item xs={2}>
                          <div className={classes.fText}>
                            {parseInt(getTotalCredit()) +
                              parseInt(getClosingBalanceCredit())}
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

export default InjectObserver(CustomerLedger);
