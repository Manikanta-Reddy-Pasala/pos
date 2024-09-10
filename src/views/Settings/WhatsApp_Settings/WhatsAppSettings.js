import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@material-ui/core';
import Page from '../../../components/Page';
import Paper from '@material-ui/core/Paper';
import useWindowDimensions from '../../../components/windowDimension';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import {
  Container,
  Grid,
  makeStyles,
  Typography,
  FormControlLabel,
  Switch,
  Dialog,
  DialogContent,
  withStyles,
  DialogContentText
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import axios from 'axios';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogActions from '@material-ui/core/DialogActions';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import QRCode from 'react-qr-code';

const API_SERVER = window.REACT_APP_API_SERVER;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 14
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
    width: '100%'
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
  },
  resize: {
    width: '60px',
    height: '10px'
  },
  floatlabel: {
    position: 'absolute',
    backgroundColor: '#fff',
    zIndex: 9999,
    marginLeft: '10px',
    marginTop: '-1px',
    padding: '0px 4px 0px 4px',
    fontSize: '11px'
  },
  reminderList: {
    padding: '5px',
    borderBottom: '1px solid #80808042 !important'
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

const WhatsAppSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const { setWhatsAppSettingsData, getWhatsAppSettingsData, saveData } =
    stores.WhatsAppSettingsStore;

  const { whatsAppSettingsData } = toJS(stores.WhatsAppSettingsStore);

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [qrCode, setQrCode] = useState('');
  const [whatsAppLinkEnabled, setWhatsAppLinkEnabled] = useState(false);
  const [whatsAppLinkPhNo, setWhatsAppLinkPhNo] = useState('');
  const { height } = useWindowDimensions();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [errorMesssage, setErrorMessage] = React.useState('');
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] =
    React.useState(false);
  const handleErrorAlertClose = () => {
    setErrorMessage('');
    setOpenErrorMesssageDialog(false);
  };

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      getWhatsAppSettingsData();
    }
    console.log('whatsAppSettingsData', whatsAppSettingsData);
    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  useEffect(() => {
    getBarcodeData();
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

  const getBarcodeData = async () => {
    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;

    await axios
      .get(API_SERVER + '/pos/v1/user/getBarCode', {
        params: {
          businessId: businessId,
          businessCity: businessCity
        }
      })
      .then(async (response) => {
        if (response) {
          if (response.data) {
            setWhatsAppLinkEnabled(response.data.whatsAppLinkedEnabled);
            setWhatsAppLinkPhNo(response.data.linkedPhoneNumber);
            if (response.data.whatsAppBarcode) {
              setQrCode(response.data.whatsAppBarcode);
            }
          }
        }
      })
      .catch((err) => {
        setLoadingShown(false);
        throw err;
      });
  };

  const logOut = async () => {
    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;

    await axios
      .post(`${API_SERVER}/pos/v1/whatsApp/logOut`, {
        businessCity,
        businessId
      })
      .then((response) => {
        if (response) {
          if (response.data.success && response.data.success === true) {
            setTimeout(() => {
              getBarcodeData();
            }, 100);
          }
        }
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  };

  return (
    <Page className={classes.root} title="WhatsApp Settings">
      <Container maxWidth={false} style={{ margin: 0, padding: 10 }}>
        <Grid container spacing={1}>
          {isLoading && <BubbleLoader></BubbleLoader>}
          {!isLoading && (
            <>
              {isFeatureAvailable ? (
                <Grid item className={classes.containerRight}>
                  <Paper
                    className={classes.paper}
                    style={{ height: height - 62 + 'px' }}
                  >
                    <Typography variant="h5" style={{ marginBottom: '10px' }}>
                      WhatsApp Alert Settings
                    </Typography>

                    <Grid container>
                      <Grid item xs="12" sm="6">
                        {whatsAppLinkEnabled === true && (
                          <div
                            style={{ display: 'flex', marginBottom: '10px' }}
                          >
                            <Typography variant="h5">
                              {<br />}
                              You are successfully registered with{' '}
                              {whatsAppLinkPhNo}
                            </Typography>

                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={function (event) {
                                logOut();
                              }}
                              style={{
                                marginLeft: 20,
                                marginTop: '10px',
                                color: 'white'
                              }}
                            >
                              LOGOUT
                            </Button>
                          </div>
                        )}

                        <Typography
                          variant="h6"
                          style={{ marginBottom: '10px' }}
                        >
                          {<br />}
                          Select transactions for automatic messaging
                        </Typography>

                        <FormControlLabel
                          style={{ display: 'block' }}
                          control={
                            <Switch
                              checked={
                                whatsAppSettingsData.saleTransactionAlertEnabled
                              }
                              onChange={(e) => {
                                setWhatsAppSettingsData(
                                  'saleTransactionAlertEnabled',
                                  e.target.checked
                                );
                                saveData();
                              }}
                              name="sales_WhatsAppAlert"
                            />
                          }
                          label="Sales"
                        />
                        <FormControlLabel
                          style={{ display: 'block' }}
                          control={
                            <Switch
                              checked={
                                whatsAppSettingsData.purchaseTransactionAlertEnabled
                              }
                              onChange={(e) => {
                                setWhatsAppSettingsData(
                                  'purchaseTransactionAlertEnabled',
                                  e.target.checked
                                );
                                saveData();
                              }}
                              name="purchase_WhatsAppAlert"
                            />
                          }
                          label="Purchase"
                        />
                        <FormControlLabel
                          style={{ display: 'block' }}
                          control={
                            <Switch
                              checked={
                                whatsAppSettingsData.saleReturnTransactionAlertEnabled
                              }
                              onChange={(e) => {
                                setWhatsAppSettingsData(
                                  'saleReturnTransactionAlertEnabled',
                                  e.target.checked
                                );
                                saveData();
                              }}
                              name="salesReturn_WhatsAppAlert"
                            />
                          }
                          label="Sales Return"
                        />
                        <FormControlLabel
                          style={{ display: 'block' }}
                          control={
                            <Switch
                              checked={
                                whatsAppSettingsData.purchaseReturnTransactionAlertEnabled
                              }
                              onChange={(e) => {
                                setWhatsAppSettingsData(
                                  'purchaseReturnTransactionAlertEnabled',
                                  e.target.checked
                                );
                                saveData();
                              }}
                              name="purchReturn_WhatsAppAlert"
                            />
                          }
                          label="Purchase Return"
                        />
                        <FormControlLabel
                          style={{ display: 'block' }}
                          control={
                            <Switch
                              checked={
                                whatsAppSettingsData.estimateTransactionAlertEnabled
                              }
                              onChange={(e) => {
                                setWhatsAppSettingsData(
                                  'estimateTransactionAlertEnabled',
                                  e.target.checked
                                );
                                saveData();
                              }}
                              name="estRQuot_WhatsAppAlert"
                            />
                          }
                          label="Estimate/Quotation"
                        />
                        <FormControlLabel
                          style={{ display: 'block' }}
                          control={
                            <Switch
                              checked={
                                whatsAppSettingsData.makePayTransactionAlertEnabled
                              }
                              onChange={(e) => {
                                setWhatsAppSettingsData(
                                  'makePayTransactionAlertEnabled',
                                  e.target.checked
                                );
                                saveData();
                              }}
                              name="makePayment_WhatsAppAlert"
                            />
                          }
                          label="Payment Out"
                        />
                        <FormControlLabel
                          style={{ display: 'block' }}
                          control={
                            <Switch
                              checked={
                                whatsAppSettingsData.receivePayTransactionAlertEnabled
                              }
                              onChange={(e) => {
                                setWhatsAppSettingsData(
                                  'receivePayTransactionAlertEnabled',
                                  e.target.checked
                                );
                                saveData();
                              }}
                              name="receivePayment_WhatsAppAlert"
                            />
                          }
                          label="Payment In"
                        />
                      </Grid>
                      {/* {!whatsAppLinkEnabled && (
                        <Grid item>
                          <Typography
                            variant="h6"
                            style={{ marginBottom: '10px' }}
                          >
                            Scan QR code from WhatsApp and start auto messaging
                          </Typography>
                          <div style={{ background: 'white', padding: '16px' }}>
                            <QRCode value={qrCode} />
                          </div>
                        </Grid>
                      )} */}
                    </Grid>
                    <Grid container style={{ display: 'none' }}>
                      <Grid item xs="12">
                        <Typography
                          variant="h6"
                          style={{ marginBottom: '10px' }}
                        >
                          {<br />}
                          Select transactions for reminder messaging
                        </Typography>
                      </Grid>
                      <Grid item xs="3">
                        <FormControlLabel
                          style={{ display: 'block' }}
                          control={
                            <Switch
                              checked={
                                whatsAppSettingsData.creditPaymentReminderAlertEnabled
                              }
                              onChange={(e) => {
                                setWhatsAppSettingsData(
                                  'creditPaymentReminderAlertEnabled',
                                  e.target.checked
                                );
                                saveData();
                              }}
                              name="creditpay_WhatsAppAlert"
                            />
                          }
                          label="Credit Payments"
                        />
                      </Grid>
                      <Grid item xs="3" alignContent="top">
                        <TextField
                          label="Days"
                          variant="outlined"
                          focused
                          defaultValue="0"
                          value={
                            whatsAppSettingsData.creditPaymentReminderAlertDays
                          }
                          onChange={(e) => {
                            setWhatsAppSettingsData(
                              'creditPaymentReminderAlertDays',
                              e.target.value
                            );
                            saveData();
                          }}
                          InputProps={{
                            classes: {
                              input: classes.resize
                            }
                          }}
                        ></TextField>
                      </Grid>
                      <Grid item xs="6"></Grid>

                      {localStorage.getItem('isTemple') === 'true' && (
                        <Grid item xs="6">
                          <Grid item xs="3">
                            <FormControlLabel
                              style={{ display: 'block' }}
                              control={
                                <Switch
                                  value={
                                    whatsAppSettingsData.templeCustomerRitualReminderAlertEnabled
                                  }
                                  onChange={(e) => {
                                    setWhatsAppSettingsData(
                                      'templeCustomerRitualReminderAlertEnabled',
                                      e.target.value
                                    );
                                    saveData();
                                  }}
                                  name="custritual_WhatsAppAlert"
                                />
                              }
                              label="Customer Ritual Alerts"
                            />
                          </Grid>
                          <Grid item xs="3">
                            <TextField
                              label="Days"
                              variant="outlined"
                              focused
                              color="warning"
                              defaultValue="0"
                              value={
                                whatsAppSettingsData.templeCustomerRitualReminderAlertDays
                              }
                              onChange={(e) => {
                                setWhatsAppSettingsData(
                                  'templeCustomerRitualReminderAlertDays',
                                  e.target.checked
                                );
                                saveData();
                              }}
                              InputProps={{
                                classes: {
                                  input: classes.resize
                                }
                              }}
                            ></TextField>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              ) : (
                <NoPermission />
              )}
            </>
          )}
        </Grid>

        <Dialog
          fullScreen={fullScreen}
          open={openErrorMesssageDialog}
          onClose={handleErrorAlertClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogContent>
            <DialogContentText>{errorMesssage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleErrorAlertClose} color="primary" autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
};

export default injectWithObserver(WhatsAppSettings);