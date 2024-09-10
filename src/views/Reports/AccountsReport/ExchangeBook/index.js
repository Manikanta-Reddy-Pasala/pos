import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import {
  Box,
  Grid,
  Paper,
  Avatar,
  IconButton,
  TextField,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Input
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import useWindowDimensions from '../../../../components/windowDimension';
import { toJS } from 'mobx';
import Excel from '../../../../icons/Excel';
import * as Bd from '../../../../components/SelectedBusiness';
import NoPermission from '../../../noPermission';
import BubbleLoader from '../../../../components/loader';
import clsx from 'clsx';
import AddPayment from 'src/views/sales/PaymentIn/AddPayment';
import AddnewPaymentOut from 'src/views/purchases/PaymentOut/AddPaymentOut';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import AddExpenses from 'src/views/Expenses/Modal/AddExpenses';
import * as Db from '../../../../RxDb/Database/Database';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import ExchangeBookPDF from 'src/views/PDF/ExchangeBook/ExchangeBookPDF';
import * as ExcelJS from 'exceljs';
import { downloadExcelFromWorkBookBuffer, prepareExchangeHeaderRow } from 'src/utils/report';
import { formatHeaderRow, themeStyle } from '../../style';
const useStyles = makeStyles((theme) => ({
  ...themeStyle(theme),
  formControl: {
    minWidth: 120,
    border: '1px solid grey',
    padding: '6px',
    background: 'white'
  },
  selectOption: {
    float: 'left',
    '& .makeStyles-formControl-53': {
      borderRadius: '7px'
    }
  }
}));

const ExchangeBook = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const store = useStore();

  const { exchangeTransactionList, exchangeTotalIn } = toJS(
    store.BankAccountsStore
  );
  const { getExchangeTransactionsByDate } = store.BankAccountsStore;
  const { getSplitPaymentSettingdetails } = store.SplitPaymentSettingsStore;

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [splitPaymentSettings, setSplitPaymentSettings] = useState();
  const [selectedCard, setSelectedCard] = useState('');

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

  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } =
    toJS(store.SalesAddStore);
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
  const { handleOpenEWayGenerateModal } = store.EWayStore;

  useEffect(() => {
    async function fetchData() {
      setSplitPaymentSettings(await getSplitPaymentSettingdetails());
    }

    fetchData();
  }, []);

  function getDate(data) {
    var dateParts = data.date.split('-');

    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  useEffect(() => {
    if (gridApi) {
      if (exchangeTransactionList) {
        gridApi.setRowData(exchangeTransactionList);
      }
    }
  }, [exchangeTransactionList]);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);

      getExchangeTransactionsByDate(fromDate, toDate, selectedCard);
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, [fromDate, toDate]);

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
      filter: false,
      cellStyle: invoiceNumberCellStyle,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['sequenceNumber']) {
          result = data['sequenceNumber'];
        } else if (data['id']) {
          result = data['id'];
        }
        return result;
      }
    },
    {
      headerName: 'DATE',
      field: 'transactionDate',
      width: 300,
      filter: false,
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
      headerName: 'Particulars',
      field: 'name',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data['customerName']) {
          result = data['customerName'];
        } else if (data['vendorName']) {
          result = data['vendorName'];
        }
        return result;
      }
    },
    {
      headerName: 'Txn Type',
      field: 'txnType',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Exchange',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        if (data.splitPaymentList && data.splitPaymentList.length > 0) {
          for (let payment of data.splitPaymentList) {
            if (payment.paymentType === 'Exchange') {
              result = payment.paymentMode;
            }
          }
        }

        return result;
      }
    },
    {
      headerName: 'Cash In',
      field: 'cash_in',
      width: 300,
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';

        let amount = 0;
        if (data.splitPaymentList && data.splitPaymentList.length > 0) {
          let splitAmount = 0;
          for (let payment of data.splitPaymentList) {
            if (payment.paymentType === 'Exchange') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        }

        if (data['txnType'] === 'Sales') {
          result = amount;
        }

        if (!result) {
          result = 0;
        }
        return parseFloat(result).toFixed(2);
      }
    }
  ]);

  function getName(data) {
    let result = '';

    if (data['customerName']) {
      result = data['customerName'];
    } else if (data['vendorName']) {
      result = data['vendorName'];
    }
    return result;
  }

  function getCashIn(data) {
    let result = '';

    let amount = 0;
    if (data.splitPaymentList && data.splitPaymentList.length > 0) {
      let splitAmount = 0;
      for (let payment of data.splitPaymentList) {
        if (payment.paymentType === 'Exchange') {
          splitAmount += parseFloat(payment.amount);
        }
      }
      amount = parseFloat(splitAmount);
    }

    if (data['txnType'] === 'Sales') {
      result = amount;
    }

    if (!result) {
      result = 0;
    }
    return result;
  }

  function getGiftCard(data) {
    let result = '';

    if (data.splitPaymentList && data.splitPaymentList.length > 0) {
      for (let payment of data.splitPaymentList) {
        if (payment.paymentType === 'Exchange') {
          result = payment.paymentMode;
        }
      }
    }

    return result;
  }

  const getDataXlsx = async() => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      'Exachange RECORDS (' + parseInt(exchangeTransactionList.length || 0) + ')'
    );
    let filteredColumns = [];
    await prepareExchangeHeaderRow(filteredColumns);
    worksheet.columns = filteredColumns;

    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);
    let data = [];
    const emptyRow  = worksheet.addRow({});
    emptyRow.getCell('date').value = ""
    emptyRow.getCell('sequenceNumber').value =  ""
    emptyRow.getCell('particulars').value = ""
    emptyRow.getCell('exchange').value =""
    emptyRow.getCell('txnType').value =""
    emptyRow.getCell('cashIn').value =""
    console.log(exchangeTransactionList);
    if (exchangeTransactionList && exchangeTransactionList.length > 0) {
      for (var i = 0; i < exchangeTransactionList.length; i++) {
        const newRow  = worksheet.addRow({});
        newRow.getCell('date').value =  getDate(exchangeTransactionList[i])
        newRow.getCell('sequenceNumber').value =   exchangeTransactionList[i].sequenceNumber
        newRow.getCell('particulars').value =  getName(exchangeTransactionList[i])
        newRow.getCell('exchange').value =getGiftCard(exchangeTransactionList[i])
        newRow.getCell('txnType').value =exchangeTransactionList[i].txnType
        newRow.getCell('cashIn').value =getCashIn(exchangeTransactionList[i])
        
        data.push(newRow);
      }
     
      data.push(emptyRow);
      data.push(emptyRow);

      const totalCashRow  = worksheet.addRow({});
      totalCashRow.getCell('date').value = "Total Cash - In Amount"
      totalCashRow.getCell('sequenceNumber').value = exchangeTotalIn
      totalCashRow.getCell('particulars').value = ""
      totalCashRow.getCell('exchange').value =""
      totalCashRow.getCell('txnType').value =""
      totalCashRow.getCell('cashIn').value =""
      data.push(totalCashRow);
    } else {
     
      data.push(emptyRow);
    }

   
    const fileName = 'Exchange_Book_Report';

    downloadExcelFromWorkBookBuffer(workbook,fileName)
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
      cashIn: exchangeTotalIn,
      cashOut: 0
    };

    const blob = await pdf(
      <ExchangeBookPDF
        data={exchangeTransactionList}
        settings={invoiceRegular}
        date={dateFormatter(fromDate) + ' to ' + dateFormatter(toDate)}
        total={total}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, 'Exchange_Book');
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
            <Paper className={classes.root}>
              <div>
                <div className={classes.content}>
                  <div className={classes.contentLeft}>
                    <Typography gutterBottom variant="h4" component="h4">
                      EXCHANGE BOOK
                    </Typography>
                  </div>
                </div>

                <div>
                  <Grid container className={classes.categoryActionWrapper}>
                    <Grid item xs={6}>
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
                    <Grid item xs={4}>
                      <div className={classes.selectOption}>
                        <FormControl
                          required
                          className={clsx(classes.formControl, classes.noLabel)}
                        >
                          <Select
                            displayEmpty
                            disableUnderline
                            className={classes.selectFont}
                            value={selectedCard ? selectedCard : 'Select'}
                            input={<Input />}
                            onChange={async (e) => {
                              if (e.target.value !== 'Select') {
                                setSelectedCard(e.target.value);
                                getExchangeTransactionsByDate(
                                  fromDate,
                                  toDate,
                                  e.target.value
                                );
                              } else {
                                setSelectedCard('');
                                getExchangeTransactionsByDate(
                                  fromDate,
                                  toDate,
                                  ''
                                );
                              }
                            }}
                          >
                            <MenuItem value={'Select'}>{'Select'}</MenuItem>

                            {splitPaymentSettings &&
                              splitPaymentSettings.exchangeList &&
                              splitPaymentSettings.exchangeList.map(
                                (option, index) => (
                                  <MenuItem value={option}>{option}</MenuItem>
                                )
                              )}
                          </Select>
                        </FormControl>
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
                          <IconButton onClick={() => getDataXlsx()}>
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

                <Box>
                  <div
                    style={{
                      width: '100%',
                      height: height - 220 + 'px'
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
                        enableRangeSelection
                        paginationPageSize={10}
                        suppressMenuHide
                        rowData={exchangeTransactionList}
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
                          Current Total In:
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          style={{ textAlign: 'end' }}
                          className={classes.greenText}
                        >
                          &#8377; {exchangeTotalIn}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container style={{ borderTop: '1px solid #cfcccc' }}>
                    <Grid item xs={3} className={classes.amount}></Grid>

                    <Grid item xs={3} className={classes.amount}></Grid>
                  </Grid>
                </div>
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
      {OpenAddPaymentIn ? <AddPayment /> : null}
      {OpenAddPaymentOut ? <AddnewPaymentOut /> : null}
      {addExpensesDialogue ? <AddExpenses /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(ExchangeBook);