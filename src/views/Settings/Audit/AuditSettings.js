import React, { useState, useEffect } from 'react';
import { FormGroup } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import useWindowDimensions from '../../../components/windowDimension';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';

import {
  makeStyles,
  Typography,
  FormControlLabel,
  Switch,
  Radio,
  Checkbox,
  RadioGroup,
  FormControl,
  TextField,
  MenuItem,
  IconButton,
  Select,
  OutlinedInput
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import * as Bd from '../../../components/SelectedBusiness';
import { Grid } from 'react-flexbox-grid';
import '../style.css';
import Controls from '../../../components/controls/index';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 18
    // textAlign: 'center',
  },
  containerLeft: {
    width: '12%',
    minHeight: '590px'
  },
  containerRight: {
    width: '88%'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  flex: {
    display: 'flex'
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  p: {
    fontWeight: 'bold'
  },
  card: {
    height: '100%'
  }
}));

const AuditSettings = () => {
  const classes = useStyles();
  const stores = useStore();

  const {
    getAuditSettingsData,
    setAuditSettingsData,
    setTaxRates,
    setLockSales,
    addTaxRate,
    editTaxRate,
    removeTaxRate,
    setShippingTaxRate
  } = stores.AuditSettingsStore;

  const { auditSettings } = toJS(stores.AuditSettingsStore);

  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [isLoading, setLoadingShown] = useState(true);

  const { height } = useWindowDimensions();

  useEffect(() => {
    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await getAuditSettingsData();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, [getAuditSettingsData]);

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Accounting & Audit')) {
        //setFeatureAvailable(false);
      }
    }
  };

  const getTaxRate = (val) => {
    let taxMatches = false;
    if (
      auditSettings.taxApplicability &&
      auditSettings.taxApplicability.length > 0
    ) {
      for (let tax of auditSettings.taxApplicability) {
        if (val === tax) {
          taxMatches = true;
          break;
        }
      }
    }
    return taxMatches;
  };

  const getShippingTaxRate = (val) => {
    let taxMatches = false;
    if (val === auditSettings.shippingPackingTax) {
      taxMatches = true;
    }
    return taxMatches;
  };

  const getLockSales = (val) => {
    let lockSaleMatches = false;
    if (auditSettings.lockSales && auditSettings.lockSales.length > 0) {
      for (let month of auditSettings.lockSales) {
        if (val === month) {
          lockSaleMatches = true;
          break;
        }
      }
    }
    return lockSaleMatches;
  };

  return (
    <Grid fluid className="app-main" style={{ height: height - 50 }}>
      {isLoading && <BubbleLoader></BubbleLoader>}
      {!isLoading && (
        <>
          {isFeatureAvailable ? (
            <Paper
              className={classes.paper}
              style={{ height: height - 62 + 'px', overflowY: 'auto' }}
              title="Audit Settings"
            >
              <Typography variant="h5" style={{ marginBottom: '10px' }}>
                Audit Settings
              </Typography>
              <Grid container>
                <Grid item xs={4}></Grid>

                <Grid item xs={12}>
                  <Typography variant="h5" style={{ marginTop: '30px' }}>
                    E-Invoice
                  </Typography>
                </Grid>

                <Grid item xs={4}>
                  <FormControlLabel
                    style={{
                      display: 'block',
                      marginTop: '16px'
                    }}
                    control={
                      <Switch
                        checked={auditSettings.autoPushPendingFailed}
                        onChange={(e) => {
                          setAuditSettingsData(
                            'autoPushPendingFailed',
                            e.target.checked
                          );
                        }}
                        name="autoPushEInvoice"
                      />
                    }
                    label="Auto-Push Pending/Failed E-Invoices in 24hours"
                  />
                </Grid>

                <Grid item xs={4}>
                  <FormControlLabel
                    style={{
                      display: 'block',
                      marginTop: '10px'
                    }}
                    control={
                      <Switch
                        checked={auditSettings.einvoiceAlert}
                        onChange={(e) => {
                          setAuditSettingsData(
                            'einvoiceAlert',
                            e.target.checked
                          );
                        }}
                        name="alertsEInvoice"
                      />
                    }
                    label="Daily Alert for E-Invoices with success and failed numbers"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h5" style={{ marginTop: '30px' }}>
                    Lock Sales and Sales Returns for Edit/Delete (Current
                    Financial Year)
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormGroup
                    row
                    style={{
                      marginTop: '16px'
                    }}
                  >
                    <FormControlLabel
                      checked={getLockSales(4)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('Apr', e.target.checked);
                          }}
                          name="apr"
                        />
                      }
                      label="Apr"
                    />
                    <FormControlLabel
                      checked={getLockSales(5)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('May', e.target.checked);
                          }}
                          name="may"
                        />
                      }
                      label="May"
                    />
                    <FormControlLabel
                      checked={getLockSales(6)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('June', e.target.checked);
                          }}
                          name="june"
                        />
                      }
                      label="June"
                    />
                    <FormControlLabel
                      checked={getLockSales(7)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('July', e.target.checked);
                          }}
                          name="july"
                        />
                      }
                      label="July"
                    />
                    <FormControlLabel
                      checked={getLockSales(8)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('Aug', e.target.checked);
                          }}
                          name="august"
                        />
                      }
                      label="Aug"
                    />
                    <FormControlLabel
                      checked={getLockSales(9)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('Sep', e.target.checked);
                          }}
                          name="sep"
                        />
                      }
                      label="Sep"
                    />
                    <FormControlLabel
                      checked={getLockSales(10)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('Oct', e.target.checked);
                          }}
                          name="oct"
                        />
                      }
                      label="Oct"
                    />
                    <FormControlLabel
                      checked={getLockSales(11)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('Nov', e.target.checked);
                          }}
                          name="nov"
                        />
                      }
                      label="Nov"
                    />
                    <FormControlLabel
                      checked={getLockSales(12)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('Dec', e.target.checked);
                          }}
                          name="dec"
                        />
                      }
                      label="Dec"
                    />
                    <FormControlLabel
                      checked={getLockSales(1)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('Jan', e.target.checked);
                          }}
                          name="jan"
                        />
                      }
                      label="Jan"
                    />
                    <FormControlLabel
                      checked={getLockSales(2)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('Feb', e.target.checked);
                          }}
                          name="feb"
                        />
                      }
                      label="Feb"
                    />
                    <FormControlLabel
                      checked={getLockSales(3)}
                      control={
                        <Checkbox
                          onChange={(e) => {
                            setLockSales('Mar', e.target.checked);
                          }}
                          name="mar"
                        />
                      }
                      label="Mar"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="h5" style={{ marginTop: '30px' }}>
                    Tax Applicability
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormGroup
                    row
                    style={{
                      marginTop: '16px'
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getTaxRate(0)}
                          onChange={(e) => {
                            setTaxRates('0 %', e.target.checked);
                          }}
                          name="zero"
                        />
                      }
                      label="0 %"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getTaxRate(0.25)}
                          onChange={(e) => {
                            setTaxRates('0.25 %', e.target.checked);
                          }}
                          name="zeroTwoFive"
                        />
                      }
                      label="0.25 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getTaxRate(1.5)}
                          onChange={(e) => {
                            setTaxRates('1.5 %', e.target.checked);
                          }}
                          name="OnePointFive"
                        />
                      }
                      label="1.5 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getTaxRate(3)}
                          onChange={(e) => {
                            setTaxRates('3 %', e.target.checked);
                          }}
                          name="three"
                        />
                      }
                      label="3 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getTaxRate(5)}
                          onChange={(e) => {
                            setTaxRates('5 %', e.target.checked);
                          }}
                          name="five"
                        />
                      }
                      label="5 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getTaxRate(12)}
                          onChange={(e) => {
                            setTaxRates('12 %', e.target.checked);
                          }}
                          name="twelve"
                        />
                      }
                      label="12 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getTaxRate(18)}
                          onChange={(e) => {
                            setTaxRates('18 %', e.target.checked);
                          }}
                          name="eighteen"
                        />
                      }
                      label="18 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={getTaxRate(28)}
                          onChange={(e) => {
                            setTaxRates('28 %', e.target.checked);
                          }}
                          name="twentyeight"
                        />
                      }
                      label="28 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                  </FormGroup>
                </Grid>

                <Grid item className="grid-padding">
                  <Controls.Button
                    text="+ Add Tax Autofill By Price Range"
                    size="medium"
                    style={{ marginTop: '16px' }}
                    variant="contained"
                    color="primary"
                    className={classes.newButton}
                    onClick={addTaxRate}
                  />
                </Grid>

                {auditSettings.taxRateAutofillList &&
                  auditSettings.taxRateAutofillList.length > 0 &&
                  auditSettings.taxRateAutofillList.map((d, DaysIndex) => (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        marginTop: '16px',
                        marginLeft: '2px'
                      }}
                    >
                      <FormControl>
                        <Typography
                          className={classes.floatlabel}
                          component="subtitle1"
                        >
                          Price
                        </Typography>
                        <TextField
                          required
                          variant="outlined"
                          onFocus={(e) =>
                            d.price === 0
                              ? editTaxRate('price', DaysIndex, '')
                              : ''
                          }
                          onChange={(e) =>
                            editTaxRate('price', DaysIndex, e.target.value)
                          }
                          margin="dense"
                          type="number"
                          value={d.price}
                          style={{ width: '100px' }}
                          className="customTextField"
                        />
                      </FormControl>

                      <FormControl
                        variant="outlined"
                        style={{ marginLeft: '20px' }}
                        className={classes.formControl}
                      >
                        <Typography
                          className={classes.floatlabel}
                          component="subtitle1"
                        >
                          Tax
                        </Typography>              
                        <Select
                          displayEmpty
                          value={d.tax}
                          input={
                            <OutlinedInput
                              style={{ width: '100%', textAlign: 'left' }}
                            />
                          }
                          inputProps={{ 'aria-label': 'Without label' }}
                          onChange={(e) => {
                            editTaxRate('tax', DaysIndex, e.target.value);
                          }}
                          style={{ width: '100px', marginTop: '8px' }}
                        >
                          <MenuItem value={0}>{0}</MenuItem>
                          <MenuItem value={0.25}>{0.25}</MenuItem>
                          <MenuItem value={1.5}>{1.5}</MenuItem>
                          <MenuItem value={3}>{3}</MenuItem>
                          <MenuItem value={5}>{5}</MenuItem>
                          <MenuItem value={12}>{12}</MenuItem>
                          <MenuItem value={18}>{18}</MenuItem>
                          <MenuItem value={28}>{28}</MenuItem>
                        </Select>
                      </FormControl>

                      <IconButton
                        aria-label="close"
                        style={{ marginTop: '20px', marginLeft: '20px' }}
                        onClick={(e) => removeTaxRate(DaysIndex)}
                        className="closeButton"
                      >
                        <CancelRoundedIcon />
                      </IconButton>
                    </div>
                  ))}

                <Grid item xs={12}>
                  <Typography variant="h5" style={{ marginTop: '30px' }}>
                    Tax Applicability for Shipping, Packaging & Insurance
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <RadioGroup
                    row
                    aria-label="quiz"
                    name="quiz"
                    style={{
                      marginTop: '16px'
                    }}
                  >
                    <FormControlLabel
                      control={<Radio name="zero" />}
                      checked={getShippingTaxRate(0)}
                      onChange={(e) => {
                        setShippingTaxRate('0 %', e.target.checked);
                      }}
                      label="0 %"
                    />
                    <FormControlLabel
                      control={<Radio name="three" />}
                      checked={getShippingTaxRate(3)}
                      onChange={(e) => {
                        setShippingTaxRate('3 %', e.target.checked);
                      }}
                      label="3 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={<Radio name="five" />}
                      checked={getShippingTaxRate(5)}
                      onChange={(e) => {
                        setShippingTaxRate('5 %', e.target.checked);
                      }}
                      label="5 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={<Radio name="twelve" />}
                      checked={getShippingTaxRate(12)}
                      onChange={(e) => {
                        setShippingTaxRate('12 %', e.target.checked);
                      }}
                      label="12 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={<Radio name="eighteen" />}
                      checked={getShippingTaxRate(18)}
                      onChange={(e) => {
                        setShippingTaxRate('18 %', e.target.checked);
                      }}
                      label="18 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                    <FormControlLabel
                      control={<Radio name="twentyeight" />}
                      checked={getShippingTaxRate(28)}
                      onChange={(e) => {
                        setShippingTaxRate('28 %', e.target.checked);
                      }}
                      label="28 %"
                      style={{
                        marginLeft: '10px'
                      }}
                    />
                  </RadioGroup>
                </Grid>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginLeft: '2px'
                  }}
                >
                  <Grid item xs={4}>
                    <Typography variant="h5" style={{ marginTop: '25px' }}>
                      Shipping HSN/SAC
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      placeholder="Enter HSN"
                      style={{
                        marginTop: '16px'
                      }}
                      variant="outlined"
                      className={classes.textField}
                      value={auditSettings.shippingChargeHsn}
                      onChange={(e) =>
                        setAuditSettingsData(
                          'shippingChargeHsn',
                          e.target.value
                        )
                      }
                      margin="dense"
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="h5" style={{ marginTop: '25px' }}>
                      Packing HSN/SAC
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      placeholder="Enter HSN"
                      style={{
                        marginTop: '16px'
                      }}
                      variant="outlined"
                      className={classes.textField}
                      value={auditSettings.packingChargeHsn}
                      onChange={(e) =>
                        setAuditSettingsData('packingChargeHsn', e.target.value)
                      }
                      margin="dense"
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <Typography variant="h5" style={{ marginTop: '25px' }}>
                      Insurance HSN
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <TextField
                      placeholder="Enter HSN"
                      style={{
                        marginTop: '16px'
                      }}
                      variant="outlined"
                      className={classes.textField}
                      value={auditSettings.insuranceHsn}
                      onChange={(e) =>
                        setAuditSettingsData('insuranceHsn', e.target.value)
                      }
                      margin="dense"
                    />
                  </Grid>
                </div>
              </Grid>
            </Paper>
          ) : (
            <NoPermission />
          )}
        </>
      )}
    </Grid>
  );
};

export default injectWithObserver(AuditSettings);