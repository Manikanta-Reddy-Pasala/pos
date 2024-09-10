import React, { useState, useEffect } from 'react';
import { Paper, makeStyles, Grid, Typography, Box } from '@material-ui/core';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { getPartyPerformers } from 'src/components/Helpers/ChartDataHelper/TopPerformersDataHelper';
import { AgGridReact } from 'ag-grid-react';

const useStyles = makeStyles((theme) => ({
  paperRoot: {
    padding: '24px',
    boxShadow: '0px 0px 12px -3px #0000004a',
    borderRadius: '10px'
  },
  newButton: {
    position: 'relative',
    borderRadius: 25,
    paddingRight: '15px'
  },

  searchInputRoot: {
    borderRadius: 50
  },
  searchIcon: {
    color: '#ccc'
  },

  tableRow: {
    '&.Mui-selected': {
      backgroundColor: '#CEE6F3 !important'
    }
  },
  itemTable: {
    width: '100%',
    display: 'inline-block'
  }
}));

const TopCustomers = (props) => {
  const classes = useStyles();

  const [gridApi, setGridApi] = useState(null);
  const [data, setData] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [columnDefs] = useState([
    {
      headerName: 'CUSTOMER',
      field: 'name',
      width: 400,
      filter: false
    },
    {
      headerName: 'AMOUNT',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return parseFloat(data.total).toFixed(2);
      },
    }
  ]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const performersData = await getPartyPerformers('Customer', 'Top', 5);
    setData(performersData);
  };

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
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  return (
    <>
      <Paper p={3} className={classes.paperRoot}>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h4">Top 5 Customers</Typography>
          </Grid>
        </Grid>

        <div className={classes.itemTable}>
          <Box mt={4}>
            <div style={{ width: '100%', height: '40vh' }}>
              <div
                id="product-list-grid"
                style={{ height: '100%', width: '100%' }}
                className="ag-theme-material"
              >
                <AgGridReact
                  onGridReady={onGridReady}
                  enableRangeSelection
                  suppressMenuHide
                  rowData={data}
                  pageSize={5}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  rowSelection="single"
                  headerHeight={40}
                  overlayLoadingTemplate={
                    '<span className="ag-overlay-loading-center">Please wait while your rows are loading</span>'
                  }
                  rowClassRules={rowClassRules}
                  frameworkComponents={{}}
                />
              </div>
            </div>
          </Box>
        </div>
      </Paper>
    </>
  );
};

export default InjectObserver(TopCustomers);