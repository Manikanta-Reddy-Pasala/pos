import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  withStyles,
  IconButton,
  Typography,
  TextField,
  Grid
} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
//import MuiDialog from '@material-ui/core/Dialog';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import Loader from 'react-js-loader';
import { toJS } from 'mobx';

import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { AgGridReact } from 'ag-grid-react';
import { parse } from 'date-fns';

const useStyles = makeStyles((theme) => ({
  mfgDetailsButton: {
    borderRadius: '4px',
    color: '#FFFFFF',
    padding: '8px 20px 8px 20px',
    backgroundColor: '#4a83fb',
    '&:hover': {
      backgroundColor: '#4a83fb'
    }
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
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
  },
  outlinedInput: {
    width: '100%'
  },
  tableForm: {
    padding: '10px 6px'
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
  }
}));

const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '17px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const EditMfgModal = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;
  const store = useStore();
  const {
    editMfgOpenDialog,
    productDetail,
    singleBatchData,
    isComingFromManufacture,
    oldTxnData,
    openManufactureLoadingAlertMessage
  } = toJS(store.ProductStore);
  const {
    handleEditMfgModalClose,
    setBatchProperty,
    setProductFromManufacture,
    updateManufactureProductData,
    handleOpenManufactureLoadingMessage
  } = store.ProductStore;
  const [openCloseDialog, setopenCloseDialog] = React.useState(false);
  const [openNoDataAlert, setNoDataAlert] = React.useState(false);
  const [noDataString, setNoDataString] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);
  const [productName, setProductName] = React.useState('');
  const [totalQty, setTotalQty] = React.useState(0);

  const handleCloseDialogClose = () => {
    setopenCloseDialog(false);
  };

  const handleCloseDialogOpen = () => {
    setopenCloseDialog(true);
  };

  const handleNoDataAlertClose = () => {
    setNoDataAlert(false);
  };

  const handleMfgSaveClick = async () => {
    //code to save mfg batch details

    if (singleBatchData.batchNumber === '') {
      setNoDataString('Batch Number cannot be left blank.');
      setNoDataAlert(true);
    } else if (
      singleBatchData.manufacturingQty === 0 ||
      singleBatchData.manufacturingQty === ''
    ) {
      setNoDataString('Manufacturing Qty cannot be 0.');
      setNoDataAlert(true);
    } else {
      handleOpenManufactureLoadingMessage();

      if (singleBatchData.offerPrice === '') {
        setBatchProperty('offerPrice', 0);
      }

      if (singleBatchData.finalMRPPrice === '') {
        setBatchProperty('finalMRPPrice', 0);
      }

      await updateManufactureProductData(
        productDetail.rawMaterialData.total,
        oldTxnData
      );

      setProductName('');
      setTotalQty(0);
    }
  };

  useEffect(() => {
    if (editMfgOpenDialog === true) {
      let total =
        parseFloat(singleBatchData.manufacturingQty || 0) +
        parseFloat(singleBatchData.freeManufacturingQty || 0);
      setTotalQty(total);
    }
  }, [editMfgOpenDialog]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const [columnDefs] = useState([
    {
      headerName: 'Name',
      field: 'item_name',
      resizable: true,
      width: '250px',
      cellClass: 'no-border',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Qty',
      field: 'qty',
      resizable: true,
      width: '100px',
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Unit',
      field: 'qtyUnit',
      resizable: true,
      width: '100px',
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'Purchase Price',
      field: 'purchased_price',
      resizable: true,
      width: '100px',
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>Purchase</p>
            <p>Price</p>
          </div>
        );
      }
    },
    {
      headerName: 'Estimate',
      field: 'estimate',
      suppressNavigable: true,
      cellClass: 'no-border',
      resizable: true,
      width: '125px',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    width: '100%',
    height: 'auto',
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    suppressHorizontalScroll: false,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  return (
    <div>
      <Dialog
        open={editMfgOpenDialog}
        onClose={handleEditMfgModalClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            maxHeight: '75%',
            height: '75%',
            width: '50%'
          }
        }}
      >
        <DialogTitle id="product-modal-title">
          <div style={{ width: '100%', display: 'flex', flexDirection: 'row' }}>
            <div style={{ width: '70%', textAlign: 'left' }}></div>
            <div style={{ width: '30%', textAlign: 'left' }}>
              <IconButton
                aria-label="close"
                className="closeButton"
                onClick={handleCloseDialogOpen}
                style={{ textAlign: 'end' }}
              >
                <CancelRoundedIcon />
              </IconButton>
            </div>
          </div>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <div
                  style={{ width: '100%', textAlign: 'left', margin: '5px' }}
                >
                  {isComingFromManufacture ? (
                    <div>
                      <TextField
                        fullWidth
                        className={classes.input}
                        placeholder="Select Product"
                        value={
                          productName === ''
                            ? productNameWhileEditing
                            : productName
                        }
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: classes.bootstrapRoot,
                            input: classes.bootstrapInput
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: classes.bootstrapFormLabel
                        }}
                        onChange={(e) => {
                          if (e.target.value !== productNameWhileEditing) {
                            setProductName('');
                          }

                          setProductNameWhileEditing(e.target.value);
                          getProductList(e.target.value);
                        }}
                      />{' '}
                      {productlist.length > 0 ? (
                        <div>
                          <ul
                            className={classes.listbox}
                            style={{ width: '25%' }}
                          >
                            {productlist.map((option, index) => (
                              <li
                                style={{ padding: 10, cursor: 'pointer' }}
                                onClick={() => {
                                  setproductlist([]);
                                  setProductNameWhileEditing('');
                                  setProductName(option.name);
                                  setProductFromManufacture(option);
                                }}
                              >
                                <Grid
                                  container
                                  // justify="space-between"
                                  style={{ display: 'flex' }}
                                  className={classes.listitemGroup}
                                >
                                  <Grid item xs={12}>
                                    <p>{option.name}</p>
                                  </Grid>
                                </Grid>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <TextField
                      variant={'standard'}
                      fullWidth
                      value={'Product Name: ' + productDetail.name}
                      InputProps={{
                        disableUnderline: true
                      }}
                    />
                  )}
                </div>
              </div>
              <br />

              <div>
                <div>
                  <Typography
                    style={{
                      textAlign: 'left',
                      color: '#000000',
                      marginTop: '16px'
                    }}
                  >
                    Stock Details
                  </Typography>
                </div>
                <br />
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                >
                  <div style={{ margin: '5px' }}>
                    <TextField
                      disabled
                      variant={'outlined'}
                      label="Available Stock"
                      type="number"
                      value={productDetail.stockQty}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>
                  <div style={{ margin: '5px' }}>
                    <TextField
                      disabled={productDetail.name === '' ? true : false}
                      variant={'outlined'}
                      label="Manufacturing Qty"
                      value={singleBatchData.manufacturingQty}
                      type="number"
                      InputLabelProps={{
                        shrink: true
                      }}
                      onFocus={(e) =>
                        singleBatchData.manufacturingQty === 0
                          ? setBatchProperty('manufacturingQty', '')
                          : ''
                      }
                      onChange={(event) => {
                        setBatchProperty(
                          'manufacturingQty',
                          event.target.value
                        );
                        if (event.target.value !== '') {
                          let totalQty =
                            parseFloat(event.target.value) +
                            parseFloat(
                              singleBatchData.freeManufacturingQty || 0
                            );
                          setTotalQty(totalQty);
                        } else {
                          let totalQty = parseFloat(
                            singleBatchData.freeManufacturingQty || 0
                          );
                          setTotalQty(totalQty);
                        }
                      }}
                    />
                  </div>
                  <div style={{ margin: '5px' }}>
                    <TextField
                      disabled={productDetail.name === '' ? true : false}
                      variant={'outlined'}
                      label="Free Manufacturing Qty"
                      value={singleBatchData.freeManufacturingQty}
                      type="number"
                      InputLabelProps={{
                        shrink: true
                      }}
                      onFocus={(e) =>
                        singleBatchData.freeManufacturingQty === 0
                          ? setBatchProperty('freeManufacturingQty', '')
                          : ''
                      }
                      onChange={(event) => {
                        setBatchProperty(
                          'freeManufacturingQty',
                          event.target.value
                        );
                        if (event.target.value !== '') {
                          let totalQty =
                            parseFloat(event.target.value) +
                            parseFloat(singleBatchData.manufacturingQty || 0);
                          setTotalQty(totalQty);
                        } else {
                          let totalQty = parseFloat(
                            singleBatchData.manufacturingQty || 0
                          );
                          setTotalQty(totalQty);
                        }
                      }}
                    />
                  </div>
                </div>
                <div>
                  <Typography
                    style={{
                      textAlign: 'left',
                      color: '#000000',
                      marginTop: '16px'
                    }}
                  >
                    Batch Details
                  </Typography>
                </div>

                <>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <div style={{ margin: '5px' }}>
                      <TextField
                        disabled={true}
                        variant={'outlined'}
                        label="Batch Number"
                        value={singleBatchData.batchNumber}
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(event) =>
                          setBatchProperty('batchNumber', event.target.value)
                        }
                      />
                    </div>
                    {/* <div style={{ margin: '5px' }}>
                      <TextField
                        disabled={true}
                        variant={'outlined'}
                        label="MRP"
                        value={singleBatchData.finalMRPPrice}
                        type="number"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(event) =>
                          setBatchProperty('finalMRPPrice', event.target.value)
                        }
                      />
                    </div>
                    <div style={{ margin: '5px' }}>
                      <TextField
                        disabled={true}
                        variant={'outlined'}
                        label="Purchase Price"
                        value={singleBatchData.purchasedPrice}
                        type="number"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onFocus={(e) =>
                          singleBatchData.purchasedPrice === 0
                            ? setBatchProperty('purchasedPrice', '')
                            : ''
                        }
                        onChange={(event) =>
                          setBatchProperty('purchasedPrice', event.target.value)
                        }
                      />
                      </div> */}
                    <div style={{ margin: '5px' }}>
                      <TextField
                        disabled={true}
                        variant={'outlined'}
                        label="Sale Price"
                        value={singleBatchData.salePrice}
                        type="number"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onFocus={(e) =>
                          singleBatchData.salePrice === 0
                            ? setBatchProperty('salePrice', '')
                            : ''
                        }
                        onChange={(event) =>
                          setBatchProperty('salePrice', event.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row',
                      marginTop: '16px'
                    }}
                  >
                    <div style={{ margin: '5px' }}>
                      <TextField
                        disabled={true}
                        variant={'outlined'}
                        label="Manufacturing Date"
                        value={singleBatchData.mfDate}
                        type="date"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(event) =>
                          setBatchProperty('mfDate', event.target.value)
                        }
                      />
                    </div>
                    <div style={{ margin: '5px' }}>
                      <TextField
                        disabled={true}
                        variant={'outlined'}
                        label="Expiry Date"
                        value={singleBatchData.expiryDate}
                        type="date"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(event) =>
                          setBatchProperty('expiryDate', event.target.value)
                        }
                      />
                    </div>
                    <div style={{ margin: '5px' }}>
                      <TextField
                        disabled={true}
                        variant={'outlined'}
                        label="Warehouse Details"
                        value={singleBatchData.warehouseData}
                        type="text"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(event) =>
                          setBatchProperty('warehouseData', event.target.value)
                        }
                      />
                    </div>
                    <div style={{ margin: '5px' }}>
                      <TextField
                        disabled={true}
                        variant={'outlined'}
                        label="Rack Number"
                        value={singleBatchData.rack}
                        type="text"
                        InputLabelProps={{
                          shrink: true
                        }}
                        onChange={(event) =>
                          setBatchProperty('rack', event.target.value)
                        }
                      />
                    </div>
                  </div>
                </>

                <div>
                  <Typography
                    style={{
                      textAlign: 'left',
                      color: '#000000',
                      marginTop: '16px'
                    }}
                  >
                    Raw Material Details
                  </Typography>
                </div>
                <br />
                <div
                  style={{ height: '95%', width: '98%' }}
                  className="ag-theme-material"
                >
                  <AgGridReact
                    onGridReady={onGridReady}
                    domLayout="autoHeight"
                    enableRangeSelection
                    paginationPageSize={5}
                    suppressMenuHide
                    rowData={productDetail.rawMaterialData.rawMaterialList}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    pagination
                    rowSelection="single"
                    headerHeight={40}
                    /* className={classes.agGridclass} */
                    /*  style={{ height: 'auto' }} */
                  />
                </div>
                <div
                  style={{
                    marginTop: '20px',
                    width: '60%'
                  }}
                >
                  <div>
                    <Typography
                      className={classes.header}
                      variant="inherit"
                      style={{ marginBottom: '20px' }}
                    >
                      Add Direct Expenses
                    </Typography>
                  </div>
                  {productDetail.rawMaterialData.directExpenses &&
                    productDetail.rawMaterialData.directExpenses.length > 0 &&
                    productDetail.rawMaterialData.directExpenses.map(
                      (option, index) => (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginTop: '16px'
                          }}
                        >
                          <div style={{ width: '50%', paddingLeft: '5px' }}>
                            <b>{option.name}</b>
                          </div>
                          <div>
                            <TextField
                              disabled={true}
                              variant={'outlined'}
                              value={option.amount}
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </div>
                        </div>
                      )
                    )}
                </div>
                <div
                  style={{
                    width: '100%',
                    textAlign: 'right',
                    marginTop: '20px'
                  }}
                >
                  <b>TOTAL: {productDetail.rawMaterialData.total}</b>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <b style={{ marginRight: '20px' }}>
            TOTAL:{' '}
            {(productDetail.rawMaterialData.total || 0) * (totalQty || 0)}
          </b>
          <Button
            text="Update"
            size="small"
            variant="contained"
            color="secondary"
            className={classes.mfgDetailsButton}
            onClick={() => {
              handleMfgSaveClick();
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        open={openCloseDialog}
        onClose={handleCloseDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Manufacturing details will not be saved, Do you want to close?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseDialogClose();
              handleEditMfgModalClose();
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button onClick={handleCloseDialogClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
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
      <Dialog
        fullScreen={fullScreen}
        open={openManufactureLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while we manufacture!!!</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default injectWithObserver(EditMfgModal);