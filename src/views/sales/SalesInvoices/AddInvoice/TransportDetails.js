import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  Grid,
  Select,
  MenuItem,
  TextField,
  OutlinedInput
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
import * as ewayHelper from 'src/components/Helpers/EWayHelper';

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

const TransportDetails = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { fullWidth, maxWidth } = props;

  const { saleDetails, openTransportDetails } = toJS(stores.SalesAddStore);
  const {
    handleCloseTransportDetails,
    setTransportMode,
    setVehicleNo,
    setVehicleType,
    setApproxDistance,
    setTransporterName,
    setTransporterId
  } = stores.SalesAddStore;

  const [transportModeList] = useState(ewayHelper.getTransportationModes());
  const [vehicleTypeList] = useState(ewayHelper.getVehicleTypes());

  const saveTransportDetails = async () => {
    handleCloseTransportDetails();
  };

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={openTransportDetails}
      onClose={() => handleCloseTransportDetails()}
    >
      <DialogTitle
        id="responsive-dialog-title"
        onClose={() => handleCloseTransportDetails()}
      >
        Transport Details
      </DialogTitle>

      <DialogContent>
        <Grid container direction="row" alignItems="stretch">
          {/********* Transportation Details *********/}
          <Grid container spacing={2} className={classes.gridStyle}>
            <Grid item xs={12} style={{ marginLeft: '15px' }}>
              <Grid container spacing={2} className={classes.gridRow}>
                <Grid item xs={12}>
                  <TextField
                    label="Transporter Name"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={saleDetails.transporterName}
                    onChange={(e) => {
                      setTransporterName(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: '16px' }}>
                  <TextField
                    label="Transporter ID"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={saleDetails.transporterId}
                    onChange={(e) => {
                      setTransporterId(e.target.value);
                    }}
                  />
                </Grid>
                <Grid item xs={12} style={{ marginTop: '16px' }}>
                  <TextField
                    label="Approx Distance in KM"
                    variant="outlined"
                    fullWidth
                    required
                    value={saleDetails.approxDistance}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) => {
                      setApproxDistance(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
              <br />
            </Grid>
          </Grid>

          <Grid container spacing={2} className={classes.gridStyle}>
            <Grid
              item
              xs={12}
              style={{ marginLeft: '16px', marginTop: '16px' }}
            >
              <Grid container className={classes.gridRow} spacing={2}>
                <Grid item xs={12}>
                  <Select
                    displayEmpty
                    value={saleDetails.transportMode}
                    input={<OutlinedInput style={{ width: '100%' }} />}
                    onChange={(e) => {
                      setTransportMode(e.target.value);
                    }}
                  >
                    {transportModeList.map((option, index) => (
                      <MenuItem value={option.name}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} style={{ marginTop: '16px' }}>
                  <Select
                    displayEmpty
                    value={saleDetails.vehicleType}
                    input={<OutlinedInput style={{ width: '100%' }} />}
                    onChange={(e) => {
                      setVehicleType(e.target.value);
                    }}
                  >
                    {vehicleTypeList.map((option, index) => (
                      <MenuItem value={option.name}>{option.name}</MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} style={{ marginTop: '16px' }}>
                  <TextField
                    label="Vehicle No."
                    variant="outlined"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={saleDetails.vehicleNo}
                    onChange={(e) => {
                      setVehicleNo(e.target.value);
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => saveTransportDetails()}>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransportDetails;