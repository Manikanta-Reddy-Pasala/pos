import React from 'react';
import { makeStyles } from '@material-ui/core';
import Controls from '../../../components/controls/index';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import AddEmployee from '../modal/AddEmployee';
import './Style.css';
import customer from '../../../icons/svg/customer.svg';

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

const EmptyEmployee = () => {
  const classes = useStyles();
  const store = useStore();
  const { handleEmployeeModalOpen } =
    store.EmployeeStore;

  const addFirstEmployee = () => {
    handleEmployeeModalOpen();
  };

  return (
    <div className={classes.divalign}>
      <img
        src={customer}
        className={classes.Applogo}
        alt="logo"
      />
      <p>
        <Controls.Button
          text="+ Add Your First Employee"
          size="small"
          variant="contained"
          color="primary"
          className={classes.newButton}
          onClick={() => addFirstEmployee()}
        />
        <AddEmployee fullWidth maxWidth="sm" />{' '}
      </p>
    </div>
  );
};

export default InjectObserver(EmptyEmployee);
