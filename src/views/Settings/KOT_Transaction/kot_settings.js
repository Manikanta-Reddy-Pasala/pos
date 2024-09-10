import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import useWindowDimensions from '../../../components/windowDimension';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';

import {
  makeStyles,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Switch
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import { createTheme } from '@material-ui/core/styles';
import TransactionSettingsNavigation from '../TransactionSettingsNavigation';
import { Grid, Col } from 'react-flexbox-grid';
import '../style.css';

const useStyles = makeStyles((theme) => ({
  gridpad: {
    margin: '0px',
    padding: '0px'
  },
  tickSize: {
    transform: 'scale(.8)'
  },
  root: {
    flexGrow: 1
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 18
  },
  containerLeft: {
    width: '12%',
    minHeight: '590px'
  },
  containerRight: {
    width: '88%'
  },
  formLabel: {
    paddingLeft: '30px',
    color: '#263238',
    fontWeight: 'bold'
  },
  formMultiLabel: {
    marginRight: '0px'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  containerInput: {
    flexGrow: 1
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
  },
  containerField: {
    marginTop: '16px'
  }
}));

const theme = createTheme({
  overrides: {
    MuiOutlinedInput: {
      root: {
        '& $notchedOutline': {
          padding: '0 !important'
        },
        '&:hover $notchedOutline': {
          padding: '0 !important'
        },
        '&$focused $notchedOutline': {
          padding: '0 !important',
          borderColor: '#2196f3'
        }
      }
    }
  }
});

const KOTSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const {
    setKotTxnSettingProperty,
    getKotTransSettingdetails,
    setEnableTouchKOTUI
  } = stores.KOTTransactionSettingsStore;

  const { kotTransSettingData } = toJS(stores.KOTTransactionSettingsStore);

  const { height } = useWindowDimensions();

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const { getInvoiceSettings } = stores.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(stores.PrinterSettingsStore);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getInvoiceSettings(localStorage.getItem('businessId'));
      getKotTransSettingdetails();
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getInvoiceSettings(localStorage.getItem('businessId'));

      /*if (
        salesTransSettingData &&
        salesTransSettingData.enableOnTxn &&
        salesTransSettingData.enableOnTxn.productLevel &&
        salesTransSettingData.enableOnTxn.productLevel.length > 0 &&
        salesTransSettingData.terms === ''
      ) {
        if (invoiceThermal.boolDefault) {
          setBillTerms(invoiceThermal.strTerms);
        } else if (invoiceRegular.boolDefault) {
          setBillTerms(invoiceRegular.strTerms);
        }
      }*/
    }

    fetchData();
  }, []);

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
            <TransactionSettingsNavigation
              navigation={navigate}
              active="kot_settings"
            />
          </Grid>
        </Card>
      </Col>
      <Col className="content-column" xs>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <>
            {isFeatureAvailable ? (
              <Paper
                className={classes.paper}
                style={{
                  height: height - 69 + 'px',
                  overflowX: 'hidden',
                  overflowY: 'auto'
                }}
              >
                <>
                  <Grid
                    item
                    xs={4}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: '10px',
                      marginBottom: '16px'
                    }}
                  >
                    <Grid
                      style={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={kotTransSettingData.enableTouchKOTUI}
                            onChange={(e) => {
                              setEnableTouchKOTUI(e.target.checked);
                            }}
                          />
                        }
                        label="Enable Touch KOT UI"
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    spacing={2}
                    style={{ margin: '0px', padding: '0px' }}
                  >
                    <Grid item xs={12} sm={12}>
                      <Typography variant="h5" style={{ marginBottom: '16px' }}>
                        Enable on Transaction
                      </Typography>
                    </Grid>
                    <Grid
                      container
                      direction="row"
                      style={{ margin: '0px', padding: '0px', display: 'flex' }}
                    >
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          style={{ marginBottom: '5px' }}
                        >
                          Product Level
                        </Typography>
                        <Divider variant="li" />
                        {kotTransSettingData.enableOnTxn.productLevel.map(
                          (prodEle, index) => (
                            <div>
                              <FormControl variant="standard">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={prodEle.enabled}
                                      name={prodEle.name}
                                      className={classes.tickSize}
                                      onChange={(e) =>
                                        setKotTxnSettingProperty(
                                          'enableOnTxn',
                                          'productLevel',
                                          index,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label={prodEle.displayName}
                                />
                              </FormControl>
                            </div>
                          )
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="h6"
                          style={{ marginBottom: '5px' }}
                        >
                          Bill Level
                        </Typography>
                        <Divider variant="li" />
                        {kotTransSettingData.enableOnTxn.billLevel.map(
                          (billEle, index) => (
                            <div>
                              <FormControl variant="standard">
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={billEle.enabled}
                                      name={billEle.name}
                                      className={classes.tickSize}
                                      onChange={(e) =>
                                        setKotTxnSettingProperty(
                                          'enableOnTxn',
                                          'billLevel',
                                          index,
                                          e.target.checked
                                        )
                                      }
                                    />
                                  }
                                  label={billEle.displayName}
                                />
                              </FormControl>
                            </div>
                          )
                        )}
                      </Grid>
                    </Grid>

                    {/*  <Grid item xs={12} sm={12}>
                    <Typography
                      variant="h5"
                      style={{ marginBottom: '16px', marginTop: '25px' }}
                    >
                      Display on Print
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction="row"
                    style={{ margin: '0px', padding: '0px', display: 'flex' }}
                  >
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" style={{ marginBottom: '5px' }}>
                        Product Level
                      </Typography>
                      <Divider variant="li" />
                      {kotTransSettingData.displayOnBill.productLevel.map(
                        (prodEle, index) => (
                          <div>
                            <FormControl variant="standard">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={prodEle.enabled}
                                    name={prodEle.name}
                                    className={classes.tickSize}
                                    onChange={(e) =>
                                      setKotTxnSettingProperty(
                                        'displayOnBill',
                                        'productLevel',
                                        index,
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label={prodEle.displayName}
                              />
                            </FormControl>
                          </div>
                        )
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" style={{ marginBottom: '5px' }}>
                        Bill Level
                      </Typography>
                      <Divider variant="li" />
                      {kotTransSettingData.displayOnBill.billLevel.map(
                        (billEle, index) => (
                          <div>
                            <FormControl variant="standard">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={billEle.enabled}
                                    name={billEle.name}
                                    className={classes.tickSize}
                                    onChange={(e) =>
                                      setKotTxnSettingProperty(
                                        'displayOnBill',
                                        'billLevel',
                                        index,
                                        e.target.checked
                                      )
                                    }
                                  />
                                }
                                label={billEle.displayName}
                              />
                            </FormControl>
                          </div>
                        )
                      )}
                    </Grid>
                              </Grid> */}

                    <Grid item xs={12} sm={6}></Grid>
                  </Grid>
                </>
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
export default injectWithObserver(KOTSettings);