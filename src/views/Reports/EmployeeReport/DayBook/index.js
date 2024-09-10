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
  Paper,
  MenuItem,
  Select,
  OutlinedInput,
  Button
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
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
  }
}));

const DayBookByEmployeeReport = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [dayBookData, setDayBookData] = useState([]);

  const store = useStore();

  const { dayBookTotal } = toJS(store.ReportsStore);
  const { getDayBookEmployeeData } = store.ReportsStore;

  const [employeeList, setEmployeeList] = React.useState();
  const [employeeName, setEmployeeName] = React.useState('');
  const [employeeId, setEmployeeId] = React.useState();

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const todayDate = new Date(thisYear, thisMonth, today);

  const { getAllReportEmployees } = store.EmployeeStore;

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
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      cellStyle: invoiceNumberCellStyle
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
    // {
    //   headerName: 'Total',
    //   field: 'total',
    //   width: 300,
    //   filterParams: {
    //     buttons: ['reset', 'apply'],
    //     closeOnApply: true
    //   }
    // },
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
          data['txnType'] === 'KOT' ||
          data['txnType'] === 'Opening Balance'
        ) {
          if (data['amount']) {
            result = parseFloat(data['amount']);
          }
        }
        return result;
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
          if (data['amount']) {
            result = parseFloat(data['amount']);
          }
        }
        return result;
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

  function getName(cashFlowData) {
    let result = '';
    if (cashFlowData['customerName']) {
      result = cashFlowData['customerName'];
    }

    if (cashFlowData['vendorName']) {
      result = cashFlowData['vendorName'];
    }
    return result;
  }

  function getCashIn(cashFlowData) {
    let result = '';
    if (
      cashFlowData['txnType'] === 'Payment In' ||
      cashFlowData['txnType'] === 'Sales' ||
      cashFlowData['txnType'] === 'Purchases Return' ||
      cashFlowData['txnType'] === 'KOT'
    ) {
      if (cashFlowData['amount']) {
        result = parseFloat(cashFlowData['amount']);
      }
    }
    if (!result) {
      result = 0;
    }
    return result;
  }

  function getCashOut(cashFlowData) {
    let result = '';

    if (
      cashFlowData['txnType'] === 'Payment Out' ||
      cashFlowData['txnType'] === 'Sales Return' ||
      cashFlowData['txnType'] === 'Purchases' ||
      cashFlowData['txnType'] === 'Expenses'
    ) {
      if (cashFlowData['amount']) {
        result = parseFloat(cashFlowData['amount']);
      }
    }
    if (!result) {
      result = 0;
    }
    return result;
  }

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromCashFlow = () => {
    const wb = new Workbook();
    let data = [];
    if (dayBookData && dayBookData.length > 0) {
      for (var i = 0; i < dayBookData.length; i++) {
        const record = {
          Date: getDate(dayBookData[i]),
          'Invoice/Bill No': dayBookData[i].sequenceNumber,
          Particulars: getName(dayBookData[i]),
          Type: dayBookData[i].txnType,
          'Cash In': getCashIn(dayBookData[i]),
          'Cash Out': getCashOut(dayBookData[i])
        };
        data.push(record);
      }
      const emptyRecord = {};
      data.push(emptyRecord);
      data.push(emptyRecord);
    } else {
      const record = {
        DATE: '',
        'Invoice/Bill No': '',
        Particulars: '',
        Type: '',
        // Total: '',
        'Cash In': '',
        'Cash Out': ''
      };
      data.push(record);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Day Book Sheet');

    console.log('test:: ws::', ws);
    wb.Sheets['Day Book Sheet'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Day_Book_Report';

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

      setDayBookData(await getDayBookEmployeeData(date, employeeId));
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, [date]);

  useEffect(() => {
    getEmployees();
  }, []);

  const getEmployees = async () => {
    setEmployeeList(await getAllReportEmployees());
  };

  const handleEmployeeClick = async (employee) => {
    setEmployeeName(employee.name);
    setEmployeeId(employee.employeeId);
    setDayBookData(await getDayBookEmployeeData(date, employee.employeeId));
  };

  const resetEmployee = async () => {
    setDayBookData(await getDayBookEmployeeData(date, null));
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Employees Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  const onGridReady = (params) => {
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
                    <Grid item xs={4}>
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
                    <Grid item xs={4}>
                      <Grid style={{ display: 'flex' }} item xs={11}>
                        <Select
                          displayEmpty
                          value={employeeName}
                          input={
                            <OutlinedInput
                              style={{ width: '100%', marginLeft: '-3px' }}
                            />
                          }
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem disabled value="">
                            Select Employee
                          </MenuItem>
                          {employeeList &&
                            employeeList.map((c) => (
                              <MenuItem
                                key={c.name}
                                value={c.name}
                                name={c.name}
                                style={{ color: 'black' }}
                                onClick={() => {
                                  setEmployeeName(c.name);
                                  handleEmployeeClick(c);
                                }}
                              >
                                {c.name}
                              </MenuItem>
                            ))}
                        </Select>
                        <Button
                          className={classes.resetbtn}
                          size="small"
                          onClick={() => {
                            setEmployeeName('');
                            setEmployeeId(null);
                            resetEmployee();
                          }}
                          color="secondary"
                        >
                          RESET
                        </Button>
                      </Grid>
                    </Grid>
                    <Grid item xs={4}>
                      <Grid
                        container
                        direction="row"
                        alignItems="center"
                        justify="flex-end"
                        className="category-actions-right"
                      >
                        <Avatar>
                          <IconButton onClick={() => getDataFromCashFlow()}>
                            <Excel fontSize="inherit" />
                          </IconButton>
                        </Avatar>
                        {/* <IconButton classes={{ label: classes.label }}>
              <Print fontSize="inherit" />
              <span className={classes.iconLabel}>Print</span>
                  </IconButton> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </div>

                <div>
                  {/* <App />  */}

                  <Box>
                    <div
                      style={{
                        width: '100%',
                        height: height - 192 + 'px'
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
                <div className={classes.footer}>
                  <div>
                    <Grid container>
                      <Grid item xs={3} className={classes.greenText}></Grid>

                      <Grid item xs={6}>
                        <Grid
                          container
                          style={{
                            padding: '3px',
                            fontSize: 'medium',
                            marginTop: '10px'
                          }}
                        >
                          <Grid item xs={9} style={{ textAlign: 'end' }}>
                            Total:
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            style={{ textAlign: 'end' }}
                            className={classes.greenText}
                          >
                            &#8377; {dayBookTotal.cashIn}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={3}
                        style={{
                          textAlign: 'center',
                          padding: '3px',
                          fontSize: 'medium',
                          marginTop: '10px'
                        }}
                        className={classes.amount}
                      >
                        &#8377; {dayBookTotal.cashOut}
                      </Grid>
                    </Grid>
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

export default InjectObserver(DayBookByEmployeeReport);
