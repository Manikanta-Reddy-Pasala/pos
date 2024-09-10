import React, { useState, useRef, useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  FormControlLabel,
  Radio,
  Button,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  TextField,
  Typography,
  Checkbox,
  Select,
  MenuItem,
  Tabs,
  Tab,
  AppBar,
  Collapse,
  OutlinedInput,
  InputAdornment
} from '@material-ui/core';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import RadioGroup from '@material-ui/core/RadioGroup';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import CheckCustomer from './CheckCustomer';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import DialogContentText from '@material-ui/core/DialogContentText';
import getStateList from '../../../components/StateList';
import { concat } from 'lodash';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import Loader from 'react-js-loader';
import * as countryHelper from 'src/components/Utility/CountriesUtility';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  marginSet: {
    marginTop: 'auto'
  },
  datecol: {
    width: '90%',
    marginLeft: '14px'
  },
  stateListBox: {
    margin: 0,
    padding: 5,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    marginTop: '78px',
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
    marginTop: '78px',
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
  titleUnderline: {
    textDecoration: 'underline',
    // textUnderlinePosition : 'under',
    marginBottom: 15,
    color: '#4A83FB'
  },
  itemTable: {
    width: '100%'
  },
  formWrapper: {
    marginBottom: 35,
    '& .total-wrapper-form': {
      '&.total-payment': {
        '& input': {
          fontSize: 22,
          fontWeight: 500,
          height: 40
        }
      },
      '&.balance-payment': {
        '& input': {
          color: '#f44336'
        }
      },
      '& input': {
        padding: '6px 10px',
        textAlign: 'right'
      }
    }
  }
}));

const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '24px'
    },
    '& .closeButton': {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.success[500]
    }
  }
}))(MuiDialogTitle);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const customStyles = {
  control: (base) => ({
    ...base,
    height: 30,
    minHeight: 30
  })
};

const VendorModal = (props) => {
  const classes = useStyles();
  const { fullWidth, maxWidth } = props;

  const store = useStore();
  const {
    vendor,
    vendorDialogOpen,
    isEdit,
    disableBalanceEdit,
    copyShippingAddress,
    additionalBillingAddressCollapsibleMap,
    additionalShippingAddressCollapsibleMap,
    copyShippingAddressMap,
    proceedToSaveVendorBySamePhNo
  } = toJS(store.VendorStore);

  const {
    setTCS,
    revertTCS,
    setTDS,
    revertTDS,
    addAdditionalAddress,
    removeAdditionalAddress,
    setAdditionalAddress,
    setAdditionalBillingAddressCollapsibleIndex,
    setAdditionalShippingAddressCollapsibleIndex,
    setCopyShippingAddressMap,
    addAdditionalAddressFromGSTFetch,
    findCustomerOrVendorWithSameGSTNo,
    findVendorByPhoneNumber
  } = store.VendorStore;

  const [openBothVendorAndCustomer, setBothVendorAndCustomer] = useState(false);
  const [openOnlyCustomer, setOnlyCustomer] = useState(false);
  const [openOnlyVendor, setOnlyVendor] = useState(false);
  const [stateList, setStateList] = useState(getStateList());
  const [tcsList, setTcsList] = React.useState([]);
  const { getTCS, getTCSDataByName } = store.TCSStore;
  const [tdsList, setTdsList] = React.useState([]);
  const { getTDS, getTDSDataByName } = store.TDSStore;
  const [openInvalidGSTNo, setOpenInvalidGSTNo] = useState(false);
  const [openInvalidGSTNoMessage, setOpenInvalidGSTNoMessage] = useState('');

  const [Tabvalue, setTabValue] = React.useState(0);
  const [openGSTFetchLoader, setOpenGSTFetchLoader] = React.useState(false);

  const [gstNumberAlreadyExists, setGstNumberAlreadyExists] =
    React.useState(false);

  const [openErrorDialog, setErrorDialog] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(false);

  const [phoneNumberAlreadyExists, setPhoneNumberAlreadyExists] =
    React.useState(false);

  const [isGSTNumberValidated, setIsGstNumberValidated] = React.useState(false);

  const handleCloseErrorDialog = () => {
    setErrorMessage('');
    setErrorDialog(false);
  };

  const handleCloseGstNumberAlreadyExistsModel = () => {
    setGstNumberAlreadyExists(false);
  };

  const handleClosePhoneNumberAlreadyExistsModel = () => {
    setPhoneNumberAlreadyExists(false);
  };

  const handleOpenInvalidGSTNoCloseModel = () => {
    setOpenInvalidGSTNoMessage('');
    setOpenInvalidGSTNo(false);
  };

  const handleOnlyCustomerCloseModel = () => {
    setOnlyCustomer(false);
  };

  const saveOnlyVendorCloseModel = () => {
    setOnlyCustomer(false);
    saveData(false);
  };

  const handleBothVendorAndCustomerCloseModel = () => {
    setBothVendorAndCustomer(false);
  };

  const handleOnlyVendorCloseModel = () => {
    setOnlyVendor(false);
  };

  useEffect(() => {
    async function fetchData() {
      setTcsList([]);
      let tcsListData = await getTCS();
      for (let tcs of tcsListData) {
        tcsList.push(tcs.name);
      }
      setTcsList(tcsList);
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchData() {
      setTdsList([]);
      let tdsListData = await getTDS();
      for (let tds of tdsListData) {
        tdsList.push(tds.name);
      }
      setTdsList(tdsList);
    }

    fetchData();
  }, []);

  const saveDataOnClick = async () => {
    if (
      !isEdit &&
      vendor.gstNumber !== '' &&
      vendor.gstNumber !== null &&
      vendor.gstNumber !== undefined
    ) {
      let isGstExists = await findCustomerOrVendorWithSameGSTNo(
        vendor.gstNumber
      );

      if (isGstExists) {
        setGstNumberAlreadyExists(true);
        return;
      }
    }

    if (
      vendor.gstNumber !== '' &&
      vendor.gstNumber !== null &&
      vendor.gstNumber !== undefined &&
      vendor.gstType === 'Unregistered Vendor'
    ) {
      setErrorMessage(
        'Vendor with GST Number cannot have GST Type as Unregistered Vendor'
      );
      setErrorDialog(true);
      return;
    }

    if (
      vendor.gstNumber !== '' &&
      vendor.gstNumber !== null &&
      vendor.gstNumber !== undefined &&
      vendor.gstNumber.length !== 15
    ) {
      setErrorMessage(
        'A GSTIN number is a 15-digit code. Please revalidate the provided data'
      );
      setErrorDialog(true);
      return;
    }

    if (
      vendor.gstNumber !== '' &&
      vendor.gstNumber !== null &&
      vendor.gstNumber !== undefined &&
      !isGSTNumberValidated
    ) {
      let isValid = await checkGSTValid();
      if (isValid === false) {
        setErrorMessage(
          'We are unable to validate the provided GSTN number. Please try in sometime'
        );
        setErrorDialog(true);
        return;
      }
    }

    if (
      (vendor.address !== '' || vendor.pincode !== '' || vendor.city !== '') &&
      vendor.state === ''
    ) {
      if (vendor.country === 'India') {
        // To change India harcoding in future
        setErrorMessage('Please choose State for Vendor');
        setErrorDialog(true);
        return;
      }
    }

    if (isBothCustomerAndVendor) {
      setBothVendorAndCustomer(true);
    } else if (isAlreadyCustomer) {
      setOnlyCustomer(true);
    } else if (isAlreadyVendor) {
      setOnlyVendor(true);
    } else if (
      typeof vendor.name === 'string' &&
      vendor.name.trim().length === 0
    ) {
      setErrorMessage('Vendor Name cannot be left blank');
      setErrorDialog(true);
    } else if (vendor.creditLimit < 0) {
      setErrorMessage('Credit Limit cannot be negative value');
      setErrorDialog(true);
    } else {
      let isVendorWithSamePhNoFound = await findVendorByPhoneNumber(
        vendor.phoneNo,
        vendor.id
      );
      if (isVendorWithSamePhNoFound) {
        setPhoneNumberAlreadyExists(true);
        return;
      }

      resetCustomerVendorStates();
      saveData(false);
    }
  };

  const saveDataAndNewOnClick = async () => {
    if (
      !isEdit &&
      vendor.gstNumber !== '' &&
      vendor.gstNumber !== null &&
      vendor.gstNumber !== undefined
    ) {
      let isGstExists = await findCustomerOrVendorWithSameGSTNo(
        vendor.gstNumber
      );

      if (isGstExists) {
        setGstNumberAlreadyExists(true);
        return;
      }
    }

    if (
      vendor.gstNumber !== '' &&
      vendor.gstNumber !== null &&
      vendor.gstNumber !== undefined &&
      vendor.gstType === 'Unregistered Vendor'
    ) {
      setErrorMessage(
        'Vendor with GST Number cannot have GST Type as Unregistered Vendor'
      );
      setErrorDialog(true);
      return;
    }

    if (
      vendor.gstNumber !== '' &&
      vendor.gstNumber !== null &&
      vendor.gstNumber !== undefined &&
      vendor.gstNumber.length !== 15
    ) {
      setErrorMessage(
        'A GSTIN number is a 15-digit code. Please revalidate the provided data'
      );
      setErrorDialog(true);
      return;
    }

    if (
      vendor.gstNumber !== '' &&
      vendor.gstNumber !== null &&
      vendor.gstNumber !== undefined &&
      !isGSTNumberValidated
    ) {
      let isValid = await checkGSTValid();
      if (isValid === false) {
        setErrorMessage(
          'We are unable to validate the provided GSTN number. Please try in sometime'
        );
        setErrorDialog(true);
        return;
      }
    }

    if (
      (vendor.address !== '' || vendor.pincode !== '' || vendor.city !== '') &&
      vendor.state === ''
    ) {
      if (vendor.country === 'India') {
        // To change India harcoding in future
        setErrorMessage('Please choose State for Vendor');
        setErrorDialog(true);
        return;
      }
    }

    if (isBothCustomerAndVendor) {
      setBothVendorAndCustomer(true);
    } else if (isAlreadyCustomer) {
      setOnlyCustomer(true);
    } else if (isAlreadyVendor) {
      setOnlyVendor(true);
    } else if (
      typeof vendor.name === 'string' &&
      vendor.name.trim().length === 0
    ) {
      setErrorMessage('Vendor Name cannot be left blank');
      setErrorDialog(true);
    } else if (vendor.creditLimit < 0) {
      setErrorMessage('Credit Limit cannot be negative value');
      setErrorDialog(true);
    } else {
      let isVendorWithSamePhNoFound = await findVendorByPhoneNumber(
        vendor.phoneNo,
        vendor.id
      );
      if (isVendorWithSamePhNoFound) {
        setPhoneNumberAlreadyExists(true);
        return;
      }

      resetCustomerVendorStates();
      saveData(true);
    }
  };

  const checkGSTValid = async () => {
    const API_SERVER = window.REACT_APP_API_SERVER;
    let isValid = false;
    await axios
      .get(`${API_SERVER}/pos/v1/gstIn/get`, {
        params: {
          gstNumber: vendor.gstNumber
        }
      })
      .then((res) => {
        if (res) {
          if (res.data && res.data.valid === true) {
            isValid = true;
          } else {
          }
        } else {
        }
      })
      .catch((err) => {});

    return isValid;
  };

  const proceedToSaveVendorBySamePhoneNumber = async () => {
    setPhoneNumberAlreadyExists(false);
    resetCustomerVendorStates();
    saveData(false);
  };

  const {
    saveData,
    setVendorProperty,
    handleVendorModalClose,
    isBothCustomerAndVendor,
    isAlreadyCustomer,
    isAlreadyVendor,
    resetCustomerVendorStates,
    setCopyBusiness,
    resetVendorToDefaultState
  } = store.VendorStore;

  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);
  const [menuOpenStatus, setMenuOpenStatus] = React.useState(false);
  const [place_of_supply, setPlaceOfSupplyValue] = React.useState('');
  const [stateMenuOpen, setStateMenuOpen] = React.useState(false);
  const [selectedState, setSelectedState] = React.useState('');
  const [shipStateMenuOpen, setShipStateMenuOpen] = React.useState(false);
  const [selectedShipState, setSelectedShipState] = React.useState('');

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };
  const checkCloseDialog = () => {
    if (
      isEdit ||
      (vendor.name === '' &&
        vendor.phoneNo === '' &&
        vendor.balance === '' &&
        vendor.balanceType === '' &&
        vendor.gstNumber === '' &&
        vendor.isCustomer === false &&
        vendor.address === '' &&
        vendor.pincode === '' &&
        vendor.city === '' &&
        vendor.emailId === '')
    ) {
      handleVendorModalClose();
    } else {
      setCloseDialogAlert(true);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`
    };
  }

  const GSTTypeList = [
    'Registered Vendor',
    'Oveseas Vendor',
    'SEZ Vendor',
    'Deemed Export Vendor',
    'Unregistered Vendor',
    'Composition Reg Vendor'
  ];

  const checkGstNumberAvail = () => {
    let res = true;
    if (
      vendor.gstType === 'Registered Vendor' ||
      vendor.gstType === 'Composition Reg Vendor'
    ) {
      if (!vendor.gstNumber) {
        res = false;
      }
    }
    return res;
  };

  const inputRef = useRef([]);

  const handleKeyDown = (e, TopIndex, RightIndex, BottomIndex, LeftIndex) => {
    let next = '';

    if (e.keyCode === 37) {
      next = inputRef.current[LeftIndex];
    }
    if (e.keyCode === 38) {
      next = inputRef.current[TopIndex];
    }
    if (e.keyCode === 39) {
      next = inputRef.current[RightIndex];
    }
    if (e.keyCode === 40) {
      next = inputRef.current[BottomIndex];
    }

    if (next) {
      setTimeout(() => {
        next.focus();
      }, 50);
    }
  };

  const fetchGSTDetails = async () => {
    const API_SERVER = window.REACT_APP_API_SERVER;

    setOpenGSTFetchLoader(true);
    await axios
      .get(`${API_SERVER}/pos/v1/gstIn/get`, {
        params: {
          gstNumber: vendor.gstNumber
        }
      })
      .then((res) => {
        if (res) {
          if (res.data && res.data.valid === true) {
            let responseData = res.data;
            setIsGstNumberValidated(true);
            if (responseData.company_details) {
              if (
                responseData.company_details.company_status !== null &&
                (responseData.company_details.company_status === 'Cancelled' ||
                  responseData.company_details.company_status === 'Suspended')
              ) {
                // do nothing
              } else {
                setVendorProperty(
                  'legalName',
                  responseData.company_details.legal_name
                );
                setVendorProperty(
                  'tradeName',
                  responseData.company_details.trade_name
                );
                setVendorProperty(
                  'name',
                  responseData.company_details.trade_name
                );

                if (
                  responseData.company_details.gst_type &&
                  responseData.company_details.gst_type !== ''
                ) {
                  if (responseData.company_details.gst_type === 'Regular') {
                    setVendorProperty('gstType', 'Registered Vendor');
                  } else if (
                    responseData.company_details.gst_type === 'Composition'
                  ) {
                    setVendorProperty('gstType', 'Composition Reg Vendor');
                  } else if (
                    responseData.company_details.gst_type === 'Overseas'
                  ) {
                    setVendorProperty('gstType', 'Oveseas Vendor');
                  }
                }
              }

              setVendorProperty(
                'companyStatus',
                responseData.company_details.company_status
              );
              setVendorProperty('panNumber', responseData.company_details.pan);

              if (
                responseData.company_details.pradr &&
                responseData.company_details.pradr.pincode &&
                responseData.company_details.pradr.pincode !== ''
              ) {
                setVendorProperty(
                  'pincode',
                  responseData.company_details.pradr.pincode
                );
                setVendorProperty(
                  'shippingPincode',
                  responseData.company_details.pradr.pincode
                );
              }

              if (
                responseData.company_details.pradr &&
                responseData.company_details.pradr.city &&
                responseData.company_details.pradr.city !== ''
              ) {
                setVendorProperty(
                  'city',
                  responseData.company_details.pradr.city
                );
                setVendorProperty(
                  'shippingCity',
                  responseData.company_details.pradr.city
                );
              }

              if (
                responseData.company_details.state &&
                responseData.company_details.state !== ''
              ) {
                let extractedStateCode =
                  responseData.company_details.state.slice(0, 2);
                let result = stateList.find(
                  (e) => e.code === extractedStateCode
                );
                if (result) {
                  setVendorProperty('place_of_supply', result.name);
                  setVendorProperty('state', result.name);
                  setPlaceOfSupplyValue(result.name);
                  setVendorProperty('country', 'India');

                  setVendorProperty('shippingState', result.name);
                  setVendorProperty('shippingCountry', 'India');
                  setSelectedShipState(result.name);
                }
              }

              if (
                responseData.company_details.pradr &&
                responseData.company_details.pradr.addr &&
                responseData.company_details.pradr.addr !== ''
              ) {
                setVendorProperty(
                  'address',
                  responseData.company_details.pradr.addr
                );
                setVendorProperty(
                  'shippingAddress',
                  responseData.company_details.pradr.addr
                );
              }

              if (
                responseData.company_details.adadr &&
                responseData.company_details.adadr.length > 0
              ) {
                for (let address of responseData.company_details.adadr) {
                  let newAddress = {
                    id: '',
                    tradeName: '',
                    placeOfSupply: '',
                    billingAddress: '',
                    billingPincode: '',
                    billingCity: '',
                    billingState: '',
                    billingCountry: '',
                    shippingAddress: '',
                    shippingPincode: '',
                    shippingCity: '',
                    shippingState: '',
                    shippingCountry: ''
                  };

                  newAddress.billingAddress = address.addr;
                  newAddress.billingPincode = address.pincode;
                  newAddress.billingCity = address.city;

                  newAddress.shippingAddress = address.addr;
                  newAddress.shippingPincode = address.pincode;
                  newAddress.shippingCity = address.city;

                  newAddress.tradeName =
                    responseData.company_details.trade_name;
                  newAddress.billingCountry = 'India';
                  newAddress.billingState = address.state;

                  newAddress.shippingCountry = 'India';
                  newAddress.shippingState = address.state;

                  addAdditionalAddressFromGSTFetch(newAddress);
                }
              }
            }
            setOpenGSTFetchLoader(false);
            if (
              responseData.company_details.company_status !== null &&
              (responseData.company_details.company_status === 'Cancelled' ||
                responseData.company_details.company_status === 'Suspended')
            ) {
              setOpenGSTFetchLoader(false);
              setOpenInvalidGSTNoMessage(
                'Provided GST number:' +
                  vendor.gstNumber +
                  ' is ' +
                  responseData.company_details.company_status
              );
              setOpenInvalidGSTNo(true);
              setVendorProperty('gstNumber', '');
            }
          } else {
            setOpenGSTFetchLoader(false);
            setOpenInvalidGSTNoMessage(
              'We are unable to fetch Vendor details as the provided GST number is not valid. Please re-verify and provide a valid GSTN.'
            );
            setOpenInvalidGSTNo(true);
          }
        } else {
          setOpenGSTFetchLoader(false);
          setOpenInvalidGSTNoMessage(
            'Something went wrong while fetching details. Please try again!'
          );
          setOpenInvalidGSTNo(true);
        }
      })
      .catch((err) => {
        setOpenGSTFetchLoader(false);
      });
  };

  return (
    <div>
      <Dialog
        open={vendorDialogOpen}
        onClose={checkCloseDialog}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
      >
        <DialogTitle id="product-modal-title">
          {isEdit ? 'Edit Vendor' : 'Add Vendor'}
          <IconButton
            aria-label="close"
            onClick={checkCloseDialog}
            className="closeButton"
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <div className={classes.itemTable} style={{ marginTop: '10px' }}>
            <AppBar position="static">
              <Tabs value={Tabvalue} aria-label="" onChange={handleTabChange}>
                <Tab label="Basic" {...a11yProps(0)} />
                <Tab label="Address" {...a11yProps(1)} />
                <Tab label="Other" {...a11yProps(1)} />
              </Tabs>
            </AppBar>

            {Tabvalue === 0 && (
              <Grid container direction="row" alignItems="stretch">
                <Grid
                  item
                  md={12}
                  sm={12}
                  className="grid-padding"
                  style={{ marginTop: '16px' }}
                >
                  <Typography variant="h5" className={classes.titleUnderline}>
                    Basic Details
                  </Typography>
                </Grid>

                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">Vendor *</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="text"
                      className="customTextField"
                      placeholder="Enter Vendor Name"
                      value={vendor.name}
                      onChange={(event) =>
                        setVendorProperty('name', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">Phone No *</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      className="customTextField"
                      placeholder="Enter Phone Number"
                      error={
                        vendor.country === 'India' && vendor.phoneNo.length > 10
                      }
                      helperText={
                        vendor.country === 'India' && vendor.phoneNo.length > 10
                          ? 'Please enter valid phone number'
                          : ''
                      }
                      value={vendor.phoneNo}
                      onKeyPress={(event) => {
                        if (
                          event?.key === '-' ||
                          event?.key === '+' ||
                          event?.key === 'e'
                        ) {
                          event.preventDefault();
                        }
                      }}
                      onChange={(event) => {
                        setVendorProperty('phoneNo', event.target.value);
                      }}
                    />
                  </FormControl>
                  <CheckCustomer maxWidth="xs" />
                </Grid>

                <Grid
                  item
                  md={12}
                  sm={12}
                  className="grid-padding"
                  style={{ marginTop: '16px' }}
                >
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">GST Number</Typography>
                    <div style={{ display: 'flex' }}>
                      <TextField
                        style={{
                          width: '58%',
                          height: '40px',
                          marginRight: 15
                        }}
                        variant="outlined"
                        margin="dense"
                        placeholder="Enter GST Number"
                        type="text"
                        disabled={isGSTNumberValidated ? true : false}
                        className="customTextField"
                        value={vendor.gstNumber}
                        onChange={(event) => {
                          let gstData = event.target.value.toUpperCase();
                          setVendorProperty('gstNumber', gstData);
                        }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        className="customTextField"
                        style={{
                          color: 'white',
                          marginRight: 15,
                          height: '40px',
                          marginTop: '8px'
                        }}
                        onClick={(event) => {
                          if (vendor.gstNumber !== '') {
                            fetchGSTDetails();
                          } else {
                            setErrorMessage(
                              'Please provide GST number to fetch details'
                            );
                            setErrorDialog(true);
                          }
                        }}
                      >
                        Fetch GST
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        className="customTextField"
                        style={{
                          color: 'white',
                          height: '40px',
                          marginTop: '8px'
                        }}
                        onClick={(event) => {
                          setIsGstNumberValidated(false);
                          resetVendorToDefaultState(vendor.phoneNo);
                        }}
                      >
                        Reset
                      </Button>
                    </div>
                  </FormControl>
                </Grid>

                {String(localStorage.getItem('isTemple')).toLowerCase() ===
                'true' ? (
                  <Grid
                    item
                    md={6}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">
                        Registration Number
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        className="customTextField"
                        placeholder="Enter Registration Number"
                        value={vendor.registrationNumber}
                        onChange={(event) =>
                          setVendorProperty(
                            'registrationNumber',
                            event.target.value
                          )
                        }
                      />
                    </FormControl>
                  </Grid>
                ) : (
                  <Grid
                    item
                    md={6}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">
                        MSME Registration Number
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        className="customTextField"
                        placeholder="Enter MSME Registration Number"
                        value={vendor.msmeRegNo}
                        onChange={(event) =>
                          setVendorProperty('msmeRegNo', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>
                )}

                <Grid
                  item
                  md={6}
                  sm={12}
                  className="grid-padding"
                  style={{ marginTop: '16px' }}
                >
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">PAN Number</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="text"
                      className="customTextField"
                      placeholder="Enter PAN Number"
                      value={vendor.panNumber}
                      onChange={(event) => {
                        setVendorProperty('panNumber', event.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={12}
                  className="grid-padding"
                  style={{ marginTop: '16px' }}
                >
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">AADHAR Number</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="text"
                      className="customTextField"
                      placeholder="Enter AADHAR Number"
                      value={vendor.aadharNumber}
                      onChange={(event) => {
                        setVendorProperty('aadharNumber', event.target.value);
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={12}
                  className="grid-padding"
                  style={{ marginTop: '16px' }}
                >
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">Email</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="text"
                      placeholder="Enter Email"
                      className="customTextField"
                      value={vendor.emailId}
                      onChange={(event) =>
                        setVendorProperty('emailId', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography
                    variant="h5"
                    className={classes.titleUnderline}
                    style={{ marginTop: '25px' }}
                  >
                    GST Details
                  </Typography>
                </Grid>

                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">GST Type</Typography>
                    <Select
                      value={vendor.gstType}
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      style={{ marginTop: '8px', marginBottom: '4px' }}
                      className="customTextField"
                      onChange={(event) =>
                        setVendorProperty('gstType', event.target.value)
                      }
                    >
                      <MenuItem value={' '}>Choose GST Type</MenuItem>
                      {GSTTypeList.map((e) => (
                        <MenuItem value={e}>{e}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">Legal Name</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="text"
                      className="customTextField"
                      placeholder="Enter Legal Name"
                      value={vendor.legalName}
                      onChange={(event) =>
                        setVendorProperty('legalName', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            )}
            {Tabvalue === 1 && (
              <Grid container>
                <Grid container direction="row" alignItems="stretch">
                  <Grid
                    item
                    md={12}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <Typography variant="h5" className={classes.titleUnderline}>
                      Primary Address Details
                    </Typography>
                  </Grid>

                  <Grid item md={6} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">Trade Name</Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        className="customTextField"
                        placeholder="Enter Trade Name"
                        value={vendor.tradeName}
                        onChange={(event) => {
                          setVendorProperty('tradeName', event.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={12} className="grid-padding">
                    {/*  <FormControl fullWidth>
                      <Typography variant="subtitle1">
                        Place of Supply
                      </Typography>
                      <TextField
                        variant={'outlined'}
                        value={place_of_supply}
                        placeholder="Choose Place of Supply"
                        margin="dense"
                        onClick={(e) =>
                          menuOpenStatus
                            ? setMenuOpenStatus(false)
                            : setMenuOpenStatus(true)
                        }
                        onChange={(e) => {
                          setPlaceOfSupplyValue(e.target.value);
                          setVendorProperty('place_of_supply', e.target.value);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setMenuOpenStatus(false);
                          }
                          if (e.key === 'Enter') {
                            setMenuOpenStatus(true);
                          } else {
                            if (!menuOpenStatus) {
                              handleKeyDown(e, 7, 80, 80, 6);
                            } else {
                              handleKeyDown(e, 0, 0, 400, 0);
                            }
                          }
                        }}
                      ></TextField>
                      {menuOpenStatus ? (
                        <>
                          <ul className={classes.PlaceOfsupplyListbox}>
                            <div>
                              {stateList
                                .filter((data) => {
                                  if (place_of_supply === '') {
                                    return data;
                                  } else if (
                                    data && data.name
                                      ? data.name
                                          .toLowerCase()
                                          .includes(
                                            place_of_supply.toLocaleLowerCase()
                                          )
                                      : ''
                                  ) {
                                    return data;
                                  }
                                })
                                .map((option, index) => (
                                  <li
                                    style={{ cursor: 'pointer' }}
                                    key={`${index}customer`}
                                  >
                                    <Button
                                      className={classes.liBtn}
                                      disableRipple
                                      onClick={(e) => {
                                        setPlaceOfSupplyValue(option.name);
                                        setVendorProperty(
                                          'place_of_supply',
                                          option.name
                                        );
                                        setMenuOpenStatus(false);
                                      }}
                                      buttonRef={(el) =>
                                        (inputRef.current[
                                          Number('4' + index + '0')
                                        ] = el)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          setMenuOpenStatus(false);
                                        }
                                        handleKeyDown(
                                          e,
                                          Number('4' + (index - 1) + '0'),
                                          0,
                                          Number('4' + (index + 1) + '0'),
                                          0
                                        );
                                        if (e.key === 'Enter') {
                                          setPlaceOfSupplyValue(option.name);
                                          setMenuOpenStatus(false);
                                          setVendorProperty(
                                            'place_of_supply',
                                            option.name
                                          );
                                        }
                                      }}
                                    >
                                      {option.name}
                                    </Button>
                                  </li>
                                ))}
                            </div>
                          </ul>
                        </>
                      ) : null}
                    </FormControl> */}
                  </Grid>

                  <Grid
                    item
                    md={12}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <Typography variant="h5" className={classes.titleUnderline}>
                      Billing Details
                    </Typography>
                  </Grid>

                  <Grid item md={12} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">Address</Typography>
                      <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        margin="dense"
                        type="text"
                        rows="2"
                        className="customTextField"
                        placeholder="Address"
                        value={vendor.address}
                        onChange={(event) =>
                          setVendorProperty('address', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={6} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">Pincode</Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        placeholder="Enter Pincode"
                        className="customTextField"
                        value={vendor.pincode}
                        onChange={(event) =>
                          setVendorProperty('pincode', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">City</Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        placeholder="Enter City"
                        className="customTextField"
                        value={vendor.city}
                        onChange={(event) =>
                          setVendorProperty('city', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    md={6}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">State</Typography>
                      <Select
                        value={
                          vendor.state !== '' ? vendor.state : 'Select State'
                        }
                        disabled={vendor.country === 'India' ? false : true}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        style={{ marginTop: '8px', marginBottom: '4px' }}
                        className="customTextField"
                        onChange={(e) => {
                          setSelectedState(e.target.value);
                          setVendorProperty('state', e.target.value);
                          setPlaceOfSupplyValue(e.target.value);
                          setVendorProperty('place_of_supply', e.target.value);
                        }}
                      >
                        <MenuItem value={''}>Choose State</MenuItem>
                        {stateList.map((option, index) => (
                          <MenuItem key={index} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">Country</Typography>
                      <Select
                        value={vendor.country}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        style={{ marginTop: '8px', marginBottom: '4px' }}
                        className="customTextField"
                        onChange={(e) => {
                          setVendorProperty('country', e.target.value);
                        }}
                      >
                        {countryHelper
                          .getCountriesList()
                          .map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    md={12}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <Typography variant="h5" className={classes.titleUnderline}>
                      Shipping Details
                    </Typography>
                  </Grid>

                  <Grid item md={12} sm={12} className="grid-padding">
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
                        value={copyShippingAddress}
                        onChange={(event) => {
                          setCopyBusiness(event.target.checked);
                          if (event.target.checked) {
                            setVendorProperty(
                              'shippingAddress',
                              vendor.address
                            );
                            setVendorProperty(
                              'shippingPincode',
                              vendor.pincode
                            );
                            setVendorProperty('shippingCity', vendor.city);
                            setVendorProperty('shippingState', vendor.state);
                            setVendorProperty(
                              'shippingCountry',
                              vendor.country
                            );
                            setSelectedShipState(vendor.state);
                          } else {
                            setVendorProperty('shippingAddress', '');
                            setVendorProperty('shippingPincode', '');
                            setVendorProperty('shippingCity', '');
                            setVendorProperty('shippingState', '');
                            setVendorProperty('shippingCountry', '');
                          }
                        }}
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={12} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">Address</Typography>
                      <TextField
                        fullWidth
                        multiline
                        variant="outlined"
                        margin="dense"
                        type="text"
                        rows="2"
                        className="customTextField"
                        placeholder="Shipping Address"
                        value={vendor.shippingAddress}
                        onChange={(event) =>
                          setVendorProperty(
                            'shippingAddress',
                            event.target.value
                          )
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    md={6}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">Pincode</Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        placeholder="Enter Shipping Pincode"
                        className="customTextField"
                        value={vendor.shippingPincode}
                        onChange={(event) =>
                          setVendorProperty(
                            'shippingPincode',
                            event.target.value
                          )
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">City</Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        placeholder="Enter Shipping City"
                        className="customTextField"
                        value={vendor.shippingCity}
                        onChange={(event) =>
                          setVendorProperty('shippingCity', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid
                    item
                    md={6}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">State</Typography>
                      <Select
                        value={
                          vendor.shippingState !== ''
                            ? vendor.shippingState
                            : 'Select State'
                        }
                        disabled={
                          vendor.shippingCountry === 'India' ? false : true
                        }
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        style={{ marginTop: '8px', marginBottom: '4px' }}
                        className="customTextField"
                        onChange={(e) => {
                          setSelectedShipState(e.target.value);
                          setVendorProperty('shippingState', e.target.value);
                        }}
                      >
                        <MenuItem value={''}>Choose State</MenuItem>
                        {stateList.map((option, index) => (
                          <MenuItem key={index} value={option.name}>
                            {option.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <FormControl fullWidth>
                      <Typography variant="subtitle1">Country</Typography>
                      <Select
                        value={vendor.shippingCountry}
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        style={{ marginTop: '8px', marginBottom: '4px' }}
                        className="customTextField"
                        onChange={(e) => {
                          setVendorProperty('shippingCountry', e.target.value);
                        }}
                      >
                        {countryHelper
                          .getCountriesList()
                          .map((option, index) => (
                            <MenuItem key={index} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid container direction="row" alignItems="stretch">
                  <Grid
                    item
                    md={12}
                    sm={12}
                    className="grid-padding"
                    style={{ marginTop: '16px' }}
                  >
                    <Typography variant="h5" className={classes.titleUnderline}>
                      Additional Address Details
                    </Typography>
                  </Grid>

                  <Grid item md={6} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Button
                        variant="contained"
                        color="primary"
                        className="customTextField"
                        style={{
                          color: 'white',
                          marginRight: 15,
                          height: '40px',
                          marginTop: '8px'
                        }}
                        onClick={(e) => {
                          addAdditionalAddress();
                        }}
                      >
                        Add Additional Address
                      </Button>
                    </FormControl>
                  </Grid>

                  {vendor.additionalAddressList &&
                    vendor.additionalAddressList.length > 0 &&
                    vendor.additionalAddressList.map((prodEle, index) => (
                      <div
                        style={{
                          border: '1px solid #abaaaa',
                          padding: '10px',
                          marginTop: '10px'
                        }}
                      >
                        <IconButton
                          aria-label="close"
                          style={{ float: 'right' }}
                          onClick={(e) => {
                            removeAdditionalAddress(index);
                          }}
                        >
                          <CancelRoundedIcon />
                        </IconButton>
                        <Grid container direction="row" alignItems="stretch">
                          <Grid item md={6} sm={12} className="grid-padding">
                            <FormControl fullWidth>
                              <Typography variant="subtitle1">
                                Trade Name
                              </Typography>
                              <TextField
                                fullWidth
                                variant="outlined"
                                margin="dense"
                                type="text"
                                className="customTextField"
                                placeholder="Enter Trade Name"
                                value={prodEle.tradeName}
                                onChange={(event) => {
                                  setAdditionalAddress(
                                    'tradeName',
                                    index,
                                    event.target.value
                                  );
                                }}
                              />
                            </FormControl>
                          </Grid>

                          <Grid item md={12} sm={12} className="grid-padding">
                            <div style={{ display: 'flex', marginTop: '16px' }}>
                              <Typography
                                variant="h5"
                                className={classes.titleUnderline}
                                style={{
                                  marginTop: '16px',
                                  marginRight: '16px'
                                }}
                              >
                                Billing Details
                              </Typography>
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() =>
                                  setAdditionalBillingAddressCollapsibleIndex(
                                    index,
                                    additionalBillingAddressCollapsibleMap.get(
                                      index
                                    )
                                      ? !additionalBillingAddressCollapsibleMap.get(
                                          index
                                        )
                                      : true
                                  )
                                }
                              >
                                {additionalBillingAddressCollapsibleMap.get(
                                  index
                                ) ? (
                                  <KeyboardArrowUp />
                                ) : (
                                  <KeyboardArrowDown />
                                )}
                              </IconButton>
                            </div>
                          </Grid>

                          <Collapse
                            in={additionalBillingAddressCollapsibleMap.get(
                              index
                            )}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Grid
                              container
                              direction="row"
                              alignItems="stretch"
                            >
                              <Grid
                                item
                                md={12}
                                sm={12}
                                className="grid-padding"
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    Address
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    rows="2"
                                    className="customTextField"
                                    placeholder="Address"
                                    value={prodEle.billingAddress}
                                    onChange={(event) =>
                                      setAdditionalAddress(
                                        'billingAddress',
                                        index,
                                        event.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                              </Grid>

                              <Grid
                                item
                                md={6}
                                sm={12}
                                className="grid-padding"
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    Pincode
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    placeholder="Enter Pincode"
                                    className="customTextField"
                                    value={prodEle.billingPincode}
                                    onChange={(event) =>
                                      setAdditionalAddress(
                                        'billingPincode',
                                        index,
                                        event.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                              </Grid>
                              <Grid
                                item
                                md={6}
                                sm={12}
                                className="grid-padding"
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    City
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    placeholder="Enter City"
                                    className="customTextField"
                                    value={prodEle.billingCity}
                                    onChange={(event) =>
                                      setAdditionalAddress(
                                        'billingCity',
                                        index,
                                        event.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                              </Grid>

                              <Grid
                                item
                                md={6}
                                sm={12}
                                className="grid-padding"
                                style={{ marginTop: '16px' }}
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    State
                                  </Typography>
                                  <Select
                                    displayEmpty
                                    className={classes.fntClr}
                                    styles={customStyles}
                                    value={
                                      prodEle.billingState
                                        ? prodEle.billingState
                                        : 'Select State'
                                    }
                                    disabled={
                                      prodEle.billingCountry === 'India'
                                        ? false
                                        : true
                                    }
                                    input={
                                      <OutlinedInput
                                        style={{ width: '100%', height: '40%' }}
                                      />
                                    }
                                    onChange={async (e) => {
                                      if (e.target.value !== 'Select State') {
                                        setAdditionalAddress(
                                          'billingState',
                                          index,
                                          e.target.value
                                        );
                                      } else {
                                        setAdditionalAddress(
                                          'billingState',
                                          index,
                                          ''
                                        );
                                      }
                                    }}
                                  >
                                    {stateList &&
                                      stateList.map((option, index) => (
                                        <MenuItem value={option.name}>
                                          {option.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                              <Grid
                                item
                                md={6}
                                sm={12}
                                className="grid-padding"
                                style={{ marginTop: '16px' }}
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    Country
                                  </Typography>
                                  <Select
                                    value={prodEle.billingCountry}
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    style={{
                                      marginTop: '8px',
                                      marginBottom: '4px'
                                    }}
                                    className="customTextField"
                                    onChange={(e) => {
                                      setAdditionalAddress(
                                        'billingCountry',
                                        index,
                                        e.target.value
                                      );
                                    }}
                                  >
                                    {countryHelper
                                      .getCountriesList()
                                      .map((option, index) => (
                                        <MenuItem key={index} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Collapse>

                          <Grid item md={12} sm={12} className="grid-padding">
                            <div style={{ display: 'flex', marginTop: '16px' }}>
                              <Typography
                                variant="h5"
                                className={classes.titleUnderline}
                                style={{
                                  marginTop: '16px',
                                  marginRight: '16px'
                                }}
                              >
                                Shipping Details
                              </Typography>
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() =>
                                  setAdditionalShippingAddressCollapsibleIndex(
                                    index,
                                    additionalShippingAddressCollapsibleMap.get(
                                      index
                                    )
                                      ? !additionalShippingAddressCollapsibleMap.get(
                                          index
                                        )
                                      : true
                                  )
                                }
                              >
                                {additionalShippingAddressCollapsibleMap.get(
                                  index
                                ) ? (
                                  <KeyboardArrowUp />
                                ) : (
                                  <KeyboardArrowDown />
                                )}
                              </IconButton>
                            </div>
                          </Grid>

                          <Collapse
                            in={additionalShippingAddressCollapsibleMap.get(
                              index
                            )}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Grid
                              container
                              direction="row"
                              alignItems="stretch"
                            >
                              <Grid
                                item
                                md={12}
                                sm={12}
                                className="grid-padding"
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
                                          <CheckBoxIcon
                                            style={{ color: '#Ef5350' }}
                                          />
                                        }
                                        defaultChecked={false}
                                      />
                                    }
                                    label="Same as Billing address"
                                    value={copyShippingAddressMap.get(index)}
                                    onChange={(event) => {
                                      setCopyShippingAddressMap(
                                        index,
                                        event.target.checked
                                      );
                                      if (event.target.checked) {
                                        setAdditionalAddress(
                                          'shippingAddress',
                                          index,
                                          prodEle.billingAddress
                                        );
                                        setAdditionalAddress(
                                          'shippingPincode',
                                          index,
                                          prodEle.billingPincode
                                        );
                                        setAdditionalAddress(
                                          'shippingCity',
                                          index,
                                          prodEle.billingCity
                                        );
                                        setAdditionalAddress(
                                          'shippingState',
                                          index,
                                          prodEle.billingState
                                        );
                                        setAdditionalAddress(
                                          'shippingCountry',
                                          index,
                                          prodEle.billingCountry
                                        );
                                      } else {
                                        setAdditionalAddress(
                                          'shippingAddress',
                                          index,
                                          ''
                                        );
                                        setAdditionalAddress(
                                          'shippingPincode',
                                          index,
                                          ''
                                        );
                                        setAdditionalAddress(
                                          'shippingCity',
                                          index,
                                          ''
                                        );
                                        setAdditionalAddress(
                                          'shippingState',
                                          index,
                                          ''
                                        );
                                        setAdditionalAddress(
                                          'shippingCountry',
                                          index,
                                          ''
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                              </Grid>

                              <Grid
                                item
                                md={12}
                                sm={12}
                                className="grid-padding"
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    Address
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    rows="2"
                                    className="customTextField"
                                    placeholder="Shipping Address"
                                    value={prodEle.shippingAddress}
                                    onChange={(event) =>
                                      setAdditionalAddress(
                                        'shippingAddress',
                                        index,
                                        event.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                              </Grid>

                              <Grid
                                item
                                md={6}
                                sm={12}
                                className="grid-padding"
                                style={{ marginTop: '16px' }}
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    Pincode
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    placeholder="Enter Shipping Pincode"
                                    className="customTextField"
                                    value={prodEle.shippingPincode}
                                    onChange={(event) =>
                                      setAdditionalAddress(
                                        'shippingPincode',
                                        index,
                                        event.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                              </Grid>

                              <Grid
                                item
                                md={6}
                                sm={12}
                                className="grid-padding"
                                style={{ marginTop: '16px' }}
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    City
                                  </Typography>
                                  <TextField
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    type="text"
                                    placeholder="Enter Shipping City"
                                    className="customTextField"
                                    value={prodEle.shippingCity}
                                    onChange={(event) =>
                                      setAdditionalAddress(
                                        'shippingCity',
                                        index,
                                        event.target.value
                                      )
                                    }
                                  />
                                </FormControl>
                              </Grid>

                              <Grid
                                item
                                md={6}
                                sm={12}
                                className="grid-padding"
                                style={{ marginTop: '16px' }}
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    State
                                  </Typography>
                                  <Select
                                    displayEmpty
                                    className={classes.fntClr}
                                    styles={customStyles}
                                    value={
                                      prodEle.shippingState
                                        ? prodEle.shippingState
                                        : 'Select State'
                                    }
                                    disabled={
                                      prodEle.shippingCountry === 'India'
                                        ? false
                                        : true
                                    }
                                    input={
                                      <OutlinedInput
                                        style={{ width: '100%', height: '40%' }}
                                      />
                                    }
                                    onChange={async (e) => {
                                      if (e.target.value !== 'Select State') {
                                        setAdditionalAddress(
                                          'shippingState',
                                          index,
                                          e.target.value
                                        );
                                      } else {
                                        setAdditionalAddress(
                                          'shippingState',
                                          index,
                                          ''
                                        );
                                      }
                                    }}
                                  >
                                    {stateList &&
                                      stateList.map((option, index) => (
                                        <MenuItem value={option.name}>
                                          {option.name}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Grid>

                              <Grid
                                item
                                md={6}
                                sm={12}
                                className="grid-padding"
                                style={{ marginTop: '16px' }}
                              >
                                <FormControl fullWidth>
                                  <Typography variant="subtitle1">
                                    Country
                                  </Typography>
                                  <Select
                                    value={prodEle.shippingCountry}
                                    fullWidth
                                    variant="outlined"
                                    margin="dense"
                                    style={{
                                      marginTop: '8px',
                                      marginBottom: '4px'
                                    }}
                                    className="customTextField"
                                    onChange={(e) => {
                                      setAdditionalAddress(
                                        'shippingCountry',
                                        index,
                                        e.target.value
                                      );
                                    }}
                                  >
                                    {countryHelper
                                      .getCountriesList()
                                      .map((option, index) => (
                                        <MenuItem key={index} value={option}>
                                          {option}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                              </Grid>
                            </Grid>
                          </Collapse>
                        </Grid>
                      </div>
                    ))}
                </Grid>
              </Grid>
            )}
            {Tabvalue === 2 && (
              <Grid container direction="row" alignItems="stretch">
                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography
                    variant="h5"
                    className={classes.titleUnderline}
                    style={{ marginTop: '25px' }}
                  >
                    Balance Details
                  </Typography>
                </Grid>

                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">Balance</Typography>
                    {!disableBalanceEdit ? (
                      <RadioGroup
                        aria-label="quiz"
                        name="quiz"
                        value={vendor.balanceType}
                        onChange={(event) =>
                          setVendorProperty('balanceType', event.target.value)
                        }
                      >
                        <div>
                          <FormControlLabel
                            value="Receivable"
                            control={<Radio />}
                            label="Receivable"
                          />
                          <FormControlLabel
                            value="Payable"
                            control={<Radio />}
                            label="Payable"
                          />
                        </div>
                      </RadioGroup>
                    ) : null}
                    {!disableBalanceEdit ? (
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="number"
                        className="customTextField"
                        placeholder="0"
                        value={vendor.balance}
                        onChange={(event) =>
                          setVendorProperty('balance', event.target.value)
                        }
                      />
                    ) : (
                      <Typography style={{ marginTop: '16px' }}>
                        {vendor.balance === 0
                          ? ''
                          : concat(vendor.balanceType, ': ')}
                        {vendor.balance}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={12}
                  className={('grid-padding', classes.marginSet)}
                  style={{ marginTop: '16px' }}
                ></Grid>

                <Grid
                  item
                  md={6}
                  sm={12}
                  className={('grid-padding', classes.marginSet)}
                  style={{ marginTop: '16px' }}
                >
                  <FormControl fullWidth className={classes.datecol}>
                    <Typography variant="subtitle1">As of Date</Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="date"
                      className="customTextField"
                      value={vendor.asOfDate}
                      onChange={(event) =>
                        setVendorProperty('asOfDate', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography
                    variant="h5"
                    className={classes.titleUnderline}
                    style={{ marginTop: '25px' }}
                  >
                    TCS and TDS Details
                  </Typography>
                </Grid>

                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    margin="dense"
                  >
                    <Typography variant="subtitle1">TDS Applicable</Typography>

                    <Select
                      displayEmpty
                      value={vendor.tdsName ? vendor.tdsName : 'Select'}
                      fullWidth
                      style={{ textAlign: 'center', marginTop: '10px' }}
                      onChange={async (e) => {
                        if (e.target.value !== 'Select') {
                          let tdsObj = await getTDSDataByName(e.target.value);
                          setTDS(tdsObj);
                        } else {
                          revertTDS();
                        }
                      }}
                    >
                      <MenuItem value={'Select'}>{'Select'}</MenuItem>
                      {tdsList.map((option, index) => (
                        <MenuItem value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl
                    fullWidth
                    variant="outlined"
                    className={classes.formControl}
                    margin="dense"
                  >
                    <Typography variant="subtitle1">TCS Applicable</Typography>
                    <Select
                      displayEmpty
                      value={vendor.tcsName ? vendor.tcsName : 'Select'}
                      fullWidth
                      style={{ textAlign: 'center', marginTop: '10px' }}
                      onChange={async (e) => {
                        if (e.target.value !== 'Select') {
                          let tcsObj = await getTCSDataByName(e.target.value);
                          setTCS(tcsObj);
                        } else {
                          revertTCS();
                        }
                      }}
                    >
                      <MenuItem value={'Select'}>{'Select'}</MenuItem>
                      {tcsList.map((option, index) => (
                        <MenuItem value={option}>{option}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography
                    variant="h5"
                    className={classes.titleUnderline}
                    style={{ marginTop: '25px' }}
                  >
                    Others
                  </Typography>
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={6}
                  className="grid-padding"
                  style={{ marginTop: '10px' }}
                >
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">
                      Credit Limit Amount
                    </Typography>

                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      className="customTextField"
                      value={vendor.creditLimit}
                      placeholder="0"
                      InputProps={{
                        inputProps: {
                          min: 0
                        },
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="end">₹</InputAdornment>
                        )
                      }}
                      onChange={(event) =>
                        setVendorProperty('creditLimit', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={6}
                  className="grid-padding"
                  style={{ marginTop: '10px' }}
                >
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">
                      Credit Limit Days
                    </Typography>

                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      className="customTextField"
                      value={vendor.creditLimitDays}
                      placeholder="0"
                      InputProps={{
                        inputProps: {
                          min: 0
                        },
                        disableUnderline: true
                      }}
                      onChange={(event) =>
                        setVendorProperty('creditLimitDays', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={12}
                  sm={12}
                  className="grid-padding"
                  style={{ marginTop: '16px' }}
                >
                  <FormControl fullWidth>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="alsoCustomer"
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
                      label="Also-Customer"
                      value={vendor.isCustomer}
                      checked={vendor.isCustomer}
                      onChange={(event) =>
                        setVendorProperty('isCustomer', event.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid
                  item
                  md={6}
                  sm={12}
                  className="grid-padding"
                  style={{ marginTop: '16px' }}
                >
                  <FormControl fullWidth>
                    <Typography variant="subtitle1">
                      Tally Mapping Name
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="text"
                      placeholder="Enter Tally Mapping Name"
                      className="customTextField"
                      value={vendor.tallyMappingName}
                      onChange={(event) =>
                        setVendorProperty(
                          'tallyMappingName',
                          event.target.value
                        )
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          {!isEdit ? (
            <Button
              color="secondary"
              variant="outlined"
              disabled={
                vendor.country !== 'India'
                  ? ''
                  : vendor.name &&
                    vendor.phoneNo.length === 10 &&
                    checkGstNumberAvail()
                  ? ''
                  : 'true'
              }
              onClick={() => {
                saveDataAndNewOnClick();
              }}
            >
              Save & New
            </Button>
          ) : (
            ''
          )}
          <Button
            color="secondary"
            variant="outlined"
            disabled={
              vendor.country !== 'India'
                ? ''
                : vendor.name &&
                  vendor.phoneNo.length === 10 &&
                  checkGstNumberAvail()
                ? ''
                : 'true'
            }
            onClick={() => {
              saveDataOnClick();
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openBothVendorAndCustomer}
        onClose={handleBothVendorAndCustomerCloseModel}
        maxWidth="sm"
        classes={{ paper: classes.paper }}
      >
        <DialogTitle id="confirm-modal-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The same number is already registered as both Vendor and Customer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleBothVendorAndCustomerCloseModel();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openOnlyCustomer}
        onClose={handleOnlyCustomerCloseModel}
        maxWidth="sm"
        classes={{ paper: classes.paper }}
      >
        <DialogTitle id="confirm-modal-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The same number is registered as Customer. Do u want to save it as
            Vendor too?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleOnlyCustomerCloseModel();
            }}
          >
            No
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              saveOnlyVendorCloseModel();
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        // fullScreen={fullScreen}
        open={openCloseDialog}
        onClose={handleCloseDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Vendor will not be saved, Do you want to close?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseDialogClose();
              handleVendorModalClose();
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button onClick={handleCloseDialogClose} color="primary" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openOnlyVendor}
        onClose={handleOnlyVendorCloseModel}
        maxWidth="sm"
        classes={{ paper: classes.paper }}
      >
        <DialogTitle id="confirm-modal-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The same number is already registered as Vendor.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleOnlyVendorCloseModel();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openInvalidGSTNo}
        onClose={handleOpenInvalidGSTNoCloseModel}
        maxWidth="sm"
        classes={{ paper: classes.paper }}
      >
        <DialogTitle id="confirm-modal-title"></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {openInvalidGSTNoMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              handleOpenInvalidGSTNoCloseModel();
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="sm"
        open={openErrorDialog}
        classes={{ paper: classes.paper }}
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>{errorMessage}</p>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="sm"
        open={gstNumberAlreadyExists}
        classes={{ paper: classes.paper }}
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Vendor with same GST Number already exists</p>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseGstNumberAlreadyExistsModel}
            color="primary"
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        maxWidth="sm"
        open={openGSTFetchLoader}
        classes={{ paper: classes.paper }}
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the GST details are being fetched!!!</p>
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
        maxWidth="sm"
        open={phoneNumberAlreadyExists}
        classes={{ paper: classes.paper }}
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>
                  Vendor with same Phone Number already exists. Would you still
                  like to proceed to save Vendor?
                </p>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePhoneNumberAlreadyExistsModel}
            color="primary"
            autoFocus
          >
            CANCEL
          </Button>
          <Button
            onClick={(e) => proceedToSaveVendorBySamePhoneNumber()}
            color="primary"
            autoFocus
          >
            PROCEED TO SAVE WITH SAME NUMBER
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InjectObserver(VendorModal);