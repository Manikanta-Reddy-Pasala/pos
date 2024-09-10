import React, { useState, useEffect } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from '../../../components/Page';
import { Box} from '@material-ui/core';
import useWindowDimensions from 'src/components/windowDimension';
import { AgGridReact } from 'ag-grid-react';
import MoreoptionsBankTransaction from 'src/components/MoreoptionsBankTransaction';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';

import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15
  },
  contentRight: {
    display: 'flex',
    justifyContent: 'space-between'
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
  searchField: {
    marginRight: 20
  },
  searchInputRoot: {
    borderRadius: 50
  },
  searchInputInput: {
    padding: '7px 12px 7px 0px'
  }
}));

const BankTransactions = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);

  const store = useStore();

  const { bankTransactionList, selectedBankAccountForFiltering } = toJS(store.BankAccountsStore);

  useEffect(() => {
    if (gridApi) {
      if (bankTransactionList) {
        gridApi.setRowData(bankTransactionList);
      }
    }
  }, [gridApi, bankTransactionList]);

  const TemplateMoreOptionRenderer = (props) => {
    return (
      <MoreoptionsBankTransaction
        index={props['data']['expenseId']}
        id={props['data']['expenseId']}
        item={props['data']}
        component="expensesList"
      />
    );
  };

  const numberSort = (num1, num2) => {
    return num1 - num2;
  };

  const [columnDefs] = useState([
    {
      headerName: 'Type',
      field: 'txnType',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Date',
      field: 'date',
      width: 300,
      editable: false,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      filter: 'agDateColumnFilter'
    },
    {
      headerName: 'Name',
      field: 'name',
      width: 300,
      editable: false,
      // filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        let name = '';

        if (data['customerName']) {
          name = data['customerName'];
        }

        if (data['vendorName']) {
          name = data['vendorName'];
        }
        return name;
      }
    },
    {
      headerName: 'Amount',
      field: 'amount',
      width: 300,
      editable: false,
      // filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      comparator: numberSort,
      valueFormatter: (params) => {
        let data = params['data'];

        let amount = 0;

        if (data.splitPaymentList && data.splitPaymentList.length > 0) {
          let splitAmount = 0;
          for (let payment of data.splitPaymentList) {
            if (selectedBankAccountForFiltering.id !== '' && payment.bankAccountId !== '' && payment.bankAccountId === selectedBankAccountForFiltering.id) {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        } else {
          amount = parseFloat(data.amount);
        }

        return amount;
      }
    },
   /* {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      width: 150,
      cellRenderer: 'templateMoreOptionRenderer'
    }*/
  ]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      setTimeout(() => {
        params.api.sizeColumnsToFit();
      });
    });
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

  const rowClassRules = {
    rowHighlight(params) {
      return params.node.rowIndex % 2 === 0;
    }
  };

  return (
    <Page className={classes.root} title="Customers">
      <Container maxWidth={false} className={classes.sideList}>
        <Grid
          container
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Grid item xs={12} sm={12}>
            <div className={classes.content}>
              <div className={classes.contentLeft}></div>
              <div className={classes.contentRight}>
                <div className={classes.searchField}>
                  <form
                    className={classes.inputField}
                    noValidate
                    autoComplete="off"
                  >
                    {/* <TextField
                      id="outlined-basic"
                      InputProps={{
                        classes: {
                          root: classes.searchInputRoot,
                          input: classes.searchInputInput
                        },
                        startAdornment: (
                          <InputAdornment position="start">
                            <IconButton>
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                      //   onChange={(event) =>

                      //   }
                      placeholder="Search"
                      variant="outlined"
                    /> */}
                  </form>
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <Box mt={4}>
              <div
                id="product-list-grid"
                className="red-theme "
                style={{ width: '100%', height: height - 135 + 'px' }}
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
                    rowData={bankTransactionList}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowSelection="single"
                    pagination
                    headerHeight={40}
                    rowClassRules={rowClassRules}
                    frameworkComponents={{
                      templateMoreOptionRenderer: TemplateMoreOptionRenderer
                    }}
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
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default InjectObserver(BankTransactions);