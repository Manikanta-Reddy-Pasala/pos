import React, { useState, useEffect } from 'react';
import { Grid, makeStyles, Avatar, TextField } from '@material-ui/core';
import 'react-table/react-table.css';
import SearchIcon from '@material-ui/icons/Search';
import '../Expenses/ExpenseTable.css';
import { Box, InputAdornment, IconButton } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import './customer.css';
import useWindowDimensions from 'src/components/windowDimension';
import Excel from '../../icons/Excel';
import XLSX from 'xlsx';
import Controls from 'src/components/controls/index';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import PartyTransactionPDF from '../PDF/PartyTransaction/PartyTransactionPDF';
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
import * as allTxn from 'src/components/Helpers/dbQueries/alltransactions';
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
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  }
}));

const TransactionTable = (props) => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { height } = useWindowDimensions();

  const numberSort = (num1, num2) => {
    return num1 - num2;
  };

  const store = useStore();
  const {
    changeInCustomer,
    customerTransactionList,
    selectedParty,
    custFromDate,
    custToDate
  } = toJS(store.CustomerStore);
  const { setCustFromDate, setCustToDate } = store.CustomerStore;

  const { invoiceRegular } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { customer } = toJS(store.CustomerStore);
  const [uiCustomerTransactionList, setCustomerTransactionList] =
    React.useState([]);
  const [rowData, setRowData] = useState(null);

  const [fromDate, setFromDate] = React.useState(custFromDate);
  const [toDate, setToDate] = React.useState(custToDate);

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

  const [onChange, setOnChange] = useState(false);

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

  const [columnDefs] = useState([
    {
      headerName: 'REF NO.',
      field: 'sequenceNumber',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'TYPE',
      field: 'txnType',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
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
      headerName: 'TOTAL',
      field: 'amount',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      comparator: numberSort
    },
    {
      headerName: 'BALANCE',
      field: 'balance',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      comparator: numberSort
    },
    {
      headerName: 'STATUS',
      field: 'status',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        let balance = 0;

        if (data['balance']) {
          balance = parseFloat(data['balance']);
        }

        let total = 0;
        if (data['amount']) {
          total = parseFloat(data['amount']);
        }

        //payment in and payment out
        if (
          data['txnType'] === 'Payment In' ||
          data['txnType'] === 'Payment Out'
        ) {
          if (balance === 0) {
            result = 'Used';
          } else if (balance < total) {
            result = 'Partial';
          } else if (balance === total) {
            result = 'Un Used';
          }
        } else {
          //sales and sales return
          //purchase and purchase return
          if (balance === 0) {
            result = 'Paid';
          } else if (balance < total) {
            result = 'Partial';
          } else if (balance === total) {
            result = 'Un Paid';
          }

          if (
            data['txnType'] === 'Delivery Challan' ||
            data['txnType'] === 'Sale Order' ||
            data['txnType'] === 'Sales Quotation' ||
            data['txnType'] === 'Job Work In' ||
            data['txnType'] === 'Purchase Order' ||
            data['txnType'] === 'Approval'
          ) {
            result = '';
          }
        }
        return result;
      },
      editable: false
    }
  ]);

  useEffect(() => {
    // console.log("CustFromDate",CustFromDate);
    setOnChange(true);
    if(props.data && props.data == 'receivable'){
      
    }else{
      getInvoiceSettings(localStorage.getItem('businessId'));
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

  const getStatus = (data) => {
    let result = '';

    let balance = 0;

    if (data['balance']) {
      balance = parseFloat(data['balance']);
    }

    let total = 0;
    if (data['amount']) {
      total = parseFloat(data['amount']);
    }

    //payment in and payment out
    if (data['txnType'] === 'Payment In' || data['txnType'] === 'Payment Out') {
      if (balance === 0) {
        result = 'Used';
      } else if (balance < total) {
        result = 'Partial';
      } else if (balance === total) {
        result = 'Un Used';
      }
    } else {
      //sales and sales return
      //purchase and purchase return
      if (balance === 0) {
        result = 'Paid';
      } else if (balance < total) {
        result = 'Partial';
      } else if (balance === total) {
        result = 'Un Paid';
      }

      if (
        data['txnType'] === 'Delivery Challan' ||
        data['txnType'] === 'Sale Order' ||
        data['txnType'] === 'Sales Quotation' ||
        data['txnType'] === 'Job Work In' ||
        data['txnType'] === 'Purchase Order' ||
        data['txnType'] === 'Approval'
      ) {
        result = '';
      }
    }
    return result;
  };

  const getDataForExcel = () => {
    const wb = new Workbook();

    let data = [];
    if (rowData && rowData.length > 0) {
      for (var i = 0; i < rowData.length; i++) {
        const record = {
          TYPE: rowData[i].txnType,
          DATE: getDateFormat(rowData[i]),
          'REF NO.': rowData[i].sequenceNumber,
          TOTAL: rowData[i].amount,
          BALANCE: rowData[i].balance,
          STATUS: getStatus(rowData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        TYPE: '',
        DATE: '',
        'REF NO.': '',
        TOTAL: '',
        BALANCE: '',
        STATUS: ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Customer Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Customer Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = customer.name + '_Transactions';

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
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  useEffect(() => {
    const fetchCustomerTransactions = async () => {
      if (onChange) {
        setCustFromDate(fromDate);
        setCustToDate(toDate);
        setOnChange(false);

        setRowData([]);
        setCustomerTransactionList([]);
        let transactions = '';
        if (props.data && props.data == 'receivable') {
        transactions =
          await allTxn.getAllTransactionListByPartyIdAndDateRange(
            selectedParty,
            props.fromDate,
            props.toDate
          );
        }else{
          transactions =
          await allTxn.getAllTransactionListByPartyIdAndDateRange(
            selectedParty,
            fromDate,
            toDate
          );
        }
        setRowData(transactions);
      }
    };

    fetchCustomerTransactions();
  }, [onChange]);

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
    const blob = await pdf(
      <PartyTransactionPDF
        data={rowData}
        settings={invoiceRegular}
        party={customer}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, customer.name + '_Transactions');
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
            <Grid item xs={12} sm={6}>
              {!props.data && <div>
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
              </div>}
            </Grid>
            <Grid item xs={12} sm={6}>
              <div style={{ marginTop: '5px' }}>
                <Grid container className={classes.categoryActionWrapper}>
                  <Grid item xs={8}>
                    <Controls.Input
                      placeholder="Search Transaction"
                      size="small"
                      fullWidth
                      InputProps={{
                        classes: {
                          root: classes.searchInputRoot,
                          input: classes.searchInputInput
                        },
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon className={classes.searchIcon} />
                          </InputAdornment>
                        )
                      }}
                      onChange={async (event) => {
                        if (event.target.value.toString().toLowerCase()) {
                          setRowData(
                            await allTxn.searchTransactionListByPartyIdAndValue(
                              customer.id,
                              event.target.value.toString().toLowerCase()
                            )
                          );
                        } else {
                          setCustomerTransactionList([]);

                          setRowData(
                            await allTxn.getAllTransactionListByPartyId(
                              customer.id
                            )
                          );
                        }
                      }}
                    />
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
              style={{ width: '100%', height: height - 220 + 'px' }}
            >
              <div
                id="product-list-grid"
                style={{ height: '97%', width: '100%' }}
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

export default InjectObserver(TransactionTable);
