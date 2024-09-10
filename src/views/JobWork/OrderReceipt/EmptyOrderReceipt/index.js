import React from 'react';
import { makeStyles } from '@material-ui/core';
import Controls from '../../../../components/controls/index';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import './Style.css';
import AddnewPayment from '../AddOrderReceipt';
import paymentOut from '../../../../icons/svg/Payment_out.svg';

const useStyles = makeStyles((theme) => ({
  newButton: {
    position: 'relative',
    borderRadius: 25,
    background :'#9DCB6A',
    '&:hover' : {
    background : '#9DCB6A'
    }
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

const EmptyOrderReceipt = () => {
  const classes = useStyles();

  return (
    <div className={classes.divalign}>
      <img
        src={paymentOut}
        className={classes.Applogo}
        alt="logo"
      />
    </div>
  );
};

export default InjectObserver(EmptyOrderReceipt);
