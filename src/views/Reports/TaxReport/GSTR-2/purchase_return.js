import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Box } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import useWindowDimensions from '../../../../components/windowDimension';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  }
}));

const PurchaseReturnGstr2Report = () => {
  const classes = useStyles();
  const store = useStore();
  const { height } = useWindowDimensions();

  const { getPurchasesReturnData } = store.GSTR2Store;
  const { purchasesReturnData } = store.GSTR2Store;

  async function fetchData() {
    await getPurchasesReturnData();
  }

  useEffect(() => {
    fetchData();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: 'GSTIN/UIN',
      field: 'vendor_gst_number',
      width: 100,

      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Place of Supply',
      field: 'place_of_supply',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Bill Return Number',
      field: 'purchaseReturnBillNumber',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Return Date',
      field: 'date',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Bill Value',
      field: 'amount',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },

    {
      headerName: 'Total Tax %',
      field: 'tax_percentage',
      width: 100,
      minWidth: 100,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Taxable Value',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        result = parseFloat(data['amount'] - data['total_tax']).toFixed(2);
        return parseFloat(result).toFixed(2);
      }
    },
    {
      headerName: 'SGST',
      field: 'sgst_amount',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'CGST',
      field: 'cgst_amount',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'IGST',
      field: 'igst_amount',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Cess',
      field: 'cess',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Total Tax',
      field: 'total_tax',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

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

  return (
    <div className={classes.root} style={{ minHeight: height - 262 }}>
      <div className={classes.itemTable}>
        {/* <App />  */}

        <Box mt={4}>
          <div
            style={{
              width: '100%',
              height: height - 255 + 'px'
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
                paginationPageSize={20}
                suppressMenuHide
                rowData={purchasesReturnData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowSelection="single"
                pagination
                headerHeight={40}
                rowClassRules={rowClassRules}
                overlayLoadingTemplate={
                  '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                }
                frameworkComponents={{}}
              />
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default InjectObserver(PurchaseReturnGstr2Report);
