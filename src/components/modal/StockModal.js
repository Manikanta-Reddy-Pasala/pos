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
  Radio,
  FormControlLabel,
  Grid,
  Select,
  OutlinedInput,
  MenuItem,
  FormControl
} from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';
import Loader from 'react-js-loader';
import { toJS } from 'mobx';

import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

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
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
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

const StockModal = (props) => {
  const classes = useStyles();
  const store = useStore();
  const {
    alterStockOpenDialog,
    productDetail,
    singleBatchData,
    openAlterStockLoadingAlertMessage
  } = toJS(store.ProductStore);
  const {
    handleAlterStockModalClose,
    setBatchProperty,
    viewOrEditBatchItem,
    resetSingleBatchData,
    setProductFromAlterStock,
    addStockAlteredProductData,
    handleOpenAlterStockLoadingMessage
  } = store.ProductStore;
  const [openCloseDialog, setopenCloseDialog] = React.useState(false);
  const [openNoDataAlert, setNoDataAlert] = React.useState(false);
  const [noDataString, setNoDataString] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedBatch, setSelectedBatch] = React.useState();

  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [productlist, setproductlist] = useState([]);
  const [productName, setProductName] = React.useState('');
  const [stockQty, setStockQty] = React.useState(0);
  const [freeStockQty, setFreeStockQty] = React.useState(0);
  const [totalQty, setTotalQty] = React.useState(0);
  const [totalTax, setTotalTax] = React.useState(0);

  const [warehouseList, setWarehouseList] = React.useState([]);
  const { getWarehouse } = store.WarehouseStore;

  useEffect(() => {
    async function fetchData() {
      setWarehouseList(await getWarehouse());
    }

    fetchData();
  }, []);

  const handleCloseDialogClose = () => {
    setopenCloseDialog(false);
  };

  const handleCloseDialogOpen = () => {
    setSelectedBatch();
    setStockQty(0);
    setFreeStockQty(0);
    resetSingleBatchData();
    setopenCloseDialog(true);
  };

  const handleNoDataAlertClose = () => {
    setNoDataAlert(false);
  };

  useEffect(() => {
    if (alterStockOpenDialog === true) {
      setSelectedBatch();
      setStockQty(0);
      setFreeStockQty(0);
      setProductName('');
      setTotalQty(0);
      setTotalTax(0);
    }
  }, [alterStockOpenDialog]);

  const handleStockSaveClick = async () => {
    //code to save mfg batch details

    if (stockQty === 0 || stockQty === '') {
      setNoDataString('Stock Qty cannot be 0.');
      setNoDataAlert(true);
    } else {
      handleOpenAlterStockLoadingMessage();

      if (singleBatchData.offerPrice === '') {
        setBatchProperty('offerPrice', 0);
      }

      if (singleBatchData.finalMRPPrice === '') {
        setBatchProperty('finalMRPPrice', 0);
      }

      // Calculate By Purchase Price
      let totalCost = getActualPurchasePrice(
        productDetail.purchasedPrice,
        productDetail.purchaseCgst,
        productDetail.purchaseSgst,
        productDetail.purchaseIgst,
        productDetail.purchaseTaxIncluded,
        productDetail.purchaseDiscountAmount
      );

      addStockAlteredProductData(
        totalCost,
        totalTax,
        props.operationType,
        stockQty,
        freeStockQty
      );

      setSelectedBatch();
      setStockQty(0);
      setFreeStockQty(0);
      setProductName('');
      setTotalQty(0);
      setTotalTax(0);
    }
  };

  const getActualPurchasePrice = (
    purchasePrice,
    cgst,
    sgst,
    igst,
    taxIncluded,
    purchaseDiscountAmount
  ) => {
    let tax = (parseFloat(cgst) || 0) + (parseFloat(sgst) || 0);

    let itemPrice = purchasePrice;

    let totalGST = 0;
    let mrp_before_tax = 0;

    if (taxIncluded) {
      totalGST = itemPrice - itemPrice * (100 / (100 + tax));
    }

    mrp_before_tax = parseFloat(
      itemPrice - parseFloat(totalGST)
    );
    let itemPriceAfterDiscount = mrp_before_tax - purchaseDiscountAmount;
    let cgst_amount = 0;
    let sgst_amount = 0;

    if (!taxIncluded) {
      const totalGST = (itemPriceAfterDiscount * tax) / 100;
      cgst_amount = totalGST / 2;
      sgst_amount = totalGST / 2;
    } else {
      let totalGST = 0;

      if (purchaseDiscountAmount > 0) {
        totalGST = itemPriceAfterDiscount * (tax / 100);
        cgst_amount = totalGST / 2;
        sgst_amount = totalGST / 2;
      }
    }

    setTotalTax(parseFloat(cgst_amount + sgst_amount));

    const finalOfferAmount = parseFloat(
      mrp_before_tax -
        purchaseDiscountAmount +
        cgst_amount +
        sgst_amount
    );

    return finalOfferAmount * stockQty;
  };

  const handleBatchClick = async (batch) => {
    viewOrEditBatchItem(batch);
  };

  const getProductList = async (value) => {
    setproductlist(await getProductAutoCompleteList(value));
  };

  return (
    <div>
      <Dialog
        open={alterStockOpenDialog}
        onClose={handleAlterStockModalClose}
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
            <div style={{ width: '70%', textAlign: 'left' }}>
              {/* <span style={{textAlign:'left'}}>Manufacture</span> */}
            </div>
            <div style={{ width: '30%', textAlign: 'left' }}>
              {/* <Controls.Button
                text="Manufacture"
                size="small"
                variant="contained"
                color="secondary"
                className={classes.mfgDetailsButton}
                onClick={() => { }}
              /> */}
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
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    marginTop: '16px',
                    marginLeft: '5px',
                    marginRight: '5px'
                  }}
                >
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
                      <>
                        <ul
                          className={classes.listbox}
                          style={{ width: '80%', zIndex: '5' }}
                        >
                          {productlist.map((option, index) => (
                            <li
                              style={{ padding: 10, cursor: 'pointer' }}
                              onClick={() => {
                                setproductlist([]);
                                setProductNameWhileEditing('');
                                setProductName(option.name);
                                setProductFromAlterStock(option);
                              }}
                            >
                              <Grid
                                container
                                // justify="space-between"
                                style={{ display: 'flex' }}
                              >
                                <Grid item xs={12}>
                                  <p>{option.name}</p>
                                </Grid>
                              </Grid>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                  </div>
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
                      value={parseFloat(productDetail.stockQty) + parseFloat(productDetail.freeQty)}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  </div>
                  <div style={{ margin: '5px' }}>
                    <TextField
                      disabled={productDetail.name === '' ? true : false}
                      variant={'outlined'}
                      label="Stock Qty"
                      value={stockQty}
                      type="number"
                      InputLabelProps={{
                        shrink: true
                      }}
                      onFocus={(e) => (stockQty === 0 ? setStockQty('') : '')}
                      onChange={(event) => {
                        setStockQty(event.target.value);
                        if (event.target.value !== '') {
                          let totalQty =
                            parseFloat(event.target.value) +
                            parseFloat(freeStockQty);
                          setTotalQty(totalQty);
                        }
                      }}
                    />
                  </div>
                  <div style={{ margin: '5px' }}>
                    <TextField
                      disabled={productDetail.name === '' ? true : false}
                      variant={'outlined'}
                      label="Free Stock Qty"
                      value={freeStockQty}
                      type="number"
                      InputLabelProps={{
                        shrink: true
                      }}
                      onFocus={(e) =>
                        freeStockQty === 0 ? setFreeStockQty('') : ''
                      }
                      onChange={(event) => {
                        setFreeStockQty(event.target.value);
                        if (event.target.value !== '') {
                          let totalQty =
                            parseFloat(event.target.value) +
                            parseFloat(stockQty);
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
                <br />

                {productDetail.batchData &&
                productDetail.batchData.length > 0 ? (
                  <>
                    <Grid item xs={4}>
                      <Grid
                        style={{ display: 'flex', marginBottom: '16px' }}
                        item
                        xs={11}
                      >
                        <Select
                          displayEmpty
                          value={
                            selectedBatch && selectedBatch.batchNumber
                              ? selectedBatch.batchNumber
                              : ''
                          }
                          input={
                            <OutlinedInput
                              style={{
                                width: '100%',
                                marginLeft: '-3px'
                              }}
                            />
                          }
                          inputProps={{ 'aria-label': 'Without label' }}
                        >
                          <MenuItem disabled value="">
                            Select Batch
                          </MenuItem>
                          {productDetail.batchData &&
                            productDetail.batchData.length > 0 &&
                            productDetail.batchData.map((c) => (
                              <MenuItem
                                key={c.batchNumber}
                                value={c.batchNumber}
                                name={c.batchNumber}
                                style={{ color: 'black' }}
                                onClick={() => {
                                  setSelectedBatch(c);
                                  handleBatchClick(c);
                                }}
                              >
                                {c.batchNumber}
                              </MenuItem>
                            ))}
                        </Select>
                        <Button
                          className={classes.resetbtn}
                          size="small"
                          onClick={() => {
                            setSelectedBatch();
                            resetSingleBatchData();
                          }}
                          color="secondary"
                        >
                          RESET
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                ) : (
                  <Typography
                    style={{
                      textAlign: 'left',
                      color: '#000000'
                    }}
                  >
                    No Batches found
                  </Typography>
                )}
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              className={classes.mfgDetailsButton}
              onClick={() => {
                handleStockSaveClick();
              }}
            >
              {props.operationType}
            </Button>
          </div>
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
              handleAlterStockModalClose();
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
        open={openAlterStockLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while we are updating stock!!!</p>
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

export default injectWithObserver(StockModal);