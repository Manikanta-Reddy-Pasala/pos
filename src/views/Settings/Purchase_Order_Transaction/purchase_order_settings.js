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
  TextField
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
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
  formLabel: {
    paddingLeft: '30px',
    color: '#263238',
    fontWeight: 'bold'
  },
  formMultiLabel: {
    marginRight: '0px'
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

const PurchaseOrderSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const {
    setPurchaseOrderTxnSettingProperty,
    getPurchaseOrderTransSettingdetails,
    setBillTerms
  } = stores.PurchaseOrderTransSettingsStore;

  const { purchaseOrderTransSettingData } = toJS(
    stores.PurchaseOrderTransSettingsStore
  );

  const { height } = useWindowDimensions();

  const { getInvoiceSettings } = stores.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(stores.PrinterSettingsStore);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getInvoiceSettings(localStorage.getItem('businessId'));
      getPurchaseOrderTransSettingdetails();
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    async function fetchData() {
      await getInvoiceSettings(localStorage.getItem('businessId'));

      /*if (
        purchaseOrderTransSettingData &&
        purchaseOrderTransSettingData.enableOnTxn &&
        purchaseOrderTransSettingData.enableOnTxn.productLevel &&
        purchaseOrderTransSettingData.enableOnTxn.productLevel.length > 0 &&
        purchaseOrderTransSettingData.terms === ''
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
              active="purchase_order_settings"
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
                <Grid
                  container
                  direction="row"
                  spacing={1}
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
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" style={{ marginBottom: '5px' }}>
                        Product Level
                      </Typography>
                      <Divider variant="li" />
                      {purchaseOrderTransSettingData.enableOnTxn.productLevel.map(
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
                                      setPurchaseOrderTxnSettingProperty(
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
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" style={{ marginBottom: '5px' }}>
                        Bill Level
                      </Typography>
                      <Divider variant="li" />

                      {purchaseOrderTransSettingData.enableOnTxn.billLevel.map(
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
                                      setPurchaseOrderTxnSettingProperty(
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

                  <Grid item xs={12} sm={12}>
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
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" style={{ marginBottom: '5px' }}>
                        Product Level
                      </Typography>
                      <Divider variant="li" />
                      {purchaseOrderTransSettingData.displayOnBill.productLevel.map(
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
                                      setPurchaseOrderTxnSettingProperty(
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
                    <Grid item xs={12} sm={3}>
                      <Typography variant="h6" style={{ marginBottom: '5px' }}>
                        Bill Level
                      </Typography>
                      <Divider variant="li" />
                      {purchaseOrderTransSettingData.displayOnBill.billLevel.map(
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
                                      setPurchaseOrderTxnSettingProperty(
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
                  </Grid>
                  {purchaseOrderTransSettingData.enableOnTxn.productLevel &&
                    purchaseOrderTransSettingData.enableOnTxn.productLevel
                      .length > 0 && (
                      <Grid container className={classes.containerField}>
                        <Typography
                          variant="h5"
                          style={{ marginBottom: '16px' }}
                        >
                          Terms and Conditions
                        </Typography>
                        <Grid style={{ display: 'flex' }} item xs={12}>
                          <MuiThemeProvider theme={theme}>
                            <TextField
                              multiline
                              rows={'3'}
                              variant="outlined"
                              style={{ width: '100%' }}
                              value={purchaseOrderTransSettingData.terms}
                              onChange={(e) => {
                                setBillTerms(e.target.value);
                              }}
                            />
                          </MuiThemeProvider>
                        </Grid>
                      </Grid>
                    )}
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

export default injectWithObserver(PurchaseOrderSettings);
