import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  MenuItem,
  TextField,
  Select,
  OutlinedInput
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import useWindowDimensions from '../../../components/windowDimension';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';

import {
  makeStyles,
  Typography,
  FormControlLabel,
  Switch
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import { Grid, Col } from 'react-flexbox-grid';
import '../style.css';
import GeneralSettingsNavigation from '../GeneralSettingsNavigation';
import { getCustomerName } from 'src/names/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 18
    // textAlign: 'center',
  },
  containerLeft: {
    width: '12%',
    minHeight: '590px'
  },
  containerRight: {
    width: '88%'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  flex: {
    display: 'flex'
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  p: {
    fontWeight: 'bold'
  },
  card: {
    height: '100%'
  }
}));

const GeneralTransaction = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const {
    setAutoPushEInvoice,
    getTransactionData,
    setMultiDeviceBillingSupport,
    setEWayAmount,
    setEnableEway,
    setEnableEInvoice,
    setRoundingConfiguration,
    setEnableCustomer,
    setEnableVendor,
    setPurchasePriceCode
  } = stores.TransactionStore;

  const { transaction } = toJS(stores.TransactionStore);

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const { height } = useWindowDimensions();

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await getTransactionData();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, [getTransactionData]);

  const rounding = ['Nearest 50', 'Upward Rounding', 'Downward Rounding'];

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Settings')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <Grid fluid className="app-main" style={{ height: height - 50 }}>
      <Col className="nav-column" xs={12} sm={2}>
        <Card className={classes.card}>
          <Grid container className={classes.cardList}>
            <GeneralSettingsNavigation
              navigation={navigate}
              active="generaltransactionsetting"
            />
          </Grid>
        </Card>
      </Col>
      <Col className="content-column" xs>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <>
            {isFeatureAvailable &&
            localStorage.getItem('isAdmin') === 'true' ? (
              <Paper
                className={classes.paper}
                style={{ height: height - 62 + 'px', overflowY: 'auto' }}
              >
                <Typography variant="h5" style={{ marginBottom: '10px' }}>
                  General Transaction Settings
                </Typography>
                <Grid container>
                  <Grid item xs={4}></Grid>
                  {/*<Grid item xs={12} style={{ marginTop: '16px' }}>
                    <FormControlLabel
                      style={{ display: 'block' }}
                      control={
                        <Switch
                          checked={transaction.multiDeviceBillingSupport}
                          onChange={(e) => {
                            setMultiDeviceBillingSupport(e.target.checked);
                          }}
                          name="multiDeviceBillingSupport"
                        />
                      }
                      label="Multi Device Billing Support"
                    />
                    </Grid>*/}

                  <Grid
                    item
                    xs={4}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '25px'
                    }}
                  >
                    <Grid>
                      <Typography style={{ fontSize: '13px' }}>
                        Configure Rounding
                      </Typography>
                    </Grid>
                    <Grid>
                      <Select
                        displayEmpty
                        value={transaction.roundingConfiguration}
                        input={<OutlinedInput style={{ width: '80%' }} />}
                        inputProps={{ 'aria-label': 'Without label' }}
                        onChange={(e) => {
                          if ('Select' !== e.target.value) {
                            setRoundingConfiguration(e.target.value);
                          }
                        }}
                      >
                        {rounding.map((e, index) => (
                          <MenuItem key={index} value={e}>
                            {e}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </Grid>

                  <Grid item xs={4} style={{ marginTop: '16px' }}></Grid>

                  <Grid item xs={12}>
                    <Typography variant="h5" style={{ marginTop: '30px' }}>
                      E-Way and E-Invoice
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <Grid>
                      <Typography
                        style={{ fontSize: '13px', marginTop: '16px' }}
                      >
                        Enable / Disable
                      </Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', flexDirection: 'row' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={transaction.enableEway}
                            onChange={(e) => {
                              setEnableEway(e.target.checked);
                            }}
                            name="enableEway"
                          />
                        }
                        label="E-Way"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={transaction.enableEinvoice}
                            onChange={(e) => {
                              setEnableEInvoice(e.target.checked);
                            }}
                            name="enableEInvoice"
                          />
                        }
                        label="E-Invoice"
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    {transaction.enableEway && (
                      <Grid item xs={4} style={{ marginTop: '16px' }}>
                        <Typography style={{ fontSize: '13px' }}>
                          E-Way Minimum Amount
                        </Typography>
                        <FormControlLabel
                          style={{ display: 'block', margin: '0' }}
                          control={
                            <TextField
                              style={{ width: '80%' }}
                              variant={'outlined'}
                              value={transaction.enableEWayAmountLimit}
                              onChange={(e) => {
                                setEWayAmount(e.target.value);
                              }}
                              name="eWayAmount"
                              type="number"
                            />
                          }
                        />
                      </Grid>
                    )}

                    {transaction.enableEinvoice && (
                      <Grid item xs={4}>
                        <FormControlLabel
                          style={{
                            display: 'block',
                            marginTop: '16px'
                          }}
                          control={
                            <Switch
                              checked={transaction.autoPushEInvoice}
                              onChange={(e) => {
                                setAutoPushEInvoice(e.target.checked);
                              }}
                              name="autoPushEInvoice"
                            />
                          }
                          label="Auto Push E-Invoice"
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Grid item xs={4} style={{ marginTop: '16px' }}></Grid>

                  <Grid item xs={12}>
                    <Typography variant="h5" style={{ marginTop: '30px' }}>
                      Customer And Vendor
                    </Typography>
                  </Grid>

                  <Grid
                    item
                    xs={4}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <Grid>
                      <Typography
                        style={{ fontSize: '13px', marginTop: '16px' }}
                      >
                        Enable / Disable
                      </Typography>
                    </Grid>
                    <Grid style={{ display: 'flex', flexDirection: 'row' }}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={transaction.enableCustomer}
                            onChange={(e) => {
                              setEnableCustomer(e.target.checked);
                            }}
                            name="enableCustomer"
                          />
                        }
                        label={'Add ' + getCustomerName()}
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={transaction.enableVendor}
                            onChange={(e) => {
                              setEnableVendor(e.target.checked);
                            }}
                            name="enableVendor"
                          />
                        }
                        label="Add Vendor"
                      />
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="h5" style={{ marginTop: '30px' }}>
                      Product
                    </Typography>
                  </Grid>

                  <Grid item xs={12} style={{ marginTop: '16px' }}>
                    <Typography style={{ fontSize: '13px' }}>
                      Purchase Price Code
                    </Typography>
                    <FormControlLabel
                      style={{ display: 'block', margin: '0' }}
                      control={
                        <TextField
                          style={{ width: '50%' }}
                          variant={'outlined'}
                          value={transaction.purchasePriceCode}
                          onChange={(e) => {
                            console.log('entering');
                            setPurchasePriceCode(e.target.value);
                          }}
                          name="purchasePriceCode"
                        />
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            ) : (
              <NoPermission />
            )}
          </>
        )}
      </Col>
    </Grid>
  );
};

export default injectWithObserver(GeneralTransaction);