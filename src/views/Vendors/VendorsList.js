import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import {
  makeStyles,
  InputAdornment,
  Fab,
  Tooltip,
  Typography,
  Button
} from '@material-ui/core';
import { toJS } from 'mobx';
import AddVendor from './modal/AddVendor';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import Moreoptions from '../../components/MoreoptionsVendorList';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import './vendor.css';
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

function VendorList() {
  const store = useStore();
  const { height } = useWindowDimensions();
  const { vendorList, vendorDialogOpen } = toJS(store.VendorStore);
  const { handleVendorModalOpen, setSelectedVendor, setSelectedPartyId } =
    store.VendorStore;

  const { handleWhatsAppCustomMessageDialogOpen } = store.WhatsAppSettingsStore;

  const [index, setIndex] = React.useState(0);
  const [rowData, setRowData] = React.useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [onChange, setOnChange] = useState(true);
  const [limit] = useState(10);
  const [vendorData, setVendorData] = useState([]);

  const classes = useStyles();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [isOpenWhatsAppNotLinkedModal, setWhatsAppNotLinkedModal] =
    React.useState(false);

  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);
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

  const handleWhatsAppAlertClose = () => {
    setWhatsAppNotLinkedModal(false);
  };

  const numberSort = (num1, num2) => {
    return num1 - num2;
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
        buttons: ['clear', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'BALANCE',
      field: 'balance',
      resizable: true,
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      comparator: numberSort,
      cellStyle: (params) => {
        let data = params['data'];
        if (data.balanceType === 'Payable') {
          return { color: 'red' };
        } else if (data.balanceType === 'Receivable') {
          return { color: 'green' };
        } else {
          return { color: 'red' };
        }
      },
      filterParams: {
        buttons: ['clear', 'apply'],
        closeOnApply: true
      },
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

  async function onRowClicked(row) {
    setSelectedVendor(row.data);
    setIndex(row.rowIndex);
    await setSelectedPartyId(row.data.id);
  }

  async function onRowDataChanged(row) {
    if (
      gridApi &&
      gridApi.getDisplayedRowAtIndex(0) &&
      vendorList &&
      vendorList.length > 0
    ) {
      gridApi.getDisplayedRowAtIndex(0).setSelected(true);
    }
  }

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  function onFirstDataRendered(params) {
    if (gridApi && gridApi.getDisplayedRowAtIndex(0)) {
      gridApi.getDisplayedRowAtIndex(0).setSelected(true);
    }
    window.setTimeout(() => {
      // const colIds = params.columnApi.getAllColumns().map((c) => c.colId);
      // params.columnApi.autoSizeColumns(colIds);
      params.api.sizeColumnsToFit();
    }, 30);
  }

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

  useEffect(() => {
    if (vendorData) {
      setRowData(vendorData);
    }

    if (gridApi) {
      if (vendorData) {
        gridApi.setRowData(vendorData);
        if (gridApi.getDisplayedRowAtIndex(index)) {
          gridApi.getDisplayedRowAtIndex(index).setSelected(true);
        }
      }
    }
  }, [vendorData]);

  useEffect(() => {
    const loadPaginationData = async () => {
      if (onChange) {
        setSelectedVendor(null);
        setVendorData([]);
        setOnChange(false);
        if (searchText && searchText.length > 0) {
          getSearchVendorData(searchText);
        } else {
          await getVendorData();
        }
      }
    };

    loadPaginationData();
  }, [onChange]);

  const searchVendor = async (value) => {
    setCurrentPage(1);
    setTotalPages(1);
    if (value && value.length > 0) {
      getSearchVendorData(value);
    } else {
      await getVendorData();
    }
  };

  const getVendorData = async () => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setVendorData([]);
    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllVendorData();
    }
    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { isVendor: { $eq: true } },
          { name: { $exists: true } }
        ]
      },
      skip: skip,
      limit: limit,
      sort: [{ name: 'asc' }]
    });

    await Query.$.subscribe(async (data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item.toJSON());
      setVendorData(response);
      setSelectedVendor(response[0]);
      //await setSelectedPartyId(response[0].id);
    });
  };

  const getAllVendorData = async () => {
    const db = await Db.get();
    var Query;
    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $and: [
          { businessId: { $eq: businessData.businessId } },
          { isVendor: { $eq: true } }
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

  const getSearchVendorData = async (value) => {
    const db = await Db.get();
    var Query;

    let skip = 0;
    setVendorData([]);

    var regexp = new RegExp('^.*' + value + '.*$', 'i');
    var regexpMobile = new RegExp(value + '.*$', 'i');

    if (currentPage && currentPage > 1) {
      skip = (currentPage - 1) * limit;
    } else if (currentPage === 1) {
      getAllSearchVendorData(value);
    }
    const businessData = await Bd.getBusinessData();

    Query = db.parties.find({
      selector: {
        $or: [
          {
            $and: [
              { phoneNo: { $regex: regexpMobile } },
              { isVendor: true },
              { businessId: { $eq: businessData.businessId } }
            ]
          },
          {
            $and: [
              { name: { $regex: regexp } },
              { isVendor: true },
              { businessId: { $eq: businessData.businessId } }
            ]
          },
          {
            $and: [
              { businessId: { $eq: businessData.businessId } },
              { gstNumber: { $regex: regexp } },
              { isVendor: true }
            ]
          }
        ]
      },
      skip: skip,
      limit: limit,
      sort: [{ name: 'asc' }]
    });

    await Query.$.subscribe((data) => {
      if (!data) {
        return;
      }
      let response = data.map((item) => item.toJSON());
      setVendorData(response);
    });
  };

  const getAllSearchVendorData = async (value) => {
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
              { phoneNo: { $regex: regexpMobile } },
              { isVendor: true },
              { businessId: { $eq: businessData.businessId } }
            ]
          },
          {
            $and: [
              { name: { $regex: regexp } },
              { isVendor: true },
              { businessId: { $eq: businessData.businessId } }
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
    }
  });

  return (
    <Grid container className={classes.root}>
      <Grid className={classes.dFlex} item xs={6}></Grid>

      {transaction.enableVendor && (
        <Grid className={classes.dFlex} item xs={3}>
          <Tooltip title="Add Vendor" aria-label="Add Vendor">
            <Fab
              color="secondary"
              onClick={() => handleVendorModalOpen()}
              size="small"
              aria-label="Add Vendor"
              className={classes.fab}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
          <AddVendor fullWidth maxWidth="sm" />
        </Grid>
      )}
      {/* <Grid className={classes.dFlex} item xs={2}>
        <Tooltip title="Send Bulk Messages" aria-label="Send Bulk Messages">
          <Fab
            color="green"
            onClick={() => {
              if (isWhatsAppLinked) {
                handleWhatsAppCustomMessageDialogOpen(null, 'vendor');
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
        <Link to="/app/vendorExcelUpload">
          <Tooltip
            title="Import/Export Vendors"
            aria-label="Import/Export Vendors"
          >
            <Fab
              color="green"
              size="small"
              aria-label="Import/Export Vendors"
              className={classes.fab}
            >
              <Excel />
            </Fab>
          </Tooltip>
        </Link>
      </Grid>

      <Grid container style={{ margin: '10px' }}>
        <Controls.Input
          placeholder="Search Vendor"
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
            searchVendor(event.target.value.toString().toLowerCase());
          }}
        />
      </Grid>

      <Grid container>
        <div className={classes.itemTable}>
          <Box mt={4}>
            <div
              id="grid-theme-wrapper"
              className="red-theme"
              style={{ width: '100%', height: height - 235 + 'px' }}
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
                  pagination
                  rowSelection="single"
                  headerHeight={40}
                  frameworkComponents={{}}
                  onRowClicked={(e) => onRowClicked(e)}
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
          {vendorDialogOpen === true ? <AddVendor /> : null}
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

export default InjectObserver(VendorList);
