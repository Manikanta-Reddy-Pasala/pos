import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import 'react-table/react-table.css';
import '../../../Expenses/ExpenseTable.css';
import {
  Container,
  Box,
  makeStyles,
  Typography,
  Button
} from '@material-ui/core';
import Page from 'src/components/Page';
import { AgGridReact } from 'ag-grid-react';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';

import useWindowDimensions from 'src/components/windowDimension';
import MoreOptionsProductGroup from 'src/components/MoreOptionsProductGroup';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';
import { toJS } from 'mobx';
import AddProductGroup from '../AddProductGroup';

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

const ProductGroupListView = () => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const { height } = useWindowDimensions();
  const [rowData, setRowData] = useState([]);

  const TemplateMoreOptionRenderer = (props) => {
    return (
      <MoreOptionsProductGroup
        index={props['data']['groupId']}
        id={props['data']['groupId']}
        item={props['data']}
        component="groupList"
      />
    );
  };

  const [columnDefs] = useState([
    {
      headerName: 'GROUP NAME',
      field: 'groupName',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'TOTAL',
      field: 'total',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'NO OF ITEMS',
      width: 300,
      editable: false,
      filter: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let count = 0;

        if (data['itemList']) {
          count = data['itemList'].length;
        }

        return count;
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

  const { openProductGroupModal } = store.ProductGroupStore;

  useEffect(() => {
    async function fetchData() {
      getProductGroupData();
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

  const getProductGroupData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.productgroup.find({
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
    <Page className={classes.root} title="Product Groups">
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
            <Typography variant="h4">Product Groups</Typography>
          </Grid>
          <Grid item xs={12} sm={4} style={{ textAlign: 'end' }}>
            <Button
              onClick={() => openProductGroupModal()}
              style={{
                backgroundColor: 'rgb(0, 0, 255)',
                color: 'white',
                fontWeight: 'bold',
                width: '180px',
                marginLeft: '20px',
                marginTop: '20px'
              }}
            >
              ADD PRODUCT GROUP
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
            <AddProductGroup fullWidth maxWidth="sm" />{' '}
          </Grid>
        </div>
      </Container>
    </Page>
  );
};

export default InjectObserver(ProductGroupListView);