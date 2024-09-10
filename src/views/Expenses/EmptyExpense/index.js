import React from 'react';
import { makeStyles } from '@material-ui/core';
import Controls from '../../../components/controls/index';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import AddExpenses from '../Modal/AddExpenses';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import expenses from '../../../icons/svg/expenses.svg';

const useStyles = makeStyles((theme) => ({
    newButton: {
      position: 'relative',
      borderRadius: 25,
      marginTop: 25,
      minWidth: 200,
      fontWeight: 400,
      background: '#FAA515'
    },
    Applogo: {
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '30%'
    },
    Appheader: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
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

const EmptyExpense = () => {
    const classes = useStyles();
    const stores = useStore();
    const { handleAddexpensesModalOpen } = stores.ExpensesStore;

    return (
        <div className={classes.divalign}>
          <img
            src={expenses}
            className={classes.Applogo}
            alt="logo"
          />

          <p>
            <Controls.Button
              text="Add your first Expenses"
              size="small"
              variant="contained"
              className={classes.newButton}
              onClick={handleAddexpensesModalOpen}

            />
          <AddExpenses
            open={handleAddexpensesModalOpen}
            fullWidth
            maxWidth="sm"
          />
          </p>

        </div>
      );
}

export default InjectObserver(EmptyExpense);
