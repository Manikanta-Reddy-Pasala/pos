import React, { useEffect, useState } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';

import TotalSales from './TotalSales';
import Sales from './Sales';
import Expenses from './Expenses';
import ExpensesAmount from './ExpensesAmount';
import Receivables from './Receivables';
import Payable from './Payable';
import Page from '../../components/Page';
import TransactionTable from './recentTransactionTable';
import RecentStockDetail from './recentStockDetails';
import LowAndExpiryStockAlertModal from './LowAndExpiryStockAlert';
import NoPermission from 'src/views/noPermission';
import * as Bd from '../../components/SelectedBusiness';

import * as schemaSync from '../../components/Helpers/SchemaSyncHelper';
import { getSaleName } from 'src/names/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#f6f8fa;',
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(1)
  },
  col_btwn: {
    marginBottom: '12px'
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  
  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
    }

    fetchData();
  }, []);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Dashboard')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <Page className={classes.root} title="Dashboard">
      <div>
        {isFeatureAvailable ? (
          <Container maxWidth={false}>
            <Grid container spacing={3}>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <TotalSales />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                <ExpensesAmount />
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                {/* <Grid container>
              <Grid item xs={12} className={classes.col_btwn}> */}
                <Payable />
                {/* </Grid>
              <Grid item xs={12}> */}
                {/* <Receivables />
                </Grid>
            </Grid> */}
              </Grid>
              <Grid item lg={3} sm={6} xl={3} xs={12}>
                {/* <Product /> */}
                <Receivables />
              </Grid>
              <Grid item lg={6} md={12} xl={9} xs={12}>
                <Sales labelText={getSaleName()} />
              </Grid>
              <Grid item lg={6} md={6} xl={3} xs={12}>
                <Expenses labelText="Expenses" />
              </Grid>
              <Grid item xs={12}>
                <TransactionTable />
              </Grid>
              <Grid item xs={12}>
                <RecentStockDetail />
              </Grid>
            </Grid>
            <LowAndExpiryStockAlertModal />
          </Container>
        ) : (
          <NoPermission />
        )}
      </div>
    </Page>
  );
};

export default Dashboard;
