import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import 'react-table/react-table.css';
import '../../Expenses/ExpenseTable.css';
import {
  Container,
  Box,
  makeStyles,
  Typography,
  Button
} from '@material-ui/core';
import Page from '../../../components/Page';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';

import useWindowDimensions from 'src/components/windowDimension';
import AddRate from '../AddRate';
import MoreOptionsRates from 'src/components/MoreOptionsRates';
import * as Db from '../../../RxDb/Database/Database';
import * as Bd from '../../../components/SelectedBusiness';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: 2
    // textAlign: 'center',
  },
  sideList: {
    padding: theme.spacing(1)
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
  }
}));

const RateList = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { height } = useWindowDimensions();
  const [rowData, setRowData] = useState([]);

  const TemplateMoreOptionRenderer = (props) => {
    return (
      <MoreOptionsRates
        index={props['data']['id']}
        id={props['data']['id']}
        item={props['data']}
        component="rateList"
      />
    );
  };

  const [columnDefs] = useState([
    {
      headerName: 'METAL',
      field: 'metal',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'PURITY',
      field: 'purity',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'RATE/g',
      field: 'rateByGram',
      width: 300,
      editable: false,
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
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

  const store = useStore();
  const classes = useStyles();

  const { handleRateModalOpen } = store.RateStore;

  useEffect(() => {
    async function fetchData() {
      getRatesData();
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (gridApi) {
      if (rowData) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  const getRatesData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.rates.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        setRowData(data.map((item) => item.toJSON()));
      }
    });
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
    <Page className={classes.root} title="Rates">
      <Container maxWidth={false} className={classes.sideList}>
        <Grid
          container
          direction="row"
          spacing={2}
          alignItems="center"
          className={classes.sectionHeader}
        >
          <Grid
            item
            xs={12}
            sm={7}
            style={{ marginLeft: '16px', marginTop: '10px' }}
          >
            <Typography variant="h4">Rates</Typography>
          </Grid>
          <Grid item xs={12} sm={4} style={{ textAlign: 'end' }}>
            <Button
              onClick={() => handleRateModalOpen()}
              style={{
                backgroundColor: 'rgb(0, 0, 255)',
                color: 'white',
                fontWeight: 'bold',
                width: '180px',
                marginLeft: '20px',
                marginTop: '20px'
              }}
            >
              ADD RATES
            </Button>
          </Grid>
        </Grid>
        <div className={classes.sideList}>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid item xs={12}>
              <Box mt={4}>
                <div
                  id="product-list-grid"
                  className="red-theme "
                  style={{ width: '100%', height: height - 170 + 'px' }}
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
                      rowData={rowData}
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
            <AddRate fullWidth maxWidth="sm" />{' '}
          </Grid>
        </div>
      </Container>
    </Page>
  );
};

export default InjectObserver(RateList);
