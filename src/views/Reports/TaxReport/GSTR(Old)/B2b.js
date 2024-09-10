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
import { getDataGridUtilityClass } from '@material-ui/data-grid';
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

const B2BReport = () => {
  const classes = useStyles();
  const store = useStore();
  const taxdata = [];
  const { height } = useWindowDimensions();
  const [rowData, setRowData] = useState([]);

  const { getB2bSalesData } = store.SalesAddStore;

  useEffect(() => {
    async function fetchData() {
      setRowData(await getB2bSalesData());
    }

    fetchData();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: 'GSTIN/UIN',
      field: 'customerGSTNo',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>GSTIN/</p>
            <p>UIN</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Receiver Name',
      field: 'customer_name',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>RECEIVER</p>
            <p>NAME</p>
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
            <p>INVOICE</p>
            <p>NO</p>
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
            <p>INVOICE</p>
            <p>DATE</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Invoice Value',
      field: 'total_amount',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE</p>
            <p>VALUE</p>
          </div>
        );
      },
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
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>PLACE OF</p>
            <p>SUPPLY</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Reverse Charge',
      field: 'state',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>REVERSE</p>
            <p>CHARGE</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Invoice Type',
      field: 'cess',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INVOICE</p>
            <p>TYPE</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'E-Commerce GSTIN',
      field: 'total_tax',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>E-COMMERCE</p>
            <p>GSTIN</p>
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
      field: 'ecommerce',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Taxable Value',
      field: 'integrated_tax',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TAXABLE</p>
            <p>VALUE</p>
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
      field: 'central_tax',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>INTEGRATED</p>
            <p>TAX</p>
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
            <p>CENTRAL</p>
            <p>TAX</p>
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
            <p>STATE</p>
            <p>UT TAX</p>
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
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>CESS</p>
            <p>AMOUNT</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Total Tax Amt.',
      field: 'ecommerce',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>TOTAL</p>
            <p>TAX AMT.</p>
          </div>
        );
      },
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
                rowData={rowData}
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

export default InjectObserver(B2BReport);
