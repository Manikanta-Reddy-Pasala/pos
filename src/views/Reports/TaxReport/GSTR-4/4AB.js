import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Box } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
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

const B2B4ABReport = (props) => {
  const classes = useStyles();
  const store = useStore();
  const {getPurchasesGSTR4AandBData} = store.GSTR4Store;
  const { gstr4AandBData } = toJS(store.GSTR4Store);

  const { height } = useWindowDimensions();


  useEffect(() => {
    async function fetchData() {
   
      getPurchasesGSTR4AandBData();
    }

    fetchData();

  }, [getPurchasesGSTR4AandBData ]);




  const [columnDefs] = useState([
    {
      headerName: 'GSTIN/UIN',
      field: 'vendor_gst_number',
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
      headerName: 'Bill Number',
      field: 'bill_number',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Bill</p>
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
      headerName: 'Bill Date',
      field: 'bill_date',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Bill</p>
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
      headerName: 'Bill Value',
      field: 'total_amount',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Bill</p>
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
      headerName: 'Place of Supply',
      field: 'place_of_supply',
      width: 100,
      minWidth: 120,
      valueFormatter: (params) => {
  
        let data = params['data'];
        let result = data['place_of_supply'] === 'selectState' ? '' : data['place_of_supply']
        return result;
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Place of</p>
            <p>Supply</p>
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
      valueFormatter: (params) => {
  
        let data = params['data'];
        let result = parseFloat((data['total_amount'])-(data['total_tax'])).toFixed(2);
        return result;
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
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Cess</p>
            <p>Amount</p>
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



  return (
    <div className={classes.root} style={{ minHeight: height - 262 }}>
      <div className={classes.itemTable}>
        {/* <App />  */}

        <Box mt={4}>
          <div
            style={{
              width: '100%',
              height:(height - 255) +'px'
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
                rowData={gstr4AandBData}
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

export default InjectObserver(B2B4ABReport);
