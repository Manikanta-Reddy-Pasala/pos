import React from 'react';
import { TextField } from '@material-ui/core';
import Page from 'src/components/Page';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { Grid, makeStyles, Typography } from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  PlaceOfsupplyListbox: {
    minWidth: '18%',
    margin: 0,
    padding: 5,
    zIndex: 1,
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
    width: '40%',
    justifyContent: 'start',
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
  addPrefixbtn: {
    fontSize: 'small',
    color: '#EF5350'
  },
  subHeader: {
    color: '#4A83FB',
    textDecoration: 'underline',
    marginTop: '25px',
    marginBottom: '10px',
    fontWeight: 500
  },
  checkboxCenterAlign: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end'
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 20,
    float: 'right'
  }
}));

const TallySequenceNumber = () => {
  const classes = useStyles();
  const stores = useStore();

  const { setTallySequenceNumbersProperty } = stores.TallySequenceNumbersStore;

  const { tallySequenceNumbers } = toJS(stores.TallySequenceNumbersStore);

  const [receiptPrefixesVal, setreceiptPrefixesVal] = React.useState('');
  const [receiptSequenceNoVal, setreceiptSequenceNoVal] = React.useState(1);

  const [paymentPrefixesVal, setpaymentPrefixesVal] = React.useState('');
  const [paymentSequenceNoVal, setpaymentSequenceNoVal] = React.useState(1);

  return (
    <Page className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Typography
            variant="h5"
            style={{ marginTop: '50px', marginBottom: '50px' }}
          >
            tallySequenceNumbers Prefixes and Sequence No
          </Typography>

          <Typography variant="h6" className={classes.subHeader}>
            Tally Receipt
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    tallySequenceNumbers && tallySequenceNumbers.receipt && tallySequenceNumbers.receipt.prefixSequence &&
                    tallySequenceNumbers.receipt.prefixSequence.length > 0 &&
                    tallySequenceNumbers.receipt.prefixSequence[0].prefix !== ''
                      ? tallySequenceNumbers.receipt.prefixSequence[0].prefix
                      : receiptPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== receiptPrefixesVal) {
                      if (
                        tallySequenceNumbers.receipt.prefixSequence &&
                        tallySequenceNumbers.receipt.prefixSequence.length > 0
                      ) {
                        setTallySequenceNumbersProperty(
                          'receipt',
                          'prefixSequence',
                          e.target.value,
                          tallySequenceNumbers.receipt.prefixSequence[0].sequenceNumber
                        );
                      } else {
                        setTallySequenceNumbersProperty(
                          'receipt',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setreceiptPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    tallySequenceNumbers && tallySequenceNumbers.receipt && tallySequenceNumbers.receipt.prefixSequence &&
                    tallySequenceNumbers.receipt.prefixSequence.length > 0 &&
                    tallySequenceNumbers.receipt.prefixSequence[0].sequenceNumber !== 1
                      ? tallySequenceNumbers.receipt.prefixSequence[0].sequenceNumber
                      : receiptSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== receiptSequenceNoVal) {
                      if (
                        tallySequenceNumbers && tallySequenceNumbers.receipt.prefixSequence &&
                        tallySequenceNumbers.receipt.prefixSequence.length > 0
                      ) {
                        setTallySequenceNumbersProperty(
                          'receipt',
                          'prefixSequence',
                          tallySequenceNumbers.receipt.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        setTallySequenceNumbersProperty(
                          'receipt',
                          'prefixSequence',
                          receiptPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setreceiptSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>

          <Typography variant="h6" className={classes.subHeader}>
            Tally Payment
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>Prefix</Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  placeholder="Add Prefix"
                  value={
                    tallySequenceNumbers && tallySequenceNumbers.payment && tallySequenceNumbers.payment.prefixSequence &&
                    tallySequenceNumbers.payment.prefixSequence.length > 0 &&
                    tallySequenceNumbers.payment.prefixSequence[0].prefix !== ''
                      ? tallySequenceNumbers.payment.prefixSequence[0].prefix
                      : paymentPrefixesVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== paymentPrefixesVal) {
                      if (
                        tallySequenceNumbers && tallySequenceNumbers.payment && tallySequenceNumbers.payment.prefixSequence &&
                        tallySequenceNumbers.payment.prefixSequence.length > 0
                      ) {
                        setTallySequenceNumbersProperty(
                          'payment',
                          'prefixSequence',
                          e.target.value,
                          tallySequenceNumbers.payment.prefixSequence[0].sequenceNumber
                        );
                      } else {
                        setTallySequenceNumbersProperty(
                          'payment',
                          'prefixSequence',
                          e.target.value,
                          1
                        );
                      }
                    }
                    setpaymentPrefixesVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
            <Grid item xs={4}>
              <div>
                <Typography style={{ fontSize: '13px' }}>
                  To Start With
                </Typography>

                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  style={{ width: '80%' }}
                  variant="outlined"
                  type="number"
                  placeholder="Add Sequence No"
                  value={
                    tallySequenceNumbers && tallySequenceNumbers.payment && tallySequenceNumbers.payment.prefixSequence &&
                    tallySequenceNumbers.payment.prefixSequence.length > 0 &&
                    tallySequenceNumbers.payment.prefixSequence[0].sequenceNumber !== 1
                      ? tallySequenceNumbers.payment.prefixSequence[0].sequenceNumber
                      : paymentSequenceNoVal
                  }
                  onChange={(e) => {
                    if (e.target.value !== paymentSequenceNoVal) {
                      if (
                        tallySequenceNumbers && tallySequenceNumbers.payment && tallySequenceNumbers.payment.prefixSequence &&
                        tallySequenceNumbers.payment.prefixSequence.length > 0
                      ) {
                        setTallySequenceNumbersProperty(
                          'payment',
                          'prefixSequence',
                          tallySequenceNumbers.payment.prefixSequence[0].prefix,
                          e.target.value
                        );
                      } else {
                        setTallySequenceNumbersProperty(
                          'payment',
                          'prefixSequence',
                          paymentPrefixesVal,
                          e.target.value
                        );
                      }
                    }
                    setpaymentSequenceNoVal(e.target.value);
                  }}
                  className={classes.addPrefixbtn}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Page>
  );
};

export default injectWithObserver(TallySequenceNumber);