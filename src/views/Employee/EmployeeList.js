import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Box } from '@material-ui/core';
import { toJS } from 'mobx';
import { AgGridReact } from 'ag-grid-react';
import AddEmployee from './modal/AddEmployee';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import Moreoptions from '../../components/MoreOptionEmployeeList';
import EmployeeModal from './modal/AddEmployee';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './Employee.css';
import useWindowDimensions from 'src/components/windowDimension';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

const useStyles = makeStyles({
  root: {
    width: '100%',
    paddingTop: 30
  },
  list: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: '#cbe7f7',
      color: 'white'
    }
  },
  card: {
    display: 'block',
    transitionDuration: '0.3s',
    // height: '55vw',
    borderRadius: 12
  },

  listItemText: {
    fontSize: '0.5em'
  },
  search: {
    borderWidth: 1,
    borderColor: 'grey !important',
    borderRadius: '50%',
    padding: 6,
    borderStyle: 'solid'
  },
  excelIcon: {
    borderWidth: 1,
    borderColor: 'grey !important',
    borderRadius: '50%',
    padding: 6,
    borderStyle: 'solid',
    marginLeft: '10px'
  },
  categoryBtn: {
    background: '#ef5251',
    '&:hover': {
      backgroundColor: '#ef5251'
    },
    color: 'white',
    borderRadius: '20px',
    paddingLeft: '10px',
    paddingRight: '10px',
    textTransform: 'none',
    marginRight: 15
  },
  dFlex: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  categoryHeadLeft: {
    color: 'grey',
    display: 'flex'
  },
  categoryHeadLeftIcon: {
    marginLeft: '12'
  },
  categoryHeadRight: {
    color: 'grey',
    display: 'flex',
    justifyContent: 'flex-end'
  },
  categoryHeaderRight: {
    marginRight: 12
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
  },
  moreIcon: {
    marginBottom: '-5px'
  },
  itemTable: {
    width: '100%'
  }
});

function EmployeeList() {
  const store = useStore();
  const { height } = useWindowDimensions();

  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);

  const {
    handleEmployeeModalOpen,
    getEmployeeTransactionList,
    setSelectedEmployee
  } = store.EmployeeStore;
  const { employeeDialogOpen } = toJS(store.EmployeeStore);

  useEffect(() => {
    const loadPaginationData = async () => {
      await getEmployees();
    };

    loadPaginationData();
  }, []);

  useEffect(() => {
    const loadPaginationData = async () => {
      await getEmployees();
    };

    loadPaginationData();
  }, [employeeDialogOpen]);

  const getEmployees = async () => {
    const db = await Db.get();

    const businessData = await Bd.getBusinessData();

    let query = db.employees.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      let employeeList = data.map((item) => {
        let employee = {};
        employee.id = item.id;
        employee.name = item.name;
        employee.userName = item.userName;
        return employee;
      });

      setRowData(employeeList);
    });
  };

  useEffect(() => {
    // console.log('use effect:::', productData);
    if (gridApi) {
      if (rowData.length > 0) {
        gridApi.setRowData(rowData);
      }
    }
  }, [rowData]);

  const [columnDefs] = useState([
    {
      headerName: 'Name',
      field: 'name',
      suppressNavigable: true,
      cellClass: 'no-border',
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'User Name',
      field: 'userName',
      resizable: true,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellRendererFramework(params) {
        return (
          <div>
            <Grid container>
              <Grid item xs={9}>
                <p style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                  {params.data.userName}
                </p>
              </Grid>
              <Grid item xs={3}>
                <Moreoptions item={params['data']} />
              </Grid>
            </Grid>
          </div>
        );
      }
    }
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    setTimeout(() => {
      params.api.sizeColumnsToFit();
      window.addEventListener('resize', () => {
        params.api.sizeColumnsToFit();
      });
      params.api.addEventListener('cellFocused', ({ rowIndex }) => {
        params.api.getDisplayedRowAtIndex(rowIndex).setSelected(true);
      });
    }, 500);
  };

  function onFirstDataRendered(params) {
    setSelectedEmployee(rowData[0]);
    getEmployeeTransactionList(rowData[0].userName);

    if (gridApi && gridApi.getDisplayedRowAtIndex(0)) {
      gridApi.getDisplayedRowAtIndex(0).setSelected(true);
    }
  }

  async function onRowClicked(row) {
    setSelectedEmployee(row.data);

    await getEmployeeTransactionList(row.data.userName);
  }

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
    },
    flex: 1
  });

  return (
    <Grid container className={classes.root}>
      <Grid className={classes.dFlex} item xs={6} />
      <Grid className={classes.dFlex} item xs={6}>
        <Button
          size="medium"
          variant="contained"
          onClick={() => handleEmployeeModalOpen()}
          className={classes.categoryBtn}
        >
          Add Employee
        </Button>
        <AddEmployee fullWidth maxWidth="sm" />
      </Grid>

      <Grid container>
        <div className={classes.itemTable}>
          <Box mt={4}>
            <div
              id="grid-theme-wrapper"
              className="red-theme"
              style={{ width: '100%', height: height - 187 + 'px' }}
            >
              <div
                style={{ height: '100%', width: '100%' }}
                className="ag-theme-material"
              >
                <AgGridReact
                  onGridReady={onGridReady}
                  onFirstDataRendered={onFirstDataRendered}
                  enableRangeSelection
                  paginationPageSize={17}
                  suppressMenuHide
                  rowData={rowData}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  rowSelection="single"
                  pagination
                  headerHeight={40}
                  onRowClicked={(e) => onRowClicked(e)}
                  onSortChanged={(e) => console.log(e)}
                  className={classes.agGridclass}
                  style={{ width: '100%', height: '95%;' }}
                  overlayLoadingTemplate={
                    '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                  }
                  overlayNoRowsTemplate={
                    '<span className="ag-overlay-loading-center">No Rows to Show!</span>'
                  }
                />
                <div
                  style={{
                    display: 'flex',
                    float: 'right',
                    marginTop: '5px',
                    marginBottom: '5px'
                  }}
                ></div>
              </div>
            </div>
          </Box>
          <EmployeeModal open={employeeDialogOpen} />
        </div>
      </Grid>
    </Grid>
  );
}

export default InjectObserver(EmployeeList);
