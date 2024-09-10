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
  FormControl
} from '@material-ui/core';
import { Cancel, DeleteOutlined } from '@material-ui/icons';
import DialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

//import MuiDialog from '@material-ui/core/Dialog';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

import { toJS } from 'mobx';

import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { getProductAutoCompleteList } from 'src/components/Helpers/ProductsAutoCompleteQueryHelper';

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
    zIndex: '999999',
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
  sticky: {
    bottom: '0',
    overflowX: 'hidden',
    position: 'sticky',
    textAlign: 'center',
    zIndex: '99999',
    padding: '10px',
    backgroundColor: 'white'
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

const AddProductGroup = (props) => {
  const innerClasses = useInnerStyles();
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;
  const store = useStore();

  const [openCloseDialog, setopenCloseDialog] = React.useState(false);
  const {
    productGroupOpenDialog,
    productGroupList,
    productGroupData,
    isProductGroupUpdate
  } = toJS(store.ProductGroupStore);

  const {
    handleProductGroupModalClose,
    setProductGroupSalePrice,
    setProductGroupQuantity,
    getProductGroupEstimateAmount,
    deleteProductGroupItem,
    selectProductGroupProduct,
    setProductGroupFreeQuantity,
    getTotalAmount,
    addNewProductGroupItem,
    setProductGroupItemUnit,
    setProductGroupName,
    saveData,
    updateData
  } = store.ProductGroupStore;

  const [product_name, setProductName] = React.useState();
  const [productlist, setproductlist] = useState([]);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

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
    addNewProductGroupItem(false, true);
  };

  const handleProductGroupSaveClick = () => {
    let isProdsValid = isProductsValid();

    if (isProdsValid === false) {
      return;
    }

    if (productGroupData.groupName === '') {
      handleCloseDialogOpen();
      return;
    }

    if (!isProductGroupUpdate) {
      saveData();
    } else {
      updateData();
    }
  };

  const isProductsValid = () => {
    let isProductsValid = true;
    let errorMessage = '';

    for (var i = 0; i < productGroupList.length; i++) {
      let item = productGroupList[i];

      if (item.amount === 0 && item.qty === 0 && item.mrp === 0) {
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
        item.mrp === '' ||
        item.mrp === 0 ||
        item.mrp === undefined ||
        item.mrp === null
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
    setproductlist(await getProductAutoCompleteList(value));
  };

  return (
    <>
      <Dialog
        open={productGroupOpenDialog}
        onClose={handleProductGroupModalClose}
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
          <span style={{ textAlign: 'left' }}>Add Group</span>
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleProductGroupModalClose}
            style={{ textAlign: 'end' }}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent style={{position:'relative'}}>
          <DialogContentText>
            <div>
              <Grid item xs={12} className="grid-padding">
                <FormControl fullWidth>
                  <Typography component="subtitle1">Group Name</Typography>
                  <TextField
                    fullWidth
                    required
                    variant="outlined"
                    margin="dense"
                    type="text"
                    className="customTextField"
                    placeholder="Enter Group Name"
                    value={productGroupData.groupName}
                    onChange={(event) =>
                      setProductGroupName(event.target.value.toString())
                    }
                  />
                </FormControl>
              </Grid>
              <div
                style={{
                  height: '90%',
                  maxWidth: '100%',
                  position: 'absolute'
                  // overflowY: 'scroll'
                }}
              >
                <TableContainer>
                  <TableHead>
                    <TableRow>
                      <TableCell variant="head" rowSpan="1" width={50}>
                        {'   '}
                      </TableCell>
                      <TableCell variant="head" rowSpan="1" width={300}>
                        NAME{' '}
                      </TableCell>

                      <TableCell variant="head" rowSpan="1" width={200}>
                        SALE PRICE{' '}
                      </TableCell>
                      <TableCell variant="head" rowSpan="2" width={100}>
                        QTY{' '}
                      </TableCell>
                      <TableCell variant="head" rowSpan="1" width={200}>
                        UNIT{' '}
                      </TableCell>
                      <TableCell variant="head" rowSpan="1" width={300}>
                        AMOUNT{' '}
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {productGroupList &&
                      productGroupList.length > 0 &&
                      productGroupList.map((item, idx) => (
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
                                    classes: { input: innerClasses.tableForm }
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
                                              <p> Sale Price</p>
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

                                            selectProductGroupProduct(
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
                                                  {option.salePrice
                                                    ? parseFloat(
                                                        option.salePrice
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
                                value={item.mrp}
                                type="number"
                                onFocus={(e) =>
                                  item.mrp === 0
                                    ? setProductGroupSalePrice(idx, '')
                                    : ''
                                }
                                onChange={(e) => {
                                  setProductGroupSalePrice(idx, e.target.value);
                                }}
                                InputProps={{
                                  classes: { input: innerClasses.tableForm },
                                  disableUnderline: true
                                }}
                              />
                            ) : (
                              parseFloat(item.mrp)
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
                                    ? setProductGroupQuantity(idx, '')
                                    : ''
                                }
                                onChange={(e) => {
                                  if (
                                    e.target.value > 0 ||
                                    e.target.value === ''
                                  ) {
                                    setProductGroupQuantity(
                                      idx,
                                      e.target.value
                                    );
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
                                        setProductGroupItemUnit(
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
                                              setProductGroupItemUnit(
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
                                        setProductGroupItemUnit(
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
                                  value={item.amount}
                                  onChange={(e) =>
                                    getProductGroupEstimateAmount(idx)
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
                                    onClick={() => deleteProductGroupItem(idx)}
                                    style={{ fontSize: 'xx-large' }}
                                  />
                                </Button>
                              </div>
                            ) : (
                              item.amount
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
                            parseFloat(productGroupData.subTotal).toFixed(2)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </TableContainer>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.sticky}>
          <div>
            <b style={{ marginRight: '20px' }}>TOTAL: {getTotalAmount}</b>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                handleProductGroupSaveClick();
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
          <DialogContentText>Group Name cannot be left blank</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseDialogClose();
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
        maxWidth={'md'}
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
  const { setProductGroupEditTable, getAddRowEnabled, setAddRowEnabled } =
    store.ProductGroupStore;
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
          setProductGroupEditTable(props.index, true, '');
        } else {
          setAddRowEnabled(false);
        }
      }}
    >
      {props.children}
    </TableRow>
  );
};

export default injectWithObserver(AddProductGroup);