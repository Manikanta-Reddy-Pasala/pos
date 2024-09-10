import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, TextField, Button, OutlinedInput } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import BubbleLoader from '../../../components/loader';
import useWindowDimensions from '../../../components/windowDimension';
import getStateList from '../../../components/StateList';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { Grid, Col } from 'react-flexbox-grid';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';

import {
  makeStyles,
  Typography,
  FormControl,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Select,
  MenuItem,
  Switch,
  Snackbar
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import NoPermission from '../../noPermission';
import * as Bd from '../../../components/SelectedBusiness';
import TaxSettingsNavigation from '../TaxSettingsNavigation';
import '../style.css';

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
  containerInput: {
    flexGrow: 1
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
  },
  saveBtn: {
    width: '30%',
    background: '#EF5350',
    color: 'white',
    marginTop: '20px',
    textTransform: 'capitalize',
    '&:hover': {
      border: '1px solid #EF5350',
      color: '#EF5350',
      background: 'white'
    }
  },
  PlaceOfsupplyListbox: {
    // minWidth: '38%',
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    textAlign: 'left',
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer'
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white'
    }
  },
  liBtn: {
    width: '100%',
    padding: '7px 8px',
    textTransform: 'none',
    fontWeight: '300',
    fontSize: 'small',
    '&:focus': {
      background: '#ededed',
      outline: 0,
      border: 0,
      fontWeight: 'bold'
    }
  },
  oneShellColor: {
    color: '#EF5350'
  },
  gridStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    border: '1px solid lightgrey',
    width: '90%',
    alignSelf: 'center',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    margin: '10px'
  },
  gridCol: {
    display: 'flex',
    flexDirection: 'col',
    justifyContent: 'space-around'
  },
  gridRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around'
  }
}));

const TaxSettings = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const stores = useStore();

  const {
    setTaxSettingsData,
    getTaxSettingsData,
    saveData,
    setCompositeSchemeType
  } = stores.TaxSettingsStore;

  const { taxSettingsData } = toJS(stores.TaxSettingsStore);

  const [stateList, setStateList] = React.useState([]);
  const [snackBarOpen, setSnackBar] = React.useState(false);
  const [isLoading, setLoadingShown] = useState(true);
  const { height } = useWindowDimensions();
  const [isFeatureAvailable, setFeatureAvailable] = useState(true);
  const [copyAddress, setCopyAddress] = React.useState(false);

  useEffect(() => {
    setStateList(getStateList());

    async function fetchData() {
      const businessData = await Bd.getBusinessData();
      await checkPermissionAvailable(businessData);
      await getTaxSettingsData();
    }

    fetchData();
    setTimeout(() => setLoadingShown(false), 200);
  }, [getTaxSettingsData]);

  const handleClose = () => {
    setSnackBar(false);
  };

  const checkPermissionAvailable = (businessData) => {
    if (
      businessData &&
      businessData.posFeatures &&
      businessData.posFeatures.length > 0
    ) {
      if (!businessData.posFeatures.includes('Settings')) {
        setFeatureAvailable(false);
      }
    }
  };

  return (
    <Grid fluid className="app-main" style={{ height: height - 50 }}>
      <Col className="nav-column" xs={12} sm={2}>
        <Card className={classes.card}>
          <Grid container className={classes.cardList}>
            <TaxSettingsNavigation navigation={navigate} active="tax_gst" />
          </Grid>
        </Card>
      </Col>
      <Col className="content-column" xs>
        {isLoading && <BubbleLoader></BubbleLoader>}
        {!isLoading && (
          <>
            {isFeatureAvailable ? (
              <Paper
                className={classes.paper}
                style={{
                  height: height - 69 + 'px',
                  overflowX: 'hidden',
                  overflowY: 'auto'
                }}
              >
                <Typography variant="h5" style={{ marginBottom: '10px' }}>
                  GST Settings
                </Typography>

                <FormControlLabel
                  style={{ display: 'block' }}
                  control={
                    <Switch
                      checked={taxSettingsData.enableGst}
                      onChange={(e) => {
                        setTaxSettingsData('enableGst', e.target.checked);
                        if (!e.target.checked) {
                          setTaxSettingsData('compositeScheme', false);
                          setTaxSettingsData('compositeSchemeValue', 'trader');
                          setTaxSettingsData('reverseCharge', false);
                          saveData();
                        }
                      }}
                      name="enable_gst"
                    />
                  }
                  label="Enable GST"
                />

                {taxSettingsData.enableGst && (
                  <FormControl component="fieldset" variant="standard">
                    <FormGroup>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row'
                        }}
                      >
                        <div style={{ width: '20%' }}>
                          <TextField
                            placeholder="Enter GSIN"
                            style={{ width: '95%' }}
                            variant="outlined"
                            className={classes.textField}
                            value={taxSettingsData.gstin}
                            onChange={(e) => {
                              setTaxSettingsData('gstin', e.target.value);
                            }}
                            margin="dense"
                            label="GSTIN"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </div>
                        <div style={{ width: '30%' }}>
                          <TextField
                            placeholder="Enter Legal Name"
                            style={{ width: '95%' }}
                            variant="outlined"
                            className={classes.textField}
                            value={taxSettingsData.legalName}
                            onChange={(e) => {
                              setTaxSettingsData('legalName', e.target.value);
                            }}
                            margin="dense"
                            label="Legal Name"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </div>
                        <div style={{ width: '30%' }}>
                          <TextField
                            placeholder="Enter Trade Name"
                            style={{ width: '95%' }}
                            variant="outlined"
                            className={classes.textField}
                            value={taxSettingsData.tradeName}
                            onChange={(e) =>
                              setTaxSettingsData('tradeName', e.target.value)
                            }
                            margin="dense"
                            label="Trade Name"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: '100%',
                          marginTop: '20px'
                        }}
                      >
                        <div style={{ width: '40%' }}>
                          <TextField
                            placeholder="Enter Portal Username"
                            style={{ width: '95%' }}
                            variant="outlined"
                            className={classes.textField}
                            value={taxSettingsData.gstPortalUserName}
                            onChange={(e) => {
                              setTaxSettingsData(
                                'gstPortalUserName',
                                e.target.value
                              );
                            }}
                            margin="dense"
                            label="GSTN Portal Username"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </div>
                        <div style={{ width: '40%' }}>
                          <TextField
                            placeholder="Enter GSTN Portal EVC Pan"
                            style={{ width: '95%' }}
                            variant="outlined"
                            className={classes.textField}
                            value={taxSettingsData.gstPortalEvcPan}
                            onChange={(e) => {
                              setTaxSettingsData(
                                'gstPortalEvcPan',
                                e.target.value
                              );
                            }}
                            margin="dense"
                            label="GSTN Portal EVC Pan"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: '100%',
                          marginTop: '10px'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '40%'
                          }}
                        >
                          <div>
                            <p>Billing Address</p>
                            <TextField
                              placeholder="Enter Billing Address"
                              style={{ width: '95%' }}
                              variant="outlined"
                              className={classes.textField}
                              multiline
                              minRows={2}
                              value={taxSettingsData.billingAddress}
                              onChange={(e) =>
                                setTaxSettingsData(
                                  'billingAddress',
                                  e.target.value
                                )
                              }
                              inputProps={{ style: { height: '58px' } }}
                              margin="dense"
                            />
                          </div>

                          <div>
                            {/* <p>Dispatch City</p> */}
                            <TextField
                              placeholder="Enter City"
                              style={{ width: '95%' }}
                              variant="outlined"
                              className={classes.textField}
                              value={taxSettingsData.city}
                              onChange={(e) =>
                                setTaxSettingsData('city', e.target.value)
                              }
                              margin="dense"
                              label="City"
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '40%',
                            marginTop: '25px'
                          }}
                        >
                          <div>
                            {/* <p>Area</p> */}
                            <TextField
                              placeholder="Enter Area"
                              style={{ width: '95%' }}
                              variant="outlined"
                              className={classes.textField}
                              value={taxSettingsData.area}
                              onChange={(e) =>
                                setTaxSettingsData('area', e.target.value)
                              }
                              margin="dense"
                              label="Area"
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </div>

                          <div>
                            {/* <p>Pincode</p> */}
                            <TextField
                              placeholder="Enter Pincode"
                              style={{ width: '95%' }}
                              variant="outlined"
                              className={classes.textField}
                              value={taxSettingsData.pincode}
                              onChange={(e) =>
                                setTaxSettingsData('pincode', e.target.value)
                              }
                              margin="dense"
                              label="Pincode"
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </div>

                          <div>
                            <p
                              style={{
                                fontSize: '13px',
                                color: 'grey',
                                paddingLeft: '13px'
                              }}
                            >
                              State
                            </p>
                            <Select
                              displayEmpty
                              value={taxSettingsData.state}
                              input={<OutlinedInput style={{ width: '95%' }} />}
                              onChange={(e) => {
                                if ('Select State' !== e.target.value) {
                                  setTaxSettingsData('state', e.target.value);
                                }
                              }}
                            >
                              {stateList.map((option, index) => (
                                <MenuItem value={option.name}>
                                  {option.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </div>
                        </div>
                      </div>

                      <Grid
                        item
                        md={6}
                        sm={12}
                        className="grid-padding"
                        style={{ marginTop: '10px' }}
                      >
                        <FormControl fullWidth>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="sameAsBillingAddress"
                                icon={
                                  <CheckBoxOutlineBlankIcon
                                    style={{ color: 'grey' }}
                                  />
                                }
                                checkedIcon={
                                  <CheckBoxIcon style={{ color: '#Ef5350' }} />
                                }
                                defaultChecked={false}
                              />
                            }
                            label="Same as Billing address"
                            value={copyAddress}
                            onChange={(event) => {
                              setCopyAddress(event.target.checked);
                              if (event.target.checked) {
                                setTaxSettingsData(
                                  'dispatchAddress',
                                  taxSettingsData.billingAddress
                                );
                                setTaxSettingsData(
                                  'dispatchCity',
                                  taxSettingsData.city
                                );
                                setTaxSettingsData(
                                  'dispatchArea',
                                  taxSettingsData.area
                                );
                                setTaxSettingsData(
                                  'dispatchPincode',
                                  taxSettingsData.pincode
                                );
                                setTaxSettingsData(
                                  'dispatchCity',
                                  taxSettingsData.city
                                );
                                setTaxSettingsData(
                                  'dispatchState',
                                  taxSettingsData.state
                                );
                              } else {
                                setTaxSettingsData('dispatchAddress', '');
                                setTaxSettingsData('dispatchCity', '');
                                setTaxSettingsData('dispatchArea', '');
                                setTaxSettingsData('dispatchPincode', '');
                                setTaxSettingsData('dispatchCity', '');
                                setTaxSettingsData('dispatchState', '');
                              }
                            }}
                          />
                        </FormControl>
                      </Grid>

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: '100%'
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '40%'
                          }}
                        >
                          <div>
                            <p>Dispatch Address</p>
                            <TextField
                              placeholder="Enter Billing Address"
                              style={{ width: '95%' }}
                              variant="outlined"
                              className={classes.textField}
                              multiline
                              minRows={2}
                              value={taxSettingsData.dispatchAddress}
                              onChange={(e) =>
                                setTaxSettingsData(
                                  'dispatchAddress',
                                  e.target.value
                                )
                              }
                              margin="dense"
                              inputProps={{ style: { height: '58px' } }}
                            />
                          </div>

                          <div>
                            {/* <p>Dispatch City</p> */}
                            <TextField
                              placeholder="Enter Dispatch City"
                              style={{ width: '95%' }}
                              variant="outlined"
                              className={classes.textField}
                              value={taxSettingsData.dispatchCity}
                              onChange={(e) =>
                                setTaxSettingsData(
                                  'dispatchCity',
                                  e.target.value
                                )
                              }
                              margin="dense"
                              label="City"
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '40%',
                            marginTop: '25px'
                          }}
                        >
                          <div>
                            {/* <p>Dispatch Area</p> */}
                            <TextField
                              placeholder="Enter Area"
                              style={{ width: '95%', zIndex: '0' }}
                              variant="outlined"
                              className={classes.textField}
                              value={taxSettingsData.dispatchArea}
                              onChange={(e) =>
                                setTaxSettingsData(
                                  'dispatchArea',
                                  e.target.value
                                )
                              }
                              margin="dense"
                              label="Area"
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </div>

                          <div>
                            {/* <p>Dispatch Pincode</p> */}
                            <TextField
                              placeholder="Enter Pincode"
                              style={{ width: '95%', zIndex: '0' }}
                              variant="outlined"
                              className={classes.textField}
                              value={taxSettingsData.dispatchPincode}
                              onChange={(e) =>
                                setTaxSettingsData(
                                  'dispatchPincode',
                                  e.target.value
                                )
                              }
                              margin="dense"
                              label="Pincode"
                              InputLabelProps={{
                                shrink: true
                              }}
                            />
                          </div>

                          <div>
                            <p
                              style={{
                                fontSize: '13px',
                                color: 'grey',
                                paddingLeft: '13px'
                              }}
                            >
                              State
                            </p>
                            <Select
                              displayEmpty
                              value={taxSettingsData.dispatchState}
                              input={<OutlinedInput style={{ width: '95%' }} />}
                              onChange={(e) => {
                                if ('Select State' !== e.target.value) {
                                  setTaxSettingsData(
                                    'dispatchState',
                                    e.target.value
                                  );
                                }
                              }}
                            >
                              {stateList.map((option, index) => (
                                <MenuItem value={option.name}>
                                  {option.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <div style={{ display: 'inline-block' }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={taxSettingsData.compositeScheme}
                                onChange={(e) => {
                                  setTaxSettingsData(
                                    'compositeScheme',
                                    e.target.checked
                                  );
                                }}
                                name="compositeScheme"
                              />
                            }
                            label="Composite Scheme"
                          />
                        </div>
                        <div style={{ display: 'inline-block' }}>
                          <Select
                            value={taxSettingsData.compositeSchemeValue}
                            onChange={(e) => {
                              setTaxSettingsData(
                                'compositeSchemeValue',
                                e.target.value
                              );
                              setCompositeSchemeType(e.target.value);
                            }}
                          >
                            <MenuItem value={'1'}>Trader(Goods) 1.0%</MenuItem>
                            <MenuItem value={'1.0'}>Manufacturer 1.0%</MenuItem>
                            <MenuItem value={'5'}>Restaurant 5.0%</MenuItem>
                            <MenuItem value={'6'}>
                              Service Provider 6.0%
                            </MenuItem>
                          </Select>
                        </div>
                      </div>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={taxSettingsData.reverseCharge}
                            onChange={(e) => {
                              setTaxSettingsData(
                                'reverseCharge',
                                e.target.checked
                              );
                            }}
                            name="reverseCharge"
                          />
                        }
                        label="Enable Reverse Charge on Purchases"
                      />

                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: '100%',
                          marginTop: '20px'
                        }}
                      >
                        <div style={{ width: '40%' }}>
                          <TextField
                            placeholder="Enter Exporter Code"
                            style={{ width: '95%' }}
                            variant="outlined"
                            className={classes.textField}
                            value={taxSettingsData.exporterCodeNo}
                            onChange={(e) => {
                              setTaxSettingsData(
                                'exporterCodeNo',
                                e.target.value
                              );
                            }}
                            margin="dense"
                            label="Exporter Code No"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </div>
                        <div style={{ width: '40%' }}>
                          <TextField
                            placeholder="Enter Exporter Reg. Date"
                            style={{ width: '95%' }}
                            variant="outlined"
                            className={classes.textField}
                            value={taxSettingsData.exporterRegistrationDate}
                            onChange={(e) => {
                              setTaxSettingsData(
                                'exporterRegistrationDate',
                                e.target.value
                              );
                            }}
                            margin="dense"
                            label="Exporter Reg. Date"
                            InputLabelProps={{
                              shrink: true
                            }}
                          />
                        </div>
                      </div>

                      <Button
                        className={classes.saveBtn}
                        onClick={(e) => {
                          saveData();
                          setSnackBar(true);
                          setTimeout(() => {
                            setSnackBar(false);
                          }, 3000);
                        }}
                      >
                        Save
                      </Button>
                      <Snackbar
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center'
                        }}
                        open={snackBarOpen}
                        onClose={handleClose}
                        ContentProps={{
                          'aria-describedby': 'message-id'
                        }}
                        message={
                          <span id="message-id">Successfully Saved</span>
                        }
                      />
                    </FormGroup>
                  </FormControl>
                )}
              </Paper>
            ) : (
              <NoPermission />
            )}
          </>
        )}
      </Col>
    </Grid>
  );
};

export default injectWithObserver(TaxSettings);