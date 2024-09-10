import React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Container,
  Grid,
  makeStyles,
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography
} from '@material-ui/core';
import Page from '../../components/Page';
import CustomerList from './customerList';
import CustomerHeader from './customerHeader';
import TransactionTable from './Transaction';
import CustomerLedger from './CustomerLedger';

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

const Customers = () => {
  const classes = useStyles();
  const [Tabvalue, setTabValue] = React.useState(0);

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

  return (
    <Page className={classes.root} title="Customers">
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
              <CustomerList />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={8} md={9} className={classes.gridControl}>
            <Paper className={classes.productHeader}>
              <CustomerHeader />
            </Paper>
            <Paper>
              <div className={classes.itemTable}>
                <AppBar position="static">
                  <Tabs
                    value={Tabvalue}
                    aria-label=""
                    onChange={handleTabChange}
                  >
                    <Tab label="Transactions" {...a11yProps(0)} />
                    <Tab label="Ledger" {...a11yProps(1)} />
                  </Tabs>
                </AppBar>
                <TabPanel value={Tabvalue} index={0}>
                  <TransactionTable />
                </TabPanel>
                <TabPanel value={Tabvalue} index={1}>
                  <CustomerLedger />
                </TabPanel>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
};

export default Customers;
