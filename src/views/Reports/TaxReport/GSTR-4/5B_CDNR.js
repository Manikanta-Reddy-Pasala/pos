import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Box } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import Excel from '../../../../icons/Excel';
import XLSX from 'xlsx';
import useWindowDimensions from '../../../../components/windowDimension';
const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none'
  },

  selectFont: {
    fontSize: '13px'
  },
  noLabel: {
    marginTop: theme.spacing(3)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 30,
    borderRadius: '12px'
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
  root: {
    '& .makeStyles-paper-31': {
      borderRadius: '12px'
    }
  },

  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
    border: '1px solid grey',
    padding: '6px',
    background: 'white'
  },
  label: {
    flexDirection: 'column'
  },
  iconLabel: {
    fontSize: 'x-small'
  },
  iconAlign: {
    textAlign: 'end',
    padding: '14px'
  },
  footer: {
    borderTop: '1px solid #d8d8d8',
    padding: '20px'
  },
  amount: {
    textAlign: 'end',
    color: '#000000'
  },
  totalQty: {
    color: '#80D5B8',
    textAlign: 'center'
  },
  cash_hand: {
    marginTop: '20px',
    padding: '15px'
  },
  blockLine: {
    display: 'inline-block',
    marginLeft: '13px'
  },
  csh: {
    marginTop: '30px',
    textAlign: 'center'
  },
  categoryActionWrapper: {
    padding: theme.spacing(2),
    '& .category-actions-left': {
      '& > *': {
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    },
    '& .category-actions-right': {
      '& > *': {
        marginLeft: theme.spacing(2),
        backgroundColor: '#fff',
        border: '1px solid lightgrey'
      }
    }
  }
}));

const CDNR5BReport = () => {
  const classes = useStyles();
  const store = useStore();
  const { height } = useWindowDimensions();

  const { getPurchasesReturnGSTR45BCDNRData } = store.GSTR4Store;
  const { gstr45BCDNRData } = toJS(store.GSTR4Store);

  useEffect(() => {
    async function fetchData() {
      getPurchasesReturnGSTR45BCDNRData();
    }

    fetchData();
  }, [getPurchasesReturnGSTR45BCDNRData]);

  const [columnDefs] = useState([
    {
      headerName: 'GSTIN of Supplier',
      field: 'gst_number',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GSTIN of</p>
            <p>Supplier</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Invoice Number',
      field: 'sequenceNumber',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Invoice</p>
            <p>No</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Invoice Date',
      field: 'invoice_date',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Invoice</p>
            <p>Date</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Document Type',
      field: 'document_type',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Document</p>
            <p>Type</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Supply Type',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Supply</p>
            <p>Type</p>
          </div>
        );
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = '';
        if (data.cgst_amount > 0 && data.sgst_amount > 0) {
          result = 'Intrastate';
        }
        if (data.igst_amount > 0) {
          result = 'Interstate';
        }
        return result;
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Reverse Charge',
      field: 'reverseChargeValue',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Reverse</p>
            <p>Charge</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Rate',
      field: 'total_tax',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Taxable Value',
      field: 'taxable_value',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Taxable</p>
            <p>Value</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Integrated Tax',
      field: 'igst_amount',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Integrated</p>
            <p>Tax</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Central Tax',
      field: 'cgst_amount',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Central</p>
            <p>Tax</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'State / UT Tax',
      field: 'sgst_amount',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>State /</p>
            <p>UT Tax</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Cess Amount',
      field: 'cess',
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Cess</p>
            <p>Amount</p>
          </div>
        );
      },
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

  function convertPXToVW(px) {
    const result = px * (100 / document.documentElement.clientWidth) + 20;
    return result + 'vh';
  }

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
                rowData={gstr45BCDNRData}
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

export default InjectObserver(CDNR5BReport);
