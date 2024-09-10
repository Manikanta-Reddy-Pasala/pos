import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import 'react-table/react-table.css';
import '../../Expenses/ExpenseTable.css';
import { Box } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import { toJS } from 'mobx';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import Moreoptions from '../../../components/MoreoptionsCashInHandTxnList';
import './cash.css';

import AddCash from './modal/AddCash';
import useWindowDimensions from 'src/components/windowDimension';

const CashTransactionTable = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { height } = useWindowDimensions();

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

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const todayDate = new Date(thisYear, thisMonth, today);
  const firstYear = new Date(thisYear, 0, 1);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const store = useStore();

  const { cashFlowList } = toJS(store.ReportsStore);
  const { getCashFlowData } = store.ReportsStore;

  const [fromDate] = React.useState(formatDate(firstYear));
  const [toDate] = React.useState(formatDate(todayDate));

  useEffect(() => {
    async function fetchData() {
      getCashFlowData(fromDate, toDate);
    }

    fetchData();
  }, []);

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
    <Grid
      container
      direction="row"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12}>
        <Box mt={4}>
          <div
            id="product-list-grid"
            className="red-theme "
            style={{ width: '100%', height: height - 185 + 'px' }}
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
