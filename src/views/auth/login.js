import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {
  Grid,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import * as Bd from '../../components/SelectedBusiness';
import * as User from '../../components/UserData';
import * as Yup from 'yup';
import { toJS } from 'mobx';
import { Formik } from 'formik';
import axios from 'axios';
import * as Db from '../../RxDb/Database/Database';
import { Box } from '@material-ui/core';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { useNavigate } from 'react-router-dom';
import logo from '../../icons/OneShell_Logo.svg';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import Loader from 'react-js-loader';
import Footer from './Footer';
import * as deviceIdHelper from 'src/components/Helpers/PrintHelper/CloudPrintHelper';
import { Dialog } from '@material-ui/core';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import dateFormat from 'dateformat';
import * as txnSettings from 'src/components/Helpers/TransactionSettingsHelper';

const useStyles = makeStyles((theme) => ({
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textField: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    borderRadius: '40px',
    fontSize: 16,
    width: 340,
    height: 50
  },
  form: {
    // width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
    textAlign: 'center'
  },
  link: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    color: '#ef5350',
    marginRight: '30px'
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  button: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    width: 125,
    height: 45,
    margin: theme.spacing(3, 0, 2),
    borderRadius: '40px',
    backgroundColor: '#ef5350',
    '&:hover': {
      backgroundColor: '#c34d4a'
    }
  },
  typography: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    textAlign: 'center',
    fontSize: 20,
    marginTop: '25px',
    // margin:theme.spacing(2),
    fontWeight: 600
  },
  inputField: {
    padding: '8px'
  },
  mainWrapper: {
    minWidth: '100vh',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white'
  },
  container: {
    boxShadow: '0px 0px 8px #d4d2d2',
    padding: '40px 30px',
    borderRadius: '8px'
  }
}));

function SignIn() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [passwordShown, setPasswordShown] = useState(false);
  const [isLoading, setLoadingShown] = useState(false);
  const [isError, setErrorMessage] = useState(false);

  const store = useStore();
  const { setUserName, setToken, updateData, setDeviceName } =
    store.BusinessListStore;
  const { deviceName } = toJS(store.BusinessListStore);

  const API_SERVER = window.REACT_APP_API_SERVER;

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  const [errorAlertLicenseMessage, setErrorAlertLicenseMessage] = useState('');
  const [openErrorAlertLicense, setErrorAlertLicense] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [openMigrationAlert, setMigrationAlert] = useState(false);

  const [openDeviceAlert, setDeviceAlert] = useState(false);
  const [deviceList, setDeviceList] = useState([]);
  const [loginResponse, setLoginResponse] = useState();
  const [deviceNameTyped, setDeviceNameTyped] = useState('');
  const [deviceNameEmpty, setDeviceNameEmpty] = useState(true);

  const handleErrorAlertLicenseClose = () => {
    setErrorAlertLicense(false);
    setErrorAlertLicenseMessage('');
  };

  const handleDeviceAlertClose = () => {
    setDeviceAlert(false);
  };

  useEffect(() => {
    const checkForChangedLoginUser = async () => {
      let isLoginChanged = localStorage.getItem('isLoginChanged');
      if (isLoginChanged && isLoginChanged === 'true') {
        //save to user table
        User.saveUserData(
          localStorage.getItem('mobileNumber'),
          localStorage.getItem('password')
        );

        // remove the variable which is set
        localStorage.removeItem('isLoginChanged');
        localStorage.removeItem('selectedBusiness');
        localStorage.removeItem('businessId');
        localStorage.removeItem('businessCity');
        localStorage.removeItem('posFeatures');
        localStorage.removeItem('emailId');
        localStorage.removeItem('partnerCity');
        localStorage.removeItem('partnerProfileId');
        localStorage.removeItem('isTemple');
        localStorage.removeItem('isJewellery');
        localStorage.removeItem('isHotelOrRestaurant');
        localStorage.removeItem('planName');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('enableEway');
        localStorage.removeItem('enableEinvoice');
        localStorage.removeItem('enableCustomer');
        localStorage.removeItem('enableVendor');
        localStorage.removeItem('deviceName');

        //take him to business selection page
        navigate('/selectBusiness', { replace: true });
      }
    };
    checkForChangedLoginUser();
  }, []);

  const checkForDataMigration = async () => {
    setMigrationAlert(true);
    setMigrationAlert(false);
  };

  const processLogin = async (username, password) => {
    setUserName(username);
    if (!window.navigator.onLine) {
      //if user doesn't have internet
      handleOfflineLogin(username, password);
    } else {
      //if user have internet

      try {
        handleOnlineLogin(username, password);
      } catch (e) {
        if (
          localStorage.getItem('signedIn') &&
          localStorage.getItem('signedIn') === 'true'
        ) {
          handleOfflineLogin(username, password);
        }
      }
    }
  };

  const handleOfflineLogin = async (username, password) => {
    const userData = await User.getUserData();

    if (
      userData.userId === username.trim() &&
      userData.userPass === password.trim()
    ) {
      localStorage.setItem('signedIn', true);
      navigate('/selectBusiness', { isLoggedIn: true, replace: true });
    } else {
      setErrorMessage(true);
      setLoadingShown(false);
    }
  };

  const executeLocalStorageUpdations = async (response) => {
    handleDeviceAlertClose();

    //  save everytime the list of business and pos features Start
    localStorage.setItem('businessList', JSON.stringify(response.data));

    await updateData(response.data);

    let deviceId = await deviceIdHelper.getDeviceId();
    if (
      localStorage.getItem('deviceId') === undefined ||
      localStorage.getItem('deviceId') === '' ||
      localStorage.getItem('deviceId') === null
    ) {
      localStorage.setItem('deviceId', deviceId);
    }

    let businessResponse = response.data;

    if (businessResponse && businessResponse.businessList) {
      localStorage.setItem(
        'businessListLength',
        businessResponse.businessList.length
      );
    }

    const selectedBusinessData = businessResponse.businessList.filter(
      (item) => item.businessId === localStorage.getItem('businessId')
    );

    if (selectedBusinessData && selectedBusinessData.length > 0) {
      localStorage.setItem(
        'posFeatures',
        JSON.stringify(selectedBusinessData[0].pos_features)
      );
    }

    //  save everytime the list of business and pos features END
    let businessListRes = [];
    businessListRes = response.data.businessList;
    let isBusinessChanged = true;

    //handle first time there is no business selected
    if (
      localStorage.getItem('businessId') !== null &&
      localStorage.getItem('businessId') !== 'undefined' &&
      localStorage.getItem('businessId') !== undefined &&
      localStorage.getItem('businessId').length > 1
    ) {
      const businessData = await Bd.getBusinessData();

      let businessDataFromAPI = businessListRes.filter((a) => {
        if (a.businessId === businessData.businessId) {
          return a;
        }
      })[0];

      if (businessDataFromAPI) {
        let level1_categories = businessDataFromAPI.level1_categories;
        let isHotelOrRestaurant = false;
        let isTemple = false;
        let isJewellery = false;

        if (level1_categories && level1_categories.length > 0) {
          for (let category of level1_categories) {
            // currently hard coaded going forward we need to remove this
            if (
              category === 'hotels_level1' ||
              category === 'food_drinks_level1'
            ) {
              isHotelOrRestaurant = true;
            }
            if (category === 'jewellery_level1') {
              isJewellery = true;
            }
          }
        }

        if (businessDataFromAPI.globalCategory === 'devotional_global') {
          isTemple = true;
        }
        localStorage.setItem('isTemple', isTemple);
        localStorage.setItem('isJewellery', isJewellery);
        localStorage.setItem('isHotelOrRestaurant', isHotelOrRestaurant);
        localStorage.setItem('planName', businessDataFromAPI.planName);
        localStorage.setItem('isAdmin', businessDataFromAPI.admin);
        localStorage.setItem('enableEway', businessDataFromAPI.enableEway);
        localStorage.setItem(
          'enableEinvoice',
          businessDataFromAPI.enableEinvoice
        );
        localStorage.setItem(
          'enableCustomer',
          businessDataFromAPI.enableCustomer
        );
        localStorage.setItem('enableVendor', businessDataFromAPI.enableVendor);
        localStorage.setItem(
          'subscriptionEndDate',
          businessDataFromAPI.subscriptionEndDate
        );
      }

      for (var i = 0; i < businessListRes.length; i++) {
        let business = toJS(businessListRes[i]);
        if (
          business.businessId === businessData.businessId ||
          businessData.businessId === null ||
          businessData.businessId === 'null' ||
          !businessData.businessId ||
          businessData.businessId === ''
        ) {
          isBusinessChanged = false;
        }
      }
    } else {
      if (localStorage.getItem('businessId') === 'undefined') {
        isBusinessChanged = true;
      } else {
        isBusinessChanged = false;
      }
    }

    //handle if busines is changed
    if (isBusinessChanged) {
      handleChangedBusinessForTheGivenUser();
    }

    localStorage.setItem('userName', response.data.userName);
    localStorage.setItem('showAudit', response.data.showAudit);

    console.log('showAudit data: ' + response.data.showAudit);

    /**
     * if user already selected business then take him to dashbaord
     */
    if (localStorage.getItem('businessId') === null) {
      navigate('/selectBusiness', { replace: true });
    } else {
      const today = new Date();
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      let endDate = localStorage.getItem('subscriptionEndDate');

      let Difference_In_Days = 0;

      // If endDate is not present or not a valid date, navigate to select business
      if (!endDate || isNaN(new Date(endDate).getTime())) {
        navigate('/selectBusiness', { replace: true });
      } else {
        const date2 = new Date(endDate);
        const Difference_In_Time = date2.getTime() - todayDate.getTime();
        Difference_In_Days = Math.floor(
          Difference_In_Time / (1000 * 3600 * 24)
        );

        localStorage.setItem('subscriptionDaysLeft', Difference_In_Days);

        console.log('Date 1: ' + todayDate + ' Date 2: ' + date2);
      }

      if (Difference_In_Days >= 0) {
        txnSettings.updateMultiDeviceSettingDetails(
          localStorage.getItem('deviceName')
        );
        navigate('/app/dashboard', { replace: true });
      } else {
        setErrorAlertLicenseMessage(
          'Your subscription expired! Please renew to continue billing seamlessly.'
        );
        setErrorAlertLicense(true);
      }
    }
  };

  const handleOnlineLogin = async (username, password) => {
    await axios
      .post(
        API_SERVER + '/auth/partner/token/',
        {
          username,
          password
        },
        {
          headers: {
            user_type: 'partner'
          }
        }
      )
      .then(async (response) => {
        if (response.data.token) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token.trim());
          localStorage.setItem('signedIn', true);

          /*
          check with existing user
          */
          await checkForChangeOfCredentials(username, password);

          localStorage.setItem('mobileNumber', username.trim());

          await axios
            .get(
              `${API_SERVER}/pos/v1/user/getAssociatedBusiness?phoneNumber=${username}`,
              {
                // headers: {
                //   Authorization: `Bearer ${response.data.token}`,
                //   user_type: 'partner',
                //   'content-type': 'application/json'
                // }
              }
            )
            .then(async (response) => {
              if (response.data) {
                if (
                  localStorage.getItem('deviceName') !== '' &&
                  localStorage.getItem('deviceName') !== undefined &&
                  localStorage.getItem('deviceName') !== null
                ) {
                  executeLocalStorageUpdations(response);
                } else {
                  setLoginResponse(response);
                  if (
                    response.data.deviceNames &&
                    response.data.deviceNames.length > 0
                  ) {
                    setDeviceList(response.data.deviceNames);
                  }
                  setDeviceAlert(true);
                }

                User.saveUserData(username, password);
              } else {
                console.log('no data found');
              }
            })
            .catch((err) => {
              if (
                localStorage.getItem('signedIn') &&
                localStorage.getItem('signedIn') === 'true'
              ) {
                handleOfflineLogin(username, password);
              } else {
                throw err;
              }
              //
            });
          // }
        } else {
          setErrorMessage(true);
          setLoadingShown(false);
        }
      })
      .catch((err) => {
        if (
          localStorage.getItem('signedIn') &&
          localStorage.getItem('signedIn') === 'true'
        ) {
          handleOfflineLogin(username, password);
        } else {
          setErrorMessage(true);
          setLoadingShown(false);
          throw err;
        }
      });
  };

  const checkForChangeOfCredentials = async (username, password) => {
    if (localStorage.getItem('mobileNumber')) {
      const existingUserName = localStorage.getItem('mobileNumber');

      if (existingUserName !== username.trim()) {
        //set a variable to local storage before clearing
        localStorage.setItem('mobileNumber', username.trim());
        localStorage.setItem('password', password);

        localStorage.setItem('isLoginChanged', 'true');
        await Db.deleteAndRecreateDb();
      }
    }
  };

  const handleChangedBusinessForTheGivenUser = async () => {
    await Db.deleteAndRecreateDb();
    localStorage.removeItem('businessId');
    localStorage.removeItem('businessCity');
    localStorage.removeItem('posFeatures');
    localStorage.removeItem('emailId');
    localStorage.removeItem('partnerCity');
    localStorage.removeItem('partnerProfileId');
    localStorage.removeItem('isTemple');
    localStorage.removeItem('isJewellery');
    localStorage.removeItem('isHotelOrRestaurant');
    localStorage.removeItem('planName');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('enableEway');
    localStorage.removeItem('enableEinvoice');
    localStorage.removeItem('enableCustomer');
    localStorage.removeItem('enableVendor');
    localStorage.removeItem('deviceName');
  };

  const handleLogin = async (value) => {
    if (value.username && value.password) {
      localStorage.setItem('loginDetails', JSON.stringify(value));
      await checkForDataMigration();

      setLoadingShown(true);
      processLogin(value.username, value.password);
    } else {
      console.log('no values set');
    }
  };

  return (
    <div>
      <Box className={classes.mainWrapper}>
        <Container component="main" maxWidth="xs">
          <Container
            component="main"
            maxWidth="xs"
            className={classes.container}
          >
            <div>
              <CssBaseline />
              {isLoading && (
                <div className={classes.paper}>
                  <Loader
                    type="bubble-top"
                    bgColor={'#EF524F'}
                    color={'#EF524F'}
                    title={'Please Wait'}
                    size={50}
                  />
                </div>
              )}
              {!isLoading && (
                <div className={classes.paper}>
                  <img src={logo} alt="Logo" width="110" height="110" />
                  <Typography
                    component="h1"
                    variant="h3"
                    className={classes.typography}
                  >
                    OneShell POS
                  </Typography>
                  <Formik
                    initialValues={{
                      username: localStorage.getItem('loginDetails')
                        ? JSON.parse(localStorage.getItem('loginDetails'))
                            .username
                        : '',
                      password: localStorage.getItem('loginDetails')
                        ? JSON.parse(localStorage.getItem('loginDetails'))
                            .password
                        : ''
                    }}
                    validationSchema={Yup.object().shape({
                      username: Yup.string()
                        .max(10)
                        .min(10)
                        .required('Mobile Number is required'),
                      password: Yup.string()
                        .max(255)
                        .required('Password is required')
                    })}
                    onSubmit={(value) => handleLogin(value)}
                  >
                    {({
                      errors,
                      handleBlur,
                      handleChange,
                      handleSubmit,
                      isSubmitting,
                      touched,
                      values
                    }) => (
                      <form className={classes.form} onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <TextField
                              error={Boolean(
                                touched.username && errors.username
                              )}
                              className={classes.textField}
                              helperText={touched.username && errors.username}
                              margin="normal"
                              name="username"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              type="username"
                              value={values.username}
                              variant="outlined"
                              placeholder="Mobile Number"
                              InputProps={{
                                className: classes.inputField
                              }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              error={Boolean(
                                touched.password && errors.password
                              )}
                              helperText={touched.password && errors.password}
                              className={classes.textField}
                              margin="normal"
                              name="password"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              placeholder="password"
                              InputProps={{
                                className: classes.inputField,
                                endAdornment: (
                                  <InputAdornment position="start">
                                    {passwordShown ? (
                                      <VisibilityIcon
                                        onClick={togglePasswordVisiblity}
                                      />
                                    ) : (
                                      <VisibilityOffIcon
                                        onClick={togglePasswordVisiblity}
                                      />
                                    )}
                                  </InputAdornment>
                                )
                              }}
                              type={passwordShown ? 'text' : 'password'}
                              value={values.password}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                        <Button
                          className={classes.button}
                          color="primary"
                          disabled={isSubmitting}
                          fullWidth
                          size="large"
                          type="submit"
                          variant="contained"
                          disableElevation={false}
                          onClick={(value) => handleLogin(value)}
                        >
                          Submit
                        </Button>
                        <div>
                          {isError && (
                            <div
                              style={{
                                border: '1px solid #EF524F',
                                background: '#fde5e5'
                              }}
                            >
                              <p>Incorrect Mobile Number or Password </p>
                            </div>
                          )}
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          </Container>
          <Footer />
        </Container>
      </Box>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openErrorAlertLicense}
        onClose={handleErrorAlertLicenseClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div
              dangerouslySetInnerHTML={{ __html: errorAlertLicenseMessage }}
            ></div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertLicenseClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openMigrationAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the new update is installing!!!</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openDeviceAlert}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography variant="h6" className={classes.type} align="left">
              Please provide a unique device name or choose from the list
              provided in case devices are already added. This is required for
              seamless Offline and Offline billing.
            </Typography>
            <FormControl fullWidth className={classes.marginBtmSet}>
              <Typography variant="h5" style={{ marginTop: '16px' }}>
                Device Name
              </Typography>
              <TextField
                id="deviceName"
                variant="outlined"
                margin="dense"
                value={deviceName}
                error={deviceNameEmpty === true}
                helperText={
                  deviceNameEmpty === true
                    ? 'Please enter unique Device Name to enable local Prefix billing'
                    : ''
                }
                onChange={(e) => {
                  setDeviceName(e.target.value);
                  localStorage.setItem('deviceName', e.target.value);
                  setDeviceNameEmpty(false);
                }}
                style={{ marginTop: '16px', marginBottom: '16px' }}
              />
            </FormControl>
            {deviceList && deviceList.length > 0 && (
              <div>
                <Typography variant="h5">{'(or)'}</Typography>
                <Typography variant="h6" style={{ marginTop: '16px' }}>
                  Choose from existing devices
                </Typography>
              </div>
            )}
            {deviceList && deviceList.length > 0 ? (
              <RadioGroup
                aria-label="quiz"
                name="quiz"
                value={deviceName}
                onChange={(e) => {
                  setDeviceName(e.target.value);
                  localStorage.setItem('deviceName', e.target.value);
                  setDeviceNameEmpty(false);
                }}
              >
                {deviceList.map((option, index) => (
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <FormControlLabel
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <div
                  style={{
                    width: '50%',
                    paddingLeft: '5px',
                    textAlign: 'center'
                  }}
                >
                  No Devices to display. Please add a new device name
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={(e) => {
              if (deviceNameEmpty === false) {
                setDeviceNameEmpty(false);
                if (deviceList.includes(deviceNameTyped)) {
                  // Device Exists
                  executeLocalStorageUpdations(loginResponse);
                } else {
                  executeLocalStorageUpdations(loginResponse);
                }
              } else {
                setDeviceNameEmpty(true);
              }
            }}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InjectObserver(SignIn);
