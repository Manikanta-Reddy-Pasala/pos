import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  Grid,
  FormControl,
  TextField,
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

const EWayTransporter = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const { fullWidth, maxWidth } = props;

  const {
    openEWayUpdateTransporterModal,
    eWayBillNo,
    openUpdateTransporterLoadingAlertMessage,
    openUpdateTransporterErrorAlertMessage,
    updateTransporterErrorMessage
  } = toJS(stores.EWayStore);
  const {
    handleCloseEWayUpdateransporterModal,
    updateTransporterEWay,
    handleCloseUpdateTransporterEWayErrorModal,
    handleOpenUpdateTransporterEWayLoadingModal
  } = stores.EWayStore;
  const [transporterId, setTransporterId] = useState('');
  const [transporterIdNotSetMsg, setTransporterIdNotSetMsg] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const saveUpdateTransporterEWay = async () => {
    if (transporterId === '') {
      setTransporterIdNotSetMsg('Transporter ID not provided');
      return;
    }

    handleOpenUpdateTransporterEWayLoadingModal();
    updateTransporterEWay(transporterId);
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openEWayUpdateTransporterModal}
        onClose={() => handleCloseEWayUpdateransporterModal()}
      >
        <DialogTitle
          id="responsive-dialog-title"
          onClose={() => handleCloseEWayUpdateransporterModal()}
        >
          Update Transporter E-Way
        </DialogTitle>

        <DialogContent>
          <Grid container direction="row" alignItems="stretch">
            <Grid item md={12} sm={12} className="grid-padding">
              <Typography variant="h5" className={classes.titleUnderline}>
                E-Way Bill No: {eWayBillNo}
              </Typography>
            </Grid>

            <Grid
              item
              md={12}
              sm={12}
              className="grid-padding"
              style={{ marginTop: '16px' }}
            >
              <FormControl fullWidth>
                <Typography variant="subtitle1">Transporter ID</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  type="text"
                  className="customTextField"
                  value={transporterId}
                  error={transporterIdNotSetMsg !== ''}
                  helperText={
                    transporterIdNotSetMsg !== '' ? transporterIdNotSetMsg : ''
                  }
                  onChange={(event) => {
                    setTransporterId(event.target.value);
                    setTransporterIdNotSetMsg('');
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => {
              saveUpdateTransporterEWay();
            }}
          >
            Yes
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            variant="contained"
            onClick={() => handleCloseEWayUpdateransporterModal()}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openUpdateTransporterLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>
                  Please wait while the transporter details of E-Way bill are
                  being updated
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
        open={openUpdateTransporterErrorAlertMessage}
        onClose={handleCloseUpdateTransporterEWayErrorModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{updateTransporterErrorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseUpdateTransporterEWayErrorModal}
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

export default EWayTransporter;
