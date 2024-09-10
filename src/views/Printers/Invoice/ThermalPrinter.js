import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import '../printer.css';
import FormControl from '@material-ui/core/FormControl';
import {
  Grid,
  makeStyles,
  TextField,
  Checkbox,
  RadioGroup,
  Radio,
  FormLabel,
  MenuItem,
  Box,
  Select,
  OutlinedInput,
  Typography,
  IconButton
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import Controls from '../../../components/controls';
import { toJS } from 'mobx';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import * as Db from '../../../RxDb/Database/Database';
import ComponentToPrint from '../ComponentsToPrint';
import {} from '../ComponentsToPrint/printThermalContent';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { storage } from '../../../firebase/firebase';
import * as Bd from '../../../components/SelectedBusiness';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  containerInput: {
    flexGrow: 1,
    paddingRight: '24px'
  },
  containerField: {
    marginTop: '12px'
  },
  flex: {
    display: 'flex'
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  paperBox: {
    fontSize: '8px',
    height: '200px',
    padding: '6px',
    width: '200px',
    wordBreak: 'break-word'
  },
  paperContainer: {
    background: '#8080801a',
    padding: '30px'
  },
  checkBoxContainer: {
    paddingTop: '30px',
    paddingBottom: '30px'
  },
  p: {
    fontWeight: 'bold'
  },
  newButton: {
    color: 'white'
  },
  card: {
    height: '100%'
  },
  formLabel: {
    paddingLeft: '30px',
    color: '#263238'
  },
  formMultiLabel: {
    marginRight: '0px'
  },
  link: {
    fontFamily: 'Nunito Sans, Roboto, sans-serif',
    color: '#ef5350',
    marginRight: '30px'
  },
  flexOne: {
    flex: 1
  },
  cardCol1: {
    width: '15%'
  },
  cardCol2: {
    width: '25%'
  },
  cardCol3: {
    width: '15%'
  },
  cardCol4: {
    width: '20%'
  },
  cardCol5: {
    width: '25%',
    textAlign: 'right'
  },
  cardColFlex: {
    flex: 1,
    wordBreak: 'keep-all'
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row'
  },
  cardCol60percent: {
    display: 'flex',
    flexDirection: 'row',
    textAlign: 'right',
    width: '60%',
    maxWidth: '128px'
  },
  strong: {
    fontWeight: 600
  },
  separator: {
    height: '5px',
    width: '100%'
  },
  selectOption: {
    float: 'left',
    '& .makeStyles-formControl-53': {
      borderRadius: '7px'
    }
  },
  noLabel: {
    marginTop: '20px'
  },
  formControl: {
    marginBottom: '5px',
    minWidth: 140,
    border: '1px solid grey',
    background: 'white',
    padding: '6px'
  },
  selectFont: {
    fontSize: '13px'
  },
  primaryImageWrapper: {
    padding: theme.spacing(1),
    display: 'inline-block',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
    marginRight: theme.spacing(2)
  },
  primaryImageButtonWrapper: {
    '& #product-primary-upload': {
      display: 'none'
    },
    '& #authorised-signature-upload': {
      display: 'none'
    },
    '& #product-secondary-upload': {
      display: 'none'
    },
    '& .uploadImageButton': {
      color: '#fff',
      bottom: '10px',
      backgroundColor: '#4a83fb',
      padding: '7px',
      fontSize: '14px',
      fontFamily: 'Roboto',
      fontWeight: 500,
      lineHeight: 1.75,
      borderRadius: '4px',
      marginRight: theme.spacing(2),
      '&.primaryImage': {
        margin: '5px',
        position: 'relative',
        top: '-20px'
      },
      '& i': {
        marginRight: '8px'
      }
    }
  }
}));

const theme = createTheme({
  overrides: {
    MuiOutlinedInput: {
      root: {
        '& $notchedOutline': {
          padding: '0 !important'
        },
        '&:hover $notchedOutline': {
          padding: '0 !important'
        },
        '&$focused $notchedOutline': {
          padding: '0 !important',
          borderColor: '#2196f3'
        }
      }
    }
  }
});

function ThermalPrinters() {
  const store = useStore();
  const { invoiceThermal } = toJS(store.PrinterSettingsStore);
  const {
    getInvoiceSettings,
    saveInvoiceThermalSettings,
    updateRegularSettingsField
  } = store.PrinterSettingsStore;
  const allInputs = { imgUrl: '' };
  const [printersList, setPrinterList] = React.useState([]);
  const [selectedPrinter, setSelectedPrinter] = React.useState([]);
  const [selectedKOTPrinter, setSelectedKOTPrinter] = React.useState([]);
  const [isRestaurant, setIsRestaurants] = React.useState(false);
  const [bankAccountDataList, setBankAccountDataList] = React.useState([]);
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  const [signatureImagesFile, setSignatureImageAsFile] = useState('');
  const [signatureImageAsUrl, setSignatureImageAsUrl] = useState('');
  const bulletChar = '';

  const updateState = (field, value) => {
    updateRegularSettingsField('invoiceThermal', field, value);
  };

  const classes = useStyles();

  useEffect(() => {
    invoiceThermal.fileCompanyLogo = imageAsUrl;
  }, [imageAsUrl]);

  useEffect(() => {
    setImageAsUrl((prevObject) => ({
      ...prevObject,
      imgUrl:
        invoiceThermal.fileCompanyLogo.imgUrl === '' ||
        invoiceThermal.fileCompanyLogo.imgUrl
          ? invoiceThermal.fileCompanyLogo.imgUrl
          : invoiceThermal.fileCompanyLogo
    }));
  }, [invoiceThermal.fileCompanyLogo]);

  useEffect(() => {
    setSignatureImageAsUrl(invoiceThermal.strSignature);
  }, [invoiceThermal.strSignature]);

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));

    let printerData;
    try {
      printerData = JSON.parse(window.localStorage.getItem('printers'));
      setPrinterList(printerData);
    } catch (e) {
      console.error(' Error: ', e.message);
    }

    if (window.localStorage.getItem('thermalPrinterName')) {
      setSelectedPrinter(window.localStorage.getItem('thermalPrinterName'));
    }

    if (window.localStorage.getItem('thermalKOTPrinterName')) {
      setSelectedKOTPrinter(
        window.localStorage.getItem('thermalKOTPrinterName')
      );
    }

    if (localStorage.getItem('isHotelOrRestaurant')) {
      let isHotelOrRestaurant = localStorage.getItem('isHotelOrRestaurant');
      if (String(isHotelOrRestaurant).toLowerCase() === 'true') {
        setIsRestaurants(true);
      }
    }
  }, []);

  const saveSelectedThermalPrinter = (printer) => {
    localStorage.setItem('thermalPrinterName', printer.name);
  };

  const saveSelectedKOTThermalPrinter = (printer) => {
    localStorage.setItem('thermalKOTPrinterName', printer.name);
  };

  // test data to print
  const data = {
    item_list: [
      {
        item_name: 'Product 1',
        sku: 'SKU',
        barcode: '',
        mrp: '120',
        offer_price: 'SKU',
        qty: 1,
        discount_percent: 0,
        discount_amount: 0,
        cgst: '0.25',
        sgst: '3',
        cgst_amount: 3.6,
        sgst_amount: 0,
        amount: '120.30',
        returnedQty: 1
      },
      {
        item_name: 'Product 2',
        sku: 'SKU2',
        barcode: '',
        mrp: '300',
        offer_price: 'SKU2',
        qty: 1,
        discount_percent: 0,
        discount_amount: 0,
        cgst: '0.25',
        sgst: 0,
        cgst_amount: 0.75,
        sgst_amount: 0,
        amount: '300.75',
        returnedQty: 1
      },
      {
        item_name: 'Product 3',
        sku: '',
        barcode: '',
        mrp: '1000',
        offer_price: '1000',
        qty: 1,
        discount_percent: 0,
        discount_amount: 0,
        cgst: 0,
        sgst: '0.25',
        cgst_amount: 2.5,
        sgst_amount: 0,
        amount: '1002.50',
        returnedQty: 1
      },
      {
        item_name: 'Product 4',
        sku: 'sku4',
        barcode: '',
        mrp: '15',
        offer_price: '15',
        qty: '10',
        discount_percent: 0,
        discount_amount: 0,
        cgst: '3',
        sgst: '5',
        cgst_amount: 7.5,
        sgst_amount: 0,
        amount: '202.50',
        returnedQty: '10'
      },
      {
        item_name: 'Product 5',
        sku: 'sku5',
        barcode: '',
        mrp: '7',
        offer_price: 'sku5',
        qty: '5',
        discount_percent: 0,
        discount_amount: 0,
        cgst: '5',
        sgst: '3',
        cgst_amount: 1.75,
        sgst_amount: 0,
        amount: '53.55',
        returnedQty: '5'
      }
    ],
    customer_id: 'c21617185794751',
    customer_name: 'Srinija',
    customer_address: '005, SLV Belmont, Basavanapura road',
    customer_emailId: 'selluru@oneshell.in',
    customer_phoneNo: '+91 9972701898',
    customer_payable: true,
    invoice_number: 'i11617186269',
    invoice_date: '2021-03-31',
    is_roundoff: true,
    round_amount: '0.40',
    total_amount: 1680,
    is_credit: false,
    payment_type: 'cash',
    received_amount: 0,
    balance_amount: 0,
    isPartiallyReturned: false,
    isFullyReturned: true,
    _id: 'qqnj26d830:1617186424815'
  };

  useEffect(() => {
    getBankAccounts();
  }, []);

  const getBankAccounts = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    let query = db.bankaccounts.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.$.subscribe(async (data) => {
      if (!data) {
        return;
      }
      setBankAccountDataList(data);
    });
  };

  const handleBankDetails = (data) => {
    updateState('bankIfscCode', data.ifscCode);
    updateState('bankAccountNumber', data.accountNumber);
    updateState('bankAccountHolderName', data.accountHolderName);
  };

  const handleImageAsFile = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setImageAsUrl((prevObject) => ({
        ...prevObject,
        imgUrl: reader.result
      }));
    });
    reader.readAsDataURL(e.target.files[0]);
    e.target.value = '';
  };

  const handleSignatureImageAsFile = (e) => {
    const image = e.target.files[0];
    setSignatureImageAsFile((imageFile) => image);
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setSignatureImageAsUrl(reader.result);
    });
    reader.readAsDataURL(e.target.files[0]);
    e.target.value = '';
  };

  const handleFireBaseUpload = async (params) => {
    const status = params;

    if (imageAsUrl === '' || signatureImageAsUrl === '') {
      if (imageAsUrl === '') {
        updateState('fileCompanyLogo', '');
      }
      if (signatureImageAsUrl === '') {
        updateState('strSignature', '');
      }
      saveInvoiceThermalSettings();
      toast('Printer Settings saved successfully!', {
        hideProgressBar: true,
        autoClose: 2000,
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
      /* updateState('fileCompanyLogo', '');
      updateState('strSignature', '');
      saveInvoiceThermalSettings();
      return; */
    }

    if (imageAsFile === '' && signatureImagesFile === '') {
      saveInvoiceThermalSettings();
      toast('Printer Settings saved successfully!', {
        hideProgressBar: true,
        autoClose: 2000,
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
    }

    if (imageAsFile !== '') {
      await FirebaseUpload(imageAsFile, 'companyLogo');
    }
    if (signatureImagesFile !== '') {
      await FirebaseUpload(signatureImagesFile, 'signature');
    }
  };

  const FirebaseUpload = (imageFile, type) => {
    const uploadTask = storage.ref(`/pos/${imageFile.name}`).put(imageFile);
    uploadTask.on(
      'state_changed',
      (snapShot) => {
        console.log(snapShot);
      },
      (err) => {
        console.log(err);
      },
      () => {
        storage
          .ref('pos')
          .child(imageFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            if (type === 'companyLogo') {
              setImageAsUrl((prevObject) => ({
                ...prevObject,
                imgUrl: fireBaseUrl
              }));
              updateState('fileCompanyLogo', fireBaseUrl);
            }
            if (type === 'signature') {
              setSignatureImageAsUrl(fireBaseUrl);
              updateState('strSignature', fireBaseUrl);
            }
            saveInvoiceThermalSettings();
            toast('Printer Settings saved successfully!', {
              hideProgressBar: true,
              autoClose: 2000,
              position: toast.POSITION.BOTTOM_CENTER
            });
          });
      }
    );
  };

  const handleQRCodeValue = (type, value) => {
    updateState(type, value);
    if (type === 'paymentbankNumber' || type === 'paymentifsc') {
      updateState(
        'strqrcode',
        `${
          invoiceThermal.paymentbankNumber
            ? invoiceThermal.paymentbankNumber
            : 0
        }@${
          invoiceThermal.paymentifsc ? invoiceThermal.paymentifsc : ''
        }.ifsc.npci`
      );
    }
    if (type === 'paymentUpi') {
      updateState(
        'strqrcode',
        invoiceThermal.paymentUpi ? invoiceThermal.paymentUpi : ''
      );
    }
  };

  return (
    <Grid>
      <Grid style={{ display: 'flex' }}>
        <Grid xs={5} className={classes.containerInput}>
          {/* -----------------col 1---------------------- */}

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceThermal.boolDefault}
                      onChange={(e) =>
                        updateState('boolDefault', e.target.checked)
                      }
                    />
                  }
                  label="Make Thermal Printer Default"
                />
              </div>
            </Grid>
          </Grid>

          <Grid
            container
            className={classes.containerField}
            style={{ marginTop: '10px' }}
          >
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>
                Choose Printer
              </FormLabel>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid style={{ display: 'flex' }} item xs={11}>
              <Select
                displayEmpty
                value={selectedPrinter}
                input={
                  <OutlinedInput
                    style={{ width: '100%', marginLeft: '-3px' }}
                  />
                }
                inputProps={{ 'aria-label': 'Without label' }}
                onOpen={(e) => {
                  let printerData;
                  try {
                    printerData = JSON.parse(
                      window.localStorage.getItem('printers')
                    );
                    setPrinterList(printerData);
                  } catch (e) {
                    console.error(' Error: ', e.message);
                  }
                }}
              >
                <MenuItem disabled value="">
                  Select Printer
                </MenuItem>
                {printersList &&
                  printersList.map((c) => (
                    <MenuItem
                      key={c.name}
                      value={c.name}
                      name={c.name}
                      style={{ color: 'black' }}
                      onClick={() => {
                        setSelectedPrinter(c.name);
                        saveSelectedThermalPrinter(c);
                      }}
                    >
                      {c.displayName}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>

          {isRestaurant ? (
            <Grid
              container
              className={classes.containerField}
              style={{ marginTop: '20px', marginBottom: '20px' }}
            >
              <Grid item xs={12}>
                <FormLabel className={classes.formLabel}>
                  Choose KOT Printer
                </FormLabel>
              </Grid>
              <Grid item xs={1}></Grid>
              <Grid style={{ display: 'flex' }} item xs={11}>
                <Select
                  displayEmpty
                  value={selectedKOTPrinter}
                  input={
                    <OutlinedInput
                      style={{ width: '100%', marginLeft: '-3px' }}
                    />
                  }
                  inputProps={{ 'aria-label': 'Without label' }}
                  onOpen={(e) => {
                    let printerData;
                    try {
                      printerData = JSON.parse(
                        window.localStorage.getItem('printers')
                      );
                      setPrinterList(printerData);
                    } catch (e) {
                      console.error(' Error: ', e.message);
                    }
                  }}
                >
                  <MenuItem disabled value="">
                    Select Printer
                  </MenuItem>
                  {printersList &&
                    printersList.map((c) => (
                      <MenuItem
                        key={c.name}
                        value={c.name}
                        name={c.name}
                        style={{ color: 'black' }}
                        onClick={() => {
                          setSelectedKOTPrinter(c.name);
                          saveSelectedKOTThermalPrinter(c);
                        }}
                      >
                        {c.displayName}
                      </MenuItem>
                    ))}
                </Select>
              </Grid>
            </Grid>
          ) : null}

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>Company Name</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolCompanyName}
                    onChange={(e) =>
                      updateState('boolCompanyName', e.target.checked)
                    }
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceThermal.strCompanyName}
                onChange={(e) => {
                  updateState('strCompanyName', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.containerField}>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolCompanyLogo}
                    onChange={(e) =>
                      updateState('boolCompanyLogo', e.target.checked)
                    }
                  />
                }
                className={classes.formMultiLabel}
              />
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <Box
                  component="div"
                  className={classes.primaryImageWrapper}
                  style={{ marginRight: '0px' }}
                >
                  <Box
                    component="img"
                    style={{ width: '40px', height: '40px' }}
                    sx={{
                      height: 40,
                      width: 40,
                      maxHeight: { xs: 40, md: 40 },
                      maxWidth: { xs: 40, md: 40 }
                    }}
                    src={
                      imageAsUrl.imgUrl
                        ? imageAsUrl.imgUrl
                        : '/static/images/upload_image.png'
                    }
                  />
                </Box>
                <Box
                  component="div"
                  sx={{
                    height: 20,
                    width: 40,
                    maxHeight: { xs: 20, md: 20 },
                    maxWidth: { xs: 40, md: 40 }
                  }}
                >
                  <IconButton style={{ padding: '0px' }}>
                    <CloseIcon
                      style={{ widht: '15px', height: '15px' }}
                      onClick={() => {
                        setImageAsUrl('');
                        setImageAsFile('');
                      }}
                    />
                  </IconButton>
                </Box>
                <Box
                  component="span"
                  className={classes.primaryImageButtonWrapper}
                >
                  <label
                    htmlFor="product-primary-upload"
                    className="uploadImageButton primaryImage"
                    style={{ position: 'static' }}
                  >
                    <i className="fa fa-upload fa-1 " aria-hidden="true" />
                    <span>Upload Company Logo</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleImageAsFile}
                    id="product-primary-upload"
                  />
                </Box>
              </div>
            </Grid>
          </Grid>

          {/* <Grid container className={classes.containerField} >
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={invoiceThermal.boolCompanyLogo} onChange={(e) => updateState('boolCompanyLogo', e.target.checked)} />} label="Company Logo" />
              <InputFileReader onFilesChange={(e) => updateState('fileCompanyLogo', e)} />
            </Grid>
          </Grid> */}

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>Address</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolAddress}
                    onChange={(e) =>
                      updateState('boolAddress', e.target.checked)
                    }
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceThermal.strAddress}
                onChange={(e) => {
                  updateState('strAddress', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>Email</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolEmail}
                    onChange={(e) => updateState('boolEmail', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceThermal.strEmail}
                type="email"
                onChange={(e) => {
                  updateState('strEmail', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>Website</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolWebsite}
                    onChange={(e) =>
                      updateState('boolWebsite', e.target.checked)
                    }
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceThermal.strWebsite}
                type="website"
                onChange={(e) => {
                  updateState('strWebsite', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>Phone no.</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolPhone}
                    onChange={(e) => updateState('boolPhone', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceThermal.strPhone}
                onChange={(e) => {
                  updateState('strPhone', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>GSTIN on Sale</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolGSTIN}
                    onChange={(e) => updateState('boolGSTIN', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceThermal.strGSTIN}
                onChange={(e) => {
                  updateState('strGSTIN', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>PAN</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolPAN}
                    onChange={(e) => updateState('boolPAN', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceThermal.strPAN}
                onChange={(e) => {
                  updateState('strPAN', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>
                Terms and Conditions
              </FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolTerms}
                    onChange={(e) => updateState('boolTerms', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <MuiThemeProvider theme={theme}>
                <TextField
                  multiline
                  rows={'4'}
                  variant="outlined"
                  style={{ width: '100%' }}
                  onChange={(e) => {
                    updateState('strTerms', e.target.value);
                  }}
                  value={invoiceThermal.strTerms}
                />
              </MuiThemeProvider>
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceThermal.boolPreviousBalance}
                      onChange={(e) =>
                        updateState('boolPreviousBalance', e.target.checked)
                      }
                    />
                  }
                  label="Show Previous Balance"
                />
              </div>
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceThermal.boolTaxDetails}
                      onChange={(e) =>
                        updateState('boolTaxDetails', e.target.checked)
                      }
                    />
                  }
                  label="Tax Details"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceThermal.boolPaymentMode}
                      onChange={(e) =>
                        updateState('boolPaymentMode', e.target.checked)
                      }
                    />
                  }
                  label="Payment Mode"
                />
              </div>
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={6}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceThermal.boolBankDetail}
                      onChange={(e) => {
                        updateState('boolBankDetail', e.target.checked);
                        if (
                          e.target.checked &&
                          bankAccountDataList.length === 1
                        ) {
                          updateState(
                            'bankIfscCode',
                            bankAccountDataList[0].ifscCode
                          );
                          updateState(
                            'bankAccountNumber',
                            bankAccountDataList[0].accountNumber
                          );
                          updateState(
                            'bankName',
                            bankAccountDataList[0].accountDisplayName
                          );
                          updateState(
                            'bankAccountHolderName',
                            bankAccountDataList[0].accountHolderName
                          );
                        }
                      }}
                    />
                  }
                  label="Bank Details"
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              {invoiceThermal.boolBankDetail &&
                bankAccountDataList.length > 1 && (
                  <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    variant="outlined"
                    fullWidth
                    value={invoiceThermal.bankName}
                    onChange={(e) => {
                      updateState('bankName', e.target.value);
                    }}
                    className={classes.selectEmpty}
                  >
                    <MenuItem value={' '} disabled>
                      Choose Bank
                    </MenuItem>
                    {bankAccountDataList.map((ele, index) => (
                      <MenuItem
                        value={ele.accountDisplayName}
                        key={index}
                        onClick={(e) => handleBankDetails(ele)}
                      >
                        {ele.accountDisplayName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceThermal.boolBankDetailsOnCreditSaleOnly}
                      onChange={(e) =>
                        updateState(
                          'boolBankDetailsOnCreditSaleOnly',
                          e.target.checked
                        )
                      }
                    />
                  }
                  label="Show Bank Details only on Credit Sale"
                />
              </div>
            </Grid>
          </Grid>
          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceThermal.boolQrCode}
                      onChange={(e) => {
                        updateState('boolQrCode', e.target.checked);
                      }}
                    />
                  }
                  label="QR Code"
                />
              </div>
            </Grid>
            {invoiceThermal.boolQrCode && (
              <Grid xs={12}>
                <RadioGroup
                  aria-label="QR code value Option"
                  value={invoiceThermal.qrCodeValueOptn}
                  onChange={(e) =>
                    updateState('qrCodeValueOptn', e.target.value)
                  }
                >
                  <FormControlLabel
                    value="bank"
                    control={<Radio />}
                    label="Bank Detail"
                  />
                  <Grid container>
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        style={{ width: '97%' }}
                        placeholder="Bank Number"
                        disabled={invoiceThermal.qrCodeValueOptn === 'upi'}
                        value={invoiceThermal.paymentbankNumber}
                        onChange={(e) =>
                          handleQRCodeValue('paymentbankNumber', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="IFSC Code"
                        disabled={invoiceThermal.qrCodeValueOptn === 'upi'}
                        value={invoiceThermal.paymentifsc}
                        onChange={(e) =>
                          handleQRCodeValue('paymentifsc', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        style={{ width: '97%', marginTop: '10px' }}
                        placeholder="Payee Name"
                        disabled={invoiceThermal.qrCodeValueOptn === 'upi'}
                        value={invoiceThermal.paymentPayeeName}
                        onChange={(e) =>
                          handleQRCodeValue('paymentPayeeName', e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                  <FormControlLabel
                    value="upi"
                    control={<Radio />}
                    label="UPI Id"
                  />
                  <Grid container>
                    <Grid item xs={6}>
                      <TextField
                        variant="outlined"
                        placeholder="UPI Id"
                        style={{ width: '97%' }}
                        disabled={invoiceThermal.qrCodeValueOptn === 'bank'}
                        value={invoiceThermal.paymentUpi}
                        onChange={(e) =>
                          handleQRCodeValue('paymentUpi', e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </Grid>
            )}
          </Grid>
          <Grid container className={classes.containerField}>
            <Grid style={{ display: 'flex', width: '100%' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolSignature}
                    onChange={(e) =>
                      updateState('boolSignature', e.target.checked)
                    }
                  />
                }
                className={classes.formMultiLabel}
              />
              <div
                style={{ display: 'flex', flexDirection: 'row', width: '100%' }}
              >
                <div
                  className={classes.primaryImageWrapper}
                  style={{ marginRight: '0px' }}
                >
                  <Box
                    component="img"
                    style={{ width: '40px', height: '40px' }}
                    sx={{
                      height: 40,
                      width: 40,
                      maxHeight: { xs: 40, md: 40 },
                      maxWidth: { xs: 40, md: 40 }
                    }}
                    src={
                      signatureImageAsUrl
                        ? signatureImageAsUrl
                        : '/static/images/upload_image.png'
                    }
                  />
                </div>
                <div style={{ height: '20px', width: '40px' }}>
                  <IconButton style={{ padding: '0px' }}>
                    <CloseIcon
                      style={{ widht: '15px', height: '15px' }}
                      onClick={() => {
                        setSignatureImageAsUrl('');
                        setSignatureImageAsFile('');
                      }}
                    />
                  </IconButton>
                </div>
                <div
                  className={classes.primaryImageButtonWrapper}
                  style={{ textAlign: 'right', width: '100%' }}
                >
                  <label
                    htmlFor="authorised-signature-upload"
                    className="uploadImageButton primaryImage"
                    style={{
                      position: 'static',
                      textAlign: 'right',
                      width: '100%',
                      marginRight: '0px'
                    }}
                  >
                    <i className="fa fa-upload fa-1 " aria-hidden="true" />
                    <span>Upload Authorised Signatory</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleSignatureImageAsFile}
                    id="authorised-signature-upload"
                  />
                </div>
              </div>
              {/* <TextField
                id="outlined-size-normal"
                defaultValue="Authorised Signatory"
                variant="outlined"
                value={invoiceRegular.strSignature}
                onChange={(e) => {
                  updateState('strSignature', e.target.value);
                }}
                className={classes.flexOne}
              /> */}
            </Grid>
          </Grid>
          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceThermal.boolCutPaperSize}
                      onChange={(e) =>
                        updateState('boolCutPaperSize', e.target.checked)
                      }
                    />
                  }
                  label="Auto Cut Paper After Printing"
                />
              </div>
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <Controls.Button
                text="Save Changes"
                // size="small"
                variant="contained"
                color="secondary"
                className={classes.newButton}
                onClick={() => {
                  handleFireBaseUpload();
                }}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* -------------------------col 2------------------------ */}

        <Grid xs={7}>
          <Grid className={classes.paperContainer}>
            <Grid container spacing={3}>
              <Paper elevation={0} />
              <Grid
                style={{ display: 'flex', justifyContent: 'center' }}
                item
                xs={12}
              >
                <Card
                  className={classes.paperBox}
                  style={{ width: '210px', height: 'auto' }}
                >
                  <ComponentToPrint
                    data={data}
                    printMe={false}
                    isThermal={true}
                  />
                </Card>
              </Grid>
              <Paper />
            </Grid>
          </Grid>
          <Grid>
            <div className={classes.checkBoxContainer}>
              <Grid xs={12}>
                <Grid style={{ alignSelf: 'center' }} item xs={12}>
                  <p>Page size</p>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <RadioGroup
                      row
                      aria-label="position"
                      name="position"
                      defaultValue="top"
                    >
                      <FormControlLabel
                        value="2"
                        control={
                          <Radio
                            color="primary"
                            checked={invoiceThermal.rbgPageSize === '2'}
                            onChange={(e) => updateState('rbgPageSize', '2')}
                          />
                        }
                        label="2″ (58mm)"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="3"
                        control={
                          <Radio
                            color="primary"
                            checked={invoiceThermal.rbgPageSize === '3'}
                            onChange={(e) => updateState('rbgPageSize', '3')}
                          />
                        }
                        label="3″ (80mm)"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="4"
                        control={
                          <Radio
                            color="primary"
                            checked={invoiceThermal.rbgPageSize === '4'}
                            onChange={(e) => updateState('rbgPageSize', '4')}
                          />
                        }
                        label="4″ (110mm)"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid
            container
            className={classes.containerField}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <Grid item xs={6}>
              <FormControl
                className={[classes.formLabel]}
                md={12}
                sm={12}
              >
                <FormLabel
                  className={classes.formLabel}
                  style={{ paddingLeft: '0px' }}
                >
                  Print Custom Copies
                </FormLabel>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                type="number"
                value={invoiceThermal.printOriginalCopies}
                onChange={(e) => {
                  updateState('printOriginalCopies', e.target.value);
                }}
                className={classes.flexOne}
                InputProps={{
                  inputProps: {
                    min: 0
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.containerField}>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolCustomization}
                    onChange={(e) => {
                      updateState('boolCustomization', e.target.checked);
                    }}
                  />
                }
                className={classes.formMultiLabel}
              />
              <Typography style={{ marginTop: '7px' }}>
                Customization
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormLabel>Width</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceThermal.customWidth}
                onChange={(e) => {
                  updateState('customWidth', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel>Margin</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceThermal.customMargin}
                onChange={(e) => {
                  updateState('customMargin', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel>Page Size</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceThermal.boolPageSize}
                    onChange={(e) => {
                      updateState('boolPageSize', e.target.checked);
                    }}
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                placeholder="Width"
                type="number"
                value={invoiceThermal.pageSizeWidth}
                onChange={(e) => {
                  updateState('pageSizeWidth', e.target.value);
                }}
                className={classes.flexOne}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                placeholder="Heigth"
                type="number"
                value={invoiceThermal.pageSizeHeight}
                onChange={(e) => {
                  updateState('pageSizeHeight', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
export default InjectObserver(ThermalPrinters);