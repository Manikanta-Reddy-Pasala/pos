import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import Controls from '../../../../components/controls/index';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import './Style.css';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import AddPurchaseReturn from '../AddDebitNote/index';
import purchaseReturn from '../../../../icons/svg/purchase_returns.svg';

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
const EmptyPurchaseReturn = () => {
  const classes = useStyles();

  const store = useStore();
  const { openForNewReturn } = store.PurchasesReturnsAddStore;

  const addCreditNotesPurchaseReturn = () => {
    openForNewReturn();
  };

  return (
    <Paper className={classes.pageContent}>
      <div className={classes.divalign}>
        <img
          src={purchaseReturn}
          className={classes.Applogo}
          alt="logo"
        />
        <p>
          <Controls.Button
            text="+ Add Your First Purchase Return"
            size="small"
            variant="contained"
            className={classes.newButton}
            onClick={() => addCreditNotesPurchaseReturn()}
          />
          <AddPurchaseReturn />
        </p>
      </div>
    </Paper>
  );
};

export default InjectObserver(EmptyPurchaseReturn);
