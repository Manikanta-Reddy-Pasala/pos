import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import {
  Typography,
  Dialog,
  DialogContent,
  Button,
  DialogContentText,
  DialogActions
} from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { Grid, Box } from '@material-ui/core';
import { toJS } from 'mobx';
import axios from 'axios';
import Page from '../../components/Page';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import Loader from 'react-js-loader';
import dateFormat from 'dateformat';
import * as txnSettings from 'src/components/Helpers/TransactionSettingsHelper';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    padding: '24px',
    backgroundColor: '#f6f8fa'
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50px'
  },
  styleData: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    paddingTop: 90
  },
  content: {
    justifyContent: 'left',
    textAlign: 'left',
    padding: '20px 5px 20px 20px'
  },
  controls: {
    display: 'flex',
    position: 'relative',
    paddingLeft: 0
  },
  text: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    marginTop: '10px'
  },
  playIcon: {
    height: 20,
    width: 20,
    color: '#ef5350'
  },
  typography: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    textAlign: 'center',
    margin: '0.2rem',
    fontWeight: 600
  },
  card: {
    borderRadius: '10px',
    boxShadow: '0px 0px 12px 2px #00000017',
    background: 'white',
    height: '100%',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: '80px',
    justifyContent: 'center',
    textAlign: 'justify'
  },
  subText: {
    color: '#ddd'
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  mainWrapper: {
    minWidth: '100vh',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'white'
  }
}));

function BusinessList() {
  const classes = useStyles();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setLoadingShown] = React.useState(true);
  const [openCloseDialog, setopenCloseDialog] = React.useState(false);
  const [selectedBusiness, setSelectedBusiness] = React.useState({});

  const store = useStore();
  const { userName, mobileNumber, businessList } = toJS(
    store.BusinessListStore
  );
  const { saveData, updateSelectedBusiness, setTriggerEvent } =
    store.BusinessListStore;

  const API_SERVER = window.REACT_APP_API_SERVER;

  const [errorAlertLicenseMessage, setErrorAlertLicenseMessage] =
    React.useState('');
  const [openErrorAlertLicense, setErrorAlertLicense] = React.useState(false);

  const handleErrorAlertLicenseClose = () => {
    setErrorAlertLicense(false);
    setErrorAlertLicenseMessage('');
  };

  const isSelectedBusinessIsExistingBusiness = (businessId) => {
    if (localStorage.getItem('businessId') === businessId) {
      return true;
    } else {
      return false;
    }
  };

  const handleCloseDialogClose = async () => {
    setopenCloseDialog(false);
  };

  const handleChangeBusiness = async () => {
    let data = selectedBusiness;

    localStorage.setItem('emailId', data.emailId);
    localStorage.setItem('partnerCity', data.partnerCity);
    localStorage.setItem('partnerProfileId', data.partnerProfileId);
    localStorage.setItem('businessId', data.businessId);
    localStorage.setItem('businessCity', data.businessCity);
    localStorage.setItem('emailId', data.emailId);
    localStorage.setItem('partnerCity', data.partnerCity);
    localStorage.setItem('businessName', data.businessName);
    localStorage.setItem('businessArea', data.businessArea);

    //set sync status false
    localStorage.setItem('isSyncedData', 'false');
    localStorage.setItem('syncedDate', '');

    let level1_categories = data.level1_categories;

    let isHotelOrRestaurant = false;
    let isTemple = false;
    let isJewellery = false;
    let isClinic = false;
    for (let category of level1_categories) {
      // currently hard coaded going forward we need to remove this
      if (category === 'hotels_level1' || category === 'food_drinks_level1') {
        isHotelOrRestaurant = true;
      }
      if (category === 'jewellery_level1') {
        isJewellery = true;
      }
    }

    if (data.globalCategory === 'devotional_global') {
      isTemple = true;
    }

    if (data.globalCategory === 'health_care_global') {
      isClinic = true;
    }

    let businessList;
    try {
      businessList = JSON.parse(localStorage.getItem('businessList'));
    } catch (e) {
      console.error(' Error: ', e.message);
    }
    //save business list since everything is removed from DB
    await saveData(businessList);

    localStorage.setItem('isTemple', isTemple);
    localStorage.setItem('isClinic', isClinic);
    localStorage.setItem('isJewellery', isJewellery);

    localStorage.setItem('posFeatures', JSON.stringify(data.pos_features));
    localStorage.setItem('deviceNames', JSON.stringify(data.deviceNames));
    localStorage.setItem('isHotelOrRestaurant', isHotelOrRestaurant);

    localStorage.setItem('onlinePOSPermission', data.online_pos_permission);
    localStorage.setItem('createBillPermission', data.billing_invoice_enabled);

    localStorage.setItem('planName', data.planName);
    localStorage.setItem('isAdmin', data.admin);
    localStorage.setItem('enableEway', data.enableEway);
    localStorage.setItem('enableEinvoice', data.enableEinvoice);
    localStorage.setItem('enableCustomer', data.enableCustomer);
    localStorage.setItem('enableVendor', data.enableVendor);
    localStorage.setItem('subscriptionEndDate', data.subscriptionEndDate);

    if (data.businessName) {
      setOpen(true);
    }
    /**
     * save to database
     */
    await updateSelectedBusiness(data);

    setLoadingShown(false);
    handleNavigate();

    setopenCloseDialog(false);
  };

  const handleBusinessClickFirstTime = async (data) => {
    localStorage.setItem('emailId', data.emailId);
    localStorage.setItem('partnerCity', data.partnerCity);
    localStorage.setItem('partnerProfileId', data.partnerProfileId);
    localStorage.setItem('businessId', data.businessId);
    localStorage.setItem('businessCity', data.businessCity);
    localStorage.setItem('emailId', data.emailId);
    localStorage.setItem('partnerCity', data.partnerCity);
    localStorage.setItem('partnerProfileId', data.partnerProfileId);
    localStorage.setItem('businessName', data.businessName);
    localStorage.setItem('businessArea', data.businessArea);

    let level1_categories = data.level1_categories;

    let isHotelOrRestaurant = false;
    let isTemple = false;
    let isJewellery = false;
    let isClinic = false;
    if (level1_categories && level1_categories.length > 0) {
      for (let category of level1_categories) {
        // currently hard coaded going forward we need to remove this
        if (category === 'hotels_level1' || category === 'food_drinks_level1') {
          isHotelOrRestaurant = true;
        }
        if (category === 'jewellery_level1') {
          isJewellery = true;
        }
      }
    }

    if (data.globalCategory === 'devotional_global') {
      isTemple = true;
    }

    if (data.globalCategory === 'health_care_global') {
      isClinic = true;
    }

    localStorage.setItem('posFeatures', JSON.stringify(data.pos_features));
    localStorage.setItem('deviceNames', JSON.stringify(data.deviceNames));
    localStorage.setItem('isHotelOrRestaurant', isHotelOrRestaurant);
    localStorage.setItem('isTemple', isTemple);
    localStorage.setItem('isJewellery', isJewellery);
    localStorage.setItem('isClinic', isClinic);

    localStorage.setItem('onlinePOSPermission', data.online_pos_permission);
    localStorage.setItem('createBillPermission', data.billing_invoice_enabled);
    localStorage.setItem('planName', data.planName);
    localStorage.setItem('isAdmin', data.admin);
    localStorage.setItem('enableEway', data.enableEway);
    localStorage.setItem('enableEinvoice', data.enableEinvoice);
    localStorage.setItem('enableCustomer', data.enableCustomer);
    localStorage.setItem('enableVendor', data.enableVendor);
    localStorage.setItem('subscriptionEndDate', data.subscriptionEndDate);

    if (data.businessName) {
      setOpen(true);
    }
    /**
     * save to database
     */
    await updateSelectedBusiness(data);

    setLoadingShown(false);
    handleNavigate();
  };

  const handleBusinessSelection = async (data) => {
    //if selecting business for the first time
    setSelectedBusiness(data);
    if (
      !(
        localStorage.getItem('businessId') &&
        localStorage.getItem('businessId').length > 0
      )
    ) {
      handleBusinessClickFirstTime(data);
    } else {
      // change business clicked
      if (!isSelectedBusinessIsExistingBusiness(data.businessId)) {
        setopenCloseDialog(true);
      } else {
        setLoadingShown(false);
        handleNavigate();
        setopenCloseDialog(false);
      }
    }
  };

  const handleNavigate = () => {
    setOpen(false);
    setTriggerEvent();

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
      navigate('/login', { replace: true });
    } else {
      const date2 = new Date(endDate);
      const Difference_In_Time = date2.getTime() - todayDate.getTime();
      Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24));
      localStorage.setItem('subscriptionDaysLeft', Difference_In_Days);

      console.log('Date 1: ' + todayDate + ' Date 2: ' + date2);
    }

    if (Difference_In_Days >= 0) {
      txnSettings.updateMultiDeviceSettingDetails(
        localStorage.getItem('deviceName')
      );
      navigate('/app/dashboard', { replace: true });
    } else {
      //show License Expired Popup
      setErrorAlertLicenseMessage(
        'Your subscription expired! Please renew to continue billing seamlessly.'
      );
      setErrorAlertLicense(true);
    }
  };

  const getBusinessList = async () => {
    let userName = '';
    if (mobileNumber) {
      userName = mobileNumber;
    } else if (!(localStorage.getItem('mobileNumber') === null)) {
      userName = localStorage.getItem('mobileNumber');
    }

    // let bearerToken = '';
    // if (token) {
    //   bearerToken = token;
    // } else if (!(localStorage.getItem('token') === null)) {
    //   bearerToken = localStorage.getItem('token');
    // }

    if (!window.navigator.onLine) {
      handleNavigate();
    } else {
      await axios
        .get(
          `${API_SERVER}/pos/v1/user/getAssociatedBusiness?phoneNumber=${userName}`
          // {
          //   headers: {
          //     Authorization: `Bearer ${bearerToken}`,
          //     user_type: 'partner',
          //     'content-type': 'application/json'
          //   }
          // }
        )
        .then(async (response) => {
          // console.log(response);
          if (response.data) {
            const businessListResponse = response.data;

            if (businessListResponse.businessList) {
              localStorage.setItem(
                'businessListLength',
                businessListResponse.businessList.length
              );

              localStorage.setItem(
                'businessList',
                JSON.stringify(response.data)
              );
              await saveData(response.data);
              if (businessListResponse.businessList.length === 1) {
                await handleBusinessSelection(
                  businessListResponse.businessList[0]
                );
              } else {
                setLoadingShown(false);
              }
            } else {
              setLoadingShown(false);
            }
          }
        })
        .catch((err) => {
          setLoadingShown(false);
          throw err;
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getBusinessList();
    };

    fetchData();
  }, []);

  return (
    <div>
      {isLoading && (
        <div className={classes.mainWrapper}>
          <div className={classes.paper}>
            <Loader
              type="bubble-top"
              bgColor={'#EF524F'}
              color={'#EF524F'}
              title={'Please Wait'}
              size={60}
            />
          </div>
        </div>
      )}

      {!isLoading && (
        <Page className={classes.root} title="Choose Business">
          <div className={classes.styleData}>
            <div className={classes.header}>
              <Typography
                component="h2"
                variant="h2"
                className={classes.typography}
              >
                Hello {userName} !
              </Typography>
              <Typography
                component="h2"
                variant="h2"
                className={classes.typography}
                style={{ color: '#ef5350' }}
              >
                Choose Business to continue
              </Typography>
            </div>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={6}
            >
              {businessList.map((data) => {
                return (
                  <Grid
                    key={data.id}
                    item
                    xs={3}
                    onClick={() => {
                      handleBusinessSelection(data);
                    }}
                  >
                    <div className={classes.card}>
                      <div className={classes.content}>
                        <Typography
                          component="h5"
                          variant="h5"
                          style={{
                            fontFamily: 'Nunito Sans, Roboto, sans-serif',
                            fontSize: 18
                          }}
                        >
                          {data.businessName}
                        </Typography>
                        <Box display="flex" alignItems="center">
                          <IconButton
                            aria-label="play/pause"
                            className={classes.controls}
                          >
                            <LocationOnIcon
                              color="red"
                              className={classes.playIcon}
                            />
                          </IconButton>
                          <Box>
                            <Typography
                              component="subtitle1"
                              color="textSecondary"
                              className={classes.text}
                            >
                              {data.businessArea}
                            </Typography>
                            <Typography className={classes.subText}>
                              {data.businessCity}
                            </Typography>
                          </Box>
                        </Box>
                      </div>
                    </div>
                  </Grid>
                );
              })}
            </Grid>
          </div>

          <Dialog
            open={openCloseDialog}
            onClose={handleCloseDialogClose}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogContent>
              <DialogContentText>
                You have Chosen a Different Business, Do you want to Continue?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleChangeBusiness}>
                Yes
              </Button>
              <Button color="primary" onClick={handleCloseDialogClose}>
                No
              </Button>
            </DialogActions>
          </Dialog>
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
        </Page>
      )}
    </div>
  );
}

export default InjectObserver(BusinessList);
