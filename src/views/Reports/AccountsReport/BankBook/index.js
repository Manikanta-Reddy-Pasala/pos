import React, { useEffect, useState } from 'react';
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
  Tabs,
  Tab,
  Paper,
  AppBar
} from '@material-ui/core';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import Excel from '../../../../icons/Excel';
import useWindowDimensions from '../../../../components/windowDimension';
import Transaction from './Transaction';
import * as Db from '../../../../RxDb/Database/Database';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import NoPermission from '../../../noPermission';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import BankBookPDF from 'src/views/PDF/BankBook/BankBookPDF';
import AddPayment from 'src/views/sales/PaymentIn/AddPayment';
import AddnewPaymentOut from 'src/views/purchases/PaymentOut/AddPaymentOut';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import AddExpenses from 'src/views/Expenses/Modal/AddExpenses';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import { formatHeaderRow, themeStyle } from '../../style'
import * as ExcelJS from 'exceljs';
import { downloadExcelFromWorkBookBuffer, getName ,prepareBankBookHeaderRow } from '../../../../utils/report';

const useStyles = makeStyles((theme) => themeStyle(theme));

const BankBookReport = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();

  const store = useStore();

  const {
    bankTransactionList,
    bankBookCashInTotal,
    bankBookCashOutTotal,
    selectedBankAccountForFiltering,
    bankBookUpiTotal,
    bankBookCardTotal,
    bankBookChequeTotal,
    bankBookNeftTotal
  } = toJS(store.BankAccountsStore);
  const { getBankAccountTransactionsByDate } = store.BankAccountsStore;

  const { openAddSalesInvoice } = toJS(store.SalesAddStore);
  const { openAddSalesReturn } = toJS(store.ReturnsAddStore);
  const { OpenAddPurchaseBill } = toJS(store.PurchasesAddStore);
  const { OpenAddPurchasesReturn } = toJS(store.PurchasesReturnsAddStore);
  const { OpenAddPaymentOut } = toJS(store.PaymentOutStore);
  const { addExpensesDialogue } = toJS(store.ExpensesStore);
  const { OpenAddPaymentIn } = toJS(store.PaymentInStore);
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);

  const [Tabvalue, setTabValue] = React.useState(0);
  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  function dateFormatter(data) {
    var dateParts = data.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const handleTabChange = async (event, newValue) => {
    setTabValue(newValue);

    let bankTab = bankAccountDataList[newValue];

    await getBankAccountTransactionsByDate(bankTab, fromDate, toDate);
  };

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
  const [bankAccountDataList, setBankAccountDataList] = React.useState([]);

  function getDate(data) {
    if(data.date){
      var dateParts = data.date.split('-'); 
      return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }else
    {
      return ""
    }
  }


  function getCashIn(data) {
    let result = '';

    let amount = 0;

    if (data.paymentType === 'Split' && data.splitPaymentList && data.splitPaymentList.length > 0) {
      let splitAmount = 0;
      for (let payment of data.splitPaymentList) {
        if (
          selectedBankAccountForFiltering.id !== '' &&
          payment.bankAccountId !== '' &&
          payment.bankAccountId === selectedBankAccountForFiltering.id
        ) {
          splitAmount += parseFloat(payment.amount);
        }
      }
      amount = parseFloat(splitAmount);
    } else {
      amount = parseFloat(data.amount);
    }

    if (
      data['txnType'] === 'Payment In' ||
      data['txnType'] === 'Sales' ||
      data['txnType'] === 'Purchases Return' ||
      data['txnType'] === 'KOT' ||
      data['txnType'] === 'Opening Balance'
    ) {
      result = amount;
    }

    if (!result) {
      result = 0;
    }
    return result;
  }

  function getCashOut(data) {
    let result = '';

    let amount = 0;

    if (data.paymentType === 'Split' && data.splitPaymentList && data.splitPaymentList.length > 0) {
      let splitAmount = 0;
      for (let payment of data.splitPaymentList) {
        if (
          selectedBankAccountForFiltering.id !== '' &&
          payment.bankAccountId !== '' &&
          payment.bankAccountId === selectedBankAccountForFiltering.id
        ) {
          splitAmount += parseFloat(payment.amount);
        }
      }
      amount = parseFloat(splitAmount);
    } else {
      amount = parseFloat(data.amount);
    }

    if (
      data['txnType'] === 'Payment Out' ||
      data['txnType'] === 'Sales Return' ||
      data['txnType'] === 'Purchases' ||
      data['txnType'] === 'Expenses'
    ) {
      result = amount;
    }

    if (!result) {
      result = 0;
    }
    return result;
  }
  const getDataXlsx = async() => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      'Bank RECORDS (' + parseInt(bankTransactionList.length || 0) + ')'
    );
    let filteredColumns = [];
    await prepareBankBookHeaderRow(filteredColumns);
    worksheet.columns = filteredColumns;

    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);
    let data = [];
    const emptyRow = worksheet.addRow({});
    if (bankTransactionList && bankTransactionList.length > 0) {
      for (var i = 0; i < bankTransactionList.length; i++) {
        const newRow = worksheet.addRow({});

        newRow.getCell('date').value = getDate(bankTransactionList[i])
        newRow.getCell('sequenceNumber').value = bankTransactionList[i].sequenceNumber
        newRow.getCell('particulars').value =getName(bankTransactionList[i])
        newRow.getCell('type').value = bankTransactionList[i].txnType
        newRow.getCell('cashIn').value = getCashIn(bankTransactionList[i])
        newRow.getCell('cashOut').value = getCashOut(bankTransactionList[i])
        newRow.getCell('upi').value = bankTransactionList[i].upi
        newRow.getCell('card').value = bankTransactionList[i].card
        newRow.getCell('netBanking').value = bankTransactionList[i].netBanking
        newRow.getCell('cheque').value = bankTransactionList[i].cheque
      
        data.push(newRow);
      }
      data.push(emptyRow);
      data.push(emptyRow);

      const totalCashRow = worksheet.addRow({});
      totalCashRow.getCell('date').value = "Total amount"
      totalCashRow.getCell('sequenceNumber').value = ""
      totalCashRow.getCell('particulars').value =""
      totalCashRow.getCell('type').value = ""
      totalCashRow.getCell('cashIn').value = bankBookCashInTotal
      totalCashRow.getCell('cashOut').value = bankBookCashOutTotal
      totalCashRow.getCell('upi').value =bankBookUpiTotal
      totalCashRow.getCell('card').value = bankBookCardTotal
      totalCashRow.getCell('netBanking').value =bankBookNeftTotal
      totalCashRow.getCell('cheque').value = bankBookChequeTotal
    
      data.push(totalCashRow);
    } else {
      
      data.push(emptyRow);
    }

    // download excel
    const fileName = 'Bank_Book_Report';
    downloadExcelFromWorkBookBuffer(workbook,fileName)
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, []);

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

  useEffect(() => {
    getBankAccounts();
  }, [fromDate, toDate]);

  const getBankAccounts = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query = db.bankaccounts.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe(async (data) => {
      if (!data) {
        return;
      }

      let bankAccountDataLists = data.map((item) => {
        let bankAccount = {};

        bankAccount.accountDisplayName = item.accountDisplayName;
        bankAccount.balance = item.balance;
        bankAccount.id = item.id;

        return bankAccount;
      });
      setBankAccountDataList(bankAccountDataLists);
      if (bankAccountDataLists.length > 0) {
        await getBankAccountTransactionsByDate(
          bankAccountDataLists[Tabvalue],
          fromDate,
          toDate
        );
      }
    });
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`
    };
  }

  const generatePDFDocument = async () => {
    const total = {
      cashIn: bankBookCashInTotal,
      cashOut: bankBookCashOutTotal,
      upi: bankBookUpiTotal,
      card: bankBookCardTotal,
      neft: bankBookNeftTotal,
      cheque: bankBookChequeTotal
    };

    let bankTab = bankAccountDataList[Tabvalue];

    const blob = await pdf(
      <BankBookPDF
        data={bankTransactionList}
        settings={invoiceRegular}
        date={dateFormatter(fromDate) + ' to ' + dateFormatter(toDate)}
        total={total}
        bankName={bankTab.accountDisplayName}
        selectedBankAccountForFiltering={selectedBankAccountForFiltering}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, 'Bank_Book');
  };

  return (
    <div>
      <div className={classes.root} style={{ height: height - 50 }}>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <div className={classes.root}>
            {isFeatureAvailable ? (
              <Paper className={classes.root} style={{ height: height - 50 }}>
                <div className={classes.content}>
                  <div className={classes.contentLeft}>
                    <Typography gutterBottom variant="h4" component="h4">
                      BANK BOOK
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
                <div>
                  <AppBar position="static">
                    <Tabs
                      value={Tabvalue}
                      onChange={handleTabChange}
                      aria-label=""
                    >
                      {bankAccountDataList.map((ele, index) => (
                        <Tab
                          label={ele.accountDisplayName}
                          {...a11yProps(index)}
                        />
                      ))}
                    </Tabs>
                  </AppBar>
                  {bankAccountDataList.map((ele, index) => (
                    <TabPanel value={Tabvalue} index={index}>
                      <Transaction />
                    </TabPanel>
                  ))}
                </div>
              </Paper>
            ) : (
              <NoPermission />
            )}
          </div>
        )}
      </div>
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

export default InjectObserver(BankBookReport);