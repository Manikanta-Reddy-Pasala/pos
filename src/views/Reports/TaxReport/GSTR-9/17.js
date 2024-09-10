import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import { Box } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import useWindowDimensions from '../../../../components/windowDimension';
import { toJS } from 'mobx';
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
  },
  headerFour : {
    textAlign: 'center',
    background:'#e3e3e3',
    fontWeight: 'bold',
    paddingTop: '5px',
    paddingBottom: '5px',
    marginTop:'20px',
    fontSize:'small'
  },
  r4:{
      display:'inline-block',
      
      paddingLeft:'10px',
      float:'left',
  },
}));

const GSTR917Report = () => {
  const classes = useStyles();
  const store = useStore();
  const { height } = useWindowDimensions();

  const [rowData, setRowData] = useState([]);
  const { getSalesRowData, getSalesData } = store.GSTHsnStore;
  const { GSTRDateRange } = toJS(store.GSTR9Store);

  useEffect(() => {
    async function fetchData() {
      await getSalesData(GSTRDateRange.fromDate, GSTRDateRange.toDate);
      setRowData(await getSalesRowData());     
    }

    fetchData();
  
  }, [GSTRDateRange, getSalesData, getSalesRowData]);

  const [columnDefs] = useState([
    {
      headerName: 'HSN',
      field: 'hsn',
      width: 100,
      minWidth: 100,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'UQC',
      field: 'rate',
      width: 100,
      minWidth: 120,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Total Quantity',
      field: 'txnQty',
      width: 100,
      minWidth: 120,
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Total</p>
            <p>Qty</p>
          </div>
        );
      },
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Taxable Value',
      field: 'amount',
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
        headerName: 'Rate of Tax',
        field: 'total_tax',
        width: 100,
        minWidth: 120,
        headerComponentFramework: (props) => {
          return (
            <div>
              <p>Rate of</p>
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
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        result = data['igst_amount'];
        return parseFloat(result).toFixed(2);
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
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        result = data['cgst_amount'];
        return parseFloat(result).toFixed(2);
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
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        result = data['sgst_amount'];
        return parseFloat(result).toFixed(2);
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
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let result = 0;
        result = data['cess'];
        return parseFloat(result).toFixed(2);
      }
    },
    
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
         <div className={classes.headerFour} >
         <p className={classes.r4}>17</p><p style={{display:'inline'}}>HSN Wise Summary Of Outward Supplies </p>
         </div>
      <div className={classes.itemTable}>
        {/* <App />  */}

        <Box mt={4}>
          <div
            style={{
              height:(height - 255) +'px'
            }}
            className=" blue-theme"
          >
            <div
              id="product-list-grid"
              style={{ height: '100%' }}
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

export default InjectObserver(GSTR917Report);
