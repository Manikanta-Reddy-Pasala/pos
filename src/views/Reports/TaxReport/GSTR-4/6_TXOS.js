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
  }
}));

const TXOS6Report = (props) => {
  const classes = useStyles();
  const store = useStore();
  const { height } = useWindowDimensions();

  const { taxSettingsData } = toJS(store.TaxSettingsStore);
  //const { getProfitAndLossData } = store.ReportsStore;
  const {
    totalSaleAmount,
    totalSaleReturnAmount,
  } = toJS(store.ReportsStore);



  const [rowData, setRowData] = useState([]);


  // useEffect(() => {
  //   async function fetchData() {
  //     getProfitAndLossData(props.fromDate, props.toDate);
    
  //   }

  //   fetchData();
  // }, [getProfitAndLossData, props]);



  useEffect(() => {
    setRowData([
      {
        rate_of_tax : taxSettingsData.compositeSchemeValue,
        turnover: (Number(totalSaleAmount)-Number(totalSaleReturnAmount)).toFixed(2),
        cgst: (((Number(totalSaleAmount)-Number(totalSaleReturnAmount)) * (taxSettingsData.compositeSchemeValue/2)) / 100).toFixed(2),
        sgst: (((Number(totalSaleAmount)-Number(totalSaleReturnAmount)) * (taxSettingsData.compositeSchemeValue/2)) / 100).toFixed(2),
      }
    ]);
  },[taxSettingsData.compositeSchemeValue, totalSaleAmount, totalSaleReturnAmount])




  const [columnDefs] = useState([
    {
      headerName: 'Rate of Tax',
      field: 'rate_of_tax',
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Rate of</p>
            <p>Tax</p>
          </div>
        );
      },
     
    },
    {
      headerName: 'Turnover',
      field: 'turnover',
      // filterParams: {
      //   buttons: ['reset', 'apply'],
      //   closeOnApply: true
      // }
    },
    {
      headerName: 'Composition Central Tax Amount',
      field: 'cgst',
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Composition Central</p>
            <p>Tax Amount</p>
          </div>
        );
      },
    
    },
    {
      headerName: 'Composition State/UT Tax Amount',
      field: 'sgst',
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Composition State/UT</p>
            <p>Tax Amount</p>
          </div>
        );
      },
     
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
    sortable: false,
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

  return (
    <div className={classes.root} style={{ minHeight: height - 262 }}>
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
                pagination={false}
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

export default InjectObserver(TXOS6Report);
