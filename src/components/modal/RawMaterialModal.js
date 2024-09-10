import React, { useState, useRef, useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  withStyles,
  Grid,
  IconButton,
  Typography,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
  Select,
  MenuItem,
  Box
} from '@material-ui/core';
import { Cancel, DeleteOutlined } from '@material-ui/icons';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
//import MuiDialog from '@material-ui/core/Dialog';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import {
  getRawMaterialProductAutoCompleteList,
  getCompleteProductDataAutoCompleteList
} from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';

const useInnerStyles = makeStyles((theme) => ({
  headerFooterWrapper: {
    padding: '10px',
    margin: 0
  },
  tableForm: {
    padding: '10px 6px'
  },
  addButton: {
    padding: '8px 20px'
  },
  classData: {
    height: '40px'
  },
  formWrapper: {
    marginBottom: 35,
    '& .total-wrapper-form': {
      '&.total-payment': {
        '& input': {
          fontSize: 22,
          fontWeight: 500,
          height: 40
        }
      },
      '&.balance-payment': {
        '& input': {
          color: '#f44336'
        }
      },
      '& input': {
        padding: '6px 10px',
        textAlign: 'right'
      }
    }
  },
  total_design: {
    marginBottom: '13px !important',
    background: '#4A83FB',
    borderBottomLeftRadius: '20px',
    borderTopLeftRadius: '20px',
    padding: '6px 0px 5px 12px',
    color: 'white'
  },
  total_val: {
    marginTop: '21px',
    border: '3px solid #4A83FB'
  },
  formpadding: {
    padding: '0px 1rem',
    '& .formLabel': {
      position: 'relative',
      top: 15
    }
  },
  Templecontent: {
    position: 'absolute',
    top: '30%',
    bottom: '135px',
    left: '0px',
    right: '0px',
    overflow: 'auto',
    '@media (max-width: 1500px)': {
      top: '32%'
    }
  },
  content: {
    top: '14%',
    position: 'absolute',
    bottom: '230px',
    left: '0px',
    right: '0px',
    overflow: 'auto',
    '@media (max-width: 1500px)': {
      top: '16%'
    }
  },
  prcnt: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 'medium'
  },
  ProdListbox: {
    minWidth: '38%',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
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
  PlaceOfsupplyListbox: {
    // minWidth: '30%',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
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
  listbox: {
    minWidth: '30%',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
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
  bootstrapFormLabel: {
    fontSize: 16
  },
  input: {
    width: '70%'
  },
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  outlinedInput: {
    width: '70%',
    marginTop: '8px',
    marginBottom: '4px'
  },
  place_supply: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '20%',
    marginLeft: '12px'
  },

  addCustomerBtn: {
    '&:focus': {
      border: '1px solid'
    }
  },
  liBtn: {
    width: '100%',
    padding: '7px 8px',
    textTransform: 'none',
    fontWeight: '300',
    fontSize: 'small',
    '&:focus': {
      background: '#ededed',
      outline: 0,
      border: 0,
      fontWeight: 'bold'
    }
  },
  selectOptn: {
    minWidth: '85%',
    maxWidth: '88%',
    background: 'white'
  },
  fontSizesmall: {
    fontSize: 'small'
  },
  multiSelectOption: {
    maxWidth: '20px !important',
    fontSize: 'small'
  },
  BillTypeListbox: {
    minWidth: '11%',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
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
  billTypeTextField: {
    // marginTop: '18%',
    width: '87%',
    marginLeft: '13px'
  }
}));

const useStyles = makeStyles((theme) => ({
  tableCellHeaderRoot: {
    border: '1px solid #e0e0e0',
    padding: 0,
    lineHeight: '1.25rem',
    textAlign: 'center',
    fontWeight: 400,
    fontSize: '0.87rem',
    color: '#999'
  },
  addRowWrapper: {
    backgroundColor: '#ffffff',
    '& td': {
      padding: '10px'
    }
  },
  addtablehead: {
    backgroundColor: '#ffffff'
  },
  linkpayment: {
    backgroundColor: '#9dcb6a',
    marginLeft: 20,
    color: '#fff',
    '&:focus': {
      backgroundColor: '#9dcb6a'
    },
    '&$focusVisible': {
      backgroundColor: '#9dcb6a'
    },
    '&:hover': {
      backgroundColor: '#9dcb6a'
    }
  },
  saveButton: {
    color: '#fff'
  },
  footercontrols: {
    marginRight: 20,
    padding: '15px 40px'
  },
  paymentTypeWrap: {
    color: '#999'
  },
  tableCellBodyRoot: {
    color: '#999',
    border: '1px solid #e0e0e0',
    padding: '3px',
    lineHeight: '1.25rem',
    textAlign: 'center',
    fontWeight: 400,
    fontSize: '0.8rem'
  },
  outlineinputProps: {
    padding: '2px 6px',
    fontSize: '0.875rem'
  },
  wrapper: {
    display: 'flex'
  },

  roundofftext: {
    '& .MuiOutlinedInput-root': {
      borderColor: 'purple'
    }
  },

  backgroundWhite: {
    backgroundColor: '#ffffff'
  },
  colorBlack: {
    color: '#263238'
  },
  underline: {
    '&&&:before': {
      borderBottom: 'none'
    },
    '&&:after': {
      borderBottom: 'none'
    }
  },
  items: {
    display: 'flexDirection',
    justifyContent: 'space-between'
  },
  paper: {
    height: 140,
    width: 100
  },
  root: {
    margin: '0px 0',
    padding: '5px 15px',
    height: '55px',
    background: '#EBEBEB'
  },
  footer: {
    position: 'absolute',
    bottom: '0px',
    height: '130px',
    left: '0px',
    right: '0px',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF'
  },
  selectMaterial: {
    width: '120px'
  },
  inputMaterial: {
    padding: '3px 6px'
  },
  appBar: {
    position: 'sticky',
    backgroundColor: '#ffffff'
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  },
  newButton: {
    position: 'relative',
    borderRadius: 25
  },

  pageHeader: {
    display: 'flex',
    overflowX: 'hidden'
  },
  pageIcon: {
    display: 'inline-block',
    padding: theme.spacing(2),
    color: '#3c44b1'
  },
  pageTitle: {
    paddingLeft: theme.spacing(4),
    '& .MuiTypography-subtitle2': {
      opacity: '0.6'
    }
  },
  mySvgStyle: {
    fillColor: theme.palette.primary.main
  },
  card: {
    padding: theme.spacing(4),
    display: 'flex',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    flexDirection: 'row'
  },
  menubutton: {
    fontWeight: 'bold',
    textTransform: 'none'
  },
  menubutton1: {
    textTransform: 'none'
  },
  customizeToolbar: {
    maxHeight: 20
  },
  selectData: {
    color: '#EF5350',
    width: '120px'
    // height: '45px',
    // backgroundColor: 'white'
  },
  payment_display: {
    display: 'inline-block',
    marginRight: '10px'
  },
  payment_op_display: {
    display: 'inline-block'
  },
  header: {
    fontWeight: 'bold',
    fontFamily: 'Roboto'
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
  mainlistbox: {
    minWidth: '30%',
    margin: 0,
    padding: 5,
    zIndex: 99,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
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

const RawMaterialModal = (props) => {
  const innerClasses = useInnerStyles();
  const classes = useStyles();
  const store = useStore();

  const [openCloseDialog, setopenCloseDialog] = React.useState(false);
  const {
    rawMaterialSingleOpenDialog,
    rawMaterialsList,
    rawMaterialData,
    expenseList,
    isEdit,
    productDetail
  } = toJS(store.RawMaterialsStore);

  const {
    handleRawMaterialSingleModalClose,
    setRawMaterialPurchasedPrice,
    setRawMaterialQuantity,
    getRawMaterialEstimateAmount,
    deleteRawMaterialItem,
    selectRawMaterialProduct,
    setRawMaterialFreeQuantity,
    getTotalAmount,
    addNewRawMaterialItem,
    setRawMaterialItemUnit,
    setDirectExpense,
    setRawMaterialProduct,
    resetRawMaterialProduct
  } = store.RawMaterialsStore;

  const { updateProduct } = store.ProductStore;

  const [product_name, setProductName] = React.useState();
  const [productlist, setproductlist] = useState([]);
  const [mainProductlist, setMainProductlist] = useState([]);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const [productNameWhileEditing, setProductNameWhileEditing] =
    React.useState();
  const [mainProductName, setMainProductName] = React.useState('');

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const handleCloseDialogClose = () => {
    setopenCloseDialog(false);
  };

  const handleCloseDialogOpen = () => {
    setopenCloseDialog(true);
  };

  const handleAddRow = () => {
    console.log('add row');
    addNewRawMaterialItem(false, true);
  };

  const handleRawMaterialSaveClick = () => {
    let isProdsValid = isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    //code to save raw materials details
    let filteredArray = [];

    for (let item of rawMaterialsList) {
      if (item.item_name === '') {
        continue;
      }

      if (item.batch_id === null || item.batch_id === '') {
        item.batch_id = 0;
      }

      if (item.qty === null || item.qty === '') {
        item.qty = 0;
      }

      if (item.freeQty === null || item.freeQty === '') {
        item.freeQty = 0;
      }

      if (item.purchased_price === null || item.purchased_price === '') {
        item.purchased_price = 0;
      }

      if (
        item.purchased_price_before_tax === null ||
        item.purchased_price_before_tax === ''
      ) {
        item.purchased_price_before_tax = 0;
      }

      if (item.cgst === null || item.cgst === '') {
        item.cgst = 0;
      }

      if (item.sgst === null || item.sgst === '') {
        item.sgst = 0;
      }

      if (item.igst === null || item.igst === '') {
        item.igst = 0;
      }

      if (item.cess === null || item.cess === '') {
        item.cess = 0;
      }

      if (item.cgst_amount === null || item.cgst_amount === '') {
        item.cgst_amount = 0;
      }

      if (item.sgst_amount === null || item.sgst_amount === '') {
        item.sgst_amount = 0;
      }

      if (item.igst_amount === null || item.igst_amount === '') {
        item.igst_amount = 0;
      }

      if (item.taxIncluded === null || item.taxIncluded === '') {
        item.taxIncluded = false;
      }

      if (item.estimate === null || item.estimate === '') {
        item.estimate = 0;
      }

      if (item.isEdit === null || item.isEdit === '') {
        item.isEdit = true;
      }

      if (item.discount_amount === null || item.discount_amount === '') {
        item.discount_amount = 0;
      }

      if (item.discount_percent === null || item.discount_percent === '') {
        item.discount_percent = 0;
      }

      if (
        item.discount_amount_per_item === null ||
        item.discount_amount_per_item === ''
      ) {
        item.discount_amount_per_item = 0;
      }

      filteredArray.push(item);
    }

    if (filteredArray.length === 0) {
      setErrorAlertProductMessage(
        'Please add atleast one raw material to save BOM'
      );
      setErrorAlertProduct(true);
      return;
    }

    rawMaterialData.rawMaterialList = filteredArray;

    let expensesFilteredArray = [];
    for (let item of expenseList) {
      if (
        item.amount === null ||
        item.amount === '' ||
        item.amount === undefined
      ) {
        item.amount = 0;
      }
      expensesFilteredArray.push(item);
    }
    rawMaterialData.directExpenses = expensesFilteredArray;

    productDetail.rawMaterialData = rawMaterialData;
    updateProduct(productDetail);
    handleRawMaterialSingleModalClose();
  };

  const isProductsValid = () => {
    let isProductsValid = true;
    let errorMessage = '';

    for (var i = 0; i < rawMaterialsList.length; i++) {
      let item = rawMaterialsList[i];

      if (item.estimate === 0 && item.qty === 0 && item.purchased_price === 0) {
        continue;
      }

      let slNo = i + 1;
      let itemMessage =
        '<br /><b>Sl No: </b>' +
        slNo +
        '<br /><b>Product Name: </b>' +
        item.item_name +
        '<br />';
      let itemValid = true;
      if (
        item.qty === '' ||
        item.qty === 0 ||
        item.qty === undefined ||
        item.qty === null
      ) {
        itemValid = false;
        itemMessage += 'Quantity should be greater than 0<br />';
      }
      if (
        item.purchased_price === '' ||
        item.purchased_price === 0 ||
        item.purchased_price === undefined ||
        item.purchased_price === null
      ) {
        itemValid = false;
        itemMessage += 'Price should be greater than 0<br />';
      }
      if (item.item_name === '') {
        itemValid = false;
        itemMessage += 'Product Name should be provided<br >';
      }

      if (!itemValid) {
        errorMessage += itemMessage;
      }
    }

    if (errorMessage !== '') {
      setErrorAlertProductMessage(errorMessage);
      setErrorAlertProduct(true);
      isProductsValid = false;
    }

    return isProductsValid;
  };

  const getProductList = async (value) => {
    setproductlist(await getRawMaterialProductAutoCompleteList(value));
  };

  const getMainProductList = async (value) => {
    setMainProductlist(await getCompleteProductDataAutoCompleteList(value));
  };

  return (
    <>
      <Dialog
        open={rawMaterialSingleOpenDialog}
        onClose={handleRawMaterialSingleModalClose}
        fullWidth
        maxWidth="lg"
        PaperProps={{
          style: {
            maxHeight: '95%',
            height: '95%',
            width: '60%'
          }
        }}
      >
        <DialogTitle id="product-modal-title">
          <span style={{ textAlign: 'left' }}>Add Raw Materials</span>
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleCloseDialogOpen}
            style={{ textAlign: 'end' }}
          >
            <CancelRoundedIcon />
          </IconButton>
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
                  {!isEdit ? (
                    <div>
                      <TextField
                        fullWidth
                        className={classes.input}
                        placeholder="Select Product"
                        value={
                          mainProductName === ''
                            ? productNameWhileEditing
                            : mainProductName
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
                            setMainProductName('');
                            resetRawMaterialProduct();
                          }

                          setProductNameWhileEditing(e.target.value);
                          getMainProductList(e.target.value);
                        }}
                      />{' '}
                      {mainProductlist.length > 0 ? (
                        <>
                          <ul
                            className={classes.mainlistbox}
                            style={{ width: '80%', zIndex: '5' }}
                          >
                            {mainProductlist.map((option, index) => (
                              <li
                                style={{ padding: 10, cursor: 'pointer' }}
                                onClick={() => {
                                  setMainProductlist([]);
                                  setProductNameWhileEditing('');
                                  setMainProductName(option.name);
                                  // to set product to add raw materials
                                  setRawMaterialProduct(option);
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
              <div
                style={{
                  height: '90%',
                  maxWidth: '95%',
                  position: 'absolute',
                  overflowY: 'scroll'
                }}
              >
                <TableContainer>
                  <TableHead>
                    <TableRow>
                      <TableCell variant="head" rowSpan="1" width={50}>
                        {'   '}
                      </TableCell>
                      <TableCell variant="head" rowSpan="1" width={300}>
                        RAW MATERIALS{' '}
                      </TableCell>

                      <TableCell variant="head" rowSpan="1" width={200}>
                        PURCHASE PRICE{' '}
                      </TableCell>
                      <TableCell variant="head" rowSpan="2" width={100}>
                        QTY{' '}
                      </TableCell>
                      <TableCell variant="head" rowSpan="1" width={200}>
                        UNIT{' '}
                      </TableCell>
                      <TableCell variant="head" rowSpan="1" width={300}>
                        ESTIMATE{' '}
                      </TableCell>
                      {/*  <TableCell variant="head" rowSpan="2" width={250}>
                        {' '}
                      </TableCell> */}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {rawMaterialsList &&
                      rawMaterialsList.length > 0 &&
                      rawMaterialsList.map((item, idx) => (
                        <EditTable key={idx + 1} index={idx}>
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {idx + 1}
                          </TableCell>

                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit && !item.item_name ? (
                              <div>
                                <TextField
                                  variant={'outlined'}
                                  value={product_name}
                                  fullWidth
                                  onChange={(e) => {
                                    getProductList(e.target.value);
                                    setProductName(e.target.value);
                                  }}
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                />{' '}
                                {productlist.length > 0 ? (
                                  <div>
                                    <ul className={innerClasses.ProdListbox}>
                                      <li>
                                        <Button
                                          size="small"
                                          disableRipple
                                          style={{
                                            position: 'relative',
                                            fontSize: 12,
                                            width: '100%',
                                            cursor: 'not-allowed',
                                            fontWeight: 'bold'
                                          }}
                                        >
                                          <Grid
                                            container
                                            style={{ display: 'flex' }}
                                          >
                                            <Grid item xs={5}>
                                              <p>Name</p>
                                            </Grid>
                                            <Grid item xs={4}>
                                              <p> Purchase Price</p>
                                            </Grid>

                                            <Grid item xs={3}>
                                              <p> Stock </p>
                                            </Grid>
                                          </Grid>
                                        </Button>
                                      </li>

                                      {productlist.map((option, index) => (
                                        <li
                                          key={index}
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => {
                                            setproductlist([]);

                                            selectRawMaterialProduct(
                                              option,
                                              idx
                                            );
                                            setProductName('');
                                          }}
                                        >
                                          <Button
                                            className={innerClasses.liBtn}
                                            disableRipple
                                          >
                                            <Grid
                                              container
                                              // justify="space-between"
                                              style={{ display: 'flex' }}
                                              className={classes.listitemGroup}
                                            >
                                              <Grid item xs={5}>
                                                <p>{option.name}</p>
                                              </Grid>
                                              <Grid item xs={4}>
                                                {''}
                                                <p className={classes.listitem}>
                                                  {option.purchasedPrice
                                                    ? parseFloat(
                                                        option.purchasedPrice
                                                      ).toFixed(2)
                                                    : 0}
                                                </p>
                                              </Grid>

                                              <Grid item xs={3}>
                                                {/* {option.stockQty >= 0 ? ( */}
                                                <p className={classes.credit}>
                                                  {option.stockQty}
                                                </p>
                                                {/* ) : ( */}
                                                {/* <p className={classes.debit}>10</p> */}
                                                {/* )} */}
                                              </Grid>
                                            </Grid>
                                          </Button>
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
                                value={item.item_name}
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            )}
                          </TableCell>

                          {/* Price */}
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <TextField
                                variant={'outlined'}
                                fullWidth
                                value={item.purchased_price}
                                type="number"
                                onFocus={(e) =>
                                  item.purchased_price === 0
                                    ? setRawMaterialPurchasedPrice(idx, '')
                                    : ''
                                }
                                onChange={(e) => {
                                  setRawMaterialPurchasedPrice(
                                    idx,
                                    e.target.value
                                  );
                                }}
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              parseFloat(item.purchased_price)
                            )}
                          </TableCell>

                          {/* Quantity */}

                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <TextField
                                variant={'outlined'}
                                fullWidth
                                value={item.qty}
                                type="number"
                                onFocus={(e) =>
                                  item.qty === 0
                                    ? setRawMaterialQuantity(idx, '')
                                    : ''
                                }
                                onChange={(e) => {
                                  if (
                                    e.target.value > 0 ||
                                    e.target.value === ''
                                  ) {
                                    setRawMaterialQuantity(idx, e.target.value);
                                  }
                                }}
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              item.qty
                            )}{' '}
                          </TableCell>

                          {/* Unit */}

                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            <>
                              {item.isEdit ? (
                                <>
                                  {item.units && item.units.length > 0 ? (
                                    <>
                                      {item.qtyUnit === '' &&
                                        setRawMaterialItemUnit(
                                          idx,
                                          item.units[0]
                                        )}
                                      <Select
                                        value={item.qtyUnit}
                                        fullWidth
                                        variant="outlined"
                                        margin="dense"
                                        style={{
                                          marginTop: '8px',
                                          marginBottom: '4px'
                                        }}
                                        className="customTextField"
                                      >
                                        {item.units.map((option, index) => (
                                          <MenuItem
                                            value={option}
                                            name={option}
                                            onClick={() => {
                                              setRawMaterialItemUnit(
                                                idx,
                                                option
                                              );
                                            }}
                                          >
                                            {option}
                                          </MenuItem>
                                        ))}
                                      </Select>
                                    </>
                                  ) : (
                                    <TextField
                                      variant={'outlined'}
                                      fullWidth
                                      value={item.qtyUnit}
                                      onChange={(e) => {
                                        setRawMaterialItemUnit(
                                          idx,
                                          e.target.value
                                        );
                                      }}
                                      InputProps={{
                                        inputProps: {
                                          min: 0
                                        },
                                        classes: {
                                          input: innerClasses.tableForm
                                        },
                                        disableUnderline: true
                                      }}
                                    />
                                  )}
                                </>
                              ) : (
                                item.qtyUnit
                              )}
                            </>
                          </TableCell>

                          {/* Amount */}
                          <TableCell
                            variant="body"
                            classes={{ root: classes.tableCellBodyRoot }}
                          >
                            {item.isEdit ? (
                              <div className={classes.wrapper}>
                                <TextField
                                  variant={'outlined'}
                                  readOnly={true}
                                  value={item.estimate}
                                  onChange={(e) =>
                                    getRawMaterialEstimateAmount(idx)
                                  }
                                  InputProps={{
                                    classes: { input: innerClasses.tableForm },
                                    disableUnderline: true
                                  }}
                                  fullWidth
                                />
                                <Button
                                  style={{
                                    padding: '0px'
                                  }}
                                >
                                  <DeleteOutlined
                                    color="secondary"
                                    onClick={() => deleteRawMaterialItem(idx)}
                                    style={{ fontSize: 'xx-large' }}
                                  />
                                </Button>
                              </div>
                            ) : (
                              item.estimate
                            )}
                          </TableCell>
                        </EditTable>
                      ))}

                    <TableRow>
                      <TableCell colSpan="2" style={{ textAlign: 'left' }}>
                        <Button variant="outlined" onClick={handleAddRow()}>
                          + Add Row
                        </Button>
                      </TableCell>

                      <TableCell
                        colSpan="2"
                        style={{ textAlign: 'left' }}
                      ></TableCell>

                      <TableCell colSpan="1" style={{ textAlign: 'right' }}>
                        Sub Total
                      </TableCell>
                      <TableCell colSpan="1" style={{ textAlign: 'left' }}>
                        <Typography
                          style={{
                            float: 'center',
                            position: 'relative'
                          }}
                          variant="span"
                          component="span"
                        >
                          {'₹ ' +
                            parseFloat(rawMaterialData.subTotal).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableContainer>
                <div>
                  {String(
                    localStorage.getItem('isHotelOrRestaurant')
                  ).toLowerCase() === 'false' ? (
                    <>
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
                        {expenseList &&
                          expenseList.length > 0 &&
                          expenseList.map((option, index) => (
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
                                  variant={'outlined'}
                                  value={option.amount}
                                  type="text"
                                  InputLabelProps={{
                                    shrink: true
                                  }}
                                  size="small"
                                  onFocus={(e) =>
                                    option.amount === 0
                                      ? setDirectExpense('', index)
                                      : ''
                                  }
                                  onChange={(event) => {
                                    setDirectExpense(event.target.value, index);
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        style={{
                          marginTop: '20px',
                          width: '60%'
                        }}
                      ></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div>
            <b style={{ marginRight: '20px' }}>TOTAL: {getTotalAmount}</b>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                handleRawMaterialSaveClick();
              }}
              style={{ color: 'white', backgroundColor: '#ef5251' }}
            >
              Save
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
            Raw Material details will not be saved, Do you want to close?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseDialogClose();
              handleRawMaterialSingleModalClose();
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
        fullWidth={true}
        maxWidth={'sm'}
        open={openErrorAlertProduct}
        onClose={handleErrorAlertProductClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div
              dangerouslySetInnerHTML={{ __html: errorAlertProductMessage }}
            ></div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertProductClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const useOutsideAlerter = (ref, index) => {};
const EditTable = (props) => {
  const store = useStore();
  const { setRawMaterialEditTable, getAddRowEnabled, setAddRowEnabled } =
    store.RawMaterialsStore;
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.index);
  return (
    <TableRow
      ref={wrapperRef}
      style={
        props.index % 2 === 0
          ? { backgroundColor: 'rgb(246, 248, 250)' }
          : { backgroundColor: '#fff' }
      }
      onClick={() => {
        if (!getAddRowEnabled()) {
          setRawMaterialEditTable(props.index, true, '');
        } else {
          setAddRowEnabled(false);
        }
      }}
    >
      {props.children}
    </TableRow>
  );
};

export default injectWithObserver(RawMaterialModal);