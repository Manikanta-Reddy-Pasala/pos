import React, { useEffect, useState } from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';

import TotalSales from './TotalSales';
import TotalPurchase from './TotalPurchase';
import Sales from './Sales';
import Purchase from './Purchase';
import Expenses from './Expenses';
import SalesVsCreditNote from './SalesVsCreditNote';
import PurchaseVsDebitNote from './PurchaseVsDebitNote';
import SalesVsPurchase from './SalesVsPurchase';
import PaymentVsReceipt from './PaymentVsReciept';
import TotalExpenses from './TotalExpenses';
import Receivables from './Receivables';
import Payable from './Payable';
import Page from '../../components/Page';
import TransactionTable from './recentTransactionTable';
import TopVendors from './topVendors';
import TopCustomers from './topCustomers';
import CashFlow from './CashFlow';
import IncomeVsExpense from './IncomeVsExpense';
import TopExpenses from './TopExpenses';

import RecentStockDetail from './recentStockDetails';
import LowAndExpiryStockAlertModal from './LowAndExpiryStockAlert';
import NoPermission from 'src/views/noPermission';
import * as Bd from '../../components/SelectedBusiness';
import GrossVsNetProfit from './ProfitLoss/GrossVsNetProfit'

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
            <Grid container spacing={1}>
              <Grid item lg={4} md={4} xl={4} xs={12}>
                <TotalSales />
              </Grid>
              <Grid item lg={4} md={4} xl={4} xs={12}>
                <TotalPurchase />
              </Grid>
              <Grid item lg={4} md={4} xl={4} xs={12}>
                <TotalExpenses />
              </Grid>

              <Grid item lg={6} md={6} xl={3} xs={12}>
                <Payable />
              </Grid>
              <Grid item lg={6} md={6} xl={3} xs={12}>
                <Receivables />
              </Grid>

              <Grid item lg={4} md={4} xl={6} xs={12}>
                <Sales labelText={getSaleName()} />
              </Grid>
              <Grid item lg={4} md={4} xl={6} xs={12}>
                <Purchase labelText="Purchase" />
              </Grid>
              <Grid item lg={4} md={4} xl={6} xs={12}>
                <Expenses labelText="Expenses" />
              </Grid>

              <Grid item lg={6} md={6} xl={9} xs={12}>
                <IncomeVsExpense labelText="Income Vs Expense" />
              </Grid>
              <Grid item lg={6} md={6} xl={9} xs={12}>
                <TopExpenses labelText="Top Expenses" />
              </Grid>

              <Grid item xs={12}>
                <CashFlow />
              </Grid>

              <Grid item xs={12}>
                <GrossVsNetProfit />
              </Grid>
              

              <Grid item lg={6} md={6} xl={9} xs={12}>
                <SalesVsCreditNote labelText="Sales Vs Credit Note" />
              </Grid>
              <Grid item lg={6} md={6} xl={9} xs={12}>
                <PurchaseVsDebitNote labelText="Purchase Vs Debit Note" />
              </Grid>

              <Grid item lg={6} md={6} xl={9} xs={12}>
                <SalesVsPurchase labelText="Sales Vs Purchase" />
              </Grid>
              <Grid item lg={6} md={6} xl={9} xs={12}>
                <PaymentVsReceipt labelText="Payment Vs Receipt" />
              </Grid>

              <Grid item lg={6} md={6} xl={9} xs={12}>
                <TopCustomers />
              </Grid>
              <Grid item lg={6} md={6} xl={9} xs={12}>
                <TopVendors />
              </Grid>
              <Grid item xs={12}>
                <TransactionTable />
              </Grid>
              {/* <Grid item xs={12}>
                <RecentStockDetail />
              </Grid> */}
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
