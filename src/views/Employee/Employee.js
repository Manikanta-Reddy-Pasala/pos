import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from '../../components/Page';
import EmployeeList from './EmployeeList';
import EmployeeHeader from './EmployeeHeader';
import TransactionTable from './Transaction';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
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
  paper: {
    padding: 2
  },
  Table: {
    paddingTop: 10
  },
  sideList: {
    padding: theme.spacing(1)
  },

  productHeader: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  gridControl: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  },
  productCard: {
    height: '100%',
    backgroundColor: '#fff'
  }
}));

const Employee = () => {
  const classes = useStyles();

  return (
    <Page className={classes.root} title="Employee">
      <Container maxWidth={false} className={classes.sideList}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="stretch"
          spacing={1}
        >
          <Grid item xs={12} sm={4} md={3} className={classes.gridControl}>
            <Paper className={classes.productCard}>
              <EmployeeList />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8} md={9} className={classes.gridControl}>
            <Paper className={classes.sideList}>
              <EmployeeHeader />

              <TransactionTable />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Employee;
