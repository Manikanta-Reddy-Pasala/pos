import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  Dialog,
  DialogContent,
  withStyles,
  IconButton,
  FormControl,
  TextField,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Typography,
  Button,
  InputAdornment,
  Select,
  OutlinedInput,
  MenuItem
} from '@material-ui/core';
import { Grid, Col } from 'react-flexbox-grid';
import Controls from '../../components/controls/index';
import Moreoptions from '../../components/MoreoptionsBatch';
import moreoption from '../../components/Options';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import CancelRoundedIcon from '@material-ui/icons/CancelRounded';
import injectWithObserver from '../../Mobx/Helpers/injectWithObserver';
import { useStore } from '../../Mobx/Helpers/UseStore';
import { toJS } from 'mobx';
import Arrowtopright from '../../icons/Arrowtopright';
import Arrowbottomleft from '../../icons/Arrowbottomleft';
import VendorModal from 'src/views/Vendors/modal/AddVendor';
import DialogContentText from '@material-ui/core/DialogContentText';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { getVendorAutoCompleteList } from 'src/components/Helpers/PartiesAutoCompleteQueryHelper';
import clsx from 'clsx';
import axios from 'axios';
import useWindowDimensions from 'src/components/windowDimension';
import './style.css';
import Loader from 'react-js-loader';

const useStyles = makeStyles((theme) => ({
  productModalContent: {
    padding: 'inherit',
    '& .grid-padding': {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
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
    marginTop: '2rem'
  },
  marginTopFormGroup: {
    marginTop: '1.25rem'
  },
  marginBtmSet: {
    marginBottom: '15px'
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
  errorMsg: {
    fontSize: '14px',
    color: '#EF5350'
  },
  addBatchButton: {
    background: '#9DCB6A',
    width: '86%',
    color: 'white',
    border: '#9DCB6A',
    padding: '5.5px',
    textTransform: 'capitalize',
    '&:hover': {
      background: '#9DCB6A',
      color: 'white'
    }
  },
  createNewBtn: {
    background: '#EF5350',
    color: 'white',
    border: '#EF5350',
    textTransform: 'capitalize',
    '&:hover': {
      background: '#EF5350',
      color: 'white'
    }
  },
  itemTable: {
    width: '100%'
  },
  agGridclass: {
    '& .ag-paging-panel': {
      fontSize: '10px',
      '& .ag-paging-row-summary-panel': {
        width: '52px'
      }
    }
  },
  bootstrapInput: {
    borderRadius: 2,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '5px 12px',
    width: 'calc(100% - 30px)',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: ['Nunito Sans, Roboto, sans-serif'].join(','),
    '&:focus': {
      borderColor: '#ff7961'
      // boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    }
  },
  bootstrapFormLabel: {
    fontSize: 16
  },
  input: {
    width: '30%'
  },
  listbox: {
    margin: 5,
    padding: 10,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
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
  stickyElement: {
    position: 'sticky'
  },
  leftCol: {
    fontFamily: 'Helvetica',
    fontSize: '18px',
    padding: 'initial'
  },
  leftpanelscroll: {
    fontFamily: 'Helvetica',
    fontSize: '18px',
    padding: 'initial'
  },
  contentCol: {
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '0.5em',
      borderRadius: 12
    },
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0,0,0,.1)'
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
  prop_button: {
    marginTop: '31px',
    marginLeft: '16px',
    color: '#fff'
  },
  prop_box: {
    padding: '10px',
    border: '1px solid grey',
    marginBottom: '2rem'
  },
  w_30: {
    width: '30%',
    display: 'inline-flex'
  },
  w_25: {
    width: '25%',
    display: 'inline-flex'
  },
  w_15: {
    width: '15%',
    display: 'inline-flex'
  },
  w_5: {
    width: '5%',
    display: 'inline-flex'
  },
  w_80: {
    width: '80%',
    display: 'inline-flex'
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

const BatchModal = (props) => {
  const classes = useStyles();
  const stores = useStore();
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [vendorList, setVendorList] = React.useState();
  const { height } = useWindowDimensions();
  const {
    productAddBatchDialogOpen,
    singleBatchData,
    isBatchUpdate,
    productTxnSettingsData,
    productDetail
  } = toJS(stores.ProductStore);

  const {
    handleAddBatchModalOpen,
    handleBatchModalClose,
    addBatchData,
    updateBatchData,
    setBatchProperty,
    setBatchVendor,
    setBatchVendorName,
    setBatchPurchaseDiscountAmount,
    setBatchPurchaseDiscountPercent,
    setBatchSaleDiscountAmount,
    setBatchSaleDiscountPercent,
    addSingleBatchData
  } = stores.ProductStore;

  const [vendorNameWhileEditing, setVendorNameWhileEditing] = useState('');
  const { handleVendorModalOpen } = stores.VendorStore;
  const { vendorDialogOpen } = toJS(stores.VendorStore);
  const [openNoDataAlert, setNoDataAlert] = React.useState(false);
  const [openCustomData, setCustomData] = React.useState(false);
  const [openCustomTitle, setOpenCustomTitle] = React.useState(false);
  const [noDataString, setNoDataString] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [isRestaurant, setIsRestaurants] = React.useState(false);
  const { getTransactionData } = stores.TransactionStore;
  const { transaction } = toJS(stores.TransactionStore);

  const [warehouseList, setWarehouseList] = React.useState([]);
  const [propertiesList, setPropertiesList] = React.useState([]);
  const [selectedProps, setSelectedProps] = useState([]);
  const [customName, setCustomName] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [loader, setLoader] = useState(false);

  const { getWarehouse } = stores.WarehouseStore;
  const API_SERVER = window.REACT_APP_API_SERVER;

  const menuTypeList = ['AC', 'Non-AC', 'Self Service'];

  const handleAddVendor = () => {
    handleVendorModalOpen();
  };

  const handleNoDataAlertClose = () => {
    setNoDataAlert(false);
  };

  const handleLoaderAlertClose = () => {
    setLoader(false);
  };

  useEffect(() => {
    if (
      productAddBatchDialogOpen === true &&
      singleBatchData &&
      singleBatchData.batchNumber === ''
    ) {
      if (
        String(localStorage.getItem('isHotelOrRestaurant')).toLowerCase() ===
        'true'
      ) {
        setBatchProperty('batchNumber', menuTypeList[0]);
      }
    }
  }, [productAddBatchDialogOpen, menuTypeList]);

  const batchNumberExists = () => {

    let result = productDetail.batchData
      .find((e) => (e.batchNumber === singleBatchData.batchNumber && e.id !== singleBatchData.id));

    return result ? true : false;
  }

  const saveDataClick = () => {
    if (
      selectedValues &&
      selectedValues.length === 0 &&
      singleBatchData.batchNumber === ''
    ) {
      setNoDataString('Batch Number cannot be left blank.');
      setNoDataAlert(true);
    } else if (batchNumberExists() === true) {
      setNoDataString('Batch Number already exists');
      setNoDataAlert(true);
    } else {
      setVendorNameWhileEditing('');

      if (singleBatchData.offerPrice === '') {
        setBatchProperty('offerPrice', 0);
      }

      if (singleBatchData.openingStockQty === '') {
        setBatchProperty('openingStockQty', 0);
      }

      if (isBatchUpdate) {
        updateBatchData(true);
      } else {
        if (selectedValues.length > 0) {
          setLoader(true);
          onCreateProperties();
        } else {
          addSingleBatchData(true);
        }
      }
    }
  };

  const getVendorList = async (value) => {
    setVendorList(await getVendorAutoCompleteList(value));
  };

  const handleVendorClick = (vendor) => {
    setBatchVendorName(vendor.name);
    setBatchVendor(vendor);
    setVendorNameWhileEditing('');
    setVendorList([]);
  };

  useEffect(() => {
    async function fetchData() {
      setWarehouseList(await getWarehouse());
    }

    fetchData();
  }, []);

  useEffect(() => {
    setVendorList([]);
  }, []);

  useEffect(() => {
    async function fetchData() {
      getTransactionData();
    }

    fetchData();
  }, []);

  const [columnDefs] = useState([
    {
      headerName: 'Batch No.',
      field: 'batchNumber',
      suppressNavigable: true,
      cellClass: 'no-border',
      resizable: true,
      width: '100px',
      filter: 'agTextColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>BATCH</p>
            <p>NO</p>
          </div>
        );
      }
    },
    {
      headerName: 'Sale Price',
      field: 'salePrice',
      resizable: true,
      width: '100px',
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>SALE</p>
            <p>PRICE</p>
          </div>
        );
      }
    },
    {
      headerName: 'QTY',
      field: 'qty',
      resizable: true,
      width: '100px',
      cellClass: 'no-border',
      filter: false
    },
    {
      headerName: 'Opening Stock',
      field: 'openingStockQty',
      resizable: true,
      width: '100px',
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>OPENING</p>
            <p>STOCK</p>
          </div>
        );
      }
    },
    {
      headerName: 'Free Stock',
      field: 'freeQty',
      resizable: true,
      width: '100px',
      cellClass: 'no-border',
      filter: 'agNumberColumnFilter',
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true
      },
      headerComponentFramework: (props) => {
        return (
          <div>
            <p>FREE</p>
            <p>STOCK</p>
          </div>
        );
      }
    },
    {
      headerName: '',
      field: '',
      suppressMenu: true,
      sortable: false,
      cellRenderer: 'templateActionRenderer',
      cellRendererParams: {
        clicked: function (field) {
          alert(`${field} was clicked`);
        }
      }
    }
  ]);

  const TemplateActionRenderer = (props) => {
    return (
      <Moreoptions
        menu={moreoption.moreoptionsdata}
        item={props['data']}
        id={props['data']['id']}
        component="batchList"
      />
    );
  };

  const [defaultColDef] = useState({
    sortable: true,
    resizable: true,
    width: '100px',
    filter: true,
    rowHeight: 10,
    headerHeight: 30,
    suppressMenuHide: true,
    menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab'],
    icons: {
      menu: '<i class="fas fa-filter fa-fw" />'
    }
  });

  useEffect(() => {
    if (localStorage.getItem('isHotelOrRestaurant')) {
      let isHotelOrRestaurant = localStorage.getItem('isHotelOrRestaurant');
      if (String(isHotelOrRestaurant).toLowerCase() === 'true') {
        setIsRestaurants(true);
      }
    }
    getProductDefaultProperties();
  }, []);

  const handleCustomDataClose = () => {
    setCustomData(false);
  };
  const handleCustomTitleClose = () => {
    setOpenCustomTitle(false);
  };
  const handleCustomOpen = (value) => {
    setCustomData(true);
    setSelectedProperty(value);
  };
  const handleCustomTitleOpen = () => {
    setOpenCustomTitle(true);
  };

  const handleChangeProperty = (event) => {
    const selectedProp = event.target.value;
    if (!selectedProps.includes(selectedProp)) {
      setSelectedProps([...selectedProps, selectedProp]);
    }
  };

  const addCustomProperty = (propTitle, value) => {
    const updatedOptions = propertiesList.map((option) => {
      if (option.title === propTitle) {
        return {
          ...option,
          values: [...option.values, value]
        };
      }
      return option;
    });
    setPropertiesList(updatedOptions);
    handleCustomDataClose();
    setSelectedProperty('');
    setCustomName('');
  };

  const addCustomPropertyTitle = (value) => {
    const newObject = {
      title: value,
      values: []
    };
    setPropertiesList((prevList) => [...prevList, newObject]);
    if (!selectedProps.includes(value)) {
      setSelectedProps([...selectedProps, value]);
    }
    setOpenCustomTitle(false);
    setCustomTitle('');
  };

  const deleteAllProperty = () => {
    setSelectedProps([]);
    setSelectedValues([]);
  };

  const removeSelectedProperty = (item) => {
    const indexToRemove = selectedProps.indexOf(item);
    if (indexToRemove !== -1) {
      selectedProps.splice(indexToRemove, 1);
      setSelectedProps([...selectedProps]);
    }
  };

  const handleCheckboxChange = (title, value) => {
    const updatedSelectedValues = [...selectedValues];
    const titleIndex = updatedSelectedValues.findIndex(
      (item) => item.title === title
    );
    if (titleIndex === -1) {
      updatedSelectedValues.push({ title, values: [value] });
    } else {
      updatedSelectedValues[titleIndex].values = updatedSelectedValues[
        titleIndex
      ].values.includes(value)
        ? updatedSelectedValues[titleIndex].values.filter((v) => v !== value)
        : [...updatedSelectedValues[titleIndex].values, value];
    }

    setSelectedValues(updatedSelectedValues);
  };

  const getProductDefaultProperties = async () => {
    await axios
      .get(`${API_SERVER}/v1/web/business/products/getProductDefaultProperties`)
      .then(async (response) => {
        console.log('response', response);
        if (response.data) {
          setPropertiesList(response.data);
        }

        if (isBatchUpdate) {
          singleBatchData.properties.forEach((element) => {
            if (!selectedProps.includes(element.title)) {
              setSelectedProps([...selectedProps, element.title]);
            }
          });
        }
      })
      .catch((err) => {
        throw err;
      });
  };
  const onCreateProperties = async () => {
    let reqData = {};

    reqData = {
      properties: selectedValues,
      purchasedPrice: singleBatchData.purchasedPrice,
      salePrice: singleBatchData.salePrice,
      offerPrice: singleBatchData.offerPrice,
      mfDate: singleBatchData.mfDate,
      expiryDate: singleBatchData.expiryDate,
      rack: singleBatchData.rack,
      warehouseData: singleBatchData.warehouseData,
      vendorName: singleBatchData.vendorName,
      finalMRPPrice: singleBatchData.finalMRPPrice,
      freeQty: singleBatchData.freeQty,
      openingStockQty: singleBatchData.openingStockQty,
      saleDiscountAmount: singleBatchData.saleDiscountAmount,
      saleDiscountPercent: singleBatchData.saleDiscountPercent,
      saleDiscountType: singleBatchData.saleDiscountType,
      purchaseDiscountAmount: singleBatchData.purchaseDiscountAmount,
      purchaseDiscountPercent: singleBatchData.purchaseDiscountPercent,
      purchaseDiscountType: singleBatchData.purchaseDiscountType,
      manufacturingQty: singleBatchData.manufacturingQty,
      freeManufacturingQty: singleBatchData.freeManufacturingQty,
      barcode: singleBatchData.barcode,
      modelNo: singleBatchData.modelNo
    };

    await axios
      .post(
        `${API_SERVER}/v1/web/pos/business/products/getBatchCartesianProducts`,
        reqData
      )
      .then(async (response) => {
        console.log('response', response);
        if (response.data) {
          const resp = response.data;
          resp.forEach((element) => {
            addBatchData(
              false,
              element.properties,
              element.batchNumber,
              element.id
            );
          });
          setSelectedProps([]);
          setSelectedValues([]);
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        throw err;
      });
  };
  const handleBatchModalTriggerClose = () => {
    setSelectedProps([]);
    setSelectedValues([]);
    handleBatchModalClose();
  };

  return (
    <div>
      <Controls.Button
        text="Add Batch"
        size="small"
        variant="contained"
        color="secondary"
        className={classes.addBatchButton}
        onClick={() => handleAddBatchModalOpen()}
      />

      <Dialog
        open={productAddBatchDialogOpen}
        fullWidth={true}
        maxWidth={'lg'}
        onClose={handleBatchModalTriggerClose}
      >
        <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
          Add Batch
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleBatchModalTriggerClose}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid fluid className="app-main">
            <Col
              className={classes.leftCol}
              xs={12}
              sm={12}
              style={{ borderRight: '1px solid #d4d4d4' }}
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'row'
                }}
              ></div>
              <div
                /* style={{ height: height - 50 }} */
                className={classes.leftpanelscroll}
              >
                <Grid container justify="center">
                  {isBatchUpdate && (
                    <div>
                      {singleBatchData.properties.length > 0 && (
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            marginBottom: '20px',
                            flexDirection: 'row'
                          }}
                        >
                          {singleBatchData.properties.map((batchData) => (
                            <Typography className={classes.w_30} variant="h6">
                              {batchData.title} : {batchData.value}
                            </Typography>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {!isBatchUpdate && (
                    <div>
                      <div
                        style={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'row'
                        }}
                      >
                        <FormControl fullWidth className={classes.marginBtmSet}>
                          <Typography variant="h6">Choose Property</Typography>
                          <Select
                            fullWidth
                            variant="outlined"
                            margin="dense"
                            style={{ marginTop: '8px', marginBottom: '4px' }}
                            className="customTextField"
                            onChange={handleChangeProperty}
                          >
                            {propertiesList.map((option) => (
                              <MenuItem key={option.title} value={option.title}>
                                {option.title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl fullWidth className={classes.marginBtmSet}>
                          <Controls.Button
                            text="Add Custom"
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={handleCustomTitleOpen}
                            className={`${classes.addBatchButton} ${classes.prop_button}`}
                          />
                        </FormControl>
                        <FormControl fullWidth className={classes.marginBtmSet}>
                          <Controls.Button
                            text="Delete All"
                            size="small"
                            variant="contained"
                            color="secondary"
                            onClick={deleteAllProperty}
                            className={classes.prop_button}
                          />
                        </FormControl>
                      </div>
                      {selectedProps.map((selectedProp, index) => (
                        <div className={classes.prop_box}>
                          <div className={classes.w_80}>
                            <Typography
                              variant="subtitle1"
                              className={classes.fntClr}
                            >
                              <b>{selectedProp}</b>
                            </Typography>
                          </div>
                          <div className={classes.w_15}>
                            <Typography
                              variant="subtitle1"
                              onClick={() => handleCustomOpen(selectedProp)}
                              style={{ color: '#ef5350', cursor: 'pointer' }}
                              className={classes.fntClr}
                            >
                              Add {selectedProp}
                            </Typography>
                          </div>
                          <div className={classes.w_5}>
                            <IconButton
                              aria-label="close"
                              className="closeButton"
                              style={{ top: '4px' }}
                              onClick={() =>
                                removeSelectedProperty(selectedProp)
                              }
                            >
                              <CancelRoundedIcon />
                            </IconButton>
                          </div>
                          <div key={index}>
                            {propertiesList
                              .find((option) => option.title === selectedProp)
                              ?.values.map((value) => (
                                <div key={value} className={classes.w_25}>
                                  <FormGroup row>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          name={value}
                                          onChange={() =>
                                            handleCheckboxChange(
                                              selectedProp,
                                              value
                                            )
                                          }
                                          checked={
                                            (
                                              selectedValues.find(
                                                (item) =>
                                                  item.title === selectedProp
                                              )?.values || []
                                            ).includes(value) || false
                                          }
                                        />
                                      }
                                      label={value}
                                    />
                                  </FormGroup>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <FormControl fullWidth className={classes.marginBtmSet}>
                      <Typography variant="h6">Vendor</Typography>
                      <div>
                        <TextField
                          fullWidth
                          id="vendor"
                          type="text"
                          variant="outlined"
                          margin="dense"
                          value={
                            singleBatchData.vendorName === ''
                              ? vendorNameWhileEditing
                              : singleBatchData.vendorName
                          }
                          onChange={(e) => {
                            if (e.target.value !== vendorNameWhileEditing) {
                              setBatchVendorName('');
                            }
                            getVendorList(e.target.value);
                            setVendorNameWhileEditing(e.target.value);
                          }}
                        />
                        {vendorList && vendorList.length > 0 ? (
                          <>
                            <ul
                              className={classes.listbox}
                              style={{ width: '100%' }}
                            >
                              <li>
                                <Grid container justify="space-between">
                                  {transaction.enableVendor && (
                                    <Grid item>
                                      <Button
                                        size="small"
                                        style={{
                                          position: 'relative',
                                          fontSize: 12
                                        }}
                                        color="secondary"
                                        onClick={handleAddVendor}
                                      >
                                        + Add Vendor
                                      </Button>
                                    </Grid>
                                  )}
                                  {vendorList.length == 1 &&
                                  vendorList[0].name == '' ? (
                                    <Grid item></Grid>
                                  ) : (
                                    <Grid item>
                                      <Button
                                        size="small"
                                        style={{
                                          position: 'relative',
                                          fontSize: 12
                                        }}
                                      >
                                        Balance
                                      </Button>
                                    </Grid>
                                  )}
                                </Grid>
                              </li>
                              {vendorList.length === 1 &&
                              vendorList[0].name === '' ? (
                                <li></li>
                              ) : (
                                <div>
                                  {vendorList.map((option, index) => (
                                    <li
                                      key={`${index}vendor`}
                                      style={{ padding: 10, cursor: 'pointer' }}
                                      onClick={() => {
                                        handleVendorClick(option);
                                      }}
                                    >
                                      <Grid container justify="space-between">
                                        <Grid item>{option.name}</Grid>
                                        <Grid item>
                                          {' '}
                                          <span>
                                            {parseFloat(option.balance).toFixed(
                                              2
                                            )}
                                          </span>
                                          {option.balance > 0 ? (
                                            option.balanceType === 'Payable' ? (
                                              <Arrowtopright fontSize="inherit" />
                                            ) : (
                                              <Arrowbottomleft fontSize="inherit" />
                                            )
                                          ) : (
                                            ''
                                          )}
                                        </Grid>
                                      </Grid>
                                    </li>
                                  ))}
                                </div>
                              )}
                            </ul>
                          </>
                        ) : null}
                        <VendorModal open={vendorDialogOpen} />
                      </div>
                    </FormControl>
                    <FormControl
                      fullWidth
                      style={{ marginLeft: '16px' }}
                      className={classes.marginBtmSet}
                    >
                      <Typography variant="h6">
                        {String(
                          localStorage.getItem('isHotelOrRestaurant')
                        ).toLowerCase() === 'true'
                          ? 'Menu Type'
                          : 'Batch Number'}
                      </Typography>
                      {String(
                        localStorage.getItem('isHotelOrRestaurant')
                      ).toLowerCase() === 'true' ? (
                        <>
                          <Select
                            displayEmpty
                            className={classes.fntClr}
                            style={{ marginTop: '8px' }}
                            value={singleBatchData.batchNumber}
                            input={
                              <OutlinedInput
                                style={{ width: '100%', height: '80%' }}
                              />
                            }
                            onChange={(e) => {
                              setBatchProperty('batchNumber', e.target.value);
                            }}
                          >
                            {menuTypeList &&
                              menuTypeList.map((option, index) => (
                                <MenuItem value={option}>{option}</MenuItem>
                              ))}
                          </Select>
                        </>
                      ) : (
                        <TextField
                          id="batchNumber"
                          type="text"
                          variant="outlined"
                          margin="dense"
                          disabled={selectedProps.length > 0 ? true : false}
                          value={selectedProps.length > 0 ? 'Auto Generate' : singleBatchData.batchNumber}
                          onChange={(event) =>
                            setBatchProperty('batchNumber', event.target.value)
                          }
                        />
                      )}
                    </FormControl>

                    <FormControl
                      fullWidth
                      className={classes.marginBtmSet}
                      style={{ marginLeft: '16px' }}
                    >
                      <Typography variant="h6">MRP</Typography>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        type="number"
                        className={clsx(classes.inputNumber, classes.fntClr)}
                        onWheel={(e) => e.target.blur()}
                        value={singleBatchData.finalMRPPrice}
                        onFocus={(e) =>
                          singleBatchData.finalMRPPrice === 0
                            ? setBatchProperty('finalMRPPrice', '')
                            : ''
                        }
                        onChange={(event) => {
                          if (event.target.value !== '') {
                            setBatchProperty(
                              'finalMRPPrice',
                              parseFloat(event.target.value)
                            );
                          } else {
                            setBatchProperty('finalMRPPrice', '');
                          }
                        }}
                      />
                    </FormControl>
                  </div>
                  {/* <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    
                  </div> */}
                  {/* Purchase Details */}
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <FormControl fullWidth className={classes.marginBtmSet}>
                      <Typography variant="h6">Purchase Price</Typography>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        type="number"
                        className={clsx(classes.inputNumber, classes.fntClr)}
                        onWheel={(e) => e.target.blur()}
                        value={singleBatchData.purchasedPrice}
                        onFocus={(e) =>
                          singleBatchData.purchasedPrice === 0
                            ? setBatchProperty('purchasedPrice', '')
                            : ''
                        }
                        onChange={(event) => {
                          if (event.target.value !== '') {
                            setBatchProperty(
                              'purchasedPrice',
                              parseFloat(event.target.value)
                            );
                          } else {
                            setBatchProperty('purchasedPrice', '');
                          }
                        }}
                      />
                    </FormControl>

                    <FormControl
                      fullWidth
                      className={classes.marginBtmSet}
                      style={{ marginLeft: '16px' }}
                    >
                      <Typography variant="h6">
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
                            className={clsx(
                              classes.inputNumber,
                              classes.fntClr
                            )}
                            onWheel={(e) => e.target.blur()}
                            value={singleBatchData.purchaseDiscountAmount}
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
                              singleBatchData.purchaseDiscountAmount === 0
                                ? setBatchPurchaseDiscountAmount('')
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value !== '') {
                                setBatchPurchaseDiscountAmount(
                                  parseFloat(e.target.value)
                                );
                              } else {
                                setBatchPurchaseDiscountAmount('');
                              }
                            }}
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
                            className={clsx(
                              classes.inputNumber,
                              classes.fntClr
                            )}
                            onWheel={(e) => e.target.blur()}
                            value={singleBatchData.purchaseDiscountPercent}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment style={{ marginRight: '0px' }}>
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
                              singleBatchData.purchaseDiscountPercent === 0
                                ? setBatchPurchaseDiscountPercent('')
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value !== '') {
                                setBatchPurchaseDiscountPercent(
                                  parseFloat(e.target.value)
                                );
                              } else {
                                setBatchPurchaseDiscountPercent('');
                              }
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </div>

                  {/* Sale Details */}
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <FormControl fullWidth className={classes.marginBtmSet}>
                      <Typography variant="h6">Sale Price</Typography>
                      <TextField
                        id="salePrice"
                        type="number"
                        variant="outlined"
                        margin="dense"
                        className={clsx(classes.inputNumber, classes.fntClr)}
                        onWheel={(e) => e.target.blur()}
                        value={singleBatchData.salePrice}
                        onFocus={(e) =>
                          singleBatchData.salePrice === 0
                            ? setBatchProperty('salePrice', '')
                            : ''
                        }
                        onChange={(event) => {
                          if (event.target.value !== '') {
                            setBatchProperty(
                              'salePrice',
                              parseFloat(event.target.value)
                            );
                          } else {
                            setBatchProperty('salePrice', '');
                          }
                        }}
                      />
                    </FormControl>

                    <FormControl
                      fullWidth
                      className={classes.marginBtmSet}
                      style={{ marginLeft: '16px' }}
                    >
                      <Typography variant="h6">Discount for Sales</Typography>
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
                            value={singleBatchData.saleDiscountAmount}
                            type="number"
                            className={clsx(
                              classes.inputNumber,
                              classes.fntClr
                            )}
                            onWheel={(e) => e.target.blur()}
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
                              singleBatchData.saleDiscountAmount === 0
                                ? setBatchSaleDiscountAmount('')
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value !== '') {
                                setBatchSaleDiscountAmount(
                                  parseFloat(e.target.value)
                                );
                              } else {
                                setBatchSaleDiscountAmount('');
                              }
                            }}
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
                            value={singleBatchData.saleDiscountPercent}
                            type="number"
                            className={clsx(
                              classes.inputNumber,
                              classes.fntClr
                            )}
                            onWheel={(e) => e.target.blur()}
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
                              singleBatchData.saleDiscountPercent === 0
                                ? setBatchSaleDiscountPercent('')
                                : ''
                            }
                            onChange={(e) => {
                              if (e.target.value !== '') {
                                setBatchSaleDiscountPercent(
                                  parseFloat(e.target.value)
                                );
                              } else {
                                setBatchSaleDiscountPercent('');
                              }
                            }}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <FormControl fullWidth className={classes.marginBtmSet}>
                      <Typography variant="h6">Opening Stock</Typography>
                      <TextField
                        type="number"
                        variant="outlined"
                        margin="dense"
                        className={clsx(classes.inputNumber, classes.fntClr)}
                        onWheel={(e) => e.target.blur()}
                        value={singleBatchData.openingStockQty}
                        onFocus={(e) =>
                          singleBatchData.openingStockQty === 0
                            ? setBatchProperty('openingStockQty', '')
                            : ''
                        }
                        onChange={(event) => {
                          if (event.target.value !== '') {
                            setBatchProperty(
                              'openingStockQty',
                              parseFloat(event.target.value)
                            );
                          } else {
                            setBatchProperty('openingStockQty', '');
                          }
                        }}
                      />
                    </FormControl>

                    <FormControl
                      fullWidth
                      className={classes.marginBtmSet}
                      style={{ marginLeft: '16px' }}
                    >
                      <Typography variant="h6">Free Stock</Typography>
                      <TextField
                        type="number"
                        variant="outlined"
                        margin="dense"
                        className={clsx(classes.inputNumber, classes.fntClr)}
                        onWheel={(e) => e.target.blur()}
                        value={singleBatchData.freeQty}
                        onFocus={(e) =>
                          singleBatchData.freeQty === 0
                            ? setBatchProperty('freeQty', '')
                            : ''
                        }
                        onChange={(event) => {
                          if (event.target.value !== '') {
                            setBatchProperty(
                              'freeQty',
                              parseFloat(event.target.value)
                            );
                          } else {
                            setBatchProperty('freeQty', '');
                          }
                        }}
                      />
                    </FormControl>
                    <FormControl
                      style={{ marginLeft: '16px' }}
                      fullWidth
                      className={classes.marginBtmSet}
                    >
                      <Typography variant="h6">Manufacturing Date</Typography>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        type="date"
                        value={singleBatchData.mfDate}
                        onChange={(event) =>
                          setBatchProperty('mfDate', event.target.value)
                        }
                      />
                    </FormControl>

                    <FormControl
                      fullWidth
                      className={classes.marginBtmSet}
                      style={{ marginLeft: '16px' }}
                    >
                      <Typography variant="h6">Expiry Date</Typography>
                      <TextField
                        type="date"
                        variant="outlined"
                        margin="dense"
                        value={singleBatchData.expiryDate}
                        onChange={(event) =>
                          setBatchProperty('expiryDate', event.target.value)
                        }
                      />
                    </FormControl>
                  </div>

                  {/* <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    
                  </div> */}

                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <FormControl fullWidth className={classes.marginBtmSet}>
                      <Typography variant="h6">Warehouse Details</Typography>
                      <Select
                        displayEmpty
                        className={classes.fntClr}
                        style={{ marginTop: '8px' }}
                        value={
                          singleBatchData.warehouseData
                            ? singleBatchData.warehouseData
                            : 'Select'
                        }
                        input={
                          <OutlinedInput
                            style={{ width: '100%', height: '80%' }}
                          />
                        }
                        onChange={async (e) => {
                          if (e.target.value !== 'Select') {
                            setBatchProperty('warehouseData', e.target.value);
                          } else {
                            setBatchProperty('warehouseData', '');
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

                    <FormControl
                      fullWidth
                      className={classes.marginBtmSet}
                      style={{ marginLeft: '16px' }}
                    >
                      <Typography variant="h6">Rack Number</Typography>
                      <TextField
                        id="rackNumber"
                        type="number"
                        variant="outlined"
                        margin="dense"
                        value={singleBatchData.rack}
                        onChange={(event) =>
                          setBatchProperty('rack', event.target.value)
                        }
                      />
                    </FormControl>
                    <FormControl
                      style={{ marginLeft: '16px' }}
                      fullWidth
                      className={classes.marginBtmSet}
                    >
                      <Typography variant="h6">Barcode</Typography>
                      <TextField
                        id="barcode"
                        variant="outlined"
                        margin="dense"
                        disabled={
                          productTxnSettingsData.autoGenerateBarcode
                            ? true
                            : false
                        }
                        value={
                          productTxnSettingsData.autoGenerateBarcode &&
                          singleBatchData.barcode === ''
                            ? 'Auto Generated'
                            : singleBatchData.barcode
                        }
                        onChange={(event) =>
                          setBatchProperty('barcode', event.target.value)
                        }
                      />
                    </FormControl>

                    <FormControl
                      fullWidth
                      className={classes.marginBtmSet}
                      style={{ marginLeft: '16px' }}
                    >
                      <Typography variant="h6">Model No</Typography>
                      <TextField
                        id="modelNo"
                        variant="outlined"
                        margin="dense"
                        value={singleBatchData.modelNo}
                        onChange={(event) =>
                          setBatchProperty('modelNo', event.target.value)
                        }
                      />
                    </FormControl>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'row'
                    }}
                  >
                    <div>
                      {!isBatchUpdate ? (
                        <Button
                          variant="outlined"
                          className={classes.createNewBtn}
                          onClick={() => {
                            saveDataClick();
                          }}
                        >
                          Create New
                        </Button>
                      ) : (
                        <Button
                          variant="outlined"
                          className={classes.createNewBtn}
                          onClick={() => {
                            saveDataClick();
                          }}
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  </div>
                </Grid>
              </div>
            </Col>
          </Grid>
          {/* {!isBatchUpdate && productDetail.batchData.length > 0 &&<Grid fluid className="app-main">
            <Col className={classes.contentCol} xs sm={12}>
              <Typography variant="h4">List of Batch Items</Typography>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="stretch"
                className={classes.marginTopFormGroup}
              >
                <Grid item xs={12} className="grid-padding">
                  <div
                    style={{ height: '78vh', width: '100%' }}
                    className="ag-theme-material"
                  >
                    <AgGridReact
                      onGridReady={onGridReady}
                      enableRangeSelection
                      paginationPageSize={17}
                      suppressMenuHide
                      rowData={productDetail.batchData}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      pagination
                      rowSelection="single"
                      headerHeight={40}
                      className={classes.agGridclass}
                      style={{ width: '100%', height: '100%;' }}
                      frameworkComponents={{
                        templateActionRenderer: TemplateActionRenderer
                      }}
                    />
                  </div>
                  <table style={{display:'none'}} className={`${classes.batchTable}`}>
                    <thead>
                      <tr>
                        {
                        singleBatchData.properties.length > 0 &&
                        singleBatchData.properties.map((option) => (
                          <th
                            className={`${classes.headstyle} ${classes.rowstyle}`}
                            key={option.title}
                          >
                            {option.title}
                          </th>
                        ))}
                        <th
                          className={`${classes.headstyle} ${classes.rowstyle}`}
                        >
                          Batch No
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
                          {
                          singleBatchData.properties.length > 0 &&
                          batchData.properties.map((data) => (
                            <td
                              className={`${classes.rowstyle}`}
                              key={data.value}
                            >
                              {data.value}
                            </td>
                          ))}
                          <td className={`${classes.rowstyle}`}>
                            {batchData.batchNumber}
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
              </Grid>
            </Col>
          </Grid>} */}
        </DialogContent>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={openNoDataAlert}
        onClose={handleNoDataAlertClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>{noDataString}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNoDataAlertClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={openCustomData}
        onClose={handleCustomDataClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
          Add Custom Value
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleCustomDataClose}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth className={classes.marginBtmSet}>
            <Typography variant="h6">Name*</Typography>
            <TextField
              id="modelNo"
              variant="outlined"
              autoFocus
              value={customName}
              error={customName === '' ? true : false}
              helperText={customName === '' ? 'Name cannot be left blank' : ''}
              margin="dense"
              onChange={(event) => setCustomName(event.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={customName === '' ? true : false}
            onClick={(e) => addCustomProperty(selectedProperty, customName)}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={openCustomTitle}
        onClose={handleCustomTitleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="product-modal-title" style={{ textAlign: 'center' }}>
          Add Custom Title
          <IconButton
            aria-label="close"
            className="closeButton"
            onClick={handleCustomTitleClose}
          >
            <CancelRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth className={classes.marginBtmSet}>
            <Typography variant="h6">Name*</Typography>
            <TextField
              id="modelNo"
              variant="outlined"
              autoFocus
              value={customTitle}
              error={customTitle === '' ? true : false}
              helperText={customTitle === '' ? 'Name cannot be left blank' : ''}
              margin="dense"
              onChange={(event) => setCustomTitle(event.target.value)}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={customTitle === '' ? true : false}
            onClick={(e) => addCustomPropertyTitle(customTitle)}
            color="primary"
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullScreen={fullScreen}
        open={loader}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogContent>
          <DialogContentText>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ textAlign: 'center' }}>
                <p>Please wait while the batches are being created!!!</p>
              </div>
              <div>
                <br />
                <Loader type="bubble-top" bgColor={'#EF524F'} size={50} />
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default injectWithObserver(BatchModal);