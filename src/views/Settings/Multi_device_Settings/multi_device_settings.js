import React, { useEffect } from 'react';
import { TextField } from '@material-ui/core';
import { toJS } from 'mobx';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import useWindowDimensions from '../../../components/windowDimension';
import {
  makeStyles,
  Typography,
  Card,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio
} from '@material-ui/core';
import { useStore } from 'src/Mobx/Helpers/UseStore';
import * as Bd from 'src/components/SelectedBusiness';
import GeneralSettingsNavigation from '../GeneralSettingsNavigation';
import Paper from '@material-ui/core/Paper';
import { Grid, Col } from 'react-flexbox-grid';
import NoPermission from '../../noPermission';
import BubbleLoader from '../../../components/loader';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
    // backgroundColor: theme.palette.background.paper,
  },
  PlaceOfsupplyListbox: {
    minWidth: '18%',
    margin: 0,
    padding: 5,
    zIndex: 1,
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
    width: '40%',
    justifyContent: 'start',
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
  addPrefixbtn: {
    fontSize: 'small',
    color: '#EF5350'
  },
  subHeader: {
    color: '#4A83FB',
    textDecoration: 'underline',
    marginTop: '25px',
    marginBottom: '10px',
    fontWeight: 500
  },
  checkboxCenterAlign: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'end'
  },
  icon: {
    margin: theme.spacing.unit,
    fontSize: 20,
    float: 'right'
  },
  cardList: {
    display: 'block',
    textAlign: 'center',
    paddingTop: '10px',
    color: 'grey'
  },
  gridpad: {
    margin: '0px',
    padding: '0px'
  },
  tickSize: {
    transform: 'scale(.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  paper: {
    padding: 18
  },
  containerLeft: {
    width: '12%',
    minHeight: '590px'
  },
  containerRight: {
    width: '88%'
  },
  formLabel: {
    paddingLeft: '30px',
    color: '#263238',
    fontWeight: 'bold'
  },
  formMultiLabel: {
    marginRight: '0px'
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
  containerField: {
    marginTop: '16px'
  }
}));

const MultiDeviceSettings = () => {
  const classes = useStyles();
  const stores = useStore();
  const navigate = useNavigate();

  const {
    getMultiDeviceSettings,
    setBillOnlyOnline,
    setAutoInjectLocalDeviceNo
  } = stores.MultiDeviceSettingsStore;

  const { multiDeviceSettingsData } = toJS(stores.MultiDeviceSettingsStore);

  const { height } = useWindowDimensions();

  const [isFeatureAvailable, setFeatureAvailable] = React.useState(true);
  const [isLoading, setLoadingShown] = React.useState(true);

  useEffect(() => {
    async function fetchData() {
      await getMultiDeviceSettings();
    }

    fetchData();
  }, [getMultiDeviceSettings]);

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
            <GeneralSettingsNavigation
              navigation={navigate}
              active="multidevicesetting"
            />
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
                style={{ height: height - 62 + 'px', overflowY: 'auto' }}
              >
                <Grid container>
                  <Grid item xs={12}>
                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <Typography
                          variant="h5"
                          className={classes.type}
                          style={{ marginTop: '30px', marginBottom: '10px' }}
                        >
                          Device Name:{' '}
                          {localStorage.getItem('deviceName')
                            ? localStorage.getItem('deviceName')
                            : 'NA'}
                        </Typography>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl component="fieldset">
                        <Typography
                          variant="h5"
                          className={classes.type}
                          style={{ marginTop: '30px', marginBottom: '10px' }}
                        >
                          Please choose behaviour in case of network failures
                        </Typography>
                        <RadioGroup column aria-label="barcode" name="barcode">
                          <FormControlLabel
                            labelPlacement="end"
                            value={multiDeviceSettingsData.billOnlyOnline}
                            checked={multiDeviceSettingsData.billOnlyOnline}
                            control={<Radio size="small" />}
                            label={
                              <Typography style={{ fontSize: 13 }}>
                                Bill only Online
                              </Typography>
                            }
                            onChange={(e) => {
                              setBillOnlyOnline(true);
                              setAutoInjectLocalDeviceNo(false);
                            }}
                          />
                          <FormControlLabel
                            value={
                              multiDeviceSettingsData.autoInjectLocalDeviceNo
                            }
                            checked={
                              multiDeviceSettingsData.autoInjectLocalDeviceNo
                            }
                            labelPlacement="end"
                            control={<Radio size="small" />}
                            label={
                              <Typography style={{ fontSize: 13 }}>
                                Auto insert Local Device Invoice Number on
                                network failure
                              </Typography>
                            }
                            onChange={(e) => {
                              setAutoInjectLocalDeviceNo(true);
                              setBillOnlyOnline(false);
                            }}
                          />
                        </RadioGroup>
                      </FormControl>
                    </Grid>

                    <Typography
                      variant="h5"
                      style={{ marginTop: '30px', marginBottom: '10px' }}
                    >
                      Local Transaction Prefixes and Sequence No
                    </Typography>

                    <Typography variant="h6" className={classes.subHeader}>
                      Sales
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.sales.prefixSequence &&
                            multiDeviceSettingsData.sales.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.sales.prefixSequence[0]
                                  .prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.sales.prefixSequence &&
                            multiDeviceSettingsData.sales.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.sales.prefixSequence[0]
                                  .sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Sales Return
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.salesReturn
                              .prefixSequence &&
                            multiDeviceSettingsData.salesReturn.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.salesReturn
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.salesReturn
                              .prefixSequence &&
                            multiDeviceSettingsData.salesReturn.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.salesReturn
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Payment In
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.paymentIn.prefixSequence &&
                            multiDeviceSettingsData.paymentIn.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.paymentIn
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.paymentIn.prefixSequence &&
                            multiDeviceSettingsData.paymentIn.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.paymentIn
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Payment Out
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.paymentOut.prefixSequence &&
                            multiDeviceSettingsData.paymentOut.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.paymentOut
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.paymentOut.prefixSequence &&
                            multiDeviceSettingsData.paymentOut.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.paymentOut
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Sales Quotation/Estimate
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.salesQuotation
                              .prefixSequence &&
                            multiDeviceSettingsData.salesQuotation
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.salesQuotation
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.salesQuotation
                              .prefixSequence &&
                            multiDeviceSettingsData.salesQuotation
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.salesQuotation
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Approval
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.approval.prefixSequence &&
                            multiDeviceSettingsData.approval.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.approval
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.approval.prefixSequence &&
                            multiDeviceSettingsData.approval.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.approval
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Job Work Order - In
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.jobWorkOrderIn
                              .prefixSequence &&
                            multiDeviceSettingsData.jobWorkOrderIn
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.jobWorkOrderIn
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.jobWorkOrderIn
                              .prefixSequence &&
                            multiDeviceSettingsData.jobWorkOrderIn
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.jobWorkOrderIn
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Job Work Order - Out
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.jobWorkOrderOut
                              .prefixSequence &&
                            multiDeviceSettingsData.jobWorkOrderOut
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.jobWorkOrderOut
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.jobWorkOrderOut
                              .prefixSequence &&
                            multiDeviceSettingsData.jobWorkOrderOut
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.jobWorkOrderOut
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Work Order Receipt
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.workOrderReceipt
                              .prefixSequence &&
                            multiDeviceSettingsData.workOrderReceipt
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.workOrderReceipt
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.workOrderReceipt
                              .prefixSequence &&
                            multiDeviceSettingsData.workOrderReceipt
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.workOrderReceipt
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Delivery Challan
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.deliveryChallan
                              .prefixSequence &&
                            multiDeviceSettingsData.deliveryChallan
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.deliveryChallan
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.deliveryChallan
                              .prefixSequence &&
                            multiDeviceSettingsData.deliveryChallan
                              .prefixSequence.length > 0
                              ? multiDeviceSettingsData.deliveryChallan
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Purchase Order
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.purchaseOrder
                              .prefixSequence &&
                            multiDeviceSettingsData.purchaseOrder.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.purchaseOrder
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.purchaseOrder
                              .prefixSequence &&
                            multiDeviceSettingsData.purchaseOrder.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.purchaseOrder
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Sale Order
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.saleOrder.prefixSequence &&
                            multiDeviceSettingsData.saleOrder.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.saleOrder
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.saleOrder.prefixSequence &&
                            multiDeviceSettingsData.saleOrder.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.saleOrder
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Manufacture
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.manufacture
                              .prefixSequence &&
                            multiDeviceSettingsData.manufacture.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.manufacture
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Sequence No
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.manufacture
                              .prefixSequence &&
                            multiDeviceSettingsData.manufacture.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.manufacture
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Expense
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.expense.prefixSequence &&
                            multiDeviceSettingsData.expense.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.expense
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          To Start With
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.expense.prefixSequence &&
                            multiDeviceSettingsData.expense.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.expense
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Stock
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.stock.prefixSequence &&
                            multiDeviceSettingsData.stock.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.stock.prefixSequence[0]
                                  .prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          To Start With
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.stock.prefixSequence &&
                            multiDeviceSettingsData.stock.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.stock.prefixSequence[0]
                                  .sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Receipt
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.tallyReceipt
                              .prefixSequence &&
                            multiDeviceSettingsData.tallyReceipt.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.tallyReceipt
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          To Start With
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.tallyReceipt
                              .prefixSequence &&
                            multiDeviceSettingsData.tallyReceipt.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.tallyReceipt
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Payment
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.tallyPayment
                              .prefixSequence &&
                            multiDeviceSettingsData.tallyPayment.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.tallyPayment
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          To Start With
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.tallyPayment
                              .prefixSequence &&
                            multiDeviceSettingsData.tallyPayment.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.tallyPayment
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>

                    <Typography variant="h6" className={classes.subHeader}>
                      Scheme
                    </Typography>

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                      }}
                    >
                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          Prefix
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          value={
                            multiDeviceSettingsData.scheme
                              .prefixSequence &&
                            multiDeviceSettingsData.scheme.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.scheme
                                  .prefixSequence[0].prefix
                              : ''
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>

                      <div
                        style={{
                          width: '50%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <Typography style={{ fontSize: '13px' }}>
                          To Start With
                        </Typography>

                        <TextField
                          id="outlined-size-normal"
                          defaultValue=""
                          style={{ width: '80%' }}
                          variant="outlined"
                          type="number"
                          placeholder="Add Sequence No"
                          value={
                            multiDeviceSettingsData.scheme
                              .prefixSequence &&
                            multiDeviceSettingsData.scheme.prefixSequence
                              .length > 0
                              ? multiDeviceSettingsData.scheme
                                  .prefixSequence[0].sequenceNumber
                              : 1
                          }
                          className={classes.addPrefixbtn}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
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

export default injectWithObserver(MultiDeviceSettings);
