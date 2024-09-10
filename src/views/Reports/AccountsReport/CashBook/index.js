import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import TextField from '@material-ui/core/TextField';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Typography,
  Grid,
  Avatar,
  IconButton,
  Paper
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import BubbleLoader from '../../../../components/loader';
import useWindowDimensions from '../../../../components/windowDimension';
import * as Bd from '../../../../components/SelectedBusiness';
import { toJS } from 'mobx';
import NoPermission from '../../../noPermission';
import AddPayment from 'src/views/sales/PaymentIn/AddPayment';
import AddnewPaymentOut from 'src/views/purchases/PaymentOut/AddPaymentOut';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import AddExpenses from 'src/views/Expenses/Modal/AddExpenses';
import * as Db from '../../../../RxDb/Database/Database';
import CashBookPDF from 'src/views/PDF/CashBook/CashBookPDF';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    borderRadius: '12px'
  },
  root: {
    // padding: 2,
    borderRadius: '12px'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  footer: {
    borderTop: '1px solid #d8d8d8'
  },
  amount: {
    textAlign: 'center',
    color: '#EF5350'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  greenText: {
    color: '#339900'
  },
  csh: {
    marginTop: '30px',
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
        marginLeft: theme.spacing(1),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  }
}));

const CashBookReport = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [cashBookData, setCashBookData] = useState([]);

  const store = useStore();

  const { getCashBookData } = store.ReportsStore;
  const { openingBalanceCashBook, cashInTotalCashBook, cashOutTotalCashBook } =
    toJS(store.ReportsStore);

  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } = toJS(store.SalesAddStore);
  const { openAddSalesReturn } = toJS(store.ReturnsAddStore);
  const { OpenAddPurchaseBill } = toJS(store.PurchasesAddStore);
  const { OpenAddPurchasesReturn } = toJS(store.PurchasesReturnsAddStore);
  const { OpenAddPaymentOut } = toJS(store.PaymentOutStore);
  const { addExpensesDialogue } = toJS(store.ExpensesStore);
  const { OpenAddPaymentIn } = toJS(store.PaymentInStore);
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);

  const { viewOrEditSaleTxnItem, resetEWayLaunchFlag } = store.SalesAddStore;
  const { viewOrEditSaleReturnTxnItem } = store.ReturnsAddStore;
  const { viewOrEditPurchaseTxnItem } = store.PurchasesAddStore;
  const { viewOrEditPurchaseReturnTxnItem } = store.PurchasesReturnsAddStore;
  const { viewOrEditPaymentInTxnItem } = store.PaymentInStore;
  const { viewOrEditPaymentOutTxnItem } = store.PaymentOutStore;
  const { viewOrEditExpenseItem } = store.ExpensesStore;
  const { handleOpenEWayGenerateModal } =
    store.EWayStore; 

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  function dateFormatter(data) {
    var dateParts = data.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const [fromDate, setFromDate] = React.useState(formatDate(firstThisMonth));
  const [toDate, setToDate] = React.useState(formatDate(todayDate));

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
              { invoice_number: { $eq: event.data.id } }
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
              { purchase_return_number: { $eq: event.data.id } }
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
              { bill_number: { $eq: event.data.id } }
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
              { sales_return_number: { $eq: event.data.id } }
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
      } else if ('Payment In' === event.data.txnType) {
        const query = db.paymentin.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { receiptNumber: { $eq: event.data.id } }
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
            viewOrEditPaymentInTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Payment Out' === event.data.txnType) {
        const query = db.paymentout.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { receiptNumber: { $eq: event.data.id } }
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
            viewOrEditPaymentOutTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Expenses' === event.data.txnType) {
        const query = db.expenses.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { expenseId: { $eq: event.data.id } }
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
            viewOrEditExpenseItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      }
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'Invoice/Bill NO',
      field: 'sequenceNumber',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: invoiceNumberCellStyle,
      filter: false
    },
    {
      headerName: 'DATE',
      field: 'date',
      width: 300,
      filter: false
    },
    {
      headerName: 'Particulars',
      field: 'name',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let name = '';

        if (data['customerName']) {
          name = data['customerName'];
        }

        if (data['vendorName']) {
          name = data['vendorName'];
        }
        return name;
      },
      filter: false
    },
    {
      headerName: 'Type',
      field: 'txnType',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Cash In',
      field: 'cashIn',
      width: 300,
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;

        if (
          data['txnType'] === 'Payment In' ||
          data['txnType'] === 'Sales' ||
          data['txnType'] === 'Purchases Return' ||
          data['txnType'] === 'KOT'
        ) {
          if (data.isCredit) {
            if (data['paidOrReceivedAmount']) {
              result = parseFloat(data['paidOrReceivedAmount']);
            }
          } else {
            let amount = 0;

            if (data.paymentType === 'Split' && data.splitPaymentList && data.splitPaymentList.length > 0) {
              let splitAmount = 0;
              for (let payment of data.splitPaymentList) {
                if (payment.paymentType === 'Cash') {
                  splitAmount += parseFloat(payment.amount);
                }
              }
              amount = parseFloat(splitAmount);
            } else {
              amount = parseFloat(data.amount);
            }

            if (amount) {
              result = parseFloat(amount);
            }
          }
        }
        return parseFloat(result).toFixed(2);
      }
    },
    {
      headerName: 'Cash Out',
      field: 'cashOut',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;

        if (
          data['txnType'] === 'Payment Out' ||
          data['txnType'] === 'Sales Return' ||
          data['txnType'] === 'Purchases' ||
          data['txnType'] === 'Expenses'
        ) {
          if (data.isCredit) {
            if (data['paidOrReceivedAmount']) {
              result = parseFloat(data['paidOrReceivedAmount']);
            }
          } else {
            let amount = 0;

            if (data.paymentType === 'Split' && data.splitPaymentList && data.splitPaymentList.length > 0) {
              let splitAmount = 0;
              for (let payment of data.splitPaymentList) {
                if (payment.paymentType === 'Cash') {
                  splitAmount += parseFloat(payment.amount);
                }
              }
              amount = parseFloat(splitAmount);
            } else {
              amount = parseFloat(data.amount);
            }

            if (amount) {
              result = parseFloat(amount);
            }
          }
        }
        return parseFloat(result).toFixed(2);
      },
      filter: false
    }
  ]);

  function getDate(cashFlowData) {
    let result = '';

    if (cashFlowData.date) {
      result = cashFlowData.date;
    } else if (cashFlowData.bill_date) {
      result = cashFlowData.bill_date;
    } else if (cashFlowData.invoice_date) {
      result = cashFlowData.invoice_date;
    }
    return result;
  }

  function getRefNo(cashFlowData) {
    let result = '';

    if (cashFlowData.sequenceNumber) {
      result = cashFlowData.sequenceNumber;
    } else if (cashFlowData.invoice_number) {
      result = cashFlowData.invoice_number;
    } else if (cashFlowData.bill_number) {
      result = cashFlowData.bill_number;
    }
    return result;
  }

  function getName(cashFlowData) {
    let result = '';

    if (cashFlowData.customerName) {
      result = cashFlowData.customerName;
    } else if (cashFlowData.vendor_name) {
      result = cashFlowData.vendor_name;
    } else if (cashFlowData.customer_name) {
      result = cashFlowData.customer_name;
    } else if (cashFlowData.vendorName) {
      result = cashFlowData.vendorName;
    }
    return result;
  }

  function getCashIn(cashFlowData) {
    let result = '';
    console.log(cashFlowData);
    console.log(cashFlowData.txnType);

    if (
      cashFlowData.txnType === 'Payment In' ||
      cashFlowData.txnType === 'Sales' ||
      cashFlowData.txnType === 'Purchases Return' ||
      cashFlowData.txnType === 'KOT'
    ) {
      if (cashFlowData.isCredit) {
        if (cashFlowData.paidOrReceivedAmount) {
          result = parseFloat(cashFlowData.paidOrReceivedAmount);
        }
      } else {
        let amount = 0;

        if (
          cashFlowData.paymentType === 'Split' && cashFlowData.splitPaymentList &&
          cashFlowData.splitPaymentList.length > 0
        ) {
          let splitAmount = 0;
          for (let payment of cashFlowData.splitPaymentList) {
            if (payment.paymentType === 'Cash') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        } else {
          amount = parseFloat(cashFlowData.amount);
        }

        if (amount) {
          result = parseFloat(amount);
        }
      }
    }
    if (!result) {
      result = 0;
    }
    return parseFloat(result).toFixed(2);
  }

  function getCashOut(cashFlowData) {
    let result = '';

    if (
      cashFlowData.txnType === 'Payment Out' ||
      cashFlowData.txnType === 'Sales Return' ||
      cashFlowData.txnType === 'Purchases' ||
      cashFlowData.txnType === 'Expenses'
    ) {
      if (cashFlowData.isCredit) {
        if (cashFlowData.paidOrReceivedAmount) {
          result = parseFloat(cashFlowData.paidOrReceivedAmount);
        }
      } else {
        let amount = 0;

        if (
          cashFlowData.paymentType === 'Split' &&  cashFlowData.splitPaymentList &&
          cashFlowData.splitPaymentList.length > 0
        ) {
          let splitAmount = 0;
          for (let payment of cashFlowData.splitPaymentList) {
            if (payment.paymentType === 'Cash') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        } else {
          amount = parseFloat(cashFlowData.amount);
        }

        if (amount) {
          result = parseFloat(amount);
        }
      }
    }

    if (!result) {
      result = 0;
    }
    return parseFloat(result).toFixed(2);
  }

  const getFloatWithTwoDecimal = (val) => {
    return parseFloat(val).toFixed(2);
  };

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromCashFlow = () => {
    const wb = new Workbook();

    let data = [];
    if (cashBookData && cashBookData.length > 0) {
      for (var i = 0; i < cashBookData.length; i++) {
        const record = {
          Date: getDate(cashBookData[i]),
          /* 'Invoice/Bill No': getRefNo(cashBookData[i]) */
          'Invoice/Bill No':
            cashBookData[i].sequenceNumber || cashBookData[i].id,
          Particulars: getName(cashBookData[i]),
          Type: cashBookData[i].txnType,
          'Cash In': getCashIn(cashBookData[i]),
          'Cash Out': getCashOut(cashBookData[i])
        };
        data.push(record);
      }
    } else {
      const record = {
        DATE: '',
        'Invoice/Bill No': '',
        Particulars: '',
        Type: '',
        'Cash In': '',
        'Cash Out': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Cash Book Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Cash Book Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Cash_Flow_Report';

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

      setCashBookData(await getCashBookData(fromDate, toDate));
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, [fromDate, toDate]);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Accounts Report')) {
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
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const generatePDFDocument = async () => {
    const total = {
      openingBalance: openingBalanceCashBook,
      cashIn: cashInTotalCashBook,
      cashOut: cashOutTotalCashBook,
      closingBalance: getFloatWithTwoDecimal(
        parseFloat(openingBalanceCashBook) +
          parseFloat(cashInTotalCashBook) -
          parseFloat(cashOutTotalCashBook)
      )
    };

    const blob = await pdf(
      <CashBookPDF
        data={cashBookData}
        settings={invoiceRegular}
        date={dateFormatter(fromDate) + ' to ' + dateFormatter(toDate)}
        total={total}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, 'Cash_Book');
  };

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
        <div className={classes.root}>
          {isFeatureAvailable ? (
            <div className={classes.root} style={{ height: height - 50 }}>
              <Paper className={classes.root} style={{ height: height - 50 }}>
                <div className={classes.content}>
                  <div className={classes.contentLeft}>
                    <Typography gutterBottom variant="h4" component="h4">
                      CASH BOOK
                    </Typography>
                  </div>
                </div>

                <div>
                  <Grid container className={classes.categoryActionWrapper}>
                    <Grid item xs={10}>
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
                            onChange={(e) =>
                              setToDate(formatDate(e.target.value))
                            }
                            className={classes.textField}
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </form>
                      </div>
                    </Grid>
                    <Grid item xs={1}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        className="category-actions-right"
                      >
                        <Avatar>
                          <IconButton onClick={() => getDataFromCashFlow()}>
                            <Excel fontSize="inherit" />
                          </IconButton>
                        </Avatar>
                      </Grid>
                    </Grid>
                    <Grid item xs={1}>
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

                <div style={{ marginTop: '5px' }}>
                  {/* <App />  */}

                  <Box>
                    <div
                      style={{
                        width: '100%',
                        height: height - 250 + 'px'
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
                          rowData={cashBookData}
                          columnDefs={columnDefs}
                          defaultColDef={defaultColDef}
                          rowSelection="single"
                          pagination
                          headerHeight={40}
                          rowClassRules={rowClassRules}
                          onCellClicked={handleCellClicked}
                          overlayLoadingTemplate={
                            '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                          }
                          frameworkComponents={{}}
                        />
                      </div>
                    </div>
                  </Box>
                </div>

                <div className={classes.footer}>
                  <div>
                    <Grid container>
                      <Grid item xs={3} className={classes.greenText}></Grid>

                      <Grid item xs={6}>
                        <Grid
                          container
                          style={{ padding: '3px', fontSize: 'medium' }}
                        >
                          <Grid item xs={9} style={{ textAlign: 'end' }}>
                            Opening Balance:
                          </Grid>
                          <Grid item xs={3} style={{ textAlign: 'end' }}>
                            &#8377;{' '}
                            {getFloatWithTwoDecimal(openingBalanceCashBook)}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={3}></Grid>
                    </Grid>
                    <Grid container>
                      <Grid item xs={3} className={classes.greenText}></Grid>

                      <Grid item xs={6}>
                        <Grid
                          container
                          style={{ padding: '3px', fontSize: 'medium' }}
                        >
                          <Grid item xs={9} style={{ textAlign: 'end' }}>
                            Current Total:
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            style={{ textAlign: 'end' }}
                            className={classes.greenText}
                          >
                            &#8377;{' '}
                            {getFloatWithTwoDecimal(cashInTotalCashBook)}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        style={{
                          textAlign: 'center',
                          padding: '3px',
                          fontSize: 'medium'
                        }}
                        className={classes.amount}
                      >
                        &#8377; {getFloatWithTwoDecimal(cashOutTotalCashBook)}
                      </Grid>
                    </Grid>
                    <Grid container style={{ borderTop: '1px solid #cfcccc' }}>
                      <Grid item xs={3} className={classes.amount}></Grid>

                      <Grid item xs={6}>
                        <Grid
                          container
                          style={{ padding: '3px', fontSize: 'medium' }}
                        >
                          <Grid item xs={9} style={{ textAlign: 'end' }}>
                            Closing Balance:
                          </Grid>
                          <Grid item xs={3} style={{ textAlign: 'end' }}>
                            &#8377;{' '}
                            {getFloatWithTwoDecimal(
                              parseFloat(openingBalanceCashBook) +
                                parseFloat(cashInTotalCashBook) -
                                parseFloat(cashOutTotalCashBook)
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={3} className={classes.amount}></Grid>
                    </Grid>
                  </div>
                </div>
              </Paper>
            </div>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openAddSalesReturn ? <AddCreditNote /> : null}
      {OpenAddPurchaseBill ? <AddPurchasesBill /> : null}
      {OpenAddPurchasesReturn ? <AddDebitNote /> : null}
      {OpenAddPaymentIn ? <AddPayment /> : null}
      {OpenAddPaymentOut ? <AddnewPaymentOut /> : null}
      {addExpensesDialogue ? <AddExpenses /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(CashBookReport);