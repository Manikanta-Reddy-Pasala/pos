import React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Page from '../../components/Page';
import Category from './Category';
import ExpenseTable from './ExpenseTable';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(1)
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  productCard: {
    height: '100%',
    backgroundColor: '#fff'
  },
  paper: {
    padding: 2
    // textAlign: 'center',
  },
  Table: {
    paddingTop: 10
  },
  gridControl: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  sideList: {
    padding: theme.spacing(1)
  },
  productHeader: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  productTable: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: 0,
    marginBottom: theme.spacing(1)
  }
}));

const ExpenseList = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Expenses">
      <Container maxWidth={false} className={classes.sideList}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={1}
        >
          <Grid item xs={12} sm={4} md={3} className={classes.gridControl}>
            <Paper className={classes.productCard}>
              <Category />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8} md={9} className={classes.gridControl}>
            <Paper className={classes.productTable}>
              <ExpenseTable />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default ExpenseList;
