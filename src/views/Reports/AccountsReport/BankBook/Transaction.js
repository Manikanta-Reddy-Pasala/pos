import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Box, Grid, Paper, Typography } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import useWindowDimensions from '../../../../components/windowDimension';
import { toJS } from 'mobx';
import * as Db from '../../../../RxDb/Database/Database';
import * as Bd from '../../../../components/SelectedBusiness';

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

const Transaction = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

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

  const { viewOrEditSaleTxnItem } = store.SalesAddStore;
  const { viewOrEditSaleReturnTxnItem } = store.ReturnsAddStore;
  const { viewOrEditPurchaseTxnItem } = store.PurchasesAddStore;
  const { viewOrEditPurchaseReturnTxnItem } = store.PurchasesReturnsAddStore;
  const { viewOrEditPaymentInTxnItem } = store.PaymentInStore;
  const { viewOrEditPaymentOutTxnItem } = store.PaymentOutStore;
  const { viewOrEditExpenseItem } = store.ExpensesStore;

  useEffect(() => {
    if (gridApi) {
      if (bankTransactionList) {
        gridApi.setRowData(bankTransactionList);
      }
    }
  }, [bankTransactionList]);

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
      headerName: 'No',
      field: 'sequenceNumber',
      width: 200,
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
        return parseFloat(result).toFixed(2);
      }
    },
    {
      headerName: 'Cash Out',
      field: 'cash_out',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false,
      valueFormatter: (params) => {
        let data = params['data'];
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
        return parseFloat(result).toFixed(2);
      }
    },
    {
      headerName: 'UPI',
      field: 'upi',
      width: 250,
      filter: false
    },
    {
      headerName: 'CARD',
      field: 'card',
      width: 250,
      filter: false
    },
    {
      width: 250,
      field: 'netBanking',
      filter: false,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>NEFT/</p>
            <p>RTGS</p>
          </div>
        );
      }
    },
    {
      headerName: 'CHEQUE',
      field: 'cheque',
      width: 300,
      filter: false
    }
  ]);

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

  return (
    <div>
      <div className={classes.root} style={{ minHeight: height - 83 }}>
        <Paper className={classes.root} style={{ minHeight: height - 83 }}>
          <div>
            <Box>
              <div
                style={{
                  width: '100%',
                  height: height - 256 + 'px'
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
                    rowData={bankTransactionList}
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

          <Grid container>
            <Grid
              item
              xs={12}
              style={{
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '15px',
                marginBottom: '10px'
              }}
            >
              <Grid
                item
                xs={4}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Grid item>
                  <Typography>
                    Cash In : {parseFloat(bankBookCashInTotal).toFixed(2)}{' '}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    Cash Out : {parseFloat(bankBookCashOutTotal).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={4}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Grid item>
                  <Typography>
                    Upi: {parseFloat(bankBookUpiTotal).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    Card : {parseFloat(bankBookCardTotal).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                item
                xs={4}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <Grid item>
                  <Typography>
                    Neft/Rtgs : {parseFloat(bankBookNeftTotal).toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography>
                    Cheque : {parseFloat(bankBookChequeTotal).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

export default InjectObserver(Transaction);