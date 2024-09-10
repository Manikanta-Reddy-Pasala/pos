import React, { useState, useEffect } from 'react';
import { Grid, makeStyles } from '@material-ui/core';
import 'react-table/react-table.css';
import { Typography, Avatar, IconButton } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import { toJS } from 'mobx';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import './vendor.css';
import useWindowDimensions from 'src/components/windowDimension';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import AddPayment from 'src/views/sales/PaymentIn/AddPayment';
import AddnewPaymentOut from 'src/views/purchases/PaymentOut/AddPaymentOut';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import AddExpenses from 'src/views/Expenses/Modal/AddExpenses';
import * as Db from '../../../../RxDb/Database/Database';
import * as Bd from '../../../../components/SelectedBusiness';
import AddDeliveryChallan from 'src/views/sales/DeliveryChallan/AddDeliveryChallan';
import AddSalesQuotation from 'src/views/sales/SalesQuotation/AddSalesQuotation';
import AddSaleOrder from 'src/views/sales/SaleOrder/AddSaleOrder';
import AddApproval from 'src/views/sales/Approval/AddApproval';
import AddPurchaseOrder from 'src/views/purchases/PurchaseOrder/AddPurchaseOrder';
import AddJobWorkIn from 'src/views/JobWork/OrderIn';
import AddOrderInvoice from 'src/views/JobWork/OrderInvoice';
import AddOrderReceipt from 'src/views/JobWork/OrderReceipt/AddOrderReceipt';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import PDFIcon from '@material-ui/icons/PictureAsPdf';
import PartyTransactionPDF from 'src/views/PDF/PartyTransaction/PartyTransactionPDF';
import EWayGenerate from 'src/views/EWay/Generate/EWayGenerate';
import ProductModal from 'src/components/modal/ProductModal';

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
  footer: {
    borderTop: '1px solid #d8d8d8'
  },
  greenText: {
    color: '#339900'
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
  }
}));

const VendorTransactionTable = () => {
  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { height } = useWindowDimensions();

  const numberSort = (num1, num2) => {
    return num1 - num2;
  };

  const store = useStore();
  const { openAddSalesInvoice , isLaunchEWayAfterSaleCreation, printData} = toJS(store.SalesAddStore);
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

  const { selectedVendor, accountsPayableResult, accountsPayableTotalToPay } =
    toJS(store.ReportsStore);

  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const { getInvoiceSettings } = store.PrinterSettingsStore;

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
  }, []);

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
      headerName: 'Ref No',
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
      headerName: 'Date',
      field: 'date',
      width: 300,
      editable: false,

      filter: false
    },
    {
      headerName: 'Type',
      field: 'txnType',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Total',
      field: 'amount',
      filter: false,
      editable: false,
      // filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      comparator: numberSort
    },
    {
      headerName: 'Balance',
      field: 'balance',
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      comparator: numberSort
    }
  ]);

  useEffect(() => {
    if (gridApi) {
      if (accountsPayableResult) {
        gridApi.setRowData(accountsPayableResult);
      }
    }
  }, [accountsPayableResult]);

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
    filter: false,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();

    this.SheetNames = [];
    this.Sheets = {};
  }

  const getDataFromCashFlow = () => {
    const wb = new Workbook();

    let data = [];

    if (accountsPayableResult && accountsPayableResult.length > 0) {
      for (var i = 0; i < accountsPayableResult.length; i++) {
        const record = {
          Date: accountsPayableResult[i].date,
          'Ref No': accountsPayableResult[i].sequenceNumber,
          Type: accountsPayableResult[i].txnType,
          Total: accountsPayableResult[i].amount,
          Balance: accountsPayableResult[i].balance
        };
        data.push(record);
      }
      const emptyRecord = {};
      data.push(emptyRecord);
      data.push(emptyRecord);
      const totalCashRecord = {
        Date: '',
        'Ref No': '',
        Type: 'Total',
        Total: accountsPayableTotalToPay
      };
      data.push(totalCashRecord);
      const details = {
        Date: '',
        'Ref No': '',
        Type: 'Vendor Name',
        Total: selectedVendor && selectedVendor.name ? selectedVendor.name : ''
      };
      data.push(details);
    } else {
      const record = {
        Date: '',
        'Ref No': '',
        Type: '',
        Total: '',
        Balance: ''
      };
      data.push(record);
      const emptyRecord = {};
      data.push(emptyRecord);
      data.push(emptyRecord);
      const details = {
        Date: '',
        'Ref No': '',
        Type: 'Vendor Name',
        Total: selectedVendor && selectedVendor.name ? selectedVendor.name : ''
      };
      data.push(details);
    }

    let ws = XLSX.utils.json_to_sheet(data);

    console.log(ws);

    /* hide last column */
    ws['!cols'] = [];

    wb.SheetNames.push('Accounts Payable by Vendor');

    console.log('test:: ws::', ws);
    wb.Sheets['Accounts Payable by Vendor'] = ws;

    const wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: true,
      type: 'binary'
    });

    let url = window.URL.createObjectURL(
      new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
    );

    const fileName = 'Accounts_Payable_by_vendor_Sheet';

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

  const generatePDFDocument = async () => {
    const blob = await pdf(
      <PartyTransactionPDF
        data={accountsPayableResult}
        settings={invoiceRegular}
        party={selectedVendor}
      />
    ).toBlob();

    console.log(blob);

    saveAs(blob, selectedVendor.name + '_Transactions');
  };

  useEffect(() => {
    if (isLaunchEWayAfterSaleCreation === true) {
      handleOpenEWayGenerateModal('Invoice', printData);

      resetEWayLaunchFlag();
    }
  }, [isLaunchEWayAfterSaleCreation]);

  return (
    <div>
      <Grid
        container
        direction="row"
        spacing={2}
        alignItems="center"
        justify="center"
        className={classes.categoryActionWrapper}
      >
        <Grid item xs={10} sm={10}>
          <div className={classes.content}>
            <div className={classes.contentLeft}>
              <Typography gutterBottom style={{ fontSize: '14px' }}>
                Vendor Name :{' '}
                {selectedVendor && selectedVendor.name
                  ? selectedVendor.name
                  : ''}
              </Typography>
              <Typography gutterBottom style={{ fontSize: '14px' }}>
                Phone No :{' '}
                {selectedVendor && selectedVendor.phoneNo
                  ? selectedVendor.phoneNo
                  : ''}
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid item xs={1} sm={1}>
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
        <Grid item xs={1} sm={1}>
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
        <Grid item xs={12}>
          <div
            id="product-list-grid"
            className="red-theme "
            style={{ width: '100%', height: height - 195 + 'px' }}
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
                rowData={accountsPayableResult}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination
                rowSelection="single"
                headerHeight={40}
                rowClassRules={rowClassRules}
                onCellClicked={handleCellClicked}
                overlayLoadingTemplate={
                  '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                }
                overlayNoRowsTemplate={
                  '<span className="ag-overlay-loading-center">No Rows to Show !</span>'
                }
              />
            </div>
          </div>

          <div className={classes.footer}>
            <div>
              <Grid container>
                <Grid item xs={6} className={classes.greenText}></Grid>

                <Grid item xs={6} className={classes.greenText}>
                  <Grid container style={{ padding: '2px' }}>
                    <Grid item xs={9} style={{ textAlign: 'center' }}>
                      Total :
                    </Grid>
                    <Grid item xs={3} style={{ textAlign: 'start' }}>
                      &#8377; {accountsPayableTotalToPay}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
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
      {openEWayGenerateModal ? <EWayGenerate /> : null}
      {productDialogOpen ? <ProductModal /> : null}
    </div>
  );
};

export default InjectObserver(VendorTransactionTable);