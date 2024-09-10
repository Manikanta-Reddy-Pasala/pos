import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import 'react-table/react-table.css';
import '../../Expenses/ExpenseTable.css';
import { Box } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import Moreoptions from 'src/components/MoreoptionsCashInHandTxnList';
import './cash.css';

import AddCash from './modal/AddCash';
import useWindowDimensions from 'src/components/windowDimension';

import { SecondaryButton } from 'src/views/sales/SalesInvoices/AddInvoice/MFGDetails/MEGDetails.styles';
import BubbleLoader from 'src/components/loader';
import { formatDate } from 'src/components/Helpers/DateHelper';

const CashTransactionTable = ({ reportDate, clearReport, formatCurrency }) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { height } = useWindowDimensions();
  const [totalCashInHand] = React.useState(reportDate?.cashInHand);
  const [cashFlowList] = React.useState(reportDate?.cashList);

  const statusCellStyle = (params) => {
    let data = params['data'];
    if (data['transactionType'] === 'Cash Adjustment') {
      if (data['paymentType'] === 'addCash') {
        return { color: '#339900', fontWeight: 500 };
      } else {
        return { color: '#EF5350', fontWeight: 500 };
      }
    } else if (
      data['transactionType'] === 'Payment In' ||
      data['transactionType'] === 'Sales' ||
      data['transactionType'] === 'Purchases Return' ||
      data['transactionType'] === 'KOT'
    ) {
      return { color: '#339900', fontWeight: 500 };
    } else {
      return { color: '#EF5350', fontWeight: 500 };
    }
  };

  const TemplateMoreOptionRenderer = (props) => {
    if (props['data']['transactionType'] === 'Cash Adjustment') {
      return (
        <Moreoptions
          index={props['data']['expenseId']}
          id={props['data']['expenseId']}
          item={props['data']}
          component="expensesList"
        />
      );
    } else {
      return [];
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'TYPE',
      field: 'transactionType',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'NAME',
      field: 'name',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
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
      }
      // filter: 'agDateColumnFilter',
    },
    {
      headerName: 'AMOUNT',
      field: 'amount',
      width: 300,
      editable: false,
      // filter: 'agNumberColumnFilter',
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },

      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;

        if (data.isCredit) {
          if (data['paidOrReceivedAmount']) {
            result = parseFloat(data['paidOrReceivedAmount']);
          }
        } else {
          let amount = 0;

          if (data.splitPaymentList && data.splitPaymentList.length > 0) {
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

        return result;
      },
      cellStyle: statusCellStyle
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      width: 150,
      cellRenderer: 'templateMoreOptionRenderer'
    }
  ]);

  useEffect(() => {
    if (gridApi) {
      if (cashFlowList) {
        gridApi.setRowData(cashFlowList);
      }
    }
  }, [gridApi, cashFlowList]);

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
    <Grid container direction="row" alignItems="center" justifyContent="center">
      {clearReport && (
        <Box display={'flex'} width="100%" alignItems={'center'}>
          <SecondaryButton
            color="secondary"
            variant="contained"
            onClick={clearReport}
          >
            Back
          </SecondaryButton>
          <Box display="flex">
            <Box display="flex">
              <Box fontWeight={600} pr={2}>
                Cash In Hand:
              </Box>{' '}
              <span
                style={{
                  color:
                    parseFloat(reportDate?.cashInHand) >= 0
                      ? '#339900'
                      : '#EF5350'
                }}
              >
                {formatCurrency
                  ? formatCurrency(parseFloat(reportDate?.cashInHand))
                  : reportDate?.cashInHand}
              </span>{' '}
            </Box>
            {reportDate?.type !== 'Opening Cash' && (
              <>
                <Box display="flex" px={2}>
                  <Box fontWeight={600} pr={2}>
                    Start Date:
                  </Box>{' '}
                  {formatDate(reportDate?.startDate)}
                </Box>
                <Box display="flex" px={2}>
                  <Box fontWeight={600} pr={2}>
                    End Date:
                  </Box>
                  {formatDate(reportDate?.endDate)}
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
      <Grid item xs={12}>
        <Box mt={4}>
          <div
            id="product-list-grid"
            className="red-theme "
            style={{ width: '100%', height: '80vh' }}
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
                rowData={cashFlowList}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                pagination
                rowSelection="single"
                headerHeight={40}
                rowClassRules={rowClassRules}
                frameworkComponents={{
                  templateMoreOptionRenderer: TemplateMoreOptionRenderer
                }}
              />
            </div>
          </div>
        </Box>
      </Grid>
      <AddCash fullWidth maxWidth="sm" />{' '}
    </Grid>
  );
};

export default InjectObserver(CashTransactionTable);
