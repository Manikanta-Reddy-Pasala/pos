import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import './Style.css';
import no_permission from '../../icons/svg/no_permission.svg';

const useStyles = makeStyles((theme) => ({
  newButton: {
    position: 'relative',
    borderRadius: 25
  },
  Applogo: {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing(3),
    width: '35%'
  },
  sorryText: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  divalign: {
    width: '500px',
    height: '500px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto'
  },
  divAlignment: {
    width: '500px',
    height: '570px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto'
  }
}));

const NoPermission = (props) => {
  const classes = useStyles();

  return (
    <div
      className={
        props.page === 'printers' ? classes.divAlignment : classes.divalign
      }
    >
      <img src={no_permission} className={classes.Applogo} alt="logo" />
      <Typography variant="h5" className={classes.sorryText}>
        Sorry! You do not have permission access.
      </Typography>
    </div>
  );
};

export default InjectObserver(NoPermission);
