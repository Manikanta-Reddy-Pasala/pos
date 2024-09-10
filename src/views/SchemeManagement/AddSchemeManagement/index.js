import React, { useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  Typography,
  Select,
  MenuItem,
  OutlinedInput
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { getPartiesAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import Arrowtopright from 'src/icons/Arrowtopright';
import Arrowbottomleft from 'src/icons/Arrowbottomleft';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import dateFormat from 'dateformat';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  marginSet: {
    marginTop: 'auto'
  },
  datecol: {
    width: '90%',
    marginLeft: '14px'
  },
  inputPad: {
    padding: '3px'
  },
  inputNumber: {
    padding: '3px',
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
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
    marginTop: '78px',
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
  fntClr: {
    color: '#616161'
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
      fontSize: '24px'
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
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const AddSchemeManagement = (props) => {
  const classes = useStyles();
  const store = useStore();

  const { fullWidth, maxWidth } = props;
  const {
    schemeManagementDialogOpen,
    schemeManagement,
    isEdit,
    paymentHistory,
    sequenceNumberFailureAlert
  } = toJS(store.SchemeManagementStore);
  const {
    handleSchemeManagementModalClose,
    setSchemeProperty,
    saveData,
    updateData,
    setParty,
    handleCloseSequenceNumberFailureAlert
  } = store.SchemeManagementStore;
  const { schemeTypesList } = toJS(store.SchemeTypesStore);
  const { getSchemeTypes } = store.SchemeTypesStore;

  const [customerList, setcustomerList] = React.useState();
  const [customerName, setCustomerName] = React.useState('');

  const [errorMessage, setErrorMessage] = React.useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const getCustomerList = async (value) => {
    setcustomerList(await getPartiesAutoCompleteList(value));
  };

  const handleCustomerClick = async (customer) => {
    setCustomerName(customer.name);
    setcustomerList([]);
    setParty(customer);
  };

  useEffect(() => {
    async function fetchData() {
      await getSchemeTypes();
    }

    fetchData();
  }, []);

  const getMonthlyInstallment = () => {
    let amount = 0;
    if (schemeManagement.depositAmount > 0 && schemeManagement.period > 0) {
      amount =
        parseFloat(schemeManagement.depositAmount) /
        parseFloat(schemeManagement.period);
    }
    return parseFloat(amount);
  };

  const getPaymentTypes = (data) => {
    let paymentType = '';
    if (data && data.paymentDetails) {
      for (let [key, value] of data.paymentDetails) {
        if (value !== 0) {
          paymentType += '<b>' + key + '</b>: ₹' + value + '<br/>';
        }
      }
    }
    return paymentType;
  };

  const validateSaveData = () => {
    if (
      schemeManagement.date === '' ||
      schemeManagement.date === undefined ||
      schemeManagement.date === null
    ) {
      setErrorMessage('Date cannot be left blank');
      setErrorAlertMessage(true);
    } else if (
      customerName === '' ||
      customerName === null
    ) {
      setErrorMessage('Customer cannot be left blank');
      setErrorAlertMessage(true);
    } else if (
      schemeManagement.customerId === '' ||
      schemeManagement.customerId === undefined ||
      schemeManagement.customerId === null
    ) {
      setErrorMessage(
        'Please add customer before creating a scheme from Add Customer feature'
      );
      setErrorAlertMessage(true);
    } else if (schemeManagement.depositAmount <= 0) {
      setErrorMessage('Deposit amount should be greater than 0');
      setErrorAlertMessage(true);
    } else {
      if (isEdit) {
        updateData();
      } else {
        saveData();
      }
    }
  };

  return (
    <div>
      <Dialog
        open={schemeManagementDialogOpen}
        onClose={handleSchemeManagementModalClose}
        fullWidth={fullWidth}
        maxWidth={'lg'}
      >
        <DialogTitle id="product-modal-title">
          {isEdit ? 'Edit Scheme' : 'Add Scheme'}
          <IconButton
            aria-label="close"
            onClick={handleSchemeManagementModalClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item md={12} sm={12} className={'grid-padding'}>
              <FormControl fullWidth>
                <Typography variant="subtitle1">Customer *</Typography>
                <div>
                  <div>
                    <TextField
                      fullWidth
                      placeholder="Select"
                      variant="outlined"
                      margin="dense"
                      value={
                        customerName
                          ? customerName
                          : schemeManagement.customerName
                      }
                      onChange={(e) => {
                        if (e.target.value !== customerName) {
                          setParty('');
                          setCustomerName(e.target.value);
                        }
                        getCustomerList(e.target.value);
                      }}
                    />
                    {customerList && customerList.length > 0 ? (
                      <>
                        <ul
                          className={classes.listbox}
                          style={{ width: '90%' }}
                        >
                          <li>
                            <Grid container justifyContent="space-between">
                              {customerList.length === 1 &&
                              customerList[0].name === '' ? (
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
                          {customerList.length === 1 &&
                          customerList[0].name === '' ? (
                            <li></li>
                          ) : (
                            <div>
                              {customerList.map((option, index) => (
                                <li
                                  key={`${index}vendor`}
                                  style={{ padding: 10, cursor: 'pointer' }}
                                  onClick={() => {
                                    handleCustomerClick(option);
                                  }}
                                >
                                  <Grid
                                    container
                                    justifyContent="space-between"
                                  >
                                    <Grid item style={{ color: 'black' }}>
                                      {option.name}
                                      <br />
                                      {option.phoneNo}
                                      <br />
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
                                        {parseFloat(option.balance).toFixed(2)}
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
                  </div>
                </div>
              </FormControl>
            </Grid>

            <Grid
              item
              md={6}
              sm={12}
              className={('grid-padding', classes.marginSet)}
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth className={classes.datecol}>
                <Typography variant="subtitle1">Date</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="date"
                  className="customTextField"
                  value={schemeManagement.date}
                  onChange={(event) =>
                    setSchemeProperty('date', event.target.value)
                  }
                  InputProps={{
                    className: classes.inputPad
                  }}
                />
              </FormControl>
            </Grid>

            <Grid
              item
              md={6}
              sm={12}
              className={'grid-padding'}
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1" className={classes.fntClr}>
                  Type
                </Typography>
                <>
                  {schemeManagement.type === '' &&
                    schemeTypesList &&
                    schemeTypesList.length > 0 &&
                    setSchemeProperty('type', schemeTypesList[0].name)}
                  <Select
                    displayEmpty
                    className={classes.fntClr}
                    style={{ marginTop: '8px', height: '75%' }}
                    value={
                      schemeManagement.type
                        ? schemeManagement.type
                        : schemeTypesList && schemeTypesList.length > 0
                        ? schemeTypesList[0].name
                        : ''
                    }
                    input={
                      <OutlinedInput style={{ width: '100%', height: '75%' }} />
                    }
                    onChange={(e) => {
                      setSchemeProperty('type', e.target.value);
                    }}
                  >
                    {schemeTypesList &&
                      schemeTypesList.length > 0 &&
                      schemeTypesList.map((option, index) => (
                        <MenuItem value={option.name}>{option.name}</MenuItem>
                      ))}
                  </Select>
                </>
              </FormControl>
            </Grid>

            <Grid
              item
              md={8}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Period (in months)</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  className="customTextField"
                  value={schemeManagement.period}
                  onChange={(event) => {
                    setSchemeProperty('period', event.target.value);
                  }}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                />
              </FormControl>
            </Grid>

            <Grid
              item
              md={6}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Deposit Amount</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  className="customTextField"
                  value={schemeManagement.depositAmount}
                  onChange={(event) => {
                    setSchemeProperty('depositAmount', event.target.value);
                  }}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                />
              </FormControl>
            </Grid>

            <Grid
              item
              md={6}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">
                  Discount/Contribution
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="number"
                  className="customTextField"
                  value={schemeManagement.discountContribution}
                  onChange={(event) => {
                    setSchemeProperty(
                      'discountContribution',
                      event.target.value
                    );
                  }}
                  InputProps={{
                    className: classes.inputNumber
                  }}
                />
              </FormControl>
            </Grid>

            <Grid
              item
              md={12}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Notes</Typography>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  margin="dense"
                  type="text"
                  minRows="5"
                  className="customTextField"
                  value={schemeManagement.notes}
                  onChange={(event) =>
                    setSchemeProperty('notes', event.target.value)
                  }
                />
              </FormControl>
            </Grid>

            {paymentHistory && paymentHistory.length > 0 && (
              <Grid
                item
                md={12}
                sm={12}
                className="grid-padding"
                style={{ marginTop: '16px' }}
              >
                <Typography variant="subtitle1">Payment History</Typography>
                <TableContainer>
                  <Table className={classes.table} aria-label="spanning table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Transaction Date</TableCell>
                        <TableCell align="right">No</TableCell>
                        <TableCell align="right">Linked Amount</TableCell>
                        <TableCell align="right">Payment Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paymentHistory.map((row) => {
                        return (
                          <TableRow key={row.transactionNumber}>
                            <TableCell>
                              {dateFormat(row.date, 'yyyy-mm-dd')}
                            </TableCell>
                            <TableCell align="right">
                              {row.sequenceNumber}
                            </TableCell>
                            <TableCell align="right">{row.total}</TableCell>
                            <TableCell align="right">
                              <p
                                style={{
                                  textTransform: 'capitalize'
                                }}
                                dangerouslySetInnerHTML={{
                                  __html: getPaymentTypes(row)
                                }}
                              ></p>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <b style={{ marginRight: '20px' }}>
            MONTHLY INSTALLMENT: {getMonthlyInstallment()}
          </b>
          <b style={{ marginRight: '20px' }}>TOTAL: {schemeManagement.total}</b>
          <b style={{ marginRight: '20px' }}>
            BALANCE: {parseFloat(schemeManagement.balance)}
          </b>
          {schemeManagement.schemeOrderType === 'open' && (
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                validateSaveData();
              }}
            >
              Save
            </Button>
          )}

          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleSchemeManagementModalClose();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
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
            We are unable to reach our Server to get next sequence No due to
            Network fluctuations. Please try again!
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

export default InjectObserver(AddSchemeManagement);