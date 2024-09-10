import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { toJS } from 'mobx';
import { useStore } from '../../Mobx/Helpers/UseStore';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import AddExpenses from './Modal/AddExpenses';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'block',
    padding: 14,
    marginBottom: 15
  },
  price: {
    color: '#000000'
  },
  addExpenseBtn: {
    background: '#ffaf00',
    '&:hover': {
      backgroundColor: '#ffaf00'
    },
    color: 'white',
    borderRadius: '20px',
    padding: '8px 20px 8px 20px',
    textTransform: 'none',
    width: 'max-content'
  },
  categoryActionWrapper: {
    '& .category-actions-left': {
      '& > *': {
        backgroundColor: '#fff'
      }
    },
    '& .category-actions-right': {
      '& > *': {
        marginLeft: theme.spacing(2)
      }
    }
  }
}));

function ExpenseCategory() {
  const classes = useStyles();
  const store = useStore();
  const { handleAddexpensesModalOpen } = store.ExpensesStore;

  const { categoryList } = toJS(store.ExpensesStore);

  return (
    // <div className={classes.root}>
    <Grid
      container
      direction="row"
      justify="space-between"
      alignItems="center"
      className={classes.categoryActionWrapper}
    >
      <Grid item xs={6} className="category-actions-left">
        <div style={{ display: 'inline-block' }}>
          {categoryList.category && (
            <div>
              <Typography gutterBottom variant="h4" component="h4">
                {categoryList.category}
              </Typography>

              <Typography
                gutterBottom
                className={classes.price}
                variant="h6"
                component="h6"
              >
                ₹{categoryList.amount}
              </Typography>
            </div>
          )}
        </div>
      </Grid>
      <Grid item xs={6}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justify="flex-end"
          className="category-actions-right"
        >
          <Button
            size="small"
            variant="contained"
            onClick={handleAddexpensesModalOpen}
            className={classes.addExpenseBtn}
          >
            Add Expense
          </Button>
          <AddExpenses
            open={handleAddexpensesModalOpen}
            fullWidth
            maxWidth="sm"
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default InjectObserver(ExpenseCategory);
