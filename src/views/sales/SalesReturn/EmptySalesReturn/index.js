import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
import Controls from '../../../../components/controls/index';
import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import AddSalesReturn from '../AddCreditNote/index';
import { useStore } from '../../../../Mobx/Helpers/UseStore';
import saleReturn from '../../../../icons/svg/sales_return.svg';
import './Style.css';

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

const EmptySalesReturn = () => {
  const classes = useStyles();

  const store = useStore();
  const { openForNewReturn } = store.ReturnsAddStore;

  const addCreditNotesSalesReturn = () => {
    openForNewReturn();
  };

  return (
    <Paper className={classes.pageContent}>
      <div className={classes.divalign}>
        <img
          src={saleReturn}
          className={classes.Applogo}
          alt="logo"
        />
        <p>
          <Controls.Button
            text="+ Add Your First Sale Return"
            size="small"
            variant="contained"
            color="primary"
            className={classes.newButton}
            onClick={() => addCreditNotesSalesReturn()}
          />
          <AddSalesReturn />
        </p>
      </div>
    </Paper>
  );
};

export default InjectObserver(EmptySalesReturn);
