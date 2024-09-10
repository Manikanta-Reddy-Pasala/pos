import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import useWindowDimensions from '../../../components/windowDimension';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { Card, FormGroup, TextField } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import {
  makeStyles,
  Typography,
  FormControl,
  FormControlLabel,
  Switch,
  Button,
  Select,
  OutlinedInput,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  useMediaQuery
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import axios from 'axios';
import PrinterSettingsNavigation from '../PrinterSettingsNavigation';
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
  saveBtn: {
    width: '30%',
    background: '#EF5350',
    color: 'white',
    marginTop: '20px',
    textTransform: 'capitalize',
    '&:hover': {
      border: '1px solid #EF5350',
      color: '#EF5350',
      background: 'white'
    }
  }
}));

const CloudPrintSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const { height } = useWindowDimensions();

  const API_SERVER = window.REACT_APP_API_SERVER;
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);
  const [cloudPrinterList, setCloudPrinterList] = useState([]);
  const [errorMesssage, setErrorMessage] = useState('');
  const [openErrorMesssageDialog, setOpenErrorMesssageDialog] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const stores = useStore();

  const { setCloudPrinterSettingsData, getCloudPrinterSettingsData, saveData } =
    stores.CloudPrintSettingsStore;

  const { cloudPrinterSettings } = toJS(stores.CloudPrintSettingsStore);

  const handleErrorAlertClose = () => {
    setErrorMessage('');
    setOpenErrorMesssageDialog(false);
  };

  useEffect(() => {
    getPrinterList();
  }, []);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      console.log('FCM token is', localStorage.getItem('firebasePlayerId'));
      await checkPermissionAvailable(businessData);
      await getCloudPrinterSettingsData();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, [getCloudPrinterSettingsData]);

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

  const saveDataClick = () => {
    if (cloudPrinterSettings.deviceName === '') {
      setErrorMessage('Device name cannot be left blank');
      setOpenErrorMesssageDialog(true);
    } else if (
      cloudPrinterSettings.enableMessageSend === true &&
      cloudPrinterSettings.cloudPrinterSelected === ''
    ) {
      setErrorMessage('Please select Cloud Printer to send print notification');
      setOpenErrorMesssageDialog(true);
    } else {
      saveData();
    }
  };

  const getPrinterList = async () => {
    const businessData = await Bd.getBusinessData();
    const businessId = businessData.businessId;
    const businessCity = businessData.businessCity;

    await axios
      .get(API_SERVER + '/pos/v1/printer/getCloudPrinterList', {
        params: {
          businessId: businessId,
          businessCity: businessCity
        }
      })
      .then(async (response) => {
        if (response) {
          if (response.data && response.data.deviceList) {
            let printerList = response.data.deviceList.map((item) => item);
            if (printerList && printerList.length > 0) {
              setCloudPrinterList(printerList);
            }
          }
        }
      })
      .catch((err) => {
        setLoadingShown(false);
        throw err;
      });
  };

  return (
    <div>
      <Grid fluid className="app-main" style={{ height: height - 50 }}>
        <Col className="nav-column" xs={12} sm={2}>
          <Card className={classes.card}>
            <Grid container className={classes.cardList}>
              <PrinterSettingsNavigation
                navigation={navigate}
                active="cloud_print"
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
                              style={{ marginBottom: '2px' }}
                            >
                              Device Name
                            </Typography>
                          </Grid>
                          <TextField
                            placeholder="Enter Unique Device Name"
                            style={{ marginBottom: '16px' }}
                            variant="outlined"
                            className={classes.textField}
                            value={cloudPrinterSettings.deviceName}
                            onChange={(e) => {
                              setCloudPrinterSettingsData(
                                'deviceName',
                                e.target.value
                              );
                            }}
                            margin="dense"
                          />
                        </div>
                      </FormGroup>
                    </FormControl>

                    <Grid item xs={12} sm={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={cloudPrinterSettings.enableMessageReceive}
                            onChange={(e) => {
                              setCloudPrinterSettingsData(
                                'enableMessageReceive',
                                e.target.checked
                              );
                            }}
                            name="enableMessageReceive"
                          />
                        }
                        label="Enable Device to receive print messages over cloud"
                      />
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={cloudPrinterSettings.enableMessageSend}
                            onChange={(e) => {
                              setCloudPrinterSettingsData(
                                'enableMessageSend',
                                e.target.checked
                              );
                            }}
                            name="enableMessageSend"
                          />
                        }
                        label="Enable Device to send print messages for chosen cloud device"
                      />
                    </Grid>

                    <Grid item xs={12} sm={3} className="grid-padding">
                      <FormControl fullWidth>
                        <Typography
                          variant="h5"
                          style={{ marginBottom: '2px' }}
                        >
                          Cloud Printer Devices List
                        </Typography>
                        <Select
                          displayEmpty
                          className={classes.fntClr}
                          style={{ marginTop: '8px' }}
                          value={
                            cloudPrinterSettings.cloudPrinterSelected !== ''
                              ? cloudPrinterSettings.cloudPrinterSelected
                              : 'Select'
                          }
                          input={
                            <OutlinedInput
                              style={{ width: '100%', height: '80%' }}
                            />
                          }
                          onChange={async (e) => {
                            if (e.target.value !== 'Select') {
                              setCloudPrinterSettingsData(
                                'cloudPrinterSelected',
                                e.target.value
                              );
                            } else {
                              setCloudPrinterSettingsData(
                                'cloudPrinterSelected',
                                ''
                              );
                            }
                          }}
                        >
                          <MenuItem value={'Select'}>{'Select'}</MenuItem>

                          {cloudPrinterList &&
                            cloudPrinterList.map((option, index) => (
                              <MenuItem value={option}>{option}</MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <Button
                        className={classes.saveBtn}
                        onClick={(e) => {
                          saveDataClick();
                        }}
                      >
                        Save
                      </Button>
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
    </div>
  );
};

export default injectWithObserver(CloudPrintSettings);