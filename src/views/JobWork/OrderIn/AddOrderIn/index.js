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
  Select
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
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import { getCustomerName } from 'src/names/constants';

var dateFormat = require('dateformat');

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

const AddOrderIn = (props) => {
  const innerClasses = useInnerStyles();

  const classes = styles.useStyles();
  const [vendorList, setVendorList] = React.useState();

  const store = useStore();
  const { OpenNewOrderIn, isUpdate, items, workOrderDetails } = toJS(
    store.JobWorkStore
  );

  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);

  const {
    handleOrderInDialog,
    setWorkOrderItemProperty,
    setWorkOrderProperty,
    addWorkOrderRow,
    deleteItemRow,
    saveOrUpdateWorkJob
  } = store.JobWorkStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [vendorNameWhileEditing, setVendorNameWhileEditing] = useState('');
  const [bankAccounts, setBankAccounts] = React.useState([]);
  const [payment_type_list, setPaymentTypeList] = React.useState([]);

  const [openVendorNotProvidedAlert, setVendorNotProvidedAlert] =
    React.useState(false);

  const { handleVendorModalOpenFromPurchases } = store.VendorStore;
  const { vendorDialogOpen } = toJS(store.VendorStore);

  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);

  const payment_mode_list = [
    // {val: 'CASH ON DELIVERY' ,name : 'CASH ON DELIVERY'},
    { val: 'internetbanking', name: 'Internet Banking' },
    { val: 'creditcard', name: 'Credit Card' },
    { val: 'debitcard', name: 'Debit Card' },
    { val: 'upi', name: 'UPI' }
  ];

  const handleAddVendor = () => {
    handleVendorModalOpenFromPurchases();
  };

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorNotProvidedAlertClose = () => {
    setVendorNotProvidedAlert(false);
  };

  const handleVendorClick = (vendor) => {
    setWorkOrderProperty('vendorId', vendor.id);
    setWorkOrderProperty('vendorName', vendor.name);
    setWorkOrderProperty('vendorPhoneNo', vendor.phoneNo);
    setWorkOrderProperty('vendorGstNumber', vendor.gstNumber);
    setWorkOrderProperty('vendorAddress', vendor.address);

    setVendorNameWhileEditing('');
    setVendorList([]);
  };

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };
  const checkCloseDialog = () => {
    if ((items.length === 1 && items[0].itemName === '') || isUpdate) {
      handleOrderInDialog(false);
    } else {
      setCloseDialogAlert(true);
    }
  };

  const getBankAccounts = async () => {
    const db = await Db.get();
    let list = [
      { val: 'cash', name: 'Cash' },
      { val: 'cheque', name: 'Cheque' }
    ];
    const businessData = await Bd.getBusinessData();

    let query = db.bankaccounts.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe((data) => {
      if (!data) {
        return;
      }

      let bankAccounts = data.map((item) => {
        let bankAccount = {};

        bankAccount.accountDisplayName = item.accountDisplayName;
        bankAccount.balance = item.balance;
        list.push({
          val: item.accountDisplayName,
          name: item.accountDisplayName
        });
        return item;
      });

      setBankAccounts(bankAccounts);
      setPaymentTypeList(list);
    });
  };

  useEffect(() => {
    getBankAccounts();
  }, []);

  useEffect(() => {
    async function fetchData() {
      getTransactionData();
    }

    fetchData();
  }, []);

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
        open={OpenNewOrderIn}
        onClose={checkCloseDialog}
        TransitionComponent={Transition}
      >
        <AppBar elevation={1} className={classes.appBar}>
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={5} className={innerClasses.alignCenter}>
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
                      Order In
                    </Button>
                  </Grid>

                  <Grid item className={innerClasses.alignCenter}>
                    <div>
                      <TextField
                        fullWidth
                        placeholder="Select Customer *"
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

                  {transaction.enableCustomer && (
                    <Grid
                      item
                      style={{
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
                        {'Add ' + getCustomerName()}
                      </Button>
                    </Grid>
                  )}

                  <Grid item style={{ marginTop: '6px', marginLeft: '10px' }}>
                    <SelectMatetrial
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
                    </SelectMatetrial>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                tyle={{ paddingRight: '20px' }}
              >
                {isUpdate && (
                  <Grid container className={innerClasses.alignCenter}>
                    <Grid
                      item
                      xs={12}
                      sm={2}
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
                    <Grid item xs={12} sm={9}>
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
                )}
              </Grid>
              <Grid
                item
                xs={2}
                className={innerClasses.alignCenter}
                tyle={{ paddingRight: '20px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={2}
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
                  <Grid item xs={12} sm={9}>
                    <TextField
                      fullWidth
                      variant="standard"
                      margin="dense"
                      type="date"
                      className="customTextField"
                      id="date-picker-inline"
                      value={workOrderDetails.orderDate}
                      onChange={(event) =>
                        setWorkOrderProperty('orderDate', event.target.value)
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
                tyle={{ paddingRight: '20px' }}
              >
                <Grid container className={innerClasses.alignCenter}>
                  <Grid
                    item
                    xs={12}
                    sm={2}
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
                  <Grid item xs={12} sm={9}>
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
                    WEIGHT (in gms){' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    COPPER (in gms){' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    KDM (in gms){' '}
                  </TableCell>
                  <TableCell
                    variant="head"
                    rowSpan="2"
                    classes={{ root: classes.tableCellHeaderRoot }}
                  >
                    TO PAT BY WORN SMITH (in gms){' '}
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
                  <TableCell colSpan="2"></TableCell>
                  <TableCell colSpan="2">
                    {' '}
                    <Typography
                      style={{
                        float: 'right',
                        top: '4px',
                        position: 'relative'
                      }}
                      variant="span"
                      component="span"
                    >
                      SUB TOTAL{' '}
                    </Typography>
                  </TableCell>
                  <TableCell style={{ textAlign: 'center' }}>
                    <Typography component="subtitle2">
                      {workOrderDetails.subTotalAmount}
                    </Typography>
                  </TableCell>
                  <TableCell colSpan="2"></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Dialog Footer */}
        <div className={classes.footer} style={{ height: '211px' }}>
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
            className={classes.generateBillRow}
          >
            <Grid item xs={8}>
              <Grid container>
                <Grid item xs={4}>
                  <Grid container>
                    <Grid
                      item
                      xs={4}
                      style={{ marginTop: 'auto', marginBottom: 'auto' }}
                    >
                      <Typography style={{ fontSize: 'small' }}>
                        Payment Type
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <div>
                        <Select variant="outlined" fullWidth margin="dense">
                          {payment_type_list.map((ele, index) => (
                            <MenuItem value={ele.val}>{ele.name}</MenuItem>
                          ))}
                        </Select>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container>
                    <Grid
                      item
                      xs={4}
                      style={{ marginTop: 'auto', marginBottom: 'auto' }}
                    >
                      <Typography style={{ fontSize: 'small' }}>
                        Payment Mode
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <Select variant="outlined" fullWidth margin="dense">
                        {payment_mode_list.map((ele, index) => (
                          <MenuItem value={ele.val}>{ele.name}</MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container>
                    <Grid
                      item
                      xs={4}
                      style={{ marginTop: 'auto', marginBottom: 'auto' }}
                    >
                      <Typography style={{ fontSize: 'small' }}>
                        Payment Ref No
                      </Typography>
                    </Grid>
                    <Grid item xs={7}>
                      <TextField
                        variant="outlined"
                        type={'number'}
                        fullWidth
                        margin="dense"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container>
                <Grid
                  item
                  xs={4}
                  style={{ marginTop: 'auto', marginBottom: 'auto' }}
                >
                  <Typography style={{ fontSize: 'small' }}>
                    Received
                  </Typography>
                </Grid>
                <Grid item xs={7} style={{ marginTop: '5px' }}>
                  <TextField
                    variant="outlined"
                    type={'number'}
                    fullWidth
                    margin="dense"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container>
                <Grid
                  item
                  xs={4}
                  style={{ marginTop: 'auto', marginBottom: 'auto' }}
                >
                  <Typography style={{ fontSize: 'small' }}>Balance</Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    style={{ marginTop: '5px' }}
                    variant="outlined"
                    type={'number'}
                    fullWidth
                    margin="dense"
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
              <Button
                variant="outlined"
                color="primary"
                className={classes.footercontrols}
                onClick={() => {
                  if (workOrderDetails.vendorName === '') {
                    setVendorNotProvidedAlert(true);
                  } else {
                    saveOrUpdateWorkJob(false);
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
                  if (workOrderDetails.vendorName === '') {
                    setVendorNotProvidedAlert(true);
                  } else {
                    saveOrUpdateWorkJob(true);
                  }
                }}
              >
                Save & New{' '}
              </Button>

              {/* <Button
                color="primary"
                variant="contained"
                className={[classes.saveButton, classes.footercontrols]}
                // onClick={() => {
                //   onPrintAndSaveClick();
                // }}
              >
                Save & Print{' '}
          </Button> */}

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
                handleOrderInDialog(false);
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
export default injectWithObserver(AddOrderIn);