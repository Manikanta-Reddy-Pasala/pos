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
import * as Bd from 'src/components/SelectedBusiness';
import getStateList from '../../../components/StateList';
import * as ewayHelper from 'src/components/Helpers/EWayHelper';
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

const EWayUpdatePartB = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { fullWidth, maxWidth } = props;

  const {
    openEWayUpdatePartBModal,
    eWayBillNo,
    invoiceDetails,
    openUpdatePartBLoadingAlertMessage,
    openUpdatePartBErrorAlertMessage,
    updatePartBErrorMessage
  } = toJS(stores.EWayStore);
  const {
    handleCloseEWayUpdatePartBModal,
    updatePartBEWay,
    handleCloseUpdatePartBEWayErrorModal,
    handleOpenUpdatePartBEWayLoadingModal
  } = stores.EWayStore;
  const [reasonList] = useState(ewayHelper.getUpdatePartBEWayReasonCodes());
  const [reason, setReason] = useState('Due to Break Down');
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

  const [errorMessage, setErrorMessage] = useState('');
  const [openErrorAlertMessage, setErrorAlertMessage] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleErrorAlertMessageClose = () => {
    setErrorAlertMessage(false);
    setErrorMessage('');
  };

  const saveUpdateBEWay = async () => {
    if (place === '') {
      setErrorMessage(
        'Dispatch Place cannot be left blank. Please provide it to proceed with updation of Part B.'
      );
      setErrorAlertMessage(true);
    } else if (dispatchFromState === '') {
      setErrorMessage(
        'Dispatch State cannot be left blank. Please provide it to proceed with extension of E-Way.'
      );
      setErrorAlertMessage(true);
    } else if (remark === '') {
      setErrorMessage(
        'Remarks cannot be left blank. Please provide it to proceed with extension of E-Way.'
      );
      setErrorAlertMessage(true);
    } else {
      let updatePartBData = {
        ewbNo: '',
        fromPlace: '',
        fromState: 0,
        transDocDate: '',
        transDocNo: '',
        transMode: 0,
        vehicleNo: '',
        reasonCode: 0,
        reasonRem: '',
        type: '',
        invoiceId: ''
      };

      let reasonCodeResult = await ewayHelper
        .getUpdatePartBEWayReasonCodes()
        .find((e) => e.name === reason);

      if (reasonCodeResult) {
        updatePartBData.reasonCode = reasonCodeResult.val;
      }

      let transModeResult = await ewayHelper
        .getTransportationModes()
        .find((e) => e.name === transportMode);

      if (transModeResult) {
        updatePartBData.transMode = transModeResult.val;
      }

      let stateResult = await getStateList().find(
        (e) => e.name === dispatchFromState
      );

      if (stateResult) {
        updatePartBData.fromState = stateResult.code;
      }
      updatePartBData.fromPlace = place;
      updatePartBData.transDocDate = transporterDocDate;
      updatePartBData.transDocNo = transporterDocNo;
      updatePartBData.vehicleNo = vehicleNo;
      updatePartBData.reasonRem = remark;

      handleOpenUpdatePartBEWayLoadingModal();
      updatePartBEWay(updatePartBData);
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
        open={openEWayUpdatePartBModal}
        onClose={() => handleCloseEWayUpdatePartBModal()}
      >
        <DialogTitle
          id="responsive-dialog-title"
          onClose={() => handleCloseEWayUpdatePartBModal()}
        >
          Update Part B E-Way
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

                    <Grid item xs={6}>
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
          <Button variant="contained" onClick={() => saveUpdateBEWay()}>
            Yes
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            variant="contained"
            onClick={() => handleCloseEWayUpdatePartBModal()}
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
        open={openUpdatePartBLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>
                  Please wait while the Part-B details of E-Way bill are being
                  updated
                </p>
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
        open={openUpdatePartBErrorAlertMessage}
        onClose={handleCloseUpdatePartBEWayErrorModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{updatePartBErrorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseUpdatePartBEWayErrorModal}
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

export default EWayUpdatePartB;
