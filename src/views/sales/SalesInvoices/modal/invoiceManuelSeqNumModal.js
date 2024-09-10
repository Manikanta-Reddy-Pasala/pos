import React, { useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Button,
  withStyles,
  Grid,
  FormControl,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Typography
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import { toJS } from 'mobx';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import InvoiceManuelSeqNumCheck from './invoiceManuelSeqNumCheck';
import { useState } from 'react';
import * as Bd from 'src/components/SelectedBusiness';

const useStyles = makeStyles((theme) => ({
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

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const InvoiceManuelSeqNumModal = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const { openInvoiceNumModal, manualSequenceNumber } = toJS(
    store.SalesAddStore
  );

  const {
    handleInvoiceNumModalClose,
    checkSaleSequenceNumber,
    setSaleManualEditSequenceNumber,
    setInoicePrefix,
    setInvoiceSubPrefix
  } = store.SalesAddStore;
  const [isInvoiceManual, setIsInvoiceManual] = useState(false);

  const { getTransactionData } = store.TransactionStore;
  const { transaction } = toJS(store.TransactionStore);

  const [prefixes, setPrefixes] = React.useState('##');
  const [subPrefixes, setSubPrefixes] = React.useState('##');
  const [prefixesMenuOpenStatus, setPrefixesMenuOpenStatus] =
    React.useState(false);
  const [subPrefixesMenuOpenStatus, setSubPrefixesMenuOpenStatus] =
    React.useState(false);

  const handleRadioManRAuto = (e) => {
    e.target.value === 'invoiceNumManual'
      ? setIsInvoiceManual(true)
      : setIsInvoiceManual(false);
  };

  useEffect(() => {
    async function fetchData() {
      await getTransactionData();
      const businessData = await Bd.getBusinessData();
      const businessId = businessData.businessId;
      if (
        localStorage.getItem(businessId + '_saleDefaultPrefix') !== '' &&
        localStorage.getItem(businessId + '_saleDefaultPrefix') !== undefined &&
        localStorage.getItem(businessId + '_saleDefaultPrefix') !== null
      ) {
        const defaultPrefix = localStorage.getItem(
          businessId + '_saleDefaultPrefix'
        );
        setInoicePrefix(defaultPrefix);
        setPrefixes(defaultPrefix);
      }

      if (
        localStorage.getItem(businessId + '_saleDefaultSubPrefix') !== '' &&
        localStorage.getItem(businessId + '_saleDefaultSubPrefix') !==
          undefined &&
        localStorage.getItem(businessId + '_saleDefaultSubPrefix') !== null
      ) {
        const defaultSubPrefix = localStorage.getItem(
          businessId + '_saleDefaultSubPrefix'
        );
        setInvoiceSubPrefix(defaultSubPrefix);
        setSubPrefixes(defaultSubPrefix);
      }
    }

    fetchData();
  }, []);

  const handleChangePrefixes = (value) => {
    setInoicePrefix(value.prefix);
    setPrefixes(value.prefix);
  };

  const handleChangeSubPrefixes = (value) => {
    setInvoiceSubPrefix(value);
    setSubPrefixes(value);
  };

  return (
    <Dialog
      open={openInvoiceNumModal}
      onClose={handleInvoiceNumModalClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
    >
      <DialogTitle id="product-modal-title" styel={{ color: 'red' }}>
        <span style={{ color: 'red' }}>Invoice Number</span>
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ fontSize: 13 }}>
              Your invoice numbers are set on auto-generat mode.
            </Typography>
          </Grid>
          <Grid item md={12} sm={12} className="grid-padding">
            <Typography style={{ fontSize: 13 }}>
              Are you sure about changing the setting ?
            </Typography>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item md={12} sm={12} className="grid-padding">
            <FormControl fullWidth>
              <RadioGroup
                direction="column"
                name="invoiceManualRAuto"
                defaultValue="invoiceNumAuotGen"
                onChange={handleRadioManRAuto}
              >
                <FormControlLabel
                  labelPlacement="end"
                  value="invoiceNumAuotGen"
                  control={<Radio size="small" />}
                  label={
                    <Typography style={{ fontSize: 13 }}>
                      Continue auto generating invoice numbers
                    </Typography>
                  }
                />
                <FormControlLabel
                  value="invoiceNumManual"
                  labelPlacement="end"
                  control={<Radio size="small" />}
                  label={
                    <Typography style={{ fontSize: 13 }}>
                      I will add them manually for the current transaction
                    </Typography>
                  }
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {isInvoiceManual && (
            <>
              <Grid item xs={12} className="grid-padding">
                <Grid container direction="row">
                  <Grid item xs="12" sm={5}>
                    <Typography style={{ fontSize: 13 }}>
                      Invoice Number
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} className="grid-padding">
                <Grid container direction="row">
                  {transaction.sales.prefixSequence.length > 0 && (
                    <Grid item xs={12} sm={5}>
                      <div>
                        <TextField
                          style={{ width: '75px' }}
                          value={prefixes}
                          inputProps={{
                            style: {
                              padding: 10
                            }
                          }}
                          className={classes.selectData}
                          variant="standard"
                          onClick={(e) => {
                            setPrefixesMenuOpenStatus(true);
                            setSubPrefixesMenuOpenStatus(false);
                          }}
                        ></TextField>

                        {prefixesMenuOpenStatus ? (
                          <>
                            <ul className={classes.PlaceOfsupplyListbox}>
                              <div>
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`prefixes`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    onClick={(e) => {
                                      handleChangePrefixes('##');
                                      setPrefixesMenuOpenStatus(false);
                                    }}
                                  >
                                    ##
                                  </Button>
                                </li>
                                {transaction.sales.prefixSequence
                                  ? transaction.sales.prefixSequence.map(
                                      (option, index) => (
                                        <li
                                          style={{
                                            cursor: 'pointer'
                                          }}
                                          key={`${index}prefixes`}
                                        >
                                          <Button
                                            className={classes.liBtn}
                                            disableRipple
                                            onClick={(e) => {
                                              handleChangePrefixes(option);
                                              setPrefixesMenuOpenStatus(false);
                                            }}
                                          >
                                            {option.prefix}
                                          </Button>
                                        </li>
                                      )
                                    )
                                  : ''}
                              </div>
                            </ul>
                          </>
                        ) : null}
                      </div>
                    </Grid>
                  )}
                  {transaction.sales.subPrefixesList.length > 0 && (
                    <Grid item xs={12} sm={5}>
                      <div>
                        <TextField
                          style={{ width: '75px' }}
                          value={subPrefixes}
                          inputProps={{
                            style: {
                              padding: 10
                            }
                          }}
                          className={classes.selectData}
                          variant="standard"
                          onClick={(e) => {
                            setSubPrefixesMenuOpenStatus(true);
                            setPrefixesMenuOpenStatus(false);
                          }}
                        ></TextField>

                        {subPrefixesMenuOpenStatus ? (
                          <>
                            <ul className={classes.PlaceOfsupplyListbox}>
                              <div>
                                <li
                                  style={{ cursor: 'pointer' }}
                                  key={`prefixes`}
                                >
                                  <Button
                                    className={classes.liBtn}
                                    disableRipple
                                    onClick={(e) => {
                                      handleChangeSubPrefixes('##');
                                      setSubPrefixesMenuOpenStatus(false);
                                    }}
                                  >
                                    ##
                                  </Button>
                                </li>
                                {transaction.sales.subPrefixesList
                                  ? transaction.sales.subPrefixesList.map(
                                      (option, index) => (
                                        <li
                                          style={{
                                            cursor: 'pointer'
                                          }}
                                          key={`${index}prefixes`}
                                        >
                                          <Button
                                            className={classes.liBtn}
                                            disableRipple
                                            onClick={(e) => {
                                              handleChangeSubPrefixes(option);
                                              setSubPrefixesMenuOpenStatus(
                                                false
                                              );
                                            }}
                                          >
                                            {option}
                                          </Button>
                                        </li>
                                      )
                                    )
                                  : ''}
                              </div>
                            </ul>
                          </>
                        ) : null}
                      </div>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      variant={'standard'}
                      margin="dense"
                      type="number"
                      value={manualSequenceNumber}
                      onChange={(event) =>
                        setSaleManualEditSequenceNumber(event.target.value)
                      }
                    ></TextField>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <InvoiceManuelSeqNumCheck />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            checkSaleSequenceNumber();
          }}
        >
          Save
        </Button>
        <Button
          color="secondary"
          variant="outlined"
          onClick={() => {
            handleInvoiceNumModalClose();
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InjectObserver(InvoiceManuelSeqNumModal);