import React from 'react';
import { makeStyles } from '@material-ui/core';
import Controls from '../../../../components/controls/index';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import './Style.css';
import AddnewPayment from '../AddPayment';
import paymentIn from '../../../../icons/svg/Payment_in.svg';
import { toJS } from 'mobx';

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

const EmptyPaymentIn = () => {
  const classes = useStyles();
  const store = useStore();
  const { openForNewPaymnetIn } = store.PaymentInStore;
  const { OpenAddPaymentIn } = toJS(store.PaymentInStore);

  const addFirstPaymentIn = () => {
    openForNewPaymnetIn();
  };

  return (
    <div className={classes.divalign}>
      <img src={paymentIn} className={classes.Applogo} alt="logo" />
      <p>
        <Controls.Button
          text="+ Receive your first Payment"
          size="small"
          variant="contained"
          color="primary"
          className={classes.newButton}
          onClick={() => addFirstPaymentIn()}
        />
        {OpenAddPaymentIn ? <AddnewPayment /> : null}
      </p>
    </div>
  );
};

export default InjectObserver(EmptyPaymentIn);