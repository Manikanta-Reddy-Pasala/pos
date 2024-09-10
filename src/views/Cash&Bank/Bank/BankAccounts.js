import React, { useState, useEffect } from 'react';
import { Box } from '@material-ui/core';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from '../../../components/Page';
import useWindowDimensions from '../../../components/windowDimension';
import { AgGridReact } from 'ag-grid-react';
import MoreoptionsBankAccounts from 'src/components/MoreoptionsBankAccounts';
import * as Db from '../../../RxDb/Database/Database';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import * as Bd from '../../../components/SelectedBusiness';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 2
  },
  Table: {
    paddingTop: 10
  },
  sideList: {
    padding: theme.spacing(1)
  },

  productHeader: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  gridControl: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  productCard: {
    height: '100%',
    backgroundColor: '#fff'
  },
  itemTable: {
    width: '100%'
  }
}));

const BankAccounts = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);

  const store = useStore();

  const { getBankAccountTransactions } = store.BankAccountsStore;

  const numberSort = (num1, num2) => {
    return num1 - num2;
  };

  async function onRowClicked(row) {
    await getBankAccountTransactions(row.data);
  }

  useEffect(() => {
    async function fetchData() {
      getBankAccounts();
    }

    fetchData();
  }, []);

  const getBankAccounts = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query = db.bankaccounts.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      let bankAccountDataList = data.map((item) => {
        let bankAccount = {};

        bankAccount.accountDisplayName = item.accountDisplayName;
        bankAccount.balance = item.balance;
        bankAccount.id = item.id;

        return bankAccount;
      });

      if (bankAccountDataList && bankAccountDataList.length > 0) {
        // getBankAccountTransactions(bankAccountDataList[0]);
        setRowData(bankAccountDataList);
      }
    });
  };

  const [columnDefs] = useState([
    {
      headerName: 'Account Name',
      field: 'accountDisplayName',
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
      headerName: 'Amount',
      field: 'balance',
      resizable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      comparator: numberSort,
      cellRendererFramework(params) {
        return (
          <div>
            <Grid container>
              <Grid item xs={9}>
                <p style={{ wordBreak: 'break-all', whiteSpace: 'normal' }}>
                  {params.data.balance || 0}
                </p>
              </Grid>
              <Grid item xs={3}>
                <MoreoptionsBankAccounts item={params['data']} />
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
    <Page className={classes.root} title="Customers">
      <Container maxWidth={false} className={classes.sideList}>
        <Grid container>
          <div className={classes.itemTable}>
            <Box mt={4}>
              <div
                id="grid-theme-wrapper"
                className="red-theme"
                style={{ width: '100%', height: height - 237 + 'px' }}
              >
                <div
                  style={{ height: '100%', width: '100%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    //onFirstDataRendered={onFirstDataRendered}
                    enableRangeSelection
                    paginationPageSize={17}
                    suppressMenuHide
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    onRowClicked={(e) => onRowClicked(e)}
                    rowSelection="single"
                    pagination
                    headerHeight={40}
                    className={classes.agGridclass}
                    style={{ width: '100%', height: '95%;' }}
                    suppressPaginationPanel={true}
                    suppressScrollOnNewData={true}
                    overlayLoadingTemplate={
                      '<span className="ag-overlay-loading-center">Loading! Please Wait...</span>'
                    }
                    overlayNoRowsTemplate={
                      '<span className="ag-overlay-loading-center">No Rows to Show</span>'
                    }
                  />
                </div>
              </div>
            </Box>
          </div>
        </Grid>
      </Container>
    </Page>
  );
};

export default BankAccounts;