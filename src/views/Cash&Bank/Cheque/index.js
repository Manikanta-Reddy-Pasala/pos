import React, { useState, useEffect } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { Box, Paper } from '@material-ui/core';
import useWindowDimensions from 'src/components/windowDimension';
import { AgGridReact } from 'ag-grid-react';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import NoPermission from 'src/views/noPermission';
import * as Bd from 'src/components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';

import { toJS } from 'mobx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
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

const ChequeTransactions = () => {
  const classes = useStyles();
  const { height } = useWindowDimensions();
  const [gridApi, setGridApi] = useState(null);

  const store = useStore();

  const { chequeTransactionList } = toJS(store.BankAccountsStore);
  const { getChequeTransactions } = store.BankAccountsStore;

  const [isLoading, setLoadingShown] = React.useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    if (gridApi) {
      if (chequeTransactionList) {
        gridApi.setRowData(chequeTransactionList);
      }
    }
  }, [chequeTransactionList]);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getChequeTransactions();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Cash & Bank')) {
        setFeatureAvailable(false);
      }
    }
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
        let result = params['data'];
        let amount = 0;
        if (result.splitPaymentList && result.splitPaymentList.length > 0) {
          let splitAmount = 0;
          for (let payment of result.splitPaymentList) {
            if (payment.paymentMode === 'Cheque') {
              splitAmount += parseFloat(payment.amount);
            }
          }
          amount = parseFloat(splitAmount);
        } else {
          amount = parseFloat(result.amount);
        }

        return amount;
      }
    }
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
    <div className={classes.root}>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable ? (
            <Paper>
              <div className={classes.content}>
                <Grid container>
                  <Grid item xs={6}></Grid>
                </Grid>
              </div>

              <div></div>

              <Container maxWidth={false} className={classes.sideList}>
                <Grid
                  container
                  direction="row"
                  spacing={1}
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
                        style={{ width: '100%', height: height - 140 + 'px' }}
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
                            rowData={chequeTransactionList}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            rowSelection="single"
                            pagination
                            headerHeight={40}
                            rowClassRules={rowClassRules}
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
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};

export default InjectObserver(ChequeTransactions);