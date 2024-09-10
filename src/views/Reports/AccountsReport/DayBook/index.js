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
import useWindowDimensions from '../../../../components/windowDimension';
import * as Bd from '../../../../components/SelectedBusiness';
import { toJS } from 'mobx';
import BubbleLoader from '../../../../components/loader';
import NoPermission from '../../../noPermission';
import AddPayment from 'src/views/sales/PaymentIn/AddPayment';
import AddnewPaymentOut from 'src/views/purchases/PaymentOut/AddPaymentOut';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import AddExpenses from 'src/views/Expenses/Modal/AddExpenses';
import * as Db from '../../../../RxDb/Database/Database';
import AddDeliveryChallan from 'src/views/sales/DeliveryChallan/AddDeliveryChallan';
import AddSalesQuotation from 'src/views/sales/SalesQuotation/AddSalesQuotation';
import AddSaleOrder from 'src/views/sales/SaleOrder/AddSaleOrder';
import AddApproval from 'src/views/sales/Approval/AddApproval';
import AddPurchaseOrder from 'src/views/purchases/PurchaseOrder/AddPurchaseOrder';
import AddJobWorkIn from 'src/views/JobWork/OrderIn';
import AddOrderInvoice from 'src/views/JobWork/OrderInvoice';
import AddOrderReceipt from 'src/views/JobWork/OrderReceipt/AddOrderReceipt';
import DayBookPDF from 'src/views/PDF/DayBook/DayBookPDF';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';
import * as ExcelJS from 'exceljs';
import { downloadExcelFromWorkBookBuffer , prepareDayBookHeaderRow } from '../../../../utils/report';
import { formatHeaderRow, themeStyle } from '../../style'
const useStyles = makeStyles((theme) =>(themeStyle(theme)));

const DayBookReport = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [dayBookData, setDayBookData] = useState([]);

  const store = useStore();

  const { dayBookTotal } = toJS(store.ReportsStore);
  const { getDayBookData } = store.ReportsStore;

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const todayDate = new Date(thisYear, thisMonth, today);

  const { openAddSalesInvoice, isLaunchEWayAfterSaleCreation, printData } = toJS(store.SalesAddStore);
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
  const { openEWayGenerateModal } = toJS(store.EWayStore);
  const { productDialogOpen } = toJS(store.ProductStore);

  const { viewOrEditSaleTxnItem, resetEWayLaunchFlag } = store.SalesAddStore;
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
  const { handleOpenEWayGenerateModal } =
    store.EWayStore;

  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

  function dateFormatter(data) {
    var dateParts = data.split('-');
    return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  }

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const [date, setDate] = React.useState(formatDate(todayDate));

  const creditStatusCellStyle = (params) => {
    return { color: '#339900', fontWeight: 500 };
  };

  const debitStatusCellStyle = (params) => {
    return { color: '#EF5350', fontWeight: 500 };
  };

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
      } else if ('Delivery Challan' === event.data.txnType) {
        const query = db.deliverychallan.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { delivery_challan_invoice_number: { $eq: event.data.id } }
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
            viewOrEditDeliveryChallanTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Sale Order' === event.data.txnType) {
        const query = db.saleorder.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { sale_order_invoice_number: { $eq: event.data.id } }
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
            viewOrEditSaleOrderTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Sales Quotation' === event.data.txnType) {
        const query = db.salesquotation.findOne({
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

            let clone = JSON.parse(JSON.stringify(data));
            viewOrEditSaleQuotationItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Job Work In' === event.data.txnType) {
        const query = db.jobworkin.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { job_work_in_invoice_number: { $eq: event.data.id } }
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
            viewOrEditJobWorkInTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Purchase Order' === event.data.txnType) {
        const query = db.purchaseorder.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { purchase_order_invoice_number: { $eq: event.data.id } }
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
            viewOrEditPurchaseOrderTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Approval' === event.data.txnType) {
        const query = db.approvals.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { approvalNumber: { $eq: event.data.id } }
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
            viewOrEditApprovalTxnItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Job Work Out' === event.data.txnType) {
        const query = db.jobwork.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { id: { $eq: event.data.id } }
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
            viewOrEditJobWorkOutItem(clone);
          })
          .catch((err) => {
            console.log('Internal Server Error', err);
          });
      } else if ('Job Work Out Receipt' === event.data.txnType) {
        const query = db.jobworkreceipt.findOne({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { id: { $eq: event.data.id } }
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
            viewOrderReceipt(clone);
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
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      cellStyle: invoiceNumberCellStyle
    },
    {
      headerName: 'DATE',
      field: 'date',
      width: 500,
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
      width: 500,
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
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Credit',
      field: 'cashIn',
      width: 500,
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
          data['txnType'] === 'KOT' ||
          data['txnType'] === 'Opening Balance'
        ) {
          if (data.isCredit) {
            if (data['paidOrReceivedAmount']) {
              result = parseFloat(data['paidOrReceivedAmount']);
            }
          } else {
            if ((data['amount'] && data['linkedAmount'] === 0) || data['txnType'] === 'Payment In') {
              result = parseFloat(data['amount']);
            }
          }
        }
        return parseFloat(result).toFixed(2);
      },
      cellStyle: creditStatusCellStyle
    },
    {
      headerName: 'Debit',
      field: 'cashOut',
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: debitStatusCellStyle,
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
            if ((data['amount'] && data['linkedAmount'] === 0) || data['txnType'] === 'Payment Out') {
              result = parseFloat(data['amount']);
            }
          }
        }
        return parseFloat(result).toFixed(2);
      },
      filter: false
    },
    {
      headerName: 'Cash',
      field: 'cash',
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.cash).toFixed(2);
      },
      filter: false
    },
    {
      headerName: 'Upi',
      field: 'upi',
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.upi).toFixed(2);
      },
      filter: false
    },
    {
      headerName: 'Card',
      field: 'card',
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.card).toFixed(2);
      },
      filter: false
    },
    {
      headerName: 'Neft/Rtgs',
      field: 'netBanking',
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.netBanking).toFixed(2);
      },
      filter: false
    },
    {
      headerName: 'Cheque',
      field: 'cheque',
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.cheque).toFixed(2);
      },
      filter: false
    },
    {
      headerName: 'Gift Card',
      field: 'giftCard',
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.giftCard).toFixed(2);
      },
      filter: false
    },
    {
      headerName: 'Custom Finance',
      field: 'customFinance',
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.customFinance).toFixed(2);
      },
      filter: false
    },
    {
      headerName: 'Exchange',
      field: 'exchange',
      width: 500,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.exchange).toFixed(2);
      },
      filter: false
    }
  ]);

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

  function getCashIn(data) {
    let result = 0;

    if (
      data['txnType'] === 'Payment In' ||
      data['txnType'] === 'Sales' ||
      data['txnType'] === 'Purchases Return' ||
      data['txnType'] === 'KOT'
    ) {
      if (data['amount']) {
        result = parseFloat(data['amount']);
      }
    }
    return parseFloat(result).toFixed(2);
  }

  function getCashOut(data) {
    let result = 0;

    if (
      data['txnType'] === 'Payment Out' ||
      data['txnType'] === 'Sales Return' ||
      data['txnType'] === 'Purchases' ||
      data['txnType'] === 'Expenses'
    ) {
      if (data['amount']) {
        result = parseFloat(data['amount']);
      }
    }
    return parseFloat(result).toFixed(2);
  }

 

  const getDataFromCashFlow = async() => {
    try {
    const workbook = new ExcelJS.Workbook();
    console.log("DayBookData", dayBookData.length);
    const worksheet = workbook.addWorksheet(
      'Day RECORDS (' + parseInt(dayBookData.length || 0) + ')'
    );
    let filteredColumns = [];
    await prepareDayBookHeaderRow(filteredColumns);
    worksheet.columns = filteredColumns;

    const headerRow = worksheet.getRow(1);
    formatHeaderRow(headerRow);

    let data = [];

    const emptyRecord = worksheet.addRow({});
        emptyRecord.getCell('date').value = ""
        emptyRecord.getCell('sequenceNumber').value =  ""
        emptyRecord.getCell('particulars').value = ""
        emptyRecord.getCell('txnType').value = ""
        emptyRecord.getCell('credit').value = ""
        emptyRecord.getCell('debit').value = "" 
        emptyRecord.getCell('cash').value = ""
        emptyRecord.getCell('upi').value = ""
        emptyRecord.getCell('card').value = ""
        emptyRecord.getCell('netBanking').value = ""
        emptyRecord.getCell('cheque').value = ""
        emptyRecord.getCell('giftCard').value = ""
        emptyRecord.getCell('customFinance').value = ""
        emptyRecord.getCell('exchange').value = ""

    if (dayBookData && dayBookData.length > 0) {
      for (var i = 0; i < dayBookData.length; i++) {
        const newRow = worksheet.addRow({});
        newRow.getCell('date').value = dayBookData[i].date 
        newRow.getCell('sequenceNumber').value = dayBookData[i].sequenceNumber  
        newRow.getCell('particulars').value = getName(dayBookData[i]) 
        newRow.getCell('txnType').value = dayBookData[i].txnType  
        newRow.getCell('credit').value = getCashIn(dayBookData[i]) 
        newRow.getCell('debit').value = getCashOut(dayBookData[i]) 
        newRow.getCell('cash').value = parseFloat(dayBookData[i].cash).toFixed(2)
        newRow.getCell('upi').value = parseFloat(dayBookData[i].upi).toFixed(2)
        newRow.getCell('card').value = parseFloat(dayBookData[i].card).toFixed(2)
        newRow.getCell('netBanking').value = parseFloat(dayBookData[i].netBanking).toFixed(2)
        newRow.getCell('cheque').value = parseFloat(dayBookData[i].cheque).toFixed(2)
        newRow.getCell('giftCard').value = parseFloat(dayBookData[i].giftCard).toFixed(2)
        newRow.getCell('customFinance').value = parseFloat(dayBookData[i].customFinance).toFixed(2)
        newRow.getCell('exchange').value = parseFloat(dayBookData[i].exchange).toFixed(2)
       
        data.push(newRow);
      }
      data.push(emptyRecord);
      data.push(emptyRecord);
      const totalCashRow =worksheet.addRow({})
      totalCashRow.getCell('date').value = ""
        totalCashRow.getCell('sequenceNumber').value = ""
        totalCashRow.getCell('particulars').value = ""
        totalCashRow.getCell('txnType').value = "Total"
        totalCashRow.getCell('credit').value = parseFloat(dayBookTotal.cashIn).toFixed(2)
        totalCashRow.getCell('debit').value = parseFloat(dayBookTotal.cashOut).toFixed(2)
        totalCashRow.getCell('cash').value = ""
        totalCashRow.getCell('upi').value = ""
        totalCashRow.getCell('card').value =""
        totalCashRow.getCell('netBanking').value = ""
        totalCashRow.getCell('cheque').value = ""
        totalCashRow.getCell('giftCard').value = ""
        totalCashRow.getCell('customFinance').value= ""
        totalCashRow.getCell('exchange').value = ""
      data.push(totalCashRow);

      data.push(emptyRecord);

      const totalCreditSplitRow = worksheet.addRow({})

      totalCreditSplitRow.getCell('date').value = ""
      totalCreditSplitRow.getCell('sequenceNumber').value = ""
      totalCreditSplitRow.getCell('particulars').value = ""
      totalCreditSplitRow.getCell('txnType').value = "Total Credit Split"
      totalCreditSplitRow.getCell('credit').value = ""
      totalCreditSplitRow.getCell('debit').value = ""
      totalCreditSplitRow.getCell('cash').value = parseFloat(dayBookTotal.totalCashCredit).toFixed(2)
      totalCreditSplitRow.getCell('upi').value = parseFloat(dayBookTotal.totalUpiCredit).toFixed(2)
      totalCreditSplitRow.getCell('card').value = parseFloat(dayBookTotal.totalCardCredit).toFixed(2)
      totalCreditSplitRow.getCell('netBanking').value = parseFloat(dayBookTotal.totalNetBankingCredit).toFixed(2)
      totalCreditSplitRow.getCell('cheque').value = parseFloat(dayBookTotal.totalChequeCredit).toFixed(2)
      totalCreditSplitRow.getCell('giftCard').value = parseFloat(dayBookTotal.totalGiftCardCredit).toFixed(2)
      totalCreditSplitRow.getCell('customFinance').value = parseFloat(
        dayBookTotal.totalCustomFinanceCredit
      ).toFixed(2)
      totalCreditSplitRow.getCell('exchange').value = parseFloat(
        dayBookTotal.totalExchangeCredit
      ).toFixed(2)
      
      data.push(totalCreditSplitRow);

      const totalDebitSplitRow = worksheet.addRow({})

      totalDebitSplitRow.getCell('date').value = ""
      totalDebitSplitRow.getCell('sequenceNumber').value = ""
      totalDebitSplitRow.getCell('particulars').value = ""
      totalDebitSplitRow.getCell('txnType').value = "Total Debit Split"
      totalDebitSplitRow.getCell('credit').value = ""
      totalDebitSplitRow.getCell('debit').value = ""
      totalDebitSplitRow.getCell('cash').value = parseFloat(dayBookTotal.totalCashDebit).toFixed(2)
      totalDebitSplitRow.getCell('upi').value = parseFloat(dayBookTotal.totalUpiDebit).toFixed(2)
      totalDebitSplitRow.getCell('card').value = parseFloat(dayBookTotal.totalCardDebit).toFixed(2)
      totalDebitSplitRow.getCell('netBanking').value = parseFloat(dayBookTotal.totalNetBankingDebit).toFixed(2)
      totalDebitSplitRow.getCell('cheque').value = parseFloat(dayBookTotal.totalChequeDebit).toFixed(2)
      totalDebitSplitRow.getCell('giftCard').value = parseFloat(dayBookTotal.totalGiftCardDebit).toFixed(2)
      totalDebitSplitRow.getCell('customFinance').value = parseFloat(
        dayBookTotal.totalCustomFinanceDebit
      ).toFixed(2)
      totalDebitSplitRow.getCell('exchange').value = parseFloat(
        dayBookTotal.totalExchangeDebit
      ).toFixed(2)
      
      data.push(totalDebitSplitRow);
     
    } else {
      data.push(emptyRecord);
    }

    const fileName = 'Day_Book_Report';
    downloadExcelFromWorkBookBuffer(workbook,fileName)
  } catch (error) {
      console.log(error);
  }
};


  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);

      setDayBookData(await getDayBookData(date));
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, [date]);

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
    const blob = await pdf(
      <DayBookPDF
        data={dayBookData}
        settings={invoiceRegular}
        date={dateFormatter(date)}
        total={dayBookTotal}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, 'Day_Book');
  };

  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]); 

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
                      DAY BOOK
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
                            type="date"
                            value={date}
                            onChange={(e) =>
                              setDate(formatDate(e.target.value))
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

                <div>
                  <Box>
                    <div
                      style={{
                        width: '100%',
                        height: height - 260 + 'px'
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
                          rowData={dayBookData}
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
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: '10px'
                  }}
                >
                  <div>
                    <p>
                      <b>
                        <span className={classes.greenText}>Total Credit:</span>{' '}
                        {dayBookTotal.cashIn}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.greenText}>Cash:</span>{' '}
                        {dayBookTotal.totalCashCredit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.greenText}>Upi:</span>{' '}
                        {dayBookTotal.totalUpiCredit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.greenText}>Card:</span>{' '}
                        {dayBookTotal.totalCardCredit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.greenText}>Neft/Rtgs:</span>{' '}
                        {dayBookTotal.totalNetBankingCredit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.greenText}>Cheque:</span>{' '}
                        {dayBookTotal.totalChequeCredit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.greenText}>Gift Card:</span>{' '}
                        {dayBookTotal.totalGiftCardCredit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.greenText}>
                          Custom Finance:
                        </span>{' '}
                        {dayBookTotal.totalCustomFinanceCredit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.greenText}>
                          Exchange:
                        </span>{' '}
                        {dayBookTotal.totalExchangeCredit}
                      </b>
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: '10px',
                    marginLeft: '10px'
                  }}
                >
                  <div>
                    <p>
                      <b>
                        <span className={classes.redText}>Total Debit:</span>{' '}
                        {dayBookTotal.cashOut}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.redText}>Cash:</span>{' '}
                        {dayBookTotal.totalCashDebit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.redText}>Upi:</span>{' '}
                        {dayBookTotal.totalUpiDebit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.redText}>Card:</span>{' '}
                        {dayBookTotal.totalCardDebit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.redText}>Neft/Rtgs:</span>{' '}
                        {dayBookTotal.totalNetBankingDebit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.redText}>Cheque:</span>{' '}
                        {dayBookTotal.totalChequeDebit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.redText}>Gift Card:</span>{' '}
                        {dayBookTotal.totalGiftCardDebit}
                      </b>
                    </p>
                  </div>
                  <div style={{ marginLeft: '10px' }}>
                    <p>
                      <b>
                        <span className={classes.redText}>Custom Finance:</span>{' '}
                        {dayBookTotal.totalCustomFinanceDebit}
                      </b>
                    </p>
                  </div>
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
      {OpenAddDeliveryChallanInvoice ? <AddDeliveryChallan /> : null}
      {OpenAddsalesQuotationInvoice ? <AddSalesQuotation /> : null}
      {OpenAddSaleOrderInvoice ? <AddSaleOrder /> : null}
      {OpenAddApprovalInvoice ? <AddApproval /> : null}
      {OpenAddPurchaseOrder ? <AddPurchaseOrder /> : null}
      {OpenAddJobWorkInvoice ? <AddJobWorkIn /> : null}
      {OpenNewOrderInvoice ? <AddOrderInvoice /> : null}
      {openNewOrderReceipt ? <AddOrderReceipt /> : null}
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(DayBookReport);