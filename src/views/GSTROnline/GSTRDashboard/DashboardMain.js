import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GSTROverview from './GSTROverview';
import DboardGSTR1 from './DboardGSTR1';
import DboardGSTR2A from './DboardGSTR2A';
import DboardGSTR2B from './DboardGSTR2B';
import DboardITC from './DboardITC';
import {
  MenuItem,
  Select,
  Toolbar,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Grid,
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import { validateSession } from 'src/components/Helpers/GstrOnlineHelper';
import GSTAuth from '../GSTAuth';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import DataLoader from './DataLoader';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

function DashboardMain(props) {
  const { classes } = props;
  const stores = useStore();
  const [value, setValue] = useState(0);
  const [selectedYear, setSelectedYear] = useState(1);
  const { setRetPeriod } = stores.GSTRDashboardStore;
  const [loader, setLoader] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState('');
  const [filter, setFilter] = useState(false);

  const {
    updateGSTAuth,
    handleErrorAlertOpen,
    setLoginStep,
    setTaxData,
    gstAuth,
    openErrorMesssageDialog
  } = stores.GSTR1Store;
  const { getTaxSettingsDetails } = stores.TaxSettingsStore;

  useEffect(() => {
    const loadData = async () => {
      let tData = await getTaxSettingsDetails();
      await setTaxData(tData);
      handleChangeFY(selectedYear);
      validateSessionCall();
    }
    loadData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const currentMonth = new Date().getMonth();

  // Get the current fiscal year
  const currentYear = currentMonth <= 2
    ? new Date().getFullYear() - 1
    : new Date().getFullYear();

  const handleChangeFY = (value) => {
    setSelectedYear(value);
    handleFinancialYearData(value);
  };

  const handleFinancialYearData = (yearOption) => {
    let startYear, endYear;
    switch (yearOption) {
      case 1:
        startYear = currentYear;
        endYear = currentYear + 1;
        break;
      case 2:
        startYear = currentYear - 1;
        endYear = currentYear;
        break;
      case 3:
        startYear = currentYear - 2;
        endYear = currentYear - 1;
        break;
      case 4:
        startYear = currentYear - 3;
        endYear = currentYear - 2;
        break;
      default:
        break;
    }
    const months = generateFinancialYearMonths(startYear, endYear, yearOption);
    setRetPeriod(months);
  };

  const generateFinancialYearMonths = (startYear, endYear, yearOption) => {
    const months = [];
    const monthPrefixes = [
      { prefix: '04', label: 'Apr' },
      { prefix: '05', label: 'May' },
      { prefix: '06', label: 'Jun' },
      { prefix: '07', label: 'July' },
      { prefix: '08', label: 'Aug' },
      { prefix: '09', label: 'Sep' },
      { prefix: '10', label: 'Oct' },
      { prefix: '11', label: 'Nov' },
      { prefix: '12', label: 'Dec' },
      { prefix: '01', label: 'Jan' },
      { prefix: '02', label: 'Feb' },
      { prefix: '03', label: 'Mar' }
    ];

    const currentMonth = new Date().getMonth() + 1; // 1-based month
    const currentYearActual = new Date().getFullYear();

    // Loop through April to December for startYear
    for (let i = 0; i < 9; i++) {
      const isFutureMonth = (startYear === currentYearActual && i + 4 > currentMonth) || startYear > currentYearActual;
      months.push({
        retPeriod: `${monthPrefixes[i].prefix}${startYear}`,
        label: `${monthPrefixes[i].label} ${startYear}`,
        isFiled: false,
        enabled: !isFutureMonth // Disable future months
      });
    }

    // Loop through January to March for endYear
    for (let i = 9; i < 12; i++) {
      const isFutureMonth = (endYear === currentYearActual && i - 8 > currentMonth) || endYear > currentYearActual;
      months.push({
        retPeriod: `${monthPrefixes[i].prefix}${endYear}`,
        label: `${monthPrefixes[i].label} ${endYear}`,
        isFiled: false,
        enabled: !isFutureMonth // Disable future months
      });
    }

    return months;
  };

  const validateSessionCall = async (dataG) => {
    let tData = await getTaxSettingsDetails();
    setLoaderMsg('Please wait while validating session!!!');
    setLoader(true);
    const apiResponse = await validateSession(tData.gstin);
    if (apiResponse.code === 200) {
      if (apiResponse && apiResponse.status === 1) {
        updateGSTAuth(true);
        setFilter(true);
        setLoader(false);
      } else {
        setLoginStep(1);
        setFilter(true);
        // errorMessageCall(apiResponse.message);
        setLoader(false);
      }
    } else {
      updateGSTAuth(false);
      setLoginStep(1);
      setFilter(true);
      //errorMessageCall(apiResponse.message);
      setLoader(false);
    }
  };

  return (
    <>
      {filter && <>
        {!gstAuth ? (
          <GSTAuth type={'GSTRREPORT'} />
        ) : (
          <div className={classes.root}>
            <AppBar position="static" color="default">
              <Toolbar>
                <Grid container>
                  <Grid item xs={9}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      indicatorColor="secondary"
                      textColor="secondary"
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="Overview" />
                      <Tab label="GSTR1" />
                      <Tab label="GSTR2A" />
                      <Tab label="GSTR2B" />
                      <Tab label="ITC" />
                    </Tabs>
                  </Grid>
                  <Grid item xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                    <Grid item xs={4}>
                      <Typography>Fiscal Year:</Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Select
                        disableUnderline
                        onChange={(e) => handleChangeFY(e.target.value)}
                        defaultValue={1}
                        className={classes.select}
                      >
                        <MenuItem value={1}>{currentYear}-{currentYear + 1}</MenuItem>
                        <MenuItem value={2}>{currentYear - 1}-{currentYear}</MenuItem>
                        <MenuItem value={3}>{currentYear - 2}-{currentYear - 1}</MenuItem>
                        <MenuItem value={4}>{currentYear - 3}-{currentYear - 2}</MenuItem>
                      </Select>
                    </Grid>
                  </Grid>
                </Grid>
              </Toolbar>
            </AppBar>
            {value === 0 && (
              <TabContainer>
                <GSTROverview />
              </TabContainer>
            )}
            {value === 1 && (
              <TabContainer>
                <DboardGSTR1 />
              </TabContainer>
            )}
            {value === 2 && (
              <TabContainer>
                <DboardGSTR2A />
              </TabContainer>
            )}
            {value === 3 && (
              <TabContainer>
                <DboardGSTR2B />
              </TabContainer>
            )}
            {value === 4 && (
              <TabContainer>
                <DboardITC />
              </TabContainer>
            )}
          </div>)}

      </>}
      {loader && <DataLoader />}
    </>
  );
}

DashboardMain.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(injectWithObserver(DashboardMain));
