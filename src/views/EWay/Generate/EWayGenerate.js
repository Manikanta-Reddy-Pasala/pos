import React, { useState, forwardRef, useEffect } from 'react';
import {
  Slide,
  Dialog,
  AppBar,
  Toolbar,
  Grid,
  Button,
  makeStyles,
  IconButton,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
  Typography,
  FormHelperText,
  useMediaQuery,
  useTheme,
  DialogContentText
} from '@material-ui/core';
import { AgGridReact } from 'ag-grid-react';
import { Cancel } from '@material-ui/icons';
import BubbleLoader from '../../../components/loader';
import styles from './style';
import Loader from 'react-js-loader';

import { useStore } from 'src/Mobx/Helpers/UseStore';
import injectWithObserver from 'src/Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import * as ewayHelper from 'src/components/Helpers/EWayHelper';
import getStateList from '../../../components/StateList';
import moment from 'moment';

import left_arrow from '../../../icons/svg/left_arrow.svg';
import right_arrow from '../../../icons/svg/right_arrow.svg';
import first_page_arrow from '../../../icons/svg/first_page_arrow.svg';
import last_page_arrow from '../../../icons/svg/last_page_arrow.svg';
import { withStyles } from '@material-ui/core/styles';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogContent from '@material-ui/core/DialogContent';
import { display } from '@material-ui/system';

var dateFormat = require('dateformat');

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useInnerStyles = makeStyles((theme) => ({
  alignCenter: {
    marginTop: 'auto',
    marginBottom: 'auto'
  }
}));

const EwayGenerate = () => {
  const classes = styles.useStyles();
  const innerClasses = useInnerStyles();
  const stores = useStore();
  const {
    openEWayGenerateModal,
    invoiceDetails,
    type,
    openGenErrorAlertMessage,
    genErrorMessage,
    openLoadingAlertMessage
  } = toJS(stores.EWayStore);
  const {
    handleCloseEWayGenerateModal,
    generateEWay,
    setEwayGenEwaySupplyType,
    setEwayGenEwaySubSupplyType,
    setEwayGenEwayTxnType,
    setEwayDocType,
    setEwayDocNo,
    setEwayDocDate,
    setEwayBillFromName,
    setEwayBillFromGST,
    setEwayBillFromState,
    setEwayDispatchFromAddress,
    setEwayDispatchFromPincode,
    setEwayDispatchFromState,
    setEwayBillToName,
    setEwayBillToGST,
    setEwayBillToState,
    setEwayShipToAddress,
    setEwayShipToPincode,
    setEwayShipToState,
    setEwayTransporterName,
    setEwayTransportID,
    setEwayApproxDistance,
    setEwayTransportMode,
    setEwayVehicleType,
    setEwayVehicleNo,
    setEwayTransporterDocNo,
    setEwayTransporterDocDate,
    setEwayDispatchFromPlace,
    setEwayShipToPlace,
    handleCloseGenEWayErrorModal,
    setGenErrorMessage,
    handleOpenGenEWayErrorModal,
    handleOpenGenEWayLoadingModal
  } = stores.EWayStore;

  const [genEwayTxnType, setGenEwayTxnType] = useState();
  const [ewayTxnTypes] = useState(ewayHelper.getEWayTransactionTypes);
  const [genEwaySupplyType, setGenEwaySupplyType] = useState();
  const [supplyTypes] = useState(ewayHelper.getEWaySupplyTypes);
  const [genEwaySubSupplyType, setGenEwaySubSupplyType] = useState();
  const [subSupplyTypes] = useState(ewayHelper.getEWaySubSupplyTypes);

  //doc
  const [docType, setDocType] = useState('');
  const [docNo, setDocNo] = useState('');
  const [docDate, setDocDate] = useState('');

  // Bill From
  const [billFromName, setBillFromName] = useState('');
  const [billFromGST, setBillFromGST] = useState('');
  const [billFromState, setBillFromState] = useState('');

  // dispatch From
  const [dispatchFromAddress, setDispatchFromAddress] = useState('');
  const [dispatchFromPincode, setDispatchFromPincode] = useState('');
  const [dispatchFromState, setDispatchFromState] = useState('');
  const [dispatchFromPlace, setDispatchFromPlace] = useState('');

  // Bill To
  const [billToName, setBillToName] = useState('');
  const [billToGST, setBillToGST] = useState('');
  const [billToState, setBillToState] = useState('');

  // Ship To
  const [shipToAddress, setShipToAddress] = useState('');
  const [shipToPincode, setShipToPincode] = useState('');
  const [shipToState, setShipToState] = useState('');
  const [shipToPlace, setShipToPlace] = useState('');

  // Transportation details
  const [transporterName, setTransporterName] = useState('');
  const [transportID, setTransportID] = useState('');
  const [approxDistance, setApproxDistance] = useState(0);

  // Part B
  const [transportMode, setTransportMode] = useState('Road');
  const [transportModeList] = useState(ewayHelper.getTransportationModes());
  const [vehicleType, setVehicleType] = useState('Regular');
  const [vehicleTypeList] = useState(ewayHelper.getVehicleTypes());
  const [stateList] = useState(getStateList());
  const [vehicleNo, setVehicleNo] = useState('');
  const [transporterDocNo, setTransporterDocNo] = useState('');

  const today = new Date().getDate();
  const thisYear = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const firstThisMonth = new Date(thisYear, thisMonth, 1);
  const todayDate = new Date(thisYear, thisMonth, today);

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  };

  const [transporterDocDate, setTransporterDocDate] = useState(formatDate(todayDate));

  const { getTaxSettingsDetails } = stores.TaxSettingsStore;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleErrorAlertMessageClose = () => {
    handleCloseGenEWayErrorModal();
  };

  const saveGenerateEWay = async (isSaveAndPrint) => {
    let isHSNMissing = false;

    for (let item of invoiceDetails.item_list) {
      if (item.hsn === '') {
        isHSNMissing = true;
        break;
      }
    }

    if (invoiceDetails.item_list.length === 0) {
      setGenErrorMessage(
        'Please add atleast one product to proceed with E-Way generation.'
      );
      handleOpenGenEWayErrorModal();
    } else if (isHSNMissing) {
      setGenErrorMessage(
        'One or more products have missing HSN. Please provide it to proceed with E-Way generation.'
      );
      handleOpenGenEWayErrorModal();
    } else if (billFromGST === '') {
      setGenErrorMessage(
        'Seller GST number cannot be left blank. Please provide it to proceed with E-Way generation.'
      );
      handleOpenGenEWayErrorModal();
    } else if (dispatchFromPincode === '') {
      setGenErrorMessage(
        'Seller dispatch pincode cannot be left blank. Please provide it to proceed with E-Way generation.'
      );
      handleOpenGenEWayErrorModal();
    } else if (billToGST === '') {
      setGenErrorMessage(
        'Buyer GST number cannot be left blank. Please provide it to proceed with E-Way generation.'
      );
      handleOpenGenEWayErrorModal();
    } else if (shipToPincode === '') {
      setGenErrorMessage(
        'Shipping address pincode cannot be left blank. Please provide it to proceed with E-Way generation.'
      );
      handleOpenGenEWayErrorModal();
    } else if (shipToState === '') {
      setGenErrorMessage(
        'Shipping state cannot be left blank. Please provide it to proceed with E-Way generation.'
      );
      handleOpenGenEWayErrorModal();
    } else if (dispatchFromState === '') {
      setGenErrorMessage(
        'Dispatch address state cannot be left blank. Please provide it to proceed with E-Way generation.'
      );
      handleOpenGenEWayErrorModal();
    } else {
      setEwayTransportMode(transportMode);
      setEwayVehicleType(vehicleType);

      handleOpenGenEWayLoadingModal();
      await generateEWay(isSaveAndPrint);
    }
  };

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  const [columnDefs] = useState([
    {
      headerName: 'NAME',
      field: 'item_name',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'HSN',
      field: 'hsn',
      width: 300,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    },
    {
      headerName: 'TAX',
      field: 'tax',
      width: 290,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      valueFormatter: (params) => {
        let data = params['data'];
        return (
          parseFloat(data['cgst_amount']) +
          parseFloat(data['sgst_amount']) +
          parseFloat(data['igst_amount'])
        );
      }
    },
    {
      headerName: 'TOTAL AMT',
      field: 'amount',
      width: 290,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      }
    }
  ]);

  const handleTransporterDocDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setTransporterDocDate(date);
    setEwayTransporterDocDate(date);
  };

  const handleDocDateChange = (date) => {
    date = moment(date).isValid()
      ? dateFormat(date, 'yyyy-mm-dd')
      : dateFormat(new Date(), 'yyyy-mm-dd');

    setDocDate(date);
    setEwayDocDate(date);
  };

  useEffect(() => {
    async function fetchData() {
      let taxSettingsData = await getTaxSettingsDetails();
      if (taxSettingsData) {
        if (taxSettingsData.tradeName !== '') {
          setBillFromName(taxSettingsData.tradeName);
          setEwayBillFromName(taxSettingsData.tradeName);
        }
        if (taxSettingsData.gstin !== '') {
          setBillFromGST(taxSettingsData.gstin);
          setEwayBillFromGST(taxSettingsData.gstin);
        }
        if (taxSettingsData.state !== '') {
          setBillFromState(taxSettingsData.state);

          let stateObject = stateList.find(
            (o) => o.name === taxSettingsData.state
          );
          if (stateObject) {
            setEwayBillFromState(parseInt(stateObject.code));
          }
        }
        if (taxSettingsData.dispatchAddress !== '') {
          setDispatchFromAddress(taxSettingsData.dispatchAddress);
          setEwayDispatchFromAddress(taxSettingsData.dispatchAddress);
        }
        if (taxSettingsData.dispatchPincode !== '') {
          setDispatchFromPincode(taxSettingsData.dispatchPincode);
          setEwayDispatchFromPincode(taxSettingsData.dispatchPincode);
        }
        if (taxSettingsData.dispatchArea !== '') {
          setDispatchFromPlace(taxSettingsData.dispatchArea);
          setEwayDispatchFromPlace(taxSettingsData.dispatchArea);
        }
        if (taxSettingsData.dispatchState !== '') {
          setDispatchFromState(taxSettingsData.dispatchState);

          let stateObject = stateList.find(
            (o) => o.name === taxSettingsData.dispatchState
          );
          if (stateObject) {
            setEwayDispatchFromState(parseInt(stateObject.code));
          }
        }
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (invoiceDetails) {
      // Set Bill To details
      if (invoiceDetails.customer_name !== '') {
        setBillToName(invoiceDetails.customer_name);
        setEwayBillToName(invoiceDetails.customer_name);
      }

      if (invoiceDetails.customerGSTNo !== '') {
        setBillToGST(invoiceDetails.customerGSTNo);
        setEwayBillToGST(invoiceDetails.customerGSTNo);
      } else if (invoiceDetails.customerGstType === 'Unregistered Customer') {
        setBillToGST('URP');
        setEwayBillToGST('URP');
      }

      if (invoiceDetails.customerState !== '') {
        setBillToState(invoiceDetails.customerState);

        let stateObject = stateList.find(
          (o) => o.name === invoiceDetails.customerState
        );
        if (stateObject) {
          setEwayBillToState(parseInt(stateObject.code));
        }
      }

      // Set Ship To details
      if (invoiceDetails.shipToCustomerAddress !== '') {
        setShipToAddress(invoiceDetails.shipToCustomerAddress);
        setEwayShipToAddress(invoiceDetails.shipToCustomerAddress);
      }

      if (invoiceDetails.shipToCustomerPincode !== '') {
        setShipToPincode(invoiceDetails.shipToCustomerPincode);
        setEwayShipToPincode(invoiceDetails.shipToCustomerPincode);
      }

      if (invoiceDetails.shipToCustomerState !== '') {
        setShipToState(invoiceDetails.shipToCustomerState);

        let stateObject = stateList.find(
          (o) => o.name === invoiceDetails.shipToCustomerState
        );
        if (stateObject) {
          setEwayShipToState(parseInt(stateObject.code));
        }
      }

      setDocType('INV');
      setEwayDocType('INV');

      if (invoiceDetails.sequenceNumber !== '') {
        setDocNo(invoiceDetails.sequenceNumber);
        setEwayDocNo(invoiceDetails.sequenceNumber);
      }

      if (invoiceDetails.invoice_date !== '') {
        setDocDate(invoiceDetails.invoice_date);
        setEwayDocDate(invoiceDetails.invoice_date);
      }

      if ('Invoice' === type) {
        setGenEwaySupplyType('Outward');
        setEwayGenEwaySupplyType('Outward');
        setGenEwaySubSupplyType('Supply');
        setEwayGenEwaySubSupplyType('Supply');
        setEwayGenEwayTxnType('Regular');
        setGenEwayTxnType('Regular');
      }

      if (invoiceDetails.approxDistance > 0) {
        setApproxDistance(invoiceDetails.approxDistance);
        setEwayApproxDistance(invoiceDetails.approxDistance);
      }

      if (invoiceDetails.vehicleNo !== '') {
        setVehicleNo(invoiceDetails.vehicleNo);
        setEwayVehicleNo(invoiceDetails.vehicleNo);
      }

      if (invoiceDetails.transporterId !== '') {
        setTransportID(invoiceDetails.transporterId);
        setEwayTransportID(invoiceDetails.transporterId);
      }

      if (invoiceDetails.transporterName !== '') {
        setTransporterName(invoiceDetails.transporterName);
        setEwayTransporterName(invoiceDetails.transporterName);
      }

      if (invoiceDetails.vehicleType !== '') {
        setVehicleType(invoiceDetails.vehicleType);
        setEwayVehicleType(invoiceDetails.vehicleType);
      }

      if (invoiceDetails.transportMode !== '') {
        setTransportMode(invoiceDetails.transportMode);
        setEwayTransportMode(invoiceDetails.transportMode);
      }

      setEwayTransporterDocDate(transporterDocDate);
    }
  }, [invoiceDetails]);

  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2)
    }
  }))(MuiDialogContent);

  const DialogActions = withStyles((theme) => ({
    root: {
      margin: 0,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(3)
    }
  }))(MuiDialogActions);

  return (
    <div>
      <Dialog
        PaperProps={{
          style: {
            backgroundColor: '#f6f8fa',
            boxShadow: 'none'
          }
        }}
        onEscapeKeyDown={handleCloseEWayGenerateModal}
        fullScreen
        TransitionComponent={Transition}
        open={openEWayGenerateModal}
        onClose={handleCloseEWayGenerateModal}
      >
        <AppBar
          elevation={1}
          className={classes.appBar}
          style={{ position: 'sticky' }}
        >
          <Toolbar variant="dense">
            <Grid container>
              <Grid item xs={5} className={innerClasses.alignCenter}>
                <Grid item xs={12} className={classes.pageHeader}>
                  <Grid
                    item
                    style={{ marginTop: 'auto', marginBottom: 'auto' }}
                  >
                    <Typography
                      aria-controls="simple-menu"
                      size="large"
                      variant="button"
                      className={classes.menubutton}
                    >
                      Generate E-Way Bill{' '}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={7} style={{ textAlign: 'end' }}>
                <IconButton onClick={handleCloseEWayGenerateModal}>
                  <Cancel fontSize="inherit" />
                </IconButton>
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>

        {/********* Type Selection Grid *********/}
        <Grid
          container
          spacing={2}
          className={classes.gridStyle}
          style={{ marginTop: '20px' }}
        >
          <Grid
            item
            xs={12}
            style={{ marginLeft: '53px', paddingBottom: '0px' }}
          >
            <Typography
              className={classes.oneShellColor}
              style={{ textTransform: 'none' }}
              variant="button"
            >
              Transaction Details
            </Typography>
          </Grid>
          <Grid
            item
            xs={4}
            style={{
              textAlign: 'left',
              paddingLeft: '60px',
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              className={classes.oneShellColor}
              style={{ textTransform: 'none' }}
              variant="button"
            >
              Supply Types
            </Typography>

            <Select
              displayEmpty
              value={genEwaySupplyType}
              input={<OutlinedInput style={{ width: '60%' }} />}
              inputProps={{ 'aria-label': 'Without label' }}
              onChange={(e) => {
                setGenEwaySupplyType(e.target.value);
                setEwayGenEwaySupplyType(e.target.value);
              }}
            >
              {supplyTypes.map((option, index) => (
                <MenuItem value={option.name}>{option.name}</MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid
            item
            xs={4}
            style={{
              alignItems: 'center',
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              className={classes.oneShellColor}
              style={{ textTransform: 'none', width: '60%' }}
              variant="button"
            >
              Sub Supply Types
            </Typography>

            <Select
              displayEmpty
              value={genEwaySubSupplyType}
              input={<OutlinedInput style={{ width: '60%' }} />}
              inputProps={{ 'aria-label': 'Without label' }}
              onChange={(e) => {
                setEwayGenEwaySubSupplyType(e.target.value);
                setGenEwaySubSupplyType(e.target.value);
              }}
            >
              {subSupplyTypes.map((option, index) => (
                <MenuItem value={option.name}>{option.name}</MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid
            item
            xs={4}
            style={{
              alignItems: 'flex-end',
              paddingRight: '50px',
              textAlign: 'left',
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              className={classes.oneShellColor}
              style={{ textTransform: 'none', width: '60%' }}
              variant="button"
            >
              Transaction Types
            </Typography>

            <Select
              displayEmpty
              value={genEwayTxnType}
              input={
                <OutlinedInput style={{ width: '60%', textAlign: 'left' }} />
              }
              inputProps={{ 'aria-label': 'Without label' }}
              onChange={(e) => {
                let txnObject = ewayTxnTypes.find(
                  (o) => o.name === e.target.value
                );

                setEwayGenEwayTxnType(txnObject.val);
                setGenEwayTxnType(e.target.value);
              }}
            >
              {ewayTxnTypes.map((option, index) => (
                <MenuItem value={option.name}>{option.name}</MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>

        {/********* Document Details Grid*********/}
        <Grid container spacing={2} className={classes.gridStyle}>
          <Grid
            item
            xs={12}
            style={{ marginLeft: '53px', paddingBottom: '0px' }}
          >
            <Typography
              className={classes.oneShellColor}
              style={{ textTransform: 'none' }}
              variant="button"
            >
              Document Details
            </Typography>
          </Grid>

          <Grid
            item
            xs={4}
            style={{
              textAlign: 'left',
              paddingLeft: '60px',
              marginTop: '10px',
              marginBottom: '15px'
            }}
          >
            <TextField
              label="Doc. Type"
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={docType}
              style={{ width: '60%' }}
            />
          </Grid>

          <Grid
            item
            xs={4}
            style={{
              textAlign: 'center',
              marginTop: '10px',
              marginBottom: '15px'
            }}
          >
            <TextField
              label="Doc. No."
              variant="outlined"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={docNo}
              style={{ width: '60%' }}
            />
          </Grid>

          <Grid
            item
            xs={4}
            style={{
              textAlign: 'right',
              paddingRight: '50px',
              marginTop: '10px',
              marginBottom: '15px'
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              type="date"
              label="Doc. Date"
              InputLabelProps={{ shrink: true }}
              value={docDate}
              style={{ color: '#000000', fontSize: 'small', width: '60%' }}
            />
          </Grid>
        </Grid>

        {/********* BillFrom/Dispatch From Grid *********/}
        <Grid container spacing={2} className={classes.gridStyle}>
          <Grid item xs={6}>
            <Grid item xs={6} style={{ marginLeft: '53px' }}>
              <Typography
                className={classes.oneShellColor}
                style={{ textTransform: 'none' }}
                variant="button"
              >
                Bill From
              </Typography>
            </Grid>
            <br />
            <Grid container className={classes.gridRow}>
              <Grid item xs={4}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={billFromName}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    setEwayBillFromName(e.target.value);
                    setBillFromName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="GSTN"
                  variant="outlined"
                  fullWidth
                  required
                  value={billFromGST}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    setBillFromGST(e.target.value);
                    setEwayBillFromGST(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container className={classes.gridRow}>
              <Grid item xs={4} style={{ marginTop: '51px' }}>
                <Select
                  displayEmpty
                  value={billFromState}
                  input={<OutlinedInput style={{ width: '100%' }} />}
                  onChange={(e) => {
                    setBillFromState(e.target.value);

                    let stateObject = stateList.find(
                      (o) => o.name === e.target.value
                    );
                    if (stateObject) {
                      setEwayBillFromState(parseInt(stateObject.code));
                    }
                  }}
                >
                  {stateList.map((option, index) => (
                    <MenuItem value={option.name}>{option.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>Please select State</FormHelperText>
              </Grid>

              <Grid item xs={4}></Grid>
            </Grid>
            <br />
          </Grid>

          <Grid item xs={6}>
            <Grid item xs={12}>
              <Typography
                className={classes.oneShellColor}
                style={{ textTransform: 'none' }}
                variant="button"
              >
                Dispatch From
              </Typography>
            </Grid>
            <br />
            <Grid
              container
              spacing={2}
              className={classes.gridRow}
              style={{ marginRight: '15px' }}
            >
              <Grid item xs={6}>
                <Grid container spacing={2} className={classes.gridCol}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="From Address"
                      value={dispatchFromAddress}
                      InputLabelProps={{ shrink: true }}
                      multiline
                      rows={2}
                      inputProps={{
                        style: {
                          padding: 0
                        }
                      }}
                      onChange={(e) => {
                        setDispatchFromAddress(e.target.value);
                        setEwayDispatchFromAddress(e.target.value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Place"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={dispatchFromPlace}
                      onChange={(e) => {
                        setDispatchFromPlace(e.target.value);
                        setEwayDispatchFromPlace(e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container spacing={2} className={classes.gridCol}>
                  <Grid item xs={12} sm={9}>
                    <TextField
                      label="Pincode"
                      variant="outlined"
                      fullWidth
                      value={dispatchFromPincode}
                      required
                      InputLabelProps={{ shrink: true }}
                      onChange={(e) => {
                        setDispatchFromPincode(e.target.value);
                        setEwayDispatchFromPincode(e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={9} style={{ marginTop: '55px' }}>
                    <Select
                      displayEmpty
                      value={dispatchFromState}
                      input={<OutlinedInput style={{ width: '100%' }} />}
                      onChange={(e) => {
                        setDispatchFromState(e.target.value);
                        let stateObject = stateList.find(
                          (o) => o.name === e.target.value
                        );
                        if (stateObject) {
                          setEwayDispatchFromState(parseInt(stateObject.code));
                        }
                      }}
                    >
                      {stateList.map((option, index) => (
                        <MenuItem value={option.name}>{option.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Please select State</FormHelperText>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/********* BillTo/ShipTo Grid *********/}
        <Grid container spacing={2} className={classes.gridStyle}>
          <Grid item xs={6}>
            <Grid item xs={6} style={{ marginLeft: '53px' }}>
              <Typography
                className={classes.oneShellColor}
                style={{ textTransform: 'none' }}
                variant="button"
              >
                Bill To
              </Typography>
            </Grid>
            <br />
            <Grid container className={classes.gridRow}>
              <Grid item xs={4}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={billToName}
                  onChange={(e) => {
                    setBillToName(e.target.value);
                    setEwayBillToName(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="GSTN"
                  variant="outlined"
                  fullWidth
                  required
                  InputLabelProps={{ shrink: true }}
                  value={billToGST}
                  onChange={(e) => {
                    setBillToGST(e.target.value);
                    setEwayBillToGST(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
            <br />
            <Grid container className={classes.gridRow}>
              <Grid item xs={4} style={{ marginTop: '51px' }}>
                <Select
                  displayEmpty
                  value={billToState}
                  input={<OutlinedInput style={{ width: '100%' }} />}
                  onChange={(e) => {
                    setBillToState(e.target.value);

                    let stateObject = stateList.find(
                      (o) => o.name === e.target.value
                    );
                    if (stateObject) {
                      setEwayDispatchFromState(parseInt(stateObject.code));
                    }
                  }}
                >
                  {stateList.map((option, index) => (
                    <MenuItem value={option.name}>{option.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>Please select State</FormHelperText>
              </Grid>

              <Grid item xs={4}></Grid>
            </Grid>
            <br />
          </Grid>

          <Grid item xs={6}>
            <Grid item xs={12}>
              <Typography
                className={classes.oneShellColor}
                style={{ textTransform: 'none' }}
                variant="button"
              >
                Ship To
              </Typography>
            </Grid>
            <br />
            <Grid container spacing={2} className={classes.gridRow}>
              <Grid item xs={6}>
                <Grid container spacing={2} className={classes.gridCol}>
                  <Grid item xs={12}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      label="To Address"
                      multiline
                      rows={2}
                      inputProps={{
                        style: {
                          padding: 0
                        }
                      }}
                      value={shipToAddress}
                      onChange={(e) => {
                        setShipToAddress(e.target.value);
                        setEwayShipToAddress(e.target.value);
                      }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Place"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={shipToPlace}
                      onChange={(e) => {
                        setShipToPlace(e.target.value);
                        setEwayShipToPlace(e.target.value);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container spacing={2} className={classes.gridCol}>
                  <Grid item xs={12} sm={9}>
                    <TextField
                      label="Pincode"
                      variant="outlined"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      value={shipToPincode}
                      onChange={(e) => {
                        setShipToPincode(e.target.value);
                        setEwayShipToPincode(e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={9} style={{ marginTop: '55px' }}>
                    <Select
                      displayEmpty
                      value={shipToState}
                      input={<OutlinedInput style={{ width: '100%' }} />}
                      onChange={(e) => {
                        setShipToState(e.target.value);

                        let stateObject = stateList.find(
                          (o) => o.name === e.target.value
                        );
                        if (stateObject) {
                          setEwayShipToState(parseInt(stateObject.code));
                        }
                      }}
                    >
                      {stateList.map((option, index) => (
                        <MenuItem value={option.name}>{option.name}</MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>Please select State</FormHelperText>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/********* Transportation Details *********/}
        <Grid container spacing={2} className={classes.gridStyle}>
          <Grid item xs={12}>
            <Grid item xs={12} style={{ marginLeft: '53px' }}>
              <Typography
                className={classes.oneShellColor}
                style={{ textTransform: 'none' }}
                variant="button"
              >
                Transportation Details
              </Typography>
            </Grid>
            <br />
            <Grid container className={classes.gridRow}>
              <Grid
                item
                xs={4}
                style={{
                  textAlign: 'left',
                  paddingLeft: '55px',
                  marginBottom: '15px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <TextField
                  label="Transporter Name"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={transporterName}
                  onChange={(e) => {
                    setTransporterName(e.target.value);
                    setEwayTransporterName(e.target.value);
                  }}
                  style={{ width: '60%' }}
                />
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  alignItems: 'center',
                  marginBottom: '15px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <TextField
                  label="Transport ID"
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={transportID}
                  onChange={(e) => {
                    setTransportID(e.target.value);
                    setEwayTransportID(e.target.value);
                  }}
                  style={{ width: '60%' }}
                />
              </Grid>
              <Grid
                item
                xs={4}
                style={{
                  alignItems: 'flex-end',
                  paddingRight: '40px',
                  textAlign: 'left',
                  marginBottom: '15px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <TextField
                  label="Approx Distance in KM"
                  variant="outlined"
                  fullWidth
                  required
                  value={approxDistance}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    setApproxDistance(e.target.value);
                    setEwayApproxDistance(e.target.value);
                  }}
                  style={{ width: '60%' }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/*  <Grid item xs={6}>
            <Grid item xs={6}>
              <Typography
                className={classes.oneShellColor}
                style={{ marginLeft: '15px', textTransform: 'none' }}
                variant="button"
              >
                {' '}
              </Typography>
            </Grid>
            <br />
            <Grid container className={classes.gridRow}>
              <Grid item xs={4}>
                <TextField
                  label="Approx Distance in KM"
                  variant="outlined"
                  fullWidth
                  required
                  value={approxDistance}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => {
                    setApproxDistance(e.target.value);
                    setEwayApproxDistance(e.target.value);
                  }}
                />
              </Grid>
            </Grid>
          </Grid> */}
        </Grid>

        {/********* Part B Details *********/}
        <Grid container spacing={2} className={classes.gridStyle}>
          <Grid item xs={6}>
            <Grid item xs={6} style={{ marginLeft: '53px' }}>
              <Typography
                className={classes.oneShellColor}
                style={{ textTransform: 'none' }}
                variant="button"
              >
                Part B
              </Typography>
            </Grid>
            <br />
            <Grid container className={classes.gridRow}>
              <Grid item xs={4}>
                <Select
                  displayEmpty
                  label="Transport Mode"
                  value={transportMode}
                  input={<OutlinedInput style={{ width: '100%' }} />}
                  onChange={(e) => {
                    setTransportMode(e.target.value);
                    setEwayTransportMode(e.target.value);
                  }}
                >
                  {transportModeList.map((option, index) => (
                    <MenuItem value={option.name}>{option.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>Please select Transport Mode</FormHelperText>
              </Grid>
              <Grid item xs={4}>
                <Select
                  displayEmpty
                  value={vehicleType}
                  input={<OutlinedInput style={{ width: '100%' }} />}
                  onChange={(e) => {
                    setVehicleType(e.target.value);
                    setEwayVehicleType(e.target.value);
                  }}
                >
                  {vehicleTypeList.map((option, index) => (
                    <MenuItem value={option.name}>{option.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>Please select Vehicle Type</FormHelperText>
              </Grid>
            </Grid>
            <br />
            <Grid
              container
              className={classes.gridRow}
              style={{ marginTop: '10px' }}
            >
              <Grid item xs={4}>
                <TextField
                  label="Transporter Doc No."
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={transporterDocNo}
                  onChange={(e) => {
                    setTransporterDocNo(e.target.value);
                    setEwayTransporterDocNo(e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  type="date"
                  label="Transporter Doc Date"
                  id="date-picker-inline"
                  InputLabelProps={{ shrink: true }}
                  value={transporterDocDate}
                  onChange={(event) =>
                    handleTransporterDocDateChange(event.target.value)
                  }
                  style={{ color: '#000000', fontSize: 'small' }}
                />
              </Grid>
            </Grid>
            <br />
          </Grid>

          <Grid item xs={6}>
            <Grid item xs={12}>
              <Typography
                className={classes.oneShellColor}
                style={{ marginLeft: '10px', textTransform: 'none' }}
                variant="button"
              >
                {' '}
              </Typography>
            </Grid>
            <br />
            <Grid container spacing={2} className={classes.gridRow}>
              <Grid item xs={4}>
                <TextField
                  label="Vehicle No."
                  variant="outlined"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={vehicleNo}
                  onChange={(e) => {
                    setVehicleNo(e.target.value);
                    setEwayVehicleNo(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6}></Grid>
            </Grid>
          </Grid>
        </Grid>

        {/********* Product Details *********/}
        <Grid container spacing={2} className={classes.gridStyle}>
          <Grid item xs={12}>
            <Grid item xs={6} style={{ marginLeft: '53px' }}>
              <Typography
                className={classes.oneShellColor}
                style={{ textTransform: 'none' }}
                variant="button"
              >
                Product Details
              </Typography>
            </Grid>
            <br />

            <div
              style={{
                height: '250px',
                textAlign: '-webkit-center',
                marginLeft: '20px'
              }}
            >
              <div
                id="product-list-grid"
                style={{
                  height: '100%',
                  width: '95%',
                  textAlign: 'left',
                  overflowX: 'auto'
                }}
                className="ag-theme-material"
              >
                <AgGridReact
                  rowData={invoiceDetails.item_list}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                />
                <div
                  style={{
                    display: 'flex',
                    float: 'right',
                    marginTop: '5px',
                    marginBottom: '5px'
                  }}
                >
                  <img
                    alt="Logo"
                    src={first_page_arrow}
                    width="20px"
                    height="20px"
                    style={{ marginRight: '10px' }}
                    /* onClick={() => onFirstPageClicked()} */
                  />
                  <img
                    alt="Logo"
                    src={right_arrow}
                    width="20px"
                    height="20px"
                    /* onClick={() => onPreviousPageClicked()} */
                  />
                  <p
                    style={{
                      marginLeft: '10px',
                      marginRight: '10px',
                      marginTop: '2px'
                    }}
                  >
                    Page {/* {currentPage} of {totalPages} */}
                  </p>
                  <img
                    alt="Logo"
                    src={left_arrow}
                    width="20px"
                    height="20px"
                    style={{ marginRight: '10px' }}
                    /* onClick={() => onNextPageClicked()} */
                  />
                  <img
                    alt="Logo"
                    src={last_page_arrow}
                    width="20px"
                    height="20px"
                    /* onClick={() => onLastPageClicked()} */
                  />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>

        {/********* Generate Button *********/}

        <Grid
          container
          className={classes.gridStyleNoBorder}
          style={{
            position: 'sticky',
            bottom: '0px',
            width: '100%',
            zIndex: '5'
          }}
        >
          <Grid item xs={12}>
            <div style={{ display: 'flex' }}>
              <Button
                variant="contained"
                style={{
                  margin: '20px',
                  color: '#ffffff',
                  backgroundColor: '#EF5350'
                }}
                onClick={() => saveGenerateEWay(false)}
              >
                Generate
              </Button>

              <Button
                variant="contained"
                style={{
                  margin: '20px',
                  color: '#ffffff',
                  backgroundColor: '#EF5350'
                }}
                onClick={() => saveGenerateEWay(true)}
              >
                Generate and Print
              </Button>
            </div>
          </Grid>
        </Grid>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openLoadingAlertMessage}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the E-Way bill is being generated</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openGenErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{genErrorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openGenErrorAlertMessage}
        onClose={handleErrorAlertMessageClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{genErrorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleErrorAlertMessageClose}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default injectWithObserver(EwayGenerate);
