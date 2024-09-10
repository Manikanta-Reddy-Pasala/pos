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
  Switch,
  TextField
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import { Grid, Col } from 'react-flexbox-grid';
import '../style.css';
import GeneralSettingsNavigation from '../GeneralSettingsNavigation';

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

const ProductSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const {
    setProductTxnSettingProperty,
    getProductTransSettingdetails,
    setAutoGenerateBarcode,
    setAutoGenerateBarcodeUniqueBarcodeForBatches,
    setExpiryNotificationDays,
    setShowStockAlertInDashboard
  } = stores.ProductTransactionSettingsStore;

  const { productTransSettingData } = toJS(
    stores.ProductTransactionSettingsStore
  );

  const { height } = useWindowDimensions();

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getProductTransSettingdetails();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
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
            <GeneralSettingsNavigation
              navigation={navigate}
              active="product_settings"
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
                  item
                  xs={4}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '16px'
                  }}
                >
                  <Grid
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      marginBottom: '16px'
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Switch
                          checked={productTransSettingData.autoGenerateBarcode}
                          onChange={(e) => {
                            setAutoGenerateBarcode(e.target.checked);
                          }}
                        />
                      }
                      label="Auto Generate Unique Barcode"
                    />
                  </Grid>
                  {productTransSettingData.autoGenerateBarcode === true && (
                    <Grid
                      style={{
                        display: 'flex',
                        flexDirection: 'row'
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              productTransSettingData.autoGenerateUniqueBarcodeForBatches
                            }
                            onChange={(e) => {
                              setAutoGenerateBarcodeUniqueBarcodeForBatches(
                                e.target.checked
                              );
                            }}
                          />
                        }
                        label="Generate Unique Barcodes for Batches"
                      />
                    </Grid>
                  )}
                </Grid>

                <Grid
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '16px'
                  }}
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={
                          productTransSettingData.showStockAlertInDashboard
                        }
                        onChange={(e) => {
                          setShowStockAlertInDashboard(e.target.checked);
                        }}
                      />
                    }
                    label="Show Low/Expiry Stock Alert (Dashboard)"
                  />
                </Grid>

                <Grid
                  item
                  xs={4}
                  style={{ marginTop: '16px', marginBottom: '16px' }}
                >
                  <Typography style={{ fontSize: '13px' }}>
                    Expiry Notification Days
                  </Typography>
                  <FormControlLabel
                    style={{ display: 'block', margin: '0' }}
                    control={
                      <TextField
                        style={{ width: '80%' }}
                        variant={'outlined'}
                        type="number"
                        value={productTransSettingData.expiryNotificationDays}
                        onChange={(e) => {
                          setExpiryNotificationDays(e.target.value);
                        }}
                        name="expirynotificationdays"
                      />
                    }
                  />
                </Grid>

                <Grid
                  container
                  direction="row"
                  spacing={1}
                  style={{ margin: '0px', padding: '0px' }}
                >
                  <Grid item xs={12} sm={3}>
                    <Typography variant="h6" style={{ marginBottom: '5px' }}>
                      Product Level Settings
                    </Typography>
                  </Grid>

                  <Grid itme xs={12} sm={6} />
                  <Grid item xs={12} sm={4}>
                    <Divider variant="li" />
                  </Grid>
                  <Grid itme xs={12} sm={8} />
                  <Grid item xs={12} sm={3}>
                    <Grid container>
                      {productTransSettingData.enableOnTxn.productLevel.map(
                        (prodEle, index) => (
                          <Grid item xs={12} key={index}>
                            <FormControl variant="standard">
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={prodEle.enabled}
                                    name={prodEle.name}
                                    className={classes.tickSize}
                                    onChange={(e) =>
                                      setProductTxnSettingProperty(
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
                          </Grid>
                        )
                      )}
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={6}></Grid>
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

export default injectWithObserver(ProductSettings);