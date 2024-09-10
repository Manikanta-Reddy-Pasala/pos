import React, { forwardRef, useState, useEffect, useRef } from 'react';
import { Cancel, DeleteOutlined } from '@material-ui/icons';
import {
  Select,
  Slide,
  Button,
  Dialog,
  Grid,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  FormControlLabel,
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
  MenuItem,
  ListItemText
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
import plus from '../../../../icons/plus.png';
import * as Bd from '../../../../components/SelectedBusiness';
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
  selectOptn: {
    height: '30px',
    background: 'white',
    fontSize: 'small'
  },
  fontSizesmall: {
    fontSize: 'small'
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
    width: '80px !important'
  }
}));

const AddOrderInvoice = (props) => {
  const innerClasses = useInnerStyles();

  const classes = styles.useStyles();
  const [vendorList, setVendorList] = React.useState();

  const store = useStore();
  const {
    OpenNewOrderInvoice,
    isUpdate,
    items,
    workOrderDetails,
    isRestore,
    chosenMetalList,
    openJobWorkOutLoadingAlertMessage,
    openJobWorkOutErrorAlertMessage,
    sequenceNumberFailureAlert
  } = toJS(store.JobWorkStore);
  const {
    handleNewOrderInvoice,
    setWorkOrderItemProperty,
    setWorkOrderProperty,
    addWorkOrderRow,
    deleteItemRow,
    saveOrUpdateWorkJob,
    getTotalWeight,
    setRateList,
    addRateToList,
    setInvoiceRegularSetting,
    setInvoiceThermalSetting,
    handleCloseJobWorkOutErrorAlertMessage,
    handleOpenJobWorkOutLoadingMessage,
    handleCloseSequenceNumberFailureAlert
  } = store.JobWorkStore;
  const { getTransactionData } = store.TransactionStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [vendorNameWhileEditing, setVendorNameWhileEditing] = useState('');

  const { getInvoiceSettings } = store.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(store.PrinterSettingsStore);
  const [printerList, setPrinterList] = React.useState([]);

  const [openVendorNotProvidedAlert, setVendorNotProvidedAlert] =
    React.useState(false);

  const { handleVendorModalOpenFromPurchases } = store.VendorStore;
  const { vendorDialogOpen } = toJS(store.VendorStore);

  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);
  const [isJewellery, setIsJewellery] = React.useState(false);

  const [metalList, setMetalList] = React.useState();
  const [metalName, setMetalName] = React.useState([]);

  const [openZeroTotalAlert, setZeroTotalAlert] = React.useState(false);

  const [errorAlertProductMessage, setErrorAlertProductMessage] = useState('');
  const [openErrorAlertProduct, setErrorAlertProduct] = useState(false);

  const { transaction } = toJS(store.TransactionStore);

  const handleErrorAlertProductClose = () => {
    setErrorAlertProduct(false);
    setErrorAlertProductMessage('');
  };

  const handleAddVendor = () => {
    handleVendorModalOpenFromPurchases();
  };

  useEffect(() => {
    async function fetchData() {
      getTransactionData();
    }
    setIsJewellery(localStorage.getItem('isJewellery'));
    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      getTransactionData();
    }
    getInvoiceSettings(localStorage.getItem('businessId'));

    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }

    fetchData();
  }, []);

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorNotProvidedAlertClose = () => {
    setVendorNotProvidedAlert(false);
  };

  const handleZeroTotalAlertClose = () => {
    setZeroTotalAlert(false);
  };

  const handleVendorClick = (vendor) => {
    setWorkOrderProperty('vendorId', vendor.id);
    setWorkOrderProperty('vendorName', vendor.name);
    setWorkOrderProperty('vendorPhoneNo', vendor.phoneNo);
    setWorkOrderProperty('vendorGstNumber', vendor.gstNumber);
    setWorkOrderProperty('vendorAddress', vendor.address);
    setWorkOrderProperty('vendorCity', vendor.city);
    setWorkOrderProperty('vendorPincode', vendor.pincode);
    setWorkOrderProperty('vendorState', vendor.state);
    setWorkOrderProperty('vendorCountry', vendor.country);
    setWorkOrderProperty('vendorGstType', vendor.gstType);
    setWorkOrderProperty('vendorEmailId', vendor.emailId);

    setVendorNameWhileEditing('');
    setVendorList([]);
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

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };
  const checkCloseDialog = () => {
    if ((items.length === 1 && items[0].itemName === '') || isUpdate) {
      handleNewOrderInvoice(false);
    } else {
      setCloseDialogAlert(true);
    }
  };

  const getRates = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.rates.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        let rateList = data.map((item) => item.toJSON());
        setMetalList(rateList);

        if (!isUpdate && !isRestore) {
          for (let rate of rateList) {
            if (rate.defaultBool === true) {
              addRateToList(rate);
            }
          }
        }
      }
    });
  };

  useEffect(() => {
    getRates();
  }, []);

  const isRateAvailable = (value) => {
    let isAvailable = false;
    if (workOrderDetails.rateList && workOrderDetails.rateList.length > 0) {
      for (var i = 0; i < workOrderDetails.rateList.length; i++) {
        if (value.id === workOrderDetails.rateList[i].id) {
          isAvailable = true;
          break;
        }
      }
    }
    return isAvailable;
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
        open={OpenNewOrderInvoice}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid
                item
                style={{ width: '95%' }}
                className={innerClasses.alignCenter}
              >
                <Grid
                  container
                  className={classes.pageHeader}
                  style={{ flexWrap: 'nowrap' }}
                >
                  <Grid
                    item
                    style={{
                      width: '9%',
                      marginTop: 'auto',
                      marginBottom: 'auto'
                    }}
                  >
                    <Button
                      aria-controls="simple-menu"
                      size="large"
                      variant="text"
                      className={classes.menubutton}
                    >
                      Order Out
                    </Button>
                  </Grid>

                  <Grid
                    item
                    style={{ width: '13%' }}
                    className={innerClasses.alignCenter}
                  >
                    <div>
                      <TextField
                        fullWidth
                        placeholder="Select Vendor *"
                        className={innerClasses.input}
                        value={
                          workOrderDetails.vendorName === ''
                            ? vendorNameWhileEditing
                            : workOrderDetails.vendorName
                        }
                        onChange={(e) => {
                          if (e.target.value !== vendorNameWhileEditing) {
                            setWorkOrderProperty('vendorId', '');
                            setWorkOrderProperty('vendorName', '');
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

                  {transaction.enableVendor && (
                    <Grid
                      item
                      style={{
                        width: '10%',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                        display: 'flex'
                      }}
                    >
                      <img
                        alt="Logo"
                        src={plus}
                        width="20px"
                        height="20px"
                        style={{ marginTop: '2px' }}
                      />
                      <Button
                        size="small"
                        disableRipple
                        className={innerClasses.buttonFocus}
                        style={{
                          position: 'relative',
                          fontSize: 12
                        }}
                        color="secondary"
                        onClick={handleAddVendor}
                      >
                        Add Vendor
                      </Button>
                    </Grid>
                  )}

                  <Grid
                    item
                    style={{
                      width: '10%',
                      alignSelf: 'center',
                      marginLeft: '10px',
                      marginRight: '10px'
                    }}
                  >
                    <Select
                      variant="outlined"
                      fullWidth
                      value={workOrderDetails.workOrderType}
                      onChange={(e) =>
                        setWorkOrderProperty('workOrderType', e.target.value)
                      }
                      classes={{ root: innerClasses.selecttype }}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Repair">Repair</MenuItem>
                    </Select>
                  </Grid>

                  {/************  Metal Rate *********/}
                  {isJewellery && (
                    <Grid
                      item
                      style={{
                        width: '13%',
                        textAlign: 'center',
                        paddingRight: '3px'
                      }}
                      className={innerClasses.alignCenter}
                    >
                      <Grid container>
                        <Grid item xs={3} className={innerClasses.alignCenter}>
                          <Typography
                            variant="span"
                            className="formLabel"
                            style={{
                              color: '#000000',
                              fontSize: 'small',
                              marginRight: '10px'
                            }}
                          >
                            Rates
                          </Typography>
                        </Grid>
                        <Grid item xs={9} className={innerClasses.alignCenter}>
                          <TextField
                            fullWidth
                            displayEmpty
                            style={{ textTransform: 'capitalize' }}
                            value={chosenMetalList ? chosenMetalList : []}
                            margin="dense"
                            variant="outlined"
                            select
                            SelectProps={{
                              // native: true,
                              multiple: true,
                              className: innerClasses.fontSizesmall,
                              renderValue: (selected) => selected.join(', ')
                            }}
                            inputProps={{ 'aria-label': 'Without label' }}
                          >
                            {metalList &&
                              metalList.length > 0 &&
                              metalList.map((option, index) => (
                                <MenuItem key={index} value={option.metal}>
                                  <Checkbox
                                    checked={
                                      workOrderDetails.rateList
                                        ? isRateAvailable(option)
                                        : false
                                    }
                                    onChange={(e) => {
                                      setRateList(e.target.checked, option);
                                    }}
                                  />
                                  <ListItemText
                                    style={{ textTransform: 'capitalize' }}
                                    primary={option.metal}
                                    secondary={option.metalRate}
                                  />
                                </MenuItem>
                              ))}
                          </TextField>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  {isUpdate && (
                    <Grid
                      item
                      style={{ width: '15%', paddingRight: '5px' }}
                      className={innerClasses.alignCenter}
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
                            Order No
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                          <TextField
                            variant="standard"
                            margin="dense"
                            className="customTextField"
                            readOnly
                            value={workOrderDetails.invoiceSequenceNumber}
                            style={{ color: '#000000', fontSize: 'small' }}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  <Grid
                    item
                    style={{ width: '15%', paddingRight: '5px' }}
                    className={innerClasses.alignCenter}
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
                          value={workOrderDetails.orderDate}
                          onChange={(event) =>
                            setWorkOrderProperty(
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
                    style={{ width: '15%', paddingRight: '5px' }}
                    className={innerClasses.alignCenter}
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
                          Due Date
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
                          value={workOrderDetails.dueDate}
                          onChange={(event) =>
                            setWorkOrderProperty('dueDate', event.target.value)
                          }
                          style={{ color: '#000000', fontSize: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item style={{ width: '5%', textAlign: 'end' }}>
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
                              setWorkOrderItemProperty(
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
                            setWorkOrderItemProperty(
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
                            setWorkOrderItemProperty(
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
                            setWorkOrderItemProperty(
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
                          disabled={true}
                          variant={'outlined'}
                          fullWidth
                          value={item.toPay}
                          type="number"
                          onChange={(e) => {
                            setWorkOrderItemProperty(
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
                                ? setWorkOrderItemProperty('amount', '', idx)
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value > 0 || e.target.value === '') {
                                setWorkOrderItemProperty(
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
                      onClick={addWorkOrderRow}
                      className={innerClasses.buttonFocus}
                      // disableRipple
                    >
                      Add Row{' '}
                    </Button>
                  </TableCell>
                  <TableCell colSpan="3"></TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography component="subtitle2">
                      {getTotalWeight} g
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography component="subtitle2">
                      ₹{workOrderDetails.subTotalAmount}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan="2"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Dialog Footer */}
        <div className={classes.footer} style={{ height: '142px' }}>
          <Grid
            container
            justify="space-between"
            className={[classes.root, classes.paymentTypeWrap]}
          >
            <Grid item xs={12}>
              <TextField
                multiline
                rows={1}
                maxRows={1}
                variant="outlined"
                placeholder="Order Notes"
                value={workOrderDetails.orderNotes}
                onChange={(e) =>
                  setWorkOrderProperty('orderNotes', e.target.value)
                }
                style={{ width: '100%', background: 'white' }}
              />
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
              <Button
                variant="outlined"
                color="primary"
                className={classes.footercontrols}
                onClick={() => {
                  let isProdsValid = isProductsValid();

                  if (isProdsValid === false) {
                    return;
                  }

                  if (workOrderDetails.vendorName === '') {
                    setVendorNotProvidedAlert(true);
                  } else {
                    handleOpenJobWorkOutLoadingMessage();
                    saveOrUpdateWorkJob(false, false);
                  }
                }}
              >
                {' '}
                Save{' '}
              </Button>

              <Button
                variant="outlined"
                color="primary"
                className={classes.footercontrols}
                onClick={() => {
                  let isProdsValid = isProductsValid();

                  if (isProdsValid === false) {
                    return;
                  }
                  if (workOrderDetails.vendorName === '') {
                    setVendorNotProvidedAlert(true);
                  } else {
                    handleOpenJobWorkOutLoadingMessage();
                    saveOrUpdateWorkJob(true, false);
                  }
                }}
              >
                Save & New{' '}
              </Button>

              <Button
                color="primary"
                variant="contained"
                className={[classes.saveButton, classes.footercontrols]}
                onClick={() => {
                  let isProdsValid = isProductsValid();

                  if (isProdsValid === false) {
                    return;
                  }

                  if (workOrderDetails.vendorName === '') {
                    setVendorNotProvidedAlert(true);
                  } else {
                    setInvoiceRegularSetting(invoiceRegular);
                    setInvoiceThermalSetting(invoiceThermal);
                    handleOpenJobWorkOutLoadingMessage();
                    saveOrUpdateWorkJob(false, true);
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
                    value={'₹ ' + workOrderDetails.totalAmount}
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
                handleNewOrderInvoice(false);
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
            Job Work Out cannot be saved with zero total.
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
        open={openJobWorkOutLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Job Work Out is being created!!!</p>
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
        open={openJobWorkOutErrorAlertMessage}
        onClose={handleCloseJobWorkOutErrorAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Something went wrong while saving Job Work Out. Please try again!!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseJobWorkOutErrorAlertMessage}
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
  const { setEditTable } = store.JobWorkStore;
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
export default injectWithObserver(AddOrderInvoice);