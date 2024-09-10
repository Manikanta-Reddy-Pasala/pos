import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import { Container, Grid, makeStyles } from '@material-ui/core';
import Page from '../../../../components/Page';

import InjectObserver from '../../../../Mobx/Helpers/injectWithObserver';
import CustomerList from './Customer';
import TransactionTable from './Transaction';
import * as Bd from '../../../../components/SelectedBusiness';
import BubbleLoader from '../../../../components/loader';
import NoPermission from '../../../noPermission';

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

const AccountsPayableCustomerReport = () => {
  const classes = useStyles();
  const [isLoading, setLoadingShown] = useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();

    setTimeout(() => setLoadingShown(false), 200);
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Accounts Report')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <Page className={classes.root} title="Customers">
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div className={classes.root}>
          {isFeatureAvailable ? (
            <Container maxWidth={false} className={classes.sideList}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                spacing={1}
              >
                <Grid
                  item
                  xs={12}
                  sm={4}
                  md={3}
                  className={classes.gridControl}
                >
                  <Paper>
                    <CustomerList />
                  </Paper>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={8}
                  md={9}
                  className={classes.gridControl}
                >
                  <Paper className={classes.sideList}>
                    <TransactionTable />
                  </Paper>
                </Grid>
              </Grid>
            </Container>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </Page>
  );
};

export default InjectObserver(AccountsPayableCustomerReport);
