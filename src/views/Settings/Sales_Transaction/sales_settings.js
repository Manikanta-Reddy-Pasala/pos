import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, FormGroup, TextField } from '@material-ui/core';
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
  Select,
  OutlinedInput,
  MenuItem
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

const SalesSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const {
    setSalesTxnSettingProperty,
    getSalesTransSettingdetails,
    setBillTitle,
    setBillTerms,
    setMenuType,
    setFeatureProperty
  } = stores.SalesTransSettingsStore;

  const { salesTransSettingData } = toJS(stores.SalesTransSettingsStore);

  const { height } = useWindowDimensions();

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const { getInvoiceSettings } = stores.PrinterSettingsStore;
  const { invoiceRegular, invoiceThermal } = toJS(stores.PrinterSettingsStore);

  const menuTypeList = ['AC', 'Non-AC', 'Self Service'];

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getInvoiceSettings(localStorage.getItem('businessId'));
      getSalesTransSettingdetails();
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
              active="sales_settings"
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
                {salesTransSettingData.enableOnTxn.productLevel &&
                  salesTransSettingData.enableOnTxn.productLevel.length > 0 && (
                    <>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '16px'
                        }}
                      >
                        <Grid></Grid>
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
                                  salesTransSettingData.updateRawMaterialsStock
                                }
                                onChange={(e) => {
                                  setFeatureProperty(
                                    'updateRawMaterialsStock',
                                    e.target.checked
                                  );
                                }}
                              />
                            }
                            label="Update Raw materials Stock on Sale"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '10px'
                        }}
                      >
                        <Grid></Grid>
                        <Grid
                          style={{
                            display: 'flex',
                            flexDirection: 'row'
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={salesTransSettingData.enableTDS}
                                onChange={(e) => {
                                  setFeatureProperty(
                                    'enableTDS',
                                    e.target.checked
                                  );
                                }}
                              />
                            }
                            label="Enable TDS"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '10px'
                        }}
                      >
                        <Grid></Grid>
                        <Grid
                          style={{
                            display: 'flex',
                            flexDirection: 'row'
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={salesTransSettingData.enableTCS}
                                onChange={(e) => {
                                  setFeatureProperty(
                                    'enableTCS',
                                    e.target.checked
                                  );
                                }}
                              />
                            }
                            label="Enable TCS"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '10px'
                        }}
                      >
                        <Grid></Grid>
                        <Grid
                          style={{
                            display: 'flex',
                            flexDirection: 'row'
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={salesTransSettingData.enableShipTo}
                                onChange={(e) => {
                                  setFeatureProperty(
                                    'enableShipTo',
                                    e.target.checked
                                  );
                                }}
                              />
                            }
                            label="Enable Ship To"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '10px'
                        }}
                      >
                        <Grid></Grid>
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
                                  salesTransSettingData.enableBuyerOtherThanConsignee
                                }
                                onChange={(e) => {
                                  setFeatureProperty(
                                    'enableBuyerOtherThanConsignee',
                                    e.target.checked
                                  );
                                }}
                              />
                            }
                            label="Enable Buyer (Other than Consignee)"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '10px'
                        }}
                      >
                        <Grid></Grid>
                        <Grid
                          style={{
                            display: 'flex',
                            flexDirection: 'row'
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={salesTransSettingData.enableSalesMan}
                                onChange={(e) => {
                                  setFeatureProperty(
                                    'enableSalesMan',
                                    e.target.checked
                                  );
                                }}
                              />
                            }
                            label="Enable Sales Man"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '10px'
                        }}
                      >
                        <Grid></Grid>
                        <Grid
                          style={{
                            display: 'flex',
                            flexDirection: 'row'
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Switch
                                checked={salesTransSettingData.enableExport}
                                onChange={(e) => {
                                  setFeatureProperty(
                                    'enableExport',
                                    e.target.checked
                                  );
                                }}
                              />
                            }
                            label="Enable Export"
                          />
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginTop: '10px'
                        }}
                      >
                        <Grid></Grid>
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
                                checked={
                                  salesTransSettingData.enableNegativeStockAlert
                                }
                                onChange={(e) => {
                                  setFeatureProperty(
                                    'enableNegativeStockAlert',
                                    e.target.checked
                                  );
                                }}
                              />
                            }
                            label="Enable Negative Stock Alert"
                          />
                        </Grid>
                      </Grid>
                      {String(
                        localStorage.getItem('isHotelOrRestaurant')
                      ).toLowerCase() === 'true' && (
                        <Grid
                          item
                          xs={6}
                          style={{
                            display: 'flex',
                            flexDirection: 'column'
                          }}
                        >
                          <Grid></Grid>
                          <Grid
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              marginBottom: '16px',
                              marginTop: '4px'
                            }}
                          >
                            <Typography>Default Menu Type</Typography>
                            <Select
                              displayEmpty
                              className={classes.fntClr}
                              style={{ marginLeft: '8px', width: '25%' }}
                              value={
                                salesTransSettingData.menuType
                                  ? salesTransSettingData.menuType
                                  : 'Self Service'
                              }
                              input={
                                <OutlinedInput
                                  style={{ width: '100%', height: '80%' }}
                                />
                              }
                              onChange={(e) => {
                                setMenuType(e.target.value);
                              }}
                            >
                              {menuTypeList &&
                                menuTypeList.map((option, index) => (
                                  <MenuItem value={option}>{option}</MenuItem>
                                ))}
                            </Select>
                          </Grid>
                        </Grid>
                      )}
                    </>
                  )}
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
                      <Typography variant="h6" style={{ marginBottom: '5px' }}>
                        Product Level
                      </Typography>
                      <Divider variant="li" />
                      {salesTransSettingData.enableOnTxn.productLevel.map(
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
                                      setSalesTxnSettingProperty(
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
                      <Typography variant="h6" style={{ marginBottom: '5px' }}>
                        Bill Level
                      </Typography>
                      <Divider variant="li" />
                      {salesTransSettingData.enableOnTxn.billLevel.map(
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
                                      setSalesTxnSettingProperty(
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
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" style={{ marginBottom: '5px' }}>
                        Product Level
                      </Typography>
                      <Divider variant="li" />
                      {salesTransSettingData.displayOnBill.productLevel.map(
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
                                      setSalesTxnSettingProperty(
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
                      {salesTransSettingData.displayOnBill.billLevel.map(
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
                                      setSalesTxnSettingProperty(
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

                  <Grid item xs={12} sm={6}></Grid>

                  {salesTransSettingData.enableOnTxn.productLevel &&
                    salesTransSettingData.enableOnTxn.productLevel.length >
                      0 && (
                      <>
                        <FormControl
                          sx={{ m: 3 }}
                          component="fieldset"
                          variant="standard"
                        >
                          <FormGroup>
                            <div>
                              <Grid item xs={12} sm={12}>
                                <Typography
                                  variant="h5"
                                  style={{
                                    marginBottom: '2px',
                                    marginTop: '16px'
                                  }}
                                >
                                  Bill Title
                                </Typography>
                              </Grid>
                              <TextField
                                placeholder="Enter Bill Title"
                                style={{ marginBottom: '20px' }}
                                variant="outlined"
                                className={classes.textField}
                                value={salesTransSettingData.billTitle}
                                onChange={(e) => {
                                  setBillTitle(e.target.value);
                                }}
                                margin="dense"
                              />
                            </div>
                          </FormGroup>
                        </FormControl>

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
                                value={salesTransSettingData.terms}
                                onChange={(e) => {
                                  setBillTerms(e.target.value);
                                }}
                              />
                            </MuiThemeProvider>
                          </Grid>
                        </Grid>
                      </>
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
export default injectWithObserver(SalesSettings);