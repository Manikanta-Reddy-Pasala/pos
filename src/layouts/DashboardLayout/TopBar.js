import React, { useEffect } from 'react';

import { Link as RouterLink, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { AppBar, Box, makeStyles, Toolbar } from '@material-ui/core';
import Logo from '../../components/Logo';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import CustomerSupportModal from '../../views/auth/customerSupport';
import DialogContentText from '@material-ui/core/DialogContentText';
import ComponentToPrint from '../../views/Printers/ComponentsToPrint/index';
import { printThermal } from '../../views/Printers/ComponentsToPrint/printThermalContent';
import { InvoiceThermalPrintContent } from '../../views/Printers/ComponentsToPrint/invoiceThermalPrintContent';
import { KOTInvoiceThermalPrintContent } from '../../views/Printers/ComponentsToPrint/kotInvoiceThermalPrintContent';
import { KOTFullBillThermalPrintContent } from '../../views/Printers/ComponentsToPrint/kotFullBillThermalPrintContent';
import * as balanceUpdate from '../../components/Helpers/CustomerAndVendorBalanceHelper';

import axios from 'axios';
import ProgressBar from 'src/components/modal/ProgressBar';
import * as Db from '../../RxDb/Database/Database';
import * as Bd from '../../components/SelectedBusiness';

const { post } = require('axios');

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#FFFFFF',
    color: '#CCCCCC'
  },
  avatar: {
    width: 30,
    height: 30
  },
  toolbar: {
    minHeight: '20px'
  },
  typography: {
    position: 'absolute',
    paddingRight: 0,
    paddingLeft: '1.8%',
    fontFamily: 'Nunito Sans Roboto sans-serif',
    color: '#303030',
    fontSize: 12
  },
  text: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    color: '#303030',
    fontSize: 12
  },
  logout: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    color: '#303030',
    fontSize: 12,
    '&:hover': {
      cursor: 'pointer',
      color: '#EF5350'
    }
  },
  customerSupport: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    paddingRight: '20px',
    fontSize: 12,
    '&:hover': {
      cursor: 'pointer',
      color: '#EF5350'
    }
  },
  videoTutorial: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    paddingRight: '20px',
    fontSize: 12,
    '&:hover': {
      cursor: 'pointer',
      color: '#EF5350'
    }
  },
  changeBusiness: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    fontSize: 12,
    '&:hover': {
      cursor: 'pointer',
      color: '#EF5350'
    }
  },
  userName: {
    position: 'absolute',
    paddingRight: 0,
    paddingLeft: '8.8%',
    fontFamily: 'Nunito Sans Roboto sans-serif',
    color: '#303030',
    fontSize: 12
  },
  faq: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    margin: '0.5rem',
    color: '#303030',
    fontSize: 12,
    '&:hover': {
      cursor: 'pointer',
      color: '#EF5350'
    }
  }
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    width: '400px'
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500]
  }
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
    background: '#a9a9a940',
    display: 'flex',
    justifyContent: 'space-between',

    '& .MuiButton-contained': {
      color: ' rgba(0, 0, 0, 0.87)',
      marginLeft: '10px',
      borderRadius: 'none',
      '&:hover': {
        borderColor: 'blue'
      }
    }
  }
}))(MuiDialogActions);

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;

  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CancelRoundedIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  }
}))(MuiDialogContent);

const submitPlayerIdToServer = async (token) => {
  let businessCity = localStorage.getItem('businessCity')
    ? localStorage.getItem('businessCity')
    : '';
  let businessId = localStorage.getItem('businessId')
    ? localStorage.getItem('businessId')
    : '';

  let deviceId = localStorage.getItem('deviceId');

  let playerId = token;

  console.log('print token from server api call: ', playerId);

  const API_SERVER = await window.REACT_APP_API_SERVER;

  console.log('print API_SERVER: ', API_SERVER);

  await post(`${API_SERVER}/pos/v1/printer/updatePlayerId`, {
    businessCity,
    businessId,
    deviceId,
    playerId
  })
    .then((response) => {
      // do nothing
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const TopBar = ({ className, onMobileNavOpen, ...rest }) => {
  const classes = useStyles();
  // const [notifications] = useState([]);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [maxWidth] = React.useState('sm');
  const [username, setUserName] = React.useState();
  const navigate = useNavigate();
  const store = useStore();
  const { handleCustomerSupportDialogOpen } = store.BusinessListStore;

  const { getThermalInvoiceSettings } = store.PrinterSettingsStore;
  const [openPrintSelectionAlert, setPrintSelectionAlert] =
    React.useState(false);
  const [printerList, setPrinterList] = React.useState([]);
  const [isStartPrint, setIsStartPrint] = React.useState(false);
  const [printData, setPrintData] = React.useState();
  const [settingsData, setSettingsData] = React.useState();
  const [screenName, setScreenName] = React.useState();

  const API_SERVER = window.REACT_APP_API_SERVER;

  const [openLoader, setOpenLoader] = React.useState(false);
  const [perc, setPerc] = React.useState(0);
  let percentage = 0;
  let salesCountArray = [];

  useEffect(() => {
    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }

    async function fetchData() {
      const businessData = await Bd.getBusinessData();

      const isSynced = await checkSyncStatus();
      if (!isSynced) {
        await getLoaderData(businessData);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    // Add your listener here
    const listener = async () => {
      let txnSettings = await getThermalInvoiceSettings(
        localStorage.getItem('businessId')
      );

      let notificationData = localStorage.getItem('message');
      if (notificationData) {
        let payloadData = JSON.parse(notificationData);

        if (payloadData !== null && payloadData !== undefined) {
          let businessId = payloadData.businessId;
          let businessCity = payloadData.businessCity;
          let invoiceType = payloadData.invoiceType;
          let invoiceId = payloadData.invoiceId;
          let id = payloadData.id;
          let type = payloadData.type;
          await getPrintData(
            businessCity,
            businessId,
            invoiceType,
            invoiceId,
            id,
            type,
            txnSettings
          );
        }
      }
    };
    window.addEventListener('onMessageEvent', listener);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('onMessageEvent', listener);
    };
  }, []);

  useEffect(() => {
    // Add your listener here
    const listener = () => {
      console.log('onPlayerIdEvent event detected');
      let firebaseId = localStorage.getItem('firebasePlayerId');
      if (firebaseId) {
        submitPlayerIdToServer(firebaseId).then(r => {console.log('Player Id sent to server: ', firebaseId)});
        alert('Player Id sent to server: ', firebaseId);
      }
    };
    window.addEventListener('onPlayerIdEvent', listener);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener('onPlayerIdEvent', listener);
    };
  }, []);

  useEffect(() => {
    let firebaseId = localStorage.getItem('firebasePlayerId');
    if (firebaseId) {
      submitPlayerIdToServer(firebaseId).then(r => {console.log('Player Id sent to server: ', firebaseId)});
    }
  }, []);

  const checkDuplicates = async (localSaleCount, intervalId) => {
    if (localSaleCount > 0) {
      salesCountArray.push(localSaleCount);
    }
    console.log('salesCountArray', salesCountArray);
    const filteredArray = salesCountArray.filter(
      (item) => item === localSaleCount
    );
    if (filteredArray.length >= 7) {
      await checkIsSyncCompleted(intervalId);
    }
    // Keep the array size to a maximum of 15
    if (salesCountArray.length > 12) {
      salesCountArray.shift();
    }
  };

  const checkIsSyncCompleted = async (intervalId) => {
    const doc = localStorage.getItem('saleLastSyncDoc');

    if (doc) {
      const dataSize = await callGraphQLQuery(JSON.parse(doc));
      if (dataSize > 0) {
        console.log('doc dataSize::' + dataSize);
        salesCountArray = salesCountArray.slice(-1);

        return false;
      } else {
        setOpenLoader(false);
        salesCountArray = [];
        clearInterval(intervalId);
        // Save the state to localStorage
        localStorage.setItem('isSyncedData', 'true');
        // Save the current date to localStorage
        localStorage.setItem('syncedDate', new Date().toDateString());
        localStorage.setItem(
          'syncedBusinessId',
          localStorage.getItem('businessId')
        );

        return true;
      }
    }

    return false;
  };

  const callGraphQLQuery = async (doc) => {
    const query = `{
      getSales(lastId: "${doc.invoice_number}", lastUpdatedAt: ${doc.updatedAt}, posId: ${doc.posId}, limit: 5, businessId: "${doc.businessId}", businessCity: "${doc.businessCity}") {
        businessId
        businessCity
      }
    }`;

    const SYNC_URL = window.REACT_APP_SYNC_URL;

    const response = await fetch(SYNC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const { data } = await response.json();

    return data && data.getSales ? data.getSales.length : 0;
  };

  const checkSyncStatus = async () => {
    if (
      localStorage.getItem('syncedBusinessId') !==
      localStorage.getItem('businessId')
    ) {
      localStorage.setItem('isSyncedData', 'false');
      localStorage.setItem('syncedDate', '');
    }

    // Check the localStorage at the start of the function
    if (localStorage.getItem('isSyncedData') === 'true') {
      // Check if the current date is different from the stored date
      if (localStorage.getItem('syncedDate') !== new Date().toDateString()) {
        // Reset isSyncedData to false
        localStorage.setItem('isSyncedData', 'false');
        localStorage.setItem('syncedDate', '');
      } else {
        return true;
      }
    }
    return false;
  };

  const getLoaderData = async (data) => {
    const salesCount = await getSalesCount(data);

    const intervalId = setInterval(async () => {
      const isSynced = await checkSyncStatus();

      if (isSynced) {
        clearInterval(intervalId);
      }

      let saleTableCount = await getSaleTableCount(data);
      console.log('salesAPICount', salesCount);
      console.log('salesAPILocalCount', saleTableCount);
      if (salesCount > saleTableCount) {
        setOpenLoader(true);
        localStorage.setItem('isSyncedData', 'false');
        await calculateDownloadPercentage(saleTableCount, salesCount, intervalId);
      } else {
        setOpenLoader(false);
        // Save the state to localStorage
        localStorage.setItem('isSyncedData', 'true');
        // Save the current date to localStorage
        localStorage.setItem('syncedDate', new Date().toDateString());
        localStorage.setItem(
          'syncedBusinessId',
          localStorage.getItem('businessId')
        );

        // Stop the interval when salesCount > saleTableCount is no longer true
        clearInterval(intervalId);
      }
    }, 5000);
  };

  const calculateDownloadPercentage = async (
    localSaleCount,
    totalSaleCount,
    intervalId
  ) => {
    percentage = (localSaleCount / totalSaleCount) * 100;
    setPerc(Math.round(percentage));
    console.log(`Downloaded: ${percentage}%`);

    await checkDuplicates(localSaleCount, intervalId);
  };

  const getSaleTableCount = async (data) => {
    const db = await Db.get();

    let count = 0;
    await db.sales
      .find({
        selector: {
          $and: [{ businessId: { $eq: data.businessId } }]
        }
      })
      .exec()
      .then((data) => {
        if (!data) {
          return;
        }
        count = data.length;
      });

    return count;
  };

  const getSalesCount = async (data) => {
    let count = 0;
    let url = `${API_SERVER}/pos/v1/syncProgress/lastSaleDate`;
    let params = {
      businessCity: data.businessCity,
      businessId: data.businessId
    };

    await axios
      .get(url, { params: params })
      .then((res) => {
        console.log(res.data);

        if (res.data) {
          count = res.data.salesCount;
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return count;
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const logout = () => {
    navigate('/login', { replace: true });
    // localStorage.setItem('token', null);
    // localStorage.setItem('signedIn', false);
  };

  const handleChangeBusiness = () => {
    navigate('/selectBusiness');
  };

  useEffect(() => {
    setUserName(localStorage.getItem('userName'));
  }, []);

  const getPrintData = async (
    businessCity,
    businessId,
    invoiceType,
    invoiceId,
    id,
    type,
    txnSettings
  ) => {
    const params = {
      businessCity: businessCity,
      businessId: businessId,
      invoiceType: invoiceType,
      invoiceId: invoiceId,
      id: id,
      type: 'pos'
    };

    await axios
      .get(API_SERVER + '/pos/v1/printer/printData', { params })
      .then(async (response) => {
        if (response) {
          if (
            response.data &&
            response.data.notification &&
            response.data.notification.body
          ) {
            let payloadData = response.data.notification.body;

            if (payloadData !== null && payloadData !== undefined) {
              if (payloadData.settings) {
                setSettingsData(payloadData.settings);
              }
              if (payloadData.screenName && payloadData.screenName.length > 0) {
                setScreenName(payloadData.screenName);
              }
              if (payloadData.printData) {
                setPrintData(payloadData.printData);
                if (payloadData.printData) {
                  console.log('invoiceThermal obj is: ', txnSettings);
                  if (txnSettings && !txnSettings.boolDefault) {
                    setIsStartPrint(true);
                    setPrintSelectionAlert(true);
                    setTimeout(() => {
                      handleAlertClose();
                    }, 500);
                  } else {
                    onIsStartPrint(
                      payloadData.printData,
                      payloadData.screenName,
                      txnSettings
                    );
                  }
                  handleClose();
                }
              }
            }
          }
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const onIsStartPrint = async (printData, screenName, invoiceThermal) => {
    let printBalance = await balanceUpdate.getCustomerBalanceById(
      printData.vendor_id
    );

    let printContent = {};

    if ('Sales' === screenName) {
      printContent = InvoiceThermalPrintContent(
        invoiceThermal,
        printData,
        printBalance,
        settingsData,
        'Sales'
      );
    } else if ('Kot' === screenName) {
      printContent = KOTFullBillThermalPrintContent(
        invoiceThermal,
        printData.ordersData && printData.ordersData[0],
        settingsData
      );
    } else if ('Kot Kitchen' === screenName) {
      printContent = KOTInvoiceThermalPrintContent(
        invoiceThermal,
        printData.ordersData && printData.ordersData[0]
      );
    }

    if (invoiceThermal.boolCustomization) {
      const customData = {
        pageSize: invoiceThermal.boolPageSize,
        width: invoiceThermal.customWidth,
        pageWidth: invoiceThermal.pageSizeWidth,
        pageHeight: invoiceThermal.pageSizeHeight,
        margin: invoiceThermal.customMargin
      };
      printContent.customData = customData;
    }
    let copies =
      invoiceThermal.printOriginalCopies > 0
        ? invoiceThermal.printOriginalCopies
        : 1;
    for (let i = 0; i < copies; i++) {
      printThermal(printContent);
    }
  };

  const handleOpenVideoTutorials = () => {
    const win = window.open(
      'https://youtube.com/playlist?list=PLxnpmUozNLw1ivTN6it-KibMlePcGveKI',
      '_blank'
    );
    if (win != null) {
      win.focus();
    }
  };

  const handleAlertClose = () => {
    setPrintSelectionAlert(false);
  };

  return (
    <div>
      {openLoader && <ProgressBar perc={perc} />}
      <AppBar className={clsx(classes.root)} elevation={0} {...rest}>
        <Toolbar className={classes.toolbar}>
          <Logo
            className={classes.avatar}
            style={{ display: 'flex', alignItems: 'center', padding: 2 }}
          />

          <Box className={classes.typography} style={{ marginLeft: '8px' }}>
            <Typography variant="h5" component="h6">
              OneShell
            </Typography>
          </Box>
          <Box className={classes.userName}>
            <Typography
              variant="h5"
              component="h6"
              style={{ display: 'inline', fontSize: '15px' }}
              noWrap
            >
              Hello {username} !
            </Typography>
          </Box>
          <div
            style={{
              width: '100%',
              textAlign: 'end',
              marginTop: 10,
              marginBottom: 10
            }}
          >
            {window.navigator.onLine ? (
              <Typography
                variant="h5"
                component="h6"
                style={{
                  display: 'inline',
                  color: 'green',
                  fontStyle: 'bold',
                  fontSize: 16
                }}
                className={classes.customerSupport}
                noWrap
              >
                ONLINE
              </Typography>
            ) : (
              <Typography
                variant="h5"
                component="h6"
                style={{
                  display: 'inline',
                  color: 'red',
                  fontStyle: 'bold',
                  fontSize: 16
                }}
                className={classes.customerSupport}
                noWrap
              >
                OFFLINE
              </Typography>
            )}

            <Typography
              variant="h5"
              component="h6"
              style={{ display: 'inline' }}
              className={classes.customerSupport}
              noWrap
              onClick={handleCustomerSupportDialogOpen}
            >
              Customer Support
            </Typography>

            <Typography
              variant="h5"
              component="h6"
              style={{ display: 'inline' }}
              className={classes.videoTutorial}
              noWrap
              onClick={handleOpenVideoTutorials}
            >
              Video Tutorials
            </Typography>

            {Number(localStorage.getItem('businessListLength')) > 1 && (
              <Typography
                variant="h5"
                component="h6"
                style={{ display: 'inline' }}
                className={classes.changeBusiness}
                noWrap
                onClick={handleChangeBusiness}
              >
                Change Business
              </Typography>
            )}

            <Typography
              variant="h5"
              component="h6"
              style={{ display: 'inline' }}
              className={classes.logout}
              noWrap
            >
              <RouterLink to="/faq" className={classes.faq}>
                FAQ
              </RouterLink>
            </Typography>
            <Typography
              variant="h5"
              component="h6"
              style={{ display: 'inline' }}
              className={classes.logout}
              onClick={handleClickOpen}
              noWrap
            >
              Logout
            </Typography>
            <CustomerSupportModal />

            <Dialog
              fullScreen={fullScreen}
              open={open}
              onClose={handleClose}
              maxWidth={maxWidth}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title" onClose={handleClose}>
                OneShell
              </DialogTitle>

              <DialogContent>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Logo style={{ display: 'flex', width: '30px' }} />
                  <Typography gutterBottom style={{ marginLeft: '10px' }}>
                    Are you sure you want to quit the app?
                  </Typography>
                </div>
              </DialogContent>
              <DialogActions>
                {/* <div style={{ marginLeft: '12px' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={dontAsk}
                      onChange={handleChange}
                      name="dontAsk"
                    />
                  }
                  label="don't ask again"
                />
              </div> */}
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div style={{ marginLeft: '100px' }}>
                    <Button variant="contained" onClick={logout}>
                      Yes
                    </Button>
                  </div>

                  <Button variant="contained" onClick={handleClose}>
                    No
                  </Button>
                </div>
              </DialogActions>
            </Dialog>
          </div>
        </Toolbar>
      </AppBar>
      <Dialog
        open={openPrintSelectionAlert}
        onClose={handleAlertClose}
        aria-labelledby="responsive-dialog-title"
        style={{ display: 'none' }}
      >
        <DialogContent>
          <DialogContentText>
            <ComponentToPrint
              data={printData}
              printMe={isStartPrint}
              isThermal={true}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAlertClose} color="primary" autoFocus>
            PROCEED TO PRINT
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

TopBar.propTypes = {
  className: PropTypes.string,
  onMobileNavOpen: PropTypes.func
};

export default InjectObserver(TopBar);