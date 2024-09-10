import React, {useState} from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';
import Logo from '../Logo';
import Dialog from '@material-ui/core/Dialog';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

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
          onClick={()=>onClose()}
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

const RestoreModal = (props) => {
  const classes = useStyles();
  const {onRestore, onRestoreClose}= props;
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [maxWidth, setMaxWidth] = React.useState('sm');


  return (
    <Dialog
    fullScreen={fullScreen}
    open={true}
    onClose={()=>onRestoreClose()}
    maxWidth={maxWidth}
    aria-labelledby="responsive-dialog-title"
  >
    <DialogTitle id="responsive-dialog-title" onClose={()=>onRestoreClose()}>
      Restore Transaction Alert!
    </DialogTitle>

    <DialogContent>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo style={{ display: 'flex', width: '30px' }} />
        <Typography gutterBottom style={{ marginLeft: '10px' }}>
          Are you sure you want to restore this transaction?
        </Typography>
      </div>
    </DialogContent>
    <DialogActions>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ marginLeft: '100px' }}>
          <Button variant="contained" onClick={()=>onRestore(true)}>
            Yes
          </Button>
        </div>
        <Button style={{marginLeft: '10px'}} variant="contained" onClick={()=>onRestoreClose()}>
          No
        </Button>
      </div>
    </DialogActions>
  </Dialog>
  );
};

export default RestoreModal;
