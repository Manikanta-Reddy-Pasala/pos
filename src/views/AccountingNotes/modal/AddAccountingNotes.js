import React from 'react';
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
  Typography
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import * as moment from 'moment';
import { getPartiesAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import Arrowtopright from 'src/icons/Arrowtopright';
import Arrowbottomleft from 'src/icons/Arrowbottomleft';

var dateFormat = require('dateformat');

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
  blockLine: {
    display: 'inline-block'
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
  input: {
    width: '90%'
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
  nameList: {
    marginTop: '10px'
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

const AddNotes = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const { accountingNotesDialogOpen, isEdit, accountingNotes } = toJS(
    store.AccountingNotesStore
  );

  const {
    handleAccountingNotesModalClose,
    setNotes,
    setParty,
    setDate,
    saveData,
    updateData
  } = store.AccountingNotesStore;
  const [customerList, setcustomerList] = React.useState();
  const [customerName, setCustomerName] = React.useState('');

  const getCustomerList = async (value) => {
    setcustomerList(await getPartiesAutoCompleteList(value));
  };

  const handleCustomerClick = async (customer) => {
    setCustomerName(customer.name);
    setcustomerList([]);
    setParty(customer);
  };

  const saveDataOnClick = () => {
    if (accountingNotes.date === '') {
    } else if (accountingNotes.notes === '') {
    } else {
      if (isEdit) {
        updateData();
      } else {
        saveData();
      }
      handleAccountingNotesModalClose();
    }
  };

  const handleDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');
    setDate(date);
  };

  return (
    <div>
      <Dialog
        open={accountingNotesDialogOpen}
        onClose={handleAccountingNotesModalClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="product-modal-title">
          Add Accounting Notes
          <IconButton
            aria-label="close"
            onClick={handleAccountingNotesModalClose}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <Grid container direction="row" alignItems="stretch">
            <Grid item md={6} sm={12} className={'grid-padding'}>
              <FormControl fullWidth className={classes.datecol}>
                <Typography variant="subtitle1">Date</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="date"
                  className="customTextField"
                  value={accountingNotes.date}
                  onChange={(event) => handleDateChange(event.target.value)}
                />
              </FormControl>
            </Grid>

            <Grid item md={6} sm={12} className={'grid-padding'}>
              <FormControl fullWidth className={classes.datecol}>
                <Typography variant="subtitle1">Vendor/Customer</Typography>
                <div className={classes.blockLine}>
                  <div>
                    <TextField
                      fullWidth
                      placeholder="Select"
                      variant="outlined"
                      margin="dense"
                      value={customerName ? customerName : accountingNotes.partyName}
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

            <Grid item md={12} sm={12} className="grid-padding">
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
                  value={accountingNotes.notes}
                  error={accountingNotes.notes === ''}
                  helperText={
                    accountingNotes.notes === '' ? 'Please provide notes' : ''
                  }
                  onChange={(event) => setNotes(event.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            disabled={false}
            onClick={() => {
              saveDataOnClick();
            }}
          >
            {isEdit ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(AddNotes);