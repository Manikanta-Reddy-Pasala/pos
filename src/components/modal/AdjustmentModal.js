import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  FormControlLabel,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  Typography,
  Box,
  Button,
  RadioGroup,
  Radio
} from '@material-ui/core';
import Controls from '../../components/controls/index';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import { AgGridReact } from 'ag-grid-react';
import Arrowtopright from '../../icons/Arrowtopright';
import Arrowbottomleft from '../../icons/Arrowbottomleft';
import VendorModal from 'src/views/Vendors/modal/AddVendor';
import * as Db from '../../RxDb/Database/Database';
import Moreoptions from '../../components/MoreOptionsAdjustment';
import moreoption from '../../components/Options';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    padding: 'inherit',
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '& .secondary-images': {
        '& button': {
          marginRight: theme.spacing(2)
        }
      }
    }
  },
  '& .grid-select': {
    selectedOption: {
      color: 'red'
    },
    marginLeft: '15px',
    '& .MuiFormControl-root': {
      width: '100%'
    },
    fullWidth: {
      width: '100%'
    }
  },
  checkboxMarginTop: {
    marginTop: '0.75rem'
  },
  checkboxMarginTopTax: {
    marginTop: '2rem'
  },
  marginTopFormGroup: {
    marginTop: '1.25rem'
  },
  marginBtmSet: {
    marginBottom: '15px'
  },
  primaryImageWrapper: {
    padding: theme.spacing(1),
    display: 'inline-block',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
    marginRight: theme.spacing(2)
  },
  primaryImageButtonWrapper: {
    '& #product-primary-upload': {
      display: 'none'
    },
    '& #product-secondary-upload': {
      display: 'none'
    },
    '& .uploadImageButton': {
      color: '#fff',
      bottom: '10px',
      backgroundColor: '#4a83fb',
      padding: '7px',
      fontSize: '14px',
      fontFamily: 'Roboto',
      fontWeight: 500,
      lineHeight: 1.75,
      borderRadius: '4px',
      marginRight: theme.spacing(2),
      '&.primaryImage': {
        margin: '5px',
        position: 'relative',
        top: '-20px'
      },
      '& i': {
        marginRight: '8px'
      }
    }
  },
  imageMargin: {
    marginLeft: theme.spacing(2)
  },
  primaryButton: {
    backgroundColor: '#4a83fb',
    bottom: '10px',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#4a83fb'
    }
  },
  errorMsg: {
    fontSize: '14px',
    color: '#EF5350'
  },
  addAdjustmentButton: {
    background: '#FFAF01',
    width: '86%',
    color: 'white',
    border: '#9DCB6A',
    padding: '5.5px',
    textTransform: 'capitalize',
    '&:hover': {
      background: '#FFAF01',
      color: 'white'
    }
  },
  selectOtion: {
    marginTop: 8,
    marginBottom: 4
  },
  createNewBtn: {
    background: '#EF5350',
    color: 'white',
    border: '#EF5350',
    textTransform: 'capitalize',
    marginTop: '10px',
    marginBottom: '10pX',
    '&:hover': {
      background: '#EF5350',
      color: 'white'
    }
  },
  itemTable: {
    width: '100%'
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  input: {
    width: '30%'
  },
  listbox: {
    margin: 5,
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  }
}));

const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '22px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const DialogActions = withStyles((theme) => ({
  root: {
    marginTop: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const AdjustmentModal = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const [batchesList, setBatchesList] = useState(null);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [vendorList, setVendorList] = React.useState();
  const [openNoDataAlert, setNoDataAlert] = React.useState(false);
  const [noDataString, setNoDataString] = React.useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    productAdjustmentDialogOpen,
    singleAdjustedData,
    adjustedStockValue,
    productDetail,
    isAdjustmentUpdate
  } = toJS(stores.ProductStore);

  const {
    setInitialAdjustedProperty,
    addAdjustedData,
    updateAdjustedData,
    setAdjustmentVendor,
    setAdjustmentVendorName
  } = stores.ProductStore;

  const { handleAddAdjustmentModalOpen, handleAdjustmentModalClose } =
    stores.ProductStore;

  const [vendorNameWhileEditing, setVendorNameWhileEditing] = useState('');
  const { handleVendorModalOpen } = stores.VendorStore;
  const { vendorDialogOpen } = toJS(stores.VendorStore);

  const handleNoDataAlertClose = () => {
    setNoDataAlert(false);
  };

  const handleAddVendor = () => {
    handleVendorModalOpen();
  };

  const createNewDataClick = () => {
    if (productDetail.batchData.length > 0) {
      if (
        singleAdjustedData.vendor === '' ||
        singleAdjustedData.batchNumber === '' ||
        singleAdjustedData.adjustedDate === '' ||
        singleAdjustedData.qty === '' ||
        singleAdjustedData.qty === 0
      ) {
        if (singleAdjustedData.vendor === '') {
          setNoDataString('Vendor cannot be left blank.');
        } else if (singleAdjustedData.batchNumber === '') {
          setNoDataString('Batch Number cannot be left blank.');
        } else if (singleAdjustedData.adjustedDate === '') {
          setNoDataString('Adjustment Date cannot be left blank.');
        } else if (
          singleAdjustedData.qty === 0 ||
          singleAdjustedData.qty === ''
        ) {
          setNoDataString('Quantity cannot be 0.');
        }
        setNoDataAlert(true);
      } else {
        setVendorNameWhileEditing('');
        if (singleAdjustedData.purchasedPrice === '') {
          setInitialAdjustedProperty('purchasedPrice', 0);
        }
        if (isAdjustmentUpdate) {
          updateAdjustedData();
        } else {
          addAdjustedData();
        }
      }
    } else if (
      singleAdjustedData.adjustedDate === '' ||
      singleAdjustedData.qty === 0 ||
      singleAdjustedData.qty === ''
    ) {
      if (singleAdjustedData.adjustedDate === '') {
        setNoDataString('Adjustment Date cannot be left blank.');
      } else if (
        singleAdjustedData.qty === 0 ||
        singleAdjustedData.qty === ''
      ) {
        setNoDataString('Quantity cannot be 0.');
      }
      setNoDataAlert(true);
    } else {
      setVendorNameWhileEditing('');
      if (singleAdjustedData.purchasedPrice === '') {
        setInitialAdjustedProperty('purchasedPrice', 0);
      }
      if (isAdjustmentUpdate) {
        updateAdjustedData();
      } else {
        addAdjustedData();
      }
    }
  };

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorClick = (vendor) => {
    setAdjustmentVendor(vendor);
    setVendorNameWhileEditing('');
    setVendorList([]);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  useEffect(() => {
    setBatchesList([]);
  }, []);

  const [columnDefs] = useState([
    {
      headerName: 'Date',
      field: 'adjustedDate',
      suppressNavigable: true,
      cellClass: 'no-border',
      resizable: true,
      width: '110px',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Type',
      field: 'adjustedType',
      resizable: true,
      width: '110px',
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'At Price',
      field: 'purchasedPrice',
      suppressNavigable: true,
      cellClass: 'no-border',
      resizable: true,
      width: '110px',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Old Qty',
      field: 'oldQty',
      resizable: true,
      width: '110px',
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'New Qty',
      field: 'qty',
      suppressNavigable: true,
      cellClass: 'no-border',
      resizable: true,
      width: '110px',
      filter: 'agTextColumnFilter',
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
      cellRenderer: 'templateActionRenderer'
    }
  ]);

  const TemplateActionRenderer = (props) => {
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        item={props['data']}
        id={props['data']['id']}
        component="adjustmentList"
      />
    );
  };

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    width: '110px',
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
    <div>
      <Controls.Button
        text="Add Adjustment"
        size="small"
        variant="contained"
        color="secondary"
        className={classes.addAdjustmentButton}
        onClick={() => handleAddAdjustmentModalOpen()}
      />
      <Dialog
        open={productAdjustmentDialogOpen}
        fullWidth={true}
        maxWidth={'md'}
        onClose={handleAdjustmentModalClose}
      >
        <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
          Add Adjustment
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleAdjustmentModalClose}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="stretch"
            className={classes.marginTopFormGroup}
          >
            <Grid
              item
              md={5}
              sm={12}
              className="grid-padding"
              style={{ borderRight: '1px solid #d4d4d4', marginBottom: 10 }}
            >
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid item xs={12} className="grid-padding">
                  <Typography variant="h4" style={{ marginBottom: 30 }}>
                    Create Adjustment
                  </Typography>
                </Grid>

                <Grid item md={12} sm={12} className="grid-padding">
                  <FormControl
                    component="fieldset"
                    className={classes.marginBtmSet}
                  >
                    <RadioGroup
                      row
                      aria-label="quiz"
                      name="quiz"
                      value={singleAdjustedData.adjustedType}
                      onChange={(event) => {
                        setInitialAdjustedProperty(
                          'adjustedType',
                          event.target.value
                        );
                      }}
                    >
                      <FormControlLabel
                        value="Add Stock"
                        label="Add Stock"
                        labelPlacement="end"
                        control={<Radio />}
                      />
                      <FormControlLabel
                        value="Reduce Stock"
                        label="Reduce Stock"
                        labelPlacement="end"
                        control={<Radio />}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl fullWidth className={classes.marginBtmSet}>
                    <Typography variant="h6">Adjustment Date</Typography>
                    <TextField
                      type="date"
                      margin="dense"
                      value={singleAdjustedData.adjustedDate}
                      onChange={(event) =>
                        setInitialAdjustedProperty(
                          'adjustedDate',
                          event.target.value
                        )
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} className="grid-padding"></Grid>
                <Grid item md={6} sm={12} className="grid-padding">
                  {productDetail.batchData.length > 0 && (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      className={classes.marginBtmSet}
                      style={{ marginTop: 0 }}
                      margin="dense"
                    >
                      <Typography variant="h6">Vendor</Typography>
                      <div>
                        <TextField
                          id="vendor"
                          type="text"
                          variant="outlined"
                          margin="dense"
                          value={
                            singleAdjustedData.vendor === ''
                              ? vendorNameWhileEditing
                              : singleAdjustedData.vendor
                          }
                          onChange={(e) => {
                            if (e.target.value !== vendorNameWhileEditing) {
                              setAdjustmentVendorName('');
                            }
                            getVendorList(e.target.value);
                            setVendorNameWhileEditing(e.target.value);
                          }}
                        />

                        {vendorList && vendorList.length > 0 ? (
                          <>
                            <ul
                              className={classes.listbox}
                              style={{ width: '100%' }}
                            >
                              <li>
                                <Grid container justify="space-between">
                                  <Grid item>
                                    <Button
                                      size="small"
                                      style={{
                                        position: 'relative',
                                        fontSize: 12
                                      }}
                                      color="secondary"
                                      onClick={handleAddVendor}
                                    >
                                      + Add Vendor
                                    </Button>
                                  </Grid>
                                  {vendorList.length == 1 &&
                                  vendorList[0].name == '' ? (
                                    <Grid item></Grid>
                                  ) : (
                                    <Grid item>
                                      <Button
                                        size="small"
                                        style={{
                                          position: 'relative',
                                          fontSize: 12
                                        }}
                                      >
                                        Balance
                                      </Button>
                                    </Grid>
                                  )}
                                </Grid>
                              </li>
                              {vendorList.length == 1 &&
                              vendorList[0].name == '' ? (
                                <li></li>
                              ) : (
                                <div>
                                  {vendorList.map((option, index) => (
                                    <li
                                      key={`${index}vendor`}
                                      style={{ padding: 10, cursor: 'pointer' }}
                                      onClick={() => {
                                        handleVendorClick(option);
                                      }}
                                    >
                                      <Grid container justify="space-between">
                                        <Grid item>{option.name}</Grid>
                                        <Grid item>
                                          {' '}
                                          <span>
                                            {parseFloat(option.balance).toFixed(
                                              2
                                            )}
                                          </span>
                                          {option.balance > 0 ? (
                                            option.balanceType === 'Payable' ? (
                                              <Arrowtopright fontSize="inherit" />
                                            ) : (
                                              <Arrowbottomleft fontSize="inherit" />
                                            )
                                          ) : (
                                            ''
                                          )}
                                        </Grid>
                                      </Grid>
                                    </li>
                                  ))}
                                </div>
                              )}
                            </ul>
                          </>
                        ) : null}
                        <VendorModal open={vendorDialogOpen} />
                      </div>
                    </FormControl>
                  )}
                </Grid>

                <Grid item md={6} sm={12} className="grid-padding">
                  {productDetail.batchData.length > 0 && (
                    <FormControl
                      fullWidth
                      variant="outlined"
                      className={classes.marginBtmSet}
                      style={{ marginTop: 0 }}
                      margin="dense"
                    >
                      <Typography variant="h6">Batch Number</Typography>

                      <TextField
                        id="batchNumber"
                        type="text"
                        variant="outlined"
                        margin="dense"
                        value={singleAdjustedData.batchNumber}
                        onChange={(event) =>
                          setInitialAdjustedProperty(
                            'batchNumber',
                            event.target.value
                          )
                        }
                      />
                    </FormControl>
                  )}
                </Grid>
                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl fullWidth className={classes.marginBtmSet}>
                    <Typography variant="h6">Quantity</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="text"
                      value={singleAdjustedData.qty}
                      onChange={(event) =>
                        setInitialAdjustedProperty('qty', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl fullWidth className={classes.marginBtmSet}>
                    <Typography variant="h6">At Price</Typography>
                    <TextField
                      type="number"
                      variant="outlined"
                      margin="dense"
                      value={singleAdjustedData.purchasedPrice}
                      onChange={(event) =>
                        setInitialAdjustedProperty(
                          'purchasedPrice',
                          event.target.value
                        )
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={12} sm={12} className="grid-padding">
                  <FormControl fullWidth className={classes.marginBtmSet}>
                    <Typography variant="h6">Reason</Typography>
                    <TextField
                      variant="outlined"
                      margin="dense"
                      type="text"
                      value={singleAdjustedData.reason}
                      onChange={(event) =>
                        setInitialAdjustedProperty('reason', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} className="grid-padding">
                  {!isAdjustmentUpdate ? (
                    <Button
                      variant="outlined"
                      className={classes.createNewBtn}
                      onClick={() => {
                        createNewDataClick();
                      }}
                    >
                      Create New
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      className={classes.createNewBtn}
                      onClick={() => {
                        createNewDataClick();
                      }}
                    >
                      Update
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid item md={7} sm={12} className="grid-padding">
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                {productDetail.adjustedData.length > 0 && (
                  <Grid item xs={12} className="grid-padding">
                    <Typography
                      variant="h4"
                      style={{ marginBottom: 30, color: '#b1afaf' }}
                    >
                      Stock Value: {adjustedStockValue}
                    </Typography>
                  </Grid>
                )}

                <Grid item xs={12} className="grid-padding">
                  <div className={classes.itemTable}>
                    <Box mt={4}>
                      <div
                        id="grid-theme-wrapper"
                        className="red-theme"
                        style={{ width: '100%', height: '80vh' }}
                      >
                        <div
                          style={{ height: '78vh', width: '100%' }}
                          className="ag-theme-material"
                        >
                          <AgGridReact
                            onGridReady={onGridReady}
                            enableRangeSelection
                            paginationPageSize={17}
                            suppressMenuHide
                            rowData={productDetail.adjustedData}
                            columnDefs={columnDefs}
                            defaultColDef={defaultColDef}
                            pagination
                            rowSelection="single"
                            headerHeight={40}
                            frameworkComponents={{
                              templateActionRenderer: TemplateActionRenderer
                            }}
                            className={classes.agGridclass}
                            style={{ width: '100%', height: '100%;' }}
                          />
                        </div>
                      </div>
                    </Box>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openNoDataAlert}
        onClose={handleNoDataAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{noDataString}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoDataAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default injectWithObserver(AdjustmentModal);
