import React, { useState, useEffect, useRef } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  Input,
  FormControlLabel,
  withStyles,
  Grid,
  IconButton,
  FormControl,
  FormGroup,
  Checkbox,
  TextField,
  Typography,
  Box,
  Button,
  Backdrop,
  CircularProgress,
  Switch,
  OutlinedInput,
  InputAdornment,
  Tabs,
  Tab,
  AppBar,
  LinearProgress
} from '@material-ui/core';
import { Close as CloseIcon } from '@material-ui/icons';
import Controls from '../../components/controls/index';
import MenuItem from '@material-ui/core/MenuItem';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import { storage } from '../../firebase/firebase';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import BatchModal from './BatchModal';
import SerialModal from './SerialModal';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { styled } from '@material-ui/styles';
import RawMaterials from './RawMaterials';
import ProductAddOns from './ProductAddOns';
import * as unitHelper from 'src/components/Helpers/ProductUnitHelper';
import clsx from 'clsx';
import Loader from 'react-js-loader';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import * as Db from 'src/RxDb/Database/Database';
import * as Bd from 'src/components/SelectedBusiness';
import * as audit from 'src/components/Helpers/AuditHelper';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getProductName } from 'src/names/constants';
import { MAX_SIZE } from 'src/components/common/common';

const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3)
    },
    width: '100%',
    color: 'red'
  },
  input: {
    width: '100%',
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
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
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      color: 'black'
    }
  }
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    '& .grid-padding': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      '& .secondary-images': {
        '& button': {
          marginRight: theme.spacing(2)
        }
      }
    }
  },
  '& .grid-select': {
    selectedOption: {
      color: 'red'
    },
    marginLeft: '15px',
    '& .MuiFormControl-root': {
      width: '100%'
    },
    fullWidth: {
      width: '100%'
    }
  },
  checkboxMarginTop: {
    marginTop: '0.75rem'
  },
  checkboxMarginTopTax: {
    marginTop: '0.7rem'
  },
  marginTopFormGroup: {
    marginTop: '1.5rem'
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
  },
  primaryDocWrapper: {
    padding: theme.spacing(1),
    display: 'inline-block',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    borderRadius: '5px',
    marginRight: theme.spacing(2)
  },
  documentUploadButtonWrapper: {
    '& #product-doc-upload': {
      display: 'none'
    },
    '& #product-secDoc-upload': {
      display: 'none'
    },
    '& .docUploadButton': {
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
      '&.primaryDocImage': {
        margin: '5px',
        position: 'relative',
        top: '-20px'
      },
      '& i': {
        marginRight: '8px'
      }
    }
  },
  imageMargin: {
    marginLeft: theme.spacing(2)
  },
  primaryButton: {
    backgroundColor: '#4a83fb',
    bottom: '10px',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#4a83fb'
    }
  },
  addProductButton: {
    borderRadius: 25,
    color: '#FFFFFF',
    padding: '8px 20px 8px 20px',
    backgroundColor: '#9dcb6a',
    '&:hover': {
      backgroundColor: '#9dcb6a'
    }
  },
  errorMsg: {
    fontSize: '14px',
    color: '#EF5350'
  },

  buttonAlignment: {
    marginBottom: '6px',
    paddingTop: '15px',
    textAlign: 'center'
  },
  titleUnderline: {
    textDecoration: 'underline',
    // textUnderlinePosition : 'under',
    marginBottom: 15,
    color: '#4A83FB'
  },
  fntClr: {
    color: '#616161'
  },
  floatingLabelFocusStyle: {
    color: '#616161',
    fontSize: 21,
    '&$focused': {
      color: 'black'
    }
  },
  focused: {},
  notchedOutline: {
    borderWidth: '0px',
    borderColor: '#ffff',
    color: 'rgb(61, 158, 116)'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff'
  },
  taxIncluded: {
    marginRight: '10px',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 500,
    color: '#616161'
  },
  addRawMatButton: {
    background: '#FF0000',
    width: '86%',
    color: 'white',
    border: '#9DCB6A',
    padding: '5.5px',
    textTransform: 'capitalize',
    '&:hover': {
      background: '#FF0000',
      color: 'white'
    }
  },
  inputNumber: {
    '& input[type=number]': {
      '-moz-appearance': 'textfield'
    },
    '& input[type=number]::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '& input[type=number]::-webkit-inner-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    }
  },
  batchTable: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    borderCollapse: 'collapse',
    width: '100%'
  },
  rowstyle: {
    border: '1px solid #ddd',
    padding: '8px'
  },
  headstyle: {
    paddingTop: '12px',
    paddingBottom: '12px',
    textAlign: 'left',
    backgroundColor: '#EF5350',
    color: 'white'
  }
}));
const DialogTitle = withStyles((theme) => ({
  root: {
    '& h2': {
      fontSize: '22px'
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
    marginTop: 0,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  }
}))(MuiDialogActions);

const ProdServSwitch = styled(Switch)({
  '& .MuiSwitch-track': {
    backgroundColor: 'red'
  },
  '& .MuiSwitch-switchBase': {
    '&:not(.Mui-checked)': {
      color: 'red'
    }
  }
});

const ProductModal = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const [subcategory, setSubcategory] = React.useState('');

  const [state, setState] = React.useState({
    pos: true,
    online: true
  });
  const fileInputRef = useRef(null);

  const handleSubCategory = (event) => {
    setSubcategory(event.target.value);
  };

  let allInputs = { imgUrl: '' };
  const [imageAsFile, setImageAsFile] = useState('');
  const [imageAsUrl, setImageAsUrl] = useState(allInputs);
  // start Document Upload
  const [pdfImageAsFile, setPdfImageAsFile] = useState('');

  // end Document Upload
  const [secondaryImageAsFile, setSecondaryImageAsFile] = useState('');
  const [secondaryImageAsUrl, setSecondaryImageAsUrl] = useState([]);
  const [isCategoryError, setCategoryErrorStatus] = React.useState(false);
  const [isSubCategoryError, setSubCategoryErrorStatus] = React.useState(false);
  const [openNoImageAlert, setNoImageAlert] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isRestaurant, setIsRestaurants] = React.useState(false);
  const [isBatchProduct, setisBatchProduct] = useState(false);
  const [isSerialProduct, setisSerialProduct] = useState(false);
  const [openBatchAlert, setOpenBatchAlert] = React.useState(false);
  const [primaryUnitList] = useState(unitHelper.getUnits());
  const [secondaryUnitList] = useState(unitHelper.getUnits());
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [productNameExistsAlert, setProductNameExistsAlert] = useState(false);
  const [saveParams, setSaveParams] = useState(false);
  const [saveOffline, setSaveOffline] = useState(false);
  const [isJewellery, setIsJewellery] = React.useState(false);
  const [Tabvalue, setTabValue] = React.useState(0);
  const [headerVal, setHeaderVal] = React.useState('Basic');
  const [metalList, setMetalList] = React.useState();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setHeaderVal('Basic Info');
    }
    if (newValue === 1) {
      setHeaderVal('Price');
    }
    if (newValue === 2) {
      setHeaderVal('Other Info');
    }
    if (newValue === 3) {
      setHeaderVal('Batch/Serial');
    }
  };

  const [warehouseList, setWarehouseList] = React.useState([]);
  const { getWarehouse } = stores.WarehouseStore;

  const handleNoImageAlertClose = () => {
    setNoImageAlert(false);
  };

  const handleNoUnitQtyAlertClose = () => {
    setErrorMessage('');
    setOpenErrorAlert(false);
  };

  const handleProductNameExistsAlertClose = () => {
    setProductNameExistsAlert(false);
  };

  const handleProductNameExistsAlertProceed = () => {
    if (saveOffline) {
      saveOfflineProduct(saveParams);
    } else {
      handleFireBaseUpload(saveOffline);
    }
    setProductNameExistsAlert(false);
  };

  const handleChange = (event) => {
    // console.log('Handle state change', event.target.checked);
    setState({ ...state, [event.target.name]: event.target.checked });
    setProductOnlineOffLine(event.target.name, event.target.checked);
  };

  /******** Is Batch Product handle Change ******/
  const handleisBatchProduct = (e) => {
    setisBatchProduct(e.target.checked);
    if (e.target.checked && isProductUpdated) {
      setOpenBatchAlert(true);
    }
    if (e.target.checked) {
      setProductProperty('isBatchProduct', true);
      setisSerialProduct(false);
    } else {
      setProductProperty('isBatchProduct', false);
    }
  };
  const handleisSerialProduct = (e) => {
    setisSerialProduct(e.target.checked);
    if (e.target.checked && isProductUpdated) {
      setOpenBatchAlert(true);
    }
    if (e.target.checked) {
      setProductProperty('isSerialProduct', true);
      setisBatchProduct(false);
    } else {
      setProductProperty('isSerialProduct', false);
    }
  };

  const handleCloseBatchAlert = () => {
    setOpenBatchAlert(false);
  };

  const handleBatchAlertYes = () => {
    setProductProperty('openingStockQty', 0);
    setProductProperty('freeQty', 0);
    setProductProperty('stockQty', 0);
    clearExistingProductStock();
    setOpenBatchAlert(false);
  };

  const handleBatchAlertNo = () => {
    setisBatchProduct(false);
    setOpenBatchAlert(false);
  };

  const {
    productDialogOpen,
    productDetail,
    level2CategoriesList,
    level3CategoriesList,
    isProductUpdated,
    openLoader,
    productTxnEnableFieldsMap,
    productTxnSettingsData,
    isProductComingFromRawMaterials,
    addOnsDialogOpen
  } = toJS(stores.ProductStore);

  const {
    handleAddProductModalOpen,
    handleProductModalClose,
    setProductProperty,
    saveProduct,
    resetLevel2AndLevel3Categories,
    getBusinessLevel3Categorieslist,
    setProductOnlineOffLine,
    setProductLevel2Category,
    setProductLevel3Category,
    setDefaultBatchProperty,
    setOpenLoader,
    setSaleDiscountAmount,
    setSaleDiscountPercent,
    setPurchaseDiscountAmount,
    setPurchaseDiscountPercent,
    setProductSecondaryUnit,
    setProductPrimaryUnit,
    clearExistingProductStock,
    isProductNameAvailable,
    viewOrEditBatchItem,
    deleteBatchItem,
    openAddOnModal,
    viewOrEditAddon,
    removeAddonGroup,
    setDailyRate,
    setGrossWeight,
    setStoneWeight
  } = stores.ProductStore;
  const [openCloseDialog, setCloseDialogAlert] = React.useState(false);

  const { openRawMaterialModal } = stores.RawMaterialsStore;
  const { rawMaterialOpenDialog } = toJS(stores.RawMaterialsStore);

  const handleCloseDialogClose = () => {
    setCloseDialogAlert(false);
  };

  useEffect(() => {
    async function fetchData() {
      setWarehouseList(await getWarehouse());
    }

    console.log('productDetail', productDetail);

    fetchData();
  }, []);

  const { getProductTransSettingdetails } =
    stores.ProductTransactionSettingsStore;

  const checkCloseDialog = () => {
    if (
      (productDetail.name === '' &&
        productDetail.categoryLevel2.name === '' &&
        productDetail.categoryLevel3.name === '' &&
        productDetail.brandName === '' &&
        productDetail.purchasedPrice === '' &&
        productDetail.salePrice === '' &&
        productDetail.sku === '' &&
        productDetail.hsn === '' &&
        productDetail.barcode === '' &&
        productDetail.cgst === '' &&
        productDetail.sgst === '' &&
        productDetail.igst === '' &&
        productDetail.cess === '' &&
        productDetail.stockReOrderQty === '' &&
        productDetail.batchNumber === '' &&
        !productDetail.mfDate &&
        !productDetail.expiryDate &&
        productDetail.warehouseData === '' &&
        productDetail.rack === '' &&
        productDetail.description === '' &&
        productDetail.imageUrl === '') ||
      isProductUpdated
    ) {
      handleProductModalClose();
    } else {
      setCloseDialogAlert(true);
    }
    // let items =[];
    // if((items.length === 1 && items[0].item_name === '') || isProductUpdated){
    //   handleProductModalClose()
    // }
    // else{
    //   setCloseDialogAlert(true)
    // }
  };

  const checkProductNameExistsAndProceedToSave = async (params, isOffline) => {
    setSaveParams(params);
    setSaveOffline(isOffline);
    if (!isProductUpdated) {
      let isProductNameExists = await isProductNameAvailable(
        productDetail.name
      );

      if (isProductNameExists) {
        setProductNameExistsAlert(true);
      } else {
        if (isOffline === true) {
          saveOfflineProduct(params);
        } else {
          handleFireBaseUpload(params);
        }
      }
    } else {
      if (isOffline === true) {
        saveOfflineProduct(params);
      } else {
        handleFireBaseUpload(params);
      }
    }
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

  const handleSecondaryImageAsFile = (e) => {
    const image = e.target.files[0];
    setSecondaryImageAsFile((imageFile) => image);
  };

  const saveOfflineProduct = (params) => {
    const status = params;
    setProductOnlineOffLine('online', false);

    setProductProperty('imageUrl', '');
    if (status) {
      saveAndNewDataClick(true);
    } else {
      saveDataClick(false);
    }
  };

  const handleFireBaseUpload = (params) => {
    const status = params;

    setOpenLoader(true);

    if (productDetail.isOnLine) {
      if (isProductUpdated) {
        if (productDetail.imageUrl) {
          if (productDetail.imageUrl === '') {
            setProductProperty('imageUrl', '');
          } else {
            setProductProperty('imageUrl', productDetail.imageUrl);
          }
          // Continue to Save
          if (status) {
            saveAndNewDataClick(true);
          } else {
            saveDataClick(false);
          }
          return;
        } else if (imageAsFile === '') {
          //show Alert
          setOpenLoader(false);
          setNoImageAlert(true);
          return;
        }
      } else {
        if (imageAsFile === '') {
          //show Alert
          setOpenLoader(false);
          setNoImageAlert(true);
          return;
        }
      }
    }

    if (
      productDetail.isOffLine &&
      !productDetail.isOnLine &&
      imageAsFile === ''
    ) {
      if (productDetail.imageUrl === '') {
        setProductProperty('imageUrl', '');
      } else {
        setProductProperty('imageUrl', productDetail.imageUrl);
      }
      if (status) {
        saveAndNewDataClick(true);
      } else {
        saveDataClick(false);
      }
    } else {
      if (imageAsFile === '') {
        setOpenLoader(false);
        return;
      }

      const uploadTask = storage
        .ref(`/pos/${imageAsFile.name}`)
        .put(imageAsFile);
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
            .child(imageAsFile.name)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              setImageAsUrl((prevObject) => ({
                ...prevObject,
                imgUrl: fireBaseUrl
              }));
              // console.log('print Image Url before saving::', fireBaseUrl);
              setProductProperty('imageUrl', fireBaseUrl);
              if (status) {
                saveAndNewDataClick(true);
              } else {
                saveDataClick(false);
              }
            });
        }
      );
    }
  };

  const handlePDFFileUpload = (e) => {
    const pdfFile = e.target.files[0];
    if (!pdfFile) {
      return;
    }
    if (pdfFile.size > MAX_SIZE) {
      setPdfImageAsFile(null);
      toast.error('File is too large. Please upload a file smaller than 5MB.', {
        position: toast.POSITION.BOTTOM_CENTER,
        autoClose: true
      });
      return;
    }
    setPdfLoading(true);
    setPdfImageAsFile(null);
    const uploadTask = storage.ref(`/PDF/${pdfFile.name}`).put(pdfFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // // Handle progress
        const progress = Math.floor(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        // console.log('Upload is ' + progress + '% done');
        setUploadProgress(progress);
      },
      (error) => {
        console.error('Error uploading PDF:', error);
      },
      () => {
        storage
          .ref('PDF')
          .child(pdfFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            console.log(
              'PDF uploaded successfully. Download URL:',
              fireBaseUrl
            );
            setPdfLoading(false);
            setProductProperty('pdfImageUrl', fireBaseUrl);
            const name = getFileNameFromURL(productDetail.pdfImageUrl);

            setPdfImageAsFile((prevObject) => ({
              ...prevObject,
              name: name
            }));
          })
          .catch((error) => {
            setPdfLoading(false);
            console.error('Error getting download URL:', error);
          });
      }
    );
  };

  const handleClearFile = () => {
    setPdfImageAsFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      setProductProperty('pdfImageUrl', '');
    }
  };

  const handleDownload = () => {
    const url = productDetail.pdfImageUrl;
    fetch(url)
      .then((response) => {
        // Return the response as a blob
        return response.blob();
      })
      .then((blob) => {
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobURL;
        a.download = getFileNameFromURL(url);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobURL);
      })
      .catch((error) => {
        console.error('Error downloading PDF:', error);
      });
  };

  const saveDataClick = () => {
    if (productDetail.unitConversionQty === '') {
      productDetail.unitConversionQty = 0;
    }

    if (
      productDetail.primaryUnit &&
      productDetail.primaryUnit !== undefined &&
      productDetail.primaryUnit !== null &&
      productDetail.primaryUnit.fullName !== '' &&
      productDetail.secondaryUnit &&
      productDetail.secondaryUnit !== undefined &&
      productDetail.secondaryUnit !== null &&
      productDetail.secondaryUnit.fullName !== '' &&
      (productDetail.unitConversionQty === 0 ||
        productDetail.unitConversionQty === '')
    ) {
      setOpenLoader(false);
      setErrorMessage('Unit quantity cannot be left blank!');
      setOpenErrorAlert(true);
      return;
    }

    if (
      productDetail.primaryUnit &&
      productDetail.primaryUnit !== undefined &&
      productDetail.primaryUnit !== null &&
      productDetail.primaryUnit.fullName !== '' &&
      productDetail.secondaryUnit &&
      productDetail.secondaryUnit !== undefined &&
      productDetail.secondaryUnit !== null &&
      productDetail.secondaryUnit.fullName !== '' &&
      productDetail.primaryUnit.fullName ===
        productDetail.secondaryUnit.fullName
    ) {
      setOpenLoader(false);
      setErrorMessage('Primary and Secondary units cannot be same');
      setOpenErrorAlert(true);
      return;
    }

    if (productDetail.hsn !== '') {
      if (
        productDetail.hsn.length === 4 ||
        productDetail.hsn.length === 6 ||
        productDetail.hsn.length === 8
      ) {
        // do nothing
      } else {
        setOpenLoader(false);
        setErrorMessage('Please enter valid HSN code. Code length is invalid');
        setOpenErrorAlert(true);
        return;
      }
    }

    if (productDetail.purchasedPrice === '') {
      productDetail.purchasedPrice = 0;
    }

    if (productDetail.salePrice === '') {
      productDetail.salePrice = 0;
    }

    setImageAsFile('');
    saveProduct(false);
  };

  const saveAndNewDataClick = () => {
    if (productDetail.unitConversionQty === '') {
      productDetail.unitConversionQty = 0;
    }

    if (
      productDetail.primaryUnit &&
      productDetail.primaryUnit !== undefined &&
      productDetail.primaryUnit !== null &&
      productDetail.primaryUnit.fullName !== '' &&
      productDetail.secondaryUnit &&
      productDetail.secondaryUnit !== undefined &&
      productDetail.secondaryUnit !== null &&
      productDetail.secondaryUnit.fullName !== '' &&
      (productDetail.unitConversionQty === 0 ||
        productDetail.unitConversionQty === '')
    ) {
      setOpenLoader(false);
      setErrorMessage('Unit quantity cannot be left blank!');
      setOpenErrorAlert(true);
    } else if (
      productDetail.primaryUnit &&
      productDetail.primaryUnit !== undefined &&
      productDetail.primaryUnit !== null &&
      productDetail.primaryUnit.fullName !== '' &&
      productDetail.secondaryUnit &&
      productDetail.secondaryUnit !== undefined &&
      productDetail.secondaryUnit !== null &&
      productDetail.secondaryUnit.fullName !== '' &&
      productDetail.primaryUnit.fullName ===
        productDetail.secondaryUnit.fullName
    ) {
      setOpenLoader(false);
      setErrorMessage('Primary and Secondary units cannot be same');
      setOpenErrorAlert(true);
    } else {
      if (productDetail.purchasedPrice === '') {
        productDetail.purchasedPrice = 0;
      }

      if (productDetail.salePrice === '') {
        productDetail.salePrice = 0;
      }

      setImageAsFile('');
      saveProduct(true);
    }
  };

  const handleSecondaryImageFireBaseUpload = () => {
    if (secondaryImageAsFile.length === 0) {
      return;
    }
    const uploadTask = storage
      .ref(`/pos/${secondaryImageAsFile.name}`)
      .put(secondaryImageAsFile);
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
          .child(secondaryImageAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setSecondaryImageAsUrl((prevObject) => [
              ...prevObject,
              { imgUrl: fireBaseUrl }
            ]);
          });
      }
    );
  };

  const handleCategoryChange = async (event) => {
    // setLevel2Category(event);
    setProductLevel2Category(event);
    setCategoryErrorStatus(false);
    await getBusinessLevel3Categorieslist(event.name);
  };

  const handleChangeSubCategory = (event) => {
    console.log(event);
    // setLevel3Category(event);
    setProductLevel3Category(event);
    setSubCategoryErrorStatus(false);
  };

  useEffect(() => {
    if (productDialogOpen === true) {
      setisBatchProduct(false);
      setTabValue(0);
    }
  }, [productDialogOpen]);

  useEffect(() => {
    setImageAsFile('');
    resetLevel2AndLevel3Categories();
    setisBatchProduct(false);
  }, [resetLevel2AndLevel3Categories]);

  useEffect(() => {
    if (localStorage.getItem('isHotelOrRestaurant')) {
      let isHotelOrRestaurant = localStorage.getItem('isHotelOrRestaurant');
      if (String(isHotelOrRestaurant).toLowerCase() === 'true') {
        setIsRestaurants(true);
      }
    }
    if (localStorage.getItem('isJewellery')) {
      let isJewellery = localStorage.getItem('isJewellery');
      if (String(isJewellery).toLowerCase() === 'true') {
        setIsJewellery(true);
      }
    }
  }, []);

  useEffect(() => {
    setImageAsUrl(productDetail.imageUrl);
  }, [productDetail.imageUrl]);

  useEffect(() => {
    productDetail.secondaryImageUrls = secondaryImageAsUrl;
  }, [secondaryImageAsUrl]);

  // useEffect(() => {
  //   handleFireBaseUpload();
  // }, [imageAsFile]);

  useEffect(() => {
    handleSecondaryImageFireBaseUpload();
  }, [secondaryImageAsFile]);

  useEffect(() => {
    setImageAsUrl((prevObject) => ({
      ...prevObject,
      imgUrl:
        productDetail.imageUrl.imgUrl === '' || productDetail.imageUrl.imgUrl
          ? productDetail.imageUrl.imgUrl
          : productDetail.imageUrl
    }));
  }, [productDetail.imageUrl]);

  useEffect(() => {
    if (productDetail.pdfImageUrl) {
      const name = getFileNameFromURL(productDetail.pdfImageUrl);
      setPdfImageAsFile((prevObject) => ({
        ...prevObject,
        name: name
      }));
    } else {
      setPdfImageAsFile(null);
    }
  }, [productDetail.pdfImageUrl]);

  const getFileNameFromURL = (url) => {
    const parts = url.split('%2F');
    const filenamePart = parts[parts.length - 1];
    const filename = filenamePart.split('?')[0];
    return filename;
  };

  const getRates = async () => {
    const db = await Db.get();
    const businessData = await Bd.getBusinessData();

    const query = db.rates.find({
      selector: {
        businessId: { $eq: businessData.businessId }
      }
    });

    await query.exec().then((data) => {
      if (!data) {
        return;
      }

      if (data && data.length > 0) {
        let rateList = data.map((item) => item.toJSON());
        setMetalList(rateList);
      }
    });
  };

  useEffect(() => {
    const isJewellery = localStorage.getItem('isJewellery');
    if (isJewellery === 'true' || isJewellery === true) {
      getRates();
    }
  }, []);

  const styles = {
    floatingLabelFocusStyle: {
      color: 'black'
    }
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

  const taxTypeList = [
    'CGST - SGST',
    'IGST',
    'Nil-Rated',
    'Non-GST',
    'Zero-Rated',
    'Exempted'
  ];

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`
    };
  }
  // console.log('-------prod details--------------', productDetail);
  return (
    <div>
      <Controls.Button
        text={'Add ' + getProductName()}
        size="small"
        autoFocus={true}
        variant="contained"
        color="secondary"
        className={classes.addProductButton}
        onClick={() => handleAddProductModalOpen()}
      />
      <Dialog
        open={productDialogOpen}
        fullWidth={true}
        maxWidth={'lg'}
        onClose={checkCloseDialog}
      >
        <DialogTitle id="product-modal-title">
          {'Add ' + getProductName()}
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={checkCloseDialog}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.productModalContent}>
          <AppBar position="static">
            <Tabs value={Tabvalue} onChange={handleTabChange} aria-label="">
              <Tab label="Basic Info" {...a11yProps(0)} />
              <Tab label="Price" {...a11yProps(1)} />
              <Tab label="Stock, Batch/Serial" {...a11yProps(2)} />
              <Tab label="Other Info" {...a11yProps(3)} />
              <Tab label="Add Ons" {...a11yProps(4)} />
            </Tabs>
          </AppBar>
          {Tabvalue === 0 && (
            <>
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid
                  item
                  xs={6}
                  className="grid-padding"
                  style={{
                    paddingTop: '7px',
                    paddingLeft: '0px',
                    display: 'flex',
                    flexDirection: 'row'
                  }}
                >
                  <Grid item xs={2} className="grid-padding">
                    <Typography
                      style={
                        productDetail.productType === 'Product'
                          ? { fontWeight: 'bold' }
                          : { fontWeight: 'normal' }
                      }
                      variant="subtitle1"
                      className={classes.fntClr}
                    >
                      Product
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    className="grid-padding"
                    style={{ textAlign: 'end', marginTop: '-5px' }}
                  >
                    <FormControlLabel
                      control={
                        <ProdServSwitch
                          checked={
                            productDetail.productType === 'Product' ||
                            productDetail.productType === null
                              ? false
                              : true
                          }
                          onChange={(e) => {
                            if (e.target.checked === true) {
                              setProductProperty('productType', 'Service');
                            } else {
                              setProductProperty('productType', 'Product');
                            }
                          }}
                          name="switchProductType"
                        />
                      }
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Typography
                      style={
                        productDetail.productType === 'Service'
                          ? { fontWeight: 'bold' }
                          : { fontWeight: 'normal' }
                      }
                      variant="subtitle1"
                      className={classes.fntClr}
                    >
                      Service
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                {!isProductUpdated && !window.navigator.onLine && (
                  <Typography
                    variant="h4"
                    style={{ marginBottom: '20px', color: 'red' }}
                  >
                    No Network! Please switch on your internet to upload online
                    products.
                  </Typography>
                )}

                <Grid item md={9} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <TextField
                      required
                      label="Product Name"
                      placeholder=""
                      margin="dense"
                      inputRef={(el) => (inputRef.current[1] = el)}
                      value={productDetail.name}
                      floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                      onChange={(event) =>
                        setProductProperty('name', event.target.value)
                      }
                      InputLabelProps={{
                        shrink: true,
                        className: classes.floatingLabelFocusStyle
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormGroup row className={classes.checkboxMarginTop}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          inputRef={(el) => (inputRef.current[2] = el)}
                          checked={productDetail.isOffLine}
                          onChange={handleChange}
                          name="pos"
                        />
                      }
                      label="POS"
                    />
                    {isProductUpdated ? (
                      <FormControlLabel
                        control={
                          <Checkbox
                            inputRef={(el) => (inputRef.current[3] = el)}
                            checked={productDetail.isOnLine}
                            onChange={handleChange}
                            name="online"
                          />
                        }
                        label="Online"
                      />
                    ) : (
                      <div>
                        {window.navigator.onLine ? (
                          <FormControlLabel
                            control={
                              <Checkbox
                                inputRef={(el) => (inputRef.current[3] = el)}
                                checked={productDetail.isOnLine}
                                onChange={handleChange}
                                name="online"
                              />
                            }
                            label="Online"
                          />
                        ) : (
                          <FormControlLabel
                            control={
                              <Checkbox
                                inputRef={(el) => (inputRef.current[3] = el)}
                                disabled={true}
                                checked={!productDetail.isOnLine}
                                onChange={handleChange}
                                name="online"
                              />
                            }
                            label="Online"
                          />
                        )}
                      </div>
                    )}
                  </FormGroup>
                </Grid>
              </Grid>
              {/* ******** Basic Information ********** */}
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography variant="h5" className={classes.titleUnderline}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid container direction="row" alignItems="stretch">
                  <Grid item md={4} sm={12} className="grid-padding">
                    <FormControl
                      fullWidth
                      className={classes.fullWidth}
                      variant="outlined"
                    >
                      {!isProductUpdated && !isProductComingFromRawMaterials ? (
                        <Select
                          required
                          displayEmpty
                          value={productDetail.categoryLevel2.displayName}
                          input={<Input />}
                          disableUnderline
                          className={classes.selectFont}
                        >
                          <MenuItem disabled value="">
                            {productDetail.categoryLevel2.displayName
                              ? productDetail.categoryLevel2.displayName
                              : 'Choose Category'}
                          </MenuItem>
                          {level2CategoriesList.map((c) => (
                            <MenuItem
                              key={c.name}
                              value={c.displayName}
                              onClick={() => handleCategoryChange(c)}
                            >
                              {c.displayName}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <TextField
                          readOnly={true}
                          margin="dense"
                          value={productDetail.categoryLevel2.displayName}
                          variant="outlined"
                        />
                      )}
                    </FormControl>
                    {isCategoryError && (
                      <Typography
                        variant="subtitle1"
                        className={[classes.fntClr, classes.errorMsg]}
                      >
                        *Please choose a Category{' '}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item md={4} sm={12} className="grid-padding">
                    <FormControl
                      fullWidth
                      className={classes.fullWidth}
                      variant="outlined"
                    >
                      {!isProductUpdated && !isProductComingFromRawMaterials ? (
                        <Select
                          required
                          displayEmpty
                          value={productDetail.categoryLevel3.displayName}
                          input={<Input />}
                          disableUnderline
                          className={classes.selectFont}
                        >
                          <MenuItem disabled value="">
                            {productDetail.categoryLevel3.displayName
                              ? productDetail.categoryLevel3.displayName
                              : 'Choose Sub Category'}
                          </MenuItem>
                          {level3CategoriesList.map((c) => (
                            <MenuItem
                              key={c.name}
                              value={c.displayName}
                              onClick={() => handleChangeSubCategory(c)}
                            >
                              {c.displayName}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <TextField
                          readOnly={true}
                          margin="dense"
                          value={productDetail.categoryLevel3.displayName}
                          variant="outlined"
                        />
                      )}
                    </FormControl>
                    {isSubCategoryError && (
                      <Typography
                        variant="subtitle1"
                        className={[classes.fntClr, classes.errorMsg]}
                      >
                        *Please Choose a Sub Category{' '}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  className={classes.marginTopFormGroup}
                >
                  <Grid item md={4} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography
                        variant="subtitle1"
                        className={classes.fntClr}
                      >
                        Brand
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        inputRef={(el) => (inputRef.current[6] = el)}
                        className={classes.fntClr}
                        value={productDetail.brandName}
                        onChange={(event) =>
                          setProductProperty('brandName', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography
                        variant="subtitle1"
                        className={classes.fntClr}
                      >
                        Short Cut Product Code
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        inputRef={(el) => (inputRef.current[6] = el)}
                        className={classes.fntClr}
                        value={productDetail.shortCutCode}
                        onChange={(event) =>
                          setProductProperty('shortCutCode', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={4} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography
                        variant="subtitle1"
                        className={classes.fntClr}
                      >
                        SKU
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="text"
                        inputRef={(el) => (inputRef.current[12] = el)}
                        className={classes.fntClr}
                        value={productDetail.sku}
                        onChange={(event) =>
                          setProductProperty('sku', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>
                  
                </Grid>
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  className={classes.marginTopFormGroup}
                >           
                  <Grid item md={3} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography
                        variant="subtitle1"
                        className={classes.fntClr}
                      >
                        HSN
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="number"
                        inputRef={(el) => (inputRef.current[13] = el)}
                        className={classes.fntClr}
                        value={productDetail.hsn}
                        onChange={(event) =>
                          setProductProperty('hsn', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography
                        variant="subtitle1"
                        className={classes.fntClr}
                      >
                        Barcode
                      </Typography>
                      <TextField
                        fullWidth
                        autoFocus
                        disabled={
                          productTxnSettingsData.autoGenerateBarcode
                            ? true
                            : false
                        }
                        variant="outlined"
                        margin="dense"
                        inputRef={(el) => (inputRef.current[14] = el)}
                        className={classes.fntClr}
                        type="text"
                        value={
                          productTxnSettingsData.autoGenerateBarcode &&
                          productDetail.barcode === ''
                            ? 'Auto Generated'
                            : productDetail.barcode
                        }
                        onChange={(event) =>
                          setProductProperty('barcode', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>

                  <Grid item md={3} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography
                        variant="subtitle1"
                        className={classes.fntClr}
                      >
                        Model No
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        className={classes.fntClr}
                        type="text"
                        value={productDetail.modelNo}
                        onChange={(event) =>
                          setProductProperty('modelNo', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={3} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography
                        variant="subtitle1"
                        className={classes.fntClr}
                      >
                        Part Number
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        className={classes.fntClr}
                        type="text"
                        value={productDetail.partNumber}
                        onChange={(event) =>
                          setProductProperty('partNumber', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography variant="h5" className={classes.titleUnderline}>
                    Online Details
                  </Typography>
                </Grid>
                <Grid item sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Product Link
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      className={classes.fntClr}
                      type="text"
                      value={productDetail.onlineLink}
                      onChange={(event) =>
                        setProductProperty('onlineLink', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid
                  item
                  sm={12}
                  className="grid-padding"
                  style={{ marginTop: '16px' }}
                >
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Description
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      variant="outlined"
                      margin="dense"
                      inputRef={(el) => (inputRef.current[30] = el)}
                      className={classes.fntClr}
                      type="text"
                      rows={3}
                      value={productDetail.description}
                      onChange={(event) =>
                        setProductProperty('description', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid
                  item
                  sm={
                    pdfImageAsFile && pdfImageAsFile?.name?.length > 30
                      ? '4'
                      : '6'
                  }
                  className="grid-padding"
                >
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div
                      className={classes.primaryImageWrapper}
                      style={{ marginRight: '0px' }}
                    >
                      <img
                        src={
                          imageAsUrl.imgUrl
                            ? imageAsUrl.imgUrl
                            : '/static/images/upload_image.png'
                        }
                        width="60"
                        height="60"
                      />
                    </div>
                    <div style={{ height: '20px', width: '40px' }}>
                      <IconButton style={{ padding: '0px' }}>
                        <CloseIcon
                          style={{ widht: '15px', height: '15px' }}
                          onClick={() => {
                            setImageAsFile('');
                            setImageAsUrl(allInputs);
                          }}
                        />
                      </IconButton>
                    </div>
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
                        <span>Upload Primary Image</span>
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

                <Grid
                  item
                  sm={
                    pdfImageAsFile && pdfImageAsFile?.name?.length > 30
                      ? '8'
                      : '6'
                  }
                  className="grid-padding"
                >
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <Box
                      component="span"
                      className={classes.documentUploadButtonWrapper}
                    >
                      <label
                        htmlFor="product-doc-upload"
                        className="docUploadButton primaryDocImage"
                        style={{ position: 'static', cursor: 'pointer' }}
                      >
                        <i className="fa fa-upload fa-1 " aria-hidden="true" />
                        <span>Upload Document</span>
                      </label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePDFFileUpload}
                        id="product-doc-upload"
                        ref={fileInputRef}
                      />
                    </Box>
                    {pdfLoading && (
                      <div style={{ marginLeft: '10px' }}>
                        <LinearProgress
                          variant="determinate"
                          color="secondary"
                          style={{ width: '150px', backgroundColor: '#ecb8b3' }}
                          value={uploadProgress}
                        />
                        <p>{`${uploadProgress}%`}</p>
                      </div>
                    )}

                    {pdfImageAsFile && (
                      <div style={{ display: 'flex', marginLeft: '10px' }}>
                        <div
                          onClick={handleDownload}
                          style={{ cursor: 'pointer', display: 'flex' }}
                        >
                          <img
                            src={'/static/images/pdflogo.svg'}
                            width="25"
                            height="25"
                            style={{ marginRight: '5px' }}
                          />
                          <label
                            className={classes.fntClr}
                            style={{
                              whiteSpace: 'pre-wrap',
                              wordWrap: 'break-word',
                              wordBreak: 'break-all',
                              maxWidth: '380px'
                            }}
                          >
                            <p>{pdfImageAsFile ? pdfImageAsFile.name : ''}</p>
                          </label>
                        </div>
                        <IconButton
                          style={{ padding: '0px', marginLeft: '10px' }}
                        >
                          <CloseIcon
                            style={{ width: '20px', height: '20px' }}
                            onClick={() => {
                              handleClearFile();
                            }}
                          />
                        </IconButton>
                      </div>
                    )}
                  </div>
                </Grid>
                {/*---End - Document Upload------*/}
              </Grid>
            </>
          )}
          {Tabvalue === 1 && (
            <>
              {/* ******** Price Information ********** */}
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography variant="h5" className={classes.titleUnderline}>
                    Price Information
                  </Typography>
                </Grid>

                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      MRP
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      onWheel={(e) => e.target.blur()}
                      value={productDetail.finalMRPPrice}
                      onChange={(event) =>
                        setProductProperty('finalMRPPrice', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid
                  container
                  direction="row"
                  justify="center"
                  alignItems="stretch"
                >
                  <Grid item md={3} sm={12} className="grid-padding">
                    {/* <FormControl fullWidth>
                  <Typography variant="subtitle1" className={classes.fntClr}>
                    Offer Price (optional)
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    inputRef={(el) => (inputRef.current[9] = el)}
                    type="number"
                    className={classes.fntClr}
                    value={productDetail.offerPrice}
                    onChange={(event) => setOfferPrice(event.target.value)}
                  />
                </FormControl> */}
                  </Grid>
                </Grid>
              </Grid>

              {/* ******** Purchase Detais ********** */}
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography variant="h5" className={classes.titleUnderline}>
                    Purchase Details
                  </Typography>
                </Grid>
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Purchase Price
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      onWheel={(e) => e.target.blur()}
                      value={productDetail.purchasedPrice}
                      onChange={async (event) => {
                        let purVal =
                          event.target.value !== ''
                            ? parseFloat(event.target.value)
                            : '';

                        setProductProperty(
                          'purchasedPrice',
                          event.target.value
                        );

                        let actualValue =
                          parseFloat(purVal || 0) -
                          parseFloat(productDetail.purchaseDiscountAmount || 0);
                        if (actualValue !== '') {
                          let auditSettings =
                            await audit.getAuditSettingsData();
                          if (
                            auditSettings &&
                            auditSettings.taxRateAutofillList &&
                            auditSettings.taxRateAutofillList.length > 0
                          ) {
                            for (let taxRateObj of auditSettings.taxRateAutofillList) {
                              if (purVal >= taxRateObj.price) {
                                setProductProperty(
                                  'purchaseCgst',
                                  taxRateObj.tax / 2
                                );
                                setProductProperty(
                                  'purchaseSgst',
                                  taxRateObj.tax / 2
                                );
                                setProductProperty(
                                  'purchaseIgst',
                                  parseFloat(taxRateObj.tax)
                                );
                              }
                            }
                          }
                        } else {
                          setProductProperty('purchaseCgst', 0);
                          setProductProperty('purchaseSgst', 0);
                          setProductProperty('purchaseIgst', 0);
                        }
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Discount for Purchase
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
                          width: '45%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          className={clsx(classes.inputNumber, classes.fntClr)}
                          value={productDetail.purchaseDiscountAmount}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                ₹
                              </InputAdornment>
                            ),
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
                          onFocus={(e) =>
                            productDetail.purchaseDiscountAmount === 0
                              ? setPurchaseDiscountAmount('')
                              : ''
                          }
                          onChange={(e) =>
                            setPurchaseDiscountAmount(e.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
                      <div
                        style={{
                          width: '45%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          className={clsx(classes.inputNumber, classes.fntClr)}
                          value={productDetail.purchaseDiscountPercent}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment
                                position="start"
                                style={{ marginRight: '0px' }}
                              >
                                %
                              </InputAdornment>
                            ),
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
                          onFocus={(e) =>
                            productDetail.purchaseDiscountPercent === 0
                              ? setPurchaseDiscountPercent('')
                              : ''
                          }
                          onChange={(e) =>
                            setPurchaseDiscountPercent(e.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
                    </div>
                  </FormControl>
                </Grid>
              </Grid>

              {/* ******** Purchase Tax Detais ********** */}
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                {/* <Grid item md={12} sm={12} className="grid-padding">
              <Typography variant="h5" className={classes.titleUnderline}>
                Purchase Tax Details
              </Typography>
            </Grid> */}
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Tax Type
                    </Typography>
                    <Select
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      style={{ marginTop: '8px', marginBottom: '4px' }}
                      className="customTextField"
                      value={
                        productDetail.purchaseTaxType
                          ? productDetail.purchaseTaxType
                          : 'Select'
                      }
                      onChange={(event) => {
                        if (event.target.value !== 'Select') {
                          setProductProperty(
                            'purchaseTaxType',
                            event.target.value
                          );
                        } else {
                          setProductProperty('purchaseTaxType', '');
                        }
                      }}
                    >
                      <MenuItem value={'Select'}>{'Select'}</MenuItem>
                      {taxTypeList.map((e) => (
                        <MenuItem value={e}>{e}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Cgst
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      size="small"
                      disabled={
                        productDetail.purchaseTaxType === 'CGST - SGST' ||
                        productDetail.purchaseTaxType === ''
                          ? false
                          : true
                      }
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      onWheel={(e) => e.target.blur()}
                      value={productDetail.purchaseCgst}
                      onChange={(event) => {
                        setProductProperty('purchaseCgst', event.target.value);
                        setProductProperty('purchaseSgst', event.target.value);
                        setProductProperty(
                          'purchaseIgst',
                          parseFloat(event.target.value * 2)
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Sgst
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      size="small"
                      disabled={
                        productDetail.purchaseTaxType === 'CGST - SGST' ||
                        productDetail.purchaseTaxType === ''
                          ? false
                          : true
                      }
                      inputRef={(el) => (inputRef.current[16] = el)}
                      onWheel={(e) => e.target.blur()}
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      value={productDetail.purchaseSgst}
                      onChange={(event) => {
                        setProductProperty('purchaseSgst', event.target.value);
                        setProductProperty('purchaseCgst', event.target.value);
                        setProductProperty(
                          'purchaseIgst',
                          parseFloat(event.target.value * 2)
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Igst
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      size="small"
                      disabled={
                        productDetail.purchaseTaxType === 'IGST' ||
                        productDetail.purchaseTaxType === ''
                          ? false
                          : true
                      }
                      inputRef={(el) => (inputRef.current[17] = el)}
                      onWheel={(e) => e.target.blur()}
                      value={productDetail.purchaseIgst}
                      onChange={(event) => {
                        setProductProperty('purchaseIgst', event.target.value);
                        setProductProperty(
                          'purchaseSgst',
                          parseFloat(event.target.value / 2)
                        );
                        setProductProperty(
                          'purchaseCgst',
                          parseFloat(event.target.value / 2)
                        );
                      }}
                    />
                  </FormControl>
                </Grid>

                {productTxnEnableFieldsMap.get('enable_product_cess') && (
                  <Grid item md={3} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography
                        variant="subtitle1"
                        className={classes.fntClr}
                      >
                        Cess
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="number"
                        className={clsx(classes.inputNumber, classes.fntClr)}
                        size="small"
                        inputRef={(el) => (inputRef.current[18] = el)}
                        onWheel={(e) => e.target.blur()}
                        value={productDetail.purchaseCess}
                        onChange={(event) =>
                          setProductProperty('purchaseCess', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>
                )}

                <Grid item md={12} sm={12} className="grid-padding">
                  <FormGroup row className={classes.checkboxMarginTopTax}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="include purchase tax price"
                          value={productDetail.purchaseTaxIncluded}
                          onChange={(event) =>
                            setProductProperty(
                              'purchaseTaxIncluded',
                              event.target.value
                            )
                          }
                          checked={productDetail.purchaseTaxIncluded}
                        />
                      }
                      label="Is Tax Included in Purchase Price"
                    />
                  </FormGroup>
                </Grid>
              </Grid>

              {/* ******** Sales Detais ********** */}
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography variant="h5" className={classes.titleUnderline}>
                    Sales Details
                  </Typography>
                </Grid>

                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Selling Price
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      onWheel={(e) => e.target.blur()}
                      value={productDetail.salePrice}
                      onChange={async (event) => {
                        let saleVal = event.target.value;
                        setProductProperty('salePrice', event.target.value);

                        let actualValue =
                          parseFloat(saleVal || 0) -
                          parseFloat(productDetail.saleDiscountAmount || 0);

                        if (actualValue !== '') {
                          let auditSettings =
                            await audit.getAuditSettingsData();
                          if (
                            auditSettings &&
                            auditSettings.taxRateAutofillList &&
                            auditSettings.taxRateAutofillList.length > 0
                          ) {
                            for (let taxRateObj of auditSettings.taxRateAutofillList) {
                              if (saleVal >= taxRateObj.price) {
                                setProductProperty('cgst', taxRateObj.tax / 2);
                                setProductProperty('sgst', taxRateObj.tax / 2);
                                setProductProperty(
                                  'igst',
                                  parseFloat(taxRateObj.tax)
                                );
                              }
                            }
                          }
                        } else {
                          setProductProperty('cgst', 0);
                          setProductProperty('sgst', 0);
                          setProductProperty('igst', 0);
                        }
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Discount for Sales
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
                          width: '45%',
                          marginRight: '10px',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          value={productDetail.saleDiscountAmount}
                          className={clsx(classes.inputNumber, classes.fntClr)}
                          type="number"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment
                                position="start"
                                style={{ marginLeft: '0px' }}
                              >
                                ₹
                              </InputAdornment>
                            ),
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
                          onFocus={(e) =>
                            productDetail.saleDiscountAmount === 0
                              ? setSaleDiscountAmount('')
                              : ''
                          }
                          onChange={(e) =>
                            setSaleDiscountAmount(e.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
                      <div
                        style={{
                          width: '45%',
                          display: 'flex',
                          flexDirection: 'column'
                        }}
                      >
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          value={productDetail.saleDiscountPercent}
                          className={clsx(classes.inputNumber, classes.fntClr)}
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment
                                position="start"
                                style={{ marginRight: '0px' }}
                              >
                                %
                              </InputAdornment>
                            ),
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
                          onFocus={(e) =>
                            productDetail.saleDiscountPercent === 0
                              ? setSaleDiscountPercent('')
                              : ''
                          }
                          onChange={(e) =>
                            setSaleDiscountPercent(e.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </div>
                    </div>
                  </FormControl>
                </Grid>
              </Grid>

              {/* ******** Sales Tax Detais ********** */}
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                {/* <Grid item md={12} sm={12} className="grid-padding">
              <Typography variant="h5" className={classes.titleUnderline}>
                Sales Tax Details
              </Typography>
            </Grid> */}
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Tax Type
                    </Typography>
                    <Select
                      value={
                        productDetail.taxType ? productDetail.taxType : 'Select'
                      }
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      style={{ marginTop: '8px', marginBottom: '4px' }}
                      className="customTextField"
                      onChange={(event) => {
                        if (event.target.value !== 'Select') {
                          setProductProperty('taxType', event.target.value);
                        } else {
                          setProductProperty('taxType', '');
                        }
                      }}
                    >
                      <MenuItem value={'Select'}>{'Select'}</MenuItem>
                      {taxTypeList.map((e) => (
                        <MenuItem value={e}>{e}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Cgst
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      size="small"
                      disabled={
                        productDetail.taxType === 'CGST - SGST' ||
                        productDetail.taxType === ''
                          ? false
                          : true
                      }
                      inputRef={(el) => (inputRef.current[15] = el)}
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      onWheel={(e) => e.target.blur()}
                      value={productDetail.cgst}
                      onChange={(event) => {
                        setProductProperty('cgst', event.target.value);
                        setProductProperty('sgst', event.target.value);
                        setProductProperty(
                          'igst',
                          parseFloat(event.target.value * 2)
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Sgst
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      size="small"
                      disabled={
                        productDetail.taxType === 'CGST - SGST' ||
                        productDetail.taxType === ''
                          ? false
                          : true
                      }
                      inputRef={(el) => (inputRef.current[16] = el)}
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      onWheel={(e) => e.target.blur()}
                      value={productDetail.sgst}
                      onChange={(event) => {
                        setProductProperty('sgst', event.target.value);
                        setProductProperty('cgst', event.target.value);
                        setProductProperty(
                          'igst',
                          parseFloat(event.target.value * 2)
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item md={3} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Igst
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      size="small"
                      disabled={
                        productDetail.taxType === 'IGST' ||
                        productDetail.taxType === ''
                          ? false
                          : true
                      }
                      inputRef={(el) => (inputRef.current[17] = el)}
                      onWheel={(e) => e.target.blur()}
                      value={productDetail.igst}
                      onChange={(event) => {
                        setProductProperty('igst', event.target.value);
                        setProductProperty(
                          'sgst',
                          parseFloat(event.target.value / 2)
                        );
                        setProductProperty(
                          'cgst',
                          parseFloat(event.target.value / 2)
                        );
                      }}
                    />
                  </FormControl>
                </Grid>
                {productTxnEnableFieldsMap.get('enable_product_cess') && (
                  <Grid item md={3} sm={12} className="grid-padding">
                    <FormControl fullWidth>
                      <Typography
                        variant="subtitle1"
                        className={classes.fntClr}
                      >
                        Cess
                      </Typography>
                      <TextField
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        type="number"
                        className={clsx(classes.inputNumber, classes.fntClr)}
                        onWheel={(e) => e.target.blur()}
                        size="small"
                        inputRef={(el) => (inputRef.current[18] = el)}
                        value={productDetail.cess}
                        onChange={(event) =>
                          setProductProperty('cess', event.target.value)
                        }
                      />
                    </FormControl>
                  </Grid>
                )}

                <Grid item md={12} sm={12} className="grid-padding">
                  <FormGroup row className={classes.checkboxMarginTopTax}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="include tax price"
                          value={productDetail.taxIncluded}
                          inputRef={(el) => (inputRef.current[19] = el)}
                          onChange={(event) =>
                            setProductProperty(
                              'taxIncluded',
                              event.target.value
                            )
                          }
                          checked={productDetail.taxIncluded}
                        />
                      }
                      label="Is Tax Included in Sales Price"
                    />
                  </FormGroup>
                </Grid>
              </Grid>
            </>
          )}

          {Tabvalue === 2 && (
            <>
              <Grid
                container
                direction="row"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                {/************  Stock *********/}
                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography variant="h5" className={classes.titleUnderline}>
                    Total Stock
                  </Typography>
                </Grid>

                <Grid item md={12} sm={12} className="grid-padding">
                  <FormGroup row style={{ marginBottom: '0.8rem' }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={productDetail.enableQuantity}
                          inputRef={(el) => (inputRef.current[20] = el)}
                          onChange={(event) =>
                            setProductProperty(
                              'enableQuantity',
                              event.target.checked
                            )
                          }
                          name="Enable Quantity"
                        />
                      }
                      label="Enable Quantity"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12} sm={3} className="grid-padding">
                  <Typography variant="subtitle1" className={classes.fntClr}>
                    Stock
                  </Typography>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      disabled
                      inputRef={(el) => (inputRef.current[21] = el)}
                      style={{ background: '#F6F6F6' }}
                      variant="outlined"
                      margin="dense"
                      type="number"
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      value={parseFloat(productDetail.stockQty).toFixed(2)}
                      onChange={(event) =>
                        setProductProperty('stockQty', event.target.value)
                      }
                      InputProps={{
                        classes: {
                          root: classes.notchedOutline,
                          focused: classes.notchedOutline,
                          notchedOutline: classes.notchedOutline
                        }
                      }}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3} className="grid-padding">
                  <Typography variant="subtitle1" className={classes.fntClr}>
                    Opening Stock
                  </Typography>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      disabled={
                        isBatchProduct || productDetail.batchData.length > 0
                          ? true
                          : false
                      }
                      inputRef={(el) => (inputRef.current[22] = el)}
                      onWheel={(e) => e.target.blur()}
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      value={productDetail.openingStockQty}
                      onChange={(event) =>
                        setProductProperty(
                          'openingStockQty',
                          event.target.value
                        )
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Free Stock
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      disabled={
                        isBatchProduct || productDetail.batchData.length > 0
                          ? true
                          : false
                      }
                      margin="dense"
                      type="number"
                      inputRef={(el) => (inputRef.current[22] = el)}
                      onWheel={(e) => e.target.blur()}
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      value={productDetail.freeQty}
                      onChange={(event) =>
                        setProductProperty('freeQty', event.target.value)
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={3} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Re Order Qty
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      inputRef={(el) => (inputRef.current[22] = el)}
                      className={clsx(classes.inputNumber, classes.fntClr)}
                      value={productDetail.stockReOrderQty}
                      onChange={(event) =>
                        setProductProperty(
                          'stockReOrderQty',
                          event.target.value
                        )
                      }
                    />
                  </FormControl>
                </Grid>

                {!isProductComingFromRawMaterials && (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    style={{
                      paddingLeft: '15px',
                      paddingTop: '18px',
                      paddingBottom: '10px'
                    }}
                  >
                    <Controls.Button
                      text="Add Raw Materials"
                      size="small"
                      variant="contained"
                      color="secondary"
                      className={classes.addRawMatButton}
                      onClick={() => {
                        openRawMaterialModal(productDetail);
                      }}
                    />
                    {rawMaterialOpenDialog ? <RawMaterials /> : ' '}
                  </Grid>
                )}

                <Grid
                  item
                  xs={12}
                  sm={4}
                  className="grid-padding"
                  style={{
                    paddingTop: '18px',
                    paddingBottom: '10px'
                  }}
                >
                  <FormControlLabel
                    style={{ display: 'block' }}
                    control={
                      <Switch
                        checked={
                          isBatchProduct || productDetail.batchData.length > 0
                        }
                        onChange={(e) => {
                          if (productDetail.serialData.length === 0)
                            handleisBatchProduct(e);
                        }}
                        name="switchBatchProduct"
                      />
                    }
                    label="Is this a Batch Product ?"
                  />
                  <FormControlLabel
                    style={{ display: 'block' }}
                    control={
                      <Switch
                        checked={
                          isSerialProduct || productDetail.serialData.length > 0
                        }
                        onChange={(e) => {
                          if (productDetail.batchData.length === 0)
                            handleisSerialProduct(e);
                        }}
                        name="switchSerialProduct"
                      />
                    }
                    label="Enable Serial"
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={4}
                  style={{
                    paddingTop: '18px',
                    paddingBottom: '10px',
                    textAlign: 'end',
                    paddingRight: '15px'
                  }}
                >
                  {isBatchProduct || productDetail.batchData.length > 0 ? (
                    <BatchModal />
                  ) : (
                    ''
                  )}
                  {isSerialProduct || productDetail.serialData.length > 0 ? (
                    <SerialModal />
                  ) : (
                    ''
                  )}
                </Grid>
                {productDetail.batchData.length > 0 && (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    style={{
                      paddingTop: '18px',
                      paddingBottom: '10px',
                      textAlign: 'end',
                      paddingRight: '15px'
                    }}
                  >
                    <table className={`${classes.batchTable}`}>
                      <thead>
                        <tr>
                          {/* {ProductChosenProperties.length > 0 ? (
                        ProductChosenProperties.map((option) => (
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                            key={option.title}
                          >
                            {option.title}
                          </th>
                        ))
                      ) : (
                        singleBatchData.properties.map((option) => (
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                            key={option.title}
                          >
                            {option.title}
                          </th>
                        ))
                      )} */}
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                          >
                            Properties
                          </th>
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                          >
                            {String(
                              localStorage.getItem('isHotelOrRestaurant')
                            ).toLowerCase() === 'true'
                              ? 'Menu Type'
                              : 'Batch No'}
                          </th>
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                          >
                            Vendor Name
                          </th>
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                          >
                            Purchase Price
                          </th>
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                          >
                            Sale Price
                          </th>
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                          >
                            Qty
                          </th>
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                          >
                            Opening Stock
                          </th>
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                          >
                            Free Stock
                          </th>
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productDetail.batchData.map((batchData) => (
                          <tr>
                            {/* {batchData.properties.map((data) => (
                            <td
                              className={`${classes.rowstyle}`}
                              key={data.value}
                            >
                              {data.value}
                            </td>
                          ))} */}

                            <td className={`${classes.rowstyle}`}>
                              {batchData.properties.map((data, index) => (
                                <React.Fragment key={index}>
                                  <span>{data.value}</span>
                                  {index < batchData.properties.length - 1 && (
                                    <span> - </span>
                                  )}
                                </React.Fragment>
                              ))}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {batchData.batchNumber}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {batchData.vendorName}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {batchData.purchasedPrice}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {batchData.salePrice}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {batchData.qty}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {batchData.openingStockQty}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              {batchData.freeQty}
                            </td>
                            <td className={`${classes.rowstyle}`}>
                              <Button
                                size="small"
                                onClick={() => {
                                  viewOrEditBatchItem(batchData);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                color="secondary"
                                size="small"
                                onClick={() => {
                                  deleteBatchItem(batchData);
                                }}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Grid>
                )}

                {isProductComingFromRawMaterials && (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    style={{
                      paddingLeft: '15px',
                      paddingTop: '18px',
                      paddingBottom: '10px'
                    }}
                  ></Grid>
                )}

                {!(isBatchProduct || productDetail.batchData.length > 0) && (
                  <>
                    <Grid item xs={12} sm={3} className="grid-padding">
                      <FormControl fullWidth>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          Manufacturing Date
                        </Typography>
                        <TextField
                          id="manfDate"
                          type="date"
                          variant="outlined"
                          margin="dense"
                          className={classes.fntClr}
                          inputRef={(el) => (inputRef.current[25] = el)}
                          value={productDetail.mfDate}
                          onChange={(event) =>
                            setDefaultBatchProperty(
                              'mfDate',
                              event.target.value
                            )
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} className="grid-padding">
                      <FormControl fullWidth>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          Expiry Date
                        </Typography>
                        <TextField
                          id="expiryDate"
                          type="date"
                          variant="outlined"
                          inputRef={(el) => (inputRef.current[26] = el)}
                          margin="dense"
                          className={classes.fntClr}
                          value={productDetail.expiryDate}
                          onChange={(event) =>
                            setDefaultBatchProperty(
                              'expiryDate',
                              event.target.value
                            )
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} className="grid-padding">
                      <FormControl fullWidth>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          Warehouse Details
                        </Typography>
                        <Select
                          displayEmpty
                          className={classes.fntClr}
                          style={{ marginTop: '8px' }}
                          value={
                            productDetail.warehouseData
                              ? productDetail.warehouseData
                              : 'Select'
                          }
                          input={
                            <OutlinedInput
                              style={{ width: '100%', height: '80%' }}
                            />
                          }
                          onChange={async (e) => {
                            if (e.target.value !== 'Select') {
                              setDefaultBatchProperty(
                                'warehouseData',
                                e.target.value
                              );
                            } else {
                              setDefaultBatchProperty('warehouseData', '');
                            }
                          }}
                        >
                          <MenuItem value={'Select'}>{'Select'}</MenuItem>

                          {warehouseList &&
                            warehouseList.map((option, index) => (
                              <MenuItem value={option.name}>
                                {option.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={3} className="grid-padding">
                      <FormControl fullWidth>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          Rack Number
                        </Typography>
                        <TextField
                          id="rackNumber"
                          type="text"
                          variant="outlined"
                          margin="dense"
                          inputRef={(el) => (inputRef.current[29] = el)}
                          className={classes.fntClr}
                          value={productDetail.rack}
                          onChange={(event) =>
                            setDefaultBatchProperty('rack', event.target.value)
                          }
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}

                {/*  <Grid
              item
              xs={12}
              sm={3}
              className="grid-padding"
              style={{ paddingTop: '7px' }}
            >
              {isProductUpdated ? <AdjustmentModal /> : ''}
                    </Grid> */}

                <Grid item xs={12} sm={3}></Grid>
              </Grid>

              {!(isBatchProduct || productDetail.batchData.length > 0) && (
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  className={classes.marginTopFormGroup}
                ></Grid>
              )}
            </>
          )}

          {Tabvalue === 3 && (
            <>
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid item md={6} sm={12} className="grid-padding">
                  <FormControl fullWidth>
                    <Typography variant="subtitle1" className={classes.fntClr}>
                      Warranty Days
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      margin="dense"
                      type="number"
                      inputRef={(el) => (inputRef.current[12] = el)}
                      className={classes.fntClr}
                      value={productDetail.warrantyDays}
                      onChange={(event) =>
                        setProductProperty('warrantyDays', event.target.value)
                      }
                      onWheel={(e) => e.target.blur()}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              {/* ******** Unit Information ********** */}
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid item md={12} sm={12} className="grid-padding">
                  <Typography variant="h5" className={classes.titleUnderline}>
                    Unit Information
                  </Typography>
                </Grid>

                <Grid item md={2} sm={12} className="grid-padding">
                  <Typography variant="subtitle1">Primary Unit</Typography>
                  <Select
                    value={
                      productDetail.primaryUnit &&
                      productDetail.primaryUnit !== undefined &&
                      productDetail.primaryUnit !== null &&
                      productDetail.primaryUnit.fullName !== ''
                        ? productDetail.primaryUnit.fullName
                        : primaryUnitList[0].fullName
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'SELECT') {
                        setProductPrimaryUnit(e.target.value);
                      } else {
                        setProductPrimaryUnit(null);
                        setProductSecondaryUnit(null);
                      }
                    }}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    style={{ marginTop: '8px', marginBottom: '4px' }}
                    className="customTextField"
                  >
                    {primaryUnitList.map((option, index) => (
                      <MenuItem value={option.fullName}>
                        {option.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item md={2} sm={12} className="grid-padding">
                  <Typography variant="subtitle1">Secondary Unit</Typography>
                  <Select
                    disabled={productDetail.primaryUnit !== null ? false : true}
                    value={
                      productDetail.secondaryUnit &&
                      productDetail.secondaryUnit !== undefined &&
                      productDetail.secondaryUnit !== null &&
                      productDetail.secondaryUnit.fullName !== ''
                        ? productDetail.secondaryUnit.fullName
                        : secondaryUnitList[0].fullName
                    }
                    onChange={(e) => {
                      if (e.target.value !== 'SELECT') {
                        setProductSecondaryUnit(e.target.value);
                      } else {
                        setProductSecondaryUnit(null);
                      }
                    }}
                    fullWidth
                    variant="outlined"
                    margin="dense"
                    style={{ marginTop: '8px', marginBottom: '4px' }}
                    className="customTextField"
                  >
                    {secondaryUnitList.map((option, index) => (
                      <MenuItem value={option.fullName}>
                        {option.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {productDetail.primaryUnit &&
                  productDetail.primaryUnit !== undefined &&
                  productDetail.primaryUnit !== null &&
                  productDetail.primaryUnit.fullName !== '' &&
                  productDetail.secondaryUnit &&
                  productDetail.secondaryUnit !== undefined &&
                  productDetail.secondaryUnit !== null &&
                  productDetail.secondaryUnit.fullName !== '' && (
                    <Grid
                      item
                      md={8}
                      sm={12}
                      className="grid-padding"
                      style={{ marginTop: '40px' }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <Grid item xs={'auto'} className="grid-padding">
                          <Typography
                            style={{ fontWeight: 'bold' }}
                            variant="subtitle1"
                            className={classes.fntClr}
                          >
                            1 {productDetail.primaryUnit.fullName} =
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          className="grid-padding"
                          style={{ textAlign: 'end', marginTop: '-12px' }}
                        >
                          <FormControl fullWidth>
                            <TextField
                              fullWidth
                              variant="outlined"
                              margin="dense"
                              type="number"
                              className={classes.fntClr}
                              value={productDetail.unitConversionQty}
                              onChange={(event) =>
                                setProductProperty(
                                  'unitConversionQty',
                                  event.target.value
                                )
                              }
                              onWheel={(e) => e.target.blur()}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={'auto'}>
                          <Typography
                            style={{ fontWeight: 'bold' }}
                            variant="subtitle1"
                            className={classes.fntClr}
                          >
                            {productDetail.secondaryUnit.fullName}
                          </Typography>
                        </Grid>
                      </div>
                    </Grid>
                  )}
              </Grid>
              <Grid
                container
                direction="row"
                // justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                {metalList && metalList.length > 0 && (
                  <>
                    <Grid item md={12} sm={12} className="grid-padding">
                      <Typography
                        variant="h5"
                        className={classes.titleUnderline}
                      >
                        Daily Rate
                      </Typography>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <Select
                        value={
                          productDetail.rateData && productDetail.rateData.metal
                            ? productDetail.rateData.metal
                            : 'Select'
                        }
                        fullWidth
                        variant="outlined"
                        margin="dense"
                        style={{
                          marginTop: '8px',
                          marginBottom: '4px'
                        }}
                        className="customTextField"
                        onChange={(e) => {
                          let chosenValue = e.target.value;
                          if (chosenValue !== 'Select') {
                            let result = metalList.find(
                              (e) => e.metal === chosenValue
                            );

                            if (result) {
                              setDailyRate(result);
                            }
                          } else {
                            setDailyRate(null);
                          }
                        }}
                      >
                        <MenuItem value={'Select'}>{'Select'}</MenuItem>
                        {metalList.map((option, index) => (
                          <MenuItem value={option.metal} name={option.metal}>
                            {option.metal}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                  </>
                )}
              </Grid>
              {/* ******** Jewellery Information ********** */}
              {isJewellery && (
                <Grid
                  container
                  direction="row"
                  // justify="center"
                  alignItems="stretch"
                  className={classes.marginTopFormGroup}
                >
                  <Grid item md={12} sm={12} className="grid-padding">
                    <Typography variant="h5" className={classes.titleUnderline}>
                      Jewellery Information
                    </Typography>
                  </Grid>

                  <Grid container direction="row" alignItems="stretch">
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          GROSS WEIGHT/g
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.grossWeight}
                          onChange={(event) =>
                            setGrossWeight(event.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          STONE WEIGHT/g
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.stoneWeight}
                          onChange={(event) =>
                            setStoneWeight(event.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          NET WEIGHT/g
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.netWeight}
                          onChange={(event) =>
                            setProductProperty('netWeight', event.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth style={{ marginTop: '16px' }}>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          STONE CHARGE
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.stoneCharge}
                          onChange={(event) =>
                            setProductProperty(
                              'stoneCharge',
                              event.target.value
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth style={{ marginTop: '16px' }}>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          MAKING CHARGE/g
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.makingChargePerGram}
                          onChange={(event) =>
                            setProductProperty(
                              'makingChargePerGram',
                              event.target.value
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth style={{ marginTop: '16px' }}>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          PURITY
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="text"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.purity}
                          onChange={(event) =>
                            setProductProperty('purity', event.target.value)
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth style={{ marginTop: '16px' }}>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          WASTAGE (%)
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.wastagePercentage}
                          onChange={(event) =>
                            setProductProperty(
                              'wastagePercentage',
                              event.target.value
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth style={{ marginTop: '16px' }}>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          WASTAGE (g)
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.wastageGrams}
                          onChange={(event) =>
                            setProductProperty(
                              'wastageGrams',
                              event.target.value
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth style={{ marginTop: '16px' }}>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          Hallmark Charge
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.hallmarkCharge}
                          onChange={(event) =>
                            setProductProperty(
                              'hallmarkCharge',
                              event.target.value
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth style={{ marginTop: '16px' }}>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          Certification Charge
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="number"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.certificationCharge}
                          onChange={(event) =>
                            setProductProperty(
                              'certificationCharge',
                              event.target.value
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item md={4} sm={12} className="grid-padding">
                      <FormControl fullWidth style={{ marginTop: '16px' }}>
                        <Typography
                          variant="subtitle1"
                          className={classes.fntClr}
                        >
                          HUID
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          margin="dense"
                          type="text"
                          inputRef={(el) => (inputRef.current[12] = el)}
                          className={classes.fntClr}
                          value={productDetail.hallmarkUniqueId}
                          onChange={(event) =>
                            setProductProperty(
                              'hallmarkUniqueId',
                              event.target.value
                            )
                          }
                          onWheel={(e) => e.target.blur()}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </>
          )}

          {Tabvalue === 4 && (
            <>
              <Grid
                container
                direction="row"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid
                  item
                  xs={12}
                  sm={4}
                  style={{
                    paddingLeft: '15px',
                    paddingTop: '18px',
                    paddingBottom: '10px'
                  }}
                >
                  <Controls.Button
                    text="+ Add On Group"
                    size="small"
                    variant="contained"
                    color="secondary"
                    className={classes.addRawMatButton}
                    onClick={openAddOnModal}
                  />

                  {addOnsDialogOpen ? <ProductAddOns /> : ' '}
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                {productDetail.additional_property_group_list.map(
                  (option, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={4}
                      className={`grid-padding ${classes.mb_20}`}
                    >
                      <div
                        style={{
                          border: '1px solid #80808040',
                          marginTop: '10px',
                          padding: '10px'
                        }}
                      >
                        <Grid
                          className={classes.addOnlist}
                          container
                          justify="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6">{option.name}</Typography>
                          <div>
                            <IconButton
                              onClick={() => viewOrEditAddon(option, index)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => removeAddonGroup(index)}>
                              <DeleteIcon />
                            </IconButton>
                          </div>
                        </Grid>
                        {option.additional_property_list.map(
                          (additional, index1) => (
                            <Grid
                              className={classes.addOnlist}
                              container
                              justify="space-between"
                              alignItems="center"
                            >
                              <Typography style={{ fontSize: '13px' }}>
                                {additional.name}
                              </Typography>
                            </Grid>
                          )
                        )}
                      </div>
                    </Grid>
                  )
                )}
              </Grid>
            </>
          )}

          {/* <Grid
            container
            direction="row"
            justify="center"
            alignItems="stretch"
            className={classes.marginTopFormGroup}
          >
            <Grid item sm={12} className="grid-padding">
              <Box component="div" className="secondary-images">
                <Box
                  component="span"
                  className={classes.primaryImageButtonWrapper}
                >
                  <label
                    htmlFor="product-secondary-upload"
                    className="uploadImageButton"
                  >
                    <span>Upload Images</span>
                  </label>
                  <input
                    type="file"
                    onChange={handleSecondaryImageAsFile}
                    id="product-secondary-upload"
                  />
                </Box>
                {secondaryImageAsUrl.map((item, index) => (
                  <Box
                    component="div"
                    className={classes.primaryImageWrapper}
                    key={index}
                  >
                    <img src={item.imgUrl} width="50" height="50" />
                  </Box>
                ))}
              </Box>
            </Grid>
         
          </Grid>
         */}
        </DialogContent>
        {window.navigator.onLine ? (
          <DialogActions>
            <Controls.Button
              text="Save & New"
              size="small"
              variant="outlined"
              buttonRef={(el) => (inputRef.current[32] = el)}
              disabled={productDetail.name && !pdfLoading ? false : true}
              color="secondary"
              onClick={() =>
                productDetail.categoryLevel2.displayName
                  ? productDetail.categoryLevel3.displayName
                    ? checkProductNameExistsAndProceedToSave(true, false)
                    : setSubCategoryErrorStatus(true)
                  : setCategoryErrorStatus(true)
              }
            />
            <Controls.Button
              text="Save"
              size="small"
              disabled={productDetail.name && !pdfLoading ? false : true}
              variant="contained"
              color="secondary"
              style={{ color: 'white' }}
              buttonRef={(el) => (inputRef.current[33] = el)}
              onClick={() => {
                productDetail.categoryLevel2.displayName
                  ? productDetail.categoryLevel3.displayName
                    ? checkProductNameExistsAndProceedToSave(false, false)
                    : setSubCategoryErrorStatus(true)
                  : setCategoryErrorStatus(true);
              }}
            />
          </DialogActions>
        ) : (
          <DialogActions>
            <Controls.Button
              text="Save & New"
              size="small"
              variant="outlined"
              buttonRef={(el) => (inputRef.current[34] = el)}
              disabled={productDetail.name ? false : true}
              color="secondary"
              onClick={() =>
                productDetail.categoryLevel2.displayName
                  ? productDetail.categoryLevel3.displayName
                    ? checkProductNameExistsAndProceedToSave(true, true)
                    : setSubCategoryErrorStatus(true)
                  : setCategoryErrorStatus(true)
              }
            />
            <Controls.Button
              text="Save"
              size="small"
              buttonRef={(el) => (inputRef.current[35] = el)}
              disabled={productDetail.name ? false : true}
              variant="contained"
              color="secondary"
              style={{ color: 'white' }}
              onClick={() => {
                // console.log(imageAsUrl.imgUrl);
                productDetail.categoryLevel2.displayName
                  ? productDetail.categoryLevel3.displayName
                    ? checkProductNameExistsAndProceedToSave(false, true)
                    : setSubCategoryErrorStatus(true)
                  : setCategoryErrorStatus(true);
              }}
            />
          </DialogActions>
        )}
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openLoader}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the Product is being saved!!!</p>
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
        open={openCloseDialog}
        onClose={handleCloseDialogClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Product will not be saved, Do you want to close?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            autoFocus
            onClick={(e) => {
              handleCloseDialogClose();
              handleProductModalClose();
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
        fullScreen={fullScreen}
        open={openNoImageAlert}
        onClose={handleNoImageAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Please add Image for Online Product.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoImageAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openBatchAlert}
        onClose={handleCloseBatchAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ color: 'red' }}>
          {'Clear Stock'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure the existing stock count will be cleared ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBatchAlertYes}>Yes</Button>
          <Button onClick={handleBatchAlertNo} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openErrorAlert}
        onClose={handleNoUnitQtyAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{errorMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoUnitQtyAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={productNameExistsAlert}
        onClose={handleNoUnitQtyAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            Product Name already exists. Would you like to proceed to save
            product with same name?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleProductNameExistsAlertClose}
            color="primary"
            autoFocus
          >
            CANCEL
          </Button>
          <Button
            onClick={handleProductNameExistsAlertProceed}
            color="primary"
            autoFocus
          >
            PROCEED
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default injectWithObserver(ProductModal);