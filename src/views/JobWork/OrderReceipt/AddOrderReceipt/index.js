import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { Cancel, DeleteOutlined } from '@material-ui/icons';
import {
  Select as SelectMatetrial,
  Slide,
  Button,
  Dialog,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  DialogActions,
  TextField,
  Checkbox,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  TableHead,
  makeStyles,
  MenuItem
} from '@material-ui/core';
//import local components
import * as Db from '../../../../RxDb/Database/Database';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import injectWithObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import styles from '../style';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Arrowtopright from '../../../../icons/Arrowtopright';
import Arrowbottomleft from '../../../../icons/Arrowbottomleft';
import VendorModal from 'src/views/Vendors/modal/AddVendor';
import Loader from 'react-js-loader';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useInnerStyles = makeStyles((theme) => ({
  headerFooterWrapper: {
    padding: '10px',
    margin: 0
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
  formpadding: {
    padding: '0px 1rem',
    '& .formLabel': {
      position: 'relative',
      top: 15
    }
  },
  content: {
    position: 'absolute',
    top: '5%',
    bottom: '135px',
    left: '0px',
    right: '0px',
    overflow: 'auto',
    '@media (max-width: 1300px)': {
      top: '10%'
    }
  },
  total_val: {
    marginTop: '21px',
    border: '3px solid #4A83FB'
  },
  total_design: {
    marginBottom: '13px !important',
    background: '#4A83FB',
    borderBottomLeftRadius: '20px',
    borderTopLeftRadius: '20px',
    padding: '6px 0px 5px 12px',
    color: 'white'
  },
  prcnt: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 'medium'
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
  input: {
    width: '90%'
  },
  PlaceOfsupplyListbox: {
    // minWidth: '38%',
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
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  outlinedInput: {
    width: '70%',
    marginTop: '8px',
    marginBottom: '4px',
    fontSize: 'small'
  },
  buttonFocus: {
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
  selecttype: {
    padding: '6px',
    with: '80px !important'
  }
}));

const AddOrderReceipt = (props) => {
  const innerClasses = useInnerStyles();

  const classes = styles.useStyles();
  const [vendorList, setVendorList] = React.useState();

  const store = useStore();
  const {
    openNewOrderReceipt,
    workOrderReceiptDetails,
    items,
    isUpdate,
    openJobWorkReceiptLoadingAlertMessage,
    openJobWorkReceiptErrorAlertMessage,
    sequenceNumberFailureAlert
  } = toJS(store.JobWorkReceiptStore);

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const [printerList, setPrinterList] = React.useState([]);

  const {
    handleNewOrderReceipt,
    setWorkOrderReceiptItemProperty,
    setWorkOrderReceiptProperty,
    addWorkOrderReceiptRow,
    deleteItemRow,
    saveOrUpdateJobWorkReceipt,
    setOrderReceiptChecked,
    searchJobWorkByInvoiceSequenceNumber,
    setInvoiceRegularSetting,
    setInvoiceThermalSetting,
    handleCloseJobWorkReceiptErrorAlertMessage,
    handleOpenJobWorkReceiptLoadingMessage,
    handleCloseSequenceNumberFailureAlert
  } = store.JobWorkReceiptStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [vendorNameWhileEditing, setVendorNameWhileEditing] = useState('');

  const [openVendorNotProvidedAlert, setVendorNotProvidedAlert] =
    React.useState(false);

  const { vendorDialogOpen } = toJS(store.VendorStore);

  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);

  const [openZeroTotalAlert, setZeroTotalAlert] = React.useState(false);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const handleZeroTotalAlertClose = () => {
    setZeroTotalAlert(false);
  };

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }
  }, []);

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorNotProvidedAlertClose = () => {
    setVendorNotProvidedAlert(false);
  };

  const handleVendorClick = (vendor) => {
    setWorkOrderReceiptProperty('vendorId', vendor.id);
    setWorkOrderReceiptProperty('vendorName', vendor.name);
    setWorkOrderReceiptProperty('vendorPhoneNo', vendor.phoneNo);
    setWorkOrderReceiptProperty('vendorGstNumber', vendor.gstNumber);
    setWorkOrderReceiptProperty('vendorAddress', vendor.address);
    setWorkOrderReceiptProperty('vendorCity', vendor.city);
    setWorkOrderReceiptProperty('vendorPincode', vendor.pincode);
    setWorkOrderReceiptProperty('vendorState', vendor.state);
    setWorkOrderReceiptProperty('vendorCountry', vendor.country);
    setWorkOrderReceiptProperty('vendorGstType', vendor.gstType);
    setWorkOrderReceiptProperty('vendorEmailId', vendor.emailId);
    setVendorNameWhileEditing('');
    setVendorList([]);
  };

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };

  const checkCloseDialog = () => {
    if ((items.length === 1 && items[0].itemName === '') || isUpdate) {
      handleNewOrderReceipt(false);
    } else {
      setCloseDialogAlert(true);
    }
  };

  const isProductsValid = () => {
    let isProductsValid = true;
    let errorMessage = '';

    for (var i = 0; i < items.length; i++) {
      let item = items[i];

      let slNo = i + 1;
      let itemMessage =
        '<br /><b>Sl No: </b>' +
        slNo +
        '<br /><b>Particulars: </b>' +
        item.item_name +
        '<br />';
      let itemValid = true;
      if (item.itemName === '') {
        itemValid = false;
        itemMessage += 'Particulars should be provided<br >';
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

  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: '#f6f8fa'
          }
        }}
        onEscapeKeyDown={checkCloseDialog}
        fullScreen
        open={openNewOrderReceipt}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={4} className={innerClasses.alignCenter}>
                <Grid container className={classes.pageHeader}>
                  <Grid
                    item
                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                  >
                    <Button
                      aria-controls="simple-menu"
                      size="large"
                      variant="text"
                      className={classes.menubutton}
                    >
                      Order Receipt
                    </Button>
                  </Grid>

                  <Grid item xs={5} className={innerClasses.alignCenter}>
                    <div>
                      <TextField
                        fullWidth
                        placeholder="Vendor *"
                        className={innerClasses.input}
                        value={
                          workOrderReceiptDetails.vendorName === ''
                            ? vendorNameWhileEditing
                            : workOrderReceiptDetails.vendorName
                        }
                        onChange={(e) => {
                          if (e.target.value !== vendorNameWhileEditing) {
                            setWorkOrderReceiptProperty('vendorId', '');
                            setWorkOrderReceiptProperty('vendorName', '');
                          }
                          getVendorList(e.target.value);
                          setVendorNameWhileEditing(e.target.value);
                        }}
                        InputProps={{
                          disableUnderline: true,
                          classes: {
                            root: innerClasses.bootstrapRoot,
                            input: innerClasses.bootstrapInput
                          }
                        }}
                        InputLabelProps={{
                          shrink: true,
                          className: innerClasses.bootstrapFormLabel
                        }}
                      />
                      {vendorList && vendorList.length > 0 ? (
                        <>
                          <ul
                            className={innerClasses.listbox}
                            style={{ width: '18%' }}
                          >
                            <li>
                              <Grid container justify="space-between">
                                {vendorList.length === 1 &&
                                vendorList[0].name === '' ? (
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
                            {vendorList.length === 1 &&
                            vendorList[0].name === '' ? (
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
                                    <Button
                                      className={innerClasses.liBtn}
                                      disableRipple
                                    >
                                      <Grid container justify="space-between">
                                        <Grid item style={{ color: 'black' }}>
                                          {option.name}
                                          <br />
                                          {option.phoneNo}
                                          <b>
                                            {' '}
                                            GSTIN:{' '}
                                            {option.gstNumber
                                              ? option.gstNumber
                                              : 'NA'}{' '}
                                          </b>
                                        </Grid>
                                        <Grid item style={{ color: 'black' }}>
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
                                    </Button>
                                  </li>
                                ))}
                              </div>
                            )}
                          </ul>
                        </>
                      ) : null}
                      <VendorModal open={vendorDialogOpen} />
                    </div>
                  </Grid>

                  <Grid item xs={2} style={{ marginTop: '6px' }}>
                    <SelectMatetrial
                      variant="outlined"
                      fullWidth
                      value={workOrderReceiptDetails.workOrderType}
                      onChange={(e) =>
                        setWorkOrderReceiptProperty(
                          'workOrderType',
                          e.target.value
                        )
                      }
                      classes={{ root: innerClasses.selecttype }}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Repair">Repair</MenuItem>
                    </SelectMatetrial>
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={1}
                className={innerClasses.alignCenter}
                tyle={{ paddingRight: '5px' }}
              >
                {/*  {isUpdate && ( */}
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    style={{ textAlign: 'center' }}
                    className={innerClasses.alignCenter}
                  >
                    <Typography
                      variant="span"
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Order No
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="standard"
                      margin="dense"
                      className="customTextField"
                      onChange={(event) => {
                        searchJobWorkByInvoiceSequenceNumber(
                          event.target.value
                        );
                      }}
                      value={workOrderReceiptDetails.invoiceSequenceNumber}
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                </Grid>
                {/*  )} */}
              </Grid>

              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                tyle={{ paddingRight: '5px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    style={{ textAlign: 'center' }}
                    className={innerClasses.alignCenter}
                  >
                    <Typography
                      variant="span"
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Order Date
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      fullWidth
                      variant="standard"
                      margin="dense"
                      type="date"
                      className="customTextField"
                      id="date-picker-inline"
                      value={workOrderReceiptDetails.orderDate}
                      onChange={(event) =>
                        setWorkOrderReceiptProperty(
                          'orderDate',
                          event.target.value
                        )
                      }
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                tyle={{ paddingRight: '5px' }}
              >
                {/*  {isUpdate && ( */}
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    style={{ textAlign: 'center' }}
                    className={innerClasses.alignCenter}
                  >
                    {workOrderReceiptDetails.receiptSequenceNumber &&
                      workOrderReceiptDetails.receiptSequenceNumber > 0 && (
                        <Typography
                          variant="span"
                          className="formLabel"
                          style={{ color: '#000000', fontSize: 'small' }}
                        >
                          Receipt No
                        </Typography>
                      )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    {workOrderReceiptDetails.receiptSequenceNumber &&
                      workOrderReceiptDetails.receiptSequenceNumber > 0 && (
                        <TextField
                          variant="standard"
                          margin="dense"
                          className="customTextField"
                          readOnly
                          value={workOrderReceiptDetails.receiptSequenceNumber}
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      )}
                  </Grid>
                </Grid>
                {/*  )} */}
              </Grid>

              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                tyle={{ paddingRight: '5px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={5}
                    style={{ textAlign: 'center' }}
                    className={innerClasses.alignCenter}
                  >
                    <Typography
                      variant="span"
                      className="formLabel"
                      style={{ color: '#000000', fontSize: 'small' }}
                    >
                      Receipt Date
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <TextField
                      fullWidth
                      variant="standard"
                      margin="dense"
                      type="date"
                      className="customTextField"
                      id="date-picker-inline"
                      value={workOrderReceiptDetails.receiptDate}
                      onChange={(event) =>
                        setWorkOrderReceiptProperty(
                          'dueDate',
                          event.target.value
                        )
                      }
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={1} style={{ textAlign: 'end' }}>
                <IconButton onClick={checkCloseDialog}>
                  <Cancel fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        <div className={innerClasses.content}>
          <Grid container className={innerClasses.headerFooterWrapper}></Grid>
          <TableContainer>
            <Table aria-label="simple table">
              <TableHead className={classes.addtablehead}>
                <TableRow style={{ height: '30px' }}>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    {' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="1"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    SELECT{' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    width={330}
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    PARTICULARS{' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    WEIGHT (in g){' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    COPPER (in g){' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    KDM (in g){' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    TO PAT BY WORK SMITH (in g){' '}
                  </TableCell>

                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    AMOUNT (in Rs){' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    {' '}
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {items.map((item, idx) => (
                  <EditTable
                    key={idx + 1}
                    index={idx}
                    // className={(idx %2 === 0 ? classes.oddRow : classes.evenRow)}
                  >
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
                      <Checkbox
                        checked={item.orderReceiptChecked}
                        style={{ padding: '0px' }}
                        onChange={(e) => {
                          if (!isUpdate) {
                            setOrderReceiptChecked(idx, e.target.checked);
                          }
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </TableCell>
                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {item.isEdit ? (
                        <div>
                          <TextField
                            variant={'outlined'}
                            value={item.itemName}
                            fullWidth
                            InputProps={{
                              classes: { input: classes.outlineinputProps },
                              disableUnderline: true
                            }}
                            onChange={(e) =>
                              setWorkOrderReceiptItemProperty(
                                'itemName',
                                e.target.value,
                                idx
                              )
                            }
                          />
                        </div>
                      ) : (
                        <TextField
                          variant={'standard'}
                          fullWidth
                          value={item.itemName}
                          InputProps={{
                            classes: { input: classes.outlineinputProps },
                            disableUnderline: true
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {item.isEdit ? (
                        <TextField
                          variant={'outlined'}
                          fullWidth
                          onChange={(e) =>
                            setWorkOrderReceiptItemProperty(
                              'weight',
                              e.target.value,
                              idx
                            )
                          }
                          value={item.weight}
                          InputProps={{
                            classes: { input: classes.outlineinputProps },
                            disableUnderline: true
                          }}
                        />
                      ) : (
                        item.weight
                      )}
                    </TableCell>
                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {item.isEdit ? (
                        <TextField
                          variant={'outlined'}
                          fullWidth
                          value={item.copperWeight}
                          onChange={(e) =>
                            setWorkOrderReceiptItemProperty(
                              'copperWeight',
                              e.target.value,
                              idx
                            )
                          }
                          InputProps={{
                            classes: { input: classes.outlineinputProps },
                            disableUnderline: true
                          }}
                        />
                      ) : (
                        item.copperWeight
                      )}
                    </TableCell>
                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {item.isEdit ? (
                        <TextField
                          variant={'outlined'}
                          fullWidth
                          value={item.kdmWeight}
                          type="number"
                          onChange={(e) => {
                            setWorkOrderReceiptItemProperty(
                              'kdmWeight',
                              e.target.value,
                              idx
                            );
                          }}
                          InputProps={{
                            classes: { input: classes.outlineinputProps },
                            disableUnderline: true
                          }}
                        />
                      ) : (
                        item.kdmWeight
                      )}
                    </TableCell>
                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {item.isEdit ? (
                        <TextField
                          variant={'outlined'}
                          fullWidth
                          value={item.toPay}
                          type="number"
                          onChange={(e) => {
                            setWorkOrderReceiptItemProperty(
                              'toPay',
                              e.target.value,
                              idx
                            );
                          }}
                          InputProps={{
                            classes: { input: classes.outlineinputProps },
                            disableUnderline: true
                          }}
                        />
                      ) : (
                        item.toPay
                      )}
                    </TableCell>

                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {item.isEdit ? (
                        <div>
                          <TextField
                            variant={'outlined'}
                            fullWidth
                            type="number"
                            value={item.amount}
                            onFocus={(e) =>
                              item.amount === 0
                                ? setWorkOrderReceiptItemProperty(
                                    'amount',
                                    '',
                                    idx
                                  )
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value > 0 || e.target.value === '') {
                                setWorkOrderReceiptItemProperty(
                                  'amount',
                                  e.target.value,
                                  idx
                                );
                              }
                            }}
                            InputProps={{
                              classes: { input: classes.outlineinputProps },
                              disableUnderline: true
                            }}
                          />
                        </div>
                      ) : (
                        item.amount
                      )}
                    </TableCell>
                    <TableCell
                      variant="body"
                      classes={{ root: classes.tableCellBodyRoot }}
                    >
                      {items.length > 1 && (
                        <div className={classes.wrapper}>
                          <Button
                            style={{
                              padding: '0px'
                            }}
                          >
                            <DeleteOutlined
                              color="secondary"
                              style={{ marginTop: '6px' }}
                              onClick={() => deleteItemRow(idx)}
                            />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </EditTable>
                ))}

                <TableRow className={classes.addRowWrapper}>
                  <TableCell colSpan="2">
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={addWorkOrderReceiptRow}
                      className={innerClasses.buttonFocus}
                      // disableRipple
                    >
                      Add Row{' '}
                    </Button>
                  </TableCell>
                  <TableCell colSpan="5"></TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography component="subtitle2">
                      ₹{workOrderReceiptDetails.subTotalAmount}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan="2"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Dialog Footer */}
        <div className={classes.footer} style={{ height: '190px' }}>
          <Grid
            container
            justify="space-between"
            className={classes.generateBillRow}
          >
            <Grid item xs={6}>
              <TextField
                multiline
                rows={3}
                maxRows={3}
                variant="outlined"
                placeholder="Receipt Notes"
                onChange={(e) =>
                  setWorkOrderReceiptProperty('receiptNotes', e.target.value)
                }
                value={workOrderReceiptDetails.receiptNotes}
                style={{ width: '95%', background: 'white' }}
              />
            </Grid>
            <Grid item xs={3}>
              <Grid container>
                <Grid item xs={5}>
                  <Typography
                    className={classes.fontSizeSmall}
                    style={{ marginTop: '7px' }}
                  >
                    Purity
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    style={{ marginTop: '-9px' }}
                    value={workOrderReceiptDetails.purity}
                    onChange={(e) =>
                      setWorkOrderReceiptProperty('purity', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <Typography
                    className={classes.fontSizeSmall}
                    style={{ marginTop: '3px' }}
                  >
                    Gross in g
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    value={workOrderReceiptDetails.grossWeight}
                    onChange={(e) =>
                      setWorkOrderReceiptProperty('grossWeight', e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={5}>
                  <Typography className={classes.fontSizeSmall}>
                    Net. Wt. in gms
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    value={workOrderReceiptDetails.netWeight}
                    onChange={(e) =>
                      setWorkOrderReceiptProperty('netWeight', e.target.value)
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            container
            justify="space-between"
            style={{
              height: '100%',
              padding: '0px 0px 0px 14px',
              backgroundColor: '#FFFFFF'
            }}
          >
            <Grid item xs={10} style={{ marginTop: '10px' }}>
              {!isUpdate && (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.footercontrols}
                  onClick={() => {
                    let isProdsValid = isProductsValid();

                    if (isProdsValid === false) {
                      return;
                    }
                    if (workOrderReceiptDetails.vendorName === '') {
                      setVendorNotProvidedAlert(true);
                    } else {
                      saveOrUpdateJobWorkReceipt(false, false);
                    }
                  }}
                >
                  {' '}
                  Save{' '}
                </Button>
              )}
              {!isUpdate && (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.footercontrols}
                  onClick={() => {
                    let isProdsValid = isProductsValid();

                    if (isProdsValid === false) {
                      return;
                    }
                    if (workOrderReceiptDetails.vendorName === '') {
                      setVendorNotProvidedAlert(true);
                    } else {
                      saveOrUpdateJobWorkReceipt(true, false);
                    }
                  }}
                >
                  Save & New{' '}
                </Button>
              )}
              <Button
                color="primary"
                variant="contained"
                className={[classes.saveButton, classes.footercontrols]}
                onClick={() => {
                  let isProdsValid = isProductsValid();

                  if (isProdsValid === false) {
                    return;
                  }
                  if (workOrderReceiptDetails.vendorName === '') {
                    setVendorNotProvidedAlert(true);
                  } else {
                    setInvoiceRegularSetting(invoiceRegular);
                    setInvoiceThermalSetting(invoiceThermal);

                    handleOpenJobWorkReceiptLoadingMessage();
                    saveOrUpdateJobWorkReceipt(false, true);
                  }
                }}
              >
                Save & Print{' '}
              </Button>
              {/* <Button
                color="primary"
                variant="contained"
                className={[classes.saveButton, classes.footercontrols]}
                onClick={() => {
                  // onPrintClick();
                }}
              >
                Print{' '}
              </Button> */}
            </Grid>

            <Grid item xs={2}>
              <Grid
                container
                direction="row"
                spacing={0}
                alignItems="center"
                style={{ marginTop: '-11px', marginLeft: '-12px' }}
              >
                <Grid
                  item
                  xs={12}
                  sm={3}
                  className={[
                    innerClasses.formWrapper,
                    innerClasses.total_design
                  ]}
                >
                  <Typography>Total</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={9}
                  className={[
                    classes.backgroundWhite,
                    innerClasses.formWrapper,
                    innerClasses.total_val
                  ]}
                >
                  <TextField
                    className="total-wrapper-form total-payment"
                    id="total-payment"
                    placeholder="0"
                    value={'₹ ' + workOrderReceiptDetails.totalAmount}
                    InputProps={{ disableUnderline: true }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>

        <Dialog
          fullScreen={fullScreen}
          open={openCloseDialog}
          onClose={handleCloseDialogClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Work Order will not be saved, Do you want to close?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              autoFocus
              onClick={(e) => {
                handleNewOrderReceipt(false);
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
          fullScreen={fullScreen}
          open={openVendorNotProvidedAlert}
          onClose={handleVendorNotProvidedAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>
              Please Choose Vendor from list to add a Job Work.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleVendorNotProvidedAlertClose}
              color="primary"
              autoFocus
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openZeroTotalAlert}
        onClose={handleZeroTotalAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Work Order receipt cannot be saved with zero total.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleZeroTotalAlertClose} color="primary" autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openJobWorkReceiptLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>
                  Please wait while the Work Order receipt is being created!!!
                </p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openJobWorkReceiptErrorAlertMessage}
        onClose={handleCloseJobWorkReceiptErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Work Order receipt. Please try
            again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseJobWorkReceiptErrorAlertMessage}
            color="primary"
            autoFocus
          >
            OK
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
      <Dialog
        fullScreen={fullScreen}
        open={sequenceNumberFailureAlert}
        onClose={handleCloseSequenceNumberFailureAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            We are unable to reach our Server to get next sequence No. Please
            try again!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseSequenceNumberFailureAlert}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const EditTable = (props) => {
  const store = useStore();
  const { setEditTable } = store.JobWorkReceiptStore;
  const wrapperRef = useRef(null);
  return (
    <TableRow
      ref={wrapperRef}
      style={
        props.index % 2 === 0
          ? { backgroundColor: 'rgb(246, 248, 250)' }
          : { backgroundColor: '#fff' }
      }
      onClick={() => {
        setEditTable(props.index);
      }}
    >
      {props.children}
    </TableRow>
  );
};
export default injectWithObserver(AddOrderReceipt);