import React from 'react';
import { makeStyles } from '@material-ui/core';
import Controls from '../../../components/controls/index';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import './Style.css';
import cash_in_hand from '../../../icons/svg/cash_in_hand_first.svg';
import AddRate from '../AddRate';

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
  }
}));

const EmptyRate = () => {
  const classes = useStyles();
  const store = useStore();
  const { handleRateModalOpen } = store.RateStore;

  const addFirstRate = () => {
    handleRateModalOpen();
  };

  return (
    <div className={classes.divalign}>
      <img
        src={cash_in_hand}
        className={classes.Applogo}
        alt="logo"
      />
      <p>
        <Controls.Button
          text="+ Add your first Rate"
          size="small"
          variant="contained"
          color="primary"
          className={classes.newButton}
          onClick={() => addFirstRate()}
        />
        <AddRate fullWidth maxWidth="sm" />{' '}
      </p>
    </div>
  );
};

export default InjectObserver(EmptyRate);
