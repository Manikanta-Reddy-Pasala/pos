import React, { useState, useEffect } from 'react';
import { Paper, Grid, InputAdornment, Typography } from '@material-ui/core';
import { Add, Search } from '@material-ui/icons';
import * as Db from '../../../RxDb/Database/Database';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import Styles from './style';
import moreoption from '../../../components/Options';
import Moreoptions from '../../../components/MoreoptionSpecialDaysManagment';
import Controls from '../../../components/controls';
import { AgGridReact } from 'ag-grid-react';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import Page from '../../../components/Page';
import useWindowDimensions from 'src/components/windowDimension';
import AddSpecialDayModal from './modal/addSpecialDay';
import * as Bd from '../../../components/SelectedBusiness';

const SpecialDaysManagement = (props) => {
  const classes = Styles.useStyles();
  const store = useStore();
  const { height } = useWindowDimensions();

  const { handleAddSpecialDayDialog } = store.SpecialDayManagementStore;

  const [rowData, setRowData] = useState([]);

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const rowClassRules = {
    rowHighlight: function (params) {
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

  const [columnDefs] = useState([
    {
      headerName: 'Name',
      field: 'name',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'From Date',
      field: 'startDate',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'To Date',
      field: 'endDate',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: 'Time',
      field: 'timings',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: false
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      width: 100,
      cellRenderer: 'templateMoreOptionRenderer'
    }
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
    }, 100);

    window.addEventListener('resize', function () {
      setTimeout(function () {
        params.api.sizeColumnsToFit();
      });
    });
  };

  const TemplateMoreOptionRenderer = (props) => {
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        index={props['data']['id']}
        id={props['data']['id']}
        item={props['data']}
        component="salesReturn"
      />
    );
  };

  useEffect(() => {
    async function fetchData() {
      getSpecialDaysData();
    }

    fetchData();
  }, []);

  useEffect(() => {
    // console.log('use effect:::', productData);
    if (gridApi) {
      if (rowData.length > 0) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  const getSpecialDaysData = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query = db.specialdays.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        setRowData(data);
      }
    });
  };

  const handleSearch = async (value) => {
    if (value.length > 0) {
      setRowData([]);

      const db = await Db.get();

      var regexp = new RegExp('^.*' + value + '.*$', 'i');
      const businessData = await Bd.getBusinessData();

      await db.specialdays
        .find({
          selector: {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              {
                $or: [{ name: { $regex: regexp } }, { date: { $eq: value } }]
              }
            ]
          }
        })
        .exec()
        .then((data) => {
          if (!data) {
            // No customer is available
            return;
          }
          if (data && data.length > 0) {
            setRowData(data);
          }
        })
        .catch((err) => {
          setRowData([]);
        });
    } else {
      async function fetchData() {
        getSpecialDaysData();
      }

      fetchData();
    }
  };

  return (
    <Page className={classes.root} title="Special Days Managment">
      <Paper className={classes.pageContent}>
        <Typography variant="h4" style={{ margin: '15px' }}>
          Special Days Managment
        </Typography>
        <Grid
          container
          direction="row"
          spacing={2}
          alignItems="center"
          className={classes.sectionHeader}
        >
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" style={{ margin: '0 20px' }}>
              <Controls.Input
                placeholder="Search By Name"
                size="small"
                type="search"
                fullWidth
                onKeyUp={(event) => {
                  // innerHandleProductSearch(event.target.value)
                }}
                onChange={(event) =>
                  handleSearch(event.target.value.toString().toLowerCase())
                }
                InputProps={{
                  classes: {
                    root: classes.searchInputRoot,
                    input: classes.searchInputInput
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="disabled" />
                    </InputAdornment>
                  )
                }}
              />
            </Typography>
          </Grid>
          <Grid item xs={8} sm={6} align="right"></Grid>
          <Grid item xs={4} sm={2} align="right">
            <Controls.Button
              text="Special Day"
              size="medium"
              variant="contained"
              color="primary"
              startIcon={<Add />}
              className={classes.newButton}
              onClick={() => handleAddSpecialDayDialog(true)}
            />
            <AddSpecialDayModal fullWidth maxWidth="sm" />
          </Grid>
        </Grid>
        <div
          id="sales-return-grid"
          style={{ width: '100%', height: height - 208 + 'px' }}
          className=" blue-theme"
        >
          <div
            style={{ height: '95%', width: '100%' }}
            className="ag-theme-material"
          >
            <AgGridReact
              onGridReady={onGridReady}
              enableRangeSelection={true}
              paginationPageSize={10}
              suppressMenuHide={true}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              pagination={true}
              rowSelection="single"
              headerHeight={40}
              suppressPaginationPanel={true}
              suppressScrollOnNewData={true}
              rowClassRules={rowClassRules}
              overlayLoadingTemplate={
                '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
              }
              overlayNoRowsTemplate={
                '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
              }
              frameworkComponents={{
                templateMoreOptionRenderer: TemplateMoreOptionRenderer
              }}
            ></AgGridReact>
          </div>
        </div>
      </Paper>
    </Page>
  );
};
export default InjectObserver(SpecialDaysManagement);
