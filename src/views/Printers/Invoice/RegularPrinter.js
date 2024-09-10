import React, { useEffect, useState, useRef } from 'react';
import Card from '@material-ui/core/Card';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import '../printer.css';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { ChromePicker } from 'react-color';
import {
  Grid,
  makeStyles,
  TextField,
  Checkbox,
  FormLabel,
  Box,
  Backdrop,
  CircularProgress,
  RadioGroup,
  Radio,
  IconButton,
  Switch
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import Controls from '../../../components/controls';
import { useStore } from '../../../Mobx/Helpers/UseStore';
import InjectObserver from '../../../Mobx/Helpers/injectWithObserver';
import { toJS } from 'mobx';
import { createTheme, MuiThemeProvider } from '@material-ui/core/styles';
import * as Db from '../../../RxDb/Database/Database';
import ComponentToPrint from '../ComponentsToPrint';
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
    marginTop: '16px'
  },
  flex: {
    display: 'flex'
  },
  center: {
    alignSelf: 'center',
    textAlign: 'center'
  },
  paperBox: {
    fontSize: '9px',
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
  formLabel: {
    paddingLeft: '30px',
    color: '#263238',
    fontWeight: 'bold'
  },
  formMultiLabel: {
    marginRight: '0px'
  },
  flexOne: {
    flex: 1
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

// export default
function RegularPrinters() {
  const store = useStore();

  const { invoiceRegular, openLoader } = toJS(store.PrinterSettingsStore);
  const {
    getInvoiceSettings,
    saveInvoiceRegularSettings,
    updateRegularSettingsField,
    setOpenLoader
  } = store.PrinterSettingsStore;

  const [bankAccountDataList, setBankAccountDataList] = React.useState([]);

  const updateState = (field, value) => {
    updateRegularSettingsField('invoiceRegular', field, value);
  };

  const classes = useStyles();

  const allInputs = { imgUrl: '' };
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  const [signatureImagesFile, setSignatureImageAsFile] = useState('');
  const [signatureImageAsUrl, setSignatureImageAsUrl] = useState('');
  const inputRef = useRef([]);
  const [coloropen, setColoropen] = useState(false);

  const companyLogoSizeList = ['Small', 'Medium', 'Large'];

  const fontSizeList = ['Small', 'Medium', 'Large'];

  const signatureSizeList = ['Small', 'Medium', 'Large'];
  const colorPickerRef = useRef();

  const handleCloseLoader = () => {};

  useEffect(() => {
    getInvoiceSettings(localStorage.getItem('businessId'));
    document.addEventListener('mousedown', handleClickOutside);
    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target)
    ) {
      setColoropen(false);
    }
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
        returnedQty: 1,
        hsn: 123456
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
        returnedQty: 1,
        hsn: 234567
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
        returnedQty: 1,
        hsn: 345678
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
        returnedQty: '10',
        hsn: 445566
      },
      {
        item_name: 'Product 5',
        sku: 'sku5',
        barcode: '',
        mrp: '7',
        offer_price: 'sku5',
        qty: '5',
        discount_percent: 0,
        discount_amount: 10,
        cgst: '5',
        sgst: '3',
        cgst_amount: 1.75,
        sgst_amount: 0,
        amount: '53.55',
        returnedQty: '5',
        hsn: 998877,
        cess: 50
      }
    ],
    rateList: [
      {
        defaultBool: false,
        id: 'r111666790831984',
        metal: 'Gold',
        purity: '24',
        rateByGram: 4500
      }
    ],
    customer_id: 'c21617185794751',
    customer_payable: true,
    invoice_number: 'i11617186269',
    invoice_date: '31-03-2022',
    is_roundoff: true,
    round_amount: '0.40',
    total_amount: 1680,
    is_credit: false,
    payment_type: 'cash',
    received_amount: 0,
    balance_amount: 0,
    isPartiallyReturned: false,
    isFullyReturned: true,
    sequenceNumber: 1,
    _id: 'qqnj26d830:1617186424815',
    poInvoiceNo: 'PO/1',
    poDate: '17/09/2022',
    transportMode: 'By Road',
    vehicleNo: 'KA33QR1234',
    customer_name: 'Roshan',
    customer_phoneNo: '9999999999',
    customer_address: 'Plot No:1, Shop No.8, Koramangala, Bangalore, 560034',
    customerGSTNo: '18AABCU9603R1ZZ',
    customerState: 'Karnataka',
    shipToCustomerName: 'Sirish',
    shipToCustomerAddress: '#43, KR Puram, Bangalore, 560034',
    shipToCustomerPhoneNo: '9999999999',
    shipToCustomerGSTNo: '18AABCU9603R1YY',
    shipToCustomerState: 'Karnataka',
    ewayBillNo: '33445566',
    isSale: false,
    notes: 'My Sample Notes',
    placeOfSupplyName: '29-Karnataka',
    shipping_charge: 50,
    packing_charge: 20,
    balanceType: 'Receivable',
    totalBalance: 99999,
    tcsAmount: 2.4,
    tcsName: 'TCS',
    tcsRate: 2,
    irnNo: 'ha1kvl1hipbtlzvza9ufzt7ez0nqjpsyvvkk3xmevbckn5ket5g55cl9xyxu5ufc',
    ackNo: '12345',
    ackDt: '20-09-2023'
  };

  //A4=3579 x 2551, A5=2551 x 1819
  const getPageWidth = () => {
    return invoiceRegular.ddlPageSize === 'A4' ? '510px' : '510px';
  };

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

  useEffect(() => {
    getBankAccounts();
  }, []);

  const openColorchange = () => {
    setColoropen(!coloropen);
  };

  useEffect(() => {
    invoiceRegular.fileCompanyLogo = imageAsUrl;
  }, [imageAsUrl]);

  useEffect(() => {
    setImageAsUrl((prevObject) => ({
      ...prevObject,
      imgUrl:
        invoiceRegular.fileCompanyLogo.imgUrl === '' ||
        invoiceRegular.fileCompanyLogo.imgUrl
          ? invoiceRegular.fileCompanyLogo.imgUrl
          : invoiceRegular.fileCompanyLogo
    }));
  }, [invoiceRegular.fileCompanyLogo]);

  useEffect(() => {
    setSignatureImageAsUrl(invoiceRegular.strSignature);
  }, [invoiceRegular.strSignature]);

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
    if (imageAsUrl === '' || signatureImageAsUrl === '') {
      if (imageAsUrl === '') {
        updateState('fileCompanyLogo', '');
      }
      if (signatureImageAsUrl === '') {
        updateState('strSignature', '');
      }
      //setOpenLoader(true);
      if (imageAsFile !== '') {
        await FirebaseUpload(imageAsFile, 'companyLogo');
      }
      if (signatureImagesFile !== '') {
        await FirebaseUpload(signatureImagesFile, 'signature');
      }
      saveInvoiceRegularSettings();
      toast('Printer Settings saved successfully!', {
        hideProgressBar: true,
        autoClose: 2000,
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
    }

    if (imageAsFile === '' && signatureImagesFile === '') {
      saveInvoiceRegularSettings();
      toast('Printer Settings saved successfully!', {
        hideProgressBar: true,
        autoClose: 2000,
        position: toast.POSITION.BOTTOM_CENTER
      });
      return;
    }

    setOpenLoader(true);
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
            saveInvoiceRegularSettings();
            toast('Printer Settings saved successfully!', {
              hideProgressBar: true,
              autoClose: 2000,
              position: toast.POSITION.BOTTOM_CENTER
            });
          });
      }
    );
  };

  const handlecolorChange = (selectedColor) => {
    console.log('selectedColor.hex', selectedColor.hex);
    updateState('companyNameColor', selectedColor.hex);
    // setColoropen(false);
  };

  const handleQRCodeValue = (type, value) => {
    updateState(type, value);
    if (type === 'paymentbankNumber' || type === 'paymentifsc') {
      updateState(
        'strqrcode',
        `${
          invoiceRegular.paymentbankNumber
            ? invoiceRegular.paymentbankNumber
            : 0
        }@${
          invoiceRegular.paymentifsc ? invoiceRegular.paymentifsc : ''
        }.ifsc.npci`
      );
    }
    if (type === 'paymentUpi' || type === 'paymentPayeeName') {
      updateState(
        'strqrcode',
        invoiceRegular.paymentUpi ? invoiceRegular.paymentUpi : ''
      );
    }
  };

  const handleThemeChange = (value) => {};

  return (
    <Grid container>
      <Grid style={{ display: 'flex' }}>
        <Grid xs={5} className={classes.containerInput}>
          {/* -----------------col 1---------------------- */}

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.boolDefault}
                      onChange={(e) =>
                        updateState('boolDefault', e.target.checked)
                      }
                    />
                  }
                  label="Make Regular Printer Default"
                />
              </div>
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>Choose Theme</FormLabel>
            </Grid>
            <FormControl
              className={[classes.checkboxMarginTop, classes.formLabel]}
              md={12}
              sm={12}
            >
              <RadioGroup
                aria-label="barcode"
                name="theme"
                value={invoiceRegular.theme}
                onChange={(e) => {
                  updateState('theme', e.target.value);
                  handleThemeChange(e.target.value);
                }}
              >
                <FormControlLabel
                  value="Theme 1"
                  control={<Radio />}
                  label="Theme 1"
                />
                <FormControlLabel
                  value="Theme 2"
                  control={<Radio />}
                  label="Theme 2"
                />

                <FormControlLabel
                  value="Theme 3"
                  control={<Radio />}
                  label="Theme 3"
                />
                <FormControlLabel
                  value="Theme 4"
                  control={<Radio />}
                  label="Theme 4"
                />
                <FormControlLabel
                  value="Theme 5"
                  control={<Radio />}
                  label="Theme 5"
                />
                <FormControlLabel
                  value="Theme 6"
                  control={<Radio />}
                  label="Theme 6"
                />
                <FormControlLabel
                  value="Theme 7"
                  control={<Radio />}
                  label="Theme 7"
                />
                <FormControlLabel
                  value="Theme 8"
                  control={<Radio />}
                  label="Theme 8"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>
                Choose Print Text Size
              </FormLabel>
            </Grid>
            <FormControl className={classes.formLabel} fullWidth>
              <Select
                value={invoiceRegular.textSize}
                fullWidth
                variant="outlined"
                margin="dense"
                style={{ marginTop: '8px', marginBottom: '4px' }}
                className="customTextField"
                onChange={(event) =>
                  updateState('textSize', event.target.value)
                }
              >
                {fontSizeList.map((e, index) => (
                  <MenuItem key={index} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>
                Choose Company Logo Size
              </FormLabel>
            </Grid>
            <FormControl className={classes.formLabel} fullWidth>
              <Select
                value={invoiceRegular.logoSize}
                fullWidth
                variant="outlined"
                margin="dense"
                style={{ marginTop: '8px', marginBottom: '4px' }}
                className="customTextField"
                onChange={(event) =>
                  updateState('logoSize', event.target.value)
                }
              >
                {companyLogoSizeList.map((e, index) => (
                  <MenuItem key={index} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>
                Choose Signature Size
              </FormLabel>
            </Grid>
            <FormControl className={classes.formLabel} fullWidth>
              <Select
                value={invoiceRegular.signatureSize}
                fullWidth
                variant="outlined"
                margin="dense"
                style={{ marginTop: '8px', marginBottom: '4px' }}
                className="customTextField"
                onChange={(event) =>
                  updateState('signatureSize', event.target.value)
                }
              >
                {signatureSizeList.map((e, index) => (
                  <MenuItem key={index} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>Company Name</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceRegular.boolCompanyName}
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
                value={invoiceRegular.strCompanyName}
                onChange={(e) => {
                  updateState('strCompanyName', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  display: 'flex',
                  marginLeft: '35px',
                  marginTop: '16px',
                  marginBottom: '10px'
                }}
              >
                <Box className={classes.primaryImageButtonWrapper}>
                  <span>Change Company Name Color</span>
                </Box>

                <Box
                  onClick={openColorchange}
                  className={classes.primaryImageButtonWrapper}
                >
                  <div
                    style={{
                      marginLeft: '16px',
                      height: '30px',
                      width: '40px',
                      cursor: 'pointer',
                      backgroundColor:
                        invoiceRegular.companyNameColor === '' ||
                        invoiceRegular.companyNameColor === null ||
                        invoiceRegular.companyNameColor === undefined
                          ? '#000000'
                          : invoiceRegular.companyNameColor
                    }}
                  ></div>
                </Box>
              </div>

              {coloropen && (
                <div style={{ width: '225px' }} ref={colorPickerRef}>
                  <ChromePicker
                    color={
                      invoiceRegular.companyNameColor === '' ||
                      invoiceRegular.companyNameColor === null ||
                      invoiceRegular.companyNameColor === undefined
                        ? '#000000'
                        : invoiceRegular.companyNameColor
                    }
                    onChangeComplete={handlecolorChange}
                  />
                </div>
              )}
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceRegular.boolCompanyLogo}
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
                    ref={(el) => (inputRef.current[31] = el)}
                    onChange={handleImageAsFile}
                    id="product-primary-upload"
                  />
                </Box>
              </div>
            </Grid>
          </Grid>

          {String(localStorage.getItem('isJewellery')).toLowerCase() ===
            'true' && (
            <Grid container className={classes.containerField}>
              <Grid style={{ display: 'flex' }} item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.boolBisHallmark}
                      onChange={(e) =>
                        updateState('boolBisHallmark', e.target.checked)
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
                        'https://firebasestorage.googleapis.com/v0/b/oneshell-d3a18.appspot.com/o/pos%2Fbis_hallmark.png?alt=media&token=8e7c3fd8-3aa2-405a-91d0-7da588e9032f'
                      }
                    />
                  </Box>
                </div>
              </Grid>
            </Grid>
          )}

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>
                Company Additional Description
              </FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceRegular.boolCompanyAdditionalDesc}
                    onChange={(e) =>
                      updateState('boolCompanyAdditionalDesc', e.target.checked)
                    }
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceRegular.companyAdditionalDesc}
                onChange={(e) => {
                  updateState('companyAdditionalDesc', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>Address</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceRegular.boolAddress}
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
                value={invoiceRegular.strAddress}
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
                    checked={invoiceRegular.boolEmail}
                    onChange={(e) => updateState('boolEmail', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceRegular.strEmail}
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
                    checked={invoiceRegular.boolWebsite}
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
                value={invoiceRegular.strWebsite}
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
                    checked={invoiceRegular.boolPhone}
                    onChange={(e) => updateState('boolPhone', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceRegular.strPhone}
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
                    checked={invoiceRegular.boolGSTIN}
                    onChange={(e) => updateState('boolGSTIN', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceRegular.strGSTIN}
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
                    checked={invoiceRegular.boolPAN}
                    onChange={(e) => updateState('boolPAN', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceRegular.strPAN}
                onChange={(e) => {
                  updateState('strPAN', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>Description</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceRegular.boolDesc}
                    onChange={(e) => updateState('boolDesc', e.target.checked)}
                  />
                }
                className={classes.formMultiLabel}
              />
              <MuiThemeProvider theme={theme}>
                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  variant="outlined"
                  multiline
                  maxRows={4}
                  value={invoiceRegular.strDesc}
                  onChange={(e) => {
                    updateState('strDesc', e.target.value);
                  }}
                  className={classes.flexOne}
                />
              </MuiThemeProvider>
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
                    checked={invoiceRegular.boolTerms}
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
                  value={invoiceRegular.strTerms}
                />
              </MuiThemeProvider>
            </Grid>
          </Grid>

          {String(localStorage.getItem('isJewellery')).toLowerCase() ===
            'true' && (
            <Grid container className={classes.containerField}>
              <Grid item xs={12}>
                <FormLabel className={classes.formLabel}>
                  Scheme Terms and Conditions
                </FormLabel>
              </Grid>
              <Grid style={{ display: 'flex' }} item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.schemeBoolTerms}
                      onChange={(e) =>
                        updateState('schemeBoolTerms', e.target.checked)
                      }
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
                      updateState('schemeStrTerms', e.target.value);
                    }}
                    value={invoiceRegular.schemeStrTerms}
                  />
                </MuiThemeProvider>
              </Grid>
            </Grid>
          )}

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.boolPreviousBalance}
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
                      checked={invoiceRegular.boolTaxDetails}
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
                      checked={invoiceRegular.boolPaymentMode}
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
                      checked={invoiceRegular.boolBankDetail}
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
                            bankAccountDataList[0].bankName
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
              {invoiceRegular.boolBankDetail &&
                bankAccountDataList.length > 1 && (
                  <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    variant="outlined"
                    fullWidth
                    value={invoiceRegular.bankName}
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
                      checked={invoiceRegular.boolBankDetailsOnCreditSaleOnly}
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
                      checked={invoiceRegular.boolQrCode}
                      onChange={(e) => {
                        updateState('boolQrCode', e.target.checked);
                      }}
                    />
                  }
                  label="QR Code"
                />
              </div>
            </Grid>
            {invoiceRegular.boolQrCode && (
              <Grid xs={12}>
                <RadioGroup
                  aria-label="QR code value Option"
                  value={invoiceRegular.qrCodeValueOptn}
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
                        disabled={invoiceRegular.qrCodeValueOptn === 'upi'}
                        value={invoiceRegular.paymentbankNumber}
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
                        disabled={invoiceRegular.qrCodeValueOptn === 'upi'}
                        value={invoiceRegular.paymentifsc}
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
                        disabled={invoiceRegular.qrCodeValueOptn === 'upi'}
                        value={invoiceRegular.paymentPayeeName}
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
                        disabled={invoiceRegular.qrCodeValueOptn === 'bank'}
                        value={invoiceRegular.paymentUpi}
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
                    checked={invoiceRegular.boolSignature}
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
                  <>
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
                      ref={(el) => (inputRef.current[31] = el)}
                      onChange={handleSignatureImageAsFile}
                      id="authorised-signature-upload"
                    />
                  </>
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
              <FormLabel className={classes.formLabel}>Jurisdiction</FormLabel>
            </Grid>
            <Grid style={{ display: 'flex' }} item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={invoiceRegular.boolJurisdiction}
                    onChange={(e) =>
                      updateState('boolJurisdiction', e.target.checked)
                    }
                  />
                }
                className={classes.formMultiLabel}
              />
              <TextField
                id="outlined-size-normal"
                defaultValue=""
                variant="outlined"
                value={invoiceRegular.jurisdiction}
                onChange={(e) => {
                  updateState('jurisdiction', e.target.value);
                }}
                className={classes.flexOne}
              />
            </Grid>
          </Grid>

          <Grid
            container
            className={classes.containerField}
            style={{ display: 'none' }}
          >
            <Grid item xs={12}>
              <div className={classes.selectOption}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.boolAcknowledgement}
                      onChange={(e) =>
                        updateState('boolAcknowledgement', e.target.checked)
                      }
                    />
                  }
                  label="Print Acknowledgement"
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
                onClick={() => handleFireBaseUpload()}
              />{' '}
            </Grid>
          </Grid>
        </Grid>

        {/* ------------------------col 2------------------------- */}

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
                  style={{
                    maxWidth: getPageWidth(),
                    width: getPageWidth(),
                    height: 'auto',
                    margin: 'auto'
                  }}
                >
                  <ComponentToPrint
                    data={data}
                    printMe={false}
                    isThermal={false}
                  />
                </Card>
              </Grid>
              <Paper />
            </Grid>
          </Grid>
          <Grid className={classes.formLabel}>
            <div className={classes.checkBoxContainer}>
              <Grid xs={12}>
                <Grid style={{ alignSelf: 'center' }} item xs={12}>
                  <p>Page Size</p>
                </Grid>

                <Grid item xs={12}>
                  <FormControl component="fieldset">
                    <Select
                      labelId="demo-simple-select-placeholder-label-label"
                      id="demo-simple-select-placeholder-label"
                      value={invoiceRegular.ddlPageSize}
                      onChange={(e) => {
                        updateState('ddlPageSize', e.target.value);
                      }}
                      className={classes.selectEmpty}
                    >
                      <MenuItem value={'A4'}>A4</MenuItem>
                      <MenuItem value={'A5'}>A5</MenuItem>
                      <MenuItem value={'A4 landscape'}>
                        A4 - Horizontal
                      </MenuItem>
                      <MenuItem value={'A5 landscape'}>
                        A5 - Horizontal
                      </MenuItem>
                    </Select>
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
              <Grid item xs={12}>
                <FormLabel className={classes.formLabel}>
                  Header and Footer
                </FormLabel>
              </Grid>
              <FormControl
                className={[classes.checkboxMarginTop, classes.formLabel]}
                md={12}
                sm={12}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.headerSpace}
                      onChange={(e) => {
                        updateState('headerSpace', e.target.checked);
                        invoiceRegular.headerSpace &&
                          updateState('headerSize', 0);
                        updateState('headerUnit', 'in');
                      }}
                    />
                  }
                  label="Header"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.footerSpace}
                      onChange={(e) => {
                        updateState('footerSpace', e.target.checked);
                        invoiceRegular.footerSpace &&
                          updateState('footerSize', 0);
                        updateState('footerUnit', 'in');
                      }}
                    />
                  }
                  label="Footer"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <FormLabel
                  className={classes.formLabel}
                  style={{ paddingLeft: '0px' }}
                >
                  Height
                </FormLabel>
              </Grid>

              <Grid
                item
                xs={12}
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Grid
                  item
                  xs={3}
                  style={{ marginRight: '5px', marginTop: '5px' }}
                >
                  <TextField
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    type="number"
                    value={invoiceRegular.headerSize}
                    disabled={!invoiceRegular.headerSpace}
                    onChange={(e) => {
                      updateState('headerSize', e.target.value);
                      !invoiceRegular.headerUnit &&
                        updateState('headerUnit', 'in');
                    }}
                    className={classes.flexOne}
                    InputProps={{
                      inputProps: {
                        min: 0
                      }
                    }}
                    onKeyPress={(event) => {
                      if (
                        event?.key === '-' ||
                        event?.key === '+' ||
                        event?.key === 'e'
                      ) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Select
                    id="demo-simple-select-placeholder-label"
                    variant="outlined"
                    style={{ width: '75%', marginTop: '5px' }}
                    //defaultValue='in'
                    value={
                      invoiceRegular.headerUnit
                        ? invoiceRegular.headerUnit
                        : 'in'
                    }
                    disabled={!invoiceRegular.headerSpace}
                    onChange={(e) => {
                      updateState('headerUnit', e.target.value);
                    }}
                    className={classes.selectEmpty}
                  >
                    <MenuItem value="in">Inches</MenuItem>
                    <MenuItem value="cm">Cms</MenuItem>
                  </Select>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Grid
                  item
                  xs={3}
                  style={{ marginRight: '5px', marginTop: '5px' }}
                >
                  <TextField
                    id="outlined-size-normal"
                    variant="outlined"
                    value={invoiceRegular.footerSize}
                    type="number"
                    disabled={!invoiceRegular.footerSpace}
                    onChange={(e) => {
                      updateState('footerSize', e.target.value);
                      !invoiceRegular.footerUnit &&
                        updateState('footerUnit', 'in');
                    }}
                    className={classes.flexOne}
                    InputProps={{
                      inputProps: {
                        min: 0
                      }
                    }}
                    onKeyPress={(event) => {
                      if (
                        event?.key === '-' ||
                        event?.key === '+' ||
                        event?.key === 'e'
                      ) {
                        event.preventDefault();
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Select
                    id="demo-simple-select-placeholder-label"
                    variant="outlined"
                    style={{ width: '75%', marginTop: '5px' }}
                    //defaultValue='in'
                    value={
                      invoiceRegular.footerUnit
                        ? invoiceRegular.footerUnit
                        : 'in'
                    }
                    disabled={!invoiceRegular.footerSpace}
                    onChange={(e) => {
                      updateState('footerUnit', e.target.value);
                    }}
                    className={classes.selectEmpty}
                  >
                    <MenuItem value="in">Inches</MenuItem>
                    <MenuItem value="cm">Cms</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid container className={classes.containerField}>
            <Grid item xs={12}>
              <FormLabel className={classes.formLabel}>
                Custom Print Settings
              </FormLabel>
            </Grid>
            <FormControl
              className={[classes.checkboxMarginTop, classes.formLabel]}
              md={12}
              sm={12}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={invoiceRegular.showCustomPrintPopUp}
                    onChange={(e) => {
                      updateState('showCustomPrintPopUp', e.target.checked);
                    }}
                  />
                }
                label="Show Custom Print Pop Up on every print"
              />
            </FormControl>
          </Grid>

          <Grid
            container
            className={classes.containerField}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <Grid item xs={6}>
              <FormControl
                className={[classes.checkboxMarginTop, classes.formLabel]}
                md={12}
                sm={12}
              >
                <FormLabel
                  className={classes.formLabel}
                  style={{ paddingLeft: '0px' }}
                >
                  Type
                </FormLabel>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.printOriginal}
                      onChange={(e) => {
                        updateState('printOriginal', e.target.checked);
                      }}
                    />
                  }
                  label="Print Original"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.printDuplicate}
                      onChange={(e) => {
                        updateState('printDuplicate', e.target.checked);
                      }}
                    />
                  }
                  label="Print Duplicate"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={invoiceRegular.printTriplicate}
                      onChange={(e) => {
                        updateState('printTriplicate', e.target.checked);
                      }}
                    />
                  }
                  label="Print Triplicate"
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <FormLabel
                  className={classes.formLabel}
                  style={{ paddingLeft: '0px' }}
                >
                  No of Copies
                </FormLabel>
              </Grid>

              <Grid
                item
                xs={12}
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Grid
                  item
                  xs={3}
                  style={{ marginRight: '5px', marginTop: '5px' }}
                >
                  <TextField
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    type="number"
                    value={invoiceRegular.printOriginalCopies}
                    disabled={!invoiceRegular.printOriginal}
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
              <Grid
                item
                xs={12}
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Grid
                  item
                  xs={3}
                  style={{ marginRight: '5px', marginTop: '5px' }}
                >
                  <TextField
                    id="outlined-size-normal"
                    variant="outlined"
                    value={invoiceRegular.printDuplicateCopies}
                    type="number"
                    disabled={!invoiceRegular.printDuplicate}
                    onChange={(e) => {
                      updateState('printDuplicateCopies', e.target.value);
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
              <Grid
                item
                xs={12}
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <Grid
                  item
                  xs={3}
                  style={{ marginRight: '5px', marginTop: '5px' }}
                >
                  <TextField
                    id="outlined-size-normal"
                    variant="outlined"
                    value={invoiceRegular.printTriplicateCopies}
                    type="number"
                    disabled={!invoiceRegular.printTriplicate}
                    onChange={(e) => {
                      updateState('printTriplicateCopies', e.target.value);
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
            </Grid>
          </Grid>

          <Grid
            container
            xs={12}
            className={classes.containerField}
            style={{ display: 'flex', flexDirection: 'row' }}
          >
            <Grid item xs={6}>
              <FormControl
                className={[classes.checkboxMarginTop, classes.formLabel]}
                md={12}
                sm={12}
                style={{ display: 'flex', flexDirection: 'row' }}
              >
                <FormControlLabel
                  xs={3}
                  control={
                    <Checkbox
                      checked={invoiceRegular.printCustom}
                      onChange={(e) => {
                        updateState('printCustom', e.target.checked);
                      }}
                    />
                  }
                  label="Print"
                />
                <Grid
                  item
                  xs={9}
                  style={{ marginRight: '5px', marginTop: '5px' }}
                >
                  <TextField
                    id="outlined-size-normal"
                    variant="outlined"
                    hint="Custom Name"
                    value={invoiceRegular.printCustomName}
                    onChange={(e) => {
                      updateState('printCustomName', e.target.value);
                    }}
                    className={classes.flexOne}
                    InputProps={{
                      inputProps: {
                        min: 0
                      }
                    }}
                  />
                </Grid>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Grid
                item
                xs={3}
                style={{ marginRight: '5px', marginTop: '5px' }}
              >
                <TextField
                  id="outlined-size-normal"
                  defaultValue=""
                  variant="outlined"
                  type="number"
                  value={invoiceRegular.printCustomCopies}
                  disabled={!invoiceRegular.printCustom}
                  onChange={(e) => {
                    updateState('printCustomCopies', e.target.value);
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
          </Grid>
        </Grid>
      </Grid>
      <Backdrop
        className={classes.backdrop}
        open={openLoader}
        onClick={handleCloseLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
}
export default InjectObserver(RegularPrinters);