import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'react-table/react-table.css';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Paper,
  AppBar,
  InputBase
} from '@material-ui/core';
import InjectObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import Cash from './Cash/Cash';
import Controls from '../../components/controls/index';
import { Add } from '@material-ui/icons';
import AddBankAccountModal from './Bank/modal/AddBankAccount';
import BankAccountView from './Bank';
import { withStyles } from '@material-ui/core/styles';
import * as Bd from '../../components/SelectedBusiness';
import BubbleLoader from '../../components/loader';
import NoPermission from 'src/views/noPermission';
import ChequeTransactions from './Cheque';
import { toJS } from 'mobx';

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

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing.unit * 3
    }
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: 'white',
    border: '1px solid #ced4da',
    fontSize: 16,
    width: '100%',
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  }
}))(InputBase);

const CashandBankView = () => {
  const classes = useStyles();
  const [Tabvalue, setTabValue] = React.useState(0);

  const store = useStore();
  const { handleCashModalOpen } = store.CashStore;
  const { handleOpenDialog, handleTransferMoneyDialog } =
    store.BankAccountsStore;
  const { bankDialogOpen } = toJS(store.BankAccountsStore);

  const [transferMoney, setTransferMoney] = React.useState('Transfer Money');
  const [transferMoneyVal, setTransferMoneyVal] = React.useState({});
  const [isLoading, setLoadingShown] = React.useState(true);
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);

  const transferMoneyList = [
    { name: 'Bank to Cash Transfer', val: 'banktocash' },
    { name: 'Cash to Bank Transfer', val: 'cashtobank' },
    { name: 'Bank to Bank Transfer', val: 'banktobank' },
    { name: 'Adjust Bank Balance', val: 'adjust' }
  ];
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

  const openForNewAdjustment = (params) => {
    handleCashModalOpen();
  };

  const openAddNewBankAccount = () => {
    handleOpenDialog();
  };

  const handleTransferMoney = (e) => {
    let res = transferMoneyList.filter((c) => c.val === e.target.value);
    setTransferMoneyVal(res[0]);
    handleTransferMoneyDialog(true);
  };

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
      if (!businessData.posFeatures.includes('Cash & Bank')) {
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
              <div className={classes.content}>
                <Grid container>
                  <Grid item xs={6}></Grid>
                  <Grid item xs={6} style={{ textAlign: 'end' }}>
                    {Tabvalue === 0 && (
                      <Controls.Button
                        text="Add Adjustment"
                        size="medium"
                        variant="contained"
                        startIcon={<Add />}
                        className={classes.newButton}
                        onClick={() => openForNewAdjustment()}
                      />
                    )}
                    {Tabvalue === 1 && (
                      <div>
                        <Grid container>
                          <Grid item xs={8} style={{ textAlign: 'end' }}>
                            {/*<NativeSelect
                              value={transferMoney}
                              style={{ width: '50%' }}
                              color="secondary"
                              onChange={(e) => {
                                setTransferMoney('Transfer Money');
                                handleTransferMoney(e);
                              }}
                              input={
                                <BootstrapInput
                                  name="age"
                                  id="age-customized-native-simple"
                                />
                              }
                            >
                              <option value="Transfer Money" disabled>
                                Transfer Money
                              </option>
                              {transferMoneyList.map((e, index) => (
                                <option value={e.val} key={index}>
                                  {e.name}
                                </option>
                              ))}
                            </NativeSelect>*/}
                          </Grid>
                          <Grid item xs={4}>
                            <Controls.Button
                              text="Add Bank Account"
                              size="medium"
                              variant="contained"
                              startIcon={<Add />}
                              className={classes.newButton}
                              onClick={() => openAddNewBankAccount()}
                            />
                          </Grid>
                        </Grid>
                      </div>
                    )}
                  </Grid>
                </Grid>
              </div>

              <div></div>

              <div className={classes.itemTable} style={{ marginTop: '10px' }}>
                <AppBar position="static">
                  <Tabs
                    value={Tabvalue}
                    aria-label=""
                    onChange={handleTabChange}
                  >
                    <Tab label="Cash" {...a11yProps(0)} />
                    <Tab label="Bank" {...a11yProps(1)} />
                    <Tab label="Cheque" {...a11yProps(2)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={Tabvalue} index={0}>
                  <Cash />
                </TabPanel>
                <TabPanel value={Tabvalue} index={1}>
                  <BankAccountView />
                </TabPanel>
                <TabPanel value={Tabvalue} index={2}>
                  <ChequeTransactions />
                </TabPanel>
              </div>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </div>
      )}
    </div>
  );
};

export default InjectObserver(CashandBankView);