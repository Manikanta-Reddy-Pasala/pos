import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  Grid,
  FormControl,
  Select,
  MenuItem,
  TextField,
  DialogContentText,
  useMediaQuery,
  useTheme
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

const EWayCancel = (props) => {
  const classes = useStyles();
  const stores = useStore();

  const {
    openEWayCancelModal,
    eWayBillNo,
    openCancelErrorAlertMessage,
    cancelErrorMessage,
    openCancelLoadingAlertMessage,
    handleOpenCancelEWayLoadingModal
  } = toJS(stores.EWayStore);
  const {
    handleCloseEWayCancelModal,
    cancelEWay,
    handleCloseCancelEWayErrorModal
  } = stores.EWayStore;
  const [reasonList] = useState(ewayHelper.getCancelEWayReasonCodes());
  const [reason, setReason] = useState('Duplicate');
  const [remark, setRemark] = useState('');

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const saveCancelEWay = async () => {
    let cancelData = {
      cancelRmrk: '',
      cancelRsnCode: 0
    };

    let result = await ewayHelper
      .getCancelEWayReasonCodes()
      .find((e) => e.name === reason);

    if (result) {
      cancelData.cancelRsnCode = result.val;
    }
    cancelData.cancelRmrk = remark;

    handleOpenCancelEWayLoadingModal();
    cancelEWay(cancelData);
  };

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={openEWayCancelModal}
        onClose={() => handleCloseEWayCancelModal()}
      >
        <DialogTitle
          id="responsive-dialog-title"
          onClose={() => handleCloseEWayCancelModal()}
        >
          Cancel E-Way
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
                  minRows="5"
                  className="customTextField"
                  value={remark}
                  onChange={(event) => setRemark(event.target.value)}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => saveCancelEWay()}>
            Yes
          </Button>
          <Button
            style={{ marginLeft: '10px' }}
            variant="contained"
            onClick={() => handleCloseEWayCancelModal()}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullScreen={fullScreen}
        open={openCancelLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the E-Way bill is being cancelled</p>
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
        open={openCancelErrorAlertMessage}
        onClose={handleCloseCancelEWayErrorModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{cancelErrorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseCancelEWayErrorModal}
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

export default EWayCancel;