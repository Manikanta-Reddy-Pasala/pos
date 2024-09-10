import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import {
  makeStyles,
  Box,
  InputAdornment,
  Fab,
  Tooltip,
  Typography,
  Button
} from '@material-ui/core';
import { toJS } from 'mobx';
import { AgGridReact } from 'ag-grid-react';
import AddCustomer from './modal/AddCustomer';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import Moreoptions from '../../components/MoreoptionsCustomerList';
import CustomerModal from './modal/AddCustomer';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './customer.css';
import * as Db from '../../RxDb/Database/Database';
import useWindowDimensions from 'src/components/windowDimension';
import left_arrow from '../../icons/svg/left_arrow.svg';
import right_arrow from '../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../icons/svg/last_page_arrow.svg';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import WhatsAppCustomMessageModal from '../WhatsAppCustomMessages/WhatsAppCustomMessage';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import Excel from '../../icons/Excel';
import { Link } from 'react-router-dom';
import * as Bd from '../../components/SelectedBusiness';
import Controls from 'src/components/controls/index';
import axios from 'axios';
import { getCustomerName } from 'src/names/constants';

const API_SERVER = window.REACT_APP_API_SERVER;

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
  },
  searchInputRoot: {
    borderRadius: 50
  },
  searchInputInput: {
    padding: '7px 12px 7px 0px'
  },
  fab: {
    color: 'white',
    marginBottom: '10px',
    marginRight: '10px'
  },
  searchField: {
    marginLeft: 7,
    marginRight: '4px',
    marginTop: 7
  }
});

function CustomerList() {
  const store = useStore();
  const { height } = useWindowDimensions();
  const { customerList, customerDialogOpen } = toJS(store.CustomerStore);
  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);

  const { handleCustomerModalOpen, setSelectedCustomer, setSelectedPartyId } =
    store.CustomerStore;

  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowData, setRowData] = useState([]);
  const [index, setIndex] = React.useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(true);
  const [customerData, setCustomerData] = useState([]);
  const [limit] = useState(10);

  const { handleWhatsAppCustomMessageDialogOpen } = store.WhatsAppSettingsStore;

  const [isOpenWhatsAppNotLinkedModal, setWhatsAppNotLinkedModal] =
    React.useState(false);
  const [searchText, setSearchText] = useState('');

  const [isWhatsAppLinked, setWhatsAppLinked] = React.useState(false);

  useEffect(() => {
    async function fetchData() {
      await getBarcodeData();
    }

    fetchData();
  }, []);

  const getBarcodeData = async () => {
    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;

    await axios
      .get(API_SERVER + '/pos/v1/user/getBarCode', {
        params: {
          businessId: businessId,
          businessCity: businessCity
        }
      })
      .then(async (response) => {
        if (response) {
          if (response.data) {
            setWhatsAppLinked(response.data.whatsAppLinkedEnabled);
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    async function fetchData() {
      getTransactionData();
    }

    fetchData();
  }, []);

  const numberSort = (num1, num2) => {
    return num1 - num2;
  };

  const handleWhatsAppAlertClose = () => {
    setWhatsAppNotLinkedModal(false);
  };

  const onFirstPageClicked = () => {
    if (gridApi) {
      setCurrentPage(1);
      setOnChange(true);
    }
  };

  const onLastPageClicked = () => {
    if (gridApi) {
      setCurrentPage(totalPages);
      setOnChange(true);
    }
  };

  const onPreviousPageClicked = () => {
    if (gridApi) {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
        setOnChange(true);
      }
    }
  };

  const onNextPageClicked = () => {
    if (gridApi) {
      if (currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
        setOnChange(true);
      }
    }
  };

  const [columnDefs] = useState([
    {
      headerName: 'NAME',
      field: 'name',
      suppressNavigable: true,
      cellClass: 'no-border',
      resizable: true,
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellRendererFramework(params) {
        return (
          <div>
            <Grid container>
              <Grid item xs={12}>
                <p
                  style={{
                    wordBreak: 'break-all',
                    whiteSpace: 'normal',
                    display: 'inline-block'
                  }}
                >
                  {params.data.name || 0}
                </p>
                {params.data.vipCustomer && (
                  <>
                    <p style={{ display: 'inline-block' }}>
                      <span
                        style={{
                          background: '#B3B20F',
                          fontSize: '8px',
                          padding: '2px 6px 2px 6px',
                          color: 'white',
                          borderRadius: '5px',
                          marginLeft: '10px'
                        }}
                      >
                        VIP
                      </span>
                    </p>
                  </>
                )}
              </Grid>
            </Grid>
          </div>
        );
      }
    },
    {
      headerName: 'BALANCE',
      field: 'balance',
      resizable: true,
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      cellStyle: (params) => {
        let data = params['data'];
        if (data.balanceType === 'Payable' && data.balance !== 0) {
          return { color: 'red' };
        } else if (data.balanceType === 'Receivable' && data.balance !== 0) {
          return { color: 'green' };
        } else {
          return { color: 'black' };
        }
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

  async function onFirstDataRendered(params) {
    if (gridApi && gridApi.getDisplayedRowAtIndex(0)) {
      gridApi.getDisplayedRowAtIndex(0).setSelected(true);
    }
  }

  async function onRowClicked(row) {
    console.log('setSelectedCustomer', row.data);
    setSelectedCustomer(row.data);
    setIndex(row.rowIndex);
    await setSelectedPartyId(row.data.id);
  }

  async function onRowDataChanged(row) {
    if (gridApi && customerList && customerList.length > 0) {
      if (gridApi.getDisplayedRowAtIndex(index)) {
        gridApi.getDisplayedRowAtIndex(index).setSelected(true);
      }
    }
  }

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setSelectedCustomer(null);
        setCustomerData([]);
        setOnChange(false);
        //check whether search is clicked or not
        if (searchText && searchText.length > 0) {
          getSearchCustomerData(searchText);
        } else {
          getCustomerData();
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  useEffect(() => {
    if (customerData) {
      setRowData(customerData);
    }

    if (gridApi) {
      if (customerData) {
        gridApi.setRowData(customerData);
        if (gridApi.getDisplayedRowAtIndex(index)) {
          gridApi.getDisplayedRowAtIndex(index).setSelected(true);
        }
      }
    }
  }, [customerData]);

  const getCustomerData = async () => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setCustomerData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllCustomerData();
    }

    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { isCustomer: { $eq: true } },
          { name: { $exists: true } }
        ]
      },
      sort: [{ name: 'asc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item.toJSON());
      setCustomerData(response);
      setSelectedCustomer(response[0]);
    });
  };

  const searchCustomer = async (value) => {
    setCurrentPage(1);
    setTotalPages(1);
    if (value && value.length > 0) {
      setSearchText(value);
      await getSearchCustomerData(value);
    } else {
      await getCustomerData();
    }
  };

  const getAllCustomerData = async () => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { isCustomer: { $eq: true } }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
    });
  };

  const getSearchCustomerData = async (value) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setCustomerData([]);

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    var regexpMobile = new RegExp(value + '.*$', 'i');

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSearchCustomerData(value);
    }

    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { phoneNo: { $regex: regexpMobile } },
              { isCustomer: true }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { name: { $regex: regexp } },
              { isCustomer: true }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { gstNumber: { $regex: regexp } },
              { isCustomer: true }
            ]
          }
        ]
      },
      sort: [{ name: 'asc' }],
      skip: skip,
      limit: limit
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item.toJSON());
      setCustomerData(response);
    });
  };

  const getAllSearchCustomerData = async (value) => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    var regexpMobile = new RegExp(value + '.*$', 'i');

    Query = db.parties.find({
      selector: {
        $or: [
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { phoneNo: { $regex: regexpMobile } },
              { isCustomer: true }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { name: { $regex: regexp } },
              { isCustomer: true }
            ]
          }
        ]
      }
    });

    await Query.exec().then((data) => {
      if (!data) {
        return;
      }
      let count = 0;
      count = data.length;

      let numberOfPages = 1;

      if (count % limit === 0) {
        numberOfPages = parseInt(count / limit);
      } else {
        numberOfPages = parseInt(count / limit + 1);
      }
      setTotalPages(numberOfPages);
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

  return (
    <Grid container className={classes.root}>
      {/* <Grid item xs={6} className={classes.dFlex} /> */}

      <Grid className={classes.dFlex} item xs={6}></Grid>

      {transaction.enableCustomer && (
        <Grid className={classes.dFlex} item xs={3}>
          <Tooltip title={'Add ' + getCustomerName()} aria-label={'Add ' + getCustomerName()}>
            <Fab
              color="secondary"
              onClick={() => handleCustomerModalOpen()}
              size="small"
              aria-label=
              {'Add ' + getCustomerName()}
              className={classes.fab}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
          <AddCustomer fullWidth maxWidth="sm" />
        </Grid>
      )}

      {/* <Grid className={classes.dFlex} item xs={2}>
        <Tooltip title="Send Bulk Messages" aria-label="Send Bulk Messages">
          <Fab
            color="green"
            onClick={() => {
              if (isWhatsAppLinked) {
                handleWhatsAppCustomMessageDialogOpen(null, 'customer');
              } else {
                setWhatsAppNotLinkedModal(true);
              }
            }}
            size="small"
            aria-label="Send Bulk messages"
            className={classes.fab}
          >
            <WhatsAppIcon />
          </Fab>
        </Tooltip>
        <WhatsAppCustomMessageModal fullWidth maxWidth="sm" />
      </Grid> */}

      <Grid className={classes.dFlex} item xs={3}>
        <Link to="/app/customerExcelUpload">
          <Tooltip
            title="Import/Export Customers"
            aria-label="Import/Export Customers"
          >
            <Fab
              color="green"
              size="small"
              aria-label="Import/Export Customers"
              className={classes.fab}
            >
              <Excel />
            </Fab>
          </Tooltip>
        </Link>
      </Grid>

      <Grid container style={{ margin: '10px' }}>
        <Controls.Input
          placeholder={'Search ' + getCustomerName()}
          size="small"
          fullWidth
          InputProps={{
            classes: {
              root: classes.searchInputRoot,
              input: classes.searchInputInput
            },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
          onChange={(event) => {
            searchCustomer(event.target.value.toString().toLowerCase());
          }}
        />
      </Grid>

      <Grid container>
        <div className={classes.itemTable}>
          <Box mt={4}>
            <div
              id="grid-theme-wrapper"
              className="red-theme"
              style={{ width: '100%', height: height - 230 + 'px' }}
            >
              <div
                style={{ height: '97%', width: '100%' }}
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
                  onRowDataChanged={(e) => onRowDataChanged(e)}
                  className={classes.agGridclass}
                  style={{ width: '100%', height: '100%;' }}
                  suppressPaginationPanel={true}
                  suppressScrollOnNewData={true}
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
                >
                  <img
                    alt="Logo"
                    src={first_page_arrow}
                    width="20px"
                    height="20px"
                    style={{ marginRight: '10px' }}
                    onClick={() => onFirstPageClicked()}
                  />
                  <img
                    alt="Logo"
                    src={right_arrow}
                    width="20px"
                    height="20px"
                    onClick={() => onPreviousPageClicked()}
                  />
                  <p
                    style={{
                      marginLeft: '10px',
                      marginRight: '10px',
                      marginTop: '2px'
                    }}
                  >
                    Page {currentPage} of {totalPages}
                  </p>
                  <img
                    alt="Logo"
                    src={left_arrow}
                    width="20px"
                    height="20px"
                    style={{ marginRight: '10px' }}
                    onClick={() => onNextPageClicked()}
                  />
                  <img
                    alt="Logo"
                    src={last_page_arrow}
                    width="20px"
                    height="20px"
                    onClick={() => onLastPageClicked()}
                  />
                </div>
              </div>
            </div>
          </Box>
          <CustomerModal open={customerDialogOpen} />
          <WhatsAppCustomMessageModal />
        </div>
      </Grid>

      <Dialog
        open={isOpenWhatsAppNotLinkedModal}
        onClose={handleWhatsAppAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <Typography gutterBottom style={{ marginLeft: '10px' }}>
              Please scan QR code from WhatsApp Settings to send custom WhatsApp
              message to your customers.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleWhatsAppAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default InjectObserver(CustomerList);
