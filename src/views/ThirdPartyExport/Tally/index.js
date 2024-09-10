import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import { Box, Typography, Tabs, Tab, Paper, AppBar } from '@material-ui/core';
import InjectObserver from 'src/Mobx/Helpers/injectWithObserver';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import * as Bd from 'src/components/SelectedBusiness';
import BubbleLoader from 'src/components/loader';
import NoPermission from 'src/views/noPermission';
import TallyMaster from './TallyMaster';
import TallyParty from './TallyParty';
import TallyVoucher from './TallyVoucher';
import TallyInstructions from './TallyInstructions';
import TallyBanks from './TallyBanks';
import AddSalesInvoice from 'src/views/sales/SalesInvoices/AddInvoice';
import AddCreditNote from 'src/views/sales/SalesReturn/AddCreditNote';
import AddPurchasesBill from 'src/views/purchases/PurchaseBill/AddPurchase';
import AddDebitNote from 'src/views/purchases/PurchaseReturn/AddDebitNote';
import AddExpenses from '../../Expenses/Modal/AddExpenses';
import { toJS } from 'mobx';
import OneShellParties from './OneShellParties';
import VendorModal from 'src/views/Vendors/modal/AddVendor';
import CustomerModal from 'src/views/customers/modal/AddCustomer';
import TallySequenceNumber from './TallySequenceNumber';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    borderRadius: '12px'
  },
  padding: {
    padding: theme.spacing(4)
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: '12px'
  },
  label: {
    flexDirection: 'column'
  },
  newButton: {
    position: 'relative',
    borderRadius: 25,
    background: '#EF5350',
    color: 'white',
    '&:hover': {
      background: 'none',
      color: '#EF5350'
    }
  }
}));

const TallyExport = () => {
  const classes = useStyles();
  const [Tabvalue, setTabValue] = React.useState(0);

  const store = useStore();

  const [isLoading, setLoadingShown] = React.useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  const { openAddSalesInvoice } = toJS(store.SalesAddStore);
  const { openAddSalesReturn } = toJS(store.ReturnsAddStore);
  const { OpenAddPurchaseBill } = toJS(store.PurchasesAddStore);
  const { OpenAddPurchasesReturn } = toJS(store.PurchasesReturnsAddStore);
  const { addExpensesDialogue } = toJS(store.ExpensesStore);
  const { vendorDialogOpen } = toJS(store.VendorStore);
  const { customerDialogOpen } = toJS(store.CustomerStore);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`scrollable-auto-tabpanel-${index}`}
        aria-labelledby={`scrollable-auto-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`
    };
  }

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
      if (!businessData.posFeatures.includes('Export To Tally')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <div className={classes.root}>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <div>
          {isFeatureAvailable ? (
            <Paper className={classes.root}>
              <div className={classes.itemTable} style={{ marginTop: '10px' }}>
                <AppBar position="static">
                  <Tabs
                    value={Tabvalue}
                    aria-label=""
                    onChange={handleTabChange}
                  >
                    <Tab label="Tally Masters" {...a11yProps(0)} />
                    <Tab label="Tally Parties" {...a11yProps(1)} />
                    <Tab label="Tally Banks" {...a11yProps(2)} />
                    <Tab label="Transactions" {...a11yProps(3)} />
                    <Tab label="Customers/Vendors" {...a11yProps(4)} />
                    <Tab label="Sequence Number" {...a11yProps(5)} />
                    <Tab label="Instructions" {...a11yProps(6)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={Tabvalue} index={0}>
                  <TallyMaster />
                </TabPanel>
                <TabPanel value={Tabvalue} index={1}>
                  <TallyParty />
                </TabPanel>
                <TabPanel value={Tabvalue} index={2}>
                  <TallyBanks />
                </TabPanel>
                <TabPanel value={Tabvalue} index={3}>
                  <TallyVoucher />
                </TabPanel>
                <TabPanel value={Tabvalue} index={4}>
                  <OneShellParties />
                </TabPanel>
                <TabPanel value={Tabvalue} index={5}>
                  <TallySequenceNumber />
                </TabPanel>
                <TabPanel value={Tabvalue} index={6}>
                  <TallyInstructions />
                </TabPanel>
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
      {openAddSalesInvoice ? <AddSalesInvoice /> : null}
      {openAddSalesReturn ? <AddCreditNote /> : null}
      {OpenAddPurchaseBill ? <AddPurchasesBill /> : null}
      {OpenAddPurchasesReturn ? <AddDebitNote /> : null}
      {addExpensesDialogue ? <AddExpenses /> : null}
      {vendorDialogOpen ? <VendorModal /> : null}
      {customerDialogOpen ? <CustomerModal /> : null}
    </div>
  );
};

export default InjectObserver(TallyExport);