import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  OutlinedInput,
  useMediaQuery,
  useTheme,
  DialogContentText
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import getStateList from '../../../components/StateList';
import * as ewayHelper from 'src/components/Helpers/EWayHelper';
import * as Bd from 'src/components/SelectedBusiness';
import Loader from 'react-js-loader';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#FFFFFF',
    color: '#CCCCCC'
  },
  avatar: {
    width: 60,
    height: 60
  },
  toolbar: {
    minHeight: '20px'
  },
  typography: {
    position: 'absolute',
    paddingRight: 0,
    paddingLeft: '3%',
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
      cursor: 'pointer'
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
    top: theme.spacing(0),
    color: theme.palette.grey[500]
  }
});

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
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
          onClick={() => onClose()}
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

const EWayExtend = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { fullWidth, maxWidth } = props;

  const {
    openEWayExtendModal,
    eWayBillNo,
    invoiceDetails,
    openExtendLoadingAlertMessage,
    openExtendErrorAlertMessage,
    updateExtendErrorMessage
  } = toJS(stores.EWayStore);
  const {
    handleCloseEWayExtendModal,
    extendEWay,
    handleOpenExtendEWayLoadingModal,
    handleCloseExtendEWayErrorModal
  } = stores.EWayStore;
  const [reasonList] = useState(ewayHelper.getExtendEWayReasonCodes());
  const [reason, setReason] = useState('Natural Calamity');
  const [remark, setRemark] = useState('');
  const [stateList] = useState(getStateList());
  const [dispatchFromState, setDispatchFromState] = useState('');
  const [place, setPlace] = useState('');
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [transportModeList] = useState(ewayHelper.getTransportationModes());
  const [transportMode, setTransportMode] = useState('Road');
  const [transporterDocNo, setTransporterDocNo] = useState('');
  const [vehicleNo, setVehicleNo] = useState('');
  const [transporterDocDate, setTransporterDocDate] = useState('');
  const [pincode, setPincode] = useState('');
  const [fromAddress, setFromAddress] = useState('');
  const [vehicleTypeList] = useState(ewayHelper.getVehicleTypes());
  const [vehicleType, setVehicleType] = useState('Regular');
  const [consignmentStatusList] = useState(ewayHelper.getConsignmentStatus());
  const [consignmentStatus, setConsignmentStatus] = useState('inMovement');

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const saveExtendEWay = async () => {
    if (place === '') {
      setErrorMessage(
        'Dispatch Place cannot be left blank. Please provide it to proceed with extension of E-Way.'
      );
      setErrorAlertMessage(true);
    } else if (dispatchFromState === '') {
      setErrorMessage(
        'Dispatch State cannot be left blank. Please provide it to proceed with extension of E-Way.'
      );
      setErrorAlertMessage(true);
    } else if (pincode === '') {
      setErrorMessage(
        'Dispatch Pincode cannot be left blank. Please provide it to proceed with extension of E-Way.'
      );
      setErrorAlertMessage(true);
    } else if (remainingDistance === 0) {
      setErrorMessage(
        'Remaining distance cannot be 0. Please provide valid distance to proceed with extension of E-Way.'
      );
      setErrorAlertMessage(true);
    } else {
      let extendData = {
        vehicleNo: '',
        fromPlace: '',
        fromState: 0,
        remainingDistance: 0,
        transDocNo: '',
        transDocDate: '',
        transMode: 0,
        extnRsnCode: 0,
        extnRemarks: '',
        fromPincode: 0,
        consignmentStatus: '',
        transitType: '',
        addressLine1: '',
        addressLine2: '',
        addressLine3: ''
      };

      extendData.vehicleNo = vehicleNo;
      extendData.fromPlace = place;

      let stateResult = await getStateList().find(
        (e) => e.name === dispatchFromState
      );

      if (stateResult) {
        extendData.fromState = stateResult.code;
      }
      extendData.remainingDistance = remainingDistance;
      extendData.transDocNo = transporterDocNo;
      extendData.transDocDate = transporterDocDate;

      let transModeResult = await ewayHelper
        .getTransportationModes()
        .find((e) => e.name === transportMode);

      if (transModeResult) {
        extendData.transMode = transModeResult.val;
      }

      let reasonCodeResult = await ewayHelper
        .getExtendEWayReasonCodes()
        .find((e) => e.name === reason);

      if (reasonCodeResult) {
        extendData.extnRsnCode = reasonCodeResult.val;
      }

      extendData.extnRemarks = remark;
      extendData.consignmentStatus = consignmentStatus;
      extendData.fromPincode = pincode;
      extendData.addressLine1 = fromAddress;
      extendData.addressLine2 = fromAddress;
      extendData.addressLine3 = fromAddress;

      handleOpenExtendEWayLoadingModal();
      extendEWay(extendData);
    }
  };

  useEffect(() => {
    if (invoiceDetails && invoiceDetails.ewayBillDetails) {
      let stateResult = getStateList().find(
        (e) =>
          e.code === invoiceDetails.ewayBillDetails.fromStateCode.toString()
      );

      if (stateResult) {
        setDispatchFromState(stateResult.name);
      }

      setPincode(invoiceDetails.ewayBillDetails.fromPincode);

      if (invoiceDetails.ewayBillDetails.fromAddr1 !== '') {
        setFromAddress(invoiceDetails.ewayBillDetails.fromAddr1);
      }

      if (invoiceDetails.ewayBillDetails.fromPlace !== '') {
        setPlace(invoiceDetails.ewayBillDetails.fromPlace);
      }

      if (invoiceDetails.ewayBillDetails.transDocNo !== '') {
        setTransporterDocNo(invoiceDetails.ewayBillDetails.transDocNo);
      }

      if (invoiceDetails.ewayBillDetails.transDocDate !== '') {
        setTransporterDocDate(invoiceDetails.ewayBillDetails.transDocDate);
      }

      if (invoiceDetails.ewayBillDetails.vehicleNo !== '') {
        setVehicleNo(invoiceDetails.ewayBillDetails.vehicleNo);
      }

      let transModeResult = ewayHelper
        .getTransportationModes()
        .find((e) => e.val === invoiceDetails.ewayBillDetails.transMode);

      if (transModeResult) {
        setTransportMode(transModeResult.name);
      }
    }
  }, [invoiceDetails]);

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openEWayExtendModal}
        onClose={() => handleCloseEWayExtendModal()}
      >
        <DialogTitle
          id="responsive-dialog-title"
          onClose={() => handleCloseEWayExtendModal()}
        >
          Extend E-Way
        </DialogTitle>

        <DialogContent>
          <Grid container direction="row" alignItems="stretch">
            <Grid item md={12} sm={12} className="grid-padding">
              <Typography variant="h5" className={classes.titleUnderline}>
                E-Way Bill No: {eWayBillNo}
              </Typography>
            </Grid>
            <Grid item xs={12} style={{ marginTop: '25px' }}>
              <Grid item xs={12}>
                <Typography
                  className={classes.oneShellColor}
                  style={{ textTransform: 'none' }}
                  variant="button"
                >
                  Dispatch From
                </Typography>
              </Grid>
              <br />
              <Grid
                container
                spacing={2}
                className={classes.gridRow}
                style={{ marginRight: '16px' }}
              >
                <Grid item xs={12}>
                  <Grid container spacing={2} className={classes.gridCol}>
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        label="From Address"
                        multiline
                        rows={2}
                        value={fromAddress}
                        onChange={(e) => {
                          setFromAddress(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Place"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={place}
                        onChange={(e) => {
                          setPlace(e.target.value);
                        }}
                      />
                    </Grid>

                    <Grid item xs={6} style={{ marginTop: '16px' }}>
                      <TextField
                        label="Pincode"
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value);
                        }}
                      />
                    </Grid>

                    <Grid item xs={6} style={{ marginTop: '16px' }}>
                      <Select
                        displayEmpty
                        value={dispatchFromState}
                        input={<OutlinedInput style={{ width: '100%' }} />}
                        onChange={(e) => {
                          setDispatchFromState(e.target.value);
                        }}
                      >
                        {stateList.map((option, index) => (
                          <MenuItem value={option.name}>{option.name}</MenuItem>
                        ))}
                      </Select>
                    </Grid>

                    <Grid item xs={12} style={{ marginTop: '16px' }}>
                      <TextField
                        label="Remaining Distance in Km"
                        variant="outlined"
                        fullWidth
                        required
                        type="number"
                        InputLabelProps={{ shrink: true }}
                        value={remainingDistance}
                        onChange={(e) => {
                          setRemainingDistance(e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} className={classes.gridStyle}>
              <Grid item xs={12} style={{ marginTop: '25px' }}>
                <Grid item xs={6}>
                  <Typography
                    className={classes.oneShellColor}
                    style={{ textTransform: 'none' }}
                    variant="button"
                  >
                    Part B
                  </Typography>
                </Grid>
                <br />
                <Grid container className={classes.gridRow} spacing={2}>
                  <Grid item xs={6}>
                    <Select
                      displayEmpty
                      value={transportMode}
                      input={<OutlinedInput style={{ width: '100%' }} />}
                      onChange={(event) => setTransportMode(event.target.value)}
                    >
                      {transportModeList.map((option, index) => (
                        <MenuItem value={option.name}>{option.name}</MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid item xs={6}>
                    <Select
                      displayEmpty
                      value={consignmentStatus}
                      input={<OutlinedInput style={{ width: '100%' }} />}
                      onChange={(event) =>
                        setConsignmentStatus(event.target.value)
                      }
                    >
                      {consignmentStatusList.map((option, index) => (
                        <MenuItem value={option.name}>{option.name}</MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid item xs={6} style={{ marginTop: '16px' }}>
                    <Select
                      displayEmpty
                      value={vehicleType}
                      input={<OutlinedInput style={{ width: '100%' }} />}
                      onChange={(event) => setVehicleType(event.target.value)}
                    >
                      {vehicleTypeList.map((option, index) => (
                        <MenuItem value={option.name}>{option.name}</MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  <Grid item xs={6} style={{ marginTop: '16px' }}>
                    <TextField
                      label="Vehicle No."
                      variant="outlined"
                      fullWidth
                      required
                      value={vehicleNo}
                      InputLabelProps={{ shrink: true }}
                      onChange={(event) => setVehicleNo(event.target.value)}
                    />
                  </Grid>
                </Grid>
                <br />
                <Grid
                  container
                  className={classes.gridRow}
                  style={{ marginTop: '16px' }}
                >
                  <Grid item xs={6}>
                    <TextField
                      label="Transporter Doc No."
                      variant="outlined"
                      fullWidth
                      value={transporterDocNo}
                      InputLabelProps={{ shrink: true }}
                      onChange={(event) =>
                        setTransporterDocNo(event.target.value)
                      }
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      type="date"
                      label="Transporter Doc Date"
                      InputLabelProps={{ shrink: true }}
                      value={transporterDocDate}
                      onChange={(event) =>
                        setTransporterDocDate(event.target.value)
                      }
                      style={{ color: '#000000', fontSize: 'small' }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              md={6}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Reason</Typography>
                <Select
                  value={reason}
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  style={{ marginTop: '8px', marginBottom: '4px' }}
                  className="customTextField"
                  onChange={(event) => setReason(event.target.value)}
                >
                  {reasonList.map((option, index) => (
                    <MenuItem value={option.name}>{option.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              md={12}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Remark</Typography>
                <TextField
                  fullWidth
                  multiline
                  variant="outlined"
                  margin="dense"
                  type="text"
                  rows="5"
                  className="customTextField"
                  value={remark}
                  onChange={(event) => setRemark(event.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => saveExtendEWay()}>
            Yes
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            variant="contained"
            onClick={() => handleCloseEWayExtendModal()}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openExtendLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while E-Way bill is being extended</p>
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
        open={openExtendErrorAlertMessage}
        onClose={handleCloseExtendEWayErrorModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{updateExtendErrorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseExtendEWayErrorModal}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EWayExtend;